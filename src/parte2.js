/* ============================================================
   Preparatório OAB & Graduação — lógica da aplicação
   ============================================================ */

/* ---------- banco ----------
   As alternativas são redistribuídas de forma determinística para que o gabarito
   fique equilibrado entre A, B, C e D. Sem isso o aluno aprende a chutar uma letra,
   o que falseia o diagnóstico. Determinístico = a mesma questão sempre aparece com
   as alternativas na mesma ordem, em qualquer dispositivo. */
function sorteador(semente){
  let s = semente>>>0;
  return function(){ s = (s*1664525 + 1013904223)>>>0; return s/4294967296; };
}
const PADRAO_GABARITO = [0,2,1,3,2,0,3,1];
function redistribuir(q,i){
  const alvo = PADRAO_GABARITO[i % PADRAO_GABARITO.length];
  const correta = q.a[q.c];
  const outras = q.a.filter(function(_,k){ return k!==q.c; });
  const r = sorteador(i*2654435761 + 17);
  for(let k=outras.length-1;k>0;k--){
    const j = Math.floor(r()*(k+1));
    const tmp = outras[k]; outras[k]=outras[j]; outras[j]=tmp;
  }
  const a=[]; let oi=0;
  for(let k=0;k<4;k++) a.push(k===alvo ? correta : outras[oi++]);
  return Object.assign({},q,{a:a,c:alvo,id:i});
}
const BANCO = [].concat(window.Q1,window.Q2,window.Q3,window.Q4).map(redistribuir);
const DISC  = TRILHA_OAB.map(x=>x.d);
const PESO  = {}; TRILHA_OAB.forEach(x=>PESO[x.d]=x.peso);
const TEMAS = {}; TRILHA_OAB.forEach(x=>TEMAS[x.d]=x.temas);
const LETRA = ['A','B','C','D'];

/* ---------- níveis e medalhas ---------- */
const NIVEIS = [
  [0,'Calouro'],[400,'Bacharelando'],[1200,'Bacharel'],[2400,'Estagiário'],
  [4000,'Advogado Júnior'],[6500,'Advogado Pleno'],[10000,'Advogado Sênior'],[15000,'Jurista']
];
const MEDALHAS = [
  {id:'primeira',  n:'Primeira prova',    d:'Concluiu um simulado completo de 80 questões'},
  {id:'corte',     n:'Nota de corte',     d:'40 acertos ou mais em um simulado completo'},
  {id:'folgado',   n:'Com folga',         d:'55 acertos ou mais em um simulado completo'},
  {id:'etica',     n:'Ética impecável',   d:'Acertou todas as questões de Ética em um simulado'},
  {id:'cem',       n:'Cem questões',      d:'Respondeu 100 questões na plataforma'},
  {id:'maratona',  n:'Maratona',          d:'Respondeu 500 questões na plataforma'},
  {id:'of7',       n:'Sete dias',         d:'Estudou sete dias seguidos'},
  {id:'of30',      n:'Um mês inteiro',    d:'Estudou trinta dias seguidos'},
  {id:'caderno',   n:'Caderno limpo',     d:'Zerou o caderno de erros'},
  {id:'todas',     n:'Volta completa',    d:'Treinou todas as 20 disciplinas'},
  {id:'virada',    n:'Virada',            d:'Melhorou a nota em dois simulados seguidos'},
  {id:'baralho',   n:'Baralho na mão',    d:'Revisou todos os flashcards'}
];

/* ---------- estado ---------- */
const CHAVE = 'prepoab.v1';
function vazio(){
  return {entrou:false,usuario:'',aluno:'',prova:'',xp:0,med:[],streak:0,ultimoDia:'',
          hist:[],erros:[],resp:{},respondidas:0,flash:[],lidos:[],plano:null,srs:{},congelamentos:2,
          cfg:{endpoint:'',apiKey:'',modelo:'gemini-3.5-flash'}};
}
let S = (function(){
  try{ const r = JSON.parse(localStorage.getItem(CHAVE)); return r? Object.assign(vazio(),r):vazio(); }
  catch(e){ return vazio(); }
})();
function salvar(){ try{ localStorage.setItem(CHAVE,JSON.stringify(S)); }catch(e){} }

