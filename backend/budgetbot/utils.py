import pandas as pd

def get_last_week_spend(csv_path="data/expenses.csv"):
    df = pd.read_csv(csv_path)
    if len(df) == 0:
        return 0
    return df.tail(1)["Amount"].values[0]
