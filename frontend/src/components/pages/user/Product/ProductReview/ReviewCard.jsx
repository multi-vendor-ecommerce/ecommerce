import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
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
      <span className="text-xs text-gray-400">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
};

export default ReviewCard;
