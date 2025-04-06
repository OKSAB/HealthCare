from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqladmin import Admin, ModelView
from database import SessionLocal, engine, Base
from models import User  # Make sure your models.py has height & weight columns

app = FastAPI()

# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)


# Create admin interface
# Admin interface for the User model
# 1) Initialize the Admin object
admin = Admin(app, engine)

# 2) Define an Admin View for your model
class UserAdmin(ModelView, model=User):
    # Optional customizations:
    column_list = [User.id, User.email, User.first_name, User.last_name, User.dob, User.height, User.weight]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"  # optional FontAwesome icon in the UI

# 3) Register the View with Admin
admin.add_view(UserAdmin)

@app.get("/")
def read_root():
    return {"Hello": "World"}
# -------------------
# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------
# Pydantic Models
# -------------------
class UserSignUp(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[str] = None
    height: Optional[str] = None   # can be float or string
    weight: Optional[str] = None   # can be float or string

class UserSignIn(BaseModel):
    email: str
    password: str

# For updating user
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None

# -------------------
# SIGNUP
# -------------------
@app.post("/signup", status_code=201)
def sign_up(user: UserSignUp, db: Session = Depends(get_db)):
    # Check if user email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists."
        )

    # Hash the password
    hashed_pw = pwd_context.hash(user.password)

    # Create new User DB row, including height & weight
    new_user = User(
        email=user.email,
        hashed_password=hashed_pw,
        first_name=user.first_name,
        last_name=user.last_name,
        dob=user.dob,
        height=user.height,
        weight=user.weight
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

# -------------------
# SIGNIN
# -------------------
@app.post("/signin")
def sign_in(user: UserSignIn, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Please sign up first."
        )

    # verify password
    if not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    return {"message": "Sign in successful!"}

# -------------------
# GET USER DETAILS
# -------------------
@app.get("/users/{user_email}")
def get_user_details(user_email: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return {
        "email": db_user.email,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "dob": db_user.dob,
        "height": db_user.height,
        "weight": db_user.weight
    }

# -------------------
# UPDATE USER DETAILS
# -------------------
@app.put("/users/{user_email}")
def update_user_details(user_email: str, updated_data: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Overwrite only the fields that come in
    if updated_data.first_name is not None:
        db_user.first_name = updated_data.first_name
    if updated_data.last_name is not None:
        db_user.last_name = updated_data.last_name
    if updated_data.dob is not None:
        db_user.dob = updated_data.dob
    if updated_data.height is not None:
        db_user.height = updated_data.height
    if updated_data.weight is not None:
        db_user.weight = updated_data.weight

    db.commit()
    db.refresh(db_user)

    return {"message": "Profile updated successfully"}
