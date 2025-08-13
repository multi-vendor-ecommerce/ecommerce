import { Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
// import UserFooter from "./UserFooter/UserFooter";

import Home from "./Home/Home";
import ProductsByCategory from "./Product/ProductsByCategory";
import ProductDetails from "./Product/ProductDetails";
import CartPage from "./Cart/CartPage";
import Checkout from "./Checkout/Checkout";
import Profile from "../adminVendorCommon/settings/Profile";
import ProtectedRoute from "../../common/ProtectedRoute";

export default function User() {
  return (
    <>
      <UserHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<ProductsByCategory />} />
        <Route path="product/:id" element={<ProductDetails />} />

        {/* Protected Routes */}
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <UserFooter /> */}
    </>
  );
}
