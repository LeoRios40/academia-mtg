/* ================= DADOS EXTRAS DE CARTAS (preço, raridade) ================= */
const METAKEY = 'academiaPlaneswalker.meta.v1';
let META = (()=>{ try { const c = JSON.parse(localStorage.getItem(METAKEY)); return c && Date.now() - c.t < 864e5 ? c.d : {}; } catch(e){ return {}; } })();
async function fetchMeta(names, status){
  const miss = [...new Set(names)].filter(n => !META[n.toLowerCase()] && !BASICS.includes(n.toLowerCase()));
  for (let i = 0; i < miss.length; i += 75) {
    const chunk = miss.slice(i, i+75); status && status(`Consultando preços e raridades (${Math.min(i+75, miss.length)}/${miss.length})…`);
    const r = await fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: chunk.map(name=>({name}))})});
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    j.data.forEach(c => {
      const m = {usd: c.prices ? +(c.prices.usd || c.prices.usd_foil || 0) : 0, r: c.rarity, ci: c.color_identity || [], tl: c.type_line || '', mv: c.cmc || 0, a: c.artist || ''};
      META[c.name.toLowerCase()] = m; chunk.forEach(q => { if (q.toLowerCase() === c.name.toLowerCase() || (c.card_faces && c.card_faces[0].name.toLowerCase() === q.toLowerCase())) META[q.toLowerCase()] = m; });
      if (!CARDS[c.name]) { CARDS[c.name] = fromScry(c); CARD_ALIAS[c.name.toLowerCase()] = c.name; }
    });
    await new Promise(res => setTimeout(res, 120));
  }
  try { localStorage.setItem(METAKEY, JSON.stringify({t:Date.now(), d:META})); } catch(e){}
}
const metaOf = n => META[(n||'').toLowerCase()] || null;

/* ---------- 7. orçamento ---------- */
function renderBudget(){
  if (S.fx == null) S.fx = 5.5;
  const ent = parseDeck(deckText);
  $('#deckBody').innerHTML = `
   <div class="panel stack-v"><h3>Quanto custa este deck?</h3>
     <p class="muted">Usa a lista do Analisador (${ent.reduce((a,e)=>a+e.q,0)} cards). Os preços vêm do Scryfall em dólar, com base em lojas americanas. Ajuste a cotação para ter uma ideia em reais.</p>
     <div class="row-h"><label class="f" for="fx" style="max-width:200px">Cotação do dólar (R$)<input type="number" id="fx" step="0.01" min="1" value="${S.fx}"></label><button class="btn primary" id="bdGo" style="align-self:flex-end">Calcular</button></div>
     <p class="muted" id="bdSt" style="font-size:.88rem">No Brasil, preços em lojas locais podem ser diferentes. Use como referência para comparar cartas.</p></div>
   <div id="bdOut" style="margin-top:14px"></div>`;
  $('#fx').onchange = e => { S.fx = +e.target.value || 5.5; save(); };
  $('#bdGo').onclick = async () => {
    const st = m => $('#bdSt').textContent = m;
    try { await fetchMeta(ent.map(e => e.name), st); st('Preços atualizados.'); } catch(e) { st('Sem conexão com o Scryfall agora. Tente de novo mais tarde.'); return; }
    drawBudget(ent);
  };
  if (ent.some(e => metaOf(e.name))) drawBudget(ent);
}
function drawBudget(ent){
  const fx = S.fx || 5.5, rows = ent.map(e => { const m = metaOf(e.name); return {n:e.name, q:e.q, u: m ? m.usd : null, m}; });
  const tot = rows.reduce((a,r) => a + (r.u||0) * r.q, 0);
  const known = rows.filter(r => r.u != null), top = known.slice().sort((a,b)=>b.u*b.q - a.u*a.q).slice(0, 10);
  const fmtF = f => f.toLocaleString('pt-BR', {style:'currency', currency:'USD'});
  const fmtR = f => (f*fx).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  const fmtCode = deckFormat==='100'?'commander':'standard';
  $('#bdOut').innerHTML = `
   <div class="tiles"><div class="stat"><div class="k">Total (US$)</div><div class="v">${fmtF(tot)}</div></div><div class="stat"><div class="k">Aproximado em R$</div><div class="v">${fmtR(tot)}</div></div><div class="stat"><div class="k">Cartas acima de US$ 5</div><div class="v">${known.filter(r=>r.u>5).length}</div></div></div>
   <div class="panel" style="margin-top:14px"><h3>As 10 mais caras</h3>
     <div class="tbl-wrap"><table><thead><tr><th>Carta</th><th>Qtd.</th><th>Unid.</th><th>Total</th><th>Alternativa barata</th></tr></thead><tbody>
     ${top.map(r => { const m = r.m; const t = m ? (/Creature/.test(m.tl)?'t:creature':/Instant/.test(m.tl)?'t:instant':/Sorcery/.test(m.tl)?'t:sorcery':/Artifact/.test(m.tl)?'t:artifact':/Enchantment/.test(m.tl)?'t:enchantment':/Land/.test(m.tl)?'t:land':'') : '';
       const q = `${t} ${m && m.ci.length ? 'id<=' + m.ci.join('').toLowerCase() : ''} mv<=${m?Math.ceil(m.mv):3} usd<${Math.max(0.5, (r.u/4)).toFixed(2)} f:${fmtCode} order:edhrec`;
       return `<tr><td>${cr(r.n)}</td><td class="n">${r.q}</td><td class="n">${fmtF(r.u)}</td><td class="n">${fmtF(r.u*r.q)}</td><td>${r.u>2?`<a class="ext" href="${scry(q)}" target="_blank" rel="noopener">Buscar parecidas ↗</a>`:'<span class="muted">já é barata</span>'}</td></tr>`; }).join('')}
     </tbody></table></div>
     <p class="muted" style="font-size:.85rem;margin-top:8px">"Buscar parecidas" procura no Scryfall cartas do mesmo tipo, nas mesmas cores, com custo igual ou menor e preço até um quarto do original.</p></div>
   ${rows.some(r=>r.u==null && !BASICS.includes(r.n.toLowerCase())) ? `<p class="muted" style="margin-top:8px">Sem preço: ${rows.filter(r=>r.u==null && !BASICS.includes(r.n.toLowerCase())).map(r=>esc(r.n)).join(', ')}.</p>` : ''}`;
}

