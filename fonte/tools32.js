/* ================= v3.2: DIAGNÓSTICO, BACKUP EM ARQUIVO E LEVEZA ================= */

/* ---------- backup completo em arquivo ---------- */
const BK_KEYS = ['academiaPlaneswalker.v2', 'academiaPlaneswalker.ptmap.v1'];
function backupData(){
  const o = {app:'Academia do Planeswalker', v:CUR_VER, d:new Date().toISOString(), deckText, data:{}};
  BK_KEYS.forEach(k => { try { const v = localStorage.getItem(k); if (v) o.data[k] = v; } catch(e){} });
  return o;
}
function doBackup(){
  S.lastBackup = Date.now(); save();
  const o = backupData(); const d = new Date(); const tag = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  downloadFile(`academia_backup_${tag}.json`, JSON.stringify(o), 'application/json');
  const nD = (S.lib||[]).length;
  toast(`Backup baixado: ${nD} deck(s), coleção e progresso. Guarde o arquivo no Google Drive ou mande para você mesmo no WhatsApp.`);
}
function restoreBackup(file){
  return file.text().then(t => {
    const o = JSON.parse(t); if (!o || !o.data || !o.data['academiaPlaneswalker.v2']) throw new Error('arquivo');
    const cur = JSON.parse(localStorage.getItem('academiaPlaneswalker.v2') || '{}');
    const inc = JSON.parse(o.data['academiaPlaneswalker.v2']);
    // junta os decks: os do arquivo entram, os deste aparelho que não estão no arquivo continuam
    const lib = (inc.lib || []).slice(); (cur.lib || []).forEach(d => { if (!lib.some(x => x.id === d.id)) lib.push(d); });
    inc.lib = lib; inc.theme = cur.theme != null ? cur.theme : inc.theme;
    localStorage.setItem('academiaPlaneswalker.v2', JSON.stringify(inc)); S = Object.assign({}, DEF, inc);
    if (o.data['academiaPlaneswalker.ptmap.v1']) localStorage.setItem('academiaPlaneswalker.ptmap.v1', o.data['academiaPlaneswalker.ptmap.v1']);
    return {decks: lib.length, date: o.d};
  });
}
function backupPanelHTML(px){
  px = px || 's';
  const L = (S.lib||[]).length, last = S.lastBackup ? new Date(S.lastBackup).toLocaleDateString('pt-BR') : null;
  return `<div class="bk-box stack-v"><span class="eyebrow">Seus dados</span>
    <p class="muted" style="margin:0;font-size:.9rem">Decks, coleção e progresso ficam só neste aparelho. ${last ? `Último backup: <b>${last}</b>.` : '<b>Você ainda não fez backup.</b>'} ${L ? `${L} deck(s) guardado(s).` : ''}</p>
    <div class="row-h"><button class="btn primary" id="bkDo${px}">Fazer backup (baixar arquivo)</button><label class="btn" for="bkFile${px}" style="cursor:pointer">Restaurar backup<input type="file" id="bkFile${px}" accept=".json,application/json" hidden></label><button class="btn" id="bkDiag${px}">Diagnóstico</button></div>
    <p class="muted" id="bkSt${px}" style="margin:0;font-size:.85rem">Para passar tudo para outro celular ou para o PC: faça o backup aqui, mande o arquivo para o outro aparelho e toque em "Restaurar backup" lá.</p></div>`;
}
function bindBackupPanel(px){
  px = px || 's';
  const d = $('#bkDo'+px); if (d) d.onclick = () => { doBackup(); const s = $('#bkSt'+px); if (s) s.textContent = 'Backup baixado. Procure o arquivo na pasta Downloads.'; };
  const f = $('#bkFile'+px); if (f) f.onchange = async () => { const file = f.files[0]; if (!file) return;
    try { const r = await restoreBackup(file); toast(`Backup restaurado: ${r.decks} deck(s). Recarregando…`); setTimeout(() => location.reload(), 1200); }
    catch(e) { const s = $('#bkSt'+px); if (s) s.textContent = 'Este arquivo não é um backup da Academia. Escolha o arquivo academia_backup_….json.'; } };
  const g = $('#bkDiag'+px); if (g) g.onclick = () => openDiag();
}
(function(){
  const o0 = openSettings;
  openSettings = function(){
    o0();
    const box = $('#modalBox .info'); if (!box) return;
    const row = $$('.row-h', box).pop();
    (row || box).insertAdjacentHTML(row ? 'beforebegin' : 'beforeend', backupPanelHTML('s'));
    bindBackupPanel('s');
  };
})();
/* lembrete: decks guardados e sem backup há mais de 14 dias */
function backupReminder(){
  const L = (S.lib||[]).length; if (!L) return;
  const since = Date.now() - (S.lastBackup || 0), snooze = Date.now() - (S.bkSnooze || 0);
  if (since < 14 * 864e5 || snooze < 7 * 864e5) return;
  const el = document.createElement('div'); el.className = 'bk-remind'; el.setAttribute('role', 'status');
  el.innerHTML = `<b>Seus ${L} deck(s) estão só neste aparelho.</b><span>Faça um backup para não perder nada se o navegador for limpo.</span><div class="row-h"><button class="btn small primary" id="bkR1">Fazer backup</button><button class="btn small" id="bkR2">Depois</button></div>`;
  document.body.appendChild(el);
  $('#bkR1').onclick = () => { doBackup(); el.remove(); };
  $('#bkR2').onclick = () => { S.bkSnooze = Date.now(); save(); el.remove(); };
}
/* pede ao navegador para não apagar os dados sozinho */
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => { if (!p && (S.lib||[]).length) navigator.storage.persist(); }); } catch(e){}

