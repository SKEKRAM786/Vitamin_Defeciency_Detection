import { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/login.jpg";
import { AUTH_API_BASE } from "../authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${AUTH_API_BASE}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Something went wrong.");
        return;
      }

      alert(
        `${data.message}\n\nYour temporary password:\n${data.temporaryPassword}\n\nCopy it and use it on the Login page.`
      );
    } catch (error) {
      alert("Server not reachable. Please start backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.9)",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>Forgot password</h2>
        <p style={{ fontSize: "14px", color: "#444", marginBottom: "16px" }}>
          Enter the email you used to register. We will create a temporary
          password you can use to log in.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <button
          type="button"
          onClick={submit}
          style={btnStyle}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Get temporary password"}
        </button>

        <p style={{ marginTop: "16px", fontSize: "14px" }}>
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  fontSize: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
