# Selector de archivos del WebView: respeta accept (audio/*,video/*) y «multiple» (Mis audios › Añadir audios)
import re, sys
p = sys.argv[1]; s = open(p, encoding='utf8').read()
if 'EXTRA_ALLOW_MULTIPLE' in s: print('ya'); sys.exit()
viejo = re.search(r'Intent i = new Intent\(Intent\.ACTION_GET_CONTENT\);\s*i\.addCategory\(Intent\.CATEGORY_OPENABLE\);\s*i\.setType\("\*/\*"\);', s)
assert viejo, 'chooser'
s = s.replace(viejo.group(0), '''Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                // Mis audios: respeta accept="audio/*,video/*" y multiple («Añadir audios»)
                java.util.ArrayList<String> tipos = new java.util.ArrayList<>();
                if (p != null && p.getAcceptTypes() != null)
                    for (String a : p.getAcceptTypes()) if (a != null) for (String t : a.split(",")) { t = t.trim(); if (!t.isEmpty() && t.contains("/")) tipos.add(t); }
                if (tipos.size() == 1) i.setType(tipos.get(0));
                else { i.setType("*/*"); if (tipos.size() > 1) i.putExtra(Intent.EXTRA_MIME_TYPES, tipos.toArray(new String[0])); }
                if (p != null && p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);''')
v2 = 'if (res == RESULT_OK && data != null && data.getData() != null) r = new Uri[]{data.getData()};'
assert v2 in s, 'result'
s = s.replace(v2, '''if (res == RESULT_OK && data != null) {
                if (data.getClipData() != null && data.getClipData().getItemCount() > 0) {
                    android.content.ClipData cd = data.getClipData();
                    r = new Uri[cd.getItemCount()];
                    for (int k = 0; k < cd.getItemCount(); k++) r[k] = cd.getItemAt(k).getUri();
                } else if (data.getData() != null) r = new Uri[]{data.getData()};
            }''')
open(p, 'w', encoding='utf8').write(s); print('ok')
