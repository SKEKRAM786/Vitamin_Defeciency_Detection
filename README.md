# Vitamin Detection

A web app that estimates **vitamin A–E deficiency** from a photo (lips, eyes, nails, skin, or hair), then suggests diet advice, nearby clinics, and a health chatbot.

The working code is in the `vitamin/` folder.

---

## How to use this README

Read it in this order:

1. **What this project is** — product overview  
2. **How the project works** — three servers and how requests flow  
3. **How to start** — commands to run it locally  

Markdown headings (`##`) are the table of contents in GitHub and most editors. Click a heading in the outline to jump. Code blocks are copy-paste commands.

---

## What this project is

Users sign up / log in, upload a body-feature image, pick an age group, and get:

- Predicted deficiency (Vitamin A, B, C, D, or E) plus confidence  
- Age-based symptoms, foods to eat, and foods to avoid  
- Recent upload history on the dashboard  
- Nearby doctors on a map (Google Places + Leaflet)  
- A Gemini-powered chatbot on logged-in pages  

The ML model is a Keras `.h5` file trained on five vitamin classes.

---

## How the project works

Three processes must run together. The React app talks to **two** backends.

```
Browser (http://localhost:3000)
    │
    ├── login / signup / forgot password  →  Node Express  :5001  →  MongoDB
    ├── image predict + chatbot           →  Flask         :5000  →  Keras model + Gemini
    └── nearby doctors                    →  Flask         :5000  →  Google Places
                                            (in dev, CRA also proxies /api/* to :5000)
```

| Piece | Path | Port | Role |
|---|---|---|---|
| React (Create React App) | `vitamin/` | 3000 | UI, routing, maps |
| Flask + TensorFlow | `vitamin/backend/` | 5000 | `/predict`, `/chatbot`, `/api/nearby-doctors` |
| Express + Mongoose | `vitamin/server/` | 5001 | `/api/auth/*`, `/api/health` |

**Typical flow**

1. Open `/` → login. Credentials go to Node, which hashes passwords with bcrypt and stores users in MongoDB.  
2. After login you land on `/home`. Upload an image + age group → `POST http://127.0.0.1:5000/predict`. Flask resizes the image to 224×224, runs `vitamin_deficiency_model.h5`, and returns prediction + diet text. Low confidence (< 0.55) is treated as an invalid image.  
3. Results are stored in `localStorage` and shown on `/dashboard`.  
4. `/doctors` geocodes city/state with the browser Google Maps key, then Flask searches nearby clinics.  
5. The floating chatbot on Main Layout pages posts to `http://localhost:5000/chatbot` (Gemini).

**Pages**

| Route | Page |
|---|---|
| `/` | Login |
| `/signup` | Signup |
| `/forgot-password` | Temporary password reset |
| `/home` | Main detect + advice |
| `/dashboard` | Last 5 uploads + dataset chart |
| `/analysis` | Simpler detect page |
| `/doctors` | Nearby doctors map |

Logged-in layout also mounts `HealthChatbot`.

---

## Folder structure

```
Vitamin/
├── README.md                 ← this file
└── vitamin/
    ├── src/                  React pages, auth API helper, chatbot
    ├── public/
    ├── backend/
    │   ├── app.py            Flask API
    │   ├── chatbot.py        Gemini
    │   ├── vitamin_deficiency_model.h5
    │   └── requirements.txt
    └── server/
        ├── index.js          Auth API
        ├── models/User.js
        └── .env.example
```

---

## Prerequisites

- **Node.js** (npm)
- **Python 3.11** (`vitamin/runtime.txt` is `python-3.11.9`; TensorFlow 2.18 is unreliable on 3.12+)
- **MongoDB** locally, or a MongoDB Atlas cluster

---

## Environment files

Do not commit real secrets. Create these if they are missing.

**`vitamin/.env`** (React — must restart `npm start` after edits)

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_browser_maps_key
```

Optional: `REACT_APP_AUTH_API` (default `http://localhost:5001`), `REACT_APP_FLASK_URL`.

**`vitamin/backend/.env`** (Flask)

```
GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_places_key
```

**`vitamin/server/.env`** (copy from `vitamin/server/.env.example`)

```
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/vitamin_app
```

For Atlas, use a `mongodb+srv://...` URI and allow your IP. URL-encode special characters in the password.

---

## How to start

Use **three terminals**. Start Flask from `vitamin/backend` so it finds the `.h5` model.

### 1. Flask — ML, chatbot, doctors (port 5000)

```powershell
cd vitamin\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install google-genai pillow-avif-plugin
python app.py
```

On macOS/Linux:

```bash
cd vitamin/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install google-genai pillow-avif-plugin
python app.py
```

`google-genai` and `pillow-avif-plugin` are imported in code but not listed in `requirements.txt`.

### 2. Node — login and signup (port 5001)

MongoDB must be reachable first.

```powershell
cd vitamin\server
npm install
npm start
```

You should see `MongoDB connected` and `Server running on http://localhost:5001`.  
Check: [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 3. React — UI (port 3000)

```powershell
cd vitamin
npm install
npm start
```

Open **[http://localhost:3000](http://localhost:3000)**.

| You want to use | Start |
|---|---|
| Login / signup only | Node + React |
| Image analysis / chatbot | Flask + React |
| Nearby doctors | Flask + React + Maps keys |
| Full app | All three |

---

## Quick checks if something fails

- **Auth errors / “server not reachable”** — Node is not on 5001, or MongoDB URI / IP allowlist is wrong.  
- **Predict / chatbot fail** — Flask is not on 5000, or you started it from the wrong folder (model file missing).  
- **`from google import genai`** — install `google-genai` (not only `google-generativeai`).  
- **Python 3.12+** — use 3.11 for TensorFlow.  
- **Maps alert “API key not found”** — set `REACT_APP_GOOGLE_MAPS_API_KEY` in `vitamin/.env` and restart React.  
- **Chatbot “temporarily unavailable”** — `GEMINI_API_KEY` missing or invalid in `vitamin/backend/.env`.
