/*P3D-INICIO*/
// ===================================================================================================
// Personas 3D realistas: avatares Rocketbox (Microsoft, licencia MIT; caras de artista, no de personas
// reales) en paquetes .p3d (malla con huesos + 4 gestos faciales + LOD) y texturas webp.
// p3dRB(THREE, base) → { listo(), persona(opts) (misma interfaz que los monigotes), publico(...) }
// ===================================================================================================
function p3dRB(T, base) {
  if (p3dRB._api) return p3dRB._api;
  const LISTA = {
    m: ['Male_Adult_01', 'Male_Adult_03', 'Male_Adult_05', 'Male_Adult_06', 'Male_Adult_08', 'Male_Adult_09', 'Male_Adult_11', 'Male_Adult_13', 'Male_Adult_14', 'Male_Adult_18', 'Business_Male_04', 'Business_Male_06'],
    f: ['Female_Adult_01', 'Female_Adult_02', 'Female_Adult_03', 'Female_Adult_04', 'Female_Adult_05', 'Female_Adult_08', 'Female_Adult_11', 'Female_Adult_14', 'Business_Female_01', 'Business_Female_02', 'Business_Female_03', 'Business_Female_04'],
    presentador: 'Business_Male_02'
  };
  const packs = {}, texs = {};
  const hashS = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return h >>> 0; };
  function cargaPack(name) {
    if (packs[name]) return packs[name];
    return packs[name] = fetch(base + name + '.p3d').then(r => { if (!r.ok) throw new Error('p3d ' + name); return r.arrayBuffer(); }).then(buf => {
      const dv = new DataView(buf), n = dv.getUint32(4, true), H = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 8, n))), B = 8 + n;
      const F = (o, len) => new Float32Array(buf.slice(B + o, B + o + len * 4));
      H.ibmM = []; const ib = F(H.ibm, H.bones.length * 16); for (let i = 0; i < H.bones.length; i++) H.ibmM.push(new T.Matrix4().fromArray(ib, i * 16));
      H.prims.forEach(p => {
        p.posA = F(p.pos, p.nv * 3); p.uvA = F(p.uv, p.nv * 2);
        p.nrmA = new Int8Array(buf.slice(B + p.nrm, B + p.nrm + p.nv * 3)); p.jA = new Uint8Array(buf.slice(B + p.j, B + p.j + p.nv * 4)); p.wA = new Uint8Array(buf.slice(B + p.w, B + p.w + p.nv * 4));
        p.idxA = new Uint16Array(buf.slice(B + p.idx, B + p.idx + p.ni * 2)); p.lodA = new Uint16Array(buf.slice(B + p.lod, B + p.lod + p.nl * 2));
        p.morphA = {}; for (const [k, o] of Object.entries(p.morph)) { const q = new Int16Array(buf.slice(B + o, B + o + p.nv * 6)), f = new Float32Array(q.length); for (let i = 0; i < q.length; i++) f[i] = q[i] * 1e-4; p.morphA[k] = f; }
        const g = new T.BufferGeometry();
        g.setAttribute('position', new T.BufferAttribute(p.posA, 3)); g.setAttribute('normal', new T.BufferAttribute(p.nrmA, 3, true)); g.setAttribute('uv', new T.BufferAttribute(p.uvA, 2));
        g.setAttribute('skinIndex', new T.BufferAttribute(p.jA, 4)); g.setAttribute('skinWeight', new T.BufferAttribute(p.wA, 4, true)); g.setIndex(new T.BufferAttribute(p.idxA, 1));
        const ks = Object.keys(p.morphA); if (ks.length) { g.morphAttributes.position = ks.map(k => { const a = new T.BufferAttribute(p.morphA[k], 3); a.name = k; return a; }); g.morphTargetsRelative = true; }
        g.computeBoundingSphere(); p.geo = g;
      });
      return H;
    });
  }
  function tex(url, srgb = true) {
    if (texs[url]) return texs[url];
    const t = new T.Texture(); t.flipY = false; if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
    const im = new Image(); im.onload = () => { t.image = im; t.needsUpdate = true; }; im.src = url; return texs[url] = t;
  }
  const matCache = {};
  function mats(H) {
    if (matCache[H.name]) return matCache[H.name];
    return matCache[H.name] = H.prims.map(p => {
      const m = new T.MeshLambertMaterial({ map: tex(base + H.name + '.' + p.mat + '.webp'), emissive: 0x101010 });
      if (p.alpha || /glasses/.test(p.mat)) { m.alphaTest = 0.45; m.side = T.DoubleSide; m.transparent = /glasses/.test(p.mat); }
      return m;
    });
  }
  // ---------------- esqueleto y conducción de huesos desde los «proxies» de monigote ----------------
  const qa = new T.Quaternion(), qb = new T.Quaternion(), qc = new T.Quaternion(), va = new T.Vector3(), vb = new T.Vector3(), eu = new T.Euler();
  function esqueleto(H) {
    const bones = H.bones.map(b => { const o = new T.Bone(); o.name = b.n; o.position.fromArray(b.t); o.quaternion.fromArray(b.r); o.scale.fromArray(b.s); return o; });
    const raices = []; H.bones.forEach((b, i) => b.p >= 0 ? bones[b.p].add(bones[i]) : raices.push(bones[i]));
    return { bones, raices, sk: new T.Skeleton(bones, H.ibmM.map(m => m.clone())) };
  }
  const by = (bones, n) => bones.find(b => b.name === 'Bip01 ' + n);
  function preparaRig(arm, bones) { // orienta de frente (+z) y apunta cada hueso conducido
    arm.updateMatrixWorld(true);
    const head = by(bones, 'Head'), eyeR = by(bones, 'REye'), eyeL = by(bones, 'LEye');
    const hp = head.getWorldPosition(new T.Vector3()), ep = eyeR.getWorldPosition(new T.Vector3()).add(eyeL.getWorldPosition(new T.Vector3())).multiplyScalar(0.5);
    const fwd = ep.sub(hp).setY(0).normalize(); arm.rotation.y = Math.atan2(-fwd.x, fwd.z) * -1; arm.rotation.y = -Math.atan2(fwd.x, fwd.z); arm.updateMatrixWorld(true);
    const W = b => b.getWorldQuaternion(new T.Quaternion()), P = b => b.getWorldPosition(new T.Vector3());
    const R = {};
    for (const n of ['Head', 'L UpperArm', 'R UpperArm', 'L Forearm', 'R Forearm', 'L Thigh', 'R Thigh', 'L Calf', 'R Calf', 'L Hand', 'R Hand', 'Pelvis', 'Spine', 'Spine2', 'Neck', 'L Clavicle', 'R Clavicle']) { const b = by(bones, n); if (b) R[n] = { b, w: W(b), pw: W(b.parent), p: P(b) }; }
    // lado: el brazo con x<0 hace de armL (como los monigotes)
    const izq = R['L UpperArm'].p.x < 0 ? 'L' : 'R', der = izq === 'L' ? 'R' : 'L';
    const down = s => { const u = R[s + ' UpperArm'], f = R[s + ' Forearm']; return new T.Quaternion().setFromUnitVectors(f.p.clone().sub(u.p).normalize(), new T.Vector3(0, -1, 0)); };
    const legDown = s => { const u = R[s + ' Thigh'], f = R[s + ' Calf']; return new T.Quaternion().setFromUnitVectors(f.p.clone().sub(u.p).normalize(), new T.Vector3(0, -1, 0)); };
    return { R, izq, der, qd: { [izq]: down(izq), [der]: down(der) }, ql: { [izq]: legDown(izq), [der]: legDown(der) }, brazo: R[izq + ' UpperArm'].p.distanceTo(R[izq + ' Hand'].p), hp: R.Head.p.clone(), alto: P(by(bones, 'Head')).y };
  }
  // pone el hueso n con orientación mundial (espacio del cuerpo) = q * reposo
  function pon(rig, n, q, padreQ) {
    const r = rig.R[n]; if (!r) return; const pw = padreQ || r.pw;
    qa.copy(q).multiply(r.w); r.b.quaternion.copy(qb.copy(pw).invert().multiply(qa)); return qa.clone();
  }
  const QX = (a) => new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), a), QZ = a => new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), a);
  function aplicaPose(rig, pz) { // pz: {armL:Euler/Quaternion, armR, legL, legR, head, codoL, codoR, rodL, rodR}
    const lado = (s, prox, codo) => {
      const qArm = new T.Quaternion().copy(prox).multiply(rig.qd[s]);
      const wU = pon(rig, s + ' UpperArm', qArm);
      const qF = new T.Quaternion().copy(prox).multiply(QX(-codo)).multiply(rig.qd[s]);
      const fw = new T.Quaternion().copy(qF).multiply(rig.R[s + ' Forearm'].w); rig.R[s + ' Forearm'].b.quaternion.copy(wU.clone().invert().multiply(fw));
    };
    lado(rig.izq, pz.armL, pz.codoL ?? 0.25); lado(rig.der, pz.armR, pz.codoR ?? 0.25);
    const pierna = (s, prox, rod) => { const qT = new T.Quaternion().copy(prox).multiply(rig.ql[s]); const wT = pon(rig, s + ' Thigh', qT); const qC = new T.Quaternion().copy(prox).multiply(QX(rod || 0)).multiply(rig.ql[s]); const cw = qC.multiply(rig.R[s + ' Calf'].w); rig.R[s + ' Calf'].b.quaternion.copy(wT.clone().invert().multiply(cw)); };
    pierna(rig.izq, pz.legL, pz.rodL); pierna(rig.der, pz.legR, pz.rodR);
    if (pz.head) pon(rig, 'Head', pz.head);
  }
  // ---------------- figura con la interfaz de los monigotes ----------------
  const vivos = new Set();
  function elige(o) {
    if (o.avatar) return o.avatar; const l = LISTA[o.g === 'f' ? 'f' : 'm']; return l[hashS(o.seed ?? Math.random()) % l.length];
  }
  function persona(o = {}) {
    const name = elige(o), root = new T.Group(), body = new T.Group(); root.add(body); root.name = 'persona3d';
    const mk = (x, y) => { const g = new T.Group(); g.position.set(x, y, 0); body.add(g); return g; };
    const legL = mk(-0.1, 0.9), legR = mk(0.1, 0.9), armL = mk(-0.2, 1.42), armR = mk(0.2, 1.42), head = mk(0, 1.66);
    armL.rotation.z = -0.12; armR.rotation.z = 0.12;
    const fig = { root, body, legL, legR, armL, armR, head, walkPhase: 0, gesture: 0, gestureType: '', t: Math.random() * 10, p3d: { rb: name, listo: false, blinkT: 1 + Math.random() * 3, blink: 0, mouth: 0, mT: 0, ph: Math.random() * 9 } };
    cargaPack(name).then(H => {
      const { bones, raices, sk } = esqueleto(H), arm = new T.Group(); raices.forEach(b => arm.add(b));
      const rig = preparaRig(arm, bones); body.add(arm);
      const ms = mats(H), meshes = H.prims.map((p, i) => { const m = new T.SkinnedMesh(p.geo, ms[i]); m.bind(sk, new T.Matrix4()); m.frustumCulled = false; if (p.geo.morphAttributes.position) m.updateMorphTargets(); arm.add(m); return m; });
      const s = o.alto || 1; arm.scale.setScalar(s);
      // proxies en su sitio real (bocadillos, micro, etc.)
      const sp = (g, n) => { const r = rig.R[n]; if (r) g.position.copy(r.p).multiplyScalar(s); };
      sp(armL, rig.izq + ' UpperArm'); sp(armR, rig.der + ' UpperArm'); sp(legL, rig.izq + ' Thigh'); sp(legR, rig.der + ' Thigh'); sp(head, 'Head'); head.position.y += 0.08 * s;
      if (o.mic) { const mg = new T.Group(), a = new T.Mesh(new T.CylinderGeometry(0.016, 0.012, 0.17, 8), new T.MeshLambertMaterial({ color: 0x222222 })), b = new T.Mesh(new T.SphereGeometry(0.032, 10, 8), new T.MeshLambertMaterial({ color: 0x9a9a9a, emissive: 0x222222 })); b.position.y = 0.1; mg.add(a, b); mg.position.set(0, -rig.brazo * s - 0.02, 0.06); mg.rotation.x = -0.5; armR.add(mg); }
      Object.assign(fig.p3d, { rig, meshes, arm, listo: true, ojos: meshes.filter(m => m.morphTargetDictionary && 'blink' in m.morphTargetDictionary), boca: meshes.filter(m => m.morphTargetDictionary && 'aa' in m.morphTargetDictionary) });
    }).catch(e => console.warn('[p3d]', e));
    vivos.add(fig); arranca(); return fig;
  }
  let habla = () => false, raf = 0; const ex = new T.Euler(), qh = new T.Quaternion();
  function tick() {
    raf = requestAnimationFrame(tick); const now = performance.now();
    for (const fig of vivos) {
      const p = fig.p3d; if (!p.listo) continue; const dt = Math.min(0.1, (now - (p.last || now)) / 1000); p.last = now;
      if (!fig.root.parent) { if ((p.lejos = (p.lejos || 0) + dt) > 30) vivos.delete(fig); continue; } p.lejos = 0; p.ph += dt; const t = p.ph, h = habla(fig.head);
      // cabeza: proxy + vaivén natural; brazos y piernas: proxies de los monigotes
      ex.set(fig.head.rotation.x + Math.sin(t * 0.5) * 0.03 + (h ? Math.sin(t * 5.2) * 0.035 : 0), fig.head.rotation.y + Math.sin(t * 0.37) * 0.09 + Math.sin(t * 1.13) * 0.025, fig.head.rotation.z + Math.sin(t * 0.29) * 0.025);
      const brazo = g => new T.Quaternion().setFromEuler(g.rotation);
      const resp = Math.sin(t * 1.6) * 0.012;
      aplicaPose(p.rig, { armL: brazo(fig.armL), armR: brazo(fig.armR), legL: brazo(fig.legL), legR: brazo(fig.legR), head: qh.setFromEuler(ex), codoL: 0.22 + resp, codoR: 0.22 + resp });
      const sp = p.rig.R.Spine2; if (sp) sp.b.scale.set(1 + resp * 0.8, 1, 1 + resp * 1.4);
      // parpadeo y labios (gestos faciales del propio modelo)
      p.blinkT -= dt; if (p.blinkT < 0) { p.blink = 0.16; p.blinkT = 2 + Math.random() * 4; } if (p.blink > 0) p.blink -= dt;
      const bk = p.blink > 0 ? Math.sin((1 - p.blink / 0.16) * Math.PI) : 0;
      if (h) { p.mT -= dt; if (p.mT <= 0) { p.mObj = Math.random() < 0.25 ? 0 : 0.35 + Math.random() * 0.65; p.oObj = Math.random() < 0.3 ? Math.random() * 0.7 : 0; p.mT = 0.07 + Math.random() * 0.09; } } else { p.mObj = 0; p.oObj = 0; }
      p.mouth += ((p.mObj || 0) - p.mouth) * Math.min(1, dt * 22); p.oo = (p.oo || 0) + ((p.oObj || 0) - (p.oo || 0)) * Math.min(1, dt * 18);
      for (const m of p.meshes) { const d = m.morphTargetDictionary; if (!d) continue; const inf = m.morphTargetInfluences; if ('blink' in d) inf[d.blink] = bk; if ('aa' in d) inf[d.aa] = p.mouth * 0.8; if ('oo' in d) inf[d.oo] = p.oo * 0.6; if ('smile' in d) inf[d.smile] = 0.18 + (fig.gestureType === 'arriba' || fig.gestureType === 'aplaude' ? 0.4 * Math.min(1, fig.gesture) : 0); }
    }
  }
  function arranca() { if (!raf) raf = requestAnimationFrame(tick); }
  // ---------------- público: instancias con poses horneadas (sentado, aplauso abierto/cerrado, brazos arriba, de pie) ----------------
  const posesPub = {
    base: { armL: [-0.12, 0, -0.1], armR: [-0.12, 0, 0.1], codo: 1.1, sentado: 1 },
    clapA: { armL: [-0.95, 0, -0.32], armR: [-0.95, 0, 0.32], codo: 1.05, sentado: 1 },
    clapB: { armL: [-0.95, 0, 0.12], armR: [-0.95, 0, -0.12], codo: 1.05, sentado: 1 },
    arriba: { armL: [-2.75, 0, -0.3], armR: [-2.75, 0, 0.3], codo: 0.25, sentado: 1 },
    depie: { armL: [-0.32, 0, -0.06], armR: [-0.32, 0, 0.06], codo: 1.25, sentado: 0 }
  };
  const bakeCache = {};
  async function bakePublico(name) {
    if (bakeCache[name]) return bakeCache[name];
    const H = await cargaPack(name), { bones, raices } = esqueleto(H), arm = new T.Group(); raices.forEach(b => arm.add(b));
    const rig = preparaRig(arm, bones), pel = rig.R.Pelvis.p.y, prims = H.prims.filter(p => !/glasses/.test(p.mat));
    // vértices usados por el LOD, compactados, uv al atlas (cuerpo | cabeza | pelo)
    const mapa = [], idx = [], uvs = [], src = [];
    prims.forEach(p => { const slot = /_body/.test(p.mat) ? 0 : /_head/.test(p.mat) ? 1 : 2, rem = new Map(); for (const v of p.lodA) { if (!rem.has(v)) { rem.set(v, src.length); src.push([p, v]); uvs.push((Math.min(0.999, Math.max(0.001, p.uvA[v * 2])) + slot) / 3, Math.min(0.999, Math.max(0.001, p.uvA[v * 2 + 1]))); } idx.push(rem.get(v)); } });
    const N = src.length, M = bones.map(() => new T.Matrix4()), v = new T.Vector3(), acc = new T.Vector3(), tmp = new T.Vector3();
    const pose = def => {
      const e = a => new T.Quaternion().setFromEuler(new T.Euler(a[0], a[1], a[2]));
      arm.position.set(0, 0, 0); arm.updateMatrixWorld(true);
      // sentado: muslos hacia delante, gemelos abajo, cadera a 0.5 m
      aplicaPose(rig, { armL: e(def.armL), armR: e(def.armR), codoL: def.codo, codoR: def.codo, legL: def.sentado ? QX(-1.5) : new T.Quaternion(), legR: def.sentado ? QX(-1.5) : new T.Quaternion(), rodL: def.sentado ? 1.5 : 0, rodR: def.sentado ? 1.5 : 0 });
      arm.position.y = def.sentado ? 0.5 - pel : 0; arm.updateMatrixWorld(true);
      bones.forEach((b, i) => M[i].multiplyMatrices(b.matrixWorld, H.ibmM[i]));
      const out = new Float32Array(N * 3), nrm = new Float32Array(N * 3);
      src.forEach(([p, vi], k) => { v.fromArray(p.posA, vi * 3); acc.set(0, 0, 0); const n0 = tmp.set(p.nrmA[vi * 3] / 127, p.nrmA[vi * 3 + 1] / 127, p.nrmA[vi * 3 + 2] / 127), nn = new T.Vector3();
        for (let c = 0; c < 4; c++) { const w = p.wA[vi * 4 + c] / 255; if (!w) continue; const m = M[p.jA[vi * 4 + c]]; acc.addScaledVector(v.clone().applyMatrix4(m), w); nn.addScaledVector(n0.clone().transformDirection(m), w); }
        acc.toArray(out, k * 3); nn.normalize().toArray(nrm, k * 3); });
      return { out, nrm };
    };
    const b0 = pose(posesPub.base), g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(b0.out, 3)); g.setAttribute('normal', new T.BufferAttribute(b0.nrm, 3)); g.setAttribute('uv', new T.BufferAttribute(new Float32Array(uvs), 2)); g.setIndex(idx);
    g.morphAttributes.position = ['clapA', 'clapB', 'arriba', 'depie'].map(k => { const o = pose(posesPub[k]).out; for (let i = 0; i < o.length; i++) o[i] -= b0.out[i]; return new T.BufferAttribute(o, 3); }); g.morphTargetsRelative = true;
    g.computeBoundingSphere();
    return bakeCache[name] = { geo: g, atlas: tex(base + name + '.atlas.webp') };
  }
  return p3dRB._api = { LISTA, persona, cargaPack, bakePublico, setHabla: f => { habla = f; }, vivos, todos: () => [...LISTA.m, ...LISTA.f] };
}
if (typeof window !== 'undefined') window.p3dRB = p3dRB;

/*P3D-FIN*/
