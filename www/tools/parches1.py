import sys
p='src/app.js'; s=open(p,encoding='utf8').read()
def R(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: sys.exit(f'FALLO ({n}) en: {a[:90]}')
    s=s.replace(a,b)
R('const Us = "./", xr = (a) => `${Us}sb3/img/${a}.webp`;','const Us = "./", xr = (a) => RC.img(a);')
R('return ma = await (await fetch(`${Us}sb3/manifest.json`)).json(), ma;','return await RC.init(), ma = __MANIFEST, ma;')
R("this.buffers.set(t, fetch(`${Us}sb3/snd/${t}.mp3`).then((n) => n.arrayBuffer()).then(","this.buffers.set(t, RC.snd(t).then((n) => { if (!n) throw 0; return n; }).then(")
# voces del presentador: en file:// no hay fetch -> <audio> directo
R("""  loadUrl(e) {
    return this.buffers.has(e) || this.buffers.set(e, fetch(e).then((t) => {
      if (!t.ok) throw 0;
      return t.arrayBuffer();
    })""","""  loadUrl(e) {
    return this.buffers.has(e) || this.buffers.set(e, RC.url(e).then((t) => {
      if (!t) throw 0;
      return t;
    })""")
R("""    const i = await this.loadUrl(e);
    if (!i) return { dur: -1, done: Promise.resolve() };""","""    const i = await this.loadUrl(e);
    if (!i && RC.FILE) return audioDirecto(e, t * this.voice.gain.value, n, this);
    if (!i) return { dur: -1, done: Promise.resolve() };""")
R("this.index = await (await fetch(`${Us}voz/index.json`)).json();","this.index = RC.FILE ? __VOZ_P : await (await fetch(`${Us}voz/index.json`)).json();")
R("return this.idxP || (this.idxP = fetch(`${Us}voz/q/index.json`).then((e) => e.json()).then((e) => {","return this.idxP || (this.idxP = (RC.FILE ? Promise.resolve(__VOZ_Q) : fetch(`${Us}voz/q/index.json`).then((e) => e.json())).then((e) => {")
R("this.blobs.set(e, fetch(`${Us}voz/q/${e}.mp3`).then(","this.blobs.set(e, RC.FILE ? Promise.resolve(`${Us}voz/q/${e}.mp3`) : fetch(`${Us}voz/q/${e}.mp3`).then(")
R("""    try {
      F.ctx.createMediaElementSource(e).connect(F.voice);
    } catch {
    }
    return this.el = e;""","""    if (!RC.FILE) try {
      F.ctx.createMediaElementSource(e).connect(F.voice);
    } catch {
    }
    return this.el = e;""")
# cabecera en vídeo: solo si está (zip completo o cargada)
R("i.src = sA, i.poster = \"./cabecera/cabecera-iker.jpg\",","i.src = RC.videoUrl(),")
R("To.video && !window.__noCabVideo && await oA(t, n)","To.video && RC.videoUrl() && !window.__noCabVideo && await oA(t, n)")
# preguntas en imagen -> texto cuando no hay imágenes
R("""function k2(a) {
  const e = ma.sprites.Pergunta.c[a - 1];""","""function k2(a) {
  const e = ma.sprites.Pergunta.c[a - 1];
  if (!RC.tieneImagenes()) return a > 80 ? null : preguntaTexto(a, e);""")
R("for (let i = e; i <= t; i++) n.push(k2(i));","for (let i = e; i <= t; i++) { const q = k2(i); q && n.push(q); }")
# minijuego clásico (TurboWarp con el proyecto de Scratch): solo en la versión completa
R("""  if (a === "clasico") {
    const i = en("classic");""","""  if (a === "clasico" && !RC.clasico()) {
    yn.toast("🎮 El minijuego clásico de Scratch solo está en la versión completa (zip)", 3200);
    return;
  }
  if (a === "clasico") {
    const i = en("classic");""")
open(p,'w',encoding='utf8').write(s); print('ok')
