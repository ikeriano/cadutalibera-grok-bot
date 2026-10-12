const fs=require('fs'),vm=require('vm');const ctx={window:{},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('copro.js','utf8')+'\n'+fs.readFileSync('copro_charla.js','utf8')+'\n;this.D=COPRO_DATOS;this.CH=COPRO_CHARLA;',ctx);
const ad=new Set(),co=[];
for(const g of ctx.D){ad.add(g.adrian);for(const[k,v]of Object.entries(g))if(Array.isArray(v))v.forEach(t=>{if(!/\{/.test(t))co.push([g.voz,t])});
 const c=ctx.CH[g.id];const all=[...c.bienvenida,...c.pausas.flat(),...c.final];
 for(const[q,t]of all){if(q==='c')co.push([g.voz,t]);else ad.add(q==='b'?'(Los dos) '+t:t);}}
fs.writeFileSync('/tmp/lineas.json',JSON.stringify({adrian:[...ad],copro:co}));console.log(ad.size,co.length);
