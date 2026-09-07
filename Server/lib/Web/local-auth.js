'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');
const Pool = require('pg').Pool;
const Store = require('express-session').Store;
const G = require('../sub/global.json');
const scrypt = util.promisify(crypto.scrypt);
const pool = new Pool({host:G.PG_HOST, port:G.PG_PORT, user:G.PG_USER, password:G.PG_PASSWORD, database:G.PG_DATABASE, max:2});
const ready = pool.query(`CREATE TABLE IF NOT EXISTS local_accounts (
 username varchar(24) PRIMARY KEY, user_id varchar(64) UNIQUE NOT NULL,
 nickname varchar(20) UNIQUE NOT NULL, password_hash text NOT NULL,
 developer boolean NOT NULL DEFAULT false, created_at bigint NOT NULL);
 CREATE TABLE IF NOT EXISTS local_web_sessions (sid varchar(64) PRIMARY KEY, data json NOT NULL, expires_at bigint NOT NULL);`);
ready.catch(()=>console.error('Account storage initialization failed'));
const limits = new Map();
setInterval(()=>{ const now=Date.now(); for(const [key,v] of limits) if(v.until<now) limits.delete(key); pool.query('DELETE FROM local_web_sessions WHERE expires_at < $1',[now]).catch(()=>{}); },60000).unref();

