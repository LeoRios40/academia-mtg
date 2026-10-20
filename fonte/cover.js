/* ================= CAPA ================= */
const PWS = [
 ['Jace, the Mind Sculptor','Jace Beleren','Mentalista azul nascido em Vryn. Lê e altera mentes, e foi um dos fundadores dos Sentinelas (Gatewatch), o grupo de planeswalkers que protege o Multiverso.'],
 ['Liliana of the Veil','Liliana Vess','Necromante que fez pactos com quatro demônios em troca de juventude e poder. Vilã, aliada e anti-heroína ao longo das histórias.'],
 ['Chandra, Torch of Defiance','Chandra Nalaar','Piromante de Kaladesh, impulsiva e de coração enorme. Sua centelha despertou em meio ao fogo, quando tentaram executá-la ainda criança.'],
 ['Gideon, Ally of Zendikar','Gideon Jura','Soldado de Theros que vira escudo vivo. Liderou os Sentinelas e se sacrificou na Guerra da Centelha.'],
 ['Nissa, Who Shakes the World','Nissa Revane','Elfa animista de Zendikar que sente e desperta a alma do próprio plano.'],
 ['Ajani Goldmane','Ajani Goldmane','Leonino de Alara, guerreiro e mentor. Equilíbrio entre fúria e compaixão.'],
 ['Teferi, Hero of Dominaria','Teferi','Mago do tempo de Dominaria. Já tirou um continente inteiro do fluxo do tempo para protegê-lo.'],
 ['Nicol Bolas, Dragon-God','Nicol Bolas','Dragão ancião e o maior vilão da história do Magic. Tentou se tornar um deus roubando centelhas na Guerra da Centelha.'],
 ['Karn Liberated','Karn','Golem de prata criado por Urza, com consciência própria. Um dos planeswalkers mais antigos ainda vivos.'],
 ['Ugin, the Spirit Dragon','Ugin','O Dragão Espírito, irmão gêmeo de Nicol Bolas, que ajudou a aprisionar os Eldrazi em Zendikar.']
];
const ICONS = [
 ['Black Lotus','O card mais famoso do jogo: três manas grátis. Uma cópia de 1993 em estado perfeito foi vendida por mais de 500 mil dólares.'],
 ['Ancestral Recall','Parte da "Power Nine": compra três cards por um único mana azul.'],
 ['Lightning Bolt','A régua do jogo: toda criatura é medida pelo "morre para um Bolt?". Está na primeira coleção, de 1993.'],
 ['Llanowar Elves','O elfo que gera mana desde 1993. Reimpresso em dezenas de coleções.'],
 ['Shivan Dragon','O primeiro dragão icônico do jogo, sonho de todo jogador da década de 90.'],
 ['Serra Angel','A anja da primeira coleção, símbolo do branco por décadas.'],
 ['Sol Ring','Um mana vira dois. Presente em grande parte dos decks de Commander.'],
 ['Birds of Paradise','Mana de qualquer cor desde 1993. Ilustrações famosas em todas as reimpressões.'],
 ['Storm Crow','Um corvo 1/2 sem nada de especial que virou o maior meme da comunidade.'],
 ['Tarmogoyf','A criatura de 2 manas que dominou o Modern por anos e virou sinônimo de carta cara.'],
 ['Emrakul, the Aeons Torn','O maior titã Eldrazi: custa 15 e dá um turno extra só por ser conjurado.'],
 ['Counterspell','"Não." O instantâneo mais clássico do azul, desde a primeira coleção.']
];
const TIMELINE = [
 ['1993','Nasce o Magic','Richard Garfield cria o jogo e a Wizards of the Coast lança a coleção Alpha. Foi o primeiro jogo de cartas colecionáveis (TCG) do mundo.'],
 ['1994','Primeiras expansões','Arabian Nights, Antiquities e Legends. Legends traz as primeiras criaturas lendárias.'],
 ['1996','Primeiro Pro Tour','Nasce o circuito profissional, em Nova York. A política da "Reserved List" também é criada nessa época.'],
 ['1997','Magic em português','A Quinta Edição é lançada em português e o jogo se espalha pelo Brasil.'],
 ['2002','Magic Online','A primeira versão digital oficial para competir pela internet.'],
 ['2003','Nova moldura','A 8ª Edição estreia a moldura moderna. Ela também marca o início do formato Modern.'],
 ['2007','Planeswalkers viram cartas','Lorwyn traz os primeiros cards de planeswalker, incluindo Jace e Liliana.'],
 ['2009','Grande revisão das regras','O dano de combate deixa de usar a pilha. Começam as coleções básicas anuais (Magic 2010).'],
 ['2011','Commander oficial','A Wizards lança os primeiros decks de Commander, formato criado por jogadores e juízes nos anos 90 com o nome EDH (Elder Dragon Highlander).'],
 ['2019','MTG Arena e a Guerra da Centelha','O Arena sai oficialmente e War of the Spark encerra a saga de Nicol Bolas com 36 planeswalkers.'],
 ['2020','Arena no celular','O Arena chega ao Android e ao iOS.'],
 ['2024','Foundations e a nova gestão do Commander','Foundations vira base do Padrão por anos; a Wizards passa a administrar o Commander diretamente. As regras de combate simplificam a divisão de dano.'],
 ['2025','Brackets de Commander','Os níveis de 1 a 5 e a lista de Game Changers mudam a forma de montar mesas casuais.']
];
const FACTS = [
 ['A Power Nine','Black Lotus, Ancestral Recall, Time Walk, Timetwister e os cinco Moxes (Pearl, Sapphire, Jet, Ruby, Emerald). As cartas mais poderosas da primeira coleção.'],
 ['A Lista Reservada','Uma promessa da Wizards de nunca reimprimir certas cartas antigas, como as duais originais. Por isso elas são tão caras.'],
 ['Um Anel de 2 milhões','Em 2023, a única cópia numerada 1/1 de The One Ring, da coleção do Senhor dos Anéis, foi comprada por um músico famoso por cerca de 2 milhões de dólares.'],
 ['O jogo é "completo de Turing"','Pesquisadores mostraram que é possível montar, com cartas reais, uma partida que funciona como um computador. Magic é tão complexo quanto qualquer programa.'],
 ['Dominaria, o plano natal','Onde a história começou: Urza, Mishra, a Guerra dos Irmãos e a invasão de Phyrexia.'],
 ['Ravnica, a cidade-plano','Um plano inteiro coberto por cidade, governado pelas dez guildas de duas cores. Por isso os pares de cores têm nomes de guilda.'],
 ['A roda das cores','Cada cor tem duas aliadas (vizinhas na roda) e duas inimigas (opostas). Branco é aliado de azul e verde, e inimigo de preto e vermelho.'],
 ['Veneno','Uma forma alternativa de vencer: 10 marcadores de veneno derrotam qualquer jogador, mesmo com 20 de vida.'],
 ['Planeswalkers mortais','Depois de um evento chamado "a Remenda" (Time Spiral), os planeswalkers deixaram de ser semideuses e ficaram mais humanos.'],
 ['"Tap" virou palavra','Wizards chegou a ter a patente da mecânica de virar o card para mostrar que ele foi usado.']
];
const COLOR_Q = [
 ['O que mais importa para você?',['Justiça e proteger as pessoas','Conhecimento e aperfeiçoamento','Poder e liberdade para conquistar','Liberdade e viver com intensidade','Harmonia e respeito à natureza']],
 ['Num jogo em grupo, você costuma…',['Organizar o time','Planejar três jogadas à frente','Fazer o que for preciso para vencer','Partir para cima sem pensar muito','Crescer aos poucos até ficar imbatível']],
 ['Seu maior defeito pode ser…',['Rigidez com as regras','Querer controlar tudo','Pensar demais em si mesmo','Impulsividade','Resistência a mudanças']],
 ['Um dia livre perfeito',['Ajudar num projeto da comunidade','Aprender algo novo','Avançar num objetivo ambicioso','Uma aventura ou um show','Uma trilha na natureza']],
 ['Qual criatura você seria?',['Anjo','Esfinge','Vampiro','Dragão','Hidra']],
 ['Como você vence uma discussão?',['Apelando para o bem de todos','Com lógica e dados','Achando o ponto fraco do outro','Com paixão e emoção','Com paciência: a verdade aparece']],
 ['A frase que te define',['"Juntos somos mais fortes."','"Saber é poder."','"O fim justifica os meios."','"Viva o agora."','"Tudo tem o seu tempo."']]
];
const COLOR_INFO = {
  W:['Branco','Ordem, comunidade e proteção. Você acredita que regras justas tornam todos mais fortes.','Ajani Goldmane','Light-Paws, Emperor\'s Voice'],
  U:['Azul','Conhecimento, lógica e perfeição. Você prefere pensar antes de agir e vencer pela informação.','Jace, the Mind Sculptor','Talrand, Sky Summoner'],
  B:['Preto','Ambição e poder pessoal. Você não aceita limites e paga o preço que for para chegar lá.','Liliana of the Veil','Sheoldred, Whispering One'],
  R:['Vermelho','Liberdade, emoção e ação. Você sente primeiro e pensa depois, e vive com intensidade.','Chandra, Torch of Defiance','Krenko, Mob Boss'],
  G:['Verde','Natureza, crescimento e aceitação. Você confia no tempo e na força do que é natural.','Nissa, Who Shakes the World','Ezuri, Renegade Leader']
};
const GUILD_OF = {WU:'Azorius',UB:'Dimir',BR:'Rakdos',RG:'Gruul',GW:'Selesnya',WB:'Orzhov',UR:'Izzet',BG:'Golgari',RW:'Boros',GU:'Simic'};
const PIE = ['W','U','B','R','G'];
let cvPanel = null, cq = {i:0, sc:{W:0,U:0,B:0,R:0,G:0}, done:false, order:null}, seq = [];

