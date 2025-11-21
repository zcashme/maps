import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default function MapView({ onCitySelect, onDataLoaded }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("https://zcashme-map-api.trinath-panda-6cd.workers.dev/");
      const json = await res.json();

      setClusters(json);
      if (onDataLoaded) onDataLoaded(json);
    }
    load();
  }, []);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      worldCopyJump={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ClusterLayer clusters={clusters} onCitySelect={onCitySelect} />
    </MapContainer>
  );
}

function ClusterLayer({ clusters, onCitySelect }) {
  const map = useMap();

  useEffect(() => {
    if (!clusters.length) return;

    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    clusters.forEach((c) => {
      const marker = L.marker([c.lat, c.lon]);

      marker.bindPopup(`
        <div style="font-size:14px;">
          <strong>${c.city}</strong><br/>
          Users: ${c.count}
        </div>
      `);

      marker.on("click", () => {
        marker.openPopup();
        onCitySelect(c);
      });

      markers.addLayer(marker);
    });

    map.addLayer(markers);
    return () => map.removeLayer(markers);
  }, [clusters]);

  return null;
}
