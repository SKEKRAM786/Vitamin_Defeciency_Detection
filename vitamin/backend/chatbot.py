from google import genai
import os

def get_bot_reply(message):
    try:
        client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=message
        )

        return response.text

    except Exception as e:
        print("GEMINI ERROR:", e)
        return "AI service temporarily unavailable. Please try again later."
