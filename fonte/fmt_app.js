/* ================= FORMATOS ================= */
const idSyms = id => [...id].map(manaSym).join('');
const scry = q => `https://scryfall.com/search?q=${encodeURIComponent(q.replace(/\s+/g,' ').trim())}`;
const edh = n => `https://edhrec.com/commanders/${n.toLowerCase().replace(/[',]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
const stars = n => `<span class="mono" aria-label="${n} de 5" style="color:var(--accent);letter-spacing:2px">${'●'.repeat(n)}<span style="opacity:.25">${'●'.repeat(5-n)}</span></span>`;
const cost$ = n => `<span class="mono" style="color:var(--warn)">${'$'.repeat(n)}</span>`;
const ext = (href, txt) => `<a class="ext" href="${href}" target="_blank" rel="noopener">${txt} ↗</a>`;
let fmtTab = 'geral';
function seen(k){ if (!S.seen[k]) { S.seen[k] = true; save(); checkAch(); } }

RENDER.formatos = function(){
  $('#v-formatos').innerHTML = `
   <div class="view-head"><h1>Formatos de jogo</h1><p>Cada formato muda as regras de montagem do deck. Escolha um, siga o passo a passo e monte seu deck com ajuda. No fim, aprenda a se portar numa mesa com jogadores experientes.</p></div>
   <div class="seg" role="tablist">${[['geral','Visão geral'],['commander','Commander'],['padrao','Padrão'],['outros','Pioneer, Modern e +'],['arena','MTG Arena'],['colecoes','Coleções novas'],['montar','Montar meu deck'],['mesa','Na mesa']].map(([k,l])=>`<button role="tab" data-ft="${k}" aria-selected="${fmtTab===k}">${l}</button>`).join('')}</div>
   <div id="fmtBody"></div>`;
  $$('[data-ft]').forEach(b => b.onclick = () => { fmtTab = b.dataset.ft; RENDER.formatos(); });
  ({geral:fGeral, commander:fCommander, padrao:fPadrao, outros:fOutros, arena:fArena, colecoes:fColecoes, montar:fMontar, mesa:fMesa})[fmtTab]();
  seen('f_'+fmtTab);
};
function goFmt(t){ fmtTab = t; show('formatos'); }

/* ---------- visão geral ---------- */
let rec = {where:null, who:null, money:null, taste:null};
function fGeral(){
  $('#fmtBody').innerHTML = `
  <div class="grid g2" style="align-items:start">
    <div class="panel stack-v"><h3>Construído e Limitado: a primeira divisão</h3>
      <p><b>Construído:</b> você monta o deck em casa com as cartas que tem (Commander, Padrão, Pioneer, Modern, Pauper…). Leva o mesmo deck para várias partidas.</p>
      <p><b>Limitado:</b> você monta o deck na hora, com pacotes abertos no evento (Draft e Selado). Ninguém leva vantagem por ter uma coleção grande.</p>
      <div class="tip">Cada formato tem uma <b>lista de cartas banidas</b>. Antes de comprar cartas ou ir a um torneio, confira em ${ext('https://magic.wizards.com/en/banned-restricted-list','Wizards: lista de banidas')} ou na página da carta no Scryfall (seção "Legalities").</div>
    </div>
    <div class="panel stack-v" id="recBox"></div>
  </div>
  <div class="sub-h"><h2>Comparativo</h2><p>Bolinhas indicam o quanto o formato é amigável para quem está começando. Cifrões indicam o custo médio de um deck competitivo em papel.</p></div>
  <div class="panel tbl-wrap"><table><thead><tr><th>Formato</th><th>Deck</th><th>Cópias</th><th>Vida</th><th>Cartas permitidas</th><th>Onde</th><th>Custo</th><th>Para novato</th></tr></thead><tbody>
   ${FORMATS.map(f=>`<tr><td><b>${f.n}</b><br><span class="muted" style="font-size:.85rem">${f.tag}</span></td><td>${f.deck}</td><td>${f.cop}</td><td class="n">${f.life}</td><td>${f.pool}</td><td>${f.where}</td><td>${cost$(f.cost)}</td><td>${stars(f.novato)}</td></tr>`).join('')}
  </tbody></table></div>
  <div class="sub-h"><h2>Por onde começar</h2></div>
  <ol class="how">
    <li><div><h3>Aprenda as regras com 2 jogadores</h3><p>Partidas 1×1 são mais fáceis de acompanhar. Faça as Lições e jogue algumas partidas no ${'<button class="cref" data-gofmt="arena">MTG Arena</button>'} contra o computador.</p></div></li>
    <li><div><h3>Jogue com decks prontos</h3><p>Decks iniciais do Arena, "Starter Kits" e decks pré-construídos de Commander já vêm equilibrados. Você aprende o jogo sem se preocupar com a montagem.</p></div></li>
    <li><div><h3>Escolha o formato do seu grupo</h3><p>Se seus amigos ou a loja da sua cidade jogam Commander, comece por ele. Se você vai jogar mais no celular ou PC, comece pelo Padrão no Arena.</p></div></li>
    <li><div><h3>Monte (ou melhore) seu primeiro deck</h3><p>Use o ${'<button class="cref" data-gofmt="montar">montador guiado</button>'} e o Analisador da aba Decks.</p></div></li>
    <li><div><h3>Vá à loja</h3><p>Um pré-lançamento ou uma noite de Commander é o melhor primeiro evento. Antes, leia a seção ${'<button class="cref" data-gofmt="mesa">Na mesa</button>'}.</p></div></li>
  </ol>`;
  bindGofmt(); drawRec();
}
function bindGofmt(){ $$('[data-gofmt]').forEach(b => b.onclick = () => { fmtTab = b.dataset.gofmt; RENDER.formatos(); window.scrollTo({top:0}); }); }
function drawRec(){
  const Q = [
    ['where','Onde você quer jogar?',[['app','No celular ou PC'],['amigos','Em casa com amigos'],['loja','Na loja, em eventos']]],
    ['who','Com quantas pessoas?',[['1','1 contra 1'],['grupo','Em grupo (3 ou 4)']]],
    ['money','Quanto quer gastar no começo?',[['0','Nada'],['pouco','Pouco'],['medio','Um valor médio']]],
    ['taste','O que mais te atrai?',[['novo','Cartas novas e decks que mudam'],['criar','Criar decks únicos e criativos'],['classico','Cartas clássicas e poderosas']]]
  ];
  const box = $('#recBox');
  box.innerHTML = `<h3>Qual formato é para mim?</h3>${Q.map(([k,t,os])=>`<div class="stack-v" style="gap:6px"><span class="eyebrow">${t}</span><div class="row-h" style="gap:6px">${os.map(([v,l])=>`<button class="chip" data-rk="${k}" data-rv="${v}" aria-pressed="${rec[k]===v}">${l}</button>`).join('')}</div></div>`).join('')}<div id="recOut"></div>`;
  $$('[data-rk]', box).forEach(b => b.onclick = () => { rec[b.dataset.rk] = b.dataset.rv; drawRec(); });
  if (Object.values(rec).some(v=>!v)) { $('#recOut').innerHTML = '<p class="muted">Responda as quatro perguntas.</p>'; return; }
  const sc = {commander:0,padrao:0,pauper:0,brawl:0,limitado:0,modern:0,pioneer:0};
  if (rec.where==='app') { sc.padrao+=3; sc.brawl+=3; sc.limitado+=1; } if (rec.where==='amigos') { sc.commander+=3; sc.pauper+=1; } if (rec.where==='loja') { sc.limitado+=2; sc.commander+=2; sc.padrao+=2; sc.modern+=1; sc.pioneer+=1; }
  if (rec.who==='grupo') sc.commander+=4; else { sc.padrao+=1; sc.brawl+=1; sc.pauper+=1; sc.pioneer+=1; sc.modern+=1; }
  if (rec.money==='0') { sc.brawl+=2; sc.padrao+=1; sc.commander-=1; } if (rec.money==='pouco') { sc.pauper+=2; sc.commander+=1; sc.limitado+=1; } if (rec.money==='medio') { sc.commander+=1; sc.pioneer+=1; sc.modern+=1; }
  if (rec.taste==='novo') { sc.padrao+=2; sc.limitado+=2; } if (rec.taste==='criar') { sc.commander+=3; sc.brawl+=2; } if (rec.taste==='classico') { sc.modern+=3; sc.pioneer+=1; sc.commander+=1; }
  const top = Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>FORMATS.find(f=>f.k===k));
  const target = {commander:'commander',padrao:'padrao',brawl:'arena'}[top[0].k] || 'outros';
  $('#recOut').innerHTML = `<div class="tip"><b>Sugestão: ${top[0].n}.</b> ${top[0].tag}. Segunda opção: ${top[1].n}.<div style="margin-top:8px"><button class="btn small primary" data-gofmt="${target}">Ver o passo a passo</button></div></div>`;
  bindGofmt();
}

/* ---------- commander ---------- */
let cmdFilter = 'Todas';
const PLAN = [['lands','Terrenos',36,'34–38. Mais se o deck for caro.'],['ramp','Aceleração de mana (ramp)',10,'Sol Ring, Arcane Signet, buscadores de terreno.'],['draw','Compra de cards',10,'Para não ficar sem cartas em jogos longos.'],['rem','Remoção pontual',8,'Destrói ou exila uma ameaça.'],['wipe','Remoção em massa',3,'Para quando a mesa sair do controle.'],['prot','Proteção',3,'Para seu comandante sobreviver.'],['theme','Tema e sinergia',25,'As cartas que fazem o plano do comandante.'],['win','Finalizadores',4,'Cartas que terminam o jogo.']];
function fCommander(){
  if (!S.plan) S.plan = Object.fromEntries(PLAN.map(p=>[p[0],p[2]]));
  const cols = ['Todas','W','U','B','R','G','Multicolor'];
  $('#fmtBody').innerHTML = `
  <div class="tiles5">
    <div class="stat"><div class="k">Cards</div><div class="v">100</div></div>
    <div class="stat"><div class="k">Cópias</div><div class="v">1</div></div>
    <div class="stat"><div class="k">Vida inicial</div><div class="v">40</div></div>
    <div class="stat"><div class="k">Jogadores</div><div class="v">3–4</div></div>
    <div class="stat"><div class="k">Dano de comandante</div><div class="v">21</div></div>
  </div>
  <p class="muted" style="max-width:75ch;margin:10px 0 0">Commander (também chamado de EDH) é o formato mais jogado em lojas e entre amigos. Você escolhe uma criatura lendária para ser o líder do deck, e ela fica sempre disponível numa zona especial.</p>

  <div class="sub-h"><h2>Passo a passo para o seu primeiro Commander</h2></div>
  <ol class="how">
    <li><div><h3>Entenda as regras especiais</h3><ul>
      <li><b>Comandante:</b> uma criatura lendária (ou um card que diga que pode ser comandante). Começa na <b>zona de comando</b>, fora do deck, e pode ser conjurado de lá como se estivesse na sua mão.</li>
      <li><b>Imposto de comandante:</b> cada vez que você o conjura de novo da zona de comando, ele custa {2} a mais por vez anterior. Exemplo: Krenko custa ${mana('{2}{R}{R}')}; na terceira vez, custa ${mana('{6}{R}{R}')}.</li>
      <li><b>Se ele morrer ou for exilado</b>, você pode devolvê-lo à zona de comando em vez de deixá-lo no cemitério ou no exílio. O mesmo vale se ele fosse para a mão ou para o grimório.</li>
      <li><b>Identidade de cor:</b> todas as cartas do deck devem usar só as cores do comandante, contando o custo e os símbolos de mana do texto. Com ${cr('Lathril, Blade of the Elves','Lathril')} ${idSyms('BG')}, o deck só pode ter cartas pretas, verdes ou incolores.</li>
      <li><b>Dano de comandante:</b> quem sofrer 21 de dano de combate de um mesmo comandante perde, mesmo com vida sobrando.</li>
      <li><b>Singleton:</b> 1 cópia de cada carta, exceto terrenos básicos.</li>
      <li><b>Multijogador:</b> normalmente todos contra todos, no sentido horário. Quem começa não compra no primeiro turno.</li>
    </ul></div></li>
    <li><div><h3>Escolha o comandante</h3>
      <p>Faça três perguntas: <b>1.</b> Que cores me atraem? (Faça o teste "Qual é a sua cor?" na capa.) <b>2.</b> Como quero vencer: atacando, com mágicas, crescendo devagar? <b>3.</b> Eu entendo o que o comandante faz lendo o card uma vez? Se sim, é um bom primeiro comandante.</p>
      <p>Comandantes de <b>uma ou duas cores</b> são mais fáceis: a base de terrenos é simples e barata. Veja os exemplos abaixo.</p></div></li>
    <li><div><h3>Comece com um deck pré-construído</h3>
      <p>Todo ano saem decks prontos de Commander ("precons"), com 100 cartas, comandante e terrenos. É o caminho mais seguro: o deck funciona de primeira e você aprende jogando.</p>
      <p><b>Para melhorar um precon:</b> jogue 5 partidas e anote as cartas que ficaram paradas na mão. Troque de 5 a 10 por vez, sempre por cartas que reforcem o plano do comandante.</p></div></li>
    <li><div><h3>Monte a estrutura de 99 cartas</h3><p>Todo deck de Commander precisa destas categorias. Use o planejador para conferir as quantidades:</p><div id="planner"></div></div></li>
    <li><div><h3>Preencha com as cartas certas</h3>
      <p>Use o ${ext('https://edhrec.com','EDHREC')} para ver as cartas mais usadas com o seu comandante, e o ${ext('https://scryfall.com/advanced','Scryfall')} para buscar por cor e efeito. Monte a lista no ${ext('https://moxfield.com','Moxfield')} ou no ${ext('https://archidekt.com','Archidekt')}, sites gratuitos que mostram curva e preço.</p>
      <p>O <button class="cref" data-gofmt="montar">montador guiado</button> já gera um esqueleto com as cartas básicas de cada cor.</p></div></li>
    <li><div><h3>Descubra o bracket do seu deck</h3>
      <p>Os <b>brackets</b> (níveis de 1 a 5) servem para a conversa antes da partida: todos dizem o nível do deck para o jogo ser equilibrado. Um precon sem alterações costuma ficar no 2.</p>
      <div class="brk">${BRACKETS.map(b=>`<div class="brk-i"><span class="brk-n">${b[0]}</span><div><b>${b[1]}</b><p>${b[2]}</p><p class="muted">${b[3]}</p></div></div>`).join('')}</div>
      <p class="muted" style="font-size:.88rem"><b>Game Changers</b> são cartas fortes demais para jogos casuais, listadas oficialmente pela Wizards. A lista muda: confira em ${ext('https://magic.wizards.com/en/formats/commander','magic.wizards.com/formats/commander')}.</p></div></li>
    <li><div><h3>Teste antes de levar à mesa</h3>
      <p>Cole a lista no Analisador (aba Decks) para conferir os 100 cards e a curva. Teste mãos iniciais: em Commander, o primeiro mulligan é grátis em muitos grupos (combine antes). Jogue sozinho 5 turnos ("goldfish") para ver se o deck faz alguma coisa até o turno 4.</p></div></li>
  </ol>

  <div class="sub-h"><h2>Comandantes de exemplo</h2><p>Escolhidos para cobrir todas as cores e estilos. Toque na carta para ler, ou monte um deck com ela.</p></div>
  <div class="filters">${cols.map(c=>`<button class="chip" data-cf="${c}" aria-pressed="${cmdFilter===c}">${c.length===1?manaSym(c):c}</button>`).join('')}</div>
  <div class="cmd-grid">${COMMANDERS.filter(c=>cmdFilter==='Todas'||(cmdFilter==='Multicolor'?c.id.length>1:c.id.includes(cmdFilter))).map(c=>`
    <div class="cmd">${cardHTML(c.n,{showPt:false})}
      <div class="stack-v" style="gap:6px;min-width:0"><div class="row-h" style="gap:6px">${idSyms(c.id)}<span class="pill ${c.lv==='Fácil'?'good':c.lv==='Médio'?'warn':'bad'}">${c.lv}</span></div>
        <h4>${esc(c.n)}</h4><span class="eyebrow" style="letter-spacing:.08em">${c.arch}</span>
        <p><b>Plano:</b> ${c.plan}</p><p><b>Por que começar com ele:</b> ${c.why}</p><p class="muted"><b>Cuidado:</b> ${fmt(c.watch)}</p>
        <div class="acts"><button class="btn small primary" data-usecmd="${esc(c.n)}">Montar com ele</button>${ext(edh(c.n),'EDHREC')}</div></div></div>`).join('')}</div>

  <div class="sub-h"><h2>Cartas básicas de cada cor</h2><p>Aparecem em milhares de decks de Commander. Confira se continuam fora da lista de banidas antes de usar.</p></div>
  <div class="panel tbl-wrap"><table><tbody>${CMD_STAPLES.map(s=>`<tr><td style="white-space:nowrap">${manaSym(s[0])} <b>${s[1]}</b></td><td>${s[2].split(', ').map(n=>cr(n)).join(', ')}</td></tr>`).join('')}</tbody></table></div>

  <div class="sub-h"><h2>Dicas para mesas de 4 jogadores</h2></div>
  <div class="dodont">
    <div class="panel ok"><h3>Faça</h3><ul>
      <li>Ataque quem está ganhando, não quem está mais fraco.</li><li>Guarde remoção para a ameaça que pode vencer o jogo.</li>
      <li>Fale sobre a mesa: "se ninguém tirar aquela criatura, ele ganha em dois turnos".</li><li>Faça acordos simples ("não ataco você se você tirar o dragão dele") e cumpra.</li>
      <li>Jogue terrenos e aceleração de mana cedo; o jogo é mais longo que 1×1.</li></ul></div>
    <div class="panel no"><h3>Evite</h3><ul>
      <li>Mostrar ameaça grande cedo demais: você vira o alvo de todos.</li><li>Demorar muito nos seus turnos; são três pessoas esperando.</li>
      <li>Destruir todos os terrenos da mesa sem combinar antes.</li><li>Ficar irritado com quem atacou você: é parte do jogo.</li></ul></div>
  </div>`;
  $$('[data-cf]').forEach(b => b.onclick = () => { cmdFilter = b.dataset.cf; fCommander(); $('.cmd-grid').scrollIntoView({block:'start'}); });
  $$('[data-usecmd]').forEach(b => b.onclick = () => { const c = COMMANDERS.find(x=>x.n===b.dataset.usecmd); Object.assign(wz, {fmt:'commander', colors:[...c.id.toLowerCase()], cmd:c.n, style:wzStyleFor(c.arch)}); fmtTab='montar'; RENDER.formatos(); setTimeout(()=>{ const r=$('#wzOut'); r && r.scrollIntoView({behavior:'smooth'}); }, 60); });
  bindGofmt(); drawPlanner();
}
function drawPlanner(){
  const box = $('#planner'); if (!box) return;
  const tot = PLAN.reduce((a,p)=>a+(+S.plan[p[0]]||0),0);
  box.innerHTML = PLAN.map(([k,l,t,h])=>{ const v = +S.plan[k]||0; const max = Math.max(40,t*1.6);
    return `<div class="plan-row"><div><b>${l}</b><small>${h}</small></div><input type="number" min="0" max="99" data-pl="${k}" value="${v}" aria-label="${l}"><div class="track"><i style="width:${Math.min(100,v/max*100)}%;background:${Math.abs(v-t)<=Math.max(1,t*.2)?'var(--good)':'var(--warn)'}"></i><b style="left:${t/max*100}%"></b></div></div>`; }).join('')
    + `<div class="plan-total"><span>Total: <b class="mono">${tot}</b> de 99 (+ comandante = ${tot+1})</span><span class="pill ${tot===99?'good':'bad'}">${tot===99?'Fechou 100':tot<99?`Faltam ${99-tot}`:`Sobram ${tot-99}`}</span><button class="btn small" id="plReset">Valores sugeridos</button></div>
    <p class="muted" style="font-size:.85rem">A marca vertical indica o valor sugerido. Uma carta pode contar em duas categorias (uma criatura que compra cards, por exemplo).</p>`;
  $$('[data-pl]', box).forEach(i => i.onchange = () => { S.plan[i.dataset.pl] = Math.max(0, +i.value||0); save(); drawPlanner(); });
  $('#plReset').onclick = () => { S.plan = Object.fromEntries(PLAN.map(p=>[p[0],p[2]])); save(); drawPlanner(); };
}

/* ---------- padrão ---------- */
function fPadrao(){
  $('#fmtBody').innerHTML = `
  <div class="tiles5">
    <div class="stat"><div class="k">Deck</div><div class="v">60+</div></div>
    <div class="stat"><div class="k">Sideboard</div><div class="v">até 15</div></div>
    <div class="stat"><div class="k">Cópias</div><div class="v">4</div></div>
    <div class="stat"><div class="k">Vida</div><div class="v">20</div></div>
    <div class="stat"><div class="k">Coleções</div><div class="v">~3 anos</div></div>
  </div>
  <div class="grid g2" style="margin-top:14px;align-items:start">
    <div class="panel stack-v"><h3>O que é o Padrão</h3>
      <p>O formato oficial das coleções recentes. É o principal formato do MTG Arena e de muitos torneios em lojas. Como só usa cartas novas, todo mundo começa em pé de igualdade e o "metagame" (os decks mais jogados) muda a cada coleção.</p></div>
    <div class="panel stack-v"><h3>Como funciona a rotação</h3>
      <p>O Padrão usa as coleções de aproximadamente os últimos três anos. Quando chega a época da rotação, as coleções mais antigas saem de uma vez e suas cartas deixam de ser válidas no formato. Elas continuam valendo em Pioneer, Modern, Commander e outros.</p>
      <div class="tip"><b>Situação em outubro de 2026:</b> a próxima rotação está prevista para <b>fevereiro de 2027</b>. Saem Wilds of Eldraine, The Lost Caverns of Ixalan, Murders at Karlov Manor, Outlaws of Thunder Junction, Bloomburrow e Duskmourn. A coleção Foundations fica até pelo menos 2029. Confira sempre em ${ext('https://magic.wizards.com/en/formats/standard','magic.wizards.com/formats/standard')}.</div></div>
  </div>
  <div class="sub-h"><h2>Passo a passo para montar um deck de Padrão</h2></div>
  <ol class="how">
    <li><div><h3>Comece pelo MTG Arena</h3><p>É gratuito e só tem cartas válidas. Você testa vários decks antes de gastar dinheiro com cartas físicas. Veja a seção <button class="cref" data-gofmt="arena">MTG Arena</button>.</p></div></li>
    <li><div><h3>Escolha um arquétipo</h3><p><b>Aggro</b> (rápido, com criaturas baratas) é o mais fácil de pilotar. <b>Midrange</b> é equilibrado. <b>Controle</b> exige mais experiência. Veja a tabela de arquétipos na aba Decks → Guia de construção.</p></div></li>
    <li><div><h3>Copie uma lista vencedora ("netdeck")</h3><p>Não é vergonha: até os profissionais fazem isso. Sites como ${ext('https://www.mtggoldfish.com/metagame/standard','MTGGoldfish')} e ${ext('https://mtga.untapped.gg/meta','Untapped')} mostram os decks mais jogados. No Arena, copie a lista e use <b>Importar</b>.</p></div></li>
    <li><div><h3>Ajuste ao seu orçamento</h3><p>Se faltam cartas raras, troque por versões mais baratas com a mesma função (uma remoção por outra remoção). No Arena, gaste curingas primeiro nas cartas que aparecem em 4 cópias.</p></div></li>
    <li><div><h3>Monte o sideboard</h3><p>Em partidas Melhor de 3, entre um jogo e outro você pode trocar cards do deck pelos 15 do sideboard. Separe respostas para os decks mais comuns: remoção extra, cartas contra voadores, contra cemitério, contra artefatos e encantamentos.</p></div></li>
    <li><div><h3>Teste e anote</h3><p>Jogue 10 partidas, anote vitórias e derrotas e o que travou. Use o Analisador e a Mão inicial da aba Decks.</p></div></li>
    <li><div><h3>Antes de comprar cartas físicas, olhe a rotação</h3><p>Cartas que saem do Padrão em poucos meses perdem valor de jogo nesse formato. Prefira cartas de coleções recentes.</p></div></li>
  </ol>
  <div class="sub-h"><h2>Esqueletos de 60 cards</h2><p>Quantidades de partida. Ajuste conforme o deck.</p></div>
  <div class="panel tbl-wrap"><table><thead><tr><th>Categoria</th><th>Aggro</th><th>Midrange</th><th>Controle</th></tr></thead><tbody>
    <tr><td>Terrenos</td><td class="n">20–22</td><td class="n">24</td><td class="n">26</td></tr>
    <tr><td>Criaturas</td><td class="n">22–26</td><td class="n">16–20</td><td class="n">4–8</td></tr>
    <tr><td>Remoção</td><td class="n">4–8</td><td class="n">8–10</td><td class="n">8–12</td></tr>
    <tr><td>Compra de cards</td><td class="n">0–2</td><td class="n">2–4</td><td class="n">6–8</td></tr>
    <tr><td>Anulações / Cóleras</td><td class="n">0</td><td class="n">0–2</td><td class="n">6–10</td></tr>
    <tr><td>Custo médio das mágicas</td><td class="n">≈ 2</td><td class="n">≈ 3</td><td class="n">≈ 3,5</td></tr>
  </tbody></table></div>`;
  bindGofmt();
}

/* ---------- outros ---------- */
function fOutros(){
  const F = [
    ['Pioneer','Sem rotação, com cartas de Return to Ravnica (2012) em diante. Bom passo depois do Padrão: suas cartas antigas continuam valendo.','Comece com uma lista de Padrão rotacionada ou um deck "budget" de sites de metagame.',['Lightning Bolt'],'pioneer'],
    ['Modern','Cartas da 8ª Edição (2003) em diante, mais os produtos Modern Horizons. Jogos rápidos e decks poderosos.','Escolha um deck e fique com ele por muito tempo; os decks de Modern mudam pouco.',['Lightning Bolt','Tarmogoyf'],'modern'],
    ['Pauper','Só cartas impressas como comuns em alguma coleção. Competitivo de verdade, com decks muito baratos.','Excelente segundo formato: a lista inteira custa o preço de uma carta rara.',['Lightning Bolt','Counterspell'],'pauper'],
    ['Legacy e Vintage','Toda a história do Magic. No Vintage, cartas da "Power Nine" como Black Lotus são permitidas com 1 cópia (lista de restritas).','Muitas lojas aceitam proxies (cópias impressas) nesses formatos em eventos casuais. Pergunte antes.',['Black Lotus','Ancestral Recall'],'legacy'],
    ['Limitado: Draft e Selado','<b>Draft:</b> 8 jogadores abrem pacotes e passam de mão em mão, escolhendo uma carta por vez. <b>Selado:</b> cada um abre 6 pacotes e monta o deck. Em ambos: 40 cards, 17 terrenos.','O <b>pré-lançamento</b> (Selado na semana antes da coleção chegar) é o evento mais amistoso para novatos.',['Grizzly Bears'],null],
    ['Formatos só do Arena','<b>Histórico</b> e <b>Timeless</b> usam a coleção inteira do Arena (no Timeless, quase tudo é permitido). <b>Alchemy</b> tem cartas digitais e ajustes de balanceamento. <b>Brawl</b> é o Commander 1×1 do Arena.','Para quem quer usar cartas que saíram do Padrão sem precisar de um deck novo.',['Serra Angel'],null]
  ];
  $('#fmtBody').innerHTML = `
  <div class="stack-v" style="gap:14px">${F.map(([n,d,tip,cards,fm])=>`
    <div class="panel" style="display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start">
      <div class="row-h" style="gap:6px">${cards.map(c=>cardHTML(c,{cls:'mini',showPt:false})).join('')}</div>
      <div class="stack-v" style="min-width:0;gap:8px"><h3>${n}</h3><p>${d}</p><div class="tip">${tip}</div>
      ${fm?`<div class="row-h">${ext(scry(`f:${fm} order:edhrec`),'Cartas mais usadas no formato (Scryfall)')}${ext(`https://www.mtggoldfish.com/metagame/${fm}`,'Metagame atual')}</div>`:''}</div>
    </div>`).join('')}</div>
  <p class="muted" style="margin-top:14px;font-size:.9rem">Em celulares a coluna de cartas fica acima do texto. A Wizards revisa as listas de banidas periodicamente; consulte sempre antes de um evento.</p>`;
  if (innerWidth < 560) $$('#fmtBody .panel').forEach(p => p.style.gridTemplateColumns = '1fr');
}

/* ---------- arena ---------- */
const ARENA_PINS = [[6,9,'Aba Decks: lista todos os seus decks e o botão de criar um novo.'],[36,9,'Filtros: cor, custo, tipo, raridade e "só cartas que tenho".'],[8,55,'Sua coleção. Cartas apagadas são as que você ainda não tem: dá para criá-las com curingas.'],[82,30,'Lista do deck. Toque numa carta da coleção para adicionar e na lista para remover.'],[82,88,'Concluído/Salvar. Um aviso aparece se o deck não for válido no formato.']];
function fArena(){
  const ico = {
    win:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>',
    mac:'<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="12" rx="1"/><path d="M1 20h22"/></svg>',
    and:'<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    ios:'<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M10 5h4"/></svg>'};
  $('#fmtBody').innerHTML = `
  <div class="panel stack-v"><h3>O que é o MTG Arena</h3>
    <p>O Magic oficial digital da Wizards, <b>gratuito</b>. O jogo aplica todas as regras sozinho, então é o melhor lugar para praticar: você não precisa lembrar de gatilhos nem de etapas. Uma única conta funciona em todos os aparelhos e sua coleção acompanha você.</p></div>
  <div class="sub-h"><h2>Onde baixar</h2></div>
  <div class="plat">
    <div class="stat stack-v" style="gap:6px">${ico.win}<b>Windows</b><span class="muted">Instalador no site oficial, Steam ou Epic Games Store.</span></div>
    <div class="stat stack-v" style="gap:6px">${ico.mac}<b>Mac</b><span class="muted">Pela Epic Games Store.</span></div>
    <div class="stat stack-v" style="gap:6px">${ico.and}<b>Android</b><span class="muted">Google Play. Celulares e tablets.</span></div>
    <div class="stat stack-v" style="gap:6px">${ico.ios}<b>iPhone e iPad</b><span class="muted">App Store.</span></div>
  </div>
  <div class="tip" style="margin-top:12px">Na aba <b>Decks → Central do Arena</b> você copia seus decks no formato do Arena, importa listas exportadas do jogo, registra partidas e acompanha seu aproveitamento. <button class="btn small" id="goHub" style="margin-left:6px">Abrir a Central</button></div>
  <p style="margin-top:10px">${ext('https://magic.wizards.com/en/mtgarena','Site oficial do MTG Arena')} · ${ext('https://magic.wizards.com/en/mtgarena/getting-started','Guia oficial de primeiros passos')}</p>

  <div class="sub-h"><h2>Primeiros passos no Arena</h2></div>
  <ol class="how">
    <li><div><h3>Crie a conta e faça o tutorial</h3><p>O tutorial ensina o básico contra o oponente virtual Sparky. Mesmo que você pule, recebe as recompensas.</p></div></li>
    <li><div><h3>Use os decks iniciais</h3><p>Contas novas recebem decks prontos. Jogue com eles no modo <b>Jogar</b> (sem ranking) até se sentir à vontade. Experimente cores diferentes para descobrir do que gosta.</p></div></li>
    <li><div><h3>Faça as missões diárias</h3><p>Missões e vitórias diárias dão ouro e cartas. É a forma gratuita de crescer sua coleção. Entre todo dia, mesmo que seja para uma partida.</p></div></li>
    <li><div><h3>Monte seu primeiro deck</h3><p>Veja o passo a passo e a tela de montagem logo abaixo.</p></div></li>
    <li><div><h3>Vá para o Ranqueado</h3><p>Quando ganhar com frequência no modo Jogar, tente o <b>Ranqueado</b> (Bronze, Prata, Ouro, Platina, Diamante e Mítico). O sistema coloca você contra jogadores de nível parecido.</p></div></li>
    <li><div><h3>Experimente o Draft</h3><p>O <b>Draft Rápido</b> (contra escolhas de robôs) é ótimo para aprender a avaliar cartas e ainda rende cartas para a coleção.</p></div></li>
  </ol>

  <div class="sub-h"><h2>Como montar um deck no Arena</h2><p>Esquema simplificado da tela de montagem. Os números correspondem aos passos.</p></div>
  <div class="grid g2" style="align-items:start">
    <div class="mock-wrap"><div class="mock" aria-label="Esquema da tela de montagem do Arena">
      <div class="mbar"><span class="on"><em class="mpin">1</em> Decks</span><span><em class="mpin">2</em> W U B R G</span><span>Custo</span><span>Tipo</span><span style="margin-left:auto">Busca…</span></div>
      <div class="coll"><div class="clab"><em class="mpin">3</em> Coleção</div>${'r r g r g w u g r g dim r g g dim r u g'.split(' ').map(c=>`<i class="${c==='dim'?'r dim':c}"></i>`).join('')}</div>
      <div class="dlist"><div><span><em class="mpin">4</em> Deck novo</span><span>60/60</span></div><div><span>4 × Criatura 1</span><span>●</span></div><div><span>4 × Criatura 2</span><span>●●</span></div><div><span>4 × Remoção</span><span>●</span></div><div><span>3 × Truque</span><span>●</span></div><div><span>11 × Floresta</span></div><div><span>11 × Montanha</span></div><div class="save"><em class="mpin">5</em> Concluído</div></div>
    </div></div>
    <ol class="how">${ARENA_PINS.map(p=>`<li><div><p>${p[2]}</p></div></li>`).join('')}</ol>
  </div>
  <div class="grid g2" style="margin-top:14px;align-items:start">
    <div class="panel stack-v"><h3>Importar uma lista pronta</h3>
      <ol style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px"><li>Copie a lista de um site (botão "Export to Arena" ou "Copiar").</li><li>No Arena, vá em <b>Decks</b> e toque em <b>Importar</b>.</li><li>As cartas que você não tem aparecem marcadas. O Arena oferece criá-las com curingas.</li><li>Antes de gastar, confira quantos curingas raros e míticos o deck pede.</li></ol>
      <p class="muted" style="font-size:.9rem">O caminho inverso também funciona: <b>Exportar</b> copia a lista do seu deck. Cole no Analisador da aba Decks.</p></div>
    <div class="panel stack-v"><h3>Economia do jogo</h3><ul style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px">
      <li><b>Ouro:</b> ganho jogando. Compra pacotes e entradas em eventos.</li>
      <li><b>Gemas:</b> compradas com dinheiro ou ganhas em eventos.</li>
      <li><b>Curingas:</b> trocados por qualquer carta da mesma raridade (comum, incomum, rara, mítica). Vêm nos pacotes.</li>
      <li><b>Cofre:</b> cartas repetidas além da 4ª cópia enchem o Cofre, que libera curingas.</li>
      <li><b>Passe de maestria:</b> recompensas por subir níveis jogando.</li></ul></div>
  </div>
  <div class="sub-h"><h2>Dicas para jogar sem gastar</h2></div>
  <div class="dodont"><div class="panel ok"><h3>Faça</h3><ul>
    <li>Escolha <b>um</b> deck e gaste curingas só nele até completá-lo.</li><li>Prefira cartas que servem em vários decks (terrenos duplos, remoções).</li>
    <li>Faça as missões diárias antes de qualquer outra coisa.</li><li>Use o Draft Rápido se gosta de Limitado: rende pacotes e cartas.</li></ul></div>
    <div class="panel no"><h3>Evite</h3><ul>
    <li>Gastar curingas raros em cartas que você só "achou legal".</li><li>Abrir pacotes de muitas coleções diferentes ao mesmo tempo.</li>
    <li>Entrar no Ranqueado com deck incompleto.</li><li>Ignorar a rotação ao gastar curingas no Padrão.</li></ul></div></div>

  <div class="sub-h"><h2>Jogando no celular e no PC</h2></div>
  <div class="grid g2">
    <div class="panel stack-v"><h3>Celular e tablet</h3><ul style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px">
      <li>Toque e segure uma carta para ampliar e ler o texto.</li><li>Arraste a carta para o campo para jogá-la.</li>
      <li>Baixe os dados do jogo no Wi-Fi: o download inicial é grande.</li><li>Tablets deixam o campo mais legível em partidas longas.</li>
      <li>Ative o <b>controle total</b> quando quiser responder em etapas que o jogo pularia sozinho.</li></ul></div>
    <div class="panel stack-v"><h3>PC</h3><ul style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px">
      <li>Passe o mouse sobre uma carta para ampliá-la.</li><li>A barra de espaço confirma o botão principal (passar, ir para o combate…).</li>
      <li>Use o controle total pelo ícone ao lado do botão principal, ou pelo atalho de teclado mostrado nas configurações.</li>
      <li>A tela maior facilita acompanhar a pilha e o registro de jogadas.</li></ul></div>
  </div>
  <div class="sub-h"><h2>Modos de jogo</h2></div>
  <div class="panel tbl-wrap"><table><thead><tr><th>Modo</th><th>Para quê</th></tr></thead><tbody>
    <tr><td><b>Jogar</b></td><td>Partidas sem ranking. Ideal para testar decks.</td></tr>
    <tr><td><b>Ranqueado</b></td><td>Sobe de nível do Bronze ao Mítico. Melhor de 1 ou Melhor de 3.</td></tr>
    <tr><td><b>Draft Rápido</b></td><td>Draft contra robôs; você joga contra pessoas depois.</td></tr>
    <tr><td><b>Draft Premier / Tradicional</b></td><td>Draft com outros jogadores, como na loja.</td></tr>
    <tr><td><b>Selado</b></td><td>Abre pacotes e monta um deck de 40 cartas.</td></tr>
    <tr><td><b>Brawl</b></td><td>Deck singleton com comandante, 1×1. O mais parecido com Commander.</td></tr>
    <tr><td><b>Histórico, Timeless, Alchemy, Pioneer</b></td><td>Formatos com coleções maiores ou cartas digitais.</td></tr>
    <tr><td><b>Eventos da semana</b></td><td>Formatos especiais e temporários, muitas vezes com decks emprestados.</td></tr>
  </tbody></table></div>`;
  $('#goHub').onclick = () => { deckTab = 'arena'; show('decks'); };
}

/* ---------- montar meu deck (assistente) ---------- */
let wz = {fmt:null, colors:[], style:null, budget:'livre', cmd:null};
const WZ_FMT = [['commander','Commander','100 cards, 1 cópia, comandante'],['padrao','Padrão','60 cards, coleções recentes'],['brawl','Brawl (Arena)','100 cards com comandante, 1×1'],['pioneer','Pioneer','60 cards, desde 2012'],['modern','Modern','60 cards, desde 2003'],['pauper','Pauper','60 cards, só comuns'],['limitado','Draft / Selado','40 cards montados no evento']];
const STY60 = [['aggro','Aggro','Vencer rápido com criaturas baratas'],['midrange','Midrange','Criaturas fortes e remoção'],['controle','Controle','Segurar o jogo e vencer tarde'],['ramp','Ramp','Acelerar mana para ameaças grandes'],['tempo','Tempo','Ameaças baratas e interação']];
const STYC = [['tribal','Tribal','Um tipo de criatura: elfos, goblins…'],['fichas','Fichas','Muitas criaturas pequenas'],['cemiterio','Cemitério','Reaproveitar cartas'],['voltron','Voltron','Uma criatura gigante equipada'],['magias','Mágicas','Instantâneos e feitiços'],['grandes','Criaturas grandes','Ramp e monstros'],['marcadores','Marcadores','+1/+1 e proliferar'],['encant','Encantamentos','Encantamentos que geram valor']];
function wzStyleFor(arch){ const a = arch.toLowerCase(); return a.includes('tribal')?'tribal':a.includes('ficha')?'fichas':a.includes('cemit')||a.includes('reanim')?'cemiterio':a.includes('voltron')||a.includes('aura')?'voltron':a.includes('mágica')?'magias':a.includes('marcador')?'marcadores':a.includes('encant')?'encant':'grandes'; }
const Qcore = {
  cheap:'t:creature mv<=2', mid:'t:creature mv>=3 mv<=4', big:'t:creature mv>=5', top:'t:creature mv>=4 (o:flying or o:trample or o:haste)',
  rem:'(t:instant or t:sorcery) (o:"destroy target" or o:"exile target" or o:"damage to target creature" or o:"damage to any target")',
  wipe:'(o:"destroy all creatures" or o:"exile all creatures" or o:"all creatures get -" or o:"damage to each creature")',
  draw:'(o:"draw two cards" or o:"draw three cards" or o:"draw a card for each" or o:"draws two cards")',
  counter:'o:"counter target spell"', trick:'t:instant (o:"gets +" or o:"gains hexproof" or o:"gain indestructible")',
  ramp:'-t:land (o:"search your library for a basic land" or o:"search your library for up to two basic land" or (t:artifact o:"add {"))',
  prot:'(o:"gains hexproof" or o:"gain hexproof" or o:"gains indestructible" or o:"gain indestructible" or o:"protection from") (t:instant or t:equipment)',
  cantrip:'(t:instant or t:sorcery) mv<=1 o:"draw a card"',
  theme:{tribal:'t:creature o:"creatures you control"',fichas:'o:create o:token',cemiterio:'o:"from your graveyard"',voltron:'(t:aura or t:equipment)',magias:'(t:instant or t:sorcery) mv<=3',grandes:'t:creature mv>=6',marcadores:'o:"+1/+1 counter"',encant:'t:enchantment'}
};
const SLOTS60 = {
  aggro:[[21,'Terrenos','Poucos: o deck é barato.',null],[14,'Criaturas de custo 1–2','O coração do deck. Jogue uma no turno 1 ou 2.','cheap'],[8,'Criaturas de custo 3','Mais fortes, mantêm a pressão.','mid'],[8,'Remoção ou dano direto','Tira bloqueadores do caminho.','rem'],[5,'Truques de combate','Vencem combates e protegem criaturas.','trick'],[4,'Finalizadores de custo 4','Criaturas evasivas ou com ímpeto.','top']],
  midrange:[[24,'Terrenos','',null],[8,'Criaturas de custo 2','Para não ficar parado no começo.','cheap'],[10,'Criaturas de custo 3–4','As melhores criaturas pelo custo.','mid'],[4,'Ameaças de custo 5+','Vencem jogos longos.','big'],[8,'Remoção','Responde às ameaças do oponente.','rem'],[4,'Compra de cards','Mantém a mão cheia.','draw'],[2,'Flexíveis','Adapte ao metagame.',null]],
  controle:[[26,'Terrenos','Você precisa de muitos terrenos para jogos longos.',null],[6,'Anulações','Respondem a qualquer coisa. Só no azul.','counter'],[8,'Remoção pontual','','rem'],[3,'Remoção em massa','Seu melhor card contra aggro.','wipe'],[7,'Compra de cards','Para ter sempre uma resposta.','draw'],[4,'Finalizadores','Poucas ameaças, mas difíceis de remover.','big'],[6,'Mágicas baratas que compram','Filtram as compras.','cantrip']],
  ramp:[[25,'Terrenos','',null],[8,'Aceleração de mana','Buscadores de terreno e criaturas de mana.','ramp'],[7,'Remoção e bloqueadores','Para sobreviver até as ameaças.','rem'],[4,'Compra de cards','','draw'],[8,'Ameaças de custo 4–5','','mid'],[8,'Ameaças de custo 6+','O motivo de acelerar a mana.','big']],
  tempo:[[21,'Terrenos','',null],[14,'Criaturas baratas e evasivas','Voar ou difíceis de bloquear.','cheap'],[12,'Interação barata','Anulações e remoções de 1–2 manas.','rem'],[8,'Mágicas que compram','Mantêm a mão funcionando.','cantrip'],[5,'Ameaças maiores','','top']]
};
const SLOTSC = [[36,'Terrenos','Inclui Command Tower em decks de 2+ cores.',null,'land'],[10,'Aceleração de mana','','ramp','ramp'],[10,'Compra de cards','','draw','draw'],[8,'Remoção pontual','','rem','rem'],[3,'Remoção em massa','','wipe','wipe'],[3,'Proteção','Para seu comandante.','prot','prot'],[25,'Tema do comandante','O plano do deck.','theme',null],[4,'Finalizadores','','top',null]];
function fMontar(){
  const isC = wz.fmt==='commander' || wz.fmt==='brawl';
  const stys = isC ? STYC : STY60;
  if (wz.style && !stys.some(s=>s[0]===wz.style)) wz.style = null;
  const cmds = COMMANDERS.filter(c => wz.colors.length && [...c.id.toLowerCase()].every(x=>wz.colors.includes(x)) );
  $('#fmtBody').innerHTML = `
  <div class="panel stack-v" style="gap:18px">
    <div><h3>Montador guiado</h3><p class="muted">Responda as etapas. O resultado mostra quantas cartas de cada função colocar, com links que já buscam cartas válidas nas suas cores.</p></div>
    <div class="wiz-step"><span class="q-t">1. Formato</span><div class="pick">${WZ_FMT.map(([k,l,d])=>`<button data-wf="${k}" aria-pressed="${wz.fmt===k}"><b>${l}</b><small>${d}</small></button>`).join('')}</div></div>
    ${wz.fmt && wz.fmt!=='limitado' ? `
    <div class="wiz-step"><span class="q-t">2. Cores</span><div class="colorpick">${['W','U','B','R','G'].map(c=>`<button data-wc="${c.toLowerCase()}" aria-pressed="${wz.colors.includes(c.toLowerCase())}" style="background:var(--${c.toLowerCase()})" aria-label="${c}">${c}</button>`).join('')}</div>
      <p class="muted" style="font-size:.88rem">Uma ou duas cores são o melhor começo. Não sabe? Faça o teste "Qual é a sua cor?" na capa.</p></div>
    <div class="wiz-step"><span class="q-t">3. Estilo</span><div class="pick">${stys.map(([k,l,d])=>`<button data-ws="${k}" aria-pressed="${wz.style===k}"><b>${l}</b><small>${d}</small></button>`).join('')}</div></div>
    ${isC ? `<div class="wiz-step"><span class="q-t">4. Comandante</span>${cmds.length?`<div class="pick">${cmds.map(c=>`<button data-wcmd="${esc(c.n)}" aria-pressed="${wz.cmd===c.n}"><b>${esc(c.n)}</b><small>${idSyms(c.id)} ${c.arch}</small></button>`).join('')}</div>`:''}
      <p class="muted" style="font-size:.88rem">${cmds.length?'Ou procure outros: ':'Nenhum exemplo da Academia com exatamente essas cores. '}${wz.colors.length?ext(scry(`is:commander id=${wz.colors.join('')} order:edhrec`),'comandantes com estas cores (Scryfall)'):'Escolha as cores primeiro.'}</p></div>` : ''}
    <div class="wiz-step"><span class="q-t">${isC?5:4}. Orçamento</span><div class="row-h" style="gap:6px">${[['livre','Sem limite'],['barato','Cartas baratas (até US$ 1)'],['arena','Só cartas do Arena']].map(([k,l])=>`<button class="chip" data-wb="${k}" aria-pressed="${wz.budget===k}">${l}</button>`).join('')}</div></div>` : ''}
  </div>
  <div id="wzOut" style="margin-top:16px"></div>

  <div class="sub-h"><h2>Pesquisa de cartas</h2><p>Monte uma busca no Scryfall sem decorar a sintaxe. Ótimo para achar substitutos baratos.</p></div>
  <div class="panel stack-v" id="sfBox"></div>

  <div class="sub-h"><h2>Método em 8 passos para qualquer deck</h2><p>Para quando você travar na montagem.</p></div>
  <ol class="how">
    <li><div><h3>Escreva o plano em uma frase</h3><p>"Atacar com goblins até o turno 6" ou "ganhar com dragões grandes". Toda carta precisa ajudar essa frase.</p></div></li>
    <li><div><h3>Separe 3 a 5 cartas-chave</h3><p>As cartas que fazem o plano acontecer. Coloque o máximo de cópias permitido.</p></div></li>
    <li><div><h3>Encaixe a curva</h3><p>Distribua os custos para ter o que fazer em todos os turnos. Use o gráfico do Analisador.</p></div></li>
    <li><div><h3>Adicione interação</h3><p>Remoções, anulações ou truques. Um deck sem interação perde para qualquer ameaça.</p></div></li>
    <li><div><h3>Corte o que não ajuda o plano</h3><p>Cartas "legais, mas fora do tema" saem primeiro.</p></div></li>
    <li><div><h3>Calcule os terrenos</h3><p>O Analisador sugere a quantidade e a divisão entre as cores.</p></div></li>
    <li><div><h3>Teste mãos iniciais</h3><p>Se muitas mãos são ruins, ajuste terrenos ou cartas caras.</p></div></li>
    <li><div><h3>Jogue, anote, troque</h3><p>Depois de 5 partidas, troque as 3 cartas que menos ajudaram.</p></div></li>
  </ol>`;
  $$('[data-wf]').forEach(b => b.onclick = () => { wz.fmt = b.dataset.wf; if (wz.fmt==='limitado') wz.colors=[]; fMontar(); });
  $$('[data-wc]').forEach(b => b.onclick = () => { const c = b.dataset.wc; wz.colors = wz.colors.includes(c) ? wz.colors.filter(x=>x!==c) : [...wz.colors, c].sort((a,b)=>'wubrg'.indexOf(a)-'wubrg'.indexOf(b)); if (wz.cmd && !COMMANDERS.find(x=>x.n===wz.cmd&&[...x.id.toLowerCase()].every(y=>wz.colors.includes(y)))) wz.cmd=null; fMontar(); });
  $$('[data-ws]').forEach(b => b.onclick = () => { wz.style = b.dataset.ws; fMontar(); });
  $$('[data-wcmd]').forEach(b => b.onclick = () => { wz.cmd = b.dataset.wcmd; fMontar(); });
  $$('[data-wb]').forEach(b => b.onclick = () => { wz.budget = b.dataset.wb; fMontar(); });
  drawWz(); drawSf();
}
function basicsText(colors, n){
  const NAMES = {w:'Plains',u:'Island',b:'Swamp',r:'Mountain',g:'Forest'};
  if (!colors.length) return `${n} Wastes`;
  const each = Math.floor(n/colors.length), extra = n - each*colors.length;
  return colors.map((c,i)=>`${each + (i<extra?1:0)} ${NAMES[c]}`).join('\n');
}
function drawWz(){
  const out = $('#wzOut'); if (!out) return;
  if (!wz.fmt) { out.innerHTML = ''; return; }
  if (wz.fmt === 'limitado') {
    out.innerHTML = `<div class="panel stack-v"><h3>Como montar um deck de Limitado</h3>
      <div class="tiles5"><div class="stat"><div class="k">Deck</div><div class="v">40</div></div><div class="stat"><div class="k">Terrenos</div><div class="v">17</div></div><div class="stat"><div class="k">Criaturas</div><div class="v">15–17</div></div><div class="stat"><div class="k">Outras</div><div class="v">6–8</div></div><div class="stat"><div class="k">Cores</div><div class="v">2</div></div></div>
      <ol class="how">
        <li><div><h3>Abra e separe por cor</h3><p>Coloque as cartas em pilhas por cor e uma pilha de incolores e terrenos.</p></div></li>
        <li><div><h3>Ache as duas cores mais fortes</h3><p>Conte remoções e criaturas boas de cada cor. Fique com as duas melhores.</p></div></li>
        <li><div><h3>Escolha nesta ordem</h3><p>1º remoção, 2º criaturas que voam ou são difíceis de bloquear, 3º criaturas eficientes, 4º truques e o resto.</p></div></li>
        <li><div><h3>Monte a curva</h3><p>Algo como 1–2 de custo 1, 5–6 de custo 2, 4–5 de custo 3, 3–4 de custo 4 e 2–3 de 5 ou mais.</p></div></li>
        <li><div><h3>Complete com 17 terrenos</h3><p>Divida pela quantidade de símbolos de cada cor. No pré-lançamento os terrenos básicos são fornecidos pela loja.</p></div></li>
      </ol></div>`;
    return;
  }
  const isC = wz.fmt==='commander' || wz.fmt==='brawl';
  if (!wz.colors.length || !wz.style) { out.innerHTML = `<div class="panel"><p class="muted">Escolha as cores e o estilo para ver a receita do deck.</p></div>`; return; }
  const col = wz.colors.join('');
  const fpart = {commander:'f:commander',brawl:'f:brawl game:arena',padrao:'f:standard',pioneer:'f:pioneer',modern:'f:modern',pauper:'f:pauper'}[wz.fmt];
  const cpart = isC ? `id<=${col}` : `c<=${col}`;
  const bpart = wz.budget==='barato' ? 'usd<=1' : wz.budget==='arena' ? 'game:arena' : '';
  const order = isC ? 'order:edhrec' : '';
  const link = core => scry(`${core} ${cpart} ${fpart} ${bpart} ${order}`);
  let slots;
  if (isC) {
    slots = SLOTSC.map(s=>[...s]);
    if (wz.fmt==='brawl') { slots[0][0]=38; slots[1][0]=7; slots[2][0]=9; slots[3][0]=10; slots[4][0]=2; slots[5][0]=2; slots[6][0]=27; slots[7][0]=4; }
  } else {
    slots = SLOTS60[wz.style].map(s=>[...s]);
    if (wz.style==='controle' && !wz.colors.includes('u')) { slots[1] = [6,'Remoção extra','Sem azul, troque anulações por mais remoção.','rem']; }
    if (wz.style==='tempo' && !wz.colors.includes('u')) slots[2][2] = 'Remoções baratas (sem azul não há anulações).';
  }
  const fmtName = WZ_FMT.find(f=>f[0]===wz.fmt)[1], styName = (isC?STYC:STY60).find(s=>s[0]===wz.style)[1];
  // esqueleto de texto
  let lines = [`// ${fmtName} · ${styName} · ${col.toUpperCase()}`];
  let fixed = 0;
  if (isC) {
    if (wz.cmd) lines.push(`// Comandante\n1 ${wz.cmd}`);
    if (wz.fmt === 'commander') {
      const picks = new Set(); const add = n => { if (!picks.has(n)) { picks.add(n); lines.push(`1 ${n}`); fixed++; } };
      lines.push('// Cartas básicas das suas cores');
      ['C', ...wz.colors.map(c=>c.toUpperCase())].forEach(c => Object.entries(STAPLE_BY[c]||{}).forEach(([k,arr]) => { if (k==='land' && wz.colors.length<2) return; arr.slice(0, k==='ramp'?5:2).forEach(add); }));
    }
    const lands = slots[0][0] - (wz.colors.length>1 && wz.fmt==='commander' ? 1 : 0);
    lines.push('// Terrenos básicos (troque alguns por terrenos duplos quando puder)', basicsText(wz.colors, lands));
    lines.push(`// Faltam cerca de ${99 - fixed - lands} cartas: use os links de cada categoria`);
  } else {
    lines.push('// Terrenos básicos', basicsText(wz.colors, slots[0][0]), '// Complete as categorias com 4 cópias das melhores cartas');
  }
  const txt = lines.join('\n');
  const total = slots.reduce((a,s)=>a+s[0],0);
  out.innerHTML = `
   <div class="panel stack-v">
     <div class="row-h" style="justify-content:space-between"><div><span class="eyebrow">Receita</span><h3 style="margin:0">${fmtName} · ${styName} ${idSyms(col.toUpperCase())}</h3></div><span class="pill good">${total}${isC?' + comandante':''} cards</span></div>
     ${wz.cmd ? `<div class="row-h">${cardHTML(wz.cmd,{cls:'mini',showPt:false})}<div class="stack-v" style="gap:4px"><b>${esc(wz.cmd)}</b>${ext(edh(wz.cmd),'Cartas mais usadas com ele (EDHREC)')}</div></div>` : ''}
     <div>${slots.map(s=>`<div class="slot"><span class="n">${s[0]}</span><div><b>${s[1]}</b>${s[2]?`<p>${s[2]}</p>`:''}
       ${s[4] && wz.fmt==='commander' ? `<div class="ex">Exemplos: ${['C',...wz.colors.map(c=>c.toUpperCase())].flatMap(c=>(STAPLE_BY[c]||{})[s[4]]||[]).slice(0,5).map(n=>cr(n)).join(', ')||'<span class="muted">use a busca</span>'}</div>`:''}
       ${s[3] ? `<a href="${link(s[3]==='theme'?Qcore.theme[wz.style]:Qcore[s[3]])}" target="_blank" rel="noopener">Buscar cartas válidas ↗</a>` : ''}</div></div>`).join('')}</div>
     <div class="stack-v" style="gap:8px"><b>Esqueleto da lista</b><pre class="code" id="wzTxt">${esc(txt)}</pre>
       <div class="row-h"><button class="btn primary" id="wzAn">Abrir no Analisador</button><button class="btn" id="wzCopy">Copiar</button></div>
       <p class="muted" style="font-size:.85rem">Os links usam o Scryfall já filtrado por formato e cores. ${wz.fmt==='padrao'?'O Padrão muda a cada coleção, por isso a Academia não fixa nomes de cartas para ele: os links sempre mostram o que é válido hoje.':''}</p></div>
   </div>`;
  $('#wzAn').onclick = () => { deckText = txt; deckFormat = isC ? (wz.fmt==='commander'?'100':'100') : '60'; DECK = null; hand = null; deckTab = 'analise'; if (isC && !S.cmdBuilt) { S.cmdBuilt = true; save(); checkAch(); } show('decks'); };
  $('#wzCopy').onclick = () => copyText(txt, $('#wzTxt'));
  if (isC && wz.cmd && !S.cmdBuilt) { S.cmdBuilt = true; save(); checkAch(); }
}
function copyText(t, el){
  const done = () => toast('Lista copiada');
  try { navigator.clipboard.writeText(t).then(done, () => sel(el)); } catch(e){ sel(el); }
  function sel(n){ const r = document.createRange(); r.selectNodeContents(n); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texto selecionado: use Copiar do seu aparelho'); }
}
let sf = {f:'', c:[], t:'', o:'', mv:'', r:'', price:false};
function drawSf(){
  const box = $('#sfBox'); if (!box) return;
  const parts = [];
  if (sf.f) parts.push('f:'+sf.f);
  if (sf.c.length) parts.push((sf.f==='commander'?'id<=':'c<=') + sf.c.join(''));
  if (sf.t) parts.push('t:'+sf.t);
  if (sf.o.trim()) parts.push(`o:"${sf.o.trim().replace(/"/g,'')}"`);
  if (sf.mv) parts.push('mv<='+sf.mv);
  if (sf.r) parts.push('r:'+sf.r);
  if (sf.price) parts.push('usd<=1');
  const q = parts.join(' ') || 't:legendary t:creature';
  box.innerHTML = `
   <div class="grid g3">
     <label class="f" for="sfF">Formato<select id="sfF"><option value="">Qualquer</option>${[['commander','Commander'],['standard','Padrão'],['pioneer','Pioneer'],['modern','Modern'],['pauper','Pauper'],['brawl','Brawl']].map(([v,l])=>`<option value="${v}" ${sf.f===v?'selected':''}>${l}</option>`).join('')}</select></label>
     <label class="f" for="sfT">Tipo<select id="sfT"><option value="">Qualquer</option>${[['creature','Criatura'],['instant','Instantâneo'],['sorcery','Feitiço'],['enchantment','Encantamento'],['artifact','Artefato'],['planeswalker','Planeswalker'],['land','Terreno'],['legendary','Lendária']].map(([v,l])=>`<option value="${v}" ${sf.t===v?'selected':''}>${l}</option>`).join('')}</select></label>
     <label class="f" for="sfMv">Custo máximo<select id="sfMv"><option value="">Qualquer</option>${[1,2,3,4,5,6].map(v=>`<option ${sf.mv==v?'selected':''}>${v}</option>`).join('')}</select></label>
     <label class="f" for="sfR">Raridade<select id="sfR"><option value="">Qualquer</option>${[['common','Comum'],['uncommon','Incomum'],['rare','Rara'],['mythic','Mítica']].map(([v,l])=>`<option value="${v}" ${sf.r===v?'selected':''}>${l}</option>`).join('')}</select></label>
     <label class="f" for="sfO">Texto da carta (em inglês)<input type="text" id="sfO" value="${esc(sf.o)}" placeholder="ex.: draw a card, flying, token"></label>
     <div class="f" style="font-weight:700;font-size:.88rem;color:var(--muted);display:flex;flex-direction:column;gap:5px">Cores<div class="colorpick">${['W','U','B','R','G'].map(c=>`<button data-sfc="${c.toLowerCase()}" aria-pressed="${sf.c.includes(c.toLowerCase())}" style="background:var(--${c.toLowerCase()});width:40px;height:40px;font-size:.9rem" aria-label="${c}">${c}</button>`).join('')}</div></div>
   </div>
   <label class="chk" style="border:0"><input type="checkbox" id="sfP" ${sf.price?'checked':''}><span>Só cartas baratas (até US$ 1)</span></label>
   <div class="qbox"><code id="sfQ">${esc(q)}</code><a class="btn primary" href="${scry(q)}" target="_blank" rel="noopener">Buscar no Scryfall ↗</a></div>
   <p class="muted" style="font-size:.85rem">O Scryfall busca em inglês. Termos úteis no texto: <i>draw a card</i> (compra), <i>destroy target</i> (remoção), <i>create</i> (fichas), <i>flying</i>, <i>search your library</i> (busca).</p>`;
  const rd = () => { sf.f=$('#sfF').value; sf.t=$('#sfT').value; sf.mv=$('#sfMv').value; sf.r=$('#sfR').value; sf.price=$('#sfP').checked; drawSf(); };
  ['sfF','sfT','sfMv','sfR','sfP'].forEach(id => $('#'+id).onchange = rd);
  $('#sfO').onchange = e => { sf.o = e.target.value; drawSf(); };
  $$('[data-sfc]', box).forEach(b => b.onclick = () => { const c=b.dataset.sfc; sf.c = sf.c.includes(c)?sf.c.filter(x=>x!==c):[...sf.c,c].sort((a,b)=>'wubrg'.indexOf(a)-'wubrg'.indexOf(b)); drawSf(); });
}

/* ---------- na mesa ---------- */
let etq = {i:0, ans:null, score:0, done:false, order:null}, slangQ = '';
function fMesa(){
  if (!S.chk) S.chk = [];
  $('#fmtBody').innerHTML = `
  <div class="panel stack-v"><h3>Jogar com quem já joga há anos</h3>
    <p>Jogadores experientes costumam ser muito receptivos com novatos que jogam de forma clara e respeitosa. Você não precisa saber todas as cartas: precisa anunciar o que faz, conhecer as etapas do turno e não ter medo de perguntar. Esta seção reúne o que ninguém costuma explicar.</p></div>

  <div class="sub-h"><h2>Antes da partida</h2></div>
  <div class="panel">${BEFORE_CHK.map((t,i)=>`<label class="chk ${S.chk[i]?'done':''}"><input type="checkbox" data-ck="${i}" ${S.chk[i]?'checked':''}><span>${t}</span></label>`).join('')}</div>

  <div class="sub-h"><h2>Frases que você vai ouvir e usar</h2><p>Muitos veteranos misturam português e inglês. Os dois jeitos estão aqui.</p></div>
  <div class="phr">${PHRASES.map(p=>`<div><b>${p[0]}</b><i>${p[1]}</i> ${sayBtn(p[1])}<span>${p[2]}</span></div>`).join('')}</div>

  <div class="sub-h"><h2>Etiqueta</h2></div>
  <div class="dodont">
    <div class="panel ok"><h3>Faça</h3><ul>
      <li>Diga em voz alta o que está conjurando e qual é o alvo.</li><li>Vire os terrenos de forma clara e deixe as permanentes visíveis.</li>
      <li>Pergunte "resolve?" antes de seguir quando o oponente tiver mana aberta.</li><li>Mantenha o cemitério em ordem e as cartas da mão acima da mesa.</li>
      <li>Peça para ler uma carta do oponente quando não conhecer. É seu direito.</li><li>Agradeça e cumprimente no fim da partida.</li></ul></div>
    <div class="panel no"><h3>Evite</h3><ul>
      <li>Tocar nas cartas do oponente sem pedir.</li><li>Jogar rápido demais sem dar chance de resposta.</li>
      <li>Embaralhar mal ou de forma que pareça manipular o deck.</li><li>Ensinar jogadas a quem não pediu.</li>
      <li>Usar o celular durante o turno do oponente.</li><li>Ficar com raiva da derrota: todo mundo perde muito no começo.</li></ul></div>
  </div>

  <div class="sub-h"><h2>Sua primeira vez na loja</h2></div>
  <ol class="how">
    <li><div><h3>Escolha o evento certo</h3><ul><li><b>Pré-lançamento:</b> Selado com cards novos, ambiente festivo. O melhor primeiro evento.</li><li><b>Noite de Commander:</b> mesas casuais de 4. Leve um precon.</li><li><b>Friday Night Magic (FNM):</b> evento semanal casual, geralmente Padrão, Commander ou Draft.</li><li>Evite começar por torneios competitivos (Regional, RCQ).</li></ul></div></li>
    <li><div><h3>Avise que é iniciante</h3><p>Diga ao organizador e aos oponentes. Quase sempre eles vão explicar com paciência e o jogo fica mais tranquilo.</p></div></li>
    <li><div><h3>Leve o básico</h3><p>Deck com protetores, dado ou contador de vida, fichas, caneta e papel. Em eventos com inscrição, o organizador indica como se registrar (muitas lojas usam o app Magic: Companion).</p></div></li>
    <li><div><h3>Entenda o nível de rigor</h3><p>Eventos casuais (nível "Regular") perdoam erros pequenos e conversam sobre correções. Torneios competitivos são mais rigorosos. Em qualquer nível, chamar um juiz é normal.</p></div></li>
    <li><div><h3>Depois do jogo, converse</h3><p>Pergunte ao oponente como o deck dele funciona e o que você poderia ter feito diferente. É a forma mais rápida de evoluir.</p></div></li>
  </ol>

  <div class="sub-h"><h2>Vocabulário dos veteranos</h2></div>
  <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="text" id="slangQ" placeholder="Busque uma gíria: ETB, ramp, salt…" value="${esc(slangQ)}" autocomplete="off"></div>
  <div class="panel tbl-wrap"><table><tbody id="slangBody"></tbody></table></div>

  <div class="sub-h"><h2>Simulado: noite na loja</h2><p>Sete situações reais. Acerte 6 ou mais para concluir a trilha da mesa.</p></div>
  <div class="q" id="etqBox"></div>`;
  $$('[data-ck]').forEach(i => i.onchange = () => { S.chk[+i.dataset.ck] = i.checked; save(); i.closest('.chk').classList.toggle('done', i.checked); });
  const sb = () => { const q = slangQ.toLowerCase(); $('#slangBody').innerHTML = SLANG.filter(s=>!q||(s[0]+s[1]).toLowerCase().includes(q)).map(s=>`<tr><td style="white-space:nowrap"><b>${s[0]}</b> ${sayBtn(s[0].split(' / ')[0])}</td><td>${s[1]}</td></tr>`).join('') || '<tr><td>Nada encontrado.</td></tr>'; };
  $('#slangQ').oninput = e => { slangQ = e.target.value; sb(); }; sb();
  drawEtq();
}
function drawEtq(){
  const box = $('#etqBox'); if (!box) return;
  if (etq.done) {
    const ok = etq.score >= 6; if (ok && !S.etq) { S.etq = true; addXP(80); save(); checkAch(); }
    box.innerHTML = `<div class="ask">Resultado: ${etq.score} de ${ETQ_Q.length}</div><p class="muted">${ok?'Você está pronto para sentar numa mesa com veteranos.':'Releia a seção de etiqueta e tente de novo.'}</p><div><button class="btn primary" id="etqAgain">Refazer</button></div>`;
    $('#etqAgain').onclick = () => { etq = {i:0,ans:null,score:0,done:false,order:null}; drawEtq(); };
    return;
  }
  const q = ETQ_Q[etq.i]; if (!etq.order) etq.order = shuffleIdx(q.o.length); const ans = etq.ans != null;
  box.innerHTML = `<div class="qprog"><span>Situação ${etq.i+1} de ${ETQ_Q.length}</span><span class="mono">${etq.score} acertos</span></div>
    <div class="ask">${q.q}</div>
    ${etq.order.map((oi,k)=>`<button class="opt ${ans?(oi===q.a?'right':oi===etq.ans?'wrong':''):''}" data-eo="${oi}" ${ans?'disabled':''}><span class="k">${'ABC'[k]}</span><span>${q.o[oi]}</span></button>`).join('')}
    ${ans?`<div class="why ${etq.ans===q.a?'ok':'no'}">${q.e}</div><div><button class="btn primary" id="etqNext">${etq.i===ETQ_Q.length-1?'Ver resultado':'Próxima'}</button></div>`:''}`;
  $$('[data-eo]', box).forEach(b => b.onclick = () => { etq.ans = +b.dataset.eo; if (etq.ans===q.a) { etq.score++; sfx('ok'); } else sfx('no'); drawEtq(); });
  const nx = $('#etqNext'); if (nx) nx.onclick = () => { if (etq.i < ETQ_Q.length-1) { etq.i++; etq.ans=null; etq.order=null; } else etq.done = true; drawEtq(); };
}
