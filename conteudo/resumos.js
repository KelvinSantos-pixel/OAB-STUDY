// Resumos esquematizados e tabelas comparativas
window.RESUMOS = [
{
  d: "Direito Civil", t: "Prescrição x Decadência",
  html: `<table><thead><tr><th>Critério</th><th>Prescrição</th><th>Decadência</th></tr></thead><tbody>
<tr><td>O que atinge</td><td>A <b>pretensão</b> (direito de exigir)</td><td>O <b>direito potestativo</b> em si</td></tr>
<tr><td>Origem</td><td>Sempre legal</td><td>Legal ou <b>convencional</b></td></tr>
<tr><td>Suspensão / interrupção</td><td><b>Admite</b> (arts. 197 a 204)</td><td>A legal <b>não admite</b> (art. 207)</td></tr>
<tr><td>Renúncia</td><td>Possível <b>após</b> consumada</td><td>A legal é <b>irrenunciável</b></td></tr>
<tr><td>Reconhecimento de ofício</td><td>Sim (art. 487, II, CPC)</td><td>Sim, se legal</td></tr>
<tr><td>Contra incapaz absoluto</td><td><b>Não corre</b> (art. 198, I)</td><td>Não corre (art. 208)</td></tr>
<tr><td>Prazo geral</td><td><b>10 anos</b> (art. 205)</td><td>Não há prazo geral</td></tr>
</tbody></table>
<p class="nota"><b>Atalho de prova:</b> ação <i>condenatória</i> → prescrição. Ação <i>constitutiva</i> (anular, desconstituir, redibir) → decadência.</p>
<p class="nota"><b>Prazos mais cobrados (art. 206):</b> 1 ano — segurado contra segurador · 2 anos — alimentos · <b>3 anos — reparação civil</b>, enriquecimento sem causa, aluguéis · 5 anos — dívidas líquidas em instrumento, honorários de profissional liberal.</p>`
},
{
  d: "Direito Processual Civil", t: "Prazos do CPC — tabela de consulta",
  html: `<table><thead><tr><th>Prazo</th><th>Atos</th></tr></thead><tbody>
<tr><td><b>5 dias</b></td><td>Embargos de declaração; impugnação ao valor da causa em alguns incidentes</td></tr>
<tr><td><b>15 dias</b></td><td>Contestação; apelação; agravo de instrumento; agravo interno; RE e REsp; embargos de divergência; emenda da inicial; cumprimento voluntário de sentença; impugnação ao cumprimento; embargos à execução</td></tr>
<tr><td><b>30 dias</b></td><td>Suspensão convencional do processo (máximo de 6 meses); habilitação de herdeiros em alguns casos</td></tr>
<tr><td><b>3 dias</b></td><td>Pagamento na execução de título extrajudicial</td></tr>
<tr><td><b>2 anos</b></td><td>Ação rescisória, contados do trânsito em julgado da última decisão</td></tr>
</tbody></table>
<p class="nota"><b>Contagem:</b> em <b>dias úteis</b>, excluído o dia do começo e incluído o do vencimento. Começa no primeiro dia útil seguinte à intimação.</p>
<p class="nota"><b>Prazo em dobro:</b> Ministério Público, Fazenda Pública, Defensoria Pública e litisconsortes com procuradores distintos de escritórios diferentes (salvo processo eletrônico).</p>`
},
{
  d: "Direito Processual Penal", t: "Prazos penais e processuais penais",
  html: `<table><thead><tr><th>Prazo</th><th>Ato</th></tr></thead><tbody>
<tr><td><b>24 horas</b></td><td>Apresentação do preso em audiência de custódia; comunicação da prisão ao juiz, ao MP e à família; entrega da nota de culpa</td></tr>
<tr><td><b>2 dias</b></td><td>Razões do recurso em sentido estrito; carta testemunhável; embargos infringentes</td></tr>
<tr><td><b>5 dias</b></td><td>Interposição de apelação, RESE, agravo em execução e embargos de declaração; conclusão do inquérito com réu preso</td></tr>
<tr><td><b>8 dias</b></td><td>Razões da apelação (3 dias nas contravenções)</td></tr>
<tr><td><b>10 dias</b></td><td>Apelação no Juizado Especial Criminal (com razões); RE e REsp; oferecimento de denúncia com réu preso</td></tr>
<tr><td><b>15 dias</b></td><td>Conclusão do inquérito com réu solto (prorrogável); oferecimento de denúncia com réu solto</td></tr>
<tr><td><b>6 meses</b></td><td><b>Decadência</b> do direito de queixa ou representação, do conhecimento da autoria</td></tr>
<tr><td><b>90 dias</b></td><td>Revisão obrigatória da necessidade da prisão preventiva</td></tr>
</tbody></table>
<p class="nota"><b>Atenção:</b> prazos <b>processuais penais</b> correm em <b>dias corridos</b> e não se suspendem em férias ou feriados. Prazos de <b>direito material</b> (decadência, prescrição) incluem o dia do começo — regra oposta à dos prazos processuais.</p>`
},
{
  d: "Direito Constitucional", t: "Remédios constitucionais",
  html: `<table><thead><tr><th>Remédio</th><th>Para que serve</th><th>Legitimidade</th></tr></thead><tbody>
<tr><td><b>Habeas corpus</b></td><td>Liberdade de locomoção ameaçada ou violada</td><td>Qualquer pessoa, sem advogado; gratuito</td></tr>
<tr><td><b>Mandado de segurança</b></td><td>Direito líquido e certo não amparado por HC ou HD</td><td>Titular do direito; coletivo: partido com representação, sindicato, entidade de classe, associação com 1 ano</td></tr>
<tr><td><b>Mandado de injunção</b></td><td>Falta de norma regulamentadora que inviabiliza direito constitucional</td><td>Titular do direito; admite forma coletiva</td></tr>
<tr><td><b>Habeas data</b></td><td>Conhecer ou retificar informações pessoais em registro público</td><td>Somente o próprio titular dos dados</td></tr>
<tr><td><b>Ação popular</b></td><td>Anular ato lesivo ao patrimônio público, à moralidade, ao meio ambiente e ao patrimônio histórico</td><td><b>Cidadão</b> (com título de eleitor); isento de custas, salvo má-fé</td></tr>
</tbody></table>
<p class="nota"><b>Pegadinhas frequentes:</b> pessoa jurídica <b>não</b> propõe ação popular (Súmula 365/STF). Habeas data não serve para obter dados de terceiros. MS tem prazo <b>decadencial de 120 dias</b>. Não cabe MS contra lei em tese (Súmula 266/STF) nem contra decisão judicial passível de recurso (Súmula 267/STF).</p>`
},
{
  d: "Direito Constitucional", t: "Controle de constitucionalidade — comparativo",
  html: `<table><thead><tr><th></th><th>Difuso</th><th>Concentrado</th></tr></thead><tbody>
<tr><td>Competência</td><td>Qualquer juiz ou tribunal</td><td>STF (federal/estadual em face da CF) e TJ (estadual/municipal em face da CE)</td></tr>
<tr><td>Via</td><td>Incidental, no caso concreto</td><td>Ação principal, em abstrato</td></tr>
<tr><td>Efeitos</td><td><i>Inter partes</i> e, em regra, <i>ex tunc</i></td><td><i>Erga omnes</i> e <b>vinculante</b></td></tr>
<tr><td>Quem provoca</td><td>Partes, MP, terceiro, de ofício</td><td>Legitimados do art. 103</td></tr>
</tbody></table>
<p class="nota"><b>Ações do controle concentrado:</b> <b>ADI</b> (lei ou ato normativo federal ou estadual posterior à CF) · <b>ADC</b> (presunção de constitucionalidade de lei federal) · <b>ADO</b> (omissão legislativa) · <b>ADPF</b> (caráter subsidiário; alcança ato municipal, direito pré-constitucional e atos não normativos).</p>
<p class="nota"><b>Reserva de plenário</b> (art. 97 + SV 10): órgão fracionário não afasta a aplicação de lei por inconstitucionalidade. Exceções: lei já declarada inconstitucional pelo STF, juízo monocrático de primeiro grau e interpretação conforme sem declaração de nulidade.</p>`
},
{
  d: "Direito Civil", t: "Usucapião — todas as modalidades",
  html: `<table><thead><tr><th>Modalidade</th><th>Prazo</th><th>Requisitos específicos</th></tr></thead><tbody>
<tr><td>Extraordinária (1.238)</td><td><b>15 anos</b><br>(10 se moradia habitual ou obras produtivas)</td><td>Dispensa justo título e boa-fé</td></tr>
<tr><td>Ordinária (1.242)</td><td><b>10 anos</b><br>(5 em caso especial)</td><td>Justo título <b>e</b> boa-fé; redução se aquisição onerosa com registro cancelado + moradia ou investimento social/econômico</td></tr>
<tr><td>Especial urbana (CF 183 / CC 1.240)</td><td><b>5 anos</b></td><td>Até <b>250 m²</b>; moradia própria ou da família; não ser proprietário de outro imóvel; uma única vez</td></tr>
<tr><td>Especial rural (CF 191 / CC 1.239)</td><td><b>5 anos</b></td><td>Até <b>50 hectares</b>; tornar produtiva pelo trabalho; moradia; não possuir outro imóvel</td></tr>
<tr><td>Familiar (1.240-A)</td><td><b>2 anos</b></td><td>Até 250 m²; imóvel urbano dividido com ex-cônjuge ou ex-companheiro que <b>abandonou o lar</b>; posse direta e exclusiva</td></tr>
<tr><td>Coletiva (Estatuto da Cidade, 10)</td><td>5 anos</td><td>Núcleo urbano informal; população de baixa renda; área total dividida por possuidor inferior a 250 m²</td></tr>
</tbody></table>
<p class="nota"><b>Comum a todas:</b> posse <b>mansa, pacífica e ininterrupta</b>, com <i>animus domini</i>. Bens públicos <b>não</b> se usucapem (CF, arts. 183, § 3º, e 191, parágrafo único; Súmula 340/STF).</p>`
},
{
  d: "Direito Penal", t: "Concurso de crimes e institutos próximos",
  html: `<table><thead><tr><th>Instituto</th><th>Condutas</th><th>Consequência</th></tr></thead><tbody>
<tr><td><b>Concurso material</b> (69)</td><td>Mais de uma conduta → mais de um crime</td><td>Penas <b>somadas</b> (cúmulo material)</td></tr>
<tr><td><b>Concurso formal próprio</b> (70, 1ª parte)</td><td>Uma conduta → mais de um crime, sem desígnios autônomos</td><td>Pena mais grave <b>+ 1/6 até 1/2</b> (exasperação)</td></tr>
<tr><td><b>Concurso formal impróprio</b> (70, 2ª parte)</td><td>Uma conduta → mais de um crime, com <b>desígnios autônomos</b></td><td>Penas <b>somadas</b></td></tr>
<tr><td><b>Crime continuado</b> (71)</td><td>Mais de uma conduta, crimes da mesma espécie, mesmas condições de tempo, lugar e execução</td><td>Pena de um só <b>+ 1/6 a 2/3</b></td></tr>
<tr><td><b>Continuado específico</b> (71, § único)</td><td>Crimes dolosos, violência ou grave ameaça, vítimas diferentes</td><td>Pena de um só até o <b>triplo</b></td></tr>
<tr><td><b>Crime único</b> (conflito aparente)</td><td>Uma conduta, um crime; resolve-se por especialidade, subsidiariedade, consunção ou alternatividade</td><td>Aplica-se uma única norma</td></tr>
</tbody></table>
<p class="nota"><b>Limite de cumprimento:</b> 40 anos (art. 75, com a redação do pacote anticrime). <b>Concurso material benéfico</b> (art. 70, parágrafo único): se a exasperação resultar pena maior que a soma, aplica-se a soma.</p>`
},
{
  d: "Direito Processual Penal", t: "Soluções consensuais no processo penal",
  html: `<table><thead><tr><th></th><th>Transação penal</th><th>Suspensão condicional do processo</th><th>ANPP</th></tr></thead><tbody>
<tr><td>Base legal</td><td>Lei 9.099/95, art. 76</td><td>Lei 9.099/95, art. 89</td><td>CPP, art. 28-A</td></tr>
<tr><td>Cabimento</td><td>Infração de <b>menor potencial ofensivo</b> (pena máx. 2 anos)</td><td>Pena mínima <b>≤ 1 ano</b></td><td>Sem violência ou grave ameaça; pena mínima <b>&lt; 4 anos</b></td></tr>
<tr><td>Momento</td><td>Antes da denúncia</td><td>Com a denúncia</td><td>Antes da denúncia</td></tr>
<tr><td>Confissão</td><td><b>Não</b> exige</td><td><b>Não</b> exige</td><td><b>Exige</b> formal e circunstanciada</td></tr>
<tr><td>Efeito</td><td>Aplicação imediata de pena restritiva ou multa; não gera reincidência nem antecedente</td><td>Período de prova de 2 a 4 anos; cumprido, extingue a punibilidade</td><td>Cumprido, extingue a punibilidade; não gera reincidência</td></tr>
</tbody></table>
<p class="nota"><b>Impedimentos do ANPP:</b> cabimento de transação; reincidência ou conduta criminal habitual; ANPP, transação ou suspensão nos 5 anos anteriores; crimes de violência doméstica e familiar contra a mulher ou praticados em razão do gênero.</p>`
},
{
  d: "Direito do Trabalho", t: "Extinção do contrato — o que cada verba depende",
  html: `<table><thead><tr><th>Verba</th><th>Sem justa causa</th><th>Pedido de demissão</th><th>Justa causa</th><th>Acordo (484-A)</th></tr></thead><tbody>
<tr><td>Saldo de salário</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td>Aviso prévio</td><td>✔ integral</td><td>Devido <i>pelo</i> empregado</td><td>✘</td><td>✔ <b>metade</b>, se indenizado</td></tr>
<tr><td>13º proporcional</td><td>✔</td><td>✔</td><td>✘</td><td>✔</td></tr>
<tr><td>Férias vencidas + 1/3</td><td>✔</td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td>Férias proporcionais + 1/3</td><td>✔</td><td>✔</td><td>✘</td><td>✔</td></tr>
<tr><td>Multa do FGTS</td><td>✔ <b>40%</b></td><td>✘</td><td>✘</td><td>✔ <b>20%</b></td></tr>
<tr><td>Saque do FGTS</td><td>✔ 100%</td><td>✘</td><td>✘</td><td>✔ até <b>80%</b></td></tr>
<tr><td>Seguro-desemprego</td><td>✔</td><td>✘</td><td>✘</td><td>✘</td></tr>
</tbody></table>
<p class="nota"><b>Prazo de pagamento:</b> <b>10 dias</b> contados do término do contrato, em qualquer modalidade (art. 477, § 6º). Atraso gera multa equivalente a um salário do empregado.</p>
<p class="nota"><b>Culpa recíproca</b> (art. 484 + Súmula 14/TST): metade do aviso prévio, do 13º e das férias proporcionais; multa do FGTS de 20%.</p>`
},
{
  d: "Direito Tributário", t: "Anterioridade e suas exceções",
  html: `<table><thead><tr><th>Tributo</th><th>Anterioridade anual</th><th>Noventena</th></tr></thead><tbody>
<tr><td>II, IE, IOF, IEG, empréstimo compulsório (guerra/calamidade)</td><td>✘ dispensada</td><td>✘ dispensada</td></tr>
<tr><td>IPI</td><td>✘ dispensada</td><td>✔ aplica-se</td></tr>
<tr><td>CIDE-combustíveis e ICMS-combustíveis (redução/restabelecimento)</td><td>✘ dispensada</td><td>✔ aplica-se</td></tr>
<tr><td>Contribuições sociais (art. 195, § 6º)</td><td>✘ dispensada</td><td>✔ aplica-se</td></tr>
<tr><td><b>Imposto de renda</b></td><td>✔ aplica-se</td><td>✘ dispensada</td></tr>
<tr><td><b>Base de cálculo</b> do IPTU e do IPVA</td><td>✔ aplica-se</td><td>✘ dispensada</td></tr>
<tr><td>Demais tributos</td><td>✔ aplica-se</td><td>✔ aplica-se</td></tr>
</tbody></table>
<p class="nota"><b>Leitura rápida:</b> os quatro extrafiscais de urgência (II, IE, IOF, IEG) não esperam nada. IPI e as contribuições esperam só 90 dias. IR e as bases de IPTU/IPVA esperam só a virada do exercício.</p>
<p class="nota"><b>Não confundir com legalidade:</b> II, IE, IPI, IOF e CIDE-combustíveis admitem alteração de <b>alíquota</b> por ato do Executivo, nos limites legais — mas a <b>instituição</b> sempre exige lei.</p>`
},
{
  d: "Direito Tributário", t: "Crédito tributário — suspensão, extinção e exclusão",
  html: `<table><thead><tr><th>Suspensão (art. 151)</th><th>Extinção (art. 156)</th><th>Exclusão (art. 175)</th></tr></thead><tbody>
<tr><td>Moratória<br>Depósito do montante integral<br>Reclamações e recursos administrativos<br>Liminar em mandado de segurança<br>Tutela em outras ações<br>Parcelamento</td><td>Pagamento<br>Compensação<br>Transação<br>Remissão<br>Prescrição e decadência<br>Conversão de depósito em renda<br>Pagamento antecipado + homologação<br>Consignação em pagamento procedente<br>Decisão administrativa irreformável<br>Decisão judicial passada em julgado<br>Dação em pagamento de bens imóveis</td><td><b>Isenção</b><br><b>Anistia</b></td></tr>
</tbody></table>
<p class="nota"><b>Mnemônico da suspensão — MODERECOPA:</b> MOratória, DEpósito, REclamações e recursos, COncessão de liminar/tutela, PArcelamento.</p>
<p class="nota"><b>Pegadinha clássica:</b> <b>parcelamento</b> suspende; <b>conversão de depósito em renda</b> e <b>dação em pagamento</b> extinguem. Isenção e anistia <b>não dispensam</b> as obrigações acessórias (art. 175, parágrafo único).</p>`
},
{
  d: "Direito Administrativo", t: "Licitação — modalidades e contratação direta",
  html: `<table><thead><tr><th>Modalidade</th><th>Uso típico</th></tr></thead><tbody>
<tr><td><b>Pregão</b></td><td>Bens e serviços <b>comuns</b>; critério de menor preço ou maior desconto</td></tr>
<tr><td><b>Concorrência</b></td><td>Obras, serviços de engenharia e bens e serviços <b>especiais</b></td></tr>
<tr><td><b>Concurso</b></td><td>Trabalho técnico, científico ou artístico; prêmio ou remuneração</td></tr>
<tr><td><b>Leilão</b></td><td>Alienação de bens imóveis ou móveis inservíveis; maior lance</td></tr>
<tr><td><b>Diálogo competitivo</b></td><td>Inovação tecnológica, soluções não disponíveis no mercado, objeto de difícil especificação prévia</td></tr>
</tbody></table>
<p class="nota"><b>Extintas pela Lei 14.133/2021:</b> tomada de preços e convite.</p>
<table><thead><tr><th>Dispensa (art. 75)</th><th>Inexigibilidade (art. 74)</th></tr></thead><tbody>
<tr><td>Competição é <b>possível</b>, mas a lei autoriza a contratação direta: baixo valor, emergência ou calamidade, licitação deserta ou fracassada, contratação de remanescente de obra.</td><td>Competição é <b>inviável</b>: fornecedor exclusivo, serviço técnico especializado de natureza intelectual com notória especialização, profissional do setor artístico, credenciamento, aquisição de imóvel com características específicas.</td></tr>
</tbody></table>`
},
{
  d: "Direito Empresarial", t: "Falência — ordem de pagamento dos créditos",
  html: `<table><thead><tr><th>Ordem</th><th>Classe</th></tr></thead><tbody>
<tr><td>—</td><td><b>Pedidos de restituição</b> (bens de terceiros arrecadados)</td></tr>
<tr><td>—</td><td><b>Créditos extraconcursais</b> (art. 84): remunerações do administrador judicial, obrigações do próprio processo, tributos posteriores à decretação, entre outros</td></tr>
<tr><td>1º</td><td>Trabalhistas e de acidente de trabalho, limitados a <b>150 salários mínimos</b> por credor</td></tr>
<tr><td>2º</td><td>Com <b>garantia real</b>, até o limite do valor do bem gravado</td></tr>
<tr><td>3º</td><td><b>Tributários</b>, excetuadas as multas tributárias</td></tr>
<tr><td>4º</td><td><b>Quirografários</b></td></tr>
<tr><td>5º</td><td>Multas contratuais e penas pecuniárias, inclusive as tributárias</td></tr>
<tr><td>6º</td><td><b>Subordinados</b></td></tr>
<tr><td>7º</td><td>Juros vencidos após a decretação da falência</td></tr>
</tbody></table>
<p class="nota"><b>Atenção:</b> o excedente dos trabalhistas acima de 150 salários mínimos é reclassificado como <b>quirografário</b>. Créditos de <b>alienação fiduciária</b>, arrendamento mercantil e adiantamento de contrato de câmbio não se submetem à falência nem à recuperação.</p>`
},
{
  d: "Ética e Estatuto da OAB", t: "Ética — mapa das infrações e sanções",
  html: `<table><thead><tr><th>Sanção</th><th>Hipóteses</th><th>Observação</th></tr></thead><tbody>
<tr><td><b>Censura</b></td><td>Art. 34, I a XVI, XXIX; violação a preceito do CED; violação de preceito do Estatuto sem sanção específica</td><td>Pode ser convertida em <b>advertência em ofício reservado</b>, se houver atenuante</td></tr>
<tr><td><b>Suspensão</b></td><td>Art. 34, XVII a XXV — inclui reter abusivamente autos, deixar de prestar contas, recusar-se a prestar contas de valores</td><td>30 dias a 12 meses; nos casos de prestação de contas e retenção, perdura até a satisfação</td></tr>
<tr><td><b>Exclusão</b></td><td>Art. 34, XXVI a XXVIII — inclui <b>locupletar-se</b> de valores do cliente; aplicação de <b>3 suspensões</b></td><td>Exige <b>2/3</b> dos membros do Conselho Seccional</td></tr>
<tr><td><b>Multa</b></td><td>Cumulável com censura ou suspensão</td><td>De 1 a 10 vezes o valor da anuidade</td></tr>
</tbody></table>
<p class="nota"><b>Prescrição:</b> 5 anos da constatação oficial do fato; intercorrente de 3 anos de paralisação. <b>Reabilitação:</b> após 1 ano do cumprimento da sanção, com prova de bom comportamento.</p>
<p class="nota"><b>Competência:</b> instaura e instrui o Conselho Seccional <b>onde ocorreu a infração</b>; julga o da <b>inscrição principal</b> quando diverso.</p>`
},
{
  d: "Direito Previdenciário", t: "Dependentes e carência",
  html: `<table><thead><tr><th>Classe</th><th>Quem integra</th><th>Dependência econômica</th></tr></thead><tbody>
<tr><td><b>1ª</b></td><td>Cônjuge, companheiro(a), filho não emancipado menor de 21 anos, inválido ou com deficiência</td><td><b>Presumida</b></td></tr>
<tr><td><b>2ª</b></td><td>Pais</td><td>Comprovada</td></tr>
<tr><td><b>3ª</b></td><td>Irmão não emancipado menor de 21 anos, inválido ou com deficiência</td><td>Comprovada</td></tr>
</tbody></table>
<p class="nota"><b>Regra de exclusão:</b> a existência de dependente de qualquer classe <b>exclui</b> do direito os das classes seguintes.</p>
<table><thead><tr><th>Carência</th><th>Benefícios</th></tr></thead><tbody>
<tr><td><b>Sem carência</b></td><td>Pensão por morte; salário-família; auxílio-acidente; incapacidade por <b>acidente de qualquer natureza</b>, doença profissional ou doença da lista oficial</td></tr>
<tr><td><b>10 contribuições</b></td><td>Salário-maternidade (contribuinte individual, facultativa e segurada especial)</td></tr>
<tr><td><b>12 contribuições</b></td><td>Auxílio por incapacidade temporária; aposentadoria por incapacidade permanente</td></tr>
<tr><td><b>180 contribuições</b></td><td>Aposentadorias por idade, por tempo de contribuição e especial</td></tr>
</tbody></table>`
}
];
