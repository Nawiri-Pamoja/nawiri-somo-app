/* ================= CORE: helpers, content index, storage, audio, path ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 44);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms));
function art(n) { return (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
const dayN = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); };

/* ---------- content index ---------- */
const ITEMS = {}, TOPICS = {}, KIND = {w: [], p: [], s: [], syl: [], abc: []};
function addItem(o) {
  if (ITEMS[o.id]) o.id += '-2';
  o.pic = o.pic || '💬'; o.picOk = !!o.picOk; o.luo = o.luo || ''; ITEMS[o.id] = o; (KIND[o.kind] || (KIND[o.kind] = [])).push(o); return o;
}
function unsure(s, sentence) {            // returns [text, sure]
  s = (s || '').trim();
  if (sentence) return /[.!?]\?$/.test(s) ? [s.slice(0, -1), false] : [s, true];
  return /\?$/.test(s) ? [s.slice(0, -1), false] : [s, true];
}
function loadBlocks(blocks, kind) {
  blocks.forEach(b => {
    const lines = b.split('\n'), h = lines[0].split('|'), t = TOPICS[h[0]] = {code: h[0], e: h[1], en: h[2], luo: h[3], kind, ids: []};
    lines.slice(1).forEach(l => {
      const f = l.split('|'); let pic, en, luo;
      if (kind === 'w') { pic = f[0]; en = f[1]; luo = f[2]; } else { pic = '~' + t.e; en = f[0]; luo = f[1]; }
      const [lt, sure] = unsure(luo, kind !== 'w'), ok = pic[0] !== '~';
      const it = addItem({id: t.code + '_' + slug(en), kind, topic: t.code, pic: ok ? pic : pic.slice(1), picOk: ok, en, luo: lt, sure});
      t.ids.push(it.id);
    });
  });
}
loadBlocks(WORD_BLOCKS, 'w'); loadBlocks(PHRASE_BLOCKS, 'p'); loadBlocks(SENT_BLOCKS, 's');
const PL = PLURALS.split('\n').map(l => { const f = l.split('|'), ok = f[0][0] !== '~', p = ok ? f[0] : f[0].slice(1), [lt, sure] = unsure(f[4]);
  return addItem({id: 'pl_' + slug(f[2]) + (f[1] === f[2] ? '-many' : ''), kind: 'w', topic: 'pl', pic: p + p, picOk: ok, en: f[1] === f[2] ? 'many ' + f[2] : f[2], luo: lt, sure}).id; });
TOPICS.pl = {code: 'pl', e: '👥', en: 'One and many', luo: 'Achiel gi mang\'eny', kind: 'w', ids: PL};
DIALOGS.forEach(d => { d.ids = d.lines.split('\n').map((l, i) => { const f = l.split('|'), [lt, sure] = unsure(f[2], true);
  return addItem({id: d.id + '_' + i, kind: 's', topic: d.id, pic: d.e, en: f[1], luo: lt, sure, who: f[0]}).id; }); });
STORIES.forEach(st => { st.ids = []; st.qs = []; st.text.split('\n').forEach((l, i) => { const f = l.split('|');
  if (l[0] === '?') st.qs.push({q: f[0].slice(1), a: f[1], opts: f.slice(1)});
  else { const [lt, sure] = unsure(f[1], true); st.ids.push(addItem({id: st.id + '_' + i, kind: 's', topic: st.id, pic: st.e, en: f[0], luo: lt, sure}).id); } }); });
/* corrections from native speakers, merged into the build by tools/merge_contributions.py (src/data_community.js) */
Object.keys(COMMUNITY.edits || {}).forEach(id => { const it = ITEMS[id], e = COMMUNITY.edits[id]; if (!it || !e || !e.luo) return;
  it.luo = e.luo; it.sure = true; it.chk = e.status === 'corrected' ? 'corrected' : 'confirmed'; it.note = e.note || ''; });
