# v1.13: voces Piper de Toni (regidor, carlfm) en el programa y de las escenas nuevas de Fuera de cámaras.
# Uso: node -e (ver abajo) > /tmp/reg.json ; /workspace/piperenv/bin/python tools/gen_voces_regidor.py
import json, os, subprocess, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
MOD = {'davefx': 'es_ES-davefx-medium', 'sharvard': 'es_ES-sharvard-medium', 'ald': 'es_MX-ald-medium', 'daniela': 'es_AR-daniela-high', 'carlfm': 'es_ES-carlfm-x_low'}
L = json.load(open('/tmp/reg.json'))  # [[voz, texto], ...]
idx = {c: json.load(open(os.path.join(RAIZ, c, 'index.json'))) for c in ('voz', 'voz/st')}
cache = {}; n = 0
for v, t in L:
    carp, k = ('voz', fnv(t)) if v == 'davefx' else ('voz/st', fnv(v + '|' + t))
    dst = os.path.join(RAIZ, carp, k + '.mp3')
    if k in idx[carp] and os.path.exists(dst): continue
    if v not in cache: cache[v] = PiperVoice.load('/workspace/piper/%s.onnx' % MOD[v])
    with wave.open('/tmp/gvr.wav', 'wb') as w: cache[v].synthesize_wav(t, w, syn_config=SynthesisConfig(length_scale=0.95))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gvr.wav', '-af', 'volume=1.2', '-ac', '1', '-b:a', os.environ.get('BR','64k'), dst], check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    idx[carp][k] = round(dur, 2); n += 1
for c in idx: json.dump(idx[c], open(os.path.join(RAIZ, c, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n, 'de', len(L))
