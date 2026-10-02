import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
const valid={nombre:'Prueba',email:'test@example.com',marca:'',area:'',reto:'Consulta de prueba',consent:true,website:'',requestId:'f9294e24-3bf1-4f83-b233-4fc1a8ee31be'};
const invoke=async(overrides={},request={})=>{let code,result;const res={setHeader(){},status(n){code=n;return this;},json(v){result=v;return this;}};await handler({method:'POST',headers:{origin:'https://example.com','content-type':'application/json'},body:{...valid,...overrides},...request},res);return {code,result};};
test('contact validates consent and content and handles provider outcomes',async()=>{
 const original={...process.env};const realFetch=global.fetch;let sent;
 try{
  Object.assign(process.env,{RESEND_API_KEY:'test-only',CONTACT_TO:'owner@example.com',CONTACT_FROM:'sender@example.com',SITE_ORIGIN:'https://example.com',LEGAL_READY:'false'});
  global.fetch=async(_url,options)=>{sent=JSON.parse(options.body);return{ok:true,json:async()=>({id:'mock-id'})};};
  assert.equal((await invoke()).code,503);process.env.LEGAL_READY='true';
  assert.equal((await invoke({consent:false})).code,400);
  assert.equal((await invoke({email:'test@example.com\nBcc:spam@example.com'})).code,400);
  assert.equal((await invoke({website:'bot'})).code,400);
  assert.equal((await invoke({reto:'a'.repeat(3001)})).code,400);
  assert.equal((await invoke({},{headers:{origin:'https://evil.example','content-type':'application/json'}})).code,403);
  assert.equal((await invoke({},{method:'GET'})).code,405);
  assert.equal((await invoke({},{body:'{broken'})).code,400);
  assert.equal((await invoke({},{headers:{origin:'https://example.com','content-type':'text/plain'}})).code,415);
  assert.equal(sent,undefined);
  assert.equal((await invoke()).code,200);assert.deepEqual(sent.to,['owner@example.com']);assert.equal(sent.reply_to,'test@example.com');assert.equal(sent.html,undefined);assert.ok(sent.text.includes('Consentimiento afirmativo'));
  global.fetch=async()=>({ok:false,json:async()=>({message:'private error'})});assert.equal((await invoke()).code,502);
  global.fetch=async()=>{throw new Error('timeout');};assert.equal((await invoke()).code,502);
 }finally{global.fetch=realFetch;for(const k of Object.keys(process.env))if(!(k in original))delete process.env[k];Object.assign(process.env,original);}
});
