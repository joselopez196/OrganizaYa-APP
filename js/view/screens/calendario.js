/* ===== VISTA · js/view/screens/calendario.js =====
   Pantalla Calendario (mes y semana). */
let cal=null,selD=null;
let cv='mes';
function vSem(){if(!selD)selD=today();const w0=addD(selD,-((new Date(selD+'T12:00:00').getDay()+6)%7)),f=k=>fmtD(k).slice(0,5);let h='';for(let i=0;i<7;i++){const k=addD(w0,i),ts=S.tasks.filter(t=>t.due===k).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));h+=`<div class="wk ${k===today()?'tod':''}" ondragover="event.preventDefault()" ondrop="dropT(event,'${k}')"><b>${cap(new Date(k+'T12:00:00').toLocaleDateString('es',{weekday:'long'}))} ${f(k)}</b>${ts.map(taskRow).join('')||'<div class="m">Sin tareas</div>'}</div>`}
  $('#main').innerHTML=`<h2>Calendario</h2><div class="row" style="align-items:center"><button class="btn g" onclick="selD=addD(selD,-7);vSem()" aria-label="Semana anterior">◀</button><b style="flex:1;text-align:center">Semana del ${f(w0)} al ${f(addD(w0,6))}</b><button class="btn g" onclick="selD=addD(selD,7);vSem()" aria-label="Semana siguiente">▶</button><button class="btn g" onclick="selD=today();vSem()">Hoy</button><button class="btn g" onclick="cv='mes';lastTab=null;draw()">Mes</button></div>${h}`}
function vCal(){if(cv==='sem')return vSem();
  const now=new Date();if(!cal)cal={y:now.getFullYear(),m:now.getMonth()};if(!selD)selD=today();
  const first=new Date(cal.y,cal.m,1),start=(first.getDay()+6)%7,days=new Date(cal.y,cal.m+1,0).getDate();
  const mes=cap(first.toLocaleDateString('es',{month:'long',year:'numeric'}));
  const total=Math.ceil((start+days)/7)*7,td0=today();let c='',nM=0,nP=0,nL=0;
  for(let n=0;n<total;n++){const dt=new Date(cal.y,cal.m,1-start+n),out=dt.getMonth()!==cal.m,k=`${dt.getFullYear()}-${pad2(dt.getMonth()+1)}-${pad2(dt.getDate())}`,ts=S.tasks.filter(t=>t.due===k),pn=ts.filter(t=>!t.done).length,wk=n%7>4;
    if(!out){nM+=ts.length;nP+=pn;if(k<td0)nL+=pn}
    c+=`<button class="dy ${out?'out':''} ${wk?'we':''} ${k===td0?'tod':''} ${k===selD?'sel':''} ${k<td0&&pn?'ov':''}" onclick="pickD('${k}')" ondragover="event.preventDefault()" ondrop="dropT(event,'${k}')" aria-label="${k}${ts.length?', '+ts.length+' tareas':''}"><span>${dt.getDate()}</span><i>${ts.slice(0,3).map(t=>`<u style="background:${P(t.p)?P(t.p).color:'var(--mut)'};opacity:${t.done?.35:1}"></u>`).join('')}</i>${ts.length>3?`<em class="cn">+${ts.length-3}</em>`:''}</button>`}
  const sel=S.tasks.filter(t=>t.due===selD).sort(cmpT),sd=cap(new Date(selD+'T12:00:00').toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
  $('#main').innerHTML=`<h2>Calendario</h2><div id="clk" class="clk">${clockHtml()}</div>
  <div class="cw"><div><div class="row" style="align-items:center;max-width:640px"><button class="btn g" onclick="movM(-1)" aria-label="Mes anterior">◀</button><b style="flex:1;text-align:center;font-size:1.15rem">${mes}</b><button class="btn g" onclick="movM(1)" aria-label="Mes siguiente">▶</button><button class="btn g" onclick="cal=null;selD=null;vCal()">Hoy</button><button class="btn g" onclick="cv='sem';lastTab=null;draw()">Semana</button></div>
  <div class="cg">${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,j)=>`<div class="wd ${j>4?'we':''}">${d}</div>`).join('')}${c}</div>
  <div class="cm"><span>${nM} tarea${nM==1?'':'s'} este mes</span><span>·</span><span>${nP} pendiente${nP==1?'':'s'}</span>${nL?`<span class="late">· ${nL} vencida${nL==1?'':'s'}</span>`:''}</div>
  </div><div class="dp"><h3 style="margin:0 0 2px">${sd}</h3><div class="cm">${sel.filter(t=>!t.done).length} pendiente${sel.filter(t=>!t.done).length==1?'':'s'} · ${sel.filter(t=>t.done).length} hecha${sel.filter(t=>t.done).length==1?'':'s'}</div><div class="row"><input type="text" id="cd" placeholder="Nueva tarea para este día" aria-label="Nueva tarea" onkeydown="if(event.key==='Enter')addTD()"><button class="btn" onclick="addTD()">Agregar tarea</button></div>${sel.map(taskRow).join('')||'<div class="empty">Sin tareas este día.</div>'}</div></div>`;
  const g=$('.cg');if(g){let x0=0;g.ontouchstart=e=>{x0=e.touches[0].clientX};g.ontouchend=e=>{const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>60)movM(dx<0?1:-1)}}}
