from google import genai
from PIL import Image
import time
import os
from pathlib import Path
from dotenv import load_dotenv

# 🚨 SECURITY WARNING: Hardcoding keys like this is NOT recommended for production.
# This is done strictly for a quick local demonstration.
# Use environment variables or a secure secret manager for real applications.
load_dotenv(Path('Backend/config/.env'))
HARDCODED_GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --- Configuration ---
MODEL_NAME = "gemini-2.5-flash"
IMAGE_FILE_PATH ='Backend/dataset/images/p1.jpg'
PROMPT = """
Analyze the image of a grocery setting (like a kitchen, pantry, or supermarket aisle).
Crucially, generate a Python list named 'user_items' containing strings, where each string is a visible **grocery item** followed by its estimated quantity (e.g., 'apple 5', 'baguette 1', 'butter 2 sticks').

Example format for the list:
['milk 1 gallon', 'large eggs dozen', 'basmati rice 5kg']

Do not include any architectural description, other text, explanation, or markdown formatting (like ```json or ```python) in your response. The response must *only* be the list assignment: user_items = [...]
"""

def describe_image_hardcoded(image_path: str, prompt: str, model_name: str, api_key: str) -> tuple[str, str | None]:
    """
    Connects to the Gemini API and returns the full response text 
    and the raw text containing the 'user_items' list assignment.
    """
    try:
        start_time = time.time()
        
        # 1. Initialize the client using the hardcoded key
        client = genai.Client(api_key=api_key)

        # 2. Open the image file
        img = Image.open(image_path)
        
        # 3. Call the API with Multimodal Content
        response = client.models.generate_content(
            model=model_name,
            contents=[prompt, img]
        )
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        raw_text = response.text.strip()
        
        full_output = (
            f"\n--- Gemini Image Description ---\n"
            f"{raw_text}\n"
            f"--------------------------------\n"
            f"API Call Time (Excluding network latency to first token): {execution_time:.2f} seconds."
        )

        return full_output, raw_text

    except FileNotFoundError:
        return f"Error: Image file not found at '{IMAGE_FILE_PATH}'.", None
    except Exception as e:
        return f"An error occurred during the API call: {e}", None


# ✨ NEW FUNCTION FOR EXPORT ✨
def get_grocery_items(image_path: str = IMAGE_FILE_PATH, prompt: str = PROMPT, model_name: str = MODEL_NAME, api_key: str = HARDCODED_GEMINI_API_KEY) -> list:
    """
    Executes the image description, parses the raw output, and returns the user_items list.
    """
    if not api_key:
        print("API Key is missing for get_grocery_items.")
        return []

    # Call the core function
    _, raw_response_text = describe_image_hardcoded(image_path, prompt, model_name, api_key)

    if raw_response_text and raw_response_text.startswith("user_items = ["):
        try:
            local_vars = {}
            # SAFELY execute the string to assign the list to local_vars['user_items']
            exec(raw_response_text, {}, local_vars) 
            return local_vars.get('user_items', [])
        except Exception as e:
            print(f"Error during parsing/execution of raw response: {e}")
            return []
    
    return []


# --- Execution (Kept for testing/standalone run) ---
if __name__ == "__main__":
    if HARDCODED_GEMINI_API_KEY is None or HARDCODED_GEMINI_API_KEY == "YOUR_HARDCODED_GEMINI_API_KEY_HERE":
        print("Please replace 'YOUR_HARDCODED_GEMINI_API_KEY_HERE' with your actual key to run this code.")
    else:
        print("Starting fast execution using hardcoded Gemini 2.5 Flash...")
        
        # We still run this for the detailed printout, even though the main task 
        # is now handled by get_grocery_items for external use.
        result_output, raw_response_text = describe_image_hardcoded(IMAGE_FILE_PATH, PROMPT, MODEL_NAME, HARDCODED_GEMINI_API_KEY)
        print(result_output)

        # 🚀 NEW LOGIC START 🚀 (Redundant, but kept for console output demonstration)
        if raw_response_text and raw_response_text.startswith("user_items = ["):
            try:
                local_vars = {}
                exec(raw_response_text, {}, local_vars)
                user_items = local_vars.get('user_items')
                
                if user_items:
                    print("\n--- Parsed user_items Variable ---")
                    print(f"Variable Type: {type(user_items)}")
                    print(f"Variable Value (as a list):")
                    for item in user_items:
                        print(f"  - {item}")
                    print("----------------------------------")
                else:
                    print("\nCould not successfully parse the 'user_items' variable.")

            except Exception as e:
                print(f"\nError during parsing/execution of raw response: {e}")
        # 🚀 NEW LOGIC END 🚀