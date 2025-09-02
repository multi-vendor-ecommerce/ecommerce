import { useState, useEffect, useContext } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import Button from "../../../common/Button";
import { NavLink } from "react-router-dom";
import { FiCheckCircle, FiEye, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const ApproveVendor = () => {
  const { vendors, getAllVendors, updateVendorStatus, loading } = useContext(VendorContext);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingAction, setUpdatingAction] = useState(""); // "approve" or "reject"

  useEffect(() => {
    getAllVendors({ status: "pending" });
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setUpdatingAction(status); // Track which action is happening

    const data = await updateVendorStatus(id, status);

    setUpdatingId(null);
    setUpdatingAction("");
    
    if (data.success) {
      toast.success(data.message || `Vendor ${status} successfully!`);
    } else {
      toast.error(data.message || "Failed to update vendor status.");
    }
  };

  const handleApprove = (id) => {
    handleStatusChange(id, "approved");
  };

  const handleReject = (id) => {
    handleStatusChange(id, "rejected");
  };

  if (loading && vendors.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <h2 className="text-2xl font-bold mt-4 mb-6">Approve Vendors</h2>

      <div className="bg-white shadow-md shadow-blue-500 rounded-xl p-6">
        {vendors.length === 0 ? (
          <div className="text-center text-gray-600 font-medium flex flex-col items-center gap-4">
            <p>No vendors to approve</p>
            <NavLink
              to="/admin/all-vendors"
              className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-blue-600 font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
            >
              <FiEye className="text-lg md:text-2xl" />
              <span className="hidden md:inline-block">View All Vendors</span>
            </NavLink>
          </div>
        ) : (
          <ul className="flex flex-col gap-8">
            {vendors.map(vendor => (
              <li
                key={vendor._id}
                className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg border-[0.5px] border-gray-50 hover:shadow-sm hover:shadow-purple-500 transition duration-200 bg-gray-50"
              >
                <img
                  src={vendor.shopLogo || "/default-shop-logo.png"}
                  alt={vendor.shopName}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow"
                />
                <div className="flex-1 text-center md:text-start">
                  <div className="font-semibold text-lg text-gray-900">{vendor.shopName}</div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Name:</span>{" "}
                    {vendor.name}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">GST Number:</span>{" "}
                    {vendor.gstNumber}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Email:</span>{" "}
                    {vendor.email}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Mobile Number:</span>{" "}
                    {vendor.phone}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Address:</span>{" "}
                    {vendor.address?.line1}, {vendor.address?.city}, {vendor.address?.state}, {vendor.address?.country}, {vendor.address?.pincode}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="text-yellow-600 font-bold">{vendor.status}</span>
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">Registered At:</span>{" "}
                    {vendor.registeredAt ? new Date(vendor.registeredAt).toLocaleDateString() : "—"}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 md:gap-2 text-sm md:text-base">
                  <NavLink to={`/admin/vendor/profile/${vendor._id}`} className="flex gap-2 items-center font-semibold text-blue-600 px-3 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition duration-150">
                    <FiEye size={20} />
                    <span>View Vendor</span>
                  </NavLink>

                  <Button
                    icon={FiCheckCircle}
                    text={updatingId === vendor._id && updatingAction === "approved" ? <span className="animate-pulse">Approving...</span> : "Approve"}
                    onClick={() => handleApprove(vendor._id)}
                    className="py-2"
                    color="green"
                    disabled={updatingId === vendor._id}
                  />
                  
                  <Button
                    icon={FiXCircle}
                    text={updatingId === vendor._id && updatingAction === "rejected" ? <span className="animate-pulse">Rejecting...</span> : "Reject"}
                    onClick={() => handleReject(vendor._id)}
                    className="py-2"
                    color="red"
                    disabled={updatingId === vendor._id}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ApproveVendor;