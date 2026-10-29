/* ================= v3.2: ÍCONES DAS FERRAMENTAS, ATALHOS DA PÁGINA INICIAL E TOUR ATUALIZADO ================= */
const IC = {
  import:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>', star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>', wand:'<path d="M4 20L16 8"/><path d="M15 3v3M18 6h3M19 2l1 1M13 5l1 1"/>',
  swap:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>', sword:'<path d="M14 4h6v6L9 21l-6-6z"/><path d="M5 13l6 6"/>', compass:'<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-4 1 2-5z"/>',
  trophy:'<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>', chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  hand:'<rect x="2" y="7" width="7" height="12" rx="1" transform="rotate(-12 5.5 13)"/><rect x="8.5" y="5" width="7" height="12" rx="1"/><rect x="15" y="7" width="7" height="12" rx="1" transform="rotate(12 18.5 13)"/>',
  percent:'<path d="M5 19L19 5"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>', drop:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>', compare:'<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>',
  box:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 3v18M11 8h5M11 12h5"/>', coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M10 9l5 3-5 3z"/>', cards:'<rect x="3" y="5" width="12" height="16" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>', heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  robot:'<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01"/>', play:'<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
  puzzle:'<path d="M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v6H3V3z"/>', pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/>', shieldb:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>', layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14.5c3 0 6 2 6 5"/>', gavel:'<path d="M14 4l6 6M11 7l6 6M8 10l6-6M10 12L3 19l2 2 7-7"/>',
  game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2"/>', teach:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/><path d="M7 9h6M7 12h4"/>'
};
const TAB_IC = {surv:'game', importar:'import', otimizar:'star', entenda:'book', gerar:'wand', side:'swap', testar:'sword', guia:'compass', desafios:'trophy', analise:'chart', mao:'hand', prob:'percent', base:'drop', sugestoes:'bulb', comparar:'compare',
  biblioteca:'box', preco:'coin', link:'link', proxies:'print', arena:'shield', acoll:'cards', famosos:'crown', colecao:'cards', desejos:'heart', duelo:'robot', sim:'play', puz:'puzzle', criar:'pen', bloq:'shieldb', ler:'eye', mull:'refresh', pilha:'layers', draft:'grid', vida:'heart', grupo:'users', juiz:'gavel', calc:'calc'};
const TAB_HINT = {surv:'Ação: sobreviva 10 minutos', gerar:'Perguntas → deck pronto', otimizar:'Trocas que você aprova', entenda:'Estilo, combos e dicas', side:'15 de reserva e trocas', testar:'Jogue com o seu deck', guia:'Regras de ouro', desafios:'Treine a montagem',
  analise:'Curva, cores e terrenos', mao:'Compre 7 e decida', prob:'Chance de comprar', base:'Terrenos por cor', sugestoes:'Cartas para o deck', comparar:'O que mudou entre listas',
  biblioteca:'Decks e versões', importar:'Arena, planilha ou à mão', preco:'Quanto custa no papel', link:'Mande no WhatsApp', proxies:'Folhas A4 para testar',
  arena:'Leve o deck ao Arena', acoll:'Suas cartas no Arena', famosos:'Clássicos e atuais', colecao:'Suas cartas em casa', desejos:'Cartas que você quer',
  duelo:'Contra o computador', sim:'Em que turno vence', puz:'Vença neste turno', criar:'Monte e compartilhe', bloq:'A melhor defesa', ler:'Ameaças e prioridades', mull:'Fico ou troco?', pilha:'Ordem das mágicas', draft:'Escolha de pacotes',
  vida:'2 a 6 jogadores', grupo:'Mesas e suíço', juiz:'Dúvidas de mesa', calc:'Ataque e bloqueio'};
const svgI = k => `<svg class="tool-ic" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || IC.cards}</svg>`;
function toolIcon(tab){ return svgI(TAB_IC[tab]); }

