// Reusable creative-study assets. No taxon identity, scale or anatomy is asserted.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

function surface(kind) {
  const c=document.createElement('canvas'); c.width=c.height=128;
  const ctx=c.getContext('2d'), data=ctx.createImageData(128,128);
  for(let y=0;y<128;y++) for(let x=0;x<128;x++){
    const grain=(Math.sin(x*91.7+y*43.1)*43758.5)%1;
    const ridge=kind==='tissue'?Math.pow(Math.cos(x*.39+y*.018),12)*35:
      kind==='bark'?Math.sin(x*.7+Math.sin(y*.08))*24:Math.sin(x*.25+y*.7)*12;
    const n=Math.max(0,Math.min(255,140+ridge+grain*25)), i=(y*128+x)*4;
    data.data.set([n,n,n,255],i);
  }
  ctx.putImageData(data,0,0);
  const map=new T.CanvasTexture(c); map.wrapS=map.wrapT=T.RepeatWrapping;
  return map; // Linear data: bump and roughness, never sRGB.
}

export function createMaterialLibrary() {
  const tissue=surface('tissue'),bark=surface('bark'),mineral=surface('mineral');
  const blade=(color)=>new T.MeshPhysicalMaterial({color,roughness:.58,
    bumpMap:tissue,bumpScale:.025,roughnessMap:tissue,side:T.DoubleSide,
    sheen:.35,sheenColor:new T.Color('#b6c1ae'),sheenRoughness:.7,
    clearcoat:.12,clearcoatRoughness:.65});
  return {
    blades:[blade('#6d8e87'),blade('#9b8d79'),blade('#7b8095')],
    stem:new T.MeshStandardMaterial({color:'#5d685a',roughness:.9,bumpMap:bark,bumpScale:.055}),
    stone:new T.MeshStandardMaterial({color:'#737a72',roughness:.91,bumpMap:mineral,bumpScale:.09}),
    timber:new T.MeshStandardMaterial({color:'#75634d',roughness:.88,bumpMap:bark,bumpScale:.045}),
    roof:new T.MeshStandardMaterial({color:'#a08d68',roughness:.96,bumpMap:bark,bumpScale:.035}),
    water:new T.MeshPhysicalMaterial({color:'#355b59',roughness:.19,metalness:0,
      clearcoat:1,clearcoatRoughness:.13,transparent:true,opacity:.88,
      bumpMap:mineral,bumpScale:.018,depthWrite:false,ior:1.333})
  };
}

// A cupped, tapering lamina with a raised midrib, rather than a flattened sphere.
export function bladeGeometry({length=1,width=.25,curl=.25,segments=14}={}) {
  const positions=[],uv=[],indices=[],cross=6;
  for(let i=0;i<=segments;i++){
    const t=i/segments,profile=Math.pow(Math.sin(Math.PI*t),.72);
    for(let j=0;j<=cross;j++){
      const v=j/cross*2-1;
      positions.push(v*width*profile,
        t*length,
        curl*t*t+.10*v*v*profile+.035*Math.cos(v*Math.PI)*profile);
      uv.push(j/cross,t);
      if(i<segments&&j<cross){
        const a=i*(cross+1)+j,b=a+cross+1;
        indices.push(a,b,a+1,b,b+1,a+1);
      }
    }
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  g.setIndex(indices);g.computeVertexNormals();return g;
}

export function createBotanicalLibrary(materials) {
  const blade=bladeGeometry(),pad=bladeGeometry({length:.7,width:.38,curl:.38});
  const stem=new T.CylinderGeometry(.045,.09,1,7);
  const definitions={
    whorl:{label:'Cupped whorl',description:'Curved ribbed laminae with an asymmetric basal whorl.'},
    tiers:{label:'Layered crown',description:'Overlapping cupped pads around a branching support.'},
    fan:{label:'Ribbed fan',description:'A spreading set of raised membranes with varied curvature.'}
  };
  function create(kind,variant=0) {
    const group=new T.Group(),def=definitions[kind];
    group.userData={feature:'flora',label:def.label,description:def.description,status:'PROVISIONAL'};
    const mat=materials.blades[variant%materials.blades.length];
    const count=kind==='tiers'?14:kind==='fan'?9:7;
    if(kind!=='whorl'){
      const trunk=new T.Mesh(stem,materials.stem);trunk.position.y=.5;group.add(trunk);
    }
    for(let i=0;i<count;i++){
      const leaf=new T.Mesh(kind==='tiers'?pad:blade,mat);
      const angle=i*2.39996+variant*.3;
      leaf.rotation.set(kind==='fan'?.35: .65+(i%3)*.15,angle,(i%2-.5)*.16);
      leaf.position.y=kind==='tiers'?.25+(i%4)*.23:kind==='fan'?.7:0;
      if(kind==='fan')leaf.rotation.y=(i/(count-1)-.5)*2.8;
      leaf.scale.setScalar(.75+(i%4)*.12);
      group.add(leaf);
    }
    group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData=group.userData;}});
    return group;
  }
  return {create,definitions};
}
