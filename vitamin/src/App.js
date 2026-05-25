import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Detect from "./pages/Detect";
import NearbyDoctors from "./pages/NearbyDoctors";

import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* No chatbot */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* With chatbot */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Detect />} />
          <Route path="/doctors" element={<NearbyDoctors />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
