  // ---------- ✨ Hacer mis propias promos: guionista automático (sin conexión) ----------
  // Lee la descripción en palabras normales y saca nombres, fechas, horas, premios, tema y tono; escribe el guion
  // (título, 3 líneas, día, hora y texto de la voz en off) con plantillas y gramática propias. Opcional: IA en línea gratis.
  const IA = (() => {
    const quita = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const rnd = sd => () => { sd = (sd + 0x6D2B79F5) | 0; let t = Math.imul(sd ^ (sd >>> 15), 1 | sd); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const DIAS = { lunes: 'lunes', martes: 'martes', miercoles: 'miércoles', jueves: 'jueves', viernes: 'viernes', sabado: 'sábado', domingo: 'domingo' };
    const DIAS_PT = { lunes: 'lunedì', martes: 'martedì', miercoles: 'mercoledì', jueves: 'giovedì', viernes: 'venerdì', sabado: 'sabato', domingo: 'domenica' };
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const MESES_PT = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    const NUM = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
    const NUM_PT = ['zero', "l'una", 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici'];
    const MIN = { 0: '', 15: ' y cuarto', 30: ' y media', 45: ' menos cuarto' };
    const TEMAS = [ // [clave, palabras, nombre ES, nombre PT, tono por defecto]
      ['navidad', /navidad|nochebuena|navidena|reyes|belen|papa noel|natal/, 'el especial de Navidad', "lo speciale di Natale", 'emotivo'],
      ['nochevieja', /nochevieja|fin de ano|uvas|campanadas|ano nuevo|reveillon/, 'el especial de Nochevieja', 'lo speciale di Capodanno', 'fiesta'],
      ['halloween', /halloween|terror|miedo|zombi|fantasma|bruja|monstruo|susto/, 'el especial de terror', 'lo speciale horror', 'misterio'],
      ['verano', /verano|playa|vacaciones|piscina|calor|verao/, 'el especial de verano', "lo speciale d'estate", 'fiesta'],
      ['famosos', /famos|estrella|celebrit|vip|invitad/, 'el especial con famosos', 'lo speciale con i vip', 'epico'],
      ['final', /gran final|la final|final de temporada|ultimo programa|despedida/, 'la gran final', 'la grande finale', 'epico'],
      ['estreno', /estreno|nueva temporada|vuelve|regresa|primer programa|estreia/, 'el gran estreno', 'la grande prima puntata', 'epico'],
      ['aniversario', /aniversario|cumple|programa \d+|\d+ programas|celebra/, 'el programa aniversario', 'la puntata anniversario', 'fiesta'],
      ['sanvalentin', /san valentin|amor|parejas|enamorad|romant|namorad/, 'el especial de San Valentín', 'lo speciale di San Valentino', 'emotivo'],
      ['futuro', /futur|ano 3000|robot|holograma|espacio|marte|galaxia|nave/, 'el especial del futuro', 'lo speciale del futuro', 'divertido'],
      ['ninos', /nino|ninos|infantil|familia|peques|criancas/, 'el especial en familia', 'lo speciale in famiglia', 'divertido'],
    ];
    const TONOS = [['divertido', /divert|risa|humor|gracios|loco|locura|cachond|comic|risas|engracad/], ['epico', /epic|emocionante|intens|tension|adrenalina|grande|enorme|histor|nunca visto|impresionante/],
      ['emotivo', /emoti|emocion|corazon|lagrima|bonito|tierno|familia|recuerdo|saudade/], ['misterio', /misterio|secreto|sorpresa|enigma|oscur|nadie sabe|suspense/], ['fiesta', /fiesta|fiest|baile|musica|celebr|party|festa/], ['urgente', /hoy|esta noche|ahora|no te lo pierdas|ultima|urgente|ya/]];
    const STOP = new Set('El La Los Las Un Una Unos Unas Y O De Del Al En Con Por Para Que Quiero Hazme Haz Una Promo Esta Este Ese Esa Lunes Martes Miércoles Jueves Viernes Sábado Domingo Navidad Nochevieja Halloween Hoy Mañana Noche Programa Especial Gran Final Ahora Caigo Millonario Cazador Cifras Letras Caduta Libera Acerte Caia Kara Sevda Me Mi Mis Su Sus Se Si No Es A Ante Bajo Desde Hasta Sin Sobre Tras Muy Más Pero Como Cuando Donde Quiere Quieren Grok Bot San Valentín Año Euros Promo Promos Voz Bueno Vale Hola Oye Pon Dile Diga Que Lo Le Nos Il Lo Gli Le Di Da Con Su Per Tra Fra Fammi Voglio Questo Questa Prossimo Lunedì Martedì Mercoledì Giovedì Venerdì Sabato Domenica Stasera Domani Natale Capodanno Puntata Caduta Libera Speciale'.split(' '));
    const IT2ES = t => t.replace(/\blunedi\b/g,'lunes').replace(/\bmartedi\b/g,'martes').replace(/\bmercoledi\b/g,'miercoles').replace(/\bgiovedi\b/g,'jueves').replace(/\bvenerdi\b/g,'viernes').replace(/\bsabato\b/g,'sabado').replace(/\bdomenica\b/g,'domingo').replace(/\bstasera\b/g,'esta noche').replace(/\bdomani\b/g,'manana').replace(/\bprossimo\b/g,'proximo').replace(/\bnatale\b/g,'navidad').replace(/\bcapodanno\b/g,'nochevieja').replace(/\bestate\b/g,'verano').replace(/\bgrande finale\b|\bla finale\b/g,'gran final').replace(/\bprima puntata\b|\bdebutto\b/g,'estreno').replace(/\bpaura\b/g,'miedo').replace(/\bdivertent/g,'divert').replace(/\bemozionant/g,'emocionante').replace(/\bfesta\b/g,'fiesta').replace(/\bdi sera\b/g,'de la noche').replace(/\balle\b/g,'a las').replace(/(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/g,(m,n,me)=>n+' de '+['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'].indexOf(me)]);
    function analiza(desc, show) {
      const d = String(desc || ''), q = IT2ES(quita(d)); const r = { desc: d, nombres: [], dia: '', diaPT: '', hora: '', horaVoz: '', horaVozPT: '', premio: '', tema: null, tono: '', claves: [] };
      // día
      let m; const hoy = new Date();
      if (/esta noche|hoy/.test(q)) r.dia = 'Esta noche', r.diaPT = 'Stasera';
      else if (/manana/.test(q) && !/de la manana|por la manana/.test(q)) r.dia = 'Mañana', r.diaPT = 'Domani';
      for (const k in DIAS) if (new RegExp('\\b' + k + '\\b').test(q)) { r.dia = (/proximo|que viene/.test(q) ? 'El próximo ' : 'Este ') + DIAS[k]; r.diaPT = (/proximo|que viene/.test(q) ? 'Il prossimo ' : 'Questo ') + DIAS_PT[k]; }
      if ((m = q.match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/))) { const mi = Math.max(0, MESES.indexOf(m[2] === 'setiembre' ? 'septiembre' : m[2])); r.dia = 'El ' + (+m[1]) + ' de ' + MESES[mi]; r.diaPT = 'Il ' + (+m[1]) + ' ' + MESES_PT[mi]; }
      else if ((m = q.match(/\b(\d{1,2})\/(\d{1,2})\b/)) && +m[2] >= 1 && +m[2] <= 12) { r.dia = 'El ' + (+m[1]) + ' de ' + MESES[+m[2] - 1]; r.diaPT = 'Il ' + (+m[1]) + ' ' + MESES_PT[+m[2] - 1]; }
      if (!r.dia && /nochebuena/.test(q)) r.dia = 'En Nochebuena', r.diaPT = 'La vigilia di Natale';
      if (!r.dia && /nochevieja/.test(q)) r.dia = 'En Nochevieja', r.diaPT = 'A Capodanno';
      // hora
      let h = null, mn = 0;
      if ((m = q.match(/\b(\d{1,2})[:.h](\d{2})\b/))) h = +m[1], mn = +m[2];
      else if ((m = q.match(/\ba las (\d{1,2}|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)( y media| y cuarto| menos cuarto)?( de la (noche|tarde|manana))?/))) { h = isNaN(+m[1]) ? NUM.indexOf(m[1] === 'una' ? 'una' : m[1]) : +m[1]; mn = m[2] === ' y media' ? 30 : m[2] === ' y cuarto' ? 15 : m[2] === ' menos cuarto' ? 45 : 0; if (m[2] === ' menos cuarto') h -= 1; if ((m[4] === 'noche' && h < 12 && h > 4) || (m[4] === 'tarde' && h < 12)) h += 12; if (!m[4] && h < 12 && h >= 1 && h <= 11 && h > 6) h += 12; }
      else if ((m = q.match(/\b(\d{1,2})\s*(h|horas)\b/))) h = +m[1];
      if (h != null && h >= 0 && h < 24) { r.hora = String(h).padStart(2, '0') + ':' + String(mn).padStart(2, '0'); const h12 = h % 12 || 12, hv = mn === 45 ? (h12 % 12) + 1 : h12; const fr = h >= 21 || h < 5 ? ' de la noche' : h >= 13 ? ' de la tarde' : h >= 6 && h < 12 ? ' de la mañana' : '';
        r.horaVoz = (hv === 1 ? 'a la una' : 'a las ' + NUM[hv]) + (MIN[mn] != null ? MIN[mn] : ' y ' + mn) + fr; r.horaVozPT = (hv === 1 ? "all'una" : 'alle ' + NUM_PT[hv]) + (mn === 30 ? ' e mezza' : mn === 15 ? ' e un quarto' : mn ? ' e ' + mn : '') + (h >= 18 || h < 5 ? ' di sera' : h >= 12 ? ' del pomeriggio' : ' di mattina'); }
      // premio
      if ((m = d.match(/(\d[\d.,]*)\s*(mil\s*)?(€|euros?|reais|r\$)/i)) || (m = d.match(/(?:€|R\$)\s*(\d[\d.,]*)/i))) { let n = +String(m[1]).replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'); if (/mil/i.test(m[2] || '')) n *= 1000; if (n) r.premio = n; }
      if (!r.premio && /bote|premio|millon|dinero/.test(q)) r.premio = /millon/.test(q) ? 1000000 : 0;
      // nombres propios (mayúscula que no es inicio de frase ni palabra común; también «con X», «llamad@ X»)
      const toks = d.replace(/[«»"“”()]/g, ' ').split(/\s+/); const N = [];
      toks.forEach((t, i) => { const w = t.replace(/[.,;:!?¡¿]+$/g, '').replace(/^[¡¿]+/, ''); const prev = toks[i - 1] || ''; const ini = i === 0 || /[.!?]$/.test(prev);
        if (/^[A-ZÁÉÍÓÚÑÖÜÇ][a-záéíóúñöüçş]+$/.test(w) && !STOP.has(w) && (!ini || /^(con|y|a|llamad[oa]s?)$/i.test(prev)) && !(show && quita(show).includes(quita(w)))) {
          if (N.length && toks[i - 1] && /^[A-ZÁÉÍÓÚÑ]/.test(toks[i - 1]) && N[N.length - 1].endsWith(toks[i - 1].replace(/[.,;:!?]+$/, '')) && !/[.,;:]$/.test(toks[i - 1])) N[N.length - 1] += ' ' + w; else N.push(w); } });
      r.nombres = [...new Set(N)].slice(0, 4);
      for (const T of TEMAS) if (T[1].test(q)) { r.tema = T; break; }
      for (const [k, re] of TONOS) if (re.test(q)) { r.tono = k; break; }
      if (!r.tono) r.tono = r.tema ? r.tema[4] : 'epico';
      // palabras clave: sustantivos largos que no son paja
      const paja = /^(quiero|hazme|hacer|promo|promos|programa|especial|que|para|sobre|donde|cuando|tiene|tenga|salga|salgan|haya|esta|este|noche|viernes|sabado|domingo|lunes|martes|miercoles|jueves|manana|euros|mucha|mucho|muchos|muchas|todos|todas|gente|nuestro|nuestra|nuevo|nueva|decir|diga|digan|super|voz|algo|cosa|cosas|ganar|premio|tambien|porque)$/;
      const yaT = w => (r.tema && r.tema[1].test(w)) || TONOS.some(([, re]) => re.test(w)) || /octubre|noviembre|diciembre|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|temporada|final|emocion|divertid/.test(w);
      r.claves = [...new Set(q.replace(/[^a-zñ ]/g, ' ').split(/\s+/).filter(w => w.length > 4 && !paja.test(w) && !yaT(w) && !r.nombres.some(n => quita(n).includes(w))))].slice(0, 5);
      return r;
    }
    const lista = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
    const listaPT = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
    const euros = (n, pt) => !n ? '' : n >= 1e6 ? (n === 1e6 ? (pt ? 'un milione' : 'un millón') : (n / 1e6).toLocaleString('es-ES') + (pt ? ' milioni' : ' millones')) + (pt ? ' di euro' : ' de euros') : n.toLocaleString('es-ES') + (pt ? ' euro' : ' euros');
    const ES = {
      gancho: { divertido: ['¡Agárrate, que vienen curvas!', '¡Prepárate para reír sin parar!', '¡Atención, que esto se descontrola!', '¡Lo nunca visto: risas aseguradas!'],
        epico: ['¡Nunca antes se había visto algo así!', '¡Llega el programa más grande del año!', '¡Prepárate, porque esto es historia!', '¡La espera ha terminado!'],
        emotivo: ['Hay noches que no se olvidan.', 'Esta vez, el corazón también juega.', 'Una noche para emocionarse.', 'Algunos momentos se quedan para siempre.'],
        misterio: ['Nadie sabe lo que va a pasar…', 'Hay un secreto en el plató.', 'Algo extraño está a punto de ocurrir.', 'Las luces se apagan… y empieza el juego.'],
        fiesta: ['¡Que suene la música, que empieza la fiesta!', '¡Esto es una fiesta y estás invitado!', '¡Luces, música y mucha diversión!', '¡Sube el volumen, que llega la gran fiesta!'],
        urgente: ['¡No te lo puedes perder!', '¡Atención, que ya llega!', '¡Última llamada!', '¡Quedan muy pocas horas!'] },
      medio: ['{SHOW} vuelve con {TEMA}.', '{SHOW} presenta {TEMA}.', 'Llega {TEMA} de {SHOW}.', 'Te esperamos en {TEMA} de {SHOW}.'],
      nombres: ['Con {N}, frente a frente.', '{N} se juegan el todo por el todo.', '¿Podrán {N} con todas las preguntas?', '{N} lo darán todo en el plató.'],
      nombre1: ['{N} se lo juega todo.', '¿Podrá {N} llegar hasta el final?', '{N} lo dará todo en el plató.', 'Todos los ojos estarán puestos en {N}.'],
      premio: ['¡Hay {P} en juego!', '¡Un bote de {P} espera a alguien!', '¿Quién se llevará los {P}?', '{P} esperan al más listo.'],
      claves: ['Con {K} y muchas sorpresas.', 'Habrá {K}, y mucho más.', '{K}: todo puede pasar.'],
      cierre: { divertido: ['¡No faltes, que nos vamos a reír!', '¡Ven a pasarlo en grande!'], epico: ['¡No te lo pierdas!', '¡Será inolvidable!'], emotivo: ['Te esperamos.', 'Una cita que no puedes perderte.'], misterio: ['¿Te atreves a descubrirlo?', '¿Quién se llevará el premio?'], fiesta: ['¡Te esperamos en la fiesta!', '¡Ven a celebrarlo con nosotros!'], urgente: ['¡Corre, que empieza!', '¡No llegues tarde!'] },
      titulo: { divertido: ['¡{SHOW}: risas a lo grande!', '{TEMAT}: ¡qué locura!'], epico: ['{TEMAT} de {SHOW}', '¡{SHOW}, como nunca!'], emotivo: ['{SHOW}: una noche especial', '{TEMAT}'], misterio: ['{SHOW}: el secreto', '¿Quién ganará?'], fiesta: ['¡Fiesta en {SHOW}!', '{TEMAT}: ¡a celebrar!'], urgente: ['¡{SHOW}, {DIA}!', '¡No te lo pierdas!'] },
      cuando: '{DIA} {HORA}, en {SHOW}.', cuandoSinDia: 'Muy pronto, en {SHOW}.', tema0: 'un programa muy especial'
    };
    const PT = {
      gancho: { divertido: ['Tenetevi forte, arrivano le curve!', 'Preparatevi a ridere senza sosta!', 'Attenzione, qui si perde il controllo!', 'Mai visto prima: risate assicurate!'],
        epico: ['Non si era mai visto niente del genere!', 'Arriva il programma più grande dell\'anno!', 'Preparatevi, perché questa è storia!', 'L\'attesa è finita!'],
        emotivo: ['Ci sono serate che non si dimenticano.', 'Questa volta gioca anche il cuore.', 'Una serata per emozionarsi.', 'Certi momenti restano per sempre.'],
        misterio: ['Nessuno sa cosa succederà…', 'C\'è un segreto in studio.', 'Qualcosa di strano sta per accadere.', 'Le luci si spengono… e comincia il gioco.'],
        fiesta: ['Musica, si comincia a fare festa!', 'È una festa e tu sei invitato!', 'Luci, musica e tanto divertimento!', 'Alzate il volume, arriva la grande festa!'],
        urgente: ['Non potete perderlo!', 'Attenzione, sta arrivando!', 'Ultima chiamata!', 'Mancano poche ore!'] },
      medio: ['{SHOW} torna con {TEMA}.', '{SHOW} presenta {TEMA}.', 'Arriva {TEMA} di {SHOW}.', 'Vi aspettiamo con {TEMA} di {SHOW}.'],
      nombres: ['Con {N}, faccia a faccia.', '{N} si giocano tutto.', '{N} riusciranno a rispondere a tutto?', '{N} daranno il massimo in studio.'],
      nombre1: ['{N} si gioca tutto.', '{N} arriverà fino alla fine?', '{N} darà il massimo in studio.', 'Tutti gli occhi saranno su {N}.'],
      premio: ['In palio ci sono {P}!', 'Un montepremi di {P} aspetta qualcuno!', 'Chi porterà a casa {P}?', '{P} aspettano il più bravo.'],
      claves: ['Con {K} e tante sorprese.', 'Ci saranno {K}, e molto altro.', '{K}: può succedere di tutto.'],
      cierre: { divertido: ['Non mancate, ci sarà da ridere!', 'Venite a divertirvi!'], epico: ['Non perdetelo!', 'Sarà indimenticabile!'], emotivo: ['Vi aspettiamo.', 'Un appuntamento da non perdere.'], misterio: ['Avete il coraggio di scoprirlo?', 'Chi vincerà il premio?'], fiesta: ['Vi aspettiamo alla festa!', 'Venite a festeggiare con noi!'], urgente: ['Correte, si comincia!', 'Non arrivate tardi!'] },
      titulo: { divertido: ['{SHOW}: risate in grande!', '{TEMAT}: che follia!'], epico: ['{TEMAT} di {SHOW}', '{SHOW}, come mai prima!'], emotivo: ['{SHOW}: una serata speciale', '{TEMAT}'], misterio: ['{SHOW}: il segreto', 'Chi vincerà?'], fiesta: ['Festa a {SHOW}!', '{TEMAT}: si festeggia!'], urgente: ['{SHOW}, {DIA}!', 'Non perdetelo!'] },
      cuando: '{DIA} {HORA}, a {SHOW}.', cuandoSinDia: 'Molto presto, a {SHOW}.', tema0: 'una puntata molto speciale'
    };
    function escribe(a, show, sem, pt) {
      const L = pt ? PT : ES, r = rnd(sem * 7919 + 13 + (pt ? 1 : 0)), uno = x => x[Math.floor(r() * x.length)], tono = a.tono;
      const tema = a.tema ? (pt ? a.tema[3] : a.tema[2]) : L.tema0, temaT = (x => x[0].toUpperCase() + x.slice(1))(tema.replace(/^(el|la|lo|o|a|un|um|una) /, ''));
      const P = euros(a.premio, pt), N = (pt ? listaPT : lista)(a.nombres), K = (pt ? listaPT : lista)(a.claves.slice(0, 2)), dia = pt ? a.diaPT : a.dia;
      const s = t => t.replace(/\{SHOW\}/g, show).replace(/\{TEMA\}/g, tema).replace(/\{TEMAT\}/g, temaT).replace(/\{P\}/g, P).replace(/\{N\}/g, N).replace(/\{K\}/g, K).replace(/\{DIA\}/g, (dia || '').toLowerCase()).replace(/\{HORA\}/g, '').replace(/\s+([,.!?])/g, '$1').replace(/^\s*,\s*/, '').replace(/([!?])\./g, '$1').replace(/ de el /g, ' del ').trim();
      const fr = [s(uno(L.gancho[tono] || L.gancho.epico)), s(uno(L.medio))];
      if (a.nombres.length) fr.push(s(uno(a.nombres.length > 1 ? L.nombres : L.nombre1)));
      if (P) fr.push(s(uno(L.premio))); if (a.claves.length && fr.length < 4 && r() < .6) fr.push(s(uno(L.claves)));
      const cierre = s(uno(L.cierre[tono] || L.cierre.epico));
      const cuandoVoz = dia ? (L.cuando.replace('{DIA}', dia).replace('{HORA}', (pt ? a.horaVozPT : a.horaVoz) || '').replace('{SHOW}', show).replace(/\s+,/, ',')) : L.cuandoSinDia.replace('{SHOW}', show);
      const titulo = s(uno(L.titulo[tono] || L.titulo.epico)).slice(0, 60);
      const lineas = [fr[1], fr[2] || fr[0], fr[3] || cierre].map(x => x.length > 70 ? x.slice(0, 67).replace(/\s+\S*$/, '') + '…' : x);
      const textoVoz = [...fr, cuandoVoz[0].toUpperCase() + cuandoVoz.slice(1), cierre].join(' ').replace(/\s+/g, ' ').replace(/([!?])\./g, '$1');
      return { titulo, lineas, dia: dia || (pt ? 'Molto presto' : 'Muy pronto'), hora: a.hora, textoVoz };
    }
    async function enLinea(desc, show, pt) { // opcional: Pollinations (gratis, sin clave). Si falla o tarda, se usa el guionista sin conexión.
      const pr = (pt ? 'Scrivi in italiano' : 'Escribe en español de España') + ` el guion de una promo de televisión de 4 frases cortas para el concurso «${show}», sin emojis, sin comillas, sin markdown, lista para leer en voz alta. Petición: ${desc}`;
      const ct = new AbortController(), to = setTimeout(() => ct.abort(), 20000);
      try { const r = await fetch('https://text.pollinations.ai/' + encodeURIComponent(pr), { signal: ct.signal }); if (!r.ok) throw 0; const t = (await r.text()).replace(/[*#_`>]/g, '').replace(/\s+/g, ' ').trim(); if (t.length < 20 || t.length > 900 || /<html|error/i.test(t)) throw 0; return t; } finally { clearTimeout(to); }
    }
    return { analiza, escribe, enLinea };
  })();
  async function panelPromoIA(alGuardar) {
    const show = (() => { let t = ''; try { t = localStorage.getItem('ac_titulo') || ''; } catch (e) { } t = t.replace(/[¡!]/g, '').trim(); return t || ((window.__LANG || 'it') === 'it' ? 'Caduta Libera' : 'Ahora Caigo'); })(), dos = 'pt', enPT = (window.__LANG || 'it') === 'it';
    const w = capa('✨ Hacer mis propias promos'); let sem = 1, a = null, ultimo = null;
    w.v.appendChild($('p', 'opacity:.85;margin:2px 0 8px', 'Cuéntame con tus palabras qué promo quieres (o dícteselo al micrófono del teclado). Te escribo el guion listo para usar: lo puedes cambiar, pedir otra versión y producir la promo con la voz Piper, las imágenes y la música del juego.'));
    const zd = sinTeclas($('textarea', 'width:100%;box-sizing:border-box;min-height:84px;padding:8px;border-radius:8px;border:1px solid #888;background:#111a;color:#fff;font:15px system-ui'));
    zd.placeholder = 'Ej.: promo divertida del especial de Navidad, el viernes a las 22:00, con Lucía y Marcos, bote de 50.000 euros'; zd.value = LSJ('ia_ultima', '');
    const fila = $('div', 'display:flex;flex-wrap:wrap;gap:4px;align-items:center'); const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const lin = { on: LSJ('ia_online', false) }; const bl = btn('', b => { lin.on = !lin.on; LSG('ia_online', lin.on); pon(b); }); const pon = b => b.innerHTML = lin.on ? '🌐 Mejorar con IA en línea: SÍ (gratis, opcional)' : '🌐 IA en línea: NO (todo sin conexión)'; pon(bl);
    const out = $('div', 'display:grid;gap:6px;margin-top:8px');
    const lab = t => $('div', `color:${C1};font-weight:bold;margin-top:4px`, t);
    const zT = inp('', 'Título', 60), zL = [0, 1, 2].map(i => inp('', 'Línea ' + (i + 1), 70)), zD = inp('', 'Día', 30), zH = inp('', 'Hora', 12);
    const zV = sinTeclas($('textarea', 'width:100%;box-sizing:border-box;min-height:90px;padding:8px;border-radius:8px;border:1px solid #888;background:#111a;color:#fff;font:15px system-ui'));
    const z2 = dos ? sinTeclas($('textarea', 'width:100%;box-sizing:border-box;min-height:70px;padding:8px;border-radius:8px;border:1px solid #888;background:#111a;color:#fff;font:15px system-ui')) : null;
    const info = $('div', 'opacity:.75;font-size:13px');
    const rellena = g => { zT.value = g.titulo; g.lineas.forEach((l, i) => zL[i].value = l); zD.value = g.dia; zH.value = g.hora || ''; zV.value = g.textoVoz; };
    async function genera() {
      const d = zd.value.trim(); if (!d) { toast('Escribe primero qué promo quieres'); zd.focus(); return; } LSG('ia_ultima', d);
      a = IA.analiza(d, show); const es = IA.escribe(a, show, sem, false), pt = dos === 'pt' ? IA.escribe(a, show, sem, true) : null;
      ultimo = { es, pt }; rellena(enPT && pt ? pt : es); if (z2) z2.value = (enPT ? es : pt || es).textoVoz;
      info.innerHTML = enPT ? `Ho capito → tono <b>${esc(a.tono)}</b>${a.tema ? ', tema <b>' + esc(a.tema[3]) + '</b>' : ''}${a.nombres.length ? ', nomi <b>' + esc(a.nombres.join(', ')) + '</b>' : ''}${a.diaPT ? ', giorno <b>' + esc(a.diaPT) + '</b>' : ''}${a.hora ? ', ora <b>' + esc(a.hora) + '</b>' : ''}${a.premio ? ', premio <b>' + esc(a.premio.toLocaleString('it-IT')) + ' €</b>' : ''}. Versione ${sem}.` : `Entendido → tono <b>${esc(a.tono)}</b>${a.tema ? ', tema <b>' + esc(a.tema[2]) + '</b>' : ''}${a.nombres.length ? ', nombres <b>' + esc(a.nombres.join(', ')) + '</b>' : ''}${a.dia ? ', día <b>' + esc(a.dia) + '</b>' : ''}${a.hora ? ', hora <b>' + esc(a.hora) + '</b>' : ''}${a.premio ? ', premio <b>' + esc(a.premio.toLocaleString('es-ES')) + ' €</b>' : ''}. Versión ${sem}.`;
      if (lin.on && navigator.onLine !== false) { info.innerHTML += ' · Pidiendo a la IA en línea…'; try { const t = await IA.enLinea(d, show, enPT); zV.value = t; info.innerHTML = info.innerHTML.replace(' · Pidiendo a la IA en línea…', ' · Texto de la voz mejorado en línea.'); } catch (e) { info.innerHTML = info.innerHTML.replace(' · Pidiendo a la IA en línea…', ' · Sin respuesta en línea: uso el guion sin conexión.'); } }
    }
    const recoge = () => ({ titulo: zT.value.trim() || show, lineas: zL.map(z => z.value.trim()), dia: zD.value.trim(), hora: zH.value.trim(), textoVoz: zV.value.trim(), voz: true, textoVoz2: z2 ? z2.value.trim() : '', ia: { desc: zd.value.trim(), version: sem } });
    fila.append(btn('✍️ Escribir el guion', () => { sem = 1; genera(); }, true), btn('🔄 Otra versión', () => { sem++; genera(); }));
    if (SR) fila.append(btn('🎤 Decirlo', b => { try { const s = new SR(); s.lang = enPT ? 'it-IT' : 'es-ES'; s.interimResults = false; b.innerHTML = '🎤 Escuchando…'; s.onresult = e => { zd.value = (zd.value ? zd.value + ' ' : '') + e.results[0][0].transcript; }; s.onend = () => { b.innerHTML = '🎤 Decirlo'; }; s.onerror = () => { b.innerHTML = '🎤 Decirlo'; toast('Sin reconocimiento de voz aquí: usa el micrófono del teclado'); }; s.start(); } catch (e) { toast('Usa el micrófono del teclado para dictar'); } }));
    fila.append(bl);
    out.append(info, lab('Título'), zT, lab('Líneas en pantalla'), ...zL, lab('Día y hora'), zD, zH, lab('Texto de la voz en off (Piper, voz clara, sin conexión)'), zV);
    if (z2) out.append(lab(enPT ? 'Versión en español' : 'Versione in italiano'), z2, btn(enPT ? '⇄ Usar la versión en español para la voz' : '⇄ Usa la versione italiana per la voce', () => { const t = zV.value; zV.value = z2.value; z2.value = t; }));
    const acc = $('div', 'margin-top:10px');
    acc.append(btn('🎬 Producir la promo (fondo, logo, música…)', () => { if (!zV.value.trim()) return toast('Primero escribe el guion'); w.cierra(); editor(Object.assign(recoge(), { id: 'p' + Date.now(), creada: Date.now() }), alGuardar); }, true),
      btn('▶ Vista previa', async () => { if (!zV.value.trim()) return toast('Primero escribe el guion'); w.o.style.display = 'none'; try { await reproducir(Object.assign({ logo: 'actual', musica: (cfg.musicas()[0] || [''])[0], transicion: 'fundido', fondo: { tipo: 'plato' } }, recoge())); } catch (e) { } w.o.style.display = 'flex'; }),
      btn('💾 Guardar tal cual', async () => { if (!zV.value.trim()) return toast('Primero escribe el guion'); await promoGuarda(Object.assign({ id: 'p' + Date.now(), creada: Date.now(), logo: 'actual', musica: (cfg.musicas()[0] || [''])[0], transicion: 'fundido', fondo: { tipo: 'plato' } }, recoge())); toast('Promo guardada'); w.cierra(); alGuardar && alGuardar(); }),
      btn('Cerrar', w.cierra));
    w.v.append(zd, fila, out, acc); if (zd.value) genera(); return w;
  }
