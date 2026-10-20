/* ================= CENTRAL DE IMPORTAÇÃO =================
   Lê listas do MTG Arena (em português ou inglês), de sites, do MTGO (.dek),
   de planilhas (Excel, CSV) e listas digitadas, e transforma tudo numa lista
   com os nomes oficiais em inglês, que as outras ferramentas entendem. */
const ARENA_SET = {dar:'dom', con:'con', ana:'ana', anb:'anb'};
const PT_BASIC = {'planície':'Plains','planicie':'Plains','ilha':'Island','pântano':'Swamp','pantano':'Swamp','montanha':'Mountain','floresta':'Forest','ermos':'Wastes','descampado':'Wastes',
  'planície nevada':'Snow-Covered Plains','ilha nevada':'Snow-Covered Island','pântano nevado':'Snow-Covered Swamp','montanha nevada':'Snow-Covered Mountain','floresta nevada':'Snow-Covered Forest'};
const PTMAPKEY = 'academiaPlaneswalker.ptmap.v1';
let PTMAP = (()=>{ try { return JSON.parse(localStorage.getItem(PTMAPKEY)) || {}; } catch(e){ return {}; } })();
const savePT = () => { try { localStorage.setItem(PTMAPKEY, JSON.stringify(PTMAP)); } catch(e){} };
const fold = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’`´]/g,"'").replace(/\s+/g,' ').trim();

/* ---------- leitura do texto ---------- */
const ZONE_RE = [[/^(deck|main|maindeck|principal|baralho|deck principal)$/i,'main'],[/^(commander|comandante|comandantes)$/i,'cmd'],[/^(companion|companheiro|companheira)$/i,'comp'],[/^(sideboard|reserva|side|cartas de reserva)$/i,'side'],[/^(maybeboard|considering|talvez)$/i,'skip']];
const HEAD = {q:/^(qtd|qtde|quant|quantidade|qty|quantity|count|n[ºo°]?\s*de\s*c[oó]pias|c[oó]pias|#)$/i, n:/^(nome|name|carta|card|card name|nome da carta)$/i, s:/^(set|cole[cç][aã]o|edi[cç][aã]o|edition|set code|c[oó]digo)$/i, c:/^(n[uú]mero|number|collector|collector number|cn|n[ºo°])$/i, z:/^(se[cç][aã]o|zona|board|section|tipo de lista)$/i};
function splitCSV(line, d){
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) { const ch = line[i];
    if (q) { if (ch === '"' && line[i+1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true; else if (ch === d) { out.push(cur); cur = ''; } else cur += ch; }
  out.push(cur); return out.map(s => s.trim());
}
function cleanName(n){
  let set = '', cn = '';
  n = n.replace(/\s+\*[A-Z]\*\s*$/,'').replace(/\s+#\S+$/,'').replace(/\s+\[[^\]]*\]\s*$/,'').trim();
  const m = n.match(/^(.*?)\s+\(([A-Za-z0-9]{2,6})\)\s*([\w★†-]+)?\s*$/);
  if (m) { n = m[1].trim(); set = m[2].toLowerCase(); cn = m[3] || ''; }
  return {name: n.replace(/\s+/g,' '), set, cn};
}
function rowsToEntries(rows, out){
  // rows: matrizes de células (planilha ou texto com tabulação/ponto e vírgula)
  let map = null;
  const h = rows[0] ? rows[0].map(x => String(x == null ? '' : x).trim()) : [];
  if (h.some(x => HEAD.n.test(x))) { map = {}; h.forEach((x,i) => { for (const k in HEAD) if (HEAD[k].test(x) && map[k] == null) map[k] = i; }); rows = rows.slice(1); }
  let zone = 'main';
  rows.forEach(r => {
    const cells = r.map(x => String(x == null ? '' : x).trim()); if (!cells.some(Boolean)) return;
    if (cells.filter(Boolean).length === 1) { const only = cells.find(Boolean); const z = ZONE_RE.find(([re]) => re.test(only.replace(/:$/,''))); if (z) { zone = z[1]; return; } }
    let q, name, set = '', cn = '', z = zone;
    if (map) { q = parseInt(cells[map.q]); name = cells[map.n]; if (map.s != null) set = (cells[map.s]||'').toLowerCase(); if (map.c != null) cn = cells[map.c]||'';
      if (map.z != null) { const zz = ZONE_RE.find(([re]) => re.test(cells[map.z]||'')); if (zz) z = zz[1]; } }
    else { const qi = cells.findIndex(c => /^\d{1,3}x?$/i.test(c)); q = qi >= 0 ? parseInt(cells[qi]) : NaN;
      name = cells.filter((c,i) => i !== qi && c && !/^\d+$/.test(c) && !/^[A-Za-z0-9]{2,5}$/.test(c)).sort((a,b) => b.length - a.length)[0] || '';
      if (!name) name = cells.filter((c,i) => i !== qi && c && !/^\d+$/.test(c))[0] || ''; }
    if (!name) return; if (!(q > 0)) q = 1;
    const c = cleanName(name); out.push({name:c.name, q, set:set || c.set, cn:cn || c.cn, zone:z});
  });
}
function parseImport(txt, isFile){
  const out = []; txt = String(txt||'').replace(/^\uFEFF/,'');
  // MTGO .dek (XML)
  if (/<Cards\b/i.test(txt)) {
    txt.replace(/<Cards\b([^>]*)\/?>/gi, (_, a) => { const g = k => (a.match(new RegExp(k + '="([^"]*)"','i'))||[])[1] || ''; const n = g('Name').replace(/&amp;/g,'&'); if (n) out.push({name:n, q:+g('Quantity')||1, set:'', cn:'', zone: /true/i.test(g('Sideboard')) ? 'side' : 'main'}); });
    return group(out);
  }
  const lines = txt.split(/\r?\n/);
  const tabbed = lines.filter(l => /\t|;/.test(l)).length >= Math.max(2, lines.filter(l => l.trim()).length * .5);
  const csvComma = isFile && !tabbed && lines.filter(l => /,/.test(l)).length >= lines.filter(l => l.trim()).length * .8 && /^(.*,){1,}/.test(lines[0]||'') && lines.some(l => HEAD.n.test((splitCSV(l, ',')[0]||'')) || splitCSV(l, ',').some(c => HEAD.n.test(c)));
  if (tabbed || csvComma) {
    const d = tabbed ? (lines.some(l => /\t/.test(l)) ? '\t' : ';') : ',';
    rowsToEntries(lines.map(l => splitCSV(l, d)), out); return group(out);
  }
  let zone = 'main', aboutSkip = false;
  for (const raw of lines) {
    let l = raw.trim();
    if (!l) { aboutSkip = false; continue; }
    if (/^about$/i.test(l)) { aboutSkip = true; continue; }
    if (aboutSkip) continue;
    if (/^(\/\/|#)/.test(l)) { const z = ZONE_RE.find(([re]) => re.test(l.replace(/^(\/\/|#)\s*/,''))); if (z) zone = z[1]; continue; }
    const zh = ZONE_RE.find(([re]) => re.test(l.replace(/:$/,'').replace(/\s*\(\d+\)$/,''))); if (zh) { zone = zh[1]; continue; }
    if (/^(sb:)\s*/i.test(l)) { l = l.replace(/^sb:\s*/i,''); }
    let q = 1, name = l, m;
    if ((m = l.match(/^(\d{1,3})\s*[xX×]?\s+(.+)$/))) { q = +m[1]; name = m[2]; }
    else if ((m = l.match(/^(.+?)\s+[xX×]\s*(\d{1,3})$/))) { q = +m[2]; name = m[1]; }
    else if ((m = l.match(/^(.+?)\s*\((\d{1,3})\)$/))) { q = +m[2]; name = m[1]; }
    else if ((m = l.match(/^[-•*]\s*(.+)$/))) name = m[1];
    const c = cleanName(name); if (!c.name || /^\d+$/.test(c.name)) continue;
    out.push({name:c.name, q, set:c.set, cn:c.cn, zone: /^sb:/i.test(raw.trim()) ? 'side' : zone});
  }
  return group(out);
}
function group(list){
  const m = new Map();
  list.forEach(e => { if (e.zone === 'skip') return; const k = e.zone + '|' + fold(e.name); const x = m.get(k); if (x) x.q += e.q; else m.set(k, {...e}); });
  return [...m.values()];
}

/* ---------- reconhecimento das cartas ---------- */
function storeCard(c){
  regCard(c);
  if (c.card_faces) c.card_faces.forEach(f => { CARD_ALIAS[f.name.toLowerCase()] = c.name; });
  if (c.printed_name) CARD_ALIAS[c.printed_name.toLowerCase()] = c.name;
  return c.name;
}
async function postColl(ids){
  const r = await fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: ids})});
  if (!r.ok) throw new Error('HTTP ' + r.status);
  await new Promise(res => setTimeout(res, 110));
  return r.json();
}
async function findPT(n){
  const tries = [`!"${n}" lang:pt`, `"${n}" lang:pt`, `!"${n}" lang:any`];
  for (const q of tries) {
    try {
      const r = await fetch(`https://api.scryfall.com/cards/search?include_multilingual=true&unique=prints&q=${encodeURIComponent(q)}`, {headers:{'Accept':'application/json'}});
      await new Promise(res => setTimeout(res, 110));
      if (!r.ok) continue;
      const j = await r.json();
      const hit = j.data.find(c => fold(c.printed_name) === fold(n) || fold(c.name) === fold(n) || (c.card_faces||[]).some(f => fold(f.printed_name) === fold(n))) || (j.data.length <= 3 ? j.data[0] : null);
      if (hit) return hit;
    } catch(e) { return null; }
  }
  return null;
}
async function resolveImport(entries, st){
  st = st || (()=>{});
  let offline = false;
  const known = e => { const en = PT_BASIC[fold(e.name)] || PT_BASIC[e.name.toLowerCase()] || PTMAP[fold(e.name)]; if (en) { e.en = en; return true; } const d = cardData(e.name); if (d) { e.en = CARD_ALIAS[e.name.toLowerCase()] || e.name; return true; } if (BASICS.includes(e.name.toLowerCase())) { e.en = e.name.replace(/\b\w/g, x => x.toUpperCase()); return true; } return false; };
  entries.forEach(e => { delete e.en; known(e); });
  // 1. coleção + número (o jeito mais seguro: vale para qualquer idioma)
  const byId = entries.filter(e => !e.en && e.set && e.cn);
  for (let i = 0; i < byId.length && !offline; i += 75) {
    const chunk = byId.slice(i, i + 75); st(`Conferindo ${byId.length} carta(s) pela coleção e número…`);
    try {
      const j = await postColl(chunk.map(e => ({set: ARENA_SET[e.set] || e.set, collector_number: e.cn})));
      (j.data||[]).forEach(c => { const n = storeCard(c); chunk.forEach(e => { if (!e.en && (ARENA_SET[e.set] || e.set) === c.set && String(e.cn).toLowerCase() === String(c.collector_number).toLowerCase()) { e.en = n; if (fold(n) !== fold(e.name)) PTMAP[fold(e.name)] = n; } }); });
    } catch(err) { offline = true; }
  }
  // 2. nome em inglês
  const byName = entries.filter(e => !e.en);
  for (let i = 0; i < byName.length && !offline; i += 75) {
    const chunk = byName.slice(i, i + 75); st(`Procurando ${byName.length} carta(s) pelo nome…`);
    try {
      const j = await postColl(chunk.map(e => ({name: e.name})));
      (j.data||[]).forEach(c => { const n = storeCard(c); chunk.forEach(e => { if (!e.en && (fold(e.name) === fold(c.name) || (c.card_faces||[]).some(f => fold(f.name) === fold(e.name)))) e.en = n; }); });
    } catch(err) { offline = true; }
  }
  // 3. nome em português (ou outro idioma)
  const byPT = entries.filter(e => !e.en).slice(0, 60);
  for (const e of byPT) { if (offline) break; st(`Procurando "${e.name}" em português…`); const c = await findPT(e.name); if (c) { const j = await postColl([{id: c.id}]).catch(()=>null); const card = j && j.data && j.data[0] ? j.data[0] : c; e.en = storeCard(card); PTMAP[fold(e.name)] = e.en; } }
  savePT();
  try { localStorage.setItem(IMGKEY, JSON.stringify(IMG)); } catch(e){}
  const unknown = entries.filter(e => !e.en);
  return {offline, unknown};
}
/* lista em inglês, pronta para as ferramentas e para o Arena */
function canonList(entries){
  const main = [], cmd = [], comp = [], side = [];
  entries.forEach(e => { const n = e.en || e.name; const x = {name:n, q:e.q, pt: e.en && fold(e.en) !== fold(e.name) ? e.name : undefined}; (e.zone === 'cmd' ? cmd : e.zone === 'comp' ? comp : e.zone === 'side' ? side : main).push(x); });
  return {main, cmd, comp, side};
}
function arenaText(C){
  const nm = n => ARN[n] || n; const L = a => a.map(e => `${e.q} ${nm(e.name)}`).join('\n');
  let t = '';
  if (C.cmd.length) t += `Commander\n${L(C.cmd)}\n\n`;
  if (C.comp.length) t += `Companion\n${L(C.comp)}\n\n`;
  t += `Deck\n${L(C.main)}`;
  if (C.side.length) t += `\n\nSideboard\n${L(C.side)}`;
  return t;
}
/* usado pelo Analisador e pelo "Entenda seu deck" */
async function normalizeDeck(txt, st){
  const E = parseImport(txt); const r = await resolveImport(E, st); const C = canonList(E);
  return {E, C, offline:r.offline, unknown:r.unknown.map(e => e.name), cmd: C.cmd[0] ? C.cmd[0].name : ''};
}

