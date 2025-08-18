import { Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
// import UserFooter from "./UserFooter/UserFooter";

import Home from "./Home/Home";
import ProductsByCategory from "./Product/ProductsByCategory";
import ProductDetails from "./Product/ProductDetails";
import CartPage from "./Cart/CartPage";
import Profile from "../adminVendorCommon/settings/Profile";
import ProtectedRoute from "../../common/ProtectedRoute";

import OrderSummary from "./Order/OrderSummary";
// import PaymentStep from "./Order/PaymentStep";
// import ReviewStep from "./Order/ReviewStep";
// import ShippingStep from "./Order/ShippingStep";

export default function User() {
  return (
    <>
      <UserHeader />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<ProductsByCategory />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-summary/:id"
          element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <UserFooter /> */}
    </>
  );
}
