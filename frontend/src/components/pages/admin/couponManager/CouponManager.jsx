import React, { useContext, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AddCoupon from "./AddCoupon";
import CouponContext from "../../../../context/coupons/CouponContext";
import { getFormatDate } from "../../../../utils/formatDate";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import Spinner from "../../../common/Spinner";
import BackButton from "../../../common/layout/BackButton";

export default function CouponsManager() {
  const { coupons, getAllCoupons, addCoupon, deleteCoupon, loading } = useContext(CouponContext);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ code: "", discount: "", minPurchase: "", maxDiscount: "", expiryDate: "", usageLimit: "", isActive: true });

  useEffect(() => {
    getAllCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddCoupon = async () => {
    const { code, discount, minPurchase, maxDiscount, expiryDate, usageLimit, isActive } = form;
    const newErrors = {};

    if (!code.trim()) newErrors.code = "Coupon code is required";
    if (discount === "" || Number(discount) <= 0) newErrors.discount = "Enter a valid discount amount";
    if (minPurchase === "" || Number(minPurchase) < 0) newErrors.minPurchase = "Enter a valid minimum purchase";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (usageLimit === "" || Number(usageLimit) < 1) newErrors.usageLimit = "Usage limit must be at least 1";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      code: code.trim(),
      discount: Number(discount),
      minPurchase: Number(minPurchase),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiryDate,
      usageLimit: Number(usageLimit),
      isActive,
    };

    const result = await addCoupon(payload);

    if (result.success) {
      setForm({ code: "", discount: "", minPurchase: "", maxDiscount: "", expiryDate: "", usageLimit: "", isActive: true });
      setErrors({});
    } else {
      alert(result.message);
    }
  };

  const handleDelete = (id) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) deleteCoupon(id);
  };

  return (
    <section className="bg-gray-100 min-h-screen w-full p-6 shadow-md">
      <BackButton />

      {/* Header */}
      <h2 className="text-2xl font-bold mt-4 mb-6">Coupon Manager</h2>

      {/* Form */}
      <AddCoupon
        form={form}
        setForm={setForm}
        errors={errors}
        handleChange={handleChange}
        handleAddCoupon={handleAddCoupon}
      />

      {/* List */}
      
      {/* Loading or No Coupons */}
      {loading ? (
        <p className="flex justify-center pt-10 mt-6"><Spinner /></p>
      ) : coupons.length === 0 ? (
        <p className="text-gray-500 mt-6">No coupons available.</p>
      ) : (
        <div className="bg-white hover:shadow-blue-500 shadow-md transition duration-200 rounded-xl border border-gray-200 p-6 mt-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">All Coupons</h3>
          <PaginatedLayout data={coupons} initialPerPage={5}>
            {(currentItems) => (
              <ul className="space-y-3">
                {currentItems.map((c) => (
                  <li
                    key={c._id}
                    className="flex justify-between items-center border-b border-gray-300 mx-2 px-1.5 py-3"
                  >
                    <div>
                      <p className="text-[16px] md:text-lg font-semibold text-gray-800">{c.code}</p>
                      <p className="text-sm md:text-[16px] text-gray-600 mt-1">
                        ₹{c.discount} off | Min ₹{c.minPurchase} | Expires:&nbsp;
                        <span className="font-medium">{getFormatDate(c.expiryDate)}</span> | Limit:&nbsp;
                        {c.usageLimit}
                        <span
                          className={`ml-2 font-semibold ${
                            c.isActive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="hover:text-red-600 transition cursor-pointer"
                      title="Delete coupon"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PaginatedLayout>
        </div>
      )}
    </section>
  );
}
