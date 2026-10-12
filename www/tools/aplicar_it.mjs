// Genera js/app_it.js (portugués de Brasil) sustituyendo los textos de tmp/all.js por su traducción (tools/it_dic.json,
// con prioridad para tools/it_manual.json). Uso: bash tools/build.sh && node tools/extraer_textos.mjs &&
//   python tools/traducir_pt.py && node tools/aplicar_pt.mjs
import fs from 'fs'; import { execFileSync } from 'child_process';
const src = fs.readFileSync('tmp/all.js', 'utf8'); const T = JSON.parse(fs.readFileSync('tmp/textos.json'));
const dic = JSON.parse(fs.readFileSync('tools/it_dic.json')); const man = fs.existsSync('tools/it_manual.json') ? JSON.parse(fs.readFileSync('tools/it_manual.json')) : {};
const pre = fs.readFileSync('src/preguntas_extra.js', 'utf8'); const PT = new Set();
const limpia = (es, pt) => { if (!pt) return es; pt = pt.replace(/^>>\w+<<\s*/, ''); if (pt.length > 2.5 * es.length + 15 || !pt.trim()) return es;
  pt = pt.replace(/trappol/g, 'botol').replace(/Trappol/g, 'Botol').replace(/[Bb]otola di accesso/g, 'botola');
  const em = es.match(/^[^\p{L}\p{N}¡¿«"(]+/u); if (em && !pt.startsWith(em[0].trim())) pt = em[0] + pt.trimStart();
  const ef = es.match(/[\s][^\p{L}\p{N}\s.!?…:»")]+$/u); if (ef && !pt.endsWith(ef[0].trim())) pt = pt + ef[0];
  // conservar signos de apertura/cierre del original si el MT los pierde
  pt = pt.replace(/[¡¿]/g, '').replace(/[¡]?Ahora [cC]aigo!?/g, 'Caduta Libera').replace(/Ora [Cc]ado!?/g, 'Caduta Libera').replace(/Adesso cado!?/g, 'Caduta Libera'); if (/[.!?…:]$/.test(es) && !/[.!?…:]$/.test(pt)) pt += es.slice(-1); if (/\bbotes?\b/i.test(es)) pt = pt.replace(/\b(la |una |della |nella |sulla |alla |dalla )?barca\b/g, (m, x) => (x ? ({ 'la ': 'il ', 'una ': 'un ', 'della ': 'del ', 'nella ': 'nel ', 'sulla ': 'sul ', 'alla ': 'al ', 'dalla ': 'dal ' })[x] : '') + 'montepremi').replace(/\bbarche\b/g, 'montepremi'); if (/plat[óo]/i.test(es)) pt = pt.replace(/\b(il |un |del |nel |sul |al |dal |questo )?vassoio\b/g, (m, x) => (x || '') + 'studio').replace(/\bvassoi\b/g, 'studi');
  if (/^\s/.test(es)) pt = ' ' + pt.trimStart(); if (/\s$/.test(es)) pt = pt.trimEnd() + ' ';
  if (/^\p{Lu}/u.test(es) === false && /^\p{Ll}/u.test(es)) pt = pt.charAt(0).toLowerCase() + pt.slice(1);
  return pt; };
const tr1 = s => { if (man[s]) return man[s]; if (s === s.toUpperCase() && s.length > 4 && /[A-Z]{3}/.test(s)) { const k = s[0] + s.slice(1).toLowerCase(); return dic[k] ? limpia(k, dic[k]).toUpperCase() : s; } return limpia(s, dic[s]); };
const frases = p => p.split(/(?<=[.!?…])(\s+)/).map(f => /^\s+$/.test(f) || !f ? f : tr1(f)).join('');
const trad = v => { if (man[v]) return man[v]; if (PT.has(v)) return v;
  const m = v.match(/^([\s\S]*)\|([^|]*\[[^|]*)$/);
  if (m) { const w = (dic[m[2].replace(/[\[\]]/g, '').charAt(0) + m[2].replace(/[\[\]]/g, '').slice(1).toLowerCase()] || m[2].replace(/[\[\]]/g, '')).toUpperCase().replace(/[.!?]$/, '');
    const idx = [...w].map((c, i) => /\p{L}/u.test(c) ? i : -1).filter(i => i >= 0); const n = idx.length <= 3 ? 1 : idx.length < 8 ? 2 : 3;
    const pick = new Set(Array.from({ length: n }, (_, k) => idx[Math.round((k + 1) * idx.length / (n + 1)) - 1]));
    return frases(m[1]) + '|' + [...w].map((c, i) => pick.has(i) ? '[' + c + ']' : c).join(''); }
  if (/<\/?[a-z][^>]*>/i.test(v)) return v.split(/(<[^>]*>)/).map(p => p.startsWith('<') || !/[A-Za-zÁ-ú]{2}/.test(p) ? p : trad(p)).join('');
  return v.split(/(\{[\w.]+\})/).map(p => /^\{[\w.]+\}$/.test(p) || !/[A-Za-zÁ-ú]{2}/.test(p) ? p : frases(p)).join(''); };
const _ri = src.indexOf('/*PT-INICIO*/'), _rf = src.indexOf('/*PT-FIN*/');
let out = src; let n = 0, iguales = 0;
for (const o of [...T].sort((a, b) => b.s - a.s)) {
  if (o.s > _ri && o.e < _rf) { iguales++; continue; }
  if (/\b(precision|uniform|varying|attribute|gl_\w+|vec[234]|mat[34]|void main|#define|#include|#ifdef|#endif|highp|mediump|texture2D)\b|\bMaterial\b|THREE\.|#\s*(if|ifdef|ifndef|else|elif|endif|define|include|pragma)\b|defined\s*\(|;\s*$|;\s*\n|\bfloat\b|\breturn\b/m.test(o.v)) { iguales++; continue; }
  const t = trad(o.v); if (t === o.v) { iguales++; continue; } n++;
  const rep = o.t === 'L' ? JSON.stringify(t) : t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  out = out.slice(0, o.s) + rep + out.slice(o.e);
}
out = out.replace(/#AhoraCaigo/g, '#CadutaLibera').replace(/Caduta libera/g, 'Caduta Libera').replace(/\.Oh, mio Dio\. Versione/g, '. Versione').replace(/Capisco  tono/g, 'Ho capito → tono').replace(/ te cuenta la historia del programa/g, ' racconta la storia del programma').replace(/¡HUELLA DOBLADORA!/g, 'IMPRONTA RADDOPPIATRICE!').replace(/¡Ahora caigo!/g, 'Caduta Libera').replace(/Ahora caigo/g, 'Caduta Libera');
fs.writeFileSync('tmp/all_it.js', out);
execFileSync('node_modules/.bin/esbuild', ['tmp/all_it.js', '--bundle', '--minify', '--charset=utf8', '--format=iife', '--outfile=js/app_it.js', '--log-level=warning'], { stdio: 'inherit' });
console.log('traducidos', n, 'sin cambio', iguales);
