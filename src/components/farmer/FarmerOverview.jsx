import {
  TractorIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  ClockIcon,
  LocationIcon,
  CalendarIcon,
  SproutIcon,
} from "./FarmerIcons";

const FarmerOverview = ({
  currentUser,
  requests = [],
  equipments = [],
  onNavigate,
  onOpenBookingModal,
  isLoading = false,
}) => {
  const rawName = currentUser?.name?.trim() || "";
  const firstName = rawName.split(" ")[0] || "Farmer";

  // Compute live dashboard metrics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedOrActive = requests.filter(
    (r) => r.status === "Approved" || r.status === "In Use"
  ).length;

  // Available equipments list
  const availableEquipments = equipments.filter((e) => e.available);
  const featuredEquipments = equipments.slice(0, 3);
  const recentRequests = requests.slice(0, 4);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700",
          dot: "bg-amber-400",
          label: "Pending Owner Approval",
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
          bg: "bg-gray-50 border-gray-200 text-gray-600",
          dot: "bg-gray-400",
          label: status,
        };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner with Book Equipment Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--secondary-color)] via-[#153a2b] to-[#0c805d] text-white p-6 sm:p-8 lg:p-10 shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute bottom-0 right-24 -mb-10 w-44 h-44 rounded-full bg-[var(--primary-color)]/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl xl:max-w-2xl space-y-2.5 xl:space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs xl:text-sm font-semibold text-[var(--primary-color)]">
              <span>🌾 Planting Season 2026</span>
              <span>•</span>
              <span className="text-white/90">Dry Season Irrigation Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">
              Welcome back, <span className="text-[var(--primary-color)]">{firstName}!</span>
            </h2>
            <p className="text-xs sm:text-sm xl:text-base text-gray-200 leading-relaxed">
              Find verified tractors, harvesters, and tilling implements from trusted equipment owners.
              Manage your rentals and monitor real-time booking approvals.
            </p>
          </div>

          {/* Marketplace Button (Prominent Call-to-Action) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("marketplace")}
              className="px-6 xl:px-7 py-3.5 xl:py-4 rounded-2xl text-sm xl:text-base font-bold bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#e6ab67] shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-95"
            >
              <TractorIcon className="w-5 h-5 xl:w-6 xl:h-6 text-[var(--secondary-color)]" />
              <span>Explore Marketplace</span>
            </button>
            <button
              onClick={() => onNavigate("my-requests")}
              className="px-5 xl:px-6 py-3.5 xl:py-4 rounded-2xl text-sm xl:text-base font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <ClipboardListIcon className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>My Requests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 xl:gap-6">
        {/* Total Bookings */}
        <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs xl:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Total Requests
            </span>
            <span className="p-2 xl:p-2.5 rounded-xl bg-emerald-50 text-[var(--secondary-color)]">
              <ClipboardListIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </span>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded-full w-14 animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-gray-900">{totalRequests}</p>
          )}
          <p className="text-[11px] xl:text-xs text-gray-400 mt-1">All time bookings placed</p>
        </div>

        {/* Pending Requests */}
        <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs xl:text-sm font-semibold text-amber-700 uppercase tracking-wider">
              Pending Approval
            </span>
            <span className="p-2 xl:p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <ClockIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </span>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded-full w-14 animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-amber-600">{pendingRequests}</p>
          )}
          <p className="text-[11px] xl:text-xs text-gray-400 mt-1">Awaiting owner review</p>
        </div>

        {/* Active & Approved */}
        <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs xl:text-sm font-semibold text-emerald-700 uppercase tracking-wider">
              Approved / Active
            </span>
            <span className="p-2 xl:p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircleIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </span>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded-full w-14 animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-emerald-600">{approvedOrActive}</p>
          )}
          <p className="text-[11px] xl:text-xs text-gray-400 mt-1">Scheduled or currently on farm</p>
        </div>

        {/* Available Equipment */}
        <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs xl:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Available Machinery
            </span>
            <span className="p-2 xl:p-2.5 rounded-xl bg-[var(--secondary-color)]/10 text-[var(--secondary-color)]">
              <TractorIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </span>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded-full w-14 animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[var(--secondary-color)]">
              {availableEquipments.length}
            </p>
          )}
          <p className="text-[11px] xl:text-xs text-gray-400 mt-1">Ready for immediate hire</p>
        </div>
      </div>

      {/* Featured Ready-to-Rent Equipment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Available Equipment Near You
            </h3>
            <p className="text-xs text-gray-500">Verified agricultural machinery ready for booking</p>
          </div>
          <button
            onClick={() => onNavigate("marketplace")}
            className="text-xs sm:text-sm font-semibold text-[var(--secondary-color)] hover:text-emerald-700 hover:underline cursor-pointer"
          >
            Explore Marketplace ({equipments.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading
            ? // Skeleton placeholder cards while equipment loads from DB
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="h-44 sm:h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                  </div>
                  <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded-full w-20" />
                    <div className="h-8 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
              ))
            : featuredEquipments.map((item) => (
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
                      <TractorIcon className="w-12 h-12 text-[var(--secondary-color)] opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[var(--secondary-color)] shadow-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                        item.available
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {item.available ? "Available" : "In Use"}
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
                    Owner: <span className="font-medium text-gray-700">{item.ownerName}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer with Rate and Book Equipment Button */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-gray-400 block">Daily Rate</span>
                  <span className="text-sm sm:text-base font-extrabold text-[var(--secondary-color)]">
                    ₦{item.dailyRate?.toLocaleString()}
                  </span>
                </div>
                {/* Book Equipment Button */}
                <button
                  onClick={() => onOpenBookingModal(item)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <TractorIcon className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                  <span>Book Equipment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Rental Requests Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Rental Requests</h3>
            <p className="text-xs text-gray-500">Live approval status from machinery owners</p>
          </div>
          <button
            onClick={() => onNavigate("my-requests")}
            className="text-xs font-semibold text-[var(--secondary-color)] hover:underline cursor-pointer"
          >
            Manage All Requests →
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TractorIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium">No equipment requests yet</p>
            <p className="text-xs text-gray-400 mt-1">Browse machinery and book your first rental</p>
            <button
              onClick={() => onNavigate("equipment-rental")}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--secondary-color)] text-white hover:bg-[#143225] cursor-pointer inline-flex items-center gap-2"
            >
              Browse Equipment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Equipment</th>
                  <th className="pb-3">Owner / Location</th>
                  <th className="pb-3">Rental Dates</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRequests.map((req) => {
                  const badge = getStatusBadge(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          {req.equipmentImage ? (
                            <img
                              src={req.equipmentImage}
                              alt={req.equipmentName}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-emerald-50 flex items-center justify-center shrink-0">
                              <TractorIcon className="w-5 h-5 text-[var(--secondary-color)] opacity-60" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{req.equipmentName}</p>
                            <span className="text-[10px] text-gray-400">{req.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-600">
                        <p className="font-medium text-gray-800">{req.ownerName}</p>
                        <p className="text-[11px] text-gray-400">{req.location}</p>
                      </td>
                      <td className="py-3.5 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {req.startDate} to {req.endDate}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({req.durationDays} {req.durationDays === 1 ? "day" : "days"})
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-[var(--secondary-color)]">
                        ₦{req.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => onNavigate("my-requests")}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--secondary-color)] bg-gray-100 hover:bg-[var(--secondary-color)] hover:text-white transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Farming Tips / Advisory banner */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <SproutIcon className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-900">
              Pro-Tip: Pre-book Harvesters 2 Weeks Early
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
              During peak harvesting season in South-West states, combine harvester demand peaks. Lock in
              your equipment early to prevent harvest delays.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("equipment-rental")}
          className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          Browse Equipment
        </button>
      </div>
    </div>
  );
};

export default FarmerOverview;
