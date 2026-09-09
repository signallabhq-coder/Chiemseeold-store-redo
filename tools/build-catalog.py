"""scratch catalog.json (scraped) -> public/data/catalog.json (clean, typed, German, with local image paths)."""
import json, re, sys, pathlib

SRC = pathlib.Path(sys.argv[1])
DST = pathlib.Path(__file__).resolve().parents[1] / "public" / "data" / "catalog.json"
raw = json.load(open(SRC, encoding="utf-8"))
SWATCHES = json.load(open(pathlib.Path(__file__).with_name("swatches.json"), encoding="utf-8")) if pathlib.Path(__file__).with_name("swatches.json").exists() else {}
FACES = json.load(open(pathlib.Path(__file__).with_name("faces.json"), encoding="utf-8")) if pathlib.Path(__file__).with_name("faces.json").exists() else {}
SHOTS = json.load(open(pathlib.Path(__file__).with_name("shots.json"), encoding="utf-8")) if pathlib.Path(__file__).with_name("shots.json").exists() else {}

TYPES = [  # (regex on name, type label, sub-nav group)
    (r"skijacke|skihose|skioverall|softshell|funktionsjacke|funktionshose|funktional", "Ski & Funktion"),
    (r"fleece|sherpa|teddy", "Fleece"),
    (r"troyer|sweater|sweatshirt|hoodie|kapuzen|pullover|sweatjacke|crewneck|rundhals", "Sweatshirts & Hoodies"),
    (r"t-shirt|shirt|top|tank|lycra|rollkragen|turtleneck|polo|hemd", "Shirts & Tops"),
    (r"mantel|jacke|weste|puffer|hybrid|parka", "Jacken & Westen"),
    (r"hose|shorts|jogging|cargo|pants|leggings", "Hosen & Shorts"),
    (r"bade|bikini|badeanzug|swim|surf|board", "Bademode"),
    (r"cap|beanie|mütze|muetze|handschuh|ohrenw|socke", "Mützen, Caps & Socken"),
    (r"tasche|hipbag|bag|handtuch|strandtuch|schwimmschuh|dry-suit|dry suit", "Taschen & Strand"),
]
def type_of(name):
    n = name.lower()
    for rx, label in TYPES:
        if re.search(rx, n): return label
    return "Weitere"

def gender_of(fam, v):
    text = (v["title"] + " " + v["desc"]).lower()
    cats = fam["cats"]
    if "kinder" in cats or re.search(r"mädchen|jungen|kids|kinder", v["title"].lower()): return "kinder"
    if "accessoires" in cats: return "accessoires"
    if "damen" in cats and "herren" in cats: return "unisex"
    if "damen" in cats: return "damen"
    if "herren" in cats: return "herren"
    if re.search(r"\bdamen\b|\bfrauen\b|bikini|badeanzug", text): return "damen"
    if re.search(r"\bherren\b|\bmänner\b", text): return "herren"
    if re.search(r"unisex|cap|beanie|handtuch|tasche", text): return "accessoires"
    return "herren"

def slug(s):
    s = s.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def local(url, style):
    return f"/assets/products/{style}/{url.split('/')[-1]}"

products = []
for fam in raw:
    if not fam["variants"]: continue
    st = fam["style"]
    v0 = fam["variants"][0]
    name = re.sub(r"\s*\|.*$", "", v0["title"]).strip()
    name = re.sub(r"\s*[–—-]\s*", " ", name) if " – " in name or " — " in name else name  # strip dash separators only
    variants = []
    for v in fam["variants"]:
        sizes = [x.replace("\/", "/").replace("\/", "/").replace(" A_B", " A/B").replace(" C_D", " C/D") for x in (v["sizes"] or [])]
        if not sizes and gender_of(fam, v) == "kinder": sizes = ["128", "140", "152", "164", "176"]
        variants.append({
            "slug": slug(v["color"]), "color": v["color"], "main": v["main_color"],
            "price": v["price"], "oldPrice": v["old_price"],
            "sizes": sizes, "images": [local(u, st) for u in v["images"][:4]],
            "shot": SHOTS.get(local(v["images"][0], st), "body") if v["images"] else "body",
            "swatch": SWATCHES.get(local(v["images"][0], st)) if v["images"] else None,
            "face": FACES.get(local(v["images"][0], st), 0) if v["images"] else 0,
            "source": v["url"],
        })
    gender = gender_of(fam, v0)
    prices = [v["price"] for v in variants if v["price"]]
    products.append({
        "id": st, "name": name, "gender": gender, "type": type_of(name),
        "price": min(prices) if prices else None,
        "oldPrice": max([v["oldPrice"] for v in variants if v["oldPrice"]] or [None]) if any(v["oldPrice"] for v in variants) else None,
        "sale": any(v["oldPrice"] for v in variants),
        "isNew": st.startswith("3326") and "outlet" not in fam["cats"],
        "material": v0["material"], "desc": v0["desc"],
        "sizeKind": "none" if not any(v["sizes"] for v in variants) else ("kids" if gender == "kinder" else "apparel"),
        "variants": variants,
    })

# stable, merchandised order: new first, then by gender, then price desc
order = {"herren": 0, "damen": 1, "unisex": 2, "kinder": 3, "accessoires": 4}
products.sort(key=lambda p: (not p["isNew"], order[p["gender"]], -(p["price"] or 0)))
DST.parent.mkdir(parents=True, exist_ok=True)
DST.write_text(json.dumps({"generated": "2026-09-09", "source": "chiemsee.com", "products": products}, ensure_ascii=False, indent=1), encoding="utf-8")
from collections import Counter
print(len(products), "products;", sum(len(p["variants"]) for p in products), "variants")
print("gender", Counter(p["gender"] for p in products)); print("type", Counter(p["type"] for p in products))
print("sale", sum(p["sale"] for p in products), "new", sum(p["isNew"] for p in products))
for p in products[:5]: print(" ", p["id"], p["gender"], p["type"], p["price"], p["name"])
