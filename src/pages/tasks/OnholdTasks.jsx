import React, { useState, useEffect, useMemo } from "react";
import DataTable from "../../components/ui/tables/DataTable";
import FilterPane from "../../components/ui/models/FilterPane";
import { IoMdClose } from "react-icons/io";
import { CiEdit, CiFilter } from "react-icons/ci";
import { GoTasklist } from "react-icons/go";
import { RiExportLine } from "react-icons/ri";
import { getTasksByDepartment } from "../../services/tasksService";
import Button from "../../components/ui/bottons/Button";
import api from "../../api/axios";
import NewTasks from "../../components/ui/models/tasks/NewTasks";
import ExportOptions from "../../components/ui/models/tasks/ExportOptions";

const OnholdTasks = () => {
  //====States management====
  const [tasksData, setTasksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

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

  //====Full Report Preview====
  const [showFullReportPreview, setShowFullReportPreview] = useState(false);
  const [fullReportData, setFullReportData] = useState(null);

  //====Clear notification after 3 seconds====
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  //====Fetch department tasks====
  const fetchDepartmentTasks = async () => {
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
        // Filter tasks to only include On Hold status
        const allTasks = response.data.tasks || [];
        const onHoldTasks = allTasks.filter(
          (task) => task.status === "On Hold",
        );

        // Update tasksData with filtered tasks
        setTasksData({
          ...response.data,
          tasks: onHoldTasks,
          // Update cards with filtered counts
          cards: {
            ...response.data.cards,
            totalTasks: onHoldTasks.length,
            onHoldTasks: onHoldTasks.length,
          },
        });
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching department tasks:", error);
      setError(error.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentTasks();
  }, []);

  //====Destructured variables====
  const cards = tasksData?.cards || {};
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

  //====Handle Task Update====
  const handleTaskUpdate = () => {
    setNotification({
      message: "Task updated!",
      type: "success",
    });
  };

  //====Handle Full Report====
  const handleFullReport = () => {
    if (!tableData || tableData.length === 0) {
      setNotification({
        message: "No data available for full report",
        type: "error",
      });
      return;
    }

    // Prepare the data with all fields
    const reportData = tableData.map((row) => ({
      "TASK NUMBER": row.taskNumber || "-",
      "TASK NAME": row.name || "-",
      DESCRIPTION: row.description || "-",
      STATUS: row.status || "-",
      PRIORITY: row.priority || "-",
      "COMPLETENESS LEVEL": row.completenessLevel || "-",
      PROGRESS: `${row.progress || 0}%`,
      "ASSIGNED TO": Array.isArray(row.asignedTo)
        ? row.asignedTo.map((user) => user.fullname || user).join(", ")
        : row.asignedTo || "-",
      "START DATE": row.startDate
        ? new Date(row.startDate).toLocaleDateString()
        : "-",
      DEADLINE:
        row.deadline || row.endDate
          ? new Date(row.deadline || row.endDate).toLocaleDateString()
          : "-",
      "COMPLETED ON": row.completedOn
        ? new Date(row.completedOn).toLocaleDateString()
        : "-",
      "MANAGER COMMENTS":
        Array.isArray(row.managerComment) && row.managerComment.length > 0
          ? row.managerComment.join(", ")
          : "-",
      "REASONS FOR EXTENDING":
        row.reasonsForExtending && row.reasonsForExtending !== "null"
          ? row.reasonsForExtending
          : "-",
      OVERDUE: row.overdued ? "Yes" : "No",
      "EXTENDED DEADLINE": row.extendedDeadline ? "Yes" : "No",
    }));

    setFullReportData(reportData);
    setShowFullReportPreview(true);
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

  //====Handle Export====
  const handleExport = () => {
    setShowExportOptions(!showExportOptions);
  };

  //====Handle New====
  const handleNew = () => {
    setShowNewTaskModal(true);
  };

  const handleTaskCreated = (newTask) => {
    fetchDepartmentTasks();
    setNotification({
      message: "Task created successfully!",
      type: "success",
    });
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

  //====Full Report Preview Modal====
  const FullReportPreviewModal = () => {
    if (!showFullReportPreview || !fullReportData) return null;

    const headers = Object.keys(fullReportData[0] || {});

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col font-museo">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
            <div>
              <h2 className="text-xl font-bold text-zblue font-museo">
                {departmentName} Department - On Hold Tasks Report
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFullReportPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoMdClose size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Preview Table with both horizontal and vertical scrolling */}
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
              <div
                className="overflow-auto scrollbar-hide"
                style={{ maxHeight: "calc(75vh - 150px)", maxWidth: "100%" }}
              >
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap bg-zblue text-white font-museo border border-gray-300"
                          style={{
                            minWidth: header.length > 20 ? "200px" : "120px",
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-museo">
                    {fullReportData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        {headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className={`px-3 py-2 text-xs text-gray-700 border border-gray-300 font-museo whitespace-nowrap ${
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                            style={{
                              minWidth: header.length > 20 ? "200px" : "120px",
                            }}
                          >
                            {row[header] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-museo">Total Tasks</p>
                <p className="text-lg font-bold text-zblue font-museo">
                  {fullReportData.length}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-museo">Department</p>
                <p className="text-lg font-bold text-zblue font-museo">
                  {departmentName}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-museo">Performance</p>
                <p className="text-lg font-bold text-green-600 font-museo">
                  {performance}%
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-museo">Generated On</p>
                <p className="text-sm font-semibold text-gray-700 font-museo">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <p className="text-md text-zblue font-semibold">
              Previewing as: {fullName}
            </p>
          </div>
        </div>
      </div>
    );
  };

  //====Loading state====
  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zblue"></div>
            <p className="text-gray-500">Loading on hold tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 font-medium">Error loading data</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
            <button
              onClick={fetchDepartmentTasks}
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
      {/* Notification Banner */}
      {notification.message && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-md shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Welcome and Actions */}
      <div className="flex-shrink-0 bg-white z-30 sticky top-0 flex flex-wrap items-center justify-between md:px-5 px-2 py-2 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-bold text-zblue">On Hold Tasks</h2>
          <span className="text-xs text-gray-500">
            ({hasData ? tasksData.tasks.length : 0} tasks)
          </span>
        </div>
        <div className="flex md:gap-2 gap-6">
          <div className="">
            <Button
              type="button"
              color="zblue"
              onClick={() => setShowFilterPane(!showFilterPane)}
            >
              <CiFilter />
              Filter
            </Button>
          </div>

          {/* Export Button with Dropdown */}
          <div className="relative">
            <Button type="button" color="zblue" onClick={handleExport}>
              <RiExportLine />
              Export
            </Button>

            <div className="fixed md:top-30 md:right-8 right-5">
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
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden md:px-5 px-2 pb-4 pt-2">
        <div className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide">
          {/* Table Section */}
          <div className="flex-1 min-h-[200px] border border-gray-200 rounded-md flex flex-col">
            <div className="md:flex-shrink-0 flex md:flex-row flex-col justify-between p-2 border-b gap-4 border-gray-200">
              <p className="text-xs font-bold text-zblue/60">
                On Hold Task List{" "}
                {hasData ? `(${tasksData.tasks.length} tasks)` : ""}
              </p>
              <div className="flex justify-between gap-2">
                <input
                  type="text"
                  placeholder="Search on hold tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border md:text-xs text-md md:w-[60%] w-[65%] border-gray-300 rounded md:px-3 px-1 hover:border-zgreen focus:outline-none focus:border-zgreen h-7"
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
                  <p>No on hold tasks found for {departmentName} department</p>
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
                    onRefresh={fetchDepartmentTasks}
                    entityType="task"
                    onTaskUpdate={handleTaskUpdate}
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

      {/* Full Report Preview Modal */}
      <FullReportPreviewModal />
    </div>
  );
};

export default OnholdTasks;