# chat_engine.py

from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEndpoint
from memory_manager import MemoryManager
from rag_engine import build_vectorstore

retriever = build_vectorstore()
memory = MemoryManager()

llm = HuggingFaceEndpoint(
    repo_id="HuggingFaceH4/zephyr-7b-beta",
    task="text-generation",
    temperature=0.3,
    huggingfacehub_api_token="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"  # or use env var
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=False
)

def handle_user_query(user_id, user_input):
    # Update memory if user shares known facts
    if "income is" in user_input.lower():
        try:
            income = int(user_input.lower().split("income is")[1].split()[0])
            memory.update_context(user_id, "income", income)
        except Exception:
            pass

    user_context = memory.format_context(user_id)
    full_prompt = f"{user_context}\n\nUser said: {user_input}"

    result = qa_chain.invoke({"query": full_prompt})
    return result["result"]
