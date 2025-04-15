from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from config.session import get_db
from api import (users,chat)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(users.router)
app.include_router(chat.router)


@app.get('/')
def home():
    return {"detail":"This is the homepage"}



if __name__=="__main__":
    
    app.run(host="0.0.0.0", port=8000)