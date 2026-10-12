import sys
p='src/app.js'; s=open(p,encoding='utf8').read()
def R(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: sys.exit(f'FALLO ({n}) en: {a[:100]}')
    s=s.replace(a,b)
# modo de plató «antena3»
R('Rn = a === "virtual" ? "virtual" : "clasico", Rn === "virtual" ? (',
  'Rn = a === "virtual" ? "virtual" : a === "antena3" ? "antena3" : "clasico", Rn === "antena3" ? (on = 3, Ae = 0.8, Bn = 3.5, gn = 7.4, xo = 11.6, Cn = 12.6, Ht = 0.28, hi = vn(18), ua = vn(162), Yt = [{ r: 8.5, y: 0.75 }, { r: 9.2, y: 1.2 }, { r: 9.9, y: 1.65 }, { r: 10.6, y: 2.1 }], zr = [vn(62), vn(100), vn(138)], wi = [vn(17), vn(163)]) : Rn === "virtual" ? (')
R('''this.t = 0, Rn === "virtual") {
      GE(this, e), ym(this, e);''','''this.t = 0, Rn === "antena3" ? (estudioA3(this, e, n), true) : Rn === "virtual" && (GE(this, e), ym(this, e), true)) {''')
R('if (Rn === "virtual") return WE(e, t);','if (Rn === "virtual") return WE(e, t);\n    if (Rn === "antena3") return alturaA3(e, t);')
R('return Rn === "virtual" ? 8e-3 : 0.028;','return Rn === "virtual" ? 8e-3 : Rn === "antena3" ? 0.012 : 0.028;')
# el plató lo decide la etapa / el especial
R('this.player && this.scene.remove(this.player.root), this.host && this.scene.remove(this.host.root), this.theme = e, this.studio = new Em(','this.player && this.scene.remove(this.player.root), this.host && this.scene.remove(this.host.root), this.theme = e, aplicarPlato(e), this.studio = new Em(')
R('yv(o === "virtual" || o === "clasico" ? o : s.plato), Xe.platoLuz','yv(platoDe(o || s.plato)), Xe.platoLuz')
# plan de pruebas según la etapa
R('function Zv(a) {\n','function Zv(a) {\n  return planEtapa(a);\n}\nfunction Zv0(a) {\n')
# elección del central (tablet) solo desde 2017
R('me.eleccion && !window.__noEleccion','me.eleccion && etapa().eleccion && !window.__noEleccion')
# moneda fija antes de 2021
R('a.hud.hint("Elige un lado de la moneda");','a.hud.hint(monedaFija() ? "🪙 La moneda de la trampilla " + e : "Elige un lado de la moneda");')
R('''    await s.until(() => o > 0);
  } finally {
    removeEventListener("keydown", r), a.hud.hint(null);''','''    monedaFija() ? (await s.w(1400), o = o || 1 + Math.floor(Math.random() * 2)) : await s.until(() => o > 0);
  } finally {
    removeEventListener("keydown", r), a.hud.hint(null);''')
R('return TA(h, t), h === "cero"','return TA(h, t), etapa().dobladora && t.dobladora === e && (t.placar *= 2, setTimeout(() => a.hud.toast("🐔 ¡GALLINA DOBLADORA! Doblas tu bote", 2600), 2700)), h === "cero"')
R('this.plan = [], this.bank = new Iv(e.eng.theme.id)','this.plan = [], this.dobladora = 1 + Math.floor(Math.random() * 10), this.bank = new Iv(e.eng.theme.id)')
# opciones: etapa y cargar músicas
R('r.append(ZA(), HA(() => Lt("gallina")));','r.append(filaEtapa(), filaRecursos(), ZA(), HA(() => Lt("gallina")));')
# selector de plató: añade los de las fotos
R('for (const [i, s] of [["clasico", "Clásico"], ["virtual", "Plató virtual"]]) {','for (const [i, s] of [["clasico", "Clásico (APK)"], ["antena3", "Antena 3 2011-17"], ["oscuro", "Oscuro 2017-21"], ["virtual", "Plató virtual"]]) {')
R('it.plato !== i && (it.plato = i, Sh(it), yv(i), Xe.setTheme(xf(Ms))','it.plato !== i && (it.plato = i, Sh(it), yv(platoDe(i)), Xe.setTheme(xf(Ms))')
open(p,'w',encoding='utf8').write(s); print('ok')
