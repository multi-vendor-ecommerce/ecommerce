import { Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
// import UserFooter from "./UserFooter/UserFooter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./Home/Home";

import ProductsByCategory from "./Product/ProductsByCategory";
import ProductDetails from "./Product/ProductDetails";
import CartPage from "./Cart/CartPage";

export default function User() {

  return (
    <>

      <UserHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<ProductsByCategory />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />

      </Routes>
      {/* <UserFooter /> */}
    </>
  );
}