/* ---------- diagnóstico ---------- */
const SF = 'https://api.scryfall.com';
const jget = async (u) => { const r = await fetch(u, {headers:{'Accept':'application/json'}}); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };
const jpost = async (u, b) => { const r = await fetch(u, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(b)}); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };
const wait = ms => new Promise(r => setTimeout(r, ms));
let diagCtx = {};
const DIAG = [
  ['Conexão com o Scryfall', 'Base de todas as buscas de cartas', async () => { const c = await jget(`${SF}/cards/named?exact=Lightning%20Bolt`); diagCtx.img = c.image_uris && c.image_uris.normal; diagCtx.usd = c.prices && c.prices.usd; return c.name; }],
  ['Cartas pelo nome', 'Importar listas em inglês', async () => { const j = await jpost(`${SF}/cards/collection`, {identifiers:[{name:'Llanowar Elves'},{name:'Shock'}]}); if ((j.data||[]).length !== 2) throw new Error('achou ' + (j.data||[]).length + ' de 2'); return j.data.map(c => c.name).join(', '); }],
  ['Cartas pela coleção e número', 'Listas do Arena em português, como "(FDN) 227"', async () => { const j = await jpost(`${SF}/cards/collection`, {identifiers:[{set:'fdn', collector_number:'227'}]}); if (!(j.data||[]).length) throw new Error('não encontrou FDN 227'); return 'FDN 227 = ' + j.data[0].name; }],
  ['Código antigo do Arena (DAR)', 'Coleções com código diferente no Arena', async () => { const j = await jpost(`${SF}/cards/collection`, {identifiers:[{set:'dom', collector_number:'168'}]}); if (!(j.data||[]).length) throw new Error('não encontrou DOM 168'); return 'DOM 168 = ' + j.data[0].name; }],
  ['Nome em português', 'Listas digitadas em português', async () => { const j = await jget(`${SF}/cards/search?include_multilingual=true&unique=prints&q=${encodeURIComponent('!"Elfos de Llanowar" lang:pt')}`); const h = j.data.find(c => /elfos de llanowar/i.test(c.printed_name||'')) || j.data[0]; if (!h) throw new Error('sem resultado'); return `"Elfos de Llanowar" = ${h.name}`; }],
  ['Sugestões ao digitar', 'Montar carta a carta e a barra de pesquisa', async () => { const j = await jget(`${SF}/cards/autocomplete?include_multilingual=true&q=${encodeURIComponent('Relâmpago')}`); return (j.data||[]).slice(0,3).join(', ') || '(nenhuma sugestão)'; }],
  ['Busca por formato no Arena', 'Criar deck do zero, melhorar e sideboard', async () => { const j = await jget(`${SF}/cards/search?order=edhrec&q=${encodeURIComponent('t:creature c<=g f:standard game:arena')}`); return `${j.total_cards} criaturas verdes no Padrão do Arena`; }],
  ['Comandantes do Brawl', 'Escolha de comandante no Arena', async () => { const j = await jget(`${SF}/cards/search?order=edhrec&q=${encodeURIComponent('is:commander id=gw f:brawl game:arena')}`); return `${j.total_cards} comandantes verde e branco`; }],
  ['Terrenos de duas cores', 'Base de mana dos decks gerados', async () => { const j = await jget(`${SF}/cards/search?order=edhrec&q=${encodeURIComponent('t:land -t:basic produces=gw f:standard game:arena')}`); return `${j.total_cards} terrenos`; }],
  ['Imagens das cartas', 'Galerias, proxies e capa', () => new Promise((ok, bad) => { if (!diagCtx.img) return bad(new Error('sem endereço de imagem')); const i = new Image(); const t = setTimeout(() => bad(new Error('demorou demais')), 12000); i.onload = () => { clearTimeout(t); ok(`${i.naturalWidth}×${i.naturalHeight}`); }; i.onerror = () => { clearTimeout(t); bad(new Error('bloqueada')); }; i.src = diagCtx.img + (diagCtx.img.includes('?') ? '&' : '?') + 'd=' + Date.now(); })],
  ['Preços', 'Orçamento das cartas físicas', async () => { if (!diagCtx.usd) throw new Error('sem preço'); return `Lightning Bolt: US$ ${diagCtx.usd}`; }],
  ['Cotação do dólar', 'Conversão para reais', async () => { const j = await jget('https://economia.awesomeapi.com.br/json/last/USD-BRL'); return 'R$ ' + (+j.USDBRL.bid).toFixed(2); }],
  ['Combos (Commander Spellbook)', 'Combos em "Entenda seu deck"', async () => { const r = await fetch('https://backend.commanderspellbook.com/find-my-combos', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({main:[{card:'Kiki-Jiki, Mirror Breaker', quantity:1},{card:'Zealous Conscripts', quantity:1}], commanders:[]})}); if (!r.ok) throw new Error('HTTP ' + r.status); const j = await r.json(); const res = j.results || j; return `${(res.included||[]).length} combo(s) encontrados no teste`; }],
  ['Links de compartilhar', 'Compartilhar deck por link', async () => { const t = '4 Lightning Bolt\n20 Mountain'; const c = await packDeck(t); const b = await unpackDeck(c); if (b !== t) throw new Error('não confere'); return c[0] === 'z' ? 'com compressão' : 'sem compressão (link mais longo)'; }],
  ['Armazenamento', 'Meus decks, coleção e progresso', async () => { localStorage.setItem('academiaPlaneswalker.test', 'x'); localStorage.removeItem('academiaPlaneswalker.test'); let used = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); used += (localStorage.getItem(k)||'').length; } let p = ''; try { if (navigator.storage && navigator.storage.persisted) p = (await navigator.storage.persisted()) ? ', protegido contra limpeza' : ', pode ser limpo pelo navegador'; } catch(e){} return `${Math.round(used/1024)} KB usados${p}`; }],
  ['Aplicativo', 'Instalação e uso sem internet', async () => { const st = matchMedia('(display-mode: standalone)').matches; const sw = navigator.serviceWorker && navigator.serviceWorker.controller; if (location.protocol !== 'https:') return 'aberto como arquivo (sem modo aplicativo)'; return `${st ? 'instalado' : 'no navegador'}${sw ? ', funciona offline' : ''}`; }]
];
function deviceInfo(){
  const n = navigator; return `Aparelho: ${n.userAgent}\nMemória: ${n.deviceMemory ? n.deviceMemory + ' GB' : '?'} · Processadores: ${n.hardwareConcurrency || '?'} · Tela: ${screen.width}×${screen.height} (${devicePixelRatio}x) · Modo leve: ${S.lite ? 'sim' : 'não'} · Versão: ${CUR_VER}`;
}
let diagRes = [];
function openDiag(){
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="stack-v" style="grid-column:1/-1">
    <span class="eyebrow">Ajustes</span><h2>Diagnóstico</h2>
    <p class="muted" style="margin:0">Testa de verdade, neste aparelho, cada serviço que a Academia usa. Se algo falhar, toque em "Copiar relatório" e mande para quem cuida da plataforma.</p>
    <div class="row-h"><button class="btn primary" id="dgGo">Começar o diagnóstico</button><button class="btn" id="dgCopy" disabled>Copiar relatório</button></div>
    <ol class="dg-list" id="dgList">${DIAG.map(([t,d],i) => `<li id="dg${i}"><span class="dg-s" aria-hidden="true">·</span><div><b>${t}</b><small>${d}</small><small class="dg-r"></small></div></li>`).join('')}</ol>
    <p class="muted" id="dgSum" style="font-size:.9rem"></p></div>`;
  $('#modal').hidden = false;
  $('#dgGo').onclick = runDiag;
  $('#dgCopy').onclick = () => copyText(diagReport());
}
function diagReport(){ return `Diagnóstico da Academia do Planeswalker · ${new Date().toLocaleString('pt-BR')}\n${deviceInfo()}\n\n` + diagRes.map((r,i) => `${r.ok ? 'OK ' : 'ERRO'} ${DIAG[i][0]} (${r.ms} ms): ${r.info}`).join('\n'); }
async function runDiag(){
  const go = $('#dgGo'); go.disabled = true; diagRes = []; diagCtx = {}; let fails = 0;
  for (let i = 0; i < DIAG.length; i++) {
    const li = $('#dg' + i); if (!li) return; li.className = 'run'; $('.dg-s', li).textContent = '…';
    const t0 = performance.now(); let r;
    try { const info = await Promise.race([DIAG[i][2](), wait(15000).then(() => { throw new Error('sem resposta em 15 s'); })]); r = {ok:true, info: String(info)}; }
    catch(e) { r = {ok:false, info: (e && e.message) || 'falhou'}; fails++; }
    r.ms = Math.round(performance.now() - t0); diagRes.push(r);
    li.className = r.ok ? 'ok' : 'bad'; $('.dg-s', li).textContent = r.ok ? '✓' : '✕'; $('.dg-r', li).textContent = `${r.info} · ${r.ms} ms`;
    if (/scryfall/i.test(DIAG[i][0] + DIAG[i][1]) || i < 11) await wait(110);
  }
  const sum = $('#dgSum'); if (sum) sum.innerHTML = fails ? `<b>${fails} teste(s) falharam.</b> Copie o relatório e envie. Se todos os testes do Scryfall falharam, a rede (Wi-Fi da empresa, por exemplo) pode estar bloqueando o site.` : '<b>Tudo funcionando neste aparelho.</b>';
  go.disabled = false; go.textContent = 'Testar de novo'; const c = $('#dgCopy'); if (c) c.disabled = false;
  if (!S.diagDone) { S.diagDone = true; save(); }
}

/* o painel antigo da página inicial passa a usar o backup completo */
backupHTML = () => `<div class="panel stack-v" style="margin-top:16px"><h3>Backup e outro aparelho</h3>${backupPanelHTML('h')}</div>`;
bindBackup = () => bindBackupPanel('h');
