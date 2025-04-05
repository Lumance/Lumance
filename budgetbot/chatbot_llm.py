import openai
from ml_predictor import predict_next_week_spending
from allowance_advisor import calculate_allowance

openai.api_key = "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"

def budget_llm_chat(prompt: str):
    prediction = predict_next_week_spending()
    allowance, spent = calculate_allowance()

    system_context = f"""You are a smart finance assistant.
Last week's spending was ₹{spent}.
Predicted spending next week is ₹{prediction}.
Suggested allowance is ₹{allowance}.
Help the user manage their money wisely."""

    from openai import OpenAI

    client = OpenAI(api_key="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")  # or use `os.environ['OPENAI_API_KEY']`

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_context},
            {"role": "user", "content": prompt}
        ]
    )
    reply = response.choices[0].message.content
