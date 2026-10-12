# Traduce al portugués de Brasil los textos de tmp/textos.json con opus-mt-tc-big-itc-itc (CTranslate2, sin conexión).
# Salida: tools/pt_dic.json (caché {es: pt}); revisiones manuales en tools/pt_manual.json (tienen prioridad).
import json, os, re, sys, ctranslate2, transformers
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tok = transformers.AutoTokenizer.from_pretrained('Helsinki-NLP/opus-mt-tc-big-itc-itc')
tr = ctranslate2.Translator('/workspace/mt_itc', device='cpu', compute_type='float32', inter_threads=1, intra_threads=os.cpu_count())
cache_p = D + '/tools/pt_dic.json'; cache = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
def mt(lista):
    lista = sorted([x for x in dict.fromkeys(lista) if x not in cache and x.strip()], key=len)
    for i in range(0, len(lista), 64):
        lote = lista[i:i + 64]
        src = [tok.convert_ids_to_tokens(tok.encode('>>por<< ' + x)) for x in lote]
        res = tr.translate_batch(src, max_batch_size=64, beam_size=2, max_decoding_length=200)
        for x, r in zip(lote, res): cache[x] = tok.decode(tok.convert_tokens_to_ids(r.hypotheses[0]), skip_special_tokens=True)
        print(i + len(lote), '/', len(lista), flush=True)
        if i % 640 == 0: json.dump(cache, open(cache_p, 'w'), ensure_ascii=False)
    json.dump(cache, open(cache_p, 'w'), ensure_ascii=False)
def proteger(s):  # placeholders {n}, ${...} no aparecen (las plantillas se trocean), números y emojis se conservan
    return s
T = json.load(open(D + '/tmp/textos.json'))
piezas = []
for o in T:
    v = o['v']
    m = re.match(r'^(.*)\|([^|]*\[[^|]*)$', v, re.S)
    if m: piezas += [m.group(1), m.group(2).replace('[', '').replace(']', '').capitalize()]
    elif re.search(r'</?[a-z][^>]*>', v, re.I):
        piezas += [p for p in re.split(r'(<[^>]*>)', v) if p and not p.startswith('<') and re.search(r'[A-Za-zÁ-ú]{2}', p)]
    else:
        # trocear por {x} para no romper marcadores
        piezas += [p for p in re.split(r'(\{[\w.]+\})', v) if p and not re.fullmatch(r'\{[\w.]+\}', p) and re.search(r'[A-Za-zÁ-ú]{2}', p)]
frases = []
piezas = [(p[0] + p[1:].lower()) if p == p.upper() and len(p) > 4 else p for p in piezas]
for p in piezas: frases += [f for f in re.split(r'(?<=[.!?…])\s+', p) if f]
mt(frases)
print('ok', len(cache))
