export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle}>
      {theme === "light" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
