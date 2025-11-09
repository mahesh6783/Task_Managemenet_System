import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const theme = {
  dark: "#0b0f1a",
  purple: "#6a39f7",
  blue: "#2bb5ff",
  cardBg: "#0f1724",
  textLight: "#ffffff",
  muted: "#9aa4b2",
};

function InternProfileEditUI() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    profile_picture: "",
    profile_picture_file: null,
    new_password: "",
  });

  // ✅ Load profile
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return navigate("/");

    fetch("http://127.0.0.1:8000/api/intern/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile((prev) => ({
          ...prev,
          username: data.username,
          email: data.email,
          phone: data.phone,
          profile_picture: data.profile_picture, // backend URL
        }));
      })
      .catch(console.error);
  }, [navigate]);

  // ✅ Image Preview on Select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    setProfile({
      ...profile,
      profile_picture: previewURL,
      profile_picture_file: file,
    });
  };

  // ✅ Submit changes
  const updateProfile = async () => {
    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);

    if (profile.new_password.trim() !== "") {
      formData.append("new_password", profile.new_password);
    }

    if (profile.profile_picture_file) {
      formData.append("profile_picture", profile.profile_picture_file);
    }

    const res = await fetch("http://127.0.0.1:8000/api/intern/profile/update/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile Updated Successfully!");
      navigate("/intern-profile");
    } else {
      alert("Update failed!");
      console.log(data);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* ✅ Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Link
            to="/intern-profile"
            style={{
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

          <h2>Edit Profile</h2>
        </header>

        {/* ✅ Card */}
        <div
          style={{
            background: theme.cardBg,
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
          }}
        >
          {/* ✅ Profile Picture */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 120,
                height: 120,
                margin: "auto",
                borderRadius: 12,
                overflow: "hidden",
                border: `3px solid ${theme.purple}`,
                background: "#111827",
              }}
            >
              <img
                src={profile.profile_picture}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <input
              type="file"
              style={{ marginTop: 10 }}
              onChange={handleImageChange}
            />
          </div>

          {/* ✅ Form Fields */}
          <form>
            <label style={label}>Username</label>
            <input
              type="text"
              style={inputBox}
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
            />

            <label style={label}>Email</label>
            <input
              type="text"
              style={inputBox}
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <label style={label}>Phone</label>
            <input
              type="text"
              style={inputBox}
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <label style={label}>New Password (optional)</label>
            <input
              type="password"
              style={inputBox}
              value={profile.new_password}
              onChange={(e) =>
                setProfile({ ...profile, new_password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={updateProfile}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                marginTop: 20,
                background: `linear-gradient(90deg, ${theme.purple}, ${theme.blue})`,
                color: theme.textLight,
                fontWeight: 600,
                border: "none",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
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

const inputBox = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111827",
  color: "#fff",
};

const label = {
  marginBottom: 4,
  display: "block",
  color: theme.muted,
};

export default InternProfileEditUI;
