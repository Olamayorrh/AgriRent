import React from "react";
import "./assets/css/global.css";
import SignUpLogin from "./pages/SignUpLogin";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import EquipOwner from "./pages/EquipOwner";








const App = () => {
  return (
    <div className="overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignUpLogin />} />
        <Route path="/signup" element={<SignUpLogin />} />
        <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/EquipOwnerDashboard" element={<EquipOwner />} />
        <Route path="/owner-dashboard" element={<EquipOwner />} />
        <Route path="/equipowner" element={<EquipOwner />} />
      </Routes>
    </div>
  );
};

export default App;
