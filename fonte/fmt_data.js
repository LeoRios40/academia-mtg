/* ================= CARTAS EXTRAS (comandantes, ícones, planeswalkers) ================= */
Object.assign(CARDS, {
  'Krenko, Mob Boss':{k:'creature',c:'{2}{R}{R}',t:'Criatura Lendária — Goblin Guerreiro',x:'{T}: Crie X fichas de Goblin 1/1 vermelhas, onde X é o número de Goblins que você controla.',p:'3/3',col:'R',cmc:4},
  'Talrand, Sky Summoner':{k:'creature',c:'{2}{U}{U}',t:'Criatura Lendária — Tritão Mago',x:'Sempre que você conjura uma mágica instantânea ou feitiço, crie uma ficha de Dragonete 2/2 azul com voar.',p:'2/2',col:'U',cmc:4},
  'Light-Paws, Emperor\'s Voice':{k:'creature',c:'{1}{W}',t:'Criatura Lendária — Raposa Conselheira',x:'Sempre que uma Aura que você conjurou entra sob seu controle, você pode buscar no grimório outra Aura de valor de mana menor ou igual ao número de Auras que você controla e colocá-la no campo.',p:'2/2',col:'W',cmc:2},
  'Ezuri, Renegade Leader':{k:'creature',c:'{1}{G}{G}',t:'Criatura Lendária — Elfo Guerreiro',x:'{G}: Regenere outro Elfo alvo. {2}{G}{G}{G}: Os Elfos que você controla recebem +3/+3 e ganham atropelar até o final do turno.',p:'2/2',col:'G',cmc:3},
  'Sheoldred, Whispering One':{k:'creature',c:'{5}{B}{B}',t:'Criatura Lendária — Phyrexiano Pretor',x:'Pantanoambulante. No início da sua manutenção, devolva uma criatura do seu cemitério ao campo. No início da manutenção de cada oponente, ele sacrifica uma criatura.',p:'6/6',col:'B',cmc:7},
  'Sythis, Harvest\'s Hand':{k:'creature',c:'{G}{W}',t:'Criatura Encantamento Lendária — Ninfa',x:'Sempre que você conjura um encantamento, ganhe 1 de vida e compre um card.',p:'1/2',col:'M',cmc:2},
  'Lathril, Blade of the Elves':{k:'creature',c:'{2}{B}{G}',t:'Criatura Lendária — Elfo Nobre',x:'Ameaçar. Sempre que causa dano de combate a um jogador, crie essa quantidade de fichas de Elfo 1/1. {T}, vire dez Elfos: cada oponente perde 10 de vida e você ganha 10.',p:'2/3',col:'M',cmc:4},
  'Tatyova, Benthic Druid':{k:'creature',c:'{3}{G}{U}',t:'Criatura Lendária — Tritão Druida',x:'Terraformação — Sempre que um terreno entra sob seu controle, ganhe 1 de vida e compre um card.',p:'3/3',col:'M',cmc:5},
  'Prosper, Tome-Bound':{k:'creature',c:'{2}{B}{R}',t:'Criatura Lendária — Tiferino Bruxo',x:'Toque mortífero. No início da sua etapa final, exile o card do topo; você pode jogá-lo até o fim do próximo turno. Sempre que você joga um card do exílio, crie um Tesouro.',p:'1/3',col:'M',cmc:4},
  'Edgar Markov':{k:'creature',c:'{3}{R}{W}{B}',t:'Criatura Lendária — Vampiro Cavaleiro',x:'Eminência — sempre que você conjura outro Vampiro, mesmo com Edgar na zona de comando, crie um Vampiro 1/1. Iniciativa, ímpeto. Ao atacar, coloque um marcador +1/+1 em cada Vampiro seu.',p:'4/4',col:'M',cmc:6},
  'Muldrotha, the Gravetide':{k:'creature',c:'{3}{B}{G}{U}',t:'Criatura Lendária — Elemental Avatar',x:'Em cada um dos seus turnos, você pode jogar um terreno e conjurar uma mágica de permanente de cada tipo do seu cemitério.',p:'6/6',col:'M',cmc:6},
  'Miirym, Sentinel Wyrm':{k:'creature',c:'{3}{G}{U}{R}',t:'Criatura Lendária — Dragão Espírito',x:'Voar, resguardo {2}. Sempre que outro Dragão que não seja ficha entra sob seu controle, crie uma cópia dele, exceto que não é lendária.',p:'6/6',col:'M',cmc:6},
  'Atraxa, Praetors\' Voice':{k:'creature',c:'{G}{W}{U}{B}',t:'Criatura Lendária — Phyrexiano Anjo Horror',x:'Voar, vigilância, toque mortífero, vínculo com a vida. No início da sua etapa final, prolifere.',p:'4/4',col:'M',cmc:4},
  'The Ur-Dragon':{k:'creature',c:'{4}{W}{U}{B}{R}{G}',t:'Criatura Lendária — Dragão Avatar',x:'Eminência — seus Dragões custam {1} a menos. Voar. Sempre que Dragões seus atacam, compre essa quantidade de cards e então você pode colocar uma permanente da mão no campo.',p:'10/10',col:'M',cmc:10},

  'Black Lotus':{k:'artifact',c:'{0}',t:'Artefato',x:'{T}, Sacrifique Black Lotus: Adicione três manas de uma única cor qualquer.',col:'C',cmc:0},
  'Ancestral Recall':{k:'instant',c:'{U}',t:'Mágica Instantânea',x:'O jogador alvo compra três cards.',col:'U',cmc:1},
  'Shivan Dragon':{k:'creature',c:'{4}{R}{R}',t:'Criatura — Dragão',x:'Voar. {R}: Shivan Dragon recebe +1/+0 até o final do turno.',p:'5/5',col:'R',cmc:6},
  'Sol Ring':{k:'artifact',c:'{1}',t:'Artefato',x:'{T}: Adicione {C}{C}.',col:'C',cmc:1},
  'Birds of Paradise':{k:'creature',c:'{G}',t:'Criatura — Ave',x:'Voar. {T}: Adicione um mana de qualquer cor.',p:'0/1',col:'G',cmc:1},
  'Dark Ritual':{k:'instant',c:'{B}',t:'Mágica Instantânea',x:'Adicione {B}{B}{B}.',col:'B',cmc:1},
  'Storm Crow':{k:'creature',c:'{1}{U}',t:'Criatura — Ave',x:'Voar.',p:'1/2',col:'U',cmc:2},
  'Tarmogoyf':{k:'creature',c:'{1}{G}',t:'Criatura — Lhurgoyf',x:'O poder é igual ao número de tipos de card entre os cards em todos os cemitérios e a resistência é esse número mais 1.',p:'*/1+*',col:'G',cmc:2},
  'Emrakul, the Aeons Torn':{k:'creature',c:'{15}',t:'Criatura Lendária — Eldrazi',x:'Não pode ser anulada. Ao conjurá-la, tome um turno extra. Voar, proteção contra mágicas coloridas, aniquilador 6. Volta ao grimório se for ao cemitério.',p:'15/15',col:'C',cmc:15},
  'Jace, the Mind Sculptor':{k:'planeswalker',c:'{2}{U}{U}',t:'Planeswalker Lendário — Jace',x:'+2: Olhe o topo do grimório de um jogador. 0: Compre três cards e coloque dois de volta. −1: Devolva uma criatura à mão. −12: Exile o grimório de um oponente.',l:3,col:'U',cmc:4},
  'Liliana of the Veil':{k:'planeswalker',c:'{1}{B}{B}',t:'Planeswalker Lendário — Liliana',x:'+1: Cada jogador descarta um card. −2: O jogador alvo sacrifica uma criatura. −6: Separe as permanentes de um jogador em duas pilhas; ele sacrifica uma.',l:3,col:'B',cmc:3},
  'Nicol Bolas, Dragon-God':{k:'planeswalker',c:'{U}{B}{B}{B}{R}',t:'Planeswalker Lendário — Bolas',x:'Tem todas as habilidades de lealdade dos outros planeswalkers no campo. +1: Compre e cada oponente exila um card. −3: Destrua uma criatura ou planeswalker. −8: Vitória quase certa.',l:4,col:'M',cmc:5},
  'Teferi, Hero of Dominaria':{k:'planeswalker',c:'{3}{W}{U}',t:'Planeswalker Lendário — Teferi',x:'+1: Compre um card. No fim do turno, desvire até dois terrenos. −3: Coloque uma permanente não terreno no grimório. −8: Emblema.',l:4,col:'M',cmc:5},
  'Karn Liberated':{k:'planeswalker',c:'{7}',t:'Planeswalker Lendário — Karn',x:'+4: O jogador alvo exila um card da mão. −3: Exile uma permanente. −14: Reinicie o jogo.',l:6,col:'C',cmc:7},
  'Ugin, the Spirit Dragon':{k:'planeswalker',c:'{8}',t:'Planeswalker Lendário — Ugin',x:'+2: 3 de dano a qualquer alvo. −X: Exile cada permanente com valor de mana X ou menos que tenha uma ou mais cores. −10: Ganhe 7 de vida, compre 7 e coloque até 7 permanentes no campo.',l:7,col:'C',cmc:8},
  'Nissa, Who Shakes the World':{k:'planeswalker',c:'{3}{G}{G}',t:'Planeswalker Lendário — Nissa',x:'Florestas geram {G} adicional. +1: Transforme um terreno em criatura 5/5. −8: Busque todas as Florestas do grimório.',l:5,col:'G',cmc:5},
  'Ajani Goldmane':{k:'planeswalker',c:'{2}{W}{W}',t:'Planeswalker Lendário — Ajani',x:'+1: Ganhe 2 de vida. −1: Marcador +1/+1 e vigilância em cada criatura sua. −6: Crie um Avatar branco com P/R igual à sua vida.',l:4,col:'W',cmc:4},
  'Gideon, Ally of Zendikar':{k:'planeswalker',c:'{2}{W}{W}',t:'Planeswalker Lendário — Gideon',x:'+1: Vira uma criatura 5/5 indestrutível até o fim do turno. 0: Crie um Soldado Aliado 2/2. −4: Emblema +1/+1 para suas criaturas.',l:4,col:'W',cmc:4}
});

