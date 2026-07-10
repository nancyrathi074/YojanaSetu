import "./SchemeCard.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaExternalLinkAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

function SchemeCard({ scheme }) {

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = saved.find(
      (item) => item.name === scheme.name
    );

    if (exists) {
      setFavorite(true);
    }

  }, [scheme.name]);

  const toggleFavorite = () => {

    let saved =
      JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {

      saved = saved.filter(
        (item) => item.name !== scheme.name
      );

    } else {

      saved.push(scheme);

    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(saved)
    );

    setFavorite(!favorite);

  };

  return (

    <div className="card scheme-card shadow border-0 h-100">

      <div className="card-body">

        <span className="badge bg-success mb-3">
          {scheme.category}
        </span>

        <h4 className="fw-bold">
          {scheme.name}
        </h4>

        <p className="text-muted">
          {scheme.description}
        </p>

        <h6 className="mt-3">
          Eligibility Match
        </h6>

        <div className="progress mb-3">

          <div
            className="progress-bar bg-success"
            style={{ width: `${scheme.score}%` }}
          >
            {scheme.score}%
          </div>

        </div>

        <p>
          <strong>Benefits</strong>
          <br />
          {scheme.benefits}
        </p>

        <p>
          <strong>Documents</strong>
          <br />
          {scheme.documents}
        </p>

      </div>

      <div className="card-footer bg-white border-0">

        <div className="d-flex justify-content-between mb-3">

          <button
            className="btn btn-outline-danger"
            onClick={toggleFavorite}
          >

            {
              favorite ?

              <FaHeart />

              :

              <FaRegHeart />

            }

          </button>

          <Link
            to="/details"
            state={scheme}
          >

            <button className="btn btn-primary">

              View Details

            </button>

          </Link>

        </div>

        <a
          href={scheme.link}
          target="_blank"
          rel="noreferrer"
          className="btn btn-success w-100"
        >

          <FaExternalLinkAlt className="me-2"/>

          Official Website

        </a>

      </div>

    </div>

  );

}

export default SchemeCard;