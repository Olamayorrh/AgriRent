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
    // Purge legacy mock equipments (EQ-101 to EQ-106)
    const cleaned = items.filter(
      (item) =>
        item &&
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
export const normalizeLiveEquipment = (apiItem) => {
  if (!apiItem) return null;

  const id = String(apiItem.id || apiItem._id || apiItem.equipment_id || `EQ-${Date.now()}`);
  const rawName =
    apiItem.equipment_type ||
    apiItem.name ||
    apiItem.title ||
    apiItem.equipment_name ||
    apiItem.model ||
    "Agricultural Equipment";

  // Clean name if format is "Tractor - Massey Ferguson"
  const nameParts = typeof rawName === "string" ? rawName.split(" - ") : [rawName];
  const category =
    apiItem.category ||
    (nameParts.length > 1 ? nameParts[0].trim() : null) ||
    (typeof rawName === "string" ? rawName.split(" ")[0].trim() : null) ||
    "Tractor";

  const displayName = nameParts.length > 1 ? nameParts.slice(1).join(" - ").trim() : rawName;

  const ownerName =
    apiItem.provider_name ||
    apiItem.providerName ||
    apiItem.owner_name ||
    apiItem.ownerName ||
    apiItem.provider?.full_name ||
    apiItem.provider?.name ||
    "Equipment Owner";

  const ownerPhone =
    apiItem.provider_phone ||
    apiItem.providerPhone ||
    apiItem.phone ||
    apiItem.phone_number ||
    apiItem.provider?.phone_number ||
    "+234 800 000 0000";

  const ownerEmail =
    apiItem.provider_email ||
    apiItem.providerEmail ||
    apiItem.email ||
    apiItem.provider?.email ||
    "";

  const location =
    apiItem.service_area ||
    apiItem.location ||
    apiItem.state ||
    apiItem.address ||
    "Nigeria";

  const dailyRate = Number(
    apiItem.base_price ||
    apiItem.dailyRate ||
    apiItem.daily_rate ||
    apiItem.price ||
    apiItem.rate ||
    0
  );

  const priceBasis = apiItem.price_basis || apiItem.priceBasis || "per_day";

  const available =
    apiItem.is_active !== false &&
    apiItem.is_available !== false &&
    apiItem.available !== false &&
    apiItem.status !== "inactive" &&
    apiItem.status !== "maintenance";

  const image =
    apiItem.image_url ||
    apiItem.imageUrl ||
    apiItem.image ||
    resolveEquipmentImage(rawName || category);

  return {
    id,
    provider_id: apiItem.provider_id || apiItem.providerId || apiItem.owner_id || apiItem.ownerId,
    name: displayName || rawName,
    category,
    ownerName,
    ownerPhone,
    ownerEmail,
    location,
    dailyRate,
    priceBasis,
    specs: {
      power: apiItem.power || apiItem.specs?.power || "Standard",
      fuel: apiItem.fuel || apiItem.specs?.fuel || "Diesel",
      ...(apiItem.includes_operator !== undefined && {
        operator: apiItem.includes_operator ? "Included" : "Not Included",
      }),
      ...(apiItem.includes_fuel !== undefined && {
        fuel: apiItem.includes_fuel ? "Fuel Included" : "Fuel Extra",
      }),
      ...(apiItem.specs || {}),
    },
    condition: apiItem.condition || "Good",
    available,
    rating: apiItem.rating || 5.0,
    reviewsCount: apiItem.reviewsCount || 0,
    image,
    description:
      apiItem.description ||
      `Agricultural equipment available for hire in ${location}. Contact owner for details.`,
    _source: "live",
  };
};

/**
 * Fetch equipment listings for marketplace.
 * Connects to live API and merges with owner-posted equipments from local storage,
 * while filtering out legacy mock items (EQ-101 to EQ-106).
 */
export const fetchMarketplaceEquipments = async () => {
  const localEquipments = getEquipments();
  let liveItems = [];

  // Try fetching from the live backend API
  try {
    let response = await fetch(`${API_BASE_URL}/api/v1/equipment`);
    if (!response.ok && response.status === 404) {
      response = await fetch(`${API_BASE_URL}/api/v1/equipments`);
    }

    if (response.ok) {
      const data = await response.json();
      console.log("<<< [MARKETPLACE] Live API response:", data);

      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.equipments)
        ? data.equipments
        : Array.isArray(data?.equipment)
        ? data.equipment
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.items)
        ? data.items
        : [];

      liveItems = rawList
        .filter(
          (item) =>
            item &&
            !["EQ-101", "EQ-102", "EQ-103", "EQ-104", "EQ-105", "EQ-106"].includes(item.id)
        )
        .map(normalizeLiveEquipment)
        .filter(Boolean);
    }
  } catch (error) {
    console.warn("[MARKETPLACE] Live API fetch warning, using local catalog:", error.message);
  }

  // Merge live items with local items (avoiding duplicates by id)
  const liveIds = new Set(liveItems.map((e) => String(e.id)));
  const nonDuplicateLocal = localEquipments.filter((e) => !liveIds.has(String(e.id)));
  return [...liveItems, ...nonDuplicateLocal];
};

