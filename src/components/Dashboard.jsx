import { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchCSVData } from "../fetch/fetchCSVData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement
);

const CSV_URL =
  "https://raw.githubusercontent.com/amit-12k/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedZip, setSelectedZip] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCSVData(CSV_URL);
      setData(result);
    };

    fetchData();
  }, []);

  const manufacturers = [...new Set(data.map((row) => row["Make"]))];
  const vehicleCounts = manufacturers.map(
    (make) => data.filter((row) => row["Make"] === make).length
  );
    const cities = [...new Set(data.map((row) => row["City"]))];
    const cityCounts = cities.map(
      (city) => data.filter((row) => row["City"] === city).length
    );

  const fuelTypes = [
    ...new Set(data.map((row) => row["Electric Vehicle Type"])),
  ];
  const fuelCounts = fuelTypes.map(
    (type) => data.filter((row) => row["Electric Vehicle Type"] === type).length
  );

  const years = [...new Set(data.map((row) => row["Model Year"]))].sort();
  const yearCounts = years.map(
    (year) => data.filter((row) => row["Model Year"] === year).length
  );

  const counties = [...new Set(data.map((row) => row["County"]))];
  const countyCounts = counties.map(
    (county) => data.filter((row) => row["County"] === county).length
  );

  const evModels = [...new Set(data.map((row) => row["Model"]))];
  const modelCounts = evModels.map(
    (model) => data.filter((row) => row["Model"] === model).length
  );
  const topModels = evModels
    .map((model, i) => ({ model, count: modelCounts[i] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

   const zipCodes = [...new Set(data.map((row) => row["Postal Code"]))];
   const filteredData = selectedZip
     ? data.filter((row) => row["Postal Code"] === selectedZip)
     : [];

  const evRanges = data.map((row) => parseInt(row["Electric Range"]) || 0);
  const rangeBuckets = {
    "0-100": evRanges.filter((r) => r > 0 && r <= 100).length,
    "101-200": evRanges.filter((r) => r > 100 && r <= 200).length,
    "201-300": evRanges.filter((r) => r > 200 && r <= 300).length,
    "301+": evRanges.filter((r) => r > 300).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-900 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-8 animate-fadeIn">
        Electric Vehicle Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {[
          {
            title: "Vehicle Count by Manufacturer",
            chart: Bar,
            labels: manufacturers,
            data: vehicleCounts,
            bgColor: "#3B82F6",
          },
          {
            title: "Fuel Type Distribution",
            chart: Pie,
            labels: fuelTypes,
            data: fuelCounts,
            bgColor: ["#EF4444", "#10B981", "#FACC15", "#9333EA"],
          },
          {
            title: "Growth of EV Registrations Over Years",
            chart: Line,
            labels: years,
            data: yearCounts,
            bgColor: "#F97316",
          },
          {
            title: "Proportion of Different EV Models",
            chart: Doughnut,
            labels: manufacturers.slice(0, 5),
            data: vehicleCounts.slice(0, 5),
            bgColor: ["#3B82F6", "#F97316", "#EF4444", "#10B981", "#9333EA"],
          },
          {
            title: "Top 5 Popular EV Models",
            chart: Bar,
            labels: topModels.map((m) => m.model),
            data: topModels.map((m) => m.count),
            bgColor: "#22C55E",
          },
          {
            title: "Electric Range Distribution",
            chart: Pie,
            labels: Object.keys(rangeBuckets),
            data: Object.values(rangeBuckets),
            bgColor: ["#3B82F6", "#F97316", "#22C55E", "#9333EA"],
          },
          {
            title: "EV Count by City",
            chart: Bar,
            labels: cities.slice(0, 10),
            data: cityCounts.slice(0, 10),
            bgColor: "#3B82F6",
          },
          {
            title: "EV Count by County",
            chart: Bar,
            labels: counties.slice(0, 10),
            data: countyCounts.slice(0, 10),
            bgColor: "#F97316",
          },
        ].map(
          ({ title, chart: ChartComponent, labels, data, bgColor }, index) => (
            <div
              key={index}
              className="bg-white shadow-2xl rounded-lg p-6 transition-transform duration-300 transform hover:scale-105 hover:shadow-3xl animate-slideUp"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {title}
              </h2>
              {data.length > 0 && (
                <div className="h-72">
                  <ChartComponent
                    data={{
                      labels,
                      datasets: [
                        {
                          label: title,
                          data,
                          backgroundColor: bgColor,
                          borderColor:
                            bgColor instanceof Array ? bgColor[0] : bgColor,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false, responsive: true }}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="bg-white shadow-2xl rounded-lg p-6 mt-8 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Filter by Zip Code
        </h2>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedZip}
          onChange={(e) => setSelectedZip(e.target.value)}
        >
          <option value="">Select Zip Code</option>
          {zipCodes.map((zip) => (
            <option key={zip} value={zip}>
              {zip}
            </option>
          ))}
        </select>

        {selectedZip && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700">
              EVs in Zip Code {selectedZip}: {filteredData.length}
            </h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {filteredData.slice(0, 5).map((row, index) => (
                <li key={index}>
                  {row["Make"]} {row["Model"]} ({row["Model Year"]})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
