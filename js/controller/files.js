/* ===== CONTROLADOR · js/controller/files.js =====
   Controlador de archivos: subir, abrir, descargar, borrar. */
function saveF(id){const f=S.files.find(x=>x.id===id),v=$('#f1').value.trim();if(!v)return;f.name=v;f.p=$('#f2').value;save();closeM();draw()}
async function addF(){const fs=[...$('#fi').files];if(!fs.length)return toast('Elige primero uno o más archivos');if(!db)return toast('Este navegador no permite guardar archivos');
  const pv=$('#fp').value;let pi=0,ok=0,bad=0;const br=$('#bar');if(br)br.classList.add('on');
  for(const f of fs){const id=uid();if(await idb('readwrite',s=>s.put(f,id))===null){bad++;continue}
    S.files.push({id,name:f.name,size:f.size,type:f.type,k:kind(f),ext:((f.name.includes('.')?f.name.split('.').pop():'')||'FILE').slice(0,4).toUpperCase(),p:pv,created:Date.now()});ok++;
    await cloudUp(S.files[S.files.length-1]);const bb=$('#bar i');if(bb)bb.style.width=Math.round(++pi/fs.length*100)+'%'}
  save();draw();toast(bad?ok+' subidos, '+bad+' no se pudieron guardar (¿falta espacio?)':ok===1?'Archivo subido':ok+' archivos subidos')}
async function openF(id){const f=S.files.find(f=>f.id===id),u=await blobUrl(id);if(!u){toast('Ese archivo está solo en otro dispositivo');return}if(f.k==='img'||f.k==='vid')return openV(id);const pdf=f.name.toLowerCase().endsWith('.pdf');
  if(f.k==='img'||f.k==='vid'||pdf)openM(`<div class="box big">${f.k==='img'?`<img src="${u}" alt="">`:f.k==='vid'?`<video src="${u}" controls autoplay></video>`:`<iframe src="${u}" title="${esc(f.name)}"></iframe>`}<button class="btn g" onclick="dlF('${id}')">Descargar</button><button class="btn g" onclick="closeM()">Cerrar</button></div>`);
  else{toast('Descargando archivo…');dlF(id)}}
async function saveFile(name,data){saveFile.err=null;try{const d=window.claude&&await claude.use('downloads');if(d){await d.save({filename:name,data});return true}
  const bl=data instanceof Blob?data:new Blob([data],{type:mimeOf(name)}),file=new File([bl],name,{type:bl.type||mimeOf(name)});
  if(matchMedia('(pointer:coarse)').matches&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return true}catch(e2){if(e2&&e2.name==='AbortError')return false}}
  const u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);return true}
  catch(e){saveFile.err=e&&e.code;if(e&&e.name==='AbortError')return false;if(e&&e.code!=='declined')toast(e.code==='rejected_extension'?'No se puede descargar este tipo de archivo':'No se pudo guardar el archivo');return false}}
async function dlF(id){const f=S.files.find(f=>f.id===id);let b=await idb('readonly',s=>s.get(id));if(!b&&f.aid){try{b=await(await fetch('/_blob/'+f.aid)).blob()}catch(e){}}if(b)saveFile(f.name,b);else toast('Ese archivo está solo en otro dispositivo')}
async function delF(id){const f=S.files.find(x=>x.id===id),i=S.files.indexOf(f);S.files.splice(i,1);save();draw();undoT('Archivo eliminado',()=>{clearTimeout(pd[id]);S.files.splice(Math.min(i,S.files.length),0,f);save();draw()});pd[id]=setTimeout(()=>{idb('readwrite',s=>s.delete(id));delete urls[id];if(f.aid&&ast)ast.delete(f.aid).catch(()=>{})},6500)}
