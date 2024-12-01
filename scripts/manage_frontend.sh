#!/bin/bash

# Importar funções de logging
source "$(dirname "$0")/log_manager.sh"

# Configuração de diretórios
FRONTEND_DIR="../Frontend/chat-interface"
PID_FILE="/tmp/frontend_dev_server.pid"
ENV_FILE="$FRONTEND_DIR/.env"
NODE_VERSION="v18.0.0"  # Versão mínima requerida do Node.js

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar requisitos do sistema
check_requirements() {
    log_message "INFO" "Verificando requisitos do sistema..."
    
    # Verificar se node está instalado
    if ! command -v node &> /dev/null; then
        log_message "ERROR" "Node.js não está instalado"
        echo -e "${RED}Node.js não está instalado. Por favor, instale o Node.js${NC}"
        exit 1
    fi

    # Verificar versão do Node.js
    current_version=$(node -v)
    if [[ "$current_version" < "$NODE_VERSION" ]]; then
        log_message "ERROR" "Versão do Node.js ($current_version) é menor que a requerida ($NODE_VERSION)"
        echo -e "${RED}Versão do Node.js muito antiga. Por favor, atualize para $NODE_VERSION ou superior${NC}"
        exit 1
    fi

    # Verificar se npm está instalado
    if ! command -v npm &> /dev/null; then
        log_message "ERROR" "npm não está instalado"
        echo -e "${RED}npm não está instalado. Por favor, instale o npm${NC}"
        exit 1
    fi

    log_message "INFO" "Todos os requisitos do sistema estão satisfeitos"
}

# Função para verificar e criar estrutura do projeto
check_project_structure() {
    log_message "INFO" "Verificando estrutura do projeto..."
    
    # Verificar se o diretório do frontend existe
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_message "ERROR" "Diretório do frontend não encontrado: $FRONTEND_DIR"
        echo -e "${RED}Diretório do frontend não encontrado${NC}"
        exit 1
    fi

    # Verificar package.json
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        log_message "ERROR" "package.json não encontrado"
        echo -e "${RED}package.json não encontrado${NC}"
        exit 1
    fi

    log_message "INFO" "Estrutura do projeto verificada com sucesso"
}

# Função para verificar se o servidor está rodando
is_server_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null; then
            return 0
        fi
    fi
    return 1
}

# Função para limpar cache do npm
clean_npm_cache() {
    log_message "INFO" "Limpando cache do npm..."
    cd "$FRONTEND_DIR" || exit 1
    npm cache clean --force
    rm -rf node_modules package-lock.json
    log_message "INFO" "Cache do npm limpo com sucesso"
}

# Função para instalar dependências
install_dependencies() {
    log_message "INFO" "Instalando dependências do projeto..."
    cd "$FRONTEND_DIR" || exit 1
    
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install 2>&1 | tee -a "$FRONTEND_LOG"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log_message "INFO" "Dependências instaladas com sucesso"
        echo -e "${GREEN}Dependências instaladas com sucesso${NC}"
    else
        log_message "ERROR" "Erro ao instalar dependências"
        echo -e "${RED}Erro ao instalar dependências${NC}"
        exit 1
    fi
}

# Função para iniciar o servidor de desenvolvimento
start_dev_server() {
    if is_server_running; then
        log_message "WARNING" "Servidor já está rodando"
        echo -e "${YELLOW}Servidor já está rodando${NC}"
        return
    fi

    log_message "INFO" "Iniciando servidor de desenvolvimento..."
    cd "$FRONTEND_DIR" || exit 1
    npm run dev > "$FRONTEND_LOG" 2>&1 & 
    echo $! > "$PID_FILE"
    log_message "INFO" "Servidor iniciado com PID $(cat "$PID_FILE")"
    echo -e "${GREEN}Servidor iniciado com PID $(cat "$PID_FILE")${NC}"
}

# Função para parar o servidor
stop_dev_server() {
    if is_server_running; then
        local pid=$(cat "$PID_FILE")
        kill "$pid"
        rm "$PID_FILE"
        log_message "INFO" "Servidor parado (PID: $pid)"
        echo -e "${GREEN}Servidor parado (PID: $pid)${NC}"
    else
        log_message "WARNING" "Nenhum servidor em execução"
        echo -e "${YELLOW}Nenhum servidor em execução${NC}"
    fi
}

# Função para verificar dependências e suas versões
check_dependencies() {
    log_message "INFO" "Verificando dependências..."
    cd "$FRONTEND_DIR" || exit 1
    echo -e "${YELLOW}Dependências instaladas:${NC}"
    npm list --depth=0
    
    echo -e "\n${YELLOW}Dependências desatualizadas:${NC}"
    npm outdated
}

# Função para build do projeto
build_project() {
    log_message "INFO" "Iniciando build do projeto..."
    cd "$FRONTEND_DIR" || exit 1
    
    echo -e "${YELLOW}Executando build...${NC}"
    npm run build 2>&1 | tee -a "$FRONTEND_LOG"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log_message "INFO" "Build concluído com sucesso"
        echo -e "${GREEN}Build concluído com sucesso${NC}"
    else
        log_message "ERROR" "Erro durante o build"
        echo -e "${RED}Erro durante o build${NC}"
        exit 1
    fi
}

# Menu de comandos
case "$1" in
    check)
        check_requirements
        check_project_structure
        ;;
    install)
        check_requirements
        check_project_structure
        install_dependencies
        ;;
    start)
        check_requirements
        check_project_structure
        start_dev_server
        ;;
    stop)
        stop_dev_server
        ;;
    restart)
        stop_dev_server
        sleep 2
        start_dev_server
        ;;
    status)
        if is_server_running; then
            echo -e "${GREEN}Servidor está rodando (PID: $(cat "$PID_FILE"))${NC}"
            echo "Últimas 10 linhas do log:"
            show_recent_logs 10
        else
            echo -e "${YELLOW}Servidor não está rodando${NC}"
        fi
        ;;
    clean)
        stop_dev_server
        clean_npm_cache
        ;;
    deps)
        check_dependencies
        ;;
    build)
        check_requirements
        check_project_structure
        build_project
        ;;
    logs)
        show_recent_logs "${2:-50}"
        ;;
    *)
        echo -e "${YELLOW}Uso: $0 {check|install|start|stop|restart|status|clean|deps|build|logs [número_de_linhas]}${NC}"
        echo
        echo "Comandos:"
        echo "  check   - Verifica requisitos do sistema e estrutura do projeto"
        echo "  install - Instala dependências do projeto"
        echo "  start   - Inicia o servidor de desenvolvimento"
        echo "  stop    - Para o servidor"
        echo "  restart - Reinicia o servidor"
        echo "  status  - Mostra status do servidor"
        echo "  clean   - Limpa cache do npm e node_modules"
        echo "  deps    - Verifica dependências instaladas e desatualizadas"
        echo "  build   - Executa build do projeto"
        echo "  logs    - Mostra logs (opcional: número de linhas)"
        exit 1
        ;;
esac

exit 0
