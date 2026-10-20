// PROVISIONAL creative surfaces. No anatomy, optical measurement or taxon claim.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import {createBotanicalLibrary as previousLibrary,createMaterialLibrary as previousMaterials} from './botanical-v09.js';

export function thickBladeGeometry({length=1,width=.25,curl=.25,seed=0,segments=28,cross=14}={}){
  const positions=[],uv=[],indices=[],stride=cross+1,count=(segments+1)*stride;
  for(const side of [1,-1])for(let i=0;i<=segments;i++){
    const t=i/segments,profile=.015+Math.pow(Math.sin(Math.PI*t),.72);
    for(let j=0;j<=cross;j++){
      const u=j/cross*2-1,edge=Math.pow(Math.abs(u),3);
      const x=u*width*profile*(1+.035*Math.sin(t*11+seed));
      const cup=.10*u*u*profile,midrib=.04*Math.exp(-u*u*35)*profile;
      const ribs=.009*Math.cos(u*Math.PI*8+t*1.4)*profile;
      const ripple=.018*Math.sin(t*18+seed)*edge*profile;
      const thickness=.006+.007*(1-Math.abs(u))*profile;
      positions.push(x,t*length,curl*t*t+cup+midrib+ribs+ripple+side*thickness);
      uv.push(j/cross,t);
    }
  }
  for(let i=0;i<segments;i++)for(let j=0;j<cross;j++){
    const a=i*stride+j,b=a+stride;
    indices.push(a,a+1,b,a+1,b+1,b);
    indices.push(a+count,b+count,a+1+count,a+1+count,b+count,b+1+count);
  }
  const rim=[];
  for(let j=0;j<=cross;j++)rim.push(j);
  for(let i=1;i<=segments;i++)rim.push(i*stride+cross);
  for(let j=cross-1;j>=0;j--)rim.push(segments*stride+j);
  for(let i=segments-1;i>0;i--)rim.push(i*stride);
  for(let k=0;k<rim.length;k++){
    const a=rim[k],b=rim[(k+1)%rim.length];indices.push(a,a+count,b,b,a+count,b+count);
  }
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
  g.userData={surface:'closed ribbed lamina',provisional:true};return g;
}

function texture(kind){
  const c=document.createElement('canvas');c.width=c.height=256;
  const ctx=c.getContext('2d'),data=ctx.createImageData(256,256);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const u=x/255,t=y/255,edge=Math.pow(Math.abs(u*2-1),8);
    const rib=Math.pow(Math.max(0,Math.cos((u*2-1)*Math.PI*8+t*1.4)),12);
    const grain=(Math.sin(x*19.13+y*67.21)*43758.54)%1;
    const central=Math.exp(-Math.pow((u-.5)*32,2));
    let value=kind==='color'?170+50*edge+26*rib+18*central+grain*6:
      kind==='relief'?95+65*rib+65*central+grain*12:175+35*edge-35*rib+grain*18;
    value=Math.max(0,Math.min(255,value));const i=(y*256+x)*4;
    data.data.set([value,value,value,255],i);
  }
  ctx.putImageData(data,0,0);const tex=new T.CanvasTexture(c);
  if(kind==='color')tex.colorSpace=T.SRGBColorSpace;
  tex.anisotropy=4;return tex;
}

export function createMaterialLibrary(){
  const materials=previousMaterials(),oldTissue=materials.blades[0].bumpMap;
  const color=texture('color'),relief=texture('relief'),roughness=texture('roughness');
  materials.blades.forEach((m,i)=>{
    m.color.set(['#769f91','#b39b75','#8891b6'][i]);m.map=color;
    m.bumpMap=relief;m.bumpScale=.025;m.roughnessMap=roughness;m.roughness=.87;
    m.clearcoat=.08;m.envMapIntensity=.55;m.sheen=.28;m.needsUpdate=true;
  });
  oldTissue.dispose();return materials;
}

export function createBotanicalLibrary(materials){
  const base=previousLibrary(materials),geometries=new Map();
  function create(kind,variant=0,stage='adult'){
    const group=base.create(kind,variant,stage);let leafIndex=0;
    group.traverse(o=>{
      // Original lamina is a plain BufferGeometry; supports keep their tube geometry.
      if(!o.isMesh||o.geometry.type!=='BufferGeometry')return;
      const seed=(leafIndex++%3)+group.userData.variant*.3,key=kind+':'+seed;
      if(!geometries.has(key))geometries.set(key,thickBladeGeometry(kind==='tiers'?
        {length:.7,width:.38,curl:.38,seed}:{seed}));
      o.geometry=geometries.get(key);
    });
    return group;
  }
  return {create,definitions:base.definitions};
}
