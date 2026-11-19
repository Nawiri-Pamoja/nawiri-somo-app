/* ================= SCREENS ================= */
let view = 'who', ctx = {}, deferredInstall = null;
function go(v, c) { stopSound(); cancelRec(); cancelSayRec(); view = v; ctx = c || {}; render(); window.scrollTo(0, 0); }
const VIEWS = {};
function render() {
  const p = P(), full = view === 'ses' || view === 'duel';
  document.body.className = full ? 'full' : '';
  $('hstat').innerHTML = p && !full ? `<span>🔥${p.streak && p.last >= dayN() - 1 ? p.streak : 0}</span><span>${plantOf(p.seeds || 0)[1]} ${p.seeds || 0}</span><button onclick="go('me')" class="hav">${p.av}</button>` : '';
  $('nav').innerHTML = p && ['home', 'games', 'dict', 'me'].includes(view) ? [['home', '🛤️', 'Path', 'Yo'], ['games', '🎲', 'Play', 'Tugo'], ['dict', '📖', 'Words', 'Weche'], ['me', p.av, 'Me', 'An']]
    .map(n => `<button class="${view === n[0] ? 'on' : ''}" onclick="go('${n[0]}')"><span>${n[1]}</span>${TT(n[2], n[3])}</button>`).join('') : '';
  $('nav').style.display = $('nav').innerHTML ? 'flex' : 'none';
  (VIEWS[view] || VIEWS.who)($('app'));
}
VIEWS.ses = app => sesView(app);

/* ---------- who is learning? ---------- */
const AVS = ['🦁', '🐘', '🦛', '🐊', '🐒', '🐇', '🐢', '🦒', '🦓', '🐟', '🐦', '🐝', '🐸', '🦆', '🐐', '🐄'];
VIEWS.who = app => {
  const sum = S.profiles.reduce((a, p) => a + (p.seeds || 0), 0), trees = Math.min(12, Math.floor(sum / 150));
  app.innerHTML = `<img class="logo-lg" src="${LOGO}" alt=""><h2 class="c">Nawiri Pamoja</h2>
    <div class="avs">${S.profiles.map(p => `<button class="av" onclick="pickP('${p.id}')"><span>${p.av}</span>${esc(p.name || '')}<small>${plantOf(p.seeds || 0)[1]} ${p.seeds || 0}</small></button>`).join('')}
      <button class="av new" onclick="go('newp',{step:1})"><span>+</span></button></div>
    ${S.profiles.length ? `<div class="village"><b>Pamoja</b> · ${'🌳'.repeat(trees) || '🌱'} · ${sum}</div>` : ''}
    <button class="small-link" onclick="helperGate()">✎ Helpers / Jokony</button>`;
};
function pickP(id) { S.cur = id; save(); go('home'); }
VIEWS.newp = app => {
  if (ctx.step === 1) { app.innerHTML = `<h2 class="c">👋</h2><div class="avs">${AVS.filter(a => !S.profiles.some(p => p.av === a)).map(a => `<button class="av" onclick="ctx.av='${a}';ctx.step=2;render()"><span>${a}</span></button>`).join('')}</div>
    <button class="small-link" onclick="go('who')">‹</button>`; return; }
  app.innerHTML = `<h2 class="c"><span style="font-size:64px">${ctx.av}</span></h2>
    <input id="pname" maxlength="16" placeholder="Nyingi / name (not needed)" value="${esc(ctx.name || '')}" oninput="ctx.name=this.value">
    <div class="starts">
      <button onclick="mkP('en','A')"><span>🐣</span><b>Achako</b><small>I am new. Listen, then learn to read.</small></button>
      <button onclick="mkP('en','C')"><span>📖</span><b>Anyalo somo</b><small>I can read. Start with words.</small></button>
      <button onclick="mkP('luo','C')"><span>🔁</span><b>I speak English</b><small>I want to learn Dholuo.</small></button>
    </div><button class="small-link" onclick="ctx.step=1;render()">‹</button>`;
};
function mkP(d, start) {
  const p = {id: 'p' + Date.now().toString(36), av: ctx.av, name: (ctx.name || '').trim().slice(0, 16), dir: d, start, seeds: 0, stars: {}, prog: {}, streak: 0};
  S.profiles.push(p); S.cur = p.id; save(); go('home');
}

/* ---------- the path ---------- */
function ownUnit() { const ids = TOPICS.own.ids; return ids.length ? {id: 'H_own', stage: 'H', kind: 'W', e: '⭐', en: 'Our own words', luo: 'Wechewa', ids, idx: -1} : null; }
VIEWS.home = app => {
  const p = P(); if (!p) return go('who');
  const fr = frontier(p), sts = stagesFor(p), stage = ctx.stage || PATH[fr].stage, st = sts.find(s => s.id === stage) || sts[0];
  let units = PATH.filter(u => u.stage === st.id); const own = st.id === 'H' && ownUnit(); if (own) units = [own].concat(units);
  const due = dueItems(p).length, td = p.last === dayN() ? (p.today || 0) : 0;
  app.innerHTML = `<div class="stages">${sts.map(s => { const us = PATH.filter(u => u.stage === s.id), d = us.filter(u => p.stars[u.id]).length;
      return `<button class="${s.id === st.id ? 'on' : ''}" onclick="go('home',{stage:'${s.id}'})"><span>${s.e}</span><small>${d}/${us.length}</small></button>`; }).join('')}</div>
    <div class="sthead"><h2>${st.e} ${TT(st.en, st.luo)}</h2>
      <div class="day">☀️ ${[0, 1, 2].map(i => `<i class="${td > i ? 'on' : ''}"></i>`).join('')}${due ? `<button class="due" onclick="startReview()">🔁 ${due}</button>` : ''}</div></div>
    <div class="path">${units.map((u, n) => { const open = u.idx < 0 || unlocked(p, u), s = p.stars[u.id] || 0, now = u.idx === fr;
      return `<button class="node z${n % 4} ${open ? '' : 'lock'} ${s ? 'done' : ''} ${now ? 'now' : ''}" ${open ? `onclick="openUnit('${u.id}')"` : 'disabled'} ${now ? 'id="nownode"' : ''}>
        <span class="ne ${/^[A-Za-z'0-9]+$/.test(u.e) ? 'txt' : ''}">${open ? esc(u.e) : '🔒'}</span><span class="nl">${TT(u.en, u.luo)}</span><span class="ns">${'⭐'.repeat(s)}${'☆'.repeat(3 - s)}</span></button>`; }).join('')}</div>`;
  const n = $('nownode'); if (n && !ctx.stage) setTimeout(() => { try { n.scrollIntoView({block: 'center'}); } catch (e) {} }, 50);
};
function openUnit(id) {
  const u = id === 'H_own' ? ownUnit() : PATH.find(x => x.id === id); if (!u) return;
  if (u.kind === 'D') return go('dlg', {u, n: 1}); if (u.kind === 'ST') return go('story', {u, tr: false});
  startSession(u, sessionFor(u));
}
function startReview() { const p = P(), q = reviewSession(p); startSession({id: null, en: 'Review'}, q); }
VIEWS.res = app => {
  const r = ses.res, p = P(), pl = plantOf(p.seeds);
  app.innerHTML = `<div class="card res"><div class="stars">${'⭐'.repeat(r.stars)}<span class="off">${'⭐'.repeat(3 - r.stars)}</span></div>
    <div class="tt">${dir() === 'en' ? 'Ber ahinya!' : 'Well done!'}</div><div class="gain">+${r.gain} 🌱</div><div class="plant">${pl[1]}</div>
    <div class="nt">${p.seeds} 🌱 · 🔥 ${p.streak}</div></div>
    <div class="row2"><button class="go alt" onclick="${ses.u && ses.u.id ? `openUnit('${ses.u.id}')` : 'startReview()'}">↻</button><button class="go" onclick="go('home')">▶</button></div>`;
};

/* ---------- dialogue + story ---------- */
VIEWS.dlg = app => {
  const u = ctx.u, its = u.ids.map(I), n = Math.min(ctx.n, its.length);
  app.innerHTML = `<h2>${u.e} ${TT(u.en, u.luo)}</h2><div class="chat">${its.slice(0, n).map(it => `<div class="b ${it.who === 'a' ? 'app' : 'me'}" onclick="sayT(I('${it.id}'))"><div class="bt"><span class="tt2">${esc(tText(it))}</span><span class="nt2">${esc(nText(it))}</span></div><span>🔊</span></div>`).join('')}</div>
    ${n < its.length ? nextBtn('ctx.n++;render()') : nextBtn(`startSession(ctx.u,sessionFor(ctx.u))`, '✓ ▶')}`;
  sayT(its[n - 1]); window.scrollTo(0, document.body.scrollHeight);
};
VIEWS.story = app => {
  const u = ctx.u, its = u.ids.map(I);
  app.innerHTML = `<h2>${u.e} ${TT(u.en, u.luo)}</h2><div class="chips"><button class="chip ${ctx.tr ? 'on' : ''}" onclick="ctx.tr=!ctx.tr;render()">👁 ${dir() === 'en' ? 'Dholuo' : 'English'}</button></div>
    <div class="story">${its.map(it => `<button onclick="sayT(I('${it.id}'))"><span class="tt2">${esc(tText(it))}</span>${ctx.tr ? `<span class="nt2">${esc(nText(it))}</span>` : ''}</button>`).join('')}</div>
    ${nextBtn(`startSession(ctx.u,sessionFor(ctx.u))`, '❓ ▶')}`;
};

