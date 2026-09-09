"""Give white-ground flat-lay product photos the studio grey ground (#DEDFE3) so every tile shares one ground.
Flood-fills from the image border over near-white pixels only (the garment itself is untouched), then rebuilds the thumb."""
import json, pathlib, numpy as np
from PIL import Image
from collections import deque

ROOT = pathlib.Path(__file__).resolve().parents[1]
GROUND = np.array([0xDE, 0xDF, 0xE3], dtype=np.uint8)
shots = json.load(open(ROOT / 'tools/shots.json'))

def fill(im):
    a = np.array(im.convert('RGB'))
    h, w = a.shape[:2]
    near_white = (a.min(axis=2) > 232)
    mask = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near_white[y, x] and not mask[y, x]: mask[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near_white[y, x] and not mask[y, x]: mask[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and near_white[ny, nx] and not mask[ny, nx]:
                mask[ny, nx] = True; q.append((ny, nx))
    # soft edge: blend by how white the pixel is (keeps soft shadows under the garment)
    t = np.clip((a.min(axis=2).astype(float) - 232) / 23.0, 0, 1)[..., None]
    out = a.astype(float)
    g = GROUND.astype(float)
    blend = out * (1 - t) + g * t
    out[mask] = blend[mask]
    return Image.fromarray(out.astype(np.uint8))

n = 0
for rel, cls in shots.items():
    if cls != 'flat': continue
    f = ROOT / 'public' / rel.lstrip('/')
    im = Image.open(f)
    a = np.array(im.convert('RGB'))
    if a[5, 5].min() < 232: continue  # already grey
    out = fill(im)
    out.save(f, 'JPEG', quality=86, optimize=True, progressive=True)
    th = f.with_name(f.stem + '.thumb.jpg')
    t = out.copy(); t.thumbnail((480, 10000), Image.LANCZOS); t.save(th, 'JPEG', quality=82, optimize=True, progressive=True)
    n += 1
print('normalized', n, 'flat-lay images')
