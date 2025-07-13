import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductState from "./context/products/ProductState";
import VendorState from "./context/vendors/VendorState";
import CategoryState from "./context/categories/CategoryState"

// Admin components
import Admin from "./components/pages/admin/Admin";

// User components
import User from "./components/pages/user/User";

function App() {
  return (
    <>
        <VendorState>
          <ProductState>
            <Router>
              <AppRoutes />
            </Router>
          </ProductState>
        </VendorState>
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