/* ---------- utilidades ---------- */
const $ = s=>document.querySelector(s);
const esc = t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hoje = ()=>new Date().toISOString().slice(0,10);
function embaralhar(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function pct(n){ return Math.round(n*100)+'%'; }
function nivel(xp){
  let i=0; for(let k=0;k<NIVEIS.length;k++) if(xp>=NIVEIS[k][0]) i=k;
  const prox = NIVEIS[i+1];
  return {idx:i,nome:NIVEIS[i][1],base:NIVEIS[i][0],prox:prox?prox[0]:null,proxNome:prox?prox[1]:null};
}
function dataBR(iso){ const d=new Date(iso); return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'}); }
function classeTaxa(t){ return t===null?'':(t<.5?'ruim':(t<.7?'media':'boa')); }

/* ---------- ofensiva e XP ---------- */
function marcarDia(){
  const h = hoje();
  if(S.ultimoDia===h) return;
  const ontem = new Date(Date.now()-864e5).toISOString().slice(0,10);
  S.streak = (S.ultimoDia===ontem)? S.streak+1 : 1;
  S.ultimoDia = h;
  if(S.streak>=7) ganhar('of7'); if(S.streak>=30) ganhar('of30');
  salvar();
}
function xp(n){ S.xp += n; salvar(); }
function ganhar(id){ if(!S.med.includes(id)){ S.med.push(id); salvar(); return true; } return false; }

/* registra o resultado de uma questão no acumulado por disciplina */
function registrar(q,acertou){
  marcarDia();
  S.respondidas++;
  /* mantém a revisão espaçada em dia mesmo quando o aluno responde
     fora da sessão — no treino livre, no simulado ou no caderno */
  if(!oSrs()[q.id] || !SESSAO || BANCO[SESSAO.ids[SESSAO.i]] !== q){
    const r = oSrs()[q.id];
    agendar(q.id, acertou ? ((r && r.lapsos) ? 1 : 2) : 0);
  }
  const r = S.resp[q.d] || (S.resp[q.d]={c:0,t:0});
  r.t++; if(acertou) r.c++;
  if(acertou){
    const i = S.erros.findIndex(e=>e.qid===q.id);
    if(i>=0){ S.erros.splice(i,1); xp(25); if(S.erros.length===0) ganhar('caderno'); }
  } else if(!S.erros.some(e=>e.qid===q.id)){
    S.erros.push({qid:q.id,quando:hoje()});
  }
  if(S.respondidas>=100) ganhar('cem');
  if(S.respondidas>=500) ganhar('maratona');
  if(Object.keys(S.resp).length>=DISC.length) ganhar('todas');
  salvar();
}

/* ---------- motor de recomendação ---------- */
function recomendar(){
  return DISC.map(d=>{
    const r = S.resp[d]||{c:0,t:0};
    const taxa = r.t ? r.c/r.t : null;
    const base = taxa===null ? .5 : taxa;
    /* impacto = quantas questões da prova você ganharia corrigindo esta disciplina.
       Disciplina nunca treinada recebe um empurrão, porque é risco desconhecido. */
    const impacto = PESO[d]*(1-base)*(taxa===null?1.2:1);
    return {d,taxa,peso:PESO[d],amostra:r.t,impacto};
  }).sort((a,b)=>b.impacto-a.impacto);
}
function projecao(){
  let s=0;
  DISC.forEach(d=>{ const r=S.resp[d]||{c:0,t:0}; s += PESO[d]*(r.t? r.c/r.t : .5); });
  return s;
}
function taxaGeral(){
  let c=0,t=0; Object.values(S.resp).forEach(r=>{c+=r.c;t+=r.t;});
  return t? c/t : null;
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
let VIEW='painel';
function ir(v){
  VIEW=v;
  document.querySelectorAll('.item').forEach(b=>{
    if(b.dataset.v===v) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  window.scrollTo(0,0);
  render();
}
document.querySelectorAll('.item').forEach(b=> b.onclick=()=>ir(b.dataset.v));

/* ---------- acesso ----------
   IMPORTANTE, leia antes de vender: isto é uma PORTA, não um cofre.
   A página é entregue inteira ao navegador do aluno; quem souber abrir o
   inspetor contorna qualquer verificação feita aqui, e um comprador pode
   repassar a senha a outros. A senha fica como hash para não aparecer
   legível no código, e só isso.
   O controle de verdade de quem comprou tem que vir da área de membros da
   plataforma de checkout (Kiwify, Hotmart) ou de um servidor com sessão.
   A lista de alunos NÃO fica neste arquivo: mora em usuarios.json, que o
   build.py injeta aqui na hora de gerar dist/index.html. usuarios.json está
   fora do controle de versão, para que a lista não circule junto com o código.
   Para acrescentar alguém: node gerar-hash.js <usuario> <senha> */
const SAL = 'prepoab.2026.';
const USUARIOS = /*__USUARIOS__*/[];

/* SHA-256 em JavaScript puro: funciona também em file://, onde crypto.subtle
   nem sempre está disponível. */
function sha256(texto){
  function rrot(v,a){ return (v>>>a)|(v<<(32-a)); }
  const bytes = unescape(encodeURIComponent(texto));
  const h=[], k=[]; let primos=0, composto={};
  for(let c=2; primos<64; c++){
    if(!composto[c]){
      for(let i=0;i<313;i+=c) composto[i]=c;
      h[primos]=(Math.pow(c,.5)*4294967296)|0;
      k[primos++]=(Math.pow(c,1/3)*4294967296)|0;
    }
  }
  const H=h.slice(0,8), bits=bytes.length*8, w=[];
  let msg = bytes + '\x80';
  while(msg.length%64 !== 56) msg += '\x00';
  for(let i=0;i<msg.length;i++) w[i>>2]=(w[i>>2]||0)|(msg.charCodeAt(i)<<(24-(i%4)*8));
  w[w.length]=Math.floor(bits/4294967296); w[w.length]=bits;
  for(let j=0;j<w.length;j+=16){
    const a=H.slice(0), s=w.slice(j,j+16);
    for(let i=16;i<64;i++){
      const s0=rrot(s[i-15],7)^rrot(s[i-15],18)^(s[i-15]>>>3);
      const s1=rrot(s[i-2],17)^rrot(s[i-2],19)^(s[i-2]>>>10);
      s[i]=(s[i-16]+s0+s[i-7]+s1)|0;
    }
    for(let i=0;i<64;i++){
      const S1=rrot(a[4],6)^rrot(a[4],11)^rrot(a[4],25);
      const ch=(a[4]&a[5])^(~a[4]&a[6]);
      const t1=(a[7]+S1+ch+k[i]+s[i])|0;
      const S0=rrot(a[0],2)^rrot(a[0],13)^rrot(a[0],22);
      const maj=(a[0]&a[1])^(a[0]&a[2])^(a[1]&a[2]);
      const t2=(S0+maj)|0;
      a.pop(); a.unshift((t1+t2)|0); a[4]=(a[4]+t1)|0;
    }
    for(let i=0;i<8;i++) H[i]=(H[i]+a[i])|0;
  }
  return H.map(x=>('00000000'+(x>>>0).toString(16)).slice(-8)).join('');
}

function abrirApp(){
  $('#vendas').classList.add('oculto');
  $('#login').classList.add('oculto');
  $('#app').classList.remove('oculto');
  ir('painel');
}
function mostrarLogin(){
  $('#vendas').classList.add('oculto');
  $('#login').classList.remove('oculto');
  setTimeout(()=>{ const c=$('#lUser'); if(c) c.focus(); },50);
}
function sair(){
  S.entrou=false; S.usuario=''; salvar();
  $('#app').classList.add('oculto');
  $('#login').classList.add('oculto');
  $('#vendas').classList.remove('oculto');
  window.scrollTo(0,0);
}
$('#btEntrar').onclick=mostrarLogin;
$('#lVoltar').onclick=()=>{ $('#login').classList.add('oculto'); $('#vendas').classList.remove('oculto'); };
$('#formLogin').onsubmit=e=>{
  e.preventDefault();
  const u=$('#lUser').value.trim().toLowerCase(), s=$('#lSenha').value;
  const achou = USUARIOS.find(x=>x.u===u && x.h===sha256(SAL+u+':'+s));
  if(!achou){ $('#lErro').classList.remove('oculto'); $('#lSenha').value=''; $('#lSenha').focus(); return; }
  $('#lErro').classList.add('oculto');
  S.entrou=true; S.usuario=u; if(!S.aluno) S.aluno=u.split('.')[0].replace(/^./,c=>c.toUpperCase());
  salvar(); abrirApp();
};
$('#btComprar1').onclick=$('#btComprar2').onclick=comprar;
function comprar(){
  /* >>> SUBSTITUA pela URL do seu checkout (Hotmart, Kiwify, Mercado Pago, Stripe). <<<
     Enquanto estiver vazia, o botão abre a plataforma em modo de demonstração. */
  const CHECKOUT = '';
  if(CHECKOUT){ window.location.href=CHECKOUT; return; }
  /* Sem checkout configurado, o botão leva à tela de entrada: quem já tem
     acesso entra, e quem não tem vê onde o acesso acontece. */
  mostrarLogin();
}

/* ============================================================
   RENDER
   ============================================================ */
function barraTopo(){
  const n = nivel(S.xp);
  const prog = n.prox ? (S.xp-n.base)/(n.prox-n.base) : 1;
  return `<div class="barratopo">
    <div class="nivelbox"><strong>${esc(n.nome)}</strong><em>${S.xp.toLocaleString('pt-BR')} XP</em></div>
    <div class="trilho" role="progressbar" aria-valuenow="${Math.round(prog*100)}" aria-valuemin="0" aria-valuemax="100"
      title="${n.prox? (n.prox-S.xp)+' XP para '+n.proxNome : 'Nível máximo'}"><div class="traco" style="width:${Math.min(100,prog*100)}%"></div></div>
    <div class="ofensiva">Ofensiva <b>${S.streak}</b> ${S.streak===1?'dia':'dias'}</div>
  </div>`;
}
function atualizarNav(){
  const p=$('#pinErros');
  if(S.erros.length){ p.textContent=S.erros.length; p.classList.remove('oculto'); } else p.classList.add('oculto');
  const ps=$('#pinSessao'), nv=vencidas().length;
  if(ps){ if(nv){ ps.textContent=nv; ps.classList.remove('oculto'); } else ps.classList.add('oculto'); }
  const n=nivel(S.xp);
  $('#navRod').innerHTML = `${esc(n.nome)}<br>${S.respondidas} ${S.respondidas===1?'questão respondida':'questões respondidas'}`;
}
function render(){
  atualizarNav();
  const t=$('#tela');
  const f = ({painel:vPainel,simulado:vSimulado,questoes:vQuestoes,erros:vErros,flashcards:vFlashcards,
              resumos:vResumos,trilhaoab:vTrilhaOAB,trilhagrad:vTrilhaGrad,atualizacoes:vAtualizacoes,
              provas:vProvas,plano:vPlano,sessao:vSessao,medalhas:vMedalhas,ajustes:vAjustes})[VIEW] || vPainel;
  t.innerHTML = barraTopo() + f();
  if(POS_RENDER){ const g=POS_RENDER; POS_RENDER=null; g(); }
}
let POS_RENDER=null;

/* ============================================================
   PAINEL
   ============================================================ */
function vPainel(){
  const rec = recomendar();
  const proj = projecao();
  const tg = taxaGeral();
  const ult = S.hist[S.hist.length-1];
  const diasProva = S.prova ? Math.ceil((new Date(S.prova)-new Date())/864e5) : null;

  /* O aluno abre isto cansado, muitas vezes no celular. Primeiro vem
     UMA coisa para fazer agora; os números ficam embaixo, para quem
     quiser olhar. */
  const m = montarSessao();
  const minutos = Math.max(2, Math.round(m.ids.length * 1.9));
  const nome = S.aluno ? S.aluno.split(' ')[0] : '';

  let h = `<div class="convite">
    <div class="conviteTexto">
      <h2>${nome ? esc(nome)+', sua sessão de hoje' : 'Sua sessão de hoje'}</h2>
      ${m.ids.length
        ? `<p>${
            m.revisao && m.novas ? `<b>${m.revisao}</b> ${m.revisao===1?'para revisar':'para revisar'} e <b>${m.novas}</b> ${m.novas===1?'nova':'novas'}`
            : m.revisao ? `<b>${m.revisao}</b> ${m.revisao===1?'questão para revisar':'questões para revisar'}`
            : `<b>${m.novas}</b> ${m.novas===1?'questão nova':'questões novas'}`
          } · cerca de <b>${minutos} min</b></p>`
        : `<p>Você já revisou tudo o que estava no prazo. Amanhã a revisão espaçada traz os próximos itens de volta.</p>`}
    </div>
    ${m.ids.length
      ? `<button class="btn grande" id="btSessao">Começar</button>`
      : `<button class="btn s grande" data-ir="simulado">Fazer um simulado</button>`}
  </div>`;

  if(S.respondidas === 0){
    h += `<div class="aviso"><b>Como isto funciona.</b> Você responde, a plataforma mede e devolve o que estudar. Cada questão que você acerta volta mais pra frente; cada uma que erra volta amanhã. Não há vidas nem punição por errar — errar é onde a nota sobe.</div>`;
  }

  h += `<dl class="numeros">
    <div class="num"><dt>Projeção de nota</dt><dd>${Math.round(proj)}<small> / 80</small></dd></div>
    <div class="num"><dt>Acerto geral</dt><dd>${tg===null?'—':pct(tg)}</dd></div>
    <div class="num"><dt>Já vistas</dt><dd>${Object.keys(oSrs()).length}<small> / ${BANCO.length}</small></dd></div>
    <div class="num"><dt>Vencendo hoje</dt><dd>${vencidas().length}</dd></div>
    ${diasProva!==null?`<div class="num"><dt>Dias até a prova</dt><dd>${diasProva>0?diasProva:'—'}</dd></div>`:''}
  </dl>`;

  /* a projeção sozinha é um veredito; vem acompanhada do que fazer */
  if(S.respondidas > 0){
    const falta = 40 - proj;
    h += `<p class="subtexto" style="margin:-1.4rem 0 2.2rem">${
      falta > 0
        ? `A projeção aplica o seu acerto em cada disciplina ao peso dela na prova. Faltam cerca de <b>${Math.ceil(falta)}</b> ${Math.ceil(falta)===1?'ponto':'pontos'} para a nota de corte — e eles estão concentrados nas disciplinas listadas abaixo, não espalhados por tudo.`
        : `A projeção aplica o seu acerto em cada disciplina ao peso dela na prova, e hoje ela está <b>acima</b> da nota de corte. O risco agora é perder o que já ganhou: siga revisando o que vence.`}</p>`;
  }

  h += `<section class="secao"><h2>Estude isto agora</h2>
    <p class="subtexto">Ordenado por impacto na nota, não por tamanho do erro: o cálculo é o peso da disciplina na prova multiplicado pela sua taxa de erro. Oito questões de Ética pesam quatro vezes mais que duas de Eleitoral.</p>
    <div class="rec">`;
  rec.slice(0,5).forEach((r,i)=>{
    const tema = TEMAS[r.d] ? TEMAS[r.d][0] : '';
    h += `<div class="recitem">
      <span class="ord">${i+1}</span>
      <div class="corpo"><b>${esc(r.d)}</b><span>${r.amostra? 'Comece por: '+esc(tema) : 'Nunca treinada — comece por: '+esc(tema)}</span></div>
      <div class="lado">
        <span class="taxa ${classeTaxa(r.taxa)}">${r.taxa===null?'—':pct(r.taxa)}</span>
        <span class="peso">${r.peso} ${r.peso===1?'questão':'questões'} na prova${r.amostra?' · '+r.amostra+' resp.':''}</span>
      </div>
      <button class="btn mini" data-treinar="${esc(r.d)}">Treinar</button>
    </div>`;
  });
  h += `</div></section>`;

  if(S.hist.length>=2){
    h += `<section class="secao"><h2>Como suas provas evoluíram</h2>
      <p class="subtexto">Cada ponto é um simulado. A linha tracejada é a nota de corte, 50% da prova.</p>
      ${grafico()}${tabelaComparativa()}</section>`;
  }

  h += `<section class="secao"><h2>Atalhos</h2><div style="display:flex;gap:.6rem;flex-wrap:wrap">
    <button class="btn" data-ir="simulado">Fazer um simulado</button>
    <button class="btn s" data-ir="questoes">Treinar questões soltas</button>
    ${S.erros.length?`<button class="btn s" data-ir="erros">Revisar ${S.erros.length} ${S.erros.length===1?'erro':'erros'}</button>`:''}
    <button class="btn s" data-ir="flashcards">Flashcards</button>
  </div></section>`;

  POS_RENDER=()=>{
    document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir));
    document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{ FILTRO.d=b.dataset.treinar; FILTRO.n=''; ir('questoes'); });
    const bs=$('#btSessao'); if(bs) bs.onclick=()=>{ SESSAO=null; ir('sessao'); };
  };
  return h;
}

/* gráfico de evolução, SVG inline */
function grafico(){
  const hs = S.hist.slice(-10);
  const W=620,H=190,ml=34,mr=12,mt=14,mb=26;
  const iw=W-ml-mr, ih=H-mt-mb;
  const px = i=> hs.length===1? ml+iw/2 : ml + (i/(hs.length-1))*iw;
  const py = v=> mt + ih - (v*ih);
  const pts = hs.map((s,i)=>[px(i),py(s.acertos/s.total)]);
  const linha = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  let g = `<div class="grafico"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução das notas dos simulados">`;
  [0,.25,.5,.75,1].forEach(v=>{
    g += `<line x1="${ml}" y1="${py(v)}" x2="${W-mr}" y2="${py(v)}" stroke="#D9D3C7" stroke-width="1"${v===.5?' stroke-dasharray="4 3" stroke="#9A1C2E"':''}/>`;
    g += `<text x="${ml-7}" y="${py(v)+4}" text-anchor="end" font-size="10" fill="#2E4A62" font-family="IBM Plex Sans,sans-serif">${Math.round(v*100)}%</text>`;
  });
  g += `<path d="${linha}" fill="none" stroke="#2E4A62" stroke-width="2" stroke-linejoin="round"/>`;
  pts.forEach((p,i)=>{
    const s=hs[i], ok=s.acertos/s.total>=.5;
    g += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="${ok?'#2F6B4F':'#9A1C2E'}"/>`;
    g += `<text x="${p[0].toFixed(1)}" y="${H-9}" text-anchor="middle" font-size="9.5" fill="#2E4A62" font-family="IBM Plex Sans,sans-serif">${dataBR(s.data).slice(0,5)}</text>`;
  });
  return g+`</svg></div>`;
}

/* comparativo entre os últimos simulados */
function tabelaComparativa(){
  const hs = S.hist.slice(-6).reverse();
  let h = `<div class="tabwrap" style="margin-top:1.2rem"><table><thead><tr>
    <th>Simulado</th><th>Tipo</th><th class="n">Acertos</th><th class="n">Aproveitamento</th><th class="n">Variação</th></tr></thead><tbody>`;
  hs.forEach((s,i)=>{
    const ant = hs[i+1];
    const d = ant ? (s.acertos/s.total)-(ant.acertos/ant.total) : null;
    h += `<tr><td>${dataBR(s.data)}</td><td>${esc(s.rotulo)}</td>
      <td class="n">${s.acertos}/${s.total}</td><td class="n">${pct(s.acertos/s.total)}</td>
      <td class="n">${d===null?'—':`<span class="delta ${d>=0?'sobe':'cai'}">${d>=0?'+':''}${Math.round(d*100)} p.p.</span>`}</td></tr>`;
  });
  h += `</tbody></table></div>`;

  /* variação por disciplina entre os dois últimos */
  const a=S.hist[S.hist.length-2], b=S.hist[S.hist.length-1];
  if(a&&b){
    const linhas = DISC.map(d=>{
      const ra=a.porDisc[d], rb=b.porDisc[d];
      if(!ra||!rb||!ra.t||!rb.t) return null;
      return {d,ta:ra.c/ra.t,tb:rb.c/rb.t};
    }).filter(Boolean).sort((x,y)=>(x.tb-x.ta)-(y.tb-y.ta));
    if(linhas.length){
      const sobe = linhas.slice(-3).reverse().filter(l=>l.tb>l.ta);
      const cai  = linhas.slice(0,3).filter(l=>l.tb<l.ta);
      h += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:1.2rem;margin-top:1.3rem">`;
      h += `<div><h3 style="font-size:.95rem;margin-bottom:.5rem">Melhorou desde a prova anterior</h3>`;
      h += sobe.length? `<ul style="margin:0;padding-left:1.1rem;font-size:.9rem">${sobe.map(l=>`<li>${esc(l.d)} — de ${pct(l.ta)} para <b>${pct(l.tb)}</b></li>`).join('')}</ul>`:`<p style="font-size:.9rem;color:var(--toga)">Nenhuma disciplina subiu.</p>`;
      h += `</div><div><h3 style="font-size:.95rem;margin-bottom:.5rem">Caiu desde a prova anterior</h3>`;
      h += cai.length? `<ul style="margin:0;padding-left:1.1rem;font-size:.9rem">${cai.map(l=>`<li>${esc(l.d)} — de ${pct(l.ta)} para <b>${pct(l.tb)}</b></li>`).join('')}</ul>`:`<p style="font-size:.9rem;color:var(--toga)">Nenhuma disciplina caiu.</p>`;
      h += `</div></div>`;
    }
  }
  return h;
}

/* ============================================================
   SIMULADO
   ============================================================ */
let SIM=null;
function montarProva(tipo,disc){
  if(tipo==='completo'){
    let out=[];
    TRILHA_OAB.forEach(x=>{
      const pool = embaralhar(BANCO.filter(q=>q.d===x.d));
      out = out.concat(pool.slice(0,x.peso));
    });
    return out; /* mantém a ordem das disciplinas, como na prova real */
  }
  if(tipo==='disciplina'){ return embaralhar(BANCO.filter(q=>q.d===disc)).slice(0,10); }
  return embaralhar(BANCO).slice(0,20);
}
function vSimulado(){
  if(SIM && SIM.fase==='fazendo') return simFazendo();
  if(SIM && SIM.fase==='feito')   return simResultado();

  let h = `<div class="cabecalho"><h2>Simulado</h2>
    <p>O simulado completo reproduz a prova: 80 questões, cinco horas, na ordem e no peso de cada disciplina. A nota de corte são 40 acertos.</p></div>`;
  h += `<div class="numeros" style="margin-bottom:2rem">
    <div class="num"><dt>Completo</dt><dd>80<small> questões · 5h</small></dd></div>
    <div class="num"><dt>Rápido</dt><dd>20<small> questões · 1h</small></dd></div>
    <div class="num"><dt>Por disciplina</dt><dd>10<small> questões · 25min</small></dd></div>
  </div>`;
  h += `<section class="secao"><div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
    <button class="btn g" data-sim="completo">Começar o completo</button>
    <button class="btn s" data-sim="rapido">Simulado rápido</button>
  </div></section>`;
  h += `<section class="secao"><h2>Treinar uma disciplina sob cronômetro</h2>
    <div class="filtros"><select id="simDisc">${DISC.map(d=>`<option>${esc(d)}</option>`).join('')}</select>
    <button class="btn s" data-sim="disciplina">Começar</button></div></section>`;

  if(S.hist.length){
    h += `<section class="secao"><h2>Suas provas até aqui</h2>${S.hist.length>=2?grafico():''}${tabelaComparativa()}</section>`;
  }
  POS_RENDER=()=>{ document.querySelectorAll('[data-sim]').forEach(b=>b.onclick=()=>iniciar(b.dataset.sim)); };
  return h;
}
function iniciar(tipo){
  const disc = tipo==='disciplina' ? ($('#simDisc')?$('#simDisc').value:DISC[0]) : null;
  const qs = montarProva(tipo,disc);
  if(!qs.length){ alert('Não há questões suficientes nesta disciplina.'); return; }
  const min = tipo==='completo'?300:(tipo==='rapido'?60:25);
  SIM={fase:'fazendo',tipo,disc,qs,resp:new Array(qs.length).fill(null),marcadas:[],
       i:0,fim:Date.now()+min*60000,
       rotulo: tipo==='completo'?'Completo (80)':(tipo==='rapido'?'Rápido (20)':disc)};
  render(); tiquetaque();
}
let TIMER=null;
function pintarRelogio(){
  if(!SIM||SIM.fase!=='fazendo') return false;
  const r=$('#relogio'); if(!r) return true;
  const ms = SIM.fim-Date.now();
  if(ms<=0){ encerrar(); return false; }
  const t=Math.floor(ms/1000), hh=Math.floor(t/3600), mm=Math.floor(t%3600/60), ss=t%60;
  r.textContent = (hh?hh+':':'')+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');
  if(ms<5*60000) r.classList.add('alerta');
  return true;
}
function tiquetaque(){
  clearInterval(TIMER);
  if(!pintarRelogio()) return;           /* mostra o tempo já no primeiro quadro */
  TIMER=setInterval(()=>{ if(!pintarRelogio()) clearInterval(TIMER); },1000);
}
function simFazendo(){
  const q=SIM.qs[SIM.i], feitas=SIM.resp.filter(x=>x!==null).length;
  let h = `<div class="simtopo">
    <div><div class="relogio" id="relogio">--:--</div><div class="simmeta">tempo restante</div></div>
    <div><div class="simmeta">Questão <b>${SIM.i+1}</b> de ${SIM.qs.length} · ${feitas} respondidas</div>
      <div style="display:flex;gap:.4rem;margin-top:.45rem;flex-wrap:wrap">
        <button class="btn s mini" id="btMarcar">${SIM.marcadas.includes(SIM.i)?'Desmarcar':'Marcar para revisar'}</button>
        <button class="btn mini" id="btEncerrar">Entregar a prova</button>
      </div></div></div>`;

  h += `<div class="questao"><div class="qtopo"><span class="aba n">${esc(q.d)}</span>
      <span class="marginal">${esc(q.t)}</span></div>
    <div class="qcorpo"><p class="enunciado">${q.e}</p><ul class="alts">`;
  q.a.forEach((a,i)=>{
    h += `<li><button class="alt ${SIM.resp[SIM.i]===i?'sel':''}" data-alt="${i}">
      <span class="letra">${LETRA[i]}</span><span>${a}</span></button></li>`;
  });
  h += `</ul>
    <div style="display:flex;gap:.5rem;margin-top:1.4rem;flex-wrap:wrap">
      <button class="btn s" id="btAnt" ${SIM.i===0?'disabled':''}>Anterior</button>
      <button class="btn" id="btProx" ${SIM.i===SIM.qs.length-1?'disabled':''}>Próxima</button>
    </div></div></div>`;

  h += `<div class="gabarito">`;
  SIM.qs.forEach((_,i)=>{
    const c = (SIM.resp[i]!==null?'feita ':'')+(SIM.marcadas.includes(i)?'marcada ':'')+(i===SIM.i?'atual':'');
    h += `<button class="gq ${c}" data-pula="${i}" aria-label="Ir para a questão ${i+1}">${i+1}</button>`;
  });
  h += `</div>`;

  POS_RENDER=()=>{
    document.querySelectorAll('[data-alt]').forEach(b=>b.onclick=()=>{
      SIM.resp[SIM.i]=+b.dataset.alt;
      if(SIM.i<SIM.qs.length-1){ SIM.i++; } render(); tiquetaque();
    });
    $('#btAnt').onclick=()=>{ if(SIM.i>0){SIM.i--;render();tiquetaque();} };
    $('#btProx').onclick=()=>{ if(SIM.i<SIM.qs.length-1){SIM.i++;render();tiquetaque();} };
    document.querySelectorAll('[data-pula]').forEach(b=>b.onclick=()=>{ SIM.i=+b.dataset.pula; render(); tiquetaque(); });
    $('#btMarcar').onclick=()=>{
      const k=SIM.marcadas.indexOf(SIM.i);
      if(k>=0) SIM.marcadas.splice(k,1); else SIM.marcadas.push(SIM.i);
      render(); tiquetaque();
    };
    $('#btEncerrar').onclick=()=>{
      const faltam=SIM.resp.filter(x=>x===null).length;
      if(faltam && !confirm(faltam+(faltam===1?' questão ainda está':' questões ainda estão')+' sem resposta. Entregar assim?')) return;
      encerrar();
    };
    tiquetaque();
  };
  return h;
}
function encerrar(){
  clearInterval(TIMER);
  const porDisc={}; let acertos=0; const erradas=[];
  SIM.qs.forEach((q,i)=>{
    const ok = SIM.resp[i]===q.c;
    if(ok) acertos++; else erradas.push(q);
    const r = porDisc[q.d]||(porDisc[q.d]={c:0,t:0});
    r.t++; if(ok) r.c++;
    registrar(q,ok);
    xp(ok?15:2);
  });
  const anterior = S.hist[S.hist.length-1];
  const reg = {data:new Date().toISOString(),tipo:SIM.tipo,rotulo:SIM.rotulo,
               acertos,total:SIM.qs.length,porDisc};
  S.hist.push(reg); salvar();

  const novas=[];
  if(SIM.tipo==='completo'){
    if(ganhar('primeira')) novas.push('primeira');
    if(acertos>=40 && ganhar('corte')) novas.push('corte');
    if(acertos>=55 && ganhar('folgado')) novas.push('folgado');
  }
  const et=porDisc['Ética e Estatuto da OAB'];
  if(et && et.t>=4 && et.c===et.t && ganhar('etica')) novas.push('etica');
  if(S.hist.length>=3){
    const [a,b,c]=S.hist.slice(-3);
    if(b.acertos/b.total>a.acertos/a.total && c.acertos/c.total>b.acertos/b.total && ganhar('virada')) novas.push('virada');
  }
  SIM.fase='feito'; SIM.resultado=reg; SIM.anterior=anterior; SIM.novas=novas; SIM.erradas=erradas;
  render();
}
function simResultado(){
  const r=SIM.resultado, taxa=r.acertos/r.total, completo=r.tipo==='completo';
  const ganhoXP = SIM.qs.reduce((s,q,i)=>s+(SIM.resp[i]===q.c?15:2),0);

  let h = `<div class="cabecalho"><h2>Resultado — ${esc(r.rotulo)}</h2></div>`;
  h += `<div class="notao"><span class="n">${r.acertos}</span><span class="de">de ${r.total}</span>
    <span class="selo ${taxa>=.5?'ok':'no'}">${completo?(r.acertos>=40?'Acima da nota de corte':'Abaixo da nota de corte'):(taxa>=.5?'Aproveitamento suficiente':'Aproveitamento baixo')}</span></div>`;
  h += `<p class="subtexto">Aproveitamento de ${pct(taxa)}.${completo?' A aprovação na primeira fase exige 40 acertos.':' Em um simulado curto, trate o número como amostra, não como nota.'}</p>`;
  h += `<div class="ganhos"><span>XP ganho <b>+${ganhoXP}</b></span>
    <span>Nível <b>${esc(nivel(S.xp).nome)}</b></span>
    <span>Ofensiva <b>${S.streak}</b> ${S.streak===1?'dia':'dias'}</span>
    <span>Novos erros no caderno <b>${SIM.erradas.length}</b></span></div>`;

  if(SIM.anterior){
    const d = taxa-(SIM.anterior.acertos/SIM.anterior.total);
    h += `<p class="subtexto" style="margin-top:1.2rem">Comparado ao simulado de ${dataBR(SIM.anterior.data)}: <b class="delta ${d>=0?'sobe':'cai'}">${d>=0?'+':''}${Math.round(d*100)} pontos percentuais</b>.</p>`;
  }

  if(SIM.novas.length){
    h += `<section class="secao"><h2>Conquistas desbloqueadas</h2><div class="medalhas">`;
    SIM.novas.forEach(id=>{ const m=MEDALHAS.find(x=>x.id===id);
      h += `<div class="med tem"><b>${esc(m.n)}</b><span>${esc(m.d)}</span></div>`; });
    h += `</div></section>`;
  }

  h += `<section class="secao"><h2>Desempenho por disciplina</h2>
    <p class="subtexto">A coluna de impacto estima quantas questões você deixou na mesa nesta disciplina, considerando o peso dela na prova real.</p>
    <div class="tabwrap"><table><thead><tr><th>Disciplina</th><th class="n">Acertos</th><th class="n">Aproveitamento</th><th class="n">Peso na prova</th><th class="n">Impacto</th></tr></thead><tbody>`;
  Object.keys(r.porDisc).sort((a,b)=>{
    const ia=PESO[a]*(1-r.porDisc[a].c/r.porDisc[a].t), ib=PESO[b]*(1-r.porDisc[b].c/r.porDisc[b].t);
    return ib-ia;
  }).forEach(d=>{
    const x=r.porDisc[d], t=x.c/x.t, imp=PESO[d]*(1-t);
    h += `<tr><td>${esc(d)}</td><td class="n">${x.c}/${x.t}</td>
      <td class="n"><span class="taxa ${classeTaxa(t)}">${pct(t)}</span></td>
      <td class="n">${PESO[d]}</td><td class="n">${imp>=.5?'−'+imp.toFixed(1):'—'}</td></tr>`;
  });
  h += `</tbody></table></div></section>`;

  const rec=recomendar().slice(0,3);
  h += `<section class="secao"><h2>O que estudar antes do próximo simulado</h2>
    <p class="subtexto">Com base em tudo que você respondeu até agora, não só nesta prova.</p><div class="rec">`;
  rec.forEach((x,i)=>{
    h += `<div class="recitem"><span class="ord">${i+1}</span>
      <div class="corpo"><b>${esc(x.d)}</b><span>${esc((TEMAS[x.d]||[]).slice(0,3).join(' · '))}</span></div>
      <div class="lado"><span class="taxa ${classeTaxa(x.taxa)}">${x.taxa===null?'—':pct(x.taxa)}</span>
      <span class="peso">${x.peso} na prova</span></div>
      <button class="btn mini" data-treinar="${esc(x.d)}">Treinar</button></div>`;
  });
  h += `</div></section>`;

  if(SIM.erradas.length){
    h += `<section class="secao"><h2>Revisar os erros desta prova</h2>
      <p class="subtexto">${SIM.erradas.length} ${SIM.erradas.length===1?'questão foi':'questões foram'} para o caderno de erros. Elas voltam até você acertá-las.</p>
      <button class="btn" data-ir="erros">Abrir o caderno de erros</button></section>`;
  }
  h += `<div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn s" id="btNovo">Fazer outro simulado</button>
    <button class="btn s" data-ir="painel">Voltar ao painel</button></div>`;

  POS_RENDER=()=>{
    document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{SIM=null;ir(b.dataset.ir);});
    document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{SIM=null;FILTRO.d=b.dataset.treinar;FILTRO.n='';ir('questoes');});
    $('#btNovo').onclick=()=>{ SIM=null; render(); };
  };
  return h;
}

