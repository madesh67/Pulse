import os
import json

# Let's map out key frames in output_*.jpg and their corresponding webp index
frames_to_check = [
    ("output_0045.jpg", 0, "Intro / Starting watch angle"),
    ("output_0111.jpg", 111 - 45, "Watch Display close-up / face view"),
    ("output_0177.jpg", 177 - 45, "Strap separation / fluidity"),
    ("output_0222.jpg", 222 - 45, "Case / Sapphire / Vitreous light"),
    ("output_0327.jpg", 327 - 45, "Crown / Disassembly / Interaction"),
    ("output_0450.jpg", 450 - 45, "Final assembled watch / Architecture"),
    ("output_0496.jpg", 496 - 45, "End frame"),
]

for orig_name, idx, desc in frames_to_check:
    print(f"{orig_name} -> index {idx:3d} (frame-{idx:03d}.webp) : {desc}")
