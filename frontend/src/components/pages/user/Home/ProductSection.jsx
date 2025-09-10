import { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import ProductGrid from "../Product/ProductGrid";

export default function ProductSection({ title }) {
  const { getAllProducts } = useContext(ProductContext);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    const limit = 10;
    const data = await getAllProducts({ page: pageNum, limit });

    if (data?.success) {
      if (pageNum === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      setHasMore(data.products.length === limit);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="py-4">
      <div className="min-h-screen max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold py-4 text-gray-800 text-start">
          {title || "Products for you"}
        </h2>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            }
          >
            <ProductGrid products={products} secretKey={secretKey} />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
