import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import ProductGrid from "../Product/ProductGrid";
import { useContext } from "react";
import usePaginatedProducts from "../../../../hooks/usePaginatedProducts";

export default function SearchPage() {
  const { searchProducts } = useContext(ProductContext);
  const location = useLocation();
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";

  const { products, loading, hasMore, fetchMore } = usePaginatedProducts(
    searchProducts,
    { q },
    12
  );

  return (
    <div className="py-6 bg-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Search Results {q ? `for "${q}"` : ""}
        </h2>

        {loading && products.length === 0 ? (
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
