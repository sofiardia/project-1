import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfileDetails from "./pages/ProfileDetails";
import Preview from "./pages/Preview";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/preview" element={<Preview />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileDetails />} /> {/* 👈 MUST MATCH */}
      </Routes>
    </BrowserRouter>
  );
}