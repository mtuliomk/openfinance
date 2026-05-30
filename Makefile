.DEFAULT_GOAL := help

.PHONY: help install-frontend install-backend install-proxy start-frontend start-backend start-proxy migrate

help:
	@echo "Comandos make disponíveis:"
	@echo "  make help             - Lista os comandos disponíveis"
	@echo "  make install-frontend - Instala dependências do frontend"
	@echo "  make install-backend  - Instala dependências do backend"
	@echo "  make install-proxy    - Instala dependências do proxy"
	@echo "  make start-frontend   - Inicia o frontend em modo dev"
	@echo "  make start-backend    - Inicia o backend em modo dev"
	@echo "  make start-proxy      - Inicia o proxy em modo dev"
	@echo "  make migrate          - Gera e aplica migrations do backend"

install-frontend:
	yarn --cwd frontend install

install-backend:
	yarn --cwd backend install

install-proxy:
	yarn --cwd proxy install

start-frontend: install-frontend
	yarn --cwd frontend dev --host --port 3000

start-backend: install-backend
	PORT=3002 yarn --cwd backend dev

start-proxy: install-proxy
	yarn --cwd proxy dev --port 3001

migrate:
	yarn --cwd backend db:generate
	yarn --cwd backend db:migrate
