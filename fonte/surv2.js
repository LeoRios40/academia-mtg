/* ================= v3.4: SOBREVIVA AO MULTIVERSO 2.0 =================
   Jogo de ação estilo "survivors" com a arte das cartas (Scryfall), quatro planos, evoluções em cartas famosas,
   boosters por raridade, habilidade de lealdade, sons, loja da Centelha e desafio do dia. */

/* ---------- dados ---------- */
const SV_PLANES = {
  dominaria:{n:'Dominária', d:'Onde tudo começou: goblins, zumbis, arqueiros élficos e o Dragão Shivano.', land:'Karplusan Forest', g1:'#1d2a1a', g2:'#243320', deco:'grass', amb:'motes', ambC:'rgba(240,230,170,.5)', scale:[0,2,4,7,9,11],
    T:{swarm:['Ratos','Typhoid Rats'], grunt:['Goblin','Goblin Guide'], tank:['Zumbi','Walking Corpse'], fast:['Goblin furioso','Raging Goblin'], shooter:['Arqueiro élfico','Elvish Archers'], charger:['Cavaleiro','White Knight'], splitter:['Limo mitótico','Mitotic Slime'], elite:['Elemental de Fogo','Fire Elemental'], boss1:['Dragão Shivano','Shivan Dragon'], boss2:['Senhor do Abismo','Lord of the Pit']}},
  innistrad:{n:'Innistrad', d:'Noite eterna: vampiros, carniçais, lobisomens e Olivia Voldaren.', land:'Moorland Haunt', g1:'#15141f', g2:'#1b1a28', deco:'graves', amb:'fog', ambC:'rgba(180,190,220,.18)', night:1,
    T:{swarm:['Morcegos','Vampire Bats'], grunt:['Carniçal','Diregraf Ghoul'], tank:['Abominação','Skaab Ruinator'], fast:['Vampiro','Vampire Nighthawk'], shooter:['Inquisidor','Elite Inquisitor'], charger:['Lobisomem','Village Ironsmith'], splitter:['Ratos podres','Rotting Rats'], elite:['Lobisomem alfa','Huntmaster of the Fells'], boss1:['Olivia Voldaren','Olivia Voldaren'], boss2:['Griselbrand','Griselbrand']}},
  ravnica:{n:'Ravnica', d:'A cidade das guildas: Rakdos, Gruul, Izzet e o dragão Niv-Mizzet.', land:'Steam Vents', g1:'#1e1c22', g2:'#26232b', deco:'cobble', amb:'embers', ambC:'rgba(255,150,80,.6)',
    T:{swarm:['Ratos da cripta','Crypt Rats'], grunt:['Gargalhador Rakdos','Rakdos Cackler'], tank:['Fera Gruul','Gruul Ragebeast'], fast:['Cavaleiro celeste','Skyknight Legionnaire'], shooter:['Mago Izzet','Izzet Guildmage'], charger:['Calculista Boros','Boros Reckoner'], splitter:['Experimento Simic','Experiment One'], elite:['Troll Golgari','Golgari Grave-Troll'], boss1:['Niv-Mizzet','Niv-Mizzet, the Firemind'], boss2:['Rakdos','Rakdos, Lord of Riots']}},
  zendikar:{n:'Zendikar', d:'O plano devorado: crias Eldrazi, hedrons flutuantes, Ulamog e Emrakul.', land:'Emeria, the Sky Ruin', g1:'#1c1813', g2:'#241f18', deco:'hedrons', amb:'dust', ambC:'rgba(220,200,255,.4)',
    T:{swarm:['Crias Eldrazi','Eyeless Watcher'], grunt:['Peão de Ulamog','Pawn of Ulamog'], tank:['Devastador','Eldrazi Devastator'], fast:['Predador de Kozilek',"Kozilek's Predator"], shooter:['Incubadora',"Emrakul's Hatcher"], charger:['Guia da ruína','Ruination Guide'], splitter:['Imitador Eldrazi','Eldrazi Mimic'], elite:['Aquilo que Trai','It That Betrays'], boss1:['Ulamog','Ulamog, the Infinite Gyre'], boss2:['Emrakul','Emrakul, the Aeons Torn']}}
};
const SV_PLANE_ORDER = ['dominaria','innistrad','ravnica','zendikar'];
const SV_T = {
  swarm:{hp:5, sp:125, dmg:5, r:10, xp:1, ring:'#6b6b6b'}, grunt:{hp:12, sp:82, dmg:7, r:13, xp:1, ring:'#8a6a3a'}, tank:{hp:42, sp:46, dmg:12, r:17, xp:3, ring:'#5b6b4a', slow:1},
  fast:{hp:16, sp:140, dmg:9, r:13, xp:2, ring:'#7a3f8c'}, shooter:{hp:18, sp:72, dmg:8, r:14, xp:3, ring:'#3a6ea8', beh:'shoot'}, charger:{hp:36, sp:70, dmg:16, r:16, xp:4, ring:'#a83a2a', beh:'charge'},
  splitter:{hp:30, sp:56, dmg:10, r:17, xp:2, ring:'#4a8a4a', beh:'split'}, elite:{hp:320, sp:62, dmg:20, r:26, xp:20, ring:'#d9ac4e', elite:1},
  boss1:{hp:2600, sp:72, dmg:26, r:42, xp:60, ring:'#e0603a', boss:1, beh:'boss'}, boss2:{hp:6500, sp:64, dmg:36, r:52, xp:150, ring:'#e0603a', boss:1, beh:'boss'}
};
const SVW2 = {
  bolt:{n:'Relâmpago', card:'Lightning Bolt', c:'R', t:'Mágica Instantânea', d:'Raios atingem os inimigos mais próximos.', mtg:'Lightning Bolt (1993): 3 de dano por uma mana vermelha.', cd:[1.1,1,.9,.8,.65], dmg:[14,17,20,24,28], q:[1,1,2,2,3]},
  lance:{n:'Lança de Luz', card:'Swords to Plowshares', c:'W', t:'Mágica Instantânea', d:'Lanças atravessam inimigos na direção em que você anda.', mtg:'Swords to Plowshares (1993): a remoção branca mais eficiente: exila uma criatura por uma mana.', cd:[1,.9,.8,.7,.6], dmg:[12,14,17,20,24], q:[1,1,2,2,3], pierce:[2,3,3,4,5]},
  orbs:{n:'Orbes Arcanos', card:'Counterspell', c:'U', t:'Encantamento', d:'Orbes giram ao seu redor ferindo quem tocam.', mtg:'Counterspell (1993): UU para anular qualquer mágica. O símbolo do azul.', dmg:[9,11,13,16,19], q:[2,3,3,4,5], rad:[60,66,72,80,90]},
  aura:{n:'Drenar Vida', card:'Drain Life', c:'B', t:'Encantamento', d:'Uma aura fere tudo ao redor e devolve vida.', mtg:'Drain Life (1993): causa dano e você ganha a mesma quantidade de vida.', dmg:[12,15,18,22,27], rad:[58,66,76,88,100]},
  wolves:{n:'Fichas de Lobo', card:'Howl of the Night Pack', c:'G', t:'Feitiço', d:'Lobos 2/2 caçam os inimigos para você.', mtg:'Fichas são criaturas criadas por efeitos de cartas. Howl of the Night Pack cria um lobo para cada Floresta.', dmg:[10,12,14,17,21], q:[1,2,2,3,4]},
  fire:{n:'Bola de Fogo', card:'Fireball', c:'R', t:'Feitiço', d:'Bolas de fogo explodem em grupos de inimigos.', mtg:'Fireball (1993): o primeiro feitiço com X no custo: quanto mais mana, mais dano.', cd:[2.3,2,1.8,1.6,1.35], dmg:[24,28,33,39,46], rad:[48,56,64,74,86]},
  wrath:{n:'Ira de Deus', card:'Wrath of God', c:'W', t:'Feitiço', d:'De tempos em tempos destrói as criaturas da tela (chefes só sofrem dano).', mtg:'Wrath of God (1993): "Destrua todas as criaturas." A remoção em massa mais famosa.', cd:[24,21,18,15,12], dmg:[70,90,110,140,170]}
};
const SVP2 = {
  impeto:{n:'Ímpeto', en:'Haste', card:'Lightning Greaves', d:'+10% de velocidade.', mtg:'Criaturas com Ímpeto atacam no turno em que entram.'},
  vinculo:{n:'Vínculo com a Vida', en:'Lifelink', card:'Spirit Link', d:'Recupere 3% do dano que causar.', mtg:'O dano de uma criatura com Vínculo com a Vida faz você ganhar essa vida.'},
  atropelar:{n:'Atropelar', en:'Trample', card:'Rancor', d:'Projéteis atravessam +1 inimigo.', mtg:'O dano que sobra do bloqueador passa para o jogador.'},
  alcance:{n:'Alcance', en:'Reach', card:'Giant Spider', d:'+12% de área.', mtg:'Criaturas com Alcance bloqueiam criaturas que voam.'},
  iniciativa:{n:'Iniciativa', en:'First strike', card:'Fencing Ace', d:'Recarga 8% mais rápida.', mtg:'Quem tem Iniciativa causa dano de combate primeiro.'},
  vigilancia:{n:'Vigilância', en:'Vigilance', card:'Serra Angel', d:'-1 de dano em cada golpe recebido.', mtg:'Criaturas com Vigilância atacam sem virar.'},
  toque:{n:'Toque Mortífero', en:'Deathtouch', card:'Ambush Viper', d:'4% de chance de destruir na hora (exceto chefes).', mtg:'Qualquer dano de quem tem Toque Mortífero destrói.'},
  crescimento:{n:'Crescimento Gigante', en:'Giant Growth', card:'Giant Growth', d:'+12% de dano.', mtg:'Giant Growth (1993): +3/+3 até o fim do turno.'},
  terreno:{n:'Terreno Extra', en:'Land', card:'Rampant Growth', d:'+20 de vida máxima e cura completa.', mtg:'Você pode jogar um terreno por turno. Mais terrenos, mais mana.'},
  compra:{n:'Compra de Cartas', en:'Card draw', card:'Ancestral Recall', d:'Atrai mana de mais longe (+30%).', mtg:'Ancestral Recall (1993): compre três cartas por uma mana. Parte da Power Nine.'},
  voar:{n:'Voar', en:'Flying', card:'Levitation', d:'Após um golpe, criaturas lentas não te tocam por 0,6 s.', mtg:'Criaturas que voam só são bloqueadas por quem voa ou tem Alcance.'}
};
const SV_EVO = {
  bolt:{p:'atropelar', n:'Chain Lightning', card:'Chain Lightning', d:'O raio salta entre até 6 inimigos.', mtg:'Chain Lightning (Legends, 1994): 3 de dano que pode ser "copiado" pelo oponente. Um clássico do vermelho.'},
  fire:{p:'alcance', n:'Bonfire of the Damned', card:'Bonfire of the Damned', d:'Fogueiras gigantes caem sobre vários grupos.', mtg:'Bonfire of the Damned (2012): com "milagre", causa dano a todas as criaturas do oponente.'},
  lance:{p:'voar', n:'Baneslayer Angel', card:'Baneslayer Angel', d:'Um anjo gira ao seu redor e dispara lanças em oito direções.', mtg:'Baneslayer Angel (2009): 5/5 com Voar, Iniciativa e Vínculo com a Vida. Rainha do Padrão.'},
  orbs:{p:'vigilancia', n:'Force of Will', card:'Force of Will', d:'Seis orbes enormes que também destroem projéteis inimigos.', mtg:'Force of Will (1996): anula uma mágica sem pagar mana. Uma das cartas mais icônicas do Legacy.'},
  aura:{p:'vinculo', n:'Exsanguinate', card:'Exsanguinate', d:'Aura enorme que drena e cura muito mais.', mtg:'Exsanguinate (2010): cada oponente perde X de vida e você ganha a vida perdida.'},
  wolves:{p:'crescimento', n:'Craterhoof Behemoth', card:'Craterhoof Behemoth', d:'Debandadas de feras atravessam a tela.', mtg:'Craterhoof Behemoth (2012): dá +X/+X e Atropelar a todas as suas criaturas. Termina jogos.'},
  wrath:{p:'terreno', n:'Planar Cleansing', card:'Planar Cleansing', d:'Limpa a tela com mais frequência, destrói projéteis e cura.', mtg:'Planar Cleansing (2013): destrói todas as permanentes que não sejam terrenos.'}
};
const SV_PW = {
  W:{n:'Planeswalker Branco', art:'Serra Angel', w:'lance', bonus:'+20 de vida.', ult:'Ira Celestial', ultD:'Fere toda a tela, cura 50% e fica invulnerável por 3 s.'},
  U:{n:'Planeswalker Azul', art:'Prodigal Sorcerer', w:'orbs', bonus:'Atrai mana de mais longe.', ult:'Tempo Congelado', ultD:'Congela todos os inimigos por 5 s; eles sofrem dano dobrado.'},
  B:{n:'Planeswalker Preto', art:'Sengir Vampire', w:'aura', bonus:'Recupera vida ao causar dano.', ult:'Ceifar', ultD:'Destrói metade das criaturas da tela e cura por cada uma.'},
  R:{n:'Planeswalker Vermelho', art:'Ball Lightning', w:'bolt', bonus:'+10% de dano.', ult:'Chuva de Fogo', ultD:'30 meteoros caem ao seu redor em 3 s.'},
  G:{n:'Planeswalker Verde', art:'Llanowar Elves', w:'wolves', bonus:'+10% de velocidade.', ult:'Debandada', ultD:'Uma manada atravessa a tela esmagando tudo.'}
};
const SVCOL2 = {W:'#f1e7c0', U:'#4a95d6', B:'#9a7fb0', R:'#e0603a', G:'#4cae6b', C:'#c9c3b5'};
const SV_SHOP = {
  vida:{n:'Vida', d:'+10 de vida máxima por nível.', max:5, base:40},
  poder:{n:'Poder', d:'+5% de dano por nível.', max:5, base:60},
  veloc:{n:'Velocidade', d:'+4% de velocidade por nível.', max:5, base:50},
  recarga:{n:'Recarga', d:'-4% no tempo das mágicas por nível.', max:5, base:70},
  ima:{n:'Ímã', d:'+15% de alcance para atrair mana.', max:5, base:30},
  sorte:{n:'Sorte', d:'Boosters com raridade melhor e chance de 4 cartas para escolher.', max:5, base:80},
  reviver:{n:'Segunda chance', d:'Volte com metade da vida uma vez por partida.', max:1, base:400},
  ganancia:{n:'Ganância', d:'+10% de Centelha por nível.', max:5, base:60}
};
const SV_MODS = [['rapidos','Inimigos 25% mais rápidos'],['dobro','O dobro de inimigos e o dobro de mana'],['fragil','Metade da vida, mas cura em dobro'],['chefes','Chefes chegam mais cedo'],['monocor','Só aparecem mágicas da cor do seu planeswalker']];

