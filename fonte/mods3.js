/* ================= 3. NOMES EM PORTUGUÊS ================= */
const PTKEY = 'academiaPlaneswalker.pt.v1';
let PTN = (()=>{ try { return JSON.parse(localStorage.getItem(PTKEY)) || {}; } catch(e){ return {}; } })();
const ptOf = n => PTN[(n||'').toLowerCase()] || null;
let ptBusy = false;
async function fetchPT(names){
  if (ptBusy) return; ptBusy = true;
  const miss = [...new Set(names)].filter(n => n && PTN[n.toLowerCase()] === undefined && !BASICS.includes(n.toLowerCase()));
  try {
    for (let i = 0; i < miss.length; i += 12) {
      const chunk = miss.slice(i, i+12);
      const q = `lang:pt (${chunk.map(n => `!"${n.replace(/"/g,'')}"`).join(' or ')})`;
      const r = await fetch(`https://api.scryfall.com/cards/search?include_multilingual=true&unique=cards&q=${encodeURIComponent(q)}`, {headers:{'Accept':'application/json'}});
      chunk.forEach(n => PTN[n.toLowerCase()] = PTN[n.toLowerCase()] || '');
      if (r.ok) { const j = await r.json(); j.data.forEach(c => { if (c.printed_name) PTN[c.name.toLowerCase()] = c.printed_name; }); }
      else if (r.status !== 404) break;
      await new Promise(res => setTimeout(res, 120));
    }
    try { localStorage.setItem(PTKEY, JSON.stringify(PTN)); } catch(e){}
  } catch(e) {}
  ptBusy = false;
}
const _cr = cr;
cr = (n, label) => { const p = S.ptNames && ptOf(n); return _cr(n, label) + (p ? ` <span class="pt-n">(${esc(p)})</span>` : ''); };
const _openCard = openCard;
openCard = function(name){
  if (!name) return;
  _openCard(name);
  const info = $('#modalBox .info'); if (!info) return;
  const add = p => { if (!p || $('#modalBox .pt-line')) return; const h = $('h2', info); if (h) h.insertAdjacentHTML('afterend', `<p class="pt-line muted">Em português: <b>${esc(p)}</b></p>`); };
  const p = ptOf(name); if (p) add(p); else if (PTN[name.toLowerCase()] === undefined) fetchPT([name]).then(() => add(ptOf(name)));
};

