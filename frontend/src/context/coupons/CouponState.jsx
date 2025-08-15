import { useState } from "react";
import CouponContext from "./CouponContext";

const CouponState = (props) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = http://localhost:5000

  // Get paginated coupons
  const getAllCoupons = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      const res = await fetch(`${host}/api/coupons?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch coupons.");
      const data = await res.json();

      if (data.success) {
        setCoupons(data.coupons);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error.message);
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
          "auth-token": localStorage.getItem("adminToken"),
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

  // Edit a coupon
  const editCoupon = async (id, form) => {
    try {
      const response = await fetch(`${host}/api/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken"),
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: data.success,
          message: data.message || "Failed to edit coupon.",
        };
      }

      // Update state
      setCoupons(coupons.map((coupon) => 
        coupon._id === id ? data.coupon : coupon
      ));

      return { success: data.success, message: data.message || "Coupon edited." };
    } catch (error) {
      console.error("Error editing coupon:", error);
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
        "auth-token": localStorage.getItem("adminToken"),
      }
    });

    if (!response.ok) throw new Error("Delete to fetch coupons.");

    // Delete the coupon from frontend
    const newCoupons = coupons.filter((coupon) => { return coupon._id !== id });
    setCoupons(newCoupons);
  }

  return (
    <CouponContext.Provider value={{ coupons, totalCount, getAllCoupons, addCoupon, editCoupon, deleteCoupon, loading }}>
      {props.children}
    </CouponContext.Provider>
  )
}

export default CouponState;
