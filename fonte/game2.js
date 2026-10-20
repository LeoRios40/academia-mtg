/* ================= PARTIDA (contra o computador, campanha, 2 jogadores) ================= */
Object.assign(CARDS, {
  'Wind Drake':{k:'creature',c:'{2}{U}',t:'Criatura — Dragonete',x:'Voar.',p:'2/2',col:'U',cmc:3},
  'Cloudkin Seer':{k:'creature',c:'{2}{U}',t:'Criatura — Elemental Mago',x:'Voar. Quando entra no campo de batalha, compre um card.',p:'2/1',col:'U',cmc:3},
  'Air Elemental':{k:'creature',c:'{3}{U}{U}',t:'Criatura — Elemental',x:'Voar.',p:'4/4',col:'U',cmc:5},
  'Phantom Warrior':{k:'creature',c:'{1}{U}{U}',t:'Criatura — Ilusão Guerreiro',x:'Phantom Warrior não pode ser bloqueada.',p:'2/2',col:'U',cmc:3},
  'Coral Merfolk':{k:'creature',c:'{1}{U}',t:'Criatura — Tritão',x:'(Sem habilidades.)',p:'2/1',col:'U',cmc:2},
  'Man-o\'-War':{k:'creature',c:'{2}{U}',t:'Criatura — Água-viva',x:'Quando entra no campo de batalha, devolva a criatura alvo para a mão do dono.',p:'2/2',col:'U',cmc:3},
  'Unsummon':{k:'instant',c:'{U}',t:'Mágica Instantânea',x:'Devolva a criatura alvo para a mão do dono.',col:'U',cmc:1},
  'Typhoid Rats':{k:'creature',c:'{B}',t:'Criatura — Rato',x:'Toque mortífero.',p:'1/1',col:'B',cmc:1},
  'Gravedigger':{k:'creature',c:'{3}{B}',t:'Criatura — Zumbi',x:'Quando entra no campo de batalha, você pode devolver um card de criatura do seu cemitério para a mão.',p:'2/2',col:'B',cmc:4},
  'Hypnotic Specter':{k:'creature',c:'{1}{B}{B}',t:'Criatura — Espectro',x:'Voar. Sempre que causa dano a um oponente, ele descarta um card aleatório.',p:'2/2',col:'B',cmc:3},
  'Sengir Vampire':{k:'creature',c:'{3}{B}{B}',t:'Criatura — Vampiro',x:'Voar. Recebe um marcador +1/+1 sempre que uma criatura que ele feriu morre.',p:'4/4',col:'B',cmc:5},
  'Walking Corpse':{k:'creature',c:'{1}{B}',t:'Criatura — Zumbi',x:'(Sem habilidades.)',p:'2/2',col:'B',cmc:2},
  'Doom Blade':{k:'instant',c:'{1}{B}',t:'Mágica Instantânea',x:'Destrua a criatura alvo que não seja preta.',col:'B',cmc:2},
  'Hill Giant':{k:'creature',c:'{3}{R}',t:'Criatura — Gigante',x:'(Sem habilidades.)',p:'3/3',col:'R',cmc:4},
  'Fire Elemental':{k:'creature',c:'{3}{R}{R}',t:'Criatura — Elemental',x:'(Sem habilidades.)',p:'5/4',col:'R',cmc:5},
  'Craw Wurm':{k:'creature',c:'{4}{G}{G}',t:'Criatura — Vermão',x:'(Sem habilidades.)',p:'6/4',col:'G',cmc:6},
  'Savannah Lions':{k:'creature',c:'{W}',t:'Criatura — Felino',x:'(Sem habilidades.)',p:'2/1',col:'W',cmc:1},
  'Elite Vanguard':{k:'creature',c:'{W}',t:'Criatura — Humano Soldado',x:'(Sem habilidades.)',p:'2/1',col:'W',cmc:1},
  'Pegasus Courser':{k:'creature',c:'{2}{W}',t:'Criatura — Pégaso',x:'Voar. Sempre que ataca, outra criatura atacante ganha voar até o fim do turno.',p:'1/3',col:'W',cmc:3}
});
['Wind Drake','Cloudkin Seer','Air Elemental','Phantom Warrior','Coral Merfolk','Man-o\'-War','Unsummon','Typhoid Rats','Gravedigger','Hypnotic Specter','Sengir Vampire','Walking Corpse','Doom Blade','Hill Giant','Fire Elemental','Craw Wurm','Savannah Lions','Elite Vanguard','Pegasus Courser'].forEach(n => CARD_ALIAS[n.toLowerCase()] = n);

