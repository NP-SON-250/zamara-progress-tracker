import api from "../api/axios";

class UserSyncService {
  constructor() {
    this.pollingInterval = null;
    this.listeners = [];
    this.userId = null;
    this.syncInProgress = false;
    this.lastSync = null;
  }

  /* ================= START POLLING ================= */
  startPolling(userId, interval = 30000) {
    this.userId = userId;

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.syncUserData();
    this.pollingInterval = setInterval(() => {
      this.syncUserData();
    }, interval);
  }

  /* ================= STOP POLLING ================= */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /* ================= SYNC USER ================= */
  async syncUserData() {
    if (!this.userId || this.syncInProgress) return;

    try {
      this.syncInProgress = true;

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get(`/users/single-user/${this.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = response.data?.data;

      if (!payload) {
        console.warn("Sync: empty payload");
        return;
      }

      const formatted = {
        _id: payload._id,
        id: payload._id,
        fullname: payload.fullname,
        email: payload.email,
        role: payload.role,
        status: payload.status,
        lastLogin: payload.lastLogin,
        registeredOn: payload.registeredOn,

        departments: payload.departments || [],
        assignedTasks: payload.assignedTasks || [],
        userDetails: {
          departments: payload.departments || [],
          assignedTasks: payload.assignedTasks || [],
        },
      };

      this.notifyListeners(formatted);
      this.lastSync = new Date();

      return formatted;
    } catch (error) {
      console.error(" User sync failed:", error?.message);

      if (error?.response?.status === 401) {
        console.warn("Unauthorized sync");
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /* ================= LISTENERS ================= */
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notifyListeners(data) {
    if (!data) return;
    this.listeners.forEach((cb) => cb(data));
  }

  /* ================= FORCE SYNC ================= */
  forceSync() {
    return this.syncUserData();
  }

  getLastSync() {
    return this.lastSync;
  }
}

export default new UserSyncService();
