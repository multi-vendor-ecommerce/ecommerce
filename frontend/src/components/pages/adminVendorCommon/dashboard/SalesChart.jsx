import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md shadow-purple-500 transition duration-300">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Sales Trend</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data || []} // Use salesData directly, default to empty array
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 13, fill: "#374151" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 13, fill: "#374151" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                color: "#111827",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              }}
              labelStyle={{ color: "#111827", fontWeight: 500 }}
              itemStyle={{ color: "#111827", fontWeight: 500 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1d4ed8"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: "#1e3a8a", fill: "#1d4ed8", strokeWidth: 1.5 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#1e3a8a", fill: "#1d4ed8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>
          <p className="text-gray-500 mb-2">
            No sales recorded during this period.
          </p>
          <p className="text-gray-400 text-sm">
            If you recently delivered orders, try adjusting the date range.
            Sales data will appear here once orders are completed.
          </p>
        </div>
      )}
    </div>
  );
}