/* ---------- planilhas ---------- */
let xlsxP = null;
function loadXLSX(){
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return xlsxP = xlsxP || new Promise((ok, bad) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = () => ok(window.XLSX); s.onerror = () => { xlsxP = null; bad(new Error('xlsx')); }; document.head.appendChild(s); });
}
async function readImportFile(file){
  const name = (file.name||'').toLowerCase();
  if (/\.(xlsx|xlsm|xls|ods)$/.test(name)) {
    const X = await loadXLSX(); const wb = X.read(await file.arrayBuffer(), {type:'array'});
    const ws = wb.Sheets[wb.SheetNames[0]]; const rows = X.utils.sheet_to_json(ws, {header:1, defval:'', raw:false});
    return {rows};
  }
  return {text: await file.text()};
}
function downloadFile(name, content, type){
  const blob = new Blob([content], {type}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function sheetCSV(C){
  const rows = [['Quantidade','Carta','Seção']];
  const add = (a, z) => a.forEach(e => rows.push([e.q, e.name, z]));
  add(C.cmd, 'Comandante'); add(C.comp, 'Companheiro'); add(C.main, 'Deck'); add(C.side, 'Reserva');
  return '\uFEFF' + rows.map(r => r.map(x => /[;"\n]/.test(String(x)) ? `"${String(x).replace(/"/g,'""')}"` : x).join(';')).join('\r\n');
}

/* ---------- tela ---------- */
let imp = {mode:'colar', txt:'', E:null, st:'', busy:false, build:(S.impBuild||[]), q:1, ac:[], fileName:''};
const IMP_MODES = [
  ['colar','Colar lista','Do MTG Arena, Moxfield, MTGO, Archidekt ou qualquer texto', '<path d="M8 4h8v3H8z"/><path d="M6 6H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1"/><path d="M8 12h8M8 16h5"/>'],
  ['arquivo','Planilha ou arquivo','Excel (.xlsx), CSV, .txt ou .dek do MTGO', '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h8M12 11v8"/>'],
  ['montar','Montar carta a carta','Digite o nome em português ou inglês e adicione', '<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="3"/>']
];
function renderImport(){
  const modeHTML = IMP_MODES.map(([k,t,d,ic]) => `<button class="imp-mode" data-im="${k}" aria-pressed="${imp.mode===k}"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg><b>${t}</b><small>${d}</small></button>`).join('');
  let body = '';
  if (imp.mode === 'colar') body = `
    <label class="f" for="impTxt">Cole a lista aqui
      <textarea id="impTxt" rows="12" spellcheck="false" placeholder="No Arena: Decks → escolha o deck → Exportar. Depois cole aqui.&#10;&#10;Também vale digitar:&#10;4 Relâmpago&#10;20 Montanha&#10;Llanowar Elves x4">${esc(imp.txt)}</textarea></label>
    <div class="row-h"><button class="btn primary" id="impGo">Conferir cartas</button>${navigator.clipboard && navigator.clipboard.readText ? '<button class="btn" id="impPaste">Colar da área de transferência</button>' : ''}<button class="btn" id="impEx">Ver um exemplo</button></div>
    <p class="muted" style="font-size:.88rem">Funciona com nomes em português ou inglês. Linhas como <code>4 Floresta (KTK) 258</code> são reconhecidas pela coleção e pelo número, então o idioma não importa.</p>`;
  else if (imp.mode === 'arquivo') body = `
    <label class="drop" id="impDrop" for="impFile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
      <b>${imp.fileName ? esc(imp.fileName) : 'Escolha o arquivo ou arraste para cá'}</b><small>Excel (.xlsx, .xls), LibreOffice (.ods), CSV, .txt ou .dek</small>
      <input type="file" id="impFile" accept=".xlsx,.xls,.xlsm,.ods,.csv,.txt,.dek,text/plain,text/csv"></label>
    <div class="tip" style="font-size:.9rem"><b>Como montar a planilha:</b> uma carta por linha, com a coluna <b>Quantidade</b> e a coluna <b>Carta</b> (nome em português ou inglês). As colunas <b>Coleção</b>, <b>Número</b> e <b>Seção</b> (Deck, Comandante ou Reserva) são opcionais.
      <div class="row-h" style="margin-top:8px"><button class="btn small" id="impTpl">Baixar modelo de planilha</button></div></div>
    <p class="muted" style="font-size:.88rem">Se preferir, selecione as células no Excel, copie (Ctrl+C) e cole na opção "Colar lista". Também funciona.</p>`;
  else body = `
    <div class="ac-wrap"><label class="f" for="impAc">Nome da carta<input type="text" id="impAc" autocomplete="off" placeholder="Ex.: Elfos de Llanowar ou Llanowar Elves" value=""></label>
      <div class="ac-list" id="impAcL" role="listbox" hidden></div></div>
    <div class="row-h"><span class="muted" style="font-size:.9rem">Cópias:</span><div class="stepper"><button class="btn small" id="impQm" aria-label="Menos">−</button><b id="impQ">${imp.q}</b><button class="btn small" id="impQp" aria-label="Mais">+</button></div><button class="btn primary" id="impAdd">Adicionar</button></div>
    <div class="row-h basics">${[['Plains','Planície','W'],['Island','Ilha','U'],['Swamp','Pântano','B'],['Mountain','Montanha','R'],['Forest','Floresta','G']].map(([en,pt,c]) => `<button class="btn small" data-bas="${en}">${manaSym(c)} +1 ${pt}</button>`).join('')}</div>
    <div id="impBuildL">${buildListHTML()}</div>
    <div class="row-h"><button class="btn primary" id="impBGo" ${imp.build.length ? '' : 'disabled'}>Conferir cartas</button><button class="btn" id="impBClr" ${imp.build.length ? '' : 'disabled'}>Começar de novo</button></div>`;
  $('#deckBody').innerHTML = `
    <div class="panel stack-v"><h3>Importar deck</h3>
      <p class="muted">Traga seu deck de onde ele estiver. A Academia reconhece as cartas, mostra as imagens e entrega a lista pronta para o MTG Arena e para as outras ferramentas.</p>
      <div class="imp-modes">${modeHTML}</div>
      <div class="stack-v">${body}</div>
      <p class="muted" id="impSt" role="status" style="font-size:.9rem">${esc(imp.st)}</p>
    </div>
    <div id="impRes">${imp.E ? impResultHTML() : ''}</div>`;
  $$('[data-im]').forEach(b => b.onclick = () => { imp.mode = b.dataset.im; renderImport(); });
  bindImport(); if (imp.E) bindImpResult();
}
function buildListHTML(){
  if (!imp.build.length) return `<p class="muted" style="font-size:.9rem">Nenhuma carta ainda. Digite um nome acima.</p>`;
  const tot = imp.build.reduce((a,e)=>a+e.q,0);
  return `<div class="blist"><div class="row-h" style="justify-content:space-between"><b>${tot} carta(s)</b></div>${imp.build.map((e,i) => `<div class="brow"><span class="bq">${e.q}×</span><span class="bn">${esc(e.name)}</span><button class="btn small" data-bm="${i}" aria-label="Menos uma">−</button><button class="btn small" data-bp="${i}" aria-label="Mais uma">+</button><button class="btn small" data-bx="${i}" aria-label="Remover">✕</button></div>`).join('')}</div>`;
}
function saveBuild(){ S.impBuild = imp.build; save(); }
function addBuild(name, q){ const x = imp.build.find(e => fold(e.name) === fold(name)); if (x) x.q += q; else imp.build.push({name, q}); saveBuild(); const L = $('#impBuildL'); if (L) L.innerHTML = buildListHTML(); bindBuild(); ['#impBGo','#impBClr'].forEach(s => { const b = $(s); if (b) b.disabled = !imp.build.length; }); }
function bindBuild(){
  $$('[data-bm]').forEach(b => b.onclick = () => { const e = imp.build[+b.dataset.bm]; e.q--; if (e.q <= 0) imp.build.splice(+b.dataset.bm, 1); saveBuild(); $('#impBuildL').innerHTML = buildListHTML(); bindBuild(); });
  $$('[data-bp]').forEach(b => b.onclick = () => { imp.build[+b.dataset.bp].q++; saveBuild(); $('#impBuildL').innerHTML = buildListHTML(); bindBuild(); });
  $$('[data-bx]').forEach(b => b.onclick = () => { imp.build.splice(+b.dataset.bx, 1); saveBuild(); $('#impBuildL').innerHTML = buildListHTML(); bindBuild(); });
}
const impSt = m => { imp.st = m; const e = $('#impSt'); if (e) e.textContent = m; };
async function runImport(entries){
  if (!entries.length) { impSt('Não encontrei nenhuma carta. Confira se há uma carta por linha.'); return; }
  imp.busy = true; impSt('Lendo a lista…');
  $$('#impGo,#impBGo').forEach(b => b.disabled = true);
  const r = await resolveImport(entries, impSt);
  imp.E = entries; imp.busy = false;
  const ok = entries.filter(e => e.en).reduce((a,e)=>a+e.q,0), tot = entries.reduce((a,e)=>a+e.q,0);
  impSt(r.offline ? 'Sem conexão com o Scryfall. As cartas da base da Academia foram reconhecidas; as demais ficaram pendentes.' : ok === tot ? `Pronto: ${tot} cartas reconhecidas.` : `${ok} de ${tot} cartas reconhecidas. Corrija as que faltam logo abaixo.`);
  $$('#impGo,#impBGo').forEach(b => b.disabled = false);
  const R = $('#impRes'); if (R) { R.innerHTML = impResultHTML(); bindImpResult(); R.scrollIntoView({behavior:'smooth', block:'start'}); }
  if (!S.impDone) { S.impDone = true; addXP(20); save(); }
}
function bindImport(){
  const t = $('#impTxt'); if (t) t.oninput = () => imp.txt = t.value;
  const g = $('#impGo'); if (g) g.onclick = () => runImport(parseImport(imp.txt));
  const p = $('#impPaste'); if (p) p.onclick = async () => { try { imp.txt = await navigator.clipboard.readText(); $('#impTxt').value = imp.txt; runImport(parseImport(imp.txt)); } catch(e) { impSt('O navegador não liberou a área de transferência. Toque e segure na caixa e escolha Colar.'); } };
  const ex = $('#impEx'); if (ex) ex.onclick = () => { imp.txt = 'Deck\n16 Floresta (FDN) 280\n4 Elfos de Llanowar (FDN) 227\n4 Hidra Musgonata (FDN) 107\n4 Trilhar (FDN) 215\n4 Llanowar Elves\n4 Gigantosaurus\n4 Giant Growth\n4 Ranger\'s Guile\n4 Garruk\'s Companion\n4 Steel Leaf Champion\n4 Rancor\n4 Pelakka Wurm\n\nSideboard\n2 Naturalize'; $('#impTxt').value = imp.txt; };
  const f = $('#impFile');
  if (f) {
    const handle = async file => {
      if (!file) return; imp.fileName = file.name; impSt(`Lendo ${file.name}…`);
      try { const r = await readImportFile(file); const E = []; if (r.rows) { rowsToEntries(r.rows, E); runImport(group(E)); } else runImport(parseImport(r.text, true)); const d = $('#impDrop b'); if (d) d.textContent = file.name; }
      catch(e) { impSt(/xlsx/.test(e.message) ? 'Para ler arquivos do Excel é preciso internet. Sem conexão, salve a planilha como CSV (Arquivo → Salvar como → CSV) e envie de novo.' : 'Não consegui ler esse arquivo. Tente salvar como CSV ou .txt.'); }
    };
    f.onchange = () => handle(f.files[0]);
    const d = $('#impDrop');
    ['dragenter','dragover'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.add('over'); }));
    ['dragleave','drop'].forEach(ev => d.addEventListener(ev, e => { e.preventDefault(); d.classList.remove('over'); }));
    d.addEventListener('drop', e => handle(e.dataTransfer.files[0]));
  }
  const tp = $('#impTpl'); if (tp) tp.onclick = () => downloadFile('modelo_deck_academia.csv', '\uFEFFQuantidade;Carta;Coleção;Número;Seção\r\n4;Elfos de Llanowar;;;Deck\r\n4;Llanowar Elves;;;Deck\r\n1;Floresta;KTK;258;Deck\r\n2;Naturalize;;;Reserva\r\n', 'text/csv;charset=utf-8');
  // montar carta a carta
  const ac = $('#impAc');
  if (ac) {
    let tmr = null, sel = -1;
    const L = $('#impAcL');
    const paint = () => { L.hidden = !imp.ac.length; L.innerHTML = imp.ac.map((n,i) => `<button role="option" class="ac-i" data-ac="${i}" aria-selected="${i===sel}">${esc(n)}</button>`).join(''); $$('[data-ac]').forEach(b => b.onmousedown = e => { e.preventDefault(); pick(imp.ac[+b.dataset.ac]); }); };
    const pick = n => { addBuild(n, imp.q); ac.value = ''; imp.ac = []; sel = -1; paint(); ac.focus(); impSt(`${imp.q}× ${n} adicionada.`); };
    ac.oninput = () => { clearTimeout(tmr); const v = ac.value.trim(); if (v.length < 2) { imp.ac = []; paint(); return; }
      tmr = setTimeout(async () => {
        const local = Object.keys(CARDS).filter(n => fold(n).includes(fold(v))).slice(0, 4);
        const pt = Object.keys(PTMAP).filter(n => n.includes(fold(v))).slice(0, 3).map(n => PTMAP[n]);
        let remote = [];
        try { const r = await fetch('https://api.scryfall.com/cards/autocomplete?include_multilingual=true&q=' + encodeURIComponent(v), {headers:{'Accept':'application/json'}}); if (r.ok) remote = (await r.json()).data || []; } catch(e) {}
        imp.ac = [...new Set([...pt, ...local, ...remote])].slice(0, 10); sel = -1; paint(); }, 220); };
    ac.onkeydown = e => {
      if (e.key === 'ArrowDown' && imp.ac.length) { sel = (sel + 1) % imp.ac.length; paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp' && imp.ac.length) { sel = (sel - 1 + imp.ac.length) % imp.ac.length; paint(); e.preventDefault(); }
      else if (e.key === 'Enter') { e.preventDefault(); const v = sel >= 0 ? imp.ac[sel] : ac.value.trim(); if (v) pick(v); }
      else if (e.key === 'Escape') { imp.ac = []; paint(); } };
    ac.onblur = () => setTimeout(() => { imp.ac = []; paint(); }, 150);
    $('#impQm').onclick = () => { imp.q = Math.max(1, imp.q - 1); $('#impQ').textContent = imp.q; };
    $('#impQp').onclick = () => { imp.q = Math.min(99, imp.q + 1); $('#impQ').textContent = imp.q; };
    $('#impAdd').onclick = () => { const v = ac.value.trim(); if (v) pick(v); else ac.focus(); };
    $$('[data-bas]').forEach(b => b.onclick = () => addBuild(b.dataset.bas, 1));
    $('#impBGo').onclick = () => runImport(imp.build.map(e => ({...cleanName(e.name), q:e.q, zone:'main'})));
    $('#impBClr').onclick = () => { imp.build = []; saveBuild(); renderImport(); };
    bindBuild();
  }
}
function impResultHTML(){
  const C = canonList(imp.E); const unk = imp.E.filter(e => !e.en);
  const tot = a => a.reduce((s,e)=>s+e.q,0);
  const all = [...C.cmd, ...C.comp, ...C.main].filter(e => cardData(e.name) || BASICS.includes(e.name.toLowerCase()));
  const nMain = tot(C.main) + tot(C.cmd) + tot(C.comp);
  const fmtGuess = C.cmd.length || nMain >= 95 ? 'Commander/Brawl (100)' : nMain <= 45 ? 'Limitado (40)' : 'Construído (60)';
  const ptN = imp.E.filter(e => e.en && fold(e.en) !== fold(e.name)).length;
  return `<div class="panel stack-v"><div class="row-h" style="justify-content:space-between"><h3 style="margin:0">Seu deck</h3><div class="row-h"><span class="pill ${unk.length ? 'warn' : 'good'}">${nMain} cartas</span>${tot(C.side) ? `<span class="pill">${tot(C.side)} na reserva</span>` : ''}<span class="pill">${fmtGuess}</span></div></div>
    ${ptN ? `<p class="muted" style="font-size:.9rem">${ptN} nome(s) em português foram traduzidos para o nome oficial em inglês, que é o que o Arena e as ferramentas usam.</p>` : ''}
    ${unk.length ? `<div class="tip warn-tip stack-v"><b>Não reconheci ${unk.length === 1 ? 'esta carta' : `estas ${unk.length} cartas`}. Corrija o nome (em português ou inglês) e toque em Procurar:</b>
      ${unk.map(e => { const i = imp.E.indexOf(e); return `<div class="row-h fix"><span class="bq">${e.q}×</span><input type="text" value="${esc(e.name)}" data-fixv="${i}" aria-label="Nome da carta"><button class="btn small" data-fix="${i}">Procurar</button><button class="btn small" data-fixx="${i}">Remover</button></div>`; }).join('')}</div>` : ''}
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
      <div class="stack-v"><span class="eyebrow">Lista para importar no MTG Arena</span><pre class="code" id="impOutTxt">${esc(arenaText(C))}</pre>
        <div class="row-h"><button class="btn primary" id="impCopy">Copiar para o Arena</button><button class="btn" id="impCsv">Baixar planilha</button><button class="btn" id="impSave">Salvar em Meus decks</button></div>
        <p class="muted" style="font-size:.85rem">No Arena: <b>Decks → Importar</b>. Os nomes vão em inglês, que o Arena aceita em qualquer idioma.</p>
        <span class="eyebrow" style="margin-top:6px">O que fazer agora</span>
        <div class="next-grid">
          <button class="next hot" data-imgo="otimizar"><b>Melhorar meu deck</b><small>Veja as trocas sugeridas, aceite as que quiser e receba a lista otimizada para o Arena</small></button>
          <button class="next" data-imgo="entenda"><b>Entender o deck</b><small>Estilo, função de cada carta, combos e dicas</small></button>
          <button class="next" data-imgo="analise"><b>Analisador</b><small>Curva de mana, cores e terrenos</small></button>
          <button class="next" data-imgo="mao"><b>Testar mãos iniciais</b><small>Compre 7 e decida o mulligan</small></button>
          <button class="next" data-imgo="sim"><b>Simular partidas</b><small>Veja em que turno o deck costuma vencer</small></button>
          <button class="next" data-imgo="duelo"><b>Jogar contra o computador</b><small>Teste o deck no duelo</small></button>
        </div></div>
      <div class="stack-v"><span class="eyebrow">Como o deck fica</span>${deckGallery([...C.cmd, ...C.comp, ...C.main].filter(e => all.includes(e)), C.cmd[0] && C.cmd[0].name)}</div>
    </div></div>`;
}
function sendImported(){
  const C = canonList(imp.E); const cmd = C.cmd[0] ? C.cmd[0].name : '';
  const main = [...C.cmd, ...C.comp, ...C.main];
  deckText = main.map(e => `${e.q} ${e.name}`).join('\n');
  const n = main.reduce((a,e)=>a+e.q,0); deckFormat = cmd || n >= 95 ? '100' : n <= 45 ? '40' : '60';
  DECK = null; hand = null;
  ent.txt = arenaText(C); ent.cmd = cmd; ent.A = null; ent.status = '';
  return cmd;
}
function bindImpResult(){
  const C = canonList(imp.E);
  const cp = $('#impCopy'); if (cp) cp.onclick = () => copyText(arenaText(C), $('#impOutTxt'));
  const sv = $('#impSave'); if (sv) sv.onclick = () => { const cmd = C.cmd[0] ? C.cmd[0].name : ''; openSaveDialog(arenaText(C), {cmd, name: imp.shared || '', label:'Importado'}); };
  const cv = $('#impCsv'); if (cv) cv.onclick = () => downloadFile('meu_deck.csv', sheetCSV(C), 'text/csv;charset=utf-8');
  $$('[data-fix]').forEach(b => b.onclick = async () => { const i = +b.dataset.fix; const v = $(`[data-fixv="${i}"]`).value.trim(); if (!v) return; const e = imp.E[i]; e.name = v; e.set = ''; e.cn = ''; b.disabled = true; await resolveImport([e], impSt); impSt(e.en ? `Encontrei: ${e.en}.` : `Ainda não encontrei "${v}". Confira a grafia.`); $('#impRes').innerHTML = impResultHTML(); bindImpResult(); });
  $$('[data-fixx]').forEach(b => b.onclick = () => { imp.E.splice(+b.dataset.fixx, 1); $('#impRes').innerHTML = impResultHTML(); bindImpResult(); });
  $$('[data-imgo]').forEach(b => b.onclick = () => {
    const go = b.dataset.imgo; sendImported();
    if (go === 'sim') { simSel = 'mine'; trTab = 'sim'; show('treino'); return; }
    if (go === 'duelo') { playDuelWith([...C.cmd, ...C.main]); return; }
    if (go === 'otimizar') { ow.step = 1; ow.sugg = null; opt.res = null; deckTab = 'otimizar'; RENDER.decks(); const st = $('#owSt'); if (st) st.textContent = 'Lendo o deck…'; entAnalyze().then(() => { if (deckTab === 'otimizar') { ow.step = ent.A ? 2 : 1; renderOptFlow(); } }); window.scrollTo({top:0}); return; }
    deckTab = go; RENDER.decks();
    if (go === 'entenda') entAnalyze();
    window.scrollTo({top:0});
  });
}
