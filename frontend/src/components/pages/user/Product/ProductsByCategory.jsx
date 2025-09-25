import { useEffect, useState, useContext } from "react";
import { decryptData } from "../Utils/Encryption";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import ProductGrid from "./ProductGrid";
import BackButton from "../../../common/layout/BackButton";

export default function ProductByCategory() {
  const { getProductsByCategoryId } = useContext(ProductContext);
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const [decryptedURLId, setDecryptedURLId] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const encodedUrlId = parts[parts.length - 1];

    try {
      const decodedUrlId = decodeURIComponent(decodeURIComponent(encodedUrlId));
      const decryptedId = decryptData(decodedUrlId, secretKey);
      setDecryptedURLId(decryptedId);
    } catch (error) {
      console.error("Error while decoding or decrypting:", error);
      setProductsLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (decryptedURLId) {
        setProductsLoading(true);
        const products = await getProductsByCategoryId(decryptedURLId);
        setProducts(products || []);
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [decryptedURLId, getProductsByCategoryId]);

  if (productsLoading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="bg-[#F9F7FC] min-h-screen">
      <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-3">
          <BackButton className="border-green-500 hover:bg-green-700" />
        </div>

        <ProductGrid products={products} secretKey={secretKey} />
      </div>
    </div>
  );
}
