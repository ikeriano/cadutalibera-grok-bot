# Clips Piper (voces ORIGINALES) para el puente voz_android.js · entrada: JSON [[texto, perfil], …] → carpeta vozss/ con index.json
# Uso: /workspace/piperenv/bin/python gen_vozss.py frases.json carpeta_vozss
import json, os, re, subprocess, sys, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
PERF = {  # modelo, speaker, length_scale, noise, noise_w, filtro ffmpeg (SR se pone solo)
  'adrian': ('es_ES-davefx-medium', None, 0.985, 0.667, 0.8, 'volume=1.0'),
  'arturo': ('es_ES-davefx-medium', None, 1.1, 0.6, 0.7, 'asetrate={sr}*0.84,aresample=22050,equalizer=f=160:t=q:w=1:g=4,equalizer=f=3000:t=q:w=1:g=-2,aecho=0.7:0.4:35:0.12,volume=1.3'),
  'hombre': ('es_ES-davefx-medium', None, 1.0, 0.667, 0.8, 'volume=1.0'),
  'hombre2': ('es_ES-carlfm-x_low', None, 0.95, 0.8, 0.9, 'asetrate={sr}*1.03,aresample=22050,volume=1.2'),
  'mujer': ('es_ES-sharvard-medium', 1, 0.95, 0.6, 0.8, 'asetrate={sr}*1.03,aresample=22050,volume=1.15'),
  'mujer2': ('es_MX-claude-high', None, 0.95, 0.6, 0.8, 'volume=1.1'),
  'grave': ('es_ES-sharvard-medium', 0, 1.1, 0.5, 0.6, 'asetrate={sr}*0.9,aresample=22050,volume=1.25'),
  'pt': ('pt_BR-faber-medium', None, 0.98, 0.667, 0.8, 'volume=1.0'),
  'ptgrave': ('pt_BR-cadu-medium', None, 1.08, 0.6, 0.7, 'asetrate={sr}*0.86,aresample=22050,equalizer=f=160:t=q:w=1:g=4,aecho=0.7:0.4:35:0.12,volume=1.3'),
  'itm': ('it_IT-paola-medium', None, 1.0, 0.6, 0.8, 'asetrate={sr}*0.86,aresample=22050,equalizer=f=150:t=q:w=1:g=3,volume=1.2'),
  'itgrave': ('it_IT-paola-medium', None, 1.1, 0.6, 0.7, 'asetrate={sr}*0.76,aresample=22050,equalizer=f=160:t=q:w=1:g=4,aecho=0.7:0.4:35:0.12,volume=1.3'),
  'it': ('it_IT-paola-medium', None, 0.98, 0.667, 0.8, 'volume=1.0'),
}
def norm(t):
    t = unicodedata.normalize('NFC', str(t)).lower()
    return re.sub(r'[\W_]+', ' ', t).strip()
def fnv(t):
    h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
cache = {}
def voz(m):
    if m not in cache: cache[m] = PiperVoice.load('/workspace/piper/%s.onnx' % m)
    return cache[m]
def main():
    frases = json.load(open(sys.argv[1], encoding='utf8')); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    ip = os.path.join(out, 'index.json'); idx = json.load(open(ip)) if os.path.exists(ip) else {}; n = 0
    for t, perf in frases:
        tt = re.sub(r'[«»]', '', t).strip()
        if not norm(tt): continue
        k = fnv(norm(tt)); dst = os.path.join(out, k + '.mp3')
        if k in idx and os.path.exists(dst): continue
        mod, spk, ls, ns, nw, f = PERF[perf]; v = voz(mod)
        with wave.open('/tmp/vozss.wav', 'wb') as w: v.synthesize_wav(tt, w, syn_config=SynthesisConfig(speaker_id=spk, length_scale=ls, noise_scale=ns, noise_w_scale=nw))
        f = f.replace('{sr}', str(v.config.sample_rate))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/vozss.wav', '-af', f + ',silenceremove=start_periods=1:start_threshold=-45dB', '-ac', '1', '-ar', os.environ.get('VOZSS_SR', '22050'), '-b:a', os.environ.get('VOZSS_KBPS', '32') + 'k', dst], check=True)
        idx[k] = round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout), 2); n += 1
    json.dump(idx, open(ip, 'w'), separators=(',', ':')); print('nuevas', n, 'total', len(idx))
main()
