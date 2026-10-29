/* ================= v3.1: BUSCA INTELIGENTE, VOLTAR AO TOPO E TOUR COMPLETO ================= */

/* ---------- busca que entende palavras parecidas ---------- */
const STOP = new Set('a o as os de da do das dos e em no na nos nas um uma uns umas para pra por com como que qual quais meu minha meus minhas eu quero queria fazer faco faço onde fica tem ter ser e é se sobre ao aos à às mais menos the of to and is how what my i'.split(' ').map(w => w.normalize('NFD').replace(/[̀-ͯ]/g,'')));
const SRCH_SYN = {
  vida:['contador','life','pontos'], contador:['vida','life'], life:['vida'],
  baralho:['deck','lista'], grimorio:['deck'], deck:['baralho','lista'], lista:['deck'],
  montar:['construir','criar','gerar'], criar:['gerar','construir','montar'], gerar:['criar','montar'], construir:['montar','criar'], novo:['criar','zero'],
  preco:['orcamento','custo','valor','reais','comprar','ligamagic'], orcamento:['preco','custo','comprar'], custo:['preco','orcamento'], valor:['preco'], comprar:['preco','orcamento','ligamagic','fisicas'], barato:['orcamento','preco','comuns','economizar'], dinheiro:['preco'], reais:['preco'], caro:['preco'],
  arena:['mtga','online'], mtga:['arena'], importar:['colar','exportar','trazer','lista'], exportar:['importar','copiar'], colar:['importar'], planilha:['excel','csv'], excel:['planilha','csv'],
  celular:['instalar','aplicativo','app'], app:['aplicativo','instalar'], aplicativo:['app','instalar'],
  voar:['flying','voador'], voador:['voar','flying'], flying:['voar'], atropelar:['trample'], trample:['atropelar'],
  regra:['manual','regras'], regras:['manual'], manual:['regras'], ajuda:['tour','guia','tutorial'], tutorial:['tour','guia'], tour:['tutorial','ajuda'],
  comandante:['commander','edh','brawl'], commander:['comandante','edh'], edh:['commander'], brawl:['commander','arena'], padrao:['standard'], standard:['padrao'],
  mulligan:['mao','inicial'], mao:['mulligan','inicial'], combo:['sinergia','combos'], sinergia:['combo'],
  imprimir:['proxies','proxy','pdf'], proxy:['proxies','imprimir'], pdf:['imprimir'],
  compartilhar:['link','whatsapp','enviar'], whatsapp:['compartilhar','link'], enviar:['compartilhar'], link:['compartilhar'],
  salvar:['guardar','meus','versoes'], guardar:['salvar','meus'], versao:['versoes','salvar'],
  colecao:['cartas','tenho'], tenho:['colecao'], sideboard:['reserva','side'], reserva:['sideboard'], side:['sideboard'],
  treinar:['treino','praticar'], praticar:['treino','licoes'], jogar:['partida','duelo','computador'], partida:['duelo','jogar'], computador:['duelo','ia','bot'], bot:['computador'], ia:['computador'],
  torneio:['grupo','suico','mesas'], amigos:['grupo','torneio'], juiz:['arbitro'], arbitro:['juiz'], duvida:['arbitro','juiz','regras'],
  pilha:['stack','responder'], stack:['pilha'], terreno:['terrenos','land','mana'], land:['terreno'], mana:['terreno','base','curva'], curva:['mana','analisador'],
  cor:['cores','roda'], cores:['cor'], otimizar:['melhorar','trocas'], melhorar:['otimizar','trocas'], trocas:['melhorar','sugestoes'],
  analisar:['analisador','analise'], analise:['analisador','analisar'], probabilidade:['chance','comprar'], chance:['probabilidade'],
  curinga:['wildcard','curingas'], wildcard:['curinga'], draft:['limitado','booster'], limitado:['draft'],
  licao:['licoes','aula'], aula:['licoes'], quiz:['perguntas','teste'], teste:['quiz','testar'], pergunta:['quiz'],
  cemiterio:['graveyard'], ficha:['fichas','token'], token:['ficha'], carta:['cartas','card'], card:['carta'],
  ataque:['combate','atacar'], atacar:['combate'], bloquear:['bloqueios','combate'], combate:['calculadora','bloqueios'],
  tema:['escuro','claro'], escuro:['tema'], letra:['fonte','ajustes'], fonte:['letra']
};
const nrm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const stem = w => w.length > 4 ? w.replace(/oes$|aes$/,'ao').replace(/ns$/,'m').replace(/is$/,'l').replace(/es$/,'').replace(/s$/,'') : w.replace(/s$/,'');
const stoks = s => nrm(s).replace(/<[^>]+>/g,' ').split(/[^a-z0-9+]+/).filter(w => w && !STOP.has(w)).map(stem);
function lev(a, b, max){
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({length:b.length+1}, (_,i) => i);
  for (let i = 1; i <= a.length; i++) { const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1)); if (cur[j] < best) best = cur[j]; }
    if (best > max) return max + 1; prev = cur; }
  return prev[b.length];
}
const strip = h => String(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
let SIDX = null;
function goFind(go, text){
  go();
  if (!text) return;
  let tries = 0;
  const look = () => {
    const t = nrm(text); const els = $$('main summary, main h3, main h4, main b, main .kw-n, main button, main li, main .q-t, main td');
    const el = els.find(e => e.offsetParent !== null && nrm(e.textContent).includes(t));
    if (!el) { if (++tries < 8) setTimeout(look, 120); return; }
    const d = el.closest('details'); if (d) d.open = true;
    if (el.tagName === 'SUMMARY' && el.parentElement && !el.parentElement.open) el.click();
    el.scrollIntoView({block:'center', behavior:'smooth'}); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 2200);
  };
  setTimeout(look, 150);
}
function buildIndex(){
  const I = [];
  const add = (t, d, cat, kw, go) => I.push({t, d: strip(d).slice(0, 180), cat, go, T: stoks(t), K: stoks(kw || ''), D: stoks(strip(d).slice(0, 400))});
  FEATS.forEach(f => add(f[0], f[1], 'Ferramenta', f[2], f[3]));
  Object.entries(SECTIONS).forEach(([v, D]) => { D.tabs.forEach(([k, l]) => { if (!FEATS.some(f => nrm(f[0]) === nrm(l))) add(l, `${D.h}`, 'Ferramenta', D.h, () => { if (D.kind === 'deck') deckTab = k; else trTab = k; if (k === 'calc') return show('combate'); show(v); }); }); });
  MANUAL.forEach(m => add(m.t, m.h, 'Regra', 'manual regras', () => goFind(() => { rulesTab = 'manual'; show('regras'); }, m.t)));
  KW.forEach(k => add(`${k.pt} (${k.en})`, `${k.x} ${k.tip || ''}`, 'Habilidade', `${k.en} ${k.cat || ''} habilidade palavra-chave`, () => goFind(() => { rulesTab = 'hab'; show('regras'); }, k.pt)));
  if (typeof PHASES !== 'undefined') PHASES.forEach(p => { const n = p.n || p.t || p.name; if (n) add(n, p.d || p.x || '', 'Turno', 'turno fase etapa', () => goFind(() => { rulesTab = 'turno'; show('regras'); }, n)); });
  LESSONS.forEach(l => add(`Lição ${l.id}: ${l.title}`, l.tag || '', 'Lição', `licao aula ${l.tag || ''}`, () => { acad.lesson = l.id; acad.step = 0; acad.ans = null; show('academia'); }));
  FORMATS.forEach(f => add(f.n, `${f.tag || ''} · ${f.deck || ''} · vida ${f.life || ''} · ${f.where || ''}`, 'Formato', 'formato', () => goFind(() => { fmtTab = ({commander:'commander', padrao:'padrao'})[f.k] || 'outros'; show('formatos'); }, f.n.split(' (')[0])));
  JUDGE.forEach(j => add(j[1], j[2], 'Árbitro de bolso', `${j[0]} arbitro juiz duvida`, () => goFind(() => { trTab = 'juiz'; show('mesa'); }, j[1].slice(0, 40))));
  QUIZ.forEach(q => add(q.q, q.e || '', 'Pergunta do quiz', `quiz ${q.c}`, () => show('quiz')));
  return I;
}
function searchIdx(q){
  if (!SIDX) SIDX = buildIndex();
  const words = stoks(q); if (!words.length) return {res:[], extra:[]};
  const extra = new Set();
  const scoreTok = (w, arr, wt) => { let best = 0;
    for (const x of arr) { if (x === w) return wt; if (w.length >= 3 && x.startsWith(w)) best = Math.max(best, wt * .8); else if (w.length >= 4) { const m = w.length >= 8 ? 2 : 1; if (lev(w, x, m) <= m) best = Math.max(best, wt * .6); } }
    return best; };
  const res = [];
  for (const e of SIDX) {
    let s = 0, hit = 0;
    for (const w of words) {
      let b = Math.max(scoreTok(w, e.T, 6), scoreTok(w, e.K, 4), scoreTok(w, e.D, 1.5));
      for (const sy of (SRCH_SYN[w] || SRCH_SYN[stem(w)] || [])) { const v = Math.max(scoreTok(stem(sy), e.T, 6), scoreTok(stem(sy), e.K, 4), scoreTok(stem(sy), e.D, 1.5)) * .7; if (v > b) { b = v; extra.add(sy); } }
      if (b) { s += b; hit++; }
    }
    if (hit && hit >= Math.ceil(words.length / 2)) res.push({e, s: s + (hit === words.length ? 3 : 0) + (e.cat === 'Ferramenta' ? 1 : 0)});
  }
  res.sort((a,b) => b.s - a.s);
  return {res: res.slice(0, 24).map(r => r.e), extra:[...extra].slice(0, 5)};
}
let gsT = null, gsSel = -1, gsItems = [];
function gsDraw(q){
  const box = $('#gsRes'); if (!box) return;
  if (!q.trim()) { box.hidden = true; return; }
  const {res, extra} = searchIdx(q);
  const localCards = Object.keys(CARDS).filter(n => { const a = nrm(n), b = nrm(q.trim()); return b.length >= 3 && (a.includes(b) || (b.length >= 5 && lev(b, a.slice(0, b.length), 1) <= 1)); }).slice(0, 4);
  gsItems = [];
  const groups = {}; res.forEach(e => (groups[e.cat] = groups[e.cat] || []).push(e));
  let html = extra.length ? `<p class="gs-note">Também procurei por: ${extra.map(esc).join(', ')}</p>` : '';
  const order = ['Ferramenta','Regra','Habilidade','Turno','Formato','Lição','Árbitro de bolso','Pergunta do quiz'];
  order.filter(c => groups[c]).forEach(c => { html += `<div class="gs-g"><span class="gs-c">${c === 'Ferramenta' ? 'Ferramentas' : c === 'Regra' ? 'Regras' : c === 'Habilidade' ? 'Habilidades' : c === 'Lição' ? 'Lições' : c === 'Formato' ? 'Formatos' : c === 'Pergunta do quiz' ? 'Quiz' : c}</span>${groups[c].slice(0, c === 'Pergunta do quiz' ? 2 : 6).map(e => { gsItems.push(e.go); return `<button class="gs-i" data-gi="${gsItems.length - 1}"><b>${esc(e.t)}</b>${e.d ? `<span>${esc(e.d)}</span>` : ''}</button>`; }).join('')}</div>`; });
  html += `<div class="gs-g" id="gsCards">${localCards.length ? `<span class="gs-c">Cartas</span>${localCards.map(n => { gsItems.push(() => openCard(n)); return `<button class="gs-i" data-gi="${gsItems.length - 1}"><b>${esc(n)}</b><span>Ver a carta</span></button>`; }).join('')}` : ''}</div>`;
  if (!res.length && !localCards.length) html += `<p class="gs-empty">Nada encontrado para "${esc(q)}". Tente outra palavra, como "vida", "comandante", "preço" ou o nome de uma carta.</p>`;
  box.innerHTML = html; box.hidden = false; gsSel = -1; gsBind();
  gsPlace();
  // cartas do Scryfall (em português ou inglês)
  clearTimeout(gsT);
  if (q.trim().length >= 3) gsT = setTimeout(async () => {
    try { const r = await fetch('https://api.scryfall.com/cards/autocomplete?include_multilingual=true&q=' + encodeURIComponent(q.trim())); if (!r.ok) return; const L = ((await r.json()).data || []).filter(n => !localCards.includes(n)).slice(0, 6); if (!L.length) return;
      const g = $('#gsCards'); if (!g || $('#gsQ').value !== q) return;
      const btns = L.map(n => { gsItems.push(async () => { await resolveCards([n], ()=>{}); const en = PTMAP[nrm(n)] || n; if (!cardData(en)) { const e = [{name:n, q:1}]; await resolveImport(e); openCard(e[0].en || n); } else openCard(en); }); return `<button class="gs-i" data-gi="${gsItems.length - 1}"><b>${esc(n)}</b><span>Carta · Scryfall</span></button>`; }).join('');
      g.innerHTML = (g.innerHTML ? g.innerHTML : '<span class="gs-c">Cartas</span>') + btns; $('.gs-empty') && $('.gs-empty').remove(); gsBind();
    } catch(e) {}
  }, 260);
}
function gsPlace(){ const box = $('#gsRes'), g = $('.gsearch'); if (!box || !g) return; if (innerWidth <= 820) { const r = g.getBoundingClientRect(); const nav = $('.tabs') ? $('.tabs').getBoundingClientRect().top : innerHeight; box.style.top = (r.bottom + 6) + 'px'; box.style.maxHeight = Math.max(160, nav - r.bottom - 14) + 'px'; } else { box.style.top = ''; box.style.maxHeight = ''; } }
addEventListener('resize', () => { const b = $('#gsRes'); if (b && !b.hidden) gsPlace(); });
function gsBind(){ $$('[data-gi]').forEach(b => b.onmousedown = e => { e.preventDefault(); gsPick(+b.dataset.gi); }); }
function gsPick(i){ const f = gsItems[i]; gsClose(); if (f) { f(); } }
function gsClose(){ const b = $('#gsRes'); if (b) b.hidden = true; const q = $('#gsQ'); if (q) q.blur(); }
(function(){
  const q = $('#gsQ'); if (!q) return;
  q.addEventListener('input', () => gsDraw(q.value));
  q.addEventListener('focus', () => { if (q.value.trim()) gsDraw(q.value); });
  q.addEventListener('blur', () => setTimeout(() => { const b = $('#gsRes'); if (b && document.activeElement !== q) b.hidden = true; }, 150));
  q.addEventListener('keydown', e => {
    const bs = $$('#gsRes [data-gi]');
    if (e.key === 'ArrowDown' && bs.length) { gsSel = (gsSel + 1) % bs.length; bs.forEach((b,i) => b.classList.toggle('sel', i === gsSel)); bs[gsSel].scrollIntoView({block:'nearest'}); e.preventDefault(); }
    else if (e.key === 'ArrowUp' && bs.length) { gsSel = (gsSel - 1 + bs.length) % bs.length; bs.forEach((b,i) => b.classList.toggle('sel', i === gsSel)); bs[gsSel].scrollIntoView({block:'nearest'}); e.preventDefault(); }
    else if (e.key === 'Enter') { const b = bs[gsSel >= 0 ? gsSel : 0]; if (b) { e.preventDefault(); gsPick(+b.dataset.gi); } }
    else if (e.key === 'Escape') gsClose();
  });
  const x = $('#gsX'); if (x) x.onclick = () => { q.value = ''; gsClose(); q.focus(); };
})();
openSearch = function(){ const q = $('#gsQ'); if (!q) return; window.scrollTo({top:0}); q.focus(); if (q.value) gsDraw(q.value); };

