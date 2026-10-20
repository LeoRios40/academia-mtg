/* ================= NÚCLEO ================= */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const KEY = 'academiaPlaneswalker.v2';
const DEF = {done:{}, xp:0, quizBest:0, quizPerfect:false, calc:false, deck:false, hand:false, sound:true, theme:null, seen:{}, ach:[], firstTry:{}};
let S = Object.assign({}, DEF, (()=>{ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } })());
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }

/* aliases de busca em minúsculas */
const CARD_ALIAS = {};
function indexCards(){ for (const n in CARDS) CARD_ALIAS[n.toLowerCase()] = n; }
indexCards();
const cardData = n => CARDS[n] || CARDS[CARD_ALIAS[(n||'').toLowerCase()]] || null;
/* ===== imagens das cartas =====
   Pede as imagens em lote ao Scryfall (até 75 por pedido) e guarda os endereços.
   As imagens vêm de cards.scryfall.io, que não tem limite de pedidos. */
const IMGKEY = 'academiaPlaneswalker.img.v1';
let IMG = (()=>{ try { return JSON.parse(localStorage.getItem(IMGKEY)) || {}; } catch(e){ return {}; } })();
const IMGST = {mode:'lote', ok:0, fail:0, busy:false, warned:false, pending:new Set(), miss:new Set()};
const imgKey = n => (CARD_ALIAS[(n||'').toLowerCase()] || n || '').toLowerCase();
const scryImg = n => { const d = cardData(n); return (d && d.img) || IMG[imgKey(n)] || ''; };
function saveImg(){ try { localStorage.setItem(IMGKEY, JSON.stringify(IMG)); } catch(e){} }
function imgDone(el){ el.hidden = false; IMGST.ok++; }
function imgFail(el){
  IMGST.fail++; const n = el.getAttribute('data-img');
  if (IMGST.mode === 'lote' && n && IMG[imgKey(n)]) { delete IMG[imgKey(n)]; saveImg(); }
  el.remove();
  if (IMGST.fail >= 6 && IMGST.ok === 0 && !IMGST.warned) { IMGST.warned = true; toast('As imagens das cartas não carregaram. A rede pode estar bloqueando o site Scryfall. As cartas aparecem em versão desenhada.'); }
}
function fillImages(root){
  (root || document).querySelectorAll('img[data-img]:not([src])').forEach(el => {
    const n = el.getAttribute('data-img'), u = scryImg(n);
    if (u) el.src = u;
    else if (!IMGST.miss.has(imgKey(n))) { IMGST.pending.add(n); }
  });
  if (IMGST.pending.size) queueResolve();
}
let resolveT = null;
function queueResolve(){ clearTimeout(resolveT); resolveT = setTimeout(resolveImages, 250); }
async function resolveImages(){
  if (IMGST.busy) { queueResolve(); return; }
  const names = [...IMGST.pending]; IMGST.pending.clear(); if (!names.length) return;
  IMGST.busy = true;
  if (IMGST.mode === 'lote') {
    try {
      for (let i = 0; i < names.length; i += 75) {
        const chunk = names.slice(i, i+75);
        const r = await fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: chunk.map(name=>({name}))})});
        if (r.status === 429) { await new Promise(res=>setTimeout(res, 1500)); i -= 75; continue; }
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        (j.data||[]).forEach(c => {
          const u = (c.image_uris && c.image_uris.normal) || (c.card_faces && c.card_faces[0].image_uris && c.card_faces[0].image_uris.normal);
          if (!u) return;
          IMG[c.name.toLowerCase()] = u;
          if (c.card_faces) IMG[c.card_faces[0].name.toLowerCase()] = u;
          chunk.forEach(q => { if (q.toLowerCase() === c.name.toLowerCase() || (c.card_faces && q.toLowerCase() === c.card_faces[0].name.toLowerCase())) IMG[q.toLowerCase()] = u; });
        });
        (j.not_found||[]).forEach(nf => IMGST.miss.add((nf.name||'').toLowerCase()));
        await new Promise(res=>setTimeout(res, 120));
      }
      saveImg();
    } catch(e) {
      // sem acesso à API de lote: usa o endereço de imagem direto, com espaçamento entre pedidos
      IMGST.mode = 'direto';
    }
  }
  if (IMGST.mode === 'direto') {
    for (const n of names) if (!IMG[imgKey(n)]) IMG[imgKey(n)] = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(n)}&format=image&version=normal`;
    const els = [...document.querySelectorAll('img[data-img]:not([src])')];
    for (const el of els) { const u = scryImg(el.getAttribute('data-img')); if (u) { el.src = u; await new Promise(res=>setTimeout(res, 140)); } }
  }
  IMGST.busy = false;
  fillImages();
}
function imgStatus(){ return IMGST.ok ? `${IMGST.ok} imagens carregadas` : IMGST.fail ? 'imagens bloqueadas nesta rede' : 'aguardando'; }

/* ===== som ===== */
let AC;
function sfx(type){
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
    o.connect(g); g.connect(AC.destination);
    const P = {
      ok:['sine',520,880,.16,.25], no:['square',160,110,.12,.22], tap:['triangle',320,180,.12,.09],
      win:['sine',440,990,.18,.5], hit:['sawtooth',150,60,.16,.2]
    }[type] || ['sine',400,400,.1,.1];
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[4]);
    g.gain.setValueAtTime(P[3], t); g.gain.exponentialRampToValueAtTime(.001, t + P[4]);
    o.start(t); o.stop(t + P[4] + .02);
  } catch(e){}
}

/* ===== mana e texto ===== */
function manaSym(sym){
  const s = sym.toUpperCase();
  const col = {W:'var(--w)',U:'var(--u)',B:'var(--b)',R:'var(--r)',G:'var(--g)'};
  if (s === 'T') return `<span class="ms ms-T" title="Virar">↷</span>`;
  if (s === 'Q') return `<span class="ms ms-T" title="Desvirar">↶</span>`;
  if ('WUBRGC'.includes(s) && s.length === 1) return `<span class="ms ms-${s}">${s}</span>`;
  if (s.includes('/')) {
    const [a,b] = s.split('/');
    if (b === 'P') return `<span class="ms ms-${a}" title="Phyrexiano">ϕ</span>`;
    return `<span class="ms ms-H" style="--h1:${col[a]||'var(--c)'};--h2:${col[b]||'var(--c)'}">${esc(a)}</span>`;
  }
  return `<span class="ms ms-N">${esc(s)}</span>`;
}
const mana = cost => (cost||'').replace(/\{([^}]+)\}/g, (_, s) => manaSym(s));
function fmt(s){
  return (s||'')
    .replace(/\[\[([^\]]+)\]\]/g, (_, n) => `<button class="cref" data-card="${esc(n)}">${esc(n)}</button>`)
    .replace(/\{([^}]+)\}/g, (_, s) => manaSym(s));
}

/* ===== carta ===== */
function cardHTML(name, o={}){
  const d = cardData(name) || {k:'?',c:'',t:'Carta',x:'',col:'C'};
  const cls = ['mcard', o.st||'', o.dead?'dead':'', o.cls||''].join(' ');
  const glyph = d.k==='land' ? (d.col==='L'?'◇':d.col) : (d.col==='M'?'✦':d.col==='C'?'◇':d.col);
  const pt = o.p || d.p;
  let ov = '';
  if (o.loy != null) ov += `<span class="ov ov-loy">${o.loy}</span>`;
  else if (pt && o.showPt !== false) ov += `<span class="ov ov-pt ${o.p?'up':''}">${esc(pt)}</span>`;
  if (o.d) ov += `<span class="ov ov-dmg">−${o.d}</span>`;
  if (o.note) ov += `<span class="ov ov-note">${esc(o.note)}</span>`;
  if (o.dead) ov += `<span class="ov ov-dead">✕</span>`;
  const plain = (d.x||'').replace(/\[\[|\]\]/g,'');
  return `<div class="${cls.trim()}" data-card="${esc(name)}" role="button" tabindex="0" aria-label="${esc(name)}">
    <div class="face f-${d.col}">
      <div class="f-top"><span>${esc(name)}</span><span class="f-cost">${mana(d.c)}</span></div>
      <div class="f-art">${glyph}</div>
      <div class="f-type">${esc(d.t)}</div>
      <div class="f-text">${mana(plain)}</div>
      ${d.p?`<div class="f-pt">${esc(d.p)}</div>`:''}
    </div>
    <img ${scryImg(name)?`src="${esc(scryImg(name))}"`:''} data-img="${esc(name)}" alt="" hidden onload="imgDone(this)" onerror="imgFail(this)">
    ${ov}</div>`;
}

/* ===== modal ===== */
const KIND_PT = {land:'Terreno',creature:'Criatura',instant:'Instantâneo',sorcery:'Feitiço',enchantment:'Encantamento',artifact:'Artefato',planeswalker:'Planeswalker',battle:'Batalha',other:'Outro'};
function openCard(name){
  const d = cardData(name); if (!d && !name) return;
  const kws = KW.filter(k => d && (d.x||'').toLowerCase().includes(k.pt.toLowerCase().split(' /')[0]));
  $('#modalBox').innerHTML = `
    <button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button>
    ${cardHTML(name,{showPt:false})}
    <div class="info stack-v">
      <div><span class="eyebrow">${d?KIND_PT[d.k]||'':''}</span><h2>${esc(name)}</h2></div>
      ${d?`<div class="row-h"><span>Custo: ${d.c?mana(d.c):'—'}</span><span class="muted">Valor de mana: <b class="mono">${d.cmc??0}</b></span>${d.p?`<span class="muted">P/R: <b class="mono">${esc(d.p)}</b></span>`:''}${d.l?`<span class="muted">Lealdade: <b class="mono">${d.l}</b></span>`:''}</div>
      <p class="muted">${esc(d.t)}</p><p>${mana((d.x||'').replace(/\[\[|\]\]/g,''))}</p>`:'<p class="muted">Sem dados locais desta carta.</p>'}
      ${kws.length?`<div class="stack-v"><span class="eyebrow">Palavras-chave</span>${kws.map(k=>`<div><b>${k.pt}</b> <span class="muted">(${k.en})</span>: ${fmt(k.x)}</div>`).join('')}</div>`:''}
      <a class="btn small" href="https://scryfall.com/search?q=${encodeURIComponent('!"'+name+'"')}" target="_blank" rel="noopener">Ver no Scryfall ↗</a>
    </div>`;
  $('#modal').hidden = false; sfx('tap');
  $('.modal-close').focus();
}
function closeModal(){ $('#modal').hidden = true; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.mcard[data-card]') && !e.target.closest('.hand-row')) { e.preventDefault(); openCard(e.target.dataset.card); }
});
document.addEventListener('click', e => {
  if (e.target.closest('#cover')) return;
  if (e.target.closest('.brand')) { openCover(); return; }
  if (e.target.closest('.say')) return;
  const go = e.target.closest('[data-go]'); if (go) { show(go.dataset.go); return; }
  const cr = e.target.closest('.cref'); if (cr) { openCard(cr.dataset.card); return; }
  const mc = e.target.closest('.mcard[data-card]');
  if (mc && !mc.closest('.hand-row') && !mc.closest('.modal-box') && !mc.closest('.anat-card')) openCard(mc.dataset.card);
});

/* ===== toast / progresso ===== */
function toast(msg){ const box = $('#toasts'); if ([...box.children].some(c => c.innerHTML === msg)) return; while (box.children.length >= 3) box.firstChild.remove(); const t = document.createElement('div'); t.className='toast'; t.innerHTML = msg; box.append(t); setTimeout(()=>t.remove(), 3200); }
const LEVELS = [[0,'Aprendiz'],[200,'Iniciado'],[500,'Conjurador'],[900,'Mago de Batalha'],[1400,'Arquimago'],[2000,'Planeswalker']];
function level(){ let i = 0; LEVELS.forEach((l,j)=>{ if (S.xp >= l[0]) i = j; }); const cur = LEVELS[i], nx = LEVELS[i+1]; return {i, name:cur[1], next:nx, pct: nx ? (S.xp-cur[0])/(nx[0]-cur[0])*100 : 100}; }
function addXP(n){ const before = level().i; S.xp += n; save(); const after = level(); if (after.i > before) { toast(`Novo nível: <b>${after.name}</b>`); sfx('win'); } }
const ACH = [
  {id:'W',col:'var(--w)',name:'Fundamentos',desc:'Conclua as lições 1, 2 e 3',test:()=>[1,2,3].every(i=>S.done[i])},
  {id:'U',col:'var(--u)',name:'Mestre da Pilha',desc:'Conclua as lições 7, 8 e 12',test:()=>[7,8,12].every(i=>S.done[i])},
  {id:'B',col:'var(--b)',name:'Arte Letal',desc:'Conclua as lições 6 e 10',test:()=>[6,10].every(i=>S.done[i])},
  {id:'R',col:'var(--r)',name:'Senhor do Combate',desc:'Conclua as lições 4, 5, 9 e 11',test:()=>[4,5,9,11].every(i=>S.done[i])},
  {id:'G',col:'var(--g)',name:'Construtor',desc:'Analise um deck e simule mãos iniciais',test:()=>S.deck&&S.hand},
  {id:'Q',col:'var(--m)',name:'Erudito',desc:'Faça 100% num quiz de 10 perguntas',test:()=>S.quizPerfect},
  {id:'K',col:'var(--c)',name:'Calculista',desc:'Use a calculadora de combate',test:()=>S.calc},
  {id:'C',col:'var(--m)',name:'Comandante',desc:'Monte o esqueleto de um deck de Commander',test:()=>S.cmdBuilt},
  {id:'M',col:'var(--accent)',name:'Pronto para a mesa',desc:'Passe no simulado de etiqueta',test:()=>S.etq},
  {id:'P',col:'var(--info)',name:'Mestre dos enigmas',desc:'Resolva todos os quebra-cabeças',test:()=>Object.keys(S.puz||{}).length>=8},
  {id:'S',col:'var(--good)',name:'Simulador',desc:'Simule 1.000 partidas de um deck',test:()=>!!S.simDone},
  {id:'D',col:'var(--warn)',name:'Construtor criativo',desc:'Conclua 3 desafios de construção',test:()=>Object.keys(S.chal||{}).length>=3},
  {id:'H',col:'var(--bad)',name:'Herói da campanha',desc:'Complete os 7 capítulos da campanha',test:()=>!!S.campDone},
  {id:'A',col:'var(--info)',name:'Analista',desc:'Use "Entenda seu deck"',test:()=>!!S.entDone},
  {id:'7',col:'var(--warn)',name:'Constância',desc:'Desafio do dia 7 dias seguidos',test:()=>((S.dly||{}).best||0)>=7},
  {id:'★',col:'#e7b8ff',name:'Centelha secreta',desc:'Descubra o segredo da capa',test:()=>S.secret}
];
function checkAch(){
  ACH.forEach(a => { if (a.test() && !S.ach.includes(a.id)) { S.ach.push(a.id); save(); toast(`Conquista desbloqueada: <b>${a.name}</b>`); sfx('win'); } });
  if (S.ach.filter(x=>'WUBRG'.includes(x)).length === 5 && !S.sparkShown) { S.sparkShown = true; save(); setTimeout(()=>toast('Sua centelha despertou: as cinco cores estão acesas!'), 900); }
}

/* ===== roteamento ===== */
const VIEWS = ['inicio','regras','academia','quiz','treino','combate','formatos','decks'];
const RENDER = {};
let currentView = null;
function show(v){
  if (!VIEWS.includes(v)) v = 'inicio';
  VIEWS.forEach(id => $('#v-'+id).hidden = id !== v);
  const nv = v === 'combate' ? 'treino' : v; $$('.tab').forEach(t => t.getAttribute('data-go') === nv ? t.setAttribute('aria-current','page') : t.removeAttribute('aria-current'));
  currentView = v; RENDER[v] && RENDER[v]();
  try { history.replaceState(null,'','#'+v); } catch(e){}
  window.scrollTo({top:0});
}

/* ===== tema e som ===== */
function applyTheme(){ if (S.theme) document.documentElement.setAttribute('data-theme', S.theme); else document.documentElement.removeAttribute('data-theme'); }
$('#btnSearch').onclick = () => openSearch();
$('#btnTour').onclick = () => startTour();
$('#btnSet').onclick = () => openSettings();
$('#btnTheme').onclick = () => {
  const dark = S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  S.theme = dark ? 'light' : 'dark'; save(); applyTheme();
};
function paintSound(){ $('#btnSound').innerHTML = S.sound
  ? '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
  : '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  $('#btnSound').setAttribute('aria-label', S.sound ? 'Desligar som' : 'Ligar som'); }
$('#btnSound').onclick = () => { S.sound = !S.sound; save(); paintSound(); sfx('ok'); };

/* ================= INÍCIO ================= */
const lessonGo = id => { acad.lesson = id; acad.step = 0; acad.ans = null; acad.opts = null; show('academia'); };
const TRAIL = [
  {t:'Leia o manual',d:'Objetivo, cores, tipos de carta, zonas e mana.',ok:()=>!!S.seen.r_manual,go:()=>{ rulesTab='manual'; show('regras'); }},
  {t:'Entenda o turno e a anatomia da carta',d:'As cinco fases e o que cada parte da carta significa.',ok:()=>!!(S.seen.r_turno&&S.seen.r_anat),go:()=>{ rulesTab = S.seen.r_turno ? 'anat' : 'turno'; show('regras'); }},
  {t:'Lições 1 a 4',d:'Mana, enjoo de invocação, voar, iniciativa.',ok:()=>[1,2,3,4].every(i=>S.done[i]),go:()=>lessonGo(([1,2,3,4].find(i=>!S.done[i]))||1)},
  {t:'Conheça as habilidades',d:'As 24 palavras-chave com exemplos.',ok:()=>!!S.seen.r_hab,go:()=>{ rulesTab='hab'; show('regras'); }},
  {t:'Lições 5 a 12',d:'Atropelar, pilha, planeswalkers, lampejo.',ok:()=>LESSONS.every(l=>S.done[l.id]),go:()=>lessonGo((LESSONS.find(l=>!S.done[l.id])||LESSONS[4]).id)},
  {t:'Quiz com 70% ou mais',d:'Confirme que as regras ficaram claras.',ok:()=>S.quizBest>=70,go:()=>show('quiz')},
  {t:'Calcule combates',d:'Monte uma luta na calculadora de combate.',ok:()=>!!S.calc,go:()=>show('combate')},
  {t:'Conheça os formatos',d:'Commander, Padrão e os outros. Descubra o seu.',ok:()=>!!S.seen.f_geral,go:()=>goFmt('geral')},
  {t:'Estude o seu formato',d:'O passo a passo de Commander ou do Padrão.',ok:()=>!!(S.seen.f_commander||S.seen.f_padrao),go:()=>goFmt('commander')},
  {t:'Monte seu deck',d:'Use o montador guiado e analise a lista.',ok:()=>!!S.deck,go:()=>goFmt('montar')},
  {t:'Teste mãos iniciais',d:'Mulligan, probabilidade e simulação.',ok:()=>!!S.hand,go:()=>{ deckTab='mao'; show('decks'); }},
  {t:'Jogue no MTG Arena',d:'Pratique de graça no PC ou no celular.',ok:()=>!!S.seen.f_arena,go:()=>goFmt('arena')},
  {t:'Treine como os veteranos',d:'Simule um deck e resolva 4 quebra-cabeças.',ok:()=>!!S.simDone && Object.keys(S.puz||{}).length>=4,go:()=>{ trTab = S.simDone ? 'puz' : 'sim'; show('treino'); }},
  {t:'Prepare-se para a mesa',d:'Etiqueta, vocabulário e o simulado da loja.',ok:()=>!!S.etq,go:()=>goFmt('mesa')}
];
RENDER.inicio = function(){
  const lv = level();
  const doneN = Object.keys(S.done).length;
  const next = LESSONS.find(l => !S.done[l.id]) || LESSONS[0];
  const pool = Object.keys(CARDS).filter(n => CARDS[n].k !== 'land');
  const day = Math.floor(Date.now()/864e5);
  const cod = pool[day % pool.length];
  const codKw = KW.find(k => (CARDS[cod].x||'').toLowerCase().includes(k.pt.toLowerCase().split(' /')[0]));
  $('#v-inicio').innerHTML = `
  <div class="hero">
    <div>
      <p class="eyebrow">Magic: The Gathering · em português</p>
      <h1>Academia do Planeswalker</h1>
      <p class="lede">Aprenda as regras, pratique jogadas reais em 12 lições interativas, teste o que sabe no quiz, calcule combates e analise seus decks.</p>
      <div class="actions">
        <button class="btn primary" data-go="academia" id="goNext">${doneN ? 'Continuar' : 'Começar'}: ${esc(next.title)}</button>
        <button class="btn" data-go="regras">Abrir o manual</button>
      </div>
    </div>
    <div class="fan">${cardHTML('Llanowar Elves',{showPt:false})}${cardHTML('Serra Angel',{showPt:false})}${cardHTML('Lightning Bolt')}</div>
  </div>
  <div class="statrow">
    <div class="stat"><div class="k">Nível</div><div class="v" style="font-family:var(--f-display);font-weight:400">${lv.name}</div><div class="bar"><i style="width:${lv.pct}%"></i></div><div class="k mono" style="margin-top:6px">${S.xp} XP${lv.next?` · faltam ${lv.next[0]-S.xp}`:''}</div></div>
    <div class="stat"><div class="k">Lições concluídas</div><div class="v">${doneN}/${LESSONS.length}</div><div class="bar"><i style="width:${doneN/LESSONS.length*100}%"></i></div></div>
    <div class="stat"><div class="k">Melhor quiz</div><div class="v">${S.quizBest}%</div></div>
    <div class="stat"><div class="k">Conquistas</div><div class="v">${S.ach.length}/${ACH.length}</div></div>
  </div>
  <div class="grid g2" style="align-items:start">${dailyHTML()}<div class="panel stack-v"><div class="row-h" style="justify-content:space-between"><h3>Novidades da versão ${CUR_VER}</h3><span class="pill good">nova</span></div>${updatesHTML(false)}<button class="btn small" id="verAllHome" style="align-self:flex-start">Ver todas as atualizações</button></div></div>
  <div class="panel" style="margin-bottom:16px;margin-top:16px">
    <h3>A Centelha</h3><p class="muted" style="margin-bottom:12px">Acenda as cinco cores para despertar sua centelha de planeswalker.</p>
    <div class="spark">${ACH.map(a=>`<div class="gem ${S.ach.includes(a.id)?'on':''}" style="color:${a.col}"><div class="orb" style="background:${a.col}">${a.id}</div><div style="color:var(--ink)"><b>${a.name}</b><small>${a.desc}</small></div></div>`).join('')}</div>
  </div>
  <div class="grid g2">
    <div class="panel"><h3>Carta do dia</h3>
      <div class="cod">${cardHTML(cod)}<div class="stack-v"><b style="font-family:var(--f-display);font-size:1.15rem">${esc(cod)}</b><span class="muted">${esc(CARDS[cod].t)} · ${mana(CARDS[cod].c)}</span><p>${mana(CARDS[cod].x)}</p>${codKw?`<div class="tip"><b>${codKw.pt}:</b> ${fmt(codKw.tip)}</div>`:''}</div></div>
    </div>
    <div class="panel stack-v"><h3>Extras para fãs</h3>
      <p class="muted">Na capa você descobre sua cor, conhece os planeswalkers, as cartas lendárias e a história do jogo. Há também um segredo escondido.</p>
      ${S.myColor?`<p>Sua cor: ${[...S.myColor].map(manaSym).join('')} ${S.myColor.length>1?'<b>'+(({WU:'Azorius',UB:'Dimir',BR:'Rakdos',RG:'Gruul',GW:'Selesnya',WB:'Orzhov',UR:'Izzet',BG:'Golgari',RW:'Boros',GU:'Simic'})[S.myColor]||'')+'</b>':''}</p>`:''}
      <div><button class="btn" id="goCover">Abrir a capa</button></div>
    </div>
  </div>
  <div class="sub-h" style="margin-top:28px"><h2>Trilha: do zero à mesa</h2><p>Siga na ordem. Quem completa a trilha sabe jogar, montar um deck e se portar numa mesa com jogadores experientes.</p></div>
  <div class="panel"><ol class="path trail">${TRAIL.map((t,i)=>`<li class="${t.ok()?'ok':''}"><div><b>${t.t}</b><br><span class="muted">${t.d}</span></div><button class="btn small" data-trail="${i}">${t.ok()?'Rever':'Ir'}</button></li>`).join('')}</ol>
    <div class="bar" style="margin-top:14px"><i style="width:${TRAIL.filter(t=>t.ok()).length/TRAIL.length*100}%"></i></div>
    <p class="muted mono" style="margin-top:6px;font-size:.85rem">${TRAIL.filter(t=>t.ok()).length} de ${TRAIL.length} etapas</p>
  </div>
  ${TRAIL.every(t=>t.ok()) ? `<div class="cert" style="margin-top:16px"><span class="eyebrow">Certificado</span><h2>Planeswalker pronto para a mesa</h2>
     <label class="f" for="certName" style="align-items:center">Seu nome<input type="text" id="certName" value="${esc(S.certName||'')}" style="max-width:320px;text-align:center"></label>
     <div class="nm">${esc(S.certName||'Seu nome aqui')}</div>
     <p class="muted">Concluiu as 12 lições, o quiz, os formatos, a montagem de deck, o MTG Arena e a etiqueta de mesa da Academia do Planeswalker.</p></div>` : ''}
  <div class="grid g2" style="margin-top:16px;align-items:start">
    <div class="panel"><h3>Nesta semana na história do Magic</h3><div id="thisWeek">${thisWeekHTML()}</div></div>
    <div class="panel stack-v"><h3>Mesa de hoje</h3><p class="muted">Vai jogar? Abra o contador de vida com dado, veneno e dano de comandante.</p><div class="row-h"><button class="btn primary" id="homeLife">Contador de vida</button><button class="btn" id="homeSim">Simular um deck</button></div></div>
  </div>
  ${backupHTML()}
  <div class="panel" style="margin-top:16px">
    <div class="row-h" style="justify-content:space-between"><div><h3>Seu progresso</h3><p class="muted">Fica salvo neste navegador.</p></div>
    <div class="row-h" id="resetBox"><button class="btn small" id="btnReset">Zerar progresso</button></div></div>
  </div>`;
  $('#btnReset').onclick = () => {
    $('#resetBox').innerHTML = `<span class="muted">Apagar XP, lições e conquistas?</span><button class="btn small" id="rNo">Cancelar</button><button class="btn small primary" id="rYes">Apagar</button>`;
    $('#rNo').onclick = () => RENDER.inicio();
    $('#rYes').onclick = () => { const keep = {sound:S.sound, theme:S.theme}; S = Object.assign({}, DEF, {done:{},seen:{},ach:[],firstTry:{}}, keep); save(); RENDER.inicio(); toast('Progresso apagado'); };
  };
  $('#goNext').addEventListener('click', () => { acad.lesson = next.id; acad.step = 0; acad.ans = null; });
  $('#goCover').onclick = openCover;
  $('#homeLife').onclick = openLife;
  $('#homeSim').onclick = () => { trTab = 'sim'; show('treino'); };
  bindBackup(); bindDaily(); $('#verAllHome').onclick = () => openUpdates(false);
  $$('[data-trail]').forEach(b => b.onclick = () => TRAIL[+b.dataset.trail].go());
  const cn = $('#certName'); if (cn) cn.oninput = () => { S.certName = cn.value; save(); $('.cert .nm').textContent = cn.value || 'Seu nome aqui'; };
};

/* ================= REGRAS ================= */
let cr = (n, label) => `<button class="cref" data-card="${esc(n)}">${esc(label||n)}</button>`;
const MANUAL = [
 {t:'O objetivo do jogo', h:`
  <p>Cada jogador é um planeswalker: um mago que usa seu deck (o <b class="t">grimório</b>) como arsenal. Você começa com <b>20 pontos de vida</b> e <b>7 cards</b> na mão.</p>
  <p>Você vence quando o oponente:</p>
  <ul><li>chega a <b>0 de vida</b>;</li><li>precisa comprar um card com o grimório vazio;</li><li>acumula <b>10 marcadores de veneno</b>;</li><li>ou quando um card diz que você vence.</li></ul>
  <div class="tip">Antes da primeira mão, decida no cara ou coroa quem começa. Quem começa pula a compra do primeiro turno.</div>`},
 {t:'As cinco cores', h:`
  <p>Cada cor tem uma filosofia, pontos fortes e fraquezas. Decks costumam usar uma ou duas cores.</p>
  <div class="colors5">
   <div class="color-c" style="background:var(--w)"><h4>${manaSym('W')} Branco</h4><p>Ordem, comunidade e proteção. Exércitos de criaturas pequenas, ganho de vida, remoção "justa".</p><p class="sw"><b>Fraco em:</b> compra de cards.</p></div>
   <div class="color-c" style="background:var(--u)"><h4>${manaSym('U')} Azul</h4><p>Conhecimento e controle. Anulações, compra de cards, voadores e manipulação.</p><p class="sw"><b>Fraco em:</b> destruir permanentes.</p></div>
   <div class="color-c" style="background:var(--b)"><h4>${manaSym('B')} Preto</h4><p>Ambição a qualquer custo. Remoção de criaturas, descarte, cemitério, pagar vida por poder.</p><p class="sw"><b>Fraco em:</b> artefatos e encantamentos.</p></div>
   <div class="color-c" style="background:var(--r)"><h4>${manaSym('R')} Vermelho</h4><p>Liberdade e impulso. Dano direto, Ímpeto, ataques rápidos, dragões.</p><p class="sw"><b>Fraco em:</b> jogo longo e encantamentos.</p></div>
   <div class="color-c" style="background:var(--g)"><h4>${manaSym('G')} Verde</h4><p>Natureza e crescimento. Aceleração de mana (ramp), criaturas enormes, lutar.</p><p class="sw"><b>Fraco em:</b> voadores e interação no turno do oponente.</p></div>
  </div>
  <p>Cards sem cor (${manaSym('C')}), como artefatos, entram em qualquer deck.</p>`},
 {t:'Tipos de carta', h:`
  <div class="tbl-wrap"><table><thead><tr><th>Tipo</th><th>Quando jogar</th><th>O que faz</th><th>Exemplo</th></tr></thead><tbody>
   <tr><td><b>Terreno</b></td><td>Sua fase principal, 1 por turno</td><td>Gera mana. Não é mágica: não usa a pilha.</td><td>${cr('Forest')}</td></tr>
   <tr><td><b>Criatura</b></td><td>Velocidade de feitiço</td><td>Ataca e bloqueia. Tem poder/resistência.</td><td>${cr('Grizzly Bears')}</td></tr>
   <tr><td><b>Instantâneo</b></td><td>A qualquer momento com prioridade</td><td>Efeito único, depois vai ao cemitério.</td><td>${cr('Lightning Bolt')}</td></tr>
   <tr><td><b>Feitiço</b></td><td>Sua fase principal, pilha vazia</td><td>Efeito único, geralmente mais forte.</td><td>${cr('Divination')}</td></tr>
   <tr><td><b>Encantamento</b></td><td>Velocidade de feitiço</td><td>Efeito contínuo. Auras se prendem a algo.</td><td>${cr('Pacifism')}</td></tr>
   <tr><td><b>Artefato</b></td><td>Velocidade de feitiço</td><td>Objetos mágicos, normalmente incolores. Inclui Equipamentos.</td><td>${cr('Bonesplitter')}</td></tr>
   <tr><td><b>Planeswalker</b></td><td>Velocidade de feitiço</td><td>Aliado com lealdade e uma habilidade por turno.</td><td>${cr('Chandra, Torch of Defiance','Chandra')}</td></tr>
  </tbody></table></div>
  <p><b class="t">Permanentes</b> são os tipos que ficam no campo: terrenos, criaturas, artefatos, encantamentos, planeswalkers e batalhas. Instantâneos e feitiços nunca ficam no campo.</p>`},
 {t:'As zonas do jogo', h:`
  <ul>
   <li><b class="t">Grimório:</b> seu deck, virado para baixo. Ninguém pode olhar ou reordenar sem um efeito.</li>
   <li><b class="t">Mão:</b> oculta para o oponente. Máximo de 7 no fim do turno.</li>
   <li><b class="t">Campo de batalha:</b> onde ficam as permanentes.</li>
   <li><b class="t">Cemitério:</b> descarte. Público, em ordem. Alguns decks o usam como recurso.</li>
   <li><b class="t">Pilha:</b> onde mágicas e habilidades esperam para resolver.</li>
   <li><b class="t">Exílio:</b> fora do jogo. Muito mais difícil de recuperar do que o cemitério.</li>
   <li><b class="t">Comando:</b> zona de comandantes (Commander) e emblemas.</li>
  </ul>`},
 {t:'Mana e custos', h:`
  <p>O custo fica no canto superior direito. ${cr('Serra Angel')} custa ${mana('{3}{W}{W}')}: dois manas brancos e mais três de qualquer tipo. O total, 5, é o <b class="t">valor de mana</b> (antigo CMC).</p>
  <ul>
   <li>${manaSym('W')}${manaSym('U')}${manaSym('B')}${manaSym('R')}${manaSym('G')} mana colorida específica.</li>
   <li>${manaSym('3')} mana genérica: qualquer cor serve.</li>
   <li>${manaSym('C')} mana incolor: precisa ser incolor de verdade.</li>
   <li>${manaSym('X')} você escolhe o valor ao conjurar.</li>
   <li>${manaSym('R/W')} híbrida: pague com qualquer uma das duas cores.</li>
   <li>${manaSym('T')} virar: girar o card de lado como parte do custo.</li>
  </ul>
  <div class="tip">Mana não usada some ao final de cada etapa e fase. Não dá para guardar mana de um turno para outro.</div>`},
 {t:'Combate passo a passo', h:`
  <ol>
   <li><b>Declarar atacantes:</b> o jogador ativo vira as criaturas que atacam (sem enjoo de invocação) e escolhe se cada uma ataca o oponente, um planeswalker ou uma batalha.</li>
   <li><b>Declarar bloqueadores:</b> o defensor escolhe. Criaturas viradas não bloqueiam. Uma criatura bloqueia um atacante só; um atacante pode receber vários bloqueadores.</li>
   <li><b>Dano:</b> atacantes não bloqueados causam dano ao alvo. Atacantes bloqueados causam dano aos bloqueadores (e só passam ao jogador com Atropelar). Todo dano é simultâneo.</li>
   <li><b>Resultado:</b> criaturas com dano maior ou igual à resistência são destruídas. O dano marcado some na limpeza.</li>
  </ol>
  <p>Uma criatura bloqueada continua bloqueada mesmo que o bloqueador saia do campo: sem Atropelar, ela não causa dano a ninguém.</p>
  <p>Pratique na aba <button class="cref" data-go="combate">Combate</button>.</p>`},
 {t:'A pilha e a prioridade', h:`
  <p>Quando você conjura uma mágica ou ativa uma habilidade, ela vai para a <b class="t">pilha</b>. Antes de resolver, cada jogador recebe <b class="t">prioridade</b> para responder.</p>
  <div class="tip"><b>Regra de ouro (LIFO):</b> o último item a entrar na pilha é o primeiro a resolver.</div>
  <ul>
   <li>Quando os dois jogadores passam a prioridade em sequência com a pilha cheia, o item do topo resolve. Depois todos recebem prioridade de novo.</li>
   <li>Quando os dois passam com a pilha vazia, o jogo avança para a próxima etapa.</li>
   <li>Se todos os alvos de uma mágica ficarem ilegais, ela não resolve ("pifa").</li>
   <li>Não usam a pilha: jogar terreno, habilidades de mana e ações baseadas em estado.</li>
  </ul>`},
 {t:'Ações baseadas em estado', h:`
  <p>O jogo verifica automaticamente, sempre que alguém receberia prioridade:</p>
  <ul>
   <li>Jogador com 0 ou menos de vida perde.</li>
   <li>Jogador que tentou comprar de grimório vazio perde.</li>
   <li>Criatura com resistência 0 ou menos vai ao cemitério (mesmo indestrutível).</li>
   <li>Criatura com dano letal marcado, ou dano de Toque Mortífero, é destruída.</li>
   <li>Planeswalker com 0 de lealdade vai ao cemitério.</li>
   <li>Regra da lenda: com duas permanentes lendárias de mesmo nome, o controlador escolhe uma e manda a outra ao cemitério.</li>
  </ul>`},
 {t:'Formatos de jogo', h:`
  <div class="tbl-wrap"><table><thead><tr><th>Formato</th><th>Deck</th><th>Vida</th><th>Ideal para</th></tr></thead><tbody>
   <tr><td><b>Padrão</b></td><td>60+, 4 cópias, coleções recentes</td><td class="n">20</td><td>Competitivo com cards novos</td></tr>
   <tr><td><b>Pioneer / Modern</b></td><td>60+, 4 cópias, pools maiores</td><td class="n">20</td><td>Competitivo com cards mais antigos</td></tr>
   <tr><td><b>Commander</b></td><td>100, 1 cópia, um comandante lendário</td><td class="n">40</td><td>Multiplayer casual com amigos</td></tr>
   <tr><td><b>Draft / Selado</b></td><td>40+, cards abertos na hora</td><td class="n">20</td><td>Aprender avaliando cards</td></tr>
   <tr><td><b>Pauper</b></td><td>60+, só comuns</td><td class="n">20</td><td>Competitivo barato</td></tr>
  </tbody></table></div>
  <p class="muted">As listas de cards permitidos mudam com o tempo. Confira a lista oficial do formato antes de um evento.</p>`},
 {t:'Dicionário de gírias', h:`
  <ul>
   <li><b class="t">Mulligan:</b> devolver a mão inicial e comprar outra (London Mulligan: compra 7 e coloca 1 no fundo por mulligan).</li>
   <li><b class="t">Aggro, Midrange, Controle, Combo, Ramp, Tempo:</b> arquétipos de deck. Veja a aba Decks.</li>
   <li><b class="t">Remoção:</b> card que tira uma ameaça do jogo, como ${cr('Murder')}.</li>
   <li><b class="t">Cólera / board wipe:</b> destrói tudo, como ${cr('Wrath of God')}.</li>
   <li><b class="t">Truque de combate:</b> instantâneo que muda uma luta, como ${cr('Giant Growth')}.</li>
   <li><b class="t">Ramp:</b> acelerar a mana, como ${cr('Llanowar Elves')}.</li>
   <li><b class="t">Card advantage:</b> ter mais recursos que o oponente; um card que vale dois é "2 por 1".</li>
   <li><b class="t">Chump block:</b> bloquear sabendo que sua criatura morre, só para salvar vida.</li>
   <li><b class="t">Pifar (fizzle):</b> mágica que não resolve por perder os alvos.</li>
   <li><b class="t">Topdeck:</b> o card comprado no turno. "Viver de topdeck" é estar sem cards na mão.</li>
   <li><b class="t">Flood / Screw:</b> terreno demais / terreno de menos.</li>
  </ul>`},
 {t:'Erros comuns de iniciante', h:`
  <ul>
   <li><b>Atacar com tudo sempre.</b> Pergunte antes: o que o oponente faz no turno dele se eu ficar sem bloqueadores?</li>
   <li><b>Conjurar criaturas antes do combate sem motivo.</b> Na segunda fase principal você esconde informação.</li>
   <li><b>Usar remoção na primeira ameaça.</b> Guarde para o que realmente pode vencer o jogo.</li>
   <li><b>Esquecer a mana aberta do oponente.</b> Duas Ilhas desviradas podem ser um ${cr('Counterspell')}.</li>
   <li><b>Deck com 70+ cards.</b> Mais cards deixam suas melhores jogadas menos frequentes. Fique no mínimo.</li>
   <li><b>Poucos terrenos.</b> 24 em 60 é um ponto de partida seguro.</li>
  </ul>`}
];

const anatPins = [
  {n:1,x:30,y:6,t:'Nome',d:'Cards com o mesmo nome contam juntos no limite de 4 cópias.'},
  {n:2,x:86,y:6,t:'Custo de mana',d:'Quanto e quais cores de mana você paga para conjurar.'},
  {n:3,x:50,y:30,t:'Ilustração',d:'Não tem efeito nas regras.'},
  {n:4,x:30,y:55,t:'Linha de tipo',d:'Tipo (Criatura) e subtipo (Anjo). Outros cards podem se referir ao subtipo.'},
  {n:5,x:88,y:55,t:'Símbolo da coleção',d:'A cor indica a raridade: preto comum, prata incomum, dourado rara, laranja mítica.'},
  {n:6,x:50,y:74,t:'Caixa de texto',d:'Habilidades e regras. Texto em itálico é só ambientação, sem efeito.'},
  {n:7,x:86,y:93,t:'Poder / Resistência',d:'Dano que causa em combate / dano que aguenta no turno.'}
];

let rulesTab = 'manual', kwCat = 'Todas', phaseSel = 2, anatSel = 1;
RENDER.regras = function(){
  S.seen.manual = true; save();
  $('#v-regras').innerHTML = `
   <div class="view-head"><h1>Regras</h1><p>O manual completo, as habilidades com exemplos de cartas reais, o turno interativo e a anatomia de uma carta. Toque em qualquer nome sublinhado para ver a carta.</p></div>
   <div class="seg" role="tablist">
     ${[['simples','Primeiros passos'],['manual','Manual'],['hab','Habilidades'],['turno','O turno'],['anat','Anatomia'],['simb','Símbolos']].map(([k,l])=>`<button role="tab" data-rt="${k}" aria-selected="${rulesTab===k}">${l}</button>`).join('')}
   </div>
   <div id="rulesBody"></div>`;
  $$('[data-rt]').forEach(b => b.onclick = () => { rulesTab = b.dataset.rt; RENDER.regras(); });
  ({simples:renderSimple, manual:renderManual, hab:renderKW, turno:renderTurn, anat:renderAnat, simb:renderSymbols})[rulesTab]();
  if (!S.seen['r_'+rulesTab]) { S.seen['r_'+rulesTab] = true; save(); }
};
function renderManual(){
  $('#rulesBody').innerHTML = `
   <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
   <input type="text" id="mSearch" placeholder="Busque: pilha, atropelar, mulligan, cemitério…" autocomplete="off"></div>
   <p class="muted" id="mCount" style="margin:-4px 0 10px;font-size:.9rem"></p>
   <div id="mSecs">${MANUAL.map((s,i)=>`<details class="sec" ${i===0?'open':''} data-i="${i}"><summary>${s.t}</summary><div class="sec-body">${s.h}</div></details>`).join('')}</div>`;
  const inp = $('#mSearch');
  inp.oninput = () => {
    const q = inp.value.trim().toLowerCase();
    let hits = 0;
    $$('#mSecs details').forEach(d => {
      const body = $('.sec-body', d); const orig = MANUAL[+d.dataset.i].h;
      body.innerHTML = orig;
      if (q.length < 3) { d.hidden = false; return; }
      const match = d.textContent.toLowerCase().includes(q);
      d.hidden = !match; d.open = match; if (match) { hits++; highlight(body, q); }
    });
    $('#mCount').textContent = q.length < 3 ? '' : hits ? `${hits} seção(ões) encontrada(s)` : 'Nada encontrado. Tente outro termo ou veja a aba Habilidades.';
  };
}
function highlight(root, q){
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => {
    const i = n.data.toLowerCase().indexOf(q); if (i < 0) return;
    const m = document.createElement('mark'); const after = n.splitText(i); after.splitText(q.length);
    m.textContent = after.data; after.replaceWith(m);
  });
}
function renderKW(){
  const list = KW.filter(k => kwCat === 'Todas' || k.cat === kwCat);
  $('#rulesBody').innerHTML = `
   <div class="filters">${KW_CATS.map(c=>`<button class="chip" data-kc="${c}" aria-pressed="${kwCat===c}">${c}</button>`).join('')}</div>
   <div class="kw-grid">${list.map(k=>`
     <div class="kw" data-kw="${esc(k.pt)}">
       ${cardHTML(k.ex,{showPt:false})}
       <div style="min-width:0"><h4>${k.pt}</h4><div class="en">${k.en} ${sayBtn(k.en)} · ${k.cat}</div><p>${fmt(k.x)}</p>
       <p class="muted" style="font-size:.86rem"><b>Dica:</b> ${fmt(k.tip)}</p>
       ${k.l?`<button class="btn small" style="margin-top:8px" data-lesson="${k.l}">Praticar na lição ${k.l}</button>`:''}</div>
     </div>`).join('')}</div>`;
  $$('[data-kc]').forEach(b => b.onclick = () => { kwCat = b.dataset.kc; renderKW(); });
  $$('[data-lesson]').forEach(b => b.onclick = e => { e.stopPropagation(); acad.lesson = +b.dataset.lesson; acad.step = 0; acad.ans = null; show('academia'); });
}
function renderTurn(){
  const p = PHASES[phaseSel];
  $('#rulesBody').innerHTML = `
   <p class="muted" style="margin-bottom:12px">Todo turno segue sempre esta ordem. Toque numa fase para ver suas etapas.</p>
   <div class="phases" role="tablist">${PHASES.map((ph,i)=>`<button class="phase" role="tab" data-ph="${i}" aria-selected="${i===phaseSel}"><span class="pn">Fase ${i+1}</span><b>${ph.k}</b></button>`).join('')}</div>
   <div class="steps-list">${p.steps.map(([t,d])=>`<div class="step-card"><b>${t}</b><p>${fmt(d)}</p></div>`).join('')}</div>
   <div class="tip" style="margin-top:14px">Exceto na etapa de desvirar e (normalmente) na limpeza, os dois jogadores recebem prioridade em toda etapa. É aí que entram os instantâneos.</div>`;
  $$('[data-ph]').forEach(b => b.onclick = () => { phaseSel = +b.dataset.ph; sfx('tap'); renderTurn(); });
}
function renderAnat(){
  $('#rulesBody').innerHTML = `
   <div class="anat">
     <div class="anat-card">${cardHTML('Serra Angel',{showPt:false})}
       ${anatPins.map(p=>`<button class="pin" data-pin="${p.n}" aria-pressed="${anatSel===p.n}" style="left:calc(${p.x}% - 13px);top:calc(${p.y}% - 13px)">${p.n}</button>`).join('')}</div>
     <div class="stack-v">
       <p class="muted">${cr('Serra Angel')}: custo ${mana('{3}{W}{W}')}, valor de mana 5, criatura 4/4 com Voar e Vigilância.</p>
       <ul class="legend">${anatPins.map(p=>`<li class="${anatSel===p.n?'on':''}" data-pin="${p.n}"><span class="num">${p.n}</span><div><b>${p.t}</b><br><span class="muted">${p.d}</span></div></li>`).join('')}</ul>
     </div>
   </div>`;
  $$('[data-pin]').forEach(b => b.onclick = () => { anatSel = +b.dataset.pin; renderAnat(); });
}

/* ================= ACADEMIA ================= */
const acad = {lesson:null, step:0, ans:null, opts:null, wrong:0};
function shuffleIdx(n){ const a=[...Array(n).keys()]; for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
const colVar = c => `var(--${c.toLowerCase()})`;
RENDER.academia = function(){
  if (!acad.lesson) acad.lesson = (LESSONS.find(l=>!S.done[l.id])||LESSONS[0]).id;
  $('#v-academia').innerHTML = `
   <div class="view-head"><h1>Lições práticas</h1><p>Doze situações reais de jogo. Leia a mesa, responda e veja o resultado. Toque nas cartas para ler o texto completo.</p></div>
   <div class="acad">
     <div class="lesson-list" id="lessonList">${LESSONS.map(l=>`
       <button class="lesson-btn" data-l="${l.id}" ${l.id===acad.lesson?'aria-current="true"':''}>
         <span class="lnum" style="background:${colVar(l.col)}">${l.id}</span>
         <span style="min-width:0"><b>${l.title}</b><small>${l.tag}</small></span>
         ${S.done[l.id]?'<span class="ok" aria-label="concluída">✓</span>':''}
       </button>`).join('')}</div>
     <div class="stage" id="stage"></div>
   </div>`;
  $$('[data-l]').forEach(b => b.onclick = () => { acad.lesson = +b.dataset.l; acad.step = 0; acad.ans = null; acad.opts = null; RENDER.academia(); $('#stage').scrollIntoView({behavior:'smooth',block:'start'}); });
  const cur = $('.lesson-btn[aria-current]'); if (cur && cur.scrollIntoView && innerWidth <= 900) cur.scrollIntoView({inline:'center',block:'nearest'});
  renderStage();
};
function boardHTML(b, prev){
  const life = (v, pv) => { const d = pv!=null ? v - pv : 0; return `<span class="life">♥ ${v}${d?`<span class="delta ${d<0?'minus':'plus'}">${d>0?'+':''}${d}</span>`:''}</span>`; };
  const row = (arr, empty) => `<div class="zone ${arr.length?'':'empty'}" data-empty="${empty}">${arr.map(c=>cardHTML(c.n,c)).join('')}</div>`;
  const pl = prev ? prev.life : null;
  return `<div class="board">
    <div class="side"><div class="side-head"><span>Oponente</span>${life(b.life[1], pl?pl[1]:null)}</div>${row(b.opp||[], 'Sem permanentes')}</div>
    ${b.stack && b.stack.length ? `<div class="mid"><div class="stack-zone"><span class="lbl">Pilha</span>${b.stack.map((n,i)=>`<div class="stack-item">${cardHTML(n,{cls:'mini'})}<span>${i===b.stack.length-1?'Topo · resolve 1º':(i+1)+'º a entrar'}</span></div>`).join('')}</div></div>` : ''}
    <div class="side">${row(b.me||[], 'Sem permanentes')}<div class="side-head"><span>Você</span>${life(b.life[0], pl?pl[0]:null)}</div></div>
    ${b.hand && b.hand.length ? `<div class="hand-zone"><span class="lbl">Sua mão</span>${b.hand.map(n=>cardHTML(n,{cls:'mini'})).join('')}</div>` : ''}
  </div>`;
}
function renderStage(){
  const L = LESSONS.find(l=>l.id===acad.lesson); const st = L.steps[acad.step]; const prev = L.steps[acad.step-1];
  const last = acad.step === L.steps.length - 1;
  if (st.q && !acad.opts) acad.opts = shuffleIdx(st.q.o.length);
  const answered = acad.ans != null;
  const canNext = !st.q || (answered && acad.ans === st.q.a);
  $('#stage').innerHTML = `
    <div class="stage-head"><div><span class="eyebrow">Lição ${L.id} · ${L.tag}</span><h2>${L.title}</h2></div>
      <div class="dots" aria-label="Passo ${acad.step+1} de ${L.steps.length}">${L.steps.map((_,i)=>`<i class="${i<acad.step?'done':i===acad.step?'cur':''}"></i>`).join('')}</div></div>
    ${boardHTML(st.b, prev && prev.b)}
    <p class="narr">${fmt(st.x)}</p>
    ${st.q ? `<div class="q"><div class="ask">${fmt(st.q.ask)}</div>
      ${acad.opts.map((oi,k)=>{ const right = oi===st.q.a, chosen = acad.ans===oi;
        const cls = answered && (chosen || (acad.ans===st.q.a && right)) ? (right?'right':'wrong') : '';
        return `<button class="opt ${cls}" data-o="${oi}" ${answered && acad.ans===st.q.a ? 'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${fmt(st.q.o[oi])}</span></button>`; }).join('')}
      ${answered ? `<div class="why ${acad.ans===st.q.a?'ok':'no'}">${acad.ans===st.q.a?'<b>Correto.</b> ':'<b>Ainda não.</b> Tente outra opção. '}${acad.ans===st.q.a?fmt(st.q.why):''}</div>` : ''}
    </div>` : ''}
    <div class="nav-row">
      <button class="btn" id="stBack" ${acad.step===0?'disabled':''}>← Passo anterior</button>
      <button class="btn primary" id="stNext" ${canNext?'':'disabled'}>${last?'Concluir lição':'Continuar →'}</button>
    </div>
    <div id="doneBox"></div>`;
  $$('.opt', $('#stage')).forEach(b => b.onclick = () => {
    const oi = +b.dataset.o; acad.ans = oi;
    const key = L.id+'-'+acad.step;
    if (oi === st.q.a) { sfx('ok'); if (!(key in S.firstTry)) { S.firstTry[key] = true; addXP(10); } }
    else { sfx('no'); if (!(key in S.firstTry)) { S.firstTry[key] = false; save(); } }
    renderStage();
  });
  $('#stBack').onclick = () => { acad.step--; acad.ans = null; acad.opts = null; renderStage(); };
  $('#stNext').onclick = () => {
    if (!last) { acad.step++; acad.ans = null; acad.opts = null; sfx('tap'); renderStage(); return; }
    const first = !S.done[L.id];
    S.done[L.id] = true; if (first) addXP(100); save(); sfx('win'); checkAch();
    const nx = LESSONS.find(l => !S.done[l.id]);
    $('#doneBox').innerHTML = `<div class="panel stack-v" style="border-color:var(--accent)"><h3>Lição concluída${first?' · +100 XP':''}</h3>
      <p class="muted">${nx?`Próxima sugerida: <b>${nx.title}</b>.`:'Você concluiu todas as lições. Que tal o quiz?'}</p>
      <div class="row-h">${nx?`<button class="btn primary" id="goNx">Ir para a lição ${nx.id}</button>`:`<button class="btn primary" data-go="quiz">Fazer o quiz</button>`}<button class="btn" id="again">Refazer esta</button></div></div>`;
    $$('.lesson-btn').forEach(b => { if (+b.dataset.l === L.id && !$('.ok', b)) b.insertAdjacentHTML('beforeend','<span class="ok">✓</span>'); });
    if (nx) $('#goNx').onclick = () => { acad.lesson = nx.id; acad.step = 0; acad.ans = null; acad.opts = null; RENDER.academia(); };
    $('#again').onclick = () => { acad.step = 0; acad.ans = null; acad.opts = null; renderStage(); };
    $('#doneBox').scrollIntoView({behavior:'smooth',block:'center'});
  };
}

/* ================= QUIZ ================= */
const quiz = {state:'menu', cat:'Todas', qs:[], i:0, ans:null, score:0, wrong:[], order:null};
const QCATS = ['Todas','Básico','Combate','Pilha','Habilidades','Construção','Formatos','Mesa','Lore'];
RENDER.quiz = function(){
  const v = $('#v-quiz');
  if (quiz.state === 'menu') {
    v.innerHTML = `<div class="quiz-wrap stack-v">
      <div class="view-head"><h1>Quiz de regras</h1><p>10 perguntas sorteadas de um banco de ${QUIZ.length}. Cada acerto vale 10 XP e toda resposta vem com explicação.</p></div>
      <div class="panel stack-v"><span class="eyebrow">Tema</span>
        <div class="filters" style="margin:0">${QCATS.map(c=>`<button class="chip" data-qc="${c}" aria-pressed="${quiz.cat===c}">${c} <span class="muted mono">${c==='Todas'?QUIZ.length:QUIZ.filter(q=>q.c===c).length}</span></button>`).join('')}</div>
        <div class="row-h"><button class="btn primary" id="qStart">Começar</button><span class="muted">Melhor resultado: <b class="mono">${S.quizBest}%</b></span></div>
      </div></div>`;
    $$('[data-qc]').forEach(b => b.onclick = () => { quiz.cat = b.dataset.qc; RENDER.quiz(); });
    $('#qStart').onclick = () => {
      const pool = QUIZ.filter(q => quiz.cat==='Todas' || q.c===quiz.cat);
      quiz.qs = shuffleIdx(pool.length).slice(0, Math.min(10, pool.length)).map(i => pool[i]);
      Object.assign(quiz, {state:'run', i:0, ans:null, score:0, wrong:[], order:null}); sfx('tap'); RENDER.quiz();
    };
    return;
  }
  if (quiz.state === 'run') {
    const q = quiz.qs[quiz.i]; if (!quiz.order) quiz.order = shuffleIdx(q.o.length);
    const ans = quiz.ans != null;
    v.innerHTML = `<div class="quiz-wrap stack-v">
      <div class="qprog"><span>Pergunta ${quiz.i+1} de ${quiz.qs.length} · ${q.c}</span><span class="mono">${quiz.score} acertos</span></div>
      <div class="bar"><i style="width:${(quiz.i)/quiz.qs.length*100}%"></i></div>
      <div class="q"><div class="ask">${fmt(q.q)}</div>
        ${quiz.order.map((oi,k)=>`<button class="opt ${ans?(oi===q.a?'right':oi===quiz.ans?'wrong':''):''}" data-o="${oi}" ${ans?'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${fmt(q.o[oi])}</span></button>`).join('')}
        ${ans?`<div class="why ${quiz.ans===q.a?'ok':'no'}"><b>${quiz.ans===q.a?'Correto.':'Resposta certa: '+esc(q.o[q.a])+'.'}</b> ${fmt(q.e)}</div>`:''}
      </div>
      <div class="nav-row"><button class="btn" id="qQuit">Sair</button><button class="btn primary" id="qNext" ${ans?'':'disabled'}>${quiz.i===quiz.qs.length-1?'Ver resultado':'Próxima →'}</button></div></div>`;
    $$('.opt', v).forEach(b => b.onclick = () => {
      quiz.ans = +b.dataset.o;
      if (quiz.ans === q.a) { quiz.score++; sfx('ok'); addXP(10); } else { quiz.wrong.push(q); sfx('no'); }
      RENDER.quiz();
    });
    $('#qQuit').onclick = () => { quiz.state = 'menu'; RENDER.quiz(); };
    $('#qNext').onclick = () => { if (quiz.i < quiz.qs.length-1) { quiz.i++; quiz.ans = null; quiz.order = null; RENDER.quiz(); } else { quiz.state = 'end'; RENDER.quiz(); } };
    return;
  }
  const pct = Math.round(quiz.score / quiz.qs.length * 100);
  if (pct > S.quizBest) S.quizBest = pct;
  if (pct === 100 && quiz.qs.length >= 10) S.quizPerfect = true;
  save(); checkAch(); if (pct >= 70) sfx('win');
  v.innerHTML = `<div class="quiz-wrap stack-v">
    <div class="panel stack-v" style="text-align:center;align-items:center">
      <span class="eyebrow">Resultado</span><div class="score-big">${pct}%</div>
      <p class="muted">${quiz.score} de ${quiz.qs.length} · ${pct===100?'Perfeito!':pct>=70?'Muito bom. Revise os erros abaixo.':'Vale reler o manual e refazer as lições ligadas aos erros.'}</p>
      <div class="row-h" style="justify-content:center"><button class="btn primary" id="qAgain">Novo quiz</button><button class="btn" data-go="regras">Abrir o manual</button></div>
    </div>
    ${quiz.wrong.length?`<h3>Revise</h3>${quiz.wrong.map(q=>`<div class="panel"><b>${fmt(q.q)}</b><p style="margin-top:6px"><span class="pill good">Certa</span> ${fmt(q.o[q.a])}</p><p class="muted" style="margin-top:6px">${fmt(q.e)}</p></div>`).join('')}`:''}
  </div>`;
  $('#qAgain').onclick = () => { quiz.state = 'menu'; RENDER.quiz(); };
};

/* ================= COMBATE ================= */
const KWA = [['fs','Iniciativa'],['ds','Golpe Duplo'],['dt','Toque Mortífero'],['tr','Atropelar'],['ll','Vínculo'],['ind','Indestrutível']];
const KWB = [['fs','Iniciativa'],['ds','Golpe Duplo'],['dt','Toque Mortífero'],['ll','Vínculo'],['ind','Indestrutível']];
const U = (p,t,k='') => ({p,t, ...Object.fromEntries(k.split(' ').filter(Boolean).map(x=>[x,true]))});
const PRESETS = [
  ['Ghalta contra três Centauros', U(12,12,'tr'), [U(3,3),U(3,3),U(3,3)]],
  ['Dreadmaw com Toque Mortífero contra Mastodonte', U(6,6,'tr dt'), [U(3,5)]],
  ['Cavaleiro com Iniciativa contra Ursos', U(2,2,'fs'), [U(2,2)]],
  ['Golpe Duplo + Atropelar contra um 2/2', U(4,4,'ds tr'), [U(2,2)]],
  ['Nighthawk contra Aranha', U(2,3,'dt ll'), [U(2,4)]],
  ['Iniciativa dos dois lados', U(3,3,'fs'), [U(2,2,'fs')]],
  ['Atropelar contra indestrutível', U(5,5,'tr'), [U(0,1,'ind')]],
  ['Ataque sem bloqueio', U(3,3,'ll'), []]
];
let calc = {a:{...PRESETS[0][1]}, b:PRESETS[0][2].map(x=>({...x})), lifeA:20, lifeD:20, preset:0};

function combat(a, bs, lifeA, lifeD){
  const A = {...a, name:'Atacante', dmg:0, dtHit:false, dead:false};
  const B = bs.map((b,i)=>({...b, name:'Bloqueador '+(i+1), dmg:0, dtHit:false, dead:false}));
  const all = [A, ...B]; const anyFS = all.some(u=>u.fs||u.ds);
  const steps = anyFS ? ['first','normal'] : ['normal'];
  const blocked = B.length > 0;
  let toPlayer = 0, gainA = 0, gainD = 0; const log = [];
  for (const st of steps) {
    const deals = u => !u.dead && (st==='first' ? (u.fs||u.ds) : (!u.fs || u.ds));
    const ev = [], lines = [];
    if (deals(A) && A.p > 0) {
      if (!blocked) { ev.push({src:A, tgt:'P', amt:A.p}); lines.push(`O atacante causa <b>${A.p}</b> ao jogador defensor.`); }
      else {
        const alive = B.filter(b=>!b.dead);
        if (!alive.length) {
          if (A.tr) { ev.push({src:A,tgt:'P',amt:A.p}); lines.push(`Não sobrou bloqueador: com Atropelar, os <b>${A.p}</b> vão inteiros para o jogador.`); }
          else lines.push('O atacante continua bloqueado mesmo sem bloqueadores vivos e, sem Atropelar, não causa dano.');
        } else {
          let rem = A.p; const need = b => { const left = Math.max(0, b.t - b.dmg); return A.dt ? Math.min(1,left) : left; };
          const order = [...alive].sort((x,y)=>need(x)-need(y)); const parts = [];
          for (const b of order) { const n = Math.min(rem, need(b)); if (n > 0) { ev.push({src:A,tgt:b,amt:n}); parts.push(`${n} em ${b.name}`); rem -= n; } }
          if (rem > 0) {
            if (A.tr) { ev.push({src:A,tgt:'P',amt:rem}); parts.push(`<b>${rem}</b> atropelam para o jogador`); }
            else { ev.push({src:A,tgt:order[0],amt:rem}); parts.push(`${rem} a mais em ${order[0].name} (sem Atropelar, o excesso fica nos bloqueadores)`); }
          }
          lines.push(`O atacante divide <b>${A.p}</b>${A.dt?' (Toque Mortífero: 1 já é letal)':''}: ${parts.join(', ') || 'nenhum dano'}.`);
        }
      }
    }
    if (blocked && !A.dead) B.forEach(b => { if (deals(b) && b.p > 0) { ev.push({src:b,tgt:A,amt:b.p}); lines.push(`${b.name} causa <b>${b.p}</b> ao atacante${b.dt?' (Toque Mortífero)':''}.`); } });
    if (!ev.length && !lines.length) continue;
    ev.forEach(e => {
      if (e.tgt === 'P') toPlayer += e.amt; else { e.tgt.dmg += e.amt; if (e.src.dt) e.tgt.dtHit = true; }
      if (e.src.ll) { if (e.src === A) gainA += e.amt; else gainD += e.amt; }
    });
    const lls = ev.filter(e=>e.src.ll); if (lls.length) { const s = {}; lls.forEach(e=>s[e.src.name]=(s[e.src.name]||0)+e.amt); Object.entries(s).forEach(([n,v])=>lines.push(`Vínculo com a vida: o controlador de ${n} ganha <b>${v}</b>.`)); }
    all.forEach(u => {
      if (u.dead) return;
      if (u.t <= 0) { u.dead = true; lines.push(`${u.name} vai ao cemitério (resistência 0).`); return; }
      const lethal = u.dmg >= u.t || u.dtHit;
      if (lethal && u.ind) lines.push(`${u.name} tem dano letal, mas é Indestrutível e fica no campo.`);
      else if (lethal) { u.dead = true; lines.push(`${u.name} é destruído (${u.dtHit && u.dmg < u.t ? 'Toque Mortífero' : `${u.dmg} de dano ≥ resistência ${u.t}`}).`); }
    });
    log.push({title: st==='first' ? 'Passo de dano de Iniciativa' : (anyFS ? 'Passo de dano normal' : 'Dano de combate'), lines});
  }
  return {A, B, toPlayer, gainA, gainD, log, lifeA: lifeA + gainA, lifeD: lifeD - toPlayer + gainD};
}

RENDER.combate = function(){
  $('#v-combate').innerHTML = `
   <button class="btn small" data-go="treino" style="margin-bottom:12px">← Voltar ao Treino</button>
   <div class="view-head"><h1>Calculadora de combate</h1><p>Monte qualquer luta e veja, passo a passo, quem causa dano, quem morre e quanto chega ao jogador. Entende Iniciativa, Golpe Duplo, Toque Mortífero, Atropelar, Vínculo com a vida e Indestrutível.</p></div>
   <div class="calc">
     <div class="stack-v">
       <label class="f" for="preset">Cenário pronto
         <select id="preset">${PRESETS.map((p,i)=>`<option value="${i}" ${calc.preset===i?'selected':''}>${p[0]}</option>`).join('')}<option value="-1" ${calc.preset===-1?'selected':''}>Personalizado</option></select></label>
       <div class="unit" style="border-color:var(--bad)"><div class="unit-head"><b>Atacante</b>
         <div class="pt-in"><input type="number" id="aP" min="0" max="99" value="${calc.a.p}" aria-label="Poder do atacante"><span class="mono">/</span><input type="number" id="aT" min="0" max="99" value="${calc.a.t}" aria-label="Resistência do atacante"></div></div>
         <div class="kws">${KWA.map(([k,l])=>`<button class="chip" data-ak="${k}" aria-pressed="${!!calc.a[k]}">${l}</button>`).join('')}</div></div>
       <div id="blockers" class="stack-v">${calc.b.map((b,i)=>`
         <div class="unit" style="border-color:var(--info)"><div class="unit-head"><b>Bloqueador ${i+1}</b>
           <div class="pt-in"><input type="number" data-bp="${i}" min="0" max="99" value="${b.p}" aria-label="Poder do bloqueador ${i+1}"><span class="mono">/</span><input type="number" data-bt="${i}" min="0" max="99" value="${b.t}" aria-label="Resistência do bloqueador ${i+1}"><button class="icon-btn" data-rm="${i}" aria-label="Remover bloqueador ${i+1}">✕</button></div></div>
           <div class="kws">${KWB.map(([k,l])=>`<button class="chip" data-bk="${i}:${k}" aria-pressed="${!!b[k]}">${l}</button>`).join('')}</div></div>`).join('')}</div>
       <button class="btn" id="addB" ${calc.b.length>=5?'disabled':''}>+ Adicionar bloqueador</button>
       <div class="grid g2"><label class="f" for="lA">Vida do atacante<input type="number" id="lA" value="${calc.lifeA}"></label><label class="f" for="lD">Vida do defensor<input type="number" id="lD" value="${calc.lifeD}"></label></div>
     </div>
     <div class="stack-v" id="calcOut"></div>
   </div>`;
  const custom = () => { calc.preset = -1; $('#preset').value = '-1'; };
  $('#preset').onchange = e => { const i = +e.target.value; if (i >= 0) { if (!S.calc) { S.calc = true; save(); checkAch(); } calc.preset = i; calc.a = {...PRESETS[i][1]}; calc.b = PRESETS[i][2].map(x=>({...x})); } RENDER.combate(); };
  $('#aP').oninput = e => { calc.a.p = +e.target.value||0; custom(); outCalc(true); };
  $('#aT').oninput = e => { calc.a.t = +e.target.value||0; custom(); outCalc(true); };
  $$('[data-ak]').forEach(b => b.onclick = () => { const k = b.dataset.ak; calc.a[k] = !calc.a[k]; b.setAttribute('aria-pressed', calc.a[k]); custom(); outCalc(true); });
  $$('[data-bp]').forEach(i => i.oninput = e => { calc.b[+i.dataset.bp].p = +e.target.value||0; custom(); outCalc(true); });
  $$('[data-bt]').forEach(i => i.oninput = e => { calc.b[+i.dataset.bt].t = +e.target.value||0; custom(); outCalc(true); });
  $$('[data-bk]').forEach(b => b.onclick = () => { const [i,k] = b.dataset.bk.split(':'); calc.b[i][k] = !calc.b[i][k]; b.setAttribute('aria-pressed', calc.b[i][k]); custom(); outCalc(true); });
  $$('[data-rm]').forEach(b => b.onclick = () => { calc.b.splice(+b.dataset.rm,1); custom(); RENDER.combate(); });
  $('#addB').onclick = () => { calc.b.push(U(2,2)); custom(); RENDER.combate(); };
  $('#lA').oninput = e => { calc.lifeA = +e.target.value||0; outCalc(true); };
  $('#lD').oninput = e => { calc.lifeD = +e.target.value||0; outCalc(true); };
  outCalc();
};
function outCalc(user){
  const r = combat(calc.a, calc.b, calc.lifeA, calc.lifeD);
  if (!S.calc && user) { S.calc = true; save(); checkAch(); }
  const kwl = (u, list) => list.filter(([k])=>u[k]).map(([,l])=>l).join(' · ');
  const tok = (u, cls, list) => `<div class="tok ${cls} ${u.dead?'dead':''}"><span class="tn">${u.name}</span><span class="tp">${u.p}/${u.t}</span><span class="tk">${kwl(u,list)}</span><span class="td">${u.dmg?`−${u.dmg} dano`:''}</span></div>`;
  $('#calcOut').innerHTML = `
    <div class="tokens">
      <div class="tok-row">${r.B.length ? r.B.map(b=>tok(b,'blk',KWB)).join('') : '<span class="muted" style="color:inherit;opacity:.7">Sem bloqueadores</span>'}</div>
      <span class="vs">contra</span>
      <div class="tok-row">${tok(r.A,'att',KWA)}</div>
    </div>
    <div class="result-chips">
      <span class="pill ${r.A.dead?'bad':'good'}">Atacante ${r.A.dead?'morre':'sobrevive'}</span>
      ${r.B.length?`<span class="pill ${r.B.every(b=>b.dead)?'good':'warn'}">${r.B.filter(b=>b.dead).length}/${r.B.length} bloqueadores morrem</span>`:''}
      <span class="pill ${r.toPlayer?'bad':''}">${r.toPlayer} de dano ao jogador</span>
    </div>
    <div class="grid g2">
      <div class="stat"><div class="k">Vida do defensor</div><div class="v">${calc.lifeD} → ${r.lifeD}</div></div>
      <div class="stat"><div class="k">Vida do atacante</div><div class="v">${calc.lifeA} → ${r.lifeA}</div></div>
    </div>
    <div class="panel"><h3>Passo a passo</h3><div class="log">${r.log.length ? r.log.map(s=>`<div class="log-step"><h4>${s.title}</h4><ul>${s.lines.map(l=>`<li>${l}</li>`).join('')}</ul></div>`).join('') : '<p class="muted">Ninguém causa dano.</p>'}</div>
    ${r.B.length>1?'<p class="muted" style="margin-top:10px;font-size:.9rem">A calculadora divide o dano do atacante para matar o maior número possível de bloqueadores, começando pelos mais fáceis. Na mesa, o atacante pode escolher outra divisão.</p>':''}</div>`;
}

/* ================= DECKS ================= */
let deckTab = 'analise', deckFormat = '60', deckText = SAMPLE_DECK, DECK = null, hand = null;
const KIND_COL = {creature:'var(--g)',instant:'var(--u)',sorcery:'var(--r)',enchantment:'var(--w)',artifact:'var(--c)',planeswalker:'var(--m)',battle:'var(--b)',land:'var(--muted)',other:'var(--line)',unknown:'var(--line)'};
const BASICS = ['plains','island','swamp','mountain','forest','wastes','snow-covered plains','snow-covered island','snow-covered swamp','snow-covered mountain','snow-covered forest'];

RENDER.decks = function(){
  $('#v-decks').innerHTML = `
   <div class="view-head"><h1>Forja de decks</h1><p>Cole sua lista e receba curva de mana, cores, recomendação de terrenos e alertas. Depois teste mãos iniciais e calcule probabilidades.</p></div>
   <div class="seg" role="tablist">${[['entenda','Entenda seu deck'],['analise','Analisador'],['mao','Mão inicial'],['prob','Probabilidade'],['base','Base de mana'],['sugestoes','Sugestões'],['orcamento','Orçamento'],['comparar','Comparar listas'],['colecao','Minha coleção'],['desejos','Lista de desejos'],['desafios','Desafios'],['famosos','Decks famosos'],['arena','Central do Arena'],['guia','Guia de construção']].map(([k,l])=>`<button role="tab" data-dt="${k}" aria-selected="${deckTab===k}">${l}</button>`).join('')}</div>
   <div id="deckBody"></div>`;
  $$('[data-dt]').forEach(b => b.onclick = () => { deckTab = b.dataset.dt; RENDER.decks(); });
  ({entenda:renderEntenda, analise:renderAnalyzer, mao:renderHand, prob:renderProb, base:renderManaBase, sugestoes:renderSuggest, colecao:renderColl, desejos:renderWish, orcamento:renderBudget, comparar:renderCompare, desafios:renderChal, famosos:renderFamous, arena:renderArenaHub, guia:renderGuide})[deckTab]();
};

function parseDeck(txt){
  const map = new Map(); let side = false;
  for (const raw of txt.split(/\r?\n/)) {
    const l = raw.trim(); if (!l) continue;
    if (/^(sideboard|reserva|side)\b/i.test(l)) { side = true; continue; }
    if (/^(\/\/|#|deck$|deck\b:|commander$|comandante$|companion$|maindeck$|main$)/i.test(l)) continue;
    if (side) continue;
    const m = l.match(/^(\d+)\s*x?\s+(.+)$/i);
    let q = 1, name = l; if (m) { q = +m[1]; name = m[2]; }
    name = name.replace(/\s+\([A-Za-z0-9]{2,6}\)(\s+[\w-]+)?\s*$/,'').replace(/\s+\*F\*\s*$/,'').trim();
    if (!name) continue;
    const k = name.toLowerCase(); const e = map.get(k);
    if (e) e.q += q; else map.set(k, {name, q});
  }
  return [...map.values()];
}
const kindOf = tl => /\bLand\b/.test(tl) && !/\bCreature\b/.test(tl) ? 'land' : /Creature/.test(tl) ? 'creature' : /Planeswalker/.test(tl) ? 'planeswalker' : /Battle/.test(tl) ? 'battle' : /Instant/.test(tl) ? 'instant' : /Sorcery/.test(tl) ? 'sorcery' : /Artifact/.test(tl) ? 'artifact' : /Enchantment/.test(tl) ? 'enchantment' : /Land/.test(tl) ? 'land' : 'other';
function fromScry(c){
  const f = c.card_faces ? c.card_faces[0] : c;
  const tl = f.type_line || c.type_line || ''; const k = kindOf(tl);
  const colors = c.colors || f.colors || [];
  const pw = c.power ?? f.power, tg = c.toughness ?? f.toughness;
  return {k, c:c.mana_cost || f.mana_cost || '', t:c.type_line || tl, x:(c.oracle_text || f.oracle_text || '').replace(/\n/g,' '),
    p: pw!=null ? `${pw}/${tg}` : undefined, l: c.loyalty || f.loyalty, col: colors.length>1 ? 'M' : (colors[0] || (k==='land'?'L':'C')),
    cmc: c.cmc || 0, img: (c.image_uris && c.image_uris.normal) || (f.image_uris && f.image_uris.normal), ext:true};
}
async function resolveCards(names, status){
  const missing = names.filter(n => !cardData(n));
  if (!missing.length) return {offline:false, notFound:[]};
  const notFound = []; let offline = false;
  for (let i = 0; i < missing.length; i += 75) {
    const chunk = missing.slice(i, i+75);
    status(`Buscando ${missing.length} carta(s) no Scryfall…`);
    try {
      const r = await fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: chunk.map(name=>({name}))})});
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      (j.data||[]).forEach(c => {
        const d = fromScry(c); CARDS[c.name] = d; CARD_ALIAS[c.name.toLowerCase()] = c.name; if (d.img) IMG[c.name.toLowerCase()] = d.img;
        if (c.card_faces) CARD_ALIAS[c.card_faces[0].name.toLowerCase()] = c.name;
      });
      (j.not_found||[]).forEach(nf => notFound.push(nf.name));
      if (i + 75 < missing.length) await new Promise(res => setTimeout(res, 120));
    } catch(e) { offline = true; chunk.forEach(n => notFound.push(n)); }
  }
  return {offline, notFound};
}
function pips(cost){ const o = {W:0,U:0,B:0,R:0,G:0}; (cost||'').replace(/\{([^}]+)\}/g, (_, s) => { for (const ch of 'WUBRG') if (s.toUpperCase().includes(ch)) o[ch]++; }); return o; }

function analyze(entries){
  const res = {entries:[], total:0, kinds:{}, curve:Array(8).fill(0).map(()=>({cr:0,ot:0})), pips:{W:0,U:0,B:0,R:0,G:0}, lands:0, nonland:0, cmcSum:0, unknown:[], over4:[], names:[]};
  entries.forEach(e => {
    const d = cardData(e.name); const realName = d ? (CARD_ALIAS[e.name.toLowerCase()] || e.name) : e.name;
    let k = d ? d.k : (BASICS.includes(e.name.toLowerCase()) ? 'land' : 'unknown');
    res.entries.push({name:realName, q:e.q, k, d});
    res.total += e.q; res.kinds[k] = (res.kinds[k]||0) + e.q;
    for (let i=0;i<e.q;i++) res.names.push({name:realName, k, cmc: d ? d.cmc : 0});
    if (!d && k === 'unknown') res.unknown.push(e.name);
    if (e.q > 4 && !BASICS.includes(realName.toLowerCase()) && !(d && /Basic/.test(d.t||'')) && !/any number of cards named/i.test(d?d.x:'')) res.over4.push(realName);
    if (k === 'land') { res.lands += e.q; return; }
    if (k === 'unknown') return;
    res.nonland += e.q; res.cmcSum += d.cmc * e.q;
    const b = Math.min(7, Math.round(d.cmc)); res.curve[b][k==='creature'?'cr':'ot'] += e.q;
    const p = pips(d.c); for (const c in p) res.pips[c] += p[c] * e.q;
  });
  res.avg = res.nonland ? res.cmcSum / res.nonland : 0;
  return res;
}
function recLands(fmt, avg){
  if (fmt === '40') return Math.round((19.59 + 1.90*avg) * 40/60);
  if (fmt === '100') return Math.round(31.42 + 3.13*avg);
  return Math.round(19.59 + 1.90*avg);
}
function splitLands(p, n){
  const tot = Object.values(p).reduce((a,b)=>a+b,0); if (!tot) return {};
  const raw = Object.entries(p).filter(([,v])=>v).map(([c,v])=>({c, x:v/tot*n}));
  raw.forEach(r => r.f = Math.floor(r.x)); let left = n - raw.reduce((a,r)=>a+r.f,0);
  raw.sort((a,b)=>(b.x-b.f)-(a.x-a.f)).forEach(r => { if (left > 0) { r.f++; left--; } });
  return Object.fromEntries(raw.map(r=>[r.c, r.f]));
}
const LAND_NAME = {W:'Planícies',U:'Ilhas',B:'Pântanos',R:'Montanhas',G:'Florestas'};

function renderAnalyzer(){
  $('#deckBody').innerHTML = `
   <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
     <div class="panel stack-v">
       <label class="f" for="fmtSel">Formato
         <select id="fmtSel"><option value="60" ${deckFormat==='60'?'selected':''}>Construído (60 cards)</option><option value="40" ${deckFormat==='40'?'selected':''}>Limitado (40 cards)</option><option value="100" ${deckFormat==='100'?'selected':''}>Commander (100 cards)</option></select></label>
       <label class="f" for="deckTxt">Lista do deck <span style="font-weight:400">Uma carta por linha, como "4 Lightning Bolt". Aceita exportação do Arena e do MTGO, com nomes em inglês.</span>
         <textarea id="deckTxt" rows="16" spellcheck="false">${esc(deckText)}</textarea></label>
       <div class="row-h"><button class="btn primary" id="btnAnalyze">Analisar deck</button><button class="btn" id="btnSample">Usar exemplo</button><button class="btn" id="btnClear">Limpar</button></div>
       <p class="muted" id="anStatus" style="font-size:.9rem">Cartas fora da base local são buscadas no Scryfall (precisa de internet).</p>
     </div>
     <div id="anOut" class="stack-v"></div>
   </div>`;
  $('#fmtSel').onchange = e => { deckFormat = e.target.value; if (DECK) drawAnalysis(); };
  $('#deckTxt').oninput = e => deckText = e.target.value;
  $('#btnSample').onclick = () => { deckText = SAMPLE_DECK; deckFormat = '60'; renderAnalyzer(); runAnalyze(); };
  $('#btnClear').onclick = () => { deckText = ''; $('#deckTxt').value = ''; $('#deckTxt').focus(); };
  $('#btnAnalyze').onclick = runAnalyze;
  if (DECK) drawAnalysis(); else runAnalyze();
}
async function runAnalyze(){
  const st = m => { const el = $('#anStatus'); if (el) el.textContent = m; };
  const entries = parseDeck(deckText);
  if (!entries.length) { st('A lista está vazia. Cole uma carta por linha, por exemplo "4 Lightning Bolt".'); return; }
  const btn = $('#btnAnalyze'); if (btn) btn.disabled = true;
  const r = await resolveCards(entries.map(e=>e.name), st);
  if (btn) btn.disabled = false;
  DECK = analyze(entries); hand = null;
  st(r.offline ? 'Sem conexão com o Scryfall: cartas fora da base local ficaram como "desconhecidas".' : r.notFound.length ? `Não encontrei: ${r.notFound.join(', ')}. Confira a grafia (nomes em inglês).` : 'Análise pronta.');
  if (!S.deck && deckText.trim() !== SAMPLE_DECK.trim()) { S.deck = true; save(); checkAch(); }
  drawAnalysis();
}
function curveSVG(curve){
  const W = 360, H = 170, pad = 24, bw = (W - pad*2) / 8;
  const max = Math.max(1, ...curve.map(c=>c.cr+c.ot)); const sc = (H - 50) / max;
  let g = '';
  for (let y = 0; y <= max; y += Math.max(1, Math.ceil(max/4))) { const yy = H - 24 - y*sc; g += `<line x1="${pad}" x2="${W-pad}" y1="${yy}" y2="${yy}" stroke="var(--line)" stroke-width="1"/><text x="${pad-6}" y="${yy+4}" text-anchor="end">${y}</text>`; }
  curve.forEach((c,i) => {
    const x = pad + i*bw + 5, w = bw - 10, hc = c.cr*sc, ho = c.ot*sc, base = H - 24;
    if (c.cr) g += `<rect x="${x}" y="${base-hc}" width="${w}" height="${hc}" rx="3" fill="var(--g)"/>`;
    if (c.ot) g += `<rect x="${x}" y="${base-hc-ho}" width="${w}" height="${ho}" rx="3" fill="var(--u)"/>`;
    if (c.cr+c.ot) g += `<text class="lab" x="${x+w/2}" y="${base-hc-ho-6}" text-anchor="middle">${c.cr+c.ot}</text>`;
    g += `<text x="${x+w/2}" y="${H-8}" text-anchor="middle">${i===7?'7+':i}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva de mana">${g}</svg>`;
}
function drawAnalysis(){
  const R = DECK, out = $('#anOut'); if (!out) return;
  const target = +deckFormat, rec = recLands(deckFormat, R.avg);
  const split = splitLands(R.pips, R.lands || rec);
  const checks = [];
  const add = (lvl, txt) => checks.push(`<li><span class="pill ${lvl}">${lvl==='good'?'ok':lvl==='warn'?'atenção':'problema'}</span><span>${txt}</span></li>`);
  if (deckFormat === '100') R.total === 100 ? add('good','Exatamente 100 cards.') : add('bad', `Commander pede exatamente 100 cards (o comandante incluso). Você tem ${R.total}.`);
  else R.total < target ? add('bad', `Faltam ${target - R.total} cards para o mínimo de ${target}.`) : R.total > target + 2 ? add('warn', `${R.total} cards. Ficar no mínimo (${target}) aumenta a chance de comprar suas melhores cartas.`) : add('good', `${R.total} cards: tamanho ideal.`);
  const diff = R.lands - rec;
  Math.abs(diff) <= 1 ? add('good', `${R.lands} terrenos, perto da estimativa de ${rec} para custo médio ${R.avg.toFixed(2)}.`) : diff < 0 ? add('warn', `${R.lands} terrenos. A estimativa é ${rec}; com menos, você trava sem mana com mais frequência${R.kinds.creature && R.names.some(n=>/Llanowar|Elves/.test(n.name)) ? ' (aceleradores de mana compensam um pouco)' : ''}.`) : add('warn', `${R.lands} terrenos, acima da estimativa de ${rec}. Risco de "flood".`);
  const lim = deckFormat === '100' ? 1 : 4;
  if (deckFormat === '100') { const dup = R.entries.filter(e=>e.q>1 && e.k!=='land' && !BASICS.includes(e.name.toLowerCase())); dup.length ? add('bad', `Commander só permite 1 cópia: ${dup.map(e=>esc(e.name)).join(', ')}.`) : add('good','Nenhuma cópia repetida.'); }
  else R.over4.length ? add('bad', `Mais de ${lim} cópias: ${R.over4.map(esc).join(', ')}.`) : add('good', `Respeita o limite de ${lim} cópias.`);
  const top = R.curve.slice(5).reduce((a,c)=>a+c.cr+c.ot,0), low = R.curve.slice(0,3).reduce((a,c)=>a+c.cr+c.ot,0);
  top > R.nonland * .25 ? add('warn', `${top} mágicas custam 5 ou mais. Garanta jogadas baratas para os primeiros turnos.`) : add('good', `${low} mágicas custam 2 ou menos: bom início de jogo.`);
  const cr = R.kinds.creature || 0;
  cr < (deckFormat==='40'?12:deckFormat==='100'?20:12) ? add('warn', `Só ${cr} criaturas. Faz sentido em decks de controle, mas é pouco para a maioria.`) : add('good', `${cr} criaturas.`);
  const inter = (R.kinds.instant||0);
  inter < 4 ? add('warn', `${inter} instantâneos: pouca interação no turno do oponente.`) : add('good', `${inter} instantâneos para reagir.`);
  const ncol = Object.values(R.pips).filter(v=>v).length;
  if (ncol >= 3) add('warn', `${ncol} cores. Considere terrenos que geram mais de uma cor.`);
  if (R.unknown.length) add('warn', `Não reconhecidas: ${R.unknown.map(esc).join(', ')}. Elas ficaram fora da curva.`);
  const kindsOrder = ['creature','instant','sorcery','enchantment','artifact','planeswalker','battle','land','other','unknown'];
  const maxK = Math.max(...Object.values(R.kinds));
  const pipTot = Object.values(R.pips).reduce((a,b)=>a+b,0);
  out.innerHTML = `
    <div class="tiles">
      <div class="stat"><div class="k">Cards</div><div class="v">${R.total}</div></div>
      <div class="stat"><div class="k">Terrenos</div><div class="v">${R.lands} <span class="muted" style="font-size:.9rem">/ ${rec} est.</span></div></div>
      <div class="stat"><div class="k">Custo médio</div><div class="v">${R.avg.toFixed(2)}</div></div>
      <div class="stat"><div class="k">Criaturas</div><div class="v">${cr}</div></div>
    </div>
    <div class="panel"><h3>Diagnóstico</h3><ul class="checks">${checks.join('')}</ul></div>
    <div class="panel chart"><h3>Curva de mana</h3><div class="row-h muted" style="font-size:.85rem;margin-bottom:6px"><span><span class="ms" style="background:var(--g)"></span> criaturas</span><span><span class="ms" style="background:var(--u)"></span> outras mágicas</span></div>${curveSVG(R.curve)}</div>
    <div class="grid g2">
      <div class="panel stack-v"><h3>Tipos</h3>${kindsOrder.filter(k=>R.kinds[k]).map(k=>`<div class="hbar"><span>${k==='unknown'?'Desconhecido':KIND_PT[k]}</span><span class="track"><i style="width:${R.kinds[k]/maxK*100}%;background:${KIND_COL[k]}"></i></span><span class="mono" style="text-align:right">${R.kinds[k]}</span></div>`).join('')}</div>
      <div class="panel stack-v"><h3>Cores</h3>${pipTot ? Object.entries(R.pips).filter(([,v])=>v).map(([c,v])=>`<div class="hbar"><span>${manaSym(c)} ${Math.round(v/pipTot*100)}%</span><span class="track"><i style="width:${v/pipTot*100}%;background:var(--${c.toLowerCase()})"></i></span><span class="mono" style="text-align:right">${v}</span></div>`).join('') : '<p class="muted">Sem símbolos coloridos.</p>'}
        ${pipTot?`<p class="muted" style="font-size:.9rem">Divisão sugerida de ${R.lands||rec} básicos pelos símbolos de mana: <b>${Object.entries(split).map(([c,n])=>`${n} ${LAND_NAME[c]}`).join(', ')}</b>.</p>`:''}</div>
    </div>
    <div class="panel"><div class="row-h" style="justify-content:space-between;margin-bottom:8px"><h3>Lista</h3><span class="row-h" style="gap:6px"><button class="btn small" id="toArena">Levar ao Arena</button><button class="btn small" id="toHand">Testar mãos iniciais →</button></span></div>
      <div class="cardlist">${R.entries.sort((a,b)=>kindsOrder.indexOf(a.k)-kindsOrder.indexOf(b.k)).map(e=>`<div><span class="qt">${e.q}</span><span class="nm">${e.d?`<button class="cref" data-card="${esc(e.name)}">${esc(e.name)}</button>`:`<span class="muted">${esc(e.name)}</span>`}</span><span>${e.d?mana(e.d.c):''}</span></div>`).join('')}</div></div>
    <p class="muted" style="font-size:.85rem">A estimativa de terrenos usa a fórmula de Frank Karsten baseada no custo médio das mágicas. É um ponto de partida: aceleradores de mana e compra barata permitem jogar um pouco menos.</p>`;
  $('#toHand').onclick = () => { deckTab = 'mao'; RENDER.decks(); };
  $('#toArena').onclick = () => { deckTab = 'arena'; RENDER.decks(); };
}

/* --- mão inicial --- */
function shuffled(arr){ const a = arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function newHand(mull){
  const lib = shuffled(DECK.names);
  hand = {cards: lib.slice(0,7), lib: lib.slice(7), mull, kept:false, picked:new Set()};
}
function evalHand(cards){
  const L = cards.filter(c=>c.k==='land').length, cheap = cards.filter(c=>c.k!=='land' && c.cmc<=2).length, n = cards.length;
  if (L <= 1) return ['bad', `${L} terreno${L===1?'':'s'}: alto risco de travar. Mulligan, a não ser que a mão seja quase toda de custo 1.`];
  if (L >= n - 1) return ['bad', `${L} terrenos em ${n} cards: quase nada para fazer. Mulligan.`];
  if (L === 2 && cheap === 0) return ['warn', '2 terrenos e nenhuma jogada barata: arriscado. Em aggro, mulligan; em outros decks, depende de quem joga primeiro.'];
  if (L >= 5 && n === 7) return ['warn', `${L} terrenos: mantém, mas com pouca ação. Aceitável em decks de controle e ramp.`];
  return ['good', `${L} terrenos e ${n-L} mágicas${cheap?` (${cheap} de custo até 2)`:''}: mão boa para manter.`];
}
function renderHand(){
  if (!DECK) { DECK = analyze(parseDeck(deckText)); }
  if (!hand) newHand(0);
  const total = DECK.names.length, lands = DECK.names.filter(c=>c.k==='land').length;
  const need = hand.kept ? hand.mull : 0, picking = hand.kept && hand.picked.size < need && hand.cards.length > 7 - need;
  const finalCards = hand.kept && hand.cards.length === 7 - hand.mull ? hand.cards : null;
  const ev = finalCards ? evalHand(finalCards) : evalHand(hand.cards);
  const pKeep = [2,3,4,5].reduce((a,k)=>a+hyp(total,lands,7,k),0);
  const p3 = 1 - [0,1,2].reduce((a,k)=>a+hyp(total,lands,9,k),0);
  $('#deckBody').innerHTML = `
   <div class="stack-v">
     <div class="panel stack-v">
       <div class="row-h" style="justify-content:space-between"><div><h3>Mão de teste</h3><p class="muted">Deck atual: ${total} cards, ${lands} terrenos. Mulligans: <b class="mono">${hand.mull}</b> (London).</p></div>
       <div class="row-h"><button class="btn" id="hNew">Nova mão</button>${!hand.kept?`<button class="btn" id="hMull" ${hand.mull>=4?'disabled':''}>Mulligan</button><button class="btn primary" id="hKeep">Manter</button>`:''}</div></div>
       ${picking?`<div class="tip">Escolha <b>${need - hand.picked.size}</b> card(s) para colocar no fundo do grimório (toque nas cartas).${hand.picked.size===need?'':''}</div>`:''}
       <div class="hand-row" id="handRow">${hand.cards.map((c,i)=>cardHTML(c.name,{cls:hand.picked.has(i)?'picked':'', showPt:false})).join('')}</div>
       ${hand.kept && hand.mull && hand.picked.size===need && hand.cards.length===7 ? `<button class="btn primary" id="hBottom">Colocar ${need} no fundo</button>` : ''}
       <div class="why ${ev[0]==='good'?'ok':'no'}" style="${ev[0]==='warn'?'border-color:var(--warn);background:color-mix(in srgb,var(--warn) 12%,transparent)':''}"><b>${finalCards?'Mão final':'Avaliação'}:</b> ${ev[1]}${hand.mull&&!finalCards?' Com mulligan, seja mais tolerante: uma mão de 6 razoável costuma ser melhor que arriscar 5.':''}</div>
     </div>
     <div class="grid g2">
       <div class="panel stack-v"><h3>Números do seu deck</h3>
         <div class="hbar"><span>2 a 5 terrenos na mão de 7</span><span class="track"><i style="width:${pKeep*100}%;background:var(--good)"></i></span><span class="mono">${(pKeep*100).toFixed(0)}%</span></div>
         <div class="hbar"><span>3+ terrenos até o turno 3 (jogando primeiro)</span><span class="track"><i style="width:${p3*100}%;background:var(--info)"></i></span><span class="mono">${(p3*100).toFixed(0)}%</span></div>
         <p class="muted" style="font-size:.88rem">Cálculo exato (hipergeométrico). Jogando primeiro, até o turno 3 você vê 9 cards.</p>
       </div>
       <div class="panel stack-v chart"><div class="row-h" style="justify-content:space-between"><h3>Simulação em massa</h3><button class="btn small" id="hSim">Simular 10.000 mãos</button></div><div id="simOut"><p class="muted">Distribuição de terrenos nas mãos de 7 cards.</p></div></div>
     </div>
   </div>`;
  $('#hNew').onclick = () => { newHand(0); sfx('tap'); renderHand(); };
  const mb = $('#hMull'); if (mb) mb.onclick = () => { newHand(hand.mull+1); sfx('tap'); renderHand(); };
  const kb = $('#hKeep'); if (kb) kb.onclick = () => { hand.kept = true; if (!S.hand) { S.hand = true; save(); checkAch(); } sfx('ok'); renderHand(); };
  if (picking || (hand.kept && hand.mull && hand.cards.length===7)) $$('#handRow .mcard').forEach((el,i) => el.onclick = () => {
    if (hand.picked.has(i)) hand.picked.delete(i); else if (hand.picked.size < need) hand.picked.add(i);
    renderHand();
  });
  if (!(picking || (hand.kept && hand.mull && hand.cards.length===7))) $$('#handRow .mcard').forEach(el => el.onclick = () => openCard(el.dataset.card));
  const bb = $('#hBottom'); if (bb) bb.onclick = () => { const bottom = hand.cards.filter((_,i)=>hand.picked.has(i)); hand.cards = hand.cards.filter((_,i)=>!hand.picked.has(i)); hand.lib.push(...bottom); hand.picked = new Set(); sfx('ok'); renderHand(); };
  $('#hSim').onclick = () => simHands(lands, total);
}
function simHands(lands, total){
  const N = 10000, hist = Array(8).fill(0); const arr = DECK.names.map(c=>c.k==='land'?1:0);
  for (let s=0;s<N;s++){ let L=0; const a = arr.slice(); for (let i=0;i<7;i++){ const j = i + Math.floor(Math.random()*(a.length-i)); [a[i],a[j]]=[a[j],a[i]]; L += a[i]; } hist[L]++; }
  const W=360,H=160,pad=24,bw=(W-pad*2)/8, max=Math.max(...hist), sc=(H-48)/max;
  let g=''; hist.forEach((v,i)=>{ const x=pad+i*bw+5,w=bw-10,h=v*sc, good=i>=2&&i<=5;
    g+=`<rect x="${x}" y="${H-24-h}" width="${w}" height="${h}" rx="3" fill="${good?'var(--good)':'var(--bad)'}" opacity="${good?1:.7}"/>`;
    g+=`<text class="lab" x="${x+w/2}" y="${H-28-h}" text-anchor="middle">${(v/N*100).toFixed(0)}%</text><text x="${x+w/2}" y="${H-8}" text-anchor="middle">${i}</text>`; });
  const keep = hist.slice(2,6).reduce((a,b)=>a+b,0)/N*100;
  $('#simOut').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histograma de terrenos">${g}</svg><p class="muted" style="font-size:.88rem">Eixo: número de terrenos na mão. Verde = mãos jogáveis (2 a 5). Resultado: <b class="mono">${keep.toFixed(1)}%</b> mantíveis sem mulligan.</p>`;
  sfx('ok');
}

/* --- probabilidade --- */
const LF = [0]; for (let i=1;i<=400;i++) LF[i] = LF[i-1] + Math.log(i);
const lC = (n,k) => k<0||k>n ? -Infinity : LF[n]-LF[k]-LF[n-k];
function hyp(N,K,n,k){ if (k<0||k>K||n-k>N-K||n>N) return 0; return Math.exp(lC(K,k)+lC(N-K,n-k)-lC(N,n)); }
let prob = {N:60,K:4,n:7,k:1};
const PROB_PRESETS = [['Ter 1 cópia de um card (4 no deck) na mão inicial',60,4,7,1],['Ter 1 cópia até o turno 4 (jogando primeiro)',60,4,10,1],['3+ terrenos em 7 cards com 24 terrenos',60,24,7,3],['Achar seu comandante… quer dizer, 1 card específico até o turno 5 em Commander',99,1,11,1],['Ter 2+ removals (8 no deck) até o turno 3',60,8,9,2]];
function renderProb(){
  $('#deckBody').innerHTML = `
   <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
     <div class="panel stack-v"><h3>Calculadora hipergeométrica</h3>
       <p class="muted">Responde perguntas como "qual a chance de ter X na mão até o turno Y?".</p>
       <label class="f" for="pPre">Exemplos<select id="pPre"><option value="">Escolha um exemplo…</option>${PROB_PRESETS.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('')}</select></label>
       <div class="grid g2">
         <label class="f" for="pN">Cards no deck<input type="number" id="pN" min="1" max="400" value="${prob.N}"></label>
         <label class="f" for="pK">Cópias do que você quer<input type="number" id="pK" min="0" max="400" value="${prob.K}"></label>
         <label class="f" for="pn">Cards vistos<input type="number" id="pn" min="1" max="400" value="${prob.n}"></label>
         <label class="f" for="pk">Quero pelo menos<input type="number" id="pk" min="0" max="400" value="${prob.k}"></label>
       </div>
       <p class="muted" style="font-size:.88rem">Cards vistos: mão de 7 + 1 por turno. Jogando primeiro, no turno T você viu 6 + T cards; jogando depois, 7 + T.</p>
     </div>
     <div class="panel stack-v" id="pOut"></div>
   </div>`;
  const upd = () => {
    const N = Math.max(1,Math.min(400,+$('#pN').value||1)), K = Math.max(0,Math.min(N,+$('#pK').value||0)), n = Math.max(1,Math.min(N,+$('#pn').value||1)), k = Math.max(0,+$('#pk').value||0);
    prob = {N,K,n,k};
    let atLeast = 0; for (let i=k;i<=Math.min(K,n);i++) atLeast += hyp(N,K,n,i);
    const rows = []; for (let i=0;i<=Math.min(K,n,10);i++) rows.push([i, hyp(N,K,n,i)]);
    const maxp = Math.max(...rows.map(r=>r[1]));
    $('#pOut').innerHTML = `<span class="eyebrow">Chance de ter pelo menos ${k}</span><div class="score-big" style="font-size:2.6rem">${(atLeast*100).toFixed(1)}%</div>
      <p class="muted">Isso é cerca de ${atLeast>0?`1 vez a cada ${(1/atLeast).toFixed(atLeast>.5?1:0)}`:'nunca'} partidas${atLeast>0?'':''}.</p>
      <div class="stack-v">${rows.map(([i,p])=>`<div class="hbar" style="grid-template-columns:90px 1fr 56px"><span>Exatamente ${i}</span><span class="track"><i style="width:${p/maxp*100}%;background:${i>=k?'var(--accent)':'var(--muted)'}"></i></span><span class="mono" style="text-align:right">${(p*100).toFixed(1)}%</span></div>`).join('')}</div>`;
  };
  ['pN','pK','pn','pk'].forEach(id => $('#'+id).oninput = upd);
  $('#pPre').onchange = e => { const p = PROB_PRESETS[+e.target.value]; if (!p) return; [$('#pN').value,$('#pK').value,$('#pn').value,$('#pk').value] = p.slice(1); upd(); };
  upd();
}

/* --- guia --- */
function renderGuide(){
  $('#deckBody').innerHTML = `
   <div class="stack-v">
     <div class="panel"><h3>Receitas de partida</h3>
       <div class="tbl-wrap"><table><thead><tr><th>Formato</th><th>Terrenos</th><th>Criaturas</th><th>Outras mágicas</th></tr></thead><tbody>
         <tr><td>Construído (60)</td><td class="n">22–26</td><td class="n">14–24</td><td class="n">12–22</td></tr>
         <tr><td>Limitado (40)</td><td class="n">17</td><td class="n">15–17</td><td class="n">6–8</td></tr>
         <tr><td>Commander (100)</td><td class="n">35–38</td><td class="n">20–30</td><td class="n">~10 ramp, ~10 compra, ~10 remoção</td></tr>
       </tbody></table></div>
       <p class="muted" style="margin-top:8px">Os números variam com o arquétipo. Use o Analisador para ajustar pelo custo médio real do seu deck.</p></div>
     <div class="panel"><h3>Arquétipos</h3>
       <div class="tbl-wrap"><table><thead><tr><th>Estilo</th><th>Plano de jogo</th><th>Terrenos (60)</th><th>Cards típicos</th></tr></thead><tbody>
       ${ARCH.map(a=>`<tr><td><b>${a[0]}</b></td><td>${a[1]}</td><td class="n">${a[2]}</td><td>${a[3]}</td></tr>`).join('')}</tbody></table></div></div>
     <div class="panel"><h3>As dez guildas (pares de cores)</h3>
       <div class="guilds">${GUILDS.map(g=>`<div class="guild"><div class="row-h" style="gap:6px">${[...g[1]].map(manaSym).join('')}<b>${g[0]}</b></div><p class="muted" style="font-size:.92rem;margin-top:4px">${g[2]}</p></div>`).join('')}</div>
       <p class="muted" style="margin-top:12px">Três cores: Bant ${mana('{G}{W}{U}')}, Esper ${mana('{W}{U}{B}')}, Grixis ${mana('{U}{B}{R}')}, Jund ${mana('{B}{R}{G}')}, Naya ${mana('{R}{G}{W}')}, Abzan ${mana('{W}{B}{G}')}, Jeskai ${mana('{U}{R}{W}')}, Sultai ${mana('{B}{G}{U}')}, Mardu ${mana('{R}{W}{B}')}, Temur ${mana('{G}{U}{R}')}.</p></div>
     <div class="panel"><h3>Passo a passo para montar seu primeiro deck</h3>
       <ol class="path">
         <li><div><b>Escolha um plano</b><br><span class="muted">"Vencer rápido com criaturas" é o mais fácil de aprender.</span></div></li>
         <li><div><b>Escolha 1 ou 2 cores</b><br><span class="muted">Menos cores, mana mais estável.</span></div></li>
         <li><div><b>Monte a curva</b><br><span class="muted">Em aggro: ~8 de custo 1–2, ~8 de 3, ~4 de 4+. Sempre tenha o que jogar no turno 2.</span></div></li>
         <li><div><b>Coloque 6–10 interações</b><br><span class="muted">Remoções e truques baratos.</span></div></li>
         <li><div><b>Ajuste os terrenos</b><br><span class="muted">Use o Analisador para a quantidade e a divisão de cores.</span></div></li>
         <li><div><b>Teste mãos e jogue</b><br><span class="muted">Use a aba Mão inicial. Troque o que fica parado na mão.</span></div></li>
       </ol></div>
   </div>`;
}

/* ================= INÍCIO DO APP ================= */

