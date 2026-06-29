import api from "../api/axios";

// 1. Create new account (Public)
export const createNewAccount = async (userData) => {
  try {
    const response = await api.post("/users/new-account", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create account");
  }
};
// 2. Get all users (Protected)
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users/all-users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
// 3. Get single user by ID (Protected)
export const getSingleUser = async (userId) => {
  try {
    const response = await api.get(`/users/single-user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};
// 4. Get users by department (Protected)
export const getUsersByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/users/users-by-department/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch users by department"
    );
  }
};
// 5. Update user (Protected)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/update-user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};
// 6. Delete user (Protected)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/delete-user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};