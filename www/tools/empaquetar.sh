#!/bin/bash
# Prepara las tres versiones de ¡Ahora caigo! (todo FUERA de esta carpeta de trabajo):
#  /workspace/ahoracaigo_repo_privado  -> repo PRIVADO ikeriano/ahoracaigo-grok-bot: juego COMPLETO (músicas, sonidos, logo,
#                                         audios de la cabecera y de las promos, vídeo de Iker, minijuego clásico) + código fuente
#  /workspace/ahoracaigo_repo_web      -> repo PÚBLICO ikeriano/ahoracaigo-web (GitHub Pages): SIN audios/imágenes con derechos
#  /workspace/ahoracaigo3d_completo.zip -> para jugar con doble clic (todo dentro, < 25 MB: sin vídeo ni minijuego clásico)
#  /workspace/ahoracaigo_sonidos.zip    -> para «Cargar músicas» en la web pública
set -e
cd "$(dirname "$0")/.."
WWW=/workspace/apk2/assets/www; PRIV=/workspace/ahoracaigo_privado
P=/workspace/ahoracaigo_repo_privado; PUB=/workspace/ahoracaigo_repo_web
bash tools/build.sh
WEBFILES="index.html js assets voz icon-192.png icon-512.png manifest.webmanifest version.json sw.js"
# ---- web pública ----
mkdir -p $PUB; find $PUB -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r $WEBFILES $PUB/; touch $PUB/.nojekyll
cat > $PUB/README.md <<'MD'
# ¡Ahora caigo! El juego 3D (versión web)
Juego creado por **Iker**. Versión web del APK «¡Ahora Caigo! El juego 3D», con el presentador virtual **Adrián Vega**.
Juega en: https://ikeriano.github.io/ahoracaigo-web/

Esta versión pública **no incluye** las músicas, los sonidos, el logo ni los audios de la cabecera y las promos del programa
(tienen derechos). El juego sintetiza su propia música y dibuja sus gráficos. Para oír los originales en tu dispositivo:
Opciones › «Cargar músicas» y elige `ahoracaigo_sonidos.zip` (se guarda solo en tu navegador).

Secciones: Programa completo (cuatro etapas 2011-actual), especiales, Promos 3D, Casting (#casting) y
«Elige el valor de cada huella» (#huellas). Voces: Piper TTS (es_ES-davefx-medium y otras). Motor 3D: Three.js (MIT).
MD
# ---- repo privado (todo) ----
mkdir -p $P; find $P -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r $WEBFILES $P/; mkdir -p $P/sb3 $P/cabecera $P/codigo
cp -r $WWW/sb3/img $WWW/sb3/snd $P/sb3/; cp -r $WWW/clasico $P/; cp $WWW/cabecera/cabecera-iker.mp4 $P/cabecera/
cp $PRIV/cabecera3d.mp3 $PRIV/estreno.mp3 $PRIV/promo_anuncio.mp3 $PRIV/promo_proximamente.mp3 $PRIV/promo_estanoche.mp3 $PRIV/promo_huella.mp3 $P/cabecera/
cp $PRIV/logo.png $P/logo.png; cp -r src tools package.json $P/codigo/
node -e "
const fs=require('fs');const d='$WWW/sb3/snd';const o={};for(const f of fs.readdirSync(d))o[f.replace(/\.mp3\$/,'')]=fs.readFileSync(d+'/'+f).toString('base64');
fs.writeFileSync('$P/sb3/snd.js','window.__SND_EMB='+JSON.stringify(o)+';');
const L='window.__LOGO_LOCAL=\"data:image/png;base64,'+fs.readFileSync('$PRIV/logo.png').toString('base64')+'\";window.__CAB3D_LOCAL=true;';
fs.writeFileSync('$P/sb3/logo.js',L+'window.__CABECERA_LOCAL=true;window.__CLASICO_LOCAL=true;');
fs.writeFileSync('/tmp/logo_zip.js',L+'window.__CABECERA_LOCAL=false;window.__CLASICO_LOCAL=false;');"
sed -i 's#<script src="js/app.js"></script>#<script src="sb3/snd.js"></script>\n<script src="sb3/logo.js"></script>\n<script src="js/app.js"></script>#' $P/index.html
cat > $P/LEEME.md <<'MD'
# ¡Ahora caigo! El juego 3D · versión COMPLETA (privada)
Juego creado por Iker. Incluye las músicas, sonidos e imágenes del APK, el logo, la cabecera en vídeo, los audios
de la cabecera 3D y de las promos (extraídos de los vídeos) y el minijuego clásico. **No hacer público** (derechos).
- Jugar: abrir `index.html` (doble clic) o servir la carpeta. También es la fuente del APK Android.
- `codigo/`: código fuente (src/) y herramientas de construcción (tools/build.sh, tools/empaquetar.sh).
- La web pública (sin audios con derechos) está en ikeriano/ahoracaigo-web.
MD
# ---- zip completo (< 25 MB) ----
Z=/tmp/ac_zip/ahoracaigo3d; rm -rf /tmp/ac_zip; mkdir -p $Z/sb3 $Z/cabecera
cp -r $WEBFILES $Z/; cp $P/index.html $Z/; cp -r $P/sb3/img $Z/sb3/; mkdir -p /tmp/ac_snd; for f in $WWW/sb3/snd/*.mp3; do ffmpeg -v error -y -i "$f" -ac 1 -b:a 64k /tmp/ac_snd/$(basename "$f"); done; node -e "const fs=require('fs');const o={};for(const f of fs.readdirSync('/tmp/ac_snd'))o[f.replace(/\\.mp3\$/,'')]=fs.readFileSync('/tmp/ac_snd/'+f).toString('base64');fs.writeFileSync('$Z/sb3/snd.js','window.__SND_EMB='+JSON.stringify(o)+';');"; cp /tmp/logo_zip.js $Z/sb3/logo.js; cp $P/cabecera/*.mp3 $Z/cabecera/
# voces a 32 kbps (habla) para que quepa todo
find $Z/voz -name '*.mp3' | xargs -P 8 -I{} sh -c 'ffmpeg -v error -y -i "{}" -ac 1 -ar 16000 -b:a 20k "{}.t.mp3" && mv "{}.t.mp3" "{}"'
cat > $Z/LEEME.txt <<'TXT'
¡Ahora caigo! El juego 3D · versión completa (juego creado por Iker)
Abre index.html con doble clic (Chrome, Edge o Firefox). Suena todo: músicas y sonidos del APK, la cabecera 3D
y las promos con su audio, y la voz del presentador Adrián Vega. Esta copia es solo para ti: no la subas a internet.
(El vídeo de la cabecera de Iker y el minijuego clásico de Scratch están en el repositorio privado y en el APK.)
TXT
(cd /tmp/ac_zip && rm -f /workspace/ahoracaigo3d_completo.zip && zip -qr -9 /workspace/ahoracaigo3d_completo.zip ahoracaigo3d)
# ---- zip de sonidos para la web ----
S=/tmp/ac_sonidos; rm -rf $S; mkdir -p $S/sb3 $S/cabecera
cp -r $WWW/sb3/snd $WWW/sb3/img $S/sb3/; cp $P/cabecera/*.mp3 $S/cabecera/; cp $WWW/cabecera/cabecera-iker.mp4 $S/cabecera/; cp $PRIV/logo.png $S/logo.png
(cd $S && rm -f /workspace/ahoracaigo_sonidos.zip && zip -qr -9 /workspace/ahoracaigo_sonidos.zip .)
ls -la /workspace/ahoracaigo3d_completo.zip /workspace/ahoracaigo_sonidos.zip; du -sh $P $PUB
