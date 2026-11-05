import logo from "../../assets/images/Logo.png";
import {
  DashboardIcon,
  PackageIcon,
  ClipboardListIcon,
  ChartBarIcon,
  SettingsIcon,
  LogoutIcon,
  CloseIcon,
  AvatarIcon,
} from "./OwnerIcons";

const OwnerSideNav = ({
  activeNav,
  setActiveNav,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  currentUser,
  pendingRequestsCount = 0,
}) => {
  const firstName =
    (currentUser?.name || currentUser?.full_name || "")
      .trim()
      .split(" ")[0] || "Owner";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardIcon, badge: null },
    { id: "my-equipment", label: "My Equipment", icon: PackageIcon, badge: null },
    {
      id: "rental-requests",
      label: "Rental Requests",
      icon: ClipboardListIcon,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} New` : null,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
    { id: "earnings", label: "Earnings & Analytics", icon: ChartBarIcon, badge: null },
    { id: "settings", label: "Settings & Profile", icon: SettingsIcon, badge: null },
  ];

  const handleSelectNav = (id) => {
    setActiveNav(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-white overflow-y-auto">
      {/* Brand */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleSelectNav("dashboard")}
          >
            <img src={logo} alt="AgriRent Logo" className="h-9 w-auto object-contain" />
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Owner Role Tag */}
        <div className="mt-4 mb-6 px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Owner Portal
            </span>
          </div>
          <span className="text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-full font-medium border border-amber-100">
            Verified
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5 xl:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 xl:px-4 py-3 xl:py-3.5 rounded-xl text-sm xl:text-base font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[var(--secondary-color)] text-white shadow-md shadow-[#1B4332]/20 font-semibold"
                    : "text-gray-600 hover:text-[var(--secondary-color)] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "text-[var(--primary-color)] scale-105" : "text-gray-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] xl:text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : item.badgeColor || "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile + Logout */}
      <div className="pt-5 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
          <AvatarIcon className="w-10 h-10 text-sm" name={firstName} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {currentUser?.name || currentUser?.full_name || "Equipment Owner"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {currentUser?.email || "owner@agrirent.com"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200 transition-all duration-200 cursor-pointer hover:shadow-sm"
        >
          <LogoutIcon className="w-5 h-5 text-rose-600" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 lg:w-72 xl:w-80 shrink-0">
        <div className="fixed inset-y-0 left-0 w-64 lg:w-72 xl:w-80 bg-white border-r border-gray-100 z-30 h-screen h-[100dvh] flex flex-col">
          {navContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full h-[100dvh] min-h-screen shadow-2xl z-50 animate-in slide-in-from-left duration-300 flex flex-col bg-white">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerSideNav;
