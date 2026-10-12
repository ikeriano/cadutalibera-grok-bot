#!/bin/bash
# Prepara: repo PRIVADO (/workspace/acerte/repo_privado), web PÚBLICA sin recursos del Scratch (/workspace/acerte/repo_web)
# y los assets del APK (/workspace/acerte/android/app/src/main/assets/www).
set -e
cd "$(dirname "$0")/.."
W=$(pwd); P=/workspace/acerte/repo_privado; PUB=/workspace/acerte/repo_web; APK=/workspace/acerte/android/app/src/main/assets/www
JUEGO="index.html js assets voz piper piper_pt icon-192.png icon-512.png manifest.webmanifest version.json sw.js sb3 clasico cabecera apertura logo.png LEEME.md"
# ---- APK ----
rm -rf $APK; mkdir -p $APK; cp -rL $JUEGO $APK/
# ---- privado ----
mkdir -p $P; find $P -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
mkdir -p $P/www; cp -rL $JUEGO src tools package.json $P/www/
mkdir -p $P/android; (cd /workspace/acerte/android && tar cf - --exclude=./app/src/main/assets/www --exclude=./app/build --exclude=./.gradle --exclude=./build --exclude=./local.properties .) | (cd $P/android && tar xf -)
mkdir -p $P/roblox; cp /workspace/acerte/*.rbxlx $P/roblox/; cp -rL /workspace/acerte/roblox_src $P/roblox/codigo; cp /workspace/ahoracaigo/LEEME-Roblox.txt $P/roblox/LEEME-Roblox.txt
sed -i 's/Ahora Caigo/Acerte ou Caia/g' $P/roblox/LEEME-Roblox.txt
mkdir -p $P/capturas; cp /workspace/acerte/shot-*.png $P/capturas/ 2>/dev/null || true
cp /workspace/acerte/datos/preguntas.tsv $P/www/tools/preguntas_acerte.tsv
# ---- web pública (sin imágenes, sonidos, logo ni minijuego del Scratch) ----
mkdir -p $PUB; find $PUB -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -rL index.html js assets voz piper piper_pt manifest.webmanifest version.json sw.js $PUB/; touch $PUB/.nojekyll
sed -i '/sb3\/snd.js/d; /sb3\/logo.js/d' $PUB/index.html
python3 - "$PUB" <<'PY'
import sys
from PIL import Image, ImageDraw
d = sys.argv[1]
for s in (192, 512):  # icono propio (huellas), sin el logo
    im = Image.new('RGBA', (s, s), (10, 30, 120, 255)); g = ImageDraw.Draw(im)
    g.ellipse((s*.1, s*.1, s*.9, s*.9), outline=(95, 230, 255), width=max(3, s//40))
    for x in (.38, .58):
        g.ellipse((s*(x-.08), s*.3, s*(x+.08), s*.55), fill=(95, 230, 255)); g.ellipse((s*(x-.06), s*.58, s*(x+.06), s*.7), fill=(95, 230, 255))
    im.save(f'{d}/icon-{s}.png')
PY
