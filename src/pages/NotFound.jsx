import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center py-5">

      <h1 className="display-1 text-primary">
        404
      </h1>

      <h3>
        Page Not Found
      </h3>

      <p>
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="btn btn-primary mt-3"
      >
        Go Home
      </Link>

    </div>
  );
}

export default NotFound;