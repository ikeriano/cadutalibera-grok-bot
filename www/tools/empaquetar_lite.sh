#!/bin/bash
# Caduta Libera Lite: solo el modo 2D (ES5) dentro de www.pak
set -e
L=/workspace/caduta/android_lite/app/src/main/assets; V=$(python3 -c "import json;print(json.load(open('/workspace/caduta/www/version.json'))['version'])")
rm -rf $L/www $L/www.pak $L/www.idx; mkdir -p $L/www/sb3
cp /workspace/caduta/www/sb3/logo.js $L/www/sb3/; cp /workspace/caduta/www/icon-192.png $L/www/
cat > $L/www/index.html <<H
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><meta name="app-version" content="$V-lite"><style>html,body{margin:0;height:100%;background:#000;overflow:hidden}</style></head><body><script>location.replace('clasico_cl/index.html?v=$V'+location.search)</script></body></html>
H
python3 /workspace/caduta/lite_compat/build_lite.py /workspace/caduta/www/clasico_cl $L/www/clasico_cl
python3 /workspace/caduta/www/tools/pak.py $L
