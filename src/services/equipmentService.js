// Equipment-specific images for marketplace cards and rentals
import tractorImage from "../assets/tractor_image.jpeg";
import harvesterImage from "../assets/harvester_image.jpeg";
import ploughImage from "../assets/plough_arrow.jpeg";
import planterImage from "../assets/planter_image.jpeg";
import hayStrawMachine from "../assets/hay_straw_machine.jpeg";
import boomSprayerImage from "../assets/boomSprayer.jpeg";

// Backend API base URL — agriRent live backend
export const API_BASE_URL = "https://agrirent-api.onrender.com";

const STORAGE_KEY_EQUIPMENTS = "agrirent_equipments";
const STORAGE_KEY_REQUESTS = "agrirent_rental_requests";

// Initial mock equipment listings uploaded by Equipment Owners
const DEFAULT_EQUIPMENTS = [
  {
    id: "EQ-101",
    name: "John Deere 5075E 4WD Tractor",
    category: "Tractor",
    ownerName: "Alhaji Ibrahim Danladi",
    ownerPhone: "+234 803 123 4567",
    location: "Ibadan, Oyo State",
    dailyRate: 65000,
    hourlyRate: 8500,
    specs: {
      power: "75 HP",
      fuel: "Diesel",
      transmission: "12F/12R PowrReverser",
      drive: "4WD",
    },
    condition: "Excellent",
    available: true,
    rating: 4.9,
    reviewsCount: 28,
    image: tractorImage,
    description: "Heavy-duty 75HP tractor ideal for large-scale tilling, plowing, and heavy haulage. Comes with GPS guidance and operator option.",
  },
  {
    id: "EQ-102",
    name: "Massey Ferguson Activa Combine Harvester",
    category: "Harvester",
    ownerName: "Babatunde Agro Ventures",
    ownerPhone: "+234 802 987 6543",
    location: "Abeokuta, Ogun State",
    dailyRate: 140000,
    hourlyRate: 18000,
    specs: {
      power: "175 HP",
      fuel: "Diesel",
      grainTank: "5,200 Litres",
      width: "4.8m Cutting Bar",
    },
    condition: "Good",
    available: true,
    rating: 4.8,
    reviewsCount: 19,
    image: harvesterImage,
    description: "High-efficiency multi-crop combine harvester suitable for rice, maize, wheat, and soybeans. Low grain loss guarantee.",
  },
  {
    id: "EQ-103",
    name: "AgroMaster High-Clearance Boom Sprayer",
    category: "Sprayer",
    ownerName: "Oluwaseun Machinery Hub",
    ownerPhone: "+234 814 555 8920",
    location: "Akure, Ondo State",
    dailyRate: 35000,
    hourlyRate: 5000,
    specs: {
      capacity: "800 Litres",
      boomWidth: "12m",
      pressure: "40 Bar",
      fuel: "Petrol Engine",
    },
    condition: "Like New",
    available: true,
    rating: 4.7,
    reviewsCount: 14,
    image: boomSprayerImage,
    description: "Precision motorized boom sprayer for chemical fertilizer, herbicide, and pesticide application over wide acreage in record time.",
  },
  {
    id: "EQ-104",
    name: "Heavy-Duty Disc Harrow & Rotary Tiller",
    category: "Tiller & Harrow",
    ownerName: "Kwara Farm Equipment Hub",
    ownerPhone: "+234 806 333 4455",
    location: "Ilorin, Kwara State",
    dailyRate: 28000,
    hourlyRate: 4000,
    specs: {
      discs: "24 Notched Discs",
      workingWidth: "2.4m",
      depth: "200mm",
      hitch: "Category 2 Three-Point",
    },
    condition: "Good",
    available: true,
    rating: 4.6,
    reviewsCount: 22,
    image: ploughImage,
    description: "Robust 24-disc harrow and rotavator attachment built to break tough clay and virgin soil ready for direct planting.",
  },
  {
    id: "EQ-105",
    name: "4-Row Pneumatic Precision Planter",
    category: "Planter",
    ownerName: "Adeyemi Modern Farms",
    ownerPhone: "+234 809 777 1122",
    location: "Osogbo, Osun State",
    dailyRate: 42000,
    hourlyRate: 6000,
    specs: {
      rows: "4 Rows Adjustable",
      seedTypes: "Maize, Soya, Cowpea",
      fertilizerHopper: "Included",
      speed: "8 - 10 km/h",
    },
    condition: "Excellent",
    available: false,
    rating: 4.9,
    reviewsCount: 16,
    image: planterImage,
    description: "Uniform seed depth and distance placement pneumatic seeder. Drastically increases germination rates and yields.",
  },
  {
    id: "EQ-106",
    name: "Square Hay & Straw Baler",
    category: "Baler",
    ownerName: "Midwest Agri Logistic",
    ownerPhone: "+234 805 444 3322",
    location: "Benin City, Edo State",
    dailyRate: 38000,
    hourlyRate: 5500,
    specs: {
      baleSize: "36x46 cm",
      pickupWidth: "1.8m",
      knotter: "Heavy-Duty Twine",
      output: "80 - 100 bales/hr",
    },
    condition: "Good",
    available: true,
    rating: 4.8,
    reviewsCount: 11,
    image: hayStrawMachine,
    description: "Fast baling of crop residues, hay, and silage for cattle feeds and easy farm transport.",
  },
];

