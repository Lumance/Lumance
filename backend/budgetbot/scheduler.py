import pandas as pd
from expense_predictor import predict_next_week
from allowance_advice import generate_allowance_advice
from utils import get_last_week_spend

def send_weekly_report():
    last_week_spend = get_last_week_spend()
    predicted = predict_next_week()
    advice = generate_allowance_advice(last_week_spend, predicted)
    print("📊 Weekly Spending Report")
    print(f"Spent last week: ₹{last_week_spend:.2f}")
    print(f"Predicted this week: ₹{predicted:.2f}")
    print("Advice:", advice)
