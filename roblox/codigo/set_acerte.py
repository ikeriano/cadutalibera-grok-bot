# Plató de ¡Acerte ou Caia! (plató redondo azul: trampillas con aros cian, una roja activa, paredes LED de chevrones) para Roblox (studs). Centro del escenario en (0,0,0); el frente (escaleras) mira a +Z.
import math, colorsys
from rbxlib import *
A = 56.0          # apotema del octógono del escenario
H = 8.0           # altura del escenario
RT = 38.0         # radio del anillo de trampillas
RH = 7.2          # radio del hueco de cada trampilla
FONDO = -26.0     # fondo de los fosos
NEGRO, BLANCO, GRIS = 0x141418, 0xF2F2F2, 0x5A5C64
ANG = [math.radians(40 + k * 280 / 9) for k in range(5)]  # Caduta Libera: 10 trampillas en un arco continuo y simétrico (solo hueco delante, escaleras)
TRAMP = [(0.0, 0.0, 0.0)] + [(s * math.sin(a) * RT, math.cos(a) * RT, a * s) for s in (-1, 1) for a in ANG]  # (x, z, ángulo)
ARO = [0x38D8FF] * 5
def hue(h): r, g, b = colorsys.hsv_to_rgb(h % 1, 1, 1); return int(r * 255) << 16 | int(g * 255) << 8 | int(b * 255)
def dentro_oct(x, z, a=A): return math.hypot(x, z) <= a  # escenario REDONDO
def en_hueco(x, z, r=RH): return any(math.hypot(x - tx, z - tz) < r for tx, tz, _ in TRAMP)
def tiras(pred, y, grosor, paso, nombre, color, mat='smooth', lim=A):
    # suelo hecho con tiras horizontales que dejan libres los huecos (para poder caer por las trampillas)
    out = []; z = -lim + paso / 2
    while z < lim:
        x = -lim; ini = None
        while x <= lim + 0.01:
            ok = pred(x, z)
            if ok and ini is None: ini = x
            if (not ok or x >= lim) and ini is not None:
                fin = x if not ok else x + .5
                if fin - ini > 0.4: out.append(part(nombre, ((ini + fin) / 2, y, z), (fin - ini, grosor, paso), color, mat))
                ini = None
            x += 0.5
        z += paso
    return out
def escenario():
    suelo = tiras(lambda x, z: dentro_oct(x, z) and not en_hueco(x, z), H - .5, 1, 2.0, 'Suelo', 0xD6DCEA, 'smooth')
    # podio central con franjas de colores y hueco central
    podio = tiras(lambda x, z: 6.2 < math.hypot(x, z) < 20 and not en_hueco(x, z, 6.2), H + 1, 2, 2.0, 'Podio', 0xEEF2FA, 'smooth', 20)
    for k in range(16):
        a = k * math.pi / 8
        podio.append(part('Franja', (math.sin(a) * 13, H + 2.05, math.cos(a) * 13), (1.6, 0.1, 12), 0x38D8FF if k % 2 else 0x1F5CFF, 'neon', rot=(a, 0, 0)))
    for k in range(48):
        a = k * math.pi / 24; podio.append(part('BordePodio', (math.sin(a) * 20, H + 1.2, math.cos(a) * 20), (2.7, 1.8, .5), 0x38D8FF, 'neon', rot=(a, 0, 0)))
    falda = []
    for k in range(8):
        a = k * math.pi / 4; L = 2 * A * math.tan(math.pi / 8)
        falda.append(part('Lateral', (math.sin(a) * A, H / 2 - .5, math.cos(a) * A), (L + .4, H, 1), NEGRO, 'smooth', rot=(a, 0, 0)))
    sotano = [part('Sotano', (0, FONDO - .5, 0), (2 * A, 1, 2 * A), 0x0A0A0E, 'smooth')]
    return model('Escenario', [model('SueloEscenario', suelo), model('PodioCentral', podio), model('Faldon', falda), model('Sotano', sotano)])
