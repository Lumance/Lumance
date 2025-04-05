from datetime import datetime, timedelta
import pandas as pd

def load_transactions(path="data/transactions.csv"):
    df = pd.read_csv(path, parse_dates=["date"])
    return df

def get_weekly_summary(df):
    today = datetime.today()
    this_week = df[df["date"] > today - timedelta(days=7)]
    last_week = df[(df["date"] > today - timedelta(days=14)) & (df["date"] <= today - timedelta(days=7))]

    this_week_total = this_week[this_week["type"] == "expense"]["amount"].sum()
    last_week_total = last_week[last_week["type"] == "expense"]["amount"].sum()

    return this_week_total, last_week_total
