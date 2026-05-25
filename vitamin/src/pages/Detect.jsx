import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Detect(){

  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);

  const detect = async () => {

    if(!image){
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("image", image);

    const response = await fetch(
      "http://127.0.0.1:5000/predict",
      {
        method: "POST",
        body: data
      }
    );

    const json = await response.json();

    setResult(json.prediction);
    setConfidence(json.confidence.toFixed(2));
    setLoading(false);
  };

  return (
    <>
      <Navbar/>

      <div style={{ margin:"40px", textAlign:"center" }}>

        <h2>Vitamin Deficiency Analysis</h2>

        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
        />

        <br/><br/>

        <button onClick={detect}>
          { loading ? "Analyzing..." : "Upload & Analyze" }
        </button>

        {result && (
          <div style={{
            marginTop:"20px",
            padding:"15px",
            background:"#ecfeff",
            borderRadius:"8px"
          }}>
            <h3>Result: {result}</h3>
            <p>Confidence: {confidence}%</p>
          </div>
        )}

      </div>
    </>
  )
}
