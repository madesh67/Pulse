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
            arr = np.array(img, dtype=np.float32)

            # Smooth white-point leveling:
            # Studio background and floor shadows range from 175 to 235.
            # Using white_point = 175.0 maps all background and soft floor reflections to pure 255.0 (#ffffff),
            # eliminating all threshold banding, jagged lines, and gray artifacts without harsh cutoffs.
            white_point = 175.0
            cleaned_arr = np.clip(arr * (255.0 / white_point), 0, 255.0)

            cleaned_img = Image.fromarray(cleaned_arr.astype(np.uint8))

            # Resize to sharp 1080x1920 portrait
            resized = cleaned_img.resize((1080, 1920), Image.Resampling.LANCZOS)

            # Horological Unsharp Mask for crisp titanium chamfers and sapphire dial edges
            sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.0, percent=115, threshold=2))

            # Save ultra-clean WebP at Quality 85 with method=4
            sharpened.save(dest_webp_path, "WEBP", quality=85, method=4)

            if (new_idx + 1) % 40 == 0 or new_idx == 0:
                print(f"Reprocessed clean mobile frame {new_idx+1}", flush=True)

            return True
    except Exception as e:
        print(f"Error processing clean mobile frame {new_idx}: {e}", flush=True)
        return False

def main():
    src_dir = r"C:\Users\srima\Downloads\Compressed\smart_watch_animated_white_bg_mobile"
    dest_dir = os.path.join("public", "assets", "frames-mobile")
    os.makedirs(dest_dir, exist_ok=True)

    all_files = sorted([f for f in os.listdir(src_dir) if f.endswith(".jpg") or f.endswith(".png")])
    total_frames = len(all_files)

    print(f"Reprocessing {total_frames} mobile frames with smooth studio white-point leveling (white_point=175.0)...", flush=True)

    tasks = []
    for idx, filename in enumerate(all_files):
        src_path = os.path.join(src_dir, filename)
        dest_webp_path = os.path.join(dest_dir, f"frame-{idx:03d}.webp")
        tasks.append((src_path, dest_webp_path, idx))

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(process_mobile_frame, tasks))

    success_count = sum(1 for r in results if r)
    print(f"Successfully reprocessed {success_count}/{total_frames} mobile frames to pure #ffffff background.", flush=True)

    # Manifest with pure #ffffff background color array
    manifest_path = os.path.join(dest_dir, "manifest.json")
    manifest_data = {
        "manifestVersion": "2.0.0",
        "totalFrames": total_frames,
        "sourceFrameCount": total_frames,
        "processedFrameCount": total_frames,
        "format": "webp",
        "quality": 85,
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

    print("Mobile manifest updated with pure #ffffff backgrounds.", flush=True)

if __name__ == "__main__":
    main()
