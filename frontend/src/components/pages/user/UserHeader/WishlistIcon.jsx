// components/UserHeader/WishlistIcon.jsx
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function WishlistIcon({ token, count }) {
  const navigate = useNavigate();

  return (
    <Link
      to={token ? "/wishlist" : "#"}
      onClick={(e) => {
        if (!token) {
          e.preventDefault();
          navigate("/login/user");
        }
      }}
      className="relative bg-[#E8F5E9] p-3 rounded-full hover:bg-pink-200 transition-colors"
    >
      <FaHeart
        className="text-2xl text-gray-600 cursor-pointer transition 
          duration-200 ease-in-out transform hover:scale-110 hover:text-pink-500"
        title="Favorite"
      />
      {token && count > 0 && (
        <span className="absolute top-0 right-0 bg-[#2E7D32] text-white rounded-full text-xs px-1.5 py-0.5">
          {count}
        </span>
      )}
    </Link>
  );
}

export default WishlistIcon;
