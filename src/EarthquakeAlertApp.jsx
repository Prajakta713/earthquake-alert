// EarthquakeAlertApp.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const EarthquakeAlertApp = () => {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      )
        .then((res) => res.json())
        .then((data) => {
          const quakeData = data.features.map((quake) => ({
            id: quake.id,
            place: quake.properties.place,
            magnitude: quake.properties.mag,
            time: new Date(quake.properties.time).toLocaleString(),
            coords: {
              lat: quake.geometry.coordinates[1],
              lng: quake.geometry.coordinates[0],
            },
          }));
          const sortedData = quakeData.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          );
          setEarthquakes(sortedData);
        });
    };

    fetchData(); // initial fetch

    const interval = setInterval(fetchData, 5 * 60 * 1000); // refresh every 5 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const customIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4 font-sans text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6">
        🌍 Earthquake Alerts (Past 24 Hours)
      </h1>

      {earthquakes.length > 0 && (
        <div className="bg-red-50 border border-red-300 p-5 rounded-2xl shadow-md max-w-xs w-full mb-8">
          <h2 className="text-2xl font-semibold text-red-700 mb-3 flex justify-center items-center gap-2">
            <span>🔴</span> Most Recent Earthquake
          </h2>
          <p className="text-gray-800 leading-relaxed break-words">
            <strong>Location:</strong> {earthquakes[0].place}
            <br />
            <strong>Magnitude:</strong> {earthquakes[0].magnitude}
            <br />
            <strong>Time:</strong> {earthquakes[0].time}
          </p>
        </div>
      )}

      <div
        className="rounded-3xl overflow-hidden shadow-xl w-full max-w-4xl"
        style={{ height: "50vh", minHeight: 300 }}
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {earthquakes.map((quake) => (
            <Marker
              key={quake.id}
              position={[quake.coords.lat, quake.coords.lng]}
              icon={customIcon}
            >
              <Popup>
                <strong>{quake.place}</strong>
                <br />
                Magnitude: {quake.magnitude}
                <br />
                Time: {quake.time}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default EarthquakeAlertApp;
