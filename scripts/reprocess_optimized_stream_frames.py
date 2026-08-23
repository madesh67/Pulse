import os
import sys
import json
import numpy as np
from PIL import Image, ImageFilter
from concurrent.futures import ThreadPoolExecutor

def process_single_frame(args):
    src_path, dest_webp_path, new_idx = args
    try:
        with Image.open(src_path) as img:
            img = img.convert("RGB")
            
            # 1. Clean background to pure #ffffff
            arr = np.array(img, dtype=np.float32)
            mask = (arr[:, :, 0] >= 245) & (arr[:, :, 1] >= 245) & (arr[:, :, 2] >= 245)
            arr[mask] = [255.0, 255.0, 255.0]
            cleaned_img = Image.fromarray(arr.astype(np.uint8))

            # 2. Crisp 1920x1080 Lanczos resize (fast, light & retina-sharp)
            resized = cleaned_img.resize((1920, 1080), Image.Resampling.LANCZOS)

            # 3. Horological Unsharp Mask for razor-sharp edges
            sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.0, percent=120, threshold=2))

            # 4. Save optimized WebP at Quality 80 with method=4 (fast & small)
            sharpened.save(dest_webp_path, "WEBP", quality=80, method=4)

            if (new_idx + 1) % 50 == 0 or new_idx == 0:
                print(f"Processed frame {new_idx+1}", flush=True)

            return True
    except Exception as e:
        print(f"Error processing frame {new_idx}: {e}", flush=True)
        return False

def main():
    cwd = os.getcwd()
    src_dir = os.path.join(cwd, "smart_watch_animated_white_bg")
    dest_dir = os.path.join(cwd, "public", "assets", "frames")
    os.makedirs(dest_dir, exist_ok=True)

    all_files = sorted([f for f in os.listdir(src_dir) if f.startswith("output_") and f.endswith(".jpg")])
    sliced_files = all_files[44:] # Starts at output_0045.jpg
    total_frames = len(sliced_files)

    print(f"Processing {total_frames} frames to Ultra-Fast 1920x1080 WebP (Q80)...", flush=True)

    tasks = []
    for idx, filename in enumerate(sliced_files):
        src_path = os.path.join(src_dir, filename)
        dest_webp_path = os.path.join(dest_dir, f"frame-{idx:03d}.webp")
        tasks.append((src_path, dest_webp_path, idx))

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_single_frame, tasks))

    success_count = sum(1 for r in results if r)
    print(f"Successfully processed {success_count}/{total_frames} frames.", flush=True)

    # Update manifest.json with 1920x1080 resolution & file sizes
    manifest_path = os.path.join(dest_dir, "manifest.json")
    manifest_data = {
        "manifestVersion": "2.2.0",
        "totalFrames": total_frames,
        "sourceFrameCount": len(all_files),
        "processedFrameCount": total_frames,
        "format": "webp",
        "quality": 80,
        "width": 1920,
        "height": 1080,
        "aspectRatio": "16:9",
        "filenamePattern": "frame-{index}.webp",
        "backgroundColor": "#ffffff",
        "backgroundColors": ["#ffffff"] * total_frames,
        "duplicatesRemoved": 0,
        "uniqueIndicesMap": list(range(total_frames))
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    print("Manifest updated to 1920x1080 ultra-fast WebP quality.", flush=True)

if __name__ == "__main__":
    main()
