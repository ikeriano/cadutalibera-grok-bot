# Deshace www.pak + www.idx dentro de assets/www (para editar y volver a empaquetar con pak.py)
import os, sys
A = sys.argv[1]; W = os.path.join(A, 'www'); pk = open(os.path.join(A, 'www.pak'), 'rb'); n = 0
for l in open(os.path.join(A, 'www.idx'), encoding='utf-8'):
    l = l.rstrip('\n')
    if not l: continue
    rel, off, ln = l.split('\t'); pk.seek(int(off)); d = pk.read(int(ln)); p = os.path.join(W, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'wb').write(d); n += 1
pk.close(); os.remove(os.path.join(A, 'www.pak')); os.remove(os.path.join(A, 'www.idx')); print('desempaquetados', n)
