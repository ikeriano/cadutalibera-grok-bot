#!/bin/bash
# Prepara: APK assets, repo PRIVADO (/workspace/caduta/repo_privado) y web PÚBLICA sin recursos de Mediaset (/workspace/caduta/repo_web).
set -e
cd "$(dirname "$0")/.."
P=/workspace/caduta/repo_privado; PUB=/workspace/caduta/repo_web; APK=/workspace/caduta/android/app/src/main/assets/www
JUEGO="index.html js ep3000 assets voz piper piper_it icon-192.png icon-512.png manifest.webmanifest version.json sw.js sb3 clasico_cl cabecera apertura logo.png logo_cl.png logo_ac.png LEEME.md"
rm -rf $APK; mkdir -p $APK; cp -rL $JUEGO $APK/
# APK: voces a 24 kbps mono y sin modelo Piper espanol (frases pre-grabadas) -> APK < 200 MB
rm -rf $APK/voz $APK/piper; cp -r /workspace/caduta/voz24 $APK/voz
mkdir -p $P; find $P -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
mkdir -p $P/www; cp -rL $JUEGO src tools package.json $P/www/
mkdir -p $P/android; (cd /workspace/caduta/android && tar cf - --exclude=./app/src/main/assets/www --exclude=./app/build --exclude=./.gradle --exclude=./build --exclude=./local.properties .) | (cd $P/android && tar xf -)
mkdir -p $P/roblox; cp /workspace/caduta/roblox/*.rbxlx $P/roblox/
mkdir -p $P/capturas; cp /workspace/caduta/shots/*.png $P/capturas/ 2>/dev/null || true
mkdir -p $P/extraccion; cp /workspace/caduta/ext/slice.py /workspace/caduta/ext/layout.json $P/extraccion/; cp -r /workspace/caduta/ext/dec $P/extraccion/lua_descompilado
mkdir -p $PUB; find $PUB -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -rL index.html js ep3000 assets voz piper piper_it manifest.webmanifest version.json sw.js $PUB/; touch $PUB/.nojekyll
mkdir -p $PUB/sb3; cat > $PUB/sb3/logo.js <<'J'
// Web pública: sin logos de las cadenas; el juego dibuja su propio emblema de huellas.
window.__LOGO_CL = null; window.__LOGO_AC = null;
window.__logoPref = function () { try { var v = localStorage.getItem('cl_logo'); return v === 'cl' || v === 'ac' ? v : 'auto'; } catch (e) { return 'auto'; } };
window.__logoQue = function (lang) { var p = window.__logoPref(); return p === 'auto' ? ((lang || window.__LANG) === 'es' ? 'ac' : 'cl') : p; };
window.__logoUrl = function () { return null; };
J
sed -i '/sb3\/snd.js/d' $PUB/index.html
python3 /workspace/caduta/cl_pub/gen.py >/dev/null && cp -r /workspace/caduta/cl_pub/clasico_cl $PUB/clasico_cl
python3 - "$PUB" <<'PY'
import sys
from PIL import Image, ImageDraw
d = sys.argv[1]
for s in (192, 512):
    im = Image.new('RGBA', (s, s), (10, 30, 120, 255)); g = ImageDraw.Draw(im)
    g.ellipse((s*.1, s*.1, s*.9, s*.9), outline=(95, 230, 255), width=max(3, s//40))
    for x in (.38, .58):
        g.ellipse((s*(x-.08), s*.3, s*(x+.08), s*.55), fill=(95, 230, 255)); g.ellipse((s*(x-.06), s*.58, s*(x+.06), s*.7), fill=(95, 230, 255))
    im.save(f'{d}/icon-{s}.png')
PY
grep -rl "data:image/png;base64\|cl_intro\|bg2.webp" $PUB --include=*.js | head; echo listo
