/* ================= PARTIDA CONTRA O COMPUTADOR ================= */
const KWRE = {fs:/iniciativa|first strike/i, ds:/golpe duplo|double strike/i, dt:/toque mortífero|deathtouch/i, tr:/atropelar|trample/i, ll:/vínculo com a vida|lifelink/i,
  ind:/indestrutível|indestructible/i, fly:/\bvoar\b|flying/i, reach:/alcance|reach/i, haste:/ímpeto|haste/i, def:/defensor|defender/i, vig:/vigilância|vigilance/i, menace:/ameaçar|menace/i, hex:/resistência a magia|hexproof/i};
function kwOf(n){ const d = cardData(n) || {}; const x = d.x || ''; const o = {}; for (const k in KWRE) if (KWRE[k].test(x)) o[k] = true; if (o.fs && /golpe duplo|double strike/i.test(x)) o.fs = false; return o; }
const GSPELL = {
  'Lightning Bolt':{burn:3}, 'Shock':{burn:2}, 'Searing Spear':{burn:3}, 'Incinerate':{burn:3},
  'Giant Growth':{pump:3}, 'Murder':{kill:1}, 'Pacifism':{pac:1}, 'Divination':{draw:2}
};
const DUEL_DECKS = {
  rg:{n:'Gruul (verde e vermelho)', lands:['Mountain','Forest'], cards:{'Goblin Guide':2,'Boggart Brute':2,'Centaur Courser':3,'Grizzly Bears':3,'Giant Spider':2,'Colossal Dreadmaw':2,'Shivan Dragon':1,'Lightning Bolt':2,'Shock':2,'Searing Spear':1,'Giant Growth':3}},
  wb:{n:'Orzhov (branco e preto)', lands:['Plains','Swamp'], cards:{'Serra Angel':3,'Vampire Nighthawk':3,'Fencing Ace':3,'Siege Mastodon':3,'White Knight':3,'Wall of Omens':2,'Darksteel Myr':1,'Murder':3,'Pacifism':2}}
};
let G = null, guid = 0;
function gUnit(n){ const d = cardData(n); const [p,t] = (d.p||'0/0').split('/').map(x=>parseInt(x)||0); return {uid:++guid, n, p, t, kw:kwOf(n), dmg:0, tapped:false, sick:true, pac:false, pump:0, cmc:d.cmc||0}; }
function gDeck(key){ const D = DUEL_DECKS[key]; const L = []; for (const [n,q] of Object.entries(D.cards)) for (let i=0;i<q;i++) L.push(n); const nl = 40 - L.length; for (let i=0;i<nl;i++) L.push(D.lands[i%2]); return shuffled(L); }
function gPlayer(name, key){
  let lib, hand;
  for (let i=0;i<20;i++) { lib = gDeck(key); hand = lib.slice(0,7); const L = hand.filter(n=>cardData(n).k==='land').length; if (L>=2 && L<=5) break; }
  return {name, key, life:20, lib:lib.slice(7), hand, bf:[], lands:0, used:0, landPlayed:false, gy:[]};
}
function newDuel(myKey){
  const aiKey = myKey === 'rg' ? 'wb' : 'rg';
  G = {p:[gPlayer('Você', myKey), gPlayer('Computador', aiKey)], turn:1, active:0, phase:'main1', log:[], sel:null, target:null, attackers:new Set(), blocks:{}, over:null, selBlocker:null};
  glog(`Partida começa. Você joga primeiro com ${DUEL_DECKS[myKey].n}; o computador usa ${DUEL_DECKS[aiKey].n}. Quem começa não compra no primeiro turno.`);
}
function glog(m){ G.log.unshift(m); if (G.log.length > 60) G.log.pop(); }
const pw = u => u.p + u.pump, tg = u => u.t + u.pump;
const gMana = P => P.lands - P.used;
const canAttack = u => !u.tapped && (!u.sick || u.kw.haste) && !u.kw.def && !u.pac && pw(u) > 0;
const canBlock = (b, a) => !b.tapped && !b.pac && (!a.kw.fly || b.kw.fly || b.kw.reach);
function gDraw(P, k=1){ for (let i=0;i<k;i++) { if (!P.lib.length) { G.over = P === G.p[0] ? 'derrota' : 'vitória'; glog(`${P.name} não tem cards para comprar.`); return; } P.hand.push(P.lib.shift()); } }
function gCheck(){ if (G.p[1].life <= 0) G.over = 'vitória'; else if (G.p[0].life <= 0) G.over = 'derrota';
  if (G.over && !S.duelDone && G.over === 'vitória') { S.duelDone = true; addXP(60); save(); checkAch(); } }
