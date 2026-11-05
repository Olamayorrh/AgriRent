import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const userContext = createContext();

const API_BASE_URL = "https://agrirent-api.onrender.com";

const Context = ({ children }) => {
  const [page, setPage] = useState("Login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Pure session state: local storage is completely disabled for authentication testing
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("agrirent_session_user")) || null;
    } catch {
      return null;
    }
  });

  // Purge any residual mock local storage users so testing is 100% verified against live backend
  useEffect(() => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("loggedInUser");
    } catch (e) {
      console.warn("Storage cleanup warning:", e);
    }
  }, []);

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

  // Sign up handler: STRICTLY LIVE BACKEND API ONLY (Local Storage disabled)
  const handleSignup = async (event) => {
    if (event && event.preventDefault) event.preventDefault();

    if (
      !data.name.trim() ||
      !data.email.trim() ||
      !data.location.trim() ||
      !data.number.trim() ||
      !data.password.trim()
    ) {
      toast.error("Kindly fill in all required fields.");
      return;
    }

    setIsLoading(true);

    // In the AgriRent backend API, roles are strictly "farmer" or "provider"
    const apiRole = isFarmer ? "farmer" : "provider";
    const apiPayload = {
      full_name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      location: data.location.trim(),
      phone_number: data.number.trim(),
      role: apiRole,
      password: data.password,
    };

    console.log(">>> [LIVE API SIGNUP REQUEST]", apiPayload);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, apiPayload);
      console.log("<<< [LIVE API SIGNUP SUCCESS RESPONSE]", response.data);

      toast.success(response.data?.message || "Account created successfully on backend API!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("<<< [LIVE API SIGNUP ERROR]", error);

      if (error.response) {
        const detail = error.response.data?.detail || error.response.data?.message;
        if (typeof detail === "string") {
          toast.error(detail);
        } else if (Array.isArray(detail) && detail[0]?.msg) {
          toast.error(`${detail[0].loc?.slice(-1)[0] || "Field"}: ${detail[0].msg}`);
        } else {
          toast.error("Signup failed on backend server.");
        }
      } else {
        toast.error("Network error: Unable to connect to backend at " + API_BASE_URL);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Routing to signIn page on toastify popUp(continue)
  const handleContinueToLogin = (navigate) => {
    setShowSuccessModal(false);
    if (navigate) {
      navigate("/login");
    }
  };

  // Login handler: STRICTLY LIVE BACKEND API ONLY (Local Storage disabled)
  const handleLogin = async (event, navigate) => {
    if (event && event.preventDefault) event.preventDefault();

    if (!data.email.trim() || !data.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    const credentials = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    console.log(">>> [LIVE API LOGIN REQUEST]", credentials);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, credentials);
      console.log("<<< [LIVE API LOGIN SUCCESS RESPONSE]", response.data);

      const apiUser = response.data?.data;
      if (apiUser) {
        const foundUser = {
          id: apiUser.id,
          name: apiUser.full_name || data.name,
          full_name: apiUser.full_name,
          email: apiUser.email,
          location: apiUser.location,
          number: apiUser.phone_number,
          phone_number: apiUser.phone_number,
          role: apiUser.role, // "farmer" or "provider"
        };

        toast.success(response.data?.message || "Login Successful via Backend API!");
        setCurrentUser(foundUser);

        // Store user in session storage only (cleared on browser close, no local storage)
        try {
          sessionStorage.setItem("agrirent_session_user", JSON.stringify(foundUser));
        } catch (storageErr) {
          console.warn("Session storage error:", storageErr);
        }

        // Route to dashboard based on role returned directly from the backend
        const role = (foundUser.role || "").trim().toLowerCase();
        if (role === "farmer") {
          if (navigate) navigate("/FarmerDashboard");
        } else if (role === "provider" || role === "equipment owner") {
          if (navigate) navigate("/EquipOwnerDashboard");
        } else {
          toast.error(`User role "${foundUser.role}" not recognised.`);
        }
      } else {
        toast.error("Unexpected response from backend server.");
      }
    } catch (error) {
      console.error("<<< [LIVE API LOGIN ERROR]", error);

      if (error.response) {
        const detail = error.response.data?.detail || error.response.data?.message;
        if (typeof detail === "string") {
          toast.error(detail);
        } else {
          toast.error("Invalid email address or password.");
        }
      } else {
        toast.error("Network error: Unable to connect to backend server at " + API_BASE_URL);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler to clear session state and return to landing page
  const handleLogout = (navigate) => {
    try {
      sessionStorage.removeItem("agrirent_session_user");
      localStorage.removeItem("loggedInUser");
    } catch (err) {
      console.error("Logout session error:", err);
    }
    setCurrentUser(null);
    toast.info("Logged out successfully");
    if (navigate) {
      navigate("/");
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
        isLoading,
        currentUser,
        setCurrentUser,
        showSuccessModal,
        setShowSuccessModal,
        handleContinueToLogin,
        handleInput,
        handleRoleSelect,
        handleSignup,
        handleLogin,
        handleLogout,
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
