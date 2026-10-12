# Rótulos del Scratch traducidos al español (clasico/assets/project_es.json) -> sb3/img/*.webp + tools/img_es.json
# (mapa hash original -> hash español; la app lo aplica cuando el idioma no es portugués).
import json, os
from PIL import Image
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pt = json.load(open('/workspace/acerte/sb3x/assets/project.json')); es = json.load(open(W + '/clasico/assets/project_es.json'))
SPR = {'MenuEscolha', 'MenuEscolha2', 'Valores', 'Painel', 'ContagemDuelos', 'SimNaoResp', 'SimNaoResp2', 'Gcpgt1', 'BotãoMenu1', 'Menu', 'gcprojetos2'}
m = {}
for a, b in zip(pt['targets'], es['targets']):
    if a['name'] not in SPR: continue
    for ca, cb in zip(a['costumes'], b['costumes']):
        if ca['assetId'] != cb['assetId']:
            out = f"{W}/sb3/img/{cb['assetId']}.webp"
            if not os.path.exists(out): Image.open(f"{W}/clasico/assets/{cb['md5ext']}").convert('RGBA').save(out, 'WEBP', quality=88, method=4)
            m[ca['assetId']] = cb['assetId']
json.dump(m, open(W + '/tools/img_es.json', 'w')); print('rótulos ES', len(m))
