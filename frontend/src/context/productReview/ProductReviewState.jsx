import React, { useState } from "react";
import ProductReviewContext from "./ProductReviewContext";

const ProductReviewState = ({ children }) => {

    // const host = import.meta.env.VITE_BACKEND_URL;
    const host = "http://localhost:5000";
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // Utility to detect role & return correct token
    const getRoleInfo = () => {
        const adminToken = localStorage.getItem("adminToken");
        const vendorToken = localStorage.getItem("vendorToken");
        const customerToken = localStorage.getItem("customerToken");

        if (adminToken) return { role: "admin", token: adminToken };
        if (vendorToken) return { role: "vendor", token: vendorToken };
        if (customerToken) return { role: "customer", token: customerToken };

        return { role: "guest", token: null };
    };

    // ================================
    // 1. Add Review
    // ================================
    const addReview = async (productId, rating, comment) => {
        const { token } = getRoleInfo();
        if (!token) return { success: false, message: "Unauthorized: Please log in" };

        try {
            setLoading(true);
            const res = await fetch(`${host}/api/product-reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({ productId, rating, comment }),
            });

            const data = await res.json();

            if (data.success) {
                setReviews((prev) => [data.review, ...prev]);
            }

            return data;
        } catch (err) {
            console.error("Add review error:", err);
            return { success: false, message: "Error adding review" };
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 2. Get Product Reviews
    // ================================
    const getProductReviews = async (productId) => {
        try {
            setLoading(true);
            const res = await fetch(`${host}/api/product-reviews/${productId}`);
            const data = await res.json();

            if (data.success) {
                setReviews(data.reviews);
            }

            return data;
        } catch (err) {
            console.error("Get reviews error:", err);
            return { success: false, message: "Error fetching reviews" };
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 3. Mark Review Helpful
    // ================================
    const markReviewHelpful = async (reviewId) => {
        const { token } = getRoleInfo();
        if (!token) return { success: false, message: "Unauthorized: Please log in" };

        try {
            const res = await fetch(`${host}/api/product-reviews/${reviewId}/helpful`, {
                method: "PUT",
                headers: {
                    "auth-token": token,
                },
            });

            const data = await res.json();

            if (data.success) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r._id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r
                    )
                );
            }

            return data;
        } catch (err) {
            console.error("Mark helpful error:", err);
            return { success: false, message: "Error marking helpful" };
        }
    };

    return (
        <ProductReviewContext.Provider
            value={{
                reviews,
                loading,
                addReview,
                getProductReviews,
                markReviewHelpful,
            }}
        >
            {children}
        </ProductReviewContext.Provider>
    );
};

export default ProductReviewState;
