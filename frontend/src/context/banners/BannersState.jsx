import React, { useState } from "react";
import BannerContext from "./BannersContext";

const BannerState = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  // const host = "http://localhost:5000";

  // Fetch banners from backend
  const getBanners = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${host}/api/banners`);
      const data = await res.json();

      if (res.ok && data.success) {
        setBanners(data.banners || []);
      } else {
        setError(data.message || "Failed to fetch banners");
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Something went wrong while fetching banners");
    } finally {
      setLoading(false);
    }
  };

  // Optional: refresh banners manually
  const refreshBanners = () => getBanners();

  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        error,
        getBanners,
        refreshBanners,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export default BannerState;
