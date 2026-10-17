// común a los juegos de la familia «Ahora Caigo» (menú #menu, filas .orow con botones .tbtn)
window.__maFamAC = function (o) {
  return Object.assign({
    anclar: function () { var m = document.getElementById('menu'); if (!m) return null; var h = [].find.call(m.querySelectorAll('h2'), function (x) { return /^\s*(Opciones|Opções|Opzioni)\s*$/.test(x.textContent); }); return h ? h.parentElement : null; },
    insertar: function (a, fila) { var h = [].find.call(a.querySelectorAll('h2'), function (x) { return /Opciones|Opções|Opzioni/.test(x.textContent); }); if (h && h.nextSibling) a.insertBefore(fila, h.nextSibling); else a.appendChild(fila); },
    crearBoton: function (txt, abrir) { var r = document.createElement('div'); r.className = 'orow'; var l = document.createElement('label'); l.textContent = '🎤 Mis audios (pon tus propios audios a los personajes)'; var b = document.createElement('button'); b.className = 'tbtn sel maBoton'; b.textContent = txt; b.onclick = function (ev) { ev.stopPropagation(); ev.preventDefault(); abrir(); }; r.append(l, b); return r; },
    etiqueta: function (n) { return n ? 'Abrir (' + n + ' momentos)' : 'Abrir'; }
  }, o);
};
// momentos estándar de un programa tipo «Ahora Caigo» (frases del presentador en español, portugués e italiano + efectos)
window.__maFamACstd = function (juego, titulo, extra) {
  return window.__maFamAC(Object.assign({
    juego: juego, titulo: titulo,
    personajes: [
      { id: 'pres', nombre: '🎙️ Presentador', momentos: [['saludo', '👋 Saludo (al empezar)'], ['acierto', '✅ Acierto'], ['fallo', '❌ Fallo / se acaba el tiempo'], ['victoria', '🏆 Victoria'], ['derrota', '😢 Derrota'], ['despedida', '👋 Despedida']] },
      { id: 'rival', nombre: '🕳️ Oponentes', momentos: [['caida', '🕳️ Cae por la trampilla']] }
    ],
    texto: [
      [/^¡?(Correcto|Muy bien|Lo has clavado|Correto|Muito bem|Você o cravou|Giusto|Va bene|L'hai inchiodato)!?$/i, 'acierto'],
      [/Se acabó el tiempo|¡Oh, no! ¡Tiempo|Acabou o tempo|Oh, não! Tempo|Il tempo è scaduto|Oh, no! Tempo/i, 'fallo'],
      [/Concursante, sube a la trampilla|Ponte en el centro del plató|Concorrente, suba|Coloque-se no centro|Concorrente, sali alla botola|Mettiti al centro del set|Bienvenido al plató|Bem-vindo ao platô|Benvenuto sul set|y bienvenidos a|e bem-vindos a|e benvenuti a/i, 'saludo'],
      [/Has ganado|Has completado el Desafío|Você ganhou|Você completou|Hai vinto|Hai completato/i, 'victoria'],
      [/ha ganado el oponente|ganhou o adversário|ha vinto l.avversario|Qué mala suerte|Que azar|Che sfortuna/i, 'derrota'],
      [/nos despedimos|hasta la próxima|até a próxima|até logo|alla prossima|ci salutiamo/i, 'despedida']
    ],
    sfx: [[/Queda|^DropM/, 'caida'], [/^Erro$/, 'fallo']]
  }, extra || {}));
};
window.MIS_AUDIOS_CFG = window.__maFamACstd('caduta', 'Caduta Libera');
