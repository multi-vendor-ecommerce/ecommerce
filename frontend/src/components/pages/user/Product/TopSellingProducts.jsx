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
        <section className="px-7 py-4 max-w-9xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 text-start">Top Selling Products</h2>

            <InfiniteScroller
                fetchData={fetchTopProducts}
                orientation="horizontal"
                pageSize={10}
                renderItem={(product) => (
                    <div
                        key={product._id}
                        className="min-w-[200px] p-3 cursor-pointer rounded shadow-md bg-gray flex-shrink-0 border border-[#43A047]"
                        onClick={() => handleProductClick(product._id)}
                    >
                        <img
                            src={product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-40  bg-green-50 rounded object-cover"
                        />
                    </div>
                )}
            />
        </section>
    );
};

export default TopSellingProducts;
