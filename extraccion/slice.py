import re,os,glob
from PIL import Image
A='/workspace/caduta/src/assets/'
pairs={'Assets.Images.01_Welcome_screen.screen1_sprite_hd':'Assets/Images/01_Welcome_screen/screen1_sprite_hd.png',
'Assets.Images.02_Choose_opponent.screen2_sprite_hd':'Assets/Images/02_Choose_opponent/screen2_sprite_hd.png',
'Assets.Images.03_Head_to_head.screen3_sprite_hd':'Assets/Images/03_Head_to_head/screen3_sprite_hd.png',
'Assets.Images.04_Falling.screen4_sprite_hd':'Assets/Images/04_Falling/screen4_sprite_hd.png',
'Assets.Images.05_Win_Lose.screen5_sprite_hd':'Assets/Images/05_Win_Lose/screen5_sprite_hd.png',
'Assets.Images.Letters.letters_sprite_hd':'Assets/Images/Letters/letters_sprite_hd.png',
'scripts.utils.ppl_sprite':'Assets/Images/ppl_sprite.jpg'}
for b in ['lose-seq1_suit','lose-seq2_hasuda','lose-seq3_yellow','lose-seq4_sweater','win-seq1_suit','win-seq2_hasuda','win-seq3_yellow','win-seq4_sweater']:
    pairs['scripts.bodies.%s-hd'%b]='Assets/Images/Bodies/%s-hd.png'%b
os.makedirs('img',exist_ok=True); n=0
for lua,png in pairs.items():
    t=open('dec/'+lua+'.lua').read()
    fr=[dict(re.findall(r'(\w+) = (-?\d+)',m)) for m in re.findall(r'\{([^{}]*x = [^{}]*)\}',t)]
    idx={int(v):k for k,v in re.findall(r'\[?"?([\w.-]+)"?\]? = (\d+)', t.split('frameIndex')[1].split('function')[0])} if 'frameIndex' in t else {}
    im=Image.open(A+png).convert('RGBA'); d='img/'+lua.split('.')[-1]; os.makedirs(d,exist_ok=True)
    fr=[f for f in fr if 'x' in f and 'width' in f]
    for i,f in enumerate(fr,1):
        x,y,w,h=int(f['x']),int(f['y']),int(f['width']),int(f['height'])
        im.crop((x,y,x+w,y+h)).save(f"{d}/{idx.get(i,'f%03d'%i)}.png"); n+=1
print(n)
