.DEFAULT_GOAL := help

.AWS_PROFILE := mtuliomk

.PHONY: help install-frontend install-backend install-proxy install-skills start-frontend start-backend start-proxy migrate deploy-backend

help:
	@echo "Comandos make disponíveis:"
	@echo "  make help             - Lista os comandos disponíveis"
	@echo "  make install-frontend - Instala dependências do frontend"
	@echo "  make install-backend  - Instala dependências do backend"
	@echo "  make install-proxy    - Instala dependências do proxy"
	@echo "  make install-skills   - Instala skills proxy em ~/.codex/skills"
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

install-skills:
	mkdir -p "$(HOME)/.codex/skills"
	for skill_dir in agent-docs/skills/_proxy/*; do \
		if [ -d "$$skill_dir" ]; then \
			skill_name="$$(basename "$$skill_dir")"; \
			dest_dir="$(HOME)/.codex/skills/$${skill_name}-proxy"; \
			rm -rf "$$dest_dir"; \
			mkdir -p "$$dest_dir"; \
			cp -R "$$skill_dir/"* "$$dest_dir/"; \
		fi; \
	done

start-frontend: install-frontend
	yarn --cwd frontend dev --host --port 3000

start-backend: install-backend
	PORT=3002 yarn --cwd backend dev

start-proxy: install-proxy
	yarn --cwd proxy dev --port 3001

migrate:
	yarn --cwd backend db:generate
	yarn --cwd backend db:migrate
