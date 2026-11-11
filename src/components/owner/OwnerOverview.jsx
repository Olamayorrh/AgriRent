import {
  PackageIcon,
  ClipboardListIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyIcon,
  TractorIcon,
  LocationIcon,
  PlusIcon,
  PencilIcon,
  ToggleIcon,
} from "./OwnerIcons";

const OwnerOverview = ({
  currentUser,
  myEquipments = [],
  requests = [],
  onNavigate,
  onOpenPostModal,
  onEditEquipment,
  onToggleAvailability,
  isLoading = false,
}) => {
  const rawName = currentUser?.name?.trim() || currentUser?.full_name?.trim() || "";
  const firstName = rawName.split(" ")[0] || "Owner";

  // KPI calculations
  const totalListings = myEquipments.length;
  const availableCount = myEquipments.filter((e) => e.available).length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedOrActive = requests.filter(
    (r) => r.status === "Approved" || r.status === "In Use"
  ).length;
  const completedRentals = requests.filter((r) => r.status === "Completed").length;

  const totalEarnings = requests
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  const recentEquipments = myEquipments.slice(0, 3);
  const recentRequests = requests.slice(0, 4);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700",
          dot: "bg-amber-400",
          label: "Pending Review",
        };
      case "Approved":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          dot: "bg-emerald-500",
          label: "Approved & Scheduled",
        };
      case "In Use":
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-700",
          dot: "bg-blue-500",
          label: "Active In Field",
        };
      case "Completed":
        return {
          bg: "bg-gray-100 border-gray-200 text-gray-700",
          dot: "bg-gray-400",
          label: "Completed",
        };
      case "Declined":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-700",
          dot: "bg-rose-400",
          label: "Declined",
        };
      default:
        return {
          bg: "bg-gray-100 border-gray-200 text-gray-600",
          dot: "bg-gray-300",
          label: status,
        };
    }
  };

  const SkeletonCard = () => (
    <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 bg-gray-200 rounded-full w-24" />
        <div className="w-9 h-9 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-8 bg-gray-200 rounded-full w-16 mt-2" />
      <div className="h-3 bg-gray-100 rounded-full w-32 mt-2" />
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--secondary-color)] via-[#153a2b] to-[#0c805d] text-white p-6 sm:p-8 lg:p-10 shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-24 -mb-10 w-44 h-44 rounded-full bg-[var(--primary-color)]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl xl:max-w-2xl space-y-2.5 xl:space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs xl:text-sm font-semibold text-[var(--primary-color)]">
              <span>🚜 Fleet Operations Active</span>
              <span>•</span>
              <span className="text-white/90">Machinery Provider Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-[var(--primary-color)]">{firstName}!</span>
            </h2>
            <p className="text-xs sm:text-sm xl:text-base text-gray-200 leading-relaxed">
              Post agricultural machinery, adjust daily rental rates, control availability in
              real-time, and manage booking requests placed by local farmers.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenPostModal || (() => onNavigate("my-equipment"))}
              className="px-6 xl:px-7 py-3.5 xl:py-4 rounded-2xl text-sm xl:text-base font-bold bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#e6ab67] shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95"
            >
              <PlusIcon className="w-5 h-5 xl:w-6 xl:h-6 text-[var(--secondary-color)]" />
              <span>Post New Equipment</span>
            </button>
            <button
              onClick={() => onNavigate("rental-requests")}
              className="px-5 xl:px-6 py-3.5 xl:py-4 rounded-2xl text-sm xl:text-base font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <ClipboardListIcon className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>
                Rental Requests {pendingRequests > 0 && `(${pendingRequests})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 xl:gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Total Listings */}
            <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Fleet Listings
                </span>
                <span className="p-2 xl:p-2.5 rounded-xl bg-emerald-50 text-[var(--secondary-color)]">
                  <PackageIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-gray-900">
                {totalListings}
              </p>
              <p className="text-[11px] xl:text-xs text-gray-400 mt-1">
                {availableCount} currently active for hire
              </p>
            </div>

            {/* Pending Requests */}
            <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-semibold text-amber-700 uppercase tracking-wider">
                  Pending Review
                </span>
                <span className="p-2 xl:p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <ClockIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-amber-600">
                {pendingRequests}
              </p>
              <p className="text-[11px] xl:text-xs text-gray-400 mt-1">
                Awaiting your approval
              </p>
            </div>

            {/* In Field / Approved */}
            <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  Active / In Use
                </span>
                <span className="p-2 xl:p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircleIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-emerald-600">
                {approvedOrActive}
              </p>
              <p className="text-[11px] xl:text-xs text-gray-400 mt-1">
                Scheduled or operating on farms
              </p>
            </div>

            {/* Total Rental Revenue */}
            <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </span>
                <span className="p-2 xl:p-2.5 rounded-xl bg-[var(--secondary-color)]/10 text-[var(--secondary-color)]">
                  <CurrencyIcon className="w-4 h-4 xl:w-5 xl:h-5" />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[var(--secondary-color)]">
                ₦{totalEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] xl:text-xs text-gray-400 mt-1">
                From {completedRentals} completed rental(s)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Quick Fleet Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Your Posted Machinery
            </h3>
            <p className="text-xs text-gray-500">
              Active equipment visible in Farmer Marketplace
            </p>
          </div>
          <button
            onClick={() => onNavigate("my-equipment")}
            className="text-xs sm:text-sm font-semibold text-[var(--secondary-color)] hover:underline cursor-pointer"
          >
            Manage Fleet ({myEquipments.length}) →
          </button>
        </div>

        {myEquipments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center space-y-3">
            <TractorIcon className="w-14 h-14 mx-auto text-gray-300" />
            <h4 className="text-base font-bold text-gray-900">No machinery posted yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Start earning by listing your tractors, harvesters, or implements for nearby farmers
              to discover and rent.
            </p>
            <button
              onClick={onOpenPostModal || (() => onNavigate("my-equipment"))}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4 text-[var(--primary-color)]" />
              <span>Post Your First Equipment</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentEquipments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-100">
                        <TractorIcon className="w-12 h-12 text-[var(--secondary-color)] opacity-40" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[var(--secondary-color)] shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Availability Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1 ${
                          item.available
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-700/80 text-white"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.available ? "bg-white animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[var(--secondary-color)] transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <LocationIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Condition:{" "}
                      <span className="font-medium text-gray-700">{item.condition || "Good"}</span>
                    </p>
                  </div>
                </div>

                {/* Footer with Rate and Action Buttons */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Daily Rate</span>
                    <span className="text-sm sm:text-base font-extrabold text-[var(--secondary-color)]">
                      ₦{item.dailyRate?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Availability Toggle */}
                    <button
                      onClick={() => onToggleAvailability && onToggleAvailability(item.id)}
                      title={item.available ? "Mark as Unavailable" : "Mark as Available"}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        item.available
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {item.available ? "Pause" : "Activate"}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditEquipment && onEditEquipment(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[var(--secondary-color)] hover:bg-[#143225] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Rental Requests Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Incoming Rental Requests</h3>
            <p className="text-xs text-gray-500">
              Farmers requesting your machinery — review and update status
            </p>
          </div>
          <button
            onClick={() => onNavigate("rental-requests")}
            className="text-xs sm:text-sm font-semibold text-[var(--secondary-color)] hover:underline cursor-pointer"
          >
            View All ({requests.length}) →
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <ClipboardListIcon className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No rental requests placed yet</p>
            <p className="text-xs text-gray-400">
              When farmers book your equipment from Marketplace, requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((req) => {
              const badge = getStatusBadge(req.status);
              return (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-gray-100/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                      {req.equipmentImage ? (
                        <img
                          src={req.equipmentImage}
                          alt={req.equipmentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50">
                          <TractorIcon className="w-5 h-5 text-[var(--secondary-color)] opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {req.equipmentName}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        Farmer: <span className="font-medium text-gray-700">{req.farmerName}</span> •{" "}
                        {req.farmLocation || req.location} • {req.startDate} ({req.durationDays || 1} day
                        {(req.durationDays || 1) !== 1 ? "s" : ""})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-xs sm:text-sm font-extrabold text-[var(--secondary-color)]">
                      ₦{req.totalAmount?.toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] xl:text-xs font-semibold border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <button
                      onClick={() => onNavigate("rental-requests")}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-[var(--secondary-color)] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOverview;
