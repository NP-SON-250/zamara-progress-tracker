import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiSettings, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../../assets/zamara.png";
import { maskEmail } from "../../../../utils/masks";
import SearchDropdown from "./SearchDropdown";
import Notifications from "./Notifications";
import SystemSettings from "./SystemSettings";

const TOPBAR_HEIGHT = 45;

const Topbar = () => {
  const { departments, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);

  const dropdownRef = useRef();

  // ---------------- Close dropdowns when clicking outside ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setDeptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Get User Data from localStorage directly ----------------
  const getUserFromStorage = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      return storedUser;
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
      return null;
    }
  };

  const getDepartmentsFromStorage = () => {
    try {
      const storedDepts = JSON.parse(
        localStorage.getItem("departments") || "[]",
      );
      return storedDepts;
    } catch (e) {
      console.error("Error reading departments from localStorage:", e);
      return [];
    }
  };

  // ALWAYS use localStorage data as the primary source
  // Context data might not be properly updated
  const storedUser = getUserFromStorage();
  const storedDepartments = getDepartmentsFromStorage();

  // Use localStorage data if available, otherwise fallback to context
  const currentUser = storedUser || user;
  const currentDepartments =
    storedDepartments.length > 0 ? storedDepartments : departments;

  // ---------------- User Departments ----------------
  const userDepartments =
    currentDepartments
      ?.map((d) => {
        if (typeof d === "string") return d;
        if (d && typeof d === "object") return d.name || "";
        return "";
      })
      .filter(Boolean) || [];

  // ---------------- User Info ----------------
  // Get user data with proper field names
  const fullName = currentUser?.fullname || "User";

  const workEmail = currentUser?.email || currentUser?.Email || "";

  const userInitials =
    fullName && fullName !== "User"
      ? fullName
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  // ---------------- Determine active department from URL ----------------
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const pathMap = {
      pension: "pension",
      finance: "finance",
      development: "business development",
      actuarial: "actuarial",
      technical: "technical",
      it: "it",
      claims: "claims",
      hr: "human resource",
      procurement: "procurement",
      social: "social",
      administration: "administration",
    };
    const department = pathMap[path];
    if (department) {
      setActiveDepartment(department);
    }
  }, [location.pathname]);

  // ---------------- Navigate to Department ----------------
  const navigateToDepartment = (department) => {
    const routeMap = {
      pension: "/pension/dashboard",
      finance: "/finance/dashboard",
      "business development": "/development/dashboard",
      actuarial: "/actuarial/dashboard",
      technical: "/technical/dashboard",
      it: "/it/dashboard",
      "human resource": "/hr/dashboard",
      procurement: "/procurement/dashboard",
      administration: "/administration/dashboard",
      claims: "/claims/dashboard",
      social: "/social/dashboard",
    };
    const route = routeMap[department.toLowerCase()];
    if (route) {
      console.log(`Navigating to ${department}: ${route}`);
      navigate(route);
    }
  };

  const handleDepartmentClick = (department) => {
    setActiveDepartment(department.toLowerCase());
    setDeptOpen(false);
    setDropdownOpen(false);
    navigateToDepartment(department);
  };

  // Debug logging
  useEffect(() => {}, [
    user,
    storedUser,
    currentUser,
    currentDepartments,
    activeDepartment,
  ]);

  return (
    <>
      {/* ================= Topbar ================= */}
      <div className="fixed top-0 left-0 h-[45px] w-full bg-zblue text-white flex items-center justify-between px-4 shadow-md z-[1000]">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Zamara" className="w-6" />
          <h1 className="text-md font-semibold tracking-wide capitalize hidden md:block">
            Progress Trac<span className="text-zgreen">king Center</span>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-8 md:gap-20 relative">
          {/* Search */}
          <FiSearch
            onClick={() => {
              setSearchOpen(true);
              setNotificationsOpen(false);
              setSystemSettingsOpen(false);
            }}
            className="text-xl cursor-pointer hover:text-zgreen/60"
          />

          {/* Notifications */}
          <FiBell
            onClick={() => {
              setNotificationsOpen(true);
              setSearchOpen(false);
              setSystemSettingsOpen(false);
            }}
            className="text-xl cursor-pointer hover:text-zgreen/60"
          />

          {/* System Settings */}
          <FiSettings
            onClick={() => {
              setSystemSettingsOpen(true);
              setNotificationsOpen(false);
              setSearchOpen(false);
            }}
            className="text-xl cursor-pointer hover:text-zgreen/60"
          />

          {/* Profile Dropdown */}
          <div
            ref={dropdownRef}
            className="relative text-zblue md:text-xs text-md "
          >
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 bg-zgreen/45 hover:bg-zgreen/20 rounded-full flex items-center justify-center font-semibold cursor-pointer"
            >
              <p className="text-sm">{userInitials}</p>
            </div>

            {dropdownOpen && (
              <div className="absolute -right-6 mt-[5px] md:w-72 w-[380px] bg-white rounded-md shadow-xl z-[1001] overflow-hidden">
                {/* User Info */}
                <div className="p-4 md:pl-4 pl-6  flex gap-3 md:border-b border-b-2 border-zblue/30">
                  <div className="w-10 h-10 bg-zblue/80 rounded-full flex items-center justify-center font-semibold text-white ">
                    {userInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{fullName || "User"}</span>
                    <span className="text-gray-500">
                      {workEmail ? maskEmail(workEmail) : "No email"}
                    </span>
                  </div>
                </div>

                {/* Profile Settings */}
                <div className="px-4 md:pl-4 pl-6 py-3 hover:bg-zgreen/20 cursor-pointer border-b">
                  Profile Settings
                </div>

                {/* Departments */}
                <div>
                  <div
                    onClick={() => setDeptOpen(!deptOpen)}
                    className="px-4 md:pl-4 pl-6 py-3 hover:bg-zgreen/20 cursor-pointer flex justify-between items-center border-b"
                  >
                    Departments
                    <FiChevronDown
                      className={`transition-transform ${
                        deptOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {deptOpen && (
                    <div className="bg-gray-50 max-h-64 overflow-y-auto">
                      {userDepartments.length > 0 ? (
                        userDepartments.map((dept, index) => {
                          const isActive =
                            activeDepartment?.toLowerCase() ===
                            dept.toLowerCase();
                          return (
                            <div
                              key={index}
                              onClick={() => handleDepartmentClick(dept)}
                              className={`px-6 py-2 cursor-pointer ${
                                isActive
                                  ? "text-zgreen/60 font-semibold bg-gray-100"
                                  : "hover:text-zgreen/60 hover:font-semibold hover:bg-gray-50"
                              }`}
                            >
                              {dept}
                              {isActive}
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-6 py-3 text-gray-500">
                          No departments assigned
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sign Out */}
                <div
                  onClick={logout}
                  className="px-4 py-3 hover:bg-red-100 text-red-600 cursor-pointer font-semibold flex justify-center"
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= Panels ================= */}
      <SearchDropdown
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <Notifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        topbarHeight={TOPBAR_HEIGHT}
      />
      <SystemSettings
        isOpen={systemSettingsOpen}
        onClose={() => setSystemSettingsOpen(false)}
        topbarHeight={TOPBAR_HEIGHT}
      />

      {/* Padding for fixed topbar */}
      <div style={{ paddingTop: `${TOPBAR_HEIGHT}px` }} />
    </>
  );
};

export default Topbar;
