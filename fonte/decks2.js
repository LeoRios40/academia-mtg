/* ================= DECKS FAMOSOS ================= */
const FAMOUS = [
 {n:'The Deck',y:'1996',f:'Tipo 1 (atual Vintage)',id:'WU',era:'antigo',who:'Brian Weissman',keys:['Mana Drain','Moat','Jayemdae Tome','Serra Angel','Swords to Plowshares'],
  story:'Considerado o primeiro deck de controle. Weissman percebeu que trocar um card por dois do oponente vencia jogos longos e popularizou a ideia de "vantagem de cards".',lesson:'Remoção eficiente + compra de cards + poucas ameaças continua sendo a receita de qualquer deck de controle.'},
 {n:'Sligh',y:'1996',f:'Tipo 2 (atual Padrão)',id:'R',era:'antigo',who:'Paul Sligh, com lista de Jay Schneider',keys:['Lightning Bolt','Ball Lightning','Goblin Guide'],
  story:'Um deck vermelho cheio de criaturas pequenas que chegou longe num torneio. Mostrou ao mundo o conceito de curva de mana: gastar todo o mana em todos os turnos.',lesson:'A curva de mana nasceu aqui. O Goblin Guide é um herdeiro moderno da ideia.'},
 {n:'Necro',y:'1996',f:'Tipo 2 / Tipo 1',id:'B',era:'antigo',who:'O "verão do Necro"',keys:['Necropotence','Dark Ritual','Hymn to Tourach'],
  story:'Necropotence permitia trocar vida por cards. O preto dominou um verão inteiro de torneios.',lesson:'Vida é um recurso. Pagar vida por cards é forte quando o oponente não pressiona.'},
 {n:'Academy',y:'1998',f:'Padrão e Tipo 1',id:'U',era:'antigo',who:'O "inverno do combo"',keys:['Tolarian Academy','Windfall','Mind Over Matter','Time Spiral'],
  story:'A coleção Urza\'s Saga tinha cartas tão fortes que partidas acabavam no primeiro turno. Foi a época com mais banimentos da história do jogo.',lesson:'É por causa de decks assim que existem listas de banidas.'},
 {n:'Affinity',y:'2004',f:'Padrão',id:'C',era:'antigo',who:'Mirrodin',keys:['Arcbound Ravager','Cranial Plating','Frogmite','Myr Enforcer','Skullclamp'],
  story:'Artefatos que ficavam de graça com terrenos-artefato. Dominou o Padrão a ponto de seis terrenos-artefato serem banidos em 2005.',lesson:'Custos reduzidos são perigosos: um deck que joga 6 cards no turno 2 quebra qualquer formato.'},
 {n:'Faeries',y:'2008',f:'Padrão',id:'UB',era:'antigo',who:'Lorwyn',keys:['Bitterblossom','Spellstutter Sprite','Mistbind Clique','Cryptic Command'],
  story:'Fadas com Lampejo que anulavam mágicas e roubavam turnos. Ícone do jogo no turno do oponente.',lesson:'Lampejo e instantâneos deixam você agir com mais informação que o oponente.'},
 {n:'Jund',y:'2009',f:'Padrão, depois Modern',id:'BRG',era:'antigo',who:'Shards of Alara',keys:['Bloodbraid Elf','Blightning','Maelstrom Pulse','Sprouting Thrinax'],
  story:'Cada card valia por dois. Virou o símbolo do estilo Midrange por mais de uma década no Modern.',lesson:'Midrange vence trocando 1 por 1 e jogando cartas que deixam valor.'},
 {n:'Caw-Blade',y:'2011',f:'Padrão',id:'WU',era:'antigo',who:'Scars of Mirrodin',keys:['Stoneforge Mystic','Squadron Hawk','Jace, the Mind Sculptor','Sword of Feast and Famine'],
  story:'Tão dominante que Jace, the Mind Sculptor e Stoneforge Mystic foram banidos do Padrão. Um dos poucos banimentos de cartas tão caras.',lesson:'Equipamentos mais criaturas baratas formam um motor difícil de parar.'},
 {n:'Splinter Twin',y:'2011–2016',f:'Modern',id:'UR',era:'antigo',who:'Combo clássico',keys:['Splinter Twin','Deceiver Exarch','Pestermite'],
  story:'Duas cartas que criam infinitas cópias de uma criatura e vencem no ato. Banido em 2016 por manter o formato preso a ele.',lesson:'Um combo de duas cartas força o oponente a guardar resposta, mesmo quando ele nem aparece.'},
 {n:'Eldrazi',y:'2016',f:'Modern',id:'C',era:'antigo',who:'O "inverno Eldrazi"',keys:['Eye of Ugin','Eldrazi Temple','Thought-Knot Seer','Reality Smasher'],
  story:'Terrenos que geravam mana extra para monstros incolores. Dominou o Pro Tour e Eye of Ugin foi banido logo depois.',lesson:'Mana extra cedo no jogo é uma das coisas mais fortes do Magic.'},
 {n:'Temur Energy',y:'2017',f:'Padrão',id:'GUR',era:'antigo',who:'Kaladesh e Amonkhet',keys:['Attune with Aether','Rogue Refiner','Longtusk Cub','Glorybringer'],
  story:'Contadores de energia geravam valor em cada carta. Attune with Aether e Rogue Refiner acabaram banidos.',lesson:'Recursos alternativos (energia, tesouros, fichas) também contam como vantagem de cards.'},
 {n:'Oko',y:'2019',f:'Padrão e outros',id:'GU',era:'antigo',who:'Throne of Eldraine',keys:['Oko, Thief of Crowns','Once Upon a Time','Veil of Summer'],
  story:'Um planeswalker de 3 manas que transformava as melhores criaturas do oponente em alces 3/3. Banido em vários formatos.',lesson:'Planeswalkers baratos e difíceis de atacar desequilibram qualquer mesa.'},
 {n:'Burn',y:'Sempre',f:'Modern e Pauper',id:'R',era:'atual',who:'O deck de entrada favorito',keys:['Lightning Bolt','Goblin Guide','Monastery Swiftspear','Lava Spike','Eidolon of the Great Revel'],
  story:'Vinte pontos de dano o mais rápido possível. Existe em praticamente todos os formatos desde sempre e é ótimo para aprender.',lesson:'Conte o dano: com Burn você aprende a calcular quantos turnos o oponente tem.'},
 {n:'Aggro com Heartfire Hero',y:'2024–2025',f:'Padrão',id:'RW',era:'atual',who:'Era Bloomburrow',keys:['Heartfire Hero','Monstrous Rage'],
  story:'Criaturas baratas que cresciam com truques e causavam dano enorme ao morrer. Heartfire Hero e Monstrous Rage foram banidos do Padrão.',lesson:'Mostra por que aggro com truques baratos é forte: cada truque também é dano.'},
 {n:'Izzet com Cori-Steel Cutter',y:'2025',f:'Padrão',id:'UR',era:'atual',who:'Era recente',keys:['Cori-Steel Cutter','Monastery Swiftspear'],
  story:'Mágicas baratas geravam criaturas e ataques em sequência. O artefato acabou banido no Padrão.',lesson:'Decks de "mágicas baratas" ganham força quando cada mágica também cria uma ameaça.'},
 {n:'Domain Ramp',y:'2024–2025',f:'Padrão',id:'WUBRG',era:'atual',who:'Era recente',keys:['Up the Beanstalk'],
  story:'Deck de cinco cores que acelerava mana e comprava cards com Up the Beanstalk, banido depois.',lesson:'Ramp moderno combina acelerar com comprar cards para não ficar sem ameaças.'}
];
let famF = 'todos';
function renderFamous(){
  const list = FAMOUS.filter(d => famF==='todos' || d.era===famF);
  $('#deckBody').innerHTML = `
   <div class="panel stack-v" style="margin-bottom:14px"><h3>Decks que fizeram história</h3>
     <p class="muted">Cada deck abaixo mudou o jogo de alguma forma: criou um conceito, causou banimentos ou dominou uma época. Toque nas cartas-chave para vê-las. Para ver as listas completas que estão vencendo hoje, use os links de metagame no fim da página.</p>
     <div class="filters" style="margin:0">${[['todos','Todos'],['antigo','Clássicos (1996–2019)'],['atual','Atuais e recentes']].map(([k,l])=>`<button class="chip" data-fam="${k}" aria-pressed="${famF===k}">${l}</button>`).join('')}</div></div>
   <div class="fam-list">${list.map(d=>`
     <article class="fam">
       <header><div><span class="eyebrow">${d.y} · ${d.f}</span><h3>${d.n}</h3><span class="muted" style="font-size:.9rem">${d.who}</span></div><span>${idSyms(d.id)}</span></header>
       <div class="fam-cards">${d.keys.map(k=>cardHTML(k,{cls:'mini',showPt:false})).join('')}</div>
       <p>${d.story}</p>
       <div class="tip"><b>Lição para hoje:</b> ${d.lesson}</div>
     </article>`).join('')}</div>
   <div class="sub-h"><h2>Os decks que vencem hoje</h2><p>O metagame muda a cada coleção. Estes sites mostram as listas completas atualizadas, prontas para importar no Arena.</p></div>
   <div class="panel"><div class="tbl-wrap"><table><tbody>
     ${[['Padrão','standard'],['Pioneer','pioneer'],['Modern','modern'],['Pauper','pauper'],['Legacy','legacy'],['Commander (mais jogados)','commander']].map(([n,k])=>`<tr><td><b>${n}</b></td><td>${k==='commander'?ext('https://edhrec.com/commanders','EDHREC: comandantes populares'):ext(`https://www.mtggoldfish.com/metagame/${k}`,'MTGGoldfish')}</td><td>${k==='standard'||k==='pioneer'?ext(`https://mtga.untapped.gg/meta`,'Untapped (Arena)'):k==='commander'?ext('https://moxfield.com/decks/public','Moxfield: decks públicos'):''}</td></tr>`).join('')}
   </tbody></table></div></div>`;
  $$('[data-fam]').forEach(b => b.onclick = () => { famF = b.dataset.fam; renderFamous(); });
}