/* ================= COMANDANTES DE EXEMPLO ================= */
const COMMANDERS = [
 {n:'Krenko, Mob Boss',id:'R',lv:'Fácil',arch:'Fichas · Goblins',plan:'Multiplique goblins virando Krenko todo turno e ataque com um exército.',why:'Plano claro e cartas baratas. Você entende rápido por que ganha ou perde.',watch:'Krenko é frágil: proteja-o com botas como Swiftfoot Boots.'},
 {n:'Talrand, Sky Summoner',id:'U',lv:'Médio',arch:'Mágicas · Voadores',plan:'Cada instantâneo ou feitiço vira um dragonete 2/2 voador.',why:'Ensina a jogar com instantâneos e a guardar mana no turno dos outros.',watch:'Exige atenção à pilha e ao momento certo de agir.'},
 {n:'Light-Paws, Emperor\'s Voice',id:'W',lv:'Médio',arch:'Auras · Voltron',plan:'Encante Light-Paws com várias Auras e vença com dano de comandante.',why:'Mostra como funciona o "Voltron": uma criatura enorme e bem protegida.',watch:'Uma remoção na hora errada leva várias Auras junto.'},
 {n:'Ezuri, Renegade Leader',id:'G',lv:'Fácil',arch:'Tribal · Elfos',plan:'Encha o campo de elfos que geram mana e dê +3/+3 a todos para o golpe final.',why:'Verde é a cor mais simples de pilotar e elfos são baratos.',watch:'Mesas com muitas Cóleras (board wipes) atrapalham.'},
 {n:'Sheoldred, Whispering One',id:'B',lv:'Médio',arch:'Reanimação',plan:'Coloque criaturas no cemitério e traga uma de volta a cada turno.',why:'Ensina a usar o cemitério como recurso, uma marca do preto.',watch:'Custa 7: você precisa de bastante aceleração de mana.'},
 {n:'Sythis, Harvest\'s Hand',id:'GW',lv:'Fácil',arch:'Encantamentos',plan:'Cada encantamento conjurado compra um card e ganha vida.',why:'Compra cards o jogo todo sem esforço. Ótimo para quem gosta de construir com calma.',watch:'Precisa de muitos encantamentos (30 ou mais).'},
 {n:'Lathril, Blade of the Elves',id:'BG',lv:'Fácil',arch:'Tribal · Elfos',plan:'Ataque para criar elfos e vire dez deles para drenar 10 de cada oponente.',why:'Tem uma forma de vencer escrita no próprio card.',watch:'Sem criaturas no campo, o plano trava.'},
 {n:'Tatyova, Benthic Druid',id:'GU',lv:'Fácil',arch:'Terrenos · Ramp',plan:'Jogue terrenos extras para comprar cards e ganhar vida o tempo todo.',why:'Mostra o valor de acelerar mana e ter cartas sobrando.',watch:'Pouca pressão no começo; precisa de criaturas grandes para fechar.'},
 {n:'Prosper, Tome-Bound',id:'BR',lv:'Médio',arch:'Exílio · Tesouros',plan:'Jogue cards do exílio todo turno e gere Tesouros para acelerar.',why:'Vantagem de cards garantida sem precisar de combos.',watch:'Exige saber quais cards jogar do exílio antes que expirem.'},
 {n:'Edgar Markov',id:'RWB',lv:'Médio',arch:'Tribal · Vampiros',plan:'Cada Vampiro conjurado gera outro, mesmo com Edgar na zona de comando.',why:'Funciona mesmo que Edgar nunca entre no campo (Eminência).',watch:'Três cores pedem uma base de mana mais cuidadosa.'},
 {n:'Muldrotha, the Gravetide',id:'BGU',lv:'Difícil',arch:'Cemitério · Valor',plan:'Use o cemitério como uma segunda mão: rejogue permanentes todo turno.',why:'Favorito dos veteranos para jogos longos e cheios de decisões.',watch:'Muitas opções por turno; deixa a partida mais lenta.'},
 {n:'Miirym, Sentinel Wyrm',id:'GUR',lv:'Médio',arch:'Tribal · Dragões',plan:'Cada Dragão que entra vem com uma cópia.',why:'Dragões são o sonho de todo fã, e o efeito é fácil de entender.',watch:'Dragões são caros: invista em ramp.'},
 {n:'Atraxa, Praetors\' Voice',id:'WUBG',lv:'Médio',arch:'Marcadores',plan:'Prolifere todo turno: marcadores +1/+1, lealdade, veneno.',why:'Um dos comandantes mais famosos; aceita estratégias muito diferentes.',watch:'Quatro cores: comece por uma versão pré-construída.'},
 {n:'The Ur-Dragon',id:'WUBRG',lv:'Médio',arch:'Tribal · Dragões',plan:'Dragões mais baratos, compra de cards ao atacar e dragões extras direto da mão.',why:'Todas as cores disponíveis, com o tema favorito dos fãs.',watch:'Base de mana de cinco cores é cara e difícil.'}
];
const CMD_STAPLES = [
 ['C','Incolor (qualquer deck)','Sol Ring, Arcane Signet, Command Tower, Mind Stone, Fellwar Stone, Swiftfoot Boots, Lightning Greaves, Wayfarer\'s Bauble'],
 ['W','Branco','Swords to Plowshares, Path to Exile, Generous Gift, Wrath of God, Mentor of the Meek, Sun Titan'],
 ['U','Azul','Counterspell, Arcane Denial, Pongify, Fact or Fiction, Reality Shift, Rapid Hybridization'],
 ['B','Preto','Infernal Grasp, Feed the Swarm, Damnation, Night\'s Whisper, Phyrexian Arena, Village Rites'],
 ['R','Vermelho','Chaos Warp, Blasphemous Act, Vandalblast, Big Score, Abrade, Faithless Looting'],
 ['G','Verde','Cultivate, Kodama\'s Reach, Rampant Growth, Nature\'s Lore, Beast Within, Heroic Intervention, Guardian Project']
];
const STAPLE_BY = {
  C:{ramp:['Sol Ring','Arcane Signet','Mind Stone','Fellwar Stone','Wayfarer\'s Bauble'],prot:['Swiftfoot Boots','Lightning Greaves'],land:['Command Tower']},
  W:{rem:['Swords to Plowshares','Path to Exile','Generous Gift'],wipe:['Wrath of God'],draw:['Mentor of the Meek']},
  U:{rem:['Pongify','Rapid Hybridization','Counterspell','Arcane Denial'],draw:['Fact or Fiction']},
  B:{rem:['Infernal Grasp','Feed the Swarm'],wipe:['Damnation'],draw:['Night\'s Whisper','Phyrexian Arena']},
  R:{rem:['Chaos Warp','Abrade'],wipe:['Blasphemous Act'],draw:['Faithless Looting'],ramp:['Big Score']},
  G:{ramp:['Cultivate','Kodama\'s Reach','Rampant Growth','Nature\'s Lore'],rem:['Beast Within'],prot:['Heroic Intervention'],draw:['Guardian Project']}
};