/* ---------- 8. comparador ---------- */
let cmpA = '', cmpB = '';
function renderCompare(){
  $('#deckBody').innerHTML = `
   <div class="grid g2" style="align-items:start">
     <label class="f panel" for="cmpA">Versão antiga<textarea id="cmpA" rows="12" spellcheck="false">${esc(cmpA)}</textarea><button class="btn small" id="cmpLoad" type="button" style="align-self:flex-start">Usar a lista do Analisador</button></label>
     <label class="f panel" for="cmpB">Versão nova<textarea id="cmpB" rows="12" spellcheck="false">${esc(cmpB)}</textarea></label>
   </div>
   <div id="cmpOut" style="margin-top:14px"></div>`;
  $('#cmpLoad').onclick = () => { cmpA = deckText; $('#cmpA').value = cmpA; draw(); };
  const draw = () => {
    cmpA = $('#cmpA').value; cmpB = $('#cmpB').value;
    const a = new Map(parseDeck(cmpA).map(e=>[e.name.toLowerCase(), e])), b = new Map(parseDeck(cmpB).map(e=>[e.name.toLowerCase(), e]));
    if (!a.size || !b.size) { $('#cmpOut').innerHTML = '<div class="panel"><p class="muted">Cole as duas versões para ver a diferença.</p></div>'; return; }
    const add = [], rem = [], ch = [];
    b.forEach((e,k) => { const o = a.get(k); if (!o) add.push(`${e.q} ${e.name}`); else if (o.q !== e.q) ch.push(`${e.name}: ${o.q} → ${e.q}`); });
    a.forEach((e,k) => { if (!b.has(k)) rem.push(`${e.q} ${e.name}`); });
    const tot = m => [...m.values()].reduce((x,e)=>x+e.q,0);
    const col = (t, arr, cls) => `<div class="panel"><h3><span class="pill ${cls}">${arr.length}</span> ${t}</h3>${arr.length?`<ul style="margin:8px 0 0;padding-left:1.1em">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="muted">Nada.</p>'}</div>`;
    $('#cmpOut').innerHTML = `<p class="muted" style="margin-bottom:10px">Antiga: ${tot(a)} cards · Nova: ${tot(b)} cards</p><div class="grid g3">${col('Entraram', add, 'good')}${col('Saíram', rem, 'bad')}${col('Mudaram de quantidade', ch, 'warn')}</div>`;
  };
  $('#cmpA').oninput = draw; $('#cmpB').oninput = draw; draw();
}