/* ============================================================
   QUESTÕES SOLTAS
   ============================================================ */
const FILTRO={d:'',n:'',t:''};
let TREINO=null;
function poolFiltrado(){
  return BANCO.filter(q=>(!FILTRO.d||q.d===FILTRO.d)&&(!FILTRO.n||q.n===FILTRO.n)&&(!FILTRO.t||q.t===FILTRO.t));
}
function vQuestoes(){
  const pool=poolFiltrado();
  const temas=[...new Set((FILTRO.d?BANCO.filter(q=>q.d===FILTRO.d):BANCO).map(q=>q.t))].sort();
  let h = `<div class="cabecalho"><h2>Questões</h2>
    <p>Treino livre, sem cronômetro, com o comentário logo depois de cada resposta. Errar aqui é o que faz a nota subir — cada erro entra no caderno de revisão.</p></div>`;
  h += `<div class="filtros">
    <select id="fD"><option value="">Todas as disciplinas</option>${DISC.map(d=>`<option ${FILTRO.d===d?'selected':''}>${esc(d)}</option>`).join('')}</select>
    <select id="fT"><option value="">Todos os temas</option>${temas.map(t=>`<option ${FILTRO.t===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
    <select id="fN"><option value="">Qualquer nível</option>
      <option value="facil" ${FILTRO.n==='facil'?'selected':''}>Fácil</option>
      <option value="medio" ${FILTRO.n==='medio'?'selected':''}>Médio</option>
      <option value="dificil" ${FILTRO.n==='dificil'?'selected':''}>Difícil</option></select>
    <span class="simmeta">${pool.length} ${pool.length===1?'questão':'questões'}</span></div>`;

  if(!pool.length){ h += `<div class="vazio"><b>Nenhuma questão com esses filtros</b>Afrouxe um dos critérios.</div>`; }
  else {
    if(!TREINO || !pool.some(q=>q.id===TREINO.q.id)) TREINO={q:embaralhar(pool)[0],resp:null};
    h += cartaoQuestao(TREINO.q,TREINO.resp,'treino');
  }
  POS_RENDER=()=>{
    $('#fD').onchange=e=>{FILTRO.d=e.target.value;FILTRO.t='';TREINO=null;render();};
    $('#fT').onchange=e=>{FILTRO.t=e.target.value;TREINO=null;render();};
    $('#fN').onchange=e=>{FILTRO.n=e.target.value;TREINO=null;render();};
    ligarCartao('treino');
  };
  return h;
}

/* cartão de questão com devolutiva — usado no treino, no caderno e no herói */
function cartaoQuestao(q,resp,modo){
  const respondida = resp!==null && resp!==undefined;
  const acertou = respondida && resp===q.c;
  let h = `<div class="questao" data-modo="${modo}"><div class="qtopo">
    <span class="aba ${respondida?(acertou?'v':''):'n'}">${esc(q.d)}</span>
    <span class="marginal">${esc(q.t)} · ${q.n==='facil'?'fácil':q.n==='medio'?'médio':'difícil'}</span></div>
    <div class="qcorpo"><p class="enunciado">${q.e}</p><ul class="alts">`;
  q.a.forEach((a,i)=>{
    let c='';
    if(respondida){ if(i===q.c) c='certa'; else if(i===resp) c='errada'; }
    h += `<li><button class="alt ${c}" data-alt="${i}" ${respondida?'disabled':''}>
      <span class="letra">${LETRA[i]}</span><span>${a}</span></button></li>`;
  });
  h += `</ul>`;

  if(respondida){
    h += `<div class="devolutiva">
      <div class="veredito ${acertou?'ok':'no'}">${acertou?'Correta':'Resposta correta: '+LETRA[q.c]}</div>
      <div class="comentario">${q.co}</div>
      <div class="fundamento"><b>Fundamento:</b> ${esc(q.f)}</div>`;
    if(!acertou && modo!=='heroi') h += tutorBloco(q,resp);
    if(modo!=='heroi'){
      h += `<div style="display:flex;gap:.5rem;margin-top:1.4rem;flex-wrap:wrap">
        <button class="btn" data-prox>Próxima questão</button>
        ${!acertou?`<button class="btn s" data-mesmotema="${esc(q.t)}">Mais questões de ${esc(q.t)}</button>`:''}</div>`;
    } else {
      h += `<div style="margin-top:1.5rem;padding-top:1.3rem;border-top:1px solid var(--linha)">
        <p style="margin:0 0 1rem;font-size:.95rem">Essa é uma de 141. As outras 140 vêm com o mesmo comentário, o mesmo fundamento e um diagnóstico que te diz em qual disciplina você está perdendo pontos.</p>
        <button class="btn g" id="btComprar3">Começar a estudar</button></div>`;
    }
    h += `</div>`;
  }
  h += `</div></div>`;
  return h;
}
function ligarCartao(modo){
  const raiz = document.querySelector(`.questao[data-modo="${modo}"]`);
  if(!raiz) return;
  raiz.querySelectorAll('[data-alt]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.alt;
    if(modo==='heroi'){ HEROI.resp=i; desenharHeroi(); return; }
    if(modo==='treino'){ TREINO.resp=i; registrar(TREINO.q,i===TREINO.q.c); xp(i===TREINO.q.c?10:2); render(); return; }
    if(modo==='erro'){ REVISAO.resp=i; registrar(REVISAO.q,i===REVISAO.q.c); xp(i===REVISAO.q.c?0:2); render(); return; }
    if(modo==='sessao'){
      const q = BANCO[SESSAO.ids[SESSAO.i]];
      const acertou = i===q.c;
      SESSAO.resp = i;
      if(acertou) SESSAO.certas++;
      /* a nota sai do histórico do próprio item: nada de perguntar
         ao aluno se foi fácil — é fricção para quem está cansado */
      const r = oSrs()[q.id];
      agendar(q.id, acertou ? ((r && r.lapsos) ? 1 : 2) : 0);
      registrar(q, acertou);
      const ganho = acertou ? ((r && r.lapsos) ? 25 : 12) : 2;
      SESSAO.xpGanho += ganho; xp(ganho);
      render(); return;
    }
  });
  const prox = raiz.querySelector('[data-prox]');
  if(prox) prox.onclick=()=>{
    if(modo==='treino'){TREINO=null;}
    if(modo==='erro'){REVISAO=null;}
    if(modo==='sessao'){ SESSAO.i++; SESSAO.resp=null; }
    render();
  };
  const mt = raiz.querySelector('[data-mesmotema]');
  if(mt) mt.onclick=()=>{ FILTRO.t=mt.dataset.mesmotema; FILTRO.d=''; FILTRO.n=''; TREINO=null; REVISAO=null; ir('questoes'); };
  const c3 = raiz.querySelector('#btComprar3');
  if(c3) c3.onclick=comprar;
  ligarTutor(raiz);
}

/* ============================================================
   TUTOR — camada determinística + assistente
   ============================================================ */
function tutorBloco(q,resp){
  const res = RESUMOS.filter(r=>r.d===q.d);
  const fcs = FLASHCARDS.filter(f=>f.d===q.d).slice(0,2);
  const outras = BANCO.filter(x=>x.t===q.t && x.id!==q.id).length;

  let h = `<div class="tutor"><div class="tutortopo"><span>Entenda o erro</span>
    <span class="marginal">${esc(q.d)} · ${esc(q.t)}</span></div><div class="tutorcorpo">`;
  h += `<h4>Por que a sua alternativa não serve</h4>
    <p style="margin:0 0 .4rem">Você marcou <b>${LETRA[resp]}</b>. A correta é <b>${LETRA[q.c]}</b>. O comentário acima explica o critério; o ponto de atenção é que o enunciado cobra exatamente a distinção tratada em <b>${esc(q.t)}</b>, dentro de ${esc(q.d)}.</p>`;
  if(fcs.length){
    h += `<h4>Revise estes pontos</h4><ul>`;
    fcs.forEach(f=>h+=`<li><b>${esc(f.f)}</b></li>`);
    h += `</ul>`;
  }
  h += `<h4>Próximo passo</h4><ul>`;
  if(res.length) h += `<li>Leia o resumo <b>${esc(res[0].t)}</b> — <button class="btn p mini" data-abrirresumo="${esc(res[0].t)}">abrir</button></li>`;
  if(fcs.length) h += `<li>Passe os flashcards de ${esc(q.d)} — <button class="btn p mini" data-abrirflash="${esc(q.d)}">abrir</button></li>`;
  if(outras) h += `<li>Resolva as outras ${outras} ${outras===1?'questão':'questões'} de ${esc(q.t)} — <button class="btn p mini" data-mesmotema="${esc(q.t)}">treinar</button></li>`;
  h += `</ul>`;

  h += `<div id="chat" class="chat"></div></div>
    <div class="perguntar">
      <input id="pIA" type="text" placeholder="Pergunte sobre esta questão…" autocomplete="off">
      <button class="btn mini" id="btIA">Perguntar</button>
    </div></div>`;
  return h;
}
function ligarTutor(raiz){
  raiz.querySelectorAll('[data-abrirresumo]').forEach(b=>b.onclick=()=>{RESUMO_ABERTO=b.dataset.abrirresumo;ir('resumos');});
  raiz.querySelectorAll('[data-abrirflash]').forEach(b=>b.onclick=()=>{FLASH.d=b.dataset.abrirflash;FLASH.i=0;FLASH.virado=false;ir('flashcards');});
  const inp=raiz.querySelector('#pIA'), bt=raiz.querySelector('#btIA');
  if(!bt) return;
  const q = (TREINO&&TREINO.q)||(REVISAO&&REVISAO.q);
  const enviar=async ()=>{
    const p=inp.value.trim(); if(!p) return;
    inp.value=''; inp.disabled=bt.disabled=true;
    const chat=raiz.querySelector('#chat');
    chat.insertAdjacentHTML('beforeend',`<div class="fala eu">${esc(p)}</div>`);
    const id='r'+Date.now();
    chat.insertAdjacentHTML('beforeend',`<div class="fala ia" id="${id}">Pensando…</div>`);
    chat.scrollTop=chat.scrollHeight;
    const alvo=document.getElementById(id);
    try{
      const txt = await perguntarIA(p,q);
      alvo.innerHTML = txt ? marcar(txt) : semIA();
    }catch(e){ alvo.innerHTML = semIA(e&&e.message); }
    inp.disabled=bt.disabled=false; inp.focus();
    chat.scrollTop=chat.scrollHeight;
  };
  bt.onclick=enviar;
  inp.onkeydown=e=>{ if(e.key==='Enter') enviar(); };
}
function semIA(msg){
  return `O assistente não está configurado neste acesso${msg?' ('+esc(msg)+')':''}. Em <b>Ajustes</b> você liga o assistente informando o endereço do seu intermediário ou, para testar, uma chave de API. Enquanto isso, o comentário e o fundamento acima cobrem o essencial desta questão.`;
}
/* markdown mínimo: **negrito**, listas e parágrafos */
function marcar(t){
  let h = esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>');
  h = h.split(/\n{2,}/).map(bloco=>{
    if(/^\s*[-*]\s/m.test(bloco)){
      const li = bloco.split('\n').filter(l=>l.trim()).map(l=>`<li>${l.replace(/^\s*[-*]\s*/,'')}</li>`).join('');
      return `<ul style="margin:.4rem 0;padding-left:1.1rem">${li}</ul>`;
    }
    return `<p style="margin:0 0 .6rem">${bloco.replace(/\n/g,'<br>')}</p>`;
  }).join('');
  return h;
}

/* -------- o assistente: intermediário → chave direta → Claude -------- */
const INSTRUCOES = [
 'Você é um tutor de Direito brasileiro. O estudante se prepara para a primeira fase do Exame de Ordem e para provas da graduação.',
 'Responda em português do Brasil, de forma direta e didática, em no máximo três parágrafos curtos.',
 'Cite o artigo ou a súmula quando couber, mas não invente número de artigo, de lei, de súmula ou de julgado: se não tiver certeza do número, descreva o instituto sem numerá-lo e diga que o número deve ser conferido.',
 'Se a dúvida envolver mudança legislativa recente, avise que a redação deve ser confirmada no Planalto.',
 'Não dê consultoria jurídica para caso concreto do estudante: este é material de estudo. Se ele descrever um problema pessoal real, oriente a procurar um advogado.',
 'Não repita o comentário que o estudante já leu: explique por outro caminho, com exemplo concreto.'
].join(' ');

function contextoQuestao(q){
  if(!q) return '';
  return `\n\n[Contexto da questão que o estudante errou]\nDisciplina: ${q.d}\nTema: ${q.t}\nEnunciado: ${q.e.replace(/<[^>]+>/g,'')}\n`+
    q.a.map((a,i)=>`(${LETRA[i]}) ${a.replace(/<[^>]+>/g,'')}`).join('\n')+
    `\nAlternativa correta: ${LETRA[q.c]}\nFundamento: ${q.f}\n[Fim do contexto]`;
}
async function perguntarIA(pergunta,q){
  const prompt = INSTRUCOES + contextoQuestao(q) + '\n\nPergunta do estudante: ' + pergunta;

  /* 1) intermediário próprio — caminho de produção, a chave fica no servidor */
  if(S.cfg.endpoint){
    const r = await fetch(S.cfg.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt,modelo:S.cfg.modelo})});
    if(!r.ok) throw new Error('intermediário respondeu '+r.status);
    const j = await r.json();
    return j.texto || j.text || j.resposta || '';
  }
  /* 2) chave de API no navegador — só para teste, nunca para distribuir */
  if(S.cfg.apiKey){
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(S.cfg.modelo)}:generateContent?key=${encodeURIComponent(S.cfg.apiKey)}`;
    const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
    if(!r.ok){ const e=await r.text(); throw new Error('Gemini '+r.status+': '+e.slice(0,120)); }
    const j = await r.json();
    const c = j.candidates && j.candidates[0];
    return (c && c.content && c.content.parts || []).map(p=>p.text||'').join('');
  }
  /* 3) dentro do Claude, sem configuração nenhuma */
  if(window.claude && window.claude.use){
    const sample = await window.claude.use('sample');
    if(sample){ const r = await sample(prompt); return r.text; }
  }
  return '';
}

