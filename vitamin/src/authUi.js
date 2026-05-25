/** Shared layout & styles for Login / Signup (full-width inputs + buttons). */

export const authPageWrap = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  boxSizing: "border-box"
};

export const authCard = {
  width: "100%",
  maxWidth: "440px",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: "28px 32px 34px",
  borderRadius: "20px",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.7) inset",
  textAlign: "center"
};

export const authEyebrow = {
  margin: "0 0 10px",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#2563eb"
};

export const authLoginHeadline = {
  margin: "0 0 10px",
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.03em",
  color: "#1e293b",
  lineHeight: "1.2"
};

export const authLoginSubtitle = {
  margin: "0 auto",
  maxWidth: "320px",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#64748b",
  fontWeight: "500"
};

export const authDivider = {
  height: "1px",
  margin: "22px 0 6px",
  background:
    "linear-gradient(90deg, transparent, rgba(148,163,184,0.55), transparent)",
  border: "none"
};

export const authTitle = {
  margin: "0 0 8px",
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "-0.02em",
  color: "#1e293b",
  lineHeight: "1.25"
};

/** Second line under product name on Signup (“Create Account”). */
export const authSignupSectionTitle = {
  margin: "0 0 10px",
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  color: "#475569",
  lineHeight: "1.3"
};

export const authFieldStack = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "18px",
  textAlign: "left"
};

export const authInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxShadow: "0 1px 2px rgba(15,23,42,0.04)"
};

export const authBtnPrimary = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px 22px",
  fontSize: "16px",
  fontWeight: "700",
  letterSpacing: "0.03em",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginTop: "6px"
};

export const authBtnBlue = {
  ...authBtnPrimary,
  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%)",
  color: "#ffffff",
  boxShadow:
    "0 4px 16px rgba(37,99,235,0.42), inset 0 1px 0 rgba(255,255,255,0.2)"
};

export const authBtnGreen = {
  ...authBtnPrimary,
  background: "linear-gradient(180deg, #34d399 0%, #16a34a 55%, #15803d 100%)",
  color: "#ffffff",
  boxShadow:
    "0 4px 16px rgba(22,163,74,0.38), inset 0 1px 0 rgba(255,255,255,0.2)"
};

export const authBtnDisabled = {
  opacity: 0.62,
  cursor: "not-allowed",
  boxShadow: "none",
  filter: "grayscale(0.15)"
};

export const authBtnOutline = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 22px",
  fontSize: "15px",
  fontWeight: "700",
  letterSpacing: "0.02em",
  borderRadius: "12px",
  border: "2px solid #7c3aed",
  color: "#5b21b6",
  background: "#faf5ff",
  textDecoration: "none",
  textAlign: "center",
  cursor: "pointer",
  marginTop: "8px",
  boxShadow: "0 2px 10px rgba(109,40,217,0.14)",
  transition: "background 0.15s ease, border-color 0.15s ease"
};

/** Outline button aligned with login (blue) — used on Signup “Login”. */
export const authBtnOutlineBlue = {
  ...authBtnOutline,
  border: "2px solid #2563eb",
  color: "#1e40af",
  background: "#eff6ff",
  boxShadow: "0 2px 10px rgba(37,99,235,0.18)"
};

export const authLinkMuted = {
  fontSize: "13px",
  color: "#64748b",
  marginTop: "20px",
  marginBottom: "8px",
  textAlign: "center",
  fontWeight: "600"
};

export const authLinkSmall = {
  fontSize: "14px",
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  marginTop: "4px",
  padding: "4px 0"
};

export const authSignupSubtitle = {
  ...authLoginSubtitle,
  marginTop: "4px"
};
