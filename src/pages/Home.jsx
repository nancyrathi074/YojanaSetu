import "./Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center">

          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge bg-primary fs-6 mb-3">
              🇮🇳 Smart Welfare Recommendation Platform
            </span>

            <h1 className="display-4 fw-bold">
    <span className="brand-dark">Yojana</span>
    <span className="brand-gold">Setu</span>
</h1>

            <p className="lead mt-4">
              Find the most suitable Government welfare schemes using
              smart eligibility matching based on your profile.
            </p>

            <Link to="/schemes">
              <button className="btn btn-primary btn-lg rounded-pill px-5 mt-3">
                Find My Eligible Schemes →
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="col-lg-6 text-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=700"
              alt="Government Schemes"
              className="img-fluid rounded-4 shadow hero-image"
            />
          </motion.div>

        </div>
      </section>

      {/* Statistics */}
      <section className="container py-5">

        <div className="row text-center g-4">

          <div className="col-md-4">
            <div className="card shadow border-0 p-4">
              <h2 className="text-primary fw-bold">12+</h2>
              <p>Government Schemes</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0 p-4">
              <h2 className="text-success fw-bold">8+</h2>
              <p>Categories</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0 p-4">
              <h2 className="text-danger fw-bold">100%</h2>
              <p>Eligibility Accuracy</p>
            </div>
          </div>

        </div>

      </section>

      {/* Features */}
      <section className="container py-5">

        <h2 className="text-center fw-bold mb-5">
          Why Choose YojanaSetu?
        </h2>

        <div className="row g-4">

          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 h-100">
              <div className="card-body text-center">
                <h1>🔍</h1>
                <h4 className="mt-3">Smart Search</h4>
                <p>Find government schemes instantly.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 h-100">
              <div className="card-body text-center">
                <h1>✅</h1>
                <h4 className="mt-3">Eligibility Check</h4>
                <p>AI-based profile matching.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 h-100">
              <div className="card-body text-center">
                <h1>🤖</h1>
                <h4 className="mt-3">AI Assistant</h4>
                <p>Personalized recommendations.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 h-100">
              <div className="card-body text-center">
                <h1>🏛️</h1>
                <h4 className="mt-3">Trusted Information</h4>
                <p>Verified Government Schemes.</p>
              </div>
            </div>
          </div>

        </div>

      </section>
    </>
  );
}

export default Home;