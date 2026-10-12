const EX_DATOS = {
"personajes": {
"adrian": [
"Marco Vitale",
"davefx"
],
"dir": [
"Lola · directora",
"daniela"
],
"reg": [
"Toni · regidor",
"carlfm"
],
"tec": [
"Rober · sonido",
"ald"
],
"maq": [
"Nuria · maquillaje",
"sharvard"
],
"conc": [
"Concursante",
"sharvard"
],
"jefe": [
"«El jefe»",
"ald"
],
"pub": [
"Público",
"carlfm"
]
},
"oculta": [
{
"id": "trampilla",
"titulo": "La trampilla que no se abre",
"pasos": [
[
"adrian",
"¡Y el número tres... cae!",
"hole3",
"senala",
"trampillaNo:3"
],
[
"adrian",
"¿Cómo? ¿No cae? ¡Que caiga el número tres!",
"host",
"lamenta",
"trampillaNo:3"
],
[
"conc",
"Yo de aquí no me muevo, Marco. Esta trampilla está de vacaciones.",
"opp3",
"",
""
],
[
"adrian",
"Toni, por favor, ¿alguien puede mirar la trampilla? Le doy un pisotón y ya está.",
"host",
"habla",
"ooh"
],
[
"reg",
"Marco, es que hoy las trampillas están en huelga. Piden más aplausos.",
"wide",
"",
"risas"
],
[
"adrian",
"¿En huelga? ¿Las trampillas? Pero si yo las trato genial...",
"host",
"encoge",
""
],
[
"dir",
"¡Inocente, inocente! ¡Estás en la cámara oculta, Marco!",
"wide",
"",
"inocente"
],
[
"adrian",
"¡No puede ser! ¡Me la habéis colado del todo! ¡Qué malos sois!",
"host",
"aplaude",
"risas"
]
]
},
{
"id": "rimas",
"titulo": "El concursante que responde en verso",
"pasos": [
[
"adrian",
"Pregunta para el siete: ¿cuál es la capital de Francia?",
"opp7",
"senala",
""
],
[
"conc",
"Es París, sin dudarlo, con su torre para mirarlo.",
"opp7",
"",
"risas"
],
[
"adrian",
"Correcto... pero no hace falta rimar. Siguiente: ¿cuántas patas tiene una araña?",
"host",
"habla",
""
],
[
"conc",
"Ocho patas tiene la araña, y teje su red con mucha maña.",
"opp7",
"",
"risas"
],
[
"adrian",
"Vale, esto ya es raro. ¿Usted siempre habla así?",
"host",
"encoge",
""
],
[
"conc",
"Desde la cuna hablo rimando, y a Marco lo estoy liando.",
"opp7",
"",
"risas"
],
[
"reg",
"¡Inocente, inocente! ¡Es un actor, Marco! ¡Cámara oculta!",
"wide",
"",
"inocente"
],
[
"adrian",
"¡Ya decía yo! Con lo bien que rimaba, me tenía preocupado.",
"host",
"aplaude",
"risas"
]
]
},
{
"id": "tabla",
"titulo": "La tabla de premios falsa",
"pasos": [
[
"adrian",
"¡Vamos a ver la tabla de premios de hoy!",
"host",
"senala",
""
],
[
"adrian",
"¿Una croqueta? ¿Un abrazo? ¿Cincuenta céntimos? ¿Esto qué es?",
"host",
"lamenta",
"tablaFalsa"
],
[
"tec",
"Marco, es que este mes andamos justos de presupuesto.",
"wide",
"",
"risas"
],
[
"adrian",
"Pero no podemos dar una croqueta de premio. ¡Por lo menos que sean dos!",
"host",
"habla",
"risas"
],
[
"dir",
"¡Inocente, inocente! ¡La tabla es de mentira!",
"wide",
"",
"inocente"
],
[
"adrian",
"Menos mal. Ya me veía yo repartiendo croquetas por el plató.",
"host",
"aplaude",
"risas"
]
]
},
{
"id": "silencio",
"titulo": "El público mudo",
"pasos": [
[
"adrian",
"¡Buenas tardes! ¡Bienvenidos a ¡Ahora caigo!!",
"host",
"saluda",
"silencio"
],
[
"adrian",
"¿Hola? Público, ¿estáis ahí? Un aplauso, por favor.",
"wide",
"habla",
"silencio"
],
[
"adrian",
"Qué raro. Normalmente aplaudís hasta cuando estornudo.",
"host",
"encoge",
"silencio"
],
[
"adrian",
"Rober, ¿se han ido los micrófonos de la grada?",
"host",
"habla",
""
],
[
"tec",
"Los micrófonos funcionan perfectamente, Marco.",
"wide",
"",
"silencio"
],
[
"reg",
"¡Inocente, inocente! ¡El público estaba compinchado!",
"wide",
"",
"inocente"
],
[
"adrian",
"¡Sois los mejores! Y los más malos. ¡Ahora sí, un aplauso!",
"host",
"aplaude",
"aplauso"
]
]
},
{
"id": "jefe",
"titulo": "La llamada del jefe",
"pasos": [
[
"adrian",
"Perdonad, me llaman. Es el número del jefe de la cadena...",
"host",
"habla",
"tel"
],
[
"jefe",
"Marco, a partir de mañana el programa se llama ¡Ahora me levanto!",
"host",
"",
""
],
[
"adrian",
"¿Ahora me levanto? Pero si la gracia es que se caen...",
"host",
"lamenta",
"ooh"
],
[
"jefe",
"Y las trampillas serán colchones. Por seguridad. Y tú presentarás en pijama.",
"host",
"",
"risas"
],
[
"adrian",
"¿En pijama? Bueno... si es de rayas, a lo mejor me lo pienso.",
"host",
"encoge",
"risas"
],
[
"dir",
"¡Inocente, inocente! ¡Era Rober poniendo voz de jefe!",
"wide",
"",
"inocente"
],
[
"adrian",
"¡Rober! ¡Te voy a poner en la trampilla número uno!",
"host",
"senala",
"risas"
]
]
},
{
"id": "pregunta",
"titulo": "La pregunta imposible",
"pasos": [
[
"adrian",
"A ver, leo la tarjeta: ¿cuántos granos de arena hay en la playa de la Concha?",
"host",
"habla",
""
],
[
"adrian",
"Un momento, esto no hay quien lo sepa. ¿Quién ha escrito esta pregunta?",
"host",
"lamenta",
"ooh"
],
[
"conc",
"Yo sé la respuesta: siete mil millones y tres.",
"opp5",
"",
"risas"
],
[
"adrian",
"¿Y tres? ¿Los ha contado usted? ¡Pues es correcto según la tarjeta!",
"host",
"senala",
"risas"
],
[
"reg",
"¡Inocente, inocente! ¡Todas las tarjetas de hoy eran de broma!",
"wide",
"",
"inocente"
],
[
"adrian",
"¡Lo sabía! Bueno, no lo sabía. Pero me lo imaginaba.",
"host",
"aplaude",
"risas"
]
]
}
],
"tomas": [
{
"id": "lio",
"titulo": "Bienvenidos a... ¿Ahora como?",
"pasos": [
[
"adrian",
"¡Buenas tardes y bienvenidos a ¡Ahora como!",
"host",
"saluda",
"claqueta:1"
],
[
"adrian",
"¿Ahora como? ¡Ahora caigo! Es que tengo hambre.",
"host",
"encoge",
"tomafalsa"
],
[
"dir",
"¡Corten! ¡Toma dos!",
"wide",
"",
"corten"
]
]
},
{
"id": "antes",
"titulo": "La trampilla impaciente",
"pasos": [
[
"adrian",
"Y ahora, con mucho suspense, vamos a ver quién...",
"host",
"habla",
"claqueta:3"
],
[
"adrian",
"¡Pero si todavía no he terminado la frase!",
"opp2",
"lamenta",
"cae:2"
],
[
"dir",
"¡Corten! ¿Quién ha tocado el botón?",
"wide",
"",
"corten"
],
[
"tec",
"Perdón, perdón, se me ha ido el codo.",
"wide",
"",
"tomafalsa"
]
]
},
{
"id": "equivocada",
"titulo": "Se cae el que no era",
"pasos": [
[
"adrian",
"Ha fallado el número cuatro... ¡así que cae el número cuatro!",
"hole4",
"senala",
"claqueta:2"
],
[
"adrian",
"¡No, no, no! ¡Ese es el cinco! ¡Que vuelva el cinco!",
"opp5",
"lamenta",
"cae:5"
],
[
"dir",
"¡Corten! Que alguien ayude al cinco a salir.",
"wide",
"",
"corten"
],
[
"adrian",
"Lo siento muchísimo. Te invito a un café cuando salgas del agujero.",
"host",
"gracias",
"tomafalsa"
]
]
},
{
"id": "trabalenguas",
"titulo": "El trabalenguas",
"pasos": [
[
"adrian",
"El rival rápido rueda raudo por la trampilla tramposa... trampi... tramposilla...",
"host",
"habla",
"claqueta:4"
],
[
"adrian",
"¿Quién escribe estos textos? ¡Me he hecho un nudo en la lengua!",
"host",
"encoge",
"tomafalsa"
],
[
"dir",
"¡Corten! Toma cinco, Marco. Y despacito.",
"wide",
"",
"corten"
]
]
},
{
"id": "risa",
"titulo": "La risa contagiosa",
"pasos": [
[
"adrian",
"Ha llegado el momento más serio del programa...",
"host",
"habla",
"claqueta:6"
],
[
"adrian",
"Perdón... es que el regidor está haciendo caras... ja ja ja.",
"host",
"aplaude",
"risas"
],
[
"reg",
"Yo no he hecho nada, Marco. Solo he puesto esta cara.",
"wide",
"",
"risas"
],
[
"dir",
"¡Corten! Toni, fuera del plano, por favor.",
"wide",
"",
"corten"
]
]
},
{
"id": "nombre",
"titulo": "El nombre equivocado",
"pasos": [
[
"adrian",
"Damos la bienvenida a nuestro concursante... ¡Bartolomeo!",
"opp8",
"senala",
"claqueta:2"
],
[
"conc",
"Me llamo Javi, Marco.",
"opp8",
"",
"risas"
],
[
"adrian",
"¿Javi? ¡Pues aquí pone Bartolomeo! Esto me lo han cambiado.",
"host",
"lamenta",
"tomafalsa"
],
[
"dir",
"¡Corten! ¡Toma tres!",
"wide",
"",
"corten"
]
]
},
{
"id": "tropiezo",
"titulo": "El escalón traicionero",
"pasos": [
[
"adrian",
"¡Entro al plató con mucha energía!",
"wide",
"saluda",
"claqueta:1"
],
[
"adrian",
"¡Uy! ¡El escalón! Casi me caigo sin trampilla.",
"host",
"tropieza",
"ooh"
],
[
"dir",
"¡Corten! ¿Estás bien, Marco?",
"wide",
"",
"corten"
],
[
"adrian",
"Perfectamente. El escalón y yo ya somos amigos.",
"host",
"arriba",
"tomafalsa"
]
]
},
{
"id": "estornudo",
"titulo": "El estornudo",
"pasos": [
[
"adrian",
"Para llevarse el bote hay que responder... a... ¡aaachís!",
"host",
"habla",
"claqueta:7"
],
[
"adrian",
"Perdón. Son los focos, que me dan alergia. O el confeti.",
"host",
"encoge",
"risas"
],
[
"dir",
"¡Corten! ¡Salud! Toma ocho.",
"wide",
"",
"corten"
]
]
},
{
"id": "claqueta",
"titulo": "La claqueta rebelde",
"pasos": [
[
"reg",
"¡Ahora caigo, plano uno, toma uno!",
"wide",
"",
"claqueta:1"
],
[
"reg",
"¡Ay, el dedo! ¡Me he pillado el dedo con la claqueta!",
"wide",
"",
"ooh"
],
[
"adrian",
"Toni, que la claqueta se cierra, no se muerde.",
"host",
"aplaude",
"risas"
],
[
"dir",
"¡Corten! Y que alguien traiga una tirita.",
"wide",
"",
"corten"
]
]
}
],
"fuera": [
{
"id": "maquillaje",
"titulo": "Sala de maquillaje",
"lugar": "maquillaje",
"pasos": [
[
"maq",
"Marco, quieto un momento, que te pongo un poco de polvos para los brillos.",
"cerca",
"",
""
],
[
"adrian",
"Nuria, con los focos del plató brillo más que el bote.",
"cerca",
"encoge",
""
],
[
"maq",
"Por eso. Y peinado listo. Hoy vas guapísimo.",
"cerca",
"",
""
],
[
"adrian",
"Gracias. Si me caigo por una trampilla, por lo menos que sea bien peinado.",
"cerca",
"aplaude",
""
]
]
},
{
"id": "ensayo",
"titulo": "Ensayo general",
"lugar": "plato",
"pasos": [
[
"reg",
"Silencio, que ensayamos la entrada. Marco, tú desde el centro.",
"wide",
"",
""
],
[
"adrian",
"Buenas tardes, bla bla bla, bienvenidos, bla bla bla, ¡que comience el duelo!",
"host",
"saluda",
""
],
[
"dir",
"Perfecto. Hoy en el ensayo te dejo decir bla bla bla. En directo, no.",
"wide",
"",
""
],
[
"adrian",
"Tranquila, Lola. En directo me lo invento todo... digo, me lo sé todo.",
"host",
"habla",
""
]
]
},
{
"id": "tecnicos",
"titulo": "Los técnicos",
"lugar": "plato",
"pasos": [
[
"tec",
"Probando, probando. Uno, dos, tres. ¿Se me oye en la grada?",
"wide",
"",
""
],
[
"reg",
"Se te oye hasta en el aparcamiento, Rober.",
"wide",
"",
""
],
[
"tec",
"Ahora las trampillas. Prueba de la número seis.",
"hole6",
"",
"abreVacia:6"
],
[
"tec",
"Funciona. Menos mal que hoy no había nadie encima.",
"wide",
"",
""
]
]
},
{
"id": "pausa",
"titulo": "Charla en la pausa publicitaria",
"lugar": "plato",
"pasos": [
[
"reg",
"¡Estamos en publicidad! Tres minutos.",
"wide",
"",
""
],
[
"adrian",
"¿Qué tal lo estoy haciendo? Sed sinceros.",
"host",
"habla",
""
],
[
"conc",
"Muy bien, Marco. Pero me tiemblan las piernas encima de la trampilla.",
"opp1",
"",
""
],
[
"adrian",
"Eso es normal. A mí me temblaban el primer día. Y el segundo. Y hoy también.",
"host",
"encoge",
""
],
[
"reg",
"¡Volvemos en diez segundos! ¡Todos a sus puestos!",
"wide",
"",
""
]
]
},
{
"id": "directora",
"titulo": "Con la directora",
"lugar": "control",
"pasos": [
[
"dir",
"Marco, en el próximo bloque quiero más emoción en la moneda.",
"cerca",
"",
""
],
[
"adrian",
"¿Más emoción? Si ya hago así con las manos y pongo cara de sorpresa.",
"cerca",
"senala",
""
],
[
"dir",
"Pues pon la cara de sorpresa dos veces. Y no te olvides de mirar a la cámara tres.",
"cerca",
"",
""
],
[
"adrian",
"Cámara tres. Cara de sorpresa doble. Apuntado. ¿Y si me equivoco?",
"cerca",
"encoge",
""
],
[
"dir",
"Si te equivocas, sale en las tomas falsas. Todos contentos.",
"cerca",
"",
""
]
]
},
{
"id": "espera",
"titulo": "Los concursantes esperando",
"lugar": "plato",
"pasos": [
[
"conc",
"¿Cuánto falta para empezar? Llevo una hora repasando capitales.",
"opp4",
"",
""
],
[
"conc",
"Yo me he aprendido todos los ríos de España. Por si acaso.",
"opp9",
"",
""
],
[
"adrian",
"Tranquilos, chicos. Respirad hondo y pensad que esto es un juego.",
"wide",
"saluda",
""
],
[
"conc",
"Un juego con agujero, Marco.",
"opp4",
"",
""
],
[
"adrian",
"Bueno, sí. Un juego con agujero. Pero con mucho cariño.",
"host",
"aplaude",
""
]
]
}
],
"copres": {
"invita": [
"¡Hoy tengo una sorpresa! Necesito un copresentador. ¿Quién se anima?",
"Me siento un poco solo aquí arriba. ¡Vamos a invitar a alguien a presentar conmigo!",
"¡Atención! Hoy alguien va a presentar conmigo. ¡Un aplauso para nuestro invitado!"
],
"gracias": [
"¡Un aplauso enorme para mi copresentador!",
"¡Gracias por ayudarme! Ya puedes volver a tu sitio.",
"¡Qué bien lo has hecho! Te contrato para mañana."
],
"invitados": [
{
"id": "manolo",
"tipo": "publico",
"nombre": "Manolo · público",
"voz": "carlfm",
"shirt": 2779903,
"ayuda": "lee",
"lineas": [
"¡Hola a todos! Mi mujer no se lo va a creer: ¡estoy en la tele!",
"Yo leo la pregunta: ¿cuál es el planeta más grande del sistema solar? ¡Júpiter!",
"¡Ha sido un honor! ¡Saludos a mi barrio!"
]
},
{
"id": "carmen",
"tipo": "publico",
"nombre": "Carmen · público",
"voz": "daniela",
"shirt": 16734880,
"ayuda": "trampilla",
"lineas": [
"¡Qué nervios! Nunca había estado tan cerca de una trampilla.",
"Yo abro esta trampilla. ¡Tres, dos, uno... ahora cae!",
"¡Gracias, Marco! ¡Me llevo el recuerdo para siempre!"
]
},
{
"id": "concursante",
"tipo": "concursante",
"nombre": "",
"voz": "sharvard",
"ayuda": "lee",
"lineas": [
"¿Yo? ¿De copresentador? ¡Pero si me tiemblan las piernas!",
"Bueno, os leo una: ¿cuántos días tiene un año bisiesto? ¡Trescientos sesenta y seis!",
"Vuelvo a mi trampilla. ¡Y que no se abra todavía!"
]
},
{
"id": "luis",
"tipo": "invitado",
"nombre": "Luis · catering",
"voz": "ald",
"shirt": 16777215,
"ayuda": "despide",
"lineas": [
"Venía a traer los bocadillos y me han dicho que presente. ¡Allá voy!",
"Yo me encargo de la despedida: ¡muchas gracias por vernos, y hasta la próxima!",
"¡Y ahora, a por los bocadillos!"
]
},
{
"id": "toni",
"tipo": "invitado",
"nombre": "Toni · regidor",
"voz": "carlfm",
"shirt": 1710618,
"ayuda": "trampilla",
"lineas": [
"¿Yo delante de la cámara? ¡Pero si siempre estoy detrás!",
"Abro una trampilla vacía, por si alguien quiere probar. ¡Ahora cae!",
"Vuelvo a mi sitio, que esto da mucho calor."
]
}
]
},
"paseo": {
"bienvenida": "¡Bienvenido al paseo! Sube a las gradas por las escaleras, o sal a la calle por la puerta de salida.",
"calle": "Esto es la calle de los estudios. Para volver, entra por la puerta del edificio.",
"vuelta": "¡De vuelta en el plató!"
}
};
