import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaHeart,
  FaCheckCircle,
  FaChartPie
} from "react-icons/fa";

import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";
import DashboardChart from "../components/DashboardChart";

function Dashboard() {

  const [schemes, setSchemes] = useState([]);
  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];
    useEffect(() => {
  fetchSchemes();
}, []);

const fetchSchemes = async () => {
  try {

    const res = await axios.get(
      "http://localhost:5000/api/schemes"
    );

    setSchemes(res.data.schemes);

  } catch (error) {

    console.log(error);

  }
};
  return (

    <div className="container py-5">

      {/* Hero Section */}

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >

        <h1 className="display-4 fw-bold dashboard-title">
          Welcome to YojanaSetu 👋
        </h1>

        <p className="lead text-muted">

          Explore government schemes designed for you.

        </p>

        <Link
          to="/schemes"
          className="btn btn-primary btn-lg rounded-pill px-5 mt-3"
        >

          Find Schemes

        </Link>

      </motion.div>


      {/* Statistics */}

      <div className="row g-4">

        <div className="col-md-3">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card shadow border-0 text-center p-4 h-100"
          >

            <FaFileAlt
              size={45}
              className="text-primary mb-3"
            />

            <h2>{schemes.length}</h2>

            <p>Total Schemes</p>

          </motion.div>

        </div>


        <div className="col-md-3">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card shadow border-0 text-center p-4 h-100"
          >

            <FaCheckCircle
              size={45}
              className="text-success mb-3"
            />

            <h2>3</h2>

            <p>Recommended</p>

          </motion.div>

        </div>


        <div className="col-md-3">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card shadow border-0 text-center p-4 h-100"
          >

            <FaHeart
              size={45}
              className="text-danger mb-3"
            />

            <h2>{favorites.length}</h2>

            <p>Favorites</p>

          </motion.div>

        </div>


        <div className="col-md-3">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card shadow border-0 text-center p-4 h-100"
          >

            <FaChartPie
              size={45}
              className="text-warning mb-3"
            />

            <h2>100%</h2>

            <p>Best Match</p>

          </motion.div>

        </div>

      </div>


      {/* Pie Chart */}

      <DashboardChart />


      {/* Recent Schemes */}

      <div className="card shadow border-0 mt-5">

        <div className="card-body">

          <h3 className="text-primary mb-4">

            Latest Government Schemes

          </h3>

          <ul className="list-group list-group-flush">

            {

              schemes.slice(0,5).map((scheme,index)=>(

                <li
                  key={index}
                  className="list-group-item"
                >

                  {scheme.name}

                </li>

              ))

            }

          </ul>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;