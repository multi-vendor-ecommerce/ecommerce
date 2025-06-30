// Account.jsx
import React, { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import BillingDetails from "./BillingDetails";
import SavedAddresses from "./SavedAddresses";

const tabs = ["Profile Info", "Change Password", "Billing Details", "Saved Addresses"];

export default function Account() {
  const [activeTab, setActiveTab] = useState("Profile Info");

  const renderTab = () => {
    switch (activeTab) {
      case "Profile Info":
        return <ProfileInfo />;
      case "Change Password":
        return <ChangePassword />;
      case "Billing Details":
        return <BillingDetails />;
      case "Saved Addresses":
        return <SavedAddresses />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">{renderTab()}</div>
      </div>
    </div>
  );
}
