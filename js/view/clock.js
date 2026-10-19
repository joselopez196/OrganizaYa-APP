/* ===== VISTA · js/view/clock.js =====
   Reloj y saludo de la pantalla Hoy. */
const clockHtml=()=>{const n=new Date();const h=n.getHours(),sal=h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches';return `<b>${tm(n)}</b><span>${capW(sal+' · '+n.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'}))}</span>`};
const tickClk=()=>{const e=$('#clk'),h=clockHtml();if(e&&e.dataset.h!==h){e.innerHTML=h;e.dataset.h=h}};
const sched=()=>{tickClk();clearTimeout(sched.h);sched.h=setTimeout(sched,60000-Date.now()%60000+30)};
sched();document.addEventListener('visibilitychange',()=>{if(!document.hidden)sched()});window.addEventListener('focus',sched);
