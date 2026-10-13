// ===================================================================================================
// Opciones › «Personajes: Monigotes / Personas 3D» · adaptador de ¡Ahora Caigo! (personas3d.js)
// Monigotes = como siempre. Personas 3D = presentador, concursantes, invitados y público con aspecto de
// persona (caras inventadas). Se aplica en el plató 3D, el Programa completo y «Mi cabecera 3D».
// ===================================================================================================
function p3dOn() { try { return localStorage.getItem('personajes3d') === 'personas'; } catch (e) { return false; } }
function p3dApi() { const P = p3dLib(_E); if (!P._habla) { P._habla = 1; P.setHabla(h => { try { return !!yn && yn.bubbleTarget === h && performance.now() < yn.bubbleUntil && !document.getElementById('bubble').classList.contains('hidden'); } catch (e) { return false; } }); } return P; }
function p3dRm(a) {
  const h = a.p3d || {}, piel = a.color != null && a.color !== 15265528 ? '#' + a.color.toString(16).padStart(6, '0') : undefined;
  if (typeof p3dRB === "function") return p3dRm2(a);
  return p3dApi().persona({ seed: h.seed ?? ('extra' + Math.floor(Math.random() * 1e6)), g: h.g, shirt: a.shirt, skin: piel, ...(h.o || {}) });
}
function p3dHost(a) {
  if (typeof p3dRB === "function") return p3dHost2(a);
  const fig = p3dApi().persona({ seed: 'adrian-vega', g: 'm', edad: 37, pelo: 'raya', barba: 'no', gafas: !!a.glasses, prenda: 'americana', traje: a.suit, camisa: a.shirt, corbata: a.bowtie ? null : a.tie, mic: true, hiRes: true, skin: '#e6b28c', ancho: 1.04, barriga: 0, alto: 1.02, extra: { pelo: '#2e1d12', ojos: '#4f3018', cejasCol: '#241509' } });
  if (a.bowtie) { const m = new _E.MeshLambertMaterial({ color: a.tie }); for (const s of [-1, 1]) { const c = new _E.Mesh(new _E.ConeGeometry(0.035, 0.06, 4), m); c.rotation.z = s * Math.PI / 2; c.position.set(s * 0.03, 1.49, 0.1); fig.body.add(c); } }
  if (a.cape != null) { const c = new _E.Mesh(new _E.PlaneGeometry(0.55, 0.95), new _E.MeshLambertMaterial({ color: a.cape, side: _E.DoubleSide })); c.position.set(0, 1.0, -0.13); c.rotation.x = 0.08; fig.body.add(c); }
  try { if (a.hat) { t2(fig.p3d.inner, a.hat); const hg = fig.p3d.inner.children[fig.p3d.inner.children.length - 1]; hg.scale.setScalar(0.82); hg.position.y = 0.105; } } catch (e) { }
  return fig;
}
function p3dPubHair(largo) {
  const T = _E, g = new T.SphereGeometry(0.136, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5); g.scale(0.86, 1.08, 1.04); g.rotateX(-0.55); g.translate(0, 0.155, -0.012);
  return g;
}
function p3dPubHairL(m) { // melena: casquete + caída por detrás (sin tapar la cara)
  const T = _E, g = p3dPubHair(false), b = new T.CylinderGeometry(0.125, 0.16, 0.32, 10, 1, true, Math.PI / 2 + 0.1, Math.PI - 0.2); b.translate(0, 0.04, -0.035);
  return ci([g, b]);
}
function filaPersonajes() { return p3dApi().fila(() => { try { Xe.setTheme(Xe.theme); Ii(); } catch (e) { console.warn(e); } }); }
window.__p3d = { on: p3dOn, api: () => p3dApi() };
/*P3D-INICIO*/
// ---------------- 1.22: personas realistas (avatares Rocketbox, MIT) ----------------
function p3dRBapi() { const P = p3dRB(_E, 'personas3d/'); if (!P._habla) { P._habla = 1; P.setHabla(h => { try { return !!yn && yn.bubbleTarget === h && performance.now() < yn.bubbleUntil && !document.getElementById('bubble').classList.contains('hidden'); } catch (e) { return false; } }); } return P; }
function p3dRm2(a) { const h = a.p3d || {}; return p3dRBapi().persona({ seed: h.seed ?? ('extra' + Math.floor(Math.random() * 1e6)), g: h.g === 'f' || h.g === 'm' ? h.g : (Math.random() < 0.5 ? 'f' : 'm') }); }
function p3dHost2(a) { return p3dRBapi().persona({ avatar: p3dRBapi().LISTA.presentador, seed: 'adrian', g: 'm', mic: true }); }
function p3dPubMontar(pub) {
  const P = p3dRBapi(), todos = P.todos(), T = _E;
  for (const half of pub.halves) for (const [k, m] of Object.entries(half.meshes)) if (k !== 'seat') m.visible = false;
  pub.p3d = { listo: false, grupos: [] };
  const mat = ic(new T.MeshLambertMaterial({ color: 16777215, emissive: 0x0c0c0c, alphaTest: 0.45, side: T.DoubleSide }), pub.u);
  Promise.all(todos.map(n => P.bakePublico(n))).then(bk => {
    if (!pub.root.parent && pub.disposed) return;
    pub.halves.forEach((half, hi) => {
      const por = todos.map(() => []); half.people.forEach((d, i) => por[(i * 7 + hi * 3 + (d.row || 0) * 5) % todos.length].push(d));
      por.forEach((lista, k) => {
        if (!lista.length) return; const m = mat.clone(); m.map = bk[k].atlas; m.onBeforeCompile = mat.onBeforeCompile; m.customProgramCacheKey = mat.customProgramCacheKey;
        const im = new T.InstancedMesh(bk[k].geo, m, lista.length); im.frustumCulled = false; im.morphTargetInfluences = [0, 0, 0, 0]; im.morphTargetDictionary = { clapA: 0, clapB: 1, arriba: 2, depie: 3 }; im.name = 'pub-p3d';
        half.root.add(im); pub.p3d.grupos.push({ im, lista });
      });
    });
    pub.p3d.listo = true; p3dPubPose(pub);
  }).catch(e => console.warn('[p3d] público', e));
}
const _p3dM = new _E.Matrix4(), _p3dM2 = new _E.Matrix4(), _p3dObj = { morphTargetInfluences: [0, 0, 0, 0] };
function p3dPubPose(pub) {
  if (!pub.p3d || !pub.p3d.listo) return;
  for (const { im, lista } of pub.p3d.grupos) {
    if (!im.parent || !im.parent.visible) continue;
    lista.forEach((d, i) => {
      const v = d._v || [-0.62, 0.12, -0.6, -0.12, 0, 0.03];
      const rx = (v[0] + v[2]) / 2, arriba = Math.max(0, Math.min(1, (-rx - 1.7) / 1.0)), eng = Math.max(0, Math.min(1, (-rx - 0.66) / 0.45)) * (1 - arriba);
      const h = Math.max(0, Math.min(1, (v[1] - 0.1) / 0.42));
      const inf = _p3dObj.morphTargetInfluences; inf[0] = eng * h; inf[1] = eng * (1 - h); inf[2] = arriba; inf[3] = Math.max(0, Math.min(1, d.stand || 0));
      im.setMorphAt(i, _p3dObj);
      _p3dM.copy(d.base).multiply(_p3dM2.makeTranslation(0, v[4], 0)).multiply(_p3dM2.makeRotationX(v[5] * 0.6));
      im.setMatrixAt(i, _p3dM);
    });
    im.instanceMatrix.needsUpdate = true; if (im.morphTexture) im.morphTexture.needsUpdate = true;
  }
}

/*P3D-FIN*/
