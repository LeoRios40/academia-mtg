/* ================= v4.5: SOBREVIVA AO MULTIVERSO (refeito) =================
   Jogo de ação estilo "survivors" com tema de Magic. Sprites desenhados no próprio código e
   pré-renderizados (4 quadros de animação, sombra, brilho ao levar golpe), 5 planos com chão texturizado
   e cenário, 5 magos originais (um por cor) que evoluem de Aprendiz a Planeswalker, 8 mágicas com
   5 níveis e evolução, 8 relíquias, 5 chefes com ataques avisados, loja permanente e modo infinito. */
function renderSurv(box){ return G3.menu(box || $('#trBody')); }
const G3 = (function(){
'use strict';
const TAU = Math.PI * 2, clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const OL = '#1a1322';
/* ---------- utilidades de desenho ---------- */
function mk(w, h){ const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function circ(g, x, y, r){ g.beginPath(); g.arc(x, y, Math.max(.1, r), 0, TAU); }
function ell(g, x, y, rx, ry, rot){ g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, TAU); }
function rr(g, x, y, w, h, r){ r = Math.max(0, Math.min(r, w / 2, h / 2)); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function fs(g){ g.fill(); g.stroke(); }
function hexRgb(h){ h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function sh(h, a){ const c = hexRgb(h).map(v => Math.round(clamp(a > 0 ? v + (255 - v) * a : v * (1 + a), 0, 255))); return `rgb(${c[0]},${c[1]},${c[2]})`; }
function rgba(h, a){ const c = hexRgb(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }
function vg(g, c, y0, y1, a, b){ const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, sh(c, a == null ? .22 : a)); gr.addColorStop(1, sh(c, b == null ? -.2 : b)); return gr; }
function star(g, x, y, R, r, n){ g.beginPath(); for (let i = 0; i < n * 2; i++){ const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); }
function hash(x, y){ let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function flashOf(c){ const f = mk(c.width, c.height), g = f.getContext('2d'); g.drawImage(c, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, f.width, f.height); return f; }
function glowSpr(col, r){ const c = mk(r * 2, r * 2), g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r); gr.addColorStop(0, rgba(col, .9)); gr.addColorStop(.35, rgba(col, .45)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2); return c; }

/* ---------- dados ---------- */
const MAGES = {
  R:{n:'Ignis', t:'Piromante', col:'#e0603a', robe:'#b8322a', trim:'#f6c945', cape:'#5a1a1a', gem:'#ffb04a', skin:'#f2c9a0', hair:'#7a2a12', w:'bolt', bonus:'+10% de dano', ult:'Erupção', ud:'Explosão de fogo em toda a tela', cost:0},
  U:{n:'Maré', t:'Arcanista', col:'#4a95d6', robe:'#2c5fa8', trim:'#cfe6ff', cape:'#173560', gem:'#7fe0ff', skin:'#f0d2b4', hair:'#1d2b52', w:'orb', bonus:'-10% de recarga', ult:'Maremoto', ud:'Empurra e congela os inimigos', cost:150},
  B:{n:'Morva', t:'Necromante', col:'#9a7fb0', robe:'#3b2a4a', trim:'#c9b6ff', cape:'#1a1222', gem:'#c070ff', skin:'#d9cfd8', hair:'#e8e2f0', w:'drain', bonus:'Rouba 3% da vida', ult:'Colheita', ud:'Dano enorme em tudo na tela', cost:250},
  G:{n:'Tarn', t:'Druida', col:'#4cae6b', robe:'#2f6e3a', trim:'#e8d27a', cape:'#1f3e22', gem:'#9cff7a', skin:'#c99a72', hair:'#5a3a1e', w:'vines', bonus:'+25 de vida e regeneração', ult:'Debandada', ud:'Uma manada atravessa a tela', cost:350},
  W:{n:'Lúmen', t:'Clériga', col:'#f1e7c0', robe:'#e9e2cf', trim:'#d9ac4e', cape:'#8a7a52', gem:'#fff2a8', skin:'#f4d6bc', hair:'#f3e6b0', w:'aura', bonus:'+1 de armadura', ult:'Ira Divina', ud:'Fere todos e cura você', cost:500}
};
const TIERS = [[1,'Aprendiz'],[10,'Mago'],[20,'Arquimago'],[32,'Planeswalker']];
/* mágicas: lv = 5 níveis; evo = relíquia que evolui; e = nome evoluído */
const WPN = {
  bolt:{n:'Raio', c:'R', d:'Dispara no inimigo mais próximo.', e:'Tempestade de Raios', ed:'Raios em cadeia saltam entre 5 inimigos.', p:'foco'},
  orb:{n:'Orbes Arcanos', c:'U', d:'Esferas giram ao seu redor.', e:'Vórtice Astral', ed:'Seis orbes enormes que puxam os inimigos.', p:'tomo'},
  aura:{n:'Aura Sagrada', c:'W', d:'Fere quem chega perto.', e:'Julgamento', ed:'Aura gigante e pulsos de luz sagrada.', p:'relicario'},
  drain:{n:'Dreno Vital', c:'B', d:'Raio que rouba vida.', e:'Ceifadora', ed:'Drena 4 inimigos de uma vez.', p:'calice'},
  vines:{n:'Espinhos', c:'G', d:'Espinhos brotam sob os inimigos.', e:'Fúria da Floresta', ed:'Anéis de espinhos ao seu redor.', p:'semente'},
  fire:{n:'Bola de Fogo', c:'R', d:'Explode ao acertar.', e:'Chuva de Meteoros', ed:'Meteoros caem do céu sem parar.', p:'pergaminho'},
  blades:{n:'Lâminas Rúnicas', c:'C', d:'Vão e voltam como bumerangue.', e:'Redemoinho de Aço', ed:'Lâminas giram sem parar, atravessando tudo.', p:'engrenagem'},
  wisps:{n:'Espíritos', c:'W', d:'Perseguem os inimigos.', e:'Hoste Celestial', ed:'Anjos que caçam os mais fortes.', p:'vela'}
};
const PAS = {
  foco:{n:'Foco de Mana', d:'+10% de dano', ic:'✦'}, tomo:{n:'Tomo Antigo', d:'+10% de área', ic:'❖'},
  relicario:{n:'Relicário', d:'+1 de armadura e regeneração', ic:'⛨'}, calice:{n:'Cálice de Sangue', d:'+20 de vida e 1% de roubo de vida', ic:'♥'},
  semente:{n:'Semente Antiga', d:'+12% de experiência', ic:'❀'}, pergaminho:{n:'Pergaminho', d:'-8% de recarga', ic:'⌛'},
  engrenagem:{n:'Engrenagem', d:'+1 projétil (níveis 2 e 4) e projéteis mais rápidos', ic:'⚙'}, vela:{n:'Vela Votiva', d:'+30% de alcance do ímã e mais sorte', ic:'☀'}
};
const COLHEX = {W:'#f6eec8', U:'#59a8ec', B:'#b48ad6', R:'#ff6a3a', G:'#5fd17e', C:'#cfd6e0'};
const BIOMES = [
  {n:'Dominária · Floresta', g:'#2f5a2a', g2:'#3d7034', d:'#24461f', props:['tree','bush','rock','flower'], en:['goblin','aranha','slime'], boss:'reiGoblin', mus:[0,2,4,7,9]},
  {n:'Innistrad · Cemitério', g:'#3a3d48', g2:'#474b57', d:'#2b2d36', props:['tomb','deadtree','candle','rock'], en:['zumbi','morcego','esqueleto'], boss:'lich', mus:[0,3,5,7,10]},
  {n:'Ravnica · Cidade das Guildas', g:'#6a5a48', g2:'#7a6a55', d:'#4f4335', props:['pillar','lamp','crate','banner'], en:['cultista','goblin','golem'], boss:'golemRei', mus:[0,2,3,7,8]},
  {n:'Zendikar · Ruínas Flutuantes', g:'#8a7a5a', g2:'#9a8a68', d:'#6a5c42', props:['hedron','crystal','rock','ruin'], en:['elemental','aranha','golem'], boss:'dragao', mus:[0,2,5,7,9]},
  {n:'Fenda do Vazio', g:'#1e1630', g2:'#2a1f42', d:'#140e22', props:['voidrock','crystal','eye','hedron'], en:['espirito','esqueleto','elemental','cultista'], boss:'devorador', mus:[0,1,5,6,10]}
];
/* r = raio, hp, sp = velocidade, dmg = dano de contato, xp */
const EN = {
  goblin:{r:13, hp:12, sp:78, dmg:6, xp:1}, aranha:{r:13, hp:10, sp:96, dmg:5, xp:1}, slime:{r:15, hp:22, sp:52, dmg:7, xp:2, split:1},
  zumbi:{r:15, hp:30, sp:42, dmg:9, xp:2}, morcego:{r:11, hp:8, sp:120, dmg:4, xp:1, fly:1}, esqueleto:{r:14, hp:20, sp:62, dmg:7, xp:1},
  cultista:{r:14, hp:22, sp:50, dmg:6, xp:2, shoot:1}, golem:{r:22, hp:80, sp:36, dmg:14, xp:5}, elemental:{r:15, hp:26, sp:70, dmg:9, xp:2},
  espirito:{r:13, hp:18, sp:85, dmg:8, xp:2, fly:1},
  reiGoblin:{r:38, hp:1400, sp:62, dmg:18, xp:80, boss:1, n:'Rei Goblin'}, lich:{r:36, hp:2600, sp:46, dmg:20, xp:120, boss:1, n:'Lich Ancestral'},
  golemRei:{r:46, hp:4400, sp:38, dmg:26, xp:160, boss:1, n:'Colosso da Guilda'}, dragao:{r:48, hp:6800, sp:58, dmg:28, xp:220, boss:1, n:'Dragão Ancião'},
  devorador:{r:56, hp:11000, sp:44, dmg:32, xp:400, boss:1, n:'Devorador do Vazio'}
};
const SHOP = {
  vida:{n:'Vitalidade', d:'+10 de vida máxima por nível', max:5, base:40}, poder:{n:'Poder', d:'+5% de dano por nível', max:5, base:60},
  pressa:{n:'Pressa', d:'+4% de velocidade por nível', max:4, base:50}, ima:{n:'Atração', d:'+12% de alcance do ímã', max:4, base:40},
  sabedoria:{n:'Sabedoria', d:'+6% de experiência', max:5, base:60}, armadura:{n:'Armadura', d:'+1 de armadura', max:3, base:90},
  rerrolar:{n:'Rerrolar', d:'+1 troca de cartas por partida', max:3, base:80}, renascer:{n:'Segunda Chance', d:'Volta com metade da vida uma vez', max:1, base:300}
};
const meta = () => { const M = (S.survMeta = S.survMeta || {cen:0}); M.cen = M.cen || 0; M.v3 = M.v3 || {up:{}, chars:{R:1}, best:{}, runs:0, hard:false}; return M; };

/* ---------- arte: magos ---------- */
const SPR = {};
function drawMage(c, tier, f){
  const m = MAGES[c], cv = mk(72, 80), g = cv.getContext('2d'), cx = 36, by = 74;
  const bob = [0, -1.5, 0, -1.5][f], leg = [0, 3, 0, -3][f];
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = OL; g.lineWidth = 2.2;
  g.translate(0, bob);
  if (tier >= 2){ g.fillStyle = vg(g, m.cape, 30, 72, .1, -.3); g.beginPath(); g.moveTo(cx - 12, 36); g.quadraticCurveTo(cx - 24 - leg * .6, 58, cx - 20, by - 4); g.lineTo(cx + 20, by - 4); g.quadraticCurveTo(cx + 24 + leg * .6, 58, cx + 12, 36); g.closePath(); fs(g); }
  /* botas */
  g.fillStyle = '#3a2a22'; ell(g, cx - 7, by - 3 + Math.min(0, leg) * .5, 5, 3.5); fs(g); ell(g, cx + 7, by - 3 - Math.max(0, leg) * .5, 5, 3.5); fs(g);
  /* túnica */
  g.fillStyle = vg(g, m.robe, 34, 72); g.beginPath(); g.moveTo(cx - 10, 36); g.lineTo(cx + 10, 36); g.quadraticCurveTo(cx + 15, 52, cx + 17 + leg * .3, by - 6); g.quadraticCurveTo(cx, by - 2, cx - 17 + leg * .3, by - 6); g.quadraticCurveTo(cx - 15, 52, cx - 10, 36); g.closePath(); fs(g);
  g.save(); g.clip(); g.fillStyle = rgba('#ffffff', .12); g.fillRect(cx - 18, 36, 9, 40); g.restore();
  if (tier >= 1){ g.strokeStyle = m.trim; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 16 + leg * .3, by - 8); g.quadraticCurveTo(cx, by - 4, cx + 16 + leg * .3, by - 8); g.stroke(); g.beginPath(); g.moveTo(cx, 38); g.lineTo(cx, by - 5); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2.2; }
  g.fillStyle = tier >= 1 ? m.trim : sh(m.robe, -.35); rr(g, cx - 11, 50, 22, 4, 2); fs(g);
  if (tier >= 2){ g.fillStyle = vg(g, m.trim, 36, 44, .3, -.2); ell(g, cx - 11, 40, 6, 4.5); fs(g); ell(g, cx + 11, 40, 6, 4.5); fs(g); }
  /* braço e cajado */
  g.fillStyle = sh(m.robe, -.1); ell(g, cx - 13, 47, 4.5, 6, .3); fs(g);
  g.strokeStyle = '#6a4424'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(cx + 15, by - 4); g.lineTo(cx + 18, 22 - tier); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2.2;
  g.fillStyle = m.skin; circ(g, cx + 15, 47, 3.6); fs(g);
  const gr = 3.4 + tier * 1.3; g.save(); g.shadowColor = m.gem; g.shadowBlur = 6 + tier * 4; g.fillStyle = m.gem; star(g, cx + 18, 19 - tier, gr + 1.5, gr * .6, tier >= 3 ? 6 : 4); fs(g); g.restore();
  if (tier >= 1){ g.strokeStyle = m.trim; g.lineWidth = 1.6; circ(g, cx + 18, 19 - tier, gr + 3.5); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2.2; }
  /* cabeça */
  const hy = 26;
  if (c === 'W' || c === 'G'){ g.fillStyle = m.hair; ell(g, cx, hy + 5, 13, 12); fs(g); }
  g.fillStyle = m.skin; circ(g, cx, hy, 11.5); fs(g);
  g.fillStyle = rgba('#ff7a7a', .35); ell(g, cx - 6.5, hy + 4, 2.6, 1.6); g.fill(); ell(g, cx + 6.5, hy + 4, 2.6, 1.6); g.fill();
  const eye = c === 'B' ? '#c070ff' : tier >= 3 ? m.gem : '#2a1a14';
  g.fillStyle = eye; ell(g, cx - 4.2, hy + 1, 2, 2.8); g.fill(); ell(g, cx + 4.2, hy + 1, 2, 2.8); g.fill();
  g.fillStyle = '#fff'; circ(g, cx - 3.6, hy, .9); g.fill(); circ(g, cx + 4.8, hy, .9); g.fill();
  /* chapéu / capuz por cor */
  if (c === 'R'){ g.fillStyle = vg(g, m.robe, 0, 24, .15, -.25); g.beginPath(); g.moveTo(cx - 13, hy - 5); g.quadraticCurveTo(cx - 2, hy - 18, cx + 6, hy - 30 - tier * 2); g.quadraticCurveTo(cx + 6, hy - 14, cx + 13, hy - 5); g.closePath(); fs(g);
    g.fillStyle = sh(m.robe, -.25); ell(g, cx, hy - 5, 16, 4.5); fs(g); if (tier >= 1){ g.fillStyle = m.trim; rr(g, cx - 10, hy - 9, 20, 3.5, 1.5); fs(g); }
    g.save(); g.shadowColor = '#ffb04a'; g.shadowBlur = 8; g.fillStyle = '#ffb04a'; g.beginPath(); g.moveTo(cx + 6, hy - 30 - tier * 2); g.quadraticCurveTo(cx + 13, hy - 38 - tier * 3, cx + 7, hy - 44 - tier * 3); g.quadraticCurveTo(cx + 2, hy - 36, cx + 6, hy - 30 - tier * 2); g.fill(); g.restore(); }
  else if (c === 'U'){ g.fillStyle = vg(g, m.robe, 10, 30); g.beginPath(); g.arc(cx, hy, 14.5, Math.PI * 1.05, Math.PI * 1.95); g.quadraticCurveTo(cx + 15, hy + 8, cx + 11, hy + 10); g.quadraticCurveTo(cx + 8, hy - 6, cx, hy - 8); g.quadraticCurveTo(cx - 8, hy - 6, cx - 11, hy + 10); g.quadraticCurveTo(cx - 15, hy + 8, cx - 14, hy - 4); fs(g);
    g.strokeStyle = m.trim; g.lineWidth = 1.8; g.beginPath(); g.moveTo(cx - 6, hy - 9); g.quadraticCurveTo(cx - 3, hy - 12, cx, hy - 9); g.quadraticCurveTo(cx + 3, hy - 6, cx + 6, hy - 9); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2.2;
    if (tier >= 1){ g.fillStyle = '#dfe9f5'; rr(g, cx - 8, hy - 4.5, 16, 2.6, 1.3); fs(g); g.fillStyle = m.gem; circ(g, cx, hy - 3.2, 2); fs(g); } }
  else if (c === 'B'){ g.fillStyle = vg(g, m.robe, 8, 30, .1, -.3); g.beginPath(); g.moveTo(cx, hy - 20 - tier); g.quadraticCurveTo(cx + 17, hy - 12, cx + 13, hy + 11); g.quadraticCurveTo(cx + 8, hy - 4, cx, hy - 6); g.quadraticCurveTo(cx - 8, hy - 4, cx - 13, hy + 11); g.quadraticCurveTo(cx - 17, hy - 12, cx, hy - 20 - tier); fs(g);
    g.fillStyle = '#ece6d6'; circ(g, cx, hy + 12, 3); fs(g); g.fillStyle = OL; circ(g, cx - 1, hy + 11.6, .7); g.fill(); circ(g, cx + 1, hy + 11.6, .7); g.fill();
    if (tier >= 2){ g.fillStyle = '#d8d0e0'; for (const s of [-1, 1]){ g.beginPath(); g.moveTo(cx + s * 9, hy - 12); g.lineTo(cx + s * 14, hy - 22); g.lineTo(cx + s * 12, hy - 10); g.closePath(); fs(g); } } }
  else if (c === 'G'){ g.fillStyle = m.hair; g.beginPath(); g.arc(cx, hy - 1, 12.5, Math.PI, 0); g.closePath(); fs(g);
    const leaf = (x, y, a) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = vg(g, '#5fd17e', -6, 6); ell(g, 0, 0, 3, 6.5); fs(g); g.restore(); };
    for (let i = -2; i <= 2; i++) leaf(cx + i * 5, hy - 11 + Math.abs(i), i * .35);
    if (tier >= 2){ g.strokeStyle = '#8a6440'; g.lineWidth = 2.8; for (const s of [-1, 1]){ g.beginPath(); g.moveTo(cx + s * 7, hy - 9); g.lineTo(cx + s * 13, hy - 22); g.lineTo(cx + s * 19, hy - 25); g.moveTo(cx + s * 12, hy - 19); g.lineTo(cx + s * 7, hy - 25); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 2.2; }
    if (tier >= 1){ g.fillStyle = '#ff8ab0'; circ(g, cx + 9, hy - 7, 2.6); fs(g); } }
  else { g.fillStyle = m.hair; g.beginPath(); g.arc(cx, hy - 2, 12.5, Math.PI * 1.02, Math.PI * 1.98); g.quadraticCurveTo(cx + 6, hy - 9, cx, hy - 8); g.quadraticCurveTo(cx - 6, hy - 9, cx - 12.3, hy - 4); fs(g);
    g.fillStyle = m.trim; rr(g, cx - 9, hy - 10, 18, 3, 1.5); fs(g); g.fillStyle = '#ff6a6a'; circ(g, cx, hy - 8.6, 1.8); fs(g);
    if (tier >= 2){ g.save(); g.shadowColor = '#fff2a8'; g.shadowBlur = 8; g.strokeStyle = '#ffe680'; g.lineWidth = 2.5; ell(g, cx, hy - 19, 10, 3); g.stroke(); g.restore(); } }
  if (tier >= 3){ g.save(); g.shadowColor = m.gem; g.shadowBlur = 10; g.fillStyle = '#ffe680'; g.strokeStyle = OL; g.lineWidth = 1.5; star(g, cx, hy - 26 - (c === 'R' ? 22 : 0), 4.5, 2, 5); fs(g); g.restore(); }
  return cv;
}
function mageSpr(c, tier){
  const k = 'm' + c + tier; if (SPR[k]) return SPR[k];
  const fr = [0, 1, 2, 3].map(f => drawMage(c, tier, f));
  return (SPR[k] = {fr, fl: fr.map(flashOf)});
}
/* ---------- arte: inimigos ---------- */
function drawEnemy(k, f){
  const E = EN[k], s = E.boss ? 2.4 : 1, R = E.r, W = Math.ceil(R * 3.4 + 10), cv = mk(W, W), g = cv.getContext('2d'), cx = W / 2, cy = W / 2 + R * .15;
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = OL; g.lineWidth = E.boss ? 3.2 : 2;
  const eyes = (x, y, d, r, col) => { g.fillStyle = col || '#ff3a3a'; g.save(); g.shadowColor = col || '#ff3a3a'; g.shadowBlur = 5; circ(g, x - d, y, r); g.fill(); circ(g, x + d, y, r); g.fill(); g.restore(); };
  const a = f ? 1 : -1, sc = R / 14;
  g.translate(cx, cy); g.scale(sc, sc);
  switch (k){
    case 'goblin': case 'reiGoblin': {
      g.fillStyle = '#6a3a1e'; ell(g, -5 + a, 12, 4, 3); fs(g); ell(g, 5 - a, 12, 4, 3); fs(g);
      g.fillStyle = vg(g, '#7a5a2a', 0, 14); rr(g, -8, 0, 16, 12, 4); fs(g);
      g.fillStyle = vg(g, '#6cbf45', -14, 4); g.beginPath(); g.moveTo(-9, -6); g.lineTo(-19, -12 + a); g.lineTo(-10, -2); g.closePath(); fs(g); g.beginPath(); g.moveTo(9, -6); g.lineTo(19, -12 - a); g.lineTo(10, -2); g.closePath(); fs(g);
      circ(g, 0, -5, 10); fs(g); eyes(0, -6, 3.6, 1.8, '#ffdf3a'); g.fillStyle = OL; rr(g, -4, -1, 8, 2, 1); g.fill(); g.fillStyle = '#fff'; g.fillRect(-3, -1, 1.6, 1.6); g.fillRect(1.6, -1, 1.6, 1.6);
      g.strokeStyle = '#7a4a24'; g.lineWidth = 3; g.beginPath(); g.moveTo(9, 4); g.lineTo(15 + a * 2, -4); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2;
      if (k === 'reiGoblin'){ g.fillStyle = '#f6c945'; g.beginPath(); g.moveTo(-8, -13); g.lineTo(-8, -20); g.lineTo(-4, -16); g.lineTo(0, -22); g.lineTo(4, -16); g.lineTo(8, -20); g.lineTo(8, -13); g.closePath(); fs(g); }
      break; }
    case 'aranha': {
      g.strokeStyle = OL; g.lineWidth = 2.4;
      for (let i = 0; i < 4; i++){ const y = -6 + i * 4, o = (i % 2 ? a : -a) * 3; g.beginPath(); g.moveTo(-6, y); g.lineTo(-14, y - 6 + o); g.lineTo(-18, y + 4 + o); g.moveTo(6, y); g.lineTo(14, y - 6 - o); g.lineTo(18, y + 4 - o); g.stroke(); }
      g.fillStyle = vg(g, '#3a2a3a', -10, 12); ell(g, 0, 4, 10, 9); fs(g); g.fillStyle = vg(g, '#4a344a', -12, 0); circ(g, 0, -7, 7); fs(g);
      g.fillStyle = '#c03a3a'; ell(g, 0, 5, 3.5, 4); g.fill(); eyes(0, -8, 2.6, 1.4, '#ff4a4a'); break; }
    case 'slime': {
      const q = f ? 1.06 : .94; g.scale(1 / q, q);
      g.fillStyle = 'rgba(80,200,90,.85)'; g.beginPath(); g.moveTo(-14, 10); g.quadraticCurveTo(-15, -12, 0, -13); g.quadraticCurveTo(15, -12, 14, 10); g.quadraticCurveTo(0, 14, -14, 10); fs(g);
      g.fillStyle = 'rgba(255,255,255,.45)'; ell(g, -6, -6, 3.5, 2.5, -.5); g.fill(); g.fillStyle = OL; ell(g, -4, 0, 1.8, 2.6); g.fill(); ell(g, 4, 0, 1.8, 2.6); g.fill(); break; }
    case 'zumbi': {
      g.fillStyle = '#4a3a2a'; ell(g, -5, 13, 4, 3); fs(g); ell(g, 5, 13, 4, 3); fs(g);
      g.fillStyle = vg(g, '#5a6a7a', 0, 14); rr(g, -9, -1, 18, 14, 3); fs(g); g.fillStyle = '#3a4a5a'; g.beginPath(); g.moveTo(-9, 8); g.lineTo(-5, 13); g.lineTo(-1, 9); g.lineTo(3, 13); g.lineTo(9, 9); g.lineTo(9, 13); g.lineTo(-9, 13); g.closePath(); g.fill();
      g.fillStyle = vg(g, '#8fae7a', -14, 6); rr(g, -14, 1 + a, 7, 5, 2.5); fs(g); rr(g, 7, 1 - a, 7, 5, 2.5); fs(g); circ(g, 0, -7, 9.5); fs(g);
      eyes(0, -8, 3.4, 1.8, '#e8ff7a'); g.strokeStyle = OL; g.beginPath(); g.moveTo(-3, -2); g.lineTo(3, -3); g.stroke(); break; }
    case 'morcego': {
      const wy = f ? -10 : 4; g.fillStyle = vg(g, '#4a2a5a', -12, 8);
      for (const s of [-1, 1]){ g.beginPath(); g.moveTo(s * 4, -2); g.quadraticCurveTo(s * 14, wy - 4, s * 20, wy); g.lineTo(s * 15, wy + 3); g.lineTo(s * 12, wy); g.lineTo(s * 8, wy + 4); g.closePath(); fs(g); }
      ell(g, 0, 0, 7, 8); fs(g); g.beginPath(); g.moveTo(-5, -6); g.lineTo(-6, -12); g.lineTo(-2, -7); g.moveTo(5, -6); g.lineTo(6, -12); g.lineTo(2, -7); fs(g); eyes(0, -2, 2.6, 1.5); break; }
    case 'esqueleto': case 'lich': {
      if (k === 'lich'){ g.fillStyle = vg(g, '#3b2a5a', -6, 16, .1, -.3); g.beginPath(); g.moveTo(-8, -4); g.lineTo(8, -4); g.lineTo(14 + a, 15); g.lineTo(-14 + a, 15); g.closePath(); fs(g); g.strokeStyle = '#c070ff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-12, 12); g.lineTo(12, 12); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2; }
      else { g.strokeStyle = '#e8e2d0'; g.lineWidth = 3; g.beginPath(); g.moveTo(-3, 6); g.lineTo(-5 + a, 14); g.moveTo(3, 6); g.lineTo(5 - a, 14); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2;
        g.fillStyle = '#e8e2d0'; rr(g, -7, -2, 14, 9, 3); fs(g); g.strokeStyle = '#8a8270'; g.lineWidth = 1.2; for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(-5, 0 + i * 2.6); g.lineTo(5, 0 + i * 2.6); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 2; }
      g.fillStyle = vg(g, '#f2ecdc', -16, -2); circ(g, 0, -8, 8.5); fs(g); rr(g, -4, -3, 8, 4, 1.5); fs(g);
      g.fillStyle = OL; ell(g, -3.2, -9, 2.4, 2.8); g.fill(); ell(g, 3.2, -9, 2.4, 2.8); g.fill(); eyes(0, -9, 3.2, 1.1, k === 'lich' ? '#c070ff' : '#7fd0ff');
      if (k === 'lich'){ g.fillStyle = '#c9b6ff'; g.beginPath(); g.moveTo(-7, -14); g.lineTo(-6, -21); g.lineTo(-2, -16); g.lineTo(0, -23); g.lineTo(2, -16); g.lineTo(6, -21); g.lineTo(7, -14); g.closePath(); fs(g);
        g.strokeStyle = '#6a4424'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(12, 14); g.lineTo(13, -16); g.stroke(); g.save(); g.shadowColor = '#c070ff'; g.shadowBlur = 8; g.fillStyle = '#c070ff'; circ(g, 13, -18, 3); g.fill(); g.restore(); }
      break; }
    case 'cultista': {
      g.fillStyle = vg(g, '#8a2a2a', -14, 14, .1, -.35); g.beginPath(); g.moveTo(0, -16); g.quadraticCurveTo(11, -10, 9, 0); g.lineTo(12 + a, 14); g.lineTo(-12 + a, 14); g.lineTo(-9, 0); g.quadraticCurveTo(-11, -10, 0, -16); fs(g);
      g.fillStyle = '#1a0e14'; ell(g, 0, -6, 6, 5.5); g.fill(); eyes(0, -6.5, 2.4, 1.5, '#ffb04a');
      g.strokeStyle = '#d9ac4e'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-8, 8); g.lineTo(8, 8); g.stroke(); g.strokeStyle = OL; g.lineWidth = 2; break; }
    case 'golem': case 'golemRei': {
      const st = k === 'golemRei' ? '#6a7a8a' : '#7a7a72', rune = k === 'golemRei' ? '#7fe0ff' : '#ffb04a';
      g.fillStyle = vg(g, st, -14, 16); rr(g, -12, 9, 9, 6, 2); fs(g); rr(g, 3, 9, 9, 6, 2); fs(g); rr(g, -11, -6, 22, 17, 4); fs(g);
      rr(g, -19, -6 + a, 8, 14, 3); fs(g); rr(g, 11, -6 - a, 8, 14, 3); fs(g); rr(g, -7, -16, 14, 11, 3); fs(g);
      g.save(); g.shadowColor = rune; g.shadowBlur = 6; g.strokeStyle = rune; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-5, 0); g.lineTo(0, 5); g.lineTo(5, 0); g.moveTo(0, -3); g.lineTo(0, 8); g.stroke(); g.restore(); eyes(0, -11, 3, 1.5, rune);
      if (k === 'golemRei'){ g.fillStyle = '#d9ac4e'; rr(g, -9, -21, 18, 4, 1.5); fs(g); g.strokeStyle = '#d9ac4e'; g.lineWidth = 2; circ(g, -15, 2, 3); g.stroke(); circ(g, 15, 2, 3); g.stroke(); }
      break; }
    case 'elemental': {
      g.save(); g.shadowColor = '#ff7a2a'; g.shadowBlur = 10; const fl = f ? 2 : -2;
      g.fillStyle = '#ff7a2a'; g.beginPath(); g.moveTo(-11, 12); g.quadraticCurveTo(-15, -2, -6 + fl, -10); g.quadraticCurveTo(-4, -18, 0 - fl, -20); g.quadraticCurveTo(4, -14, 7 + fl, -12); g.quadraticCurveTo(15, -2, 11, 12); g.closePath(); g.fill();
      g.fillStyle = '#ffd04a'; g.beginPath(); g.moveTo(-6, 11); g.quadraticCurveTo(-8, 0, 0 + fl, -10); g.quadraticCurveTo(8, 0, 6, 11); g.closePath(); g.fill(); g.restore();
      g.fillStyle = OL; ell(g, -3.5, -1, 1.8, 2.6); g.fill(); ell(g, 3.5, -1, 1.8, 2.6); g.fill(); break; }
    case 'espirito': {
      g.fillStyle = 'rgba(190,240,255,.75)'; g.beginPath(); g.moveTo(-10, 0); g.arc(0, -4, 10, Math.PI, 0); g.lineTo(10, 8); for (let i = 0; i < 4; i++){ const x = 10 - (i + 1) * 5; g.quadraticCurveTo(x + 2.5, 14 + (i % 2 ? a : -a) * 2, x, 8); } g.closePath(); g.save(); g.shadowColor = '#bff0ff'; g.shadowBlur = 10; g.fill(); g.restore(); g.stroke();
      g.fillStyle = '#1a2a3a'; ell(g, -3.5, -4, 2.2, 3.2); g.fill(); ell(g, 3.5, -4, 2.2, 3.2); g.fill(); ell(g, 0, 2, 2, 1.4); g.fill(); break; }
    case 'dragao': {
      g.fillStyle = vg(g, '#a82a22', -16, 10); for (const s of [-1, 1]){ g.beginPath(); g.moveTo(s * 5, -4); g.quadraticCurveTo(s * 20, -20 + (f ? 4 : 0) * s * s, s * 26, -6 + (f ? 4 : -2)); g.lineTo(s * 20, -2); g.lineTo(s * 16, 4); g.lineTo(s * 10, 2); g.closePath(); fs(g); }
      g.fillStyle = vg(g, '#c83a2a', -10, 16); ell(g, 0, 4, 10, 11); fs(g); g.fillStyle = '#f6c97a'; ell(g, 0, 6, 5, 7); g.fill();
      g.beginPath(); g.moveTo(-4, 13); g.quadraticCurveTo(a * 6, 20, a * 10, 16); g.stroke();
      g.fillStyle = vg(g, '#c83a2a', -20, -4); ell(g, 0, -10, 8, 7); fs(g); g.fillStyle = '#f2e6c8'; g.beginPath(); g.moveTo(-5, -15); g.lineTo(-8, -22); g.lineTo(-2, -16); g.moveTo(5, -15); g.lineTo(8, -22); g.lineTo(2, -16); fs(g);
      eyes(0, -11, 3.4, 1.6, '#ffdf3a'); g.fillStyle = OL; circ(g, -1.6, -6, .8); g.fill(); circ(g, 1.6, -6, .8); g.fill(); break; }
    case 'devorador': {
      g.strokeStyle = '#3a1a5a'; g.lineWidth = 4;
      for (let i = 0; i < 8; i++){ const an = i / 8 * TAU + (f ? .15 : -.15); g.beginPath(); g.moveTo(Math.cos(an) * 8, Math.sin(an) * 8); g.quadraticCurveTo(Math.cos(an + .4) * 18, Math.sin(an + .4) * 18, Math.cos(an - .2) * 24, Math.sin(an - .2) * 24); g.stroke(); }
      g.strokeStyle = OL; g.lineWidth = 2; const gr = g.createRadialGradient(0, -2, 2, 0, 0, 15); gr.addColorStop(0, '#6a3aa8'); gr.addColorStop(1, '#1a0e2a'); g.fillStyle = gr; circ(g, 0, 0, 14); fs(g);
      for (const [x, y, r] of [[0, -3, 3.6], [-7, 3, 2.2], [7, 3, 2.2], [-3, 8, 1.6], [4, -9, 1.6]]){ g.fillStyle = '#f2e6ff'; circ(g, x, y, r); g.fill(); g.fillStyle = '#c03aff'; circ(g, x, y, r * .5); g.fill(); }
      break; }
  }
  return cv;
}
function enemySpr(k){
  if (SPR['e' + k]) return SPR['e' + k];
  const fr = [drawEnemy(k, 0), drawEnemy(k, 1)];
  return (SPR['e' + k] = {fr, fl: fr.map(flashOf)});
}
/* ---------- arte: cenário ---------- */
function groundTile(b){
  const k = 'g' + b; if (SPR[k]) return SPR[k];
  const B = BIOMES[b], T = 256, c = mk(T, T), g = c.getContext('2d');
  g.fillStyle = B.g; g.fillRect(0, 0, T, T);
  for (let i = 0; i < 900; i++){ const x = hash(i, b * 7) * T, y = hash(i * 3, b + 11) * T, r = 1 + hash(i, 99) * 3; g.fillStyle = hash(i, 5) > .5 ? rgba(B.g2.replace('#', '#'), .55) : rgba(B.d, .45); g.fillRect(x, y, r, r); }
  if (b === 0){ for (let i = 0; i < 70; i++){ const x = hash(i, 1) * T, y = hash(i, 2) * T; g.strokeStyle = rgba('#7ac05a', .55); g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y - 6); g.moveTo(x + 2, y); g.lineTo(x + 3, y - 7); g.moveTo(x + 4, y); g.lineTo(x + 7, y - 5); g.stroke(); } }
  if (b === 1){ for (let i = 0; i < 30; i++){ const x = hash(i, 3) * T, y = hash(i, 4) * T; g.fillStyle = rgba('#2a2c34', .6); ell(g, x, y, 6 + hash(i, 5) * 8, 3 + hash(i, 6) * 3); g.fill(); } g.fillStyle = rgba('#8a9aaa', .05); g.fillRect(0, 0, T, T); }
  if (b === 2){ g.strokeStyle = rgba('#3a3024', .55); g.lineWidth = 2; for (let y = 0; y < T; y += 32){ g.beginPath(); g.moveTo(0, y); g.lineTo(T, y); g.stroke(); for (let x = (y / 32) % 2 ? 0 : 24; x < T; x += 48){ g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } g.fillStyle = rgba('#ffffff', .04); for (let y = 0; y < T; y += 32) g.fillRect(0, y + 2, T, 4); }
  if (b === 3){ g.strokeStyle = rgba('#5a4c32', .5); g.lineWidth = 1.5; for (let i = 0; i < 18; i++){ const x = hash(i, 8) * T, y = hash(i, 9) * T; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 4; j++) g.lineTo(x + (hash(i, j) - .5) * 40, y + (hash(j, i) - .5) * 40); g.stroke(); } }
  if (b === 4){ for (let i = 0; i < 60; i++){ const x = hash(i, 10) * T, y = hash(i, 12) * T; g.fillStyle = rgba(hash(i, 13) > .5 ? '#a070ff' : '#5a3aa8', .3 + hash(i, 14) * .4); circ(g, x, y, .8 + hash(i, 15) * 1.6); g.fill(); } g.strokeStyle = rgba('#7a4aff', .18); g.lineWidth = 2; for (let i = 0; i < 6; i++){ const x = hash(i, 16) * T, y = hash(i, 17) * T; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 40, y + 10, x + 60, y + 40); g.stroke(); } }
  return (SPR[k] = c);
}
function propSpr(p){
  const k = 'p' + p; if (SPR[k]) return SPR[k];
  const c = mk(80, 96), g = c.getContext('2d'), cx = 40, by = 90; g.lineJoin = 'round'; g.strokeStyle = OL; g.lineWidth = 2.2;
  g.fillStyle = 'rgba(0,0,0,.28)'; ell(g, cx, by - 2, 22, 6); g.fill();
  switch (p){
    case 'tree': g.fillStyle = vg(g, '#7a5232', 50, 90); rr(g, cx - 6, 52, 12, 38, 4); fs(g); for (const [x, y, r, col] of [[cx - 14, 44, 16, '#2f7a34'], [cx + 14, 46, 15, '#2a6e30'], [cx, 30, 21, '#3a9040'], [cx, 50, 16, '#348a3a']]){ g.fillStyle = vg(g, col, y - r, y + r); circ(g, x, y, r); fs(g); } g.fillStyle = rgba('#ffffff', .15); circ(g, cx - 6, 22, 7); g.fill(); break;
    case 'bush': g.fillStyle = vg(g, '#3a8a40', 60, 90); for (const [x, y, r] of [[cx - 12, 78, 11], [cx + 12, 78, 11], [cx, 70, 14]]){ circ(g, x, y, r); fs(g); } g.fillStyle = '#ff6a8a'; for (const [x, y] of [[cx - 8, 70], [cx + 6, 66], [cx + 13, 76]]){ circ(g, x, y, 2.4); g.fill(); } break;
    case 'flower': for (let i = 0; i < 5; i++){ const x = cx - 14 + i * 7, y = 82 - (i % 2) * 6; g.strokeStyle = '#3a8a40'; g.beginPath(); g.moveTo(x, by - 2); g.lineTo(x, y); g.stroke(); g.fillStyle = ['#ffdf6a', '#ff8ab0', '#bfa0ff'][i % 3]; circ(g, x, y, 3.4); g.fill(); } break;
    case 'rock': g.fillStyle = vg(g, '#8a8a82', 64, 90); g.beginPath(); g.moveTo(cx - 20, by - 4); g.lineTo(cx - 14, 68); g.lineTo(cx + 2, 62); g.lineTo(cx + 18, 70); g.lineTo(cx + 22, by - 4); g.closePath(); fs(g); g.fillStyle = rgba('#ffffff', .18); g.beginPath(); g.moveTo(cx - 12, 70); g.lineTo(cx + 2, 65); g.lineTo(cx - 2, 74); g.closePath(); g.fill(); break;
    case 'tomb': g.fillStyle = vg(g, '#8a8e9a', 44, 90); g.beginPath(); g.moveTo(cx - 13, by - 4); g.lineTo(cx - 13, 56); g.arc(cx, 56, 13, Math.PI, 0); g.lineTo(cx + 13, by - 4); g.closePath(); fs(g); g.strokeStyle = '#4a4e5a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx, 52); g.lineTo(cx, 72); g.moveTo(cx - 6, 58); g.lineTo(cx + 6, 58); g.stroke(); g.fillStyle = '#4a7a3a'; ell(g, cx - 10, by - 5, 6, 3); g.fill(); break;
    case 'deadtree': g.strokeStyle = '#3a2e2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(cx, by - 2); g.lineTo(cx, 46); g.lineTo(cx - 16, 28); g.moveTo(cx, 58); g.lineTo(cx + 18, 38); g.lineTo(cx + 22, 26); g.moveTo(cx - 8, 38); g.lineTo(cx - 20, 40); g.stroke(); g.strokeStyle = '#5a4a44'; g.lineWidth = 2.5; g.stroke(); break;
    case 'candle': for (const [x, h] of [[cx - 8, 20], [cx + 2, 28], [cx + 10, 16]]){ g.fillStyle = '#e8e0c8'; rr(g, x - 3, by - 4 - h, 6, h, 2); fs(g); g.save(); g.shadowColor = '#ffb04a'; g.shadowBlur = 10; g.fillStyle = '#ffd04a'; ell(g, x, by - 9 - h, 2.4, 4.5); g.fill(); g.restore(); } break;
    case 'pillar': g.fillStyle = vg(g, '#d8ccb4', 20, 90); rr(g, cx - 10, 24, 20, 64, 2); fs(g); rr(g, cx - 14, 18, 28, 8, 2); fs(g); rr(g, cx - 14, 82, 28, 8, 2); fs(g); g.strokeStyle = rgba('#8a7c64', .7); g.lineWidth = 1.5; for (let i = -5; i <= 5; i += 5){ g.beginPath(); g.moveTo(cx + i, 28); g.lineTo(cx + i, 80); g.stroke(); } break;
    case 'lamp': g.fillStyle = '#2a2a32'; rr(g, cx - 2.5, 30, 5, 58, 2); fs(g); rr(g, cx - 9, by - 6, 18, 6, 2); fs(g); g.save(); g.shadowColor = '#ffd07a'; g.shadowBlur = 14; g.fillStyle = '#ffe2a0'; rr(g, cx - 7, 16, 14, 16, 3); fs(g); g.restore(); break;
    case 'crate': g.fillStyle = vg(g, '#a8783e', 58, 90); rr(g, cx - 16, 58, 32, 30, 3); fs(g); g.strokeStyle = '#6a4424'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 14, 60); g.lineTo(cx + 14, 86); g.moveTo(cx + 14, 60); g.lineTo(cx - 14, 86); g.stroke(); break;
    case 'banner': g.fillStyle = '#3a2a22'; rr(g, cx - 2, 18, 4, 72, 2); fs(g); g.fillStyle = vg(g, ['#c83a3a', '#2c5fa8', '#2f7a3a'][0], 20, 60); g.beginPath(); g.moveTo(cx + 2, 20); g.lineTo(cx + 26, 20); g.lineTo(cx + 26, 54); g.lineTo(cx + 14, 46); g.lineTo(cx + 2, 54); g.closePath(); fs(g); g.fillStyle = '#f6c945'; star(g, cx + 14, 33, 6, 2.6, 5); g.fill(); break;
    case 'hedron': g.save(); g.translate(cx, 58); g.fillStyle = vg(g, '#c9b98a', -30, 30); g.beginPath(); g.moveTo(0, -30); g.lineTo(12, 0); g.lineTo(0, 30); g.lineTo(-12, 0); g.closePath(); fs(g); g.fillStyle = rgba('#000000', .15); g.beginPath(); g.moveTo(0, -30); g.lineTo(12, 0); g.lineTo(0, 30); g.closePath(); g.fill(); g.save(); g.shadowColor = '#7fe0ff'; g.shadowBlur = 8; g.strokeStyle = '#7fe0ff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-4, -8); g.lineTo(4, -8); g.moveTo(0, -14); g.lineTo(0, 10); g.stroke(); g.restore(); g.restore(); break;
    case 'crystal': for (const [x, h, col] of [[cx - 9, 34, '#7fe0ff'], [cx + 3, 46, '#a070ff'], [cx + 12, 26, '#7fe0ff']]){ g.save(); g.shadowColor = col; g.shadowBlur = 10; g.fillStyle = vg(g, col, by - h, by, .4, -.2); g.beginPath(); g.moveTo(x - 6, by - 4); g.lineTo(x - 5, by - h + 8); g.lineTo(x, by - h); g.lineTo(x + 5, by - h + 8); g.lineTo(x + 6, by - 4); g.closePath(); g.fill(); g.restore(); g.stroke(); } break;
    case 'ruin': g.fillStyle = vg(g, '#a89a78', 40, 90); rr(g, cx - 22, 50, 14, 40, 2); fs(g); rr(g, cx + 6, 62, 16, 28, 2); fs(g); rr(g, cx - 24, 44, 22, 8, 2); fs(g); break;
    case 'voidrock': g.fillStyle = vg(g, '#3a2a5a', 50, 90); g.beginPath(); g.moveTo(cx - 18, by - 4); g.lineTo(cx - 10, 54); g.lineTo(cx + 4, 46); g.lineTo(cx + 16, 60); g.lineTo(cx + 20, by - 4); g.closePath(); fs(g); g.save(); g.shadowColor = '#c070ff'; g.shadowBlur = 10; g.strokeStyle = '#c070ff'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(cx - 6, 62); g.lineTo(cx + 2, 72); g.lineTo(cx + 10, 64); g.stroke(); g.restore(); break;
    case 'eye': g.save(); g.shadowColor = '#c070ff'; g.shadowBlur = 16; g.fillStyle = '#efe6ff'; ell(g, cx, 70, 16, 9); g.fill(); g.restore(); g.stroke(); g.fillStyle = '#7a2ad6'; circ(g, cx, 70, 6); g.fill(); g.fillStyle = OL; circ(g, cx, 70, 2.6); g.fill(); break;
  }
  return (SPR[k] = c);
}

