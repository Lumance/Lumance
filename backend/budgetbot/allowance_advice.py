def generate_allowance_advice(spent_last_week, predicted_next):
    limit = predicted_next * 0.9
    if spent_last_week > limit:
        return f"⚠️ You overspent last week. Try to keep it under ₹{limit:.2f}."
    else:
        return f"✅ Good job! Your predicted spend is ₹{predicted_next:.2f}. Keep going!"
