/* ================= 4. TREINO DE BLOQUEIOS ================= */
const BLK_POOL = ['Grizzly Bears','Centaur Courser','Giant Spider','Serra Angel','Vampire Nighthawk','Boggart Brute','Colossal Dreadmaw','Siege Mastodon','White Knight','Fencing Ace','Goblin Guide','Wall of Omens','Ambush Viper','Shivan Dragon','Darksteel Myr'];
let blk = null;
function blkUnit(n){ const d = cardData(n); const [p,t] = (d.p||'0/0').split('/').map(x=>parseInt(x)||0); return {n, p, t, kw:kwOf(n), cmc:d.cmc||0}; }
function newBlk(){
  const pick = k => shuffleIdx(BLK_POOL.length).slice(0,k).map(i => BLK_POOL[i]);
  const atk = pick(2 + (Math.random()<.5?1:0)).map(blkUnit).filter(u => !u.kw.def); if (!atk.length) atk.push(blkUnit('Centaur Courser'));
  const mine = pick(2 + (Math.random()<.5?1:0)).map(blkUnit);
  const life = 3 + Math.floor(Math.random()*12);
  blk = {atk, mine, life, assign: mine.map(()=>-1), done:false};
}
function blkEval(assign){
  const {atk, mine, life} = blk; let unb = 0, val = 0;
  for (let i=0;i<atk.length;i++) { const bl = mine.filter((_,j)=>assign[j]===i); if (atk[i].kw.menace && bl.length===1) return null;
    for (const b of bl) if (atk[i].kw.fly && !b.kw.fly && !b.kw.reach) return null;
    const conv = u => ({p:u.p,t:u.t,fs:u.kw.fs,ds:u.kw.ds,dt:u.kw.dt,tr:u.kw.tr,ll:u.kw.ll,ind:u.kw.ind});
    const r = combat(conv(atk[i]), bl.map(conv), 20, life); unb += r.toPlayer;
    if (r.A.dead) val += atk[i].cmc + 1; bl.forEach((b,k) => { if (r.B[k].dead) val -= b.cmc + 1; }); }
  const dead = unb >= life;
  return {score: (dead ? -1000 : 0) + val*3 - unb, unb, val, dead};
}
function blkBest(){ const n = blk.mine.length, m = blk.atk.length; let best = null, bestA = null; const a = Array(n).fill(-1);
  const rec = j => { if (j === n) { const e = blkEval(a); if (e && (!best || e.score > best.score)) { best = e; bestA = a.slice(); } return; } for (let k=-1;k<m;k++) { a[j] = k; rec(j+1); } };
  rec(0); return {best, bestA}; }
function renderBlk(box){
  if (!blk) newBlk();
  const {atk, mine, life, assign} = blk;
  const mineE = blkEval(assign), B = blk.done ? blkBest() : null;
  box.innerHTML = `
   <div class="panel stack-v"><h3>Quem bloqueia quem?</h3><p class="muted">O oponente atacou. Você tem <b>${life}</b> de vida. Para cada criatura sua, escolha qual atacante ela bloqueia (ou nenhum). O objetivo é sobreviver e sair ganhando na troca.</p>
     <div class="board"><div class="side-head"><span>Atacantes</span></div><div class="zone">${atk.map((u,i)=>`<div class="stack-v" style="align-items:center;gap:4px">${cardHTML(u.n,{cls:'mini attacking'})}<span class="pill">A${i+1}</span></div>`).join('')}</div>
     <div class="side-head"><span>Suas criaturas</span></div>
     <div class="stack-v">${mine.map((u,j)=>`<div class="row-h" style="gap:10px">${cardHTML(u.n,{cls:'mini'})}<div class="row-h" style="gap:6px">${[-1,...atk.map((_,i)=>i)].map(k=>`<button class="chip" data-bj="${j}:${k}" aria-pressed="${assign[j]===k}" ${blk.done?'disabled':''}>${k<0?'Não bloqueia':'Bloqueia A'+(k+1)}</button>`).join('')}</div></div>`).join('')}</div></div>
     ${!blk.done ? `<button class="btn primary" id="bjGo" style="align-self:flex-start">Confirmar bloqueios</button>` : `
       <div class="why ${mineE && B.best && mineE.score >= B.best.score ? 'ok' : 'no'}">${!mineE ? '<b>Bloqueio inválido.</b> Lembre: voadores só são bloqueados por criaturas com voar ou alcance, e ameaçar exige dois bloqueadores.' :
         `<b>${mineE.score >= B.best.score ? 'Ótimo bloqueio!' : 'Havia um bloqueio melhor.'}</b> Você recebe ${mineE.unb} de dano${mineE.dead?' e <b>perde a partida</b>':''}. ${mineE.score < B.best.score ? `Melhor: ${B.bestA.map((k,j)=>`${esc(mine[j].n)} ${k<0?'não bloqueia':'bloqueia '+esc(atk[k].n)}`).join('; ')} (você receberia ${B.best.unb}).` : ''}`}</div>
       <button class="btn primary" id="bjNew" style="align-self:flex-start">Nova situação</button>`}
   </div>`;
  $$('[data-bj]', box).forEach(b => b.onclick = () => { const [j,k] = b.dataset.bj.split(':').map(Number); blk.assign[j] = k; renderBlk(box); });
  const go = $('#bjGo'); if (go) go.onclick = () => { blk.done = true; const e = blkEval(blk.assign), B2 = blkBest(); if (e && e.score >= B2.best.score) { sfx('win'); S.blkWins = (S.blkWins||0)+1; addXP(5); save(); } else sfx('no'); renderBlk(box); };
  const nw = $('#bjNew'); if (nw) nw.onclick = () => { newBlk(); renderBlk(box); };
}

