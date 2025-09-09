import { FaShoppingCart, FaSearch, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import CartContext from "../../../../context/cart/CartContext";
import PersonContext from "../../../../context/person/PersonContext";
import WishlistContext from "../../../../context/wishlist/WishlistContext";
import ProfileMenu from "../../adminVendorCommon/common/header/ProfileMenu";
import ProfileImage from "../../adminVendorCommon/common/header/ProfileImage";

function UserHeader() {
  const { cart, getCart } = useContext(CartContext);
  const { person, getCurrentPerson, logout } = useContext(PersonContext);
  const { wishlist, getWishlist } = useContext(WishlistContext);

  const [cartItemCount, setCartItemCount] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(localStorage.getItem("customerToken"));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const apiFetchedRef = useRef(false); // <-- ensure APIs called only once
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout(); // clear token & user state
    setToken(null);
    setCartItemCount(null);
    setWishlistCount(null);
    apiFetchedRef.current = false; // allow re-fetch on next login
  };

  // Update token on localStorage changes
  useEffect(() => {
    const onStorageChange = () => setToken(localStorage.getItem("customerToken"));
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Fetch user/cart/wishlist only once after login
  useEffect(() => {
    if (token && !apiFetchedRef.current) {
      apiFetchedRef.current = true;
      getCurrentPerson();
      getCart();
      getWishlist();
    }
  }, [token, getCurrentPerson, getCart, getWishlist]);

  // Update cart item count only when cart changes
  useEffect(() => {
    if (token && cart) {
      setCartItemCount(cart.reduce((count, item) => count + item.quantity, 0));
    }
  }, [cart, token]);

  // Update wishlist count only when wishlist changes
  useEffect(() => {
    if (token && wishlist) {
      setWishlistCount(wishlist.length);
    }
  }, [wishlist, token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const displayName = person?.name
    ? person.name.split(" ")[0]
    : person?.email
    ? person.email.split("@")[0]
    : "User";

  return (
    <header className="sticky top-0 bg-[#E8F5E9] z-30 shadow-sm py-1">
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