def trampillas():
    out = []
    for i, (x, z, a) in enumerate(TRAMP):
        r = 6.2 if i == 0 else RH; y = H + 2 if i == 0 else H; col = 0xBFF4FF if i == 0 else (0xFF2238 if i == 1 else ARO[(i - 1) % 5])
        ch = []
        w = r * 2 + .6
        for s, nm in ((-1, 'PuertaIzquierda'), (1, 'PuertaDerecha')):
            px, pz = x + s * (w / 4) * math.cos(a), z - s * (w / 4) * math.sin(a)
            ch.append(part(nm, (px, y - .25, pz), (w / 2, .5, w), (0x5A0A14 if i == 1 else 0x0A1E5A), 'smooth', rot=(a, 0, 0), children=[decal('Huellas', 1)] + [surface('Dibujo', 1, [label('Huella', '👣', (.1, .2), (.8, .6), 0xFF4A5A if i == 1 else 0x5FE6FF)], 20)]))
        for k in range(24):
            b = k * math.pi / 12
            ch.append(part('Aro', (x + math.sin(b) * (r + .4), y + .05, z + math.cos(b) * (r + .4)), (2 * math.pi * (r + .4) / 24 + .1, .3, .8), col, 'neon', rot=(b, 0, 0)))
        prof = (y - FONDO)
        for k in range(8):
            b = k * math.pi / 4; L = 2 * (r + .6) * math.tan(math.pi / 8)
            ch.append(part('Foso', (x + math.sin(b) * (r + .6), (y + FONDO) / 2 - .5, z + math.cos(b) * (r + .6)), (L + .3, prof - 1, .6), 0x08080C, 'smooth', rot=(b, 0, 0)))
        ch.append(part('Colchoneta', (x, FONDO + .5, z), (2 * r, 1, 2 * r), 0x3040A0, 'fabric'))
        if i > 0:  # atril del concursante, hacia fuera
            ax, az = x + math.sin(a) * (r + 3), z + math.cos(a) * (r + 3)
            ch.append(part('Atril', (ax, H + 2, az), (3, 4, 2), BLANCO, 'smooth', rot=(a, 0, 0), children=[surface('Rotulo', 5, [label('Numero', str(i), (0, 0), (1, .45), 0xFFD23A, 0x101830), label('Nombre', 'Concursante', (0, .5), (1, .45), 0xFFFFFF, 0x2040C0)], 30)]))
        out.append(model('Trampilla%d' % i, ch))
    return model('Trampillas', out)
def barandillas_led():
    rail, led = [], []
    L = 2 * A * math.tan(math.pi / 8)
    for k in range(8):
        a = k * math.pi / 4
        if k == 0: continue  # frente: escaleras
        cx, cz = math.sin(a) * (A - 1.2), math.cos(a) * (A - 1.2)
        for j, hh in enumerate((1.3, 2.6, 3.9)):
            rail.append(part('Acolchado', (cx, H + hh, cz), (L, 1.0, 1.0), BLANCO, 'fabric', 2 if False else 1, rot=(a, 0, 0)))
        for t in (-.5, 0, .5):
            rail.append(part('Poste', (cx + math.cos(a) * L * t, H + 2.4, cz - math.sin(a) * L * t), (.6, 4.8, .6), 0xD8D8D8, 'metal', rot=(a, 0, 0)))
        if k in (3, 4, 5, 2, 6):
            for s in range(6):
                t = (s + .5) / 6 - .5
                led.append(part('PanelLED', (cx + math.cos(a) * L * t, H + 8.5, cz - math.sin(a) * L * t), (L / 6 - .1, 7, .6), 0xFF2A3C if s % 3 == 0 else 0x1F6BFF, 'neon', rot=(a, 0, 0)))
    # escaleras blancas del frente (del suelo del plató al escenario) y del podio
    esc = []
    for s in range(8):
        esc.append(part('Escalon', (0, (s + .5) * H / 8, A + 1 + (8 - s) * 1.6), (14, H / 8, 1.6), BLANCO, 'smooth'))
    for s in range(2): esc.append(part('EscalonPodio', (0, H + .5 + s, 21.5 - s * 1.2), (6, 1, 1.2), BLANCO, 'smooth'))
    for x in (-7.2, 7.2): esc.append(part('Pasamanos', (x, H * .75, A + 8), (.4, .4, 15), 0xC0C0C8, 'metal', rot=(0, math.atan2(H, 13), 0)))
    return model('Barandillas', rail), model('PanelesLED', led), model('Escaleras', esc)
