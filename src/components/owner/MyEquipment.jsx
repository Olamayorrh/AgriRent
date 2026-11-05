import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  TractorIcon,
  SearchIcon,
  FilterIcon,
  LocationIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
} from "./OwnerIcons";

const CATEGORIES = [
  "All",
  "Tractor",
  "Harvester",
  "Sprayer",
  "Tiller & Harrow",
  "Planter",
  "Baler",
  "Irrigation",
];

const MyEquipment = ({
  equipments = [],
  onOpenPostModal,
  onEditEquipment,
  onDeleteEquipment,
  onToggleAvailability,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // "all" | "available" | "unavailable"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "price-asc" | "price-desc"

  // Equipment deletion confirmation modal state
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  // Filtered and sorted listings
  const filteredEquipments = useMemo(() => {
    return equipments
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === "All" ||
          item.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter === "available" && item.available) ||
          (availabilityFilter === "unavailable" && !item.available);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (a.dailyRate || 0) - (b.dailyRate || 0);
        if (sortBy === "price-desc") return (b.dailyRate || 0) - (a.dailyRate || 0);
        return 0; // default order
      });
  }, [equipments, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const totalCount = equipments.length;
  const availableCount = equipments.filter((e) => e.available).length;
  const pausedCount = totalCount - availableCount;

  const handleConfirmDelete = () => {
    if (equipmentToDelete) {
      onDeleteEquipment(equipmentToDelete.id);
      toast.success(`"${equipmentToDelete.name}" removed from fleet.`);
      setEquipmentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Machinery Fleet Catalog
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            My Equipment Listings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Manage your posted machinery. Toggle availability to control whether farmers can book
            each machine, or update daily rates and locations.
          </p>
        </div>

        {/* Action Button & Quick Counters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700">
            <span className="text-emerald-700">{availableCount} Available</span>
            <span>•</span>
            <span className="text-gray-500">{pausedCount} Paused</span>
          </div>
          <button
            onClick={onOpenPostModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
          >
            <PlusIcon className="w-4 h-4 text-[var(--primary-color)]" />
            <span>Post New Equipment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment model, category, or location..."
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

          {/* Availability Filter dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs xl:text-sm font-semibold text-gray-500 hidden sm:inline">
              Status:
            </span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3.5 py-2.5 xl:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm xl:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
            >
              <option value="all">All Machinery ({totalCount})</option>
              <option value="available">Available for Rent ({availableCount})</option>
              <option value="unavailable">Paused / Inactive ({pausedCount})</option>
            </select>
          </div>

          {/* Price Sorting dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 xl:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm xl:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
            >
              <option value="newest">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <FilterIcon className="w-4 h-4 xl:w-5 xl:h-5 text-gray-400 shrink-0 hidden sm:block" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--secondary-color)] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="h-3 bg-gray-100 rounded-full w-full" />
              </div>
              <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-xl w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <TractorIcon className="w-14 h-14 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">No machinery matching your filter</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clear category filters, or post a new equipment.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setAvailabilityFilter("all");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--secondary-color)] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenPostModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] transition-colors cursor-pointer"
            >
              Post New Equipment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-8">
          {filteredEquipments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl xl:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Equipment Image + Badges */}
                <div className="relative h-48 sm:h-52 xl:h-60 w-full overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-100">
                      <TractorIcon className="w-16 h-16 text-[var(--secondary-color)] opacity-40" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 xl:px-3 py-1 rounded-full text-[11px] xl:text-xs font-bold bg-white/95 text-[var(--secondary-color)] shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1.5 ${
                        item.available
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-800/85 text-white"
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

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[var(--secondary-color)] transition-colors line-clamp-1">
                    {item.name}
                  </h4>

                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <LocationIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>

                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Specs Pill List */}
                  {item.specs && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.specs.power && (
                        <span className="text-[10px] xl:text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                          {item.specs.power}
                        </span>
                      )}
                      {item.specs.fuel && (
                        <span className="text-[10px] xl:text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                          {item.specs.fuel}
                        </span>
                      )}
                      <span className="text-[10px] xl:text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                        {item.condition || "Verified"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Daily Rental</span>
                    <span className="text-sm sm:text-base font-extrabold text-[var(--secondary-color)]">
                      ₦{item.dailyRate?.toLocaleString()}
                    </span>
                  </div>

                  {/* Availability Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-semibold text-gray-500">
                      {item.available ? "Live" : "Paused"}
                    </span>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleAvailability(item.id);
                        toast.info(
                          item.available
                            ? `"${item.name}" marked as Unavailable in marketplace.`
                            : `"${item.name}" is now Available for farmers to book!`
                        );
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.available ? "bg-emerald-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          item.available ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </label>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onEditEquipment(item)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PencilIcon className="w-3.5 h-3.5 text-gray-600" />
                    <span>Edit Post</span>
                  </button>

                  <button
                    onClick={() => setEquipmentToDelete(item)}
                    className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Equipment"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {equipmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setEquipmentToDelete(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <TrashIcon className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Delete Equipment Listing?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="font-bold text-gray-800">"{equipmentToDelete.name}"</span>? It
                will no longer appear in the Farmer Marketplace for rental bookings.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEquipmentToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Keep Listing
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEquipment;