function buildCover(){
  const el = document.createElement('div'); el.id = 'cover'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','Capa da Academia do Planeswalker');
  document.body.prepend(el);
  const doneN = Object.keys(S.done).length;
  const pos = PIE.map((c,i)=>{ const a = -Math.PI/2 + i*2*Math.PI/5; return [c, 50 + 37*Math.cos(a), 50 + 37*Math.sin(a)]; });
  el.innerHTML = `<canvas class="sky" id="sky" aria-hidden="true"></canvas>
  <div class="cv-in">
    <section class="cv-hero">
      <div>
        <p class="cv-eyebrow">Magic: The Gathering · em português</p>
        <h1>Academia do Planeswalker</h1>
        <p class="cv-lede">Do primeiro terreno à mesa da loja. Regras, lições práticas, formatos, montagem de decks, MTG Arena e tudo o que os veteranos esperam que você saiba.</p>
        <div class="cv-actions">
          <button class="cv-btn gold" id="cvEnter">${doneN || S.xp ? 'Continuar a jornada' : 'Entrar na Academia'}</button>
          <button class="cv-btn" id="cvExtras">Explorar os extras ↓</button>
        </div>
        <div class="cv-stats"><span><b>12</b> lições</span><span><b>${QUIZ.length}</b> perguntas</span><span><b>8</b> formatos</span><span><b>${COMMANDERS.length}</b> comandantes</span>${S.xp?`<span>Seu XP: <b>${S.xp}</b></span>`:''}</div>
      </div>
      <div class="wheel">
        <svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="37" fill="none" stroke="#d6ad5f" stroke-opacity=".35" stroke-width=".4" stroke-dasharray="1 2"/><circle cx="50" cy="50" r="46" fill="none" stroke="#ece6f6" stroke-opacity=".12" stroke-width=".3"/>
          ${pos.map(([,x,y],i)=>{ const [,x2,y2] = pos[(i+2)%5]; return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#ece6f6" stroke-opacity=".12" stroke-width=".3"/>`; }).join('')}</svg>
        <div class="spark-core"></div>
        ${pos.map(([c,x,y])=>`<button class="corb" data-orb="${c}" style="left:${x}%;top:${y}%;background:radial-gradient(circle at 35% 30%,#fff,var(--${c.toLowerCase()}) 55%);color:var(--${c.toLowerCase()})" aria-label="${COLOR_INFO[c][0]}"><span>${c}</span></button>`).join('')}
        <p class="wheel-hint" id="wheelHint">${S.secret?'Segredo desbloqueado: modo foil ativo.':'As cinco cores guardam um segredo. Toque nelas na ordem da roda.'}</p>
      </div>
    </section>

    <section class="cv-sec" id="cvX">
      <h2>Extras para fãs</h2>
      <p>Descubra sua cor, conheça os planeswalkers, as cartas que viraram lenda e os momentos que marcaram mais de trinta anos de Magic.</p>
      <div class="xtiles">
        ${[['cor','Qual é a sua cor?','Sete perguntas para descobrir sua cor, sua guilda e um comandante para você.','✦'],
           ['pw','Hall dos Planeswalkers','Os heróis e vilões mais famosos do Multiverso.','◈'],
           ['icon','Cartas lendárias','As cartas que todo veterano reconhece de longe.','◆'],
           ['tl','Linha do tempo','De 1993 aos dias de hoje.','⌛'],
           ['facts','Curiosidades','Das antigas às mais recentes: Power Nine, Lista Reservada, crossovers.','?'],
           ['art','Galeria de artistas','Os ilustradores por trás das cartas mais famosas, com busca por qualquer artista.','✎'],
           ['map','Mapa do Multiverso','Dominaria, Ravnica, Zendikar e os outros mundos do Magic.','◎'],
           ['guess','Adivinhe a carta','Descubra a carta por um pedaço da ilustração.','◐'],
           ['frames','Evolução das molduras','A mesma carta impressa de 1993 até hoje.','▣'],
           ['sets','Coleções novas','O que acabou de sair e o que vem por aí, atualizado pela internet.','✧'],
           ['decks','Decks famosos','The Deck, Affinity, Caw-Blade, Eldrazi e os banidos recentes.','♜'],
           ['secret',S.secret?'Modo foil':'Segredo das cinco cores',S.secret?'Ligue ou desligue o brilho holográfico das cartas.':'Bloqueado. A dica está na roda de cores acima.',S.secret?'★':'🔒']
          ].map(([k,t,d,g])=>`<button class="xtile ${k==='secret'&&!S.secret?'locked':''}" data-x="${k}" aria-pressed="${cvPanel===k}"><b>${t}</b><span>${d}</span><span class="glyph" aria-hidden="true">${g}</span></button>`).join('')}
      </div>
      <div id="xPanel"></div>
    </section>
    <p style="text-align:center;margin-top:50px"><button class="cv-btn gold" id="cvEnter2">Entrar na Academia</button></p>
    <p style="text-align:center;color:#8e84a5;font-size:.82rem;margin-top:18px">Criado por Leonardo Rios. Magic: The Gathering © Wizards of the Coast. Projeto educativo, sem fins comerciais.</p>
  </div>`;
  const enter = () => { el.hidden = true; document.body.style.overflow = ''; stopSky(); sfx('win'); RENDER[currentView] && RENDER[currentView](); if (!S.tourAsked) { S.tourAsked = true; S.seenVer = CUR_VER; save(); setTimeout(startTour, 400); } else maybeShowUpdates(); };
  $('#cvEnter').onclick = enter; $('#cvEnter2').onclick = enter;
  $('#cvExtras').onclick = () => $('#cvX').scrollIntoView({behavior:'smooth'});
  $$('[data-x]', el).forEach(b => b.onclick = () => {
    const k = b.dataset.x;
    if (k === 'sets' || k === 'decks') { el.hidden = true; document.body.style.overflow = ''; stopSky(); if (k === 'sets') { fmtTab = 'colecoes'; show('formatos'); } else { deckTab = 'famosos'; show('decks'); } return; }
    if (k === 'secret') { if (!S.secret) { toast('Toque nas cinco cores na ordem da roda: branco, azul, preto, vermelho, verde.'); sfx('no'); return; } S.foil = !S.foil; save(); applyFoil(); toast(S.foil?'Modo foil ligado':'Modo foil desligado'); return; }
    cvPanel = cvPanel === k ? null : k; $$('[data-x]', el).forEach(x => x.setAttribute('aria-pressed', x.dataset.x===cvPanel)); drawX(); if (cvPanel) setTimeout(()=>$('#xPanel').scrollIntoView({behavior:'smooth',block:'start'}), 30);
  });
  $$('[data-orb]', el).forEach(b => b.onclick = () => orbTap(b));
  el.addEventListener('click', e => { const mc = e.target.closest('.mcard[data-card]'); if (mc) openCard(mc.dataset.card); });
  document.body.style.overflow = 'hidden';
  startSky();
}
function orbTap(b){
  const c = b.dataset.orb; sfx('tap');
  seq.push(c); const want = PIE.slice(0, seq.length).join('');
  if (seq.join('') !== want) { seq = c==='W' ? ['W'] : []; $$('.corb').forEach(o=>o.classList.remove('lit')); if (c==='W') b.classList.add('lit'); return; }
  b.classList.add('lit');
  if (seq.length === 5) {
    seq = []; setTimeout(()=>$$('.corb').forEach(o=>o.classList.remove('lit')), 1400);
    if (!S.secret) { S.secret = true; S.foil = true; save(); applyFoil(); addXP(50); checkAch(); }
    sfx('win'); toast('Sua centelha brilhou! Modo foil desbloqueado: todas as cartas agora são holográficas.');
    $('#wheelHint').textContent = 'Segredo desbloqueado: modo foil ativo.';
    const t = $('[data-x="secret"]'); if (t) { t.classList.remove('locked'); t.querySelector('b').textContent = 'Modo foil'; t.querySelector('span').textContent = 'Ligue ou desligue o brilho holográfico das cartas.'; t.querySelector('.glyph').textContent = '★'; }
  }
}
function applyFoil(){ document.body.classList.toggle('foil', !!(S.secret && S.foil)); }
function drawX(){
  const p = $('#xPanel'); if (!p) return;
  if (!cvPanel) { p.innerHTML = ''; return; }
  if (cvPanel === 'pw') p.innerHTML = `<div class="xpanel"><h3>Hall dos Planeswalkers</h3><p class="muted">Planeswalkers são magos raros com uma "centelha" que permite viajar entre os planos do Multiverso. Você, jogador, também é um deles.</p>
    <div class="pw-grid">${PWS.map(([card,n,d])=>`<div class="pw">${cardHTML(card)}<div style="min-width:0"><b>${n}</b><p>${d}</p></div></div>`).join('')}</div></div>`;
  if (cvPanel === 'icon') p.innerHTML = `<div class="xpanel"><h3>Cartas lendárias</h3><p class="muted">Toque numa carta para ver em tamanho maior.</p>
    <div class="icon-grid">${ICONS.map(([n,d])=>`<div class="icon-c">${cardHTML(n)}<small>${d}</small></div>`).join('')}</div></div>`;
  if (cvPanel === 'tl') p.innerHTML = `<div class="xpanel"><h3>Linha do tempo</h3><ul class="tl">${TIMELINE.map(([y,t,d])=>`<li><span class="yr">${y}</span><div><b>${t}</b><p>${d}</p></div></li>`).join('')}</ul></div>`;
  if (cvPanel === 'facts') p.innerHTML = `<div class="xpanel"><h3>Curiosidades</h3><div class="facts">${FACTS.map(([t,d])=>`<div class="fact"><b>${t}</b><p>${d}</p></div>`).join('')}</div></div>`;
  if (cvPanel === 'cor') drawColorQuiz();
  if (cvPanel === 'map') drawPlanes(p);
  if (cvPanel === 'guess') { p.innerHTML = `<div class="xpanel"><h3>Adivinhe a carta</h3><p class="muted">Um pedaço da ilustração de uma carta famosa. Qual é?</p><div id="gsOut" style="margin-top:10px"></div></div>`; newGuess($('#gsOut')); }
  if (cvPanel === 'frames') { p.innerHTML = `<div class="xpanel"><h3>Evolução das molduras</h3><p class="muted">Escolha uma carta para ver suas impressões, uma de cada estilo de moldura.</p><div class="row-h" style="margin-top:10px">${FRAME_CARDS.map(n=>`<button class="cv-btn" data-fr="${esc(n)}" style="min-height:40px;padding:6px 14px">${esc(n)}</button>`).join('')}</div><div id="frOut" style="margin-top:12px"></div></div>`; $$('[data-fr]', p).forEach(b => b.onclick = () => framesLoad(b.dataset.fr, $('#frOut'))); }
  if (cvPanel === 'art') {
    p.innerHTML = `<div class="xpanel"><h3>Galeria de artistas</h3><p class="muted">Toque num artista para ver suas ilustrações mais usadas, ou procure qualquer nome.</p>
      <div class="facts">${ARTISTS.map((a,i)=>`<button class="fact" data-art="${i}" style="text-align:left;cursor:pointer;color:inherit;font:inherit"><b>${a[0]}</b><p>${a[2]}</p></button>`).join('')}</div>
      <div class="row-h" style="margin-top:12px"><input type="text" id="artQ" placeholder="Nome do artista em inglês, ex.: Rebecca Guay" style="flex:1;min-width:200px;background:#1c1924;color:#ece6f6;border-color:#3a3150"><button class="cv-btn" id="artGo" style="min-height:42px;padding:8px 16px">Buscar</button></div>
      <div id="artOut" style="margin-top:12px"></div></div>`;
    $$('[data-art]', p).forEach(b => b.onclick = () => { $('#artQ').value = ARTISTS[+b.dataset.art][0]; artistSearch(ARTISTS[+b.dataset.art][0], $('#artOut')); });
    $('#artGo').onclick = () => { const q = $('#artQ').value.trim(); if (q) artistSearch(q, $('#artOut')); };
  }
}
function drawColorQuiz(){
  const p = $('#xPanel');
  if (cq.done) {
    const ranked = Object.entries(cq.sc).sort((a,b)=>b[1]-a[1]);
    const [c1,s1] = ranked[0], [c2,s2] = ranked[1];
    const pair = s2 >= 2 ? (GUILD_OF[c1+c2] ? c1+c2 : c2+c1) : null;
    const info = COLOR_INFO[c1];
    const cmd = pair ? (COMMANDERS.find(c=>c.id===pair)||COMMANDERS.find(c=>c.id===c1)) : COMMANDERS.find(c=>c.id===c1);
    S.myColor = pair || c1; save();
    p.innerHTML = `<div class="xpanel"><h3>Sua cor: ${info[0]}${pair?` + ${COLOR_INFO[c2][0]}`:''}</h3>
      <div class="cres"><div class="big-orb" style="background:radial-gradient(circle at 35% 30%,#fff,var(--${c1.toLowerCase()}) 60%);color:var(--${c1.toLowerCase()})">${c1}</div>
      <div class="stack-v" style="gap:6px"><p>${info[1]}</p>${pair?`<p>Sua segunda cor é <b>${COLOR_INFO[c2][0].toLowerCase()}</b>. Juntas, formam a guilda <b>${GUILD_OF[pair]}</b> de Ravnica.</p>`:''}
        <p class="muted">Pontos: ${ranked.map(([c,v])=>`${manaSym(c)} ${v}`).join(' ')}</p></div></div>
      <div class="pw-grid">
        <div class="pw">${cardHTML(info[2])}<div><b>Planeswalker da sua cor</b><p>${esc(PWS.find(x=>x[0]===info[2])[1])}</p></div></div>
        ${cmd?`<div class="pw">${cardHTML(cmd.n,{showPt:false})}<div><b>Um comandante para você</b><p>${esc(cmd.n)}: ${cmd.plan}</p></div></div>`:''}
      </div>
      <div class="cv-actions"><button class="cv-btn gold" id="cqBuild">Montar um deck com essas cores</button><button class="cv-btn" id="cqAgain">Refazer o teste</button></div></div>`;
    $('#cqAgain').onclick = () => { cq = {i:0, sc:{W:0,U:0,B:0,R:0,G:0}, done:false, order:null}; drawColorQuiz(); };
    $('#cqBuild').onclick = () => { Object.assign(wz, {fmt:'commander', colors:[...(pair||c1).toLowerCase()].sort((a,b)=>'wubrg'.indexOf(a)-'wubrg'.indexOf(b)), cmd: cmd && [...cmd.id].every(x=>(pair||c1).includes(x)) ? cmd.n : null, style: cmd ? wzStyleFor(cmd.arch) : null}); $('#cover').hidden = true; document.body.style.overflow=''; stopSky(); fmtTab = 'montar'; show('formatos'); };
    return;
  }
  const [q, opts] = COLOR_Q[cq.i]; if (!cq.order) cq.order = shuffleIdx(5);
  p.innerHTML = `<div class="xpanel"><h3>Qual é a sua cor?</h3><div class="cq">
    <div class="qprog" style="color:#a99ec0"><span>Pergunta ${cq.i+1} de ${COLOR_Q.length}</span></div>
    <div class="bar"><i style="width:${cq.i/COLOR_Q.length*100}%"></i></div>
    <div class="ask" style="font-weight:800;font-size:1.1rem">${q}</div>
    ${cq.order.map((oi,k)=>`<button class="opt" data-cq="${oi}"><span class="k">${'ABCDE'[k]}</span><span>${opts[oi]}</span></button>`).join('')}</div></div>`;
  $$('[data-cq]', p).forEach(b => b.onclick = () => { cq.sc[PIE[+b.dataset.cq]]++; sfx('tap'); cq.order = null; if (++cq.i >= COLOR_Q.length) { cq.done = true; sfx('win'); } drawColorQuiz(); });
}
/* céu das Eternidades Cegas */
let skyRAF = null;
function startSky(){
  const cv = $('#sky'); if (!cv || S.lite) return; const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = ['#f3ebc4','#9cc5e6','#b3a8a2','#ee8a6a','#86c59a','#d6ad5f','#ffffff'];
  let W, H, stars = [];
  const size = () => { const d = Math.min(2, devicePixelRatio||1); W = cv.width = innerWidth*d; H = cv.height = innerHeight*d; stars = Array.from({length: Math.round(innerWidth*innerHeight/5000)}, () => ({x:Math.random()*W, y:Math.random()*H, r:(Math.random()*1.4+.3)*d, v:(Math.random()*.25+.05)*d, c:cols[Math.random()*cols.length|0], p:Math.random()*6.28})); };
  size(); addEventListener('resize', size);
  const neb = [['rgba(110,70,180,.20)',.25,.3],['rgba(214,173,95,.12)',.75,.25],['rgba(60,130,180,.14)',.6,.8]];
  let t = 0;
  const frame = () => {
    t += .01; ctx.clearRect(0,0,W,H);
    neb.forEach(([c,x,y],i) => { const g = ctx.createRadialGradient(W*(x+.04*Math.sin(t+i)),H*y,0,W*x,H*y,Math.max(W,H)*.55); g.addColorStop(0,c); g.addColorStop(1,'transparent'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H); });
    stars.forEach(s => { s.y -= s.v; if (s.y < -4) { s.y = H + 4; s.x = Math.random()*W; } ctx.globalAlpha = .45 + .55*Math.abs(Math.sin(t*2 + s.p)); ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.283); ctx.fill(); });
    ctx.globalAlpha = 1;
    if (!reduce) skyRAF = requestAnimationFrame(frame);
  };
  frame();
}
function stopSky(){ if (skyRAF) cancelAnimationFrame(skyRAF); skyRAF = null; }
function openCover(){ const el = $('#cover'); if (!el) return buildCover(); el.hidden = false; document.body.style.overflow = 'hidden'; el.scrollTop = 0; startSky(); }
