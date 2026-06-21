import api from "../api/axios";

/* =========================
   ROLE DOCUMENT APIS
   ========================= */

/* Fetch All Role Documents */
export const fetchRoleDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.get("/documents/roles-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access role documents.");
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Single Role Document (with roles inside) */
export const fetchRoleDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/documents/roles/${documentId}`, {
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
        "You do not have permission to access this role document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Role document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch role document.",
    );
  }
};

/* Fetch Pending Role Documents */
export const fetchPendingRoleDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/pending-role-documents", {
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
        "You do not have permission to access pending role documents.",
      );
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch pending role documents.",
    );
  }
};

/* Send Role Document For Approval */
export const requestRoleApproval = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/documents/request-role-approval/${documentId}`,
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
      error.response?.data?.message || "Failed to send role approval",
    );
  }
};

/* Cancel Role Approval Request */
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

/* Auto Save Role Document */
export const autoSaveRoleDocument = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/autosave-role-document/${documentId}`,
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
        "You do not have permission to modify this role document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Role document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to autosave role document.",
    );
  }
};

/* Approve Role Document Request */
export const approveRoleDocumentRequest = async (documentId) => {
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

/* Post Role Document */
export const postRoleDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/post-role-request/${documentId}`,
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
      throw new Error("You do not have permission to post this role document.");
    } else if (error.response?.status === 404) {
      throw new Error("Role document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* Re-Open Role Document Request */
export const reopenRoleDocumentRequest = async (documentId) => {
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

/* Revert Role Document */
export const revertRoleDocumentRequest = async (documentId) => {
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

/* Clear Role Document Data */
export const clearRoleDocumentData = async (documentId) => {
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

/* Fetch Last Role System Number */
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
   ROLE CRUD APIS
   ========================= */

/* Fetch All Roles */
export const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access roles.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Fetch Role By ID */
export const fetchRoleById = async (roleId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access this role.");
    } else if (error.response?.status === 404) {
      throw new Error("Role not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Update Role */
export const updateRole = async (roleId, updateData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(`/roles/${roleId}`, updateData, {
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
      throw new Error("You do not have permission to update this role.");
    } else if (error.response?.status === 404) {
      throw new Error("Role not found.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid role data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Delete Role */
export const deleteRole = async (roleId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.delete(`/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: res.data.message,
      roleDeleted: res.data.roleDeleted,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to delete this role.");
    } else if (error.response?.status === 404) {
      throw new Error("Role not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Search Roles */
export const searchRoles = async (searchCriteria) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const queryParams = new URLSearchParams(searchCriteria).toString();
    const res = await api.get(`/roles/search?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      roles: res.data.roles || [],
      pagination: res.data.pagination,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to search roles.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Export Roles to Excel */
export const exportRolesToExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/roles/export", {
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
      throw new Error("You do not have permission to export roles.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Download Role Import Template */
export const downloadRoleTemplate = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.get("/roles/download-template", {
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

/* Import Roles from Excel */
export const importRoles = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.post("/roles/import", formData, {
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
      throw new Error("You do not have permission to import roles.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid import data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Role Statistics */
export const fetchRoleStats = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/roles/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view role statistics.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Recent Roles */
export const fetchRecentRoles = async (limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/roles/recent?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      roles: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view recent roles.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Roles by Status */
export const fetchRolesByStatus = async (status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/roles/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      roles: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to view roles by status.");
    } else if (error.response?.status === 404) {
      throw new Error(`No roles found with status: ${status}`);
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Get Roles by Document ID */
export const fetchRolesByDocumentId = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/roles/document/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      count: res.data.count,
      roles: res.data.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "You do not have permission to access this document's roles.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

/* Batch Update Role Status */
export const batchUpdateRoleStatus = async (roleIds, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.patch(
      "/roles/batch/status",
      { roleIds, status },
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
      throw new Error("You do not have permission to update role status.");
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Invalid request data.");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};
