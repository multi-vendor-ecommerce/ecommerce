import { useState } from "react";
import CouponContext from "./CouponContext";

const CouponState = (props) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  const getAllCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${host}/api/coupons`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch coupons.");

      const data = await response.json();
      setCoupons(data.coupons);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a coupon
  const addCoupon = async (form) => {
    try {
      const response = await fetch(`${host}/api/coupons/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json(); // parse response first

      // Check success from the response data, not just response.ok
      if (!response.ok || !data.success) {
        return {
          success: data.success,
          message: data.message || "Failed to add coupon.",
        };
      }

      // Update state
      setCoupons(coupons.concat(data.coupon));

      return { success: data.success, message: data.message || "Coupon added." };
    } catch (error) {
      console.error("Error adding coupon:", error);
      return { success: false, message: "Server error" };
    }
  };

  // Delete a coupon
  const deleteCoupon = async (id) => {
    // Delete a coupon from backend
    const response = await fetch(`${host}/api/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": token
      }
    });

    if (!response.ok) throw new Error("Delete to fetch coupons.");

    // Delete the coupon from frontend
    const newCoupons = coupons.filter((coupon) => { return coupon._id !== id });
    setCoupons(newCoupons);
  }

  return (
    <CouponContext.Provider value={{ coupons, getAllCoupons, addCoupon, deleteCoupon, loading }}>
      {props.children}
    </CouponContext.Provider>
  )
}

export default CouponState;
