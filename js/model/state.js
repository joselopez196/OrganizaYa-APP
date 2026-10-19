/* ===== MODELO · js/model/state.js =====
   ESTADO ÚNICO de la aplicación (Singleton): tareas, proyectos, archivos y accesos. */
let S={tasks:[],projects:[],files:[]},db=null;const urls={};
let mobileStateDB=null,stateReady=false;
try{const r=localStorage.getItem('mi-sistema');if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
if(!S.links)S.links=DL;
