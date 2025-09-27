import React, { useEffect, useState, useContext } from "react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import Spinner from "../../../../common/Spinner";
import ProductReviewContext from "../../../../../context/productReview/ProductReviewContext";

const ProductReview = ({ productId }) => {
  const { reviews, getProductReviews } = useContext(ProductReviewContext);
  const [fetching, setFetching] = useState(true);

  const fetchReviews = async () => {
    setFetching(true);
    await getProductReviews(productId);
    setFetching(false);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return (
    <div className=" my-6 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      <ReviewForm productId={productId} onReviewSubmit={fetchReviews} />

      {fetching ? (
        <Spinner />
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4 w-full">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReview;
