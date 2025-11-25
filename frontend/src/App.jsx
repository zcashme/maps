import { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import MapView from "./components/MapView";
import RightPanel from "./components/RightPanel";
import HeaderBar from "./components/HeaderBar";
import FilterBar from "./components/FilterBar";
import { useCityClusters } from "./hooks/useCityClusters";
import { toSlug, fromSlug } from "./utils/slugs";

function MapPage() {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const { data: clusters, loading, error } = useCityClusters();

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  // Sync URL with State
  useEffect(() => {
    if (loading) return;

    if (citySlug) {
      const city = fromSlug(citySlug, clusters);
      if (city) {
        setSelectedCity(city);
        setSelectedFilter(city.city);
      } else {
        // Invalid slug, redirect to home
        navigate("/", { replace: true });
      }
    } else {
      setSelectedCity(null);
      setSelectedFilter("ALL");
    }
  }, [citySlug, clusters, loading, navigate]);

  const filteredClusters = useMemo(() => {
    if (selectedFilter === "ALL") return clusters;
    return clusters.filter(c => c.city === selectedFilter);
  }, [clusters, selectedFilter]);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  });

  const closePanel = () => {
    navigate("/");
  };

  const handleFilterSelect = (filter) => {
    if (filter === "ALL") {
      navigate("/");
    } else {
      navigate(`/${toSlug(filter)}`);
    }
  };

  const handleMarkerClick = (city) => {
    navigate(`/${toSlug(city.city)}`);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "light" : "dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <HeaderBar
        clusters={clusters}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <FilterBar
        clusters={clusters}
        selectedFilter={selectedFilter}
        onFilterSelect={handleFilterSelect}
      />

      <div className={`slide-container ${selectedCity ? "open" : ""}`}>
        <div className="map-box">
          <MapView
            clusters={filteredClusters}
            onCitySelect={handleMarkerClick}
            selectedFilter={selectedFilter}
            theme={theme}
          />
        </div>

        <RightPanel city={selectedCity} onClose={closePanel} isOpen={!!selectedCity} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/:citySlug" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
