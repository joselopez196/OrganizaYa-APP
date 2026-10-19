/* ===== MODELO · js/model/changes.js =====
   Seguimiento de cambios por elemento y guardado (save). */
let lastH={};
const hItem=x=>JSON.stringify(Object.assign({},x,{u:0}));
const seedH=()=>{lastH={};[...S.tasks,...S.projects].forEach(x=>{lastH[x.id]=hItem(x)})};
const stamp=()=>{const n=Date.now();[...S.tasks,...S.projects].forEach(x=>{const h=hItem(x);if(lastH[x.id]!==h){x.u=n;lastH[x.id]=h}})};
seedH();
const save=()=>{stamp();S.at=Date.now();saveLocal();push()};
