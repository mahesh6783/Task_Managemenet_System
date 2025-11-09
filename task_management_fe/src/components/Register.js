import React, { useState } from "react";
import axios from "axios";

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "intern",
    profile_picture: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "profile_picture") {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone", formData.phone);
    data.append("role", formData.role);
    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }

    try {
      await axios.post("http://127.0.0.1:8000/register/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Registered successfully! You can now log in.");

      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "intern",
        profile_picture: null,
      });
    } catch (err) {
      setMessage("❌ Registration failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
        color: theme.textLight,
        padding: 20,
        fontFamily: "Inter, system-ui",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 450,
          background: theme.cardBg,
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 8px 25px rgba(0,0,0,0.55)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Register</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={inputBox}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputBox}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputBox}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            style={inputBox}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              ...inputBox,
              padding: 12,
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="intern">Intern</option>
          </select>

          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleChange}
            style={inputBox}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
              color: "#fff",
              fontWeight: 600,
              border: "none",
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: 20, color: theme.muted }}>{message}</p>
      </div>
    </div>
  );
}

const inputBox = {
  width: "94%",
  padding: 12,
  marginTop: 12,
  marginBottom: 4,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111827",
  color: "#fff",
  fontSize: 14,
};

export default Register;
