import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScroller = ({
    fetchData,
    orientation,
    renderItem,
    pageSize = 10,
    initialData = []
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
        if (loadingRef.current) return; // Prevent concurrent loads
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
                loader={<p style={{ textAlign: "center" }}>Loading...</p>}
                endMessage={<div className="flex justify-center items-center w-40">No more data </div>}
                scrollableTarget="scrollableDiv"
                style={{
                    display: "flex",
                    flexDirection: orientation === "horizontal" ? "row" : "column"
                }}
                className="custom-scrollbar"
            >
                {data.map((item, index) => (
                    <div key={item._id || index} style={{ margin: 10 }}>
                        {renderItem(item)}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default InfiniteScroller;