/* ---------- games ---------- */
function gamePool() {
  const p = P(); let its = Object.keys(p.prog).map(I).filter(it => it && it.kind === 'w' && luoOf(it) && it.en.length < 16);
  if (its.length < 8) its = its.concat(TOPICS.ani.ids.slice(0, 12).map(I)).filter((x, i, a) => a.indexOf(x) === i);
  return its;
}
VIEWS.games = app => {
  const p = P(), due = dueItems(p).length;
  app.innerHTML = `<div class="grid">
    <button class="tile" onclick="startReview()"><span class="e">🔁</span>${TT('Review', 'Nwo')}<small>${due}</small></button>
    <button class="tile" onclick="go('memory',{})"><span class="e">🧩</span>${TT('Memory', 'Par')}</button>
    <button class="tile" onclick="go('duel',{})"><span class="e">🤝</span>${TT('Two players', 'Ji ariyo')}</button>
    <button class="tile" onclick="go('list',{k:'D'})"><span class="e">💬</span>${TT('Dialogues', 'Wuoyo')}</button>
    <button class="tile" onclick="go('list',{k:'ST'})"><span class="e">📚</span>${TT('Stories', 'Sigendini')}</button>
    <button class="tile" onclick="go('list',{k:'T'})"><span class="e">⌨️</span>${TT('Typing', 'Ndiko')}</button></div>`;
};
VIEWS.list = app => { app.innerHTML = `<div class="grid">${PATH.filter(u => u.kind === ctx.k).map(u => `<button class="tile" onclick="openUnit('${u.id}')"><span class="e">${u.e}</span>${TT(u.en, u.luo)}<small>${'⭐'.repeat(P().stars[u.id] || 0)}</small></button>`).join('')}</div>`; };
VIEWS.memory = app => {
  if (!ctx.cards) { const cards = []; shuffle(gamePool()).slice(0, 6).forEach(w => { cards.push({id: w.id, t: 'a', w}); cards.push({id: w.id, t: 'b', w}); }); ctx.cards = shuffle(cards); ctx.up = []; ctx.matched = new Set(); ctx.moves = 0; }
  const won = ctx.matched.size === ctx.cards.length / 2;
  app.innerHTML = `<div class="mem">${ctx.cards.map((c, i) => { const m = ctx.matched.has(c.id), up = m || ctx.up.includes(i);
    return up ? `<div class="mc up ${m ? 'done' : ''}">${c.t === 'a' ? `<span class="mce">${esc(c.w.pic)}</span>${esc(luoOf(c.w))}` : esc(c.w.en)}</div>` : `<button class="mc" onclick="flip(${i})">?</button>`; }).join('')}</div>
    ${won ? `<div class="card"><div class="pic lg">🎉</div><div class="row2"><button class="go alt" onclick="go('memory',{})">↻</button><button class="go" onclick="go('games')">▶</button></div></div>` : ''}`;
};
function flip(i) {
  if (ctx.up.length >= 2 || ctx.up.includes(i)) return; ctx.up.push(i); const me = ctx;
  if (ctx.up.length === 2) { ctx.moves++; const [a, b] = ctx.up.map(k => ctx.cards[k]), ok = a.id === b.id;
    if (ok) { ctx.matched.add(a.id); ctx.up = []; beep(true); ++spk; sayEn(a.w); if (ctx.matched.size === ctx.cards.length / 2) { const p = P(); p.seeds += 5; save(); } }
    else { beep(false); setTimeout(() => { if (ctx === me && view === 'memory') { ctx.up = []; render(); } }, 1100); } }
  render();
}
VIEWS.duel = app => {
  if (!ctx.pool) { ctx.pool = gamePool(); ctx.score = [0, 0]; duelNext(); }
  const it = ctx.it, win = ctx.score.findIndex(s => s >= 5);
  const side = k => `<div class="dside ${k ? 'flip' : ''}"><div class="dsc">${'⭐'.repeat(ctx.score[k])}</div>
    ${win >= 0 ? `<div class="pic xl">${win === k ? '🏆' : '👏'}</div>` : `<div class="dq">${picH(it, 'md')}<b>${esc(nText(it))}</b></div>
    <div class="opts n4">${ctx.opts.map((o, i) => `<button class="opt ${ctx.lock[k] ? 'dim' : ''} ${ctx.won !== null && o.id === it.id ? 'good' : ''}" onclick="duelTap(${k},${i})">${esc(tText(o))}</button>`).join('')}</div>`}</div>`;
  app.innerHTML = `<div class="duel">${side(1)}<div class="dmid"><button onclick="go('games')">✕</button>${win >= 0 ? `<button onclick="go('duel',{})">↻</button>` : ''}</div>${side(0)}</div>`;
};
function duelNext() { ctx.it = shuffle(ctx.pool.filter(x => x !== ctx.it))[0]; ctx.opts = options(ctx.it, 'n', 't', ctx.pool, 4); ctx.lock = [false, false]; ctx.won = null; }
function duelTap(k, i) {
  if (ctx.lock[k] || ctx.won !== null || ctx.score.some(s => s >= 5)) return; const me = ctx;
  if (tText(ctx.opts[i]) === tText(ctx.it)) { ctx.won = k; ctx.score[k]++; beep(true); sayT(ctx.it);
    if (ctx.score[k] >= 5) { const p = P(); p.duels = (p.duels || 0) + 1; p.seeds += 10; save(); render(); return; } }
  else { ctx.lock[k] = true; beep(false); if (!ctx.lock[0] || !ctx.lock[1]) { render(); return; } ctx.won = -1; }
  render(); setTimeout(() => { if (ctx === me && view === 'duel') { duelNext(); render(); } }, 1300);
}

