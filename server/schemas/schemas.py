from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSignUp(BaseModel):
    email: str
    password: str
    first_name: Optional[str]=None 
    last_name: Optional[str]=None 
    dob: Optional[str]=None 
    height: Optional[str]=None
    weight: Optional[str]=None

class UserSignIn(BaseModel):
    email: str
    password: str

# For updating user
class UserUpdate(BaseModel):
    first_name: Optional[str]=None
    last_name: Optional[str]=None
    dob: Optional[str]=None
    height: Optional[str]=None
    weight: Optional[str]=None

class ChatReturn(BaseModel):
    id:str
    text:str
    created_at:datetime
    conversation_id:str
    chat_type:str

    class Config:
        from_attributes=True

class ConversationReturn(BaseModel):
    id:str
    title:str
    chats:list[ChatReturn]=[]

    class Config:
        from_attributes=True

class UserReturn(BaseModel):
    id:str
    email:str
    first_name:Optional[str]=None
    last_name:Optional[str]=None
    dob:Optional[str]=None
    height:Optional[str]=None
    weight:Optional[str]=None
    conversations:list[ConversationReturn]=[]

    class Config:
        from_attributes=True

class ChatInput(BaseModel):
    text:str
    conversation_id:Optional[str]=None
    user_id:Optional[str]=None