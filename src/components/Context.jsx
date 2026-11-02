import React, { createContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const userContext = createContext();


const API_BASE_URL = "";

const Context = ({ children }) => {
  const [page, setPage] = useState("Login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialUserDetail = {
    name: "",
    email: "",
    location: "",
    number: "",
    password: "",
    role: "Farmer",
  };

  const [data, setData] = useState(initialUserDetail);
  const [isFarmer, setIsFarmer] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser")) || null;
    } catch {
      return null;
    }
  });

  const handleSignUpToggle = () => {
    setPage("Sign Up");
  };

  const handleLoginToggle = () => {
    setPage("Login");
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (selectedRole) => {
    setIsFarmer(selectedRole === "Farmer");
    setData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  // Sign up handler 
  const handleSignup = async (event, navigate) => {
    if (event && event.preventDefault) event.preventDefault();

    if (
      !data.name.trim() ||
      !data.email.trim() ||
      !data.location.trim() ||
      !data.number.trim() ||
      !data.password.trim()
    ) {
      toast.error("Kindly fill in right detail");
      return;
    }

    const payload = {
      ...data,
      email: data.email.trim(),
      role: isFarmer ? "Farmer" : "Equipment Owner",
    };

    try {
    
      // const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload);
      // console.log("Axios signup response:", response.data);

      // Local storage signup
      const registeredUsers = JSON.parse(localStorage.getItem("user") || "[]");
      const emailExists = registeredUsers.some(
        (user) => user.email.trim().toLowerCase() === payload.email.toLowerCase()
      );

      if (emailExists) {
        toast.warning("An account with this email already exists. Please log in.");
        if (navigate) navigate("/login");
        return;
      }

      registeredUsers.push(payload);
      localStorage.setItem("user", JSON.stringify(registeredUsers));

      // Trigger success popup and react-toastify notification
      toast.success("Account created successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "SignUp failed. Please try again.");
    }
  };

  // Routing to signIn page on toastify popUp(continue)
  const handleContinueToLogin = (navigate) => {
    setShowSuccessModal(false);
    if (navigate) {
      navigate("/login");
    }
  };

  // Login handler
  const handleLogin = async (event, navigate) => {
    if (event && event.preventDefault) event.preventDefault();

    const credentials = {
      email: data.email.trim(),
      password: data.password,
    };

    try {
      
      // const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      // const foundUser = response.data.user;

      // logIn
      const registeredUsers = JSON.parse(localStorage.getItem("user") || "[]");
      const foundUser = registeredUsers.find(
        (user) =>
          user.email.trim().toLowerCase() === credentials.email.toLowerCase() &&
          user.password === credentials.password
      );

      if (foundUser) {
        toast.success("Login Successful!");
        setCurrentUser(foundUser);
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

        const role = foundUser.role?.trim().toLowerCase();
        if (role === "farmer") {
          if (navigate) navigate("/FarmerDashboard");
        } else if (role === "equipment owner") {
          if (navigate) navigate("/EquipOwnerDashboard");
        } else {
          toast.error("User role not recognised.");
        }
      } else {
        toast.error("Invalid email or password. Kindly check your details.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid email or password. Kindly check your details.");
    }
  };

  return (
    <userContext.Provider
      value={{
        page,
        data,
        setData,
        isFarmer,
        setIsFarmer,
        currentUser,
        showSuccessModal,
        setShowSuccessModal,
        handleContinueToLogin,
        handleInput,
        handleRoleSelect,
        handleSignup,
        handleLogin,
        handleLoginToggle,
        handleSignUpToggle,
      }}
    >
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </userContext.Provider>
  );
};

export default Context;