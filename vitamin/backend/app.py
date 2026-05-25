from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import pillow_avif  # comment/remove if not using AVIF
import os

# 🔹 ENV + CHATBOT
from dotenv import load_dotenv
from chatbot import get_bot_reply

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# =========================
# LOAD ML MODEL
# =========================
model = tf.keras.models.load_model("vitamin_deficiency_model.h5")

# CLASS LABELS (MUST MATCH TRAINING ORDER)
classes = [
    "Vitamin A Deficiency",
    "Vitamin B Deficiency",
    "Vitamin C Deficiency",
    "Vitamin D Deficiency",
    "Vitamin E Deficiency"
]

# =========================
# AGE + VITAMIN DATA
# =========================
nutrition = {
    "Child (0-12)": {
        "Vitamin A Deficiency": {
            "symptoms": "Dry eyes, night blindness, frequent infections.",
            "eat": "Carrot, sweet potato, spinach, pumpkin, mango, milk, eggs.",
            "avoid": "Too much junk food, deep-fried snacks, sugary drinks."
        },
        "Vitamin B Deficiency": {
            "symptoms": "Cracked lips, mouth sores, red tongue, fatigue.",
            "eat": "Banana, egg, milk, curd, dal, oats, whole-wheat chapati.",
            "avoid": "Instant noodles, chips, packaged snacks, soft drinks."
        },
        "Vitamin C Deficiency": {
            "symptoms": "Bleeding gums, frequent cold, slow wound healing.",
            "eat": "Orange, lemon, amla, guava, strawberry, tomato, capsicum.",
            "avoid": "Very sugary drinks, excessive packaged biscuits and sweets."
        },
        "Vitamin D Deficiency": {
            "symptoms": "Bone pain, leg pain, delayed growth, weakness.",
            "eat": "Fortified milk, egg yolk, fish, mushrooms.",
            "avoid": "Always staying indoors, no sunlight, too many fizzy drinks."
        },
        "Vitamin E Deficiency": {
            "symptoms": "Dry skin, hair fall, low immunity.",
            "eat": "Almonds, peanuts, sunflower seeds, spinach, vegetable oils.",
            "avoid": "Too many fried street foods and bakery items."
        }
    },

    "Teen (13-18)": {
        "Vitamin A Deficiency": {
            "symptoms": "Poor night vision, dry eyes, acne, low immunity.",
            "eat": "Carrot, leafy greens, papaya, mango, milk, eggs.",
            "avoid": "Pizza, burgers, fries, soft drinks."
        },
        "Vitamin B Deficiency": {
            "symptoms": "Tiredness, pale skin, cracked lips.",
            "eat": "Eggs, milk, sprouts, groundnuts, brown rice.",
            "avoid": "Energy drinks, excessive junk food."
        },
        "Vitamin C Deficiency": {
            "symptoms": "Weak immunity, sore throat.",
            "eat": "Citrus fruits, amla, guava.",
            "avoid": "Fried food and sugary drinks."
        },
        "Vitamin D Deficiency": {
            "symptoms": "Back pain, muscle weakness.",
            "eat": "Egg yolk, fish, fortified milk.",
            "avoid": "No sunlight exposure."
        },
        "Vitamin E Deficiency": {
            "symptoms": "Hair fall, dry skin.",
            "eat": "Almonds, walnuts, sunflower seeds.",
            "avoid": "Very oily food."
        }
    },

    "Adult (19-40)": {
        "Vitamin A Deficiency": {
            "symptoms": "Dry eyes, poor night vision.",
            "eat": "Carrots, leafy greens, mango.",
            "avoid": "Smoking, alcohol."
        },
        "Vitamin B Deficiency": {
            "symptoms": "Fatigue, tingling hands.",
            "eat": "Eggs, dal, whole grains.",
            "avoid": "Processed food."
        },
        "Vitamin C Deficiency": {
            "symptoms": "Gum problems, joint pain.",
            "eat": "Lemon, guava, tomato.",
            "avoid": "Smoking, alcohol."
        },
        "Vitamin D Deficiency": {
            "symptoms": "Bone pain, low mood.",
            "eat": "Egg yolk, fish, curd.",
            "avoid": "Lack of sunlight."
        },
        "Vitamin E Deficiency": {
            "symptoms": "Hair thinning, dry skin.",
            "eat": "Seeds, nuts, olive oil.",
            "avoid": "Trans-fat food."
        }
    }
}

# =========================
# PREDICTION ROUTE
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        image_file = request.files["image"]
        age_group = request.form.get("age")

        img = Image.open(image_file).convert("RGB")
        img = img.resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        preds = model.predict(img)
        index = np.argmax(preds)
        confidence = float(preds[0][index])
        vitamin = classes[index]

        if confidence < 0.55:
            return jsonify({
                "prediction": "Invalid Image",
                "confidence": confidence,
                "message": "Please upload a clear image of lips, eyes, nails, skin or hair."
            })

        advice = nutrition.get(age_group, {}).get(vitamin, {
            "symptoms": "General weakness.",
            "eat": "Balanced healthy diet.",
            "avoid": "Junk food."
        })

        return jsonify({
            "prediction": vitamin,
            "confidence": confidence,
            "age_group": age_group,
            "symptoms": advice["symptoms"],
            "eat": advice["eat"],
            "avoid": advice["avoid"]
        })

    except Exception as e:
        print("PREDICT ERROR:", e)
        return jsonify({"error": str(e)}), 500


# =========================
# CHATBOT ROUTE (FINAL)
# =========================
@app.route("/chatbot", methods=["POST"])
def chatbot():
    try:
        data = request.json
        message = data.get("message")

        if not message:
            return jsonify({"reply": "Message is required"}), 400

        reply = get_bot_reply(message)
        return jsonify({"reply": reply})

    except Exception as e:
        print("CHATBOT ERROR:", e)
        return jsonify({"reply": "Server error"}), 500

# =========================
# NEARBY DOCTORS API
# =========================
import requests

@app.route("/api/nearby-doctors", methods=["GET"])
def nearby_doctors():
    try:
        # Get parameters from frontend
        lat = request.args.get("lat")
        lng = request.args.get("lng")
        specialty = request.args.get("specialty", "doctor")
        city = request.args.get("city")
        state = request.args.get("state")

        # Validation
        if not lat or not lng:
            return jsonify({
                "error": "Latitude & Longitude required"
            }), 400

        # Get API key from .env
        GOOGLE_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

        if not GOOGLE_KEY:
            return jsonify({
                "error": "Google API key not found in .env"
            }), 500

        # Google Places API URL
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

        # Query params
        params = {
            "query": f"{specialty} clinic in {city} {state} India",
            "location": f"{lat},{lng}",
            "radius": 5000,
            "key": GOOGLE_KEY
        }

        # Call Google API
        response = requests.get(url, params=params)
        data = response.json()

        # Handle API error
        if data.get("status") == "REQUEST_DENIED":
            return jsonify({
                "error": "API Key issue",
                "details": data.get("error_message")
            }), 403

        if data.get("status") == "ZERO_RESULTS":
            return jsonify({
                "message": "No clinics found nearby",
                "results": []
            })

        # Success response
        return jsonify({
            "status": "success",
            "count": len(data.get("results", [])),
            "results": data.get("results", [])
        })

    except Exception as e:
        print("NEARBY DOCTORS ERROR:", e)
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500
# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
