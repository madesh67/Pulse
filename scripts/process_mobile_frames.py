import os
import json
import numpy as np
from PIL import Image, ImageFilter
from concurrent.futures import ThreadPoolExecutor

def process_mobile_frame(args):
    src_path, dest_webp_path, new_idx = args
    try:
        with Image.open(src_path) as img:
            img = img.convert("RGB")
            
            # 1. Clean background to pure #ffffff (threshold at 222 for studio white floor)
            arr = np.array(img, dtype=np.float32)
            mask = (arr[:, :, 0] >= 222) & (arr[:, :, 1] >= 222) & (arr[:, :, 2] >= 222)
            arr[mask] = [255.0, 255.0, 255.0]
            cleaned_img = Image.fromarray(arr.astype(np.uint8))

            # 2. Resize to optimized portrait 1080x1920 with high-quality Lanczos
            resized = cleaned_img.resize((1080, 1920), Image.Resampling.LANCZOS)

            # 3. Horological Unsharp Mask for crisp chamfers and dial edges
            sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.0, percent=115, threshold=2))

            # 4. Save optimized WebP at Quality 82 with method=4
            sharpened.save(dest_webp_path, "WEBP", quality=82, method=4)

            if (new_idx + 1) % 40 == 0 or new_idx == 0:
                print(f"Processed mobile frame {new_idx+1}", flush=True)

            return True
    except Exception as e:
        print(f"Error processing mobile frame {new_idx}: {e}", flush=True)
        return False

def main():
    src_dir = r"C:\Users\srima\Downloads\Compressed\smart_watch_animated_white_bg_mobile"
    dest_dir = os.path.join("public", "assets", "frames-mobile")
    os.makedirs(dest_dir, exist_ok=True)

    all_files = sorted([f for f in os.listdir(src_dir) if f.endswith(".jpg") or f.endswith(".png")])
    total_frames = len(all_files)

    print(f"Processing {total_frames} mobile frames to pure-white 1080x1920 WebP (Q82)...", flush=True)

    tasks = []
    for idx, filename in enumerate(all_files):
        src_path = os.path.join(src_dir, filename)
        dest_webp_path = os.path.join(dest_dir, f"frame-{idx:03d}.webp")
        tasks.append((src_path, dest_webp_path, idx))

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_mobile_frame, tasks))

    success_count = sum(1 for r in results if r)
    print(f"Successfully processed {success_count}/{total_frames} mobile frames.", flush=True)

    # Create manifest.json for mobile frames
    manifest_path = os.path.join(dest_dir, "manifest.json")
    manifest_data = {
        "manifestVersion": "1.0.0",
        "totalFrames": total_frames,
        "sourceFrameCount": total_frames,
        "processedFrameCount": total_frames,
        "format": "webp",
        "quality": 82,
        "width": 1080,
        "height": 1920,
        "aspectRatio": "9:16",
        "filenamePattern": "frame-{index}.webp",
        "backgroundColor": "#ffffff",
        "backgroundColors": ["#ffffff"] * total_frames,
        "duplicatesRemoved": 0,
        "uniqueIndicesMap": list(range(total_frames))
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    print("Mobile manifest created at public/assets/frames-mobile/manifest.json", flush=True)

if __name__ == "__main__":
    main()