const KWRE = {fs:/iniciativa|first strike/i, ds:/golpe duplo|double strike/i, dt:/toque mortífero|deathtouch/i, tr:/atropelar|trample/i, ll:/vínculo com a vida|lifelink/i,
  ind:/indestrutível|indestructible/i, fly:/\bvoar\b|flying/i, reach:/alcance|reach/i, haste:/ímpeto|haste/i, def:/defensor|defender/i, vig:/vigilância|vigilance/i, menace:/ameaçar|menace/i, hex:/resistência a magia|hexproof/i,
  unb:/não pode ser bloqueada|can't be blocked/i, pblack:/proteção contra preto|protection from black/i};
function kwOf(n){ const d = cardData(n) || {}; const x = d.x || ''; const o = {}; for (const k in KWRE) if (KWRE[k].test(x)) o[k] = true; if (o.fs && /golpe duplo|double strike/i.test(x)) o.fs = false; return o; }
const GSPELL = {
  'Lightning Bolt':{burn:3,inst:1}, 'Shock':{burn:2,inst:1}, 'Searing Spear':{burn:3,inst:1}, 'Incinerate':{burn:3,inst:1},
  'Giant Growth':{pump:3,inst:1}, 'Murder':{kill:1,inst:1}, 'Doom Blade':{kill:1,nonblack:1,inst:1}, 'Unsummon':{bounce:1,inst:1},
  'Pacifism':{pac:1}, 'Divination':{draw:2}
};
const LANDCOL = {Plains:'W',Island:'U',Swamp:'B',Mountain:'R',Forest:'G'};
const DUEL_DECKS = {
  rg:{n:'Gruul (verde e vermelho)', d:'Criaturas grandes, atropelar e dano direto', lands:['Mountain','Forest'], cards:{'Goblin Guide':2,'Boggart Brute':2,'Centaur Courser':3,'Grizzly Bears':3,'Giant Spider':2,'Colossal Dreadmaw':2,'Shivan Dragon':1,'Lightning Bolt':2,'Shock':2,'Searing Spear':1,'Giant Growth':3}},
  wb:{n:'Orzhov (branco e preto)', d:'Voadores, toque mortífero e remoção', lands:['Plains','Swamp'], cards:{'Serra Angel':3,'Vampire Nighthawk':3,'Fencing Ace':3,'Siege Mastodon':3,'White Knight':3,'Wall of Omens':2,'Darksteel Myr':1,'Murder':3,'Pacifism':2}},
  W:{n:'Branco', d:'Criaturas baratas, voadores e Pacifism', lands:['Plains'], cards:{'Savannah Lions':3,'Elite Vanguard':3,'Fencing Ace':2,'White Knight':3,'Pegasus Courser':3,'Wall of Omens':1,'Siege Mastodon':2,'Serra Angel':3,'Pacifism':3}},
  U:{n:'Azul', d:'Voadores, criatura imbloqueável e devolver criaturas à mão', lands:['Island'], cards:{'Coral Merfolk':3,'Wind Drake':3,'Cloudkin Seer':3,'Phantom Warrior':3,'Man-o\'-War':3,'Air Elemental':3,'Storm Crow':1,'Unsummon':3,'Divination':1}},
  B:{n:'Preto', d:'Toque mortífero, voadores e muita remoção', lands:['Swamp'], cards:{'Typhoid Rats':3,'Walking Corpse':3,'Vampire Nighthawk':2,'Hypnotic Specter':3,'Gravedigger':2,'Sengir Vampire':3,'Murder':3,'Doom Blade':3,'Darksteel Myr':1}},
  R:{n:'Vermelho', d:'Ataque rápido e dano direto', lands:['Mountain'], cards:{'Goblin Guide':3,'Raging Goblin':2,'Boggart Brute':3,'Hill Giant':3,'Fire Elemental':2,'Shivan Dragon':1,'Lightning Bolt':3,'Shock':3,'Searing Spear':3}},
  G:{n:'Verde', d:'Elfos de mana e criaturas enormes', lands:['Forest'], cards:{'Llanowar Elves':3,'Elvish Visionary':2,'Grizzly Bears':3,'Ambush Viper':2,'Centaur Courser':3,'Giant Spider':3,'Craw Wurm':2,'Colossal Dreadmaw':2,'Giant Growth':3}}
};
const LVL = {facil:'Fácil', medio:'Médio', dificil:'Difícil'};
const CAMP = [
 {t:'O chamado da floresta', opp:'G', lvl:'facil', s:'Sua centelha acaba de despertar. Uma druida de Llanowar quer testar se você está pronto para viajar entre os planos.'},
 {t:'Asas sobre Benália', opp:'W', lvl:'facil', s:'Os cavaleiros de Benália não confiam em planeswalkers novatos. Prove seu valor contra seus anjos.'},
 {t:'O mar de ilusões', opp:'U', lvl:'medio', s:'Um mago de Tolária manipula a mente dos oponentes. Cuidado com criaturas que não podem ser bloqueadas.'},
 {t:'A cripta de Urborg', opp:'B', lvl:'medio', s:'Nos pântanos de Urborg, um necromante usa remoção sem piedade. Guarde suas melhores criaturas.'},
 {t:'Fogo na montanha', opp:'R', lvl:'dificil', s:'Um xamã goblin ataca com tudo desde o primeiro turno. Sobreviva à investida.'},
 {t:'O conselho Orzhov', opp:'wb', lvl:'dificil', s:'Em Ravnica, a guilda Orzhov cobra caro de quem cruza seu caminho: voadores, vínculo com a vida e remoção.'},
 {t:'Os senhores de Gruul', opp:'rg', lvl:'dificil', s:'O último desafio: os clãs Gruul e sua força bruta. Vença e você será um verdadeiro planeswalker.'}
];

let G = null, guid = 0;
const parseCost = c => { const o = {gen:0, W:0,U:0,B:0,R:0,G:0}; (c||'').replace(/\{([^}]+)\}/g, (_, s) => { if (/^\d+$/.test(s)) o.gen += +s; else if (o[s] != null) o[s]++; }); return o; };
function gUnit(n){ const d = cardData(n); const [p,t] = (d.p||'0/0').split('/').map(x=>parseInt(x)||0); const x = d.x || '';
  return {uid:++guid, n, p, t, kw:kwOf(n), dmg:0, tapped:false, sick:true, pac:false, pump:0, cmc:d.cmc||0, col:d.col, mana:/\{T\}:\s*Adicione \{([WUBRG])\}/i.test(x) ? x.match(/\{T\}:\s*Adicione \{([WUBRG])\}/i)[1] : null,
    discard:/descarta um card aleatório/i.test(x), etbDraw:/quando entra.*compre um card/i.test(x), etbBounce:/quando entra.*devolva a criatura alvo/i.test(x), etbRaise:/quando entra.*devolver um card de criatura/i.test(x)}; }
