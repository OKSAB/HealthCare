from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.session import get_db
from schemas.schemas import ChatReturn, ChatInput, ConversationReturn
from models.models import Conversation, Chat, Chat_type_enum, User
import httpx


router=APIRouter()
response_url="https://c718-34-87-79-119.ngrok-free.app/ask"

@router.post('/prompt',response_model=ConversationReturn, status_code=201)
async def send_prompt(prompt:ChatInput, db:Session=Depends(get_db)):
    try:
        user=db.query(User).filter_by(id=prompt.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not registered"
            )
        if not prompt.conversation_id:
            conversation=Conversation(
                title=f"Conversation {len(user.conversations)+1}",
                user_id=prompt.user_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            prompt.conversation_id=conversation.id
        new_chat=Chat(
            text=prompt.text,
            conversation_id=prompt.conversation_id
        )
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        async with httpx.AsyncClient(timeout=40) as client:
            ai_response=await client.post(response_url, json={"prompt":new_chat.text})
            ai_response_return=ai_response.json()
            response= ai_response_return['detail']
        new_response=Chat(
            text=response.strip(),
            conversation_id=prompt.conversation_id,
            chat_type=Chat_type_enum("Response")._value_
        )
        db.add(new_response)
        db.commit()
        db.refresh(new_response)
        all_conversation=db.query(Conversation).filter_by(id=prompt.conversation_id).first()
        return all_conversation
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error occurred"
            )

@router.delete('/conversation/{conversation_id}', status_code=204)
def delete_conversation(conversation_id:str, db:Session=Depends(get_db)):
    conversation=db.query(Conversation).filter_by(id=conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Conversation not found'
        )
    db.delete(conversation)
    db.commit()
    return {"detail":"Conversation deleted successfully"}

@router.delete('/chat/{chat_id}')
def delete_chat(chat_id:str, db:Session=Depends(get_db)):
    chat=db.query(Chat).filter_by(id=chat_id).first()
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    db.delete(chat)
    db.commit()
    return {"detail":"Chat deleted successfully"}