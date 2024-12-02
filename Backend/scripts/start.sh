#!/bin/bash

set -e

echo "[$(date)] Iniciando script de inicialização"

# Verificar variáveis de ambiente
echo "[$(date)] Verificando variáveis de ambiente:"
echo "POSTGRES_USER: ${POSTGRES_USER:-não definido}"
echo "POSTGRES_SERVER: ${POSTGRES_SERVER:-não definido}"
echo "POSTGRES_DB: ${POSTGRES_DB:-não definido}"

# Verificar se o diretório atual tem os arquivos necessários
echo "[$(date)] Listando arquivos no diretório atual:"
ls -la

# Verificar se o Python e pip estão funcionando
echo "[$(date)] Versão do Python:"
python --version
echo "[$(date)] Versão do pip:"
pip --version

# Verificar se os módulos Python necessários estão instalados
echo "[$(date)] Módulos Python instalados:"
pip list

# Esperar pelo banco de dados
echo "[$(date)] Aguardando PostgreSQL em ${POSTGRES_SERVER:-db}:5432..."

until nc -z ${POSTGRES_SERVER:-db} 5432; do
    echo "[$(date)] PostgreSQL não está pronto - aguardando..."
    sleep 2
done

echo "[$(date)] PostgreSQL está pronto!"

# Verificar estrutura do projeto
echo "[$(date)] Estrutura do projeto:"
tree -L 3

# Tentar importar os módulos principais
echo "[$(date)] Testando importações Python:"
python << 'EOF'
try:
    import fastapi
    print("✓ FastAPI importado com sucesso")
    import uvicorn
    print("✓ Uvicorn importado com sucesso")
    import paramiko
    print("✓ Paramiko importado com sucesso")
    from src.core.config import settings
    print("✓ Configurações importadas com sucesso")
    print(f"✓ URL do banco de dados: {settings.DATABASE_URL}")
except Exception as e:
    print(f"✗ Erro ao importar: {str(e)}")
EOF

echo "[$(date)] Iniciando servidor uvicorn..."
exec uvicorn src:app --host 0.0.0.0 --port 8000 --reload --log-level debug
