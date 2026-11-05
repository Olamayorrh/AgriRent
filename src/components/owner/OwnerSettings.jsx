import { useState } from "react";
import { toast } from "react-toastify";
import {
  AvatarIcon,
  LogoutIcon,
  CheckCircleIcon,
  LocationIcon,
  PhoneIcon,
  PackageIcon,
  CurrencyIcon,
} from "./OwnerIcons";

const OwnerSettings = ({ currentUser, setCurrentUser, onLogout }) => {
  const [name, setName] = useState(
    currentUser?.name || currentUser?.full_name || "Alhaji Ibrahim Danladi"
  );
  const [businessName, setBusinessName] = useState(
    currentUser?.businessName || "Danladi Agro Machinery Hub"
  );
  const [email, setEmail] = useState(currentUser?.email || "owner@agrirent.com");
  const [phone, setPhone] = useState(
    currentUser?.number || currentUser?.phone_number || "+234 803 123 4567"
  );
  const [location, setLocation] = useState(currentUser?.location || "Ibadan, Oyo State");
  const [dispatchRadius, setDispatchRadius] = useState("100 km Radius");
  const [operatorPolicy, setOperatorPolicy] = useState("Certified Operator Provided Upon Request");
  const [bankName, setBankName] = useState("First Bank of Nigeria");
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [accountName, setAccountName] = useState("Alhaji Ibrahim Danladi");

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      full_name: name,
      businessName,
      email,
      number: phone,
      phone_number: phone,
      location,
      dispatchRadius,
      operatorPolicy,
      bankName,
      accountNumber,
      accountName,
    };
    try {
      sessionStorage.setItem("agrirent_session_user", JSON.stringify(updated));
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      if (setCurrentUser) setCurrentUser(updated);
      toast.success("Equipment Owner profile & fleet settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const firstName = name.trim().split(" ")[0] || "Owner";

  return (
    <div className="space-y-6 xl:space-y-8 w-full min-w-0 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Owner Profile & Preferences
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Equipment Owner Settings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Update your verified machinery provider profile, linked bank details for automated
            escrow payouts, and dispatch logistics.
          </p>
        </div>
      </div>

      {/* Responsive Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 w-full min-w-0">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4">
            <div className="flex justify-center">
              <AvatarIcon
                className="w-24 h-24 xl:w-28 xl:h-28 text-3xl shadow-md border-4 border-[#DDA15E]/40"
                name={firstName}
              />
            </div>

            <div>
              <h3 className="text-lg xl:text-xl font-extrabold text-gray-900">{name}</h3>
              <p className="text-xs xl:text-sm font-semibold text-[var(--secondary-color)] mt-0.5">
                {businessName}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Verified Equipment Provider</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-left text-gray-600">
              <p className="flex items-center gap-2">
                <LocationIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <PackageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Coverage: {dispatchRadius}</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1B4332] to-[#0c805d] text-white p-6 rounded-3xl shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[var(--primary-color)]">
              AgriRent Machinery Guarantee
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              All equipment posted on AgriRent is backed by verified farmer identity checks, GPS farm
              logistics tracking, and guaranteed escrow payments.
            </p>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSave}
            className="bg-white p-6 sm:p-8 xl:p-10 rounded-3xl border border-gray-100 shadow-xs space-y-8"
          >
            {/* Section 1: Personal & Business Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="p-2 rounded-xl bg-amber-50 text-[var(--secondary-color)]">
                  <PackageIcon className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Business & Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Machinery Hub / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Hub Base Location (City, State) *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Fleet Logistics Scope */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="p-2 rounded-xl bg-emerald-50 text-[var(--secondary-color)]">
                  <LocationIcon className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Fleet Logistics & Service Policy
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Maximum Delivery Radius
                  </label>
                  <select
                    value={dispatchRadius}
                    onChange={(e) => setDispatchRadius(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  >
                    <option value="50 km Radius">Within 50 km</option>
                    <option value="100 km Radius">Within 100 km</option>
                    <option value="Statewide Coverage">Statewide Coverage</option>
                    <option value="Inter-state Transport Available">Inter-state Transport Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Machine Operator Support
                  </label>
                  <select
                    value={operatorPolicy}
                    onChange={(e) => setOperatorPolicy(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  >
                    <option value="Certified Operator Provided Upon Request">
                      Operator Provided Upon Request
                    </option>
                    <option value="Mandatory Hub Operator Included in Rate">
                      Mandatory Hub Operator Included
                    </option>
                    <option value="Self-Operated by Qualified Farmer Only">
                      Self-Operated by Qualified Farmer Only
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Payout Account (Escrow) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <span className="p-2 rounded-xl bg-amber-50 text-[var(--secondary-color)]">
                  <CurrencyIcon className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Escrow Payout Bank Account
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 xl:py-3.5 bg-gray-50 border border-gray-200 rounded-xl xl:rounded-2xl text-xs sm:text-sm xl:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Form Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-auto px-5 py-2.5 xl:py-3.5 rounded-xl xl:rounded-2xl text-xs xl:text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogoutIcon className="w-4 h-4 text-rose-500" />
                <span>Sign Out of Account</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-2.5 xl:py-3.5 rounded-xl xl:rounded-2xl text-xs xl:text-sm font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-4 h-4 text-[var(--primary-color)]" />
                <span>Save Settings & Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerSettings;
