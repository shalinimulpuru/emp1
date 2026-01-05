// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roles = ["HR", "MANAGER", "EMPLOYEE"];

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errors = {};
    if (!form.username.trim())
      errors.username = "Username is required.";
    if (!form.password.trim())
      errors.password = "Password is required.";
    if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (!roles.includes(form.role))
      errors.role = "Invalid role selected.";
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted errors.");
      return;
    }

    setLoading(true);

    try {
      await signup(form.username, form.password, form.role);
      navigate("/login");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.error) {
        setError(
          Array.isArray(data.error) ? data.error.join(", ") : data.error
        );
      } else {
        setError("Signup failed. Try a different username or stronger password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h1 className="auth-title">Create account ✨</h1>
        <p className="auth-subtitle">Choose your role and get started</p>

        <form onSubmit={onSubmit} className="form">
          <label className="form-label">
            Username
            <input
              className="input"
              name="username"
              value={form.username}
              onChange={onChange}
              required
            />
            {formErrors.username && (
              <small className="error-text">{formErrors.username}</small>
            )}
          </label>

          <label className="form-label">
            Password
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
            />
            {formErrors.password && (
              <small className="error-text">{formErrors.password}</small>
            )}
          </label>

          <label className="form-label">
            Role
            <select
              className="input"
              name="role"
              value={form.role}
              onChange={onChange}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <small className="error-text">{formErrors.role}</small>
            )}
          </label>

          {error && <div className="alert-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
