from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
import sys
import traceback

print(f"[STARTUP] Python version: {sys.version}")
print(f"[STARTUP] Python path: {sys.path}")

try:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )
    print("[STARTUP] FastAPI app criada com sucesso")

    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("[STARTUP] CORS configurado com sucesso")

    # Middleware para logging
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        print(f"[REQUEST] {request.method} {request.url}")
        try:
            response = await call_next(request)
            print(f"[RESPONSE] {request.method} {request.url} - Status: {response.status_code}")
            return response
        except Exception as e:
            print(f"[ERROR] {request.method} {request.url} - Error: {str(e)}")
            print("[ERROR] Traceback: {}".format("".join(traceback.format_tb(e.__traceback__))))
            raise

    # Rota de teste
    @app.get("/")
    async def read_root():
        print("[INFO] Rota raiz acessada")
        return {"message": f"{settings.PROJECT_NAME} API is running", "version": settings.VERSION}

    # Incluir rotas
    print("[STARTUP] Importando módulos de rotas...")
    from .api import ssh
    from .auth.router import router as auth_router
    from .projects.router import router as projects_router
    print("[STARTUP] Módulos importados com sucesso")

    app.include_router(ssh.router, prefix=f"{settings.API_V1_STR}/ssh", tags=["ssh"])
    app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    app.include_router(projects_router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
    print("[STARTUP] Rotas registradas com sucesso")

    print("[STARTUP] Aplicação iniciada com sucesso!")

except Exception as e:
    print(f"[FATAL] Erro ao iniciar aplicação: {str(e)}")
    print("[FATAL] Traceback: {}".format("".join(traceback.format_tb(e.__traceback__))))
    raise
