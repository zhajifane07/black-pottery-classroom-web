/* A small adapter for the packaged Android container. It is inert in an ordinary browser. */
(() => {
 if(!window.PotteryAndroid)return;
 const bridge=window.PotteryAndroid,callbacks=new Map(),browserFetch=window.fetch.bind(window);
 function call(method,args=[],timeout=85000){
  return new Promise((resolve,reject)=>{
   const id=crypto.randomUUID(),timer=setTimeout(()=>{callbacks.delete(id);reject(Error('操作超时，请重试。'));},timeout);
   callbacks.set(id,{resolve,reject,timer});
   try{bridge[method](id,...args);}catch(error){clearTimeout(timer);callbacks.delete(id);reject(error);}
  });
 }
 window.potteryNativeResult=(id,result)=>{const callback=callbacks.get(id);if(!callback)return;clearTimeout(callback.timer);callbacks.delete(id);if(result.error)callback.reject(Error(result.error));else callback.resolve(result);};
 function encode(bytes){let text='';for(let i=0;i<bytes.length;i+=16384)text+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(text);}
 function decode(text){const binary=atob(text),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;}
 window.fetch=async(input,options)=>{
  const request=new Request(input,options),url=new URL(request.url);
  if(url.origin!==(window.POTTERY_API_ORIGIN||'https://x4z73zf4sp.coze.site')||!url.pathname.startsWith('/api/'))return browserFetch(input,options);
  if(request.signal.aborted)throw new DOMException('Aborted','AbortError');
  const body=request.method==='GET'?'':encode(new Uint8Array(await request.arrayBuffer()));
  const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');
  const response=await call('request',[JSON.stringify({path:url.pathname,method:request.method,body,token,recordingId:request.headers.get('X-Pottery-Recording')||''})]);
  if(request.signal.aborted)throw new DOMException('Aborted','AbortError');
  return new Response(decode(response.body),{status:response.status,headers:{'Content-Type':response.contentType||'application/json'}});
 };
 window.potteryNativeRecord={start:()=>call('startRecording',[],120000),stop:cancel=>call('stopRecording',[Boolean(cancel)],10000)};
 window.potteryNativeSaveReport=(name,html)=>call('saveReport',[name,html],600000);
 window.potteryHandleBack=()=>{
  const dialog=document.querySelector('dialog[open]');if(dialog){dialog.close();return true;}
  if(document.querySelector('.turning-leaf')||document.body.classList.contains('opening'))return true;
  if(document.body.classList.contains('closed'))return false;
  const stages=['learn','observe','fold','challenge','report'],at=stages.indexOf(location.hash.slice(1));
  if(at>0)document.querySelector('nav a[href="#'+stages[at-1]+'"]').click();else document.querySelector('.close-book')?.click();
  return true;
 };
 document.addEventListener('pottery:pause',()=>document.dispatchEvent(new Event('bookclosed')));
})();