/* ================= 5. LER A MESA ================= */
let rd5 = null;
function newRead(){
  const pool = ['Grizzly Bears','Centaur Courser','Serra Angel','Vampire Nighthawk','Boggart Brute','Goblin Guide','Wall of Omens','Giant Spider','Shivan Dragon','Fencing Ace','Siege Mastodon','Storm Crow'];
  const n = 3 + Math.floor(Math.random()*3);
  const opp = shuffleIdx(pool.length).slice(0,n).map(i => ({n:pool[i], tapped: Math.random()<.25}));
  const u = opp.map(o => ({...o, ...blkUnit(o.n)}));
  const Q = [
    {q:'Quanto dano o oponente pode causar no próximo turno dele, se você não bloquear? (criaturas viradas agora desviram no turno dele)', a: u.filter(x=>!x.kw.def).reduce((s,x)=>s + x.p*(x.kw.ds?2:1), 0)},
    {q:'Quantas criaturas dele voam?', a: u.filter(x=>x.kw.fly).length},
    {q:'Quantas criaturas dele podem bloquear agora (desviradas)?', a: u.filter(x=>!x.tapped).length},
    {q:'Qual é o poder total das criaturas desviradas dele?', a: u.filter(x=>!x.tapped).reduce((s,x)=>s+x.p,0)}
  ];
  const q = Q[Math.floor(Math.random()*Q.length)];
  const opts = new Set([q.a]); while (opts.size < 4) opts.add(Math.max(0, q.a + Math.floor(Math.random()*7) - 3));
  rd5 = {opp, q, opts: [...opts].sort((a,b)=>a-b), phase:'look', ans:null, secs: S.readSecs || 8};
}
function renderRead(box){
  if (!rd5) newRead();
  const r = rd5;
  box.innerHTML = `<div class="panel stack-v"><h3>Ler a mesa</h3><p class="muted">Veteranos olham a mesa uma vez e já sabem o perigo. Observe o campo do oponente: ele some em alguns segundos.</p>
    <div class="row-h">${[12,8,5].map(s=>`<button class="chip" data-rs="${s}" aria-pressed="${r.secs===s}">${s} segundos</button>`).join('')}</div>
    <div class="board"><div class="side-head"><span>Campo do oponente</span><span class="mono" id="rdT">${r.phase==='look'?r.secs+'s':''}</span></div>
      <div class="zone">${r.phase==='look' || r.ans!=null ? r.opp.map(o=>cardHTML(o.n,{cls:'mini '+(o.tapped?'tapped':'')})).join('') : '<span class="muted" style="color:inherit;opacity:.7">O campo foi escondido.</span>'}</div></div>
    ${r.phase==='look' ? `<button class="btn primary" id="rdGo" style="align-self:flex-start">Já vi, esconder</button>` : `
      <div class="q"><div class="ask">${r.q.q}</div><div class="row-h">${r.opts.map(o=>`<button class="btn ${r.ans!=null?(o===r.q.a?'primary':''):''}" data-ro="${o}" ${r.ans!=null?'disabled':''}>${o}</button>`).join('')}</div>
      ${r.ans!=null?`<div class="why ${r.ans===r.q.a?'ok':'no'}"><b>${r.ans===r.q.a?'Exato!':'Resposta: '+r.q.a+'.'}</b> Releia o campo acima com calma: poder no canto inferior, cartas viradas estão de lado.</div><button class="btn primary" id="rdNew" style="align-self:flex-start">Outra mesa</button>`:''}</div>`}
   </div>`;
  $$('[data-rs]', box).forEach(b => b.onclick = () => { S.readSecs = +b.dataset.rs; save(); newRead(); renderRead(box); });
  clearInterval(r.timer);
  const hide = () => { clearInterval(r.timer); r.phase = 'ask'; renderRead(box); };
  if (r.phase === 'look') { let s = r.secs; r.timer = setInterval(() => { s--; const t = $('#rdT'); if (!t || !box.isConnected) { clearInterval(r.timer); return; } t.textContent = s + 's'; if (s <= 0) hide(); }, 1000); $('#rdGo').onclick = hide; }
  $$('[data-ro]', box).forEach(b => b.onclick = () => { r.ans = +b.dataset.ro; sfx(r.ans===r.q.a?'ok':'no'); if (r.ans===r.q.a) addXP(5); renderRead(box); });
  const nw = $('#rdNew'); if (nw) nw.onclick = () => { newRead(); renderRead(box); };
}

/* ================= 6. TREINO DE MULLIGAN ================= */
let mg = null;
function renderMull(box){
  if (!DECK) DECK = analyze(parseDeck(deckText));
  if (!mg) mg = {n:0, agree:0, cur:null, ans:null};
  if (!mg.cur) mg.cur = shuffled(DECK.names).slice(0,7);
  const ev = evalHand(mg.cur), rec = ev[0] === 'bad' ? 'mull' : 'keep';
  box.innerHTML = `<div class="panel stack-v"><h3>Manter ou mulligan?</h3><p class="muted">Mãos do deck que está no Analisador (${DECK.names.length} cards). Decida e compare com a recomendação.</p>
    <div class="hand-row">${mg.cur.map(c=>cardHTML(c.name,{showPt:false})).join('')}</div>
    ${mg.ans==null ? `<div class="row-h"><button class="btn primary" data-mg="keep">Manter</button><button class="btn" data-mg="mull">Mulligan</button></div>` :
      `<div class="why ${mg.ans===rec?'ok':'no'}"><b>${mg.ans===rec?'Concordo.':'Eu faria diferente.'}</b> ${ev[1]}</div><button class="btn primary" id="mgNext" style="align-self:flex-start">Próxima mão</button>`}
    <p class="muted mono" style="font-size:.85rem">${mg.n} mãos · ${mg.n?Math.round(mg.agree/mg.n*100):0}% de acordo</p></div>`;
  $$('[data-mg]', box).forEach(b => b.onclick = () => { mg.ans = b.dataset.mg; mg.n++; if (mg.ans === rec) { mg.agree++; sfx('ok'); } else sfx('no'); renderMull(box); });
  const nx = $('#mgNext'); if (nx) nx.onclick = () => { mg.cur = null; mg.ans = null; renderMull(box); };
}

