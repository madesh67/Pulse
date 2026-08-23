import os
import json
from PIL import Image

def main():
    cwd = os.getcwd()
    frames_dir = os.path.join(cwd, "public", "assets", "frames")
    
    if not os.path.isdir(frames_dir):
        print(f"Directory {frames_dir} not found.")
        return
        
    frames = sorted([f for f in os.listdir(frames_dir) if f.startswith("frame-") and f.endswith(".webp")])
    print(f"Analyzing {len(frames)} frames...")
    
    min_x = 1920
    max_x = 0
    min_y = 1080
    max_y = 0
    
    # Store per-frame bounds for detailed analysis
    frame_bounds = {}
    
    for filename in frames:
        filepath = os.path.join(frames_dir, filename)
        with Image.open(filepath) as img:
            # Convert to RGB if it isn't
            img_rgb = img.convert("RGB")
            w, h = img_rgb.size
            
            # Find non-background pixels. Background is roughly #f7f7f7 (247, 247, 247)
            # We will use a threshold of difference from 247 to find watch pixels.
            # If a pixel deviates from (247, 247, 247) by more than 5 in any channel, it's watch/shadow.
            # Wait, let's do a strict check.
            pixels = img_rgb.load()
            
            f_min_x, f_max_x = w, 0
            f_min_y, f_max_y = h, 0
            
            for y in range(h):
                for x in range(w):
                    r, g, b = pixels[x, y]
                    # Check deviation from background color (around 247, 247, 247)
                    if abs(r - 247) > 4 or abs(g - 247) > 4 or abs(b - 247) > 4:
                        if x < f_min_x: f_min_x = x
                        if x > f_max_x: f_max_x = x
                        if y < f_min_y: f_min_y = y
                        if y > f_max_y: f_max_y = y
            
            if f_max_x >= f_min_x and f_max_y >= f_min_y:
                frame_bounds[filename] = {
                    "min_x": f_min_x,
                    "max_x": f_max_x,
                    "min_y": f_min_y,
                    "max_y": f_max_y,
                    "width": f_max_x - f_min_x,
                    "height": f_max_y - f_min_y
                }
                
                # Update global bounds
                if f_min_x < min_x: min_x = f_min_x
                if f_max_x > max_x: max_x = f_max_x
                if f_min_y < min_y: min_y = f_min_y
                if f_max_y > max_y: max_y = f_max_y
            else:
                frame_bounds[filename] = None

    print("\nGlobal Watch Bounds across all frames (in 1920x1080 space):")
    print(f"X range: {min_x} to {max_x} (Width: {max_x - min_x}px, Center X: {(min_x + max_x)/2:.1f}px)")
    print(f"Y range: {min_y} to {max_y} (Height: {max_y - min_y}px, Center Y: {(min_y + max_y)/2:.1f}px)")
    
    # Find frames with the widest or tallest bounds
    widest_frame = max(frame_bounds.keys(), key=lambda k: frame_bounds[k]["width"] if frame_bounds[k] else 0)
    tallest_frame = max(frame_bounds.keys(), key=lambda k: frame_bounds[k]["height"] if frame_bounds[k] else 0)
    
    print(f"\nWidest Frame: {widest_frame} with width {frame_bounds[widest_frame]['width']}px (X: {frame_bounds[widest_frame]['min_x']} to {frame_bounds[widest_frame]['max_x']})")
    print(f"Tallest Frame: {tallest_frame} with height {frame_bounds[tallest_frame]['height']}px (Y: {frame_bounds[tallest_frame]['min_y']} to {frame_bounds[tallest_frame]['max_y']})")
    
    # Save the bounds mapping for reference if needed
    with open("scripts/frame_bounds.json", "w") as f:
        json.dump({
            "global": {
                "min_x": min_x,
                "max_x": max_x,
                "min_y": min_y,
                "max_y": max_y
            },
            "frames": frame_bounds
        }, f, indent=2)

if __name__ == "__main__":
    main()
