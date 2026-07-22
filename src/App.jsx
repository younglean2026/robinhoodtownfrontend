import { Routes, Route, Link, useLocation } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Play from "./pages/Play.jsx";
import Docs from "./pages/Docs.jsx";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <nav className="topbar">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="RobinHood Town" className="logo-img" />
        </Link>
        <div className="topbar-links">
          <Link to="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link to="/play" className={pathname === "/play" ? "active" : ""}>
            Play
          </Link>
          <Link to="/docs" className={pathname === "/docs" ? "active" : ""}>
            Docs
          </Link>
          <a href="https://x.com/playrhtown" target="_blank" rel="noreferrer" title="Follow on X">
            𝕏
          </a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/play" element={<Play />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
      <footer className="footer">
        <span>RobinHood Town — built on Robinhood Chain (chainId 4663)</span>
        <span className="footer-links">
          <Link to="/docs">Docs</Link>
          <a href="https://x.com/playrhtown" target="_blank" rel="noreferrer">
            𝕏
          </a>
          <a href="https://t.me/playrhtown" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </span>
      </footer>
    </div>
  );
}
