import "./SchemeDetails.css";
import { useLocation, Link } from "react-router-dom";

function SchemeDetails() {

  const location = useLocation();
  const scheme = location.state;

  if (!scheme) {
    return (
      <div className="container py-5 text-center">
        <h2>No Scheme Selected</h2>

        <Link to="/schemes" className="btn btn-primary mt-3">
          Back
        </Link>
      </div>
    );
  }

  return (

    <div className="container py-5">

      <div className="card shadow-lg border-0 rounded-4">

        <div className="card-body p-5">

          <span className="badge bg-success mb-3">
            {scheme.category}
          </span>

          <h1 className="fw-bold text-primary">
            {scheme.name}
          </h1>

          <p className="lead mt-3">
            {scheme.description}
          </p>

          <hr />

          <h4>🎁 Benefits</h4>

          <p>{scheme.benefits}</p>

          <hr />

          <h4>✅ Eligibility</h4>

          <ul>

            <li>Occupation : {scheme.occupation}</li>

            <li>
              Age : {scheme.minAge} - {scheme.maxAge}
            </li>

            <li>
              Income below ₹{scheme.maxIncome}
            </li>

          </ul>

          <hr />

          <h4>📄 Required Documents</h4>

          <p>{scheme.documents}</p>

          <div className="mt-4">

            <a
              href={scheme.link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success me-3"
            >
              Apply Now
            </a>

            <Link
              to="/schemes"
              className="btn btn-outline-primary"
            >
              Back
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default SchemeDetails;