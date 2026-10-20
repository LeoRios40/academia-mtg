/* ================= 18–19. AJUSTES: LETRA, CONTRASTE, MODO LEVE ================= */
function applyPrefs(){
  const r = document.documentElement;
  r.style.fontSize = (S.fs || 100) + '%';
  S.hc ? r.setAttribute('data-contrast','high') : r.removeAttribute('data-contrast');
  S.lite ? r.setAttribute('data-lite','1') : r.removeAttribute('data-lite');
}
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
function openSettings(){
  const box = $('#modalBox'); const dark = S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  box.innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button>
   <div class="info stack-v" style="grid-column:1/-1;gap:16px"><h2>Ajustes</h2>
    <div class="stack-v" style="gap:6px"><span class="eyebrow">Tamanho da letra</span><div class="row-h">${[90,100,115,130].map(v=>`<button class="chip" data-fs="${v}" aria-pressed="${(S.fs||100)===v}" style="font-size:${v/100}rem">${v===100?'Normal':v<100?'Menor':v===115?'Grande':'Muito grande'}</button>`).join('')}</div></div>
    <label class="chk" style="border:0"><input type="checkbox" id="setHc" ${S.hc?'checked':''}><span><b>Alto contraste</b><br><span class="muted">Textos e bordas mais fortes, para ler com mais facilidade.</span></span></label>
    <label class="chk" style="border:0"><input type="checkbox" id="setLite" ${S.lite?'checked':''}><span><b>Modo leve</b><br><span class="muted">Desliga animações, o céu estrelado da capa e o brilho das cartas. Recomendado para celulares mais simples.</span></span></label>
 <label class="chk" style="border:0"><input type="checkbox" id="setPt" ${S.ptNames?'checked':''}><span><b>Nomes das cartas em português</b><br><span class="muted">Mostra o nome oficial em português ao lado do nome em inglês (busca no Scryfall).</span></span></label>
    <label class="chk" style="border:0"><input type="checkbox" id="setSound" ${S.sound?'checked':''}><span><b>Sons</b></span></label>
    <label class="chk" style="border:0"><input type="checkbox" id="setDark" ${dark?'checked':''}><span><b>Tema escuro</b></span></label>
    <div class="row-h"><button class="btn" id="setTour">Fazer o tour</button><button class="btn" id="setVer">Histórico de versões</button>${installEvt?'<button class="btn primary" id="setInstall">Instalar como aplicativo</button>':''}</div>
    ${!installEvt ? `<p class="muted" style="font-size:.85rem">${location.protocol==='https:'?'Para instalar: no Chrome, abra o menu ⋮ e toque em "Adicionar à tela inicial".':'A instalação como aplicativo fica disponível quando a Academia estiver publicada num endereço da internet (veja o guia do GitHub Pages).'}</p>` : ''}
   </div>`;
  $('#modal').hidden = false;
  $$('[data-fs]', box).forEach(b => b.onclick = () => { S.fs = +b.dataset.fs; save(); applyPrefs(); openSettings(); });
  $('#setHc').onchange = e => { S.hc = e.target.checked; save(); applyPrefs(); };
  $('#setLite').onchange = e => { S.lite = e.target.checked; save(); applyPrefs(); applyFoil(); };
  $('#setSound').onchange = e => { S.sound = e.target.checked; save(); };
  $('#setDark').onchange = e => { S.theme = e.target.checked ? 'dark' : 'light'; save(); applyTheme(); };
  $('#setTour').onclick = () => { closeModal(); startTour(); };
  $('#setVer').onclick = () => openUpdates(false);
  $('#setPt').onchange = async e => { S.ptNames = e.target.checked; save(); if (S.ptNames) { toast('Buscando nomes em português…'); await fetchPT(Object.keys(CARDS)); toast('Nomes em português ativados'); } RENDER[currentView] && RENDER[currentView](); };
  const ins = $('#setInstall'); if (ins) ins.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; closeModal(); };
}

/* ================= BUSCA DE RECURSOS ================= */
const goT = t => () => { trTab = t; show('treino'); };
const goD = t => () => { deckTab = t; show('decks'); };
const goR = t => () => { rulesTab = t; show('regras'); };
const goC = k => () => { openCover(); setTimeout(() => { const b = $(`[data-x="${k}"]`); if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); }, 80); };
const FEATS = [
 ['Início','Nível, conquistas, trilha e carta do dia','inicio progresso xp trilha',()=>show('inicio')],
 ['Capa e extras','Roda das cores, extras para fãs e segredo','capa extras',openCover],
 ['Tour pela plataforma','Apresentação guiada de todas as áreas','tour ajuda tutorial',()=>startTour()],
 ['Ajustes','Tamanho da letra, contraste, modo leve, tema e som','configuração acessibilidade letra fonte contraste leve tema escuro som',openSettings],
 ['Manual de regras','Objetivo, cores, tipos de carta, zonas, pilha, formatos','manual regras',goR('manual')],
 ['Habilidades (palavras-chave)','Voar, atropelar, toque mortífero e outras, com exemplos','habilidades keywords palavras chave glossário',goR('hab')],
 ['O turno','As fases e etapas de um turno','turno fases etapas',goR('turno')],
 ['Anatomia da carta','O que cada parte da carta significa','anatomia carta partes',goR('anat')],
 ['Entenda seu deck','Importe do Arena ou do deck físico: funções, sinergias, combos e dicas','entenda analisar deck combos sinergia importar arena físico',goD('entenda')],
 ['Gerar deck para o Arena','Responda perguntas e receba um deck pronto para importar','gerar deck criar sugerir arena importar lista',goD('gerar')],
 ['Melhorar meu deck','Trocas sugeridas que você aceita ou recusa, e a lista otimizada para o Arena','otimizar melhorar deck arena trocas sugestões',goD('otimizar')],
 ['Importar deck','Do Arena, de planilha do Excel ou carta a carta','importar deck arena excel planilha csv colar',goD('importar')],
 ['Campanha','Sete capítulos contra o computador','campanha história capítulos',()=>{ duelSetup.mode='camp'; G=null; trTab='duelo'; show('treino'); }],
 ['Dois jogadores no mesmo aparelho','Ensine alguém jogando no mesmo celular','dois jogadores mesmo aparelho ensinar hotseat',()=>{ duelSetup.mode='pvp'; G=null; trTab='duelo'; show('treino'); }],
 ['Criar quebra-cabeça','Monte e compartilhe por link','criar quebra cabeça compartilhar link',goT('criar')],
 ['Desafio do dia','Uma pergunta nova por dia','desafio diário dia sequência',()=>show('inicio')],
 ['Primeiros passos','Magic em 8 passos, para quem nunca jogou','iniciante criança simples primeiros passos',goR('simples')],
 ['Símbolos das cartas','Mana, virar, energia, raridade','símbolos mana virar raridade',goR('simb')],
 ['Comparar comandantes','Dois comandantes lado a lado','comparar comandantes',()=>goFmt('commander')],
 ['Atualizações','O que mudou em cada versão','atualizações versões novidades histórico changelog',()=>openUpdates(false)],
 ['Lições práticas','12 situações de jogo com a mesa visual','lições aulas academia',()=>show('academia')],
 ['Quiz de regras e lore','Perguntas com explicação','quiz perguntas lore história',()=>show('quiz')],
 ['Partida contra o computador','Duelo completo 1 contra 1','jogar partida computador duelo ia',goT('duelo')],
 ['Simulador de deck','Commander e decks de exemplo, passo a passo e 1.000 partidas','simulador simulação goldfish commander krenko ezuri',goT('sim')],
 ['Quebra-cabeças','Vença neste turno','quebra cabeça puzzle enigma',goT('puz')],
 ['Treino de bloqueios','Escolha os melhores bloqueios','bloqueio bloquear defesa',goT('bloq')],
 ['Ler a mesa','Observe o campo e responda','ler mesa atenção memória',goT('ler')],
 ['Treino de mulligan','Manter ou trocar a mão','mulligan mão inicial',goT('mull')],
 ['Treino de pilha','Ordem de resolução','pilha stack ordem',goT('pilha')],
 ['Treino de Draft','Escolha a melhor carta do pacote','draft limitado pacote',goT('draft')],
 ['Contador de vida','Vida, veneno, comandante, dado e moeda','vida contador dado moeda veneno',()=>openLife()],
 ['Grupo e torneio','Jogadores, sorteio de mesas e torneio suíço','grupo amigos mesas sorteio torneio suíço ranking',goT('grupo')],
 ['Árbitro de bolso','Dúvidas de regras com resposta','juiz árbitro dúvida regra',goT('juiz')],
 ['Calculadora de combate','Monte uma luta e veja o resultado','combate calculadora dano',()=>show('combate')],
 ['Formatos: visão geral','Comparativo e qual formato é para você','formatos comparativo',()=>goFmt('geral')],
 ['Commander','Passo a passo, comandantes de exemplo, brackets','commander edh comandante bracket',()=>goFmt('commander')],
 ['Padrão (Standard)','Rotação e como montar','padrão standard rotação',()=>goFmt('padrao')],
 ['Pioneer, Modern, Pauper e outros','Outros formatos','pioneer modern pauper legacy vintage limitado draft selado',()=>goFmt('outros')],
 ['Guia do MTG Arena','Baixar, primeiros passos, montar deck no Arena','arena mtga digital celular pc',()=>goFmt('arena')],
 ['Coleções novas','Lançamentos e cartas aleatórias','coleções lançamentos novidades sets',()=>goFmt('colecoes')],
 ['Montador guiado de deck','Receita por formato, cores e estilo','montar deck montador receita',()=>goFmt('montar')],
 ['Na mesa: etiqueta','Frases, gírias e simulado da loja','etiqueta mesa loja gírias frases vocabulário',()=>goFmt('mesa')],
 ['Analisador de deck','Curva, cores, terrenos e alertas','analisador analisar deck lista curva',goD('analise')],
 ['Mão inicial','Testar mãos e mulligan','mão inicial mulligan',goD('mao')],
 ['Probabilidade','Calculadora hipergeométrica','probabilidade chance hipergeométrica',goD('prob')],
 ['Base de mana','Chance de ter as cores no turno certo','base mana cores terrenos fontes',goD('base')],
 ['Sugestões para o comandante','Cartas populares e do tema','sugestões comandante cartas edhrec',goD('sugestoes')],
 ['Orçamento','Preço do deck e alternativas baratas','orçamento preço custo dinheiro',goD('orcamento')],
 ['Comparar listas','O que entrou e saiu','comparar diferença versão',goD('comparar')],
 ['Minha coleção','Cartas que tenho e decks que consigo montar','coleção física minhas cartas',goD('colecao')],
 ['Lista de desejos','Acompanhe preços das cartas que quer','desejos wishlist preço',goD('desejos')],
 ['Desafios de construção','Pauper, curva baixa, highlander…','desafios',goD('desafios')],
 ['Decks famosos','Clássicos e recentes','decks famosos história',goD('famosos')],
 ['Central do Arena','Exportar, importar e diário de partidas','central arena diário partidas exportar importar',goD('arena')],
 ['Qual é a sua cor?','Teste de personalidade das cores','cor personalidade teste guilda',goC('cor')],
 ['Hall dos Planeswalkers','Personagens famosos','planeswalkers personagens',goC('pw')],
 ['Cartas lendárias','Power Nine e outras','cartas lendárias famosas black lotus',goC('icon')],
 ['Linha do tempo','De 1993 até hoje','linha do tempo história',goC('tl')],
 ['Curiosidades','Fatos antigos e recentes','curiosidades fatos',goC('facts')],
 ['Galeria de artistas','Ilustradores e busca por artista','artistas ilustradores arte',goC('art')],
 ['Mapa do Multiverso','Os planos do Magic','multiverso planos mapa',goC('map')],
 ['Adivinhe a carta','Descubra a carta pela ilustração','adivinhe jogo ilustração',goC('guess')],
 ['Evolução das molduras','A mesma carta em várias épocas','molduras frames evolução',goC('frames')],
 ['Levar o progresso para outro aparelho','Exportar e importar','backup exportar importar progresso',()=>{ show('inicio'); setTimeout(()=>{ const b = $('#bkFile'); b && b.scrollIntoView({block:'center'}); }, 80); }]
];
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function openSearch(){
  let ov = $('#srch'); if (!ov) { ov = document.createElement('div'); ov.id = 'srch'; ov.className = 'modal'; document.body.append(ov); }
  ov.hidden = false;
  ov.innerHTML = `<div class="modal-box srch-box"><div class="search" style="margin:0"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="text" id="srchQ" placeholder="O que você procura? Ex.: simulador, comandante, vida…" autocomplete="off"></div><div id="srchL" class="srch-l"></div><button class="btn small" id="srchX" style="justify-self:end">Fechar</button></div>`;
  const close = () => { ov.hidden = true; };
  const draw = () => { const q = norm($('#srchQ').value.trim()); const L = FEATS.filter(f => !q || norm(f[0]+' '+f[1]+' '+f[2]).includes(q)).slice(0, 30);
    $('#srchL').innerHTML = L.length ? L.map((f,i)=>`<button class="srch-i" data-fi="${FEATS.indexOf(f)}"><b>${f[0]}</b><span>${f[1]}</span></button>`).join('') : '<p class="muted">Nada encontrado.</p>';
    $$('[data-fi]', ov).forEach(b => b.onclick = () => { close(); FEATS[+b.dataset.fi][3](); }); };
  $('#srchQ').oninput = draw; $('#srchQ').onkeydown = e => { if (e.key === 'Enter') { const f = $('[data-fi]', ov); f && f.click(); } if (e.key === 'Escape') close(); };
  $('#srchX').onclick = close; ov.onclick = e => { if (e.target === ov) close(); };
  draw(); setTimeout(() => $('#srchQ').focus(), 30);
}
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); } });

/* ================= TOUR ================= */
const TOUR = [
 {v:'inicio', s:'.brand', t:'Bem-vindo à Academia', d:'Este tour mostra onde fica cada coisa. Você pode refazê-lo quando quiser pelo botão "?" no topo ou pela busca.'},
 {v:'inicio', s:'.tabs', t:'As sete áreas', d:'A barra de navegação leva às sete áreas da plataforma. No celular ela fica embaixo da tela.'},
 {v:'inicio', s:'.trail', t:'A trilha do zero à mesa', d:'Siga as etapas na ordem. Quem completa a trilha sabe jogar, montar decks e se portar numa mesa de veteranos.'},
 {v:'regras', s:'#v-regras .seg', t:'Regras', d:'Manual com busca, as habilidades com exemplos, o turno fase a fase e a anatomia da carta.'},
 {v:'academia', s:'#lessonList', t:'Lições práticas', d:'Doze situações de jogo. Você lê a mesa, responde e vê o resultado.'},
 {v:'quiz', s:'#v-quiz .panel', t:'Quiz', d:'Perguntas de regras, formatos, mesa e lore, sempre com explicação.'},
 {v:'treino', s:'#v-treino .seg', t:'Treino', d:'Jogue contra o computador, simule decks de Commander, resolva quebra-cabeças, treine bloqueios, mulligan, pilha e Draft. Aqui também ficam o contador de vida e o grupo de amigos.'},
 {v:'formatos', s:'#v-formatos .seg', t:'Formatos', d:'Commander, Padrão e os outros formatos, o guia do MTG Arena, as coleções novas, o montador guiado e a etiqueta de mesa.'},
 {v:'decks', s:'#v-decks .seg', t:'Decks', d:'Analise sua lista, veja preço, base de mana e sugestões, compare versões, cadastre sua coleção e leve o deck para o Arena.'},
 {v:'decks', s:'#btnSearch', t:'Busca', d:'Não lembra onde fica algo? Toque na lupa e digite: "vida", "simulador", "comandante"… No PC, o atalho é Ctrl + K.'},
 {v:'decks', s:'#btnSet', t:'Ajustes', d:'Aumente a letra, ative o alto contraste ou o modo leve (para celulares mais simples), troque o tema e os sons.'},
 {v:'inicio', s:'#btnTour', t:'Pronto!', d:'O tour fica sempre aqui. Boa jornada, planeswalker!'}
];
let tourI = 0;
function startTour(){ tourI = 0; drawTour(); }
function drawTour(){
  let ov = $('#tour'); if (!ov) { ov = document.createElement('div'); ov.id = 'tour'; document.body.append(ov); }
  const st = TOUR[tourI]; if (currentView !== st.v) show(st.v);
  ov.hidden = false;
  requestAnimationFrame(() => {
    const el = $(st.s); if (el && el.scrollIntoView) el.scrollIntoView({block:'center'});
    setTimeout(() => {
      const r = el ? el.getBoundingClientRect() : {left:innerWidth/2-60, top:innerHeight/2-30, width:120, height:60};
      const pad = 6, top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), w = Math.min(innerWidth - 8, r.width + pad*2), h = r.height + pad*2;
      const below = top + h + 220 < innerHeight, above = top > 240;
      ov.innerHTML = `<div class="tour-hole" style="top:${top}px;left:${left}px;width:${w}px;height:${h}px"></div>
        <div class="tour-card" style="${below?`top:${Math.min(innerHeight-220, top+h+10)}px`:above?`bottom:${Math.min(innerHeight-230, Math.max(10, innerHeight-top+10))}px`:'bottom:16px'}">
          <span class="eyebrow">${tourI+1} de ${TOUR.length}</span><h3>${st.t}</h3><p>${st.d}</p>
          <div class="row-h" style="justify-content:space-between"><button class="btn small" id="tSkip">Sair do tour</button><span class="row-h"><button class="btn small" id="tPrev" ${tourI===0?'disabled':''}>←</button><button class="btn small primary" id="tNext2">${tourI===TOUR.length-1?'Concluir':'Próximo →'}</button></span></div></div>`;
      $('#tSkip').onclick = endTour; $('#tPrev').onclick = () => { tourI--; drawTour(); };
      $('#tNext2').onclick = () => { if (tourI === TOUR.length-1) { endTour(); if (!S.tourDone) { S.tourDone = true; addXP(20); save(); } return; } tourI++; drawTour(); };
    }, 260);
  });
}
function endTour(){ const ov = $('#tour'); if (ov) ov.hidden = true; }

/* ================= 1–2. PUBLICAÇÃO (GitHub Pages) E APLICATIVO ================= */
if (location.protocol === 'https:') {
  try { const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.webmanifest'; document.head.append(l); } catch(e){}
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
