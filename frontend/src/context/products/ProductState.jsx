import { useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Role + Token utility
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    if (adminToken) {
      return { role: "admin" };
    } else if (vendorToken) {
      return { role: "vendor" };
    } else {
      return { role: "customer" };
    }
  };

  // Secure fetch wrapper with if-else token logic
  const fetchProducts = async (url, role) => {
    try {
      setLoading(true);
      const headers = { "Content-Type": "application/json" };

      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

      const res = await fetch(url, { method: "GET", headers });
      if (!res.ok) throw new Error("Failed to fetch products.");

      const data = await res.json();
      return {
        products: data.products || [],
        total: data.total || 0,
        success: data.success,
      };
    } catch (err) {
      console.error("Product fetch error:", err);
      return { products: [], total: 0, success: false, categoryStats: [] };
    } finally {
      setLoading(false);
    }
  };

  // Get all products (public/vendor/admin)
  const getAllProducts = async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
    const { role } = getRoleInfo();

    const params = new URLSearchParams({ page, limit });
    if (search.trim()) params.append("search", search);

    // Always show only approved products to customers/public
    if (role === "customer") {
      params.append("status", "approved");
    } else if ((role === "admin" || role === "vendor") && status) {
      params.append("status", status);
    }

    let endpoint;
    if (role === "customer") endpoint = "/api/products";
    else endpoint = `/api/products/${role}`;

    const url = `${host}${endpoint}?${params}`;
    const data = await fetchProducts(url, role);

    if (data.success) {
      setProducts(data.products);
      setTotalCount(data.total);
    }

    return data;
  };

  // Top Selling Products
  const getTopSellingProducts = async ({ limit = 10, skip = 0 } = {}) => {
    const { role } = getRoleInfo();

    const params = new URLSearchParams({ limit, skip });

    let endpoint;
    if (role === "customer") endpoint = "/api/products/top-products";
    else endpoint = `/api/products/${role}/top-products`;

    const url = `${host}${endpoint}?${params}`;
    const data = await fetchProducts(url, role);

    return {
      products: data.products,
      total: data.total,
      limit,
      categoryStats: data.categoryStats || [],
    };
  };

  // Product by ID (public/admin/vendor)
  const getProductById = async (id) => {
    try {
      const { role } = getRoleInfo();

      let endpoint;
      if (role === "customer") endpoint = `/api/products/product/${id}`;
      else endpoint = `/api/products/${role}/${id}`;

      const headers = { "Content-Type": "application/json" };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

      const response = await fetch(`${host}${endpoint}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch product.");
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // Products by Category
  const getProductsByCategoryId = async (categoryId) => {
    try {
      const response = await fetch(`${host}/api/products/category/${categoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products by category.");
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  // Add product (admin/vendor only)
  const addProduct = async (formData) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/products/add-product`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("vendorToken"),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add product.");
      return data;
    } catch (error) {
      console.error("Error adding product:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Approve product (admin only)
  const approveProduct = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/products/admin/${id}/approve`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("adminToken"),
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to approve product.");
      return data;
    } catch (error) {
      console.error("Error approving product:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        totalCount,
        getAllProducts,
        getProductById,
        getProductsByCategoryId,
        addProduct,
        getTopSellingProducts,
        approveProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductState;
