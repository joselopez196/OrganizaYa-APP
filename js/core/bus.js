/* ===== NÚCLEO · js/core/bus.js =====
   PATRÓN OBSERVER: bus de eventos. El Modelo avisa "algo cambió" y la Vista se suscribe, sin que el Modelo conozca la Vista. */
const Bus=(()=>{const h={};return{
  on(e,f){(h[e]=h[e]||[]).push(f);return()=>{h[e]=(h[e]||[]).filter(x=>x!==f)}},
  emit(e,...a){(h[e]||[]).slice().forEach(f=>f(...a))}}})();
