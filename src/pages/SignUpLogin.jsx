import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/images/Logo.png";
import arrow from "../assets/images/arrowLeft.png";
import icon1 from "../assets/images/farmIcon.png";
import icon2 from "../assets/images/machineIcon.png";
import apple from "../assets/images/apple1.png";
import facebook from "../assets/images/facebook1.png";
import google from "../assets/images/google1.png";
import logo1 from "../assets/images/carbon_car.png";
import logo2 from "../assets/images/carbon_sprout.png";
import veri from "../assets/images/verified.png";
import loginLogo from "../assets/images/loginLogo.png";
import { useLocation, useNavigate } from "react-router";
import { userContext } from "../components/Context.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

const SignUpLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

 
  const {
    data,
    isFarmer,
    handleInput,
    handleRoleSelect,
    handleSignup,
    handleLogin,
    showSuccessModal,
    handleContinueToLogin,
  } = useContext(userContext);

  useEffect(() => {
    setIsLogin(isLoginPage);
  }, [isLoginPage]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#f4f7f4]">
      <div className="w-full max-w-[62rem] flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Left Side Banner (visible on medium screens and up) */}
        <div className="hidden md:flex md:w-[38%] lg:w-[35%] p-6 lg:p-8 text-white bg-[var(--secondary-color)] flex-col justify-between">
          <div className="flex flex-col items-center justify-center my-auto text-center">
            <div className="flex flex-col w-full items-center">
              {isLogin ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 lg:w-20 mb-3">
                    <img
                      src={loginLogo}
                      alt="AgriRent"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="text-[var(--primary-color)] my-2 font-bold text-lg lg:text-xl">
                    <p>
                      Welcome Back to <br /> AgriRent
                    </p>
                  </div>
                  <div className="italic text-xs lg:text-sm text-gray-200 mt-2 leading-relaxed max-w-[240px]">
                    <p>
                      Access your dashboard to browse available machinery, track
                      rental requests, or manage your active equipment listings.
                    </p>
                  </div>
                </div>
              ) : isFarmer ? (
                <div
                  onClick={() => handleRoleSelect("Farmer")}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <img
                    className="w-10 lg:w-12 my-3"
                    src={logo2}
                    alt="farmer logo"
                  />
                  <p className="text-[var(--primary-color)] font-bold text-base lg:text-lg my-1">
                    I'm a farmer
                  </p>
                  <div className="flex flex-col my-3 text-sm lg:text-base font-semibold">
                    <p>Rent Machinery,</p>
                    <p>Boost Your Yield.</p>
                  </div>
                  <p className="text-xs lg:text-sm italic text-gray-200 leading-relaxed max-w-[240px]">
                    Access top-quality tractors and equipment from verified
                    local owners without the high cost of ownership.
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => handleRoleSelect("Equipment Owner")}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <img
                    className="w-10 lg:w-12 my-3"
                    src={logo1}
                    alt="equipment owner logo"
                  />
                  <p className="text-[var(--primary-color)] font-bold text-base lg:text-lg my-1">
                    I'm an equipment Owner!
                  </p>
                  <div className="flex flex-col my-3 text-sm lg:text-base font-semibold">
                    <p>List Your Equipment,</p>
                    <p>Earn Daily.</p>
                  </div>
                  <p className="text-xs lg:text-sm italic text-gray-200 leading-relaxed max-w-[240px]">
                    Put your idle farm machinery to work and generate steady
                    income with transparent, secure rentals.
                  </p>
                </div>
              )}
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center justify-center gap-2 mt-auto pt-4 text-[11px] lg:text-xs text-gray-200 border-t border-white/10">
              <img
                src={veri}
                alt="verified"
                className="w-5 h-5 object-contain"
              />
              <p>Secure accounts powered by AgriRent</p>
            </div>
          )}
        </div>

        
        <div className="w-full md:w-[62%] lg:w-[65%] p-4 sm:p-7 lg:p-9 flex flex-col justify-center bg-stone-50">
          {/* Top Bar: Logo & Back Home */}
          <div className="flex w-full items-center justify-between mb-2">
            <img
              src={logo}
              alt="logo"
              className="w-16 sm:w-20 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <button
              type="button"
              className="flex items-center gap-1.5 p-1.5 text-xs sm:text-sm font-medium text-[var(--secondary-color)] hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={arrow}
                alt="Home Page"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
              <p>Back Home</p>
            </button>
          </div>

          {/* Tab Control */}
          <div className="bg-[#f0f4f0] text-[var(--secondary-color)] rounded-xl p-1 sm:p-1.5 w-full my-3 flex gap-1">
            <button
              type="button"
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? "bg-white shadow-sm text-[var(--secondary-color)]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
            <button
              type="button"
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? "bg-white shadow-sm text-[var(--secondary-color)]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>

          
          <div className="my-2">
            {isLogin ? (
              <div>
                <h4 className="text-[var(--primary-color)] text-xs sm:text-sm font-semibold mb-1">
                  Welcome back
                </h4>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Sign in to AgriRent
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  Access your bookings, assets and messages
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Create your account
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  Start with the account details you'll use to sign in
                </p>
              </div>
            )}
          </div>

          
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div
                className={`cursor-pointer border rounded-2xl p-3 sm:p-4 transition-all flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 ${
                  isFarmer
                    ? "border-green-600 bg-green-50 shadow-sm ring-1 ring-green-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleRoleSelect("Farmer")}
              >
                <img
                  src={icon1}
                  alt="Farmer"
                  className="w-6 h-6 sm:w-7 sm:h-7 mb-0 sm:mb-1 shrink-0"
                />
                <div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900">
                    Farmer
                  </p>
                  <p className="text-gray-500 text-[11px] sm:text-xs">
                    I want to rent machinery
                  </p>
                </div>
              </div>

              <div
                className={`cursor-pointer border rounded-2xl p-3 sm:p-4 transition-all flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 ${
                  !isFarmer
                    ? "border-green-600 bg-green-50 shadow-sm ring-1 ring-green-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleRoleSelect("Equipment Owner")}
              >
                <img
                  src={icon2}
                  alt="Equipment Owner"
                  className="w-6 h-6 sm:w-7 sm:h-7 mb-0 sm:mb-1 shrink-0"
                />
                <div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900">
                    Equipment Owner
                  </p>
                  <p className="text-gray-500 text-[11px] sm:text-xs">
                    I want to list my assets
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={
              isLogin
                ? (e) => handleLogin(e, navigate)
                : (e) => handleSignup(e, navigate)
            }
          >
            {!isLogin && (
              <div className="flex flex-col mb-2 sm:mb-3">
                <label
                  className="text-xs sm:text-sm font-medium text-[var(--secondary-color)]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  required
                  name="name"
                  id="name"
                  value={data.name || ""}
                  onChange={handleInput}
                  className="w-full border bg-slate-100 p-2.5 sm:p-3 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-[var(--secondary-color)] placeholder-gray-400 mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
                />
              </div>
            )}

            
            <div className="flex flex-col mb-2 sm:mb-3">
              <label
                className="text-xs sm:text-sm font-medium text-[var(--secondary-color)]"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={
                  isLogin ? "Enter Your Email" : "Your Email Address"
                }
                className="w-full border bg-slate-100 p-2.5 sm:p-3 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-[var(--secondary-color)] placeholder-gray-400 mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
                required
                value={data.email || ""}
                onChange={handleInput}
              />
            </div>

          
            {!isLogin && (
              <>
                <div className="flex flex-col mb-2 sm:mb-3">
                  <label
                    className="text-xs sm:text-sm font-medium text-[var(--secondary-color)]"
                    htmlFor="location"
                  >
                    Farm Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Town or Region"
                    value={data.location || ""}
                    onChange={handleInput}
                    className="w-full border bg-slate-100 p-2.5 sm:p-3 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-[var(--secondary-color)] placeholder-gray-400 mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
                  />
                </div>

                <div className="flex flex-col mb-2 sm:mb-3">
                  <label
                    className="text-xs sm:text-sm font-medium text-[var(--secondary-color)]"
                    htmlFor="number"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    placeholder="+254 700 000 000"
                    required
                    value={data.number || ""}
                    onChange={handleInput}
                    className="w-full border bg-slate-100 p-2.5 sm:p-3 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-[var(--secondary-color)] placeholder-gray-400 mt-1 outline-none focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
                  />
                </div>
              </>
            )}

           
            <div className="flex flex-col mb-2 sm:mb-3">
              <label
                className="text-xs sm:text-sm font-medium text-[var(--secondary-color)]"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isLogin ? "Enter Your Password" : "Create Password"
                  }
                  required
                  id="password"
                  name="password"
                  value={data.password || ""}
                  onChange={handleInput}
                  className="w-full border bg-slate-100 p-2.5 sm:p-3 pr-11 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-[var(--secondary-color)] placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-gray-500 hover:text-gray-700 p-1 cursor-pointer focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye Off (Close eye icon) */
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    /* Eye On (Open eye icon) */
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start text-[11px] sm:text-xs gap-2.5 text-[var(--secondary-color)] my-2">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 rounded cursor-pointer"
                />
                <p>
                  I agree to agriRent's terms and confirm that the information
                  provided is accurate
                </p>
              </div>
            )}

            {isLogin && (
              <a
                href="#"
                className="block text-end text-xs sm:text-sm text-[var(--secondary-color)] underline decoration-[var(--primary-color)] decoration-2 my-1"
              >
                Forgot Password
              </a>
            )}

            <div className="my-3 sm:my-4 w-full">
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 bg-[var(--secondary-color)] hover:bg-[#122b1d] text-sm sm:text-base font-semibold text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </div>

            <div className="flex justify-center">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {isLogin ? "Or Continue with" : "Or Sign Up with"}
              </p>
            </div>

            <div className="flex justify-center my-3 gap-6 sm:gap-8">
              <img
                src={google}
                alt="google logo"
                className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:scale-110 transition-transform"
              />
              <img
                src={facebook}
                alt="facebook logo"
                className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:scale-110 transition-transform"
              />
              <img
                src={apple}
                alt="apple logo"
                className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:scale-110 transition-transform"
              />
            </div>

            {/* Switch link */}
            <p className="flex justify-center items-center my-4 text-xs sm:text-sm gap-1.5">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <a
                href="#"
                className="font-bold text-[var(--primary-color)] hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(isLogin ? "/signup" : "/login");
                }}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </a>
            </p>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onContinue={() => handleContinueToLogin(navigate)}
      />
    </div>
  );
};

export default SignUpLogin;