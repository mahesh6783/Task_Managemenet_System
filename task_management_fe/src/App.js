// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

import Interndashboard from "./components/intern/intern-dashboard";
import InternProfile from "./components/intern/intern-profile";
import InternProfileEdit from "./components/intern/intern-profile-edit";

import Managerdashboard from "./components/manager/manager-dashboard";
import ManagerInternTask from "./components/manager/manager-intern-task";
import ManagerProfile from "./components/manager/manager-profile";
import ManagerProfileEdit from "./components/manager/manager-profile-edit";

import Admindashboard from "./components/admin/admin-dashboard";
import AdminProfile from "./components/admin/admin-profile";
import AdminProfileEdit from "./components/admin/admin-profile-edit";
import AdminUsers from "./components/admin/admin-users";

import ChatBoat from "./components/chat/ChatBot";


import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/intern-dashboard" element={<ProtectedRoute allowedRole="intern"><Interndashboard /></ProtectedRoute>}/> 
        <Route path="/intern-profile" element={<ProtectedRoute allowedRole="intern"><InternProfile /></ProtectedRoute>}/> 
        <Route path="/intern-profile-edit" element={<ProtectedRoute allowedRole="intern"><InternProfileEdit /></ProtectedRoute>}/>

        <Route path="/manager-dashboard"  element={ <ProtectedRoute allowedRole="manager"> <Managerdashboard /> </ProtectedRoute>}/>
        <Route path="/manager-intern-task"  element={ <ProtectedRoute allowedRole="manager"> <ManagerInternTask /> </ProtectedRoute>}/>
        <Route path="/manager-profile" element={<ProtectedRoute allowedRole="manager"><ManagerProfile /></ProtectedRoute>}/>
        <Route path="/manager-profile-edit" element={<ProtectedRoute allowedRole="manager"><ManagerProfileEdit /></ProtectedRoute>}/>

        <Route  path="/admin-dashboard" element={  <ProtectedRoute allowedRole="admin"> <Admindashboard /> </ProtectedRoute> } />
        <Route path="/admin-profile" element={<ProtectedRoute allowedRole="admin"><AdminProfile /></ProtectedRoute>}/>
        <Route path="/admin-profile-edit" element={<ProtectedRoute allowedRole="admin"><AdminProfileEdit /></ProtectedRoute>}/>
        <Route path="/admin-users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>}/>

        <Route path="/chatbot"  element={<ProtectedRoute ><ChatBoat/></ProtectedRoute>}/>

        
      </Routes>
    </Router>
  );
}

export default App;
