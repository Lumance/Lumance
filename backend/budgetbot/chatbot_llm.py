# chatbot_llm.py

from groq import Groq
from rag_engine import get_budget_advice
import os
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression
import numpy as np

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Example ML model for prediction (can be moved to budget_predictor.py)
model = LinearRegression()
model.fit(np.array([[1], [2], [3], [4], [5]]), [100, 200, 300, 400, 500])  # Dummy training

def budget_llm_chat(user_input):
    try:
        # Step 1: RAG context
        rag_context = get_budget_advice(user_input)

        # Step 2: Example ML-based weekly allowance prediction
        weeks_tracked = 6  # Example input
        predicted_allowance = model.predict(np.array([[weeks_tracked]]))[0]

        # Step 3: Final prompt to LLM
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful personal finance assistant. "
                    "You help users save money, track expenses, and manage allowances. "
                    "You know about budgeting techniques and financial discipline."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Here's some advice/context:\n{rag_context}\n\n"
                    f"My question is: {user_input}\n"
                    f"What should be my allowance for next week based on past data?\n"
                    f"Predicted Weekly Allowance: ₹{predicted_allowance:.2f}"
                )
            }
        ]

        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",  # Or any Groq-supported model
            messages=messages,
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"⚠️ Error: {str(e)}"