/* ================= 5. RELATAR PROBLEMA ================= */
window.__errs = [];
window.addEventListener('error', e => { window.__errs.push(`${e.message} (linha ${e.lineno})`); if (window.__errs.length > 8) window.__errs.shift(); });
window.addEventListener('unhandledrejection', e => { window.__errs.push('Promessa: ' + (e.reason && e.reason.message || e.reason)); });
const APP_VER = '2.1';
function openReport(){
  const ua = navigator.userAgent;
  const dev = (ua.match(/\(([^)]+)\)/)||[])[1] || '';
  const txt = [`Academia do Planeswalker · versão ${APP_VER}`, `Data: ${new Date().toLocaleString('pt-BR')}`, `Endereço: ${location.protocol === 'file:' ? 'arquivo no aparelho' : location.href}`,
    `Aparelho: ${dev}`, `Navegador: ${ua}`, `Tela: ${screen.width}×${screen.height} (janela ${innerWidth}×${innerHeight}, densidade ${devicePixelRatio})`,
    `Memória: ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'não informada'} · Modo leve: ${S.lite?'sim':'não'}`, `Tela aberta: ${currentView}`,
    `Imagens: ${imgStatus()}`, `Erros recentes: ${window.__errs.length ? window.__errs.join(' | ') : 'nenhum'}`, '', 'O que aconteceu: (descreva aqui)'].join('\n');
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="info stack-v" style="grid-column:1/-1"><h2>Relatar um problema</h2>
    <p class="muted">Copie o texto abaixo, escreva o que aconteceu no fim e mande para quem cuida da Academia (ou cole numa conversa com o Claude). Ele já inclui o modelo do aparelho, o navegador e os erros registrados.</p>
    <pre class="code" id="repTxt" style="white-space:pre-wrap">${esc(txt)}</pre><div class="row-h"><button class="btn primary" id="repCopy">Copiar</button></div></div>`;
  $('#modal').hidden = false; $('#repCopy').onclick = () => copyText(txt, $('#repTxt'));
}

/* ================= 7. DESAFIO DIÁRIO ================= */
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function dailyHTML(){
  const now = new Date(), key = dayKey(now), seed = Math.floor(new Date(key+'T12:00:00').getTime()/864e5);
  const Q = QUIZ[(seed * 7) % QUIZ.length]; const order = [0,1,2,3].slice(0, Q.o.length).sort((a,b) => ((seed*31 + a*17) % 7) - ((seed*31 + b*17) % 7));
  const D = S.dly || {}; const done = D.ans === key;
  return `<div class="panel stack-v" id="dailyBox"><div class="row-h" style="justify-content:space-between"><h3>Desafio do dia</h3><span class="pill ${D.streak>1?'good':''}">🔥 ${D.streak||0} dia(s) seguidos · recorde ${D.best||0}</span></div>
    <p class="muted" style="font-size:.88rem">Uma pergunta nova por dia. Responda todos os dias para manter a sequência.</p>
    <div class="ask" style="font-weight:800">${fmt(Q.q)}</div>
    <div class="stack-v" style="gap:6px">${order.map((oi,k)=>`<button class="opt ${done?(oi===Q.a?'right':oi===D.pick?'wrong':''):''}" data-dq="${oi}" ${done?'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${fmt(Q.o[oi])}</span></button>`).join('')}</div>
    ${done?`<div class="why ${D.pick===Q.a?'ok':'no'}"><b>${D.pick===Q.a?'Acertou!':'Resposta: '+esc(Q.o[Q.a])+'.'}</b> ${fmt(Q.e)} Volte amanhã para o próximo.</div>`:''}
    <button class="btn small" id="dailyPuz" style="align-self:flex-start">Quebra-cabeça do dia: ${esc(PUZ[seed % PUZ.length].t)}</button></div>`;
}
function bindDaily(){
  const box = $('#dailyBox'); if (!box) return;
  const now = new Date(), key = dayKey(now), seed = Math.floor(new Date(key+'T12:00:00').getTime()/864e5), Q = QUIZ[(seed * 7) % QUIZ.length];
  $$('[data-dq]', box).forEach(b => b.onclick = () => {
    const D = S.dly = S.dly || {streak:0, best:0}; const pick = +b.dataset.dq;
    const y = new Date(now.getTime() - 864e5); D.streak = D.last === dayKey(y) ? (D.streak||0) + 1 : D.last === key ? D.streak : 1;
    D.last = key; D.ans = key; D.pick = pick; D.best = Math.max(D.best||0, D.streak);
    if (pick === Q.a) { addXP(15); sfx('win'); } else sfx('no');
    save(); checkAch(); box.outerHTML = dailyHTML(); bindDaily();
  });
  $('#dailyPuz').onclick = () => { puz = {i: seed % PUZ.length, ans:null, order:null}; trTab = 'puz'; show('treino'); };
}

/* ================= 9. CRIADOR DE QUEBRA-CABEÇAS ================= */
let pzc = {t:'Meu quebra-cabeça', ol:5, ml:20, opp:'Grizzly Bears', me:'Goblin Guide, Mountain', hand:'Lightning Bolt', x:'O oponente tem 5 de vida. Como vencer neste turno?', o:['Atacar e conjurar Lightning Bolt no oponente','Conjurar Lightning Bolt nos Ursos','Passar o turno'], a:0, e:'O Goblin causa 2 e o Bolt mais 3: exatamente 5.'};
const b64e = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')))));
const splitNames = s => s.split(/[,\n]/).map(x => x.trim()).filter(Boolean).map(x => CARD_ALIAS[x.toLowerCase()] || x);
function pzBoard(p){ return {opp: splitNames(p.opp).map(n => C(n)), me: splitNames(p.me).map(n => C(n)), hand: splitNames(p.hand), life:[+p.ml||20, +p.ol||20]}; }
function renderPuzCreator(box){
  const names = Object.keys(CARDS).sort();
  box.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
   <form class="panel stack-v" id="pzcForm"><h3>Criar quebra-cabeça</h3><p class="muted">Monte uma situação de jogo, escreva a pergunta e compartilhe o link com os amigos. Nomes das cartas em inglês, separados por vírgula.</p>
    <datalist id="pzNames">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist>
    <label class="f" for="pzT">Título<input type="text" id="pzT" value="${esc(pzc.t)}"></label>
    <div class="grid g2"><label class="f" for="pzOl">Vida do oponente<input type="number" id="pzOl" value="${pzc.ol}"></label><label class="f" for="pzMl">Sua vida<input type="number" id="pzMl" value="${pzc.ml}"></label></div>
    <label class="f" for="pzOpp">Campo do oponente<input type="text" id="pzOpp" list="pzNames" value="${esc(pzc.opp)}"></label>
    <label class="f" for="pzMe">Seu campo (criaturas e terrenos)<input type="text" id="pzMe" list="pzNames" value="${esc(pzc.me)}"></label>
    <label class="f" for="pzHand">Sua mão<input type="text" id="pzHand" list="pzNames" value="${esc(pzc.hand)}"></label>
    <label class="f" for="pzX">Situação<textarea id="pzX" rows="3" style="font-family:var(--f-body)">${esc(pzc.x)}</textarea></label>
    ${pzc.o.map((o,i)=>`<div class="row-h" style="gap:6px"><input type="radio" name="pzA" id="pzA${i}" value="${i}" ${pzc.a===i?'checked':''} style="width:auto;min-height:0" aria-label="Alternativa ${i+1} é a correta"><input type="text" id="pzO${i}" value="${esc(o)}" placeholder="Alternativa ${i+1}" style="flex:1"></div>`).join('')}
    <p class="muted" style="font-size:.82rem">Marque a bolinha da alternativa correta.</p>
    <label class="f" for="pzE">Explicação<textarea id="pzE" rows="2" style="font-family:var(--f-body)">${esc(pzc.e)}</textarea></label>
    <div class="row-h"><button class="btn primary" type="button" id="pzLink">Copiar link para compartilhar</button><button class="btn" type="button" id="pzSave">Salvar</button></div>
    <p class="muted" style="font-size:.82rem">${location.protocol==='file:'?'O link só abre para outras pessoas quando a Academia estiver no site (leorios40.github.io/academia-mtg).':'Quem abrir o link vê o quebra-cabeça direto na Academia.'}</p></form>
   <div class="stack-v"><span class="eyebrow">Prévia</span><div id="pzPrev"></div>
    ${(S.myPuz||[]).length?`<div class="panel stack-v"><h3>Meus quebra-cabeças</h3>${S.myPuz.map((p,i)=>`<div class="row-h" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:6px 0"><span>${esc(p.t)}</span><span class="row-h" style="gap:6px"><button class="btn small" data-pzplay="${i}">Jogar</button><button class="btn small" data-pzedit="${i}">Editar</button><button class="icon-btn" data-pzdel="${i}" style="width:30px;height:30px" aria-label="Apagar">✕</button></span></div>`).join('')}</div>`:''}</div></div>`;
  const read = () => { pzc = {t:$('#pzT').value, ol:$('#pzOl').value, ml:$('#pzMl').value, opp:$('#pzOpp').value, me:$('#pzMe').value, hand:$('#pzHand').value, x:$('#pzX').value, o:[0,1,2].map(i=>$('#pzO'+i).value), a:+(($('input[name=pzA]:checked')||{}).value||0), e:$('#pzE').value}; };
  const prev = () => { read(); $('#pzPrev').innerHTML = `<div class="stack-v"><h3>${esc(pzc.t)}</h3>${boardHTML(pzBoard(pzc))}<p class="narr">${fmt(esc(pzc.x))}</p></div>`; };
  $('#pzcForm').oninput = prev; prev();
  $('#pzLink').onclick = () => { read(); const url = location.href.split('#')[0] + '#pz-' + b64e(pzc); copyText(url, $('#pzPrev')); };
  $('#pzSave').onclick = () => { read(); S.myPuz = S.myPuz || []; S.myPuz.push(JSON.parse(JSON.stringify(pzc))); save(); toast('Quebra-cabeça salvo'); renderPuzCreator(box); };
  $$('[data-pzplay]', box).forEach(b => b.onclick = () => playCustomPuz(S.myPuz[+b.dataset.pzplay]));
  $$('[data-pzedit]', box).forEach(b => b.onclick = () => { pzc = JSON.parse(JSON.stringify(S.myPuz[+b.dataset.pzedit])); renderPuzCreator(box); });
  $$('[data-pzdel]', box).forEach(b => b.onclick = () => { S.myPuz.splice(+b.dataset.pzdel,1); save(); renderPuzCreator(box); });
}
let customPuz = null;
function playCustomPuz(p){ customPuz = {p, ans:null}; trTab = 'custom'; show('treino'); }
function renderCustomPuz(box){
  if (!customPuz) { trTab = 'criar'; return renderPuzCreator(box); }
  const {p} = customPuz, ans = customPuz.ans != null;
  box.innerHTML = `<div class="stack-v"><span class="eyebrow">Quebra-cabeça compartilhado</span><h2>${esc(p.t)}</h2>${boardHTML(pzBoard(p))}<p class="narr">${fmt(esc(p.x))}</p>
    <div class="q"><div class="ask">Qual é a resposta?</div>${p.o.map((o,i)=>o?`<button class="opt ${ans?(i===p.a?'right':i===customPuz.ans?'wrong':''):''}" data-cp="${i}" ${ans?'disabled':''}><span class="k">${'ABC'[i]}</span><span>${fmt(esc(o))}</span></button>`:'').join('')}
    ${ans?`<div class="why ${customPuz.ans===p.a?'ok':'no'}"><b>${customPuz.ans===p.a?'Isso!':'Não foi dessa vez.'}</b> ${fmt(esc(p.e))}</div>`:''}</div>
    <div class="row-h"><button class="btn" id="cpNew">Criar o meu</button></div></div>`;
  $$('[data-cp]', box).forEach(b => b.onclick = () => { customPuz.ans = +b.dataset.cp; sfx(customPuz.ans===p.a?'win':'no'); renderCustomPuz(box); });
  $('#cpNew').onclick = () => { trTab = 'criar'; RENDER.treino(); };
}

