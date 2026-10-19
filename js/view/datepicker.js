/* ===== VISTA · js/view/datepicker.js =====
   Selector de fecha con el estilo del Calendario. */
/* ---- Selector de fecha con el estilo del Calendario ---- */
let dk=null;
const dkBtn=(id,v)=>`<input type="hidden" id="${id}" value="${v||''}"><button type="button" class="dkb" id="${id}b" onclick="dkOpen('${id}')" aria-label="Elegir fecha"><span>${fmtD(v)}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></button>`;
function dkOpen(id){const v=$('#'+id).value||today(),a=v.split('-');if(!dk)hPush();dk={id,y:+a[0],m:+a[1]-1};dkDraw()}
function dkMove(n){dk.m+=n;if(dk.m<0){dk.m=11;dk.y--}if(dk.m>11){dk.m=0;dk.y++}dkDraw()}
function dkHoy(){const a=today().split('-');dk.y=+a[0];dk.m=+a[1]-1;dkDraw()}
function dkDraw(){
  const cur=$('#'+dk.id).value,td=today(),first=new Date(dk.y,dk.m,1),start=(first.getDay()+6)%7,days=new Date(dk.y,dk.m+1,0).getDate(),total=Math.ceil((start+days)/7)*7;
  let c='';for(let n=0;n<total;n++){const dt=new Date(dk.y,dk.m,1-start+n),out=dt.getMonth()!==dk.m,k=`${dt.getFullYear()}-${pad2(dt.getMonth()+1)}-${pad2(dt.getDate())}`,ts=S.tasks.filter(t=>t.due===k),wk=n%7>4;
    c+=`<button type="button" class="dy ${out?'out':''} ${wk?'we':''} ${k===td?'tod':''} ${k===cur?'sel':''}" onclick="dkPick('${k}')" aria-label="${k}"><span>${dt.getDate()}</span><i>${ts.slice(0,3).map(t=>`<u style="background:${P(t.p)?P(t.p).color:'var(--mut)'};opacity:${t.done?.35:1}"></u>`).join('')}</i></button>`}
  let w=$('#dkp');if(!w){w=document.createElement('div');w.id='dkp';w.onclick=e=>{if(e.target===w)dkClose()};document.body.appendChild(w)}
  w.innerHTML=`<div class="dkbox"><div class="row" style="align-items:center;margin-bottom:10px"><button type="button" class="btn g" onclick="dkMove(-1)" aria-label="Mes anterior">◀</button><b style="flex:1;text-align:center;font-size:1.15rem">${cap(first.toLocaleDateString('es',{month:'long',year:'numeric'}))}</b><button type="button" class="btn g" onclick="dkMove(1)" aria-label="Mes siguiente">▶</button><button type="button" class="btn g" onclick="dkHoy()">Hoy</button></div><div class="cg">${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,j)=>`<div class="wd ${j>4?'we':''}">${d}</div>`).join('')}${c}</div><div class="row" style="margin:10px 0 0;justify-content:space-between"><button type="button" class="btn g" onclick="dkPick('')">Sin fecha</button><button type="button" class="btn g" onclick="dkClose()">Cerrar</button></div></div>`;
  w.style.display='grid'}
function dkPick(k){const id=dk.id;$('#'+id).value=k;const b=$('#'+id+'b');if(b)b.firstElementChild.textContent=fmtD(k);dkClose()}
function dkClose(fp){const w=$('#dkp'),had=!!dk;if(w){w.style.display='none';w.innerHTML=''}dk=null;if(had&&fp!==true)hBack()}
document.addEventListener('keydown',e=>{if(dk&&e.key==='Escape'){e.stopPropagation();dkClose()}},true);
