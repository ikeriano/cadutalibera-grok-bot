// ===================================================================================================
// v1.14 · TONI, EL REGIDOR, HABLA DURANTE TODO EL «PROGRAMA COMPLETO»: cuenta atrás para entrar en
// directo, «¡silencio en plató!», pide aplausos, da paso a Marco, avisa de la publicidad y bromea con el
// equipo. Aparece junto a la cámara 1 (o habla como copresentador si hoy el sorpresa es él).
// Voz Piper pregenerada (carlfm, la misma de Toni en las escenas) -> voz/st/<fnv('carlfm|'+texto)>.mp3
// Opciones › «Toni, el regidor, habla» (Sí/No). Forzar en pruebas: window.__regidorForce = true | false.
// ===================================================================================================
const regidorOn = () => { try { return localStorage.getItem('ac_regidor') !== '0'; } catch (e) { return true; } };
const REGIDOR_LINEAS = {
  aire: [
    '¡Atención, plató! Entramos en directo en cinco, cuatro, tres... —y los dos últimos con los dedos—.',
    '¡Silencio, que vamos al aire! Treinta segundos. Marco, la corbata, que la llevas torcida.',
    '¡A sus puestos! Directo en diez segundos. Público, sonrisas; cámaras, quietas; Marco, respira.',
    'Lola dice que entramos ya. ¡Cinco, cuatro, tres...! ¡Dentro!',
  ],
  aplausos: [
    '¡Y ahora todos: aplausos! ¡Más fuerte, que en casa no se os oye!',
    '¡Aplauso grande! Venga, que el de la tercera fila está aplaudiendo con un solo dedo.',
    '¡Arriba esas palmas! Que hoy hemos venido a pasarlo bien.',
  ],
  silencio: [
    '¡Silencio en plató! Que empieza el duelo.',
    'Shhh... ¡silencio! Que el concursante necesita concentrarse.',
    '¡Silencio, por favor! Rober, baja la música, que no oigo ni mis pensamientos.',
    'Ojo, plató: empieza otro duelo. Calladitos todos, que esto se pone serio.',
    'Marco, cuando quieras: tienes plató. ¡Silencio!',
  ],
  caida: [
    '¡Aplausos para nuestro rival, que ha caído con mucha dignidad!',
    '¡Uy, qué caída! Tranquilos, que el colchón lo revisamos esta mañana. Creo.',
    '¡Otro al foso! Nuria, prepara el peine, que ese sale despeinado.',
    '¡Aplausos! Que caer en ¡Ahora caigo! también tiene su mérito.',
  ],
  pub: [
    '¡Nos vamos a publicidad en diez segundos! Marco, despídete, que no llegamos.',
    'Ojo, que nos vamos a pausa. ¡Corremos a por un café y volvemos!',
  ],
  vuelta: [
    '¡Volvemos del corte en cinco, cuatro, tres...! ¡Aplausos!',
    '¡Atentos, que volvemos! Señora de la primera fila, ese bocadillo, guárdelo.',
  ],
  entre: [
    'Rober, ¿ese micro de Marco va bien? Es que ha sonado como un pato.',
    'Lola me dice por el pinganillo que vamos muy bien de tiempo. Eso no ha pasado nunca.',
    'Público, ¡sin flash, por favor! Que Marco se queda ciego y luego pisa la trampilla equivocada.',
    'Marco, te queda un minuto para el siguiente duelo. Y una pelusa en la chaqueta.',
    'Rober dice que el foco siete parpadea. Yo digo que está emocionado.',
  ],
  decision: [
    '¡Silencio absoluto! Que esta decisión vale mucho dinero.',
    'Que nadie respire. Bueno, respirad un poco, pero sin hacer ruido.',
  ],
  final: [
    '¡Llegamos al juego final! Luces doradas, Rober. ¡Y silencio en plató!',
    'Último esfuerzo, equipo. Dos minutos de silencio total... ¡y que no se caiga nadie más!',
  ],
  fin: [
    '¡Y estamos fuera! ¡Buen programa, equipo! Mañana, a la misma hora.',
    '¡Corten! ¡Fuera del aire! Aplausos para todos, que os lo habéis ganado.',
  ],
};
const REGIDOR = { fig: null };
const regLinea = (k, vars = {}) => { const L = REGIDOR_LINEAS[k]; const t = L[Math.floor(Math.random() * L.length)]; return t.replace(/\{(\w+)\}/g, (m, v) => vars[v] ?? m); };
function regidorFig(c) {
  if (typeof COPRO !== 'undefined' && COPRO.fig && COPRO.g && COPRO.g.id === 'toni') return COPRO.fig;
  if (REGIDOR.fig) return REGIDOR.fig;
  const { eng: e } = c;
  const fig = Rm({ shirt: 0x1a1a1a }); e.scene.add(fig.root); fig.root.position.set(-4.4, 0, 11.2);
  try { e.face(fig, e.host.root.position); } catch (x) { }
  REGIDOR.fig = fig; return fig;
}
async function regidorMomento(c, clave, vars = {}, prob = 1) {
  if (window.__regidorForce === false || (!window.__regidorForce && !regidorOn())) return;
  if (!window.__regidorForce && Math.random() > prob) return;
  const { hud: i, s } = c; const txt = regLinea(clave, vars); mec('regidor ' + clave);
  try {
    const fig = regidorFig(c); try { He(fig, clave === 'aplausos' || clave === 'caida' ? 'aplaude' : 'senala', 2); } catch (x) { }
    i.say(txt, 1e5, fig.head, 'Toni · regidor', { voice: false });
    try { await stHabla('carlfm', txt, s); } finally { i.hideBubble(); }
    await s.w(200);
  } catch (x) { if (x === _o) throw x; console.warn('regidor', clave, x); }
}
function regidorQuita() { try { REGIDOR.fig && Xe.scene.remove(REGIDOR.fig.root); } catch (x) { } REGIDOR.fig = null; }
function filaRegidor() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowRegidor';
  const lb = document.createElement('label'); lb.textContent = '🎬 Toni, el regidor, habla en el programa'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((regidorOn() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_regidor', v); row.querySelectorAll('.tbtn').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
  return row;
}
window.__regidor = { lineas: REGIDOR_LINEAS };
// escenas nuevas de Fuera de cámaras protagonizadas por Toni
EX_DATOS.fuera.push(
 { id: 'toni-cuenta', titulo: 'Toni y la cuenta atrás', lugar: 'plato', pasos: [
  ['reg', '¡Atención! Ensayo de la cuenta atrás. Cinco, cuatro, tres...', 'wide', '', ''],
  ['adrian', 'Toni, ¿por qué los dos últimos los haces con los dedos?', 'host', 'encoge', ''],
  ['reg', 'Porque si digo «dos, uno» en voz alta se oye en directo. Y porque queda muy profesional.', 'wide', '', 'risas'],
  ['tec', 'Toni, el otro día contaste con los dedos y nos enseñaste seis.', 'wide', '', 'risas'],
  ['reg', 'Eso fue un directo especial. Con propina.', 'wide', '', ''],
  ['adrian', 'Pues hoy cuenta despacito, que yo todavía me estoy atando los zapatos.', 'host', 'aplaude', '']]},
 { id: 'toni-carteles', titulo: 'Los carteles de Toni', lugar: 'plato', pasos: [
  ['reg', 'Os presento mis carteles nuevos: «APLAUSOS», «RISAS» y «SILENCIO».', 'wide', '', ''],
  ['adrian', '¿Y ese otro que pone «OOOH»?', 'host', 'senala', ''],
  ['reg', 'Es para cuando cae alguien. El público lo lee y suspira. Funciona siempre.', 'wide', '', 'ooh'],
  ['dir', 'Toni, el de «SILENCIO» está al revés.', 'wide', '', 'risas'],
  ['reg', 'Por eso nadie se callaba ayer. ¡Misterio resuelto!', 'wide', '', 'risas']]},
 { id: 'toni-pausa', titulo: 'Toni en la pausa de publicidad', lugar: 'plato', pasos: [
  ['reg', '¡Estamos en pausa! Tres minutos. Nuria, retoque a Marco. Rober, agua para el público.', 'wide', '', ''],
  ['maq', 'Marco, no te muevas, que te quito el brillo de la frente.', 'host', '', ''],
  ['adrian', 'Toni, ¿cómo lo llevamos?', 'host', 'habla', ''],
  ['reg', 'Muy bien. Quedan dos minutos y medio, siete concursantes y un bocadillo de tortilla en mi camerino.', 'wide', '', 'risas'],
  ['reg', '¡Treinta segundos! ¡Todos a sus puestos! ¡Volvemos en cinco, cuatro, tres...!', 'wide', '', '']]},
 { id: 'toni-pinganillo', titulo: 'El pinganillo de Toni', lugar: 'plato', pasos: [
  ['reg', 'Lola, ¿me oyes? Cambio. Lola, cambio. ¿Lola?', 'wide', '', ''],
  ['dir', 'Toni, estoy a tu lado. No hace falta el pinganillo.', 'wide', '', 'risas'],
  ['reg', 'Ya, pero así parece más importante. Cambio y corto.', 'wide', '', 'risas'],
  ['adrian', 'Toni, ¿y a mí me dices algo por el pinganillo durante el programa?', 'host', 'encoge', ''],
  ['reg', 'Solo «sonríe», «más rápido» y «la trampilla cuatro no». Lo justo.', 'wide', '', 'risas']]}
);
