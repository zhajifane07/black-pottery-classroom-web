/* Photo-based reconstruction of the Xiongzhou nine-fish vase, catalogue 1050. */
(() => {
 const T=window.THREE;
 if(!T)return;
 const figure=document.createElement('figure');figure.className='plate live-model';figure.innerHTML='<svg></svg><span id="view-name">九鱼瓶 · 实物照片参考重建</span>';
 document.querySelector('#observe [data-model-slot]').append(figure);
 const stats={frames:0,drawCalls:0,triangles:0,renderMs:[],frameMs:[],ready:false};
 window.potteryPerformance=stats;
 const photograph=new Image();photograph.src='references/ninefish.jpg';
 photograph.onload=()=>build();
 photograph.onerror=()=>figure.querySelector('span').textContent='实物图加载失败，请重新打开。';
 function build(){
  const source=document.createElement('canvas');source.width=photograph.width;source.height=photograph.height;const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(photograph,0,0);const image=sc.getImageData(0,0,source.width,source.height);
  // Measurements traced from the published front photograph, in image pixels.
  // Normalized radius from the actual silhouette. Height decreases from mouth to foot.
  const radii=[.71,.72,.66,.59,.57,.60,.73,.85,.94,1,1.025,1.04,1.045,1.04,1.035,1.025,1.01,.99,.965,.935,.90,.86,.81,.75,.68,.61,.54,.48,.44,.43];
  const height=2.9;
  const points=[new T.Vector2(0,-height/2),new T.Vector2(.43,-height/2)];
  for(let i=radii.length-1;i>=0;i--)points.push(new T.Vector2(radii[i],height/2-i/(radii.length-1)*height));
  points.push(new T.Vector2(.68,height/2),new T.Vector2(.55,height/2-.12),new T.Vector2(.51,height/2-.27),new T.Vector2(.54,height/2-.42),new T.Vector2(.69,height/2-.58),new T.Vector2(.91,height/2-.9),new T.Vector2(.96,0),new T.Vector2(.80,-.6),new T.Vector2(.40,-1.34),new T.Vector2(0,-1.34));
  const geometry=new T.LatheGeometry(points,96);
  const textureCanvas=document.createElement('canvas');textureCanvas.width=1024;textureCanvas.height=1024;const tc=textureCanvas.getContext('2d');const pixels=tc.createImageData(1024,1024);
  function radiusAt(t){const index=Math.max(0,Math.min(radii.length-1,t*(radii.length-1)));const a=Math.floor(index),b=Math.min(a+1,radii.length-1);return radii[a]+(radii[b]-radii[a])*(index-a)}
  for(let y=0;y<1024;y++)for(let x=0;x<1024;x++){
   const theta=x/1023*Math.PI*2,t=y/1023;
   const photoX=Math.round(414+radiusAt(t)/1.045*211*Math.sin(theta));
   const photoY=Math.round(288+t*590);
   const si=(Math.min(image.height-1,photoY)*image.width+Math.min(image.width-1,Math.max(0,photoX)))*4;
   const front=Math.max(0,Math.min(1,(Math.cos(theta)-.05)/.25));
   const di=(y*1024+x)*4;
   const background=(t<.16||t>.95)&&Math.min(image.data[si],image.data[si+1],image.data[si+2])>140;
   for(let c=0;c<3;c++)pixels.data[di+c]=Math.round((background?24:image.data[si+c])*front+24*(1-front));pixels.data[di+3]=255;
  }
  tc.putImageData(pixels,0,0);
  const texture=new T.CanvasTexture(textureCanvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  // Override lathe UV vertical coordinate so each pixel follows measured height.
  const uv=geometry.attributes.uv,pos=geometry.attributes.position;
  for(let i=0;i<pos.count;i++)uv.setY(i,(pos.getY(i)+height/2)/height);
  const scene=new T.Scene();scene.background=new T.Color('#26333b');
  const camera=new T.PerspectiveCamera(33,1,.1,40);
  let renderer;try{renderer=new T.WebGLRenderer({antialias:false,powerPreference:'high-performance'})}catch{figure.querySelector('span').textContent='此设备无法启动三维显示，可以查看实物照片。';return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const canvas=renderer.domElement;canvas.id='pottery-canvas';canvas.setAttribute('aria-label','九鱼瓶三维重建，拖动旋转，双指缩放');figure.querySelector('svg')?.replaceWith(canvas);
  const material=new T.MeshLambertMaterial({map:texture,color:0xc6c6c6,side:T.DoubleSide});
  const teachingMaterial=new T.MeshPhongMaterial({color:0x262923,specular:0x857c61,shininess:45,side:T.DoubleSide});
  const vessel=new T.Mesh(geometry,material);scene.add(vessel);
  const base=new T.Mesh(new T.CylinderGeometry(1.38,1.43,.09,48),new T.MeshLambertMaterial({color:0x1b252c}));base.position.y=-1.51;scene.add(base);
  scene.add(new T.HemisphereLight(0xf7f1df,0x676056,2.7));const key=new T.DirectionalLight(0xfff0d6,1.6);key.position.set(-3,5,4);scene.add(key);const rim=new T.DirectionalLight(0xc8dded,1.4);rim.position.set(3,2,-3);scene.add(rim);
  const state={yaw:0,pitch:.06,distance:6.8},target={...state};let frame=0,lastTime=0,lastWidth=0,lastHeight=0,dragging=false;
  function resize(){const width=figure.clientWidth,height=canvas.clientHeight||480;if(width===lastWidth&&height===lastHeight)return;lastWidth=width;lastHeight=height;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
  function schedule(){if(!frame&&!figure.closest('section')?.hidden&&!document.hidden)frame=requestAnimationFrame(draw)}
  function draw(now){frame=0;if(figure.closest('section')?.hidden||document.hidden)return;resize();const start=performance.now();let difference=0;const unfolding=advancePattern(now);for(const key of ['yaw','pitch','distance']){const delta=target[key]-state[key];state[key]+=delta*.34;difference+=Math.abs(delta)}camera.position.set(Math.sin(state.yaw)*Math.cos(state.pitch)*state.distance,Math.sin(state.pitch)*state.distance,Math.cos(state.yaw)*Math.cos(state.pitch)*state.distance);camera.lookAt(0,0,0);renderer.render(scene,camera);stats.frames++;stats.drawCalls=renderer.info.render.calls;stats.triangles=renderer.info.render.triangles;stats.renderMs.push(performance.now()-start);if(lastTime&&now-lastTime<100)stats.frameMs.push(now-lastTime);lastTime=now;if(stats.renderMs.length>600)stats.renderMs.shift();if(stats.frameMs.length>600)stats.frameMs.shift();if(dragging||difference>.001||unfolding)schedule()}
  const pointers=new Map();let pinch=0;
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);dragging=true;lastTime=0;schedule()});
  canvas.addEventListener('pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const p=[...pointers.values()];const gap=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pinch&&gap>10)target.distance=Math.max(4.7,Math.min(10,target.distance*pinch/gap));pinch=gap}else{target.yaw-=(e.clientX-old[0])*.009;target.pitch=Math.max(-.65,Math.min(1.55,target.pitch+(e.clientY-old[1])*.007))}schedule()});
  function release(e){pointers.delete(e.pointerId);pinch=0;dragging=pointers.size>0;schedule()}
  for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,release);
  canvas.addEventListener('wheel',e=>{e.preventDefault();target.distance=Math.max(4.7,Math.min(10,target.distance+e.deltaY*.005));schedule()},{passive:false});
  for(const button of document.querySelectorAll('[data-view]')){button.onclick=()=>{for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b===button));target.pitch=button.dataset.view==='俯视'?1.55:0;target.yaw=button.dataset.view==='左视'?-Math.PI/2:0;document.querySelector('#view-name').textContent=button.dataset.view+' · 九鱼瓶';schedule()}}
  const controls=document.createElement('div');controls.className='controls model-controls';for(const [text,action]of [['放大',()=>target.distance=Math.max(4.7,target.distance-.6)],['缩小',()=>target.distance=Math.min(10,target.distance+.6)],['复位',()=>Object.assign(target,{yaw:0,pitch:.06,distance:6.8})]]){const button=document.createElement('button');button.textContent=text;button.onclick=()=>{action();schedule()};controls.append(button)}figure.after(controls);
  new ResizeObserver(()=>schedule()).observe(figure);addEventListener('hashchange',()=>{lastTime=0;schedule()});document.addEventListener('visibilitychange',()=>{lastTime=0;schedule()});
  let patternLeft,patternRight,axisLine,patternTexture;
  let patternGeneration=0,currentMotif='',foldProgress=0,foldTarget=0,lastFoldTime=0;
  const originals=[];
  function initializePattern(){
   const root=new T.Group();scene.add(root);root.visible=false;
   function patch(start,end){
    const positions=[],uvs=[],indices=[],columns=24,rows=12;
    for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
     const angle=start+(end-start)*col/columns,y=.6-1.2*row/rows;
     const r=radiusAt((1.45-y)/2.9)+.015;
     positions.push(r*Math.sin(angle),y,r*Math.cos(angle)-1.46);
     uvs.push((Math.sin(angle)+Math.sin(.84))/(2*Math.sin(.84)),1-row/rows);
    }
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){const a=row*(columns+1)+col,b=a+columns+1;indices.push(a,b,a+1,b,b+1,a+1)}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
    const material=new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,color:0xffffff});
    const group=new T.Group();group.position.z=1.46;const mesh=new T.Mesh(geometry,material);group.add(mesh);root.add(group);originals.push({mesh,positions:new Float32Array(positions)});return group;
   }
   patternLeft=patch(-.84,0);patternRight=patch(0,.84);
   const lineGeometry=new T.BufferGeometry().setFromPoints([new T.Vector3(0,-.72,1.49),new T.Vector3(0,.72,1.49)]);
   axisLine=new T.Line(lineGeometry,new T.LineDashedMaterial({color:0xd8b781,dashSize:.045,gapSize:.035,depthTest:false}));axisLine.computeLineDistances();scene.add(axisLine);
   window.potteryPatternRoot=root;
  }
  function advancePattern(now){
   if(!patternLeft)return false;
   const delta=Math.min(.04,lastFoldTime?(now-lastFoldTime)/1000:.016);lastFoldTime=now;
   const difference=foldTarget-foldProgress;if(Math.abs(difference)<.001)return false;
   foldProgress+=Math.sign(difference)*Math.min(Math.abs(difference),delta/.95);
   const flat=Math.min(1,foldProgress/.35),angle=Math.max(0,(foldProgress-.35)/.65)*Math.PI;
   for(const item of originals){const attribute=item.mesh.geometry.attributes.position;for(let i=0;i<attribute.count;i++)attribute.setZ(i,item.positions[i*3+2]*(1-flat));attribute.needsUpdate=true;}
   patternLeft.rotation.y=angle;patternLeft.children[0].material.color.setHex(angle>.05?0xd47d5c:0xffffff);patternLeft.children[0].material.opacity=1-.35*Math.min(1,angle/Math.PI);axisLine.position.z=.12*flat;
   return Math.abs(foldTarget-foldProgress)>.001;
  }
  async function applyPattern(){
   const view=window.potteryLessonView||{mode:'original'};
   const teaching=view.mode==='teaching'&&['fold','challenge'].includes(view.chapter);
   vessel.material=teaching?teachingMaterial:material;document.querySelector('#view-name').textContent=teaching?(view.folded?'纹样薄片 · 左半向右对折':'同款器形 · 教学施纹'):'九鱼瓶 · 实物照片参考重建';window.potteryPatternRoot.visible=teaching;axisLine.visible=teaching&&view.showAxis;
   foldTarget=teaching&&view.folded?1:0;
   if(teaching){
    const motif=window.POTTERY_MOTIFS.find(m=>m.id===view.motifId);
    if(motif&&currentMotif!==motif.id){
     currentMotif=motif.id;foldProgress=0;foldTarget=view.folded?1:0;patternLeft.rotation.y=0;
     for(const item of originals){item.mesh.geometry.attributes.position.array.set(item.positions);item.mesh.geometry.attributes.position.needsUpdate=true;item.mesh.material.color.setHex(0xffffff);item.mesh.material.opacity=1}
     const generation=++patternGeneration;const source=new Image();source.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(window.motifSVG(motif));
     await source.decode();if(generation!==patternGeneration)return;
     const mapCanvas=document.createElement('canvas');mapCanvas.width=512;mapCanvas.height=333;mapCanvas.getContext('2d').drawImage(source,0,0,512,333);
     const map=new T.CanvasTexture(mapCanvas);map.colorSpace=T.SRGBColorSpace;
     for(const item of originals){item.mesh.material.map=map;item.mesh.material.needsUpdate=true}
     patternTexture?.dispose();patternTexture=map;
     Object.assign(target,{yaw:0,pitch:0,distance:6.4});
    }
    if(view.folded)Object.assign(target,{yaw:0,pitch:0,distance:6.4});
   }
   schedule();
  }
  function mount(){
   const section=document.querySelector('section.book:not([hidden])'),host=section?.querySelector('[data-model-slot]');
   if(host){host.append(figure,controls);lastWidth=0;lastHeight=0;lastTime=0;window.potteryPatternReady=applyPattern();schedule()}
  }
  document.addEventListener('lesson:route',mount);document.addEventListener('pottery:pattern',()=>{if(patternLeft)window.potteryPatternReady=applyPattern()});
  initializePattern();
  stats.ready=true;stats.vertexCount=pos.count;stats.textureSize=1024;schedule();
  window.potteryModel={target,schedule,snapshot:()=>{resize();renderer.render(scene,camera);return canvas.toDataURL('image/png')},geometry,textureCanvas};
  mount();
 }
})();
