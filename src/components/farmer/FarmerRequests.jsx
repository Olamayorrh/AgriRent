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
} from "./FarmerIcons";
import {
  updateRequestStatus,
  cancelRentalRequest,
} from "../../services/equipmentService";

const FarmerRequests = ({ requests = [], onRefreshRequests, onNavigate }) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");

  const statusOptions = ["All", "Pending", "Approved", "In Use", "Completed", "Declined"];

  // Filter requests based on selected tab
  const filteredRequests = useMemo(() => {
    if (activeStatusFilter === "All") return requests;
    return requests.filter((r) => r.status === activeStatusFilter);
  }, [requests, activeStatusFilter]);

  // Handle Farmer Cancelling a pending request
  const handleCancelRequest = (requestId) => {
    if (window.confirm("Are you sure you want to cancel this equipment rental request?")) {
      cancelRentalRequest(requestId);
      toast.info("Rental request has been cancelled.");
      if (onRefreshRequests) onRefreshRequests();
    }
  };

  // Status simulation handler (allows testing owner actions on both ends)
  const handleOwnerStatusChange = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    toast.success(`Request status updated to "${newStatus}"!`);
    if (onRefreshRequests) onRefreshRequests();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
          icon: ClockIcon,
          desc: "Awaiting Owner Review. The equipment owner will review your dates and location.",
        };
      case "Approved":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircleIcon,
          desc: "Approved by Owner! Machinery is scheduled for dispatch / pickup.",
        };
      case "In Use":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-300",
          dot: "bg-blue-500",
          icon: TractorIcon,
          desc: "Active Rental in field. Machinery is currently operating on your farm.",
        };
      case "Completed":
        return {
          bg: "bg-gray-100 text-gray-800 border-gray-300",
          dot: "bg-gray-400",
          icon: CheckCircleIcon,
          desc: "Rental completed. Machinery safely returned to equipment owner.",
        };
      case "Declined":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-300",
          dot: "bg-rose-500",
          icon: XCircleIcon,
          desc: "Owner was unable to accept this request for selected dates.",
        };
      case "Cancelled":
        return {
          bg: "bg-gray-100 text-gray-500 border-gray-300",
          dot: "bg-gray-400",
          icon: XCircleIcon,
          desc: "Request cancelled by farmer.",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
          icon: ClockIcon,
          desc: "",
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs xl:text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Real-Time Request Lifecycle
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Rental Requests & Status
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1">
            Track equipment rental approvals between you and equipment owners on both ends
          </p>
        </div>

        <button
          onClick={() => onNavigate("marketplace")}
          className="self-start md:self-auto px-5 xl:px-6 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm xl:text-base font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-2"
        >
          <TractorIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[var(--primary-color)]" />
          <span>Rent More Equipment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((status) => {
          const count =
            status === "All"
              ? requests.length
              : requests.filter((r) => r.status === status).length;
          const isActive = activeStatusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatusFilter(status)}
              className={`px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-[var(--secondary-color)] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <ClipboardListIcon className="w-14 h-14 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">
            No {activeStatusFilter !== "All" ? activeStatusFilter : ""} Requests Found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You currently have no equipment rental requests matching this status filter.
          </p>
          <button
            onClick={() => onNavigate("marketplace")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] transition-colors cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            <TractorIcon className="w-4 h-4 text-[var(--primary-color)]" />
            <span>Browse Available Machinery</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const badge = getStatusBadge(req.status);
            const StatusIcon = badge.icon;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Request Header Bar */}
                <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-gray-800 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      {req.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted on: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{req.status}</span>
                    </span>
                  </div>
                </div>

                {/* Request Body */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Equipment Info (5 cols) */}
                  <div className="lg:col-span-5 flex items-start gap-4">
                    {req.equipmentImage ? (
                      <img
                        src={req.equipmentImage}
                        alt={req.equipmentName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 shrink-0 bg-gray-50"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-200 shrink-0 bg-emerald-50 flex items-center justify-center">
                        <TractorIcon className="w-10 h-10 text-[var(--secondary-color)] opacity-40" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-[10px] xl:text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        {req.category}
                      </span>
                      <h4 className="text-base xl:text-lg font-bold text-gray-900 leading-snug">
                        {req.equipmentName}
                      </h4>
                      <p className="text-xs xl:text-sm text-gray-500 flex items-center gap-1">
                        <LocationIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{req.location}</span>
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-xs xl:text-sm text-gray-700 font-medium">
                          Owner: <strong>{req.ownerName}</strong>
                        </span>
                        {req.ownerPhone && (
                          <a
                            href={`tel:${req.ownerPhone}`}
                            className="inline-flex items-center gap-1 text-[11px] xl:text-xs text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded-md"
                          >
                            <PhoneIcon className="w-3 h-3" />
                            <span>Call Owner</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Rental Schedule & Delivery Details (4 cols) */}
                  <div className="lg:col-span-4 space-y-2 text-xs text-gray-600 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-semibold">Booking Duration:</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                        {req.durationDays} {req.durationDays === 1 ? "day" : "days"} ({req.startDate} → {req.endDate})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-semibold">Farm Location:</span>
                      <span className="font-medium text-gray-800 truncate max-w-[180px]">
                        {req.farmLocation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-semibold">Logistics:</span>
                      <span className="font-medium text-gray-800">{req.deliveryOption}</span>
                    </div>

                    {req.notes && (
                      <p className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-100">
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right: Price & Lifecycle Actions (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-3">
                    <div>
                      <span className="text-[10px] xl:text-xs text-gray-400 uppercase font-semibold block lg:text-right">
                        Total Rental Amount
                      </span>
                      <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-[var(--secondary-color)] lg:text-right">
                        ₦{req.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-[10px] xl:text-xs text-gray-400 lg:text-right">Escrow Protection</p>
                    </div>

                    {/* Contextual Farmer Actions */}
                    <div className="w-full flex flex-col gap-2">
                      {req.status === "Pending" && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      )}

                      {req.status === "Approved" && (
                        <button
                          onClick={() => handleOwnerStatusChange(req.id, "In Use")}
                          className="w-full px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Confirm Receipt (Start Rental)
                        </button>
                      )}

                      {req.status === "In Use" && (
                        <button
                          onClick={() => handleOwnerStatusChange(req.id, "Completed")}
                          className="w-full px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Mark Rental Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Guidance footer */}
                <div className="px-5 py-2.5 bg-gray-50/50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Lifecycle Note:</span>
                  <span>{badge.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmerRequests;
