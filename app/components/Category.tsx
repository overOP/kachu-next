"use client";

import dynamic from "next/dynamic";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Pie = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

export default function CategoryDetails() {
  const data = {
    labels: ["Blue", "Red", "Yellow", "Purple"],
    datasets: [
      {
        label: "Products by category",
        data: [12, 19, 3, 5],
        backgroundColor: [
          "rgba(17, 129, 204, 0.73)",
          "rgba(189, 10, 48, 0.82)",
          "rgba(207, 151, 8, 0.82)",
          "rgba(68, 4, 197, 0.85)",
        ],
       
      },
    ],
  };

  return (
      <div className="w-full max-w-xl">
        <Pie data={data} />
      </div>
  );
}
