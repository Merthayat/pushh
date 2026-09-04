import os

for f in ['basback.png', 'basback2.png', 'bb3.png', 'sira1.png', 'sira2.png', 'sira3.png']:
    p = os.path.join('public', f)
    if os.path.exists(p):
        with open(p, 'rb') as fp:
            head = fp.read(16)
            print(f, head[:8])
