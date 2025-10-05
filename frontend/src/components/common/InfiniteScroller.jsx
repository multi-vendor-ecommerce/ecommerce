import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";

const InfiniteScroller = ({
  fetchData,
  orientation,
  renderItem,
  pageSize = 10,
  initialData = [],
  wrapperClassName = ""
}) => {
  const [data, setData] = useState(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialData.length > 0 ? 2 : 1);
  const loadingRef = useRef(false);

  // Only fetch on mount if no initialData
  useEffect(() => {
    if (initialData.length === 0) {
      loadMore();
    }
  }, []);

  const loadMore = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const newData = await fetchData(page, pageSize);
      if (!newData || newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setHasMore(false);
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <div
      id="scrollableDiv"
      className={`custom-scrollbar w-full flex ${orientation === "horizontal" ? "flex-row overflow-x-auto" : "flex-col overflow-y-auto"}`}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="w-[100vw] h-64 flex items-center justify-center">
            <Spinner />
          </div>
        }
        scrollableTarget="scrollableDiv"
        style={{
          flexDirection: orientation === "horizontal" ? "row" : "column"
        }}
        className={`custom-scrollbar flex ${wrapperClassName} h-auto`}
      >
        {data.map((item, index) => (
          <div key={item._id || index} className="mx-3.5 mt-2 mb-4">
            {renderItem(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScroller;