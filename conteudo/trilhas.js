// Trilhas de estudo, pesos da prova, temas de maior incidência e atualizações legislativas

// Peso = número médio de questões por edição na 1ª fase (padrão estável da FGV).
// Temas = assuntos de maior incidência nas edições 35 a 45, usados pelo motor de recomendação.
window.TRILHA_OAB = [
  { d:"Ética e Estatuto da OAB", peso:8, pos:"01–08", temas:["Direitos e prerrogativas do advogado","Sociedade de advogados","Honorários","Publicidade","Infrações e sanções","Conselhos da OAB"] },
  { d:"Filosofia do Direito", peso:2, pos:"09–10", temas:["Positivismo jurídico (Kelsen e Hart)","Dworkin e os princípios","Kant e o imperativo categórico","Contratualismo","Hermenêutica"] },
  { d:"Direito Constitucional", peso:6, pos:"11–16", temas:["Organização do Estado e competências","Controle de constitucionalidade","Processo legislativo","Direitos e garantias fundamentais","Remédios constitucionais"] },
  { d:"Direitos Humanos", peso:2, pos:"17–18", temas:["Sistema Interamericano de Proteção","Povos indígenas e comunidades tradicionais","Refugiados e migrantes","Sistema global da ONU"] },
  { d:"Direito Internacional", peso:2, pos:"19–20", temas:["Lei de Migração","LINDB e regras de conexão","Competência e jurisdição internacional","Extradição"] },
  { d:"Direito Tributário", peso:5, pos:"21–25", temas:["Impostos em espécie","Crédito tributário","Limitações ao poder de tributar","Reforma tributária (IBS e CBS)","Responsabilidade tributária"] },
  { d:"Direito Administrativo", peso:5, pos:"26–30", temas:["Agentes públicos","Licitações e contratos (Lei 14.133/2021)","Improbidade administrativa","Atos administrativos","Responsabilidade civil do Estado"] },
  { d:"Direito Ambiental", peso:2, pos:"31–32", temas:["Licenciamento ambiental e estudos de impacto","Responsabilidade por danos ambientais","Princípios ambientais","Competência ambiental"] },
  { d:"Direito da Criança e do Adolescente", peso:2, pos:"33–34", temas:["Adoção e convivência familiar","Ato infracional e medidas socioeducativas","Conselho Tutelar","Remissão"] },
  { d:"Direito do Consumidor", peso:2, pos:"35–36", temas:["Responsabilidade por fato e vício","Proteção contratual e cláusulas abusivas","Práticas comerciais","Prazos (decadência e prescrição)"] },
  { d:"Direito Civil", peso:6, pos:"37–42", temas:["Parte geral e prescrição","Família","Direito das coisas","Sucessões","Obrigações","Contratos","Responsabilidade civil"] },
  { d:"Direito Empresarial", peso:4, pos:"43–46", temas:["Direito societário","Falência e recuperação judicial","Títulos de crédito","Teoria geral e estabelecimento"] },
  { d:"Direito Processual Civil", peso:6, pos:"47–52", temas:["Recursos","Procedimento comum","Execução e cumprimento de sentença","Tutelas provisórias","Competência e intervenção de terceiros"] },
  { d:"Direito Penal", peso:6, pos:"53–58", temas:["Crimes contra o patrimônio","Teoria do crime","Teoria da pena e extinção da punibilidade","Crimes contra a pessoa","Crimes contra a Administração Pública"] },
  { d:"Direito Processual Penal", peso:6, pos:"59–64", temas:["Recursos","Prisões e medidas cautelares","Procedimentos e Tribunal do Júri","Ação penal e inquérito policial","Provas"] },
  { d:"Direito Previdenciário", peso:2, pos:"65–66", temas:["Benefícios em espécie","Segurados e dependentes","Carência","Reforma da Previdência (EC 103/2019)"] },
  { d:"Direito do Trabalho", peso:5, pos:"67–71", temas:["Extinção do contrato de trabalho","Remuneração e salário","Jornada de trabalho","Contrato de trabalho","Estabilidades"] },
  { d:"Direito Processual do Trabalho", peso:5, pos:"72–76", temas:["Recursos trabalhistas","Execução trabalhista","Competência da Justiça do Trabalho","Audiência e provas"] },
  { d:"Direito Eleitoral", peso:2, pos:"77–78", temas:["Registro de candidatura e elegibilidade","Propaganda eleitoral e direito de resposta","Inelegibilidades"] },
  { d:"Direito Financeiro", peso:2, pos:"79–80", temas:["Leis orçamentárias (PPA, LDO e LOA)","Lei de Responsabilidade Fiscal","Precatórios e RPV"] }
];

