# Agente de Evolução — implantação segura

O Equipa já possui a área **Evolução do Sistema**, onde usuários registram sugestões e o perfil **Criador** aprova, rejeita ou solicita ajustes.

## Estado atual

- sugestões ficam registradas e auditáveis no banco D1;
- somente o Criador pode aprovar mudanças;
- operadores não recebem permissão para alterar o código;
- a aprovação não modifica o site automaticamente nesta versão.

## Próxima etapa para automação real

Para o agente alterar o projeto após uma aprovação, conecte uma GitHub App com acesso apenas a este repositório. O fluxo recomendado é:

1. O Criador aprova a sugestão no Equipa.
2. Um serviço autorizado lê a solicitação aprovada.
3. O agente cria uma branch e um Pull Request, nunca um envio direto para `main`.
4. Testes e uma pré-visualização são executados.
5. O Criador revisa e faz o merge.
6. O Cloudflare publica a versão aprovada.

Não coloque tokens do GitHub, senhas ou chaves dentro de `worker.js`, `app.js` ou do repositório. Use segredos do Cloudflare e permissões mínimas. Esse modelo mantém histórico, revisão humana e possibilidade de reversão.

## Domínio personalizado

O endereço `www.equipagestaoequipamentos.com` só poderá ser ativado depois que o domínio for registrado. Em seguida, adicione-o à conta Cloudflare e associe-o ao Worker em **Workers & Pages → Equipa → Domínios e rotas → Adicionar domínio personalizado**.
