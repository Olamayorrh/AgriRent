import React from 'react'
import { useNavigate } from 'react-router';

const FarmerDashboard = () => {
    const navigate = useNavigate();
  return (
    <div className="flex justify-between p-[4rem]">
      <div>Welcome Farmer</div>
      <button onClick={() => navigate("/")}>Back Home</button>
    </div>
  );
}

export default FarmerDashboard;