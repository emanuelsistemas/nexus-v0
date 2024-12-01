# Nexus V0

Sistema de assistente de desenvolvimento de software com interface semelhante ao ChatGPT.

## Estrutura do Projeto

```
├── Frontend/           # Interface do usuário em React
├── Backend/            # APIs e serviços em FastAPI
└── scripts/            # Scripts de gerenciamento
    ├── manage_frontend.sh    # Gerenciamento do frontend
    ├── backend_manager.sh    # Gerenciamento do backend
    └── log_manager.sh        # Gerenciamento de logs
```

## Scripts de Gerenciamento

### Frontend

```bash
./scripts/manage_frontend.sh [comando]

Comandos disponíveis:
- check         # Verifica requisitos e estrutura
- install      # Instala dependências
- start        # Inicia servidor de desenvolvimento
- stop         # Para o servidor
- restart      # Reinicia o servidor
- status       # Mostra status do servidor
- clean        # Limpa cache do npm
- deps         # Verifica dependências
- build        # Build do projeto
- logs         # Mostra logs
```

### Backend

```bash
./scripts/backend_manager.sh [comando]

Comandos disponíveis:
- check-deps      # Verifica dependências Python
- check-db        # Verifica conexão com banco de dados
- check-api       # Verifica status das APIs
- backup-db       # Realiza backup do banco de dados
- restore-db      # Restaura backup do banco de dados
- migrate up/down # Executa migrações do banco de dados
- monitor         # Monitora logs de erro em tempo real
- check-services  # Verifica status dos serviços
- health-report   # Gera relatório de saúde do sistema
```

### Logs

```bash
./scripts/log_manager.sh [comando]

Comandos disponíveis:
- clean          # Limpa logs antigos
- show [n]       # Mostra últimas n linhas do log
- search [termo] # Busca termo nos logs
- stats          # Mostra estatísticas dos logs
```

## Desenvolvimento

1. Clone o repositório
```bash
git clone https://github.com/emanuelsistemas/nexus-v0.git
cd nexus-v0
```

2. Instale as dependências do frontend
```bash
./scripts/manage_frontend.sh install
```

3. Inicie o servidor de desenvolvimento
```bash
./scripts/manage_frontend.sh start
```

4. Verifique o status do backend
```bash
./scripts/backend_manager.sh health-report
```

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
