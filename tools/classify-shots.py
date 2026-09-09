"""Classify every product image: flat (white ground), face (person, head visible), body (person, headless/back). -> tools/shots.json"""
import json, pathlib, cv2, numpy as np
ROOT = pathlib.Path(__file__).resolve().parents[1]
cat = json.load(open(ROOT / 'public/data/catalog.json', encoding='utf-8'))['products']
casc = cv2.CascadeClassifier(str(pathlib.Path(__file__).with_name('haarcascade_frontalface_default.xml')))
prof = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml') if pathlib.Path(cv2.data.haarcascades + 'haarcascade_profileface.xml').exists() else None
out = {}
for p in cat:
    for v in p['variants']:
        for rel in v['images']:
            f = ROOT / 'public' / rel.lstrip('/')
            im = cv2.imread(str(f))
            if im is None: continue
            h, w = im.shape[:2]
            corners = np.array([im[5, 5], im[5, w - 6], im[h - 6, 5], im[h - 6, w - 6]]).astype(int)
            flat = corners.min() > 240
            small = cv2.resize(im, (600, int(600 * h / w)))
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            faces = casc.detectMultiScale(gray[: int(gray.shape[0] * 0.45)], 1.1, 5, minSize=(40, 40))
            cls = 'flat' if flat else ('face' if len(faces) else 'body')
            out[rel] = cls
json.dump(out, open(pathlib.Path(__file__).with_name('shots.json'), 'w'), indent=0)
from collections import Counter; print(Counter(out.values()))