/* ---------- áudio sintetizado ---------- */
const AU = {ctx:null, on:true, m:null, last:{}, step:0, mi:0};
function auInit(){ if (AU.ctx) return; try { AU.ctx = new (window.AudioContext || window.webkitAudioContext)(); AU.out = AU.ctx.createGain(); AU.out.gain.value = .5; AU.out.connect(AU.ctx.destination); } catch(e){} AU.on = S.svSound !== false; }
function tone(f, d, o){ if (!AU.ctx || !AU.on) return; o = o || {}; const t = AU.ctx.currentTime + (o.when || 0), os = AU.ctx.createOscillator(), gn = AU.ctx.createGain(); os.type = o.type || 'square'; os.frequency.setValueAtTime(f, t); if (o.f2) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t + d); gn.gain.setValueAtTime(o.vol || .06, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); os.connect(gn); gn.connect(AU.out); os.start(t); os.stop(t + d + .02); }
function noise(d, vol, freq){ if (!AU.ctx || !AU.on) return; const t = AU.ctx.currentTime, b = AU.ctx.createBuffer(1, Math.ceil(AU.ctx.sampleRate * d), AU.ctx.sampleRate), da = b.getChannelData(0); for (let i = 0; i < da.length; i++) da[i] = Math.random() * 2 - 1; const s = AU.ctx.createBufferSource(), fl = AU.ctx.createBiquadFilter(), gn = AU.ctx.createGain(); s.buffer = b; fl.type = 'lowpass'; fl.frequency.value = freq || 1200; gn.gain.setValueAtTime(vol || .1, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl); fl.connect(gn); gn.connect(AU.out); s.start(t); }
function sfx(k){
  if (!AU.ctx || !AU.on) return; const now = performance.now(), gap = {hit:45, gem:35, shoot:70, kill:40}[k] || 0;
  if (gap && now - (AU.last[k] || 0) < gap) return; AU.last[k] = now;
  switch (k){
    case 'shoot': tone(880, .06, {type:'triangle', vol:.025, f2:440}); break;
    case 'hit': noise(.05, .05, 2400); break;
    case 'kill': tone(320, .08, {vol:.03, f2:120}); break;
    case 'gem': tone(1100 + Math.random() * 300, .05, {type:'sine', vol:.035}); break;
    case 'lvl': [0, 4, 7, 12].forEach((s, i) => tone(523 * Math.pow(2, s / 12), .16, {type:'triangle', vol:.06, when:i * .07})); break;
    case 'hurt': tone(160, .18, {type:'sawtooth', vol:.07, f2:70}); break;
    case 'boom': noise(.4, .18, 600); tone(90, .35, {type:'sine', vol:.14, f2:40}); break;
    case 'evo': [0, 7, 12, 16, 19, 24].forEach((s, i) => tone(392 * Math.pow(2, s / 12), .22, {type:'triangle', vol:.07, when:i * .08})); break;
    case 'boss': [0, -1, -5].forEach((s, i) => tone(110 * Math.pow(2, s / 12), .5, {type:'sawtooth', vol:.08, when:i * .25})); break;
    case 'dash': noise(.12, .07, 3000); break;
    case 'chest': [0, 4, 7, 11, 14].forEach((s, i) => tone(659 * Math.pow(2, s / 12), .14, {type:'sine', vol:.06, when:i * .06})); break;
  }
}
function musStart(){ musStop(); if (!AU.ctx) return; AU.m = setInterval(() => { if (!R || R.paused || R.modal || !AU.on) return; const sc = BIOMES[R.biome].mus, st = AU.step++, boss = R.boss;
  const root = 110 * (boss ? 1.06 : 1), n = sc[(st * 3 + (st >> 3)) % sc.length]; if (st % 2 === 0) tone(root * Math.pow(2, n / 12) * 2, .18, {type:'triangle', vol:.025});
  if (st % 4 === 0) tone(root * Math.pow(2, sc[(st >> 2) % sc.length] / 12) / 2, .3, {type:boss ? 'sawtooth' : 'sine', vol:.05}); if (boss && st % 2 === 1) noise(.04, .03, 6000); if (st % 8 === 4) noise(.06, .04, 900); }, 150); }
