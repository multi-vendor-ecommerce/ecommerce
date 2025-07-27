import { useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  // Admin: Fetch all products (with optional filters)
  const getAllAdminProducts = async ({ search = "", status = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(`${host}/api/products/admin?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch admin products");

      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Admin products error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Public: Fetch all approved products
  const getAllPublicProducts = async ({ search = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search);

      const res = await fetch(`${host}/api/products?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch public products");

      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Public products error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Public: Get product by ID
  const getProductByIdPublic = async (productId) => {
    try {
      const res = await fetch(`${host}/api/products/product/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch public product by ID: ${res.statusText}`);
      }

      const data = await res.json();
      return data.product || null;
    } catch (err) {
      console.error("Get public product by ID error:", err.message);
      return null;
    }
  };

  // Admin: Get product by ID
  const getProductByIdAdmin = async (id) => {
    try {
      const endpoint = `/api/products/admin/${id}`;
      const res = await fetch(`${host}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch admin product by ID: ${res.statusText}`);
      }

      const data = await res.json();
      return data.products || null;
    } catch (err) {
      console.error("Get admin product by ID error:", err.message);
      return null;
    }
  };

  // Public: Get products by category
  const getProductsByCategoryId = async (categoryId) => {
    try {
      const res = await fetch(`${host}/api/products/category/${categoryId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch products by category");

      const data = await res.json();
      return data.products;
    } catch (err) {
      console.error("Products by category error:", err.message);
      return [];
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        getAllAdminProducts,
        getAllPublicProducts,
        getProductByIdPublic,
        getProductByIdAdmin,
        getProductsByCategoryId,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductState;
