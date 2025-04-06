import os
import warnings
import logging
import sys
import absl.logging



absl.logging.set_verbosity(absl.logging.ERROR)


warnings.filterwarnings("ignore")

# Suppress TensorFlow and CUDA logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Suppress other annoying logs
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
warnings.filterwarnings("ignore")

# Optional: Silence stderr completely (no CUDA/TF errors in terminal)
sys.stderr = open(os.devnull, 'w')



from chat_engine import handle_user_query

if __name__ == "__main__":
    user_id = "default_user"

    print("💬 BudgetBot is ready! Type 'exit' to quit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break

        response = handle_user_query(user_id, user_input)
        print(f"🤖 Bot: {response}")
