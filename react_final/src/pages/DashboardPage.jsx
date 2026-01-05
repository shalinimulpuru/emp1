// src/pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Hello <strong>{user?.username}</strong>, you are logged in as{" "}
        <span className="badge">{role}</span>
      </p>

      <div className="grid-3">
        <div className="stat-card">
          <h3>Attendance</h3>
          <p>Check in &amp; out, review records.</p>
        </div>
        <div className="stat-card">
          <h3>Leaves</h3>
          <p>
            {role === "EMPLOYEE"
              ? "Apply and track your leave requests."
              : "Review and manage employee leaves."}
          </p>
        </div>
        <div className="stat-card">
          <h3>Employees</h3>
          <p>
            {role === "HR"
              ? "Create and manage employee profiles."
              : "View your profile and basic info."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
