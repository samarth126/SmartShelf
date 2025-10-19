# Services/planning_list_gen.py
import base64
import json
import requests
from django.conf import settings


def send_to_gemini(image_file, text):
    """
    Sends user input (text + optional image) to Gemini to generate a
    curated shopping list in JSON format (for 1 month or specified duration).
    """

    # Base prompt engineering
    system_prompt = (
        "You are a nutrition and grocery planning assistant. "
        "Based on the provided meal plan, dietary goals, or uploaded grocery list image, "
        "generate a monthly grocery inventory plan. "
        "Respond ONLY with valid JSON under the key 'shopping_list', "
        "each item having 'item' and 'quantity' fields. "
        "Do NOT include markdown or explanations, only pure JSON."
    )

    # Build the content parts dynamically
    parts = []

    # If an image was provided, encode it
    if image_file:
        img_bytes = image_file.read()
        b64_data = base64.b64encode(img_bytes).decode('utf-8')
        parts.append({
            "inlineData": {
                "mimeType": image_file.content_type,
                "data": b64_data
            }
        })

    # Combine user prompt with system guidance
    text_prompt = (
        f"{system_prompt}\n\n"
        f"User details:\n{text}\n\n"
        "Return the result as a JSON object like this:\n"
        "{ \"shopping_list\": [ {\"item\": \"Milk\", \"quantity\": \"5L\"}, ... ] }"
    )

    parts.append({"text": text_prompt})

    # Build full request payload
    payload = {
        "model": "gemini-2.0-flash",
        "contents": [
            {
                "role": "user",
                "parts": parts
            }
        ]
    }

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return {"error": "Missing GEMINI_API_KEY in settings"}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        json=payload,
        timeout=90
    )

    if response.status_code != 200:
        print("Gemini API error:", response.text)
        return {"error": response.text}

    # Parse Gemini response
    result = response.json()

    # Extract only the model-generated text
    try:
        model_text = result["candidates"][0]["content"]["parts"][0]["text"]

        # Try to clean/parse JSON if Gemini adds any noise
        cleaned_text = model_text.strip().replace("```json", "").replace("```", "")
        parsed_json = json.loads(cleaned_text)

        return parsed_json  # ✅ return clean JSON object
    except Exception as e:
        print("Parsing error:", e)
        print("Raw Gemini output:", result)
        return {"error": "Failed to parse Gemini output", "raw_output": result}
