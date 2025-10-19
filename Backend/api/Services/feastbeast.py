# result_output - from GemImgGen

import base64
import json
import requests
from django.conf import settings

def plan_party_with_inventory(list_id, party_prompt, inventory_list_items):
    """
    Plans a party based on existing inventory, dishes, and number of people.
    Returns items that need to be bought or increased in quantity along with store recommendations.
    
    Args:
        list_id: ID of the inventory list to compare against
        party_prompt: Text describing party dishes and number of people
        inventory_list_items: List of items currently in inventory
    
    Returns:
        JSON with party_shopping_list and cheapest_info
    """
    # Build inventory items text
    inventory_text = "\n".join([
        f"- {item['name']}: {item.get('quantity', '0')}" 
        for item in inventory_list_items
    ])

    # System prompt for party planning
    system_prompt = (
        "You are a party planning and grocery assistant. "
        "You will receive a list of current inventory items and a description of the party including "
        "dishes to be prepared and number of guests. "
        "Your task is to:\n"
        "1. Determine which items from the inventory are sufficient or insufficient for the dishes.\n"
        "2. List items and quantities that need to be additionally purchased to make the dishes for the number of people.\n"
        "3. Suggest the cheapest store to buy these items and estimate the total cost.\n\n"
        "Respond ONLY with valid JSON in this exact format:\n"
        "{\n"
        '  "party_shopping_list": ["item1 quantity", "item2 quantity", ...],\n'
        '  "cheapest_info": {\n'
        '    "store": "Store Name",\n'
        '    "estimated_total_cost": 0.00\n'
        "  }\n"
        "}\n"
        "Do NOT include markdown, explanations, or any text outside the JSON."
    )

    # Build text prompt
    text_prompt = (
        f"{system_prompt}\n\n"
        f"Inventory list (ID: {list_id}):\n"
        f"{inventory_text}\n\n"
        f"Party details:\n{party_prompt}"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": text_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "topK": 32,
            "topP": 1,
            "maxOutputTokens": 2048,
        }
    }

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return {"error": "Missing GEMINI_API_KEY in settings"}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    try:
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=90
        )

        if response.status_code != 200:
            return {"error": f"Gemini API error: {response.text}"}

        result = response.json()
        model_text = result["candidates"][0]["content"]["parts"][0]["text"]
        cleaned_text = model_text.strip().replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(cleaned_text)

        if "party_shopping_list" not in parsed_json or "cheapest_info" not in parsed_json:
            return {"error": "Invalid response format from Gemini", "raw_output": parsed_json}

        return parsed_json

    except requests.exceptions.Timeout:
        return {"error": "Request to Gemini timed out"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    except (KeyError, IndexError) as e:
        return {"error": f"Failed to parse Gemini response: {str(e)}", "raw_output": result}
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON from Gemini: {str(e)}", "raw_text": cleaned_text}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
