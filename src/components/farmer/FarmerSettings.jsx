import { useState } from "react";
import { toast } from "react-toastify";
import {
  AvatarIcon,
  LogoutIcon,
  CheckCircleIcon,
  LocationIcon,
  SproutIcon,
  PhoneIcon,
  CheckIcon,
} from "./FarmerIcons";

const FarmerSettings = ({ currentUser, setCurrentUser, onLogout }) => {
  const [name, setName] = useState(currentUser?.name || currentUser?.full_name || "Adebayo Farmer");
  const [email, setEmail] = useState(currentUser?.email || "farmer@agrirent.com");
  const [phone, setPhone] = useState(currentUser?.number || currentUser?.phone_number || "+234 801 234 5678");
  const [location, setLocation] = useState(currentUser?.location || "Ota, Ogun State");
  const [farmType, setFarmType] = useState("Grain & Tuber Cultivation (Maize, Cassava, Wheat)");
  const [farmSize, setFarmSize] = useState("25 Hectares (Across 3 Plots)");
  const [deliveryPreference, setDeliveryPreference] = useState("Direct Farm Delivery");
  const [preferredMachinery, setPreferredMachinery] = useState("Tractors & Harvesters");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      full_name: name,
      email,
      number: phone,
      phone_number: phone,
      location,
      farmType,
      farmSize,
      deliveryPreference,
      preferredMachinery,
    };
    try {
      // Keep session storage in pure API testing mode
      sessionStorage.setItem("agrirent_session_user", JSON.stringify(updated));
      if (setCurrentUser) setCurrentUser(updated);
      toast.success("Farmer profile and preferences updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const firstName = name.trim().split(" ")[0] || "Farmer";

  return (
    <div className="space-y-6 xl:space-y-8 w-full min-w-0 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs xl:text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Account & Farm Profile
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Settings & Profile
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1">
            Manage your personal credentials, farm operational scope, machinery delivery preferences, and notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Verified Farmer Account
          </span>
        </div>
      </div>

      {/* Main Settings Layout (Side-by-side on large screens, filling 100% space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left Column: Profile Card & Quick Info (4 cols on lg/xl) */}
        <div className="lg:col-span-4 space-y-5 xl:space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-4">
            <AvatarIcon className="w-24 h-24 xl:w-28 xl:h-28 text-3xl xl:text-4xl shadow-md" name={firstName} />
            <div className="space-y-1">
              <h3 className="text-lg xl:text-xl font-extrabold text-gray-900">{name}</h3>
              <p className="text-xs xl:text-sm text-gray-500">{email}</p>
              <div className="pt-2">
                <span className="text-xs xl:text-sm text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Tenant Farmer
                </span>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 space-y-2.5 text-left text-xs xl:text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Location:</span>
                <span className="font-bold text-gray-900 truncate max-w-[180px]">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Farm Scale:</span>
                <span className="font-bold text-gray-900">{farmSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Verification:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NIN & Phone Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-5 xl:p-6 bg-gradient-to-br from-emerald-50 to-green-50/60 rounded-3xl border border-emerald-100 space-y-2 text-xs xl:text-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <SproutIcon className="w-5 h-5 text-[var(--secondary-color)]" />
              <h4 className="font-bold">Agricultural Profile Sync</h4>
            </div>
            <p className="text-emerald-800/90 leading-relaxed text-[11px] xl:text-xs">
              Your registered location and farm acreage help equipment owners calculate logistics and equipment suitability automatically when you place rental requests.
            </p>
          </div>
        </div>

        {/* Right Column: Settings Form (8 cols on lg/xl, fills entire width) */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSave}
            className="bg-white p-6 sm:p-8 xl:p-10 rounded-3xl border border-gray-100 shadow-xs space-y-6 xl:space-y-8"
          >
            {/* Section 1: Personal Credentials */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base xl:text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-xs xl:text-sm text-gray-500">
                  Your official identity details used for equipment hire contracts
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Farm State & Settlement Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Farm Operational Scope */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base xl:text-lg font-bold text-gray-900">
                  Farm Operations & Machinery Scope
                </h3>
                <p className="text-xs xl:text-sm text-gray-500">
                  Define your agricultural focus and default equipment preferences
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Primary Crop Specialization
                  </label>
                  <input
                    type="text"
                    value={farmType}
                    onChange={(e) => setFarmType(e.target.value)}
                    placeholder="e.g. Maize, Soya, Rice, Cassava"
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Total Cultivated Size / Acreage
                  </label>
                  <input
                    type="text"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder="e.g. 25 Hectares"
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Default Delivery Preference
                  </label>
                  <select
                    value={deliveryPreference}
                    onChange={(e) => setDeliveryPreference(e.target.value)}
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    <option value="Direct Farm Delivery">Direct Farm Delivery (Recommended)</option>
                    <option value="Self-Pickup at Owner Yard">Self-Pickup at Owner Yard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Frequently Hired Machinery
                  </label>
                  <input
                    type="text"
                    value={preferredMachinery}
                    onChange={(e) => setPreferredMachinery(e.target.value)}
                    placeholder="e.g. 75HP Tractors, Disc Harrows"
                    className="w-full px-4 py-2.5 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Notification Alerts */}
            <div className="p-4 sm:p-5 xl:p-6 bg-gray-50/70 border border-gray-100 rounded-2xl xl:rounded-3xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm xl:text-base font-bold text-gray-900">
                  SMS & In-App Booking Notifications
                </h4>
                <p className="text-[11px] xl:text-xs text-gray-500 mt-0.5">
                  Receive instant notifications when an equipment owner approves, dispatches, or updates your rental requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--secondary-color)]"></div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-auto px-5 xl:px-6 py-2.5 xl:py-3.5 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogoutIcon className="w-4 h-4 xl:w-5 xl:h-5 text-rose-500" />
                <span>Sign Out of Account</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 xl:px-8 py-2.5 xl:py-3.5 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[var(--primary-color)]" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerSettings;
