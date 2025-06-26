import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500 transition duration-300">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Sales Trend</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
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
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
