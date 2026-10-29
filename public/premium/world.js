import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
export class Sanctuary{
 constructor(canvas,sites,getMode){
  this.canvas=canvas;this.sites=sites;this.getMode=getMode;this.reduced=false;this.paused=false;this.time=0;this.last=0;this.transition=null;this.quality='high';
  this.scene=new T.Scene();this.scene.background=new T.Color('#386e77');this.scene.fog=new T.FogExp2('#487d83',.004);
  this.camera=new T.PerspectiveCamera(34,1,.1,300);this.camera.position.set(34,31,46);
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
  this.controls=new OrbitControls(this.camera,canvas);this.controls.target.set(0,2,0);this.controls.enableDamping=true;this.controls.dampingFactor=.07;this.controls.minDistance=8;this.controls.maxDistance=85;this.controls.minPolarAngle=.3;this.controls.maxPolarAngle=1.35;this.controls.enablePan=false;this.controls.addEventListener('start',()=>this.transition=null);
  this.hemi=new T.HemisphereLight('#c9e7ef','#676044',1.05);this.scene.add(this.hemi);this.sun=new T.DirectionalLight('#ffe2a5',3.2);this.sun.position.set(-20,35,15);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:100});this.sun.shadow.bias=-.0003;this.sun.shadow.normalBias=.045;this.scene.add(this.sun);
  this.scene.add(new T.AmbientLight('#a6cbd8',.15));this.makeEnvironment();
  const waterGeometry=new T.PlaneGeometry(240,240,160,160);waterGeometry.rotateX(-Math.PI/2);
  const waterMaterial=new T.MeshStandardMaterial({color:'#1b7482',metalness:.12,roughness:.22});this.uniforms={uTime:{value:0}};
  waterMaterial.onBeforeCompile=shader=>{shader.uniforms.uTime=this.uniforms.uTime;shader.vertexShader='uniform float uTime; varying vec3 vSea;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   float wave=sin(position.x*.6+uTime*.6)*.055+cos(position.z*.83+uTime*.44)*.04;
   transformed.y+=wave; vSea=position;
  `).replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
   objectNormal=normalize(vec3(-.033*cos(position.x*.6+uTime*.6),1.,.0332*sin(position.z*.83+uTime*.44)));
  `);shader.fragmentShader='uniform float uTime; varying vec3 vSea;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float swell=sin(vSea.x*.52+vSea.z*.7+uTime*.6)*sin(vSea.z*.71-uTime*.35);
   float coast=exp(-pow((length(vSea.xz/vec2(18.,13.))-1.06)*12.,2.));
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.24,.62,.59),coast*.35);
   float caustic=pow(max(0.,sin(vSea.x*1.8+sin(vSea.z*1.1+uTime*.2))*cos(vSea.z*1.9+sin(vSea.x+uTime*.25))),8.);
   diffuseColor.rgb+=swell*.015+coast*caustic*.12;
  `);};
  this.water=new T.Mesh(waterGeometry,waterMaterial);this.water.position.y=-.43;this.water.receiveShadow=true;this.scene.add(this.water);this.makeStoryDetails();
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);this.resize();
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;document.body.dataset.render='fallback';document.getElementById('markers').hidden=true;document.getElementById('scene-status').textContent='Vista ilustrada · se perdió el contexto 3D';});canvas.addEventListener('webglcontextrestored',()=>location.reload());
  this.home();
 }
 async load(){
  const gltf=await new GLTFLoader().loadAsync('premium/assets/sanctuary.glb?v=premium3');gltf.scene.updateMatrixWorld(true);const buckets=new Map();let sourceMeshes=0;
  gltf.scene.traverse(o=>{if(!o.isMesh)return;sourceMeshes++;const m=o.material;if(m.name==='Agua turquesa')return;let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrixWorld);for(const name of Object.keys(g.attributes))if(!['position','normal'].includes(name))g.deleteAttribute(name);if(!g.attributes.normal)g.computeVertexNormals();const key=m.uuid;if(!buckets.has(key))buckets.set(key,{material:m,geometries:[]});buckets.get(key).geometries.push(g);});
  for(const {material,geometries} of buckets.values()){material.side=T.DoubleSide;this.refineMaterial(material);const geometry=mergeGeometries(geometries);if(!geometry)throw Error('No se pudo preparar una malla');const o=new T.Mesh(geometry,material);o.castShadow=true;o.receiveShadow=true;this.scene.add(o);geometries.forEach(g=>g.dispose());}
  this.meshCount=sourceMeshes;this.makeBirds();this.ready=true;this.renderer.setAnimationLoop(t=>this.frame(t));
 }
 makeEnvironment(){
  const sky=new T.Scene(),geo=new T.SphereGeometry(80,32,16),colors=[];const p=geo.attributes.position;
  const horizon=new T.Color('#b9d8d5'),zenith=new T.Color('#417f9d');
  for(let i=0;i<p.count;i++){const c=horizon.clone().lerp(zenith,Math.max(0,p.getY(i)/80));colors.push(c.r,c.g,c.b);}
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));const mat=new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide});sky.add(new T.Mesh(geo,mat));
  const pm=new T.PMREMGenerator(this.renderer);this.environment=pm.fromScene(sky,.02,.1,150);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.45;pm.dispose();geo.dispose();mat.dispose();
 }
 makeStoryDetails(){
  const bronze=new T.MeshStandardMaterial({color:'#9a6831',metalness:.55,roughness:.42}),reed=new T.MeshStandardMaterial({color:'#8b6338',roughness:.96}),olive=new T.MeshStandardMaterial({color:'#657740',roughness:.8}),ember=new T.MeshStandardMaterial({color:'#ffb14f',emissive:'#ff7417',emissiveIntensity:2,roughness:.7});
  const add=(geometry,material,position,rotation=[0,0,0],scale=[1,1,1])=>{const o=new T.Mesh(geometry,material);o.position.set(...position);o.rotation.set(...rotation);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;this.scene.add(o);return o;};
  // Outdoor ritual: glowing brazier and animated incense smoke.
  add(new T.CylinderGeometry(.42,.58,.52,20),bronze,[0,3.25,7.7]);
  add(new T.SphereGeometry(.2,16,10),ember,[0,3.62,7.7],[0,0,0],[1.35,.55,1.35]);
  const smokePositions=new Float32Array(24);this.smokeSeed=[];
  for(let i=0;i<8;i++){this.smokeSeed.push({phase:i*.83,height:i*.42});smokePositions.set([0,3.85+i*.42,7.7],i*3);}
  this.smokeGeometry=new T.BufferGeometry();this.smokeGeometry.setAttribute('position',new T.BufferAttribute(smokePositions,3));
  this.smoke=new T.Points(this.smokeGeometry,new T.PointsMaterial({color:'#d9d1bd',size:.42,transparent:true,opacity:.32,depthWrite:false,sizeAttenuation:true}));this.scene.add(this.smoke);
  // Olive harvest: woven baskets and visible fruit clusters.
  for(const p of [[-11,2.05,-2],[-8.6,2.05,-4.2]]){add(new T.CylinderGeometry(.62,.48,.62,18,1,true),reed,p);add(new T.TorusGeometry(.55,.055,8,24),reed,[p[0],p[1]+.31,p[2]],[Math.PI/2,0,0]);}
  const fruitGeometry=new T.SphereGeometry(.12,8,6),fruit=new T.InstancedMesh(fruitGeometry,olive,30),dummy=new T.Object3D();
  for(let i=0;i<30;i++){const basket=i<15?[-11,2.42,-2]:[-8.6,2.42,-4.2],j=i%15,a=j*2.399;dummy.position.set(basket[0]+Math.cos(a)*Math.sqrt(j)*.105,basket[1]+(j%3)*.08,basket[2]+Math.sin(a)*Math.sqrt(j)*.105);dummy.scale.set(1,.82,1);dummy.updateMatrix();fruit.setMatrixAt(i,dummy.matrix);}fruit.castShadow=true;this.scene.add(fruit);
  // Harbour work: rope coils, cargo blocks and bronze mooring ring.
  for(const p of [[14.1,1.18,7.2],[15.5,1.18,8.1]])add(new T.TorusGeometry(.48,.075,10,32),reed,p,[Math.PI/2,0,0]);
  for(const p of [[13.5,1.35,9.2],[14.6,1.35,9.5],[15.7,1.35,9.2]])add(new T.BoxGeometry(1,.7,.85),reed,p,[0,.12*(p[0]-14.6),0]);
  add(new T.TorusGeometry(.28,.07,10,24),bronze,[12.8,1.45,7.8],[0,Math.PI/2,0]);
 }
 refineMaterial(material){
  const name=material.name;material.envMapIntensity=.45;
  if(!/Mármol|Caliza|Terracota|Estratos|Madera|Tierra/.test(name))return;
  const wood=name.includes('Madera'),stone=/Mármol|Caliza/.test(name),clay=name.includes('Terracota');
  material.roughness=wood?.83:stone?.68:.88;
  material.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 vSurface;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface=position;');
   shader.fragmentShader='varying vec3 vSurface;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    float broad=sin(vSurface.x*.8+sin(vSurface.z*.6))*sin(vSurface.y*1.7+vSurface.z*.7);
    float grain=sin(vSurface.x*18.+sin(vSurface.z*8.))*sin(vSurface.y*16.+vSurface.z*22.);
    diffuseColor.rgb*=1.+broad*${stone?'.045':'.10'}+grain*.025;
    ${wood?'diffuseColor.rgb*=.92+.08*sin(vSurface.z*23.+sin(vSurface.x*.5));':''}
    ${clay?'diffuseColor.rgb*=.94+.06*sin(vSurface.x*2.4+vSurface.z*.3);':''}
   `);
  };material.customProgramCacheKey=()=>name+'-premium2';
 }
 setLight(preset){
  const options={dawn:{color:'#ffe1b5',power:3.7,pos:[-28,24,18],sky:'#40727d',water:'#216d79',fill:1.05},day:{color:'#fff2d5',power:4,pos:[-8,42,-10],sky:'#47858e',water:'#207f89',fill:1.25},dusk:{color:'#ffc18f',power:3.2,pos:[-30,15,-12],sky:'#455b71',water:'#345969',fill:.82}};
  const p=options[preset]||options.dawn;this.sun.color.set(p.color);this.sun.intensity=p.power;this.sun.position.set(...p.pos);this.hemi.intensity=p.fill;this.scene.background.set(p.sky);this.scene.fog.color.set(p.sky);this.water.material.color.set(p.water);this.renderer.toneMappingExposure=preset==='dusk'?1.12:1.05;this.canvas.dataset.light=preset;
 }
 makeBirds(){
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([0,0,0,-.7,.13,-.2,-.15,0,.12,0,0,0,.15,0,.12,.7,.13,-.2],3));g.computeVertexNormals();
  this.birds=new T.InstancedMesh(g,new T.MeshStandardMaterial({color:'#dbd8be',side:T.DoubleSide,roughness:1}),6);this.birdDummy=new T.Object3D();this.scene.add(this.birds);this.updateBirds();
 }
 updateBirds(){if(!this.birds)return;for(let i=0;i<6;i++){const a=this.time*.07+i*.22,d=this.birdDummy;d.position.set(Math.cos(a)*(26+i*.45),14+i*.4+Math.sin(a*2)*.6,Math.sin(a)*20-8);d.rotation.set(.05,-a+Math.PI/2,Math.sin(a)*.1);d.updateMatrix();this.birds.setMatrixAt(i,d.matrix);}this.birds.instanceMatrix.needsUpdate=true;}
 dispose(){this.renderer.setAnimationLoop(null);this.observer?.disconnect();this.controls.dispose();this.scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});this.environment?.dispose();this.renderer.dispose();}
 resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 setReduced(v){this.reduced=v;if(this.controls)this.controls.enableDamping=!v;}
 setQuality(q){this.quality=q;this.renderer.setPixelRatio(q==='low'?1:Math.min(devicePixelRatio,1.5));this.renderer.shadowMap.enabled=q!=='low';this.scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});this.resize();}
 pause(v){this.paused=v;}
 move(position,target){this.transition={position:new T.Vector3(...position),target:new T.Vector3(...target)};if(this.reduced){this.camera.position.copy(this.transition.position);this.controls.target.copy(this.transition.target);this.transition=null;this.controls.update();}}
 home(){this.move([34,31,46],[-7,2,4]);}
 overview(){this.move([32,32,45],[0,2,0]);}
 focus(view){this.move(view.position,view.target);}
 zoom(factor){this.transition=null;const v=this.camera.position.clone().sub(this.controls.target);v.setLength(T.MathUtils.clamp(v.length()/factor,17,85));this.camera.position.copy(this.controls.target).add(v);this.controls.update();}
 frame(t){if(document.hidden||this.paused||this.lost){this.last=t;return;}if(this.quality==='low'&&t-(this.last||0)<32)return;const dt=Math.min((t-this.last)/1000,.05);this.last=t;
  if(!this.reduced)this.time+=dt;this.uniforms.uTime.value=this.time;
  if(this.transition){const k=1-Math.exp(-dt*4);this.camera.position.lerp(this.transition.position,k);this.controls.target.lerp(this.transition.target,k);if(this.camera.position.distanceTo(this.transition.position)<.015)this.transition=null;}
  if(this.smoke&&!this.reduced){const a=this.smokeGeometry.attributes.position;for(let i=0;i<this.smokeSeed.length;i++){const s=this.smokeSeed[i],rise=(this.time*.32+s.height)%3.4;a.setXYZ(i,Math.sin(this.time*.8+s.phase)*.2,3.85+rise,7.7+Math.cos(this.time*.55+s.phase)*.15);}a.needsUpdate=true;}
  this.updateBirds();this.controls.update();this.renderer.render(this.scene,this.camera);
  if(this.getMode()==='explorar'){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;this.sites.forEach(s=>{const p=new T.Vector3(...s.point).project(this.camera);const el=document.querySelector(`[data-marker="${s.id}"]`);el.style.left=(p.x*.5+.5)*w+'px';el.style.top=(-p.y*.5+.5)*h+'px';el.style.visibility=p.z>1||p.z< -1||Math.abs(p.x)>.96||Math.abs(p.y)>.86?'hidden':'visible';});}
  this.samples=(this.samples||0)+1;if(this.samples%60===0){this.canvas.dataset.triangles=this.renderer.info.render.triangles;this.canvas.dataset.drawCalls=this.renderer.info.render.calls;this.canvas.dataset.sourceMeshes=this.meshCount;}
 }
}

