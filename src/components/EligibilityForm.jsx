import "./EligibilityForm.css";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SchemeCard from "./SchemeCard";
import schemes from "../data/schemes";

import {
  FaUser,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaSearch
} from "react-icons/fa";

function EligibilityForm() {

  const [user, setUser] = useState({
    name: "",
    age: "",
    state: "",
    occupation: "",
    income: ""
  });

  const [recommended, setRecommended] = useState([]);

  const [search, setSearch] = useState("");

  const handleChange = (e) => {

    setUser({

      ...user,

      [e.target.name]: e.target.value

    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

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

          score

        };

      })

      .filter((scheme) => scheme.score >= 50)

      .sort((a, b) => b.score - a.score);

    setRecommended(result);

  };
    return (

    <div className="container py-5">

      <h2 className="text-center text-primary fw-bold mb-5">
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
                />

              </div>

            </div>


            <div className="col-md-12 text-center">

              <button
                className="btn btn-primary btn-lg rounded-pill px-5"
                type="submit"
              >

                <FaSearch className="me-2" />

                Find My Schemes

              </button>

            </div>

          </div>

        </form>

      </div>
            {/* Recommended Schemes */}

      <div className="mt-5">

        <h3 className="text-center text-primary fw-bold mb-4">
          Recommended Schemes
        </h3>

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

        </div>

        {/* Search Bar */}

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div className="row g-4 mt-2">

          {

            recommended.length === 0 ?

            (

              <div className="text-center text-muted">

                <h5>No recommendations yet.</h5>

                <p>
                  Fill the form above and click
                  <b> Find My Schemes</b>.
                </p>

              </div>

            )

            :

            recommended

              .filter((scheme) =>

                scheme.name
                  .toLowerCase()
                  .includes(search.toLowerCase())

                ||

                scheme.category
                  .toLowerCase()
                  .includes(search.toLowerCase())

              )

              .map((scheme, index) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={index}
                >

                  <SchemeCard
                    scheme={scheme}
                  />

                </div>

              ))

          }

        </div>

      </div>
    </div>

  );

}

export default EligibilityForm;
   