/* ============================================================
   CADERNO DE ERROS
   ============================================================ */
let REVISAO=null;
function vErros(){
  let h = `<div class="cabecalho"><h2>Caderno de erros</h2>
    <p>Toda questão que você errou fica aqui até acertá-la. Acertar uma questão do caderno vale 25 XP — mais que acertar uma questão nova, porque recuperar erro é o que move a nota.</p></div>`;
  if(!S.erros.length){
    h += `<div class="vazio"><b>Caderno limpo</b>Nenhum erro pendente. Resolva mais questões ou faça um simulado para alimentar a revisão.</div>
      <div style="display:flex;gap:.6rem;margin-top:1.3rem;flex-wrap:wrap">
      <button class="btn" data-ir="questoes">Treinar questões</button>
      <button class="btn s" data-ir="simulado">Fazer um simulado</button></div>`;
    POS_RENDER=()=>document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir));
    return h;
  }
  const porDisc={};
  S.erros.forEach(e=>{ const q=BANCO[e.qid]; if(q) porDisc[q.d]=(porDisc[q.d]||0)+1; });
  h += `<div class="filtros">${Object.keys(porDisc).sort((a,b)=>porDisc[b]-porDisc[a]).map(d=>
    `<span class="tema">${esc(d)} <b>${porDisc[d]}</b></span>`).join('')}</div>`;

  if(!REVISAO){
    const e = S.erros[0]; const q = BANCO[e.qid];
    if(!q){ S.erros.shift(); salvar(); return vErros(); }
    REVISAO={q,resp:null};
  }
  h += `<p class="subtexto">${S.erros.length} ${S.erros.length===1?'questão pendente':'questões pendentes'}.</p>`;
  h += cartaoQuestao(REVISAO.q,REVISAO.resp,'erro');
  POS_RENDER=()=>ligarCartao('erro');
  return h;
}

