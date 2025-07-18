import { FaHeart, FaRandom, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../Cart/CartContext";

function UserHeader() {
  const { cartItems } = useCart();

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="bg-white py-3 shadow-sm z-40 lg:px-16">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap">
            <span className="text-user-dark">CLASSY</span>SHOP
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-3 py-2 border border-user-primary rounded-l-md focus:outline-none text-user-dark"
            />
            <button className="bg-user-primary px-3 text-white font-semibold rounded-r-md">
              <FaSearch />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-user-dark text-lg whitespace-nowrap">
            <NavLink to="/admin" className="font-bold ">Admin</NavLink>
            <Link to="/login" className="hover:text-user-primary hidden sm:block">
              Login / Register
            </Link>
            <Link to="/wishlist">
              <FaHeart className="cursor-pointer hover:text-user-primary" />
            </Link>
            <FaRandom className="cursor-pointer hover:text-user-primary" />
            <Link to="/cart" className="relative">
              <FaShoppingCart className="hover:text-user-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-user-primary text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="w-full px-4 mt-3 block lg:hidden">
          <div className="flex">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-3 py-2 border border-user-primary rounded-l-md focus:outline-none text-user-dark"
            />
            <button className="bg-user-primary px-3 text-white font-semibold rounded-r-md">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
