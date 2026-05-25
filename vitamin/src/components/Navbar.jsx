import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    alert("Logged out!");
    navigate("/");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginRight: "20px",
    fontSize: "16px"
  };

  return (
    <div
      style={{
        background: "#1f2933",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center"
      }}
    >

      {/* LEFT LOGO TITLE */}
      <h2 style={{color:"white", marginRight:"30px"}}>
        Vitamin Detection
      </h2>

      {/* NAVBAR LINKS - LEFT SIDE */}
      <Link to="/home" style={linkStyle}>Home</Link>
      <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
      <Link to="/doctors" style={linkStyle}>Nearby Doctors</Link>

      {/* LOGOUT ON FAR RIGHT */}
      <div style={{ marginLeft: "auto" }}>
        <span
          onClick={logout}
          style={{ color: "yellow", cursor: "pointer" }}
        >
          Logout
        </span>
      </div>
    </div>
  );
}
