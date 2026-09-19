import express from "express";
import Scheme from "../models/Scheme.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });
    }

    const userMessage = message.toLowerCase();

    // -----------------------------------------
    // Extract AGE
    // -----------------------------------------

    const ageMatch = userMessage.match(
      /(\d{1,2})\s*(?:year|years|yr|yrs)?\s*old/
    );

    const age = ageMatch ? Number(ageMatch[1]) : null;

    // -----------------------------------------
    // Extract INCOME
    // -----------------------------------------

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

    if (incomeNumberMatch && !income) {
      income = Number(
        incomeNumberMatch[1].replace(/,/g, "")
      );
    }

    // -----------------------------------------
    // Detect OCCUPATION
    // -----------------------------------------

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

    // -----------------------------------------
    // Find candidate schemes
    // -----------------------------------------

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
          $regex: new RegExp(`^${occupation}$`, "i")
        }
      });
    }

    let schemes;

    if (filters.length > 0) {
      schemes = await Scheme.find({
        $and: filters
      })
        .select(
          "name category description benefits occupation maxIncome minAge maxAge documents link"
        )
        .lean();
    } else {
      schemes = await Scheme.find({})
        .select(
          "name category description benefits occupation maxIncome minAge maxAge documents link"
        )
        .limit(10)
        .lean();
    }

    // -----------------------------------------
    // Calculate Match Score
    // -----------------------------------------

    const scoredSchemes = schemes.map((scheme) => {
      let score = 0;
      let matchedCriteria = 0;
      let totalCriteria = 0;

      const reasons = [];

      // Age = 30 points
      if (age !== null) {
        totalCriteria += 30;

        if (
          age >= scheme.minAge &&
          age <= scheme.maxAge
        ) {
          score += 30;
          matchedCriteria += 30;
          reasons.push("Your age matches the scheme.");
        }
      }

      // Occupation = 40 points
      if (occupation !== null) {
        totalCriteria += 40;

        if (
          scheme.occupation &&
          scheme.occupation.toLowerCase() ===
            occupation.toLowerCase()
        ) {
          score += 40;
          matchedCriteria += 40;
          reasons.push("Your occupation matches the scheme.");
        }
      }

      // Income = 30 points
      if (income !== null) {
        totalCriteria += 30;

        if (income <= scheme.maxIncome) {
          score += 30;
          matchedCriteria += 30;
          reasons.push("Your income is within the scheme limit.");
        }
      }

      // Normalize score based on information provided
      const finalScore =
        totalCriteria > 0
          ? Math.round(
              (matchedCriteria / totalCriteria) * 100
            )
          : 0;

      return {
        ...scheme,
        score: finalScore,
        matchReasons: reasons
      };
    });

    // Sort highest match first
    scoredSchemes.sort(
      (a, b) => b.score - a.score
    );

    // Only send top 5 to AI/frontend
    const recommendations = scoredSchemes.slice(0, 5);

    // -----------------------------------------
    // Prepare AI context
    // -----------------------------------------

    const schemeContext = recommendations
      .map(
        (scheme, index) => `
Scheme ${index + 1}
Name: ${scheme.name}
Category: ${scheme.category}
Benefits: ${scheme.benefits}
Match Score: ${scheme.score}%
Why it matches: ${scheme.matchReasons.join(", ")}
`
      )
      .join("\n");

    // -----------------------------------------
    // Ask Ollama for a short explanation
    // -----------------------------------------

    const aiResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3.2",

          prompt: `
You are YojanaSetu AI.

The backend has already calculated the eligibility
match scores.

User question:
${message}

Top recommended schemes:

${schemeContext}

Write a SHORT helpful introduction for the user.

Rules:
- Do not calculate or change the match scores.
- Do not invent schemes.
- Do not invent eligibility requirements.
- Do not repeat the complete scheme information.
- Keep it under 80 words.
- Tell the user that the recommendations are based
  on the information they provided.
- Remind them that final eligibility should be
  verified using the official scheme information.
`,

          stream: false,

          options: {
            temperature: 0.2,
            num_predict: 120
          }
        })
      }
    );

    if (!aiResponse.ok) {
      throw new Error(
        `Ollama returned status ${aiResponse.status}`
      );
    }

    const aiData = await aiResponse.json();

    // -----------------------------------------
    // Final response
    // -----------------------------------------

    res.status(200).json({
      success: true,
      aiMessage: aiData.response,
      recommendations,
      userInfo: {
        age,
        income,
        occupation
      }
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to connect to YojanaSetu AI."
    });
  }
});

export default router;