def edit(p, pares):
    s = open(p, encoding='utf8').read()
    for a, b in pares:
        if b in s: continue
        assert a in s and s.count(a) >= 1, (p, a[:90]); s = s.replace(a, b, 1)
    open(p, 'w', encoding='utf8').write(s)
edit('src/pre.js', [
 ("          else if (k === 'cab3d') { cab3d = URL.createObjectURL(v); }", "          else if (k === 'cab3d') { cab3d = URL.createObjectURL(v); }\n          else if (k.startsWith('aud:')) extras.set(k.slice(4), URL.createObjectURL(v));"),
 ("cab3d = null, localCab3d = false;", "cab3d = null, localCab3d = false; const extras = new Map(); const EXTRAS = ['estreno', 'promo_anuncio', 'promo_estanoche', 'promo_huella'];"),
 ("    cab3dUrl() {", "    audioExtra(n) { if (n === 'cabecera3d') return R.cab3dUrl(); return extras.get(n) || (localCab3d ? `./cabecera/${n}.mp3` : null); },\n    cab3dUrl() {"),
 ("        if (/^audio/.test(tipo) && /^cabecera3d$/i.test(sin)) {", "        if (/^audio/.test(tipo) && EXTRAS.includes(sin.toLowerCase())) { await tx('readwrite', s => s.put(blob, 'aud:' + sin.toLowerCase())); extras.set(sin.toLowerCase(), URL.createObjectURL(blob)); ns++; return; }\n        if (/^audio/.test(tipo) && /^cabecera3d$/i.test(sin)) {"),
 ("logoBlob = logoUrl = video = videoUrl = cab3d = null; },", "logoBlob = logoUrl = video = videoUrl = cab3d = null; extras.clear(); },"),
])
edit('src/app.js', [
 ('(it.cabecera === "cab3d" ? !window.__noCab3d && await cab3D(t, n, e.theme) :', '(it.cabecera === "cab3d" ? !window.__noCab3d && (estrenoPendiente() ? await promoEstreno(t, n) : await cab3D(t, n, e.theme)) :'),
 ('return qt.rivales[a - 1] || ((e = jn[a - 1]) == null ? void 0 : e.def) || "Oponente " + a;', 'return castingNombre(a) || qt.rivales[a - 1] || ((e = jn[a - 1]) == null ? void 0 : e.def) || "Oponente " + a;'),
 ('return ((e = jn[a - 1]) == null ? void 0 : e.job) || "";', 'return castingJob(a) || ((e = jn[a - 1]) == null ? void 0 : e.job) || "";'),
 ('for (let t = 1; t <= 10; t++) {\n      const n = Rm();', 'for (let t = 1; t <= 10; t++) {\n      const n = Rm(castingAspecto(t));'),
 ('const h = (o === 1 ? n0 : i0)[c], d = (o === 1 ? i0 : n0)[c];', 'const h = huellaMapa(o === 1 ? n0 : i0, o === 1 ? 0 : 1)[c], d = huellaMapa(o === 1 ? i0 : n0, o === 1 ? 1 : 0)[c];'),
 ('lh = "El Presentador"', 'lh = "Adrián Vega"'),
 ('ei("Opciones", "Sonido, calidad gráfica, pantalla completa", "", () => Lt("options")),', 'ei("Promos", "Promos 3D con Adrián Vega: casting, gran anuncio, esta noche…", "", () => Lt("promos")), ei("Casting", "Apúntate y sal como concursante en las partidas", "", () => Lt("casting")), ei("Elige el valor de cada huella", "Coloca los 20 valores de la moneda", "", () => Lt("huellas")), ei("Opciones", "Sonido, calidad gráfica, pantalla completa", "", () => Lt("options")),'),
 ('  } else if (a === "options") {\n    r.classList.add("opts")', '  } else if (a === "promos" || a === "casting" || a === "huellas") {\n    menuExtra(a, r);\n  } else if (a === "options") {\n    r.classList.add("opts")'),
])
