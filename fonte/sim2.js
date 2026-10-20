/* ================= MAIS COMMANDERS NO SIMULADOR: Talrand e Lathril ================= */
const SIMDB2 = {
 'Talrand, Sky Summoner':['{2}{U}{U}','creature','Tritão','2/2','Sempre que você conjura uma mágica instantânea ou feitiço, crie uma ficha de Dragonete 2/2 com voar.',{spellTok:{tr:'Dragonete',p:2}}],
 'Lathril, Blade of the Elves':['{2}{B}{G}','creature','Elfo','2/3','Ameaçar. Causa dano de combate: crie essa quantidade de Elfos 1/1. Vire dez Elfos: cada oponente perde 10.',{lathril:1}],
 'Sapphire Medallion':['{2}','artifact','','', 'Artefato. Suas mágicas azuis custam {1} a menos.',{mana:1}],
 'Brainstorm':['{U}','instant','','', 'Compre três cards e coloque dois de volta no topo.',{draw:1}],
 'Ponder':['{U}','sorcery','','', 'Olhe os três do topo, reordene ou embaralhe, e compre um card.',{draw:1}],
 'Preordain':['{U}','sorcery','','', 'Vidência 2 e compre um card.',{draw:1}],
 'Consider':['{U}','instant','','', 'Olhe o topo, pode colocá-lo no cemitério, e compre um card.',{draw:1}],
 'Impulse':['{1}{U}','instant','','', 'Olhe os quatro do topo, pegue um e coloque o resto no fundo.',{draw:1}],
 'Think Twice':['{1}{U}','instant','','', 'Compre um card. Pode ser conjurado de novo do cemitério.',{draw:1}],
 'Chart a Course':['{1}{U}','sorcery','','', 'Compre dois cards; descarte um se não atacou neste turno.',{draw:2,discard:1}],
 'Fact or Fiction':['{3}{U}','instant','','', 'Revele cinco cards; o oponente separa em duas pilhas e você fica com uma.',{draw:3}],
 'Frantic Search':['{2}{U}','instant','','', 'Compre dois, descarte dois e desvire até três terrenos.',{draw:2,discard:2,treas:3}],
 'Anticipate':['{1}{U}','instant','','', 'Olhe os três do topo e pegue um.',{draw:1}],
 'Peek':['{U}','instant','','', 'Olhe a mão de um jogador e compre um card.',{draw:1}],
 'Deep Analysis':['{3}{U}','sorcery','','', 'Compre dois cards. Pode ser conjurado de novo do cemitério.',{draw:2}],
 'Accumulated Knowledge':['{1}{U}','instant','','', 'Compre um card mais um para cada cópia no cemitério.',{draw:1}],
 'Sleight of Hand':['{U}','sorcery','','', 'Olhe os dois do topo e pegue um.',{draw:1}],
 'Serum Visions':['{U}','sorcery','','', 'Compre um card e vidência 2.',{draw:1}],
 'Thirst for Knowledge':['{2}{U}','instant','','', 'Compre três e descarte dois (ou um artefato).',{draw:3,discard:2}],
 'Compulsive Research':['{2}{U}','sorcery','','', 'Compre três e descarte dois (ou um terreno).',{draw:3,discard:2}],
 'Words of Wisdom':['{1}{U}','instant','','', 'Compre dois; cada outro jogador compra um.',{draw:2}],
 'Quick Study':['{2}{U}','instant','','', 'Compre dois cards.',{draw:2}],
 'Inspiration':['{3}{U}','instant','','', 'O jogador alvo compra dois cards.',{draw:2}],
 'Counsel of the Soratami':['{2}{U}','sorcery','','', 'Compre dois cards.',{draw:2}],
 'Tidings':['{3}{U}{U}','sorcery','','', 'Compre quatro cards.',{draw:4}],
 'Sift':['{3}{U}','sorcery','','', 'Compre três e descarte um.',{draw:3,discard:1}],
 'Telling Time':['{1}{U}','instant','','', 'Olhe os três do topo: um na mão, um no topo e um no fundo.',{draw:1}],
 'Strategic Planning':['{1}{U}','sorcery','','', 'Olhe os três do topo, pegue um e coloque o resto no cemitério.',{draw:1}],
 'Talrand\'s Invocation':['{2}{U}{U}','sorcery','','', 'Crie duas fichas de Elemental 2/2 azuis com voar.',{tok:2,tokTr:'Elemental',tokP:2}],
 'Repulse':['{2}{U}','instant','','', 'Devolva a criatura alvo à mão do dono. Compre um card.',{skip:1}],
 'Arcane Denial':['{1}{U}','instant','','', 'Anule a mágica alvo. O controlador compra dois e você compra um no próximo turno.',{skip:1}],
 'Negate':['{1}{U}','instant','','', 'Anule a mágica alvo que não seja de criatura.',{skip:1}],
 'Mana Leak':['{1}{U}','instant','','', 'Anule a mágica alvo, a menos que o controlador pague {3}.',{skip:1}],
 'Swan Song':['{U}','instant','','', 'Anule um encantamento, instantâneo ou feitiço; o controlador cria um Pássaro 2/2.',{skip:1}],
 'Dissolve':['{1}{U}{U}','instant','','', 'Anule a mágica alvo. Vidência 1.',{skip:1}],
 'Essence Scatter':['{1}{U}','instant','','', 'Anule a mágica de criatura alvo.',{skip:1}],
 'Delay':['{1}{U}','instant','','', 'Anule a mágica alvo e exile-a com marcadores de tempo.',{skip:1}],
 'Into the Roil':['{1}{U}','instant','','', 'Devolva uma permanente não terreno à mão. Com reforço, compre um card.',{skip:1}],
 'Rapid Hybridization':['{U}','instant','','', 'Destrua a criatura alvo; o controlador cria um Lagarto 3/3.',{skip:1}],
 'Pongify':['{U}','instant','','', 'Destrua a criatura alvo; o controlador cria um Macaco 3/3.',{skip:1}],
 'Reality Shift':['{1}{U}','instant','','', 'Exile a criatura alvo; o controlador manifesta o card do topo.',{skip:1}],
 'Blink of an Eye':['{1}{U}','instant','','', 'Devolva uma permanente não terreno à mão. Com reforço, compre um card.',{skip:1}],
 'Capsize':['{1}{U}{U}','instant','','', 'Devolva uma permanente à mão. Rebote {3}.',{skip:1}],
 'Aetherize':['{3}{U}','instant','','', 'Devolva todas as criaturas atacantes à mão do dono.',{skip:1}],
 'Murmuring Mystic':['{3}{U}','creature','Humano Mago','1/5','Sempre que você conjura um instantâneo ou feitiço, crie um Pássaro Ilusão 1/1 com voar.',{spellTok:{tr:'Pássaro',p:1},def:1}],
 'Archmage Emeritus':['{2}{U}{U}','creature','Humano Mago','2/2','Magia — Sempre que você conjura ou copia um instantâneo ou feitiço, compre um card.',{spellDraw:1}],
 'Infernal Grasp':['{1}{B}','instant','','', 'Destrua a criatura alvo. Você perde 2 de vida.',{skip:1}],
 'Feed the Swarm':['{1}{B}','sorcery','','', 'Destrua uma criatura ou encantamento de um oponente; perca vida igual ao valor de mana.',{skip:1}],
 'Night\'s Whisper':['{1}{B}','sorcery','','', 'Você compra dois cards e perde 2 de vida.',{draw:2}],
 'Village Rites':['{B}','instant','','', 'Sacrifique uma criatura: compre dois cards.',{skip:1}],
 'Phyrexian Arena':['{1}{B}{B}','enchantment','','', 'No início da sua manutenção, compre um card e perca 1 de vida.',{}],
 'Damnation':['{2}{B}{B}','sorcery','','', 'Destrua todas as criaturas.',{skip:1}],
 'Shaman of the Pack':['{1}{B}{G}','creature','Elfo','3/2','Quando entra, o oponente alvo perde vida igual ao número de Elfos que você controla.',{drainTr:'Elfo'}],
 'Elderfang Disciple':['{1}{B}','creature','Elfo','1/1','Quando entra, o oponente alvo descarta um card.',{}],
 'Elderfang Ritualist':['{2}{B}','creature','Elfo','3/1','Quando morre, devolva outro card de Elfo do cemitério para a mão.',{}],
 'Poison-Tip Archer':['{2}{B}{G}','creature','Elfo','2/3','Alcance, toque mortífero. Sempre que outra criatura morre, cada oponente perde 1 de vida.',{}],
 'Jaspera Sentinel':['{G}','creature','Elfo','1/2','Alcance. Vire com outra criatura: adicione um mana de qualquer cor.',{}]
};
for (const [n,[c,k,tr,pt,x,f]] of Object.entries(SIMDB2)) {
  SIMDB[n] = [c,k,tr,pt,x,f];
  if (!CARDS[n]) {
    const col = (c.match(/\{([WUBRG])\}/g)||[]).map(s=>s[1]); const cmc = (c.match(/\{(\d+)\}/g)||[]).reduce((a,s)=>a+ +s.slice(1,-1),0) + (c.match(/\{[WUBRG]\}/g)||[]).length;
    const tl = {creature:'Criatura',artifact:'Artefato',sorcery:'Feitiço',instant:'Mágica Instantânea',enchantment:'Encantamento'}[k] + (tr ? ' — ' + tr : '');
    CARDS[n] = {k, c, t: tl, x, p: pt || undefined, col: new Set(col).size > 1 ? 'M' : (col[0] || 'C'), cmc}; CARD_ALIAS[n.toLowerCase()] = n;
  }
}
['Unsummon','Counterspell','Opt','Divination','Wind Drake','Cloudkin Seer','Air Elemental','Man-o\'-War','Phantom Warrior'].forEach(n => { if (!SIMDB[n]) { const d = CARDS[n]; if (!d) return; SIMDB[n] = [d.c, d.k, '', d.p||'', d.x, d.k==='instant'&&/Anule|Devolva/.test(d.x) ? {skip:1} : n==='Opt' ? {draw:1} : n==='Divination' ? {draw:2} : n==='Cloudkin Seer' ? {draw:1} : {}]; } });
Object.keys(SIMCACHE).forEach(k => delete SIMCACHE[k]);
SIM_DECKS.splice(2, 0,
 {id:'talrand', n:'Talrand, Sky Summoner (Commander, 100)', fmt:'commander', cmd:'Talrand, Sky Summoner', land:'Island', lands:37,
  cards:['Sol Ring','Arcane Signet','Mind Stone','Fellwar Stone','Thought Vessel','Commander\'s Sphere','Sapphire Medallion','Wayfarer\'s Bauble','Opt','Brainstorm','Ponder','Preordain','Consider','Impulse','Think Twice','Chart a Course','Divination','Fact or Fiction','Frantic Search','Anticipate','Peek','Deep Analysis','Accumulated Knowledge','Counterspell','Arcane Denial','Negate','Mana Leak','Swan Song','Dissolve','Essence Scatter','Delay','Unsummon','Into the Roil','Rapid Hybridization','Pongify','Reality Shift','Blink of an Eye','Capsize','Aetherize','Murmuring Mystic','Archmage Emeritus','Cloudkin Seer','Man-o\'-War','Air Elemental','Phantom Warrior','Wind Drake','Swiftfoot Boots','Lightning Greaves','Talrand\'s Invocation','Sleight of Hand','Serum Visions','Thirst for Knowledge','Compulsive Research','Words of Wisdom','Quick Study','Inspiration','Counsel of the Soratami','Tidings','Sift','Repulse','Telling Time','Strategic Planning']},
 {id:'lathril', n:'Lathril, Blade of the Elves (Commander, 100)', fmt:'commander', cmd:'Lathril, Blade of the Elves', land:'Forest', land2:'Swamp', lands:37,
  cards:['Sol Ring','Arcane Signet','Mind Stone','Commander\'s Sphere','Fellwar Stone','Wayfarer\'s Bauble','Lightning Greaves','Swiftfoot Boots','Llanowar Elves','Elvish Mystic','Fyndhorn Elves','Elvish Archdruid','Priest of Titania','Elvish Visionary','Wood Elves','Elvish Champion','Imperious Perfect','Elvish Warmaster','Dwynen\'s Elite','Heritage Druid','Elvish Harbinger','Joraga Warcaller','Elvish Clancaller','Marwyn, the Nurturer','Lys Alana Huntmaster','Wellwisher','Llanowar Visionary','Reclamation Sage','Elvish Rejuvenator','Llanowar Tribe','Elvish Eulogist','Tireless Provisioner','Leaf-Crowned Visionary','Sylvan Messenger','Beast Whisperer','Elvish Promenade','Overrun','Cultivate','Kodama\'s Reach','Rampant Growth','Nature\'s Lore','Three Visits','Harmonize','Beast Within','Heroic Intervention','Infernal Grasp','Feed the Swarm','Night\'s Whisper','Village Rites','Phyrexian Arena','Damnation','Shaman of the Pack','Elderfang Disciple','Elderfang Ritualist','Poison-Tip Archer','Jaspera Sentinel','Guardian Project','Explore','Harrow','Search for Tomorrow','Skyshroud Claim','Return of the Wildspeaker']}
);
/* listas com dois tipos de terreno básico */
const _simDeckList = simDeckList;
simDeckList = function(d){ if (d.cards && d.land2) { const half = Math.ceil(d.lands * 0.55); return {cmd:d.cmd, list:[...d.cards, ...Array(half).fill(d.land), ...Array(d.lands-half).fill(d.land2)], life:40}; } return _simDeckList(d); };
