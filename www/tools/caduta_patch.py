# Adapta los fuentes (copiados de Acerte ou Caia) a Caduta Libera. Idempotente: python3 tools/caduta_patch.py
import re, os, glob
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/src/'
HIST = '''Ri = [{ id: "origen", titulo: "El origen", emoji: "🌍", narr: ["¡Buenas noches! Bienvenidos a la historia de Caduta Libera. Empecemos por el principio.", "El formato nació en Israel con el nombre «La'uf al HaMillion», creado por Armoza Formats; en inglés se conoce como «Still Standing».", "Desde allí viajó por medio mundo: en España se llamó Ahora Caigo y en Italia, Caduta Libera."], card: { k: "text", items: [["Formato original", "La'uf al HaMillion · Israel (Armoza Formats)"], ["En España", "Ahora Caigo (Antena 3)"], ["En Italia", "Caduta Libera (Canale 5, desde 2015)"]] }, cam: (a) => a.eng.startOrbit(Ft(0, 0, 0), 11.5, 6.2, 0.4, 0.05, 1), luces: "intro" }, { id: "estreno", titulo: "El estreno", emoji: "📺", narr: ["Caduta Libera se estrenó en Canale 5 el 4 de mayo de 2015, en la franja de antes del telediario.", "La primera temporada se grabó en los estudios de Antena 3 en Barcelona, el mismo plató redondo de la versión española; desde 2016 se graba en Cologno Monzese, cerca de Milán.", "Lo presentó Gerry Scotti de 2015 a 2025; desde diciembre de 2025 lo presenta Max Giusti."], card: { k: "timeline", items: [["4 mayo 2015", "Estreno en Canale 5"], ["2016", "El programa se muda a Cologno Monzese"], ["4 oct 2022", "Programa número 1000"], ["dic 2025", "Nuevo presentador"]] }, cam: l0 }, { id: "pruebas", titulo: "Las reglas", emoji: "🧩", narr: ["Once concursantes: un campeón en la trampilla central y diez rivales a su alrededor.", "El campeón elige rival y se enfrentan con definiciones en las que ya se ven algunas letras de la respuesta. Si no la sabe, puede pasar la pregunta usando una vida.", "Quien se queda sin tiempo cae por la trampilla. Con los años se añadieron juegos especiales como Parole al buio o Parole mimetizzate."], card: { k: "tiles", items: [["🔤", "Definiciones", "Algunas letras ya están a la vista"], ["⏱", "30 segundos", "Para responder en cada turno"], ["❤️", "Vidas", "Pasa la pregunta al rival"], ["🕳", "La trampilla", "Si se acaba el tiempo, caes"], ["🎲", "Juegos especiales", "Desde la quinta edición"], ["🏁", "Juego final", "Para llevarse el bote"]] }, cam: (a) => a.eng.startOrbit(Ft(0, 0, 0), 11.5, 6.2, 0.4, 0.05, 1) }, { id: "moneda", titulo: "El bote", emoji: "💰", narr: ["Cada vez que el campeón tira a un rival, elige entre el pie blanco y el pie negro y descubre una cifra, una vida extra o una sorpresa.", "El bote máximo ha cambiado con las temporadas: cien mil, trescientos mil y hasta quinientos mil euros.", "El gran campeón de la historia del programa, Nicolò Scalfi, ganó en total 838.000 euros en 88 programas."], card: { k: "stats", items: [["11", "concursantes por programa"], ["10", "rivales que tirar"], ["500.000 €", "bote máximo"], ["838.000 €", "récord de Nicolò Scalfi"], ["1000+", "programas emitidos"]] }, cam: l0, luces: "final" }, { id: "vuelta", titulo: "¡A jugar!", emoji: "✨", narr: ["¡Y ahora te toca a ti!", "Gracias por ver la historia de Caduta Libera."], card: { k: "end", big: "¡A jugar!", text: "Juego de fans privado, sin afiliación con la cadena ni la productora.", fuente: "Fuente: Wikipedia en italiano, artículo «Caduta libera (programma televisivo)» (CC BY-SA 4.0), resumido con nuestras palabras." }, cam: l0, luces: "intro" }], UA'''
def sub(s):
    s = re.sub(r'Ri = \[\{ id: "origen".*?\}, cam: l0, luces: "intro" \}\], UA', lambda m: HIST, s, flags=re.S)
    for a, b in [('#AcerteOuCaia', '#AhoraCaigo'), ('¡Acerte ou Caia!', '¡Ahora caigo!'), ('Acerte ou Caia!', '¡Ahora caigo!'), ('Acerte ou Caia', 'Ahora caigo'),
                 ('(Record TV, Brasil)', '(Antena 3, España · Canale 5, Italia)'), ('Basado en el minijuego de Scratch', 'Basado en la app oficial de Caduta Libera (2016)'),
                 ('ei("Clásico", "El juego original de la app de Caduta Libera"', 'ei("Clásico · app móvil", "Las pantallas 2D de la app original de Caduta Libera"'), ('clasico/index.html', 'clasico_cl/index.html'), ('Del minijuego de Scratch original', 'De la app oficial de Caduta Libera'), ('solo las del Scratch', 'solo las clásicas'), ('El minijuego de Scratch', 'La app oficial de Caduta Libera (2016)'), ('El minijuego original de Scratch', 'El juego original de la app de Caduta Libera'), ('Rafa Brito', 'Marco Vitale'), ('Seu Ernesto', 'Don Ernesto'),
                 ('trescientos mil reales', 'quinientos mil euros'), ('millón de reales', 'millón de euros'), ('Cien mil reales', 'Cien mil euros'),
                 ('" reais" : " reales"', '" euro" : " euros"'), ('"$1 reales"', '"$1 euros"'), ('Acêrrte ôu Cáia', 'Caduta Libera'),
                 ("piper_pt/", "piper_it/"), ("__LANG === 'pt'", "__LANG === 'it'"), ('__LANG === "pt"', '__LANG === "it"'),
                 ("'FIM DE JOGO'", "'FINE DEL GIOCO'"), ('«Acierta o cae»', '«Ahora caigo»')]:
        s = s.replace(a, b)
    s = re.sub(r'\bRafa\b', 'Marco', s)
    s = re.sub(r'R\$ ?\$\{([^}]*)\}', r'${\1} €', s)
    s = re.sub(r"'R\$ ' \+ (String\([^;]*?\.replace\([^)]*\)\))", r"\1 + ' €'", s)
    s = re.sub(r'R\$ ?([\d.]+)', r'\1 €', s)
    return s
