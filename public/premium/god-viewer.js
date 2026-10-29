import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';

// The island is paused by the parent dialog. This separate renderer draws only
// while a control moves, a model loads, or the user enables rotation.
export class GodViewer {
 constructor(canvas,{low=false,reduced=false,onError=()=>{}}={}) {
  this.canvas=canvas;this.onError=onError;this.reduced=reduced;this.sequence=0;this.dirty=true;
  this.scene=new T.Scene();this.scene.background=new T.Color('#102c32');
  this.renderer=new T.WebGLRenderer({canvas,antialias:!low,alpha:false,powerPreference:'low-power'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.7));
  this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
  this.renderer.shadowMap.enabled=!low;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  this.camera=new T.PerspectiveCamera(30,1,.01,40);this.camera.position.set(.8,1.5,4.9);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.target.set(0,1.15,0);
  this.controls.enableDamping=false;this.controls.enablePan=false;this.controls.minDistance=1.7;this.controls.maxDistance=7;
  this.controls.minPolarAngle=.4;this.controls.maxPolarAngle=1.8;
  this.controls.addEventListener('change',()=>{this.dirty=true;});
  this.scene.add(new T.HemisphereLight('#e5eff3','#344444',1.6));
  this.key=new T.DirectionalLight('#ffe5bc',3.2);this.key.position.set(-3,5,4);this.key.castShadow=!low;
  this.key.shadow.mapSize.set(1024,1024);Object.assign(this.key.shadow.camera,{left:-2,right:2,top:3,bottom:-2,near:.1,far:15});this.key.shadow.normalBias=.012;this.key.shadow.bias=-.0001;this.scene.add(this.key);
  this.fill=new T.DirectionalLight('#9ccedc',1.5);this.fill.position.set(4,2,1);this.scene.add(this.fill);
  this.rim=new T.DirectionalLight('#ffd494',3);this.rim.position.set(0,4,-3);this.scene.add(this.rim);this.makeEnvironment();
  const floor=new T.Mesh(new T.PlaneGeometry(50,50),new T.ShadowMaterial({color:'#000b12',opacity:.25}));floor.rotation.x=-Math.PI/2;floor.position.y=-.012;floor.receiveShadow=true;this.scene.add(floor);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
  this.lostHandler=e=>{e.preventDefault();this.stop();this.onError('Se perdió la conexión con la tarjeta gráfica. Cierra la galería y vuelve a abrirla para intentarlo de nuevo.');};
  canvas.addEventListener('webglcontextlost',this.lostHandler);
  this.visibility=()=>{this.dirty=true;};document.addEventListener('visibilitychange',this.visibility);
  this.resize();this.renderer.setAnimationLoop(t=>this.frame(t));
 }
 resize(){const box=this.canvas.parentElement.getBoundingClientRect();if(!box.width||!box.height)return;this.renderer.setSize(box.width,box.height,false);this.camera.aspect=box.width/box.height;this.camera.updateProjectionMatrix();this.dirty=true;}
 async load(id){
  const seq=++this.sequence;this.abort?.abort();this.abort=new AbortController();this.clearModel();
  const response=await fetch(`premium/assets/gods/${id}.glb?v=refined7`,{signal:this.abort.signal});
  if(!response.ok)throw Error('No se pudo cargar la escultura.');
  const bytes=await response.arrayBuffer();if(seq!==this.sequence)return false;
  const gltf=await new GLTFLoader().parseAsync(bytes,'');
  if(seq!==this.sequence||this.disposed){this.release(gltf.scene);return false;}
  this.model=gltf.scene;const refined=new Set();this.model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(!refined.has(m)){refined.add(m);this.refineMaterial(m);}}});
  this.renderer.toneMappingExposure=id==='zeus'?.78:1.1;
  this.scene.add(this.model);this.bounds=new T.Box3().setFromObject(this.model);this.reset();this.dirty=true;this.canvas.dataset.god=id;this.canvas.dataset.state='ready';return true;
 }
 release(object){const geometries=new Set(),materials=new Set();object.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();});}
 clearModel(){if(this.model){this.scene.remove(this.model);this.release(this.model);this.model=null;}delete this.canvas.dataset.god;this.canvas.dataset.state='loading';this.dirty=true;}
 makeEnvironment(){
  const studio=new T.Scene();studio.background=new T.Color('#263d43');
  const add=(x,y,z,w,h,color)=>{const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide,toneMapped:false}));panel.position.set(x,y,z);panel.lookAt(0,1,0);studio.add(panel);};
  add(-3,4,3,3,5,'#fff0cf');add(4,2,1,2,5,'#b7dce5');add(0,4,-4,4,3,'#d0c8b9');
  const generator=new T.PMREMGenerator(this.renderer);this.environment=generator.fromScene(studio,.025,.1,30);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.45;generator.dispose();this.release(studio);
 }
 refineMaterial(material){
  if(!material.name.includes('Mármol'))return;
  material.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 vStonePosition;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvStonePosition=position;');
   shader.fragmentShader='varying vec3 vStonePosition;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    vec3 p=vStonePosition;
    float grain=fract(sin(dot(floor(p*740.),vec3(12.9898,78.233,31.718)))*43758.5453);
    float vein=pow(.5+.5*sin(p.x*23.+p.y*18.+p.z*9.+2.*sin(p.z*13.+p.x*11.)),28.);
    diffuseColor.rgb*=1.-.038*vein+(grain-.5)*.018;
   `);
  };
 }
 reset(){if(this.model)this.model.rotation.y=0;const size=this.bounds?.getSize(new T.Vector3())||new T.Vector3(1.5,2.4,.7);const center=this.bounds?.getCenter(new T.Vector3())||new T.Vector3(.05,1.18,0);const distance=Math.max(size.y,size.x/this.camera.aspect)/(2*Math.tan(T.MathUtils.degToRad(this.camera.fov/2)))*1.12;this.controls.maxDistance=Math.max(8,distance*1.4);this.controls.target.copy(center);this.camera.position.copy(center).add(new T.Vector3(.45,.28,distance));this.controls.update();this.dirty=true;}
 rotate(direction){if(this.model)this.model.rotation.y+=direction*Math.PI/8;this.dirty=true;}
 detail(){if(!this.bounds)return;const size=this.bounds.getSize(new T.Vector3()),center=this.bounds.getCenter(new T.Vector3());center.y=this.bounds.max.y-size.y*.23;const distance=Math.max(1.7,size.y*.56/(2*Math.tan(T.MathUtils.degToRad(this.camera.fov/2))),size.x*.7/this.camera.aspect);this.controls.target.copy(center);this.camera.position.copy(center).add(new T.Vector3(.15,.08,distance));this.controls.update();this.dirty=true;}
 zoom(factor){const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(T.MathUtils.clamp(offset.length()*factor,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();this.dirty=true;}
 light(mode){this.scene.background.set(mode==='night'?'#07171c':'#102c32');this.key.intensity=mode==='night'?2.3:3.2;this.fill.intensity=mode==='night'?.65:1.5;this.rim.intensity=mode==='night'?3.8:3;this.dirty=true;}
 setReduced(value){this.reduced=value;if(value)this.setAuto(false);}
 setAuto(value){this.auto=value&&!this.reduced;this.last=0;this.dirty=true;}
 frame(t){if(document.hidden||this.disposed)return;const dt=this.last?Math.min((t-this.last)/1000,.05):0;this.last=t;if(this.auto&&this.model){this.model.rotation.y+=dt*.17;this.dirty=true;}if(!this.dirty)return;this.renderer.render(this.scene,this.camera);this.canvas.dataset.drawCalls=this.renderer.info.render.calls;this.canvas.dataset.triangles=this.renderer.info.render.triangles;this.dirty=false;}
 stop(){this.auto=false;this.renderer.setAnimationLoop(null);}
 dispose(){this.disposed=true;++this.sequence;this.abort?.abort();this.stop();this.observer.disconnect();this.controls.dispose();this.clearModel();this.release(this.scene);this.environment?.dispose();this.renderer.dispose();this.canvas.removeEventListener('webglcontextlost',this.lostHandler);document.removeEventListener('visibilitychange',this.visibility);}
}
