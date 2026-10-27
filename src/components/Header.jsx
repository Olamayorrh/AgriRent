import React, { useState } from "react";
import logo from "../assets/images/Logo.png";
import "../assets/css/global.css";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = ["Home", "How it Works", "About Us"];

  return (
    <nav className="w-full flex items-center justify-around text-[var(--secondary-color)] relative">
      {/* Logo */}
      <div className="w-[20%] flex justify-center p-2">
        <img src={logo} alt="company logo" className="w-[10rem] lg:w-[14.0rem]" />
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center justify-around gap-[3.0rem] text-[2.5rem] w-[45%] p-2 cursor-pointer">
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

      {/* Desktop Auth Buttons */}
      <div className="hidden lg:flex items-center justify-around text-[2.5rem] w-[35%] p-2 cursor-pointer">
        <button className="border-2 border-[var(--secondary-color)] rounded-2xl px-8 py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200">
          Log In
        </button>
        <button className="text-white bg-[var(--secondary-color)] rounded-2xl px-8 py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200">
          Sign Up
        </button>
      </div>

      {/* Hamburger Button — mobile/tablet only */}
      <button
        className="lg:hidden flex flex-col justify-center items-center gap-[5px] p-3 ml-auto mr-4"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
        <span className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-[2.8rem] h-[3px] bg-[var(--secondary-color)] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center gap-4 py-6 text-[1.8rem]">
          {menuItems.map((item) => {
            const isActive = activeMenu === item;
            return (
              <button
                key={item}
                onClick={() => { setActiveMenu(item); setMenuOpen(false); }}
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

          {/* Auth buttons inside mobile menu */}
          <div className="flex gap-4 mt-2">
            <button className="border-2 border-[var(--secondary-color)] rounded-2xl px-6 py-2 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200 text-[1.6rem]">
              Log In
            </button>
            <button className="text-white bg-[var(--secondary-color)] rounded-2xl px-6 py-2 hover:bg-[var(--primary-color)] transition-all duration-200 text-[1.6rem]">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