for f in glob.glob(D + '*.js'):
    s = open(f).read(); n = sub(s)
    if os.path.basename(f) == 'bancos_acerte.js': n = n.replace("const __ACPT = (window.__LANG === 'it');", "const __ACPT = false;")
    if os.path.basename(f) == 'preguntas_extra.js': n = n.replace("const PREGUNTAS_EXTRA = (window.__LANG === 'it') ? PREGUNTAS_PT : PREGUNTAS_ES;", "const PREGUNTAS_EXTRA = PREGUNTAS_ES;")
    if os.path.basename(f) == 'etapas_datos.js':
        n = re.sub(r"  '2021': \{.*?\n  \},", """  '2021': {                     // CADUTA LIBERA: mecánica de Ahora Caigo (Antena 3, 2011-2021) con 10 rivales y el juego final de siempre
    duelos: 10,                 // hay que tirar a los 10 rivales (antes 8)
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true,
    moneda: 'fija',             // cada trampilla esconde una cifra, como en Antena 3
    plantarse: false,           // la decisión llega tras los 10 duelos
    final: 'duelo10',           // juego final sin cambios: 10 preguntas en 2 minutos
    comodines: 2, relevo: true, dobladora: true,
    cifras: [20000, 15000, 15000, 10000, 10000, 10000, 7000, 5000, 5000, 3000],   // cifras de la app de Caduta Libera
  },""", n, flags=re.S)
    if n != s: open(f, 'w').write(n); print('ok', os.path.basename(f))
