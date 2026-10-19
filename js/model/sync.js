/* ===== MODELO · js/model/sync.js =====
   Sincronización genérica: instantánea, subida diferida y fusión de datos remotos. */
let cloud=null,pushT=null;
const snap=()=>JSON.stringify({tasks:S.tasks,projects:S.projects,links:S.links,files:S.files,lastBackup:S.lastBackup,at:S.at,lv:S.lv,adv:S.adv,del:S.del});
const push=()=>{if(!cloud)return;clearTimeout(pushT);pushT=setTimeout(()=>cloud.set({json:snap()}).then(()=>autoBk()).catch(()=>{}),1200)};
let ast=null,bkc=null,bkT=0;
const mergeF=rf=>{if(!rf)return S.files;const ids=new Set(rf.map(f=>f.id));return rf.concat(S.files.filter(f=>!f.aid&&!ids.has(f.id)))};
const UPT=f=>f.size<=20*1048576&&/^(image\/|video\/|text\/)|pdf|json|csv|markdown/.test(f.type||'');
function applyRemote(r,init){
  const rw=(r.at||0)>(S.at||0),del=Object.assign({},r.del,S.del);
  const mg=(a,b)=>{const m=new Map();(a||[]).forEach(x=>{if(x&&x.id&&!del[x.id])m.set(x.id,x)});(b||[]).forEach(x=>{if(!x||!x.id||del[x.id])return;const o=m.get(x.id);if(!o||(x.u||0)>(o.u||0)||((x.u||0)===(o.u||0)&&rw))m.set(x.id,x)});return[...m.values()]};
  const norm=a=>JSON.stringify([...(a||[])].sort((x,y)=>x.id<y.id?-1:1));
  const rt=norm(r.tasks),rp=norm(r.projects);
  S.del=del;S.tasks=mg(S.tasks,r.tasks);S.projects=mg(S.projects,r.projects);
  if(rw){S.links=r.links||S.links;S.lastBackup=r.lastBackup;S.adv=r.adv||S.adv;S.lv=r.lv||0}
  S.files=mergeF(r.files);const mig=migL();
  const push2=(r.at||0)<(S.at||0)||norm(S.tasks)!==rt||norm(S.projects)!==rp||mig;
  S.at=Math.max(r.at||0,S.at||0);seedH();if(push2)save();else saveLocal();
  if(init){Bus.emit('render');Bus.emit('toast','Datos sincronizados')}}
