import React from "react";
import { useContext, useState } from "react";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import ProductReviewContext from "../../../../../context/productReview/ProductReviewContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewCard = ({ review }) => {
  const { markReviewHelpful } = useContext(ProductReviewContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleHelpfulClick = async () => {
    if (loading) return;
    setLoading(true);

    const result = await markReviewHelpful(review._id);

    if (!result.success) {
      if (result.message?.toLowerCase().includes("unauthorized")) {
        navigate(`/login/user?redirect=${encodeURIComponent(location.pathname)}`);
      } else {
        toast.success(result.message || "Action completed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{review.user?.name}</span>
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700">{review.comment}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>

        <button
          onClick={handleHelpfulClick}
          disabled={loading}
          className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-medium 
              text-sm transition duration-200 
              hover:bg-green-100 hover:text-green-800 
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
        `}>
          <FaThumbsUp className="w-4 h-4" />
          {loading ? "Marking..." : "Helpful"} ({review.helpfulCount || 0})
        </button>

      </div>
    </div>
  );
};

export default ReviewCard;
