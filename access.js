/* Anonymous classroom sessions. No code or API secret is embedded in the client. */
(() => {
 const apiOrigin=window.POTTERY_API_ORIGIN||'';
 const storageKey='pottery-cloud-session:'+apiOrigin;
 let sessionToken='',pending;
 try{sessionToken=sessionStorage.getItem(storageKey)||'';}catch{}
 const apiURL=input=>new URL(input,apiOrigin||location.href);
 function withSession(request){const headers=new Headers(request.headers);if(sessionToken)headers.set('Authorization','Bearer '+sessionToken);return new Request(request,{headers});}
 async function connect(){
  const response=await fetch(apiURL('/api/session'),{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)});
  const data=await response.json();if(!response.ok||!data.sessionToken)throw Error(data.error||'课堂连接暂未完成，请重试');
  sessionToken=data.sessionToken;try{sessionStorage.setItem(storageKey,sessionToken);}catch{}
 }
 function ensureSession(){if(!pending)pending=connect().finally(()=>pending=undefined);return pending;}
 window.classroomFetch=async(input,options)=>{
  const request=new Request(apiURL(input),options),path=new URL(request.url).pathname;
  if(path!=='/api/status'&&path!=='/api/session'&&!sessionToken)await ensureSession();
  let response=await fetch(withSession(request.clone()));if(response.status!==401)return response;
  const data=await response.clone().json().catch(()=>({}));
  if(!['SESSION_REQUIRED','CLASSROOM_ACCESS_REQUIRED'].includes(data.code))return response;
  sessionToken='';await ensureSession();return fetch(withSession(request.clone()));
 };
})();