// Initial starter requests to demonstrate request status tracking on both ends
const DEFAULT_REQUESTS = [
  {
    id: "REQ-2026-001",
    equipmentId: "EQ-101",
    equipmentName: "John Deere 5075E 4WD Tractor",
    equipmentImage: tractorImage,
    category: "Tractor",
    ownerName: "Alhaji Ibrahim Danladi",
    ownerPhone: "+234 803 123 4567",
    location: "Ibadan, Oyo State",
    farmerName: "Mayowa Olaniyan",
    farmerEmail: "farmer@agrirent.com",
    farmerPhone: "+234 801 234 5678",
    farmLocation: "Plot 4, Green Valley Farm, Oyo",
    startDate: "2026-11-10",
    endDate: "2026-11-14",
    durationDays: 4,
    dailyRate: 65000,
    totalAmount: 260000,
    deliveryOption: "Delivery to Farm",
    notes: "Requires deep soil plowing for 15 hectares before the upcoming rainfall.",
    status: "Approved", // "Pending" | "Approved" | "In Use" | "Completed" | "Declined" | "Cancelled"
    createdAt: "2026-11-02T10:30:00Z",
  },
  {
    id: "REQ-2026-002",
    equipmentId: "EQ-103",
    equipmentName: "AgroMaster High-Clearance Boom Sprayer",
    equipmentImage: boomSprayerImage,
    category: "Sprayer",
    ownerName: "Oluwaseun Machinery Hub",
    ownerPhone: "+234 814 555 8920",
    location: "Akure, Ondo State",
    farmerName: "Mayowa Olaniyan",
    farmerEmail: "farmer@agrirent.com",
    farmerPhone: "+234 801 234 5678",
    farmLocation: "Osun River Basin Farm, Osun",
    startDate: "2026-11-18",
    endDate: "2026-11-19",
    durationDays: 2,
    dailyRate: 35000,
    totalAmount: 70000,
    deliveryOption: "Self-Pickup",
    notes: "Scheduled herbicide application on maize seedlings.",
    status: "Pending",
    createdAt: "2026-11-03T14:15:00Z",
  },
  {
    id: "REQ-2026-003",
    equipmentId: "EQ-104",
    equipmentName: "Heavy-Duty Disc Harrow & Rotary Tiller",
    equipmentImage: ploughImage,
    category: "Tiller & Harrow",
    ownerName: "Kwara Farm Equipment Hub",
    ownerPhone: "+234 806 333 4455",
    location: "Ilorin, Kwara State",
    farmerName: "Mayowa Olaniyan",
    farmerEmail: "farmer@agrirent.com",
    farmerPhone: "+234 801 234 5678",
    farmLocation: "Plot 12, Agro Estate, Kwara",
    startDate: "2026-10-20",
    endDate: "2026-10-23",
    durationDays: 3,
    dailyRate: 28000,
    totalAmount: 84000,
    deliveryOption: "Delivery to Farm",
    notes: "Completed land preparation on plot 12 successfully.",
    status: "Completed",
    createdAt: "2026-10-18T09:00:00Z",
  },
];

/**
 * Fetch all available equipments uploaded by Equipment Owners
 * NOTE: When backend API is ready, replace with:
 * const response = await axios.get(`${API_BASE_URL}/equipments`);
 * return response.data;
 */
