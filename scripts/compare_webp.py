import os
import math
from PIL import Image, ImageChops

def calculate_psnr_mse(img1, img2):
    # Ensure images have same mode and size
    if img1.mode != img2.mode or img1.size != img2.size:
        return 0, 99999
        
    diff = ImageChops.difference(img1, img2)
    # Calculate Mean Squared Error (MSE)
    h = diff.histogram()
    # Number of pixels * channels
    num_pixels = img1.size[0] * img1.size[1] * 3
    
    sum_sq = 0
    # histogram has 256 bins for each channel (R, G, B) concatenated
    for i in range(256):
        count = h[i] + h[i+256] + h[i+512]
        sum_sq += count * (i ** 2)
        
    mse = sum_sq / num_pixels
    if mse == 0:
        return float('inf'), 0
        
    # Calculate PSNR
    psnr = 20 * math.log10(255.0 / math.sqrt(mse))
    return psnr, mse

def test_frame_quality(idx):
    cwd = os.getcwd()
    # Original source frame path (1-based index)
    # The unique frame index idx maps to original frame via uniqueIndicesMap
    # Let's read uniqueIndicesMap from manifest if we want, or we can just use the processed JPG as reference
    # Processed JPEG master frame-*.jpg is saved with Q100, which serves as a lossless reference for comparison.
    ref_path = os.path.join(cwd, "public", "assets", "frames", f"frame-{idx:03d}.jpg")
    if not os.path.exists(ref_path):
        print(f"Reference frame {idx} not found at {ref_path}")
        return
        
    img_ref = Image.open(ref_path)
    img_ref.load()
    
    # Save temporary WebP at Q80 and Q90
    temp_q80_path = os.path.join(cwd, "public", "assets", "frames", f"temp_compare_{idx}_q80.webp")
    temp_q90_path = os.path.join(cwd, "public", "assets", "frames", f"temp_compare_{idx}_q90.webp")
    
    img_ref.save(temp_q80_path, "WEBP", quality=80)
    img_ref.save(temp_q90_path, "WEBP", quality=90)
    
    img_q80 = Image.open(temp_q80_path)
    img_q80.load()
    
    img_q90 = Image.open(temp_q90_path)
    img_q90.load()
    
    # Compare
    psnr_80, mse_80 = calculate_psnr_mse(img_ref, img_q80)
    psnr_90, mse_90 = calculate_psnr_mse(img_ref, img_q90)
    
    # File sizes
    size_orig = os.path.getsize(ref_path)
    size_80 = os.path.getsize(temp_q80_path)
    size_90 = os.path.getsize(temp_q90_path)
    
    # Check background color at corner (0,0) after compression
    bg_ref = img_ref.getpixel((0,0))
    bg_80 = img_q80.getpixel((0,0))
    bg_90 = img_q90.getpixel((0,0))
    
    print(f"Frame {idx:03d} | Size: Ref={size_orig/1024:.1f}KB, Q80={size_80/1024:.1f}KB, Q90={size_90/1024:.1f}KB")
    print(f"  Q80 vs Ref | PSNR: {psnr_80:.2f} dB, MSE: {mse_80:.4f} | Corner Bg: Ref={bg_ref} -> Q80={bg_80}")
    print(f"  Q90 vs Ref | PSNR: {psnr_90:.2f} dB, MSE: {mse_90:.4f} | Corner Bg: Ref={bg_ref} -> Q90={bg_90}")
    
    # Cleanup
    img_q80.close()
    img_q90.close()
    os.remove(temp_q80_path)
    os.remove(temp_q90_path)
    img_ref.close()

if __name__ == "__main__":
    rep_frames = [0, 40, 80, 140, 190, 241]
    print("Performing visual quality metrics test for representative frames:")
    print("=" * 80)
    for f in rep_frames:
        test_frame_quality(f)
        print("-" * 80)
