import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { MainLayout } from "../shared/components/MainLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import HorseRaceApp from "../pages/LandingPage";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import TournamentManagementPage from "../features/admin/pages/TournamentManagementPage";
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

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tournaments" element={<TournamentManagementPage />} />
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
