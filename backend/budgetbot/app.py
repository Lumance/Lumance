from models import Session, Conversation

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    user_id = request.json.get("user_id", "default_user")  # Can be user email/ID

    # Fetch last few messages for context
    session = Session()
    history = session.query(Conversation).filter_by(user_id=user_id).order_by(Conversation.timestamp.desc()).limit(5).all()
    context = "\n".join([f"User: {c.message}\nBot: {c.reply}" for c in reversed(history)])

    # Append to user input
    full_input = context + f"\nUser: {user_input}\nBot:"

    reply = budget_llm_chat(full_input)

    # Save conversation
    new_conv = Conversation(user_id=user_id, message=user_input, reply=reply)
    session.add(new_conv)
    session.commit()

    return jsonify({"reply": reply})
