/* ================= ENTENDA SEU DECK ================= */
const ROLE = [
 ['ramp','Aceleração de mana',/add \{|adicione \{|adicione um mana|search your library for (a|up to two) basic land|(busque|procure).*terreno|\btreasure\b|tesouro/i,'Gera mana extra ou busca terrenos para jogar suas cartas mais cedo.',[0,4],[8,12]],
 ['draw','Compra de cards',/draws? (a|one|two|three|x|that many) cards?|compre (um|dois|três) cards?|draw cards equal/i,'Mantém sua mão cheia para não ficar sem opções.',[2,6],[8,12]],
 ['rem','Remoção pontual',/destroy target|exile target|destrua a (criatura|permanente)|devolva a criatura alvo|deals? \d+ damage to (any target|target creature)|dano a qualquer alvo|target creature gets -|fights? target/i,'Tira do jogo uma ameaça específica do oponente.',[4,10],[8,12]],
 ['wipe','Remoção em massa',/destroy all creatures|exile all creatures|destrua todas as criaturas|damage to each creature|each creature gets -|all creatures get -/i,'Limpa a mesa quando o oponente sai na frente.',[0,3],[2,4]],
 ['counter','Anulação',/counter target|anule a mágica/i,'Impede que uma mágica do oponente aconteça.',[0,8],[0,8]],
 ['prot','Proteção',/hexproof|indestructible|resistência a magia|indestrutível|protection from|proteção contra/i,'Protege suas peças importantes de remoção.',[0,4],[2,5]],
 ['tutor','Busca (tutor)',/search your library for an? (card|creature|instant|sorcery|artifact|enchantment|goblin|elf)|busque.*(um|uma) card de/i,'Busca a carta certa no grimório.',[0,3],[0,5]],
 ['tok','Fichas',/create[^.]*token|crie[^.]*ficha/i,'Cria criaturas extras sem gastar cards.',[0,99],[0,99]],
 ['trick','Truque de combate',/gets \+\d+\/\+\d+ until end of turn|recebe \+\d+\/\+\d+ até o final do turno/i,'Vence combates de surpresa.',[0,6],[0,4]]
];
const COMBOS = [
 [['Splinter Twin','Deceiver Exarch'],'Infinitas cópias de Deceiver Exarch com ímpeto','A cópia desvira o Exarch, que cria outra cópia, e assim por diante.'],
 [['Splinter Twin','Pestermite'],'Infinitas cópias de Pestermite com ímpeto','Mesma lógica do Exarch: cada cópia desvira a criatura encantada.'],
 [['Kiki-Jiki, Mirror Breaker','Zealous Conscripts'],'Infinitas cópias com ímpeto','A cópia dos Conscripts desvira Kiki-Jiki, que copia de novo.'],
 [['Kiki-Jiki, Mirror Breaker','Deceiver Exarch'],'Infinitas cópias com ímpeto','O Exarch copiado desvira Kiki-Jiki.'],
 [['Kiki-Jiki, Mirror Breaker','Pestermite'],'Infinitas cópias com ímpeto','A Pestermite copiada desvira Kiki-Jiki.'],
 [['Kiki-Jiki, Mirror Breaker','Restoration Angel'],'Infinitas cópias com ímpeto','A Angel copiada pisca Kiki-Jiki, que volta desvirado.'],
 [['Exquisite Blood','Sanguine Bond'],'Drena infinita: vitória','Perder vida faz você ganhar vida, que faz o oponente perder vida, em ciclo.'],
 [['Heliod, Sun-Crowned','Walking Ballista'],'Dano infinito','Cada ponto de dano do Ballista ganha vida, que coloca outro marcador nele (precisa dar vínculo com a vida ao Ballista com {1}{W}).'],
 [['Thassa\'s Oracle','Demonic Consultation'],'Vitória instantânea','Consultation exila o grimório inteiro e a Oracle vence com o grimório vazio.'],
 [['Thassa\'s Oracle','Tainted Pact'],'Vitória instantânea','Pact exila o grimório e a Oracle vence ao entrar.'],
 [['Isochron Scepter','Dramatic Reversal'],'Mana infinita (com artefatos que geram 3+ mana)','O Scepter conjura Reversal toda vez, desvirando seus artefatos de mana.'],
 [['Basalt Monolith','Rings of Brighthearth'],'Mana incolor infinita','Os Rings copiam a habilidade de desvirar do Monolith.'],
 [['Basalt Monolith','Power Artifact'],'Mana incolor infinita','Power Artifact reduz o custo para desvirar o Monolith.'],
 [['Grim Monolith','Power Artifact'],'Mana incolor infinita','O custo para desvirar fica menor que a mana gerada.'],
 [['Mikaeus, the Unhallowed','Triskelion'],'Dano infinito','Triskelion remove marcadores para causar dano, morre e volta com Mikaeus, de novo e de novo.'],
 [['Peregrine Drake','Deadeye Navigator'],'Mana infinita','O Navigator pisca o Drake, que desvira cinco terrenos a cada vez.'],
 [['Niv-Mizzet, Parun','Curiosity'],'Dano infinito','Cada card comprado causa dano, que compra outro card.'],
 [['Niv-Mizzet, the Firemind','Curiosity'],'Dano infinito','Cada card comprado causa dano, que compra outro card.'],
 [['Animate Dead','Worldgorger Dragon'],'Ciclo infinito (mana e gatilhos)','O dragão exila suas permanentes e as devolve, reativando Animate Dead.'],
 [['Food Chain','Eternal Scourge'],'Mana infinita para criaturas','Exile o Scourge com Food Chain e conjure-o de novo do exílio, ganhando mana a cada vez.'],
 [['Food Chain','Squee, the Immortal'],'Mana infinita para criaturas','Squee pode ser conjurado do exílio repetidamente.'],
 [['Devoted Druid','Vizier of Remedies'],'Mana verde infinita','O Vizier impede o marcador −1/−1 do Druid, que desvira sem limite.'],
 [['Saheeli Rai','Felidar Guardian'],'Infinitas fichas de Felidar com ímpeto','O Guardian pisca Saheeli, que copia o Guardian, e repete.'],
 [['Bloodchief Ascension','Mindcrank'],'Drena infinita','Cada perda de vida faz o oponente moer, que faz ele perder vida.'],
 [['Sword of the Meek','Thopter Foundry'],'Fichas e vida em quantidade','A Sword volta sempre que um Thopter entra.'],
 [['Dualcaster Mage','Twinflame'],'Infinitas cópias com ímpeto','O Mage copia Twinflame mirando a própria cópia.'],
 [['Godo, Bandit Warlord','Helm of the Host'],'Combates infinitos','A cópia de Godo com ímpeto busca e equipa o Helm, gerando novos combates.'],
 [['Aggravated Assault','Sword of Feast and Famine'],'Combates infinitos','A Sword desvira seus terrenos, que pagam a próxima fase de combate.'],
 [['Krenko, Mob Boss','Thornbite Staff'],'Fichas infinitas (com um sacrifício)','Com uma forma de sacrificar Goblins, cada morte desvira Krenko.'],
 [['Ashnod\'s Altar','Nim Deathmantle'],'Loop de criatura (precisa de uma criatura com gatilho ao entrar)','O Altar paga o Deathmantle, que devolve a criatura sacrificada.'],
 [['Goblin Chieftain','Krenko, Mob Boss'],'Exército no mesmo turno (não infinito)','Chieftain dá ímpeto: Krenko vira no turno em que entra e as fichas já atacam.'],
 [['Impact Tremors','Krenko, Mob Boss'],'Dano em massa (não infinito)','Cada Goblin criado pelo Krenko causa 1 de dano a cada oponente.'],
 [['Overrun','Elvish Promenade'],'Golpe final com Elfos (não infinito)','Dobre seus Elfos e dê +3/+3 e atropelar a todos.']
];
const SYN = [
 {k:'tokens', t:'Fichas', test:A=>A.role.tok.length>=5, pay:/creatures you control get \+|criaturas que você controla recebem \+|sacrifice a creature|sacrifique uma criatura|whenever a creature (you control )?enters|sempre que uma criatura entra/i, d:'Seu deck cria muitas criaturas pequenas.', tip:'Cartas que dão +1/+1 a todas as criaturas ou que aproveitam sacrifícios transformam fichas em vitória.'},
 {k:'aristo', t:'Sacrifício', test:A=>A.find(/sacrifice (a|another) creature|sacrifique (uma|outra) criatura/i).length>=2, pay:/whenever (a|another) creature you control dies|sempre que (uma|outra) criatura (que você controla )?morre/i, d:'Você tem formas de sacrificar criaturas.', tip:'Junte "sacrificar" com cartas que fazem algo quando suas criaturas morrem: cada sacrifício vira vantagem.'},
 {k:'life', t:'Ganho de vida', test:A=>A.find(/lifelink|vínculo com a vida|gain \d+ life|ganhe \d+ de vida|you gain life/i).length>=5, pay:/whenever you gain life|sempre que você ganha vida/i, d:'Seu deck ganha vida com frequência.', tip:'Cartas que disparam "sempre que você ganha vida" multiplicam esse recurso.'},
 {k:'counters', t:'Marcadores +1/+1', test:A=>A.find(/\+1\/\+1 counter|marcador \+1\/\+1/i).length>=6, pay:/proliferate|prolifere|double the number of|dobre/i, d:'Suas criaturas crescem com marcadores.', tip:'Proliferar e dobrar marcadores aceleram muito esse plano.'},
 {k:'spells', t:'Mágicas', test:A=>(A.kind.instant||0)+(A.kind.sorcery||0)>=15, pay:/prowess|destreza|magecraft|whenever you cast (an|a) (instant|noncreature)|sempre que você conjura uma mágica (instantânea|que não)/i, d:'Muitos instantâneos e feitiços.', tip:'Criaturas com destreza ou que reagem a mágicas aproveitam cada carta barata.'},
 {k:'grave', t:'Cemitério', test:A=>A.find(/from your graveyard|do seu cemitério/i).length>=4, pay:/mill|put the top .* into your graveyard|coloque os .* cards do topo .* cemitério|surveil|vigiar/i, d:'Você reaproveita cartas do cemitério.', tip:'Encher o próprio cemitério (moer, vigiar) alimenta esse plano.'},
 {k:'land', t:'Terrenos (landfall)', test:A=>A.find(/landfall|terraformação|whenever a land enters/i).length>=3, pay:/you may play an additional land|jogar um terreno adicional|search your library for (a|up to two) basic land/i, d:'Seu deck ganha valor quando terrenos entram.', tip:'Terrenos extras por turno e busca de terrenos disparam esses efeitos várias vezes.'},
 {k:'voltron', t:'Voltron (equipamentos e auras)', test:A=>A.find(/equip|equipar|enchant creature|encantar criatura/i).length>=6, pay:/hexproof|resistência a magia|double strike|golpe duplo/i, d:'Você fortalece uma criatura com equipamentos e auras.', tip:'Proteja a criatura principal: perdê-la custa vários cards de uma vez.'},
 {k:'fly', t:'Ataque aéreo', test:A=>A.flyers>=8, pay:/creatures you control with flying|criaturas com voar que você controla/i, d:'Muitos voadores.', tip:'Oponentes com poucas criaturas de alcance ou voar não conseguem bloquear: pressione cedo.'},
 {k:'arts', t:'Artefatos', test:A=>(A.kind.artifact||0)>=15, pay:/whenever an artifact|sempre que um artefato|affinity|afinidade|improvise|improvisar/i, d:'Muitos artefatos.', tip:'Cartas de afinidade e improvisar ficam muito mais baratas.'},
 {k:'ench', t:'Encantamentos', test:A=>(A.kind.enchantment||0)>=12, pay:/whenever you cast an enchantment|sempre que você conjura um encantamento|constellation|constelação/i, d:'Muitos encantamentos.', tip:'Cartas como Sythis, Harvest\'s Hand compram um card a cada encantamento.'}
];
let ent = {txt:'', fmt:'auto', cmd:'', A:null, status:'', spell:null};
const typesOf = d => { const t = (d && d.t) || ''; const m = t.split(/[—–-]\s*/)[1]; return m ? m.split(/\s+/).filter(w => w.length > 2) : []; };
async function resolvePT(names, st){
  const map = {};
  for (const n of names) {
    st && st(`Procurando "${n}" em português…`);
    try {
      const r = await fetch(`https://api.scryfall.com/cards/search?include_multilingual=true&unique=prints&q=${encodeURIComponent(`lang:pt "${n}"`)}`, {headers:{'Accept':'application/json'}});
      if (r.ok) { const j = await r.json(); const hit = j.data.find(c => (c.printed_name||'').toLowerCase() === n.toLowerCase()) || j.data[0]; if (hit) map[n] = hit.name; }
    } catch(e) {}
    await new Promise(res => setTimeout(res, 120));
  }
  return map;
}
async function entAnalyze(){
  const st = m => { ent.status = m; const e = $('#entSt'); if (e) e.textContent = m; };
  const raw = ent.txt;
  // comandante: seção "Commander" do Arena ou campo preenchido
  let cmd = ent.cmd.trim();
  const lines = raw.split(/\r?\n/); for (let i=0;i<lines.length;i++) if (/^\s*(commander|comandante)\s*$/i.test(lines[i])) { const m = (lines[i+1]||'').match(/^\s*\d*\s*x?\s*(.+?)(\s+\([A-Z0-9]{2,6}\).*)?$/i); if (m && !cmd) cmd = m[1].trim(); }
  let entries = parseDeck(raw);
  if (!entries.length) { st('Cole uma lista primeiro, uma carta por linha.'); return; }
  st('Buscando as cartas…');
  const r = await resolveCards(entries.map(e=>e.name), st);
  // nomes em português (cartas físicas)
  const miss = entries.filter(e => !cardData(e.name) && !BASICS.includes(e.name.toLowerCase())).map(e=>e.name);
  if (miss.length && !r.offline) { const pt = await resolvePT(miss.slice(0, 40), st); const en = Object.values(pt); if (en.length) { await resolveCards(en, st); entries = entries.map(e => pt[e.name] ? {...e, name:pt[e.name], pt:e.name} : e); } }
  if (cmd) { const ce = entries.find(e => e.name.toLowerCase() === cmd.toLowerCase()); if (!ce) { await resolveCards([cmd], st); entries.unshift({name:cmd, q:1}); } }
  const tot = entries.reduce((a,e)=>a+e.q,0);
  const fmt = ent.fmt !== 'auto' ? ent.fmt : tot >= 95 ? '100' : tot <= 45 ? '40' : '60';
  if (fmt === '100' && !cmd) { const c = entries.find(e => { const d = cardData(e.name); return d && d.k==='creature' && /Lend|Legend/.test(d.t); }); if (c) cmd = CARD_ALIAS[c.name.toLowerCase()] || c.name; }
  const R = analyze(entries);
  const cards = R.entries.filter(e => e.d);
  const txtOf = e => ((e.d.x||'') + ' ' + (e.d.t||''));
  const A = {R, fmt, cmd, tot, unknown:R.unknown, pt:entries.filter(e=>e.pt), kind:R.kinds, role:{}, flyers:0,
    find: re => cards.filter(e => e.k !== 'land' && re.test(txtOf(e)))};
  ROLE.forEach(([k,,re]) => A.role[k] = cards.filter(e => e.k !== 'land' && re.test(txtOf(e)) && !(k==='ramp' && e.k==='land')));
  A.flyers = cards.filter(e => e.k==='creature' && /\bvoar\b|flying/i.test(txtOf(e))).reduce((a,e)=>a+e.q,0);
  // tribos
  const tc = {}; cards.forEach(e => { if (e.k !== 'creature') return; typesOf(e.d).forEach(t => tc[t] = (tc[t]||0) + e.q); });
  const tribe = Object.entries(tc).filter(([t]) => !/Humano|Human|Soldado|Soldier|Guerreiro|Warrior|Mago|Wizard|Lendária|Legendary/.test(t)).sort((a,b)=>b[1]-a[1])[0];
  A.tribe = tribe && tribe[1] >= 8 ? tribe : null;
  // estilo
  const cr = R.kinds.creature||0, spells = (R.kinds.instant||0)+(R.kinds.sorcery||0), q = arr => arr.reduce((a,e)=>a+e.q,0);
  A.arch = fmt === '100' ? 'Commander' : cr >= 20 && R.avg <= 2.5 ? 'Aggro' : q(A.role.counter) + q(A.role.rem) + q(A.role.wipe) >= 12 && cr <= 12 ? 'Controle' : q(A.role.ramp) >= 7 && R.curve.slice(5).reduce((a,c)=>a+c.cr+c.ot,0) >= 5 ? 'Ramp' : spells >= 18 ? 'Tempo / Mágicas' : 'Midrange';
  const cols = Object.entries(R.pips).filter(([,v])=>v).sort((a,b)=>b[1]-a[1]).map(([c])=>c);
  A.cols = cols; const pair = cols.length === 2 ? (GUILD_OF[cols.join('')] || GUILD_OF[cols.slice().reverse().join('')]) : null; A.guild = pair;
  // sinergias e combos
  A.syn = SYN.filter(s => s.test(A)).map(s => ({...s, payoffs: A.find(s.pay)}));
  if (A.tribe) { const re = new RegExp(A.tribe[0].replace(/s$/,''), 'i'); A.syn.unshift({k:'tribal', t:`Tribal: ${A.tribe[0]}`, d:`${A.tribe[1]} criaturas do tipo ${A.tribe[0]}.`, tip:'Cartas que fortalecem todas as criaturas desse tipo ("senhores") são o coração do deck. Proteja-as.', payoffs: cards.filter(e => e.k!=='land' && re.test(e.d.x||'') )}); }
  const have = new Set(entries.map(e => e.name.toLowerCase()));
  A.combos = COMBOS.filter(c => c[0].every(n => have.has(n.toLowerCase())));
  A.almost = COMBOS.filter(c => c[0].filter(n => have.has(n.toLowerCase())).length === c[0].length - 1 && c[0].length >= 2).slice(0, 6);
  ent.A = A; ent.spell = null; st('Análise pronta.');
  if (!S.entDone) { S.entDone = true; addXP(40); save(); checkAch(); }
  drawEnt();
  // combos do Commander Spellbook (se a internet permitir)
  try {
    const body = {main: entries.filter(e => e.name.toLowerCase() !== (cmd||'').toLowerCase()).map(e => ({card: e.name, quantity: e.q})), commanders: cmd ? [{card: cmd, quantity:1}] : []};
    const rs = await fetch('https://backend.commanderspellbook.com/find-my-combos', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(body)});
    if (rs.ok) { const j = await rs.json(); const res = j.results || j; const inc = res.included || []; const al = res.almostIncluded || [];
      ent.spell = {inc: inc.slice(0, 12).map(v => ({cards:(v.uses||[]).map(u => u.card && u.card.name).filter(Boolean), res:(v.produces||[]).map(p => p.feature && p.feature.name).filter(Boolean).slice(0,3), id:v.id})), almost: al.length};
      drawEnt(); }
  } catch(e) {}
}
function renderEntenda(){
  if (!ent.txt) ent.txt = deckText;
  $('#deckBody').innerHTML = `
   <div class="panel stack-v"><h3>Entenda seu deck</h3>
     <p class="muted">Importe seu deck do MTG Arena, de sites como Moxfield, ou digite as cartas do seu deck físico, uma por linha. A ferramenta explica o papel de cada carta, o estilo do deck, as sinergias, os combos e como jogar com ele.</p>
     <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));align-items:start">
       <label class="f" for="entTxt">Lista do deck<textarea id="entTxt" rows="12" spellcheck="false" placeholder="Arena: Decks → Exportar e cole aqui&#10;Físico: 4 Lightning Bolt (ou 4 Relâmpago)">${esc(ent.txt)}</textarea></label>
       <div class="stack-v">
         <label class="f" for="entFile">Ou envie um arquivo (.txt ou .dek)<input type="file" id="entFile" accept=".txt,.dek,.csv,text/plain"></label>
         <label class="f" for="entFmt">Formato<select id="entFmt"><option value="auto">Detectar automaticamente</option><option value="60">Construído (60)</option><option value="100">Commander (100)</option><option value="40">Limitado (40)</option></select></label>
         <label class="f" for="entCmd">Comandante (opcional)<input type="text" id="entCmd" value="${esc(ent.cmd)}" placeholder="Detecto sozinho se a lista vier do Arena"></label>
         <div class="tip" style="font-size:.88rem"><b>Cartas físicas em português:</b> pode digitar os nomes em português. Eu procuro a carta equivalente em inglês no Scryfall. Se algum nome não for encontrado, confira a grafia.</div>
         <div class="row-h"><button class="btn primary" id="entGo">Analisar</button><button class="btn" id="entUse">Usar a lista do Analisador</button></div>
         <p class="muted" id="entSt" style="font-size:.88rem">${esc(ent.status)}</p>
       </div>
     </div></div>
   <div id="entOut" style="margin-top:14px"></div>`;
  $('#entFmt').value = ent.fmt;
  $('#entTxt').oninput = e => ent.txt = e.target.value;
  $('#entCmd').oninput = e => ent.cmd = e.target.value;
  $('#entFmt').onchange = e => ent.fmt = e.target.value;
  $('#entUse').onclick = () => { ent.txt = deckText; $('#entTxt').value = ent.txt; };
  $('#entFile').onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { ent.txt = String(rd.result).replace(/^﻿/, ''); if (/\.csv$/i.test(f.name)) ent.txt = ent.txt.split(/\r?\n/).map(l => { const c = l.split(/[;,]/); return /^\d+$/.test((c[0]||'').trim()) ? `${c[0].trim()} ${(c[1]||'').replace(/"/g,'').trim()}` : l; }).join('\n'); $('#entTxt').value = ent.txt; toast('Arquivo carregado. Toque em Analisar.'); }; rd.readAsText(f); };
  $('#entGo').onclick = async () => { $('#entGo').disabled = true; try { await entAnalyze(); } finally { const b = $('#entGo'); if (b) b.disabled = false; } };
  if (ent.A) drawEnt();
}
function drawEnt(){
  const out = $('#entOut'); if (!out || !ent.A) return; const A = ent.A, R = A.R;
  const q = arr => arr.reduce((a,e)=>a+e.q,0), big = A.fmt === '100';
  const colName = {W:'branco',U:'azul',B:'preto',R:'vermelho',G:'verde'};
  const plan = {Aggro:'Jogue criaturas baratas desde o primeiro turno e ataque sempre. Use remoção para tirar bloqueadores do caminho e termine com dano direto ou criaturas evasivas.',
    Controle:'Segure o jogo com remoção e anulações, compre cards e vença tarde com poucas ameaças difíceis de responder. Paciência: não gaste respostas em ameaças pequenas.',
    Ramp:'Use os primeiros turnos para acelerar a mana. A partir do turno 4 ou 5, jogue ameaças grandes antes do oponente estar pronto para elas.',
    'Tempo / Mágicas':'Jogue ameaças baratas e use mágicas eficientes para manter o oponente sem tempo de reagir. Cada mágica conta: escolha bem o momento.',
    Midrange:'Troque recursos com o oponente usando remoção e criaturas eficientes. Adapte-se: contra decks rápidos, defenda; contra decks lentos, pressione.',
    Commander:'Jogue terrenos e aceleração cedo, coloque o comandante em campo quando ele estiver protegido ou fizer diferença, e guarde remoção para a ameaça que pode vencer a mesa.'}[A.arch];
  const roleRows = ROLE.map(([k,name,,desc,r60,r100]) => { const n = q(A.role[k]); const [lo,hi] = big ? r100 : r60; const st = n < lo ? 'warn' : n > hi ? 'warn' : 'good';
    return `<details class="sec"><summary><span>${name} <span class="pill ${st}">${n}</span></span></summary><div class="sec-body"><p class="muted">${desc} Referência para ${big?'Commander':'decks de 60'}: ${lo}${hi<99?' a '+hi:'+'}.</p><p>${A.role[k].map(e=>`${e.q>1?e.q+'× ':''}${cr(e.name)}`).join(', ') || '<span class="muted">nenhuma</span>'}</p></div></details>`; }).join('');
  const tips = [];
  const lands = R.lands, rec = recLands(A.fmt === '100' ? '100' : A.fmt === '40' ? '40' : '60', R.avg);
  if (Math.abs(lands - rec) > 1) tips.push(lands < rec ? `Você tem ${lands} terrenos; o ideal para este custo médio seria cerca de ${rec}. Considere mais terrenos ou mais aceleração barata.` : `Você tem ${lands} terrenos, acima dos ${rec} sugeridos. Trocar 1 ou 2 por mágicas reduz as mãos "só de terreno".`);
  if (q(A.role.rem) + q(A.role.wipe) + q(A.role.counter) < (big ? 8 : 5)) tips.push('Pouca interação: inclua mais remoção para responder às ameaças do oponente.');
  if (big && q(A.role.ramp) < 8) tips.push('Commander é um jogo longo: 8 a 12 cartas de aceleração ajudam a jogar suas melhores cartas a tempo.');
  if (big && q(A.role.draw) < 8) tips.push('Em Commander, menos de 8 cartas de compra deixam você sem cards no meio do jogo.');
  if (R.curve.slice(0,3).reduce((a,c)=>a+c.cr+c.ot,0) < (big ? 12 : 10)) tips.push('Poucas jogadas de custo 1 e 2: nos primeiros turnos você pode ficar sem o que fazer.');
  const cmdD = A.cmd && cardData(A.cmd);
  out.innerHTML = `
   <div class="grid g2" style="align-items:start">
     <div class="panel stack-v"><span class="eyebrow">Resumo</span><h2>${A.arch}${A.guild?` · ${A.guild}`:''}</h2>
       <div class="row-h">${A.cols.map(manaSym).join('')} <span class="muted">${A.cols.map(c=>colName[c]).join(' e ')||'incolor'} · ${A.tot} cards · custo médio ${R.avg.toFixed(2)} · ${R.lands} terrenos</span></div>
       <p><b>Plano de jogo:</b> ${plan}</p>
       ${A.pt.length?`<p class="muted" style="font-size:.88rem">Nomes em português reconhecidos: ${A.pt.map(e=>`${esc(e.pt)} → ${esc(e.name)}`).join(', ')}.</p>`:''}
       ${A.unknown.length?`<p class="muted" style="font-size:.88rem">Não reconhecidas: ${A.unknown.map(esc).join(', ')}. Confira a grafia.</p>`:''}
     </div>
     ${cmdD ? `<div class="panel row-h" style="align-items:flex-start">${cardHTML(A.cmd,{showPt:false})}<div class="stack-v" style="flex:1;min-width:180px;gap:6px"><span class="eyebrow">Comandante</span><b style="font-family:var(--f-display);font-size:1.2rem">${esc(A.cmd)}</b><p style="font-size:.92rem">${mana(esc(cmdD.x||''))}</p><div class="row-h">${ext(edh(A.cmd),'EDHREC')}</div></div></div>` :
       `<div class="panel chart"><h3>Curva de mana</h3>${curveSVG(R.curve)}</div>`}
   </div>
   <div class="sub-h"><h2>O papel de cada carta</h2><p>Toque numa função para ver as cartas. Verde: quantidade boa. Amarelo: abaixo ou acima do recomendado.</p></div>
   <div>${roleRows}</div>
   <div class="sub-h"><h2>Sinergias encontradas</h2><p>Grupos de cartas que funcionam melhor juntas.</p></div>
   ${A.syn.length ? `<div class="grid g2">${A.syn.map(s=>`<div class="panel stack-v"><h3>${s.t}</h3><p>${s.d}</p>${s.payoffs && s.payoffs.length?`<p style="font-size:.92rem"><b>Cartas que aproveitam:</b> ${s.payoffs.slice(0,8).map(e=>cr(e.name)).join(', ')}</p>`:''}<div class="tip" style="font-size:.9rem">${s.tip}</div></div>`).join('')}</div>` : '<div class="panel"><p class="muted">Nenhuma sinergia forte detectada. Decks com um tema claro (uma tribo, fichas, mágicas) costumam ser mais consistentes.</p></div>'}
   <div class="sub-h"><h2>Combos</h2><p>Combinações conhecidas entre cartas do seu deck.</p></div>
   <div class="stack-v">
     ${A.combos.length ? A.combos.map(c=>`<div class="panel"><div class="row-h" style="gap:8px">${c[0].map(n=>cardHTML(n,{cls:'mini',showPt:false})).join('<span class="mono" style="font-size:1.4rem">+</span>')}</div><p style="margin-top:8px"><b>${c[1]}.</b> ${c[2]}</p></div>`).join('') : '<div class="panel"><p class="muted">Nenhum combo da lista da Academia está completo no seu deck.</p></div>'}
     ${A.almost.length ? `<div class="panel"><h3>Falta uma peça</h3>${A.almost.map(c=>`<p style="margin-top:6px">${c[0].map(n=>A.R.entries.some(e=>e.name.toLowerCase()===n.toLowerCase())?`<b>${cr(n)}</b>`:`<span class="pill warn">falta</span> ${cr(n)}`).join(' + ')}: ${c[1]}.</p>`).join('')}</div>` : ''}
     ${ent.spell ? `<div class="panel stack-v"><h3>Commander Spellbook</h3>${ent.spell.inc.length ? ent.spell.inc.map(v=>`<p>${v.cards.map(n=>cr(n)).join(' + ')}${v.res.length?` → <b>${v.res.map(esc).join(', ')}</b>`:''}${v.id?` · ${ext('https://commanderspellbook.com/combo/'+v.id+'/','detalhes')}`:''}</p>`).join('') : '<p class="muted">Nenhum combo completo encontrado na base do Commander Spellbook.</p>'}${ent.spell.almost?`<p class="muted" style="font-size:.88rem">Há ${ent.spell.almost} combo(s) a uma carta de distância. Veja a lista completa no site.</p>`:''}</div>` : ''}
     <p class="muted" style="font-size:.88rem">Para uma busca completa de combos, cole sua lista em ${ext('https://commanderspellbook.com/find-my-combos/','Commander Spellbook: Find My Combos')}. Em Commander, combos que vencem na hora contam para o bracket: avise a mesa.</p>
   </div>
   <div class="sub-h"><h2>Como jogar com este deck</h2></div>
   <ol class="how">
     <li><div><h3>Mão inicial</h3><p>Mantenha mãos com ${A.fmt==='100'?'3 a 5':'2 a 4'} terrenos e pelo menos uma jogada de custo até 2${A.arch==='Aggro'?'; com aggro, prefira mãos com 2 ou 3 criaturas baratas':A.arch==='Ramp'?'; com ramp, uma carta de aceleração na mão vale muito':''}. Teste na aba Mão inicial.</p></div></li>
     <li><div><h3>Primeiros turnos</h3><p>${A.arch==='Aggro'?'Jogue uma criatura por turno e ataque. Cada ponto de dano cedo conta.':A.arch==='Controle'?'Jogue terrenos e segure mana aberta para responder. Use compra de cards quando sobrar mana no fim do turno do oponente.':A.arch==='Ramp'||A.arch==='Commander'?'Priorize terrenos e aceleração de mana. Não gaste recursos em trocas pequenas.':'Desenvolva o campo com criaturas eficientes e guarde remoção para a primeira ameaça real.'}</p></div></li>
     <li><div><h3>Meio do jogo</h3><p>${A.syn.length?`Monte sua sinergia principal (${A.syn[0].t.toLowerCase()}) antes de se expor.`:'Use cada carta pelo melhor valor possível.'} ${q(A.role.rem)?`Guarde ${A.role.rem[0].name} e as outras remoções para ameaças que vencem o jogo.`:''}</p></div></li>
     <li><div><h3>Como vencer</h3><p>${A.combos.length?`Seu deck tem combo: ${A.combos[0][0].join(' + ')}. Busque as peças e proteja-as.`:R.entries.filter(e=>e.k==='creature' && e.d && e.d.cmc>=5).length?`Suas ameaças grandes, como ${R.entries.filter(e=>e.k==='creature' && e.d && e.d.cmc>=5).slice(0,2).map(e=>e.name).join(' e ')}, fecham o jogo.`:'Vence pela pressão constante: mantenha o oponente reagindo.'}</p></div></li>
   </ol>
   ${tips.length?`<div class="sub-h"><h2>Pontos de atenção</h2></div><div class="panel"><ul class="checks">${tips.map(t=>`<li><span class="pill warn">dica</span><span>${t}</span></li>`).join('')}</ul></div>`:''}
   <div class="row-h" style="margin-top:14px"><button class="btn" id="entToAn">Abrir no Analisador</button><button class="btn" id="entToSim">Simular este deck</button><button class="btn" id="entToArena">Levar ao Arena</button></div>`;
  const send = () => { deckText = ent.txt; deckFormat = A.fmt === '100' ? '100' : A.fmt === '40' ? '40' : '60'; DECK = null; hand = null; };
  $('#entToAn').onclick = () => { send(); deckTab = 'analise'; RENDER.decks(); };
  $('#entToSim').onclick = () => { send(); simSel = 'mine'; trTab = 'sim'; show('treino'); };
  $('#entToArena').onclick = () => { send(); deckTab = 'arena'; RENDER.decks(); };
}