/* ================= 7–9. GRUPO: PERFIS, MESAS E TORNEIO ================= */
function grp(){ if (!S.grp) S.grp = {players:[], pods:null, history:[], tour:null}; return S.grp; }
function renderGroup(box){
  const g = grp();
  box.innerHTML = `
   <div class="panel stack-v"><h3>Jogadores do grupo</h3><p class="muted">Cadastre quem joga com vocês: o deck e o nível (bracket) de cada um ajudam a montar mesas equilibradas.</p>
     <form class="row-h" id="gpForm" style="gap:8px"><input type="text" id="gpName" placeholder="Nome" required style="flex:1 1 120px"><input type="text" id="gpDeck" placeholder="Deck ou comandante" style="flex:2 1 180px"><select id="gpBr" style="flex:0 0 120px">${[1,2,3,4,5].map(b=>`<option value="${b}" ${b===2?'selected':''}>Bracket ${b}</option>`).join('')}</select><button class="btn primary" type="submit">Adicionar</button></form>
     <div class="tbl-wrap">${g.players.length ? `<table><thead><tr><th>Jogador</th><th>Deck</th><th>Bracket</th><th>Vitórias</th><th>Partidas</th><th></th></tr></thead><tbody>${g.players.map((p,i)=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.deck||'—')}</td><td class="n">${p.br}</td><td class="n">${p.w||0}</td><td class="n">${p.g||0}</td><td><button class="icon-btn" data-gpdel="${i}" style="width:30px;height:30px" aria-label="Remover">✕</button></td></tr>`).join('')}</tbody></table>` : '<p class="muted">Nenhum jogador ainda.</p>'}</div>
   </div>
   <div class="grid g2" style="margin-top:14px;align-items:start">
     <div class="panel stack-v"><h3>Sorteio de mesas (Commander)</h3><p class="muted">Divide o grupo em mesas de 3 ou 4, sorteia os lugares e quem começa.</p>
       <label class="chk" style="border:0"><input type="checkbox" id="gpBal" ${g.bal?'checked':''}><span>Juntar jogadores de bracket parecido</span></label>
       <button class="btn primary" id="gpPods" ${g.players.length<2?'disabled':''} style="align-self:flex-start">Sortear mesas</button>
       <div id="gpPodsOut">${g.pods ? podsHTML(g) : ''}</div></div>
     <div class="panel stack-v"><h3>Torneio suíço (1 contra 1)</h3><p class="muted">Como nas lojas: a cada rodada, quem tem a mesma pontuação se enfrenta. Vitória vale 3, empate 1.</p>
       <div id="gpTour">${tourHTML(g)}</div></div>
   </div>`;
  $('#gpForm').onsubmit = e => { e.preventDefault(); g.players.push({name:$('#gpName').value.trim(), deck:$('#gpDeck').value.trim(), br:+$('#gpBr').value, w:0, g:0}); save(); renderGroup(box); };
  $$('[data-gpdel]', box).forEach(b => b.onclick = () => { g.players.splice(+b.dataset.gpdel,1); save(); renderGroup(box); });
  $('#gpBal').onchange = e => { g.bal = e.target.checked; save(); };
  $('#gpPods').onclick = () => {
    let ps = shuffled(g.players.map((_,i)=>i)); if (g.bal) ps.sort((a,b)=>g.players[a].br - g.players[b].br);
    const n = ps.length, tables = Math.max(1, Math.round(n/4)); const pods = Array.from({length:tables}, () => []);
    ps.forEach((p,i) => pods[g.bal ? Math.min(tables-1, Math.floor(i / Math.ceil(n/tables))) : i % tables].push(p));
    g.pods = pods.map(pd => ({seats: shuffled(pd), first: Math.floor(Math.random()*pd.length), winner:null})); save(); sfx('ok'); renderGroup(box);
  };
  bindPods(box); bindTour(box);
}
function podsHTML(g){ return g.pods.map((pd,k)=>`<div class="fact" style="background:var(--surface-2);border:1px solid var(--line);margin-top:8px"><b>Mesa ${k+1}</b>
  <ol style="margin:6px 0;padding-left:1.2em">${pd.seats.map((i,s)=>`<li>${esc(g.players[i].name)} <span class="muted">(bracket ${g.players[i].br})</span>${s===pd.first?' <span class="pill good">começa</span>':''}</li>`).join('')}</ol>
  ${pd.winner==null ? `<div class="row-h">${pd.seats.map(i=>`<button class="chip" data-podw="${k}:${i}">${esc(g.players[i].name)} venceu</button>`).join('')}</div>` : `<p>Vencedor: <b>${esc(g.players[pd.winner].name)}</b></p>`}</div>`).join(''); }
function bindPods(box){ $$('[data-podw]', box).forEach(b => b.onclick = () => { const g = grp(); const [k,i] = b.dataset.podw.split(':').map(Number); const pd = g.pods[k]; pd.winner = i; pd.seats.forEach(s => g.players[s].g = (g.players[s].g||0) + 1); g.players[i].w = (g.players[i].w||0) + 1; g.history.push({t:Date.now(), w:g.players[i].name}); save(); sfx('win'); renderGroup(box); }); }
function tourHTML(g){
  const T = g.tour;
  if (!T) return `<button class="btn primary" id="tStart" ${g.players.length<2?'disabled':''}>Começar torneio com os ${g.players.length} jogadores</button>`;
  const st = standings(T);
  const cur = T.rounds[T.rounds.length-1];
  return `<p class="muted">Rodada ${T.rounds.length}</p>
    ${cur.map((m,k)=>`<div class="row-h" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:6px 0"><span>${esc(T.names[m.a])} × ${m.b<0?'<i>folga</i>':esc(T.names[m.b])}</span>${m.b<0?'<span class="pill good">vitória</span>':m.r?`<span class="pill">${m.r==='a'?esc(T.names[m.a]):m.r==='b'?esc(T.names[m.b]):'empate'}</span>`:`<span class="row-h" style="gap:4px"><button class="chip" data-tr="${k}:a">${esc(T.names[m.a])}</button><button class="chip" data-tr="${k}:d">Empate</button><button class="chip" data-tr="${k}:b">${esc(T.names[m.b])}</button></span>`}</div>`).join('')}
    <div class="row-h" style="margin-top:8px"><button class="btn primary" id="tNext" ${cur.every(m=>m.r||m.b<0)?'':'disabled'}>Próxima rodada</button><button class="btn" id="tEnd">Encerrar torneio</button></div>
    <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th>#</th><th>Jogador</th><th>Pontos</th><th>V-D-E</th><th>Desempate</th></tr></thead><tbody>${st.map((s,i)=>`<tr><td class="n">${i+1}</td><td>${esc(T.names[s.i])}</td><td class="n">${s.pts}</td><td class="n">${s.w}-${s.l}-${s.d}</td><td class="n">${(s.omw*100).toFixed(0)}%</td></tr>`).join('')}</tbody></table></div>
    <p class="muted" style="font-size:.82rem">Desempate: aproveitamento médio dos oponentes (mínimo de 33%), como nos torneios oficiais.</p>`;
}
function standings(T){
  const n = T.names.length, S2 = Array.from({length:n}, (_,i)=>({i, pts:0, w:0, l:0, d:0, opp:[]}));
  T.rounds.flat().forEach(m => { if (m.b < 0) { S2[m.a].pts += 3; S2[m.a].w++; return; } if (!m.r) return; S2[m.a].opp.push(m.b); S2[m.b].opp.push(m.a);
    if (m.r==='a') { S2[m.a].pts+=3; S2[m.a].w++; S2[m.b].l++; } else if (m.r==='b') { S2[m.b].pts+=3; S2[m.b].w++; S2[m.a].l++; } else { S2[m.a].pts++; S2[m.b].pts++; S2[m.a].d++; S2[m.b].d++; } });
  const mwp = s => { const g = s.w+s.l+s.d; return g ? Math.max(1/3, s.pts/(3*g)) : 1/3; };
  S2.forEach(s => s.omw = s.opp.length ? s.opp.reduce((a,o)=>a+mwp(S2[o]),0)/s.opp.length : 0);
  return S2.sort((a,b)=>b.pts-a.pts || b.omw-a.omw);
}
function pairRound(T){
  const st = standings(T).map(s=>s.i), played = new Set(T.rounds.flat().map(m=>m.a+'-'+m.b).concat(T.rounds.flat().map(m=>m.b+'-'+m.a)));
  const left = st.slice(), round = [];
  if (left.length % 2) { const byeHad = new Set(T.rounds.flat().filter(m=>m.b<0).map(m=>m.a)); let k = left.length-1; while (k>0 && byeHad.has(left[k])) k--; round.push({a:left.splice(k,1)[0], b:-1}); }
  while (left.length) { const a = left.shift(); let j = left.findIndex(b => !played.has(a+'-'+b)); if (j < 0) j = 0; round.push({a, b:left.splice(j,1)[0], r:null}); }
  T.rounds.push(round);
}
function bindTour(box){
  const g = grp(), on = (id,f) => { const e = $('#'+id); if (e) e.onclick = f; };
  on('tStart', () => { g.tour = {names: shuffled(g.players.map(p=>p.name)), rounds:[]}; pairRound(g.tour); save(); renderGroup(box); });
  $$('[data-tr]', box).forEach(b => b.onclick = () => { const [k,r] = b.dataset.tr.split(':'); g.tour.rounds[g.tour.rounds.length-1][+k].r = r; save(); renderGroup(box); });
  on('tNext', () => { pairRound(g.tour); save(); renderGroup(box); });
  on('tEnd', () => { const st = standings(g.tour); toast(`Campeão: ${g.tour.names[st[0].i]}!`); sfx('win'); g.tour = null; save(); renderGroup(box); });
}

/* ================= 10. SUGESTÕES PARA O COMANDANTE ================= */
async function renderSuggest(){
  const ent = parseDeck(deckText); const names = new Set(ent.map(e=>e.name.toLowerCase()));
  const guess = ent.find(e => COMMANDERS.some(c=>c.n.toLowerCase()===e.name.toLowerCase())) || ent.find(e => { const d = cardData(e.name); return d && /Lend|Legend/.test(d.t) && d.k==='creature'; });
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Sugestões de cartas</h3><p class="muted">Procura no Scryfall cartas populares nas cores do seu comandante e ligadas ao tema dele, que ainda não estão no deck. Toque em "+" para adicionar à lista.</p>
    <label class="f" for="sgCmd">Comandante<input type="text" id="sgCmd" value="${esc(guess ? (CARD_ALIAS[guess.name.toLowerCase()]||guess.name) : '')}" placeholder="Nome em inglês, ex.: Krenko, Mob Boss"></label>
    <button class="btn primary" id="sgGo" style="align-self:flex-start">Buscar sugestões</button><p class="muted" id="sgSt" style="font-size:.88rem"></p></div><div id="sgOut" style="margin-top:14px"></div>`;
  $('#sgGo').onclick = async () => {
    const cmd = $('#sgCmd').value.trim(); if (!cmd) return; const st = m => $('#sgSt').textContent = m; st('Buscando…');
    try {
      const r0 = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + encodeURIComponent(cmd), {headers:{'Accept':'application/json'}}); if (!r0.ok) { st('Comandante não encontrado. Confira a grafia em inglês.'); return; }
      const c = await r0.json(); const id = (c.color_identity||[]).join('').toLowerCase() || 'c';
      const tl = c.type_line || '', tribe = (tl.split('—')[1]||'').trim().split(' ')[0]; const ox = (c.oracle_text||'').toLowerCase();
      const theme = /token/.test(ox) ? 'o:create o:token' : /\+1\/\+1 counter|proliferate/.test(ox) ? 'o:"+1/+1 counter"' : /graveyard/.test(ox) ? 'o:graveyard' : /instant or sorcery/.test(ox) ? '(t:instant or t:sorcery)' : /aura|equip/.test(ox) ? '(t:aura or t:equipment)' : tribe ? 't:' + tribe.toLowerCase() : 't:creature';
      const q = async (query) => { const r = await fetch('https://api.scryfall.com/cards/search?order=edhrec&q=' + encodeURIComponent(query), {headers:{'Accept':'application/json'}}); if (!r.ok) return []; const j = await r.json(); return j.data; };
      const themeCards = await q(`${theme} id<=${id} f:commander -t:basic`); await new Promise(r=>setTimeout(r,120));
      const staples = await q(`id<=${id} f:commander -t:basic -t:land`);
      const add = arr => arr.filter(x => !names.has(x.name.toLowerCase()) && x.name !== c.name).slice(0, 18);
      [...themeCards, ...staples].forEach(x => { if (!CARDS[x.name]) { CARDS[x.name] = fromScry(x); CARD_ALIAS[x.name.toLowerCase()] = x.name; } if (CARDS[x.name].img) IMG[x.name.toLowerCase()] = CARDS[x.name].img; });
      const grid = (t, arr) => `<div class="panel stack-v"><h3>${t}</h3><div class="sug-grid">${add(arr).map(x=>`<div class="sug">${cardHTML(x.name,{showPt:false})}<button class="btn small" data-sgadd="${esc(x.name)}">+ Adicionar</button></div>`).join('') || '<p class="muted">Todas já estão no deck.</p>'}</div></div>`;
      $('#sgOut').innerHTML = `<div class="stack-v">${grid(`Ligadas ao tema de ${esc(c.name)}`, themeCards)}${grid('Mais usadas nestas cores', staples)}</div><p class="muted" style="font-size:.85rem;margin-top:8px">Ordenadas pela popularidade no EDHREC. Para a página completa do comandante: ${ext(edh(c.name),'EDHREC')}.</p>`;
      st(`Identidade de cor: ${id.toUpperCase()}. Tema detectado: ${theme}.`);
      $$('[data-sgadd]').forEach(b => b.onclick = () => { deckText = deckText.trimEnd() + '\n1 ' + b.dataset.sgadd; DECK = null; names.add(b.dataset.sgadd.toLowerCase()); b.textContent = 'Adicionada'; b.disabled = true; toast('Adicionada à lista do Analisador'); });
    } catch(e) { st('Sem conexão com o Scryfall agora.'); }
  };
  if (guess) $('#sgGo').click();
}