VOWELS.forEach(v => addItem({id: 'syl_' + v, kind: 'syl', topic: 'syl', pic: v, en: '', luo: v, sure: true}));
LIT_SEQ.filter(c => !VOWELS.includes(c)).forEach(c => VOWELS.forEach(v => addItem({id: 'syl_' + slug(c + v), kind: 'syl', topic: 'syl', pic: c + v, en: '', luo: c + v, sure: true})));
ABC.forEach(a => addItem({id: 'abc_' + a[0], kind: 'abc', topic: 'abc', pic: a[1], picOk: true, en: a[2], luo: '', sure: true, letter: a[0]}));
const TRICKY_IDS = TRICKY.map(a => addItem({id: 'tr_' + slug(a[1]), kind: 'w', topic: 'tr', pic: a[0], picOk: true, en: a[1], luo: '', sure: true}).id);
const byEn = {}; KIND.w.forEach(it => { if (!byEn[it.en]) byEn[it.en] = it; });
CVC.forEach((g, k) => { g.ids = g.words.split('|').map(x => { const [pic, w] = x.split(' '), o = byEn[w] || byEn['to ' + w] || {};
  return addItem({id: 'cvc_' + w, kind: 'w', topic: 'cvc', pic, picOk: true, en: w, luo: o.luo || '', sure: o.sure !== false, ref: o.id}).id; }); });
TOPICS.cvc = {code: 'cvc', e: '🔤', en: 'Short English words', luo: 'Weche matindo mag Kisungu', kind: 'w', ids: [].concat(...CVC.map(g => g.ids))};
SIGHT.forEach(g => { g.ids = g.words.split('|').map(x => { const [w, l] = x.split(':');
  return addItem({id: 'sw_' + slug(w) + (w === 'I' ? '-me' : ''), kind: 'sw', topic: 'sw', pic: '👁️', en: w, luo: l || '', sure: true}).id; }); });
const I = id => ITEMS[id];

