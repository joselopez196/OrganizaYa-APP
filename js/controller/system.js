/* ===== CONTROLADOR · js/controller/system.js =====
   Controlador del sistema: instalación, notificaciones, errores, teclado, conexión. */
addEventListener('error',e=>{try{toast('Error: '+(e.message||'desconocido')+(e.lineno?' (línea '+e.lineno+')':''))}catch(_){}});
addEventListener('unhandledrejection',e=>{try{toast('Error: '+((e.reason&&e.reason.message)||e.reason||'desconocido'))}catch(_){}});
let dip=null;
const isIOSDevice=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true;
function instalarIOS(){openM(`<div class="box"><div class="m">OrganizaYa · Instalación</div><b style="font-size:1.2rem">Instalar en iPhone o iPad</b><p>En Safari toca <b>Compartir</b> → <b>Añadir a pantalla de inicio</b> → <b>Añadir</b>.</p><div class="row" style="margin:0"><button class="btn" onclick="closeM()">Entendido</button></div></div>`)}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;draw()});
addEventListener('appinstalled',()=>{dip=null;draw();toast('App instalada')});
async function instalar(){if(!dip)return;try{dip.prompt();await dip.userChoice}catch(e){}dip=null;draw()}
addEventListener('offline',()=>toast('Sin conexión. La app sigue funcionando con tus datos guardados'));
addEventListener('online',()=>toast('Conexión recuperada'));
/* Notificaciones del sistema (se muestran al abrir la app; no hay servidor que las envie con la app cerrada) */
const nOk=()=>{try{return 'Notification' in window}catch(e){return false}};
function notiCheck(force){try{if(!nOk()||Notification.permission!=='granted')return;const td=today();if(!force&&localStorage.getItem('ms-noti')===td)return;const it=avisosList();if(!it.length)return;localStorage.setItem('ms-noti',td);
  const body=it.slice(0,4).map(([d,k,n])=>k+': '+n+' · '+venceTxt(d)).join('\n')+(it.length>4?'\ny '+(it.length-4)+' más':''),t='OrganizaYa · '+it.length+(it.length>1?' avisos':' aviso'),opt={body,icon:'icons/icon-192.png',badge:'icons/icon-192.png',tag:'ms-avisos'};
  const direct=()=>{try{new Notification(t,opt)}catch(e){}};
  if('serviceWorker' in navigator)navigator.serviceWorker.getRegistration().then(r=>r?r.showNotification(t,opt):direct()).catch(direct);else direct()}catch(e){}}
function notiOn(){try{Notification.requestPermission().then(p=>{if(p==='granted'){toast('Notificaciones activadas');notiCheck(true)}else toast('No se dieron permisos de notificación');draw()})}catch(e){toast('Este navegador no permite notificaciones')}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)notiCheck()});
addEventListener('online',()=>{if(sb&&!cloud)sbInit();else sbPoll()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(sb&&!cloud)sbInit();else sbPoll()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM();if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.it,.pc,.pv')){e.preventDefault();e.target.click()}});
function pwa(){try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('./service-worker.js').catch(()=>{})}catch(e){}try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}}
