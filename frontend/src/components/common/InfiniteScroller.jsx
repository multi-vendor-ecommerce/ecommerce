import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScroller = ({
  fetchData,       // function: API call ya data fetch karne ka
  orientation,     // "horizontal" | "vertical"
  renderItem,      // function: har item ko kaise render karna hai
  pageSize = 10,   // ek call me kitne items
  initialData = [] // starting data agar available ho
}) => {
  const [data, setData] = useState(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  console.log("Orientation:", orientation);
  console.log("Data length:", data.length);
  console.log("Has more:", hasMore);
  console.log("data:", data);

  // first load
  useEffect(() => {
    if (initialData.length === 0) loadMore();
    // eslint-disable-next-line
  }, []);

  const loadMore = async () => {
    try {
      const newData = await fetchData(page, pageSize);
      if (!newData || newData.length === 0) {
        setHasMore(false);
        return;
      }
      setData(prev => [...prev, ...newData]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Error loading data:", err);
      setHasMore(false);
    }
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: orientation === "vertical" ? "80vh" : "auto",
        overflow: "auto",
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column"
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p style={{ textAlign: "center" }}>Loading...</p>}
        endMessage={<p style={{ textAlign: "center" }}>No more data </p>}
        scrollableTarget="scrollableDiv"
        style={{ display: "flex", flexDirection: orientation === "horizontal" ? "row" : "column" }}
      >
        {data.map((item, index) => (
          <div key={index} style={{ margin: 10 }}>
            {renderItem(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScroller;
