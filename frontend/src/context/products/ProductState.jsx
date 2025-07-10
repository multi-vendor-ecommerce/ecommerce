import { useState } from "react";
import ProductContext from "./ProductContext";

const NoteState = (props) => {
  const [products, setProducts] = useState([]);

  const host = "http://localhost:5000";
  
  const getAllProducts = async () => {
    try {
      const response = await fetch(`${host}/api/products/admin`);
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }

      const data = await response.json();
      setProducts(data.products);
      console.log(data.products)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return (
    <ProductContext.Provider value={{ products, getAllProducts }}>
      {props.children}
    </ProductContext.Provider>
  )
}

export default NoteState;