from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ..auth import router as auth_router

app = FastAPI(
    title="Nexus API",
    description="API para o sistema Nexus de assistente de desenvolvimento",
    version="0.1.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo os routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do Nexus!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
