import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHeader from "./UserHeader/UserHeader";
import Home from "./Home/Home";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import UserFooter from "./UserFooter/UserFooter";
import UserProfile from "./Profile/UserProfile";
import Order from "./Profile/Order";
import Address from "./Profile/Address";
import PaymentSuccess from "./Checkout/PaymentSuccess";
import Wishlist from "./Cart/Wishlist";
const User = () => {
  return (
    <div>
      {/* Shared Header */}
      <UserHeader />
      {/* All User Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />}>
          <Route
            index
            element={<div>Welcome to your dashboard, Sandhya 💜</div>}
          />
          <Route path="orders" element={<Order />} />
          <Route path="address" element={<Address />} />
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <UserFooter /> {/* 👈 Always at bottom */}
    </div>
  );
};

export default User;
