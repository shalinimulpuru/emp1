// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setError(null);
      try {
        if (role === "EMPLOYEE") {
          const res = await api.get("my-profile/");
          setProfile(res.data);
        } else {
          const res = await api.get("me/");
          setProfile(res.data);
        }
      } catch (err) {
        setError("Failed to load profile");
      }
    };
    loadProfile();
  }, [role]);

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      {error && <div className="alert-error">{error}</div>}
      {!profile && !error && <div className="spinner" />}

      {profile && role === "EMPLOYEE" && (
        <div className="glass-card">
          <h2>{profile.user.username}</h2>
          <p>
            <strong>Role:</strong> {profile.user.role}
          </p>
          <p>
            <strong>Job Title:</strong> {profile.job_title}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          <p>
            <strong>Joining Date:</strong> {profile.joining_date}
          </p>
        </div>
      )}

      {profile && role !== "EMPLOYEE" && (
        <div className="glass-card">
          <h2>{profile.username}</h2>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Email:</strong> {profile.email || "—"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
