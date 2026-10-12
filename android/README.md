# ¡Ahora Caigo! — proyecto Android (rebuild de la v1.13)
WebView que carga assets/www/index.html desde https://appassets.androidplatform.net/ (servido desde los assets, con soporte de Range para audio y vídeo).
- Paquete com.ikeriano.ahoracaigo, actividad com.ikeriano.webjuego.MainActivity
- versionName 1.13, versionCode 14, minSdk 24, targetSdk/compileSdk 34
- El juego web está en app/src/main/assets/www (sin cambios respecto al original).

## Compilar
Requisitos: JDK 17+ y Android SDK (platform 34, build-tools 34). Crea local.properties con sdk.dir=...
    ./gradlew assembleRelease
Salida: app/build/outputs/apk/release/app-release.apk (firmado con keystore/; ver keystore/README.md).

## Para la 1.13
Sube versionCode y versionName en app/build.gradle (y también assets/www/version.json y el meta app-version de index.html).
