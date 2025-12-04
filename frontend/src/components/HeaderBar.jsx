import { Link } from "react-router-dom";
import Leaderboard from "./Leaderboard";
import "./HeaderBar.css";
import ZcashGridButton from "./ZcashGridButton.jsx";

export default function HeaderBar() {
  return (
    <header className="header-bar">
      <div className="branding">
        <Link to="/" className="brand-link">
          {/* Logo removed */}
          <span className="brand-text text-blue-700 font-bold text-lg tracking-tight">
            maps.zcash.me
          </span>
        </Link>
      </div>

      <div className="header-right">
        <Leaderboard />

        {/* REPLACED ThemeToggle WITH ZcashGridButton */}
        <ZcashGridButton className="header-grid-button" />
      </div>
    </header>
  );
}
