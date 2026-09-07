const assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=resolveTestOrigin();
function resolveTestOrigin(){
 const target=new URL(process.env.KKUTU_TEST_ORIGIN||'https://kkutugame.kro.kr');
 if(target.protocol!=='https:'&&target.protocol!=='http:')throw new Error('KKUTU_TEST_ORIGIN must use http or https');
 return target.origin;
}
class Client{
 constructor(){this.cookie='';this.csrf='';}
 async request(path,body,token=true){
  const r=await fetch(base+path,{method:body?'POST':'GET',redirect:'manual',headers:{cookie:this.cookie,...(body?{'Content-Type':'application/json',Origin:base,...(token?{'X-CSRF-Token':this.csrf}:{})}:{})},body:body?JSON.stringify(body):undefined});
  const cookie=r.headers.getSetCookie()[0];if(cookie)this.cookie=cookie.split(';')[0];
  const text=await r.text();let data;try{data=JSON.parse(text);}catch(_){data=text;}
  return {status:r.status,data};
 }
 async session(){const r=await this.request('/account/session');assert.equal(r.status,200);this.csrf=r.data.csrf;return r.data;}
}
async function gameProfile(client){
 const {data:html}=await client.request('/?server=0');
 const match=html.match(/id="URL">([^<]+)/);assert(match,'game socket URL exists');
 return new Promise((resolve,reject)=>{
  const ws=new WebSocket(match[1].replace(/&amp;/g,'&'));const timer=setTimeout(()=>{ws.close();reject(Error('Game welcome timed out'));},15000);
  ws.onerror=()=>{clearTimeout(timer);reject(Error('Game connection failed'));};
  ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.type==='welcome'){clearTimeout(timer);ws.close();resolve(m.users[m.id]);}};
 });
}
(async()=>{
 const username='qa_'+crypto.randomBytes(5).toString('hex'),nickname='검증'+crypto.randomBytes(4).toString('hex'),password=crypto.randomBytes(18).toString('hex'),failedPassword=`${crypto.randomBytes(18).toString('hex')}-invalid`;
 const user=new Client();await user.session();
 assert.equal((await user.request('/account/register',{username,nickname,password},false)).status,403);
 assert.equal((await user.request('/account/register',{username,nickname:'모레미',password})).status,400);
 assert.equal((await user.request('/account/register',{username,nickname,password,next:'//evil.test'})).data.next,'/?server=0');
 assert.equal((await user.session()).user.nickname,nickname);
 console.log('Created test account:',username);
 const player=await gameProfile(user);assert.equal(player.profile.title,nickname);assert.equal(player.profile.developer,false);assert(!player.guest);
 assert.equal((await user.request('/account/logout',{})).status,200);assert.equal((await user.session()).user,null);
 assert.equal((await user.request('/account/register',{username,nickname,password})).status,409);
 assert.equal((await user.request('/account/login',{username,password:failedPassword})).status,401);
 assert.equal((await user.request('/account/login',{username,password})).status,200);
 const cookie=user.cookie;const restored=new Client();restored.cookie=cookie;assert.equal((await restored.session()).user.nickname,nickname);
 assert.equal((await restored.request('/account/logout',{})).status,200);assert.equal((await user.session()).user,null);
 const bypass=new Client();assert.equal((await bypass.request('/login?id=ADMIN')).status,302);assert.equal((await bypass.session()).user,null);
 if(process.env.KKUTU_ADMIN_PASSWORD){
  const admin=new Client();await admin.session();assert.equal((await admin.request('/account/login',{username:'admin',password:process.env.KKUTU_ADMIN_PASSWORD})).status,200);
  const s=await admin.session();assert.equal(s.user.nickname,'모레미');assert.equal(s.user.developer,true);
  const p=await gameProfile(admin);assert.equal(p.id,'local:admin');assert.equal(p.profile.developer,true);
  await admin.request('/account/logout',{});
 }
 console.log('PASS: CSRF, signup, duplicates, reserved nickname, login, game nickname, developer identity, session restore, logout and legacy bypass blocked');
})().catch(e=>{console.error(e);process.exit(1);});
