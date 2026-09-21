# Gestão Operacional

Sistema de acompanhamento de equipamentos, movimentações e histórico operacional.

## Hospedagem

A versão online utiliza Cloudflare Workers e Cloudflare D1. Consulte `DEPLOY-CLOUDFLARE.md` para concluir a configuração gratuita.

## Funcionalidades

- autenticação e perfis;
- acompanhamento de equipamentos por TAG;
- destinos, OS, prioridades e próximas ações;
- histórico das movimentações;
- painel responsivo;
- Agente UI/UX com análises, feedback e aprovação administrativa.

As credenciais administrativas devem ser configuradas como segredos na Cloudflare e nunca incluídas no repositório.
