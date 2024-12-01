#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações do PostgreSQL
DB_NAME="nexus"
DB_USER="postgres"
DB_PASSWORD="Vs05212304"

# Função para verificar se o PostgreSQL está instalado
check_postgresql() {
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}PostgreSQL não está instalado.${NC}"
        echo -e "${YELLOW}Instalando PostgreSQL...${NC}"
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
    fi
}

# Função para criar o banco de dados
create_database() {
    echo -e "${YELLOW}Criando banco de dados...${NC}"
    
    # Verifica se o banco já existe
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo -e "${YELLOW}Banco de dados $DB_NAME já existe.${NC}"
    else
        # Cria o banco de dados
        sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}Banco de dados $DB_NAME criado com sucesso.${NC}"
    fi

    # Configura a senha do usuário postgres
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
}

# Função para aplicar as migrações
apply_migrations() {
    echo -e "${YELLOW}Aplicando migrações...${NC}"
    
    # Instala as dependências Python necessárias
    pip install -r ../requirements.txt
    
    # Inicializa o Alembic se necessário
    if [ ! -d "../alembic/versions" ]; then
        alembic init alembic
    fi
    
    # Atualiza o arquivo env.py do Alembic para usar os modelos corretos
    sed -i "s/target_metadata = None/from src.database.models import Base\ntarget_metadata = Base.metadata/" ../alembic/env.py
    
    # Gera e aplica as migrações
    cd ..
    export PYTHONPATH=$PYTHONPATH:$(pwd)
    alembic revision --autogenerate -m "Initial migration"
    alembic upgrade head
    
    echo -e "${GREEN}Migrações aplicadas com sucesso.${NC}"
}

# Execução principal
echo -e "${YELLOW}Iniciando setup do banco de dados...${NC}"

check_postgresql
create_database
apply_migrations

echo -e "${GREEN}Setup do banco de dados concluído com sucesso!${NC}"
