#!/usr/bin/env python3
"""Turn an exported voices file (dholuo-voices-*.txt) into hosted audio files.

Usage:  python3 tools/pack_to_audio.py dholuo-voices-2026-11-20.txt
Writes  audio/luo/<id>.<ext>, audio/en/<id>.<ext>  and updates audio/manifest.json.
Afterwards: raise VERSION in sw.js (e.g. np-v2) and upload the folder again.
"""
import base64, json, os, re, sys

EXT = {'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/ogg': 'ogg'}
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pack = json.load(open(sys.argv[1], encoding='utf-8'))
assert pack.get('app') == 'nawiri-pamoja-audio', 'not a voices file'

mpath = os.path.join(root, 'audio', 'manifest.json')
manifest = json.load(open(mpath)) if os.path.exists(mpath) else {'luo': {}, 'en': {}}
manifest.setdefault('luo', {}); manifest.setdefault('en', {})

n = 0
for key, v in pack['audio'].items():
    m = re.fullmatch(r'([a-z0-9_-]+)\|(luo|en)', key)
    mime = (v.get('mime') or '').split(';')[0].strip().lower()
    if not m or mime not in EXT:
        print('skipped', key); continue
    id_, lang = m.groups()
    ext = EXT[mime]
    folder = os.path.join(root, 'audio', lang)
    os.makedirs(folder, exist_ok=True)
    for old in os.listdir(folder):               # replace an older take of the same word
        if old.rsplit('.', 1)[0] == id_:
            os.remove(os.path.join(folder, old))
    with open(os.path.join(folder, id_ + '.' + ext), 'wb') as f:
        f.write(base64.b64decode(v['data']))
    manifest[lang][id_] = ext
    n += 1
json.dump(manifest, open(mpath, 'w'), indent=1, sort_keys=True)
print('wrote', n, 'recordings; manifest updated')
