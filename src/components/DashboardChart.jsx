import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DashboardChart() {

  const data = {

    labels: [

      "Education",
      "Employment",
      "Health",
      "Agriculture",
      "Business"

    ],

    datasets: [

      {

        label: "Government Schemes",

        data: [2,2,2,1,2],

        backgroundColor:[
"#243B55",
"#35506F",
"#D4AF37",
"#2F855A",
"#6B7280"
],

        borderWidth:1

      }

    ]

  };

  return (

    <div
      className="card shadow border-0 p-4 mt-5"
    >

      <h4 className="text-center text-primary mb-4">

        Scheme Categories

      </h4>

      <Pie data={data} />

    </div>

  );

}

export default DashboardChart;