/* ---------- arte das cartas ---------- */
const SVARTKEY = 'academiaPlaneswalker.svart.v1';
let SVART = (()=>{ try { return JSON.parse(localStorage.getItem(SVARTKEY)) || {}; } catch(e){ return {}; } })();
const SVIMG = {};
function svArtNames(){
  const s = new Set();
  Object.values(SV_PLANES).forEach(P => { s.add(P.land); Object.values(P.T).forEach(t => s.add(t[1])); });
  Object.values(SVW2).forEach(w => s.add(w.card)); Object.values(SVP2).forEach(p => s.add(p.card)); Object.values(SV_EVO).forEach(e => s.add(e.card)); Object.values(SV_PW).forEach(p => s.add(p.art));
  return [...s];
}
let svArtP = null;
function svLoadArt(){
  const names = svArtNames(), miss = names.filter(n => SVART[n] === undefined);
  const loadImgs = () => names.forEach(n => { if (SVART[n] && !SVIMG[n]) { const im = new Image(); im.decoding = 'async'; im.onload = () => { SVIMG[n] = im; svSprites = {}; }; im.src = SVART[n]; } });
  if (!miss.length) { loadImgs(); return Promise.resolve(); }
  if (svArtP) return svArtP;
  const chunks = []; for (let i = 0; i < miss.length; i += 75) chunks.push(miss.slice(i, i + 75));
  svArtP = Promise.all(chunks.map(ch => fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: ch.map(name => ({name}))})})
    .then(r => r.ok ? r.json() : null).then(j => { if (!j) return; (j.data||[]).forEach(c => { const u = (c.image_uris && c.image_uris.art_crop) || (c.card_faces && c.card_faces[0].image_uris && c.card_faces[0].image_uris.art_crop); const nm = ch.find(n => n.toLowerCase() === c.name.toLowerCase() || (c.card_faces && c.card_faces[0].name.toLowerCase() === n.toLowerCase())) || c.name; if (u) SVART[nm] = u; }); ch.forEach(n => { if (SVART[n] === undefined) SVART[n] = ''; }); })))
    .then(() => { try { localStorage.setItem(SVARTKEY, JSON.stringify(SVART)); } catch(e){} loadImgs(); }).catch(() => { svArtP = null; });
  return svArtP;
}
const svArtURL = n => SVART[n] || '';

/* ---------- som (gerado pelo navegador) ---------- */
const SVA = {ctx:null, on:true, last:{}, music:null, master:null};
function svAudioInit(){
  SVA.on = S.svSound !== false;
  if (SVA.ctx) return; try { SVA.ctx = new (window.AudioContext || window.webkitAudioContext)(); SVA.master = SVA.ctx.createGain(); SVA.master.gain.value = .5; SVA.master.connect(SVA.ctx.destination); } catch(e) {}
}
function svTone(f, d, type, vol, slide, delay){
  const A = SVA; if (!A.ctx || !A.on) return; const t = A.ctx.currentTime + (delay || 0);
  const o = A.ctx.createOscillator(), g = A.ctx.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + d);
  g.gain.setValueAtTime(vol || .1, t); g.gain.exponentialRampToValueAtTime(.0005, t + d); o.connect(g); g.connect(A.master); o.start(t); o.stop(t + d + .02);
}
function svNoise(d, vol, freq){
  const A = SVA; if (!A.ctx || !A.on) return; const t = A.ctx.currentTime, n = A.ctx.sampleRate * d, b = A.ctx.createBuffer(1, n, A.ctx.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = A.ctx.createBufferSource(); s.buffer = b; const f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq || 1200; const g = A.ctx.createGain(); g.gain.value = vol || .15;
  s.connect(f); f.connect(g); g.connect(A.master); s.start(t);
}
function svSfx(k){
  const now = performance.now(), gap = {hit:60, gem:45, bolt:90, lance:90, fire:150, kill:50}[k] || 0;
  if (gap && now - (SVA.last[k] || 0) < gap) return; SVA.last[k] = now;
  switch (k) {
    case 'bolt': svNoise(.12, .1, 4000); svTone(900, .12, 'sawtooth', .04, 200); break;
    case 'lance': svTone(1200, .1, 'triangle', .05, 600); break;
    case 'fire': svTone(160, .25, 'sawtooth', .06, 60); svNoise(.3, .12, 600); break;
    case 'boom': svNoise(.45, .22, 500); svTone(90, .4, 'sine', .15, 40); break;
    case 'hit': svTone(320, .05, 'square', .02, 200); break;
    case 'kill': svTone(520, .06, 'triangle', .03, 900); break;
    case 'gem': svTone(1300 + Math.random() * 300, .06, 'sine', .035); break;
    case 'hurt': svTone(140, .18, 'square', .07, 70); break;
    case 'level': [523, 659, 784, 1047].forEach((f, i) => svTone(f, .18, 'triangle', .07, null, i * .07)); break;
    case 'boss': svTone(70, 1.4, 'sawtooth', .12, 55); svTone(105, 1.4, 'sawtooth', .07, 80); break;
    case 'ult': svNoise(.8, .2, 2500); [392, 523, 659, 784, 1047].forEach((f, i) => svTone(f, .3, 'sawtooth', .05, null, i * .05)); break;
    case 'pack': [660, 880, 1320].forEach((f, i) => svTone(f, .2, 'triangle', .06, null, i * .09)); break;
    case 'myth': [784, 988, 1175, 1568].forEach((f, i) => svTone(f, .35, 'sine', .07, null, i * .08)); break;
    case 'evo': [262, 330, 392, 523, 659, 784].forEach((f, i) => svTone(f, .4, 'triangle', .06, null, i * .06)); break;
    case 'die': svTone(300, 1, 'sawtooth', .1, 40); break;
    case 'win': [523, 659, 784, 659, 784, 1047].forEach((f, i) => svTone(f, .3, 'triangle', .08, null, i * .14)); break;
  }
}
const SV_SCALES = {dominaria:[0,2,4,7,9], innistrad:[0,3,5,7,10], ravnica:[0,2,3,7,8], zendikar:[0,1,5,6,10]};
function svMusicStart(plane){
  svMusicStop(); const A = SVA; if (!A.ctx || !A.on || S.svMusic === false) return;
  const sc = SV_SCALES[plane] || SV_SCALES.dominaria, root = plane === 'innistrad' ? 110 : plane === 'zendikar' ? 98 : 130.8; let step = 0;
  A.music = setInterval(() => { if (!sv || sv.paused || sv.over || !A.on) return; const t = A.ctx.currentTime;
    if (step % 8 === 0) svTone(root / 2, 1.9, 'sine', .05);
    const n = sc[[0,2,4,1,3,2,4,0][step % 8]] + (step % 16 >= 8 ? 12 : 0); svTone(root * 2 * Math.pow(2, n / 12), .22, 'triangle', .022);
    if (sv.en.some(e => e.boss)) svTone(root, .2, 'sawtooth', .015);
    step++; }, 240);
}
function svMusicStop(){ if (SVA.music) { clearInterval(SVA.music); SVA.music = null; } }

/* ---------- aleatório com semente (desafio do dia) ---------- */
function svRng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let svR = Math.random;
const svToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function svDaily(){
  const key = svToday(); let h = 0; for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 2654435761); const r = svRng(h);
  return {key, plane: SV_PLANE_ORDER[Math.floor(r() * 4)], col: 'WUBRG'[Math.floor(r() * 5)], mod: SV_MODS[Math.floor(r() * SV_MODS.length)], seed: h};
}
const svMeta = () => (S.survMeta = S.survMeta || {cen:0, up:{}, planes:{dominaria:1}, best:{}, evo:{}, daily:{}});