def truss(nombre, p0, p1, y, h=4.0):
    (x0, z0), (x1, z1) = p0, p1; L = math.hypot(x1 - x0, z1 - z0); a = math.atan2(x1 - x0, z1 - z0); cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    ux, uz = math.cos(a), -math.sin(a); out = []
    for sx in (-1, 1):
        for sy in (-1, 1): out.append(part('Cordon', (cx + ux * sx * h / 2, y + sy * h / 2, cz + uz * sx * h / 2), (.5, .5, L), BLANCO, 'metal', rot=(a, 0, 0)))
    n = int(L / h)
    for k in range(n):
        t = (k + .5) / n - .5; px, pz = cx + math.sin(a) * L * t, cz + math.cos(a) * L * t
        for sx in (-1, 1): out.append(part('Diagonal', (px + ux * sx * h / 2, y, pz + uz * sx * h / 2), (.35, h * 1.4, .35), BLANCO, 'metal', rot=(a, (1 if k % 2 else -1) * .78, 0)))
    return model(nombre, out)
def techo():
    Y = 72; t = []
    for v in (-60, -30, 0, 30, 60):
        t.append(truss('Truss', (-80, v), (80, v), Y)); t.append(truss('Truss', (v, -80), (v, 80), Y))
    focos = []; colores = [0x9FD8FF, 0xFFFFFF, 0x7A4AFF, 0x38D8FF, 0xFFFFFF, 0xB040FF]
    k = 0
    for x in (-60, -30, 0, 30, 60):
        for z in (-60, -30, 0, 30, 60):
            if abs(x) == 60 and abs(z) == 60: continue
            c = colores[k % len(colores)]; k += 1
            base = part('Base', (x, Y - 3, z), (2.4, 1, 2.4), 0x202024, 'metal')
            cab = part('Cabeza', (x, Y - 5, z), (2.6, 2.8, 2.6), 0x18181C, 'metal', rot=(0, .4 * math.sin(k), .4 * math.cos(k)), children=[spot(8, 90, 25, c, 4, 'Haz')])
            haz = part('Rayo', (x, Y - 5 - 30, z), (1.5, 60, 1.5), c, 'neon', transp=.82, collide=False, rot=(0, .4 * math.sin(k), .4 * math.cos(k)))
            focos.append(model('CabezaMovil%d' % k, [base, cab, haz]))
    marc = []
    for nm, x, c in (('MarcadorVerde', -20, 0x22FF55), ('MarcadorRojo', 20, 0xFF2A2A)):
        ch = [part('Marco', (x, 52, -16), (26, 6, 2), BLANCO, 'metal')]
        for s in range(5): ch.append(part('Segmento%d' % (s + 1), (x - 10 + s * 5, 52, -14.9), (4.4, 4.4, .3), c, 'neon'))
        for dx in (-12, 12): ch.append(part('Cable', (x + dx, 62, -16), (.2, 18, .2), 0x101010, 'metal'))
        marc.append(model(nm, ch))
    paneles = []
    for (x, z, c, ry) in ((-58, -40, 0x1F5CFF, .6), (58, -40, 0x1F5CFF, -.6), (-58, 40, 0x7A2AFF, -.6), (58, 40, 0x7A2AFF, .6)):
        paneles.append(part('PanelColor', (x, 64, z), (44, 2, 26), c, 'neon', rot=(ry, 0, .45 if x > 0 else -.45)))
    return model('Techo', t), model('Focos', focos), model('Marcadores', marc), model('PanelesColor', paneles)
