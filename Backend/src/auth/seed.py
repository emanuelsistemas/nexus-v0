from sqlalchemy.orm import Session
from . import get_password_hash
from ..database.models import User, UserRole
from ..database import SessionLocal

def create_default_user(db: Session):
    default_user = User(
        email="emanuel@gmail.com",
        username="emanuel",
        full_name="Emanuel",
        hashed_password=get_password_hash("123456"),
        role=UserRole.ADMIN,
        is_active=True
    )
    
    existing_user = db.query(User).filter(User.email == default_user.email).first()
    if not existing_user:
        db.add(default_user)
        db.commit()
        print("Usuário padrão criado com sucesso!")
    else:
        print("Usuário padrão já existe!")

def seed_database():
    db = SessionLocal()
    try:
        create_default_user(db)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
