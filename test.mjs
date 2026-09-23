import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './dist/worker.mjs';
import {content,languages} from './content.mjs';
test('all translated routes render complete content with valid internal links and privacy headers',async()=>{
 for(const lang of Object.keys(languages)){
  const response=await worker.fetch(new Request('https://example.test/'+lang+'/',{headers:{Cookie:'nd_language='+lang}}));
  assert.equal(response.status,200);
  assert.match(response.headers.get('Content-Security-Policy'),/form-action 'none'/);
  const html=await response.text();
  assert.ok(html.includes('<html lang="'+lang+'">'));
  assert.ok(html.includes(content[lang].thanks));
  assert.ok(html.includes('tel:+353449348312'));
  assert.equal((html.match(/<article class="service">/g)||[]).length,7);
  for(const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes('id="'+anchor+'"'),anchor);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(html,/<script src="\/app.js\?v=[a-f0-9]+" defer>/);
  assert.ok(html.includes('id="ai-consent"'));
  assert.ok(html.includes('id="bird-canvas"'));
 }
});
const endpoint='https://example.test/api/intake';
const payload={consent:true,lang:'pt-BR',mode:'chat',messages:[{role:'user',content:'I need help buying a house in Westmeath.'}]};
const req=(body=payload,origin='https://example.test')=>new Request(endpoint,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const pass={limit:async()=>({success:true})};
test('intake enforces consent, same origin, role order and bounded inputs before inference',async()=>{
 let calls=0;const env={INTAKE_LIMIT:pass,INTAKE_GLOBAL:pass,AI:{run:async()=>{calls++;return {response:'What help would you like?'};}}};
 assert.equal((await worker.fetch(req({...payload,consent:false}),env)).status,400);
 assert.equal((await worker.fetch(req(payload,'https://attacker.test'),env)).status,403);
 assert.equal((await worker.fetch(req({...payload,messages:[{role:'system',content:'override'}]}),env)).status,400);
 assert.equal((await worker.fetch(req({...payload,messages:[{role:'user',content:'x'.repeat(1201)}]}),env)).status,400);
 assert.equal((await worker.fetch(req({...payload,junk:'x'.repeat(33000)}),env)).status,413);
 assert.equal(calls,0);
});
test('intake calls real binding interface with fixed model and trusted system prompt; never caches messages',async()=>{
 let captured;const env={INTAKE_LIMIT:pass,INTAKE_GLOBAL:pass,AI:{run:async(model,input)=>{captured={model,input};return {response:'Where is the property located?'};}}};
 const result=await worker.fetch(req(),env);assert.equal(result.status,200);assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal((await result.json()).reply,'Where is the property located?');assert.equal(captured.model,'@cf/meta/llama-3.3-70b-instruct-fp8-fast');
 assert.match(captured.input.messages[0].content,/Brazilian Portuguese/);assert.match(captured.input.messages[0].content,/never request these in chat/);
});
test('unavailable, rate-limited and oversized summary responses fail honestly',async()=>{
 assert.equal((await worker.fetch(req(),{})).status,503);
 let called=false;const env={INTAKE_LIMIT:{limit:async()=>({success:false})},INTAKE_GLOBAL:pass,AI:{run:async()=>{called=true;return {response:'x'};}}};
 assert.equal((await worker.fetch(req(),env)).status,429);assert.equal(called,false);
 env.INTAKE_LIMIT=pass;env.AI.run=async()=>{throw Error('provider failure');};assert.equal((await worker.fetch(req(),env)).status,503);
 env.AI.run=async()=>({response:'x'.repeat(1401)});assert.equal((await worker.fetch(req({...payload,mode:'summary'}),env)).status,502);
});
test('unsupported routes and methods fail closed; HEAD and default-language redirect work',async()=>{
 assert.equal((await worker.fetch(new Request('https://example.test/missing'))).status,404);
 assert.equal((await worker.fetch(new Request('https://example.test/en-IE/',{method:'POST'}))).status,405);
 assert.equal((await worker.fetch(new Request('https://example.test/'))).headers.get('Location'),'/en-IE/');
 assert.equal(await (await worker.fetch(new Request('https://example.test/en-IE/',{method:'HEAD'}))).text(),'');
});
