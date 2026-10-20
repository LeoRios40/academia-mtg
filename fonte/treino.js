/* ================= TREINO ================= */
let trTab = 'duelo';
RENDER.treino = function(){
  $('#v-treino').innerHTML = `
   <div class="view-head"><h1>Treino</h1><p>Pratique como os veteranos: jogue contra o computador, simule decks, resolva quebra-cabeças e treine bloqueios, mulligan, pilha e Draft. Para a mesa de verdade: contador de vida, grupo de amigos com torneio e o árbitro de bolso.</p></div>
   <div class="seg" role="tablist">${[['duelo','Partida contra o computador'],['sim','Simulador de deck'],['puz','Quebra-cabeças'],['criar','Criar quebra-cabeça'],['bloq','Bloqueios'],['ler','Ler a mesa'],['mull','Mulligan'],['pilha','Pilha'],['draft','Draft'],['vida','Contador de vida'],['grupo','Grupo e torneio'],['juiz','Árbitro de bolso'],['calc','Calculadora de combate']].map(([k,l])=>`<button role="tab" data-tt="${k}" aria-selected="${trTab===k}">${l}</button>`).join('')}</div>
   <div id="trBody"></div>`;
  $$('[data-tt]').forEach(b => b.onclick = () => { if (b.dataset.tt === 'calc') { show('combate'); return; } trTab = b.dataset.tt; RENDER.treino(); });
  const box = $('#trBody');
  ({custom:renderCustomPuz, criar:renderPuzCreator, duelo:renderDuel, sim:renderSim, puz:renderPuz, bloq:renderBlk, ler:renderRead, mull:renderMull, pilha:renderStack, draft:renderDraft, vida:renderLifeIntro, grupo:renderGroup, juiz:renderJudge})[trTab](box);
  seen('t_'+trTab);
};

