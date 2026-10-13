/* Compatibilidad con WebView antiguos (Android 4.4, Chrome 30-33): polyfills mínimos para el modo 2D. */
(function () {
  if (typeof Promise === 'undefined') { var P0 = function (fn) { var st = 0, val, q = [], me = this;
      var run = function () { if (!st) return; var l = q; q = []; l.forEach(function (h) { setTimeout(function () { var cb = st === 1 ? h[0] : h[1]; if (!cb) { (st === 1 ? h[2] : h[3])(val); return; } try { h[2](cb(val)); } catch (e) { h[3](e); } }, 0); }); };
      var fin = function (s, v) { if (st) return; if (s === 1 && v && typeof v.then === 'function') { v.then(function (x) { fin(1, x); }, function (x) { fin(2, x); }); return; } st = s; val = v; run(); };
      me.then = function (a, b) { return new P0(function (res, rej) { q.push([a, b, res, rej]); run(); }); }; me['catch'] = function (b) { return me.then(null, b); };
      try { fn(function (v) { fin(1, v); }, function (e) { fin(2, e); }); } catch (e) { fin(2, e); } };
    P0.resolve = function (v) { return new P0(function (r) { r(v); }); }; P0.reject = function (v) { return new P0(function (r, j) { j(v); }); }; window.Promise = P0; }
  if (!Object.assign) Object.assign = function (t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; } return t; };
  if (!Object.values) Object.values = function (o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push(o[k]); return r; };
  if (!String.prototype.padStart) String.prototype.padStart = function (n, c) { var s = String(this); c = c || ' '; while (s.length < n) s = c + s; return s.slice(-Math.max(n, String(this).length)); };
  if (!String.prototype.startsWith) String.prototype.startsWith = function (p) { return this.slice(0, p.length) === p; };
  if (!String.prototype.endsWith) String.prototype.endsWith = function (p) { return this.slice(-p.length) === p; };
  if (!String.prototype.normalize) { var A = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÑñÇç', B = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuNnCc';
    String.prototype.normalize = function () { var s = String(this), r = ''; for (var i = 0; i < s.length; i++) { var j = A.indexOf(s[i]); r += j >= 0 ? B[j] : s[i]; } return r; }; }
  if (!Array.from) Array.from = function (a) { var r = []; if (a && a.forEach && !a.length) { a.forEach(function (v) { r.push(v); }); return r; } for (var i = 0; i < a.length; i++) r.push(a[i]); return r; };
  if (!Array.prototype.find) Array.prototype.find = function (f) { for (var i = 0; i < this.length; i++) if (f(this[i], i, this)) return this[i]; };
  if (!Array.prototype.includes) Array.prototype.includes = function (v) { return this.indexOf(v) >= 0; };
  if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.webkitMatchesSelector;
  if (!Element.prototype.closest) Element.prototype.closest = function (s) { var e = this; while (e && e.nodeType === 1) { if (e.matches(s)) return e; e = e.parentNode; } return null; };
  if (typeof Map === 'undefined' || !Map.prototype.forEach) { window.Map = function (it) { this._k = []; this._v = []; var m = this; if (it) it.forEach(function (p) { m.set(p[0], p[1]); }); };
    Map.prototype = { get: function (k) { var i = this._k.indexOf(k); return i < 0 ? undefined : this._v[i]; }, set: function (k, v) { var i = this._k.indexOf(k); if (i < 0) { this._k.push(k); this._v.push(v); } else this._v[i] = v; return this; }, has: function (k) { return this._k.indexOf(k) >= 0; }, forEach: function (f) { for (var i = 0; i < this._k.length; i++) f(this._v[i], this._k[i], this); } }; }
  if (typeof Set === 'undefined' || !Set.prototype.forEach) { window.Set = function (it) { this._v = []; var s = this; if (it) for (var i = 0; i < it.length; i++) s.add(it[i]); }; Set.prototype = { add: function (v) { if (this._v.indexOf(v) < 0) this._v.push(v); return this; }, has: function (v) { return this._v.indexOf(v) >= 0; }, delete: function (v) { var i = this._v.indexOf(v); if (i >= 0) this._v.splice(i, 1); return i >= 0; }, forEach: function (f) { this._v.forEach(f); } };
    Object.defineProperty(Set.prototype, 'size', { get: function () { return this._v.length; } }); }
  // estilos sin prefijo -> -webkit-
  var st = document.documentElement.style, P = ['transform', 'transformOrigin', 'transition', 'filter', 'animation'];
  P.forEach(function (p) { if (!(p in st)) { var w = 'webkit' + p[0].toUpperCase() + p.slice(1); try { Object.defineProperty(CSSStyleDeclaration.prototype, p, { get: function () { return this[w]; }, set: function (v) { this[w] = v; }, configurable: true }); } catch (e) { } } });
  // pointer events -> touch/mouse
  if (!window.PointerEvent) {
    var map = function (t) { return t === 'pointerdown' ? ['touchstart', 'mousedown'] : t === 'pointerup' ? ['touchend', 'mouseup'] : null; }, last = 0;
    var wrap = function (f) { return function (e) { var now = Date.now(); if (e.type === 'mousedown' && now - last < 600) return; if (e.type === 'touchstart') last = now; return f.call(this, e); }; };
    var patch = function (proto) { var add = proto.addEventListener; proto.addEventListener = function (t, f, o) { var m = map(t); if (!m) return add.call(this, t, f, o); var w = wrap(f); for (var i = 0; i < m.length; i++) add.call(this, m[i], w, o); }; };
    patch(Node.prototype); patch(window); try { patch(Window.prototype); } catch (e) { }
    Object.defineProperty(HTMLElement.prototype, 'onpointerdown', { set: function (f) { var w = wrap(f); this.addEventListener('touchstart', w); this.addEventListener('mousedown', w); }, get: function () { return null; }, configurable: true });
  }
})();
