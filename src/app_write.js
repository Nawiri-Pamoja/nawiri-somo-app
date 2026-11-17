/* ================= HANDWRITING: same strokes as the font, so what children read is what they write ================= */
const HW_SW = 10.5, HW_GAP = 7;
function hwNums(s) { return s.split(',').map(Number); }
function hwSeg(seg, cur) {
  const k = seg[0], v = hwNums(seg.slice(1));
  if (k === 'L') return v.length === 4 ? [[v[0], v[1]], [v[2], v[3]]] : [cur, [v[0], v[1]]];
  if (k === 'P') { const o = []; for (let i = 0; i < v.length; i += 2) o.push([v[i], v[i + 1]]); return o; }
  if (k === 'D') return [[v[0], v[1]]];
  if (k === 'Q') { const o = []; for (let i = 0; i <= 24; i++) { const t = i / 24; o.push([(1 - t) ** 2 * v[0] + 2 * (1 - t) * t * v[2] + t * t * v[4], (1 - t) ** 2 * v[1] + 2 * (1 - t) * t * v[3] + t * t * v[5]]); } return o; }
  if (k === 'A') { const [cx, cy, rx, ry, a0, a1] = v, n = Math.max(2, Math.floor(Math.abs(a1 - a0) / 4)), o = [];
    for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; o.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return o; }
  return [];
}
function hwStroke(st) { let pts = []; st.split(' ').filter(Boolean).forEach(seg => { let p = hwSeg(seg, pts.length ? pts[pts.length - 1] : [0, 0]);
  if (pts.length && Math.hypot(pts[pts.length - 1][0] - p[0][0], pts[pts.length - 1][1] - p[0][1]) < .6) p = p.slice(1); pts = pts.concat(p); }); return pts; }
function hwParse(spec) { const p = spec.split('|'); return {w: +p[0], strokes: p.slice(1).filter(Boolean).map(hwStroke)}; }
const HW = {}; Object.keys(HAND).forEach(k => HW[k] = hwParse(HAND[k]));
Object.keys(SHAPES).forEach(k => { const g = hwParse(SHAPES[k].w + SHAPES[k].s); HW[k] = g; });
function hwLayout(text) {
  let x = 0; const strokes = [], glyphs = [];
  const add = (g, key) => { const ox = x + HW_GAP + HW_SW / 2; g.strokes.forEach(s => strokes.push(s.map(([a, b]) => [a + ox, b])));
    glyphs.push({ch: key, x0: ox, x1: ox + g.w}); x += g.w + HW_SW + 2 * HW_GAP; };
  if (HW[text] && text.length > 2) add(HW[text], text);
  else for (const ch of text) { if (ch === ' ') { x += 34; continue; } if (HW[ch]) add(HW[ch], ch); }
  return {strokes, w: x, glyphs};
}
function resample(pts, step) {
  if (pts.length < 2) return pts.slice(); const out = [pts[0]]; let rest = step;
  for (let i = 1; i < pts.length; i++) { let [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i]; let d = Math.hypot(x1 - x0, y1 - y0);
    while (d >= rest) { const t = rest / d; x0 += (x1 - x0) * t; y0 += (y1 - y0) * t; out.push([x0, y0]); d -= rest; rest = step; } rest -= d; }
  const l = pts[pts.length - 1]; if (Math.hypot(out[out.length - 1][0] - l[0], out[out.length - 1][1] - l[1]) > step / 3) out.push(l);
  return out;
}
const near = (p, set, tol) => set.some(q => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 <= tol * tol);
const coverage = (model, ink, tol) => model.length ? model.filter(p => near(p, ink, tol)).length / model.length : 0;
const precision = (ink, model, tol) => ink.length ? ink.filter(p => near(p, model, tol)).length / ink.length : 0;
const shoelace = pts => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
function rightWay(model, ink, tol) {           // did the child start at the start and go the right way?
  const len = model.length; if (len < 6) return true;
  const s = model[0], e = model[len - 1], d0 = Math.hypot(ink[0][0] - s[0], ink[0][1] - s[1]);
  if (Math.hypot(s[0] - e[0], s[1] - e[1]) < 14) {           // a closed loop (o, a, 0): same turning direction, start near the start
    const am = shoelace(model), ai = shoelace(ink); return d0 < tol * 2.6 && (Math.abs(ai) < 60 || Math.sign(am) === Math.sign(ai));
  }
  const idx = ink.map(p => { let b = 0, bd = 1e9; model.forEach((q, i) => { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (d < bd) { bd = d; b = i; } }); return b; });
  const n = Math.max(1, Math.floor(idx.length / 4)), a = idx.slice(0, n).reduce((x, y) => x + y, 0) / n, b = idx.slice(-n).reduce((x, y) => x + y, 0) / n;
  return b >= a;
}