async function passwordHash(password){
 const salt=crypto.randomBytes(16).toString('hex');
 const key=await scrypt(password,salt,64);
 return salt+':'+key.toString('hex');
}
async function verify(password,hash){
 const parts=String(hash).split(':');
 if(parts.length!==2) return false;
 const key=await scrypt(password,parts[0],64);
 const expected=Buffer.from(parts[1],'hex');
 return key.length===expected.length && crypto.timingSafeEqual(key,expected);
}
function validUsername(s){return typeof s==='string' && /^[a-zA-Z0-9_]{3,24}$/.test(s);}
function validNickname(s){return typeof s==='string' && /^[가-힣a-zA-Z0-9_]{2,20}$/.test(s) && !/^(admin|administrator|관리자|운영자|개발자|모레미)$/i.test(s);}
function profile(row,sid){return {id:row.user_id,title:row.nickname,name:row.nickname,image:'/img/kkutu/guest.png',authType:'local',developer:row.developer===true,sid:sid};}
function safeNext(value){return typeof value==='string' && /^\/\?server=\d+$/.test(value)?value:'/?server=0';}
function limited(req,res){
 const key=req.ip; const now=Date.now(); let v=limits.get(key);
 if(!v || v.until<now){v={count:0,until:now+60000};limits.set(key,v);}
 if(++v.count>20){res.status(429).json({error:'요청이 너무 많습니다. 1분 뒤 다시 시도하세요.'});return true;}
 return false;
}
function csrf(req,res){
 if(typeof req.get('x-csrf-token')!=='string' || req.get('x-csrf-token')!==req.session.localCsrf){res.status(403).json({error:'로그인 창을 다시 열어 주세요.'});return false;}
 const origin=req.get('origin');
 if(origin){try{if(new URL(origin).host!==req.get('host')) throw Error();}catch(_){res.status(403).json({error:'잘못된 요청입니다.'});return false;}}
 return true;
}
async function establish(req,row){
 const old=req.session.id;
 await pool.query('DELETE FROM session WHERE _id=$1',[old]);
 await new Promise((resolve,reject)=>req.session.regenerate(e=>e?reject(e):resolve()));
 const p=profile(row,req.session.id);
 await pool.query('INSERT INTO session (_id,profile,"createdAt") VALUES ($1,$2,$3) ON CONFLICT (_id) DO UPDATE SET profile=$2,"createdAt"=$3',[req.session.id,JSON.stringify(p),Date.now()]);
 req.session.profile=p; req.session.admin=row.developer===true; req.session.authType='local';
 req.session.localCsrf=crypto.randomBytes(24).toString('hex');
 await new Promise((resolve,reject)=>req.session.save(e=>e?reject(e):resolve()));
}
class SessionStore extends Store {
 get(sid,cb){ready.then(()=>pool.query('SELECT data FROM local_web_sessions WHERE sid=$1 AND expires_at>$2',[sid,Date.now()])).then(r=>cb(null,r.rows[0]?r.rows[0].data:null),cb);}
 set(sid,data,cb){ready.then(()=>pool.query('INSERT INTO local_web_sessions(sid,data,expires_at) VALUES($1,$2,$3) ON CONFLICT(sid) DO UPDATE SET data=$2,expires_at=$3',[sid,JSON.stringify(data),Date.now()+43200000])).then(()=>cb&&cb(),e=>cb&&cb(e));}
 destroy(sid,cb){ready.then(()=>pool.query('DELETE FROM local_web_sessions WHERE sid=$1',[sid])).then(()=>cb&&cb(),e=>cb&&cb(e));}
}
function secret(){
 const file=path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','session-secret');
 try{return fs.readFileSync(file,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;}
 const value=crypto.randomBytes(48).toString('hex');
 try{fs.writeFileSync(file,value,{flag:'wx',mode:0o600});return value;}catch(e){if(e.code==='EEXIST')return fs.readFileSync(file,'utf8');throw e;}
}
async function bootstrap(){
 await ready;
 const file=path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','local-admin-seed.json');
 if(!fs.existsSync(file))return;
 const seed=JSON.parse(fs.readFileSync(file,'utf8'));
 if(!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(seed.passwordHash))throw Error('Invalid administrator seed');
 await pool.query('INSERT INTO local_accounts(username,user_id,nickname,password_hash,developer,created_at) VALUES($1,$2,$3,$4,true,$5) ON CONFLICT(username) DO NOTHING',['admin','local:admin','모레미',seed.passwordHash,Date.now()]);
}
const boot=bootstrap();boot.catch(()=>console.error('Administrator initialization failed'));
function routes(app){
 const wrap=fn=>(req,res)=>Promise.resolve(fn(req,res)).catch(e=>{console.error('Account request failed:',e.code||'internal');if(!res.headersSent)res.status(503).json({error:'잠시 후 다시 시도해 주세요.'});});
 app.get('/account/session',wrap(async(req,res)=>{
  await boot;res.set('Cache-Control','no-store');
  if(!req.session.localCsrf)req.session.localCsrf=crypto.randomBytes(24).toString('hex');
  res.json({csrf:req.session.localCsrf,user:req.session.profile?{nickname:req.session.profile.title||req.session.profile.name,developer:req.session.profile.developer===true}:null,secure:req.secure});
 }));
 app.post('/account/register',wrap(async(req,res)=>{
  if(limited(req,res)||!csrf(req,res))return;await boot;
  const b=req.body||{};const username=String(b.username||'').toLowerCase();const nickname=typeof b.nickname==='string'?b.nickname.normalize('NFC'):'';
  if(!validUsername(username)||username==='admin'||!validNickname(nickname)||typeof b.password!=='string'||b.password.length<8||b.password.length>128)return res.status(400).json({error:'아이디는 영문·숫자·_ 3~24자, 닉네임은 한글·영문·숫자·_ 2~20자, 비밀번호는 8~128자로 입력하세요. 운영자 이름은 사용할 수 없습니다.'});
  const hash=await passwordHash(b.password);
  let row;
  try{row=(await pool.query('INSERT INTO local_accounts(username,user_id,nickname,password_hash,created_at) VALUES($1,$2,$3,$4,$5) RETURNING *',[username,'local:'+crypto.randomBytes(16).toString('hex'),nickname,hash,Date.now()])).rows[0];}
  catch(e){if(e.code==='23505')return res.status(409).json({error:'이미 사용 중인 아이디 또는 닉네임입니다.'});throw e;}
  await establish(req,row);res.json({ok:true,next:safeNext(b.next)});
 }));
 app.post('/account/login',wrap(async(req,res)=>{
  if(limited(req,res)||!csrf(req,res))return;await boot;
  const b=req.body||{}; if(!validUsername(b.username)||typeof b.password!=='string'||b.password.length>128)return res.status(400).json({error:'아이디와 비밀번호를 확인하세요.'});
  const row=(await pool.query('SELECT * FROM local_accounts WHERE username=$1',[b.username.toLowerCase()])).rows[0];
  const dummy='00000000000000000000000000000000:'+ '0'.repeat(128);
  const ok=await verify(b.password,row?row.password_hash:dummy);
  if(!row||!ok)return res.status(401).json({error:'아이디 또는 비밀번호가 올바르지 않습니다.'});
  await establish(req,row);res.json({ok:true,next:safeNext(b.next)});
 }));
 app.post('/account/logout',wrap(async(req,res)=>{
  if(!csrf(req,res))return; await pool.query('DELETE FROM session WHERE _id=$1',[req.session.id]);
  await new Promise((resolve,reject)=>req.session.destroy(e=>e?reject(e):resolve()));res.json({ok:true});
 }));
 app.get('/login',(req,res)=>res.redirect('/?account=login'));
 app.get('/logout',(req,res)=>res.redirect('/?account=logout'));
}
module.exports={SessionStore,secret,routes,passwordHash,verify,validUsername,validNickname,safeNext};
