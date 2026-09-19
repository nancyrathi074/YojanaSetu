import { useState } from "react";
import SchemeCard from "../components/SchemeCard";
import "./AIAssistant.css";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Ask AI
  // -----------------------------------------

  const askAI = async () => {
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setReply("");
    setRecommendations([]);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "AI request failed."
        );
      }

      // AI explanation
      setReply(data.aiMessage || "");

      // Recommended schemes
      setRecommendations(
        data.recommendations || []
      );

    } catch (error) {
      console.error("AI Error:", error);

      setError(
        "Unable to connect to YojanaSetu AI. Please make sure the backend and Ollama are running."
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Enter key
  // -----------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI();
    }
  };

  // -----------------------------------------
  // Suggested Question
  // -----------------------------------------

  const useSuggestion = (question) => {
    setMessage(question);
    setReply("");
    setRecommendations([]);
    setError("");
  };

  return (
    <div className="ai-page">

      <div className="container py-5">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="text-center mb-5">

          <div className="ai-badge">
            🤖 YojanaSetu AI
          </div>

          <h1 className="ai-title">
            Ask YojanaSetu AI
          </h1>

          <p className="ai-subtitle">
            Get help finding and understanding
            government schemes using your personal
            information.
          </p>

        </div>


        {/* =====================================
            AI QUESTION CARD
        ====================================== */}

        <div className="ai-card">

          {/* AI Header */}

          <div className="ai-card-header">

            <div className="ai-icon">
              🤖
            </div>

            <div>
              <h4>
                YojanaSetu AI Assistant
              </h4>

              <p>
                Ask questions about government schemes
              </p>
            </div>

          </div>


          {/* Question Input */}

          <div className="ai-input-section">

            <label htmlFor="aiQuestion">
              What would you like to know?
            </label>

            <textarea
              id="aiQuestion"
              className="form-control ai-textarea"
              rows="5"
              placeholder="Example: I am a 21 year old student from Haryana with an annual income of ₹2 lakh. Which government schemes might be suitable for me?"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />


            {/* Input Footer */}

            <div className="ai-input-footer">

              <small>
                Press Enter to ask • Shift + Enter
                for a new line
              </small>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={askAI}
                disabled={
                  loading ||
                  !message.trim()
                }
              >

                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>

                    Thinking...
                  </>
                ) : (
                  <>
                    Ask AI ✨
                  </>
                )}

              </button>

            </div>

          </div>


          {/* =================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}


          {/* =================================
              AI RESPONSE
          ================================== */}

          {reply && (

            <div className="ai-response">

              <div className="response-header">

                <span className="response-avatar">
                  🤖
                </span>

                <div>

                  <strong>
                    YojanaSetu AI
                  </strong>

                  <small>
                    AI-powered response
                  </small>

                </div>

              </div>


              <div className="response-content">
                {reply}
              </div>

            </div>

          )}


          {/* =================================
              LOADING MESSAGE
          ================================== */}

          {loading && (
            <div className="ai-loading">

              <div className="ai-loading-icon">
                🤖
              </div>

              <div>
                <strong>
                  YojanaSetu AI is thinking...
                </strong>

                <p>
                  Checking your information and
                  finding relevant schemes.
                </p>
              </div>

            </div>
          )}

        </div>


        {/* =====================================
            AI RECOMMENDATIONS
        ====================================== */}

        {recommendations.length > 0 && (

          <div className="ai-recommendations">

            {/* Section Header */}

            <div className="text-center mb-4">

              <div className="recommendation-badge">
                🎯 AI Powered Recommendations
              </div>

              <h2 className="recommendation-title">
                Schemes Recommended For You
              </h2>

              <p className="text-muted">
                These recommendations are based on
                the information you provided.
              </p>

            </div>


            {/* Recommendation Cards */}

            <div className="row g-4">

              {recommendations.map(
                (scheme) => (

                  <div
                    className="col-lg-6"
                    key={scheme._id}
                  >

                    <SchemeCard
                      scheme={{
                        ...scheme,

                        aiReason:
                          scheme.matchReasons &&
                          scheme.matchReasons.length > 0
                            ? scheme.matchReasons.join(" ")
                            : "This scheme may be relevant based on the information provided."
                      }}
                    />

                  </div>

                )
              )}

            </div>


            {/* Disclaimer */}

            <div className="ai-disclaimer">

              <strong>
                ℹ️ Important:
              </strong>

              <span>
                AI recommendations are based on the
                information provided and the schemes
                available in the YojanaSetu database.
                Please verify the final eligibility and
                application requirements on the official
                government website.
              </span>

            </div>

          </div>

        )}


        {/* =====================================
            NO RECOMMENDATIONS
        ====================================== */}

        {!loading &&
          reply &&
          recommendations.length === 0 && (

            <div className="no-recommendations">

              <div className="no-recommendations-icon">
                🔍
              </div>

              <h5>
                No matching schemes found
              </h5>

              <p>
                Try providing more information such
                as your age, occupation, or annual
                income.
              </p>

            </div>

          )}


        {/* =====================================
            SUGGESTED QUESTIONS
        ====================================== */}

        <div className="suggestions-section">

          <h5>
            Try asking
          </h5>

          <div className="suggestions">

            {/* Student */}

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "I am a student. What government schemes might be useful for me?"
                )
              }
            >
              🎓 Schemes for students
            </button>


            {/* Income */}

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "I have a low annual income. What government schemes might I qualify for?"
                )
              }
            >
              💰 Schemes based on income
            </button>


            {/* Documents */}

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "What documents are commonly required to apply for government schemes?"
                )
              }
            >
              📄 Required documents
            </button>


            {/* Search */}

            <button
              type="button"
              onClick={() =>
                useSuggestion(
                  "How can I find government schemes suitable for my age and occupation?"
                )
              }
            >
              🔍 Find suitable schemes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;