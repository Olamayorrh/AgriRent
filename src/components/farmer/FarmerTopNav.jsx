import { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/Logo.png";
import {
  MenuIcon,
  BellIcon,
  SearchIcon,
  AvatarIcon,
  LogoutIcon,
  TractorIcon,
  CheckCircleIcon,
  ClockIcon,
} from "./FarmerIcons";

const FarmerTopNav = ({
  currentUser,
  onLogout,
  onToggleMobileMenu,
  activeNav,
  setActiveNav,
  pendingCount = 0,
  isDbLoading = false,
  onRefreshData,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Extract user's first name
  const rawName = currentUser?.name?.trim() || "";
  const firstName = rawName.split(" ")[0] || "Farmer";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeNav) {
      case "dashboard":
        return "Farmer Dashboard";
      case "marketplace":
      case "equipment-rental":
        return "Equipment Marketplace";
      case "my-requests":
        return "Rental Requests & Status";
      case "farm-plots":
      case "farm-management":
        return "Farm Management";
      case "settings":
        return "Settings & Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left side: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        {/* Mobile Logo if screen is small */}
        <div className="lg:hidden flex items-center">
          <img src={logo} alt="AgriRent" className="h-8 w-auto object-contain" />
        </div>

        {/* Desktop Title & Breadcrumb */}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl xl:text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
          <p className="text-xs xl:text-sm text-gray-500 font-medium">Welcome back, {firstName} • Plan your next harvest</p>
        </div>
      </div>

      {/* Middle: Search input (hidden on small mobile, visible on tablet & desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Discover machinery, tractors, harvesters in Marketplace..."
            className="w-full pl-10 pr-4 py-2 text-xs lg:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-700 transition-all placeholder:text-gray-400"
            onFocus={() => {
              if (activeNav !== "marketplace") setActiveNav("marketplace");
            }}
          />
        </div>
      </div>

      {/* Right side: Actions, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Marketplace Quick Button */}
        <button
          onClick={() => setActiveNav("marketplace")}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
        >
          <TractorIcon className="w-4 h-4 text-[var(--primary-color)]" />
          <span className="hidden sm:inline">Marketplace</span>
          <span className="sm:hidden">Market</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <BellIcon className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Notifications</span>
                <span className="text-xs text-gray-500 font-medium">
                  {pendingCount} Pending Updates
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {pendingCount === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  <div
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setActiveNav("my-requests");
                      setNotificationsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                        <ClockIcon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Pending Review</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          You have {pendingCount} rental request(s) awaiting owner review.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    setActiveNav("my-requests");
                    setNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-[var(--secondary-color)] hover:underline cursor-pointer"
                >
                  View All Requests
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info with Avatar + First Name */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
            aria-expanded={profileDropdownOpen}
          >
            {/* Default Avatar for profile pic */}
            <AvatarIcon className="w-9 h-9 text-xs" name={firstName} />

            {/* First Name close to profile pic */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">{firstName}</span>
              <span className="text-[10px] text-emerald-700 font-medium">Farmer</span>
            </div>

            <svg
              className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                profileDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header inside dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Signed in as Farmer</p>
                <p className="text-sm font-bold text-gray-900 truncate">{currentUser?.name || "Farmer User"}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email || "farmer@agrirent.com"}</p>
                {currentUser?.location && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                    <span>📍</span> {currentUser.location}
                  </p>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveNav("dashboard");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => {
                    setActiveNav("my-requests");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  My Rental Requests
                </button>
                <button
                  onClick={() => {
                    setActiveNav("settings");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  Account Settings
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-1.5 border-t border-gray-100">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogoutIcon className="w-4 h-4 text-rose-500" />
                  <span>Log Out of AgriRent</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default FarmerTopNav;
