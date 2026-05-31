---
name: deploy-proxy
description: Executa o deploy usando skills canonicas de deploy encontradas no repositorio.
---

# Deploy Skills Proxy

## Objetivo
Delegar para uma skill canonica de deploy do repositorio atual.

## Fluxo Obrigatorio
1. Ler a pasta `agent-docs/skills`.
2. Identificar subpastas de skills cujo nome comece com `deploy`.
3. Apresentar a lista encontrada ao usuario.
4. Perguntar qual skill de deploy o usuario deseja utilizar.
5. Utilizar a skill canonica escolhida como fonte de verdade da execucao.

## Regras
- Considerar skill valida quando existir `SKILL.md` dentro da pasta da skill.
- Se nenhuma skill com prefixo `deploy` for encontrada, falhar com mensagem clara.
- Se a skill escolhida nao existir ou nao tiver `SKILL.md`, falhar com mensagem clara.
- Nao usar instrucoes locais alternativas se houver conflito com a skill canonica escolhida.

## Caminho Canonico
- Base de descoberta: `agent-docs/skills`
- Skill canonica selecionada: `agent-docs/skills/<skill-escolhida>/SKILL.md`
- Exemplos opcionais: `agent-docs/skills/<skill-escolhida>/code-sample/`
