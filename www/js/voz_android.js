/* Voz que suena en Android · el WebView de Android no trae voz del navegador (speechSynthesis no existe o está mudo), así que
   las frases que el juego decía con ella no se oían en el móvil. Este puente, cargado ANTES del juego, toma cada frase y la
   reproduce con su clip Piper pregrabado (vozss/index.json, voces ORIGINALES de los personajes). Si una frase no tiene clip,
   no se cuelga: avisa enseguida de que terminó (o espera lo que duraría, con VOZSS_ESPERA) (el juego sigue con sus subtítulos). En el PC, si el navegador
   tiene voces en español, se usan los clips igualmente cuando existen (misma voz en todas partes). */
(function () {
  'use strict';
  var BASE = (window.VOZSS_BASE || 'vozss/'), IDX = null, cola = [], actual = null, nat = window.speechSynthesis || null;
  var NU = window.SpeechSynthesisUtterance || null;
  function norm(t) { t = String(t || ''); try { t = t.normalize('NFC'); } catch (e) { } t = t.toLowerCase(); try { return t.replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); } catch (e) { return t.replace(/[^a-z0-9áéíóúüñàèìòùâêîôûãõçäëïö]+/g, ' ').trim(); } }
  function fnv(t) { var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  var cargando = fetch(BASE + 'index.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (j) { IDX = j || {}; return IDX; });
  setTimeout(function () { if (!IDX) IDX = {}; }, 4000);
  function natOk() { try { return !!nat && nat.getVoices().some(function (v) { return /^es/i.test(v.lang); }); } catch (e) { return false; } }
  function dispara(u, n, extra) { try { var ev = { type: n, utterance: u, charIndex: 0, elapsedTime: 0, name: '' }; for (var k in extra || {}) ev[k] = extra[k]; u['on' + n] && u['on' + n](ev); (u.__l && u.__l[n] || []).forEach(function (f) { f(ev); }); } catch (e) { } }
  function siguiente() { if (actual || !cola.length) return; var u = cola.shift(); actual = u; var hecho = false, a = null, t1 = null;
    function fin(err) { if (hecho) return; hecho = true; clearTimeout(t1); if (a) { try { a.pause(); } catch (e) { } } actual = null; dispara(u, err ? 'error' : 'end', err ? { error: 'audio' } : null); setTimeout(siguiente, 0); }
    u.__para = function () { if (hecho) return; hecho = true; clearTimeout(t1); if (a) try { a.pause(); } catch (e) { } actual = null; };
    var texto = String(u.text || ''), rate = +u.rate || 1;
    Promise.race([cargando, new Promise(function (r) { setTimeout(r, 1500); })]).then(function () {
      if (hecho) return; var k = fnv(norm(texto)), d = IDX && IDX[k];
      if (d == null) { var m = /^[^,!?.]{1,40}[,!?.]\s*(.{8,})$/.exec(texto); if (m) { var k2 = fnv(norm(m[1])); if (IDX && IDX[k2] != null) { k = k2; d = IDX[k2]; } } }
      if (d != null && !(window.MisAudios && MisAudios.ocupado && MisAudios.ocupado())) {
        a = new Audio(BASE + k + '.mp3'); a.volume = Math.max(0, Math.min(1, u.volume == null ? 1 : +u.volume));
        a.onended = function () { fin(); }; a.onerror = function () { espera(); };
        t1 = setTimeout(function () { fin(); }, (d + 2.5) * 1000);
        dispara(u, 'start'); var p = a.play(); p && p.catch && p.catch(function () { espera(); });
        try { (window.__vozssLog = window.__vozssLog || []).push('CLIP ' + texto); } catch (e) { }
      } else { try { (window.__vozssFalta = window.__vozssFalta || []).push(texto); } catch (e) { } dispara(u, 'start'); espera(); }
      function espera() { clearTimeout(t1); var ms = window.VOZSS_ESPERA ? (600 + texto.split(/\s+/).length * 330) / Math.max(.5, rate) : 30; t1 = setTimeout(function () { fin(); }, ms); }
    }); }
  var voz = { name: 'Voz original (Piper)', lang: 'es-ES', localService: true, default: true, voiceURI: 'piper-es' };
  var puente = {
    speak: function (u) { if (!u) return; var k = fnv(norm(u.text)); if (natOk() && !(IDX && IDX[k] != null)) return nat.speak(u.__nat || u); cola.push(u); siguiente(); },
    cancel: function () { var q = cola; cola = []; q.forEach(function () { }); if (actual && actual.__para) actual.__para(); actual = null; try { nat && nat.cancel(); } catch (e) { } },
    pause: function () { }, resume: function () { },
    getVoices: function () { var v = []; try { v = nat ? [].slice.call(nat.getVoices()) : []; } catch (e) { } return v.length ? v : [voz]; },
    addEventListener: function () { }, removeEventListener: function () { },
    get speaking() { return !!actual || (nat ? nat.speaking : false); }, get pending() { return cola.length > 0; }, get paused() { return false; },
    onvoiceschanged: null
  };
  function Utt(t) { this.text = t == null ? '' : String(t); this.lang = 'es-ES'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; this.__l = {};
    if (NU) { try { var n = new NU(this.text), self = this; this.__nat = n; ['start', 'end', 'error', 'boundary', 'pause', 'resume', 'mark'].forEach(function (e) { n['on' + e] = function (ev) { dispara(self, e, ev); }; });
      ['lang', 'rate', 'pitch', 'volume', 'voice'].forEach(function (p) { Object.defineProperty(self, p, { get: function () { return n[p]; }, set: function (v) { try { if (p === 'voice' && v === voz) return; n[p] = v; } catch (e) { } }, configurable: true }); });
      Object.defineProperty(self, 'text', { get: function () { return n.text; }, set: function (v) { n.text = v; }, configurable: true }); } catch (e) { } } }
  Utt.prototype.addEventListener = function (n, f) { (this.__l[n] = this.__l[n] || []).push(f); };
  Utt.prototype.removeEventListener = function (n, f) { var L = this.__l[n] || []; var i = L.indexOf(f); i >= 0 && L.splice(i, 1); };
  try { Object.defineProperty(window, 'speechSynthesis', { value: puente, configurable: true, writable: true }); } catch (e) { window.speechSynthesis = puente; }
  window.SpeechSynthesisUtterance = Utt;
  window.__vozss = { norm: norm, fnv: fnv, idx: function () { return IDX; }, nativa: nat };
})();
