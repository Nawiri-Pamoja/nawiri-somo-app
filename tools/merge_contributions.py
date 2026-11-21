#!/usr/bin/env python3
"""Merges everything helpers exported from the app into the published build.

   Input:  contributions/**/*.txt or *.json   files made with "Export everything" in the app's helper area
                                               (older "corrections" and "voices" exports work too)
           contributions/audio/luo/<id>.<ext>  optional: recordings made outside the app (they win)
   Output: src/data_community.js               corrections, new words, thank-you list (read by build.py)
           audio/luo/, audio/en/, audio/manifest.json   the recordings, served with the app
           review/community-report.md          what came in, by whom, and where helpers disagree

   Recordings are polished if ffmpeg is installed: silence at start and end cut off, all at the same loudness,
   saved as small .m4a files (cached in .cache/audio, so later builds are fast). NP_NO_POLISH=1 switches this off.
   Rules: for the same entry the newest correction wins; disagreements are listed in the report.
   build.py runs this automatically. Usage on its own: python3 tools/merge_contributions.py"""
import base64, glob, hashlib, json, os, re, shutil, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDRE = re.compile(r'^[a-z0-9_-]{1,80}$')
EXT = {'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'm4a', 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav'}
MAX_AUDIO = 3_000_000          # base64 characters per recording (about 2 MB)
FFMPEG = None if os.environ.get('NP_NO_POLISH') else shutil.which('ffmpeg')
TRIM = ('silenceremove=start_periods=1:start_duration=0.04:start_threshold=-40dB,areverse,'
        'silenceremove=start_periods=1:start_duration=0.04:start_threshold=-40dB,areverse')

def polish(raw, ext, cache):
    """Cut silence, even out loudness, mono AAC. Falls back to the original if anything goes wrong."""
    if not FFMPEG: return raw, ext
    key = hashlib.sha1(raw).hexdigest(); hit = os.path.join(cache, key + '.m4a')
    if os.path.exists(hit): return open(hit, 'rb').read(), 'm4a'
    run = lambda *a: subprocess.run([FFMPEG, '-hide_banner', '-nostats'] + list(a), capture_output=True, text=True)
    with tempfile.TemporaryDirectory() as t:
        src, mid, dst = os.path.join(t, 'in.' + ext), os.path.join(t, 'mid.wav'), os.path.join(t, 'out.m4a'); open(src, 'wb').write(raw)
        if run('-y', '-i', src, '-af', 'highpass=f=70', '-ac', '1', '-ar', '24000', mid).returncode or not os.path.exists(mid): return raw, ext
        peak = re.search(r'max_volume:\s*(-?[\d.]+)', run('-i', mid, '-af', 'volumedetect', '-f', 'null', '-').stderr)
        gain = min(30.0, -3.0 - float(peak.group(1))) if peak else 0.0              # loudest part at -3 dB: all clips sound equally loud
        af = 'volume=%.1fdB,%s,alimiter=limit=0.89:level=false,adelay=120:all=1,apad=pad_dur=0.15' % (gain, TRIM)
        if run('-y', '-i', mid, '-af', af, '-c:a', 'aac', '-b:a', '48k', '-movflags', '+faststart', dst).returncode or not os.path.exists(dst) or os.path.getsize(dst) < 800: return raw, ext
        data = open(dst, 'rb').read()
    os.makedirs(cache, exist_ok=True); open(hit, 'wb').write(data)
    return data, 'm4a'

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
    jobs = []
    for a in audio.values():
        try: jobs.append((a['lang'], a['id'], base64.b64decode(a['data'], validate=True), a['ext']))
        except Exception: skipped.append('recording %s|%s (damaged)' % (a['id'], a['lang']))
    for lang in ('luo', 'en'):                   # recordings made outside the app win over app recordings
        for f in sorted(glob.glob(os.path.join(cdir, 'audio', lang, '*'))):
            base, ext = os.path.splitext(os.path.basename(f)); ext = ext.lstrip('.').lower()
            if IDRE.match(base) and ext in ('webm', 'm4a', 'ogg', 'mp3', 'wav'):
                jobs = [j for j in jobs if not (j[0] == lang and j[1] == base)] + [(lang, base, open(f, 'rb').read(), ext)]
    cache = os.path.join(root, '.cache', 'audio')
    with ThreadPoolExecutor(max_workers=os.cpu_count() or 2) as pool:
        done = list(pool.map(lambda j: (j[0], j[1]) + polish(j[2], j[3], cache), jobs))
    for lang, id_, data, ext in done:
        open(os.path.join(root, 'audio', lang, id_ + '.' + ext), 'wb').write(data)
        manifest[lang][id_] = ext + ':' + hashlib.sha1(data).hexdigest()[:8]    # fingerprint: tablets fetch a file again only when it changed
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
    say('contributions: %d files, %d entries, %d words, %d recordings (%s), %d people, %d disagreements' % (len(files), len(E), len(A), len(manifest['luo']) + len(manifest['en']), 'polished' if FFMPEG else 'not polished: no ffmpeg', len(names), len(conf)))

if __name__ == '__main__':
    main()
