# Genera un .sb3 de PRUEBA (sin nada con derechos): disfraces dibujados y tonos sintéticos con los NOMBRES
# de sprites/sonidos del proyecto clásico, para probar «Cargar sb3 / sonidos / sprites».
import json, hashlib, io, math, struct, sys, zipfile, wave
from PIL import Image, ImageDraw
M = json.load(open(sys.argv[1])); out = sys.argv[2]
files = {}
def put(data, ext):
    h = hashlib.md5(data).hexdigest(); files[h + '.' + ext] = data; return h
def png(w, h, txt, col):
    im = Image.new('RGBA', (max(16, w), max(16, h)), col); d = ImageDraw.Draw(im)
    d.rectangle([4, 4, im.width - 5, im.height - 5], outline=(255, 255, 255, 255), width=6)
    d.text((12, 12), 'PRUEBA ' + txt, fill=(255, 255, 255, 255)); b = io.BytesIO(); im.save(b, 'PNG'); return b.getvalue()
def wav_pcm(freq, dur=0.4, rate=22050):
    b = io.BytesIO(); w = wave.open(b, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
    w.writeframes(b''.join(struct.pack('<h', int(9000 * math.sin(2 * math.pi * freq * i / rate))) for i in range(int(rate * dur)))); w.close(); return b.getvalue()
def wav_adpcm(freq, dur=0.5, rate=22050):  # IMA ADPCM mono, como los WAV comprimidos de Scratch
    STEP = [7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,27086,29794,32767]
    IDX = [-1,-1,-1,-1,2,4,6,8,-1,-1,-1,-1,2,4,6,8]; block = 512; spb = (block - 4) * 2 + 1
    smp = [int(9000 * math.sin(2 * math.pi * freq * i / rate)) for i in range(int(rate * dur))]; data = b''
    for s0 in range(0, len(smp), spb):
        blk = smp[s0:s0 + spb]; blk += [0] * (spb - len(blk)); pred = blk[0]; idx = 0; hdr = struct.pack('<hBB', pred, idx, 0); nibs = []
        for x in blk[1:]:
            st = STEP[idx]; diff = x - pred; n = 0
            if diff < 0: n = 8; diff = -diff
            dq = st >> 3
            if diff >= st: n |= 4; diff -= st; dq += st
            st2 = st >> 1
            if diff >= st2: n |= 2; diff -= st2; dq += st2
            st3 = st >> 2
            if diff >= st3: n |= 1; dq += st3
            pred = max(-32768, min(32767, pred - dq if n & 8 else pred + dq)); idx = max(0, min(88, idx + IDX[n])); nibs.append(n)
        data += hdr + bytes((nibs[i] | (nibs[i + 1] << 4)) for i in range(0, len(nibs), 2))
    fmt = struct.pack('<HHIIHHHH', 17, 1, rate, rate * block // spb, block, 4, 2, spb)
    fact = struct.pack('<I', len(smp))
    body = b'WAVE' + b'fmt ' + struct.pack('<I', len(fmt)) + fmt + b'fact' + struct.pack('<I', 4) + fact + b'data' + struct.pack('<I', len(data)) + data
    return b'RIFF' + struct.pack('<I', len(body)) + body
targets = []; cols = [(200, 30, 60, 255), (30, 120, 220, 255), (20, 160, 80, 255), (230, 150, 20, 255), (130, 40, 200, 255)]
k = 0
for sp, v in M['sprites'].items():
    t = {'isStage': sp == 'Stage', 'name': sp, 'variables': {}, 'lists': {}, 'broadcasts': {}, 'blocks': {}, 'comments': {}, 'currentCostume': 0, 'costumes': [], 'sounds': [], 'volume': 100, 'layerOrder': len(targets)}
    for c in v['c']:
        if sp in ('Pergunta', 'Resposta') and c is not v['c'][0]: continue  # para que el sb3 de prueba sea pequeño
        k += 1; h = put(png(min(c['w'], 480), min(c['h'], 360), sp + ' / ' + c['n'], cols[k % 5]), 'png')
        t['costumes'].append({'name': c['n'], 'bitmapResolution': 2, 'dataFormat': 'png', 'assetId': h, 'md5ext': h + '.png', 'rotationCenterX': c['cx'], 'rotationCenterY': c['cy']})
    for i, n in enumerate((v.get('s') or {}).keys()):
        data = wav_adpcm(330 + 40 * i) if i % 2 else wav_pcm(440 + 30 * i); h = put(data, 'wav')
        t['sounds'].append({'name': n, 'assetId': h, 'dataFormat': 'wav', 'format': 'adpcm' if i % 2 else '', 'rate': 22050, 'sampleCount': 8000, 'md5ext': h + '.wav'})
    targets.append(t)
# sprites y sonidos que el juego no conoce (para «Sin asignar»), un SVG y un logo
x = {'isStage': False, 'name': 'MiSpriteNuevo', 'variables': {}, 'lists': {}, 'broadcasts': {}, 'blocks': {}, 'comments': {}, 'currentCostume': 0, 'costumes': [], 'sounds': [], 'volume': 100, 'layerOrder': len(targets)}
svg = b'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="200" height="120" rx="20" fill="#ffd23a"/><text x="100" y="70" font-size="28" text-anchor="middle" font-family="Arial">PRUEBA SVG</text></svg>'
h = put(svg, 'svg'); x['costumes'].append({'name': 'Cartel raro', 'dataFormat': 'svg', 'assetId': h, 'md5ext': h + '.svg', 'rotationCenterX': 100, 'rotationCenterY': 60})
h = put(png(400, 300, 'LOGO', (10, 40, 160, 255)), 'png'); x['costumes'].append({'name': 'logo', 'bitmapResolution': 2, 'dataFormat': 'png', 'assetId': h, 'md5ext': h + '.png', 'rotationCenterX': 200, 'rotationCenterY': 150})
h = put(wav_pcm(880, 0.3), 'wav'); x['sounds'].append({'name': 'Sonido misterioso', 'assetId': h, 'dataFormat': 'wav', 'rate': 22050, 'sampleCount': 6000, 'md5ext': h + '.wav'})
targets.append(x)
proj = {'targets': targets, 'monitors': [], 'extensions': [], 'meta': {'semver': '3.0.0', 'vm': '0.2.0', 'agent': 'prueba'}}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('project.json', json.dumps(proj))
    for n, d in files.items(): z.writestr(n, d)
print(out, len(files), 'archivos')
