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

## Domínio Equipa

O endereço desejado é `www.equipagestaoequipamentos.com`. Primeiro registre o domínio e adicione-o à mesma conta Cloudflare. Depois, no Worker, abra **Domínios e rotas > Adicionar > Domínio personalizado** e informe esse endereço. Mantenha o domínio atual funcionando até o novo aparecer como ativo.

## Recuperação de senha por e-mail

Antes de publicar esta versão, configure um domínio remetente no Cloudflare Email Service e confirme o endereço de origem. O vínculo `EMAIL` já está declarado no `wrangler.jsonc`. Defina `EMAIL_FROM` no Worker, por exemplo `contato@seu-dominio.com`, usando um endereço autorizado pelo domínio configurado. Libere os destinatários do aplicativo segundo as regras de envio da conta Cloudflare. Sem essa configuração, pedidos de redefinição retornam erro e nenhuma senha é alterada. O link enviado ao e-mail cadastrado expira em 30 minutos e só pode ser usado uma vez.
