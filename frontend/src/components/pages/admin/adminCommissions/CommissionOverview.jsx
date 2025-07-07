import { useMemo } from "react";
import { dummyVendors } from "../adminVendor/data/dummyVendorsData";
import CommissionKeyMetrics from "./CommissionKeyMetrics";
import CommissionGraph from "./CommissionGraph";

const CommissionOverview = () => {
  const stats = useMemo(() => {
    const totalCommission = dummyVendors.reduce((sum, v) => sum + v.commission, 0);
    const totalSales = dummyVendors.reduce((sum, v) => sum + v.totalSales, 0);
    const activeVendors = dummyVendors.filter((v) => v.status === "active").length;
    const topVendor = dummyVendors.reduce((top, v) => (v.totalSales > top.totalSales ? v : top), dummyVendors[0]);

    return { totalCommission, totalSales, activeVendors, topVendor };
  }, []);

  const chartData = dummyVendors.slice(0, 10).map((v) => ({
    name: v.name.split(" ")[0],
    Commission: v.commission,
    Sales: v.totalSales,
  }));

  return (
    <section className="bg-gray-100 min-h-screen min-w-full p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Commission Overview</h2>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="bg-white rounded-xl px-4 py-6 shadow-md hover:shadow-blue-500 transition duration-200">
          <CommissionKeyMetrics stats={stats} />
        </div>

        <div className="px-4 py-6">
          <CommissionGraph heading="Sales vs Commission (Top 10 Vendors)" chartData={chartData} />
        </div>
      </div>
    </section>
  );
};

export default CommissionOverview;
