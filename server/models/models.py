from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func, Enum
import uuid
from sqlalchemy.orm import relationship
import pytz
from models.db import Base
from enum import Enum as pyenum


class User(Base):
    __tablename__ = "users"

    id = Column(String, default=lambda :str(uuid.uuid4()), unique=True, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    height = Column(String, nullable=True)
    weight = Column(String, nullable=True)

    #relationships
    conversations=relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

class Conversation(Base):
    __tablename__='conversations'

    id=Column(String, default=lambda:str(uuid.uuid4()), unique=True, primary_key=True, index=True)
    title=Column(Text, nullable=False)
    user_id=Column(String, ForeignKey("users.id"))

    #relationships
    user=relationship("User", back_populates="conversations")
    chats=relationship("Chat", back_populates='conversation', cascade="all, delete-orphan")

class Chat_type_enum(pyenum):
    Prompt="Prompt"
    Response="Response"

class Chat(Base):
    __tablename__="chats"

    id = Column(String, default=lambda :str(uuid.uuid4()), unique=True, primary_key=True, index=True)
    text=Column(Text, nullable=False)
    chat_type=Column(Enum(Chat_type_enum), nullable=False, default=Chat_type_enum("Prompt")._value_)
    conversation_id=Column(String, ForeignKey("conversations.id"),nullable=False)
    created_at=Column(DateTime, server_default=func.now(tz=pytz.utc))

    #relationships
    conversation=relationship("Conversation",back_populates="chats")