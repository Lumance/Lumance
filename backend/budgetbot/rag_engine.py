# rag_engine.py

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFaceHub  # or your LLM of choice

# Load tips from file
def load_documents():
    loader = TextLoader("data/financial_tips.txt")
    docs = loader.load()
    return docs

# Build retriever DB
def build_vectorstore(docs):
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings()  # or OpenAIEmbeddings
    vectorstore = FAISS.from_documents(chunks, embeddings)
    return vectorstore

# Final QA chain
def get_budget_advice(user_query):
    docs = load_documents()
    vectorstore = build_vectorstore(docs)

    retriever = vectorstore.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(
        llm=HuggingFaceHub(repo_id="google/flan-t5-base", model_kwargs={"temperature": 0}),
        retriever=retriever
    )

    answer = qa_chain.run(user_query)
    return answer
