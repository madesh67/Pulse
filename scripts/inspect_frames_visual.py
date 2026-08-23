import os
from PIL import Image

cwd = os.getcwd()
frames_dir = os.path.join(cwd, "public", "assets", "frames")

# Let's check some frame samples
print("Frames directory exists:", os.path.exists(frames_dir))
