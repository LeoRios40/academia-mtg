/* ================= v4.2: ESTRATÉGIAS DO MAGIC =================
   Explica as estratégias (arquétipos) clássicas, com exemplos, como jogar, onde usar
   e um botão que monta a estratégia no "Criar deck do zero" (qualquer carta, coleção do Arena
   ou coleção física), além de um detector: "qual estratégia combina com o meu deck/coleção?". */
const ST_CAT = {agro:'Agressivas', mid:'Meio-termo (midrange e motores)', ctl:'Controle e travas', combo:'Combo e motores de cemitério'};
/* b: como a Academia monta (arch = estilo base do gerador, cols = cores sugeridas, q = busca do Scryfall para o tema,
      re = como reconhecer uma carta da estratégia pelo texto, fmts = formatos de mesa indicados, afmts = formatos do Arena indicados) */
const STRATS = [
 {k:'burn', n:'Burn', en:'Burn (queimar)', cat:'agro', cols:'R',
  o:'Deck vermelho que trata a vida do oponente como um recurso a ser queimado: quase todas as cartas causam dano direto ao jogador.',
  v:'Tira os 20 pontos de vida em 4 ou 5 turnos com mágicas de dano e criaturas rápidas que atacam enquanto o oponente ainda está se organizando.',
  ex:['Lightning Bolt','Lava Spike','Rift Bolt','Skewer the Critics','Goblin Guide','Monastery Swiftspear','Eidolon of the Great Revel','Boros Charm'],
  uso:['Conte a vida do oponente o tempo todo: some o dano que tem na mão e veja em quantos turnos ele morre.','No começo, use as criaturas para atacar; guarde o dano direto para fechar o jogo ou para tirar um bloqueador importante.','Mire no jogador sempre que puder. Queime uma criatura só se ela for travar seus ataques ou matar você.','Mão com 2 terrenos já basta: o deck é barato. Mulligan em mãos com 5 terrenos.'],
  onde:'Modern e Pauper (Burn é um dos decks mais tradicionais). Na mesa de casa, é o deck ideal para aprender a contar dano.',
  arena:'No Arena, aparece como "Mono-Red" ou "Red Deck Wins" no Padrão e no Histórico. Escolha Padrão ou Histórico.',
  fraco:'Ganho de vida, criaturas grandes que bloqueiam bem e partidas longas. Se o oponente se estabiliza, o Burn fica sem gás.',
  b:{arch:'aggro', cols:['R','RW'], q:'(t:instant or t:sorcery or t:creature) (o:"damage to any target" or o:"damage to each opponent" or o:"damage to target player" or o:"damage to target opponent")', re:/deals? \d+ damage to (any target|each opponent|target player|target opponent)/i, fmts:['modern','pauper'], afmts:['standard','historic']}},
 {k:'stompy', n:'Stompy', en:'Stompy', cat:'agro', cols:'G',
  o:'Aggro verde: criaturas grandes para o custo, jogadas cedo, com truques que as deixam ainda maiores.',
  v:'Coloca duas ou três criaturas que batem mais forte que as do oponente nos primeiros turnos e protege o ataque com truques de +X/+X.',
  ex:['Nettle Sentinel','Quirion Ranger','Burning-Tree Emissary','Skarrgan Pit-Skulk','Rancor','Vines of Vastwood','Savage Swipe','Llanowar Elves'],
  uso:['Jogue uma criatura por turno a partir do turno 1. Curva baixa é tudo.','Use os truques (Vines, Swipe) no ataque, para vencer uma troca ou salvar uma criatura de uma remoção.','Rancor e auras vão na criatura que o oponente tem mais dificuldade de bloquear (atropelar ajuda).','Não segure criaturas na mão "para depois": o deck ganha pela pressão.'],
  onde:'Pauper (Mono-Green Stompy é um clássico) e mesas casuais. Barato e fácil de jogar.',
  arena:'No Arena: Mono-Green aggro no Padrão ou Histórico.',
  fraco:'Remoção em massa e criaturas que bloqueiam bem (paredes, voadores grandes). Pouca carta para comprar mais cartas.',
  b:{arch:'aggro', cols:['G','RG'], q:'t:creature mv<=3 (o:trample or pow>=3 or o:"+1/+1")', re:/trample|gets \+\d\/\+\d until end of turn|bloodthirst/i, det:(d, L) => /Creature/.test(L.tl || d.t || '') && (d.cmc || 0) <= 3 && (L.ci || []).join('') === 'G', fmts:['pauper'], afmts:['standard','historic']}},
 {k:'affinity', n:'Affinity', en:'Affinity (afinidade por artefatos)', cat:'agro', cols:'U',
  o:'Deck cheio de artefatos baratos. Muitas cartas ficam mais baratas ou mais fortes para cada artefato que você controla.',
  v:'Despeja a mão inteira em 2 ou 3 turnos (cartas de custo zero graças à afinidade) e vence com criaturas que crescem com o número de artefatos.',
  ex:['Frogmite','Myr Enforcer','Thoughtcast','Cranial Plating','Galvanic Blast','Atog','Arcbound Ravager','Thought Monitor'],
  uso:['Jogue terrenos-artefato e artefatos de custo baixo primeiro: eles barateiam o resto.','Conte os artefatos antes de cada jogada: cada um reduz o custo de Frogmite, Myr Enforcer e Thoughtcast.','Cranial Plating ou Atog transformam o resto do time em dano: guarde-os para o turno da vitória.','Tenha atenção a remoções de artefatos do oponente; espalhe as ameaças.'],
  onde:'Pauper (um dos decks mais fortes do formato) e Modern (versões como Hammer Time e Affinity).',
  arena:'No Arena, decks de artefatos aparecem no Histórico e no Timeless. Escolha Histórico.',
  fraco:'Remoções de artefatos em massa e cartas que destroem artefatos. Se perder os primeiros artefatos, o deck trava.',
  b:{arch:'aggro', cols:['U','UR','R'], q:'(o:"affinity for artifacts" or o:"for each artifact you control" or o:metalcraft or o:improvise or (t:artifact t:creature mv<=3))', re:/affinity for artifacts|for each artifact you control|metalcraft|improvise/i, fmts:['pauper','modern'], afmts:['historic']}},
 {k:'soul', n:'Soul Sisters', en:'Soul Sisters (ganho de vida)', cat:'agro', cols:'W',
  o:'Deck branco de ganho de vida. O nome vem de Soul Warden e Soul\'s Attendant, que dão 1 de vida cada vez que uma criatura entra.',
  v:'Cada criatura que entra dá vida; cada vida ganha faz criaturas como Ajani\'s Pridemate e Serra Ascendant crescerem. Vence atacando com elas, enquanto o oponente não consegue causar dano suficiente.',
  ex:['Soul Warden','Soul\'s Attendant','Ajani\'s Pridemate','Serra Ascendant','Ranger of Eos','Martyr of Sands','Healer\'s Hawk','Lunarch Veteran'],
  uso:['Abra com Soul Warden ou similar: quanto antes, mais vida ao longo do jogo.','Baixe depois as criaturas que crescem com vida (Pridemate) e ataque com elas.','Contra decks rápidos, priorize ganhar vida; contra decks lentos, priorize atacar.','Serra Ascendant fica enorme com 30 de vida: no Commander isso já vale desde o começo.'],
  onde:'Modern e Pauper (versões de "Soul Sisters" e "Lifegain"), Commander com comandantes de vida (Oloro, Karlov).',
  arena:'No Arena, decks de vida (Lifegain) aparecem no Padrão, Histórico e Brawl.',
  fraco:'Remoção em massa e decks de combo que não atacam (vida extra não ajuda contra mill ou combo).',
  b:{arch:'aggro', cols:['W','WB','GW'], q:'(o:"whenever you gain life" or (o:"enters" o:"gain 1 life") or o:lifelink)', re:/whenever you gain life|you gain \d+ life|lifelink/i, fmts:['modern','pauper','commander'], afmts:['standard','historic','brawl']}},
 {k:'tribal', n:'Kindred (Tribal)', en:'Kindred / Tribal', cat:'agro', cols:'G',
  o:'Deck de um tipo de criatura só: Elfos, Goblins, Tritões, Vampiros, Zumbis… Desde 2024 a Wizards chama de "Kindred" (antes era "Tribal").',
  v:'Os "lordes" fortalecem todos do mesmo tipo e muitas cartas ficam melhores para cada membro da tribo: um time médio vira um time enorme.',
  ex:['Elvish Archdruid','Heritage Druid','Goblin Chieftain','Krenko, Mob Boss','Lord of Atlantis','Master of the Pearl Trident','Cavern of Souls','Kindred Dominance'],
  uso:['Escolha a tribo e tenha pelo menos 20 criaturas dela num deck de 60.','Os lordes (que dão +1/+1 aos outros) são prioridade de proteção: o oponente vai mirar neles.','Jogue as criaturas baratas cedo e os lordes logo depois, para atacar já fortalecido.','No Commander, escolha um comandante da tribo (Krenko para Goblins, Lathril para Elfos).'],
  onde:'Commander (muito popular), Pioneer e Modern (Merfolk, Elfos) e mesas casuais.',
  arena:'No Arena, ótimo no Brawl e no Histórico. Escolha a tribo na pergunta de tema.',
  fraco:'Remoção em massa, que leva o time inteiro de uma vez. Sem os lordes, as criaturas costumam ser pequenas.',
  b:{arch:'tema', cols:['G','R','B'], tribal:true, re:null, fmts:['commander','pioneer'], afmts:['brawl','historic']}},
 {k:'tokens', n:'Fichas (Go-wide)', en:'Tokens / Go-wide', cat:'agro', cols:'W',
  o:'Cria muitas criaturas pequenas (fichas) e fortalece todas de uma vez.',
  v:'Enche a mesa com fichas e vence num ataque com todas, depois de um "hino" (+1/+1 para todo o time).',
  ex:['Raise the Alarm','Secure the Wastes','Intangible Virtue','Anointed Procession','Glorious Anthem','Adeline, Resplendent Cathar','Divine Visitation','Cathars\' Crusade'],
  uso:['Crie fichas nos primeiros turnos e segure os hinos para quando a mesa estiver cheia.','Ataque com muitas criaturas: o oponente não consegue bloquear todas.','Espere o oponente usar a remoção em massa antes de colocar tudo na mesa, se puder.','No Commander, combine com cartas que dobram fichas (Anointed Procession).'],
  onde:'Commander, Pauper e mesas casuais. Um dos estilos mais fáceis de entender.',
  arena:'No Arena: Padrão, Histórico e Brawl.',
  fraco:'Remoção em massa (especialmente as que causam 1 ou 2 de dano a todas as criaturas).',
  b:{arch:'tokens', cols:['W','GW','RW'], q:'o:create o:token', re:/create .*tokens?|creatures you control get \+/i, fmts:['commander','pauper'], afmts:['standard','brawl','historic']}},
 {k:'voltron', n:'Voltron (Bogles)', en:'Voltron / Hexproof', cat:'agro', cols:'GW',
  o:'Uma criatura só, protegida (hexproof, que não pode ser alvo do oponente) e coberta de auras ou equipamentos até ficar enorme.',
  v:'Bate com uma criatura gigante que o oponente não consegue remover. No Commander, vence também por 21 de dano de comandante.',
  ex:['Slippery Bogle','Gladecover Scout','Ethereal Armor','Rancor','All That Glitters','Swiftfoot Boots','Sram, Senior Edificer','Uril, the Miststalker'],
  uso:['Escolha uma criatura com hexproof (ou dê proteção a ela) antes de colocar auras.','Coloque as auras uma por vez e ataque todo turno.','Guarde uma proteção para responder a remoções que não miram (como "sacrifique uma criatura").','No Commander, o comandante é a peça central: Sram ou Uril, por exemplo.'],
  onde:'Pauper (Bogles), Modern (Hexproof) e Commander (Voltron).',
  arena:'No Arena: Brawl, com o comandante como alvo das auras e equipamentos.',
  fraco:'Remoções que fazem sacrificar ("edict") e remoção em massa. Se a criatura principal cai, tudo cai junto.',
  b:{arch:'aggro', cols:['GW','W','RW'], q:'(o:"equipped creature gets" or o:"enchanted creature gets" or (t:creature o:hexproof mv<=2))', re:/equipped creature gets|enchanted creature gets|hexproof|equip \{/i, fmts:['commander','pauper','modern'], afmts:['brawl','historic']}},
 {k:'rock', n:'The Rock', en:'The Rock (midrange Preto-Verde)', cat:'mid', cols:'BG',
  o:'Midrange Preto-Verde (Golgari): um pouco de tudo, sempre a carta mais eficiente. O nome vem de um deck dos anos 2000 inspirado no lutador The Rock.',
  v:'Tira as melhores cartas da mão do oponente com descarte, remove as ameaças e vence com criaturas eficientes que dominam o meio do jogo.',
  ex:['Thoughtseize','Tarmogoyf','Abrupt Decay','Liliana of the Veil','Pernicious Deed','Sylvan Library','Assassin\'s Trophy','Grim Flayer'],
  uso:['Turno 1: descarte (Thoughtseize, Duress) para ver a mão do oponente e tirar a melhor carta dele.','Use remoção nas ameaças certas: não gaste em criaturas pequenas se vier coisa pior.','Troque cartas 1 por 1 e ganhe no final com cartas que valem mais de uma (planeswalkers, criaturas que trazem valor).','Adapte o plano: contra aggro você é o controle; contra controle você é o aggro.'],
  onde:'Modern (Golgari/Jund), Pioneer e mesas casuais. Ensina muito sobre trocas de cartas.',
  arena:'No Arena: Golgari Midrange no Padrão e no Histórico.',
  fraco:'Combos rápidos e decks que fazem mais "valor" no final. Não tem um plano muito rápido.',
  b:{arch:'midrange', cols:['BG'], q:'(o:"target opponent reveals their hand" or o:"target player reveals their hand" or o:"destroy target creature" or o:"destroy target nonland permanent")', re:/reveals (their|his or her) hand|destroy target (creature|nonland permanent|permanent)/i, fmts:['modern','pioneer'], afmts:['standard','historic']}},
 {k:'aristo', n:'Aristocratas', en:'Aristocrats', cat:'mid', cols:'BW',
  o:'Sacrifica as próprias criaturas de propósito. Cada morte faz o oponente perder vida e você ganhar.',
  v:'Gera muitas criaturas (fichas), sacrifica com um "sacrificador" sem custo e drena o oponente com cartas como Blood Artist e Zulaport Cutthroat.',
  ex:['Blood Artist','Zulaport Cutthroat','Viscera Seer','Carrion Feeder','Cruel Celebrant','Mayhem Devil','Bastion of Remembrance','Teysa Karlov'],
  uso:['Tenha as três peças: algo que cria corpos (fichas), algo que sacrifica de graça (Viscera Seer) e algo que drena quando morre (Blood Artist).','Sacrifique em resposta à remoção do oponente: a criatura morreria de qualquer jeito, e você ganha o efeito.','Guarde os sacrifícios para o turno da vitória, quando o dreno total mata o oponente.','No Commander, Teysa Karlov dobra os efeitos de morte.'],
  onde:'Commander (muito popular), Pioneer e Modern.',
  arena:'No Arena: Histórico, Brawl e às vezes o Padrão (depende das coleções em rotação).',
  fraco:'Cartas que exilam o cemitério ou impedem efeitos de "morrer". Remoção nas peças de dreno.',
  b:{arch:'tokens', cols:['WB','BR','B'], q:'(o:"whenever another creature you control dies" or o:"whenever a creature you control dies" or o:"sacrifice a creature:" or o:"sacrifice another creature:")', re:/whenever (a|another) creature (you control )?dies|sacrifice (a|another) creature/i, fmts:['commander','pioneer'], afmts:['historic','brawl','standard']}},
 {k:'enchant', n:'Enchantress', en:'Enchantress (encantamentos)', cat:'mid', cols:'GW',
  o:'Deck de encantamentos que compra uma carta a cada encantamento conjurado (as "Enchantress": as feiticeiras).',
  v:'Compra cartas sem parar enquanto monta defesas e vence com um encantamento que gera um exército ou com criaturas que crescem com encantamentos.',
  ex:['Argothian Enchantress','Enchantress\'s Presence','Verduran Enchantress','Setessan Champion','Sanctum Weaver','Sigil of the Empty Throne','Utopia Sprawl','Sythis, Harvest\'s Hand'],
  uso:['Abra com uma Enchantress: cada encantamento depois disso compra uma carta.','Encantamentos de mana (Utopia Sprawl) aceleram e contam como encantamento.','Use encantamentos defensivos para segurar o jogo (Ghostly Prison, Sphere of Safety).','Vença com Sigil of the Empty Throne (fichas de Anjo) ou com criaturas que crescem com encantamentos.'],
  onde:'Legacy, Commander (Sythis, Tuvasa) e mesas casuais.',
  arena:'No Arena: Histórico e Brawl (Setessan Champion e Sanctum Weaver estão lá).',
  fraco:'Remoção de encantamentos em massa e decks muito rápidos.',
  b:{arch:'tema', cols:['GW','G','W'], q:'(o:"whenever you cast an enchantment" or o:"enchantment spell" or t:aura or (t:enchantment o:"draw"))', re:/whenever you cast an enchantment|enchantment spell|constellation|for each enchantment/i, fmts:['commander'], afmts:['historic','brawl']}},
 {k:'blink', n:'Blink (Flicker)', en:'Blink / Flicker', cat:'mid', cols:'WU',
  o:'Usa criaturas com efeitos "ao entrar no campo" e as faz sair e voltar (blink) para repetir o efeito.',
  v:'Repete compra de cartas, remoção e ganho de valor várias vezes, até o oponente não aguentar a diferença de cartas.',
  ex:['Ephemerate','Restoration Angel','Soulherder','Flickerwisp','Charming Prince','Thraben Inspector','Brightling','Yorion, Sky Nomad'],
  uso:['Coloque primeiro uma criatura com efeito bom ao entrar (remoção, compra).','Use o blink em resposta a uma remoção: a criatura volta nova e o efeito repete.','Soulherder repete o efeito todo turno: é a peça-motor.','No Commander, combine com comandantes que fazem blink (Brago, Yorion).'],
  onde:'Commander, Modern e Pioneer.',
  arena:'No Arena: Histórico e Brawl.',
  fraco:'Decks rápidos (o blink é lento para começar) e cartas que punem efeitos de entrar no campo.',
  b:{arch:'midrange', cols:['WU','W'], q:'(o:"return it to the battlefield" or o:"return that card to the battlefield" or o:"return them to the battlefield under")', re:/exile .*(you control|target creature you own).*return (it|that card|them) to the battlefield/i, fmts:['commander','pioneer'], afmts:['historic','brawl']}},
 {k:'ramp', n:'Ramp', en:'Ramp (acelerar mana)', cat:'mid', cols:'G',
  o:'Acelera a mana nos primeiros turnos para jogar mágicas enormes muito antes do normal.',
  v:'Nos turnos 4 ou 5 joga criaturas ou mágicas de 7 ou mais de mana, que o oponente ainda não consegue enfrentar.',
  ex:['Llanowar Elves','Rampant Growth','Cultivate','Explore','Primeval Titan','Ulamog, the Ceaseless Hunger','Craterhoof Behemoth','Sol Ring'],
  uso:['Turnos 1 a 3: só acelerar (elfos, mágicas que buscam terrenos).','Do turno 4 em diante: as ameaças grandes, uma por turno.','Tenha poucas cartas de "meio": o deck pula do pequeno para o enorme.','Mulligan em mãos sem aceleração nem terreno suficiente.'],
  onde:'Commander (quase todo deck usa um pouco de ramp), Modern (Tron, Amulet) e mesas casuais.',
  arena:'No Arena: Brawl (ótimo), Padrão e Histórico (Green Ramp).',
  fraco:'Decks rápidos que matam antes das cartas grandes; anulações nas ameaças.',
  b:{arch:'ramp', cols:['G','RG','GU'], q:'t:creature mv>=5', re:/search your library for .*lands?|add \{[WUBRGC]\}|add one mana of any|you may play an additional land/i, fmts:['commander','modern'], afmts:['brawl','standard','historic']}},
 {k:'control', n:'Full Control (Draw-Go)', en:'Full Control / Draw-Go', cat:'ctl', cols:'WU',
  o:'Controle total: quase não tem criaturas. Responde a tudo o que o oponente faz e vence no fim com uma ou duas ameaças.',
  v:'Anula as ameaças, destrói o que passar, compra muitas cartas e só vence quando o oponente já não tem mais nada (o nome Draw-Go vem de "comprar e passar o turno").',
  ex:['Counterspell','Supreme Verdict','Sunfall','Memory Lapse','Absorb','Dig Through Time','Teferi, Hero of Dominaria','Torrential Gearhulk'],
  uso:['Deixe a mana aberta no turno do oponente: a maioria das suas cartas é instantânea.','Não anule tudo: guarde a anulação para o que realmente ameaça você.','Use a remoção em massa quando o oponente tiver colocado várias criaturas.','Só coloque a ameaça para vencer quando tiver como protegê-la.'],
  onde:'Modern, Pioneer e Legacy. Exige paciência e conhecer o deck do oponente.',
  arena:'No Arena: Azorius (Branco-Azul) ou Dimir (Azul-Preto) Control no Padrão e no Histórico.',
  fraco:'Decks agressivos que pressionam cedo, ameaças que não podem ser anuladas e partidas com limite de tempo.',
  b:{arch:'controle', cols:['WU','UB','U'], q:'(o:"counter target spell" or o:"destroy all creatures" or o:"exile all creatures" or o:"draw three cards")', re:/counter target spell|destroy all creatures|exile all (creatures|nonland)|draw (two|three) cards/i, fmts:['modern','pioneer'], afmts:['standard','historic']}},
 {k:'tempo', n:'Tempo (Delver)', en:'Tempo', cat:'ctl', cols:'U',
  o:'Poucas ameaças baratas e eficientes + muitas respostas baratas: atrasa o oponente enquanto ataca.',
  v:'Coloca uma criatura voadora barata cedo e protege ela com anulações baratas e mágicas que devolvem criaturas à mão, ganhando a corrida.',
  ex:['Delver of Secrets','Brazen Borrower','Spell Pierce','Ponder','Counterspell','Murktide Regent','Faerie Seer','Snap'],
  uso:['Jogue a ameaça barata cedo (Delver no turno 1).','Use mana do turno do oponente para anular ou devolver à mão o que ele joga.','Mágicas que compram baratas (Ponder) ajudam a achar as respostas certas.','Seu objetivo não é responder a tudo: é atrasar o oponente o suficiente para vencer.'],
  onde:'Pauper (Faeries/Delver), Modern e Legacy.',
  arena:'No Arena: Azul-Vermelho (Izzet) Tempo no Padrão e no Histórico.',
  fraco:'Criaturas grandes que suas criaturas pequenas não passam; decks com muitas mágicas baratas também.',
  b:{arch:'tempo', cols:['U','UR','UB'], q:'(o:flash or o:"return target creature to its owner\'s hand" or (t:creature o:flying mv<=2))', re:/\bflash\b|return target (creature|nonland permanent) to its owner's hand/i, fmts:['pauper','modern'], afmts:['standard','historic']}},
 {k:'discard', n:'Descarte', en:'Discard (8-Rack e afins)', cat:'ctl', cols:'B',
  o:'Faz o oponente descartar a mão inteira e o pune por não ter cartas.',
  v:'Esvazia a mão do oponente nos primeiros turnos e vence com cartas que causam dano para cada carta a menos na mão dele (The Rack) ou que aproveitam o descarte.',
  ex:['Thoughtseize','Duress','Inquisition of Kozilek','Hymn to Tourach','Liliana of the Veil','The Rack','Waste Not','Megrim'],
  uso:['Do turno 1 ao 3: descarte, mirando primeiro a carta mais perigosa do oponente.','Depois baixe as cartas que punem a mão vazia (The Rack, Megrim).','Leia a mão revelada e planeje seus próximos turnos com essa informação.','Com mão vazia, o oponente depende do topo do grimório: aí você está ganhando.'],
  onde:'Modern (8-Rack), Pauper e mesas casuais.',
  arena:'No Arena: Histórico (Mono-Black ou Rakdos com descarte).',
  fraco:'Decks que jogam a mão rápido (aggro) e cartas que dão valor no cemitério.',
  b:{arch:'midrange', cols:['B','BR','UB'], q:'(o:"target opponent discards" or o:"target player discards" or o:"each opponent discards" or o:"reveals their hand")', re:/(target|each) (opponent|player)s? discards?|reveals (their|his or her) hand|whenever an opponent discards/i, fmts:['modern','pauper'], afmts:['historic']}},
 {k:'stax', n:'Stax', en:'Stax (prisão)', cat:'ctl', cols:'W',
  o:'Trava o jogo com efeitos que atrapalham todo mundo: mágicas mais caras, permanentes que não desviram, limite de mágicas por turno. O deck é montado para sofrer menos com as próprias travas.',
  v:'Deixa o oponente sem conseguir jogar e vence devagar com uma ameaça pequena enquanto ele está preso.',
  ex:['Thalia, Guardian of Thraben','Sphere of Resistance','Trinisphere','Chalice of the Void','Winter Orb','Smokestack','Rule of Law','Rest in Peace'],
  uso:['Coloque as travas cedo, antes que o oponente desenvolva o jogo.','Escolha travas que atrapalham mais o oponente do que você (Thalia contra deck de mágicas).','Tenha poucas ameaças, mas que funcionem com a mesa travada.','No Commander, combine antes com a mesa: muita gente não gosta de Stax em jogo casual.'],
  onde:'Legacy, Vintage e Commander de alto nível. Na mesa casual, converse antes.',
  arena:'No Arena há poucas peças: funciona no Histórico em versões leves (Thalia e afins).',
  fraco:'Remoção de artefatos/encantamentos e decks que jogam muito barato.',
  b:{arch:'controle', cols:['W','WU','WB'], q:'(o:"cost {1} more" or o:"don\'t untap" or o:"can\'t cast more than one" or o:"spells cost {1} more")', re:/cost \{\d\} more|don't untap during|can't untap|can't cast more than one|each player can't/i, fmts:['commander'], afmts:['historic']}},
 {k:'ld', n:'Destruição de terrenos', en:'Land Destruction (LD)', cat:'ctl', cols:'R',
  o:'Destrói os terrenos do oponente para ele nunca ter mana para jogar as cartas dele.',
  v:'Acelera a própria mana, destrói um terreno por turno do oponente (ou todos de uma vez, como Armageddon) e vence com o que ele não consegue responder.',
  ex:['Stone Rain','Molten Rain','Pillage','Armageddon','Ravages of War','Ruination','Wasteland','Boom // Bust'],
  uso:['Acelere a mana (elfos, mágicas de ramp) para destruir terrenos já no turno 2 ou 3.','Mire nos terrenos que dão a cor que falta ao oponente.','Armageddon é melhor quando você já tem criaturas na mesa e o oponente não.','No Commander, a destruição de terrenos em massa só é aceita nos níveis de poder mais altos: combine antes.'],
  onde:'Modern (Ponza, Vermelho-Verde) e Legacy (Wasteland). Em mesas casuais costuma ser malvista.',
  arena:'No Arena há poucas cartas; funciona no Histórico em versões leves.',
  fraco:'Decks de custo muito baixo e decks que já começaram o jogo antes da destruição.',
  b:{arch:'midrange', cols:['RG','R'], q:'(o:"destroy target land" or o:"destroy target nonbasic land" or o:"destroy all lands")', re:/destroy (target|all|each) (nonbasic )?lands?|destroy target artifact or land/i, fmts:['modern'], afmts:['historic']}},
 {k:'mill', n:'Mill (com combo)', en:'Mill combo', cat:'combo', cols:'U',
  o:'Vence sem dano: o oponente perde quando precisa comprar e o grimório está vazio. A versão combo usa duas cartas que, juntas, mandam o grimório inteiro para o cemitério.',
  v:'Monta o combo (ex.: Painter\'s Servant + Grindstone) e moe o grimório inteiro de uma vez; ou dobra o mill com cartas como Bruvac, the Grandiloquent.',
  ex:['Painter\'s Servant','Grindstone','Bruvac the Grandiloquent','Maddening Cacophony','Tasha\'s Hindrance','Hedron Crab','Psychic Corrosion','Jace, Wielder of Mysteries'],
  uso:['Proteja as peças do combo: anulações ou procurar a peça que falta.','Antes do combo, use mill pequeno para diminuir o grimório.','Jace, Wielder of Mysteries e similares impedem que você perca ao ficar sem cartas.','Atenção: alguns decks gostam do cemitério cheio (reanimator, dredge). Leia o deck do oponente.'],
  onde:'Legacy e Vintage (Painter + Grindstone) e Commander.',
  arena:'No Arena: Histórico e Brawl, com Bruvac e mill em dobro.',
  fraco:'Cartas que embaralham o cemitério de volta e decks que usam o cemitério a seu favor.',
  b:{arch:'controle', cols:['U','UB'], q:'(o:mill or o:"into their graveyard")', re:/\bmills?\b|into (their|his or her) graveyard/i, fmts:['commander'], afmts:['historic','brawl']}},
 {k:'millnc', n:'Mill sem combo', en:'Mill (controle)', cat:'ctl', cols:'UB',
  o:'O mesmo objetivo (esvaziar o grimório do oponente), mas aos poucos, com muitas cartas de mill e controle, sem depender de duas peças.',
  v:'Moe de 2 a 10 cartas por vez, várias vezes, enquanto se defende com remoções e anulações, até o grimório acabar.',
  ex:['Hedron Crab','Ruin Crab','Merfolk Secretkeeper','Maddening Cacophony','Fractured Sanity','Tome Scour','Archive Trap','Glimpse the Unthinkable'],
  uso:['Os caranguejos (Hedron/Ruin Crab) moem a cada terreno: jogue-os primeiro.','Conte o grimório do oponente: começa com 33 a 40 cartas num deck de 60.','Use remoção e anulação como um deck de controle enquanto mói.','Mill em massa (Fractured Sanity, Maddening Cacophony) fecha o jogo.'],
  onde:'Pauper, Modern e mesas casuais.',
  arena:'No Arena: Histórico e Padrão (decks de Ruin Crab).',
  fraco:'Decks rápidos (mill é lento) e decks de cemitério.',
  b:{arch:'controle', cols:['U','UB'], q:'(o:mill or o:"into their graveyard")', re:/\bmills?\b|into (their|his or her) graveyard/i, fmts:['pauper','modern'], afmts:['historic','standard']}},
 {k:'reanim', n:'Reanimator', en:'Reanimator', cat:'combo', cols:'B',
  o:'Coloca uma criatura gigante no cemitério cedo e a traz de volta ao campo pagando pouco.',
  v:'No turno 2 ou 3 tem em jogo uma criatura de 8 ou mais de mana (Griselbrand, Atraxa) que deveria chegar só no turno 8.',
  ex:['Entomb','Buried Alive','Faithless Looting','Animate Dead','Reanimate','Persist','Griselbrand','Atraxa, Grand Unifier'],
  uso:['Passo 1: coloque o monstro no cemitério (descarte, Entomb, mill).','Passo 2: reanime com Animate Dead, Reanimate ou similares.','Tenha poucas criaturas, mas enormes, e várias formas de reanimar.','Atenção a cartas que exilam o cemitério (o oponente pode ter).'],
  onde:'Legacy, Modern, Pauper e Commander (Meren, Chainer).',
  arena:'No Arena: Histórico, Timeless e Brawl.',
  fraco:'Cartas que exilam o cemitério (Rest in Peace, Leyline of the Void) e remoção que exila.',
  b:{arch:'midrange', cols:['B','UB','BR'], q:'(o:"graveyard to the battlefield" or o:"graveyard onto the battlefield" or (t:creature mv>=7))', re:/(graveyard (to|onto) the battlefield)|return target creature card from (a|your) graveyard to the battlefield/i, fmts:['commander','modern'], afmts:['historic','brawl']}},
 {k:'spells', n:'Spellslinger', en:'Spellslinger', cat:'combo', cols:'UR',
  o:'Deck de mágicas instantâneas e feitiços, com criaturas que ganham algo a cada mágica conjurada.',
  v:'Conjura muitas mágicas baratas; cada uma cria fichas, causa dano ou fortalece criaturas (prowess), até virar um exército ou um tiro final.',
  ex:['Young Pyromancer','Guttersnipe','Third Path Iconoclast','Monastery Swiftspear','Talrand, Sky Summoner','Expressive Iteration','Opt','Consider'],
  uso:['Coloque primeiro a criatura que ganha com mágicas, depois conjure as mágicas.','Prefira mágicas baratas que compram (Opt, Consider): o deck não para.','Guarde mágicas instantâneas para o turno do oponente quando possível.','No Commander, Talrand ou Kess são ótimos comandantes.'],
  onde:'Commander, Pioneer e Modern (Izzet Prowess).',
  arena:'No Arena: Padrão, Histórico e Brawl (Izzet).',
  fraco:'Remoção nas criaturas-motor e decks que punem mágicas (Thalia).',
  b:{arch:'tempo', cols:['UR','R','U'], q:'(o:"whenever you cast an instant or sorcery" or o:magecraft or o:prowess)', re:/whenever you cast an instant or sorcery|magecraft|prowess|instant and sorcery spells you cast/i, fmts:['commander','pioneer'], afmts:['standard','historic','brawl']}},
 {k:'storm', n:'Storm', en:'Storm', cat:'combo', cols:'R',
  o:'Combo de muitas mágicas num turno só. A habilidade Storm copia a mágica uma vez para cada mágica conjurada antes dela no turno.',
  v:'Num turno, conjura 10 ou mais mágicas baratas (que geram mana ou compram) e termina com Grapeshot ou Empty the Warrens copiado várias vezes.',
  ex:['Grapeshot','Empty the Warrens','Past in Flames','Manamorphose','Ruby Medallion','Desperate Ritual','Gifts Ungiven','Wish'],
  uso:['Nos primeiros turnos, só monte: reduza custos (Ruby Medallion) e guarde mágicas.','No turno do combo, conte com cuidado: mana disponível, mágicas na mão e o número da tempestade (storm).','Rituais geram mais mana do que custam; cantrips (Manamorphose) mantêm a contagem.','Termine com Grapeshot no jogador quando o storm for maior que a vida dele.'],
  onde:'Modern e Legacy. Deck difícil: ótimo para quem gosta de matemática.',
  arena:'No Arena: só versões leves no Histórico/Timeless.',
  fraco:'Cartas que limitam mágicas por turno (Rule of Law) e anulações na hora do combo.',
  b:{arch:'tempo', cols:['R','UR'], q:'(o:storm or o:"copy it for each" or ((t:instant or t:sorcery) o:"add {R}"))', re:/\bstorm\b|copy (it|that spell) for each|costs? \{\d\} less to cast/i, fmts:['modern'], afmts:['historic']}},
 {k:'combo2', n:'Combo de duas cartas', en:'Two-card combo', cat:'combo', cols:'',
  o:'Duas cartas que, juntas, vencem na hora ou criam algo infinito (mana, dano, fichas).',
  v:'Procura as duas peças (comprando ou buscando no grimório), protege-as e as junta num turno.',
  ex:['Thassa\'s Oracle','Demonic Consultation','Splinter Twin','Pestermite','Devoted Druid','Vizier of Remedies','Heliod, Sun-Crowned','Walking Ballista'],
  uso:['Tenha cartas que procuram as peças (tutores) ou compram muito.','Espere uma janela segura: o oponente sem mana aberta para responder.','Tenha um plano B: o oponente vai mirar as peças do combo.','Pergunte na mesa casual se combos infinitos estão liberados.'],
  onde:'Commander (cEDH), Legacy e Modern.',
  arena:'No Arena: alguns combos funcionam no Histórico e no Brawl.',
  fraco:'Remoção nas peças, anulações e cartas que impedem habilidades.',
  b:null}
];
let stOpen = null, stCat = 'todas', stDet = null;
const stByK = k => STRATS.find(s => s.k === k);
const stPips = c => c ? c.split('').map(manaSym).join('') : '';
function stFmtNames(L){ return (L || []).map(k => AF[k] ? AF[k].n : k).join(', '); }
function stCardMatch(S0, n){
  const d = cardData(n) || {}, L = LEG[n] || {}, txt = (d.x || '') + ' ' + (L.tl || d.t || '');
  if (!S0.b) return false;
  if (S0.b.det) return S0.b.det(d, L);
  if (S0.b.tribal) return false;
  return !!(S0.b.re && S0.b.re.test(txt));
}
/* ---------- detector: qual estratégia combina com o meu deck / coleção ---------- */
async function stDetect(src){
  const st = m => { const e = $('#stDetSt'); if (e) e.textContent = m; };
  let E = {};
  if (src === 'deck') parseDeck(deckText).forEach(e => { const n = CARD_ALIAS[e.name.toLowerCase()] || e.name; E[n] = (E[n] || 0) + e.q; });
  else if (src === 'arena') E = Object.assign({}, S.acoll || {});
  else if (src === 'fisica') parseDeck(S.coll || '').forEach(e => { const n = CARD_ALIAS[e.name.toLowerCase()] || e.name; E[n] = (E[n] || 0) + e.q; });
  else if (src && src.startsWith('lib:')) { const D = (S.lib || []).find(d => d.id === src.slice(4)); if (D) parseDeck(D.versions[D.versions.length - 1].text).forEach(e => { E[e.name] = (E[e.name] || 0) + e.q; }); }
  const names = Object.keys(E).filter(n => !isBasic(n));
  if (!names.length) { st(src === 'deck' ? 'Nenhum deck em uso. Importe ou crie um deck primeiro.' : 'Essa coleção está vazia.'); return; }
  st(`Lendo ${names.length} cartas…`);
  try { for (let i = 0; i < names.length; i += 75) { await fetchLegal(names.slice(i, i + 75)); st(`Lendo as cartas… ${Math.min(i + 75, names.length)} de ${names.length}`); } } catch(e) { st('Sem conexão com o Scryfall: usei só as cartas que a Academia já conhece.'); }
  const isColl = src === 'arena' || src === 'fisica';
  const tot = names.reduce((a, n) => a + (isColl ? 1 : E[n]), 0);
  /* tribo mais comum */
  const tribes = {}; names.forEach(n => { const tl = (LEG[n] || {}).tl || (cardData(n) || {}).t || ''; const m = /Creature\s+[—-]\s+(.+)$/.exec(tl); if (m) m[1].split(/\s+/).forEach(t => { if (t.length > 2) tribes[t] = (tribes[t] || 0) + (isColl ? 1 : E[n]); }); });
  const topTribe = Object.entries(tribes).sort((a, b) => b[1] - a[1])[0];
  const res = STRATS.filter(s => s.b).map(s => {
    let hit = [];
    if (s.b.tribal) { if (topTribe) hit = names.filter(n => new RegExp('\\b' + topTribe[0] + '\\b').test((LEG[n] || {}).tl || (cardData(n) || {}).t || '')); }
    else hit = names.filter(n => stCardMatch(s, n));
    const q = hit.reduce((a, n) => a + (isColl ? 1 : E[n]), 0);
    return {s, hit, q, pct: tot ? Math.round(q / tot * 100) : 0, tribe: s.b.tribal && topTribe ? topTribe[0] : null};
  }).filter(r => r.q > 0).sort((a, b) => b.q - a.q).slice(0, 5);
  stDet = {src, res, isColl, tot};
  st('');
  const box = $('#stDetOut'); if (box) { box.innerHTML = stDetHTML(); bindStDet(); }
}
function stDetHTML(){
  if (!stDet) return '';
  if (!stDet.res.length) return '<p class="muted">Não reconheci nenhuma estratégia clara nessas cartas. Tente outro deck ou use "Montar" numa estratégia abaixo.</p>';
  const own = stDet.src === 'arena' ? 'arena' : stDet.src === 'fisica' ? 'fisica' : '';
  return `<div class="st-det">${stDet.res.map((r, i) => `<div class="st-det-i"><div class="row-h" style="justify-content:space-between"><b>${i === 0 ? '★ ' : ''}${r.s.n}${r.tribe ? ` (${esc(r.tribe)})` : ''}</b><span class="muted">${stDet.isColl ? `${r.q} cartas suas servem` : `${r.pct}% do deck`}</span></div>
      <span class="own-bar"><i style="width:${Math.min(100, stDet.isColl ? Math.round(r.q / Math.max(1, stDet.res[0].q) * 100) : r.pct * 2)}%;background:var(--accent)"></i></span>
      <small class="muted">${r.hit.slice(0, 5).map(esc).join(', ')}${r.hit.length > 5 ? '…' : ''}</small>
      <div class="row-h"><button class="btn small" data-stopen="${r.s.k}">Ver a estratégia</button>${r.s.b ? `<button class="btn small primary" data-stgo="${r.s.k}" data-stown="${own}">${own ? 'Montar com as minhas cartas' : 'Montar um deck assim'}</button>` : ''}</div></div>`).join('')}</div>
    ${stDet.src === 'deck' || (stDet.src || '').startsWith('lib:') ? '<p class="muted" style="font-size:.88rem">O detector olha o texto das cartas. Um deck pode misturar duas estratégias (por exemplo, Aristocratas + Fichas): isso é normal.</p>' : ''}`;
}
function bindStDet(){
  $$('[data-stopen]').forEach(b => b.onclick = () => { stOpen = b.dataset.stopen; renderStrats(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); });
  $$('[data-stgo]').forEach(b => b.onclick = () => stBuild(b.dataset.stgo, {own: b.dataset.stown || null}));
}
/* ---------- montar: leva para o Criar deck do zero com as respostas preenchidas ---------- */
function stBuild(k, o){
  const s = stByK(k); if (!s || !s.b) return;
  o = o || {};
  const B = s.b, win = {aggro:'rapido', tempo:'magicas', controle:'controle', ramp:'grande', tokens:'fichas', tema:'sinergia', midrange:'sinergia'}[B.arch];
  const a = {win, inter: B.arch === 'controle' ? 'muita' : B.arch === 'aggro' ? 'pouca' : 'media', pace: B.arch === 'aggro' ? 'rapida' : B.arch === 'controle' || B.arch === 'ramp' ? 'longa' : 'media',
    theme: B.tribal ? 'tribal' : 'strat', exp:'medio', rar:'all', tribe: o.tribe || 'elf'};
  asd = {step:1, fmt:null, a, colsPick:null, rec:null, choice:null, cmdOpts:null, cmd:null, plan:null, res:null, busy:false, vari:0, own: o.own || null, arenaOnly: !!o.arena, strat:k};
  OWN_THEME.strat = B.re || /$^/;
  ownSt.ready = false; deckTab = 'gerar'; show('construir'); window.scrollTo({top:0});
}
/* ganchos no gerador */
(function(){
  const sb = () => asd.strat && stByK(asd.strat) && stByK(asd.strat).b;
  const aa = asArch; asArch = function(a){ const B = sb(); return B ? B.arch : aa(a); };
  const ar = asRecommend; asRecommend = function(){ const r = ar(); const B = sb(); if (!B) return r; r.k = B.arch; if (!(asd.colsPick && asd.colsPick.length)) r.cols = (B.tribal ? (TRIBE_COLS[asd.a.tribe] || B.cols) : B.cols).slice(0, 3); return r; };
  const tq = asThemeQ; asThemeQ = function(){ const B = sb(); return B && !B.tribal && B.q ? B.q : tq(); };
  const fk = asFmtKeys; asFmtKeys = function(){ const L = fk(); const B = sb(); if (!B) return L; const pref = asd.arenaOnly ? B.afmts : B.fmts.concat(B.afmts); return L.slice().sort((x, y) => (pref.includes(y) ? 1 : 0) - (pref.includes(x) ? 1 : 0)); };
  const s1 = asS1; asS1 = function(){ const h = s1(); const s = asd.strat && stByK(asd.strat); if (!s) return h;
    return `<div class="an-banner st-banner"><b>Estratégia: ${s.n} ${stPips(s.cols)}</b><span>As perguntas já vêm respondidas para ${s.n}. Escolha de onde vêm as cartas e o formato. <b>Indicados:</b> ${stFmtNames(asd.arenaOnly ? s.b.afmts : s.b.fmts.concat(s.b.afmts))}.</span><button class="btn small" id="stQuit">Sair da estratégia</button></div>` + h; };
  const s2 = asS2; asS2 = function(){ const h = s2(); const s = asd.strat && stByK(asd.strat); if (!s) return h;
    return `<div class="tip" style="font-size:.9rem"><b>${s.n}:</b> as respostas foram preenchidas pela estratégia. Você pode ajustar as cores, a experiência e quanto quer gastar.${s.b.tribal ? ' <b>Escolha a tribo</b> no tema "Um tipo de criatura".' : ' Não mude o tema: ele é o que define a estratégia.'}</div>` + h; };
  const ba = bindAssist; bindAssist = function(){ ba.apply(this, arguments); const s = asd.strat && stByK(asd.strat);
    const q = $('#stQuit'); if (q) q.onclick = () => { asd.strat = null; if (asd.a.theme === 'strat') asd.a.theme = 'nenhum'; renderAssist(); };
    if (s && asd.step === 1) { const pref = asd.arenaOnly ? s.b.afmts : s.b.fmts.concat(s.b.afmts); $$('[data-af]').forEach(b => { if (pref.includes(b.dataset.af) && !b.querySelector('.st-ind')) b.querySelector('b').insertAdjacentHTML('beforeend', ' <span class="pill st-ind">Indicado</span>'); }); } };
  const ob = ownBest; ownBest = function(){ const L = ob(); const B = sb(); if (!B || B.tribal) return L; return L.filter(c => c.arch !== B.arch || B.cols.includes(c.cols)); };
  const s3 = asS3; asS3 = function(){ let h = s3(); const s = asd.strat && stByK(asd.strat); if (!s) return h; const A = AS_ARCH[s.b.arch];
    return h.replace(new RegExp('(o )?seu estilo é <b>' + A.n.replace(/[()]/g, '\\$&') + '</b>'), `a estratégia é <b>${s.n}</b> (o gerador usa a base ${A.n})`); };
  const d0 = DECK_R; DECK_R = () => { const m = d0(); Object.keys(m).forEach(k => { if (k !== 'gerar') { const f = m[k]; m[k] = function(){ asd.strat = null; return f.apply(this, arguments); }; } }); return m; };
})();
/* ---------- tela ---------- */
function stCardHTML(s){
  return `<button class="st-card" data-stopen="${s.k}"><span class="st-pips">${stPips(s.cols) || '<span class="muted">qualquer cor</span>'}</span><b>${s.n}</b><small class="muted">${s.en}</small><small>${s.o.split('. ')[0].replace(/\.$/, '')}.</small></button>`;
}
function stDetailHTML(s){
  const B = s.b;
  return `<div class="panel stack-v st-detail"><div class="row-h" style="justify-content:space-between"><button class="btn small" id="stBack">← Todas as estratégias</button><span class="pill">${ST_CAT[s.cat]}</span></div>
    <h3 style="margin:0">${s.n} ${stPips(s.cols)}</h3><small class="muted">${s.en}</small>
    <div class="st-sec"><b>O que é</b><p>${s.o}</p></div>
    <div class="st-sec"><b>Como vence</b><p>${s.v}</p></div>
    <div class="st-sec"><b>Como jogar</b><ol>${s.uso.map(u => `<li>${u}</li>`).join('')}</ol></div>
    <div class="st-sec"><b>Cartas de exemplo</b><p class="muted" style="font-size:.86rem;margin:0">Toque numa carta para ver em tamanho grande. Algumas cartas clássicas não existem no Arena: quando você monta pelo Arena, a Academia usa só as que existem lá.</p>
      <div class="st-ex">${s.ex.map(n => cardHTML(n, {showPt:false})).join('')}</div></div>
    <div class="grid g2" style="align-items:start"><div class="st-sec"><b>Onde usar (mesa física)</b><p>${s.onde}</p></div><div class="st-sec"><b>No MTG Arena</b><p>${s.arena}</p></div></div>
    <div class="st-sec"><b>Pontos fracos (e como enfrentar)</b><p>${s.fraco}</p></div>
    ${B ? `<div class="st-build stack-v"><b class="an-t">Montar um deck ${s.n}</b>
      <p class="muted" style="margin:0;font-size:.9rem">A Academia leva você ao Criar deck do zero com as respostas já preenchidas para ${s.n}. No fim, a lista sai pronta para copiar para o Arena ou para montar com cartas físicas.</p>
      <div class="st-fmts"><span><b>Mesa:</b> ${stFmtNames(B.fmts)}</span><span><b>Arena:</b> ${stFmtNames(B.afmts)}</span></div>
      <div class="row-h">
        <button class="btn primary" data-stgo="${s.k}" data-starena="1">Montar para o Arena</button>
        <button class="btn" data-stgo="${s.k}" data-stown="arena" data-starena="1" ${Object.keys(S.acoll || {}).length ? '' : 'disabled title="Cadastre a coleção em Arena e coleção"'}>Com as minhas cartas do Arena</button>
        <button class="btn" data-stgo="${s.k}" data-stown="fisica" ${parseDeck(S.coll || '').length ? '' : 'disabled title="Cadastre a coleção física em Arena e coleção"'}>Com a minha coleção física</button>
        <button class="btn" data-stgo="${s.k}">Para a mesa (qualquer carta)</button></div></div>`
    : `<div class="tip">Combos de duas cartas dependem de peças específicas: monte em Criar deck do zero escolhendo cores e tema, e depois use "Melhorar meu deck" para colocar as peças do combo.</div>`}
  </div>`;
}
function renderStrats(){
  const s = stOpen && stByK(stOpen);
  const libs = (S.lib || []);
  $('#deckBody').innerHTML = s ? stDetailHTML(s) : `<div class="panel stack-v"><h3>Estratégias do Magic</h3>
    <p class="muted" style="margin:0">Os estilos de deck clássicos que todo jogador comenta: o que cada um faz, como jogar, onde usar e um botão para montar o seu (com qualquer carta, com as suas cartas do Arena ou com a sua coleção física).</p>
    <div class="st-detbox stack-v"><b>Qual estratégia combina com…</b>
      <div class="row-h"><button class="btn small" data-stdet="deck">o deck em uso</button><button class="btn small" data-stdet="arena" ${Object.keys(S.acoll || {}).length ? '' : 'disabled'}>a minha coleção do Arena</button><button class="btn small" data-stdet="fisica" ${parseDeck(S.coll || '').length ? '' : 'disabled'}>a minha coleção física</button>
      ${libs.length ? `<select id="stLib" aria-label="Deck salvo"><option value="">um deck salvo…</option>${libs.map(d => `<option value="lib:${d.id}">${esc(d.name)}</option>`).join('')}</select>` : ''}</div>
      <span class="muted" id="stDetSt" style="font-size:.9rem"></span><div id="stDetOut">${stDetHTML()}</div></div>
    <div class="row-h st-cats">${[['todas','Todas']].concat(Object.entries(ST_CAT)).map(([k, l]) => `<button class="chip" data-stcat="${k}" aria-pressed="${stCat === k}">${l}</button>`).join('')}</div>
    <div class="st-grid">${STRATS.filter(x => stCat === 'todas' || x.cat === stCat).map(stCardHTML).join('')}</div></div>`;
  bindStDet();
  $$('[data-stgo]').forEach(b => b.onclick = () => stBuild(b.dataset.stgo, {own: b.dataset.stown || null, arena: !!b.dataset.starena}));
  $$('[data-stcat]').forEach(b => b.onclick = () => { stCat = b.dataset.stcat; renderStrats(); });
  $$('[data-stdet]').forEach(b => b.onclick = () => stDetect(b.dataset.stdet));
  const sl = $('#stLib'); if (sl) sl.onchange = () => { if (sl.value) stDetect(sl.value); };
  const bk = $('#stBack'); if (bk) bk.onclick = () => { stOpen = null; renderStrats(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); };
}
/* registra a aba em Construir */
(function(){
  const T = SECTIONS.construir.tabs; T.splice(1, 0, ['estrat', 'Estratégias do Magic']);
  const d0 = DECK_R; DECK_R = () => Object.assign(d0(), {estrat: renderStrats});
  TAB_IC.estrat = 'compass'; TAB_HINT.estrat = 'Burn, Ramp, Reanimator, Stax…';
  TAB_TXT.estrat = 'Estratégias do Magic: Burn, Stompy, Affinity, Soul Sisters, Kindred, Fichas, Voltron, The Rock, Aristocratas, Enchantress, Blink, Ramp, Full Control, Tempo, Descarte, Stax, Destruição de terrenos, Mill, Reanimator, Spellslinger, Storm e Combo; com exemplos, como jogar e botão para montar.';
  FEATS.push(['Estratégias do Magic','Burn, Ramp, Reanimator, Aristocratas, Mill, Stax… e como montar cada uma','estrategia estrategias arquetipo arquetipos burn ramp reanimator reanimar spellslinger aristocratas aristocrats mill moer land destruction destruir terrenos affinity afinidade rock enchantress encantamentos soul sisters vida stompy stax prisao controle control draw go descarte discard kindred tribal tribo tempo delver fichas tokens voltron bogles blink flicker storm combo',() => { stOpen = null; deckTab = 'estrat'; show('construir'); }]);
})();