/* ---------- dictionary ---------- */
VIEWS.dict = app => {
  app.innerHTML = `<input id="dq" placeholder="🔍 English / Dholuo" value="${esc(ctx.q || '')}" oninput="ctx.q=this.value;dictList()">
    <div class="chips scroll"><button class="chip ${!ctx.topic ? 'on' : ''}" onclick="ctx.topic='';render()">★</button>${Object.values(TOPICS).filter(t => t.ids.length && ['w', 'p', 's'].includes(t.kind)).map(t => `<button class="chip ${ctx.topic === t.code ? 'on' : ''}" onclick="ctx.topic='${t.code}';render()">${t.e} ${esc(t.en)}</button>`).join('')}</div><div id="dl"></div>`;
  dictList();
};
function dictList() {
  const q = (ctx.q || '').toLowerCase().trim(); let its = ctx.topic ? TOPICS[ctx.topic].ids.map(I) : KIND.w.concat(KIND.p, KIND.s).filter(it => !/^(d_|st_|tr_)/.test(it.id));
  if (q) its = its.filter(it => it.en.toLowerCase().includes(q) || luoOf(it).toLowerCase().includes(q));
  const tot = its.length; its = its.slice(0, ctx.topic || q ? 120 : 40);
  $('dl').innerHTML = `<p class="note">${tot} ${tot > its.length ? '· type to search' : ''}</p>` + its.map(it => { const s = statusOf(it);
    return `<div class="dr"><span class="dp">${esc(it.pic)}</span><span class="dt"><b>${esc(it.en)}</b><i>${esc(luoOf(it) || '–')}${s === 'unsure' ? ' <u title="not checked">?</u>' : s !== 'base' ? ' ✓' : ''}</i></span>
      ${canEn(it) ? `<button class="spk sm" onclick="spk++;sayEn(I('${it.id}'))">🔊</button>` : ''}${canLuo(it) ? `<button class="spk sm luo-b" onclick="spk++;sayLuo(I('${it.id}'))">🔊</button>` : ''}${helper ? `<button class="spk sm" onclick="openEdit('${it.id}')">✎</button>` : ''}</div>`; }).join('');
}

/* ---------- me ---------- */
VIEWS.me = app => {
  const p = P(), pl = plantOf(p.seeds || 0), nx = PLANT.find(x => x[0] > (p.seeds || 0)), stars = Object.values(p.stars).reduce((a, b) => a + b, 0);
  app.innerHTML = `<div class="card"><div class="pic xl">${p.av}</div><div class="tt">${esc(p.name || '')}</div>
    <div class="plant">${pl[1]}</div><div class="nt">${p.seeds || 0} 🌱${nx ? ` → ${nx[1]} ${nx[0]}` : ''}</div>
    <div class="stats"><span>⭐<b>${stars}</b></span><span>📚<b>${mastered(p)}</b></span><span>🔥<b>${p.streak || 0}</b></span><span>✅<b>${Object.keys(p.stars).length}</b></span></div></div>
    <div class="badges">${badges(p).map(b => `<span class="${b[2] ? 'on' : ''}" title="${esc(b[1])}">${b[0]}<small>${esc(b[1])}</small></span>`).join('')}</div>
    <div class="chips"><button class="chip ${p.dir === 'en' ? 'on' : ''}" onclick="setDir('en')">Dholuo → English</button><button class="chip ${p.dir === 'luo' ? 'on' : ''}" onclick="setDir('luo')">English → Dholuo</button></div>
    <button class="btn alt wide" onclick="go('who')">👥 ${TT('Change learner', 'Japuonjre machielo')}</button>
    <button class="small-link" onclick="helperGate()">✎ Helpers / Jokony</button>`;
};
function setDir(d) { const p = P(); p.dir = d; if (d === 'luo' && p.start === 'A') p.start = 'C'; save(); render(); }

/* ================= HELPERS (adults, native speakers) ================= */
function helperGate() { if (helper) return go('helper'); const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4); go('gate', {a, b}); }
VIEWS.gate = app => { app.innerHTML = `<div class="card"><p class="note">For helpers. Type the answer:</p><div class="tt">${ctx.a} × ${ctx.b} = ?</div>
  <input id="gin" inputmode="numeric" class="tin" onkeydown="if(event.key==='Enter')gateTry()"><div class="row2"><button class="btn alt" onclick="go(P()?'home':'who')">Back</button><button class="btn" onclick="gateTry()">OK</button></div></div>`; };
