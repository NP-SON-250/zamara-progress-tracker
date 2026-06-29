import api from "../api/axios";

// ============================================
// DEPARTMENT ENDPOINTS
// ============================================
// Get all departments
export const getAllDepartments = async () => {
  try {
    const response = await api.get("/departments/departments");
    return response.data;
  } catch (error) {
    console.error("Error fetching all departments:", error);
    throw error;
  }
};
// Get department by ID
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await api.get(`/departments/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching department:", error);
    throw error;
  }
};
// Search departments by name
export const searchDepartments = async (searchQuery) => {
  try {
    const response = await api.get(`/departments/departments/search?query=${encodeURIComponent(searchQuery)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching departments:", error);
    throw error;
  }
};
// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post("/departments/new-department", departmentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};
// Update a department
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const response = await api.put(`/departments/departments/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};
// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/departments/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};
// Get department statistics
export const getDepartmentStats = async () => {
  try {
    const response = await api.get("/departments/departments/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    throw error;
  }
};

// ============================================
// DEPARTMENT UTILITY FUNCTIONS
// ============================================
// Get department name from ID
export const getDepartmentNameFromId = (departmentId) => {
  try {
    // Get departments from localStorage
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );

    // Find the department by ID
    const department = storedDepartments.find(
      (dept) => dept._id === departmentId,
    );

    if (department && department.name) {
      return department.name;
    }

    console.error("Department name not found for ID:", departmentId);
    return null;
  } catch (error) {
    console.error("Error getting department name:", error);
    return null;
  }
};
// Get department ID from name
export const getDepartmentIdFromName = (departmentName) => {
  try {
    // Get departments from localStorage
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );

    // Find the department by name (case insensitive)
    const department = storedDepartments.find(
      (dept) => dept.name?.toLowerCase() === departmentName?.toLowerCase(),
    );

    if (department && department._id) {
      return department._id;
    }

    // Fallback: Try to get from user's departments
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.departments) {
      const userDept = storedUser.departments.find(
        (dept) => dept.name?.toLowerCase() === departmentName?.toLowerCase(),
      );
      if (userDept && userDept._id) {
        return userDept._id;
      }
    }

    console.error("Department ID not found for:", departmentName);
    return null;
  } catch (error) {
    console.error("Error getting department ID:", error);
    return null;
  }
};
// Get all department names (for dropdowns, etc.)
export const getAllDepartmentNames = () => {
  try {
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );
    return storedDepartments.map((dept) => dept.name);
  } catch (error) {
    console.error("Error getting department names:", error);
    return [];
  }
};
// Get departments as options for dropdown/select
export const getDepartmentOptions = () => {
  try {
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );
    return storedDepartments.map((dept) => ({
      value: dept._id,
      label: dept.name,
    }));
  } catch (error) {
    console.error("Error getting department options:", error);
    return [];
  }
};
// Get department by name (returns full department object)
export const getDepartmentByName = (departmentName) => {
  try {
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );

    const department = storedDepartments.find(
      (dept) => dept.name?.toLowerCase() === departmentName?.toLowerCase(),
    );

    if (department) {
      return department;
    }

    console.error("Department not found for:", departmentName);
    return null;
  } catch (error) {
    console.error("Error getting department:", error);
    return null;
  }
};
// Get current department ID from URL
export const getCurrentDepartmentId = () => {
  try {
    const pathParts = window.location.pathname
      .split("/")
      .filter((part) => part);
    if (pathParts.length > 0) {
      const departmentSlug = pathParts[0];

      // Map URL slug to department name
      const slugMap = {
        pension: "pension",
        finance: "finance",
        development: "business development",
        actuarial: "actuarial",
        technical: "technical",
        it: "it",
        claims: "claims",
        hr: "human resource",
        procurement: "procurement",
        social: "social",
        administration: "administration",
      };

      const departmentName = slugMap[departmentSlug] || departmentSlug;
      return getDepartmentIdFromName(departmentName);
    }
    return null;
  } catch (error) {
    console.error("Error getting current department ID:", error);
    return null;
  }
};
// Get current department name from URL
export const getCurrentDepartmentName = () => {
  try {
    const pathParts = window.location.pathname
      .split("/")
      .filter((part) => part);
    if (pathParts.length > 0) {
      const departmentSlug = pathParts[0];

      const slugMap = {
        pension: "pension",
        finance: "finance",
        development: "business development",
        actuarial: "actuarial",
        technical: "technical",
        it: "it",
        claims: "claims",
        hr: "human resource",
        procurement: "procurement",
        social: "social",
        administration: "administration",
      };

      return slugMap[departmentSlug] || departmentSlug;
    }
    return null;
  } catch (error) {
    console.error("Error getting current department name:", error);
    return null;
  }
};
// Check if department exists in localStorage
export const departmentExists = (departmentName) => {
  try {
    const storedDepartments = JSON.parse(
      localStorage.getItem("departments") || "[]",
    );
    return storedDepartments.some(
      (dept) => dept.name?.toLowerCase() === departmentName?.toLowerCase(),
    );
  } catch (error) {
    console.error("Error checking department existence:", error);
    return false;
  }
};
// Store departments in localStorage (useful after fetching)
export const storeDepartments = (departments) => {
  try {
    localStorage.setItem("departments", JSON.stringify(departments));
  } catch (error) {
    console.error("Error storing departments:", error);
  }
};
// Clear departments from localStorage
export const clearDepartments = () => {
  try {
    localStorage.removeItem("departments");
  } catch (error) {
    console.error("Error clearing departments:", error);
  }
};

// ============================================
// DEPARTMENT STATISTICS HELPERS
// ============================================
// Get department statistics with formatted data
export const getFormattedDepartmentStats = async () => {
  try {
    const response = await getDepartmentStats();
    
    if (response.status === "200" && response.data) {
      const stats = response.data.stats || {};
      const recentDepts = response.data.recentDepartments || [];
      
      return {
        totalDepartments: stats.totalDepartments || 0,
        totalUsers: stats.totalUsers || 0,
        averageUsersPerDept: stats.averageUsersPerDept || 0,
        maxUsers: stats.maxUsers || 0,
        minUsers: stats.minUsers || 0,
        recentDepartments: recentDepts.map((dept) => ({
          id: dept._id,
          name: dept.name,
          userCount: dept.numberOfUsers || 0,
          createdBy: dept.addedBy?.fullname || "Unknown",
          createdOn: new Date(dept.createdOn).toLocaleDateString(),
        })),
      };
    }
    
    return {
      totalDepartments: 0,
      totalUsers: 0,
      averageUsersPerDept: 0,
      maxUsers: 0,
      minUsers: 0,
      recentDepartments: [],
    };
  } catch (error) {
    console.error("Error getting formatted department stats:", error);
    throw error;
  }
};

// ============================================
// DEPARTMENT CRUD OPERATIONS WITH CACHE
// ============================================
// Fetch all departments and store in localStorage
export const fetchAndStoreDepartments = async () => {
  try {
    const response = await getAllDepartments();
    if (response.status === "200" && response.data) {
      storeDepartments(response.data);
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching and storing departments:", error);
    throw error;
  }
};
// Create department and update cache
export const createDepartmentAndUpdateCache = async (departmentData) => {
  try {
    const response = await createDepartment(departmentData);
    if (response.status === "201") {
      // Refresh cache
      await fetchAndStoreDepartments();
    }
    return response;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};
// Update department and update cache
export const updateDepartmentAndUpdateCache = async (departmentId, departmentData) => {
  try {
    const response = await updateDepartment(departmentId, departmentData);
    if (response.status === "200") {
      // Refresh cache
      await fetchAndStoreDepartments();
    }
    return response;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};
// Delete department and update cache
export const deleteDepartmentAndUpdateCache = async (departmentId) => {
  try {
    const response = await deleteDepartment(departmentId);
    if (response.status === "200") {
      // Refresh cache
      await fetchAndStoreDepartments();
    }
    return response;
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};