/* ================= 11. COLEÇÃO FÍSICA ================= */
function renderColl(){
  if (!S.coll) S.coll = '';
  const own = new Map(parseDeck(S.coll).map(e=>[e.name.toLowerCase(), e.q]));
  const decks = [...SIM_DECKS.filter(d=>d.id!=='mine').map(d => ({n:d.n, list: d.cards ? [d.cmd, ...d.cards].map(x=>({name:x,q:1})).concat([{name:d.land,q:d.lands}]) : parseDeck(d.text)})), {n:'Deck atual do Analisador', list: parseDeck(deckText)}];
  const rows = decks.map(d => { let have = 0, tot = 0; const miss = [];
    d.list.forEach(e => { if (BASICS.includes(e.name.toLowerCase())) { have += e.q; tot += e.q; return; } const o = own.get(e.name.toLowerCase()) || 0; have += Math.min(o, e.q); tot += e.q; if (o < e.q) miss.push(`${e.q - o} ${e.name}`); });
    return {n:d.n, have, tot, miss}; });
  $('#deckBody').innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
    <div class="panel stack-v"><h3>Minha coleção física</h3><p class="muted">Liste as cartas que você tem em casa, uma por linha ("4 Lightning Bolt"). Terrenos básicos não precisam: considero que você tem.</p>
      <textarea id="collTxt" rows="14" spellcheck="false" placeholder="4 Lightning Bolt&#10;1 Sol Ring&#10;...">${esc(S.coll)}</textarea>
      <div class="row-h"><button class="btn primary" id="collSave">Salvar e comparar</button><span class="muted mono">${[...own.values()].reduce((a,b)=>a+b,0)} cartas</span></div></div>
    <div class="panel stack-v"><h3>Que decks consigo montar?</h3>${rows.map(r=>`<div class="stack-v" style="gap:4px;border-bottom:1px solid var(--line);padding-bottom:8px">
      <div class="hbar" style="grid-template-columns:minmax(0,1fr) 1fr 60px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><b>${esc(r.n)}</b></span><span class="track"><i style="width:${r.tot?r.have/r.tot*100:0}%;background:${r.have===r.tot&&r.tot?'var(--good)':'var(--accent)'}"></i></span><span class="mono">${r.tot?Math.round(r.have/r.tot*100):0}%</span></div>
      ${r.miss.length?`<details><summary class="muted" style="cursor:pointer;font-size:.88rem">Faltam ${r.miss.length} cartas</summary><p style="font-size:.85rem">${r.miss.map(esc).join(', ')}</p></details>`:r.tot?'<span class="pill good" style="align-self:flex-start">Dá para montar!</span>':''}</div>`).join('')}</div></div>`;
  $('#collSave').onclick = () => { S.coll = $('#collTxt').value; save(); toast('Coleção salva'); renderColl(); };
}

/* ================= 12. LISTA DE DESEJOS ================= */
function renderWish(){
  if (!S.wish) S.wish = [];
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Lista de desejos</h3><p class="muted">Adicione as cartas que quer comprar. A cada atualização, comparo com o preço de quando você adicionou e mostro o que ficou mais barato.</p>
    <form class="row-h" id="wForm"><input type="text" id="wName" placeholder="Nome em inglês, ex.: Sol Ring" required style="flex:1;min-width:180px"><button class="btn primary" type="submit">Adicionar</button><button class="btn" type="button" id="wUpd" ${S.wish.length?'':'disabled'}>Atualizar preços</button></form>
    <p class="muted" id="wSt" style="font-size:.88rem"></p>
    <div class="tbl-wrap">${S.wish.length?`<table><thead><tr><th>Carta</th><th>Quando adicionei</th><th>Agora</th><th>Variação</th><th></th></tr></thead><tbody>${S.wish.map((w,i)=>{ const d = w.now!=null && w.p0 ? (w.now-w.p0)/w.p0*100 : null; return `<tr><td>${cr(w.n)}</td><td class="n">${w.p0!=null?'US$ '+w.p0.toFixed(2):'—'}</td><td class="n">${w.now!=null?'US$ '+w.now.toFixed(2):'—'}</td><td>${d==null?'—':`<span class="pill ${d<=-5?'good':d>=5?'bad':''}">${d>0?'+':''}${d.toFixed(0)}%</span>`}</td><td><button class="icon-btn" data-wdel="${i}" style="width:30px;height:30px" aria-label="Remover">✕</button></td></tr>`; }).join('')}</tbody></table>`:'<p class="muted">A lista está vazia.</p>'}</div></div>`;
  const st = m => $('#wSt').textContent = m;
  const price = async names => { names.forEach(n => delete META[n.toLowerCase()]); await fetchMeta(names, st); };
  $('#wForm').onsubmit = async e => { e.preventDefault(); const n = $('#wName').value.trim(); if (!n) return;
    try { await price([n]); const m = metaOf(n); if (!m) { st('Carta não encontrada. Use o nome em inglês.'); return; } S.wish.push({n: Object.keys(CARD_ALIAS).includes(n.toLowerCase()) ? CARD_ALIAS[n.toLowerCase()] : n, p0:m.usd, now:m.usd, t:Date.now()}); save(); renderWish(); } catch(err) { st('Sem conexão com o Scryfall agora.'); } };
  $('#wUpd').onclick = async () => { try { await price(S.wish.map(w=>w.n)); S.wish.forEach(w => { const m = metaOf(w.n); if (m) w.now = m.usd; }); save(); renderWish(); const cheap = S.wish.filter(w=>w.p0 && w.now <= w.p0*0.95); if (cheap.length) toast(`${cheap.length} carta(s) ficaram mais baratas!`); } catch(err) { st('Sem conexão com o Scryfall agora.'); } };
  $$('[data-wdel]').forEach(b => b.onclick = () => { S.wish.splice(+b.dataset.wdel,1); save(); renderWish(); });
}

