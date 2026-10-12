import json,re,subprocess,numpy as np,jiwer,unicodedata
from faster_whisper import WhisperModel
T=json.load(open('voz_textos.json'));m=WhisperModel('small',device='cpu',compute_type='float32',cpu_threads=8)
from num2words import num2words
def n(t):t=re.sub(r'\d+(?:\.\d{3})*',lambda m:' '+num2words(int(m.group().replace('.','')),lang='it')+' ',t);t=unicodedata.normalize('NFD',t.lower());t=''.join(c for c in t if unicodedata.category(c)!='Mn');return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9 ]',' ',t)).strip()
W=[]
for k,t in T.items():
  a=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f'voz/{k}.mp3','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout,np.float32)
  h=' '.join(s.text for s in m.transcribe(a,language='it',beam_size=1,temperature=0,without_timestamps=True)[0]);w=jiwer.wer(n(t),n(h) or 'x');W.append(w)
  if w>.3:print(round(w,2),t,'=>',h)
print('frases',len(W),'WER medio %.1f%%'%(100*sum(W)/len(W)))
