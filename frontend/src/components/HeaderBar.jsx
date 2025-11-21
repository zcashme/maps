import ThemeToggle from "./ThemeToggle";

export default function HeaderBar({ clusters = [], theme, onToggleTheme }) {
  const top3 = [...clusters].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <header className="header-bar">
      <div className="leaderboard">
        <h3>Top Cities</h3>

        <ol className="leader-list">
          {top3.map((c, i) => (
            <li key={c.city}>
              <span className="rank">{i + 1}.</span>
              <span className="city">{c.city}</span>
              <span className="count">{c.count}</span>
            </li>
          ))}

          {top3.length === 0 && (
            <li>No data available</li>
          )}
        </ol>
      </div>

      <div className="header-right">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
