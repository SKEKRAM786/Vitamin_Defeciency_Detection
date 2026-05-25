"""Quick check that Flask /api/nearby-doctors returns JSON. Run while app.py is running."""
import json
import urllib.error
import urllib.request

URL = (
    "http://127.0.0.1:5000/api/nearby-doctors?"
    "lat=12.97&lng=77.59&specialty=doctor&city=Bengaluru&state=Karnataka"
)

try:
    with urllib.request.urlopen(URL, timeout=30) as resp:
        body = resp.read().decode()
        data = json.loads(body)
    if data.get("status") == "success" and isinstance(data.get("results"), list):
        print("OK — API returned JSON with", len(data["results"]), "places")
    elif data.get("error"):
        print("API error:", data.get("error"), data.get("details", ""))
    else:
        print("Unexpected JSON:", list(data.keys()))
except urllib.error.URLError as e:
    print("FAILED — cannot reach Flask:", e)
except json.JSONDecodeError as e:
    print("FAILED — not JSON:", e)
