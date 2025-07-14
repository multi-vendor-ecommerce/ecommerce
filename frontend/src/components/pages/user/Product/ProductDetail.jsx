import { useEffect, useState, useContext } from "react";
import { decryptData } from "../Utils/Encryption";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";

export default function YourComponent() {
  const { getProductsByCategoryId } = useContext(ProductContext);

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const [decryptedURLId, setDecryptedURLId] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
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
        setCategoryProducts(products || []);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Category Products</h2>
      <p className="text-sm text-gray-500 mb-6">Decrypted Category ID: {decryptedURLId}</p>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-48 object-cover bg-red-500"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-blue-600 font-bold">${product.price}</p>
                <p className="text-sm text-gray-500">
                  Category: {product.category?.name || "Uncategorized"}
                </p>
                <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}
