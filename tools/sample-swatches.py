"""Sample the garment colour from each variant's first photo (centre patch, median) -> tools/swatches.json {image: '#rrggbb'}"""
import json, pathlib, numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[1]
cat = json.load(open(ROOT / 'public/data/catalog.json', encoding='utf-8'))['products']
shots = json.load(open(ROOT / 'tools/shots.json'))
out = {}
for p in cat:
    for v in p['variants']:
        rel = v['images'][0]; im = Image.open(ROOT / 'public' / rel.lstrip('/')).convert('RGB')
        a = np.asarray(im.resize((300, int(300 * im.height / im.width)))).astype(int)
        h, w = a.shape[:2]
        # garment region: for on-model shots the torso sits around 30-60% height; for flat-lays the centre
        y0, y1 = (int(h * .30), int(h * .60)) if shots.get(rel) != 'flat' else (int(h * .35), int(h * .65))
        patch = a[y0:y1, int(w * .35):int(w * .65)].reshape(-1, 3)
        # drop near-ground and near-white pixels (studio grey / skin-free assumption is good enough for a swatch)
        ground = np.array([0xDE, 0xDF, 0xE3]); d = np.abs(patch - ground).sum(1)
        keep = patch[(d > 45) & (patch.min(1) < 235)]
        if len(keep) < 50: keep = patch
        med = np.median(keep, axis=0).astype(int)
        out[rel] = '#%02x%02x%02x' % tuple(med)
json.dump(out, open(ROOT / 'tools/swatches.json', 'w'), indent=0); print(len(out), 'swatches')