function gKill(P, u, why){ P.bf.splice(P.bf.indexOf(u), 1); if (!u.token) P.gy.push(u.n); glog(`${u.n} ${why}.`); }
function gCast(pi, idx, target){
  const P = G.p[pi], O = G.p[1-pi], n = P.hand[idx], d = cardData(n);
  if (d.k === 'land') { if (P.landPlayed) return false; P.hand.splice(idx,1); P.lands++; P.landPlayed = true; glog(`${P.name} jogou ${n}.`); return true; }
  if (d.cmc > gMana(P)) return false;
  const sp = GSPELL[n];
  if (sp) {
    if (target === undefined) return false;
    P.used += d.cmc; P.hand.splice(idx,1); P.gy.push(n);
    if (sp.burn) { if (target === 'face') { O.life -= sp.burn; glog(`${P.name} conjurou ${n}: ${sp.burn} de dano em ${O.name}.`); } else { target.u.dmg += sp.burn; glog(`${P.name} conjurou ${n} em ${target.u.n} (${sp.burn} de dano).`); if (target.u.dmg >= tg(target.u) && !target.u.kw.ind) gKill(target.P, target.u, 'morreu'); } }
    if (sp.pump) { target.u.pump += 3; glog(`${P.name} conjurou ${n}: ${target.u.n} recebe +3/+3.`); }
    if (sp.kill) { glog(`${P.name} conjurou ${n} em ${target.u.n}.`); if (target.u.kw.ind) glog(`${target.u.n} é indestrutível e sobrevive.`); else gKill(target.P, target.u, 'foi destruído'); }
    if (sp.pac) { target.u.pac = true; glog(`${P.name} encantou ${target.u.n} com Pacifism: não pode atacar nem bloquear.`); }
    if (sp.draw) gDraw(P, sp.draw);
    gCheck(); return true;
  }
  if (d.k === 'creature') { P.used += d.cmc; P.hand.splice(idx,1); const u = gUnit(n); P.bf.push(u); glog(`${P.name} conjurou ${n}.`); if (n === 'Wall of Omens') gDraw(P,1); return true; }
  return false;
}
function needsTarget(n){ const sp = GSPELL[n]; return sp && (sp.burn || sp.pump || sp.kill || sp.pac); }
function resolveCombat(ai){ // ai = índice do atacante
  const A = G.p[ai], D = G.p[1-ai]; const atk = A.bf.filter(u => G.attackers.has(u.uid));
  let total = 0;
  atk.forEach(a => {
    const bl = (G.blocks[a.uid] || []).map(id => D.bf.find(u=>u.uid===id)).filter(Boolean);
    const conv = u => ({p:pw(u), t:Math.max(0,tg(u)-u.dmg), fs:u.kw.fs, ds:u.kw.ds, dt:u.kw.dt, tr:u.kw.tr, ll:u.kw.ll, ind:u.kw.ind});
    const r = combat(conv(a), bl.map(conv), A.life, D.life);
    a.dmg += r.A.dmg; bl.forEach((b,i) => b.dmg += r.B[i].dmg);
    D.life -= r.toPlayer; A.life += r.gainA; D.life += r.gainD; total += r.toPlayer;
    glog(bl.length ? `${a.n} foi bloqueado por ${bl.map(b=>b.n).join(' e ')}${r.toPlayer?` e atropelou ${r.toPlayer}`:''}.` : `${a.n} causou ${r.toPlayer} de dano em ${D.name}.`);
    if (r.gainA) glog(`${A.name} ganhou ${r.gainA} de vida (vínculo).`); if (r.gainD) glog(`${D.name} ganhou ${r.gainD} de vida (vínculo).`);
    if (r.A.dead) gKill(A, a, 'morreu em combate'); bl.forEach((b,i) => { if (r.B[i].dead) gKill(D, b, 'morreu em combate'); });
  });
  G.attackers = new Set(); G.blocks = {}; gCheck();
}
function cleanup(P){ P.bf.forEach(u => { u.dmg = 0; u.pump = 0; }); while (P.hand.length > 7) P.gy.push(P.hand.pop()); }
function untap(P){ P.used = 0; P.landPlayed = false; P.bf.forEach(u => { u.tapped = false; u.sick = false; }); }
/* --- inteligência simples do computador --- */
const val = u => pw(u) + tg(u) + (u.kw.fly?2:0) + (u.kw.dt?2:0) + (u.kw.ll?1:0) + (u.kw.ds?2:0);
function aiMain(){
  const P = G.p[1], O = G.p[0];
  const li = P.hand.findIndex(n => cardData(n).k === 'land'); if (li >= 0) gCast(1, li);
  for (let guard = 0; guard < 10 && !G.over; guard++) {
    const opts = P.hand.map((n,i)=>({n,i,d:cardData(n),sp:GSPELL[n]})).filter(o => o.d.k !== 'land' && o.d.cmc <= gMana(P));
    if (!opts.length) break;
    let done = false;
    // remoção no melhor alvo
    for (const o of opts.filter(o=>o.sp && (o.sp.kill||o.sp.pac||o.sp.burn))) {
      if (o.sp.burn && O.life <= o.sp.burn) { gCast(1, o.i, 'face'); done = true; break; }
      const tgts = O.bf.filter(u => !u.kw.hex && !u.pac && (o.sp.kill ? !u.kw.ind : o.sp.burn ? tg(u)-u.dmg <= o.sp.burn && !u.kw.ind : true)).sort((a,b)=>val(b)-val(a));
      if (tgts.length && val(tgts[0]) >= 5) { gCast(1, o.i, {u:tgts[0], P:O}); done = true; break; }
    }
    if (done) continue;
    const cr = opts.filter(o => o.d.k === 'creature').sort((a,b)=>b.d.cmc-a.d.cmc)[0];
    if (cr) { gCast(1, cr.i); continue; }
    break;
  }
}
function aiAttackers(){
  const P = G.p[1], O = G.p[0]; const res = [];
  P.bf.filter(canAttack).forEach(a => {
    const bl = O.bf.filter(b => canBlock(b, a) && !b.tapped);
    const dies = bl.some(b => (pw(b) >= tg(a) - a.dmg || b.kw.dt) && !a.kw.ind);
    const trade = bl.every(b => pw(a) >= tg(b) || a.kw.dt);
    if (!bl.length || !dies || (trade && a.cmc <= Math.min(...bl.map(b=>b.cmc))) || O.life <= pw(a)) res.push(a);
  });
  return res;
}
function aiBlocks(attackers){
  const P = G.p[1]; const avail = P.bf.filter(u => !u.tapped && !u.pac); const blocks = {};
  const incoming = attackers.reduce((s,a)=>s+pw(a),0); let unblocked = incoming;
  attackers.slice().sort((a,b)=>pw(b)-pw(a)).forEach(a => {
    if (a.kw.menace) return;
    const can = avail.filter(b => canBlock(b, a));
    const kills = b => (pw(b) >= tg(a) || b.kw.dt) && !a.kw.ind, survives = b => (pw(a) < tg(b) && !a.kw.dt) || b.kw.ind;
    let pick = can.filter(b => kills(b) && survives(b)).sort((x,y)=>x.cmc-y.cmc)[0]
      || can.filter(b => kills(b) && b.cmc <= a.cmc).sort((x,y)=>x.cmc-y.cmc)[0]
      || (unblocked >= P.life ? can.sort((x,y)=>val(x)-val(y))[0] : null);
    if (pick) { blocks[a.uid] = [pick.uid]; avail.splice(avail.indexOf(pick),1); unblocked -= pw(a); }
  });
  return blocks;
}
function aiTurn(){
  const P = G.p[1];
  G.active = 1; untap(P); gDraw(P); if (G.over) return; glog('— Turno do computador —');
  aiMain(); if (G.over) return;
  const atk = aiAttackers();
  if (atk.length) { atk.forEach(a => { if (!a.kw.vig) a.tapped = true; G.attackers.add(a.uid); }); glog(`O computador ataca com ${atk.map(a=>a.n).join(', ')}.`); G.phase = 'defend'; G.selBlocker = null; G.blocks = {}; return; }
  aiEnd();
}
function aiEnd(){ aiMain(); cleanup(G.p[1]); cleanup(G.p[0]); if (G.over) return; G.turn++; G.active = 0; untap(G.p[0]); gDraw(G.p[0]); glog(`— Seu turno (${G.turn}) —`); G.phase = 'main1'; }

