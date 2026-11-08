/* ================= v3.9: COLEÇÃO PELO LINK DO UNTAPPED ================= */
const UNT_API = 'https://api.mtga.untapped.gg/api/v1/account/collections/';
const UNT_META = 'https://mtgajson.untapped.gg/v1/latest/';
function untParse(u){ const m = /\/profile\/([a-f0-9-]{20,})\/([A-Za-z0-9]{6,})/.exec(u || ''); return m ? {uid:m[1], pid:m[2]} : null; }
/* transforma a coleção do Untapped (grpid + quantidade) em lista "4 Nome" */
function untBuild(coll, cards, loc){
  const L = {}; (loc || []).forEach(x => { if (x && x.id != null) L[x.id] = x.text; });
  const G = {}; (cards || []).forEach(c => { if (c && c.grpid != null) G[c.grpid] = c; });
  const U = {};
  ((coll && coll.cards) || []).forEach(e => {
    const c = G[e.grpid]; if (!c) return;
    const ty = c.types || [], su = c.supertypes || [];
    if (ty.indexOf(5) >= 0 && (su.indexOf(1) >= 0 || su.indexOf('Basic') >= 0 || [647,648,652,653,1250].indexOf(c.titleId) >= 0)) return;
    const n = String(c.name || L[c.titleId] || '').replace(/<[^>]+>/g, '').trim(); if (!n) return;
    U[n] = (U[n] || 0) + (e.quantity || 0);
  });
  return Object.keys(U).sort().map(n => Math.min(4, U[n]) + ' ' + n).join('\n');
}
/* código que roda NA página do Untapped (favorito ou console): lá o navegador permite ler a coleção */
function untRemote(target, isFile){
  var m = /\/profile\/([a-f0-9-]{20,})\/([A-Za-z0-9]{6,})/.exec(location.href);
  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:auto 16px 16px auto;z-index:2147483647;width:min(92vw,440px);background:#16131d;color:#f3ead6;border:2px solid #d9ac4e;border-radius:14px;padding:16px;font:15px/1.45 system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.6)';
  document.body.appendChild(box);
  var say = function(h){ box.innerHTML = '<b style="font-size:17px;color:#f3d68c">Academia do Planeswalker</b><div style="margin-top:8px">' + h + '</div>'; };
  if (!m) { say('Abra primeiro a página da sua <b>coleção</b> no Untapped (endereço com /profile/…/collection) e clique de novo no favorito. <button id="apX" style="margin-top:10px">Fechar</button>'); box.querySelector('#apX').onclick = function(){ box.remove(); }; return; }
  say('Lendo a sua coleção… isso pode levar alguns segundos.');
  var j = function(u, o){ return fetch(u, o).then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); }); };
  Promise.all([
    j('https://api.mtga.untapped.gg/api/v1/account/collections/' + m[2] + '?user_id=' + m[1], {credentials:'include'}).catch(function(){ return j('https://api.mtga.untapped.gg/api/v1/account/collections/' + m[2] + '?user_id=' + m[1]); }),
    j('https://mtgajson.untapped.gg/v1/latest/cards.json'), j('https://mtgajson.untapped.gg/v1/latest/loc_en.json')
  ]).then(function(r){
    var L = {}; r[2].forEach(function(x){ if (x && x.id != null) L[x.id] = x.text; });
    var G = {}; r[1].forEach(function(c){ if (c && c.grpid != null) G[c.grpid] = c; });
    var U = {};
    (r[0].cards || []).forEach(function(e){ var c = G[e.grpid]; if (!c) return; var ty = c.types || [], su = c.supertypes || [];
      if (ty.indexOf(5) >= 0 && (su.indexOf(1) >= 0 || su.indexOf('Basic') >= 0 || [647,648,652,653,1250].indexOf(c.titleId) >= 0)) return;
      var n = String(c.name || L[c.titleId] || '').replace(/<[^>]+>/g, '').trim(); if (n) U[n] = (U[n] || 0) + (e.quantity || 0); });
    var t = Object.keys(U).sort().map(function(n){ return Math.min(4, U[n]) + ' ' + n; }).join('\n');
    if (!t) throw new Error('vazia');
    var B = 'display:inline-block;margin:10px 6px 6px 0;padding:10px 16px;border-radius:10px;font-weight:800;text-decoration:none;cursor:pointer;border:0;font-size:15px';
    var go = '<a id="apGo" href="' + target + '#untcoll=' + encodeURIComponent(t) + '" target="_blank" rel="noopener" style="' + B + ';background:' + (isFile ? '#3a3346;color:#f3ead6' : '#d9ac4e;color:#1b1408') + '">' + (isFile ? 'Ou abrir no site' : 'Abrir na Academia e adicionar') + '</a>';
    var cp = '<button id="apCp" style="' + B + ';background:' + (isFile ? '#d9ac4e;color:#1b1408' : '#3a3346;color:#f3ead6') + '">Copiar lista</button>';
    say('Encontrei <b>' + Object.keys(U).length + ' cartas diferentes</b>.<br>' + (isFile ? cp + go + '<br><small>Você usa a Academia pelo <b>arquivo HTML</b>: copie a lista, volte para o arquivo e, em Arena e coleção → Coleção do Arena, toque em <b>Colar a lista copiada</b>.</small>' : go + cp + '<br><small>Se não abrir, copie a lista e cole na Academia em Arena e coleção → Coleção do Arena.</small>') + '<textarea readonly style="width:100%;height:80px;margin-top:8px;font-size:12px"></textarea><button id="apX">Fechar</button>');
    box.querySelector('textarea').value = t;
    box.querySelector('#apCp').onclick = function(){ var ta = box.querySelector('textarea'); ta.select(); var me = this; var ok = function(){ me.textContent = 'Lista copiada! Agora cole na Academia'; }; try { navigator.clipboard.writeText(t).then(ok, function(){ document.execCommand('copy'); ok(); }); } catch(e){ document.execCommand('copy'); ok(); } };
    box.querySelector('#apX').onclick = function(){ box.remove(); };
  }).catch(function(){ say('Não consegui ler a coleção. Confira se o perfil está <b>Público</b> no Untapped e se você está na página da coleção, recarregue e tente de novo. <button id="apX" style="margin-top:10px">Fechar</button>'); box.querySelector('#apX').onclick = function(){ box.remove(); }; });
}
function untTarget(){ return /^https?:/.test(location.protocol) ? location.origin + location.pathname : SITE; }
function untCode(){ return '(' + untRemote.toString() + ')(' + JSON.stringify(untTarget()) + ',' + (location.protocol === 'file:') + ')'; }
function untBookmarklet(){ return 'javascript:' + encodeURIComponent(untCode()); }
/* tentativa direta (funciona se o Untapped liberar o acesso para outros sites) */
async function untDirect(ids, st){
  const j = async u => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.json(); };
  st('Conectando ao Untapped…');
  const coll = await j(UNT_API + ids.pid + '?user_id=' + ids.uid);
  st('Coleção encontrada. Baixando os nomes das cartas (pode demorar um pouco)…');
  const [cards, loc] = await Promise.all([j(UNT_META + 'cards.json'), j(UNT_META + 'loc_en.json')]);
  return untBuild(coll, cards, loc);
}
function untHelpHTML(){
  return `<div class="unt-help stack-v"><b>O navegador não deixou a Academia ler o Untapped direto.</b> Isso é uma proteção normal dos sites. Faça assim (no PC, uma vez só):
    <ol>
      <li>Mostre a barra de favoritos (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>) e <b>arraste este botão para ela</b>: <a class="btn small primary unt-bm" href="${esc(untBookmarklet())}" onclick="event.preventDefault();toast('Arraste este botão para a barra de favoritos.')">Enviar coleção para a Academia</a></li>
      <li>Abra a página da sua coleção no Untapped (o link que você colou) e <b>clique no favorito</b>.</li>
      <li>Aparece uma janela da Academia no canto da página: clique em <b>Abrir na Academia e adicionar</b>.</li></ol>
    <details><summary>Não consegui arrastar</summary><p>Outro jeito: na página da coleção do Untapped, aperte <kbd>F12</kbd>, abra a aba <b>Console</b>, cole o código abaixo e aperte Enter. Se o Chrome pedir, digite <code>allow pasting</code> antes.</p>
      <button class="btn small" id="untCp">Copiar código</button></details></div>`;
}
(function(){
  const rc = renderACollection;
  renderACollection = function(){
    rc();
    const h = $('#deckBody .panel > h3'); if (!h || $('#untUrl')) return;
    const anchor = $('#deckBody .gd-link') || h;
    anchor.insertAdjacentHTML('afterend', `<div class="unt-box stack-v"><label class="f" for="untUrl"><b>Cole aqui a URL da sua coleção do Untapped</b>
      <input type="url" id="untUrl" inputmode="url" autocomplete="off" placeholder="https://mtga.untapped.gg/profile/…/collection"></label>
      <div class="row-h"><button class="btn primary" id="untGo">Buscar minha coleção</button><button class="btn" id="untPaste" title="Depois de usar o favorito no Untapped e tocar em Copiar lista">Colar a lista copiada</button><span class="muted" id="untSt" style="font-size:.9rem"></span></div><div id="untOut"></div></div>`);
    const st = m => { const e = $('#untSt'); if (e) e.textContent = m; };
    const go = async raw => {
      const ids = untParse(raw);
      if (!ids) { st('Esse não parece o link da coleção. Ele tem este formato: mtga.untapped.gg/profile/…/…/collection'); return; }
      S.untUrl = raw; save();
      $('#untGo').disabled = true;
      try {
        const t = await untDirect(ids, st);
        if (!t) throw new Error('vazia');
        $('#acTxt').value = t; st('Lista recebida. Adicionando à coleção…'); $('#acAdd').click();
      } catch(e) {
        st(''); $('#untOut').innerHTML = untHelpHTML(); $('#untGo').disabled = false;
        const cp = $('#untCp'); if (cp) cp.onclick = () => { navigator.clipboard.writeText(untCode()).then(() => toast('Código copiado.'), () => toast('Não consegui copiar.')); };
      }
    };
    if (S.untUrl) $('#untUrl').value = S.untUrl;
    $('#untPaste').onclick = async () => { try { const t = (await navigator.clipboard.readText() || '').trim(); if (!t || /^https?:/i.test(t)) throw 0; $('#acTxt').value = t; st('Lista colada. Adicionando à coleção…'); $('#acAdd').click(); } catch(e) { const ta = $('#acTxt'); ta.scrollIntoView({block:'center'}); ta.focus(); toast('Aperte Ctrl+V (ou toque e segure → Colar) na caixa e depois em Adicionar à coleção.'); } };
    $('#untGo').onclick = () => go($('#untUrl').value.trim());
    $('#untUrl').onkeydown = e => { if (e.key === 'Enter') go(e.target.value.trim()); };
    /* se colarem o link na caixa de lista, também funciona */
    const add = $('#acAdd'), a0 = add.onclick;
    add.onclick = () => { const t = $('#acTxt').value.trim(); if (/^https?:\/\/\S*untapped\.gg\S*$/i.test(t)) { $('#acTxt').value = ''; $('#untUrl').value = t; go(t); } else a0(); };
  };
})();
/* chegada pelo favorito: #untcoll=<lista> */
const untIncoming = (function(){
  const h = location.hash || ''; if (h.indexOf('#untcoll=') !== 0) return null;
  let t = ''; try { t = decodeURIComponent(h.slice(9)); } catch(e) {}
  try { history.replaceState(null, '', location.pathname + location.search + '#arena'); } catch(e) {}
  deckTab = 'acoll';
  return t;
})();
if (untIncoming) setTimeout(function untFill(){
  const ta = $('#acTxt'), b = $('#acAdd');
  if (!ta || !b) { deckTab = 'acoll'; show('arena'); return setTimeout(untFill, 400); }
  ta.value = untIncoming; b.click(); toast('Recebi a sua coleção do Untapped. Conferindo as cartas…');
}, 600);
