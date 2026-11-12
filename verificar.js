#!/usr/bin/env node
/* Verificador do conteúdo e da estrutura.
   Uso:  node verificar.js           */

global.window = global;
['questoes-1','questoes-2','questoes-3','questoes-4','flashcards','resumos','trilhas']
  .forEach(f => require('./conteudo/' + f + '.js'));

const BANCO = [].concat(Q1, Q2, Q3, Q4);
const DISC  = TRILHA_OAB.map(x => x.d);
const PESO  = {}; TRILHA_OAB.forEach(x => PESO[x.d] = x.peso);

const graves = [], avisos = [], notas = [];
const grave = m => graves.push(m);
const aviso = m => avisos.push(m);
const nota  = m => notas.push(m);

/* ---------- utilidades ---------- */
const SEM_FECHO = new Set(['br','hr','img','input','meta','link']);
function htmlDesbalanceado(txt) {
  const pilha = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(txt))) {
    const tag = m[1].toLowerCase();
    if (SEM_FECHO.has(tag) || m[2] === '/') continue;
    if (m[0][1] === '/') {
      if (pilha.pop() !== tag) return 'fechamento inesperado de </' + tag + '>';
    } else pilha.push(tag);
  }
  return pilha.length ? 'tag(s) sem fechar: ' + pilha.join(', ') : null;
}
const semTags = t => String(t).replace(/<[^>]+>/g, '');
const normal  = t => semTags(t).toLowerCase().replace(/\s+/g, ' ').trim();

/* erros de digitação e de português que já apareceram no material */
const TROCAS = [
  [/\bComeçe\b/g, 'Comece'],
  [/\bconsiste em em\b/gi, 'consiste em'],
  [/\bpor que\b(?=\s+(?:a|o|as|os)\s)/g, 'porque (confira a grafia)'],
  [/\bpossue\b/gi, 'possui'],
  [/\bobrigacao\b/gi, 'obrigação'],
  [/\bhaverá de haver\b/gi, 'haverá'],
];
const SEM_ACENTO = [
  'codigo','constituicao','obrigacao','execucao','prescricao','decadencia','competencia',
  'reparacao','juridico','publico','municipio','tributario','penal\\.','direcao','funcao',
  'administracao','sancao','infracao','prisao','acao','nao','esta e'
];

/* ---------- 1. questões: estrutura ---------- */
BANCO.forEach((q, i) => {
  const onde = 'Q' + i + ' [' + (q.d || '?') + ']';
  if (!q.d) grave(onde + ': sem disciplina');
  else if (!DISC.includes(q.d)) grave(onde + ': disciplina não existe em trilhas.js');
  if (!q.t) grave(onde + ': sem tema');
  if (!q.e) grave(onde + ': sem enunciado');
  if (!q.co) grave(onde + ': sem comentário');
  if (!q.f) grave(onde + ': sem fundamento legal');
  if (!['facil','medio','dificil'].includes(q.n)) grave(onde + ': nível inválido');
  if (!Array.isArray(q.a) || q.a.length !== 4) grave(onde + ': não tem exatamente 4 alternativas');
  else {
    if (new Set(q.a.map(normal)).size !== 4) grave(onde + ': alternativas repetidas');
    q.a.forEach((a, k) => { if (!String(a).trim()) grave(onde + ': alternativa ' + k + ' vazia'); });
  }
  if (typeof q.c !== 'number' || q.c < 0 || q.c > 3) grave(onde + ': gabarito fora do intervalo');
});

/* ---------- 2. questões: HTML e texto ---------- */
BANCO.forEach((q, i) => {
  const onde = 'Q' + i + ' [' + q.d + ']';
  ['e','co','f'].forEach(campo => {
    const d = htmlDesbalanceado(String(q[campo] || ''));
    if (d) grave(onde + ' campo "' + campo + '": ' + d);
  });
  (q.a || []).forEach((a, k) => {
    const d = htmlDesbalanceado(String(a));
    if (d) grave(onde + ' alternativa ' + k + ': ' + d);
  });
  const todo = [q.e, q.co, q.f].concat(q.a || []).join(' ');
  TROCAS.forEach(([re, certo]) => {
    if (re.test(todo)) aviso(onde + ': possível erro de escrita, use "' + certo + '"');
    re.lastIndex = 0;
  });
  if (/\s{2,}/.test(semTags(q.e))) aviso(onde + ': espaço duplo no enunciado');
  if (/\s+[,.;:]/.test(semTags(q.e))) aviso(onde + ': espaço antes de pontuação no enunciado');
  const re = new RegExp('\\b(' + SEM_ACENTO.join('|') + ')\\b', 'i');
  if (re.test(semTags(q.e + ' ' + q.co))) aviso(onde + ': palavra possivelmente sem acento');
  if (!/\.$|\?$|:$/.test(semTags(q.e).trim())) aviso(onde + ': enunciado não termina em pontuação');
});