/* ================= 10. SÍMBOLOS ================= */
const SYMS = [
 ['W','Mana branca'],['U','Mana azul'],['B','Mana preta'],['R','Mana vermelha'],['G','Mana verde'],['C','Mana incolor: só mana incolor de verdade paga.'],
 ['2','Mana genérica: qualquer tipo de mana paga. O número diz quanto.'],['X','Você escolhe o valor ao conjurar.'],['WU','Mana híbrida: pague com uma das duas cores.'],['2W','Híbrida com genérica: pague {W} ou {2}.'],
 ['WP','Mana phyrexiana: pague {W} ou 2 de vida.'],['S','Mana de neve: gerada por terrenos de neve.'],['T','Virar: gire a permanente de lado como custo.'],['Q','Desvirar: desvire a permanente como custo.'],['E','Energia: um marcador que você acumula e gasta depois.'],['CHAOS','Caos: usado no formato Planechase.']
];
function renderSymbols(){
  const img = (k, fb) => `<img src="https://svgs.scryfall.io/card-symbols/${k}.svg" alt="" width="36" height="36" onerror="this.outerHTML='${fb.replace(/'/g,'&#39;').replace(/"/g,'&quot;')}'">`;
  $('#rulesBody').innerHTML = `
   <p class="muted" style="margin-bottom:12px">Os símbolos que aparecem no custo e no texto das cartas.</p>
   <div class="sym-grid">${SYMS.map(([k,d])=>`<div class="sym">${img(k, manaSym(k.length===2&&!/\d|P/.test(k)?k[0]+'/'+k[1]:k==='WP'?'W/P':k))}<div><b class="mono">{${k.length===2&&/^[WUBRG]{2}$/.test(k)?k[0]+'/'+k[1]:k==='WP'?'W/P':k==='2W'?'2/W':k}}</b><p>${d}</p></div></div>`).join('')}</div>
   <div class="sub-h"><h2>Outros sinais da carta</h2></div>
   <div class="grid g2">
     <div class="panel stack-v"><h3>Raridade (cor do símbolo da coleção)</h3><div class="row-h"><span class="rar" style="background:#1a1718"></span> Comum (preto)</div><div class="row-h"><span class="rar" style="background:linear-gradient(135deg,#c8d0d8,#7c8a96)"></span> Incomum (prata)</div><div class="row-h"><span class="rar" style="background:linear-gradient(135deg,#f0d78c,#a5862c)"></span> Rara (dourado)</div><div class="row-h"><span class="rar" style="background:linear-gradient(135deg,#f6a35a,#c0461c)"></span> Mítica (laranja)</div></div>
     <div class="panel stack-v"><h3>Números e marcadores</h3>
       <p><b class="mono">3/4</b> no canto: poder / resistência da criatura.</p>
       <p><b class="mono">4</b> num escudo: lealdade inicial de um planeswalker. <b class="mono">+1</b>, <b class="mono">−3</b>: habilidades que mudam a lealdade.</p>
       <p><b>I, II, III</b> à esquerda: capítulos de uma Saga, que avançam a cada turno.</p>
       <p>Número no rodapé: número de colecionador, idioma e artista.</p></div>
   </div>
   <p class="muted" style="font-size:.85rem;margin-top:10px">Imagens dos símbolos: Scryfall. Sem internet, aparecem versões simplificadas.</p>`;
}

