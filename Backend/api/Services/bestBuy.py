import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Import the official Google GenAI SDK
from google import genai
from google.genai.errors import APIError

# --- CORRECTED IMPORT ---
# Import the function that *returns* the list, not the variable itself.
try:
    from GemImgGen import get_grocery_items
except ImportError:
    # Handle case where GemImgGen.py is not in the correct path or missing the function
    print("Error: Could not import 'get_grocery_items' from GemImgGen.")
    print("Please ensure GemImgGen.py is in the correct directory and contains the get_grocery_items function.")
    exit(1)

# --- Setup ---

# Load API key from the environment
load_dotenv(Path('Backend/config/.env'))
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Use a print statement instead of raising an error to keep the execution flow cleaner
    print("WARNING: GEMINI_API_KEY not found in environment variables. Check .env content and file path.")

try:
    # Initialize the client with the retrieved API key
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    exit()

# 🛒 Dynamic List Population 
print("--- Calling GemImgGen to get user_items list from image analysis... ---")
# Call the function to populate the user_items list
user_items = get_grocery_items() 
print(f"--- Received {len(user_items)} items. ---")

# Fallback in case the image processing failed or returned an empty list
if not user_items:
    print("WARNING: user_items list is empty. Using a default fallback list.")
    user_items = ["milk 1 gallon", "large eggs dozen", "basmati rice 5kg"] 

# --- Prompt Generation ---

system_instruction = (
    "You are a sophisticated grocery price comparison and savings assistant. "
    "Use your search tool to find **estimated** real-time prices for the items. **Crucially, when searching, use the exact item name and quantity/unit provided in the input list** (e.g., search for 'blueberries 1 bowl price' or 'salami 1 stick price'). If an exact price cannot be found, use a reasonable estimate (imputation) and state this in your reasoning, rather than using 'null'."
    "There will be some random items in list which dont make sense for example white bottles, random jar items that dont exist which you have toi handle and not search."
    "at the specified stores near the University of Charlotte area. "
    "Also, search for any general digital coupons or weekly deals for these items at these stores. "
    "Based on the prices and coupons found, you must calculate the total estimated cost for the entire list as per quantity "
    "at each store and identify the single cheapest store for the complete basket."
    "also later create list with final cheap price with item quantity and coupon if applicable"
    "\n\nYOUR FINAL OUTPUT MUST BE ONLY A SINGLE JSON OBJECT. DO NOT INCLUDE ANY INTRODUCTORY TEXT, EXPLANATIONS, OR MARKDOWN BACKTICKS (```)."
)

prompt = f"""
1. Items to Price Compare: {user_items}
2. Stores to Check (near University of Charlotte): Walmart, Food Lion, and Harris Teeter.

## Required JSON Structure:
{{
    "price_estimates": [
        {{
            "item": "item name",
            "prices": {{
                "Walmart": price_in_usd,
                "Food Lion": price_in_usd, 
                "Harris Teeter": price_in_usd 
            }}
        }}
    ],
    "coupons_and_deals": [
        {{
            "store": "Store Name",
            "deal": "Specific coupon or weekly special found (e.g., HT: Eggs $0.50 off with app)",
            "applies_to_items": ["item name 1", "item name 2"]
        }}
    ],
    "cheapest_store_recommendation": {{
        "store": "The Store with the lowest estimated total basket cost.",
        "estimated_total_cost": total_cost_after_coupons
    }}
}}

If a price cannot be found, use 0.0 or null for the price.
"""

# --- API Call ---

try:
    # Define the schema outside of the config for cleaner use in the SDK
    response_schema = {
        "type": "object",
        "properties": {
            "price_estimates": {
                "type": "array",
                "items": { 
                    "type": "object",
                    "properties": {
                        "item": {"type": "string"},
                        "prices": {
                            "type": "object",
                            "properties": {
                                "Walmart": {"type": "number"},
                                "Food Lion": {"type": "number"},
                                "Harris Teeter": {"type": "number"}
                            },
                            "required": ["Walmart", "Food Lion", "Harris Teeter"]
                        }
                    },
                    "required": ["item", "prices"]
                }
            },
            "coupons_and_deals": {
                "type": "array",
                "items": { 
                    "type": "object",
                    "properties": {
                        "store": {"type": "string"},
                        "deal": {"type": "string"},
                        "applies_to_items": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["store", "deal", "applies_to_items"]
                }
            },
            "cheapest_store_recommendation": {
                "type": "object",
                "properties": { 
                    "store": {"type": "string"},
                    "estimated_total_cost": {"type": "number"}
                },
                "required": ["store", "estimated_total_cost"]
            }
        },
        "required": ["price_estimates", "coupons_and_deals", "cheapest_store_recommendation"]
    }
    
    print("\n--- Sending request to Gemini for price comparison... ---")
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt,
        config={
            "system_instruction": system_instruction,
            "tools": [{"google_search": {}}], 
            # Using response_schema to enforce JSON structure
            "response_schema": response_schema
        }
    )

    # --- Response Parsing (Robust Workaround) ---
    
    response_text = response.text.strip()
    
    if not response_text:
        print("API returned an empty response.")
        exit()

    try:
        # CLEANUP: Attempt to strip markdown wrappers that the model might still use
        if response_text.startswith("```json"):
            json_text = response_text.replace("```json", "").replace("```", "").strip()
        else:
            json_text = response_text
            
        all_data = json.loads(json_text)
        print("\n--- SUCCESSFULLY PARSED GROCERY ESTIMATES AND RECOMMENDATION ---")
        print(json.dumps(all_data, indent=2))
        print("------------------------------------------------------------------")

    except json.JSONDecodeError as e:
        print("\n--- FAILED TO PARSE RESPONSE AS JSON ---")
        print(f"JSON Decoding Error: {e}")
        print("\nRaw Response Text (check if it looks like JSON):")
        print(response_text)
        print("---------------------------------------")
        
except APIError as e:
    print(f"\n--- GEMINI API ERROR ---")
    print(f"An API error occurred: {e}")
    print("--------------------------")
except Exception as e:
    print(f"\n--- AN UNEXPECTED ERROR OCCURRED ---")
    print(f"Error: {e}")
    print("------------------------------------")

# Save parsed response for reuse
if 'all_data' in locals():
    final_output = all_data
else:
    final_output = {
        "price_estimates": [],
        "coupons_and_deals": [],
        "cheapest_store_recommendation": {}
    }