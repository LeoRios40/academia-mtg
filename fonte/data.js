/* ================= DADOS: CARTAS =================
   k = tipo (land, creature, instant, sorcery, enchantment, artifact, planeswalker)
   c = custo, t = linha de tipo (PT), x = texto resumido (PT), p = poder/resistência, l = lealdade, col = cor da moldura */
const CARDS = {
  'Plains':{k:'land',c:'',t:'Terreno Básico — Planície',x:'{T}: Adicione {W}.',col:'W',cmc:0},
  'Island':{k:'land',c:'',t:'Terreno Básico — Ilha',x:'{T}: Adicione {U}.',col:'U',cmc:0},
  'Swamp':{k:'land',c:'',t:'Terreno Básico — Pântano',x:'{T}: Adicione {B}.',col:'B',cmc:0},
  'Mountain':{k:'land',c:'',t:'Terreno Básico — Montanha',x:'{T}: Adicione {R}.',col:'R',cmc:0},
  'Forest':{k:'land',c:'',t:'Terreno Básico — Floresta',x:'{T}: Adicione {G}.',col:'G',cmc:0},
  'Command Tower':{k:'land',c:'',t:'Terreno',x:'{T}: Adicione um mana de qualquer cor da identidade de cor do seu comandante.',col:'L',cmc:0},

  'Goblin Guide':{k:'creature',c:'{R}',t:'Criatura — Goblin Batedor',x:'Ímpeto. Sempre que ataca, o defensor revela o card do topo do grimório; se for terreno, coloca-o na mão.',p:'2/2',col:'R',cmc:1},
  'Monastery Swiftspear':{k:'creature',c:'{R}',t:'Criatura — Humano Monge',x:'Ímpeto. Destreza (sempre que você conjura uma mágica que não é criatura, ela recebe +1/+1 até o fim do turno).',p:'1/2',col:'R',cmc:1},
  'Lightning Bolt':{k:'instant',c:'{R}',t:'Mágica Instantânea',x:'Lightning Bolt causa 3 pontos de dano a qualquer alvo.',col:'R',cmc:1},
  'Boggart Brute':{k:'creature',c:'{2}{R}',t:'Criatura — Goblin Guerreiro',x:'Ameaçar (só pode ser bloqueada por duas ou mais criaturas).',p:'3/2',col:'R',cmc:3},
  'Chandra, Torch of Defiance':{k:'planeswalker',c:'{2}{R}{R}',t:'Planeswalker Lendário — Chandra',x:'+1: Exile o topo do grimório; você pode conjurá-lo, senão causa 2 de dano a cada oponente. +1: Adicione {R}{R}. −3: 4 de dano a uma criatura alvo. −7: Emblema.',l:4,col:'R',cmc:4},

  'Llanowar Elves':{k:'creature',c:'{G}',t:'Criatura — Elfo Druida',x:'{T}: Adicione {G}.',p:'1/1',col:'G',cmc:1},
  'Grizzly Bears':{k:'creature',c:'{1}{G}',t:'Criatura — Urso',x:'(Sem habilidades. O padrão de comparação de toda criatura de 2 manas.)',p:'2/2',col:'G',cmc:2},
  'Giant Spider':{k:'creature',c:'{3}{G}',t:'Criatura — Aranha',x:'Alcance (pode bloquear criaturas com voar).',p:'2/4',col:'G',cmc:4},
  'Centaur Courser':{k:'creature',c:'{2}{G}',t:'Criatura — Centauro Guerreiro',x:'(Sem habilidades.)',p:'3/3',col:'G',cmc:3},
  'Colossal Dreadmaw':{k:'creature',c:'{4}{G}{G}',t:'Criatura — Dinossauro',x:'Atropelar.',p:'6/6',col:'G',cmc:6},
  'Ghalta, Primal Hunger':{k:'creature',c:'{10}{G}{G}',t:'Criatura Lendária — Dinossauro Ancião',x:'Custa {X} a menos para conjurar, onde X é o poder total das criaturas que você controla. Atropelar.',p:'12/12',col:'G',cmc:12},
  'Giant Growth':{k:'instant',c:'{G}',t:'Mágica Instantânea',x:'A criatura alvo recebe +3/+3 até o final do turno.',col:'G',cmc:1},
  'Blossoming Defense':{k:'instant',c:'{G}',t:'Mágica Instantânea',x:'A criatura alvo que você controla recebe +2/+2 e ganha resistência a magia até o final do turno.',col:'G',cmc:1},
  'Rampant Growth':{k:'sorcery',c:'{1}{G}',t:'Feitiço',x:'Procure no grimório um card de terreno básico e coloque-o no campo de batalha virado. Depois embaralhe.',col:'G',cmc:2},
  'Ambush Viper':{k:'creature',c:'{1}{G}',t:'Criatura — Serpente',x:'Lampejo. Toque mortífero.',p:'2/1',col:'G',cmc:2},
  'Gladecover Scout':{k:'creature',c:'{G}',t:'Criatura — Elfo Batedor',x:'Resistência a magia.',p:'1/1',col:'G',cmc:1},

  'Serra Angel':{k:'creature',c:'{3}{W}{W}',t:'Criatura — Anjo',x:'Voar. Vigilância.',p:'4/4',col:'W',cmc:5},
  'White Knight':{k:'creature',c:'{W}{W}',t:'Criatura — Humano Cavaleiro',x:'Iniciativa. Proteção contra preto.',p:'2/2',col:'W',cmc:2},
  'Fencing Ace':{k:'creature',c:'{1}{W}',t:'Criatura — Humano Soldado',x:'Golpe duplo.',p:'1/1',col:'W',cmc:2},
  'Siege Mastodon':{k:'creature',c:'{4}{W}',t:'Criatura — Elefante',x:'(Sem habilidades.)',p:'3/5',col:'W',cmc:5},
  'Wall of Omens':{k:'creature',c:'{1}{W}',t:'Criatura — Muralha',x:'Defensor. Quando entra no campo de batalha, compre um card.',p:'0/4',col:'W',cmc:2},
  'Wrath of God':{k:'sorcery',c:'{2}{W}{W}',t:'Feitiço',x:'Destrua todas as criaturas. Elas não podem ser regeneradas.',col:'W',cmc:4},
  'Pacifism':{k:'enchantment',c:'{1}{W}',t:'Encantamento — Aura',x:'Encantar criatura. A criatura encantada não pode atacar nem bloquear.',col:'W',cmc:2},

  'Opt':{k:'instant',c:'{U}',t:'Mágica Instantânea',x:'Vidência 1. Compre um card.',col:'U',cmc:1},
  'Counterspell':{k:'instant',c:'{U}{U}',t:'Mágica Instantânea',x:'Anule a mágica alvo.',col:'U',cmc:2},
  'Divination':{k:'sorcery',c:'{2}{U}',t:'Feitiço',x:'Compre dois cards.',col:'U',cmc:3},
  'Tolarian Terror':{k:'creature',c:'{6}{U}',t:'Criatura — Serpente',x:'Custa {1} a menos para cada instantâneo e feitiço no seu cemitério. Resguardo {2}.',p:'5/5',col:'U',cmc:7},

  'Murder':{k:'instant',c:'{1}{B}{B}',t:'Mágica Instantânea',x:'Destrua a criatura alvo.',col:'B',cmc:3},
  'Bladebrand':{k:'instant',c:'{1}{B}',t:'Mágica Instantânea',x:'A criatura alvo ganha toque mortífero até o final do turno. Compre um card.',col:'B',cmc:2},
  'Vampire Nighthawk':{k:'creature',c:'{1}{B}{B}',t:'Criatura — Vampiro Xamã',x:'Voar. Toque mortífero. Vínculo com a vida.',p:'2/3',col:'B',cmc:3},
  'Duress':{k:'sorcery',c:'{B}',t:'Feitiço',x:'O oponente alvo revela a mão. Você escolhe um card que não seja de criatura nem de terreno. Ele descarta esse card.',col:'B',cmc:1},

  'Darksteel Myr':{k:'creature',c:'{3}',t:'Criatura Artefato — Myr',x:'Indestrutível.',p:'0/1',col:'C',cmc:3},
  'Bonesplitter':{k:'artifact',c:'{1}',t:'Artefato — Equipamento',x:'A criatura equipada recebe +2/+0. Equipar {1}.',col:'C',cmc:1},
  'Boros Swiftblade':{k:'creature',c:'{R}{W}',t:'Criatura — Humano Soldado',x:'Golpe duplo.',p:'1/2',col:'M',cmc:2}
};

