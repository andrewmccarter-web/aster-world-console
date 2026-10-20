// Static creative morphology. Only blade-to-blade clearance is certified.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import {thickBladeGeometry} from './botanical-v10.js';
import {bladeConflicts} from './blade-clearance-v11.js';
export {createMaterialLibrary} from './botanical-v10.js';

export function createBotanicalLibrary(materials){
  const definitions={
    whorl:{label:'Cupped whorl',description:'Separated radial laminae on distinct basal attachments.'},
    tiers:{label:'Layered crown',description:'Staggered tiers of outward-facing pads with explicit blade clearance.'},
    fan:{label:'Ribbed fan',description:'An open fan of individually spaced laminae on curved supports.'}
  };
  const templates=new Map(),geometry=new Map();
  const joint=new T.SphereGeometry(.105,12,8);
  function leafGeometry(kind,seed){
    const key=kind+':'+seed;
    if(!geometry.has(key))geometry.set(key,thickBladeGeometry(kind==='tiers'?
      {length:.65,width:.25,curl:.28,seed}:kind==='fan'?
      {length:.85,width:.135,curl:.12,seed}:{length:.9,width:.20,curl:.20,seed}));
    return geometry.get(key);
  }
  function build(kind,variant,stage){
    const young=stage==='juvenile',count=young?(kind==='tiers'?5:4):(kind==='tiers'?14:kind==='fan'?9:7);
    const group=new T.Group(),blades=[];
    const height=kind==='tiers'?(young?.48:1.7):kind==='fan'?.55:.07;
    const metadata={feature:'flora',kind,variant,stage,label:definitions[kind].label,
      description:definitions[kind].description,status:'PROVISIONAL'};
    const bladeData={...metadata,part:'blade'};
    for(let i=0;i<count;i++){
      const leaf=new T.Mesh(leafGeometry(kind,(i%3)+variant*.3),materials.blades[variant]);
      leaf.userData=bladeData;
      leaf.scale.setScalar((.82+(i%3)*.07)*(young?.72:1));
      group.add(leaf);blades.push(leaf);
    }
    let solved=false,spread=0;
    // Expand attachment radii until every conservative blade box separates.
    for(let attempt=0;attempt<40;attempt++){
      spread=.22+attempt*.045;
      blades.forEach((leaf,i)=>{
        if(kind==='fan'){
          const angle=(i/(count-1)-.5)*(young?1.8:2.45);
          leaf.rotation.set(0,0,-angle);
          leaf.position.set(Math.sin(angle)*spread,height+Math.cos(angle)*spread,0);
        }else{
          const tier=kind==='tiers'?Math.floor(i/5):0;
          const ringCount=kind==='tiers'?Math.min(5,count-tier*5):count;
          const angle=(i%5)/ringCount*Math.PI*2+(tier%2)*.6+variant*.08;
          const radialAngle=kind==='whorl'?i/count*Math.PI*2+variant*.08:angle;
          leaf.rotation.set(kind==='whorl'?1.08:1.12,radialAngle,0,'YXZ');
          leaf.position.set(Math.sin(radialAngle)*spread,kind==='tiers'?.15+tier*.60:.07,Math.cos(radialAngle)*spread);
        }
      });
      if(bladeConflicts(group,.025).length===0){solved=true;break;}
    }
    if(!solved)throw Error('No certified blade layout for '+kind+'/'+stage+'/'+variant);
    const hub=new T.Mesh(joint,materials.stem);hub.position.y=kind==='whorl'?.07:.15;
    group.add(hub);
    if(kind!=='whorl'){
      const trunk=new T.Mesh(new T.CylinderGeometry(.045,.075,height,9),materials.stem);
      trunk.position.y=height*.5;group.add(trunk);
    }
    blades.forEach(leaf=>{
      const end=leaf.position.clone();
      const start=new T.Vector3(0,kind==='whorl'?.07:Math.max(.1,end.y-.18),0);
      if(kind==='fan')start.y=.5;
      const mid=start.clone().lerp(end,.55);mid.y-=.025;
      const support=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([start,mid,end]),10,.018,6,false),materials.stem);
      group.add(support);
    });
    if(young)group.scale.setScalar(.70);
    group.userData={...metadata,clearance:{method:'conservative OBB SAT',gap:.025,spread,bladePairs:count*(count-1)/2}};
    group.traverse(o=>{
      if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;
      if(o.userData.part!=='blade')o.userData={...metadata,part:'support'};
    });
    // Test again after developmental scaling; keep the same relative margin.
    if(bladeConflicts(group,.025*(young?.70:1)).length)throw Error('Post-scale clearance failed');
    return group;
  }
  function create(kind,variant=0,stage='adult'){
    if(!definitions[kind]||!['adult','juvenile'].includes(stage))throw Error('Unknown botanical study');
    variant=((variant%3)+3)%3;const key=kind+':'+variant+':'+stage;
    if(!templates.has(key))templates.set(key,build(kind,variant,stage));
    return templates.get(key).clone(true);
  }
  return {create,definitions};
}
