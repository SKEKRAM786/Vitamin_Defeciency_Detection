import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/login.jpg";
import { AUTH_API_BASE } from "../authApi";
import {
  authPageWrap,
  authCard,
  authLoginHeadline,
  authSignupSectionTitle,
  authDivider,
  authFieldStack,
  authInput,
  authBtnGreen,
  authBtnDisabled,
  authBtnOutlineBlue,
  authLinkMuted
} from "../authUi";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${AUTH_API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Signup failed.");
        return;
      }

      alert("Account created successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      alert("Server not reachable. Please start backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...authPageWrap, backgroundImage: `url(${bg})` }}>
      <div style={authCard}>
        <h1 style={authLoginHeadline}>Vitamin Deficiency Detection</h1>

        <h2 style={authSignupSectionTitle}>Create Account</h2>

        <hr style={authDivider} />

        <div style={authFieldStack}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={authInput}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={authInput}
          />

          <button
            type="button"
            onClick={signup}
            style={{
              ...authBtnGreen,
              ...(loading ? authBtnDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>

        <p style={authLinkMuted}>Already have an account?</p>

        <Link to="/" style={authBtnOutlineBlue}>
          Login
        </Link>
      </div>
    </div>
  );
}
