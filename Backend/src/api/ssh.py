from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import paramiko

router = APIRouter()

class SSHConfig(BaseModel):
    host: str
    username: str
    password: Optional[str] = None
    port: int = 22

class SSHCommand(BaseModel):
    command: str

_ssh_client = None

@router.post("/connect")
def connect(config: SSHConfig):
    global _ssh_client
    try:
        _ssh_client = paramiko.SSHClient()
        _ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        _ssh_client.connect(
            hostname=config.host,
            username=config.username,
            password=config.password,
            port=config.port
        )
        return {"message": "Conexão SSH estabelecida com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute")
def execute_command(command: SSHCommand):
    global _ssh_client
    if not _ssh_client:
        raise HTTPException(status_code=400, detail="Não há conexão SSH ativa")
    
    try:
        stdin, stdout, stderr = _ssh_client.exec_command(command.command)
        return {
            "stdout": stdout.read().decode(),
            "stderr": stderr.read().decode(),
            "exit_code": stdout.channel.recv_exit_status()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/disconnect")
def disconnect():
    global _ssh_client
    if _ssh_client:
        _ssh_client.close()
        _ssh_client = None
    return {"message": "Conexão SSH encerrada"}

@router.get("/public-key")
def get_public_key():
    try:
        with open("/root/.ssh/id_rsa.pub", "r") as f:
            return {"public_key": f.read().strip()}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Chave pública não encontrada")
