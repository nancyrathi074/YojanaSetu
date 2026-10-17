
import "./SchemeCard.css";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function SchemeCard({ scheme }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("favorites")) || [];

      setFavorite(
        saved.some((item) => item.name === scheme.name)
      );
    } catch (error) {
      console.error("Unable to load favorites:", error);
      setFavorite(false);
    }
  }, [scheme.name]);

  const toggleFavorite = () => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("favorites")) || [];

      const exists = saved.some(
        (item) => item.name === scheme.name
      );

      const updatedFavorites = exists
        ? saved.filter((item) => item.name !== scheme.name)
        : [...saved, scheme];

      localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
      );

      setFavorite(!exists);
    } catch (error) {
      console.error("Unable to update favorites:", error);
    }
  };

  const score = Math.max(
    0,
    Math.min(100, Number(scheme.score) || 0)
  );

  return (
    <div className="card scheme-card shadow border-0 h-100">
      <div className="card-body">
        <span className="badge bg-success mb-3">
          {scheme.category}
        </span>

        <h4 className="fw-bold">{scheme.name}</h4>

        <p className="text-muted">
          {scheme.description}
        </p>

        <h6 className="mt-3">Profile Match</h6>

        <div
          className="progress mb-3"
          role="progressbar"
          aria-label="Profile match score"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar bg-success"
            style={{ width: `${score}%` }}
          >
            {score}%
          </div>
        </div>

        <p>
          <strong>Benefits</strong>
          <br />
          {scheme.benefits}
        </p>

        {scheme.aiReason && (
          <div className="ai-reason-box">
            <strong>🤖 Why AI recommends this</strong>
            <p className="mb-0 mt-1">
              {scheme.aiReason}
            </p>
          </div>
        )}

        <p>
          <strong>Documents</strong>
          <br />
          {scheme.documents}
        </p>
      </div>

      <div className="card-footer bg-white border-0">
        <div className="d-flex justify-content-between mb-3">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={toggleFavorite}
            aria-label={
              favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={favorite}
          >
            {favorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          <Link
            to="/details"
            state={scheme}
            className="btn btn-primary"
          >
            View Details
          </Link>
        </div>

        <a
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success w-100"
        >
          <FaExternalLinkAlt className="me-2" />
          Official Website
        </a>
      </div>
    </div>
  );
}

export default SchemeCard;
