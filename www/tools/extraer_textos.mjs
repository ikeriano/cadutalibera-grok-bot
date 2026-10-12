// Extrae los textos en español (literales y plantillas) de tmp/all.js -> tmp/textos.json
import fs from 'fs'; import * as acorn from '/workspace/acerte/node_tools/node_modules/acorn/dist/acorn.mjs'; import * as walk from '/workspace/acerte/node_tools/node_modules/acorn-walk/dist/walk.mjs';
const src = fs.readFileSync(process.argv[2] || 'tmp/all.js', 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
export const esTexto = s => typeof s === 'string' && s.length >= 2 && (/\p{Ll}/u.test(s) || /^[A-ZÁÉÍÓÚÑÜ¡!¿?·,.:… 0-9]{5,}$/.test(s) && / /.test(s.trim()) && /[A-Z]{3}/.test(s)) && /[\p{L}]{2,}/u.test(s) && (/\s/.test(s.trim()) || /[áéíóúñ¿¡]/i.test(s) || /^[A-ZÁÉÍÓÚ¡¿][a-záéíóúñ]+[.!?…]?$/.test(s))
  && !/^[\w.-]+\.(js|mp3|mp4|png|webp|json|wasm|data|onnx|html|css)$/.test(s) && !/^(https?:|data:|blob:|#[0-9a-f]{3,8}$)/i.test(s)
  && !/[{};]\s*$/.test(s) && !/^[a-z-]+:\s?[\w#(.-]/.test(s) && !/^\d+(px|em|%)/.test(s) && !/^(rgba?|hsla?)\(/.test(s) && !/^(bold|italic|normal|\d{3}) /.test(s) && !/(^|\s)(px|translate|rotate|scale)\(/.test(s) && !/^[.#]?[a-z][\w-]*([ .#>:][\w-]+)*$/.test(s.trim()) ;
const out = []; const man = JSON.parse(fs.readFileSync('tools/manifest.json')); const NOMBRES = new Set([...Object.keys(man.sounds), ...Object.keys(man.sprites)]);
for (const sp of Object.values(man.sprites)) { for (const c of sp.c) NOMBRES.add(c.n); for (const k of Object.keys(sp.s || {})) NOMBRES.add(k); }
const MALOS = new Set(['play','playMusic','stopTag','playUrl','getItem','setItem','removeItem','querySelector','querySelectorAll','getElementById','add','remove','toggle','contains','setAttribute','getAttribute','addEventListener','fetch','createElement','postMessage','importScripts','mec','Worker','LSJ','LSG','open','test','match','replace','split','startsWith','endsWith','includes','indexOf']);
walk.fullAncestor(ast, (n, st, anc) => {
  let v = null, t = null; if (n.type === 'Literal' && typeof n.value === 'string') { v = n.value; t = 'L'; } else if (n.type === 'TemplateElement' && n.value.cooked) { v = n.value.cooked; t = 'T'; }
  if (v == null || !esTexto(v) || NOMBRES.has(v) || /\.mp3|@/.test(v)) return;
  const p = anc[anc.length - 2], pp = anc[anc.length - 3];
  if (t === 'L' && p) {
    if (p.type === 'Property' && p.key === n) return;
    if (p.type === 'BinaryExpression' && /^[!=]==?$/.test(p.operator)) return;
    if (p.type === 'SwitchCase' && p.test === n) return;
    if (p.type === 'MemberExpression' && p.property === n) return;
    if (p.type === 'ImportDeclaration') return;
    if (p.type === 'CallExpression' && p.callee !== n) { const c = p.callee; const nm = c.type === 'MemberExpression' ? (c.property.name || c.property.value) : c.name; if (MALOS.has(nm)) return; }
  }
  out.push({ s: n.start, e: n.end, t, v });
});
// excluir textos usados como claves en comparaciones/propiedades: se filtran en el paso de traducción por lista negra
fs.writeFileSync('tmp/textos.json', JSON.stringify(out));
console.log(out.length, new Set(out.map(o => o.v)).size);