/* ---------- 1. quebra-cabeças ---------- */
const PUZ = [
 {t:'Conte o dano', lvl:'Fácil', b:{opp:[],me:[C('Goblin Guide'),C('Mountain')],hand:['Lightning Bolt','Shock'],life:[20,5]},
  x:'O oponente tem 5 de vida e nenhuma criatura. Você tem um Goblin Guide pronto para atacar e só <b>uma</b> Montanha desvirada.',
  o:['Atacar com o Goblin e conjurar Lightning Bolt no oponente','Conjurar Shock no oponente e atacar','Conjurar Lightning Bolt sem atacar, guardando o Goblin para bloquear'],a:0,
  e:'2 do ataque + 3 do Lightning Bolt = 5. Com uma Montanha só dá para conjurar uma mágica, então escolha a que causa mais dano. Shock + ataque daria só 4.'},
 {t:'Atropelar no tamanho certo', lvl:'Fácil', b:{opp:[C('Grizzly Bears',{st:'blocking'})],me:[C('Colossal Dreadmaw',{st:'tapped attacking'}),C('Forest'),C('Swamp')],hand:['Giant Growth','Bladebrand'],life:[20,6]},
  x:'O oponente tem 6 de vida e bloqueou seu Colossal Dreadmaw (6/6, atropelar) com Grizzly Bears (2/2). Você tem uma Floresta e um Pântano desvirados.',
  o:['Giant Growth no Dreadmaw','Bladebrand no Dreadmaw','Conjurar Giant Growth e Bladebrand'],a:0,
  e:'Com Giant Growth o Dreadmaw fica 9/9: 2 de dano letal nos Ursos e 7 atropelam. Com Bladebrand (toque mortífero) seriam 1 nos Ursos e 5 atropelando, um a menos que o necessário. E não há mana para as duas mágicas: Bladebrand custa {1}{B}.'},
 {t:'Dá para garantir?', lvl:'Médio', b:{opp:[C('Wall of Omens')],me:[C('Fencing Ace'),C('Goblin Guide'),C('Forest')],hand:['Giant Growth'],life:[20,8]},
  x:'O oponente tem 8 de vida e uma Wall of Omens (0/4) desvirada. Você vai atacar com Fencing Ace (1/1, golpe duplo) e Goblin Guide (2/2), e tem Giant Growth com uma Floresta.',
  o:['Não. Você só vence se a Muralha bloquear o Goblin','Sim. Giant Growth no atacante não bloqueado sempre vence','Sim, porque golpe duplo passa pela Muralha'],a:0,
  e:'Se a Muralha bloquear o Goblin, o Ace não bloqueado com Giant Growth causa (1+3) × 2 = 8. Se a Muralha bloquear o Ace, sobra o Goblin: 2 + 3 = 5. Um bom oponente bloqueia o Ace. Saber quando o oponente consegue se defender é tão importante quanto achar o golpe final.'},
 {t:'A ordem importa', lvl:'Médio', b:{opp:[C('Vampire Nighthawk')],me:[C('Serra Angel'),C('Boggart Brute'),C('Mountain')],hand:['Lightning Bolt'],life:[20,7]},
  x:'O oponente tem 7 de vida e um Vampire Nighthawk (2/3, voar, toque mortífero) desvirado. Você tem Serra Angel (4/4, voar) e Boggart Brute (3/2, ameaçar).',
  o:['Lightning Bolt no Nighthawk antes do combate e atacar com os dois','Atacar com os dois e conjurar Lightning Bolt no oponente','Atacar com os dois e conjurar Lightning Bolt no Nighthawk depois que ele bloquear'],a:0,
  e:'Sem o Nighthawk, ninguém bloqueia: 4 + 3 = 7. Se você atacar primeiro, ele bloqueia o Anjo (o Brute tem ameaçar e não pode ser bloqueado por uma criatura só) e sobra 3 + 3 = 6. Matar o bloqueador depois do bloqueio não ajuda: o Anjo continua bloqueado e não causa dano ao jogador.'},
 {t:'Isca para a anulação', lvl:'Médio', b:{opp:[C('Island'),C('Island')],me:[C('Goblin Guide'),C('Mountain'),C('Mountain')],hand:['Lightning Bolt','Shock'],life:[20,4]},
  x:'O oponente tem 4 de vida, nenhuma criatura e duas Ilhas desviradas: pode ter um Counterspell. Você tem Goblin Guide, duas Montanhas, Lightning Bolt e Shock.',
  o:['Atacar e depois conjurar as duas mágicas, uma de cada vez','Conjurar só Lightning Bolt antes do combate','Não atacar e guardar as mágicas para o próximo turno'],a:0,
  e:'O ataque deixa o oponente com 2. Shock sozinho já seria letal, então ele precisa anulá-lo. Aí você conjura Lightning Bolt e ele não tem mana para outra anulação. Duas ameaças vencem uma resposta.'},
 {t:'Dano de comandante', lvl:'Médio', b:{opp:[],me:[C('Krenko, Mob Boss',{note:'17 de dano de comandante'}),C('Bonesplitter'),C('Mountain'),C('Mountain')],hand:[],life:[40,30]},
  x:'Commander. O oponente tem 30 de vida, mas já recebeu 17 de dano do seu Krenko (3/3). Ele não tem bloqueadores. Você tem Bonesplitter no campo, sem estar equipado, e duas Montanhas.',
  o:['Equipar o Bonesplitter no Krenko e atacar','Virar o Krenko para criar Goblins e atacar com eles','Atacar só com o Krenko, sem equipar'],a:0,
  e:'Equipar custa {1} e dá +2/+0: Krenko causa 5, somando 22 de dano de comandante. Com 21 ou mais de um mesmo comandante, o jogador perde. As fichas criadas agora estariam com enjoo de invocação.'},
 {t:'Quem pode bloquear quem', lvl:'Médio', b:{opp:[C('White Knight')],me:[C('Vampire Nighthawk'),C('Grizzly Bears'),C('Forest'),C('Swamp')],hand:['Giant Growth','Bladebrand'],life:[20,3]},
  x:'O oponente tem 3 de vida e um White Knight (2/2, iniciativa, proteção contra preto). Você ataca com Vampire Nighthawk (2/3, voar) e Grizzly Bears.',
  o:['Giant Growth no Nighthawk depois dos bloqueios','Bladebrand nos Ursos antes do combate','Giant Growth nos Ursos depois dos bloqueios'],a:0,
  e:'O Cavaleiro não voa e não pode bloquear o Nighthawk, que sempre passa: com Giant Growth são 5. Ele vai bloquear os Ursos, então qualquer bônus neles não chega ao jogador.'},
 {t:'Golpe duplo com tudo', lvl:'Difícil', b:{opp:[],me:[C('Boros Swiftblade'),C('Bonesplitter'),C('Mountain'),C('Forest'),C('Plains')],hand:['Giant Growth'],life:[20,10]},
  x:'O oponente tem 10 de vida e nenhum bloqueador. Você tem Boros Swiftblade (1/2, golpe duplo), Bonesplitter sem equipar, três terrenos e Giant Growth.',
  o:['Equipar o Bonesplitter e conjurar Giant Growth','Só conjurar Giant Growth','Só equipar o Bonesplitter'],a:0,
  e:'1 + 2 + 3 = 6 de poder, e com golpe duplo isso vira 12. Só Giant Growth: 4 × 2 = 8. Só equipar: 3 × 2 = 6. Todo bônus conta duas vezes com golpe duplo.'}
];
let puz = {i:0, ans:null, order:null};
function renderPuz(box){
  const P = PUZ[puz.i]; if (!puz.order) puz.order = shuffleIdx(P.o.length);
  const ans = puz.ans != null; const solved = Object.keys(S.puz||{}).length;
  box.innerHTML = `
   <div class="stack-v">
     <div class="row-h" style="justify-content:space-between"><div><span class="eyebrow">Quebra-cabeça ${puz.i+1} de ${PUZ.length} · ${P.lvl}</span><h2>${P.t}</h2></div>
       <div class="row-h"><span class="muted mono">${solved}/${PUZ.length} resolvidos</span></div></div>
     <div class="filters" style="margin:0">${PUZ.map((p,i)=>`<button class="chip" data-pz="${i}" aria-pressed="${i===puz.i}">${(S.puz||{})[i]?'✓ ':''}${i+1}</button>`).join('')}</div>
     ${boardHTML(P.b)}
     <p class="narr">${fmt(P.x)}</p>
     <div class="q"><div class="ask">Qual jogada vence neste turno?</div>
       ${puz.order.map((oi,k)=>`<button class="opt ${ans?(oi===P.a?'right':oi===puz.ans?'wrong':''):''}" data-po="${oi}" ${ans?'disabled':''}><span class="k">${'ABC'[k]}</span><span>${fmt(P.o[oi])}</span></button>`).join('')}
       ${ans?`<div class="why ${puz.ans===P.a?'ok':'no'}"><b>${puz.ans===P.a?'Isso!':'Não vence.'}</b> ${fmt(P.e)}</div>`:''}</div>
     <div class="nav-row"><button class="btn" id="pzPrev" ${puz.i===0?'disabled':''}>← Anterior</button>${ans?`<button class="btn" id="pzRetry">Tentar de novo</button>`:''}<button class="btn primary" id="pzNext" ${puz.i===PUZ.length-1?'disabled':''}>Próximo →</button></div>
   </div>`;
  $$('[data-pz]', box).forEach(b => b.onclick = () => { puz = {i:+b.dataset.pz, ans:null, order:null}; renderPuz(box); });
  $$('[data-po]', box).forEach(b => b.onclick = () => { puz.ans = +b.dataset.po; if (puz.ans === P.a) { sfx('win'); S.puz = S.puz || {}; if (!S.puz[puz.i]) { S.puz[puz.i] = 1; addXP(25); save(); checkAch(); } } else sfx('no'); renderPuz(box); });
  $('#pzPrev').onclick = () => { puz = {i:puz.i-1, ans:null, order:null}; renderPuz(box); };
  $('#pzNext').onclick = () => { puz = {i:puz.i+1, ans:null, order:null}; renderPuz(box); };
  const rt = $('#pzRetry'); if (rt) rt.onclick = () => { puz.ans = null; puz.order = null; renderPuz(box); };
}

