import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = localStorage.getItem("user");

  if (!user) {
    // Không có user đăng nhập, chuyển hướng sang trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập, cho phép truy cập các route con
  return <Outlet />;
}
