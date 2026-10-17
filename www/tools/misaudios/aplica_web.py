# Mete «Mis audios» + puente de voz Android en un juego web empaquetado (www) · uso: aplica_web.py WWW cfg.js [bundle.js …] [--antes PATRON]
import os, re, shutil, sys
D = os.path.dirname(os.path.abspath(__file__))
www, cfg = sys.argv[1], sys.argv[2]; args = sys.argv[3:]
antes = None
if '--antes' in args: i = args.index('--antes'); antes = args[i + 1]; del args[i:i + 2]
bundles = args
os.makedirs(os.path.join(www, 'js'), exist_ok=True)
for f in ('misaudios.js', 'voz_android.js'): shutil.copy(os.path.join(D, f), os.path.join(www, 'js', f))
shutil.copy(cfg, os.path.join(www, 'js', 'misaudios_cfg.js'))
ix = os.path.join(www, 'index.html'); h = open(ix, encoding='utf8').read()
tag = '<script src="js/voz_android.js"></script>\n<script src="js/misaudios_cfg.js"></script>\n<script src="js/misaudios.js"></script>\n'
if 'js/misaudios.js' not in h:
    if antes: k = h.index(antes)
    else: k = h.index('<script')
    h = h[:k] + tag + h[k:]; open(ix, 'w', encoding='utf8').write(h)
for b in bundles:
    p = os.path.join(www, b); s = open(p, encoding='utf8').read(); n0 = s
    if '/*MA*/' in s: print(b, 'ya'); continue
    # voz del juego (familia Ahora Caigo): si el momento tiene audio mío, suena él en lugar de la frase y el juego espera a que acabe
    s, n1 = re.subn(r'say\((\w),(\w)=\{\}\)\{if\(\1\.forEach\(', lambda m: 'say(%s,%s={}){/*MA*/{let __m=window.MisAudios&&%s&&%s.length?MisAudios.texto(%s[0]):null;if(__m){this.stop();return __m}}if(%s.forEach(' % (m[1], m[2], m[1], m[1], m[1], m[1]), s, count=1)
    # efectos con nombre (acierto, fallo, caída…)
    s, n2 = re.subn(r'async play\((\w),(\w)=1,(\w)\)\{', lambda m: 'async play(%s,%s=1,%s){/*MA*/try{window.MisAudios&&MisAudios.sfx(%s)}catch(_){}' % (m[1], m[2], m[3], m[1]), s, count=1)
    open(p, 'w', encoding='utf8').write(s); print(b, 'say', n1, 'sfx', n2)
