(() => {
 const main=document.querySelector('main');
 const motifs=window.POTTERY_MOTIFS;
 const topics=[['什么是黑陶？','黑陶是一类呈黑色或深灰色的陶器。器口、器身和底部，都藏着制陶人的巧思。'],['雄县的黑陶有什么特别？','雄县也称雄州，当地有黑陶制作传统。细腻的红胶土经过成形、修整、装饰和烧制，可以成为黑陶工艺品。'],['为什么是黑色？','黑陶的黑色与烧制工艺有关。控制烧制条件，利用渗碳等工艺，可以让陶器呈现深黑色。'],['古人用陶器做什么？','陶器可以盛放食物、水和其他物品，也可能用于礼仪。一件器物的具体用途，需要结合器形、出土位置和研究资料判断。'],['怎样做出来？','选土练泥、拉坯成形、修整干燥、刻画与磨光、烧制。一团泥土，要经过许多道工序才能成为黑陶。']];
 const slot=()=>'<div class="model-host" data-model-slot></div><p class="gesture-hint">单指拖动旋转 · 双指捏合缩放 · 鼠标滚轮缩放</p>';
 const page=(id,left,right)=>'<section class="book" id="'+id+'" hidden><div class="page left">'+left+'</div><div class="page right">'+right+'</div></section>';
 main.innerHTML='<nav class="chapter-nav" aria-label="考察章节"></nav>'+[
  page('home','<p class="eyebrow">雄州风物 / 开卷</p><h1>黑陶考察<br>手记</h1><p>从泥土与窑火出发，走近一件黑陶，在器物上发现数学。</p><ol class="index"><li>一 · 听黑陶故事</li><li>二 · 看器物细节</li><li>三 · 折陶面纹样</li><li>四 · 在图形和生活中找对称</li></ol><a class="ink" href="#learn">开始考察 →</a>','<span class="folio">器物图录 / 九鱼瓶1050</span><img class="source-thumb" src="references/ninefish.jpg" alt="雄州九鱼瓶实物图录"><p class="source-note">参考实物照片重建。器形与鱼纹来自九鱼瓶，实验与闯关会在同款器形上换用教学纹样。</p>'),
  page('learn','<p class="eyebrow">第一站 / 黑陶知识</p><h2>泥土，怎样成为黑陶？</h2><div id="topic-list"></div><p class="prompt">和小陶聊一聊，再去转动器物，找找器口、器腹与圈足。</p>','<span class="folio">知识笔记 / 001</span><h2 id="topic-title"></h2><p id="topic-body"></p><button class="ink" id="listen">听一听</button><div id="voice-panel"></div><a class="ink station-next" href="#observe">去观察器物 →</a>'),
  page('observe','<p class="eyebrow">第二站 / 器物观察</p><div class="stage-heading"><h2>把黑陶，拿近些看</h2><span>九鱼瓶 · 雄州黑陶</span></div>'+slot(),'<span class="folio">观察记录 / 002</span><h2>转一转，再选一选</h2><div class="views"><button data-view="主视" aria-pressed="true">主视</button><button data-view="俯视" aria-pressed="false">俯视</button><button data-view="左视" aria-pressed="false">左视</button></div><p class="source-note">实物照片标注20×20×29厘米。背面与内壁按器形推定。<a href="https://www.yiwubuy.com/product/detail/933075373.html" target="_blank" rel="noopener">实物图录 ↗</a></p><div id="observation-questions"></div><a class="ink station-next" href="#fold">去做陶面纹样实验 →</a>'),
  page('fold','<p class="eyebrow">第三站 / 陶面纹样实验</p><div class="stage-heading"><h2>器形与纹样，都来比一比</h2><span id="fold-motif-name"></span></div>'+slot(),'<span class="folio">折叠验证 / 003</span><h2>陶面上的纹样，<br>对折能重合吗？</h2><p>先把器物转回正面：比较外轮廓的左右两边，再观察双鱼纹。最后取下同一片纹样，对折验证。</p><div class="motif-options"><button id="equal-leaf">① 双鱼对望纹</button><button id="unequal-leaf">② 大小双鱼纹</button></div><p id="fold-question"></p><div class="controls"><button id="fold-yes">能完全重合</button><button id="fold-no">不能完全重合</button></div><button class="ink" id="fold-button">取下纹样 · 对折验证</button><p class="prompt" id="fold-answer" role="status"></p><p class="source-note">数学小发现：把一个平面图形沿着一条直线对折，如果两侧能够完全重合，这个图形就是轴对称图形。这条直线叫作对称轴。器物是立体的，这里比较它的正面轮廓和陶面纹样。</p><a class="ink station-next" href="#challenge">去发现更多轴对称 →</a>'),
  page('challenge','<p class="eyebrow">第四站 / 黑陶施纹工坊</p><div class="stage-heading"><h2>换一幅纹样，再观察</h2><span id="question-count"></span></div>'+slot(),'<span class="folio">纹样判断 / 004</span><h2 id="question-name"></h2><p>看罐身中间的完整装饰单元。想一想，它能沿一条直线对折后完全重合吗？</p><div class="controls"><button id="answer-yes">是轴对称图形</button><button id="answer-no">不是轴对称图形</button></div><h3 id="feedback-title">先观察，再判断</h3><p id="feedback" role="status">可以转动罐子，也可以按“复位”回到正面。</p><button id="next-question" class="ink" hidden>下一件纹样 →</button><a id="finish-lesson" class="ink" href="#report" hidden>完成考察 · 查看学习报告 →</a><p class="source-note">纹样以描金装饰的方式贴合罐身，使用同一器形进行对比。</p>'),
  page('report','<p class="eyebrow">考察完成 / 学习报告</p><h2>我的黑陶学习手记</h2><div id="report-summary"></div><div id="report-review"></div><button class="ink" id="download-report">保存学习报告</button><button id="new-session" class="text-button">开始新一轮考察</button>','<span class="folio">与小陶的对话 / 学习记录</span><h2>我问过，小陶说过</h2><div id="report-dialogues"></div><p class="source-note" id="storage-status"></p>')
 ].join('');
 const stages=[['home','开卷'],['learn','认识黑陶'],['observe','观察器物'],['fold','陶面实验'],['challenge','迁移运用'],['report','学习报告']];
 const nav=main.querySelector('nav');nav.innerHTML=stages.map(([id,title])=>'<a href="#'+id+'">'+title+'</a>').join('');
 let foldIndex=0,folded=false,question=0,turning=false;
 function setPattern(){const id=location.hash.slice(1);window.potteryLessonView={chapter:id,mode:id==='observe'?'original':'teaching',motifId:motifs[id==='fold'?foldIndex:question]?.id,folded:id==='fold'&&folded,showAxis:id==='fold'};document.dispatchEvent(new Event('pottery:pattern'))}
 function route(){let id=location.hash.slice(1)||'home';if(!document.getElementById(id)?.matches('section.book'))id='home';for(const section of main.querySelectorAll('section.book'))section.hidden=section.id!==id;for(const link of nav.children)link.setAttribute('aria-current',String(link.hash==='#'+id));if(id==='report')renderReport();setPattern();document.dispatchEvent(new CustomEvent('lesson:route',{detail:{id}}));}
 window.lesson={route,setPattern};
 addEventListener('hashchange',route);
 function clonePage(face){
  const wrapper=document.createElement('div');wrapper.className='page';wrapper.style.padding='0';
  const shadow=wrapper.attachShadow({mode:'open'}),style=document.createElement('style');
  style.textContent=[...document.styleSheets].map(sheet=>{try{return [...sheet.cssRules].map(rule=>rule.cssText).join('\n')}catch{return ''}}).join('\n')+'\n.page{width:100%;height:100%;margin:0;box-sizing:border-box}.page.left:has([data-model-slot]){height:100%}';
  const copy=face.cloneNode(true);copy.style.height='100%';
  copy.querySelectorAll('canvas').forEach(canvas=>{const original=face.querySelector('canvas');const image=new Image();image.src=window.potteryModel?.snapshot()||'';image.style.cssText='width:100%;height:'+original.clientHeight+'px;object-fit:contain;display:block';canvas.replaceWith(image)});
  shadow.append(style,copy);return wrapper;
 }
 window.lesson.clonePage=clonePage;
 document.addEventListener('click',async event=>{
  const link=event.target.closest('a[href^="#"]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey)return;
  const destination=document.getElementById(link.hash.slice(1));if(!destination?.matches('section.book'))return;
  event.preventDefault();event.stopImmediatePropagation();if(turning)return;
  const source=main.querySelector('section.book:not([hidden])');if(source===destination)return;
  if(destination.id==='report'&&Object.keys(learning.data.answers).length===13)learning.complete();
  const forward=stages.findIndex(s=>s[0]===destination.id)>stages.findIndex(s=>s[0]===source.id);
  const face=source.querySelector(forward?'.right':'.left'),stationary=source.querySelector(forward?'.left':'.right');
  const bounds=face.getBoundingClientRect(),parent=main.getBoundingClientRect(),stationaryBounds=stationary.getBoundingClientRect();
  const leaf=document.createElement('div');leaf.className='turning-leaf';leaf.inert=true;leaf.setAttribute('aria-hidden','true');
  leaf.style.top=(bounds.top-parent.top)+'px';leaf.style.setProperty('--leaf-left',(bounds.left-parent.left)+'px');leaf.style.setProperty('--leaf-width',bounds.width+'px');leaf.style.setProperty('--leaf-height',bounds.height+'px');leaf.style.setProperty('--hinge',forward?'left':'right');
  leaf.append(clonePage(face));
  const under=document.createElement('div');under.className='stationary-leaf';under.inert=true;under.setAttribute('aria-hidden','true');under.style.cssText='left:'+(stationaryBounds.left-parent.left)+'px;top:'+(stationaryBounds.top-parent.top)+'px;width:'+stationaryBounds.width+'px;height:'+stationaryBounds.height+'px';under.append(clonePage(stationary));
  const reduced=matchMedia('(prefers-reduced-motion: reduce), (max-width:760px)').matches;
  if(!reduced){main.append(under,leaf);turning=true;main.classList.add('page-turning')}
  history.pushState(null,'',link.hash);route();dispatchEvent(new Event('hashchange'));
  if(reduced)return;
  await window.potteryPatternReady;
  await new Promise(requestAnimationFrame);
  leaf.append(clonePage(destination.querySelector(forward?'.left':'.right')));
  try{await leaf.animate([{transform:'rotateY(0deg)'},{transform:'rotateY('+(forward?-180:180)+'deg)'}],{duration:850,easing:'cubic-bezier(.38,.08,.22,1)'}).finished}finally{under.remove();leaf.remove();turning=false;main.classList.remove('page-turning')}
 },true);
 topics.forEach(([label],i)=>{const button=document.createElement('button');button.textContent=label;button.onclick=()=>{document.querySelector('#topic-title').textContent=label;document.querySelector('#topic-body').textContent=topics[i][1]};document.querySelector('#topic-list').append(button)});
 document.querySelector('#topic-title').textContent=topics[0][0];document.querySelector('#topic-body').textContent=topics[0][1];
 const observation=[{id:'observe-mouth',label:'想看清器口的开口和内壁，切到哪个视图最合适？',options:['俯视','左视','只看主视'],expected:'俯视',explanation:'俯视从上往下看，能看清开口和内壁。'}, {id:'observe-motif',label:'想看清器物背面的装饰，应该怎样做？',options:['拖动器物转到背面','只看正面就够了'],expected:'拖动器物转到背面',explanation:'拖动器物，转到背面，才能观察另一面的装饰和造型。'}];
 for(const [index,q]of observation.entries()){
  const field=document.createElement('fieldset');field.className='observation-question';field.innerHTML='<legend>'+(index+1)+'. '+q.label+'</legend><div class="answer-options"></div><p role="status"></p>';
  const output=field.querySelector('p');
  for(const value of q.options){const button=document.createElement('button');button.textContent=value;button.onclick=()=>{const answer=learning.answer(q.id,'第二站',q.label,value,q.expected);update(answer)};field.querySelector('div').append(button)}
  function update(answer){for(const button of field.querySelectorAll('button')){button.disabled=true;button.classList.toggle('selected',button.textContent===answer.selected)}output.textContent=(answer.correct?'观察正确。':'再留意一下。')+q.explanation}
  if(learning.data.answers[q.id])update(learning.data.answers[q.id]);document.querySelector('#observation-questions').append(field);
 }
 function renderFold(){const motif=motifs[foldIndex],answer=learning.data.answers['fold-'+motif.id];document.querySelector('#fold-motif-name').textContent=motif.name;document.querySelector('#fold-question').textContent=motif.name+'沿中间竖线对折，两边能完全重合吗？';document.querySelector('#fold-answer').textContent=answer?(answer.correct?'你的判断正确。':'请再对照两条鱼。')+'点击验证，观察同一片纹样的折叠。':'先作出判断，再点击验证。';for(const id of ['fold-yes','fold-no'])document.getElementById(id).disabled=Boolean(answer);document.querySelector('#fold-button').textContent=folded?'展开纹样 · 贴回罐身':'取下纹样 · 对折验证';setPattern()}
 function selectFold(index){foldIndex=index;folded=false;renderFold()}
 document.querySelector('#equal-leaf').onclick=()=>selectFold(0);document.querySelector('#unequal-leaf').onclick=()=>selectFold(1);
 function answerFold(value){const motif=motifs[foldIndex];learning.answer('fold-'+motif.id,'第三站',motif.name+'能否沿中线对折重合',value,motif.symmetric);renderFold()}
 document.querySelector('#fold-yes').onclick=()=>answerFold(true);document.querySelector('#fold-no').onclick=()=>answerFold(false);
 document.querySelector('#fold-button').onclick=()=>{folded=!folded;renderFold();document.querySelector('#fold-answer').textContent=folded?motifs[foldIndex].explanation:'纹样已贴回罐身。可以换另一种鱼纹继续比较。'};
 function renderQuestion(){const motif=motifs[question],answer=learning.data.answers['challenge-'+motif.id];document.querySelector('#question-count').textContent='第 '+(question+1)+' 件 / 共6件';document.querySelector('#question-name').textContent=motif.name;document.querySelector('#feedback-title').textContent=answer?(answer.correct?'判断正确':'再比较纹样两边'):'先观察，再判断';document.querySelector('#feedback').textContent=answer?motif.explanation:'看的是罐身上的整片纹样，观察后再选择。';for(const id of ['answer-yes','answer-no'])document.getElementById(id).disabled=Boolean(answer);document.querySelector('#next-question').hidden=!answer||question===5;document.querySelector('#finish-lesson').hidden=!answer||question!==5;setPattern()}
 function answerQuestion(value){const motif=motifs[question];learning.answer('challenge-'+motif.id,'第四站',motif.name+'是否为轴对称图形',value,motif.symmetric);renderQuestion()}
 document.querySelector('#answer-yes').onclick=()=>answerQuestion(true);document.querySelector('#answer-no').onclick=()=>answerQuestion(false);document.querySelector('#next-question').onclick=()=>{question++;renderQuestion()};
 const escapeHTML=text=>String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const display=value=>typeof value==='boolean'?(value?'能重合 / 是':'不能重合 / 不是'):value;
 function renderReport(){const summary=learning.summary();let evaluation='继续完成观察和纹样判断，报告会自动更新。';if(summary.answered===13)evaluation=summary.accuracy>=90?'你能把器物观察、对折验证和生活中的图形联系起来，已经掌握对折重合的方法。':summary.accuracy>=70?'你已经有了判断方法，再看看错题中纹样的大小、位置和转折方向。':'建议回到第三站，用两种鱼纹再做一次对折比较，逐步找到判断依据。';document.querySelector('#report-summary').innerHTML='<div class="report-score"><strong>'+(summary.accuracy===null?'—':summary.accuracy+'%')+'</strong><span>首次作答正确率</span></div><p>已答 '+summary.answered+' / 13 题 · 正确 '+summary.correct+' 题 · 与小陶完成 '+summary.dialogues+' 轮问答</p><p class="prompt">'+evaluation+'</p>'+(summary.answered<13?'<p>还有 '+(13-summary.answered)+' 题未作答。未答题未计入正确率。</p>':'');document.querySelector('#report-review').innerHTML=Object.values(learning.data.answers).map(a=>'<details><summary>'+(a.correct?'✓ ':'○ ')+escapeHTML(a.chapter+' · '+a.label)+'</summary><p>我的首次选择：'+escapeHTML(display(a.selected))+'</p><p>正确判断：'+escapeHTML(display(a.expected))+'</p></details>').join('')||'<p>练习记录会显示在这里。</p>';document.querySelector('#report-dialogues').innerHTML=learning.data.chats.map(c=>'<article class="report-chat"><p><b>我问</b> '+escapeHTML(c.question)+'</p><p><b>小陶</b> '+escapeHTML(c.status==='complete'?c.answer:c.status==='failed'?'这次未完成回答，可回第一站重试。':'这次对话尚未完成。')+'</p></article>').join('')||'<p>本次还没有向小陶提问。你可以回第一站问一个关于黑陶的问题。</p>';document.querySelector('#storage-status').textContent=learning.saved?'记录保存在当前设备，可下载报告。开始新一轮会清空本轮记录，请先保存。':'设备未能保存记录，请及时下载报告。';}
 document.querySelector('#download-report').onclick=()=>{renderReport();const content='<!doctype html><meta charset="utf-8"><title>黑陶学习报告</title><style>body{max-width:850px;margin:40px auto;padding:20px;font:16px/1.8 sans-serif}details{border-bottom:1px solid #ccc}details>p{margin-left:20px}.report-score strong{font-size:42px}.report-chat{border-bottom:1px solid #ddd}button{display:none}</style><h1>我的黑陶学习报告</h1><p>开始时间 '+escapeHTML(new Date(learning.data.startedAt).toLocaleString('zh-CN'))+'</p>'+document.querySelector('#report-summary').innerHTML+'<h2>练习记录</h2>'+document.querySelector('#report-review').innerHTML.replaceAll('<details>','<details open>')+'<h2>与小陶的问答记录</h2>'+document.querySelector('#report-dialogues').innerHTML;const url=URL.createObjectURL(new Blob([content],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='黑陶学习报告.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 document.querySelector('#new-session').onclick=()=>{learning.reset();location.hash='learn';location.reload()};
 document.addEventListener('learning:change',()=>{if(location.hash==='#report')renderReport()});
 renderFold();renderQuestion();route();
})();
