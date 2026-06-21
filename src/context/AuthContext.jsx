import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";
import userSyncService from "../services/userSync";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /* ================= SAFE STORAGE ================= */
  const getStoredData = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored || stored === "null" || stored === "undefined") {
        return defaultValue;
      }

      const parsed = JSON.parse(stored);

      if (key === "user") {
        return parsed && (parsed._id || parsed.id) ? parsed : defaultValue;
      }

      return parsed;
    } catch (e) {
      console.error(`Error parsing ${key}:`, e);
      return defaultValue;
    }
  };

  /* ================= STATE ================= */
  const [user, setUser] = useState(() => getStoredData("user", null));
  const [departments, setDepartments] = useState(() =>
    getStoredData("departments", []),
  );
  const [assignedTasks, setAssignedTasks] = useState(() =>
    getStoredData("assignedTasks", []),
  );

  const [loading, setLoading] = useState(true);

  const isAuthenticated =
    !!user &&
    !!localStorage.getItem("token") &&
    !isTokenExpired(localStorage.getItem("token"));

  /* ================= LOGIN ================= */
  const login = useCallback((userData, depts = [], tasks = []) => {
    if (!userData) return;

    setUser(userData);
    setDepartments(depts);
    setAssignedTasks(tasks);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("departments", JSON.stringify(depts));
    localStorage.setItem("assignedTasks", JSON.stringify(tasks));

    const userId = userData._id || userData.id;
    if (userId) userSyncService.startPolling(userId);
  }, []);

  /* ================= LOGOUT ================= */
  const logout = useCallback(() => {
    userSyncService.stopPolling();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("departments");
    localStorage.removeItem("assignedTasks");

    setUser(null);
    setDepartments([]);
    setAssignedTasks([]);

    navigate("/", { replace: true });
  }, [navigate]);

  /* ================= SYNC ================= */
  useEffect(() => {
    const handleSync = (data) => {
      const userData = data
        ? {
            _id: data.id,
            id: data.id,
            email: data.email,
            fullname: data.fullname,
            role: data.role,
            status: data.status,
            registeredOn: data.registeredOn,
            lastLogin: data.lastLogin,
          }
        : data;

      setUser(userData);
      setDepartments(userData.departments || []);
      setAssignedTasks(userData.assignedTasks || []);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem(
        "departments",
        JSON.stringify(data.departments || []),
      );
      localStorage.setItem(
        "assignedTasks",
        JSON.stringify(data.assignedTasks || []),
      );
    };

    userSyncService.addListener(handleSync);
    return () => userSyncService.removeListener(handleSync);
  }, []);

  /* ================= INIT RESTORE (FIXED) ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const storedUser = getStoredData("user", null);
      const storedDepts = getStoredData("departments", []);
      const storedTasks = getStoredData("assignedTasks", []);

      if (storedUser) {
        setUser(storedUser);
        setDepartments(storedDepts);
        setAssignedTasks(storedTasks);

        const userId = storedUser._id || storedUser.id;
        if (userId) userSyncService.startPolling(userId);
      }
    } catch (e) {
      console.error("Init restore error:", e);
    }

    setLoading(false);
  }, []);

  const inDepartment = useCallback(
    (department) => {
      return (departments || []).some((d) => {
        const name = typeof d === "string" ? d : d?.name;
        return name?.toLowerCase() === department.toLowerCase();
      });
    },
    [departments],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        departments,
        assignedTasks,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUserData: userSyncService.forceSync,
        inDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