/* ---------- 3. treino de pilha ---------- */
const STACK_POOL = [
 ['Lightning Bolt','causa 3 de dano nos Ursos'],['Giant Growth','dá +3/+3 aos Ursos'],['Shock','causa 2 de dano nos Ursos'],
 ['Blossoming Defense','dá +2/+2 e resistência a magia aos Ursos'],['Murder','destrói os Ursos'],['Counterspell','anula a mágica logo abaixo'],
 ['Opt','olha o topo e compra um card'],['Bladebrand','dá toque mortífero aos Ursos e compra um card']
];
let stk = null;
function newStack(){
  const n = Math.min(5, 2 + Math.floor((S.stackStreak||0)/2));
  const items = []; let who = Math.random() < .5 ? 'Oponente' : 'Você';
  for (let i=0;i<n;i++) { const p = STACK_POOL[Math.floor(Math.random()*STACK_POOL.length)]; items.push({who, n:p[0], d:p[1], id:i}); who = who === 'Você' ? 'Oponente' : 'Você'; }
  stk = {items, picked:[], done:false, order: shuffleIdx(n)};
}
function renderStack(box){
  if (!stk) newStack();
  const n = stk.items.length, ok = stk.done && stk.picked.every((id,i)=>id === n-1-i);
  box.innerHTML = `
   <div class="grid g2" style="align-items:start">
     <div class="panel stack-v"><h3>O que aconteceu</h3>
       <p class="muted">Em ordem: cada jogador respondeu ao anterior. Os Ursos estão no campo de batalha.</p>
       <ol class="path">${stk.items.map((it,i)=>`<li><div><b>${it.who}</b> ${i===0?'conjura':'responde com'} ${cr(it.n)}, que ${it.d}.</div></li>`).join('')}</ol>
       <div class="row-h"><span class="pill">Nível ${n-1}</span><span class="muted">Sequência de acertos: <b class="mono">${S.stackStreak||0}</b> · recorde <b class="mono">${S.stackBest||0}</b></span></div>
     </div>
     <div class="panel stack-v"><h3>Toque na ordem em que resolvem</h3>
       <div class="stack-v" style="gap:8px">${stk.order.map(i=>{ const it = stk.items[i], pos = stk.picked.indexOf(i); return `<button class="opt ${stk.done?(stk.picked.indexOf(i)===n-1-i?'right':'wrong'):''}" data-sk="${i}" ${pos>=0||stk.done?'disabled':''}><span class="k">${pos>=0?pos+1:'·'}</span><span><b>${esc(it.n)}</b> <span class="muted">(${it.who})</span></span></button>`; }).join('')}</div>
       ${stk.done ? `<div class="why ${ok?'ok':'no'}"><b>${ok?'Correto!':'Ainda não.'}</b> A pilha resolve de cima para baixo: o último a entrar é o primeiro a sair. Ordem certa: ${stk.items.slice().reverse().map(it=>esc(it.n)).join(' → ')}.${stk.items.some(it=>it.n==='Counterspell')?' Lembre: Counterspell anula o item logo abaixo dele, que então nem chega a resolver.':''}</div><button class="btn primary" id="stNew">Nova pilha</button>` : `<button class="btn small" id="stUndo" ${stk.picked.length?'':'disabled'}>Desfazer</button>`}
     </div>
   </div>`;
  $$('[data-sk]', box).forEach(b => b.onclick = () => {
    stk.picked.push(+b.dataset.sk); sfx('tap');
    if (stk.picked.length === n) { stk.done = true; const good = stk.picked.every((id,i)=>id === n-1-i);
      if (good) { S.stackStreak = (S.stackStreak||0) + 1; S.stackBest = Math.max(S.stackBest||0, S.stackStreak); addXP(5); sfx('ok'); } else { S.stackStreak = 0; sfx('no'); } save(); checkAch(); }
    renderStack(box);
  });
  const u = $('#stUndo'); if (u) u.onclick = () => { stk.picked.pop(); renderStack(box); };
  const nw = $('#stNew'); if (nw) nw.onclick = () => { newStack(); renderStack(box); };
}