def gradas():
    g = []
    for lado in (-1, 1):
        for f in range(7):
            r = 72 + f * 4; h = 2 + f * 2.2
            for k in range(14):
                a = lado * math.radians(25 + k * 9.5); L = 2 * math.pi * r * 9.5 / 360 + .3
                g.append(part('Grada', (math.sin(a) * r, h / 2, math.cos(a) * r), (L, h, 4), 0xE8E8EC, 'smooth', rot=(a, 0, 0)))
                g.append(part('Asiento', (math.sin(a) * r, h + .8, math.cos(a) * r + 0), (L - .6, 1.4, 1.6), BLANCO, 'fabric', rot=(a, 0, 0)))
    for lado in (-1, 1):
        for k in range(5):
            a = lado * math.radians(32 + k * 24); r = 70
            g.append(part('IconoHuella', (math.sin(a) * r, 20, math.cos(a) * r), (5, 5, .6), 0x0A2A7A, 'smooth', rot=(a, 0, 0), children=[surface('Icono', 1, [label('Huella', '👣', (.1, .1), (.8, .8), 0x5FE6FF)], 20), surface('Icono', 4, [label('Huella', '👣', (.1, .1), (.8, .8), 0x5FE6FF)], 20)]))
            for j in range(3):
                g.append(part('Chevron', (math.sin(a) * (r + 6), 30 + j * 4, math.cos(a) * (r + 6)), (7, 2, .6), 0xFF2A3C if (k + j) % 3 == 0 else 0x1F6BFF, 'neon', rot=(a, 0, 0.6 if j % 2 else -0.6)))
    pant = []
    for x in (-70, 70):
        pant.append(part('PantallaLateral', (x, 34, -30), (1, 14, 24), 0x050510, 'smooth', rot=(math.pi / 2 if x > 0 else -math.pi / 2, 0, 0),
            children=[decal('Logo', 5), surface('Texto', 5, [label('Logo', 'CADUTA\nLIBERA', (.05, .1), (.9, .8), 0xFFFFFF, 0x1030C0, 4)], 20)]))
    return model('Gradas', g), model('Pantallas', pant)
def pantalla_fondo():
    Z = -86; lbl = [label('Titulo', 'PREMIOS', (.3, .02), (.4, .08), 0xFFD23A, None, 4)]
    filas = ['20.000 €', '15.000 €', '15.000 €', '10.000 €', '10.000 €', '10.000 €', '7.000 €', '5.000 €', '5.000 €', '3.000 €']
    for i, t in enumerate(filas):
        lbl.append(label('Escalon%d' % (10 - i), t, (.06, .12 + i * .078), (.32, .068), 0x3A2A00, 0xFFC820, 4))
        lbl.append(label('Huella%d' % (10 - i), '👣', (.40, .12 + i * .078), (.06, .068), 0xFFD23A, None))
    lbl.append(label('Premio', '0', (.55, .3), (.35, .2), 0x2A1A00, 0xFFC820, 4)); lbl.append(label('Tiempo', '30', (.62, .58), (.21, .14), 0x2A1A00, 0xFFC820, 4))
    lbl.append(label('Rotulo', 'CADUTA LIBERA · ¡AHORA CAIGO!', (.5, .82), (.45, .1), 0xFFFFFF, None, 4))
    pant = part('PantallaFondo', (0, 38, Z), (90, 44, 1), 0x0A2AA8, 'neon', children=[decal('FondoPantalla', 2), surface('Escalera', 2, [image('FondoPantalla', (0, 0), (1, 1))] + lbl, 12)])
    # muro negro bajo la pantalla con la puerta de entrada desde el backstage
    muro = [part('MuroFondo', (-28, 8, Z), (34, 16, 2), 0x0A0A0A, 'smooth'), part('MuroFondo', (28, 8, Z), (34, 16, 2), 0x0A0A0A, 'smooth'), part('Dintel', (0, 13.5, Z), (22, 5, 2), 0x0A0A0A, 'smooth')]
    puerta = part('PuertaEntrada', (0, 5.5, Z), (10, 11, 1), 0x1428E0, 'smooth', children=[decal('PuertaLogo', 2), decal('PuertaLogo', 5), surface('LogoPuerta', 5, [label('Texto', '¡AHORA\nCAIGO!', (.05, .25), (.9, .5), 0xFFFFFF, None, 4)], 20), surface('LogoPuertaPlato', 2, [label('Texto', '¡AHORA\nCAIGO!', (.05, .25), (.9, .5), 0xFFFFFF, None, 4)], 20),
        item('ProximityPrompt', [S('Name', 'Entrar'), S('ActionText', 'Entrar al plató'), S('ObjectText', 'Puerta'), F('MaxActivationDistance', 10), F('HoldDuration', 0)])])
    return model('PantallaFondo', [pant] + muro + [puerta])
