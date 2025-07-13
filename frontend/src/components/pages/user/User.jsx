import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
// import UserFooter from "./UserFooter/UserFooter";

import Home from "./Home/Home";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import Cart from "./Cart/Cart";
import { CartProvider } from "../user/Cart/CartContext";
import Checkout from "./Checkout/Checkout";
import PaymentSuccess from "./Checkout/PaymentSuccess";
import Wishlist from "./Cart/Wishlist";

import UserProfile from "./Profile/UserProfile";
import Address from "./Profile/Address";

import ProductSection from "./Home/ProductSection";
import ProductDetails from "./Product/ProductDetail";

import Account from "./Account/Account";

import Order from "./Order/Order";
import OrderDetails from "./Order/OrderDetails";
export default function User() {
  return (
    <>
      <CartProvider>
        <UserHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/address" element={<Address />} />
          <Route
            path="/products"
            element={<ProductSection title="All Products" />}
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="Account" element={<Account />} />

          <Route path="/order" element={<Order />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
        </Routes>
        {/* <UserFooter /> */}
      </CartProvider>
    </>
  );
}
