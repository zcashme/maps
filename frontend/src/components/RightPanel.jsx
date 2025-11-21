export default function RightPanel({ city, onClose }) {
  return (
    <aside className="right-panel">
      
      {/* Header */}
      <div className="panel-header">
        <h2>{city ? city.city : "Click a city"}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-body">
        {!city && (
          <p>Select a marker to view users</p>
        )}

        {city && (
          <>
            <p className="meta">{city.country} • {city.count} users</p>

            <h3>Users</h3>

            <ul className="user-list">
              {city.users.map((u, i) => (
                <li key={i} className="user-item">{u}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}
