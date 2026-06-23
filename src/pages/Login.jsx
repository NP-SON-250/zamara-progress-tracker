import React, { useState, useEffect } from "react";
import Input from "../components/ui/inputs/Input";
import Button from "../components/ui/bottons/Button";
import { GiCheckMark } from "react-icons/gi";
import Logo from "../assets/zamara.png";
import { loginUser, verifyOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userSyncService from "../services/userSync";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  /*STATES*/
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
  });
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /*COUNTDOWN FOR RESEND OTP */
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (step === "login") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setOtpData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /*STEP 1: LOGIN -> REQUEST OTP*/
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const data = await loginUser(payload);
      console.log("Login response:", data);

      if (data?.status === 200 || data?.status === "200") {
        setError("");
        setOtpData({ email: formData.email, otp: "" });
        setStep("otp");
        setInfo(data.message || "OTP code sent to your email");
        setResendDisabled(true);
        setCountdown(60);
      } else {
        setError(data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  /*RESEND OTP FUNCTION*/
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const data = await loginUser(payload);
      if (data?.status === 200 || data?.status === "200") {
        setError("");
        setInfo(data.message || "OTP resent successfully");
        setResendDisabled(true);
        setCountdown(60);
      } else {
        setError(data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message || "An error occurred while resending OTP");
    } finally {
      setLoading(false);
    }
  };

  /*STEP 2: VERIFY OTP -> LOGIN USER*/
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (!otpData.otp || otpData.otp.length < 4) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(otpData);
      console.log("Full verify OTP response:", response);

      if (response?.status === 200 || response?.status === "200") {
        const responseData = response.data;
        const { token, user, assignedTasks, departments, message } =
          responseData;

        console.log("Extracted data:", {
          token: !!token,
          user: !!user,
          userEmail: user?.email,
          userId: user?._id,
          assignedTasks: assignedTasks?.length || 0,
          departments: departments?.length || 0,
        });

        // Create a clean user object with all data
        const cleanUser = {
          _id: user._id,
          id: user._id,
          fullname: user.fullname,
          email: user.email || "",
          role: user.role || "",
          status: user.status || "",
          lastLogin: user.lastLogin || "",
          registeredOn: user.registeredOn || "",
        };

        console.log("Clean user object:", cleanUser);

        // Store in localStorage
        localStorage.setItem("token", token);
        console.log("Stored token:", localStorage.getItem("token"));
        localStorage.setItem("user", JSON.stringify(cleanUser));
        localStorage.setItem("departments", JSON.stringify(departments || []));
        localStorage.setItem(
          "assignedTasks",
          JSON.stringify(assignedTasks || []),
        );

        // VERIFY the data was saved correctly
        const verifyUser = JSON.parse(localStorage.getItem("user") || "null");
        console.log(
          "Verification - User saved:",
          verifyUser ? "Yes" : "No",
          verifyUser?._id,
        );

        console.log("Clean user object:", cleanUser);
        console.log("Assigned tasks to save:", assignedTasks?.length || 0);

        // Verify ALL storage immediately
        const storedDepts = JSON.parse(
          localStorage.getItem("departments") || "[]",
        );
        const storedTasks = JSON.parse(
          localStorage.getItem("assignedTasks") || "[]",
        );
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");

        console.log("LocalStorage after setting:", {
          departments: storedDepts.length,
          assignedTasks: storedTasks.length,
          user: !!storedUser,
          token: !!localStorage.getItem("token"),
        });

        // Double-check assignedTasks was saved
        if (
          storedTasks.length === 0 &&
          assignedTasks &&
          assignedTasks.length > 0
        ) {
          localStorage.setItem("assignedTasks", JSON.stringify(assignedTasks));
          // Verify again
          const recheckTasks = JSON.parse(
            localStorage.getItem("assignedTasks") || "[]",
          );
          console.log("After force save - assignedTasks:", recheckTasks.length);
        }

        // Login to context - pass user, departments, and assignedTasks
        login(cleanUser, departments, assignedTasks);

        setInfo(message || `${cleanUser.fullname} is authenticated`);

        // Start user sync polling
        if (user?._id) {
          userSyncService.startPolling(user._id);
        }

        // Get dashboard path
        const userDepartments = departments?.map((d) => d.name || d) || [];
        const dashboardPath = getDashboardPath(userDepartments, user);

        console.log("Navigating to dashboard:", dashboardPath);

        // Navigate after ensuring data is saved
        const navigateToDashboard = (retryCount = 0) => {
          const checkDepts = JSON.parse(
            localStorage.getItem("departments") || "[]",
          );
          const checkTasks = JSON.parse(
            localStorage.getItem("assignedTasks") || "[]",
          );
          const checkUser = JSON.parse(localStorage.getItem("user") || "null");

          console.log(
            `Navigation check (attempt ${retryCount + 1}) - Departments: ${checkDepts.length}, Tasks: ${checkTasks.length}, User: ${!!checkUser}`,
          );

          if (checkDepts && checkDepts.length > 0 && checkUser) {
            console.log("Data confirmed, navigating to:", dashboardPath);
            navigate(dashboardPath, { replace: true });
          } else if (retryCount < 5) {
            // Retry after delay
            console.log(
              `Data not ready, retrying in 300ms... (attempt ${retryCount + 1}/5)`,
            );
            // Force save again
            localStorage.setItem(
              "departments",
              JSON.stringify(departments || []),
            );
            localStorage.setItem(
              "assignedTasks",
              JSON.stringify(assignedTasks || []),
            );
            localStorage.setItem("user", JSON.stringify(cleanUser));
            setTimeout(() => navigateToDashboard(retryCount + 1), 300);
          } else {
            // Last resort - save one more time
            localStorage.setItem(
              "departments",
              JSON.stringify(departments || []),
            );
            localStorage.setItem(
              "assignedTasks",
              JSON.stringify(assignedTasks || []),
            );
            localStorage.setItem("user", JSON.stringify(cleanUser));
            navigate(dashboardPath, { replace: true });
          }
        };

        // Start navigation check after a small delay
        setTimeout(() => navigateToDashboard(), 200);
      } else {
        setError(
          response?.message || "OTP verification failed. Please try again.",
        );
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(
        err.message ||
          "Verification failed. Please check your OTP and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*DEPARTMENT -> DASHBOARD MAPPING*/
  const getDashboardPath = (departments, user) => {
    if (!Array.isArray(departments) || departments.length === 0) {
      return "/notfound";
    }

    const normalized = departments.map((d) =>
      typeof d === "string"
        ? d?.trim().toLowerCase()
        : d?.name?.trim().toLowerCase(),
    );

    console.log("Normalized departments:", normalized);

    if (normalized.includes("technical")) return "/technical/dashboard";
    if (normalized.includes("pension")) return "/pension/dashboard";
    if (normalized.includes("finance")) return "/finance/dashboard";
    if (normalized.includes("actuarial")) return "/actuarial/dashboard";
    if (normalized.includes("business development"))
      return "/development/dashboard";
    if (normalized.includes("it")) return "/it/dashboard";
    if (normalized.includes("human resource") || normalized.includes("hr"))
      return "/hr/dashboard";
    if (normalized.includes("procurement")) return "/procurement/dashboard";
    if (normalized.includes("administration"))
      return "/administration/dashboard";
    if (normalized.includes("claims")) return "/claims/dashboard";
    if (normalized.includes("social")) return "/social/dashboard";
    return "/notfound";
  };

  /*CLEAR */
  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      email: "",
      password: "",
    }));
    setError("");
    setInfo("");
  };

  /*UI*/
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={step === "login" ? handleLogin : handleVerifyOtp}
        className="bg-gray-200 border border-gray-400 shadow-md rounded-md px-6 pb-6 pt-3 w-96 relative"
      >
        <div className="flex justify-start items-center gap-28 mb-4">
          <img src={Logo} alt="Zamara Logo" className="h-12" />
          <h2 className="text-center font-bold text-zblue">
            {step === "login" ? "Login" : "Verify OTP"}
          </h2>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-1 py-2 rounded mb-4">
            <p className="text-xs">{error}</p>
          </div>
        )}
        {info && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-1 py-2 rounded mb-4">
            <p className="text-xs">{info}</p>
          </div>
        )}

        {step === "login" ? (
          /*LOGIN FORM*/
          <>
            <Input
              label="User Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <div className="flex justify-between mt-6">
              <Button
                type="submit"
                color="zblue"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <GiCheckMark />
                {loading ? "Processing..." : "Sign In"}
              </Button>
              <Button
                type="button"
                color="zblue"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </>
        ) : (
          /*OTP VERIFICATION FORM*/
          <>
            <input type="hidden" name="email" value={otpData.email} />
            <Input
              label="Enter OTP"
              name="otp"
              value={otpData.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
            <div className="flex items-center justify-between mb-4">
              <div className="flex justify-between mt-2">
                <Button
                  type="submit"
                  color="zblue"
                  disabled={loading}
                  className="flex items-center gap-2 w-full"
                >
                  <GiCheckMark />
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className={`text-sm ${
                  resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-zblue hover:text-zblue/60"
                }`}
              >
                {resendDisabled ? `No OTP received? ${countdown}s` : "Resend"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
