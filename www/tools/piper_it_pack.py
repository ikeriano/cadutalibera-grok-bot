import json,re,onnx,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/../piper_it')
S='/workspace/acerte/www/piper_pt/';E='/workspace/piperenv/lib/python3.13/site-packages/piper/espeak-ng-data'
js=open(S+'sherpa-onnx-wasm-main-tts.js').read();data=open(S+'sherpa-onnx-wasm-main-tts.data','rb').read()
m=re.search(r'loadPackage\(\{"files":(\[.*?\]),"remote_package_size":(\d+)\}\)',js)
files=json.loads(m.group(1));new=[]
for f in files:
    fn=f['filename']
    if fn in('/model.onnx','/tokens.txt') or 'pt' in fn.split('/')[-1]: continue
    new.append((fn,data[f['start']:f['end']]))
new+=[('/espeak-ng-data/it_dict',open(E+'/it_dict','rb').read()),('/espeak-ng-data/lang/roa/it',open(E+'/lang/roa/it','rb').read())]
cfg=json.load(open('/workspace/piper/it_IT-paola-medium.onnx.json'));mod=onnx.load('/workspace/piper/it_IT-paola-medium.onnx')
for k,v in {'model_type':'vits','comment':'piper','language':'Italian','voice':cfg['espeak']['voice'],'has_espeak':1,'n_speakers':1,'sample_rate':cfg['audio']['sample_rate']}.items():
    e=mod.metadata_props.add();e.key=k;e.value=str(v)
onnx.save(mod,'/tmp/cl_model.onnx')
tok=''.join(f'{s} {i[0]}\n' for s,i in cfg['phoneme_id_map'].items())
new=[('/model.onnx',open('/tmp/cl_model.onnx','rb').read()),('/tokens.txt',tok.encode())]+new
blob=b'';L=[]
for fn,b in new: L.append({'filename':fn,'start':len(blob),'end':len(blob)+len(b)});blob+=b
open('sherpa-onnx-wasm-main-tts.data','wb').write(blob)
js=js[:m.start()]+'loadPackage({"files":'+json.dumps(L,separators=(',',':'))+',"remote_package_size":'+str(len(blob))+'})'+js[m.end():]
open('sherpa-onnx-wasm-main-tts.js','w').write(js);print(len(L),len(blob)//2**20,'MB',cfg['espeak'])
