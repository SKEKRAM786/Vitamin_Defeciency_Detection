import { useState } from "react";
import Navbar from "../components/Navbar";
import bg from "../assets/hero-bg.jpg";

export default function Home() {

  const [fileName, setFileName] = useState("No file chosen");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [age, setAge] = useState("");

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [foods, setFoods] = useState("");
  const [avoidFoods, setAvoidFoods] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================
     HANDLE IMAGE SELECTION
     ========================= */
  const handleFileChange = (e) => {

    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      setFileName(file.name);
      setImageFile(file);

      // ✅ IMAGE PREVIEW
      setPreviewUrl(URL.createObjectURL(file));
    } 
    else {
      setFileName("No file chosen");
      setImageFile(null);
      setPreviewUrl(null);
    }
  };


  /* =========================
     CALL FLASK API
     ========================= */
  const detect = async () => {

    if (!imageFile || !age) {
      alert("Please choose image AND select age group");
      return;
    }

    setLoading(true);

    setResult("");
    setConfidence("");
    setSymptoms("");
    setFoods("");
    setAvoidFoods("");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("age", age);

    try {

      const res = await fetch("http://127.0.0.1:5000/predict",{
        method:"POST",
        body: formData
      });

      const data = await res.json();

      if (data.error){
        alert("SERVER ERROR: " + data.error);
      }
      else{

        setResult(data.prediction);
        setConfidence((data.confidence * 100).toFixed(2));
        setSymptoms(data.symptoms);
        setFoods(data.eat);
        setAvoidFoods(data.avoid);

        // ✅ SAVE RESULT FOR DASHBOARD
     // ✅ SAVE LAST 5 PREDICTIONS FOR DASHBOARD
let history = JSON.parse(localStorage.getItem("history")) || [];

history.unshift({
  image: previewUrl,
  vitamin: data.prediction,
  confidence: (data.confidence * 100).toFixed(2) + "%"
});

// keep only last 5
history = history.slice(0, 5);

localStorage.setItem("history", JSON.stringify(history));
      }

    } 
    catch(err){
      console.error(err);
      alert("Flask backend is not running!");
    }

    setLoading(false);
  };


  /* =========================
     UI
     ========================= */
  return (
    <>
      <Navbar />

      <div
        style={{
          backgroundImage:`url(${bg})`,
          backgroundSize:"cover",
          backgroundPosition:"center",
          minHeight:"100vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}
      >

        {/* ========= CENTER CARD ========= */}
        <div style={cardStyle}>

          <h2>Vitamin Deficiency Classifier</h2>

          {/* AGE GROUP */}
          <select
            style={inputStyle}
            value={age}
            onChange={(e)=>setAge(e.target.value)}
          >
            <option value="">-- Select Age Group --</option>
            <option>Child (0-12)</option>
            <option>Teen (13-18)</option>
            <option>Adult (19-40)</option>
            <option>Middle Age (41-59)</option>
            <option>Senior (60+)</option>
          </select>


          {/* FILE PICKER */}
          <div style={fileBoxStyle}>

            <label htmlFor="fileInput" style={chooseBtnStyle}>
              Choose Image
            </label>

            <span style={fileNameStyle}>
              {fileName}
            </span>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />

          </div>


          {/* IMAGE PREVIEW */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width:"220px",
                height:"220px",
                objectFit:"cover",
                borderRadius:"10px",
                marginBottom:"12px",
                border:"2px solid #ddd"
              }}
            />
          )}


          {/* BUTTON */}
          <button style={btnStyle} onClick={detect}>
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>


          {/* RESULT BOX */}
          {result && (
            <div style={resultStyle}>

              <h3>{result}</h3>

              <p><b>Confidence:</b> {confidence}%</p>
              <p><b>Age Group:</b> {age}</p>

              <p>
                <b>Symptoms:</b><br/>
                {symptoms}
              </p>

              <p>
                <b>Foods to Eat:</b><br/>
                {foods}
              </p>

              <p>
                <b>Foods to Avoid:</b><br/>
                {avoidFoods}
              </p>

            </div>
          )}

        </div>

      </div>
    </>
  );
}


/* =========================
          STYLES
   ========================= */

const cardStyle = {
  width:"430px",
  background:"rgba(255,255,255,0.95)",
  padding:"25px",
  borderRadius:"20px",
  textAlign:"center",
  boxShadow:"0px 12px 30px rgba(0,0,0,0.25)"
};

const inputStyle = {
  width:"100%",
  padding:"10px",
  marginBottom:"10px",
  borderRadius:"6px",
  border:"1px solid #ccc",
  fontSize:"15px"
};

const fileBoxStyle = {
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between",
  padding:"10px",
  border:"1px solid #ccc",
  borderRadius:"6px",
  background:"#f9fafb",
  marginBottom:"15px"
};

const chooseBtnStyle = {
  background:"#2563eb",
  padding:"6px 12px",
  borderRadius:"5px",
  color:"white",
  cursor:"pointer",
  fontSize:"14px"
};

const fileNameStyle = {
  fontSize:"13px",
  color:"#333",
  marginLeft:"10px",
  overflow:"hidden",
  whiteSpace:"nowrap",
  textOverflow:"ellipsis",
  maxWidth:"220px"
};

const btnStyle = {
  width:"100%",
  padding:"10px",
  background:"#10b981",
  border:"none",
  borderRadius:"6px",
  color:"white",
  fontSize:"16px",
  cursor:"pointer",
  marginTop:"5px"
};

const resultStyle = {
  marginTop:"15px",
  padding:"10px",
  background:"#ecfeff",
  borderRadius:"8px",
  border:"1px solid #67e8f9",
  textAlign:"left",
  fontSize:"14px"
};