function gDeck(key){ const D = DUEL_DECKS[key]; const L = []; for (const [n,q] of Object.entries(D.cards)) for (let i=0;i<q;i++) L.push(n); const nl = 40 - L.length; for (let i=0;i<nl;i++) L.push(D.lands[i % D.lands.length]); return shuffled(L); }
function gPlayer(name, key){
  let lib, hand;
  for (let i=0;i<20;i++) { lib = gDeck(key); hand = lib.slice(0,7); const L = hand.filter(n=>cardData(n).k==='land').length; if (L>=2 && L<=5) break; }
  return {name, key, life:20, lib:lib.slice(7), hand, bf:[], lands:{W:0,U:0,B:0,R:0,G:0}, tapped:{W:0,U:0,B:0,R:0,G:0}, landPlayed:false, gy:[]};
}
function newDuel(opt){
  G = {mode:opt.mode, lvl:opt.lvl||'medio', camp:opt.camp==null?null:opt.camp, p:[gPlayer(opt.names[0], opt.decks[0]), gPlayer(opt.names[1], opt.decks[1])], turn:1, active:0, prio:0, view:0, phase:'main1',
       log:[], target:null, attackers:new Set(), blocks:{}, over:null, selBlocker:null, pending:null, handoff: opt.mode==='pvp', ai:null, firstTurn:true};
  glog(`Partida começa: ${G.p[0].name} (${DUEL_DECKS[opt.decks[0]].n}) contra ${G.p[1].name} (${DUEL_DECKS[opt.decks[1]].n})${G.mode==='ai'?`, nível ${LVL[G.lvl]}`:''}. Quem começa não compra no primeiro turno.`);
}
function glog(m){ G.log.unshift(m); if (G.log.length > 80) G.log.pop(); }
const pw = u => u.p + u.pump, tg = u => u.t + u.pump;
const isAI = i => G.mode !== 'pvp' && i === 1;
/* mana colorida */
function sources(P){ const s = {}; for (const c of 'WUBRG') s[c] = P.lands[c] - P.tapped[c]; const dorks = P.bf.filter(u => u.mana && !u.tapped && !u.sick && !u.pac); return {s, dorks}; }
const gMana = P => { const {s, dorks} = sources(P); return Object.values(s).reduce((a,b)=>a+b,0) + dorks.length; };
function pay(P, cost, commit){
  const need = parseCost(cost), {s, dorks} = sources(P); const useL = {W:0,U:0,B:0,R:0,G:0}, useD = [];
  for (const c of 'WUBRG') for (let i=0;i<need[c];i++) { if (s[c] - useL[c] > 0) useL[c]++; else { const d = dorks.find(x => x.mana === c && !useD.includes(x)); if (!d) return false; useD.push(d); } }
  for (let i=0;i<need.gen;i++) { const c = 'WUBRG'.split('').sort((a,b)=>(s[b]-useL[b])-(s[a]-useL[a]))[0]; if (s[c] - useL[c] > 0) useL[c]++; else { const d = dorks.find(x => !useD.includes(x)); if (!d) return false; useD.push(d); } }
  if (commit) { for (const c of 'WUBRG') P.tapped[c] += useL[c]; useD.forEach(d => d.tapped = true); }
  return true;
}
const canAttack = u => !u.tapped && (!u.sick || u.kw.haste) && !u.kw.def && !u.pac && pw(u) > 0;
const canBlock = (b, a) => !b.tapped && !b.pac && !a.kw.unb && (!a.kw.fly || b.kw.fly || b.kw.reach) && !(a.kw.pblack && b.col === 'B');
function gDraw(P, k=1){ for (let i=0;i<k;i++) { if (!P.lib.length) { G.over = {winner: G.p.indexOf(P) === 0 ? 1 : 0, why:`${P.name} não tem cards para comprar`}; return; } P.hand.push(P.lib.shift()); } }
function gCheck(){
  const lost = G.p.findIndex(P => P.life <= 0);
  if (lost >= 0 && !G.over) { G.over = {winner: 1 - lost, why:`${G.p[lost].name} chegou a 0 de vida`}; onDuelOver(); }
}
function onDuelOver(){
  const w = G.over.winner; glog(`Fim de jogo: ${G.p[w].name} venceu.`);
  if (G.mode !== 'pvp' && w === 0) {
    if (!S.duelDone) { S.duelDone = true; addXP(60); }
    if (G.camp != null) { S.camp = Math.max(S.camp||0, G.camp + 1); addXP(50); if (S.camp >= CAMP.length) S.campDone = true; }
    if (G.lvl === 'dificil') S.duelHard = true;
    save(); checkAch();
  }
}
function gKill(P, u, why){ const i = P.bf.indexOf(u); if (i < 0) return; P.bf.splice(i, 1); P.gy.push(u.n); glog(`${u.n} ${why}.`); }
function targetOk(sp, u, Pt, casterIdx){
  if (Pt !== G.p[casterIdx] && u.kw.hex) return false;
  if (sp.pump) return Pt === G.p[casterIdx];
  if (sp.nonblack && u.col === 'B') return false;
  if ((sp.kill || sp.pac || sp.burn || sp.bounce) && u.kw.pblack && G.p[casterIdx].bf && casterSpellBlack(sp)) return false;
  return true;
}
function casterSpellBlack(sp){ return !!(sp.kill); }
function applySpell(pi, n, target){
  const P = G.p[pi], O = G.p[1-pi], sp = GSPELL[n];
  if (sp.burn) { if (target === 'face') { O.life -= sp.burn; glog(`${n}: ${sp.burn} de dano em ${O.name}.`); } else if (target.P.bf.includes(target.u)) { target.u.dmg += sp.burn; glog(`${n}: ${sp.burn} de dano em ${target.u.n}.`); if (target.u.dmg >= tg(target.u) && !target.u.kw.ind) gKill(target.P, target.u, 'morreu'); } else glog(`${n} perdeu o alvo.`); }
  if (sp.pump) { if (target.P.bf.includes(target.u)) { target.u.pump += sp.pump; glog(`${n}: ${target.u.n} recebe +3/+3.`); } }
  if (sp.kill) { if (!target.P.bf.includes(target.u)) glog(`${n} perdeu o alvo.`); else if (target.u.kw.ind) glog(`${target.u.n} é indestrutível.`); else gKill(target.P, target.u, 'foi destruído'); }
  if (sp.bounce) { if (target.P.bf.includes(target.u)) { target.P.bf.splice(target.P.bf.indexOf(target.u),1); target.P.hand.push(target.u.n); glog(`${n}: ${target.u.n} voltou para a mão.`); } }
  if (sp.pac) { if (target.P.bf.includes(target.u)) { target.u.pac = true; glog(`${target.u.n} foi pacificado: não ataca nem bloqueia.`); } }
  if (sp.draw) gDraw(P, sp.draw);
  P.gy.push(n); gCheck();
}
function creatureEnters(pi, u){
  const P = G.p[pi], O = G.p[1-pi];
  if (u.etbDraw) { gDraw(P, 1); glog(`${u.n}: ${P.name} compra um card.`); }
  if (u.etbBounce) { const t = O.bf.filter(x => !x.kw.hex).sort((a,b)=>val(b)-val(a))[0]; if (t) { O.bf.splice(O.bf.indexOf(t),1); O.hand.push(t.n); glog(`${u.n} devolveu ${t.n} para a mão de ${O.name}.`); } }
  if (u.etbRaise) { const i = P.gy.map((n,k)=>({n,k})).filter(o => cardData(o.n).k === 'creature').sort((a,b)=>cardData(b.n).cmc - cardData(a.n).cmc)[0]; if (i) { P.gy.splice(i.k,1); P.hand.push(i.n); glog(`${u.n} devolveu ${i.n} do cemitério para a mão.`); } }
}
/* conjurar: target undefined = ainda escolhendo */
function gCast(pi, idx, target){
  const P = G.p[pi], n = P.hand[idx], d = cardData(n);
  if (d.k === 'land') { if (P.landPlayed) return false; P.hand.splice(idx,1); P.lands[LANDCOL[n]]++; P.landPlayed = true; glog(`${P.name} jogou ${n}.`); return true; }
  if (!pay(P, d.c, false)) return false;
  const sp = GSPELL[n];
  if (sp) {
    if (needsTarget(n) && target === undefined) return false;
    pay(P, d.c, true); P.hand.splice(idx,1);
    glog(`${P.name} conjurou ${n}${target && target !== 'face' ? ' em ' + target.u.n : target === 'face' ? ' em ' + G.p[1-pi].name : ''}.`);
    if (isAI(pi) && target && target !== 'face' && target.P === G.p[0] && humanCanRespond()) { G.pending = {pi, n, target}; return 'pending'; }
    applySpell(pi, n, target); return true;
  }
  if (d.k === 'creature') { pay(P, d.c, true); P.hand.splice(idx,1); const u = gUnit(n); P.bf.push(u); glog(`${P.name} conjurou ${n}.`); creatureEnters(pi, u); gCheck(); return true; }
  return false;
}
const needsTarget = n => { const sp = GSPELL[n]; return !!(sp && (sp.burn || sp.pump || sp.kill || sp.pac || sp.bounce)); };
function humanCanRespond(){ const H = G.p[0]; return H.hand.some(n => GSPELL[n] && GSPELL[n].inst && pay(H, cardData(n).c, false)); }
/* combate */
function resolveCombat(ai){
  const A = G.p[ai], D = G.p[1-ai]; const atk = A.bf.filter(u => G.attackers.has(u.uid));
  atk.forEach(a => {
    if (!A.bf.includes(a)) return;
    const bl = (G.blocks[a.uid] || []).map(id => D.bf.find(u=>u.uid===id)).filter(Boolean);
    const conv = u => ({p:pw(u), t:Math.max(0,tg(u)-u.dmg), fs:u.kw.fs, ds:u.kw.ds, dt:u.kw.dt, tr:u.kw.tr, ll:u.kw.ll, ind:u.kw.ind});
    const wasBlocked = (G.blocks[a.uid] || []).length > 0;
    const r = combat(conv(a), wasBlocked ? bl.map(conv) : [], A.life, D.life);
    if (wasBlocked && !bl.length && !a.kw.tr) { glog(`${a.n} continua bloqueado e não causa dano ao jogador.`); return; }
    a.dmg += r.A.dmg; bl.forEach((b,i) => b.dmg += r.B[i].dmg);
    D.life -= r.toPlayer; A.life += r.gainA; D.life += r.gainD;
    glog(bl.length ? `${a.n} foi bloqueado por ${bl.map(b=>b.n).join(' e ')}${r.toPlayer?` e atropelou ${r.toPlayer}`:''}.` : `${a.n} causou ${r.toPlayer} de dano em ${D.name}.`);
    if (r.toPlayer && a.discard && D.hand.length) { const k = Math.floor(Math.random()*D.hand.length); glog(`${D.name} descartou ${D.hand[k]} (Hypnotic Specter).`); D.gy.push(D.hand.splice(k,1)[0]); }
    if (r.gainA) glog(`${A.name} ganhou ${r.gainA} de vida (vínculo).`); if (r.gainD) glog(`${D.name} ganhou ${r.gainD} de vida (vínculo).`);
    if (r.A.dead) gKill(A, a, 'morreu em combate'); bl.forEach((b,i) => { if (r.B[i].dead) gKill(D, b, 'morreu em combate'); });
  });
  G.attackers = new Set(); G.blocks = {}; gCheck();
}
function cleanup(){ G.p.forEach(P => { P.bf.forEach(u => { u.dmg = 0; u.pump = 0; }); }); const P = G.p[G.active]; while (P.hand.length > 7) P.gy.push(P.hand.pop()); }
function untap(P){ P.tapped = {W:0,U:0,B:0,R:0,G:0}; P.landPlayed = false; P.bf.forEach(u => { u.tapped = false; u.sick = false; }); }
function startTurn(pi){
  if (G.over) return;
  G.active = pi; G.prio = pi; G.phase = 'main1'; G.target = null; G.selBlocker = null; untap(G.p[pi]);
  if (!G.firstTurn) gDraw(G.p[pi]); G.firstTurn = false; if (G.over) { onDuelOver(); return; }
  glog(`— Turno de ${G.p[pi].name} —`);
  if (G.mode === 'pvp') { G.view = pi; G.handoff = true; }
  if (isAI(pi)) { G.ai = {stage:'main1', land:false}; aiRun(); }
}
function endTurn(){ cleanup(); G.turn++; startTurn(1 - G.active); }
/* ---- inteligência do computador ---- */
const val = u => pw(u) + tg(u) + (u.kw.fly?2:0) + (u.kw.dt?2:0) + (u.kw.ll?1:0) + (u.kw.ds?2:0) + (u.kw.unb?2:0);
function aiMainStep(){
  const P = G.p[1], O = G.p[0], L = G.lvl;
  if (!G.ai.land) { G.ai.land = true; const li = P.hand.findIndex(n => cardData(n).k === 'land'); if (li >= 0) gCast(1, li); }
  for (let guard = 0; guard < 12 && !G.over; guard++) {
    const opts = P.hand.map((n,i)=>({n,i,d:cardData(n),sp:GSPELL[n]})).filter(o => o.d.k !== 'land' && pay(P, o.d.c, false));
    if (!opts.length) break;
    let acted = false;
    const thr = L === 'facil' ? 8 : L === 'medio' ? 5 : 3;
    for (const o of opts.filter(o=>o.sp && (o.sp.kill||o.sp.pac||o.sp.burn||o.sp.bounce))) {
      if (o.sp.burn && O.life <= o.sp.burn) { gCast(1, o.i, 'face'); acted = true; break; }
      if (o.sp.burn && L === 'dificil' && O.life <= o.sp.burn + P.bf.filter(canAttack).reduce((s,u)=>s+pw(u),0) - 2 && !O.bf.length) { gCast(1, o.i, 'face'); acted = true; break; }
      const tgts = O.bf.filter(u => targetOk(o.sp, u, O, 1) && !u.pac && (o.sp.kill ? !u.kw.ind : o.sp.burn ? tg(u)-u.dmg <= o.sp.burn && !u.kw.ind : true)).sort((a,b)=>val(b)-val(a));
      if (tgts.length && val(tgts[0]) >= thr) { const r = gCast(1, o.i, {u:tgts[0], P:O}); acted = true; if (r === 'pending') return 'pause'; break; }
    }
    if (acted) continue;
    const crs = opts.filter(o => o.d.k === 'creature'); if (!crs.length) { const dr = opts.find(o => o.sp && o.sp.draw); if (dr) { gCast(1, dr.i, null); continue; } break; }
    const cr = L === 'facil' ? crs[Math.floor(Math.random()*crs.length)] : crs.sort((a,b)=>b.d.cmc-a.d.cmc)[0];
    gCast(1, cr.i);
  }
  return 'ok';
}
function aiAttackers(){
  const P = G.p[1], O = G.p[0], L = G.lvl; const res = [];
  const ready = P.bf.filter(canAttack);
  const blockersFor = a => O.bf.filter(b => canBlock(b, a));
  const unblockable = ready.filter(a => !blockersFor(a).length).reduce((s,a)=>s+pw(a),0);
  if (L !== 'facil' && unblockable >= O.life) return ready.filter(a => !blockersFor(a).length);
  ready.forEach(a => {
    const bl = blockersFor(a);
    if (L === 'facil') { if (!bl.length || Math.random() < .3) res.push(a); return; }
    const dies = bl.some(b => (pw(b) >= tg(a) - a.dmg || b.kw.dt) && !a.kw.ind);
    const trade = bl.every(b => pw(a) >= tg(b) || a.kw.dt);
    if (!bl.length || !dies || (trade && a.cmc <= Math.min(...bl.map(b=>b.cmc))) || (L === 'dificil' && O.life <= ready.reduce((s,u)=>s+pw(u),0) && bl.length < ready.length)) res.push(a);
  });
  return res;
}
function aiBlocks(attackers){
  const P = G.p[1], L = G.lvl; const avail = P.bf.filter(u => !u.tapped && !u.pac); const blocks = {};
  let unblocked = attackers.reduce((s,a)=>s+pw(a),0);
  attackers.slice().sort((a,b)=>pw(b)-pw(a)).forEach(a => {
    const can = avail.filter(b => canBlock(b, a));
    if (a.kw.menace) { if (can.length >= 2 && L === 'dificil' && unblocked >= P.life) { const two = can.slice(0,2); blocks[a.uid] = two.map(b=>b.uid); two.forEach(b => avail.splice(avail.indexOf(b),1)); unblocked -= pw(a); } return; }
    const kills = b => (pw(b) >= tg(a) || b.kw.dt) && !a.kw.ind, survives = b => (pw(a) < tg(b) && !a.kw.dt) || b.kw.ind;
    let pick = can.filter(b => kills(b) && survives(b)).sort((x,y)=>x.cmc-y.cmc)[0]
      || (L !== 'facil' ? can.filter(b => kills(b) && b.cmc <= a.cmc).sort((x,y)=>x.cmc-y.cmc)[0] : null)
      || (unblocked >= P.life ? can.sort((x,y)=>val(x)-val(y))[0] : null);
    if (pick) { blocks[a.uid] = [pick.uid]; avail.splice(avail.indexOf(pick),1); unblocked -= pw(a); }
  });
  return blocks;
}
function aiTrick(){ // nível difícil: usa Giant Growth no atacante bloqueado se mudar o resultado
  if (G.lvl !== 'dificil') return;
  const P = G.p[1], i = P.hand.indexOf('Giant Growth'); if (i < 0 || !pay(P, cardData('Giant Growth').c, false)) return;
  const a = P.bf.find(u => G.attackers.has(u.uid) && (G.blocks[u.uid]||[]).length && G.p[0].bf.some(b => (G.blocks[u.uid]||[]).includes(b.uid) && pw(b) >= tg(u) - u.dmg && pw(b) < tg(u) + 3));
  if (a) gCast(1, i, {u:a, P});
}
function aiRun(){
  while (!G.over && G.ai) {
    const st = G.ai.stage;
    if (st === 'main1' || st === 'main2') {
      const r = aiMainStep(); if (r === 'pause') { G.phase = 'respond'; G.prio = 0; return; }
      if (st === 'main1') { G.ai.stage = 'attack'; continue; }
      G.ai = null; endTurn(); return;
    }
    if (st === 'attack') {
      const atk = aiAttackers(); G.ai.stage = 'main2';
      if (atk.length) { atk.forEach(a => { if (!a.kw.vig) a.tapped = true; G.attackers.add(a.uid); }); glog(`${G.p[1].name} ataca com ${atk.map(a=>a.n).join(', ')}.`); G.phase = 'block'; G.prio = 0; G.blocks = {}; return; }
      continue;
    }
  }
}
function resolvePending(){ const pd = G.pending; G.pending = null; if (pd) applySpell(pd.pi, pd.n, pd.target); }