/* ---------- 4. treino de draft ---------- */
const DRAFT_POOL = [
 ['Lightning Bolt',4.5,'rem'],['Murder',4.5,'rem'],['Pacifism',4,'rem'],['Searing Spear',4,'rem'],['Incinerate',4,'rem'],['Shock',3.5,'rem'],
 ['Serra Angel',4.5,'bomb'],['Shivan Dragon',4.5,'bomb'],['Vampire Nighthawk',4.5,'bomb'],['Siege-Gang Commander',4.5,'bomb'],
 ['Bonesplitter',3.5,'eff'],['Boggart Brute',3,'eff'],['Centaur Courser',3,'eff'],['Giant Spider',3,'eff'],['Colossal Dreadmaw',3,'eff'],['Ambush Viper',3,'eff'],['Wall of Omens',3,'eff'],['Llanowar Elves',3,'eff'],['Goblin Guide',2.5,'eff'],['Beetleback Chief',3.5,'eff'],
 ['Giant Growth',3,'trick'],['Blossoming Defense',2.5,'trick'],['Counterspell',3,'trick'],['Divination',2.5,'draw'],['Wrath of God',3,'trick'],
 ['Grizzly Bears',2,'weak'],['Storm Crow',1.5,'weak'],['Raging Goblin',1.5,'weak'],['Opt',2,'weak'],['Duress',1,'weak'],['Dark Ritual',1,'weak'],['Vandalblast',1,'weak'],['Darksteel Myr',1.5,'weak']
];
const DRAFT_WHY = {rem:'remoção: resolve o problema do oponente, a prioridade máxima no Limitado', bomb:'criatura forte que vence o jogo sozinha se não for respondida', eff:'criatura eficiente ou evasiva para o custo', trick:'truque ou interação situacional', draw:'compra de cards: boa, mas lenta', weak:'fraca no Limitado: pouco impacto no campo'};
let dr = null;
function newDraft(){ dr = {round:0, score:0, pack:null, pick:null, hist:[]}; nextPack(); }
function nextPack(){ const idx = shuffleIdx(DRAFT_POOL.length).slice(0, 8); dr.pack = idx.map(i => DRAFT_POOL[i]); dr.pick = null; }
function renderDraft(box){
  if (!dr) newDraft();
  if (dr.round >= 10) {
    const pct = dr.score * 10; if (pct > (S.draftBest||0)) { S.draftBest = pct; save(); }
    box.innerHTML = `<div class="panel stack-v" style="text-align:center;align-items:center"><span class="eyebrow">Resultado</span><div class="score-big">${dr.score}/10</div><p class="muted">${pct>=80?'Você já escolhe como um jogador experiente de Draft.':pct>=50?'Bom! Lembre: remoção e criaturas fortes primeiro, truques e compra depois.':'Regra de ouro: remoção primeiro, depois criaturas fortes, depois o resto.'}</p><button class="btn primary" id="drAgain">Novo draft</button></div>
      <div class="panel" style="margin-top:14px"><h3>Suas escolhas</h3><div class="cardlist">${dr.hist.map(h=>`<div><span class="qt">${h.ok?'✓':'✕'}</span><span class="nm">${cr(h.n)}</span><span class="muted" style="font-size:.8rem">melhor: ${esc(h.best)}</span></div>`).join('')}</div></div>`;
    $('#drAgain').onclick = () => { newDraft(); renderDraft(box); }; return;
  }
  const max = Math.max(...dr.pack.map(c=>c[1]));
  box.innerHTML = `
   <div class="stack-v">
     <div class="panel stack-v"><div class="row-h" style="justify-content:space-between"><h3>Escolha uma carta do pacote</h3><span class="mono muted">Escolha ${dr.round+1}/10 · ${dr.score} acertos · recorde ${S.draftBest||0}%</span></div>
       <p class="muted">No Draft, você pega uma carta e passa o resto. Qual carta deixa seu deck mais forte?</p></div>
     <div class="hand-row" id="drPack">${dr.pack.map((c,i)=>cardHTML(c[0],{cls: dr.pick!=null ? (c[1]===max?'picked-best':(i===dr.pick?'picked':'')) : ''})).join('')}</div>
     ${dr.pick!=null ? `<div class="why ${dr.pack[dr.pick][1]===max?'ok':'no'}"><b>${dr.pack[dr.pick][1]===max?'Ótima escolha.':'Havia uma melhor.'}</b> Você pegou ${cr(dr.pack[dr.pick][0])}: ${DRAFT_WHY[dr.pack[dr.pick][2]]}. ${dr.pack[dr.pick][1]!==max?`A melhor era ${dr.pack.filter(c=>c[1]===max).map(c=>cr(c[0])).join(' ou ')}: ${DRAFT_WHY[dr.pack.find(c=>c[1]===max)[2]]}.`:''}</div>
       <div class="panel"><span class="eyebrow">Notas do pacote (0 a 5)</span><div class="stack-v" style="gap:4px;margin-top:6px">${dr.pack.slice().sort((a,b)=>b[1]-a[1]).map(c=>`<div class="hbar" style="grid-template-columns:minmax(0,1fr) 1fr 40px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c[0])}</span><span class="track"><i style="width:${c[1]/5*100}%;background:var(--accent)"></i></span><span class="mono">${c[1]}</span></div>`).join('')}</div></div>
       <button class="btn primary" id="drNext">${dr.round===9?'Ver resultado':'Próximo pacote'}</button>` : ''}
     <p class="muted" style="font-size:.85rem">As notas são uma referência didática da Academia. Para dados reais de cada coleção, veja ${ext('https://www.17lands.com/card_ratings','17Lands')}.</p>
   </div>`;
  if (dr.pick == null) $$('#drPack .mcard').forEach((el,i) => el.onclick = () => { dr.pick = i; const ok = dr.pack[i][1] === max; if (ok) { dr.score++; sfx('ok'); } else sfx('no'); dr.hist.push({n:dr.pack[i][0], ok, best:dr.pack.find(c=>c[1]===max)[0]}); renderDraft(box); });
  else $$('#drPack .mcard').forEach(el => el.onclick = () => openCard(el.dataset.card));
  const nx = $('#drNext'); if (nx) nx.onclick = () => { dr.round++; if (dr.round >= 10) { if (dr.score >= 8 && !S.draftPro) { S.draftPro = true; save(); checkAch(); } } else nextPack(); renderDraft(box); };
}

