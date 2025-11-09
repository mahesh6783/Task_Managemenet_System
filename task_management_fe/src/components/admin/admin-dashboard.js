import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../logout";

function AdminDashboard() {
  const token = localStorage.getItem("access");
  
  const navigate = useNavigate();

  const [summary, setSummary] = useState({});
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "manager",
  });

  const theme = {
    dark: "#0b0f1a",
    purple: "#6a39f7",
    blue: "#2bb5ff",
    green: "#2ecc71",
    cardBg: "#0f1724",
    textLight: "#ffffff",
    muted: "#9aa4b2",
  };

 
  useEffect(() => {
    if (!token) return navigate("/");

    axios
      .get("http://127.0.0.1:8000/api/admin/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
         
        setSummary(res.data.summary);
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      });
  }, [navigate, token]);

  // ✅ Handle Form Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add New User
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post("http://127.0.0.1:8000/api/admin/add-user/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage("✅ User Added Successfully");
        setFormData({
          username: "",
          email: "",
          password: "",
          phone: "",
          role: "",
        });
      })
      .catch(() => setMessage("❌ Failed to Add User"));
  };

  return (
   <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
        color: theme.textLight,
        padding: 20,
      }}>
  

        {/* ✅ HEADER (Same as Intern Dashboard) */}
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
                <span style={{ color: theme.purple, fontWeight: 700, fontSize: 18 }}>
                  {profile.username ? profile.username.charAt(0).toUpperCase() : "A"}
                </span>
              )}
            </div>

            <div>
              <strong style={{ fontSize: 18 }}>
                {profile.username || "Admin"}
              </strong>
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
              to="/admin-profile"
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
              Profile
            </Link>
            <Link
              to="/admin-users"
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
              Users
            </Link>
            <Link
              to="/chatbot"
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
              Open ChatBoat
            </Link>

            <LogoutButton />
          </div>
        </header>

        {/* ✅ SUMMARY CARDS */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Total Admins", value: summary.admin_count, color: theme.blue },
            { label: "Total Managers", value: summary.manager_count, color: theme.purple },
            { label: "Total Interns", value: summary.intern_count, color: theme.green },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: 20,
                borderRadius: 12,
                background: theme.cardBg,
                borderLeft: `4px solid ${item.color}`,
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                minWidth: 200,
              }}
            >
              <p style={{ color: theme.muted }}>{item.label}</p>
              <h2 style={{ color: "#fff" }}>{item.value || 0}</h2>
            </div>
          ))}
        </div>

        {/* ✅ MAIN GRID */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          
          {/* ✅ LEFT: ADD USER */}
          <div
            style={{
              background: theme.cardBg,
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
              flex: 2,
              minWidth: 350,
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: 15 }}>Add New User</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                
                onChange={handleChange}
                required
                className="form-control mb-3"
                style={forms}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                
                onChange={handleChange}
                required
                className="form-control mb-3"
               style={forms}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                 
                onChange={handleChange}
                required
                className="form-control mb-3"
                style={forms}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                
                onChange={handleChange}
                className="form-control mb-3"
                style={forms}
              />

              <select
                name="role"
                 
                onChange={handleChange}
                className="form-control mb-3"
                style={forms}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="intern">Intern</option>
              </select>

              <button className="btn btn-primary w-100" type="submit"
              style={{
                marginTop: "20px",
                padding: "8px 14px",
                borderRadius: 8,
                background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
                textDecoration: "none",
                color: theme.textLight,
                fontWeight: 600,
              }}>
                Add User
              </button>
            </form>

            <p style={{ marginTop: 15, color: theme.muted }}>{message}</p>
          </div>

          {/* ✅ RIGHT: ADMIN PROFILE */}
          <div
            style={{
              background: theme.cardBg,
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
              flex: 1,
              minWidth: 320,
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: 15 }}>Admin Profile</h3>

            <img
              src={profile.profile_picture}
              alt="profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #333",
                marginBottom: 15,
              }}
            />

            <p style={{ color: "#fff", fontSize: 18 }}>{profile.username}</p>
            <p style={{ color: theme.muted }}>{profile.email}</p>
            <p style={{ color: theme.muted }}>{profile.phone}</p>
            <p style={{ color: theme.green }}>Role: {profile.role}</p>
          </div>
        </div>

   
      </div>
 
  );
}

const forms={
    width: "97%",
  padding: 12,
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111827",
  color: "#fff",
  fontSize: 14,
};
export default AdminDashboard;
