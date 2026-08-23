import os
import sys
import json
import numpy as np
from PIL import Image, ImageFilter
from concurrent.futures import ProcessPoolExecutor

def process_single_frame(args):
    src_path, dest_webp_path, dest_jpg_path, new_idx = args
    try:
        with Image.open(src_path) as img:
            img = img.convert("RGB")
            
            # 1. Clean background to pure #ffffff
            arr = np.array(img, dtype=np.float32)
            mask = (arr[:, :, 0] >= 245) & (arr[:, :, 1] >= 245) & (arr[:, :, 2] >= 245)
            arr[mask] = [255.0, 255.0, 255.0]
            cleaned_img = Image.fromarray(arr.astype(np.uint8))

            # 2. High-resolution Lanczos resize to 2560x1440 for Retina/4K sharpness
            upscaled = cleaned_img.resize((2560, 1440), Image.Resampling.LANCZOS)

            # 3. Horological Unsharp Mask for razor-sharp chamfers & strap ribs
            sharpened = upscaled.filter(ImageFilter.UnsharpMask(radius=1.2, percent=130, threshold=2))

            # 4. Save optimized master WebP (Q90, method=6 for pristine quality at half file size)
            sharpened.save(dest_webp_path, "WEBP", quality=90, method=6)
            sharpened.save(dest_jpg_path, "JPEG", quality=92)

            return True
    except Exception as e:
        print(f"Error processing frame {new_idx}: {e}")
        return False

def main():
    cwd = os.getcwd()
    src_dir = os.path.join(cwd, "smart_watch_animated_white_bg")
    dest_dir = os.path.join(cwd, "public", "assets", "frames")
    os.makedirs(dest_dir, exist_ok=True)

    all_files = sorted([f for f in os.listdir(src_dir) if f.startswith("output_") and f.endswith(".jpg")])
    sliced_files = all_files[44:] # Starts at output_0045.jpg
    total_frames = len(sliced_files)

    print(f"Processing {total_frames} frames to Ultra-Sharp 2560x1440 (Lanczos + Unsharp Mask)...")

    tasks = []
    for idx, filename in enumerate(sliced_files):
        src_path = os.path.join(src_dir, filename)
        dest_webp_path = os.path.join(dest_dir, f"frame-{idx:03d}.webp")
        dest_jpg_path = os.path.join(dest_dir, f"frame-{idx:03d}.jpg")
        tasks.append((src_path, dest_webp_path, dest_jpg_path, idx))

    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_single_frame, tasks))

    success_count = sum(1 for r in results if r)
    print(f"Successfully processed {success_count}/{total_frames} frames.")

    # Update manifest.json with 2560x1440 resolution
    manifest_path = os.path.join(dest_dir, "manifest.json")
    manifest_data = {
        "manifestVersion": "2.1.0",
        "totalFrames": total_frames,
        "sourceFrameCount": len(all_files),
        "processedFrameCount": total_frames,
        "format": "webp",
        "quality": 98,
        "width": 2560,
        "height": 1440,
        "aspectRatio": "16:9",
        "filenamePattern": "frame-{index}.webp",
        "backgroundColor": "#ffffff",
        "backgroundColors": ["#ffffff"] * total_frames,
        "duplicatesRemoved": 0,
        "uniqueIndicesMap": list(range(total_frames))
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    print("Manifest updated to 2560x1440 ultra-sharp master quality.")

if __name__ == "__main__":
    main()
