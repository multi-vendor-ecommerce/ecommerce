import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductState from "./context/products/ProductState";
import VendorState from "./context/vendors/VendorState";
import CategoryState from "./context/categories/CategoryState";
import UserState from "./context/user/UserState";
import CouponState from "./context/coupons/CouponState";
import AuthState from "./context/auth/AuthState";
import CartState from "./context/cart/cartState";
import OrderState from "./context/orders/OrderState";

// Person components
import Admin from "./components/pages/admin/Admin";
import User from "./components/pages/user/User";
import Vendor from "./components/pages/vendor/Vendor";

// Auth components
import UserRegister from "./components/common/register/UserRegister";
import AdminLogin from "./components/common/login/AdminLogin";
import UserLogin from "./components/common/login/UserLogin";

function App() {
  return (
    <>
      <AuthState>
        <OrderState>
          <CartState>
            <CouponState>
              <UserState>
                <CategoryState>
                  <VendorState>
                    <ProductState>
                      <Router>
                        <AppRoutes />
                      </Router>
                    </ProductState>
                  </VendorState>
                </CategoryState>
              </UserState>
            </CouponState>
          </CartState>
        </OrderState>
      </AuthState>
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login/">
        <Route path="user" element={<UserLogin />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="vendor" element={<AdminLogin />} />
      </Route>

      <Route path="/register/user" element={<UserRegister />} />

      {/* Role-Based Dashboards */}
      <Route path="/vendor/*" element={<Vendor />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/*" element={<User />} />
    </Routes>
  );
}

export default App;
