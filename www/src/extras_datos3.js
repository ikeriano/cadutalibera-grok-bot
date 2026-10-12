// v1.13 (2ª tanda): escenas totalmente nuevas, revisadas contra todas las existentes.
(function () {
const O = (id, titulo, pasos) => ({ id, titulo, pasos });
const F = (id, titulo, lugar, pasos) => ({ id, titulo, lugar, pasos });
EX_DATOS.oculta.push(
O("robot", "El concursante robot", [
 ["adrian", "Número cuatro, ¿cómo te llamas y de dónde vienes?", "opp4", "habla", ""],
 ["conc", "Bip. Me llamo Unidad Cuatro. Vengo. De. Un. Enchufe. Bip.", "opp4", "", "ooh"],
 ["adrian", "Ah... ¿y a qué te dedicas, Unidad Cuatro?", "host", "encoge", "risas"],
 ["conc", "Batería. Al. Cinco. Por. Ciento. Necesito. Cargarme. En. La. Trampilla.", "opp4", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡Es un actor con un disfraz de lata y luces de Navidad!", "wide", "", "inocente"]]),
O("cumple", "El cumpleaños que no era", [
 ["pub", "¡Cumpleaños feliz, te deseamos, Marco...!", "wide", "", "aplauso"],
 ["adrian", "¡Gracias, gracias! Pero... si mi cumpleaños es en marzo.", "host", "encoge", "ooh"],
 ["maq", "¡Pues aquí tienes la tarta! Con cuarenta y siete velas.", "wide", "", "risas"],
 ["adrian", "¿Cuarenta y siete? ¡Que yo no tengo tantos! ¿O sí? Ya no sé ni qué día es.", "host", "lamenta", "risas"],
 ["dir", "¡Inocente, inocente! ¡Felicidades adelantadas, Marco!", "wide", "", "inocente"]]),
O("pinganillo", "Las órdenes del pinganillo", [
 ["adrian", "Seguimos con... ¿perdón? Me dicen por el pinganillo que salude a pata coja.", "host", "senala", ""],
 ["adrian", "Bueno, si lo pide la dirección... ¡Hola a todos! ¿Y ahora que maúlle? ¿En serio?", "host", "saluda", "risas"],
 ["adrian", "Miau. Miau. ¿Que dé tres vueltas sobre mí mismo y diga «soy una tetera»?", "host", "encoge", "risas"],
 ["tec", "¡Inocente, inocente! ¡Las órdenes te las daba Toni desde el bar!", "wide", "", "inocente"]]),
O("decorado", "El decorado de cartón", [
 ["adrian", "Y apoyándome en esta pared del plató, os digo que...", "host", "habla", ""],
 ["adrian", "¡Se ha caído la pared! ¡Y detrás hay un aparcamiento!", "wide", "lamenta", "ooh"],
 ["pub", "¡Mira, se ve mi coche!", "wide", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡El aparcamiento era una foto gigante pegada en la pared!", "wide", "", "inocente"]]),
O("perro", "El perro y la moneda", [
 ["adrian", "Lanzo la moneda y... ¿Y la moneda? ¿Dónde está?", "host", "senala", ""],
 ["adrian", "¡Un perro! ¡Un perro se ha llevado la moneda en la boca!", "wide", "lamenta", "ooh"],
 ["conc", "¡Ese es Rufo, mi perro! ¡Rufo, suelta! ¡Que era cara, Rufo!", "opp6", "", "risas"],
 ["dir", "¡Inocente, inocente! ¡Rufo está contratado y la moneda era de chocolate!", "wide", "", "inocente"]]),
O("primo", "El primo perdido", [
 ["conc", "Marco, antes de jugar: soy tu primo Fermín, el del pueblo. ¿No te acuerdas de mí?", "opp8", "", "ooh"],
 ["adrian", "¿Fermín? Pues... claro, Fermín. ¿Qué tal la... la familia?", "host", "encoge", "risas"],
 ["conc", "¡Fatal! Desde que te subiste al tractor de la abuela y lo metiste en el río...", "opp8", "", "risas"],
 ["adrian", "¡Yo nunca he conducido un tractor! ¿Seguro que eres mi primo?", "host", "lamenta", ""],
 ["reg", "¡Inocente, inocente! ¡Fermín no existe y el tractor tampoco!", "wide", "", "inocente"]]),
O("notas", "Las trampillas musicales", [
 ["adrian", "Concursante, colócate en la trampilla cinco.", "opp5", "senala", ""],
 ["conc", "¡Al pisar suena un do! Y la de al lado... ¡un re! ¡Esto es un piano!", "opp5", "", "ooh"],
 ["adrian", "Pues ya que estamos, toca algo. A ver... ¡Eso es Asturias, patria querida!", "host", "aplaude", "risas"],
 ["tec", "¡Inocente, inocente! ¡Las notas las tocaba yo con un teclado en control!", "wide", "", "inocente"]]),
O("pelucas", "Diez Adrianes", [
 ["adrian", "Damos la bienvenida a los concursantes de hoy... ¡Pero qué es esto!", "wide", "senala", "ooh"],
 ["conc", "Hola, soy Marco. Y él también. Y aquel también.", "opp1", "", "risas"],
 ["adrian", "¡Todos con mi peinado y mi chaqueta! ¿Y yo quién soy entonces?", "host", "lamenta", "risas"],
 ["maq", "¡Inocente, inocente! ¡Diez pelucas y una noche entera de maquillaje!", "wide", "", "inocente"]]),
O("vaca", "El premio con cuernos", [
 ["adrian", "¡Y el premio de hoy es...!", "host", "arriba", ""],
 ["pub", "¡Muuu!", "wide", "", "ooh"],
 ["adrian", "¡Una vaca! ¡Una vaca de verdad en mitad del plató! ¿Y dónde se la lleva el ganador?", "host", "encoge", "risas"],
 ["jefe", "¡Inocente, inocente! Se llama Margarita y vuelve hoy mismo a su granja.", "wide", "", "inocente"]]),
O("flota", "El que cae hacia arriba", [
 ["adrian", "Número siete, has fallado... ¡ahora cae!", "opp7", "senala", "abreVacia:7"],
 ["adrian", "¿Está subiendo? ¡El concursante está flotando hacia el techo!", "wide", "lamenta", "ooh"],
 ["conc", "¡Adiós, Marco! ¡Desde aquí arriba se ve todo el plató!", "opp7", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡Iba colgado de un arnés! Ahora lo bajamos, tranquilo.", "wide", "", "inocente"]]),
O("pesetas", "El marcador en pesetas", [
 ["adrian", "Miramos el bote... ¿Ochenta y tres mil pesetas? ¿Pesetas?", "host", "senala", "ooh"],
 ["tec", "Es que el ordenador del marcador es de 1995. Se ha reiniciado.", "wide", "", "risas"],
 ["adrian", "¿Y cuánto es eso en reales? Que alguien saque una calculadora, que yo de letras.", "host", "encoge", "risas"],
 ["dir", "¡Inocente, inocente! ¡El marcador está perfecto y en reales!", "wide", "", "inocente"]]),
O("gallinas", "El público con plumas", [
 ["adrian", "Saludamos al público de hoy... que viene... vestido de gallina.", "wide", "saluda", "ooh"],
 ["pub", "¡Cocorocó!", "wide", "", "risas"],
 ["adrian", "¿Todos? ¿Doscientas gallinas? ¿Es una excursión de una granja?", "host", "encoge", "risas"],
 ["reg", "¡Inocente, inocente! ¡Les dijimos que era una fiesta de disfraces temática!", "wide", "", "inocente"]]),
O("encoge", "El plató que encoge", [
 ["adrian", "Volvemos de publicidad y... ¿no está el atril más cerca de las trampillas?", "host", "senala", ""],
 ["adrian", "¡Y el público también! ¡Hay una señora casi sentada en mi silla!", "wide", "lamenta", "ooh"],
 ["pub", "Hola, Marco, ¿me pasas las tarjetas?", "wide", "", "risas"],
 ["tec", "¡Inocente, inocente! ¡En cada pausa acercábamos todo un metro!", "wide", "", "inocente"]]),
O("helado", "El helado obligatorio", [
 ["conc", "Yo no contesto ni una pregunta más sin un helado de fresa.", "opp3", "", "ooh"],
 ["adrian", "Esto es un concurso, no una heladería. Venga, la pregunta...", "host", "habla", ""],
 ["pub", "¡Tilín, tilín! ¡Helados, helados!", "wide", "", "risas"],
 ["adrian", "¿Ha entrado una furgoneta de helados en el plató? ¡Por la puerta de carga!", "wide", "lamenta", "risas"],
 ["dir", "¡Inocente, inocente! ¡Y hay helado para todos, Marco incluido!", "wide", "", "inocente"]]),
O("charanga", "La charanga del concursante", [
 ["adrian", "Respuesta correcta, número dos.", "opp2", "aplaude", ""],
 ["pub", "¡Chunda, chunda, chunda! ¡Tarará, tarará!", "wide", "", "aplauso"],
 ["adrian", "¿Se ha traído una charanga? ¿Van a tocar con cada acierto?", "host", "encoge", "risas"],
 ["conc", "Y con cada fallo, una marcha fúnebre. Es lo justo.", "opp2", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡La charanga es del pueblo de Toni!", "wide", "", "inocente"]]),
O("hipnosis", "El hipnotizador", [
 ["conc", "Marco, mira este péndulo. Cuando oigas la palabra «pregunta», cacarearás.", "opp9", "", "ooh"],
 ["adrian", "Qué tontería. Bueno, vamos con la siguiente pregunta... ¡Cocorocó!", "host", "encoge", "risas"],
 ["adrian", "¡No puede ser! A ver: preg... ¡Cocorocó! ¡Ayuda!", "host", "lamenta", "risas"],
 ["dir", "¡Inocente, inocente! ¡El cacareo lo ponía Rober por tu micrófono!", "wide", "", "inocente"]]),
O("estatua", "La estatua viviente", [
 ["adrian", "Número uno, ¿estás preparado? ¿Número uno?", "opp1", "habla", ""],
 ["adrian", "No parpadea. No respira. ¿Está bien este señor?", "host", "lamenta", "ooh"],
 ["pub", "¡Échale una moneda, Marco!", "wide", "", "risas"],
 ["adrian", "Toma, una moneda... ¡Se mueve! ¡Ahora hace una reverencia!", "host", "aplaude", "risas"],
 ["reg", "¡Inocente, inocente! ¡Es estatua viviente en la Gran Vía!", "wide", "", "inocente"]]),
O("ascensor", "La trampilla ascensor", [
 ["adrian", "Número diez, ¡ahora cae!", "opp10", "senala", "cae:10"],
 ["adrian", "Ya está, eliminado. Seguimos con el... ¿Qué hace otra vez aquí?", "opp10", "lamenta", "ooh"],
 ["conc", "Es que abajo hay un ascensor y me ha devuelto arriba. Planta plató.", "opp10", "", "risas"],
 ["tec", "¡Inocente, inocente! ¡Le subimos por la escalera de atrás en diez segundos!", "wide", "", "inocente"]])
);
EX_DATOS.tomas.push(
O("boli", "El boli que explota", [
 ["adrian", "Apunto la puntuación... ¡Ay! ¡Me ha explotado el boli!", "host", "lamenta", "claqueta:2"],
 ["adrian", "Tengo la camisa azul. Bueno, más azul. Y la mano. Y la nariz.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Nuria, al plató con toallitas. Muchas toallitas.", "wide", "", "corten"]]),
O("cremallera", "La cremallera", [
 ["adrian", "Buenas noches y bienvenidos a...", "host", "saluda", "claqueta:1"],
 ["reg", "Marco... psst... la bragueta.", "wide", "", "risas"],
 ["adrian", "¿La qué? ¡Ay! ¡Repetimos, repetimos, que no ha pasado nada!", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Y que esa cremallera suba antes que el telón.", "wide", "", "corten"]]),
O("gafas_sol", "Las gafas de sol", [
 ["adrian", "Hoy veo el plató un poco oscuro. ¿Habéis bajado las luces?", "host", "senala", "claqueta:3"],
 ["tec", "No, Marco. Llevas puestas las gafas de sol.", "wide", "", "tomafalsa"],
 ["adrian", "¡Con razón todos los concursantes me parecían tan serios!", "host", "encoge", "risas"],
 ["dir", "¡Corten! Esto no es la playa, Marco.", "wide", "", "corten"]]),
O("calcetines", "Los calcetines", [
 ["tec", "Cámara cuatro, plano de los pies del presentador.", "wide", "", "claqueta:4"],
 ["adrian", "¿Por qué enfocáis mis pies? ¡Ah! Un calcetín de rayas y otro de lunares.", "host", "lamenta", "tomafalsa"],
 ["adrian", "Es la moda. Se lleva mucho. Bueno, se lo lleva mi lavadora.", "host", "encoge", "risas"],
 ["dir", "¡Corten! Vestuario, unos calcetines iguales, por favor.", "wide", "", "corten"]]),
O("gol", "El gol del pinganillo", [
 ["adrian", "El concursante piensa su respuesta... silencio absoluto...", "host", "habla", "claqueta:5"],
 ["adrian", "¡GOOOOL! ¡Gol del Betis!", "host", "arriba", "tomafalsa"],
 ["tec", "Perdón, se me ha cruzado la radio con el pinganillo.", "wide", "", "risas"],
 ["dir", "¡Corten! Rober, el fútbol en tu casa.", "wide", "", "corten"]]),
O("grua", "La cámara grúa", [
 ["adrian", "Y desde aquí arriba nos acompaña nuestra cámara grúa...", "host", "senala", "claqueta:2"],
 ["adrian", "¡Que viene directa! ¡Que me da! ¡Me ha despeinado!", "cerca", "lamenta", "tomafalsa"],
 ["tec", "Ups. Es que el mando está al revés.", "wide", "", "risas"],
 ["dir", "¡Corten! Marco, agáchate cuando la veas venir.", "wide", "", "corten"]]),
O("chaqueta", "La chaqueta descosida", [
 ["adrian", "¡Arriba esas manos para el aplauso!", "host", "arriba", "claqueta:1"],
 ["adrian", "¿Ha sonado algo? ¡Se me ha abierto la chaqueta por la espalda!", "host", "lamenta", "tomafalsa"],
 ["pub", "¡Se le ve la camiseta de Bob Esponja!", "wide", "", "risas"],
 ["dir", "¡Corten! Costura de urgencia. Y nada de levantar los brazos.", "wide", "", "corten"]]),
O("respuesta_antes", "La respuesta primero", [
 ["adrian", "Pregunta: la respuesta es «Lisboa». ¿Cuál es la capital de Portugal?", "host", "habla", "claqueta:3"],
 ["conc", "Mmm... difícil... ¿Lisboa?", "opp4", "", "tomafalsa"],
 ["adrian", "¡Correcto! Espera... he leído la tarjeta al revés.", "host", "encoge", "risas"],
 ["dir", "¡Corten! Esa pregunta no vale. Y tú, concursante, disimula mejor.", "wide", "", "corten"]]),
O("globo", "El globo que revienta", [
 ["adrian", "Y en este momento tan emocionante...", "host", "habla", "claqueta:6"],
 ["pub", "¡PUM!", "wide", "", "ooh"],
 ["adrian", "¡Al suelo todos! ¿Qué ha sido? ¿Un globo? ¿Quién trae globos a un concurso?", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Marco, levántate de debajo del atril, que ya pasó.", "wide", "", "corten"]]),
O("fregado", "El suelo recién fregado", [
 ["adrian", "Me acerco a los concursantes y...", "host", "habla", "claqueta:2"],
 ["adrian", "¡Uaaah! ¡Que patino! ¡Que no puedo parar!", "wide", "lamenta", "ooh"],
 ["adrian", "Pues ya que estoy, triple axel. Diez puntos del jurado.", "wide", "arriba", "tomafalsa"],
 ["dir", "¡Corten! ¿Quién ha fregado el plató cinco minutos antes de grabar?", "wide", "", "corten"]]),
O("musica_no", "La música que no llega", [
 ["adrian", "¡Y aquí llega la música de la tensión!", "host", "arriba", "claqueta:4"],
 ["adrian", "...", "host", "encoge", "silencio"],
 ["adrian", "La música... de la tensión... que llega... algún día.", "host", "habla", "tomafalsa"],
 ["dir", "¡Corten! Rober, despierta, que te toca.", "wide", "", "corten"]]),
O("fuera_plano", "Fuera de plano", [
 ["adrian", "Y ahora nos vamos hacia la derecha...", "host", "senala", "claqueta:1"],
 ["tec", "Marco, la derecha de cámara es tu izquierda. Te has ido del plano.", "wide", "", "tomafalsa"],
 ["adrian", "¿Y ahora? ¿Se me ve? ¿Se me ve una oreja al menos?", "wide", "lamenta", "risas"],
 ["dir", "¡Corten! Te pintamos una flecha en el suelo.", "wide", "", "corten"]]),
O("acento", "El acento pegadizo", [
 ["conc", "Hola, Marco, yo vengo de Cádiz, quillo.", "opp5", "", "claqueta:3"],
 ["adrian", "Qué arte, quillo. Pues vamo' a juga', ¿eh? Que la pregunta e' mu' fácil.", "host", "habla", "risas"],
 ["adrian", "¿Por qué hablo así? ¡Si yo soy de Madrid!", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Marco, que esto no es un concurso de imitaciones.", "wide", "", "corten"]]),
O("once", "La trampilla once", [
 ["adrian", "Contamos a los concursantes: uno, dos, tres... nueve, diez... ¡y once!", "wide", "senala", "claqueta:5"],
 ["reg", "Marco, solo hay diez trampillas. El once es el de la fregona.", "wide", "", "tomafalsa"],
 ["maq", "Hola. Yo solo pasaba.", "wide", "", "risas"],
 ["dir", "¡Corten! Que salga el señor de la fregona, por favor.", "wide", "", "corten"]]),
O("humo", "Demasiado humo", [
 ["tec", "Damos humo para la entrada del presentador.", "wide", "", "claqueta:2"],
 ["adrian", "¡Buenas noches! ¿Hay alguien? ¡No veo a nadie! ¿Esto es el plató o Londres?", "wide", "lamenta", "tomafalsa"],
 ["pub", "¡Marco, estamos aquí! ¡Sigue mi voz!", "wide", "", "risas"],
 ["dir", "¡Corten! Abrid las puertas, que no encontramos al presentador.", "wide", "", "corten"]]),
O("abrazo", "El abrazo peligroso", [
 ["adrian", "Lo siento mucho, número ocho. Ven, que te doy un abrazo de despedida.", "opp8", "saluda", "claqueta:6"],
 ["adrian", "¡Que se abre! ¡Que me caigo contigo! ¡Suéltame, suéltame!", "hole8", "lamenta", "ooh"],
 ["conc", "¡Es que me has abrazado encima de la trampilla!", "opp8", "", "tomafalsa"],
 ["dir", "¡Corten! Las despedidas, de lejos.", "wide", "", "corten"]]),
O("boli_clic", "El clic del bolígrafo", [
 ["adrian", "Clic, clic. Pregunta número... clic... seis. Clic.", "host", "habla", "claqueta:3"],
 ["tec", "Marco, por los cascos parece que hay una ametralladora de grillos.", "wide", "", "tomafalsa"],
 ["adrian", "Ah, perdón, es un tic. Clic. ¡Uy! Ya lo suelto.", "host", "encoge", "risas"],
 ["dir", "¡Corten! Quitadle ese boli.", "wide", "", "corten"]]),
O("silbato", "El silbato del regidor", [
 ["reg", "¡Fiiiiu!", "wide", "", "claqueta:4"],
 ["conc", "¡Ha pitado! ¡Salida! ¡Corred!", "opp3", "", "ooh"],
 ["adrian", "¡Que no es una carrera! ¡Que volváis a las trampillas!", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Toni, el silbato para el partido de los domingos.", "wide", "", "corten"]]),
O("alarma", "El reloj despertador", [
 ["adrian", "Y la decisión del concursante es...", "host", "habla", "claqueta:5"],
 ["adrian", "Piii, piii. «Hora de la pastilla de la tensión». Esto es mi reloj.", "host", "lamenta", "tomafalsa"],
 ["adrian", "Me la tomo luego, que ahora la tensión la tiene él.", "opp2", "senala", "risas"],
 ["dir", "¡Corten! Modo avión hasta en el reloj, Marco.", "wide", "", "corten"]]),
O("cartel", "El cartel al revés", [
 ["adrian", "¡Bienvenidos a...!", "host", "arriba", "claqueta:1"],
 ["pub", "¡El cartel está al revés!", "wide", "", "ooh"],
 ["adrian", "Ah, pues hoy el programa se llama «¡ogiac arohA!». Suena a pueblo de Islandia.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Diez minutos y escaleras para el cartel.", "wide", "", "corten"]]),
O("aplauso_mal", "El aplauso a destiempo", [
 ["adrian", "Qué pena, el número tres nos deja. Un momento triste para todos...", "opp3", "lamenta", "claqueta:6"],
 ["reg", "Se ha encendido el cartel de «aplausos».", "wide", "", "aplauso"],
 ["adrian", "¡No! ¡Que no es para celebrarlo! ¡Que se ha caído!", "host", "senala", "tomafalsa"],
 ["dir", "¡Corten! Toni, el cartel es el de «oooh», no el de «aplausos».", "wide", "", "corten"]]),
O("eco_corto", "La pregunta interminable", [
 ["adrian", "Pregunta: ¿cuál es el animal que, viviendo en el agua salada y alimentándose de plancton...", "host", "habla", "claqueta:2"],
 ["adrian", "...y pesando unas ciento cincuenta toneladas, y siendo además mamífero y...", "host", "encoge", "risas"],
 ["conc", "Marco, me he olvidado del principio.", "opp6", "", "tomafalsa"],
 ["dir", "¡Corten! ¡Ballena azul! Y que el guionista escriba más cortito.", "wide", "", "corten"]]),
O("micro_mano", "El micrófono de mano", [
 ["adrian", "Te paso el micrófono para que saludes a tu familia...", "opp7", "saluda", "claqueta:3"],
 ["conc", "¡Hola, mamá! ¡Hola, tía Puri! ¡Hola, vecinos del tercero! ¡Hola, panadería Loli!", "opp7", "", "risas"],
 ["adrian", "Ya está, ¿no? ¿No? ¿Me lo devuelves? ¡Que no lo suelta!", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Que alguien recupere ese micrófono.", "wide", "", "corten"]]),
O("pegamento", "Las tarjetas pegadas", [
 ["adrian", "Paso a la siguiente tarjeta... no se separa. Ni esta. ¡Ni esta!", "host", "lamenta", "claqueta:4"],
 ["adrian", "¡Se me han quedado todas pegadas a los dedos! ¡Tengo manos de abanico!", "host", "encoge", "tomafalsa"],
 ["maq", "Perdón, es el pegamento de las pestañas postizas. Se me cayó encima.", "wide", "", "risas"],
 ["dir", "¡Corten! Agua caliente y paciencia.", "wide", "", "corten"]]),
O("palabra_prohibida", "La palabra prohibida", [
 ["reg", "Marco, recuerda: hoy está prohibido decir el nombre de la competencia.", "wide", "", "claqueta:5"],
 ["adrian", "Claro, claro. Esto no es «Pasapalab»... ¡Uy!", "host", "lamenta", "tomafalsa"],
 ["adrian", "Quería decir... «Pasa... la... sal». Que tengo hambre.", "host", "encoge", "risas"],
 ["dir", "¡Corten! Y sin más palabras.", "wide", "", "corten"]]),
O("foco", "El foco caído", [
 ["adrian", "¡Y que se iluminen los concursantes!", "host", "arriba", "claqueta:6"],
 ["tec", "Se ha caído un filtro del foco. Ahora todos se ven verdes.", "wide", "", "tomafalsa"],
 ["adrian", "¡Diez marcianos! ¡Bienvenidos a la Tierra! ¿Qué tal el viaje?", "wide", "saluda", "risas"],
 ["dir", "¡Corten! Rober, sube al peine y quita ese papel.", "wide", "", "corten"]]),
O("taburete", "El presentador bajito", [
 ["reg", "Marco, hoy te ponemos un taburete, que el atril nuevo es más alto.", "wide", "", "claqueta:1"],
 ["adrian", "No me hace falta, que yo llego... de puntillas... casi.", "host", "encoge", "risas"],
 ["adrian", "¡Me he subido y se mueve! ¡Que el taburete tiene ruedas!", "wide", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Taburete sin ruedas. Y sin rencor.", "wide", "", "corten"]])
);
EX_DATOS.fuera.push(
F("flequillo", "El flequillo", "maquillaje", [
 ["maq", "Te recorto un poquito las puntas, Marco. Un milímetro.", "cerca", "", ""],
 ["adrian", "Un milímetro, ¿eh? Que te conozco.", "cerca", "encoge", ""],
 ["maq", "Uy. Bueno... ¿te gustan los flequillos muy cortitos? Están de moda.", "cerca", "", ""],
 ["adrian", "Pásame una gorra. La más grande que tengas.", "cerca", "lamenta", ""]]),
F("apuesta", "La porra de control", "control", [
 ["tec", "Porra de hoy: un euro a que el primero en caer es el número tres.", "cerca", "", ""],
 ["dir", "Yo voy al ocho. Lleva calcetines de la suerte, mala señal.", "cerca", "", ""],
 ["jefe", "¿Qué es esto? ¿Una apuesta en mi programa?", "cerca", "", ""],
 ["jefe", "...Dos reales al cinco. Y no se lo digáis a nadie.", "cerca", "", ""]]),
F("objetos", "Lo que hay bajo las trampillas", "plato", [
 ["reg", "Después de cada temporada vaciamos el foso. Mira lo que ha salido.", "wide", "", ""],
 ["adrian", "Tres paraguas, una dentadura, cuarenta y dos gafas y... ¿un acordeón?", "host", "senala", ""],
 ["reg", "El del acordeón cayó tocando. Lo recuerdo bien.", "wide", "", ""],
 ["adrian", "Pues lo dejamos en objetos perdidos. Al lado de la dentadura.", "host", "encoge", ""]]),
F("pintura", "Recién pintado", "control", [
 ["dir", "¿Por qué huele tanto a pintura en el control?", "cerca", "", ""],
 ["tec", "Han pintado las sillas esta mañana. Me he sentado hace una hora.", "cerca", "", ""],
 ["dir", "¿Y por qué no te levantas?", "cerca", "", ""],
 ["tec", "Porque ya no puedo, Lola. La silla y yo somos uno. Hoy realizo de pie... con silla.", "cerca", "", ""]]),
F("becario", "El primer día del becario", "plato", [
 ["reg", "Este es Hugo, el becario. Hugo, esto son las trampillas.", "wide", "", ""],
 ["conc", "Encantado. ¿Y para qué sirven? ¿Para guardar cosas?", "wide", "", ""],
 ["adrian", "Para guardar concursantes, más o menos.", "host", "encoge", ""],
 ["conc", "Ah. Pues yo me quedo lejos, que hoy es mi primer día.", "wide", "", ""]]),
F("dobles", "El ensayo con dobles", "plato", [
 ["dir", "Ensayo con los dobles de concursantes. Toni, tú haces de abuela de Cuenca.", "wide", "", ""],
 ["reg", "¡Ay, hijo, qué nervios! ¿Esto sale en la tele?", "wide", "", ""],
 ["adrian", "Toni, que lo haces demasiado bien. Me estás dando miedo.", "host", "encoge", ""],
 ["dir", "Que se quede de abuela todo el ensayo. Así practicamos la ternura.", "wide", "", ""]]),
F("perdido", "Marco se pierde", "plato", [
 ["adrian", "¿Hola? Esto no es mi plató... Hay una mesa de telediario.", "host", "lamenta", ""],
 ["reg", "¡Marco! Que te has metido en el plató de informativos. ¡Que están en directo!", "wide", "", ""],
 ["adrian", "Ah... Buenas noches, España. Sin novedad. Me voy.", "host", "saluda", ""],
 ["reg", "Desde mañana te pongo flechas desde el camerino.", "wide", "", ""]]),
F("gafas_rober", "Las gafas de Rober", "control", [
 ["tec", "No encuentro mis gafas. Sin ellas no sé cuál es el botón de la trampilla.", "cerca", "", ""],
 ["dir", "Rober... las llevas en la cabeza.", "cerca", "", ""],
 ["tec", "¿En la cabeza? ¡Qué sitio más raro para guardar unas gafas!", "cerca", "", ""],
 ["dir", "Bájatelas, por lo que más quieras.", "cerca", "", ""]]),
F("musicas", "Elegir la música", "control", [
 ["tec", "Para la caída propongo esta: acordeón y pandereta.", "cerca", "", ""],
 ["dir", "Ni hablar. Eso parece una boda.", "cerca", "", ""],
 ["tec", "¿Y una gaita? ¿Un violín triste? ¿Unos cencerros?", "cerca", "", ""],
 ["dir", "Deja la de siempre, Rober. La de siempre funciona.", "cerca", "", ""]]),
F("foto", "La foto de grupo", "plato", [
 ["reg", "¡Foto de equipo! Todos juntos detrás de las trampillas.", "wide", "", ""],
 ["adrian", "No cabemos. Nuria, encógete. Rober, quita el codo de mi cara.", "host", "lamenta", ""],
 ["reg", "Y al contar tres, decimos «¡patata!». Uno, dos...", "wide", "", ""],
 ["adrian", "¡Patata! ¿Quién ha pisado el botón? ¡Se ha abierto una trampilla bajo Toni!", "host", "senala", ""]]),
F("colchones", "Los colchones del foso", "plato", [
 ["reg", "Revisión de colchones del foso. Voy a saltar a ver si están blanditos.", "wide", "", ""],
 ["adrian", "Toni, ¿estás bien? ¿Toni?", "host", "habla", ""],
 ["reg", "¡Están blanditos! ¡Tanto que me quedo un rato aquí, que se duerme de maravilla!", "wide", "", ""],
 ["adrian", "Despiértale en diez minutos, que hay programa.", "host", "encoge", ""]]),
F("apodo", "El mote del presentador", "control", [
 ["tec", "Votación: ¿qué mote le ponemos a Marco? Yo digo «el Trampillas».", "cerca", "", ""],
 ["dir", "Yo, «el Señor de los Agujeros».", "cerca", "", ""],
 ["adrian", "Os oigo, que tengo el pinganillo puesto.", "cerca", "lamenta", ""],
 ["tec", "Pues gana «el Pinganillo». Por unanimidad.", "cerca", "", ""]]),
F("planta", "La planta del camerino", "maquillaje", [
 ["maq", "Buenos días, Rosita. ¿Has dormido bien? Toma tu agüita.", "cerca", "", ""],
 ["adrian", "Nuria... ¿estás hablando con un cactus?", "cerca", "encoge", ""],
 ["maq", "Se llama Rosita y es la que mejor escucha de todo el equipo.", "cerca", "", ""],
 ["adrian", "Hola, Rosita. Hoy estás muy... pinchuda.", "cerca", "saluda", ""]]),
F("subtitulos", "Los subtítulos", "control", [
 ["dir", "A ver los subtítulos del último programa... «Ahora caigo» puso «Acierte o se caiga».", "cerca", "", ""],
 ["tec", "Y «trampilla» salió como «tortilla». Toda la noche.", "cerca", "", ""],
 ["dir", "«El concursante cae por la tortilla». Precioso.", "cerca", "", ""],
 ["tec", "Hemos recibido cartas pidiendo la receta.", "cerca", "", ""]]),
F("sorteo", "El sorteo de trampillas", "plato", [
 ["reg", "Concursantes, cada uno saca una pajita. La más corta va a la trampilla uno.", "wide", "", ""],
 ["conc", "¡Me ha tocado la corta! ¿Puedo cambiarla por una larga?", "wide", "", ""],
 ["reg", "No. Pero te puedes quedar la pajita de recuerdo.", "wide", "", ""],
 ["conc", "Pues me la llevo. Para el zumo de después.", "wide", "", ""]]),
F("espejo", "El espejo sin luz", "maquillaje", [
 ["maq", "Se han fundido las bombillas del espejo. Te maquillo con la linterna del móvil.", "cerca", "", ""],
 ["adrian", "¿Y se nota mucho?", "cerca", "encoge", ""],
 ["maq", "Un poquito. Tienes media cara morena y media cara de fantasma.", "cerca", "", ""],
 ["adrian", "Pues hoy me grabáis solo de perfil. El bueno.", "cerca", "lamenta", ""]]),
F("audiencias", "Las audiencias", "control", [
 ["jefe", "¡Ya están las audiencias de ayer! ¡Dieciocho por ciento!", "cerca", "", ""],
 ["dir", "¿Y a qué hora subimos más?", "cerca", "", ""],
 ["jefe", "Cuando el señor del acordeón cayó tocando. Pico máximo.", "cerca", "", ""],
 ["tec", "Pues que cada programa caiga uno con un instrumento.", "cerca", "", ""]]),
F("autografos", "Autógrafos a la salida", "plato", [
 ["pub", "¡Marco, Marco! ¡Fírmame en la gorra!", "wide", "", ""],
 ["adrian", "Claro. ¿Para quién la dedico?", "host", "aplaude", ""],
 ["pub", "Para mi abuela, que le gusta más el presentador de antes.", "wide", "", ""],
 ["adrian", "Pues... «Para la abuela, con cariño. Del de ahora».", "host", "encoge", ""]])
);
})();
