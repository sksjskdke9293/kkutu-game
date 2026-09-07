const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const sandbox={module:{exports:{}},console,Buffer,URL,process:{env:{}},setInterval:()=>({unref(){}}),require:n=>{
 if(n==='pg')return {Pool:class{query(){return Promise.resolve({rows:[]});}}};
 if(n==='express-session')return {Store:class{}};
 if(n.includes('global.json'))return {};
 if(n==='fs')return {existsSync:()=>false};
 return require(n);
}};
vm.runInNewContext(fs.readFileSync('Server/lib/Web/local-auth.js','utf8'),sandbox);
(async()=>{
 const a=sandbox.module.exports;
 assert(a.validUsername('player_123'));assert(!a.validUsername("x' OR true--"));
 assert(a.validNickname('낱말친구'));assert(!a.validNickname('모레미'));assert(!a.validNickname('<img>'));assert(!a.validNickname('관리자'));
 assert.equal(a.safeNext('//evil.example'), '/?server=0');assert.equal(a.safeNext('/?server=1'), '/?server=1');
 const password=crypto.randomBytes(18).toString('hex'),failedPassword=`${crypto.randomBytes(18).toString('hex')}-invalid`;
 const hash=await a.passwordHash(password);assert(!hash.includes(password));
 assert(await a.verify(password,hash));assert(!(await a.verify(failedPassword,hash)));
 assert.notEqual(hash,await a.passwordHash(password));
 console.log('PASS: salted password hashes, rejected login, nickname reservations and redirect restrictions');
})().catch(e=>{console.error(e);process.exit(1);});
