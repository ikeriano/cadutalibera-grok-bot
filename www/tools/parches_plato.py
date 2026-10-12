p='src/post.js'; s=open(p).read()
def R(a,b):
    global s
    assert a in s, a[:60]; s=s.replace(a,b,1)
# 1) trampillas como "bañeras" elevadas: pared metálica, borde plateado y aro rojo interior
R("    const lab = new T.Sprite(","""    const tw = new T.Mesh(new T.CylinderGeometry(A3.RT * 1.62, A3.RT * 1.7, 0.3, 48, 1, true), new T.MeshPhongMaterial({ color: osc ? 0x18181e : 0x9a9ca6, specular: 0xffffff, shininess: 80, emissive: osc ? 0x000000 : 0x15151a })); tw.position.set(O.x, Ht + 0.15, O.z); R.add(tw);
    const tin = new T.Mesh(new T.CylinderGeometry(A3.RT * 1.55, A3.RT * 1.55, 0.29, 48, 1, true), glowMat(osc ? 0xff1020 : 0xff2a20, 0.55)); tin.position.set(O.x, Ht + 0.15, O.z); R.add(tin);
    const tb = new T.Mesh(new T.RingGeometry(A3.RT * 1.55, A3.RT * 1.72, 48), new T.MeshPhongMaterial({ color: osc ? 0x26262e : 0xd8dae2, specular: 0xffffff, shininess: 100, side: T.DoubleSide })); tb.rotation.x = -Math.PI / 2; tb.position.set(O.x, Ht + 0.3, O.z); R.add(tb);
    const tl = new T.Mesh(new T.TorusGeometry(A3.RT * 1.6, 0.025, 6, 48), glowMat(osc ? 0xff2030 : 0xff3a2a, 0.95)); tl.rotation.x = Math.PI / 2; tl.position.set(O.x, Ht + 0.3, O.z); R.add(tl);
    const lab = new T.Sprite(""")
# 2) copas luminosas (vidrio naranja iluminado desde dentro)
R("const copaMat = lam(osc ? 0x111118 : 0xff7a1a, osc ? 0x220006 : 0xc23a00)","const copaMat = new T.MeshLambertMaterial({ color: osc ? 0x2a0006 : 0xffa040, emissive: osc ? 0xc00818 : 0xff6a10, emissiveIntensity: osc ? 0.8 : 1.0, transparent: true, opacity: 0.92, side: T.DoubleSide })")
R("const tallo = new T.CylinderGeometry(0.045, 0.06, 0.86, 10), tMat = lam(0x8a8a94, 0x111114);","const tallo = new T.CylinderGeometry(0.035, 0.05, 0.86, 10), tMat = new T.MeshPhongMaterial({ color: 0xc0c4cc, specular: 0xffffff, shininess: 100 });")
# 3) suelo del anillo de juego beige/dorado (2011-2017), oscuro en 2017-21
R("g.fillStyle = osc ? '#0c0c12' : '#5a4c4e'; g.fillRect(0, 0, w, w); g.strokeStyle = osc ? 'rgba(255,40,60,.18)' : 'rgba(255,150,60,.16)';","const gg = g.createRadialGradient(w / 2, w / 2, w * 0.2, w / 2, w / 2, w / 2); gg.addColorStop(0, osc ? '#0c0c12' : '#e8d6aa'); gg.addColorStop(1, osc ? '#08080c' : '#b89a64'); g.fillStyle = gg; g.fillRect(0, 0, w, w); g.strokeStyle = osc ? 'rgba(255,40,60,.18)' : 'rgba(120,80,30,.18)';")
R("new T.MeshPhongMaterial({ color: osc ? 0x15151c : 0x6a5a5c, specular: 0x554444, shininess: 70,","new T.MeshPhongMaterial({ color: 0xffffff, specular: 0x554444, shininess: 70,")
# 4) barrera de lamas metálicas por fuera de la barandilla (como en las fotos)
R("  // gradas en círculo detrás","""  const lamas = new T.Mesh(new T.CylinderGeometry(RR + 0.05, RR + 0.05, 1.0, 160, 1, true, Math.PI + gap, Math.PI * 2 - gap * 2), new T.MeshPhongMaterial({ side: T.DoubleSide, transparent: true, color: 0xffffff, specular: 0xffffff, shininess: 60, emissive: osc ? 0x000000 : 0x101014, map: Vt(1024, 64, (g, w, h) => { g.clearRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { g.fillStyle = osc ? 'rgba(30,30,40,.85)' : 'rgba(150,154,164,.85)'; g.fillRect(x, 0, 5, h); } g.fillStyle = osc ? 'rgba(255,255,255,.9)' : 'rgba(220,224,232,1)'; g.fillRect(0, 0, w, 4); }) }));
  lamas.material.map.wrapS = T.RepeatWrapping; lamas.material.map.repeat.set(6, 1); lamas.position.y = Ht + 0.5; R.add(lamas);
  // gradas en círculo detrás""")
# 5) techo: anillo blanco de lamas inclinadas con el centro negro
R("const t1 = new T.Mesh(new T.CylinderGeometry(10.2, 3.8, 1.6, 96, 1, true), techoMat);","if (!osc) techoMat.map = Vt(2048, 64, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = 'rgba(40,40,50,.55)'; g.fillRect(x, 0, 4, h); } });\n  const t1 = new T.Mesh(new T.CylinderGeometry(10.2, 3.8, 1.6, 96, 1, true), techoMat);")
# 6) pantalla redonda (espiral azul/morada) al fondo, como en 2011
R("  // brillo animado de los aros","""  if (!osc) { const esp = Vt(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ff6ad8'); gr.addColorStop(0.35, '#5a2ad8'); gr.addColorStop(0.7, '#1a3ad8'); gr.addColorStop(1, '#0a0a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 6; for (let r = 30; r < w / 2; r += 34) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } });
    const C = lo(11.9, Math.PI + 0.3, 3.6); const cs = new T.Mesh(new T.CircleGeometry(1.7, 64), new T.MeshBasicMaterial({ map: esp })); cs.position.copy(C); cs.lookAt(0, 3.4, 0); R.add(cs); const cm = new T.Mesh(new T.TorusGeometry(1.75, 0.12, 8, 64), lam(0xe0e2ea, 0x303034)); cm.position.copy(C); cm.lookAt(0, 3.4, 0); R.add(cm); }
  // brillo animado de los aros""")
open(p,'w').write(s)
a='src/app.js'; t=open(a).read()
o='zr = [vn(62), vn(100), vn(138)], wi = [vn(17), vn(163)]) : Rn === "virtual"'
assert o in t; t=t.replace(o,'zr = [vn(98), vn(128), vn(158)], wi = [vn(80), vn(176)]) : Rn === "virtual"')
open(a,'w').write(t)
