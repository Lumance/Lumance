# app.py
import streamlit as st
import pandas as pd
import joblib

# Load the model
model = joblib.load("full_pipeline_model.pkl")

# Title
st.title("🧠 Need vs Want Classifier")

# Instructions
st.markdown("Enter your payment details to classify the expense as a **Need** or **Want**.")

# Input fields
app = st.selectbox("App Used", ['Flipkart', 'PhonePe', 'IRCTC', 'Paytm', 'Uber', 'BigBasket', 'Amazon', 'Hotstar', '1mg', 'Swiggy', 'PharmEasy', 'Cred', 'Zomato', 'Google Pay', 'Ola', 'Airtel', 'ACT Fibernet', 'Spotify', 'Netflix', 'MakeMyTrip'])
category = st.selectbox("Category", ['Subscriptions', 'Bills', 'Pets', 'Investments', 'Housing', 'Food', 'Entertainment', 'Transporation', 'Shopping', 'Health', 'Groceries', 'Studies', 'Others'])  
amount = st.number_input("Amount (₹)", min_value=1.0, step=1.0)

# Predict button
if st.button("Predict"):
    # Feature Engineering
    amount_bucket = f"{app}_{int(amount // 500)}"

    # Create DataFrame from inputs
    user_data = pd.DataFrame([{
        'App': app,
        'Category': category,
        'Amount': amount,
        'App_Amount_Bucket': amount_bucket
    }])

    # Predict
    prediction = model.predict(user_data)[0]
    label = "WANT" if prediction == 1 else "NEED"

    # Show result
    st.success(f"This seems like a **{label}** 💡")
