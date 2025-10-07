// components/UserHeader/UserHeader.jsx
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import CartContext from "../../../../context/cart/CartContext";
import PersonContext from "../../../../context/person/PersonContext";
import WishlistContext from "../../../../context/wishlist/WishlistContext";
import AuthContext from "../../../../context/auth/AuthContext";
import { toTitleCase } from "../../../../utils/titleCase";
import Tobbar from "./Tobbar";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import UserMenu from "./UserMenu";

function UserHeader() {
  const { cart, getCart } = useContext(CartContext);
  const { person, getCurrentPerson, logout } = useContext(PersonContext);
  const { wishlist, getWishlist } = useContext(WishlistContext);
  const { authTokens } = useContext(AuthContext);

  const token = localStorage.getItem("customerToken") || authTokens?.customer;

  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch data if logged in
  useEffect(() => {
    if (token) {
      getCurrentPerson();
      getCart();
      getWishlist();
    } else {
      setCartItemCount(0);
      setWishlistCount(0);
    }
  }, [token]);

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

  const handleLogout = () => {
    logout(person?.role || "customer");
  };

  const displayName = person?.name
    ? toTitleCase(person.name.split(" ")[0])
    : person?.email
    ? person.email.split("@")[0]
    : "User";

  return (
    <>
      <Tobbar />
      <header className="sticky top-0 w-full z-50 min-h-16 bg-[#E8F5E9] shadow-sm py-1">
        <div className="lg:px-16">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-user-primary whitespace-nowrap">
              <img src="/PrimaryLogo.jpg" alt="NOAH PLANET Logo" className="h-14 sm:h-17 rounded " />
            </Link>

            {/* Desktop Search */}
            <SearchBar />

            {/* Right Icons */}
            <div className="flex items-center gap-4 text-user-dark text-lg whitespace-nowrap">
              <WishlistIcon token={token} count={wishlistCount} />
              <CartIcon token={token} count={cartItemCount} />

              {!token ? (
                <Link to="/login/user" className="hover:text-user-primary text-md">
                  Sign In
                </Link>
              ) : person ? (
                <UserMenu person={person} displayName={displayName} logout={handleLogout} />
              ) : null}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="w-full px-4 block lg:hidden">
            <SearchBar mobile />
          </div>
        </div>
      </header>
    </>
  );
}

export default UserHeader;
