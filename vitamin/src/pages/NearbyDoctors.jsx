import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar";
import medicineHeroBg from "../assets/login.jpg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const specialties = {
  "Vitamin A Deficiency": "ophthalmologist",
  "Vitamin B Deficiency": "general physician",
  "Vitamin C Deficiency": "dentist",
  "Vitamin D Deficiency": "orthopedic doctor",
  "Vitamin E Deficiency": "dermatologist"
};

const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function nearbyDoctorsApiUrl(queryString) {
  const base =
    process.env.REACT_APP_FLASK_URL ||
    (process.env.NODE_ENV === "development" ? "" : "http://127.0.0.1:5000");
  return `${base}/api/nearby-doctors?${queryString}`;
}

export default function NearbyDoctors() {
  const [vitamin, setVitamin] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [center, setCenter] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const searchNearby = async () => {
    if (!vitamin || !city || !stateName) {
      alert("Please fill all fields");
      return;
    }

    if (!GOOGLE_KEY) {
      alert("Google Maps API key not found!");
      return;
    }

    setLoading(true);
    setMsg("Searching…");
    setPlaces([]);
    setCenter(null);

    try {
      const specialty = specialties[vitamin];

      const geoURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        `${city}, ${stateName}, India`
      )}&key=${GOOGLE_KEY}`;

      const geoRes = await fetch(geoURL);
      const geoData = await geoRes.json();

      if (geoData.status !== "OK") {
        setMsg("City or area could not be located. Check spelling.");
        setLoading(false);
        return;
      }

      const lat = geoData.results[0].geometry.location.lat;
      const lng = geoData.results[0].geometry.location.lng;

      setCenter([lat, lng]);

      const qs = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        specialty,
        city,
        state: stateName
      });

      const placeRes = await fetch(nearbyDoctorsApiUrl(qs.toString()));

      let placeData = {};
      try {
        placeData = await placeRes.json();
      } catch {
        setMsg(
          "Invalid response from server. Restart React after proxy change, or run Flask on port 5000."
        );
        setLoading(false);
        return;
      }

      if (!placeRes.ok || placeData.error) {
        const detail =
          placeData.details ||
          placeData.error_message ||
          placeData.message ||
          placeData.error ||
          `HTTP ${placeRes.status}`;
        setMsg(`Request failed: ${detail}`);
        setLoading(false);
        return;
      }

      const results = (placeData.results || [])
        .filter(p => p.rating && p.rating >= 4)
        .slice(0, 20);

      setPlaces(results);

      setMsg(
        results.length
          ? `${results.length} highly rated clinics near ${city}`
          : "No clinics matched your filters (rating 4+). Try another area."
      );
    } catch (err) {
      console.error(err);
      setMsg(
        "Network error. Ensure Flask is running (vitamin/backend) and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const msgIsError = /failed|error|invalid|network/i.test(msg);
  const msgIsSuccess = places.length > 0 && !msgIsError;

  return (
    <>
      <Navbar />

      <div style={pageWrap}>
        {/* Full-bleed medicine hero + headline aligned with content below */}
        <div style={heroOuter}>
          <div
            aria-hidden
            style={{
              ...heroBgLayer,
              backgroundImage: `url(${medicineHeroBg})`
            }}
          />
          <div aria-hidden style={heroOverlay} />
          <div style={heroInner}>
            <header style={heroHead}>
              <span style={heroKickerPill}>Care near you</span>
              <h1 style={heroTitle}>Find Nearby Clinics & Doctors</h1>
            </header>
          </div>
        </div>

        <main style={contentShell}>
          <div style={searchCard}>
            <div style={searchCardHeader}>
              <span style={searchCardIcon}>🔍</span>
              <div>
                <h2 style={searchCardTitle}>Search</h2>
                <p style={searchCardHint}>
                  All fields required. Results show places rated 4★ or higher.
                </p>
              </div>
            </div>

            <div style={searchGrid}>
              <label style={fieldLabel}>
                Related condition
                <select
                  value={vitamin}
                  onChange={e => setVitamin(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Choose vitamin focus</option>
                  {Object.keys(specialties).map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label style={fieldLabel}>
                City
                <input
                  placeholder="e.g. Bengaluru"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <label style={fieldLabel}>
                State
                <input
                  placeholder="e.g. Karnataka"
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <div style={searchActions}>
                <button
                  type="button"
                  onClick={searchNearby}
                  disabled={loading}
                  style={{
                    ...searchBtn,
                    opacity: loading ? 0.85 : 1,
                    cursor: loading ? "wait" : "pointer"
                  }}
                >
                  {loading ? "Searching…" : "Search clinics"}
                </button>
              </div>
            </div>
          </div>

          {msg && (
            <div
              style={{
                ...statusBanner,
                background: msgIsError
                  ? "#fef2f2"
                  : msgIsSuccess
                    ? "#ecfdf5"
                    : "#f8fafc",
                borderColor: msgIsError
                  ? "#fecaca"
                  : msgIsSuccess
                    ? "#a7f3d0"
                    : "#e2e8f0",
                color: msgIsError ? "#991b1b" : msgIsSuccess ? "#065f46" : "#475569"
              }}
            >
              {msgIsSuccess && <span style={{ marginRight: 8 }}>✓</span>}
              {msgIsError && <span style={{ marginRight: 8 }}>!</span>}
              {msg}
            </div>
          )}

          {places.length > 0 && (
            <>
              <h3 style={sectionHeading}>
                Results
                <span style={sectionBadge}>{places.length} places</span>
              </h3>

              <div style={cardGrid}>
                {places.map((p, i) => {
                  const lat = p.geometry?.location?.lat;
                  const lng = p.geometry?.location?.lng;
                  const reviews = p.user_ratings_total;
                  const key = p.place_id || `place-${i}`;

                  return (
                    <article key={key} style={placeCard}>
                      <div style={placeCardTop}>
                        <span style={placeCardTag}>
                          {vitamin.replace(" Deficiency", "")}
                        </span>
                        {p.opening_hours?.open_now != null && (
                          <span
                            style={{
                              ...openBadge,
                              background: p.opening_hours.open_now
                                ? "#d1fae5"
                                : "#f1f5f9",
                              color: p.opening_hours.open_now
                                ? "#047857"
                                : "#64748b"
                            }}
                          >
                            {p.opening_hours.open_now ? "Open now" : "Closed"}
                          </span>
                        )}
                      </div>

                      <h4 style={placeName}>{p.name}</h4>
                      <p style={placeAddress}>{p.formatted_address}</p>

                      <div style={placeMeta}>
                        {p.rating != null && (
                          <span style={ratingPill}>
                            ★ {Number(p.rating).toFixed(1)}
                            {reviews != null && (
                              <span style={reviewsMuted}>
                                {" "}
                                ({reviews} reviews)
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {lat != null && lng != null && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={directionsBtn}
                        >
                          Directions
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {center && (
            <div style={mapSection}>
              <h3 style={sectionHeading}>
                Map
                <span style={sectionBadgeMuted}>OpenStreetMap</span>
              </h3>
              <div style={mapFrame}>
                <MapContainer
                  center={center}
                  zoom={13}
                  style={{ height: "420px", width: "100%", borderRadius: 12 }}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker position={center}>
                    <Popup>
                      Search area: {city}, {stateName}
                    </Popup>
                  </Marker>

                  {places.map((p, i) => {
                    const lat = p.geometry?.location?.lat;
                    const lng = p.geometry?.location?.lng;
                    if (lat == null || lng == null) return null;
                    return (
                      <Marker
                        key={p.place_id || `m-${i}`}
                        position={[lat, lng]}
                      >
                        <Popup>
                          <strong>{p.name}</strong>
                          <br />
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open in Google Maps
                          </a>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          )}

          {!center && !loading && places.length === 0 && !msg && (
            <div style={emptyState}>
              <div style={emptyIconWrap} aria-hidden>
                🏥
              </div>
              <p style={emptyTitle}>Ready when you are</p>
              <p style={emptyText}>
                Choose a vitamin focus, city, and state above, then run search to
                see clinics and the map.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

const pageWrap = {
  minHeight: "100vh",
  background: "#f1f5f9",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
};

const heroOuter = {
  position: "relative",
  overflow: "hidden",
  minHeight: "clamp(280px, 38vh, 400px)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  color: "#fff",
  isolation: "isolate"
};

/** Soft blur so capsules/pills stay recognizable; scale hides blur edges. */
const heroBgLayer = {
  position: "absolute",
  inset: "-4%",
  backgroundSize: "cover",
  backgroundPosition: "center 38%",
  backgroundRepeat: "no-repeat",
  filter: "blur(6px)",
  WebkitFilter: "blur(6px)",
  transform: "scale(1.04)",
  zIndex: 0
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.52) 0%, rgba(15,118,110,0.28) 42%, rgba(241,245,249,0.88) 100%)",
  pointerEvents: "none"
};

const heroInner = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "16px 24px 56px",
  boxSizing: "border-box"
};

const heroHead = {
  maxWidth: "720px",
  paddingTop: "8px",
  textAlign: "left"
};

const heroKickerPill = {
  display: "inline-block",
  marginBottom: "14px",
  padding: "7px 14px",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.95)",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.28)",
  borderRadius: "999px",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
};

const heroTitle = {
  margin: 0,
  fontSize: "clamp(28px, 4.5vw, 40px)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
  color: "#fff",
  textShadow:
    "0 2px 8px rgba(0,0,0,0.35), 0 12px 40px rgba(0,0,0,0.25)"
};

const contentShell = {
  maxWidth: "1120px",
  margin: "-92px auto 0",
  padding: "0 20px 56px",
  position: "relative",
  zIndex: 3
};

const searchCard = {
  background: "#fff",
  borderRadius: "18px",
  padding: "22px 28px 26px",
  boxShadow:
    "0 4px 6px -1px rgba(15,23,42,0.06), 0 20px 36px -8px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)"
};

const searchCardHeader = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "22px",
  paddingBottom: "20px",
  borderBottom: "1px solid #f1f5f9"
};

const searchCardIcon = {
  fontSize: "28px",
  lineHeight: 1
};

const searchCardTitle = {
  margin: "0 0 4px",
  fontSize: "18px",
  fontWeight: 700,
  color: "#0f172a"
};

const searchCardHint = {
  margin: 0,
  fontSize: "13px",
  color: "#64748b",
  lineHeight: 1.45
};

const searchGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "18px 20px",
  alignItems: "end"
};

const fieldLabel = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#475569",
  textAlign: "left"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  outline: "none"
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px"
};

const searchActions = {
  display: "flex",
  alignItems: "flex-end"
};

const searchBtn = {
  width: "100%",
  padding: "14px 22px",
  fontSize: "15px",
  fontWeight: 700,
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(180deg, #14b8a6 0%, #0f766e 100%)",
  color: "#fff",
  boxShadow: "0 4px 14px rgba(15,118,110,0.35)"
};

const statusBanner = {
  marginTop: "18px",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1px solid",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: 1.5
};

const sectionHeading = {
  margin: "36px 0 18px",
  fontSize: "18px",
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  paddingBottom: "8px",
  borderBottom: "2px solid #e2e8f0"
};

const sectionBadge = {
  fontSize: "12px",
  fontWeight: 700,
  padding: "4px 10px",
  borderRadius: "999px",
  background: "#e0f2fe",
  color: "#0369a1"
};

const sectionBadgeMuted = {
  ...sectionBadge,
  background: "#f1f5f9",
  color: "#64748b",
  fontWeight: 600
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px"
};

const placeCard = {
  background: "#fff",
  borderRadius: "14px",
  padding: "18px 18px 16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
  display: "flex",
  flexDirection: "column",
  minHeight: "220px",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  textAlign: "left"
};

const placeCardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px"
};

const placeCardTag = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#0f766e",
  background: "#ccfbf1",
  padding: "4px 8px",
  borderRadius: "6px"
};

const openBadge = {
  fontSize: "11px",
  fontWeight: 600,
  padding: "4px 8px",
  borderRadius: "6px"
};

const placeName = {
  margin: "0 0 8px",
  fontSize: "16px",
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.35
};

const placeAddress = {
  margin: "0 0 12px",
  fontSize: "13px",
  color: "#64748b",
  lineHeight: 1.5,
  flex: 1
};

const placeMeta = {
  marginBottom: "14px"
};

const ratingPill = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#b45309"
};

const reviewsMuted = {
  fontWeight: 500,
  color: "#94a3b8",
  fontSize: "12px"
};

const directionsBtn = {
  display: "block",
  textAlign: "center",
  marginTop: "auto",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "13px",
  fontWeight: 600,
  textDecoration: "none"
};

const mapSection = {
  marginTop: "8px"
};

const mapFrame = {
  background: "#fff",
  borderRadius: "16px",
  padding: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
  overflow: "hidden"
};

const emptyIconWrap = {
  width: "56px",
  height: "56px",
  borderRadius: "14px",
  background: "#f0fdfa",
  border: "1px solid #ccfbf1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
  marginBottom: "4px"
};

const emptyState = {
  marginTop: "20px",
  textAlign: "center",
  padding: "44px 28px",
  background: "#fff",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px"
};

const emptyTitle = {
  margin: "0 0 6px",
  fontSize: "17px",
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em"
};

const emptyText = {
  margin: 0,
  fontSize: "14px",
  color: "#64748b",
  maxWidth: "420px",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.65
};
