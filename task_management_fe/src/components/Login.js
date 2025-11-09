import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage(`✅ Logged in as ${res.data.user.username}`);

      const role = res.data.user.role.toLowerCase();

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "manager") navigate("/manager-dashboard");
      else if (role === "intern") navigate("/intern-dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid email or password");
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
        fontFamily: "Inter, system-ui",
        color: theme.textLight,
        padding: 20,
      }}
    >
      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: theme.cardBg,
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 8px 25px rgba(0,0,0,0.55)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Login</h2>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputBox}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputBox}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              marginTop: 10,
              background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: 15, color: theme.muted }}>{message}</p>

        {/* REGISTER LINK */}
        <p style={{ marginTop: 20 }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: theme.blue,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputBox = {
  width: "94%",
  padding: 12,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111827",
  color: "#fff",
  fontSize: 14,
};

export default Login;
