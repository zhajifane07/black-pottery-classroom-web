(() => {
 const panel=document.querySelector('#voice-panel');
 panel.innerHTML='<div class="voice-heading"><span class="seal-small">问</span><div><h3>问问小陶</h3><p>聊一聊雄州黑陶的故事</p></div><span id="connection">正在连接</span></div><div id="dialogue" aria-live="polite"><p class="assistant-message">你好，我是小陶。你想知道黑陶为什么是黑色的吗？</p></div><form id="ask-form"><label class="sr-only" for="question-input">你的问题</label><input id="question-input" maxlength="600" placeholder="输入问题，或点击录音" autocomplete="off"><button class="ink" id="send" type="submit">发送</button></form><div class="voice-actions"><button id="record" type="button">● 点击录音</button><button id="replay" type="button" disabled>重听回答</button><button id="stop-audio" type="button">停止播报</button></div><p id="voice-status" role="status">录音只在你点击后开始。</p>';
 const input=document.querySelector('#question-input'),status=document.querySelector('#voice-status'),record=document.querySelector('#record'),send=document.querySelector('#send');
 let busy=false,recorder=null,audio=null,audioUrl=null,lastAnswer='',controller=null,playbackVersion=0;
 function message(text,kind){const p=document.createElement('p');p.className=kind+'-message';p.textContent=text;document.querySelector('#dialogue').append(p);p.scrollIntoView({block:'nearest',behavior:'smooth'})}
 async function api(url,data){const response=await (window.classroomFetch||fetch)(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller?.signal});if(!response.ok){const d=await response.json();throw Error(d.error)}return response}
 function stop(){playbackVersion++;if(audio){audio.pause();audio=null}if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null}}
 async function speak(text){stop();const version=playbackVersion;status.textContent='小陶正在准备语音…';const response=await api('/api/speech',{text});const blob=await response.blob();if(version!==playbackVersion||document.body.classList.contains('closed'))return;audioUrl=URL.createObjectURL(blob);audio=new Audio(audioUrl);audio.onended=()=>status.textContent='回答结束，可以继续提问。';audio.onerror=()=>status.textContent='语音未能播放，可以阅读回答或点击重听。';try{await audio.play();status.textContent='小陶正在回答…'}catch{status.textContent='点击“重听回答”播放语音。'}}
 function setBusy(value){busy=value;send.disabled=value;record.disabled=value;input.disabled=value}
 async function ask(question){if(busy||!question.trim()||document.body.classList.contains('closed')||location.hash!=='#learn')return;setBusy(true);stop();controller=new AbortController();message(question,'user');const chatId=learning.startChat(question);status.textContent='小陶正在思考…';try{const response=await api('/api/ask',{question});const result=await response.json();lastAnswer=result.answer;learning.finishChat(chatId,lastAnswer);message(lastAnswer,'assistant');document.querySelector('#replay').disabled=false;await speak(lastAnswer)}catch(error){if(!learning.data.chats.find(c=>c.id===chatId)?.answer)learning.finishChat(chatId,'',error.message);status.textContent='连接未完成。'+error.message+'，可以重新发送。'}finally{setBusy(false)}}
 document.querySelector('#ask-form').onsubmit=e=>{e.preventDefault();const question=input.value.trim();if(question&&!busy){input.value='';ask(question)}};
 document.querySelector('#replay').onclick=()=>{if(!busy&&lastAnswer)speak(lastAnswer).catch(e=>status.textContent=e.message)};
 document.querySelector('#stop-audio').onclick=()=>{stop();status.textContent='已停止播报。'};
 document.querySelector('#listen').onclick=()=>{speak(document.querySelector('#topic-body').textContent).catch(e=>status.textContent=e.message)};
 async function startRecording(){
  if(!navigator.mediaDevices?.getUserMedia)throw Error('请通过本机服务或 HTTPS 打开页面以使用麦克风');
  stop();const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,channelCount:1}});
  const context=new AudioContext();await context.resume();const source=context.createMediaStreamSource(stream),processor=context.createScriptProcessor(4096,1,1),silence=context.createGain();silence.gain.value=0;
  const parts=[];processor.onaudioprocess=e=>parts.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  source.connect(processor);processor.connect(silence);silence.connect(context.destination);
  const timer=setTimeout(()=>finishRecording(),30000);
  recorder={stream,context,source,processor,silence,parts,timer};record.textContent='■ 说完了，发送';status.textContent='正在录音，最长30秒。点击按钮结束。';
 }
 async function finishRecording(cancel=false){
  if(!recorder)return;const r=recorder;recorder=null;clearTimeout(r.timer);r.processor.onaudioprocess=null;r.source.disconnect();r.processor.disconnect();r.silence.disconnect();r.stream.getTracks().forEach(t=>t.stop());await r.context.close();record.textContent='● 点击录音';
  if(cancel){status.textContent='录音已取消。';return}
  const length=r.parts.reduce((n,p)=>n+p.length,0);if(length<r.context.sampleRate*.3){status.textContent='录音太短，请再说一次。';return}
  const wav=new ArrayBuffer(44+length*2),view=new DataView(wav);const write=(offset,text)=>[...text].forEach((ch,i)=>view.setUint8(offset+i,ch.charCodeAt(0)));
  write(0,'RIFF');view.setUint32(4,36+length*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,r.context.sampleRate,true);view.setUint32(28,r.context.sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,length*2,true);let offset=44;
  for(const part of r.parts)for(const sample of part){const v=Math.max(-1,Math.min(1,sample));view.setInt16(offset,v<0?v*32768:v*32767,true);offset+=2}
  setBusy(true);status.textContent='正在识别你的话…';
  try{const response=await (window.classroomFetch||fetch)('/api/transcribe',{method:'POST',headers:{'Content-Type':'audio/wav'},body:wav});const data=await response.json();if(!response.ok)throw Error(data.error);setBusy(false);await ask(data.text)}catch(e){status.textContent='录音识别失败。'+e.message}finally{setBusy(false)}
 }
 record.onclick=()=>{if(recorder){finishRecording();return}if(!busy){record.disabled=true;startRecording().catch(e=>status.textContent='无法开始录音。'+e.message).finally(()=>record.disabled=false)}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&recorder)finishRecording(true)});
 addEventListener('hashchange',()=>{stop();if(recorder)finishRecording(true)});
 document.addEventListener('bookclosed',()=>{stop();controller?.abort();if(recorder)finishRecording(true)});
 for(const item of learning.data.chats){message(item.question,'user');if(item.answer){message(item.answer,'assistant');lastAnswer=item.answer}}
 document.querySelector('#replay').disabled=!lastAnswer;
 (window.classroomFetch||fetch)('/api/status').then(r=>r.json()).then(d=>document.querySelector('#connection').textContent=d.ready?'扣子已连接':'连接待确认').catch(()=>document.querySelector('#connection').textContent='请启动本机服务');
})();
