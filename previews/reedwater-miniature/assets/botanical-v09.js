// Creative specimen studies, not species anatomy or ecological evidence.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import {bladeGeometry} from './botanical-assets.js';
export {createMaterialLibrary} from './botanical-assets.js';

export function createBotanicalLibrary(materials) {
  const definitions={
    whorl:{label:'Cupped whorl',description:'Asymmetric basal whorl with cupped, ribbed laminae and a thickened attachment hub.'},
    tiers:{label:'Layered crown',description:'Overlapping pads carried on curved lateral supports around a central column.'},
    fan:{label:'Ribbed fan',description:'Spreading laminae supported by a branching, curved scaffold.'}
  };
  const blade=bladeGeometry({segments:22}),pad=bladeGeometry({length:.7,width:.38,curl:.38,segments:22});
  const hub=new T.SphereGeometry(.12,12,8);
  const stem=new T.CylinderGeometry(.045,.09,1,10);
  const parts=new Map();
  function support(start,end) {
    const mid=start.clone().lerp(end,.5);mid.z-=.035;mid.y+=.035;
    return new T.TubeGeometry(new T.CatmullRomCurve3([start,mid,end]),8,.018,5,false);
  }
  function template(kind,stage,variant){
    const group=new T.Group(),juvenile=stage==='juvenile';
    const count=juvenile?(kind==='tiers'?5:4):(kind==='tiers'?14:kind==='fan'?9:7);
    const mat=materials.blades[variant%3];
    if(kind!=='whorl'){
      const trunk=new T.Mesh(stem,materials.stem);trunk.position.y=.5;group.add(trunk);
    }else{
      const base=new T.Mesh(hub,materials.stem);base.scale.set(1.4,.6,1.4);group.add(base);
    }
    for(let i=0;i<count;i++){
      const angle=i*2.39996+variant*.3;
      const leaf=new T.Mesh(kind==='tiers'?pad:blade,mat);
      leaf.rotation.set(kind==='fan'?.35:.65+(i%3)*.15,angle,(i%2-.5)*.16);
      if(juvenile)leaf.rotation.x*=.45;
      leaf.position.y=kind==='tiers'?.25+(i%4)*.23:kind==='fan'?.7:0;
      if(kind==='fan')leaf.rotation.y=(i/(count-1)-.5)*2.8;
      if(kind!=='whorl'){
        const reach=kind==='fan'?.16:.12;
        leaf.position.x=Math.sin(leaf.rotation.y)*reach;
        leaf.position.z=Math.cos(leaf.rotation.y)*reach;
        const link=new T.Mesh(support(new T.Vector3(0,leaf.position.y-.12,0),leaf.position),materials.stem);
        group.add(link);
      }
      leaf.scale.setScalar((.75+(i%4)*.12)*(juvenile?.72:1));group.add(leaf);
    }
    if(juvenile)group.scale.setScalar(.72);
    return group;
  }
  function create(kind,variant=0,stage='adult'){
    if(!definitions[kind]||!['adult','juvenile'].includes(stage))throw Error('Unknown botanical study');
    variant=((variant%3)+3)%3;
    const key=kind+':'+stage+':'+variant;
    if(!parts.has(key))parts.set(key,template(kind,stage,variant));
    const group=parts.get(key).clone(true);
    group.userData={feature:'flora',kind,variant,stage,label:definitions[kind].label,
      description:definitions[kind].description,status:'PROVISIONAL'};
    group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData=group.userData;}});
    return group;
  }
  return {create,definitions};
}
