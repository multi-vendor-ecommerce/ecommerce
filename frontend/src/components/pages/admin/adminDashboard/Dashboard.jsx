import React from 'react';
import SummaryCards from './SummaryCards';
import RecentOrders from './RecentOrders';
import SalesChart from './SalesChart';
import TopCountries from './TopCountries';

import { monthlySalesData } from "./data/salesData";

const Dashboard = () => {
  return (
    <section aria-label="Admin Dashboard" className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <SummaryCards />
      <div className="grid grid-cols-1 gap-6 mt-6">
        <SalesChart data={monthlySalesData} />
        <RecentOrders />
        <TopCountries />
      </div>
    </section>
  );
};

export default Dashboard;
