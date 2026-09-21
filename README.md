# Flash Finanças 📱

App Android pessoal, offline, feito com React + TypeScript + Vite + Capacitor. O GitHub Actions gera um **APK debug instalável** sem precisar compilar Android no Termux.

## O que funciona na versão 1

- Criar usuário local (e-mail + senha) e entrar no cofre **criptografado com AES-GCM**. Não existe servidor e o e-mail não é verificado. Não é autenticação online nem sincroniza entre celulares.
- Cadastrar entradas e saídas com categorias, datas, descrição, status *pago/recebido* ou *pendente*, e repetição para os próximos 3, 6, 12 ou 24 meses.
- Painel separando entradas efetivamente recebidas de contas a receber; despesas pagas de contas a pagar.
- Fechar mês manualmente. Meses anteriores ao mês atual são bloqueados automaticamente. Nunca editar/excluir após o fechamento, nem mudar status; se houver erro, lançar ajuste num mês aberto.
- Projetar 12 meses e simular valor de troca da Crosser, entrada, juros, parcela, gasolina, manutenção/seguro e reserva para a próxima moto. **Valores estimados**, não consulta à financeira ou FIPE.
- Registrar saldo bancário de referência por mês (não confundir com fluxo de caixa calculado a partir dos lançamentos).
- Exportar JSON **criptografado** pelo compartilhamento do Android (salve no Drive ou outro lugar) e restaurar o arquivo depois. Requer a mesma senha e substitui os dados atuais.
- Interface responsiva com navegação inferior no celular.

### Rascunho de setembro/2026

No primeiro acesso você pode selecionar **Carregar rascunho de setembro/2026**. A lista vem dos itens da aba Setembro da planilha, com confirmação adicional dos valores que você informou na conversa: salário R$ 3.100 recebido; seis despesas de R$ 1.945 ainda **pendentes até conferir o pagamento**; gasolina estimada R$ 195 pendente; repasses para a esposa R$ 710 + R$ 250 pagos; e vendas a receber R$ 150 + R$ 500 **não confirmadas**. A venda para a mãe foi omitida porque não há pagamento nem valor de parcela informado. Atenção: a fatura de R$ 1.133 foi descrita como *fatura de setembro paga em outubro*, então antes de confirmá-la revise **o mês em que o dinheiro realmente saiu**. O rascunho é ponto de partida, não conciliação do extrato bancário. **Não carregue esse modelo se já tiver cadastrado dados equivalentes**.

**Privacidade:** a planilha original com os seus dados pessoais não está incluída no repositório nem no ZIP. Apenas os valores selecionados para o rascunho opcional estão no código-fonte. Se não quiser que eles apareçam no repositório, desative/remova `src/sample.ts` antes de publicar.

## Novidades da versão 1.1

- Painel exibe contas pendentes vencidas e com vencimento nos próximos sete dias no mês atual, com valores e atalho para conferir as pendências. Os avisos aparecem **dentro do app**, não são notificações do Android.
- Tela Lançamentos: busca por nome, categoria e observação, filtros por receita/despesa e pago/pendente, contagem de resultados, ordenação com pendências primeiro e vencimento mais próximo e botão para limpar filtros.
- Impede alterar o saldo de referência de um mês já fechado.
- Novos testes automatizados para pesquisa e datas de vencimento. Dados existentes continuam no mesmo formato.

### Atenção ao atualizar o APK

O workflow produz um **APK debug**. O GitHub Actions pode gerar uma chave de assinatura debug diferente em cada execução. Se o Android recusar a atualização sobre o app instalado, **não desinstale antes de exportar o backup criptografado** em Ajustes e confirmar que o arquivo foi guardado fora do aparelho. Uma desinstalação apaga o cofre local. Para instalar sem perda dos dados, configure futuramente uma chave estável de assinatura. Se precisar reinstalar, crie o cofre com o mesmo e-mail e senha e restaure o backup, conferindo os lançamentos.

## Versão 1.2: nova experiência mobile

- Visual escuro inspirado em aplicativos bancários, com card de saldo em gradiente suave, atalhos para novo lançamento, extrato e projeção e barras reais de despesas por categoria. O gráfico usa lançamentos cadastrados (pagos e pendentes), não valores fictícios.
- Navegação inferior em formato flutuante, botões e modais com animações suaves. Respeita a preferência de acessibilidade do Android por movimento reduzido.
- Corrige a sobreposição do cabeçalho e dos controles com a barra de notificações e a barra de navegação do Android. Utiliza `@capacitor-community/safe-area` na versão para Capacitor 7, configurado para acomodar a WebView dentro da área segura, com `env(safe-area-inset-*)` como suporte CSS. O comportamento final deve ser conferido no aparelho após instalar o APK.
- Os tipos de dados, chave do cofre, senha, criptografia, lançamentos e backup não foram alterados.
- Para usar a versão no celular, baixe o artefato da execução **mais recente bem-sucedida** no Actions; commits intermediários também podem iniciar builds.

