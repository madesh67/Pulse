import os
import sys
import json
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

def process_single_frame(args):
    src_path, dest_webp_path, dest_jpg_path, new_idx = args
    try:
        with Image.open(src_path) as img:
            img = img.convert("RGB")
            arr = np.array(img, dtype=np.float32)

            # Smoothly clean up flat background noise to pure #ffffff without affecting watch shadows or details
            # If all channels are >= 246, clamp to 255.0 to eliminate WebP macroblock banding
            mask = (arr[:, :, 0] >= 246) & (arr[:, :, 1] >= 246) & (arr[:, :, 2] >= 246)
            arr[mask] = [255.0, 255.0, 255.0]

            cleaned_img = Image.fromarray(arr.astype(np.uint8))

            # Save pristine-quality WebP (Q98, method=6 for master studio sharpness)
            cleaned_img.save(dest_webp_path, "WEBP", quality=98, method=6)
            
            # Also save lossless master JPEG
            cleaned_img.save(dest_jpg_path, "JPEG", quality=100)

            return True
    except Exception as e:
        print(f"Error processing frame {new_idx}: {e}")
        return False

def main():
    cwd = os.getcwd()
    src_dir = os.path.join(cwd, "smart_watch_animated_white_bg")
    dest_dir = os.path.join(cwd, "public", "assets", "frames")
    os.makedirs(dest_dir, exist_ok=True)

    # Slice output_0045.jpg to output_0496.jpg (452 frames)
    all_files = sorted([f for f in os.listdir(src_dir) if f.startswith("output_") and f.endswith(".jpg")])
    sliced_files = all_files[44:] # Starts at output_0045.jpg
    total_frames = len(sliced_files)

    print(f"Processing {total_frames} frames from {sliced_files[0]} to {sliced_files[-1]} at Ultra-High Quality (Q95, method=6)...")

    tasks = []
    for idx, filename in enumerate(sliced_files):
        src_path = os.path.join(src_dir, filename)
        dest_webp_path = os.path.join(dest_dir, f"frame-{idx:03d}.webp")
        dest_jpg_path = os.path.join(dest_dir, f"frame-{idx:03d}.jpg")
        tasks.append((src_path, dest_webp_path, dest_jpg_path, idx))

    # Parallel processing using CPU cores
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_single_frame, tasks))

    success_count = sum(1 for r in results if r)
    print(f"Successfully processed {success_count}/{total_frames} frames.")

    # Update manifest.json with clean #ffffff background
    manifest_path = os.path.join(dest_dir, "manifest.json")
    manifest_data = {
        "manifestVersion": "2.0.0",
        "totalFrames": total_frames,
        "sourceFrameCount": len(all_files),
        "processedFrameCount": total_frames,
        "format": "webp",
        "quality": 95,
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

    print("Manifest successfully updated with #ffffff background and Q95 quality.")

if __name__ == "__main__":
    main()
