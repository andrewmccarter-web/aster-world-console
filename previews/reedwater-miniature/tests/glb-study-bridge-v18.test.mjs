import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectGLB} from '../glb-study/glb_gate.mjs';

const wrap=doc=>{
  const json=JSON.stringify(doc),n=Math.ceil(json.length/4)*4;
  const b=new ArrayBuffer(20+n),v=new DataView(b);
  v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);
  v.setUint32(8,b.byteLength,true);v.setUint32(12,n,true);
  v.setUint32(16,0x4e4f534a,true);
  new Uint8Array(b,20).fill(32);
  new Uint8Array(b,20,json.length).set(new TextEncoder().encode(json));
  return b;
};
const d={asset:{version:'2.0'}};
assert.deepEqual(inspectGLB(wrap(d)),d);
assert.throws(()=>inspectGLB(new ArrayBuffer(3)),/20 bytes/);
assert.throws(()=>inspectGLB(new ArrayBuffer(81*1024*1024)),/80 MiB/);
for(const key of ['buffers','images']){
  for(const uri of ['https://example.org/file.bin','data:image/png;base64,abc','../other.bin']){
    assert.throws(()=>inspectGLB(wrap({...d,[key]:[{uri}]})),/URI rejected/);
  }
}
assert.throws(()=>inspectGLB(wrap({...d,extensionsRequired:['KHR_draco_mesh_compression']})),/extensions/);
const bad=wrap(d);new DataView(bad).setUint32(8,0,true);
assert.throws(()=>inspectGLB(bad),/header or length/);
const base=new URL('../',import.meta.url);
const html=readFileSync(new URL('glb-study/index.html',base),'utf8');
const viewer=readFileSync(new URL('glb-study/viewer.js',base),'utf8');
const explorer=readFileSync(new URL('v17-2-unified-desktop.html',base),'utf8');
assert.match(html,/type="importmap"/);
assert.match(html,/type="file"/);
assert.match(html,/NONCANONICAL/);
assert.match(html,/third-party CDN/);
assert.doesNotMatch(html,/id="sample"/);
assert.match(viewer,/inspectGLB\(buffer\)/);
assert.match(viewer,/crypto\.subtle\.digest/);
assert.match(viewer,/globalThis\.crypto\?\.subtle\?\.digest/);
assert.match(viewer,/SHA-256 unavailable on this origin/);
assert.match(viewer,/catch\{digest=null;\}/);
assert.doesNotMatch(viewer,/fetch\('\.\/ASTER_standing_loop\.glb'\)/);
assert.match(explorer,/glb-study\/index\.html/);
console.log('PASS: GLB admission gate and read-only viewer/explorer wiring; browser execution not covered');