/* ---------- tela de início ---------- */
let svSel = {plane:'dominaria', col:'R', view:'main'};
function svImg(n, cls){ const u = svArtURL(n); return u ? `<img class="${cls||''}" src="${esc(u)}" alt="" loading="lazy" decoding="async">` : ''; }
function renderSurv(box){
  box = box || $('#trBody'); const M = svMeta();
  if (!svArtP && svArtNames().some(n => SVART[n] === undefined)) svLoadArt().then(() => { if (currentView === 'treino' && trTab === 'surv' && $('.sv2-intro')) renderSurv(); });
  if (svSel.view === 'shop') return svShopView(box);
  const D = svDaily(), dd = M.daily[D.key];
  box.innerHTML = `<div class="sv2-intro">
    <div class="sv2-hero">${svImg(SV_PLANES[svSel.plane].land, 'sv2-hero-bg')}<div class="sv2-hero-in"><span class="sv2-tag">Jogo de ação</span><h2>Sobreviva ao Multiverso</h2><p>Suas mágicas disparam sozinhas. Desvie, colete mana, abra boosters, evolua suas mágicas em cartas lendárias e derrote os chefes de cada plano.</p>
      <div class="row-h"><button class="btn primary sv2-play" id="svGo">Jogar em ${SV_PLANES[svSel.plane].n}</button><button class="btn" id="svDaily">Desafio do dia${dd ? ` · ${svFmt(dd)}` : ''}</button><button class="btn" id="svShop">Loja da Centelha · ✦ ${M.cen}</button></div></div></div>
    <span class="eyebrow">Escolha o plano</span>
    <div class="sv2-planes">${SV_PLANE_ORDER.map((k,i) => { const P = SV_PLANES[k], open = M.planes[k], b = M.best[k]; return `<button class="sv2-plane ${open ? '' : 'locked'}" data-svpl="${k}" aria-pressed="${svSel.plane===k}" ${open ? '' : 'disabled'}>${svImg(P.land, 'sv2-pbg')}<span class="sv2-pin"><b>${P.n}</b><small>${open ? P.d : `Bloqueado: sobreviva 10 minutos em ${SV_PLANES[SV_PLANE_ORDER[i-1]].n}.`}</small>${b ? `<small class="sv2-best">Recorde: ${svFmt(b.t)}${b.won ? ' · vencido' : ''}</small>` : ''}</span></button>`; }).join('')}</div>
    <span class="eyebrow">Escolha seu planeswalker</span>
    <div class="sv2-pws">${'WUBRG'.split('').map(c => { const P = SV_PW[c]; return `<button class="sv2-pw" data-svc="${c}" aria-pressed="${svSel.col===c}" style="--pc:${SVCOL2[c]}"><span class="sv2-port">${svImg(P.art)}${manaSym(c)}</span><b>${P.n}</b><small>${SVW2[P.w].n} · ${P.bonus}</small><small class="sv2-ult">Lealdade: <b>${P.ult}</b>. ${P.ultD}</small></button>`; }).join('')}</div>
    <details class="sv2-help"><summary>Como jogar</summary><ul>
      <li><b>Mover:</b> no PC, setas ou W A S D; no celular, arraste o dedo em qualquer lugar da tela.</li>
      <li><b>Lealdade:</b> derrote criaturas para carregar e toque no botão dourado (ou Espaço) para usar o poder do seu planeswalker.</li>
      <li><b>Evoluções:</b> leve uma mágica ao nível 5 e tenha a habilidade certa: ela evolui numa carta lendária (Chain Lightning, Force of Will, Craterhoof…). Veja o Grimório na pausa.</li>
      <li><b>Boosters:</b> criaturas de elite e chefes deixam boosters. Abra para ganhar cartas comuns, incomuns, raras ou míticas.</li>
      <li><b>Lanternas:</b> quebre para achar Elixir (vida), Ímã (atrai toda a mana) ou Ira (limpa a tela).</li>
      <li><b>Centelha:</b> ganha a cada partida; gaste na Loja em melhorias permanentes.</li></ul></details>
    <p class="muted" style="font-size:.8rem;margin:0">Ilustrações das cartas: Scryfall. Magic: The Gathering © Wizards of the Coast.</p></div>`;
  $$('[data-svpl]').forEach(b => b.onclick = () => { svSel.plane = b.dataset.svpl; renderSurv(box); });
  $$('[data-svc]').forEach(b => b.onclick = () => { svSel.col = b.dataset.svc; $$('[data-svc]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#svGo').onclick = () => svStart({plane:svSel.plane, col:svSel.col});
  $('#svDaily').onclick = () => svStart({plane:D.plane, col:D.col, daily:D});
  $('#svShop').onclick = () => { svSel.view = 'shop'; renderSurv(box); };
}
function svShopView(box){
  const M = svMeta(); const cost = (k) => Math.round(SV_SHOP[k].base * Math.pow(1.6, M.up[k] || 0));
  box.innerHTML = `<div class="panel stack-v"><h3>Loja da Centelha</h3>
    <p class="muted" style="margin:0">A Centelha (✦) é ganha em cada partida: tempo sobrevivido, criaturas e chefes derrotados. Gaste em melhorias que valem para todas as partidas.</p>
    <div class="row-h"><span class="pill good" style="font-size:1rem">✦ ${M.cen} de Centelha</span><button class="btn small" id="svBack">← Voltar</button></div>
    <div class="sv2-shop">${Object.entries(SV_SHOP).map(([k,u]) => { const l = M.up[k] || 0, mx = l >= u.max, c = cost(k); return `<div class="sv2-up"><b>${u.n}</b><small>${u.d}</small><span class="sv2-pips">${Array.from({length:u.max}, (_,i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</span><button class="btn small ${mx ? '' : 'primary'}" data-svbuy="${k}" ${mx || M.cen < c ? 'disabled' : ''}>${mx ? 'Máximo' : `Comprar · ✦ ${c}`}</button></div>`; }).join('')}</div></div>`;
  $('#svBack').onclick = () => { svSel.view = 'main'; renderSurv(box); };
  $$('[data-svbuy]').forEach(b => b.onclick = () => { const k = b.dataset.svbuy, c = cost(k); if (M.cen < c) return; M.cen -= c; M.up[k] = (M.up[k] || 0) + 1; save(); svShopView(box); });
}
const svFmt = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;

/* ---------- estado ---------- */
let sv = null, svRaf = 0, svSprites = {};
function svStats(){
  const P = sv.pas, l = k => P[k] || 0, c = sv.col, U = svMeta().up, u = k => U[k] || 0;
  return {sp: 168 * (1 + .1 * l('impeto') + .04 * u('veloc') + (c === 'G' ? .1 : 0)), dmg: (1 + .12 * l('crescimento') + .05 * u('poder') + (c === 'R' ? .1 : 0)) * (sv.frozen > 0 ? 2 : 1), cd: Math.pow(.92, l('iniciativa')) * Math.pow(.96, u('recarga')),
    area: 1 + .12 * l('alcance'), pierce: l('atropelar'), armor: l('vigilancia'), crit: .04 * l('toque'), life: (.03 * l('vinculo') + (c === 'B' ? .02 : 0)) * (sv.mod === 'fragil' ? 2 : 1), mag: 75 * (1 + .3 * l('compra') + .15 * u('ima') + (c === 'U' ? .3 : 0)), fly: l('voar')};
}
function svNew(o){
  const lite = !!S.lite, M = svMeta(), mod = o.daily ? o.daily.mod[0] : null;
  svR = o.daily ? svRng(o.daily.seed) : Math.random;
  const maxHp = Math.round((100 + (o.col === 'W' ? 20 : 0) + 10 * (M.up.vida || 0)) * (mod === 'fragil' ? .5 : 1));
  sv = {plane:o.plane, P:SV_PLANES[o.plane], col:o.col, daily:o.daily || null, mod, t:0, kills:0, lvl:1, xp:0, need:6, over:false, paused:false, choosing:null, endless:false, won:false,
    p:{x:0, y:0, hp:maxHp, max:maxHp, inv:0, dx:1, dy:0, flyT:0}, w:{}, evo:{}, pas:{}, en:[], pr:[], orbs:[], fx:[], parts:[], txt:[], wolves:[], items:[], lamps:[], beasts:[],
    spawn:0, nextElite:65, b1: mod === 'chefes' ? 200 : 300, b2: mod === 'chefes' ? 450 : 510, b1done:false, b2done:false, lamp:8,
    loyal:0, frozen:0, inv2:0, shake:0, flash:0, revive: (M.up.reviver || 0) > 0, bosses:0, packs:0, lite, maxEn: lite ? 140 : 240, maxParts: lite ? 90 : 320, keys:{}, joy:null, lastT:0, amb:[]};
  sv.w[SV_PW[o.col].w] = {l:1, t:0};
  for (let i = 0; i < (lite ? 0 : 26); i++) sv.amb.push({x:Math.random(), y:Math.random(), s:.3 + Math.random() * .7, ph:Math.random() * 6});
  sv.st = svStats();
}
/* ---------- sprites pré-renderizados ---------- */
function svSprite(key, r, art, ring, opts){
  const k = key + '|' + r; if (svSprites[k]) return svSprites[k];
  const pad = 6, sz = Math.ceil(r * 2 + pad * 2), c = document.createElement('canvas'); c.width = c.height = sz; const x = c.getContext('2d'), m = sz / 2;
  x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(m, m + r * .85, r * .9, r * .3, 0, 0, 6.283); x.fill();
  const im = art && SVIMG[art];
  x.save(); x.beginPath(); x.arc(m, m, r, 0, 6.283); x.clip();
  if (im) { const s = Math.max(r * 2 / im.width, r * 2 / im.height) * 1.15; x.drawImage(im, m - im.width * s / 2, m - im.height * s / 2, im.width * s, im.height * s); }
  else { const g = x.createRadialGradient(m - r * .3, m - r * .3, r * .1, m, m, r); g.addColorStop(0, '#fff8'); g.addColorStop(1, ring); x.fillStyle = g; x.fillRect(0, 0, sz, sz); x.fillStyle = '#0006'; x.font = `bold ${Math.round(r)}px Georgia`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(((opts && opts.letter) || '?').slice(0, 1), m, m + 1); }
  const v = x.createRadialGradient(m, m, r * .55, m, m, r); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = v; x.fillRect(0, 0, sz, sz);
  x.restore();
  x.lineWidth = Math.max(2.5, r * .14); x.strokeStyle = '#120d08'; x.beginPath(); x.arc(m, m, r, 0, 6.283); x.stroke();
  x.lineWidth = Math.max(1.5, r * .08); x.strokeStyle = ring; x.beginPath(); x.arc(m, m, r - x.lineWidth, 0, 6.283); x.stroke();
  return svSprites[k] = c;
}
let svGlowC = {};
function svGlow(col, r){ const k = col + r; if (svGlowC[k]) return svGlowC[k]; const c = document.createElement('canvas'); c.width = c.height = r * 2; const x = c.getContext('2d'), g = x.createRadialGradient(r, r, 0, r, r, r); g.addColorStop(0, col); g.addColorStop(.35, col.replace(/[\d.]+\)$/, '.35)')); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, r * 2, r * 2); return svGlowC[k] = c; }
let svGemC = {};
function svGem(c){ if (svGemC[c]) return svGemC[c]; const s = 22, cv = document.createElement('canvas'); cv.width = cv.height = s; const x = cv.getContext('2d'), m = s / 2;
  const g = x.createRadialGradient(m - 2, m - 2, 1, m, m, 8); g.addColorStop(0, '#fff'); g.addColorStop(.4, SVCOL2[c]); g.addColorStop(1, '#0008'); x.fillStyle = g; x.beginPath(); x.moveTo(m, 2); x.lineTo(s - 4, m); x.lineTo(m, s - 2); x.lineTo(4, m); x.closePath(); x.fill(); x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = 1.2; x.stroke(); return svGemC[c] = cv; }
let svGround = {};
function svGroundPat(ctx, P){
  if (svGround[sv.plane]) return svGround[sv.plane]; const s = 384, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'); const r = svRng(sv.plane.length * 9973);
  x.fillStyle = P.g1; x.fillRect(0, 0, s, s);
  for (let i = 0; i < 900; i++) { x.fillStyle = r() < .5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.08)'; x.fillRect(r() * s, r() * s, 1 + r() * 3, 1 + r() * 3); }
  for (let i = 0; i < 10; i++) { const g = x.createRadialGradient(r() * s, r() * s, 0, 0, 0, 0); x.fillStyle = P.g2; x.globalAlpha = .5; x.beginPath(); x.ellipse(r() * s, r() * s, 20 + r() * 60, 10 + r() * 30, r() * 3, 0, 6.283); x.fill(); x.globalAlpha = 1; }
  if (P.deco === 'grass') for (let i = 0; i < 60; i++) { const px = r() * s, py = r() * s; x.strokeStyle = r() < .5 ? '#3d5a2c' : '#2f4a22'; x.lineWidth = 1.3; for (let j = 0; j < 4; j++) { x.beginPath(); x.moveTo(px + j * 2, py); x.quadraticCurveTo(px + j * 2 - 2, py - 5, px + j * 2 + (r() - .5) * 4, py - 7 - r() * 4); x.stroke(); } }
  if (P.deco === 'grass') for (let i = 0; i < 8; i++) { x.fillStyle = '#4b4a43'; x.beginPath(); x.ellipse(r() * s, r() * s, 5 + r() * 8, 3 + r() * 5, 0, 0, 6.283); x.fill(); }
  if (P.deco === 'graves') for (let i = 0; i < 9; i++) { const px = r() * s, py = r() * s; x.fillStyle = '#2b2a35'; x.beginPath(); x.moveTo(px - 8, py + 10); x.lineTo(px - 8, py - 4); x.arc(px, py - 4, 8, Math.PI, 0); x.lineTo(px + 8, py + 10); x.fill(); x.fillStyle = '#3a3946'; x.fillRect(px - 1, py - 6, 2, 9); x.fillRect(px - 4, py - 3, 8, 2); }
  if (P.deco === 'cobble') { x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; for (let yy = 0; yy < s; yy += 24) for (let xx = (yy / 24 % 2) * 18; xx < s; xx += 36) { x.strokeRect(xx + 1, yy + 1, 34, 22); x.fillStyle = `rgba(255,255,255,${.015 + r() * .03})`; x.fillRect(xx + 2, yy + 2, 32, 20); } }
  if (P.deco === 'hedrons') for (let i = 0; i < 7; i++) { const px = r() * s, py = r() * s, w = 10 + r() * 12; x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(px, py + w, w, w * .35, 0, 0, 6.283); x.fill(); x.fillStyle = '#8a7a5e'; x.beginPath(); x.moveTo(px, py - w); x.lineTo(px + w * .5, py); x.lineTo(px, py + w * .6); x.lineTo(px - w * .5, py); x.closePath(); x.fill(); x.strokeStyle = '#d9c9a0'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py - w); x.lineTo(px, py + w * .6); x.stroke(); }
  return svGround[sv.plane] = ctx.createPattern(c, 'repeat');
}
let svVig = null;
function svVignette(W, H){ if (svVig && svVig.w === W && svVig.h === H) return svVig.c; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), g = x.createRadialGradient(W/2, H/2, Math.min(W, H) * .3, W/2, H/2, Math.max(W, H) * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)'); x.fillStyle = g; x.fillRect(0, 0, W, H); svVig = {w:W, h:H, c}; return c; }

/* ---------- iniciar e encerrar ---------- */
function svStart(o){
  svAudioInit(); svLoadArt(); svNew(o);
  let ov = $('#surv'); if (!ov) { ov = document.createElement('div'); ov.id = 'surv'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.style.overflow = 'hidden';
  ov.innerHTML = `<canvas id="svCv" aria-label="Jogo Sobreviva ao Multiverso"></canvas>
    <div class="sv-hud"><div class="sv-bars"><div class="sv-hp"><i id="svHp"></i><span id="svHpT"></span></div><div class="sv-xp"><i id="svXp"></i></div></div>
      <div class="sv-mid"><span class="sv-t" id="svT">0:00</span><small id="svPl">${sv.P.n}${sv.daily ? ' · Desafio do dia' : ''}</small></div><span class="sv-k" id="svK">0</span><span class="sv-l" id="svL">Nv 1</span>
      <button class="sv-btn" id="svSnd" aria-label="Som">${SVA.on ? '♪' : '×'}</button><button class="sv-btn" id="svPause" aria-label="Pausar">II</button></div>
    <div class="sv-w" id="svW"></div>
    <button class="sv-ult" id="svUlt" aria-label="Usar lealdade" disabled><span class="sv-ult-r" id="svUltR"></span><b>${SV_PW[sv.col].ult}</b><small>Lealdade</small></button>
    <div class="sv-ov" id="svOv" hidden></div>`;
  sv.cv = $('#svCv'); sv.ctx = sv.cv.getContext('2d'); svResize(); svBindInput();
  $('#svPause').onclick = () => svPause(true);
  $('#svSnd').onclick = () => { SVA.on = !SVA.on; S.svSound = SVA.on; save(); $('#svSnd').textContent = SVA.on ? '♪' : '×'; if (SVA.on) svMusicStart(sv.plane); else svMusicStop(); };
  $('#svUlt').onclick = svUlt;
  svMusicStart(sv.plane); svDrawW();
  if (sv.daily) svBanner(`Desafio do dia: ${sv.daily.mod[1]}`, 3.5); else svBanner(sv.P.n, 2.2);
  sv.lastT = performance.now(); cancelAnimationFrame(svRaf); svRaf = requestAnimationFrame(svLoop);
}
function svResize(){ if (!sv || !sv.cv) return; const dpr = Math.min(sv.lite ? 1 : 1.75, devicePixelRatio || 1); sv.dpr = dpr; sv.W = innerWidth; sv.H = innerHeight; sv.cv.width = Math.round(sv.W * dpr); sv.cv.height = Math.round(sv.H * dpr); sv.cv.style.width = sv.W + 'px'; sv.cv.style.height = sv.H + 'px'; }
addEventListener('resize', () => svResize());
document.addEventListener('visibilitychange', () => { if (document.hidden && sv && !sv.over && !sv.paused && !sv.choosing) svPause(true); });
function svBindInput(){
  sv.onKey = e => { if (!sv) return; const d = e.type === 'keydown'; const m = {ArrowUp:'u', w:'u', W:'u', ArrowDown:'d', s:'d', S:'d', ArrowLeft:'l', a:'l', A:'l', ArrowRight:'r', d:'r', D:'r'}[e.key];
    if (m) { sv.keys[m] = d; e.preventDefault(); }
    if (!d) return;
    if ((e.key === ' ' || e.key === 'e' || e.key === 'E') && !sv.choosing && !sv.paused) { e.preventDefault(); svUlt(); }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { if (!sv.choosing && !sv.over) svPause(!sv.paused); }
    if (sv.choosing && /^[1-4]$/.test(e.key)) { const b = $$('[data-svu]')[+e.key - 1]; b && b.click(); } };
  addEventListener('keydown', sv.onKey); addEventListener('keyup', sv.onKey);
  const cv = sv.cv;
  cv.addEventListener('touchstart', e => { const t = e.changedTouches[0]; svJoyStart(t.clientX, t.clientY); e.preventDefault(); }, {passive:false});
  cv.addEventListener('touchmove', e => { const t = e.changedTouches[0]; svJoyMove(t.clientX, t.clientY); e.preventDefault(); }, {passive:false});
  cv.addEventListener('touchend', svJoyEnd); cv.addEventListener('touchcancel', svJoyEnd);
  cv.addEventListener('mousedown', e => svJoyStart(e.clientX, e.clientY));
}
function svJoyStart(x, y){ if (sv) sv.joy = {x0:x, y0:y, x, y}; }
function svJoyMove(x, y){ if (sv && sv.joy) { const dx = x - sv.joy.x0, dy = y - sv.joy.y0, l = Math.hypot(dx, dy); if (l > 70) { sv.joy.x0 = x - dx / l * 70; sv.joy.y0 = y - dy / l * 70; } sv.joy.x = x; sv.joy.y = y; } }
function svJoyEnd(){ if (sv) sv.joy = null; }
addEventListener('mousemove', e => svJoyMove(e.clientX, e.clientY)); addEventListener('mouseup', svJoyEnd);
function svClose(){
  cancelAnimationFrame(svRaf); svMusicStop(); const ov = $('#surv'); if (ov) { ov.hidden = true; ov.innerHTML = ''; } document.body.style.overflow = '';
  if (sv && sv.onKey) { removeEventListener('keydown', sv.onKey); removeEventListener('keyup', sv.onKey); }
  sv = null; svR = Math.random; if (currentView === 'treino' && trTab === 'surv') renderSurv();
}
function svPause(on){
  if (!sv || sv.over) return; sv.paused = on; const o = $('#svOv');
  if (!on) { o.hidden = true; sv.lastT = performance.now(); return; }
  const M = svMeta();
  o.hidden = false; o.innerHTML = `<div class="sv-box"><h2>Pausa</h2><p>${sv.P.n} · ${svFmt(sv.t)} · ${sv.kills} criaturas · nível ${sv.lvl}</p>
    <div class="sv-have">${svHaveHTML()}</div>
    <span class="eyebrow" style="color:#f3d68c">Grimório de evoluções</span>
    <div class="sv-grim">${Object.entries(SV_EVO).map(([w,E]) => { const known = M.evo[w]; return `<div class="sv-evo ${known ? 'ok' : ''}">${known ? svImg(E.card) : '<span class="sv-q">?</span>'}<div><b>${known ? E.n : '???'}</b><small>${SVW2[w].n} nível 5 + ${known || sv.w[w] ? SVP2[E.p].n : '???'}</small></div></div>`; }).join('')}</div>
    <div class="row-h" style="justify-content:center"><button class="btn primary" id="svRes">Continuar</button><button class="btn" id="svQuit">Sair do jogo</button></div></div>`;
  $('#svRes').onclick = () => svPause(false); $('#svQuit').onclick = () => svEnd(false, true); $('#svRes').focus();
}
function svHaveHTML(){ return Object.entries(sv.w).map(([k,w]) => `<span class="pill" style="border:1px solid ${SVCOL2[SVW2[k].c]}">${sv.evo[k] ? SV_EVO[k].n : SVW2[k].n + ' ' + w.l}</span>`).join('') + Object.entries(sv.pas).map(([k,l]) => `<span class="pill">${SVP2[k].n} ${l}</span>`).join(''); }
function svDrawW(){ const el = $('#svW'); if (!el) return; el.innerHTML = Object.entries(sv.w).map(([k,w]) => { const ev = sv.evo[k], n = ev ? SV_EVO[k].card : SVW2[k].card; return `<span class="sv-ic ${ev ? 'evo' : ''}" style="--pc:${SVCOL2[SVW2[k].c]}" title="${ev ? SV_EVO[k].n : SVW2[k].n}">${svImg(n)}<b>${ev ? '★' : w.l}</b></span>`; }).join('') + Object.entries(sv.pas).map(([k,l]) => `<span class="sv-ic pas" title="${SVP2[k].n}">${svImg(SVP2[k].card)}<b>${l}</b></span>`).join(''); }
function svBanner(m, t){ sv.banner = {m, t: t || 2.2, T: t || 2.2}; }

/* ---------- laço ---------- */
function svLoop(now){
  if (!sv) return; const dt = Math.min(.05, (now - sv.lastT) / 1000); sv.lastT = now;
  if (!sv.paused && !sv.choosing && !sv.over) svUpdate(dt);
  else if (sv.choosing || sv.paused) { /* tela parada */ }
  svRender(dt); svRaf = requestAnimationFrame(svLoop);
}
function svPart(x, y, col, n, sp, life, size){ if (sv.parts.length > sv.maxParts) return; for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = sp * (.4 + Math.random() * .8); sv.parts.push({x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, t:life * (.6 + Math.random() * .6), T:life, c:col, s:size || 3}); } }
function svNearest(x, y, maxD, skip){ let best = null, bd = maxD * maxD; for (const e of sv.en) { if (e.dead || (skip && skip.has(e))) continue; const d = (e.x-x)*(e.x-x) + (e.y-y)*(e.y-y); if (d < bd) { bd = d; best = e; } } return best; }
function svHit(e, dmg, kx, ky, crit){
  if (e.dead) return; const st = sv.st; let c = crit;
  if (!e.boss && !e.elite && st.crit && svR() < st.crit) { dmg = e.hp; c = true; }
  e.hp -= dmg; e.flash = .09;
  if (kx != null && !e.boss) { const kb = e.elite ? 2 : 7; e.x += kx * kb; e.y += ky * kb; }
  if (st.life) { const p = sv.p; p.hp = Math.min(p.max, p.hp + dmg * st.life); }
  if (sv.txt.length < (sv.lite ? 18 : 40)) sv.txt.push({x:e.x + (Math.random() - .5) * 10, y:e.y - e.r, v:Math.round(dmg), t:.7, c});
  svSfx('hit');
  if (e.hp <= 0) svKill(e);
}
function svKill(e){
  e.dead = true; sv.kills++; sv.loyal = Math.min(100, sv.loyal + (e.boss ? 25 : e.elite ? 8 : .9));
  const gc = 'WUBRG'[Math.floor(Math.random() * 5)], mult = sv.mod === 'dobro' ? 1 : 1;
  sv.orbs.push({x:e.x, y:e.y, v:e.xp * mult, c: e.boss || e.elite ? 'C' : (e.gc || gc), big: e.xp >= 10});
  svPart(e.x, e.y, e.ring, e.boss ? 60 : e.elite ? 26 : 9, e.boss ? 260 : 150, .55, e.boss ? 5 : 3);
  sv.fx.push({k:'soul', x:e.x, y:e.y, r:e.r, t:.35, T:.35});
  svSfx('kill');
  if (e.beh === 'split' && !e.child) for (let i = 0; i < 2; i++) svSpawnAt('splitter', e.x + (i ? 12 : -12), e.y, {child:1, r:e.r * .7, hp:e.max * .35});
  if (e.elite || e.boss) { sv.items.push({k:'pack', x:e.x, y:e.y, rar: e.boss ? 2 : 0}); sv.shake = Math.max(sv.shake, e.boss ? 18 : 6); }
  if (e.boss) { svSfx('boom'); sv.bosses++; svBanner(`${e.n} derrotado!`, 2.5); }
}
function svUpdate(dt){
  const p = sv.p, st = sv.st; sv.t += dt;
  let mx = (sv.keys.r ? 1 : 0) - (sv.keys.l ? 1 : 0), my = (sv.keys.d ? 1 : 0) - (sv.keys.u ? 1 : 0);
  if (sv.joy) { const jx = sv.joy.x - sv.joy.x0, jy = sv.joy.y - sv.joy.y0, jl = Math.hypot(jx, jy); if (jl > 6) { mx = jx / Math.max(jl, 40); my = jy / Math.max(jl, 40); } }
  const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; } if (ml > .05) { p.dx = mx / (ml || 1); p.dy = my / (ml || 1); }
  p.vx = mx * st.sp; p.vy = my * st.sp; p.x += p.vx * dt; p.y += p.vy * dt;
  p.inv = Math.max(0, p.inv - dt); p.flyT = Math.max(0, p.flyT - dt); sv.inv2 = Math.max(0, sv.inv2 - dt);
  if (sv.frozen > 0) { sv.frozen -= dt; if (sv.frozen <= 0) sv.st = svStats(); }
  // surgimento
  const T = sv.t, rate = (2.4 + T / 18) * (sv.mod === 'dobro' ? 2 : 1);
  sv.spawn += dt * rate;
  while (sv.spawn >= 1 && sv.en.length < sv.maxEn) { sv.spawn--; const k = svPickType(T); if (k === 'swarm') { const a = svR() * 6.283; for (let i = 0; i < 6; i++) svSpawn(k, a + (svR() - .5) * .3); } else svSpawn(k); }
  if (T >= sv.nextElite) { sv.nextElite += 70; svSpawn('elite'); }
  if (!sv.b1done && T >= sv.b1) { sv.b1done = true; svSpawn('boss1'); svBanner(`${sv.P.T.boss1[0]} chegou!`, 3); svSfx('boss'); sv.shake = 10; }
  if (!sv.b2done && T >= sv.b2) { sv.b2done = true; svSpawn('boss2'); svBanner(`${sv.P.T.boss2[0]} chegou!`, 3); svSfx('boss'); sv.shake = 14; }
  if (sv.endless && T >= sv.b2 + 120 * (sv.endlessN || 1)) { sv.endlessN = (sv.endlessN || 1) + 1; svSpawn(svR() < .5 ? 'boss1' : 'boss2'); svSfx('boss'); }
  if (!sv.won && !sv.endless && T >= 600) { svEnd(true); return; }
  // lanternas
  sv.lamp -= dt; if (sv.lamp <= 0 && sv.lamps.length < 5) { sv.lamp = 16 + svR() * 10; const a = svR() * 6.283, d = 260 + svR() * 200; sv.lamps.push({x:p.x + Math.cos(a) * d, y:p.y + Math.sin(a) * d, hp:1}); }
  // inimigos
  const frz = sv.frozen > 0, spdMul = (sv.mod === 'rapidos' ? 1.25 : 1);
  const grid = new Map(), cell = 48; for (const e of sv.en) { if (e.dead) continue; const key = ((e.x / cell) | 0) + ',' + ((e.y / cell) | 0); let a = grid.get(key); if (!a) grid.set(key, a = []); a.push(e); }
  for (const e of sv.en) {
    if (e.dead) continue; e.flash = Math.max(0, e.flash - dt); e.age = (e.age || 0) + dt;
    const dx = p.x - e.x, dy = p.y - e.y, dl = Math.hypot(dx, dy) || 1;
    if (!frz) {
      let sp = e.sp * spdMul, vx = dx / dl, vy = dy / dl;
      if (e.beh === 'shoot') { if (dl < 240) { vx = -vx; vy = -vy; sp *= .6; } else if (dl < 300) sp = 0; e.cd = (e.cd ?? 1.5 + svR()) - dt; if (e.cd <= 0 && dl < 520) { e.cd = 2.2; const a = Math.atan2(dy, dx); sv.pr.push({x:e.x, y:e.y, vx:Math.cos(a) * 200, vy:Math.sin(a) * 200, r:6, dmg:e.dmg, life:3.5, enemy:1, c:'#ff5a4a'}); } }
      else if (e.beh === 'charge') { e.st = e.st || 'walk'; if (e.st === 'walk' && dl < 320 && (e.cd = (e.cd || 0) - dt) <= 0) { e.st = 'wind'; e.wt = .7; e.cx = vx; e.cy = vy; } if (e.st === 'wind') { sp = 0; e.wt -= dt; if (e.wt <= 0) { e.st = 'dash'; e.wt = .55; } } if (e.st === 'dash') { sp = e.sp * 4.2; vx = e.cx; vy = e.cy; e.wt -= dt; if (e.wt <= 0) { e.st = 'walk'; e.cd = 2.5; } } }
      else if (e.beh === 'boss') { e.cd = (e.cd ?? 2) - dt; if (e.cd <= 0) { e.cd = 2.4; e.pat = ((e.pat || 0) + 1) % 3; const a0 = Math.atan2(dy, dx);
          if (e.pat === 0) for (let i = -3; i <= 3; i++) sv.pr.push({x:e.x, y:e.y, vx:Math.cos(a0 + i * .2) * 210, vy:Math.sin(a0 + i * .2) * 210, r:9, dmg:e.dmg * .55, life:4, enemy:1, c:'#ff7a3a'});
          else if (e.pat === 1) for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; sv.pr.push({x:e.x, y:e.y, vx:Math.cos(a) * 170, vy:Math.sin(a) * 170, r:8, dmg:e.dmg * .5, life:4.5, enemy:1, c:'#c86aff'}); }
          else { e.st = 'dash'; e.wt = .8; e.cx = dx / dl; e.cy = dy / dl; } }
        if (e.st === 'dash') { sp = e.sp * 3.2; vx = e.cx; vy = e.cy; e.wt -= dt; if (e.wt <= 0) e.st = null; } }
      // separação (não empilhar)
      let sx = 0, sy = 0; if (!e.boss) { const gx = (e.x / cell) | 0, gy = (e.y / cell) | 0; for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) { const a = grid.get((gx + ix) + ',' + (gy + iy)); if (!a) continue; for (const o of a) { if (o === e) continue; const ox = e.x - o.x, oy = e.y - o.y, d = ox*ox + oy*oy, rr = (e.r + o.r) * .9; if (d < rr * rr && d > .01) { const dd = Math.sqrt(d); sx += ox / dd * (rr - dd); sy += oy / dd * (rr - dd); } } } }
      e.x += vx * sp * dt + sx * .25; e.y += vy * sp * dt + sy * .25;
    }
    if (dl < e.r + 14 && p.inv <= 0 && sv.inv2 <= 0 && !(st.fly && e.slow && p.flyT > 0)) svHurt(Math.max(1, e.dmg - st.armor));
    if (sv.over) return;
  }
  for (const [k, w] of Object.entries(sv.w)) svWeapon(k, w, dt);
  if (sv.over) return;
  // projéteis
  for (const b of sv.pr) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    if (b.kind === 'fire' && Math.random() < .6) svPart(b.x, b.y, '#ff9a3a', 1, 30, .35, 3);
    if (b.enemy) { if (frz) { b.x -= b.vx * dt; b.y -= b.vy * dt; } if (p.inv <= 0 && sv.inv2 <= 0 && (b.x-p.x)**2 + (b.y-p.y)**2 < (b.r + 12)**2) { b.life = 0; svHurt(Math.max(1, b.dmg - st.armor)); if (sv.over) return; } continue; }
    for (const e of sv.en) { if (e.dead || (b.hit && b.hit.has(e))) continue; if ((e.x-b.x)**2 + (e.y-b.y)**2 < (e.r + b.r)**2) {
      if (b.kind === 'fire') { svBoom(b.x, b.y, b.rad, b.dmg); b.life = 0; break; }
      svHit(e, b.dmg, b.vx / 500, b.vy / 500); svPart(b.x, b.y, b.c, 3, 90, .25, 2); (b.hit = b.hit || new Set()).add(e); if (--b.pierce < 0) { b.life = 0; break; } } }
    for (const L of sv.lamps) if (L.hp > 0 && (L.x-b.x)**2 + (L.y-b.y)**2 < 400) { L.hp = 0; svLampBreak(L); }
  }
  sv.pr = sv.pr.filter(b => b.life > 0);
  // mana, itens
  const mag2 = st.mag * st.mag;
  for (const o of sv.orbs) { const d = (o.x-p.x)**2 + (o.y-p.y)**2; if (o.pull || d < mag2) { const l = Math.sqrt(d) || 1, v = o.pull ? 700 : 460; o.x += (p.x - o.x) / l * v * dt; o.y += (p.y - o.y) / l * v * dt; } if (d < 420) { o.got = 1; svGain(o.v * (sv.mod === 'dobro' ? 1 : 1)); svSfx('gem'); } }
  sv.orbs = sv.orbs.filter(o => !o.got); if (sv.orbs.length > 450) { const ex = sv.orbs.splice(0, sv.orbs.length - 450); const v = ex.reduce((a,o)=>a+o.v,0); sv.orbs.push({x:ex[0].x, y:ex[0].y, v, c:'C', big:1}); }
  for (const it of sv.items) { const d = (it.x-p.x)**2 + (it.y-p.y)**2; if (d < 26 * 26) { it.got = 1; svItem(it); if (sv.choosing) break; } }
  sv.items = sv.items.filter(i => !i.got);
  sv.lamps = sv.lamps.filter(L => L.hp > 0 && Math.abs(L.x - p.x) < 1400 && Math.abs(L.y - p.y) < 1400);
  sv.en = sv.en.filter(e => !e.dead && (e.boss || e.elite || Math.abs(e.x - p.x) < sv.W + 500 && Math.abs(e.y - p.y) < sv.H + 500));
  for (const f of sv.fx) f.t -= dt; sv.fx = sv.fx.filter(f => f.t > 0);
  for (const q of sv.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= .92; q.vy *= .92; q.t -= dt; } sv.parts = sv.parts.filter(q => q.t > 0);
  for (const t of sv.txt) { t.t -= dt; t.y -= 34 * dt; } sv.txt = sv.txt.filter(t => t.t > 0);
  if (sv.banner) { sv.banner.t -= dt; if (sv.banner.t <= 0) sv.banner = null; }
  sv.shake = Math.max(0, sv.shake - dt * 40); sv.flash = Math.max(0, sv.flash - dt);
  svHud();
}
function svHud(){
  const p = sv.p, hp = $('#svHp'); if (!hp) return;
  hp.style.width = Math.max(0, p.hp / p.max * 100) + '%'; $('#svHpT').textContent = `${Math.max(0, Math.ceil(p.hp))}/${p.max}`; $('#svXp').style.width = (sv.xp / sv.need * 100) + '%';
  $('#svT').textContent = svFmt(sv.t); $('#svK').textContent = sv.kills; $('#svL').textContent = 'Nv ' + sv.lvl;
  const u = $('#svUlt'); u.style.setProperty('--lp', sv.loyal + '%'); const ready = sv.loyal >= 100; if (u.disabled === ready) u.disabled = !ready; u.classList.toggle('ready', ready);
}
function svHurt(dmg){
  const p = sv.p; p.hp -= dmg; p.inv = .5; p.flyT = sv.st.fly ? .6 : 0; sv.flash = .25; sv.shake = Math.max(sv.shake, 6); svSfx('hurt');
  if (p.hp <= 0) { if (sv.revive) { sv.revive = false; p.hp = p.max / 2; sv.inv2 = 2.5; svBanner('Segunda chance!', 2); svPart(p.x, p.y, '#f3d68c', 40, 220, .8, 4); return; } svEnd(false); }
}
function svPickType(T){
  const r = svR(), m = T / 60;
  const W = [['swarm', 2 + m * .3], ['grunt', Math.max(1, 6 - m * .5)], ['tank', m > .7 ? 1.5 + m * .25 : 0], ['fast', m > 1.5 ? 1 + m * .3 : 0], ['shooter', m > 2 ? .8 + m * .15 : 0], ['charger', m > 2.5 ? .7 + m * .15 : 0], ['splitter', m > 1 ? .8 + m * .12 : 0]];
  const tot = W.reduce((a,x) => a + x[1], 0); let x = r * tot; for (const [k, w] of W) { if ((x -= w) <= 0) return k; } return 'grunt';
}
function svSpawn(k, ang){ const a = ang != null ? ang : svR() * 6.283, Rr = Math.hypot(sv.W, sv.H) / 2 + 50 + svR() * 40; svSpawnAt(k, sv.p.x + Math.cos(a) * Rr, sv.p.y + Math.sin(a) * Rr); }
function svSpawnAt(k, x, y, o){
  const D = SV_T[k], nm = sv.P.T[k], sc = 1 + sv.t / 100 + (sv.endless ? (sv.t - 600) / 80 : 0);
  const hp = (o && o.hp) || D.hp * (D.boss ? 1 + sv.t / 900 : sc);
  sv.en.push({k, n:nm[0], art:nm[1], x, y, hp, max:hp, sp:D.sp * (D.boss ? 1 : 1 + sv.t / 1300), dmg:D.dmg * (1 + sv.t / 500), r:(o && o.r) || D.r, ring:D.ring, xp:D.xp, boss:D.boss, elite:D.elite, slow:D.slow, beh:D.beh, flash:0, child:o && o.child, gc:'WUBRG'[Math.floor(Math.random() * 5)]});
}
function svBoom(x, y, rad, dmg){ sv.fx.push({k:'boom', x, y, r:rad, t:.4, T:.4}); svPart(x, y, '#ffb050', 14, 200, .5, 3); svSfx('fire'); sv.shake = Math.max(sv.shake, 3); for (const e of sv.en) if (!e.dead && (e.x-x)**2 + (e.y-y)**2 < (rad + e.r)**2) svHit(e, dmg, (e.x - x) / rad, (e.y - y) / rad); for (const L of sv.lamps) if (L.hp > 0 && (L.x-x)**2 + (L.y-y)**2 < rad * rad) { L.hp = 0; svLampBreak(L); } }
function svLampBreak(L){ const r = svR(), k = r < .55 ? 'elixir' : r < .85 ? 'ima' : 'ira'; sv.items.push({k, x:L.x, y:L.y}); svPart(L.x, L.y, '#ffd36a', 12, 140, .5, 3); }
function svItem(it){
  const p = sv.p;
  if (it.k === 'elixir') { p.hp = Math.min(p.max, p.hp + 35 * (sv.mod === 'fragil' ? 2 : 1)); svBanner('Elixir: +35 de vida', 1.2); svPart(p.x, p.y, '#57c78c', 16, 160, .6, 3); }
  else if (it.k === 'ima') { sv.orbs.forEach(o => o.pull = 1); svBanner('Ímã: toda a mana vem até você', 1.4); }
  else if (it.k === 'ira') { sv.fx.push({k:'wrath', t:.6, T:.6}); svSfx('boom'); for (const e of sv.en) if (!e.dead && !e.boss && !e.elite && Math.abs(e.x - p.x) < sv.W/2 + 30 && Math.abs(e.y - p.y) < sv.H/2 + 30) svKill(e); svBanner('Ira: a tela foi limpa', 1.4); }
  else if (it.k === 'pack') svBooster(it.rar);
}
/* ---------- armas ---------- */
function svWeapon(k, w, dt){
  const D = SVW2[k], L = w.l - 1, st = sv.st, p = sv.p, ev = sv.evo[k], dmg = D.dmg[L] * st.dmg * (ev ? 1.6 : 1);
  if (k === 'orbs') { w.a = (w.a || 0) + dt * (ev ? 2.6 : 3.3); const n = ev ? 6 : D.q[L], Rr = (ev ? 100 : D.rad[L]) * st.area, orr = ev ? 15 : 10; w.pos = [];
    for (let i = 0; i < n; i++) { const a = w.a + i * 6.283 / n, x = p.x + Math.cos(a) * Rr, y = p.y + Math.sin(a) * Rr; w.pos.push([x, y, orr]);
      for (const e of sv.en) if (!e.dead && (e.x-x)**2 + (e.y-y)**2 < (e.r + orr)**2) { if (sv.t - (e.oh || 0) > .3) { e.oh = sv.t; svHit(e, dmg, Math.cos(a), Math.sin(a)); } }
      if (ev) for (const b of sv.pr) if (b.enemy && (b.x-x)**2 + (b.y-y)**2 < (orr + b.r)**2) { b.life = 0; svPart(b.x, b.y, '#9fd0ff', 5, 100, .3, 2); } } return; }
  if (k === 'aura') { const Rr = (ev ? 150 : D.rad[L]) * st.area; w.r = Rr; w.t = (w.t || 0) - dt; if (w.t <= 0) { w.t = .45; for (const e of sv.en) if (!e.dead && (e.x-p.x)**2 + (e.y-p.y)**2 < (Rr + e.r)**2) { svHit(e, dmg * .5); p.hp = Math.min(p.max, p.hp + (ev ? .5 : .15)); } } return; }
  if (k === 'wolves') { const n = ev ? 4 : D.q[L]; while (sv.wolves.length < n) sv.wolves.push({x:p.x, y:p.y, cd:0});
    for (const wf of sv.wolves) { const tg = svNearest(wf.x, wf.y, 420); let tx = p.x, ty = p.y; if (tg) { tx = tg.x; ty = tg.y; } const dx = tx - wf.x, dy = ty - wf.y, dl = Math.hypot(dx, dy) || 1, sp = tg ? 280 : 210;
      wf.dir = Math.atan2(dy, dx); if (dl > 8) { wf.x += dx / dl * sp * dt; wf.y += dy / dl * sp * dt; } wf.cd -= dt; if (tg && dl < tg.r + 12 && wf.cd <= 0) { wf.cd = .4; svHit(tg, dmg, dx / dl, dy / dl); }
      if (Math.hypot(p.x - wf.x, p.y - wf.y) > 650) { wf.x = p.x; wf.y = p.y; } }
    if (ev) { w.st = (w.st || 3) - dt; if (w.st <= 0) { w.st = 6 * st.cd; svStampede(dmg * 5); } } return; }
  if (k === 'lance' && ev) { w.a = (w.a || 0) + dt * 1.6; w.ang = {x:p.x + Math.cos(w.a) * 70, y:p.y + Math.sin(w.a) * 70}; }
  w.t = (w.t || 0) - dt; if (w.t > 0) return;
  if (k === 'bolt') { w.t = (ev ? .85 : D.cd[L]) * st.cd;
    if (ev) { let from = p, used = new Set(); const tg0 = svNearest(p.x, p.y, 520); if (!tg0) { w.t = .2; return; } let tg = tg0; for (let i = 0; i < 6 && tg; i++) { used.add(tg); sv.fx.push({k:'bolt', x:from.x, y:from.y, x2:tg.x, y2:tg.y, t:.18, T:.18}); svHit(tg, dmg); svPart(tg.x, tg.y, '#fff1a8', 5, 140, .3, 2); from = tg; tg = svNearest(tg.x, tg.y, 170, used); } svSfx('bolt'); return; }
    const n = D.q[L], used = new Set(); for (let i = 0; i < n; i++) { const tg = svNearest(p.x, p.y, 520, used); if (!tg) break; used.add(tg); sv.fx.push({k:'bolt', x:p.x, y:p.y, x2:tg.x, y2:tg.y, t:.15, T:.15}); svHit(tg, dmg); svPart(tg.x, tg.y, '#fff1a8', 6, 140, .3, 2); } if (used.size) svSfx('bolt'); else w.t = .2; }
  else if (k === 'lance') { w.t = (ev ? .9 : D.cd[L]) * st.cd;
    if (ev) { const o = w.ang || p; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; sv.pr.push({x:o.x, y:o.y, vx:Math.cos(a) * 560, vy:Math.sin(a) * 560, r:8 * st.area, dmg, pierce:6 + st.pierce, life:1, c:'#fff6c8', kind:'lance'}); } p.hp = Math.min(p.max, p.hp + 1); svSfx('lance'); return; }
    const n = D.q[L]; for (let i = 0; i < n; i++) { const a = Math.atan2(p.dy, p.dx) + (i - (n-1)/2) * .17; sv.pr.push({x:p.x, y:p.y, vx:Math.cos(a) * 560, vy:Math.sin(a) * 560, r:7 * st.area, dmg, pierce:D.pierce[L] + st.pierce, life:1.1, c:'#fff6c8', kind:'lance'}); } svSfx('lance'); }
  else if (k === 'fire') { w.t = (ev ? 3 : D.cd[L]) * st.cd;
    if (ev) { const T = sv.en.filter(e => !e.dead && Math.abs(e.x - p.x) < sv.W/2 && Math.abs(e.y - p.y) < sv.H/2); for (let i = 0; i < 5 && T.length; i++) { const e = T.splice(Math.floor(svR() * T.length), 1)[0]; svBoom(e.x, e.y, 115 * st.area, dmg * 1.4); } if (!sv.en.length) w.t = .3; return; }
    const tg = svNearest(p.x, p.y, 480); if (!tg) { w.t = .3; return; } const dx = tg.x - p.x, dy = tg.y - p.y, dl = Math.hypot(dx, dy) || 1; sv.pr.push({x:p.x, y:p.y, vx:dx / dl * 340, vy:dy / dl * 340, r:11, dmg, rad:D.rad[L] * st.area, pierce:0, life:1.8, c:'#ff7a2a', kind:'fire'}); }
  else if (k === 'wrath') { w.t = (ev ? 9 : D.cd[L]) * st.cd; sv.fx.push({k:'wrath', t:.6, T:.6}); svSfx('boom'); sv.shake = 8;
    for (const e of sv.en) { if (e.dead) continue; if (Math.abs(e.x - p.x) < sv.W/2 + 30 && Math.abs(e.y - p.y) < sv.H/2 + 30) { if (e.boss || e.elite) svHit(e, dmg); else svKill(e); } }
    if (ev) { sv.pr = sv.pr.filter(b => !b.enemy); p.hp = Math.min(p.max, p.hp + 10); } }
}
function svStampede(dmg){
  const p = sv.p, a = svR() * 6.283, nx = -Math.sin(a), ny = Math.cos(a), D = Math.max(sv.W, sv.H);
  for (let i = -4; i <= 4; i++) { const ox = p.x - Math.cos(a) * D * .7 + nx * i * 40, oy = p.y - Math.sin(a) * D * .7 + ny * i * 40; sv.beasts.push({x:ox, y:oy, vx:Math.cos(a) * 620, vy:Math.sin(a) * 620, life:D * 1.4 / 620, dmg, hit:new Set()}); }
  svSfx('boom'); sv.shake = 10;
}
function svUlt(){
  if (!sv || sv.loyal < 100 || sv.over) return; sv.loyal = 0; const p = sv.p, c = sv.col; svSfx('ult'); sv.shake = 16; svBanner(SV_PW[c].ult + '!', 1.6);
  const onScreen = e => !e.dead && Math.abs(e.x - p.x) < sv.W/2 + 40 && Math.abs(e.y - p.y) < sv.H/2 + 40;
  if (c === 'W') { sv.fx.push({k:'wrath', t:.8, T:.8}); sv.en.filter(onScreen).forEach(e => svHit(e, e.boss ? 400 : 200)); p.hp = Math.min(p.max, p.hp + p.max / 2); sv.inv2 = 3; }
  else if (c === 'U') { sv.frozen = 5; sv.st = svStats(); sv.fx.push({k:'freeze', t:5, T:5}); }
  else if (c === 'B') { const L = sv.en.filter(e => onScreen(e) && !e.boss && !e.elite); L.forEach((e, i) => { if (i % 2 === 0) { svKill(e); p.hp = Math.min(p.max, p.hp + 1.5); } }); sv.en.filter(e => onScreen(e) && (e.boss || e.elite)).forEach(e => svHit(e, 250)); sv.fx.push({k:'reap', t:.7, T:.7}); }
  else if (c === 'R') { for (let i = 0; i < 30; i++) setTimeout(() => { if (!sv || sv.over) return; const a = Math.random() * 6.283, d = 40 + Math.random() * Math.min(sv.W, sv.H) * .5; svBoom(sv.p.x + Math.cos(a) * d, sv.p.y + Math.sin(a) * d, 70, 90); }, i * 100); }
  else if (c === 'G') { svStampede(260); setTimeout(() => sv && !sv.over && svStampede(260), 500); }
}
/* ---------- nível, cartas e boosters ---------- */
function svGain(v){ sv.xp += v; if (sv.xp >= sv.need && !sv.choosing) { sv.xp -= sv.need; sv.lvl++; sv.need = Math.round(6 + sv.lvl * 4.6 + Math.pow(sv.lvl, 1.4)); svSfx('level'); sv.fx.push({k:'lvl', t:.6, T:.6}); svLevelUp(); } }
function svEvoReady(){ return Object.keys(SV_EVO).filter(k => sv.w[k] && sv.w[k].l >= 5 && !sv.evo[k] && (sv.pas[SV_EVO[k].p] || 0) >= 1); }
function svOptions(n){
  const opts = [], mono = sv.mod === 'monocor';
  svEvoReady().forEach(k => opts.push({type:'e', k}));
  Object.entries(sv.w).forEach(([k,w]) => { if (w.l < 5) opts.push({type:'w', k, l:w.l + 1}); });
  if (Object.keys(sv.w).length < 5) Object.keys(SVW2).forEach(k => { if (!sv.w[k] && (!mono || SVW2[k].c === sv.col)) opts.push({type:'w', k, l:1}); });
  Object.keys(SVP2).forEach(k => { const l = sv.pas[k] || 0; if (l < 5 && (l || Object.keys(sv.pas).length < 5)) opts.push({type:'p', k, l:l + 1}); });
  const evo = opts.filter(o => o.type === 'e'), rest = opts.filter(o => o.type !== 'e');
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(svR() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  const up = rest.findIndex(o => o.type === 'w' && sv.w[o.k]); if (up > 1) [rest[0], rest[up]] = [rest[up], rest[0]];
  return evo.concat(rest).slice(0, n);
}
function svCardHTML(x, i, rar){
  let D, title, type, txt, fl, col, art, tag = '';
  if (x.type === 'e') { D = SV_EVO[x.k]; title = D.n; type = 'Evolução lendária'; txt = D.d; fl = D.mtg; col = SVCOL2[SVW2[x.k].c]; art = D.card; tag = 'evo'; }
  else if (x.type === 'w') { D = SVW2[x.k]; title = D.n; type = `${D.t} · ${x.l === 1 ? 'nova' : 'nível ' + x.l}`; txt = D.d + (x.l > 1 ? ' Mais forte.' : ''); fl = D.mtg; col = SVCOL2[D.c]; art = D.card;
    const E = SV_EVO[x.k]; if (E) fl += ` Evolui no nível 5 com ${SVP2[E.p].n}.`; }
  else { D = SVP2[x.k]; title = D.n; type = `Habilidade · nível ${x.l}`; txt = D.d; fl = `${D.en}. ${D.mtg}`; col = '#c9a24a'; art = D.card;
    const E = Object.entries(SV_EVO).find(([w,e]) => e.p === x.k && sv.w[w]); if (E) fl += ` Evolui ${SVW2[E[0]].n} em ${E[1].n}.`; }
  return `<button class="sv-card ${tag} ${rar ? 'r-' + rar : ''}" data-svu="${i}" style="--pc:${col}"><span class="sv-ct"><b>${title}</b>${x.type === 'w' ? manaSym(SVW2[x.k].c) : ''}</span>
    <span class="sv-art">${svImg(art)}</span><span class="sv-ty">${type}</span><span class="sv-tx">${txt}</span><span class="sv-fl">${fl}</span>${i != null ? `<span class="sv-kk">${i+1}</span>` : ''}</button>`;
}
function svApply(x){
  if (x.type === 'e') { sv.evo[x.k] = true; svMeta().evo[x.k] = 1; save(); svSfx('evo'); svBanner(`Evolução: ${SV_EVO[x.k].n}!`, 2.4); sv.shake = 10; svPart(sv.p.x, sv.p.y, '#f3d68c', 50, 260, .9, 4); }
  else if (x.type === 'w') { sv.w[x.k] = sv.w[x.k] || {l:0, t:0}; sv.w[x.k].l = x.l; }
  else { sv.pas[x.k] = x.l; if (x.k === 'terreno') { sv.p.max += 20; sv.p.hp = sv.p.max; } }
  sv.st = svStats(); svDrawW();
}
function svLevelUp(){
  const n = 3 + ((svMeta().up.sorte || 0) >= 3 || svR() < .08 * (svMeta().up.sorte || 0) ? 1 : 0);
  const O = svOptions(n); if (!O.length) { sv.p.hp = Math.min(sv.p.max, sv.p.hp + 25); return; }
  sv.choosing = O; const o = $('#svOv'); o.hidden = false;
  o.innerHTML = `<div class="sv-box sv-lv"><h2>Nível ${sv.lvl}!</h2><p>Escolha uma carta</p><div class="sv-cards n${O.length}">${O.map((x,i) => svCardHTML(x, i)).join('')}</div></div>`;
  $$('[data-svu]').forEach(b => b.onclick = () => { svApply(O[+b.dataset.svu]); sv.choosing = null; o.hidden = true; sv.lastT = performance.now(); if (sv.xp >= sv.need) svGain(0); });
  const f = $('[data-svu]'); f && f.focus({preventScroll:true});
}
const SV_RAR = {comum:['Comum','#c9c3b5',1], incomum:['Incomum','#b9c8d8',2], rara:['Rara','#e3b65a',3], mitica:['Mítica','#ff7a3a',5]};
function svBooster(bonus){
  sv.packs++; const luck = svMeta().up.sorte || 0, r = svR() + bonus * .25 + luck * .04;
  const rar = svEvoReady().length && r > .55 ? 'mitica' : r > .93 ? 'mitica' : r > .7 ? 'rara' : r > .38 ? 'incomum' : 'comum';
  const n = SV_RAR[rar][2]; let picks = [];
  for (let i = 0; i < n; i++) { const O = svOptions(6).filter(x => !picks.some(p => p.type === x.type && p.k === x.k)); if (!O.length) break; const x = rar === 'mitica' && i === 0 && O[0].type === 'e' ? O[0] : O[Math.floor(svR() * Math.min(O.length, 4))]; picks.push(x); svApply(x); }
  sv.choosing = ['pack']; const o = $('#svOv'); o.hidden = false; svSfx('pack');
  o.innerHTML = `<div class="sv-box sv-pack-box"><h2>Booster!</h2><button class="sv-pack r-${rar}" id="svPackBtn" aria-label="Abrir o booster"><span class="sv-pack-l">${sv.P.n}</span><span class="sv-pack-s">BOOSTER</span><span class="sv-pack-tap">Toque para abrir</span></button><div class="sv-cards sv-rev n${picks.length}" id="svRev" hidden></div><button class="btn primary" id="svPackOk" hidden>Continuar</button></div>`;
  const open = () => { const b = $('#svPackBtn'); if (!b) return; b.classList.add('open'); setTimeout(() => { b.remove(); const rv = $('#svRev'); rv.hidden = false;
      rv.innerHTML = `<p class="sv-rar" style="color:${SV_RAR[rar][1]}">${SV_RAR[rar][0]}${picks.length > 1 ? ` · ${picks.length} cartas` : ''}</p>` + picks.map((x,i) => svCardHTML(x, null, rar).replace('class="sv-card', `style="animation-delay:${i * .18}s" class="sv-card flip`)).join('');
      if (rar === 'mitica' || rar === 'rara') svSfx('myth'); const ok = $('#svPackOk'); ok.hidden = false; ok.focus(); }, 520); };
  $('#svPackBtn').onclick = open;
  $('#svPackOk').onclick = () => { sv.choosing = null; o.hidden = true; sv.lastT = performance.now(); };
}
/* ---------- fim ---------- */
function svEnd(won, quit){
  sv.over = true; svMusicStop(); svSfx(won ? 'win' : 'die'); const M = svMeta(); const o = $('#svOv'); const fact = KW[Math.floor(Math.random() * KW.length)];
  const B = M.best[sv.plane]; const better = !quit && (!B || sv.t > B.t); if (better) M.best[sv.plane] = {t:Math.round(sv.t), kills:sv.kills, lvl:sv.lvl, won, col:sv.col};
  let unlock = ''; if (won) { const i = SV_PLANE_ORDER.indexOf(sv.plane), nx = SV_PLANE_ORDER[i + 1]; if (nx && !M.planes[nx]) { M.planes[nx] = 1; unlock = SV_PLANES[nx].n; } }
  const cen = quit ? Math.round(sv.t / 30) : Math.round((sv.t / 12 + sv.kills / 25 + sv.bosses * 25 + (won ? 60 : 0)) * (1 + .1 * (M.up.ganancia || 0)));
  M.cen += cen;
  let dailyMsg = ''; if (sv.daily && !quit) { const prev = M.daily[sv.daily.key] || 0; if (sv.t > prev) M.daily[sv.daily.key] = Math.round(sv.t); dailyMsg = `Desafio do dia (${sv.daily.key.split('-').reverse().join('/')}): sobrevivi ${svFmt(sv.t)} em ${sv.P.n} com o ${SV_PW[sv.col].n}, ${sv.kills} criaturas. Consegue mais? ${location.protocol === 'file:' ? SITE : location.origin + location.pathname}#treino`; }
  const xpGain = quit ? 0 : Math.min(80, Math.round(sv.t / 18 + sv.kills / 40) + (won ? 25 : 0)); if (xpGain) addXP(xpGain); S.survGames = (S.survGames || 0) + 1;
  if (!quit && (!S.survBest || sv.t > S.survBest.t)) S.survBest = {t:Math.round(sv.t), kills:sv.kills, lvl:sv.lvl, won, col:sv.col};
  save();
  o.hidden = false;
  o.innerHTML = `<div class="sv-box"><h2>${won ? `Você sobreviveu a ${sv.P.n}!` : quit ? 'Fim de jogo' : 'Sua centelha se apagou'}</h2>
    <p class="sv-stats"><span><b>${svFmt(sv.t)}</b> sobrevivido</span><span><b>${sv.kills}</b> criaturas</span><span><b>${sv.lvl}</b> nível</span><span><b>✦ ${cen}</b> Centelha</span>${xpGain ? `<span><b>+${xpGain}</b> XP</span>` : ''}</p>
    ${better ? '<p class="sv-rec">Novo recorde neste plano!</p>' : ''}${unlock ? `<p class="sv-rec">Novo plano liberado: ${unlock}!</p>` : ''}
    <div class="sv-fact"><span class="eyebrow">Você sabia?</span><p><b>${fact.pt} (${fact.en}):</b> ${esc(fact.x)}</p></div>
    <div class="row-h" style="justify-content:center">${won ? '<button class="btn" id="svEndless">Continuar no modo infinito</button>' : ''}${dailyMsg ? '<button class="btn" id="svShare">Desafiar amigos</button>' : ''}<button class="btn primary" id="svAgain">Jogar de novo</button><button class="btn" id="svShopE">Loja da Centelha</button><button class="btn" id="svExit">Sair</button></div></div>`;
  const opts = {plane:sv.plane, col:sv.col, daily:sv.daily};
  $('#svAgain').onclick = () => { svClose(); svStart(opts); };
  $('#svExit').onclick = svClose;
  $('#svShopE').onclick = () => { svClose(); svSel.view = 'shop'; renderSurv(); };
  const sh = $('#svShare'); if (sh) sh.onclick = () => { if (navigator.share) navigator.share({text: dailyMsg}).catch(()=>{}); else copyText(dailyMsg); };
  const en = $('#svEndless'); if (en) en.onclick = () => { sv.over = false; sv.won = true; sv.endless = true; o.hidden = true; sv.lastT = performance.now(); svMusicStart(sv.plane); };
}
/* ---------- desenho ---------- */
function svRender(dt){
  const c = sv.ctx, W = sv.W, H = sv.H, p = sv.p, dpr = sv.dpr, P = sv.P; if (!c) return;
  const shx = sv.shake ? (Math.random() - .5) * sv.shake : 0, shy = sv.shake ? (Math.random() - .5) * sv.shake : 0;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ox = Math.round(W/2 - p.x + shx), oy = Math.round(H/2 - p.y + shy);
  c.save(); c.translate(ox, oy); c.fillStyle = svGroundPat(c, P); c.fillRect(p.x - W/2 - 40, p.y - H/2 - 40, W + 80, H + 80); c.restore();
  c.save(); c.translate(ox, oy);
  const vis = (x, y, m) => x > p.x - W/2 - m && x < p.x + W/2 + m && y > p.y - H/2 - m && y < p.y + H/2 + m;
  // aura
  if (sv.w.aura && sv.w.aura.r) { const r = sv.w.aura.r, ev = sv.evo.aura; if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow(ev ? 'rgba(200,60,90,.5)' : 'rgba(150,90,200,.45)', 64), p.x - r, p.y - r, r * 2, r * 2); c.globalCompositeOperation = 'source-over'; }
    c.strokeStyle = ev ? 'rgba(255,120,150,.5)' : 'rgba(200,150,240,.45)'; c.lineWidth = 2; c.setLineDash([6, 8]); c.lineDashOffset = -sv.t * 30; c.beginPath(); c.arc(p.x, p.y, r, 0, 6.283); c.stroke(); c.setLineDash([]); }
  // lanternas e itens
  for (const L of sv.lamps) { if (!vis(L.x, L.y, 40)) continue; if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,200,90,.55)', 40), L.x - 26, L.y - 34, 52, 52); c.globalCompositeOperation = 'source-over'; } c.fillStyle = '#3a2a14'; c.fillRect(L.x - 2, L.y - 4, 4, 16); c.fillStyle = '#ffd36a'; c.fillRect(L.x - 6, L.y - 16, 12, 12); c.strokeStyle = '#1a1208'; c.lineWidth = 2; c.strokeRect(L.x - 6, L.y - 16, 12, 12); }
  for (const it of sv.items) { if (!vis(it.x, it.y, 30)) continue; const bob = Math.sin(sv.t * 4 + it.x) * 3;
    if (it.k === 'pack') { if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,215,120,.7)', 50), it.x - 34, it.y - 34 + bob, 68, 68); c.globalCompositeOperation = 'source-over'; } c.save(); c.translate(it.x, it.y + bob); c.rotate(Math.sin(sv.t * 2) * .15); const g = c.createLinearGradient(-12, -16, 12, 16); g.addColorStop(0, '#f3d68c'); g.addColorStop(.5, '#c46f2a'); g.addColorStop(1, '#5b2a7a'); c.fillStyle = g; c.fillRect(-12, -16, 24, 32); c.strokeStyle = '#1a1208'; c.lineWidth = 2.5; c.strokeRect(-12, -16, 24, 32); c.fillStyle = '#1a1208'; c.fillRect(-12, -16, 24, 5); c.restore(); }
    else { const col = it.k === 'elixir' ? '#57c78c' : it.k === 'ima' ? '#4a95d6' : '#f1e7c0'; if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,255,255,.4)', 30), it.x - 20, it.y - 20 + bob, 40, 40); c.globalCompositeOperation = 'source-over'; } c.fillStyle = col; c.strokeStyle = '#1a1208'; c.lineWidth = 2; c.beginPath(); c.arc(it.x, it.y + bob, 9, 0, 6.283); c.fill(); c.stroke(); c.fillStyle = '#1a1208'; c.font = 'bold 11px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(it.k === 'elixir' ? '+' : it.k === 'ima' ? 'U' : '!', it.x, it.y + bob + 1); } }
  // mana
  for (const o of sv.orbs) { if (!vis(o.x, o.y, 20)) continue; const s = o.big ? 26 : 16, bob = Math.sin(sv.t * 5 + o.x * .1) * 1.5; c.drawImage(svGem(o.c), o.x - s/2, o.y - s/2 + bob, s, s); }
  // inimigos
  for (const e of sv.en) {
    if (!vis(e.x, e.y, e.r + 20)) continue;
    const sp = svSprite(e.k + '|' + e.art, Math.round(e.r), e.art, e.ring, {letter:e.n}), sz = sp.width, bob = e.boss ? 0 : Math.sin((e.age || 0) * 9 + e.x) * 1.2;
    if (e.elite || e.boss) { if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow(e.boss ? 'rgba(255,90,60,.55)' : 'rgba(255,210,110,.5)', 64), e.x - e.r * 1.8, e.y - e.r * 1.8, e.r * 3.6, e.r * 3.6); c.globalCompositeOperation = 'source-over'; } }
    if (e.st === 'wind') { c.strokeStyle = `rgba(255,60,40,${.5 + Math.sin(sv.t * 30) * .4})`; c.lineWidth = 3; c.beginPath(); c.arc(e.x, e.y, e.r + 6, 0, 6.283); c.stroke(); }
    c.drawImage(sp, e.x - sz / 2, e.y - sz / 2 + bob);
    if (e.flash > 0) { c.globalAlpha = Math.min(1, e.flash * 10); c.fillStyle = '#fff'; c.beginPath(); c.arc(e.x, e.y + bob, e.r, 0, 6.283); c.fill(); c.globalAlpha = 1; }
    if (sv.frozen > 0) { c.fillStyle = 'rgba(160,210,255,.35)'; c.beginPath(); c.arc(e.x, e.y, e.r + 2, 0, 6.283); c.fill(); }
    if (e.elite && e.hp < e.max) { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(e.x - e.r, e.y - e.r - 10, e.r * 2, 5); c.fillStyle = '#e3b65a'; c.fillRect(e.x - e.r, e.y - e.r - 10, e.r * 2 * Math.max(0, e.hp / e.max), 5); }
  }
  // feras da debandada
  for (const b of sv.beasts) { b.x += b.vx * (sv.paused || sv.choosing ? 0 : dt); b.y += b.vy * (sv.paused || sv.choosing ? 0 : dt); b.life -= sv.paused || sv.choosing ? 0 : dt;
    for (const e of sv.en) if (!e.dead && !b.hit.has(e) && (e.x-b.x)**2 + (e.y-b.y)**2 < (e.r + 18)**2) { b.hit.add(e); svHit(e, b.dmg, b.vx / 300, b.vy / 300); }
    const sp = svSprite('hoof', 18, 'Craterhoof Behemoth', '#4cae6b'); c.drawImage(sp, b.x - sp.width/2, b.y - sp.height/2); if (Math.random() < .4) svPart(b.x, b.y, '#7a6a4a', 1, 40, .4, 3); }
  sv.beasts = sv.beasts.filter(b => b.life > 0);
  // lobos
  if (sv.w.wolves) for (const wf of sv.wolves) { const sp = svSprite('wolf', 11, 'Howl of the Night Pack', '#4cae6b', {letter:'L'}); c.drawImage(sp, wf.x - sp.width/2, wf.y - sp.height/2); }
  // anjo
  if (sv.evo.lance && sv.w.lance.ang) { const a = sv.w.lance.ang, sp = svSprite('angel', 16, 'Baneslayer Angel', '#f1e7c0'); if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,245,200,.5)', 40), a.x - 30, a.y - 30, 60, 60); c.globalCompositeOperation = 'source-over'; } c.drawImage(sp, a.x - sp.width/2, a.y - sp.height/2); }
  // orbes
  if (sv.w.orbs && sv.w.orbs.pos) { if (!sv.lite) { c.globalCompositeOperation = 'lighter'; for (const [x,y,r] of sv.w.orbs.pos) c.drawImage(svGlow('rgba(120,190,255,.8)', 32), x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4); c.globalCompositeOperation = 'source-over'; } for (const [x,y,r] of sv.w.orbs.pos) { c.fillStyle = '#d8eeff'; c.beginPath(); c.arc(x, y, r * .55, 0, 6.283); c.fill(); } }
  // projéteis
  for (const b of sv.pr) { if (!vis(b.x, b.y, 30)) continue;
    if (b.kind === 'lance') { const a = Math.atan2(b.vy, b.vx); c.save(); c.translate(b.x, b.y); c.rotate(a); if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,245,190,.7)', 24), -26, -12, 52, 24); c.globalCompositeOperation = 'source-over'; } c.fillStyle = '#fffbe6'; c.beginPath(); c.moveTo(16, 0); c.lineTo(-14, -3); c.lineTo(-14, 3); c.closePath(); c.fill(); c.restore(); }
    else { if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow(b.enemy ? (b.c === '#c86aff' ? 'rgba(200,110,255,.8)' : 'rgba(255,80,60,.8)') : 'rgba(255,150,60,.85)', 32), b.x - b.r * 2.4, b.y - b.r * 2.4, b.r * 4.8, b.r * 4.8); c.globalCompositeOperation = 'source-over'; } c.fillStyle = b.enemy ? '#ffe0d8' : '#fff0c0'; c.beginPath(); c.arc(b.x, b.y, b.r * .5, 0, 6.283); c.fill(); } }
  // efeitos
  for (const f of sv.fx) {
    const k = f.t / (f.T || 1);
    if (f.k === 'bolt') { c.globalCompositeOperation = 'lighter'; for (const [w, col] of [[7, `rgba(140,170,255,${k * .6})`], [2.5, `rgba(255,255,230,${k})`]]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(f.x, f.y); const n = 6; for (let i = 1; i < n; i++) { const t = i / n; c.lineTo(f.x + (f.x2 - f.x) * t + (Math.random() - .5) * 22, f.y + (f.y2 - f.y) * t + (Math.random() - .5) * 22); } c.lineTo(f.x2, f.y2); c.stroke(); } c.globalCompositeOperation = 'source-over'; }
    else if (f.k === 'boom') { c.globalCompositeOperation = 'lighter'; const r = Math.max(.5, f.r * (1.25 - k * .5)); c.globalAlpha = Math.min(1, k * 1.2); c.drawImage(svGlow('rgba(255,140,50,1)', 64), f.x - r * 1.3, f.y - r * 1.3, r * 2.6, r * 2.6); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.strokeStyle = `rgba(255,220,150,${k})`; c.lineWidth = 3; c.beginPath(); c.arc(f.x, f.y, r, 0, 6.283); c.stroke(); }
    else if (f.k === 'soul') { c.globalAlpha = k * .6; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(f.x, f.y, Math.max(.5, f.r * (1.6 - k * .6)), 0, 6.283); c.stroke(); c.globalAlpha = 1; }
  }
  // partículas
  if (!sv.lite) c.globalCompositeOperation = 'lighter';
  for (const q of sv.parts) { const k = q.t / q.T; c.globalAlpha = Math.max(0, k); c.fillStyle = q.c; const s = q.s * (.5 + k * .5); c.fillRect(q.x - s/2, q.y - s/2, s, s); }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  // jogador
  const blink = (p.inv > 0 || sv.inv2 > 0) && Math.floor((p.inv + sv.inv2) * 18) % 2;
  if (!blink) { if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(243,214,140,.45)', 48), p.x - 40, p.y - 40, 80, 80); c.globalCompositeOperation = 'source-over'; }
    c.strokeStyle = 'rgba(243,214,140,.7)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = sv.t * 2 + i * 2.094; c.beginPath(); c.arc(p.x, p.y, 25, a, a + .9); c.stroke(); }
    const sp = svSprite('pw' + sv.col, 18, SV_PW[sv.col].art, SVCOL2[sv.col], {letter:sv.col}); c.drawImage(sp, p.x - sp.width/2, p.y - sp.height/2);
    c.fillStyle = '#f3d68c'; const a = Math.atan2(p.dy, p.dx); c.beginPath(); c.moveTo(p.x + Math.cos(a) * 32, p.y + Math.sin(a) * 32); c.lineTo(p.x + Math.cos(a + .25) * 25, p.y + Math.sin(a + .25) * 25); c.lineTo(p.x + Math.cos(a - .25) * 25, p.y + Math.sin(a - .25) * 25); c.fill(); }
  // números
  c.textAlign = 'center'; c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,.8)';
  for (const t of sv.txt) { c.globalAlpha = Math.min(1, t.t * 2.2); c.font = t.c ? 'bold 16px sans-serif' : 'bold 12px sans-serif'; c.strokeText(t.v, t.x, t.y); c.fillStyle = t.c ? '#ffd24a' : '#fff'; c.fillText(t.v, t.x, t.y); }
  c.globalAlpha = 1; c.restore();
  // ambiente e luz
  if (!sv.lite) for (const m of sv.amb) { m.y -= (P.amb === 'embers' ? .0006 : P.amb === 'fog' ? .00005 : .0002) * m.s * 16; m.x += Math.sin(sv.t * .5 + m.ph) * .0002; if (m.y < -.05) { m.y = 1.05; m.x = Math.random(); }
    const x = ((m.x * W - (p.x * .15) % W) + W) % W, y = ((m.y * H - (p.y * .15) % H) + H) % H;
    if (P.amb === 'fog') { c.globalAlpha = .5; c.drawImage(svGlow(P.ambC, 64), x - 120 * m.s, y - 60 * m.s, 240 * m.s, 120 * m.s); c.globalAlpha = 1; } else { c.fillStyle = P.ambC; c.fillRect(x, y, 2 * m.s + 1, 2 * m.s + 1); } }
  if (P.night) { c.fillStyle = 'rgba(10,12,40,.28)'; c.fillRect(0, 0, W, H); if (!sv.lite) { c.globalCompositeOperation = 'lighter'; c.drawImage(svGlow('rgba(255,230,180,.18)', 64), W/2 - 260, H/2 - 260, 520, 520); c.globalCompositeOperation = 'source-over'; } }
  c.drawImage(svVignette(W, H), 0, 0);
  const wf = sv.fx.find(f => f.k === 'wrath'); if (wf) { c.fillStyle = `rgba(255,250,225,${wf.t / wf.T * .75})`; c.fillRect(0, 0, W, H); }
  const rp = sv.fx.find(f => f.k === 'reap'); if (rp) { c.fillStyle = `rgba(60,0,40,${rp.t / rp.T * .6})`; c.fillRect(0, 0, W, H); }
  if (sv.frozen > 0) { c.fillStyle = `rgba(120,180,255,${Math.min(.22, sv.frozen * .1)})`; c.fillRect(0, 0, W, H); }
  const lv = sv.fx.find(f => f.k === 'lvl'); if (lv) { const k = lv.t / lv.T; c.strokeStyle = `rgba(243,214,140,${k})`; c.lineWidth = 6 * k; c.beginPath(); c.arc(W/2, H/2, (1 - k) * Math.max(W, H) * .6 + 20, 0, 6.283); c.stroke(); }
  if (sv.flash) { c.fillStyle = `rgba(200,20,20,${sv.flash})`; c.fillRect(0, 0, W, H); }
  if (sv.p.hp / sv.p.max < .3 && !sv.over) { c.strokeStyle = `rgba(220,30,30,${.25 + Math.sin(sv.t * 6) * .15})`; c.lineWidth = 24; c.strokeRect(0, 0, W, H); }
  // joystick
  if (sv.joy) { c.strokeStyle = 'rgba(243,214,140,.45)'; c.lineWidth = 2; c.beginPath(); c.arc(sv.joy.x0, sv.joy.y0, 50, 0, 6.283); c.stroke(); const jx = sv.joy.x - sv.joy.x0, jy = sv.joy.y - sv.joy.y0, jl = Math.min(50, Math.hypot(jx, jy)) / (Math.hypot(jx, jy) || 1); c.fillStyle = 'rgba(243,214,140,.55)'; c.beginPath(); c.arc(sv.joy.x0 + jx * jl, sv.joy.y0 + jy * jl, 20, 0, 6.283); c.fill(); }
  // chefe
  const boss = sv.en.find(e => e.boss && !e.dead);
  if (boss) { const bw = Math.min(460, W - 40), y = 70; c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(W/2 - bw/2 - 2, y - 2, bw + 4, 14); const g = c.createLinearGradient(W/2 - bw/2, 0, W/2 + bw/2, 0); g.addColorStop(0, '#8a1c10'); g.addColorStop(1, '#ff7a3a'); c.fillStyle = g; c.fillRect(W/2 - bw/2, y, bw * Math.max(0, boss.hp / boss.max), 10); c.font = 'bold 13px Georgia, serif'; c.textAlign = 'center'; c.fillStyle = '#f3d68c'; c.fillText(boss.n, W/2, y - 6);
    const dx = boss.x - p.x, dy = boss.y - p.y; if (Math.abs(dx) > W/2 || Math.abs(dy) > H/2) { const a = Math.atan2(dy, dx), ex = W/2 + Math.cos(a) * (W/2 - 30), ey = H/2 + Math.sin(a) * (H/2 - 30); c.fillStyle = '#ff5a3a'; c.beginPath(); c.moveTo(ex + Math.cos(a) * 14, ey + Math.sin(a) * 14); c.lineTo(ex + Math.cos(a + 2.5) * 12, ey + Math.sin(a + 2.5) * 12); c.lineTo(ex + Math.cos(a - 2.5) * 12, ey + Math.sin(a - 2.5) * 12); c.fill(); } }
  if (sv.banner) { const k = Math.min(1, sv.banner.t * 2, (sv.banner.T - sv.banner.t) * 4 + .2); c.globalAlpha = k; c.font = `bold ${W < 500 ? 20 : 28}px Georgia, serif`; c.textAlign = 'center'; c.lineWidth = 5; c.strokeStyle = 'rgba(0,0,0,.7)'; c.strokeText(sv.banner.m, W/2, H * .24); c.fillStyle = '#f6e7bf'; c.fillText(sv.banner.m, W/2, H * .24); c.globalAlpha = 1; }
}
