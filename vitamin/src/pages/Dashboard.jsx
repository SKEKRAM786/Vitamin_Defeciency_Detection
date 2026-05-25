import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  // ✅ FETCH LAST 5 UPLOAD HISTORY
  const history = JSON.parse(localStorage.getItem("history")) || [];

  // ✅ YOUR REAL OR SAMPLE DATASET COUNTS
  const datasetStats = [
    { vitamin: "Vit A", images: 910 },
    { vitamin: "Vit B", images: 900 },
    { vitamin: "Vit C", images: 890 },
    { vitamin: "Vit D", images: 905 },
    { vitamin: "Vit E", images: 895 }
  ];

  return (
    <>
      <Navbar />

      <div style={container}>

        {/* ===== RECENT UPLOADS ===== */}
        <div style={section}>
          <h2>Recent Uploads (Last 5)</h2>

          <div style={historyGrid}>

            {history.length === 0 && (
              <p style={{ color: "#777" }}>
                No uploads yet.
              </p>
            )}

            {history.map((item, index) => (
              <div key={index} style={historyCard}>

                <img
                  src={item.image}
                  alt={`Upload ${index + 1}`}
                  style={historyImg}
                />

                <h4>{item.vitamin}</h4>
                <p><b>Confidence:</b> {item.confidence}</p>

              </div>
            ))}

          </div>
        </div>


        {/* ===== DATASET CHART ===== */}
        <div style={section}>
          <h2>Dataset Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datasetStats}>
              <XAxis dataKey="vitamin" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="images" fill="#3b82f6">
                <LabelList dataKey="images" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* ===== SUMMARY ===== */}
        <p style={summary}>
          Total dataset size:{" "}
          <b>
            {datasetStats.reduce((sum, item) => sum + item.images, 0)}
          </b>{" "}
          images across 5 vitamin classes.
        </p>

      </div>
    </>
  );
}


/* ===== STYLES ===== */

const container = {
  padding: "30px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const section = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  marginBottom: "30px"
};

const historyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "20px",
  marginTop: "15px"
};

const historyCard = {
  background: "white",
  borderRadius: "15px",
  padding: "10px",
  textAlign: "center",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.12)"
};

const historyImg = {
  width: "150px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "2px solid #ddd",
  marginBottom: "8px"
};

const summary = {
  textAlign: "center",
  color: "#374151",
  marginTop: "15px",
  fontSize: "15px"
};
