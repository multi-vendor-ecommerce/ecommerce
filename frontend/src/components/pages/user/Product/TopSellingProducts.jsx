// TopSellingProducts.jsx
import { useContext } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import InfiniteScroller from "../../../common/InfiniteScroller"; // common component import

const TopSellingProducts = () => {
    const { getTopSellingProducts } = useContext(ProductContext);

    // API ko InfiniteScroller ke format me wrap karna
    const fetchTopProducts = async (page = 1, limit) => {
        const data = await getTopSellingProducts({ limit, page });
        return data.products;
    };

    return (
        <section className="px-7 py-6 max-w-7xl bg-pink-500 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Top Selling Products</h2>
            <div
                className="overflow-x-auto cursor-grab active:cursor-grabbing"
                style={{ scrollBehavior: "smooth" }}
            >

                <InfiniteScroller
                    fetchData={fetchTopProducts}
                    orientation="horizontal"
                    pageSize={10}
                    renderItem={(product, index) => (
                        <div
                            key={product._id}
                            className="min-w-[200px] border p-3 rounded shadow bg-white flex-shrink-0 "
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
            </div>
        </section >
    );
};

export default TopSellingProducts;