/* ================= FORMATOS ================= */
const FORMATS = [
 {k:'commander',n:'Commander',deck:'100 (1 comandante + 99)',cop:'1 de cada',life:'40',pool:'Quase todas as cartas da história',cost:3,where:'Mesa, MTGO',players:'3 a 4',novato:5,tag:'O mais jogado nas lojas e entre amigos'},
 {k:'padrao',n:'Padrão (Standard)',deck:'60+ e até 15 no sideboard',cop:'4',life:'20',pool:'Coleções dos últimos ~3 anos',cost:2,where:'Mesa, Arena, MTGO',players:'2',novato:5,tag:'O formato das coleções novas'},
 {k:'pioneer',n:'Pioneer',deck:'60+ / 15',cop:'4',life:'20',pool:'De Return to Ravnica (2012) em diante',cost:3,where:'Mesa, Arena, MTGO',players:'2',novato:3,tag:'Um passo além do Padrão, sem rotação'},
 {k:'modern',n:'Modern',deck:'60+ / 15',cop:'4',life:'20',pool:'Da 8ª Edição (2003) em diante + produtos Modern Horizons',cost:4,where:'Mesa, MTGO',players:'2',novato:2,tag:'Rápido e poderoso, sem rotação'},
 {k:'pauper',n:'Pauper',deck:'60+ / 15',cop:'4',life:'20',pool:'Só cartas impressas como comuns',cost:1,where:'Mesa, MTGO, eventos no Arena',players:'2',novato:4,tag:'Competitivo e barato'},
 {k:'legacy',n:'Legacy e Vintage',deck:'60+ / 15',cop:'4 (Vintage tem lista de restritas: 1 cópia)',life:'20',pool:'Toda a história do jogo',cost:5,where:'Mesa (com proxies em muitas lojas), MTGO',players:'2',novato:1,tag:'As cartas mais lendárias e caras'},
 {k:'brawl',n:'Brawl (Arena)',deck:'100 com comandante (ou 60 no Brawl Padrão)',cop:'1 de cada',life:'Menor que no Commander de mesa',pool:'Cartas do Arena',cost:1,where:'Arena',players:'2',novato:4,tag:'O "Commander" do Arena, partidas 1×1'},
 {k:'limitado',n:'Limitado (Draft e Selado)',deck:'40+ montado na hora',cop:'Quantas abrir',life:'20',pool:'Pacotes abertos no evento',cost:2,where:'Mesa, Arena, MTGO',players:'2 (evento de 8)',novato:4,tag:'Pré-lançamentos: a melhor porta de entrada na loja'}
];
const BRACKETS = [
 ['1','Exibição','Decks temáticos ou de brincadeira. Vale até carta fora do comum combinada com a mesa.','Sem Game Changers, sem destruição em massa de terrenos, sem combos de vitória instantânea, sem turnos extras em sequência.'],
 ['2','Básico (Core)','O nível de um deck pré-construído típico. Jogos sociais e previsíveis.','Sem Game Changers. Sem combos de 2 cartas, sem destruição em massa de terrenos. Poucos tutores.'],
 ['3','Aprimorado (Upgraded)','Deck melhorado com cartas fortes e boa sinergia.','Até 3 Game Changers. Sem destruição em massa de terrenos. Combos de 2 cartas só a partir do meio do jogo.'],
 ['4','Otimizado','Deck o mais forte possível, sem pensar em ambiente de torneio.','Sem restrições além da lista de banidas.'],
 ['5','cEDH','Commander competitivo: a lista mais eficiente possível para vencer rápido.','Sem restrições além da lista de banidas, com mentalidade de torneio.']
];

