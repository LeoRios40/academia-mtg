/* ================= v3.3: SOBREVIVA AO MULTIVERSO (jogo estilo "survivors") =================
   Você é um planeswalker. Suas mágicas disparam sozinhas; você só se move. Colete mana,
   suba de nível escolhendo cartas e sobreviva 10 minutos às criaturas do Multiverso. */
const SVW = {
  bolt:{n:'Relâmpago', c:'R', t:'Mágica Instantânea', d:'Um raio atinge o inimigo mais próximo.', mtg:'Lightning Bolt (1993): 3 de dano por uma única mana vermelha. Um dos cards mais jogados da história.', cd:[1.15,1,.9,.8,.65], dmg:[13,15,18,21,25], q:[1,1,2,2,3]},
  lance:{n:'Lança de Luz', c:'W', t:'Mágica Instantânea', d:'Dispara uma lança que atravessa inimigos na direção em que você anda.', mtg:'O branco é a cor da ordem e da proteção: muitas mágicas brancas exilam ou destroem criaturas atacantes.', cd:[1,.9,.8,.7,.6], dmg:[11,13,16,19,23], q:[1,1,2,2,3], pierce:[2,3,3,4,5]},
  orbs:{n:'Orbes Arcanos', c:'U', t:'Encantamento', d:'Orbes giram ao seu redor e ferem quem tocam.', mtg:'O azul é a cor do conhecimento e do controle: anular, devolver e manipular são sua especialidade.', dmg:[8,10,12,15,18], q:[2,3,3,4,5], rad:[58,64,70,78,88]},
  aura:{n:'Drenar Vida', c:'B', t:'Encantamento', d:'Uma aura sombria fere tudo ao redor e devolve um pouco de vida.', mtg:'O preto troca vida por poder: "drenar" é causar dano e ganhar a mesma quantidade de vida.', dmg:[11,14,17,21,26], rad:[56,64,74,86,100]},
  wolves:{n:'Fichas de Lobo', c:'G', t:'Feitiço — Ficha', d:'Lobos 2/2 caçam os inimigos para você.', mtg:'Fichas são criaturas criadas por efeitos de cartas. O verde é a cor que mais cria criaturas e as deixa enormes.', dmg:[9,11,13,16,20], q:[1,2,2,3,4]},
  fire:{n:'Bola de Fogo', c:'R', t:'Feitiço', d:'Uma bola de fogo explode e atinge um grupo de inimigos.', mtg:'Fireball (1993): o primeiro feitiço com X no custo. Quanto mais mana você paga, maior o dano.', cd:[2.4,2.1,1.9,1.7,1.4], dmg:[22,26,31,37,45], rad:[46,54,62,72,84]},
  wrath:{n:'Ira de Deus', c:'W', t:'Feitiço', d:'De tempos em tempos, destrói as criaturas na tela (chefes só sofrem dano).', mtg:'Wrath of God (1993): "Destrua todas as criaturas." A remoção em massa mais famosa do jogo.', cd:[24,21,18,15,12], dmg:[60,80,100,130,160]}
};
const SVP = {
  impeto:{n:'Ímpeto', en:'Haste', d:'+10% de velocidade.', mtg:'No Magic, criaturas com Ímpeto podem atacar no turno em que entram.'},
  vinculo:{n:'Vínculo com a Vida', en:'Lifelink', d:'Recupere vida igual a 3% do dano que você causa.', mtg:'No Magic, o dano causado por uma criatura com Vínculo com a Vida faz você ganhar essa quantidade de vida.'},
  atropelar:{n:'Atropelar', en:'Trample', d:'Projéteis atravessam +1 inimigo.', mtg:'No Magic, o dano que sobra do bloqueador passa para o jogador.'},
  alcance:{n:'Alcance', en:'Reach', d:'+12% de área nas mágicas.', mtg:'No Magic, criaturas com Alcance podem bloquear criaturas que voam.'},
  iniciativa:{n:'Iniciativa', en:'First strike', d:'Mágicas recarregam 8% mais rápido.', mtg:'No Magic, criaturas com Iniciativa causam dano de combate antes das outras.'},
  vigilancia:{n:'Vigilância', en:'Vigilance', d:'Reduz em 1 o dano de cada golpe.', mtg:'No Magic, criaturas com Vigilância atacam sem virar e continuam prontas para bloquear.'},
  toque:{n:'Toque Mortífero', en:'Deathtouch', d:'4% de chance de destruir na hora (exceto chefes).', mtg:'No Magic, qualquer dano de uma criatura com Toque Mortífero é suficiente para destruir.'},
  crescimento:{n:'Crescimento Gigante', en:'Giant Growth', d:'+12% de dano.', mtg:'Giant Growth (1993): +3/+3 até o fim do turno, o truque de combate verde clássico.'},
  terreno:{n:'Terreno Extra', en:'Land', d:'+20 de vida máxima e cura completa.', mtg:'No Magic, você pode jogar um terreno por turno. Mais terrenos, mais mana.'},
  compra:{n:'Compra de Cartas', en:'Card draw', d:'Atrai a mana de mais longe (+30%).', mtg:'No Magic, comprar cartas extras é uma das vantagens mais valiosas.'},
  voar:{n:'Voar', en:'Flying', d:'Inimigos lentos (zumbis e muralhas) não conseguem te tocar por 0,5 s após um golpe.', mtg:'No Magic, criaturas com Voar só podem ser bloqueadas por criaturas que voam ou têm Alcance.'}
};
const SVE = {
  goblin:{n:'Goblin', hp:8, sp:88, dmg:6, r:10, col:'#d4532f', xp:1},
  zumbi:{n:'Zumbi', hp:24, sp:44, dmg:10, r:13, col:'#7f8c6c', xp:2, slow:1},
  vamp:{n:'Vampiro', hp:18, sp:118, dmg:9, r:11, col:'#7a3f8c', xp:3},
  elem:{n:'Elemental', hp:42, sp:62, dmg:12, r:15, col:'#e8862a', xp:3},
  muralha:{n:'Muralha', hp:110, sp:32, dmg:14, r:19, col:'#b9b49a', xp:5, slow:1},
  dragao:{n:'Dragão Shivano', hp:1100, sp:70, dmg:24, r:34, col:'#c4301c', xp:45, boss:1},
  eldrazi:{n:'Titã Eldrazi', hp:4200, sp:52, dmg:38, r:48, col:'#c9c1d8', xp:120, boss:1}
};
const SVPW = [
  ['W','Planeswalker Branco','Começa com Lança de Luz. +20 de vida.','lance'],
  ['U','Planeswalker Azul','Começa com Orbes Arcanos. Atrai mana de mais longe.','orbs'],
  ['B','Planeswalker Preto','Começa com Drenar Vida. Recupera vida ao causar dano.','aura'],
  ['R','Planeswalker Vermelho','Começa com Relâmpago. +10% de dano.','bolt'],
  ['G','Planeswalker Verde','Começa com Fichas de Lobo. +10% de velocidade.','wolves']
];
const SVCOL = {W:'#efe5bd', U:'#4a95d6', B:'#8a7499', R:'#e0603a', G:'#4cae6b'};
let sv = null, svPick = 'R', svRaf = 0;
function svStats(){
  const P = sv.pas, l = k => P[k] || 0, c = sv.col;
  return {sp: 165 * (1 + .1 * l('impeto') + (c === 'G' ? .1 : 0)), dmg: 1 + .12 * l('crescimento') + (c === 'R' ? .1 : 0), cd: Math.pow(.92, l('iniciativa')), area: 1 + .12 * l('alcance'),
    pierce: l('atropelar'), armor: l('vigilancia'), crit: .04 * l('toque'), life: .03 * l('vinculo') + (c === 'B' ? .02 : 0), mag: 70 * (1 + .3 * l('compra') + (c === 'U' ? .3 : 0)), fly: l('voar')};
}
function svNew(col){
  const lite = !!S.lite;
  sv = {col, t:0, kills:0, lvl:1, xp:0, need:6, over:false, won:false, paused:false, choosing:null, endless:false,
    p:{x:0, y:0, hp:100 + (col === 'W' ? 20 : 0), max:100 + (col === 'W' ? 20 : 0), inv:0, dx:1, dy:0},
    w:{}, pas:{}, en:[], pr:[], orbs:[], fx:[], txt:[], wolves:[], spawn:0, nextBoss:180, lite, maxEn: lite ? 130 : 230, keys:{}, joy:null, lastT:0};
  sv.w[SVPW.find(x => x[0] === col)[3]] = {l:1, t:0};
  sv.st = svStats();
}
/* ---------- tela de início (dentro do Treino) ---------- */
function renderSurv(box){
  box = box || $('#trBody');
  const B = S.survBest;
  box.innerHTML = `<div class="panel stack-v surv-intro"><h3>Sobreviva ao Multiverso</h3>
    <p class="muted" style="margin:0">Um jogo de ação no estilo "survivors": suas mágicas disparam sozinhas, você só desvia. Colete mana, suba de nível escolhendo cartas com habilidades reais do Magic e sobreviva 10 minutos aos goblins, zumbis, vampiros, dragões e ao titã Eldrazi.</p>
    ${B ? `<div class="row-h"><span class="pill good">Recorde: ${svFmt(B.t)}</span><span class="pill">${B.kills} criaturas</span><span class="pill">nível ${B.lvl}</span>${B.won ? '<span class="pill good">Venceu</span>' : ''}</div>` : ''}
    <span class="eyebrow">Escolha seu planeswalker</span>
    <div class="surv-pw">${SVPW.map(([c,n,d]) => `<button class="surv-c" data-svc="${c}" aria-pressed="${svPick===c}" style="--pc:${SVCOL[c]}">${manaSym(c)}<b>${n}</b><small>${d}</small></button>`).join('')}</div>
    <div class="row-h"><button class="btn primary" id="svGo">Jogar</button><span class="muted" style="font-size:.88rem">PC: setas ou W A S D · Celular: arraste o dedo na tela · Pausa: Esc ou P</span></div>
    <details><summary>Como jogar e o que cada coisa ensina sobre Magic</summary><div class="stack-v" style="margin-top:8px;font-size:.92rem">
      <p style="margin:0">Cada mágica do jogo é inspirada numa carta clássica (Lightning Bolt, Fireball, Wrath of God…), e cada melhoria é uma palavra-chave do Magic: Ímpeto, Atropelar, Vínculo com a Vida, Toque Mortífero, Voar. Ao escolher uma carta, você lê o que ela faz no jogo e o que significa no Magic de verdade.</p>
      <p style="margin:0">A mana que os inimigos deixam tem a cor deles. Junte mana para subir de nível. Aos 3 e aos 6 minutos chega um Dragão Shivano; aos 9, o Titã Eldrazi.</p></div></details></div>`;
  $$('[data-svc]').forEach(b => b.onclick = () => { svPick = b.dataset.svc; $$('[data-svc]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#svGo').onclick = () => svStart(svPick);
}
const svFmt = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
/* ---------- jogo ---------- */
function svStart(col){
  svNew(col);
  let ov = $('#surv'); if (!ov) { ov = document.createElement('div'); ov.id = 'surv'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.style.overflow = 'hidden';
  ov.innerHTML = `<canvas id="svCv" aria-label="Jogo Sobreviva ao Multiverso"></canvas>
    <div class="sv-hud"><div class="sv-bars"><div class="sv-hp"><i id="svHp"></i></div><div class="sv-xp"><i id="svXp"></i></div></div>
      <span class="sv-t" id="svT">0:00</span><span class="sv-k" id="svK">0</span><span class="sv-l" id="svL">Nv 1</span><button class="sv-pause" id="svPause" aria-label="Pausar">II</button></div>
    <div class="sv-w" id="svW"></div><div class="sv-ov" id="svOv" hidden></div>`;
  const cv = $('#svCv'); sv.cv = cv; sv.ctx = cv.getContext('2d');
  svResize(); svBindInput();
  $('#svPause').onclick = () => svPause(true);
  sv.lastT = performance.now(); cancelAnimationFrame(svRaf); svRaf = requestAnimationFrame(svLoop);
  svDrawW();
}
function svResize(){ if (!sv || !sv.cv) return; const dpr = Math.min(sv.lite ? 1 : 1.5, devicePixelRatio || 1); sv.dpr = dpr; sv.W = innerWidth; sv.H = innerHeight; sv.cv.width = sv.W * dpr; sv.cv.height = sv.H * dpr; sv.cv.style.width = sv.W + 'px'; sv.cv.style.height = sv.H + 'px'; }
addEventListener('resize', () => svResize());
document.addEventListener('visibilitychange', () => { if (document.hidden && sv && !sv.over && !sv.paused && !sv.choosing && !$('#surv').hidden) svPause(true); });
function svBindInput(){
  const k = sv.keys;
  sv.onKey = e => { if (!sv || $('#surv').hidden) return; const d = e.type === 'keydown'; const m = {ArrowUp:'u', w:'u', W:'u', ArrowDown:'d', s:'d', S:'d', ArrowLeft:'l', a:'l', A:'l', ArrowRight:'r', d:'r', D:'r'}[e.key];
    if (m) { k[m] = d; e.preventDefault(); }
    if (d && (e.key === 'Escape' || e.key === 'p' || e.key === 'P')) { if (sv.choosing) return; svPause(!sv.paused); }
    if (d && sv.choosing && /^[123]$/.test(e.key)) { const b = $$('[data-svu]')[+e.key - 1]; b && b.click(); } };
  addEventListener('keydown', sv.onKey); addEventListener('keyup', sv.onKey);
  const cv = sv.cv;
  cv.addEventListener('touchstart', e => { const t = e.changedTouches[0]; svJoyStart(t.clientX, t.clientY); e.preventDefault(); }, {passive:false});
  cv.addEventListener('touchmove', e => { const t = e.changedTouches[0]; svJoyMove(t.clientX, t.clientY); e.preventDefault(); }, {passive:false});
  cv.addEventListener('touchend', svJoyEnd); cv.addEventListener('touchcancel', svJoyEnd);
  cv.addEventListener('mousedown', e => svJoyStart(e.clientX, e.clientY));
}
function svJoyStart(x, y){ if (sv) sv.joy = {x0:x, y0:y, x, y}; }
function svJoyMove(x, y){ if (sv && sv.joy) { sv.joy.x = x; sv.joy.y = y; } }
function svJoyEnd(){ if (sv) sv.joy = null; }
addEventListener('mousemove', e => svJoyMove(e.clientX, e.clientY)); addEventListener('mouseup', svJoyEnd);
function svClose(){
  cancelAnimationFrame(svRaf); const ov = $('#surv'); if (ov) { ov.hidden = true; ov.innerHTML = ''; } document.body.style.overflow = '';
  if (sv && sv.onKey) { removeEventListener('keydown', sv.onKey); removeEventListener('keyup', sv.onKey); }
  sv = null; if (currentView === 'treino' && trTab === 'surv') renderSurv();
}
function svPause(on){
  if (!sv || sv.over) return; sv.paused = on; const o = $('#svOv');
  if (on) { o.hidden = false; o.innerHTML = `<div class="sv-box"><h2>Pausa</h2><p>${svFmt(sv.t)} · ${sv.kills} criaturas · nível ${sv.lvl}</p>
      <div class="sv-have">${svHaveHTML()}</div><div class="row-h" style="justify-content:center"><button class="btn primary" id="svRes">Continuar</button><button class="btn" id="svQuit">Sair do jogo</button></div></div>`;
    $('#svRes').onclick = () => svPause(false); $('#svQuit').onclick = () => svEnd(false, true); $('#svRes').focus(); }
  else { o.hidden = true; sv.lastT = performance.now(); }
}
function svHaveHTML(){ return Object.entries(sv.w).map(([k,w]) => `<span class="pill" style="border:1px solid ${SVCOL[SVW[k].c]}">${SVW[k].n} ${w.l}</span>`).join('') + Object.entries(sv.pas).map(([k,l]) => `<span class="pill">${SVP[k].n} ${l}</span>`).join(''); }
function svDrawW(){ const el = $('#svW'); if (el) el.innerHTML = Object.entries(sv.w).map(([k,w]) => `<span style="--pc:${SVCOL[SVW[k].c]}" title="${SVW[k].n}">${SVW[k].n.split(' ')[0]} <b>${w.l}</b></span>`).join(''); }
/* ---------- laço principal ---------- */
function svLoop(now){
  if (!sv) return;
  let dt = Math.min(.05, (now - sv.lastT) / 1000); sv.lastT = now;
  if (!sv.paused && !sv.choosing && !sv.over) svUpdate(dt);
  svRender(); svRaf = requestAnimationFrame(svLoop);
}
const d2 = (a, b) => { const x = a.x - b.x, y = a.y - b.y; return x*x + y*y; };
function svNearest(x, y, maxD){ let best = null, bd = maxD * maxD; for (const e of sv.en) { if (e.dead) continue; const d = (e.x-x)*(e.x-x) + (e.y-y)*(e.y-y); if (d < bd) { bd = d; best = e; } } return best; }
function svHit(e, dmg, kx, ky){
  if (e.dead) return; const st = sv.st;
  if (!e.boss && st.crit && Math.random() < st.crit) dmg = e.hp;
  e.hp -= dmg; e.flash = .1; if (kx != null && !e.boss) { e.x += kx * 6; e.y += ky * 6; }
  if (st.life) { const p = sv.p; p.hp = Math.min(p.max, p.hp + dmg * st.life); }
  if (sv.txt.length < (sv.lite ? 20 : 45)) sv.txt.push({x:e.x, y:e.y - e.r, v:Math.round(dmg), t:.6});
  if (e.hp <= 0) { e.dead = true; sv.kills++; sv.orbs.push({x:e.x, y:e.y, v:e.xp, c:e.col}); if (e.boss) { sv.fx.push({k:'boom', x:e.x, y:e.y, r:e.r*3, t:.6, c:'#f3d68c'}); toastSv(`${e.n} derrotado!`); } }
}
function toastSv(m){ sv.banner = {m, t:2.2}; }
function svUpdate(dt){
  const p = sv.p, st = sv.st; sv.t += dt;
  // movimento
  let mx = (sv.keys.r ? 1 : 0) - (sv.keys.l ? 1 : 0), my = (sv.keys.d ? 1 : 0) - (sv.keys.u ? 1 : 0);
  if (sv.joy) { const jx = sv.joy.x - sv.joy.x0, jy = sv.joy.y - sv.joy.y0, jl = Math.hypot(jx, jy); if (jl > 8) { mx = jx / Math.max(jl, 50); my = jy / Math.max(jl, 50); } }
  const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
  if (ml > .05) { p.dx = mx / (ml || 1); p.dy = my / (ml || 1); }
  p.x += mx * st.sp * dt; p.y += my * st.sp * dt; p.inv = Math.max(0, p.inv - dt);
  // inimigos: surgimento
  const T = sv.t, rate = 2.2 + T / 20;
  sv.spawn += dt * rate;
  while (sv.spawn >= 1 && sv.en.length < sv.maxEn) { sv.spawn--; svSpawn(svPickType(T)); }
  if (T >= sv.nextBoss) { svSpawn(T >= 530 ? 'eldrazi' : 'dragao'); toastSv(T >= 530 ? 'O Titã Eldrazi chegou!' : 'Um Dragão Shivano se aproxima!'); sv.nextBoss = sv.nextBoss === 180 ? 360 : sv.nextBoss === 360 ? 540 : sv.nextBoss + 120; }
  if (!sv.won && !sv.endless && T >= 600) { svEnd(true); return; }
  // inimigos: movimento e contato
  for (const e of sv.en) {
    if (e.dead) continue;
    const dx = p.x - e.x, dy = p.y - e.y, dl = Math.hypot(dx, dy) || 1;
    e.x += dx / dl * e.sp * dt; e.y += dy / dl * e.sp * dt; e.flash = Math.max(0, e.flash - dt);
    if (e.boss && e.k === 'dragao') { e.cd = (e.cd || 2.5) - dt; if (e.cd <= 0) { e.cd = 2.6; const a = Math.atan2(dy, dx); for (let i = -1; i <= 1; i++) sv.pr.push({x:e.x, y:e.y, vx:Math.cos(a + i*.25)*190, vy:Math.sin(a + i*.25)*190, r:8, dmg:e.dmg*.6, life:4, enemy:1, c:'#ff7a3a'}); } }
    if (dl < e.r + 13 && p.inv <= 0 && !(st.fly && e.slow && p.flyT > 0)) { const dmg = Math.max(1, e.dmg - st.armor); p.hp -= dmg; p.inv = .45; p.flyT = st.fly ? .5 : 0; sv.hitFx = .2; if (p.hp <= 0) { svEnd(false); return; } }
  }
  p.flyT = Math.max(0, (p.flyT || 0) - dt);
  // armas
  for (const [k, w] of Object.entries(sv.w)) svWeapon(k, w, dt);
  // projéteis
  for (const b of sv.pr) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    if (b.enemy) { if (p.inv <= 0 && (b.x-p.x)**2 + (b.y-p.y)**2 < (b.r + 12)**2) { p.hp -= Math.max(1, b.dmg - st.armor); p.inv = .45; b.life = 0; sv.hitFx = .2; if (p.hp <= 0) { svEnd(false); return; } } continue; }
    for (const e of sv.en) { if (e.dead || (b.hit && b.hit.has(e))) continue; if ((e.x-b.x)**2 + (e.y-b.y)**2 < (e.r + b.r)**2) {
      if (b.kind === 'fire') { svBoom(b.x, b.y, b.rad, b.dmg); b.life = 0; break; }
      svHit(e, b.dmg, b.vx / 400, b.vy / 400); (b.hit = b.hit || new Set()).add(e); if (--b.pierce < 0) { b.life = 0; break; } } }
  }
  sv.pr = sv.pr.filter(b => b.life > 0);
  // mana
  const mag2 = st.mag * st.mag;
  for (const o of sv.orbs) { const d = (o.x-p.x)**2 + (o.y-p.y)**2; if (d < mag2) { const l = Math.sqrt(d) || 1; o.x += (p.x - o.x) / l * 420 * dt; o.y += (p.y - o.y) / l * 420 * dt; } if (d < 400) { o.got = 1; svGain(o.v); } }
  sv.orbs = sv.orbs.filter(o => !o.got);
  if (sv.orbs.length > 400) sv.orbs.splice(0, sv.orbs.length - 400);
  sv.en = sv.en.filter(e => !e.dead && (e.boss || Math.abs(e.x - p.x) < sv.W + 400 && Math.abs(e.y - p.y) < sv.H + 400));
  for (const f of sv.fx) f.t -= dt; sv.fx = sv.fx.filter(f => f.t > 0);
  for (const t of sv.txt) { t.t -= dt; t.y -= 30 * dt; } sv.txt = sv.txt.filter(t => t.t > 0);
  if (sv.banner) { sv.banner.t -= dt; if (sv.banner.t <= 0) sv.banner = null; }
  sv.hitFx = Math.max(0, (sv.hitFx || 0) - dt);
  // HUD
  const hp = $('#svHp'), xp = $('#svXp'); if (hp) { hp.style.width = Math.max(0, p.hp / p.max * 100) + '%'; xp.style.width = (sv.xp / sv.need * 100) + '%'; $('#svT').textContent = svFmt(sv.t); $('#svK').textContent = sv.kills; $('#svL').textContent = 'Nv ' + sv.lvl; }
}
function svPickType(T){
  const r = Math.random();
  if (T < 60) return r < .85 ? 'goblin' : 'zumbi';
  if (T < 180) return r < .5 ? 'goblin' : r < .85 ? 'zumbi' : 'vamp';
  if (T < 360) return r < .3 ? 'goblin' : r < .55 ? 'vamp' : r < .85 ? 'elem' : 'zumbi';
  return r < .25 ? 'vamp' : r < .5 ? 'elem' : r < .75 ? 'muralha' : r < .9 ? 'goblin' : 'zumbi';
}
function svSpawn(k){
  const D = SVE[k], a = Math.random() * Math.PI * 2, R = Math.hypot(sv.W, sv.H) / 2 + 60, sc = 1 + sv.t / 110;
  sv.en.push({k, n:D.n, x:sv.p.x + Math.cos(a) * R, y:sv.p.y + Math.sin(a) * R, hp:D.hp * sc, max:D.hp * sc, sp:D.sp * (D.boss ? 1 : 1 + sv.t / 1200), dmg:D.dmg * (1 + sv.t / 600), r:D.r, col:D.col, xp:D.xp, boss:D.boss, slow:D.slow, flash:0});
}
function svBoom(x, y, rad, dmg){ sv.fx.push({k:'boom', x, y, r:rad, t:.35, c:'#ff8a3a'}); for (const e of sv.en) if (!e.dead && (e.x-x)**2 + (e.y-y)**2 < (rad + e.r)**2) svHit(e, dmg); }
function svWeapon(k, w, dt){
  const D = SVW[k], L = w.l - 1, st = sv.st, p = sv.p, dmg = D.dmg[L] * st.dmg;
  if (k === 'orbs') { w.a = (w.a || 0) + dt * 3.2; const n = D.q[L], R = D.rad[L] * st.area; w.pos = [];
    for (let i = 0; i < n; i++) { const a = w.a + i * Math.PI * 2 / n, x = p.x + Math.cos(a) * R, y = p.y + Math.sin(a) * R; w.pos.push([x, y]);
      for (const e of sv.en) if (!e.dead && (e.x-x)**2 + (e.y-y)**2 < (e.r + 11)**2) { e.oh = e.oh || 0; if (sv.t - e.oh > .35) { e.oh = sv.t; svHit(e, dmg, Math.cos(a), Math.sin(a)); } } } return; }
  if (k === 'aura') { const R = D.rad[L] * st.area; w.r = R; w.t = (w.t || 0) - dt; if (w.t <= 0) { w.t = .5; for (const e of sv.en) if (!e.dead && (e.x-p.x)**2 + (e.y-p.y)**2 < (R + e.r)**2) { svHit(e, dmg * .5); p.hp = Math.min(p.max, p.hp + .15); } } return; }
  if (k === 'wolves') { const n = D.q[L]; while (sv.wolves.length < n) sv.wolves.push({x:p.x, y:p.y, cd:0});
    for (const wf of sv.wolves) { const tg = svNearest(wf.x, wf.y, 420); let tx = p.x, ty = p.y; if (tg) { tx = tg.x; ty = tg.y; } const dx = tx - wf.x, dy = ty - wf.y, dl = Math.hypot(dx, dy) || 1; const sp = tg ? 260 : 200;
      if (dl > 6) { wf.x += dx / dl * sp * dt; wf.y += dy / dl * sp * dt; } wf.cd -= dt; if (tg && dl < tg.r + 12 && wf.cd <= 0) { wf.cd = .45; svHit(tg, dmg, dx / dl, dy / dl); }
      if (Math.hypot(p.x - wf.x, p.y - wf.y) > 600) { wf.x = p.x; wf.y = p.y; } } return; }
  w.t = (w.t || 0) - dt; if (w.t > 0) return; w.t = D.cd[L] * st.cd;
  if (k === 'bolt') { const n = D.q[L]; const used = new Set(); for (let i = 0; i < n; i++) { let tg = null, bd = 520*520; for (const e of sv.en) { if (e.dead || used.has(e)) continue; const d = d2(e, p); if (d < bd) { bd = d; tg = e; } } if (!tg) break; used.add(tg); sv.fx.push({k:'bolt', x:p.x, y:p.y, x2:tg.x, y2:tg.y, t:.14}); svHit(tg, dmg); } }
  else if (k === 'lance') { const n = D.q[L]; for (let i = 0; i < n; i++) { const a = Math.atan2(p.dy, p.dx) + (i - (n-1)/2) * .18; sv.pr.push({x:p.x, y:p.y, vx:Math.cos(a) * 520, vy:Math.sin(a) * 520, r:7 * st.area, dmg, pierce:D.pierce[L] + st.pierce, life:1.1, c:'#fff6c8', kind:'lance'}); } }
  else if (k === 'fire') { const tg = svNearest(p.x, p.y, 480); if (!tg) { w.t = .3; return; } const dx = tg.x - p.x, dy = tg.y - p.y, dl = Math.hypot(dx, dy) || 1; sv.pr.push({x:p.x, y:p.y, vx:dx / dl * 330, vy:dy / dl * 330, r:10, dmg, rad:D.rad[L] * st.area, pierce:0, life:1.8, c:'#ff7a2a', kind:'fire'}); }
  else if (k === 'wrath') { sv.fx.push({k:'wrath', t:.6}); for (const e of sv.en) { if (e.dead) continue; if (Math.abs(e.x - p.x) < sv.W/2 + 20 && Math.abs(e.y - p.y) < sv.H/2 + 20) svHit(e, e.boss ? dmg : e.hp + 1); } }
}
function svGain(v){
  sv.xp += v;
  if (sv.xp >= sv.need) { sv.xp -= sv.need; sv.lvl++; sv.need = Math.round(6 + sv.lvl * 4.5 + Math.pow(sv.lvl, 1.35)); svLevelUp(); }
}
function svOptions(){
  const opts = [];
  Object.entries(sv.w).forEach(([k,w]) => { if (w.l < 5) opts.push({type:'w', k, l:w.l + 1}); });
  if (Object.keys(sv.w).length < 5) Object.keys(SVW).forEach(k => { if (!sv.w[k]) opts.push({type:'w', k, l:1}); });
  Object.keys(SVP).forEach(k => { const l = sv.pas[k] || 0; if (l < 5 && (l || Object.keys(sv.pas).length < 5)) opts.push({type:'p', k, l:l + 1}); });
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  // garante ao menos uma melhoria de mágica que você já tem, quando houver
  const up = opts.findIndex(o => o.type === 'w' && sv.w[o.k]); if (up > 2) [opts[0], opts[up]] = [opts[up], opts[0]];
  return opts.slice(0, 3);
}
function svLevelUp(){
  const O = svOptions(); if (!O.length) { sv.p.hp = Math.min(sv.p.max, sv.p.hp + 25); return; }
  sv.choosing = O; const o = $('#svOv'); o.hidden = false;
  o.innerHTML = `<div class="sv-box sv-lv"><h2>Nível ${sv.lvl}!</h2><p>Escolha uma carta</p><div class="sv-cards">${O.map((x,i) => { const D = x.type === 'w' ? SVW[x.k] : SVP[x.k]; const c = x.type === 'w' ? D.c : 'C';
      return `<button class="sv-card" data-svu="${i}" style="--pc:${c === 'C' ? '#c9a24a' : SVCOL[c]}"><span class="sv-ct"><b>${D.n}</b>${x.type === 'w' ? manaSym(D.c) : ''}</span>
        <span class="sv-ty">${x.type === 'w' ? D.t : 'Habilidade'} · ${x.l === 1 ? (x.type === 'w' ? 'nova' : 'nível 1') : 'nível ' + x.l}</span>
        <span class="sv-tx">${x.type === 'w' ? D.d : D.d}${x.type === 'w' && x.l > 1 ? ' Mais forte.' : ''}</span>
        <span class="sv-fl">${x.type === 'w' ? D.mtg : `${D.en ? D.en + '. ' : ''}${D.mtg}`}</span><span class="sv-kk">${i+1}</span></button>`; }).join('')}</div></div>`;
  $$('[data-svu]').forEach(b => b.onclick = () => { const x = O[+b.dataset.svu]; if (x.type === 'w') { sv.w[x.k] = sv.w[x.k] || {l:0, t:0}; sv.w[x.k].l = x.l; } else { sv.pas[x.k] = x.l; if (x.k === 'terreno') { sv.p.max += 20; sv.p.hp = sv.p.max; } }
    sv.st = svStats(); sv.choosing = null; o.hidden = true; sv.lastT = performance.now(); svDrawW(); if (sv.xp >= sv.need) svGain(0); });
  const f = $('[data-svu]'); f && f.focus();
}
function svEnd(won, quit){
  sv.over = true; const o = $('#svOv'); const fact = KW[Math.floor(Math.random() * KW.length)];
  const B = S.survBest; const better = !B || sv.t > B.t; if (!quit && better) { S.survBest = {t:Math.round(sv.t), kills:sv.kills, lvl:sv.lvl, won, col:sv.col}; }
  const xpGain = quit ? 0 : Math.min(60, Math.round(sv.t / 20 + sv.kills / 40) + (won ? 20 : 0)); if (xpGain) addXP(xpGain); S.survGames = (S.survGames || 0) + 1; save();
  o.hidden = false;
  o.innerHTML = `<div class="sv-box"><h2>${won ? 'Você sobreviveu ao Multiverso!' : quit ? 'Fim de jogo' : 'Sua centelha se apagou'}</h2>
    <p class="sv-stats"><span><b>${svFmt(sv.t)}</b> sobrevivido</span><span><b>${sv.kills}</b> criaturas</span><span><b>${sv.lvl}</b> nível</span>${xpGain ? `<span><b>+${xpGain}</b> XP</span>` : ''}</p>
    ${!quit && better ? '<p class="sv-rec">Novo recorde!</p>' : ''}
    <div class="sv-fact"><span class="eyebrow">Você sabia?</span><p><b>${fact.pt} (${fact.en}):</b> ${esc(fact.x)}</p></div>
    <div class="row-h" style="justify-content:center">${won ? '<button class="btn" id="svEndless">Continuar no modo infinito</button>' : ''}<button class="btn primary" id="svAgain">Jogar de novo</button><button class="btn" id="svExit">Sair</button></div></div>`;
  $('#svAgain').onclick = () => { const c = sv.col; svClose(); svStart(c); };
  $('#svExit').onclick = svClose;
  const en = $('#svEndless'); if (en) en.onclick = () => { sv.over = false; sv.won = true; sv.endless = true; o.hidden = true; sv.lastT = performance.now(); };
}
/* ---------- desenho ---------- */
function svRender(){
  const c = sv.ctx, W = sv.W, H = sv.H, p = sv.p, dpr = sv.dpr; if (!c) return;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = '#121822'; c.fillRect(0, 0, W, H);
  const ox = W/2 - p.x, oy = H/2 - p.y;
  // tapete: grade e runas
  c.strokeStyle = 'rgba(201,162,74,.08)'; c.lineWidth = 1; const g = 80, sx = ((ox % g) + g) % g, sy = ((oy % g) + g) % g;
  c.beginPath(); for (let x = sx; x < W; x += g) { c.moveTo(x, 0); c.lineTo(x, H); } for (let y = sy; y < H; y += g) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke();
  c.save(); c.translate(ox, oy);
  // aura
  if (sv.w.aura && sv.w.aura.r) { c.fillStyle = 'rgba(122,63,140,.18)'; c.strokeStyle = 'rgba(190,140,220,.45)'; c.beginPath(); c.arc(p.x, p.y, sv.w.aura.r, 0, 6.283); c.fill(); c.stroke(); }
  // mana
  for (const o of sv.orbs) { c.fillStyle = o.c; c.beginPath(); c.arc(o.x, o.y, o.v >= 20 ? 7 : 4, 0, 6.283); c.fill(); }
  // inimigos
  for (const e of sv.en) svDrawEnemy(c, e);
  // lobos
  if (sv.w.wolves) for (const wf of sv.wolves) { c.fillStyle = '#5a8f4e'; c.beginPath(); c.arc(wf.x, wf.y, 9, 0, 6.283); c.fill(); c.fillStyle = '#3c6a33'; c.beginPath(); c.moveTo(wf.x - 7, wf.y - 5); c.lineTo(wf.x - 4, wf.y - 13); c.lineTo(wf.x - 1, wf.y - 6); c.moveTo(wf.x + 7, wf.y - 5); c.lineTo(wf.x + 4, wf.y - 13); c.lineTo(wf.x + 1, wf.y - 6); c.fill(); }
  // orbes
  if (sv.w.orbs && sv.w.orbs.pos) for (const [x,y] of sv.w.orbs.pos) { c.fillStyle = '#9fd0ff'; c.beginPath(); c.arc(x, y, 9, 0, 6.283); c.fill(); c.fillStyle = '#e8f5ff'; c.beginPath(); c.arc(x - 2, y - 2, 3.5, 0, 6.283); c.fill(); }
  // projéteis
  for (const b of sv.pr) { c.fillStyle = b.c; c.beginPath(); if (b.kind === 'lance') { const a = Math.atan2(b.vy, b.vx); c.save(); c.translate(b.x, b.y); c.rotate(a); c.fillRect(-14, -2.5, 28, 5); c.restore(); } else { c.arc(b.x, b.y, b.r, 0, 6.283); c.fill(); } }
  // efeitos
  for (const f of sv.fx) {
    if (f.k === 'bolt') { c.strokeStyle = '#fff1a8'; c.lineWidth = 3; c.beginPath(); c.moveTo(f.x, f.y); const n = 5; for (let i = 1; i < n; i++) { const t = i / n; c.lineTo(f.x + (f.x2 - f.x) * t + (Math.random() - .5) * 18, f.y + (f.y2 - f.y) * t + (Math.random() - .5) * 18); } c.lineTo(f.x2, f.y2); c.stroke(); }
    else if (f.k === 'boom') { c.fillStyle = `rgba(255,140,60,${f.t * 1.4})`; c.beginPath(); c.arc(f.x, f.y, f.r * (1.2 - f.t), 0, 6.283); c.fill(); }
  }
  // jogador
  const blink = p.inv > 0 && Math.floor(p.inv * 20) % 2;
  if (!blink) { c.fillStyle = 'rgba(243,214,140,.25)'; c.beginPath(); c.arc(p.x, p.y, 22, 0, 6.283); c.fill();
    c.fillStyle = SVCOL[sv.col]; c.strokeStyle = '#1a1208'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 14, 0, 6.283); c.fill(); c.stroke();
    c.fillStyle = '#f3d68c'; c.beginPath(); c.moveTo(p.x, p.y - 8); c.lineTo(p.x + 5, p.y); c.lineTo(p.x, p.y + 8); c.lineTo(p.x - 5, p.y); c.closePath(); c.fill(); }
  // números de dano
  c.font = 'bold 12px sans-serif'; c.textAlign = 'center';
  for (const t of sv.txt) { c.fillStyle = `rgba(255,255,255,${Math.min(1, t.t * 2)})`; c.fillText(t.v, t.x, t.y); }
  c.restore();
  if (sv.fx.some(f => f.k === 'wrath')) { const f = sv.fx.find(f => f.k === 'wrath'); c.fillStyle = `rgba(255,250,220,${f.t * .8})`; c.fillRect(0, 0, W, H); }
  if (sv.hitFx) { c.fillStyle = `rgba(200,30,30,${sv.hitFx})`; c.fillRect(0, 0, W, H); }
  // joystick
  if (sv.joy) { c.strokeStyle = 'rgba(243,214,140,.5)'; c.lineWidth = 2; c.beginPath(); c.arc(sv.joy.x0, sv.joy.y0, 44, 0, 6.283); c.stroke(); const jx = sv.joy.x - sv.joy.x0, jy = sv.joy.y - sv.joy.y0, jl = Math.min(44, Math.hypot(jx, jy)) / (Math.hypot(jx, jy) || 1); c.fillStyle = 'rgba(243,214,140,.6)'; c.beginPath(); c.arc(sv.joy.x0 + jx * jl, sv.joy.y0 + jy * jl, 18, 0, 6.283); c.fill(); }
  // aviso de chefe
  if (sv.banner) { c.font = 'bold 22px Georgia, serif'; c.textAlign = 'center'; c.fillStyle = `rgba(243,214,140,${Math.min(1, sv.banner.t)})`; c.fillText(sv.banner.m, W/2, H * .22); }
  // chefe: barra de vida
  const boss = sv.en.find(e => e.boss && !e.dead);
  if (boss) { const bw = Math.min(420, W - 40); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(W/2 - bw/2, 58, bw, 10); c.fillStyle = '#e0603a'; c.fillRect(W/2 - bw/2, 58, bw * Math.max(0, boss.hp / boss.max), 10); c.font = 'bold 12px sans-serif'; c.textAlign = 'center'; c.fillStyle = '#f3d68c'; c.fillText(boss.n, W/2, 54); }
}
function svDrawEnemy(c, e){
  const x = e.x, y = e.y, r = e.r;
  c.fillStyle = e.flash > 0 ? '#ffffff' : e.col;
  if (e.k === 'goblin') { c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); c.beginPath(); c.moveTo(x - r, y - 2); c.lineTo(x - r - 6, y - 8); c.lineTo(x - r + 3, y - 6); c.moveTo(x + r, y - 2); c.lineTo(x + r + 6, y - 8); c.lineTo(x + r - 3, y - 6); c.fill(); }
  else if (e.k === 'zumbi') { c.fillRect(x - r, y - r, r * 2, r * 2); c.fillStyle = '#2b2f24'; c.fillRect(x - 6, y - 4, 4, 3); c.fillRect(x + 2, y - 4, 4, 3); }
  else if (e.k === 'vamp') { c.beginPath(); c.moveTo(x - r * 2, y - 4); c.quadraticCurveTo(x - r, y - r * 1.6, x, y - 2); c.quadraticCurveTo(x + r, y - r * 1.6, x + r * 2, y - 4); c.lineTo(x, y + r); c.closePath(); c.fill(); }
  else if (e.k === 'elem') { c.beginPath(); c.moveTo(x, y - r * 1.4); c.quadraticCurveTo(x + r * 1.2, y, x, y + r); c.quadraticCurveTo(x - r * 1.2, y, x, y - r * 1.4); c.fill(); }
  else if (e.k === 'muralha') { c.fillRect(x - r, y - r * .8, r * 2, r * 1.6); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; c.strokeRect(x - r, y - r * .8, r * 2, r * 1.6); }
  else if (e.k === 'dragao') { c.beginPath(); c.moveTo(x - r * 2.2, y - r * .6); c.quadraticCurveTo(x - r, y - r * 1.8, x, y - r * .4); c.quadraticCurveTo(x + r, y - r * 1.8, x + r * 2.2, y - r * .6); c.lineTo(x + r, y + r * .2); c.lineTo(x - r, y + r * .2); c.closePath(); c.fill(); c.beginPath(); c.arc(x, y, r * .8, 0, 6.283); c.fill(); c.fillStyle = '#ffd36a'; c.beginPath(); c.arc(x - 8, y - 6, 4, 0, 6.283); c.moveTo(x + 12, y - 6); c.arc(x + 8, y - 6, 4, 0, 6.283); c.fill(); }
  else if (e.k === 'eldrazi') { c.beginPath(); c.arc(x, y - r * .2, r * .8, 0, 6.283); c.fill(); c.strokeStyle = e.flash > 0 ? '#fff' : '#9a8fb2'; c.lineWidth = 6; for (let i = 0; i < 6; i++) { const a = Math.PI * (.15 + i * .14); c.beginPath(); c.moveTo(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .4); c.quadraticCurveTo(x + Math.cos(a) * r * 1.3, y + r, x + Math.cos(a) * r * 1.1 + Math.sin(sv.t * 3 + i) * 8, y + r * 1.5); c.stroke(); } }
  if (e.boss) return;
}
