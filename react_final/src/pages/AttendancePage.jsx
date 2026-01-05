// src/pages/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const AttendancePage = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("attendance/");
      setRecords(res.data);
    } catch (err) {
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError(null);
    setMsg(null);
    try {
      const res = await api.post("attendance/checkin/");
      setMsg("Check-in recorded.");
      setRecords((prev) => [...prev, res.data]);
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.detail || data?.detail === "" || data?.detail === null
          ? "Failed to mark attendance."
          : data?.detail || "Failed to mark attendance."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError(null);
    setMsg(null);
    try {
      await api.post("attendance/checkout/");
      setMsg("Check-out recorded.");
      await loadAttendance();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.detail || "Failed to checkout. Make sure you checked in today."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Attendance</h1>
      <p className="page-subtitle">
        {role === "EMPLOYEE"
          ? "Mark your daily attendance and view your history."
          : "View attendance of all employees."}
      </p>

      {msg && <div className="alert-success">{msg}</div>}
      {error && <div className="alert-error">{error}</div>}

      {role === "EMPLOYEE" && (
        <div className="glass-card mb-3 flex gap-2">
          <button
            className="btn-primary"
            onClick={handleCheckIn}
            disabled={actionLoading}
          >
            Check In
          </button>
          <button
            className="btn-ghost"
            onClick={handleCheckOut}
            disabled={actionLoading}
          >
            Check Out
          </button>
        </div>
      )}

      <div className="glass-card">
        <h2>Attendance Records</h2>
        {loading ? (
          <div className="spinner" />
        ) : records.length === 0 ? (
          <p>No attendance data yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.id}</td>
                    <td>{rec.employee?.username}</td>
                    <td>{rec.date}</td>
                    <td>{rec.check_in}</td>
                    <td>{rec.check_out || "—"}</td>
                    <td>{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
