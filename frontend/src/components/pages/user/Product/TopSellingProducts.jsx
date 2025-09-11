import { useContext } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import InfiniteScroller from "../../../common/InfiniteScroller";
import { encryptData } from "../Utils/Encryption";
import { useNavigate } from "react-router-dom";

const TopSellingProducts = () => {
  const navigateTo = useNavigate();
  const { getTopSellingProducts } = useContext(ProductContext);

  const fetchTopProducts = async (page = 1, limit) => {
    const data = await getTopSellingProducts({ limit, page });
    return data.products;
  };

  const handleProductClick = (productId) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedProductId = encryptData(productId, secretKey);
    navigateTo(`/product/${encodeURIComponent(encryptedProductId)}`);
  };

  return (
    <section className="px-7 py-6 min-w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-start tracking-tight">
        Top Selling Products
      </h2>

      <div className="mt-6 w-full">
        <InfiniteScroller
          fetchData={fetchTopProducts}
          orientation="horizontal"
          pageSize={10}
          renderItem={(product) => (
            <div
              key={product._id}
              className="w-[240px] p-3 cursor-pointer flex-shrink-0 rounded-2xl 
                         bg-white shadow border border-green-500 transition-all duration-300 
                         hover:scale-105 hover:shadow-md hover:shadow-green-500"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="w-full h-44 rounded-xl object-cover bg-green-50"
              />
              <p className="mt-2 text-center text-sm font-medium text-gray-700 line-clamp-1">
                {product.title}
              </p>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default TopSellingProducts;
