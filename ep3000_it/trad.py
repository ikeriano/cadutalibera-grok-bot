import json,re,os,ctranslate2,transformers
G=json.load(open('/workspace/comun/ep3000/guiones.json'))['caduta']
tok=transformers.AutoTokenizer.from_pretrained('Helsinki-NLP/opus-mt-tc-big-itc-itc')
tr=ctranslate2.Translator('/workspace/mt_itc',device='cpu',compute_type='float32',intra_threads=os.cpu_count())
def mt(L):
  L=list(dict.fromkeys(L));out={}
  for i in range(0,len(L),32):
    lo=L[i:i+32];r=tr.translate_batch([tok.convert_ids_to_tokens(tok.encode('>>ita<< '+x)) for x in lo],beam_size=4,max_decoding_length=256)
    for x,h in zip(lo,r): out[x]=tok.decode(tok.convert_tokens_to_ids(h.hypotheses[0]),skip_special_tokens=True)
  return out
P=G['pasos'];resp=[p['resp'] for p in P if 'resp' in p]
M=mt([p['t'] for p in P if p['a'] not in('acierta','facierta','error','cae')]+resp)
FIX={'criptoeuros':'criptoeuro','trampilla':'botola','Caduta Libera en el año 3000':"Caduta Libera nell'anno 3000"}
def f(s):
  for a,b in [('Buonanotte','Buonasera'),('Morado','Viola'),("e' ",'è '),('euro di criptovalute','criptoeuro'),('euro in criptovalute','criptoeuro'),('cripto-euro','criptoeuro'),('trappola','botola'),('botola di sicurezza','botola')]: s=s.replace(a,b)
  return s
Q=[]
for p in P:
  q=dict(p)
  if p['a'] in('acierta','facierta'): q['t']=f(M[last])+'.' if p['t'].rstrip('.')==lastes else p['t']
  elif p['a']=='cae' and p['w']=='narr': q['t']=G['robots'][p['idx']][0]+' cade nella botola.'
  elif p['a']=='error': q['t']='Errore. La risposta era: '+f(M[lastes])+'.'
  else: q['t']=f(M[p['t']])
  if 'resp' in p: q['resp']=f(M[p['resp']]); last=p['resp']; lastes=p['resp']
  Q.append(q)
cfg=dict(G['cfg'],show="Caduta Libera nell'anno 3000",unidad='criptoeuro',ronda='duello',final='il gioco finale',caer='cade nella botola')
json.dump(dict(cfg=cfg,robots=G['robots'],pasos=Q),open('/workspace/caduta/ep_it/guion_it.json','w'),ensure_ascii=False,indent=0)
for q in Q[:12]+Q[60:75]: print(q['a'],'|',q['t'],'|',q.get('resp',''))
OV={'moneda':'Arriva il momento della moneta olografica. Se esce testa, il montepremi raddoppia. Se esce croce, resta uguale.',
'moneda_cara':'Testa! Il montepremi raddoppia!','corten':'Stop! Marco, ti sono caduti i capelli antigravità. Rifacciamo nell\'anno tremilauno.',
'risas':'Bip. Ho registrato tutto. Va dritto nelle papere.','confeti':'Bip. Lancio coriandoli olografici. Non serve spazzarli.',
'final':'Molto bene. Il gioco finale: dieci domande in cento secondi.','despide':"Questo era Caduta Libera nell'anno tremila. Ci vediamo tra mille anni. Buonasera!"}
for q in Q:
  if q['a'] in OV: q['t']=OV[q['a']]
  if q['a']=='decide': q['t']=re.sub(r'Ti stai piantando o stai giocando il gioco finale\?','Ti fermi o giochi il gioco finale?',q['t'])
  if q['a']=='gana': q['t']=q['t'].replace('euro cripto','criptoeuro')
  if q['a']=='habla' and q['w']=='cent' and 'passato' in q['t']: q['t']='Gioco! Sono venuta dal passato per questo.'
  q['t']=q['t'].replace('..','.').replace('jackpot','montepremi')
json.dump(dict(cfg=cfg,robots=G['robots'],pasos=Q),open('/workspace/caduta/ep_it/guion_it.json','w'),ensure_ascii=False,indent=0)
for q in Q:
  q['t']=q['t'].replace('criptoeuro','euro').replace('Bip bip, pane.','Bip bip. Che emozione.').replace('Ehi.. tostapane?','Ehm... un tostapane?')
cfg['unidad']='euro'
json.dump(dict(cfg=cfg,robots=G['robots'],pasos=Q),open('/workspace/caduta/ep_it/guion_it.json','w'),ensure_ascii=False,indent=0)
