/* ================= v3.2: MODO PROFESSOR =================
   Aulas para mostrar na TV, no projetor ou no PC, com cartas grandes e notas para quem ensina. */
const AULAS = [
 {t:'O que é Magic', d:'Para quem nunca jogou: o objetivo, as cores e os tipos de carta.', min:10, s:[
  {h:'Bem-vindos ao Magic', p:'Cada jogador é um planeswalker: um mago que viaja entre mundos e usa um baralho de cartas como arsenal de feitiços.', pts:['Cada um começa com 20 pontos de vida','Vence quem deixar o oponente com 0 de vida','Cada partida dura de 15 a 30 minutos'], cards:['Serra Angel','Shivan Dragon','Llanowar Elves'], n:'Comece perguntando se alguém já jogou algum jogo de cartas (Pokémon, Yu-Gi-Oh, truco). Diga que Magic foi o primeiro jogo de cartas colecionáveis, de 1993.'},
  {h:'As cinco cores', p:'Cada cor tem uma personalidade e um jeito de jogar.', pts:['Branco: ordem, proteção e exércitos','Azul: conhecimento, anular e enganar','Preto: ambição, morte e sacrifício','Vermelho: fúria, velocidade e fogo','Verde: natureza, criaturas grandes e mana extra'], cards:['Plains','Island','Swamp','Mountain','Forest'], n:'Pergunte a cada pessoa com qual cor se identifica. Depois, o teste "Qual é a sua cor?" da capa é uma boa atividade.'},
  {h:'Terrenos e mana', p:'Os terrenos são a fonte de energia. Você vira (gira) um terreno para gerar mana e pagar as outras cartas.', pts:['Você pode jogar um terreno por turno','Cada terreno básico gera uma mana da sua cor','Virar a carta de lado = usar ("virar" ou "tap")'], cards:['Forest','Mountain'], n:'Mostre com cartas de verdade o gesto de virar a carta. Repita: um terreno por turno.'},
  {h:'Os tipos de carta', p:'Tudo o que não é terreno é uma mágica, paga com mana.', pts:['Criaturas: atacam e bloqueiam','Instantâneas: podem ser usadas a qualquer momento','Feitiços: só no seu turno','Encantamentos e artefatos: ficam na mesa com efeitos permanentes'], cards:['Grizzly Bears','Lightning Bolt','Divination','Pacifism'], n:'Leia o custo de cada carta em voz alta e pergunte quantos terrenos são necessários para jogá-la.'},
  {q:{q:'Quantos terrenos você pode jogar por turno?', o:['Um','Dois','Quantos quiser','Nenhum'], a:0, e:'Um terreno por turno, em qualquer uma das suas fases principais.'}}
 ]},
 {t:'Criaturas e combate', d:'Atacar, bloquear e calcular o dano.', min:12, s:[
  {h:'Poder e resistência', p:'O número no canto da criatura é poder/resistência. O poder é o dano que ela causa; a resistência é quanto dano aguenta no turno.', pts:['Grizzly Bears 2/2: causa 2 de dano e morre com 2','O dano some no fim do turno','Criaturas novas não atacam no turno em que entram (enjoo de invocação)'], cards:['Grizzly Bears','Centaur Courser','Colossal Dreadmaw'], n:'Use dados ou marcadores para mostrar o dano sendo causado e depois "sumindo" no fim do turno.'},
  {h:'Atacar', p:'No seu turno, você escolhe quais criaturas atacam. Elas viram de lado.', pts:['Quem ataca escolhe as criaturas','O defensor decide como bloquear','Criatura não bloqueada causa dano ao jogador'], cards:['Goblin Guide','Boggart Brute'], n:'Faça uma rodada de ataque com dois alunos, um atacando e outro defendendo.'},
  {h:'Bloquear', p:'Cada criatura sua pode bloquear uma atacante. Elas trocam dano entre si.', pts:['Bloqueio 2/2 contra 2/2: as duas morrem','Bloqueio 1/4 contra 3/3: ninguém morre','Várias criaturas podem bloquear a mesma atacante'], cards:['Wall of Omens','Giant Spider'], n:'Use a Calculadora de combate (área Na mesa) para testar bloqueios na frente da turma.'},
  {h:'Habilidades de combate', p:'Palavras-chave mudam as regras do combate.', pts:['Voar: só é bloqueada por quem tem Voar ou Alcance','Atropelar: o dano que sobra passa para o jogador','Toque mortífero: qualquer dano mata','Iniciativa: causa dano primeiro'], cards:['Serra Angel','Giant Spider','Vampire Nighthawk'], n:'Peça para os alunos encontrarem as palavras-chave nas cartas mostradas.'},
  {q:{q:'Um 3/3 com Atropelar é bloqueado por um 1/1. Quanto dano chega ao jogador?', o:['0','1','2','3'], a:2, e:'1 de dano mata o bloqueador e os outros 2 atropelam até o jogador.'}}
 ]},
 {t:'O turno', d:'As fases do turno e o que fazer em cada uma.', min:10, s:[
  {h:'Início do turno', p:'Três passos automáticos que acontecem sempre na mesma ordem.', pts:['Desvirar: suas cartas voltam a ficar de pé','Manutenção: efeitos de "no início do turno"','Compra: compre uma carta (quem começa o jogo não compra no primeiro turno)'], cards:['Llanowar Elves'], n:'Use uma frase para lembrar: "desviro, mantenho, compro".'},
  {h:'Fases principais e combate', p:'A parte em que você toma decisões.', pts:['Primeira fase principal: jogue terreno e mágicas','Combate: ataque, bloqueios e dano','Segunda fase principal: jogue o que sobrou','Final: o dano das criaturas some'], cards:['Forest','Grizzly Bears','Giant Growth'], n:'Explique por que vale guardar algumas mágicas para depois do combate: o oponente decide os bloqueios sem saber o que você tem.'},
  {h:'A pilha', p:'Quando alguém joga uma mágica, o outro pode responder. A última mágica jogada é a primeira a acontecer.', pts:['Mágica entra na pilha','O oponente pode responder com instantâneas','Resolve de cima para baixo'], cards:['Lightning Bolt','Giant Growth','Counterspell'], n:'Empilhe as cartas fisicamente para mostrar a ordem. O treino "Pilha" na área Treino tem exemplos.'},
  {q:{q:'Você ataca com Grizzly Bears (2/2). O oponente joga Lightning Bolt nele e você responde com Giant Growth. O que acontece?', o:['O urso morre','O urso sobrevive como 5/5','As duas mágicas são anuladas','O oponente perde 3 de vida'], a:1, e:'Giant Growth resolve primeiro (é a última da pilha): o urso fica 5/5 e aguenta os 3 de dano do raio.'}}
 ]},
 {t:'Montando o primeiro deck', d:'Quantas cartas, quantos terrenos e a curva de mana.', min:12, s:[
  {h:'A receita básica', p:'Um deck de 60 cartas que funciona.', pts:['24 terrenos','15 a 18 criaturas','O resto: remoções e truques','Até 4 cópias de cada carta (terrenos básicos à vontade)'], cards:['Forest','Llanowar Elves','Giant Growth'], n:'Mostre a área Construir → Criar deck do zero e gere um deck na frente da turma.'},
  {h:'Curva de mana', p:'Ter cartas baratas para os primeiros turnos e algumas caras para o fim.', pts:['Muitas cartas de custo 1 a 3','Algumas de 4 e 5','Poucas de 6 ou mais','Deck pesado demais = mão travada'], cards:['Llanowar Elves','Centaur Courser','Colossal Dreadmaw'], n:'Abra o Analisador com um deck de exemplo e mostre o gráfico da curva.'},
  {h:'Uma ou duas cores', p:'Para começar, uma ou duas cores deixam a mana estável.', pts:['Duas cores: cerca de 12 terrenos de cada','Escolha cores que combinam com seu estilo','Três ou mais cores precisam de terrenos especiais'], cards:['Mountain','Forest'], n:'O teste "Qual é a sua cor?" da capa ajuda cada aluno a escolher.'},
  {q:{q:'Quantas cópias de uma mesma carta (que não seja terreno básico) um deck de 60 pode ter?', o:['1','2','4','Ilimitadas'], a:2, e:'Até 4 cópias. Em Commander é só 1 de cada.'}}
 ]},
 {t:'Commander', d:'O formato mais jogado entre amigos.', min:10, s:[
  {h:'O que é Commander', p:'Um deck de 100 cartas, todas diferentes, liderado por uma criatura lendária: o comandante.', pts:['100 cartas, 1 de cada (exceto terrenos básicos)','40 pontos de vida','3 a 4 jogadores','As cores do deck seguem o comandante'], cards:['Ghalta, Primal Hunger','Command Tower'], n:'Mostre a área Formatos → Commander e alguns comandantes populares.'},
  {h:'A zona de comando', p:'O comandante começa fora do baralho e pode ser jogado a qualquer momento.', pts:['Se ele morrer, volta para a zona de comando','Custa 2 a mais a cada vez que é jogado de novo','21 de dano de um mesmo comandante derrota o jogador'], cards:['Ghalta, Primal Hunger'], n:'O Contador de vida (área Na mesa) marca dano de comandante.'},
  {h:'A receita do Commander', p:'Uma base que funciona para quase todo deck.', pts:['37 terrenos','10 cartas de aceleração de mana','10 de compra de cartas','8 a 10 remoções','O resto: o plano do comandante'], cards:['Rampant Growth','Divination','Murder'], n:'Gere um deck de Commander no "Criar deck do zero" e compare a composição com esta receita.'},
  {q:{q:'Com quantos pontos de vida cada jogador começa no Commander?', o:['20','30','40','50'], a:2, e:'40 pontos de vida, porque as partidas têm vários jogadores e cartas mais poderosas.'}}
 ]},
 {t:'Etiqueta e mesa', d:'Como se portar numa mesa de loja ou entre amigos.', min:8, s:[
  {h:'Boas práticas', p:'O que os veteranos esperam de quem chega.', pts:['Embaralhe bem e ofereça o deck para o oponente cortar','Anuncie o que está fazendo ("ataco com estas duas")','Deixe a vida e os marcadores à vista','Pergunte quando não conhecer uma carta do oponente'], cards:['Lightning Bolt'], n:'Simule um início de partida completo com dois alunos: embaralhar, cortar, sortear quem começa.'},
  {h:'Mulligan', p:'Se a mão inicial for ruim, dá para trocar.', pts:['Embaralhe a mão de volta e compre 7 de novo','Depois coloque 1 carta no fundo do deck para cada mulligan','Mão com 0, 1, 6 ou 7 terrenos: quase sempre mulligan'], cards:['Forest','Island'], n:'Use o treino de Mulligan (área Treino) para decidir mãos em grupo.'},
  {h:'Quando há dúvida', p:'Ninguém sabe todas as regras de cor.', pts:['Leia o texto da carta em voz alta','Consulte o Árbitro de bolso (área Na mesa)','Em torneios, chame o juiz','O mais importante: todos se divertirem'], cards:['Counterspell'], n:'Termine com uma partida rápida entre os alunos usando os decks do duelo.'},
  {q:{q:'Você comprou uma mão com 7 cartas e nenhum terreno. O que fazer?', o:['Jogar assim mesmo','Fazer mulligan','Pedir para trocar uma carta','Desistir da partida'], a:1, e:'Sem terrenos você não joga nada: faça mulligan.'}}
 ]}
];
let tc = {a:0, i:0, notes:false, rev:false};
function renderTeachIntro(){
  return `<div class="panel stack-v teach-intro"><h3>Modo professor</h3>
    <p class="muted" style="margin:0">Para ensinar amigos, filhos ou alunos: aulas em tela cheia com cartas grandes, perguntas para a turma e notas só para quem ensina. Funciona no PC ligado à TV, no projetor ou no próprio celular.</p>
    <div class="teach-grid">${AULAS.map((A,i) => `<button class="teach-c" data-tch="${i}"><span class="teach-n">${i+1}</span><b>${A.t}</b><small>${A.d}</small><small class="muted">${A.s.length} telas · cerca de ${A.min} min</small></button>`).join('')}</div>
    <p class="muted" style="margin:0;font-size:.85rem">Durante a aula: setas ← → (ou toque nas laterais) mudam a tela, N mostra as notas, F entra em tela cheia, Esc sai.</p></div>`;
}
function openTeach(a, i){
  tc = {a: a || 0, i: i || 0, notes: tc.notes, rev:false};
  let ov = $('#teach'); if (!ov) { ov = document.createElement('div'); ov.id = 'teach'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Modo professor'); document.body.appendChild(ov); }
  ov.hidden = false; document.body.style.overflow = 'hidden'; drawTeach();
  if (!S.teachDone) { S.teachDone = true; addXP(15); save(); }
}
function closeTeach(){ const ov = $('#teach'); if (ov) ov.hidden = true; document.body.style.overflow = ''; try { if (document.fullscreenElement) document.exitFullscreen(); } catch(e){} }
function drawTeach(){
  const A = AULAS[tc.a], sl = A.s[tc.i], ov = $('#teach'); const last = tc.i === A.s.length - 1;
  let body = '';
  if (sl.q) body = `<div class="tq"><span class="tq-tag">Pergunta para a turma</span><h2>${esc(sl.q.q)}</h2><ol class="tq-o">${sl.q.o.map((o,k) => `<li class="${tc.rev ? (k === sl.q.a ? 'ok' : 'no') : ''}"><span>${'ABCD'[k]}</span>${esc(o)}</li>`).join('')}</ol>
      ${tc.rev ? `<p class="tq-e">${esc(sl.q.e)}</p>` : '<button class="btn primary" id="tcRev">Mostrar a resposta</button>'}</div>`;
  else body = `<div class="ts"><div class="ts-t"><h2>${esc(sl.h)}</h2><p class="ts-p">${esc(sl.p)}</p><ul>${sl.pts.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="ts-cards">${(sl.cards||[]).map(n => cardHTML(n, {showPt:false})).join('')}</div></div>`;
  ov.innerHTML = `<div class="tc-top"><button class="tc-b" id="tcMenu" aria-label="Escolher aula">☰ ${esc(A.t)}</button><span class="tc-c">Tela ${tc.i+1} de ${A.s.length}</span>
      <span class="tc-r"><button class="tc-b" id="tcNotes" aria-pressed="${tc.notes}">Notas (N)</button><button class="tc-b" id="tcFull">Tela cheia (F)</button><button class="tc-b" id="tcX" aria-label="Sair do modo professor">✕</button></span></div>
    <div class="tc-prog"><i style="width:${(tc.i+1)/A.s.length*100}%"></i></div>
    <div class="tc-stage"><button class="tc-nav l" id="tcPrev" ${tc.i === 0 && tc.a === 0 ? 'disabled' : ''} aria-label="Tela anterior">‹</button>${body}<button class="tc-nav r" id="tcNext" aria-label="Próxima tela">›</button></div>
    ${tc.notes && sl.n ? `<div class="tc-notes"><b>Nota para quem ensina:</b> ${esc(sl.n)}</div>` : ''}
    ${last ? `<div class="tc-end">${tc.a < AULAS.length - 1 ? `<button class="btn primary" id="tcNextA">Próxima aula: ${esc(AULAS[tc.a+1].t)} →</button>` : '<span>Fim das aulas. Hora de jogar!</span>'}</div>` : ''}`;
  const go = d => { const L = AULAS[tc.a].s.length; let i = tc.i + d, a = tc.a; if (i >= L) { if (a < AULAS.length - 1) { a++; i = 0; } else i = L - 1; } if (i < 0) { if (a > 0) { a--; i = AULAS[a].s.length - 1; } else i = 0; } tc.a = a; tc.i = i; tc.rev = false; drawTeach(); };
  $('#tcPrev').onclick = () => go(-1); $('#tcNext').onclick = () => go(1);
  $('#tcX').onclick = closeTeach;
  $('#tcNotes').onclick = () => { tc.notes = !tc.notes; drawTeach(); };
  $('#tcFull').onclick = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else ov.requestFullscreen(); } catch(e){} };
  const rv = $('#tcRev'); if (rv) rv.onclick = () => { tc.rev = true; drawTeach(); };
  const na = $('#tcNextA'); if (na) na.onclick = () => { tc.a++; tc.i = 0; tc.rev = false; drawTeach(); };
  $('#tcMenu').onclick = () => { ov.innerHTML = `<div class="tc-top"><span class="tc-c">Escolha a aula</span><span class="tc-r"><button class="tc-b" id="tcBack">Voltar</button></span></div><div class="tc-menu">${AULAS.map((A,i) => `<button class="teach-c" data-tcm="${i}"><span class="teach-n">${i+1}</span><b>${A.t}</b><small>${A.d}</small></button>`).join('')}</div>`; $('#tcBack').onclick = drawTeach; $$('[data-tcm]').forEach(b => b.onclick = () => { tc.a = +b.dataset.tcm; tc.i = 0; tc.rev = false; drawTeach(); }); };
  // toque nas laterais e deslizar
  let x0 = null; const st = $('.tc-stage');
  st.ontouchstart = e => { x0 = e.touches[0].clientX; }; st.ontouchend = e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; };
}
document.addEventListener('keydown', e => {
  const ov = $('#teach'); if (!ov || ov.hidden) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); const b = $('#tcNext'); b && b.click(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); const b = $('#tcPrev'); b && !b.disabled && b.click(); }
  else if (e.key.toLowerCase() === 'n') { const b = $('#tcNotes'); b && b.click(); }
  else if (e.key.toLowerCase() === 'f') { const b = $('#tcFull'); b && b.click(); }
  else if (e.key === 'Escape' && !document.fullscreenElement) closeTeach();
});
function bindTeachIntro(){ $$('[data-tch]').forEach(b => b.onclick = () => openTeach(+b.dataset.tch, 0)); }
