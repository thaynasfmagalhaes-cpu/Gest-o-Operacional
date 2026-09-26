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
# Identificação por foto

Na tela **Novo acompanhamento**, fotografe o equipamento com a TAG legível. O servidor usa o binding `AI` definido em `wrangler.jsonc` para analisar a imagem e sugerir a TAG no formato `LETRAS-NÚMEROS` e o equipamento disponível no catálogo. A pessoa confere os campos antes de criar o acompanhamento, e a foto é anexada ao histórico.

É preciso publicar a versão atualizada do Worker para ativar a leitura. O serviço Workers AI pode consumir a cota gratuita ou gerar cobrança conforme o plano da conta. Se a leitura não estiver disponível ou não reconhecer a imagem, os campos continuam editáveis e a foto pode ser anexada manualmente.
