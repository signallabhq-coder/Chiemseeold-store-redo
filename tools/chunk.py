"""Downscale DPR2 full-page renders to 1440 wide and split into 2400px-tall chunks: name-0.png, name-1.png ..."""
import sys, pathlib
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
for f in sys.argv[1:]:
    p = pathlib.Path(f); im = Image.open(p)
    w = 1440 if im.width > 1440 else im.width; h = round(im.height * w / im.width); im = im.resize((w, h), Image.LANCZOS)
    n = (h + 2399) // 2400
    for i in range(n): im.crop((0, i * 2400, w, min(h, (i + 1) * 2400))).save(p.with_name(f"{p.stem}-{i}.png"))
    print(p.name, im.size, n, "chunks")
