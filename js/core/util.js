/* ===== NÚCLEO · js/core/util.js =====
   Utilidades generales sin lógica de negocio: selector, escape HTML, ids, fechas, conversiones. */
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const d2b=d=>{const m=/^data:([^;,]*)(;base64)?,([\s\S]*)$/.exec(d);if(!m)throw new Error('bad');const bin=m[2]?atob(m[3]):decodeURIComponent(m[3]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new Blob([u],{type:m[1]||'application/octet-stream'})};
const pad2=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const addD=(k,n)=>{const d=new Date(k+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const addR=(k,r)=>{if(r==='mes'){const d=new Date(k+'T12:00:00');d.setMonth(d.getMonth()+1);return iso(d)}return addD(k,r==='sem'?7:1)};
const dd=k=>Math.round((new Date(k+'T12:00:00')-new Date(today()+'T12:00:00'))/864e5);
const mimeOf=n=>/\.ics$/i.test(n)?'text/calendar':/\.json$/i.test(n)?'application/json':/\.csv$/i.test(n)?'text/csv':'application/octet-stream';
const b64=b=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(b)});