/* ================= ETIQUETA E MESA ================= */
const PHRASES = [
 ['Passo.','Pass / Go','Terminei o que queria fazer nesta etapa ou turno.'],
 ['Resolve?','Resolves?','Pergunta se o oponente vai responder à sua mágica antes que ela aconteça.'],
 ['Em resposta…','In response…','Você vai usar algo antes que o item do topo da pilha resolva.'],
 ['Vou para o combate.','Move to combat','Avisa que acabou a fase principal. O oponente pode agir no início do combate.'],
 ['Ataco com estes, em você.','Attack with these, at you','Declare quem ataca e quem é o alvo (jogador ou planeswalker).'],
 ['Sem bloqueios.','No blocks','O defensor não vai bloquear.'],
 ['Fim do seu turno, eu…','End of turn, I…','Você usa um instantâneo na etapa final do oponente.'],
 ['Pode cortar?','Cut?','Depois de embaralhar, você oferece o deck para o oponente cortar.'],
 ['Mão boa, mantenho.','Keep','Você não vai fazer mulligan.'],
 ['Mulligan para seis.','Mull to six','Você devolve a mão e compra 7 de novo; depois coloca 1 no fundo.'],
 ['Quantos cards na mão?','How many cards?','Sempre pode perguntar. O número de cards na mão é informação pública.'],
 ['Boa partida!','GG (good game)','Aperte a mão e agradeça, ganhando ou perdendo.']
];
const SLANG = [
 ['ETB','Enters the battlefield: "quando entra no campo".'],['LTB','Leaves the battlefield: "quando sai do campo".'],
 ['MV / CMC','Valor de mana (antigo "custo de mana convertido").'],['Removal / Remoção','Card que tira uma ameaça.'],
 ['Wipe / Sweeper / Cólera','Remove todas as criaturas.'],['Ramp','Acelerar a mana acima de 1 terreno por turno.'],
 ['Staple','Carta presente em muitos decks do formato.'],['Netdeck','Deck copiado de uma lista da internet.'],
 ['Meta','Os decks mais jogados no momento.'],['Sideboard','Os 15 cards de troca entre partidas de uma Melhor de 3.'],
 ['Proxy','Cópia impressa no lugar da carta original. Aceita em jogos casuais quando o grupo concorda; não vale em torneio oficial.'],
 ['Foil','Versão brilhante (holográfica) de uma carta.'],['Precon','Deck pré-construído vendido pronto.'],
 ['Pod','O grupo de 3 ou 4 jogadores de Commander.'],['Rule 0 / Regra zero','A conversa antes da partida de Commander sobre o nível dos decks.'],
 ['Salt / Sal','Irritação com uma jogada. "Carta salgada" é a que deixa a mesa irritada.'],['Kingmaking','Decidir quem vence entre os outros quando você já não pode vencer.'],
 ['Value','Ganhar recursos aos poucos, como cards e fichas.'],['Combo','Combinação de cartas que vence ou trava o jogo.'],
 ['Tutor','Card que busca outro card específico no grimório.'],['Brick','Card que comprou e não serve para nada naquele momento.'],
 ['Topdeck','Card do topo do grimório; "vencer no topdeck" é comprar justo a carta certa.'],['Mana base','Os terrenos do deck e como geram cada cor.'],
 ['Fetch / Shock / Dual','Tipos de terrenos não básicos famosos.'],['Goldfish','Testar o deck sozinho, sem oponente, para ver a velocidade.'],
 ['Mono / Bicolor','Deck de uma cor / de duas cores.'],['Voltron','Uma criatura cheia de equipamentos e auras.'],
 ['Yard','Apelido do cemitério (graveyard): "essa foi pro yard".'],['Tapete (playmat)','Tapete onde se joga; protege as cartas.'],
 ['Sleeve / Shield','Protetor de plástico de cada carta.']
];
const ETQ_Q = [
 {q:'Você acabou de embaralhar seu deck no início da partida. O que faz a seguir?',o:['Oferece o deck para o oponente embaralhar ou cortar','Começa a comprar a mão','Pede para ver o deck do oponente'],a:0,e:'É o costume em toda mesa: depois de embaralhar, apresente o deck ao oponente.'},
 {q:'O oponente pergunta quantos cards você tem na mão. Você:',o:['Responde: é informação pública','Diz que não precisa contar','Mostra as cartas'],a:0,e:'A quantidade de cards na mão, no grimório e no cemitério é pública. O conteúdo da mão é que é oculto.'},
 {q:'Numa partida de Commander na loja, antes de começar, o grupo pergunta o bracket do seu deck. O melhor é:',o:['Dizer o bracket e o que o deck faz, sem esconder combos','Dizer "é um deck casual" para todos','Não responder para manter a surpresa'],a:0,e:'A conversa da "regra zero" serve para todos terem um jogo equilibrado. Seja honesto.'},
 {q:'Você não tem certeza se uma interação entre duas cartas funciona. O que fazer numa loja?',o:['Perguntar ao grupo ou chamar um juiz','Fazer do jeito que é melhor para você','Desistir da jogada sem perguntar'],a:0,e:'Chamar um juiz é normal e não é ofensa. Em jogos casuais, perguntar ao grupo também resolve.'},
 {q:'Você vira três terrenos e conjura uma criatura. Como mostrar isso direito?',o:['Vire os terrenos de forma clara, mostre o card e diga o nome','Coloque o card direto no campo sem falar','Esconda os terrenos virados'],a:0,e:'Jogue de forma clara: o oponente precisa saber o que aconteceu para decidir se responde.'},
 {q:'O oponente fez uma jogada errada que o prejudica, sem querer. Num jogo casual:',o:['Avise com gentileza e deixe ele decidir','Fique quieto e aproveite','Corrija a jogada dele sem perguntar'],a:0,e:'Em jogos casuais a cortesia conta muito. Em torneios, siga o que o juiz orientar.'},
 {q:'Você perdeu feio para um deck muito forte. Qual a atitude esperada?',o:['Apertar a mão, dizer "boa partida" e, se quiser, perguntar como o deck funciona','Reclamar do deck dele','Sair sem falar nada'],a:0,e:'Veteranos adoram explicar seus decks. É assim que você aprende mais rápido.'}
];
const BEFORE_CHK = ['Deck com protetores (sleeves) iguais em todas as cartas','Dado ou contador de vida (ou um app no celular)','Marcadores e fichas (tokens) que o deck usa','Saber o bracket do deck (Commander) e o que ele faz','Lista do deck anotada (obrigatória em torneios)','Embaralhar bem: várias vezes, de formas diferentes','Tapete (opcional, protege as cartas)'];

