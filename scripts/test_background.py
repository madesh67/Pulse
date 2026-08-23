import os
from PIL import Image

def analyze_borders(frame_indices, target_color=(247, 247, 247)):
    cwd = os.getcwd()
    frames_dir = os.path.join(cwd, "public", "assets", "frames")
    
    print(f"Analyzing borders against target color {target_color}...")
    print(f"{'Frame':<10} | {'Edge Min RGB':<18} | {'Edge Max RGB':<18} | {'Edge Avg RGB':<18} | {'Max Deviation':<15}")
    print("-" * 85)
    
    for idx in frame_indices:
        filename = f"frame-{idx:03d}.webp"
        filepath = os.path.join(frames_dir, filename)
        if not os.path.exists(filepath):
            # Try JPG if webp doesn't exist
            filename = f"frame-{idx:03d}.jpg"
            filepath = os.path.join(frames_dir, filename)
            
        if not os.path.exists(filepath):
            print(f"Frame {idx:03d} not found.")
            continue
            
        with Image.open(filepath) as img:
            w, h = img.size
            pixels = img.load()
            
            # Sample all pixels along the 4 outer edges
            edge_pixels = []
            
            # Top and bottom edges
            for x in range(w):
                edge_pixels.append(pixels[x, 0])
                edge_pixels.append(pixels[x, h - 1])
                
            # Left and right edges
            for y in range(h):
                edge_pixels.append(pixels[0, y])
                edge_pixels.append(pixels[w - 1, y])
                
            # Compute stats
            rs = [p[0] for p in edge_pixels]
            gs = [p[1] for p in edge_pixels]
            bs = [p[2] for p in edge_pixels]
            
            min_rgb = (min(rs), min(gs), min(bs))
            max_rgb = (max(rs), max(gs), max(bs))
            avg_rgb = (int(sum(rs)/len(rs)), int(sum(gs)/len(gs)), int(sum(bs)/len(bs)))
            
            # Max deviation from target_color (247, 247, 247)
            max_dev = max(
                max(abs(p[0] - target_color[0]) + abs(p[1] - target_color[1]) + abs(p[2] - target_color[2]) for p in edge_pixels),
                0
            )
            
            # Output row
            print(f"Frame {idx:03d} | {str(min_rgb):<18} | {str(max_rgb):<18} | {str(avg_rgb):<18} | {max_dev:<15}")

if __name__ == "__main__":
    analyze_borders([0, 60, 120, 180, 241])
