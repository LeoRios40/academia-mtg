/* ================= MELHORAR MEU DECK (passo a passo) =================
   1. Seu deck  2. Diagnóstico  3. Sugestões (aceitar ou recusar cada troca)  4. Lista final para o Arena */
let ow = {step:1, acc:{}, fill:true, txt:'', busy:false, sugg:null};
const OW_STEPS = ['Seu deck','Diagnóstico','Sugestões','Lista final'];
const WHY_PT = {rem:'traz remoção', draw:'traz compra de cartas', ramp:'acelera a mana', wipe:'remoção em massa', cheapCr:'melhora a curva com criatura barata', theme:'reforça o tema do deck'};
function owStepsHTML(){
  return `<ol class="ow-steps">${OW_STEPS.map((t,i) => { const n = i + 1; const st = n < ow.step ? 'done' : n === ow.step ? 'cur' : ''; const can = n < ow.step || (n === 2 && ent.A) || (n === 3 && opt.res) || (n === 4 && opt.res); return `<li class="${st}"><button ${can ? `data-ows="${n}"` : 'disabled'}><span class="ow-n">${n}</span><span>${t}</span></button></li>`; }).join('')}</ol>`;
}
function renderOptFlow(){
  if (ow.step > 1 && !ent.A) ow.step = 1;
  if (ow.step > 2 && !opt.res) ow.step = 2;
  let body = '';
  if (ow.step === 1) body = owStep1(); else if (ow.step === 2) body = owStep2(); else if (ow.step === 3) body = owStep3(); else body = owStep4();
  $('#deckBody').innerHTML = `<div class="panel stack-v ow"><h3>Melhorar meu deck</h3>
    <p class="muted">Quatro passos: a Academia lê seu deck, mostra o diagnóstico, sugere trocas que você aceita ou recusa, e no fim entrega a lista pronta para importar no MTG Arena.</p>
    ${owStepsHTML()}<div id="owBody" class="stack-v">${body}</div></div>`;
  $$('[data-ows]').forEach(b => b.onclick = () => { ow.step = +b.dataset.ows; renderOptFlow(); });
  bindOw();
}
function owStep1(){
  const A = ent.A;
  const cur = A ? `<div class="ow-deck"><div class="row-h">${A.cols.map(manaSym).join('')}<b>${A.tot} cartas</b><span class="pill">${A.arch}</span>${A.cmd ? `<span class="pill">Comandante: ${esc(A.cmd)}</span>` : ''}</div>
      <p class="muted" style="margin:6px 0 0;font-size:.9rem">Este é o deck que você importou por último.</p></div>
      <div class="row-h"><button class="btn primary" id="owNext1">Continuar com este deck</button><button class="btn" id="owOther">Usar outro deck</button></div>` : '';
  return `${cur}
    <div class="stack-v" ${A ? 'id="owNew" hidden' : 'id="owNew"'}>
      <label class="f" for="owTxt">Cole a lista do deck (do Arena, em português ou inglês)
        <textarea id="owTxt" rows="10" spellcheck="false" placeholder="No Arena: Decks → escolha o deck → Exportar. Depois cole aqui.">${esc(ow.txt)}</textarea></label>
      <div class="row-h"><button class="btn primary" id="owRead">Ler o deck</button><button class="btn" id="owImp">Importar de planilha ou montar carta a carta</button></div>
    </div>
    <p class="muted" id="owSt" role="status" style="font-size:.9rem"></p>`;
}
function owIssues(){
  const A = ent.A, R = A.R, q = arr => arr.reduce((a,e)=>a+e.q,0), big = A.fmt === '100';
  const rec = recLands(big ? '100' : A.fmt === '40' ? '40' : '60', R.avg); const L = [];
  if (Math.abs(R.lands - rec) >= 2) L.push(['warn', `${R.lands} terrenos; o recomendado para a sua curva é perto de ${rec}.`]);
  else L.push(['good', `Terrenos na medida: ${R.lands} (recomendado ${rec}).`]);
  const rem = q(A.role.rem || []), draw = q(A.role.draw || []), ramp = q(A.role.ramp || []);
  L.push([rem >= (big ? 8 : 6) ? 'good' : 'warn', `${rem} carta(s) de remoção${rem >= (big ? 8 : 6) ? '' : ': pouca resposta para as ameaças do oponente'}.`]);
  if (A.arch !== 'Aggro' || big) L.push([draw >= (big ? 8 : 3) ? 'good' : 'warn', `${draw} carta(s) de compra${draw >= (big ? 8 : 3) ? '' : ': o deck pode ficar sem gás'}.`]);
  if (big || A.arch === 'Ramp') L.push([ramp >= (big ? 10 : 6) ? 'good' : 'warn', `${ramp} carta(s) de aceleração de mana.`]);
  if (R.avg > (A.arch === 'Aggro' ? 2.4 : 3.4)) L.push(['warn', `Custo médio ${R.avg.toFixed(2)}: alto para um deck ${A.arch}.`]);
  if (A.cols.length >= 3 && !big) L.push(['warn', `${A.cols.length} cores: a mana pode falhar. Duas cores costumam ser mais estáveis.`]);
  if (A.unknown && A.unknown.length) L.push(['bad', `${A.unknown.length} carta(s) não reconhecida(s): ${A.unknown.slice(0,4).map(esc).join(', ')}.`]);
  if (R.over4 && R.over4.length) L.push(['bad', `Mais de 4 cópias: ${R.over4.map(esc).join(', ')}.`]);
  return L;
}
function owStep2(){
  const A = ent.A, R = A.R;
  const guess = A.fmt === '100' ? 'brawl' : 'standard'; if (!opt.fmt) opt.fmt = guess;
  return `<div class="ow-diag"><div class="ow-sum">
      <div class="ow-big">${A.cols.map(manaSym).join('') || manaSym('C')}<b>${esc(A.arch)}</b></div>
      <div class="muted" style="font-size:.92rem">${A.tot} cartas · custo médio ${R.avg.toFixed(2)} · ${R.lands} terrenos${A.tribe ? ` · tribo: ${esc(A.tribe[0])}` : ''}</div></div>
    <ul class="ow-issues">${owIssues().map(([k,t]) => `<li class="${k}"><span class="dot"></span>${t}</li>`).join('')}</ul></div>
    <div class="grid g2"><label class="f" for="owFmt">Em qual formato do Arena você vai jogar?<select id="owFmt">${Object.entries(AR_FMT).map(([k,l])=>`<option value="${k}" ${opt.fmt===k?'selected':''}>${l}</option>`).join('')}</select></label>
      <label class="f" for="owRar">Cartas novas que posso sugerir<select id="owRar">${Object.entries(RAR_PT).map(([k,l])=>`<option value="${k}" ${opt.rar===k?'selected':''}>${l}</option>`).join('')}</select></label></div>
    <div class="row-h"><button class="btn primary" id="owGo">Ver sugestões de troca</button><button class="btn" id="owFull">Ver a análise completa</button></div>
    <p class="muted" id="owSt" role="status" style="font-size:.9rem"></p>`;
}
/* monta as sugestões a partir do resultado do otimizador */
function owBuild(){
  const r = opt.res, A = ent.A;
  const isLand = n => { const d = cardData(n); return BASICS.includes(n.toLowerCase()) || (d && d.k === 'land'); };
  const rem = r.removed.filter(x => !isLand(x.n)), add = r.added.filter(x => !isLand(x.n) && x.n !== r.cmd);
  // as trocas juntam uma carta que sai com uma que entra
  const S2 = [];
  const n = Math.max(rem.length, add.length);
  for (let i = 0; i < n; i++) {
    const o = rem[i], a = add[i];
    S2.push({id:'s'+i, kind: o && a ? 'swap' : o ? 'out' : 'in', out:o, inn:a});
  }
  r.changed.filter(x => !isLand(x.n)).forEach((c,i) => S2.push({id:'c'+i, kind:'qty', c}));
  const origLands = A.R.entries.filter(e => e.k === 'land' || BASICS.includes(e.name.toLowerCase()));
  const newLands = r.list.filter(e => isLand(e.name));
  const sig = a => a.map(e => e.q + e.name).sort().join('|');
  if (sig(origLands) !== sig(newLands)) S2.push({id:'lands', kind:'lands', from:origLands, to:newLands});
  ow.sugg = S2; ow.acc = {}; S2.forEach(s => ow.acc[s.id] = true);
}
function owFinal(){
  const r = opt.res, A = ent.A; const m = new Map(); let cmd = r.cmd || (A.fmt === '100' ? A.cmd : '');
  A.R.entries.forEach(e => { if (!(e.k === 'land' || BASICS.includes(e.name.toLowerCase()))) m.set(e.name, (m.get(e.name)||0) + e.q); });
  let lands = A.R.entries.filter(e => e.k === 'land' || BASICS.includes(e.name.toLowerCase())).map(e => ({name:e.name, q:e.q}));
  ow.sugg.forEach(s => { if (!ow.acc[s.id]) return;
    if (s.out) m.delete(s.out.n);
    if (s.inn) m.set(s.inn.n, s.inn.q);
    if (s.kind === 'qty') m.set(s.c.n, s.c.to);
    if (s.kind === 'lands') lands = s.to.map(e => ({name:e.name, q:e.q})); });
  let list = [...m].map(([name,q]) => ({name, q})).concat(lands);
  if (cmd && !list.some(e => e.name === cmd)) list.unshift({name:cmd, q:1});
  const target = r.list.reduce((a,e)=>a+e.q,0); let tot = list.reduce((a,e)=>a+e.q,0); let note = '';
  if (ow.fill && tot !== target) {
    const main = (r.cols.find(c => BASIC_OF[c]) || 'G'); const bn = BASIC_OF[main];
    const b = list.find(e => e.name === bn);
    if (tot < target) { if (b) b.q += target - tot; else list.push({name:bn, q:target - tot}); note = `Completei com ${target - tot} ${bn} para fechar ${target} cartas.`; }
    else { let over = tot - target; for (const e of list.filter(x => BASICS.includes(x.name.toLowerCase())).sort((a,b)=>b.q-a.q)) { const k = Math.min(over, e.q - 1); e.q -= k; over -= k; if (!over) break; } if (over) note = `O deck ficou com ${over} carta(s) a mais que ${target}. Recuse algumas sugestões ou tire cartas no Arena.`; else note = `Tirei terrenos básicos para fechar ${target} cartas.`; }
    list = list.filter(e => e.q > 0); tot = list.reduce((a,e)=>a+e.q,0);
  }
  return {list, cmd, tot, target, note};
}
function owCard(n, q, tone){ return `<div class="ow-c ${tone}">${cardHTML(n, {showPt:false})}<span class="gal-q">${q}×</span>${tone === 'in' && owned(n) ? '<span class="own">Você tem</span>' : ''}</div>`; }
function owStep3(){
  if (!ow.sugg) owBuild();
  const S2 = ow.sugg; const accN = S2.filter(s => ow.acc[s.id]).length;
  if (!S2.length) return `<div class="tip">Seu deck já está bem montado para ${AR_FMT[opt.res.fmt]}: não encontrei trocas que valham a pena. <button class="btn small" data-ows2="4">Ver a lista para o Arena</button></div>`;
  const item = s => {
    const on = ow.acc[s.id];
    let head = '', cards = '';
    if (s.kind === 'swap') { head = `Trocar <b>${esc(s.out.n)}</b> por <b>${esc(s.inn.n)}</b>`; cards = `${owCard(s.out.n, s.out.q, 'out')}<span class="ow-arrow" aria-hidden="true">⇄</span>${owCard(s.inn.n, s.inn.q, 'in')}`; }
    else if (s.kind === 'out') { head = `Tirar <b>${esc(s.out.n)}</b>`; cards = owCard(s.out.n, s.out.q, 'out'); }
    else if (s.kind === 'in') { head = `Colocar <b>${esc(s.inn.n)}</b>`; cards = owCard(s.inn.n, s.inn.q, 'in'); }
    else if (s.kind === 'qty') { head = `Ajustar <b>${esc(s.c.n)}</b>: de ${s.c.from} para ${s.c.to} cópias`; cards = owCard(s.c.n, s.c.to, 'in'); }
    else { const t = a => a.map(e => `${e.q} ${esc(e.name)}`).join(', '); head = `Refazer a base de mana: ${s.from.reduce((a,e)=>a+e.q,0)} → ${s.to.reduce((a,e)=>a+e.q,0)} terrenos`; cards = `<div class="ow-lands"><div><span class="muted">Antes</span><p>${t(s.from) || 'nenhum'}</p></div><div><span class="muted">Depois</span><p>${t(s.to)}</p></div></div>`; }
    const why = [s.out ? `Sai: ${esc(s.out.why)}.` : '', s.inn ? `Entra: ${WHY_PT[s.inn.why] || 'boa carta para o deck'}.` : '', s.kind === 'qty' ? 'Mais cópias deixam o deck mais consistente.' : '', s.kind === 'lands' ? 'Quantidade e cores de terrenos ajustadas para a curva e os símbolos de mana do deck.' : ''].filter(Boolean).join(' ');
    return `<li class="ow-s ${on ? 'on' : 'off'}"><div class="ow-s-h"><span>${head}</span><div class="ow-tg" role="group" aria-label="Decisão"><button data-acc="${s.id}" aria-pressed="${on}">Aceitar</button><button data-rej="${s.id}" aria-pressed="${!on}">Recusar</button></div></div>
      <div class="ow-s-c">${cards}</div><p class="muted ow-why">${why}</p></li>`;
  };
  return `<div class="row-h" style="justify-content:space-between"><span><b>${S2.length} sugestões</b> <span class="muted">· ${accN} aceitas</span></span><div class="row-h"><button class="btn small" id="owAll">Aceitar todas</button><button class="btn small" id="owNone">Recusar todas</button><button class="btn small primary" data-to4>Criar a lista (${accN})</button></div></div>
    <ul class="ow-list">${S2.map(item).join('')}</ul>
    <label class="row-h" style="gap:8px;font-size:.92rem"><input type="checkbox" id="owFill" ${ow.fill ? 'checked' : ''}> Ajustar terrenos básicos para fechar a quantidade de cartas do formato</label>
    <div class="row-h"><button class="btn primary" id="owTo4" data-to4>Criar a lista com as trocas aceitas (${accN})</button><button class="btn" data-ows2="2">Voltar</button></div>`;
}
function owStep4(){
  if (!ow.sugg) owBuild();
  const F = owFinal(); const accN = ow.sugg.filter(s => ow.acc[s.id]).length;
  const extra = `<p class="muted" style="font-size:.9rem">${accN} de ${ow.sugg.length} sugestões aceitas · formato ${AR_FMT[opt.res.fmt]}.${F.note ? ' ' + esc(F.note) : ''}</p>`;
  return resultHTML('owRes', `Seu deck otimizado · ${F.tot} cartas`, F.list, F.cmd, extra) + `<div class="row-h"><button class="btn" data-ows2="3">Rever as sugestões</button><button class="btn" id="owCsv">Baixar planilha</button><button class="btn" id="owSave">Usar esta versão nas outras ferramentas</button></div>`;
}
function bindOw(){
  const st = m => { const e = $('#owSt'); if (e) e.textContent = m; };
  $$('[data-ows2]').forEach(b => b.onclick = () => { ow.step = +b.dataset.ows2; renderOptFlow(); });
  const t = $('#owTxt'); if (t) t.oninput = () => ow.txt = t.value;
  const o = $('#owOther'); if (o) o.onclick = () => { $('#owNew').hidden = false; o.disabled = true; $('#owTxt').focus(); };
  const n1 = $('#owNext1'); if (n1) n1.onclick = () => { ow.step = 2; renderOptFlow(); };
  const im = $('#owImp'); if (im) im.onclick = () => { deckTab = 'importar'; RENDER.decks(); };
  const rd = $('#owRead'); if (rd) rd.onclick = async () => {
    if (!ow.txt.trim()) { st('Cole uma lista primeiro.'); return; }
    rd.disabled = true; ent.txt = ow.txt; ent.cmd = ''; opt.res = null; ow.sugg = null; opt.fmt = null;
    const prev = ent.status; await entAnalyze(); rd.disabled = false;
    if (ent.A) { ow.step = 2; renderOptFlow(); } else st(ent.status || prev || 'Não consegui ler a lista.');
  };
  const f = $('#owFmt'); if (f) { f.onchange = e => { opt.fmt = e.target.value; opt.res = null; }; $('#owRar').onchange = e => { opt.rar = e.target.value; opt.res = null; }; }
  const full = $('#owFull'); if (full) full.onclick = () => { deckTab = 'entenda'; RENDER.decks(); };
  const go = $('#owGo'); if (go) go.onclick = async () => {
    if (ow.busy) return; ow.busy = true; go.disabled = true;
    try { opt.res = await optimizeDeck(st); ow.sugg = null; owBuild(); ow.step = 3; ow.busy = false; renderOptFlow(); window.scrollTo({top: $('#deckBody').offsetTop - 70, behavior:'smooth'}); }
    catch(e) { ow.busy = false; go.disabled = false; st('Não foi possível consultar o Scryfall agora. Confira a internet e tente de novo.'); }
  };
  $$('[data-acc]').forEach(b => b.onclick = () => { ow.acc[b.dataset.acc] = true; renderOptFlow(); });
  $$('[data-rej]').forEach(b => b.onclick = () => { ow.acc[b.dataset.rej] = false; renderOptFlow(); });
  const all = $('#owAll'); if (all) all.onclick = () => { ow.sugg.forEach(s => ow.acc[s.id] = true); renderOptFlow(); };
  const none = $('#owNone'); if (none) none.onclick = () => { ow.sugg.forEach(s => ow.acc[s.id] = false); renderOptFlow(); };
  const fl = $('#owFill'); if (fl) fl.onchange = () => ow.fill = fl.checked;
  $$('[data-to4]').forEach(t4 => t4.onclick = () => { ow.step = 4; renderOptFlow(); window.scrollTo({top: $('#deckBody').offsetTop - 70, behavior:'smooth'}); if (!S.owDone) { S.owDone = true; addXP(40); save(); } });
  if (ow.step === 4 && $('#owRes')) {
    const F = owFinal(); bindResult('owRes', F.list, F.cmd, opt.res.fmt);
    const C = {cmd: F.cmd ? [{name:F.cmd, q:1}] : [], comp:[], side:[], main: F.list.filter(e => e.name !== F.cmd)};
    $('#owCsv').onclick = () => downloadFile('deck_otimizado.csv', sheetCSV(C), 'text/csv;charset=utf-8');
    $('#owSave').onclick = () => { deckText = F.list.map(e => `${e.q} ${e.name}`).join('\n'); deckFormat = F.cmd ? '100' : '60'; DECK = null; hand = null; ent.txt = arenaList(F.list, F.cmd); ent.A = null; toast('Pronto: o Analisador, a Mão inicial e o Simulador agora usam o deck otimizado.'); };
  }
}
