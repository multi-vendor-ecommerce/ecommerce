import React, { useEffect, useState, useContext } from "react";
import ProductGrid from "./ProductGrid";
import ProductContext from "../../../../context/products/ProductContext";

const RecentlyProductList = () => {
  const { getRecentlyViewedProducts } = useContext(ProductContext);
  const [recentProducts, setRecentProducts] = useState([]);
  
  // Use secret key from .env
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const products = await getRecentlyViewedProducts();
      setRecentProducts(products);
    };

    fetchRecentlyViewed();
  }, []);

  if (!recentProducts?.length) return null; 

  return (
    <div className="my-6 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>
      <ProductGrid products={recentProducts} secretKey={secretKey} />
    </div>
  );
};

export default RecentlyProductList;
