# Genera con Piper (es_ES-davefx-medium, la misma voz masculina del APK) las frases nuevas del presentador.
# Clave = FNV-1a del texto (igual que el APK, función _f). Uso: venv/bin/python tools/gen_voces.py
import json, re, subprocess, wave, os, sys
from piper import PiperVoice
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    import unicodedata
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        # el APK usa charCodeAt (UTF-16)
        for cu in ch.encode('utf-16-le').__iter__() if False else [ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]:
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
src = open(os.path.join(RAIZ, 'src/post.js'), encoding='utf8').read()
textos = []
for campo in ['saludo', 'despedida']:
    textos += re.findall(campo + r": '([^']+)'", src)
for ex in re.findall(r"extra: \[([^\]]+)\]", src):
    textos += re.findall(r"'([^']+)'", ex)
textos += [l.strip() for l in open(os.path.join(RAIZ, 'tools/frases_extra.txt'), encoding='utf8') if l.strip()] if os.path.exists(os.path.join(RAIZ, 'tools/frases_extra.txt')) else []
idx_path = os.path.join(RAIZ, 'voz/index.json'); idx = json.load(open(idx_path))
voz = PiperVoice.load('/workspace/piper/es_ES-davefx-medium.onnx')
from piper import SynthesisConfig
cfg = SynthesisConfig(length_scale=0.985)
n = 0
for t in textos:
    k = fnv(t)
    if k in idx and os.path.exists(os.path.join(RAIZ, 'voz', k + '.mp3')): continue
    with wave.open('/tmp/gv.wav', 'wb') as w: voz.synthesize_wav(t, w, syn_config=cfg)
    with wave.open('/tmp/gv.wav') as w: dur = w.getnframes() / w.getframerate()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gv.wav', '-ac', '1', '-b:a', '64k', os.path.join(RAIZ, 'voz', k + '.mp3')], check=True)
    idx[k] = round(dur, 2); n += 1; print(k, round(dur, 2), t[:60])
json.dump(idx, open(idx_path, 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n)
