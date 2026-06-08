import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { MainLayout } from "../shared/components/MainLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import HorseRaceApp from "../pages/LandingPage";
import AdminUsersPage from "../features/admin/pages/UserManagementPage";
import HorseManagementPage from "../features/owner/pages/HorseManagementPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import "../styles/fonts.css";
import "../styles/theme.css";
import "../styles/globals.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HorseRaceApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminUsersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/owner" element={<HorseManagementPage />} />
          <Route path="/owner/horses" element={<HorseManagementPage />} />
        </Route>

        {/* Public Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
