import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import CartContext from "../../../../context/cart/CartContext";
import PersonContext from "../../../../context/person/PersonContext";
import WishlistContext from "../../../../context/wishlist/WishlistContext"; import { FaHeart } from "react-icons/fa";

function UserHeader() {
  const { cart } = useContext(CartContext);
  const { person, getCurrentPerson } = useContext(PersonContext);
  const { wishlist, getWishlist } = useContext(WishlistContext);

  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(localStorage.getItem("customerToken"));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  //  Update token when storage changes
  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem("customerToken"));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  //  Fetch current user when logged in
  useEffect(() => {
    if (token) {
      getCurrentPerson();
      getWishlist();
    }
  }, [token]);

  //  Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Count cart items
  useEffect(() => {
    setCartItemCount(cart.reduce((count, item) => count + item.quantity, 0));
  }, [cart]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    setToken(null);
    setDropdownOpen(false);
    navigate("/");
  };

  // Get first name or email prefix for display
  const displayName = person?.name
    ? person.name.split(" ")[0]
    : person?.email
      ? person.email.split("@")[0]
      : "User";

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <div className=" lg:px-16">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          {/* <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap"
          >
            <span className="text-user-dark">NOAH</span>PLANET
          </Link> */}

          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap"
          >
            <img src="/PrimaryLogo.jpg" alt="NOAH PLANET Logo" className="h-19 sm:h-17 rounded" />
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
            {!token ? (
              <Link to="/login/user" className="hover:text-user-primary text-md">
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Icon */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-user-primary focus:outline-none cursor-pointer"
                >
                  <div className="bg-user-primary text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md cursor-pointer">
                    {displayName[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col cursor-pointer">
                    <span className="text-sm font-semibold">Hi, {displayName}</span>
                    <span className="text-xs text-gray-400">Welcome back!</span>
                  </div>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link
              to={token ? "/wishlist" : "#"}
              onClick={(e) => {
                if (!token) {
                  e.preventDefault();
                  navigate("/login/user");
                }
              }}
              className="relative bg-pink-100 p-3 rounded-full hover:bg-pink-200 transition-colors"
              aria-label={`Wishlist with ${wishlist.length} items`}
            >
              <FaHeart className="text-2xl cursor-pointer hover:text-pink-600" />
              {token && wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={token ? "/cart" : "#"}
              onClick={(e) => {
                if (!token) {
                  e.preventDefault();
                  navigate("/login/user");
                }
              }}
              className="relative bg-purple-100 p-3 rounded-full hover:bg-purple-200 transition-colors"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <FaShoppingCart className="text-2xl cursor-pointer hover:text-purple-800" />
              {token && cartItemCount > 0 && (
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
