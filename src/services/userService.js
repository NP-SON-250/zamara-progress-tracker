import api from "../api/axios";

export const fetchUsers = async () => {
  try {
    const res = await api.get("/users/all-users");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
// Get users by department
export const getUsersByDepartment = async (departmentId) => {
  try {
    const response = await api.get(
      `/users/users-by-department/${departmentId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users by department:", error);
    throw error;
  }
};
