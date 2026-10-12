// Lista las frases fijas que el juego puede decir en voz alta (literales de cadena con forma de frase) de un bundle.
import fs from 'fs'; import { createRequire } from 'module';
const acorn = createRequire(import.meta.url)('/workspace/acerte/node_tools/node_modules/acorn/dist/acorn.js');
const [f, out] = process.argv.slice(2); const s = fs.readFileSync(f, 'utf8'); const set = new Set();
const ok = t => { t = t.trim(); if (t.length < 8 || t.length > 260 || !/\s/.test(t) || !/[.!?…]$/.test(t) || /[<>{}=;]|https?:|\\|\bfunction\b|=>|\||\$\{/.test(t) || !/^[¡¿"«“(A-ZÁÉÍÓÚÑa-záéíóúñàèìòù0-9—-]/.test(t)) return; if ((t.match(/[a-záéíóúñàèìòùç]/gi) || []).length < t.length * .6) return; set.add(t); };
let inTpl = false, partes = 0;
for (const tk of acorn.tokenizer(s, { ecmaVersion: 'latest' })) {
  if (tk.type.label === 'string') ok(tk.value);
  else if (tk.type.label === '`') { if (!inTpl) { inTpl = true; partes = 0; } else { inTpl = false; } }
  else if (tk.type.label === 'template' && inTpl) { if (partes++ === 0) tk._t = tk.value; }
  else if (tk.type.label === '${') partes = 99;
}
// plantillas sin ${}: segunda pasada sencilla
for (const tk of acorn.tokenizer(s, { ecmaVersion: 'latest' })) if (tk.type.label === 'template' && tk.value && !/\$\{/.test(tk.value)) { }
fs.writeFileSync(out, JSON.stringify([...set])); console.log(f, set.size);
