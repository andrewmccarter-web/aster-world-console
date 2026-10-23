// Bounded self-contained GLB admission; never resolve external asset resources.
export function inspectGLB(buffer) {
 if(buffer.byteLength<20 || buffer.byteLength>80*1024*1024) throw Error('GLB must be between 20 bytes and 80 MiB');
 const v=new DataView(buffer);
 if(v.getUint32(0,true)!==0x46546c67 || v.getUint32(4,true)!==2 || v.getUint32(8,true)!==buffer.byteLength) throw Error('Invalid GLB v2 header or length');
 const n=v.getUint32(12,true);
 if(n%4 || n+20>buffer.byteLength || v.getUint32(16,true)!==0x4e4f534a) throw Error('Invalid GLB JSON chunk');
 const doc=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,n)));
 if(doc.asset?.version!=='2.0') throw Error('Expected glTF 2.0');
 for(const row of [...(doc.buffers||[]),...(doc.images||[])]) if(row.uri!==undefined) throw Error('External/data resource URI rejected; embed resources in GLB');
 if((doc.extensionsRequired||[]).length) throw Error('Required extensions are outside this prototype');
 return doc;
}
