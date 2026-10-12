# ¡Acerte ou Caia! 1.0: vuelve a grabar con modelos Piper MEDIUM/HIGH todas las frases que estaban grabadas con modelos
# de baja calidad (carlfm x_low, mls_*-low). Mantiene la clave voz/st/<fnv(voz|texto)>.mp3. Entrada: /tmp/low_voices.json
import json, os, subprocess, wave, sys
from piper import PiperVoice, SynthesisConfig
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NUEVO = {  # voz antigua -> (modelo medium/high, speaker, length_scale, filtro)
  'carlfm':    ('es_ES-sharvard-medium', 0, 0.95, 'asetrate=22050*0.90,aresample=22050,volume=1.3'),   # Toni, regidor: grave
  'mls_10246': ('es_MX-claude-high', None, 0.95, 'volume=1.2'),                                         # Rober, sonido
  'mls_9972':  ('es_ES-sharvard-medium', 1, 1.0, 'asetrate=22050*1.06,aresample=22050,volume=1.2'),     # Carmen, público
}
hit = json.load(open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/low_voices.json'))
idx_p = R + '/voz/st/index.json'; idx = json.load(open(idx_p)); cache = {}
for k, (v, t) in hit.items():
    mod, spk, ls, filt = NUEVO[v]
    if mod not in cache: cache[mod] = PiperVoice.load('/workspace/piper/%s.onnx' % mod)
    cfg = SynthesisConfig(length_scale=ls, speaker_id=spk) if spk is not None else SynthesisConfig(length_scale=ls)
    with wave.open('/tmp/rv.wav', 'wb') as w: cache[mod].synthesize_wav(t, w, syn_config=cfg)
    dst = f'{R}/voz/st/{k}.mp3'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/rv.wav', '-af', filt, '-ac', '1', '-b:a', '64k', dst], check=True)
    idx[k] = round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout), 2)
json.dump(idx, open(idx_p, 'w'), ensure_ascii=False, separators=(',', ':')); print('regrabadas', len(hit))