export const getEquipments = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EQUIPMENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(DEFAULT_EQUIPMENTS));
      return DEFAULT_EQUIPMENTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading equipments:", error);
    return DEFAULT_EQUIPMENTS;
  }
};

/**
 * Resolve an appropriate image for equipment based on type/name keywords
 */
export const resolveEquipmentImage = (equipmentType) => {
  const type = (equipmentType || "").toLowerCase();
  if (type.includes("plough") || type.includes("harrow") || type.includes("tiller")) return ploughImage;
  if (type.includes("sprayer") || type.includes("boom")) return boomSprayerImage;
  if (type.includes("harvester")) return harvesterImage;
  if (type.includes("planter")) return planterImage;
  if (type.includes("baler") || type.includes("straw") || type.includes("hay")) return hayStrawMachine;
  if (type.includes("tractor")) return tractorImage;
  return ploughImage;
};

/**
 * Normalize a live API equipment item to the shape used by the UI
 * Maps API field names (snake_case) → UI field names (camelCase)
 */
const normalizeLiveEquipment = (apiItem) => ({
  id: apiItem.id,
  name: apiItem.equipment_type || "Agricultural Equipment",
  category: (apiItem.equipment_type || "").split(" - ")[0] || "Tractor",
  ownerName: apiItem.provider_name || "Verified Equipment Owner",
  ownerPhone: apiItem.provider_phone || "+234 800 000 0000",
  location: apiItem.service_area || "Nigeria",
  dailyRate: apiItem.base_price || 0,
  priceBasis: apiItem.price_basis || "per_day",
  specs: {
    ...(apiItem.includes_operator !== undefined && {
      operator: apiItem.includes_operator ? "Included" : "Not Included",
    }),
    ...(apiItem.includes_fuel !== undefined && {
      fuel: apiItem.includes_fuel ? "Fuel Included" : "Fuel Extra",
    }),
  },
  condition: "Verified",
  available: apiItem.is_active !== false,
  rating: null,
  reviewsCount: null,
  image: apiItem.image_url || apiItem.image || resolveEquipmentImage(apiItem.equipment_type),
  description:
    apiItem.description ||
    "Agricultural equipment available for hire. Contact owner for details.",
  _source: "live",
});

/**
 * Fetch equipment listings from live API, then merge with mock catalog.
 * Live API items appear first; mock items fill in the rest.
 * Falls back gracefully to mock catalog if the API is unreachable.
 */
export const fetchMarketplaceEquipments = async () => {
  try {
    console.log(">>> [LIVE API REQUEST] GET /api/v1/equipment");
    const response = await fetch(`${API_BASE_URL}/api/v1/equipment`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("<<< [LIVE API RESPONSE] Equipment list:", data);

    const liveItems = Array.isArray(data) ? data.map(normalizeLiveEquipment) : [];
    const liveIds = new Set(liveItems.map((e) => e.id));

    // Merge: live items first, then local/mock items that don't share the same ID
    const localEquipments = getEquipments();
    const mockItems = localEquipments.filter((e) => !liveIds.has(e.id));
    return [...liveItems, ...mockItems];
  } catch (error) {
    console.warn("[MARKETPLACE] Live API fetch failed, using mock catalog:", error.message);
    return getEquipments();
  }
};

/**
 * Add new equipment (will be called from Equipment Owner dashboard)
 * NOTE: When backend API is ready, replace with:
 * const response = await axios.post(`${API_BASE_URL}/equipments`, equipmentData);
 * return response.data;
 */
export const addEquipment = (equipmentData) => {
  try {
    const list = getEquipments();
    const newEquipment = {
      ...equipmentData,
      id: equipmentData.id || `EQ-${Date.now().toString().slice(-4)}`,
      available: equipmentData.available !== undefined ? equipmentData.available : true,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEquipment);
    localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(list));
    return newEquipment;
  } catch (error) {
    console.error("Error adding equipment:", error);
    return null;
  }
};

/**
 * Update existing equipment post (name, price, location, specs, availability, etc.)
 */
