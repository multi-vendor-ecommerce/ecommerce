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
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Sales Trend</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[200, 650]}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
