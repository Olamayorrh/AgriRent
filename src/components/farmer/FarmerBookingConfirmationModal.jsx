import React from "react";
import logo from "../../assets/images/Logo.png";
import { TractorIcon, CalendarIcon, CloseIcon } from "./FarmerIcons";

/**
 * FarmerBookingConfirmationModal
 * Displays the Confirmation Screen popup from design when a farmer books / sends request for equipment,
 * and displays an error screen with retry options if the request fails.
 */
const FarmerBookingConfirmationModal = ({
  isOpen,
  onClose,
  isError = false,
  errorMessage = "",
  bookingData = null,
  onTrackBooking,
  onRetry,
}) => {
  if (!isOpen) return null;

  // Format date helper: "2026-11-10" -> "10 Nov 2026"
  const formatDateString = (dateStr) => {
    if (!dateStr) return "20 Oct 2026";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Format current time helper: "Today 10:42 AM"
  const formatCurrentTime = () => {
    try {
      const now = new Date();
      return `Today ${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } catch {
      return "Today 10:42 AM";
    }
  };

  // Derive dynamic display fields
  const equipmentName = bookingData?.equipmentName || "John Deere 5075E";
  const equipmentImage = bookingData?.equipmentImage || null;
  const plotName = bookingData?.farmLocation || bookingData?.farmScope || "Plot A: Maize";
  const formattedDate = formatDateString(bookingData?.startDate || new Date().toISOString());
  const formattedEndDate = formatDateString(bookingData?.endDate);
  const acreage =
    bookingData?.farmSizeHectares
      ? `${bookingData.farmSizeHectares} hectares`
      : bookingData?.farmScope || "2.5 acres";
  const acceptedTime = formatCurrentTime();
  const estimatedArrival = `${formattedDate}, 7:30 AM`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-[#1B4332]/85 backdrop-blur-xs animate-in fade-in duration-300">
      {/* Outer Click-away Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-[520px] bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-5 sm:space-y-6">
        {/* Top Header Bar: Logo on Left, Round Close Button on Right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AgriRent" className="h-7 sm:h-8 w-auto object-contain" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-500 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close confirmation screen"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* -------------------- ERROR STATE -------------------- */}
        {isError ? (
          <div className="space-y-5 text-center">
            {/* Red Error Icon Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg mx-auto">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Error Subtitle and Title */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-rose-600 uppercase block">
                REQUEST FAILED
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Unable to complete booking.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-[400px] mx-auto pt-1">
                We could not process your rental request for{" "}
                <strong className="text-gray-900">{equipmentName}</strong>. Your farm plot schedule
                was not modified.
              </p>
            </div>

            {/* Error Message Box */}
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-left space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                Failure Details:
              </span>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                {errorMessage ||
                  "A network or communication error occurred while connecting to the equipment reservation database. Please check your internet connection or verify that the selected rental dates are available."}
              </p>
            </div>

            {/* Error Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-3.5 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full sm:flex-1 py-3.5 rounded-xl sm:rounded-2xl bg-[var(--secondary-color)] hover:bg-[#143225] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : (
          /* -------------------- SUCCESS CONFIRMATION STATE -------------------- */
          <div className="space-y-5 sm:space-y-6">
            {/* Center Checkmark Badge */}
            <div className="flex justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#16a34a] flex items-center justify-center text-white shadow-lg">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center space-y-1.5">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#16a34a] uppercase block">
                REQUEST ACCEPTED
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Booking confirmed & dispatched.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-[420px] mx-auto pt-1">
                {equipmentName} is scheduled for {plotName}. Both parties have been notified and can
                now coordinate arrival.
              </p>
            </div>

            {/* Sync Banner Pill */}
            <div className="rounded-2xl bg-[#7da88f] p-3 sm:p-3.5 flex items-center gap-3 text-[#143d28] shadow-xs">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-[#0d2e1c]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[#0d2e1c] leading-tight">
                  Rental Confirmed & Auto-synced to Farm Plot Calender
                </p>
                <p className="text-[11px] sm:text-xs text-[#17462c] mt-0.5 truncate">
                  Tractor ploughing is now in {plotName}'s task schedule
                </p>
              </div>
            </div>

            {/* Equipment Status Card */}
            <div className="rounded-2xl bg-[#edf5f0] border border-[#dbece0] p-4 sm:p-5 space-y-4">
              {/* Top Row: Thumbnail + Title + Status Pill */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#d4e7da]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                    {equipmentImage ? (
                      <img
                        src={equipmentImage}
                        alt={equipmentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                        <TractorIcon className="w-6 h-6 text-[var(--secondary-color)]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                      {equipmentName}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                      {formattedDate} • {acreage}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full bg-[#c8e6d4] text-[#14532d] shrink-0 border border-[#b3dec2]">
                  Confirmed & Dispatched
                </span>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-3.5 pt-1">
                {/* Milestone 1: Booking Confirmed */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-emerald-800">Booking confirmed</p>
                    <p className="text-[11px] text-gray-500">Owner accepted {acceptedTime}</p>
                  </div>
                </div>

                {/* Milestone 2: Machine Dispatched */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#c2843d] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <TractorIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-800">Machine dispatched</p>
                    <p className="text-[11px] text-gray-500">Estimated arrival {estimatedArrival}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button: Track my booking */}
            <button
              type="button"
              onClick={onTrackBooking || onClose}
              className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#DDA15E] hover:bg-[#c98e4d] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center"
            >
              Track my booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerBookingConfirmationModal;
