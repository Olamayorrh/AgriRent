import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import {
  SproutIcon,
  CalendarIcon,
  MoneyIcon,
  ShoppingCartIcon,
  TractorIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  FilterIcon,
  CloseIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
} from "./FarmerIcons";

const FarmerPlots = ({ currentUser, requests = [], onNavigate }) => {
  // Active farm plots - empty by default pending farmer input
  const [plots, setPlots] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agrirent_farmer_plots") || "[]");
    } catch {
      return [];
    }
  });

  // Upcoming Farm Tasks - empty by default pending farmer input
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agrirent_farmer_tasks") || "[]");
    } catch {
      return [];
    }
  });

  // Comprehensive farming processes, purchases, rentals, and activity logs - empty by default
  const [processes, setProcesses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agrirent_farmer_processes") || "[]");
    } catch {
      return [];
    }
  });

  // Persist farm management data locally
  useEffect(() => {
    try {
      localStorage.setItem("agrirent_farmer_plots", JSON.stringify(plots));
    } catch (e) {
      console.error(e);
    }
  }, [plots]);

  useEffect(() => {
    try {
      localStorage.setItem("agrirent_farmer_tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("agrirent_farmer_processes", JSON.stringify(processes));
    } catch (e) {
      console.error(e);
    }
  }, [processes]);

  // Modal visibility states
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);

  // View Details Modal state
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Edit Activity Modal state
  const [editingProcess, setEditingProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    category: "Equipment Rental",
    plotName: "Plot A: Maize",
    status: "Done",
    amountSpent: "",
    date: "",
    nextHarvestPeriod: "",
    notes: "",
  });

  // Filter state for processes ledger
  const [processFilter, setProcessFilter] = useState("All");

  // Form state for adding a new farming process
  const [processForm, setProcessForm] = useState({
    title: "",
    category: "Equipment Rental",
    plotName: "Plot A: Maize",
    status: "Done",
    amountSpent: "",
    date: new Date().toISOString().split("T")[0],
    nextHarvestPeriod: "",
    notes: "",
  });

  // Form state for adding a new plot
  const [plotForm, setPlotForm] = useState({
    name: "",
    crop: "",
    acres: "",
    phase: "Land preparation",
    progress: 10,
    harvestWindow: "",
  });

  // Calculate financial and operational metrics
  const totalAmountSpent = useMemo(() => {
    return processes
      .filter((p) => p.status === "Done" || p.status === "Purchased")
      .reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  }, [processes]);

  const rentalsSpent = useMemo(() => {
    return processes
      .filter((p) => p.category === "Equipment Rental" && (p.status === "Done" || p.status === "Purchased"))
      .reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  }, [processes]);

  const purchasesSpent = useMemo(() => {
    return processes
      .filter((p) => p.category === "Recent Purchase" && (p.status === "Purchased" || p.status === "Done"))
      .reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  }, [processes]);

  // Dynamic next harvesting info based on farmer inputs
  const nextHarvestInfo = useMemo(() => {
    const harvestProcess = processes.find(
      (p) =>
        (p.category === "Harvesting" || p.title.toLowerCase().includes("harvest")) &&
        (p.nextHarvestPeriod || p.date)
    );
    if (harvestProcess) {
      return {
        date: harvestProcess.nextHarvestPeriod || harvestProcess.date,
        detail: `${harvestProcess.plotName || "Farm Plot"} (${harvestProcess.title})`,
      };
    }
    const harvestPlot = plots.find((p) => p.harvestWindow);
    if (harvestPlot) {
      return {
        date: harvestPlot.harvestWindow,
        detail: `${harvestPlot.name} (${harvestPlot.acres})`,
      };
    }
    return null;
  }, [processes, plots]);

  // Filtered processes based on active filter tab
  const filteredProcesses = useMemo(() => {
    if (processFilter === "All") return processes;
    if (processFilter === "Done / Purchased") {
      return processes.filter((p) => p.status === "Done" || p.status === "Purchased");
    }
    if (processFilter === "Planned Activities") {
      return processes.filter((p) => p.status === "Planned" || p.status === "In Progress");
    }
    if (processFilter === "Rentals Paid") {
      return processes.filter((p) => p.category === "Equipment Rental");
    }
    if (processFilter === "Purchases") {
      return processes.filter((p) => p.category === "Recent Purchase");
    }
    if (processFilter === "Harvest Plans") {
      return processes.filter(
        (p) =>
          p.title.toLowerCase().includes("harvest") ||
          p.category.toLowerCase().includes("harvest")
      );
    }
    return processes;
  }, [processes, processFilter]);

  // Handle adding new farming process / expense
  const handleCreateProcess = (e) => {
    e.preventDefault();
    if (!processForm.title.trim()) {
      toast.warning("Please enter a title for this farming activity or purchase.");
      return;
    }

    const newEntry = {
      id: `PROC-${Math.floor(100 + Math.random() * 900)}`,
      title: processForm.title.trim(),
      category: processForm.category,
      plotName: processForm.plotName,
      status: processForm.status,
      amountSpent: Number(processForm.amountSpent) || 0,
      date: processForm.date,
      nextHarvestPeriod: processForm.nextHarvestPeriod || "Not specified",
      notes: processForm.notes || "Recorded via Farm Management Workspace.",
    };

    setProcesses([newEntry, ...processes]);
    toast.success(`"${newEntry.title}" recorded successfully!`);

    // Reset and close
    setProcessForm({
      title: "",
      category: "Equipment Rental",
      plotName: "Plot A: Maize",
      status: "Done",
      amountSpent: "",
      date: new Date().toISOString().split("T")[0],
      nextHarvestPeriod: "",
      notes: "",
    });
    setShowAddProcessModal(false);
  };

  // Open View Details modal
  const handleOpenView = (proc) => {
    setSelectedProcess(proc);
    setShowViewModal(true);
  };

  // Open Edit modal
  const handleOpenEdit = (proc) => {
    setEditingProcess(proc);
    setEditForm({
      id: proc.id,
      title: proc.title || "",
      category: proc.category || "Equipment Rental",
      plotName: proc.plotName || "Plot A: Maize",
      status: proc.status || "Done",
      amountSpent: proc.amountSpent !== undefined ? proc.amountSpent : "",
      date: proc.date || new Date().toISOString().split("T")[0],
      nextHarvestPeriod: proc.nextHarvestPeriod || "",
      notes: proc.notes || "",
    });
    setShowEditModal(true);
  };

  // Save changes from Edit modal
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      toast.warning("Please provide a title for the activity.");
      return;
    }

    const updated = {
      ...editingProcess,
      title: editForm.title.trim(),
      category: editForm.category,
      plotName: editForm.plotName,
      status: editForm.status,
      amountSpent: Number(editForm.amountSpent) || 0,
      date: editForm.date,
      nextHarvestPeriod: editForm.nextHarvestPeriod || "Not specified",
      notes: editForm.notes || "",
    };

    setProcesses((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    // If currently viewing this item, update the view state too
    if (selectedProcess && selectedProcess.id === updated.id) {
      setSelectedProcess(updated);
    }

    toast.success(`"${updated.title}" updated successfully!`);
    setShowEditModal(false);
    setEditingProcess(null);
  };

  // Toggle status of a process (e.g. from Planned to Done)
  const handleToggleProcessStatus = (id) => {
    setProcesses((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus =
            item.status === "Planned"
              ? "Done"
              : item.status === "Done"
              ? "Planned"
              : "Done";
          const updated = { ...item, status: newStatus };
          if (selectedProcess && selectedProcess.id === id) {
            setSelectedProcess(updated);
          }
          toast.info(`Updated status to "${newStatus}"`);
          return updated;
        }
        return item;
      })
    );
  };

  // Delete a process entry
  const handleDeleteProcess = (id) => {
    if (window.confirm("Are you sure you want to remove this logged farming activity?")) {
      setProcesses((prev) => prev.filter((p) => p.id !== id));
      if (selectedProcess && selectedProcess.id === id) {
        setShowViewModal(false);
        setSelectedProcess(null);
      }
      toast.info("Process entry removed.");
    }
  };

  // Toggle task completion
  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add new plot
  const handleCreatePlot = (e) => {
    e.preventDefault();
    if (!plotForm.name.trim() || !plotForm.acres.trim()) {
      toast.warning("Please enter plot name and acreage.");
      return;
    }

    const newPlot = {
      id: `plot-${Date.now()}`,
      name: plotForm.name,
      crop: plotForm.crop || "Mixed crop",
      acres: plotForm.acres.includes("acres") ? plotForm.acres : `${plotForm.acres} acres`,
      phase: plotForm.phase,
      progress: Number(plotForm.progress) || 15,
      isFeatured: false,
      plantedDate: new Date().toISOString().split("T")[0],
      estimatedHarvestDate: "2027-02-15",
      harvestWindow: plotForm.harvestWindow || "Upcoming season",
      soilType: "Cultivated soil",
    };

    setPlots([...plots, newPlot]);
    toast.success(`Plot "${newPlot.name}" added successfully!`);
    setPlotForm({
      name: "",
      crop: "",
      acres: "",
      phase: "Land preparation",
      progress: 10,
      harvestWindow: "",
    });
    setShowAddPlotModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <SproutIcon className="w-3.5 h-3.5" />
            <span>Farm Operations & Accounting</span>
          </span>
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900 mt-2">
            Farm Management
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1">
            Log farm inputs, track machinery rental payments, schedule planting & harvesting cycles, and monitor plot growth stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowAddProcessModal(true)}
            className="px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm xl:text-base font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[var(--primary-color)]" />
            <span>Log Farming Process</span>
          </button>
          <button
            onClick={() => setShowAddPlotModal(true)}
            className="px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm xl:text-base font-bold text-[#1B4332] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            + Add Plot
          </button>
        </div>
      </div>

      {/* Financial & Operations Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs xl:text-sm font-bold uppercase tracking-wider">Total Amount Spent</span>
            <div className="p-2 xl:p-2.5 bg-emerald-50 rounded-xl text-[var(--secondary-color)]">
              <MoneyIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-gray-900">
            ₦{totalAmountSpent.toLocaleString()}
          </p>
          <p className="text-[11px] xl:text-xs text-gray-500">
            Recorded expenses ({processes.filter((p) => p.status === "Done" || p.status === "Purchased").length} operations)
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs xl:text-sm font-bold uppercase tracking-wider">Rentals Paid</span>
            <div className="p-2 xl:p-2.5 bg-blue-50 rounded-xl text-blue-700">
              <TractorIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-blue-900">
            ₦{rentalsSpent.toLocaleString()}
          </p>
          <p className="text-[11px] xl:text-xs text-gray-500">
            Plowing, spraying & machinery hire
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs xl:text-sm font-bold uppercase tracking-wider">Recent Purchases</span>
            <div className="p-2 xl:p-2.5 bg-amber-50 rounded-xl text-amber-700">
              <ShoppingCartIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-amber-900">
            ₦{purchasesSpent.toLocaleString()}
          </p>
          <p className="text-[11px] xl:text-xs text-gray-500">
            Seeds, fertilizer & agro-inputs
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 xl:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs xl:text-sm font-bold uppercase tracking-wider">Next Harvesting</span>
            <div className="p-2 xl:p-2.5 bg-purple-50 rounded-xl text-purple-700">
              <CalendarIcon className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-purple-900">
            {nextHarvestInfo ? nextHarvestInfo.date : "None scheduled"}
          </p>
          <p className="text-[11px] xl:text-xs text-gray-500">
            {nextHarvestInfo ? nextHarvestInfo.detail : "Pending farmer input"}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXACT FARM MANAGEMENT SECTION (CLEAN & PROPORTIONED) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 sm:p-7 xl:p-9 space-y-6 xl:space-y-8">
        {/* Workspace Card Header with Circular Plus Button */}
        <div className="relative text-center pb-2">
          <h2 className="text-lg sm:text-xl xl:text-2xl font-extrabold uppercase tracking-wider text-gray-900 font-['Sora',sans-serif]">
            FARM MANAGEMENT
          </h2>
          <p className="text-sm sm:text-base xl:text-lg font-bold text-[#1B4332] mt-0.5">
            Active farm plots
          </p>

          {/* Plus Button in circle (top right as in image) */}
          <button
            onClick={() => setShowAddProcessModal(true)}
            className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 xl:w-11 xl:h-11 rounded-full bg-[#1B4332] hover:bg-[#143225] text-white flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Log new process or plot operation"
            aria-label="Add farming process"
          >
            <span className="text-xl sm:text-2xl xl:text-3xl leading-none font-light mb-0.5">+</span>
          </button>
        </div>

        {/* Active Farm Plots Cards Stack */}
        <div className="space-y-4">
          {plots.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <SproutIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No active farm plots registered yet</p>
              <p className="text-xs text-gray-400 mt-1">Click &quot;+ Add Plot&quot; above to register your first plot</p>
            </div>
          ) : (
            plots.map((plot) => {
              const isDark = plot.isFeatured;

              return (
                <div
                  key={plot.id}
                  className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
                    isDark
                      ? "bg-[#1E3F20] text-white shadow-md"
                      : "bg-white border border-gray-200 shadow-xs hover:border-gray-300"
                  }`}
                >
                  {/* Card Top Row: Name on Left, Acres on Right */}
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm sm:text-base xl:text-lg font-bold ${
                        isDark ? "text-white" : "text-[#1B4332]"
                      }`}
                    >
                      {plot.name}
                    </h3>
                    <span className="text-xs sm:text-sm xl:text-base font-bold text-[#D4A373]">
                      {plot.acres}
                    </span>
                  </div>

                  {/* Subtitle / Stage */}
                  <p
                    className={`text-xs xl:text-sm mt-1 ${
                      isDark ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {plot.phase}
                  </p>

                  {/* Growth Stage Progress Bar */}
                  <div
                    className={`h-2.5 xl:h-3 w-full rounded-full mt-3 overflow-hidden ${
                      isDark ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-[#D4A373] transition-all duration-500"
                      style={{ width: `${plot.progress}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Upcoming Farm Tasks Section */}
        <div className="pt-2">
          <h3 className="text-center text-base sm:text-lg xl:text-xl font-extrabold text-gray-900 mb-4 xl:mb-6">
            Upcoming Farm Tasks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 xl:gap-6">
            {tasks.length === 0 ? (
              <div className="col-span-full p-6 text-center border border-dashed border-gray-200 rounded-2xl">
                <p className="text-xs sm:text-sm font-semibold text-gray-600">No upcoming farm tasks</p>
                <p className="text-xs text-gray-400 mt-0.5">Tasks will appear as you log farm activities</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-center gap-3.5 xl:gap-4 p-3.5 sm:p-4 xl:p-5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  {/* Date Badge with day + amber month */}
                  <div className="w-13 h-13 xl:w-16 xl:h-16 rounded-2xl bg-[#DCE7E1] flex flex-col items-center justify-center shrink-0">
                    <span className="text-base xl:text-xl font-extrabold text-gray-900 leading-tight">
                      {task.day}
                    </span>
                    <span className="text-[11px] xl:text-xs font-bold text-[#D4A373] uppercase leading-none">
                      {task.month}
                    </span>
                  </div>

                  {/* Task Details */}
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs sm:text-sm xl:text-base font-bold truncate ${
                        task.completed ? "line-through text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-[11px] xl:text-xs text-gray-500 truncate mt-0.5">
                      {task.subtitle}
                    </p>
                  </div>

                  {/* Checkbox indicator */}
                  <div
                    className={`w-5 h-5 xl:w-6 xl:h-6 rounded-md border flex items-center justify-center shrink-0 ${
                      task.completed
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* View Farm Calendar Button from Image */}
        <div className="pt-2">
          <button
            onClick={() => setShowCalendarModal(true)}
            className="w-full py-3.5 xl:py-4 rounded-2xl border border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white font-bold text-xs sm:text-sm xl:text-base transition-all duration-200 cursor-pointer text-center block shadow-2xs"
          >
            View Farm Calendar
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FARMING PROCESSES & EXPENDITURE LEDGER (CLEAN & UNCLUTTERED) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-5 sm:p-6 xl:p-8 space-y-5 xl:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg xl:text-xl font-bold text-gray-900">
              Farming Activities & Expenses Ledger
            </h3>
            <p className="text-xs xl:text-sm text-gray-500 mt-0.5">
              Click &quot;View&quot; on any logged operation to inspect full details, amounts, or edit entries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs xl:text-sm font-semibold text-gray-500 hidden sm:inline">
              Filter:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                "All",
                "Done / Purchased",
                "Planned Activities",
                "Rentals Paid",
                "Purchases",
                "Harvest Plans",
              ].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setProcessFilter(filterOption)}
                  className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    processFilter === filterOption
                      ? "bg-[var(--secondary-color)] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean, Uncluttered Ledger Table */}
        {filteredProcesses.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <SproutIcon className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No activities found</p>
            <p className="text-xs text-gray-400">
              No entries match the &quot;{processFilter}&quot; filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-xs xl:text-sm">
                  <th className="pb-3 pl-3">Activity / Farming Process</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProcesses.map((proc) => (
                  <tr
                    key={proc.id}
                    className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                    onClick={() => handleOpenView(proc)}
                  >
                    {/* Activity / Process Title */}
                    <td className="py-4 pl-3 max-w-sm xl:max-w-md">
                      <p className="font-bold text-gray-900 xl:text-base group-hover:text-[var(--secondary-color)] transition-colors">
                        {proc.title}
                      </p>
                      {proc.notes && (
                        <p className="text-[11px] xl:text-xs text-gray-400 truncate mt-0.5 max-w-md xl:max-w-lg">
                          {proc.notes}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span
                        className={`inline-block px-2.5 xl:px-3 py-0.5 xl:py-1 rounded-full text-[10px] xl:text-xs font-bold ${
                          proc.category === "Equipment Rental"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : proc.category === "Recent Purchase"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {proc.category}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] xl:text-xs font-bold ${
                          proc.status === "Done"
                            ? "bg-emerald-100 text-emerald-800"
                            : proc.status === "Purchased"
                            ? "bg-blue-100 text-blue-800"
                            : proc.status === "Planned"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            proc.status === "Done"
                              ? "bg-emerald-600"
                              : proc.status === "Purchased"
                              ? "bg-blue-600"
                              : proc.status === "Planned"
                              ? "bg-amber-600"
                              : "bg-gray-500"
                          }`}
                        />
                        <span>{proc.status}</span>
                      </span>
                    </td>

                    {/* Action: Single View Button */}
                    <td className="py-4 pr-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenView(proc);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold text-[#1B4332] bg-emerald-50 hover:bg-[#1B4332] hover:text-white border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                      >
                        <EyeIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: VIEW ACTIVITY DETAILS (Shows plot, amount spent, dates, notes, and edit action) */}
      {/* ========================================================================= */}
      {showViewModal && selectedProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowViewModal(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[var(--secondary-color)] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wider">
                  Farming Activity Details
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-snug mt-0.5">
                  {selectedProcess.title}
                </h3>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details Grid */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Status and Category banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                    Category
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {selectedProcess.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                    Current Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedProcess.status === "Done"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedProcess.status === "Purchased"
                        ? "bg-blue-100 text-blue-800"
                        : selectedProcess.status === "Planned"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedProcess.status === "Done" && (
                      <CheckIcon className="w-3 h-3 text-emerald-700" />
                    )}
                    <span>{selectedProcess.status}</span>
                  </span>
                </div>
              </div>

              {/* Grid with Plot, Amount, Dates */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Assigned Farm Plot
                  </span>
                  <p className="text-xs font-bold text-gray-900">
                    {selectedProcess.plotName}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Amount Spent / Estimated
                  </span>
                  <p className="text-base font-extrabold text-[var(--secondary-color)]">
                    {selectedProcess.amountSpent
                      ? `₦${selectedProcess.amountSpent.toLocaleString()}`
                      : "—"}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Operation Date
                  </span>
                  <p className="text-xs font-bold text-gray-900">
                    {selectedProcess.date || "Not specified"}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Next Harvesting Period
                  </span>
                  <p className="text-xs font-bold text-purple-900">
                    {selectedProcess.nextHarvestPeriod || "Not scheduled"}
                  </p>
                </div>
              </div>

              {/* Notes and operator section */}
              <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                  Notes & Details
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {selectedProcess.notes || "No additional notes provided for this activity."}
                </p>
              </div>

              {/* Actions Footer inside modal */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleOpenEdit(selectedProcess);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] shadow-xs transition-colors cursor-pointer"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                    <span>Edit Activity</span>
                  </button>

                  <button
                    onClick={() => handleToggleProcessStatus(selectedProcess.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-[var(--secondary-color)] transition-colors cursor-pointer"
                  >
                    {selectedProcess.status === "Planned" ? "Mark as Done" : "Mark as Planned"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteProcess(selectedProcess.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete activity"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT LOGGED FARMING ACTIVITY */}
      {/* ========================================================================= */}
      {showEditModal && editingProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowEditModal(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[var(--secondary-color)] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Edit Farming Activity</h3>
                <p className="text-xs text-white/80">Update details or correct errors made when logging</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Activity / Item Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Process Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    <option value="Equipment Rental">Equipment Rental (Paid)</option>
                    <option value="Recent Purchase">Recent Purchase (Seeds, Fertilizer, Chem)</option>
                    <option value="Planned Activity">Planned Field Activity (Weeding, Irrigation)</option>
                    <option value="Planting Plan">Planting Schedule</option>
                    <option value="Harvest Plan">Harvesting Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Target Farm Plot
                  </label>
                  <select
                    value={editForm.plotName}
                    onChange={(e) => setEditForm({ ...editForm, plotName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    {plots.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.acres})
                      </option>
                    ))}
                    <option value="General / All Plots">General / All Plots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Classification Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    <option value="Done">Done / Executed</option>
                    <option value="Purchased">Purchased</option>
                    <option value="Planned">Planned / Scheduled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Spent / Estimated (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 85000"
                    value={editForm.amountSpent}
                    onChange={(e) => setEditForm({ ...editForm, amountSpent: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Date of Operation / Purchase
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Next Harvesting Period / Target Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 24, 2026 or Dec 2026"
                    value={editForm.nextHarvestPeriod}
                    onChange={(e) => setEditForm({ ...editForm, nextHarvestPeriod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows="2"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOG NEW FARMING PROCESS / INPUT */}
      {/* ========================================================================= */}
      {showAddProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddProcessModal(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[var(--secondary-color)] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Log Farming Process & Expenses</h3>
                <p className="text-xs text-white/80">Record paid rentals, purchases, or planned operations</p>
              </div>
              <button
                onClick={() => setShowAddProcessModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProcess} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Activity / Item Title *
                </label>
                <input
                  type="text"
                  value={processForm.title}
                  onChange={(e) => setProcessForm({ ...processForm, title: e.target.value })}
                  placeholder="e.g. Massey Ferguson Harrowing Rental, or NPK Fertilizer"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Process Category
                  </label>
                  <select
                    value={processForm.category}
                    onChange={(e) => setProcessForm({ ...processForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    <option value="Equipment Rental">Equipment Rental (Paid)</option>
                    <option value="Recent Purchase">Recent Purchase (Seeds, Fertilizer, Chem)</option>
                    <option value="Planned Activity">Planned Field Activity (Weeding, Irrigation)</option>
                    <option value="Planting Plan">Planting Schedule</option>
                    <option value="Harvest Plan">Harvesting Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Target Farm Plot
                  </label>
                  <select
                    value={processForm.plotName}
                    onChange={(e) => setProcessForm({ ...processForm, plotName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    {plots.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.acres})
                      </option>
                    ))}
                    <option value="General / All Plots">General / All Plots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Classification Status
                  </label>
                  <select
                    value={processForm.status}
                    onChange={(e) => setProcessForm({ ...processForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
                  >
                    <option value="Done">Done / Executed</option>
                    <option value="Purchased">Purchased</option>
                    <option value="Planned">Planned / Scheduled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Spent / Estimated (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 85000"
                    value={processForm.amountSpent}
                    onChange={(e) => setProcessForm({ ...processForm, amountSpent: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Date of Operation / Purchase
                  </label>
                  <input
                    type="date"
                    value={processForm.date}
                    onChange={(e) => setProcessForm({ ...processForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Next Harvesting Period / Target Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 24, 2026 or Dec 2026"
                    value={processForm.nextHarvestPeriod}
                    onChange={(e) => setProcessForm({ ...processForm, nextHarvestPeriod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notes / Supplier / Machinery Operator Details
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. High clearance boom sprayer applied over 1.8 acres; supplier receipt #8812."
                  value={processForm.notes}
                  onChange={(e) => setProcessForm({ ...processForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddProcessModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[var(--secondary-color)] hover:bg-[#143225] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW FARM PLOT */}
      {/* ========================================================================= */}
      {showAddPlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddPlotModal(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            <div className="bg-[var(--secondary-color)] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Register New Farm Plot</h3>
                <p className="text-xs text-white/80">Add another field to your management workspace</p>
              </div>
              <button
                onClick={() => setShowAddPlotModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlot} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Plot Title / Field Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. North Ridge: Cassava"
                  value={plotForm.name}
                  onChange={(e) => setPlotForm({ ...plotForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Acreage / Size *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 acres"
                    value={plotForm.acres}
                    onChange={(e) => setPlotForm({ ...plotForm, acres: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Primary Crop
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cassava, Soya, Rice"
                    value={plotForm.crop}
                    onChange={(e) => setPlotForm({ ...plotForm, crop: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Current Growth Phase
                  </label>
                  <select
                    value={plotForm.phase}
                    onChange={(e) => setPlotForm({ ...plotForm, phase: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  >
                    <option value="Land preparation">Land preparation</option>
                    <option value="Planting phase">Planting phase</option>
                    <option value="Vegetative stage">Vegetative stage</option>
                    <option value="Grain filling">Grain filling</option>
                    <option value="Maturity & Ripening">Maturity & Ripening</option>
                    <option value="Harvest ready">Harvest ready</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Growth Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={plotForm.progress}
                    onChange={(e) => setPlotForm({ ...plotForm, progress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Expected Harvest Window
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mid-February 2027"
                  value={plotForm.harvestWindow}
                  onChange={(e) => setPlotForm({ ...plotForm, harvestWindow: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[var(--secondary-color)] rounded-xl hover:bg-[#143225]"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTERACTIVE FARM CALENDAR */}
      {/* ========================================================================= */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCalendarModal(false)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
            <div className="bg-[var(--secondary-color)] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Farm Operations Calendar</h3>
                <p className="text-xs text-white/80">October – December 2026 planting & harvest schedule</p>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Upcoming agenda timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Upcoming Timeline & Harvest Windows
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-xs flex flex-col items-center justify-center">
                        <span>20</span>
                        <span className="text-[9px] uppercase">Oct</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Irrigate Maize (Plot A)</p>
                        <p className="text-[11px] text-gray-500">Scheduled 6:30 AM • 2.5 acres</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                      Irrigation
                    </span>
                  </div>

                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex flex-col items-center justify-center">
                        <span>22</span>
                        <span className="text-[9px] uppercase">Oct</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Plant Bean Seed (Plot B)</p>
                        <p className="text-[11px] text-gray-500">Planting crew deployment • 1.8 acres</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-800 bg-white px-2.5 py-1 rounded-full border border-blue-200">
                      Planting
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold text-xs flex flex-col items-center justify-center">
                        <span>28</span>
                        <span className="text-[9px] uppercase">Oct</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Prepare for Wheat Harvest</p>
                        <p className="text-[11px] text-gray-500">Riverside Field • Machinery readiness inspection</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-white px-2.5 py-1 rounded-full border border-amber-200">
                      Harvest Prep
                    </span>
                  </div>

                  <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold text-xs flex flex-col items-center justify-center">
                        <span>24</span>
                        <span className="text-[9px] uppercase">Nov</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Wheat Harvesting Operation</p>
                        <p className="text-[11px] text-gray-500">Combine Harvester dispatch • Est. 4.2 acres</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-800 bg-white px-2.5 py-1 rounded-full border border-purple-200">
                      Major Harvest
                    </span>
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center">
                        <span>10</span>
                        <span className="text-[9px] uppercase">Dec</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Maize Harvest Cycle</p>
                        <p className="text-[11px] text-gray-500">Plot A • Tasseling completed, drying phase</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                      Harvest Window
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(false)}
                  className="px-5 py-2 text-xs font-bold text-white bg-[var(--secondary-color)] rounded-xl hover:bg-[#143225] cursor-pointer"
                >
                  Close Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerPlots;
