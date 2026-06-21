import api from "../api/axios";

/* =========================
   PERMISSION DOCUMENT APIS
   ========================= */

/* Fetch All Permission Documents */
export const fetchPermissionDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.get("/documents/permissions-documents", {
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
        "You do not have permission to access permission documents.",
      );
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Single Permission Document (with permissions inside) */
export const fetchPermissionDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/documents/permissions/${documentId}`, {
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
        "You do not have permission to access this permission document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Permission document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch permission document.",
    );
  }
};

/* Fetch Pending Permission Documents */
export const fetchPendingPermissionDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/pending-permission-documents", {
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
        "You do not have permission to access pending permission documents.",
      );
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch pending permission documents.",
    );
  }
};

/* Send Permission Document For Approval */
export const requestPermissionApproval = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/documents/request-permission-approval/${documentId}`,
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
      error.response?.data?.message || "Failed to send permission approval",
    );
  }
};

/* Cancel Permission Approval Request */
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

/* Auto Save Permission Document */
export const autoSavePermissionDocument = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/autosave-permission-document/${documentId}`,
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
        "You do not have permission to modify this permission document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Permission document not found.");
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to autosave permission document.",
    );
  }
};

/* Approve Permission Document Request */
export const approvePermissionDocumentRequest = async (documentId) => {
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

/* Post Permission Document */
export const postPermissionDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/post-permission-request/${documentId}`,
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
        "You do not have permission to post this permission document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Permission document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Re-Open Permission Document Request */
export const reopenPermissionDocumentRequest = async (documentId) => {
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

/* Revert Permission Document */
export const revertPermissionDocumentRequest = async (documentId) => {
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

/* Clear Permission Document Data */
export const clearPermissionDocumentData = async (documentId) => {
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

/* Fetch Last Permission System Number */
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
   PERMISSION CRUD APIS
   ========================= */

/* Fetch All Permissions */
export const fetchPermissions = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/permissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access permissions.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Fetch Permission By ID */
export const fetchPermissionById = async (permissionId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/permissions/${permissionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access this permission.");
    } else if (error.response?.status === 404) {
      throw new Error("Permission not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Update Permission */
export const updatePermission = async (permissionId, updateData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(`/permissions/${permissionId}`, updateData, {
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
      throw new Error("You do not have permission to update this permission.");
    } else if (error.response?.status === 404) {
      throw new Error("Permission not found.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Invalid permission data.",
      );
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Delete Permission */
export const deletePermission = async (permissionId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.delete(`/permissions/${permissionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: res.data.message,
      permissionDeleted: res.data.permissionDeleted,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to delete this permission.");
    } else if (error.response?.status === 404) {
      throw new Error("Permission not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Search Permissions */
export const searchPermissions = async (searchCriteria) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const queryParams = new URLSearchParams(searchCriteria).toString();
    const res = await api.get(`/permissions/search?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      permissions: res.data.permissions || [],
      pagination: res.data.pagination,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to search permissions.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Export Permissions to Excel */
export const exportPermissionsToExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/permissions/export", {
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
      throw new Error("You do not have permission to export permissions.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Download Permission Import Template */
export const downloadPermissionTemplate = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/permissions/download-template", {
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

/* Import Permissions from Excel */
export const importPermissions = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.post("/permissions/import", formData, {
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
      throw new Error("You do not have permission to import permissions.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid import data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Permission Statistics */
export const fetchPermissionStats = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/permissions/stats", {
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
        "You do not have permission to view permission statistics.",
      );
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Recent Permissions */
export const fetchRecentPermissions = async (limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/permissions/recent?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      permissions: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view recent permissions.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Permissions by Status */
export const fetchPermissionsByStatus = async (status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/permissions/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      permissions: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to view permissions by status.",
      );
    } else if (error.response?.status === 404) {
      throw new Error(`No permissions found with status: ${status}`);
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Permissions by Document ID */
export const fetchPermissionsByDocumentId = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/permissions/document/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      permissions: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to access this document's permissions.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Batch Update Permission Status */
export const batchUpdatePermissionStatus = async (permissionIds, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/permissions/batch/status",
      { permissionIds, status },
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
      throw new Error(
        "You do not have permission to update permission status.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* =========================
   PERMISSION ASSIGNMENT APIS
   ========================= */

/* Set Approver */
export const setApprover = async (approverData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch("/permissions/set-approver", approverData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to set approver.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Assign Employee to Department */
export const assignEmployeeToDepartment = async (assignmentData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/permissions/set-employee-department",
      assignmentData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to assign employee to department.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Remove Employee from Department */
export const removeEmployeeFromDepartment = async (removalData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      "/permissions/remove-employee-department",
      removalData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to remove employee from department.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Assign Employee Role */
export const assignEmployeeRole = async (assignmentData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/permissions/assign-employee-role",
      assignmentData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to assign employee role.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Remove Employee Role */
export const removeEmployeeRole = async (removalData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      "/permissions/remove-employee-role",
      removalData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to remove employee role.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Assign Employee Permission */
export const assignEmployeePermission = async (assignmentData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/permissions/assign-employee-permission",
      assignmentData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to assign employee permission.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Remove Employee Permission */
export const removeEmployeePermission = async (removalData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      "/permissions/remove-employee-permission",
      removalData,
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
      data: res.data.data,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to remove employee permission.",
      );
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};
