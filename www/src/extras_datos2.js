// ===================================================================================================
// v1.13 · MÁS ESCENAS para Cámara oculta, Tomas falsas y Fuera de cámaras (mismo formato que extras_datos.js):
// [quién, texto, cámara (host|wide|oppN|holeN|cerca), gesto, efecto (claqueta:N|cae:N|abreVacia:N|trampillaNo:N|tablaFalsa|inocente|corten|tomafalsa|risas|aplauso|ooh|silencio)]
// ===================================================================================================
EX_DATOS.oculta.push(
{ id: "gemelos", titulo: "El concursante con gemelo", pasos: [
 ["adrian", "Recibimos al número dos. ¡Buenas tardes! ¿Qué tal estás?", "opp2", "saluda", ""],
 ["conc", "Muy bien, Marco. Aunque hace un momento estaba en la trampilla nueve.", "opp2", "", "ooh"],
 ["adrian", "¿Cómo que en la nueve? Si te acabo de ver ahí... y ahí... ¡Sois dos!", "opp9", "lamenta", "risas"],
 ["conc", "¿Dos? Yo solo veo a uno. Bueno, a uno repetido.", "opp9", "", "risas"],
 ["reg", "Marco, no te preocupes, el número nueve es su hermano gemelo. Se llaman igual.", "wide", "", ""],
 ["adrian", "¿Y cómo sé a quién le hago las preguntas? ¡Me voy a liar con los marcadores!", "host", "encoge", "risas"],
 ["dir", "¡Inocente, inocente! ¡Los hemos vestido iguales para despistarte!", "wide", "", "inocente"],
 ["adrian", "¡Pues lo habéis conseguido! Ya no sé ni cuál es mi trampilla.", "host", "aplaude", "risas"]]},
{ id: "presentador_doble", titulo: "El doble de Marco", pasos: [
 ["adrian", "¡Buenas tardes! Vamos a... Un momento. ¿Quién es ese señor vestido como yo?", "host", "senala", "ooh"],
 ["reg", "Es el presentador de repuesto, Marco. Por si te caes por una trampilla.", "wide", "", "risas"],
 ["adrian", "¿Presentador de repuesto? ¡Pero si yo nunca me caigo!", "host", "lamenta", ""],
 ["dir", "Por si acaso. Él ya se sabe tus chistes. Bueno, los entiende mejor que tú.", "wide", "", "risas"],
 ["adrian", "¡Eso sí que no! Mis chistes no los entiende nadie. Es parte del encanto.", "host", "habla", "risas"],
 ["dir", "¡Inocente, inocente! ¡Es un actor con peluca! ¡Cámara oculta!", "wide", "", "inocente"],
 ["adrian", "Ya me parecía a mí que yo era más guapo.", "host", "aplaude", "risas"]]},
{ id: "bocadillos", titulo: "Los bocadillos parlantes", pasos: [
 ["adrian", "Antes de empezar, vamos a por un bocadillo del catering.", "host", "habla", ""],
 ["adrian", "¿Qué es este ruido? ¡El bocadillo me ha dicho «hola»!", "host", "lamenta", "ooh"],
 ["tec", "Será el hambre, Marco. A mí el chorizo me canta jotas todas las tardes.", "wide", "", "risas"],
 ["adrian", "¡Que no, que no! ¡Que ha dicho «hola, Marco»! ¡Y sabe mi nombre!", "host", "senala", "risas"],
 ["reg", "¡Inocente, inocente! ¡Le habíamos puesto un altavoz dentro del pan!", "wide", "", "inocente"],
 ["adrian", "¡Pues me lo voy a comer igual! Con altavoz y todo.", "host", "aplaude", "risas"]]},
{ id: "huellas_bailan", titulo: "Las huellas que se mueven", pasos: [
 ["adrian", "¡Elige huella! ¿Cuál será? ¿Esta? ¿Esa? ¡Un momento! ¡La huella se ha movido!", "wide", "senala", "ooh"],
 ["conc", "A mí también me ha pasado, Marco. La mía se ha ido a la trampilla de al lado.", "opp4", "", "risas"],
 ["adrian", "¿Quién ha puesto ruedas a las huellas? ¡Esto no está en el reglamento!", "host", "lamenta", ""],
 ["tec", "Es una huella nueva, Marco. Modelo deportivo. Corre que se las pela.", "wide", "", "risas"],
 ["dir", "¡Inocente, inocente! ¡Las mueve Toni desde abajo con un imán!", "wide", "", "inocente"],
 ["adrian", "¡Toni, sal de debajo del plató ahora mismo!", "host", "aplaude", "risas"]]},
{ id: "lluvia", titulo: "Llueve en el plató", pasos: [
 ["adrian", "¡Bienvenidos a ¡Ahora caigo!... ¿Me ha caído una gota en la cabeza?", "host", "saluda", ""],
 ["tec", "Será el aire acondicionado, Marco. Hoy está muy emocionado.", "wide", "", "risas"],
 ["adrian", "¡Otra! ¡Y otra! ¡Está lloviendo dentro del plató!", "host", "lamenta", "ooh"],
 ["reg", "¿Quieres un paraguas? Tengo uno con el logo del programa.", "wide", "", "risas"],
 ["adrian", "¡Quiero que deje de llover! ¡Que los concursantes se van a resbalar de la trampilla!", "host", "senala", ""],
 ["dir", "¡Inocente, inocente! ¡Es una regadera colgada del techo!", "wide", "", "inocente"],
 ["adrian", "¡Qué malos sois! Por lo menos me habéis regado el peinado.", "host", "aplaude", "risas"]]},
{ id: "concursante_dormido", titulo: "El concursante dormido", pasos: [
 ["adrian", "Pregunta para el número ocho... ¿Número ocho? ¡Se ha quedado dormido!", "opp8", "senala", "ooh"],
 ["conc", "Zzz... cinco minutitos más, mamá...", "opp8", "", "risas"],
 ["adrian", "¡Que estamos en directo! ¡Despierte, que le abro la trampilla!", "host", "lamenta", "trampillaNo:8"],
 ["conc", "Zzz... ¿ya es la hora del bocadillo?", "opp8", "", "risas"],
 ["reg", "Marco, dice que ha venido directamente del turno de noche.", "wide", "", ""],
 ["dir", "¡Inocente, inocente! ¡Es un actor y estaba despierto todo el rato!", "wide", "", "inocente"],
 ["adrian", "¡Pues ronca de maravilla! ¡Que le den un premio!", "host", "aplaude", "risas"]]},
{ id: "idioma", titulo: "El concursante que solo habla en inglés", pasos: [
 ["adrian", "¡Buenas tardes, número uno! ¿De dónde nos visitas?", "opp1", "saluda", ""],
 ["conc", "Good afternoon, Adrian! I am very happy to be here!", "opp1", "", "ooh"],
 ["adrian", "Ah... Welcome. Mi inglés es de la academia del barrio. ¿Me entiende?", "host", "encoge", "risas"],
 ["conc", "Of course! Y también hablo español, pero me hacía ilusión verte sufrir.", "opp1", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡Es de Valladolid de toda la vida!", "wide", "", "inocente"],
 ["adrian", "¡Pues tiene un acento de Londres que ya quisiera yo!", "host", "aplaude", "risas"]]},
{ id: "boton_rojo", titulo: "El botón rojo misterioso", pasos: [
 ["adrian", "Rober, ¿para qué sirve este botón rojo tan grande del atril?", "host", "senala", ""],
 ["tec", "¡No lo toques, Marco! Ese botón abre todas las trampillas a la vez.", "wide", "", "ooh"],
 ["adrian", "¿Todas? ¿Incluida la mía?", "host", "lamenta", "risas"],
 ["tec", "Incluida la tuya. Y la del cámara. Y la de la máquina de café.", "wide", "", "risas"],
 ["adrian", "Pues lo tapo con un pañuelo y aquí no ha pasado nada.", "host", "habla", ""],
 ["dir", "¡Inocente, inocente! ¡El botón solo hace «piii»!", "wide", "", "inocente"],
 ["adrian", "¡Piii! ¡Qué susto me habéis dado! Me quedo el botón de recuerdo.", "host", "aplaude", "risas"]]},
{ id: "jefe_canta", titulo: "El jefe quiere cantar", pasos: [
 ["jefe", "Marco, he decidido que hoy abro yo el programa. ¡Cantando!", "wide", "", "ooh"],
 ["adrian", "¿Cantando? Jefe, con todo el respeto, el programa es de preguntas.", "host", "encoge", ""],
 ["jefe", "¡La la laaa! ¡Ahora caigoaa, caduta liberaaa!", "wide", "", "risas"],
 ["adrian", "Muy bonito... Muy... alto. ¿Alguien puede bajar el volumen?", "host", "lamenta", "risas"],
 ["dir", "¡Inocente, inocente! ¡El jefe no ha cantado en su vida!", "wide", "", "inocente"],
 ["jefe", "Y no pienso volver a hacerlo. Pero la cara que has puesto, Marco, no tiene precio.", "wide", "", "risas"],
 ["adrian", "¡Pues tiene usted futuro en el karaoke, jefe!", "host", "aplaude", "risas"]]}
);
EX_DATOS.tomas.push(
{ id: "camara_equivocada", titulo: "La cámara equivocada", pasos: [
 ["adrian", "¡Buenas tardes a todos los que nos veis desde casa!", "wide", "saluda", "claqueta:1"],
 ["reg", "Marco, esa es la cámara de la cafetería. La buena es la otra.", "wide", "", "tomafalsa"],
 ["adrian", "¡Buenas tardes a la cafetería también! ¡Que aproveche!", "host", "aplaude", "risas"],
 ["dir", "¡Corten! Mira a la cámara uno, Marco. La que tiene la lucecita roja.", "wide", "", "corten"]]},
{ id: "trampilla_eco", titulo: "La trampilla con eco", pasos: [
 ["adrian", "¡Ahora... cae!", "hole3", "senala", "claqueta:3"],
 ["adrian", "Un momento, que la trampilla ha hecho eco: «cae, cae, cae...».", "host", "encoge", "tomafalsa"],
 ["tec", "Es que dentro está el micrófono de repuesto. Perdón.", "wide", "", "risas"],
 ["dir", "¡Corten! Sacad el micro de la trampilla, que se nos cae el sonido.", "wide", "", "corten"]]},
{ id: "telefono", titulo: "El móvil sonando", pasos: [
 ["adrian", "Silencio en el plató... Momento de máxima tensión...", "host", "habla", "claqueta:2"],
 ["adrian", "¿De quién es ese móvil con la canción del verano?", "wide", "senala", "ooh"],
 ["adrian", "¡Uy, es el mío! Es mi madre. Dice que me ha visto mal peinado.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Marco, los móviles se dejan en el camerino. Y saluda a tu madre.", "wide", "", "corten"]]},
{ id: "pregunta_al_reves", titulo: "La tarjeta al revés", pasos: [
 ["adrian", "Pregunta: ¿ojerep lebrá ed sepat sanauc?", "host", "habla", "claqueta:5"],
 ["adrian", "¡Ah, que tengo la tarjeta del revés! Ya decía yo que sonaba a idioma raro.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Dale la vuelta a la tarjeta. Y a la cabeza, de paso.", "wide", "", "corten"]]},
{ id: "despedida_temprana", titulo: "La despedida a destiempo", pasos: [
 ["adrian", "¡Muchas gracias por acompañarnos y hasta mañana!", "host", "saluda", "claqueta:1"],
 ["reg", "Marco, que el programa acaba de empezar. Ni hemos hecho el primer duelo.", "wide", "", "tomafalsa"],
 ["adrian", "¿Ya? ¡Pues se me ha pasado volando!", "host", "encoge", "risas"],
 ["dir", "¡Corten! Guarda la despedida para el final, por favor.", "wide", "", "corten"]]},
{ id: "moneda_rodando", titulo: "La moneda que se escapa", pasos: [
 ["adrian", "¡Lanzamos la moneda! ¿Cara o cruz?", "host", "arriba", "claqueta:4"],
 ["adrian", "¡Se ha ido rodando por el plató! ¡Que alguien la pare!", "wide", "senala", "ooh"],
 ["reg", "¡Se ha metido por la trampilla siete! Voy a por ella.", "hole7", "", "abreVacia:7"],
 ["dir", "¡Corten! La próxima la lanzas más flojito, Marco.", "wide", "", "corten"]]},
{ id: "baile", titulo: "El baile improvisado", pasos: [
 ["adrian", "¡Música, maestro! ¡Vamos a celebrarlo!", "host", "arriba", "claqueta:5"],
 ["adrian", "Un pasito para aquí, un pasito para allá... ¡Ay, que me he pisado yo solo!", "host", "lamenta", "risas"],
 ["conc", "Marco, si quieres te doy clases. Soy monitora de zumba.", "opp4", "", "tomafalsa"],
 ["dir", "¡Corten! Aquí se pregunta, no se baila. Bueno... baila un poquito más, que ha quedado gracioso.", "wide", "", "corten"]]},
{ id: "luces", titulo: "Apagón en el plató", pasos: [
 ["adrian", "¡Momento de máxima emoción! ¡Que se apaguen las luces!", "host", "arriba", "claqueta:1"],
 ["adrian", "Hombre, tanto como apagarlas TODAS... ¡No veo ni mi trampilla!", "wide", "lamenta", "ooh"],
 ["tec", "Perdón, he tocado el interruptor general. Enciendo, enciendo.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Rober, el general no se toca. Toma dos.", "wide", "", "corten"]]},
{ id: "chiste_malo", titulo: "El chiste que no acaba", pasos: [
 ["adrian", "¿Sabéis aquel que dice que entra una trampilla en un bar? Y le dice el camarero...", "host", "habla", "claqueta:6"],
 ["adrian", "¿Qué le decía el camarero? ¡Se me ha olvidado el final!", "host", "encoge", "tomafalsa"],
 ["reg", "Le decía: «¿Te pongo algo?». Y la trampilla: «No, que luego me caigo».", "wide", "", "risas"],
 ["dir", "¡Corten! El chiste es de Toni. Que lo cuente él la próxima vez.", "wide", "", "corten"]]},
{ id: "puntos_locos", titulo: "El marcador loco", pasos: [
 ["adrian", "¡Has ganado... un millón trescientos mil puntos! Uy, eso es mucho.", "host", "aplaude", "claqueta:2"],
 ["tec", "Perdón, se me ha ido el dedo. Eran mil trescientos.", "wide", "", "tomafalsa"],
 ["conc", "¡No, no! ¡Yo me quedo con el millón!", "opp3", "", "risas"],
 ["dir", "¡Corten! Rober, revisa el marcador. Y quitadle el millón al concursante.", "wide", "", "corten"]]}
);
EX_DATOS.fuera.push(
{ id: "catering", titulo: "La mesa del catering", lugar: "plato", pasos: [
 ["reg", "¡Han llegado los bocadillos! De tortilla, de jamón y de calamares.", "wide", "", ""],
 ["adrian", "Yo quiero uno de cada. Para presentar hay que estar bien alimentado.", "host", "aplaude", ""],
 ["tec", "Marco, que luego te ríes y se te ve el perejil entre los dientes.", "wide", "", ""],
 ["adrian", "Pues sonrío con la boca cerrada. Como los presentadores serios.", "host", "encoge", ""]]},
{ id: "calentamiento", titulo: "Calentando la voz", lugar: "maquillaje", pasos: [
 ["adrian", "Mi-mi-mi-mi... Ahora caaaigo... Ahoooora caigo...", "cerca", "habla", ""],
 ["maq", "Marco, cantas peor que el secador de pelo.", "cerca", "", ""],
 ["adrian", "Es mi calentamiento secreto, Nuria. Así la voz sale potente.", "cerca", "encoge", ""],
 ["maq", "Pues cierra los ojos, que te pongo la sombra. Y calla un poquito.", "cerca", "", ""]]},
{ id: "repaso_preguntas", titulo: "Repasando las preguntas", lugar: "control", pasos: [
 ["dir", "Marco, repasa las preguntas de hoy. Hay una de geografía muy difícil.", "cerca", "", ""],
 ["adrian", "¿Cuál es el río más largo de España? Fácil: el Tajo.", "cerca", "habla", ""],
 ["dir", "Muy bien. ¿Y cómo se pronuncia «Mississippi»?", "cerca", "", ""],
 ["adrian", "Mi-si-si... Lola, pon otra pregunta, que esta me la como.", "cerca", "lamenta", ""],
 ["dir", "Ya está cambiada. Ahora es de comida. Esa sí que te la sabes.", "cerca", "", ""]]},
{ id: "publico_entra", titulo: "Entra el público", lugar: "plato", pasos: [
 ["reg", "¡Atención, que entra el público! Sentaos por filas, sin correr.", "wide", "", ""],
 ["pub", "¡Marco! ¡Marco! ¡Una foto!", "wide", "", ""],
 ["adrian", "¡Hola, hola! Fotos al final, que ahora me tienen que poner el micro.", "host", "saluda", ""],
 ["reg", "Y recordad: cuando levante el cartel, aplausos. Cuando lo baje, silencio.", "wide", "", ""],
 ["pub", "¿Y si nos da la risa?", "wide", "", ""],
 ["reg", "Entonces os reís. Pero con ganas, que se oiga en casa.", "wide", "", ""]]},
{ id: "camerino", titulo: "En el camerino de Marco", lugar: "maquillaje", pasos: [
 ["maq", "Marco, ¿cuántas chaquetas iguales tienes en el camerino?", "cerca", "", ""],
 ["adrian", "Catorce. Una para cada día de la semana, y siete de repuesto.", "cerca", "encoge", ""],
 ["maq", "¿De repuesto para qué?", "cerca", "", ""],
 ["adrian", "Por si me caigo por una trampilla. Uno nunca sabe.", "cerca", "habla", ""]]},
{ id: "jefe_visita", titulo: "Visita del jefe", lugar: "control", pasos: [
 ["jefe", "Lola, ¿qué tal la audiencia de ayer?", "cerca", "", ""],
 ["dir", "Muy bien, jefe. Subimos dos puntos cuando Marco se tropezó.", "cerca", "", ""],
 ["jefe", "Pues que se tropiece más. Pero sin hacerse daño, ¿eh?", "cerca", "", ""],
 ["adrian", "¡Que os estoy oyendo! Yo no me tropiezo a propósito.", "cerca", "lamenta", ""],
 ["jefe", "Lo sabemos, Marco. Por eso funciona.", "cerca", "", ""]]},
{ id: "minuto_final", titulo: "Un minuto para el directo", lugar: "control", pasos: [
 ["dir", "¡Un minuto para el directo! Todo el mundo a sus puestos.", "cerca", "", ""],
 ["adrian", "Lola, ¿estoy bien de pelo? ¿Y la corbata?", "cerca", "encoge", ""],
 ["dir", "Estás perfecto. Treinta segundos. ¿Has ido al baño?", "cerca", "", ""],
 ["adrian", "¡Ay, no! ¿Me da tiempo?", "cerca", "lamenta", ""],
 ["dir", "No. Diez, nueve, ocho... ¡A sonreír!", "cerca", "", ""]]},
{ id: "despues", titulo: "Después del programa", lugar: "plato", pasos: [
 ["reg", "¡Y estamos fuera! Buen programa, equipo.", "wide", "", ""],
 ["adrian", "¡Gracias a todos! Hoy han caído un montón. Los colchones van a pedir vacaciones.", "host", "aplaude", ""],
 ["tec", "Yo apago las luces. ¿Alguien se ha dejado algo en el plató?", "wide", "", ""],
 ["adrian", "Mi dignidad, en la trampilla cuatro. Pero ya la recojo mañana.", "host", "encoge", ""]]}
);

// escenas añadidas tras revisar duplicados (cada una con situación y gag propios)
const NUEVAS = {
oculta: [
{ id: "loro", titulo: "El loro de la grada", pasos: [
 ["adrian", "Silencio, que viene el momento clave. Ha fallado el número seis, así que...", "opp6", "senala", ""],
 ["pub", "¡Ahora cae! ¡Ahora cae! ¡Crrr!", "wide", "", "ooh"],
 ["adrian", "¿Quién ha dicho eso? ¡Que esa frase es mía! ¿Es un loro?", "host", "lamenta", "risas"],
 ["reg", "Es Paquito, el loro de una señora de la segunda fila. Viene todas las semanas.", "wide", "", "risas"],
 ["adrian", "Pues que no me pise las frases. Paquito, a la de tres la digo yo: una, dos...", "host", "habla", ""],
 ["pub", "¡Crrr! ¡Que te calles, Marco! ¡Crrr!", "wide", "", "risas"],
 ["dir", "¡Inocente, inocente! ¡El loro era Toni con una grabadora debajo del asiento!", "wide", "", "inocente"],
 ["adrian", "¡Toni! ¡Te voy a dar alpiste para merendar!", "host", "aplaude", "risas"]]},
{ id: "confeti", titulo: "El confeti que no para", pasos: [
 ["adrian", "¡Has ganado! ¡Que caiga el confeti!", "host", "arriba", "aplauso"],
 ["adrian", "Muy bonito... ya está... ya vale... ¿Por qué sigue cayendo confeti?", "host", "encoge", "ooh"],
 ["tec", "Marco, el cañón se ha quedado enganchado. Lleva ya tres sacos.", "wide", "", "risas"],
 ["adrian", "¡Que me llega por las rodillas! ¡Que no veo las trampillas! ¡Socorro!", "host", "lamenta", "risas"],
 ["reg", "¡Inocente, inocente! ¡Era confeti de broma y teníamos cuarenta sacos!", "wide", "", "inocente"],
 ["adrian", "¡Pues lo barro yo mismo! Pero que conste que me lo llevo a casa para Nochevieja.", "host", "aplaude", "risas"]]},
{ id: "mago", titulo: "El concursante mago", pasos: [
 ["adrian", "Pregunta para el número diez... ¿Dónde están mis tarjetas? ¡Las tenía en la mano!", "host", "lamenta", "ooh"],
 ["conc", "¿Buscabas esto, Marco? Elige una tarjeta, la que quieras.", "opp10", "", "risas"],
 ["adrian", "¿Cómo las ha cogido desde la trampilla? ¡Está a cinco metros!", "host", "senala", ""],
 ["conc", "Y ahora mira en el bolsillo de tu chaqueta.", "opp10", "", "ooh"],
 ["adrian", "¡Mi reloj! ¡Y una moneda! ¡Y un conejo de peluche! ¿Esto qué es?", "host", "encoge", "risas"],
 ["dir", "¡Inocente, inocente! ¡Es un mago profesional! ¡Cámara oculta!", "wide", "", "inocente"],
 ["adrian", "¡Pues que haga desaparecer las preguntas difíciles, que me vendría genial!", "host", "aplaude", "risas"]]}
],
tomas: [
{ id: "micro_abierto", titulo: "El micrófono abierto", pasos: [
 ["adrian", "Uf, por fin publicidad. Lola, ¿hoy hay lentejas en el comedor? Es que tengo un hambre...", "host", "encoge", "claqueta:2"],
 ["tec", "Marco, no estamos en publicidad. Te está oyendo toda España.", "wide", "", "tomafalsa"],
 ["adrian", "¡Hola, España! Sí, hay lentejas. Os lo confirmo.", "host", "saluda", "risas"],
 ["dir", "¡Corten! Rober, ese micrófono se cierra antes de hablar de comida.", "wide", "", "corten"]]},
{ id: "lentilla", titulo: "La lentilla perdida", pasos: [
 ["adrian", "Leo la pregunta... ¡Ay! ¡Se me ha caído una lentilla!", "host", "lamenta", "claqueta:3"],
 ["adrian", "¡Que nadie se mueva! Está por el suelo, cerca de la trampilla dos.", "hole2", "senala", "ooh"],
 ["reg", "¡La tengo! Ah, no, es un trocito de confeti.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Diez minutos para buscar la lentilla. Y alguien que le traiga las gafas.", "wide", "", "corten"]]},
{ id: "zapato", titulo: "El zapato volador", pasos: [
 ["adrian", "¡Y el número nueve... ahora cae!", "hole9", "senala", "claqueta:4"],
 ["adrian", "¡Mi zapato! ¡He dado una patada al aire y se ha ido detrás de él!", "host", "lamenta", "cae:9"],
 ["conc", "¡Marco, aquí abajo tengo tu zapato! ¡Te lo subo!", "opp9", "", "tomafalsa"],
 ["dir", "¡Corten! Que alguien baje a por el zapato. Y nada de patadas, Marco.", "wide", "", "corten"]]},
{ id: "teleprompter", titulo: "El teleprompter literal", pasos: [
 ["adrian", "Bienvenidos a ¡Ahora caigo! Paréntesis, sonreír a cámara, cierro paréntesis.", "host", "saluda", "claqueta:1"],
 ["adrian", "Pausa dramática. Tres puntos suspensivos. Mirar al público con cariño.", "host", "habla", "risas"],
 ["adrian", "Uy, que eso no se lee en voz alta, ¿verdad?", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Marco, lo de los paréntesis es para hacerlo, no para decirlo.", "wide", "", "corten"]]},
{ id: "corbata", titulo: "La corbata atrapada", pasos: [
 ["adrian", "Me acerco a saludar al número uno... ¡Uy! ¡No puedo moverme!", "opp1", "saluda", "claqueta:2"],
 ["adrian", "¡Se me ha enganchado la corbata en el atril! ¡Estoy atado al plató!", "host", "lamenta", "ooh"],
 ["reg", "Quieto, Marco, que voy con las tijeras. ¿Te importa quedarte con media corbata?", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Hoy presentas sin corbata. Queda moderno.", "wide", "", "corten"]]},
{ id: "mosca", titulo: "La mosca del suspense", pasos: [
 ["adrian", "Momento de máxima tensión. Nadie se mueve. Nadie respira...", "host", "habla", "claqueta:5"],
 ["adrian", "Ni la mosca que se me ha puesto en la nariz. ¡Fuera, fuera, bicho!", "host", "lamenta", "risas"],
 ["adrian", "¡Se ha ido a la trampilla tres! Bueno, si cae, que sea ella.", "hole3", "senala", "tomafalsa"],
 ["dir", "¡Corten! Que alguien abra una ventana. Y que la mosca firme el contrato.", "wide", "", "corten"]]},
{ id: "ventilador", titulo: "El ventilador gigante", pasos: [
 ["tec", "Encendemos el ventilador para dar ambiente. Al mínimo.", "wide", "", "claqueta:3"],
 ["adrian", "¡Eso no es el mínimo! ¡Se me vuelan las tarjetas! ¡Y el peinado!", "host", "lamenta", "ooh"],
 ["adrian", "¡La pregunta tres se ha ido volando hasta la grada!", "wide", "senala", "tomafalsa"],
 ["dir", "¡Corten! Rober, apaga eso, que parece que presentamos desde un helicóptero.", "wide", "", "corten"]]},
{ id: "atril", titulo: "El atril que baja", pasos: [
 ["adrian", "Apoyo las tarjetas en el atril y leemos la siguiente pregunta...", "host", "habla", "claqueta:1"],
 ["adrian", "¿El atril está bajando? ¡Está bajando! ¡Ya me llega por las rodillas!", "host", "lamenta", "ooh"],
 ["tec", "Perdón, he pulsado el botón de la plataforma. Lo subo.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Rober, el atril se queda quieto. Marco, tú también.", "wide", "", "corten"]]}
],
fuera: [
{ id: "vestuario", titulo: "En vestuario", lugar: "maquillaje", pasos: [
 ["dir", "Marco, para hoy tienes dos chaquetas: la azul o la azul.", "cerca", "", ""],
 ["adrian", "Mmm... difícil. ¿La azul tiene bolsillos?", "cerca", "encoge", ""],
 ["dir", "Las dos tienen bolsillos. Una es azul y la otra también.", "cerca", "", ""],
 ["adrian", "Pues la azul. Siempre me ha quedado mejor la azul.", "cerca", "aplaude", ""]]},
{ id: "seguridad", titulo: "La charla de seguridad", lugar: "plato", pasos: [
 ["reg", "Concursantes, charla de seguridad. Si se abre la trampilla: brazos cruzados y piernas juntas.", "wide", "", ""],
 ["conc", "¿Y gritar está permitido?", "opp7", "", ""],
 ["reg", "Gritar es obligatorio. Queda muy bien en la tele.", "wide", "", ""],
 ["conc", "¿Y si me da tiempo, puedo saludar a mi familia mientras caigo?", "opp2", "", ""],
 ["reg", "Si te da tiempo, sí. Pero suele dar tiempo a decir «ho...» y poco más.", "wide", "", ""]]},
{ id: "cartas", titulo: "Las cartas de los fans", lugar: "plato", pasos: [
 ["reg", "Marco, ha llegado el saco de cartas de la semana. Te leo una.", "wide", "", ""],
 ["reg", "«Querido Marco: te he tejido una bufanda con trampillas. Firmado, Encarna, de Albacete».", "wide", "", ""],
 ["adrian", "¡Qué detalle! Encarna, si nos ves, me la pongo en invierno. Con las trampillas hacia fuera.", "host", "aplaude", ""],
 ["reg", "Y esta es de un niño: «¿Marco, tú te has caído alguna vez?».", "wide", "", ""],
 ["adrian", "Muchas. Pero siempre por las escaleras, nunca por una trampilla.", "host", "encoge", ""]]},
{ id: "cafetera", titulo: "La cafetera estropeada", lugar: "control", pasos: [
 ["dir", "Atención todo el mundo: la cafetera se ha estropeado.", "cerca", "", ""],
 ["adrian", "¿Cómo que estropeado? ¡Si sin café no sé ni cómo se llama el programa!", "cerca", "lamenta", ""],
 ["tec", "Tranquilos, que la arreglo con un cable de micrófono y un poco de cinta.", "cerca", "", ""],
 ["dir", "Rober, ahora el café sale por el altavoz del plató.", "cerca", "", ""],
 ["adrian", "Mientras salga caliente, a mí me vale.", "cerca", "aplaude", ""]]}
]};
EX_DATOS.oculta.push(...NUEVAS.oculta); EX_DATOS.tomas.push(...NUEVAS.tomas); EX_DATOS.fuera.push(...NUEVAS.fuera);
