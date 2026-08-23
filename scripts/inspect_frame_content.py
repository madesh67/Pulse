import os
import json

cwd = os.getcwd()
src_dir = os.path.join(cwd, "smart_watch_animated_white_bg")
dest_dir = os.path.join(cwd, "public", "assets", "frames")
manifest_path = os.path.join(dest_dir, "manifest.json")

with open(manifest_path, "r") as f:
    manifest = json.load(f)

print("Manifest total frames:", manifest["totalFrames"])
print("Filename pattern:", manifest["filenamePattern"])

# In process_frames.py:
# all_files were sorted output_0001.jpg to output_0496.jpg
# and then sliced: all_files = all_files[44:]
# so output_0045.jpg is frame-000.webp
# output_0111.jpg is frame-(111-45).webp = frame-066.webp!

print(f"output_0111.jpg -> index {111 - 45} (frame-{111-45:03d}.webp)")