/* ================= 12. PRIMEIROS PASSOS (modo simples) ================= */
const SIMPLE = [
 ['Cada jogador começa com 20 vidas','Ganha quem deixar o outro com 0 vidas.','Serra Angel'],
 ['Terrenos dão energia','A energia do Magic se chama mana. Jogue 1 terreno por turno e vire-o de lado para usar a mana.','Forest'],
 ['Cartas custam mana','O custo fica no canto de cima. Esta custa 1 mana verde.','Llanowar Elves'],
 ['Criaturas lutam por você','O número de baixo: força / vida. 2/2 bate 2 e aguenta 2.','Grizzly Bears'],
 ['Atacar','No seu turno, vire suas criaturas para atacar. Se ninguém bloquear, o oponente perde vida.','Goblin Guide'],
 ['Bloquear','No turno do oponente, suas criaturas podem ficar na frente dos atacantes para proteger sua vida.','Giant Spider'],
 ['Mágicas','Algumas cartas fazem um efeito e vão embora, como este raio que causa 3 de dano.','Lightning Bolt'],
 ['Na vez de cada um','Compre 1 carta, jogue 1 terreno, use suas cartas, ataque e passe a vez.','Divination']
];
let simpleQ = {i:0, score:0, ans:null};
const SIMPLE_Q = [['Com quantas vidas cada jogador começa?',['20','10','7'],0],['Quantos terrenos posso jogar por turno?',['1','2','Quantos quiser'],0],['Uma criatura 2/2 bloqueia outra 2/2. O que acontece?',['As duas morrem','Nenhuma morre','Só a atacante morre'],0],['Para que servem os terrenos?',['Dar mana para usar as cartas','Atacar','Ganhar vida'],0]];
function renderSimple(){
  const q = SIMPLE_Q[simpleQ.i];
  $('#rulesBody').innerHTML = `
   <div class="simple-hero"><h2>Magic em 8 passos</h2><p>Para quem nunca jogou: crianças, iniciantes e quem quer explicar o jogo para alguém.</p></div>
   <div class="simple-grid">${SIMPLE.map(([t,d,c],i)=>`<div class="simple-card"><span class="simple-n">${i+1}</span>${cardHTML(c,{showPt:false})}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
   <div class="panel stack-v simple-quiz" style="margin-top:16px"><h3>Teste rápido</h3>
     ${simpleQ.i < SIMPLE_Q.length ? `<p class="ask" style="font-size:1.2rem;font-weight:800">${q[0]}</p><div class="stack-v">${q[1].map((o,k)=>`<button class="btn ${simpleQ.ans!=null?(k===q[2]?'primary':''):''}" data-sq="${k}" style="font-size:1.1rem;min-height:56px" ${simpleQ.ans!=null?'disabled':''}>${o}</button>`).join('')}</div>
       ${simpleQ.ans!=null?`<p style="font-size:1.1rem">${simpleQ.ans===q[2]?'⭐ Muito bem!':'Quase! A resposta é: '+q[1][q[2]]}</p><button class="btn primary" id="sqNext" style="font-size:1.1rem">Próxima</button>`:''}` :
       `<p style="font-size:1.3rem">🏆 Você acertou ${simpleQ.score} de ${SIMPLE_Q.length}!</p><p>Agora experimente a Lição 1 ou uma partida fácil contra o computador.</p><div class="row-h"><button class="btn primary" id="sqLesson">Lição 1</button><button class="btn" id="sqDuel">Partida fácil</button><button class="btn" id="sqAgain">Repetir</button></div>`}
   </div>`;
  $$('[data-sq]').forEach(b => b.onclick = () => { simpleQ.ans = +b.dataset.sq; if (simpleQ.ans === q[2]) { simpleQ.score++; sfx('win'); } else sfx('no'); renderSimple(); });
  const on = (id, f) => { const e = $('#'+id); if (e) e.onclick = f; };
  on('sqNext', () => { simpleQ.i++; simpleQ.ans = null; renderSimple(); });
  on('sqAgain', () => { simpleQ = {i:0, score:0, ans:null}; renderSimple(); });
  on('sqLesson', () => lessonGo(1));
  on('sqDuel', () => { duelSetup.mode = 'ai'; duelSetup.lvl = 'facil'; G = null; trTab = 'duelo'; show('treino'); });
}

/* ================= 11. COMPARAR COMANDANTES ================= */
let cmpCmd = [0, 6];
function cmdCompareHTML(){
  const [a, b] = cmpCmd.map(i => COMMANDERS[i]);
  const sel = (k) => `<select data-cc="${k}" aria-label="Comandante ${k+1}">${COMMANDERS.map((c,i)=>`<option value="${i}" ${cmpCmd[k]===i?'selected':''}>${esc(c.n)}</option>`).join('')}</select>`;
  const row = (l, f) => `<tr><td><b>${l}</b></td><td>${f(a)}</td><td>${f(b)}</td></tr>`;
  return `<div class="panel stack-v" id="cmpBox"><h3>Comparar dois comandantes</h3>
    <div class="grid g2">${sel(0)}${sel(1)}</div>
    <div class="row-h" style="justify-content:space-around">${cardHTML(a.n,{showPt:false})}${cardHTML(b.n,{showPt:false})}</div>
    <div class="tbl-wrap"><table><tbody>
      ${row('Cores', c => idSyms(c.id))}
      ${row('Custo', c => mana(cardData(c.n).c) + ` <span class="muted">(${cardData(c.n).cmc})</span>`)}
      ${row('Estilo', c => c.arch)}
      ${row('Dificuldade', c => `<span class="pill ${c.lv==='Fácil'?'good':c.lv==='Médio'?'warn':'bad'}">${c.lv}</span>`)}
      ${row('Plano', c => c.plan)}
      ${row('Por que começar', c => c.why)}
      ${row('Cuidado', c => c.watch)}
      ${row('Base de mana', c => c.id.length === 1 ? 'Simples (uma cor)' : c.id.length === 2 ? 'Média (duas cores)' : 'Exigente (' + c.id.length + ' cores)')}
      ${row('Mais informações', c => ext(edh(c.n),'EDHREC'))}
    </tbody></table></div></div>`;
}
function bindCmdCompare(){ $$('[data-cc]').forEach(s => s.onchange = () => { cmpCmd[+s.dataset.cc] = +s.value; $('#cmpBox').outerHTML = cmdCompareHTML(); bindCmdCompare(); }); }
