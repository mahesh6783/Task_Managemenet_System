import React, { useEffect, useState } from "react";
 
import LogoutButton from "../logout";
import { Link, useNavigate } from "react-router-dom";

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  green: "#2ecc71",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return navigate("/");

    fetch("http://127.0.0.1:8000/api/admin/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        return res.json();
      })
      .then(setProfile)
      .catch(console.error);
  }, [navigate]);

  if (!profile)
    return (
      <div style={pageStyle}>
        <p>Loading... </p>
      </div>
    );

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ✅ Header Section */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          
          <Link
              to="/admin-dashboard"
              style={{
                marginTop: "20px",
                padding: "8px 14px",
                borderRadius: 8,
                background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
                textDecoration: "none",
                color: theme.textLight,
                fontWeight: 600,
              }}
            >
              Back
            </Link>
            <h2>Intern Profile</h2>
          <LogoutButton />
        </header>

        {/* ✅ Profile Card */}
        <div
          style={{
            background: theme.cardBg,
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            display: "flex",
            gap: 30,
            alignItems: "center",
          }}
        >
          {/* ✅ Profile Image */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 12,
              border: `3px solid ${theme.purple}`,
              overflow: "hidden",
              background: "#111827",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  color: theme.purple,
                  fontSize: 40,
                  fontWeight: 700,
                }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* ✅ Profile Details */}
          <div>
            <h2 style={{ marginBottom: 5 }}>{profile.username}</h2>
            <div
              style={{
                color: theme.muted,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {profile.role}
            </div>

            <div style={infoRow}>
              <span style={label}>Email  </span>
              <span>{profile.email }</span>
            </div>

            <div style={infoRow}>
              <span style={label}>Phone</span>
              <span>{profile.phone || "—"}</span>
            </div>

            <div style={infoRow}>
              <span style={label}>Joined</span>
              <span>
                {profile.date_joined
                  ? new Date(profile.date_joined).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            <br></br>
            <Link
              to="/admin-profile-edit"
              style={{
                marginTop: "20px",
                padding: "8px 14px",
                borderRadius: 8,
                background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
                textDecoration: "none",
                color: theme.textLight,
                fontWeight: 600,
              }}
            >
              Edit
            </Link>
          </div>
        </div>

        {/* ✅ Small Footer */}
        <footer
          style={{
            marginTop: 30,
            textAlign: "center",
            color: theme.muted,
          }}
        >
          Intern Profile • TaskPro
        </footer>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
  color: theme.textLight,
  padding: 20,
  fontFamily: "Inter, system-ui, Arial",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
};

const label = {
  color: theme.muted,
  fontWeight: 600,
};

export default AdminProfile;