/* ---------- voltar ao topo ---------- */
(function(){
  const b = document.createElement('button'); b.id = 'toTop'; b.className = 'to-top'; b.setAttribute('aria-label', 'Voltar ao topo'); b.title = 'Voltar ao topo';
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg><span>Topo</span>';
  b.onclick = () => window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  document.body.appendChild(b);
  let raf = 0;
  const upd = () => { raf = 0; const y = scrollY, h = document.documentElement.scrollHeight - innerHeight; b.classList.toggle('on', y > 500); b.classList.toggle('end', h > 600 && y > h - 120); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, {passive:true});
})();

/* ---------- tour completo ---------- */
const AREA_TXT = {
  inicio:'A página inicial mostra seu nível, a trilha do zero à mesa, o desafio do dia, as novidades e o Mapa da Academia.',
  regras:'Tudo sobre as regras do jogo, do básico ao avançado.', academia:'Doze lições práticas: você lê a mesa, decide a jogada e vê o resultado.', quiz:'Perguntas sobre regras, formatos, mesa e lore, sempre com explicação.',
  formatos:'Os jeitos de jogar Magic e como montar um deck para cada um.'
};
const TAB_TXT = {
  // regras
  simples:'Primeiros passos: o jogo explicado em linguagem simples, para quem nunca jogou.', manual:'O manual completo com busca: objetivo, cores, tipos de carta, zonas, mana, pilha e combate.', hab:'As palavras-chave (voar, atropelar, toque mortífero…) com exemplo de carta real e link para praticar.', turno:'As fases do turno, passo a passo, e o que pode acontecer em cada uma.', anat:'O que significa cada parte de uma carta: nome, custo, tipo, texto, poder e resistência, raridade.', simb:'Os símbolos de mana e de habilidades que aparecem nas cartas.',
  // formatos
  geral:'Comparação de todos os formatos: tamanho do deck, vida, custo e onde jogar.', commander:'Commander em detalhe: regras, comandantes populares e como montar.', padrao:'O formato Padrão: rotação, coleções válidas e decks iniciais.', outros:'Pioneer, Modern, Pauper, Legacy e outros.', arena:'Guia do MTG Arena no PC e no celular: instalação, modos de jogo e curingas.', colecoes:'As coleções mais recentes de Magic.', montar:'O montador guiado: escolha o formato e o estilo e receba uma receita de deck.', mesa:'Etiqueta de mesa: como se portar e o que os veteranos esperam.',
  // treino
  surv:'Jogo de ação: você é um planeswalker e suas mágicas disparam sozinhas. Desvie das criaturas, colete mana e suba de nível escolhendo cartas com habilidades reais do Magic. Sobreviva 10 minutos.',
  duelo:'Partida contra o computador com mana colorida, em três níveis, mais a campanha de sete capítulos e o modo para dois jogadores.', sim:'Simulador: veja em que turno um deck costuma vencer, jogando sozinho várias vezes.', puz:'Quebra-cabeças "vença neste turno" para treinar raciocínio.', criar:'Crie o seu quebra-cabeça e mande o link para os amigos.', bloq:'Treino de bloqueios: escolha a melhor defesa.', ler:'Ler a mesa: identifique ameaças e prioridades.', mull:'Mulligan: decida se fica com a mão inicial.', pilha:'A pilha: em que ordem as mágicas se resolvem.', draft:'Simulação de Draft: escolha cartas de pacotes como num evento de loja.',
  // na mesa
  vida:'Contador de vida para 2 a 6 jogadores, com veneno e dano de comandante.', grupo:'Grupo de amigos: sorteio de mesas e torneio suíço com pontuação.', juiz:'Árbitro de bolso: respostas para as dúvidas mais comuns na mesa.', calc:'Calculadora de combate: monte o ataque e o bloqueio e veja o resultado.',
  // construir
  gerar:'Criar deck do zero: escolha o tipo de jogo, responda perguntas e receba o deck pronto, com lista para o Arena e curingas necessários.', otimizar:'Melhorar meu deck: diagnóstico, trocas sugeridas para aceitar ou recusar e a lista final para o Arena.', entenda:'Entenda seu deck: estilo, função de cada carta, sinergias, combos e como jogar com ele.', side:'Sideboard: 15 cartas de reserva e o guia do que entra e sai contra cada tipo de oponente.', testar:'Testar no duelo: leve o seu deck para a partida contra o computador.', guia:'Guia de construção: as regras de ouro para montar um bom deck.', desafios:'Desafios de construção para treinar a montagem de decks.',
  // analisar
  analise:'Analisador: curva de mana, cores, tipos de carta e recomendação de terrenos.', mao:'Mão inicial: compre 7 cartas do seu deck e treine o mulligan.', prob:'Probabilidade: a chance de ter uma carta na mão até certo turno.', base:'Base de mana: quantos terrenos de cada cor usar.', sugestoes:'Sugestões de cartas para o comandante e para o deck.', comparar:'Compare duas listas e veja o que mudou.',
  // meus decks
  biblioteca:'Meus decks: decks guardados com versões, para comparar e voltar atrás.', importar:'Importar: cole do Arena (em português ou inglês), envie uma planilha ou monte carta a carta. O resultado traz o orçamento das cartas físicas.', link:'Compartilhar por link: mande o deck no WhatsApp.', proxies:'Imprimir proxies: folhas A4 com as cartas no tamanho real para testar na mesa.', preco:'Preço em reais e lista de compras das cartas físicas, com links da LigaMagic.',
  // arena
  acoll:'Coleção do Arena: cadastre as cartas que você tem; o gerador e o otimizador preferem as suas.', famosos:'Decks famosos, antigos e novos, com a história de cada um.', colecao:'Coleção física: as cartas que você tem em casa e quais decks consegue montar.', desejos:'Lista de desejos: cartas que você quer conseguir.'
};
TAB_TXT.arena_hub = 'Central do Arena: leve o deck para o Arena, entenda curingas e os modos de jogo.';
function tourAll(){
  const T = [
    {v:'inicio', s:'.brand', t:'Bem-vindo à Academia', d:'Este é o tour completo: passa por todas as áreas e ferramentas. Use as setas para avançar ou voltar, e "Sair" quando quiser. Dá para retomar pelo botão "?" no topo.'},
    {v:'inicio', s:'.gsearch', t:'Pesquise qualquer coisa', d:'Digite o que procura: uma regra, uma carta (em português ou inglês), uma ferramenta. A busca entende palavras parecidas e erros de digitação: "comandante" acha Commander, "preco" acha Preço em reais.'},
    {v:'inicio', s:'.tabs', t:'O menu', d:'As onze áreas da Academia, em forma de mão de cartas. A carta levantada é a área aberta. No celular, o menu fica embaixo da tela.'},
    {v:'inicio', s:'.statrow', t:'Seu progresso', d:'Nível, lições, quiz e conquistas. Você ganha experiência usando as ferramentas.'},
    {v:'inicio', s:'.trail', t:'A trilha do zero à mesa', d:'Siga as etapas na ordem para aprender a jogar e montar decks.'},
    {v:'inicio', s:'.amap', t:'Mapa da Academia', d:'Todas as ferramentas num lugar só. Toque em qualquer uma para ir direto.'}
  ];
  const rT = [['simples'],['manual'],['hab'],['turno'],['anat'],['simb']];
  T.push({v:'regras', s:'#v-regras .view-head', t:'Regras', d:AREA_TXT.regras});
  rT.forEach(([k]) => T.push({v:'regras', pre:() => { rulesTab = k; }, s:`[data-rt="${k}"]`, t:'Regras', d:TAB_TXT[k]}));
  T.push({v:'academia', s:'#lessonList', t:'Lições', d:AREA_TXT.academia});
  T.push({v:'quiz', s:'#v-quiz .panel', t:'Quiz', d:AREA_TXT.quiz});
  ['treino','mesa','construir','decks','meus','arena'].forEach(v => { const D = SECTIONS[v];
    T.push({v, pre:() => { if (D.kind === 'deck') deckTab = D.tabs[0][0]; else trTab = D.tabs[0][0]; }, s:`#v-${v} .view-head`, t:D.h, d:D.p});
    if (D.kind === 'deck' && v !== 'arena') T.push({v, s:`#v-${v} .deckbar`, t:'Deck em uso', d:'Esta barra mostra qual deck as ferramentas desta área estão usando. Troque de deck pela lista ou salve o deck atual em Meus decks.'});
    D.tabs.forEach(([k,l]) => { if (k === 'calc') { T.push({v, s:`[data-tt="calc"]`, t:`${D.h}: ${l}`, d:TAB_TXT.calc}); return; }
      T.push({v, pre:() => { if (D.kind === 'deck') deckTab = k; else trTab = k; }, s:`[data-${D.kind === 'deck' ? 'dt' : 'tt'}="${k}"]`, t:`${D.h}: ${l}`, d: TAB_TXT[k === 'arena' ? 'arena_hub' : k] || l}); }); });
  T.push({v:'formatos', pre:() => { fmtTab = 'geral'; }, s:'#v-formatos .view-head', t:'Formatos', d:AREA_TXT.formatos});
  [['geral'],['commander'],['padrao'],['outros'],['arena'],['colecoes'],['montar'],['mesa']].forEach(([k]) => T.push({v:'formatos', pre:() => { fmtTab = k; }, s:`[data-ft="${k}"]`, t:'Formatos', d:TAB_TXT[k] && k !== 'mesa' && k !== 'arena' && k !== 'commander' ? TAB_TXT[k] : ({mesa:'Etiqueta de mesa: como se portar e o que os veteranos esperam.', arena:'Guia do MTG Arena no PC e no celular: instalação, modos de jogo e curingas.', commander:'Commander em detalhe: regras, comandantes populares e como montar.'})[k] || TAB_TXT[k]}));
  T.push({v:'inicio', s:'#btnSet', t:'Ajustes', d:'Tamanho da letra, alto contraste, modo leve para celulares simples, tema claro ou escuro, sons, nomes das cartas em português e histórico de versões.'});
  T.push({v:'inicio', s:'.foot-line', t:'Rodapé', d:'Créditos e o link para as atualizações de cada versão. Em páginas longas, o botão "Topo" no canto da tela leva de volta ao início.'});
  T.push({v:'inicio', s:'#btnTour', t:'Pronto!', d:'Você conheceu toda a Academia. O tour fica sempre no botão "?". Boa jornada, planeswalker!'});
  return T;
}
let tourList = [];
function areaTour(v){
  const all = tourAll(); const L = all.filter(s => s.v === v && s.s !== '.brand');
  return L.length ? L : [{v, s:`#v-${v} .view-head`, t:'Esta área', d:AREA_TXT[v] || ''}];
}
startTour = function(kind){
  if (kind === 'full') { tourList = tourAll(); tourI = 0; return drawTour(); }
  if (kind === 'quick') { tourList = TOUR; tourI = 0; return drawTour(); }
  if (kind && kind.area) { tourList = areaTour(kind.area); tourI = 0; return drawTour(); }
  const cv = currentView === 'combate' ? 'treino' : currentView;
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="stack-v" style="grid-column:1/-1">
    <span class="eyebrow">Tour pela Academia</span><h2>Como você quer conhecer a plataforma?</h2>
    <div class="pick" style="grid-template-columns:1fr">
      <button data-tk="full"><b>Tour completo</b><small>Todas as áreas e todas as ferramentas, uma a uma (${tourAll().length} passos). Dá para sair e voltar quando quiser.</small></button>
      <button data-tk="quick"><b>Tour rápido</b><small>As áreas principais em ${TOUR.length} passos.</small></button>
      ${cv && cv !== 'inicio' ? `<button data-tk="area"><b>Só esta área</b><small>Explica as ferramentas da área aberta agora.</small></button>` : ''}
    </div></div>`;
  $('#modal').hidden = false;
  $$('[data-tk]').forEach(b => b.onclick = () => { $('#modal').hidden = true; const k = b.dataset.tk; startTour(k === 'area' ? {area: cv} : k); });
};
drawTour = function(){
  let ov = $('#tour'); if (!ov) { ov = document.createElement('div'); ov.id = 'tour'; document.body.append(ov); }
  const L = tourList.length ? tourList : TOUR; const st = L[tourI];
  if (st.pre) st.pre();
  if (currentView !== st.v || st.pre) show(st.v);
  ov.hidden = false;
  requestAnimationFrame(() => {
    const el = $(st.s); if (el && el.scrollIntoView) el.scrollIntoView({block:'center'});
    setTimeout(() => {
      const r = el ? el.getBoundingClientRect() : {left:innerWidth/2-60, top:innerHeight/2-30, width:120, height:60};
      const pad = 6, top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), w = Math.min(innerWidth - 8 - left, r.width + pad*2), h = Math.min(r.height + pad*2, innerHeight * .6);
      const below = top + h + 240 < innerHeight, above = top > 260;
      const pct = Math.round((tourI + 1) / L.length * 100);
      ov.innerHTML = `<div class="tour-hole" style="top:${top}px;left:${left}px;width:${w}px;height:${h}px"></div>
        <div class="tour-card" role="dialog" aria-label="Tour" style="${below ? `top:${Math.min(innerHeight-250, top+h+10)}px` : above ? `bottom:${Math.min(innerHeight-260, Math.max(10, innerHeight-top+10))}px` : 'bottom:16px'}">
          <div class="tour-prog"><i style="width:${pct}%"></i></div>
          <span class="eyebrow">Passo ${tourI+1} de ${L.length}</span><h3>${st.t}</h3><p>${st.d}</p>
          <div class="row-h" style="justify-content:space-between"><button class="btn small" id="tSkip">Sair</button><span class="row-h"><button class="btn small" id="tPrev" ${tourI===0?'disabled':''} aria-label="Voltar">←</button><button class="btn small primary" id="tNext2">${tourI === L.length-1 ? 'Concluir' : 'Próximo →'}</button></span></div></div>`;
      $('#tSkip').onclick = endTour; $('#tPrev').onclick = () => { tourI--; drawTour(); };
      $('#tNext2').onclick = () => { if (tourI === L.length-1) { endTour(); if (!S.tourDone) { S.tourDone = true; addXP(20); save(); } if (L.length > 30 && !S.tourFull) { S.tourFull = true; addXP(40); save(); toast('Tour completo concluído! +40 XP'); } return; } tourI++; drawTour(); };
      $('#tNext2').focus({preventScroll:true});
    }, 280);
  });
};
document.addEventListener('keydown', e => { const ov = $('#tour'); if (!ov || ov.hidden) return; if (e.key === 'ArrowRight') { const b = $('#tNext2'); b && b.click(); } else if (e.key === 'ArrowLeft') { const b = $('#tPrev'); b && !b.disabled && b.click(); } else if (e.key === 'Escape') endTour(); });
/* botão "Explicar esta área" no topo de cada área */
function addAreaTour(v){
  v = v || currentView; if (!v || v === 'inicio' || v === 'combate') return;
  const h = $(`#v-${v} .view-head`); if (!h || $('.area-tour', h)) return;
  h.insertAdjacentHTML('beforeend', `<button class="btn small area-tour" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6"/><path d="M12 16.8h.01"/></svg>Explicar esta área</button>`);
  $('.area-tour', h).onclick = () => startTour({area: v});
}
(function(){ try { let r = 0; new MutationObserver(() => { if (r) return; r = requestAnimationFrame(() => { r = 0; addAreaTour(); }); }).observe($('main'), {childList:true, subtree:true}); } catch(e){} })();
