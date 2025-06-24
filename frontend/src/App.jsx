import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin components
import Admin from "./components/pages/admin/Admin";

// User components
import User from "./components/pages/user/User";

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/User" element={<User/>}/>
          </Routes>
  );
}

export default App;
