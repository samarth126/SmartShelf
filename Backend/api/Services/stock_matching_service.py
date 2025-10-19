# Services/stock_matching_service.py
import base64
import json
import requests
from django.conf import settings


def match_stock_with_list(image_file, list_id, inventory_list_items):
    """
    Compares stock image with inventory list items to find missing items
    and suggests cheapest places to buy them.
    
    Args:
        image_file: Uploaded image of current stock
        list_id: ID of the inventory list to compare against
        inventory_list_items: List of items from the inventory list
    
    Returns:
        JSON with restock_list and cheapest_info
    """
    
    # Build the list of required items
    required_items = []
    for item in inventory_list_items:
        required_items.append({
            "name": item.get('name', ''),
            "quantity": item.get('quantity', '')
        })
    
    # System prompt for stock matching
    system_prompt = (
        "You are a grocery inventory comparison assistant. "
        "You will receive an image of current stock/pantry and a list of required items. "
        "Your task is to:\n"
        "1. Identify what items from the required list are MISSING or INSUFFICIENT in the stock image\n"
        "2. Determine the cheapest store to buy these missing items (consider Walmart, Target, Costco, Aldi, etc.)\n"
        "3. Provide an estimated total cost for all missing items\n\n"
        "Respond ONLY with valid JSON in this exact format:\n"
        "{\n"
        '  "restock_list": ["item1 quantity", "item2 quantity", ...],\n'
        '  "cheapest_info": {\n'
        '    "store": "Store Name",\n'
        '    "estimated_total_cost": 0.00\n'
        "  }\n"
        "}\n"
        "Do NOT include markdown, explanations, or any text outside the JSON."
    )
    
    # Build content parts
    parts = []
    
    # Add image if provided
    if image_file:
        img_bytes = image_file.read()
        b64_data = base64.b64encode(img_bytes).decode('utf-8')
        parts.append({
            "inlineData": {
                "mimeType": image_file.content_type,
                "data": b64_data
            }
        })
    
    # Create the text prompt with required items
    required_items_text = "\n".join([
        f"- {item['name']}: {item['quantity']}" 
        for item in required_items
    ])
    
    text_prompt = (
        f"{system_prompt}\n\n"
        f"Required items from inventory list (ID: {list_id}):\n"
        f"{required_items_text}\n\n"
        "Analyze the stock image and identify which items are missing or need restocking. "
        "Format quantities like '3 gallons', '2 bags', '1 bottle', etc."
    )
    
    parts.append({"text": text_prompt})
    
    # Build request payload
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": parts
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
            print("Gemini API error:", response.text)
            return {"error": f"Gemini API error: {response.text}"}
        
        # Parse response
        result = response.json()
        model_text = result["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean and parse JSON
        cleaned_text = model_text.strip().replace("```json", "").replace("```", "").strip()
        parsed_json = json.loads(cleaned_text)
        
        # Validate response structure
        if "restock_list" not in parsed_json or "cheapest_info" not in parsed_json:
            return {
                "error": "Invalid response format from Gemini",
                "raw_output": parsed_json
            }
        
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