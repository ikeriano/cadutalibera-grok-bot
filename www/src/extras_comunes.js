// ===== Extras comunes 1.15 / 1.2: Mis hashtags · Creador de promos · Guardar logo PNG · Voz Piper sin conexión =====
// Sin speechSynthesis: la voz en off sale de Piper (sherpa-onnx WebAssembly, es_ES-davefx-medium) dentro de la app;
// si el dispositivo no puede con WebAssembly, se concatenan piezas de palabras pregrabadas del presentador.
function crearExtras(cfg) {
  const P = cfg.pref, $ = (t, css, html) => { const d = document.createElement(t); if (css) d.style.cssText = css; if (html != null) d.innerHTML = html; return d; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = m => { try { cfg.toast(m); } catch (e) { } };
  const LSJ = (k, d) => { try { return JSON.parse(localStorage.getItem(P + '_' + k)) || d; } catch (e) { return d; } };
  const LSG = (k, v) => { try { localStorage.setItem(P + '_' + k, JSON.stringify(v)); } catch (e) { } };
  const C1 = cfg.color || '#f5c542', C2 = cfg.color2 || '#0a1a5a';
  const sinTeclas = z => { z.addEventListener('keydown', e => e.stopPropagation()); z.addEventListener('pointerup', e => e.stopPropagation()); return z; };
  const inp = (v, ph, max = 60) => sinTeclas(Object.assign($('input', 'width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid #888;background:#111a;color:#fff;font:15px system-ui'), { type: 'text', value: v || '', placeholder: ph, maxLength: max }));
  const sel = (ops, v) => { const s = sinTeclas($('select', 'width:100%;padding:8px;border-radius:8px;background:#111;color:#fff;font:15px system-ui')); for (const [k, t] of ops) { const o = $('option'); o.value = k; o.textContent = t; if (k === v) o.selected = true; s.appendChild(o); } return s; };
  const btn = (t, fn, prim) => { const b = $('button', `margin:4px;padding:9px 14px;border-radius:10px;border:2px solid ${C1};background:${prim ? C1 : 'transparent'};color:${prim ? '#111' : '#fff'};font:bold 14px system-ui;cursor:pointer`); b.innerHTML = t; b.onclick = e => { e.stopPropagation(); fn(b); }; return b; };
  function capa(titulo) { // ventana a pantalla completa propia
    const o = $('div', `position:fixed;inset:0;z-index:99990;background:#000d;display:flex;align-items:center;justify-content:center;font:15px system-ui;color:#fff`);
    const v = $('div', `width:min(760px,94vw);max-height:92vh;overflow:auto;background:linear-gradient(${C2},#05081a);border:2px solid ${C1};border-radius:16px;padding:14px 16px;box-sizing:border-box`);
    v.appendChild($('div', `font:bold 20px system-ui;color:${C1};margin-bottom:8px`, esc(titulo))); o.appendChild(v); document.body.appendChild(o);
    ['pointerdown', 'pointerup', 'click', 'keydown', 'wheel', 'touchstart'].forEach(ev => o.addEventListener(ev, e => e.stopPropagation()));
    return { o, v, cierra: () => o.remove() };
  }

  // ---------- Guardar archivos (Android: puente MediaStore; web: enlace de descarga) ----------
  async function guardar(nombre, blob, carpeta) {
    const N = window.AppNativo;
    if (N && N.guardarArchivo) {
      const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(blob); });
      const res = N.guardarArchivo(nombre, blob.type || 'application/octet-stream', b64, carpeta || 'Download');
      toast(String(res).startsWith('ok') ? 'Guardado en ' + String(res).slice(3) : 'No se pudo guardar: ' + res); return res;
    }
    const a = $('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast('Descargando ' + nombre); return 'ok:' + nombre;
  }

  // ---------- Guardar logo (PNG transparente, 2048 px) ----------
  const limpio = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'logo';
  async function logoPNG(v) { const c = await cfg.logoCanvas(2048, v); return await new Promise(r => c.toBlob(r, 'image/png')); }
  async function guardarLogo(v) { const b = await logoPNG(v); return guardar(`logo-${P}-${limpio(v.nombre)}.png`, b, 'Pictures'); }
  function zip(archivos) { // ZIP sin compresión (store) para descargar todas las variantes de una vez en la web
    const crcT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
    const crc = d => { let c = 0xFFFFFFFF; for (let i = 0; i < d.length; i++) c = crcT[(c ^ d[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
    const partes = [], central = []; let off = 0; const te = new TextEncoder();
    for (const [nombre, d] of archivos) { const n = te.encode(nombre), c = crc(d), h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, n.length, true); partes.push(h.buffer, n, d);
      const e = new DataView(new ArrayBuffer(46)); e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x0800, true); e.setUint32(16, c, true); e.setUint32(20, d.length, true); e.setUint32(24, d.length, true); e.setUint16(28, n.length, true); e.setUint32(42, off, true); central.push(e.buffer, n); off += 30 + n.length + d.length; }
    const tam = central.reduce((s, x) => s + (x.byteLength || x.length), 0), f = new DataView(new ArrayBuffer(22)); f.setUint32(0, 0x06054b50, true); f.setUint16(8, archivos.length, true); f.setUint16(10, archivos.length, true); f.setUint32(12, tam, true); f.setUint32(16, off, true);
    return new Blob([...partes, ...central, f.buffer], { type: 'application/zip' });
  }
  async function guardarTodos() { const L = cfg.variantesLogo(); let n = 0;
    if (!(window.AppNativo && window.AppNativo.guardarArchivo)) { const A = []; for (const v of L) toast(`Preparando logo ${A.length + 1} de ${L.length}…`), A.push([`logo-${P}-${limpio(v.nombre)}.png`, new Uint8Array(await (await logoPNG(v)).arrayBuffer())]); await guardar(`logos-${P}.zip`, zip(A), 'Download'); toast(A.length + ' logos en un ZIP'); return A.length; } for (const v of L) { await guardarLogo(v); n++; await new Promise(r => setTimeout(r, 350)); } toast(n + ' logos guardados'); return n; }
  function panelLogo() {
    const w = capa('🖼 Guardar logo (PNG transparente)'); const L = cfg.variantesLogo();
    w.v.appendChild($('p', 'opacity:.8;margin:4px 0 10px', 'Exporta el logo a 2048×2048 px con fondo transparente. En Android se guarda en Imágenes; en la web se descarga.'));
    const g = $('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px');
    for (const v of L) { const c = $('div', 'background:repeating-conic-gradient(#333 0 25%,#222 0 50%) 0/16px 16px;border-radius:10px;padding:6px;text-align:center'); const im = $('img', 'width:100%;aspect-ratio:1'); cfg.logoCanvas(256, v).then(cv => im.src = cv.toDataURL()); c.append(im, $('div', 'font-size:12px;margin:4px 0', esc(v.nombre)), btn('💾 Guardar', () => guardarLogo(v))); g.appendChild(c); }
    w.v.append(g, $('div', 'margin-top:10px', ''), btn('💾 Guardar TODAS las variantes', () => guardarTodos(), true), btn('Cerrar', w.cierra));
    return w;
  }

  // ---------- Mis hashtags ----------
  const HT = () => LSJ('hashtags', { on: true, pos: 'sd', general: [cfg.hashtagDef || '#' + limpio(cfg.titulo()).replace(/-/g, '')], esp: {} });
  const htLista = (esp) => { const h = HT(); const e = (esp && h.esp[esp]) || []; const L = [...e, ...h.general].filter(Boolean); return L.length ? L : []; };
  const htActual = (t = performance.now()) => { const h = HT(); if (!h.on) return ''; const L = htLista(cfg.especial()); return L.length ? L[Math.floor(t / 6000) % L.length] : ''; };
  let bug = null, bugTimer = 0;
  function bugMostrar(on = true) {
    const h = HT(); if (!on || !h.on || !htLista(cfg.especial()).length) { if (bug) bug.style.display = 'none'; return; }
    if (!bug) { bug = $('div', 'position:fixed;z-index:9000;pointer-events:none;padding:5px 12px;border-radius:8px;font:bold clamp(12px,2.2vw,20px) system-ui;color:#fff;background:#0008;border-left:4px solid ' + C1 + ';transition:opacity .5s;text-shadow:0 1px 3px #000'); document.body.appendChild(bug); }
    const pos = { si: 'top:10px;left:10px', sd: 'top:10px;right:10px', ii: 'bottom:12px;left:10px', id: 'bottom:12px;right:10px' }[h.pos] || 'top:10px;right:10px';
    bug.style.top = bug.style.bottom = bug.style.left = bug.style.right = ''; pos.split(';').forEach(p => { const [k, v] = p.split(':'); bug.style[k] = v; });
    bug.style.display = ''; const pon = () => { const t = htActual(); if (bug.textContent !== t) { bug.style.opacity = 0; setTimeout(() => { bug.textContent = t; bug.style.opacity = 1; }, 450); } };
    pon(); clearInterval(bugTimer); bugTimer = setInterval(pon, 1000);
  }
  function bugOcultar() { clearInterval(bugTimer); if (bug) bug.style.display = 'none'; }
  function htDibuja(g, w, h, t) { // para pantallas LED / canvas de promos y cabeceras
    const s = htActual(t); if (!s) return; const H = HT(); const fs = Math.round(h * .06); g.save(); g.font = `bold ${fs}px system-ui`; const tw = g.measureText(s).width + fs;
    const x = H.pos[1] === 'i' ? fs * .6 : w - tw - fs * .6, y = H.pos[0] === 's' ? fs * .6 : h - fs * 2;
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x, y, tw, fs * 1.5); g.fillStyle = C1; g.fillRect(x, y, fs * .2, fs * 1.5); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(s, x + fs * .5, y + fs * .75); g.restore();
  }
  function panelHashtags() {
    const w = capa('# Mis hashtags'); let h = HT(); const guarda = () => { LSG('hashtags', h); bugOcultar(); };
    const pinta = () => {
      w.v.querySelectorAll('.htc').forEach(x => x.remove()); const c = $('div'); c.className = 'htc'; w.v.appendChild(c);
      const t1 = btn(h.on ? '✅ Rótulo de hashtags ACTIVADO' : '⬜ Rótulo de hashtags DESACTIVADO', () => { h.on = !h.on; guarda(); pinta(); }, h.on);
      const ps = sel([['si', '↖ Arriba izquierda'], ['sd', '↗ Arriba derecha'], ['ii', '↙ Abajo izquierda'], ['id', '↘ Abajo derecha']], h.pos); ps.onchange = () => { h.pos = ps.value; guarda(); };
      c.append(t1, $('div', 'margin:6px 0 2px', 'Posición en pantalla:'), ps);
      const bloque = (tit, arr, fijar) => {
        const b = $('div', 'margin-top:12px;padding:8px;border:1px solid #fff3;border-radius:10px'); b.appendChild($('div', `font-weight:bold;color:${C1}`, esc(tit)));
        arr.forEach((x, i) => { const r = $('div', 'display:flex;gap:6px;align-items:center;margin:4px 0'); const z = inp(x, '#hashtag', 40); z.onchange = () => { let v = z.value.trim().replace(/\s+/g, ''); if (v && v[0] !== '#') v = '#' + v; arr[i] = v; fijar(arr.filter(Boolean)); guarda(); pinta(); }; r.append(z, btn('🗑', () => { arr.splice(i, 1); fijar(arr); guarda(); pinta(); })); b.appendChild(r); });
        const nz = inp('', 'Nuevo hashtag…', 40); b.append(nz, btn('➕ Añadir', () => { let v = nz.value.trim().replace(/\s+/g, ''); if (!v) return; if (v[0] !== '#') v = '#' + v; arr.push(v); fijar(arr); guarda(); pinta(); })); return b;
      };
      c.appendChild(bloque('Generales (siempre)', h.general.slice(), a => h.general = a));
      for (const e of cfg.especiales()) if (e.id && e.id !== 'normal') c.appendChild(bloque('Especial ' + e.nombre, (h.esp[e.id] || []).slice(), a => { h.esp[e.id] = a; }));
      c.append($('p', 'opacity:.75;font-size:13px', 'Aparecen rotando en una esquina durante el Programa completo, en las promos, en las cabeceras y en las pantallas LED del plató. En un especial se muestran sus hashtags y los generales.'), btn('Cerrar', w.cierra, true));
    }; pinta(); return w;
  }

  // ---------- Voz Piper sin conexión (sherpa-onnx wasm) + piezas pregrabadas ----------
  let wk = null, wkListo = null, wkId = 0; const pend = {};
  function piper() {
    if (wkListo) return wkListo;
    wkListo = new Promise((res, rej) => {
      try { wk = new Worker((cfg.piperBase || 'piper/') + 'piper-worker.js'); } catch (e) { return rej(e); }
      const to = setTimeout(() => rej(new Error('Piper tarda demasiado')), 90000);
      wk.onmessage = e => { const d = e.data; if (d.type === 'listo') { clearTimeout(to); res(d.sampleRate); } else if (d.type === 'error' && d.id == null) { clearTimeout(to); rej(new Error(d.msg)); } else if (d.id && pend[d.id]) { const p = pend[d.id]; delete pend[d.id]; d.type === 'audio' ? p.res(d) : p.rej(new Error(d.msg)); } };
      wk.onerror = e => { clearTimeout(to); rej(new Error(e.message || 'worker')); };
    }); wkListo.catch(() => { wkListo = null; }); return wkListo;
  }
  async function vozPiper(texto, vel) { if (window.__LANG === 'it') texto = String(texto).replace(/Ahora caigo/gi, 'Caduta Libera'); await piper(); const id = ++wkId; const d = await new Promise((res, rej) => { pend[id] = { res, rej }; wk.postMessage({ id, texto, velocidad: vel || 1 }); }); const ac = cfg.audioCtx(); const b = ac.createBuffer(1, d.samples.length, d.sampleRate); b.copyToChannel(d.samples, 0); return b; }
  let PIEZAS = null; const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16).padStart(8, '0'); };
  const normPal = w => w.toLowerCase().normalize('NFC').replace(/[^a-zñáéíóúü0-9]/g, '');
  async function vozPiezas(texto) {
    const base = cfg.piezasBase || 'voz/pal/'; if (!PIEZAS) PIEZAS = await (await fetch(base + 'index.json')).json();
    const ac = cfg.audioCtx(), bufs = [];
    for (const tok of texto.split(/(\s+|[,.;:!?¡¿])/)) {
      if (/^[,.;:!?]$/.test(tok)) { bufs.push(ac.createBuffer(1, Math.round(ac.sampleRate * .22), ac.sampleRate)); continue; }
      const w = normPal(tok); if (!w) continue; const f = PIEZAS[w]; if (!f) continue;
      try { bufs.push(await ac.decodeAudioData(await (await fetch(base + f)).arrayBuffer())); bufs.push(ac.createBuffer(1, Math.round(ac.sampleRate * .03), ac.sampleRate)); } catch (e) { }
    }
    const n = bufs.reduce((s, b) => s + b.length, 0); if (!n) return null; const out = ac.createBuffer(1, n, ac.sampleRate); let o = 0; for (const b of bufs) { out.getChannelData(0).set(b.getChannelData(0), o); o += b.length; } return out;
  }
  async function voz(texto) { if (!texto || !texto.trim()) return null; try { return await vozPiper(texto); } catch (e) { console.warn('Piper wasm no disponible, uso piezas', e); try { return await vozPiezas(texto); } catch (x) { return null; } } }

  // ---------- IndexedDB de promos ----------
  let dbp = null; const DB = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open(P + '_promos', 1); r.onupgradeneeded = () => { r.result.createObjectStore('promos', { keyPath: 'id' }); r.result.createObjectStore('blobs'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (st, modo, fn) => { const d = await DB(); return new Promise((res, rej) => { const t = d.transaction(st, modo), s = t.objectStore(st); const q = fn(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const promosLista = async () => ((await tx('promos', 'readonly', s => s.getAll())) || []).sort((a, b) => b.creada - a.creada);
  const promoGuarda = p => tx('promos', 'readwrite', s => s.put(p));
  const promoBorra = async p => { await tx('promos', 'readwrite', s => s.delete(p.id)); if (p.fondo && p.fondo.blob) await tx('blobs', 'readwrite', s => s.delete(p.fondo.blob)); };
  const blobGuarda = (k, b) => tx('blobs', 'readwrite', s => s.put(b, k)); const blobLee = k => tx('blobs', 'readonly', s => s.get(k));
  const tomasLibres = () => LSJ('tomas_camlibre', []);
  async function guardarTomaCamLibre(blob) { const k = 'cl' + Date.now(); await blobGuarda(k, blob); const L = tomasLibres(); L.unshift({ k, t: new Date().toLocaleString('es-ES') }); LSG('tomas_camlibre', L.slice(0, 12)); toast('Toma guardada para el Creador de promos'); return k; }

  // ---------- Reproductor / exportador de promos ----------
  async function fondoVideo(p) {
    const f = p.fondo || { tipo: 'plato' }; const v = $('video'); v.muted = true; v.playsInline = true; v.loop = true; v.crossOrigin = 'anonymous';
    if (f.tipo === 'video' || f.tipo === 'camlibre') { const b = await blobLee(f.blob); if (!b) return null; v.src = URL.createObjectURL(b); }
    else if (f.tipo === 'cabecera') { const u = await cfg.cabeceraUrl(f.cab); if (!u) return null; v.src = u; }
    else { const cv = await cfg.platoCanvas(); if (!cv) return null; v.srcObject = cv.captureStream(30); }
    try { await v.play(); } catch (e) { } return v;
  }
  const easeOut = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  async function reproducir(p, opt = {}) {
    const W = 1280, H = 720, ac = cfg.audioCtx(); try { await ac.resume(); } catch (e) { }
    const cont = $('div', 'position:fixed;inset:0;z-index:99995;background:#000;display:flex;align-items:center;justify-content:center');
    const cv = $('canvas', 'max-width:100vw;max-height:100vh;width:100%;aspect-ratio:16/9;object-fit:contain'); cv.width = W; cv.height = H; cont.appendChild(cv);
    let parar = false; const salir = btn('✕ Salir', () => parar = true); salir.style.cssText += ';position:absolute;top:10px;left:10px'; if (!opt.sinBoton) cont.appendChild(salir);
    document.body.appendChild(cont); const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = C1; g.font = 'bold 36px system-ui'; g.textAlign = 'center'; g.fillText('Preparando la promo y la voz en off…', W / 2, H / 2); g.textAlign = 'left';
    cfg.alEmpezar && cfg.alEmpezar(p);
    const vid = await fondoVideo(p); const logo = await cfg.logoCanvas(512, p.logo === 'titulo' ? { tipo: 'titulo' } : p.logo && p.logo !== 'actual' ? { tipo: 'especial', id: p.logo } : { tipo: 'actual' });
    // audio: música + voz con ducking, hacia la salida y la grabación
    const mezcla = ac.createGain(); mezcla.connect(ac.destination); let destRec = null; if (opt.grabar) { destRec = ac.createMediaStreamDestination(); mezcla.connect(destRec); }
    const gM = ac.createGain(); gM.gain.value = .55; gM.connect(mezcla); let mus = null; const MU = cfg.musica;
    const sal = cfg.salida && cfg.salida(); if (destRec && sal && sal !== mezcla) { try { sal.connect(destRec); } catch (e) { } }
    if (p.musica && p.musica !== 'ninguna') { if (MU && MU.play) { try { MU.play(p.musica); } catch (e) { } } else if (cfg.musicaUrl) { try { const ab = await ac.decodeAudioData(await (await fetch(cfg.musicaUrl(p.musica))).arrayBuffer()); mus = ac.createBufferSource(); mus.buffer = ab; mus.loop = true; mus.connect(gM); mus.start(); } catch (e) { } } }
    const textoVoz = p.voz === false ? '' : (p.textoVoz || [p.titulo, ...(p.lineas || []), [p.dia, p.hora].filter(Boolean).join(', a las ')].filter(Boolean).join('. '));
    const vb = textoVoz ? await voz(textoVoz) : null;
    const lineas = (p.lineas || []).filter(Boolean); const durTxt = 2.2 + lineas.length * 2.6 + 3.2; const dur = Math.max(durTxt, vb ? vb.duration + 1.6 : 0, 6);
    let rec = null, trozos = [];
    if (opt.grabar) { const st = cv.captureStream(30); destRec.stream.getAudioTracks().forEach(t => st.addTrack(t)); const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || ''; rec = new MediaRecorder(st, mt ? { mimeType: mt, videoBitsPerSecond: 5e6 } : {}); rec.ondataavailable = e => e.data.size && trozos.push(e.data); rec.start(250); }
    const t0 = ac.currentTime + .15;
    if (vb) { const s = ac.createBufferSource(); s.buffer = vb; const gv = ac.createGain(); gv.gain.value = .85; s.connect(gv); gv.connect(mezcla); s.start(t0 + .8); gM.gain.setValueAtTime(.55, t0 + .5); gM.gain.linearRampToValueAtTime(.16, t0 + .8); gM.gain.setValueAtTime(.16, t0 + .8 + vb.duration); gM.gain.linearRampToValueAtTime(.55, t0 + 1.2 + vb.duration); if (MU && MU.vol) { setTimeout(() => MU.vol(.3), 800); setTimeout(() => MU.vol(1), 1000 + vb.duration * 1000); } }
    const tr = p.transicion || 'fundido', fin = performance.now() + dur * 1000, ini = performance.now();
    await new Promise(done => {
      const fr = () => {
        const t = (performance.now() - ini) / 1000; if (parar || performance.now() > fin) return done();
        g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        if (vid && vid.readyState >= 2) { const vw = vid.videoWidth || W, vh = vid.videoHeight || H, k = Math.max(W / vw, H / vh); g.drawImage(vid, (W - vw * k) / 2, (H - vh * k) / 2, vw * k, vh * k); }
        else { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C2); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
        const vi = g.createLinearGradient(0, H * .35, 0, H); vi.addColorStop(0, 'rgba(0,0,0,0)'); vi.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = vi; g.fillRect(0, 0, W, H);
        const ent = (k0) => { const x = easeOut((t - k0) / .6); if (tr === 'barrido') return { a: x, dx: (1 - x) * -W * .5, s: 1 }; if (tr === 'zoom') return { a: x, dx: 0, s: .6 + .4 * x }; return { a: x, dx: 0, s: 1 }; };
        const L = ent(.2); g.save(); g.globalAlpha = L.a; g.translate(W * .16 + L.dx, H * .3); g.scale(L.s, L.s); g.drawImage(logo, -150, -150, 300, 300); g.restore();
        const T = ent(.6); g.save(); g.globalAlpha = T.a; g.translate(T.dx, 0); g.fillStyle = '#fff'; g.font = 'bold 64px system-ui'; g.textAlign = 'left'; g.shadowColor = '#000'; g.shadowBlur = 12; g.fillText(p.titulo || cfg.titulo(), W * .34, H * .28, W * .62); g.restore();
        lineas.forEach((ln, i) => { const k0 = 1.6 + i * 2.6, k1 = k0 + 2.6; if (t < k0) return; const e = ent(k0); const sal = i < lineas.length - 1 ? 1 - easeOut((t - k1 + .3) / .3) : 1; g.save(); g.globalAlpha = e.a * Math.max(0, sal); g.translate(e.dx, 0); g.fillStyle = C1; g.font = 'bold 44px system-ui'; g.shadowColor = '#000'; g.shadowBlur = 10; g.fillText(ln, W * .34, H * .44, W * .62); g.restore(); });
        if (p.dia || p.hora) { const e = ent(1.2); g.save(); g.globalAlpha = e.a; g.fillStyle = C1; g.fillRect(W * .06, H * .78, W * .88, 86); g.fillStyle = '#111'; g.font = 'bold 50px system-ui'; g.textAlign = 'center'; g.fillText([p.dia, p.hora].filter(Boolean).join(' · ').toUpperCase(), W / 2, H * .78 + 60, W * .84); g.restore(); }
        htDibuja(g, W, H, performance.now());
        const fo = Math.min(1, t / .5, (fin - performance.now()) / 500); if (fo < 1) { g.fillStyle = `rgba(0,0,0,${1 - Math.max(0, fo)})`; g.fillRect(0, 0, W, H); }
        requestAnimationFrame(fr);
      }; fr();
    });
    try { mus && mus.stop(); } catch (e) { } try { MU && MU.stop && p.musica !== 'ninguna' && MU.stop(); MU && MU.vol && MU.vol(1); } catch (e) { } if (destRec && sal) { try { sal.disconnect(destRec); } catch (e) { } } mezcla.disconnect(); if (vid) { vid.pause(); if (vid.srcObject) vid.srcObject = null; }
    cfg.alTerminar && cfg.alTerminar(p);
    let blob = null; if (rec) { await new Promise(r => { rec.onstop = r; rec.stop(); }); blob = new Blob(trozos, { type: rec.mimeType || 'video/webm' }); }
    cont.remove(); return blob;
  }
  async function exportar(p) { toast('Grabando la promo en vídeo…'); const b = await reproducir(p, { grabar: true }); if (b && b.size) await guardar(`promo-${limpio(p.titulo || 'promo')}.${/mp4/.test(b.type) ? 'mp4' : 'webm'}`, b, 'Movies'); return b; }
  async function aleatoria() { const L = await promosLista().catch(() => []); return L.length ? L[Math.floor(Math.random() * L.length)] : null; }
  async function aleatoriaReproduce(prob = 1) { if (Math.random() > prob) return false; const p = await aleatoria(); if (!p) return false; await reproducir(p); return true; }
  let ocioT = 0; function ocioMenu(activo) { clearTimeout(ocioT); if (!activo) return; ocioT = setTimeout(async () => { if (cfg.enMenu && !cfg.enMenu()) return; if (await aleatoriaReproduce(1)) ocioMenu(true); }, cfg.ocioMs || 60000); }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { if (ocioT) ocioMenu(true); }, true));

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

  // ---------- Editor ----------
  async function editor(p0, alGuardar) {
    const p = Object.assign({ id: 'p' + Date.now(), creada: Date.now(), titulo: cfg.titulo(), lineas: ['', '', ''], dia: 'Esta noche', hora: '22:00', logo: 'actual', musica: (cfg.musicas()[0] || [''])[0], transicion: 'fundido', fondo: { tipo: 'plato' }, voz: true, textoVoz: '' }, JSON.parse(JSON.stringify(p0 || {})));
    const w = capa(p0 && p0.ia ? '🎬 Producir mi promo' : p0 ? '✏️ Editar promo' : '➕ Nueva promo'); const f = $('div', 'display:grid;gap:6px');
    const zT = inp(p.titulo, 'Título', 60); const zL = p.lineas.map((l, i) => inp(l, 'Línea ' + (i + 1), 70)); const zD = inp(p.dia, 'Día (p. ej. Este viernes)', 30); const zH = inp(p.hora, 'Hora (p. ej. 22:00)', 12);
    const lg = sel([['actual', 'Logo actual'], ['titulo', 'Logo con título propio'], ...cfg.especiales().filter(e => e.id !== 'normal').map(e => [e.id, 'Logo especial ' + e.nombre])], p.logo);
    const mu = sel([['ninguna', 'Sin música'], ...cfg.musicas()], p.musica); const tr = sel([['fundido', 'Fundido'], ['barrido', 'Barrido'], ['zoom', 'Zoom']], p.transicion);
    const fo = sel([['plato', 'Toma del plató 3D'], ['video', 'Vídeo propio'], ['camlibre', 'Grabación de Cámara libre'], ...cfg.cabeceras().map(c => ['cab:' + c.id, 'Cabecera: ' + c.nombre])], p.fondo.tipo === 'cabecera' ? 'cab:' + p.fondo.cab : p.fondo.tipo);
    const extra = $('div'); let blobNuevo = null;
    const pintaFondo = () => { extra.innerHTML = ''; if (fo.value === 'video') extra.append(btn(p.fondo.tipo === 'video' && p.fondo.blob ? '🎞 Vídeo guardado (cambiar…)' : '🎞 Elegir vídeo…', async b => { const fl = await cfg.pideArchivo('video/*'); if (fl) { blobNuevo = fl; b.innerHTML = '🎞 ' + esc(fl.name || 'vídeo'); } }));
      if (fo.value === 'camlibre') { const L = tomasLibres(); if (!L.length) extra.append($('div', 'opacity:.8', 'Aún no hay tomas. Graba una en Cámara libre (botón «Guardar para promos»).')); else { const s = sel(L.map(x => [x.k, 'Toma ' + x.t]), p.fondo.blob); s.onchange = () => p.fondo.blob = s.value; if (!L.some(x => x.k === p.fondo.blob)) p.fondo.blob = L[0].k; extra.append(s); } } };
    fo.onchange = pintaFondo; pintaFondo();
    const vz = btn(p.voz ? '🎙 Voz en off: SÍ (Piper, sin conexión)' : '🎙 Voz en off: NO', b => { p.voz = !p.voz; b.innerHTML = p.voz ? '🎙 Voz en off: SÍ (Piper, sin conexión)' : '🎙 Voz en off: NO'; }); const zV = inp(p.textoVoz, 'Texto de la voz (vacío = título + líneas + día y hora)', 300);
    const lab = t => $('div', `color:${C1};font-weight:bold;margin-top:4px`, t);
    f.append(lab('Título'), zT, lab('Líneas'), ...zL, lab('Día y hora'), zD, zH, lab('Logo'), lg, lab('Música del juego'), mu, lab('Transición'), tr, lab('Fondo'), fo, extra, lab('Voz en off'), vz, zV); w.v.appendChild(f);
    const recoge = async () => { Object.assign(p, { titulo: zT.value.trim(), lineas: zL.map(z => z.value.trim()), dia: zD.value.trim(), hora: zH.value.trim(), logo: lg.value, musica: mu.value, transicion: tr.value, textoVoz: zV.value.trim() });
      if (fo.value.startsWith('cab:')) p.fondo = { tipo: 'cabecera', cab: fo.value.slice(4) }; else if (fo.value === 'video') { if (blobNuevo) { const k = 'v' + p.id; await blobGuarda(k, blobNuevo); p.fondo = { tipo: 'video', blob: k }; } else if (p.fondo.tipo !== 'video') p.fondo = { tipo: 'plato' }; } else if (fo.value === 'camlibre') p.fondo = { tipo: 'camlibre', blob: p.fondo.blob || (tomasLibres()[0] || {}).k }; else p.fondo = { tipo: 'plato' }; return p; };
    w.v.append($('div', 'margin-top:10px'), btn('💾 Guardar', async () => { await promoGuarda(await recoge()); toast('Promo guardada'); w.cierra(); alGuardar && alGuardar(); }, true), btn('▶ Vista previa', async () => { const q = await recoge(); w.o.style.display = 'none'; await reproducir(q); w.o.style.display = 'flex'; }), btn('Cancelar', w.cierra));
  }
  async function panelPromos() {
    const w = capa('🎬 Creador de promos'); const c = $('div'); w.v.appendChild(c);
    const pinta = async () => { c.innerHTML = ''; c.append($('p', 'opacity:.8;margin:2px 0 8px', 'Crea tus propias promos: aparecen en PROMOS, en las pausas de publicidad y al azar (menú en reposo y entre secciones). Voz en off con Piper dentro de la app, sin conexión.'), btn('✨ Hacer mis propias promos', () => panelPromoIA(pinta), true), btn('➕ Nueva promo (a mano)', () => editor(null, pinta)));
      const L = await promosLista(); if (!L.length) c.append($('p', 'opacity:.7', 'Todavía no has creado ninguna promo.'));
      for (const p of L) { const r = $('div', 'display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:6px 0;padding:6px;border:1px solid #fff3;border-radius:10px'); r.append($('div', 'flex:1;min-width:160px', `<b>${esc(p.titulo)}</b><br><span style="opacity:.75;font-size:13px">${esc([p.dia, p.hora].filter(Boolean).join(' · '))} · ${esc({ plato: 'plató 3D', video: 'vídeo propio', camlibre: 'cámara libre', cabecera: 'cabecera' }[p.fondo.tipo] || '')}</span>`), btn('▶', async () => { w.o.style.display = 'none'; await reproducir(p); w.o.style.display = 'flex'; }), btn('✏️', () => editor(p, pinta)), btn('⬇ Vídeo', async () => { w.o.style.display = 'none'; await exportar(p); w.o.style.display = 'flex'; }), btn('🗑', async () => { if (confirm('¿Borrar la promo «' + p.titulo + '»?')) { await promoBorra(p); pinta(); } })); c.appendChild(r); }
      c.append(btn('Cerrar', w.cierra)); };
    await pinta(); return w;
  }
  return { guardar, guardarLogo, guardarTodos, logoPNG, panelLogo, panelHashtags, htActual, htDibuja, bugMostrar, bugOcultar, voz, vozPiper, vozPiezas, promosLista, promoGuarda, promoBorra, reproducir, exportar, aleatoria, aleatoriaReproduce, ocioMenu, panelPromos, panelPromoIA, promoIA: IA, editor, guardarTomaCamLibre, tomasLibres };
}
if (typeof window !== 'undefined') window.crearExtras = crearExtras;