/* ================= 13. AVALIAR A BASE DE MANA ================= */
function landColors(n){
  const LN = {plains:'W',island:'U',swamp:'B',mountain:'R',forest:'G'}; const k = n.toLowerCase().replace('snow-covered ','');
  if (LN[k]) return [LN[k]]; if (k === 'command tower') return ['W','U','B','R','G'];
  const d = cardData(n); if (!d || d.k !== 'land') return [];
  const x = d.x || ''; if (/any color|qualquer cor/i.test(x)) return ['W','U','B','R','G'];
  const set = new Set(); (x.match(/\{([WUBRG])\}/g)||[]).forEach(s => set.add(s[1])); return [...set];
}
function renderManaBase(){
  if (!DECK) DECK = analyze(parseDeck(deckText));
  const R = DECK, N = R.total, src = {W:0,U:0,B:0,R:0,G:0};
  R.entries.forEach(e => { if (e.k === 'land' || BASICS.includes(e.name.toLowerCase())) landColors(e.name).forEach(c => src[c] += e.q); });
  const need = {};
  R.entries.forEach(e => { if (!e.d || e.k === 'land') return; const p = pips(e.d.c); Object.entries(p).forEach(([c,k]) => { if (!k) return; const turn = Math.max(1, Math.round(e.d.cmc)); const cur = need[c]; if (!cur || k > cur.k || (k === cur.k && turn < cur.t)) need[c] = {k, t:turn, n:e.name}; }); });
  const prob = (S2, k, t) => { const seen = Math.min(N, 7 + t - 1); let p = 0; for (let i=k;i<=Math.min(S2,seen);i++) p += hyp(N, S2, seen, i); return p; };
  const rows = Object.entries(need).map(([c,r]) => ({c, ...r, s:src[c], p: prob(src[c], r.k, r.t)}));
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Base de mana</h3><p class="muted">Para cada cor, pego a mágica mais exigente (mais símbolos daquela cor no menor custo) e calculo a chance de ter as fontes de mana necessárias no turno em que você quer jogá-la, jogando primeiro. Referência usada por jogadores profissionais: 90% ou mais.</p>
    ${!rows.length ? '<p class="muted">Cole uma lista no Analisador primeiro.</p>' : `<div class="tbl-wrap"><table><thead><tr><th>Cor</th><th>Fontes no deck</th><th>Carta mais exigente</th><th>Precisa de</th><th>Chance</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${manaSym(r.c)}</td><td class="n">${r.s}</td><td>${cr(r.n)}</td><td>${r.k} fonte(s) no turno ${r.t}</td><td><span class="pill ${r.p>=.9?'good':r.p>=.75?'warn':'bad'}">${(r.p*100).toFixed(0)}%</span></td></tr>`).join('')}</tbody></table></div>
    <div class="tip">${rows.some(r=>r.p<.9) ? `Para melhorar: aumente as fontes de ${rows.filter(r=>r.p<.9).map(r=>manaSym(r.c)).join(' ')} (terrenos duplos, mais básicos dessa cor) ou troque as cartas mais exigentes por versões com menos símbolos coloridos.` : 'Sua base de mana está sólida para todas as cores.'}</div>`}
    <p class="muted" style="font-size:.85rem">Fontes contadas: terrenos básicos, Command Tower e terrenos cujo texto gera aquela cor. Aceleradores de mana não entram na conta.</p></div>`;
}

