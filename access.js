(() => {
 let pending;
 const apiOrigin=window.POTTERY_API_ORIGIN||'';
 const storageKey='pottery-cloud-session:'+apiOrigin;
 let sessionToken='';
 try{sessionToken=sessionStorage.getItem(storageKey)||'';}catch{}
 const apiURL=input=>new URL(input,apiOrigin||location.href);
 function withSession(request){const headers=new Headers(request.headers);if(apiOrigin&&sessionToken)headers.set('Authorization','Bearer '+sessionToken);return new Request(request,{headers});}
 async function unlock(){
  const dialog=document.createElement('dialog');dialog.className='classroom-access';
  dialog.innerHTML='<form><p class="eyebrow">雄州黑陶课堂</p><h2>输入课堂码</h2><p>请向老师领取课堂码，开启小陶语音问答。</p><label for="classroom-code">课堂码</label><input id="classroom-code" type="password" autocomplete="off" required maxlength="80"><p class="access-message" role="status"></p><div class="controls"><button type="button" class="cancel-access">稍后提问</button><button class="ink" type="submit">开启问答</button></div></form>';
  document.body.append(dialog);dialog.showModal();
  return new Promise(resolve=>{
   function finish(value){dialog.close();dialog.remove();resolve(value);}
   dialog.querySelector('.cancel-access').onclick=()=>finish(false);
   dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false);});
   dialog.querySelector('form').onsubmit=async event=>{
    event.preventDefault();const button=dialog.querySelector('button[type="submit"]');button.disabled=true;
    try{const response=await fetch(apiURL('/api/session'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:dialog.querySelector('input').value})});const data=await response.json();if(!response.ok)throw Error(data.error);if(data.sessionToken){sessionToken=data.sessionToken;try{sessionStorage.setItem(storageKey,sessionToken);}catch{}}finish(true);}catch(error){dialog.querySelector('.access-message').textContent=error.message;}finally{button.disabled=false;}
   };
  });
 }
 window.classroomFetch=async(input,options)=>{
  const request=new Request(apiURL(input),options);
  let response=await fetch(withSession(request.clone()));
  if(response.status!==401)return response;
  const data=await response.clone().json().catch(()=>({}));
  if(data.code!=='CLASSROOM_ACCESS_REQUIRED')return response;
  if(!pending)pending=unlock().finally(()=>pending=undefined);
  if(await pending)response=await fetch(withSession(request.clone()));
  return response;
 };
})();
