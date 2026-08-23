import os
from PIL import Image

def main():
    cwd = os.getcwd()
    frames_dir = os.path.join(cwd, "public", "assets", "frames")
    filepath = os.path.join(frames_dir, "frame-181.webp")
    
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
        
    with Image.open(filepath) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        pixels = img_rgb.load()
        
        print("Checking first 100 columns of Frame 181 for non-background pixels:")
        # We will scan columns from x=0 to x=150, and print rows that have deviation
        has_deviation = False
        for x in range(150):
            deviating_y = []
            for y in range(h):
                r, g, b = pixels[x, y]
                if abs(r - 247) > 4 or abs(g - 247) > 4 or abs(b - 247) > 4:
                    deviating_y.append(y)
            if deviating_y:
                has_deviation = True
                print(f"  Col {x:03d} has {len(deviating_y)} deviating pixels. Y range: {min(deviating_y)} to {max(deviating_y)}. Typical color: {pixels[x, deviating_y[len(deviating_y)//2]]}")
                if x >= 10 and x % 10 == 0:
                    print("  ...")
            else:
                pass
                
        if not has_deviation:
            print("  No deviation found in first 150 columns!")

if __name__ == "__main__":
    main()
