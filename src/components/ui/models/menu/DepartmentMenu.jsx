// DepartmentMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiGrid } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { IoIosMenu } from "react-icons/io";

const DepartmentMenu = ({ onSubMenuSelect }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [activeSubMenuItem, setActiveSubMenuItem] = useState("");
  const [activeParentMenu, setActiveParentMenu] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRefs = useRef({});

  // Map submenu items to URL slugs
  const getSubMenuSlug = (subItem) => {
    return subItem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Map URL slugs back to submenu items
  const getSubMenuFromSlug = (slug, submenuList) => {
    return submenuList.find((item) => getSubMenuSlug(item) === slug);
  };

  // Get current submenu from URL
  const getCurrentSubMenuFromURL = () => {
    const pathParts = location.pathname.split("/").filter((part) => part);
    if (pathParts.length >= 3) {
      const departmentSlug = pathParts[0];
      const parentMenuSlug = pathParts[1];
      const subMenuSlug = pathParts[2];
      return {
        department: departmentSlug,
        parentMenu: parentMenuSlug,
        subMenu: subMenuSlug,
      };
    }
    return null;
  };

  // Navigate to submenu URL
  const navigateToSubMenu = (department, parentMenu, subItem) => {
    const departmentSlug = getDepartmentSlug(department);
    const parentMenuSlug = getSubMenuSlug(parentMenu);
    const subMenuSlug = getSubMenuSlug(subItem);
    const newPath = `/${departmentSlug}/${parentMenuSlug}/${subMenuSlug}`;
    navigate(newPath);
  };

  // Navigate to department dashboard
  const navigateToDepartmentDashboard = () => {
    if (selectedDepartment) {
      const departmentSlug = getDepartmentSlug(selectedDepartment);
      // Navigate to the department dashboard (root path for the department)
      navigate(`/${departmentSlug}/dashboard`);

      // Reset active menu states
      setActiveMenuItem("");
      setActiveSubMenuItem("");
      setActiveParentMenu("");
      setOpenDropdown(null);
      setIsMobileMenuOpen(false);
    }
  };

  // Get department slug from name
  const getDepartmentSlug = (department) => {
    const slugMap = {
      "human resource": "hr",
      "business development": "bd",
      pension: "pension",
      finance: "finance",
      it: "it",
      procurement: "procurement",
      administration: "administration",
      claims: "claims",
      social: "social",
      technical: "technical",
      actuarial: "actuarial",
    };
    return slugMap[department] || department.toLowerCase().replace(/\s+/g, "-");
  };

  // Get department name from slug
  const getDepartmentFromSlug = (slug) => {
    const departmentMap = {
      hr: "human resource",
      bd: "business development",
      pension: "pension",
      finance: "finance",
      it: "it",
      procurement: "procurement",
      administration: "administration",
      claims: "claims",
      social: "social",
      technical: "technical",
      actuarial: "actuarial",
    };
    return departmentMap[slug] || slug.replace(/-/g, " ");
  };

  // Complete department menus configuration with submenus
  const departmentMenus = {
    pension: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "pension employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    finance: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "finance employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    "human resource": [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "human resource employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    it: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "it employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "system settings",
        dropdown: true,
        submenu: [
          "Create User",
          "All Users",
          "Create Departments",
          "All Departments",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    procurement: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "procurement employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    administration: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "administration employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "granted access",
        dropdown: true,
        submenu: [
          "Organization Tasks",
          "Per Department",
          "Departmental Commenting",
          "Individual Commenting",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    claims: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "claims employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    social: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "social employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    technical: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "techinical employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    actuarial: [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "actuarial employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
    "business development": [
      {
        title: "tasks",
        dropdown: true,
        submenu: [
          "All Tasks",
          "Non Started Tasks",
          "Running Tasks",
          "Onhold Tasks",
          "Overdue Tasks",
          "Completed Tasks",
        ],
      },
      {
        title: "business development employees",
        dropdown: true,
        submenu: [
          "All Employees",
          "Free Employees",
          "Busy Employees",
          "Multi Tasked",
        ],
      },
      {
        title: "more options",
        dropdown: true,
        submenu: ["Re Assign Task", "Hold Task", "Task Reports"],
      },
    ],
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      let isOutsideMenu = true;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          isOutsideMenu = false;
        }
      });
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOutsideMenu
      ) {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get department from URL and set active menu states
  useEffect(() => {
    const urlInfo = getCurrentSubMenuFromURL();
    if (urlInfo) {
      const department = getDepartmentFromSlug(urlInfo.department);
      setSelectedDepartment(department);
      const menu = departmentMenus[department];
      setMenuItems(menu);
      const activeParent = menu.find(
        (item) => getSubMenuSlug(item.title) === urlInfo.parentMenu,
      );
      if (activeParent) {
        setActiveParentMenu(activeParent.title);
        setActiveMenuItem(activeParent.title);
        const activeSub = getSubMenuFromSlug(
          urlInfo.subMenu,
          activeParent.submenu,
        );
        if (activeSub) {
          setActiveSubMenuItem(activeSub);
          if (onSubMenuSelect) {
            onSubMenuSelect({
              parentMenu: activeParent.title,
              subItem: activeSub,
              department: department,
            });
          }
        }
      }
    } else {
      const pathParts = location.pathname.split("/").filter((part) => part);
      if (pathParts.length >= 1) {
        const department = getDepartmentFromSlug(pathParts[0]);
        setSelectedDepartment(department);
        const menu = departmentMenus[department];
        setMenuItems(menu);
      }
    }
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Format department name for display
  const formatDepartmentName = (dept) => {
    if (!dept) return "Dashboard";
    return dept
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle menu item click
  const handleMenuItemClick = (item, index) => {
    setActiveMenuItem(item.title);
    if (activeParentMenu !== item.title) {
      setActiveSubMenuItem("");
      setActiveParentMenu("");
    }
    if (item.dropdown) {
      if (openDropdown === index) {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(index);
      }
    } else {
      console.log(`Navigate to ${item.title}`);
      setOpenDropdown(null);
    }
  };

  // Handle submenu item click
  const handleSubMenuItemClick = (item, subItem) => {
    setActiveMenuItem(item.title);
    setActiveSubMenuItem(subItem);
    setActiveParentMenu(item.title);
    navigateToSubMenu(selectedDepartment, item.title, subItem);
    setOpenDropdown(null);
  };

  // Capitalize first letter of each word
  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  return (
    <div
      className="bg-white border-b border-gray-200 md:px-1 py-1 relative z-40"
      ref={dropdownRef}
    >
      <div className="flex md:flex-row flex-col md:items-center items-start gap-4">
        {/* Left section - Department Name with click handler */}
        <div className="flex items-start justify-between w-full md:w-auto">
          <div
            className="items-center gap-2 flex justify-start pl-4 py-1 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={navigateToDepartmentDashboard}
          >
            <FiGrid className="text-blue-900/50 text-xl" />
            <h2 className="text-xs font-bold text-blue-900/50">
              {formatDepartmentName(selectedDepartment)} Department
            </h2>
          </div>
          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-zblue py-1 pr-4"
          >
            <IoIosMenu size={24} />
          </button>
        </div>

        {/* Center section - Menu Items */}
        <div
          className={`
          flex-1 flex flex-col md:flex-row md:items-center items-start md:flex-wrap gap-1
          ${isMobileMenuOpen ? "flex" : "hidden md:flex"}
        `}
        >
          {menuItems.map((item, idx) => {
            const isActive =
              activeMenuItem === item.title || activeParentMenu === item.title;
            const isDropdownOpen = openDropdown === idx;

            return (
              <div
                key={idx}
                className="relative w-full md:w-auto"
                ref={(el) => (menuRefs.current[idx] = el)}
              >
                <button
                  onClick={() => handleMenuItemClick(item, idx)}
                  className={`flex items-start gap-2 px-3 py-2 text-xs transition-colors whitespace-nowrap w-full md:w-auto justify-start md:justify-start
                    ${isActive ? "text-zgreen/60" : "text-blue-900/50 text-xl font-medium hover:text-zgreen/60"}`}
                >
                  <span>{item.icon}</span>
                  <span>{capitalize(item.title)}</span>
                  {item.dropdown && (
                    <FiChevronDown
                      className={`text-blue-900/50 text-sm transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown menu */}
                {item.dropdown && isDropdownOpen && (
                  <div className="md:fixed md:left-0 md:right-0 md:top-[84px] bg-gray-50 md:border-t md:border-b md:border-gray-200 z-50 md:shadow-lg py-1">
                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 px-3 py-1">
                      {item.submenu.map((subItem, subIdx) => {
                        const isActiveSub = activeSubMenuItem === subItem;
                        return (
                          <button
                            key={subIdx}
                            onClick={() =>
                              handleSubMenuItemClick(item, subItem)
                            }
                            className={`text-xs whitespace-nowrap transition-colors px-2 py-1 w-full md:w-auto text-left
                              ${isActiveSub ? "text-zgreen/60" : "text-blue-900/50 hover:text-zgreen/60"}`}
                          >
                            {subItem}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right section - empty spacer */}
        <div className="min-w-[200px] hidden md:flex justify-end">
          {/* Optional space for department-specific actions */}
        </div>
      </div>
    </div>
  );
};

export default DepartmentMenu;
