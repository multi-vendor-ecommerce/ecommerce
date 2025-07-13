import { useState } from "react";
import ProductContext from "./ProductContext";

const NoteState = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = "http://localhost:5000";
  
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${host}/api/products/admin`);
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

  return (
    <ProductContext.Provider value={{ products, loading, getAllProducts, getProductById }}>
      {props.children}
    </ProductContext.Provider>
  )
}

export default NoteState;