/* ================= QUIZ EXTRA ================= */
QUIZ.push(
 {c:'Formatos',q:'Em Commander, qual é a vida inicial?',o:['40','20','30','25'],a:0,e:'E o dano de comandante: 21 de um mesmo comandante elimina o jogador.'},
 {c:'Formatos',q:'Quantos cards tem um deck de Commander?',o:['Exatamente 100, contando o comandante','60 no mínimo','99 sem o comandante e mais 15 de sideboard','Pelo menos 100'],a:0,e:'São 99 cards + o comandante, uma cópia de cada (exceto terrenos básicos).'},
 {c:'Formatos',q:'O que define as cores permitidas num deck de Commander?',o:['A identidade de cor do comandante, incluindo símbolos de mana no texto','Só o custo do comandante','As cores dos terrenos','Qualquer cor é permitida'],a:0,e:'Uma carta com {R} no texto é vermelha para a identidade de cor, mesmo sem {R} no custo.'},
 {c:'Formatos',q:'Seu comandante morreu duas vezes e voltou à zona de comando. Quanto custa a mais para conjurá-lo agora?',o:['{4}','{2}','Nada','{6}'],a:0,e:'O "imposto de comandante" é {2} adicional para cada vez anterior que você o conjurou da zona de comando.'},
 {c:'Formatos',q:'O que significa a rotação do Padrão?',o:['As coleções mais antigas saem do formato periodicamente','O deck gira entre os jogadores','Os terrenos mudam de cor','As cartas banidas voltam'],a:0,e:'O Padrão usa cerca de três anos de coleções; as mais antigas saem quando o ciclo avança.'},
 {c:'Formatos',q:'Qual formato só aceita cartas impressas como comuns?',o:['Pauper','Pioneer','Modern','Brawl'],a:0,e:'Por isso é o formato competitivo mais barato.'},
 {c:'Formatos',q:'Para que serve o sideboard de 15 cards?',o:['Trocar cards entre as partidas de uma Melhor de 3','Comprar cards extras durante o jogo','Guardar fichas','Substituir terrenos destruídos'],a:0,e:'Depois do primeiro jogo, você adapta o deck contra o oponente.'},
 {c:'Formatos',q:'No MTG Arena, para que servem os curingas (wildcards)?',o:['Trocar por qualquer carta da mesma raridade','Comprar pacotes','Pular a vez','Ganhar ouro'],a:0,e:'Existem curingas comuns, incomuns, raros e míticos.'},
 {c:'Formatos',q:'Qual é o melhor evento na loja para um novato que nunca jogou com desconhecidos?',o:['Pré-lançamento (Selado)','Torneio competitivo de Legacy','Campeonato regional','Nenhum, só online'],a:0,e:'Todos começam com cards novos e ninguém tem vantagem de coleção.'},
 {c:'Mesa',q:'O número de cards na mão do oponente é:',o:['Informação pública','Secreto','Só revelado no fim do turno','Revelado se ele perder vida'],a:0,e:'O conteúdo é oculto, a quantidade é pública.'},
 {c:'Mesa',q:'O que é a "Regra zero" em Commander?',o:['A conversa antes do jogo para alinhar o nível e o estilo dos decks','Um card banido','Começar com 0 de vida','Proibir combos sempre'],a:0,e:'Os brackets de 1 a 5 ajudam nessa conversa.'},
 {c:'Mesa',q:'Chamar um juiz durante um torneio é:',o:['Normal; serve para tirar dúvidas e corrigir erros','Uma acusação contra o oponente','Proibido para novatos','Motivo de desclassificação'],a:0,e:'Juízes estão lá para ajudar os dois jogadores.'}
);
