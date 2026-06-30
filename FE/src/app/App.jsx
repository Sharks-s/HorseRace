import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { MainLayout } from "../shared/components/MainLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import HorseRaceApp from "../pages/LandingPage";
import AdminLayout from "../shared/components/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsersPage from "../features/admin/pages/UserManagementPage";
import TournamentManagementPage from "../features/admin/pages/TournamentManagementPage";
import HiringPage from "../features/owner/pages/HiringPage";
import InvitationPage from "../features/jockey/pages/InvitationPage";
import HorseManagementPage from "../features/owner/pages/HorseManagementPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import HorseReviewPage from "../features/admin/pages/HorseReviewPage";
import JockeyWorkspacePage from "../features/jockey/pages/JockeyWorkspacePage";
import RefereeDashboard from "../features/referee/pages/RefereeDashboard";
import ViolationPage from "../features/referee/pages/ViolationPage";
import ReportFormPage from "../features/referee/pages/ReportFormPage";
import AdminResultPage from "../features/admin/pages/AdminResultPage";
import PublicSchedulePage from "../features/spectator/pages/PublicSchedulePage";
import LiveResultPage from "../features/spectator/pages/LiveResultPage";
import "../styles/fonts.css";
import "../styles/theme.css";
import "../styles/globals.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/tournaments" element={<TournamentManagementPage />} />
            <Route path="/admin/horses" element={<HorseReviewPage />} />
            <Route path="/admin/results" element={<AdminResultPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/owner" element={<HorseManagementPage />} />
            <Route path="/owner/horses" element={<HorseManagementPage />} />
            <Route path="/owner/hiring" element={<HiringPage />} />
            <Route path="/jockey" element={<JockeyWorkspacePage />} />
            <Route path="/jockey/workspace" element={<JockeyWorkspacePage />} />
            <Route path="/jockey/invitations" element={<InvitationPage />} />
            <Route path="/referee" element={<RefereeDashboard />} />
            <Route path="/referee/pre-race" element={<RefereeDashboard />} />
            <Route path="/referee/violations" element={<ViolationPage />} />
            <Route path="/referee/report" element={<ReportFormPage />} />
          </Route>
        </Route>

        {/* Public Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HorseRaceApp />} />
          <Route path="/schedule" element={<PublicSchedulePage />} />
          <Route path="/live" element={<LiveResultPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

