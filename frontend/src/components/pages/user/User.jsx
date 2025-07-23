import { Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
// import UserFooter from "./UserFooter/UserFooter";

import Home from "./Home/Home";
import { CartProvider } from "../user/Cart/CartContext";

import ProductsByCategory from "./Product/ProductsByCategory";
import ProductDetails from "./Product/ProductDetails";

export default function User() {
  return (
    <>
      <CartProvider>
        <UserHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="product/category/:id" element={<ProductsByCategory />} />
          <Route path="product/:id" element={<ProductDetails />} />

        </Routes>
        {/* <UserFooter /> */}
      </CartProvider>
    </>
  );
}
