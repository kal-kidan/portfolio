"""Remove near-white backgrounds from disc PNGs (in-place)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

DISCS_DIR = Path(__file__).resolve().parents[1] / "src/assets/home/dragged-imgs"
WHITE_THRESH = 28  # max RGB distance from pure white to flood-fill


def is_background(r: int, g: int, b: int) -> bool:
    return (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2 <= WHITE_THRESH**2


def flood_transparent(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    visited = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        i = y * w + x
        if visited[i]:
            return
        r, g, b, _ = pixels[x, y]
        if not is_background(r, g, b):
            return
        visited[i] = 1
        q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        if x > 0:
            push(x - 1, y)
        if x < w - 1:
            push(x + 1, y)
        if y > 0:
            push(x, y - 1)
        if y < h - 1:
            push(x, y + 1)

    # Soften halos on remaining edge pixels
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            dist = ((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2) ** 0.5
            if dist < 42:
                fade = int(255 * min(1.0, (dist - 12) / 30))
                pixels[x, y] = (r, g, b, min(a, max(0, fade)))

    return rgba


def main() -> None:
    for path in sorted(DISCS_DIR.glob("*-disc.png")):
        out = flood_transparent(Image.open(path))
        out.save(path, optimize=True)
        print(f"OK {path.name} -> RGBA transparent bg")


if __name__ == "__main__":
    main()
