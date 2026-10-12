import re
s=open('/workspace/comun/v_ia/promo_ia.js').read()
i=s.index('    const PT = {');j=s.index('    function escribe(')
IT='''    const PT = {
      gancho: { divertido: ['Tenetevi forte, arrivano le curve!', 'Preparatevi a ridere senza sosta!', 'Attenzione, qui si perde il controllo!', 'Mai visto prima: risate assicurate!'],
        epico: ['Non si era mai visto niente del genere!', 'Arriva il programma più grande dell\\'anno!', 'Preparatevi, perché questa è storia!', 'L\\'attesa è finita!'],
        emotivo: ['Ci sono serate che non si dimenticano.', 'Questa volta gioca anche il cuore.', 'Una serata per emozionarsi.', 'Certi momenti restano per sempre.'],
        misterio: ['Nessuno sa cosa succederà…', 'C\\'è un segreto in studio.', 'Qualcosa di strano sta per accadere.', 'Le luci si spengono… e comincia il gioco.'],
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
'''
s=s[:i]+IT+s[j:]
R=[("{ lunes: 'segunda-feira', martes: 'terça-feira', miercoles: 'quarta-feira', jueves: 'quinta-feira', viernes: 'sexta-feira', sabado: 'sábado', domingo: 'domingo' }","{ lunes: 'lunedì', martes: 'martedì', miercoles: 'mercoledì', jueves: 'giovedì', viernes: 'venerdì', sabado: 'sabato', domingo: 'domenica' }"),
("['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']","['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']"),
("['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze']","['zero', \"l'una\", 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici']"),
("'Hoje à noite'","'Stasera'"),("'Amanhã'","'Domani'"),
("(k === 'sabado' || k === 'domingo' ? 'Neste ' : 'Nesta ') + DIAS_PT[k]","(/proximo|que viene/.test(q) ? 'Il prossimo ' : 'Questo ') + DIAS_PT[k]"),
("'Dia ' + (+m[1]) + ' de ' + MESES_PT[mi]","'Il ' + (+m[1]) + ' ' + MESES_PT[mi]"),("'Dia ' + (+m[1]) + ' de ' + MESES_PT[+m[2] - 1]","'Il ' + (+m[1]) + ' ' + MESES_PT[+m[2] - 1]"),
("'Na véspera de Natal'","'La vigilia di Natale'"),("'Na véspera de Ano-Novo'","'A Capodanno'"),
("r.horaVozPT = (hv === 1 ? 'à uma' : 'às ' + NUM_PT[hv]) + (mn === 30 ? ' e meia' : mn ? ' e ' + mn : '') + (h >= 18 || h < 5 ? ' da noite' : h >= 12 ? ' da tarde' : ' da manhã');","r.horaVozPT = (hv === 1 ? \"all'una\" : 'alle ' + NUM_PT[hv]) + (mn === 30 ? ' e mezza' : mn === 15 ? ' e un quarto' : mn ? ' e ' + mn : '') + (h >= 18 || h < 5 ? ' di sera' : h >= 12 ? ' del pomeriggio' : ' di mattina');"),
("(pt ? 'um milhão' : 'un millón')","(pt ? 'un milione' : 'un millón')"),("(pt ? ' milhões' : ' millones')","(pt ? ' milioni' : ' millones')"),("(pt ? ' de reais' : ' de euros')","(pt ? ' di euro' : ' de euros')"),("(pt ? ' reais' : ' euros')","(pt ? ' euro' : ' euros')"),
("(pt ? 'Em breve' : 'Muy pronto')","(pt ? 'Molto presto' : 'Muy pronto')"),("'Escreva em português do Brasil'","'Scrivi in italiano'"),
("dos = cfg.idioma2 || (window.__LANG ? 'pt' : ''), enPT = window.__LANG === 'pt'","dos = 'pt', enPT = (window.__LANG || 'it') === 'it'"),
("s.lang = enPT ? 'pt-BR' : 'es-ES'","s.lang = enPT ? 'it-IT' : 'es-ES'"),("'Versão em português'","'Versione in italiano'"),("'⇄ Usar a versão em português para a voz'","'⇄ Usa la versione italiana per la voce'"),
("'o especial de Natal'","\"lo speciale di Natale\""),("'o especial de Ano-Novo'","'lo speciale di Capodanno'"),("'o especial de terror'","'lo speciale horror'"),("'o especial de verão'","\"lo speciale d'estate\""),("'o especial com famosos'","'lo speciale con i vip'"),("'a grande final'","'la grande finale'"),("'a grande estreia'","'la grande prima puntata'"),("'o programa de aniversário'","'la puntata anniversario'"),("'o especial do Dia dos Namorados'","'lo speciale di San Valentino'"),("'o especial do futuro'","'lo speciale del futuro'"),("'o especial em família'","'lo speciale in famiglia'"),
("tema.replace(/^(el|la|o|a|un|um) /, '')","tema.replace(/^(el|la|lo|o|a|un|um|una) /, '')"),("Acerte Caia","Caduta Libera Acerte Caia")]
for a,b in R:
  assert a in s,a; s=s.replace(a,b)
