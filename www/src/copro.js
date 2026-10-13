// ===================================================================================================
// v1.13 · PRESENTADOR SORPRESA: al empezar el «Programa completo» aparece un copresentador elegido al azar
// entre personajes que YA existen en el juego (equipo del plató y público de EX_DATOS) y acompaña a
// Marco Vitale TODO el programa: presentación, cada duelo, cada caída, la moneda, la decisión, el juego
// final y la despedida. Voces Piper pregeneradas si existen (voz/st); si no, bocadillo con su nombre.
// Opciones › «Presentador sorpresa» (Sí/No). Forzar en pruebas: window.__coproForce = 'toni' | false.
// ===================================================================================================
const coproOn = () => { try { return localStorage.getItem('ac_copro') !== '0'; } catch (e) { return true; } };
const COPRO_DATOS = [
  { id: 'toni', quien: 'reg', nombre: 'Toni · regidor', voz: 'carlfm', shirt: 0x1a1a1a,
    adrian: '¡Sorpresa! Hoy no presento solo: desde detrás de las cámaras... ¡nuestro regidor, Toni!',
    intro: ['¡Hola a todos! Normalmente soy el que os pide aplausos con un cartel. Hoy los pido con la boca.', 'Marco, tú pregunta, que yo controlo las trampillas con la mirada.'],
    duelo: ['¡Atención, que vamos con el duelo número {n}! ¡Todo el mundo en silencio!', '{rival}, sube los hombros, mira a la cámara y... ¡a por todas!', 'Este duelo lo he ensayado yo antes. Bueno, sin concursantes. Pero sale genial.'],
    caida: ['¡Lo sabía! Esa trampilla tenía ganas de abrirse desde por la mañana.', '¡Fiuuu! ¡Otro para los colchones! ¡Aplausos!', 'Apunto la caída en mi carpeta. Ya llevamos {n}.'],
    moneda: ['¡La moneda! Yo la he pulido esta mañana. Brilla más que la calva del técnico.', 'Cara, cruz... ¡o canto! Bueno, de canto no ha caído nunca. Todavía.'],
    decision: ['Yo no digo nada, pero mi abuela siempre decía: «más vale pájaro en mano».', '¡Piénsalo bien, que esto no tiene toma dos!'],
    final: ['¡Llegamos al juego final! Dos minutos y diez preguntas. ¡Silencio absoluto en la grada!', '¡Que se oiga hasta el reloj! ¡Vamos, que tú puedes!'],
    gana: ['¡Enhorabuena! Esto hay que celebrarlo: ¡aplausos sin cartel!'], pierde: ['¡Qué pena! Pero has caído con mucho estilo. Eso no lo hace cualquiera.'], planta: ['¡Bien plantado! A veces el más listo es el que se baja a tiempo.'],
    adios: ['¡Gracias por dejarme presentar! Vuelvo detrás de la cámara, que es donde se está fresquito.'] },
  { id: 'lola', quien: 'dir', nombre: 'Lola · directora', voz: 'daniela', shirt: 0x8a2ad0,
    adrian: '¡Hoy tenemos copresentadora sorpresa! Sale de la sala de control... ¡Lola, nuestra directora!',
    intro: ['¡Buenas tardes! Por una vez me veis la cara. Normalmente solo me oís gritar «¡corten!».', 'Marco, hoy te dirijo de cerca. Así que nada de improvisar... demasiado.'],
    duelo: ['Duelo número {n}. Cámara uno al concursante, cámara dos a {rival}. ¡Acción!', '{rival}, mira a la cámara con la luz roja. Esa. Perfecto.', 'Quiero un duelo intenso, sin pausas y con mucho suspense. ¡Vamos!'],
    caida: ['¡Plano cenital de la trampilla! Qué bonito ha quedado.', '¡Perfecto! Esa caída la repetimos a cámara lenta en el resumen.', '¡Ahora cae! Y sin tener que repetir la toma. ¡Así da gusto!'],
    moneda: ['La moneda, en primer plano. Que se vea bien cómo gira.', 'Atención: aquí puede pasar de todo. Yo ya he cruzado los dedos.'],
    decision: ['Desde la sala de control te lo digo: piénsalo con calma.', 'Es tu decisión. Yo solo pongo música de suspense.'],
    final: ['¡Juego final! Reloj en pantalla grande y música de tensión. ¡Que empiece!', 'Diez preguntas, dos minutos. Esto en la sala de control se vive con las uñas.'],
    gana: ['¡Toma buena a la primera! ¡Has ganado!'], pierde: ['No pasa nada. Hasta las mejores tomas salen mal alguna vez.'], planta: ['Decisión de experta. Te llevas el premio y nos quedamos con la intriga.'],
    adios: ['¡Y estamos fuera! Gracias, Marco. Ha sido un placer dirigirte cara a cara.'] },
  { id: 'rober', quien: 'tec', nombre: 'Rober · sonido', voz: 'mls_10246', shirt: 0x2a6a3a,
    adrian: '¡Hoy presento con un invitado muy especial! Deja los cascos un momento... ¡Rober, de sonido!',
    intro: ['Probando, probando... ¡Hola! ¿Se me oye bien? Pues claro, si el micro lo he puesto yo.', 'Hoy los efectos de sonido los hago en directo. Y alguno con la boca.'],
    duelo: ['¡Duelo {n}! Subo la música de tensión... ¡más! ¡Más!', '{rival}, habla cerquita del micro, que te quiero oír hasta el último suspiro.', 'Preparo el «tic-tac» del reloj. Es mi sonido favorito. Bueno, después del «fiuuu».'],
    caida: ['¡Fiuuu! ¡Ese sonido de la trampilla es mío! Lo grabé tirando un saco de patatas.', '¡Qué caída! Le subo los graves para que se note más.', 'Sonido de colchón: ¡plof! Todo correcto.'],
    moneda: ['¡Ding! Ese es el sonido de la moneda. Lo grabé con una cuchara.', 'Pongo el redoble de tambor... ¡trrrrrr!'],
    decision: ['Yo pondría el sonido del suspense... pero eso lo decides tú.', 'Silencio total, que hasta el micro está nervioso.'],
    final: ['¡Juego final! Subo el reloj a todo volumen. ¡Tic, tac, tic, tac!', 'Música épica activada. ¡A por el bote!'],
    gana: ['¡Fanfarria de victoria! ¡Tararí, tararííí!'], pierde: ['Sonido triste de trombón: ¡wah, wah, waaah! Pero con cariño.'], planta: ['Sonido de caja registradora: ¡clin! ¡Te lo llevas!'],
    adios: ['Apago los micros. Último aviso: ¡hasta mañana! Clic.'] },
  { id: 'nuria', quien: 'maq', nombre: 'Nuria · maquillaje', voz: 'sharvard_f', shirt: 0xff5aa0,
    adrian: '¡Sorpresa! Hoy presenta conmigo la persona que me pone guapo cada tarde: ¡Nuria, de maquillaje!',
    intro: ['¡Hola! Vengo con la brocha preparada. Al primero que le brille la frente, ¡le doy un toque!', 'Marco, estás perfecto. Bueno, casi. Luego te retoco.'],
    duelo: ['¡Duelo {n}! {rival}, qué bien te queda ese color. Muy de concursante ganador.', 'Un poco de polvos antes del duelo, que los focos aprietan.', 'Este duelo va a sudar. Y yo preparada con los pañuelos.'],
    caida: ['¡Ay! ¡Con lo bien peinado que iba! Bueno, en los colchones se arregla.', '¡Ha caído! Espero que el maquillaje sea resistente a trampillas.', 'Esa caída ha sido muy elegante. Ni se le ha movido el flequillo.'],
    moneda: ['La moneda brilla tanto que voy a tener que maquillarla.', '¡Qué nervios! Me tiembla hasta el pintalabios.'],
    decision: ['Yo me plantaría. Pero yo también me pinto los labios de dorado.', 'Piénsalo con calma. Mientras, te retoco un poquito.'],
    final: ['¡Juego final! Que nadie llore, que se corre el rímel.', '¡A por el bote! Yo te espero con la brocha para las fotos.'],
    gana: ['¡Has ganado! ¡Venga, retoque rápido que vienen las fotos!'], pierde: ['No pasa nada, cariño. Lo importante es que has salido guapísimo en la tele.'], planta: ['Muy inteligente. Y además te vas sin despeinarte.'],
    adios: ['¡Adiós a todos! Marco, vente luego, que te desmaquillo.'] },
  { id: 'luis', quien: 'luis', nombre: 'Luis · catering', voz: 'ald', shirt: 0xffffff,
    adrian: '¡Hoy presento con alguien que nos alimenta a todos! ¡Luis, el del catering!',
    intro: ['¡Buenas tardes! Venía a traer los bocadillos y me he quedado. ¡Esto es mejor que la cocina!', 'Al que gane, le guardo el de jamón. Al que caiga, el de queso. Que también está bueno.'],
    duelo: ['¡Duelo {n}! Esto se pone más caliente que la plancha de los calamares.', '{rival}, ¿has comido bien? Para un duelo así hace falta energía.', '¡A pensar rápido! Como cuando se me queman las tostadas.'],
    caida: ['¡Ha caído como una croqueta en el aceite! ¡Ploc!', 'Abajo le espera un bocadillo de consolación. Lo he dejado yo.', '¡Qué caída! Eso abre el apetito.'],
    moneda: ['¡La moneda! Si sale cara, invito yo a churros.', 'Esta moneda parece una galleta de chocolate. ¡Qué hambre!'],
    decision: ['Mi consejo: más vale bocadillo en mano que cien en la nevera.', 'Piénsalo bien. Mientras tanto, ¿alguien quiere un café?'],
    final: ['¡Juego final! Esto es el postre del programa. ¡A por él!', '¡Dos minutos! Lo que tarda en hacerse una tortilla. ¡Venga!'],
    gana: ['¡Has ganado! ¡Esto merece una tarta de tres pisos!'], pierde: ['Lo siento mucho. Te invito a un bocadillo de calamares para el disgusto.'], planta: ['¡Bien hecho! Con eso tienes para muchas cenas.'],
    adios: ['¡Gracias por dejarme presentar! Y ahora... ¡a recoger los platos!'] },
  { id: 'carmen', quien: 'pub', nombre: 'Carmen · público', voz: 'mls_9972', shirt: 0xff5a20,
    adrian: '¡Hoy he elegido a alguien del público para presentar conmigo! ¡Un aplauso para Carmen!',
    intro: ['¡Ay, que estoy en la tele! ¡Hola, mamá! ¡Hola, vecinas del quinto!', 'Llevo años viendo el programa desde el sofá. ¡Hoy lo presento! No me lo creo.'],
    duelo: ['¡Duelo número {n}! ¡Vamos, vamos! ¡Que se note que estoy aquí!', '{rival}, desde la grada te animamos todos. ¡Bueno, la mitad!', '¡Uy, qué nervios! ¡Esto en casa no se vive igual!'],
    caida: ['¡Ahora cae! ¡Siempre quise decirlo! ¡Qué ilusión!', '¡Huy, huy, huy! ¡Pero qué caída más bonita!', '¡Que alguien me grabe, que esto se lo enseño a mis nietos!'],
    moneda: ['¡Cara! ¡No, cruz! ¡Ay, que no lo sé!', '¡La moneda! ¡En mi casa la tiraríamos con la mano izquierda, que da suerte!'],
    decision: ['¡Yo me plantaría! Bueno, no... ¡Sigue! Ay, no sé, ¡lo que diga tu corazón!', 'Desde el sofá siempre lo tengo clarísimo. ¡Aquí arriba no!'],
    final: ['¡Juego final! ¡Que no se me oiga gritar mucho!', '¡Diez preguntas! ¡En casa me las sé todas!'],
    gana: ['¡Has ganado! ¡Ay, que lloro! ¡Un abrazo!'], pierde: ['¡Qué pena! ¡Pero lo has hecho de maravilla, hijo!'], planta: ['¡Muy bien hecho! ¡Mejor un pájaro en mano!'],
    adios: ['¡Gracias, Marco! ¡Ha sido el mejor día de mi vida! ¡Saludos a todos!'] },
  { id: 'manolo', quien: 'pub', nombre: 'Manolo · público', voz: 'claude', shirt: 0x2a6aff,
    adrian: '¡Sorpresa! Hoy me acompaña un señor de la tercera fila que no paraba de aplaudir: ¡Manolo!',
    intro: ['¡Hola a todos! Mi mujer no se lo va a creer: ¡estoy en la tele y además presento!', 'Yo vengo todas las semanas. Ya me conozco a las trampillas por su nombre.'],
    duelo: ['¡Duelo {n}! ¡Venga, que esto es como el fútbol pero con letras!', '{rival}, ¡tú puedes! ¡Lo dice Manolo, de la tercera fila!', 'Ojo, que este duelo tiene pinta de ir a la prórroga.'],
    caida: ['¡Gooool! Digo... ¡caída! ¡Ahora cae!', '¡Esa trampilla es la más rápida del plató! Lo digo yo, que la conozco.', '¡Ahí va! ¡Abajo! ¡Saludos al colchón!'],
    moneda: ['¡La moneda! Esta la he visto girar cien veces desde la grada. ¡Hoy la veo de cerca!', '¡Cara, que es la que más me gusta! Bueno, la cruz también tiene su gracia.'],
    decision: ['Yo en la grada siempre grito «¡sigue!». Pero aquí arriba da más miedo.', '¡Lo que tú digas! Pero piénsalo, que esto no es el bingo.'],
    final: ['¡Juego final! ¡Como la final de la Copa! ¡Vamos!', '¡Dos minutos! ¡Que se pare el reloj! Bueno, no se puede. ¡Corre!'],
    gana: ['¡Campeón, campeón! ¡Oé, oé, oé!'], pierde: ['¡Otra vez será! ¡Has jugado como un campeón!'], planta: ['¡Muy listo! Así se hace: dinero en el bolsillo y a casa.'],
    adios: ['¡Ha sido un honor! ¡Saludos a mi barrio! ¡Y a mi mujer, que no se lo cree!'] },
  { id: 'jefe', quien: 'jefe', nombre: '«El jefe»', voz: 'sharvard_m', shirt: 0x3a2a1a,
    adrian: '¡Atención, atención! Hoy baja al plató... ¡el mismísimo jefe de la cadena! ¡A presentar conmigo!',
    intro: ['Buenas tardes. He venido a comprobar personalmente que las trampillas funcionan. Y que Marco trabaja.', 'Hoy me quedo todo el programa. Así veo en qué nos gastamos el dinero.'],
    duelo: ['Duelo número {n}. Que sea rápido, que el minuto de publicidad es muy caro.', '{rival}, si ganas, te hago un contrato. Si pierdes, también, pero más pequeño.', 'Este duelo tiene que subir la audiencia dos puntos. Por lo menos.'],
    caida: ['Excelente caída. Eso sube la audiencia. Apuntadlo.', 'Muy bien. Esa trampilla vale cada euro que costó.', '¡Fantástico! Esto lo ponemos en las promos de mañana.'],
    moneda: ['La moneda la pago yo. Así que... que salga algo barato.', 'Cara, cruz... A mí me da igual. Bueno, no me da igual.'],
    decision: ['Como jefe, te recomiendo que sigas. Como persona, que te plantes.', 'Piénsalo. Pero rápido, que el tiempo en televisión es oro.'],
    final: ['Juego final. Que conste que el bote lo pago yo. Con mucho cariño. Y algo de dolor.', 'Dos minutos. Lo que tardo yo en firmar un contrato. ¡Adelante!'],
    gana: ['Enhorabuena. Te firmo el cheque yo mismo. Con la mano temblando.'], pierde: ['Lo siento mucho. Pero el bote se queda en casa. Digo, en la cadena.'], planta: ['Muy sensato. Me recuerdas a mí de joven.'],
    adios: ['Buen programa. Marco, mañana a la misma hora. Y sin tropezarse. O tropezándose, que sube la audiencia.'] },
];
const COPRO = { g: null, fig: null, iv: null, dicho: {} };
const coproActivo = () => !!COPRO.fig;
function coproLinea(clave, vars = {}) {
  const g = COPRO.g, L = g && g[clave]; if (!L || !L.length) return null;
  const k = COPRO.dicho[clave] = ((COPRO.dicho[clave] ?? Math.floor(Math.random() * L.length)) + 1) % L.length;
  return L[k].replace(/\{(\w+)\}/g, (m, v) => vars[v] ?? m);
}
async function coproHabla(c, txt, gesto = 'habla') {
  if (!COPRO.fig || !txt) return;
  const { hud: i, s } = c, g = COPRO.g;
  try { He(COPRO.fig, gesto, 2); } catch (x) { }
  i.say(txt, 1e5, COPRO.fig.head, g.nombre, { voice: false });
  try { await stHabla(g.voz, txt, s); } finally { i.hideBubble(); }
  await s.w(200);
}
/** al empezar el programa: elige personaje, sale y se coloca junto a Marco */
async function coproEntra(c) {
  coproQuita();
  if (window.__coproForce === false || (!window.__coproForce && !coproOn())) return false;
  const { eng: e, hud: i, s } = c, h = e.host;
  let g = (typeof COPRO_APERTURA !== 'undefined' && COPRO_APERTURA) || exAzar(COPRO_DATOS); COPRO_APERTURA = null; if (typeof window.__coproForce === 'string') g = COPRO_DATOS.find(x => x.id === window.__coproForce) || g;
  COPRO.g = g; COPRO.dicho = {}; mec('presentador sorpresa ' + g.id);
  const fig = Rm({ shirt: g.shirt, p3d: { seed: 'copro-' + g.id, g: /^(lola|nuria|carmen)$/.test(g.id) ? 'f' : 'm' } }); e.scene.add(fig.root); COPRO.fig = fig;
  const origen = new P(g.quien === 'pub' ? -2.6 : 3.2, 0, 10.5); fig.root.position.copy(origen);
  const off = new P(1.15, 0, 0.5);
  Ot.wide(e, 1); He(h, 'saluda', 2); await exAdrian(i, s, g.adrian); ze.aplauso(3.5, 0.7); i.toast('🎤 Presentador sorpresa: ' + g.nombre, 3000);
  const dest = h.root.position.clone().add(off); await Promise.race([e.walkTo(fig, dest, 2.2), s.w(7000)]);
  fig.root.position.copy(dest); e.face(fig, new P(dest.x, 0, dest.z + 6));
  const mid = h.root.position.clone().add(dest).multiplyScalar(0.5); e.cut(new P(mid.x + 0.2, mid.y + 1.65, mid.z + 3.6), new P(mid.x, mid.y + 1.3, mid.z));
  // le sigue a Marco durante todo el programa; se quita solo si se sale al menú
  COPRO.iv = setInterval(() => {
    if (!s.alive || !COPRO.fig) return coproQuita();
    const p = h.root.position; if (fig.root.position.distanceTo(p) > 0.3) fig.root.position.set(p.x + off.x, p.y, p.z + off.z);
  }, 250);
  COPRO.pausa = 0; if (!(await coproBienvenida(c))) for (const t of g.intro) await coproHabla(c, t, 'saluda');
  He(h, 'aplaude', 2); ze.aplauso(2.5, 0.6);
  return true;
}
/** frase del copresentador en un momento del programa (duelo, caida, moneda, decision, final) */
async function coproMomento(c, clave, vars = {}, prob = 1) {
  if (!COPRO.fig || Math.random() > prob) return;
  mec('copro ' + clave);
  try { await coproHabla(c, coproLinea(clave, vars), clave === 'caida' ? 'aplaude' : clave === 'final' ? 'arriba' : 'senala'); } catch (x) { if (x === _o) throw x; console.warn('copro', clave, x); mec('copro error ' + clave + ' ' + x.message); }
}
/** despedida a dúo y se va */
async function coproDespide(c, res) {
  if (!COPRO.fig) return;
  const { eng: e, s } = c;
  try {
    Ot.wide(e, 1);
    await coproHabla(c, coproLinea(res === 'ganado' ? 'gana' : res === 'plantado' ? 'planta' : 'pierde'), res === 'ganado' ? 'arriba' : 'habla');
    await coproHabla(c, coproLinea('adios'), 'saluda'); ze.aplauso(3, 0.7);
  } finally { coproQuita(); }
}
function coproQuita() { try { regidorQuita(); } catch (x) { } clearInterval(COPRO.iv); COPRO.iv = null; try { COPRO.fig && Xe.scene.remove(COPRO.fig.root); } catch (x) { } COPRO.fig = null; }
function filaCopro() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowCopro';
  const lb = document.createElement('label'); lb.textContent = '🎙️ Presentador sorpresa (todo el programa)'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((coproOn() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_copro', v); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
  return row;
}
window.__copro = { datos: COPRO_DATOS, estado: () => ({ id: COPRO.g && COPRO.g.id, activo: coproActivo() }) };
