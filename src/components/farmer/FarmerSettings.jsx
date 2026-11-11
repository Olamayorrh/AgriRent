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
    };
    try {
      sessionStorage.setItem("agrirent_session_user", JSON.stringify(updated));
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      if (setCurrentUser) setCurrentUser(updated);
      toast.success("Farmer profile and contact information updated successfully!");
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
            Account & Profile
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Settings & Profile
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1">
            Manage your personal contact credentials and account details.
          </p>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-5 xl:space-y-6">
          <div className="bg-white p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-4">
            <AvatarIcon className="w-24 h-24 xl:w-28 xl:h-28 text-3xl xl:text-4xl shadow-md" name={firstName} />
            <div className="space-y-1">
              <h3 className="text-lg xl:text-xl font-extrabold text-gray-900">{name}</h3>
              <p className="text-xs xl:text-sm text-gray-500">{email}</p>
            </div>

            <div className="w-full pt-4 border-t border-gray-100 space-y-2.5 text-left text-xs xl:text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Location:</span>
                <span className="font-bold text-gray-900 truncate max-w-[180px]">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Phone:</span>
                <span className="font-bold text-gray-900">{phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSave}
            className="bg-white p-6 sm:p-8 xl:p-10 rounded-3xl border border-gray-100 shadow-xs space-y-6 xl:space-y-8"
          >
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base xl:text-lg font-bold text-gray-900">
                  Contact Information
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
