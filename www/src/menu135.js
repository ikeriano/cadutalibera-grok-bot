// ===== Menú igual que ¡Ahora Caigo! 1.35: «🎬 Más opciones del programa» plegado en Opciones (es / it / pt) =====
const MAS135 = { abierto: false };
(function () { const s = document.createElement("style"); s.textContent = '#menu .ofold>.olabel{cursor:pointer;display:flex;align-items:center;gap:8px}#menu .ofold>.olabel:after{content:"▸";margin-left:auto;transition:transform .15s}#menu .ofold.open>.olabel:after{transform:rotate(90deg)}#menu .ofold:not(.open)>:not(.olabel){display:none}#menu .ofold.open{display:flex;flex-direction:column;gap:8px}'; document.head.appendChild(s); })();
const MAS135_TXT = { es: "🎬 Más opciones del programa", it: "🎬 Altre opzioni del programma", pt: "🎬 Mais opções do programa" };
// mueve a un bloque plegable las filas de Opciones desde la que empieza por «desde» hasta antes de la siguiente que empieza por «hasta» (por emoji: vale en cualquier idioma)
function masOpciones135(r, desde, hasta) {
  const kids = [...r.children], txt = (x) => ((x.querySelector && x.querySelector("label,.olabel")) || x).textContent.trim();
  const i = kids.findIndex((x) => txt(x).startsWith(desde)); if (i < 0) return;
  const j = kids.findIndex((x, k) => k > i && txt(x).startsWith(hasta)); if (j < 0) return;
  const b = document.createElement("div"); b.className = "ocustom ofold" + (MAS135.abierto ? " open" : "");
  const l = document.createElement("div"); l.className = "olabel"; l.textContent = MAS135_TXT[window.__LANG] || MAS135_TXT.es;
  l.onclick = (e) => { e.stopPropagation(); MAS135.abierto = b.classList.toggle("open"); try { F.play("Tecla"); } catch (x) {} };
  r.insertBefore(b, kids[i]); b.append(l, ...kids.slice(i, j));
}
