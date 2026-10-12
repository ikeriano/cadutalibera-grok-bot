import sys
SN=open('/workspace/caduta/v_ia/promo_ia_it.js').read()
for p in sys.argv[1:]:
    s=open(p).read()
    if 'panelPromoIA' in s: print('ya',p); continue
    s=s.replace("  // ---------- Editor ----------", SN+"\n  // ---------- Editor ----------",1)
    a="const w = capa(p0 ? '✏️ Editar promo' : '➕ Nueva promo');"; assert a in s; s=s.replace(a,"const w = capa(p0 && p0.ia ? '🎬 Producir mi promo' : p0 ? '✏️ Editar promo' : '➕ Nueva promo');")
    a="btn('➕ Nueva promo', () => editor(null, pinta), true));"; assert a in s
    s=s.replace(a,"btn('✨ Hacer mis propias promos', () => panelPromoIA(pinta), true), btn('➕ Nueva promo (a mano)', () => editor(null, pinta)));")
    a="panelPromos, editor,"; assert a in s; s=s.replace(a,"panelPromos, panelPromoIA, promoIA: IA, editor,")
    open(p,'w').write(s); print('ok',p)
