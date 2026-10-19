/* ===== MODELO · js/model/cloud-claude.js =====
   PATRÓN ESTRATEGIA (1/2): proveedor de nube de claude.ai. */
async function autoBk(force){if(!bkc||(!force&&Date.now()-bkT<6e5))return;bkT=Date.now();try{await bkc.doc(today()).set({json:snap(),at:Date.now()});const q=await bkc.get(),ds=q.docs.map(d=>d.id).filter(i=>/^\d{4}-/.test(i)).sort();for(const i of ds.slice(0,-14))await bkc.doc(i).delete()}catch(e){}}
async function cloudUp(f){if(!ast||f.aid||!UPT(f))return 0;const b=await idb('readonly',s=>s.get(f.id));if(!b)return 0;try{const r=await ast.upload(b);f.aid=r.id;return 1}catch(e){return 0}}
async function cloudInit(){try{if(!window.claude)return;const u=await claude.use('user'),d=await claude.use('db');if(!u||!d)return;const id=await u.id();if(!id)return;cloud=d.doc('data/users/'+id+'/state');bkc=d.collection('data/users/'+id+'/backups');try{ast=await claude.use('assets')}catch(e){}
 const sn=await cloud.get(),r=sn.exists?JSON.parse(sn.data().json):null;
 if(r)applyRemote(r,true);else cloud.set({json:snap()}).catch(()=>{});
 cloud.onSnapshot(sn=>{if(!sn.exists)return;try{const q=JSON.parse(sn.data().json);if((q.at||0)>(S.at||0)){applyRemote(q);Bus.emit('render-soft');Bus.emit('toast','Sincronizado con tus otros dispositivos')}}catch(e){}},()=>{});
 autoBk(true);Bus.emit('render-if','hoy')}catch(e){cloud=null}}
