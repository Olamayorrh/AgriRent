import { useState, useMemo } from "react";
import {
  TractorIcon,
  SearchIcon,
  FilterIcon,
  LocationIcon,
  StarIcon,
} from "./FarmerIcons";

const FarmerEquipmentRental = ({
  equipments = [],
  isLoading = false,
  onOpenBookingModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // "all" | "available"

  const categories = [
    "All",
    "Tractor",
    "Harvester",
    "Sprayer",
    "Tiller & Harrow",
    "Planter",
    "Baler",
  ];

  // Filtered equipment list
  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [equipments, searchQuery, selectedCategory, availabilityFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 xl:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-xs xl:text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Equipment Marketplace
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Machinery & Implements Posted by Owners
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1">
            Discover tractors, harvesters, sprayers, and implements posted by equipment owners. Place a request on any machinery directly.
          </p>
        </div>

        {/* Quick count badge */}
        <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 xl:px-5 xl:py-2.5 bg-gray-50 rounded-2xl border border-gray-200">
          <TractorIcon className="w-5 h-5 xl:w-6 xl:h-6 text-[var(--secondary-color)]" />
          <span className="text-xs xl:text-sm font-bold text-gray-800">
            {filteredEquipments.length} Available in Market
          </span>
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
              placeholder="Search by equipment name, owner, or state (e.g. Tractor, Ibadan)..."
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
            <span className="text-xs xl:text-sm font-semibold text-gray-500 hidden sm:inline">Status:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3.5 py-2.5 xl:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm xl:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
            >
              <option value="all">All Machinery</option>
              <option value="available">Available Now</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <FilterIcon className="w-4 h-4 xl:w-5 xl:h-5 text-gray-400 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
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
                <div className="h-3 bg-gray-100 rounded-full w-5/6" />
              </div>
              <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-xl w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : equipments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <TractorIcon className="w-14 h-14 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">No machinery in the marketplace yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Machinery posted by equipment owners will appear here for farmers to view and book.
          </p>
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <TractorIcon className="w-14 h-14 mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">No machinery matched your filters</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters to view all available listings.
          </p>
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
                      <TractorIcon className="w-16 h-16 xl:w-20 xl:h-20 text-[var(--secondary-color)] opacity-40" />
                      <span className="text-xs xl:text-sm text-gray-400 mt-2 font-medium">No image uploaded yet</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 xl:px-3 py-1 rounded-full text-[11px] xl:text-xs font-bold bg-white/95 text-[var(--secondary-color)] shadow-xs">
                      {item.category}
                    </span>
                    {item._source === "live" && (
                      <span className="px-2 xl:px-2.5 py-1 rounded-full text-[10px] xl:text-xs font-bold bg-blue-600 text-white shadow-xs">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 xl:px-3 py-1 rounded-full text-[11px] xl:text-xs font-bold shadow-xs ${
                        item.available
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {item.available ? "Available" : "In Use"}
                    </span>
                  </div>

                  {/* Rating Tag */}
                  {(item.rating || item.reviewsCount) && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[11px] xl:text-xs flex items-center gap-1">
                      <StarIcon className="w-3 h-3 xl:w-4 xl:h-4 text-amber-400" />
                      <span className="font-bold">{item.rating || 4.8}</span>
                      <span className="text-gray-300">({item.reviewsCount || 12})</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 xl:p-6 space-y-3 xl:space-y-4">
                  <div>
                    <h3 className="text-base xl:text-lg font-bold text-gray-900 group-hover:text-[var(--secondary-color)] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs xl:text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                      <LocationIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-400 shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>

                  {/* Owner info */}
                  <div className="p-2.5 xl:p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs xl:text-sm">
                    <div>
                      <p className="text-[10px] xl:text-xs text-gray-400 uppercase font-semibold">Equipment Owner</p>
                      <p className="font-bold text-gray-800">{item.ownerName}</p>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs xl:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specifications tags */}
                  {item.specs && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(item.specs).map(([key, val]) => (
                        <span
                          key={key}
                          className="text-[10px] xl:text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          <span className="capitalize text-gray-400">{key}: </span>
                          {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with Price & Place Request Button */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 xl:px-6 xl:pb-6 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
                <div>
                  <span className="text-[10px] xl:text-xs text-gray-400 uppercase font-semibold block">
                    {item.priceBasis === "per_hectare" ? "Hectare Rate" : "Daily Rental Rate"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg xl:text-xl font-extrabold text-[var(--secondary-color)]">
                      ₦{item.dailyRate?.toLocaleString()}
                    </span>
                    <span className="text-[10px] xl:text-xs text-gray-500">
                      {item.priceBasis === "per_hectare" ? "/ hectare" : "/ day"}
                    </span>
                  </div>
                </div>

                {/* Place Request Button */}
                {item.available ? (
                  <button
                    onClick={() => onOpenBookingModal(item)}
                    className="px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm xl:text-base font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <TractorIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[var(--primary-color)]" />
                    <span>Place Request</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm xl:text-base font-semibold text-gray-400 bg-gray-200 cursor-not-allowed flex items-center gap-1.5"
                  >
                    <span>Currently In Use</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerEquipmentRental;
