/* Tablet lesson revision: a playable guide, reference gallery and folding studio. */
(() => {
 const $=s=>document.querySelector(s);
 const guideSVG=`<svg viewBox="0 0 280 320" role="img" aria-label="黑陶小向导小陶"><defs><linearGradient id="robe" x2="1" y2="1"><stop stop-color="#42736c"/><stop offset="1" stop-color="#173e41"/></linearGradient></defs><ellipse cx="142" cy="300" rx="90" ry="12" fill="#65522b" opacity=".15"/><g class="guide-person"><path d="M100 264 94 293h34l12-30m13 0 8 30h34l-14-31" fill="#23383b"/><path d="M85 157q55-23 109 0l22 112q-73 24-151 0Z" fill="url(#robe)" stroke="#c6a769" stroke-width="3"/><path d="m114 148 29 45 29-45M142 194v81M77 239q64 15 130 0" fill="none" stroke="#d8b773" stroke-width="5"/><g class="guide-arm"><path d="m91 166-38 40-14-21-19 16q18 52 43 40l41-38" fill="#38675e" stroke="#c6a769" stroke-width="3"/><path d="m37 190-10-19q-9-7-14 3l3 28q11 13 22-1" fill="#edba82"/></g><path d="m190 169 34 42 17-9 10 19q-25 24-43 7l-28-27" fill="#35645d" stroke="#c6a769" stroke-width="3"/><path d="m237 205 5-20q7-12 15-4l3 25-10 14" fill="#edba82"/><path d="M87 74q-1-55 55-55t57 55v37H85" fill="#252c2b"/><ellipse cx="142" cy="96" rx="55" ry="59" fill="#efbd89"/><path d="M88 83q0-55 54-54t56 51q-36-3-51-30-15 22-59 33" fill="#252c2b"/><path d="M91 54q48-41 99 0l-6-24q-42-31-86 1Z" fill="#294f4e" stroke="#bb9a5c" stroke-width="3"/><circle cx="143" cy="35" r="8" fill="#cba85f"/><path d="M109 96q9-9 18 0m32 0q9-9 18 0" fill="none" stroke="#393831" stroke-width="4" stroke-linecap="round"/><ellipse cx="109" cy="112" rx="9" ry="4" fill="#d78968"/><ellipse cx="176" cy="112" rx="9" ry="4" fill="#d78968"/><path class="guide-mouth" d="M130 120q13 13 25 0" fill="#9f503c" stroke="#9f503c" stroke-width="3"/><path d="m116 158 26 22 28-22" fill="#f4deb1"/></g></svg>`;
 const topics=[
  ['什么是黑陶？','你好，我是小陶。黑陶是一类呈黑色或深灰色的陶器。先看器口，再看器腹和底部。它们的形状，藏着制陶人的巧思。','观察器口 → 器腹 → 底部'],
  ['黑陶有哪些外观特点？','黑陶常给人乌黑、细腻的感觉。有的表面经过磨光，会反射柔和的光；有的刻着纹样，有的还有镂空装饰。不同作品，外观也不同。','看颜色、光泽、纹样和镂空'],
  ['为什么是黑色的？','黑陶的颜色与烧制工艺有关。烧制时控制窑内条件，利用渗碳等工艺，可以使陶器呈现深黑色。它可不是简单地把外面涂黑哦。','黑色，与烧制工艺有关'],
  ['古人用陶器做什么？','古人用陶器盛放水、食物和其他物品，有的陶器还用于礼仪。具体用途要结合器形、出土位置和研究资料判断。今天的黑陶，也可以是欣赏用的工艺品。','生活用具，也有礼仪与艺术用途'],
  ['雄县黑陶怎样做出来？','雄县也称雄州，当地有黑陶制作传统。泥土要经过选土练泥、拉坯成形、修整干燥、刻画磨光和烧制。一团泥，经过匠人的双手与窑火，才成为黑陶。','练泥 → 成形 → 修整 → 装饰 → 烧制']
 ];
 $('#learn .left').innerHTML='<p class="eyebrow">第一站 / 小陶带你入门</p><h2>点一点，听黑陶的故事</h2><div class="guide-stage"><div class="guide-halo"></div>'+guideSVG+'<span class="guide-tag">雄州小向导 · 小陶</span></div><div class="guide-progress" aria-label="故事阅读进度"></div><div id="topic-list" class="story-topics"></div>';
 const heading=$('#topic-title');heading.before(Object.assign(document.createElement('span'),{className:'story-counter',textContent:'故事 01 / 05'}));
 $('#topic-body').classList.add('story-subtitle');
 $('#listen').textContent='▶ 听小陶介绍';
 const discovery=document.createElement('p');discovery.className='story-discovery';$('#listen').after(discovery);
 let narration=null,topic=0;const visited=new Set();
 function stopGuide(){narration?.pause();$('.guide-stage').classList.remove('speaking');$('#listen').textContent='▶ 再听一次';}
 function playGuide(){stopGuide();document.dispatchEvent(new Event('guide:play'));narration=new Audio('audio/story-'+(topic+1)+'.mp3');$('.guide-stage').classList.add('speaking');$('#listen').textContent='Ⅱ 暂停介绍';narration.onended=stopGuide;narration.onerror=()=>{stopGuide();discovery.textContent='语音暂未加载，故事文字可以直接阅读。';};narration.play().catch(()=>{stopGuide();discovery.textContent='再点“听小陶介绍”播放语音。';});}
 function selectTopic(i,play=true){stopGuide();topic=i;visited.add(i);heading.textContent=topics[i][0];$('#topic-body').textContent=topics[i][1];discovery.textContent=topics[i][2];$('.story-counter').textContent='故事 0'+(i+1)+' / 05';$('#listen').textContent='▶ 听小陶介绍';document.querySelectorAll('.story-topics button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));$('.guide-progress').innerHTML=topics.map((_,n)=>'<span class="'+(visited.has(n)?'visited':'')+'">'+(n+1)+'</span>').join('');if(play)playGuide();}
 topics.forEach(([label],i)=>{const b=document.createElement('button');b.innerHTML='<span>0'+(i+1)+'</span>'+label;b.onclick=()=>selectTopic(i);$('#topic-list').append(b);});
 $('#listen').onclick=()=>narration&&!narration.paused?stopGuide():playGuide();
 addEventListener('hashchange',stopGuide);document.addEventListener('bookclosed',stopGuide);document.addEventListener('voice:play',stopGuide);selectTopic(0,false);

 const gallery=[['jar','素面鼓腹罐','宽宽的器腹，短短的颈部。看一看口沿与器底。'],['goblet','细柄高足杯','从杯口，沿细长杯柄，一直看到圈足。'],['openwork','镂空长颈瓶','修长的器身，环绕瓶身的镂空装饰。'],['bird','鸟饰镂空瓶','鸟形装饰停在瓶顶，下方是镂空的瓶腹。'],['dragon','描金高足杯','深色陶面上施以金色装饰，分段器形高低错落。']];
 $('#observe .stage-heading span').id='gallery-name';
 $('#observe .right h2').textContent='小小黑陶陈列馆';
 const note=$('#observe .right .source-note');note.innerHTML='根据客户提供照片制作的可旋转教学模型；背面装饰、内壁和遮挡部分为推定，不是实物扫描。点击“实物照片”可与参考图对照。';
 const tray=document.createElement('div');tray.className='vessel-gallery';tray.innerHTML=gallery.map(([id,name],i)=>'<button data-vessel="'+id+'" aria-pressed="'+(i===0)+'"><img src="references/customer/'+id+'.jpg" alt="'+name+'参考照片"><span>'+name+'</span></button>').join('');$('#observe .right h2').after(tray);
 const caption=document.createElement('p');caption.id='gallery-caption';caption.className='prompt';tray.after(caption);
 const photo=document.createElement('button');photo.className='photo-compare';photo.textContent='实物照片 ↗';note.before(photo);
 const dialog=document.createElement('dialog');dialog.className='reference-dialog';dialog.innerHTML='<button class="ink">关闭照片</button><img alt="器物原始参考照片"><p>原始参考照片 · 三维模型为教学重建</p>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
 let chosen='jar';function selectVessel(id){chosen=id;window.potteryGalleryId=id;const item=gallery.find(v=>v[0]===id);$('#gallery-name').textContent=item[1];caption.textContent=item[2];tray.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vessel===id)));document.dispatchEvent(new Event('pottery:gallery'));}
 tray.onclick=e=>{const b=e.target.closest('button');if(b)selectVessel(b.dataset.vessel);};photo.onclick=()=>{dialog.querySelector('img').src='references/customer/'+chosen+'.jpg';dialog.showModal();};selectVessel('jar');

 const shapes=[
  {id:'square',name:'正方形',yes:true,path:'M65 65H255V255H65Z',color:'#ad5837',hint:'沿中间的竖线对折，左边与右边完全重合。'},
  {id:'triangle',name:'等边三角形',yes:true,path:'M160 42 279 253H41Z',color:'#c28b39',hint:'这是一枚等边三角形。顶点连向底边中点的折痕，是一条对称轴。'},
  {id:'circle',name:'圆',yes:true,path:'M160 42a118 118 0 1 0 0 236a118 118 0 1 0 0-236',color:'#47786c',hint:'沿着经过圆心的这条直线对折，两边完全重合。'},
  {id:'rectangle',name:'长方形',yes:true,path:'M32 83H288V237H32Z',color:'#426f81',hint:'沿中间竖线对折可以重合。你还可以想想，横着对折会怎样。'},
  {id:'parallelogram',name:'普通平行四边形',yes:false,path:'M95 73H285L225 247H35Z',color:'#998346',hint:'这枚斜斜的平行四边形，沿中间竖线对折不能重合。它没有对称轴。并不是四条边的图形都轴对称。'}
 ];
 const life=[
  {id:'butterfly',name:'剪纸蝴蝶',yes:true,hint:'观察蝴蝶的整体轮廓与两侧花纹，设计时可以沿身体中线对折。手工制作的细节可能有小差别。'},
  {id:'collar',name:'绣花云肩',yes:true,hint:'左右花朵、边缘和流苏相互对应。这种对称设计，让传统服饰显得均衡。'},
  {id:'kite',name:'沙燕风筝',yes:true,hint:'顺着风筝头部、身体到尾部找一条中线，两侧翅膀和外轮廓互相对应。观察整体设计，忽略照片倾斜和手工小差别。'},
  {id:'palace',name:'故宫建筑群',yes:true,hint:'沿中轴线观察，许多主要建筑左右对应。这里欣赏的是整体布局中的对称美，不是说照片每一个像素都对称。'},
  {id:'temple',name:'斜拍的祈年殿照片',yes:false,hint:'这张照片有拍摄角度，画面两侧不能严格对折重合。建筑正面轮廓可以呈现对称，但不能把斜拍照片直接当作标准轴对称图形。'}
 ];
 $('#challenge').innerHTML='<div class="page left transfer-left"><p class="eyebrow">第四站 / 迁移运用</p><div class="transfer-tabs"><button data-transfer="math" aria-pressed="true">一 · 数学图形</button><button data-transfer="life" aria-pressed="false">二 · 生活中的对称</button></div><div id="transfer-stage"></div><p id="transfer-caption" class="gesture-hint"></p><div id="transfer-picker"></div></div><div class="page right"><span class="folio">举一反三 / 004</span><p class="story-counter" id="transfer-count"></p><h2 id="transfer-name"></h2><p id="transfer-prompt"></p><div class="controls"><button id="transfer-yes">是轴对称图形</button><button id="transfer-no">不是轴对称图形</button></div><p id="transfer-result" class="prompt" role="status">先判断，再看验证。</p><div class="fold-slider"><button class="ink" id="animate-shape">▶ 小陶演示对折</button><label for="fold-range">自己慢慢折 <input id="fold-range" type="range" min="0" max="180" value="0"></label></div><div id="math-guide" class="math-guide">'+guideSVG+'<p>先找一条可能的折痕，再把一边折到另一边。如果完全重合，就找到了一条对称轴。</p></div><button class="ink" id="transfer-next">下一幅 →</button><a href="#report" class="ink station-next" id="transfer-finish" hidden>完成考察 · 查看学习报告 →</a></div>';
 let mode='math',index=0,anim=null;
 const group=()=>mode==='math'?shapes:life;
 function folding(deg){const half=$('#moving-half');if(half)half.style.transform='rotateY('+deg+'deg)';$('#fold-range').value=String(deg);$('#transfer-caption').textContent=deg<180?'沿虚线缓缓对折，观察边缘怎样靠近。':shapes[index].yes?'两侧完全重合，这就是验证的依据。':'出现了露出的部分，沿这条线不能完全重合。';}
 function renderTransfer(){anim?.cancel();anim=null;const q=group()[index],answer=learning.data.answers[mode+'-'+q.id];$('#transfer-count').textContent=(mode==='math'?'数学图形':'生活观察')+' · '+(index+1)+' / '+group().length;$('#transfer-name').textContent=q.name;$('#transfer-prompt').textContent=mode==='math'?'观察这个平面图形：能找到一条直线，让它对折后两侧完全重合吗？':(q.id==='temple'?'这张斜拍照片本身，能严格沿中间竖线对折重合吗？':q.id==='palace'?'观察中轴线两侧的建筑安排，这里能找到对称设计的依据吗？':'想象物品平展开来，观察整体轮廓与设计，能找到对称的依据吗？');$('#transfer-result').textContent=answer?(answer.correct?'判断正确。':'再看一看。')+q.hint:'先作出你的判断，再看小陶的验证与提示。';for(const v of ['yes','no'])$('#transfer-'+v).disabled=Boolean(answer);$('#transfer-yes').textContent=mode==='math'?'是轴对称图形':'能找到对称依据';$('#transfer-no').textContent=mode==='math'?'不是轴对称图形':'不能这样判断';$('.fold-slider').hidden=mode!=='math';$('#math-guide').hidden=mode!=='math';$('#transfer-next').hidden=mode==='life'&&index===life.length-1;$('#transfer-next').textContent=mode==='math'&&index===shapes.length-1?'去生活里找一找 →':'下一幅 →';$('#transfer-finish').hidden=!(mode==='life'&&index===life.length-1);document.querySelectorAll('[data-transfer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.transfer===mode)));
  if(mode==='math'){$('#transfer-stage').innerHTML='<svg class="fold-canvas" viewBox="0 0 320 320" aria-label="'+q.name+'沿竖直中线对折演示"><defs><clipPath id="clip-left"><rect width="160" height="320"/></clipPath><clipPath id="clip-right"><rect x="160" width="160" height="320"/></clipPath></defs><path d="'+q.path+'" fill="'+q.color+'" opacity=".14" stroke="'+q.color+'" stroke-width="2"/><path clip-path="url(#clip-right)" d="'+q.path+'" fill="'+q.color+'" stroke="#f5e6bf" stroke-width="1"/><g id="moving-half" style="transform-origin:160px 160px"><path clip-path="url(#clip-left)" d="'+q.path+'" fill="'+q.color+'" fill-opacity=".72" stroke="#f9e8bf" stroke-width="2"/></g><path d="M160 20V300" stroke="#754c31" stroke-dasharray="6 6" stroke-width="2"/></svg>';folding(0);}else{$('#transfer-stage').innerHTML='<img class="life-photo" src="references/customer/'+q.id+'.jpg" alt="'+q.name+'"><span class="life-photo-label">观察真实图片 · 留意拍摄角度</span>';$('#transfer-caption').textContent='对称设计常见于传统工艺与建筑；实物、照片和平面图形要区分。';}
  $('#transfer-picker').innerHTML=group().map((v,i)=>'<button aria-pressed="'+(index===i)+'" data-index="'+i+'">'+(learning.data.answers[mode+'-'+v.id]?'✓ ':'')+v.name+'</button>').join('');
 }
 function answerTransfer(value){const q=group()[index];learning.answer(mode+'-'+q.id,mode==='math'?'第四站·数学图形':'第四站·生活迁移',q.name+'的轴对称判断',value,q.yes);renderTransfer();}
 $('#transfer-yes').onclick=()=>answerTransfer(true);$('#transfer-no').onclick=()=>answerTransfer(false);
 $('#transfer-picker').onclick=e=>{const b=e.target.closest('button');if(b){index=+b.dataset.index;renderTransfer();}};
 document.querySelectorAll('[data-transfer]').forEach(b=>b.onclick=()=>{mode=b.dataset.transfer;index=0;renderTransfer();});
 $('#transfer-next').onclick=()=>{if(index<group().length-1)index++;else{mode='life';index=0;}renderTransfer();};
 $('#fold-range').oninput=e=>{anim?.cancel();anim=null;folding(+e.target.value);};
 $('#animate-shape').onclick=()=>{anim?.cancel();folding(0);const half=$('#moving-half');if(!half)return;anim=half.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(180deg)'}],{duration:2200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});const current=anim;current.finished.then(()=>{if(anim===current){anim.cancel();anim=null;folding(180);}}).catch(()=>{});};
 renderTransfer();
 // All sections retain the same book shell, so opening and page turns share their geometry.
 document.addEventListener('lesson:route',e=>{if(e.detail.id==='challenge')renderTransfer();});
})();
