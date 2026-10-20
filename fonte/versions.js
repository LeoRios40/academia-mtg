/* ================= ATUALIZAÇÕES ================= */
const VERSIONS = [
 {v:'2.1', d:'20/10/2026', t:'Visual renovado', items:['Novas cores: safira e ouro, nos temas claro e escuro.','Botões, abas e seletores redesenhados, com mais destaque para a ação principal.','Nova página de atualizações (esta aqui) e aviso de novidades a cada versão.']},
 {v:'2.0', d:'20/10/2026', t:'Entenda seu deck e campanha', items:['Entenda seu deck: importe do Arena, de sites ou do deck físico (inclusive com nomes em português) e veja estilo, função de cada carta, sinergias, combos e dicas.','Partida contra o computador com mana colorida, respostas no turno do oponente e três níveis.','Campanha com sete capítulos e modo para dois jogadores no mesmo aparelho.','Sete decks para a partida e dois novos Commanders no simulador: Talrand e Lathril.','Nomes das cartas em português, desafio do dia, criador de quebra-cabeças com link, símbolos das cartas, comparação de comandantes e Primeiros passos.','Modo leve automático em celulares mais simples.']},
 {v:'1.4', d:'13/10/2026', t:'Jogar, treinar e publicar', items:['Primeira partida contra o computador.','Treinos de bloqueios, ler a mesa e mulligan.','Grupo de amigos: sorteio de mesas e torneio suíço.','Base de mana, sugestões para o comandante, coleção física e lista de desejos.','Adivinhe a carta, evolução das molduras, quiz de lore e pronúncia dos termos.','Tour guiado, busca de recursos, ajustes de letra e contraste.','A Academia passou a ter endereço próprio na internet e pode ser instalada como aplicativo.']},
 {v:'1.3', d:'13/10/2026', t:'Aba Treino', items:['Simulador de partidas com decks de Commander.','Quebra-cabeças "vença neste turno", treino de pilha e de Draft.','Contador de vida e árbitro de bolso.','Orçamento, comparar listas e desafios de construção.','Galeria de artistas, mapa do Multiverso e "Nesta semana na história".','Exportar e importar o progresso entre aparelhos.']},
 {v:'1.2', d:'13/10/2026', t:'Correções e novidades', items:['Imagens das cartas voltaram a aparecer no PC.','Compatibilidade com mais celulares e aviso quando o arquivo é aberto num visualizador sem suporte.','Decks famosos, Central do Arena e coleções novas.']},
 {v:'1.1', d:'11/10/2026', t:'Formatos e capa', items:['Capa com extras para fãs e segredo das cinco cores.','Aba Formatos: Commander, Padrão, outros formatos, guia do MTG Arena, montador guiado e etiqueta de mesa.','Trilha do zero à mesa e certificado.']},
 {v:'1.0', d:'10/10/2026', t:'Nova Academia', items:['Manual de regras, glossário de habilidades, turno e anatomia da carta.','Doze lições práticas, quiz com explicações e calculadora de combate.','Analisador de deck, mão inicial e probabilidade.']}
];
const CUR_VER = VERSIONS[0].v;
function updatesHTML(full){
  const L = full ? VERSIONS : VERSIONS.slice(0, 1);
  return `<ol class="ver-list">${L.map((v,i)=>`<li class="${i===0?'cur':''}"><div class="ver-head"><span class="ver-tag">v${v.v}</span><b>${v.t}</b><span class="muted mono" style="font-size:.85rem">${v.d}</span></div><ul>${v.items.map(x=>`<li>${x}</li>`).join('')}</ul></li>`).join('')}</ol>`;
}
function openUpdates(isNew){
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="info stack-v" style="grid-column:1/-1">
    <span class="eyebrow">${isNew ? 'Novidades' : 'Histórico de versões'}</span><h2>${isNew ? `Versão ${CUR_VER}` : 'Atualizações da Academia'}</h2>
    ${isNew ? `<p class="muted">A Academia foi atualizada. Seu progresso continua salvo.</p>` : ''}
    ${updatesHTML(!isNew)}
    <div class="row-h">${isNew ? '<button class="btn" id="verAll">Ver todas as versões</button>' : ''}<button class="btn primary" data-close>Continuar</button></div></div>`;
  $('#modal').hidden = false;
  const a = $('#verAll'); if (a) a.onclick = () => openUpdates(false);
  S.seenVer = CUR_VER; save();
}
function maybeShowUpdates(){
  const returning = S.xp || Object.keys(S.done||{}).length || S.tourAsked;
  if (S.seenVer === CUR_VER) return;
  if (!returning) { S.seenVer = CUR_VER; save(); return; }
  setTimeout(() => openUpdates(true), 600);
}
