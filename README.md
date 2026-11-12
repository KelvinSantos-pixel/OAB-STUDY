# Preparatório OAB & Graduação

Plataforma de estudos para a 1ª fase do Exame de Ordem e para as matérias da graduação em Direito.
Página única, sem servidor, sem banco de dados: abre em qualquer navegador e guarda o progresso do
aluno no próprio dispositivo.

**Preço do produto:** R$ 30 por mês, assinatura com cancelamento livre.

---

## O que tem dentro

| Módulo | Conteúdo |
|---|---|
| Banco de questões | 141 questões originais, comentadas, com fundamento legal, cobrindo as 20 disciplinas |
| Simulado | 80 questões em 5h (peso e ordem da prova real), rápido de 20, ou 10 por disciplina |
| Gamificação | XP, 8 níveis, 12 medalhas, ofensiva de dias seguidos |
| Diagnóstico | Acerto por disciplina, gráfico de evolução, comparativo entre as últimas provas |
| Recomendação | Ordena o que estudar por impacto na nota: peso da disciplina × taxa de erro |
| Caderno de erros | Toda questão errada volta até ser acertada |
| Assistente | Tutor determinístico sempre ativo + Gemini quando configurado |
| Flashcards | 56 cartões |
| Resumos | 15 resumos esquematizados em tabela |
| Trilhas | OAB (pesos e temas por disciplina) e graduação (matérias por período, com ponte para a OAB) |
| Atualizações | Mudanças legislativas recentes com chance de cair |

## Estrutura do repositório

```
conteudo/          o material de estudo, separado do código
  questoes-1.js      Ética, Constitucional, Civil
  questoes-2.js      Processo Civil, Penal, Processo Penal
  questoes-3.js      Administrativo, Trabalho, Processo do Trabalho, Tributário
  questoes-4.js      demais disciplinas
  flashcards.js
  resumos.js
  trilhas.js         pesos da prova, temas, matriz da graduação, atualizações
src/
  parte1.html        marcação e estilos
  parte2.js          lógica da aplicação
intermediario/
  api/tutor.js       função serverless que guarda a chave do Gemini
build.py             junta tudo em dist/index.html
verificar.js         confere a integridade do banco de questões
teste.js             teste automatizado de navegador
dist/index.html      ⟵ o arquivo que você publica
```

### Para alterar o conteúdo

Edite os arquivos de `conteudo/` e rode:

```bash
python3 build.py        # gera dist/index.html
node verificar.js       # confere gabaritos, campos e cobertura por disciplina
node teste.js           # abre a página num navegador e exercita todas as telas
```

Formato de uma questão:

```js
{
  d: "Direito Civil",            // disciplina — precisa bater com trilhas.js
  n: "medio",                    // facil | medio | dificil
  t: "Prescrição e decadência",  // tema
  e: "Enunciado…",
  a: ["alternativa 1","alternativa 2","alternativa 3","alternativa 4"],
  c: 1,                          // índice da correta no array acima
  co: "Comentário do gabarito…", // aceita HTML
  f: "CC, art. 206, § 3º, V."    // fundamento legal
}
```

> As alternativas são **redistribuídas automaticamente** entre A, B, C e D na hora de carregar,
> de forma determinística. Não se preocupe em variar a posição da correta ao escrever: o programa
> equilibra. Por isso, **nunca escreva "a alternativa B"** nos comentários — escreva pelo conteúdo.

---

## Publicar o site

O produto é um arquivo só: `dist/index.html`. Qualquer hospedagem de arquivo estático serve.

- **Netlify / Vercel / Cloudflare Pages** — arraste a pasta `dist/`, plano gratuito resolve.
- **Hotmart / Kiwify** — suba como conteúdo da área de membros.
- **Hospedagem própria** — copie `dist/index.html` para a raiz do domínio.

### Ligar o botão de compra

Em `src/parte2.js`, na função `comprar()`, preencha:

```js
const CHECKOUT = 'https://pay.kiwify.com.br/SEU-LINK';
```

Rode `python3 build.py` de novo. Enquanto a constante estiver vazia, o botão abre a plataforma em
modo de demonstração.

**Plataformas de checkout no Brasil** (todas emitem nota, retêm imposto e liberam o acesso sozinhas):

| Plataforma | Taxa aproximada | Observação |
|---|---|---|
| Kiwify | ~8,99% + R$ 2,49 | Área de membros inclusa; a mais simples para começar |
| Hotmart | ~9,9% + R$ 1 | Maior alcance, programa de afiliados |
| Mercado Pago | ~4,99% | Mais barato, mas você hospeda e controla o acesso |
| Stripe | ~3,99% + R$ 0,39 | Mais barato ainda, exige mais configuração |

A R$ 30 por mês, a Kiwify fica com cerca de R$ 5,20 e você recebe por volta de R$ 24,80 por assinante. Para cobrança recorrente, confirme na plataforma que o plano de assinatura está habilitado.

---

## Login

A plataforma abre numa tela de entrada. A lista de alunos **não fica no código**: mora em
`usuarios.json`, na raiz do projeto, que está fora do controle de versão. O `build.py` lê esse
arquivo e injeta a lista no `dist/index.html` na hora de gerar o site.

```
usuarios.json           ⟵ a sua lista real, nunca versionada
usuarios.exemplo.json   ⟵ o modelo, esse sim versionado
```

As senhas ficam guardadas como **hash SHA-256 com sal**, nunca em texto legível.

### Acrescentar um aluno

