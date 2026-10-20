import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

// World and specimen have separate cameras and orbit states. Entering the
// specimen never moves, hides, reparents or recolours the world plant.
export function installSpecimenViewer({scene,camera,renderer,sun,plants,selectable,botany,library}) {
  const $=id=>document.getElementById(id),canvas=renderer.domElement;
  const world={theta:.72,phi:.96,zoom:29},study={theta:.55,phi:1.05,zoom:innerWidth<=850?.8:1};
  const specimen=new T.Scene();specimen.background=new T.Color('#172630');
  specimen.environment=scene.environment;
  const studyCamera=new T.PerspectiveCamera(38,1,.01,100);
  specimen.add(new T.HemisphereLight(0xd4e5ec,0x514a39,2));
  const key=new T.DirectionalLight(0xffe3bd,3.2);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0003;specimen.add(key);
  const fill=new T.DirectionalLight(0xc2dbec,1.3);fill.position.set(3,2,-3);specimen.add(fill);
  const floor=new T.Mesh(new T.CylinderGeometry(1,1,.035,64),
    new T.MeshStandardMaterial({color:'#30494b',roughness:.76,metalness:.1}));
  floor.position.y=-.035;floor.receiveShadow=true;specimen.add(floor);
  let mode='world',kind='whorl',variant=0,stage='adult',current=null,pair=null,comparison=false,radius=1,target=new T.Vector3(0,.6,0);
  let selectedPlant=null,returnFocus=$('enter-specimen');
  let viewport={x:0,y:0,width:innerWidth,height:innerHeight};
  const raycaster=new T.Raycaster(),pointer=new T.Vector2(),active=new Map();
  let last=null,pinch=0,tapStart=null,moved=false;
  const state=()=>mode==='world'?world:study;
  const limits=()=>mode==='world'?[13,48]:[.65,2.8];
  function setZoom(z){const [min,max]=limits();state().zoom=T.MathUtils.clamp(z,min,max);}

  function updateCamera(){
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    const d=world.zoom*Math.max(1,.95/camera.aspect);
    camera.position.set(d*Math.sin(world.phi)*Math.sin(world.theta),d*Math.cos(world.phi),d*Math.sin(world.phi)*Math.cos(world.theta));
    camera.lookAt(0,-.2,0);
    if(mode==='specimen'){
      const mobile=innerWidth<=850;
      const top=$('topbar').getBoundingClientRect().bottom+10;
      const bottom=mobile?innerHeight-$('specimen-panel').getBoundingClientRect().top+12:60;
      const right=mobile?0:325;
      viewport={x:0,y:bottom,width:Math.max(1,innerWidth-right),height:Math.max(1,innerHeight-top-bottom)};
      const paneWidth=comparison?(viewport.width-12)/2:viewport.width;
      studyCamera.aspect=paneWidth/viewport.height;
      const labelTop=innerHeight-viewport.y-viewport.height+4;
      for(const [id,x] of [['expanded-label',viewport.x],['juvenile-label',viewport.x+paneWidth+12]]){
        const label=$(id);label.hidden=!comparison;label.style.left=x+'px';label.style.top=labelTop+'px';label.style.width=paneWidth+'px';
      }studyCamera.updateProjectionMatrix();
      const fit=radius/Math.sin(T.MathUtils.degToRad(studyCamera.fov/2))*1.12;
      const distance=fit*study.zoom*Math.max(1,1/studyCamera.aspect);
      studyCamera.position.setFromSphericalCoords(distance,study.phi,study.theta).add(target);
      studyCamera.lookAt(target);floor.visible=study.phi<Math.PI/2;
    }
  }
  function rebuild(){
    if(current)specimen.remove(current);if(pair){specimen.remove(pair);pair=null;}
    const adult=botany.create(kind,variant,'adult');
    adult.updateMatrixWorld(true);
    const box=new T.Box3().setFromObject(adult),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
    current=comparison||stage==='adult'?adult:botany.create(kind,variant,'juvenile');
    current.position.set(-center.x,-box.min.y,-center.z);
    if(comparison){
      pair=botany.create(kind,variant,'juvenile');pair.updateMatrixWorld(true);
      const pairBox=new T.Box3().setFromObject(pair);
      pair.position.set(-center.x,-pairBox.min.y,-center.z);pair.visible=false;specimen.add(pair);
    }
    specimen.add(current);radius=Math.max(.7,size.length()*.5);
    target.set(0,size.y*.5,0);floor.scale.set(radius*.65,1,radius*.65);key.shadow.camera.left=key.shadow.camera.bottom=-radius*1.5;key.shadow.camera.right=key.shadow.camera.top=radius*1.5;key.shadow.camera.updateProjectionMatrix();key.shadow.needsUpdate=true;
    $('specimen-title').textContent=botany.definitions[kind].label;
    $('specimen-description').textContent=botany.definitions[kind].description;
    $('stage-note').textContent=comparison?'Matched display scale · proposed development':stage==='adult'?'Expanded form · creative hypothesis':'Juvenile form · proposed development, not observed biology';
    $('form').value=kind;$('stage').value=stage;$('stage').disabled=comparison;$('compare').setAttribute('aria-pressed',String(comparison));$('compare').textContent=comparison?'Single specimen':'Compare stages';
    updateCamera();
  }
  function enter(plant=null){
    if(mode==='world')returnFocus=plant?canvas:document.activeElement;
    selectedPlant=plant;
    if(plant){kind=plant.userData.kind;variant=plant.userData.variant;}
    else{kind=$('form').value;variant=['whorl','tiers','fan'].indexOf(kind);}
    mode='specimen';stage='adult';comparison=false;frames=0;started=performance.now();$('performance').textContent='Measuring…';Object.assign(study,{theta:.55,phi:1.05,zoom:innerWidth<=850?.8:1});
    $('panel').hidden=true;$('specimen-panel').hidden=false;
    $('return-world').hidden=false;$('enter-specimen').hidden=true;
    $('mode-label').textContent='Specimen study · v0.11 · PROVISIONAL';
    $('info').textContent='Drag to orbit · scroll or pinch to zoom · no physical scale assigned';
    document.body.dataset.mode='specimen';
    rebuild();$('return-world').focus();active.clear();last=null;pinch=0;
  }
  function leave(){
    mode='world';$('expanded-label').hidden=true;$('juvenile-label').hidden=true;frames=0;started=performance.now();$('performance').textContent='Measuring…';$('specimen-panel').hidden=true;$('return-world').hidden=true;
    $('enter-specimen').hidden=false;$('panel').hidden=true;
    $('mode-label').textContent='Reedwater miniature · v0.11 · all elements PROVISIONAL';
    $('info').textContent='Select a plant to inspect · drag to orbit · pinch to zoom';
    document.body.dataset.mode='world';active.clear();last=null;pinch=0;updateCamera();
    if(returnFocus?.isConnected&&returnFocus.getClientRects().length)returnFocus.focus();else canvas.focus();
  }
  function findPlant(object){let root=object;while(root&&!plants.includes(root))root=root.parent;return root;}
  function pick(e){
    if(mode!=='world')return;
    const bounds=canvas.getBoundingClientRect();
    pointer.set((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1);
    scene.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);
    const visible=selectable.filter(o=>{let p=o;while(p){if(!p.visible)return false;p=p.parent;}return true;});
    const hit=raycaster.intersectObjects(visible,false)[0];if(!hit)return;
    const data=hit.object.userData,flora=data.feature==='flora';
    selectedPlant=flora?findPlant(hit.object):null;
    $('featureTitle').textContent=flora?data.label+' · unassigned':'Raised settlement structure';
    $('status').textContent='PROVISIONAL — VISUAL STUDY';
    $('description').textContent=flora?data.description+' Anatomy, palette, scale and local presence remain unverified.':
      'A speculative raised building; construction and settlement location are unverified.';
    $('inspect-selected').hidden=!flora;$('panel').hidden=false;
    $('close').focus();
  }
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    if(active.size===0){tapStart={x:e.clientX,y:e.clientY};moved=false;}
    else moved=true;
    active.set(e.pointerId,{x:e.clientX,y:e.clientY});
    canvas.setPointerCapture(e.pointerId);last={x:e.clientX,y:e.clientY};
    if(active.size===2){const [a,b]=[...active.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);}
  });
  canvas.addEventListener('pointermove',e=>{
    if(!active.has(e.pointerId))return;
    if(tapStart&&Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y)>8)moved=true;
    active.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...active.values()],s=state();
    if(points.length===2){
      const d=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);
      if(d>0&&pinch>0)setZoom(s.zoom*pinch/d);pinch=d;
    }else if(points.length===1&&last){
      s.theta-=(e.clientX-last.x)*.007;
      s.phi=T.MathUtils.clamp(s.phi+(e.clientY-last.y)*.007,.12,mode==='world'?1.52:2.8);
    }
    last={x:e.clientX,y:e.clientY};updateCamera();
  });
  function release(e,cancel=false){
    if(!active.has(e.pointerId))return;
    const tap=!cancel&&!moved&&active.size===1&&tapStart&&Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y)<=8;
    active.delete(e.pointerId);last=active.size===1?[...active.values()][0]:null;pinch=0;
    if(active.size===0)tapStart=null;
    if(tap)pick(e);
  }
  canvas.addEventListener('pointerup',e=>release(e));
  canvas.addEventListener('pointercancel',e=>release(e,true));
  canvas.addEventListener('lostpointercapture',e=>{if(active.has(e.pointerId))release(e,true)});
  canvas.addEventListener('wheel',e=>{e.preventDefault();setZoom(state().zoom*Math.exp(e.deltaY*.001));updateCamera()},{passive:false});
  function reset(){Object.assign(state(),mode==='world'?{theta:.72,phi:.96,zoom:29}:{theta:.55,phi:1.05,zoom:innerWidth<=850?.8:1});updateCamera();}
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key))return;
    e.preventDefault();const s=state();
    if(e.key==='ArrowLeft')s.theta+=.08;if(e.key==='ArrowRight')s.theta-=.08;
    if(e.key==='ArrowUp')s.phi=Math.max(.12,s.phi-.08);
    if(e.key==='ArrowDown')s.phi=Math.min(mode==='world'?1.52:2.8,s.phi+.08);
    if(e.key==='+'||e.key==='=')setZoom(s.zoom*.9);if(e.key==='-')setZoom(s.zoom/ .9);
    if(e.key==='Home')reset();updateCamera();
  });
  $('reset').onclick=reset;
  $('enter-specimen').onclick=()=>enter();
  $('inspect-selected').onclick=()=>enter(selectedPlant);
  $('return-world').onclick=leave;
  $('close').onclick=()=>{$('panel').hidden=true;canvas.focus();};
  $('form').onchange=()=>{if(mode==='specimen'){kind=$('form').value;variant=['whorl','tiers','fan'].indexOf(kind);rebuild();}};
  $('compare').onclick=()=>{comparison=!comparison;rebuild();};
  $('stage').onchange=()=>{stage=$('stage').value;rebuild();};
  $('light').onchange=()=>{const raking=$('light').value==='raking';key.position.set(raking?-5:-3,raking?1:5,4);key.intensity=raking?4:3.2;};
  $('top-view').onclick=()=>{study.phi=.12;updateCamera();};
  $('side-view').onclick=()=>{study.phi=1.5;updateCamera();};
  addEventListener('keydown',e=>{if(e.key==='Escape'){if(mode==='specimen')leave();else{$('panel').hidden=true;canvas.focus();}}});
  addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);updateCamera();});
  const quality=$('quality');
  quality.value=innerWidth<700?'low':(navigator.hardwareConcurrency||4)>=8?'high':'balanced';
  function applyQuality(){
    const q=quality.value,cap={low:1,balanced:1.5,high:2,ultra:2.5}[q];
    renderer.setPixelRatio(Math.min(devicePixelRatio,cap));renderer.shadowMap.enabled=q!=='low';
    renderer.toneMappingExposure=q==='low'?1.1:1.15;
    const size={low:512,balanced:1024,high:1536,ultra:2048}[q];
    sun.shadow.mapSize.set(size,size);sun.shadow.map?.dispose();sun.shadow.map=null;sun.shadow.needsUpdate=true;
    scene.fog.density=q==='low'?.006:.012;plants.forEach((p,i)=>p.visible=q!=='low'||i%2===0);
  }
  quality.onchange=applyQuality;applyQuality();updateCamera();
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();$('info').textContent='Graphics paused. Reload to restore the viewer.';});
  canvas.setAttribute('aria-label','Reedwater 3D viewer. Drag or arrow keys orbit. Plus and minus zoom. Home resets. Escape returns from specimen mode. All elements provisional.');
  // The displayed performance sample measures this browser, not a device class.
  let frames=0,started=performance.now(),sampleMs=0;
  document.addEventListener('visibilitychange',()=>{frames=0;sampleMs=0;started=performance.now();});
  renderer.setAnimationLoop(now=>{
    if(document.hidden)return;
    renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);
    if(mode==='specimen'){
      renderer.setClearColor('#172630');renderer.clear();
      const width=comparison?(viewport.width-12)/2:viewport.width;
      let draws=0;
      for(let i=0;i<(comparison?2:1);i++){
        current.visible=i===0;if(pair)pair.visible=i===1;
        renderer.setScissor(viewport.x+i*(width+12),viewport.y,width,viewport.height);
        renderer.setViewport(viewport.x+i*(width+12),viewport.y,width,viewport.height);
        renderer.setScissorTest(true);renderer.render(specimen,studyCamera);draws+=renderer.info.render.calls;
      }
      renderer.info.render.calls=draws;
      current.visible=true;if(pair)pair.visible=false;renderer.setScissorTest(false);
    }else renderer.render(scene,camera);
    frames++;sampleMs=now-started;
    if(sampleMs>=1000){
      $('performance').textContent=Math.round(frames*1000/sampleMs)+' fps · '+renderer.info.render.calls+' draws';
      $('performance').title='Current browser sample; not a mobile-device benchmark.';
      frames=0;started=now;
    }
  });
  return {enter,leave};
}
