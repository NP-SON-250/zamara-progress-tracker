import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    if (!token || token === "undefined") return true;

    const decoded = jwtDecode(token);

    // exp is in seconds, Date.now() is milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Token decode error:", error);
    return true;
  }
};