function musStop(){ if (AU.m){ clearInterval(AU.m); AU.m = null; } }

/* ---------- estado da partida ---------- */
let R = null, raf = 0, cv = null, ctx = null, VW = 0, VH = 0, DPR = 1, Z = 1;
const sel = {c:'R', view:'main'};
function stats(){
  const U = meta().v3.up, P = R.pas, lv = k => (P[k] || 0), m = R.mage;
  const st = {
    dmg:(1 + lv('foco') * .1 + (U.poder || 0) * .05) * (m === 'R' ? 1.1 : 1) * (1 + R.tier * .06),
    area:1 + lv('tomo') * .1, cd:Math.max(.4, (1 - lv('pergaminho') * .08) * (m === 'U' ? .9 : 1)),
    armor:lv('relicario') + (U.armadura || 0) + (m === 'W' ? 1 : 0), regen:lv('relicario') * .3 + (m === 'G' ? .5 : 0) + R.tier * .15,
    maxhp:100 + lv('calice') * 20 + (U.vida || 0) * 10 + (m === 'G' ? 25 : 0) + R.tier * 15, steal:lv('calice') * .01 + (m === 'B' ? .03 : 0),
    xp:1 + lv('semente') * .12 + (U.sabedoria || 0) * .06, proj:(lv('engrenagem') >= 2 ? 1 : 0) + (lv('engrenagem') >= 4 ? 1 : 0), pspd:1 + lv('engrenagem') * .08,
    mag:(70 + R.tier * 8) * (1 + lv('vela') * .3 + (U.ima || 0) * .12), luck:1 + lv('vela') * .1, spd:175 * (1 + (U.pressa || 0) * .04) * (1 + R.tier * .03)
  };
  R.st = st; R.maxhp = st.maxhp; if (R.hp > R.maxhp) R.hp = R.maxhp; return st;
}
function newRun(o){
  const M = meta(), hard = !!M.v3.hard;
  R = {mage:o.c, t:0, kills:0, lvl:1, xp:0, need:6, hp:100, maxhp:100, tier:0, x:0, y:0, vx:0, vy:0, face:1, anim:0, inv:0, dashCd:0, dashT:0, dx:0, dy:0,
    w:{}, pas:{}, evo:{}, en:[], pr:[], ep:[], gems:[], items:[], parts:[], nums:[], fx:[], tele:[], props:{}, biome:0, bossIdx:0, boss:null, bossDue:150,
    spawnAcc:0, eliteT:55, ult:0, ultMax:100, cam:{x:0, y:0, sh:0}, paused:false, modal:null, over:false, hard, rer:(M.v3.up.rerrolar || 0), revive:(M.v3.up.renascer || 0),
    lite:!!S.lite, q:S.lite ? 0 : 1, ftAvg:16, fpsLowT:0, banner:null, endless:false, cenRun:0, bossKills:0, gemTotal:0, chests:0};
  R.w[MAGES[o.c].w] = {l:1, t:0, s:{}};
  stats(); R.hp = R.maxhp;
  return R;
}
const tierOf = l => { let t = 0; TIERS.forEach((x, i) => { if (l >= x[0]) t = i; }); return t; };