function gateTry() { if (+$('gin').value === ctx.a * ctx.b) { helper = true; go('helper'); } else toast('✗'); }
const checkable = () => KIND.w.concat(KIND.p, KIND.s).filter(it => it.luo || S.edits[it.id]);
VIEWS.helper = app => {
  const all = checkable(), chk = all.filter(it => S.edits[it.id] || it.chk).length, uns = all.filter(it => statusOf(it) === 'unsure').length, rec = all.concat(KIND.syl).filter(it => hasAudio(it.id, 'luo')).length;
  const tg = (k, lab) => `<button class="chip ${S.set[k] ? 'on' : ''}" onclick="S.set.${k}=!S.set.${k};save();render()">${S.set[k] ? '☑' : '☐'} ${lab}</button>`;
  app.innerHTML = `<h2>Helpers</h2>
   <p class="note">The Dholuo in this app was written without a native speaker. <b>${chk}</b> of ${all.length} entries are checked, <b>${uns}</b> are marked “not sure”. <b>${rec}</b> of ${all.length + KIND.syl.length} have a recorded Dholuo voice.</p>
   <div class="hl"><button class="btn" onclick="go('check',{})">✓ Check the Dholuo</button><button class="btn" onclick="go('recorder',{})">🎙️ Record Dholuo voices</button>
   <button class="btn alt" onclick="openAdd()">+ Add our own word</button><button class="btn alt" onclick="go('dict')">📖 Find a word and fix it</button></div>
   <h3>Your name and agreement</h3>
   <input placeholder="Your name (for the thank-you list)" value="${esc(S.helper.name)}" maxlength="40" oninput="S.helper.name=this.value;save()">
   <button class="chip agree ${S.helper.ok ? 'on' : ''}" onclick="S.helper.ok=!S.helper.ok;save();render()">${S.helper.ok ? '☑' : '☐'} We agree that our corrections, words and voices are published freely in the Nawiri Pamoja app (licence CC BY-SA 4.0), with our names in the thank-you list.</button>
   <h3>Send to Nawiri Pamoja and other tablets</h3>
   <p class="note">One file with everything from this tablet: <b>${Object.keys(S.edits).length}</b> checked or corrected, <b>${S.added.length}</b> own words, <b>${haveLocal.size}</b> recordings. Send it by WhatsApp or e-mail to Nawiri Pamoja, or open it on another tablet with “Import”.</p>
   <div class="hl"><button class="btn" onclick="exportAll()">📤 Export everything</button><label class="btn alt">📥 Import<input type="file" hidden onchange="importAny(this.files[0])"></label></div>
   <h3>Settings</h3><div class="chips">${tg('openAll', 'All lessons open')}<button class="chip ${S.set.tone !== false ? 'on' : ''}" onclick="S.set.tone=S.set.tone===false;save();location.reload()">${S.set.tone !== false ? '☑' : '☐'} Dark skin tone for people (switch off if you see squares)</button>${tg('sw', 'Read Dholuo with the Swahili voice until recorded')}</div>
   <p class="note">English voice: <b>${V.en ? esc(V.en.name) : hasTTS() ? 'default' : 'none'}</b> · Swahili voice: <b>${V.sw ? esc(V.sw.name) : 'not found'}</b>
     <button class="chip" onclick="tts('Good morning. How are you?','en')">▶ test English</button><button class="chip" onclick="tts('Oyawore. Idhi nade?','sw').then(ok=>ok||toast('No Swahili voice'))">▶ test Dholuo</button></p>
   <h3>Learners</h3>${S.profiles.map(p => `<div class="dr"><span class="dp">${p.av}</span><span class="dt"><b>${esc(p.name || '–')}</b><i>${p.seeds || 0} 🌱 · ${Object.keys(p.stars).length} lessons · ${mastered(p)} words · ${p.dir === 'en' ? 'learns English' : 'learns Dholuo'}</i></span><button class="spk sm" onclick="delP('${p.id}')">🗑</button></div>`).join('') || '<p class="note">none yet</p>'}
   ${COMMUNITY.by && COMMUNITY.by.length ? `<h3>Erokamano!</h3><p class="note">${COMMUNITY.by.map(esc).join(' · ')}</p>` : ''}
   ${deferredInstall ? `<button class="btn wide" onclick="installApp()">📲 Install on this tablet</button>` : ''}
   <button class="btn alt wide" onclick="helper=false;go(P()?'home':'who')">Leave helper mode</button>`;
};
function delP(id) { const p = S.profiles.find(x => x.id === id); if (!p || !confirm('Delete ' + p.av + ' ' + (p.name || '') + ' and all progress?')) return; S.profiles = S.profiles.filter(x => x.id !== id); if (S.cur === id) S.cur = null; save(); render(); }
const SCOPES = [['uns', 'Not sure first'], ['w', 'Words'], ['p', 'Phrases'], ['s', 'Sentences'], ['syl', 'Sounds']];
function scopeList(sc) { return sc === 'uns' ? checkable().filter(it => !S.edits[it.id] && !it.chk).sort((a, b) => (a.sure ? 1 : 0) - (b.sure ? 1 : 0)) : (KIND[sc] || []).filter(it => it.luo || S.edits[it.id]); }
VIEWS.check = app => {
  const sc = ctx.sc || 'uns'; if (!ctx.list) { ctx.list = scopeList(sc).filter(it => sc === 'uns' || (!S.edits[it.id] && !it.chk)); ctx.i = 0; }
  const chips = `<div class="chips">${SCOPES.slice(0, 4).map(s => `<button class="chip ${sc === s[0] ? 'on' : ''}" onclick="go('check',{sc:'${s[0]}'})">${s[1]}</button>`).join('')}</div>`;
  if (ctx.i >= ctx.list.length) { app.innerHTML = chips + `<div class="card"><div class="pic lg">🎉</div><div class="tt">All checked here.</div><button class="btn" onclick="go('helper')">Back</button></div>`; return; }
  const it = ctx.list[ctx.i];
  app.innerHTML = chips + `<p class="note">${ctx.i + 1} / ${ctx.list.length} · Is the Dholuo right and natural?</p>
    <div class="card"><div class="pic lg">${esc(it.pic)}</div><div class="tt">${esc(it.en)}</div><div class="nt big">${esc(luoOf(it))}</div>${it.sure ? '' : '<div class="tag">author was not sure</div>'}
    ${canEn(it) ? `<button class="spk" onclick="spk++;sayEn(I('${it.id}'))">🔊</button>` : ''}</div>
    <div class="row3"><button class="btn" onclick="confirmIt('${it.id}')">✓ Correct</button><button class="btn warn" onclick="openEdit('${it.id}')">✎ Fix it</button><button class="btn alt" onclick="ctx.i++;render()">Skip ›</button></div>
    <button class="small-link" onclick="go('helper')">‹ Helpers</button>`;
};
function confirmIt(id) { S.edits[id] = {luo: luoOf(I(id)), status: 'confirmed', note: (S.edits[id] || {}).note || '', at: Date.now(), by: helperBy()}; save(); if (view === 'check') ctx.i++; render(); }
let curEditId = null;
function closeModal() { cancelRec(); curEditId = null; const m = $('modal'); if (m) m.remove(); }
function openEdit(id) {
  const it = I(id); if (!it) return; closeModal(); curEditId = id; const e = S.edits[id] || {};
  const d = document.createElement('div'); d.id = 'modal'; d.className = 'modal';
  d.innerHTML = `<div class="sheet"><h3>${esc(it.pic)} ${esc(it.en)}</h3><label>Dholuo</label><input id="eluo" value="${esc(luoOf(it))}">
    <label>Note (other word, dialect, how to say it …)</label><input id="enote" value="${esc(e.note || '')}"><div id="recbox">${recBox(id)}</div>
    <div class="row3"><button class="btn" onclick="saveEdit()">Save</button><button class="btn alt" onclick="closeModal()">Cancel</button></div></div>`;
  document.body.appendChild(d);
}
function saveEdit() {
  const it = I(curEditId), v = $('eluo').value.trim(), note = $('enote').value.trim(); if (!v) return toast('Please write the Dholuo');
  S.edits[it.id] = {luo: v, status: v === it.luo ? 'confirmed' : 'corrected', note, at: Date.now(), by: helperBy()}; save(); closeModal(); toast('Saved ✓'); if (view === 'check') ctx.i++; render();
}
function openAdd() {
  closeModal(); const d = document.createElement('div'); d.id = 'modal'; d.className = 'modal';
  d.innerHTML = `<div class="sheet"><h3>+ Our own word</h3><label>English</label><input id="aen"><label>Dholuo</label><input id="aluo"><label>Picture (one emoji, not needed)</label><input id="apic" maxlength="4">
    <div class="row3"><button class="btn" onclick="saveAdd()">Save</button><button class="btn alt" onclick="closeModal()">Cancel</button></div></div>`;
  document.body.appendChild(d);
}
function saveAdd() { const en = $('aen').value.trim(), luo = $('aluo').value.trim(), pic = $('apic').value.trim(); if (!en || !luo) return toast('English and Dholuo, please');
  S.added.push({en, luo, pic, at: Date.now(), by: helperBy()}); save(); loadAdded(); closeModal(); toast('Added ⭐'); render(); }
