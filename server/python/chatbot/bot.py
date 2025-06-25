import os
import warnings
import logging
import sys
import absl.logging
from fastapi import FastAPI
from pydantic import BaseModel
from chat_engine import handle_user_query  # Your existing function

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

app = FastAPI()

# Define a request body model
class ChatRequest(BaseModel):
    user_id: str
    user_input: str


@app.post("/chat")
async def chat(request: ChatRequest):
    while True:
        user_input = request.user_input
        user_id = request.user_id
        if user_input.lower() in ["exit", "quit"]:
            break
        
        response = handle_user_query(user_id, user_input)
        return {"response": response}