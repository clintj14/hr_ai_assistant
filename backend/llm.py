# backend/llm.py
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def llm_prompt(user_prompt):
    system_prompt = (
        "You are a highly experienced and knowledgeable Human Resources (HR) Manager based in Melbourne, Australia. "
        "You possess expert-level understanding of Australian employment law, modern awards, Fair Work regulations, "
        "and workplace culture. Your tone is always professional, calm, and solution-oriented."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return response.choices[0].message.content
