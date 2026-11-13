// Aulas ligadas às matérias da matriz. Cada uma ensina a RECONHECER a situação
// antes de responder: o enunciado descreve um fato, e a tarefa do aluno é saber
// em que instituto aquele fato cai. É isso que a questão cobra.
window.AULAS = [
{
  m:"Lições Preliminares de Direito e Parte Geral do Direito Civil",
  t:"Como a lei nasce, vale e deixa de valer",
  cobra:[
    "Quando a lei passa a obrigar, e o que acontece no intervalo entre publicação e vigência.",
    "O que o juiz faz quando a lei é omissa, e em que ordem.",
    "Se a revogação de uma lei revogadora ressuscita a lei antiga.",
    "Quando começa a personalidade e o que o nascituro já tem."
  ],
  situacoes:[
    { s:"O enunciado diz que uma lei foi publicada em certa data e pergunta se um fato ocorrido dias depois é alcançado por ela.",
      r:"Procure a cláusula de vigência. Se o enunciado não menciona nenhuma, a resposta é <strong>45 dias</strong> depois da publicação oficial. Antes disso a lei existe, mas não obriga: é a <em>vacatio legis</em>.",
      p:"O erro comum é assumir que lei publicada já está valendo. Publicação e vigência são momentos distintos." },
    { s:"O enunciado apresenta um caso sem previsão legal específica e pergunta como o juiz decide.",
      r:"O juiz <strong>não pode</strong> se eximir de decidir alegando lacuna. A ordem do art. 4º da LINDB é fixa: <strong>analogia</strong>, depois <strong>costumes</strong>, depois <strong>princípios gerais de direito</strong>.",
      p:"A banca troca a ordem ou inclui a equidade na sequência. Equidade só se aplica nos casos previstos em lei." },
    { s:"O enunciado encadeia três leis — A revogada por B, B revogada por C — e pergunta pela situação de A.",
      r:"A continua <strong>revogada</strong>. A repristinação só ocorre se a lei nova disser expressamente que a antiga volta a vigorar.",
      p:"Não confunda com o <strong>efeito repristinatório</strong> da declaração de inconstitucionalidade: lá a lei revogadora era nula desde sempre, então nunca revogou validamente nada." },
    { s:"O enunciado fala em direitos de criança ainda não nascida — herança, alimentos, doação.",
      r:"A personalidade começa no <strong>nascimento com vida</strong>, mas a lei põe a salvo os direitos do <strong>nascituro</strong> desde a concepção. Os direitos existem e ficam condicionados ao nascimento.",
      p:"A pegadinha é oferecer 'personalidade desde a concepção' como se fosse a regra do Código." }
  ],
  erros:"Confundir vigência com publicação; inverter a ordem do art. 4º; achar que o registro de nascimento cria a personalidade; e tratar repristinação como automática."
},
{
  m:"Teoria da Constituição, Teoria Política e Direitos Fundamentais",
  t:"De onde vem a Constituição e como ela resiste à mudança",
  cobra:[
    "A diferença entre o poder que cria a Constituição e os que a alteram.",
    "Por que a Constituição de 1988 é rígida, e o que isso implica.",
    "Como classificar uma norma constitucional pela eficácia que produz.",
    "O que fazer quando dois direitos fundamentais colidem."
  ],
  situacoes:[
    { s:"O enunciado descreve a elaboração de uma nova Constituição após ruptura institucional e pergunta pelos limites desse poder.",
      r:"É o poder constituinte <strong>originário</strong>: inicial, autônomo e <strong>ilimitado</strong> no plano do direito positivo. Ele não presta contas à ordem que substituiu.",
      p:"Se o enunciado falar em emenda, mudou tudo: aí é o poder <strong>derivado reformador</strong>, que tem limites materiais, formais e circunstanciais." },
    { s:"O enunciado traz uma norma que garante um direito 'na forma da lei' ou 'atendidos os requisitos que a lei estabelecer'.",
      r:"Leia o que a expressão faz. Se o direito <strong>já pode ser exercido</strong> e a lei viria apenas <em>restringir</em>, é norma de eficácia <strong>contida</strong>. Se o direito <strong>não funciona</strong> sem a lei, é <strong>limitada</strong>.",
      p:"O teste prático: tire a lei da equação. O direito funciona sozinho? Contida. Não funciona? Limitada." },
    { s:"O enunciado opõe liberdade de imprensa e intimidade, ou liberdade religiosa e saúde pública.",
      r:"Colisão entre <strong>princípios</strong> se resolve por <strong>ponderação</strong>, com exame de proporcionalidade: adequação, necessidade e proporcionalidade em sentido estrito. Um cede ao outro <em>naquele caso</em>, sem ser anulado.",
      p:"Alternativas que mandam 'revogar a norma mais antiga' ou 'declarar inconstitucional' estão aplicando solução de antinomia entre regras — errado para princípios." },
    { s:"O enunciado descreve um estado de natureza e pede o autor correspondente.",
      r:"Guerra de todos contra todos e soberano forte: <strong>Hobbes</strong>. Direitos naturais e direito de resistência: <strong>Locke</strong>. Bom selvagem e vontade geral: <strong>Rousseau</strong>. Separação dos poderes: <strong>Montesquieu</strong>, que não é contratualista.",
      p:"Decore pelo verbo central: Hobbes submete, Locke limita, Rousseau funda, Montesquieu divide." }
  ],
  erros:"Tratar cláusula pétrea como imutabilidade absoluta; confundir contida com limitada; e resolver colisão de princípios com critério hierárquico."
},
{
  m:"Constituição, Democracia e Meio Ambiente",
  t:"O ambiente como direito de todos e de ninguém em particular",
  cobra:[
    "A natureza jurídica do meio ambiente e quem pode defendê-lo.",
    "Quando o estudo de impacto ambiental é obrigatório.",
    "Como a Constituição concilia economia e proteção ambiental.",
    "Os instrumentos de participação direta do cidadão."
  ],
  situacoes:[
    { s:"O enunciado pergunta de quem é o meio ambiente, ou quem pode exigir sua proteção.",
      r:"É <strong>bem de uso comum do povo</strong>, de titularidade <strong>difusa</strong>: não pertence à União como proprietária nem ao dono do terreno. Qualquer cidadão pode defendê-lo por <strong>ação popular</strong>, e o Ministério Público por <strong>ação civil pública</strong>.",
      p:"Alternativas que o classificam como bem público dominical ou privado estão erradas pela mesma razão: ambas atribuem um dono." },
    { s:"O enunciado descreve um empreendimento e pergunta se exige EIA.",
      r:"O critério é a <strong>significativa degradação</strong>, não o porte nem o licenciamento em si. Obra de impacto pequeno licencia por estudos mais simples.",
      p:"A banca oferece 'todo licenciamento exige EIA'. Não exige — e o EIA é <strong>público</strong>, nunca sigiloso." },
    { s:"O enunciado apresenta conflito entre atividade econômica e preservação.",
      r:"Não há antinomia: a <strong>defesa do meio ambiente é princípio da ordem econômica</strong>. A Constituição adota o <strong>desenvolvimento sustentável</strong>, e admite tratamento diferenciado conforme o impacto ambiental.",
      p:"Alternativas que mandam prevalecer sempre a livre iniciativa, ou sempre o ambiente, erram pela mesma lógica: a Constituição concilia." },
    { s:"O enunciado trata de redução de área protegida ou de flexibilização de proteção já existente.",
      r:"Dois fundamentos: a alteração e a supressão de espaços protegidos só se fazem <strong>por lei</strong>, e incide a <strong>vedação ao retrocesso ecológico</strong>.",
      p:"Note que criar unidade de conservação pode ser feito por decreto; <strong>reduzir ou extinguir</strong>, só por lei." }
  ],
  erros:"Atribuir dono ao meio ambiente; exigir EIA em todo licenciamento; e opor economia e ambiente como se a Constituição escolhesse um lado."
},
{
  m:"Direito Penal: Teoria Geral",
  t:"Os três andares do crime",
  cobra:[
    "O conceito analítico de crime e onde cada excludente atua.",
    "A diferença entre excluir o fato típico, a ilicitude e a culpabilidade.",
    "Os elementos da culpabilidade depois do finalismo.",
    "Quando o resultado não se imputa ao agente, apesar do nexo físico."
  ],
  situacoes:[
    { s:"O enunciado narra um fato e pergunta se há crime, oferecendo excludentes nas alternativas.",
      r:"Suba os três andares na ordem. <strong>Fato típico</strong>: há conduta, resultado, nexo e tipicidade? <strong>Ilicitude</strong>: incide legítima defesa, estado de necessidade, estrito cumprimento ou exercício regular? <strong>Culpabilidade</strong>: o agente é imputável, podia conhecer a ilicitude, era exigível conduta diversa?",
      p:"Parar no primeiro andar que exclui resolve a questão. Se não há fato típico, nem se discute ilicitude." },
    { s:"O enunciado descreve alguém que agiu sem saber que a conduta era proibida.",
      r:"Separe os dois erros. Erro sobre <strong>elemento do tipo</strong> exclui o <strong>dolo</strong> e fica no primeiro andar. Erro sobre a <strong>ilicitude</strong> fica no terceiro: se inevitável, isenta de pena; se evitável, só reduz.",
      p:"O desconhecimento da lei em si é inescusável — não confunda com erro de proibição, que é não saber que <em>aquilo</em> era proibido." },
    { s:"O enunciado traz coação moral irresistível, obediência hierárquica ou menoridade.",
      r:"Tudo isso é <strong>culpabilidade</strong>, terceiro andar. O fato continua típico e ilícito; o que falta é reprovabilidade pessoal.",
      p:"Por isso o partícipe imputável que se vale de um menor responde: o fato dele é típico, ilícito e culpável." },
    { s:"O enunciado descreve conduta regular que, por acaso, termina em dano.",
      r:"Pela <strong>imputação objetiva</strong>, falta imputação quando o agente se manteve no <strong>risco permitido</strong>. Existe nexo físico, mas não normativo.",
      p:"Exemplo de prova: quem dirige respeitando todas as regras e atropela alguém que se lança sob o carro." }
  ],
  erros:"Discutir ilicitude antes de confirmar a tipicidade; confundir erro de tipo com erro de proibição; e colocar dolo na culpabilidade, que é esquema causalista, não finalista."
},
{
  m:"Direito do Trabalho",
  t:"Quando existe vínculo, e o que não se pode mudar depois",
  cobra:[
    "Os cinco requisitos da relação de emprego e qual deles decide.",
    "O princípio da proteção e seus três desdobramentos.",
    "Os limites à alteração do contrato pelo empregador.",
    "A diferença entre empregado, autônomo e trabalhador eventual."
  ],
  situacoes:[
    { s:"O enunciado descreve alguém que presta serviços e pergunta se há vínculo.",
      r:"Teste os cinco: pessoa física, pessoalidade, não eventualidade, onerosidade, <strong>subordinação</strong>. O decisivo é a subordinação — quem dirige a prestação e quem assume o risco.",
      p:"Exclusividade <strong>não</strong> é requisito, e ausência de registro em carteira não afasta o vínculo: o registro é consequência, não condição." },
    { s:"O enunciado apresenta duas normas aplicáveis ao mesmo trabalhador, ou dúvida de interpretação.",
      r:"Aplique o <strong>princípio da proteção</strong>. Dúvida na interpretação: <em>in dubio pro operario</em>. Duas normas válidas: a <strong>mais favorável</strong>. Vantagem já incorporada ao contrato: <strong>condição mais benéfica</strong>.",
      p:"Os três resolvem problemas diferentes. Identifique primeiro se o caso é de interpretar, escolher norma ou preservar vantagem." },
    { s:"O enunciado narra mudança de função, de horário, de local ou de remuneração imposta pelo empregador.",
      r:"Alteração só vale com <strong>mútuo consentimento</strong> <em>e</em> <strong>sem prejuízo</strong> ao empregado. Faltando qualquer um dos dois, é nula.",
      p:"Mesmo com concordância do empregado, a alteração lesiva é nula — a anuência não convalida o prejuízo." },
    { s:"O enunciado descreve falta grave do empregador: atraso reiterado de salários, rigor excessivo, redução salarial.",
      r:"É hipótese de <strong>rescisão indireta</strong>: o empregado rompe o contrato e recebe como se tivesse sido dispensado sem justa causa.",
      p:"Não confunda com justa causa do empregado, do art. 482. Aqui quem falta é o patrão." }
  ],
  erros:"Exigir exclusividade para reconhecer vínculo; aplicar norma mais favorável quando o caso era de interpretação; e validar alteração lesiva por haver concordância."
}
];
