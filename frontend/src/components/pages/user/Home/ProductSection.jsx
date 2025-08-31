import { useEffect, useContext } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import ProductGrid from "../Product/ProductGrid";

export default function ProductSection({ title }) {
  const { products, loading, getAllProducts } = useContext(ProductContext);
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-green-50 py-4">
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold py-4 text-gray-800 text-start">
          {title || "Products for you"}
        </h2>

        <ProductGrid products={products} secretKey={secretKey} />
      </div>
    </div>
  );
}