def backstage():
    Z0 = -87; b = [part('SueloBackstage', (0, -.5, Z0 - 25), (120, 1, 50), 0x6A6C74, 'diamond')]
    for x in (-60, 60): b.append(part('ParedBackstage', (x, 12, Z0 - 25), (1, 24, 50), 0x3A3A40, 'diamond'))
    b.append(part('ParedBackstage', (0, 12, Z0 - 50), (120, 24, 1), 0x3A3A40, 'diamond'))
    for lado in (-1, 1):  # estanterías / gradas escalonadas grises y escaleras metálicas oscuras junto a la puerta
        for s in range(7): b.append(part('Estante', (lado * 14, 1 + s * 2, Z0 - 6 - s * 1.5), (12, .6, 3), 0x4A4C52, 'metal'))
        for s in range(10): b.append(part('EscaleraMetal', (lado * 28, .5 + s, Z0 - 4 - s * 1.4), (6, 1, 1.4), 0x2A2A2E, 'diamond'))
        b.append(part('Barandilla', (lado * 31, 6, Z0 - 10), (.3, .3, 15), 0x2A2A2E, 'metal', rot=(0, math.atan2(10, 14), 0)))
    # sala de control: botones rojos 0-10 (abren esa trampilla) y botones de color de los LED
    cx, cz = 42, Z0 - 38; sala = [part('SueloSala', (cx, .05, cz), (22, .2, 18), 0x22CC33, 'smooth'), part('ParedBotones', (cx, 9, cz - 8.5), (22, 18, 1), 0x56585E, 'diamond')]
    for n in range(11):
        fx, fy = cx - 9 + (n % 6) * 3.6, 12 - (n // 6) * 4
        sala.append(part('Boton%d' % n, (fx, fy, cz - 7.8), (1, 3, 3), 0xE02020, 'smooth', 2, rot=(math.pi / 2, 0, 0), children=[click(30), surface('Num', 3, [label('N', str(n), (0, 0), (1, 1), 0xF0F0F0, None, 4)], 30)]))
    for j, (nm, c) in enumerate((('LED_Apagar', 0x202020), ('LED_Arcoiris', 0xFFFFFF), ('LED_Rojo', 0xFF2020), ('LED_Azul', 0x2050FF), ('LED_Verde', 0x20E040), ('LED_Morado', 0xA020FF), ('LED_Amarillo', 0xFFD020), ('Cerrar_Trampillas', 0x808080))):
        sala.append(part(nm, (cx - 9 + j * 2.6, 3.5, cz - 6), (2.2, 2.2, 2.2), c, 'neon' if c != 0x202020 else 'smooth', children=[click(20), surface('Etiqueta', 2, [label('T', nm.replace('_', ' '), (0, 0), (1, 1), 0x000000 if c in (0xFFFFFF, 0xFFD020, 0x20E040) else 0xFFFFFF, None, 3)], 40)]))
    sala.append(part('Mesa', (cx, 1.5, cz - 6), (22, 3, 3), 0xE8E8E8, 'smooth'))
    return model('Backstage', b + [model('SalaControl', sala)])
def camaras():
    pos = [('Camara1', (0, 30, 95), (0, 8, 0)), ('Camara2', (0, 70, 10), (0, 0, 0)), ('Camara3', (-60, 25, 60), (0, 8, 0)), ('Camara4', (0, 20, -60), (0, 8, 20)), ('Camara5', (45, 16, 45), (0, 10, 0))]
    out = []
    for nm, p, mira in pos:
        dx, dy, dz = mira[0] - p[0], mira[1] - p[1], mira[2] - p[2]; ry = math.atan2(-dx, -dz); rx = math.atan2(dy, math.hypot(dx, dz))
        out.append(part(nm, p, (1, 1, 1), 0xFF0000, transp=1, collide=False, rot=(ry, rx, 0)))
    return folder('Camaras', out)
def plato_ac():
    W = 130; suelo = [part('SueloEstudio', (0, -.5, (A + 115) / 2), (2 * W, 1, 115 - A), 0x0E0E14, 'smooth'), part('SueloEstudio', (0, -.5, -(A + 87) / 2), (2 * W, 1, 87 - A), 0x0E0E14, 'smooth'),
             part('SueloEstudio', (-(A + W) / 2, -.5, 0), (W - A, 1, 2 * A), 0x0E0E14, 'smooth'), part('SueloEstudio', ((A + W) / 2, -.5, 0), (W - A, 1, 2 * A), 0x0E0E14, 'smooth')]
    br, led, esc = barandillas_led(); te, fo, ma, pa = techo(); gr, pan = gradas()
    return model('PlatoAhoraCaigo', [model('Suelo', suelo), escenario(), trampillas(), br, led, esc, te, fo, ma, pa, gr, pan, pantalla_fondo(), backstage()]), camaras()
