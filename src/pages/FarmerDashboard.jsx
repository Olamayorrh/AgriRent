import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { userContext } from "../components/Context.jsx";
import FarmerSideNav from "../components/farmer/FarmerSideNav.jsx";
import FarmerTopNav from "../components/farmer/FarmerTopNav.jsx";
import FarmerOverview from "../components/farmer/FarmerOverview.jsx";
import FarmerEquipmentRental from "../components/farmer/FarmerEquipmentRental.jsx";
import FarmerRequests from "../components/farmer/FarmerRequests.jsx";
import FarmerPlots from "../components/farmer/FarmerPlots.jsx";
import FarmerSettings from "../components/farmer/FarmerSettings.jsx";
import FarmerBookingModal from "../components/farmer/FarmerBookingModal.jsx";
import FarmerBookingConfirmationModal from "../components/farmer/FarmerBookingConfirmationModal.jsx";
import {
  fetchMarketplaceEquipments,
  getRentalRequests,
} from "../services/equipmentService.js";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, handleLogout } = useContext(userContext);

  // Active navigation tab state ('dashboard' is the default page)
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Equipment listings fetched from live API + mock catalog fallback
  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(false);
  const [requests, setRequests] = useState(() => getRentalRequests());

  // Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState(null);

  // Booking Confirmation / Error Screen Popup state
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    isError: false,
    errorMessage: "",
    bookingData: null,
  });

  // Fallback demo user if accessed directly without logging in
  const activeUser = currentUser || {
    name: "Adebayo Farmer",
    email: "farmer@agrirent.com",
    number: "08011112222",
    location: "Ota, Ogun State",
    role: "Farmer",
  };

  // Reload data from service
  const loadData = () => {
    const loadedRequests = getRentalRequests();
    setRequests(loadedRequests);
  };

  // Reload equipment catalog from service & live API
  const loadEquipments = () => {
    setEquipmentsLoading(true);
    fetchMarketplaceEquipments()
      .then((items) => setEquipments(items))
      .catch(() => {
        setEquipments([]);
      })
      .finally(() => setEquipmentsLoading(false));
  };

  // Re-fetch equipment whenever active navigation tab changes
  useEffect(() => {
    loadEquipments();
  }, [activeNav]);

  // Listen to window focus, cross-tab storage, and equipment post events
  useEffect(() => {
    const handleSync = () => {
      loadEquipments();
      loadData();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);
    window.addEventListener("agrirent_equipment_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("agrirent_equipment_updated", handleSync);
    };
  }, []);

  // Logout handler routing back to landing page
  const onLogout = () => {
    if (handleLogout) {
      handleLogout(navigate);
    } else {
      localStorage.removeItem("loggedInUser");
      if (setCurrentUser) setCurrentUser(null);
      navigate("/");
    }
  };

  // Open booking modal for a specific equipment
  const handleOpenBookingModal = (equipment) => {
    setSelectedEquipmentForBooking(equipment);
    setIsBookingModalOpen(true);
  };

  // When a booking is placed, refresh requests and show confirmation screen
  const handleBookingSuccess = (newRequest) => {
    loadData();
    setConfirmationState({
      isOpen: true,
      isError: false,
      errorMessage: "",
      bookingData: newRequest || selectedEquipmentForBooking,
    });
  };

  // When a booking fails, display the error screen
  const handleBookingError = (error, requestPayload) => {
    setConfirmationState({
      isOpen: true,
      isError: true,
      errorMessage:
        error?.response?.data?.message ||
        error?.message ||
        "Unable to connect to the rental database. Please verify your dates and internet connection.",
      bookingData: requestPayload || selectedEquipmentForBooking,
    });
  };

  // Track booking action from confirmation popup
  const handleTrackBooking = () => {
    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
    setActiveNav("my-requests");
  };

  // Retry booking action from error popup
  const handleRetryBooking = () => {
    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
    setIsBookingModalOpen(true);
  };

  // Count pending requests for notifications / badges
  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length;

  // Render the dynamic body component based on activeNav from SideNav
  const renderDashboardBody = () => {
    switch (activeNav) {
      case "dashboard":
        return (
          <FarmerOverview
            currentUser={activeUser}
            requests={requests}
            equipments={equipments}
            onNavigate={(tab) => setActiveNav(tab)}
            onOpenBookingModal={handleOpenBookingModal}
            isLoading={equipmentsLoading}
          />
        );
      case "equipment-rental":
      case "marketplace":
        return (
          <FarmerEquipmentRental
            equipments={equipments}
            isLoading={equipmentsLoading}
            onOpenBookingModal={handleOpenBookingModal}
            onNavigate={(tab) => setActiveNav(tab)}
          />
        );
      case "my-requests":
        return (
          <FarmerRequests
            requests={requests}
            onRefreshRequests={loadData}
            onNavigate={(tab) => setActiveNav(tab)}
          />
        );
      case "farm-plots":
      case "farm-management":
        return (
          <FarmerPlots
            currentUser={activeUser}
            requests={requests}
            onNavigate={(tab) => setActiveNav(tab)}
          />
        );
      case "settings":
        return (
          <FarmerSettings
            currentUser={activeUser}
            setCurrentUser={setCurrentUser}
            onLogout={onLogout}
          />
        );
      default:
        return (
          <FarmerOverview
            currentUser={activeUser}
            requests={requests}
            equipments={equipments}
            onNavigate={(tab) => setActiveNav(tab)}
            onOpenBookingModal={handleOpenBookingModal}
            isLoading={equipmentsLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex text-gray-800 antialiased font-['Sora',sans-serif]">
      {/* Side Navigation Component */}
      <FarmerSideNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
        onLogout={onLogout}
        currentUser={activeUser}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navigation Bar */}
        <FarmerTopNav
          currentUser={activeUser}
          onLogout={onLogout}
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          pendingCount={pendingRequestsCount}
          isDbLoading={equipmentsLoading}
          onRefreshData={() => {
            setEquipmentsLoading(true);
            fetchMarketplaceEquipments()
              .then((items) => setEquipments(items))
              .catch(() => setEquipments([]))
              .finally(() => setEquipmentsLoading(false));
          }}
        />

        {/* Dynamic Body Content based on selection from SideNav */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0">
          {renderDashboardBody()}
        </main>
      </div>

      {/* Booking Equipment Request Modal */}
      <FarmerBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedEquipmentForBooking(null);
        }}
        equipment={selectedEquipmentForBooking}
        currentUser={activeUser}
        onBookingSuccess={handleBookingSuccess}
        onBookingError={handleBookingError}
      />

      {/* Booking Confirmation / Failure Status Popup */}
      <FarmerBookingConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState((prev) => ({ ...prev, isOpen: false }))}
        isError={confirmationState.isError}
        errorMessage={confirmationState.errorMessage}
        bookingData={confirmationState.bookingData}
        onTrackBooking={handleTrackBooking}
        onRetry={handleRetryBooking}
      />
    </div>
  );
};

export default FarmerDashboard;