/* ================= 14. ADIVINHE A CARTA ================= */
const GUESS_POOL = ['Black Lotus','Lightning Bolt','Llanowar Elves','Serra Angel','Shivan Dragon','Counterspell','Sol Ring','Birds of Paradise','Dark Ritual','Storm Crow','Tarmogoyf','Emrakul, the Aeons Torn','Jace, the Mind Sculptor','Liliana of the Veil','Nicol Bolas, Dragon-God','Karn Liberated','Ugin, the Spirit Dragon','Krenko, Mob Boss','Atraxa, Praetors\' Voice','The Ur-Dragon','Grizzly Bears','Giant Growth','Wrath of God','Goblin Guide','Colossal Dreadmaw','Vampire Nighthawk','Pacifism','Murder'];
let gs = null;
async function newGuess(out){
  const ids = shuffleIdx(GUESS_POOL.length).slice(0,4); const ans = GUESS_POOL[ids[0]];
  out.innerHTML = '<p class="muted">Escolhendo uma ilustração…</p>';
  try {
    const r = await fetch('https://api.scryfall.com/cards/named?exact=' + encodeURIComponent(ans), {headers:{'Accept':'application/json'}}); if (!r.ok) throw 0;
    const c = await r.json(); const art = (c.image_uris && c.image_uris.art_crop) || (c.card_faces && c.card_faces[0].image_uris.art_crop);
    gs = {ans, opts: shuffled(ids.map(i=>GUESS_POOL[i])), art, artist: c.artist, zoom: 3.2, x: 20 + Math.random()*60, y: 20 + Math.random()*60, tries:0, done:false, score: gs ? gs.score : 0, n: gs ? gs.n : 0};
    drawGuess(out);
  } catch(e) { out.innerHTML = '<p class="muted">Sem conexão com o Scryfall agora: o jogo precisa baixar as ilustrações.</p>'; }
}
function drawGuess(out){
  out.innerHTML = `<div class="guess" style="background-image:url('${gs.art}');background-size:${gs.zoom*100}%;background-position:${gs.x}% ${gs.y}%"></div>
    <p style="font-size:.78rem;color:#a99ec0;margin-top:4px">Ilustração de ${esc(gs.artist||'')} · © Wizards of the Coast</p>
    <div class="cq">${gs.opts.map(o=>`<button class="opt ${gs.done?(o===gs.ans?'right':''):''}" data-gs="${esc(o)}" ${gs.done?'disabled':''}><span>${esc(o)}</span></button>`).join('')}</div>
    ${gs.done?`<p style="margin-top:8px">${gs.tries===1?'Acertou de primeira!':`Era <b>${esc(gs.ans)}</b>.`} Placar: ${gs.score}/${gs.n}</p><button class="cv-btn gold" id="gsNext" style="margin-top:8px">Próxima</button>`:`<p style="color:#a99ec0;font-size:.85rem;margin-top:6px">Cada erro mostra mais da ilustração.</p>`}`;
  $$('[data-gs]', out).forEach(b => b.onclick = () => { gs.tries++; if (b.dataset.gs === gs.ans) { gs.done = true; gs.n++; if (gs.tries === 1) gs.score++; gs.zoom = 1; sfx('win'); } else { b.disabled = true; b.classList.add('wrong'); gs.zoom = Math.max(1, gs.zoom - 1); sfx('no'); if (gs.tries >= 3) { gs.done = true; gs.n++; gs.zoom = 1; } } drawGuess(out); });
  const nx = $('#gsNext'); if (nx) nx.onclick = () => newGuess(out);
}