/* ---------- inimigos ---------- */
const GRID = new Map(), CELL = 64;
function gridBuild(){ GRID.clear(); for (const e of R.en){ if (e.dead) continue; const k = Math.floor(e.x / CELL) * 73856093 ^ Math.floor(e.y / CELL) * 19349663; let a = GRID.get(k); if (!a){ a = []; GRID.set(k, a); } a.push(e); } }
function gridNear(x, y, r, cb){ const x0 = Math.floor((x - r) / CELL), x1 = Math.floor((x + r) / CELL), y0 = Math.floor((y - r) / CELL), y1 = Math.floor((y + r) / CELL); for (let i = x0; i <= x1; i++) for (let j = y0; j <= y1; j++){ const a = GRID.get(i * 73856093 ^ j * 19349663); if (a) for (const e of a) if (!e.dead) cb(e); } }
function scaleHp(){ const t = R.t / 60; return (1 + t * .38 + t * t * .018) * (R.hard ? 1.5 : 1) * (R.endless ? 1 + (R.t - 900) / 240 : 1); }
function spawn(k, x, y, o){
  const E = EN[k]; o = o || {};
  if (x == null){ const a = Math.random() * TAU, d = Math.hypot(VW, VH) / 2 + 40 + Math.random() * 80; x = R.x + Math.cos(a) * d; y = R.y + Math.sin(a) * d; }
  const hp = E.boss ? E.hp * 1.5 * (R.hard ? 1.4 : 1) * (R.endless ? 2 : 1) : E.hp * scaleHp() * (o.elite ? 9 : 1);
  const e = {k, x, y, r:E.r * (o.elite ? 1.45 : 1), hp, mhp:hp, sp:E.sp * (o.elite ? .85 : 1) * (R.hard ? 1.1 : 1) * (.9 + Math.random() * .2), dmg:E.dmg * (1 + R.t / 600) * (R.hard ? 1.3 : 1), xp:E.xp * (o.elite ? 12 : 1),
    flash:0, kx:0, ky:0, ph:Math.random() * TAU, an:Math.random(), elite:!!o.elite, boss:!!E.boss, slow:0, cd:1 + Math.random() * 2, st:0, stT:2, small:!!o.small};
  if (o.small){ e.r *= .65; e.hp = e.mhp = hp * .35; e.xp = 1; }
  R.en.push(e); return e;
}
function director(dt){
  const t = R.t, B = BIOMES[R.biome], cap = R.q ? 230 : 150;
  const alive = R.en.length, want = Math.min(cap, 14 + t * .55 + (R.endless ? 60 : 0));
  R.spawnAcc += dt * (1.2 + t / 50) * (R.hard ? 1.3 : 1);
  while (R.spawnAcc >= 1){ R.spawnAcc -= 1; if (alive >= want) break; const k = B.en[Math.floor(Math.random() * B.en.length)]; const n = 1 + (Math.random() < .25 ? 3 : 0); const a = Math.random() * TAU, d = Math.hypot(VW, VH) / 2 + 60; for (let i = 0; i < n; i++) spawn(k, R.x + Math.cos(a) * d + (Math.random() - .5) * 60, R.y + Math.sin(a) * d + (Math.random() - .5) * 60); }
  R.eliteT -= dt; if (R.eliteT <= 0 && !R.boss){ R.eliteT = 50 + Math.random() * 20; spawn(B.en[Math.floor(Math.random() * B.en.length)], null, null, {elite:1}); banner('Uma criatura de elite apareceu!', 1.8); }
  /* horda em círculo a cada 2 min */
  if (Math.floor((t - dt) / 120) !== Math.floor(t / 120) && t > 30 && !R.boss){ const k = B.en[0]; for (let i = 0; i < 28; i++){ const a = i / 28 * TAU, d = Math.max(VW, VH) * .62; spawn(k, R.x + Math.cos(a) * d, R.y + Math.sin(a) * d); } banner('Horda! Abra caminho!', 1.8); }
  if (!R.boss && !R.endless && t >= R.bossDue && R.bossIdx < 5){ const b = spawn(BIOMES[R.bossIdx].boss); R.boss = b; b.st = 0; b.stT = 2.5; banner(EN[b.k].n + ' chegou!', 2.6); sfx('boss'); }
  if (R.endless && Math.floor((t - dt) / 90) !== Math.floor(t / 90)){ const i = Math.floor(Math.random() * 5); spawn(BIOMES[i].boss); banner('Um chefe voltou mais forte!', 2); }
}
/* padrões de chefe com aviso (círculos/linhas vermelhas) */
function bossAI(e, dt){
  e.stT -= dt; const P = R, dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1;
  if (e.st === 'charge'){ e.x += e.cvx * dt; e.y += e.cvy * dt; if (e.stT <= 0){ e.st = 0; e.stT = 2.2; } return true; }
  if (e.stT > 0) return false;
  const k = e.k, r = Math.random();
  if (k === 'reiGoblin'){ if (r < .5){ tele({k:'line', x:e.x, y:e.y, a:Math.atan2(dy, dx), len:420, w:e.r * 1.6, t:.9, then:() => { e.st = 'charge'; e.stT = .55; e.cvx = Math.cos(Math.atan2(dy, dx)) * 760; e.cvy = Math.sin(Math.atan2(dy, dx)) * 760; }}); e.stT = 1.0; e.st = 'wind'; } else { for (let i = 0; i < 6; i++) spawn('goblin', e.x + Math.cos(i) * 60, e.y + Math.sin(i) * 60); e.stT = 3; } }
  else if (k === 'lich'){ if (r < .6){ for (let i = 0; i < 5; i++){ const x = P.x + (Math.random() - .5) * 260, y = P.y + (Math.random() - .5) * 260; tele({k:'circ', x, y, r:56, t:1.1, dmg:22}); } tele({k:'circ', x:P.x, y:P.y, r:56, t:1.1, dmg:22}); e.stT = 2.6; } else { for (let i = 0; i < 8; i++) spawn('esqueleto', e.x + Math.cos(i * .8) * 70, e.y + Math.sin(i * .8) * 70); e.stT = 3; } }
  else if (k === 'golemRei'){ if (r < .55){ tele({k:'ring', x:e.x, y:e.y, r:200, t:1.2, dmg:28}); e.stT = 2.6; } else { for (let i = 0; i < 16; i++){ const a = i / 16 * TAU; R.ep.push({x:e.x, y:e.y, vx:Math.cos(a) * 190, vy:Math.sin(a) * 190, r:9, dmg:16, life:4, col:'#7fe0ff'}); } e.stT = 2.2; } }
  else if (k === 'dragao'){ if (r < .5){ const a = Math.atan2(dy, dx); tele({k:'cone', x:e.x, y:e.y, a, len:340, sp:.5, t:1, dmg:30}); e.stT = 2.4; } else { for (let i = -3; i <= 3; i++){ const a = Math.atan2(dy, dx) + i * .16; R.ep.push({x:e.x, y:e.y, vx:Math.cos(a) * 260, vy:Math.sin(a) * 260, r:10, dmg:18, life:3.5, col:'#ff7a2a'}); } e.stT = 1.8; } }
  else if (k === 'devorador'){ const opt = Math.floor(Math.random() * 4);
    if (opt === 0){ e.spiral = 2.4; e.stT = 3.2; } else if (opt === 1){ for (let i = 0; i < 7; i++){ const x = P.x + (Math.random() - .5) * 320, y = P.y + (Math.random() - .5) * 320; tele({k:'circ', x, y, r:64, t:1.1, dmg:26}); } e.stT = 2.6; }
    else if (opt === 2){ tele({k:'ring', x:e.x, y:e.y, r:240, t:1.2, dmg:30}); e.stT = 2.6; } else { for (let i = 0; i < 6; i++) spawn('espirito', e.x + Math.cos(i) * 80, e.y + Math.sin(i) * 80); e.stT = 2.5; } }
  return false;
}
function tele(o){ o.T = o.t; R.tele.push(o); }
function teleHit(o){
  const px = R.x, py = R.y; let hit = false;
  if (o.k === 'circ') hit = Math.hypot(px - o.x, py - o.y) < o.r + 10;
  else if (o.k === 'ring') hit = Math.hypot(px - o.x, py - o.y) < o.r;
  else if (o.k === 'cone'){ const dx = px - o.x, dy = py - o.y, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx); let da = Math.abs(((a - o.a) % TAU + TAU + Math.PI) % TAU - Math.PI); hit = d < o.len && da < o.sp; }
  if (hit) hurt(o.dmg);
  if (o.k === 'circ' || o.k === 'ring'){ parts(o.x, o.y, o.k === 'ring' ? '#7fe0ff' : '#c070ff', o.k === 'ring' ? 30 : 14, 220, .5, 3); R.cam.sh = Math.max(R.cam.sh, 6); sfx('boom'); }
  if (o.k === 'cone'){ for (let i = 0; i < 26; i++){ const a = o.a + (Math.random() - .5) * o.sp * 2, d = Math.random() * o.len; R.parts.push({x:o.x + Math.cos(a) * d, y:o.y + Math.sin(a) * d, vx:Math.cos(a) * 60, vy:Math.sin(a) * 60, life:.5, L:.5, col:Math.random() < .5 ? '#ffd04a' : '#ff5a2a', s:5}); } sfx('boom'); }
}
/* ---------- dano ---------- */
function hit(e, dmg, kx, ky, col){
  if (e.dead) return; const crit = Math.random() < .08 * R.st.luck; if (crit) dmg *= 2;
  e.hp -= dmg; e.flash = .1; if (!e.boss){ e.kx += (kx || 0) * 1; e.ky += (ky || 0) * 1; }
  if (R.nums.length < (R.q ? 70 : 35)) R.nums.push({x:e.x + (Math.random() - .5) * 10, y:e.y - e.r, v:Math.round(dmg), t:.6, crit});
  if (R.st.steal && R.hp < R.maxhp) R.hp = Math.min(R.maxhp, R.hp + dmg * R.st.steal * .2);
  sfx('hit'); if (e.hp <= 0) kill(e);
}
function kill(e){
  if (e.dead) return; e.dead = true; R.kills++; R.ult = Math.min(R.ultMax, R.ult + (e.boss ? 40 : e.elite ? 10 : .9)); sfx('kill');
  parts(e.x, e.y, e.boss ? '#f6c945' : COLHEX[['R', 'G', 'B', 'U', 'W'][R.biome]] || '#fff', e.boss ? 60 : e.elite ? 24 : 7, e.boss ? 320 : 150, .5, e.boss ? 5 : 3);
  const v = e.xp; R.gems.push({x:e.x, y:e.y, v, mag:false});
  if (EN[e.k].split && !e.small){ for (let i = 0; i < 2; i++) spawn('slime', e.x + (i ? 10 : -10), e.y, {small:1}); }
  if (Math.random() < .006 * R.st.luck) R.items.push({k:Math.random() < .6 ? 'pocao' : Math.random() < .5 ? 'ima' : 'bomba', x:e.x, y:e.y});
  if (Math.random() < .015 * R.st.luck) R.items.push({k:'cen', x:e.x + 6, y:e.y, v:1});
  if (e.elite) R.items.push({k:'bau', x:e.x, y:e.y});
  if (e.boss){ R.items.push({k:'bau', x:e.x, y:e.y}); R.items.push({k:'cen', x:e.x - 20, y:e.y, v:15}); R.bossKills++; R.cam.sh = 14; sfx('boom');
    if (R.boss === e){ R.boss = null;
      if (!R.endless){ R.bossIdx++; if (R.bossIdx >= 5){ setTimeout(() => victory(), 900); } else { R.biome = R.bossIdx; R.bossDue = R.t + 150; R.props = {}; banner('Planinauta! Novo plano: ' + BIOMES[R.biome].n, 3); musStart(); } } } }
}
function hurt(d){
  if (R.inv > 0 || R.dashT > 0 || R.over) return; d = Math.max(1, d - R.st.armor); R.hp -= d; R.inv = .55; R.hurtF = .25; R.cam.sh = Math.max(R.cam.sh, 5); sfx('hurt');
  try { if (navigator.vibrate && S.svVib !== false) navigator.vibrate(30); } catch(e){}
  if (R.hp <= 0){ if (R.revive > 0){ R.revive--; R.hp = R.maxhp / 2; R.inv = 2.5; banner('Segunda chance!', 2); nuke(9999, true); } else end(false); }
}
function parts(x, y, col, n, sp, life, s){ const max = R.q ? 520 : 180; for (let i = 0; i < n && R.parts.length < max; i++){ const a = Math.random() * TAU, v = sp * (.3 + Math.random() * .7); R.parts.push({x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, life, L:life, col, s:s * (.6 + Math.random() * .6)}); } }
function nearest(x, y, maxD, skip){ let best = null, bd = maxD * maxD; for (const e of R.en){ if (e.dead || (skip && skip.has(e))) continue; const d = (e.x - x) ** 2 + (e.y - y) ** 2; if (d < bd){ bd = d; best = e; } } return best; }
function strongest(){ let b = null; for (const e of R.en) if (!e.dead && (!b || e.hp > b.hp)) b = e; return b; }
function nuke(dmg, all){ for (const e of R.en){ if (e.dead) continue; if (all || (Math.abs(e.x - R.x) < VW / 2 + 40 && Math.abs(e.y - R.y) < VH / 2 + 40)) hit(e, e.boss ? dmg * .15 : dmg, 0, 0); } }
function banner(m, t){ R.banner = {m, t:t || 2, T:t || 2}; }

