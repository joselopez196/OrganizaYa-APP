/* ===== VISTA · js/view/screens/tareas.js =====
   Pantalla Tareas. */
let tq='',tpf='',tso='pri';
const tUp=()=>{$('#tl').innerHTML=tList()};
function tList(){const q=tq.toLowerCase(),l=S.tasks.map((t,i)=>[t,i]).filter(([t])=>(tf==='hecha')===!!t.done&&(!tpf||(tpf==='_'?!t.p:t.p===tpf))&&(!q||t.title.toLowerCase().includes(q))).sort((a,b)=>(tf==='hecha'?(b[0].doneAt||'').localeCompare(a[0].doneAt||''):((tso==='fecha'?0:(b[0].pri||0)-(a[0].pri||0))||cmpT(a[0],b[0])))||b[1]-a[1]).map(x=>x[0]);return l.map(taskRow).join('')||'<div class="empty">Sin tarea. Escribe para empezar</div>'}
function vTareas(){
  $('#main').innerHTML=`<h2>Tareas</h2><p class="sub">Toca una tarea para editarla</p><div class="row"><input type="text" id="tt" class="tin" placeholder="Nueva tarea" aria-label="Nueva tarea" onkeydown="if(event.key==='Enter')addT()">${dkBtn('tdd',today())}<button class="btn" onclick="addT()">Agregar tarea</button></div>
  <div class="row"><input type="text" placeholder="Buscar tareas…" aria-label="Buscar tareas" value="${esc(tq)}" oninput="tq=this.value;tUp()" style="max-width:240px"><select aria-label="Filtrar por proyecto" onchange="tpf=this.value;tUp()"><option value="">Todos los proyectos</option><option value="_" ${tpf==='_'?'selected':''}>Sin proyecto</option>${S.projects.map(p=>`<option value="${p.id}" ${tpf===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><select aria-label="Ordenar" onchange="tso=this.value;tUp()"><option value="pri">Orden: Prioridad</option><option value="fecha" ${tso==='fecha'?'selected':''}>Orden: Fecha</option></select></div>
  ${chips([['pend','Pendientes'],['hecha','Hechas']],tf,'setTf')}<div id="tl">${tList()}</div>`;
}
