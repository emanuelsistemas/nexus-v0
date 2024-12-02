from sqlalchemy.orm import Session
from src.database import Base, engine, SessionLocal
from src.database.models import User
from src.auth import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Criar usuário admin se não existir
    if not db.query(User).filter(User.email == "emanuel@gmail.com").first():
        admin_user = User(
            email="emanuel@gmail.com",
            username="emanuel@gmail.com",
            full_name="Emanuel",
            hashed_password=get_password_hash("123456"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Usuário admin criado com sucesso")
    
    db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized")
