# Caduta Libera · El juego 3D · versión COMPLETA (privada)
Juego de fans creado por Iker para un amigo. Misma app que su «¡Ahora Caigo! 3D» (interfaz, menús, Opciones y extras),
adaptada al formato italiano Caduta Libera con los gráficos, sonidos, logo y pantallas de la app oficial de Mediaset (2016).
**Uso privado: no hacer público.**

- **Idioma**: Opciones › «🌐 Lingua / Idioma» — Italiano (por defecto) o Español. Carga `js/app_it.js` o `js/app.js`.
- **Logo**: Opciones › «🖼 Logo» — Automático (Caduta Libera en italiano, Ahora Caigo en español), Siempre Caduta Libera o Siempre Ahora Caigo.
- **Dos modos desde el menú principal**: Jugar › Programa completo (plató 3D three.js, 10 rivales en sus trampillas,
  mecánica de Ahora Caigo de Antena 3 2011-2021 con 10 duelos y el juego final de siempre) y «Clásico · app móvil»
  (`clasico_cl/`: port HTML5 de las pantallas 2D de la app original: tablero, duelo, caída, perfil local).
- **Voces**: Piper sin conexión. Italiano: it_IT-paola-medium (`piper_it/`). Español: es_ES-davefx-medium (`piper/`) + voces medium/high.
- **Construir**: `python3 tools/caduta_patch.py && bash tools/build.sh` (español) y
  `node tools/extraer_textos.mjs && python tools/traducir_it.py && node tools/aplicar_it.mjs` (italiano).
- **Extracción del APK**: `resource.car` (Corona) → Lua 5.1 compilado → unluac → hojas de sprites recortadas con sus
  posiciones originales (`clasico_cl/layout.js`). Las preguntas de la app venían de un servidor ya cerrado, así que el
  clásico usa un banco bilingüe propio (`clasico_cl/domande.js`).
- **Empaquetar**: `bash tools/empaquetar_caduta.sh` (APK, repo privado y web pública sin recursos de Mediaset).