/* ---------- 5. contador de vida ---------- */
const PCOL = ['#c0563a','#2d6aa0','#2b7a4b','#7a4fa0'];
function lifeState(){ if (!S.lifeS) S.lifeS = {n:2, start:20, p:[]}; const L = S.lifeS; while (L.p.length < 4) L.p.push({life:L.start, poison:0, cmd:[0,0,0,0], name:'Jogador ' + (L.p.length+1)}); return L; }
function resetLife(n, start){ S.lifeS = {n, start, p:[]}; lifeState(); save(); }
function renderLifeIntro(box){
  const L = lifeState();
  box.innerHTML = `<div class="panel stack-v"><h3>Contador de vida para a mesa</h3>
    <p class="muted">Substitui o aplicativo de vida: de 2 a 4 jogadores, veneno, dano de comandante, dado e moeda. Em tela cheia, os jogadores de cima veem os números de frente para eles, com o celular deitado no meio da mesa.</p>
    <div class="row-h">${[2,3,4].map(n=>`<button class="chip" data-ln="${n}" aria-pressed="${L.n===n}">${n} jogadores</button>`).join('')}</div>
    <div class="row-h">${[20,30,40].map(v=>`<button class="chip" data-ls="${v}" aria-pressed="${L.start===v}">${v} de vida${v===40?' (Commander)':''}</button>`).join('')}</div>
    <div class="row-h"><button class="btn primary" id="lifeOpen">Abrir o contador</button><button class="btn" id="lifeReset">Nova partida</button></div></div>`;
  $$('[data-ln]', box).forEach(b => b.onclick = () => { resetLife(+b.dataset.ln, L.start); renderLifeIntro(box); });
  $$('[data-ls]', box).forEach(b => b.onclick = () => { resetLife(L.n, +b.dataset.ls); renderLifeIntro(box); });
  $('#lifeOpen').onclick = openLife;
  $('#lifeReset').onclick = () => { resetLife(L.n, L.start); toast('Vidas reiniciadas'); };
}
let lifeCmd = -1;
function openLife(){
  let ov = $('#lifeOv'); if (!ov) { ov = document.createElement('div'); ov.id = 'lifeOv'; document.body.append(ov); }
  ov.hidden = false; document.body.style.overflow = 'hidden'; drawLife();
  try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(()=>{}); } catch(e){}
}
function drawLife(){
  const ov = $('#lifeOv'), L = lifeState(); const ps = L.p.slice(0, L.n);
  ov.className = 'life-ov n' + L.n;
  ov.innerHTML = ps.map((p,i) => {
    const flip = (L.n === 2 && i === 0) || (L.n > 2 && i < 2);
    const dead = p.life <= 0 || p.poison >= 10 || p.cmd.some(c=>c>=21);
    return `<div class="lp ${flip?'flip':''} ${dead?'dead':''}" style="--pc:${PCOL[i]}">
      <div class="lp-top"><span>${esc(p.name)}</span><span>${p.poison?`☠ ${p.poison}`:''}</span></div>
      <div class="lp-main"><button class="lp-b" data-lv="${i}:-1" aria-label="Menos 1">−</button><span class="lp-v mono">${p.life}</span><button class="lp-b" data-lv="${i}:1" aria-label="Mais 1">+</button></div>
      <div class="lp-row"><button data-lv="${i}:-5">−5</button><button data-lv="${i}:5">+5</button><button data-pz2="${i}">Veneno ${p.poison}</button>${L.start===40?`<button data-cm="${i}">Comandante</button>`:''}</div>
      ${lifeCmd===i ? `<div class="lp-cmd">${ps.map((q,j)=>j===i?'':`<div><span>De ${esc(q.name)}</span><button data-cd="${i}:${j}:-1">−</button><b class="mono">${p.cmd[j]}</b><button data-cd="${i}:${j}:1">+</button></div>`).join('')}</div>` : ''}
      ${dead?'<div class="lp-dead">Fora da partida</div>':''}
    </div>`; }).join('') + `<div class="lp-bar"><button id="lpDie">d20</button><button id="lpD6">d6</button><button id="lpCoin">Moeda</button><span id="lpOut" class="mono"></span><button id="lpReset">Reiniciar</button><button id="lpClose">Fechar</button></div>`;
  const ch = (i, d) => { L.p[i].life += d; save(); drawLife(); };
  $$('[data-lv]', ov).forEach(b => b.onclick = () => { const [i,d] = b.dataset.lv.split(':').map(Number); ch(i, d); });
  $$('[data-pz2]', ov).forEach(b => b.onclick = () => { L.p[+b.dataset.pz2].poison = (L.p[+b.dataset.pz2].poison + 1) % 11; save(); drawLife(); });
  $$('[data-cm]', ov).forEach(b => b.onclick = () => { lifeCmd = lifeCmd === +b.dataset.cm ? -1 : +b.dataset.cm; drawLife(); });
  $$('[data-cd]', ov).forEach(b => b.onclick = () => { const [i,j,d] = b.dataset.cd.split(':').map(Number); const p = L.p[i]; p.cmd[j] = Math.max(0, p.cmd[j] + d); p.life -= d; save(); drawLife(); });
  const out = m => { $('#lpOut').textContent = m; sfx('tap'); };
  $('#lpDie').onclick = () => out('d20: ' + (1 + Math.floor(Math.random()*20)));
  $('#lpD6').onclick = () => out('d6: ' + (1 + Math.floor(Math.random()*6)));
  $('#lpCoin').onclick = () => out(Math.random() < .5 ? 'Cara' : 'Coroa');
  $('#lpReset').onclick = () => { resetLife(L.n, L.start); drawLife(); };
  $('#lpClose').onclick = () => { ov.hidden = true; document.body.style.overflow = ''; };
}

