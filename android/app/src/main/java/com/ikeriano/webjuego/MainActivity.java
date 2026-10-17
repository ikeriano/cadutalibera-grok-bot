package com.ikeriano.webjuego;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.MimeTypeMap;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

/**
 * WebView wrapper for ¡Ahora Caigo! (rebuild of v1.12).
 * Serves assets/www from https://appassets.androidplatform.net/ (with HTTP Range
 * support for audio/video), fullscreen immersive, file chooser, back-button dialog.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String ROOT = "www/";
    private static final int REQ_FILE = 4242;

    // Paquete único de recursos (www.pak + www.idx): pocas entradas en el APK, compatible con analizadores antiguos.
    private static Map<String, long[]> IDX = null;
    private static FileChannel PAK = null;
    private static long PAK0 = 0;
    // Hay que guardar el AssetFileDescriptor y el FileInputStream: si el recolector los libera, su finalizador
    // cierra el descriptor y todas las lecturas del paquete fallan (pantalla negra al abrir el modo 2D).
    private static android.content.res.AssetFileDescriptor PAKFD = null;
    private static FileInputStream PAKIN = null;
    private synchronized void abrirPak() {
        if (IDX != null) return;
        IDX = new HashMap<>();
        try {
            BufferedReader r = new BufferedReader(new InputStreamReader(getAssets().open("www.idx"), "UTF-8"));
            String l; while ((l = r.readLine()) != null) { String[] p = l.split("\t"); if (p.length == 3) IDX.put(p[0], new long[]{Long.parseLong(p[1]), Long.parseLong(p[2])}); }
            r.close();
            PAKFD = getAssets().openFd("www.pak");
            PAKIN = PAKFD.createInputStream();
            PAK = PAKIN.getChannel(); PAK0 = PAKFD.getStartOffset();
        } catch (Exception e) { IDX.clear(); PAK = null; }
    }
    /** Lectura posicional del paquete (segura con varias peticiones a la vez). */
    private static class PakStream extends InputStream {
        private long pos; private final long end;
        PakStream(long off, long len) { pos = PAK0 + off; end = pos + len; }
        @Override public int read() throws IOException { byte[] b = new byte[1]; int n = read(b, 0, 1); return n <= 0 ? -1 : (b[0] & 0xff); }
        @Override public int read(byte[] b, int off, int len) throws IOException { if (pos >= end) return -1; int want = (int) Math.min(len, end - pos); int n;
            try { n = PAK.read(ByteBuffer.wrap(b, off, want), pos); }
            catch (IOException e) { synchronized (PakStream.class) { PAK.position(pos); n = PAK.read(ByteBuffer.wrap(b, off, want)); } }
            if (n > 0) pos += n; return n; }
        @Override public long skip(long n) { long k = Math.min(n, end - pos); pos += k; return k; }
        @Override public int available() { return (int) Math.min(Integer.MAX_VALUE, end - pos); }
    }
    private static WebResourceResponse resp(String mime, String enc, int code, String why, Map<String, String> h, InputStream in) {
        if (Build.VERSION.SDK_INT >= 21) return new WebResourceResponse(mime, enc, code, why, h, in);
        return new WebResourceResponse(mime, enc, in);
    }

    private WebView web;
    private ValueCallback<Uri[]> fileCb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(2, 4, 12));
        setContentView(web);
        ocultarBarras();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        WebView.setWebContentsDebuggingEnabled(true);
        web.addJavascriptInterface(new Puente(), "AppNativo");
        if (Build.VERSION.SDK_INT < 29) try { requestPermissions(new String[]{"android.permission.WRITE_EXTERNAL_STORAGE"}, 7); } catch (Throwable ignored) { }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                return servir(r.getUrl(), r.getRequestHeaders());
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView v, String url) {
                if (Build.VERSION.SDK_INT >= 21) return null;
                return servir(Uri.parse(url), null);
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView v, String url) {
                Uri u = Uri.parse(url);
                if (HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }
        });

        if (Build.VERSION.SDK_INT >= 24) {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebResourceRequest r) {
                    return servir(r.getUrl(), r.getRequestHeaders());
                }
            });
        }

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                // Mis audios: respeta accept="audio/*,video/*" y multiple («Añadir audios»)
                java.util.ArrayList<String> tipos = new java.util.ArrayList<>();
                if (p != null && p.getAcceptTypes() != null)
                    for (String a : p.getAcceptTypes()) if (a != null) for (String t : a.split(",")) { t = t.trim(); if (!t.isEmpty() && t.contains("/")) tipos.add(t); }
                if (tipos.size() == 1) i.setType(tipos.get(0));
                else { i.setType("*/*"); if (tipos.size() > 1) i.putExtra(Intent.EXTRA_MIME_TYPES, tipos.toArray(new String[0])); }
                if (p != null && p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(Intent.createChooser(i, "Elegir archivo"), REQ_FILE);
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("https://" + HOST + "/index.html");
    }

    private WebResourceResponse servir(Uri u, Map<String, String> headers) {
        if (u == null || !HOST.equals(u.getHost())) return null;
        String path = u.getPath();
        if (path == null || path.isEmpty() || path.equals("/")) path = "/index.html";
        if (path.endsWith("/")) path += "index.html";
        path = Uri.decode(path.substring(1));
        String mime = mime(path);
        Map<String, String> h = new HashMap<>();
        h.put("Access-Control-Allow-Origin", "*");
        h.put("Cache-Control", "no-cache");
        h.put("Accept-Ranges", "bytes");
        long len = -1;
        InputStream in;
        abrirPak();
        long[] e0 = PAK != null ? IDX.get(path) : null;
        if (e0 != null) { len = e0[1]; in = new PakStream(e0[0], e0[1]); }
        else {
        try { android.content.res.AssetFileDescriptor fd = getAssets().openFd(ROOT + path); len = fd.getLength(); fd.close(); } catch (IOException ignored) { }
        try { in = getAssets().open(ROOT + path, android.content.res.AssetManager.ACCESS_STREAMING); }
        catch (IOException e) {
            return resp("text/plain", "utf-8", 404, "Not Found", h, new ByteArrayInputStream(new byte[0]));
        }
        }
        String enc = mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json") ? "utf-8" : null;
        String range = null;
        if (headers != null) for (Map.Entry<String, String> e : headers.entrySet())
            if ("range".equalsIgnoreCase(e.getKey())) range = e.getValue();
        try {
            if (len < 0 && range != null) { byte[] d = leer(in); len = d.length; in = new ByteArrayInputStream(d); }
            if (range != null && range.trim().startsWith("bytes=") && len >= 0) {
                String[] p = range.trim().substring(6).split("-", -1);
                long start, end;
                if (p[0].isEmpty()) { start = Math.max(0, len - Long.parseLong(p[1].trim())); end = len - 1; }
                else { start = Long.parseLong(p[0].trim()); end = p.length > 1 && !p[1].trim().isEmpty() ? Math.min(Long.parseLong(p[1].trim()), len - 1) : len - 1; }
                if (start >= len || start > end) { in.close(); h.put("Content-Range", "bytes */" + len); return resp(mime, enc, 416, "Range Not Satisfiable", h, new ByteArrayInputStream(new byte[0])); }
                long sk = start; while (sk > 0) { long k = in.skip(sk); if (k <= 0) break; sk -= k; }
                long n = end - start + 1;
                h.put("Content-Range", "bytes " + start + "-" + end + "/" + len);
                h.put("Content-Length", String.valueOf(n));
                return resp(mime, enc, 206, "Partial Content", h, new Limitado(in, n));
            }
        } catch (Exception ignored) { }
        if (len >= 0) h.put("Content-Length", String.valueOf(len));
        return resp(mime, enc, 200, "OK", h, in);
    }

    /** InputStream que entrega como máximo n bytes (para respuestas 206). */
    private static class Limitado extends java.io.FilterInputStream {
        private long left;
        Limitado(InputStream in, long n) { super(in); left = n; }
        @Override public int read() throws IOException { if (left <= 0) return -1; int c = super.read(); if (c >= 0) left--; return c; }
        @Override public int read(byte[] b, int off, int len) throws IOException { if (left <= 0) return -1; int n = super.read(b, off, (int) Math.min(len, left)); if (n > 0) left -= n; return n; }
    }

    private static byte[] leer(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] b = new byte[65536];
        int n;
        while ((n = in.read(b)) > 0) out.write(b, 0, n);
        in.close();
        return out.toByteArray();
    }

    private static String mime(String path) {
        int dot = path.lastIndexOf('.');
        String ext = dot >= 0 ? path.substring(dot + 1).toLowerCase() : "";
        switch (ext) {
            case "html": return "text/html";
            case "js": return "text/javascript";
            case "css": return "text/css";
            case "json": return "application/json";
            case "webmanifest": return "application/manifest+json";
            case "wasm": return "application/wasm";
            case "png": return "image/png";
            case "jpg": case "jpeg": return "image/jpeg";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            case "svg": return "image/svg+xml";
            case "ico": return "image/x-icon";
            case "mp3": return "audio/mpeg";
            case "ogg": return "audio/ogg";
            case "wav": return "audio/wav";
            case "m4a": return "audio/mp4";
            case "mp4": return "video/mp4";
            case "webm": return "video/webm";
            case "woff": return "font/woff";
            case "woff2": return "font/woff2";
            case "ttf": return "font/ttf";
            case "otf": return "font/otf";
            case "gltf": return "model/gltf+json";
            case "glb": return "model/gltf-binary";
            case "zip": return "application/zip";
            case "txt": return "text/plain";
        }
        String m = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
        return m != null ? m : "application/octet-stream";
    }

    @SuppressWarnings("deprecation")
    private void ocultarBarras() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) ocultarBarras();
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req == REQ_FILE && fileCb != null) {
            Uri[] r = null;
            if (res == RESULT_OK && data != null) {
                if (data.getClipData() != null && data.getClipData().getItemCount() > 0) {
                    android.content.ClipData cd = data.getClipData();
                    r = new Uri[cd.getItemCount()];
                    for (int k = 0; k < cd.getItemCount(); k++) r[k] = cd.getItemAt(k).getUri();
                } else if (data.getData() != null) r = new Uri[]{data.getData()};
            }
            fileCb.onReceiveValue(r);
            fileCb = null;
            return;
        }
        super.onActivityResult(req, res, data);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web != null && web.canGoBack()) { web.goBack(); return; }
        new AlertDialog.Builder(this)
                .setMessage("¿Salir del juego?")
                .setPositiveButton("Salir", (d, w) -> finish())
                .setNegativeButton("Seguir jugando", (d, w) -> d.dismiss())
                .show();
    }

    @Override protected void onPause() { super.onPause(); if (web != null) web.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); ocultarBarras(); }
    @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); if (web != null) web.saveState(o); }
    @Override protected void onDestroy() { if (web != null) web.destroy(); super.onDestroy(); }

    /** Puente JS → Android: guarda archivos (logos PNG, vídeos de promos) en Descargas/Imágenes/Películas. */
    public class Puente {
        @android.webkit.JavascriptInterface
        public String guardarArchivo(String nombre, String mime, String b64, String carpeta) {
            try {
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                String dir = "Pictures".equals(carpeta) ? android.os.Environment.DIRECTORY_PICTURES
                        : "Movies".equals(carpeta) ? android.os.Environment.DIRECTORY_MOVIES : android.os.Environment.DIRECTORY_DOWNLOADS;
                String sub = getApplicationInfo().loadLabel(getPackageManager()).toString().replaceAll("[^A-Za-z0-9 ñÑáéíóúÁÉÍÓÚ¡!¿?]", "").trim();
                if (Build.VERSION.SDK_INT >= 29) {
                    android.content.ContentValues cv = new android.content.ContentValues();
                    cv.put(android.provider.MediaStore.MediaColumns.DISPLAY_NAME, nombre);
                    cv.put(android.provider.MediaStore.MediaColumns.MIME_TYPE, mime);
                    cv.put(android.provider.MediaStore.MediaColumns.RELATIVE_PATH, dir + "/" + sub);
                    Uri col = "Pictures".equals(carpeta) ? android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI
                            : "Movies".equals(carpeta) ? android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI
                            : android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                    Uri u = getContentResolver().insert(col, cv);
                    if (u == null) return "error: sin destino";
                    java.io.OutputStream o = getContentResolver().openOutputStream(u);
                    o.write(d); o.close();
                    return "ok:" + dir + "/" + sub + "/" + nombre;
                } else {
                    java.io.File f = new java.io.File(android.os.Environment.getExternalStoragePublicDirectory(dir), sub);
                    f.mkdirs();
                    java.io.File g = new java.io.File(f, nombre);
                    java.io.FileOutputStream o = new java.io.FileOutputStream(g);
                    o.write(d); o.close();
                    android.media.MediaScannerConnection.scanFile(MainActivity.this, new String[]{g.getAbsolutePath()}, null, null);
                    return "ok:" + g.getAbsolutePath();
                }
            } catch (Throwable t) { return "error: " + t; }
        }
        @android.webkit.JavascriptInterface
        public boolean disponible() { return true; }
    }
}
