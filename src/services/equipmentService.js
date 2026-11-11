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

// Initial equipment listings uploaded by Equipment Owners: empty by default so counting starts strictly from backend / owner posts
const DEFAULT_EQUIPMENTS = [];

// Initial starter requests: empty by default so newly onboarded owners and farmers start with 0 requests
const DEFAULT_REQUESTS = [];

/**
 * Fetch all equipments uploaded by Equipment Owners locally or in session
 */
export const getEquipments = () => {
  try {
    const PURGE_FLAG = "agrirent_fleet_reset_v4";
    if (typeof window !== "undefined" && !localStorage.getItem(PURGE_FLAG)) {
      localStorage.removeItem(STORAGE_KEY_EQUIPMENTS);
      localStorage.setItem(PURGE_FLAG, "true");
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY_EQUIPMENTS);
    if (!stored) {
      return [];
    }
    const items = JSON.parse(stored);
    // Purge legacy mock equipments (EQ-101 to EQ-106) and any backend dummy ids
    const cleaned = items.filter(
      (item) =>
        item &&
        item.id !== "6e4de458-ff55-42b9-96f1-41793130cdef" &&
        !["EQ-101", "EQ-102", "EQ-103", "EQ-104", "EQ-105", "EQ-106"].includes(item.id)
    );
    if (cleaned.length !== items.length) {
      localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (error) {
    console.error("Error reading equipments:", error);
    return [];
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
  provider_id: apiItem.provider_id,
  name: apiItem.equipment_type || "Agricultural Equipment",
  category: (apiItem.equipment_type || "").split(" - ")[0] || "Tractor",
  ownerName: apiItem.provider_name || "Equipment Owner",
  ownerPhone: apiItem.provider_phone || "+234 800 000 0000",
  ownerEmail: apiItem.provider_email || apiItem.email || "",
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
  condition: "Good",
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
 * Fetch equipment listings for marketplace.
 * Connects to live API and merges with owner-posted equipments from local storage,
 * while strictly filtering out legacy dummy data so the marketplace starts clean
 * with only genuine owner-posted machinery.
 */
export const fetchMarketplaceEquipments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/equipment`);
    if (response.ok) {
      const data = await response.json();
      // Exclude the stubborn hardcoded dummy equipment from backend
      const liveItems = Array.isArray(data)
        ? data
            .filter((item) => item.id !== "6e4de458-ff55-42b9-96f1-41793130cdef")
            .map(normalizeLiveEquipment)
        : [];
      const liveIds = new Set(liveItems.map((e) => e.id));
      const localEquipments = getEquipments();
      const nonDuplicateLocal = localEquipments.filter((e) => !liveIds.has(e.id));
      return [...liveItems, ...nonDuplicateLocal];
    }
    return getEquipments();
  } catch (error) {
    console.warn("[MARKETPLACE] Live API fetch failed, using local catalog:", error.message);
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
    const SESSION_KEY = "agrirent_session_requests";
    const sessionRequests = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
    const localRequests = JSON.parse(localStorage.getItem(STORAGE_KEY_REQUESTS) || "[]");

    // Filter out any legacy dummy requests if present
    const cleanSession = sessionRequests.filter(
      (r) => !["REQ-2026-001", "REQ-2026-002", "REQ-2026-003"].includes(r.id)
    );
    if (cleanSession.length !== sessionRequests.length) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(cleanSession));
    }

    const cleanLocal = localRequests.filter(
      (r) => !["REQ-2026-001", "REQ-2026-002", "REQ-2026-003"].includes(r.id)
    );
    if (cleanLocal.length !== localRequests.length) {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(cleanLocal));
    }

    const sessionIds = new Set(cleanSession.map((r) => r.id));
    const merged = [...cleanSession, ...cleanLocal.filter((r) => !sessionIds.has(r.id))];
    return merged;
  } catch (error) {
    console.error("Error reading rental requests:", error);
    return [];
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
