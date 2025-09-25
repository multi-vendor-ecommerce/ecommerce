import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ className = "border-purple-500 hover:bg-purple-700" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center px-3 md:px-3.5 py-3 md:py-2 border text-black hover:text-white shadow-sm hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer ${className}`}
      title="Go Back"
    >
      <FiArrowLeft className="text-lg md:text-xl" />
    </button>
  );
};

export default BackButton;