/* ================= CENTRAL DO ARENA ================= */
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
const DAILY = ['Fazer a missão diária (ou trocar por uma mais fácil)','Conseguir a vitória diária','Conferir eventos da semana','Jogar uma partida com um deck novo','Registrar as partidas no diário abaixo'];
function toArena(txt){
  const ent = parseDeck(txt); if (!ent.length) return '';
  const fmt = deckFormat;
  if (fmt === '100') { const cmd = ent.find(e => COMMANDERS.some(c=>c.n.toLowerCase()===e.name.toLowerCase())) || ent[0]; return `Commander\n1 ${cmd.name}\n\nDeck\n${ent.filter(e=>e!==cmd).map(e=>`${e.q} ${e.name}`).join('\n')}`; }
  return 'Deck\n' + ent.map(e=>`${e.q} ${e.name}`).join('\n');
}
function renderArenaHub(){
  if (!S.games) S.games = [];
  if (!S.daily || S.daily.d !== todayKey()) S.daily = {d:todayKey(), c:[]};
  const arenaTxt = toArena(deckText);
  $('#deckBody').innerHTML = `
   <div class="grid g2" style="align-items:start">
     <div class="panel stack-v"><h3>Levar seu deck para o Arena</h3>
       <p class="muted">A lista que está no Analisador, no formato que o Arena aceita. Copie, abra o Arena, vá em <b>Decks → Importar</b>.</p>
       <pre class="code" id="arOut">${esc(arenaTxt || '// Cole ou monte uma lista no Analisador primeiro')}</pre>
       <div class="row-h"><button class="btn primary" id="arCopy" ${arenaTxt?'':'disabled'}>Copiar para o Arena</button><button class="btn" id="arEdit">Editar no Analisador</button></div>
       <p class="muted" style="font-size:.85rem">O Arena aceita só nomes em inglês e cartas que existem nele. Cartas que você não tem aparecem para criar com curingas.</p></div>
     <div class="panel stack-v"><h3>Trazer um deck do Arena</h3>
       <p class="muted">No Arena, abra o deck e toque em <b>Exportar</b>. Cole aqui para analisar curva, cores e mãos iniciais.</p>
       <textarea id="arIn" rows="8" spellcheck="false" placeholder="Deck&#10;4 Lightning Bolt (M11) 149&#10;..."></textarea>
       <div class="row-h"><label class="f" for="arFmt" style="flex:1">Formato<select id="arFmt"><option value="60">Padrão, Histórico e outros (60)</option><option value="100">Brawl (100)</option><option value="40">Limitado (40)</option></select></label></div>
       <button class="btn primary" id="arLoad">Analisar este deck</button></div>
   </div>

   <div class="sub-h"><h2>Diário de partidas</h2><p>Anote cada partida do Arena (ou da loja). Com 10 ou mais partidas, você descobre quais decks e matchups funcionam melhor.</p></div>
   <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
     <form class="panel stack-v" id="gForm">
       <div class="grid g2">
         <label class="f" for="gDeck">Meu deck<input type="text" id="gDeck" list="gDecks" required value="${esc(S.lastDeck||'')}" placeholder="ex.: Gruul Aggro"></label>
         <label class="f" for="gFmt">Formato<select id="gFmt">${['Padrão','Brawl','Histórico','Timeless','Draft','Commander (mesa)','Outro'].map(f=>`<option ${S.lastFmt===f?'selected':''}>${f}</option>`).join('')}</select></label>
         <label class="f" for="gOpp">Deck do oponente<input type="text" id="gOpp" list="gOpps" placeholder="ex.: Controle azul"></label>
         <label class="f" for="gPlay">Comecei<select id="gPlay"><option value="1">Jogando primeiro</option><option value="0">Jogando segundo</option></select></label>
       </div>
       <label class="f" for="gNote">Anotação (opcional)<input type="text" id="gNote" placeholder="ex.: travei com 2 terrenos"></label>
       <datalist id="gDecks">${[...new Set(S.games.map(g=>g.deck))].map(d=>`<option value="${esc(d)}">`).join('')}</datalist>
       <datalist id="gOpps">${[...new Set(S.games.map(g=>g.opp).filter(Boolean)), 'Aggro vermelho','Controle azul','Midrange','Ramp','Combo'].map(d=>`<option value="${esc(d)}">`).join('')}</datalist>
       <div class="row-h"><button class="btn primary" type="submit" data-res="V" style="flex:1;background:var(--good);border-color:var(--good)">Vitória</button><button class="btn primary" type="submit" data-res="D" style="flex:1;background:var(--bad);border-color:var(--bad);color:#fff">Derrota</button></div>
     </form>
     <div class="panel stack-v" id="gStats"></div>
   </div>
   <div class="panel" style="margin-top:14px"><div class="row-h" style="justify-content:space-between;margin-bottom:8px"><h3>Últimas partidas</h3><div class="row-h" id="gTools"><button class="btn small" id="gCsv">Copiar como planilha</button></div></div><div class="tbl-wrap" id="gList"></div></div>

   <div class="grid g2" style="margin-top:14px;align-items:start">
     <div class="panel stack-v"><h3>Rotina diária no Arena</h3><p class="muted">Zera todo dia. A forma mais rápida de juntar ouro e cartas sem gastar.</p>
       ${DAILY.map((t,i)=>`<label class="chk ${S.daily.c[i]?'done':''}"><input type="checkbox" data-dl="${i}" ${S.daily.c[i]?'checked':''}><span>${t}</span></label>`).join('')}</div>
     <div class="panel stack-v"><h3>Ferramentas que conversam com o Arena</h3>
       <ul style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:8px">
         <li>${ext('https://mtga.untapped.gg','Untapped.gg Companion')}: rastreador para PC que mostra as cartas restantes no deck durante a partida e registra seu histórico.</li>
         <li>${ext('https://www.17lands.com','17Lands')}: estatísticas de Draft. Mostra quais cartas mais vencem em cada coleção.</li>
         <li>${ext('https://moxfield.com','Moxfield')}: monte o deck no navegador e use "Export → Arena".</li>
         <li>${ext('https://magic.wizards.com/en/mtgarena/news','Notícias oficiais do Arena')}: eventos, atualizações e códigos promocionais de pacotes grátis.</li>
       </ul></div>
   </div>`;
  $('#arCopy').onclick = () => copyText(arenaTxt, $('#arOut'));
  $('#arEdit').onclick = () => { deckTab = 'analise'; RENDER.decks(); };
  $('#arLoad').onclick = () => { const t = $('#arIn').value.trim(); if (!t) { toast('Cole a lista exportada do Arena'); return; } deckText = t; deckFormat = $('#arFmt').value; DECK = null; hand = null; deckTab = 'analise'; RENDER.decks(); };
  let res = 'V';
  $$('[data-res]').forEach(b => b.onclick = () => { res = b.dataset.res; });
  $('#gForm').onsubmit = e => {
    e.preventDefault();
    const g = {t:Date.now(), deck:$('#gDeck').value.trim(), fmt:$('#gFmt').value, opp:$('#gOpp').value.trim(), play:$('#gPlay').value==='1', note:$('#gNote').value.trim(), r:res};
    if (!g.deck) return;
    S.games.unshift(g); S.games = S.games.slice(0, 500); S.lastDeck = g.deck; S.lastFmt = g.fmt; save();
    sfx(res==='V'?'win':'tap'); toast(res==='V'?'Vitória registrada':'Derrota registrada');
    $('#gOpp').value = ''; $('#gNote').value = ''; drawGames();
  };
  $$('[data-dl]').forEach(i => i.onchange = () => { S.daily.c[+i.dataset.dl] = i.checked; save(); i.closest('.chk').classList.toggle('done', i.checked); if (DAILY.every((_,k)=>S.daily.c[k])) { toast('Rotina do dia completa!'); sfx('win'); } });
  $('#gCsv').onclick = () => { const csv = 'data;deck;formato;oponente;comecei;resultado;nota\n' + S.games.map(g=>[new Date(g.t).toLocaleDateString('pt-BR'),g.deck,g.fmt,g.opp,g.play?'primeiro':'segundo',g.r==='V'?'vitória':'derrota',g.note].join(';')).join('\n'); copyText(csv, $('#gList')); };
  drawGames();
}
function drawGames(){
  const G = S.games, st = $('#gStats'); if (!st) return;
  const wr = arr => arr.length ? Math.round(arr.filter(g=>g.r==='V').length / arr.length * 100) : 0;
  if (!G.length) { st.innerHTML = '<h3>Estatísticas</h3><p class="muted">Registre sua primeira partida. Os números aparecem aqui: aproveitamento geral, por deck, jogando primeiro e segundo, e contra cada tipo de oponente.</p>'; $('#gList').innerHTML = '<p class="muted">Nenhuma partida ainda.</p>'; return; }
  const by = (key) => { const m = {}; G.forEach(g => { const k = g[key] || '—'; (m[k] = m[k] || []).push(g); }); return Object.entries(m).sort((a,b)=>b[1].length-a[1].length).slice(0,6); };
  let streak = 0; for (const g of G) { if (g.r === G[0].r) streak++; else break; }
  const bars = rows => rows.map(([k,arr])=>`<div class="hbar" style="grid-template-columns:minmax(0,1fr) 1fr 74px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(k)}</span><span class="track"><i style="width:${wr(arr)}%;background:${wr(arr)>=50?'var(--good)':'var(--bad)'}"></i></span><span class="mono" style="text-align:right">${wr(arr)}% · ${arr.length}</span></div>`).join('');
  st.innerHTML = `<h3>Estatísticas</h3>
    <div class="tiles"><div class="stat"><div class="k">Partidas</div><div class="v">${G.length}</div></div><div class="stat"><div class="k">Aproveitamento</div><div class="v">${wr(G)}%</div></div><div class="stat"><div class="k">Sequência atual</div><div class="v">${streak}${G[0].r==='V'?' V':' D'}</div></div></div>
    <div class="grid g2"><div class="stat"><div class="k">Jogando primeiro</div><div class="v">${wr(G.filter(g=>g.play))}%</div></div><div class="stat"><div class="k">Jogando segundo</div><div class="v">${wr(G.filter(g=>!g.play))}%</div></div></div>
    <span class="eyebrow">Por deck</span>${bars(by('deck'))}
    <span class="eyebrow">Contra</span>${bars(by('opp'))}
    ${G.length < 10 ? '<p class="muted" style="font-size:.85rem">Com menos de 10 partidas, os números ainda variam muito.</p>' : ''}`;
  $('#gList').innerHTML = `<table><thead><tr><th>Data</th><th>Deck</th><th>Oponente</th><th>Início</th><th>Resultado</th><th></th></tr></thead><tbody>${G.slice(0,30).map((g,i)=>`<tr><td class="mono">${new Date(g.t).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</td><td>${esc(g.deck)}<br><span class="muted" style="font-size:.8rem">${esc(g.fmt)}${g.note?' · '+esc(g.note):''}</span></td><td>${esc(g.opp||'—')}</td><td>${g.play?'1º':'2º'}</td><td><span class="pill ${g.r==='V'?'good':'bad'}">${g.r==='V'?'Vitória':'Derrota'}</span></td><td><button class="icon-btn" data-gdel="${i}" aria-label="Apagar partida" style="width:32px;height:32px">✕</button></td></tr>`).join('')}</tbody></table>`;
  $$('[data-gdel]').forEach(b => b.onclick = () => { S.games.splice(+b.dataset.gdel, 1); save(); drawGames(); });
}

/* ================= COLEÇÕES (ao vivo pelo Scryfall) ================= */
const SETKEY = 'academiaPlaneswalker.sets.v1';
const SET_TYPES = {expansion:'Expansão',core:'Coleção básica',masters:'Masters (reimpressões)',draft_innovation:'Draft especial',commander:'Commander',funny:'Divertida (Un-)',alchemy:'Alchemy (Arena)'};
const SETS_STATIC = [['Lorwyn Eclipsed','2026-01-23','expansion'],['Teenage Mutant Ninja Turtles','2026-03-06','expansion'],['Secrets of Strixhaven','2026-04-24','expansion'],['Marvel Super Heroes','2026-06-26','expansion'],['The Hobbit','2026-08-14','expansion'],['Reality Fracture','2026-10-02','expansion'],['Star Trek','2026-11-13','expansion']];
let setsData = null, setsErr = false, setOpen = null;
async function loadSets(){
  try { const c = JSON.parse(localStorage.getItem(SETKEY)); if (c && Date.now() - c.t < 864e5) { setsData = c.d; return; } } catch(e){}
  try {
    const r = await fetch('https://api.scryfall.com/sets', {headers:{'Accept':'application/json'}});
    if (!r.ok) throw 0;
    const j = await r.json();
    setsData = j.data.filter(s => SET_TYPES[s.set_type] && !s.parent_set_code && s.released_at)
      .map(s => ({c:s.code, n:s.name, d:s.released_at, ty:s.set_type, cnt:s.card_count, ic:s.icon_svg_uri, u:s.scryfall_uri, dig:s.digital, ar:!!s.arena_code}));
    try { localStorage.setItem(SETKEY, JSON.stringify({t:Date.now(), d:setsData})); } catch(e){}
  } catch(e) { setsErr = true; }
}
const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'});
async function fColecoes(){
  const box = $('#fmtBody');
  box.innerHTML = `<div class="panel"><p class="muted">Buscando as coleções no Scryfall…</p></div>`;
  if (!setsData && !setsErr) await loadSets();
  if (fmtTab !== 'colecoes') return;
  const today = new Date().toISOString().slice(0,10);
  const yearAgo = new Date(Date.now() - 365*864e5).toISOString().slice(0,10);
  let up, recent;
  if (setsData) {
    up = setsData.filter(s => s.d > today).sort((a,b)=>a.d.localeCompare(b.d)).slice(0,10);
    recent = setsData.filter(s => s.d <= today && s.d >= yearAgo).sort((a,b)=>b.d.localeCompare(a.d));
  }
  const row = s => `<button class="set" data-set="${s.c}" aria-pressed="${setOpen===s.c}">
      ${s.ic?`<img src="${s.ic}" alt="" class="set-ic" onerror="this.remove()">`:'<span class="set-ic"></span>'}
      <span style="min-width:0"><b>${esc(s.n)}</b><small>${fmtDate(s.d)} · ${SET_TYPES[s.ty]||s.ty}${s.cnt?` · ${s.cnt} cartas`:''}</small></span>
      ${s.ar||s.dig?'<span class="pill good">Arena</span>':''}</button>`;
  box.innerHTML = `
   <div class="panel stack-v"><h3>Coleções novas e futuras</h3>
     <p class="muted">${setsData?'Lista atualizada direto do Scryfall (renovada uma vez por dia). Toque numa coleção para ver as cartas míticas e raras.':'Sem conexão com o Scryfall agora. Abaixo, o calendário de 2026 conhecido em outubro de 2026.'}</p>
     <p class="muted" style="font-size:.88rem">Coleções novas costumam chegar ao MTG Arena alguns dias antes das lojas. Os anúncios e as prévias (cartas reveladas antes do lançamento) saem em ${ext('https://magic.wizards.com/en/news','magic.wizards.com/news')} e em ${ext('https://scryfall.com/sets','scryfall.com/sets')}.</p></div>
   ${setsData ? `
   <div class="sub-h"><h2>Próximos lançamentos</h2></div>
   <div class="sets">${up.length?up.map(row).join(''):'<p class="muted">Nenhum lançamento futuro listado ainda.</p>'}</div>
   <div class="sub-h"><h2>Lançadas nos últimos 12 meses</h2></div>
   <div class="sets">${recent.map(row).join('')}</div>
   <div id="setCards"></div>` : `
   <div class="panel tbl-wrap"><table><thead><tr><th>Coleção</th><th>Lançamento nas lojas</th></tr></thead><tbody>${SETS_STATIC.map(s=>`<tr><td><b>${s[0]}</b></td><td>${fmtDate(s[1])}</td></tr>`).join('')}</tbody></table></div>
   <button class="btn" id="setRetry" style="margin-top:10px">Tentar de novo</button>`}
   <div class="sub-h"><h2>Descubra uma carta</h2><p>Uma carta aleatória de toda a história do Magic, a cada toque.</p></div>
   <div class="panel"><div class="row-h" style="margin-bottom:12px">${[['','Qualquer'],['is:commander','Comandante'],['r:mythic','Mítica'],['t:planeswalker','Planeswalker'],['year<=1997','Dos anos 90'],['is:reserved','Lista Reservada']].map(([q,l])=>`<button class="chip" data-rnd="${q}">${l}</button>`).join('')}</div><div id="rndOut"><p class="muted">Escolha um tipo acima.</p></div></div>`;
  $$('[data-set]').forEach(b => b.onclick = () => { setOpen = setOpen===b.dataset.set ? null : b.dataset.set; $$('[data-set]').forEach(x=>x.setAttribute('aria-pressed', x.dataset.set===setOpen)); showSetCards(); });
  const rt = $('#setRetry'); if (rt) rt.onclick = () => { setsErr = false; fColecoes(); };
  $$('[data-rnd]').forEach(b => b.onclick = () => randomCard(b.dataset.rnd));
  if (setOpen) showSetCards();
}
async function showSetCards(){
  const box = $('#setCards'); if (!box) return;
  if (!setOpen) { box.innerHTML = ''; return; }
  const s = setsData.find(x=>x.c===setOpen);
  box.innerHTML = `<div class="panel" style="margin-top:14px"><p class="muted">Carregando cartas de ${esc(s.n)}…</p></div>`;
  box.scrollIntoView({behavior:'smooth', block:'start'});
  try {
    const r = await fetch(`https://api.scryfall.com/cards/search?order=edhrec&q=${encodeURIComponent(`e:${s.c} (r:mythic or r:rare) -t:basic`)}`, {headers:{'Accept':'application/json'}});
    if (r.status === 404) { box.innerHTML = `<div class="panel" style="margin-top:14px"><h3>${esc(s.n)}</h3><p class="muted">As cartas ainda não foram reveladas. Acompanhe as prévias em ${ext(s.u,'Scryfall')}.</p></div>`; return; }
    if (!r.ok) throw 0;
    const j = await r.json();
    j.data.forEach(c => { if (!CARDS[c.name]) { CARDS[c.name] = fromScry(c); CARD_ALIAS[c.name.toLowerCase()] = c.name; } if (CARDS[c.name].img) IMG[c.name.toLowerCase()] = CARDS[c.name].img; });
    box.innerHTML = `<div class="panel stack-v" style="margin-top:14px"><div class="row-h" style="justify-content:space-between"><h3>${esc(s.n)}: destaques</h3>${ext(s.u,'Ver todas no Scryfall')}</div>
      <p class="muted" style="font-size:.88rem">Míticas e raras, das mais usadas em decks para as menos usadas.</p>
      <div class="set-grid">${j.data.slice(0,24).map(c=>cardHTML(c.name,{showPt:false})).join('')}</div></div>`;
  } catch(e) { box.innerHTML = `<div class="panel" style="margin-top:14px"><p class="muted">Não foi possível carregar as cartas agora. ${ext(s.u,'Abrir no Scryfall')}</p></div>`; }
}
async function randomCard(q){
  const out = $('#rndOut'); out.innerHTML = '<p class="muted">Sorteando…</p>';
  try {
    const r = await fetch('https://api.scryfall.com/cards/random' + (q ? '?q=' + encodeURIComponent(q) : ''), {headers:{'Accept':'application/json'}});
    if (!r.ok) throw 0;
    const c = await r.json(); const d = fromScry(c); CARDS[c.name] = d; CARD_ALIAS[c.name.toLowerCase()] = c.name; if (d.img) IMG[c.name.toLowerCase()] = d.img;
    out.innerHTML = `<div class="cod">${cardHTML(c.name,{showPt:false})}<div class="stack-v" style="gap:6px;min-width:0"><b style="font-family:var(--f-display);font-size:1.2rem">${esc(c.name)}</b>
      <span class="muted">${esc(c.set_name)} · ${c.released_at ? c.released_at.slice(0,4) : ''} · ${({common:'Comum',uncommon:'Incomum',rare:'Rara',mythic:'Mítica',special:'Especial',bonus:'Bônus'})[c.rarity]||c.rarity}</span>
      <span>${mana(d.c)} ${esc(d.t)}</span><p style="font-size:.95rem">${mana(esc(d.x))}</p>
      ${c.reserved?'<span class="pill warn">Lista Reservada: nunca será reimpressa</span>':''}
      <div class="row-h">${ext(c.scryfall_uri,'Ver no Scryfall')}${c.related_uris&&c.related_uris.edhrec?ext(c.related_uris.edhrec,'EDHREC'):''}</div></div></div>`;
  } catch(e) { out.innerHTML = '<p class="muted">Sem conexão com o Scryfall agora. Tente de novo mais tarde.</p>'; }
}