/* ---------- 3. questões duplicadas ---------- */
const vistos = new Map();
BANCO.forEach((q, i) => {
  const chave = normal(q.e).slice(0, 120);
  if (vistos.has(chave)) grave('Q' + i + ' repete o enunciado de Q' + vistos.get(chave));
  else vistos.set(chave, i);
});

/* ---------- 4. vício clássico: a correta ser sempre a mais longa ---------- */
let maisLonga = 0, maisCurta = 0;
BANCO.forEach(q => {
  if (!Array.isArray(q.a) || q.a.length !== 4) return;
  const tam = q.a.map(a => semTags(a).length);
  const max = Math.max.apply(null, tam), min = Math.min.apply(null, tam);
  if (tam[q.c] === max) maisLonga++;
  if (tam[q.c] === min) maisCurta++;
});
const pctLonga = maisLonga / BANCO.length;
nota('Correta é a alternativa mais longa em ' + Math.round(pctLonga*100) + '% das questões (esperado ~25%)');
if (pctLonga > 0.45) aviso('A correta tende a ser a mais longa. O aluno pode acertar pelo tamanho, sem saber a matéria.');
nota('Correta é a mais curta em ' + Math.round(maisCurta/BANCO.length*100) + '%');

/* ---------- 5. fundamento legal ---------- */
const PISTAS = /arts?\.|artigo|súmula|lei|cf\/88|cpc|cpp|clt|ctn|cc,|cdc|eca|adct|ec |lc |provimento|ced|decreto|convenção|constituição|adi|adc|adpf|tema/i;
const DOUTRINARIAS = ['Filosofia do Direito'];
BANCO.forEach((q, i) => {
  if (DOUTRINARIAS.includes(q.d)) return;   /* aqui o fundamento é doutrina, não norma */
  if (q.f && !PISTAS.test(q.f)) aviso('Q' + i + ' [' + q.d + ']: fundamento sem referência normativa reconhecível — "' + q.f + '"');
});

/* ---------- 6. cobertura por disciplina ---------- */
const porD = {}; BANCO.forEach(q => porD[q.d] = (porD[q.d]||0)+1);
DISC.forEach(d => {
  const n = porD[d] || 0;
  if (n < PESO[d]) grave(d + ': ' + n + ' questões no banco, mas a prova pede ' + PESO[d]);
  if (!FLASHCARDS.some(f => f.d === d)) aviso(d + ': sem nenhum flashcard');
  if (!RESUMOS.some(r => r.d === d)) nota(d + ': sem resumo (opcional)');
});
if (TRILHA_OAB.reduce((s,x)=>s+x.peso,0) !== 80) grave('A soma dos pesos das disciplinas não dá 80');

/* ---------- 7. temas ---------- */
const temasPorD = {}; TRILHA_OAB.forEach(x => temasPorD[x.d] = x.temas.map(normal));
const orfaos = new Set();
BANCO.forEach(q => {
  const lista = temasPorD[q.d] || [];
  const t = normal(q.t);
  if (!lista.some(x => x.includes(t) || t.includes(x) || x.split(' ')[0] === t.split(' ')[0])) orfaos.add(q.d + ' → ' + q.t);
});
if (orfaos.size) nota(orfaos.size + ' tema(s) de questão não listados na trilha (não é erro; a trilha só mostra os principais)');

/* ---------- 8. flashcards ---------- */
FLASHCARDS.forEach((f, i) => {
  const onde = 'Flashcard ' + i;
  if (!f.d || !DISC.includes(f.d)) grave(onde + ': disciplina inválida — ' + f.d);
  if (!f.f || !String(f.f).trim()) grave(onde + ': frente vazia');
  if (!f.v || !String(f.v).trim()) grave(onde + ': verso vazio');
  const d = htmlDesbalanceado(String(f.v || ''));
  if (d) grave(onde + ' verso: ' + d);
  if (semTags(f.f).length > 90) aviso(onde + ': frente longa (' + semTags(f.f).length + ' caracteres), difícil de ler como pergunta');
});
const fDup = new Map();
FLASHCARDS.forEach((f,i) => {
  const k = normal(f.f);
  if (fDup.has(k)) grave('Flashcard ' + i + ' repete a frente do ' + fDup.get(k));
  else fDup.set(k, i);
});

