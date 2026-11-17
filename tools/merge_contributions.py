#!/usr/bin/env python3
"""Merges everything helpers exported from the app into the published build.

   Input:  contributions/**/*.txt or *.json   files made with "Export everything" in the app's helper area
                                               (older "corrections" and "voices" exports work too)
           contributions/audio/luo/<id>.<ext>  optional: recordings made outside the app (they win)
   Output: src/data_community.js               corrections, new words, thank-you list (read by build.py)
           audio/luo/, audio/en/, audio/manifest.json   the recordings, served with the app
           review/community-report.md          what came in, by whom, and where helpers disagree

   Rules: for the same entry the newest correction wins; disagreements are listed in the report.
   build.py runs this automatically. Usage on its own: python3 tools/merge_contributions.py"""
import base64, glob, json, os, re, sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDRE = re.compile(r'^[a-z0-9_-]{1,80}$')
EXT = {'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'm4a', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav'}
MAX_AUDIO = 3_000_000          # base64 characters per recording (about 2 MB)

def txt(v, n): return str(v or '').strip()[:n]
def ms(iso):
    try: return int(datetime.fromisoformat(str(iso).replace('Z', '+00:00')).timestamp() * 1000)
    except Exception: return 0

def main(root=ROOT, quiet=False):
    say = (lambda *a: None) if quiet else print
    cdir = os.path.join(root, 'contributions')
    files = sorted(glob.glob(os.path.join(cdir, '**', '*.txt'), recursive=True) + glob.glob(os.path.join(cdir, '**', '*.json'), recursive=True))
    edits, variants, added, audio, people, skipped = {}, {}, {}, {}, {}, []
    def credit(name, what):
        name = txt(name, 40)
        if name: people.setdefault(name, {'edits': 0, 'words': 0, 'voices': 0})[what] += 1
    for f in files:
        rel = os.path.relpath(f, root)
        try: d = json.load(open(f, encoding='utf-8-sig'))
        except Exception: skipped.append(rel + ' (not readable)'); continue
        app = d.get('app') if isinstance(d, dict) else None
        if app not in ('nawiri-pamoja-contrib', 'nawiri-pamoja-edits', 'nawiri-pamoja-audio'): skipped.append(rel + ' (not from the app)'); continue
        fat, fby = ms(d.get('at')), txt(d.get('by'), 40)
        for k, e in (d.get('edits') or {}).items():
            if not IDRE.match(str(k)) or not isinstance(e, dict) or not txt(e.get('luo'), 300): continue
            e2 = {'luo': txt(e['luo'], 300), 'status': 'corrected' if e.get('status') == 'corrected' else 'confirmed',
                  'note': txt(e.get('note'), 300), 'at': int(e.get('at') or fat or 0), 'by': txt(e.get('by'), 40) or fby}
            variants.setdefault(k, []).append(e2); credit(e2['by'], 'edits')
            if k not in edits or e2['at'] >= edits[k]['at']: edits[k] = e2
        for w in d.get('added') or []:
            if not isinstance(w, dict) or not txt(w.get('en'), 80) or not txt(w.get('luo'), 80): continue
            w2 = {'en': txt(w['en'], 80), 'luo': txt(w['luo'], 80), 'pic': txt(w.get('pic'), 8), 'at': int(w.get('at') or fat or 0), 'by': txt(w.get('by'), 40) or fby}
            key = w2['en'].lower(); credit(w2['by'], 'words')
            if key not in added or w2['at'] >= added[key]['at']: added[key] = w2
        for k, v in (d.get('audio') or {}).items():
            m = re.match(r'^([a-z0-9_-]{1,80})\|(luo|en)$', str(k))
            if not m or not isinstance(v, dict) or not isinstance(v.get('data'), str) or len(v['data']) > MAX_AUDIO: continue
            ext = EXT.get(str(v.get('mime', '')).split(';')[0].strip().lower())
            if not ext: continue
            ts = int(v.get('ts') or fat or 0); credit(txt(v.get('by'), 40) or fby, 'voices')
            if k not in audio or ts >= audio[k]['ts']: audio[k] = {'id': m.group(1), 'lang': m.group(2), 'ext': ext, 'ts': ts, 'data': v['data'], 'by': txt(v.get('by'), 40) or fby}
    # write recordings (generated folders are rebuilt every time)
    manifest = {'luo': {}, 'en': {}}
    for lang in ('luo', 'en'):
        d = os.path.join(root, 'audio', lang); os.makedirs(d, exist_ok=True)
        for f in os.listdir(d):
            if f != '.keep': os.remove(os.path.join(d, f))
    for a in audio.values():
        try: raw = base64.b64decode(a['data'], validate=True)
        except Exception: skipped.append('recording %s|%s (damaged)' % (a['id'], a['lang'])); continue
        open(os.path.join(root, 'audio', a['lang'], a['id'] + '.' + a['ext']), 'wb').write(raw)
        manifest[a['lang']][a['id']] = a['ext']
    for lang in ('luo', 'en'):                   # recordings made outside the app
        for f in sorted(glob.glob(os.path.join(cdir, 'audio', lang, '*'))):
            base, ext = os.path.splitext(os.path.basename(f)); ext = ext.lstrip('.').lower()
            if IDRE.match(base) and ext in ('webm', 'm4a', 'ogg', 'mp3', 'wav'):
                for old in glob.glob(os.path.join(root, 'audio', lang, base + '.*')): os.remove(old)
                open(os.path.join(root, 'audio', lang, base + '.' + ext), 'wb').write(open(f, 'rb').read()); manifest[lang][base] = ext
    for lang in manifest: manifest[lang] = dict(sorted(manifest[lang].items()))
    open(os.path.join(root, 'audio', 'manifest.json'), 'w').write(json.dumps(manifest, indent=1) + '\n')
    # the data file read by the app
    names = sorted(people, key=lambda n: (-sum(people[n].values()), n.lower()))
    E = {k: {x: edits[k][x] for x in ('luo', 'status', 'note') if edits[k][x]} for k in sorted(edits)}
    A = [{x: w[x] for x in ('en', 'luo', 'pic') if w[x]} for w in sorted(added.values(), key=lambda w: w['en'].lower())]
    js = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')
    lines = ['/* GENERATED by tools/merge_contributions.py from contributions/ – do not edit by hand.',
             '   Corrections, new words and the thank-you list from native speakers. Licence: CC BY-SA 4.0. */',
             'const COMMUNITY = {', ' edits: {'] + ['  %s: %s,' % (js(k), js(v)) for k, v in E.items()] + \
            [' },', ' added: ['] + ['  %s,' % js(w) for w in A] + [' ],', ' by: %s' % js(names), '};', '']
    open(os.path.join(root, 'src', 'data_community.js'), 'w', encoding='utf-8').write('\n'.join(lines))
    # report for the team
    conf = {k: v for k, v in variants.items() if len({x['luo'] for x in v}) > 1}
    rep = ['# Community contributions', '', 'Generated by `tools/merge_contributions.py` from `contributions/` – do not edit by hand.', '',
           '- Files read: %d' % len(files), '- Checked or corrected entries: %d' % len(E), '- New words: %d' % len(A),
           '- Recordings: %d Dholuo, %d English' % (len(manifest['luo']), len(manifest['en'])), '']
    if names:
        rep += ['## Erokamano – thank you', '', '| Name | checked/corrected | words | recordings (sent) |', '|---|---|---|---|']
        rep += ['| %s | %d | %d | %d |' % (n, people[n]['edits'], people[n]['words'], people[n]['voices']) for n in names] + ['']
    if conf:
        rep += ['## Helpers disagree (the newest one is used – please decide)', '', '| Entry | Versions (newest last) |', '|---|---|']
        for k in sorted(conf):
            vs = sorted(conf[k], key=lambda x: x['at'])
            rep.append('| `%s` | %s |' % (k, ' → '.join('%s (%s)' % (x['luo'].replace('|', '/'), x['by'] or '?') for x in vs)))
        rep.append('')
    notes = [(k, e) for k, e in sorted(edits.items()) if e['note']]
    if notes:
        rep += ['## Notes from helpers', '', '| Entry | Dholuo | Note | By |', '|---|---|---|---|']
        rep += ['| `%s` | %s | %s | %s |' % (k, e['luo'].replace('|', '/'), e['note'].replace('|', '/'), e['by']) for k, e in notes] + ['']
    if skipped: rep += ['## Skipped', ''] + ['- ' + s for s in skipped] + ['']
    os.makedirs(os.path.join(root, 'review'), exist_ok=True)
    open(os.path.join(root, 'review', 'community-report.md'), 'w', encoding='utf-8').write('\n'.join(rep))
    say('contributions: %d files, %d entries, %d words, %d recordings, %d people, %d disagreements' % (len(files), len(E), len(A), len(manifest['luo']) + len(manifest['en']), len(names), len(conf)))

if __name__ == '__main__':
    main()
