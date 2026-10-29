import {readdir,readFile,stat} from 'node:fs/promises';import {resolve,join,dirname,extname} from 'node:path';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../public');
async function walk(dir){return(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]))).flat();}
const files=await walk(root),errors=[];let links=0,bytes=0;
async function localRef(file,ref){if(!ref||/^(https?:|data:|blob:|#|mailto:)/.test(ref))return;const target=resolve(dirname(file),ref.split(/[?#]/)[0]||'.');if(!target.startsWith(root))return errors.push('Outside root: '+ref);try{await stat(target);links++;}catch{errors.push(file.slice(root.length+1)+' -> '+ref);}}
for(const file of files){const rel=file.slice(root.length+1).replaceAll('\\','/'),size=(await stat(file)).size;bytes+=size;
 assert.ok(!/^(data|runtime|launcher|art-source|pilot)\//.test(rel),'Private directory: '+rel);assert.ok(!/\.(exe|bat|ps1|blend|env)$/.test(file),'Nonweb file: '+rel);assert.ok(size<100*1024*1024,'Oversize GitHub file: '+rel);
 if(['.html','.css','.js'].includes(extname(file))){const text=await readFile(file,'utf8');
  if(extname(file)==='.html')for(const m of text.matchAll(/(?:src|href)="([^"]+)"/g))await localRef(file,m[1]);
  if(extname(file)==='.css')for(const m of text.matchAll(/url\(['"]?([^)'"\s]+)|@import\s+['"]([^'"]+)/g))await localRef(file,m[1]||m[2]);
  if(extname(file)==='.js'){for(const m of text.matchAll(/(?:from\s*|import\s*\()['"](\.[^'"]+)['"]/g))await localRef(file,m[1]);const check=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(check.status!==0)errors.push(check.stderr);}
 }
}
for(const name of ['zeus','poseidon','hera','hades','hestia','persefone','hefesto','atenea','artemisa','apolo','afrodita','ares','demeter','dioniso','hermes']){
 const glb=await readFile(join(root,'premium/assets/gods/'+name+'.glb'));assert.equal(glb.toString('utf8',0,4),'glTF');assert.equal(glb.readUInt32LE(8),glb.length);await stat(join(root,'premium/assets/gods/'+name+'.webp'));
}
assert.equal(await readFile(join(root,'index.html'),'utf8'),await readFile(join(root,'premium-entry.html'),'utf8'));
assert.deepEqual(errors,[]);console.log(JSON.stringify({files:files.length,bytes,localLinks:links,sculptures:15,errors},null,2));
