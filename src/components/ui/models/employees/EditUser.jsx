import React, { useState, useEffect } from "react";
import { updateUser } from "../../../../services/userService";
import { getAllDepartments } from "../../../../services/departmentService";
import { FiX, FiSave } from "react-icons/fi";
import Button from "../../bottons/Button";

const EditUser = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "",
    status: "",
    departments: [],
    password: "",
    confirmPassword: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getAllDepartments();
        if (response.status === "200" && response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        role: user.role || "User",
        status: user.status || "Active",
        departments: user.departments?.map((d) => d._id || d) || [],
        password: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
      setError(null);
      setSuccess(false);
      setPasswordMatch(true);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirm =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordMatch(password === confirm || confirm === "");
    }
  };

  const handleDepartmentSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, departments: selectedOptions }));
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (showPasswordFields) {
      if (!formData.password) {
        setError("New password is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    if (!formData.departments || formData.departments.length === 0) {
      setError("Please select at least one department");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Prepare update data
      const updateData = {
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status,
        departments: formData.departments,
      };

      // Only include password if user wants to change it
      if (showPasswordFields && formData.password) {
        updateData.password = formData.password;
      }

      const response = await updateUser(user._id, updateData);

      if (response.status === "200") {
        setSuccess(true);

        // Call onUpdate with the updated user data
        if (onUpdate) {
          await onUpdate(response.data);
        }

        // Close modal after a brief delay to show success message
        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 800);
      } else {
        setError(response.message || "Failed to update user");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);

      let errorMessage = "Failed to update user. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (!user) return null;

  const getSelectedDepartmentNames = () => {
    return formData.departments
      .map((deptId) => {
        const dept = departments.find((d) => d._id === deptId);
        return dept ? dept.name : null;
      })
      .filter(Boolean);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-1 border-b border-gray-200">
          <div className="flex items-center gap-3 px-6">
            <h3 className="text-md font-semibold text-zblue/60">
              Edit User: {user.fullname || user.email}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors pr-2"
            disabled={loading}
          >
            <FiX size={20} className="text-zblue/70" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-1 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              User updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter full name"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter email"
                required
                disabled={loading}
              />
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-[6px] border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                  disabled={loading}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-[6px] border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Departments - Multi Select */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Departments *
              </label>
              <select
                name="departments"
                multiple
                value={formData.departments}
                onChange={handleDepartmentSelect}
                className="w-full border border-zblue/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:border focus:border-zgreen hover:border-zgreen min-h-[80px] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
                disabled={loading}
              >
                {departments.length === 0 ? (
                  <option value="" disabled>
                    No departments available
                  </option>
                ) : (
                  departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple departments
              </p>

              {formData.departments.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {getSelectedDepartmentNames().map((name, index) => (
                    <span
                      key={index}
                      className="bg-zblue/10 text-zblue text-xs px-2 py-1 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Change Password Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="changePassword"
                checked={showPasswordFields}
                onChange={(e) => setShowPasswordFields(e.target.checked)}
                className="w-4 h-4 text-zblue border-gray-300 rounded focus:ring-zblue disabled:opacity-50"
                disabled={loading}
              />
              <label
                htmlFor="changePassword"
                className="text-sm font-medium text-zblue/60"
              >
                Change Password
              </label>
            </div>

            {/* Password Fields - Conditional */}
            {showPasswordFields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zblue/60 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Enter new password"
                    required={showPasswordFields}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zblue/60 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Confirm new password"
                    required={showPasswordFields}
                    disabled={loading}
                  />
                  {!passwordMatch && formData.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            type="button"
            color="zblue"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FiSave />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