/* ---------- storage ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
let S = LS.get('np2', null) || {profiles: [], cur: null, set: {openAll: false, sw: true}, edits: {}, added: []};
S.set = S.set || {openAll: false, sw: true}; S.edits = S.edits || {}; S.added = S.added || [];
S.helper = S.helper || {name: '', ok: false}; S.dev = S.dev || Math.random().toString(36).slice(2, 7);
(function migrate() {                       // keep corrections made in the first prototype
  const oe = LS.get('np_edits', null), oa = LS.get('np_added', null);
  if (oe && !S.migrated) { Object.keys(oe).forEach(k => { if (ITEMS[k] && !S.edits[k]) S.edits[k] = oe[k]; }); }
  if (oa && !S.migrated) oa.forEach(w => { if (w && w.en && !S.added.some(x => x.en === w.en)) S.added.push({pic: w.emoji || '⭐', en: w.en, luo: w.luo || ''}); });
  S.migrated = true;
})();
TOPICS.own = {code: 'own', e: '⭐', en: 'Our own words', luo: 'Wechewa', kind: 'w', ids: []};
function loadAdded() { (COMMUNITY.added || []).concat(S.added).forEach(w => { const id = 'own_' + slug(w.en); if (!ITEMS[id]) { addItem({id, kind: 'w', topic: 'own', pic: w.pic || '⭐', picOk: !!w.pic, en: w.en, luo: w.luo, sure: true, own: true}); TOPICS.own.ids.push(id); } }); }
loadAdded();
const save = () => LS.set('np2', S);
let helper = false;
const P = () => S.profiles.find(p => p.id === S.cur) || null;
const dir = () => (P() && P().dir) || 'en';
const luoOf = it => (S.edits[it.id] && S.edits[it.id].luo) || it.luo;
const statusOf = it => S.edits[it.id] ? S.edits[it.id].status : it.chk || (it.sure ? 'base' : 'unsure');
const tText = it => dir() === 'en' ? it.en : luoOf(it);       // the language being learned
const nText = it => dir() === 'en' ? luoOf(it) : it.en;       // the language the learner already knows
const TT = (en, luo) => dir() === 'en' && luo ? `${esc(luo)}<small>${esc(en)}</small>` : esc(en);

/* ---------- sound ---------- */
let actx = null;
function beep(ok) {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, seq = ok ? [[660, 0], [880, .12]] : [[220, 0], [180, .14]];
    seq.forEach(([f, d]) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; o.type = 'sine';
      g.gain.setValueAtTime(.15, t + d); g.gain.exponentialRampToValueAtTime(.001, t + d + .25); o.connect(g); g.connect(actx.destination); o.start(t + d); o.stop(t + d + .26); });
  } catch (e) {}
}
const V = {en: null, sw: null, n: 0};
function initVoices() {
  try { const v = speechSynthesis.getVoices(); V.n = v.length;
    V.en = v.find(x => /^en[-_]KE/i.test(x.lang)) || v.find(x => /^en[-_](GB|UG|TZ|NG|ZA)/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null;
    V.sw = v.find(x => /^sw/i.test(x.lang)) || null;
  } catch (e) {}
}
const hasTTS = () => typeof speechSynthesis !== 'undefined';
if (hasTTS()) { initVoices(); try { speechSynthesis.onvoiceschanged = initVoices; } catch (e) {} }
let spk = 0;
function tts(text, lang) {
  return new Promise(res => { try {
    if (!hasTTS() || !text) return res(false);
    const v = lang === 'sw' ? V.sw : V.en; if (lang === 'sw' && !v) return res(false);
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = v ? v.lang : 'en-GB'; if (v) u.voice = v; u.rate = lang === 'sw' ? .7 : .8;
    let done = false; const fin = () => { if (!done) { done = true; res(true); } }; u.onend = fin; u.onerror = fin; setTimeout(fin, 1800 + text.length * 130); speechSynthesis.speak(u);
  } catch (e) { res(false); } });
}
const cleanEn = s => s.replace(/\(([^)]*)\)/g, ', $1').replace(/\s*\/\s*/g, ', ').replace(/…/g, '');
/* recordings: IndexedDB on the tablet + files shipped in audio/ */
const haveLocal = new Set(); let hosted = {luo: {}, en: {}}, curAudio = null;
const EXT_MIME = {webm: 'audio/webm', m4a: 'audio/mp4', ogg: 'audio/ogg', mp3: 'audio/mpeg', wav: 'audio/wav'};
const DB = { _p: null,
  open() { return this._p || (this._p = new Promise((res, rej) => { if (typeof indexedDB === 'undefined') return rej(new Error('no idb')); const r = indexedDB.open('np_audio', 1); r.onupgradeneeded = () => r.result.createObjectStore('a'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); },
  async tx(mode, fn) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('a', mode), q = fn(t.objectStore('a')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); },
  get(k) { return this.tx('readonly', s => s.get(k)); }, put(k, v) { return this.tx('readwrite', s => s.put(v, k)); },
  del(k) { return this.tx('readwrite', s => s.delete(k)); }, keys() { return this.tx('readonly', s => s.getAllKeys()); }
};
const hasAudio = (id, l) => haveLocal.has(id + '|' + l) || !!(hosted[l] && hosted[l][id]);
function stopSound() { spk++; try { if (curAudio) curAudio.pause(); } catch (e) {} try { if (hasTTS()) speechSynthesis.cancel(); } catch (e) {} }
function playBlob(blob) {
  return new Promise(res => { try { if (curAudio) { try { curAudio.pause(); } catch (e) {} }
    const url = URL.createObjectURL(blob), a = new Audio(url); curAudio = a; a.onended = a.onerror = () => { URL.revokeObjectURL(url); res(true); }; a.play().catch(() => res(false));
  } catch (e) { res(false); } });
}
async function playAudio(id, lang) {
  try { const key = id + '|' + lang; let blob = null;
    if (haveLocal.has(key)) { const r = await DB.get(key); blob = r && r.blob; }
    if (!blob && hosted[lang] && hosted[lang][id]) { const ext = hosted[lang][id], r = await fetch('audio/' + lang + '/' + id + '.' + ext); if (r.ok) blob = new Blob([await r.blob()], {type: EXT_MIME[ext]}); }
    return blob ? await playBlob(blob) : false;
  } catch (e) { return false; }
}
const canEn = it => !!it.en && (hasAudio(it.id, 'en') || hasTTS());
const canLuo = it => !!luoOf(it) && (hasAudio(it.id, 'luo') || (S.set.sw && !!V.sw));
const canT = it => dir() === 'en' ? canEn(it) : canLuo(it);
async function sayEn(it, text) { if (!text && hasAudio(it.id, 'en') && await playAudio(it.id, 'en')) return true; return tts(cleanEn(text || it.en), 'en'); }
async function sayLuo(it) { if (hasAudio(it.id, 'luo') && await playAudio(it.id, 'luo')) return true; if (S.set.sw && V.sw) return tts(luoOf(it), 'sw'); return false; }
const sayT = it => { ++spk; return dir() === 'en' ? sayEn(it) : sayLuo(it); };
async function sayBoth(it) { const k = ++spk; if (canLuo(it)) { await sayLuo(it); if (k !== spk) return; await wait(250); } if (k !== spk) return; await sayEn(it); }
function toast(m) { const t = $('toast'); t.textContent = m; t.style.display = 'block'; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = 'none', 2600); }

/* ---------- the reading-and-writing course, generated from LIT_SEQ ---------- */
function litUnits(stage, push) {
  const known = [];
  LIT_SEQ.forEach((l, i) => {
    known.push(l); const kw = I(KEYW[l]);
    push({id: 'B_l_' + slug(l.replace("'", 'x')), stage, kind: 'LT', l, known: known.slice(), e: l, en: 'letter ' + l, luo: l + (kw ? ' · ' + kw.luo : ''), ids: kw ? [kw.id] : []});
    if (i % 3 === 2 || i === LIT_SEQ.length - 1) { const fresh = LIT_SEQ.slice(i - (i % 3), i + 1);
      push({id: 'B_rv_' + slug(l.replace("'", 'x')), stage, kind: 'LR', known: known.slice(), fresh, e: '🔁', en: 'Read and write', luo: 'Som gi ndik: ' + fresh.join(' '), ids: []}); }
  });
  CAPS.forEach((g, i) => push({id: 'B_cap' + i, stage, kind: 'CAP', letters: g.split(''), e: g[0], en: 'Capital letters', luo: 'Nyukta madongo: ' + g.split('').join(' '), ids: []}));
  DIGITS.forEach((g, i) => push({id: 'B_num' + i, stage, kind: 'NUM', digits: g.split(''), e: g[0], en: 'Writing numbers', luo: 'Ndik namba: ' + g.split('').join(' '), ids: []}));
  [1, 2, 3].forEach(n => push({id: 'B_fl' + n, stage, kind: 'FL', known: LIT_SEQ.slice(), e: '📖', en: 'Read sentences', luo: 'Som weche ' + n, ids: []}));
}
function engUnits(stage, push) {
  ABC_PAIRS.forEach(pr => {
    push({id: 'B2_' + pr, stage, kind: 'EL', letters: pr.split(''), e: pr[0], en: pr.split('').join(' '), luo: pr.split('').map(c => I('abc_' + c).en).join(' · '), ids: pr.split('').map(c => 'abc_' + c)});
    CVC.filter(g => g.after === pr).forEach(g => push({id: 'B2_cvc_' + pr, stage, kind: 'CVC', e: I(g.ids[0]).pic, en: 'Read: ' + g.ids.slice(0, 3).map(x => I(x).en).join(' '), luo: 'Som Kisungu', ids: g.ids}));
  });
  SIGHT.forEach((g, i) => push({id: 'B2_' + g.id, stage, kind: 'SW', sw: g, e: '👁️', en: 'Little words ' + (i + 1), luo: g.ids.slice(0, 4).map(x => I(x).en).join(' '), ids: g.ids}));
  push({id: 'B_tricky', stage, kind: 'W', e: 'sh', en: 'sh ch th', luo: '', ids: TRICKY_IDS.slice(0, 7)});
  push({id: 'B_tricky2', stage, kind: 'W', e: 'ee', en: 'ee oo ng', luo: '', ids: TRICKY_IDS.slice(7)});
}

/* ---------- the path ---------- */
const PATH = [];
(function buildPath() {
  const used = new Set(), cnt = {};
  const title = (t, k) => ({en: t.en + (k > 1 ? ' ' + k : ''), luo: t.luo + (k > 1 ? ' ' + k : '')});
  const push = u => { u.idx = PATH.length; PATH.push(u); return u; };
  STAGES.concat([{id: 'H', e: '🌟', en: 'Treasure of words', luo: 'Weche mang\'eny', sub: 'many more words'}]).forEach(st => {
    (PATH_SPEC[st.id] || []).forEach(tok => {
      const f = tok.split('|'), k = f[0];
      if (k === 'L') push({id: st.id + '_' + slug(f[1]), stage: st.id, kind: k, e: f[3], en: f[1], luo: f[2], ids: f[4].split(',')});
      else if (k === 'PW') push({id: 'B_pw' + f[1], stage: st.id, kind: 'PW', e: f[1] === '1' ? '〰️' : '➰', en: f[1] === '1' ? 'Lines' : 'Curves', luo: 'Ndiko mokwongo ' + f[1],
        shapes: f[1] === '1' ? ['sh_down', 'sh_across', 'sh_slant', 'sh_zigzag'] : ['sh_circle', 'sh_cup', 'sh_hump', 'sh_wave'], ids: []});
      else if (k === 'LIT') litUnits(st.id, push);
      else if (k === 'ENG') engUnits(st.id, push);
      else if (k === 'W' || k === 'P' || k === 'T') { const t = TOPICS[f[1]], ids = t.ids.slice(+f[2], +f[3]); if (k !== 'T') ids.forEach(x => used.add(x));
        const n = cnt[k + f[1]] = (cnt[k + f[1]] || 0) + 1, tt = title(t, n);
        push({id: st.id + '_' + k + '_' + f[1] + '_' + f[2], stage: st.id, kind: k, e: k === 'T' ? '⌨️' : t.e, en: (k === 'T' ? 'Typing: ' : '') + tt.en, luo: tt.luo, ids, topic: t.code}); }
      else if (k === 'S') { const t = TOPICS[f[1]]; push({id: st.id + '_S_' + f[1], stage: st.id, kind: 'S', e: t.e, en: t.en, luo: t.luo, ids: t.ids}); }
      else if (k === 'PAT') { const p = PATTERNS.find(x => x.id === f[1]); push({id: st.id + '_PAT_' + p.id, stage: st.id, kind: 'PAT', e: '🧩', en: p.title, luo: p.luoT, pat: p, ids: []}); }
      else if (k === 'DO') push({id: st.id + '_DO', stage: st.id, kind: 'DO', e: '🏃', en: 'I am … you are …', luo: 'A… i… o…', ids: []});
      else if (k === 'PL') { const ids = PL.slice(+f[1], +f[2]); ids.forEach(x => used.add(x)); push({id: st.id + '_PL_' + f[1], stage: st.id, kind: 'W', e: '👥', en: 'One and many' + (+f[1] ? ' 2' : ''), luo: 'Achiel gi mang\'eny', ids, topic: 'pl'}); }
      else if (k === 'D') { const d = DIALOGS.find(x => x.id === f[1]); push({id: st.id + '_' + d.id, stage: st.id, kind: 'D', e: d.e, en: d.t, luo: d.l, dlg: d, ids: d.ids}); }
      else if (k === 'ST') { const s = STORIES.find(x => x.id === f[1]); push({id: st.id + '_' + s.id, stage: st.id, kind: 'ST', e: s.e, en: s.t, luo: s.l, story: s, ids: s.ids}); }
    });
    if (st.id === 'H') Object.values(TOPICS).forEach(t => {          // everything not placed above
      if (!['w', 'p'].includes(t.kind) || ['own', 'pl', 'cvc', 'tr'].includes(t.code)) return;
      const rest = t.ids.filter(x => !used.has(x));
      for (let i = 0; i < rest.length; i += 8) { const n = cnt[(t.kind === 'w' ? 'W' : 'P') + t.code] = (cnt[(t.kind === 'w' ? 'W' : 'P') + t.code] || 0) + 1, tt = title(t, n);
        push({id: 'H_' + t.code + '_' + i, stage: 'H', kind: t.kind === 'w' ? 'W' : 'P', e: t.e, en: tt.en, luo: tt.luo, ids: rest.slice(i, i + 8), topic: t.code}); }
    });
  });
})();
const ALL_STAGES = STAGES.concat([{id: 'H', e: '🌟', en: 'Treasure of words', luo: 'Weche mang\'eny', sub: 'many more words'}]);
const stagesFor = p => ALL_STAGES.filter(s => p.dir === 'en' || !['A', 'B', 'B2'].includes(s.id));
const firstIdx = st => PATH.findIndex(u => u.stage === st);
function frontier(p) { let f = firstIdx(p.start || 'A'); PATH.forEach(u => { if (p.stars[u.id] && u.idx + 1 > f) f = u.idx + 1; }); return Math.min(f, PATH.length - 1); }
const unlocked = (p, u) => S.set.openAll || u.idx <= frontier(p) + 1;

/* ---------- progress ---------- */
const IV = [0, 1, 2, 4, 8, 16, 32];
function grade(it, ok) {
  const p = P(); if (!p || !it || !ITEMS[it.id] || it.kind === 'syl') return;
  const r = p.prog[it.id] || {b: 0}; r.b = ok ? Math.min(r.b + 1, 6) : Math.max(r.b - 1, 0); r.d = dayN() + IV[r.b]; p.prog[it.id] = r;
}
const dueItems = p => Object.keys(p.prog).filter(id => ITEMS[id] && p.prog[id].d <= dayN()).map(I);
const mastered = p => Object.keys(p.prog).filter(id => ITEMS[id] && p.prog[id].b >= 3).length;
const PLANT = [[0, '🌰', 'seed'], [30, '🌱', 'sprout'], [120, '🌿', 'plant'], [300, '🪴', 'young tree'], [700, '🌳', 'tree'], [1500, '🌳🍊', 'fruit tree'], [3000, '🌳🌳🌳', 'forest']];
const plantOf = n => PLANT.filter(x => n >= x[0]).pop();
function touchDay(p) { const d = dayN(); if (p.last !== d) { p.streak = p.last === d - 1 ? (p.streak || 0) + 1 : 1; p.last = d; p.today = 0; } p.today = (p.today || 0) + 1; }
function badges(p) {
  const done = Object.keys(p.stars).length, m = mastered(p), stDone = id => { const us = PATH.filter(u => u.stage === id); return us.length && us.every(u => p.stars[u.id]); };
  return [['⭐', 'First lesson', done >= 1], ['🎒', '10 lessons', done >= 10], ['🏅', '50 lessons', done >= 50], ['🏆', '100 lessons', done >= 100],
    ['🔥', '3 days in a row', (p.best || 0) >= 3], ['☄️', '7 days in a row', (p.best || 0) >= 7], ['🌞', '30 days in a row', (p.best || 0) >= 30],
    ['📗', '50 words', m >= 50], ['📘', '200 words', m >= 200], ['📚', '500 words', m >= 500], ['🎙️', 'I used my voice', (p.said || 0) >= 5], ['🤝', 'Played together', (p.duels || 0) >= 1]]
    .concat(stagesFor(p).map(s => [s.e, s.en + ' finished', stDone(s.id)]));
}
