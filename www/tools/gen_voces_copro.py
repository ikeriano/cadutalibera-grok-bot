# v1.13: voces Piper (TTS genérico, sin clonar a nadie) de las frases del presentador sorpresa y de Adrián en sus charlas.
# Adrián: davefx con estilo enérgico de presentador (más rápido, un poco más agudo y comprimido) -> voz/<fnv(texto)>.mp3
# Copresentadores: una voz distinta para cada uno -> voz/st/<fnv(voz|texto)>.mp3
# Uso: node (extrae líneas a /tmp/lineas.json) y luego /workspace/piperenv/bin/python tools/gen_voces_copro.py
import json, os, subprocess, wave
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # www
def fnv(t):
    import unicodedata
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
# voz -> (modelo, speaker, length_scale, filtro ffmpeg)
VOCES = {
  'adrian': ('es_ES-davefx-medium', None, 0.86, 'asetrate=22050*1.05,aresample=22050,acompressor=threshold=-18dB:ratio=3,volume=1.4'),
  'carlfm': ('es_ES-carlfm-x_low', None, 0.95, 'volume=1.2'),
  'daniela': ('es_AR-daniela-high', None, 0.95, 'volume=1.1'),
  'mls_10246': ('es_ES-mls_10246-low', None, 0.95, 'volume=1.2'),
  'sharvard_f': ('es_ES-sharvard-medium', 1, 0.95, 'volume=1.1'),
  'ald': ('es_MX-ald-medium', None, 0.95, 'volume=1.1'),
  'mls_9972': ('es_ES-mls_9972-low', None, 0.95, 'volume=1.2'),
  'claude': ('es_MX-claude-high', None, 0.92, 'volume=1.1'),
  'sharvard_m': ('es_ES-sharvard-medium', 0, 1.05, 'asetrate=22050*0.92,aresample=22050,volume=1.2'),
}
L = json.load(open('/tmp/lineas.json'))
trab = [('adrian', t, 'voz', fnv(t)) for t in L['adrian']] + [(v, t, 'voz/st', fnv(v + '|' + t)) for v, t in L['copro']]
idx = {c: json.load(open(os.path.join(RAIZ, c, 'index.json'))) for c in ('voz', 'voz/st')}
cache = {}; n = 0
for v, t, carp, k in trab:
    dst = os.path.join(RAIZ, carp, k + '.mp3')
    if k in idx[carp] and os.path.exists(dst): continue
    mod, spk, ls, filt = VOCES[v]
    if mod not in cache: cache[mod] = PiperVoice.load('/workspace/piper/%s.onnx' % mod)
    cfg = SynthesisConfig(length_scale=ls, speaker_id=spk) if spk is not None else SynthesisConfig(length_scale=ls)
    with wave.open('/tmp/gvc.wav', 'wb') as w: cache[mod].synthesize_wav(t, w, syn_config=cfg)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gvc.wav', '-af', filt, '-ac', '1', '-b:a', '64k', dst], check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    idx[carp][k] = round(dur, 2); n += 1
for c in idx: json.dump(idx[c], open(os.path.join(RAIZ, c, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n, 'de', len(trab))
