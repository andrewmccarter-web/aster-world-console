import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

// A separating-axis test on conservative oriented bounding boxes.
// Disjoint boxes certify disjoint contained blades. Overlap is not proof of
// intersecting triangles, so placement rejects it conservatively.
export function bladeBox(mesh){
  mesh.geometry.computeBoundingBox();
  const local=mesh.geometry.boundingBox,center=local.getCenter(new T.Vector3()).applyMatrix4(mesh.matrixWorld);
  const half=local.getSize(new T.Vector3()).multiplyScalar(.5);
  const axes=[0,1,2].map(i=>new T.Vector3().setFromMatrixColumn(mesh.matrixWorld,i));
  axes.forEach((a,i)=>{half.setComponent(i,half.getComponent(i)*a.length());a.normalize();});
  return {center,half,axes};
}
export function boxesOverlap(a,b,gap=.025){
  const delta=b.center.clone().sub(a.center);
  const axes=[...a.axes,...b.axes];
  for(const x of a.axes)for(const y of b.axes)axes.push(new T.Vector3().crossVectors(x,y));
  for(const axis of axes){
    if(axis.lengthSq()<1e-12)continue;axis.normalize();
    const radius=box=>box.axes.reduce((sum,x,i)=>sum+Math.abs(x.dot(axis))*box.half.getComponent(i),0);
    if(Math.abs(delta.dot(axis))>radius(a)+radius(b)+gap)return false;
  }
  return true;
}
export function bladeConflicts(group,gap=.025){
  group.updateMatrixWorld(true);
  const blades=[];group.traverse(o=>{if(o.isMesh&&o.userData.part==='blade')blades.push(o);});
  const boxes=blades.map(bladeBox),conflicts=[];
  for(let i=0;i<blades.length;i++)for(let j=i+1;j<blades.length;j++)
    if(boxesOverlap(boxes[i],boxes[j],gap))conflicts.push([i,j]);
  return conflicts;
}
