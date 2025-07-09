import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AddCoupon from "./AddCoupon";

const initialCoupons = [
  {
    id: 1,
    code: "WELCOME100",
    value: 100,
    minOrder: 500,
    expiry: "2025-12-31",
    usageLimit: 1,
  },
  {
    id: 2,
    code: "FESTIVE500",
    value: 500,
    minOrder: 2000,
    expiry: "2025-08-31",
    usageLimit: 1,
  },
];

export default function CouponsManager() {
  const [errors, setErrors] = useState({});
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({ code: "", value: "", minOrder: "", expiry: "", usageLimit: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCoupon = () => {
    const { code, value, minOrder, expiry, usageLimit } = form;
    const newErrors = {};

    if (!code.trim()) newErrors.code = "Coupon code is required";
    if (value === "" || Number(value) <= 0) newErrors.value = "Enter a valid coupon value";
    if (minOrder === "" || Number(minOrder) < 0) newErrors.minOrder = "Enter a valid minimum order";
    if (!expiry) newErrors.expiry = "Expiry date is required";
    if (usageLimit === "" || Number(usageLimit) < 1) newErrors.usageLimit = "Usage limit must be at least 1";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newCoupon = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      value: Number(value),
      minOrder: Number(minOrder),
      expiry,
      usageLimit: Number(usageLimit),
    };

    setCoupons([...coupons, newCoupon]);
    setForm({ code: "", value: "", minOrder: "", expiry: "", usageLimit: "" });
    setErrors({});
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <section className="bg-gray-100 min-h-screen w-full p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6">Coupon Manager</h2>

      {/* form card */}
      <AddCoupon form={form} setForm={setForm} errors={errors} handleChange={handleChange} handleAddCoupon={handleAddCoupon}  />

      {/* list card */}
      <div className="bg-white hover:shadow-blue-500 shadow-md transition duration-200 rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">All Coupons</h3>
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available.</p>
        ) : (
          <ul className="space-y-3">
            {coupons.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center border-b border-gray-300 mx-2 px-1.5 py-3"
              >
                <div>
                  <p className="ext-[16px] md:text-lg font-semibold text-gray-800">{c.code}</p>
                  <p className="text-sm md:text-[16px] text-gray-600 mt-1">
                    ₹{c.value} off | Min ₹{c.minOrder} | Expires:&nbsp;
                    <span className="font-medium">{c.expiry || "—"}</span> | Limit:&nbsp;
                    {c.usageLimit}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="hover:text-red-600 transition cursor-pointer"
                  title="Delete coupon"
                >
                  <FiTrash2 size={22} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
