// ===== Caduta Libera · Idioma: Italiano (por defecto) / Español · y ajuste «Logo» =====
// Idioma en localStorage «ac_lang» ('it' | 'es'): index.html carga js/app_it.js (italiano) o js/app.js (español).
// Voz Piper sin conexión: piper_it/ (it_IT-paola-medium) o piper/ (es_ES-davefx-medium).
// Logo en localStorage «cl_logo»: 'auto' (Caduta Libera en italiano, Ahora Caigo en español), 'cl' o 'ac'.
function filaIdioma() {
  const d = document.createElement('div'); d.className = 'ocustom'; d.id = 'rowIdioma';
  const l = document.createElement('div'); l.className = 'olabel'; l.textContent = '🌐 Lingua / Idioma'; const r = document.createElement('div'); r.className = 'orow';
  const cur = window.__LANG === 'es' ? 'es' : 'it';
  for (const [k, t] of [['it', '🇮🇹 Italiano'], ['es', '🇪🇸 Español']]) {
    const b = document.createElement('button'); b.className = 'tbtn' + (k === cur ? ' sel' : '');
    const im = document.createElement('img'); im.src = window.__logoUrl ? window.__logoUrl(k) : ''; im.style.cssText = 'height:28px;vertical-align:middle;margin-right:6px';
    b.append(im, document.createTextNode(t));
    b.onclick = e => { e.stopPropagation(); if (k === cur) return; try { localStorage.setItem('ac_lang', k); } catch (x) { } location.reload(); };
    r.appendChild(b);
  }
  d.append(l, r);
  // ajuste Logo
  const d2 = document.createElement('div'); d2.className = 'ocustom'; d2.id = 'rowLogo';
  const l2 = document.createElement('div'); l2.className = 'olabel'; l2.textContent = '🖼 Logo'; const r2 = document.createElement('div'); r2.className = 'orow';
  const pref = window.__logoPref ? window.__logoPref() : 'auto';
  for (const [k, t] of [['auto', 'Automático'], ['cl', 'Siempre Caduta Libera'], ['ac', 'Siempre Ahora Caigo']]) {
    const b = document.createElement('button'); b.className = 'tbtn' + (k === pref ? ' sel' : ''); b.textContent = t;
    b.onclick = e => { e.stopPropagation(); if (k === pref) return; try { localStorage.setItem('cl_logo', k); } catch (x) { } location.reload(); };
    r2.appendChild(b);
  }
  d2.append(l2, r2);
  const w = document.createElement('div'); w.append(d, d2); return w;
}
window.__filaIdioma = filaIdioma;