// Estrutura padrão de curso de Direito, por período.
// Substituível pela matriz curricular da instituição do aluno.
window.TRILHA_GRAD = [
  { p:"1º período", m:["Introdução ao Estudo do Direito","Ciência Política e Teoria do Estado","Sociologia Jurídica","Filosofia do Direito","Economia","Hermenêutica Jurídica"] },
  { p:"2º período", m:["Direito Constitucional I","Direito Civil I — Parte Geral","Antropologia Jurídica","História do Direito","Linguagem e Argumentação Jurídica"] },
  { p:"3º período", m:["Direito Constitucional II","Direito Civil II — Obrigações","Direito Penal I — Parte Geral","Teoria Geral do Processo","Direito Romano"] },
  { p:"4º período", m:["Direito Administrativo I","Direito Civil III — Contratos","Direito Penal II — Parte Especial","Direito Processual Civil I","Direito Empresarial I"] },
  { p:"5º período", m:["Direito Administrativo II","Direito Civil IV — Direito das Coisas","Direito Penal III","Direito Processual Civil II","Direito Empresarial II","Direito do Trabalho I"] },
  { p:"6º período", m:["Direito Tributário I","Direito Civil V — Família","Direito Processual Penal I","Direito Processual Civil III","Direito do Trabalho II","Direito Previdenciário"] },
  { p:"7º período", m:["Direito Tributário II","Direito Civil VI — Sucessões","Direito Processual Penal II","Direito Processual do Trabalho","Direito do Consumidor","Direito Internacional"] },
  { p:"8º período", m:["Direito Ambiental","Direito Eleitoral","Direito Financeiro","Prática Jurídica Civil","Direitos Humanos","Direito da Criança e do Adolescente"] },
  { p:"9º período", m:["Prática Jurídica Penal","Prática Jurídica Trabalhista","Ética Profissional e Estatuto da OAB","Mediação e Arbitragem","Trabalho de Conclusão de Curso I"] },
  { p:"10º período", m:["Prática Jurídica Real","Estágio Supervisionado","Trabalho de Conclusão de Curso II","Tópicos Avançados em Direito","Preparação para o Exame de Ordem"] }
];

// Correspondência entre matérias da graduação e disciplinas da OAB,
// para o aluno ver o que já está estudando que vale ponto na prova.
window.PONTE_GRAD_OAB = {
  "Direito Constitucional I":"Direito Constitucional","Direito Constitucional II":"Direito Constitucional",
  "Direito Civil I — Parte Geral":"Direito Civil","Direito Civil II — Obrigações":"Direito Civil",
  "Direito Civil III — Contratos":"Direito Civil","Direito Civil IV — Direito das Coisas":"Direito Civil",
  "Direito Civil V — Família":"Direito Civil","Direito Civil VI — Sucessões":"Direito Civil",
  "Direito Penal I — Parte Geral":"Direito Penal","Direito Penal II — Parte Especial":"Direito Penal","Direito Penal III":"Direito Penal",
  "Direito Processual Civil I":"Direito Processual Civil","Direito Processual Civil II":"Direito Processual Civil","Direito Processual Civil III":"Direito Processual Civil",
  "Direito Processual Penal I":"Direito Processual Penal","Direito Processual Penal II":"Direito Processual Penal",
  "Direito Administrativo I":"Direito Administrativo","Direito Administrativo II":"Direito Administrativo",
  "Direito Tributário I":"Direito Tributário","Direito Tributário II":"Direito Tributário",
  "Direito do Trabalho I":"Direito do Trabalho","Direito do Trabalho II":"Direito do Trabalho",
  "Direito Processual do Trabalho":"Direito Processual do Trabalho",
  "Direito Empresarial I":"Direito Empresarial","Direito Empresarial II":"Direito Empresarial",
  "Direito do Consumidor":"Direito do Consumidor","Direito Ambiental":"Direito Ambiental",
  "Direito Eleitoral":"Direito Eleitoral","Direito Financeiro":"Direito Financeiro",
  "Direitos Humanos":"Direitos Humanos","Direito Internacional":"Direito Internacional",
  "Direito Previdenciário":"Direito Previdenciário","Filosofia do Direito":"Filosofia do Direito",
  "Direito da Criança e do Adolescente":"Direito da Criança e do Adolescente",
  "Ética Profissional e Estatuto da OAB":"Ética e Estatuto da OAB"
};

