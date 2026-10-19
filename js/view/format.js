/* ===== VISTA · js/view/format.js =====
   Formato de textos, tamaños y fechas para mostrar. */
const size=n=>n>1e6?(n/1e6).toFixed(1)+' MB':Math.max(1,Math.round(n/1e3))+' KB';
const fd=k=>{const t=today(),d=Math.round((new Date(k+'T12:00:00')-new Date(t+'T12:00:00'))/864e5);return d===0?'Hoy':d===1?'Mañana':d===-1?'Ayer':fmtD(k)};
const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
const tm=n=>{const t=n.toLocaleTimeString('es-PE',{hour:'numeric',minute:'2-digit',hour12:true}),m=t.match(/^(\d{1,2}:\d{2})\s*(.*)$/);return m?`${m[1]}<small>${esc(m[2])}</small>`:esc(t)};
const capW=x=>x.charAt(0).toUpperCase()+x.slice(1);
const fmtD=k=>k?k.split('-').reverse().join('/'):'Sin fecha';
const venceTxt=d=>d<0?'venció hace '+(-d)+(d===-1?' día':' días'):d===0?'vence hoy':d===1?'vence mañana':'vence en '+d+' días';
