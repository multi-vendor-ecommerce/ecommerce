import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductState from "./context/products/ProductState";
import VendorState from "./context/vendors/VendorState";
import CategoryState from "./context/categories/CategoryState";
import UserState from "./context/user/UserState";
import CouponState from "./context/coupons/CouponState";
import AuthState from "./context/auth/AuthState";
import CartState from "./context/cart/cartState";
import OrderState from "./context/orders/OrderState";
import PersonState from "./context/person/PersonState";
import PaymentState from "./context/paymentContext/PaymentState";
import AddressState from "./context/shippingAddress/AddressState";
import ImageState from "./context/images/ImageState";
import WishlistState from "./context/wishlist/WishlistState";

// Person components
import Admin from "./components/pages/admin/Admin";
import User from "./components/pages/user/User";
import Vendor from "./components/pages/vendor/Vendor";

// Login components
import AdminLogin from "./components/common/login/AdminLogin";
import UserLogin from "./components/common/login/UserLogin";
import VendorLogin from "./components/common/login/VendorLogin";

// Register components
import UserRegister from "./components/common/register/UserRegister";
import VendorRegister from "./components/common/register/VendorRegister";

function App() {
  return (
    <>
      <AuthState>
        <AddressState>
          <WishlistState>
            <ImageState>
              <PersonState>
                <OrderState>
                  <PaymentState>
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
                  </PaymentState>
                </OrderState>
              </PersonState>
            </ImageState>
          </WishlistState>
        </AddressState>
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
        <Route path="vendor" element={<VendorLogin />} />
        <Route path="admin" element={<AdminLogin />} />
      </Route>

      <Route path="/register/">
        <Route path="user" element={<UserRegister />} />
        <Route path="vendor" element={<VendorRegister />} />
      </Route>

      {/* Role-Based Dashboards */}
      <Route path="/*" element={<User />} />
      <Route path="/vendor/*" element={<Vendor />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}

export default App;
