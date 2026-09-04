import os
import struct

def fix_png(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Check if starts with \xef\xbf\xbdPNG
    if content.startswith(b'\xef\xbf\xbdPNG'):
        fixed = b'\x89PNG' + content[len(b'\xef\xbf\xbdPNG'):]
        with open(filepath, 'wb') as f:
            f.write(fixed)
        print(f"Fixed {filepath}")
    elif content.startswith(b'\x89PNG'):
        print(f"{filepath} already valid PNG")
    else:
        print(f"{filepath} unknown header: {content[:10]}")

for name in ['bb3.png', 'sira1.png', 'sira2.png', 'sira3.png', 'sira_1.png', 'sira_2.png', 'sira_3.png', 'sira_1_clean.png', 'sira_2_clean.png', 'sira_3_clean.png', 'test_1.png', 'test_2.png', 'test_3.png']:
    p = os.path.join('public', name)
    if os.path.exists(p):
        fix_png(p)
