// NewTasks.jsx
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../../bottons/Button";
import Input from "../../inputs/Input";
import { createTask } from "../../../../services/tasksService";
import { getUsersByDepartment } from "../../../../services/userService";
import api from "../../../../api/axios";

const NewTasks = ({ isOpen, onClose, departmentId, onTaskCreated }) => {
  //====Form State====
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Medium",
    taskFor: departmentId || "",
    asignedTo: [],
    startDate: "",
    deadline: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  //====Fetch users for the department====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!departmentId) {
          console.log("No department ID available");
          return;
        }
        const response = await getUsersByDepartment(departmentId);

        if (response.status === "200" && response.data) {
          if (response.data.length === 0) {
            // Try fetching all users as fallback
            const allUsersRes = await api.get("/users/all-users");
            if (allUsersRes.data.status === "200") {
              // Filter users that belong to this department
              const filtered = allUsersRes.data.data.filter((user) => {
                // Check if user has departments array
                if (user.departments && Array.isArray(user.departments)) {
                  return user.departments.some(
                    (dept) =>
                      dept._id === departmentId || dept === departmentId,
                  );
                }
                // Check if user has single department field
                if (user.department) {
                  return (
                    user.department === departmentId ||
                    user.department._id === departmentId
                  );
                }
                return false;
              });
              setUsers(filtered);
            }
          } else {
            setUsers(response.data);
          }
        } else {
          console.log("No users found or API error");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    if (isOpen && departmentId) {
      fetchUsers();
    }
  }, [isOpen, departmentId]);

  //====Reset form when modal opens====
  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        name: "",
        description: "",
        priority: "Medium",
        taskFor: departmentId || "",
        asignedTo: [],
        startDate: today,
        deadline: "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, departmentId]);

  //====Handle Input Change====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //====Handle Select Change for multi-select====
  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, asignedTo: selectedOptions }));
  };

  //====Validate Form====
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Task name is required");
      return false;
    }
    if (!formData.taskFor) {
      setError("Department is required");
      return false;
    }
    if (!formData.asignedTo || formData.asignedTo.length === 0) {
      setError("Please assign at least one user");
      return false;
    }
    if (!formData.startDate) {
      setError("Start date is required");
      return false;
    }
    if (!formData.deadline) {
      setError("Deadline is required");
      return false;
    }

    // Validate start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(formData.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError(
        "Start date cannot be in the past. Please select today or a future date.",
      );
      return false;
    }

    // Validate deadline is not before start date
    const deadline = new Date(formData.deadline);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < startDate) {
      setError(
        "Deadline cannot be before the start date. Please select a date after the start date.",
      );
      return false;
    }

    return true;
  };

  //====Handle Submit====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form first
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
        priority: formData.priority,
        taskFor: formData.taskFor,
        asignedTo: formData.asignedTo,
        startDate: formData.startDate,
        deadline: formData.deadline,
      };

      const response = await createTask(taskData);

      if (response.success) {
        setSuccess(true);
        if (onTaskCreated) {
          onTaskCreated(response.data);
        }
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError(response.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);

      // Extract detailed error message
      let errorMessage = "Failed to create task. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        console.error("Server response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
        console.error("No response:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || errorMessage;
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

  //====If not open, don't render====
  if (!isOpen) return null;

  // Get selected user names for display
  const getSelectedUserNames = () => {
    return formData.asignedTo
      .map((userId) => {
        const user = users.find((u) => u._id === userId);
        return user ? user.fullname || user.email : null;
      })
      .filter(Boolean);
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-zblue">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoMdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <Input
            label="Task Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter task name"
            required
          />

          {/* Description */}
          <div className="mb-4 flex justify-between items-start gap-5 w-full">
            <label className="text-sm font-medium text-gray-700 w-[30%] pt-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen resize-none h-14"
            />
          </div>

          {/* Priority */}
          <Input
            label="Priority"
            type="select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={["Low", "Medium", "High"]}
            required
          />

          {/* Assigned Users - Multi Select */}
          <div className="mb-4 flex justify-between items-start gap-5 w-full">
            <label className="text-sm font-medium text-gray-700 w-[30%] pt-2">
              Assigned To
            </label>
            <div className="w-full">
              <select
                name="asignedTo"
                multiple
                value={formData.asignedTo}
                onChange={handleUserSelect}
                className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen min-h-[80px]"
                required
              >
                {users.length === 0 ? (
                  <option value="" disabled>
                    No users available in this department
                  </option>
                ) : (
                  users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullname || user.email || "Unnamed User"}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple users
              </p>

              {/* Selected users tags */}
              {formData.asignedTo.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {getSelectedUserNames().map((name, index) => (
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
          </div>

          {/* Start Date */}
          <div className="mb-4 flex justify-between items-center gap-5 w-full">
            <label className="text-sm font-medium text-gray-700 w-[30%]">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen"
              required
            />
          </div>

          {/* Deadline */}
          <div className="mb-4 flex justify-between items-center gap-5 w-full">
            <label className="text-sm font-medium text-gray-700 w-[30%]">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={formData.startDate || today}
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-zgreen hover:border-zgreen"
              required
            />
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
              Task created successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" color="zblue" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTasks;
