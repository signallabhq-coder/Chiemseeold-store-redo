"""Resize scraped Chiemsee product masters -> public/assets/products/<style>/<file>.jpg (1200w) + <file>.thumb.jpg (480w)."""
import sys, pathlib, concurrent.futures as cf
from PIL import Image

SRC = pathlib.Path(sys.argv[1])
DST = pathlib.Path(__file__).resolve().parents[1] / "public" / "assets" / "products"

def work(p):
    out_dir = DST / p.parent.name; out_dir.mkdir(parents=True, exist_ok=True)
    big, thumb = out_dir / p.name, out_dir / (p.stem + ".thumb.jpg")
    if big.exists() and thumb.exists(): return 0
    im = Image.open(p).convert("RGB")
    for path, w in ((big, 1200), (thumb, 480)):
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(path, "JPEG", quality=82, optimize=True, progressive=True)
    return 1

if __name__ == "__main__":
    files = sorted(SRC.rglob("*.jpg"))
    with cf.ProcessPoolExecutor(6) as ex:
        n = sum(ex.map(work, files, chunksize=8))
    print("processed", n, "of", len(files))
