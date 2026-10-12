import os
from rbxlib import *
LUA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lua')
def lua(n): return open(os.path.join(LUA, n), encoding='utf-8').read()
def imagenes(campos):
    return modulo_tabla('Imagenes', campos, 'IMÁGENES DEL JUEGO · cambia aquí cada imagen.\nSube la imagen en Studio (Ver > Administrador de recursos > Importar, o Toolbox > Mis imágenes),\ncopia su ID y pégalo como "rbxassetid://NÚMERO". "rbxassetid://0" = sin imagen (se usa el dibujo/texto por defecto).\nCada campo se aplica a todos los Decal / ImageLabel que tengan ese mismo nombre.')
def sonidos(campos):
    return modulo_tabla('Sonidos', campos, 'SONIDOS DEL JUEGO · cambia aquí cada sonido.\nSube el audio en Studio (Ver > Administrador de recursos > Importar, o Creator Hub > Audio),\ncopia su ID y pégalo como "rbxassetid://NÚMERO". "rbxassetid://0" = en silencio.\nCada campo se aplica al Sound de SoundService con ese mismo nombre.')
def montar(salida, ws_children, imagenes_mod, sonidos_mod, campos_son, preguntas_src, cliente, servidor, remotos, amb=0x0C0C14, extra_rs=()):
    rs = item('ReplicatedStorage', [S('Name', 'ReplicatedStorage')], [script('ModuleScript', 'UI', lua('UI.lua')), script('ModuleScript', 'Camaras', lua('Camaras.lua')), imagenes_mod, sonidos_mod,
        script('ModuleScript', 'Preguntas', preguntas_src), folder('Eventos', [remote(r) for r in remotos])] + list(extra_rs))
    sss = item('ServerScriptService', [S('Name', 'ServerScriptService')], [script('Script', 'Recursos', lua('Recursos.lua')), script('Script', 'Juego', servidor)])
    sg = item('StarterGui', [S('Name', 'StarterGui')], [screengui('Interfaz', [script('LocalScript', 'Cliente', cliente)])])
    snd = item('SoundService', [S('Name', 'SoundService')], [sound(k, '', .5 if k.startswith('Musica') else .7, k.startswith('Musica')) for k, _, _ in campos_son])
    xml = lugar(ws_children, [lighting(amb, .25), rs, sss, sg, snd, item('StarterPlayer', [S('Name', 'StarterPlayer')]), item('Players', [S('Name', 'Players')])])
    open(salida, 'w', encoding='utf-8').write(xml)
    import xml.etree.ElementTree as E; E.parse(salida)
    print(salida, round(len(xml) / 1e6, 2), 'MB', xml.count('<Item '), 'objetos')
LEEME = '''CÓMO CAMBIAR IMÁGENES Y SONIDOS (Roblox Studio)
================================================
1. Abre el archivo .rbxlx con Roblox Studio (Archivo > Abrir desde archivo).
2. Imágenes: en la pestaña «Ver» abre el «Administrador de recursos» (Asset Manager) y pulsa «Importar»
   (o usa Toolbox > Inventario > Mis imágenes). Al subirla, haz clic derecho > «Copiar ID del recurso».
3. En el Explorador abre ReplicatedStorage > Imagenes y pega el ID en el campo que quieras, así:
       Logo = "rbxassetid://1234567890",
   Cada campo cambia a la vez todos los Decal/ImageLabel que se llaman igual (por ejemplo, todas las pantallas con el logo).
4. Sonidos: igual. Importa el audio (.mp3/.ogg, hasta 7 minutos) en el Administrador de recursos, copia su ID
   y pégalo en ReplicatedStorage > Sonidos (por ejemplo  Acierto = "rbxassetid://1234567890",).
   El script ServerScriptService > Recursos los coloca en los Sound de SoundService al empezar.
5. "rbxassetid://0" significa «sin imagen» (se ve el texto o dibujo por defecto) o «en silencio».
6. Pulsa «Jugar» (F5) para probar. Las preguntas están en ReplicatedStorage > Preguntas: puedes añadir más líneas.
'''
