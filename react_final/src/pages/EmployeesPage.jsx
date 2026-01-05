// src/pages/EmployeesPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const EmployeesPage = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "EMPLOYEE",
    department: "",
    job_title: "",
    phone: "",
    address: "",
    joining_date: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    department: "",
    job_title: "",
    phone: "",
    address: "",
    joining_date: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("employees/");
        setEmployees(res.data);
      } catch (err) {
        setError(
          "Failed to load employees. Make sure you're logged in as HR."
        );
      } finally {
        setLoading(false);
      }
    };

    if (role === "HR") {
      loadEmployees();
    } else {
      setLoading(false);
    }
  }, [role]);

  const onCreateChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onEditChange = (e) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateCreateEmployee = () => {
    const errors = {};
    if (!form.username.trim())
      errors.username = "Username is required.";
    if (!form.password.trim())
      errors.password = "Password is required.";
    if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (!form.job_title.trim())
      errors.job_title = "Job title is required.";
    if (!form.phone.trim())
      errors.phone = "Phone number is required.";
    if (!form.joining_date.trim())
      errors.joining_date = "Joining date is required.";
    if (form.department && isNaN(form.department)) {
      errors.department = "Department must be a numeric ID.";
    }
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationErrors = validateCreateEmployee();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the highlighted errors.");
      return;
    }

    setCreating(true);

    try {
      const payload = { ...form };

      if (!payload.department) delete payload.department;
      if (!payload.address) delete payload.address;
      if (!payload.first_name) delete payload.first_name;
      if (!payload.last_name) delete payload.last_name;
      if (!payload.email) delete payload.email;

      const res = await api.post("employees/", payload);

      setEmployees((prev) => [...prev, res.data]);
      setSuccess("Employee created successfully!");
      setFormErrors({});
      setForm({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "EMPLOYEE",
        department: "",
        job_title: "",
        phone: "",
        address: "",
        joining_date: "",
      });
    } catch (err) {
      const data = err?.response?.data;
      if (data?.error) {
        setError(
          Array.isArray(data.error) ? data.error.join(", ") : data.error
        );
      } else if (typeof data === "object") {
        setError("Please fix the highlighted errors.");
        setFormErrors((prev) => ({ ...prev, ...data }));
      } else {
        setError("Unexpected error while creating employee.");
      }
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      department: emp.department || "",
      job_title: emp.job_title || "",
      phone: emp.phone || "",
      address: emp.address || "",
      joining_date: emp.joining_date || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await api.put(`employees/${editingId}/`, editForm);
      const res = await api.get("employees/");
      setEmployees(res.data);
      setEditingId(null);
      setError(null);
      setSuccess("Employee updated successfully.");
    } catch (err) {
      setError("Failed to update employee. Check inputs.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee and their user account?")) return;
    try {
      await api.delete(`employees/${id}/`);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Employee deleted.");
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  if (role !== "HR") {
    return (
      <div>
        <h1 className="page-title">Employees</h1>
        <div className="alert-error">
          Only HR can manage employees. You are {role || "NOT LOGGED IN"}.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Employees</h1>
      <p className="page-subtitle">
        Create, view, update and delete employees. All fields must be valid,
        otherwise you&apos;ll see instructions here.
      </p>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="grid-2">
        {/* CREATE EMPLOYEE */}
        <div className="glass-card">
          <h2>Create Employee</h2>
          <form onSubmit={handleCreate} className="form small-form">
            <div className="grid-2">
              <label className="form-label">
                Username *
                <input
                  className="input"
                  name="username"
                  value={form.username}
                  onChange={onCreateChange}
                />
                {formErrors.username && (
                  <small className="error-text">
                    {formErrors.username}
                  </small>
                )}
              </label>
              <label className="form-label">
                Password *
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onCreateChange}
                />
                {formErrors.password && (
                  <small className="error-text">
                    {formErrors.password}
                  </small>
                )}
              </label>
            </div>

            <div className="grid-2">
              <label className="form-label">
                First Name
                <input
                  className="input"
                  name="first_name"
                  value={form.first_name}
                  onChange={onCreateChange}
                />
              </label>
              <label className="form-label">
                Last Name
                <input
                  className="input"
                  name="last_name"
                  value={form.last_name}
                  onChange={onCreateChange}
                />
              </label>
            </div>

            <label className="form-label">
              Email
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={onCreateChange}
              />
            </label>

            <div className="grid-2">
              <label className="form-label">
                Role
                <select
                  className="input"
                  name="role"
                  value={form.role}
                  onChange={onCreateChange}
                >
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              </label>
              <label className="form-label">
                Department ID (optional)
                <input
                  className="input"
                  name="department"
                  value={form.department}
                  onChange={onCreateChange}
                  placeholder="Numeric ID"
                />
                {formErrors.department && (
                  <small className="error-text">
                    {formErrors.department}
                  </small>
                )}
              </label>
            </div>

            <div className="grid-2">
              <label className="form-label">
                Job Title *
                <input
                  className="input"
                  name="job_title"
                  value={form.job_title}
                  onChange={onCreateChange}
                />
                {formErrors.job_title && (
                  <small className="error-text">
                    {formErrors.job_title}
                  </small>
                )}
              </label>
              <label className="form-label">
                Phone *
                <input
                  className="input"
                  name="phone"
                  value={form.phone}
                  onChange={onCreateChange}
                />
                {formErrors.phone && (
                  <small className="error-text">
                    {formErrors.phone}
                  </small>
                )}
              </label>
            </div>

            <label className="form-label">
              Address
              <textarea
                className="input"
                name="address"
                value={form.address}
                onChange={onCreateChange}
              />
            </label>

            <label className="form-label">
              Joining Date *
              <input
                className="input"
                type="date"
                name="joining_date"
                value={form.joining_date}
                onChange={onCreateChange}
              />
              {formErrors.joining_date && (
                <small className="error-text">
                  {formErrors.joining_date}
                </small>
              )}
            </label>

            <button className="btn-primary" type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* EMPLOYEE LIST */}
        <div className="glass-card">
          <h2>All Employees</h2>
          {loading ? (
            <div className="spinner" />
          ) : employees.length === 0 ? (
            <p>No employees yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Job Title</th>
                    <th>Phone</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.user.username}</td>
                      <td>{emp.user.role}</td>
                      <td>{emp.job_title}</td>
                      <td>{emp.phone}</td>
                      <td>
                        <button
                          className="btn-ghost"
                          onClick={() => startEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editingId && (
            <form onSubmit={handleUpdate} className="form mt-3">
              <h3>Edit Employee #{editingId}</h3>
              <div className="grid-2">
                <label className="form-label">
                  Job Title
                  <input
                    className="input"
                    name="job_title"
                    value={editForm.job_title}
                    onChange={onEditChange}
                  />
                </label>
                <label className="form-label">
                  Phone
                  <input
                    className="input"
                    name="phone"
                    value={editForm.phone}
                    onChange={onEditChange}
                  />
                </label>
              </div>
              <label className="form-label">
                Address
                <textarea
                  className="input"
                  name="address"
                  value={editForm.address}
                  onChange={onEditChange}
                />
              </label>
              <label className="form-label">
                Joining Date
                <input
                  className="input"
                  type="date"
                  name="joining_date"
                  value={editForm.joining_date}
                  onChange={onEditChange}
                />
              </label>

              <div className="flex-end gap-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
                <button className="btn-primary" type="submit">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
