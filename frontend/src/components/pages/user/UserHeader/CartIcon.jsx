// components/UserHeader/CartIcon.jsx
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function CartIcon({ token, count }) {
  const navigate = useNavigate();

  return (
    <Link
      to={token ? "/cart" : "#"}
      onClick={(e) => {
        if (!token) {
          e.preventDefault();
          navigate("/login/user");
        }
      }}
      className="relative bg-green-100 p-3 rounded-full hover:bg-green-200 transition-colors"
    >
      <FaShoppingCart className="text-2xl cursor-pointer text-gray-600 hover:text-green-800" />
      {token && count > 0 && (
        <span className="absolute top-0 right-0 bg-[#2E7D32] text-white rounded-full text-xs px-1.5 py-0.5">
          {count}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;