/* ============================================================
   FLASHCARDS
   ============================================================ */
const FLASH={d:'',i:0,virado:false};
function vFlashcards(){
  const pool = FLASH.d? FLASHCARDS.filter(f=>f.d===FLASH.d) : FLASHCARDS;
  const ds = [...new Set(FLASHCARDS.map(f=>f.d))];
  if(FLASH.i>=pool.length) FLASH.i=0;
  const c = pool[FLASH.i];
  const chaveCard = f=>f.d+'|'+f.f;

  let h = `<div class="cabecalho"><h2>Flashcards</h2>
    <p>${FLASHCARDS.length} cartões nos pontos em que a banca mais cobra memória: prazos, rol de competências, ordem de classes. Vire o cartão só depois de tentar responder de cabeça.</p></div>`;
  h += `<div class="filtros"><select id="flD"><option value="">Todas as disciplinas (${FLASHCARDS.length})</option>
    ${ds.map(d=>`<option ${FLASH.d===d?'selected':''}>${esc(d)} (${FLASHCARDS.filter(f=>f.d===d).length})</option>`).join('')}</select>
    <span class="simmeta">${FLASH.i+1} de ${pool.length} · ${S.flash.length} já revisados</span></div>`;

  h += `<div class="flash"><div class="qtopo"><span class="aba n">${esc(c.d)}</span>
      <span class="marginal">${FLASH.i+1}/${pool.length}</span></div>
    <div class="flashcorpo">${FLASH.virado?`<div class="flashverso">${c.v}</div>`:`<div class="flashfrente">${esc(c.f)}</div>`}</div>
    <div class="flashrod">
      ${FLASH.virado
        ? `<button class="btn s" id="fcNao">Ainda não sei</button><button class="btn" id="fcSei">Já sei</button>`
        : `<button class="btn" id="fcVirar">Mostrar a resposta</button>`}
      <button class="btn p" id="fcPula">Pular</button>
    </div></div>`;

  POS_RENDER=()=>{
    $('#flD').onchange=e=>{ FLASH.d=e.target.value.replace(/\s*\(\d+\)$/,''); FLASH.i=0; FLASH.virado=false; render(); };
    const avanca=(sabia)=>{
      const k=chaveCard(c);
      if(sabia && !S.flash.includes(k)){ S.flash.push(k); xp(5); if(S.flash.length>=FLASHCARDS.length) ganhar('baralho'); }
      marcarDia(); salvar();
      FLASH.i=(FLASH.i+1)%pool.length; FLASH.virado=false; render();
    };
    if($('#fcVirar')) $('#fcVirar').onclick=()=>{ FLASH.virado=true; render(); };
    if($('#fcSei'))   $('#fcSei').onclick=()=>avanca(true);
    if($('#fcNao'))   $('#fcNao').onclick=()=>avanca(false);
    $('#fcPula').onclick=()=>{ FLASH.i=(FLASH.i+1)%pool.length; FLASH.virado=false; render(); };
  };
  return h;
}

/* ============================================================
   RESUMOS
   ============================================================ */
let RESUMO_ABERTO=null;
function vResumos(){
  if(RESUMO_ABERTO){
    const r = RESUMOS.find(x=>x.t===RESUMO_ABERTO);
    if(r){
      if(!S.lidos) S.lidos=[];
      if(!S.lidos.includes(r.t)){ S.lidos.push(r.t); marcarDia(); xp(8); salvar(); }
      let h = `<button class="btn p" id="voltar">← Todos os resumos</button>
        <div class="leitura"><div style="margin:.8rem 0 1rem"><span class="aba n">${esc(r.d)}</span></div>
        <h2>${esc(r.t)}</h2>${r.html}</div>
        <div style="display:flex;gap:.6rem;margin-top:2rem;flex-wrap:wrap">
          <button class="btn" data-treinar="${esc(r.d)}">Treinar questões de ${esc(r.d)}</button>
          <button class="btn s" data-abrirflash="${esc(r.d)}">Flashcards de ${esc(r.d)}</button></div>`;
      POS_RENDER=()=>{
        $('#voltar').onclick=()=>{RESUMO_ABERTO=null;render();};
        document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{FILTRO.d=b.dataset.treinar;FILTRO.t='';FILTRO.n='';TREINO=null;ir('questoes');});
        document.querySelectorAll('[data-abrirflash]').forEach(b=>b.onclick=()=>{FLASH.d=b.dataset.abrirflash;FLASH.i=0;FLASH.virado=false;ir('flashcards');});
      };
      return h;
    }
    RESUMO_ABERTO=null;
  }
  let h = `<div class="cabecalho"><h2>Resumos esquematizados</h2>
    <p>${RESUMOS.length} resumos nos pontos em que todo mundo troca os conceitos. São tabelas comparativas, não texto corrido: servem para consultar na véspera.</p></div>
    <div class="listaresumo">`;
  RESUMOS.forEach(r=>{
    h += `<button class="lr" data-r="${esc(r.t)}"><span class="aba n">${esc(r.d)}</span>
      <span style="flex:1"><b>${esc(r.t)}</b></span><span class="marginal">ler →</span></button>`;
  });
  h += `</div>`;
  POS_RENDER=()=>document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{RESUMO_ABERTO=b.dataset.r;render();});
  return h;
}

/* ============================================================
   TRILHAS
   ============================================================ */
/* Percurso linear: o aluno avança módulo a módulo, na ordem que dá mais
   retorno na prova. Ética vem primeiro porque é a disciplina de maior peso
   e conteúdo fechado — é onde o estudo rende mais rápido.
   O progresso é lido do que o aluno já fez, não de um estado paralelo. */
const ORDEM_TRILHA = [
  'Ética e Estatuto da OAB','Direito Constitucional','Direito Civil','Direito Processual Civil',
  'Direito Penal','Direito Processual Penal','Direito Administrativo','Direito do Trabalho',
  'Direito Processual do Trabalho','Direito Tributário','Direito Empresarial','Direito do Consumidor',
  'Direito da Criança e do Adolescente','Direito Ambiental','Direito Previdenciário','Filosofia do Direito',
  'Direitos Humanos','Direito Internacional','Direito Eleitoral','Direito Financeiro'
];
const APROVEITAMENTO_MINIMO = 0.7;

function metaQuestoes(d){ const x=TRILHA_OAB.find(t=>t.d===d); return Math.max(6, (x?x.peso:2)*2); }

function etapasDo(d){
  const resumo  = RESUMOS.find(r=>r.d===d);
  const cartoes = FLASHCARDS.filter(f=>f.d===d);
  const lidos   = (S.lidos||[]);
  const vistos  = cartoes.filter(f=>S.flash.includes(f.d+'|'+f.f)).length;
  const r = S.resp[d]||{c:0,t:0};
  const meta = metaQuestoes(d);
  const taxa = r.t ? r.c/r.t : null;

  const etapas = [];
  if(resumo) etapas.push({
    tipo:'resumo', nome:'Ler o resumo', detalhe:resumo.t,
    pronta: lidos.includes(resumo.t), alvo:resumo.t
  });
  if(cartoes.length) etapas.push({
    tipo:'cartoes', nome:'Passar os flashcards', detalhe:vistos+' de '+cartoes.length+' marcados como sabidos',
    pronta: vistos>=cartoes.length, alvo:d
  });
  etapas.push({
    tipo:'questoes', nome:'Resolver '+meta+' questões com '+Math.round(APROVEITAMENTO_MINIMO*100)+'% de acerto',
    detalhe: r.t ? r.c+' certas em '+r.t+' respondidas ('+pct(taxa)+')' : 'nenhuma questão respondida ainda',
    pronta: r.t>=meta && taxa>=APROVEITAMENTO_MINIMO, alvo:d
  });
  return etapas;
}
function moduloPronto(d){ return etapasDo(d).every(e=>e.pronta); }