/* ================= 15. QUIZ DE LORE ================= */
QUIZ.push(
 {c:'Lore',q:'Quem criou o Magic: The Gathering?',o:['Richard Garfield','Mark Rosewater','Gary Gygax','Peter Adkison'],a:0,e:'Garfield era matemático. Peter Adkison era o dono da Wizards of the Coast, que lançou o jogo em 1993.'},
 {c:'Lore',q:'Qual é o plano natal de Jace Beleren?',o:['Vryn','Ravnica','Dominaria','Kaladesh'],a:0,e:'Jace passou boa parte da história em Ravnica, mas nasceu em Vryn.'},
 {c:'Lore',q:'De onde vem Chandra Nalaar?',o:['Kaladesh','Theros','Zendikar','Innistrad'],a:0,e:'Kaladesh, o plano das invenções movidas a éter.'},
 {c:'Lore',q:'Gideon Jura é originário de qual plano?',o:['Theros','Dominaria','Amonkhet','Ixalan'],a:0,e:'Theros, o plano inspirado na mitologia grega.'},
 {c:'Lore',q:'Quem criou o golem Karn?',o:['Urza','Mishra','Teferi','Nicol Bolas'],a:0,e:'Karn foi construído por Urza para viajar no tempo.'},
 {c:'Lore',q:'Quem é o irmão gêmeo de Nicol Bolas?',o:['Ugin','Niv-Mizzet','Ur-Dragon','Kolaghan'],a:0,e:'Ugin, o Dragão Espírito.'},
 {c:'Lore',q:'Em que plano os Eldrazi foram aprisionados?',o:['Zendikar','Innistrad','Mirrodin','Alara'],a:0,e:'Ugin, Nahiri e Sorin os prenderam em Zendikar.'},
 {c:'Lore',q:'Quantas guildas governam Ravnica?',o:['10','5','3','7'],a:0,e:'Uma para cada par de cores.'},
 {c:'Lore',q:'Como se chama o grupo de planeswalkers que jurou proteger o Multiverso?',o:['Sentinelas (Gatewatch)','Conclave','Os Pretores','Os Titãs'],a:0,e:'Formado por Gideon, Jace, Chandra e Nissa em Zendikar.'},
 {c:'Lore',q:'Quem são os irmãos da "Guerra dos Irmãos"?',o:['Urza e Mishra','Sorin e Edgar','Jace e Liliana','Ugin e Bolas'],a:0,e:'Uma guerra que devastou Dominaria e é contada em Antiquities e The Brothers\' War.'},
 {c:'Lore',q:'Com quantos demônios Liliana Vess fez pacto?',o:['Quatro','Um','Dois','Sete'],a:0,e:'Em troca de juventude e poder.'},
 {c:'Lore',q:'O óleo brilhante que corrompe tudo é marca de qual facção?',o:['Phyrexia','Eldrazi','Orzhov','Simic'],a:0,e:'O óleo phyrexiano transformou Mirrodin em Nova Phyrexia.'}
);

