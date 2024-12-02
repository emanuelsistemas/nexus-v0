from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração do PostgreSQL
DATABASE_URL = "postgresql://nexus:nexus@db/nexus"

# Criar engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Configurar sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
