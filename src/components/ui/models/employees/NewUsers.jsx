// NewUser.jsx
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../../bottons/Button";
import Input from "../../inputs/Input";
import { createNewAccount } from "../../../../services/userService";
import { getAllDepartments } from "../../../../services/departmentService";
import { getDepartmentOptions } from "../../../../services/departmentService";

const NewUser = ({ isOpen, onClose, onUserCreated }) => {
  //====Form State====
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    departments: [],
    status: "Active",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");

  //====Fetch departments for dropdown====
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

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  //====Reset form when modal opens====
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
        departments: [],
        status: "Active",
      });
      setError(null);
      setSuccess(false);
      setPasswordMatch(true);
      setPasswordStrength("");
    }
  }, [isOpen]);

  //====Handle Input Change====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Check password match
    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirm =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordMatch(password === confirm || confirm === "");

      // Check password strength
      if (name === "password") {
        checkPasswordStrength(value);
      }
    }
  };

  //====Handle Multi-Select for Departments====
  const handleDepartmentSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, departments: selectedOptions }));
  };

  //====Check Password Strength====
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (password.length < 10) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  //====Validate Form====
  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.departments || formData.departments.length === 0) {
      setError("Please select at least one department");
      return false;
    }
    return true;
  };

  //====Handle Submit====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname.trim());
      formDataToSend.append("email", formData.email.trim().toLowerCase());
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("status", formData.status);

      // Append departments as JSON array
      formDataToSend.append(
        "departments",
        JSON.stringify(formData.departments),
      );

      const response = await createNewAccount(formDataToSend);

      if (response.status === "201") {
        setSuccess(true);
        if (onUserCreated) {
          onUserCreated(response.data);
        }
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);

      let errorMessage = "Failed to create user. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  //====Close modal on overlay click====
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Get selected department names for display
  const getSelectedDepartmentNames = () => {
    return formData.departments
      .map((deptId) => {
        const dept = departments.find((d) => d._id === deptId);
        return dept ? dept.name : null;
      })
      .filter(Boolean);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full md:max-w-4xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white z-10 relative">
          <h2 className="text-md font-semi-bold text-zblue/60">Create New User</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors absolute right-0 top-0"
          >
            <IoMdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex md:flex-row flex-col items-center gap-4">
            <div className="w-full">
              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                required
              />
              {passwordStrength && (
                <p
                  className={`text-xs -mt-2 ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>
            <div className="w-full">
              {/* Role */}
              <Input
                label="Role"
                type="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={["User", "Admin"]}
                required
              />

              {/* Status */}
              <Input
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={["Active", "Inactive"]}
                required
              />
              {/* Confirm Password */}
              <Input
                label="Confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              {!passwordMatch && formData.confirmPassword && (
                <p className="text-xs text-red-600 -mt-2">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          {/* Departments - Multi Select */}
          <div className="mb-4">
            <div className="flex md:flex-row flex-col md:items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 w-[110px]">
                Departments *
              </label>
              <select
                name="departments"
                multiple
                value={formData.departments}
                onChange={handleDepartmentSelect}
                className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen min-h-[80px]"
                required
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
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Hold Ctrl (Cmd on Mac) to select multiple departments
            </p>

            {/* Selected departments tags */}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-600 text-sm">
              User created successfully! Login credentials sent to email.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" color="zblue" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
