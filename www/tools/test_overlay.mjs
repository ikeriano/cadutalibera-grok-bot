import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 800 });
await p.setRequestInterception(true); p.on('request', r => r.url().includes('gioco.js') ? r.respond({ status: 200, contentType: 'text/javascript', body: 'var x = ;' }) : r.continue());
await p.goto('http://127.0.0.1:8861/index.html'); await new Promise(r => setTimeout(r, 9000)); await p.screenshot({ path: '/tmp/ov.png' }); await b.close();
