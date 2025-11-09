import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../logout";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

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

function Interndashboard() {
  const navigate = useNavigate();

  



  const [user, setUser] =useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return navigate("/");

    fetch("http://127.0.0.1:8000/api/intern/dashboard/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;

        setTasks(data.tasks || []);
        setUser({
          username: data.username,
          role: data.role,
          profile_picture: data.profile_picture || null,
        });
      })
      .catch(err => console.error("Dashboard Error:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ Simple status count
  const statusCount = {
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  const updateStatus = (status,id) => {
    fetch(`http://127.0.0.1:8000/task/${id}/update-status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`
      },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOpen(false);
        window.location.reload(); // refresh tasks
      });
  };

  const pieData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          statusCount.pending,
          statusCount.in_progress,
          statusCount.completed,
        ],
        backgroundColor: [theme.blue, theme.purple, theme.green],
        borderColor: theme.dark,
        borderWidth: 2,
      },
    ],
  };

  const pageStyle = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
    color: theme.textLight,
    padding: 20,
    fontFamily: "Inter, system-ui, Arial",
  };
 
  const [open, setOpen] = useState(false);

  if (loading) return <div style={pageStyle}><p>Loading... <LogoutButton/></p></div>;


  return (
     <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${theme.dark} 0%, #071025 100%)`,
        color: theme.textLight,
        padding: 20,
      }}>

        {/* ✅ Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center"
        }}>
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
                <span style={{ color: theme.purple, fontWeight: 700, fontSize: 18 }}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <strong style={{ fontSize: 18 }}>{user.username}</strong>
              <div style={{ fontSize: 12, color: theme.muted, textTransform: "uppercase" }}>
                {user.role}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Link
              to="/intern-profile"
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
              Open Chatbot
            </Link>

            <LogoutButton />
          </div>
        </header>

        {/* ✅ Summary Cards */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Pending", value: statusCount.pending, color: theme.blue },
            { label: "In Progress", value: statusCount.in_progress, color: theme.purple },
            { label: "Completed", value: statusCount.completed, color: theme.green },
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

        {/* ✅ Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
        >
          {/* ✅ Tasks Table */}
          <section style={{
            background: theme.cardBg,
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)"
          }}>
            <h4 style={{ marginBottom: 16 }}>Assigned Tasks</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", color: theme.textLight }}>
              <thead>
                <tr style={{ background: "#111827" }}>
                  {["#", "Title", "Description", "Deadline", "Status", "Created By","Action "].map((h, i) => (
                    <th key={i} style={{ padding: 10, borderBottom: "1px solid #1f2937" }}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <tr key={task.id}>
                      <td style={{ padding: 10 }}>{i + 1}</td>
                      <td style={{ padding: 10 }}>{task.title}</td>
                      <td style={{ padding: 10 }}>{task.description || "—"}</td>
                      <td style={{ padding: 10 }}>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}
                      </td>

                      <td style={{ padding: 10 }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 8,
                            fontWeight: "bold",
                            background:
                              task.status === "completed"
                                ? theme.green
                                : task.status === "in_progress"
                                ? theme.purple
                                : theme.blue,
                            color: "#fff",
                          }}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </td>

                      <td style={{ padding: 10 }}>{task.created_by_name}</td>
                      <td style={{ position: "relative" }}>
        <span
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={() => setOpen(!open)}
        >
          ⋮
        </span>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "25px",
              right: "0",
              background: "black",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
          >
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => updateStatus("pending", task.id)}
            >
              Pending
            </div>
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => updateStatus("in_progress", task.id)}
            >
              In Progress
            </div>
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => updateStatus("completed", task.id)}
            >
              Completed
            </div>
          </div>
        )}
      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: 10, textAlign: "center" }}>
                      No tasks assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* ✅ Pie Chart */}
          <aside
            style={{
              background: theme.cardBg,
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)"
            }}
          >
            <h4 style={{ marginBottom: 16 }}>Task Summary Chart</h4>
            <Pie data={pieData} />
          </aside>
        </div>

    
      
    </div>
  );
}

export default Interndashboard;
