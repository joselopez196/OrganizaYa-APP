/* ===== ARRANQUE · js/main.js =====
   Arranque: conecta Modelo y Vista (Observer) y enciende la app. */
try{const qt=new URLSearchParams(location.search).get('tab');if(['hoy','tareas','calendario','proyectos','archivos','accesos','ayuda'].includes(qt))tab=qt}catch(e){}
/* La Vista escucha al Modelo (Observer) */
Bus.on('render',()=>draw());
Bus.on('render-soft',()=>{const ae=document.activeElement;if(!ae||!/INPUT|TEXTAREA|SELECT/.test(ae.tagName))draw()});
Bus.on('render-if',t=>{if(tab===t)draw()});
Bus.on('toast',m=>toast(m));
pwa();draw();openDB().then(d=>{db=d;draw();openStateDB().then(()=>loadMobileState())}).catch(()=>{openStateDB().then(()=>loadMobileState())});cloudInit().then(()=>{if(!cloud)sbInit()});try{if(!localStorage.getItem('ms-guia'))tour(0)}catch(e){}setTimeout(()=>{const n=avisosList().length;if(n)toast('⚠ Tienes '+n+(n>1?' avisos':' aviso')+' de vencimientos');notiCheck()},1800);
