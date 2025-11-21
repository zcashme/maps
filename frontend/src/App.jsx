import { useState } from "react";
import MapView from "./components/MapView";
import RightPanel from "./components/RightPanel";
import HeaderBar from "./components/HeaderBar";

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [clusters, setClusters] = useState([]);

  const closePanel = () => setSelectedCity(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
  };

  const isLight = document.documentElement.classList.contains("light");

  return (
    <>
      <HeaderBar
        clusters={clusters}
        theme={isLight ? "light" : "dark"}
        onToggleTheme={toggleTheme}
      />

      <div className={`slide-container ${selectedCity ? "open" : ""}`}>
        <div className="map-box">
          <MapView
            onCitySelect={setSelectedCity}
            onDataLoaded={setClusters}
          />
        </div>

        <RightPanel city={selectedCity} onClose={() => setSelectedCity(null)} />
      </div>
    </>
  );
}
