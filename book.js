(() => {
 document.body.classList.add('closed');
 const scene=document.createElement('div');scene.id='cover-scene';scene.innerHTML='<div class="cover-scene-backdrop"></div><div class="closed-volume"><div class="cover-face"><div class="cover-front"><div class="cover-border"></div><div class="binding"><i></i><i></i><i></i><i></i></div><span class="cover-edition">雄州风物 · 少年考察</span><div class="title-slip"><span>陶火成器</span><h1>黑陶考察手记</h1></div><div class="cover-seal">雄州<br>陶记</div><button class="open-book">启卷 · 开始考察</button></div><div class="cover-back"></div></div><div class="cover-caption">翻开一册书，走近一方陶</div></div>';document.body.append(scene);
 const volume=scene.querySelector('.closed-volume'),face=scene.querySelector('.cover-face'),back=scene.querySelector('.cover-back'),backdrop=scene.querySelector('.cover-scene-backdrop'),button=scene.querySelector('button');
 const reduced=matchMedia('(prefers-reduced-motion: reduce), (max-width:760px)');
 let busy=false;
 function resetAnimations(){for(const el of [volume,face,backdrop,scene])for(const animation of el.getAnimations())animation.cancel();document.querySelectorAll('main .book,header,footer,.chapter-nav').forEach(el=>el.getAnimations().forEach(a=>a.cancel()))}
 button.onclick=async()=>{
  if(busy)return;busy=true;button.disabled=true;
  if(!location.hash||location.hash==='#home')history.replaceState(null,'','#learn');
  window.lesson.route();const book=document.querySelector('section.book:not([hidden])');
  const left=book.querySelector('.left'),right=book.querySelector('.right');
  try{
   if(!reduced.matches){
    // Settle the closed volume before the camera tracks it into the real spread.
    await volume.animate([{transform:getComputedStyle(volume).transform},{transform:'none'}],{duration:240,easing:'ease-out',fill:'forwards'}).finished;
    const initial=volume.getBoundingClientRect(),target=book.getBoundingClientRect(),rightBounds=right.getBoundingClientRect();
    const copy=window.lesson.clonePage(left);copy.style.width=left.offsetWidth+'px';copy.style.height=left.offsetHeight+'px';copy.style.transform='scale('+initial.width/left.offsetWidth+','+initial.height/left.offsetHeight+')';back.replaceChildren(copy);
    const startX=initial.left-initial.width-target.left,startY=initial.top-target.top;
    const sx=initial.width*2/target.width,sy=initial.height/target.height;
    document.body.classList.remove('closed');scene.classList.add('opening');
    const bookMotion=book.animate([{transform:'translate('+startX+'px,'+startY+'px) scale('+sx+','+sy+')',clipPath:'inset(0 0 0 50%)'},{transform:'translate(0,0) scale(1)',clipPath:'inset(0 0 0 0)'}],{duration:1250,easing:'cubic-bezier(.35,.06,.2,1)',fill:'both'});book.style.transformOrigin='top left';
    const volumeMotion=volume.animate([{transform:'none'},{transform:'translate('+(rightBounds.left-initial.left)+'px,'+(rightBounds.top-initial.top)+'px) scale('+rightBounds.width/initial.width+','+rightBounds.height/initial.height+')'}],{duration:1250,easing:'cubic-bezier(.35,.06,.2,1)',fill:'forwards'});
    const faceMotion=face.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-180deg)'}],{duration:1250,easing:'cubic-bezier(.35,.06,.2,1)',fill:'forwards'});
    backdrop.animate([{opacity:1},{opacity:0}],{duration:1100,fill:'forwards'});
    for(const el of document.querySelectorAll('header,footer,.chapter-nav'))el.animate([{opacity:0},{opacity:1}],{delay:650,duration:600,fill:'both'});
    await Promise.all([bookMotion.finished,volumeMotion.finished,faceMotion.finished]);
    scene.style.display='none';bookMotion.cancel();back.replaceChildren();
   }else{document.body.classList.remove('closed');scene.style.display='none'}
   document.dispatchEvent(new CustomEvent('lesson:route',{detail:{id:book.id}}));
  }finally{busy=false;button.disabled=false}
 };
 const close=document.createElement('button');close.className='close-book';close.textContent='合上手记';document.querySelector('header').append(close);
 close.onclick=async()=>{
  if(busy)return;busy=true;document.dispatchEvent(new Event('bookclosed'));resetAnimations();scene.classList.remove('opening');scene.style.display='grid';
  const current=document.querySelector('section.book:not([hidden])');
  if(!reduced.matches){const closing=current.animate([{opacity:1,transform:'scale(1)'},{opacity:.05,transform:'scale(.92)'}],{duration:300,easing:'ease-in'});scene.animate([{opacity:0},{opacity:1}],{duration:350});await closing.finished;closing.cancel()}
  document.body.classList.add('closed');back.replaceChildren();button.focus();busy=false;
 };
})();
