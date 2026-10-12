// ===================================================================================================
// DATOS DE CADA ETAPA DE ¡AHORA CAIGO!  ·  ARCHIVO FÁCIL DE CAMBIAR
// Aquí están la mecánica y las cifras de las monedas de cada etapa. Para cambiar una cifra, edita la lista
// «cifras» de su etapa y vuelve a construir (tools/build.sh). Valores: número (euros), o 'doble', 'mitad', 'cero', 'vida'.
//  · 2011-2021: 10 cifras (una por trampilla; se reparten al azar entre las 10 trampillas en cada programa).
//  · 2021-actual: 20 cifras (huella blanca = las 10 primeras, huella negra = las 10 últimas).
// 2011-2021: las 10 cifras de la pantalla de premios del programa (5.000, 2.000, 1.000, 500 y 1 €, dos de cada).
// Los COMODINES (círculos verdes con huellas a la izquierda de la tabla de premios) son «comodines».
// ===================================================================================================
const ETAPAS_DATOS = {
  '2011': {
    duelos: 10,                 // rivales a los que hay que tirar
    pruebas: ['clasico'],       // solo duelos clásicos
    eleccion: true,             // el central se elige con la tableta
    moneda: 'fija',             // cada trampilla esconde una cifra (no se elige lado)
    plantarse: true,            // tras cada duelo ganado: plantarse con lo ganado o seguir
    final: 'bote',              // si tiras a los 10, te llevas el bote
    bote: 100000,
    comodines: 2,               // PASAR que tiene el central en todo el programa
    relevo: false,              // si pierdes, el oponente NO ocupa tu sitio
    dobladora: false,
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 1, 1],
  },
  '2015': {
    duelos: 10,
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true, moneda: 'fija', plantarse: true, final: 'bote', bote: 100000,
    comodines: 2,
    relevo: true,               // desde 2015: el oponente que te gana ocupa tu sitio y se queda tu dinero y tu comodín
    dobladora: false,
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 1, 1],
  },
  '2017': {
    duelos: 10,
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true, moneda: 'fija', plantarse: true, final: 'bote', bote: 100000,
    comodines: 2, relevo: true,
    dobladora: true,            // una trampilla esconde la Huella Dobladora: dobla tu bote
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 1, 1],
  },
  '2021': {                     // CADUTA LIBERA: mecánica de Ahora Caigo (Antena 3, 2011-2021) con 10 rivales y el juego final de siempre
    duelos: 10,                 // hay que tirar a los 10 rivales (antes 8)
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true,
    moneda: 'fija',             // cada trampilla esconde una cifra, como en Antena 3
    plantarse: false,           // la decisión llega tras los 10 duelos
    final: 'duelo10',           // juego final sin cambios: 10 preguntas en 2 minutos
    comodines: 2, relevo: true, dobladora: true,
    cifras: [20000, 15000, 15000, 10000, 10000, 10000, 7000, 5000, 5000, 3000],   // cifras de la app de Caduta Libera
  },
};
