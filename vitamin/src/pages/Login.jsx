import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/login.jpg";
import { AUTH_API_BASE } from "../authApi";
import {
  authPageWrap,
  authCard,
  authEyebrow,
  authLoginHeadline,
  authLoginSubtitle,
  authDivider,
  authFieldStack,
  authInput,
  authBtnBlue,
  authBtnDisabled,
  authBtnOutline,
  authLinkMuted,
  authLinkSmall
} from "../authUi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${AUTH_API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Invalid login details!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home", { replace: true });
    } catch (error) {
      alert("Server not reachable. Please start backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...authPageWrap, backgroundImage: `url(${bg})` }}>
      <div style={authCard}>
        <p style={authEyebrow}>Welcome back</p>

        <h1 style={authLoginHeadline}>Vitamin Deficiency Detection</h1>

        <p style={authLoginSubtitle}>
          Sign in to upload scans, view guidance, and track insights on one
          dashboard.
        </p>

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
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={authInput}
          />

          <button
            type="button"
            onClick={login}
            style={{
              ...authBtnBlue,
              ...(loading ? authBtnDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          <Link to="/forgot-password" style={authLinkSmall}>
            Forgot password?
          </Link>
        </div>

        <p style={authLinkMuted}>New user?</p>

        <Link to="/signup" style={authBtnOutline}>
          Create Account
        </Link>
      </div>
    </div>
  );
}
