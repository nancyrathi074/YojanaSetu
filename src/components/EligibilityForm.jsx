import "./EligibilityForm.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import SchemeCard from "./SchemeCard";

import {
  FaUser,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

function EligibilityForm() {
  // ---------------- USER DATA ----------------

  const [user, setUser] = useState({
    name: "",
    age: "",
    state: "",
    occupation: "",
    income: "",
  });

  // ---------------- STATES ----------------

  const [schemes, setSchemes] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const resultRef = useRef(null);

  // ---------------- FETCH SCHEMES ----------------

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/schemes"
      );

      setSchemes(res.data.schemes);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- HANDLE INPUT ----------------

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- FIND SCHEMES ----------------

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const result = schemes
      .map((scheme) => {
        let score = 0;

        if (scheme.occupation === user.occupation)
          score += 40;

        if (Number(user.income) <= scheme.maxIncome)
          score += 30;

        if (
          Number(user.age) >= scheme.minAge &&
          Number(user.age) <= scheme.maxAge
        ) {
          score += 30;
        }

        return {
          ...scheme,
          score,
        };
      })
      .filter((scheme) => scheme.score >= 50)
      .sort((a, b) => b.score - a.score);

    setTimeout(() => {
      setRecommended(result);

      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setLoading(false);
    }, 1200);
  };
  return (
  <div className="container py-5">

    <h2 className="text-center section-title fw-bold mb-5">
      Find Government Schemes
    </h2>

    <div className="card shadow-lg border-0 rounded-4 p-4">

      <form onSubmit={handleSubmit}>

        <div className="row g-4">

          {/* Name */}

          <div className="col-md-6">

            <div className="input-group-custom">

              <FaUser />

              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={user.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Age */}

          <div className="col-md-6">

            <div className="input-group-custom">

              <FaBirthdayCake />

              <input
                type="number"
                name="age"
                placeholder="Enter Age"
                value={user.age}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* State */}

          <div className="col-md-6">

            <div className="input-group-custom">

              <FaMapMarkerAlt />

              <input
                type="text"
                name="state"
                placeholder="Enter State"
                value={user.state}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Occupation */}

          <div className="col-md-6">

            <div className="input-group-custom">

              <FaBriefcase />

              <select
                name="occupation"
                value={user.occupation}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Occupation
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Job Seeker">
                  Job Seeker
                </option>

                <option value="Farmer">
                  Farmer
                </option>

              </select>

            </div>

          </div>

          {/* Income */}

          <div className="col-md-12">

            <div className="input-group-custom">

              <FaMoneyBillWave />

              <input
                type="number"
                name="income"
                placeholder="Annual Income"
                value={user.income}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Button */}

          <div className="col-md-12 text-center">

            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill px-5"
              disabled={loading}
            >

              {loading ? (

                <>

                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Finding Schemes...

                </>

              ) : (

                <>

                  <FaSearch className="me-2" />

                  Find My Schemes

                </>

              )}

            </button>

          </div>

        </div>

      </form>

    </div>

    {/* Recommended Schemes */}

    <div
      className="mt-5"
      ref={resultRef}
    >      <h3 className="text-center section-title fw-bold mb-4">
        Recommended Schemes
      </h3>

      {/* Success Message */}

      {recommended.length > 0 && (
        <div className="alert alert-success text-center rounded-4 shadow-sm mb-4">
          🎉 <strong>{recommended.length}</strong> Government Scheme
          {recommended.length > 1 ? "s" : ""} Found For You!
        </div>
      )}

      {/* Category Buttons */}

      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">

        <button
          className="btn btn-outline-primary"
          onClick={() => setSearch("")}
        >
          All
        </button>

        <button
          className="btn btn-outline-success"
          onClick={() => setSearch("Education")}
        >
          Education
        </button>

        <button
          className="btn btn-outline-warning"
          onClick={() => setSearch("Employment")}
        >
          Employment
        </button>

        <button
          className="btn btn-outline-info"
          onClick={() => setSearch("Skill")}
        >
          Skill
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setSearch("Health")}
        >
          Health
        </button>

      </div>

      {/* Search */}

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="row g-4 mt-2">

        {recommended.length === 0 ? (

          <div className="text-center py-5">

            <h4 className="text-muted">
              No recommendations yet.
            </h4>

            <p className="text-secondary">
              Fill the form above and click
              <strong> Find My Schemes</strong>.
            </p>

          </div>

        ) : (

          recommended

            .filter(

              (scheme) =>

                scheme.name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||

                scheme.category
                  .toLowerCase()
                  .includes(search.toLowerCase())

            )

            .map((scheme) => (

              <div
                className="col-md-6 col-lg-4"
                key={scheme._id}
              >

                <SchemeCard scheme={scheme} />

              </div>

            ))

        )}

      </div>

    </div>

  </div>
);

}

export default EligibilityForm;