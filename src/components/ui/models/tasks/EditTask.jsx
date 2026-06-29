import React, { useState, useEffect } from "react";
import { updateTask } from "../../../../services/tasksService";
import { FiX, FiSave } from "react-icons/fi";
import Button from "../../bottons/Button";

const EditTask = ({ task, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    status: "",
    completenessLevel: "",
    startDate: "",
    deadline: "",
    reasonsForExtending: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalDeadline, setOriginalDeadline] = useState(null);
  const [showReasonsField, setShowReasonsField] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      const taskDeadline = task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "";

      setFormData({
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "",
        status: task.status || "",
        completenessLevel: task.completenessLevel || "",
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split("T")[0]
          : "",
        deadline: taskDeadline,
        reasonsForExtending: "",
      });

      setOriginalDeadline(taskDeadline);
      setShowReasonsField(false);

      // Check if task is completed
      setIsCompleted(task.status === "Completed");
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if deadline has changed
    if (name === "deadline") {
      const newDeadline = value;
      const hasChanged = newDeadline !== originalDeadline;
      setShowReasonsField(hasChanged);

      // Clear reasons if deadline reverts to original
      if (!hasChanged) {
        setFormData((prev) => ({
          ...prev,
          reasonsForExtending: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCompleted) {
      setError("Cannot edit a completed task");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        completenessLevel: formData.completenessLevel,
        startDate: formData.startDate,
        deadline: formData.deadline,
      };

      // Only include reasonsForExtending if deadline has changed and it's not empty
      if (showReasonsField) {
        if (
          !formData.reasonsForExtending ||
          formData.reasonsForExtending.trim() === ""
        ) {
          setError("Reasons for extending the deadline are required");
          setLoading(false);
          return;
        }
        updateData.reasonsForExtending = formData.reasonsForExtending.trim();
      }

      const response = await updateTask(task._id, updateData);
      console.log("Updated task response:", response.data);
      if (response.success) {
        onUpdate(response.data);
        onClose();
      } else {
        setError(response.message || "Failed to update task");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the task",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-1 border-b border-gray-200">
          <div className="flex items-center gap-3 px-6">
            <h3 className="text-md font-semibold text-zblue/60">
              Edit Task: {task.taskNumber || "Task"}
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

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Task Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter task name"
                required
                disabled={loading || isCompleted}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter task description"
                disabled={loading || isCompleted}
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-[6px] border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                  disabled={loading || isCompleted}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
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
                  disabled={loading || isCompleted}
                >
                  <option value="">Select Status</option>
                  <option value="Running">Running</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Completeness Level */}
            <div>
              <label className="block text-sm font-medium text-zblue/60 mb-1">
                Completeness Level
              </label>
              <select
                name="completenessLevel"
                value={formData.completenessLevel}
                onChange={handleChange}
                className="w-full px-3 py-[6px] border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || isCompleted}
              >
                <option value="">Select Level</option>
                <option value="L1">L1 - 0%</option>
                <option value="L2">L2 - 20%</option>
                <option value="L3">L3 - 40%</option>
                <option value="L4">L4 - 60%</option>
                <option value="L5">L5 - 80%</option>
                <option value="L6">L6 - 100% (Complete)</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                  disabled={loading || isCompleted}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-1 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                  disabled={loading || isCompleted}
                />
              </div>
            </div>

            {/* Reasons for Extending - Conditionally shown */}
            {showReasonsField && !isCompleted && (
              <div className="">
                <label className="block text-sm font-medium text-zblue/60 mb-1">
                  Reasons for Extending Deadline *
                </label>
                <textarea
                  name="reasonsForExtending"
                  value={formData.reasonsForExtending}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-zblue/20 rounded-md focus:outline-none focus:border focus:border-zgreen hover:border-zgreen disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="Please explain why the deadline needs to be extended..."
                  required={showReasonsField}
                  disabled={loading || isCompleted}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide detailed reasons for the deadline extension
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            type="button"
            color={isCompleted ? "gray" : "zblue"}
            onClick={handleSubmit}
            disabled={loading || isCompleted}
            className={isCompleted ? "opacity-50 cursor-not-allowed" : ""}
          >
            <FiSave />
            {loading ? "Saving..." : isCompleted ? "Locked" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
