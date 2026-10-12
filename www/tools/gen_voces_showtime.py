# Voces Piper de: monólogos y promos de Adrián (davefx → voz/), y anuncios, cortinillas y promos de la cadena (otras voces → voz/st/)
import json, os, subprocess, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
s = open(os.path.join(RAIZ, 'src/showtime_datos.js'), encoding='utf8').read(); D = json.loads(s[s.index('=') + 1:s.rindex(';')])
MOD = {'davefx': 'es_ES-davefx-medium', 'sharvard': 'es_ES-sharvard-medium', 'ald': 'es_MX-ald-medium', 'daniela': 'es_AR-daniela-high', 'carlfm': 'es_ES-carlfm-x_low'}
trabajos = []  # (voz, texto, carpeta, clave)
for m in D['monologos']:
    for p in m['pasos']: trabajos.append(('davefx', p[0], 'voz', fnv(p[0])))
for t in D.get('frases', []): trabajos.append(('davefx', t, 'voz', fnv(t)))
for m in D['promosAdrian']:
    for p in m['pasos']: trabajos.append(('davefx', p[0], 'voz', fnv(p[0])))
for t in D['cortinillas'].values(): trabajos.append(('daniela', t, 'voz/st', fnv('daniela|' + t)))
for a in D['anuncios'] + D['promosCadena']:
    for l in a['lineas']: trabajos.append((a['voz'], l, 'voz/st', fnv(a['voz'] + '|' + l)))
s2 = open(os.path.join(RAIZ, 'src/extras_datos.js'), encoding='utf8').read(); X = json.loads(s2[s2.index('=') + 1:s2.rindex(';')])
PER = X['personajes']
for modo in ('oculta', 'tomas', 'fuera'):
    for sk in X[modo]:
        for p in sk['pasos']:
            v = PER[p[0]][1]; trabajos.append((v, p[1], 'voz', fnv(p[1])) if v == 'davefx' else (v, p[1], 'voz/st', fnv(v + '|' + p[1])))
for t in X['copres']['invita'] + X['copres']['gracias'] + list(X['paseo'].values()): trabajos.append(('davefx', t, 'voz', fnv(t)))
for g in X['copres']['invitados']:
    for l in g['lineas']: trabajos.append((g['voz'], l, 'voz/st', fnv(g['voz'] + '|' + l)))
os.makedirs(os.path.join(RAIZ, 'voz/st'), exist_ok=True)
idx = {'voz': json.load(open(os.path.join(RAIZ, 'voz/index.json'))), 'voz/st': json.load(open(os.path.join(RAIZ, 'voz/st/index.json'))) if os.path.exists(os.path.join(RAIZ, 'voz/st/index.json')) else {}}
voces = {}; n = 0
for voz, t, carp, k in trabajos:
    dst = os.path.join(RAIZ, carp, k + '.mp3')
    if k in idx[carp] and os.path.exists(dst): continue
    if voz not in voces: voces[voz] = PiperVoice.load('/workspace/piper/%s.onnx' % MOD[voz])
    cfg = SynthesisConfig(length_scale=0.985 if voz == 'davefx' else 0.95)
    with wave.open('/tmp/gvs.wav', 'wb') as w: voces[voz].synthesize_wav(t, w, syn_config=cfg)
    with wave.open('/tmp/gvs.wav') as w: dur = w.getnframes() / w.getframerate()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gvs.wav', '-ac', '1', '-b:a', '64k', dst], check=True)
    idx[carp][k] = round(dur, 2); n += 1
for carp in idx: json.dump(idx[carp], open(os.path.join(RAIZ, carp, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n, 'de', len(trabajos))
