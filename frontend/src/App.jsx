import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductState from "./context/products/ProductState";
import VendorState from "./context/vendors/VendorState";
import CategoryState from "./context/categories/CategoryState";
import UserState from "./context/user/UserState";

// Admin components
import Admin from "./components/pages/admin/Admin";

// User components
import User from "./components/pages/user/User";

function App() {
  return (
    <>
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
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/*" element={<User />} />
    </Routes>
  );
}

export default App;
