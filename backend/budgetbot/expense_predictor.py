import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

def train_model(csv_path="data/expenses.csv", model_path="models/predictor.pkl"):
    df = pd.read_csv(csv_path)
    df['Week'] = range(1, len(df) + 1)
    X = df[['Week']]
    y = df['Amount']
    model = LinearRegression()
    model.fit(X, y)
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)

def predict_next_week(model_path="models/predictor.pkl"):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    weeks = [[8]]  # hardcoded; replace with dynamic logic
    return model.predict(weeks)[0]