window.ATUALIZACOES = [
  { d:"Direito Tributário", t:"Reforma tributária em transição", txt:"A EC 132/2023 instituiu o IVA dual: <b>IBS</b> (Estados, DF e Municípios, em substituição ao ICMS e ao ISS) e <b>CBS</b> (União, em substituição ao PIS e à Cofins), além do <b>Imposto Seletivo</b>. A regulamentação veio pela LC 214/2025 e foi consolidada pela LC 227/2026. A transição corre de <b>2026 a 2033</b>: 2026 é ano de teste, com alíquotas simbólicas de 0,9% (CBS) e 0,1% (IBS), compensáveis com PIS/Cofins; em 2027 a CBS entra em alíquota plena e PIS/Cofins são extintos; de 2029 a 2032 o ICMS e o ISS são substituídos gradualmente; em 2033 a consolidação se completa." },
  { d:"Ética e Estatuto da OAB", t:"Lei 15.472/2026 — natureza alimentar dos honorários", txt:"Alterou a Lei 8.906/94 para explicitar que os honorários advocatícios — convencionados, fixados por arbitramento judicial ou de sucumbência — têm <b>natureza alimentar</b>, com os mesmos privilégios dos créditos trabalhistas. A proteção foi reforçada em cenários de falência, recuperação judicial e extrajudicial, insolvência civil, liquidação extrajudicial e concurso de credores. A lei também alterou o art. 24 do Estatuto." },
  { d:"Direito Penal", t:"Endurecimento penal em 2025 e 2026", txt:"Sequência de leis alterou o Código Penal, o CPP e a Lei de Execução Penal, com foco em criminalidade organizada, execução penal e crimes patrimoniais. Entre elas, a <b>Lei 15.358/2026</b> (facções, novos tipos de domínio social estruturado, regras de visita prisional), a <b>Lei 15.397/2026</b> (crimes patrimoniais, com ampliação da majorante do furto noturno) e a <b>Lei 15.407/2026</b> (ampliação das hipóteses de inclusão em presídios federais de segurança máxima). Confira a redação vigente antes de decorar quantitativos — esse é um ponto em movimento." },
  { d:"Direito Penal", t:"Lei Maria da Penha — sete leis em 2026", txt:"Entre março e maio de 2026, sete leis reformularam simultaneamente a Lei 11.340/2006, o Código Penal e a LEP: <b>15.380</b> (audiência de retratação), <b>15.383</b> (monitoração eletrônica como medida protetiva autônoma), <b>15.384</b> (violência vicária e o crime de vicaricídio), <b>15.409</b> (cadastro nacional de condenados), <b>15.410</b> (nova falta grave na LEP), <b>15.411</b> e <b>15.412</b> (medidas protetivas cíveis como título executivo judicial de pleno direito, dispensando ação principal). A <b>Lei 15.438/2026</b> ampliou o prazo decadencial para queixa e representação nesses crimes." },
  { d:"Direito do Trabalho", t:"Licença-paternidade e saúde do trabalhador", txt:"A <b>Lei 15.371/2026</b> regulamentou a licença-paternidade e instituiu o <b>salário-paternidade</b> no âmbito da Previdência Social, alterando a CLT. A <b>Lei 15.377/2026</b> incluiu o art. 169-A na CLT, com novas obrigações de divulgação de informações de saúde preventiva aos empregados. A atualização da <b>NR-1</b> passou a exigir a inclusão dos <b>riscos psicossociais</b> no gerenciamento de riscos ocupacionais." },
  { d:"Direito Administrativo", t:"Lei 15.471/2026 — alteração na Lei de Licitações", txt:"Alterou a Lei 14.133/2021. Como a Lei de Licitações é tema de alta incidência na prova (cerca de 12 questões nas últimas edições), vale conferir a redação atualizada dos dispositivos afetados antes de fixar o conteúdo." },
  { d:"Geral", t:"Como usar este módulo", txt:"A FGV cobra, em regra, a legislação <b>vigente até a publicação do edital</b>. Novidade legislativa costuma aparecer com peso baixo e em pontos de destaque — raramente em detalhe fino. A estratégia correta é dominar o conteúdo clássico e conhecer as novidades em linhas gerais, não o contrário. <b>Sempre confirme a redação vigente no Planalto antes da prova</b>, porque este material tem data de revisão e a lei muda depois dela." }
];
