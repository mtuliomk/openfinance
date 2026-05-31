.DEFAULT_GOAL := help

.AWS_PROFILE := mtuliomk

.PHONY: help install-frontend install-backend install-proxy install-skills start-frontend start-backend start-proxy migrate

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

DEPLOYMENT_BUCKET ?= openfinance-deploy-bucket
DEPLOYMENT_KEY_PREFIX ?= deploy-openfinance

.PHONY: deploy-backend
deploy-backend:
	aws s3api head-bucket --bucket "$(DEPLOYMENT_BUCKET)" --profile $(.AWS_PROFILE) >/dev/null 2>&1 || aws s3 mb "s3://$(DEPLOYMENT_BUCKET)" --profile $(.AWS_PROFILE)
	yarn --cwd backend install --frozen-lockfile
	yarn --cwd backend build
	cd backend && zip -r ../backend.zip dist package.json yarn.lock >/dev/null
	aws s3 cp backend.zip "s3://$(DEPLOYMENT_BUCKET)/$(DEPLOYMENT_KEY_PREFIX)/backend.zip" --profile $(.AWS_PROFILE)
	rm -f backend.zip
	aws cloudformation deploy \
		--template-file deploy/backend/backend-serverless.yml \
		--stack-name openfinance-backend \
		--capabilities CAPABILITY_IAM \
		--profile $(.AWS_PROFILE) \
		--parameter-overrides DeploymentBucket=$(DEPLOYMENT_BUCKET) DeploymentKeyPrefix=$(DEPLOYMENT_KEY_PREFIX)
