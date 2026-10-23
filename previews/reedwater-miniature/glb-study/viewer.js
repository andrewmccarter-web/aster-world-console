// Adapted from ASTER-WORLD experiment/world-console-glb-20261021.
// Public preview: file-import only; no canonical species/occurrence association.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {inspectGLB} from './glb_gate.mjs';
const el=id=>document.getElementById(id),stage=el('stage'),status=el('status');
let root,mixer,action,playing=false,generation=0;
const scene=new T.Scene();scene.background=new T.Color('#18303b');
const camera=new T.PerspectiveCamera(42,1,.01,1000),renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
scene.add(new T.HemisphereLight(0xe4f1ff,0x6b6350,2.4));const light=new T.DirectionalLight(0xffe6cb,3);light.position.set(3,5,4);scene.add(light);
const manager=new T.LoadingManager();manager.setURLModifier(url=>{if(!url.startsWith('blob:'))throw Error('External resources blocked');return url;});
const loader=new GLTFLoader(manager);
function dispose(model){if(!model)return;const textures=new Set();model.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const x of Object.values(m))if(x?.isTexture)textures.add(x);m.dispose();}});for(const t of textures){t.source?.data?.close?.();t.dispose();}}
function clear(){action=null;playing=false;if(mixer){mixer.stopAllAction();mixer.uncacheRoot(root);}mixer=null;if(root){scene.remove(root);dispose(root);}root=null;el('clips').replaceChildren();for(const id of ['clips','play','frame'])el(id).disabled=true;el('identity').textContent='';el('play').textContent='Play';}
function frame(){if(!root)return;const box=new T.Box3().setFromObject(root),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3()).length();if(!Number.isFinite(size)||size<=0)throw Error('Empty or invalid bounds');const d=size/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))*Math.max(1,1/camera.aspect)*1.2;controls.target.copy(center);camera.position.copy(center).add(new T.Vector3(.7,.35,1).normalize().multiplyScalar(d));camera.near=Math.max(size/1000,.00001);camera.far=d+size*20;camera.updateProjectionMatrix();controls.update();}
function choose(){mixer.stopAllAction();action=mixer.clipAction(root.userData.clips[el('clips').selectedIndex]);action.reset().play();action.paused=!playing;}
async function load(buffer,name){const ticket=++generation;clear();status.textContent='Checking asset…';try{
 const doc=inspectGLB(buffer),digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),x=>x.toString(16).padStart(2,'0')).join('');
 const gltf=await loader.parseAsync(buffer,'');if(ticket!==generation){dispose(gltf.scene);return;}
 root=gltf.scene;root.userData.clips=gltf.animations;scene.add(root);frame();mixer=new T.AnimationMixer(root);playing=false;
 for(const [i,clip] of gltf.animations.entries()){const option=document.createElement('option');option.value=i;option.textContent=`${clip.name||'Clip '+(i+1)} · ${clip.duration.toFixed(2)} s`;el('clips').append(option);}
 el('clips').disabled=el('play').disabled=!gltf.animations.length;el('frame').disabled=false;if(gltf.animations.length)choose();
 el('identity').textContent=`${name} · SHA-256 ${digest} · Local import; provenance and species identity unverified`;
 status.textContent=`Loaded ${doc.meshes?.length||0} mesh(es), ${gltf.animations.length} clip(s). Paused. Noncanonical.`;
 }catch(e){if(ticket!==generation)return;clear();status.textContent='Import blocked: '+e.message;}}
el('file').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>80*1024*1024){++generation;clear();status.textContent='Import blocked: maximum 80 MiB';return;}await load(await file.arrayBuffer(),file.name);e.target.value='';};
el('play').onclick=()=>{if(!action)return;playing=!playing;action.paused=!playing;el('play').textContent=playing?'Pause':'Play';status.textContent=playing?'Playing artistic clip · simulation clock unchanged':'Paused · simulation clock unchanged';};
el('clips').onchange=choose;el('frame').onclick=frame;
new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(root)frame();}).observe(stage);
const clock=new T.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.1);if(playing&&!document.hidden)mixer?.update(dt);controls.update();el('playback').textContent=`Playback ${(action?.time||0).toFixed(2)} s · ${playing?'playing':'paused'}`;renderer.render(scene,camera);});
status.textContent='Ready. Import a self-contained GLB from this device.';
// Narrow read-only diagnostics used by the browser acceptance test.
window.previewState=()=>({loaded:!!root,playing,clip:action?.getClip().name,time:action?.time,meshes:root?new T.Box3().setFromObject(root).isEmpty():true,morph:root?(()=>{let a=[];root.traverse(o=>{if(o.morphTargetInfluences)a.push(...o.morphTargetInfluences);});return a;})():[],bones:root?(()=>{let n=0;root.traverse(o=>{if(o.isBone)n++;});return n;})():0});
