/* ===== CONTROLADOR · js/controller/projects.js =====
   Controlador de proyectos. */
function addP(){const v=$('#pn').value.trim();if(!v)return $('#pn').focus();const dv=$('#pdd').value||'';S.projects.push({id:uid(),name:v,color:selC(),due:dv});save();draw();avisa(v,dv)||toast('Proyecto creado')}
function saveP(id){const p=P(id),v=$('#e1').value.trim();if(!v)return;p.name=v;p.color=selC();p.st=$('#e2').value;p.due=$('#e9').value;save();closeM();draw();avisa(v,p.due)}
function archP(id){const p=P(id);p.arch=!p.arch;save();closeM();pj=null;draw()}
function delP(id){ask('¿Eliminar el proyecto? Sus tareas y archivos se conservan sin proyecto.','Eliminar',()=>delP2(id))}
function delP2(id){S.projects=S.projects.filter(p=>p.id!==id);S.tasks.forEach(t=>t.p===id&&(t.p=''));S.files.forEach(f=>f.p===id&&(f.p=''));(S.del=S.del||{})[id]=1;save();closeM();draw()}
