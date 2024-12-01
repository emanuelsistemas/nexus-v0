#!/bin/bash

# Importar funções de logging
source "$(dirname "$0")/log_manager.sh"

# Configuração de diretórios e arquivos
BACKEND_DIR="../Backend"
API_LOG="$LOG_DIR/api.log"
DB_LOG="$LOG_DIR/database.log"
SERVICES_LOG="$LOG_DIR/services.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Criar diretórios necessários
mkdir -p "$LOG_DIR"
touch "$API_LOG" "$DB_LOG" "$SERVICES_LOG"

# Função para verificar dependências Python
check_python_deps() {
    log_message "INFO" "Verificando dependências Python..."
    local required_packages=(
        "fastapi"
        "uvicorn"
        "sqlalchemy"
        "psycopg2-binary"
        "alembic"
        "python-jose"
        "passlib"
        "python-multipart"
        "python-dotenv"
    )

    for package in "${required_packages[@]}"; do
        if ! pip show "$package" &> /dev/null; then
            log_message "ERROR" "Pacote $package não está instalado"
            echo -e "${RED}Pacote $package não está instalado${NC}"
        else
            echo -e "${GREEN}✓ $package instalado${NC}"
        fi
    done
}

# Função para verificar conexão com banco de dados
check_database_connection() {
    local db_host=${1:-"localhost"}
    local db_port=${2:-"5432"}
    local db_name=${3:-"nexus"}
    local db_user=${4:-"postgres"}
    
    log_message "INFO" "Verificando conexão com banco de dados..."
    
    if command -v pg_isready &> /dev/null; then
        if pg_isready -h "$db_host" -p "$db_port" -d "$db_name" -U "$db_user"; then
            log_message "INFO" "Conexão com banco de dados estabelecida"
            echo -e "${GREEN}Conexão com banco de dados estabelecida${NC}"
        else
            log_message "ERROR" "Falha na conexão com banco de dados"
            echo -e "${RED}Falha na conexão com banco de dados${NC}"
        fi
    else
        log_message "ERROR" "pg_isready não encontrado. PostgreSQL está instalado?"
        echo -e "${RED}pg_isready não encontrado. PostgreSQL está instalado?${NC}"
    fi
}

# Função para verificar status das APIs
check_api_status() {
    local api_endpoints=(
        "http://localhost:8000/health"
        "http://localhost:8000/api/v1/auth/status"
        "http://localhost:8000/api/v1/users/me"
    )

    log_message "INFO" "Verificando status das APIs..."

    for endpoint in "${api_endpoints[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" "$endpoint" | grep -q "200"; then
            log_message "INFO" "API $endpoint está online"
            echo -e "${GREEN}✓ API $endpoint está online${NC}"
        else
            log_message "ERROR" "API $endpoint está offline"
            echo -e "${RED}✗ API $endpoint está offline${NC}"
        fi
    done
}

# Função para backup do banco de dados
backup_database() {
    local backup_dir="$BACKEND_DIR/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/backup_$timestamp.sql"

    mkdir -p "$backup_dir"

    log_message "INFO" "Iniciando backup do banco de dados..."
    
    if pg_dump -h localhost -U postgres nexus > "$backup_file" 2>> "$DB_LOG"; then
        log_message "INFO" "Backup realizado com sucesso: $backup_file"
        echo -e "${GREEN}Backup realizado com sucesso: $backup_file${NC}"
    else
        log_message "ERROR" "Falha ao realizar backup"
        echo -e "${RED}Falha ao realizar backup${NC}"
    fi
}

# Função para restaurar backup do banco de dados
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        log_message "ERROR" "Arquivo de backup não especificado"
        echo -e "${RED}Arquivo de backup não especificado${NC}"
        return 1
    fi

    if [ ! -f "$backup_file" ]; then
        log_message "ERROR" "Arquivo de backup não encontrado: $backup_file"
        echo -e "${RED}Arquivo de backup não encontrado: $backup_file${NC}"
        return 1
    fi

    log_message "INFO" "Iniciando restauração do banco de dados..."
    
    if psql -h localhost -U postgres nexus < "$backup_file" 2>> "$DB_LOG"; then
        log_message "INFO" "Restauração concluída com sucesso"
        echo -e "${GREEN}Restauração concluída com sucesso${NC}"
    else
        log_message "ERROR" "Falha na restauração do banco de dados"
        echo -e "${RED}Falha na restauração do banco de dados${NC}"
    fi
}

