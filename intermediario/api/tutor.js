/* ============================================================
   Intermediário do assistente de estudos — função serverless
   ------------------------------------------------------------
   Para que isto existe: a chave da API do Gemini NÃO pode ficar
   dentro do site. Qualquer aluno que abra o código-fonte da página
   veria a chave e poderia usá-la — e a cobrança cairia na sua conta.
   Esta função fica no servidor, guarda a chave numa variável de
   ambiente e é a única coisa que fala com o Google.

   Formato esperado pelo site:
     POST  { "prompt": "...", "modelo": "gemini-3.5-flash" }
     200   { "texto": "resposta do assistente" }

   Publicação na Vercel (caminho mais curto, plano gratuito serve):
     1. Suba este repositório para o GitHub.
     2. Em vercel.com, importe o repositório, apontando a raiz do
        projeto para a pasta `intermediario/`.
     3. Em Settings > Environment Variables, crie:
          GEMINI_API_KEY   = a sua chave
          ORIGENS_PERMITIDAS = https://seudominio.com.br
     4. Depois do deploy, o endereço será algo como
          https://seu-projeto.vercel.app/api/tutor
        Cole esse endereço no campo "Endpoint do intermediário",
        dentro de Ajustes, na plataforma.
   ============================================================ */

/* Quantas perguntas um mesmo visitante pode fazer por janela de tempo.
   Evita que alguém descubra o endereço e consuma a sua cota. */
const LIMITE_POR_JANELA = 20;
const JANELA_MS = 10 * 60 * 1000;
const TAMANHO_MAXIMO_PROMPT = 8000;
const MODELOS_PERMITIDOS = [
  'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'
];

/* Contador em memória. Zera a cada reinício da função, o que é
   aceitável para começar. Em escala, troque por Upstash Redis ou
   pelo KV da sua hospedagem. */
const balcao = new Map();

function excedeuLimite(ip) {
  const agora = Date.now();
  const registro = balcao.get(ip) || { contagem: 0, reinicia: agora + JANELA_MS };
  if (agora > registro.reinicia) { registro.contagem = 0; registro.reinicia = agora + JANELA_MS; }
  registro.contagem++;
  balcao.set(ip, registro);
  if (balcao.size > 5000) balcao.clear();
  return registro.contagem > LIMITE_POR_JANELA;
}

function origemPermitida(origem) {
  const lista = (process.env.ORIGENS_PERMITIDAS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!lista.length) return '*';                 // sem configuração, aceita qualquer origem
  return lista.includes(origem) ? origem : null;
}

export default async function handler(req, res) {
  const origem = origemPermitida(req.headers.origin || '');
  if (origem) {
    res.setHeader('Access-Control-Allow-Origin', origem);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Use POST.' });
  if (!origem) return res.status(403).json({ erro: 'Origem não autorizada.' });

  const chave = process.env.GEMINI_API_KEY;
  if (!chave) return res.status(500).json({ erro: 'GEMINI_API_KEY não configurada no servidor.' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido';
  if (excedeuLimite(ip)) {
    return res.status(429).json({ erro: 'Muitas perguntas em pouco tempo. Tente de novo daqui a alguns minutos.' });
  }

  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch { corpo = {}; } }
  const prompt = (corpo && corpo.prompt || '').toString();
  if (!prompt.trim()) return res.status(400).json({ erro: 'Nada para perguntar.' });
  if (prompt.length > TAMANHO_MAXIMO_PROMPT) return res.status(413).json({ erro: 'Pergunta longa demais.' });

  const modelo = MODELOS_PERMITIDOS.includes(corpo.modelo) ? corpo.modelo : MODELOS_PERMITIDOS[0];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${encodeURIComponent(chave)}`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 900 }
      })
    });

    if (!r.ok) {
      const detalhe = await r.text();
      console.error('Gemini respondeu', r.status, detalhe.slice(0, 400));
      // Nunca devolva o corpo do erro ao navegador: ele pode conter a chave.
      return res.status(502).json({ erro: 'O assistente não respondeu agora. Tente de novo.' });
    }

    const dados = await r.json();
    const candidato = dados.candidates && dados.candidates[0];
    const texto = ((candidato && candidato.content && candidato.content.parts) || [])
      .map(p => p.text || '').join('').trim();

    if (!texto) return res.status(200).json({ texto: 'Não consegui formular uma resposta para esta pergunta. Tente reformulá-la.' });
    return res.status(200).json({ texto });

  } catch (e) {
    console.error('Falha ao chamar o Gemini:', e);
    return res.status(502).json({ erro: 'O assistente não respondeu agora. Tente de novo.' });
  }
}
