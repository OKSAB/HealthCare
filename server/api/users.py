from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from schemas.schemas import UserSignUp,UserSignIn, UserReturn, UserUpdate
from config.session import get_db
from models.models import User
from sqlalchemy.orm import Session

router=APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post('/signup',status_code=201)
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

    return {"detail": "User created successfully"}

@router.post("/signin", response_model=UserReturn)
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

    return db_user

@router.get("/users/{user_email}", response_model=UserReturn)
def get_user_details(user_email: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return db_user

@router.put("/users/{user_email}")
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