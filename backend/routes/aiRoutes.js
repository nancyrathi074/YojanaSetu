
import express from "express";
import Groq from "groq-sdk";
import Scheme from "../models/Scheme.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is not configured."
      });
    }

    const userMessage = message.trim().toLowerCase();

    // Initialize Groq securely on the backend
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // 1. Extract age
    const ageMatch = userMessage.match(
      /(\d{1,2})\s*(?:year|years|yr|yrs)?\s*old/
    );

    const age = ageMatch
      ? Number(ageMatch[1])
      : null;

    // 2. Extract annual income
    let income = null;

    const lakhMatch = userMessage.match(
      /(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)/
    );

    if (lakhMatch) {
      income = Number(lakhMatch[1]) * 100000;
    }

    const incomeNumberMatch = userMessage.match(
      /(?:₹|rs\.?|inr)\s*([\d,]+)/
    );

    if (incomeNumberMatch && income === null) {
      income = Number(
        incomeNumberMatch[1].replace(/,/g, "")
      );
    }

    // 3. Detect occupation
    let occupation = null;

    if (
      userMessage.includes("student") ||
      userMessage.includes("studying")
    ) {
      occupation = "Student";
    } else if (
      userMessage.includes("job seeker") ||
      userMessage.includes("jobseeker") ||
      userMessage.includes("looking for a job")
    ) {
      occupation = "Job Seeker";
    }

    // 4. Find candidate schemes in MongoDB
    const filters = [];

    if (age !== null) {
      filters.push({
        minAge: { $lte: age },
        maxAge: { $gte: age }
      });
    }

    if (income !== null) {
      filters.push({
        maxIncome: { $gte: income }
      });
    }

    if (occupation !== null) {
      filters.push({
        occupation: {
          $regex: new RegExp(
            `^${occupation}$`,
            "i"
          )
        }
      });
    }

    const fields =
      "name category description benefits occupation maxIncome minAge maxAge documents link";

    let schemes;

    if (filters.length > 0) {
      schemes = await Scheme.find({
        $and: filters
      })
        .select(fields)
        .lean();
    } else {
      schemes = await Scheme.find({})
        .select(fields)
        .limit(10)
        .lean();
    }

    // 5. Calculate rule-based match scores
    const stopWords = [
      "i", "am", "a", "an", "the", "is", "are",
      "my", "me", "for", "to", "of", "and", "with",
      "which", "what", "can", "could", "would", "be",
      "in", "on", "government", "scheme", "schemes",
      "suitable", "apply"
    ];

    const keywords = userMessage
      .replace(/[₹,.!?]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          !stopWords.includes(word)
      );

    const scoredSchemes = schemes.map((scheme) => {
      let score = 0;
      const reasons = [];

      // Age match: 25 points
      if (age !== null) {
        if (
          age >= scheme.minAge &&
          age <= scheme.maxAge
        ) {
          score += 25;
          reasons.push(
            "Your age matches the scheme."
          );
        }
      }

      // Occupation match: 30 points
      if (occupation !== null) {
        if (
          scheme.occupation?.toLowerCase() ===
          occupation.toLowerCase()
        ) {
          score += 30;
          reasons.push(
            "Your occupation matches the scheme."
          );
        }
      }

      // Income match: 25 points
      if (income !== null) {
        if (income <= scheme.maxIncome) {
          score += 25;
          reasons.push(
            "Your income is within the scheme limit."
          );
        }
      }

      // Question relevance: up to 20 points
      const schemeText = `
        ${scheme.name}
        ${scheme.category}
        ${scheme.description}
        ${scheme.benefits}
        ${scheme.occupation}
      `.toLowerCase();

      const uniqueMatches = [
        ...new Set(
          keywords.filter((keyword) =>
            schemeText.includes(keyword)
          )
        )
      ];

      if (uniqueMatches.length > 0) {
        score += Math.min(
          20,
          uniqueMatches.length * 5
        );

        reasons.push(
          "The scheme is relevant to your question."
        );
      }

      return {
        ...scheme,
        score,
        matchReasons: reasons
      };
    });

    scoredSchemes.sort(
      (a, b) => b.score - a.score
    );

    const recommendations = scoredSchemes
      .filter((scheme) => scheme.score > 0)
      .slice(0, 5);

    // 6. Ask Groq to explain the recommendations
    const schemeContext = recommendations
      .map(
        (scheme, index) => `
Scheme ${index + 1}
Name: ${scheme.name}
Category: ${scheme.category}
Benefits: ${scheme.benefits}
Match Score: ${scheme.score}%
Reasons: ${scheme.matchReasons.join(" ")}
`
      )
      .join("\n");

    let aiMessage;

    if (recommendations.length === 0) {
      aiMessage =
        "I couldn't find matching schemes in the current database. Try including your age, occupation, annual income, or the type of assistance you need.";
    } else {
      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `
You are YojanaSetu AI, a helpful government
scheme assistant.

The backend calculates all match scores.
Never change or recalculate these scores.
Use only the schemes supplied in the context.
Never invent eligibility rules, benefits, or schemes.
Explain briefly why these recommendations may help.
Clearly state that final eligibility must be verified
on the official government scheme website.
Keep the answer under 100 words.
`
            },
            {
              role: "user",
              content: `
User question:
${message.trim()}

Database recommendations:
${schemeContext}

Write a short, helpful introduction to these results.
`
            }
          ],
          temperature: 0.2,
          max_completion_tokens: 180
        });

      aiMessage =
        completion.choices[0]?.message?.content?.trim() ||
        "Here are the schemes that may match your information. Please verify eligibility on the official websites.";
    }

    // 7. Return results to the React frontend
    return res.status(200).json({
      success: true,
      aiMessage,
      recommendations,
      userInfo: {
        age,
        income,
        occupation
      }
    });
  } catch (error) {
    console.error(
      "YojanaSetu AI Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate an AI response. Please try again."
    });
  }
});

export default router;
