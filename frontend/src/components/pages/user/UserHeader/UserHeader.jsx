import { FaShoppingCart, FaSearch, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import CartContext from "../../../../context/cart/CartContext";
import PersonContext from "../../../../context/person/PersonContext";
import WishlistContext from "../../../../context/wishlist/WishlistContext";
import ProfileMenu from "../../adminVendorCommon/common/header/ProfileMenu";
import ProfileImage from "../../adminVendorCommon/common/header/ProfileImage";
import { toTitleCase } from "../../../../utils/titleCase";
import AuthContext from "../../../../context/auth/AuthContext";

function UserHeader() {
  const { cart, getCart } = useContext(CartContext);
  const { person, getCurrentPerson, logout } = useContext(PersonContext);
  const { wishlist, getWishlist } = useContext(WishlistContext);
  const { authTokens } = useContext(AuthContext);

  const token = authTokens?.customer; // ✅ direct from AuthContext
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch user/cart/wishlist once when logged in
  useEffect(() => {
    if (token) {
      getCurrentPerson();
      getCart();
      getWishlist();
    } else {
      setCartItemCount(0);
      setWishlistCount(0);
    }
  }, [token, getCurrentPerson, getCart, getWishlist]);

  useEffect(() => {
    if (cart) {
      setCartItemCount(cart.reduce((count, item) => count + item.quantity, 0));
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist) {
      setWishlistCount(wishlist.length);
    }
  }, [wishlist]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    logout(person?.role || "customer"); // clears AuthContext instantly
  };

  const displayName = person?.name
    ? toTitleCase(person.name.split(" ")[0])
    : person?.email
    ? person.email.split("@")[0]
    : "User";

  return (
    <header className="sticky top-0 w-full z-50 min-h-16 bg-[#E8F5E9] shadow-sm py-1">
      <div className="lg:px-16">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap">
            <img src="/PrimaryLogo.jpg" alt="NOAH PLANET Logo" className="h-19 sm:h-17 rounded" />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-3 py-2 bg-white border border-[#2E7D32] rounded-l-md focus:outline-none text-user-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#2E7D32] px-3 text-white font-semibold rounded-r-md"
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
            ) : person ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-user-primary focus:outline-none cursor-pointer"
                >
                  <ProfileImage person={person} />
                  <div className="hidden sm:flex flex-col cursor-pointer">
                    <span className="text-sm font-semibold">Hi, {displayName}</span>
                    <span className="text-xs text-gray-400">Welcome back!</span>
                  </div>
                </button>

                {dropdownOpen && <ProfileMenu logout={handleLogout} person={person} />}
              </div>
            ) : null}

            {/* Wishlist */}
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
              <FaHeart className="text-2xl cursor-pointer hover:text-[pink-600]" />
              {token && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#2E7D32] text-white rounded-full text-xs px-1.5 py-0.5">
                  {wishlistCount}
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
              className="w-full px-3 py-2 border border-[#2E7D32] rounded-l-md focus:outline-none text-user-dark"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#2E7D32] px-3 text-white font-semibold rounded-r-md"
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