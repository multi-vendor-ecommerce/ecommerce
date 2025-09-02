// TopSellingProducts.jsx
import { useContext } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import InfiniteScroller from "../../../common/InfiniteScroller"; // common component import

const TopSellingProducts = () => {
    const { getTopSellingProducts } = useContext(ProductContext);

    // API ko InfiniteScroller ke format me wrap karna
    const fetchTopProducts = async (page, limit) => {
        const skip = (page - 1) * limit;
        const data = await getTopSellingProducts({ limit, skip });
        return data.products; // InfiniteScroller expects array
    };

    return (
        <section className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Top Selling Products</h2>

            <InfiniteScroller
                fetchData={fetchTopProducts}   //  data fetch
                orientation="horizontal"       //  horizontal scroll
                pageSize={10}                  //  ek baar me kitne items
                renderItem={(product, index) => ( // har product render kaise hoga
                    <div
                        key={`${product._id}-${index}`}
                        className="min-w-[200px] border p-3 rounded shadow bg-white flex-shrink-0"
                    >
                        <img
                            src={product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded"
                        />
                        <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
                    </div>
                )}
            />
        </section>
    );
};

export default TopSellingProducts;
