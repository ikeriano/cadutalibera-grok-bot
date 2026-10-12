import puppeteer from 'puppeteer-core'; import fs from 'fs';
const [base, text, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage(); await p.goto(`http://localhost:8823/tmp/tts_test.html?${encodeURIComponent(text)}#${base}`);
await p.waitForFunction('window.R', { timeout: 120000 }); const R = await p.evaluate(() => window.R); await b.close();
if (R.err) { console.log('ERR', R.err); process.exit(1); }
const n = R.s.length, buf = Buffer.alloc(44 + n * 2); buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(R.sr, 24); buf.writeUInt32LE(R.sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, R.s[i] * 32767 | 0)), 44 + i * 2); fs.writeFileSync(out, buf); console.log('ok', n / R.sr, 's');
