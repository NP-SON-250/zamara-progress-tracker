// AllUsers.jsx
import React, { useState, useEffect, useMemo } from "react";
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
import DataTable from "../../components/ui/tables/DataTable";
import FilterPane from "../../components/ui/models/FilterPane";
import { IoIosCloudDone, IoMdClose, IoMdDownload } from "react-icons/io";
import { CiEdit, CiSettings, CiFilter } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { RiExportLine } from "react-icons/ri";
import { GiProgression } from "react-icons/gi";
import { FaHandHoldingHand } from "react-icons/fa6";
import { FcSalesPerformance, FcExpired } from "react-icons/fc";
import Button from "../../components/ui/bottons/Button";
import api from "../../api/axios";
import NewUser from "../../components/ui/models/employees/NewUsers";
import EditUser from "../../components/ui/models/employees/EditUser";
import ExportOptions from "../../components/ui/models/employees/ExportOptions";
import { getUsersByDepartment } from "../../services/userService";

const COLORS = ["#292B4D", "#1E3A8A80", "#D4AF3780", "#14532D80", "#292B4D"];

const AllUsers = () => {
  //====States management====
  const [usersData, setUsersData] = useState(null);
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

  //====User Modals====
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  //====Fetch department users====
  const fetchDepartmentUsers = async () => {
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

      const response = await getUsersByDepartment(deptId);
      if (response.status === "200") {
        setUsersData(response);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching department users:", error);
      setError(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentUsers();
  }, []);

  //====Destructured variables====
  const users = usersData?.data || [];
  const totalUsers = usersData?.count || 0;

  // Calculate statistics for cards
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const adminUsers = users.filter((user) => user.role === "Admin").length;

  // Calculate pie chart data (user roles distribution)
  const pieChartData = useMemo(() => {
    const roleCount = {};
    users.forEach((user) => {
      const role = user.role || "User";
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    return Object.entries(roleCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [users]);

  // Calculate bar chart data (users by status)
  const barChartData = useMemo(() => {
    const statusCount = {};
    users.forEach((user) => {
      const status = user.status || "Inactive";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }, [users]);

  // Calculate performance metric (percentage of active users)
  const performance = useMemo(() => {
    if (totalUsers === 0) return 0;
    return Math.round((activeUsers / totalUsers) * 100);
  }, [totalUsers, activeUsers]);

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

  //====Handle User Update====
  const handleUserUpdate = async (updatedUser) => {
    setUsersData((prev) => ({
      ...prev,
      data: prev.data.map((user) =>
        user._id === updatedUser._id ? updatedUser : user,
      ),
    }));
    setNotification({
      message: "User updated!",
      type: "success",
    });
    await fetchDepartmentUsers();
  };

  //====Handle User Creation====
  const handleUserCreated = (newUser) => {
    setUsersData((prev) => ({
      ...prev,
      data: [...prev.data, newUser],
      count: prev.count + 1,
    }));
    setNotification({
      message: "User created successfully!",
      type: "success",
    });
    fetchDepartmentUsers();
  };

  //====Handle Full Report====
  const handleFullReport = () => {
    if (!users || users.length === 0) {
      setNotification({
        message: "No data available for full report",
        type: "error",
      });
      return;
    }

    // Prepare the data with all fields
    const reportData = users.map((user) => ({
      "FULL NAME": user.fullname || "-",
      EMAIL: user.email || "-",
      ROLE: user.role || "-",
      STATUS: user.status || "-",
      DEPARTMENTS: Array.isArray(user.departments)
        ? user.departments
            .map((dept) => (typeof dept === "object" ? dept.name : dept))
            .join(", ")
        : "-",
      "ASSIGNED TASKS": user.assignedTasks?.length || 0,
      "REGISTERED ON": user.registeredOn
        ? new Date(user.registeredOn).toLocaleDateString()
        : "-",
      "LAST LOGIN": user.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString()
        : "-",
    }));

    setFullReportData(reportData);
    setShowFullReportPreview(true);
  };

  //====Table Columns====
  const columns = useMemo(
    () => [
      {
        accessor: "fullname",
        header: "FULL NAME",
        type: "text",
        render: (value, row) => (
          <div className="flex items-center gap-2">
            <span>{value || "-"}</span>
          </div>
        ),
      },
      {
        accessor: "email",
        header: "EMAIL",
        type: "text",
        render: (value) => value || "-",
      },
      {
        accessor: "role",
        header: "ROLE",
        type: "select",
        options: ["Admin", "User"],
        render: (value) => {
          const roleColors = {
            Admin: "text-purple-700",
            User: "text-blue-700",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium ${roleColors[value] || "bg-gray-100 text-gray-700"}`}
            >
              {value || "User"}
            </span>
          );
        },
      },
      {
        accessor: "status",
        header: "STATUS",
        type: "select",
        options: ["Active", "Inactive"],
        render: (value) => {
          const statusColors = {
            Active: "text-zgreen",
            Inactive: "text-gray-700",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || "bg-gray-100 text-gray-700"}`}
            >
              {value || "Inactive"}
            </span>
          );
        },
      },
      {
        accessor: "departments",
        header: "DEPARTMENTS",
        type: "text",
        render: (value) => {
          if (Array.isArray(value)) {
            return value
              .map((dept) => (typeof dept === "object" ? dept.name : dept))
              .join(", ");
          }
          return "-";
        },
      },
      {
        accessor: "assignedTasks",
        header: "ASSIGNED TASKS",
        type: "text",
        render: (value) => value?.length || 0,
      },
      {
        accessor: "registeredOn",
        header: "REGISTERED ON",
        type: "date",
        render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
      },
      {
        accessor: "lastLogin",
        header: "LAST LOGIN",
        type: "date",
        render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
      },
    ],
    [],
  );

  //====Prepare table data====
  const tableData = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      ...user,
      documentNumber: user._id || user.email,
      assignedTasks: user.assignedTasks || [],
    }));
  }, [users]);

  //====Handle Export====
  const handleExport = () => {
    setShowExportOptions(!showExportOptions);
  };

  //====Handle New====
  const handleNew = () => {
    setShowNewUserModal(true);
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
  const hasData = users && users.length > 0;

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
                {departmentName} Department - Users Report
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
            <p className="text-gray-500">Loading users...</p>
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
              onClick={fetchDepartmentUsers}
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
      <div className="flex-shrink-0 bg-white z-30 sticky top-0 flex flex-wrap items-center justify-between px-5 py-2 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-zblue">All Users</h2>
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
      <div className="flex-1 overflow-hidden px-5 pb-4 pt-2">
        <div className="h-full flex flex-col gap-3 overflow-y-auto scrollbar-hide">
          {/* Table Section */}
          <div className="flex-1 min-h-[200px] border border-gray-200 rounded-md flex flex-col">
            <div className="md:flex-shrink-0 flex md:flex-row flex-col justify-between p-2 border-b gap-4 border-gray-200">
              <p className="text-xs font-bold text-zblue/60">
                User List {hasData ? `(${users.length} users)` : ""}
              </p>
              <div className="flex justify-between gap-2">
                <input
                  type="text"
                  placeholder="Search users..."
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
                  Add User
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              {!hasData ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No users found for {departmentName} department</p>
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
                    onRefresh={fetchDepartmentUsers}
                    entityType="user"
                    onUserUpdate={(user) => {
                      setSelectedUser(user);
                      setShowEditUserModal(true);
                    }}
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

      {/* New User Modal */}
      <NewUser
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Edit User Modal */}
      <EditUser
        user={selectedUser}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUserUpdate}
      />

      {/* Full Report Preview Modal */}
      <FullReportPreviewModal />
    </div>
  );
};

export default AllUsers;