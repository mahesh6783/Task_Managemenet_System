import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../logout";

function UsersList() {
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("manager");

  const theme = {
    dark: "#0b0f1a",
    purple: "#6a39f7",
    blue: "#2bb5ff",
    green: "#2ecc71",
    cardBg: "#0f1724",
    textLight: "#ffffff",
    muted: "#9aa4b2",
  };

  // ✅ Load Admin + Default List
  useEffect(() => {
    if (!token) return navigate("/");

    axios
      .get("http://127.0.0.1:8000/api/admin/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      .then((res) => {
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }}
    );
      

    loadUsers("manager");
  }, []);

  // ✅ Fetch Users by Role
  const loadUsers = (role) => {
    setSelectedRole(role);

    axios
      .get(`http://127.0.0.1:8000/api/admin/users/${role}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(console.error);
  };

  // ✅ Delete user
  const deleteUser = (id) => {
    if (!window.confirm("Are you sure?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/admin/delete-user/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => loadUsers(selectedRole));
  };

 
  const container = { maxWidth: 1200, margin: "0 auto" };
  const pageStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
    color: theme.textLight,
    padding: 20,
    fontFamily: "Inter, system-ui, Arial",
  };

  return (
    <div style={pageStyle}>
        <div style={container}>
      {/* ✅ TOP NAV BAR */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#111827",
              border: `2px solid ${theme.purple}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  color: theme.purple,
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {profile.username ? profile.username[0].toUpperCase() : "A"}
              </span>
            )}
          </div>

          <div>
            <strong style={{ fontSize: 18 }}>{profile.username}</strong>
            <div
              style={{
                fontSize: 12,
                color: theme.muted,
                textTransform: "uppercase",
              }}
            >
              ADMIN
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
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
            Dashboard
          </Link>

          <LogoutButton />
        </div>
      </header>

      {/* ✅ MANAGERS / INTERNS BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => loadUsers("manager")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background:
              selectedRole === "manager"
                ? theme.purple
                : "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Managers
        </button>

        <button
          onClick={() => loadUsers("intern")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background:
              selectedRole === "intern"
                ? theme.blue
                : "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Interns
        </button>
      </div>

      {/* ✅ USER LIST */}
      <div style={{ marginTop: 10 }}>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              background: theme.cardBg,
              padding: 15,
              borderRadius: 10,
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img
                src={u.profile_picture}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt=""
              />

              <div>
                <strong style={{ fontSize: 16 }}>{u.username}</strong>
                <p style={{ color: theme.muted, margin: 0 }}>{u.email}</p>
                <p style={{ color: theme.green, margin: 0 }}>{u.phone}</p>
              </div>
            </div>

            <button
              onClick={() => deleteUser(u.id)}
              style={{
                padding: "8px 12px",
                background: "#ff4d4d",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default UsersList;