/* ---- interface ---- */
let duelSetup = {mode:'ai', deck:'rg', opp:'wb', lvl:'medio', d2:'U', n1:'Jogador 1', n2:'Jogador 2'};
function renderDuel(box){
  if (!G) return renderDuelSetup(box);
  const ph = G.phase, me = G.p[G.view], op = G.p[1-G.view], vi = G.view;
  if (G.handoff && !G.over) {
    box.innerHTML = `<div class="panel stack-v" style="text-align:center;align-items:center;padding:40px 18px"><span class="eyebrow">Dois jogadores</span><h2>Vez de ${esc(G.p[G.view].name)}</h2>
      <p class="muted">${ph==='block'?'O oponente atacou. Você vai escolher os bloqueios.':ph==='tricks'?'Seus bloqueios foram escolhidos. Hora dos truques antes do dano.':'Passe o aparelho e não olhe a mão do outro jogador.'}</p>
      <button class="btn primary" id="gReady" style="font-size:1.1rem">Estou pronto</button></div>`;
    $('#gReady').onclick = () => { G.handoff = false; renderDuel(box); }; return;
  }
  const myTurn = G.active === vi, prioMe = G.prio === vi && !G.over;
  const instOnly = ['tricks','defTricks','respond'].includes(ph);
  const playable = n => { if (!prioMe) return false; const d = cardData(n);
    if (d.k === 'land') return myTurn && (ph==='main1'||ph==='main2') && !me.landPlayed;
    if (!pay(me, d.c, false)) return false;
    if (instOnly) return !!(GSPELL[n] && GSPELL[n].inst);
    return myTurn && (ph==='main1'||ph==='main2'); };
  const hint = G.over ? '' : !prioMe ? 'Aguarde.' : {
    main1:'Fase principal: jogue um terreno e conjure mágicas tocando nas cartas da mão (as destacadas podem ser usadas).',
    attack:'Toque nas criaturas que vão atacar e confirme.',
    block:'O oponente atacou. Toque numa criatura sua e depois no atacante que ela vai bloquear.',
    tricks:'Bloqueios definidos. Você pode usar instantâneos antes do dano.',
    defTricks:'Você pode usar instantâneos antes do dano (no turno do oponente).',
    respond:`O oponente conjurou <b>${esc(G.pending?G.pending.n:'')}</b>${G.pending&&G.pending.target&&G.pending.target!=='face'?' em <b>'+esc(G.pending.target.u.n)+'</b>':''}. Quer responder com um instantâneo antes que resolva?`,
    main2:'Segunda fase principal. Termine o turno quando quiser.'}[ph] || '';
  const tgtMode = !!G.target;
  const landsHTML = P => `${'WUBRG'.split('').filter(c=>P.lands[c]).map(c=>`${manaSym(c)}<span class="mono" style="font-size:.85rem">${P.lands[c]-P.tapped[c]}/${P.lands[c]}</span>`).join(' ')||'sem terrenos'}`;
  const unitHTML = (u, side) => { const atk = G.attackers.has(u.uid), blk = Object.values(G.blocks).some(a => a.includes(u.uid));
    const Pt = G.p[side]; const valid = tgtMode && targetOk(GSPELL[G.target.n], u, Pt, vi);
    const cls = [u.tapped?'tapped':'', atk?'attacking':'', blk?'blocking':'', G.selBlocker===u.uid?'hl':'', valid?'target':''].join(' ');
    const note = u.pac ? 'Pacifism' : (u.sick && side===vi && myTurn && !u.kw.haste ? 'enjoo' : (G.blocks[u.uid] && G.blocks[u.uid].length ? 'bloqueado' : ''));
    return `<div class="g-u" data-u="${u.uid}" data-side="${side}">${cardHTML(u.n,{cls:'mini '+cls, p:`${pw(u)}/${tg(u)}`, d:u.dmg||undefined, note:note||undefined})}</div>`; };
  const btns = G.over ? `<button class="btn primary" id="gAgain">Jogar de novo</button>${G.camp!=null && G.over.winner===0 && G.camp+1<CAMP.length?`<button class="btn primary" id="gNextCh">Próximo capítulo</button>`:''}<button class="btn" id="gMenu">Menu</button>` : !prioMe ? '' :
    ph==='main1' ? `<button class="btn primary" id="gToAtk">Ir para o combate</button><button class="btn" id="gEnd">Passar o turno</button>` :
    ph==='attack' ? `<button class="btn primary" id="gAtk">Confirmar ataque (${G.attackers.size})</button><button class="btn" id="gNoAtk">Não atacar</button>` :
    ph==='block' ? `<button class="btn primary" id="gBlk">Confirmar bloqueios</button>` :
    ph==='tricks'||ph==='defTricks' ? `<button class="btn primary" id="gDmg">Causar o dano</button>` :
    ph==='respond' ? `<button class="btn primary" id="gLet">Deixar resolver</button>` :
    ph==='main2' ? `<button class="btn primary" id="gEnd">Passar o turno</button>` : '';
  box.innerHTML = `
   <div class="stack-v">
    ${G.camp!=null?`<div class="tip"><b>Campanha · Capítulo ${G.camp+1}: ${CAMP[G.camp].t}</b> · nível ${LVL[G.lvl]}</div>`:''}
    <div class="board duel">
      <div class="side-head"><span>${esc(op.name)} · mão ${op.hand.length} · grimório ${op.lib.length} · ${landsHTML(op)}</span><button class="life g-face ${tgtMode && GSPELL[G.target.n].burn?'tgt':''}" id="gFace">♥ ${op.life}</button></div>
      <div class="zone ${op.bf.length?'':'empty'}" data-empty="Sem criaturas">${op.bf.map(u=>unitHTML(u,1-vi)).join('')}</div>
      <div class="zone ${me.bf.length?'':'empty'}" data-empty="Sem criaturas">${me.bf.map(u=>unitHTML(u,vi)).join('')}</div>
      <div class="side-head"><span>${esc(me.name)} · grimório ${me.lib.length} · ${landsHTML(me)}</span><span class="life">♥ ${me.life}</span></div>
      <div class="hand-zone"><span class="lbl">${G.mode==='pvp'?'Mão de '+esc(me.name):'Sua mão'}</span>${me.hand.map((n,i)=>`<div class="g-h" data-h="${i}">${cardHTML(n,{cls:'mini '+(playable(n)?'hl':''),showPt:false})}</div>`).join('')}</div>
    </div>
    ${G.over ? `<div class="why ${G.mode==='pvp'||G.over.winner===0?'ok':'no'}" style="font-size:1.1rem"><b>${esc(G.p[G.over.winner].name)} venceu!</b> ${esc(G.over.why)}.${G.camp!=null&&G.over.winner===0?` Capítulo concluído: +50 XP.${G.camp+1>=CAMP.length?' Você completou a campanha!':''}`:''}</div>` :
      `<div class="tip">${tgtMode ? `Escolha o alvo de <b>${esc(G.target.n)}</b>${GSPELL[G.target.n].burn?' (criatura ou a vida do oponente)':''}. <button class="btn small" id="gCancel">Cancelar</button>` : hint}</div>`}
    <div class="row-h">${btns}<button class="btn small" id="gQuit">Sair da partida</button></div>
    <div class="panel"><h3>Registro</h3><ul class="g-log">${G.log.slice(0,30).map(l=>`<li>${esc(l)}</li>`).join('')}</ul></div>
   </div>`;
  const rd = () => renderDuel(box);
  $$('.g-h', box).forEach(el => el.onclick = () => {
    const i = +el.dataset.h, n = me.hand[i];
    if (!playable(n)) { openCard(n); return; }
    if (needsTarget(n)) { G.target = {i, n}; rd(); return; }
    gCast(vi, i, GSPELL[n] ? null : undefined); sfx('tap'); rd();
  });
  $$('.g-u', box).forEach(el => el.onclick = () => {
    const side = +el.dataset.side, P = G.p[side], u = P.bf.find(x => x.uid === +el.dataset.u); if (!u) return;
    if (G.target) { if (!targetOk(GSPELL[G.target.n], u, P, vi)) { toast('Alvo inválido para esta mágica.'); return; } gCast(vi, G.target.i, {u, P}); G.target = null; sfx('ok'); rd(); return; }
    if (ph === 'attack' && side === vi && myTurn) { if (!canAttack(u)) { toast(u.pac ? 'Pacificada: não pode atacar.' : u.sick ? 'Enjoo de invocação: ela entrou neste turno.' : 'Esta criatura não pode atacar.'); return; } G.attackers.has(u.uid) ? G.attackers.delete(u.uid) : G.attackers.add(u.uid); sfx('tap'); rd(); return; }
    if (ph === 'block' && prioMe) {
      if (side === vi) { if (u.tapped || u.pac) { toast('Ela não pode bloquear.'); return; } Object.keys(G.blocks).forEach(k => G.blocks[k] = G.blocks[k].filter(id => id !== u.uid)); G.selBlocker = u.uid; rd(); return; }
      if (G.attackers.has(u.uid) && G.selBlocker) { const b = me.bf.find(x=>x.uid===G.selBlocker); if (!canBlock(b, u)) { toast(u.kw.unb ? 'Esta criatura não pode ser bloqueada.' : u.kw.fly ? 'Só criaturas com voar ou alcance bloqueiam voadores.' : u.kw.pblack ? 'Proteção contra preto: criaturas pretas não bloqueiam.' : 'Não pode bloquear.'); return; } (G.blocks[u.uid] = G.blocks[u.uid] || []).push(b.uid); G.selBlocker = null; sfx('tap'); rd(); return; }
    }
    openCard(u.n);
  });
  const on = (id, f) => { const e = $('#'+id); if (e) e.onclick = f; };
  on('gFace', () => { if (G.target && GSPELL[G.target.n].burn) { gCast(vi, G.target.i, 'face'); G.target = null; sfx('hit'); rd(); } });
  on('gCancel', () => { G.target = null; rd(); });
  on('gQuit', () => { G = null; rd(); }); on('gMenu', () => { G = null; rd(); });
  on('gAgain', () => { const o = G._opt; newDuel(o); startTurn(0); rd(); });
  on('gNextCh', () => { startCamp(G.camp + 1); rd(); });
  on('gToAtk', () => { G.phase = 'attack'; rd(); });
  on('gNoAtk', () => { G.phase = 'main2'; G.attackers = new Set(); rd(); });
  on('gAtk', () => {
    if (!G.attackers.size) { G.phase = 'main2'; rd(); return; }
    me.bf.forEach(u => { if (G.attackers.has(u.uid) && !u.kw.vig) u.tapped = true; });
    glog(`${me.name} ataca com ${me.bf.filter(u=>G.attackers.has(u.uid)).map(u=>u.n).join(', ')}.`);
    if (isAI(1 - vi)) { G.blocks = aiBlocks(me.bf.filter(u=>G.attackers.has(u.uid))); const nb = Object.keys(G.blocks).length; glog(`${op.name} ${nb?`bloqueia ${nb} atacante(s)`:'não bloqueia'}.`); G.phase = 'tricks'; }
    else { G.phase = 'block'; G.prio = 1 - vi; G.view = 1 - vi; G.handoff = true; }
    rd(); });
  on('gBlk', () => {
    const A = G.p[1-vi];
    for (const [aid, bl] of Object.entries(G.blocks)) { const a = A.bf.find(x=>x.uid===+aid); if (a && a.kw.menace && bl.length === 1) { toast(`${a.n} tem ameaçar: precisa de dois bloqueadores ou nenhum.`); return; } }
    const nb = Object.values(G.blocks).filter(b=>b.length).length; glog(`${me.name} ${nb?`bloqueia ${nb} atacante(s)`:'não bloqueia'}.`); G.selBlocker = null;
    if (isAI(G.active)) { aiTrick(); G.phase = 'defTricks'; G.prio = 0; }
    else { G.phase = 'tricks'; G.prio = G.active; G.view = G.active; G.handoff = true; }
    rd(); });
  on('gDmg', () => {
    resolveCombat(G.active); sfx('hit');
    if (G.over) { rd(); return; }
    if (isAI(G.active)) { G.phase = 'main1'; aiRun(); } else { G.phase = 'main2'; G.prio = G.active; G.view = G.active; }
    rd(); });
  on('gLet', () => { resolvePending(); if (!G.over) { G.phase = 'main1'; aiRun(); } rd(); });
  on('gEnd', () => { endTurn(); rd(); });
}
function startCamp(ch){
  const deck = S.campDeck || 'rg'; const c = CAMP[ch];
  const opt = {mode:'ai', lvl:c.lvl, camp:ch, decks:[deck, c.opp], names:['Você', c.t]}; newDuel(opt); G._opt = opt; startTurn(0);
}
function renderDuelSetup(box){
  const s = duelSetup; const done = S.camp || 0;
  const deckPick = (key, attr) => `<div class="pick">${Object.entries(DUEL_DECKS).map(([k,d])=>`<button data-${attr}="${k}" aria-pressed="${key===k}"><b>${d.lands.map(l=>manaSym(LANDCOL[l])).join('')} ${d.n}</b><small>${d.d}</small></button>`).join('')}</div>`;
  box.innerHTML = `
   <div class="seg" role="tablist">${[['ai','Contra o computador'],['camp','Campanha'],['pvp','Dois jogadores']].map(([k,l])=>`<button role="tab" data-dm="${k}" aria-selected="${s.mode===k}">${l}</button>`).join('')}</div>
   ${s.mode==='ai' ? `<div class="panel stack-v"><h3>Partida contra o computador</h3><p class="muted">Duelo de 1 contra 1 com decks de 40 cartas e mana colorida de verdade. Você pode responder às remoções do computador com instantâneos.</p>
      <span class="eyebrow">Seu deck</span>${deckPick(s.deck,'dk')}
      <span class="eyebrow">Deck do computador</span>${deckPick(s.opp,'do')}
      <span class="eyebrow">Nível</span><div class="row-h">${Object.entries(LVL).map(([k,l])=>`<button class="chip" data-lv2="${k}" aria-pressed="${s.lvl===k}">${l}</button>`).join('')}</div>
      <p class="muted" style="font-size:.88rem">${{facil:'O computador ataca sem muito critério e quase não usa remoção.',medio:'O computador calcula trocas e usa remoção nas ameaças maiores.',dificil:'O computador usa remoção cedo, calcula ataques letais, guarda dano direto para o golpe final e usa truques de combate.'}[s.lvl]}</p>
      <button class="btn primary" id="gStart" style="align-self:flex-start">Começar</button></div>` : ''}
   ${s.mode==='camp' ? `<div class="panel stack-v"><h3>Campanha: a jornada do planeswalker</h3><p class="muted">Sete capítulos contra oponentes cada vez mais fortes. Vença para liberar o próximo. Seu progresso fica salvo.</p>
      <span class="eyebrow">Seu deck na campanha</span>${deckPick(S.campDeck||'rg','cd')}
      <ol class="path">${CAMP.map((c,i)=>`<li class="${i<done?'ok':''}"><div><b>${c.t}</b> <span class="pill ${c.lvl==='facil'?'good':c.lvl==='medio'?'warn':'bad'}">${LVL[c.lvl]}</span><br><span class="muted">${c.s}</span><br><span class="muted" style="font-size:.85rem">Oponente: ${DUEL_DECKS[c.opp].n}</span></div><button class="btn small ${i===done?'primary':''}" data-ch="${i}" ${i>done?'disabled':''}>${i<done?'Jogar de novo':i===done?'Jogar':'Bloqueado'}</button></li>`).join('')}</ol></div>` : ''}
   ${s.mode==='pvp' ? `<div class="panel stack-v"><h3>Dois jogadores no mesmo aparelho</h3><p class="muted">Ótimo para ensinar alguém em casa. A cada troca de turno, a tela pede para passar o aparelho e esconde a mão do outro jogador.</p>
      <div class="grid g2"><label class="f" for="pn1">Jogador 1<input type="text" id="pn1" value="${esc(s.n1)}"></label><label class="f" for="pn2">Jogador 2<input type="text" id="pn2" value="${esc(s.n2)}"></label></div>
      <span class="eyebrow">Deck do jogador 1</span>${deckPick(s.deck,'dk')}
      <span class="eyebrow">Deck do jogador 2</span>${deckPick(s.d2,'d2')}
      <button class="btn primary" id="gStartP" style="align-self:flex-start">Começar</button></div>` : ''}`;
  const rd = () => renderDuel(box);
  $$('[data-dm]', box).forEach(b => b.onclick = () => { s.mode = b.dataset.dm; rd(); });
  $$('[data-dk]', box).forEach(b => b.onclick = () => { s.deck = b.dataset.dk; rd(); });
  $$('[data-do]', box).forEach(b => b.onclick = () => { s.opp = b.dataset.do; rd(); });
  $$('[data-d2]', box).forEach(b => b.onclick = () => { s.d2 = b.dataset.d2; rd(); });
  $$('[data-cd]', box).forEach(b => b.onclick = () => { S.campDeck = b.dataset.cd; save(); rd(); });
  $$('[data-lv2]', box).forEach(b => b.onclick = () => { s.lvl = b.dataset.lv2; rd(); });
  $$('[data-ch]', box).forEach(b => b.onclick = () => { startCamp(+b.dataset.ch); rd(); });
  const st = $('#gStart'); if (st) st.onclick = () => { const o = {mode:'ai', lvl:s.lvl, decks:[s.deck, s.opp], names:['Você','Computador']}; newDuel(o); G._opt = o; startTurn(0); rd(); };
  const sp = $('#gStartP'); if (sp) sp.onclick = () => { s.n1 = $('#pn1').value.trim() || 'Jogador 1'; s.n2 = $('#pn2').value.trim() || 'Jogador 2'; const o = {mode:'pvp', decks:[s.deck, s.d2], names:[s.n1, s.n2]}; newDuel(o); G._opt = o; startTurn(0); rd(); };
}
