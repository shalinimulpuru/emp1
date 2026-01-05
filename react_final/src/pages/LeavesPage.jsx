// src/pages/LeavesPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const LeavesPage = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("leaves/");
      setLeaves(res.data);
    } catch (err) {
      setError("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateLeave = () => {
    const errors = {};
    if (!form.start_date) errors.start_date = "Start date is required.";
    if (!form.end_date) errors.end_date = "End date is required.";
    if (!form.reason.trim()) errors.reason = "Reason is required.";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateLeave();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted errors.");
      return;
    }

    setCreating(true);

    try {
      await api.post("leaves/", form);
      setForm({ start_date: "", end_date: "", reason: "" });
      setFormErrors({});
      setSuccess("Leave request created.");
      await loadLeaves();
    } catch (err) {
      const data = err?.response?.data;
      if (typeof data === "object") {
        setError("Please check the input values.");
      } else {
        setError("Failed to create leave request.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (id, status) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(`leaves/${id}/approve/`, { status });
      setSuccess(`Leave ${status.toLowerCase()}.`);
      await loadLeaves();
    } catch (err) {
      setError("Failed to update leave status (Manager only).");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Leaves</h1>
      <p className="page-subtitle">
        {role === "EMPLOYEE"
          ? "Apply for leave and track approval status."
          : "View and manage employee leave requests."}
      </p>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="grid-2">
        {role === "EMPLOYEE" && (
          <div className="glass-card">
            <h2>Apply for Leave</h2>
            <form onSubmit={handleCreate} className="form small-form">
              <div className="grid-2">
                <label className="form-label">
                  Start Date
                  <input
                    className="input"
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={onChange}
                  />
                  {formErrors.start_date && (
                    <small className="error-text">
                      {formErrors.start_date}
                    </small>
                  )}
                </label>
                <label className="form-label">
                  End Date
                  <input
                    className="input"
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={onChange}
                  />
                  {formErrors.end_date && (
                    <small className="error-text">
                      {formErrors.end_date}
                    </small>
                  )}
                </label>
              </div>
              <label className="form-label">
                Reason
                <textarea
                  className="input"
                  name="reason"
                  value={form.reason}
                  onChange={onChange}
                />
                {formErrors.reason && (
                  <small className="error-text">
                    {formErrors.reason}
                  </small>
                )}
              </label>

              <button className="btn-primary" type="submit" disabled={creating}>
                {creating ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        )}

        <div className="glass-card">
          <h2>Leave Requests</h2>
          {loading ? (
            <div className="spinner" />
          ) : leaves.length === 0 ? (
            <p>No leave requests yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Manager Comment</th>
                    {role === "MANAGER" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((lv) => (
                    <tr key={lv.id}>
                      <td>{lv.id}</td>
                      <td>{lv.employee?.username}</td>
                      <td>
                        {lv.start_date} → {lv.end_date}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${lv.status.toLowerCase()}`}
                        >
                          {lv.status}
                        </span>
                      </td>
                      <td>{lv.manager_comment || "—"}</td>
                      {role === "MANAGER" && (
                        <td>
                          {lv.status === "PENDING" ? (
                            <div className="flex gap-1">
                              <button
                                className="btn-ghost"
                                disabled={actionLoading}
                                onClick={() =>
                                  handleApprove(lv.id, "APPROVED")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn-danger"
                                disabled={actionLoading}
                                onClick={() =>
                                  handleApprove(lv.id, "REJECTED")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
