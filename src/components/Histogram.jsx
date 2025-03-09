import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchCSVData } from "../fetch/fetchCSVData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CSV_URL =
  "https://raw.githubusercontent.com/amit-12k/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv";

const HistogramChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCSVData(CSV_URL);
      setData(result);
    };
    fetchData();
  }, []);

  // Extracting Electric Range Data
  const electricRanges = data
    .map((row) => parseInt(row["Electric Range"], 10))
    .filter((val) => !isNaN(val));

  // Define histogram bins
  const rangeBins = [0, 50, 100, 150, 200, 250, 300, 350, 400];
  const rangeCounts = rangeBins.map(
    (bin, i) =>
      electricRanges.filter(
        (val) =>
          val >= bin && (i === rangeBins.length - 1 || val < rangeBins[i + 1])
      ).length
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 transform hover:scale-105">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Electric Range Distribution (Histogram)
      </h2>
      {data.length > 0 && (
        <Bar
          data={{
            labels: rangeBins.map((bin, i) =>
              i === rangeBins.length - 1
                ? `${bin}+ miles`
                : `${bin} - ${rangeBins[i + 1]} miles`
            ),
            datasets: [
              {
                label: "Number of Vehicles",
                data: rangeCounts,
                backgroundColor: "#22C55E",
              },
            ],
          }}
          options={{ maintainAspectRatio: false, responsive: true }}
        />
      )}
    </div>
  );
};

export default HistogramChart;