let DISC_ABERTA=null;
function vTrilhaOAB(){
  const prontos = ORDEM_TRILHA.filter(moduloPronto).length;
  /* o módulo atual é o primeiro não concluído */
  const atual = ORDEM_TRILHA.find(d=>!moduloPronto(d)) || null;
  if(DISC_ABERTA===null) DISC_ABERTA = atual;

  let h = `<div class="cabecalho"><h2>Trilha do Exame de Ordem</h2>
    <p>Vinte módulos, em ordem. Cada um pede que você leia o resumo, passe os flashcards e resolva as questões com pelo menos ${Math.round(APROVEITAMENTO_MINIMO*100)}% de acerto antes de dar o módulo por fechado.</p></div>`;

  h += `<div class="progTrilha">
    <div class="pt-num">${prontos}<span>/${ORDEM_TRILHA.length}</span></div>
    <div class="pt-corpo">
      <div class="pt-rot">${prontos===0?'Nenhum módulo concluído ainda':prontos===ORDEM_TRILHA.length?'Trilha completa':'Módulos concluídos'}</div>
      <div class="pt-degraus">${ORDEM_TRILHA.map(d=>`<span class="deg${moduloPronto(d)?' ok':''}${d===atual?' aqui':''}" title="${esc(d)}"></span>`).join('')}</div>
      ${atual?`<div class="pt-agora">Você está em <b>${esc(atual)}</b></div>`:''}
    </div></div>`;

  h += `<div class="aviso"><b>Por que esta ordem.</b> A trilha não segue a ordem da prova nem o alfabeto: segue o retorno do estudo. Ética abre o percurso porque vale 8 questões e tem conteúdo fechado e repetitivo — é a matéria em que menos tempo compra mais pontos. Direito Financeiro fecha porque vale 2. Você pode abrir qualquer módulo quando quiser; a ordem é recomendação, não trava.</div>`;

  ORDEM_TRILHA.forEach((d,i)=>{
    const x = TRILHA_OAB.find(t=>t.d===d);
    const etapas = etapasDo(d);
    const pronto = etapas.every(e=>e.pronta);
    const feitas = etapas.filter(e=>e.pronta).length;
    const ehAtual = d===atual;
    const aberto = DISC_ABERTA===d;
    const r = S.resp[d]||{c:0,t:0}, taxa = r.t?r.c/r.t:null;

    h += `<div class="disc"${ehAtual?' style="border-color:var(--marca);border-width:1.5px"':''}>
      <button class="disctopo" data-d="${esc(d)}">
        <span class="aba ${pronto?'v':(ehAtual?'':'n')}">${pronto?'✓':i+1}</span>
        <span class="nome">${esc(d)}${ehAtual?' <span style="color:var(--marca);font-weight:400;font-size:.85rem">— módulo atual</span>':''}</span>
        <span class="qtd">${pronto?'concluído':feitas+'/'+etapas.length+' etapas'} · ${x.peso} na prova${taxa!==null?' · <span class="taxa '+classeTaxa(taxa)+'">'+pct(taxa)+'</span>':''}</span>
        <span class="marginal">${aberto?'−':'+'}</span></button>`;

    if(aberto){
      h += `<div class="discdet">
        <div class="temas" style="margin-top:.9rem">${x.temas.map(t=>`<span class="tema">${esc(t)}</span>`).join('')}</div>
        <div class="rec" style="margin-bottom:.9rem">`;
      etapas.forEach((e,k)=>{
        h += `<div class="recitem"><span class="ord" style="${e.pronta?'color:var(--verde)':''}">${e.pronta?'✓':k+1}</span>
          <div class="corpo"><b style="${e.pronta?'color:var(--toga);font-weight:500':''}">${esc(e.nome)}</b>
          <span>${esc(e.detalhe)}</span></div>
          <button class="btn ${e.pronta?'s ':''}mini" data-etapa="${e.tipo}" data-alvo="${esc(e.alvo)}">${e.pronta?'Rever':'Fazer'}</button></div>`;
      });
      h += `</div>
        <p class="subtexto" style="margin:0">Questões ${x.pos} da prova · ${BANCO.filter(q=>q.d===d).length} questões no banco desta disciplina.</p>
      </div>`;
    }
    h += `</div>`;
  });

  POS_RENDER=()=>{
    document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{
      DISC_ABERTA = DISC_ABERTA===b.dataset.d ? '' : b.dataset.d; render();
    });
    document.querySelectorAll('[data-etapa]').forEach(b=>b.onclick=()=>{
      const t=b.dataset.etapa, alvo=b.dataset.alvo;
      if(t==='resumo'){ RESUMO_ABERTO=alvo; ir('resumos'); }
      else if(t==='cartoes'){ FLASH.d=alvo; FLASH.i=0; FLASH.virado=false; ir('flashcards'); }
      else { FILTRO.d=alvo; FILTRO.t=''; FILTRO.n=''; TREINO=null; ir('questoes'); }
    });
  };
  return h;
}
function vTrilhaGrad(){
  let h = `<div class="cabecalho"><h2>Trilha da graduação</h2>
    <p>As matérias do curso organizadas por período. Em cada uma, a disciplina correspondente no Exame de Ordem — estudar para a prova da faculdade já adianta a OAB.</p></div>`;
  h += `<div class="aviso"><b>Matriz genérica.</b> Esta é a estrutura padrão de um curso de Direito. Se a sua faculdade organiza as matérias em outra ordem, a correspondência com a OAB continua valendo — o que muda é só o período em que cada matéria aparece.</div>`;
  TRILHA_GRAD.forEach(p=>{
    h += `<div class="periodo"><h3>${esc(p.p)}</h3><div class="mats">`;
    p.m.forEach(m=>{
      const oab = PONTE_GRAD_OAB[m];
      const r = oab? (S.resp[oab]||{c:0,t:0}) : null;
      h += `<div class="mat"><span style="flex:1">${esc(m)}</span>`;
      if(oab){
        h += `<span class="liga">${PESO[oab]} ${PESO[oab]===1?'questão':'questões'} na OAB</span>
          <button class="btn p mini" data-treinar="${esc(oab)}">${r&&r.t?pct(r.c/r.t):'treinar'}</button>`;
      } else h += `<span class="marginal">fora da 1ª fase</span>`;
      h += `</div>`;
    });
    h += `</div></div>`;
  });
  POS_RENDER=()=>document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{FILTRO.d=b.dataset.treinar;FILTRO.t='';FILTRO.n='';TREINO=null;ir('questoes');});
  return h;
}

/* ============================================================
   ATUALIZAÇÕES
   ============================================================ */
function vAtualizacoes(){
  let h = `<div class="cabecalho"><h2>Atualizações legislativas</h2>
    <p>O que mudou na lei e tem chance de aparecer na prova. Revisado em novembro de 2026.</p></div>`;
  h += `<div class="aviso"><b>A banca cobra a lei vigente na data do edital.</b> Novidade legislativa costuma entrar com peso baixo e em linhas gerais, raramente em detalhe fino. Domine o conteúdo clássico primeiro; use esta página como complemento, e confirme a redação no Planalto antes da prova.</div>`;
  ATUALIZACOES.forEach(a=>{
    h += `<div class="disc"><div style="padding:1.05rem 1.2rem">
      <div style="margin-bottom:.6rem"><span class="aba ${a.d==='Geral'?'o':'n'}">${esc(a.d)}</span></div>
      <h3 style="margin-bottom:.45rem">${esc(a.t)}</h3>
      <p class="medida" style="margin:0;font-size:.94rem;line-height:1.66">${a.txt}</p></div></div>`;
  });
  return h;
}

/* ============================================================
   PLANO DE ESTUDOS
   O plano não é uma tabela fixa: ele redistribui o tempo conforme o
   aluno erra. Disciplina com peso alto e acerto baixo recebe mais
   minutos; disciplina dominada sai do caminho.
   ============================================================ */
const DIAS_SEM = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

function planoPadrao(){ return {dias:[1,2,3,4,5], minutos:45, feitas:[]}; }
function oPlano(){ if(!S.plano) S.plano = planoPadrao(); return S.plano; }

function diasAteProva(){
  if(!S.prova) return null;
  return Math.ceil((new Date(S.prova+'T23:59:59') - new Date())/864e5);
}
/* sessões restantes até a prova, contando só os dias da semana escolhidos */
function sessoesRestantes(){
  const p = oPlano(), d = diasAteProva();
  if(d===null || d<=0 || !p.dias.length) return null;
  let n=0; const hoje0=new Date();
  for(let i=0;i<d;i++){
    const dt=new Date(hoje0.getTime()+i*864e5);
    if(p.dias.includes(dt.getDay())) n++;
  }
  return n;
}
/* reparte o tempo total entre as disciplinas, por impacto na nota */
function repartirTempo(){
  const rec = recomendar();
  const soma = rec.reduce((s,r)=>s+r.impacto,0) || 1;
  return rec.map(r=>({
    d: r.d, taxa: r.taxa, peso: r.peso,
    fatia: Math.max(0.015, r.impacto/soma)   /* ninguém zera: toda disciplina cai na prova */
  }));
}
/* a sessão de hoje: qual disciplina, quantas questões, quantos erros, quantos cartões */
function sessaoDeHoje(){
  const p = oPlano();
  const hojeDow = new Date().getDay();
  if(!p.dias.includes(hojeDow)) return {folga:true};

  const fatias = repartirTempo();
  /* rodízio estável: o dia do ano decide por onde a fila começa */
  const diaDoAno = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0))/864e5);
  const ordem = fatias.slice(0, 8);
  const principal = ordem[diaDoAno % ordem.length];
  const apoio = ordem[(diaDoAno+3) % ordem.length];

  const min = p.minutos;
  const qQuestoes = Math.max(5, Math.round(min/3));
  const qErros = Math.min(S.erros.length, Math.max(0, Math.round(min/12)));
  const qCartoes = Math.max(3, Math.round(min/9));
  return {
    folga:false, principal, apoio: apoio.d===principal.d ? null : apoio,
    qQuestoes, qErros, qCartoes, minutos:min,
    feita: p.feitas.includes(hoje())
  };
}

