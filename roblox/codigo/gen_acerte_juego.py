import re, sys
sys.path.insert(0, '/workspace/caduta/roblox_src'); sys.path.insert(1, '/workspace/rbx')
from comun import *
import set_acerte as set_ac
src = open('/workspace/acerte/www/src/preguntas_extra.js', encoding='utf-8').read().split('const PREGUNTAS_PT')[0]
pares = sorted(set(re.findall(r'"([^"|]{8,250})\|([^"]{2,60})"', src)))
pares = [(q, a) for q, a in pares if '[' in a]
pre = '-- Banco de preguntas de Caduta Libera / ¡Ahora caigo! («pregunta», «RES[P]UES[T]A»: entre corchetes, las letras que faltan)\nreturn {\n' + ''.join('\t{ %s, %s },\n' % (lua_str(q), lua_str(a)) for q, a in pares) + '}\n'
img = [('LogoMenu', 'rbxassetid://0', 'Logo grande del menú principal (PNG con transparencia)'), ('Logo', 'rbxassetid://0', 'Logo de las pantallas laterales del plató'),
       ('FondoPantalla', 'rbxassetid://0', 'Fondo (espiral) de la pantalla grande del fondo'), ('PuertaLogo', 'rbxassetid://0', 'Puerta azul del backstage con el logo y la espiral'),
       ('Huellas', 'rbxassetid://0', 'Huellas amarillas pintadas en cada trampilla')]
son = [('MusicaMenu', 'rbxassetid://0', 'Música del menú (en bucle)'), ('MusicaDuelo', 'rbxassetid://0', 'Música de fondo del duelo (en bucle)'), ('MusicaFinal', 'rbxassetid://0', 'Música del juego final (en bucle)'),
       ('Cabecera', 'rbxassetid://0', 'Sintonía de entrada del programa'), ('Acierto', 'rbxassetid://0', 'Respuesta correcta'), ('Fallo', 'rbxassetid://0', 'Respuesta incorrecta'),
       ('Paso', 'rbxassetid://0', 'Cuando alguien dice «Paso»'), ('Tic', 'rbxassetid://0', 'Tic de los últimos 5 segundos'), ('Reloj', 'rbxassetid://0', 'Fin del tiempo (bocina)'),
       ('Trampilla', 'rbxassetid://0', 'Se abre una trampilla'), ('Caida', 'rbxassetid://0', 'Grito / golpe de la caída'), ('Fanfarria', 'rbxassetid://0', 'Duelo ganado / premio'), ('Tecla', 'rbxassetid://0', 'Pulsar un botón del menú')]
plato, cams = set_ac.plato_ac()
montar('/workspace/caduta/roblox/CadutaLibera-AhoraCaigo-Juego.rbxlx', [plato, cams, spawn((0, 1, set_ac.A + 22))], imagenes(img), sonidos(son), son, pre,
       lua('AC_Cliente.lua'), lua('AC_Servidor.lua'), ['Sonido', 'Rivales', 'Colocar', 'Abrir', 'Cerrar', 'Pantalla', 'Marcador', 'Caer'], 0x0A1030)
# solo el plató (sin scripts)
x = lugar([plato, cams, spawn((0, 1, set_ac.A + 22))], [lighting(0x101018, .25), item('SoundService', [S('Name', 'SoundService')]), item('StarterPlayer', [S('Name', 'StarterPlayer')])])
open('/workspace/caduta/roblox/CadutaLibera-AhoraCaigo-Plato.rbxlx', 'w', encoding='utf-8').write(x); import xml.etree.ElementTree as E; E.parse('/workspace/caduta/roblox/CadutaLibera-AhoraCaigo-Plato.rbxlx'); print('plato ok', len(pares), 'preguntas')
for f in ('/workspace/caduta/roblox/CadutaLibera-AhoraCaigo-Juego.rbxlx', '/workspace/caduta/roblox/CadutaLibera-AhoraCaigo-Plato.rbxlx'):
    t = open(f, encoding='utf-8').read()
    for a, b in (('Adrián Vega', 'Marco Vitale'), ('Adrián', 'Marco')):
        t = t.replace(a, b)
    open(f, 'w', encoding='utf-8').write(t); E.parse(f)
print('marca ok')
