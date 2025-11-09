import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../logout";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  green: "#2ecc71",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

function ManagerDashboard() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedIntern, setSelectedIntern] = useState("team");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assigned_user: "",
    deadline: "",
  });

  const [user] = useState({
    username: "Manager",
    role: "manager",
    profile_picture: null,
  });

  const token = localStorage.getItem("access");

  // ✅ Load Dashboard Data
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/manager/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInterns(res.data.interns || []);
        setSummary(res.data.summary || {});
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      });
  }, [navigate, token]);

  // ✅ Assign Task
  const handleAssign = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/manager/assign-task/", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("✅ Task assigned!");
        setTaskData({
          title: "",
          description: "",
          assigned_user: "",
          deadline: "",
        });
      })
      .catch(() => alert("❌ Failed to assign task."));
  };

  // ✅ ✅ FIXED — Change Summary on Select (Team/Intern)
  const handleSummaryChange = (value) => {
    setSelectedIntern(value);

    const url =
      value === "team"
        ? "http://127.0.0.1:8000/api/manager/summary/"
        : `http://127.0.0.1:8000/api/manager/summary/${value}/`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSummary(res.data)) // ✅ FIXED
      .catch(console.error);
  };

  // ✅ Pie Chart Data
  const pieData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          summary.pending || 0,
          summary.in_progress || 0,
          summary.completed || 0,
        ],
        backgroundColor: [theme.blue, theme.purple, theme.green],
        borderColor: theme.dark,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
        color: theme.textLight,
        padding: 20,
      }}
    >
      {/* HEADER */}
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
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{ color: theme.purple, fontWeight: 700, fontSize: 18 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <strong style={{ fontSize: 18 }}>{user.username}</strong>
            <div
              style={{
                fontSize: 12,
                color: theme.muted,
                textTransform: "uppercase",
              }}
            >
              {user.role}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
            <Link
            to="/manager-intern-task"
            style={{
                marginTop: "20px",
              padding: "8px 14px",
              borderRadius: 8,
              background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
              textDecoration: "none",
              color: theme.textLight,
            }}
          >
            Interns
          </Link>
          <Link
            to="/manager-profile"
            style={{
                marginTop: "20px",
              padding: "8px 14px",
              borderRadius: 8,
              background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
              textDecoration: "none",
              color: theme.textLight,
            }}
          >
            Profile
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
            }}
          >
            Open Chatbot
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
          { label: "Pending", value: summary.pending || 0, color: theme.blue },
          {
            label: "In Progress",
            value: summary.in_progress || 0,
            color: theme.purple,
          },
          {
            label: "Completed",
            value: summary.completed || 0,
            color: theme.green,
          },
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
            }}
          >
            <p style={{ color: theme.muted }}>{item.label}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* ✅ 2 Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
        }}
      >
        {/* ✅ Assign Task Form */}
        <section
          style={{
            background: theme.cardBg,
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
          }}
        >
          <h3>Assign Task</h3>

          <form onSubmit={handleAssign}>
            <span style={label}>Task Title</span>
            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              style={inputBox}
              required
            />

            <span style={label}>Task Description</span>
            <textarea
              placeholder="Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              style={{ ...inputBox, height: 100 }}
            />

            <span style={label}>Select Intern</span>
            <select
              value={taskData.assigned_user}
              onChange={(e) =>
                setTaskData({ ...taskData, assigned_user: e.target.value })
              }
              style={inputBox}
              required
            >
              <option value="">Select Intern</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.username}
                </option>
              ))}
            </select>

            <span style={label}>Deadline</span>
            <input
              type="datetime-local"
              value={taskData.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
              style={inputBox}
              required
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
                border: "none",
                color: "#fff",
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              Assign Task
            </button>
          </form>
        </section>

        {/* ✅ Task Summary Chart */}
        <aside
          style={{
            background: theme.cardBg,
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <select
              value={selectedIntern}
              onChange={(e) => handleSummaryChange(e.target.value)}
              style={inputBox}
            >
              <option value="team">Team Summary</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.username}
                </option>
              ))}
            </select>
          </div>

          <h4 style={{ marginBottom: 12 }}>
            {selectedIntern === "team"
              ? "Team Task Summary"
              : "Intern Task Summary"}
          </h4>

          <Pie data={pieData} />
        </aside>
      </div>
    </div>
  );
}

const inputBox = {
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

const label = {
  color: theme.muted,
  fontWeight: 600,
};

export default ManagerDashboard;
