import os

images = [
    'sira.png', 'sira1.png', 'sira2.png', 'sira3.png', 'sira_1.png', 'sira_2.png', 'sira_3.png',
    'sira_1_clean.png', 'sira_2_clean.png', 'sira_3_clean.png',
    'dere.png', 'dere2.png', 'dere3.jpeg', 'test_1.png', 'test_2.png', 'test_3.png',
    'tryarka.png', 'basback.png', 'basback2.png', 'bb3.png', 'ark22.png', 'asok.png', 'kazanek.png'
]

import struct

def get_image_info(path):
    try:
        with open(path, 'rb') as f:
            data = f.read(30)
            if data[:8] == b'\x89PNG\r\n\x1a\n':
                w, h = struct.unpack('>LL', data[16:24])
                return f"PNG {w}x{h}"
            elif data[:2] == b'\xff\xd8':
                return "JPEG"
    except Exception as e:
        return str(e)
    return "unknown"

for img in images:
    p = os.path.join('public', img)
    if os.path.exists(p):
        print(f"{img}: {get_image_info(p)}, size={os.path.getsize(p)}")
