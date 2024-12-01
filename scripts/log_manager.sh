#!/bin/bash

# Configuração de diretórios
LOG_DIR="../logs"
FRONTEND_LOG="$LOG_DIR/frontend.log"
ERROR_LOG="$LOG_DIR/error.log"
DEBUG_LOG="$LOG_DIR/debug.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"
touch "$FRONTEND_LOG" "$ERROR_LOG" "$DEBUG_LOG"

# Função para formatar mensagem de log
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] [$level] $message"
    
    # Logging para arquivo específico baseado no nível
    case $level in
        "ERROR")
            echo "$log_entry" >> "$ERROR_LOG"
            echo "$log_entry" >> "$FRONTEND_LOG"
            ;;
        "DEBUG")
            echo "$log_entry" >> "$DEBUG_LOG"
            echo "$log_entry" >> "$FRONTEND_LOG"
            ;;
        *)
            echo "$log_entry" >> "$FRONTEND_LOG"
            ;;
    esac
}

# Função para limpar logs antigos (mantém últimos 7 dias)
clean_old_logs() {
    log_message "INFO" "Limpando logs antigos..."
    find "$LOG_DIR" -name "*.log" -type f -mtime +7 -delete
    log_message "INFO" "Logs antigos removidos"
}

# Função para exibir últimas linhas do log com cores
show_recent_logs() {
    local lines=${1:-50}
    local log_file=${2:-"$FRONTEND_LOG"}
    
    if [ -f "$log_file" ]; then
        echo -e "${BLUE}=== Últimas $lines linhas do log ===${NC}"
        tail -n "$lines" "$log_file" | while read -r line; do
            if [[ $line == *"[ERROR]"* ]]; then
                echo -e "${RED}$line${NC}"
            elif [[ $line == *"[WARNING]"* ]]; then
                echo -e "${YELLOW}$line${NC}"
            elif [[ $line == *"[DEBUG]"* ]]; then
                echo -e "${BLUE}$line${NC}"
            else
                echo -e "${GREEN}$line${NC}"
            fi
        done
    else
        echo -e "${RED}Arquivo de log não encontrado: $log_file${NC}"
    fi
}

# Função para buscar nos logs
search_logs() {
    local search_term=$1
    local log_file=${2:-"$FRONTEND_LOG"}
    
    if [ -z "$search_term" ]; then
        echo -e "${RED}Termo de busca não fornecido${NC}"
        return 1
    fi
    
    if [ -f "$log_file" ]; then
        echo -e "${BLUE}=== Buscando por '$search_term' ===${NC}"
        grep -i "$search_term" "$log_file" | while read -r line; do
            if [[ $line == *"[ERROR]"* ]]; then
                echo -e "${RED}$line${NC}"
            elif [[ $line == *"[WARNING]"* ]]; then
                echo -e "${YELLOW}$line${NC}"
            elif [[ $line == *"[DEBUG]"* ]]; then
                echo -e "${BLUE}$line${NC}"
            else
                echo -e "${GREEN}$line${NC}"
            fi
        done
    else
        echo -e "${RED}Arquivo de log não encontrado: $log_file${NC}"
    fi
}

# Função para mostrar estatísticas dos logs
show_log_stats() {
    local log_file=${1:-"$FRONTEND_LOG"}
    
    if [ -f "$log_file" ]; then
        echo -e "${BLUE}=== Estatísticas do Log ===${NC}"
        echo -e "${GREEN}Total de linhas:${NC} $(wc -l < "$log_file")"
        echo -e "${RED}Erros:${NC} $(grep -c "\[ERROR\]" "$log_file")"
        echo -e "${YELLOW}Avisos:${NC} $(grep -c "\[WARNING\]" "$log_file")"
        echo -e "${BLUE}Debug:${NC} $(grep -c "\[DEBUG\]" "$log_file")"
        echo -e "${GREEN}Info:${NC} $(grep -c "\[INFO\]" "$log_file")"
    else
        echo -e "${RED}Arquivo de log não encontrado: $log_file${NC}"
    fi
}

# Exportar funções para uso em outros scripts
export -f log_message
export -f clean_old_logs
export -f show_recent_logs
export -f search_logs
export -f show_log_stats

# Se executado diretamente, mostrar menu de ajuda
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "$1" in
        clean)
            clean_old_logs
            ;;
        show)
            show_recent_logs "${2:-50}" "${3:-$FRONTEND_LOG}"
            ;;
        search)
            search_logs "$2" "${3:-$FRONTEND_LOG}"
            ;;
        stats)
            show_log_stats "${2:-$FRONTEND_LOG}"
            ;;
        *)
            echo -e "${YELLOW}Uso: $0 {clean|show|search|stats}${NC}"
            echo
            echo "Comandos:"
            echo "  clean         - Limpa logs antigos"
            echo "  show [n] [arquivo]  - Mostra últimas n linhas do log"
            echo "  search termo [arquivo] - Busca termo nos logs"
            echo "  stats [arquivo]     - Mostra estatísticas dos logs"
            exit 1
            ;;
    esac
fi
