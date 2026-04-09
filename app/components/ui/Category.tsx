"use client"; // Required because charts only work on client side

// Import required things
import dynamic from "next/dynamic";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart components (VERY IMPORTANT)
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamically import Pie chart (prevents SSR error in Next.js)
const PieChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

export default function CategoryDetails() {

  // Step 1: Define your chart data
  const chartData = {
    labels: ["Blue", "Red", "Yellow", "Purple"], // names of categories

    datasets: [
      {
        label: "Products by category", // title
        data: [12, 19, 3, 5], // values

        // colors for each section
        backgroundColor: [
          "rgba(17, 129, 204, 0.73)",
          "rgba(189, 10, 48, 0.82)",
          "rgba(207, 151, 8, 0.82)",
          "rgba(68, 4, 197, 0.85)",
        ],
      },
    ],
  };

  // Step 2: Return UI
  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4">
        Category Distribution
      </h2>

      {/* Render Pie Chart */}
      <PieChart data={chartData} />
    </div>
  );
}