# Função para executar migrações do banco de dados
run_migrations() {
    local action=$1  # "up" ou "down"
    
    cd "$BACKEND_DIR" || exit 1
    
    case "$action" in
        up)
            log_message "INFO" "Aplicando migrações..."
            alembic upgrade head 2>> "$DB_LOG"
            ;;
        down)
            log_message "INFO" "Revertendo última migração..."
            alembic downgrade -1 2>> "$DB_LOG"
            ;;
        *)
            log_message "ERROR" "Ação de migração inválida: $action"
            echo -e "${RED}Ação de migração inválida: $action${NC}"
            return 1
            ;;
    esac
}

# Função para monitorar logs de erro em tempo real
monitor_error_logs() {
    log_message "INFO" "Iniciando monitoramento de logs de erro..."
    echo -e "${YELLOW}Monitorando logs de erro (Ctrl+C para sair)...${NC}"
    
    tail -f "$API_LOG" "$DB_LOG" "$SERVICES_LOG" | grep --line-buffered "\[ERROR\]" | while read -r line; do
        echo -e "${RED}$line${NC}"
    done
}

# Função para verificar serviços necessários
check_services() {
    local services=(
        "postgresql"
        "redis"
        "nginx"
    )

    log_message "INFO" "Verificando status dos serviços..."

    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            log_message "INFO" "Serviço $service está rodando"
            echo -e "${GREEN}✓ Serviço $service está rodando${NC}"
        else
            log_message "ERROR" "Serviço $service está parado"
            echo -e "${RED}✗ Serviço $service está parado${NC}"
        fi
    done
}

# Função para gerar relatório de saúde do sistema
generate_health_report() {
    local report_file="$LOG_DIR/health_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=== Relatório de Saúde do Sistema ==="
        echo "Data: $(date)"
        echo
        echo "=== Status dos Serviços ==="
        check_services
        echo
        echo "=== Status do Banco de Dados ==="
        check_database_connection
        echo
        echo "=== Status das APIs ==="
        check_api_status
        echo
        echo "=== Estatísticas de Logs ==="
        show_log_stats "$API_LOG"
        show_log_stats "$DB_LOG"
    } > "$report_file"

    log_message "INFO" "Relatório de saúde gerado: $report_file"
    echo -e "${GREEN}Relatório de saúde gerado: $report_file${NC}"
}

# Menu de comandos
case "$1" in
    check-deps)
        check_python_deps
        ;;
    check-db)
        check_database_connection "$2" "$3" "$4" "$5"
        ;;
    check-api)
        check_api_status
        ;;
    backup-db)
        backup_database
        ;;
    restore-db)
        restore_database "$2"
        ;;
    migrate)
        run_migrations "$2"
        ;;
    monitor)
        monitor_error_logs
        ;;
    check-services)
        check_services
        ;;
    health-report)
        generate_health_report
        ;;
    *)
        echo -e "${YELLOW}Uso: $0 {check-deps|check-db|check-api|backup-db|restore-db|migrate|monitor|check-services|health-report}${NC}"
        echo
        echo "Comandos:"
        echo "  check-deps      - Verifica dependências Python"
        echo "  check-db       - Verifica conexão com banco de dados"
        echo "  check-api      - Verifica status das APIs"
        echo "  backup-db      - Realiza backup do banco de dados"
        echo "  restore-db     - Restaura backup do banco de dados"
        echo "  migrate up/down - Executa migrações do banco de dados"
        echo "  monitor        - Monitora logs de erro em tempo real"
        echo "  check-services - Verifica status dos serviços"
        echo "  health-report  - Gera relatório de saúde do sistema"
        exit 1
        ;;
esac

exit 0
