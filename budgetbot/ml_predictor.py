import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def predict_next_week_spending(csv_path="data/transactions.csv"):
    df = pd.read_csv(csv_path, parse_dates=["date"])
    df = df[df["type"] == "expense"]
    df["week"] = df["date"].dt.to_period("W").apply(lambda r: r.start_time)
    weekly = df.groupby("week")["amount"].sum().reset_index()

    weekly["week_num"] = range(len(weekly))
    X = weekly[["week_num"]]
    y = weekly["amount"]

    model = LinearRegression().fit(X, y)
    next_week = [[len(weekly)]]
    predicted = model.predict(next_week)[0]

    return round(predicted, 2)
