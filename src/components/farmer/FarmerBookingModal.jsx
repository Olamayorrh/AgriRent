import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  CloseIcon,
  LocationIcon,
  TractorIcon,
  CheckCircleIcon,
} from "./FarmerIcons";
import { createRentalRequest } from "../../services/equipmentService";

const FarmerBookingModal = ({
  isOpen,
  onClose,
  equipment,
  currentUser,
  onBookingSuccess,
  onBookingError,
}) => {
  
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getFutureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getTomorrowDate);
  const [endDate, setEndDate] = useState(() => getFutureDate(3));
  const [deliveryOption, setDeliveryOption] = useState("Delivery to Farm");
  const [farmLocation, setFarmLocation] = useState(currentUser?.location || "Plot 4, Farm Estate, Oyo State");
  const [farmScope, setFarmScope] = useState("10 Hectares");
  const [farmSizeHectares, setFarmSizeHectares] = useState("10");
  const [needOperator, setNeedOperator] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  if (!isOpen || !equipment) return null;

  
  const isLiveEquipment = equipment._source === "live";
  const isHectareBased = equipment.priceBasis === "per_hectare";


  const ratePerDay = equipment.dailyRate || 50000;
  const operatorFeePerDay = 10000;
  const deliveryFee = deliveryOption === "Delivery to Farm" ? 15000 : 0;

 
  const parsedHectares = parseFloat(farmSizeHectares) || 1;
  const baseRentalCost = isHectareBased
    ? ratePerDay * parsedHectares
    : ratePerDay * durationDays;
  const operatorCost = needOperator
    ? isHectareBased
      ? operatorFeePerDay * parsedHectares
      : operatorFeePerDay * durationDays
    : 0;
  const totalAmount = baseRentalCost + operatorCost + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.warning("Please choose both start and end rental dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }

    setIsSubmitting(true);

    const requestPayload = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      equipmentImage: equipment.image,
      category: equipment.category,
      ownerName: equipment.ownerName,
      ownerPhone: equipment.ownerPhone,
      location: equipment.location,
      farmerName: currentUser?.name || currentUser?.full_name || "Farmer User",
      farmerEmail: currentUser?.email || "farmer@agrirent.com",
      farmerPhone: currentUser?.number || currentUser?.phone_number || "+234 800 000 0000",
      farmLocation,
      farmScope,
      farmSizeHectares: parsedHectares,
      needOperator,
      startDate,
      endDate,
      durationDays,
      dailyRate: ratePerDay,
      priceBasis: equipment.priceBasis,
      totalAmount,
      deliveryOption,
      notes: notes || "Standard agricultural field operation.",
      // Live API booking fields
      farmerId: currentUser?.id || null,
      _isLiveEquipment: isLiveEquipment,
    };

    try {
      const newRequest = await createRentalRequest(requestPayload);

      onClose();
      if (onBookingSuccess) {
        onBookingSuccess(newRequest);
      }
    } catch (error) {
      console.error("Booking error:", error);
      onClose();
      if (onBookingError) {
        onBookingError(error, requestPayload);
      } else {
        toast.error("Failed to submit rental request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[var(--secondary-color)] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <TractorIcon className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Book Agricultural Equipment</h3>
              <p className="text-xs text-white/80">Submit request directly to the equipment owner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {equipment.image ? (
              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl border border-gray-200 bg-emerald-50 flex items-center justify-center">
                <TractorIcon className="w-8 h-8 text-[var(--secondary-color)]" />
              </div>
            )}
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {equipment.category}
              </span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">{equipment.name}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <LocationIcon className="w-3.5 h-3.5 text-gray-400" />
                <span>{equipment.location}</span> • <span>Owner: {equipment.ownerName}</span>
              </p>
            </div>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-xs text-gray-400 font-medium">
              {isHectareBased ? "Hectare Rate" : "Daily Rate"}
            </p>
            <p className="text-lg font-extrabold text-[var(--secondary-color)]">
              ₦{equipment.dailyRate?.toLocaleString()}
              <span className="text-xs font-normal text-gray-500">
                {isHectareBased ? " / hectare" : " / day"}
              </span>
            </p>
          </div>
        </div>

       
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  min={getTomorrowDate()}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  min={startDate || getTomorrowDate()}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  required
                />
              </div>
            </div>
          </div>

          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Logistics & Delivery Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryOption("Delivery to Farm")}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryOption === "Delivery to Farm"
                    ? "border-[var(--secondary-color)] bg-emerald-50/50 ring-1 ring-[var(--secondary-color)]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                    deliveryOption === "Delivery to Farm"
                      ? "border-[var(--secondary-color)] bg-[var(--secondary-color)]"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryOption === "Delivery to Farm" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Direct Farm Delivery</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Dispatched to your farm plot (+₦15,000)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryOption("Self-Pickup")}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryOption === "Self-Pickup"
                    ? "border-[var(--secondary-color)] bg-emerald-50/50 ring-1 ring-[var(--secondary-color)]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                    deliveryOption === "Self-Pickup"
                      ? "border-[var(--secondary-color)] bg-[var(--secondary-color)]"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryOption === "Self-Pickup" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Self Pickup at Hub</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Collect at owner yard (Free)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Farm Location & Operational Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Farm Address / Plot
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="e.g. Plot 14, Oyo Farm Settlement"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Farm Size / Acreage
              </label>
              <input
                type="text"
                value={farmScope}
                onChange={(e) => setFarmScope(e.target.value)}
                placeholder="e.g. 5 Hectares / Plowing"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
              />
            </div>
          </div>

          
          {isHectareBased && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Number of Hectares to Service
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={farmSizeHectares}
                onChange={(e) => setFarmSizeHectares(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Cost will be calculated as ₦{ratePerDay?.toLocaleString()} × {farmSizeHectares || "0"} hectares
              </p>
            </div>
          )}

         
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-900">Need a Certified Machine Operator?</p>
              <p className="text-[11px] text-amber-700">
                Equipment owner sends an experienced driver (+₦10,000/day)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={needOperator}
                onChange={(e) => setNeedOperator(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--secondary-color)]"></div>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Special Instructions / Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Soil condition is slightly rocky, preferred arrival time 7:00 AM..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
            ></textarea>
          </div>

          {/* Price Breakdown Summary */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              {isHectareBased ? (
                <span>
                  Machinery Rental ({parsedHectares} hectare{parsedHectares !== 1 ? "s" : ""} @ ₦{ratePerDay.toLocaleString()}):
                </span>
              ) : (
                <span>
                  Machinery Rental ({durationDays} {durationDays === 1 ? "day" : "days"} @ ₦{ratePerDay.toLocaleString()}):
                </span>
              )}
              <span className="font-semibold text-gray-900">₦{baseRentalCost.toLocaleString()}</span>
            </div>
            {needOperator && (
              <div className="flex justify-between text-xs text-gray-600">
                {isHectareBased ? (
                  <span>Certified Operator ({parsedHectares} ha @ ₦10,000):</span>
                ) : (
                  <span>Certified Operator ({durationDays} days @ ₦10,000):</span>
                )}
                <span className="font-semibold text-gray-900">₦{operatorCost.toLocaleString()}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Direct Delivery & Transport:</span>
                <span className="font-semibold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-gray-900">Total Estimated Cost:</span>
                <p className="text-[10px] text-gray-500">Payment held securely in escrow upon approval</p>
              </div>
              <span className="text-xl font-extrabold text-[var(--secondary-color)]">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-md shadow-[#1B4332]/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-[var(--primary-color)]" />
                  <span>Send Rental Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerBookingModal;
