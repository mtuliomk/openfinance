.DEFAULT_GOAL := help

.PHONY: help install-frontend install-backend start-frontend start-backend migrate

help:
	@echo "Comandos make disponíveis:"
	@echo "  make help             - Lista os comandos disponíveis"
	@echo "  make install-frontend - Instala dependências do frontend"
	@echo "  make install-backend  - Instala dependências do backend"
	@echo "  make start-frontend   - Inicia o frontend em modo dev"
	@echo "  make start-backend    - Inicia o backend em modo dev"
	@echo "  make migrate          - Gera e aplica migrations do backend"

install-frontend:
	yarn --cwd frontend install

install-backend:
	yarn --cwd backend install

start-frontend: install-frontend
	yarn --cwd frontend dev

start-backend: install-backend
	yarn --cwd backend dev

migrate:
	yarn --cwd backend db:generate
	yarn --cwd backend db:migrate
