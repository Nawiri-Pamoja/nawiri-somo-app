/* ================= LESSONS: what a lesson contains + every exercise type ================= */
const grp = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };
const usable = it => !!it && (dir() === 'en' || !!luoOf(it));
const spellText = (it, lang) => (lang === 'en' ? it.en : luoOf(it)).replace(/^to /, '');
const spellable = (it, lang) => /^[A-Za-z']{2,9}$/.test(spellText(it, lang));
const graphemes = (s, lang) => lang === 'en' ? s.split('') : (s.match(/ng'|ny|ch|dh|th|sh|[a-z']/gi) || []);
const pk = (it, mode, pool, n, la) => ({t: 'pick', it, mode, pool, n: n || 4, la: !!la});
const arrSpell = (it, lang) => ({t: 'arr', it, lang, spell: true});
const arrBuild = (it, pool) => ({t: 'arr', it, pool});
const buildable = it => { const n = tText(it).split(' ').length; return n >= 3 && n <= 9 && !!nText(it); };

function wordsSession(its) {
  const q = [], hasN = it => !!nText(it), L = dir();
  grp(its, 4).forEach(g => { g.forEach(it => q.push({t: 'meet', it}));
    shuffle(g).forEach(it => q.push(pk(it, it.picOk ? (canT(it) ? 'a>p' : 'p>t') : (hasN(it) ? 't>n' : 'a>t'), its))); });
  const m = its.filter(hasN); if (m.length >= 4) q.push({t: 'match', its: shuffle(m).slice(0, 4)});
  shuffle(its).forEach(it => q.push(pk(it, hasN(it) ? 'n>t' : (it.picOk ? 'p>t' : 'a>t'), its)));
  shuffle(its.filter(it => spellable(it, L))).slice(0, 4).forEach(it => q.push(arrSpell(it, L)));
  shuffle(its).slice(0, 2).forEach(it => q.push({t: 'say', it}));
  return q;
}
function listenSession(its) {
  const q = [];
  grp(its, 3).forEach(g => { g.forEach(it => q.push({t: 'meet', it, noText: true})); shuffle(g).forEach(it => q.push(pk(it, 'a>p', its, 2))); });
  shuffle(its).forEach(it => q.push(pk(it, 'a>p', its, 4)));
  shuffle(its).slice(0, 2).forEach(it => q.push({t: 'say', it, noText: true}));
  return q;
}
function phraseSession(its) {
  const q = [];
  grp(its, 4).forEach(g => { g.forEach(it => q.push({t: 'meet', it})); shuffle(g).forEach(it => q.push(pk(it, 't>n', its))); });
  shuffle(its).forEach(it => q.push(pk(it, 'n>t', its)));
  shuffle(its.filter(buildable)).slice(0, 4).forEach(it => q.push(arrBuild(it, its)));
  shuffle(its).slice(0, 2).forEach(it => q.push({t: 'say', it}));
  return q;
}
function sentSession(its, light) {
  const q = [];
  grp(its, 4).forEach(g => { if (!light) g.forEach(it => q.push({t: 'meet', it})); shuffle(g).forEach(it => q.push(buildable(it) ? arrBuild(it, its) : pk(it, 't>n', its))); });
  shuffle(its).slice(0, light ? 4 : 6).forEach(it => q.push(pk(it, 'n>t', its)));
  return q;
}
function genPat(p) { return shuffle(GEN[p.id].map(I).filter(usable)).slice(0, 8); }
function genDo() { const vs = shuffle(DOING).slice(0, 4).map(v => slug(v[0])); return shuffle(GEN.do.map(I).filter(it => vs.some(v => it.id.startsWith('do_' + v + '_')) && usable(it))).slice(0, 12); }
function sessionFor(u) {
  const its = u.ids.map(I).filter(usable);
  switch (u.kind) {
    case 'L': return listenSession(its);
    case 'PW': return pwSession(u);
    case 'LT': return letterSession(u);
    case 'LR': return reviewLit(u);
    case 'CAP': return capSession(u);
    case 'NUM': return numSession(u);
    case 'FL': return fluencySession(u);
    case 'BK': return bookSession(u);
    case 'EL': return engLetterSession(u);
    case 'CVC': return cvcSession(u);
    case 'SW': return swSession(u);
    case 'W': return wordsSession(its);
    case 'P': return phraseSession(its);
    case 'S': return sentSession(its);
    case 'PAT': { const g = genPat(u.pat); return g.slice(0, 2).map(it => ({t: 'meet', it})).concat(sentSession(g, true)); }
    case 'DO': { const g = genDo(); return g.slice(0, 3).map(it => ({t: 'meet', it})).concat(shuffle(g).map(it => pk(it, 't>n', g)), sentSession(g, true)); }
    case 'T': return shuffle(its.filter(it => /^[A-Za-z' ()-]+$/.test(tText(it)))).slice(0, 10).map(it => ({t: 'type', it}));
    case 'D': return shuffle(its).slice(0, 5).map(it => pk(it, 't>n', its)).concat(shuffle(its.filter(buildable)).slice(0, 3).map(it => arrBuild(it, its)));
    case 'ST': return u.story.qs.map(x => ({t: 'q', q: x.q, a: x.a, opts: x.opts, sayIt: I(x.say)})).concat(shuffle(its.filter(buildable)).slice(0, 4).map(it => arrBuild(it, its)));
  }
  return [];
}
function reviewSession(p) {
  const due = shuffle(dueItems(p).filter(usable)), lts = due.filter(it => it.kind === 'lt').slice(0, 4);
  return shuffle(lts.concat(due.filter(it => it.kind !== 'lt').slice(0, 12 - lts.length))).map(it => {
    if (it.kind === 'lt') { const l = it.luo, known = LIT_SEQ.slice(0, LIT_SEQ.indexOf(l) + 1), r = Math.random(), f = firstSound(l, 1)[0];
      if (r < .35) return Object.assign(findEx(l, known), {lt: it.id});
      if (r < .65 && f) return Object.assign(f, {lt: it.id});
      return W(l, 3, {lt: it.id}); }
    const pool = (TOPICS[it.topic] ? TOPICS[it.topic].ids.map(I) : KIND[it.kind] || []).filter(usable);
    if (it.kind === 'w') { const c = ['n>t', 'a>t']; if (it.picOk) c.push('p>t', 'a>p'); if (spellable(it, dir())) c.push('sp'); const m = c[Math.floor(Math.random() * c.length)];
      if (!nText(it) && m === 'n>t') return pk(it, 'p>t', pool); return m === 'sp' ? arrSpell(it, dir()) : pk(it, m, pool); }
    if (it.kind === 'abc') return pk(it, 'p>t', KIND.abc);
    return buildable(it) && Math.random() < .5 ? arrBuild(it, pool) : pk(it, 'n>t', pool);
  });
}

/* ---------- runner ---------- */
let ses = null;
function startSession(u, q) {
  stopSound(); if (!q.length) { toast('Nothing to practise here yet'); return; }
  ses = {u, q, i: 0, right: 0, graded: 0, miss: {}, seen: {}}; go('ses');
}
function exDone(ok, graded) {
  const ex = ses.q[ses.i]; clearTimeout(ses.timer);
  if (ex.it) ses.seen[ex.it.id] = ex.it;
  if (ex.lt && I(ex.lt)) { ses.seen[ex.lt] = I(ex.lt); if (graded !== false && !ok) ses.miss[ex.lt] = 1; }
  if (ses.chk && ex.part && graded !== false) { const r = ses.chk[ex.part] = ses.chk[ex.part] || {ok: 0, n: 0}; r.n++; if (ok) r.ok++; }
  if (graded !== false) { ses.graded++; if (ok) ses.right++; else { if (ex.it) ses.miss[ex.it.id] = 1; if (!ex.re && !ses.chk) ses.q.push(Object.assign({}, ex, {re: true, st: null})); } }
  ses.i++; stopSound();
  if (ses.chk && ses.partEnd && Date.now() > ses.partEnd) skipPart();
  if (ses.i >= ses.q.length) (ses.chk ? finishCheck() : finishSession()); else render();
}
function finishSession() {
  const p = P(), acc = ses.graded ? ses.right / ses.graded : 1, stars = acc >= .9 ? 3 : acc >= .7 ? 2 : 1;
  Object.values(ses.seen).forEach(it => grade(it, !ses.miss[it.id]));
  const gain = ses.right + 5; p.seeds = (p.seeds || 0) + gain;
  const old = ses.u && ses.u.id ? (p.stars[ses.u.id] || 0) : 0;
  if (ses.u && ses.u.id) { p.stars[ses.u.id] = Math.max(old, stars); p.tries = p.tries || {}; p.tries[ses.u.id] = (p.tries[ses.u.id] || 0) + 1; }
  touchDay(p); p.best = Math.max(p.best || 0, p.streak || 0); save();
  ses.res = {stars, gain, first: !old}; beep(true); go('res');
}
function quitSession() { stopSound(); cancelSayRec(); ses = null; go('home'); }

const HINT = {book: '📖', part: '⏱️', meet: '👀 👂', pick: '👆', arr: '🧩', match: '🔗', say: '🎙️', lintro: '🔤 👂', eintro: '🔤 👂', write: '✍️', type: '⌨️', q: '❓', ch: '👆', find: '🔍', blend: '🔗', kb: '⌨️', tf: '✅ ❌'};
function sesView(app) {
  const ex = ses.q[ses.i];
  app.innerHTML = `<div class="sx"><div class="sxtop"><button class="x" onclick="quitSession()" aria-label="Stop">✕</button>
    <div class="bar">${ses.chk && ses.partEnd ? `<i class="tick" style="animation-duration:${Math.max(0, (ses.partEnd - Date.now()) / 1000)}s"></i>` : `<i style="width:${Math.round(100 * ses.i / ses.q.length)}%"></i>`}</div><span class="hint">${tone(HINT[ex.t] || '')}</span></div>
    <div id="exb" class="exb"></div></div>`;
  EX[ex.t](ex, $('exb'));
}
const picH = (it, cls) => `<div class="pic ${cls || ''} ${[...it.pic].length > 2 && /^[\w½=']+$/.test(it.pic) ? 'txt' : ''}">${esc(it.pic)}</div>`;
const pen = it => helper && ITEMS[it.id] ? `<button class="pen" onclick="openEdit('${it.id}')" aria-label="Correct">✎</button>` : '';
const nextBtn = (fn, lab) => `<button class="go" onclick="${fn}" aria-label="Next">${lab || '▶'}</button>`;
function val(it, k) { return k === 'p' ? it.pic : k === 't' ? tText(it) : k === 'n' ? nText(it) : k === 'l' ? it.letter : k === 'a' ? tText(it) : k === 'la' ? luoOf(it) : ''; }
function resolveMode(ex) {
  let [a, b] = ex.mode.split('>'); const it = ex.it, n = !!nText(it);
  if (a === 'a' && !canT(it)) a = 't';
  if (a === 'la' && !canLuo(it)) a = 'n';
  if (b === 'p' && !it.picOk) b = n && a !== 'n' ? 'n' : 't';
  if (b === 'n' && !n) b = 't';
  if (a === 'n' && !n) a = it.picOk && b !== 'p' ? 'p' : 't';
  if (a === b) a = a === 't' ? (it.picOk ? 'p' : n ? 'n' : 't') : (it.picOk ? 'p' : 't');
  return [a, b];
}
function options(it, a, b, pool, n) {
  const v0 = val(it, b), p0 = val(it, a), seen = new Set([v0]), out = [it];
  const all = (TOPICS[it.topic] ? TOPICS[it.topic].ids.map(I) : []).concat(KIND[it.kind] || []);
  for (const x of shuffle((pool || []).filter(usable)).concat(shuffle(all.filter(usable)))) {
    if (out.length >= n) break; const v = val(x, b);
    if (!v || seen.has(v) || x.id === it.id || val(x, a) === p0 || (b === 'p' && !x.picOk)) continue;
    seen.add(v); out.push(x);
  }
  return shuffle(out);
}
function sayPrompt(ex) {
  const it = ex.it, a = ex.st.a;
  if (ex.mode === 'a>l') return sayAbc(it);
  if (a === 'la') { ++spk; return sayLuo(it); }
  return sayT(it);
}
const EX = {
  meet(ex, el) {
    const it = ex.it, both = dir() === 'en' && (ex.noText || ex.read), big = ex.read ? luoOf(it) : tText(it), small = ex.read ? it.en : nText(it);
    el.innerHTML = `<div class="card">${pen(it)}${picH(it, 'xl')}
      ${ex.noText ? '' : `<div class="tt">${esc(big)}</div><div class="nt">${esc(small)}</div>`}
      <div class="spk2">${dir() === 'en' && canLuo(it) ? `<button class="spk luo-b" onclick="spk++;sayLuo(I2())">🔊<small>Dholuo</small></button>` : ''}
        ${canEn(it) ? `<button class="spk" onclick="spk++;sayEn(I2())">🔊<small>English</small></button>` : ''}
        ${dir() === 'luo' && canLuo(it) ? `<button class="spk luo-b" onclick="spk++;sayLuo(I2())">🔊<small>Dholuo</small></button>` : ''}</div>
      </div>${nextBtn('exDone(true,false)')}`;
    if (both) sayBoth(it); else sayT(it);
  },
  pick(ex, el) {
    if (!ex.st) { const [a, b] = resolveMode(ex); ex.st = {a, b, opts: options(ex.it, a, b, ex.pool, ex.n), sel: -1}; }
    const st = ex.st, it = ex.it, lock = st.sel >= 0, good = lock && val(st.opts[st.sel], st.b) === val(it, st.b);
    const prompt = st.a === 'a' || st.a === 'la' ? `<button class="bigspk" onclick="sayPrompt(cur())">🔊</button>` :
      st.a === 'p' ? picH(it, 'xl') : st.a === 'l' ? `<div class="glyph">${esc(it.letter)}</div>` :
      `${it.picOk && st.b !== 'p' && it.kind === 'w' ? picH(it, 'md') : ''}<div class="${st.a === 't' ? 'tt' : 'nt big'}">${esc(val(it, st.a))}</div>${st.a === 't' && canT(it) && (!ex.silent || lock) ? `<button class="spk" onclick="sayT(I2())">🔊</button>` : ''}`;
    el.innerHTML = `<div class="card prompt">${pen(it)}${prompt}</div>
      <div class="opts ${st.b === 'p' || st.b === 'l' ? 'pics' : ''} n${st.opts.length}">${st.opts.map((o, i) => {
        let c = 'opt'; if (lock) { if (val(o, st.b) === val(it, st.b)) c += ' good'; else if (i === st.sel) c += ' bad'; }
        return `<button class="${c}" onclick="X.pick(${i})">${st.b === 'p' ? picH(o) : st.b === 'l' ? `<span class="lt">${esc(o.letter)}</span>` : esc(val(o, st.b))}</button>`; }).join('')}</div>
      ${lock ? `<div class="fb ${good ? 'ok' : 'no'}">${it.picOk ? esc(it.pic) + ' ' : ''}<b>${esc(it.letter ? it.letter.toUpperCase() + ' · ' + it.en : tText(it) || luoOf(it))}</b>${nText(it) && tText(it) && !it.letter ? ' = ' + esc(nText(it)) : ''}</div>` : ''}
      ${lock && !good ? nextBtn('exDone(false)') : ''}`;
    if (!lock && !ex.silent && (st.a === 'a' || st.a === 'la' || st.a === 't')) sayPrompt(ex);
  },
  q(ex, el) {
    if (!ex.st) ex.st = {opts: shuffle(ex.opts), sel: -1};
    const st = ex.st, lock = st.sel >= 0, good = lock && st.opts[st.sel] === ex.a;
    el.innerHTML = `<div class="card prompt"><div class="tt">${esc(ex.q)}</div><button class="spk" onclick="spk++;sayEn(cur().sayIt,cur().q)">🔊</button></div>
      <div class="opts">${st.opts.map((o, i) => `<button class="opt ${lock ? (o === ex.a ? 'good' : i === st.sel ? 'bad' : '') : ''}" onclick="X.q(${i})">${esc(o)}</button>`).join('')}</div>
      ${lock && !good ? nextBtn('exDone(false)') : ''}`;
  },
  arr(ex, el) {
    const it = ex.it, lang = ex.lang || dir();
    if (!ex.st) {
      const target = ex.spell ? spellText(it, lang) : tText(it), parts = ex.parts || (ex.spell ? (lang === 'luo' ? LG(target) : graphemes(target.toLowerCase(), lang)) : target.split(' '));
      let extra = [];
      if (ex.extra === 'syl') extra = shuffle(KIND.syl.map(x => x.luo).filter(x => !parts.includes(x) && LG(x).every(g => !ex.known || ex.known.includes(g)) && LG(x).some(g => LG(parts.join('')).includes(g)))).slice(0, 2);
      else if (ex.spell) extra = shuffle((ex.known || 'aeioumnrtklsd'.split('')).filter(c => !parts.includes(c))).slice(0, 2);
      else extra = shuffle([].concat(...(ex.pool || []).filter(x => x.id !== it.id).map(x => tText(x).split(' '))).filter(w => !parts.includes(w))).filter((w, i, a) => a.indexOf(w) === i).slice(0, 2);
      ex.st = {parts, tiles: shuffle(parts.concat(extra)), sel: [], miss: 0, show: false, bad: false};
    }
    const st = ex.st, j = ex.spell ? '' : ' ';
    const prompt = ex.spell ? `${picH(it, 'lg')}${lang === 'en' && nText(it) && dir() === 'en' ? `<div class="nt big">${esc(nText(it))}</div>` : ''}${lang === 'luo' && dir() === 'luo' ? `<div class="nt big">${esc(it.en)}</div>` : ''}`
      : `${it.picOk ? picH(it, 'md') : ''}<div class="nt big">${esc(nText(it))}</div>`;
    el.innerHTML = `<div class="card prompt">${pen(it)}${prompt}${(lang === 'en' ? canEn(it) : canLuo(it)) && ex.spell ? `<button class="spk" onclick="X.arrSay()">🔊</button>` : ''}</div>
      <div class="slots ${ex.spell ? 'sp' : ''} ${st.bad ? 'shake' : ''}">${st.show ? `<span class="ans">${esc(st.parts.join(j))}</span>` : st.sel.map((k, n) => `<button class="tile on" onclick="X.arrOut(${n})">${esc(st.tiles[k])}</button>`).join('') || '<span class="ph">…</span>'}</div>
      <div class="tiles ${ex.spell ? 'sp' : ''}">${st.tiles.map((t, k) => `<button class="tile ${st.sel.includes(k) ? 'used' : ''}" onclick="X.arrIn(${k})">${esc(t)}</button>`).join('')}</div>
      ${st.show ? nextBtn('exDone(false)') : ''}`;
    if (ex.spell && !st.sel.length && !st.said) { st.said = 1; X.arrSay(); }
  },
  match(ex, el) {
    if (!ex.st) ex.st = {L: shuffle(ex.its), R: shuffle(ex.its), a: -1, done: {}, miss: 0, bad: -1};
    const st = ex.st;
    el.innerHTML = `<div class="match"><div>${st.L.map((it, i) => `<button class="opt ${st.done[it.id] ? 'good' : ''} ${st.a === i ? 'sel' : ''}" onclick="X.mL(${i})">${it.picOk ? esc(it.pic) + ' ' : ''}${esc(tText(it))}</button>`).join('')}</div>
      <div>${st.R.map((it, i) => `<button class="opt luo ${st.done[it.id] ? 'good' : ''} ${st.bad === i ? 'bad' : ''}" onclick="X.mR(${i})">${esc(nText(it))}</button>`).join('')}</div></div>`;
  },
  say(ex, el) {
    const it = ex.it; ex.st = ex.st || {state: 'idle'};
    const st = ex.st, mic = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    el.innerHTML = `<div class="card">${picH(it, 'lg')}${ex.noText ? '' : `<div class="tt">${esc(tText(it))}</div><div class="nt">${esc(nText(it))}</div>`}
      <div class="sayrow"><button class="bigspk sm" onclick="sayT(I2())">🔊</button>
      ${mic ? `<button class="bigspk sm rec ${st.state === 'rec' ? 'on' : ''}" onclick="X.sayRec()">${st.state === 'rec' ? '⏹' : '🎙️'}</button>` : ''}
      ${st.blob ? `<button class="bigspk sm mine" onclick="playBlob(cur().st.blob)">▶</button>` : ''}</div></div>${nextBtn('X.sayNext()', '✓')}`;
    if (st.state === 'idle' && !st.said) { st.said = 1; sayT(it); }
  },
  type(ex, el) {
    const it = ex.it; ex.st = ex.st || {miss: 0, show: false};
    el.innerHTML = `<div class="card prompt">${picH(it, 'lg')}<div class="nt big">${esc(nText(it) || '')}</div><button class="spk" onclick="sayT(I2())">🔊</button>
      ${ex.st.show ? `<div class="tt">${esc(tText(it))}</div>` : ''}</div>
      <input id="tin" class="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="⌨️" onkeydown="if(event.key==='Enter')X.type()">
      ${nextBtn('X.type()', '✓')}`;
    const i = $('tin'); try { i.focus(); } catch (e) {}
    if (!ex.st.said) { ex.st.said = 1; sayT(it); }
  }
};
const cur = () => ses.q[ses.i];
const I2 = () => cur().it;
const norm = s => s.toLowerCase().replace(/\([^)]*\)/g, '').replace(/^to /, '').replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const X = {
  pick(i) {
    const ex = cur(), st = ex.st; if (st.sel >= 0) return; st.sel = i;
    const ok = val(st.opts[i], st.b) === val(ex.it, st.b), me = ses, at = ses.i; beep(ok); render();
    if (ex.mode === 'a>l') sayPrompt(ex); else if ((st.a === 'la' || ex.la) && canLuo(ex.it)) { ++spk; sayLuo(ex.it); } else if (ex.it.en) sayT(ex.it);
    if (ok || ses.chk) ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(ok); }, ok ? 1500 : 900);
  },
  q(i) { const ex = cur(), st = ex.st; if (st.sel >= 0) return; st.sel = i; const ok = st.opts[i] === ex.a, me = ses, at = ses.i; beep(ok); render();
    if (ok) ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(true); }, 1100); },
  arrSay() { const ex = cur(); ++spk; if ((ex.lang || dir()) === 'en') sayEn(ex.it); else sayLuo(ex.it); },
  arrIn(k) {
    const ex = cur(), st = ex.st; if (st.show || st.sel.includes(k) || st.sel.length >= st.parts.length) return; st.sel.push(k); st.bad = false;
    if (st.sel.length === st.parts.length) {
      const j = ex.spell ? '' : ' ', ok = st.sel.map(x => st.tiles[x]).join(j) === st.parts.join(j), me = ses, at = ses.i;
      beep(ok);
      if (ok) { render(); X.arrSay(); ses.timer = setTimeout(() => { if (ses === me && ses.i === at && view === 'ses') exDone(st.miss === 0); }, 1400); return; }
      st.miss++; st.bad = true; render();
      ses.timer = setTimeout(() => { if (ses !== me || ses.i !== at) return; st.sel = []; st.bad = false; if (st.miss >= 2) { st.show = true; X.arrSay(); } render(); }, 800); return;
    }
    render();
  },
  arrOut(n) { const st = cur().st; if (st.show || st.sel.length === st.parts.length) return; st.sel.splice(n, 1); render(); },
  mL(i) { const st = cur().st; if (st.done[st.L[i].id]) return; st.a = i; st.bad = -1; sayT(st.L[i]); render(); },
  mR(i) {
    const st = cur().st; if (st.a < 0 || st.done[st.R[i].id]) return;
    if (st.R[i].id === st.L[st.a].id || nText(st.R[i]) === nText(st.L[st.a])) { st.done[st.L[st.a].id] = 1; st.done[st.R[i].id] = 1; st.a = -1; beep(true); } else { st.miss++; st.bad = i; beep(false); }
    render();
    if (st.L.every(x => st.done[x.id])) { const me = ses, at = ses.i; ses.timer = setTimeout(() => { if (ses === me && ses.i === at) exDone(st.miss === 0); }, 700); }
  },
  async sayRec() {
    const ex = cur(), st = ex.st;
    if (st.state === 'rec') { try { sayMR.stop(); } catch (e) {} return; }
    stopSound();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true}), mr = new MediaRecorder(stream), chunks = [];
      sayMR = mr; mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); if (sayMR !== mr) return; sayMR = null; st.state = 'idle'; st.blob = new Blob(chunks, {type: mr.mimeType || 'audio/webm'});
        const p = P(); if (p) { p.said = (p.said || 0) + 1; save(); } if (view === 'ses' && cur() === ex) { render(); playBlob(st.blob); } };
      st.state = 'rec'; mr.start(); setTimeout(() => { try { if (mr.state === 'recording') mr.stop(); } catch (e) {} }, 8000); render();
    } catch (e) { toast('🎙️ ✗'); }
  },
  sayNext() { cancelSayRec(); exDone(true, false); },
  syl(s) { const it = I('syl_' + s); ++spk; if (canLuo(it)) sayLuo(it); else toast('🎙️ No Dholuo voice yet – helpers can record it'); },
  elSay() { sayAbc(cur().it); },
  type() {
    const ex = cur(), st = ex.st, i = $('tin'); if (!i) return;
    if (st.show) return exDone(false);
    const ok = norm(i.value) === norm(tText(ex.it)); beep(ok);
    if (ok) return exDone(st.miss === 0);
    st.miss++; if (st.miss >= 2) { st.show = true; render(); } else { i.classList.add('shake'); setTimeout(() => i.classList.remove('shake'), 500); }
  }
};
let sayMR = null;
function cancelSayRec() { const m = sayMR; sayMR = null; try { if (m && m.state === 'recording') m.stop(); } catch (e) {} }