export const updateEquipment = (equipmentId, updatedData) => {
  try {
    const list = getEquipments();
    const index = list.findIndex((item) => item.id === equipmentId);
    if (index === -1) {
      console.warn(`Equipment ${equipmentId} not found for update`);
      return null;
    }
    const updatedItem = {
      ...list[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updatedItem;
    localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(list));
    return updatedItem;
  } catch (error) {
    console.error("Error updating equipment:", error);
    return null;
  }
};

/**
 * Delete an equipment post
 */
export const deleteEquipment = (equipmentId) => {
  try {
    const list = getEquipments();
    const filtered = list.filter((item) => item.id !== equipmentId);
    localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return false;
  }
};

/**
 * Quick toggle for equipment availability
 */
export const toggleEquipmentAvailability = (equipmentId) => {
  try {
    const list = getEquipments();
    const item = list.find((e) => e.id === equipmentId);
    if (!item) return null;
    item.available = !item.available;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(list));
    return item;
  } catch (error) {
    console.error("Error toggling equipment availability:", error);
    return null;
  }
};

/**
 * Fetch rental requests placed by farmers.
 * Merges session-stored new bookings (from live API) with the default demo requests.
 * NOTE: When backend API is ready, replace with:
 * const response = await axios.get(`${API_BASE_URL}/rentals/requests`);
 * return response.data;
 */
export const getRentalRequests = () => {
  try {
    // Pull any new bookings saved to session during this visit
    const SESSION_KEY = "agrirent_session_requests";
    const sessionRequests = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");

    // Merge with default demo requests; session items take priority at the top
    const sessionIds = new Set(sessionRequests.map((r) => r.id));
    const baseRequests = DEFAULT_REQUESTS.filter((r) => !sessionIds.has(r.id));
    return [...sessionRequests, ...baseRequests];
  } catch (error) {
    console.error("Error reading rental requests:", error);
    return DEFAULT_REQUESTS;
  }
};

/**
 * Place a new equipment rental request.
 * For live API equipment (item._source === "live"), also fires POST /api/v1/bookings.
 * Always stores the request in session for My Requests tracking.
 */
export const createRentalRequest = async (requestData) => {
  // Build the local request record first
  const localRequest = {
    ...requestData,
    id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  // If this is a live-API equipment, fire a real booking to the backend
  if (requestData._isLiveEquipment && requestData.farmerId && requestData.equipmentId) {
    try {
      const bookingPayload = {
        farmer_id: requestData.farmerId,
        equipment_id: requestData.equipmentId,
        service_location: requestData.farmLocation || "Farm location not specified",
        farm_size_hectares: parseFloat(requestData.farmSizeHectares) || 1,
        preferred_start_date: requestData.startDate,
        notes: requestData.notes || "",
      };

      console.log(">>> [LIVE API BOOKING REQUEST] POST /api/v1/bookings", bookingPayload);
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();
      console.log("<<< [LIVE API BOOKING RESPONSE]", result);

      if (response.ok) {
        // Enrich local record with backend response data
        localRequest.id = result.id || localRequest.id;
        localRequest.agreedTotalCost = result.agreed_total_cost;
        localRequest.status = result.status === "pending" ? "Pending" : result.status;
        localRequest._bookingId = result.id;
        console.log("[BOOKING] Created on backend with id:", result.id);
      } else {
        console.warn("[BOOKING] Backend responded with error:", result);
      }
    } catch (err) {
      console.warn("[BOOKING] Live API booking failed, saved locally only:", err.message);
    }
  }

  // Store in session for My Requests tab (session clears on browser close)
  try {
    const SESSION_KEY = "agrirent_session_requests";
    const existing = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
    existing.unshift(localRequest);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn("[REQUEST] Could not save to session storage:", err.message);
  }

  return localRequest;
};

/**
 * Update the status of a rental request
 * Applicable statuses: "Pending" | "Approved" | "In Use" | "Completed" | "Declined" | "Cancelled"
 * NOTE: When backend API is ready, replace with:
 * const response = await axios.patch(`${API_BASE_URL}/rentals/requests/${requestId}`, { status: newStatus });
 * return response.data;
 */
export const updateRequestStatus = (requestId, newStatus) => {
  try {
    const requests = getRentalRequests();
    const updated = requests.map((req) =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error updating request status:", error);
    return null;
  }
};

/**
 * Farmer cancels a pending request
 */
export const cancelRentalRequest = (requestId) => {
  return updateRequestStatus(requestId, "Cancelled");
};
