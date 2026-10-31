/* ================= ASSISTENTE DE DECK =================
   Perguntas sobre o tipo de jogo e o jeito de jogar → recomendação de estilo e cores
   → (comandante) → composição balanceada → lista pronta para o Arena, com imagens e download. */
const AF = {
  commander:{n:'Commander', d:'Mesa física · 100 cartas, 1 de cada, com comandante · 40 de vida', size:100, single:true, cmd:true, arena:false, q:'f:commander'},
  brawl:{n:'Brawl no Arena', d:'O Commander do Arena · 100 cartas, 1 de cada, com comandante', size:100, single:true, cmd:true, arena:true, q:'f:brawl'},
  standardbrawl:{n:'Brawl Padrão', d:'Arena · 60 cartas, 1 de cada, coleções recentes', size:60, single:true, cmd:true, arena:true, q:'f:standardbrawl'},
  standard:{n:'Padrão', d:'Arena e mesa · 60 cartas, até 4 cópias, coleções recentes', size:60, arena:true, q:'f:standard'},
  historic:{n:'Histórico', d:'Arena · 60 cartas, coleção maior do Arena', size:60, arena:true, q:'f:historic'},
  pioneer:{n:'Pioneer', d:'Mesa (no Arena: Explorer) · 60 cartas, coleções desde 2012', size:60, arena:false, q:'f:pioneer'},
  pauper:{n:'Pauper', d:'Mesa · 60 cartas, só cartas comuns · barato', size:60, arena:false, q:'f:pauper'},
  modern:{n:'Modern', d:'Mesa · 60 cartas, coleções desde 2003 · competitivo', size:60, arena:false, q:'f:modern'}
};
const AQ = [
  {k:'win', t:'Como você gosta de vencer?', o:[['rapido','Atacar desde o primeiro turno','Criaturas baratas e dano rápido'],['grande','Com criaturas enormes','Acelerar a mana e baixar monstros'],['magicas','Com muitas mágicas','Instantâneos, feitiços e jogadas espertas'],['controle','Controlando o jogo','Responder a tudo e vencer no fim'],['fichas','Enchendo a mesa','Muitas criaturas pequenas e fichas'],['sinergia','Com sinergias e combos','Cartas que se fortalecem juntas']]},
  {k:'inter', t:'Quanto quer atrapalhar o oponente?', o:[['muita','Muito','Remoções e anulações'],['media','Na medida','Algumas respostas'],['pouca','Pouco','Prefiro focar no meu plano']]},
  {k:'pace', t:'Que ritmo de partida você prefere?', o:[['rapida','Rápida','Decidir até o turno 5'],['media','Média','Equilíbrio'],['longa','Longa','Jogo de cartas grandes e viradas']]},
  {k:'theme', t:'Tem algum tema favorito?', o:[['nenhum','Tanto faz',''],['voar','Voadores',''],['tribal','Um tipo de criatura',''],['grave','Cemitério',''],['counters','Marcadores +1/+1',''],['arts','Artefatos',''],['life','Ganhar vida',''],['dragons','Dragões','']]},
  {k:'exp', t:'Qual a sua experiência?', o:[['novo','Estou começando','Cartas diretas, sem textos longos'],['medio','Já jogo há algum tempo',''],['vet','Sou veterano','Pode caprichar na complexidade']]},
  {k:'rar', t:'Quanto quer gastar?', o:[['unc','Pouco','Só comuns e incomuns'],['rare','Médio','Até raras, sem míticas'],['all','Tanto faz','Qualquer raridade']]}
];
const AS_ARCH = {
  aggro:{n:'Aggro', d:'Ataca desde o início com criaturas baratas e termina com dano direto.', cols:['RW','R','BR','WB']},
  tempo:{n:'Mágicas (Tempo)', d:'Criaturas que crescem a cada mágica, compra barata e truques no turno do oponente.', cols:['UR','U','UB','RW']},
  midrange:{n:'Midrange', d:'Criaturas eficientes e boas remoções: forte contra quase tudo.', cols:['BG','GW','BR','WB']},
  controle:{n:'Controle', d:'Anula, remove e compra cartas até vencer com poucas ameaças grandes.', cols:['WU','UB','U','WB']},
  ramp:{n:'Ramp', d:'Acelera a mana nos primeiros turnos para jogar criaturas enormes antes do oponente.', cols:['G','RG','GU','BG']},
  tokens:{n:'Fichas', d:'Cria muitas criaturas pequenas e as fortalece todas de uma vez.', cols:['GW','RW','W','WB']},
  tema:{n:'Sinergia', d:'Um tema central em que cada carta melhora as outras.', cols:['BG','GW','UB','WU']}
};
const THEME_COLS = {voar:['WU','W','U'], grave:['BG','UB','B'], counters:['GW','G','GU'], arts:['UR','RW','WU'], life:['WB','GW','W'], dragons:['R','RG','BR']};
const TRIBE_COLS = {goblin:['R','BR'], elf:['G','BG'], vampire:['B','WB'], zombie:['UB','B'], angel:['W','WU'], dragon:['R','RG'], merfolk:['U','GU'], knight:['W','WB'], wizard:['U','UR'], cat:['W','GW']};
const THEME_Q = {voar:'t:creature o:flying', grave:'(o:"from your graveyard" or o:"mill" or o:"into your graveyard")', counters:'o:"+1/+1 counter"', arts:'(t:artifact or o:"artifact you control")', life:'(o:"gain" o:"life" or o:"whenever you gain life")', dragons:'t:dragon'};
const ROLE_PT = {cheap:'Criaturas baratas (custo 1–2)', mid:'Criaturas médias (custo 3–4)', big:'Ameaças grandes (custo 5+)', rem:'Remoção', wipe:'Remoção em massa', counter:'Anulações', draw:'Compra de cartas', cantrip:'Mágicas baratas que compram', trick:'Truques de combate', ramp:'Aceleração de mana', tok:'Geradores de fichas', anthem:'Fortalecem o time', theme:'Cartas do tema', prowess:'Criaturas que gostam de mágicas', fly:'Voadores', lands:'Terrenos'};
const ROLE_Q = Object.assign({}, RQ, {tok:'o:create o:token', anthem:'o:"creatures you control get +"', prowess:'t:creature (o:prowess or o:"whenever you cast an instant or sorcery")'});
let asd = {step:1, fmt:null, a:{tribe:'goblin'}, colsPick:null, rec:null, choice:null, cmdOpts:null, cmd:null, plan:null, res:null, busy:false, vari:0};
function asArch(a){
  const m = {rapido:'aggro', grande:'ramp', magicas:'tempo', controle:'controle', fichas:'tokens', sinergia:'tema'};
  let k = m[a.win] || 'midrange';
  if (k === 'aggro' && a.pace === 'longa') k = 'midrange';
  if (k === 'controle' && a.inter === 'pouca') k = 'midrange';
  if (k === 'ramp' && a.pace === 'rapida') k = 'midrange';
  if (a.theme && a.theme !== 'nenhum' && k === 'midrange' && a.win === 'sinergia') k = 'tema';
  return k;
}
function asRecommend(){
  const a = asd.a, k = asArch(a); let cols = AS_ARCH[k].cols.slice();
  if (a.theme === 'tribal') cols = (TRIBE_COLS[a.tribe] || []).concat(cols);
  else if (THEME_COLS[a.theme]) cols = THEME_COLS[a.theme].concat(cols);
  if (a.inter === 'muita') cols.sort((x,y) => /[UB]/.test(y) - /[UB]/.test(x));
  if (a.exp === 'novo') cols.sort((x,y) => x.length - y.length);
  cols = [...new Set(cols)];
  if (asd.colsPick && asd.colsPick.length) cols = [asd.colsPick.join('').toUpperCase()];
  const alt = Object.keys(AS_ARCH).filter(x => x !== k && x !== 'tema').filter(x => ({aggro:['midrange','tokens'], tempo:['controle','midrange'], midrange:['aggro','ramp'], controle:['tempo','midrange'], ramp:['midrange','tokens'], tokens:['aggro','midrange'], tema:['midrange','tokens']})[k].includes(x));
  return {k, cols: cols.slice(0, 3), alt};
}
const asColName = c => { if (c.length === 1) return ({W:'Branco',U:'Azul',B:'Preto',R:'Vermelho',G:'Verde'})[c]; return GUILD_OF[c] || GUILD_OF[c[1]+c[0]] || c; };
const whyCols = c => ({W:'organização e criaturas eficientes',U:'mágicas, compra e anulações',B:'remoções e recursos do cemitério',R:'velocidade e dano direto',G:'criaturas grandes e mana extra'});
function colWhy(c){ const w = whyCols(); return c.split('').map(x => w[x]).join(' + '); }
/* composição balanceada por formato e estilo */
function asPlan(){
  const F = AF[asd.fmt], a = asd.a, k = asd.choice.arch, big = F.size === 100;
  let lands, R;
  if (big) {
    lands = k === 'aggro' || k === 'tokens' ? 35 : k === 'ramp' ? 38 : 37;
    R = {ramp: k === 'ramp' ? 14 : 10, draw:10, rem:8, wipe: k === 'controle' ? 5 : k === 'aggro' ? 1 : 3};
    if (k === 'controle' && asd.choice.cols.includes('U')) R.counter = 4;
    if (k === 'tokens') { R.tok = 14; R.anthem = 5; }
    if (k === 'tempo') { R.cantrip = 8; R.prowess = 8; }
    if (k === 'aggro') { R.cheap = 14; R.trick = 4; }
    if (k === 'ramp') R.big = 10;
  } else {
    lands = {aggro:22, tempo:23, midrange:24, controle:26, ramp:25, tokens:23, tema:24}[k];
    R = {aggro:{cheap:16, mid:8, rem:8, trick:4}, tempo:{prowess:10, cantrip:8, rem:8, counter:4, draw:4}, midrange:{cheap:6, mid:12, big:4, rem:8, draw:4},
         controle:{rem:8, counter:6, wipe:3, draw:7, cantrip:4, big:4}, ramp:{ramp:8, mid:6, big:10, rem:5, draw:3}, tokens:{tok:14, anthem:4, cheap:6, rem:7, draw:3}, tema:{theme:14, cheap:6, mid:4, rem:8, draw:4}}[k];
    R = Object.assign({}, R);
    if (!asd.choice.cols.includes('U')) { if (R.counter) { R.rem += R.counter; delete R.counter; } }
  }
  if (a.pace === 'rapida') lands -= 1; if (a.pace === 'longa') lands += 1;
  if (a.inter === 'muita') R.rem = (R.rem||0) + (big ? 3 : 2); if (a.inter === 'pouca' && R.rem) R.rem = Math.max(big ? 5 : 4, R.rem - (big ? 3 : 3));
  if (a.theme && a.theme !== 'nenhum') R.theme = (R.theme||0) + (big ? 12 : 8);
  const slots = F.size - lands - (F.cmd ? 1 : 0);
  const fixed = Object.entries(R).filter(([r]) => !(big && r === 'theme'));
  let sum = Object.values(R).reduce((x,y)=>x+y,0);
  if (big) { R.theme = Math.max(0, slots - (sum - (R.theme||0))); sum = Object.values(R).reduce((x,y)=>x+y,0); }
  // escala para caber exatamente nos espaços
  const sc = slots / sum; let tot = 0; const out = {};
  Object.entries(R).forEach(([r,v]) => { out[r] = Math.max(1, Math.round(v * sc)); tot += out[r]; });
  const keys = Object.keys(out).sort((x,y) => out[y]-out[x]); let i = 0;
  while (tot !== slots && i < 200) { const r = keys[i % keys.length]; if (tot > slots && out[r] > 1) { out[r]--; tot--; } else if (tot < slots) { out[r]++; tot++; } i++; }
  return {lands, roles: out, slots};
}
function asThemeQ(){ const a = asd.a; if (a.theme === 'tribal') return `t:${a.tribe}`; if (THEME_Q[a.theme]) return THEME_Q[a.theme]; return {aggro:'t:creature mv<=3', tempo:'(t:instant or t:sorcery)', tokens:'o:create o:token', ramp:'t:creature mv>=5', controle:'(t:instant or t:sorcery)', midrange:'t:creature mv>=3', tema:'t:creature'}[asd.choice.arch]; }
function asBase(){
  const F = AF[asd.fmt], col = asd.choice.cols.toLowerCase();
  const rar = asd.fmt === 'pauper' ? '' : RAR[asd.a.rar || 'all'];
  const simple = asd.a.exp === 'novo' ? '-o:"choose one" -is:dfc' : '';
  return `${F.cmd ? 'id<=' : 'c<='}${col} ${F.q}${F.arena ? ' game:arena' : ''} -t:land ${rar} ${simple}`.replace(/\s+/g,' ').trim();
}
async function asCommanders(st){
  const F = AF[asd.fmt], col = asd.choice.cols.toLowerCase(), t = asThemeQ();
  st('Procurando comandantes…');
  let L = await fetchQ(`is:commander id=${col} ${F.q}${F.arena ? ' game:arena' : ''} ${t.startsWith('t:creature') ? '' : t}`, 12).catch(()=>[]);
  if (L.length < 3) L = L.concat(await fetchQ(`is:commander id=${col} ${F.q}${F.arena ? ' game:arena' : ''}`, 12));
  return [...new Set(L)].slice(0, 6);
}
async function asGenerate(st){
  const F = AF[asd.fmt], P = asd.plan, copies = F.single ? 1 : 4, base = asBase(), themeQ = asThemeQ();
  const used = new Set(), out = [], roleOf = {};
  if (asd.cmd) used.add(asd.cmd);
  const order = Object.entries(P.roles).sort((x,y) => (x[0]==='theme') - (y[0]==='theme'));
  let count = 0;
  for (const [r, n] of order) {
    let q = r === 'theme' ? themeQ : ROLE_Q[r];
    if (asd.a.theme === 'tribal' && ['cheap','mid','big'].includes(r)) q = `t:${asd.a.tribe} ${q}`;
    st(`Escolhendo: ${(ROLE_PT[r]||r).toLowerCase()}…`);
    let L = await fetchQ(`${q} ${base}`, 60);
    if (L.length < Math.ceil(n / copies)) L = L.concat(await fetchQ(`${q} ${F.cmd ? 'id<=' : 'c<='}${asd.choice.cols.toLowerCase()} ${F.q}${F.arena ? ' game:arena' : ''} -t:land`, 60));
    const start = asd.vari ? (asd.vari * 2) % Math.max(1, L.length - Math.ceil(n / copies)) : 0;
    const LL = L.slice(start).concat(L.slice(0, start));
    if (preferOwned()) LL.sort((x,y) => (owned(y) ? 1 : 0) - (owned(x) ? 1 : 0));
    let got = 0;
    for (const name of LL) { if (got >= n) break; if (used.has(name)) continue; const k = Math.min(copies, n - got); used.add(name); out.push({name, q:k}); roleOf[name] = r; got += k; count += k; }
  }
  if (count < P.slots) {
    st('Completando…'); const L = await fetchQ(`t:creature ${base}`, 100);
    for (const name of L) { if (count >= P.slots) break; if (used.has(name)) continue; const k = Math.min(copies, P.slots - count); used.add(name); out.push({name, q:k}); roleOf[name] = 'theme'; count += k; }
  }
  if (count < P.slots * .8) throw new Error('vazio');
  // terrenos
  let landLeft = P.lands + (P.slots - count); const cols = asd.choice.cols.split('');
  if (cols.length >= 2) { st('Escolhendo terrenos…'); const L = await fetchQ(`t:land -t:basic produces=${asd.choice.cols.toLowerCase()} ${F.q}${F.arena ? ' game:arena' : ''} ${asd.fmt === 'pauper' ? '' : RAR[asd.a.rar || 'all']}`, 10).catch(()=>[]);
    const maxNb = F.single ? (F.size === 100 ? 8 : 4) : 8;
    let nb = 0; for (const n of L) { if (nb >= maxNb) break; const k = Math.min(copies, landLeft, maxNb - nb); if (k > 0) { out.push({name:n, q:k}); roleOf[n] = 'lands'; landLeft -= k; nb += k; } }
    if (F.cmd && F.size === 100 && landLeft > 0) { out.push({name:'Command Tower', q:1}); roleOf['Command Tower'] = 'lands'; landLeft--; } }
  const pp = {}; out.forEach(e => { const p = pips_(cardData(e.name)); for (const c in p) pp[c] = (pp[c]||0) + p[c] * e.q; });
  if (F.single && F.size === 100) { /* básicos podem repetir */ }
  Object.entries(basicsSplit(pp, landLeft, cols.filter(c => BASIC_OF[c]))).forEach(([n,q]) => { if (q) { out.push({name:n, q}); roleOf[n] = 'lands'; } });
  if (asd.cmd) out.unshift({name:asd.cmd, q:1});
  return {list: out, cmd: asd.cmd, roleOf};
}
/* ---------- tela ---------- */
const AS_STEPS = ['Tipo de jogo','Perguntas','Recomendação','Composição','Deck pronto'];
function renderAssist(){
  const steps = `<ol class="ow-steps as-steps">${AS_STEPS.map((t,i) => { const n = i + 1; const st = n < asd.step ? 'done' : n === asd.step ? 'cur' : ''; return `<li class="${st}"><button ${n < asd.step ? `data-ass="${n}"` : 'disabled'}><span class="ow-n">${n}</span><span>${t}</span></button></li>`; }).join('')}</ol>`;
  const B = [null, asS1, asS2, asS3, asS4, asS5][asd.step]();
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Criar deck do zero</h3>
    <p class="muted">Escolha o tipo de jogo, responda algumas perguntas e a Academia recomenda o estilo e as cores, monta o deck com as quantidades certas para o formato e entrega a lista para baixar ou importar no MTG Arena.</p>
    ${steps}<div class="stack-v" id="asBody">${B}</div><p class="muted" id="asSt" role="status" style="font-size:.9rem"></p></div>`;
  $$('[data-ass]').forEach(b => b.onclick = () => { asd.step = +b.dataset.ass; renderAssist(); });
  bindAssist();
}
function asS1(){
  return `<span class="q-t">Em que tipo de jogo você vai usar o deck?</span>
    <div class="pick as-fmt">${Object.entries(AF).map(([k,f]) => `<button data-af="${k}" aria-pressed="${asd.fmt===k}"><b>${f.n}${f.arena ? ' <span class="pill good">Arena</span>' : ''}</b><small>${f.d}</small></button>`).join('')}</div>
    <p class="muted" style="font-size:.88rem">Commander não existe no Arena com esse nome: lá ele se chama Brawl. <b>Vai jogar no Arena? Escolha Brawl</b>, assim só entram cartas que existem no Arena. Os formatos de mesa geram a lista do mesmo jeito, para montar com cartas físicas ou importar em sites como Moxfield.</p>`;
}
function asS2(){
  const a = asd.a; const all = AQ.every(q => a[q.k]);
  return AQ.map((q,i) => `<div class="wiz-step"><span class="q-t">${i+1}. ${q.t}</span><div class="pick">${q.o.map(([k,l,d]) => `<button data-aq="${q.k}" data-av="${k}" aria-pressed="${a[q.k]===k}"><b>${l}</b>${d ? `<small>${d}</small>` : ''}</button>`).join('')}</div>
      ${q.k === 'theme' && a.theme === 'tribal' ? `<div class="row-h" style="margin-top:8px">${TRIBES.map(([k,l]) => `<button class="chip" data-atr="${k}" aria-pressed="${a.tribe===k}">${l}</button>`).join('')}</div>` : ''}</div>`).join('')
    + `<div class="wiz-step"><span class="q-t">${AQ.length+1}. Cores</span><p class="muted" style="margin:0 0 6px;font-size:.9rem">Deixe em branco para a Academia sugerir, ou escolha as suas.</p>
      <div class="colorpick">${['W','U','B','R','G'].map(c=>`<button data-acol="${c.toLowerCase()}" aria-pressed="${(asd.colsPick||[]).includes(c.toLowerCase())}" style="background:var(--${c.toLowerCase()})" aria-label="${c}">${c}</button>`).join('')}</div></div>
    <div class="row-h"><button class="btn primary" id="asToRec" ${all ? '' : 'disabled'}>Ver minha recomendação</button><span class="muted" style="font-size:.88rem">${all ? '' : 'Responda todas as perguntas.'}</span></div>`;
}
function asS3(){
  const r = asd.rec = asRecommend(); const A = AS_ARCH[r.k];
  if (!asd.choice) asd.choice = {arch:r.k, cols:r.cols[0]};
  const opt = (arch, cols, main) => `<button class="as-rec ${main ? 'main' : ''}" data-arch="${arch}" data-cols="${cols}" aria-pressed="${asd.choice.arch===arch && asd.choice.cols===cols}">
      <span class="as-pips">${cols.split('').map(manaSym).join('')}</span><b>${AS_ARCH[arch].n} ${asColName(cols)}</b>
      <small>${AS_ARCH[arch].d}</small><small class="muted">Cores: ${colWhy(cols)}.</small>${main ? '<span class="pill good">Recomendado para você</span>' : ''}</button>`;
  return `<p>Pelas suas respostas, o seu estilo é <b>${A.n}</b>. ${A.d}</p>
    <div class="as-recs">${opt(r.k, r.cols[0], true)}${r.cols.slice(1).map(c => opt(r.k, c, false)).join('')}${r.alt.map(x => opt(x, AS_ARCH[x].cols[0], false)).join('')}</div>
    <div class="row-h"><button class="btn primary" id="asToPlan">${AF[asd.fmt].cmd ? 'Escolher o comandante' : 'Ver a composição do deck'}</button></div>
    <div id="asCmd">${asd.cmdOpts ? asCmdHTML() : ''}</div>`;
}
function asCmdHTML(){
  if (!asd.cmdOpts.length) return `<div class="tip">Não encontrei comandantes para essas cores. Escolha outra combinação acima.</div>`;
  return `<span class="q-t">Escolha o comandante</span><div class="as-cmds">${asd.cmdOpts.map(n => `<div class="as-cmd ${asd.cmd===n?'on':''}">${cardHTML(n,{showPt:false})}<button class="btn small ${asd.cmd===n?'primary':''}" data-acmd="${esc(n)}">${asd.cmd===n ? 'Escolhido' : 'Escolher'}</button></div>`).join('')}</div>
    <div class="row-h"><button class="btn primary" id="asToPlan2" ${asd.cmd ? '' : 'disabled'}>Ver a composição do deck</button></div>`;
}
function asS4(){
  const P = asd.plan = asPlan(); const F = AF[asd.fmt];
  const rows = Object.entries(P.roles).sort((a,b)=>b[1]-a[1]).map(([r,n]) => `<tr><td>${ROLE_PT[r]||r}</td><td class="num">${n}</td></tr>`).join('');
  const why = F.size === 100 ? 'Em decks de 100 cartas com 1 de cada, a regra de ouro é: cerca de 37 terrenos, 10 cartas de aceleração, 10 de compra e 8 a 10 remoções. O resto é o plano do comandante.' : `Em 60 cartas, ${P.lands} terrenos combinam com o estilo ${AS_ARCH[asd.choice.arch].n}: decks rápidos usam menos, decks lentos usam mais. ${F.single ? 'Aqui é 1 cópia de cada.' : 'As cartas principais entram com 4 cópias para aparecerem em toda partida.'}`;
  return `<div class="grid g2" style="align-items:start"><div class="stack-v"><p><b>${F.n} · ${AS_ARCH[asd.choice.arch].n} ${asColName(asd.choice.cols)}</b> ${asd.choice.cols.split('').map(manaSym).join('')}${asd.cmd ? `<br><span class="muted">Comandante: ${esc(asd.cmd)}</span>` : ''}</p>
      <p class="muted" style="font-size:.95rem">${why}</p></div>
    <table class="as-tab"><thead><tr><th>Função</th><th class="num">Cartas</th></tr></thead><tbody>${F.cmd ? '<tr><td>Comandante</td><td class="num">1</td></tr>' : ''}${rows}<tr><td>${ROLE_PT.lands}</td><td class="num">${P.lands}</td></tr></tbody><tfoot><tr><td>Total</td><td class="num">${F.size}</td></tr></tfoot></table></div>
    <div class="row-h"><button class="btn primary" id="asGo">Gerar a lista do deck</button><button class="btn" data-ass2="3">Voltar</button></div>`;
}
function wildcards(list){
  const w = {mythic:0, rare:0, uncommon:0, common:0};
  list.forEach(e => { if (BASICS.includes(e.name.toLowerCase())) return; const L = LEG[e.name]; const need = Math.max(0, e.q - owned(e.name)); if (L && w[L.r] != null) w[L.r] += need; });
  return w;
}
function asS5(){
  const r = asd.res, F = AF[asd.fmt]; if (!r) return '';
  const real = {}; r.list.forEach(e => { const k = e.name === r.cmd ? 'cmd' : r.roleOf[e.name] || 'theme'; real[k] = (real[k]||0) + e.q; });
  const comp = `<table class="as-tab"><thead><tr><th>Função</th><th class="num">Meta</th><th class="num">No deck</th></tr></thead><tbody>${Object.entries(asd.plan.roles).map(([k,n]) => `<tr><td>${ROLE_PT[k]||k}</td><td class="num">${n}</td><td class="num">${real[k]||0}</td></tr>`).join('')}<tr><td>Terrenos</td><td class="num">${asd.plan.lands}</td><td class="num">${real.lands||0}</td></tr></tbody></table>`;
  const w = wildcards(r.list);
  const wc = F.arena ? `<div class="as-wc"><span class="muted">${S.acoll && Object.keys(S.acoll).length ? 'Curingas que faltam, descontando a sua coleção do Arena:' : 'Curingas no Arena, se você não tiver nenhuma das cartas (cadastre sua coleção em Arena e coleção):'}</span><div class="row-h">${[['mythic','Míticas'],['rare','Raras'],['uncommon','Incomuns'],['common','Comuns']].map(([k,l]) => `<span class="wc wc-${k}"><b>${w[k]}</b> ${l}</span>`).join('')}</div></div>` : '';
  const extra = `<p class="muted" style="font-size:.9rem">${F.n} · ${AS_ARCH[asd.choice.arch].n} ${asColName(asd.choice.cols)}. Cartas escolhidas entre as mais jogadas para cada função (dados do Scryfall/EDHREC)${F.arena ? ', só as que existem no Arena' : ''}. É um ponto de partida: jogue, observe e ajuste.</p>${wc}<div class="row-h"><button class="btn" id="asTxt">Baixar lista (.txt)</button><button class="btn" id="asCsv">Baixar planilha</button><button class="btn" id="asImprove">Melhorar este deck</button><button class="btn" id="asVar">Gerar outra variação</button><button class="btn" data-ass2="2">Mudar as respostas</button></div><details><summary>Composição do deck: meta e o que entrou</summary>${comp}</details>`;
  const phys = !F.arena ? `<div class="tip af-tip"><b>Este deck é para a mesa física (${F.n}).</b> Ele pode ter cartas que não existem no MTG Arena, e o Arena recusa a lista inteira se houver uma delas. Para jogar no Arena, toque em <b>Converter para o Arena</b>: a Academia troca essas cartas por equivalentes do Arena${F.size === 100 ? ' (no Arena o Commander se chama Brawl)' : ''}.<div class="row-h" style="margin-top:8px"><button class="btn primary small" id="asToArena">Converter para o Arena</button></div></div>` : '';
  let H = resultHTML('asRes', `Seu deck · ${r.list.reduce((a,e)=>a+e.q,0)} cartas`, r.list, r.cmd, phys + extra);
  if (!F.arena) H = H.replace('Lista para importar no MTG Arena', 'Lista do deck (mesa física, Moxfield, Archidekt)').replace('>Copiar para o Arena<', '>Copiar lista<');
  return H
;
}
async function asRun(st){
  asd.busy = true; try { asd.res = await asGenerate(st); asd.step = 5; if (!S.genDone) { S.genDone = true; addXP(30); save(); checkAch && checkAch(); } renderAssist(); window.scrollTo({top: $('#deckBody').offsetTop - 70, behavior:'smooth'}); }
  catch(e) { st(e && e.message === 'vazio' ? 'Não encontrei cartas suficientes com essas escolhas. Tente outras cores, outro tema ou "Tanto faz" no gasto.' : 'Não foi possível consultar o Scryfall agora. Confira a internet e tente de novo.'); }
  asd.busy = false;
}
function bindAssist(){
  const st = m => { const e = $('#asSt'); if (e) e.textContent = m; };
  $$('[data-ass2]').forEach(b => b.onclick = () => { asd.step = +b.dataset.ass2; renderAssist(); });
  $$('[data-af]').forEach(b => b.onclick = () => { asd.fmt = b.dataset.af; asd.cmd = null; asd.cmdOpts = null; asd.res = null; asd.choice = null; asd.step = 2; renderAssist(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); });
  $$('[data-aq]').forEach(b => b.onclick = () => { asd.a[b.dataset.aq] = b.dataset.av; asd.choice = null; renderAssist(); const el = $(`[data-aq="${b.dataset.aq}"][data-av="${b.dataset.av}"]`); if (el) el.focus({preventScroll:true}); });
  $$('[data-atr]').forEach(b => b.onclick = () => { asd.a.tribe = b.dataset.atr; asd.choice = null; renderAssist(); });
  $$('[data-acol]').forEach(b => b.onclick = () => { const c = b.dataset.acol, P = asd.colsPick || []; asd.colsPick = (P.includes(c) ? P.filter(x=>x!==c) : [...P, c]).sort((x,y)=>'wubrg'.indexOf(x)-'wubrg'.indexOf(y)); asd.choice = null; renderAssist(); });
  const tr = $('#asToRec'); if (tr) tr.onclick = () => { asd.choice = null; asd.cmd = null; asd.cmdOpts = null; asd.step = 3; renderAssist(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); };
  $$('[data-arch]').forEach(b => b.onclick = () => { asd.choice = {arch:b.dataset.arch, cols:b.dataset.cols}; asd.cmd = null; asd.cmdOpts = null; renderAssist(); });
  const tp = $('#asToPlan'); if (tp) tp.onclick = async () => {
    if (!AF[asd.fmt].cmd) { asd.step = 4; renderAssist(); return; }
    tp.disabled = true; try { asd.cmdOpts = await asCommanders(st); st(''); } catch(e) { st('Não foi possível consultar o Scryfall agora.'); }
    tp.disabled = false; const box = $('#asCmd'); if (box && asd.cmdOpts) { box.innerHTML = asCmdHTML(); bindAssist(); box.scrollIntoView({behavior:'smooth', block:'start'}); } };
  $$('[data-acmd]').forEach(b => b.onclick = () => { asd.cmd = b.dataset.acmd; const box = $('#asCmd'); box.innerHTML = asCmdHTML(); bindAssist(); });
  const tp2 = $('#asToPlan2'); if (tp2) tp2.onclick = () => { asd.step = 4; renderAssist(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); };
  const go = $('#asGo'); if (go) go.onclick = () => { if (asd.busy) return; go.disabled = true; asd.vari = 0; asRun(st).then(() => { const g = $('#asGo'); if (g) g.disabled = false; }); };
  if (asd.step === 5 && asd.res) {
    const r = asd.res, F = AF[asd.fmt];
    bindResult('asRes', r.list, r.cmd, F.arena ? asd.fmt : (F.size === 100 ? 'brawl' : 'standard'));
    if (!F.arena) { const c = $('[data-copy="asRes"]'); if (c) c.onclick = () => { copyText(arenaList(r.list, r.cmd), $('#asResTxt')); toast('Lista copiada (versão para a mesa física).'); }; const ta = $('#asToArena'); if (ta) ta.onclick = () => copyForArena(r.list, r.cmd); }
    const C = {cmd: r.cmd ? [{name:r.cmd, q:1}] : [], comp:[], side:[], main: r.list.filter(e => e.name !== r.cmd)};
    $('#asTxt').onclick = () => downloadFile('deck_academia.txt', arenaList(r.list, r.cmd), 'text/plain;charset=utf-8');
    $('#asCsv').onclick = () => downloadFile('deck_academia.csv', sheetCSV(C), 'text/csv;charset=utf-8');
    $('#asVar').onclick = () => { if (asd.busy) return; asd.vari++; asRun(st); };
    $('#asImprove').onclick = () => { ent.txt = arenaList(r.list, r.cmd); ent.cmd = r.cmd || ''; opt.res = null; ow.sugg = null; opt.fmt = F.arena ? asd.fmt : (F.size === 100 ? 'brawl' : 'standard'); deckTab = 'otimizar'; ow.step = 1; RENDER.decks(); entAnalyze().then(() => { if (deckTab === 'otimizar') { ow.step = ent.A ? 2 : 1; renderOptFlow(); } }); window.scrollTo({top:0}); };
  }
}
