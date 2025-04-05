from chatbot_llm import budget_llm_chat

 
while True:    
    user_input = input("💬 You: ")
    reply = budget_llm_chat(user_input)
    print("🤖 Bot:", reply)