/* ---------- mágicas ---------- */
function W(k){ return R.w[k]; }
function fireWeapons(dt){
  const st = R.st, D = st.dmg, A = st.area;
  for (const k in R.w){
    const w = R.w[k], l = w.l, ev = !!R.evo[k]; w.t -= dt;
    if (k === 'orb'){ const n = (ev ? 6 : 1 + l) + st.proj, rad = (ev ? 110 : 62 + l * 7) * A, rot = (ev ? 3.2 : 2.4 + l * .2); w.a = (w.a || 0) + rot * dt; w.pos = [];
      for (let i = 0; i < n; i++){ const a = w.a + i / n * TAU, x = R.x + Math.cos(a) * rad, y = R.y + Math.sin(a) * rad; w.pos.push([x, y]); gridNear(x, y, 18 * A + 14, e => { if (Math.hypot(e.x - x, e.y - y) < e.r + 12 * A * (ev ? 1.5 : 1) && (e.oh || 0) <= R.t){ e.oh = R.t + .35; hit(e, (9 + l * 3) * D * (ev ? 1.6 : 1), Math.cos(a) * 6, Math.sin(a) * 6); } }); }
      if (ev) gridNear(R.x, R.y, 260, e => { if (!e.boss){ const dx = R.x - e.x, dy = R.y - e.y, d = Math.hypot(dx, dy) || 1; if (d > rad){ e.x += dx / d * 40 * dt; e.y += dy / d * 40 * dt; } } });
      continue; }
    if (k === 'aura'){ const rad = (ev ? 150 : 56 + l * 10) * A; w.rad = rad; if (w.t <= 0){ w.t = .45; gridNear(R.x, R.y, rad + 20, e => { if (Math.hypot(e.x - R.x, e.y - R.y) < rad + e.r) hit(e, (5 + l * 2) * D * (ev ? 1.5 : 1), (e.x - R.x) * .02, (e.y - R.y) * .02); }); }
      if (ev){ w.pt = (w.pt || 3) - dt; if (w.pt <= 0){ w.pt = 3; R.fx.push({k:'pulse', x:R.x, y:R.y, r:rad * 1.6, t:.5, T:.5}); gridNear(R.x, R.y, rad * 1.6, e => hit(e, 45 * D, 0, 0)); sfx('boom'); } }
      continue; }
    if (k === 'blades' && ev){ w.a = (w.a || 0) + 5 * dt; w.pos = []; const n = 3 + st.proj, rad = 90 * A; for (let i = 0; i < n; i++){ const a = w.a + i / n * TAU, x = R.x + Math.cos(a) * rad * (1 + .25 * Math.sin(R.t * 2 + i)), y = R.y + Math.sin(a) * rad * (1 + .25 * Math.sin(R.t * 2 + i)); w.pos.push([x, y, a]); gridNear(x, y, 30, e => { if (Math.hypot(e.x - x, e.y - y) < e.r + 16 && (e.bh || 0) <= R.t){ e.bh = R.t + .25; hit(e, 22 * D, Math.cos(a) * 5, Math.sin(a) * 5); } }); } continue; }
    if (w.t > 0) continue;
    const cdm = st.cd;
    if (k === 'bolt'){ w.t = (ev ? .45 : .95 - l * .07) * cdm; const n = (ev ? 1 : 1 + Math.floor(l / 2)) + st.proj;
      if (ev){ for (let j = 0; j < n; j++){ let src = {x:R.x, y:R.y}, used = new Set(), pts = [[R.x, R.y]]; for (let c = 0; c < 5; c++){ const e = nearest(src.x, src.y, c ? 180 : 420, used); if (!e) break; used.add(e); pts.push([e.x, e.y]); hit(e, 30 * D, 0, 0); src = e; } if (pts.length > 1){ R.fx.push({k:'chain', pts, t:.18, T:.18}); sfx('shoot'); } } }
      else { for (let j = 0; j < n; j++){ const e = nearest(R.x, R.y, 520); if (!e) break; const a = Math.atan2(e.y - R.y, e.x - R.x) + (j - (n - 1) / 2) * .12, v = 560 * st.pspd; R.pr.push({k, x:R.x, y:R.y - 10, vx:Math.cos(a) * v, vy:Math.sin(a) * v, r:7 * A, dmg:(13 + l * 4) * D, pierce:1 + Math.floor(l / 2), life:1.1, col:'#ffd04a', hits:new Set()}); } sfx('shoot'); } }
    else if (k === 'drain'){ w.t = (ev ? .5 : .85 - l * .05) * cdm; const n = ev ? 4 : 1, used = new Set(); for (let j = 0; j < n; j++){ const e = nearest(R.x, R.y, 300 * A, used); if (!e) break; used.add(e); hit(e, (16 + l * 5) * D * (ev ? 1.3 : 1), 0, 0); R.hp = Math.min(R.maxhp, R.hp + (ev ? 1.6 : .6 + l * .15)); R.fx.push({k:'beam', x:R.x, y:R.y - 12, tx:e.x, ty:e.y, t:.22, T:.22, col:'#c070ff'}); } }
    else if (k === 'vines'){ w.t = (ev ? 1.1 : 1.5 - l * .1) * cdm; const n = (ev ? 0 : l) + st.proj;
      if (ev){ for (let ring = 1; ring <= 2; ring++){ const m = 8 * ring; for (let i = 0; i < m; i++){ const a = i / m * TAU + R.t, x = R.x + Math.cos(a) * 70 * ring * A, y = R.y + Math.sin(a) * 70 * ring * A; R.fx.push({k:'spike', x, y, r:34 * A, t:.55, T:.55, d:ring * .08}); gridNear(x, y, 40 * A, e => { if (Math.hypot(e.x - x, e.y - y) < 34 * A + e.r) hit(e, 26 * D, 0, 0); }); } } }
      for (let j = 0; j < n; j++){ const near = R.en.filter(e => !e.dead && Math.abs(e.x - R.x) < VW / 2 && Math.abs(e.y - R.y) < VH / 2); const e = near.length ? near[Math.floor(Math.random() * near.length)] : null; const x = e ? e.x : R.x + (Math.random() - .5) * 300, y = e ? e.y : R.y + (Math.random() - .5) * 300, rr = (34 + l * 4) * A;
        R.fx.push({k:'spike', x, y, r:rr, t:.55, T:.55, d:0}); gridNear(x, y, rr + 20, e2 => { if (Math.hypot(e2.x - x, e2.y - y) < rr + e2.r){ hit(e2, (16 + l * 5) * D, 0, 0); e2.slow = .8; } }); } }
    else if (k === 'fire'){ w.t = (ev ? .35 : 1.6 - l * .12) * cdm;
      if (ev){ const x = R.x + (Math.random() - .5) * VW * .9, y = R.y + (Math.random() - .5) * VH * .9; R.pr.push({k:'meteor', x:x - 120, y:y - 320, tx:x, ty:y, vx:120 / .55, vy:320 / .55, life:.55, r:70 * A, dmg:48 * D, col:'#ff7a2a', hits:new Set()}); R.fx.push({k:'mark', x, y, r:70 * A, t:.55, T:.55}); }
      else { const n = 1 + Math.floor(l / 3) + st.proj; for (let j = 0; j < n; j++){ const e = nearest(R.x, R.y, 480) || {x:R.x + R.face * 100, y:R.y}; const a = Math.atan2(e.y - R.y, e.x - R.x) + (j - (n - 1) / 2) * .25, v = 330 * st.pspd; R.pr.push({k, x:R.x, y:R.y - 8, vx:Math.cos(a) * v, vy:Math.sin(a) * v, r:10, dmg:(20 + l * 7) * D, boom:(48 + l * 6) * A, life:1.6, col:'#ff7a2a', hits:new Set()}); } sfx('shoot'); } }
    else if (k === 'blades'){ w.t = (1.25 - l * .08) * cdm; const n = 1 + Math.floor((l - 1) / 2) + st.proj; for (let j = 0; j < n; j++){ const e = nearest(R.x, R.y, 420); const a = (e ? Math.atan2(e.y - R.y, e.x - R.x) : (R.face > 0 ? 0 : Math.PI)) + (j - (n - 1) / 2) * .5, v = 460 * st.pspd; R.pr.push({k, x:R.x, y:R.y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, r:12 * A, dmg:(14 + l * 5) * D, life:1.6, back:.65, pierce:99, col:'#cfd6e0', rot:0, hits:new Set(), hr:.3}); } sfx('shoot'); }
    else if (k === 'wisps'){ w.t = (ev ? .7 : 1.05 - l * .06) * cdm; const n = (ev ? 4 : 1 + Math.floor(l / 2)) + st.proj; for (let j = 0; j < n; j++){ const a = Math.random() * TAU; R.pr.push({k:ev ? 'angel' : 'wisp', x:R.x, y:R.y - 10, vx:Math.cos(a) * 160, vy:Math.sin(a) * 160, r:(ev ? 11 : 7) * A, dmg:(11 + l * 4) * D * (ev ? 2 : 1), life:3, home:1, col:'#fff2a8', hits:new Set(), pierce:ev ? 3 : 1}); } }
  }
}
function moveProj(dt){
  const P = R.pr;
  for (let i = P.length - 1; i >= 0; i--){
    const p = P[i]; p.life -= dt; let dead = p.life <= 0;
    if (p.k === 'meteor'){ p.x += p.vx * dt; p.y += p.vy * dt; if (dead){ R.fx.push({k:'boom', x:p.tx, y:p.ty, r:p.r, t:.4, T:.4}); gridNear(p.tx, p.ty, p.r + 30, e => { if (Math.hypot(e.x - p.tx, e.y - p.ty) < p.r + e.r) hit(e, p.dmg, (e.x - p.tx) * .1, (e.y - p.ty) * .1); }); parts(p.tx, p.ty, '#ff9a3a', 16, 220, .45, 4); R.cam.sh = Math.max(R.cam.sh, 3); sfx('boom'); P[i] = P[P.length - 1]; P.pop(); } continue; }
    if (p.home){ const t = p.k === 'angel' ? strongest() : nearest(p.x, p.y, 400); if (t){ const a = Math.atan2(t.y - p.y, t.x - p.x), sp = p.k === 'angel' ? 360 : 300; p.vx = lerp(p.vx, Math.cos(a) * sp, Math.min(1, dt * 5)); p.vy = lerp(p.vy, Math.sin(a) * sp, Math.min(1, dt * 5)); } }
    if (p.back != null){ p.back -= dt; if (p.back <= 0){ const a = Math.atan2(R.y - p.y, R.x - p.x); p.vx = lerp(p.vx, Math.cos(a) * 520, Math.min(1, dt * 6)); p.vy = lerp(p.vy, Math.sin(a) * 520, Math.min(1, dt * 6)); if (Math.hypot(R.x - p.x, R.y - p.y) < 20) dead = true; } p.rot += dt * 18; if (p.hr != null){ p.hr -= dt; if (p.hr <= 0){ p.hr = .3; p.hits.clear(); } } }
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (!dead) gridNear(p.x, p.y, p.r + 30, e => { if (dead || p.hits.has(e)) return; if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r){ p.hits.add(e); const n = Math.hypot(p.vx, p.vy) || 1;
      if (p.boom){ R.fx.push({k:'boom', x:p.x, y:p.y, r:p.boom, t:.35, T:.35}); gridNear(p.x, p.y, p.boom + 30, e2 => { if (Math.hypot(e2.x - p.x, e2.y - p.y) < p.boom + e2.r) hit(e2, p.dmg, (e2.x - p.x) * .08, (e2.y - p.y) * .08); }); parts(p.x, p.y, '#ff9a3a', 10, 180, .4, 3); sfx('boom'); dead = true; return; }
      hit(e, p.dmg, p.vx / n * 8, p.vy / n * 8); p.pierce = (p.pierce || 1) - 1; if (p.pierce <= 0) dead = true; } });
    if (dead){ P[i] = P[P.length - 1]; P.pop(); }
  }
}

