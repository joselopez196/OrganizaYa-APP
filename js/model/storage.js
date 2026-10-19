/* ===== MODELO · js/model/storage.js =====
   PATRÓN REPOSITORIO: lectura y escritura en localStorage e IndexedDB (estado y archivos). */
const openStateDB=()=>new Promise(r=>{try{const q=indexedDB.open('mi-sistema-state',1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('state'))q.result.createObjectStore('state')};q.onsuccess=()=>{mobileStateDB=q.result;r(q.result)};q.onerror=()=>r(null)}catch(e){r(null)}});
const stateGet=()=>new Promise(r=>{if(!mobileStateDB)return r(null);try{const q=mobileStateDB.transaction('state','readonly').objectStore('state').get('data');q.onsuccess=()=>r(q.result||null);q.onerror=()=>r(null)}catch(e){r(null)}});
const statePut=v=>{try{if(!mobileStateDB)return;const q=mobileStateDB.transaction('state','readwrite').objectStore('state').put(v,'data');q.onerror=()=>{}}catch(e){}};
const loadMobileState=async()=>{const v=await stateGet();if(v&&v.json){try{const r=JSON.parse(v.json);if(r&&typeof r==='object'){const oldAt=S.at||0,newAt=r.at||0;if(!oldAt||newAt>=oldAt)S=Object.assign({tasks:[],projects:[],files:[],links:DL},r);seedH()}}catch(e){}}stateReady=true;Bus.emit('render')};
const saveLocal=()=>{const j=JSON.stringify(S);try{localStorage.setItem('mi-sistema',j)}catch(e){}statePut({json:j,at:S.at||Date.now()});};
const openDB=()=>new Promise(r=>{try{const q=indexedDB.open('mi-sistema-files',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
const idb=(m,fn)=>new Promise(r=>{if(!db)return r(null);try{const q=fn(db.transaction('f',m).objectStore('f'));q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
async function blobUrl(id){if(urls[id])return urls[id];const b=await idb('readonly',s=>s.get(id));if(b)return urls[id]=URL.createObjectURL(b);const f=S.files.find(x=>x.id===id);return f&&f.aid?'/_blob/'+f.aid:null}