/* ================= LIÇÕES ================= */
const C = (n, o={}) => Object.assign({n}, o);
const LESSONS = [
 {id:1, col:'W', title:'O primeiro turno', tag:'Terrenos · Mana · Ímpeto', steps:[
  {b:{opp:[],me:[],hand:['Mountain','Goblin Guide'],life:[20,20]},
   x:'É o seu primeiro turno. Na mão você tem uma [[Mountain]] e um [[Goblin Guide]], que custa {R}.',
   q:{ask:'O que você faz primeiro?',o:['Jogo a Montanha','Conjuro o Goblin Guide','Passo o turno sem jogar nada'],a:0,
   why:'Sem terreno não existe mana para pagar o {R}. Jogar terreno é uma ação especial: não usa a pilha e não pode ser respondida, mas o limite é 1 por turno.'}},
  {b:{opp:[],me:[C('Mountain',{st:'tapped'}),C('Goblin Guide',{note:'acabou de entrar'})],hand:[],life:[20,20]},
   x:'Você virou a Montanha, gerou {R} e conjurou o Goblin Guide.',
   q:{ask:'O Goblin acabou de entrar. Ele pode atacar neste mesmo turno?',o:['Sim, porque tem Ímpeto','Não, por causa do enjoo de invocação','Só se o oponente permitir'],a:0,
   why:'Normalmente a criatura precisa estar sob seu controle desde o início do turno para atacar. Ímpeto (Haste) ignora essa regra.'}},
  {b:{opp:[],me:[C('Mountain',{st:'tapped'}),C('Goblin Guide',{st:'tapped attacking'})],hand:[],life:[20,18]},
   x:'O Goblin ataca. O oponente não tem bloqueadores e recebe 2 de dano: vai de 20 para 18.',
   q:{ask:'No fim do seu turno, o que acontece com a Montanha virada?',o:['Fica virada até a etapa de desvirar do seu próximo turno','Desvira sozinha no fim do turno','Vai para o cemitério'],a:0,
   why:'Você só desvira suas permanentes no início do SEU turno. Por isso mana gasta no seu turno não está disponível para responder no turno do oponente.'}}
 ]},
 {id:2, col:'W', title:'Enjoo de invocação', tag:'Quem pode atacar, bloquear e virar', steps:[
  {b:{opp:[],me:[C('Forest',{st:'tapped'}),C('Forest'),C('Llanowar Elves',{note:'acabou de entrar'})],hand:['Grizzly Bears'],life:[20,20]},
   x:'Turno 2. Você usou uma Floresta para conjurar [[Llanowar Elves]]. Na mão sobrou [[Grizzly Bears]] ({1}{G}).',
   q:{ask:'Você pode virar o Llanowar Elves agora para ajudar a pagar os Grizzly Bears?',o:['Não: habilidades com {T} também sofrem enjoo de invocação','Sim, elfos geram mana no mesmo turno','Sim, mas só durante o combate'],a:0,
   why:'Uma criatura só usa habilidades com {T} se estiver com você desde o início do turno. Terrenos não sofrem enjoo de invocação; criaturas sim.'}},
  {b:{opp:[C('Centaur Courser',{st:'tapped attacking'})],me:[C('Forest'),C('Forest'),C('Llanowar Elves'),C('Grizzly Bears',{note:'entrou no seu turno'})],hand:[],life:[20,20]},
   x:'No turno seguinte do oponente, ele ataca com [[Centaur Courser]] (3/3). Seus Ursos entraram no seu último turno.',
   q:{ask:'Os Ursos podem bloquear?',o:['Sim: enjoo de invocação não impede bloquear','Não: ainda não passaram um turno inteiro','Só se tiverem Vigilância'],a:0,
   why:'Enjoo de invocação só afeta atacar e usar habilidades com {T}. Qualquer criatura desvirada pode bloquear.'}},
  {b:{opp:[C('Centaur Courser',{st:'tapped attacking'})],me:[C('Forest'),C('Forest'),C('Llanowar Elves'),C('Grizzly Bears',{st:'blocking'})],hand:[],life:[20,20]},
   x:'Você decide bloquear o Centauro com os Ursos.',
   q:{ask:'O que acontece no dano de combate?',o:['Os Ursos morrem; o Centauro sobrevive com 2 de dano','Os dois morrem','Ninguém morre'],a:0,
   why:'3 de dano é maior ou igual à resistência 2 dos Ursos. O Centauro recebe 2, menos que sua resistência 3. O dano marcado some na etapa de limpeza.'}},
  {b:{opp:[C('Centaur Courser',{st:'tapped',d:2})],me:[C('Forest'),C('Forest'),C('Llanowar Elves'),C('Grizzly Bears',{dead:true})],hand:[],life:[20,20]},
   x:'Você perdeu os Ursos, mas não perdeu 3 de vida. Bloquear sabendo que sua criatura vai morrer se chama <b>chump block</b>: vale a pena quando a vida está baixa ou quando o atacante é muito maior.'}
 ]},
 {id:3, col:'W', title:'Voar, Alcance e Vigilância', tag:'Evasão e defesa', steps:[
  {b:{opp:[C('Grizzly Bears'),C('Giant Spider')],me:[C('Serra Angel')],hand:[],life:[20,20]},
   x:'Seu [[Serra Angel]] (4/4, Voar, Vigilância) vai atacar. O oponente tem [[Grizzly Bears]] e [[Giant Spider]] (Alcance).',
   q:{ask:'Quais criaturas do oponente podem bloquear o Anjo?',o:['Só a Giant Spider','As duas','Nenhuma'],a:0,
   why:'Criaturas com Voar só podem ser bloqueadas por criaturas com Voar ou Alcance.'}},
  {b:{opp:[C('Grizzly Bears'),C('Giant Spider',{st:'blocking'})],me:[C('Serra Angel',{st:'attacking'})],hand:[],life:[20,20]},
   x:'O Anjo atacou e a Aranha bloqueou. Repare que o Anjo <b>não</b> virou ao atacar.',
   q:{ask:'Por que o Anjo continua desvirado?',o:['Vigilância','Voar','Ímpeto'],a:0,
   why:'Vigilância: atacar não faz a criatura virar. Ela continua disponível para bloquear no turno do oponente.'}},
  {b:{opp:[C('Grizzly Bears'),C('Giant Spider',{st:'blocking'})],me:[C('Serra Angel',{st:'attacking'})],hand:[],life:[20,20]},
   x:'Hora do dano: Anjo 4/4 contra Aranha 2/4.',
   q:{ask:'Qual é o resultado?',o:['A Aranha morre; o Anjo sobrevive com 2 de dano','O Anjo morre','As duas sobrevivem'],a:0,
   why:'O Anjo causa 4, igual à resistência 4 da Aranha. A Aranha causa só 2 ao Anjo, que tem resistência 4.'}},
  {b:{opp:[C('Grizzly Bears'),C('Giant Spider',{dead:true})],me:[C('Serra Angel',{d:2})],hand:[],life:[20,20]},
   x:'Alcance permite bloquear voadores, mas não dá força extra. Antes de bloquear, compare sempre poder e resistência dos dois lados.'}
 ]},
 {id:4, col:'R', title:'Iniciativa e Golpe Duplo', tag:'Quem bate primeiro', steps:[
  {b:{opp:[C('Grizzly Bears',{st:'blocking'})],me:[C('White Knight',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'Seu [[White Knight]] (2/2, Iniciativa) ataca e é bloqueado por [[Grizzly Bears]] (2/2).',
   q:{ask:'O que acontece?',o:['Só os Ursos morrem','Os dois morrem','Só o Cavaleiro morre'],a:0,
   why:'Com Iniciativa (First Strike) surge um passo de dano extra antes do normal. O Cavaleiro mata os Ursos nesse passo; no passo normal os Ursos já saíram e não batem de volta.'}},
  {b:{opp:[],me:[C('Fencing Ace',{st:'tapped attacking'})],hand:['Giant Growth'],life:[20,20]},
   x:'Agora você ataca com [[Fencing Ace]] (1/1, Golpe Duplo). O oponente não bloqueia.',
   q:{ask:'Quanto de dano o oponente recebe?',o:['2','1','4'],a:0,
   why:'Golpe Duplo causa dano nos dois passos: 1 no passo de Iniciativa e mais 1 no passo normal.'}},
  {b:{opp:[],me:[C('Fencing Ace',{st:'tapped attacking',note:'+3/+3',p:'4/4'})],hand:[],stack:['Giant Growth'],life:[20,20]},
   x:'Depois de confirmado que não há bloqueadores, você conjura [[Giant Growth]] no Fencing Ace.',
   q:{ask:'Quanto de dano o oponente recebe agora?',o:['8','5','4'],a:0,
   why:'O Ace vira 4/4 e causa 4 em cada passo: 4 + 4 = 8. Bônus de poder valem dobrado em criaturas com Golpe Duplo.'}},
  {b:{opp:[],me:[C('Fencing Ace',{st:'tapped attacking',note:'+3/+3',p:'4/4'})],hand:[],life:[20,12]},
   x:'Um card de 1 mana causou 6 de dano extra. Por isso criaturas com Golpe Duplo são alvos prioritários de remoção.'}
 ]},
 {id:5, col:'R', title:'Multibloqueio e Atropelar', tag:'Dividindo o dano', steps:[
  {b:{opp:[C('Centaur Courser',{st:'blocking'}),C('Centaur Courser',{st:'blocking'}),C('Centaur Courser',{st:'blocking'})],me:[C('Ghalta, Primal Hunger',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'[[Ghalta, Primal Hunger]] (12/12, Atropelar) ataca. O oponente bloqueia com três [[Centaur Courser]] (3/3).',
   q:{ask:'Qual é o máximo de dano que chega ao oponente?',o:['3','12','0','9'],a:0,
   why:'Para atropelar, você precisa atribuir dano letal a todos os bloqueadores primeiro: 3 + 3 + 3 = 9. Sobram 3 para o jogador.'}},
  {b:{opp:[C('Centaur Courser',{st:'blocking'}),C('Centaur Courser',{st:'blocking'}),C('Centaur Courser',{st:'blocking'})],me:[C('Ghalta, Primal Hunger',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'Cada Centauro também causa dano ao Ghalta.',
   q:{ask:'O Ghalta sobrevive?',o:['Sim, com 9 de dano marcado','Não, recebeu dano demais','Não recebe dano nenhum'],a:0,
   why:'3 + 3 + 3 = 9, menor que a resistência 12. O dano some na limpeza do turno.'}},
  {b:{opp:[C('Centaur Courser',{dead:true}),C('Centaur Courser',{dead:true}),C('Centaur Courser',{dead:true})],me:[C('Ghalta, Primal Hunger',{st:'tapped',d:9})],hand:[],life:[20,17]},
   x:'Três criaturas destruídas e 3 de dano no oponente. Pelas regras atuais (desde Foundations, 2024), o atacante divide o dano livremente entre os bloqueadores, sem ordem fixa. Atropelar continua exigindo dano letal em cada bloqueador antes de passar o excesso ao jogador.'}
 ]},
 {id:6, col:'B', title:'Toque Mortífero + Atropelar', tag:'A combinação mais forte do combate', steps:[
  {b:{opp:[C('Siege Mastodon',{st:'blocking'})],me:[C('Colossal Dreadmaw',{st:'tapped attacking'}),C('Swamp'),C('Forest')],hand:['Bladebrand'],life:[20,20]},
   x:'[[Colossal Dreadmaw]] (6/6, Atropelar) ataca e é bloqueado por [[Siege Mastodon]] (3/5). Você tem Pântano e Floresta desvirados e [[Bladebrand]] ({1}{B}) na mão.',
   q:{ask:'Sem truques, quanto dano atropela para o oponente?',o:['1','6','0','3'],a:0,
   why:'Dano letal no Mastodonte é 5, a resistência dele. 6 − 5 = 1.'}},
  {b:{opp:[C('Siege Mastodon',{st:'blocking'})],me:[C('Colossal Dreadmaw',{st:'tapped attacking',note:'Toque Mortífero'}),C('Swamp',{st:'tapped'}),C('Forest',{st:'tapped'})],hand:[],stack:['Bladebrand'],life:[20,20]},
   x:'Você vira os dois terrenos e conjura Bladebrand no Dreadmaw, que ganha Toque Mortífero.',
   q:{ask:'E agora, quanto atropela?',o:['5','1','6'],a:0,
   why:'Com Toque Mortífero, 1 ponto de dano já é letal. Você atribui 1 ao Mastodonte e 5 vão para o jogador. E Bladebrand ainda compra um card.'}},
  {b:{opp:[C('Siege Mastodon',{st:'blocking'})],me:[C('Colossal Dreadmaw',{st:'tapped attacking',note:'Toque Mortífero'}),C('Swamp',{st:'tapped'}),C('Forest',{st:'tapped'})],hand:[],life:[20,20]},
   x:'O momento em que você conjura o truque faz toda a diferença.',
   q:{ask:'Quando Bladebrand rende mais?',o:['Depois que o bloqueador foi declarado','Na fase principal, antes de atacar','Na etapa final do turno'],a:0,
   why:'Se você conjurar antes, o oponente vê o Toque Mortífero e simplesmente não bloqueia. Truques de combate brilham depois dos bloqueios.'}},
  {b:{opp:[C('Siege Mastodon',{dead:true})],me:[C('Colossal Dreadmaw',{st:'tapped',d:3}),C('Swamp',{st:'tapped'}),C('Forest',{st:'tapped'})],hand:[],life:[20,15]},
   x:'O Mastodonte morreu, o Dreadmaw sobreviveu com 3 de dano e o oponente foi a 15. Teste outras combinações na aba <b>Combate</b>.'}
 ]},
 {id:7, col:'U', title:'A Pilha: responder e anular', tag:'Último a entrar, primeiro a sair', steps:[
  {b:{opp:[C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'})],me:[C('Colossal Dreadmaw',{st:'target'}),C('Forest')],hand:['Blossoming Defense'],stack:['Murder'],life:[20,20]},
   x:'O oponente conjura [[Murder]] (instantâneo) mirando seu Dreadmaw. A mágica vai para a <b>pilha</b> e espera.',
   q:{ask:'Você tem uma Floresta desvirada e [[Blossoming Defense]]. Ainda dá para salvar o Dreadmaw?',o:['Sim, respondendo com um instantâneo','Não, Murder já destruiu','Só no meu próximo turno'],a:0,
   why:'Mágicas na pilha ainda não aconteceram. Antes de cada item resolver, os jogadores recebem prioridade para responder.'}},
  {b:{opp:[C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'})],me:[C('Colossal Dreadmaw',{st:'target'}),C('Forest',{st:'tapped'})],hand:[],stack:['Murder','Blossoming Defense'],life:[20,20]},
   x:'Agora há dois itens na pilha.',
   q:{ask:'Qual resolve primeiro?',o:['Blossoming Defense','Murder'],a:0,
   why:'A pilha funciona como uma pilha de pratos: o último a entrar é o primeiro a sair (LIFO).'}},
  {b:{opp:[C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'})],me:[C('Colossal Dreadmaw',{note:'+2/+2 · Resist. a Magia',p:'8/8'}),C('Forest',{st:'tapped'})],hand:[],stack:['Murder'],life:[20,20]},
   x:'Blossoming Defense resolveu: o Dreadmaw é 8/8 e tem Resistência a Magia até o fim do turno.',
   q:{ask:'Quando Murder tenta resolver, o que acontece?',o:['Não faz nada, porque o alvo ficou ilegal','Destrói o Dreadmaw mesmo assim','Volta para a mão do oponente'],a:0,
   why:'Resistência a Magia impede que oponentes mirem a criatura. Como o único alvo ficou ilegal, Murder não resolve e vai para o cemitério. Os jogadores chamam isso de "pifar" (fizzle).'}},
  {b:{opp:[C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'}),C('Swamp',{st:'tapped'})],me:[C('Colossal Dreadmaw',{note:'+2/+2 · Resist. a Magia',p:'8/8'}),C('Forest',{st:'tapped'})],hand:[],life:[20,20]},
   x:'Você gastou 1 mana para anular uma remoção de 3. Guardar mana aberta no turno do oponente é a base do jogo com instantâneos.'}
 ]},
 {id:8, col:'U', title:'Pilha em cadeia', tag:'Respostas sobre respostas', steps:[
  {b:{opp:[C('Mountain',{st:'tapped'}),C('Mountain')],me:[C('Grizzly Bears',{st:'target'}),C('Forest')],hand:['Giant Growth'],stack:['Lightning Bolt'],life:[20,20]},
   x:'O oponente conjura [[Lightning Bolt]] (3 de dano) nos seus Ursos 2/2. Você responde com [[Giant Growth]].',
   q:{ask:'Se ninguém mais responder, o que acontece?',o:['Growth resolve primeiro; os Ursos viram 5/5 e sobrevivem ao Raio','O Raio resolve primeiro e os Ursos morrem'],a:0,
   why:'Growth entrou por último, então resolve primeiro. Depois o Raio causa 3 a uma criatura 5/5.'}},
  {b:{opp:[C('Mountain',{st:'tapped'}),C('Mountain',{st:'tapped'})],me:[C('Grizzly Bears',{st:'target'}),C('Forest',{st:'tapped'})],hand:[],stack:['Lightning Bolt','Giant Growth','Lightning Bolt'],life:[20,20]},
   x:'Mas o oponente responde ao seu Growth com um segundo Lightning Bolt nos Ursos.',
   q:{ask:'Em que ordem a pilha resolve?',o:['Raio 2 → Giant Growth → Raio 1','Raio 1 → Growth → Raio 2','Growth → Raio 1 → Raio 2'],a:0,
   why:'Sempre de cima para baixo: o último item adicionado resolve primeiro.'}},
  {b:{opp:[C('Mountain',{st:'tapped'}),C('Mountain',{st:'tapped'})],me:[C('Grizzly Bears',{st:'target'}),C('Forest',{st:'tapped'})],hand:[],stack:['Lightning Bolt','Giant Growth','Lightning Bolt'],life:[20,20]},
   x:'Pense no que acontece a cada resolução.',
   q:{ask:'Qual é o resultado final?',o:['Os Ursos morrem no Raio 2; Growth e Raio 1 não fazem nada','Os Ursos sobrevivem','Os Ursos morrem só no Raio 1'],a:0,
   why:'O Raio 2 causa 3 ao 2/2, que morre. Growth e Raio 1 perdem o alvo e não resolvem. O oponente gastou 2 cards para tirar 2 seus (Ursos + Growth): uma troca equilibrada.'}},
  {b:{opp:[C('Mountain',{st:'tapped'}),C('Mountain',{st:'tapped'})],me:[C('Grizzly Bears',{dead:true}),C('Forest',{st:'tapped'})],hand:[],life:[20,20]},
   x:'Lição: quem responde por último ganha a disputa na pilha. Antes de usar um truque, pergunte-se: <i>o oponente ainda tem mana aberta?</i>'}
 ]},
 {id:9, col:'R', title:'Atacando Planeswalkers', tag:'Lealdade e alvos de ataque', steps:[
  {b:{opp:[C('Chandra, Torch of Defiance',{loy:4}),C('Grizzly Bears')],me:[C('Goblin Guide')],hand:[],life:[20,20]},
   x:'O oponente controla [[Chandra, Torch of Defiance]] com 4 de lealdade e um [[Grizzly Bears]].',
   q:{ask:'Ao declarar o ataque com o Goblin, quem você pode atacar?',o:['O oponente ou a Chandra, à sua escolha','Só o oponente','Só a Chandra'],a:0,
   why:'Ao declarar atacantes, você escolhe para cada criatura um alvo: o jogador, um planeswalker dele ou uma batalha.'}},
  {b:{opp:[C('Chandra, Torch of Defiance',{loy:2,d:2}),C('Grizzly Bears')],me:[C('Goblin Guide',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'O Goblin ataca a Chandra e o oponente decide não bloquear.',
   q:{ask:'Quanto de lealdade a Chandra perde?',o:['2, ficando com 2','4, morrendo','Nenhuma'],a:0,
   why:'Dano causado a um planeswalker remove essa quantidade de marcadores de lealdade.'}},
  {b:{opp:[C('Chandra, Torch of Defiance',{loy:2}),C('Grizzly Bears')],me:[C('Goblin Guide',{st:'tapped'})],hand:[],life:[20,20]},
   x:'Se a lealdade de um planeswalker chega a 0, ele vai para o cemitério.',
   q:{ask:'Quando o oponente pode ativar as habilidades de lealdade dela?',o:['Uma vez por turno, na própria fase principal, com a pilha vazia','Quantas vezes quiser','A qualquer momento, como instantâneo'],a:0,
   why:'Habilidades de lealdade têm velocidade de feitiço e o limite é uma ativação por planeswalker por turno.'}}
 ]},
 {id:10, col:'B', title:'Vínculo com a vida e Indestrutível', tag:'Ganhar vida e resistir à destruição', steps:[
  {b:{opp:[C('Giant Spider',{st:'blocking'})],me:[C('Vampire Nighthawk',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'[[Vampire Nighthawk]] (2/3: Voar, Toque Mortífero, Vínculo com a vida) ataca e é bloqueado por [[Giant Spider]] (2/4).',
   q:{ask:'Qual é o resultado?',o:['A Aranha morre, o Nighthawk sobrevive e você ganha 2 de vida','As duas morrem','A Aranha sobrevive porque tem 4 de resistência'],a:0,
   why:'Toque mortífero torna qualquer dano letal. A Aranha causa 2 ao Nighthawk (resistência 3). Vínculo com a vida: você ganha vida igual ao dano causado.'}},
  {b:{opp:[C('Darksteel Myr',{st:'target'})],me:[C('Vampire Nighthawk'),C('Mountain',{st:'tapped'})],hand:[],stack:['Lightning Bolt'],life:[22,20]},
   x:'Você agora mira [[Darksteel Myr]] (0/1, Indestrutível) com [[Lightning Bolt]].',
   q:{ask:'O Myr morre?',o:['Não: indestrutível não é destruído por dano letal','Sim, 3 de dano é mais que 1'],a:0,
   why:'Dano letal faz a criatura ser destruída, e Indestrutível ignora qualquer efeito de destruir.'}},
  {b:{opp:[C('Darksteel Myr',{d:3})],me:[C('Vampire Nighthawk'),C('Mountain',{st:'tapped'})],hand:[],life:[22,20]},
   x:'O Myr segue no campo com 3 de dano marcado.',
   q:{ask:'E se o seu Nighthawk (Toque Mortífero) causasse dano ao Myr?',o:['Também sobrevive','Morre'],a:0,
   why:'Toque Mortífero também destrói. Para lidar com indestrutíveis: exilar, fazer sacrificar, reduzir a resistência a 0 ou devolver à mão.'}}
 ]},
 {id:11, col:'R', title:'Ameaçar e Defensor', tag:'Restrições de bloqueio e ataque', steps:[
  {b:{opp:[C('Grizzly Bears')],me:[C('Boggart Brute',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'[[Boggart Brute]] (3/2, Ameaçar) ataca. O oponente só tem [[Grizzly Bears]].',
   q:{ask:'Os Ursos podem bloquear o Brute?',o:['Não: Ameaçar exige dois ou mais bloqueadores','Sim'],a:0,
   why:'Uma criatura com Ameaçar não pode ser bloqueada por uma criatura sozinha.'}},
  {b:{opp:[C('Wall of Omens',{st:'blocking'}),C('Grizzly Bears',{st:'blocking'})],me:[C('Boggart Brute',{st:'tapped attacking'})],hand:[],life:[20,20]},
   x:'Em outro turno, o oponente tem [[Wall of Omens]] (0/4, Defensor) e os Ursos, e bloqueia com os dois.',
   q:{ask:'Qual é o melhor resultado possível para você?',o:['Os Ursos morrem e o Brute também','Só o Brute morre','Ninguém morre'],a:0,
   why:'O Brute divide seus 3 de dano: 2 nos Ursos (letal) e 1 na Muralha. Ele recebe 0 da Muralha e 2 dos Ursos, igual à resistência 2.'}},
  {b:{opp:[C('Wall of Omens'),C('Grizzly Bears',{dead:true})],me:[C('Boggart Brute',{dead:true})],hand:[],life:[20,20]},
   x:'Muralhas costumam ser ótimas bloqueadoras.',
   q:{ask:'A Wall of Omens pode atacar no turno do oponente?',o:['Nunca: Defensor impede atacar','Sim, se estiver desvirada'],a:0,
   why:'Defensor significa que a criatura não pode atacar. Em troca, costuma ter muita resistência por um custo baixo.'}}
 ]},
 {id:12, col:'U', title:'Lampejo e o momento certo', tag:'Velocidade de instantâneo', steps:[
  {b:{opp:[C('Centaur Courser',{st:'tapped attacking'})],me:[C('Forest'),C('Forest')],hand:['Ambush Viper'],life:[20,20]},
   x:'No turno do oponente, ele ataca com [[Centaur Courser]] (3/3). Você tem 2 Florestas e [[Ambush Viper]] (Lampejo, Toque Mortífero) na mão.',
   q:{ask:'Quando conjurar a Víbora para poder bloquear?',o:['Depois que os atacantes foram declarados, antes dos bloqueadores','Depois do dano de combate','Na sua próxima fase principal'],a:0,
   why:'Lampejo permite conjurar como instantâneo. A criatura precisa estar no campo antes da etapa de declarar bloqueadores.'}},
  {b:{opp:[C('Centaur Courser',{st:'tapped attacking'})],me:[C('Forest',{st:'tapped'}),C('Forest',{st:'tapped'}),C('Ambush Viper',{st:'blocking'})],hand:[],life:[20,20]},
   x:'A Víbora entra e bloqueia o Centauro.',
   q:{ask:'Qual é o resultado?',o:['Os dois morrem','Só a Víbora morre','Só o Centauro morre'],a:0,
   why:'Toque Mortífero mata o Centauro; os 3 de dano matam a Víbora (resistência 1). Uma criatura de 2 manas trocou com uma de 3.'}},
  {b:{opp:[C('Centaur Courser',{dead:true})],me:[C('Forest',{st:'tapped'}),C('Forest',{st:'tapped'}),C('Ambush Viper',{dead:true})],hand:[],life:[20,20]},
   x:'O oponente atacou achando que você não tinha bloqueadores.',
   q:{ask:'Por que foi melhor esperar o ataque do que conjurar a Víbora no seu turno?',o:['Porque o oponente atacou sem saber da Víbora','Porque Lampejo custa menos no turno do oponente','Não faz diferença'],a:0,
   why:'Informação é recurso. Com Lampejo você decide depois de ver a jogada do oponente, que antes não tinha como se preparar.'}}
 ]}
];

/* ================= FASES DO TURNO ================= */
const PHASES = [
 {k:'Inicial',steps:[['Desvirar','Desvire todas as suas permanentes. Ninguém recebe prioridade nesta etapa.'],['Manutenção','Gatilhos "no início da sua manutenção" acontecem. Já é possível conjurar instantâneos.'],['Compra','Compre um card. Quem começa a partida pula a compra do primeiro turno.']]},
 {k:'Principal 1',steps:[['Fase principal','Jogue até 1 terreno por turno. Conjure criaturas, feitiços, artefatos, encantamentos e planeswalkers (só com a pilha vazia). Ative habilidades de lealdade.']]},
 {k:'Combate',steps:[['Início do combate','Última chance do oponente agir antes dos ataques, por exemplo virando sua criatura.'],['Declarar atacantes','Vire as criaturas que atacam e escolha o alvo de cada uma: jogador, planeswalker ou batalha.'],['Declarar bloqueadores','O defensor escolhe os bloqueios. Cada criatura bloqueia no máximo um atacante; um atacante pode ser bloqueado por várias.'],['Dano de combate','Todo o dano é causado ao mesmo tempo. Se alguma criatura tiver Iniciativa ou Golpe Duplo, há um passo de dano extra antes.'],['Fim do combate','Gatilhos "no fim do combate". Criaturas deixam de ser atacantes e bloqueadoras.']]},
 {k:'Principal 2',steps:[['Fase principal','Igual à primeira. Bom momento para conjurar criaturas depois de ver como o combate terminou, escondendo informação.']]},
 {k:'Final',steps:[['Etapa final','Gatilhos "no início da etapa final". É quando o oponente costuma usar instantâneos que guardou.'],['Limpeza','Descarte até ficar com 7 cards. O dano marcado nas criaturas é removido e efeitos "até o final do turno" terminam.']]}
];

/* ================= GLOSSÁRIO ================= */
const KW = [
 {pt:'Voar',en:'Flying',cat:'Evasão',ex:'Serra Angel',x:'Só pode ser bloqueada por criaturas com Voar ou Alcance.',tip:'Criaturas voadoras pequenas vencem jogos acumulando dano todo turno.',l:3},
 {pt:'Alcance',en:'Reach',cat:'Defesa',ex:'Giant Spider',x:'Pode bloquear criaturas com Voar.',tip:'Não dá Voar à criatura; ela continua só bloqueando voadores.',l:3},
 {pt:'Ameaçar',en:'Menace',cat:'Evasão',ex:'Boggart Brute',x:'Só pode ser bloqueada por duas ou mais criaturas.',tip:'Contra oponentes com poucas criaturas, funciona quase como imbloqueável.',l:11},
 {pt:'Atropelar',en:'Trample',cat:'Combate',ex:'Colossal Dreadmaw',x:'Depois de atribuir dano letal a todos os bloqueadores, o excesso vai para o jogador ou planeswalker atacado.',tip:'Combine com Toque Mortífero: 1 de dano basta em cada bloqueador.',l:5},
 {pt:'Iniciativa',en:'First Strike',cat:'Combate',ex:'White Knight',x:'Causa dano de combate num passo anterior ao dano normal.',tip:'Se o oponente também tiver Iniciativa, os dois batem juntos no primeiro passo.',l:4},
 {pt:'Golpe Duplo',en:'Double Strike',cat:'Combate',ex:'Fencing Ace',x:'Causa dano tanto no passo de Iniciativa quanto no passo normal.',tip:'Todo bônus de poder conta duas vezes.',l:4},
 {pt:'Toque Mortífero',en:'Deathtouch',cat:'Combate',ex:'Ambush Viper',x:'Qualquer quantidade de dano que cause a uma criatura é suficiente para destruí-la.',tip:'Um 1/1 com Toque Mortífero faz o oponente pensar duas vezes antes de atacar.',l:6},
 {pt:'Vínculo com a vida',en:'Lifelink',cat:'Recursos',ex:'Vampire Nighthawk',x:'O dano causado por esta fonte também faz o controlador ganhar essa quantidade de vida.',tip:'Funciona com qualquer dano, não só de combate.',l:10},
 {pt:'Ímpeto',en:'Haste',cat:'Velocidade',ex:'Goblin Guide',x:'Pode atacar e usar habilidades com {T} no turno em que entra.',tip:'Essencial em decks agressivos: o oponente não tem um turno para reagir.',l:1},
 {pt:'Vigilância',en:'Vigilance',cat:'Combate',ex:'Serra Angel',x:'Atacar não faz a criatura virar.',tip:'Ataque e defenda com a mesma criatura.',l:3},
 {pt:'Defensor',en:'Defender',cat:'Defesa',ex:'Wall of Omens',x:'Não pode atacar.',tip:'Muralhas seguram decks agressivos e compram tempo.',l:11},
 {pt:'Lampejo',en:'Flash',cat:'Velocidade',ex:'Ambush Viper',x:'Pode ser conjurada a qualquer momento em que você poderia conjurar um instantâneo.',tip:'Use para emboscar atacantes ou para manter mana aberta e blefar.',l:12},
 {pt:'Resistência a Magia',en:'Hexproof',cat:'Proteção',ex:'Gladecover Scout',x:'Não pode ser alvo de mágicas ou habilidades que oponentes controlam.',tip:'Não protege de efeitos sem alvo, como Wrath of God.',l:7},
 {pt:'Indestrutível',en:'Indestructible',cat:'Proteção',ex:'Darksteel Myr',x:'Não é destruída por dano letal nem por efeitos que dizem "destrua".',tip:'Ainda morre com resistência 0, exílio ou sacrifício.',l:10},
 {pt:'Proteção',en:'Protection',cat:'Proteção',ex:'White Knight',x:'Contra a qualidade citada: não pode ser bloqueada, alvejada, encantada/equipada, e todo dano é prevenido (sigla DEBT em inglês).',tip:'White Knight não pode ser bloqueado por criaturas pretas.',l:null},
 {pt:'Resguardo',en:'Ward',cat:'Proteção',ex:'Tolarian Terror',x:'Sempre que se torna alvo de mágica ou habilidade de um oponente, ela é anulada a menos que ele pague o custo de Resguardo.',tip:'Torna a remoção do oponente mais cara.',l:null},
 {pt:'Destreza',en:'Prowess',cat:'Combate',ex:'Monastery Swiftspear',x:'Sempre que você conjura uma mágica que não é de criatura, a criatura recebe +1/+1 até o fim do turno.',tip:'Recompensa decks cheios de instantâneos e feitiços baratos.',l:null},
 {pt:'Vidência',en:'Scry',cat:'Recursos',ex:'Opt',x:'Olhe os N cards do topo; coloque qualquer número no fundo e o resto no topo na ordem que quiser.',tip:'Melhora suas próximas compras sem gastar um card.',l:null},
 {pt:'Anular',en:'Counter',cat:'Pilha',ex:'Counterspell',x:'Remove uma mágica da pilha; ela vai para o cemitério sem ter efeito.',tip:'Só funciona enquanto a mágica está na pilha. Permanentes no campo não podem ser anuladas.',l:7},
 {pt:'Virar / Desvirar',en:'Tap / Untap',cat:'Recursos',ex:'Llanowar Elves',x:'Virar ({T}) é girar o card 90° para usar. Ele desvira na etapa de desvirar do seu turno.',tip:'Criaturas viradas não podem bloquear.',l:2},
 {pt:'Equipar',en:'Equip',cat:'Recursos',ex:'Bonesplitter',x:'Pague o custo de Equipar para prender o Equipamento a uma criatura sua. Só em velocidade de feitiço.',tip:'Se a criatura morrer, o Equipamento fica no campo e pode ser reequipado.',l:null},
 {pt:'Aura',en:'Enchant',cat:'Recursos',ex:'Pacifism',x:'Encantamento que fica preso a um alvo. Se o alvo sair do campo, a Aura vai para o cemitério.',tip:'Remoções como Pacifism podem ser desfeitas se a Aura for destruída.',l:null},
 {pt:'Lealdade',en:'Loyalty',cat:'Recursos',ex:'Chandra, Torch of Defiance',x:'A "vida" de um planeswalker. Habilidades +N e −N mudam a lealdade; dano a reduz.',tip:'Uma ativação por turno, na sua fase principal, com a pilha vazia.',l:9},
 {pt:'Cólera',en:'Board Wipe',cat:'Pilha',ex:'Wrath of God',x:'Gíria para mágica que destrói todas as criaturas (ou várias permanentes) de uma vez.',tip:'Contra decks de controle, não coloque todas as suas criaturas no campo de uma vez.',l:null}
];
const KW_CATS = ['Todas','Evasão','Combate','Defesa','Proteção','Velocidade','Recursos','Pilha'];

/* ================= QUIZ ================= */
const QUIZ = [
 {c:'Básico',q:'Com quantos pontos de vida cada jogador começa numa partida padrão (fora de Commander)?',o:['20','30','40','25'],a:0,e:'Em Commander a vida inicial é 40.'},
 {c:'Básico',q:'Quantos terrenos você pode jogar por turno, sem efeitos extras?',o:['1','2','Ilimitado','1 em cada fase principal'],a:0,e:'O limite é um terreno por turno, em qualquer uma das fases principais.'},
 {c:'Básico',q:'Você precisa comprar um card, mas seu grimório está vazio. O que acontece?',o:['Você perde a partida','Embaralha o cemitério no grimório','Nada','Pula a compra'],a:0,e:'Na próxima verificação de ações baseadas em estado, o jogador que tentou comprar de um grimório vazio perde.'},
 {c:'Básico',q:'Qual é o tamanho máximo de mão no fim do seu turno?',o:['7','8','10','Não há limite'],a:0,e:'Na etapa de limpeza você descarta até ficar com 7.'},
 {c:'Básico',q:'O que o jogador que começa a partida pula no primeiro turno?',o:['A compra','A primeira fase principal','O combate','Nada'],a:0,e:'Compensa a vantagem de jogar primeiro.'},
 {c:'Básico',q:'Quantas cópias de um mesmo card (fora terrenos básicos) um deck Construído pode ter?',o:['4','3','1','Sem limite'],a:0,e:'Em Commander o limite é 1 cópia.'},
 {c:'Básico',q:'Qual é o tamanho mínimo de um deck de Limitado (Draft ou Selado)?',o:['40','60','30','100'],a:0,e:'Construído pede no mínimo 60; Commander, exatamente 100.'},
 {c:'Básico',q:'O enjoo de invocação impede uma criatura que acabou de entrar de:',o:['Atacar e usar habilidades com {T}','Bloquear','Ser alvo de mágicas','Receber contadores'],a:0,e:'Bloquear é sempre permitido.'},
 {c:'Básico',q:'Para onde vão cards destruídos e mágicas depois de resolvidas?',o:['Cemitério','Exílio','Fundo do grimório','Mão do dono'],a:0,e:'O cemitério é público: qualquer jogador pode olhar.'},
 {c:'Combate',q:'Uma criatura 3/3 é bloqueada por uma 2/2. Resultado?',o:['A 2/2 morre; a 3/3 sobrevive com 2 de dano','As duas morrem','Nenhuma morre','Só a 3/3 morre'],a:0,e:'O dano é simultâneo e só mata quem recebe dano maior ou igual à resistência.'},
 {c:'Combate',q:'Uma criatura com Voar pode ser bloqueada por:',o:['Criaturas com Voar ou Alcance','Qualquer criatura','Só criaturas com Voar','Nenhuma criatura'],a:0,e:'Alcance existe justamente para defender contra voadores.'},
 {c:'Combate',q:'Atacante 5/5 com Atropelar é bloqueado por uma 2/2. Quanto dano vai ao jogador?',o:['3','5','0','2'],a:0,e:'2 é letal no bloqueador; 3 passam.'},
 {c:'Combate',q:'Atacante 4/4 com Atropelar e Toque Mortífero, bloqueado por uma 1/6. Quanto passa?',o:['3','0','4','1'],a:0,e:'Com Toque Mortífero, 1 de dano já é letal: 4 − 1 = 3.'},
 {c:'Combate',q:'Uma 2/2 com Golpe Duplo ataca e não é bloqueada. Quanto dano causa?',o:['4','2','3','6'],a:0,e:'2 no passo de Iniciativa e 2 no passo normal.'},
 {c:'Combate',q:'Uma 2/2 com Iniciativa é bloqueada por uma 2/2 sem habilidades. Resultado?',o:['Só o bloqueador morre','As duas morrem','Nenhuma morre','Só a atacante morre'],a:0,e:'O bloqueador morre no primeiro passo e não chega a causar dano.'},
 {c:'Combate',q:'O que faz Ameaçar?',o:['Só pode ser bloqueada por duas ou mais criaturas','Não pode ser bloqueada','Causa dano antes','Ganha +1/+1 ao atacar'],a:0,e:'Uma criatura sozinha nunca bloqueia algo com Ameaçar.'},
 {c:'Combate',q:'O que faz Vigilância?',o:['Atacar não faz a criatura virar','Pode bloquear voadores','Não pode ser alvo','Ataca no turno em que entra'],a:0,e:'A criatura fica livre para bloquear no turno seguinte do oponente.'},
 {c:'Combate',q:'Quem decide como dividir o dano de um atacante bloqueado por várias criaturas?',o:['O jogador atacante','O defensor','É dividido igualmente','É aleatório'],a:0,e:'Desde 2024 o atacante divide livremente, sem ordem de atribuição.'},
 {c:'Combate',q:'Uma 3/3 com Vínculo com a vida é bloqueada por uma 1/1. Quanto de vida você ganha?',o:['3','1','0','2'],a:0,e:'Sem Atropelar, todo o dano vai para o bloqueador e todo dano causado conta para o Vínculo.'},
 {c:'Pilha',q:'Na pilha, qual item resolve primeiro?',o:['O último adicionado','O primeiro adicionado','O do jogador ativo','O de menor custo'],a:0,e:'Último a entrar, primeiro a sair (LIFO).'},
 {c:'Pilha',q:'Uma mágica cujo único alvo se tornou ilegal, ao tentar resolver:',o:['Não faz nada e vai para o cemitério','Escolhe outro alvo','Volta para a mão','Resolve normalmente'],a:0,e:'Os jogadores chamam isso de pifar (fizzle).'},
 {c:'Pilha',q:'Quando você pode conjurar um feitiço (sorcery)?',o:['Na sua fase principal, com a pilha vazia','A qualquer momento','Só no combate','No turno do oponente'],a:0,e:'Essa restrição se chama velocidade de feitiço.'},
 {c:'Pilha',q:'Quando você pode conjurar um instantâneo?',o:['Sempre que tiver prioridade, inclusive no turno do oponente','Só na sua fase principal','Só no combate','Só em resposta a outra mágica'],a:0,e:'Instantâneos podem esperar o melhor momento.'},
 {c:'Pilha',q:'Jogar um terreno usa a pilha?',o:['Não: é uma ação especial e não pode ser respondida','Sim, como qualquer card','Só terrenos não básicos','Só no turno do oponente'],a:0,e:'Por isso não existe "anular um terreno".'},
 {c:'Pilha',q:'Lightning Bolt (3 de dano) mira seus Ursos 2/2. Você responde com Giant Growth. Resultado?',o:['Os Ursos ficam 5/5 e sobrevivem com 3 de dano','Os Ursos morrem','O Raio é anulado','Os Ursos ficam 5/5 e não recebem dano'],a:0,e:'Growth resolve primeiro; depois o Raio causa 3 a uma criatura 5/5.'},
 {c:'Pilha',q:'Virar um terreno para gerar mana usa a pilha?',o:['Não: habilidades de mana resolvem na hora','Sim','Só durante o combate','Só para mana colorida'],a:0,e:'Habilidades de mana não podem ser respondidas.'},
 {c:'Habilidades',q:'Resistência a Magia (Hexproof) protege contra:',o:['Mágicas e habilidades de oponentes que tenham alvo','Wrath of God','Dano de combate','Tudo'],a:0,e:'Efeitos sem alvo, como destruir todas as criaturas, ainda funcionam.'},
 {c:'Habilidades',q:'Uma criatura Indestrutível recebe dano de uma fonte com Toque Mortífero. Ela:',o:['Sobrevive','Morre','Vai para o exílio','Volta para a mão'],a:0,e:'Toque Mortífero destrói, e Indestrutível ignora destruição.'},
 {c:'Habilidades',q:'Uma criatura Indestrutível fica com resistência 0. Ela:',o:['Vai para o cemitério','Sobrevive','Fica virada','É exilada'],a:0,e:'Resistência 0 não é destruição: é uma ação baseada em estado.'},
 {c:'Habilidades',q:'O que Lampejo permite?',o:['Conjurar quando poderia conjurar um instantâneo','Atacar no turno em que entra','Voltar do cemitério','Não ser anulada'],a:0,e:'Ideal para emboscar atacantes.'},
 {c:'Habilidades',q:'Vidência 2 significa:',o:['Olhar os 2 do topo e mandar quantos quiser para o fundo','Comprar 2 cards','Descartar 2 cards','Olhar a mão do oponente'],a:0,e:'O resto volta ao topo na ordem que você escolher.'},
 {c:'Habilidades',q:'Um planeswalker recebe 3 de dano. O que acontece?',o:['Perde 3 marcadores de lealdade','O controlador perde 3 de vida','Nada','É destruído'],a:0,e:'Com lealdade 0 ele vai para o cemitério.'},
 {c:'Habilidades',q:'Quantas habilidades de lealdade de um mesmo planeswalker você ativa por turno?',o:['Uma','Duas','Quantas quiser','Nenhuma no turno em que entra'],a:0,e:'Pode ativar já no turno em que ele entra.'},
 {c:'Construção',q:'Qual é a faixa típica de terrenos num deck Construído de 60 cards?',o:['22 a 26','15 a 18','30 a 34','10 a 12'],a:0,e:'Decks agressivos ficam perto de 20–22; controle, 25–27.'},
 {c:'Construção',q:'Num deck de Limitado (40 cards), quantos terrenos são o padrão?',o:['17','24','12','20'],a:0,e:'17 terrenos para 23 mágicas é a receita clássica.'},
 {c:'Construção',q:'Qual descreve Commander?',o:['100 cards, 1 cópia de cada (fora básicos), 40 de vida','60 cards, 4 cópias, 20 de vida','40 cards, 17 terrenos','100 cards, 4 cópias, 20 de vida'],a:0,e:'O comandante define a identidade de cor do deck.'},
 {c:'Construção',q:'Como funciona o London Mulligan?',o:['Compra 7 de novo e coloca 1 card no fundo para cada mulligan feito','Compra 1 card a menos a cada vez','Escolhe 7 cards do deck','Troca só os terrenos'],a:0,e:'Você sempre vê 7 cards, o que torna o mulligan menos punitivo.'},
 {c:'Construção',q:'O que é a "curva de mana" de um deck?',o:['A distribuição de custos, para ter jogadas em todos os turnos','A quantidade de terrenos','O total de mana do deck','A ordem de jogar as cores'],a:0,e:'Uma boa curva tem muitas jogadas baratas e poucas caras.'},
 {c:'Construção',q:'Você usa 1 Wrath of God para destruir 3 criaturas do oponente (e nenhuma sua). Isso é:',o:['Vantagem de cards: 3 por 1','Troca 1 por 1','Desvantagem','Tempo, não cards'],a:0,e:'Card advantage é fazer cada card seu valer mais de um do oponente.'}
];

/* ================= GUIAS ================= */
const GUILDS = [
 ['Azorius','WU','Controle, voadores e regras: anulações e remoções seguras.'],
 ['Dimir','UB','Furtividade, compra de cards e remoção. Vence pelo cansaço.'],
 ['Rakdos','BR','Sacrifício e dano direto. Agressivo e caótico.'],
 ['Gruul','RG','Criaturas grandes e rápidas. Pressão bruta.'],
 ['Selesnya','GW','Muitas criaturas e fichas que crescem juntas.'],
 ['Orzhov','WB','Drenar vida e criaturas eficientes. Desgaste.'],
 ['Izzet','UR','Instantâneos e feitiços baratos; Destreza e dano.'],
 ['Golgari','BG','Cemitério como recurso; reciclar criaturas.'],
 ['Boros','RW','Ataques rápidos em grupo e bônus de combate.'],
 ['Simic','GU','Contadores +1/+1, ramp e criaturas que evoluem.']
];
const ARCH = [
 ['Aggro','Vencer até o turno 5–6 com criaturas baratas e dano direto.','20–22','Muitas criaturas de 1–2 manas; poucos cards acima de 4.'],
 ['Midrange','Trocar recursos e ter as criaturas mais eficientes da mesa.','23–25','Remoções + ameaças fortes de 3–5 manas.'],
 ['Controle','Sobreviver, anular e destruir até dominar o jogo tarde.','25–27','Anulações, Cóleras, compra de cards, poucas ameaças.'],
 ['Ramp','Acelerar mana para jogar ameaças enormes antes do normal.','24–26','Elfos e feitiços de busca de terreno + topo de curva alto.'],
 ['Tempo','Ameaças baratas protegidas por interação barata.','20–23','Criaturas evasivas de 1–2 manas + anulações e remoções de 1–2.'],
 ['Combo','Montar uma combinação de cards que vence na hora.','22–24','Peças do combo + busca/compra + proteção.']
];
const SAMPLE_DECK = `// Gruul Aggro de exemplo (60 cards)
4 Llanowar Elves
4 Goblin Guide
4 Monastery Swiftspear
4 Grizzly Bears
4 Centaur Courser
4 Boggart Brute
2 Colossal Dreadmaw
4 Lightning Bolt
4 Giant Growth
2 Blossoming Defense
2 Rampant Growth
11 Forest
11 Mountain`;
