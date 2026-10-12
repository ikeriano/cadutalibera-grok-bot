# 1.14.1: vuelve a grabar las voces de Carmen (mls_9972: salía «brbrbr») y Rober (mls_10246, baja calidad) con es_ES-sharvard-medium,
# tono suave (±2 semitonos), velocidad normal y volumen normalizado (-16 LUFS). Misma clave de archivo (voz|texto) que usa la app.
import json, os, subprocess, wave, unicodedata, sys
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
def tono(st): f = 2 ** (st / 12); return f'asetrate=22050*{f:.4f},aresample=22050,atempo={1/f:.4f},'
NUEVO = {'mls_9972': ('carmen', 1, 1.0, tono(1.5)), 'mls_10246': ('rober', 0, 1.0, tono(2.0))}
cp = {g['id']: g for g in json.load(open('/workspace/port/ac_copro.json'))['COPRO_DATOS']}; ch = json.load(open('/workspace/port/ac_datos.json'))['COPRO_CHARLA']
m = PiperVoice.load('/workspace/piper/es_ES-sharvard-medium.onnx'); idx = json.load(open(os.path.join(RAIZ, 'voz/st/index.json'))); n = 0
for voz, (cid, spk, ls, filt) in NUEVO.items():
    g = cp[cid]; T = set()
    for k, v in g.items():
        if k in ('id', 'quien', 'nombre', 'voz'): continue
        for t in (v if isinstance(v, list) else [v]):
            if isinstance(t, str) and len(t) > 1: T.add(t)
    def recorre(x):
        if isinstance(x, list) and len(x) == 2 and x[0] == 'c' and isinstance(x[1], str): T.add(x[1])
        elif isinstance(x, (list, tuple)): [recorre(y) for y in x]
        elif isinstance(x, dict): [recorre(y) for y in x.values()]
    recorre(ch.get(cid, {}))
    for t in sorted(T):
        k = fnv(voz + '|' + t); dst = os.path.join(RAIZ, 'voz/st', k + '.mp3')
        with wave.open('/tmp/fix114.wav', 'wb') as w: m.synthesize_wav(t, w, syn_config=SynthesisConfig(length_scale=ls, speaker_id=spk))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/fix114.wav', '-af', filt + 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '22050', '-ac', '1', '-b:a', '48k', dst], check=True)
        idx[k] = round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout), 2); n += 1
    print(cid, len(T))
json.dump(idx, open(os.path.join(RAIZ, 'voz/st/index.json'), 'w'), ensure_ascii=False, separators=(',', ':')); print('regrabadas', n)
