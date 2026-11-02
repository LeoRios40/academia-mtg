/* ================= v3.7: INSTALAR COMO APLICATIVO ================= */
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
function installCardHTML(){
  if (isStandalone() || S.instHide) return '';
  const can = typeof installEvt !== 'undefined' && installEvt;
  const file = location.protocol === 'file:';
  return `<section class="inst-card" aria-label="Instalar o aplicativo"><div class="inst-ic" aria-hidden="true"><img src="${file ? SITE : ''}icon-192.png" alt="" onerror="this.remove()"></div>
    <div class="inst-t"><b>Instale a Academia como aplicativo</b><small>Abre em tela cheia, com ícone na tela inicial, mais rápido e funcionando mesmo sem internet depois da primeira visita.</small>
    ${file ? `<small>Você abriu o arquivo direto do celular. Para instalar, abra o site: <a href="${SITE}" target="_blank" rel="noopener">${SITE.replace('https://','')}</a></small>` : can ? '' : isIOS() ? '<small><b>No iPhone:</b> no Safari, toque em Compartilhar (quadrado com seta) → <b>Adicionar à Tela de Início</b>.</small>' : '<small><b>No Android:</b> no Chrome, toque no menu ⋮ → <b>Instalar app</b> (ou "Adicionar à tela inicial"). <b>No PC:</b> clique no ícone de instalar na barra de endereço.</small>'}</div>
    <div class="inst-b">${can ? '<button class="btn primary" id="instGo">Instalar</button>' : ''}<button class="btn small" id="instX">Agora não</button></div></section>`;
}
(function(){
  const r0 = RENDER.inicio;
  RENDER.inicio = function(){
    r0();
    const html = installCardHTML(); if (!html) return;
    const q = $('#v-inicio .quick'); if (q) q.insertAdjacentHTML('afterend', html); else $('#v-inicio').insertAdjacentHTML('afterbegin', html);
    const g = $('#instGo'); if (g) g.onclick = async () => { try { installEvt.prompt(); const r = await installEvt.userChoice; installEvt = null; if (r && r.outcome === 'accepted') { S.instHide = true; save(); } RENDER.inicio(); } catch(e){} };
    $('#instX').onclick = () => { S.instHide = true; save(); const c = $('.inst-card'); if (c) c.remove(); };
  };
  addEventListener('beforeinstallprompt', () => setTimeout(() => { if (currentView === 'inicio' && !$('#instGo')) RENDER.inicio(); }, 50));
  addEventListener('appinstalled', () => { S.instHide = true; save(); toast('Academia instalada! Procure o ícone na sua tela inicial.'); });
})();
FEATS.push(['Instalar como aplicativo','Ícone na tela inicial, tela cheia e uso sem internet','instalar app aplicativo celular android iphone tela inicial apk',() => { S.instHide = false; save(); show('inicio'); setTimeout(() => { const c = $('.inst-card'); if (c) c.scrollIntoView({block:'center'}); }, 80); }]);