/* ---------- 9. desafios de construção ---------- */
const CHAL = [
 {id:'pauper1',t:'Pauper de uma cor',d:'60 cards ou mais, todas as mágicas comuns e de uma única cor.',need:'meta'},
 {id:'curva',t:'Curva baixa',d:'60 cards, custo médio até 2,2 e no máximo 22 terrenos.'},
 {id:'high',t:'Highlander de 60',d:'60 cards com uma cópia de cada carta (exceto terrenos básicos).'},
 {id:'barato',t:'Deck de bolso',d:'60 cards por menos de US$ 30.',need:'meta'},
 {id:'tribal',t:'Tribal',d:'Pelo menos 20 criaturas do mesmo tipo (Goblin, Elfo, Vampiro…).'},
 {id:'cmdcomum',t:'Commander só de comuns',d:'100 cards e todas as mágicas comuns (exceto o comandante).',need:'meta'},
 {id:'cmdbase',t:'Commander bem estruturado',d:'100 cards com 10+ aceleração de mana, 8+ compra e 8+ remoção.'}
];
function chalCheck(id){
  const ent = parseDeck(deckText); const tot = ent.reduce((a,e)=>a+e.q,0); if (!tot) return [false,'Lista vazia.'];
  const R = analyze(ent); const nonland = R.entries.filter(e => e.k !== 'land');
  const tribeCount = {}; R.entries.forEach(e => { if (e.k !== 'creature' || !e.d) return; const m = (e.d.t||'').match(/—\s*(.+)/); if (!m) return; m[1].split(' ').forEach(w => { if (w.length > 2) tribeCount[w] = (tribeCount[w]||0) + e.q; }); });
  const colorsOf = e => { const m = metaOf(e.name); return m ? m.ci : Object.keys(pips(e.d && e.d.c)).filter(k=>pips(e.d && e.d.c)[k]); };
  const rarOk = arr => arr.every(e => { const m = metaOf(e.name); return m && m.r === 'common'; });
  const fn = (e, re) => e.d && re.test((e.d.x||'') + ' ' + ((metaOf(e.name)||{}).tl||''));
  switch (id) {
    case 'pauper1': { if (tot < 60) return [false,'Precisa de 60 cards.']; if (!nonland.every(e=>metaOf(e.name))) return [false,'Toque em "Verificar" para buscar as raridades.']; const cs = new Set(nonland.flatMap(colorsOf)); return [rarOk(nonland) && cs.size <= 1, `${nonland.filter(e=>(metaOf(e.name)||{}).r!=='common').length} mágicas não comuns · ${cs.size} cor(es)`]; }
    case 'curva': return [tot >= 60 && R.avg <= 2.2 && R.lands <= 22, `custo médio ${R.avg.toFixed(2)} · ${R.lands} terrenos`];
    case 'high': { const dup = R.entries.filter(e=>e.q>1 && !BASICS.includes(e.name.toLowerCase())); return [tot >= 60 && !dup.length, dup.length ? `repetidas: ${dup.map(e=>e.name).slice(0,4).join(', ')}` : `${tot} cards, sem repetidas`]; }
    case 'barato': { if (!R.entries.every(e=>metaOf(e.name)||BASICS.includes(e.name.toLowerCase()))) return [false,'Toque em "Verificar" para buscar os preços.']; const t = R.entries.reduce((a,e)=>a+((metaOf(e.name)||{}).usd||0)*e.q,0); return [tot >= 60 && t < 30, `US$ ${t.toFixed(2)}`]; }
    case 'tribal': { const best = Object.entries(tribeCount).sort((a,b)=>b[1]-a[1])[0]; return [!!best && best[1] >= 20, best ? `${best[1]} × ${best[0]}` : 'nenhuma tribo']; }
    case 'cmdcomum': { if (tot !== 100) return [false,'Precisa de 100 cards.']; if (!nonland.every(e=>metaOf(e.name))) return [false,'Toque em "Verificar" para buscar as raridades.']; const bad = nonland.filter(e=>(metaOf(e.name)||{}).r!=='common'); return [bad.length <= 1, `${bad.length} mágica(s) não comum(ns), contando o comandante`]; }
    case 'cmdbase': { if (tot !== 100) return [false,'Precisa de 100 cards.']; const cnt = re => nonland.filter(e=>fn(e,re)).reduce((a,e)=>a+e.q,0);
      const ramp = cnt(/add \{|adicione|search your library for (a|up to two) basic land|busque.*terreno|procure.*terreno|Treasure|Tesouro/i), draw = cnt(/draw|compre/i), rem = cnt(/destroy target|exile target|destrua|exile a|damage to (any|target)|dano a qualquer alvo/i);
      return [ramp >= 10 && draw >= 8 && rem >= 8, `ramp ${ramp} · compra ${draw} · remoção ${rem}`]; }
  }
  return [false,''];
}
function renderChal(){
  if (!S.chal) S.chal = {};
  $('#deckBody').innerHTML = `
   <div class="panel stack-v"><h3>Desafios de construção</h3><p class="muted">Monte um deck no Analisador e confira se ele cumpre o desafio. Desafios ensinam a pensar diferente: com menos dinheiro, menos raridades ou mais restrições.</p>
     <div class="row-h"><button class="btn primary" id="chGo">Verificar o deck atual</button><button class="btn" id="chEdit">Editar no Analisador</button><span class="muted" id="chSt" style="font-size:.88rem"></span></div></div>
   <div class="stack-v" style="margin-top:14px">${CHAL.map(c => { const [ok, msg] = chalCheck(c.id); if (ok && !S.chal[c.id]) { S.chal[c.id] = 1; save(); addXP(40); checkAch(); toast(`Desafio concluído: ${c.t}`); }
     return `<div class="panel row-h" style="justify-content:space-between;gap:12px"><div style="flex:1;min-width:220px"><b>${c.t}</b> ${S.chal[c.id]?'<span class="pill good">concluído</span>':''}<p class="muted" style="font-size:.92rem">${c.d}</p></div><div style="text-align:right"><span class="pill ${ok?'good':'warn'}">${ok?'cumpre':'não cumpre'}</span><div class="muted mono" style="font-size:.82rem;margin-top:4px">${esc(msg)}</div></div></div>`; }).join('')}</div>`;
  $('#chEdit').onclick = () => { deckTab = 'analise'; RENDER.decks(); };
  $('#chGo').onclick = async () => { const st = m => $('#chSt').textContent = m; try { await fetchMeta(parseDeck(deckText).map(e=>e.name), st); } catch(e) { st('Sem conexão: os desafios que dependem de preço e raridade não puderam ser conferidos.'); } renderChal(); };
}

/* ================= CURIOSIDADES: ARTISTAS, MULTIVERSO, NESTE DIA ================= */
const ARTISTS = [
 ['Christopher Rush',['Black Lotus','Lightning Bolt'],'Ilustrou o Black Lotus e o Lightning Bolt da primeira coleção, dois dos cards mais reconhecidos do jogo.'],
 ['Mark Poole',['Ancestral Recall','Counterspell','Birds of Paradise'],'Um dos artistas da coleção Alpha, com várias cartas clássicas do azul e do verde.'],
 ['Douglas Shuler',['Serra Angel'],'Criou a Serra Angel de 1993, imagem que virou símbolo do branco.'],
 ['Melissa Benson',['Shivan Dragon'],'Autora do Shivan Dragon original, o dragão mais icônico dos primeiros anos.'],
 ['Anson Maddocks',['Llanowar Elves'],'Ilustrou muitos cards da primeira coleção, como os Llanowar Elves.'],
 ['Mark Tedin',['Sol Ring','Emrakul, the Aeons Torn'],'Do Sol Ring de 1993 à Emrakul de 2010: um dos artistas com carreira mais longa no Magic.'],
 ['Sandra Everingham',['Dark Ritual'],'Ilustrou o Dark Ritual da Alpha.'],
 ['Rebecca Guay',['Bitterblossom'],'Estilo delicado de livro de contos; muito querida pelos jogadores, autora do Bitterblossom.'],
 ['Jason Chan',['Jace, the Mind Sculptor'],'Ilustrou Jace, the Mind Sculptor, um dos planeswalkers mais famosos.'],
 ['Steve Argyle',['Liliana of the Veil'],'Autor de Liliana of the Veil e de muitos personagens lendários.'],
 ['Justin Murray',['Tarmogoyf'],'Criou o Tarmogoyf, a criatura que virou lenda no Modern.'],
 ['John Matson',['Storm Crow'],'Ilustrou o Storm Crow, o corvo que virou o maior meme da comunidade.'],
 ['Seb McKinnon',[],'Artista e cineasta conhecido pelo clima sombrio e etéreo das ilustrações.'],
 ['Magali Villeneuve',[],'Uma das artistas mais prolíficas das coleções modernas, com dezenas de personagens lendários.']
];
async function artistSearch(name, out){
  out.innerHTML = `<p class="muted">Buscando ilustrações de ${esc(name)}…</p>`;
  try {
    const r = await fetch(`https://api.scryfall.com/cards/search?unique=art&order=edhrec&q=${encodeURIComponent(`a:"${name}"`)}`, {headers:{'Accept':'application/json'}});
    if (r.status === 404) { out.innerHTML = '<p class="muted">Nenhuma ilustração encontrada com esse nome.</p>'; return; }
    if (!r.ok) throw 0;
    const j = await r.json();
    out.innerHTML = `<p class="muted" style="font-size:.88rem">${j.total_cards} ilustrações. Mostrando as 18 mais usadas.</p><div class="art-grid">${j.data.slice(0,18).map(c => { const u = (c.image_uris && c.image_uris.normal) || (c.card_faces && c.card_faces[0].image_uris && c.card_faces[0].image_uris.normal); return u ? `<a href="${c.scryfall_uri}" target="_blank" rel="noopener" class="art"><img src="${u}" alt="${esc(c.name)}" loading="lazy"><span>${esc(c.name)} · ${c.released_at.slice(0,4)}</span></a>` : ''; }).join('')}</div>`;
  } catch(e) { out.innerHTML = '<p class="muted">Sem conexão com o Scryfall agora.</p>'; }
}
const PLANES = [
 ['Dominaria',18,52,'O plano natal da história do Magic: Urza, Mishra, a Guerra dos Irmãos e as invasões de Phyrexia.','Antiquities (1994), Ice Age (1995), Invasion (2000), Time Spiral (2006), Dominaria (2018), Dominaria United (2022), The Brothers\' War (2022)'],
 ['Ravnica',42,28,'Um plano inteiro coberto por uma cidade, governado por dez guildas de duas cores.','Ravnica: City of Guilds (2005), Return to Ravnica (2012), Guilds of Ravnica (2018), War of the Spark (2019), Murders at Karlov Manor (2024)'],
 ['Zendikar',70,20,'Terra de aventuras, terrenos vivos e dos Eldrazi, titãs que devoram planos.','Zendikar (2009), Rise of the Eldrazi (2010), Battle for Zendikar (2015), Zendikar Rising (2020)'],
 ['Innistrad',84,46,'Horror gótico: vampiros, lobisomens, zumbis e anjos protetores.','Innistrad (2011), Shadows over Innistrad (2016), Midnight Hunt e Crimson Vow (2021)'],
 ['Theros',58,62,'Mitologia grega com deuses que dependem da devoção dos mortais.','Theros (2013), Theros Beyond Death (2020)'],
 ['Kaladesh',30,76,'Invenções movidas a éter; o plano natal de Chandra.','Kaladesh (2016), Aether Revolt (2017)'],
 ['Amonkhet',12,28,'Inspirado no Egito antigo, manipulado por Nicol Bolas.','Amonkhet e Hour of Devastation (2017)'],
 ['Ixalan',46,86,'Piratas, dinossauros e uma cidade de ouro.','Ixalan (2017), Rivals of Ixalan (2018), The Lost Caverns of Ixalan (2023)'],
 ['Eldraine',68,82,'Contos de fadas e cortes de cavaleiros.','Throne of Eldraine (2019), Wilds of Eldraine (2023)'],
 ['Kamigawa',88,70,'Espíritos e samurais; depois, uma metrópole futurista.','Champions of Kamigawa (2004), Kamigawa: Neon Dynasty (2022)'],
 ['Tarkir',8,72,'Clãs guerreiros e dragões.','Khans of Tarkir (2014), Dragons of Tarkir (2015), Tarkir: Dragonstorm (2025)'],
 ['Alara',24,10,'Um plano partido em cinco fragmentos, cada um com três cores.','Shards of Alara (2008), Alara Reborn (2009)'],
 ['Mirrodin / Nova Phyrexia',90,22,'Um plano de metal que foi tomado pelo óleo phyrexiano.','Mirrodin (2003), Scars of Mirrodin (2010), New Phyrexia (2011), Phyrexia: All Will Be One (2023)'],
 ['Lorwyn / Shadowmoor',56,10,'Um mundo de contos que alterna entre dia eterno e noite eterna.','Lorwyn (2007), Shadowmoor (2008), Lorwyn Eclipsed (2026)'],
 ['Arcavios (Strixhaven)',34,50,'Uma universidade de magia com cinco escolas.','Strixhaven (2021), Secrets of Strixhaven (2026)'],
 ['Bloomburrow',76,92,'Um plano de pequenos animais heroicos.','Bloomburrow (2024)'],
 ['Duskmourn',96,58,'Uma casa assombrada do tamanho de um mundo.','Duskmourn: House of Horror (2024)'],
 ['Thunder Junction',4,90,'Faroeste mágico de foras-da-lei.','Outlaws of Thunder Junction (2024)'],
 ['Nova Capenna',52,44,'Cidade art déco dominada por famílias criminosas.','Streets of New Capenna (2022)']
];
let planeSel = 0;
function drawPlanes(box){
  const P = PLANES[planeSel];
  box.innerHTML = `<div class="xpanel"><h3>Mapa do Multiverso</h3><p class="muted">Os planos são os mundos do Magic. Toque em um para conhecer sua história e suas coleções.</p>
    <div class="planes">${PLANES.map((p,i)=>`<button class="plane ${i===planeSel?'on':''}" data-pl2="${i}" style="left:${p[1]}%;top:${p[2]}%"><i></i><span>${p[0]}</span></button>`).join('')}</div>
    <div class="fact" style="margin-top:12px"><b>${P[0]}</b><p>${P[3]}</p><p style="margin-top:6px"><span style="color:#d6ad5f">Coleções:</span> ${P[4]}</p></div></div>`;
  $$('[data-pl2]', box).forEach(b => b.onclick = () => { planeSel = +b.dataset.pl2; sfx('tap'); drawPlanes(box); });
}
const HIST = [
 ['08-05',1993,'Lançamento da coleção Alpha na Gen Con: nasce o Magic.'],['10-12',2007,'Lorwyn chega às lojas com os primeiros cards de planeswalker.'],
 ['10-07',2005,'Ravnica: City of Guilds apresenta as dez guildas.'],['10-02',2009,'Zendikar é lançada.'],['10-02',2003,'Mirrodin traz o plano de metal.'],
 ['10-06',2006,'Time Spiral, a coleção da nostalgia.'],['09-30',2011,'Innistrad e o horror gótico.'],['09-26',2014,'Khans of Tarkir é lançada.'],
 ['09-26',2019,'MTG Arena sai oficialmente da fase beta.'],['05-03',2019,'War of the Spark encerra a saga de Nicol Bolas.'],
 ['06-13',2025,'Final Fantasy é lançada e vale no Padrão.'],['11-15',2024,'Foundations, a nova base do Padrão.'],['02-05',2010,'Worldwake traz Jace, the Mind Sculptor.'],
 ['10-02',2026,'Reality Fracture é lançada.']
];
function thisWeekHTML(){
  const now = new Date(), y = now.getFullYear(), md = d => { const x = new Date(y, +d.slice(0,2)-1, +d.slice(3)); return Math.round((x - new Date(y, now.getMonth(), now.getDate()))/864e5); };
  const items = HIST.map(h => ({d:md(h[0]), y:h[1], t:h[2], md:h[0]})).filter(h => Math.abs(h.d) <= 7);
  if (setsData) setsData.forEach(s => { if (s.ty !== 'expansion' && s.ty !== 'core') return; const sy = +s.d.slice(0,4); if (sy >= y) return; const dd = md(s.d.slice(5)); if (Math.abs(dd) <= 7 && !items.some(i => i.y === sy && i.t.includes(s.n.split(':')[0]))) items.push({d:dd, y:sy, t:`${s.n} é lançada.`, md:s.d.slice(5)}); });
  items.sort((a,b) => a.d - b.d || a.y - b.y);
  if (!items.length) return '<p class="muted">Nenhum lançamento marcante nesta semana. Explore a linha do tempo na capa.</p>';
  return `<ul class="tl" style="margin-top:6px">${items.slice(0,6).map(i=>`<li><span class="yr">${i.y}</span><div><p><b>${i.md.slice(3)}/${i.md.slice(0,2)}</b> · ${esc(i.t)}${i.d===0?' <span class="pill good">hoje</span>':''}</p></div></li>`).join('')}</ul>`;
}

/* ================= 13. EXPORTAR / IMPORTAR PROGRESSO ================= */
function progressCode(){ return btoa(unescape(encodeURIComponent(JSON.stringify({v:1, s:S, deck:deckText})))); }
function importProgress(code){
  const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  if (!o || !o.s) throw 0;
  const keep = {theme:S.theme, sound:S.sound};
  S = Object.assign({}, DEF, o.s, keep); if (o.deck) deckText = o.deck; save();
}
function backupHTML(){
  return `<div class="panel stack-v" style="margin-top:16px"><h3>Levar o progresso para outro aparelho</h3>
    <p class="muted">O progresso fica salvo neste navegador. Para continuar no PC ou no celular, exporte aqui e importe no outro aparelho. Inclui XP, lições, conquistas, diário de partidas e o deck do Analisador.</p>
    <div class="row-h"><button class="btn" id="bkFile">Baixar arquivo</button><button class="btn" id="bkCopy">Copiar código</button><button class="btn" id="bkImp">Importar</button></div>
    <div id="bkBox"></div></div>`;
}
function bindBackup(){
  $('#bkFile').onclick = () => { try { const b = new Blob([JSON.stringify({v:1, s:S, deck:deckText})], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'academia-progresso.json'; document.body.append(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 500); toast('Arquivo salvo em Downloads'); } catch(e) { toast('Não foi possível baixar. Use "Copiar código".'); } };
  $('#bkCopy').onclick = () => { const c = progressCode(); $('#bkBox').innerHTML = `<pre class="code" id="bkCode" style="white-space:pre-wrap;word-break:break-all;max-height:120px">${c}</pre>`; copyText(c, $('#bkCode')); };
  $('#bkImp').onclick = () => {
    $('#bkBox').innerHTML = `<div class="stack-v"><label class="f" for="bkIn">Cole o código ou escolha o arquivo exportado<textarea id="bkIn" rows="3"></textarea></label><input type="file" id="bkFileIn" accept=".json,application/json"><div class="row-h"><button class="btn primary" id="bkGo">Importar e substituir o progresso atual</button></div></div>`;
    $('#bkFileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); $('#bkIn').value = btoa(unescape(encodeURIComponent(JSON.stringify(o)))); toast('Arquivo carregado. Toque em Importar.'); } catch(err) { toast('Arquivo inválido.'); } }; r.readAsText(f); };
    $('#bkGo').onclick = () => { try { importProgress($('#bkIn').value); toast('Progresso importado'); RENDER.inicio(); } catch(e) { toast('Código inválido. Confira se copiou tudo.'); } };
  };
}
