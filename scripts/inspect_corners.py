import os
from PIL import Image

def check_corners(idx):
    cwd = os.getcwd()
    filename = f"frame-{idx:03d}.webp"
    filepath = os.path.join(cwd, "public", "assets", "frames", filename)
    if not os.path.exists(filepath):
        filename = f"frame-{idx:03d}.jpg"
        filepath = os.path.join(cwd, "public", "assets", "frames", filename)
        
    if not os.path.exists(filepath):
        print(f"Frame {idx:03d} not found.")
        return
        
    with Image.open(filepath) as img:
        w, h = img.size
        corners = [
            img.getpixel((0, 0)),
            img.getpixel((w - 1, 0)),
            img.getpixel((0, h - 1)),
            img.getpixel((w - 1, h - 1))
        ]
        print(f"Frame {idx:03d} Corners: {corners}")

if __name__ == "__main__":
    for idx in [0, 60, 120, 180, 241]:
        check_corners(idx)
