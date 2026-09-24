# Equipa para Android e iPhone

A base nativa usa Capacitor 8.5.2 e empacota os arquivos de `public/`. O Worker e o D1 continuam no Cloudflare. A URL da API fica em `public/mobile-api.js`; atualize-a quando o domínio definitivo estiver ativo. Publique primeiro o Worker deste pacote, pois ele libera somente as origens locais do aplicativo para a API com autenticação.

## Gerar e testar

1. Instale Node.js 22+, Android Studio e o SDK Android atual. Para iOS, use um Mac com Xcode atual.
2. Execute `npm ci` na pasta do projeto.
3. Execute `npm run check` e `npm run mobile:sync` após cada alteração da interface.
4. Execute `npm run mobile:android` para abrir no Android Studio; execute `npm run mobile:ios` em um Mac para abrir no Xcode.
5. Teste em aparelhos reais: login, atualização de status, anexos e download, navegação entre Painel Geral e Painel de Controle, redefinição por e-mail, volta do aplicativo e perda de conexão.

Os diretórios `android/` e `ios/` estão incluídos como projetos iniciais. O identificador `com.equipa.gestao` está provisório; defina o identificador definitivo antes de criar registros nas lojas, pois depois ele identifica permanentemente o aplicativo. Os ícones derivam de `assets/logo.svg`.

## Titularidade empresarial

A publicação será feita nas contas **da empresa**, não em uma conta pessoal. O cadastro empresarial e a assinatura das versões devem ser controlados pela equipe designada pela empresa. Antes de registrar o app, preencha estes dados internamente:

| Informação | Definição pendente |
| --- | --- |
| Razão social e nome público do desenvolvedor | Confirmar com a empresa |
| D-U-N-S e endereço legal | Confirmar com a área responsável |
| Responsável pelas contas Apple Developer e Play Console | Designar pela empresa |
| Domínio corporativo e contato de suporte | Confirmar propriedade e uso |
| Identificador definitivo do app | Substituir `com.equipa.gestao` por ID aprovado |
| Política de privacidade e responsável pelos dados | Validar com jurídico e segurança da informação |
| Autorização de marca, logo e imagens | Confirmar por escrito |

A Apple e o Google verificam a identidade e os dados legais de contas organizacionais; divergências entre razão social, endereço e D-U-N-S atrasam a inscrição. Não registre o identificador provisório nas lojas antes da definição empresarial.

## Para distribuição nas lojas

- Conta Play Console da pessoa ou empresa responsável, chave de assinatura, ficha do aplicativo, capturas de tela, política de privacidade, declarações de dados e testes exigidos para a conta.
- Apple Developer Program e App Store Connect em nome do responsável, Mac/Xcode, certificados de distribuição, ficha do aplicativo, capturas de tela e declarações de privacidade.
- Confirmar o direito de uso de todas as marcas e imagens presentes no aplicativo.
- Verificar o requisito da Apple de oferecer uma experiência própria de app, além de reproduzir uma página web. A câmera nativa para evidências e a resposta tátil dos botões já estão integradas. Ainda é necessário testar esses recursos em aparelhos reais e avaliar outras funções nativas úteis antes do envio.

A sincronização não cria um arquivo assinado para as lojas. Para gerar AAB no Android e IPA no iOS, conclua a configuração e a assinatura nos respectivos ambientes. O aplicativo requer conexão para dados operacionais; a interface é empacotada localmente.
