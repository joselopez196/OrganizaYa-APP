/* ===== MODELO · js/model/cloud-supabase.js =====
   PATRÓN ESTRATEGIA (2/2): proveedor de nube Supabase (misma interfaz get/set). */
/* ===== Sincronizacion entre dispositivos con Supabase (cuenta propia, sin servidor mio) ===== */
const SBK='ms-sb',SBSQL=`-- Mi sistema: tabla para sincronizar entre dispositivos.
-- Pégalo en Supabase > SQL Editor > New query > Run. Se puede ejecutar más de una vez sin problema.
-- Antes, crea en Storage un bucket privado llamado ms-files y fija el límite en 20 MB.
create table if not exists public.ms_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state text not null,
  updated_at timestamptz not null default now()
);
alter table public.ms_state enable row level security;
drop policy if exists ms_select on public.ms_state;
drop policy if exists ms_insert on public.ms_state;
drop policy if exists ms_update on public.ms_state;
drop policy if exists ms_delete on public.ms_state;
create policy ms_select on public.ms_state for select to authenticated using (auth.uid() = user_id);
create policy ms_insert on public.ms_state for insert to authenticated with check (auth.uid() = user_id);
create policy ms_update on public.ms_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy ms_delete on public.ms_state for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.ms_state to authenticated;
drop policy if exists ms_files_select on storage.objects;
drop policy if exists ms_files_insert on storage.objects;
drop policy if exists ms_files_update on storage.objects;
drop policy if exists ms_files_delete on storage.objects;
create policy ms_files_select on storage.objects for select to authenticated using (bucket_id = 'ms-files' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy ms_files_insert on storage.objects for insert to authenticated with check (bucket_id = 'ms-files' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy ms_files_update on storage.objects for update to authenticated using (bucket_id = 'ms-files' and (storage.foldername(name))[1] = (select auth.uid()::text)) with check (bucket_id = 'ms-files' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy ms_files_delete on storage.objects for delete to authenticated using (bucket_id = 'ms-files' and (storage.foldername(name))[1] = (select auth.uid()::text));
`;
let sb=null,sbOn=false,sbT=null,sbBusy=false,sbErr='';
const sbLoad=()=>{try{const o=JSON.parse(localStorage.getItem(SBK)||'null');return o&&typeof o.url==='string'&&typeof o.key==='string'?o:null}catch(e){return null}};
const sbStore=()=>{try{if(sb)localStorage.setItem(SBK,JSON.stringify(sb));else localStorage.removeItem(SBK)}catch(e){}};
const sbUrlOk=u=>/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(u);
async function sbRefresh(){try{const r=await fetch(sb.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:sb.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:sb.rt})});if(!r.ok){sbErr='Tu sesión venció. Vuelve a entrar.';return false}const j=await r.json();sb.at=j.access_token;sb.rt=j.refresh_token;sbStore();return true}catch(e){return false}}
async function sbReq(path,opt,again){const h=Object.assign({apikey:sb.key,'Content-Type':'application/json',Authorization:'Bearer '+(sb.at||sb.key)},opt&&opt.headers);
  const r=await fetch(sb.url+path,Object.assign({},opt,{headers:h}));
  if(r.status===401&&sb.rt&&again!==false&&await sbRefresh())return sbReq(path,opt,false);return r}
const sbOwnPath=p=>!!(sb&&typeof p==='string'&&p.startsWith(sb.uid+'/')&&!p.split('/').some(x=>!x||x==='.'||x==='..'));
const sbEncPath=p=>p.split('/').map(encodeURIComponent).join('/');
async function sbFileUp(f){if(!sbOn||!sb||!UPT(f))return 0;if(f.sbPath&&sbOwnPath(f.sbPath))return 1;if(f.sbPath)delete f.sbPath;
  const b=await idb('readonly',s=>s.get(f.id));if(!b)return 0;const path=sb.uid+'/'+f.id;
  try{const r=await sbReq('/storage/v1/object/ms-files/'+sbEncPath(path),{method:'POST',headers:{'Content-Type':b.type||f.type||'application/octet-stream','x-upsert':'true'},body:b});
    if(!r.ok){sbErr=r.status===404?'No existe el bucket privado ms-files. Créalo en Storage y vuelve a ejecutar el SQL.':r.status===403?'Faltan permisos de Storage. Vuelve a ejecutar el SQL de la app.':'No se pudo subir un archivo ('+r.status+').';return 0}
    f.sbPath=path;sbErr='';return 1}catch(e){sbErr=navigator.onLine===false?'Sin conexión. El archivo se volverá a intentar subir.':'No se pudo subir un archivo. Revisa la configuración de Storage.';return 0}}
