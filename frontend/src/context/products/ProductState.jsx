import { useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Internal fetch handler
  const fetchProducts = async (url, isAdmin = false) => {
    try {
      setLoading(true);
      const headers = { "Content-Type": "application/json" };
      if (isAdmin) {
        headers["auth-token"] = localStorage.getItem("adminToken");
      }

      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) throw new Error("Failed to fetch products.");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Product fetch error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin - Get all products
  const getAllProducts = async ({ search = "", status = "" } = {}) => {
    const params = new URLSearchParams();
    if (search?.trim()) params.append("search", search);
    if (status) params.append("status", status);

    const url = `${host}/api/products/admin?${params.toString()}`;
    const data = await fetchProducts(url, true);
    if (data?.success) setProducts(data.products);
  };

  // Public - Get all products
  const getAllPublicProducts = async ({ search = "" } = {}) => {
    const params = new URLSearchParams();
    if (search?.trim()) params.append("search", search);

    const url = `${host}/api/products?${params.toString()}`;
    const data = await fetchProducts(url);
    if (data?.products) setProducts(data.products);
  };

  const getProductById = async (id) => {
    try {
      const response = await fetch(`${host}/api/products/admin/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("adminToken")
          }
        });
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const getPublicProductById = async (id) => {
    try {
      const response = await fetch(`${host}/api/products/product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product.');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching public product:', error);
    }
  };

  const getProductsByCategoryId = async (categoryId) => {
    try {
      const response = await fetch(`${host}/api/products/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products by category.');
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  // Add Product (Admin/Vendor)
  const addProduct = async (formData) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/products/add-product`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("adminToken"),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add product.");
      return data; // contains { success, message, product }
    } catch (error) {
      console.error("Error adding product:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, getAllProducts, getAllPublicProducts, getProductById, getPublicProductById, getProductsByCategoryId, addProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductState;
