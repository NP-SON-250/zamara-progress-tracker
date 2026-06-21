import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import PensionDashboard from "./pages/pension/PensionDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import BDDashboard from "./pages/BD/BDDashboard";
import ActuarialDashboard from "./pages/actuarial/ActuarialDashboard";
import TechnicalDashboard from "./pages/technical/TechnicalDashboard";
import ITDashboard from "./pages/IT/ITDashboard";
import ClaimsDashboard from "./pages/claims/ClaimsDashboard";
import HRDashboard from "./pages/HR/HRDashboard";
import ProcurementDashboard from "./pages/procurement/ProcurementDashboard";
import SocialDashboard from "./pages/social/SocialDashboard";
import AdministrationDashboard from "./pages/administration/AdministrationDashboard";
import DepartmentProtect from "./protectors/DepartmentProtect";
import Topbar from "./components/ui/models/menu/Topbar";
import DepartmentMenu from "./components/ui/models/menu/DepartmentMenu";

//======= Pension Tasks=======//
import AllTasks from "./pages/pension/tasks/AllTasks";
import NotStartedTasks from "./pages/pension/tasks/NotStartedTasks";
import RunningTasks from "./pages/pension/tasks/RunningTasks";
import OnholdTasks from "./pages/pension/tasks/OnholdTasks";
import OverdueTasks from "./pages/pension/tasks/OverdueTasks";
import CompletedTasks from "./pages/pension/tasks/CompletedTasks";

// Main Layout Component that includes Topbar and DepartmentMenu
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes("/dashboard");

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      {!isDashboardRoute && <DepartmentMenu />}
      <main
        className={`flex-1 overflow-auto ${!isDashboardRoute ? "pt-0" : ""}`}
      >
        {children}
      </main>
    </div>
  );
};

// Dashboard Layout (without DepartmentMenu)
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

// Content wrapper for department routes - NOW USING useLocation hook
const DepartmentContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Comprehensive component mapping for all submenus
  const componentMap = {
    // ============ HR - Tasks ============
    "/hr/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/hr/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/hr/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/hr/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/hr/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/hr/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ HR - Employees ============
    "/hr/human-resource-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/hr/human-resource-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/hr/human-resource-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/hr/human-resource-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ HR - More Options ============
    "/hr/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/hr/more-options/hold-task": <div className="">Coming Soon</div>,
    "/hr/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Finance - Tasks ============
    "/finance/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/finance/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/finance/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/finance/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/finance/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/finance/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ Finance - Employees ============
    "/finance/finance-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/finance/finance-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/finance/finance-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/finance/finance-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Finance - More Options ============
    "/finance/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/finance/more-options/hold-task": <div className="">Coming Soon</div>,
    "/finance/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ IT - Tasks ============
    "/it/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/it/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/it/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/it/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/it/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/it/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ IT - Employees ============
    "/it/it-employees/all-employees": <div className="">Coming Soon</div>,
    "/it/it-employees/free-employees": <div className="">Coming Soon</div>,
    "/it/it-employees/busy-employees": <div className="">Coming Soon</div>,
    "/it/it-employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ IT - System Settings ============
    "/it/system-settings/create-user": <div className="">Coming Soon</div>,
    "/it/system-settings/all-users": <div className="">Coming Soon</div>,
    "/it/system-settings/create-department": (
      <div className="">Coming Soon</div>
    ),
    "/it/system-settings/all-department": <div className="">Coming Soon</div>,

    // ============ IT - More Options ============
    "/it/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/it/more-options/hold-task": <div className="">Coming Soon</div>,
    "/it/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Pension - Tasks ============
    "/pension/tasks/all-tasks": <AllTasks/>,
    "/pension/tasks/non-started-tasks": <NotStartedTasks/>,
    "/pension/tasks/running-tasks": <RunningTasks/>,
    "/pension/tasks/onhold-tasks": <OnholdTasks/>,
    "/pension/tasks/overdue-tasks": <OverdueTasks/>,
    "/pension/tasks/completed-tasks": <CompletedTasks/>,

    // ============ Pension - Employees ============
    "/pension/pension-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/pension/pension-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/pension/pension-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/pension/pension-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Pension - More Options ============
    "/pension/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/pension/more-options/hold-task": <div className="">Coming Soon</div>,
    "/pension/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Claims ============
    "/claims/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/claims/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/claims/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/claims/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/claims/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/claims/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ claims - Employees ============
    "/claims/claims-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/claims/claims-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/claims/claims-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/claims/claims-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ claims - More Options ============
    "/claims/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/claims/more-options/hold-task": <div className="">Coming Soon</div>,
    "/claims/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ procurement - Tasks ============
    "/procurement/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/procurement/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/procurement/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/procurement/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/procurement/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/procurement/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ procurement - Employees ============
    "/procurement/procurement-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/procurement-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/procurement-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/procurement-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ procurement - More Options ============
    "/procurement/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/more-options/hold-task": <div className="">Coming Soon</div>,
    "/procurement/more-options/task-reports": (
      <div className="">Coming Soon</div>
    ),

    // ============ Administration ============
    "/administration/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/administration/tasks/non-started-tasks": (
      <div className="">Coming Soon</div>
    ),
    "/administration/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/administration/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/administration/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/administration/tasks/completed-tasks": (
      <div className="">Coming Soon</div>
    ),

    // ============ administration - Employees ============
    "/administration/administration-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/administration-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/administration-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/administration-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ administration - Grants ============
    "/administration/granted-access/organization-tasks": (
      <div className="">Coming Soon</div>
    ),
    "/administration/granted-access/per-department": (
      <div className="">Coming Soon</div>
    ),
    "/administration/granted-access/departmental-commenting": (
      <div className="">Coming Soon</div>
    ),
    "/administration/granted-access/individual-commenting": (
      <div className="">Coming Soon</div>
    ),

    // ============ administration - More Options ============
    "/administration/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/administration/more-options/hold-task": (
      <div className="">Coming Soon</div>
    ),
    "/administration/more-options/task-reports": (
      <div className="">Coming Soon</div>
    ),

    // ============ Business Development ============
    "/development/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/development/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/development/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/development/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/development/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/development/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ Business Development - Employees ============
    "/development/business-development-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/development/business-development-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/development/business-development-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/development/business-development-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Business Development - More Options ============
    "/development/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/development/more-options/hold-task": <div className="">Coming Soon</div>,
    "/development/more-options/task-reports": (
      <div className="">Coming Soon</div>
    ),

    // ============ Actuarial ============
    "/actuarial/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/actuarial/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/actuarial/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/actuarial/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/actuarial/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/actuarial/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ Actuarial - Employees ============
    "/actuarial/actuarial-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/actuarial/actuarial-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/actuarial/actuarial-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/actuarial/actuarial-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Actuarial - More Options ============
    "/actuarial/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/actuarial/more-options/hold-task": <div className="">Coming Soon</div>,
    "/actuarial/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Technical ============
    "/technical/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/technical/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/technical/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/technical/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/technical/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/technical/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ Technical - Employees ============
    "/technical/technical-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/technical/technical-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/technical/technical-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/technical/technical-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Technical - More Options ============
    "/technical/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/technical/more-options/hold-task": <div className="">Coming Soon</div>,
    "/technical/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Social ============
    "/social/tasks/all-tasks": <div className="">Coming Soon</div>,
    "/social/tasks/non-started-tasks": <div className="">Coming Soon</div>,
    "/social/tasks/running-tasks": <div className="">Coming Soon</div>,
    "/social/tasks/onhold-tasks": <div className="">Coming Soon</div>,
    "/social/tasks/overdue-tasks": <div className="">Coming Soon</div>,
    "/social/tasks/completed-tasks": <div className="">Coming Soon</div>,

    // ============ Social - Employees ============
    "/social/social-employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/social/social-employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/social/social-employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/social/social-employees/multi-employees": (
      <div className="">Coming Soon</div>
    ),

    // ============ Social - More Options ============
    "/social/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/social/more-options/hold-task": <div className="">Coming Soon</div>,
    "/social/more-options/task-reports": <div className="">Coming Soon</div>,
  };

  const Component = componentMap[currentPath];

  return Component ? (
    Component
  ) : (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Coming Soon
        </h2>
        <p className="text-gray-500">This feature is under development</p>
      </div>
    </div>
  );
};

