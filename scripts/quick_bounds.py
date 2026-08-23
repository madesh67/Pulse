import os
from PIL import Image

def analyze_frame(filepath):
    with Image.open(filepath) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        pixels = img_rgb.load()
        
        min_x, max_x = w, 0
        min_y, max_y = h, 0
        
        for y in range(h):
            for x in range(w):
                r, g, b = pixels[x, y]
                # Check deviation from background color #f7f7f7 (247, 247, 247)
                if abs(r - 247) > 4 or abs(g - 247) > 4 or abs(b - 247) > 4:
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
                    
        return {
            "min_x": min_x,
            "max_x": max_x,
            "min_y": min_y,
            "max_y": max_y,
            "width": max_x - min_x,
            "height": max_y - min_y
        }

def main():
    cwd = os.getcwd()
    frames_dir = os.path.join(cwd, "public", "assets", "frames")
    landmarks = [0, 60, 121, 181, 241]
    
    print("ANALYZING KEY LANDMARK FRAMES:")
    print("-" * 60)
    for idx in landmarks:
        filename = f"frame-{idx:03d}.webp"
        filepath = os.path.join(frames_dir, filename)
        if os.path.exists(filepath):
            bounds = analyze_frame(filepath)
            print(f"Frame {idx:03d} ({filename}):")
            print(f"  X Bounds: {bounds['min_x']} to {bounds['max_x']} (Width: {bounds['width']}px, Center X: {(bounds['min_x'] + bounds['max_x'])/2:.1f})")
            print(f"  Y Bounds: {bounds['min_y']} to {bounds['max_y']} (Height: {bounds['height']}px, Center Y: {(bounds['min_y'] + bounds['max_y'])/2:.1f})")
        else:
            print(f"Frame {idx:03d} not found at {filepath}")
    print("-" * 60)

if __name__ == "__main__":
    main()
