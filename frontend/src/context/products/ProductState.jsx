import { useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

  const getAllProducts = async ({ search = "", status = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);

      const response = await fetch(
        `${host}/api/products/admin?${params.toString()}`,
        {
          method: "GET",
          // credentials: "include",
        });
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const getProductById = async (id) => {
    try {
      const response = await fetch(`${host}/api/products/admin/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

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

  return (
    <ProductContext.Provider value={{ products, loading, getAllProducts, getProductById, getProductsByCategoryId }}>
      {props.children}
    </ProductContext.Provider>
  )
}

export default ProductState;
