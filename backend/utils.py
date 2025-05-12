# backend/utils.py

def clean_input(text: str) -> str:
    return text.strip().lower()

def format_response(response: str) -> str:
    return f"🧠 HR Expert says: {response}"
