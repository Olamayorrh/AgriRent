import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CloseIcon,
  TractorIcon,
  CheckCircleIcon,
  LocationIcon,
  MoneyIcon,
  UploadIcon,
  ToggleIcon,
} from "./OwnerIcons";
import { resolveEquipmentImage } from "../../services/equipmentService";

import tractorImage from "../../assets/tractor_image.jpeg";
import harvesterImage from "../../assets/harvester_image.jpeg";
import ploughImage from "../../assets/plough_arrow.jpeg";
import planterImage from "../../assets/planter_image.jpeg";
import hayStrawMachine from "../../assets/hay_straw_machine.jpeg";
import boomSprayerImage from "../../assets/boomSprayer.jpeg";

const SAMPLE_PRESET_IMAGES = [
  { label: "Tractor", src: tractorImage },
  { label: "Harvester", src: harvesterImage },
  { label: "Plough / Harrow", src: ploughImage },
  { label: "Precision Planter", src: planterImage },
  { label: "Hay Baler", src: hayStrawMachine },
  { label: "Boom Sprayer", src: boomSprayerImage },
];

const CATEGORIES = [
  "Tractor",
  "Harvester",
  "Sprayer",
  "Tiller & Harrow",
  "Planter",
  "Baler",
  "Irrigation",
  "Trailer & Transport",
];

const CONDITIONS = ["Excellent", "Like New", "Good", "Fair"];

