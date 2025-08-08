import { FaHeart, FaRandom, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import CartContext from "../../../../context/cart/CartContext";

function UserHeader() {
  const { cart } = useContext(CartContext);
  const [cartItemCount, setCartItemCount] = useState(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setCartItemCount(cart.reduce((count, item) => count + item.quantity, 0))
  }, [cart]);

  return (
    <header className="sticky top-0  bg-white/90 backdrop-blur-sm ">
      <div className="py-3 lg:px-16">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap"
          >
            <span className="text-user-dark">NOAH</span>PLANET
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-3 py-2 border border-user-primary rounded-l-md focus:outline-none text-user-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-user-primary px-3 text-white font-semibold rounded-r-md"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 text-user-dark text-lg whitespace-nowrap">
            <Link to="/login/user" className="hover:text-user-primary text-md">
              Sign In
            </Link>

            <Link
              to="/cart"
              className="relative bg-purple-100 p-3 rounded-full hover:bg-purple-200 transition-colors"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <FaShoppingCart className="text-2xl cursor-pointer hover:text-purple-800" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cartItemCount}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-user-primary px-3 text-white font-semibold rounded-r-md"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
