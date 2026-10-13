# Prepara el modo 2D para WebView antiguos: JS a ES5 (TypeScript), regex sin \p{L}, CSS con prefijos -webkit-, compat.js primero.
import os, re, shutil, subprocess, sys
SRC, DST = sys.argv[1], sys.argv[2]
shutil.rmtree(DST, ignore_errors=True); shutil.copytree(SRC, DST)
sb3 = os.path.join(os.path.dirname(DST), 'sb3')
L = '[A-Za-z\\u00C0-\\u024F]'
js = [os.path.join(DST, f) for f in ('gioco.js', 'layout.js', 'seq.js', 'domande.js')] + [os.path.join(sb3, 'logo.js')]
for f in js:
    s = open(f, encoding='utf-8').read(); s = s.replace('/\\p{L}|\\d/u', '/' + L + '|\\d/'); open(f, 'w', encoding='utf-8').write(s)
subprocess.check_call(['node', '-e', '''
const ts=require('/tmp/tsx/node_modules/typescript');const fs=require('fs');
for(const f of process.argv.slice(1)){const o=ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES5,downlevelIteration:true,lib:['es2020','dom'],removeComments:false}});fs.writeFileSync(f,o.outputText);}
'''] + js)
shutil.copy(os.path.join(os.path.dirname(__file__), 'compat.js'), os.path.join(DST, 'compat.js'))
h = open(os.path.join(DST, 'index.html'), encoding='utf-8').read()
def pref(css):
    css = re.sub(r'@keyframes ([^{]+)\{((?:[^{}]*\{[^}]*\})*)\s*\}', lambda m: m.group(0) + '@-webkit-keyframes ' + m.group(1) + '{' + m.group(2) + '}', css)
    css = re.sub(r'(?<![-\w])(transform|transform-origin|animation|filter|transition|background-clip)\s*:\s*([^;}]+)', lambda m: '-webkit-' + m.group(1) + ':' + m.group(2) + ';' + m.group(0), css)
    return css.replace('inset:0', 'top:0;left:0;right:0;bottom:0')
h = re.sub(r'<style>(.*?)</style>', lambda m: '<style>' + pref(m.group(1)) + '</style>', h, flags=re.S)
h = h.replace('<script>window.CL_VERSION', '<script src="compat.js"></script><script>window.CL_VERSION', 1)
open(os.path.join(DST, 'index.html'), 'w', encoding='utf-8').write(h)
print('lite ES5 listo')
