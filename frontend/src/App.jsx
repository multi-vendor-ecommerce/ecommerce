import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin components
import Admin from "./components/pages/admin/Admin";


//User Components
// import UserHeader from "./components/pages/user/UserHeader/UserHeader";
import UserHeader from "./components/pages/user/UserHeader/UserHeader";
import Home from "./components/pages/user/Home/Home";

function App() {
  return (
    <>
      <Router>
        <UserHeader/>
        <AppRoutes />
      </Router>
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/UserHeader" element={<UserHeader/>}/>
      <Route path="/" element={<Home/>}/>
    </Routes>
  );
}

export default App;