s=s.replace("' e ' + a[a.length - 1]","' e ' + a[a.length - 1]")
open('promo_ia_it.js','w').write(s)
a="const r = { desc: d,"
k=s.index(a); ln=s.rfind('\n',0,k)
line=s[ln:k]
assert "q = quita(d)" in line
TRI="const IT2ES = t => t.replace(/\\blunedi\\b/g,'lunes').replace(/\\bmartedi\\b/g,'martes').replace(/\\bmercoledi\\b/g,'miercoles').replace(/\\bgiovedi\\b/g,'jueves').replace(/\\bvenerdi\\b/g,'viernes').replace(/\\bsabato\\b/g,'sabado').replace(/\\bdomenica\\b/g,'domingo').replace(/\\bstasera\\b/g,'esta noche').replace(/\\bdomani\\b/g,'manana').replace(/\\bprossimo\\b/g,'proximo').replace(/\\bnatale\\b/g,'navidad').replace(/\\bcapodanno\\b/g,'nochevieja').replace(/\\bestate\\b/g,'verano').replace(/\\bgrande finale\\b|\\bla finale\\b/g,'gran final').replace(/\\bprima puntata\\b|\\bdebutto\\b/g,'estreno').replace(/\\bpaura\\b/g,'miedo').replace(/\\bdivertent/g,'divert').replace(/\\bemozionant/g,'emocionante').replace(/\\bfesta\\b/g,'fiesta').replace(/\\bdi sera\\b/g,'de la noche').replace(/\\balle\\b/g,'a las').replace(/(\\d{1,2})\\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/g,(m,n,me)=>n+' de '+['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'].indexOf(me)]);\n    "
s=s.replace("    function analiza(desc, show) {","    "+TRI+"function analiza(desc, show) {",1)
s=s.replace("q = quita(d);","q = IT2ES(quita(d));",1)
s=s.replace("Le Nos'.split(' ')","Le Nos Il Lo Gli Le Di Da Con Su Per Tra Fra Fammi Voglio Questo Questa Prossimo Lunedì Martedì Mercoledì Giovedì Venerdì Sabato Domenica Stasera Domani Natale Capodanno Puntata Caduta Libera Speciale'.split(' ')")
open('promo_ia_it.js','w').write(s)
a="const show = String(cfg.titulo() || '').trim(), dos"
assert a in s
s=s.replace(a,"const show = (() => { let t = ''; try { t = localStorage.getItem('ac_titulo') || ''; } catch (e) { } t = t.replace(/[¡!]/g, '').trim(); return t || ((window.__LANG || 'it') === 'it' ? 'Caduta Libera' : 'Ahora Caigo'); })(), dos")
i=s.index("info.innerHTML = `Entendido"); j=s.index("`;",i)+2
s=s[:i]+"info.innerHTML = enPT ? `Ho capito → tono <b>${esc(a.tono)}</b>${a.tema ? ', tema <b>' + esc(a.tema[3]) + '</b>' : ''}${a.nombres.length ? ', nomi <b>' + esc(a.nombres.join(', ')) + '</b>' : ''}${a.diaPT ? ', giorno <b>' + esc(a.diaPT) + '</b>' : ''}${a.hora ? ', ora <b>' + esc(a.hora) + '</b>' : ''}${a.premio ? ', premio <b>' + esc(a.premio.toLocaleString('it-IT')) + ' €</b>' : ''}. Versione ${sem}.` : `Entendido → tono <b>${esc(a.tono)}</b>${a.tema ? ', tema <b>' + esc(a.tema[2]) + '</b>' : ''}${a.nombres.length ? ', nombres <b>' + esc(a.nombres.join(', ')) + '</b>' : ''}${a.dia ? ', día <b>' + esc(a.dia) + '</b>' : ''}${a.hora ? ', hora <b>' + esc(a.hora) + '</b>' : ''}${a.premio ? ', premio <b>' + esc(a.premio.toLocaleString('es-ES')) + ' €</b>' : ''}. Versión ${sem}.`;"+s[j:]
open('promo_ia_it.js','w').write(s)
