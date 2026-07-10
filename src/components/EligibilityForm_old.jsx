import { useState } from "react";
import schemes from "../data/schemes";
import SchemeCard from "./SchemeCard";
import {
FaUser,
FaMapMarkerAlt,
FaMoneyBillWave,
FaBriefcase,
FaBirthdayCake
} from "react-icons/fa";
import "./EligibilityForm.css";
function EligibilityForm() {

  const [user, setUser] = useState({
    name: "",
    age: "",
    state: "",
    occupation: "",
    income: ""
  });
  const [recommended, setRecommended] = useState([]);

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };

const handleSubmit = (e) => {

    e.preventDefault();


    const result = schemes.map((scheme)=>{


        let score = 0;


        // Occupation match
        if(scheme.occupation === user.occupation){
            score += 40;
        }


        // Income match
        if(Number(user.income) <= scheme.maxIncome){
            score += 30;
        }


        // Age match
        if(
            Number(user.age) >= scheme.minAge &&
            Number(user.age) <= scheme.maxAge
        ){

            score += 30;

        }


        return {

            ...scheme,

            score: score

        };


    })
    .filter((scheme)=>scheme.score >= 50)
    .sort((a,b)=>b.score-a.score);



    setRecommended(result);


};
return (

<div className="find-page">

    <h2>Find Suitable Schemes</h2>

    <form className="search-form" onSubmit={handleSubmit}>

  <div className="input-box">
    <FaUser className="icon" />
    <input
      type="text"
      name="name"
      placeholder="Enter Name"
      onChange={handleChange}
    />
  </div>

  <div className="input-box">
    <FaBirthdayCake className="icon" />
    <input
      type="number"
      name="age"
      placeholder="Enter Age"
      onChange={handleChange}
    />
  </div>

  <div className="input-box">
    <FaMapMarkerAlt className="icon" />
    <input
      type="text"
      name="state"
      placeholder="Enter State"
      onChange={handleChange}
    />
  </div>

  <div className="input-box">
    <FaBriefcase className="icon" />

    <select
      name="occupation"
      onChange={handleChange}
    >
      <option value="">Select Occupation</option>
      <option value="Student">Student</option>
      <option value="Job Seeker">Job Seeker</option>
    </select>

  </div>

  <div className="input-box">
    <FaMoneyBillWave className="icon" />
    <input
      type="number"
      name="income"
      placeholder="Annual Income"
      onChange={handleChange}
    />
  </div>

  <button type="submit">
    🔍 Find My Schemes
  </button>

</form>
    <h2 className="results-heading">
        Recommended Schemes
    </h2>

    <div className="schemes-grid">

        {recommended.map((scheme,index)=>(

            <SchemeCard
                key={index}
                scheme={scheme}
            />

        ))}

    </div>

</div>

);

}

export default EligibilityForm;
