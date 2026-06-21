import api from "../api/axios";

/* Employee APIs */
export const downloadEmployeeTemplate = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/employees/download-template", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to download this template.");
    }
    throw new Error(
      error.response?.data?.message || "Failed to download template",
    );
  }
};
// Enhanced import function with progress tracking
export const importEmployees = async (formData, onProgress) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.post("/employees/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });

    if (res.data) {
      return {
        success: true,
        message: res.data.message || "Import completed",
        importedCount: res.data.importedCount || 0,
        failedCount: res.data.failedCount || 0,
        documentId: res.data.documentId,
        documentNumber: res.data.documentNumber,
        employees: res.data.employees || [],
        warnings: res.data.warnings || [],
        errors: res.data.errors || [],
      };
    }

    return { success: true, ...res.data };
  } catch (error) {
    if (error.response?.status === 401) {
      throw {
        success: false,
        message: "Session expired. Please login again.",
        details: null,
        warnings: [],
      };
    } else if (error.response?.status === 403) {
      throw {
        success: false,
        message: "You do not have permission to import employees.",
        details: null,
        warnings: [],
      };
    }

    const data = error.response?.data;
    throw {
      success: false,
      message: data?.message || "Import failed",
      details: data?.details || null,
      warnings: data?.warnings || [],
      errors: data?.errors || [],
    };
  }
};
// Save employees batch (for manual edits)
export const saveEmployeesBatch = async (documentId, payload) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/employees/document/${documentId}/batch`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to save employees",
    };
  }
};
export const fetchEmployeesByDocumentId = async (documentId) => {
  try {
    const res = await api.get(`/employees/by-document/${documentId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employees by document",
    );
  }
};
export const fetchEmployeeById = async (employeeId) => {
  try {
    const res = await api.get(`/employees/${employeeId}`);
    return res.data.employee;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employee",
    );
  }
};
export const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.employees;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employees",
    );
  }
};
// Request employee change with updated data
export const requestEmployeeChange = async (employeeId, updatedData = {}) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      `/employees/${employeeId}/request-change`,
      updatedData, // Send the updated data in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      message: res.data.message || "Change request submitted successfully",
      employee: res.data.employee,
      document: res.data.document,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to request employee changes.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Employee not found.");
    }
    throw new Error(
      error.response?.data?.message || "Failed to request employee change",
    );
  }
};
// Delegate change request
export const delegateChangeRequest = async (employeeId, systemNumber) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    if (!systemNumber) {
      throw new Error("Employee system number is required");
    }

    const res = await api.put(
      `/employees/delegate-change-request/${employeeId}`,
      { systemNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      message: res.data.message || "Change request delegated",
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to delegate change requests.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Employee not found.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request");
    }
    throw new Error(
      error.response?.data?.message || "Failed to delegate change request",
    );
  }
};
