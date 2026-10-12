# Genera sb3/img, sb3/snd y tools/manifest.json a partir del proyecto Scratch «Acerte ou Caia!» (TurboWarp: assets/project.json).
# Mismo formato que el manifiesto de ¡Ahora caigo! (sprite -> costumes por nombre). Si un disfraz no existe en Acerte, se
# usa el disfraz equivalente de Acerte más parecido (o se conserva el de la plantilla).
import json, os, subprocess, sys
from PIL import Image
SRC = '/workspace/acerte/sb3x/assets'; W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
old = json.load(open('/workspace/ac_work/www/tools/manifest.json'))
p = json.load(open(SRC + '/project.json')); A = {t['name']: t for t in p['targets']}
os.makedirs(W + '/sb3/img', exist_ok=True); os.makedirs(W + '/sb3/snd', exist_ok=True)
def img(c):
    f = c['md5ext']; h = c['assetId']; out = f'{W}/sb3/img/{h}.webp'
    im = Image.open(SRC + '/' + f).convert('RGBA')
    if not os.path.exists(out): im.save(out, 'WEBP', quality=88, method=4)
    r = c.get('bitmapResolution', 1) or 1
    return {'n': c['name'], 'f': h, 'w': im.width, 'h': im.height, 'cx': float(c.get('rotationCenterX', 0)), 'cy': float(c.get('rotationCenterY', 0))}
SNDS = {}
for t in p['targets']:
    for s in t['sounds']:
        h = s['assetId']; out = f'{W}/sb3/snd/{h}.mp3'
        if not os.path.exists(out): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC + '/' + s['md5ext'], '-b:a', '128k', out], check=True)
        SNDS.setdefault(s['name'], h)
# sonidos propios de ¡Ahora caigo! -> equivalentes de Acerte ou Caia
ALIAS = {'Trilha': 'Acerte ou Caia Trilha.mp3', 'TemaCurto': 'TemaMCurto', 'AhoraCaigo - Intro.mp3': 'Acerte ou Caia Trilha.mp3',
  'AhoraCaigo - Fim.mp3': 'Acerte ou Caia TrilhaCurta.mp3', 'AhoraCaigo - Moeda.mp3': 'AcerteOuCaia SuspEdit',
  'AhoraCaigo - Queda.mp3': 'AcerteOuCaia Tchau.mp3', 'AhoraCaigo - ComeceDuelo.mp3': 'Acerte ou Caia Sirene.mp3'}
for i in range(1, 9): ALIAS[f'AhoraCaigo - Round{i}.mp3'] = ['SuspenseDuelo', 'AcerteOuCaia Susp.mp3', 'AcerteOuCaia SuspEdit'][i % 3]
sounds = {}
for k in old['sounds']:
    sounds[k] = SNDS.get(k) or SNDS.get(ALIAS.get(k, ''), None) or SNDS['AcerteOuCaia SuspEdit']
for k, h in SNDS.items(): sounds.setdefault(k, h)
FALLSPR = {'Quedatela1': 'BonecoCai', 'Quedatela2': 'BonecoCai', 'Quedatela3': 'Buraco', 'Quedatela4': 'Buraco', 'Vidas': 'Vida1'}
sprites = {}; keep = 0
for sp, v in old['sprites'].items():
    a = A.get(sp) or A.get(FALLSPR.get(sp, ''))
    cs = []
    for c in v['c']:
        ac = None
        if a:
            byname = {x['name']: x for x in a['costumes']}
            ac = byname.get(c['n'])
            if ac is None and sp == 'Resposta': ac = None
            if ac is None and sp not in ('Pergunta', 'Resposta') and a['costumes']: ac = a['costumes'][min(len(cs), len(a['costumes']) - 1)]
        if ac is not None: cs.append(img(ac))
        else: cs.append(c); keep += 1
    snd = {}
    for k, h in (v.get('s') or {}).items(): snd[k] = sounds.get(k, h)
    if a:
        for s in a['sounds']: snd.setdefault(s['name'], s['assetId'])
    sprites[sp] = dict(v, c=cs, s=snd) if 's' in v else dict(v, c=cs)
# sprites nuevos del proyecto Acerte (preguntas Sim/Não, Qual das 3, letras embaralhadas, bonecos...)
for n, t in A.items():
    if n not in sprites and not t['isStage']:
        sprites[n] = {'x': t.get('x', 0), 'y': t.get('y', 0), 'size': t.get('size', 100), 'c': [img(c) for c in t['costumes']], 's': {s['name']: s['assetId'] for s in t['sounds']}}
json.dump({'sprites': sprites, 'sounds': sounds}, open(W + '/tools/manifest.json', 'w'), ensure_ascii=False)
print('sprites', len(sprites), 'plantilla conservados', keep, 'sonidos', len(sounds))
