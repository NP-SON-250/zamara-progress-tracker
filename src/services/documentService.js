import api from "../api/axios";

/* =========================
   COMMON DOCUMENT APIS
   ========================= */

/* Fetch Last System Number */
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

/* Fetch Logged User Pending Documents (All Types) */
export const fetchLoggedUserPendingDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/logged-user-pending-documents", {
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
        "You do not have permission to access pending documents.",
      );
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch pending documents.",
    );
  }
};

/* Cancel Document Approval Request */
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
    return res.data.data;
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

/* Delegate Document Request */
export const delegateDocumentRequest = async (documentId, systemNumber) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    //Log what we're sending
    console.log("Sending delegation request:", { documentId, systemNumber });

    const res = await api.put(
      `/documents/delegate-request/${documentId}`,
      { systemNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Delegate API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delegate document");
  }
};

/* Approve Document Request */
export const approveDocumentRequest = async (documentId) => {
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

    return res.data.data;
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

/* Re-Open Document Request */
export const reopenDocumentRequest = async (documentId) => {
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

    return res.data.data;
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

/* Revert Document */
export const revertDocumentRequest = async (documentId) => {
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

/* Clear Document Data */
export const clearDocumentData = async (documentId) => {
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

/* =========================
   EMPLOYEE DOCUMENT APIS
   ========================= */

/* Fetch All Employee Documents */
export const fetchEmployeeDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.get("/documents/employees-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access documents.");
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Single Employee Document (with employees inside) */
export const fetchEmployeeDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/documents/employees/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access this document.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch document.",
    );
  }
};

/* Send Employee Document For Approval */
export const requestEmployeeApproval = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/documents/request-employee-approval/${documentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send approval");
  }
};

/* Auto Save Employee Document */
export const autoSaveEmployeeDocument = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/autosave-employee-document/${documentId}`,
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
      throw new Error("You do not have permission to modify this document.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to autosave document.",
    );
  }
};

/* Post Employee Document */
export const postEmployeeDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/post-employee-request/${documentId}`,
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
      throw new Error("You do not have permission to post this document.");
    } else if (error.response?.status === 404) {
      throw new Error("Document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

/* =========================
   BROKER DOCUMENT APIS
   ========================= */

/* Fetch All Broker Documents */
export const fetchBrokerDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    const res = await api.get("/documents/brokers-documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You do not have permission to access broker documents.");
    }
    throw new Error(error.response?.data?.message);
  }
};

/* Fetch Single Broker Document (with brokers inside) */
export const fetchBrokerDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get(`/documents/brokers/${documentId}`, {
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
        "You do not have permission to access this broker document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Broker document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch broker document.",
    );
  }
};

/* Fetch Pending Broker Documents */
export const fetchPendingBrokerDocuments = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.get("/documents/pending-broker-documents", {
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
        "You do not have permission to access pending broker documents.",
      );
    }

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch pending broker documents.",
    );
  }
};

/* Send Broker Document For Approval */
export const requestBrokerApproval = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/documents/request-broker-approval/${documentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send broker approval",
    );
  }
};

/* Auto Save Broker Document */
export const autoSaveBrokerDocument = async (documentId, data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/autosave-broker-document/${documentId}`,
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
        "You do not have permission to modify this broker document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Broker document not found.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to autosave broker document.",
    );
  }
};

/* Post Broker Document */
export const postBrokerDocumentRequest = async (documentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await api.put(
      `/documents/post-broker-request/${documentId}`,
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
        "You do not have permission to post this broker document.",
      );
    } else if (error.response?.status === 404) {
      throw new Error("Broker document not found.");
    }

    throw new Error(error.response?.data?.message);
  }
};

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
      throw new Error(
        "You do not have permission to access department documents.",
      );
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

    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send department approval",
    );
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
      error.response?.data?.message ||
        "Failed to autosave department document.",
    );
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

    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send role approval",
    );
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

    return res.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send permission approval",
    );
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
