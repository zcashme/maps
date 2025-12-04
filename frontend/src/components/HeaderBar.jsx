import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Leaderboard from "./Leaderboard";
import "./HeaderBar.css";

export default function HeaderBar() {
  return (
    <header className="header-bar">
      <div className="branding">
        <Link to="/" className="brand-link">
{/* Logo removed */}
<span className="brand-text">maps.zcash.me</span>
</Link>
      </div>

      <div className="header-right">
        <Leaderboard />
        <ThemeToggle />
      </div>
    </header>
  );
}
