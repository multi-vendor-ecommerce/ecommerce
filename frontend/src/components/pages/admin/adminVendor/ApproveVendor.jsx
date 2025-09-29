import { useState, useEffect, useContext } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import Button from "../../../common/Button";
import { NavLink } from "react-router-dom";
import { FiCheckCircle, FiEye, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import ReviewBox from "../../../common/ReviewBox";
import { vendorFields } from "./data/vendorFieldsData";

const ApproveVendor = () => {
  const { vendors, getAllVendors, updateVendorStatus, loading } = useContext(VendorContext);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingAction, setUpdatingAction] = useState(""); // "active" or "rejected"
  const [review, setReview] = useState("");

  useEffect(() => {
    getAllVendors({ status: "pending" });
  }, []);

  const handleStatusChange = async (id, status) => {
    if (status === "rejected" && !review.trim()) {
      toast.error("Please provide review before rejecting.");
      return;
    }

    setUpdatingId(id);
    setUpdatingAction(status);

    const data = await updateVendorStatus(id, status, review);

    setUpdatingId(null);
    setUpdatingAction("");
    setReview("");

    if (data.success) {
      toast.success(data.message || `Vendor ${status} successfully!`);
    } else {
      toast.error(data.message || "Failed to update vendor status.");
    }
  };

  const handleApprove = (id) => handleStatusChange(id, "active");
  const handleReject = (id) => handleStatusChange(id, "rejected");

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
                className="flex flex-col gap-6 p-4 rounded-lg border-[0.5px] border-gray-50 hover:shadow-sm hover:shadow-purple-500 transition duration-200 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 flex-1 w-full">
                  <img
                    src={
                      vendor.shopLogo ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${vendor.shopName || "V"}`
                    }
                    alt={vendor.shopName}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow"
                  />
                  <div className="flex-1 text-center md:text-start">
                    <div className="font-semibold text-lg text-gray-900">{vendor.shopName}</div>
                    {vendorFields.map(field => {
                      const rendered = field.render ? field.render(vendor) : vendor[field.key];
                      if (field.key === "status" && rendered && rendered.isStatus) {
                        return (
                          <div className="text-gray-700 mt-1" key={field.key}>
                            <span className="font-medium">{field.label}:</span>{" "}
                            <span className="text-yellow-600 font-bold">{rendered.value}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="text-gray-700 mt-1" key={field.key}>
                          <span className="font-medium">{field.label}:</span>{" "}
                          {rendered}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-row flex-wrap justify-center md:flex-col gap-3 md:gap-2 text-sm lg:text-base">
                    <Button
                      icon={FiCheckCircle}
                      text={updatingId === vendor._id && updatingAction === "active" ? <span className="animate-pulse">Approving...</span> : "Approve"}
                      onClick={() => handleApprove(vendor._id)}
                      className="py-2"
                      color="green"
                      disabled={updatingId === vendor._id}
                    />

                    <Button
                      icon={FiXCircle}
                      text="Reject"
                      onClick={() => {
                        setUpdatingId(vendor._id);
                        setUpdatingAction("rejected");
                      }}
                      className="py-2"
                      color="red"
                      disabled={updatingId === vendor._id}
                    />

                    <NavLink to={`/admin/vendor/profile/${vendor._id}`} className="flex gap-2 items-center font-semibold text-blue-600 px-3 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition duration-150">
                      <FiEye size={20} />
                      <span>View Vendor</span>
                    </NavLink>
                  </div>
                </div>

                {updatingId === vendor._id && updatingAction === "rejected" && (
                  <ReviewBox
                    value={review}
                    setValue={setReview}
                    onSubmit={() => handleReject(vendor._id)}
                    onCancel={() => { setUpdatingId(null); setUpdatingAction(""); setReview(""); }}
                    submitText="Send Rejection"
                    disabled={updatingId === null}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ApproveVendor;