/* ---------- 6. árbitro de bolso ---------- */
const JUDGE = [
 ['Combate','Minha criatura foi bloqueada e o bloqueador morreu antes do dano. Ela causa dano ao jogador?','Não, a menos que tenha atropelar. Uma criatura bloqueada continua bloqueada mesmo que o bloqueador saia do campo.'],
 ['Combate','Posso bloquear com uma criatura que acabou de entrar?','Sim. Enjoo de invocação só impede atacar e usar habilidades com {T}.'],
 ['Combate','Uma criatura pode bloquear dois atacantes?','Não, a menos que um card diga que pode. Mas um atacante pode ser bloqueado por várias criaturas.'],
 ['Combate','Quem decide como o dano do atacante é dividido entre vários bloqueadores?','O jogador atacante, livremente. Com atropelar, cada bloqueador precisa receber dano letal antes de o excesso ir para o jogador.'],
 ['Combate','Iniciativa contra iniciativa: quem bate primeiro?','As duas causam dano ao mesmo tempo, no passo de iniciativa.'],
 ['Combate','Vigilância permite bloquear no turno do oponente depois de atacar?','Sim. A criatura não vira ao atacar e continua disponível.'],
 ['Pilha','Posso responder a um terreno sendo jogado?','Não. Jogar terreno é uma ação especial e não usa a pilha.'],
 ['Pilha','Posso responder quando o oponente vira um terreno para gerar mana?','Não. Habilidades de mana não usam a pilha.'],
 ['Pilha','Se meu alvo sumir, minha mágica faz alguma coisa?','Se todos os alvos ficarem ilegais, ela não resolve. Se só alguns ficarem ilegais, ela faz o que puder com os que restaram.'],
 ['Pilha','Uma habilidade disparada ("quando…", "sempre que…") pode ser respondida?','Sim. Ela vai para a pilha como uma mágica e pode receber respostas.'],
 ['Pilha','Posso conjurar uma criatura no turno do oponente?','Só se ela tiver lampejo ou um efeito permitir.'],
 ['Habilidades','Toque mortífero mata uma criatura indestrutível?','Não. Toque mortífero destrói, e indestrutível ignora destruição. Resistência 0, exílio e sacrifício funcionam.'],
 ['Habilidades','Resistência a magia me protege de Wrath of God?','Não. Efeitos sem alvo afetam todas as permanentes, inclusive as com resistência a magia.'],
 ['Habilidades','Atropelar com toque mortífero: quanto preciso dar ao bloqueador?','Apenas 1 de dano já é letal. O resto passa para o jogador.'],
 ['Habilidades','Vínculo com a vida funciona com dano de mágicas?','Sim, se a mágica ou habilidade tiver vínculo com a vida. Vale para qualquer dano causado pela fonte.'],
 ['Habilidades','Ameaçar pode ser bloqueado por uma criatura com alcance?','Só se houver pelo menos dois bloqueadores. Ameaçar exige duas ou mais criaturas.'],
 ['Habilidades','Proteção contra preto: o que impede?','Não pode ser bloqueada por criaturas pretas, ser alvo de mágicas pretas, ser encantada ou equipada por coisas pretas, e todo dano de fontes pretas é prevenido.'],
 ['Planeswalkers','Posso usar duas habilidades do mesmo planeswalker no mesmo turno?','Não. Uma ativação de lealdade por planeswalker por turno, na sua fase principal, com a pilha vazia.'],
 ['Planeswalkers','Posso usar a habilidade no turno em que o planeswalker entra?','Sim. Planeswalkers não têm enjoo de invocação.'],
 ['Planeswalkers','Dano de queimar o oponente pode ir para o planeswalker dele?','Só se a mágica disser "qualquer alvo" ou citar planeswalkers. A antiga regra de redirecionar dano não existe mais.'],
 ['Commander','Meu comandante foi para o cemitério. Posso devolvê-lo à zona de comando?','Sim, se quiser. Também vale para exílio, mão e grimório.'],
 ['Commander','O imposto de comandante conta quando ele volta da mão?','Não. O imposto só conta vezes que você o conjurou da zona de comando.'],
 ['Commander','Dano de comandante conta se o comandante estiver com outro jogador?','Conta o dano de combate causado pelo mesmo comandante, independentemente de quem o controla.'],
 ['Commander','Uma carta com {R} só no texto pode entrar num deck mono-verde?','Não. Símbolos de mana no texto contam para a identidade de cor.'],
 ['Geral','Comprei com o grimório vazio. Perdi na hora?','Você perde na próxima vez que o jogo verificar as ações baseadas em estado, ou seja, quase imediatamente.'],
 ['Geral','Duas criaturas lendárias com o mesmo nome: o que acontece?','Regra da lenda: o controlador escolhe uma e coloca a outra no cemitério. Jogadores diferentes podem ter a mesma lendária.'],
 ['Geral','Posso olhar meu próprio cemitério ou o do oponente?','Sim, a qualquer momento. O cemitério é público, assim como o exílio (salvo cards exilados virados para baixo).'],
 ['Geral','Esqueci um gatilho meu. Posso voltar?','Em jogos casuais, combine com a mesa. Em torneios, depende do tipo de gatilho: chame um juiz.']
];
let jq = '', jc = 'Todas';
function renderJudge(box){
  const cats = ['Todas', ...new Set(JUDGE.map(j=>j[0]))];
  box.innerHTML = `
   <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="text" id="jq" placeholder="Pergunte: bloquear, atropelar, comandante…" value="${esc(jq)}" autocomplete="off"></div>
   <div class="filters">${cats.map(c=>`<button class="chip" data-jc="${c}" aria-pressed="${jc===c}">${c}</button>`).join('')}</div>
   <div id="jList"></div>
   <p class="muted" style="font-size:.85rem;margin-top:10px">Respostas resumidas das regras oficiais. Para casos complexos, consulte as ${ext('https://magic.wizards.com/en/rules','Regras Completas')} ou pergunte a um juiz.</p>`;
  const draw = () => { const q = jq.toLowerCase(); const L = JUDGE.filter(j => (jc==='Todas'||j[0]===jc) && (!q || (j[1]+j[2]).toLowerCase().includes(q)));
    $('#jList').innerHTML = L.length ? L.map(j=>`<details class="sec"><summary>${j[1]}</summary><div class="sec-body"><span class="pill">${j[0]}</span><p>${fmt(j[2])}</p></div></details>`).join('') : '<p class="muted">Nada encontrado. Tente outra palavra.</p>'; };
  $('#jq').oninput = e => { jq = e.target.value; draw(); };
  $$('[data-jc]', box).forEach(b => b.onclick = () => { jc = b.dataset.jc; renderJudge(box); });
  draw();
}