const OwnerPostModal = ({
  isOpen,
  onClose,
  onSubmitEquipment,
  editingEquipment = null,
  currentUser,
}) => {
  const isEditing = Boolean(editingEquipment);

  const [formData, setFormData] = useState({
    name: "",
    category: "Tractor",
    dailyRate: "",
    hourlyRate: "",
    location: "",
    condition: "Excellent",
    available: true,
    power: "",
    fuel: "Diesel",
    description: "",
    image: tractorImage,
  });

  const [customImagePreview, setCustomImagePreview] = useState(null);

  // Sync state whenever editingEquipment changes
  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        name: editingEquipment.name || "",
        category: editingEquipment.category || "Tractor",
        dailyRate: editingEquipment.dailyRate || "",
        hourlyRate: editingEquipment.hourlyRate || "",
        location: editingEquipment.location || "",
        condition: editingEquipment.condition || "Excellent",
        available: editingEquipment.available !== undefined ? editingEquipment.available : true,
        power: editingEquipment.specs?.power || "",
        fuel: editingEquipment.specs?.fuel || "Diesel",
        description: editingEquipment.description || "",
        image: editingEquipment.image || tractorImage,
      });
      setCustomImagePreview(editingEquipment.image || null);
    } else {
      // Default new listing form
      setFormData({
        name: "",
        category: "Tractor",
        dailyRate: "",
        hourlyRate: "",
        location: currentUser?.location || "Ibadan, Oyo State",
        condition: "Excellent",
        available: true,
        power: "75 HP",
        fuel: "Diesel",
        description: "",
        image: tractorImage,
      });
      setCustomImagePreview(tractorImage);
    }
  }, [editingEquipment, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat,
      image: resolveEquipmentImage(cat),
    }));
    setCustomImagePreview(resolveEquipmentImage(cat));
  };

  // Allow custom file upload (converts to base64 data URL for local storage persistence)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("File is larger than 2MB; resizing/compressing recommended.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setCustomImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please provide an equipment name.");
      return;
    }

    if (!formData.dailyRate || Number(formData.dailyRate) <= 0) {
      toast.error("Please provide a valid daily rental rate (₦).");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter equipment location / state.");
      return;
    }

    const payload = {
      ...(editingEquipment || {}),
      name: formData.name.trim(),
      category: formData.category,
      ownerName: currentUser?.name || currentUser?.full_name || "Verified Equipment Owner",
      ownerPhone: currentUser?.number || currentUser?.phone_number || "+234 800 000 0000",
      ownerEmail: currentUser?.email || "owner@agrirent.com",
      location: formData.location.trim(),
      dailyRate: Number(formData.dailyRate),
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : Math.round(Number(formData.dailyRate) / 8),
      condition: formData.condition,
      available: Boolean(formData.available),
      image: formData.image,
      description: formData.description.trim() || `High efficiency ${formData.category} ready for hire across farms in ${formData.location}.`,
      specs: {
        ...(editingEquipment?.specs || {}),
        power: formData.power || "Standard",
        fuel: formData.fuel || "Diesel",
      },
    };

    onSubmitEquipment(payload, isEditing);
    toast.success(
      isEditing
        ? "Equipment details updated successfully!"
        : "Equipment successfully posted to marketplace!"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-50 text-[var(--secondary-color)] border border-amber-200">
              <TractorIcon className="w-6 h-6 text-[var(--secondary-color)]" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {isEditing ? "Edit Equipment Listing" : "Post New Equipment for Rent"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEditing
                  ? "Update rates, operational availability, or specs"
                  : "Post your machinery so nearby farmers can discover and request it"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Availability Switch Top Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                Equipment Availability Status
              </span>
              <p className="text-[11px] text-gray-600">
                {formData.available
                  ? "Active: visible to farmers in the Marketplace for immediate booking"
                  : "Unavailable: hidden from active search / marked as under maintenance"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--secondary-color)]"></div>
              <span className="ml-3 text-xs font-bold text-gray-900">
                {formData.available ? "Available Now" : "Unavailable"}
              </span>
            </label>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              1. Machinery Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Equipment Name & Model *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Deere 5075E 4WD Tractor"
                className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Machinery Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Location */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              2. Rental Rates & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Daily Rental Rate (₦) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-gray-400">
                    ₦
                  </span>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    required
                    min="1000"
                    placeholder="e.g. 65000"
                    className="w-full pl-8 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Standard 8-hour working day rate
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Hourly Rate (₦)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-gray-400">
                    ₦
                  </span>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="Optional (defaults to daily / 8)"
                    className="w-full pl-8 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Equipment Hub Location (City, State) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <LocationIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ibadan, Oyo State (or Ota, Ogun State)"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Farmers will filter equipment based on their state or farming proximity.
              </span>
            </div>
          </div>

          {/* Section 3: Technical Specs & Description */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              3. Specifications & Capabilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Engine Power / Capacity
                </label>
                <input
                  type="text"
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  placeholder="e.g. 75 HP, 800 Litres, 4.8m bar"
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Fuel Type
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol Engine">Petrol Engine</option>
                  <option value="Electric / Solar">Electric / Hybrid</option>
                  <option value="Manual PTO Attachment">Manual PTO Attachment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description & Operator Terms
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention features, crop suitability, attachments provided, and whether an operator is included."
                className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] resize-none"
              />
            </div>
          </div>

          {/* Section 4: Imagery / Photo */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              4. Equipment Photo
            </h3>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              {/* Image Preview Box */}
              <div className="w-full sm:w-48 h-36 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0 relative">
                {customImagePreview ? (
                  <img
                    src={customImagePreview}
                    alt="Equipment Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3 text-gray-400">
                    <TractorIcon className="w-8 h-8 mx-auto opacity-50 mb-1" />
                    <span className="text-[10px]">No image selected</span>
                  </div>
                )}
              </div>

              {/* Preset selection or custom file upload */}
              <div className="flex-1 space-y-2.5 w-full">
                <span className="text-xs font-semibold text-gray-700 block">
                  Select a preset image or upload your own:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: preset.src }));
                        setCustomImagePreview(preset.src);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-left truncate transition-all cursor-pointer ${
                        formData.image === preset.src
                          ? "bg-[var(--secondary-color)] text-white border-[var(--secondary-color)] shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors border border-gray-200">
                    <UploadIcon className="w-4 h-4 text-gray-500" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-4 h-4 text-[var(--primary-color)]" />
              <span>{isEditing ? "Save Listing Changes" : "Publish to Marketplace"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerPostModal;
