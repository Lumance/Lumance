# rag_engine.py

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEndpoint
import os

retriever_cache = None  # optional: use for caching

def build_vectorstore():
    loader = TextLoader("data/financial_tips.txt")
    docs = loader.load()
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    return vectorstore.as_retriever()

def get_budget_advice(user_query):
    global retriever_cache
    if not retriever_cache:
        retriever_cache = build_vectorstore()

    llm = HuggingFaceEndpoint(
        repo_id="HuggingFaceH4/zephyr-7b-beta",
        task="text-generation",
        huggingfacehub_api_token=os.getenv("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"),
        temperature=0.3
    )

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever_cache,
        return_source_documents=False
    )

    return chain.invoke(user_query)["result"]