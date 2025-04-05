import pandas as pd
from datetime import datetime

def calculate_allowance(csv_path="data/transactions.csv", monthly_income=20000, target_savings=5000):
    df = pd.read_csv(csv_path, parse_dates=["date"])
    now = datetime.today()
    df = df[df["type"] == "expense"]
    df = df[df["date"].dt.month == now.month]
    spent = df["amount"].sum()

    weeks_left = 4 - (now.day // 7)
    budget_left = monthly_income - spent - target_savings
    weekly_allowance = max(0, budget_left / max(1, weeks_left))

    return round(weekly_allowance, 2), spent
