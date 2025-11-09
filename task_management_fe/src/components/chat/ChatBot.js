import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../logout";

const Chatbot = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    role: "",
    profile_picture: null,
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const API_URL = "http://127.0.0.1:8000/api/chatbot/";
  const DASHBOARD_URL = "http://127.0.0.1:8000/api/botprofile/";
  const token = localStorage.getItem("access");

  // ✅ Fetch user details
  useEffect(() => {
    if (!token) return navigate("/");

    fetch(DASHBOARD_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setUser({
          username: data.username,
          role: data.role,
          profile_picture: data.profile_picture || null,
        });
      })
      .catch((err) => console.error("User Fetch Error:", err));
  }, [navigate, token]);

  // ✅ Auto-scroll when new messages come
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const downloadPDF = async () => {
  try {
    const token = localStorage.getItem("access");

    const res = await fetch("http://127.0.0.1:8000/api/download-chat/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Download failed: Unauthorized");
      return;
    }

    // Convert to Blob (PDF)
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.pdf";
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("PDF Download Error:", err);
  }
};




  // ✅ Send message function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { role: "user", message: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { role: "bot", message: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot Error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      
      {/* ✅ TOP NAVBAR */}
      <header style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.avatarBox}>
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="profile" style={styles.avatar} />
            ) : (
              <span style={{ color: "#6a39f7", fontWeight: 700 }}>
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>

          <div>
            <strong>{user.username}</strong>
            <div style={styles.role}>{user.role}</div>
          </div>
        </div>

        <div style={styles.navRight}>
          {user.role === "intern" ? (
            <> 
              <Link to="/intern-dashboard" style={styles.navBtn}>
                  Dashboard
              </Link>
            </>
          ) : user.role === "admin" ? (
            <> 
              <Link to="/admin-dashboard" style={styles.navBtn}>
                  Dashboard
              </Link>
            </>
          ) : user.role === "manager" ? (
            <> 
              <Link to="/manager-dashboard" style={styles.navBtn}>
                 Dashboard
              </Link>
            </>
          ) : (
            <>
              <LogoutButton />
            </>
          )}
          <LogoutButton />
        </div>
      </header>

      <div style={styles.container}>

        {/* ✅ LEFT PROFILE PANEL */}
        <div style={styles.left}>
          <img
            src={user.profile_picture || "https://via.placeholder.com/120"}
            alt="Profile"
            style={styles.photo}
          />
          <h3>{user.username}</h3>

         <button
  style={styles.pdfBtn}
  onClick={downloadPDF}
>
  Download PDF
</button>
        </div>

        {/* ✅ RIGHT CHAT PANEL */}
        <div style={styles.right}>
          <div style={styles.chatArea}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#6C5CE7" : "#241E92",
                }}
              >
                {msg.message}
              </div>
            ))}

            {loading && <div style={styles.loading}>Typing...</div>}

            <div ref={chatEndRef}></div>
          </div>

          {/* ✅ FIXED INPUT BAR (BOTTOM FIXED INSIDE CHAT PANEL) */}
          <form onSubmit={sendMessage} style={styles.inputBar}>
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />
            <button style={styles.sendBtn}>Send</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Chatbot;



/* ✅ ✅ UPDATED STYLES */
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    background: "#050A20",
    color: "white",
    overflow: "hidden",
  },

  nav: {
    height: 70,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    background: "#0f1724",
    borderBottom: "1px solid #1e293b",
  },

  navLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "#111827",
    border: "2px solid #6a39f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatar: { width: "100%", height: "100%", objectFit: "cover" },

  role: { fontSize: 12, color: "#9aa4b2", textTransform: "uppercase" },

  navRight: { display: "flex", gap: 12, alignItems: "center" },

  navBtn: {
    marginTop: "20px",
    padding: "8px 14px",
    background: "linear-gradient(90deg, #6a39f7, #2bb5ff)",
    borderRadius: 8,
    textDecoration: "none",
    color: "white",
    fontWeight: 600,
  },

  container: {
    flex: 1,
    display: "flex",
    gap: 20,
    padding: 20,
    overflow: "hidden",
  },

  left: {
    width: "28%",
    background: "#0D0D0D",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    position: "sticky",
    top: 90,
    height: "fit-content",
  },

  photo: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    marginBottom: 15,
  },

  pdfBtn: {
    padding: "12px 16px",
    background: "#6C5CE7",
    border: "none",
    width: "100%",
    borderRadius: 10,
    cursor: "pointer",
    color: "white",
  },

  right: {
    width: "72%",
    background: "#0D0D0D",
    borderRadius: 12,
    padding: 0,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  chatArea: {
    flex: 1,
    padding: 15,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    height: "calc(100vh - 200px)", // ✅ Allows scrolling
  },

  msg: {
    padding: "10px 14px",
    borderRadius: 14,
    maxWidth: "70%",
    color: "white",
  },

  loading: { fontStyle: "italic", color: "#6C5CE7" },

  /* ✅ FIXED INPUT BAR INSIDE CHAT PANEL */
  inputBar: {
    position: "sticky",
    bottom: 0,
    padding: 12,
    background: "#0D0D0D",
    borderTop: "1px solid #2e2e2e",
    display: "flex",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#1E1E1E",
    color: "white",
  },

  sendBtn: {
    padding: "12px 20px",
    background: "#6C5CE7",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    color: "white",
  },
};
