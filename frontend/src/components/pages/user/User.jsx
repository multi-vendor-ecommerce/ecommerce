import { Routes, Route } from "react-router-dom";

import UserHeader from "./UserHeader/UserHeader";
import Home from "./Home/Home";
import ProductsByCategory from "./Product/ProductsByCategory";
import ProductDetails from "./Product/ProductDetails";
import CartPage from "./Cart/CartPage";
import Profile from "../adminVendorCommon/settings/Profile";
import Security from "../adminVendorCommon/settings/Security";
import ProtectedRoute from "../../common/ProtectedRoute";
import UserFooter from "./UserFooter/UserFooter";

import OrderSummary from "./Order/OrderSummary";
import MyOrdersList from "./Order/MyOrders/MyOrdersList";
import MyOrderDetails from "./Order/MyOrders/MyOrderDetails";
import WishlistPage from "./Wishlist/WishlistPage";
import SearchPage from "./Home/SearchPage";

import Help from "./UserFooter/Help/Help";
import Contact from "./UserFooter/Contact";
import FAQ from "./UserFooter/FAQ";
import Returns from "./UserFooter/Returns";
import Privacy from "./UserFooter/Privacy";
import Terms from "./UserFooter/Terms";

export default function User() {
  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <UserHeader />

        <main className="bg-white">
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
              path="/customer/settings/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/settings/security"
              element={
                <ProtectedRoute>
                  <Security />
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
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders/:orderId"
              element={
                <ProtectedRoute>
                  <MyOrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SearchPage />} />

            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy-policy" element={<Privacy />} />
          </Routes>
        </main>

        <UserFooter />
      </div>
    </>
  );
}
