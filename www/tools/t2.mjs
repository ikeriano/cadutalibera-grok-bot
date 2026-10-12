import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--mute-audio']});
const w=ms=>new Promise(r=>setTimeout(r,ms)); const p=await b.newPage(); await p.setViewport({width:1280,height:720}); p.on('pageerror',e=>console.log('PAGEERROR',e.message)); p.on('console',m=>m.type()==='error'&&console.log('ERR',m.text()));
await p.evaluateOnNewDocument(()=>localStorage.setItem('ac_vcab_sel','cab2'));
await p.goto('http://127.0.0.1:18511/index.html'); await w(3000); await p.keyboard.press('Enter'); await w(1500);
p.evaluate(()=>window.__v114.cabVideo(null,null,null)); await w(7000); await p.screenshot({path:'/workspace/shots/ac/1141-cabecera2-3d.png'});
await p.evaluate(()=>window.__v114.vcabPantalla(null).then(()=>0)); 
await b.close();
