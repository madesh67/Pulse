import os
import shutil
import urllib.request
import numpy as np
from PIL import Image, ImageFilter

brain_dir = r"C:\Users\srima\.gemini\antigravity-cli\brain\a6d4b78a-a18d-4fad-b67e-9b27b90f0949"
dest_dir = r"C:\Users\srima\onedrive\documents\React Projects\watch-ecommerce-website\public\assets\products"
os.makedirs(dest_dir, exist_ok=True)

# 1. Copy generated images from brain
generated_mappings = {
    "monolith_ceramic_1786987400396.jpg": "monolith-ceramic.jpg",
    "aviator_chrono_1786987727706.jpg": "aviator-chrono.jpg",
    "deep_diver_1786988057722.jpg": "deep-diver.jpg",
    "solar_tactical_1786988078988.jpg": "solar-tactical.jpg",
    "ocean_loop_1786988097481.jpg": "ocean-loop.jpg",
    "ballistic_band_1786988120328.jpg": "ballistic-band.jpg",
    "titanium_bracelet_1786988144259.jpg": "titanium-bracelet.jpg",
}

for src_name, dest_name in generated_mappings.items():
    src = os.path.join(brain_dir, src_name)
    dst = os.path.join(dest_dir, dest_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src_name} -> {dest_name}")

# 2. Curated high-res studio photography URLs for remaining 5 products
web_assets = {
    # Leather strap: handcrafted brown Italian bridle leather strap
    "leather-strap.jpg": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    # Travel charger: sleek modern minimalist wireless charging pad
    "travel-charger.jpg": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
    # Charging cable puck: precision magnetic charging puck
    "charging-cable.jpg": "https://images.unsplash.com/photo-1622445268462-348574043141?q=80&w=1600&auto=format&fit=crop",
    # Power stand: architectural desktop docking station
    "power-stand.jpg": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1600&auto=format&fit=crop",
    # Travel vault case: aerospace aluminum hard shell travel case
    "charging-case.jpg": "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
}

headers = {'User-Agent': 'Mozilla/5.0'}

for filename, url in web_assets.items():
    dst = os.path.join(dest_dir, filename)
    if not os.path.exists(dst):
        try:
            req = urllib.request.Request(url, headers=headers)
            temp_path = os.path.join(dest_dir, f"temp_{filename}")
            with urllib.request.urlopen(req) as response, open(temp_path, 'wb') as out_file:
                shutil.copyfileobj(response, out_file)
            
            with Image.open(temp_path) as img:
                img = img.convert("RGB")
                resized = img.resize((1600, 1100), Image.Resampling.LANCZOS)
                sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.0, percent=110, threshold=2))
                sharpened.save(dst, "JPEG", quality=92)
            
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"Successfully processed {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("All product assets prepared.")
