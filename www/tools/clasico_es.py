# Genera la versión en español del Clásico (TurboWarp): project_es.json + imágenes nuevas en clasico/assets.
# Preguntas (Pergunta/Resposta), Sim ou Não, Qual das 3, Letras embaralhadas y los rótulos con texto en portugués.
import json, hashlib, io, copy, os, sys, unicodedata
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC = '/workspace/acerte/sb3x/assets'; OUT = sys.argv[1] if len(sys.argv) > 1 else '/workspace/acerte/www/clasico/assets'
G = '/usr/share/fonts/truetype/sand-box/google/'
def F(name, size, var=None):
    f = ImageFont.truetype(G + name, size)
    if var: f.set_variation_by_name(var)
    return f
OSW = lambda s, v='Bold': F('Oswald/Oswald-VariableFont_wght.ttf', s, v)
MON = lambda s, v='ExtraBold': F('Montserrat/Montserrat-VariableFont_wght.ttf', s, v)
p = json.load(open(SRC + '/project.json')); q = copy.deepcopy(p); T = {t['name']: t for t in q['targets']}
nuevos = 0
def guarda(im, cost, name=None, cx=None, cy=None):
    global nuevos
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); data = b.getvalue(); md5 = hashlib.md5(data).hexdigest()
    open(f'{OUT}/{md5}.png', 'wb').write(data); nuevos += 1
    cost.update(assetId=md5, md5ext=md5 + '.png', dataFormat='png')
    if name is not None: cost['name'] = name
    if cx is not None: cost['rotationCenterX'] = cx
    if cy is not None: cost['rotationCenterY'] = cy
def abre(c): return Image.open(f"{SRC}/{c['md5ext']}").convert('RGBA')
def tw(d, s, f): b = d.textbbox((0, 0), s, font=f); return b[2] - b[0]
def texto(d, xy, s, f, fill, stroke=None, sw=0, anchor='mm'):
    d.text(xy, s, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke, anchor=anchor)
def ajusta(d, lines, mk, size, maxw, minsize=14):
    while size > minsize and max(tw(d, l, mk(size)) for l in lines) > maxw: size -= 1
    return mk(size), size
def parte(d, s, f, maxw):
    ws = s.split(); ls = ['']
    for w in ws:
        t = (ls[-1] + ' ' + w).strip()
        if tw(d, t, f) <= maxw or not ls[-1]: ls[-1] = t
        else: ls.append(w)
    return ls
def plano(s): return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
dummy = ImageDraw.Draw(Image.new('RGBA', (10, 10)))
BLUE = (16, 24, 140, 255); NAVY = (10, 20, 88, 255)

# ---------- 1. Clásico: Pergunta + Resposta (pregunta, palabra en casillas; Resposta tapa las letras que faltan) ----------
tsv = [l.rstrip('\n').split('\t') for l in open('/workspace/acerte/datos/preguntas.tsv', encoding='utf-8')]
caja = abre(T['Resposta']['costumes'][0]).crop((106, 0, 154, 70))   # casilla blanca vacía original (48x70)
usados = set()
for i, (cP, cR) in enumerate(zip(T['Pergunta']['costumes'], T['Resposta']['costumes'])):
    preg, pal = tsv[i][2], tsv[i][3].upper()
    n = len(pal); ok = [k for k, ch in enumerate(pal) if 'A' <= ch <= 'Z']
    falta = None
    for start in (0, 1):
        for paso in (2, 3):
            cand = ok[start::paso]
            if len(cand) < 2 and len(ok) >= 2: cand = ok[:2]
            nm = ''.join(pal[k] for k in cand)
            if nm and nm not in usados and len(cand) < len(pal.replace(' ', '')): falta = cand; break
        if falta: break
    if not falta:
        for extra in range(1, len(ok)):
            cand = ok[:1] + ok[extra:extra + 1]; nm = ''.join(pal[k] for k in cand)
            if nm not in usados: falta = cand; break
    nm = ''.join(pal[k] for k in falta); usados.add(nm)
    # Pergunta: alto 126, pregunta arriba (0..48), casillas 56..126; centro de la palabra = cx - 26 (como en el original)
    fq, _ = ajusta(dummy, [preg], lambda s: OSW(s, 'Bold'), 40, 940)
    W = max(tw(dummy, preg, fq) + 24, n * 52 + 120); W += W % 2; H = 126; cx = W // 2
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    texto(d, (cx, 24), preg, fq, (255, 255, 255, 255), NAVY, 3)
    x0 = cx - 26 - n * 26; fl = OSW(46, 'Bold')
    for k, ch in enumerate(pal):
        if ch == ' ': continue
        x = x0 + k * 52 + 2; im.alpha_composite(caja, (x, 56)); texto(d, (x + 24, 56 + 35), ch, fl, BLUE)
    guarda(im, cP, nm, cx, -120)
    # Resposta: lienzo 624x70, centro (312,-176); centro de la palabra en x=286
    r = Image.new('RGBA', (624, 70), (0, 0, 0, 0)); rx0 = 286 - n * 26
    for k in falta: r.alpha_composite(caja, (rx0 + k * 52 + 2, 0))
    guarda(r, cR, nm, 312, -176)

