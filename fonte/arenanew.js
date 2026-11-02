/* ================= v4.0: ATALHO "NOVO DECK PARA O ARENA" ================= */
function anStart(){
  asd = {step:1, fmt:null, a:{tribe:'goblin'}, colsPick:null, rec:null, choice:null, cmdOpts:null, cmd:null, plan:null, res:null, busy:false, vari:0, own:'arena', arenaOnly:true};
  ownSt.ready = false; deckTab = 'gerar'; show('construir'); window.scrollTo({top:0});
}
function anCardHTML(){
  const n = Object.keys(S.acoll || {}).length;
  return `<div class="an-card stack-v"><b class="an-t">Criar um deck novo para o MTG Arena</b>
    <p class="muted" style="margin:0;font-size:.92rem">${n ? `Usando as suas ${n} cartas do Arena.` : 'Dá para usar mesmo sem a coleção cadastrada; com ela, a Academia prefere as cartas que você já tem.'}</p>
    <ol class="an-steps"><li><b>Formato do Arena</b><small>Padrão, Histórico, Brawl…</small></li><li><b>Perguntas</b><small>Estilo, ritmo, cores</small></li><li><b>Copiar e importar</b><small>No Arena: Decks → Importar</small></li></ol>
    <button class="btn primary" id="anGo">Começar o deck do zero</button></div>`;
}
/* cartão logo abaixo da área do link do Untapped */
(function(){
  const rc = renderACollection;
  renderACollection = function(){
    rc();
    const ref = $('#deckBody .unt-box'); if (!ref || $('#anGo')) return;
    ref.insertAdjacentHTML('afterend', anCardHTML());
    $('#anGo').onclick = anStart;
  };
})();
/* passo 1: só formatos do Arena */
(function(){
  const s1 = asS1;
  asS1 = function(){
    let h = s1(); if (!asd.arenaOnly) return h;
    Object.keys(AF).filter(k => !AF[k].arena).forEach(k => { h = h.replace(new RegExp(`<button data-af="${k}"[\\s\\S]*?</button>`), ''); });
    h = h.replace(/<p class="muted" style="font-size:\.88rem">Commander não existe[\s\S]*?<\/p>/, '<p class="muted" style="font-size:.88rem">Só aparecem formatos que existem no MTG Arena. Quer jogar Commander no Arena? Escolha <b>Brawl no Arena</b>.</p>');
    return `<div class="an-banner"><b>Novo deck para o MTG Arena</b><span>Primeiro escolha o formato do Arena. Depois vêm as perguntas e, no fim, a lista para importar no Arena.</span><button class="btn small" id="anAll">Ver também formatos de mesa</button></div>` + h;
  };
  const s5 = asS5;
  asS5 = function(){
    const h = s5(); if (!asd.arenaOnly || !asd.res) return h;
    return `<div class="an-done stack-v"><b class="an-t">Pronto! Agora leve para o Arena</b>
      <ol class="an-steps"><li><b>Copie</b><small>Toque no botão abaixo</small></li><li><b>Abra o Arena</b><small>Vá em Decks</small></li><li><b>Importe</b><small>Toque em Importar</small></li></ol>
      <div class="row-h"><button class="btn primary" id="anCopy">Copiar para o Arena</button><button class="btn" id="anSave">Salvar em Meus decks</button></div>
      <small class="muted">A Academia confere se todas as cartas existem no Arena antes de copiar.</small></div>` + h;
  };
  const ba = bindAssist;
  bindAssist = function(){
    ba.apply(this, arguments);
    const al = $('#anAll'); if (al) al.onclick = () => { asd.arenaOnly = false; renderAssist(); };
    const cp = $('#anCopy'); if (cp) cp.onclick = () => copyForArena(asd.res.list, asd.res.cmd || '');
    const sv = $('#anSave'); if (sv) sv.onclick = () => { const b = $('[data-savedeck="asRes"]'); if (b) b.click(); else openSaveDialog(arenaList(asd.res.list, asd.res.cmd), {cmd: asd.res.cmd || '', fmt: asd.fmt}); };
  };
})();
/* sair do Construir com outro caminho desliga o modo Arena */
(function(){ const d0 = DECK_R; DECK_R = () => { const m = d0(); Object.keys(m).forEach(k => { if (k !== 'gerar') { const f = m[k]; m[k] = function(){ asd.arenaOnly = false; return f.apply(this, arguments); }; } }); return m; }; })();
FEATS.push(['Novo deck para o Arena','Do zero: formato do Arena, perguntas e lista para importar','criar deck novo arena do zero importar brawl padrão histórico minhas cartas coleção',anStart]);
