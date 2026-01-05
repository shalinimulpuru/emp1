// src/components/Layout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className="bg-gradient-blob blob-1" />
      <div className="bg-gradient-blob blob-2" />

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-circle">EMP</div>
          <div>
            <div className="logo-title">Emp Manager</div>
            <div className="logo-subtitle">Smart HR Panel</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink end to="/" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            My Profile
          </NavLink>
          {(role === "HR" || role === "MANAGER") && (
            <NavLink to="/attendance" className="nav-link">
              Attendance
            </NavLink>
          )}
          {role === "HR" && (
            <NavLink to="/employees" className="nav-link">
              Employees
            </NavLink>
          )}
          <NavLink to="/leaves" className="nav-link">
            Leaves
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar-circle">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
