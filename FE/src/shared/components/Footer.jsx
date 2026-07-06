import "./Footer.css";

export function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-logo">HorseRace Management</div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} HorseRace System (SU26SWP02). Systems
          for managing horse racing competitions.
        </div>
        <div className="footer-links">
          <a href="#/terms">Competition Rules</a>
          <span className="separator">|</span>
          <a href="#/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
