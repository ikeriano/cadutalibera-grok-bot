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
  pt = pt.replace(/[¡¿]/g, '').replace(/[¡]?Ahora [cC]aigo!?/g, 'Caduta Libera').replace(/Ora [Cc]ado!?/g, 'Caduta Libera').replace(/Adesso cado!?/g, 'Caduta Libera'); if (/[.!?…:]$/.test(es) && !/[.!?…:]$/.test(pt)) pt += es.slice(-1); if (/\bbotes?\b/i.test(es)) pt = pt.replace(/\b(la |una |della |nella |sulla |alla |dalla )?barca\b/g, (m, x) => (x ? ({ 'la ': 'il ', 'una ': 'un ', 'della ': 'del ', 'nella ': 'nel ', 'sulla ': 'sul ', 'alla ': 'al ', 'dalla ': 'dal ' })[x] : '') + 'montepremi').replace(/\bbarche\b/g, 'montepremi'); if (/plat[óo]/i.test(es)) { const AR = { 'il ': 'lo ', 'un ': 'uno ', 'del ': 'dello ', 'nel ': 'nello ', 'sul ': 'sullo ', 'al ': 'allo ', 'dal ': 'dallo ', 'Il ': 'Lo ', 'questo ': 'questo ', 'lo ': 'lo ', 'Lo ': 'Lo ' }; pt = pt.replace(/\b(il |Il |un |del |nel |sul |al |dal |questo |lo |Lo |dello |nello |sullo |allo |dallo )?(vassoio|piatto|plateau|platò|Platone|Piatto|Plateau)\b/g, (m, x, w) => (x ? (AR[x] || x) : '') + (/^[A-Z]/.test(w) && !x ? 'Studio' : 'studio')).replace(/\b(vassoi|piatti)\b/g, 'studi').replace(/\bil studio\b/g, 'lo studio').replace(/\bdel studio\b/g, 'dello studio').replace(/\bnel studio\b/g, 'nello studio').replace(/\bsul studio\b/g, 'sullo studio').replace(/\bal studio\b/g, 'allo studio'); }
  if (/plat[óo]/i.test(es)) pt = pt.replace(/\b(del |sul |il |al )?(pianoforte|platino)\b/g, (m, x) => (x ? ({ 'del ': 'dello ', 'sul ': 'sullo ', 'il ': 'lo ', 'al ': 'allo ' })[x] : '') + 'studio').replace(/\bsul palco\b/g, 'in studio').replace(/\bPlató virtuale\b/g, 'Studio virtuale');
  if (/trampilla/i.test(es)) pt = pt.replace(/\b([Ii]l|[Uu]n|[Dd]el|[Nn]el|[Aa]l|[Dd]al|[Ss]ul) trampolino\b/g, (m, x) => ({ il: 'la', un: 'una', del: 'della', nel: 'nella', al: 'alla', dal: 'dalla', sul: 'sulla' })[x.toLowerCase()].replace(/^./, c => x[0] === x[0].toUpperCase() ? c.toUpperCase() : c) + ' botola').replace(/\bper una trappola\b/g, 'in una botola').replace(/\btrappola\b/g, 'botola').replace(/\bTrappola\b/g, 'Botola').replace(/\btrappole\b/g, 'botole').replace(/\bTrappole\b/g, 'Botole').replace(/\btrampolino\b/g, 'botola');
  if (/comod[ií]n/i.test(es)) pt = pt.replace(/\b[Cc]ommodino\b|\bcomodin[oie]\b/g, 'jolly');
  if (/duelo/i.test(es)) pt = pt.replace(/\bin lutto\b/g, 'nel duello').replace(/\blutto\b/g, 'duello');
  if (/tomas? falsas?/i.test(es)) pt = pt.replace(/\b(le )?(foto|prese|scatti) false\b/gi, (m, x) => (x || '') + 'papere').replace(/\bFalse prese\b|\bPrendere falso\b/g, 'Papere');
  { const N = { uno: 'uno', dos: 'due', tres: 'tre', cuatro: 'quattro', cinco: 'cinque', seis: 'sei', siete: 'sette', ocho: 'otto', nueve: 'nove', diez: 'dieci' }; const m = es.match(/^¡?Toma (uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)([.!,].*)?$/); if (m) pt = 'Ciak ' + N[m[1]] + (m[2] ? m[2].replace(/[¡]/g, '') : ''); }
  if (/regidor/i.test(es)) pt = pt.replace(/\b(consigliere|regista|registratore)\b/g, 'assistente di studio');
  if (/grada/i.test(es)) pt = pt.replace(/\b(dalla |nella |della |la |una )?(grada|scaletta|scala|gradinata)\b/g, (m, x) => (x || '') + 'tribuna').replace(/\b(nelle |delle |le )?(scale|gradinate|grade)\b/g, (m, x) => (x || '') + 'tribune');
  if (/concursante/i.test(es)) pt = pt.replace(/\b[Ii]l concorso\b/g, 'Il concorrente').replace(/\bconcorso\b/g, 'concorrente');
  if (/c[áa]mara/i.test(es)) pt = pt.replace(/\b[Mm]acchina fotografica( gru)?\b/g, (m, g) => 'telecamera' + (g ? ' a gru' : '')).replace(/\bfotocamera\b/g, 'telecamera').replace(/\b[Cc]amera libera\b/g, 'telecamera libera').replace(/^telecamera libera$/, 'Telecamera libera');
  if (/huella/i.test(es)) pt = pt.replace(/\btraccia\b/g, 'impronta').replace(/DOPPIA OROLOGIO/g, 'IMPRONTA RADDOPPIATRICE');
  if (/cabecera/i.test(es)) pt = pt.replace(/di intestazione/g, 'della sigla').replace(/dell'intestazione/g, 'della sigla').replace(/come intestazione/g, 'come sigla').replace(/Intestazione/g, 'Sigla').replace(/intestazione/g, 'sigla').replace(/^Testa\b/, 'Sigla');
  if (/dobladora/i.test(es)) pt = pt.replace(/piegatrice/g, 'raddoppiatrice').replace(/pieghevole/g, 'raddoppiatrice');
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
const _p3d = []; { let i = 0; while ((i = src.indexOf('/*P3D-INICIO*/', i)) >= 0) { const f = src.indexOf('/*P3D-FIN*/', i); _p3d.push([i, f]); i = f; } }
let out = src; let n = 0, iguales = 0;
for (const o of [...T].sort((a, b) => b.s - a.s)) {
  if (o.s > _ri && o.e < _rf) { iguales++; continue; }
  if (_p3d.some(([i, f]) => o.s > i && o.e < f)) { iguales++; continue; }
  if (/\b(precision|uniform|varying|attribute|gl_\w+|vec[234]|mat[34]|void main|#define|#include|#ifdef|#endif|highp|mediump|texture2D)\b|\bMaterial\b|THREE\.|#\s*(if|ifdef|ifndef|else|elif|endif|define|include|pragma)\b|defined\s*\(|;\s*$|;\s*\n|\bfloat\b|\breturn\b/m.test(o.v)) { iguales++; continue; }
  const t = trad(o.v); if (t === o.v) { iguales++; continue; } n++;
  const rep = o.t === 'L' ? JSON.stringify(t) : t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  out = out.slice(0, o.s) + rep + out.slice(o.e);
}
out = out.replace(/([^\s])Oh, mio Dio[.!]/g, '$1').replace(/\b[Oo]ra cado!/g, 'Caduta Libera!').replace(/#AhoraCaigo/g, '#CadutaLibera').replace(/Caduta libera/g, 'Caduta Libera').replace(/\.Oh, mio Dio\. Versione/g, '. Versione').replace(/Capisco  tono/g, 'Ho capito → tono').replace(/ te cuenta la historia del programa/g, ' racconta la storia del programma').replace(/¡HUELLA DOBLADORA!/g, 'IMPRONTA RADDOPPIATRICE!').replace(/¡Ahora caigo!/g, 'Caduta Libera').replace(/Ahora caigo/g, 'Caduta Libera');
fs.writeFileSync('tmp/all_it.js', out);
execFileSync('node_modules/.bin/esbuild', ['tmp/all_it.js', '--bundle', '--minify', '--charset=utf8', '--format=iife', '--outfile=js/app_it.js', '--log-level=warning'], { stdio: 'inherit' });
console.log('traducidos', n, 'sin cambio', iguales);
