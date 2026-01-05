// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.detail || "Login failed. Please check your username/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h1 className="auth-title">Welcome back 👋</h1>
        <p className="auth-subtitle">Login to access your EMS dashboard</p>

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
          </label>

          {error && <div className="alert-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don&apos;t have an account?</span>
          <Link to="/signup" className="link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
