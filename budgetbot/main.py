from budget_analyzer import load_transactions, get_weekly_summary

def chatbot():
    df = load_transactions()
    while True:
        msg = input("You: ")
        if "spend" in msg:
            this, last = get_weekly_summary(df)
            print(f"🤖 You spent ₹{this} last week. That's ₹{this - last:+.0f} compared to the week before.")
        elif "allowance" in msg:
            weekly_budget = 6000  # Example logic
            print(f"🤖 Your weekly allowance should be ₹{weekly_budget}.")
        elif "exit" in msg:
            break

chatbot()
