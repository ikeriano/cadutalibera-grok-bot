import re
def edit(p, pares):
    s = open(p, encoding='utf8').read()
    for a, b in pares:
        if b in s and a not in s: continue
        assert a in s, (p, a[:80]); s = s.replace(a, b, 1)
    open(p, 'w', encoding='utf8').write(s)
edit('src/pre.js', [
 ("let logoBlob = null, logoUrl = null, video = null, videoUrl = null;", "let logoBlob = null, logoUrl = null, video = null, videoUrl = null, cab3d = null, localCab3d = false;"),
 ("          else if (k === 'video') { video = v; videoUrl = URL.createObjectURL(v); }", "          else if (k === 'video') { video = v; videoUrl = URL.createObjectURL(v); }\n          else if (k === 'cab3d') { cab3d = URL.createObjectURL(v); }"),
 ("      localClasico = !!window.__CLASICO_LOCAL ||", "      localCab3d = !!window.__CAB3D_LOCAL || (!FILE && await fetch('./cabecera/cabecera3d.mp3', { method: 'HEAD' }).then(r => r.ok).catch(() => false));\n      localClasico = !!window.__CLASICO_LOCAL ||"),
 ("    videoUrl() {", "    cab3dUrl() { return cab3d || (localCab3d ? './cabecera/cabecera3d.mp3' : null); },\n    videoUrl() {"),
 ("        if (/^audio/.test(tipo)) { const h", "        if (/^audio/.test(tipo) && /^cabecera3d$/i.test(sin)) { await tx('readwrite', s => s.put(blob, 'cab3d')); cab3d = URL.createObjectURL(blob); ns++; return; }\n        if (/^audio/.test(tipo)) { const h"),
 ("logoBlob = logoUrl = video = videoUrl = null; },", "logoBlob = logoUrl = video = videoUrl = cab3d = null; },"),
])
edit('src/app.js', [
 ('To.video && RC.videoUrl() && !window.__noCabVideo && await oA(t, n) || await nA(', '(it.cabecera === "cab3d" ? !window.__noCab3d && await cab3D(t, n, e.theme) : To.video && RC.videoUrl() && !window.__noCabVideo && await oA(t, n)) || await nA('),
 ('[["iker", "La de Iker (vídeo)"], ["plato3d", "Plató 3D"]]', '[["cab3d", "Cabecera 3D"], ["iker", "La de Iker (vídeo)"], ["plato3d", "Plató 3D"]]'),
 ('plato: "clasico", platoLuz: "auto", cabecera: "iker", monologo: true', 'plato: "clasico", platoLuz: "auto", cabecera: "cab3d", monologo: true'),
])
