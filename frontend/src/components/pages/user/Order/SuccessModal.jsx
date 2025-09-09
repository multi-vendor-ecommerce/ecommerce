import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SuccessModal({ isOpen, onClose, message }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isOpen) {
      // Update dimensions when modal opens
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Only show confetti when dimensions are set */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={250}
        />
      )}
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Order Placed!</h2>
        <p className="text-gray-700">{message || "Thank you for shopping with us."}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
