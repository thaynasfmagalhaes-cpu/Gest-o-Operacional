# Publicação gratuita na Cloudflare

Esta versão utiliza Cloudflare Workers para o site e Cloudflare D1 para o banco de dados.

## Fluxo

1. Importe o repositório GitHub em **Workers & Pages**.
2. Configure o comando de implantação como `npx wrangler deploy`.
3. Crie um banco D1 chamado `gestao-operacional-db`.
4. No Worker, adicione um vínculo D1 com o nome exato `DB`.
5. Adicione as variáveis secretas `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
6. Faça uma nova implantação.

O sistema cria as tabelas e o primeiro administrador automaticamente na primeira abertura após o vínculo do banco.

Nunca coloque senhas diretamente no GitHub.
