/* ===== NÚCLEO · js/core/ics.js =====
   Formato iCalendar (.ics): escape y plegado de líneas. */
/* Calendario .ics (con hora y alarmas) */
const icsEsc=t=>String(t??'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
const icsFold=l=>{const enc=new TextEncoder();if(enc.encode(l).length<=75)return l;let out='',cur='',n=0;for(const ch of l){const b=enc.encode(ch).length;if(n+b>75){out+=cur+'\r\n';cur=' ';n=1}cur+=ch;n+=b}return out+cur};
