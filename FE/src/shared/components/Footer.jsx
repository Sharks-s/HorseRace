import "./Footer.css";

export function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-logo">HorseRace Management</div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} HorseRace System (SU26SWP02). Hệ thống
          quản lý giải đua ngựa MVP.
        </div>
        <div className="footer-links">
          <a href="#/terms">Quy định giải đấu</a>
          <span className="separator">|</span>
          <a href="#/privacy">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
}
