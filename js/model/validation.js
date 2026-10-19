/* ===== MODELO · js/model/validation.js =====
   Validación y limpieza de datos importados. */
/* Validacion de datos importados */
const okId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,40}$/.test(x),okCol=c=>typeof c==='string'&&/^#[0-9a-fA-F]{3,8}$/.test(c),okDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d),okUrl=u=>typeof u==='string'&&u.length<2048&&/^(https?:\/\/|whatsapp:|intent:|tel:|sms:|itms-apps:|googlechromes:|microsoft-edge-https:)/i.test(u);
function cleanS(r){if(!r||typeof r!=='object')return null;
  const A=a=>Array.isArray(a)?a:[],T=(v,n)=>typeof v==='string'?v.slice(0,n||300):'',N=(v,d)=>Number.isFinite(+v)&&v!==null&&v!==''?+v:d,seen=new Set(),fresh=id=>{if(seen.has(id))return false;seen.add(id);return true};
  const o={tasks:[],projects:[],files:[],links:[],del:{}};
  A(r.tasks).forEach(t=>{if(!t||!okId(t.id)||!T(t.title).trim()||!fresh(t.id))return;o.tasks.push({id:t.id,title:T(t.title,300),p:okId(t.p)?t.p:'',due:okDate(t.due)?t.due:'',pri:[0,1,2].includes(+t.pri)?+t.pri:0,note:T(t.note,5000),done:!!t.done,doneAt:okDate(t.doneAt)?t.doneAt:'',time:/^\d{2}:\d{2}$/.test(t.time||'')?t.time:'',rep:['dia','sem','mes'].includes(t.rep)?t.rep:'',nx:t.nx?1:0,subs:A(t.subs).map(x=>({x:T(x&&x.x,300),d:!!(x&&x.d)})).filter(x=>x.x),u:N(t.u,0)})});
  A(r.projects).forEach(q=>{if(!q||!okId(q.id)||!T(q.name).trim()||!fresh(q.id))return;o.projects.push({id:q.id,name:T(q.name,200),color:okCol(q.color)?q.color:COL[0],due:okDate(q.due)?q.due:'',st:['activo','pausado','terminado'].includes(q.st)?q.st:'activo',arch:!!q.arch,u:N(q.u,0)})});
  A(r.links).forEach(l=>{if(!l||!okId(l.id)||!T(l.name).trim()||!okUrl(l.url)||!fresh(l.id))return;o.links.push({id:l.id,name:T(l.name,80),url:l.url,color:okCol(l.color)?l.color:COL[0]})});
  A(r.files).forEach(f=>{if(!f||!okId(f.id)||!fresh(f.id))return;const x={id:f.id,name:T(f.name,255)||'archivo',size:Math.max(0,N(f.size,0)),type:T(f.type,100),k:['img','vid','pres','otro'].includes(f.k)?f.k:'otro',ext:T(f.ext,6),p:okId(f.p)?f.p:'',created:N(f.created,0)};if(okId(f.aid))x.aid=f.aid;o.files.push(x)});
  if(r.del&&typeof r.del==='object')Object.keys(r.del).forEach(k=>{if(okId(k))o.del[k]=1});
  o.adv=N(r.adv,7);if(o.adv<1||o.adv>100)o.adv=7;o.lastBackup=okDate(r.lastBackup)?r.lastBackup:'';o.lv=Math.max(0,N(r.lv,0));return o}
/* marca como borrados los elementos que ya no estan en una copia restaurada, para que otros dispositivos no los devuelvan */
function replaceData(c){S.del=Object.assign({},S.del);const keep=new Set([...c.tasks,...c.projects].map(x=>x.id));[...S.tasks,...S.projects].forEach(x=>{if(!keep.has(x.id))S.del[x.id]=1});keep.forEach(id=>{delete S.del[id]});S.tasks=c.tasks;S.projects=c.projects;if(c.links.length)S.links=c.links;lastH={};}
