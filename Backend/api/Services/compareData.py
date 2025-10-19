import os
import json
import time
import sys
from pathlib import Path
from dotenv import load_dotenv

# ✅ Import the Google GenAI SDK
from google import genai
from google.genai.errors import APIError

# -------------------------------------------------------------------
# 0️⃣ Import final_output from bestBuy.py (safe path handling)
# -------------------------------------------------------------------
try:
    # Ensure we can import from the same directory as this script
    script_dir = Path(__file__).resolve().parent
    sys.path.append(str(script_dir))
    from bestBuy import final_output
except Exception as e:
    print(f"⚠️ Could not import bestBuy.final_output ({e}) — using fallback empty data.")
    final_output = {
        "price_estimates": [],
        "coupons_and_deals": [],
        "cheapest_store_recommendation": {"store": None, "estimated_total_cost": 0.0},
    }

# -------------------------------------------------------------------
# 1️⃣ Load environment variables safely
# -------------------------------------------------------------------
env_path = Path("Backend/config/.env")
if not env_path.exists():
    # fallback to local .env if Backend/config doesn't exist
    env_path = Path(".env")

load_dotenv(env_path)
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(f"❌ GEMINI_API_KEY missing. Check {env_path}")

# Initialize Gemini client
try:
    client = genai.Client(api_key=API_KEY)
except Exception as e:
    raise RuntimeError(f"❌ Failed to initialize Gemini client: {e}")

# -------------------------------------------------------------------
# 2️⃣ Inventory Data
# -------------------------------------------------------------------
inventory_target = [
    "spaghetti 5 container", "fusilli pasta 1 bag", "rotini pasta 2 bag",
    "ground coffee 2 can", "green beans 3 cans", "luncheon meat 1 can",
    "olive oil 2 bottle", "vegetable oil 1 bottle", "citrus blend juice 1 bottle",
    "fruity juice 1 bottle", "graham crackers 1 box", "vegetable beef soup 1 can",
    "baked beans 3 cans", "chunky salsa 1 jar", "ketchup 1 bottle",
    "pasta sauce 1 jar", "stewed tomatoes 1 can", "tuna 6 cans","Milk 3 galons"
]

# -------------------------------------------------------------------
# 2️⃣ Extract Grocery Data (Safe + Clean)
# -------------------------------------------------------------------
try:
    price_estimates = final_output.get("price_estimates", [])
    if not isinstance(price_estimates, list):
        raise ValueError("Invalid format: 'price_estimates' must be a list")

    # ✅ Collect all item names safely
    stock_actual = [
        str(item.get("item", "")).strip()
        for item in price_estimates
        if isinstance(item, dict) and item.get("item")
    ]

    # ✅ Safely extract cheapest store info
    cheapest_store_data = final_output.get("cheapest_store_recommendation", {})
    if not isinstance(cheapest_store_data, dict):
        cheapest_store_data = {}

    cheapest_info = {
        "store": cheapest_store_data.get("store", "Unknown"),
        "estimated_total_cost": float(cheapest_store_data.get("estimated_total_cost", 0.0))
    }

    print("📦 Current Stock (from bestBuy):", stock_actual or "❌ Empty")
    print("💰 Cheapest Store Info:", cheapest_info)

    if not stock_actual:
        print("\n⚠️ No items found in stock_actual. Check bestBuy output consistency.")
        stock_actual = []

except Exception as e:
    print("\n❌ Error parsing grocery data:", e)
    stock_actual, cheapest_info = [], {"store": "Unknown", "estimated_total_cost": 0.0}


# -------------------------------------------------------------------
# 3️⃣ Gemini prompt setup
# -------------------------------------------------------------------
MODEL_NAME = "gemini-2.5-flash"

system_instruction = (
    "You are an inventory management assistant. Compare 'Inventory Target' and 'Actual Stock' "
    "and generate a Python list named restock_list based on these rules:\n"
    "1. Include any missing item from Inventory Target.\n"
    "2. If an item exists but quantity is lower, include the difference.\n"
    "Output must be ONLY: restock_list = [...], no markdown or explanation."
)

prompt = f"""
Inventory Target: {inventory_target}
Actual Stock: {stock_actual}
Generate restock_list based on rules.
"""

# -------------------------------------------------------------------
# 4️⃣ Gemini Call (with retry)
# -------------------------------------------------------------------
def call_gemini_with_retry(model, contents, system_instruction, max_attempts=3):
    for attempt in range(1, max_attempts + 1):
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config={
                    "system_instruction": system_instruction,
                    "response_mime_type": "text/plain"
                }
            )
            if hasattr(response, "text"):
                return response.text
            else:
                return response.candidates[0].content.parts[0].text

        except APIError as e:
            print(f"⚠️ Gemini APIError (Attempt {attempt}/{max_attempts}): {e}")
        except Exception as e:
            print(f"⚠️ Unexpected error (Attempt {attempt}/{max_attempts}): {e}")
        time.sleep(attempt * 2)
    raise RuntimeError("❌ Gemini API failed after multiple attempts.")


# -------------------------------------------------------------------
# 5️⃣ Process Gemini Response
# -------------------------------------------------------------------
try:
    print("\n--- Sending request to Gemini for restock analysis... ---")
    raw_text = call_gemini_with_retry(MODEL_NAME, prompt, system_instruction)
    print("\n--- Raw Gemini Response ---\n", raw_text)

    restock_list = []
    cleaned = raw_text.strip().replace("```", "").replace("python", "").strip()
    if "restock_list" in cleaned:
        exec(cleaned, {}, locals())
        restock_list = locals().get("restock_list", [])

    print("\n✅ Final Restock List =", restock_list)

    # ✅ Save output to /output/restock.json
    out_dir = Path(__file__).resolve().parent / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "restock.json"

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(
            {"restock_list": restock_list, "cheapest_info": cheapest_info},
            f, indent=2
        )

    print(f"💾 Saved restock.json successfully at {out_file}")

except Exception as e:
    print("\n--- ERROR ---")
    print(e)
    print("--------------------------")