function vPlano(){
  const p = oPlano(), dias = diasAteProva(), sess = sessoesRestantes();
  const s = sessaoDeHoje();
  const fatias = repartirTempo();

  let h = `<div class="cabecalho"><h2>Plano de estudos</h2>
    <p>O plano se ajusta sozinho: quanto pior o seu acerto numa disciplina pesada, mais tempo ela recebe. Responda questões e ele muda na semana seguinte.</p></div>`;

  /* --- sessão de hoje, em primeiro lugar --- */
  h += `<section class="secao"><h2>Hoje</h2>`;
  if(s.folga){
    h += `<div class="vazio"><b>Hoje é dia de folga</b>Você marcou ${p.dias.length} ${p.dias.length===1?'dia':'dias'} de estudo por semana. Se quiser estudar mesmo assim, é só ir para as questões.</div>`;
  } else if(s.feita){
    h += `<div class="vazio"><b>Sessão de hoje concluída</b>Ofensiva em ${S.streak} ${S.streak===1?'dia':'dias'}. Descansar faz parte: o que você estudou hoje consolida dormindo.</div>`;
  } else {
    h += `<div class="rec">
      <div class="recitem"><span class="ord">1</span><div class="corpo">
        <b>${s.qQuestoes} questões de ${esc(s.principal.d)}</b>
        <span>${esc((TEMAS[s.principal.d]||[]).slice(0,3).join(' · '))}</span></div>
        <button class="btn mini" data-treinar="${esc(s.principal.d)}">Começar</button></div>`;
    if(s.qErros){
      h += `<div class="recitem"><span class="ord">2</span><div class="corpo">
        <b>Revisar ${s.qErros} ${s.qErros===1?'erro':'erros'} do caderno</b>
        <span>Recuperar erro vale mais que acertar questão nova — 25 XP contra 10.</span></div>
        <button class="btn s mini" data-ir="erros">Abrir</button></div>`;
    }
    h += `<div class="recitem"><span class="ord">${s.qErros?3:2}</span><div class="corpo">
      <b>${s.qCartoes} flashcards${s.apoio?' de '+esc(s.apoio.d):''}</b>
      <span>Fecha a sessão com memória de prazos, rol e classificação.</span></div>
      <button class="btn s mini" data-abrirflash="${esc(s.apoio?s.apoio.d:s.principal.d)}">Abrir</button></div>
    </div>
    <div style="margin-top:1.1rem"><button class="btn" id="btFeita">Marcar sessão de hoje como feita</button>
      <span class="simmeta" style="margin-left:.8rem">${s.minutos} minutos previstos</span></div>`;
  }
  h += `</section>`;

  /* --- o cerco até a prova --- */
  if(dias!==null){
    h += `<section class="secao"><h2>Até a prova</h2>
      <dl class="numeros">
        <div class="num"><dt>Dias restantes</dt><dd>${dias>0?dias:0}</dd></div>
        <div class="num"><dt>Sessões restantes</dt><dd>${sess||0}</dd></div>
        <div class="num"><dt>Horas de estudo</dt><dd>${Math.round((sess||0)*p.minutos/60)}<small> h</small></dd></div>
        <div class="num"><dt>Projeção de nota</dt><dd>${Math.round(projecao())}<small> / 80</small></dd></div>
      </dl>`;
    if(dias>0 && sess){
      const falta = 40 - projecao();
      h += `<p class="subtexto">${falta>0
        ? `Faltam cerca de <b>${Math.ceil(falta)}</b> ${Math.ceil(falta)===1?'ponto':'pontos'} para a nota de corte. Com ${sess} ${sess===1?'sessão':'sessões'} de ${p.minutos} minutos, dá para cobrir — desde que o tempo vá para as disciplinas de cima da lista, não para as que você já domina.`
        : `No ritmo atual você está <b>acima</b> da nota de corte. Use as ${sess} ${sess===1?'sessão':'sessões'} restantes para firmar as disciplinas de maior peso e não perder o que já ganhou.`}</p>`;
    } else if(dias<=0){
      h += `<p class="subtexto">A data da prova já passou. Atualize em Ajustes para o próximo exame.</p>`;
    }
    h += `</section>`;
  } else {
    h += `<div class="aviso"><b>Informe a data da prova.</b> Sem ela não dá para calcular quantas sessões você ainda tem nem distribuir o conteúdo no tempo. Em <b>Ajustes</b> você preenche.
      <div style="margin-top:.7rem"><button class="btn mini" data-ir="ajustes">Ir para Ajustes</button></div></div>`;
  }

  /* --- divisão do tempo --- */
  h += `<section class="secao"><h2>Para onde vai o seu tempo</h2>
    <p class="subtexto">Calculado sobre o peso de cada disciplina na prova e o seu acerto nela. Muda sozinho conforme você responde.</p>
    <div class="tabwrap"><table><thead><tr><th>Disciplina</th><th class="n">Seu acerto</th><th class="n">Peso</th><th class="n">Fatia do tempo</th><th class="n">Min/semana</th></tr></thead><tbody>`;
  const minSemana = p.dias.length * p.minutos;
  fatias.slice(0,12).forEach(f=>{
    h += `<tr><td>${esc(f.d)}</td>
      <td class="n"><span class="taxa ${classeTaxa(f.taxa)}">${f.taxa===null?'—':pct(f.taxa)}</span></td>
      <td class="n">${f.peso}</td>
      <td class="n">${Math.round(f.fatia*100)}%</td>
      <td class="n">${Math.round(f.fatia*minSemana)}</td></tr>`;
  });
  h += `</tbody></table></div></section>`;

  /* --- ajustes do plano --- */
  h += `<section class="secao"><h2>Sua rotina</h2>
    <label class="campo"><b>Dias de estudo na semana</b></label>
    <div class="filtros" style="margin-top:-.5rem">`;
  DIAS_SEM.forEach((nome,i)=>{
    h += `<button class="tema" data-dia="${i}" style="cursor:pointer;${p.dias.includes(i)?'background:var(--tinta);color:#fff;border-color:var(--tinta)':''}">${nome.slice(0,3)}</button>`;
  });
  h += `</div>
    <label class="campo"><b>Minutos por sessão</b>
      <select id="plMin">${[20,30,45,60,90,120].map(m=>`<option value="${m}" ${p.minutos===m?'selected':''}>${m} minutos</option>`).join('')}</select>
      <em>Trinta minutos de questões comentadas rendem mais que duas horas de leitura passiva.</em></label>
  </section>`;

  /* --- assistente --- */
  h += `<section class="secao"><h2>Pedir um plano ao assistente</h2>
    <p class="subtexto">O assistente lê os seus números — dias até a prova, tempo disponível e acerto por disciplina — e escreve um roteiro em texto, semana a semana.</p>
    <div class="tutor"><div class="tutortopo"><span>Assistente de estudos</span>
      <span class="marginal">${dias!==null?dias+' dias até a prova':'data da prova não informada'}</span></div>
      <div class="tutorcorpo"><div id="chat" class="chat"></div>
        <div id="planoVazio" style="color:var(--toga);font-size:.92rem">Clique abaixo para receber um roteiro escrito a partir do seu desempenho, ou pergunte o que quiser sobre organização de estudo.</div></div>
      <div class="perguntar">
        <input id="pIA" type="text" placeholder="Ex.: como encaixo 3 horas no sábado?" autocomplete="off">
        <button class="btn mini" id="btIA">Perguntar</button>
      </div></div>
    <div style="margin-top:.8rem"><button class="btn s" id="btRoteiro">Montar meu roteiro</button></div></section>`;

  POS_RENDER=()=>{
    document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir));
    document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{FILTRO.d=b.dataset.treinar;FILTRO.t='';FILTRO.n='';TREINO=null;ir('questoes');});
    document.querySelectorAll('[data-abrirflash]').forEach(b=>b.onclick=()=>{FLASH.d=b.dataset.abrirflash;FLASH.i=0;FLASH.virado=false;ir('flashcards');});
    document.querySelectorAll('[data-dia]').forEach(b=>b.onclick=()=>{
      const i=+b.dataset.dia, k=p.dias.indexOf(i);
      if(k>=0) p.dias.splice(k,1); else p.dias.push(i);
      p.dias.sort(); salvar(); render();
    });
    const sel=$('#plMin'); if(sel) sel.onchange=e=>{ p.minutos=+e.target.value; salvar(); render(); };
    const bf=$('#btFeita');
    if(bf) bf.onclick=()=>{ if(!p.feitas.includes(hoje())){ p.feitas.push(hoje()); marcarDia(); xp(15); salvar(); } render(); };

    const raiz=$('#tela');
    ligarTutor(raiz);
    const br=$('#btRoteiro');
    if(br) br.onclick=async ()=>{
      const chat=$('#chat'), vazio=$('#planoVazio');
      if(vazio) vazio.style.display='none';
      br.disabled=true;
      const id='r'+Date.now();
      chat.insertAdjacentHTML('beforeend',`<div class="fala ia" id="${id}">Montando o roteiro…</div>`);
      const alvo=document.getElementById(id);
      const desempenho = fatias.slice(0,10).map(f=>`${f.d}: ${f.taxa===null?'nunca treinada':pct(f.taxa)} de acerto, vale ${f.peso} questões na prova`).join('; ');
      const pergunta = `Monte um roteiro de estudo para a primeira fase do Exame de Ordem.\n`+
        `Dias até a prova: ${dias===null?'não informado':dias}.\n`+
        `Dias de estudo por semana: ${p.dias.map(i=>DIAS_SEM[i]).join(', ')||'nenhum definido'}.\n`+
        `Minutos por sessão: ${p.minutos}.\n`+
        `Desempenho por disciplina: ${desempenho}.\n`+
        `Erros pendentes no caderno de revisão: ${S.erros.length}.\n`+
        `Escreva semana a semana, dizendo o que fazer em cada dia. Seja concreto e curto. `+
        `Priorize por peso na prova multiplicado pela taxa de erro, não por ordem alfabética nem por gosto.`;
      try{
        const txt = await perguntarIA(pergunta, null);
        alvo.innerHTML = txt ? marcar(txt) : semIA();
      }catch(e){ alvo.innerHTML = semIA(e&&e.message); }
      br.disabled=false;
      chat.scrollTop=chat.scrollHeight;
    };
  };
  return h;
}


/* ============================================================
   REVISÃO ESPAÇADA
   Cada questão volta num intervalo que cresce quando o aluno acerta
   e colapsa quando erra. É o que faz 141 questões renderem meses em
   vez de uma semana, e o que segura o conteúdo na memória até a prova.
   Nota: 0 errou · 1 acertou com esforço · 2 acertou tranquilo.
   ============================================================ */
const TETO_INTERVALO = 120;           /* dias */
function oSrs(){ if(!S.srs) S.srs = {}; return S.srs; }
function hojeMais(dias){ return new Date(Date.now()+dias*864e5).toISOString().slice(0,10); }

function agendar(qid, nota){
  const srs = oSrs();
  const r = srs[qid] || {int:0, prox:hoje(), lapsos:0, acertos:0, vistas:0};
  r.vistas++;
  if(nota === 0){
    r.lapsos++; r.int = 1;              /* errou: volta amanhã */
  } else {
    r.acertos++;
    if(r.int === 0) r.int = (nota === 2 ? 3 : 2);
    else r.int = Math.min(TETO_INTERVALO, Math.round(r.int * (nota === 2 ? 2.4 : 1.5)));
  }
  r.prox = hojeMais(r.int);
  srs[qid] = r; salvar();
}
/* itens vencidos, do mais atrasado para o menos */
function vencidas(){
  const srs = oSrs(), h = hoje();
  return Object.keys(srs)
    .filter(id => srs[id].prox <= h)
    .map(id => ({id:+id, prox:srs[id].prox, lapsos:srs[id].lapsos}))
    .sort((a,b) => a.prox < b.prox ? -1 : a.prox > b.prox ? 1 : b.lapsos - a.lapsos)
    .map(x => x.id)
    .filter(id => BANCO[id]);
}
function nuncaVistas(){
  const srs = oSrs();
  return BANCO.filter(q => !(q.id in srs));
}
/* monta a sessão: primeiro o que está vencendo, depois material novo
   da disciplina de maior impacto, até preencher o tempo disponível */
function montarSessao(){
  const p = oPlano();
  /* A sessão precisa parecer terminável. Enunciado de OAB é longo:
     conta-se perto de 2 minutos por questão, e o teto é 12 — quem tem
     mais tempo faz outra rodada, o que fecha um ciclo em vez de
     arrastar um só. */
  const TETO_SESSAO = 12;
  const alvo = Math.min(TETO_SESSAO, Math.max(5, Math.round(p.minutos / 2)));
  const devidas = vencidas().slice(0, alvo);
  let lista = devidas.slice();
  if(lista.length < alvo){
    const prioridade = recomendar().map(r => r.d);
    const novas = nuncaVistas().sort((a,b) => prioridade.indexOf(a.d) - prioridade.indexOf(b.d));
    lista = lista.concat(novas.slice(0, alvo - lista.length).map(q => q.id));
  }
  return {ids: lista, revisao: devidas.length, novas: lista.length - devidas.length};
}

/* ---------- a sessão em si ---------- */
let SESSAO = null;
function iniciarSessao(){
  const m = montarSessao();
  if(!m.ids.length) return false;
  SESSAO = {ids:m.ids, i:0, resp:null, certas:0, revisao:m.revisao, novas:m.novas, xpGanho:0};
  return true;
}
function vSessao(){
  if(!SESSAO){
    if(!iniciarSessao()){
      return `<div class="cabecalho"><h2>Nada vencendo agora</h2>
        <p>Você já revisou tudo o que estava no prazo e respondeu todo o banco. Volte amanhã — a revisão espaçada traz os itens de volta sozinha.</p></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn" data-ir="simulado">Fazer um simulado</button>
        <button class="btn s" data-ir="flashcards">Passar flashcards</button></div>`;
    }
  }
  /* terminou */
  if(SESSAO.i >= SESSAO.ids.length){
    const total = SESSAO.ids.length, certas = SESSAO.certas;
    const h = `<div class="cabecalho"><h2>Sessão concluída</h2>
      <p>${certas} de ${total} ${certas===1?'certa':'certas'}. ${
        certas/total >= .7 ? 'Bom aproveitamento — os itens que você acertou voltam mais pra frente.'
        : 'O que você errou volta amanhã. É assim que fixa.'}</p></div>
      <div class="ganhos"><span>XP ganho <b>+${SESSAO.xpGanho}</b></span>
        <span>Ofensiva <b>${S.streak}</b> ${S.streak===1?'dia':'dias'}</span>
        <span>Vencendo amanhã <b>${vencidas().length}</b></span></div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <button class="btn" id="btMais">Continuar estudando</button>
        <button class="btn s" data-ir="painel">Voltar ao painel</button></div>`;
    POS_RENDER = () => {
      document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{SESSAO=null;ir(b.dataset.ir);});
      $('#btMais').onclick = () => { SESSAO=null; if(iniciarSessao()) render(); else ir('questoes'); };
    };
    return h;
  }

  const q = BANCO[SESSAO.ids[SESSAO.i]];
  const feito = SESSAO.i + (SESSAO.resp!==null ? 1 : 0);
  const pct0 = Math.round(feito / SESSAO.ids.length * 100);
  const ehRevisao = (oSrs()[q.id] || {}).vistas > 0;

  let h = `<div class="sessaoTopo">
    <div class="sessaoBarra"><div class="sessaoTraco" style="width:${pct0}%"></div></div>
    <div class="sessaoMeta">
      <span>${SESSAO.i+1} de ${SESSAO.ids.length}</span>
      <span>${ehRevisao ? 'revisão' : 'questão nova'}</span>
      <button class="btn p mini" id="btSair">Pausar</button>
    </div></div>`;
  h += cartaoQuestao(q, SESSAO.resp, 'sessao');

  POS_RENDER = () => {
    $('#btSair').onclick = () => { SESSAO=null; ir('painel'); };
    ligarCartao('sessao');
  };
  return h;
}

