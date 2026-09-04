from PIL import Image
import os

for f in ['par2.png', 'par3.png', 'basback.png', 'basback2.png', 'bb3.png']:
    p = os.path.join('public', f)
    if os.path.exists(p):
        with Image.open(p) as img:
            print(f"{f}: format={img.format}, size={img.size}, mode={img.mode}")
