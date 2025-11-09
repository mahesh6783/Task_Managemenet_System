import React from "react";
import axios from "axios";

function LogoutButton() {
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      await axios.post("http://127.0.0.1:8000/logout/", {
        refresh_token: refresh,
      });

      // Clear user session data
      localStorage.clear();

      alert("Logged out successfully!");
      window.location.href = "/"; // redirect
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#9b5de5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
