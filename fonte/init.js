/* ================= INÍCIO DO APP ================= */
applyPrefs(); applyTheme(); paintSound(); applyFoil();
const startHash = (location.hash||'').slice(1);
show(startHash || 'inicio');
if (!startHash) buildCover();
checkAch();
try {
  let mt = null;
  new MutationObserver(() => { if (mt) return; mt = setTimeout(() => { mt = null; fillImages(); }, 60); }).observe(document.body, {childList:true, subtree:true});
} catch(e) {}
fillImages();
setTimeout(() => { loadSets().then(() => { const tw = $('#thisWeek'); if (tw) tw.innerHTML = thisWeekHTML(); }).catch(()=>{}); }, 1500);
(function(){ var b = document.getElementById('boot'); if (b) b.remove(); })();
