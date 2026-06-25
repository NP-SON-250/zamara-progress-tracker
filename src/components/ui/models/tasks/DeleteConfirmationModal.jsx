import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";

const DeleteConfirmationModal = ({
  task,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="text-red-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this task?
          </p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
            <p className="text-sm font-medium text-gray-700">
              {task.name || task.taskName || "Unnamed Task"}
            </p>
            {task.taskNumber && (
              <p className="text-xs text-gray-500 mt-1">
                Task Number: {task.taskNumber}
              </p>
            )}
            {task.status && (
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "Running"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "Overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            )}
          </div>
          <p className="text-sm text-red-600">
            ⚠️ This action cannot be undone. All associated data will be
            permanently removed.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={16} />
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