/* ============================================================
   PROVAS OFICIAIS
   Não hospedamos os cadernos: eles são da FGV e da OAB. O aluno
   resolve no site delas, que é onde estão publicados.
   ============================================================ */
function vProvas(){
  let h = `<div class="cabecalho"><h2>Provas oficiais</h2>
    <p>Resolver provas passadas é a melhor preparação que existe para a primeira fase — nenhum simulado substitui o caderno real da banca. Elas estão publicadas de graça pela FGV e pela OAB, e é lá que você as resolve.</p></div>`;

  h += `<div class="aviso"><b>Por que os cadernos não estão aqui dentro.</b> As provas são obra da FGV e da OAB, protegidas por direito autoral. Publicá-las dentro de um serviço pago seria uso comercial de obra de terceiro. Por isso esta página leva você até as fontes oficiais, onde o acesso é livre, em vez de copiá-las.</div>`;

  const fontes = [
    { n:'OAB Nacional — Exame de Ordem',
      u:'https://www.oab.org.br/servicos/examedeordem',
      d:'Página oficial do Conselho Federal. Traz os cadernos de prova e os gabaritos de cada edição, os padrões de resposta da 2ª fase, os editais e o bloco de exames anteriores.' },
    { n:'FGV — Banca do Exame de Ordem',
      u:'https://oab.fgv.br',
      d:'Site da banca. É onde ficam hospedados os cadernos em PDF, por tipo de prova, além dos gabaritos preliminares e definitivos e das respostas aos recursos.' }
  ];
  h += `<div class="listaresumo" style="margin-bottom:1.8rem">`;
  fontes.forEach(f=>{
    h += `<a class="lr" href="${f.u}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
      <span style="flex:1"><b style="display:block;color:var(--tinta)">${esc(f.n)}</b>
      <span style="color:var(--toga);font-size:.87rem;line-height:1.55;display:block;margin-top:.2rem">${esc(f.d)}</span>
      <span style="color:var(--marca);font-size:.82rem;display:block;margin-top:.35rem">${esc(f.u)}</span></span>
      <span class="marginal">abrir ↗</span></a>`;
  });
  h += `</div>`;

  h += `<section class="secao"><h2>Como aproveitar uma prova antiga</h2>
    <div class="rec">
      <div class="recitem"><span class="ord">1</span><div class="corpo"><b>Faça cronometrada, de uma vez</b>
        <span>Cinco horas, 80 questões, sem consulta e sem pausa. O cansaço da quarta hora é parte do que a prova mede.</span></div></div>
      <div class="recitem"><span class="ord">2</span><div class="corpo"><b>Corrija e some por disciplina</b>
        <span>Não basta a nota total. Anote quantas você acertou em cada matéria — é a diferença entre saber que foi mal e saber onde foi mal.</span></div></div>
      <div class="recitem"><span class="ord">3</span><div class="corpo"><b>Traga os erros para cá</b>
        <span>Para cada disciplina em que você foi mal na prova oficial, treine o banco daqui naquela disciplina. O caderno de erros faz o resto.</span></div></div>
      <div class="recitem"><span class="ord">4</span><div class="corpo"><b>Repita o ciclo com outra edição</b>
        <span>Duas ou três provas antigas já revelam o seu padrão de erro. Dez não acrescentam muito mais do que as três primeiras bem revisadas.</span></div></div>
    </div></section>`;

  h += `<section class="secao"><h2>Treinar agora, por disciplina</h2>
    <p class="subtexto">Depois de corrigir a prova oficial, venha direto para a disciplina em que você perdeu mais pontos.</p>
    <div class="filtros">${TRILHA_OAB.map(x=>`<button class="tema" data-treinar="${esc(x.d)}" style="cursor:pointer">${esc(x.d)} <b>${x.peso}</b></button>`).join('')}</div></section>`;

  POS_RENDER=()=>document.querySelectorAll('[data-treinar]').forEach(b=>b.onclick=()=>{
    FILTRO.d=b.dataset.treinar; FILTRO.t=''; FILTRO.n=''; TREINO=null; ir('questoes');
  });
  return h;
}

/* ============================================================
   CONQUISTAS
   ============================================================ */
function vMedalhas(){
  const n=nivel(S.xp);
  let h = `<div class="cabecalho"><h2>Conquistas</h2>
    <p>${S.med.length} de ${MEDALHAS.length} desbloqueadas. Nível ${esc(n.nome)}${n.prox?`, faltam ${(n.prox-S.xp).toLocaleString('pt-BR')} XP para ${esc(n.proxNome)}`:' — o último'}.</p></div>`;
  h += `<section class="secao"><h2>Como o XP funciona</h2>
    <div class="tabwrap"><table><thead><tr><th>Ação</th><th class="n">XP</th></tr></thead><tbody>
    <tr><td>Acertar uma questão no treino livre</td><td class="n">10</td></tr>
    <tr><td>Acertar uma questão no simulado</td><td class="n">15</td></tr>
    <tr><td>Acertar uma questão do caderno de erros</td><td class="n">25</td></tr>
    <tr><td>Marcar um flashcard como sabido</td><td class="n">5</td></tr>
    <tr><td>Responder, mesmo errando</td><td class="n">2</td></tr>
    </tbody></table></div></section>`;
  h += `<section class="secao"><h2>Níveis</h2><div class="tabwrap"><table><thead><tr><th>Nível</th><th class="n">XP necessário</th></tr></thead><tbody>
    ${NIVEIS.map((x,i)=>`<tr><td>${esc(x[1])}${i===n.idx?' — você está aqui':''}</td><td class="n">${x[0].toLocaleString('pt-BR')}</td></tr>`).join('')}
    </tbody></table></div></section>`;
  h += `<section class="secao"><h2>Medalhas</h2><div class="medalhas">`;
  MEDALHAS.forEach(m=>{
    const tem=S.med.includes(m.id);
    h += `<div class="med ${tem?'tem':''}"><b>${esc(m.n)}</b><span>${esc(m.d)}</span></div>`;
  });
  h += `</div></section>`;
  return h;
}

/* ============================================================
   AJUSTES
   ============================================================ */
function vAjustes(){
  let h = `<div class="cabecalho"><h2>Ajustes</h2></div>`;
  h += `<section class="secao"><h2>Seus dados</h2>
    <label class="campo"><b>Como você quer ser chamado</b>
      <input type="text" id="aAluno" value="${esc(S.aluno)}" placeholder="Seu nome"></label>
    <label class="campo"><b>Data da prova</b>
      <input type="date" id="aProva" value="${esc(S.prova)}">
      <em>O painel passa a mostrar a contagem de dias.</em></label>
    <button class="btn" id="aSalvar">Salvar</button></section>`;

  h += `<section class="secao"><h2>Assistente de estudos</h2>
    <p class="subtexto">O assistente explica a questão de outro jeito quando o comentário não bastou. Sem ele a plataforma continua inteira: o bloco "Entenda o erro" funciona sempre.</p>`;
  h += `<div class="aviso"><b>Antes de vender o acesso, use o campo do endpoint, não o da chave.</b> Chave de API colada aqui fica salva apenas neste navegador, mas qualquer requisição parte do computador do aluno — e numa página que você distribui, a chave fica ao alcance de quem souber abrir o inspetor. O endpoint aponta para um intermediário seu, que guarda a chave no servidor. O arquivo <b>intermediario.js</b> que acompanha o produto tem o código pronto e as instruções de publicação.</div>`;
  h += `<label class="campo"><b>Endpoint do intermediário</b>
      <input type="text" id="aEnd" value="${esc(S.cfg.endpoint)}" placeholder="https://seu-projeto.vercel.app/api/tutor">
      <em>Caminho recomendado. Preenchido, tem prioridade sobre a chave abaixo.</em></label>
    <label class="campo"><b>Chave de API do Gemini — só para teste</b>
      <input type="password" id="aKey" value="${esc(S.cfg.apiKey)}" placeholder="AIza…" autocomplete="off">
      <em>Fica salva apenas neste navegador. Nunca publique uma versão do site com este campo preenchido.</em></label>
    <label class="campo"><b>Modelo</b>
      <select id="aModelo">
        ${['gemini-3.5-flash','gemini-3.7-flash','gemini-3.5-flash-lite','gemini-3.6-flash'].map(m=>
          `<option ${S.cfg.modelo===m?'selected':''}>${m}</option>`).join('')}
      </select>
      <em>Flash-lite custa menos; 3.7-flash responde melhor em questões difíceis.</em></label>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap">
      <button class="btn" id="aSalvarIA">Salvar configuração</button>
      <button class="btn s" id="aTestar">Testar o assistente</button></div>
    <p id="aResultado" style="margin-top:1rem;font-size:.92rem"></p></section>`;

  h += `<section class="secao"><h2>Seus dados de estudo</h2>
    <p class="subtexto">Tudo fica salvo neste navegador, neste dispositivo. Limpar os dados do navegador apaga o progresso.</p>
    <div class="tabwrap"><table><tbody>
      <tr><td>Questões respondidas</td><td class="n">${S.respondidas}</td></tr>
      <tr><td>Simulados concluídos</td><td class="n">${S.hist.length}</td></tr>
      <tr><td>XP acumulado</td><td class="n">${S.xp.toLocaleString('pt-BR')}</td></tr>
      <tr><td>Erros pendentes</td><td class="n">${S.erros.length}</td></tr>
      <tr><td>Flashcards revisados</td><td class="n">${S.flash.length}</td></tr>
    </tbody></table></div>
    <div style="display:flex;gap:.6rem;margin-top:1.2rem;flex-wrap:wrap">
      <button class="btn s" id="aExportar">Exportar progresso</button>
      <button class="btn s" id="aZerar">Apagar tudo</button>
      <button class="btn s" id="aSair">Sair da conta</button></div></section>`;

  POS_RENDER=()=>{
    $('#aSalvar').onclick=()=>{ S.aluno=$('#aAluno').value.trim(); S.prova=$('#aProva').value; salvar(); render(); };
    $('#aSalvarIA').onclick=()=>{
      S.cfg.endpoint=$('#aEnd').value.trim(); S.cfg.apiKey=$('#aKey').value.trim(); S.cfg.modelo=$('#aModelo').value;
      salvar(); $('#aResultado').innerHTML='Configuração salva.';
    };
    $('#aTestar').onclick=async ()=>{
      S.cfg.endpoint=$('#aEnd').value.trim(); S.cfg.apiKey=$('#aKey').value.trim(); S.cfg.modelo=$('#aModelo').value; salvar();
      const el=$('#aResultado'); el.textContent='Testando…';
      try{
        const t=await perguntarIA('Responda apenas: assistente funcionando.',null);
        el.innerHTML = t? 'Funcionando. Resposta recebida: <b>'+esc(t.slice(0,120))+'</b>' : 'Nenhum caminho disponível. Preencha o endpoint ou a chave.';
      }catch(e){ el.innerHTML='Falhou: '+esc(e.message); }
    };
    $('#aExportar').onclick=async ()=>{
      const nome='meu-progresso-'+hoje()+'.json', dados=JSON.stringify(S,null,2);
      /* hospedado no Claude, o download passa pela permissão do visitante;
         em hospedagem própria, o link comum resolve. */
      try{
        if(window.claude && window.claude.use){
          const dl = await window.claude.use('downloads');
          if(dl){ await dl.save({filename:nome,data:dados}); return; }
        }
      }catch(e){ /* recusado ou indisponível: cai para o link comum */ }
      const b=new Blob([dados],{type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(b);
      a.download=nome; a.click(); URL.revokeObjectURL(a.href);
    };
    $('#aZerar').onclick=()=>{
      if(!confirm('Apagar todo o progresso, XP, medalhas e caderno de erros? Não há como desfazer.')) return;
      const u=S.usuario; S=vazio(); S.entrou=true; S.usuario=u; salvar(); ir('painel');
    };
    $('#aSair').onclick=()=>{ if(confirm('Sair da conta? Seu progresso continua salvo neste navegador.')) sair(); };
  };
  return h;
}

/* ============================================================
   QUESTÃO DO HERÓI, NA PÁGINA DE VENDAS
   ============================================================ */
const HEROI={q:BANCO[0],resp:null};
function desenharHeroi(){
  const alvo=$('#heroiQ'); if(!alvo) return;
  alvo.outerHTML = cartaoQuestao(HEROI.q,HEROI.resp,'heroi').replace('<div class="questao"','<div class="questao" id="heroiQ"');
  ligarCartao('heroi');
}

/* ============================================================
   INÍCIO
   ============================================================ */
desenharHeroi();
if(S.entrou) abrirApp();
