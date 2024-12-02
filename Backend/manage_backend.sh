#!/bin/bash

# Configurações
BACKEND_DIR="$(pwd)"
PID_FILE="/tmp/backend_server.pid"
LOG_FILE="../logs/backend.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se o servidor está rodando
is_server_running() {
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null; then
            return 0 # Está rodando
        fi
    fi
    return 1 # Não está rodando
}

# Função para iniciar o servidor
start_server() {
    echo -e "${YELLOW}Iniciando servidor backend...${NC}"
    
    # Criar diretório de logs se não existir
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Iniciar o servidor
    nohup uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 > "$LOG_FILE" 2>&1 &
    
    # Salvar PID
    echo $! > "$PID_FILE"
    
    echo -e "${GREEN}Servidor iniciado com PID $(cat $PID_FILE)${NC}"
}

# Função para parar o servidor
stop_server() {
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        echo -e "${YELLOW}Parando servidor (PID: $pid)...${NC}"
        kill "$pid" 2>/dev/null
        rm -f "$PID_FILE"
        echo -e "${GREEN}Servidor parado${NC}"
    else
        echo -e "${RED}Servidor não está rodando${NC}"
    fi
}

# Função para reiniciar o servidor
restart_server() {
    stop_server
    sleep 2
    start_server
}

# Função para mostrar o status do servidor
server_status() {
    if is_server_running; then
        echo -e "${GREEN}Servidor está rodando (PID: $(cat $PID_FILE))${NC}"
    else
        echo -e "${RED}Servidor não está rodando${NC}"
    fi
}

# Função para mostrar os logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo -e "${RED}Arquivo de log não encontrado${NC}"
    fi
}

# Menu principal
case "$1" in
    start)
        if is_server_running; then
            echo -e "${RED}Servidor já está rodando${NC}"
        else
            start_server
        fi
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        server_status
        ;;
    logs)
        show_logs
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac

exit 0
