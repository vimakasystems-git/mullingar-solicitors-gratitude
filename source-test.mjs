import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './dist/worker.mjs';
import {sourceSite} from './source-pages.mjs';
test('all imported pages, source links and original aliases resolve without executable source markup',async()=>{
 assert.equal(sourceSite.pages.filter(p=>p.type==='pages').length,26);
 assert.equal(sourceSite.pages.filter(p=>p.type==='posts').length,15);
 const routes=new Set(sourceSite.pages.map(p=>'/en-IE'+p.path));
 for(const p of sourceSite.pages){
  assert.doesNotMatch(p.body,/<(?:script|iframe|form|style)\b|\son\w+=|javascript:/i);
  const response=await worker.fetch(new Request('https://example.test/en-IE'+p.path));assert.equal(response.status,200,p.path);
  for(const [,link] of p.body.matchAll(/href="(\/en-IE[^"#]*)(?:#[^"]*)?"/g))assert.ok(routes.has(link),p.path+' -> '+link);
 }
 const about=sourceSite.pages.find(p=>p.path==='/about-us/');assert.match(about.body,/id="partners"/);assert.match(about.body,/id="team"/);
 const alias=await worker.fetch(new Request('https://example.test/private-services/family-law-solicitors/'));assert.equal(alias.headers.get('Location'),'/en-IE/private-services/family-law-solicitors/');
 assert.equal((await worker.fetch(new Request('https://example.test/category/uncategorized/'))).status,302);
 assert.equal((await worker.fetch(new Request('https://example.test/en-IE/blog-articles/'))).status,200);
 assert.equal((await worker.fetch(new Request('https://example.test/source-image/arbitrary'))).status,404);
});
