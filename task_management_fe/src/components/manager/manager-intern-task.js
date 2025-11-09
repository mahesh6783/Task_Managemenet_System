import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../logout";
import axios from "axios";

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  green: "#2ecc71",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

export default function ManagerInternTask() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [internDetails, setInternDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  

  const [user] = useState({
    username: "Manager",
    role: "manager",
    profile_picture: null,
  });

  // ✅ Load interns list
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/interns/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInterns(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      });
  }, []);

  // ✅ When selecting intern

  const deleteTask = async (taskId) => {
  if (!window.confirm("Are you sure you want to delete this task?")) return;

  try {
    const res = await fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Task deleted successfully");
      setTasks(tasks.filter((t) => t.id !== taskId)); // remove from UI
    } else {
      alert("Failed to delete task");
    }
  } catch (error) {
    alert("Error deleting task");
  }
};
  const handleSelect = (id) => {
    setSelectedIntern(id);

    axios
      .get(`http://127.0.0.1:8000/api/intern/${id}/details/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInternDetails(res.data.intern);
        setTasks(res.data.tasks);
        setProfile(res.data.profile_picture);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.clear();
          navigate("/");
        }
    



      });







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
      {/* ✅ SAME HEADER */}
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
            to="/manager-dashboard"
            style={navButton}
          >
            Dashboard
          </Link>

          <Link
            to="/intern-profile"
            style={navButton}
          >
            Profile
          </Link>

          <LogoutButton />
        </div>
      </header>

      {/* PAGE TITLE */}
      <h2 style={{ marginBottom: 20 }}>Intern Task Summary</h2>

      {/* ✅ Select Intern */}
      <select
        value={selectedIntern}
        onChange={(e) => handleSelect(e.target.value)}
        style={selectBox}
      >
        <option value="">Select Intern</option>
        {interns.map((i) => (
          <option key={i.id} value={i.id}>
            {i.username}
          </option>
        ))}
      </select>

      {/* ✅ Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        {/* ✅ LEFT — TASKS */}
        <div
  style={{
    background: theme.cardBg,
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
  }}
>
  <h3>Assigned Tasks</h3>

  {tasks.length === 0 ? (
    <p style={{ color: theme.muted }}>No tasks found.</p>
  ) : (
    <table
  className="table table-dark table-striped mt-3"
  style={{
    background: "#111827",
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #fff",
  }}
>
  <thead>
    <tr>
      <th style={{ color: "#fff" }}>Title</th>
      <th style={{ color: "#fff" }}>Description</th>
      <th style={{ color: "#fff" }}>Dead Line</th>
      <th style={{ color: "#fff" }}>Status</th>
      <th style={{ color: "#fff" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {tasks.map((t) => (
      <tr key={t.id}>
        <td style={{ color: "#fff", padding: "10px" }}>{t.title}</td>
        <td style={{ color: "#fff", padding: "10px" }}>{t.description}</td>
        <td style={{ color: "#fff", padding: "10px" }}>{t.deadline}</td>
        <td style={{ color: "#fff", padding: "10px" }}>{t.status}</td>

        {/* ✅ DELETE BUTTON HERE */}
        <td style={{ padding: "10px" }}>
          <button
            onClick={() => deleteTask(t.id)}
            style={{
              background: "#dc2626",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  )}
</div>


        {/* ✅ RIGHT — INTERN DETAILS */}
        <div
          style={{
            background: theme.cardBg,
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
          }}
        >
          <h3>Intern Details</h3>

          {!internDetails ? (
            <p style={{ color: theme.muted }}>Select an intern.</p>
          ) : (
            <>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <img
                  src={internDetails.profile_picture1}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <p><b>Name:</b> {internDetails.username}</p>
              <p><b>Email:</b> {internDetails.email}</p>
              <p><b>Phone:</b> {internDetails.phone}</p>
             
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const selectBox = {
  width: "250px",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111827",
  color: "#fff",
};

const navButton = {
  marginTop: "20px",
  padding: "8px 14px",
  borderRadius: 8,
  background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
  textDecoration: "none",
  color: theme.textLight,
};

