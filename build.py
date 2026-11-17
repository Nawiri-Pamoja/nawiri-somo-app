#!/usr/bin/env python3
"""Builds index.html from src/.  Usage: python3 build.py      (needs: pip install fonttools)
   First merges the helpers' exports in contributions/ (tools/merge_contributions.py), then builds.
   index.html is one self-contained file: app code, content, logo and the school font are all inside it."""
import base64, os, sys, tempfile
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, 'tools'))
import make_font, merge_contributions

merge_contributions.main(here)

src = lambda n: open(os.path.join(here, 'src', n), encoding='utf-8').read()
tmp = os.path.join(tempfile.mkdtemp(), 'nphand.woff')
make_font.main(os.path.join(here, 'src', 'data_hand.js'), tmp)
font = base64.b64encode(open(tmp, 'rb').read()).decode()
css = ("@font-face{font-family:NPHand;src:url(data:font/woff;base64,%s) format('woff');font-display:block;size-adjust:112%%}\n" % font) + src('app.css')
js = '\n'.join(src(n) for n in ['logo.js', 'data_hand.js', 'data_words.js', 'data_talk.js', 'data_read.js', 'data_community.js', 'app_core.js', 'app_session.js', 'app_write.js', 'app_views.js'])
html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#138a40">
<title>Nawiri Pamoja – Dholuo ↔ English</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<style>
{css}</style>
</head>
<body>
<header><img id="hlogo" class="logo" alt=""><h1>Nawiri Pamoja</h1><div id="hstat"></div></header>
<main id="app"></main>
<nav id="nav"></nav>
<div id="toast"></div>
<script>
{js}
</script>
</body>
</html>
'''
out = sys.argv[1] if len(sys.argv) > 1 else here
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
print('built', os.path.join(out, 'index.html'), len(html.encode()), 'bytes')
