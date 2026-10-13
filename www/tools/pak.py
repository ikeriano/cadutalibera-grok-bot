# Empaqueta assets/www en dos ficheros (www.pak sin comprimir + www.idx) para que el APK tenga muy pocas entradas.
import os, sys
A = sys.argv[1]; W = os.path.join(A, 'www'); off = 0; idx = []; keep = []
with open(os.path.join(A, 'www.pak'), 'wb') as pk:
    for root, ds, fs in os.walk(W):
        ds.sort()
        for f in sorted(fs):
            p = os.path.join(root, f)
            if os.path.getsize(p) > 262144 and f.rsplit('.', 1)[-1].lower() in ('js', 'wasm', 'data', 'json', 'html', 'css', 'txt'): keep.append(p); continue
            rel = os.path.relpath(p, W).replace(os.sep, '/'); d = open(p, 'rb').read()
            pad = (-off) % 16; pk.write(b'\0' * pad); off += pad
            pk.write(d); idx.append(f'{rel}\t{off}\t{len(d)}'); off += len(d)
open(os.path.join(A, 'www.idx'), 'w', encoding='utf-8').write('\n'.join(idx) + '\n')
for root, ds, fs in os.walk(W, topdown=False):
    for f in fs:
        p = os.path.join(root, f)
        if p not in keep: os.remove(p)
    if not os.listdir(root): os.rmdir(root)
print('sueltos (comprimidos en el APK):', len(keep)); print('pak', len(idx), 'ficheros', off // 1048576, 'MB')
