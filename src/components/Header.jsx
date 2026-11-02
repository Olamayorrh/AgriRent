import React, { useState } from "react";
import logo from "../assets/images/Logo.png";
import "../assets/css/global.css";
import { useNavigate } from "react-router";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = ["Home", "How it Works", "About Us"];

  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-around text-[var(--secondary-color)] relative">
     
      <div className="w-[20%] flex justify-center p-2">
        <img
          src={logo}
          alt="company logo"
          className="w-[10rem] lg:w-[14.0rem] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      
      <div className="hidden md:flex items-center justify-around gap-[1.6rem] lg:gap-[3.0rem] text-[1.8rem] lg:text-[2.5rem] w-[45%] p-2 cursor-pointer">
        {menuItems.map((item) => {
          const isActive = activeMenu === item;
          return (
            <p key={item}>
              <button
                onClick={() => setActiveMenu(item)}
                className={`relative py-2 transition-colors duration-200
                  ${isActive ? "text-[var(--primary-color)] cursor-pointer" : "cursor-pointer"}`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-color)] rounded-full animate-fade-in" />
                )}
              </button>
            </p>
          );
        })}
      </div>

      
      <div className="hidden md:flex items-center justify-around gap-[1.2rem] lg:gap-[2.0rem] text-[1.6rem] lg:text-[2.2rem] w-[35%] p-2 cursor-pointer">
        <button
          onClick={() => navigate("/login")}
          className="border-2 border-[var(--secondary-color)] rounded-2xl px-5 lg:px-8 py-1.5 lg:py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200 cursor-pointer"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="text-white bg-[var(--secondary-color)] rounded-2xl px-5 lg:px-8 py-1.5 lg:py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200 cursor-pointer"
        >
          Sign Up
        </button>
      </div>

      
      <button
        className="md:hidden flex flex-col justify-center items-center gap-[5px] p-3 ml-auto mr-4 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}
        />
        <span
          className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
        />
      </button>

      
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center gap-4 py-6 text-[1.8rem]">
          {menuItems.map((item) => {
            const isActive = activeMenu === item;
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveMenu(item);
                  setMenuOpen(false);
                }}
                className={`relative py-2 px-4 transition-colors duration-200
                  ${isActive ? "text-[var(--primary-color)]" : "text-[var(--secondary-color)]"}`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-color)] rounded-full" />
                )}
              </button>
            );
          })}

          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="border-2 border-[var(--secondary-color)] rounded-2xl px-6 py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200 text-[1.6rem] cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setMenuOpen(false);
              }}
              className="text-white bg-[var(--secondary-color)] rounded-2xl px-6 py-2 hover:bg-[var(--primary-color)] transition-all duration-200 text-[1.6rem] cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
