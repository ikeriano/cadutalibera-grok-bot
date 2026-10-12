#!/bin/sh
# Construye español (js/app.js) e italiano (js/app_it.js)
set -e; cd "$(dirname "$0")/.."
python3 tools/caduta_patch.py >/dev/null; bash tools/build.sh; node tools/extraer_textos.mjs; /workspace/mtenv/bin/python tools/traducir_it.py | tail -1; node tools/aplicar_it.mjs