/* --- interface --- */
function renderDuel(box){
  if (!G) {
    box.innerHTML = `<div class="panel stack-v"><h3>Partida contra o computador</h3>
      <p class="muted">Um duelo completo de 1 contra 1, com decks de 40 cartas. O computador ataca, bloqueia e usa remoção. As regras são as do jogo, com duas simplificações: os terrenos geram qualquer cor do seu deck e mágicas só são conjuradas no seu turno (os truques, também durante o seu combate).</p>
      <div class="pick">${Object.entries(DUEL_DECKS).map(([k,d])=>`<button data-dk="${k}"><b>Jogar com ${d.n}</b><small>${k==='rg'?'Criaturas grandes, atropelar e dano direto':'Voadores, toque mortífero e remoção'}</small></button>`).join('')}</div></div>`;
    $$('[data-dk]', box).forEach(b => b.onclick = () => { newDuel(b.dataset.dk); untap(G.p[0]); renderDuel(box); });
    return;
  }
  const me = G.p[0], ai = G.p[1], ph = G.phase;
  const hint = {main1:'Sua fase principal: jogue um terreno e conjure mágicas tocando nas cartas da mão.', attack:'Toque nas criaturas que vão atacar e confirme.', tricks:'O computador declarou os bloqueios. Você pode usar truques (Giant Growth, dano direto) antes do dano.', main2:'Segunda fase principal. Termine o turno quando quiser.', defend:'O computador atacou. Toque numa criatura sua e depois no atacante que ela vai bloquear.'}[ph] || '';
  const tgtMode = !!G.target;
  const unitHTML = (u, side) => { const atk = G.attackers.has(u.uid), blk = Object.values(G.blocks).some(a => a.includes(u.uid));
    const cls = [u.tapped?'tapped':'', atk?'attacking':'', blk?'blocking':'', G.selBlocker===u.uid?'hl':'', tgtMode && validTarget(u, side)?'target':''].join(' ');
    const note = u.pac ? 'Pacifism' : (u.sick && side===0 && !u.kw.haste && G.active===0 ? 'enjoo' : (G.blocks[u.uid] ? 'bloqueado' : ''));
    return `<div class="g-u" data-u="${u.uid}" data-side="${side}">${cardHTML(u.n,{cls:'mini '+cls, p:`${pw(u)}/${tg(u)}`, d:u.dmg||undefined, note:note||undefined})}</div>`; };
  const playable = (n) => { const d = cardData(n); if (G.active !== 0 || G.over) return false; if (d.k === 'land') return !me.landPlayed && (ph==='main1'||ph==='main2'); if (d.cmc > gMana(me)) return false; if (ph==='tricks') return n==='Giant Growth' || (GSPELL[n]&&GSPELL[n].burn); return ph==='main1'||ph==='main2'; };
  box.innerHTML = `
   <div class="stack-v">
    <div class="board duel">
      <div class="side-head"><span>Computador · mão ${ai.hand.length} · grimório ${ai.lib.length} · ${ai.lands} terrenos</span><button class="life g-face ${tgtMode && G.target.face?'tgt':''}" id="gFace">♥ ${ai.life}</button></div>
      <div class="zone ${ai.bf.length?'':'empty'}" data-empty="Sem criaturas">${ai.bf.map(u=>unitHTML(u,1)).join('')}</div>
      <div class="zone ${me.bf.length?'':'empty'}" data-empty="Sem criaturas">${me.bf.map(u=>unitHTML(u,0)).join('')}</div>
      <div class="side-head"><span>Você · ${me.lands} terrenos (${gMana(me)} livres) · grimório ${me.lib.length}</span><span class="life">♥ ${me.life}</span></div>
      <div class="hand-zone"><span class="lbl">Sua mão</span>${me.hand.map((n,i)=>`<div class="g-h" data-h="${i}">${cardHTML(n,{cls:'mini '+(playable(n)?'hl':''),showPt:false})}</div>`).join('')}</div>
    </div>
    ${G.over ? `<div class="why ${G.over==='vitória'?'ok':'no'}" style="font-size:1.1rem"><b>${G.over==='vitória'?'Vitória!':'Derrota.'}</b> ${G.over==='vitória'?'Você venceu o computador.':'O computador venceu desta vez. Revise o registro abaixo e tente de novo.'}</div>` : `<div class="tip">${tgtMode ? `Escolha o alvo de <b>${esc(G.target.n)}</b>${G.target.face?' (uma criatura ou o oponente, tocando na vida dele)':''}. <button class="btn small" id="gCancel">Cancelar</button>` : hint}</div>`}
    <div class="row-h">${G.over ? `<button class="btn primary" id="gNew">Nova partida</button>` :
      ph==='main1' ? `<button class="btn primary" id="gToAtk">Ir para o combate</button><button class="btn" id="gEnd">Passar o turno</button>` :
      ph==='attack' ? `<button class="btn primary" id="gAtk">Confirmar ataque (${G.attackers.size})</button><button class="btn" id="gNoAtk">Não atacar</button>` :
      ph==='tricks' ? `<button class="btn primary" id="gDmg">Causar o dano</button>` :
      ph==='main2' ? `<button class="btn primary" id="gEnd">Passar o turno</button>` :
      ph==='defend' ? `<button class="btn primary" id="gBlk">Confirmar bloqueios</button>` : ''}
      <button class="btn small" id="gQuit">Trocar de deck</button></div>
    <div class="panel"><h3>Registro</h3><ul class="g-log">${G.log.slice(0,25).map(l=>`<li>${esc(l)}</li>`).join('')}</ul></div>
   </div>`;
  const rd = () => renderDuel(box);
  $$('.g-h', box).forEach(el => el.onclick = () => {
    const i = +el.dataset.h, n = me.hand[i];
    if (!playable(n)) { openCard(n); return; }
    if (needsTarget(n)) { G.target = {i, n, face: !!GSPELL[n].burn}; rd(); return; }
    gCast(0, i); sfx('tap'); rd();
  });
  $$('.g-u', box).forEach(el => el.onclick = () => {
    const side = +el.dataset.side, P = G.p[side], u = P.bf.find(x => x.uid === +el.dataset.u); if (!u) return;
    if (G.target) { if (!validTarget(u, side)) { toast('Alvo inválido para esta mágica.'); return; } gCast(0, G.target.i, {u, P}); G.target = null; sfx('ok'); rd(); return; }
    if (ph === 'attack' && side === 0) { if (!canAttack(u)) { toast(u.sick ? 'Enjoo de invocação: ela entrou neste turno.' : 'Esta criatura não pode atacar.'); return; } G.attackers.has(u.uid) ? G.attackers.delete(u.uid) : G.attackers.add(u.uid); sfx('tap'); rd(); return; }
    if (ph === 'defend') {
      if (side === 0) { if (u.tapped || u.pac) { toast('Ela não pode bloquear.'); return; } Object.keys(G.blocks).forEach(k => G.blocks[k] = G.blocks[k].filter(id => id !== u.uid)); G.selBlocker = u.uid; rd(); return; }
      if (side === 1 && G.attackers.has(u.uid) && G.selBlocker) { const b = me.bf.find(x=>x.uid===G.selBlocker); if (!canBlock(b, u)) { toast(u.kw.fly ? 'Só criaturas com voar ou alcance bloqueiam voadores.' : 'Não pode bloquear.'); return; } (G.blocks[u.uid] = G.blocks[u.uid] || []).push(b.uid); G.selBlocker = null; sfx('tap'); rd(); return; }
    }
    openCard(u.n);
  });
  const on = (id, f) => { const e = $('#'+id); if (e) e.onclick = f; };
  on('gFace', () => { if (G.target && G.target.face) { gCast(0, G.target.i, 'face'); G.target = null; sfx('hit'); rd(); } });
  on('gCancel', () => { G.target = null; rd(); });
  on('gNew', () => { G = null; rd(); });
  on('gQuit', () => { G = null; rd(); });
  on('gToAtk', () => { G.phase = 'attack'; rd(); });
  on('gNoAtk', () => { G.phase = 'main2'; G.attackers = new Set(); rd(); });
  on('gAtk', () => { if (!G.attackers.size) { G.phase = 'main2'; rd(); return; }
    me.bf.forEach(u => { if (G.attackers.has(u.uid) && !u.kw.vig) u.tapped = true; });
    G.blocks = aiBlocks(me.bf.filter(u=>G.attackers.has(u.uid)));
    const nb = Object.keys(G.blocks).length; glog(`Você ataca com ${G.attackers.size} criatura(s). O computador ${nb?`bloqueia ${nb}`:'não bloqueia'}.`);
    G.phase = 'tricks'; rd(); });
  on('gDmg', () => { resolveCombat(0); sfx('hit'); G.phase = 'main2'; rd(); });
  on('gEnd', () => { cleanup(me); aiTurn(); rd(); });
  on('gBlk', () => {
    for (const [aid, bl] of Object.entries(G.blocks)) { const a = ai.bf.find(x=>x.uid===+aid); if (a && a.kw.menace && bl.length === 1) { toast(`${a.n} tem ameaçar: precisa de dois bloqueadores ou nenhum.`); return; } }
    resolveCombat(1); sfx('hit'); G.selBlocker = null; if (!G.over) aiEnd(); rd(); });
}
function validTarget(u, side){
  if (!G.target) return false; const sp = GSPELL[G.target.n];
  if (sp.pump) return side === 0;
  if (side === 1 && u.kw.hex) return false;
  return true;
}
