# frases speechSynthesis de un bundle de la familia Ahora Caigo: guion del sketch (JSON de recoge_ac.mjs) + apertura (regex) → [[texto, perfil]]
# uso: frases_acfam.py guion.json bundle.js salida.json [perfil_a perfil_r]
import json, re, sys
g = json.load(open(sys.argv[1])); s = open(sys.argv[2], encoding='utf8').read(); pa, pr = (sys.argv[4], sys.argv[5]) if len(sys.argv) > 5 else ('adrian', 'arturo')
F = [[t, pa if q == 'a' else pr] for t, q in g]
F += [[t, pa] for t in re.findall(r'\[[0-9.]+,[0-9.]+,"[^"]*","([^"]*)"\]', s)]
F += [[re.sub(r'^,\s*', '', t), pa] for t in re.findall(r'"¡"\+\w{1,3}\+"([^"]*)"', s)]
json.dump(F, open(sys.argv[3], 'w'), ensure_ascii=False); print(len(F))
