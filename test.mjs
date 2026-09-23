import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './dist/worker.mjs';
import {content,languages} from './content.mjs';
test('all translated routes render complete content with valid internal links and privacy headers',async()=>{
 for(const lang of Object.keys(languages)){
  const response=await worker.fetch(new Request('https://example.test/'+lang+'/'));
  assert.equal(response.status,200);
  assert.match(response.headers.get('Content-Security-Policy'),/form-action 'none'/);
  const html=await response.text();
  assert.ok(html.includes('<html lang="'+lang+'">'));
  assert.ok(html.includes(content[lang].thanks));
  assert.ok(html.includes('tel:+353449348312'));
  assert.equal((html.match(/<article class="service">/g)||[]).length,7);
  for(const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes('id="'+anchor+'"'),anchor);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(!html.includes('<script'));
 }
});
test('unsupported routes and methods fail closed; HEAD and default-language redirect work',async()=>{
 assert.equal((await worker.fetch(new Request('https://example.test/missing'))).status,404);
 assert.equal((await worker.fetch(new Request('https://example.test/en-IE/',{method:'POST'}))).status,405);
 assert.equal((await worker.fetch(new Request('https://example.test/'))).headers.get('Location'),'/en-IE/');
 assert.equal(await (await worker.fetch(new Request('https://example.test/en-IE/',{method:'HEAD'}))).text(),'');
});