// Wrapper for department submenu routes
const DepartmentRouteWrapper = () => {
  return (
    <MainLayout>
      <DepartmentContent />
    </MainLayout>
  );
};

// Wrapper for dashboard routes
const DashboardRouteWrapper = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => {
  return (
    <div className="font-museo">
      <Routes>
        {/* Public Route - Login (without layout) */}
        <Route path="/" element={<Login />} />

        {/* Department Submenu Routes (with Topbar and DepartmentMenu) */}
        <Route
          path="/:department/:parentMenu/:subMenu"
          element={<DepartmentRouteWrapper />}
        />

        {/* Dashboard Routes (with Topbar only) */}
        <Route
          path="/pension/dashboard"
          element={
            <DepartmentProtect department="pension">
              <DashboardRouteWrapper>
                <PensionDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/finance/dashboard"
          element={
            <DepartmentProtect department="finance">
              <DashboardRouteWrapper>
                <FinanceDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/development/dashboard"
          element={
            <DepartmentProtect department="business development">
              <DashboardRouteWrapper>
                <BDDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/actuarial/dashboard"
          element={
            <DepartmentProtect department="actuarial">
              <DashboardRouteWrapper>
                <ActuarialDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/technical/dashboard"
          element={
            <DepartmentProtect department="technical">
              <DashboardRouteWrapper>
                <TechnicalDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/it/dashboard"
          element={
            <DepartmentProtect department="it">
              <DashboardRouteWrapper>
                <ITDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/claims/dashboard"
          element={
            <DepartmentProtect department="claims">
              <DashboardRouteWrapper>
                <ClaimsDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/hr/dashboard"
          element={
            <DepartmentProtect department="human resource">
              <DashboardRouteWrapper>
                <HRDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/procurement/dashboard"
          element={
            <DepartmentProtect department="procurement">
              <DashboardRouteWrapper>
                <ProcurementDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/social/dashboard"
          element={
            <DepartmentProtect department="social">
              <DashboardRouteWrapper>
                <SocialDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        <Route
          path="/administration/dashboard"
          element={
            <DepartmentProtect department="administration">
              <DashboardRouteWrapper>
                <AdministrationDashboard />
              </DashboardRouteWrapper>
            </DepartmentProtect>
          }
        />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
