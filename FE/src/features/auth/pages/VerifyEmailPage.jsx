import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../service/auth.service";
import { toast } from "../../../shared/components/Toast";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(() => (token ? "loading" : "error"));

  useEffect(() => {
    if (!token) {
      toast.error("Thiếu mã xác nhận email.");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        if (!isMounted) {
          return;
        }
        setStatus("success");
        toast.success("Xác nhận email thành công. Vui lòng đăng nhập.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatus("error");
        toast.error(
          error.response?.data?.message ||
            error.response?.data ||
            "Xác nhận email thất bại.",
        );
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(0,148,136,0.15), transparent 30%), linear-gradient(135deg, #08111f, #0f172a 55%, #11203b)",
        color: "white",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(15,23,42,0.72)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          padding: "32px",
          backdropFilter: "blur(18px)",
        }}
      >
        <p style={{ margin: 0, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px" }}>
          Email Verification
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: "32px", lineHeight: 1.1 }}>
          {status === "loading" && "Đang xác nhận tài khoản"}
          {status === "success" && "Xác nhận thành công"}
          {status === "error" && "Xác nhận thất bại"}
        </h1>
        <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
          {status === "loading" && "Hệ thống đang kiểm tra liên kết xác nhận email của bạn."}
          {status === "success" && "Tài khoản đã được kích hoạt. Bạn sẽ được chuyển sang trang đăng nhập trong giây lát."}
          {status === "error" && "Liên kết xác nhận không hợp lệ hoặc đã hết hạn."}
        </p>
        <div
          style={{
            marginTop: "24px",
            height: "4px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: status === "loading" ? "45%" : "100%",
              height: "100%",
              background: status === "success" ? "#2dd4bf" : status === "error" ? "#f87171" : "linear-gradient(90deg, #2dd4bf, #009488)",
              animation: status === "loading" ? "pulse 1.2s ease-in-out infinite" : "none",
            }}
          />
        </div>
        {status === "error" && (
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "24px",
              width: "100%",
              border: "none",
              borderRadius: "14px",
              background: "#2dd4bf",
              color: "#06221f",
              fontWeight: 800,
              padding: "14px 18px",
              cursor: "pointer",
            }}
          >
            Đi đến trang đăng nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;