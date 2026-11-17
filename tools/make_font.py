#!/usr/bin/env python3
"""Builds the school-print font "NPHand" from the stroke data in data_hand.js.
   The app uses the same strokes for tracing, so the letters children read and the letters they write are identical.
   Usage: python3 make_font.py path/to/data_hand.js out.woff        (needs: pip install fonttools)"""
import math, re, sys
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

S = 8          # font units per drawing unit (top line 800, middle line 400, base line 0, descender -400)
SW = 10.5      # stroke width in drawing units
GAP = 7        # space between letters
DOT = 0.62     # dot radius in stroke widths

def parse(path):
    src = open(path, encoding='utf-8').read()
    body = src[src.index('const HAND'):src.index('};', src.index('const HAND'))]
    out = {}
    for m in re.finditer(r"""^\s*(?:'(.)'|"(.)"|(\w)):'([^']*)'""", body, re.M):
        out[m.group(1) or m.group(2) or m.group(3)] = m.group(4)
    return out

def nums(s): return [float(v) for v in s.split(',')]

def seg_points(seg, cur):
    k, v = seg[0], nums(seg[1:])
    if k == 'L': return [(v[0], v[1]), (v[2], v[3])] if len(v) == 4 else [cur, (v[0], v[1])]
    if k == 'P': return [(v[i], v[i + 1]) for i in range(0, len(v), 2)]
    if k == 'D': return [(v[0], v[1])]
    if k == 'Q':
        (x0, y0, cx, cy, x1, y1) = v
        return [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in [i / 24 for i in range(25)]]
    if k == 'A':
        cx, cy, rx, ry, a0, a1 = v
        n = max(2, int(abs(a1 - a0) / 4))
        return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
    raise ValueError(seg)

def stroke_points(st):
    pts = []
    for seg in st.split(' '):
        if not seg: continue
        p = seg_points(seg, pts[-1] if pts else (0, 0))
        if pts and math.dist(pts[-1], p[0]) < 0.6: p = p[1:]
        pts += p
    return pts

def glyph_strokes(spec):
    parts = spec.split('|')
    return float(parts[0]), [stroke_points(s) for s in parts[1:] if s]

def split_corners(pts, limit=40):
    pieces, cur = [], [pts[0]]
    for i in range(1, len(pts)):
        cur.append(pts[i])
        if 0 < i < len(pts) - 1:
            a = math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
            b = math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])
            d = abs((b - a + math.pi) % (2 * math.pi) - math.pi)
            if math.degrees(d) > limit: pieces.append(cur); cur = [pts[i]]
    pieces.append(cur)
    return pieces

def dp(pts, tol):
    if len(pts) < 3: return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    L = math.hypot(x1 - x0, y1 - y0) or 1e-9
    best, bi = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs((x1 - x0) * (y0 - pts[i][1]) - (x0 - pts[i][0]) * (y1 - y0)) / L
        if d > best: best, bi = d, i
    if best <= tol: return [pts[0], pts[-1]]
    return dp(pts[:bi + 1], tol)[:-1] + dp(pts[bi:], tol)

def outline(piece, r):
    if len(piece) == 1 or all(math.dist(piece[0], p) < 0.5 for p in piece):
        (x, y), rd = piece[0], r * DOT / 0.5
        return [[(x + rd * math.cos(2 * math.pi * i / 24), y + rd * math.sin(2 * math.pi * i / 24)) for i in range(24)]]
    n = len(piece); L, R = [], []
    for i in range(n):
        a, b = piece[max(i - 1, 0)], piece[min(i + 1, n - 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]; l = math.hypot(tx, ty) or 1; tx, ty = tx / l, ty / l
        nx, ny = -ty, tx
        L.append((piece[i][0] + nx * r, piece[i][1] + ny * r)); R.append((piece[i][0] - nx * r, piece[i][1] - ny * r))
    def cap(p, q, c):   # half circle around c from p to q, turning away from the stroke
        a0 = math.atan2(p[1] - c[1], p[0] - c[0]); return [(c[0] + r * math.cos(a0 - math.pi * k / 10), c[1] + r * math.sin(a0 - math.pi * k / 10)) for k in range(1, 10)]
    L, R = dp(L, 1.0), dp(R, 1.0)
    ring = L + cap(L[-1], R[-1], piece[-1]) + R[::-1] + cap(R[0], L[0], piece[0])
    return [ring]

def area(c): return sum(c[i][0] * c[(i + 1) % len(c)][1] - c[(i + 1) % len(c)][0] * c[i][1] for i in range(len(c))) / 2

def main(js, out):
    hand = parse(js)
    fb = FontBuilder(1000, isTTF=True)
    order, cmap, glyphs, metrics = ['.notdef', 'space'], {32: 'space', 160: 'space'}, {}, {}
    pen = TTGlyphPen(None); pen.moveTo((50, 0)); pen.lineTo((50, 700)); pen.lineTo((400, 700)); pen.lineTo((400, 0)); pen.closePath()
    glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (450, 50)
    glyphs['space'] = TTGlyphPen(None).glyph(); metrics['space'] = (34 * S, 0)
    for ch, spec in hand.items():
        w, strokes = glyph_strokes(spec)
        ox = GAP + SW / 2
        pen = TTGlyphPen(None)
        for st in strokes:
            fp = [((x + ox) * S, (100 - y) * S) for x, y in st]
            for piece in split_corners(fp):
                for ring in outline(piece, SW * S / 2):
                    if area(ring) > 0: ring = ring[::-1]       # TrueType: clockwise
                    pts = [(round(x), round(y)) for x, y in ring]
                    pts = [p for i, p in enumerate(pts) if p != pts[i - 1]]
                    pen.moveTo(pts[0]); [pen.lineTo(p) for p in pts[1:]]; pen.closePath()
        name = 'uni%04X' % ord(ch); order.append(name); cmap[ord(ch)] = name
        g = pen.glyph(); glyphs[name] = g
        metrics[name] = (round((w + SW + 2 * GAP) * S), 0)
    fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs)
    gl = fb.font['glyf']
    for n in order:
        g = gl[n]; g.recalcBounds(gl) if hasattr(g, 'recalcBounds') else None
        metrics[n] = (metrics[n][0], getattr(g, 'xMin', 0) or 0)
        if getattr(g, 'numberOfContours', 0) > 0: g.flags[0] |= 0x40       # overlapping strokes
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=930, descent=-470)
    fb.setupNameTable({'familyName': 'NPHand', 'styleName': 'Regular', 'copyright': 'Copyright (c) 2026, Nawiri Pamoja (https://nawiri-pamoja.org)', 'licenseDescription': 'This Font Software is licensed under the SIL Open Font License, Version 1.1. https://openfontlicense.org', 'licenseInfoURL': 'https://openfontlicense.org'})
    fb.setupOS2(sTypoAscender=930, sTypoDescender=-470, sTypoLineGap=0, usWinAscent=1000, usWinDescent=520, sxHeight=400, sCapHeight=800, achVendID='NAWI')
    fb.setupPost()
    if out.endswith('.woff'): fb.font.flavor = 'woff'
    fb.save(out)
    print('font', out, len(hand), 'glyphs')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
