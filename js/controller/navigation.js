/* ===== CONTROLADOR · js/controller/navigation.js =====
   Controlador: cambiar de pestaña, filtros y fechas. */
function pickD(k){selD=k;const a=k.split('-');cal={y:+a[0],m:+a[1]-1};vCal()}
function movM(n){cal.m+=n;if(cal.m<0){cal.m=11;cal.y--}if(cal.m>11){cal.m=0;cal.y++}vCal()}
function tourEnd(){try{localStorage.setItem('ms-guia','1')}catch(e){}closeM()}
function goHoy(){tab='calendario';selD=today();cal=null;draw()}
function goTar(){tab='tareas';tf='pend';draw()}
function goHec(){tab='tareas';tf='hecha';draw()}
const setTf=k=>{tf=k;draw()};
const openP=id=>{tab='proyectos';pj=id;lastTab=null;draw()};
const setFf=k=>{ff=k;draw()};
