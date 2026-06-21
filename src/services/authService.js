import api from "../api/axios";
export const fetchUsers = async () => {
  try {
    const res = await api.get("/users/all-users");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
export const loginUser = async (formData) => {
  try {
    const res = await api.post("/users/auth", formData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login request failed");
  }
};
export const verifyOtp = async (otpData) => {
  try {
    const payload = {
      email: otpData.email,
      inputOTP: otpData.otp,
    };
    const res = await api.post("/users/verify", payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};