/**
 * Add new equipment (called from Equipment Owner dashboard)
 * Saves locally and syncs to backend API
 */
export const addEquipment = async (equipmentData) => {
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

    // Also attempt to push to live backend API
    try {
      const apiPayload = {
        provider_id: equipmentData.provider_id || equipmentData.ownerId,
        equipment_type: equipmentData.name ? `${equipmentData.category} - ${equipmentData.name}` : equipmentData.category,
        service_area: equipmentData.location,
        base_price: Number(equipmentData.dailyRate) || 0,
        price_basis: equipmentData.priceBasis || "per_day",
        includes_operator: Boolean(equipmentData.specs?.operator === "Included"),
        includes_fuel: Boolean(equipmentData.specs?.fuel === "Fuel Included"),
        is_active: equipmentData.available !== false,
      };

      console.log(">>> [LIVE API POST EQUIPMENT]", apiPayload);
      const res = await fetch(`${API_BASE_URL}/api/v1/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (res.ok) {
        const resData = await res.json();
        console.log("<<< [LIVE API POST EQUIPMENT SUCCESS]", resData);
        const createdId = resData?.id || resData?.data?.id;
        if (createdId) {
          newEquipment.id = createdId;
          newEquipment._source = "live";
          localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(list));
        }
      }
    } catch (apiErr) {
      console.warn("[ADD EQUIPMENT] Backend sync note:", apiErr.message);
    }

    // Trigger update event across tabs & components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("agrirent_equipment_updated"));
    }

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
 * Saves to both localStorage and sessionStorage so all users and owner portals receive it.
 * For live API equipment, also fires POST /api/v1/bookings to backend database.
 */
export const createRentalRequest = async (requestData) => {
  // Build the request record
  const localRequest = {
    ...requestData,
    id: requestData.id || `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: requestData.status || "Pending",
    createdAt: new Date().toISOString(),
  };

  // If this is a live-API equipment or has live IDs, fire booking to backend API
  if (requestData.equipmentId && (requestData._isLiveEquipment || requestData.farmerId)) {
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

      if (response.ok) {
        const result = await response.json();
        console.log("<<< [LIVE API BOOKING RESPONSE]", result);
        localRequest.id = result.id || localRequest.id;
        localRequest.agreedTotalCost = result.agreed_total_cost || localRequest.totalAmount;
        localRequest.status = result.status === "pending" ? "Pending" : result.status || "Pending";
        localRequest._bookingId = result.id;
      }
    } catch (err) {
      console.warn("[BOOKING] Live API booking note:", err.message);
    }
  }

  // 1. Save to persistent localStorage so Equipment Owner receives it across tabs/sessions
  try {
    const localRequests = JSON.parse(localStorage.getItem(STORAGE_KEY_REQUESTS) || "[]");
    const filtered = localRequests.filter((r) => r.id !== localRequest.id);
    filtered.unshift(localRequest);
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(filtered));
  } catch (err) {
    console.warn("[REQUEST] Could not save to localStorage:", err.message);
  }

  // 2. Also save to sessionStorage for instant farmer tab tracking
  try {
    const SESSION_KEY = "agrirent_session_requests";
    const existing = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
    const filteredSession = existing.filter((r) => r.id !== localRequest.id);
    filteredSession.unshift(localRequest);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(filteredSession));
  } catch (err) {
    console.warn("[REQUEST] Could not save to sessionStorage:", err.message);
  }

  // 3. Broadcast sync events across all active windows/tabs
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("agrirent_request_created"));
    window.dispatchEvent(new Event("storage"));
  }

  return localRequest;
};

/**
 * Fetch all rental requests with live backend bookings support
 */
export const fetchAllRentalRequests = async () => {
  const localRequests = getRentalRequests();

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/bookings`);
    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];

      const liveRequests = rawList.map((b) => ({
        id: String(b.id),
        equipmentId: String(b.equipment_id),
        equipmentName: b.equipment_name || "Agricultural Equipment",
        category: b.category || "Tractor",
        farmerId: b.farmer_id,
        farmerName: b.farmer_name || b.farmer?.full_name || "Farmer",
        farmerPhone: b.farmer_phone || b.farmer?.phone_number || "",
        farmerEmail: b.farmer_email || b.farmer?.email || "",
        ownerEmail: b.provider_email || b.provider?.email || "",
        ownerName: b.provider_name || b.provider?.full_name || "",
        provider_id: b.provider_id,
        farmLocation: b.service_location || "Farm location",
        farmSizeHectares: b.farm_size_hectares || 1,
        startDate: b.preferred_start_date || "",
        notes: b.notes || "",
        status: b.status === "pending" ? "Pending" : b.status || "Pending",
        totalAmount: b.agreed_total_cost || 0,
        createdAt: b.created_at || new Date().toISOString(),
        _source: "live",
      }));

      const liveIds = new Set(liveRequests.map((r) => r.id));
      const filteredLocal = localRequests.filter((r) => !liveIds.has(String(r.id)));
      return [...liveRequests, ...filteredLocal];
    }
  } catch (err) {
    console.warn("[BOOKINGS] Backend fetch note:", err.message);
  }

  return localRequests;
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
