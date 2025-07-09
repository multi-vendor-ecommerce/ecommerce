import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CommissionGraph = ({ heading, chartData }) => {
  return (
    <div>
      {/* Line Chart */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">{heading}</h2>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-md hover:shadow-blue-500 transition duration-200 border-none">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

            {/* X‑axis */}
            <XAxis
              dataKey="name"         
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />

            {/* Y‑axis */}
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              }}
            />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="Sales"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#2563eb" }}
            />
            <Line
              type="monotone"
              dataKey="Commission"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommissionGraph;
