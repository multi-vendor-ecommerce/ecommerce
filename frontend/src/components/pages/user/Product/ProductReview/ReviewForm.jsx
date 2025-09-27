import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import ProductReviewContext from "../../../../../context/productReview/ProductReviewContext";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const { addReview } = useContext(ProductReviewContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return toast.error("Please add rating and comment");

    setLoading(true);
    const res = await addReview(productId, rating, comment);
    setLoading(false);

    if (res?.success) {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      onReviewSubmit();
    } else {
      toast.error(res?.message || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <div className="flex items-center gap-2">
        <label className="font-medium">Rating:</label>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={() => setRating(i)}
            className={`cursor-pointer ${i <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            <FaStar />
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition"
        placeholder="Write your review..."
        rows={3}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
