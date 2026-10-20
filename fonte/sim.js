/* ================= SIMULADOR DE PARTIDAS (solo / goldfish) =================
   Cartas com dados de simulação. f: haste, mana (gera N), ramp {bf,hand}, draw, tok (fichas ao entrar),
   ctok (fichas a cada combate), anth {tr,n,self}, burn (dano ao oponente), treas (tesouros), etb (dano por criatura que entra),
   krenko, ezuri, overrun, castTok (ficha ao conjurar outra criatura da tribo), skip (não conjurar no solo), tapped (entra virado) */
const SIMDB = {
 // incolores
 'Sol Ring':['{1}','artifact','','', 'Artefato. {T}: adicione dois manas incolores.',{mana:2}],
 'Arcane Signet':['{2}','artifact','','', 'Artefato. {T}: adicione um mana de uma cor do seu comandante.',{mana:1}],
 'Mind Stone':['{2}','artifact','','', 'Artefato. {T}: adicione um mana incolor. Pode ser sacrificado para comprar um card.',{mana:1}],
 'Fellwar Stone':['{2}','artifact','','', 'Artefato. {T}: adicione um mana de uma cor que um terreno do oponente geraria.',{mana:1}],
 'Thought Vessel':['{2}','artifact','','', 'Artefato. Você não tem tamanho máximo de mão. {T}: adicione um mana incolor.',{mana:1}],
 'Commander\'s Sphere':['{3}','artifact','','', 'Artefato. {T}: adicione um mana de uma cor do seu comandante.',{mana:1}],
 'Fire Diamond':['{2}','artifact','','', 'Artefato. Entra virado. {T}: adicione {R}.',{mana:1,tapped:1}],
 'Ruby Medallion':['{2}','artifact','','', 'Artefato. Suas mágicas vermelhas custam {1} a menos.',{mana:1}],
 'Wayfarer\'s Bauble':['{1}','artifact','','', 'Artefato. {2}, {T}, sacrifique: busque um terreno básico e coloque-o no campo virado.',{ramp:{bf:1,hand:0},rampCost:2}],
 'Swiftfoot Boots':['{2}','artifact','','', 'Equipamento. A criatura equipada tem resistência a magia e ímpeto. Equipar {1}.',{boots:1}],
 'Lightning Greaves':['{2}','artifact','','', 'Equipamento. A criatura equipada tem resistência a magia e ímpeto. Equipar {0}.',{boots:1}],
 // vermelho
 'Goblin Matron':['{2}{R}','creature','Goblin','1/1','Quando entra, busque um card de Goblin e coloque-o na mão.',{tutor:'Goblin'}],
 'Goblin Chieftain':['{1}{R}{R}','creature','Goblin','2/2','Ímpeto. Os outros Goblins recebem +1/+1 e têm ímpeto.',{haste:1,anth:{tr:'Goblin',n:1},hasteTr:'Goblin'}],
 'Goblin King':['{1}{R}{R}','creature','Goblin','2/2','Os outros Goblins recebem +1/+1 e têm montanhismo.',{anth:{tr:'Goblin',n:1}}],
 'Goblin Warchief':['{1}{R}{R}','creature','Goblin','2/2','Mágicas de Goblin custam {1} a menos. Goblins têm ímpeto.',{haste:1,hasteTr:'Goblin'}],
 'Skirk Prospector':['{R}','creature','Goblin','1/1','Sacrifique um Goblin: adicione {R}.',{}],
 'Goblin Instigator':['{1}{R}','creature','Goblin','1/1','Quando entra, crie uma ficha de Goblin 1/1.',{tok:1}],
 'Beetleback Chief':['{2}{R}{R}','creature','Goblin','2/2','Quando entra, crie duas fichas de Goblin 1/1.',{tok:2}],
 'Legion Warboss':['{2}{R}','creature','Goblin','2/2','Mentor. No início do combate, crie um Goblin 1/1 com ímpeto que ataca.',{ctok:1}],
 'Goblin Rabblemaster':['{2}{R}','creature','Goblin','2/2','No início do combate, crie um Goblin 1/1 com ímpeto. Recebe +1/+0 por outro Goblin atacando.',{ctok:1}],
 'Siege-Gang Commander':['{3}{R}{R}','creature','Goblin','2/2','Quando entra, crie três fichas de Goblin 1/1.',{tok:3}],
 'Mogg War Marshal':['{1}{R}','creature','Goblin','1/1','Eco. Quando entra ou morre, crie uma ficha de Goblin 1/1.',{tok:1}],
 'Krenko, Tin Street Kingpin':['{2}{R}','creature','Goblin','1/2','Sempre que ataca, recebe um marcador +1/+1 e cria Goblins igual ao seu poder.',{ctok:1}],
 'Battle Cry Goblin':['{1}{R}','creature','Goblin','2/2','{1}{R}: Goblins recebem +1/+0. Pode criar Goblins ao atacar.',{}],
 'Goblin Lackey':['{R}','creature','Goblin','1/1','Quando causa dano a um jogador, coloque um Goblin da mão no campo.',{}],
 'Goblin Piledriver':['{1}{R}','creature','Goblin','1/2','Proteção contra azul. +2/+0 para cada outro Goblin atacando.',{}],
 'Goblin Sharpshooter':['{2}{R}','creature','Goblin','1/1','{T}: 1 de dano a qualquer alvo. Desvira quando uma criatura morre.',{}],
 'Mogg Fanatic':['{R}','creature','Goblin','1/1','Sacrifique: 1 de dano a qualquer alvo.',{}],
 'Goblin Bushwhacker':['{R}','creature','Goblin','1/1','Reforço {R}: criaturas recebem +1/+0 e ímpeto.',{}],
 'Goblin Cratermaker':['{1}{R}','creature','Goblin','2/2','{1}, sacrifique: 2 de dano a uma criatura ou destrua um artefato incolor.',{}],
 'Goblin Chainwhirler':['{R}{R}{R}','creature','Goblin','3/3','Iniciativa. Quando entra, 1 de dano a cada oponente e às criaturas deles.',{burnEtb:1}],
 'Goblin Heelcutter':['{3}{R}','creature','Goblin','3/2','Arrancada. Ao atacar, uma criatura não pode bloquear.',{}],
 'Goblin Dark-Dwellers':['{3}{R}{R}','creature','Goblin','4/4','Ameaçar. Ao entrar, conjure de graça um instantâneo ou feitiço do cemitério.',{}],
 'Raging Goblin':['{R}','creature','Goblin','1/1','Ímpeto.',{haste:1}],
 'Goblin Arsonist':['{R}','creature','Goblin','1/1','Quando morre, 1 de dano a qualquer alvo.',{}],
 'Fanatical Firebrand':['{R}','creature','Goblin','1/1','Ímpeto. Sacrifique: 1 de dano a qualquer alvo.',{haste:1}],
 'Gempalm Incinerator':['{1}{R}','creature','Goblin','2/1','Reciclar com Goblin: dano a uma criatura igual ao número de Goblins.',{}],
 'Hellrider':['{3}{R}','creature','Diabo','3/3','Ímpeto. Sempre que uma criatura sua ataca, 1 de dano ao defensor.',{haste:1,atkPing:1}],
 'Goblin Rally':['{3}{R}{R}','sorcery','','', 'Crie quatro fichas de Goblin 1/1.',{tok:4,tokTr:'Goblin'}],
 'Hordeling Outburst':['{1}{R}{R}','sorcery','','', 'Crie três fichas de Goblin 1/1.',{tok:3,tokTr:'Goblin'}],
 'Dragon Fodder':['{1}{R}','sorcery','','', 'Crie duas fichas de Goblin 1/1.',{tok:2,tokTr:'Goblin'}],
 'Krenko\'s Command':['{1}{R}','sorcery','','', 'Crie duas fichas de Goblin 1/1.',{tok:2,tokTr:'Goblin'}],
 'Goblin Bombardment':['{1}{R}','enchantment','','', 'Sacrifique uma criatura: 1 de dano a qualquer alvo.',{}],
 'Impact Tremors':['{1}{R}','enchantment','','', 'Sempre que uma criatura entra sob seu controle, 1 de dano a cada oponente.',{etb:1}],
 'Shock':['{R}','instant','','', '2 de dano a qualquer alvo.',{burn:2}],
 'Searing Spear':['{1}{R}','instant','','', '3 de dano a qualquer alvo.',{burn:3}],
 'Incinerate':['{1}{R}','instant','','', '3 de dano a qualquer alvo. Não pode ser regenerada.',{burn:3}],
 'Chaos Warp':['{2}{R}','instant','','', 'O dono embaralha a permanente alvo no grimório e revela o topo.',{skip:1}],
 'Abrade':['{1}{R}','instant','','', 'Escolha: 3 de dano a uma criatura ou destrua um artefato.',{skip:1}],
 'Blasphemous Act':['{8}{R}','sorcery','','', 'Custa {1} a menos por criatura no campo. 13 de dano a cada criatura.',{skip:1}],
 'Vandalblast':['{R}','sorcery','','', 'Destrua um artefato. Sobrecarga: destrua todos os artefatos dos oponentes.',{skip:1}],
 'Faithless Looting':['{R}','sorcery','','', 'Compre dois cards e descarte dois.',{draw:2,discard:2}],
 'Big Score':['{3}{R}','instant','','', 'Descarte um card: compre dois e crie dois Tesouros.',{draw:2,discard:1,treas:2}],
 'Light Up the Stage':['{2}{R}','sorcery','','', 'Exile os dois cards do topo; você pode jogá-los até o fim do próximo turno.',{draw:2}],
 'Reckless Impulse':['{1}{R}','sorcery','','', 'Exile os dois cards do topo; você pode jogá-los até o fim do próximo turno.',{draw:2}],
 'Thrill of Possibility':['{1}{R}','instant','','', 'Descarte um card: compre dois.',{draw:2,discard:1}],
 'Tormenting Voice':['{1}{R}','sorcery','','', 'Descarte um card: compre dois.',{draw:2,discard:1}],
 'Unexpected Windfall':['{2}{R}{R}','instant','','', 'Descarte um card: compre dois e crie dois Tesouros.',{draw:2,discard:1,treas:2}],
 // verde
 'Elvish Mystic':['{G}','creature','Elfo','1/1','{T}: adicione {G}.',{mana:1}],
 'Fyndhorn Elves':['{G}','creature','Elfo','1/1','{T}: adicione {G}.',{mana:1}],
 'Elvish Archdruid':['{1}{G}{G}','creature','Elfo','2/2','Os outros Elfos recebem +1/+1. {T}: adicione {G} para cada Elfo seu.',{manaTr:'Elfo',anth:{tr:'Elfo',n:1}}],
 'Priest of Titania':['{1}{G}','creature','Elfo','1/1','{T}: adicione {G} para cada Elfo no campo.',{manaTr:'Elfo'}],
 'Elvish Visionary':['{1}{G}','creature','Elfo','1/1','Quando entra, compre um card.',{draw:1}],
 'Wood Elves':['{2}{G}','creature','Elfo','1/1','Quando entra, busque uma Floresta e coloque-a no campo.',{ramp:{bf:1,hand:0,untapped:1}}],
 'Elvish Champion':['{1}{G}{G}','creature','Elfo','2/2','Os outros Elfos recebem +1/+1 e têm florestanismo.',{anth:{tr:'Elfo',n:1}}],
 'Imperious Perfect':['{2}{G}','creature','Elfo','2/2','Os outros Elfos recebem +1/+1. {G}, {T}: crie um Elfo 1/1.',{anth:{tr:'Elfo',n:1},act:1}],
 'Elvish Warmaster':['{1}{G}','creature','Elfo','2/2','Sempre que outro Elfo entra, crie um Elfo 1/1 (uma vez por turno).',{castTok:1}],
 'Dwynen\'s Elite':['{1}{G}','creature','Elfo','2/2','Quando entra, se você controla outro Elfo, crie um Elfo 1/1.',{tok:1}],
 'Heritage Druid':['{G}','creature','Elfo','1/1','Vire três Elfos desvirados: adicione {G}{G}{G}.',{mana:1}],
 'Elvish Harbinger':['{2}{G}','creature','Elfo','1/2','Quando entra, busque um Elfo e coloque no topo. {T}: adicione um mana.',{mana:1}],
 'Joraga Warcaller':['{G}','creature','Elfo','1/1','Multiplicador {1}{G}: entra com marcadores; os outros Elfos recebem +1/+1 por marcador.',{}],
 'Elvish Clancaller':['{G}{G}','creature','Elfo','1/1','Os outros Elfos recebem +1/+1.',{anth:{tr:'Elfo',n:1}}],
 'Marwyn, the Nurturer':['{2}{G}','creature','Elfo','1/1','Cresce sempre que outro Elfo entra. {T}: adicione {G} igual ao poder.',{mana:1}],
 'Lys Alana Huntmaster':['{2}{G}{G}','creature','Elfo','3/3','Sempre que você conjura um Elfo, você pode criar um Elfo 1/1.',{castTok:1}],
 'Wellwisher':['{1}{G}','creature','Elfo','1/1','{T}: ganhe 1 de vida para cada Elfo no campo.',{}],
 'Timberwatch Elf':['{2}{G}','creature','Elfo','1/2','{T}: uma criatura recebe +X/+X, onde X é o número de Elfos.',{}],
 'Llanowar Visionary':['{2}{G}','creature','Elfo','2/2','Quando entra, compre um card. {T}: adicione {G}.',{draw:1,mana:1}],
 'Reclamation Sage':['{2}{G}','creature','Elfo','2/1','Quando entra, você pode destruir um artefato ou encantamento.',{}],
 'Elvish Rejuvenator':['{2}{G}','creature','Elfo','1/1','Quando entra, olhe os 5 do topo e coloque um terreno no campo virado.',{ramp:{bf:1,hand:0}}],
 'Llanowar Tribe':['{G}{G}{G}','creature','Elfo','3/3','{T}: adicione {G}{G}{G}.',{mana:3}],
 'Elvish Eulogist':['{G}','creature','Elfo','1/1','Sacrifique: ganhe 1 de vida por Elfo no seu cemitério.',{}],
 'Elvish Pioneer':['{G}','creature','Elfo','1/1','Quando entra, você pode colocar um terreno básico da mão no campo virado.',{}],
 'Elvish Vanguard':['{1}{G}','creature','Elfo','1/1','Sempre que outro Elfo entra, recebe um marcador +1/+1.',{}],
 'Tireless Provisioner':['{2}{G}','creature','Elfo','3/2','Terraformação — crie um Alimento ou um Tesouro.',{}],
 'Leaf-Crowned Visionary':['{G}{G}','creature','Elfo','1/1','Os outros Elfos recebem +1/+1. Ao conjurar um Elfo, pague {G} para comprar um card.',{anth:{tr:'Elfo',n:1}}],
 'Sylvan Messenger':['{3}{G}','creature','Elfo','2/2','Atropelar. Quando entra, revele os 4 do topo e pegue os Elfos.',{draw:1}],
 'Beast Whisperer':['{2}{G}{G}','creature','Elfo','4/4','Sempre que você conjura uma criatura, compre um card.',{}],
 'Elvish Promenade':['{3}{G}','sorcery','','', 'Para cada Elfo que você controla, crie um Elfo 1/1.',{tokTr:'Elfo',tokPerTr:'Elfo'}],
 'Overrun':['{2}{G}{G}{G}','sorcery','','', 'Suas criaturas recebem +3/+3 e atropelar até o fim do turno.',{overrun:3}],
 'Guardian Project':['{3}{G}','enchantment','','', 'Sempre que uma criatura com nome novo entra, compre um card.',{}],
 'Cultivate':['{2}{G}','sorcery','','', 'Busque dois terrenos básicos: um no campo virado e outro na mão.',{ramp:{bf:1,hand:1}}],
 'Kodama\'s Reach':['{2}{G}','sorcery','','', 'Busque dois terrenos básicos: um no campo virado e outro na mão.',{ramp:{bf:1,hand:1}}],
 'Nature\'s Lore':['{1}{G}','sorcery','','', 'Busque uma Floresta e coloque-a no campo.',{ramp:{bf:1,hand:0,untapped:1}}],
 'Three Visits':['{1}{G}','sorcery','','', 'Busque uma Floresta e coloque-a no campo.',{ramp:{bf:1,hand:0,untapped:1}}],
 'Search for Tomorrow':['{2}{G}','sorcery','','', 'Busque um terreno básico e coloque-o no campo.',{ramp:{bf:1,hand:0,untapped:1}}],
 'Skyshroud Claim':['{3}{G}','sorcery','','', 'Busque duas Florestas e coloque-as no campo.',{ramp:{bf:2,hand:0,untapped:1}}],
 'Harrow':['{2}{G}','instant','','', 'Sacrifique um terreno: busque dois básicos e coloque-os no campo.',{ramp:{bf:1,hand:0,untapped:1}}],
 'Explore':['{1}{G}','sorcery','','', 'Você pode jogar um terreno adicional neste turno. Compre um card.',{draw:1,xland:1}],
 'Harmonize':['{2}{G}{G}','sorcery','','', 'Compre três cards.',{draw:3}],
 'Beast Within':['{2}{G}','instant','','', 'Destrua uma permanente. O controlador cria uma Fera 3/3.',{skip:1}],
 'Heroic Intervention':['{1}{G}','instant','','', 'Suas permanentes ganham resistência a magia e indestrutível até o fim do turno.',{skip:1}],
 'Return of the Wildspeaker':['{4}{G}','instant','','', 'Compre cards igual ao maior poder entre suas criaturas, ou criaturas recebem +3/+3.',{draw:3}],
 'Nature\'s Claim':['{G}','instant','','', 'Destrua um artefato ou encantamento.',{skip:1}]
};
for (const [n,[c,k,tr,pt,x,f]] of Object.entries(SIMDB)) {
  if (CARDS[n]) continue;
  const col = (c.match(/\{([WUBRG])\}/)||[])[1] || 'C';
  const cmc = (c.match(/\{(\d+)\}/g)||[]).reduce((a,s)=>a+ +s.slice(1,-1),0) + (c.match(/\{[WUBRG]\}/g)||[]).length;
  const tl = {creature:'Criatura',artifact:'Artefato',sorcery:'Feitiço',instant:'Mágica Instantânea',enchantment:'Encantamento'}[k] + (tr ? ' — ' + tr : '');
  CARDS[n] = {k, c, t: tl, x, p: pt || undefined, col, cmc}; CARD_ALIAS[n.toLowerCase()] = n;
}
const PT_TO_TRIBE = {Goblin:'Goblin',Elfo:'Elf',Elf:'Elf'};

