import { useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  // const host = "http://localhost:5000";

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
        message: data.message
      };
    } catch (err) {
      console.error("Product fetch error:", err);
      return { products: [], total: 0, success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get all products (public/vendor/admin)
  const getAllProducts = async ({ search = "", status = "", range = "", page = 1, limit = 10 } = {}) => {
    const { role } = getRoleInfo();

    const params = new URLSearchParams({ page, limit });
    if (String(search || "").trim()) params.append("search", search);
    if (String(range || "").trim()) params.append("range", range);

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
  const getTopSellingProducts = async ({ search = "", page = 1, limit = 10 } = {}) => {
    const { role } = getRoleInfo();

    const params = new URLSearchParams({ page, limit });
    if (String(search || "").trim()) {
      params.append("search", search);
    }

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
      setLoading(true);

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
    } finally {
      setLoading(false);
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

  // Add product (admin/vendor only)
  const editProduct = async (id, formData) => {
    const { role } = getRoleInfo();

    try {
      setLoading(true);

      const headers = {};
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

      const response = await fetch(`${host}/api/products/${role}/edit/${id}`, {
        method: "PUT",
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to edit product.");
      return data;
    } catch (error) {
      console.error("Error editing product:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin/vendor only)
  const deleteProduct = async (id, review) => {
    const { role } = getRoleInfo();

    try {
      setLoading(true);

      const headers = { "Content-Type": "application/json", };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

      const response = await fetch(`${host}/api/products/${role}/delete/${id}`, {
        method: role === "admin" ? "DELETE" : "PUT",
        headers,
        body: role === "admin" ? JSON.stringify({ review }) : null,
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to delete product.");
      return data;
    } catch (error) {
      console.error("Error deleting product:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product status (admin only)
  const updateProductStatus = async (id, status, review) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/products/admin/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken"),
        },
        body: JSON.stringify({ status, review }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to update product status.");
      return data;
    } catch (error) {
      console.error("Error updating product status:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // // Recently Viewed Products (Top 10 pending Buy Now)
  const getRecentlyViewedProducts = async () => {
    const { role } = getRoleInfo();

    if (role !== "customer") {
      console.warn("Recently viewed products are only for customers.");
      return [];
    }

    try {
      setLoading(true);

      const response = await fetch(`${host}/api/products/recently-viewed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch recently viewed products.");

      const data = await response.json();
      if (data.success) {
        return data.products || [];
      } else {
        return [];
      }
    } catch (err) {
      console.error("Error fetching recently viewed products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Search & filter products (customer only)
  const searchProducts = async ({
    q = "",
    minPrice = "",
    maxPrice = "",
    category = "",
    brand = "",
    colors = "",
    sizes = "",
    tags = "",
    sort = "",
    page = 1,
    limit = 20,
  } = {}) => {
    // force customer role for search (only approved products are shown)
    const role = "customer";

    try {
      setLoading(true);

      const params = new URLSearchParams({ page, limit });

      if (q.trim()) params.append("q", q);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (category) params.append("category", category);
      if (brand) params.append("brand", brand);       // multiple allowed: Nike,Adidas
      if (colors) params.append("colors", colors);   // multiple allowed: red,blue
      if (sizes) params.append("sizes", sizes);      // multiple allowed: M,L
      if (tags) params.append("tags", tags);         // multiple allowed: trending,new
      if (sort) params.append("sort", sort);         // priceLow, priceHigh, rating

      const url = `${host}/api/products/search?${params.toString()}`;

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch products.");

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalCount(data.total);
      }

      return data;
    } catch (error) {
      console.error("Error searching products:", error);
      return { products: [], total: 0, success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      totalCount,
      getAllProducts,
      getProductById,
      getProductsByCategoryId,
      addProduct,
      getTopSellingProducts,
      editProduct,
      deleteProduct,
      updateProductStatus,
      getRecentlyViewedProducts,
      searchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductState;
