#!/bin/sh
# Construye js/app.js (IIFE: funciona en GitHub Pages y abriendo index.html con doble clic)
set -e
cd "$(dirname "$0")/.."
mkdir -p tmp
node -e "
const fs=require('fs');
const m=JSON.parse(fs.readFileSync('tools/manifest.json'));
const p=JSON.parse(fs.readFileSync('voz/index.json')), q=JSON.parse(fs.readFileSync('voz/q/index.json')), st=fs.existsSync('voz/st/index.json')?JSON.parse(fs.readFileSync('voz/st/index.json')):{};
const ies=fs.existsSync('tools/img_es.json')?JSON.parse(fs.readFileSync('tools/img_es.json')):{};
fs.writeFileSync('tmp/gen.js','const __MANIFEST='+JSON.stringify(m)+';\nconst __IMG_ES='+JSON.stringify(ies)+';\nif (window.__LANG !== "pt") for (const v of Object.values(__MANIFEST.sprites)) v.c.forEach(c => { if (__IMG_ES[c.f]) c.f = __IMG_ES[c.f]; });\nconst __VOZ_P='+JSON.stringify(p)+';\nconst __VOZ_Q='+JSON.stringify(q)+';\nconst __VOZ_ST='+JSON.stringify(st)+';\n');"
# los import tienen que ir arriba del todo
grep '^import ' src/pre.js > tmp/all.js
cat tmp/gen.js >> tmp/all.js
grep -v '^import ' src/pre.js >> tmp/all.js
cat src/etapas_datos.js src/bancos_acerte.js >> tmp/all.js
cat src/app.js src/preguntas_extra.js src/post.js src/etapas_clasicas.js src/cabecera3d.js src/promos.js src/recursos.js src/showtime_datos.js src/showtime.js src/extras_datos.js src/extras.js src/extras_datos2.js src/extras_datos3.js src/copro.js src/copro_charla.js src/regidor.js src/v114.js src/escenas_ac.js src/camlibre_ac.js src/extras_comunes.js src/v115.js src/promo_cabecera.js src/sketch_arturo.js src/acerte_set.js src/idioma.js src/acerte_v11.js src/final3d.js src/mc3d_ac.js >> tmp/all.js
node_modules/.bin/esbuild tmp/all.js --bundle --minify --charset=utf8 --format=iife --outfile=js/app.js --log-level=warning