/* ================= 16. EVOLUÇÃO DAS MOLDURAS ================= */
const FRAME_CARDS = ['Lightning Bolt','Llanowar Elves','Serra Angel','Counterspell','Shivan Dragon','Sol Ring'];
async function framesLoad(name, out){
  out.innerHTML = `<p class="muted">Buscando todas as impressões de ${esc(name)}…</p>`;
  try {
    const r = await fetch(`https://api.scryfall.com/cards/search?unique=prints&order=released&dir=asc&q=${encodeURIComponent(`!"${name}" -is:digital`)}`, {headers:{'Accept':'application/json'}}); if (!r.ok) throw 0;
    const j = await r.json(); const seen = new Set();
    const pr = j.data.filter(c => { const k = c.frame + (c.border_color||'') + (c.full_art?'f':''); if (seen.has(k)) return false; seen.add(k); return c.image_uris; });
    const FR = {'1993':'Moldura original (1993–2003)','1997':'Moldura original revisada (1997–2003)','2003':'Moldura moderna (2003–2014)','2015':'Moldura atual (desde 2014)','future':'Moldura "futurista" (Future Sight, 2007)'};
    out.innerHTML = `<p class="muted" style="font-size:.88rem">${j.total_cards} impressões. Uma de cada estilo de moldura, da mais antiga para a mais nova:</p><div class="art-grid">${pr.map(c=>`<a class="art" href="${c.scryfall_uri}" target="_blank" rel="noopener"><img src="${c.image_uris.normal}" alt="" loading="lazy"><span><b style="color:#f3e7cf">${c.released_at.slice(0,4)}</b> · ${esc(c.set_name)}<br>${FR[c.frame]||c.frame}${c.border_color==='borderless'?' · sem borda':''}${c.full_art?' · arte completa':''}</span></a>`).join('')}</div>`;
  } catch(e) { out.innerHTML = '<p class="muted">Sem conexão com o Scryfall agora.</p>'; }
}

/* ================= 17. PRONÚNCIA ================= */
function speak(t){
  try { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9; const v = speechSynthesis.getVoices().find(v => /en(-|_)US/i.test(v.lang)); if (v) u.voice = v; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch(e) { toast('Este navegador não tem leitura em voz alta.'); }
}
const canSpeak = () => typeof speechSynthesis !== 'undefined';
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.stopPropagation(); speak(b.dataset.say); } }, true);
const sayBtn = t => canSpeak() ? `<button class="say" data-say="${esc(t)}" aria-label="Ouvir a pronúncia de ${esc(t)}" title="Ouvir">🔊</button>` : '';
