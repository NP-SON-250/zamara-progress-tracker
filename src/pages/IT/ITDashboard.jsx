import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import DepartmentMenu from "../../components/ui/models/menu/DepartmentMenu";
import Welcome from "../../components/ui/models/Welcome";
import InforCard from "../../components/ui/models/cards/InforCard";
import DataTable from "../../components/ui/tables/DataTable";
import FilterPane from "../../components/ui/models/FilterPane";
import { IoIosCloudDone } from "react-icons/io";
import { CiEdit, CiSettings, CiFilter } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { RiExportLine } from "react-icons/ri";
import { GiProgression } from "react-icons/gi";
import { FaHandHoldingHand } from "react-icons/fa6";
import { getTasksByDepartment } from "../../services/tasksService";
import { FcSalesPerformance, FcExpired } from "react-icons/fc";
import Button from "../../components/ui/bottons/Button";
import api from "../../api/axios";
import NewTasks from "../../components/ui/models/tasks/NewTasks";
import ExportOptions from "../../components/ui/models/tasks/ExportOptions";

const COLORS = ["#292B4D", "#1E3A8A80", "#D4AF3780", "#14532D80", "#292B4D"];

const ITDashboard = () => {
  //====States management====
  const [tasksData, setTasksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentName, setDepartmentName] = useState("Pension");
  const [departmentId, setDepartmentId] = useState(null);

  // Table states
  const [activeColumn, setActiveColumn] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPane, setShowFilterPane] = useState(false);
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  //====Create Task====
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  //====Export Options====
  const [showExportOptions, setShowExportOptions] = useState(false);

  //====Get user data from localStorage====
  const getUserFromStorage = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      return storedUser;
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
      return null;
    }
  };

  const storedUser = getUserFromStorage();
  const currentUser = storedUser || null;
  const fullName = currentUser?.fullname || "User";

  //====Get department from URL====
  const getDepartmentFromURL = () => {
    try {
      const pathParts = window.location.pathname
        .split("/")
        .filter((part) => part);
      if (pathParts.length > 0) {
        const slug = pathParts[0];
        const slugMap = {
          pension: "Pension",
          finance: "Finance",
          development: "Business Development",
          actuarial: "Actuarial",
          technical: "Technical",
          it: "IT",
          claims: "Claims",
          hr: "Human Resource",
          procurement: "Procurement",
          social: "Social",
          administration: "Administration",
        };
        return slugMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
      }
      return "Pension";
    } catch (error) {
      console.error("Error getting department from URL:", error);
      return "Pension";
    }
  };

  //====Get department ID from API or localStorage====
  const getDepartmentId = async (deptName) => {
    try {
      const storedDepartments = JSON.parse(
        localStorage.getItem("departments") || "[]",
      );

      let dept = storedDepartments.find(
        (d) => d.name?.toLowerCase() === deptName.toLowerCase(),
      );

      if (dept && dept._id) {
        return dept._id;
      }

      const response = await api.get("/departments/all-departments");
      if (response.data.success) {
        const departments = response.data.data || [];
        localStorage.setItem("departments", JSON.stringify(departments));

        dept = departments.find(
          (d) => d.name?.toLowerCase() === deptName.toLowerCase(),
        );

        if (dept && dept._id) {
          return dept._id;
        }
      }

      console.error("Department not found for:", deptName);
      return null;
    } catch (error) {
      console.error("Error fetching department:", error);
      return null;
    }
  };

  //====Fetch tasks data====
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const deptName = getDepartmentFromURL();
      setDepartmentName(deptName);

      const deptId = await getDepartmentId(deptName);

      if (!deptId) {
        console.error("Department ID not found for:", deptName);
        setError(
          "Department not found. Please make sure the department exists.",
        );
        setLoading(false);
        return;
      }

      setDepartmentId(deptId);

      const response = await getTasksByDepartment(deptId);
      if (response.success) {
        setTasksData(response.data);
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //====Destructured variables====
  const cards = tasksData?.cards || {};
  const pieChartData = tasksData?.pieChart || [];
  const barChartData = tasksData?.barChart || [];
  const performance = tasksData?.performance || 0;

  //====Handle Sort====
  const handleSort = (accessor, direction) => {
    setSortConfig({ accessor, direction });
  };

  //====Handle Filter====
  const handleFilterClick = (column) => {
    const existing = dynamicFilters.find(
      (f) => f.field.accessor === column.accessor,
    );
    if (!existing) {
      setDynamicFilters([
        ...dynamicFilters,
        {
          field: {
            accessor: column.accessor,
            label: column.header,
            type: column.type || "text",
            options: column.options || [],
          },
          value: "",
        },
      ]);
      setFilteredColumns([...filteredColumns, column.accessor]);
    }
    setShowFilterPane(true);
  };

  const handleClearFilter = (column) => {
    setDynamicFilters(
      dynamicFilters.filter((f) => f.field.accessor !== column.accessor),
    );
    setFilteredColumns(
      filteredColumns.filter((col) => col !== column.accessor),
    );
    if (dynamicFilters.length <= 1) {
      setShowFilterPane(false);
    }
  };

  const removeFilter = (index) => {
    const filter = dynamicFilters[index];
    setFilteredColumns(
      filteredColumns.filter((col) => col !== filter.field.accessor),
    );
    const updated = [...dynamicFilters];
    updated.splice(index, 1);
    setDynamicFilters(updated);
    if (updated.length === 0) {
      setShowFilterPane(false);
    }
  };

  const handleFieldSelect = (field) => {
    const existing = dynamicFilters.find(
      (f) => f.field.accessor === field.accessor,
    );
    if (!existing) {
      setDynamicFilters([
        ...dynamicFilters,
        { field: { ...field }, value: "" },
      ]);
      setFilteredColumns([...filteredColumns, field.accessor]);
    }
    setShowFieldDropdown(false);
    setShowFilterPane(true);
  };

  //====Table Columns====
  const columns = useMemo(
    () => [
      {
        accessor: "taskNumber",
        header: "TASK NUMBER",
        type: "text",
      },
      {
        accessor: "name",
        header: "TASK NAME",
        type: "text",
      },
      {
        accessor: "status",
        header: "STATUS",
        type: "select",
        options: ["Running", "On Hold", "Completed", "Overdue", "Closed"],
        render: (value) => {
          const statusColors = {
            Running: "text-green-600",
            "On Hold": "text-yellow-600",
            Completed: "text-blue-600",
            Overdue: "text-red-600",
            Closed: "text-gray-600",
          };
          return (
            <span className={statusColors[value] || ""}>{value || "-"}</span>
          );
        },
      },
      {
        accessor: "priority",
        header: "PRIORITY",
        type: "select",
        options: ["Low", "Medium", "High"],
        render: (value) => {
          const priorityColors = {
            Low: "text-green-600",
            Medium: "text-yellow-600",
            High: "text-red-600",
          };
          return (
            <span className={priorityColors[value] || ""}>{value || "-"}</span>
          );
        },
      },
      {
        accessor: "asignedTo",
        header: "ASSIGNED TO",
        type: "text",
        render: (value) => {
          if (Array.isArray(value)) {
            return value.map((user) => user.fullname || user).join(", ");
          }
          return value || "-";
        },
      },
      {
        accessor: "startDate",
        header: "START DATE",
        type: "date",
        render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
      },
      {
        accessor: "deadline",
        header: "DEADLINE",
        type: "date",
        render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
      },
      {
        accessor: "progress",
        header: "PROGRESS",
        type: "text",
        render: (value) => {
          const progress = parseInt(value) || 0;
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zblue rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          );
        },
      },
    ],
    [],
  );

  //====Prepare table data====
  const tableData = useMemo(() => {
    if (!tasksData?.tasks) return [];
    return tasksData.tasks.map((task) => ({
      ...task,
      documentNumber: task._id || task.taskNumber,
      asignedTo: task.asignedTo || [],
      startDate: task.startDate,
      deadline: task.endDate || task.deadline,
      progress: task.progress || "0",
    }));
  }, [tasksData]);

  // Filter pie chart to only include values > 0
  const filteredPieChartData = useMemo(() => {
    return (pieChartData || []).filter((item) => Number(item.value) > 0);
  }, [pieChartData]);

  //====Handle Export====
  const handleExport = () => {
    setShowExportOptions(!showExportOptions);
  };

  //====Handle New====
  const handleNew = () => {
    setShowNewTaskModal(true);
  };

  const handleTaskCreated = (newTask) => {
    fetchTasks();
  };

  //====Available fields for filtering====
  const availableFields = useMemo(() => {
    return columns
      .filter((col) => col.accessor !== "documentNumber")
      .map((col) => ({
        accessor: col.accessor,
        label: col.header,
        type: col.type || "text",
        options: col.options || [],
      }));
  }, [columns]);

  const visibleFields = availableFields.filter(
    (field) => !filteredColumns.includes(field.accessor),
  );

  const hasActiveFilters = dynamicFilters.some(
    (f) => f.value && f.value.trim() !== "",
  );

  //====Check if we have data====
  const hasData = tasksData && tasksData.tasks && tasksData.tasks.length > 0;

  //====Loading state====
  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <DepartmentMenu />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zblue"></div>
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <DepartmentMenu />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 font-medium">Error loading data</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Department Menu - Fixed at top with z-index */}
      <div className="flex-shrink-0 sticky top-0 z-40">
        <DepartmentMenu />
      </div>

      {/* Welcome and Actions - Fixed under menu */}
      <div className="flex-shrink-0 bg-white z-30 sticky top-[45px] flex flex-wrap items-center justify-between px-5 py-2 border-b border-gray-200">
        <Welcome user={fullName} />
        <div className="flex md:gap-2 gap-6 relative">
          <Button
            type="button"
            color="zblue"
            onClick={() => setShowFilterPane(!showFilterPane)}
          >
            <CiFilter />
            Filter
          </Button>
          <Button type="button" color="zblue">
            <CiSettings />
            Customise
          </Button>

          {/* Export Button with Dropdown */}
          <div className="relative">
            <Button type="button" color="zblue" onClick={handleExport}>
              <RiExportLine />
              Export
            </Button>

            <ExportOptions
              isOpen={showExportOptions}
              onClose={() => setShowExportOptions(false)}
              data={tableData}
              columns={columns}
              departmentName={departmentName}
              fullname={fullName}
              performance={performance}
              onExport={(type, data) => {
                console.log(`Exported as ${type}:`, data);
              }}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden px-5 pb-4 pt-2">
        <div className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide">
          {/* Cards Row */}
          <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <InforCard
              title="Total Tasks"
              value={cards.totalTasks || 0}
              icon={<GoTasklist />}
              color="blue"
            />
            <InforCard
              title="Running"
              value={cards.runningTasks || 0}
              icon={<GiProgression />}
              color="blue"
            />
            <InforCard
              title="On Hold"
              value={cards.onHoldTasks || 0}
              icon={<FaHandHoldingHand />}
              color="blue"
            />
            <InforCard
              title="Completed"
              value={cards.completedTasks || 0}
              icon={<IoIosCloudDone />}
              color="blue"
            />
            <InforCard
              title="Overdue"
              value={cards.overdueTasks || 0}
              icon={<FcExpired />}
              color="blue"
            />
            <InforCard
              title="Performance"
              value={`${performance}%`}
              icon={<FcSalesPerformance />}
              color="blue"
            />
          </div>

          {/* Charts Row */}
          <div className="flex-shrink-0 flex flex-col lg:flex-row gap-4">
            {/* Pie Chart */}
            <div className="border border-gray-200 rounded-md w-full lg:w-[400px] min-w-0">
              <div className="flex justify-between items-center p-1 border-b border-gray-200">
                <p className="text-xs font-bold text-zblue/60">
                  Task Breakdown
                </p>
                <Button type="button" color="zblue" size="sm">
                  <CiEdit />
                  Full Report
                </Button>
              </div>
              <div className="flex flex-col md:flex-row items-center px-2 h-[220px] pb-4">
                <div className="w-[200px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredPieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={1}
                        outerRadius={65}
                        paddingAngle={1}
                        dataKey="value"
                        labelLine={false}
                      >
                        {filteredPieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1">
                  {filteredPieChartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="border border-gray-200 rounded-md flex-1 min-w-0">
              <div className="p-2 border-b border-gray-200">
                <p className="text-xs font-bold text-zblue/60">
                  Weekly Performance
                </p>
              </div>
              <div className="p-0 h-[180px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar
                      dataKey="performance"
                      fill="#14532D80"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="flex-1 min-h-[200px] border border-gray-200 rounded-md flex flex-col">
            <div className="md:flex-shrink-0 flex md:flex-row flex-col justify-between items-center p-2 border-b gap-4 border-gray-200">
              <p className="text-xs font-bold text-zblue/60">
                Task List {hasData ? `(${tasksData.tasks.length} tasks)` : ""}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded md:px-3 px-1 hover:border-zgreen text-xs focus:outline-none focus:border-zgreen h-7"
                />
                <Button
                  type="button"
                  color="zblue"
                  size="sm"
                  onClick={handleNew}
                >
                  <GoTasklist />
                  Add Task
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              {!hasData ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No tasks found for {departmentName} department</p>
                </div>
              ) : (
                <div className="h-full overflow-auto scrollbar-hide">
                  <DataTable
                    columns={columns}
                    data={tableData}
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onFilterClick={handleFilterClick}
                    onClearFilter={handleClearFilter}
                    filteredColumns={filteredColumns}
                    dynamicFilters={dynamicFilters}
                    searchTerm={searchTerm}
                    enableSelection={true}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pane - Overlay */}
      {showFilterPane && (
        <div className="fixed top-20 right-0 h-full w-72 bg-white shadow-lg z-50 border-l border-gray-200 overflow-y-auto">
          <FilterPane
            filters={[]}
            dynamicFilters={dynamicFilters}
            setDynamicFilters={setDynamicFilters}
            visibleFields={visibleFields}
            availableFields={availableFields}
            showFieldDropdown={showFieldDropdown}
            setShowFieldDropdown={setShowFieldDropdown}
            removeFilter={removeFilter}
            handleFieldSelect={handleFieldSelect}
            hasActiveFilters={hasActiveFilters}
            onClose={() => setShowFilterPane(false)}
          />
        </div>
      )}

      {/* New Task Modal */}
      <NewTasks
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        departmentId={departmentId}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default ITDashboard;