function dl(name, text) { const file = new File([text], name, {type: 'text/plain'});
  if (navigator.canShare && navigator.canShare({files: [file]})) { navigator.share({files: [file], title: name}).catch(() => {}); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast('Saved in Downloads: ' + name); }
const helperBy = () => String(S.helper.name || '').trim().slice(0, 40);

/* ---------- recording (helpers) ---------- */
let rec = null;
async function startRec(id, lang) {
  cancelRec(); stopSound();
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) { toast('Recording is not available here'); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(m => MediaRecorder.isTypeSupported(m)) || '';
    const mr = mime ? new MediaRecorder(stream, {mimeType: mime}) : new MediaRecorder(stream), chunks = [];
    const r = {mr, stream, id, lang, state: 'recording', blob: null, timer: null, discard: false, fromQueue: view === 'recorder' && !$('modal')};
    mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); clearTimeout(r.timer); if (r.discard || rec !== r) return;
      r.blob = new Blob(chunks, {type: mr.mimeType || mime || 'audio/webm'}); r.state = 'pending'; refreshRec(); playBlob(r.blob); };
    r.timer = setTimeout(() => { if (mr.state === 'recording') mr.stop(); }, 15000); rec = r; mr.start(); refreshRec();
  } catch (e) { toast('Please allow the microphone'); }
}
function stopRec() { if (rec && rec.mr.state === 'recording') rec.mr.stop(); }
function cancelRec() { if (!rec) return; rec.discard = true; clearTimeout(rec.timer); try { if (rec.mr.state === 'recording') rec.mr.stop(); } catch (e) {} try { rec.stream.getTracks().forEach(t => t.stop()); } catch (e) {} rec = null; }
async function keepRec() {
  if (!rec || !rec.blob) return; const {id, lang, blob, fromQueue} = rec;
  try { await DB.put(id + '|' + lang, {blob, mime: blob.type, ts: Date.now(), by: helperBy()}); haveLocal.add(id + '|' + lang); rec = null; toast('Saved 🎙️ ✓'); if (fromQueue && view === 'recorder') { ctx.i++; render(); } else refreshRec(); }
  catch (e) { toast('Could not save the recording'); }
}
async function delAudio(id, lang) { try { await DB.del(id + '|' + lang); } catch (e) {} haveLocal.delete(id + '|' + lang); refreshRec(); if (view === 'recorder' || view === 'helper') render(); }
function recRow(id, lang) {
  const st = rec && rec.id === id && rec.lang === lang ? rec.state : 'idle', has = hasAudio(id, lang);
  if (st === 'recording') return `<button class="btn warn sm" onclick="stopRec()">■ Stop</button><span class="note">recording…</span>`;
  if (st === 'pending') return `<button class="btn sm alt" onclick="playBlob(rec.blob)">▶ Listen</button><button class="btn sm" onclick="keepRec()">✓ Keep</button><button class="btn sm alt" onclick="startRec('${id}','${lang}')">↻ Again</button>`;
  return `<button class="btn sm" onclick="startRec('${id}','${lang}')">● ${has ? 'Record again' : 'Record'}</button>` + (has ? `<button class="btn sm alt" onclick="playAudio('${id}','${lang}')">▶</button>` : '') +
    (haveLocal.has(id + '|' + lang) ? `<button class="btn sm alt" onclick="delAudio('${id}','${lang}')">🗑</button>` : '');
}
function recBox(id) { return ['luo', 'en'].filter(l => l === 'luo' || I(id).en).map(l => `<div class="recline"><b>${l === 'luo' ? 'Dholuo' : 'English'}</b>${recRow(id, l)}</div>`).join(''); }
function refreshRec() { const b = $('recbox'); if (b && curEditId) b.innerHTML = recBox(curEditId); if (view === 'recorder' && !$('modal')) render(); }
VIEWS.recorder = app => {
  const lang = ctx.lang || 'luo', sc = ctx.sc || 'syl'; ctx.lang = lang; ctx.sc = sc;
  if (!ctx.list) { ctx.list = (KIND[sc] || []).filter(it => (lang === 'luo' ? luoOf(it) : it.en) && !hasAudio(it.id, lang)); ctx.i = 0; }
  const L = ctx.list, chips = `<div class="chips">${SCOPES.slice(1).map(s => `<button class="chip ${sc === s[0] ? 'on' : ''}" onclick="go('recorder',{sc:'${s[0]}',lang:'${lang}'})">${s[1]}</button>`).join('')}</div>
    <div class="chips"><button class="chip ${lang === 'luo' ? 'on' : ''}" onclick="go('recorder',{sc:'${sc}',lang:'luo'})">Dholuo</button><button class="chip ${lang === 'en' ? 'on' : ''}" onclick="go('recorder',{sc:'${sc}',lang:'en'})">English</button></div>`;
  if (ctx.i >= L.length) { app.innerHTML = chips + `<div class="card"><div class="pic lg">🎉</div><div class="tt">${L.length ? 'All recorded!' : 'Everything here has a voice already.'}</div><button class="btn" onclick="go('helper')">Back to helpers</button></div>`; return; }
  const it = L[ctx.i];
  app.innerHTML = chips + `<p class="note">${ctx.i + 1} / ${L.length} · Say it clearly, once, not too fast. ${sc === 'syl' ? 'Sounds are the most important: children learn to read with them.' : 'Wrong text? Tap ✎.'}</p>
    <div class="card">${sc === 'syl' ? '' : `<button class="pen" onclick="openEdit('${it.id}')">✎</button>`}<div class="pic lg ${sc === 'syl' ? 'txt' : ''}">${esc(it.pic)}</div><div class="tt">${esc(it.en)}</div><div class="nt big">${esc(luoOf(it))}</div></div>
    <div class="recline c">${recRow(it.id, lang)}<button class="btn sm alt" onclick="cancelRec();ctx.i++;render()">Skip ›</button></div><button class="small-link" onclick="go('helper')">‹ Helpers</button>`;
};
const b64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
/* One file with everything from this tablet. tools/merge_contributions.py turns these files into the published app. */
async function exportAll() {
  if (!S.helper.ok) { toast('Please tick the agreement first'); return; }
  try { const audio = {};
    for (const k of await DB.keys()) { const r = await DB.get(k); if (r && r.blob) audio[k] = {mime: r.mime, ts: r.ts, by: r.by || helperBy(), data: await b64(r.blob)}; }
    if (!Object.keys(S.edits).length && !S.added.length && !Object.keys(audio).length) { toast('Nothing to send yet'); return; }
    const by = helperBy(), name = 'nawiri-contrib-' + (slug(by) || 'helper') + '-' + new Date().toISOString().slice(0, 10) + '-' + S.dev + '.txt';
    dl(name, JSON.stringify({app: 'nawiri-pamoja-contrib', v: 1, at: new Date().toISOString(), by, device: S.dev, consent: true, licence: 'CC BY-SA 4.0', edits: S.edits, added: S.added, audio}));
  } catch (e) { toast('Export failed'); }
}
async function importAny(f) {
  if (!f) return; let d = null;
  try { d = JSON.parse(await f.text()); } catch (e) {}
  if (!d || !/^nawiri-pamoja-(contrib|edits|audio)$/.test(d.app || '')) { toast('This file is not from this app'); return; }
  const fat = Date.parse(d.at) || 0, who = x => String(x || d.by || '').slice(0, 40); let n = 0, a = 0;
  Object.keys(d.edits || {}).forEach(k => { const e = d.edits[k], old = S.edits[k], at = (e && +e.at) || fat;
    if (ITEMS[k] && e && typeof e.luo === 'string' && e.luo && e.luo.length < 300 && (!old || at > (old.at || 0))) {
      S.edits[k] = {luo: e.luo, status: e.status === 'corrected' ? 'corrected' : 'confirmed', note: String(e.note || '').slice(0, 300), at, by: who(e.by)}; n++; } });
  (d.added || []).forEach(w => { if (w && typeof w.en === 'string' && typeof w.luo === 'string' && w.en && w.luo && !S.added.some(x => x.en === w.en)) {
    S.added.push({en: w.en.slice(0, 80), luo: w.luo.slice(0, 80), pic: String(w.pic || '').slice(0, 4), at: +w.at || fat, by: who(w.by)}); n++; } });
  try { for (const [k, v] of Object.entries(d.audio || {})) {
      if (!/^[a-z0-9_-]+\|(luo|en)$/.test(k) || !v || typeof v.data !== 'string' || !/^audio\/[a-z0-9.+-]+(;.*)?$/i.test(v.mime || '') || v.data.length > 3e6) continue;
      const old = haveLocal.has(k) ? await DB.get(k) : null; if (old && (old.ts || 0) >= (v.ts || 0)) continue;
      const bin = atob(v.data), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      await DB.put(k, {blob: new Blob([u], {type: v.mime}), mime: v.mime, ts: v.ts || Date.now(), by: who(v.by)}); haveLocal.add(k); a++; }
  } catch (e) { toast('Some recordings could not be saved'); }
  save(); loadAdded(); toast('Imported ' + n + ' entries and ' + a + ' recordings ✓'); render();
}

/* ================= START ================= */
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (view === 'helper') render(); });
function installApp() { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall = null; render(); }
(async function init() {
  $('hlogo').src = LOGO; try { const l = document.createElement('link'); l.rel = 'icon'; l.href = LOGO; document.head.appendChild(l); } catch (e) {}
  view = S.profiles.length === 1 && P() ? 'home' : 'who'; render();
  try { (await DB.keys()).forEach(k => haveLocal.add(k)); } catch (e) {}
  try { if (/^https?:/.test(location.protocol)) { const r = await fetch('audio/manifest.json'); if (r.ok) { const m = await r.json(); hosted = {luo: m.luo || {}, en: m.en || {}}; } } } catch (e) {}
  try { if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js'); } catch (e) {}
  setTimeout(() => { initVoices(); if (view !== 'ses') render(); }, 800);
})();
