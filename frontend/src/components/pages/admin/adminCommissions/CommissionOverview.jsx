import { useMemo, useContext, useEffect } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import CommissionKeyMetrics from "./CommissionKeyMetrics";
import CommissionGraph from "./CommissionGraph";
import BackButton from "../../../common/layout/BackButton";

const CommissionOverview = () => {
  const context = useContext(VendorContext);
  const { vendors, getAllVendors } = context;

  useEffect(() => {
    getAllVendors();
  }, []);

  const stats = useMemo(() => {
    if (!vendors || vendors.length === 0) {
      return { totalCommission: 0, totalSales: 0, activeVendors: 0, topVendor: "Nill" };
    }

    const totalCommission = vendors.reduce((sum, v) => sum + v.commissionRate, 0);
    const totalSales = vendors.reduce((sum, v) => sum + v.totalSales, 0);
    const activeVendors = vendors.filter((v) => v.status === "active").length;
    const topVendor = vendors.reduce((top, v) => (v.totalSales > top.totalSales ? v : top), vendors[0]);

    return { totalCommission, totalSales, activeVendors, topVendor };
  }, [vendors]);

  const chartData = vendors.slice(0, 10).map((v) => ({
    name: v.name.split(" ")[0],
    Commission: v.commissionRate,
    Sales: v.totalSales,
  }));

  return (
    <section className="bg-gray-100 min-h-screen min-w-full p-6 shadow-md">
      <BackButton />

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6">Commission Overview</h2>

      <div className="flex flex-col gap-6 md:gap-8">
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
