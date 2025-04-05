from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters
from budget_analyzer import load_transactions, get_weekly_summary

async def start(update, context):
    await update.message.reply_text("Hi! I'm BudgetBot 🤖 Ask me about your spending or allowance!")

async def respond(update, context):
    msg = update.message.text.lower()
    df = load_transactions()
    this, last = get_weekly_summary(df)

    if "spend" in msg:
        await update.message.reply_text(f"You spent ₹{this:.2f} last week. Change from last week: ₹{this - last:+.2f}")
    elif "allowance" in msg:
        allowance = 6000  # static, or calculate from past spending
        await update.message.reply_text(f"Your weekly allowance should be ₹{allowance}")
    else:
        await update.message.reply_text("Try asking: 'How much did I spend last week?' or 'What’s my allowance?'")

def main():
    app = ApplicationBuilder().token("8033517041:AAHwOzX2XrlbXPsf01yD2re8wsl9g6qz4nA").build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, respond))
    app.run_polling()

if __name__ == "__main__":
    main()
