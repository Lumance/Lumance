from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    message = Column(Text)
    reply = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

engine = create_engine('sqlite:///chat_history.db')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
