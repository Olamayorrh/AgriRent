import { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/Logo.png";
import {
  MenuIcon,
  BellIcon,
  AvatarIcon,
  LogoutIcon,
  PackageIcon,
  ClipboardListIcon,
  ChartBarIcon,
  PlusIcon,
} from "./OwnerIcons";

const OwnerTopNav = ({
  currentUser,
  onLogout,
  onToggleMobileMenu,
  activeNav,
  setActiveNav,
  pendingCount = 0,
  isDbLoading = false,
  onRefreshData,
  onOpenPostModal,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const rawName = currentUser?.name?.trim() || currentUser?.full_name?.trim() || "";
  const firstName = rawName.split(" ")[0] || "Owner";

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
        return "Equipment Owner Dashboard";
      case "my-equipment":
        return "My Equipment Fleet";
      case "rental-requests":
        return "Incoming Rental Requests";
      case "earnings":
        return "Earnings & Analytics";
      case "settings":
        return "Settings & Fleet Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        <div className="lg:hidden flex items-center">
          <img src={logo} alt="AgriRent" className="h-8 w-auto object-contain" />
        </div>

        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl xl:text-2xl font-bold text-gray-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs xl:text-sm text-gray-500 font-medium">
            Welcome back, {firstName} • Manage listings & incoming rental requests
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* DB Status Badge */}
        <button
          onClick={onRefreshData}
          title={isDbLoading ? "Syncing with database..." : "Database live – click to refresh"}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] xl:text-xs font-semibold transition-all cursor-pointer ${
            isDbLoading
              ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {isDbLoading ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shrink-0" />
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>DB Live</span>
            </>
          )}
        </button>

        {/* Post Equipment Quick Button */}
        <button
          onClick={onOpenPostModal || (() => setActiveNav("my-equipment"))}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
        >
          <PlusIcon className="w-4 h-4 text-[var(--primary-color)]" />
          <span className="hidden sm:inline">Post Equipment</span>
          <span className="sm:hidden">Post</span>
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
              <div className="px-4 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {pendingCount} pending rental request{pendingCount !== 1 ? "s" : ""} to review
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                <div
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveNav("rental-requests");
                    setNotificationsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                      <ClipboardListIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {pendingCount > 0 ? "Pending Farmer Bookings" : "All Requests Handled"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {pendingCount > 0
                          ? `You have ${pendingCount} request(s) awaiting your decision.`
                          : "No unhandled requests at this time."}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">Live Update</span>
                    </div>
                  </div>
                </div>
                <div
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setActiveNav("earnings");
                    setNotificationsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <ChartBarIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Fleet Performance Active</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Check your rental revenue and machinery utilization rate.
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">Today</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    setActiveNav("rental-requests");
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
            <AvatarIcon className="w-9 h-9 text-xs" name={firstName} />

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">{firstName}</span>
              <span className="text-[10px] text-amber-700 font-medium">Equipment Owner</span>
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

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Signed in as Equipment Owner</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {currentUser?.name || currentUser?.full_name || "Equipment Owner"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || "owner@agrirent.com"}
                </p>
                {currentUser?.location && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <span>📍</span> {currentUser.location}
                  </p>
                )}
              </div>
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
                    setActiveNav("my-equipment");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  My Equipment Fleet
                </button>
                <button
                  onClick={() => {
                    setActiveNav("rental-requests");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  Rental Requests
                </button>
                <button
                  onClick={() => {
                    setActiveNav("earnings");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                >
                  Earnings & Analytics
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

export default OwnerTopNav;