/* ---------- atualização ---------- */
function update(dt){
  if (!R || R.paused || R.modal || R.over) return;
  R.t += dt; const st = R.st;
  /* jogador */
  let mx = 0, my = 0; const K = R.keys || {};
  if (K.l) mx -= 1; if (K.r) mx += 1; if (K.u) my -= 1; if (K.d) my += 1;
  if (R.joy && R.joy.on){ const dx = R.joy.x - R.joy.x0, dy = R.joy.y - R.joy.y0, l = Math.hypot(dx, dy); if (l > 6){ mx = dx / 55; my = dy / 55; const m = Math.hypot(mx, my); if (m > 1){ mx /= m; my /= m; } } }
  else { const m = Math.hypot(mx, my); if (m > 0){ mx /= m; my /= m; } }
  R.dashCd -= dt; R.inv -= dt; R.hurtF = Math.max(0, (R.hurtF || 0) - dt);
  if (R.dashT > 0){ R.dashT -= dt; R.x += R.dx * 620 * dt; R.y += R.dy * 620 * dt; if (Math.random() < .7) R.parts.push({x:R.x, y:R.y - 20, vx:0, vy:0, life:.25, L:.25, col:MAGES[R.mage].gem, s:6}); }
  else { R.x += mx * st.spd * dt; R.y += my * st.spd * dt; }
  const moving = Math.hypot(mx, my) > .1; if (moving){ R.anim += dt * 9; if (Math.abs(mx) > .15) R.face = mx > 0 ? 1 : -1; R.lmx = mx; R.lmy = my; } else R.anim = 0;
  if (st.regen) R.hp = Math.min(R.maxhp, R.hp + st.regen * dt);
  /* inimigos */
  gridBuild(); director(dt);
  for (const e of R.en){
    if (e.dead) continue; e.flash -= dt; e.an += dt * (e.boss ? 3 : 5);
    if (e.boss && bossAI(e, dt)) { contact(e); continue; }
    if (e.boss && e.spiral > 0){ e.spiral -= dt; e.spA = (e.spA || 0) + dt * 5; if (Math.floor(e.spiral * 12) !== Math.floor((e.spiral + dt) * 12)) for (let i = 0; i < 3; i++){ const a = e.spA + i / 3 * TAU; R.ep.push({x:e.x, y:e.y, vx:Math.cos(a) * 170, vy:Math.sin(a) * 170, r:8, dmg:14, life:4, col:'#c070ff'}); } }
    const dx = R.x - e.x, dy = R.y - e.y, d = Math.hypot(dx, dy) || 1; let sp = e.sp * (e.slow > 0 ? .5 : 1) * (e.frz > 0 ? 0 : 1); e.slow -= dt; e.frz = (e.frz || 0) - dt;
    if (e.boss && e.st === 'wind') sp = 0;
    if (EN[e.k].shoot && d < 340){ sp *= .25; e.cd -= dt; if (e.cd <= 0){ e.cd = 2.6; R.ep.push({x:e.x, y:e.y, vx:dx / d * 170, vy:dy / d * 170, r:6, dmg:e.dmg * .8, life:3, col:'#ffb04a'}); } }
    let vx = dx / d * sp, vy = dy / d * sp;
    if (EN[e.k].fly){ vx += Math.cos(e.ph + R.t * 3) * 40; vy += Math.sin(e.ph + R.t * 3) * 40; }
    /* separação leve */
    if (!e.boss){ let sx = 0, sy = 0, n = 0; gridNear(e.x, e.y, e.r * 2, o => { if (o === e) return; const ox = e.x - o.x, oy = e.y - o.y, od = ox * ox + oy * oy, rr2 = (e.r + o.r) * .8; if (od < rr2 * rr2 && od > .01){ const q = Math.sqrt(od); sx += ox / q; sy += oy / q; n++; } }); if (n){ vx += sx * 60; vy += sy * 60; } }
    e.x += (vx + e.kx * 20) * dt; e.y += (vy + e.ky * 20) * dt; e.kx *= .82; e.ky *= .82;
    if (d > Math.hypot(VW, VH) * .9 && !e.boss){ const a = Math.random() * TAU, r = Math.hypot(VW, VH) / 2 + 40; e.x = R.x + Math.cos(a) * r; e.y = R.y + Math.sin(a) * r; }
    contact(e);
  }
  if (R.en.length > 40 || R.t % 1 < dt) R.en = R.en.filter(e => !e.dead);
  fireWeapons(dt); moveProj(dt);
  /* projéteis inimigos */
  for (let i = R.ep.length - 1; i >= 0; i--){ const p = R.ep[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; if (Math.hypot(p.x - R.x, p.y - R.y) < p.r + 10){ hurt(p.dmg); p.life = 0; } if (p.life <= 0){ R.ep[i] = R.ep[R.ep.length - 1]; R.ep.pop(); } }
  /* avisos */
  for (let i = R.tele.length - 1; i >= 0; i--){ const o = R.tele[i]; o.t -= dt; if (o.t <= 0){ if (o.then) o.then(); else teleHit(o); R.tele.splice(i, 1); } }
  /* gemas e itens */
  const mag = st.mag;
  if (R.gems.length > 320){ let sum = 0; R.gems.slice(0, 150).forEach(g => sum += g.v); R.gems.splice(0, 150); R.gems.push({x:R.x + 200, y:R.y, v:sum, mag:false}); }
  for (let i = R.gems.length - 1; i >= 0; i--){ const g = R.gems[i], dx = R.x - g.x, dy = R.y - g.y, d = Math.hypot(dx, dy);
    if (g.mag || d < mag){ g.mag = true; const sp = 420 + (g.sp = (g.sp || 0) + dt * 600); g.x += dx / (d || 1) * sp * dt; g.y += dy / (d || 1) * sp * dt; }
    if (d < 18){ gain(g.v); R.gems[i] = R.gems[R.gems.length - 1]; R.gems.pop(); sfx('gem'); } }
  for (let i = R.items.length - 1; i >= 0; i--){ if (R.modal) break; const it = R.items[i], d = Math.hypot(R.x - it.x, R.y - it.y);
    if (it.k === 'cen' && d < mag){ it.x += (R.x - it.x) * dt * 6; it.y += (R.y - it.y) * dt * 6; }
    if (d < 24){ R.items.splice(i, 1); item(it); } }
  /* efeitos */
  for (let i = R.parts.length - 1; i >= 0; i--){ const p = R.parts[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .92; p.vy *= .92; if (p.life <= 0){ R.parts[i] = R.parts[R.parts.length - 1]; R.parts.pop(); } }
  for (let i = R.nums.length - 1; i >= 0; i--){ const n = R.nums[i]; n.t -= dt; n.y -= 40 * dt; if (n.t <= 0){ R.nums[i] = R.nums[R.nums.length - 1]; R.nums.pop(); } }
  for (let i = R.fx.length - 1; i >= 0; i--){ const f = R.fx[i]; if (f.d > 0){ f.d -= dt; continue; } f.t -= dt; if (f.t <= 0){ R.fx[i] = R.fx[R.fx.length - 1]; R.fx.pop(); } }
  if (R.banner){ R.banner.t -= dt; if (R.banner.t <= 0) R.banner = null; }
  R.cam.sh = Math.max(0, R.cam.sh - dt * 30); R.cam.x = lerp(R.cam.x, R.x, Math.min(1, dt * 10)); R.cam.y = lerp(R.cam.y, R.y, Math.min(1, dt * 10));
}
function contact(e){ const d = Math.hypot(R.x - e.x, R.y - e.y); if (d < e.r + 12) hurt(e.dmg); }
function gain(v){ v *= R.st.xp; R.xp += v; R.gemTotal += v;
  while (R.xp >= R.need){ R.xp -= R.need; R.lvl++; R.need = Math.round(8 + R.lvl * 8 + Math.pow(R.lvl, 1.75)); R.pendLv = (R.pendLv || 0) + 1;
    const nt = tierOf(R.lvl); if (nt > R.tier){ R.tier = nt; stats(); R.hp = R.maxhp; R.pendTier = nt; } }
  if (R.pendLv && !R.modal) levelUp(); }
function item(it){
  if (it.k === 'pocao'){ R.hp = Math.min(R.maxhp, R.hp + 35); parts(R.x, R.y, '#ff6a8a', 12, 120, .5, 4); }
  else if (it.k === 'ima'){ R.gems.forEach(g => g.mag = true); banner('Ímã! Toda a mana vem até você.', 1.4); }
  else if (it.k === 'bomba'){ R.fx.push({k:'pulse', x:R.x, y:R.y, r:Math.max(VW, VH), t:.6, T:.6}); nuke(160); R.cam.sh = 12; sfx('boom'); }
  else if (it.k === 'cen'){ R.cenRun += it.v || 1; sfx('gem'); }
  else if (it.k === 'bau'){ R.chests++; chest(); }
}
function useUlt(){
  if (!R || R.ult < R.ultMax || R.modal || R.paused || R.over) return; R.ult = 0; const c = R.mage, D = R.st.dmg;
  R.cam.sh = 16; sfx('boom'); R.fx.push({k:'ult', c, x:R.x, y:R.y, t:1.1, T:1.1});
  if (c === 'R'){ nuke(220 * D); for (let i = 0; i < 40; i++) parts(R.x + (Math.random() - .5) * VW, R.y + (Math.random() - .5) * VH, Math.random() < .5 ? '#ffd04a' : '#ff5a2a', 2, 160, .7, 5); }
  else if (c === 'U'){ R.en.forEach(e => { if (e.dead) return; const dx = e.x - R.x, dy = e.y - R.y, d = Math.hypot(dx, dy) || 1; if (!e.boss){ e.kx += dx / d * 30; e.ky += dy / d * 30; } e.frz = 3; hit(e, 70 * D, 0, 0); }); }
  else if (c === 'B'){ nuke(300 * D); R.hp = Math.min(R.maxhp, R.hp + 20); }
  else if (c === 'G'){ for (let i = 0; i < 9; i++){ const y = R.y - VH / 2 + (i + .5) * VH / 9; R.pr.push({k:'beast', x:R.x - VW / 2 - 60 - Math.random() * 80, y, vx:720, vy:0, r:26, dmg:120 * D, life:2.2, pierce:999, col:'#5fd17e', hits:new Set()}); } }
  else { nuke(180 * D); R.hp = Math.min(R.maxhp, R.hp + R.maxhp * .4); }
}
function dash(){ if (!R || R.dashCd > 0 || R.modal || R.paused || R.over) return; let dx = R.lmx || R.face, dy = R.lmy || 0; const l = Math.hypot(dx, dy) || 1; R.dx = dx / l; R.dy = dy / l; R.dashT = .16; R.dashCd = 1.6; R.inv = .3; sfx('dash'); }

/* ---------- subir de nível / baú ---------- */
function options(n){
  const out = [], ws = Object.keys(R.w), ps = Object.keys(R.pas);
  for (const k of ws) if (R.w[k].l < 5) out.push({t:'w', k, up:1});
  for (const k of ps) if (R.pas[k] < 5) out.push({t:'p', k, up:1});
  if (ws.length < 6) for (const k in WPN) if (!R.w[k]) out.push({t:'w', k});
  if (ps.length < 6) for (const k in PAS) if (!R.pas[k]) out.push({t:'p', k});
  for (let i = out.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  /* favorece upgrades e mágicas que levam a evolução */
  out.sort((a, b) => (b.up ? 1 : 0) - (a.up ? 1 : 0) + (Math.random() - .5) * 1.2);
  const r = out.slice(0, n); if (!r.length) r.push({t:'gold'}, {t:'heal'}); return r;
}
function cardHTML(o, i){
  if (o.t === 'gold') return `<button class="g3-card" data-g3o="${i}" style="--cc:#f6c945"><span class="g3-ct">Tesouro</span><b>Centelhas</b><span class="g3-art">✦</span><small>+10 centelhas para a loja.</small></button>`;
  if (o.t === 'heal') return `<button class="g3-card" data-g3o="${i}" style="--cc:#ff6a8a"><span class="g3-ct">Poção</span><b>Cura</b><span class="g3-art">♥</span><small>Recupera 40% da vida.</small></button>`;
  if (o.t === 'w'){ const W0 = WPN[o.k], l = R.w[o.k] ? R.w[o.k].l : 0, P0 = PAS[W0.p];
    return `<button class="g3-card" data-g3o="${i}" style="--cc:${COLHEX[W0.c]}"><span class="g3-ct">Mágica · ${l ? 'Nível ' + (l + 1) : 'Nova'}</span><b>${W0.n}</b><span class="g3-art">${wIcon(o.k)}</span><small>${l ? lvlTxt(o.k, l + 1) : W0.d}</small><span class="g3-pips">${[1,2,3,4,5].map(x => `<i class="${x <= l ? 'on' : x === l + 1 ? 'nx' : ''}"></i>`).join('')}</span><small class="g3-evo">Evolui com ${P0.ic} ${P0.n}</small></button>`; }
  const P0 = PAS[o.k], l = R.pas[o.k] || 0, wk = Object.keys(WPN).find(x => WPN[x].p === o.k);
  return `<button class="g3-card g3-art-card" data-g3o="${i}" style="--cc:#cfd6e0"><span class="g3-ct">Relíquia · ${l ? 'Nível ' + (l + 1) : 'Nova'}</span><b>${P0.n}</b><span class="g3-art">${P0.ic}</span><small>${P0.d}</small><span class="g3-pips">${[1,2,3,4,5].map(x => `<i class="${x <= l ? 'on' : x === l + 1 ? 'nx' : ''}"></i>`).join('')}</span><small class="g3-evo">Evolui ${WPN[wk].n}</small></button>`;
}
const lvlTxt = (k, l) => ({bolt:'Mais dano; +1 raio nos níveis 2 e 4.', orb:'+1 orbe e mais alcance.', aura:'Aura maior e mais forte.', drain:'Mais dano e cura, recarga menor.', vines:'+1 espinho e área maior.', fire:'Explosão maior; +1 bola no nível 3.', blades:'Mais dano; +1 lâmina nos níveis 3 e 5.', wisps:'+1 espírito nos níveis 2 e 4.'})[k];
const wIcon = k => ({bolt:'ϟ', orb:'◎', aura:'✺', drain:'☽', vines:'❦', fire:'✹', blades:'✦', wisps:'❉'})[k];
function levelUp(){
  if (!R.pendLv) return; R.pendLv--; sfx('lvl');
  if (R.pendTier != null){ const t = R.pendTier; R.pendTier = null; R.fx.push({k:'evoP', x:R.x, y:R.y, t:1.4, T:1.4}); sfx('evo'); banner(`${MAGES[R.mage].n} evoluiu: ${TIERS[t][1]}!`, 3); }
  const opts = options(Object.keys(R.w).length + Object.keys(R.pas).length >= 10 ? 3 : (meta().v3.up.sorte ? 4 : 3));
  R.modal = 'lvl'; R.opts = opts;
  showModal(`<div class="g3-mh"><b>Nível ${R.lvl}</b><small>Escolha uma carta${R.rer ? ` · <button class="g3-rer" id="g3Rer">Trocar (${R.rer})</button>` : ''}</small></div><div class="g3-cards">${opts.map(cardHTML).join('')}</div><small class="g3-kb">No PC: teclas 1 a ${opts.length}</small>`);
  $$('[data-g3o]').forEach(b => b.onclick = () => choose(+b.dataset.g3o));
  const rr2 = $('#g3Rer'); if (rr2) rr2.onclick = () => { R.rer--; R.pendLv++; R.modal = null; levelUp(); };
}
function choose(i){
  const o = R.opts[i]; if (!o) return;
  if (o.t === 'w'){ if (R.w[o.k]) R.w[o.k].l++; else R.w[o.k] = {l:1, t:0}; }
  else if (o.t === 'p'){ R.pas[o.k] = (R.pas[o.k] || 0) + 1; }
  else if (o.t === 'gold') R.cenRun += 10; else if (o.t === 'heal') R.hp = Math.min(R.maxhp, R.hp + R.maxhp * .4);
  stats(); hideModal(); R.modal = null; hudIcons();
  if (R.pendLv) setTimeout(levelUp, 120);
}
function evoReady(){ return Object.keys(R.w).filter(k => R.w[k].l >= 5 && !R.evo[k] && R.pas[WPN[k].p]); }
function chest(){
  sfx('chest'); const ev = evoReady(); let html;
  if (ev.length){ const k = ev[0]; R.evo[k] = 1; const W0 = WPN[k]; R.fx.push({k:'evoP', x:R.x, y:R.y, t:1.4, T:1.4}); sfx('evo'); const M = meta(); M.v3.evo = M.v3.evo || {}; M.v3.evo[k] = 1;
    html = `<div class="g3-mh"><b>Evolução!</b><small>${W0.n} + ${PAS[W0.p].n}</small></div><div class="g3-cards"><div class="g3-card g3-gold" style="--cc:#f6c945"><span class="g3-ct">Mágica lendária</span><b>${W0.e}</b><span class="g3-art">${wIcon(k)}</span><small>${W0.ed}</small></div></div>`; }
  else { const up = Object.keys(R.w).filter(k => R.w[k].l < 5), gold = !up.length; let txt;
    if (!gold){ const k = up[Math.floor(Math.random() * up.length)]; R.w[k].l++; txt = `<b>${WPN[k].n}</b><span class="g3-art">${wIcon(k)}</span><small>Subiu para o nível ${R.w[k].l}.</small>`; } else { R.cenRun += 20; txt = `<b>Tesouro</b><span class="g3-art">✦</span><small>+20 centelhas.</small>`; }
    const hint = Object.keys(R.w).filter(k => R.w[k].l >= 5 && !R.evo[k]).map(k => `${WPN[k].n} evolui com ${PAS[WPN[k].p].n}`)[0];
    html = `<div class="g3-mh"><b>Baú aberto</b><small>${hint ? 'Dica: ' + hint : 'Leve uma mágica ao nível 5 e pegue a relíquia certa para evoluir.'}</small></div><div class="g3-cards"><div class="g3-card" style="--cc:#d9ac4e"><span class="g3-ct">Prêmio</span>${txt}</div></div>`; }
  R.modal = 'chest'; stats(); showModal(html + `<button class="btn primary" id="g3Ok">Continuar</button>`); $('#g3Ok').onclick = () => { hideModal(); R.modal = null; hudIcons(); if (R.pendLv) levelUp(); };
}

/* ---------- desenho ---------- */
function render(){
  if (!R || !ctx) return; const g = ctx, q = R.q, sx = (Math.random() - .5) * R.cam.sh, sy = (Math.random() - .5) * R.cam.sh;
  const cx = R.cam.x - VW / 2 + sx, cy = R.cam.y - VH / 2 + sy;
  g.setTransform(DPR * Z, 0, 0, DPR * Z, 0, 0);
  /* chão */
  const T = groundTile(R.biome), ox = ((-cx % 256) + 256) % 256, oy = ((-cy % 256) + 256) % 256;
  for (let x = ox - 256; x < VW; x += 256) for (let y = oy - 256; y < VH; y += 256) g.drawImage(T, x, y);
  /* cenário por blocos (determinístico) */
  const B = BIOMES[R.biome], C = 220, bx0 = Math.floor(cx / C) - 1, by0 = Math.floor(cy / C) - 1, bx1 = Math.floor((cx + VW) / C) + 1, by1 = Math.floor((cy + VH) / C) + 1, back = [], front = [];
  for (let i = bx0; i <= bx1; i++) for (let j = by0; j <= by1; j++){ const h = hash(i + R.biome * 999, j); if (h > .55){ const p = B.props[Math.floor(hash(j, i) * B.props.length)], x = i * C + hash(i * 7, j) * C, y = j * C + hash(i, j * 7) * C; (y < R.y ? back : front).push([p, x, y]); } }
  const drawProp = ([p, x, y]) => { const s = propSpr(p); g.drawImage(s, x - cx - 40, y - cy - 90); };
  back.sort((a, b) => a[2] - b[2]).forEach(drawProp);
  /* avisos dos chefes */
  for (const o of R.tele){ const k = 1 - o.t / o.T; g.save(); g.translate(o.x - cx, o.y - cy);
    if (o.k === 'circ'){ g.fillStyle = `rgba(255,40,40,${.12 + k * .25})`; circ(g, 0, 0, o.r); g.fill(); g.strokeStyle = 'rgba(255,80,80,.9)'; g.lineWidth = 3; g.stroke(); g.fillStyle = 'rgba(255,60,60,.35)'; circ(g, 0, 0, o.r * k); g.fill(); }
    else if (o.k === 'ring'){ g.strokeStyle = `rgba(127,224,255,${.4 + k * .5})`; g.lineWidth = 6; circ(g, 0, 0, o.r); g.stroke(); g.fillStyle = `rgba(127,224,255,${.08 + k * .15})`; g.fill(); }
    else if (o.k === 'line'){ g.rotate(o.a); g.fillStyle = `rgba(255,60,60,${.15 + k * .3})`; g.fillRect(0, -o.w / 2, o.len, o.w); g.strokeStyle = 'rgba(255,80,80,.9)'; g.lineWidth = 2; g.strokeRect(0, -o.w / 2, o.len, o.w); }
    else if (o.k === 'cone'){ g.fillStyle = `rgba(255,120,40,${.15 + k * .3})`; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, o.len, o.a - o.sp, o.a + o.sp); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,140,60,.9)'; g.lineWidth = 2; g.stroke(); }
    g.restore(); }
  /* efeitos de chão */
  for (const f of R.fx){ if (f.d > 0) continue; const k = 1 - f.t / f.T, x = (f.x || 0) - cx, y = (f.y || 0) - cy;
    if (f.k === 'spike'){ g.save(); g.translate(x, y); const s = Math.sin(Math.min(1, k * 2.2) * Math.PI) ; g.fillStyle = rgba('#2a5a22', .45 * (1 - k)); ell(g, 0, 4, f.r, f.r * .45); g.fill(); g.strokeStyle = OL; g.lineWidth = 1.5; for (let i = 0; i < 6; i++){ const a = i / 6 * TAU, px = Math.cos(a) * f.r * .55, py = Math.sin(a) * f.r * .25; g.fillStyle = i % 2 ? '#5fd17e' : '#3e9a4a'; g.beginPath(); g.moveTo(px - 5, py); g.lineTo(px, py - 26 * s); g.lineTo(px + 5, py); g.closePath(); g.fill(); g.stroke(); } g.restore(); }
    else if (f.k === 'mark'){ g.strokeStyle = rgba('#ff7a2a', .7); g.lineWidth = 2; circ(g, x, y, f.r * (1 - k * .3)); g.stroke(); g.fillStyle = rgba('#ff7a2a', .12 + k * .2); g.fill(); }
  }
  /* gemas e itens */
  for (const gm of R.gems){ const x = gm.x - cx, y = gm.y - cy; if (x < -20 || y < -20 || x > VW + 20 || y > VH + 20) continue; gemDraw(g, x, y, gm.v); }
  for (const it of R.items){ itemDraw(g, it.x - cx, it.y - cy, it.k); }
  /* entidades ordenadas por y */
  const ents = [];
  for (const e of R.en){ if (e.dead) continue; const x = e.x - cx, y = e.y - cy; if (x < -120 || y < -120 || x > VW + 120 || y > VH + 120) continue; ents.push(e); }
  ents.push(R); ents.sort((a, b) => a.y - b.y);
  for (const e of ents){
    if (e === R){ drawPlayer(g, R.x - cx, R.y - cy); continue; }
    const x = e.x - cx, y = e.y - cy, sp = enemySpr(e.k), f = (e.an | 0) % 2, img = sp.fr[f], s = e.r / EN[e.k].r * (e.small ? 1 : 1);
    g.fillStyle = 'rgba(0,0,0,.28)'; ell(g, x, y + e.r * .75, e.r * .9, e.r * .32); g.fill();
    if (e.elite || e.boss){ g.save(); g.globalAlpha = .5 + .3 * Math.sin(R.t * 6); g.drawImage(glow(e.boss ? '#ff4a4a' : '#f6c945'), x - e.r * 1.6, y - e.r * 1.6, e.r * 3.2, e.r * 3.2); g.restore(); }
    const flip = (R.x < e.x) ? -1 : 1, w = img.width * s, h = img.height * s;
    g.save(); g.translate(x, y + (EN[e.k].fly ? Math.sin(R.t * 6 + e.ph) * 4 : 0)); if (flip < 0) g.scale(-1, 1); if (e.frz > 0) g.filter = 'none';
    g.drawImage(img, -w / 2, -h / 2 - e.r * .15, w, h); if (e.flash > 0){ g.globalAlpha = .75; g.drawImage(sp.fl[f], -w / 2, -h / 2 - e.r * .15, w, h); g.globalAlpha = 1; } g.restore();
    if (e.frz > 0){ g.fillStyle = 'rgba(127,224,255,.35)'; circ(g, x, y, e.r); g.fill(); }
    if ((e.elite || e.boss) && !e.boss){ g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x - 20, y - e.r - 14, 40, 5); g.fillStyle = '#f6c945'; g.fillRect(x - 20, y - e.r - 14, 40 * Math.max(0, e.hp / e.mhp), 5); }
  }
  front.sort((a, b) => a[2] - b[2]).forEach(drawProp);
  /* projéteis */
  for (const p of R.pr){ const x = p.x - cx, y = p.y - cy;
    if (p.k === 'blades'){ g.save(); g.translate(x, y); g.rotate(p.rot); bladeDraw(g, p.r); g.restore(); continue; }
    if (p.k === 'beast'){ g.save(); g.translate(x, y); g.font = '34px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🐗', 0, 0); g.restore(); continue; }
    if (p.k === 'meteor'){ if (q) g.drawImage(glow('#ff7a2a'), x - 40, y - 40, 80, 80); g.fillStyle = '#ffd04a'; circ(g, x, y, 12); g.fill(); g.strokeStyle = rgba('#ff7a2a', .6); g.lineWidth = 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x - p.vx * .12, y - p.vy * .12); g.stroke(); continue; }
    const col = p.col, r = p.r; if (q) g.drawImage(glow(col), x - r * 3, y - r * 3, r * 6, r * 6);
    if (p.k === 'bolt'){ g.strokeStyle = '#fff6c0'; g.lineWidth = 3; const a = Math.atan2(p.vy, p.vx); g.beginPath(); g.moveTo(x - Math.cos(a) * 16, y - Math.sin(a) * 16); g.lineTo(x - Math.cos(a) * 6 + Math.sin(a) * 4, y - Math.sin(a) * 6 - Math.cos(a) * 4); g.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10); g.stroke(); }
    else { g.fillStyle = col; circ(g, x, y, r * .8); g.fill(); g.fillStyle = '#fff'; circ(g, x - r * .25, y - r * .25, r * .3); g.fill(); }
  }
  for (const p of R.ep){ const x = p.x - cx, y = p.y - cy; if (q) g.drawImage(glow(p.col), x - p.r * 2.6, y - p.r * 2.6, p.r * 5.2, p.r * 5.2); g.fillStyle = p.col; circ(g, x, y, p.r); g.fill(); g.strokeStyle = OL; g.lineWidth = 1.5; g.stroke(); }
  /* orbes e lâminas evoluídas */
  if (R.w.orb && R.w.orb.pos) for (const [x0, y0] of R.w.orb.pos){ const x = x0 - cx, y = y0 - cy, r = 10 * R.st.area * (R.evo.orb ? 1.5 : 1); if (q) g.drawImage(glow('#59a8ec'), x - r * 3, y - r * 3, r * 6, r * 6); const gr = g.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); gr.addColorStop(0, '#e6f6ff'); gr.addColorStop(1, '#2c7ad6'); g.fillStyle = gr; circ(g, x, y, r); g.fill(); g.strokeStyle = OL; g.lineWidth = 1.5; g.stroke(); }
  if (R.w.blades && R.evo.blades && R.w.blades.pos) for (const [x0, y0, a] of R.w.blades.pos){ g.save(); g.translate(x0 - cx, y0 - cy); g.rotate(R.t * 14); bladeDraw(g, 16); g.restore(); }
  /* efeitos no ar */
  for (const f of R.fx){ if (f.d > 0) continue; const k = 1 - f.t / f.T;
    if (f.k === 'boom'){ const x = f.x - cx, y = f.y - cy; g.fillStyle = rgba('#ffb04a', .55 * (1 - k)); circ(g, x, y, f.r * (.4 + k * .7)); g.fill(); g.strokeStyle = rgba('#fff2a8', 1 - k); g.lineWidth = 3; g.stroke(); }
    else if (f.k === 'pulse'){ const x = f.x - cx, y = f.y - cy; g.strokeStyle = rgba('#fff2a8', 1 - k); g.lineWidth = 8 * (1 - k) + 1; circ(g, x, y, f.r * k); g.stroke(); }
    else if (f.k === 'chain'){ g.strokeStyle = rgba('#fff6c0', 1 - k); g.lineWidth = 3.5; g.beginPath(); f.pts.forEach(([x, y], i) => { const px = x - cx + (i && i < f.pts.length ? (Math.random() - .5) * 8 : 0), py = y - cy + (Math.random() - .5) * 8; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); g.strokeStyle = rgba('#ffd04a', .6 * (1 - k)); g.lineWidth = 8; g.stroke(); }
    else if (f.k === 'beam'){ g.strokeStyle = rgba(f.col, 1 - k); g.lineWidth = 5 * (1 - k) + 1; g.beginPath(); g.moveTo(f.x - cx, f.y - cy); g.quadraticCurveTo((f.x + f.tx) / 2 - cx + 20, (f.y + f.ty) / 2 - cy - 30, f.tx - cx, f.ty - cy); g.stroke(); }
    else if (f.k === 'evoP'){ const x = R.x - cx, y = R.y - cy; g.strokeStyle = rgba('#f6c945', 1 - k); g.lineWidth = 6; circ(g, x, y - 20, 30 + k * 160); g.stroke(); for (let i = 0; i < 12; i++){ const a = i / 12 * TAU + k * 3; g.fillStyle = rgba('#fff2a8', 1 - k); circ(g, x + Math.cos(a) * (20 + k * 80), y - 20 + Math.sin(a) * (20 + k * 80), 4); g.fill(); } }
    else if (f.k === 'ult'){ g.fillStyle = rgba(MAGES[f.c].gem, .35 * (1 - k)); g.fillRect(-50, -50, VW + 100, VH + 100); }
  }
  /* partículas */
  for (const p of R.parts){ const a = p.life / p.L; g.globalAlpha = a; g.fillStyle = p.col; g.fillRect(p.x - cx - p.s / 2, p.y - cy - p.s / 2, p.s * a + 1, p.s * a + 1); } g.globalAlpha = 1;
  /* números de dano */
  g.textAlign = 'center'; for (const n of R.nums){ g.globalAlpha = Math.min(1, n.t * 3); g.font = `800 ${n.crit ? 17 : 12}px system-ui,sans-serif`; g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.75)'; g.strokeText(n.v, n.x - cx, n.y - cy); g.fillStyle = n.crit ? '#ffdf3a' : '#fff'; g.fillText(n.v, n.x - cx, n.y - cy); } g.globalAlpha = 1;
  /* camada de tela (sem zoom) */
  g.setTransform(DPR, 0, 0, DPR, 0, 0); const SW = innerWidth, SH = innerHeight;
  /* vinheta e dano */
  if (q){ g.drawImage(vignette(), 0, 0, SW, SH); }
  if (R.hurtF > 0){ g.fillStyle = `rgba(255,0,0,${R.hurtF * .6})`; g.fillRect(0, 0, SW, SH); }
  if (R.hp < R.maxhp * .25){ g.strokeStyle = `rgba(255,30,30,${.25 + .2 * Math.sin(R.t * 6)})`; g.lineWidth = 16; g.strokeRect(0, 0, SW, SH); }
  /* chefe: barra */
  if (R.boss && !R.boss.dead){ const b = R.boss, w = Math.min(520, SW - 40), by = SW < 600 ? 104 : 70; g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect((SW - w) / 2, by, w, 12); g.fillStyle = '#e04040'; g.fillRect((SW - w) / 2, by, w * Math.max(0, b.hp / b.mhp), 12); g.strokeStyle = '#f6c945'; g.lineWidth = 2; g.strokeRect((SW - w) / 2, by, w, 12); g.font = '700 13px system-ui'; g.fillStyle = '#f6e7bf'; g.fillText(EN[b.k].n, SW / 2, by - 5);
    const dx = b.x - R.x, dy = b.y - R.y; if (Math.abs(dx) > VW / 2 || Math.abs(dy) > VH / 2){ const a = Math.atan2(dy, dx), ex = SW / 2 + Math.cos(a) * (SW / 2 - 30), ey = SH / 2 + Math.sin(a) * (SH / 2 - 30); g.save(); g.translate(ex, ey); g.rotate(a); g.fillStyle = '#ff4a4a'; g.beginPath(); g.moveTo(14, 0); g.lineTo(-8, -9); g.lineTo(-8, 9); g.closePath(); g.fill(); g.restore(); } }
  /* joystick */
  if (R.joy && R.joy.on){ g.save(); g.globalAlpha = .5; g.strokeStyle = '#fff'; g.lineWidth = 3; circ(g, R.joy.x0, R.joy.y0, 55); g.stroke(); g.fillStyle = '#f6c945'; const dx = R.joy.x - R.joy.x0, dy = R.joy.y - R.joy.y0, l = Math.min(55, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); circ(g, R.joy.x0 + Math.cos(a) * l, R.joy.y0 + Math.sin(a) * l, 22); g.fill(); g.restore(); }
  /* faixa */
  if (R.banner){ const b = R.banner, a = Math.min(1, b.t * 2, (b.T - b.t) * 4); g.globalAlpha = a; g.font = `800 ${SW < 500 ? 16 : 24}px Georgia,serif`; const tw = Math.min(SW - 20, g.measureText(b.m).width + 40); g.fillStyle = 'rgba(10,8,16,.75)'; rr(g, SW / 2 - tw / 2, SH * .24 - 24, tw, 42, 12); g.fill(); g.strokeStyle = '#d9ac4e'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#f6e7bf'; g.fillText(b.m, SW / 2, SH * .24 + 4, tw - 16); g.globalAlpha = 1; }
}
const GLC = {};
function glow(col){ return GLC[col] || (GLC[col] = glowSpr(col, 32)); }
let VIG = null; function vignette(){ const W0 = innerWidth, H0 = innerHeight; if (VIG && VIG.w === W0 && VIG.h === H0) return VIG.c; const c = mk(W0, H0), g = c.getContext('2d'), gr = g.createRadialGradient(W0 / 2, H0 / 2, Math.min(W0, H0) * .35, W0 / 2, H0 / 2, Math.max(W0, H0) * .75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = gr; g.fillRect(0, 0, W0, H0); VIG = {w:W0, h:H0, c}; return c; }
const GEMC = {};
function gemDraw(g, x, y, v){ const col = v >= 25 ? '#ff5a7a' : v >= 5 ? '#5fd17e' : '#59a8ec', s = v >= 25 ? 9 : v >= 5 ? 7 : 5.5; let c = GEMC[col]; if (!c){ c = mk(24, 24); const h = c.getContext('2d'); h.translate(12, 12); h.fillStyle = col; h.strokeStyle = OL; h.lineWidth = 1.5; h.beginPath(); h.moveTo(0, -9); h.lineTo(7, 0); h.lineTo(0, 9); h.lineTo(-7, 0); h.closePath(); h.fill(); h.stroke(); h.fillStyle = 'rgba(255,255,255,.6)'; h.beginPath(); h.moveTo(0, -7); h.lineTo(3.5, -1); h.lineTo(0, 0); h.closePath(); h.fill(); GEMC[col] = c; } const z = s / 7; g.drawImage(c, x - 12 * z, y - 12 * z + Math.sin(R.t * 4 + x) * 1.5, 24 * z, 24 * z); }
function itemDraw(g, x, y, k){ g.save(); g.translate(x, y + Math.sin(R.t * 3) * 3); g.strokeStyle = OL; g.lineWidth = 2;
  if (R.q) g.drawImage(glow(k === 'bau' ? '#f6c945' : k === 'pocao' ? '#ff6a8a' : k === 'cen' ? '#f6c945' : '#7fe0ff'), -22, -22, 44, 44);
  if (k === 'bau'){ g.fillStyle = vg(g, '#a8783e', -10, 10); rr(g, -14, -8, 28, 18, 3); fs(g); g.fillStyle = vg(g, '#c8904e', -16, -6); rr(g, -15, -14, 30, 9, 4); fs(g); g.fillStyle = '#f6c945'; rr(g, -3, -8, 6, 7, 1.5); fs(g); }
  else if (k === 'pocao'){ g.fillStyle = '#ff6a8a'; circ(g, 0, 3, 8); fs(g); g.fillStyle = '#e8e0d0'; rr(g, -3, -10, 6, 7, 1.5); fs(g); g.fillStyle = 'rgba(255,255,255,.6)'; circ(g, -3, 0, 2.4); g.fill(); }
  else if (k === 'ima'){ g.lineWidth = 6; g.strokeStyle = OL; g.beginPath(); g.arc(0, 0, 8, Math.PI, 0); g.stroke(); g.lineWidth = 4; g.strokeStyle = '#e04040'; g.beginPath(); g.arc(0, 0, 8, Math.PI, 0); g.stroke(); g.fillStyle = '#cfd6e0'; g.fillRect(-10, 0, 4, 5); g.fillRect(6, 0, 4, 5); }
  else if (k === 'bomba'){ g.fillStyle = '#3a3a48'; circ(g, 0, 2, 9); fs(g); g.strokeStyle = '#d9ac4e'; g.beginPath(); g.moveTo(4, -6); g.quadraticCurveTo(8, -12, 12, -10); g.stroke(); g.fillStyle = '#ffd04a'; circ(g, 12, -10, 2.5); g.fill(); }
  else if (k === 'cen'){ g.fillStyle = '#f6c945'; star(g, 0, 0, 9, 4, 4); fs(g); }
  g.restore(); }
function bladeDraw(g, r){ g.fillStyle = '#dfe6f0'; g.strokeStyle = OL; g.lineWidth = 1.5; for (let i = 0; i < 3; i++){ g.rotate(TAU / 3); g.beginPath(); g.moveTo(0, -2); g.quadraticCurveTo(r * .9, -r * .5, r, 0); g.quadraticCurveTo(r * .5, r * .1, 0, 2); g.closePath(); g.fill(); g.stroke(); } g.fillStyle = '#7fe0ff'; circ(g, 0, 0, 3); g.fill(); }
function drawPlayer(g, x, y){
  const sp = mageSpr(R.mage, R.tier), f = R.anim > 0 ? Math.floor(R.anim) % 4 : 0, img = (R.inv > 0 && R.hurtF > 0) ? sp.fl[f] : sp.fr[f], m = MAGES[R.mage];
  if (R.w.aura){ const rad = R.w.aura.rad || 60; g.fillStyle = rgba('#fff2a8', R.evo.aura ? .16 : .1); circ(g, x, y, rad); g.fill(); g.strokeStyle = rgba('#fff2a8', .35 + .15 * Math.sin(R.t * 4)); g.lineWidth = 2; g.stroke(); }
  if (R.tier >= 3 && R.q){ g.save(); g.translate(x, y + 4); g.rotate(R.t); g.strokeStyle = rgba(m.gem, .7); g.lineWidth = 2; ell(g, 0, 0, 34, 34); g.stroke(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; g.fillStyle = m.gem; star(g, Math.cos(a) * 34, Math.sin(a) * 34, 4, 1.8, 4); g.fill(); } g.restore(); }
  g.fillStyle = 'rgba(0,0,0,.3)'; ell(g, x, y + 8, 16, 5.5); g.fill();
  if (R.tier >= 1 && R.q){ g.globalAlpha = .35 + .15 * Math.sin(R.t * 3); g.drawImage(glow(m.gem), x - 30, y - 50, 60, 60); g.globalAlpha = 1; }
  if (R.inv > 0 && !R.hurtF && Math.floor(R.t * 20) % 2) g.globalAlpha = .55;
  g.save(); g.translate(x, y); if (R.face < 0) g.scale(-1, 1); g.drawImage(img, -36, -66); g.restore(); g.globalAlpha = 1;
}

/* ---------- laço principal ---------- */
let lastT = 0, acc = 0;
function loop(now){
  raf = requestAnimationFrame(loop); if (!R) return;
  let ft = Math.min(100, now - lastT); lastT = now; acc += ft / 1000;
  const step = 1 / 60; let n = 0; while (acc >= step && n < 4){ update(step); acc -= step; n++; } if (n >= 4) acc = 0;
  render(); hud();
  /* qualidade automática */
  R.ftAvg = R.ftAvg * .95 + ft * .05; if (R.q && R.ftAvg > 26 && !R.paused && !R.modal){ R.fpsLowT += ft / 1000; if (R.fpsLowT > 2.5){ R.q = 0; resize(); banner('Gráficos simplificados para rodar melhor', 1.8); } } else R.fpsLowT = Math.max(0, R.fpsLowT - ft / 2000);
}
function resize(){ if (!cv) return; DPR = Math.min(R && !R.q ? 1 : 2, devicePixelRatio || 1); Z = clamp(Math.min(innerWidth, innerHeight) / 620, .72, 1.25); VW = innerWidth / Z; VH = innerHeight / Z; cv.width = Math.round(innerWidth * DPR); cv.height = Math.round(innerHeight * DPR); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; VIG = null; }
let hudLast = {};
function hud(){
  if (!R) return; const set = (id, v, prop) => { if (hudLast[id] === v) return; hudLast[id] = v; const el = document.getElementById(id); if (el){ if (prop) el.style[prop] = v; else el.textContent = v; } };
  set('g3Hp', Math.max(0, R.hp / R.maxhp * 100).toFixed(1) + '%', 'width'); set('g3HpT', Math.ceil(Math.max(0, R.hp)) + '/' + Math.round(R.maxhp));
  set('g3Xp', (R.xp / R.need * 100).toFixed(1) + '%', 'width'); set('g3Lv', 'Nv ' + R.lvl + ' · ' + TIERS[R.tier][1]);
  set('g3T', fmt(R.t)); set('g3K', '☠ ' + R.kills); set('g3C', '✦ ' + R.cenRun);
  const u = R.ult / R.ultMax; set('g3UltR', `conic-gradient(#f6c945 ${u * 360}deg, rgba(255,255,255,.12) 0)`, 'background'); const ub = document.getElementById('g3Ult'); if (ub){ const ready = u >= 1; if (hudLast.ur !== ready){ hudLast.ur = ready; ub.classList.toggle('ready', ready); } }
  const db = document.getElementById('g3Dash'); if (db){ const r = R.dashCd <= 0; if (hudLast.dr !== r){ hudLast.dr = r; db.classList.toggle('ready', r); } }
}
const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function hudIcons(){ const el = $('#g3Icons'); if (!el) return; el.innerHTML = Object.entries(R.w).map(([k, w]) => `<span class="g3-ic ${R.evo[k] ? 'evo' : ''}" style="--cc:${COLHEX[WPN[k].c]}" title="${R.evo[k] ? WPN[k].e : WPN[k].n} ${w.l}">${wIcon(k)}<i>${R.evo[k] ? '★' : w.l}</i></span>`).join('') + Object.entries(R.pas).map(([k, l]) => `<span class="g3-ic pas" title="${PAS[k].n} ${l}">${PAS[k].ic}<i>${l}</i></span>`).join(''); }
function showModal(h){ const m = $('#g3Modal'); m.innerHTML = `<div class="g3-mbox">${h}</div>`; m.hidden = false; }
function hideModal(){ const m = $('#g3Modal'); if (m){ m.hidden = true; m.innerHTML = ''; } }

/* ---------- entrada ---------- */
function bindInput(){
  R.keys = {};
  const key = e => { if (!R) return; const d = e.type === 'keydown'; const m = {ArrowUp:'u', w:'u', W:'u', ArrowDown:'d', s:'d', S:'d', ArrowLeft:'l', a:'l', A:'l', ArrowRight:'r', d:'r', D:'r'}[e.key];
    if (m){ R.keys[m] = d; e.preventDefault(); }
    if (!d) return;
    if (R.modal === 'lvl' && /^[1-4]$/.test(e.key)){ choose(+e.key - 1); return; }
    if (R.modal === 'chest' && (e.key === 'Enter' || e.key === ' ')){ const b = $('#g3Ok'); b && b.click(); e.preventDefault(); return; }
    if (e.key === ' ' || e.key === 'Shift'){ e.preventDefault(); dash(); }
    if (e.key === 'e' || e.key === 'E' || e.key === 'q' || e.key === 'Q'){ useUlt(); }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P'){ if (!R.modal || R.modal === 'pause') pause(!R.paused); } };
  R._key = key; addEventListener('keydown', key); addEventListener('keyup', key);
  R.joy = {on:false};
  cv.addEventListener('pointerdown', e => { if (R.joy.on) return; R.joy = {on:true, id:e.pointerId, x0:e.clientX, y0:e.clientY, x:e.clientX, y:e.clientY}; try { cv.setPointerCapture(e.pointerId); } catch(_){} e.preventDefault(); });
  cv.addEventListener('pointermove', e => { const j = R && R.joy; if (!j || !j.on || e.pointerId !== j.id) return; const dx = e.clientX - j.x0, dy = e.clientY - j.y0, l = Math.hypot(dx, dy); if (l > 70){ j.x0 = e.clientX - dx / l * 70; j.y0 = e.clientY - dy / l * 70; } j.x = e.clientX; j.y = e.clientY; });
  const up = e => { const j = R && R.joy; if (j && j.on && e.pointerId === j.id) R.joy = {on:false}; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('contextmenu', e => e.preventDefault());
}
function pause(on){
  if (!R || R.over) return; R.paused = on;
  if (on){ R.modal = 'pause'; const ws = Object.entries(R.w).map(([k, w]) => `<li><b>${R.evo[k] ? '★ ' + WPN[k].e : WPN[k].n}</b> nível ${w.l}${!R.evo[k] ? ` · evolui com ${PAS[WPN[k].p].n}${R.pas[WPN[k].p] ? ' ✓' : ''}` : ''}</li>`).join('');
    showModal(`<div class="g3-mh"><b>Pausa</b><small>${BIOMES[R.biome].n} · ${fmt(R.t)}</small></div><ul class="g3-list">${ws}</ul>
      <div class="g3-row"><button class="btn" id="g3Snd">${AU.on ? 'Som: ligado' : 'Som: desligado'}</button><button class="btn" id="g3Q">${R.q ? 'Gráficos: completos' : 'Gráficos: leves'}</button></div>
      <div class="g3-row"><button class="btn primary" id="g3Res">Continuar</button><button class="btn" id="g3Quit">Desistir</button></div>
      <small class="g3-kb">Mover: W A S D ou setas · Esquiva: Espaço · Poder: E</small>`);
    $('#g3Res').onclick = () => pause(false); $('#g3Quit').onclick = () => { hideModal(); R.modal = null; R.paused = false; end(false); };
    $('#g3Snd').onclick = () => { AU.on = !AU.on; S.svSound = AU.on; save(); $('#g3Snd').textContent = AU.on ? 'Som: ligado' : 'Som: desligado'; };
    $('#g3Q').onclick = () => { R.q = R.q ? 0 : 1; resize(); $('#g3Q').textContent = R.q ? 'Gráficos: completos' : 'Gráficos: leves'; }; }
  else { hideModal(); R.modal = null; lastT = performance.now(); }
}

/* ---------- início e fim ---------- */
function start(o){
  auInit(); if (AU.ctx && AU.ctx.state === 'suspended') AU.ctx.resume();
  newRun(o); hudLast = {};
  let ov = $('#g3'); if (!ov){ ov = document.createElement('div'); ov.id = 'g3'; document.body.appendChild(ov); }
  ov.hidden = false; document.body.style.overflow = 'hidden';
  ov.innerHTML = `<canvas id="g3Cv" aria-label="Jogo Sobreviva ao Multiverso"></canvas>
    <div class="g3-hud"><div class="g3-bars"><div class="g3-hp"><i id="g3Hp"></i><span id="g3HpT"></span></div><div class="g3-xp"><i id="g3Xp"></i><span id="g3Lv"></span></div></div>
      <div class="g3-mid"><b id="g3T">0:00</b><small id="g3K">☠ 0</small><small id="g3C">✦ 0</small></div><button class="g3-b" id="g3P" aria-label="Pausar">II</button></div>
    <div class="g3-icons" id="g3Icons"></div>
    <button class="g3-ult" id="g3Ult" aria-label="Poder especial"><span class="g3-ring" id="g3UltR"></span><b>${MAGES[o.c].ult}</b><small>Poder (E)</small></button>
    <button class="g3-dash" id="g3Dash" aria-label="Esquivar"><b>»</b><small>Esquiva</small></button>
    <div class="g3-modal" id="g3Modal" hidden></div>`;
  cv = $('#g3Cv'); ctx = cv.getContext('2d'); resize(); bindInput(); hudIcons();
  $('#g3P').onclick = () => pause(true); $('#g3Ult').onclick = useUlt; $('#g3Dash').onclick = dash;
  ['g3Ult', 'g3Dash', 'g3P'].forEach(id => $('#' + id).addEventListener('pointerdown', e => e.stopPropagation()));
  banner(BIOMES[0].n + ' · sobreviva!', 2.6); musStart();
  meta().v3.runs++; save();
  lastT = performance.now(); acc = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
addEventListener('resize', () => { if (R && cv) resize(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && R && !R.over && !R.paused && !R.modal) pause(true); });
function victory(){
  if (!R || R.over) return; R.modal = 'vic'; sfx('evo');
  showModal(`<div class="g3-mh"><b>Vitória!</b><small>Você derrotou o Devorador do Vazio em ${fmt(R.t)}.</small></div><p style="margin:0;text-align:center">Continuar no modo infinito? Os chefes voltam mais fortes e a recompensa de centelhas dobra.</p><div class="g3-row"><button class="btn primary" id="g3Inf">Modo infinito</button><button class="btn" id="g3Fin">Encerrar com vitória</button></div>`);
  $('#g3Inf').onclick = () => { hideModal(); R.modal = null; R.endless = true; R.biome = 4; banner('Modo infinito!', 2); };
  $('#g3Fin').onclick = () => { hideModal(); R.modal = null; end(true); };
}
function end(win){
  if (!R || R.over) return; R.over = true; musStop();
  const M = meta(), B = M.v3.best, earn = Math.round(R.kills / 12 + R.t / 20 + R.bossKills * 25 + R.cenRun) * (R.hard ? 2 : 1) * (R.endless ? 2 : 1);
  M.cen += earn; const prev = B[R.mage] || 0, rec = R.t > prev; if (rec) B[R.mage] = Math.floor(R.t);
  if (win || R.bossKills >= 5){ M.v3.won = (M.v3.won || 0) + 1; }
  M.v3.maxTier = Math.max(M.v3.maxTier || 0, R.tier); save();
  if (typeof addXP === 'function') try { addXP(Math.min(40, 5 + Math.floor(R.t / 30))); } catch(e){}
  showModal(`<div class="g3-mh"><b>${win ? 'Vitória!' : 'Fim de jogo'}</b><small>${MAGES[R.mage].n} · ${TIERS[R.tier][1]} · ${BIOMES[R.biome].n}</small></div>
    <div class="g3-res"><span><b>${fmt(R.t)}</b>sobrevivido${rec ? ' · recorde!' : ''}</span><span><b>${R.kills}</b>criaturas</span><span><b>${R.lvl}</b>nível</span><span><b>${R.bossKills}</b>chefes</span><span><b>+${earn} ✦</b>centelhas</span></div>
    <div class="g3-row"><button class="btn primary" id="g3Again">Jogar de novo</button><button class="btn" id="g3Exit">Sair</button></div>`);
  $('#g3Again').onclick = () => { const c = R.mage; close(); start({c}); };
  $('#g3Exit').onclick = close;
}
function close(){
  cancelAnimationFrame(raf); musStop(); if (R && R._key){ removeEventListener('keydown', R._key); removeEventListener('keyup', R._key); }
  const ov = $('#g3'); if (ov){ ov.hidden = true; ov.innerHTML = ''; } document.body.style.overflow = ''; R = null; cv = ctx = null;
  if (typeof currentView !== 'undefined' && currentView === 'treino' && typeof trTab !== 'undefined' && trTab === 'surv') menu($('#trBody'));
}

/* ---------- menu dentro da Academia ---------- */
function portrait(c, tier, locked){ const s = mageSpr(c, tier).fr[0], cvp = mk(96, 96), g = cvp.getContext('2d'); const gr = g.createRadialGradient(48, 52, 4, 48, 52, 48); gr.addColorStop(0, rgba(MAGES[c].col, .55)); gr.addColorStop(1, rgba(MAGES[c].col, 0)); g.fillStyle = gr; g.fillRect(0, 0, 96, 96); g.fillStyle = 'rgba(0,0,0,.3)'; ell(g, 48, 86, 18, 5); g.fill(); g.drawImage(s, 12, 10); if (locked){ g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(10,8,16,.82)'; g.fillRect(0, 0, 96, 96); } return cvp.toDataURL(); }
function heroArt(){
  const W0 = 720, H0 = 260, c = mk(W0, H0), g = c.getContext('2d'); const T = groundTile(4); for (let x = 0; x < W0; x += 256) for (let y = 0; y < H0; y += 256) g.drawImage(T, x, y);
  g.fillStyle = 'rgba(10,6,20,.35)'; g.fillRect(0, 0, W0, H0);
  [['crystal', 40, 250], ['hedron', 640, 240], ['eye', 560, 120], ['voidrock', 120, 140]].forEach(([p, x, y]) => g.drawImage(propSpr(p), x - 40, y - 90));
  ['zumbi', 'goblin', 'esqueleto', 'espirito', 'aranha', 'golem'].forEach((k, i) => { const s = enemySpr(k).fr[i % 2]; g.drawImage(s, 420 + (i % 3) * 70 - s.width / 2, 120 + Math.floor(i / 3) * 70 - s.height / 2); });
  const d = enemySpr('dragao').fr[0]; g.globalAlpha = .9; g.drawImage(d, 600 - d.width / 2, 70 - d.height / 2); g.globalAlpha = 1;
  'WUBRG'.split('').forEach((k, i) => { const s = mageSpr(k, Math.min(3, i)).fr[0]; g.drawImage(glow(MAGES[k].gem), 70 + i * 62 - 34, 150 - 40, 68, 68); g.drawImage(s, 70 + i * 62 - 36, 196 - 72); });
  const gr = g.createLinearGradient(0, 0, W0, 0); gr.addColorStop(0, 'rgba(10,6,20,.75)'); gr.addColorStop(.55, 'rgba(10,6,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, W0, H0);
  return c.toDataURL('image/webp', .85);
}
let HERO = null;
function menu(box){
  if (!box) return; const M = meta(), V = M.v3;
  if (sel.view === 'shop') return shopView(box);
  if (!HERO) HERO = heroArt();
  const cost = c => MAGES[c].cost;
  box.innerHTML = `<div class="g3-menu">
    <div class="g3-hero" style="background-image:url(${HERO})"><div class="g3-hero-in"><span class="g3-tag">Jogo de ação · ${Object.keys(V.chars).length}/5 magos</span><h2>Sobreviva ao Multiverso</h2>
      <p>Suas mágicas disparam sozinhas. Desvie das criaturas, colete cristais de mana, escolha cartas a cada nível, evolua suas mágicas em versões lendárias e veja seu mago virar <b>Planeswalker</b>.</p>
      <div class="g3-row"><button class="btn primary g3-play" id="g3Go">Jogar com ${MAGES[sel.c].n}</button><button class="btn" id="g3Shop">Loja · ✦ ${M.cen}</button>
      <label class="g3-hard"><input type="checkbox" id="g3Hard" ${V.hard ? 'checked' : ''}> Modo difícil (centelhas em dobro)</label></div></div></div>
    <span class="eyebrow">Escolha seu mago</span>
    <div class="g3-mages">${'RUBGW'.split('').map(c => { const m = MAGES[c], own = V.chars[c], b = V.best[c]; return `<button class="g3-mage ${own ? '' : 'locked'}" data-g3c="${c}" aria-pressed="${sel.c === c}" style="--mc:${m.col}">
      <img src="${portrait(c, own ? Math.min(3, V.maxTier || 0) : 0, !own)}" alt="" width="96" height="96"><b>${m.n}</b><small>${m.t} · ${manaSym(c)}</small><small>${WPN[m.w].n} · ${m.bonus}</small><small class="g3-ult-n">Poder: ${m.ult}</small>
      ${own ? (b ? `<small class="g3-best">Recorde ${fmt(b)}</small>` : '') : `<span class="g3-lock">✦ ${cost(c)} para liberar</span>`}</button>`; }).join('')}</div>
    <div class="g3-evo-strip"><b>Evolução do mago:</b>${TIERS.map((t, i) => `<span><img src="${portrait(sel.c, i)}" alt="" width="56" height="56"><small>${t[1]}<br>nível ${t[0]}</small></span>`).join('<i>→</i>')}</div>
    <details class="g3-help"><summary>Como jogar e grimório de evoluções</summary>
      <ul><li><b>Mover:</b> no PC, W A S D ou setas; no celular, arraste o dedo em qualquer lugar (um joystick aparece onde você tocar).</li>
      <li><b>Esquiva:</b> Espaço ou o botão » (fica invencível por um instante).</li><li><b>Poder especial:</b> carrega derrotando criaturas; E ou o botão dourado.</li>
      <li><b>Cartas:</b> a cada nível, escolha uma mágica nova, melhore uma que já tem ou pegue uma relíquia.</li>
      <li><b>Evolução:</b> mágica no nível 5 + a relíquia certa → abra um baú (de elites e chefes) e ela vira lendária.</li>
      <li><b>Planos e chefes:</b> a cada 2 min 30 s chega um chefe com ataques avisados por marcas vermelhas: saia delas! Derrote-o para viajar ao próximo plano. São 5 chefes.</li></ul>
      <div class="g3-grim">${Object.entries(WPN).map(([k, w]) => `<span class="${(V.evo || {})[k] ? 'got' : ''}"><b style="color:${COLHEX[w.c]}">${wIcon(k)} ${w.n}</b> + ${PAS[w.p].ic} ${PAS[w.p].n} → <b>${(V.evo || {})[k] ? '★ ' : ''}${w.e}</b></span>`).join('')}</div></details></div>`;
  $$('[data-g3c]').forEach(b => b.onclick = () => { const c = b.dataset.g3c;
    if (!V.chars[c]){ if (M.cen >= cost(c)){ if (confirmBuy(b, cost(c))){ M.cen -= cost(c); V.chars[c] = 1; sel.c = c; save(); menu(box); } } else toast(`Faltam ✦ ${cost(c) - M.cen} centelhas. Jogue para ganhar mais!`); return; }
    sel.c = c; menu(box); });
  $('#g3Go').onclick = () => start({c:sel.c}); $('#g3Shop').onclick = () => { sel.view = 'shop'; menu(box); };
  $('#g3Hard').onchange = e => { V.hard = e.target.checked; save(); };
}
function confirmBuy(b, c){ if (b.dataset.sure){ return true; } b.dataset.sure = 1; const l = b.querySelector('.g3-lock'); if (l) l.textContent = `Toque de novo para liberar (✦ ${c})`; return false; }
function shopView(box){
  const M = meta(), U = M.v3.up, cost = k => Math.round(SHOP[k].base * Math.pow(1.7, U[k] || 0));
  box.innerHTML = `<div class="panel stack-v"><h3>Loja da Centelha</h3><p class="muted" style="margin:0">Melhorias permanentes, para todos os magos. Você ganha centelhas (✦) a cada partida.</p>
    <div class="row-h"><span class="pill good" style="font-size:1rem">✦ ${M.cen}</span><button class="btn small" id="g3Back">← Voltar</button></div>
    <div class="g3-shop">${Object.entries(SHOP).map(([k, s]) => { const l = U[k] || 0, mx = l >= s.max, c = cost(k); return `<div class="g3-up"><b>${s.n}</b><small>${s.d}</small><span class="g3-pips">${Array.from({length:s.max}, (_, i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</span><button class="btn small ${mx ? '' : 'primary'}" data-g3buy="${k}" ${mx || M.cen < c ? 'disabled' : ''}>${mx ? 'Máximo' : '✦ ' + c}</button></div>`; }).join('')}</div></div>`;
  $('#g3Back').onclick = () => { sel.view = 'main'; menu(box); };
  $$('[data-g3buy]').forEach(b => b.onclick = () => { const k = b.dataset.g3buy, c = cost(k); if (M.cen < c) return; M.cen -= c; U[k] = (U[k] || 0) + 1; save(); shopView(box); });
}
/* ganchos de teste */
window.G3D = {get R(){ return R; }, update, render, start, choose, chest, levelUp, end, close, spawnBoss:i => { R.bossDue = 0; R.bossIdx = i; }, useUlt, dash, pause, gain};
return {menu, start, close};
})();
