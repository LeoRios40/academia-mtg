/* ================= INÍCIO DO APP ================= */
(function(){ try { if (S.lite === undefined && navigator.deviceMemory && navigator.deviceMemory <= 4) { S.lite = true; S.liteAuto = true; save(); } } catch(e){} })();
applyPrefs(); applyTheme(); paintSound(); applyFoil();
const startHash = (location.hash||'').slice(1);
if (startHash.indexOf('pz-') === 0) { try { const p = b64d(startHash.slice(3)); customPuz = {p, ans:null}; trTab = 'custom'; show('treino'); } catch(e) { show('inicio'); } }
else { show(startHash || 'inicio'); if (!startHash) buildCover(); else maybeShowUpdates(); }
checkAch();
if (S.liteAuto && !S.liteTold) { S.liteTold = true; save(); setTimeout(() => toast('Modo leve ativado para este aparelho. Mude em Ajustes (engrenagem).'), 2500); }
if (S.ptNames) setTimeout(() => fetchPT(Object.keys(CARDS)), 3000);
try {
  let mt = null;
  new MutationObserver(() => { if (mt) return; mt = setTimeout(() => { mt = null; fillImages(); }, 60); }).observe(document.body, {childList:true, subtree:true});
} catch(e) {}
fillImages();
setTimeout(() => { loadSets().then(() => { const tw = $('#thisWeek'); if (tw) tw.innerHTML = thisWeekHTML(); }).catch(()=>{}); }, 1500);
(function(){ var b = document.getElementById('boot'); if (b) b.remove(); })();
