import json,os,re,wave,subprocess,hashlib
from num2words import num2words
from piper import PiperVoice, SynthesisConfig
G=json.load(open('guion_it.json'));os.makedirs('voz',exist_ok=True)
V=PiperVoice.load('/workspace/piper/it_IT-paola-medium.onnx')
def par(w):
  if w=='host': return 1.0,1.0
  if w=='cent': return 1.0,1
  if w=='narr': return 1.05,1
  if w in('bip','dire'): return 0.97,1
  i=int(w[1:]); return (0.95,1) if G['robots'][i][1]=='M' else (1.03,1)
def habla(t):
  t=t.replace('R2-Lola','Erre due Lola').replace('3000','tremila')
  return re.sub(r'(\d{1,3}(?:\.\d{3})+|\d+)',lambda m:num2words(int(m.group(1).replace('.','')),lang='it'),t)
IDX=[];TX={}
for p in G['pasos']:
  l,pt=par(p['w']); l=l*(1.12 if len(p['t'])<30 else 1);t=habla(p['t']);k='it'+hashlib.md5(f'{l}|{pt}|{t}'.encode()).hexdigest()[:10];IDX.append(k);TX[k]=t
  o=f'voz/{k}.mp3'
  if os.path.exists(o): continue
  w=f'/workspace/caduta/tmpw/{k}.wav'
  with wave.open(w,'wb') as f: V.synthesize_wav(t,f,SynthesisConfig(length_scale=l,noise_scale=.5,noise_w_scale=.6))
  af=f'asetrate=22050*{pt},aresample=22050,atempo={1/pt:.4f},' if pt!=1 else ''
  subprocess.run(['ffmpeg','-v','error','-y','-i',w,'-af',af+'loudnorm=I=-16:TP=-1.5,apad=pad_dur=0.12','-ac','1','-ar','22050','-b:a','56k',o],check=True);os.remove(w)
json.dump(IDX,open('voz_index.json','w'));json.dump(TX,open('voz_textos.json','w'),ensure_ascii=False);print('ok',len(IDX))