```bash
node gerar-hash.js joao.silva SenhaDele123
```

Acrescente a entrada gerada a `usuarios.json`:

```json
[
  {"u": "isa.bella",  "h": "…"},
  {"u": "joao.silva", "h": "…"}
]
```

E gere o site de novo:

```bash
python3 build.py
```

> Se você clonar este repositório em outra máquina, `usuarios.json` não vem junto — é proposital.
> Recrie-o com o `gerar-hash.js`, senão ninguém consegue entrar.

### Leia isto antes de vender

**O login é uma porta, não um cofre.** A página inteira é entregue ao navegador do aluno. Quem souber
abrir o inspetor do navegador contorna a verificação, e um comprador pode simplesmente repassar a
senha para outras pessoas. O hash evita que a senha apareça legível no código-fonte — e só.

Para controlar de verdade quem comprou, use uma destas rotas:

1. **Área de membros do checkout** (Kiwify, Hotmart) — o caminho mais simples. A plataforma cria
   login para cada comprador, bloqueia quem pediu reembolso e detecta compartilhamento de conta.
   Você sobe o `index.html` como conteúdo do curso e deixa o login da plataforma fazer o trabalho.
2. **Servidor próprio com sessão** — mais controle, mais trabalho: exige backend, banco de usuários
   e autenticação de verdade.

O login embutido serve bem para dar acesso a poucas pessoas conhecidas e para demonstração.

---

## Ligar o assistente de IA

O assistente é opcional: sem ele, o bloco **"Entenda o erro"** continua funcionando em toda questão
errada, com diagnóstico, resumo ligado ao tema, flashcards e mais questões do mesmo assunto.

### Por que existe um intermediário

A chave da API **não pode ficar dentro do site**. A página é distribuída para quem compra; qualquer
pessoa pode abrir o código-fonte, ler a chave e usá-la. A cobrança cai na sua conta.

O intermediário é uma função que roda no servidor, guarda a chave e é a única coisa que fala com o
Google. O site chama a função; o aluno nunca toca na chave.

### Passo a passo (Vercel, plano gratuito)

1. Suba este repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), importe o repositório e aponte a raiz do projeto para
   `intermediario/`.
3. Em **Settings → Environment Variables**, crie:
   - `GEMINI_API_KEY` — a sua chave, obtida no Google AI Studio
   - `ORIGENS_PERMITIDAS` — o domínio do seu site, ex.: `https://seudominio.com.br`
4. Depois do deploy, o endereço fica parecido com `https://seu-projeto.vercel.app/api/tutor`.
5. Na plataforma, em **Ajustes → Assistente de estudos**, cole o endereço no campo
   **Endpoint do intermediário** e clique em **Testar o assistente**.

A função já vem com limite de 20 perguntas por visitante a cada 10 minutos, restrição de origem,
limite de tamanho do prompt e lista fechada de modelos — para que alguém que descubra o endereço
não consuma a sua cota.

### Modelos

`gemini-3.5-flash` é o padrão. `gemini-3.7-flash` responde melhor em questões difíceis e custa mais;
`gemini-3.5-flash-lite` é o mais barato. Trocável em Ajustes, sem mexer no código.

### O campo de chave em Ajustes

Serve **só para testar no seu computador**. A chave fica no `localStorage` do seu navegador e nunca
entra no código publicado. Antes de vender, use o endpoint.

---

## Sobre o conteúdo

**As questões são originais.** Não reproduzem provas da FGV, que são material protegido por direito
autoral — raspar e revender provas oficiais expõe o produto a notificação e processo. O que foi usado
é a **incidência de temas** das edições 35 a 45 (dado factual, não conteúdo protegido) para decidir o
que cobrar em cada disciplina e com que peso.

A estrutura da prova embutida na plataforma: 80 questões, 5 horas, 4 alternativas, nota de corte de
40 acertos, distribuição por disciplina conforme o padrão estável das últimas edições (Ética 8,
Constitucional 6, Civil 6, Processo Civil 6, Penal 6, Processo Penal 6, Administrativo 5, Tributário 5,
Trabalho 5, Processo do Trabalho 5, Empresarial 4, e 2 em cada uma das demais nove disciplinas).

**Revisão:** novembro de 2026. Legislação, súmulas e jurisprudência mudam. Antes de cada lançamento,
revise o módulo de atualizações e confira a redação vigente no Planalto.

---

## Cuidados legais

- O rodapé da página de vendas já traz o aviso de que o material é educacional, não é orientação
  jurídica e não substitui advogado, professor ou texto legal. **Não remova.**
- O mesmo rodapé esclarece que o produto não tem vínculo com a OAB nem com a FGV. **Não remova.**
- O direito de arrependimento de 7 dias para compra on-line é do Código de Defesa do Consumidor
  (art. 49): não é cortesia, é obrigação.
- Venda de material de estudo é atividade tributada. Formalize como MEI ou ME antes de escalar.
- Se contratar alguém para escrever questões, acerte por escrito a cessão de direitos autorais.

---

## Dados do aluno

Tudo fica no `localStorage` do navegador do aluno: progresso, XP, medalhas, caderno de erros,
configuração. Nada é enviado a servidor nenhum, exceto a pergunta ao assistente, quando ele usa o
recurso. Limpar os dados do navegador apaga o progresso — por isso existe o botão de exportar em
Ajustes.

Para progresso sincronizado entre dispositivos seria preciso login e banco de dados. Fica como
evolução, não como requisito para vender.
