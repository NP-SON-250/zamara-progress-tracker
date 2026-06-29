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

//=======Tasks=======//
import AllTasks from "./pages/tasks/AllTasks";
import ClosedTasks from "./pages/tasks/ClosedTasks";
import RunningTasks from "./pages/tasks/RunningTasks";
import OnholdTasks from "./pages/tasks/OnholdTasks";
import OverdueTasks from "./pages/tasks/OverdueTasks";
import CompletedTasks from "./pages/tasks/CompletedTasks";

//=======Employees=======//
import AllUsers from "./pages/employees/AllUsers";

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
    "/hr/tasks/all-tasks": <AllTasks />,
    "/hr/tasks/running-tasks": <RunningTasks />,
    "/hr/tasks/onhold-tasks": <OnholdTasks />,
    "/hr/tasks/overdue-tasks": <OverdueTasks />,
    "/hr/tasks/completed-tasks": <CompletedTasks />,
    "/hr/tasks/closed-tasks": <ClosedTasks />,

    // ============ HR - Employees ============
    "/hr/employees/all-employees": <AllUsers />,
    "/hr/employees/free-employees": <div className="">Coming Soon</div>,
    "/hr/employees/busy-employees": <div className="">Coming Soon</div>,
    "/hr/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ HR - More Options ============
    "/hr/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/hr/more-options/hold-task": <div className="">Coming Soon</div>,
    "/hr/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Finance - Tasks ============
    "/finance/tasks/all-tasks": <AllTasks />,
    "/finance/tasks/running-tasks": <RunningTasks />,
    "/finance/tasks/onhold-tasks": <OnholdTasks />,
    "/finance/tasks/overdue-tasks": <OverdueTasks />,
    "/finance/tasks/completed-tasks": <CompletedTasks />,
    "/finance/tasks/closed-tasks": <ClosedTasks />,

    // ============ Finance - Employees ============
    "/finance/employees/all-employees": <AllUsers />,
    "/finance/employees/free-employees": <div className="">Coming Soon</div>,
    "/finance/employees/busy-employees": <div className="">Coming Soon</div>,
    "/finance/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ Finance - More Options ============
    "/finance/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/finance/more-options/hold-task": <div className="">Coming Soon</div>,
    "/finance/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ IT - Tasks ============
    "/it/tasks/all-tasks": <AllTasks />,
    "/it/tasks/running-tasks": <RunningTasks />,
    "/it/tasks/onhold-tasks": <OnholdTasks />,
    "/it/tasks/overdue-tasks": <OverdueTasks />,
    "/it/tasks/completed-tasks": <CompletedTasks />,
    "/it/tasks/closed-tasks": <ClosedTasks />,

    // ============ IT - Employees ============
    "/it/employees/all-employees": <AllUsers />,
    "/it/employees/free-employees": <div className="">Coming Soon</div>,
    "/it/employees/busy-employees": <div className="">Coming Soon</div>,
    "/it/employees/multi-employees": <div className="">Coming Soon</div>,

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
    "/pension/tasks/all-tasks": <AllTasks />,
    "/pension/tasks/running-tasks": <RunningTasks />,
    "/pension/tasks/onhold-tasks": <OnholdTasks />,
    "/pension/tasks/overdue-tasks": <OverdueTasks />,
    "/pension/tasks/completed-tasks": <CompletedTasks />,
    "/pension/tasks/closed-tasks": <ClosedTasks />,

    // ============ Pension - Employees ============
    "/pension/employees/all-employees": <AllUsers />,
    "/pension/employees/free-employees": <div className="">Coming Soon</div>,
    "/pension/employees/busy-employees": <div className="">Coming Soon</div>,
    "/pension/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ Pension - More Options ============
    "/pension/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/pension/more-options/hold-task": <div className="">Coming Soon</div>,
    "/pension/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Claims ============
    "/claims/tasks/all-tasks": <AllTasks />,
    "/claims/tasks/running-tasks": <RunningTasks />,
    "/claims/tasks/onhold-tasks": <OnholdTasks />,
    "/claims/tasks/overdue-tasks": <OverdueTasks />,
    "/claims/tasks/completed-tasks": <CompletedTasks />,
    "/claims/tasks/closed-tasks": <ClosedTasks />,

    // ============ claims - Employees ============
    "/claims/employees/all-employees": <AllUsers />,
    "/claims/employees/free-employees": <div className="">Coming Soon</div>,
    "/claims/employees/busy-employees": <div className="">Coming Soon</div>,
    "/claims/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ claims - More Options ============
    "/claims/more-options/re-assign-task": <div className="">Coming Soon</div>,
    "/claims/more-options/hold-task": <div className="">Coming Soon</div>,
    "/claims/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ procurement - Tasks ============
    "/procurement/tasks/all-tasks": <AllTasks />,
    "/procurement/tasks/running-tasks": <RunningTasks />,
    "/procurement/tasks/onhold-tasks": <OnholdTasks />,
    "/procurement/tasks/overdue-tasks": <OverdueTasks />,
    "/procurement/tasks/completed-tasks": <CompletedTasks />,
    "/procurement/tasks/closed-tasks": <ClosedTasks />,

    // ============ procurement - Employees ============
    "/procurement/employees/all-employees": <AllUsers />,
    "/procurement/employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/procurement/employees/multi-employees": (
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
    "/administration/tasks/all-tasks": <AllTasks />,
    "/administration/tasks/running-tasks": <RunningTasks />,
    "/administration/tasks/onhold-tasks": <OnholdTasks />,
    "/administration/tasks/overdue-tasks": <OverdueTasks />,
    "/administration/tasks/completed-tasks": <CompletedTasks />,
    "/administration/tasks/closed-tasks": <ClosedTasks />,

    // ============ administration - Employees ============
    "/administration/employees/all-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/administration/employees/multi-employees": (
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
    "/development/tasks/all-tasks": <AllTasks />,
    "/development/tasks/running-tasks": <RunningTasks />,
    "/development/tasks/onhold-tasks": <OnholdTasks />,
    "/development/tasks/overdue-tasks": <OverdueTasks />,
    "/development/tasks/completed-tasks": <CompletedTasks />,
    "/development/tasks/closed-tasks": <ClosedTasks />,

    // ============ Business Development - Employees ============
    "/development/employees/all-employees": <AllUsers />,
    "/development/employees/free-employees": (
      <div className="">Coming Soon</div>
    ),
    "/development/employees/busy-employees": (
      <div className="">Coming Soon</div>
    ),
    "/development/employees/multi-employees": (
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
    "/actuarial/tasks/all-tasks": <AllTasks />,
    "/actuarial/tasks/running-tasks": <RunningTasks />,
    "/actuarial/tasks/onhold-tasks": <OnholdTasks />,
    "/actuarial/tasks/overdue-tasks": <OverdueTasks />,
    "/actuarial/tasks/completed-tasks": <CompletedTasks />,
    "/actuarial/tasks/closed-tasks": <ClosedTasks />,

    // ============ Actuarial - Employees ============
    "/actuarial/employees/all-employees": <AllUsers />,
    "/actuarial/employees/free-employees": <div className="">Coming Soon</div>,
    "/actuarial/employees/busy-employees": <div className="">Coming Soon</div>,
    "/actuarial/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ Actuarial - More Options ============
    "/actuarial/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/actuarial/more-options/hold-task": <div className="">Coming Soon</div>,
    "/actuarial/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Technical ============
    "/technical/tasks/all-tasks": <AllTasks />,
    "/technical/tasks/running-tasks": <RunningTasks />,
    "/technical/tasks/onhold-tasks": <OnholdTasks />,
    "/technical/tasks/overdue-tasks": <OverdueTasks />,
    "/technical/tasks/completed-tasks": <CompletedTasks />,
    "/technical/tasks/closed-tasks": <ClosedTasks />,

    // ============ Technical - Employees ============
    "/technical/employees/all-employees": <AllUsers />,
    "/technical/employees/free-employees": <div className="">Coming Soon</div>,
    "/technical/employees/busy-employees": <div className="">Coming Soon</div>,
    "/technical/employees/multi-employees": <div className="">Coming Soon</div>,

    // ============ Technical - More Options ============
    "/technical/more-options/re-assign-task": (
      <div className="">Coming Soon</div>
    ),
    "/technical/more-options/hold-task": <div className="">Coming Soon</div>,
    "/technical/more-options/task-reports": <div className="">Coming Soon</div>,

    // ============ Social ============
    "/social/tasks/all-tasks": <AllTasks />,
    "/social/tasks/running-tasks": <RunningTasks />,
    "/social/tasks/onhold-tasks": <OnholdTasks />,
    "/social/tasks/overdue-tasks": <OverdueTasks />,
    "/social/tasks/completed-tasks": <CompletedTasks />,
    "/social/tasks/closed-tasks": <ClosedTasks />,

    // ============ Social - Employees ============
    "/social/employees/all-employees": <AllUsers />,
    "/social/employees/free-employees": <div className="">Coming Soon</div>,
    "/social/employees/busy-employees": <div className="">Coming Soon</div>,
    "/social/employees/multi-employees": <div className="">Coming Soon</div>,

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