/* ---------- página inicial: continuar e atalhos ---------- */
const QUICK = [
  ['import','Importar meu deck','Do Arena, de planilha ou à mão','meus',() => { deckTab = 'importar'; show('meus'); }],
  ['wand','Criar deck do zero','Responda perguntas e receba o deck','construir',() => { deckTab = 'gerar'; show('construir'); }],
  ['star','Melhorar meu deck','Trocas sugeridas para aprovar','construir',() => { deckTab = 'otimizar'; show('construir'); }],
  ['game','Jogo: Sobreviva ao Multiverso','Ação estilo survivors com mágicas do Magic','treino',() => { trTab = 'surv'; show('treino'); }],
  ['robot','Jogar contra o computador','Partida rápida em 3 níveis','treino',() => { trTab = 'duelo'; show('treino'); }],
  ['book','Aprender do zero','Primeiros passos, sem complicação','regras',() => { rulesTab = 'simples'; show('regras'); }],
  ['teach','Modo professor','Ensine Magic na TV ou no projetor','academia',() => openTeach(0, 0)]
];
function quickHTML(){
  const L = S.lastTool;
  return `<section class="quick" aria-label="Atalhos">
    ${L ? `<button class="qk qk-cont" data-qcont="1"><span class="qk-k">Continuar de onde parou</span><b>${esc(L.l)}</b><small>${esc(L.h)}</small>${svgI(TAB_IC[L.tab])}</button>` : ''}
    ${QUICK.map(([ic,t,d,sec],i) => `<button class="qk" data-qk="${i}" data-sec="${sec}">${svgI(ic)}<b>${t}</b><small>${d}</small></button>`).join('')}
  </section>`;
}
(function(){
  const r0 = RENDER.inicio;
  RENDER.inicio = function(){
    r0();
    const h = $('#v-inicio .hero'); const html = quickHTML();
    if (h) h.insertAdjacentHTML('afterend', html); else $('#v-inicio').insertAdjacentHTML('afterbegin', html);
    $$('[data-qk]').forEach(b => b.onclick = () => QUICK[+b.dataset.qk][4]());
    const c = $('[data-qcont]'); if (c) c.onclick = () => { const L = S.lastTool; if (SECTIONS[L.v] && SECTIONS[L.v].kind === 'deck') deckTab = L.tab; else trTab = L.tab; if (L.tab === 'calc') return show('combate'); show(L.v); };
  };
})();
/* ---------- Lições: modo professor ---------- */
(function(){
  const r0 = RENDER.academia;
  RENDER.academia = function(){
    r0();
    const v = $('#v-academia'); if (!v || $('.teach-intro', v)) return;
    const head = $('.view-head', v); if (head) head.insertAdjacentHTML('afterend', renderTeachIntro()); else v.insertAdjacentHTML('afterbegin', renderTeachIntro());
    bindTeachIntro();
  };
})();
/* ---------- busca e mapa: novidades ---------- */
FEATS.push(
  ['Jogo: Sobreviva ao Multiverso','Jogo de ação estilo Vampire Survivors com mágicas e criaturas do Magic','jogo game survivors vampire acao sobreviver jogar diversao',() => { trTab = 'surv'; show('treino'); }],
  ['Modo professor','Aulas em tela cheia para ensinar Magic na TV ou no projetor','professor ensinar aula turma apresentação tv projetor slides',() => openTeach(0, 0)],
  ['Fazer backup','Baixe um arquivo com seus decks, coleção e progresso','backup salvar copia segurança restaurar trocar celular',() => { openSettings(); setTimeout(() => { const b = $('#bkDos'); if (b) b.scrollIntoView({block:'center'}); }, 50); }],
  ['Diagnóstico','Testa se a internet e os serviços funcionam neste aparelho','diagnostico teste erro problema funciona internet scryfall',() => openDiag()],
  ['Capa da Academia','A tela de início com as lendas da Alpha','capa inicio alpha black lotus',openCover]
);
MAP_SEC.forEach(m => { if (m[0] === 'academia') m[2] = [['12 lições práticas'],['Modo professor']]; });
/* ---------- tour com as novidades ---------- */
(function(){
  const t0 = tourAll;
  tourAll = function(){
    const T = t0();
    const iSearch = T.findIndex(s => s.s === '.gsearch');
    T.splice(iSearch + 1, 0, {v:'inicio', s:'.quick', t:'Atalhos e "Continuar"', d:'Os atalhos levam direto ao que mais se usa: importar, criar e melhorar decks, jogar, aprender do zero e o modo professor. O primeiro cartão volta para a última ferramenta que você usou.'});
    const iAc = T.findIndex(s => s.v === 'academia');
    T.splice(iAc + 1, 0, {v:'academia', s:'.teach-intro', t:'Modo professor', d:'Seis aulas em tela cheia para ensinar Magic a amigos, filhos ou alunos: cartas grandes, perguntas para a turma e notas só para quem ensina. Ligue o PC na TV e use as setas do teclado.'});
    const iSet = T.findIndex(s => s.s === '#btnSet');
    if (iSet >= 0) T[iSet] = {v:'inicio', s:'#btnSet', t:'Ajustes, backup e diagnóstico', d:'Tamanho da letra, contraste, modo leve, tema e sons. Aqui também ficam o backup (baixe um arquivo com seus decks e progresso para não perder nada ou passar para outro aparelho) e o Diagnóstico, que testa se tudo funciona no seu celular.'};
    return T;
  };
})();
setTimeout(() => { try { backupReminder(); } catch(e){} }, 5000);
