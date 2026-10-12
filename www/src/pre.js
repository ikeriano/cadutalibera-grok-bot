// ===================================================================================================
// ¡Ahora caigo! El juego 3D · versión web (GitHub Pages) del APK de Iker.
// Capa de recursos añadida al código del APK: las imágenes y sonidos del proyecto de Scratch (sb3/),
// la cabecera en vídeo y el minijuego clásico NO están en la web pública (pueden tener derechos).
//  · Versión completa (ahoracaigo3d_completo.zip): van en sb3/img, sb3/snd (+ sb3/snd.js para abrir con
//    doble clic), cabecera/ y clasico/.
//  · Web: Opciones › «Cargar músicas» con ahoracaigo_sonidos.zip → se guardan en IndexedDB de este
//    dispositivo. Mientras no se carguen, el juego dibuja sus propios gráficos de respaldo y sintetiza
//    los efectos básicos.
// ===================================================================================================
import { unzipSync } from 'fflate';

let LOGO_IMG = null; // logo cargado por el usuario (Opciones › Logo)
// ---------------- utilidades de audio: WAV IMA-ADPCM de Scratch → WAV PCM (decodeAudioData no lee ADPCM) ----------------
const ADPCM_STEP = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
const ADPCM_IDX = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
function wavPCM16(samples, rate) {
  const n = samples.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, samples[i], true);
  return buf;
}
/** Si es un WAV ADPCM (formato 17, mono) lo devuelve convertido a PCM 16 bits; si no, null */
function adpcmAPcm(u8) {
  try {
    const v = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    if (v.getUint32(0) !== 0x52494646 || v.getUint32(8) !== 0x57415645) return null;
    let p = 12, fmt = null, data = null;
    while (p + 8 <= u8.length) { const id = String.fromCharCode(u8[p], u8[p + 1], u8[p + 2], u8[p + 3]); const len = v.getUint32(p + 4, true); if (id === 'fmt ') fmt = p + 8; else if (id === 'data') data = [p + 8, Math.min(len, u8.length - p - 8)]; p += 8 + len + (len & 1); }
    if (!fmt || !data || v.getUint16(fmt, true) !== 17 || v.getUint16(fmt + 2, true) !== 1) return null;
    const rate = v.getUint32(fmt + 4, true), block = v.getUint16(fmt + 12, true); const out = [];
    for (let b = data[0]; b + 4 <= data[0] + data[1]; b += block) {
      let s = v.getInt16(b, true), idx = Math.min(88, u8[b + 2]); out.push(s); const fin = Math.min(b + block, data[0] + data[1]);
      for (let k = b + 4; k < fin; k++) for (const nib of [u8[k] & 15, u8[k] >> 4]) {
        const st = ADPCM_STEP[idx]; let d = st >> 3; if (nib & 4) d += st; if (nib & 2) d += st >> 1; if (nib & 1) d += st >> 2;
        s += nib & 8 ? -d : d; s = Math.max(-32768, Math.min(32767, s)); idx = Math.max(0, Math.min(88, idx + ADPCM_IDX[nib])); out.push(s);
      }
    }
    return new Uint8Array(wavPCM16(out, rate));
  } catch (e) { return null; }
}
const TIPOS = { mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac', webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', mp4: 'video/mp4' };
const normNom = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\.(mp3|wav|ogg|m4a|aac|png|svg|jpe?g|webp|gif)$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Nombres en español de los sonidos del Scratch (y alias para reconocer archivos sueltos: «acierto.mp3», «fallo.wav»…)
const SND_ES = {
  'Trilha': ['Sintonía (menú y plató)', 'Músicas', 'sintonia musica menu'], 'TrilhaCurta': ['Sintonía corta', 'Músicas', 'sintonia corta'], 'TemaCurto': ['Tema corto (pantalla de inicio)', 'Músicas', 'tema corto inicio'],
  'Intro': ['Intro del minijuego', 'Músicas', ''], 'Intro2': ['Intro 2 del minijuego', 'Músicas', ''],
  'AcerteOuCaia Susp.mp3': ['Suspense «Ahora caigo»', 'Músicas', 'suspense acierta o cae'], 'AcerteOuCaia SuspEdit': ['Suspense «Ahora caigo» (corto)', 'Músicas', ''],
  'AhoraCaigo - Decisão.mp3': ['Decisión: plantarse o juego final', 'Músicas', 'decision'],
  'AhoraCaigo - Intro.mp3': ['Cabecera del programa', 'Cabeceras', 'cabecera intro'], 'AhoraCaigo - Fim.mp3': ['Despedida (fin del programa)', 'Cabeceras', 'despedida fin'],
  'AhoraCaigo - ComeceDuelo.mp3': ['¡Que comience el duelo!', 'Duelo', 'comienza el duelo duelo'], 'SuspenseDuelo': ['Suspense del duelo', 'Duelo', 'suspense duelo'], 'Suspense': ['Suspense del reloj', 'Duelo', 'suspense'],
  'QuemFicaEmPé-Acerto': ['Acierto', 'Efectos', 'acierto correcto'], 'Erro': ['Fallo', 'Efectos', 'fallo error'], 'QuemFicaEmPé-SomRelogio': ['Tic-tac del reloj', 'Efectos', 'tic tac reloj'],
  '10': ['Aviso: quedan 10 segundos', 'Efectos', '10 segundos'], '5': ['Aviso: quedan 5 segundos', 'Efectos', '5 segundos'],
  'DropM.mp3': ['Trampilla (se abre)', 'Trampilla y caída', 'trampilla'], 'AhoraCaigo - Queda.mp3': ['Caída: ¡ahora cae!', 'Trampilla y caída', 'caida ahora cae'],
  'Moeda': ['Moneda (efecto)', 'Monedas', 'moneda'], 'AhoraCaigo - Moeda.mp3': ['Música de la moneda', 'Monedas', 'musica moneda'], 'fairydust': ['Brillo mágico', 'Efectos', 'brillo'],
  'pop': ['Pop', 'Efectos', ''], 'SomPalavra': ['Letra / palabra', 'Efectos', 'letra palabra'], 'saltar': ['Cambio / salto', 'Efectos', 'salto'], 'Tecla': ['Tecla (botones)', 'Efectos', 'tecla boton'],
};
for (let i = 1; i <= 8; i++) SND_ES[`AhoraCaigo - Round${i}.mp3`] = [`Duelo ${i}: entrada del oponente`, 'Duelo', `duelo ${i} ronda ${i} round ${i}`];
// Sprites del Scratch → nombre en español y grupo
const SPR_ES = [
  [/^Menu$/, 'Pantalla del logo (menú y pantallas 3D)', 'Logo, menú y pantallas'], [/^Stage$/, 'Fondo del escenario', 'Logo, menú y pantallas'], [/^Tela1b?$/, 'Pantalla grande', 'Logo, menú y pantallas'],
  [/^Setch/, 'Suelo del plató', 'Logo, menú y pantallas'], [/^gcprojetos/, 'Créditos del proyecto', 'Logo, menú y pantallas'], [/^Bot.oMenu/, 'Botón del menú', 'Logo, menú y pantallas'],
  [/^MenuEscolhaop(\d+)/, 'Huella $1', 'Huellas'], [/^MenuEscolha2$/, 'Rótulo del duelo / nº de preguntas', 'Huellas'], [/^MenuEscolha$/, 'Elección de huella', 'Huellas'], [/^Valores2$/, 'Número de huella', 'Huellas'],
  [/^Valores$/, 'Moneda (valores)', 'Monedas'], [/^Moeda1$/, 'Moneda: cara', 'Monedas'], [/^Moeda2$/, 'Moneda: cruz', 'Monedas'], [/^Gc$/, 'Gráfico de la moneda', 'Monedas'],
  [/^Gcpgt/, 'Rótulo de la pregunta', 'Rótulos'], [/^ContagemDuelos$/, 'Rótulo «Quedan N oponentes»', 'Rótulos'], [/^Painel$/, 'Panel (turno, transición, premios)', 'Rótulos'],
  [/^NvAhcg/, 'Rótulo de la decisión', 'Rótulos'], [/^EfeitoSetas$/, 'Efecto flechas', 'Rótulos'], [/^EfeitoTexto$/, 'Efecto de texto', 'Rótulos'], [/^1as1a1b3$/, 'Transición', 'Rótulos'],
  [/^Quedatela(\d+)/, 'Caída $1 (trampilla)', 'Trampilla y caída'],
  [/^RelogioDig(\d+)/, 'Dígito del reloj $1', 'Relojes'], [/^Relogio2$/, 'Barra del reloj', 'Relojes'], [/^Relogio$/, 'Reloj', 'Relojes'], [/^Teclado/, 'Botón PASA', 'Relojes'],
  [/^PlacarDig(\d+)/, 'Marcador: dígito $1', 'Marcadores'], [/^PlacarFinal$/, 'Marcador del juego final', 'Marcadores'], [/^PlacarI(\d+)/, 'Marcador del oponente $1', 'Marcadores'],
  [/^Oponente(\d+)/, 'Oponente $1', 'Oponentes y vidas'], [/^L.der$/, 'Líder', 'Oponentes y vidas'], [/^Vidas$/, 'Vidas', 'Oponentes y vidas'],
  [/^Pergunta$/, 'Pregunta en imagen', 'Preguntas en imagen'], [/^Resposta$/, 'Respuesta en imagen', 'Preguntas en imagen'],
];
const sprEs = sp => { for (const [re, n, g] of SPR_ES) if (re.test(sp)) return [sp.replace(re, n), g]; return [sp, 'Otras imágenes']; };
const RC = (() => {
  const FILE = location.protocol === 'file:';
  const DB = 'ac3d_recursos', ST = 'r';
  let dbP = null;
  const db = () => dbP || (dbP = new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = (m, f) => db().then(d => new Promise((res, rej) => { const t = d.transaction(ST, m); const s = t.objectStore(ST); const q = f(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }));
  const imgs = new Map(), snds = new Map(); let logoBlob = null, logoUrl = null, video = null, videoUrl = null, cab3d = null, cab3dBlob = null, localCab3d = false; const extras = new Map(), extrasBlob = new Map(); const EXTRAS = ['estreno', 'promo_anuncio', 'promo_estanoche', 'promo_huella'];
  const imgBlob = new Map(); const pool = new Map(); let origen = {};
  let usar = (() => { try { return localStorage.getItem('ac_usar_mios') !== '0'; } catch (e) { return true; } })();
  let localImg = false, localSnd = false, localVideo = false, localClasico = false;
  const fb = new Map(); // respaldos dibujados
  let byHash = null;
  const meta = h => { if (!byHash) { byHash = new Map(); for (const [sp, v] of Object.entries(__MANIFEST.sprites)) v.c.forEach((c, i) => { if (!byHash.has(c.f)) byHash.set(c.f, { sp, n: c.n, i, w: c.w, h: c.h }); }); } return byHash.get(h); };
  const probeImg = (src, ms = 2500) => new Promise(r => { const i = new Image(); const t = setTimeout(() => r(false), ms); i.onload = () => { clearTimeout(t); r(true); }; i.onerror = () => { clearTimeout(t); r(false); }; i.src = src; });
  const b64 = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; };
  // ---- huecos (slots) del juego, sacados del manifest del Scratch ----
  let SL = null;
  const slots = () => {
    if (SL) return SL;
    const snd = new Map(); const add = (n, h, sp) => { if (!snd.has(h)) snd.set(h, { nombres: new Set(), sprites: new Set() }); snd.get(h).nombres.add(n); sp && snd.get(h).sprites.add(sp); };
    for (const [sp, v] of Object.entries(__MANIFEST.sprites)) for (const [n, h] of Object.entries(v.s || {})) add(n, h, sp);
    for (const [n, h] of Object.entries(__MANIFEST.sounds)) add(n.replace(/@.*/, ''), h);
    const cuenta = {}; for (const [, o] of snd) for (const n of o.nombres) cuenta[n] = (cuenta[n] || 0) + 1;
    const lista = [];
    for (const [h, o] of snd) { const n = [...o.nombres][0]; const es = SND_ES[n] || [n, 'Efectos', '']; lista.push({ key: 'snd:' + h, h, kind: 'snd', nombre: n, sprites: [...o.sprites], etiqueta: es[0] + (cuenta[n] > 1 ? ` (${[...o.sprites].slice(0, 2).join(', ') || 'Stage'})` : ''), grupo: es[1], alias: es[2] }); }
    lista.push({ key: 'cab3d', kind: 'snd', nombre: 'cabecera3d', etiqueta: 'Música de la cabecera 3D', grupo: 'Cabeceras', alias: 'cabecera 3d musica cabecera' });
    for (const [k, t] of [['estreno', 'Promo «Gran estreno» (audio)'], ['promo_anuncio', 'Promo «Gran anuncio» (audio)'], ['promo_estanoche', 'Promo «Esta noche» (audio)'], ['promo_huella', 'Promo «La huella» (audio)']]) lista.push({ key: 'aud:' + k, kind: 'snd', nombre: k, etiqueta: t, grupo: 'Cabeceras', alias: '' });
    lista.push({ key: 'video', kind: 'video', nombre: 'cabecera-iker.mp4', etiqueta: 'Cabecera de Iker (vídeo mp4)', grupo: 'Cabeceras', alias: 'cabecera iker' });
    const img = [{ key: 'logo', kind: 'img', nombre: 'logo', etiqueta: 'Logo de ¡Ahora caigo! (menú y pantallas)', grupo: 'Logo, menú y pantallas', sprite: '', alias: 'logo' }]; const vistos = new Set();
    for (const [sp, v] of Object.entries(__MANIFEST.sprites)) v.c.forEach(c => { if (vistos.has(c.f) || (c.w <= 2 && c.h <= 2)) return; vistos.add(c.f); const [es, g] = sprEs(sp); img.push({ key: 'img:' + c.f, h: c.f, kind: 'img', nombre: c.n, sprite: sp, etiqueta: es + (v.c.length > 1 ? ' · ' + c.n : ''), grupo: g, w: c.w, h2: c.h }); });
    const porPar = new Map(), porNom = new Map(), sndNom = new Map(), alias = new Map();
    for (const [sp, v] of Object.entries(__MANIFEST.sprites)) v.c.forEach(c => { const key = 'img:' + c.f; if (!vistos.has(c.f) && c.f !== img[0].h) return; const kp = normNom(sp) + '|' + normNom(c.n); if (!porPar.has(kp)) porPar.set(kp, key); });
    for (const s of img) if (s.sprite) { const k = normNom(s.nombre); porNom.set(k, (porNom.get(k) || []).concat(s.key)); }
    for (const s of lista) { for (const n of (s.h ? snd.get(s.h).nombres : [s.nombre])) { const k = normNom(n); sndNom.set(k, (sndNom.get(k) || []).concat(s)); } for (const a of [s.etiqueta, ...(s.alias ? [s.alias] : [])]) { const k = normNom(a); if (k && !alias.has(k)) alias.set(k, s.key); } }
    SL = { snd: lista, img, todos: lista.concat(img), porKey: new Map(lista.concat(img).map(s => [s.key, s])), porPar, porNom, sndNom, alias };
    return SL;
  };
  const tipoDe = nombre => TIPOS[(String(nombre).split('.').pop() || '').toLowerCase()];
  const blobDe = (nombre, datos) => { const t = tipoDe(nombre); if (!t) return null; if (datos instanceof Blob) return datos.type ? datos : new Blob([datos], { type: t }); if (t === 'audio/wav') { const c = adpcmAPcm(datos); if (c) datos = c; } return new Blob([datos], { type: t }); };
  const kindDe = blob => /^audio/.test(blob.type) ? 'snd' : /^image/.test(blob.type) ? 'img' : /^video/.test(blob.type) ? 'video' : null;
  /** Hueco(s) para un archivo: {kind, nombre, sprite, hash} */
  const huecosPara = c => {
    const S = slots(), n = normNom(c.nombre);
    if (c.kind === 'video') return ['video'];
    if (c.kind === 'img') {
      if (c.hash && S.porKey.has('img:' + c.hash)) return ['img:' + c.hash];
      if (c.sprite) { const k = S.porPar.get(normNom(c.sprite) + '|' + n); if (k) return [k]; }
      if (/^logo\b/.test(n)) return ['logo'];
      const u = S.porNom.get(n); if (u && u.length === 1 && !/^\d+$/.test(n)) return u;
      const a = S.alias.get(n); if (a && S.porKey.get(a).kind === 'img') return [a];
      return [];
    }
    if (c.hash && S.porKey.has('snd:' + c.hash)) return ['snd:' + c.hash];
    if (EXTRAS.includes(String(c.nombre).replace(/\.[^.]+$/, '').toLowerCase())) return ['aud:' + String(c.nombre).replace(/\.[^.]+$/, '').toLowerCase()];
    if (n === 'cabecera3d' || n === 'cabecera 3d') return ['cab3d'];
    const l = S.sndNom.get(n); if (l && l.length) { const mismo = c.sprite ? l.filter(s => s.sprites && s.sprites.includes(c.sprite)) : []; return (mismo.length ? mismo : l).map(s => s.key); }
    const a = S.alias.get(n); if (a && S.porKey.get(a).kind === 'snd') return [a];
    return [];
  };
  const ponerMem = (key, blob) => {
    if (key.startsWith('img:')) { imgBlob.set(key.slice(4), blob); imgs.set(key.slice(4), URL.createObjectURL(blob)); }
    else if (key.startsWith('snd:')) snds.set(key.slice(4), blob);
    else if (key === 'logo') { logoBlob = blob; logoUrl = URL.createObjectURL(blob); }
    else if (key === 'video') { video = blob; videoUrl = URL.createObjectURL(blob); }
    else if (key === 'cab3d') { cab3dBlob = blob; cab3d = URL.createObjectURL(blob); }
    else if (key.startsWith('aud:')) { extrasBlob.set(key.slice(4), blob); extras.set(key.slice(4), URL.createObjectURL(blob)); }
  };
  const quitarMem = key => {
    if (key.startsWith('img:')) { imgs.delete(key.slice(4)); imgBlob.delete(key.slice(4)); }
    else if (key.startsWith('snd:')) snds.delete(key.slice(4));
    else if (key === 'logo') logoBlob = logoUrl = null; else if (key === 'video') video = videoUrl = null; else if (key === 'cab3d') cab3d = cab3dBlob = null;
    else if (key.startsWith('aud:')) { extras.delete(key.slice(4)); extrasBlob.delete(key.slice(4)); }
  };
  const blobMio = key => key.startsWith('img:') ? imgBlob.get(key.slice(4)) : key.startsWith('snd:') ? snds.get(key.slice(4)) : key === 'logo' ? logoBlob : key === 'video' ? video : key === 'cab3d' ? cab3dBlob : key.startsWith('aud:') ? extrasBlob.get(key.slice(4)) : null;
  const guardaOrigen = () => tx('readwrite', s => s.put(origen, 'origen')).catch(() => {});
  const R = {
    FILE,
    get localImg() { return localImg; }, get localSnd() { return localSnd; },
    get usar() { return usar; },
    set usar(v) { usar = !!v; try { localStorage.setItem('ac_usar_mios', usar ? '1' : '0'); } catch (e) { } },
    async init() {
      try {
        const keys = await tx('readonly', s => s.getAllKeys());
        for (const k of keys || []) {
          const v = await tx('readonly', s => s.get(k));
          if (!v) continue;
          if (k === 'origen') origen = v || {};
          else if (k.startsWith('pool:')) pool.set(k.slice(5), { ...v, url: URL.createObjectURL(v.blob) });
          else if (k.startsWith('img:') || k.startsWith('snd:') || k.startsWith('aud:') || k === 'logo' || k === 'video' || k === 'cab3d') ponerMem(k, v);
        }
      } catch (e) { /* sin IndexedDB */ }
      const lu = R.logo; if (lu) await new Promise(r => { LOGO_IMG = new Image(); LOGO_IMG.onload = LOGO_IMG.onerror = () => { if (!LOGO_IMG.naturalWidth) LOGO_IMG = null; r(); }; LOGO_IMG.src = lu; });
      const menu = __MANIFEST.sprites.Menu.c[0].f;
      [localImg, localVideo] = await Promise.all([probeImg(`./sb3/img/${menu}.webp`), FILE ? Promise.resolve(!!window.__CABECERA_LOCAL) : fetch('./cabecera/cabecera-iker.mp4', { method: 'HEAD' }).then(r => r.ok).catch(() => false)]);
      localSnd = !!window.__SND_EMB || (!FILE && await fetch(`./sb3/snd/${__MANIFEST.sounds.Trilha}.mp3`, { method: 'HEAD' }).then(r => r.ok).catch(() => false));
      localCab3d = !!window.__CAB3D_LOCAL || (!FILE && await fetch('./cabecera/cabecera3d.mp3', { method: 'HEAD' }).then(r => r.ok).catch(() => false));
      localClasico = !!window.__CLASICO_LOCAL || (!FILE && await fetch('./clasico_cl/index.html', { method: 'HEAD' }).then(r => r.ok).catch(() => false));
      return R;
    },
    estado() { return { imgs: imgs.size + (localImg ? 999 : 0), snds: snds.size + (localSnd ? 999 : 0), cargadasImg: imgs.size, cargadasSnd: snds.size, logo: !!logoBlob, video: !!video || localVideo, localImg, localSnd, clasico: localClasico, usar }; },
    tieneImagenes: () => localImg || (usar && imgs.size > 0),
    tieneSonidos: () => localSnd || (usar && snds.size > 0),
    clasico: () => localClasico,
    img(h) {
      if (usar && imgs.has(h)) return imgs.get(h);
      if (localImg) return `./sb3/img/${h}.webp`;
      if (!fb.has(h)) { const m = meta(h); fb.set(h, m ? respaldo(m) : 'data:image/gif;base64,R0lGODlhAQABAAAAACw='); }
      return fb.get(h);
    },
    /** Bytes de un sonido del sb3 (hash): cargado > incrustado (zip) > carpeta sb3/snd > null */
    async snd(h) {
      if (usar && snds.has(h)) return snds.get(h).arrayBuffer();
      if (window.__SND_EMB && window.__SND_EMB[h]) return b64(window.__SND_EMB[h]);
      if (localSnd && !FILE) { const r = await fetch(`./sb3/snd/${h}.mp3`); if (r.ok) return r.arrayBuffer(); }
      return null;
    },
    async url(u) { if (FILE) return null; try { const r = await fetch(u); return r.ok ? r.arrayBuffer() : null; } catch (e) { return null; } },
    audioExtra(n) { if (n === 'cabecera3d') return R.cab3dUrl(); return (usar && extras.get(n)) || (localCab3d ? `./cabecera/${n}.mp3` : null); },
    cab3dUrl() { return (usar && cab3d) || (localCab3d ? './cabecera/cabecera3d.mp3' : null); },
    videoUrl() { return (usar && videoUrl) || (localVideo ? './cabecera/cabecera-iker.mp4' : null); },
    // ---------------- huecos: estado, vista previa, subir, borrar ----------------
    slots,
    /** 'mio' (cargado por ti) | 'incluido' (viene en esta copia) | null (falta) */
    estadoHueco(key) {
      if (blobMio(key)) return 'mio';
      if (key.startsWith('img:')) return localImg ? 'incluido' : null;
      if (key.startsWith('snd:')) return localSnd || (window.__SND_EMB && window.__SND_EMB[key.slice(4)]) ? 'incluido' : null;
      if (key === 'logo') return window.__LOGO_LOCAL ? 'incluido' : null;
      if (key === 'video') return localVideo ? 'incluido' : null;
      if (key === 'cab3d' || key.startsWith('aud:')) return localCab3d ? 'incluido' : null;
      return null;
    },
    origen: key => origen[key] || '',
    /** URL para ver/escuchar el hueco (lo tuyo primero) */
    async vistaHueco(key) {
      const b = blobMio(key); if (b) return key.startsWith('img:') ? imgs.get(key.slice(4)) : URL.createObjectURL(b);
      if (key.startsWith('img:')) return localImg ? `./sb3/img/${key.slice(4)}.webp` : null;
      if (key.startsWith('snd:')) { const h = key.slice(4); if (window.__SND_EMB && window.__SND_EMB[h]) return URL.createObjectURL(new Blob([b64(window.__SND_EMB[h])], { type: 'audio/mpeg' })); return localSnd ? `./sb3/snd/${h}.mp3` : null; }
      if (key === 'logo') return window.__LOGO_LOCAL || null;
      if (key === 'video') return localVideo ? './cabecera/cabecera-iker.mp4' : null;
      if (key === 'cab3d') return localCab3d ? './cabecera/cabecera3d.mp3' : null;
      if (key.startsWith('aud:')) return localCab3d ? `./cabecera/${key.slice(4)}.mp3` : null;
      return null;
    },
    async ponerHueco(key, blob, de = '') { await tx('readwrite', s => s.put(blob, key)); quitarMem(key); ponerMem(key, blob); origen[key] = de; await guardaOrigen(); },
    async quitarHueco(key) { await tx('readwrite', s => s.delete(key)); quitarMem(key); delete origen[key]; await guardaOrigen(); },
    pool: () => [...pool.entries()].map(([id, v]) => ({ id, ...v })),
    async asignar(id, key) { const p = pool.get(id); if (!p) return; await R.ponerHueco(key, p.blob, (p.sprite ? p.sprite + ' / ' : '') + p.nombre); await tx('readwrite', s => s.delete('pool:' + id)); pool.delete(id); },
    async quitarPool(id) { await tx('readwrite', s => s.delete('pool:' + id)); pool.delete(id); },
    /**
     * Carga archivos: .sb3/.sprite3 (Scratch), .zip, sonidos e imágenes sueltos y vídeo mp4.
     * Cada archivo se coloca en su hueco por hash, por sprite+disfraz o por nombre; lo no reconocido va a «Sin asignar».
     */
    async cargar(files, progreso = () => {}) {
      const r = { ns: 0, ni: 0, nl: 0, nv: 0, np: 0, sb3: 0, total: 0, huecos: new Set() };
      const cands = [];
      const leerScratch = (z, nombreArch) => {
        const pj = Object.keys(z).find(n => /(^|\/)(project|sprite)\.json$/.test(n)); if (!pj) return false;
        const p = JSON.parse(new TextDecoder().decode(z[pj])); const targets = p.targets || [p];
        const dir = pj.replace(/[^/]*$/, ''); const vistos = new Set(); r.sb3++;
        for (const t of targets) {
          for (const c of t.costumes || []) { const f = c.md5ext || (c.assetId + '.' + c.dataFormat); if (vistos.has('c' + c.assetId + t.name + c.name)) continue; vistos.add('c' + c.assetId + t.name + c.name); const d = z[dir + f]; if (!d) continue; cands.push({ kind: 'img', nombre: c.name, sprite: t.name, hash: c.assetId, ext: c.dataFormat, datos: d }); }
          for (const s of t.sounds || []) { const f = s.md5ext || (s.assetId + '.' + s.dataFormat); if (vistos.has('s' + s.assetId + t.name + s.name)) continue; vistos.add('s' + s.assetId + t.name + s.name); const d = z[dir + f]; if (!d) continue; cands.push({ kind: 'snd', nombre: s.name, sprite: t.name, hash: s.assetId, ext: s.dataFormat, datos: d }); }
        }
        return true;
      };
      const suelto = (ruta, datos) => {
        const partes = ruta.split('/'); const base = partes.pop(); const ext = (base.split('.').pop() || '').toLowerCase(); const t = TIPOS[ext]; if (!t) return;
        const sin = base.replace(/\.[^.]+$/, ''); const hash = /^[0-9a-f]{32}$/i.test(sin) ? sin.toLowerCase() : null;
        const carpeta = partes.filter(x => !/^(sb3|img|snd|sonidos|imagenes|sprites|por_nombre|cabecera|sounds|costumes|disfraces)$/i.test(x)).pop() || '';
        cands.push({ kind: /^audio/.test(t) ? 'snd' : /^image/.test(t) ? 'img' : 'video', nombre: sin, sprite: carpeta, hash, ext, datos, nombreArch: base });
      };
      for (const f of files) {
        progreso('⏳ Leyendo ' + f.name + '…');
        const u8 = new Uint8Array(await f.arrayBuffer());
        const esZip = u8[0] === 0x50 && u8[1] === 0x4b;
        if (esZip) {
          const z = unzipSync(u8, { filter: e => !/(^|\/)(__MACOSX|\.)/.test(e.name) });
          if (leerScratch(z, f.name)) continue;
          for (const [n, d] of Object.entries(z)) {
            if (/\.(sb3|sprite3)$/i.test(n)) { try { leerScratch(unzipSync(d)); } catch (e) { } continue; }
            if (TIPOS[(n.split('.').pop() || '').toLowerCase()]) suelto(n, d);
          }
        } else suelto(f.name, u8);
      }
      // 1) por hash exacto; 2) por sprite+disfraz o por nombre (sin pisar lo puesto por hash en esta carga)
      const puestos = new Set(), enPool = new Set(); const pendientes = [];
      const nombreOrigen = c => (c.sprite ? c.sprite + ' / ' : '') + c.nombre;
      const guardaEn = async (key, c, blob) => { await R.ponerHueco(key, blob, nombreOrigen(c)); puestos.add(key); r.huecos.add(key); if (key === 'logo') r.nl++; else if (key === 'video') r.nv++; else if (key.startsWith('img:')) r.ni++; else r.ns++; };
      let k = 0;
      for (const c of cands) {
        if (++k % 25 === 0) progreso(`⏳ Colocando ${k}/${cands.length}…`);
        const blob = blobDe(c.nombreArch || ('x.' + c.ext), c.datos); if (!blob) continue; c.blob = blob; c.kind = kindDe(blob) || c.kind; r.total++;
        const exacto = c.hash && slots().porKey.has((c.kind === 'img' ? 'img:' : 'snd:') + c.hash);
        if (exacto) { const key = (c.kind === 'img' ? 'img:' : 'snd:') + c.hash; if (!puestos.has(key)) await guardaEn(key, c, blob); } else pendientes.push(c);
      }
      for (const c of pendientes) {
        const hs = huecosPara(c).filter(h => !puestos.has(h));
        if (hs.length) { for (const h of hs) await guardaEn(h, c, c.blob); continue; }
        if (huecosPara(c).length) continue; // ya lo tenía puesto el mismo sb3 por hash
        if (c.hash && enPool.has(c.hash)) continue; c.hash && enPool.add(c.hash);
        const id = (c.kind + ':' + (c.sprite ? c.sprite + '/' : '') + c.nombre + '#' + (c.hash || '').slice(0, 8)).slice(0, 200);
        await tx('readwrite', s => s.put({ kind: c.kind, nombre: c.nombre, sprite: c.sprite || '', blob: c.blob }, 'pool:' + id)); const old = pool.get(id); if (old) URL.revokeObjectURL(old.url);
        pool.set(id, { kind: c.kind, nombre: c.nombre, sprite: c.sprite || '', blob: c.blob, url: URL.createObjectURL(c.blob) }); r.np++;
      }
      r.huecos = r.huecos.size; return r;
    },
    async guardarLogo(f) { await R.ponerHueco('logo', f, f.name || 'logo'); },
    async quitarLogo() { await R.quitarHueco('logo'); },
    get logo() { return (usar && logoBlob && logoUrl) || window.__LOGO_LOCAL || null; },
    async borrar() { await tx('readwrite', s => s.clear()); imgs.clear(); imgBlob.clear(); snds.clear(); logoBlob = logoUrl = video = videoUrl = cab3d = cab3dBlob = null; extras.clear(); extrasBlob.clear(); pool.clear(); origen = {}; },
  };
  return R;
})();
window.__RC = RC;

// ---------------- gráficos de respaldo (dibujados por código, con la misma forma y tamaño) ----------------
function respaldo(m) {
  const c = document.createElement('canvas'); c.width = Math.max(2, m.w); c.height = Math.max(2, m.h); const g = c.getContext('2d');
  const W = c.width, H = c.height; const sp = m.sp, n = m.n;
  if (W <= 2 && H <= 2) return c.toDataURL();
  try { (RESPALDOS[sp] || RESPALDOS[sp.replace(/\d+$/, '')] || RESPALDOS._)(g, W, H, n, m); } catch (e) { /* */ }
  return c.toDataURL('image/png');
}
const _rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
function _pies(g, cx, cy, s, col = '#ffc21a') { // dos huellas (como en el logo)
  g.save(); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = s * 0.25;
  for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(cx + dx * s, cy - s * 0.18, s * 0.17, s * 0.32, dx < 0 ? -0.12 : 0.12, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx + dx * s * 1.05, cy + s * 0.42, s * 0.13, s * 0.13, 0, 0, 7); g.fill(); }
  g.restore();
}
function _fondoAzul(g, W, H) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a2a9a'); gr.addColorStop(0.5, '#1b52e6'); gr.addColorStop(1, '#06164a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function _txt(g, t, x, y, px, col = '#fff', al = 'center', peso = 900) { g.font = `${peso} ${px}px "Arial Black", Arial, sans-serif`; g.textAlign = al; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = Math.max(2, px * 0.14); g.strokeStyle = 'rgba(0,10,40,.85)'; g.strokeText(t, x, y); g.fillStyle = col; g.fillText(t, x, y); }
function _disco(g, cx, cy, r, { ring = '#f07a12', fondo = '#14161c', pies = '#ffc21a', glow = true } = {}) {
  g.save(); g.fillStyle = '#0a2a9a'; g.beginPath(); g.arc(cx, cy, r * 1.1, 0, 7); g.fill();
  const gr = g.createRadialGradient(cx, cy - r * 0.3, r * 0.1, cx, cy, r); gr.addColorStop(0, '#3a3f4a'); gr.addColorStop(1, fondo); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
  g.lineWidth = r * 0.09; g.strokeStyle = ring; if (glow) { g.shadowColor = ring; g.shadowBlur = r * 0.2; } g.beginPath(); g.arc(cx, cy, r * 0.93, 0, 7); g.stroke(); g.restore();
  if (pies) _pies(g, cx, cy, r * 0.75, pies);
}
const _eur = v => v === 'cero' ? 'PIERDE TODO' : v === 'mitad' ? '÷2' : v === 'doble' ? 'x2' : v === 'vida' ? '❤' : String(+String(v).replace('+', '')).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const VALORES_A = { 1: '+15000', 2: '+500', 3: '+1000', 4: '+7500', 5: '+1000', 6: '+15000', 7: '+2', 8: '+3000', 9: '+20000', 10: '+15000', 11: 'cero' }, VALORES_B = { 1: '+1000', 2: '+10000', 3: '+7500', 4: 'mitad', 5: '+20000', 6: '+3000', 7: '+10000', 8: '+30000', 9: 'vida', 10: 'cero', 11: '+15000' };
function _pastilla(g, x, y, w, h, t, col) { g.save(); _rr(g, x, y, w, h, h / 2); const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#fff6b0'); gr.addColorStop(0.5, col); gr.addColorStop(1, '#8a5a00'); g.fillStyle = gr; g.fill(); g.lineWidth = 2; g.strokeStyle = '#3a2400'; g.stroke(); g.restore(); _txt(g, t, x + w / 2, y + h / 2 + 1, h * 0.55, '#1a1000', 'center', 800); }
const RESPALDOS = {
  _(g, W, H) { /* transparente */ },
  Stage(g, W, H) { _fondoAzul(g, W, H); },
  Menu(g, W, H) { // pantalla con el logo (se usa también en las pantallas del plató)
    _fondoAzul(g, W, H);
    g.save(); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#ffd23a' : '#f39a12'; g.beginPath(); const y = H * 0.62, x = i * W / 8 - W * 0.06; g.moveTo(x, y); g.lineTo(x + W * 0.06, y + H * 0.06); g.lineTo(x, y + H * 0.12); g.lineTo(x + W * 0.03, y + H * 0.12); g.lineTo(x + W * 0.09, y + H * 0.06); g.lineTo(x + W * 0.03, y); g.fill(); } g.restore();
    try { const lc = ph(Math.round(W * 0.8), Math.round(H * 0.8), {}); g.drawImage(lc, W * 0.1, H * 0.02); } catch (e) { _txt(g, tituloTexto(), W / 2, H / 2, H * 0.14); }
  },
  Painel(g, W, H, n) {
    if (n === '1') { _fondoAzul(g, W, H); _disco(g, W / 2, H * 0.42, H * 0.3, { ring: '#2fbf4a', fondo: '#0a3a12', pies: '#5fff8a' }); _txt(g, 'TURNO DEL OPONENTE', W / 2, H * 0.83, H * 0.07); _txt(g, 'ESPERA A LA PRÓXIMA PREGUNTA…', W / 2, H * 0.9, H * 0.035, '#cfe0ff', 'center', 700); return; }
    if (/^Transi/.test(n)) { g.fillStyle = '#04060d'; g.fillRect(0, 0, W, H); for (const [r, c] of [[0.48, '#2fd0ff'], [0.44, '#ffd23a'], [0.4, '#f07a12']]) { g.lineWidth = H * 0.025; g.strokeStyle = c; g.shadowColor = c; g.shadowBlur = 20; g.beginPath(); g.arc(W / 2, H / 2, H * r, 0, 7); g.stroke(); } g.shadowBlur = 0; _disco(g, W / 2, H / 2, H * 0.36, { glow: false }); if (n.endsWith('2')) { g.fillStyle = '#6a6f7a'; g.fillRect(W / 2 - H * 0.05, H * 0.14, H * 0.1, H * 0.72); } return; }
    if (n === 'Placar1T') { _fondoAzul(g, W, H); const filas = [[50000], [25000, 25000], [15000, 15000, 15000], [5000, 5000, 5000, 5000], [1000, 1000, 1000, 1000, 1000]]; const ph2 = H * 0.085, pw = W * 0.135; filas.forEach((f, i) => f.forEach((v, j) => _pastilla(g, W / 2 - (f.length * pw * 1.05) / 2 + j * pw * 1.05, H * 0.08 + i * ph2 * 1.2, pw, ph2, _eur(v), '#ffd23a'))); const ult = [['❤', '#5fff8a'], ['÷2', '#ff4f4f'], ['LO PIERDES TODO', '#ff4f4f'], ['x2', '#5fff8a'], ['1', '#ffd23a']]; ult.forEach(([t, c], j) => _pastilla(g, W * 0.06 + j * W * 0.18, H * 0.71, j === 2 ? W * 0.2 : W * 0.12, ph2, t, c)); _txt(g, tituloTexto(), W / 2, H * 0.9, H * 0.06); return; }
    if (n === 'DesafioFinal') { _fondoAzul(g, W, H); _txt(g, tituloTexto(), W / 2, H * 0.14, H * 0.09); _txt(g, 'PLANTARSE', W * 0.27, H * 0.33, H * 0.055, '#ffd23a'); _txt(g, 'JUEGO FINAL', W * 0.73, H * 0.33, H * 0.055, '#ffd23a'); const lin = (x, l) => l.forEach((t, i) => _txt(g, t, x, H * 0.42 + i * H * 0.045, H * 0.03, '#fff', 'center', 700)); lin(W * 0.27, ['TERMINARÁS EL JUEGO CON', 'LA MITAD DE LO QUE HAYAS', 'ACUMULADO HASTA', 'ESTE MOMENTO']); lin(W * 0.73, ['DEBES RESPONDER 10 PREGUNTAS', 'EN 2 MINUTOS. SI LO SUPERAS', 'DOBLARÁS LO QUE HAYAS', 'ACUMULADO. SI NO LO SUPERAS,', 'LO PERDERÁS TODO']); return; }
    _fondoAzul(g, W, H);
  },
  PlacarFinal(g, W, H, n) { const k = +n || 0; for (let i = 0; i < 10; i++) { const col = i % 2, row = 4 - Math.floor(i / 2); const cx = W * (col ? 0.72 : 0.28), cy = H * (0.1 + row * 0.2), r = Math.min(W * 0.22, H * 0.09); const on = i < k; g.fillStyle = on ? '#1fbf4a' : '#5a5f6a'; g.strokeStyle = '#222'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.stroke(); _pies(g, cx, cy, r * 0.8, on ? '#d8ffe0' : '#c8ccd4'); } },
  Valores(g, W, H, n) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0b2fa8'); gr.addColorStop(1, '#c8d8ff'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#ffd23a' : '#1b52e6'; g.beginPath(); g.moveTo(i * W / 6, H * 0.3); g.lineTo(i * W / 6 + W / 12, H * 0.3); g.lineTo(i * W / 6 - W / 12 + W / 6, H * 0.55); g.lineTo(i * W / 6 - W / 12, H * 0.55); g.fill(); } g.restore();
    g.fillStyle = '#1a1d2a'; g.beginPath(); g.ellipse(W / 2, H * 0.86, W * 0.24, H * 0.06, 0, 0, 7); g.fill(); g.strokeStyle = '#2fd0ff'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#c8ccd4'; g.fillRect(W / 2 - 14, H * 0.62, 28, H * 0.22);
    const cx = W / 2, cy = H * 0.45, r = H * 0.2;
    if (n === 'MoedaCapa') { g.fillStyle = '#e8ecf4'; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); _txt(g, 'ELIGE UN LADO DE LA MONEDA', cx, H * 0.1, H * 0.035); return; }
    g.fillStyle = '#111'; g.beginPath(); g.arc(cx, cy, r, Math.PI / 2, Math.PI * 1.5); g.fill(); g.fillStyle = '#e8ecf4'; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); g.fill();
    const lado = (v, x) => { const bad = v === 'cero' || v === 'mitad'; const good = v === 'doble' || v === 'vida'; g.fillStyle = bad ? '#e0204a' : good ? '#1a9a4a' : '#e0204a'; g.beginPath(); g.arc(x, cy, r * 0.42, 0, 7); g.fill(); _txt(g, _eur(v), x, cy, r * (v === 'cero' ? 0.11 : 0.2)); };
    lado(VALORES_A[n] || '+1000', cx - r * 0.48); lado(VALORES_B[n] || '+1000', cx + r * 0.48);
  },
  Valores2(g, W, H, n) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#f4f6fa'); gr.addColorStop(1, '#9aa4b8'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, H * 0.1); g.quadraticCurveTo(W / 2, H * 0.35, W, H * 0.1); g.lineTo(W * 0.92, H); g.quadraticCurveTo(W / 2, H * 0.8, W * 0.08, H); g.closePath(); g.fill(); _txt(g, String(n), W / 2, H * 0.58, H * 0.62, '#0a1a5a'); },
  MenuEscolha(g, W, H, n) { _fondoAzul(g, W, H); g.fillStyle = '#0a1240'; g.beginPath(); g.arc(W / 2, H / 2, H * 0.47, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = n === '2' ? '#ffd23a' : '#2fd0ff'; g.stroke(); g.save(); g.translate(W * 0.08, H / 2); g.rotate(-Math.PI / 2); _txt(g, 'ELIGE', 0, 0, H * 0.08, '#ffd23a'); g.restore(); g.save(); g.translate(W * 0.92, H / 2); g.rotate(Math.PI / 2); _txt(g, 'ELIGE', 0, 0, H * 0.08, '#ffd23a'); g.restore(); _disco(g, W / 2, H / 2, H * 0.12, { glow: false }); },
  MenuEscolha2(g, W, H, n) { if (n === '1') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ff9a1a'); gr.addColorStop(0.5, '#e8500a'); gr.addColorStop(1, '#a02a00'); g.fillStyle = gr; g.fillRect(0, H * 0.22, W, H * 0.56); g.fillStyle = '#ffd23a'; g.fillRect(0, H * 0.22, W, H * 0.035); g.fillRect(0, H * 0.745, W, H * 0.035); g.font = `900 ${H * 0.24}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = H * 0.06; g.strokeStyle = '#000000'; g.strokeText('¡QUÉ COMIENCE EL DUELO!', W / 2, H / 2, W * 0.94); g.fillStyle = '#ffffff'; g.fillText('¡QUÉ COMIENCE EL DUELO!', W / 2, H / 2, W * 0.94); return; } const r = Math.min(W, H) * 0.47; g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(W / 2, H / 2, r, 0, 7); g.fill(); g.fillStyle = '#1a1d2a'; g.beginPath(); g.arc(W / 2, H / 2, r * 0.92, 0, 7); g.fill(); g.fillStyle = '#9aa4b8'; g.beginPath(); g.arc(W / 2, H / 2, r * 0.92, Math.PI, 0); g.fill(); _txt(g, String(n), W / 2, H * 0.45, r * 1.05, '#f4f6fa'); _txt(g, 'PREGUNTAS', W / 2, H * 0.78, r * 0.17); },
  MenuEscolhaop(g, W, H, n) { const usado = n === '2'; const r = Math.min(W, H) * 0.47; g.fillStyle = usado ? '#3a0408' : '#05070f'; g.beginPath(); g.arc(W / 2, H / 2, r, 0, 7); g.fill(); g.lineWidth = r * 0.08; g.strokeStyle = usado ? '#ff3030' : '#c99a2a'; g.shadowColor = g.strokeStyle; g.shadowBlur = usado ? 14 : 4; g.beginPath(); g.arc(W / 2, H / 2, r * 0.72, 0, 7); g.stroke(); g.shadowBlur = 0; _pies(g, W / 2, H / 2, r * 0.55, usado ? '#8a2020' : '#f0a020'); },
  ContagemDuelos(g, W, H, n) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2a3a8a'); gr.addColorStop(1, '#0a1240'); g.fillStyle = gr; g.fillRect(0, H * 0.2, W, H * 0.6); g.fillStyle = '#ffd23a'; g.fillRect(0, H * 0.2, W, 3); g.fillRect(0, H * 0.8 - 3, W, 3);
    if (n === 'GcPerdeu') return _txt(g, 'FIN DEL JUEGO!', W / 2, H / 2, H * 0.36, '#ffe0e0');
    if (n === 'GcDueloFinal') return _txt(g, 'JUEGO FINAL', W / 2, H / 2, H * 0.36, '#fff6c8');
    const q = n === '0' ? 8 : 8 - (+n || 0); _txt(g, q === 1 ? `QUEDA  ${q}  OPONENTE` : `QUEDAN  ${q}  OPONENTES`, W / 2, H / 2, H * 0.22);
  },
  Relogio2(g, W, H) { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(192,16,42,0)'); gr.addColorStop(0.5, '#c0102a'); gr.addColorStop(1, '#ff3030'); g.fillStyle = gr; g.fillRect(0, H * 0.86, W, H * 0.05); _rr(g, W * 0.765, H * 0.76, W * 0.2, H * 0.23, H * 0.11); const cg = g.createLinearGradient(0, H * 0.76, 0, H); cg.addColorStop(0, '#ff5a5a'); cg.addColorStop(1, '#8a0a1a'); g.fillStyle = cg; g.fill(); g.lineWidth = 3; g.strokeStyle = '#ffd0d0'; g.stroke(); },
  Relogio(g, W, H) { _rr(g, 2, 2, W - 4, H - 4, H / 2); g.fillStyle = '#c0102a'; g.fill(); },
  RelogioDig(g, W, H, n) { _txt(g, n === '10' ? '0' : n, W / 2, H / 2, H * 0.9, '#ffd0d0', 'center', 700); },
  PlacarDig(g, W, H, n) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffe08a'); gr.addColorStop(1, '#f07a12'); g.font = `900 ${H * 0.95}px "Arial Black", Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 5; g.strokeStyle = '#5a2a00'; g.strokeText(n === '10' ? '0' : n, W / 2, H / 2 + 2); g.fillStyle = gr; g.fillText(n === '10' ? '0' : n, W / 2, H / 2 + 2); },
  PlacarI(g, W, H, n, m) { g.fillStyle = 'rgba(10,10,30,.75)'; const k = +m.sp.replace('PlacarI', ''); g.fillRect(0, 0, W, H); },
  Moeda(g, W, H, n, m) { const izq = m.sp === 'Moeda1'; const cx = izq ? W : 0, r = H / 2; g.save(); g.beginPath(); g.rect(izq ? 0 : 0, 0, W, H); g.clip(); g.fillStyle = '#c8ccd4'; g.beginPath(); g.arc(cx, H / 2, r * 0.98, 0, 7); g.fill(); g.fillStyle = izq ? '#f4f6fa' : '#8a8f9a'; g.beginPath(); g.arc(cx, H / 2, r * 0.85, 0, 7); g.fill(); g.restore(); g.save(); g.translate(izq ? W * 0.55 : W * 0.45, H / 2); g.fillStyle = izq ? '#111' : '#fff'; g.beginPath(); g.ellipse(0, -H * 0.08, W * 0.17, H * 0.2, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, H * 0.2, W * 0.12, H * 0.1, 0, 0, 7); g.fill(); g.restore(); },
  Gcpgt(g, W, H, n) { const gold = n === 'Final'; const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, gold ? '#ffd23a' : '#2a5ae6'); gr.addColorStop(1, gold ? '#b86a00' : '#0a1a7a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.globalAlpha = 0.35; _pies(g, W * 0.08, H * 0.5, H * 0.5, '#fff'); _pies(g, W * 0.92, H * 0.5, H * 0.5, '#fff'); g.globalAlpha = 1; },
  Gc(g, W, H) { const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2); gr.addColorStop(0, '#2a6aff'); gr.addColorStop(1, '#06164a'); g.fillStyle = gr; g.fillRect(0, 0, W, H); _rr(g, W * 0.2, H * 0.35, W * 0.6, H * 0.3, H * 0.15); g.fillStyle = '#05070f'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#2fd0ff'; g.stroke(); },
  'BotãoMenu'(g, W, H, n) { if (n === '1') { _rr(g, 4, 4, W - 8, H - 8, H / 2); g.fillStyle = 'rgba(255,255,255,.08)'; g.fill(); return; } const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); _disco(g, W / 2, H / 2, H * 0.15, { glow: false }); },
  Vidas(g, W, H, n) { const tot = n.startsWith('3') || n.endsWith('b') ? 3 : 2; const verdes = parseInt(n) || 0; for (let i = 0; i < tot; i++) { const cy = H - (i + 0.5) * H / tot, r = Math.min(W, H / tot) * 0.45; const on = i < verdes; g.fillStyle = on ? '#1fbf4a' : '#e0203a'; g.beginPath(); g.arc(W / 2, cy, r, 0, 7); g.fill(); g.lineWidth = 3; g.strokeStyle = '#111'; g.stroke(); _pies(g, W / 2, cy, r * 0.8, '#0a2a12'); } },
  Teclado(g, W, H, n) { if (W < 4) return; _rr(g, 1, 1, W - 2, H - 2, 4); g.fillStyle = '#e8ecf4'; g.fill(); _txt(g, 'PASA', W / 2, H / 2 + 1, H * 0.7, '#1a2a6a', 'center', 900); },
  Tela(g, W, H) { _fondoAzul(g, W, H); },
  Pergunta(g, W, H, n, m) { // pregunta en imagen: se dibuja con el texto de la pregunta y la palabra
    const i = m.i; const q = (typeof kv !== 'undefined' && kv[i]) || ''; const a = (window.__RESP_KV || [])[i] || n;
    g.font = `700 ${H * 0.16}px Arial`; g.textAlign = 'center'; g.fillStyle = '#fff'; g.textBaseline = 'top';
    const pal = q.split(' '); const lin = []; let l = ''; for (const w of pal) { if (g.measureText(l + ' ' + w).width > W * 0.95) { lin.push(l); l = w; } else l = l ? l + ' ' + w : w; } lin.push(l); lin.slice(0, 2).forEach((t, k) => g.fillText(t, W / 2, H * 0.02 + k * H * 0.18));
    const s = [...a]; const bw = Math.min(W / (s.length + 1), H * 0.36); s.forEach((ch, k) => { if (ch === ' ') return; const x = W / 2 - s.length * bw / 2 + k * bw; _rr(g, x + 1, H * 0.55, bw - 2, H * 0.4, 3); const gr = g.createLinearGradient(0, H * 0.55, 0, H * 0.95); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#b8bcc8'); g.fillStyle = gr; g.fill(); g.fillStyle = '#1a2a6a'; g.font = `500 ${H * 0.3}px Arial`; g.textBaseline = 'middle'; g.fillText(ch, x + bw / 2, H * 0.76); });
  },
};

// Respuestas de las 80 preguntas en imagen del APK (para jugarlas como texto si no hay imágenes)
const RESP_KV = ['ARROZ','AZÚCAR','SUPERMAN','ITALIANA','NUEVA YORK','ESTRELLAS','DESARROLLO','BAYONETA','KYLIE JENNER','DONATELLO',
  'HERÁCLITO','XIX','FÚTBOL','BALÓN DE ORO','FALLAS','DUROS','NINA SIMONE','MAÍZ','GUERRA CIVIL','LA PALMA',
  'TIMANFAYA','CORAZÓN','EN FALSO','REINO UNIDO','LIMPIOS','TESIS','RAYO','JURAMENTO','ADELANTO','HUMITA',
  'CALENTONA','PALILLO','GHOST','OPIO','MONOPOLY','MINAGE','LAGO DE COMO','MADAGASCAR','ALGA','GEORGIA',
  'XV','VERANO','GATO','LEÓN','ENFERMERA','POLIEDRO','GOLPES BAJOS','RAE','GORRO','PABLO',
  'PILOTO','HAMILTON','SURF','URGENCIAS','TRINEO','CERDO','VESTIDO','ATLÁNTICO','HUMO','FEBRERO',
  'AJEDREZ','ELÉCTRICA','HAWAIANO','BLANCO','NARANJAS','CUCARACHA','RÍO','GUIPÚZCOA','DÁKITI','AUDITIVO',
  'SMÉAGOL','VLAD TEPES','MARIPOSA','PISA','PUSKÁS','JULIO CÉSAR','LUIS XIV','MORSA','PRETTY WOMAN','NATHY PELUSO'];
window.__RESP_KV = RESP_KV;
function preguntaTexto(a, e) {
  const word = RESP_KV[a - 1] || e.n; const faltan = e.n.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '').split('');
  const nrm = ch => ch.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const hidden = [...word].map(ch => ch !== ' ' && faltan.includes(nrm(ch)));
  const missing = []; [...word].forEach((ch, i) => { if (hidden[i]) { const u = nrm(ch); u && !missing.includes(u) && missing.push(u); } });
  return { id: 'sb3-' + a, kind: 'txt', text: kv[a - 1], word, hidden, missing };
}
// voz sin Web Audio (abriendo index.html con doble clic no se pueden leer ficheros con fetch)
function audioDirecto(url, vol, tag, se) {
  const el = new Audio(url); el.volume = Math.max(0, Math.min(1, vol || 1));
  const stopper = { stop() { try { el.pause(); } catch (e) { } el.onended && el.onended(); } };
  se.playing.add(stopper); if (tag) { se.tags.has(tag) || se.tags.set(tag, new Set()); se.tags.get(tag).add(stopper); }
  const done = new Promise(r => { el.onended = () => { se.playing.delete(stopper); r(); }; el.onerror = () => r(); });
  return el.play().then(() => ({ dur: el.duration || 1, done })).catch(() => ({ dur: -1, done: Promise.resolve() }));
}
