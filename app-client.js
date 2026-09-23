const lang=document.documentElement.lang,c=copy[lang]||copy['en-IE'];
const $=id=>document.getElementById(id);
let messages=[],busy=false,requestController=null,sessionVersion=0;
function bubble(role,text){const el=document.createElement('div');el.className='bubble '+role;el.textContent=text;$('messages').append(el);el.scrollIntoView({block:'nearest',behavior:'instant'});}
function controls(){ $('send-message').disabled=busy;$('prepare-summary').disabled=busy||!messages.some(m=>m.role==='user');$('message').disabled=busy; }
$('ai-consent').addEventListener('change',()=>{$('start-chat').disabled=!$('ai-consent').checked;});
$('start-chat').addEventListener('click',()=>{if(!$('ai-consent').checked)return;$('consent-panel').hidden=true;$('conversation').hidden=false;$('clear-chat').hidden=false;bubble('assistant',c.empty);$('message').focus();});
async function ask(mode){
 if(busy||!$('ai-consent').checked)return;
 const text=$('message').value.trim();
 if(mode==='chat'&&!text)return;
 if(mode==='chat'&&messages.length>=24){$('chat-status').textContent=c.limit;return;}
 const pending=mode==='chat'?[...messages,{role:'user',content:text}]:messages;
 if(!pending.length)return;
 busy=true;controls();$('chat-status').textContent=c.thinking;
 requestController=new AbortController();const version=sessionVersion;
 const timeout=setTimeout(()=>requestController?.abort(),45000);
 try{
  const response=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,lang,mode,messages:pending}),signal:requestController.signal});
  if(!response.ok)throw new Error('Unavailable');
  const data=await response.json();if(version!==sessionVersion)return;
  if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Empty response');
  if(mode==='summary'){$('case-summary').value=data.reply;$('review').hidden=false;$('review-consent').checked=false;$('review').scrollIntoView({block:'start',behavior:'smooth'});$('case-summary').focus();}
  else {messages=[...pending,{role:'assistant',content:data.reply}];bubble('user',text);bubble('assistant',data.reply);$('message').value='';$('review').hidden=true;$('case-summary').value='';$('review-consent').checked=false;}
  $('chat-status').textContent='';
 }catch{if(version===sessionVersion)$('chat-status').textContent=c.error;}
 finally{clearTimeout(timeout);if(version===sessionVersion){busy=false;controls();if(mode==='chat')$('message').focus();}}
}
$('chat-form').addEventListener('submit',e=>{e.preventDefault();ask('chat');});
$('prepare-summary').addEventListener('click',()=>ask('summary'));
function enquiry(){return `Enquiry prepared using an independent AI website proposal. Please verify all facts.\n\nName: ${$('client-name').value.trim()}\nEmail: ${$('client-email').value.trim()}\nTelephone: ${$('client-phone').value.trim()||'Not provided'}\nPreferred language: ${lang}\n\n${$('case-summary').value.trim()}\n\nNo appointment or engagement has been confirmed.`;}
$('review-form').addEventListener('submit',e=>{e.preventDefault();if(!$('review-form').reportValidity())return;const uri='mailto:reception@ndsol.ie?subject='+encodeURIComponent('New enquiry — request for solicitor review')+'&body='+encodeURIComponent(enquiry());const a=document.createElement('a');a.href=uri;a.click();$('chat-status').textContent=c.sent;});
$('download-summary').addEventListener('click',()=>{if(!$('review-form').reportValidity())return;const url=URL.createObjectURL(new Blob([enquiry()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='solicitor-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('clear-chat').addEventListener('click',()=>{sessionVersion++;requestController?.abort();messages=[];busy=false;$('messages').replaceChildren();$('message').value='';$('review-form').reset();$('review').hidden=true;$('conversation').hidden=true;$('consent-panel').hidden=false;$('ai-consent').checked=false;$('start-chat').disabled=true;$('clear-chat').hidden=true;$('chat-status').textContent='';controls();$('ai-consent').focus();});
// Animate the original murmuration with a continuous mesh displacement.
// The horizon remains still; the flock and its reflection gently flow independently.
const canvas=$('bird-canvas'),ctx=canvas.getContext('2d'),photo=canvas.parentElement.querySelector('img'),toggle=$('motion-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let playing=!reduced.matches,visible=true,frame=0,last=0,elapsed=0;
function size(){const r=canvas.parentElement.getBoundingClientRect();canvas.width=Math.min(1200,Math.round(r.width));canvas.height=Math.round(canvas.width*r.height/r.width);}
function paint(time){
 if(!photo.naturalWidth||!canvas.width)return;
 const W=canvas.width,H=canvas.height,iw=photo.naturalWidth,ih=photo.naturalHeight;
 const scale=Math.max(W/iw,H/ih)*1.1,sw=W/scale,sh=H/scale,sx=(iw-sw)/2,sy=(ih-sh)/2;
 ctx.clearRect(0,0,W,H);
 const phase=time/1000;
 for(let y=0;y<H;y+=3){const sourceY=sy+y/scale;const n=sourceY/ih;
  const flock=Math.exp(-Math.pow((n-.46)/.15,4)),reflection=Math.exp(-Math.pow((n-.82)/.12,4))*.38;
  const dx=(Math.sin(phase*.48+n*7)*14+Math.sin(phase*.9+n*24)*4)*(flock+reflection);
  const dy=Math.sin(phase*.58+n*9)*2*flock;
  ctx.drawImage(photo,sx+dx,sourceY+dy,sw,Math.min(4,H-y)/scale,0,y,W,Math.min(4,H-y));
 }
}
function tick(now){frame=0;if(!playing||!visible||document.hidden){last=0;return;}if(!last)last=now;if(now-last>=32){elapsed+=Math.min(now-last,80);last=now;paint(elapsed);}frame=requestAnimationFrame(tick);}
function update(){cancelAnimationFrame(frame);last=0;toggle.textContent=playing?c.pause:c.play;toggle.setAttribute('aria-pressed',String(!playing));if(playing&&visible&&!document.hidden)frame=requestAnimationFrame(tick);else paint(elapsed);}
function init(){if(!ctx)return;size();paint(0);canvas.parentElement.classList.add('motion-ready');toggle.hidden=false;update();}
if(photo.complete&&photo.naturalWidth)init();else photo.addEventListener('load',init,{once:true});
toggle.addEventListener('click',()=>{playing=!playing;update();});
reduced.addEventListener('change',()=>{playing=!reduced.matches;update();});
new ResizeObserver(()=>{size();paint(elapsed);}).observe(canvas.parentElement);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();}).observe(canvas);
document.addEventListener('visibilitychange',update);
// A small flock follows mouse movement without replacing the accessible pointer.
const finePointer=matchMedia('(pointer: fine)'),trail=document.createElement('canvas');
trail.className='cursor-flock';trail.setAttribute('aria-hidden','true');document.body.append(trail);
const flockContext=trail.getContext('2d');let birds=[],flockFrame=0,pointerTime=0;
function flockSize(){const ratio=Math.min(devicePixelRatio||1,2);trail.width=Math.round(innerWidth*ratio);trail.height=Math.round(innerHeight*ratio);flockContext.setTransform(ratio,0,0,ratio,0,0);}
function stopFlock(){cancelAnimationFrame(flockFrame);flockFrame=0;birds=[];flockContext.clearRect(0,0,innerWidth,innerHeight);}
function fly(now){flockFrame=0;if(!playing||reduced.matches||document.hidden||!finePointer.matches){stopFlock();return;}flockContext.clearRect(0,0,innerWidth,innerHeight);birds=birds.filter(b=>now-b.born<1000);for(const b of birds){const age=(now-b.born)/1000,x=b.x+b.vx*age,y=b.y-38*age+Math.sin(age*5+b.phase)*5,wing=Math.sin(age*21+b.phase)*5;flockContext.save();flockContext.translate(x,y);flockContext.rotate(b.tilt);flockContext.globalAlpha=(1-age)*.75;flockContext.lineWidth=1.5;flockContext.lineCap='round';flockContext.strokeStyle=b.accent?'#DA1212':'#041562';flockContext.beginPath();flockContext.moveTo(-8,-wing);flockContext.quadraticCurveTo(-3,-3,0,2);flockContext.quadraticCurveTo(3,-3,8,-wing);flockContext.stroke();flockContext.restore();}if(birds.length)flockFrame=requestAnimationFrame(fly);}
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!finePointer.matches||reduced.matches||!playing||document.hidden)return;const now=performance.now();if(now-pointerTime<65)return;pointerTime=now;const target=e.target;if(target.closest('input,textarea,button,a,select,summary,[contenteditable]'))return;birds.push({x:e.clientX-18,y:e.clientY-12,vx:-22-Math.random()*26,phase:Math.random()*6,tilt:-.2,accent:Math.random()<.15,born:now});if(birds.length>18)birds.shift();if(!flockFrame)flockFrame=requestAnimationFrame(fly);},{passive:true});
window.addEventListener('resize',()=>{flockSize();stopFlock();},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFlock();});document.documentElement.addEventListener('pointerleave',stopFlock);reduced.addEventListener('change',stopFlock);toggle.addEventListener('click',()=>{if(!playing)stopFlock();});flockSize();
new IntersectionObserver(entries=>{document.querySelector('.assistant-shortcut').hidden=entries[0].isIntersecting;}).observe($('assistant'));
