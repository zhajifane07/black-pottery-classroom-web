(() => {
 const key='pottery-learning-v2';
 const fresh=()=>({version:2,id:crypto.randomUUID(),startedAt:new Date().toISOString(),answers:{},chats:[],completedAt:null});
 let data;
 try{data=JSON.parse(localStorage.getItem(key));if(data?.version!==2||!data.answers||!Array.isArray(data.chats))data=fresh()}catch{data=fresh()}
 let saved=true;
 function persist(){try{localStorage.setItem(key,JSON.stringify(data));saved=true}catch{saved=false}document.dispatchEvent(new Event('learning:change'))}
 window.learning={
  get data(){return data},get saved(){return saved},
  answer(id,chapter,label,selected,expected){if(data.answers[id])return data.answers[id];const item={id,chapter,label,selected,expected,correct:selected===expected,time:new Date().toISOString()};data.answers[id]=item;persist();return item},
  startChat(question){const item={id:crypto.randomUUID(),question,answer:'',status:'pending',time:new Date().toISOString()};data.chats.push(item);persist();return item.id},
  finishChat(id,answer,error=''){const item=data.chats.find(c=>c.id===id);if(item){item.answer=answer;item.status=error?'failed':'complete';item.error=error;persist()}},
  complete(){data.completedAt=data.completedAt||new Date().toISOString();persist()},
  reset(){data=fresh();persist()},
  summary(){const answers=Object.values(data.answers);const correct=answers.filter(a=>a.correct).length;return {answered:answers.length,correct,accuracy:answers.length?Math.round(correct/answers.length*100):null,total:10,dialogues:data.chats.filter(c=>c.status==='complete').length}}
 };
})();
