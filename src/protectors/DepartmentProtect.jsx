import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DepartmentProtect = ({ department, children }) => {
  const { user, departments, isAuthenticated, loading } = useAuth();

  const [checked, setChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  /* ================= NORMALIZE DEPARTMENTS ================= */
  const normalizedDepartments = useMemo(() => {
    let list = departments || [];

    // fallback to user object
    if (list.length === 0 && user?.departments) {
      list = user.departments;
    }

    // fallback to localStorage
    if (list.length === 0) {
      try {
        const stored = localStorage.getItem("departments");
        if (stored) {
          list = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Dept parse error:", e);
      }
    }

    return list
      .map((d) => {
        const name = typeof d === "string" ? d : d?.name;
        return name?.trim().toLowerCase();
      })
      .filter(Boolean);
  }, [departments, user]);

  /* ================= ACCESS CHECK ================= */
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      setHasAccess(false);
      setChecked(true);
      return;
    }

    const target = department?.toLowerCase();

    const allowed = normalizedDepartments.includes(target);

    setHasAccess(allowed);
    setChecked(true);
  }, [department, normalizedDepartments, isAuthenticated, loading]);

  /* ================= LOADING ================= */
  if (loading || !checked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zblue mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  /* ================= DENY ================= */
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DepartmentProtect;
