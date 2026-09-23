# Equipa — Gestão de Equipamentos

Sistema de acompanhamento de equipamentos, movimentações e histórico operacional.

## Hospedagem

A versão online utiliza Cloudflare Workers e Cloudflare D1. Consulte `DEPLOY-CLOUDFLARE.md` para concluir a configuração gratuita.

## Funcionalidades

- autenticação e perfis;
- acompanhamento de equipamentos por TAG;
- destinos, OS, prioridades e próximas ações;
- histórico das movimentações;
- painel responsivo;
- catálogo padronizado de equipamentos e destinos;
- exportação do histórico para Excel;
- área de Evolução do Sistema com sugestões e aprovação administrativa.

As credenciais administrativas devem ser configuradas como segredos na Cloudflare e nunca incluídas no repositório.
