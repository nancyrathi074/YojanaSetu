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
  className="card shadow border-0 p-4 mt-5 mx-auto"
  style={{ maxWidth: "700px" }}
>
    <h4 className="text-center text-primary mb-4">
      Scheme Categories
    </h4>

    <div
      style={{
        width: "420px",
        height: "420px",
        margin: "0 auto"
      }}
    >
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        }}
      />
    </div>

  </div>
);
}

export default DashboardChart;