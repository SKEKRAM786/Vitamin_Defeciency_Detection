const crypto = require("crypto");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env: prefer server/.env; if MONGODB_URI missing, try parent vitamin/.env
dotenv.config({ path: path.join(__dirname, ".env") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

const User = require("./models/User");

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

const app = express();
const PORT = process.env.PORT || 5001;

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const mongoStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  const state = mongoose.connection.readyState;
  res.json({
    ok: true,
    mongo: {
      state,
      status: mongoStates[state] ?? "unknown"
    }
  });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Account already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error while creating account." });
  }
});

function generateTemporaryPassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    out += chars[bytes[i] % chars.length];
  }
  return out;
}

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email." });
    }

    const temporaryPassword = generateTemporaryPassword();
    user.password = await bcrypt.hash(temporaryPassword, 10);
    await user.save();

    return res.status(200).json({
      message:
        "Your temporary password is shown below. Use it to log in, then change your password if you add that feature later.",
      temporaryPassword
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while resetting password." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while logging in." });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing in server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    });
    console.log("MongoDB connected:", mongoose.connection.name);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error(
      "Check: MONGODB_URI is in vitamin/server/.env (or vitamin/.env). Atlas: IP allowlist + URL-encoded password."
    );
    process.exit(1);
  }
}

startServer();
