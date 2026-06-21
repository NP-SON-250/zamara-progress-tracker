import api from "../api/axios";

// Get all tasks with analytics
export const getAllTasks = async () => {
  try {
    const response = await api.get("/tasks/all-tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw error;
  }
};

// Get tasks by department with analytics
export const getTasksByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/tasks/task-by-department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks by department:", error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/single-task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks/new-task", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/update-task/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/delete-task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Get department ID from department name - now uses localStorage
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