**IMPORTANTE antes de atualizar:** exporte um backup criptografado em Ajustes e confirme que salvou fora do app. Os APKs debug do GitHub Actions podem ter assinaturas diferentes entre execuções. Se o Android recusar a atualização, não desinstale o aplicativo até ter um backup válido: desinstalar apaga os dados locais. Se reinstalar, restaure o backup utilizando a mesma senha do cofre.

## Criar o repositório pelo celular (Termux)

1. Instale o **Termux atualizado** pela fonte oficial e abra o app. Permita acesso ao armazenamento:

   ```sh
   termux-setup-storage
   pkg update && pkg install git unzip -y
   ```

2. Baixe o arquivo ZIP do projeto nesta conversa. Confirme o nome em `~/storage/downloads` (pode mudar conforme o navegador):

   ```sh
   ls ~/storage/downloads/*financeiro* ~/storage/downloads/*Financas* 2>/dev/null
   ```

3. Extraia e entre na pasta de projeto:

   ```sh
   mkdir -p ~/projetos/flash-financas
   unzip -o ~/storage/downloads/financeiro-flash.zip -d ~/projetos/flash-financas
   cd ~/projetos/flash-financas
   ls -la
   ```

   **Confirme que `package.json`, `src` e `.github` estão nesta pasta**. Se o ZIP do seu navegador extraiu uma pasta adicional, entre nela antes de continuar.

4. Pelo site do GitHub, crie um repositório **privado** vazio chamado `flash-financas`, **sem README e sem .gitignore** (os arquivos já vêm no ZIP). Copie a URL HTTPS do seu próprio repositório, por exemplo `https://github.com/SEU-USUARIO/flash-financas.git`.

5. No Termux:

   ```sh
   git init -b main
   git add .
   git commit -m "Primeira versão do app financeiro"
   git remote add origin https://github.com/SEU-USUARIO/flash-financas.git
   git push -u origin main
   ```

   Troque `SEU-USUARIO` pelo seu usuário. Para fazer `git push`, o GitHub **não aceita senha da conta** via HTTPS. Use o login/token solicitado pela sua ferramenta de autenticação ou configure uma chave SSH. Nunca coloque tokens no código nem envie a planilha pessoal para o repositório.

6. Abra o repositório no navegador, toque em **Actions → Gerar APK Android**. O push na `main` normalmente dispara o workflow sozinho; se não, **Run workflow → Run workflow**. Aguarde a execução finalizar em verde.

7. Entre na execução concluída e procure **Artifacts → Flash-Financas-APK**. Baixe o ZIP do artefato, extraia `app-debug.apk` e instale. No Android pode ser necessário autorizar a instalação pelo aplicativo que abriu o APK.

> A primeira compilação usa internet no runner do GitHub para baixar Node, bibliotecas, Android SDK e Gradle; pode levar alguns minutos. O Termux não precisa instalar Android Studio nem Java para este fluxo.

## Desenvolver depois, pelo Termux

Edite os arquivos em `src/` e envie novas versões com:

```sh
cd ~/projetos/flash-financas
git add .
git commit -m "Ajustes de interface"
git push
```

Cada push para `main` gera novo APK em **Actions**. Para executar a versão web localmente num ambiente com Node 22+:

```sh
npm install
npm run dev
```

Build web: `npm run build`; teste das regras financeiras: `npm test`.

## Limitações importantes antes de usar como registro oficial

- **Dados locais:** trocar de celular, limpar os dados do app ou desinstalar **apaga o cofre**. Exporte backup regularmente e guarde-o fora do aparelho. Esquecer a senha significa perder o acesso ao cofre criptografado e ao backup.
- **Sem sincronização:** nenhum dado é salvo no GitHub, Google Drive ou banco online. O APK é só o programa. O login protege o cofre local, mas um aparelho comprometido também pode comprometer seus dados.
- **Lançamentos em atraso:** a versão 1 bloqueia meses anteriores automaticamente. Antes de virar o mês, revise e feche seus lançamentos. Depois, ajustes somente no mês corrente ou futuro.
- **Mês da fatura:** compre no cartão e pague no mês posterior? Registre a saída de caixa **no mês do pagamento**. Não lance compra E fatura como duas saídas de caixa.
- **Projeção:** só considera lançamentos cadastrados no respectivo mês, não estima automaticamente todos os seus gastos. Repita salário e despesas fixas ao criar os lançamentos para preencher os meses futuros. Não use meses vazios como indicação de que a compra da moto cabe no orçamento.
- **APK debug:** é para instalar e avaliar pessoalmente. Para publicar na Play Store, configure assinatura de release, política de privacidade e demais requisitos Android.

## Organização

`src/App.tsx`: páginas, lançamentos, meta e navegação. `src/logic.ts`: contas e congelamento. `src/secure.ts`: criptografia e backup. `src/sample.ts`: rascunho opcional. `.github/workflows/android-apk.yml`: montagem do APK no GitHub.
