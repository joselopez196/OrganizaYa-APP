/* ===== MODELO · js/model/queries.js =====
   Consultas del dominio (solo lectura): proyecto por id, tipo de archivo, avisos, orden. */
const vis=()=>S.links.filter(l=>!hideL(l));
const P=id=>S.projects.find(p=>p.id===id),pc=id=>(P(id)||{}).color||'var(--line)',pn=id=>(P(id)||{}).name||'Sin proyecto';
const kind=f=>{const e=(f.name.split('.').pop()||'').toLowerCase();return f.type.startsWith('image/')?'img':f.type.startsWith('video/')?'vid':['ppt','pptx','key','odp','pdf'].includes(e)?'pres':'otro'};
const cmpT=(a,b)=>(a.due||'9').localeCompare(b.due||'9')||(a.time||'99').localeCompare(b.time||'99');
function avisosList(){const a=S.adv||7,it=[];S.tasks.forEach(t=>{if(!t.done&&t.due){const d=dd(t.due);if(d<=a)it.push([d,'Tarea',t.title])}});S.projects.forEach(p=>{if(p.due&&!p.arch&&p.st!=='terminado'){const d=dd(p.due);if(d<=a)it.push([d,'Proyecto',p.name])}});return it.sort((x,y)=>x[0]-y[0])}
