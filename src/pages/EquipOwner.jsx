import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { userContext } from "../components/Context.jsx";
import OwnerSideNav from "../components/owner/OwnerSideNav.jsx";
import OwnerTopNav from "../components/owner/OwnerTopNav.jsx";
import OwnerOverview from "../components/owner/OwnerOverview.jsx";
import MyEquipment from "../components/owner/MyEquipment.jsx";
import OwnerRequests from "../components/owner/OwnerRequests.jsx";
import OwnerEarnings from "../components/owner/OwnerEarnings.jsx";
import OwnerSettings from "../components/owner/OwnerSettings.jsx";
import OwnerPostModal from "../components/owner/OwnerPostModal.jsx";
import {
  getEquipments,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  toggleEquipmentAvailability,
  getRentalRequests,
} from "../services/equipmentService.js";

const EquipOwner = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, handleLogout } = useContext(userContext);

  // Active navigation tab state ('dashboard' is the default page)
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Equipment fleet and incoming rental requests
  const [myEquipments, setMyEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Post / Edit Modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Fallback demo user if accessed directly without logging in
  const activeUser = currentUser || {
    name: "Alhaji Ibrahim Danladi",
    email: "owner@agrirent.com",
    number: "+234 803 123 4567",
    location: "Ibadan, Oyo State",
    role: "Equipment Owner",
    businessName: "Danladi Agro Machinery Hub",
  };

  // Reload all fleet and request data from service
  const reloadData = () => {
    setIsLoading(true);
    try {
      const eqList = getEquipments();
      const reqList = getRentalRequests();
      setMyEquipments(eqList);
      setRequests(reqList);
    } catch (err) {
      console.error("Error loading equipment owner data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    reloadData();
  }, []);

  // Logout handler
  const onLogout = () => {
    if (handleLogout) {
      handleLogout(navigate);
    } else {
      localStorage.removeItem("loggedInUser");
      if (setCurrentUser) setCurrentUser(null);
      navigate("/");
    }
  };

  // Open modal to add a brand new equipment post
  const handleOpenAddModal = () => {
    setEditingEquipment(null);
    setIsPostModalOpen(true);
  };

  // Open modal to edit existing equipment
  const handleOpenEditModal = (equipment) => {
    setEditingEquipment(equipment);
    setIsPostModalOpen(true);
  };

  // Handle post submit (both add and edit)
  const handleSubmitEquipment = (equipmentData, isEditing) => {
    if (isEditing && equipmentData.id) {
      updateEquipment(equipmentData.id, equipmentData);
    } else {
      addEquipment(equipmentData);
    }
    reloadData();
  };

  // Handle equipment deletion
  const handleDeleteEquipment = (equipmentId) => {
    deleteEquipment(equipmentId);
    reloadData();
  };

  // Handle instant availability toggle
  const handleToggleAvailability = (equipmentId) => {
    toggleEquipmentAvailability(equipmentId);
    reloadData();
  };

  // Count pending incoming requests for notification badges
  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length;

  // Render the dynamic body component based on activeNav from SideNav
  const renderDashboardBody = () => {
    switch (activeNav) {
      case "dashboard":
        return (
          <OwnerOverview
            currentUser={activeUser}
            myEquipments={myEquipments}
            requests={requests}
            onNavigate={(tab) => setActiveNav(tab)}
            onOpenPostModal={handleOpenAddModal}
            onEditEquipment={handleOpenEditModal}
            onToggleAvailability={handleToggleAvailability}
            isLoading={isLoading}
          />
        );
      case "my-equipment":
        return (
          <MyEquipment
            equipments={myEquipments}
            onOpenPostModal={handleOpenAddModal}
            onEditEquipment={handleOpenEditModal}
            onDeleteEquipment={handleDeleteEquipment}
            onToggleAvailability={handleToggleAvailability}
            isLoading={isLoading}
          />
        );
      case "rental-requests":
        return (
          <OwnerRequests
            requests={requests}
            onRefreshRequests={reloadData}
          />
        );
      case "earnings":
        return (
          <OwnerEarnings
            requests={requests}
            myEquipments={myEquipments}
          />
        );
      case "settings":
        return (
          <OwnerSettings
            currentUser={activeUser}
            setCurrentUser={setCurrentUser}
            onLogout={onLogout}
          />
        );
      default:
        return (
          <OwnerOverview
            currentUser={activeUser}
            myEquipments={myEquipments}
            requests={requests}
            onNavigate={(tab) => setActiveNav(tab)}
            onOpenPostModal={handleOpenAddModal}
            onEditEquipment={handleOpenEditModal}
            onToggleAvailability={handleToggleAvailability}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex text-gray-800 antialiased font-['Sora',sans-serif]">
      {/* Side Navigation Component */}
      <OwnerSideNav
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
        <OwnerTopNav
          currentUser={activeUser}
          onLogout={onLogout}
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          pendingCount={pendingRequestsCount}
          isDbLoading={isLoading}
          onRefreshData={reloadData}
          onOpenPostModal={handleOpenAddModal}
        />

        {/* Dynamic Body Content based on selection from SideNav */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full min-w-0">
          {renderDashboardBody()}
        </main>
      </div>

      {/* Post & Edit Equipment Modal */}
      <OwnerPostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setEditingEquipment(null);
        }}
        onSubmitEquipment={handleSubmitEquipment}
        editingEquipment={editingEquipment}
        currentUser={activeUser}
      />
    </div>
  );
};

export default EquipOwner;
