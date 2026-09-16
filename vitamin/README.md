# Vitamin Detection

This folder is the application (React UI, Flask ML API, Node auth).

**Full documentation** — what the project is, how it works, environment setup, and how to start all three servers — is in the repository root:

**[../README.md](../README.md)**

Quick start (three terminals):

```powershell
# 1. Flask  →  http://127.0.0.1:5000
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install google-genai pillow-avif-plugin
python app.py
```

```powershell
# 2. Node auth  →  http://localhost:5001
cd server
npm install
npm start
```

```powershell
# 3. React  →  http://localhost:3000
npm install
npm start
```