async function sbFileGet(path){if(!sbOn||!sbOwnPath(path))return null;try{const r=await sbReq('/storage/v1/object/authenticated/ms-files/'+sbEncPath(path));if(!r.ok){sbErr=r.status===404?'No se encontró el archivo en Storage.':'No se pudo descargar el archivo ('+r.status+').';return null}return await r.blob()}catch(e){sbErr='No se pudo descargar el archivo. Revisa tu conexión.';return null}}
async function sbFileDel(path){if(!sbOn||!sbOwnPath(path))return false;try{const r=await sbReq('/storage/v1/object/ms-files',{method:'DELETE',body:JSON.stringify({prefixes:[path]})});if(!r.ok){sbErr='No se pudo eliminar un archivo de Storage ('+r.status+').';return false}return true}catch(e){sbErr='No se pudo eliminar un archivo de Storage.';return false}}
function sbCloud(){return{
  async get(){const r=await sbReq('/rest/v1/ms_state?select=state&user_id=eq.'+encodeURIComponent(sb.uid));
    if(!r.ok){const t=await r.text().catch(()=>'');throw new Error(/ms_state/.test(t)?'tabla':String(r.status))}
    const a=await r.json();return{exists:a.length>0&&!!a[0].state,data:()=>({json:a[0]&&a[0].state})}},
  async set(o){const j=JSON.parse(o.json);
    try{const r=await sbReq('/rest/v1/ms_state?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:sb.uid,state:JSON.stringify(j),updated_at:new Date().toISOString()})});
      if(!r.ok)throw new Error(r.status);sbErr=''}catch(e){sbErr='No se pudo sincronizar. Se reintentará al recuperar la conexión.';throw e}}}}
async function sbPoll(){if(!sb||!cloud||!sbOn||sbBusy||document.hidden||navigator.onLine===false)return;sbBusy=true;
  try{const sn=await cloud.get();if(!sn.exists){await cloud.set({json:snap()});return}
    const q=JSON.parse(sn.data().json);sbErr='';
    const before=JSON.stringify(S.files||[]),newer=(q.at||0)>(S.at||0);applyRemote(q);
    if(newer)Bus.emit('render-soft');
    const remoteFiles=JSON.stringify(q.files||[]),localFiles=JSON.stringify(S.files||[]);
    if((q.at||0)<(S.at||0)||remoteFiles!==localFiles)await cloud.set({json:snap()});
    if(before!==localFiles&&q.files&&q.files.length)Bus.emit('render-soft');sbErr=''}
  catch(e){sbErr=navigator.onLine===false?'Sin conexión. Se sincronizará al volver internet.':'No se pudo sincronizar. Se volverá a intentar.'}finally{sbBusy=false}}
async function sbInit(first){sb=sb||sbLoad();if(!sb||!sb.at||cloud)return;
  try{const c=sbCloud(),sn=await c.get();cloud=c;sbOn=true;sbErr='';
    const r=sn.exists?JSON.parse(sn.data().json):null;
    if(r)applyRemote(r,true);else c.set({json:snap()}).catch(()=>{});
    clearInterval(sbT);sbT=setInterval(sbPoll,20000);Bus.emit('render')}
  catch(e){cloud=null;sbOn=false;sbErr=e&&e.message==='tabla'?'Falta crear la tabla en Supabase (toca Copiar SQL y pégalo en el editor SQL).':navigator.onLine===false?'Sin conexión. Se sincronizará al volver internet.':'No se pudo conectar. Revisa la URL y la clave.';if(first)Bus.emit('toast',sbErr)}}