/* ---------- 9. resumos ---------- */
RESUMOS.forEach((r, i) => {
  const onde = 'Resumo ' + i + ' ("' + r.t + '")';
  if (!r.d || !DISC.includes(r.d)) grave(onde + ': disciplina inválida — ' + r.d);
  if (!r.t) grave(onde + ': sem título');
  const d = htmlDesbalanceado(String(r.html || ''));
  if (d) grave(onde + ': ' + d);
  const tabelas = (String(r.html).match(/<table/g) || []).length;
  const linhas  = (String(r.html).match(/<tr/g) || []).length;
  if (tabelas && !linhas) grave(onde + ': tabela sem linhas');
  /* colunas do cabeçalho x colunas das linhas */
  String(r.html).split('<table').slice(1).forEach((bloco, bi) => {
    const th = (bloco.split('</thead>')[0].match(/<th[\s>]/g) || []).length;
    const corpo = bloco.split('<tbody>')[1] || '';
    corpo.split('<tr>').slice(1).forEach((tr, li) => {
      const td = (tr.match(/<t[dh][\s>]/g) || []).length;
      if (th && td && td !== th) aviso(onde + ': tabela ' + (bi+1) + ', linha ' + (li+1) + ' tem ' + td + ' células para ' + th + ' colunas');
    });
  });
});
const rDup = new Map();
RESUMOS.forEach((r,i) => {
  const k = normal(r.t);
  if (rDup.has(k)) grave('Resumo ' + i + ' repete o título do ' + rDup.get(k));
  else rDup.set(k, i);
});

/* ---------- 10. trilha da graduação ---------- */
Object.keys(PONTE_GRAD_OAB).forEach(m => {
  if (!DISC.includes(PONTE_GRAD_OAB[m])) grave('Ponte graduação→OAB aponta para disciplina inexistente: ' + m);
});
const materias = [].concat.apply([], TRILHA_GRAD.map(p => p.m));
Object.keys(PONTE_GRAD_OAB).forEach(m => {
  if (!materias.includes(m)) aviso('Ponte cita matéria que não está em nenhum período: ' + m);
});

/* ---------- 11. atualizações ---------- */
ATUALIZACOES.forEach((a, i) => {
  if (!a.t || !a.txt) grave('Atualização ' + i + ': campo faltando');
  const d = htmlDesbalanceado(String(a.txt || ''));
  if (d) grave('Atualização ' + i + ': ' + d);
  if (a.d !== 'Geral' && !DISC.includes(a.d)) grave('Atualização ' + i + ': disciplina inválida — ' + a.d);
});

/* ---------- relatório ---------- */
const niv = {}; BANCO.forEach(q => niv[q.n] = (niv[q.n]||0)+1);
console.log('===== CONTEÚDO =====');
console.log('Questões: ' + BANCO.length + '  (fácil ' + (niv.facil||0) + ' · médio ' + (niv.medio||0) + ' · difícil ' + (niv.dificil||0) + ')');
console.log('Flashcards: ' + FLASHCARDS.length + '   Resumos: ' + RESUMOS.length + '   Atualizações: ' + ATUALIZACOES.length);
console.log('Disciplinas: ' + DISC.length + '   Soma dos pesos: ' + TRILHA_OAB.reduce((s,x)=>s+x.peso,0));

console.log('\n===== OBSERVAÇÕES =====');
notas.forEach(m => console.log('  · ' + m));

console.log('\n===== AVISOS (' + avisos.length + ') =====');
avisos.length ? avisos.forEach(m => console.log('  ! ' + m)) : console.log('  nenhum');

console.log('\n===== ERROS GRAVES (' + graves.length + ') =====');
graves.length ? graves.forEach(m => console.log('  X ' + m)) : console.log('  nenhum');

console.log('\n' + (graves.length ? 'REPROVADO — corrija os erros graves antes de publicar.'
                                  : 'APROVADO — nenhum erro grave.'));
process.exit(graves.length ? 1 : 0);