# ---------- 2. Sim ou Não ----------
B = json.load(open('/tmp/bancos.json'))
for c, (cat, fr, sn) in zip(T['QSimNao']['costumes'], B['sn']):
    fc = OSW(74, 'Bold'); fs = OSW(38, 'SemiBold')
    ls = parte(dummy, fr, fs, 560)
    W = max(tw(dummy, cat, fc), max(tw(dummy, l, fs) for l in ls)) + 20; W += W % 2; H = 92 + 40 * len(ls) + 6
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 40), cat, fc, NAVY)
    for k, l in enumerate(ls): texto(d, (W // 2, 92 + 20 + 40 * k), l, fs, (255, 255, 255, 255), NAVY, 3)
    guarda(im, c, None, W // 2, -114)

# ---------- 3. ¿Cuál de las 3? (los nombres A1/B1/C1 indican la respuesta: no cambian) ----------
for c, (pr, ops, ix) in zip(T['QQualDas3']['costumes'], B['q3']):
    fp, _ = ajusta(dummy, [pr], lambda s: OSW(s, 'SemiBold'), 34, 700); fo = OSW(44, 'Bold')
    W = 712; H = 142; im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 19), pr, fp, (255, 255, 255, 255), NAVY, 3)
    texto(d, (4, 117), ops[0], fo, (255, 255, 255, 255), NAVY, 3, 'lm'); texto(d, (W // 2, 117), ops[1], fo, (255, 255, 255, 255), NAVY, 3); texto(d, (W - 4, 117), ops[2], fo, (255, 255, 255, 255), NAVY, 3, 'rm')
    guarda(im, c, None, 350, -146)

# ---------- 4. Letras embaralhadas: el nombre del disfraz es la respuesta (sin tildes) ----------
import random
for c, (pista, pal) in zip(T['QEmbaralhadas']['costumes'], B['le']):
    w = pal.upper(); rnd = random.Random(w); letras = list(w)
    for _ in range(20):
        rnd.shuffle(letras)
        if ''.join(letras) != w: break
    fp, _ = ajusta(dummy, [pista], lambda s: OSW(s, 'SemiBold'), 40, 720); n = len(w)
    W = max(tw(dummy, pista, fp) + 16, n * 52 + 20); W += W % 2; H = 206
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 24), pista, fp, (255, 255, 255, 255), NAVY, 3)
    x0 = W // 2 - n * 26; fl = OSW(46, 'Bold')
    for k, ch in enumerate(letras): x = x0 + k * 52 + 2; im.alpha_composite(caja.resize((48, 66)), (x, 60)); texto(d, (x + 24, 60 + 33), ch, fl, BLUE)
    texto(d, (W // 2, 186), '  '.join(w), OSW(36, 'Bold'), (255, 255, 255, 255), NAVY, 3)
    guarda(im, c, plano(w), W // 2, -116)

# ---------- 5. Rótulos con texto en portugués (se tapa el texto con un parche difuminado y se escribe en español) ----------
def parche(im, box, modo='blur', color=None):
    x0, y0, x1, y1 = box; reg = im.crop(box)
    if modo == 'blur':
        big = im.crop((max(0, x0 - 40), max(0, y0 - 40), min(im.width, x1 + 40), min(im.height, y1 + 40)))
        for _ in range(4): big = big.filter(ImageFilter.GaussianBlur(28))
        reg = big.crop((x0 - max(0, x0 - 40), y0 - max(0, y0 - 40), x0 - max(0, x0 - 40) + (x1 - x0), y0 - max(0, y0 - 40) + (y1 - y0)))
        im.paste(reg, (x0, y0))
    elif modo == 'clear':
        im.paste((0, 0, 0, 0), box)
    elif modo == 'color':
        if color is None:
            px = list(reg.getdata()); px.sort(key=lambda c: sum(c[:3])); color = px[len(px) // 4]
        ImageDraw.Draw(im).rectangle(box, fill=color)
def disco(im, cx, cy, r):
    d = ImageDraw.Draw(im)
    for k in range(r, 0, -2):
        t = k / r; col = (int(6 + 22 * (1 - t)), int(14 + 40 * (1 - t)), int(70 + 90 * (1 - t)), 255); d.ellipse((cx - k, cy - k, cx + k, cy + k), fill=col)
def rotulo(im, box, lines, mk, size, fill, stroke=None, sw=0, modo='blur', color=None, interl=1.12, align='m'):
    parche(im, box, modo, color); d = ImageDraw.Draw(im); x0, y0, x1, y1 = box
    f, s = ajusta(d, lines, mk, size, (x1 - x0) - 10)
    while s > 10 and len(lines) * s * interl > (y1 - y0): s -= 1; f = mk(s)
    tot = len(lines) * s * interl; y = (y0 + y1) / 2 - tot / 2 + s * interl / 2
    for l in lines:
        x = (x0 + x1) / 2 if align == 'm' else x0 + 6
        texto(d, (x, y), l, f, fill, stroke, sw, 'mm' if align == 'm' else 'lm'); y += s * interl
W_ = (255, 255, 255, 255); AM = (255, 214, 58, 255); CREMA = (255, 240, 190, 255); OSC = (20, 14, 60, 255)
def C(tn, cn): return next(c for c in T[tn]['costumes'] if c['name'] == cn)
def edita(tn, cn, fn):
    c = C(tn, cn); im = abre(c); fn(im); guarda(im, c)
edita('MenuEscolha', '1', lambda im: rotulo(im, (22, 6, 156, 54), ['ELIGE AL', 'OPONENTE'], lambda s: MON(s, 'Black'), 22, AM, modo='color', color=(18, 18, 30, 255)))
for k in range(3, 9): edita('MenuEscolha2', str(k), lambda im, k=k: rotulo(im, (14, 8, 164, 52), [f'{k} PREGUNTAS'], lambda s: OSW(s, 'Bold'), 34, AM, modo='color', color=(12, 12, 20, 255)))
edita('MenuEscolha2', '1', lambda im: rotulo(im, (200, 50, 770, 250), ['¡QUE EMPIECE', 'EL DUELO!'], lambda s: MON(s, 'Black'), 70, W_, NAVY, 4))
for cn, t in (('LetrasEmb', ['LETRAS', 'DESORDENADAS']), ('SimOuNao', ['¿SÍ', 'O', 'NO?']), ('QualDos3', ['¿CUÁL DE', 'LAS 3?'])):
    edita('MenuEscolha', cn, lambda im, t=t: (disco(im, 110, 67, 67), rotulo(im, (56, 30, 164, 104), t, lambda s: MON(s, 'Black'), 26, AM, OSC, 2, modo='none')))
for cn, t, col in (('S', 'SÍ', None), ('N', 'NO', None), ('ErroS', 'SÍ', None), ('ErroN', 'NO', None)):
    edita('SimNaoResp', cn, lambda im, t=t: rotulo(im, (14, 10, 114, 96), [t], lambda s: OSW(s, 'Bold'), 70, W_, modo='color'))
edita('Gcpgt1', 'SimOuNao', lambda im: (rotulo(im, (116, 104, 236, 192), ['SÍ'], lambda s: OSW(s, 'Bold'), 60, W_, modo='color'), rotulo(im, (726, 104, 840, 192), ['NO'], lambda s: OSW(s, 'Bold'), 60, W_, modo='color')))
edita('Valores', 'MoedaCapa', lambda im: rotulo(im, (190, 28, 770, 76), ['ELIGE UN LADO DE LA MONEDA'], lambda s: MON(s, 'ExtraBold'), 32, W_))
edita('Painel', '1', lambda im: rotulo(im, (60, 592, 900, 668), ['ESPERA LA PRÓXIMA PREGUNTA...'], lambda s: MON(s, 'ExtraBold'), 38, W_, (0, 60, 20, 255), 3))
edita('Painel', 'Placar1T', lambda im: rotulo(im, (322, 392, 638, 448), ['PIERDE TODO'], lambda s: MON(s, 'Black'), 32, (255, 230, 120, 255), modo='color', color=(214, 20, 30, 255)))
edita('ContagemDuelos', 'GcPerdeu', lambda im: rotulo(im, (80, 180, 880, 290), ['FIN DEL JUEGO'], lambda s: MON(s, 'Black'), 92, (255, 225, 225, 255), (190, 10, 30, 255), 5))
def df(im):
    rotulo(im, (100, 222, 860, 312), ['¡HAS DERRIBADO A LOS 10 OPONENTES!', 'ELIGE:'], lambda s: MON(s, 'ExtraBold'), 36, CREMA, OSC, 3)
    rotulo(im, (56, 360, 410, 486), ['PARAR Y QUEDARTE CON', 'LA MITAD DEL TOTAL', 'ACUMULADO.'], lambda s: MON(s, 'ExtraBold'), 30, CREMA, OSC, 3)
    rotulo(im, (500, 342, 930, 512), ['IR A LA ÚLTIMA FASE Y', 'RESPONDER 10 PREGUNTAS', 'EN 2 MINUTOS. SI ACIERTAS,', 'DOBLAS EL MARCADOR Y GANAS.', 'SI FALLAS, ¡LO PIERDES TODO!'], lambda s: MON(s, 'ExtraBold'), 28, CREMA, OSC, 3)
edita('Painel', 'DesafioFinal', df)
def esp(sub, par, botones=None):
    def f(im):
        rotulo(im, (102, 62, 858, 172), ['RONDA ESPECIAL'], lambda s: MON(s, 'Black'), 84, (20, 40, 160, 255), modo='color', color=(250, 200, 0, 255))
        rotulo(im, (200, 170, 760, 240) if sub != '¿SÍ O NO?' else (300, 170, 650, 240), [sub], lambda s: MON(s, 'Black'), 40, W_, modo='color', color=(16, 48, 200, 255))
        rotulo(im, (30, 330, 930, 450), par, lambda s: MON(s, 'ExtraBold'), 32, W_, OSC, 3)
        if botones: [rotulo(im, b, [t], lambda s: OSW(s, 'Bold'), 52, W_, modo='color') for b, t in botones]
    return f
edita('SimNaoResp2', 'LetrasEmb', esp('LETRAS DESORDENADAS', ['EL JUGADOR DEBE USAR EL TECLADO VIRTUAL', 'PARA ESCRIBIR LA RESPUESTA EN EL ORDEN CORRECTO.']))
edita('SimNaoResp2', 'SimOuNao', esp('¿SÍ O NO?', ['EL JUGADOR SOLO TENDRÁ CINCO SEGUNDOS', 'PARA RESPONDER A LA PREGUNTA SOBRE', 'EL TEMA QUE APAREZCA.'], [((266, 548, 380, 640), 'SÍ'), ((596, 548, 706, 640), 'NO')]))
edita('SimNaoResp2', 'QualDas3', esp('¿CUÁL DE LAS 3?', ['EL JUGADOR SOLO TENDRÁ CINCO SEGUNDOS', 'PARA RESPONDER ELIGIENDO', 'UNA DE LAS TRES OPCIONES.']))
for cn, t in (('1', ['LETRAS', 'DESORDENADAS']), ('2', ['¿SÍ', 'O', 'NO?']), ('3', ['¿CUÁL DE', 'LAS 3?'])):
    edita('SimNaoResp2', cn, lambda im, t=t: (disco(im, 480, 360, 292), rotulo(im, (250, 230, 710, 490), t, lambda s: MON(s, 'Black'), 100, AM, OSC, 4, modo='none')))
def reglas(im):
    rotulo(im, (24, 6, 474, 92), ['En ¡Acerte ou Caia! eres el líder y tendrás', 'que derribar a los 10 oponentes en duelos', 'emocionantes.'], lambda s: MON(s, 'Bold'), 21, W_, OSC, 2)
    rotulo(im, (528, 12, 954, 192), ['Usa el teclado virtual para completar', 'las letras que faltan antes de que se', 'acabe el tiempo.', '', 'Si no lo sabes, pulsa el botón amarillo', 'para pasar la pregunta al oponente y', 'usa las vidas para seguir en el juego.'], lambda s: MON(s, 'Bold'), 21, (20, 20, 120, 255))
    rotulo(im, (16, 268, 476, 352), ['En esta versión, además de las preguntas clásicas,', 'habrá 3 rondas especiales: letras desordenadas,', '¿sí o no? y ¿cuál de las 3?'], lambda s: MON(s, 'Bold'), 21, W_, OSC, 2)
    rotulo(im, (488, 392, 956, 650), ['Si derribas a los 10 adversarios, podrás', 'elegir entre salir con la mitad de lo ganado', 'o enfrentarte al DESAFÍO FINAL: responder', '10 preguntas en 2 minutos sin pasar ni fallar.', '', 'Si superas el desafío, el premio se multiplica', 'y puede llegar hasta 300 MIL.', 'Si fallas, caes por la trampilla y lo pierdes todo.', '¡DIVIÉRTETE!'], lambda s: MON(s, 'Bold'), 21, W_, OSC, 2)
    rotulo(im, (18, 594, 478, 698), ['Por cada duelo ganado, el líder podrá', 'elegir un lado de la moneda: sumar al marcador,', 'ganar una vida extra o incluso perder todo', 'lo conseguido hasta la ronda.'], lambda s: MON(s, 'Bold'), 21, (20, 20, 120, 255))
    rotulo(im, (782, 660, 936, 706), ['EMPEZAR'], lambda s: MON(s, 'Black'), 30, AM, modo='color', color=(16, 12, 20, 255))
edita('BotãoMenu1', 'AhoraCaigoRegras', reglas)
edita('BotãoMenu1', '1', lambda im: rotulo(im, (206, 16, 520, 104), ['JUGAR'], lambda s: MON(s, 'Black'), 64, (222, 228, 255, 255), (40, 50, 120, 255), 2, modo='clear'))
for tn in ('Menu', 'gcprojetos2'): edita(tn, '1', lambda im: rotulo(im, (316, 608, 644, 694), ['JUGAR'], lambda s: MON(s, 'Black'), 64, (222, 228, 255, 255), (40, 50, 120, 255), 2))
json.dump(q, open(OUT + '/project_es.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevos', nuevos, 'nombres', len(usados))
