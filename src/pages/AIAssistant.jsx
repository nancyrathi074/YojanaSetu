
import { useState, useRef } from "react";
import SchemeCard from "../components/SchemeCard";
import "./AIAssistant.css";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recommendationsRef = useRef(null);

  // Ask AI
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
        "https://yojanasetu-8omo.onrender.com/api/ai/ask",
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
      const results = data.recommendations || [];
      setRecommendations(results);

      // Scroll to recommendations after rendering
      if (results.length > 0) {
        setTimeout(() => {
          recommendationsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      }
    } catch (error) {
      console.error("AI Error:", error);

      setError(
        "Unable to connect to YojanaSetu AI. Please check that the backend is running and your Groq API configuration is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format basic Markdown in the AI response
  const formatReply = (text) => {
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      const parts = line
        .split(/(\*\*.*?\*\*)/)
        .map((part, partIndex) => {
          if (
            part.startsWith("**") &&
            part.endsWith("**")
          ) {
            return (
              <strong key={partIndex}>
                {part.slice(2, -2)}
              </strong>
            );
          }

          return (
            <span key={partIndex}>{part}</span>
          );
        });

      const numberedLine = line.match(/^\s*(\d+)\.\s+(.*)$/);

      if (numberedLine) {
        const content = numberedLine[2].split(/(\*\*.*?\*\*)/);

        return (
          <div className="ai-formatted-list-item" key={lineIndex}>
            <span className="ai-list-number">
              {numberedLine[1]}.
            </span>
            <span>
              {content.map((part, partIndex) =>
                part.startsWith("**") &&
                part.endsWith("**") ? (
                  <strong key={partIndex}>
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={partIndex}>{part}</span>
                )
              )}
            </span>
          </div>
        );
      }

      return (
        <div key={lineIndex}>
          {parts}
        </div>
      );
    });
  };

  // Enter key
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI();
    }
  };

  // Suggested question
  const useSuggestion = (question) => {
    setMessage(question);
    setReply("");
    setRecommendations([]);
    setError("");
  };

  return (
    <div className="ai-page">
      <div className="container py-5">

        {/* Page Header */}
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

        {/* AI Question Card */}
        <div className="ai-card">
          <div className="ai-card-header">
            <div className="ai-icon">
              🤖
            </div>

            <div>
              <h4>YojanaSetu AI Assistant</h4>
              <p>Ask questions about government schemes</p>
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

            <div className="ai-input-footer">
              <small>
                Press Enter to ask • Shift + Enter
                for a new line
              </small>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={askAI}
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Thinking...
                  </>
                ) : (
                  <>Ask AI ✨</>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}

          {/* AI Response */}
          {reply && (
            <div className="ai-response">
              <div className="response-header">
                <span className="response-avatar">
                  🤖
                </span>

                <div>
                  <strong>YojanaSetu AI</strong>
                  <small>AI-powered response</small>
                </div>
              </div>

              <div className="response-content">
                {formatReply(reply)}
              </div>
            </div>
          )}

          {/* Loading Message */}
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

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div
            className="ai-recommendations"
            ref={recommendationsRef}
          >
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

            <div className="row g-4">
              {recommendations.map((scheme) => (
                <div
                  className="col-lg-6"
                  key={scheme._id || scheme.name}
                >
                  <SchemeCard
                    scheme={{
                      ...scheme,
                      aiReason:
                        scheme.matchReasons &&
                        scheme.matchReasons.length > 0
                          ? scheme.matchReasons.join(" ")
                          : "This scheme may be relevant based on the information provided.",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="ai-disclaimer">
              <strong>ℹ️ Important:</strong>

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

        {/* No Recommendations */}
        {!loading &&
          reply &&
          recommendations.length === 0 && (
            <div className="no-recommendations">
              <div className="no-recommendations-icon">
                🔍
              </div>

              <h5>No matching schemes found</h5>

              <p>
                Try providing more information such
                as your age, occupation, or annual
                income.
              </p>
            </div>
          )}

        {/* Suggested Questions */}
        <div className="suggestions-section">
          <h5>Try asking</h5>

          <div className="suggestions">
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
