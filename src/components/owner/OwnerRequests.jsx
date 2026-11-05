import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  ClipboardListIcon,
  CalendarIcon,
  LocationIcon,
  PhoneIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TractorIcon,
  SearchIcon,
  EyeIcon,
  CloseIcon,
  MoneyIcon,
} from "./OwnerIcons";
import { updateRequestStatus } from "../../services/equipmentService";

const OwnerRequests = ({ requests = [], onRefreshRequests }) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);

  const statusOptions = ["All", "Pending", "Approved", "In Use", "Completed", "Declined"];

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus =
        activeStatusFilter === "All" || r.status === activeStatusFilter;

      const matchesSearch =
        (r.farmerName && r.farmerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.equipmentName && r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.farmLocation && r.farmLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  }, [requests, activeStatusFilter, searchQuery]);

  // Handle owner status update
  const handleStatusChange = (requestId, newStatus, equipmentName) => {
    updateRequestStatus(requestId, newStatus);
    toast.success(`Request for "${equipmentName || "equipment"}" updated to "${newStatus}"!`);
    if (onRefreshRequests) onRefreshRequests();
    if (selectedRequestDetails && selectedRequestDetails.id === requestId) {
      setSelectedRequestDetails((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
          icon: ClockIcon,
          label: "Pending Review",
        };
      case "Approved":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircleIcon,
          label: "Approved & Scheduled",
        };
      case "In Use":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-300",
          dot: "bg-blue-500",
          icon: TractorIcon,
          label: "Operating in Field",
        };
      case "Completed":
        return {
          bg: "bg-gray-100 text-gray-800 border-gray-300",
          dot: "bg-gray-400",
          icon: CheckCircleIcon,
          label: "Completed",
        };
      case "Declined":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-300",
          dot: "bg-rose-500",
          icon: XCircleIcon,
          label: "Declined",
        };
      case "Cancelled":
        return {
          bg: "bg-gray-100 text-gray-500 border-gray-300",
          dot: "bg-gray-400",
          icon: XCircleIcon,
          label: "Cancelled by Farmer",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
          icon: ClockIcon,
          label: status,
        };
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const inUseCount = requests.filter((r) => r.status === "In Use").length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0">
      {/* Top Banner & Header */}
      <div className="bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Booking & Rental Management
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Incoming Rental Requests
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Review booking requests submitted by farmers. Accept or decline schedules, track
            machinery dispatch, and manage completed rentals in real-time.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            {pendingCount} Pending
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            {inUseCount} In Field
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            {completedCount} Completed
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farmer name, machinery, or farm location..."
              className="w-full pl-10 xl:pl-12 pr-4 py-2.5 xl:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs xl:text-sm text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveStatusFilter(opt)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusFilter === opt
                  ? "bg-[var(--secondary-color)] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <ClipboardListIcon className="w-14 h-14 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">No requests found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {activeStatusFilter !== "All"
              ? `There are currently no requests in "${activeStatusFilter}" status.`
              : "When farmers place rental requests for your machinery, they will be listed here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const badge = getStatusBadge(req.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl xl:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  {/* Equipment + Farmer basic info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      {req.equipmentImage ? (
                        <img
                          src={req.equipmentImage}
                          alt={req.equipmentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50">
                          <TractorIcon className="w-8 h-8 text-[var(--secondary-color)] opacity-60" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                          {req.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-900">
                        {req.equipmentName}
                      </h4>
                      <p className="text-xs text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          Farmer:{" "}
                          <strong className="text-gray-900">{req.farmerName}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                          <a
                            href={`tel:${req.farmerPhone}`}
                            className="text-[var(--secondary-color)] font-medium hover:underline"
                          >
                            {req.farmerPhone || "+234 801 234 5678"}
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Financial & Duration summary */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Agreed Cost
                      </span>
                      <span className="text-base sm:text-xl font-extrabold text-[var(--secondary-color)]">
                        ₦{req.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Duration
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-800">
                        {req.durationDays || 1} Day{(req.durationDays || 1) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Row: Dates, Delivery, Farm Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      Dates:{" "}
                      <strong className="text-gray-900">
                        {req.startDate} to {req.endDate || req.startDate}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">
                      Farm:{" "}
                      <strong className="text-gray-900 truncate">
                        {req.farmLocation || req.location || "Local Farm"}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TractorIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      Delivery:{" "}
                      <strong className="text-gray-900">
                        {req.deliveryOption || "Delivery to Farm"}
                      </strong>
                    </span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-xs text-gray-500 italic bg-amber-50/50 px-3 py-2 rounded-xl border border-amber-100">
                    Farmer's Note: "{req.notes}"
                  </p>
                )}

                {/* Action Buttons based on current status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setSelectedRequestDetails(req)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <EyeIcon className="w-4 h-4 text-gray-500" />
                    <span>View Full Details</span>
                  </button>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* When Pending: Approve or Decline */}
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(req.id, "Declined", req.equipmentName)
                          }
                          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(req.id, "Approved", req.equipmentName)
                          }
                          className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircleIcon className="w-4 h-4 text-[var(--primary-color)]" />
                          <span>Approve Booking</span>
                        </button>
                      </>
                    )}

                    {/* When Approved: Mark In Field */}
                    {req.status === "Approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(req.id, "In Use", req.equipmentName)
                        }
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <TractorIcon className="w-4 h-4 text-blue-200" />
                        <span>Dispatch to Farm (Mark In Use)</span>
                      </button>
                    )}

                    {/* When In Use: Mark Completed */}
                    {req.status === "In Use" && (
                      <button
                        onClick={() =>
                          handleStatusChange(req.id, "Completed", req.equipmentName)
                        }
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-emerald-200" />
                        <span>Mark Rental Completed</span>
                      </button>
                    )}

                    {req.status === "Completed" && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Rental Completed & Settled</span>
                      </span>
                    )}

                    {req.status === "Declined" && (
                      <button
                        onClick={() =>
                          handleStatusChange(req.id, "Approved", req.equipmentName)
                        }
                        className="text-xs font-semibold text-[var(--secondary-color)] hover:underline cursor-pointer"
                      >
                        Re-evaluate & Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Request Details Inspection Modal */}
      {selectedRequestDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedRequestDetails(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-50 text-[var(--secondary-color)]">
                  <ClipboardListIcon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Rental Order Details ({selectedRequestDetails.id})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Full verification info for equipment hire
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Equipment Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                  {selectedRequestDetails.equipmentImage && (
                    <img
                      src={selectedRequestDetails.equipmentImage}
                      alt={selectedRequestDetails.equipmentName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {selectedRequestDetails.equipmentName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Daily Rate: ₦{selectedRequestDetails.dailyRate?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Farmer Contact Information
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-500 text-xs block">Full Name</span>
                    <strong className="text-gray-900 text-sm">
                      {selectedRequestDetails.farmerName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Phone Number</span>
                    <strong className="text-gray-900 text-sm">
                      {selectedRequestDetails.farmerPhone || "+234 801 234 5678"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Email Address</span>
                    <span className="text-gray-800 text-sm">
                      {selectedRequestDetails.farmerEmail || "farmer@agrirent.com"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Farm Destination</span>
                    <strong className="text-gray-900 text-sm">
                      {selectedRequestDetails.farmLocation || "Farm location not specified"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Rental Schedule & Total */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Rental Period & Billing
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block">Start Date</span>
                    <span className="font-bold text-gray-900">
                      {selectedRequestDetails.startDate}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block">End Date</span>
                    <span className="font-bold text-gray-900">
                      {selectedRequestDetails.endDate || selectedRequestDetails.startDate}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block">Duration</span>
                    <span className="font-bold text-gray-900">
                      {selectedRequestDetails.durationDays || 1} Day(s)
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-emerald-700 block">Total Rental</span>
                    <span className="font-extrabold text-[var(--secondary-color)] text-base">
                      ₦{selectedRequestDetails.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequestDetails.notes && (
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Special Field Instructions
                  </h5>
                  <p className="p-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 text-xs leading-relaxed">
                    {selectedRequestDetails.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500">
                Created: {new Date(selectedRequestDetails.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;