/* listas de exemplo */
const SIM_DECKS = [
 {id:'krenko', n:'Krenko, Mob Boss (Commander, 100)', fmt:'commander', cmd:'Krenko, Mob Boss', land:'Mountain', lands:37,
  cards:['Sol Ring','Arcane Signet','Mind Stone','Fellwar Stone','Wayfarer\'s Bauble','Commander\'s Sphere','Thought Vessel','Fire Diamond','Ruby Medallion','Goblin Guide','Goblin Matron','Goblin Chieftain','Goblin King','Goblin Warchief','Skirk Prospector','Goblin Instigator','Beetleback Chief','Legion Warboss','Goblin Rabblemaster','Siege-Gang Commander','Mogg War Marshal','Krenko, Tin Street Kingpin','Battle Cry Goblin','Boggart Brute','Goblin Lackey','Goblin Piledriver','Goblin Sharpshooter','Mogg Fanatic','Goblin Bushwhacker','Goblin Cratermaker','Hellrider','Shivan Dragon','Goblin Chainwhirler','Goblin Heelcutter','Goblin Dark-Dwellers','Raging Goblin','Goblin Arsonist','Fanatical Firebrand','Gempalm Incinerator','Goblin Rally','Hordeling Outburst','Dragon Fodder','Krenko\'s Command','Goblin Bombardment','Impact Tremors','Lightning Bolt','Chaos Warp','Abrade','Blasphemous Act','Vandalblast','Shock','Searing Spear','Incinerate','Faithless Looting','Big Score','Light Up the Stage','Reckless Impulse','Thrill of Possibility','Tormenting Voice','Unexpected Windfall','Swiftfoot Boots','Lightning Greaves']},
 {id:'ezuri', n:'Ezuri, Renegade Leader (Commander, 100)', fmt:'commander', cmd:'Ezuri, Renegade Leader', land:'Forest', lands:38,
  cards:['Sol Ring','Arcane Signet','Mind Stone','Wayfarer\'s Bauble','Lightning Greaves','Swiftfoot Boots','Thought Vessel','Commander\'s Sphere','Fellwar Stone','Llanowar Elves','Elvish Mystic','Fyndhorn Elves','Birds of Paradise','Elvish Archdruid','Priest of Titania','Elvish Visionary','Wood Elves','Elvish Champion','Imperious Perfect','Elvish Warmaster','Dwynen\'s Elite','Heritage Druid','Elvish Harbinger','Joraga Warcaller','Elvish Clancaller','Marwyn, the Nurturer','Lys Alana Huntmaster','Wellwisher','Timberwatch Elf','Llanowar Visionary','Reclamation Sage','Elvish Rejuvenator','Llanowar Tribe','Elvish Eulogist','Elvish Pioneer','Elvish Vanguard','Tireless Provisioner','Leaf-Crowned Visionary','Sylvan Messenger','Beast Whisperer','Colossal Dreadmaw','Ambush Viper','Elvish Promenade','Overrun','Guardian Project','Rampant Growth','Cultivate','Kodama\'s Reach','Nature\'s Lore','Three Visits','Search for Tomorrow','Skyshroud Claim','Harrow','Explore','Harmonize','Beast Within','Heroic Intervention','Return of the Wildspeaker','Giant Growth','Blossoming Defense','Nature\'s Claim']},
 {id:'gruul', n:'Gruul Aggro de exemplo (60)', fmt:'60', text:SAMPLE_DECK},
 {id:'goblins60', n:'Goblins de exemplo (60)', fmt:'60', text:'4 Goblin Guide\n4 Raging Goblin\n4 Goblin Instigator\n4 Mogg War Marshal\n4 Goblin Chieftain\n4 Goblin King\n4 Goblin Rabblemaster\n4 Legion Warboss\n4 Lightning Bolt\n2 Hordeling Outburst\n2 Siege-Gang Commander\n20 Mountain'},
 {id:'mine', n:'O deck que está no Analisador', fmt:'auto'}
];
function simDeckList(d){
  if (d.cards) return {cmd:d.cmd, list:[...d.cards, ...Array(d.lands).fill(d.land)], life:40};
  const txt = d.id === 'mine' ? deckText : d.text;
  const ent = parseDeck(txt); const list = [];
  ent.forEach(e => { for (let i=0;i<e.q;i++) list.push(CARD_ALIAS[e.name.toLowerCase()] || e.name); });
  let cmd = null;
  if (list.length >= 95) { const c = ent.find(e => COMMANDERS.some(x=>x.n.toLowerCase()===e.name.toLowerCase())) || ent.find(e => { const dd = cardData(e.name); return dd && /Lend|Legend/.test(dd.t) && dd.k==='creature'; }); if (c) { cmd = CARD_ALIAS[c.name.toLowerCase()] || c.name; list.splice(list.indexOf(cmd), 1); } }
  return {cmd, list, life: list.length >= 95 ? 40 : 20};
}
/* lê dados de simulação de qualquer carta (base local ou trazida do Scryfall, texto em inglês ou português) */
const SIMCACHE = {};
function simOf(n){
  if (SIMCACHE[n]) return SIMCACHE[n];
  const d = cardData(n) || {k: BASICS.includes((n||'').toLowerCase()) ? 'land' : 'other', cmc:0, c:'', t:'', x:''};
  const db = SIMDB[n] ? SIMDB[n][5] : null;
  const x = (d.x || ''), xl = x.toLowerCase(), tl = d.t || '';
  const trM = tl.match(/—\s*([^\n]+)/); const sub = trM ? trM[1] : '';
  const tribe = /Goblin/.test(sub) ? 'Goblin' : /Elf|Elfo/.test(sub) ? 'Elfo' : sub.split(' ')[0] || '';
  const pw = d.p ? (parseInt(d.p) || 0) : 0;
  const words = {a:1,one:1,two:2,three:3,four:4,five:5,uma:1,duas:2,'três':3,quatro:4};
  let f = db ? Object.assign({}, db) : {};
  if (!db) {
    if (/\b(haste|ímpeto)\b/i.test(x)) f.haste = 1;
    if (/\b(defender|defensor)\b/i.test(x)) f.def = 1;
    if (d.k !== 'land' && /\{t\}:\s*(add|adicione)/i.test(x)) { const m = x.match(/(add|adicione)\s+((\{[WUBRGC]\})+)/i); f.mana = m ? (m[2].match(/\{/g)||[]).length : 1; }
    if (/search your library for (a|up to two) basic land|(busque|procure).*terreno básico/i.test(x)) f.ramp = {bf: /up to two|dois/i.test(x) ? 1 : 1, hand: /hand|mão/i.test(x) && /up to two|dois/i.test(x) ? 1 : 0};
    const dm = xl.match(/draws? (a|one|two|three) cards?|compre (um|dois|três) cards?/); if (dm) f.draw = words[dm[1]||dm[2]] || 1;
    const tm = xl.match(/create (a|one|two|three|four) [^.]*token|crie (uma|duas|três|quatro) fichas?/); if (tm) f.tok = words[tm[1]||tm[2]] || 1;
    const bm = xl.match(/deals (\d) damage to any target|causa (\d) pontos? de dano a qualquer alvo/); if (bm && (d.k==='instant'||d.k==='sorcery')) f.burn = +(bm[1]||bm[2]);
    if (/destroy|exile target|destrua|exile a/i.test(x) && (d.k==='instant'||d.k==='sorcery') && !f.draw && !f.tok && !f.burn) f.skip = 1;
    if (/counter target|anule a mágica/i.test(x)) f.skip = 1;
  }
  const o = {n, k:d.k, cmc:d.cmc||0, p:pw, tribe, f};
  SIMCACHE[n] = o; return o;
}

/* motor */
function newGame(spec, seed){
  const lib = shuffled(spec.list.map(n => n));
  const g = {t:0, lib, hand:[], lands:0, landsTapped:0, rocks:[], bf:[], tokens:{}, gy:[], cmd:spec.cmd, cmdZone:!!spec.cmd, cmdCasts:0, cmdT:null, life:spec.life, opp:spec.life, cmdDmg:0, dealt:0, log:[], won:null, extraLands:0, deathT:null, pendingLandsTapped:0};
  // mulligan simples: até 2 vezes se tiver 0–1 ou 6–7 terrenos (o primeiro em Commander é grátis)
  let mull = 0;
  for (;;) {
    g.hand = g.lib.slice(0, 7);
    const L = g.hand.filter(n => simOf(n).k === 'land').length;
    if ((L >= 2 && L <= 5) || mull >= 2) break;
    mull++; g.lib = shuffled(spec.list.map(n=>n));
  }
  g.lib = g.lib.slice(7);
  const free = spec.cmd ? 1 : 0, bottom = Math.max(0, mull - free);
  for (let i=0;i<bottom;i++) { // devolve ao fundo o card mais caro que não é terreno
    let idx = -1, best = -1; g.hand.forEach((n,j) => { const s = simOf(n); if (s.k!=='land' && s.cmc > best) { best = s.cmc; idx = j; } }); if (idx < 0) idx = 0;
    g.lib.push(g.hand.splice(idx,1)[0]);
  }
  if (mull) g.log.push({t:0, a:[`Mulligan ${mull}× (${spec.cmd && mull===1 ? 'o primeiro é grátis em Commander' : `${bottom} card(s) ao fundo`}).`]});
  return g;
}
function creaturesOf(g, tr){ let c = 0; g.bf.forEach(x => { if (x.tribe === tr) c++; }); return c + (g.tokens[tr] ? g.tokens[tr].n : 0); }
function powerOf(g, x){ let p = x.p; g.bf.forEach(y => { const a = y.f.anth; if (a && y !== x && x.tribe === a.tr) p += a.n; }); return Math.max(0, p); }
function simTurn(g){
  if (g.won) return;
  g.t++; const A = []; const t = g.t;
  // desvirar e comprar (quem começa não compra no 1º turno)
  g.landsTapped = g.pendingLandsTapped; g.pendingLandsTapped = 0;
  g.rocks.forEach(r => r.ready = true);
  g.bf.forEach(x => x.sick = false);
  Object.values(g.tokens).forEach(tk => { tk.ready += tk.sick; tk.sick = 0; });
  if (t > 1) { if (!g.lib.length) { g.won = 'deck'; A.push('Grimório vazio.'); g.log.push({t,a:A}); return; } const c = g.lib.shift(); g.hand.push(c); A.push(`Comprou <b>${esc(c)}</b>.`); }
  // terreno
  let landDrops = 1 + g.extraLands; g.extraLands = 0;
  const playLand = () => { const i = g.hand.findIndex(n => n === 'Terreno básico' || simOf(n).k === 'land'); if (i < 0) return false; const n = g.hand.splice(i,1)[0]; g.lands++; A.push(`Jogou ${esc(n)}.`); return true; };
  if (playLand()) landDrops--;
  // mana
  const hasteTr = () => g.bf.filter(x => x.f.hasteTr).map(x => x.f.hasteTr);
  const canTap = x => !x.sick || x.f.haste || hasteTr().includes(x.tribe);
  const manaAvail = () => {
    let m = g.lands - g.landsTapped;
    g.rocks.forEach(r => { if (r.ready) m += r.mana; });
    g.bf.forEach(x => { if (!canTap(x) || x.tapped) return; if (x.f.manaTr) m += creaturesOf(g, x.f.manaTr); else if (x.f.mana && x.k==='creature') m += x.f.mana; });
    return m;
  };
  let pool = manaAvail(); const startMana = pool;
  // ordem: aceleração → comandante → criaturas/fichas (mais caras primeiro) → compra → outros
  const prio = s => s.f.skip ? 99 : (s.k==='artifact' && (s.f.mana||s.f.ramp)) || (s.f.ramp && s.k!=='creature') || (s.k==='creature' && (s.f.mana||s.f.manaTr) && s.cmc<=2) ? 0 : s.f.draw && s.k!=='creature' ? 3 : (s.k==='creature' || s.f.tok || s.f.tokPerTr) ? 2 : s.f.overrun || s.f.burn ? 9 : 4;
  let progress = true, spent = 0;
  const cast = (n, cost, fromCmd) => {
    const s = simOf(n); pool -= cost; spent += cost;
    const enter = (name, tribe, p, f) => { const o = {n:name, k:'creature', tribe, p, f:f||{}, sick:true}; g.bf.push(o); if (g.bf.some(y => y.f.etb)) { const e = g.bf.filter(y=>y.f.etb).length; g.opp -= e; g.dealt += e; } return o; };
    if (fromCmd) { g.cmdZone = false; g.cmdCasts++; if (g.cmdT == null) g.cmdT = t; A.push(`Conjurou o comandante <b>${esc(n)}</b> da zona de comando por ${cost} mana${g.cmdCasts>1?' (com imposto)':''}.`); }
    else A.push(`Conjurou <b>${esc(n)}</b> (${cost}).`);
    if (s.k === 'land') { g.lands++; return; }
    if (s.k === 'artifact' && (s.f.mana)) { g.rocks.push({n, mana:s.f.mana, ready:!s.f.tapped}); if (!s.f.tapped) pool += s.f.mana; }
    else if (s.k === 'artifact' && s.f.ramp) { g.rocks.push({n, mana:0, ready:false, bauble:true}); }
    else if (s.k === 'creature') {
      const o = enter(n, s.tribe, s.p, s.f); if (fromCmd) o.isCmd = true;
      if (s.f.burnEtb) { g.opp -= s.f.burnEtb; g.dealt += s.f.burnEtb; }
      g.bf.filter(y => y.f.castTok && y !== o && y.tribe === s.tribe).forEach(() => addTok(s.tribe, 1));
    }
    else if (s.k === 'enchantment' || s.k === 'artifact') g.bf.push({n, k:s.k, tribe:'', p:0, f:s.f, sick:false, noncreature:true});
    if (s.f.ramp) { if (s.k !== 'artifact') { if (s.f.ramp.untapped) { g.lands += s.f.ramp.bf; pool += s.f.ramp.bf; } else { g.lands += s.f.ramp.bf; g.landsTapped += s.f.ramp.bf; g.pendingLandsTapped += 0; } if (s.f.ramp.hand) g.hand.push('Terreno básico'); A.push(`  → buscou ${s.f.ramp.bf + (s.f.ramp.hand||0)} terreno(s).`); } }
    if (s.f.draw) { for (let i=0;i<s.f.draw && g.lib.length;i++) g.hand.push(g.lib.shift()); if (s.f.discard) { for (let i=0;i<s.f.discard;i++) { const j = g.hand.findIndex(x => simOf(x).f.skip) ; g.gy.push(g.hand.splice(j>=0?j:0,1)[0]); } } A.push(`  → comprou ${s.f.draw}.`); }
    if (s.f.treas) { pool += s.f.treas; A.push(`  → ${s.f.treas} Tesouros.`); }
    if (s.f.tok && s.k !== 'creature') addTok(s.f.tokTr || 'Goblin', s.f.tok);
    if (s.f.tok && s.k === 'creature') addTok(s.tribe || 'Goblin', s.f.tok);
    if (s.f.tokPerTr) { const k = creaturesOf(g, s.f.tokPerTr); addTok(s.f.tokPerTr, k); }
    if (s.f.xland) landDrops++;
    if (s.f.burn) { g.opp -= s.f.burn; g.dealt += s.f.burn; A.push(`  → ${s.f.burn} de dano no oponente.`); }
    if (s.f.overrun) g.overrun = s.f.overrun;
    if (s.k === 'instant' || s.k === 'sorcery') g.gy.push(n);
  };
  const addTok = (tr, k) => { if (!k) return; const key = tr || 'Ficha'; g.tokens[key] = g.tokens[key] || {n:0, ready:0, sick:0}; g.tokens[key].n += k; g.tokens[key].sick += k; const e = g.bf.filter(y=>y.f.etb).length * k; if (e) { g.opp -= e; g.dealt += e; } A.push(`  → ${k} ficha(s) de ${tr} 1/1.`); };
  // bauble
  g.rocks.filter(r => r.bauble && r.ready).forEach(r => { if (pool >= 2) { pool -= 2; spent += 2; g.lands++; g.landsTapped++; g.rocks.splice(g.rocks.indexOf(r),1); A.push('Ativou Wayfarer\'s Bauble: buscou um terreno.'); } });
  while (progress) {
    progress = false;
    if (landDrops > 0 && playLand()) { landDrops--; pool++; progress = true; continue; }
    const cmdCost = g.cmd && g.cmdZone ? simOf(g.cmd).cmc + 2*g.cmdCasts : 99;
    const opts = g.hand.map((n,i) => ({n, i, s:simOf(n)})).filter(o => o.s.k !== 'land' && !o.s.f.skip && o.n !== 'Terreno básico');
    opts.sort((a,b) => prio(a.s) - prio(b.s) || b.s.cmc - a.s.cmc);
    const rampFirst = opts.find(o => prio(o.s) === 0 && o.s.cmc <= pool);
    if (rampFirst) { g.hand.splice(rampFirst.i,1); cast(rampFirst.n, rampFirst.s.cmc); progress = true; continue; }
    if (cmdCost <= pool) { cast(g.cmd, cmdCost, true); progress = true; continue; }
    const o = opts.find(o => prio(o.s) < 9 && o.s.cmc <= pool);
    if (o) { g.hand.splice(o.i,1); cast(o.n, o.s.cmc); progress = true; continue; }
  }
  // terrenos básicos buscados para a mão
  g.hand = g.hand.map(n => n === 'Terreno básico' ? 'Terreno básico' : n);
  if (landDrops > 0) { const i = g.hand.indexOf('Terreno básico'); if (i >= 0) { g.hand.splice(i,1); g.lands++; A.push('Jogou o terreno buscado.'); } }
  // habilidades de virar antes do combate: Krenko, Imperious Perfect
  g.bf.forEach(x => {
    if (x.n === 'Krenko, Mob Boss' && canTap(x)) { const k = creaturesOf(g, 'Goblin'); x.tapped = true; A.push(`Virou Krenko (há ${k} Goblins no campo):`); addTok('Goblin', k); }
    if (x.f.act && canTap(x) && pool >= 1) { pool--; x.tapped = true; addTok(x.tribe, 1); }
  });
  // Ezuri: +3/+3 nos Elfos com o mana que sobrou
  let ezuriBonus = 0;
  if (g.bf.some(x => x.n === 'Ezuri, Renegade Leader')) { while (pool >= 5) { pool -= 5; ezuriBonus += 3; } if (ezuriBonus) A.push(`Ativou Ezuri: Elfos +${ezuriBonus}/+${ezuriBonus}.`); }
  // fichas de combate
  g.bf.forEach(x => { if (x.f.ctok && (t > 1 || x.f.haste)) { addTok(x.tribe || 'Goblin', x.f.ctok); const tk = g.tokens[x.tribe || 'Goblin']; tk.sick -= x.f.ctok; tk.ready += x.f.ctok; } });
  // combate (sem bloqueadores)
  let dmg = 0, cmdHit = 0, attackers = 0;
  const bonus = x => (g.overrun||0) + (x.tribe === 'Elfo' ? ezuriBonus : 0);
  g.bf.forEach(x => { if (x.noncreature || x.tapped || x.f.def || !canTap(x)) return; if ((x.f.mana || x.f.manaTr) && x.p <= 1 && !g.overrun && !ezuriBonus) return; const p = powerOf(g, x) + bonus(x); if (p <= 0) return; attackers++; dmg += p; if (x.isCmd) cmdHit += p; });
  Object.entries(g.tokens).forEach(([tr, tk]) => { const ready = tk.ready + (hasteTr().includes(tr) ? tk.sick : 0); if (!ready) return; let p = 1; g.bf.forEach(y => { const a = y.f.anth; if (a && a.tr === tr) p += a.n; }); p += (g.overrun||0) + (tr==='Elfo'?ezuriBonus:0); attackers += ready; dmg += ready * p; });
  const ping = g.bf.filter(y => y.f.atkPing).length * attackers;
  if (attackers) { A.push(`Atacou com ${attackers} criatura(s): <b>${dmg + ping}</b> de dano${ping?` (inclui ${ping} do Hellrider)`:''}${cmdHit?`, ${cmdHit} do comandante`:''}.`); }
  g.opp -= dmg + ping; g.dealt += dmg + ping; g.cmdDmg += cmdHit;
  // dano direto guardado: usa no fim do turno se houver mana
  g.hand.slice().forEach(n => { const s = simOf(n); if (s.f.burn && s.cmc <= pool) { pool -= s.cmc; g.hand.splice(g.hand.indexOf(n),1); g.opp -= s.f.burn; g.dealt += s.f.burn; A.push(`Fim do turno: ${esc(n)} no oponente (${s.f.burn}).`); } });
  g.overrun = 0; g.bf.forEach(x => x.tapped = false);
  if (!A.length) A.push('Sem jogadas.');
  A.push(`<span class="muted">Mana disponível: ${startMana} · terrenos: ${g.lands} · vida do oponente: ${Math.max(0,g.opp)}</span>`);
  if (g.opp <= 0) { g.won = 'vida'; g.deathT = t; A.push(`<b>Oponente derrotado no turno ${t}.</b>`); }
  else if (g.cmdDmg >= 21) { g.won = 'cmd'; g.deathT = t; A.push(`<b>21 de dano de comandante no turno ${t}!</b>`); }
  // descarte na limpeza
  while (g.hand.length > 7 && !g.bf.some(x=>x.n==='Thought Vessel') && !g.rocks.some(r=>r.n==='Thought Vessel')) g.gy.push(g.hand.pop());
  g.mana = startMana;
  g.log.push({t, a:A});
}
function runMany(spec, N, maxT){
  const kill = Array(maxT+2).fill(0), mana4 = [], cmdT = [], screw = [];
  let sumKill = 0, killed = 0;
  for (let i=0;i<N;i++) {
    const g = newGame(spec); let m4 = 0;
    for (let t=1;t<=maxT && !g.won;t++) { simTurn(g); if (t===4) { m4 = g.mana; screw.push(g.lands < 3 ? 1 : 0); } }
    mana4.push(m4); if (g.cmdT) cmdT.push(g.cmdT);
    if (g.deathT) { kill[g.deathT]++; sumKill += g.deathT; killed++; } else kill[maxT+1]++;
  }
  const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0;
  return {N, kill, avgKill: killed ? sumKill/killed : null, pKill: killed/N, mana4: avg(mana4), cmdT: avg(cmdT), cmdP: cmdT.length/N, screw: avg(screw), maxT};
}

/* interface */
let simSel = 'krenko', simGame = null, simSpec = null, simStats = null;
function renderSim(box){
  const d = SIM_DECKS.find(x => x.id === simSel);
  box.innerHTML = `
   <div class="panel stack-v">
     <h3>Simulador de partidas</h3>
     <p class="muted">Joga o deck sozinho, sem oponente interagindo ("goldfish"), para mostrar como ele se desenvolve turno a turno: mana, comandante, criaturas e dano. É assim que veteranos testam se um deck está rápido o suficiente.</p>
     <div class="pick">${SIM_DECKS.map(x=>`<button data-sd="${x.id}" aria-pressed="${simSel===x.id}"><b>${x.n}</b><small>${x.fmt==='commander'?'40 de vida · zona de comando · imposto':x.fmt==='60'?'20 de vida':'Use o Analisador para colar sua lista'}</small></button>`).join('')}</div>
     ${d.cmd ? `<div class="row-h">${cardHTML(d.cmd,{cls:'mini',showPt:false})}<p style="flex:1;min-width:200px">Comandante: <b>${esc(d.cmd)}</b>. A lista completa tem ${d.cards.length + d.lands + 1} cartas: ${d.cards.length} mágicas e ${d.lands} ${d.land==='Forest'?'Florestas':'Montanhas'}. <button class="cref" id="simToAn">Abrir a lista no Analisador</button></p></div>` : ''}
     <div class="row-h"><button class="btn primary" id="simNew">Nova partida passo a passo</button><button class="btn" id="simMany">Simular 1.000 partidas</button></div>
   </div>
   <div id="simPlay"></div>
   <div id="simStats"></div>
   <div class="tip" style="margin-top:14px">O simulador é uma aproximação: o oponente não bloqueia nem remove nada, e cada carta é jogada por regras simples (acelerar mana → comandante → criaturas → compra). Cartas de remoção e anulações ficam na mão. Use os números para comparar versões do mesmo deck, não como previsão exata.</div>`;
  $$('[data-sd]', box).forEach(b => b.onclick = () => { simSel = b.dataset.sd; simGame = null; simStats = null; renderSim(box); });
  const ta = $('#simToAn'); if (ta) ta.onclick = () => { deckText = `1 ${d.cmd}\n` + Object.entries(d.cards.reduce((m,n)=>(m[n]=(m[n]||0)+1,m),{})).map(([n,q])=>`${q} ${n}`).join('\n') + `\n${d.lands} ${d.land}`; deckFormat = '100'; DECK = null; hand = null; deckTab = 'analise'; show('decks'); };
  $('#simNew').onclick = () => { simSpec = simDeckList(d); if (simSpec.list.length < 20) { toast('O deck do Analisador está vazio ou pequeno demais.'); return; } simGame = newGame(simSpec); drawSim(); };
  $('#simMany').onclick = () => { simSpec = simDeckList(d); if (simSpec.list.length < 20) { toast('O deck do Analisador está vazio ou pequeno demais.'); return; } $('#simStats').innerHTML = '<div class="panel" style="margin-top:14px"><p class="muted">Simulando…</p></div>'; setTimeout(() => { simStats = runMany(simSpec, 1000, simSpec.life === 40 ? 14 : 10); drawStats(); if (!S.simDone) { S.simDone = true; save(); addXP(30); } }, 30); };
  if (simGame) drawSim(); if (simStats) drawStats();
}
function drawSim(){
  const g = simGame, box = $('#simPlay'); if (!box || !g) return;
  const toks = Object.entries(g.tokens).filter(([,v])=>v.n).map(([k,v])=>`<span class="pill" style="font-size:.8rem">${v.n}× ficha ${esc(k)} 1/1</span>`).join(' ');
  const pct = Math.max(0, g.opp) / simSpec.life * 100;
  box.innerHTML = `
   <div class="panel stack-v" style="margin-top:14px">
     <div class="row-h" style="justify-content:space-between"><h3 style="margin:0">Turno ${g.t}</h3>
       <div class="row-h"><button class="btn small" id="simStep" ${g.won||g.t>=20?'disabled':''}>Próximo turno</button><button class="btn small" id="simAll" ${g.won||g.t>=20?'disabled':''}>Até o fim</button></div></div>
     <div class="stack-v" style="gap:6px"><div class="row-h" style="justify-content:space-between"><span class="eyebrow">Vida do oponente</span><span class="mono">${Math.max(0,g.opp)} / ${simSpec.life}${simSpec.cmd?` · dano de comandante ${g.cmdDmg}/21`:''}</span></div><div class="bar"><i style="width:${pct}%;background:var(--bad)"></i></div></div>
     <div class="board" style="gap:8px">
       <div class="side-head"><span>Seu campo</span><span class="life">${g.lands} terrenos${g.rocks.length?` · ${g.rocks.length} artefatos de mana`:''}</span></div>
       ${simSpec.cmd ? `<div class="row-h" style="font-size:.85rem">Zona de comando: ${g.cmdZone ? `<b>${esc(simSpec.cmd)}</b> (custa ${simOf(simSpec.cmd).cmc + 2*g.cmdCasts})` : 'vazia: o comandante está no campo'}</div>` : ''}
       <div class="zone ${g.bf.length?'':'empty'}" data-empty="Nenhuma permanente além de terrenos" style="min-height:90px">${g.bf.map(x=>cardHTML(x.n,{cls:'mini', p: x.k==='creature' ? `${powerOf(g,x)}/${(cardData(x.n)&&cardData(x.n).p||'?/?').split('/')[1]}` : undefined, showPt: x.k==='creature', note: x.isCmd?'Comandante':undefined})).join('')}${g.rocks.map(r=>cardHTML(r.n,{cls:'mini',showPt:false})).join('')}</div>
       ${toks?`<div class="row-h">${toks}</div>`:''}
       <div class="hand-zone"><span class="lbl">Mão (${g.hand.length})</span>${g.hand.map(n=>n==='Terreno básico'?`<span class="pill">Terreno básico</span>`:cardHTML(n,{cls:'mini',showPt:false})).join('')}</div>
     </div>
     <div class="log">${g.log.slice().reverse().map(l=>`<div class="log-step"><h4>${l.t ? 'Turno ' + l.t : 'Mão inicial'}</h4><ul>${l.a.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
   </div>`;
  const step = () => { simTurn(g); if (g.won) sfx('win'); else sfx('tap'); drawSim(); };
  $('#simStep').onclick = step;
  $('#simAll').onclick = () => { while (!g.won && g.t < 20) simTurn(g); sfx(g.won?'win':'no'); drawSim(); };
}
function drawStats(){
  const s = simStats, box = $('#simStats'); if (!box || !s) return;
  const W = 520, H = 180, pad = 26, n = s.maxT + 1, bw = (W - pad*2) / n, max = Math.max(...s.kill.slice(1));
  let g = '';
  for (let t=1; t<=n; t++) { const v = s.kill[t] || 0, h = max ? v/max*(H-56) : 0, x = pad + (t-1)*bw + 3;
    g += `<rect x="${x}" y="${H-24-h}" width="${bw-6}" height="${h}" rx="3" fill="${t<=s.maxT?'var(--accent)':'var(--muted)'}"/>`;
    if (v) g += `<text class="lab" x="${x+(bw-6)/2}" y="${H-28-h}" text-anchor="middle">${Math.round(v/s.N*100)}%</text>`;
    g += `<text x="${x+(bw-6)/2}" y="${H-8}" text-anchor="middle">${t<=s.maxT?t:'+'}</text>`; }
  const isC = !!simSpec.cmd;
  box.innerHTML = `<div class="panel stack-v chart" style="margin-top:14px"><h3>Resultado de ${s.N} partidas simuladas</h3>
    <div class="tiles">
      <div class="stat"><div class="k">Turno médio da vitória</div><div class="v">${s.avgKill ? s.avgKill.toFixed(1) : '—'}</div></div>
      <div class="stat"><div class="k">Vence até o turno ${s.maxT}</div><div class="v">${Math.round(s.pKill*100)}%</div></div>
      <div class="stat"><div class="k">Mana no turno 4</div><div class="v">${s.mana4.toFixed(1)}</div></div>
      ${isC?`<div class="stat"><div class="k">Comandante sai, em média, no turno</div><div class="v">${s.cmdT ? s.cmdT.toFixed(1) : '—'}</div></div>`:''}
      <div class="stat"><div class="k">Menos de 3 terrenos no turno 4</div><div class="v">${Math.round(s.screw*100)}%</div></div>
    </div>
    <span class="eyebrow">Em que turno o oponente cai</span>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Distribuição do turno da vitória">${g}</svg>
    <p class="muted" style="font-size:.88rem">${isC ? 'Referência: decks casuais de Commander (brackets 2 e 3) costumam derrotar um oponente sem interação entre os turnos 8 e 11. Mais rápido que isso, avise a mesa.' : 'Referência: decks aggro de 60 cartas costumam vencer sem interação entre os turnos 4 e 6.'} A coluna "+" são partidas que não venceram no limite de turnos.</p></div>`;
}