/* ---------- the writing board ---------- */
const TOL = 15;
function writer(box, ex, done) {
  const L = ex.shape ? hwLayout(ex.shape) : hwLayout(ex.text), lvl = ex.lvl, free = lvl === 3 || lvl === 'copy';
  const strokes = L.strokes.map(s => resample(s, 3));
  const pad = 16, lw = free ? Math.max(L.w + 60, 170) : L.w + 2 * pad;
  const x0 = free ? -(lw - L.w) / 2 : -pad, y0 = -16, lh = 182;
  const st = ex.st = ex.st || {cur: 0, ink: [], done: [], miss: 0, fails: 0, ok: false, overlay: false};
  const maxW = Math.min(box.clientWidth || 360, 640), maxH = Math.min(window.innerHeight * (ex.small ? .3 : .44), 380);
  const sc = Math.min(maxW / lw, maxH / lh), dpr = window.devicePixelRatio || 1;
  const cv = document.createElement('canvas'); cv.className = 'wcv'; cv.width = Math.round(lw * sc * dpr); cv.height = Math.round(lh * sc * dpr);
  cv.style.width = Math.round(lw * sc) + 'px'; cv.style.height = Math.round(lh * sc) + 'px'; box.innerHTML = ''; box.appendChild(cv);
  const g = cv.getContext('2d'); let anim = null, live = null;
  cv._map = (x, y) => [(x - x0) * sc, (y - y0) * sc]; cv._strokes = strokes;
  const T = () => g.setTransform(sc * dpr, 0, 0, sc * dpr, -x0 * sc * dpr, -y0 * sc * dpr);
  const line = (pts, w, col, dash) => { if (!pts.length) return; g.beginPath(); g.lineWidth = w; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.setLineDash(dash || []);
    g.moveTo(pts[0][0], pts[0][1]); if (pts.length === 1) g.lineTo(pts[0][0] + .01, pts[0][1]); pts.forEach(p => g.lineTo(p[0], p[1])); g.stroke(); g.setLineDash([]); };
  const dot = (p, r, col) => { g.beginPath(); g.fillStyle = col; g.arc(p[0], p[1], r, 0, 7); g.fill(); };
  const arrows = s => { g.fillStyle = '#e08a1e'; for (let i = 8; i < s.length - 3; i += 9) { const a = s[i], b = s[i + 2], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    g.save(); g.translate(a[0], a[1]); g.rotate(ang); g.beginPath(); g.moveTo(5, 0); g.lineTo(-3, -4.5); g.lineTo(-3, 4.5); g.closePath(); g.fill(); g.restore(); } };
  const shift = () => { if (!st.ink.length) return [0, 0]; const all = [].concat(...st.ink), m = [].concat(...strokes);
    if (lvl === 'copy') return [Math.min(...all.map(p => p[0])) - Math.min(...m.map(p => p[0])), 0];
    return [(Math.min(...all.map(p => p[0])) + Math.max(...all.map(p => p[0]))) / 2 - (Math.min(...m.map(p => p[0])) + Math.max(...m.map(p => p[0]))) / 2, 0]; };
  function paint(extra) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); T();
    const X0 = x0, X1 = x0 + lw;
    [[0, '#a9c8e8', 1.4], [100, '#5d8fc9', 2.2], [150, '#a9c8e8', 1.4]].forEach(([y, c, w]) => line([[X0, y], [X1, y]], w, c));
    line([[X0, 50], [X1, 50]], 1.4, '#a9c8e8', [5, 5]);
    if (lvl === 1 || lvl === 0) { strokes.forEach(s => line(s, 24, '#f3ecda')); strokes.forEach(s => line(s, 2.4, '#c9bfa5', [2, 6])); }
    if (lvl === 2) strokes.forEach(s => line(s, 3.2, '#c9bfa5', [2, 6]));
    if (st.overlay) { const [dx] = shift(); strokes.forEach(s => line(s.map(p => [p[0] + dx, p[1]]), 20, 'rgba(19,138,64,.18)')); }
    if (!free && st.cur < strokes.length && !anim) { const s = strokes[st.cur];
      if (lvl === 1) { line(s, 24, '#fde2b8'); arrows(s); }
      dot(s[0], 8.5, '#138a40'); g.fillStyle = '#fff'; g.font = 'bold 11px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(st.cur + 1), s[0][0], s[0][1] + .5); }
    st.done.forEach(s => line(s, HW_SW, '#138a40'));
    st.ink.forEach(s => line(s, HW_SW, st.ok ? '#138a40' : '#24508f'));
    if (live) line(live, HW_SW, '#24508f');
    if (extra) extra();
  }
  function demo(from, to, then) {
    cancelAnimationFrame(anim); const list = strokes.slice(from, to); let k = 0, t = 0, last = performance.now();
    const step = now => { t += (now - last) / 1000 * 140; last = now; const s = list[k]; let n = Math.max(1, Math.min(s.length, Math.floor(t / 3) + 1));
      paint(() => { list.slice(0, k).forEach(q => line(q, HW_SW, '#e08a1e')); line(s.slice(0, n), HW_SW, '#e08a1e'); dot(s[n - 1], 6.5, '#c9502c');
        list.forEach((q, i) => { if (i >= k) { dot(q[0], 7, i === k ? '#138a40' : '#9b937f'); g.fillStyle = '#fff'; g.font = 'bold 10px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(from + i + 1), q[0][0], q[0][1] + .5); } }); });
      if (n >= s.length) { k++; t = -60; if (k >= list.length) { anim = null; setTimeout(() => { if (cv.isConnected) { paint(); if (then) then(); } }, 500); return; } }
      anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  const P = e => { const r = cv.getBoundingClientRect(); return [x0 + (e.clientX - r.left) / sc, y0 + (e.clientY - r.top) / sc]; };
  cv.addEventListener('pointerdown', e => { if (lvl === 0 || st.ok || anim) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (er) {} live = [P(e)]; paint(); });
  cv.addEventListener('pointermove', e => { if (!live) return; e.preventDefault(); const p = P(e), l = live[live.length - 1];
    if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 1.2) { live.push(p); paint(); } });
  const up = () => { if (!live) return; const s = resample(live, 2); live = null; st.ink.push(s); check(); paint(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  function finish(ok) { st.ok = true; paint(); beep(true); setTimeout(() => { if (cv.isConnected) done(ok); }, 700); }
  function check() {
    if (free) {
      const [dx] = shift(), m = [].concat(...strokes).map(p => [p[0] + dx, p[1]]), ink = [].concat(...st.ink);
      if (lvl === 3 && coverage(m, ink, TOL * 1.25) >= .82 && precision(ink, m, TOL * 1.6) >= .75) finish(st.fails === 0);
      showCheck(); return;
    }
    const s = strokes[st.cur], ink = [].concat(...st.ink), first = st.ink[0], tol = lvl === 1 ? TOL * 1.15 : TOL;
    if (s.length === 1) { if (near(s[0], ink, tol * 1.4)) return acceptStroke(); if (precision(ink, s, tol * 2) < .5) wrong(); return; }
    if (ink.length > 6 && precision(ink, s, tol * 1.8) < .55) return wrong();
    if (coverage(s, ink, tol) >= .8) { if (!rightWay(s, first, tol) && st.miss < 2) return wrong(); acceptStroke(); }
  }
  function acceptStroke() { st.done.push(...st.ink); st.ink = []; st.cur++; beep(true);
    if (st.cur >= strokes.length) { st.ink = st.done; st.done = []; finish(st.miss === 0); } }
  function wrong() { st.miss++; st.ink = []; beep(false); demo(st.cur, st.cur + 1); }
  function showCheck() { const b = box.parentNode && box.parentNode.querySelector('.wchk'); if (b) b.style.visibility = st.ink.length && !st.ok ? 'visible' : 'hidden'; }
  const api = {
    demo: () => { if (st.ok) return; if (free) { st.overlay = true; demo(0, strokes.length, () => { st.overlay = false; paint(); }); } else demo(st.cur, strokes.length); },
    clear: () => { if (st.ok) return; st.ink = []; paint(); showCheck(); },
    check: () => {
      if (!st.ink.length || st.ok) return;
      if (lvl === 'copy') { st.overlay = true; paint(); finish(true); return; }
      const [dx] = shift(), m = [].concat(...strokes).map(p => [p[0] + dx, p[1]]), ink = [].concat(...st.ink);
      if (coverage(m, ink, TOL * 1.35) >= .7 && precision(ink, m, TOL * 1.7) >= .68) return finish(st.fails === 0);
      st.fails++; beep(false); st.overlay = true; paint();
      if (st.fails >= 2) { const nb = box.parentNode.querySelector('.wnext'); if (nb) nb.style.display = 'block'; }
      setTimeout(() => { if (!cv.isConnected || st.ok) return; st.ink = []; demo(0, strokes.length, () => { st.overlay = false; paint(); showCheck(); }); }, 900);
    }
  };
  paint(); showCheck();
  if (lvl === 0) setTimeout(() => cv.isConnected && demo(0, strokes.length), 300);
  else if (lvl === 1 && !st.ink.length && !st.done.length && !ex.noDemo) setTimeout(() => cv.isConnected && demo(0, strokes.length), 250);
  return api;
}
let WR = null;

/* ---------- helpers for the course ---------- */
const LG = s => (String(s).toLowerCase().match(/ng'|ng|ny|ch|dh|th|sh|[a-z]|'/g) || []);
const isV = g => VOWELS.includes(g);
function syllab(w) { const g = LG(w), out = []; let cur = '';
  for (let i = 0; i < g.length; i++) { cur += g[i]; if (isV(g[i]) && i + 1 < g.length && !isV(g[i + 1])) { let j = i + 1; while (j < g.length && !isV(g[j])) j++; if (j < g.length) { out.push(cur); cur = ''; } } }
  if (cur) out.push(cur); return out; }
function decWords(known, pics) {
  const K = new Set(known);
  return KIND.w.filter(it => { const l = luoOf(it); return l && (it.sure || S.edits[it.id]) && /^[a-z']+$/i.test(l) && l.length <= 9 && (!pics || it.picOk) && it.topic !== 'cvc' && LG(l).every(g => K.has(g)); })
    .filter((it, i, a) => a.findIndex(x => luoOf(x) === luoOf(it)) === i);
}
const sylItem = s => I('syl_' + slug(s));
const lsound = l => isV(l) ? sylItem(l) : sylItem(l + 'a');
const canSyl = () => canLuo(sylItem('ma'));
const H = (s, cls) => `<span class="hand ${cls || ''}">${esc(s)}</span>`;
function hiFirst(word, l) { const w = String(word), k = w.toLowerCase().indexOf(l); return k < 0 ? esc(w) : esc(w.slice(0, k)) + '<b class="hlt">' + esc(w.slice(k, k + l.length)) + '</b>' + esc(w.slice(k + l.length)); }
const W = (text, lvl, o) => Object.assign({t: 'write', text, lvl}, o || {});

/* ---------- lesson builders ---------- */
function pwSession(u) { const q = []; u.shapes.forEach(s => { q.push({t: 'write', shape: s, text: s, lvl: 1}); q.push({t: 'write', shape: s, text: s, lvl: 2, noDemo: true}); }); return q; }
function firstSound(l, n) {
  const kw = I(KEYW[l]), all = [kw].concat(decWords(LIT_SEQ, true), KIND.w.filter(it => it.picOk && it.sure && /^[a-z']+$/i.test(luoOf(it)))).filter(it => it && it.picOk && it.topic !== 'pl');
  const yes = [kw].filter(x => x && x.picOk && LG(luoOf(x))[0] === l).concat(shuffle(all.filter(it => LG(luoOf(it))[0] === l))).filter((x, i, a) => a.indexOf(x) === i), no = shuffle(all.filter(it => LG(luoOf(it))[0] !== l && LG(luoOf(it))[0] !== (LOOKALIKE[l] || '')[0]));
  return yes.slice(0, n).map((it, k) => ({t: 'ch', kind: 'first', l, it, opts: shuffle([it].concat(no.filter(x => x.pic !== it.pic).slice(k * 2, k * 2 + 2))), ans: it.id}));
}
function findEx(l, known) {
  const look = (LOOKALIKE[l] || '').match(/ng'|ng|ny|ch|dh|th|[a-z]/g) || [], pool = shuffle(look.concat(known.filter(k => k !== l)));
  const others = []; for (let i = 0; others.length < 8; i++) others.push(pool.length ? pool[i % pool.length] : 'o');
  return {t: 'find', l, cells: shuffle([l, l, l, l].concat(others))};
}
function wordDrills(words, q, n) {
  shuffle(words).slice(0, n).forEach((it, i) => {
    q.push({t: 'meet', it, read: true});
    q.push(pk(it, 'n>p', words, 3, 1));
    const sy = syllab(luoOf(it));
    if (sy.length >= 2 && i % 2 === 0) q.push({t: 'arr', it, lang: 'luo', spell: true, parts: sy, extra: 'syl', known: words.known});
    else if (LG(luoOf(it)).length >= 2) q.push(Object.assign(arrSpell(it, 'luo'), {known: words.known}));
  });
}
function letterSession(u) {
  const l = u.l, known = u.known, q = [], vow = known.filter(isV), cons = known.filter(k => !isV(k));
  q.push({t: 'lintro', l, u});
  firstSound(l, 2).forEach(e => q.push(e));
  q.push(W(l, 1, {noDemo: true}));
  q.push(findEx(l, known));
  q.push(W(l, 2));
  if (!isV(l) && vow.length) q.push({t: 'blend', c: l, vs: vow});
  else if (isV(l) && cons.length) q.push({t: 'blend', c: cons[cons.length - 1], vs: vow});
  if (canSyl() && cons.length && vow.length) { const sy = [].concat(...cons.map(c => vow.map(v => sylItem(c + v)))).filter(Boolean);
    shuffle(sy.filter(s => LG(s.luo).includes(l))).slice(0, 3).forEach(s => q.push(pk(s, 'la>n', sy))); }
  q.push(W(l, 3));
  const words = decWords(known, true).filter(it => LG(luoOf(it)).includes(l)); words.known = known;
  wordDrills(words.sort((a, b) => luoOf(a).length - luoOf(b).length), q, 4);
  const syl = isV(l) ? (cons.length ? cons[cons.length - 1] + l : null) : (vow.length ? l + vow[vow.length - 1] : null);
  if (syl) q.push(W(syl, 2));
  const short = words.filter(it => luoOf(it).length <= 5)[0]; if (short) q.push(W(luoOf(short), 2, {it: short}));
  return q;
}
function tfLuo(n) {
  const nouns = PATTERN_NOUNS.map(I).filter(it => it && it.picOk && luoOf(it)), pats = [['Ma en ', '.'], ['Aneno ', '.'], ['An gi ', '.']], q = [];
  for (let i = 0; i < n; i++) { const a = nouns[Math.floor(Math.random() * nouns.length)], truth = Math.random() < .5, b = truth ? a : shuffle(nouns.filter(x => x.pic !== a.pic))[0], p = pats[i % pats.length];
    q.push({t: 'tf', text: p[0] + luoOf(a) + p[1], pic: b.pic, truth, lang: 'luo'}); }
  return q;
}
function reviewLit(u) {
  const q = [], known = u.known, fresh = u.fresh, words = decWords(known, true); words.known = known;
  fresh.forEach(l => q.push(findEx(l, known)));
  const fw = shuffle(words.filter(it => LG(luoOf(it)).some(g => fresh.includes(g)))).concat(shuffle(words)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 8);
  if (fw.length >= 2) {
    fw.slice(0, 4).forEach(it => q.push(pk(it, 'n>p', fw, Math.max(3, Math.min(4, fw.length)), 1)));
    fw.slice(0, 4).forEach(it => q.push(pk(it, 'p>n', fw, Math.max(2, Math.min(4, fw.length)), 1)));
    fw.filter(it => syllab(luoOf(it)).length >= 2).slice(0, 2).forEach(it => q.push({t: 'arr', it, lang: 'luo', spell: true, parts: syllab(luoOf(it)), extra: 'syl', known}));
    fw.slice(0, 2).forEach(it => q.push({t: 'kb', it, keys: known}));
    const sh = fw.filter(it => luoOf(it).length <= 5); if (sh[0]) q.push(W(luoOf(sh[0]), 2, {it: sh[0]})); if (sh[1]) q.push(W(luoOf(sh[1]), 'copy', {it: sh[1]}));
  }
  const vow = known.filter(isV), cons = known.filter(k => !isV(k));
  if (fw.length < 4 && cons.length && vow.length) { shuffle(fresh).forEach(l => q.push(W(isV(l) ? cons[0] + l : l + vow[0], 2))); }
  if (['m', 'a', 'e', 'n'].every(x => known.includes(x)) && known.includes('o')) tfLuo(3).forEach(e => q.push(e));
  return q;
}
function capSession(u) {
  const q = [];
  u.letters.forEach(C => { q.push(W(C, 1)); q.push(W(C, 2, {noDemo: true})); });
  shuffle(u.letters).forEach(C => q.push({t: 'ch', kind: 'cap', prompt: H(C, 'xl'), opts: shuffle([C.toLowerCase()].concat(shuffle('abdeghmnqrty'.split('').filter(x => x !== C.toLowerCase())).slice(0, 3))).map(v => ({v, h: H(v, 'lg')})), ans: C.toLowerCase()}));
  shuffle(u.letters).slice(0, 3).forEach(C => { const nm = NAMES[C], others = shuffle(Object.values(NAMES).filter(x => x[0] !== C)).slice(0, 2);
    q.push({t: 'ch', kind: 'name', prompt: H(C, 'xl'), opts: shuffle([nm].concat(others)).map(v => ({v, h: H(v, 'md')})), ans: nm}); });
  const nm = NAMES[u.letters[0]]; if (nm.length <= 8) q.push(W(nm, 2));
  q.push(W(u.letters.map(c => c + c.toLowerCase()).slice(0, 2).join(' '), 3));
  return q;
}
function numSession(u) {
  const q = [];
  u.digits.forEach(d => { q.push(W(d, 1)); q.push(W(d, 2, {noDemo: true})); });
  shuffle(u.digits.concat(u.digits)).slice(0, 6).forEach(d => { const n = +d, pic = COUNT_PICS[Math.floor(Math.random() * COUNT_PICS.length)];
    q.push({t: 'ch', kind: 'count', prompt: `<div class="cnt">${n ? esc(pic).repeat(n) : '<span class="zero">∅</span>'}</div>`, opts: shuffle([d].concat(shuffle('0123456789'.split('').filter(x => x !== d)).slice(0, 3))).map(v => ({v, h: H(v, 'lg')})), ans: d, num: n}); });
  shuffle(u.digits).slice(0, 2).forEach(d => q.push(W(d, 3)));
  return q;
}
function fluencySession(u) {
  const q = [], words = decWords(LIT_SEQ, true), dig = shuffle(words.filter(it => /ch|dh|th|ny|ng/.test(luoOf(it))));
  tfLuo(6).forEach(e => q.push(e));
  dig.slice(0, 4).forEach(it => q.push(pk(it, 'n>p', words, 4, 1)));
  dig.slice(4, 6).forEach(it => q.push({t: 'kb', it, keys: LIT_SEQ}));
  const s = shuffle(['Ma en ot.', 'Aneno guok.', 'An gi buk.', 'Mama tedo rech.', 'Ma en diel.'])[0]; q.push(W(s, 'copy'));
  tfLuo(3).forEach(e => q.push(e));
  return q;
}
function engLetterSession(u) {
  const q = [], its = u.letters.map(c => I('abc_' + c));
  its.forEach(it => { q.push({t: 'eintro', it}); q.push(W(it.letter, 2, {noDemo: true})); q.push(W(it.letter.toUpperCase(), 2, {noDemo: true})); });
  its.forEach(it => q.push(findEx(it.letter, 'abcdefghijklmnopqrstuvwxyz'.split(''))));
  shuffle(its).forEach(it => q.push(pk(it, 'a>l', KIND.abc)));
  shuffle(its).forEach(it => q.push(pk(it, 'p>t', KIND.abc)));
  its.forEach(it => q.push(W(it.letter, 3)));
  return q;
}
function cvcSession(u) {
  const q = [], its = u.ids.map(I);
  grp(its, 3).forEach(g => { g.forEach(it => q.push({t: 'meet', it})); shuffle(g).forEach(it => q.push(Object.assign(pk(it, 't>p', its), {silent: true}))); });
  shuffle(its).slice(0, 5).forEach(it => q.push(pk(it, 'a>t', its)));
  shuffle(its).slice(0, 3).forEach(it => q.push(arrSpell(it, 'en')));
  shuffle(its).slice(0, 2).forEach(it => q.push(W(it.en, 2, {it})));
  return q;
}
function swSession(u) {
  const q = [], its = u.ids.map(I), nouns = [].concat(...CVC.map(g => g.ids)).map(I);
  its.forEach(it => q.push({t: 'meet', it}));
  shuffle(its).forEach(it => q.push(pk(it, 'a>t', its)));
  for (let i = 0; i < 6; i++) { const a = nouns[Math.floor(Math.random() * nouns.length)], truth = Math.random() < .5, b = truth ? a : shuffle(nouns.filter(x => x.pic !== a.pic))[0];
    q.push({t: 'tf', text: u.sw.pat[i % 3].replace('#', a.en), pic: b.pic, truth, lang: 'en'}); }
  const ex = nouns[Math.floor(Math.random() * nouns.length)]; q.push(W(u.sw.pat[0].replace('#', ex.en), 'copy'));
  return q;
}

/* ---------- new exercise screens ---------- */
function introDone() { const b = document.querySelector('#exb .go'); if (b) b.classList.add('pulse'); }
Object.assign(EX, {
  write(ex, el) {
    const label = ex.shape ? `<div class="pic md">${SHAPES[ex.shape].e}</div>` : `<div class="wlab">${H(ex.text, ex.text.length > 4 ? 'md' : 'lg')}${ex.it ? ' ' + picH(ex.it, 'sm') : ''}</div>`;
    const free = ex.lvl === 3 || ex.lvl === 'copy', said = ex.it || (ex.text && ex.text.length <= 3 && /^[a-z']+$/.test(ex.text) && sylItem(ex.text));
    el.innerHTML = `<div class="card wcard">${free || ex.lvl === 2 ? label : ''}<div class="wbox"></div>
      <div class="wtools"><button class="wt" onclick="WR&&WR.demo()" aria-label="Show me">👀</button><button class="wt" onclick="WR&&WR.clear()" aria-label="Clear">↺</button>
      ${said ? `<button class="wt" onclick="X.wsay()">🔊</button>` : ''}${free ? `<button class="wt wchk" onclick="WR&&WR.check()">✓</button>` : ''}</div>
      <button class="skip wnext" style="display:none" onclick="exDone(true,false)">▶</button></div>`;
    WR = writer(el.querySelector('.wbox'), ex, ok => exDone(ok, ex.lvl === 3 ? true : false));
    if (said && !ex.st.said) { ex.st.said = 1; X.wsay(); }
  },
  lintro(ex, el) {
    const l = ex.l, kw = I(KEYW[l]), u = ex.u, vow = u.known.filter(isV), cons = u.known.filter(k => !isV(k));
    const syl = isV(l) ? cons.slice(-3).map(c => c + l) : vow.map(v => l + v);
    el.innerHTML = `<div class="card">${pen(kw || {})}<div class="wbox big"></div>
      ${kw ? `<button class="keyw" onclick="spk++;sayLuo(I('${kw.id}'))">${esc(kw.pic)} <span class="hand">${hiFirst(luoOf(kw), l)}</span></button>` : ''}
      <div class="syls">${[l].concat(syl).map(s => `<button class="syl" onclick="X.syl('${slug(s)}')">${H(s)}</button>`).join('')}</div>
      ${l.length > 1 ? `<div class="note c">${H(l.split('').join(' + '))} → ${H(l)}</div>` : ''}${canSyl() ? '' : '<div class="novoice">🎙️ ?</div>'}</div>${nextBtn('exDone(true,false)')}`;
    ex.wst = ex.wst || {}; WR = writer(el.querySelector('.wbox'), Object.assign(ex.wst, {text: l, lvl: 1, small: true}), introDone);
    if (kw) setTimeout(() => { if (cur() === ex && view === 'ses') { ++spk; sayLuo(kw); } }, 1800);
    if (canLuo(lsound(l))) { ++spk; sayLuo(lsound(l)); }
  },
  eintro(ex, el) {
    const it = ex.it;
    el.innerHTML = `<div class="card"><div class="erow"><div class="wbox half"></div><div class="wbox half"></div></div>
      <button class="keyw" onclick="X.elSay()">${esc(it.pic)} <span class="hand">${hiFirst(it.en, it.letter)}</span> 🔊</button></div>${nextBtn('exDone(true,false)')}`;
    const b = el.querySelectorAll('.wbox'); ex.w1 = ex.w1 || {}; ex.w2 = ex.w2 || {};
    writer(b[0], Object.assign(ex.w1, {text: it.letter.toUpperCase(), lvl: 1, small: true, noDemo: true}), () => {}); WR = writer(b[1], Object.assign(ex.w2, {text: it.letter, lvl: 1, small: true}), introDone);
    X.elSay();
  },
  ch(ex, el) {
    if (!ex.st) ex.st = {sel: -1};
    const st = ex.st, lock = st.sel >= 0, opts = ex.kind === 'first' ? ex.opts.map(o => ({v: o.id, h: picH(o)})) : ex.opts, good = lock && opts[st.sel].v === ex.ans;
    const prompt = ex.kind === 'first' ? `${H(ex.l, 'xl')}<button class="spk" onclick="X.chSay(0)">🔊</button>` : ex.prompt;
    el.innerHTML = `<div class="card prompt">${prompt}</div>
      <div class="opts pics n${opts.length}">${opts.map((o, i) => `<button class="opt ${lock ? (o.v === ex.ans ? 'good' : i === st.sel ? 'bad' : '') : ''}" onclick="X.ch(${i})">${o.h}${lock && ex.kind === 'first' ? `<span class="under hand">${hiFirst(luoOf(I(o.v)), ex.l)}</span>` : ''}</button>`).join('')}</div>
      ${lock && !good ? nextBtn('exDone(false)') : ''}`;
    if (!lock && ex.kind === 'first' && !st.said) { st.said = 1; X.chSay(0); }
  },
  find(ex, el) {
    if (!ex.st) ex.st = {hit: {}, bad: -1, miss: 0};
    const st = ex.st, need = ex.cells.filter(c => c === ex.l).length, got = Object.keys(st.hit).length;
    el.innerHTML = `<div class="card prompt">${H(ex.l, 'xl')}<div class="note c">${'●'.repeat(got)}${'○'.repeat(need - got)}</div></div>
      <div class="fgrid">${ex.cells.map((c, i) => `<button class="fc ${st.hit[i] ? 'good' : ''} ${st.bad === i ? 'bad shake' : ''}" onclick="X.find(${i})">${H(c)}</button>`).join('')}</div>`;
  },
  blend(ex, el) {
    if (!ex.st) ex.st = {v: null, n: 0};
    const st = ex.st;
    el.innerHTML = `<div class="card"><div class="blend ${st.v ? 'on' : ''}"><span class="bt1">${H(ex.c)}</span><span class="bt2">${H(st.v || '?')}</span></div>
      <div class="bres">${st.v ? H(ex.c + st.v, 'xl') : ''}</div>
      <div class="syls">${ex.vs.map(v => `<button class="syl" onclick="X.blend('${v}')">${H(v)}</button>`).join('')}</div></div>
      ${st.n >= Math.min(2, ex.vs.length) ? nextBtn('exDone(true,false)') : ''}`;
  },
  kb(ex, el) {
    const it = ex.it, target = LG(luoOf(it)); if (!ex.st) ex.st = {typed: [], miss: 0, bad: false, show: false};
    const st = ex.st, keys = ex.keys.filter((k, i, a) => a.indexOf(k) === i && k !== "'");
    el.innerHTML = `<div class="card prompt">${pen(it)}${picH(it, 'lg')}${canLuo(it) ? `<button class="spk" onclick="spk++;sayLuo(I2())">🔊</button>` : ''}</div>
      <div class="slots sp ${st.bad ? 'shake' : ''}">${st.show ? H(luoOf(it), 'ans') : target.map((g, i) => `<span class="slot ${st.typed[i] ? 'full' : ''}">${H(st.typed[i] || '')}</span>`).join('')}</div>
      <div class="kbd">${keys.map(k => `<button class="key" onclick="X.kb('${k.replace(/'/g, "\\'")}')">${H(k)}</button>`).join('')}<button class="key del" onclick="X.kbDel()">⌫</button></div>
      ${st.show ? nextBtn('exDone(false)') : ''}`;
  },
  tf(ex, el) {
    if (!ex.st) ex.st = {sel: null};
    const st = ex.st, lock = st.sel !== null, good = lock && st.sel === ex.truth;
    el.innerHTML = `<div class="card prompt"><div class="pic xl">${esc(ex.pic)}</div><div class="tfs">${H(ex.text, 'md')}</div>${lock ? `<button class="spk" onclick="X.tfSay()">🔊</button>` : ''}</div>
      <div class="opts pics n2"><button class="opt tfb ${lock && ex.truth ? 'good' : ''} ${lock && st.sel === true && !ex.truth ? 'bad' : ''}" onclick="X.tf(true)">✅</button>
      <button class="opt tfb ${lock && !ex.truth ? 'good' : ''} ${lock && st.sel === false && ex.truth ? 'bad' : ''}" onclick="X.tf(false)">❌</button></div>
      ${lock && !good ? nextBtn('exDone(false)') : ''}`;
  }
});
Object.assign(X, {
  wsay() { const ex = cur(); ++spk; const it = ex.it || sylItem(ex.text); if (!it) return; if (ex.it && ex.it.topic === 'cvc') sayEn(it); else if (canLuo(it)) sayLuo(it); else if (/[A-Z]/.test(ex.text)) tts(ex.text, 'en'); },
  chSay(i) { const ex = cur(); if (ex.kind === 'first') { ++spk; if (canLuo(lsound(ex.l))) sayLuo(lsound(ex.l)); } },
  ch(i) {
    const ex = cur(), st = ex.st; if (st.sel >= 0) return; st.sel = i; const opts = ex.kind === 'first' ? ex.opts.map(o => ({v: o.id})) : ex.opts, ok = opts[i].v === ex.ans, me = ses, at = ses.i;
    beep(ok); render(); ++spk;
    if (ex.kind === 'first') { const it = I(ex.ans); if (canLuo(it)) sayLuo(it); }
    else if (ex.kind === 'count') { const it = I(['', 'num_one', 'num_two', 'num_three', 'num_four', 'num_five', 'num_six', 'num_seven', 'num_eight', 'num_nine'][ex.num]) || I('num_zero'); if (it) sayBoth(it); }
    else if (ex.kind === 'name') tts(ex.ans.replace("'", ''), 'en');
    if (ok) ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(true); }, 1500);
  },
  find(i) {
    const ex = cur(), st = ex.st; if (st.hit[i]) return;
    if (ex.cells[i] === ex.l) { st.hit[i] = 1; st.bad = -1; beep(true); } else { st.bad = i; st.miss++; beep(false); }
    render();
    if (Object.keys(st.hit).length === ex.cells.filter(c => c === ex.l).length) { const me = ses, at = ses.i; ses.timer = setTimeout(() => { if (ses === me && ses.i === at) exDone(st.miss <= 1); }, 700); }
  },
  blend(v) { const ex = cur(), st = ex.st; st.v = v; st.n++; render(); const it = sylItem(ex.c + v); ++spk; if (it && canLuo(it)) setTimeout(() => sayLuo(it), 350); },
  kb(k) {
    const ex = cur(), st = ex.st, target = LG(luoOf(ex.it)); if (st.show || st.typed.length >= target.length) return; st.typed.push(k); st.bad = false;
    if (st.typed.length === target.length) {
      const ok = st.typed.join('') === target.join(''), me = ses, at = ses.i; beep(ok);
      if (ok) { render(); ++spk; if (canLuo(ex.it)) sayLuo(ex.it); ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(st.miss === 0); }, 1300); return; }
      st.miss++; st.bad = true; render();
      ses.timer = setTimeout(() => { if (ses !== me || ses.i !== at) return; let k2 = 0; while (k2 < target.length && st.typed[k2] === target[k2]) k2++; st.typed = st.typed.slice(0, k2); st.bad = false; if (st.miss >= 3) st.show = true; render(); }, 800);
      return;
    }
    render();
  },
  kbDel() { const st = cur().st; if (!st.show) { st.typed.pop(); render(); } },
  tfSay() { const ex = cur(); ++spk; if (ex.lang === 'en') tts(ex.text, 'en'); else if (S.set.sw && V.sw) tts(ex.text, 'sw'); },
  tf(v) { const ex = cur(), st = ex.st; if (st.sel !== null) return; st.sel = v; const ok = v === ex.truth, me = ses, at = ses.i; beep(ok); render();
    if (ex.lang === 'en') { ++spk; tts(ex.text, 'en'); }
    if (ok) ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(true); }, 1300); }
});
