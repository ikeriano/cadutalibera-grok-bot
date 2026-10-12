# Utilidades para escribir lugares de Roblox (.rbxlx, XML versión 4)
import math, itertools, re
from xml.sax.saxutils import escape
_ref = itertools.count(1)
def R(): return 'RBX%08X' % next(_ref)
def cf(x, y, z, ry=0.0, rx=0.0, rz=0.0):
    cy, sy, cx, sx, cz, sz = math.cos(ry), math.sin(ry), math.cos(rx), math.sin(rx), math.cos(rz), math.sin(rz)
    Ry = [[cy,0,sy],[0,1,0],[-sy,0,cy]]; Rx = [[1,0,0],[0,cx,-sx],[0,sx,cx]]; Rz = [[cz,-sz,0],[sz,cz,0],[0,0,1]]
    mul = lambda A, B: [[sum(A[i][k]*B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
    M = mul(mul(Ry, Rx), Rz); v = [x, y, z] + [M[i][j] for i in range(3) for j in range(3)]
    n = ['X','Y','Z','R00','R01','R02','R10','R11','R12','R20','R21','R22']
    return ''.join('<%s>%.4f</%s>' % (a, b, a) for a, b in zip(n, v))
MAT = {'plastic': 256, 'smooth': 272, 'neon': 288, 'metal': 1088, 'diamond': 1056, 'glass': 1568, 'fabric': 1312, 'foil': 1040}
S = lambda n, v: '<string name="%s">%s</string>' % (n, escape(v))
B = lambda n, v: '<bool name="%s">%s</bool>' % (n, 'true' if v else 'false')
F = lambda n, v: '<float name="%s">%g</float>' % (n, v)
I = lambda n, v: '<int name="%s">%d</int>' % (n, v)
T = lambda n, v: '<token name="%s">%d</token>' % (n, v)
C3 = lambda n, h: '<Color3 name="%s"><R>%.4f</R><G>%.4f</G><B>%.4f</B></Color3>' % (n, (h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255)
CT = lambda n, u: '<Content name="%s"><url>%s</url></Content>' % (n, escape(u)) if u else '<Content name="%s"><null></null></Content>' % n
U2 = lambda n, xs, xo, ys, yo: '<UDim2 name="%s"><XS>%g</XS><XO>%d</XO><YS>%g</YS><YO>%d</YO></UDim2>' % (n, xs, xo, ys, yo)
def item(cls, props, children=()):
    return '<Item class="%s" referent="%s"><Properties>%s</Properties>%s</Item>' % (cls, R(), ''.join(props), ''.join(children))
def part(name, pos, size, color, mat='smooth', shape=1, rot=(0, 0, 0), children=(), transp=0.0, cls='Part', collide=None, anchored=True):
    p = [S('Name', name), B('Anchored', anchored), '<CoordinateFrame name="CFrame">%s</CoordinateFrame>' % cf(*pos, *rot),
         '<Vector3 name="size"><X>%.3f</X><Y>%.3f</Y><Z>%.3f</Z></Vector3>' % tuple(size), '<Color3uint8 name="Color3uint8">%d</Color3uint8>' % (0xFF000000 | color),
         T('Material', MAT[mat]), F('Transparency', transp), B('CastShadow', mat != 'neon'), B('CanCollide', (transp < .5) if collide is None else collide)]
    if cls == 'Part': p.append(T('shape', shape))
    return item(cls, p, children)
def model(name, children): return item('Model', [S('Name', name)], children)
def folder(name, children=()): return item('Folder', [S('Name', name)], children)
def spot(bright=5, rng=60, ang=35, color=0xffffff, face=4, name='Haz'): return item('SpotLight', [S('Name', name), F('Brightness', bright), F('Range', rng), F('Angle', ang), C3('Color', color), T('Face', face), B('Shadows', False), B('Enabled', True)])
def point(bright=2, rng=20, color=0xffffff): return item('PointLight', [S('Name', 'Luz'), F('Brightness', bright), F('Range', rng), C3('Color', color), B('Enabled', True)])
def decal(name, face=5, tex=''): return item('Decal', [S('Name', name), CT('Texture', tex), T('Face', face)])
def click(dist=24): return item('ClickDetector', [S('Name', 'Clic'), F('MaxActivationDistance', dist)])
def surface(name, face, labels, ppst=40):
    return item('SurfaceGui', [S('Name', name), T('Face', face), F('PixelsPerStud', ppst), T('SizingMode', 1), F('LightInfluence', 0), B('AlwaysOnTop', False)], labels)
def label(name, text, pos, size, color=0xFFFFFF, bg=None, font=3, scaled=True, children=()):
    p = [S('Name', name), S('Text', text), B('TextScaled', scaled), C3('TextColor3', color), F('BackgroundTransparency', 1 if bg is None else 0), T('Font', font), U2('Position', pos[0], 0, pos[1], 0), U2('Size', size[0], 0, size[1], 0)]
    if bg is not None: p.append(C3('BackgroundColor3', bg))
    return item('TextLabel', p, children)
def image(name, pos, size, tex=''): return item('ImageLabel', [S('Name', name), CT('Image', tex), F('BackgroundTransparency', 1), U2('Position', pos[0], 0, pos[1], 0), U2('Size', size[0], 0, size[1], 0)])
def script(cls, name, src): return item(cls, [S('Name', name), '<ProtectedString name="Source"><![CDATA[%s]]></ProtectedString>' % src.replace(']]>', ']] >')])
def sound(name, sid='', vol=0.6, loop=False): return item('Sound', [S('Name', name), CT('SoundId', sid), F('Volume', vol), B('Looped', loop)])
def remote(name): return item('RemoteEvent', [S('Name', name)])
def screengui(name, children): return item('ScreenGui', [S('Name', name), B('ResetOnSpawn', False), B('IgnoreGuiInset', True), T('ZIndexBehavior', 1)], children)
def spawn(pos, size=(8, 1, 8)): return item('SpawnLocation', [S('Name', 'Entrada'), B('Anchored', True), '<CoordinateFrame name="CFrame">%s</CoordinateFrame>' % cf(*pos), '<Vector3 name="size"><X>%g</X><Y>%g</Y><Z>%g</Z></Vector3>' % size, F('Transparency', 1), B('CanCollide', True), I('Duration', 0), B('Neutral', True)])
def lighting(amb=0x101018, bright=0.3, extra=()):
    return item('Lighting', [S('Name', 'Lighting'), C3('Ambient', amb), C3('OutdoorAmbient', 0x080810), F('Brightness', bright), F('ClockTime', 0), F('GlobalShadows', 1) if False else B('GlobalShadows', True), F('ExposureCompensation', 0.2), C3('FogColor', 0x020208), F('FogEnd', 2000)],
        [item('BloomEffect', [S('Name', 'Brillo'), F('Intensity', 1), F('Size', 24), F('Threshold', 0.85), B('Enabled', True)])] + list(extra))
def importa(path, nombre=None):
    # Extrae el primer Model del Workspace de otro .rbxlx (renumerando referentes)
    x = open(path, encoding='utf-8').read(); i = x.index('<Item class="Model"'); depth = 0; j = i
    for m in re.finditer(r'<Item |</Item>', x[i:]):
        depth += 1 if m.group(0) == '<Item ' else -1
        if depth == 0: j = i + m.end(); break
    s = re.sub(r'referent="[^"]*"', lambda _: 'referent="%s"' % R(), x[i:j])
    if nombre: s = s.replace('<string name="Name">', '<string name="Name">', 1)
    return s
def lugar(workspace_children, others):
    ws = item('Workspace', [S('Name', 'Workspace'), F('Gravity', 196.2)], workspace_children)
    return ('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">'
            '<Meta name="ExplicitAutoJoints">true</Meta>' + ws + ''.join(others) + '</roblox>')
def modulo_tabla(nombre, campos, cabecera):
    # campos: [(clave, valor, comentario)] -> ModuleScript con campos etiquetados en español
    l = ['-- ' + c for c in cabecera.split('\n')] + ['return {']
    for k, v, com in campos: l.append('\t%s = "%s", -- %s' % (k, v, com))
    l.append('}'); return script('ModuleScript', nombre, '\n'.join(l))
def lua_str(s): return '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '"'
