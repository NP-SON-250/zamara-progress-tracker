import api from "../api/axios";

/* =========================
   DEPARTMENT DOCUMENT APIS
   ========================= */

/* Fetch All Department Documents */
export const fetchDepartmentDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.get("/documents/departments-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access department documents.");
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Single Department Document (with departments inside) */
export const fetchDepartmentDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/documents/departments/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to access this department document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Department document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch department document.",
    );
  }
};

/* Fetch Pending Department Documents */
export const fetchPendingDepartmentDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/pending-department-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to access pending department documents.",
      );
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch pending department documents.",
    );
  }
};

/* Send Department Document For Approval */
export const requestDepartmentApproval = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/documents/request-department-approval/${documentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send department approval",
    );
  }
};

/* Cancel Department Approval Request */
export const cancelApprovalRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.put(
      `/documents/cancel-request/${documentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to cancel this request.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Auto Save Department Document */
export const autoSaveDepartmentDocument = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/autosave-department-document/${documentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to modify this department document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Department document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to autosave department document.",
    );
  }
};

/* Approve Department Document Request */
export const approveDepartmentDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/approve-request/${documentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You are not allowed to approve this request.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Post Department Document */
export const postDepartmentDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/post-department-request/${documentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to post this department document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Department document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Re-Open Department Document Request */
export const reopenDepartmentDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/reopen-request/${documentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to re-open this document.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Revert Department Document */
export const revertDepartmentDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/revert-request/${documentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to revert this document.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to revert document",
    );
  }
};

/* Clear Department Document Data */
export const clearDepartmentDocumentData = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.delete(
      `/documents/clear-document-data/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to clear document data.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Last Department System Number */
export const fetchLastSystemNumber = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/last-system-number", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data.systemNumber;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 404) {
      throw new Error("No document found in the system.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* =========================
   DEPARTMENT CRUD APIS
   ========================= */

/* Fetch All Departments */
export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/departments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access departments.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Fetch Department By ID */
export const fetchDepartmentById = async (departmentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/departments/${departmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access this department.");
    } else if (error.response?.status === 404) {
      throw new Error("Department not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Update Department */
export const updateDepartment = async (departmentId, updateData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(`/departments/${departmentId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to update this department.");
    } else if (error.response?.status === 404) {
      throw new Error("Department not found.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid department data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Delete Department */
export const deleteDepartment = async (departmentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.delete(`/departments/${departmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: res.data.message,
      departmentDeleted: res.data.departmentDeleted,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to delete this department.");
    } else if (error.response?.status === 404) {
      throw new Error("Department not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Search Departments */
export const searchDepartments = async (searchCriteria) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const queryParams = new URLSearchParams(searchCriteria).toString();
    const res = await api.get(`/departments/search?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      departments: res.data.departments || [],
      pagination: res.data.pagination,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to search departments.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Export Departments to Excel */
export const exportDepartmentsToExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/departments/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to export departments.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Download Department Import Template */
export const downloadDepartmentTemplate = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/departments/download-template", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to download the template.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Import Departments from Excel */
export const importDepartments = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.post("/departments/import", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: res.data.message,
      documentId: res.data.documentId,
      documentNumber: res.data.documentNumber,
      importedCount: res.data.importedCount,
      data: res.data.data,
      warnings: res.data.warnings,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to import departments.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid import data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Department Statistics */
export const fetchDepartmentStats = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/departments/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view department statistics.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Recent Departments */
export const fetchRecentDepartments = async (limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/departments/recent?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      departments: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view recent departments.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Departments by Status */
export const fetchDepartmentsByStatus = async (status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/departments/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      departments: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view departments by status.");
    } else if (error.response?.status === 404) {
      throw new Error(`No departments found with status: ${status}`);
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Departments by Document ID */
export const fetchDepartmentsByDocumentId = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/departments/document/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      departments: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to access this document's departments.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Batch Update Department Status */
export const batchUpdateDepartmentStatus = async (departmentIds, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/departments/batch/status",
      { departmentIds, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      message: res.data.message,
      modifiedCount: res.data.modifiedCount,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to update department status.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};