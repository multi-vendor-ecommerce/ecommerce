import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin components
import Admin from "./components/pages/admin/Admin";

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
    </Routes>
  );
}

export default App;
