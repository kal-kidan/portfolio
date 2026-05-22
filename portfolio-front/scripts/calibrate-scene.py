"""Print shelf + drive rects from kals-portofolio-os.png. Run from portfolio-front/."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "src/assets/home/kals-portofolio-os.png"
W, H = 1672, 941
RACK_SLOTS = 8
DISK_SLOT_START = 2
DISK_IDS = [
    "bio",
    "experience",
    "projects",
    "skills",
    "contact",
    "resume",
]


def pct(px: float, axis: str) -> float:
    return round(px / (W if axis == "x" else H) * 100, 2)


def main() -> None:
    img = Image.open(PNG).convert("RGB")
    x0, x1 = int(W * 0.018), int(W * 0.125)

    scores = []
    for y in range(int(H * 0.12), int(H * 0.52)):
        n = sum(
            1
            for x in range(x0, x1)
            if 25 < sum(img.getpixel((x, y))) / 3 < 210
        )
        scores.append((y, n))

    max_n = max(n for _, n in scores)
    active = [y for y, n in scores if n > max_n * 0.25]
    rack_top, rack_bottom = min(active), max(active)
    slot_h = (rack_bottom - rack_top) / RACK_SLOTS
    half_h = int(H * (slot_h / H * 100 * 0.82) / 100 / 2)

    print("SHELF_SLOTS = {")
    for i, disk_id in enumerate(DISK_IDS):
        cy = int(rack_top + (DISK_SLOT_START + i + 0.5) * slot_h)
        top, bot = cy - half_h, cy + half_h
        xs = [
            x
            for y in range(top, bot + 1)
            for x in range(x0, x1)
            if 25 < sum(img.getpixel((x, y))) / 3 < 210
        ]
        left = min(xs) - int(W * 0.004) if xs else x0
        right = max(xs) + int(W * 0.004) if xs else x1
        print(
            f"  {disk_id}: {{ left: {pct(left, 'x')}, top: {pct(top, 'y')}, "
            f"width: {pct(right - left, 'x')}, height: {pct(bot - top, 'y')} }},"
        )
    print("}")

    x0d, x1d = int(W * 0.36), int(W * 0.51)
    dark = [
        y
        for y in range(int(H * 0.345), int(H * 0.375))
        if sum(1 for x in range(x0d, x1d) if sum(img.getpixel((x, y))) / 3 < 38)
        > (x1d - x0d) * 0.45
    ]
    top, bot = min(dark) - int(H * 0.003), max(dark) + int(H * 0.003)
    mid = (top + bot) // 2
    xs = [x for x in range(x0d, x1d) if sum(img.getpixel((x, mid))) / 3 < 45]
    left, right = min(xs) - int(W * 0.005), max(xs) + int(W * 0.005)
    print(
        f"\nDISK_DRIVE_RECT = {{ left: {pct(left, 'x')}, top: {pct(top, 'y')}, "
        f"width: {pct(right - left, 'x')}, height: {pct(bot - top, 'y')} }}"
    )

    preview = img.copy()
    draw = ImageDraw.Draw(preview)
    for i, disk_id in enumerate(DISK_IDS):
        cy = int(rack_top + (DISK_SLOT_START + i + 0.5) * slot_h)
        top, bot = cy - half_h, cy + half_h
        draw.rectangle(
            [int(W * 0.014), top, int(W * 0.13), bot],
            outline=(80, 255, 120),
            width=2,
        )
        draw.text((int(W * 0.016), top + 2), disk_id[:3], fill=(255, 255, 255))
    preview.save(ROOT / "src/assets/home/_calibration-preview.png")
    print("\nPreview: src/assets/home/_calibration-preview.png")


if __name__ == "__main__":
    main()
