import { useState, useEffect } from "react";

export default function usePaginatedProducts(fetchFn, initialQuery = {}, limit = 12) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (pageNum = 1, query = initialQuery, reset = false) => {
    setLoading(true);
    const data = await fetchFn({ ...query, page: pageNum, limit });

    if (data?.success) {
      if (reset || pageNum === 1) {
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

  const fetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, initialQuery);
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, initialQuery, true);
  }, [JSON.stringify(initialQuery)]);

  return { products, loading, hasMore, fetchMore };
}
