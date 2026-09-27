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
 CREATE TABLE IF NOT EXISTS local_web_sessions (sid varchar(64) PRIMARY KEY, data json NOT NULL, expires_at bigint NOT NULL);
 CREATE TABLE IF NOT EXISTS account_nickname_overrides (
 user_id varchar(128) PRIMARY KEY, nickname varchar(20) UNIQUE NOT NULL, updated_at bigint NOT NULL);
 CREATE TABLE IF NOT EXISTS social_account_links (
 social_user_id varchar(128) PRIMARY KEY, local_user_id varchar(128) UNIQUE NOT NULL, provider varchar(20) NOT NULL, linked_at bigint NOT NULL);
 CREATE TABLE IF NOT EXISTS site_notices (
 notice_key varchar(32) PRIMARY KEY, enabled boolean NOT NULL DEFAULT false,
 title varchar(100) NOT NULL DEFAULT '', message varchar(1000) NOT NULL DEFAULT '',
 image_url varchar(500) NOT NULL DEFAULT '', target_url varchar(500) NOT NULL DEFAULT '', updated_at bigint NOT NULL DEFAULT 0);
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS target_url varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS image_url_en varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS target_url_en varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS image_url_zh varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS target_url_zh varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS image_url_kp varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE site_notices ADD COLUMN IF NOT EXISTS target_url_kp varchar(500) NOT NULL DEFAULT '';
 CREATE TABLE IF NOT EXISTS notice_posts (id serial PRIMARY KEY, image_url varchar(500) NOT NULL, target_url varchar(500) NOT NULL DEFAULT '', created_at bigint NOT NULL);
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS image_url_en varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS target_url_en varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS image_url_zh varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS target_url_zh varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS image_url_kp varchar(500) NOT NULL DEFAULT '';
 ALTER TABLE notice_posts ADD COLUMN IF NOT EXISTS target_url_kp varchar(500) NOT NULL DEFAULT '';
 CREATE TABLE IF NOT EXISTS service_state (state_key varchar(64) PRIMARY KEY, enabled boolean NOT NULL DEFAULT false, updated_at bigint NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS server_access (server_index integer NOT NULL, user_id varchar(128) NOT NULL, created_at bigint NOT NULL, PRIMARY KEY(server_index,user_id));
 CREATE TABLE IF NOT EXISTS game_login_owner (user_id varchar(128) PRIMARY KEY, server_index integer NOT NULL, token varchar(160) NOT NULL, updated_at bigint NOT NULL);`);
const nativeReady=ready.then(()=>pool.query(`CREATE TABLE IF NOT EXISTS native_login_codes (
 code_hash char(64) PRIMARY KEY, profile jsonb NOT NULL,
 expires_at bigint NOT NULL, used_at bigint);
 CREATE INDEX IF NOT EXISTS native_login_codes_expiry ON native_login_codes(expires_at);`));
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
async function resetPassword(username,password){
	await boot;
	if(!validUsername(username) || typeof password !== 'string' || password.length < 8 || password.length > 128) return false;
	const hash=await passwordHash(password);
	const result=await pool.query('UPDATE local_accounts SET password_hash=$1 WHERE username=$2',[hash,username.toLowerCase()]);
	return result.rowCount === 1;
}
async function changeNickname(username,nickname){
	await boot;
	if(!validUsername(username) || !validNickname(nickname)) return false;
	const client=await pool.connect();
	try {
		await client.query('BEGIN');
		const changed=await client.query('UPDATE local_accounts SET nickname=$1 WHERE username=$2 RETURNING user_id',[nickname,username.toLowerCase()]);
		if(!changed.rowCount){ await client.query('ROLLBACK'); return false; }
		const userId=changed.rows[0].user_id;
		await client.query(`UPDATE session SET profile=jsonb_set(jsonb_set(profile::jsonb,'{title}',to_jsonb($1::text),true),'{name}',to_jsonb($1::text),true)::json WHERE profile->>'id'=$2`,[nickname,userId]);
		await client.query(`UPDATE local_web_sessions SET data=jsonb_set(jsonb_set(data::jsonb,'{profile,title}',to_jsonb($1::text),true),'{profile,name}',to_jsonb($1::text),true)::json WHERE data->'profile'->>'id'=$2`,[nickname,userId]);
		await client.query('COMMIT');
		return true;
	} catch(error) { await client.query('ROLLBACK'); throw error; }
	finally { client.release(); }
}
function isSocialUserId(userId){return typeof userId==='string' && userId.length>0 && userId.length<=128 && !userId.startsWith('local:');}
async function changeDiscordNickname(userId,nickname){
	await boot;
	if(!isSocialUserId(userId) || !validNickname(nickname)) return false;
	const client=await pool.connect();
	try {
		await client.query('BEGIN');
		await client.query(`INSERT INTO account_nickname_overrides(user_id,nickname,updated_at) VALUES($1,$2,$3)
			ON CONFLICT(user_id) DO UPDATE SET nickname=EXCLUDED.nickname,updated_at=EXCLUDED.updated_at`,[userId,nickname,Date.now()]);
		await client.query(`UPDATE session SET profile=jsonb_set(jsonb_set(profile::jsonb,'{title}',to_jsonb($1::text),true),'{name}',to_jsonb($1::text),true)::json WHERE profile->>'id'=$2`,[nickname,userId]);
		await client.query(`UPDATE local_web_sessions SET data=jsonb_set(jsonb_set(data::jsonb,'{profile,title}',to_jsonb($1::text),true),'{profile,name}',to_jsonb($1::text),true)::json WHERE data->'profile'->>'id'=$2`,[nickname,userId]);
		await client.query('COMMIT');
		return true;
	} catch(error) { await client.query('ROLLBACK'); throw error; }
	finally { client.release(); }
}
async function getNicknameOverride(userId){
	await boot;
	if(!isSocialUserId(userId)) return null;
	const result=await pool.query('SELECT nickname FROM account_nickname_overrides WHERE user_id=$1',[userId]);
	return result.rows[0] ? result.rows[0].nickname : null;
}
async function getGameMaintenanceStatus(){
 await boot;
 const result=await pool.query("SELECT state_key,enabled FROM service_state WHERE state_key='game_maintenance' OR state_key LIKE 'game_maintenance_%'");
 const status={maintenance:false,servers:[false,false,false]};
 result.rows.forEach(function(row){
  if(row.state_key==='game_maintenance') status.maintenance=!!row.enabled;
  else { const index=Number(String(row.state_key).slice('game_maintenance_'.length)); if(index>=0&&index<=2) status.servers[index]=!!row.enabled; }
 });
 return status;
}
async function getGameMaintenance(){ return (await getGameMaintenanceStatus()).maintenance; }
async function setGameMaintenance(enabled,server){
 await boot;
 const index=(server===undefined||server===null||server===''||server==='all') ? null : Number(server);
 if(index!==null && (index<0 || index>2)) throw Error('서버를 확인하세요.');
 const key=index===null?'game_maintenance':'game_maintenance_'+index;
 await pool.query('INSERT INTO service_state(state_key,enabled,updated_at) VALUES($1,$2,$3) ON CONFLICT(state_key) DO UPDATE SET enabled=EXCLUDED.enabled,updated_at=EXCLUDED.updated_at',[key,!!enabled,Date.now()]);
 return getGameMaintenanceStatus();
}
async function getActiveTheme(server){
 await boot;
 const index=Number(server), key=Number.isInteger(index)&&index>=0&&index<=2?'site_theme_'+index:'site_theme';
 const result=await pool.query("SELECT title FROM site_notices WHERE notice_key=$1 OR notice_key='site_theme' ORDER BY CASE WHEN notice_key=$1 THEN 0 ELSE 1 END LIMIT 1",[key]);
 const value=result.rows[0] && result.rows[0].title;
 return value==='chuseok'?'chuseok':'autumn';
}
async function setActiveTheme(theme,server){
 await boot;
 const value=theme==='chuseok'?'chuseok':'autumn';
 const index=Number(server), key=Number.isInteger(index)&&index>=0&&index<=2?'site_theme_'+index:'site_theme';
 await pool.query(`INSERT INTO site_notices(notice_key,enabled,title,message,image_url,target_url,updated_at)
  VALUES($1,true,$2,'','','',$3)
  ON CONFLICT(notice_key) DO UPDATE SET enabled=true,title=EXCLUDED.title,updated_at=EXCLUDED.updated_at`,[key,value,Date.now()]);
 return value;
}
async function listServerAccess(server){await boot;const r=await pool.query('SELECT user_id,created_at FROM server_access WHERE server_index=$1 ORDER BY created_at DESC',[Number(server)]);return r.rows;}
async function hasServerAccess(server,userId){await boot;if(Number(server)!==2)return true;if(!userId)return false;const r=await pool.query('SELECT 1 FROM server_access WHERE server_index=2 AND user_id=$1',[String(userId)]);return r.rowCount>0;}
async function addServerAccess(server,userId){
 await boot;const value=String(userId||'').trim();
 const found=await pool.query('SELECT user_id FROM local_accounts WHERE username=$1 OR user_id=$1 UNION SELECT _id AS user_id FROM users WHERE _id=$1 LIMIT 1',[value.toLowerCase()]);
 if(!found.rowCount){const error=new Error('계정을 찾을 수 없습니다.');error.code='ACCOUNT_NOT_FOUND';throw error;}
 const resolved=found.rows[0].user_id;await pool.query('INSERT INTO server_access(server_index,user_id,created_at) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[Number(server),resolved,Date.now()]);return resolved;
}
async function removeServerAccess(server,userId){await boot;await pool.query('DELETE FROM server_access WHERE server_index=$1 AND user_id=$2',[Number(server),String(userId)]);return true;}
async function claimGameLogin(userId,server,token){await boot;await pool.query('INSERT INTO game_login_owner(user_id,server_index,token,updated_at) VALUES($1,$2,$3,$4) ON CONFLICT(user_id) DO UPDATE SET server_index=EXCLUDED.server_index,token=EXCLUDED.token,updated_at=EXCLUDED.updated_at',[String(userId),Number(server),String(token),Date.now()]);return true;}
async function ownsGameLogin(userId,token){await boot;const r=await pool.query('SELECT 1 FROM game_login_owner WHERE user_id=$1 AND token=$2',[String(userId),String(token)]);return r.rowCount>0;}
async function releaseGameLogin(userId,token){await boot;await pool.query('DELETE FROM game_login_owner WHERE user_id=$1 AND token=$2',[String(userId),String(token)]);return true;}
async function issueNativeLogin(profile){
 await nativeReady;
 // The production image still runs Node.js 12, which does not support the
 // Buffer "base64url" encoding name. Convert regular base64 explicitly so
 // native login codes work on both the current server and newer runtimes.
 const code=crypto.randomBytes(32).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const hash=crypto.createHash('sha256').update(code).digest('hex');
 await pool.query('DELETE FROM native_login_codes WHERE expires_at<$1 OR used_at IS NOT NULL',[Date.now()]);
 await pool.query('INSERT INTO native_login_codes(code_hash,profile,expires_at) VALUES($1,$2,$3)',[hash,JSON.stringify(profile),Date.now()+120000]);
 return code;
}
async function redeemNativeLogin(code){
 await nativeReady;
 if(typeof code!=='string'||code.length<30||code.length>100)return null;
 const hash=crypto.createHash('sha256').update(code).digest('hex');
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const found=await client.query('SELECT profile FROM native_login_codes WHERE code_hash=$1 AND used_at IS NULL AND expires_at>$2 FOR UPDATE',[hash,Date.now()]);
  if(!found.rowCount){await client.query('ROLLBACK');return null;}
  await client.query('UPDATE native_login_codes SET used_at=$1 WHERE code_hash=$2',[Date.now(),hash]);
  await client.query('COMMIT');return found.rows[0].profile;
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
async function getSiteNotices(){
	await boot;
	const result=await pool.query('SELECT notice_key,enabled,title,message,image_url,target_url,image_url_en,target_url_en,image_url_zh,target_url_zh,image_url_kp,target_url_kp,updated_at FROM site_notices');
	const notices={};
	result.rows.forEach(function(row){ notices[row.notice_key]=row; });
	return notices;
}
async function getNoticePosts(){
	await boot;
	const result=await pool.query('SELECT id,image_url,target_url,image_url_en,target_url_en,image_url_zh,target_url_zh,image_url_kp,target_url_kp,created_at FROM notice_posts ORDER BY created_at DESC');
	return result.rows;
}
async function addNoticePost(data){
	await boot;
	const result=await pool.query('INSERT INTO notice_posts(image_url,target_url,created_at) VALUES($1,$2,$3) RETURNING id,image_url,target_url,created_at',[String(data.image_url||'').slice(0,500),String(data.target_url||'').slice(0,500),Date.now()]);
	return result.rows[0];
}
async function deleteNoticePost(id){
	await boot;
	const result=await pool.query('DELETE FROM notice_posts WHERE id=$1',[Number(id)]);
	return result.rowCount===1;
}
async function setNoticePostEnglish(id,data){
 await boot;
 const result=await pool.query('UPDATE notice_posts SET image_url_en=$2,target_url_en=$3 WHERE id=$1 RETURNING id',[Number(id),String(data.image_url||'').slice(0,500),String(data.target_url||'').slice(0,500)]);
 return result.rowCount===1;
}
async function setNoticePostChinese(id,data){
 await boot;
 const result=await pool.query('UPDATE notice_posts SET image_url_zh=$2,target_url_zh=$3 WHERE id=$1 RETURNING id',[Number(id),String(data.image_url||'').slice(0,500),String(data.target_url||'').slice(0,500)]);
 return result.rowCount===1;
}
async function setNoticePostChoson(id,data){
 await boot;
 const result=await pool.query('UPDATE notice_posts SET image_url_kp=$2,target_url_kp=$3 WHERE id=$1 RETURNING id',[Number(id),String(data.image_url||'').slice(0,500),String(data.target_url||'').slice(0,500)]);
 return result.rowCount===1;
}
async function saveSiteNotice(key,data){
	await boot;
	if(key !== 'banner' && key !== 'game_entry') return false;
	await pool.query(`INSERT INTO site_notices(notice_key,enabled,title,message,image_url,target_url,image_url_en,target_url_en,image_url_zh,target_url_zh,image_url_kp,target_url_kp,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
		ON CONFLICT(notice_key) DO UPDATE SET enabled=EXCLUDED.enabled,title=EXCLUDED.title,message=EXCLUDED.message,image_url=EXCLUDED.image_url,target_url=EXCLUDED.target_url,image_url_en=EXCLUDED.image_url_en,target_url_en=EXCLUDED.target_url_en,image_url_zh=EXCLUDED.image_url_zh,target_url_zh=EXCLUDED.target_url_zh,image_url_kp=EXCLUDED.image_url_kp,target_url_kp=EXCLUDED.target_url_kp,updated_at=EXCLUDED.updated_at`,
		[key,!!data.enabled,String(data.title||'').slice(0,100),String(data.message||'').slice(0,1000),String(data.image_url||'').slice(0,500),String(data.target_url||'').slice(0,500),String(data.image_url_en||'').slice(0,500),String(data.target_url_en||'').slice(0,500),String(data.image_url_zh||'').slice(0,500),String(data.target_url_zh||'').slice(0,500),String(data.image_url_kp||'').slice(0,500),String(data.target_url_kp||'').slice(0,500),Date.now()]);
	return true;
}
async function migrateLocalToDiscord(localUserId,discordUserId,discordNickname){
	await boot;
	if(typeof localUserId!=='string'||!localUserId.startsWith('local:')||!isSocialUserId(discordUserId)) return false;
	const client=await pool.connect();
	try{
		await client.query('BEGIN');
		const account=(await client.query('SELECT nickname,developer FROM local_accounts WHERE user_id=$1 FOR UPDATE',[localUserId])).rows[0];
		if(!account){await client.query('ROLLBACK');return false;}
		if(account.developer){
			await client.query(`INSERT INTO social_account_links(social_user_id,local_user_id,provider,linked_at) VALUES($1,$2,$3,$4)
				ON CONFLICT(social_user_id) DO UPDATE SET local_user_id=EXCLUDED.local_user_id,provider=EXCLUDED.provider,linked_at=EXCLUDED.linked_at`,[discordUserId,localUserId,discordUserId.split('-')[0],Date.now()]);
			await client.query('COMMIT');
			return { nickname:account.nickname||discordNickname, userId:localUserId, retained:true };
		}
		if((await client.query('SELECT 1 FROM users WHERE _id=$1',[localUserId])).rowCount){await client.query('DELETE FROM users WHERE _id=$1',[discordUserId]);await client.query('UPDATE users SET _id=$1 WHERE _id=$2',[discordUserId,localUserId]);}
		await client.query(`INSERT INTO account_nickname_overrides(user_id,nickname,updated_at) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET nickname=EXCLUDED.nickname,updated_at=EXCLUDED.updated_at`,[discordUserId,account.nickname||discordNickname,Date.now()]);
		await client.query('DELETE FROM local_accounts WHERE user_id=$1',[localUserId]);
		await client.query(`DELETE FROM session WHERE profile->>'id'=$1`,[localUserId]);
		await client.query(`DELETE FROM local_web_sessions WHERE data->'profile'->>'id'=$1`,[localUserId]);
		await client.query('COMMIT');
		return { nickname:account.nickname||discordNickname, userId:discordUserId, retained:false };
	}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
async function deleteAccount(username){
	await boot;
	if(!validUsername(username)) return false;
	const client=await pool.connect();
	try {
		await client.query('BEGIN');
		const removed=await client.query('DELETE FROM local_accounts WHERE username=$1 AND developer=false RETURNING user_id',[username.toLowerCase()]);
		if(!removed.rowCount){ await client.query('ROLLBACK'); return false; }
		const userId=removed.rows[0].user_id;
		await client.query(`DELETE FROM local_web_sessions WHERE data->'profile'->>'id'=$1`,[userId]);
		await client.query(`DELETE FROM session WHERE profile->>'id'=$1`,[userId]);
		await client.query('DELETE FROM users WHERE _id=$1',[userId]);
		await client.query('COMMIT');
		return true;
	} catch(error) { await client.query('ROLLBACK'); throw error; }
	finally { client.release(); }
}
function validUsername(s){return typeof s==='string' && /^[a-zA-Z0-9_]{3,24}$/.test(s);}
function validNickname(s){return typeof s==='string' && /^[가-힣a-zA-Z0-9_]{2,20}$/.test(s) && !/^(admin|administrator|관리자|운영자|개발자|모레미)$/i.test(s);}
function profile(row,sid){return {id:row.user_id,title:row.nickname,name:row.nickname,image:row.developer===true?'/img/custom/admin-profile-logo.png':'/img/kkutu/guest.png',authType:'local',developer:row.developer===true,sid:sid};}
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
 const userId='local:'+crypto.createHash('sha256').update(seed.passwordHash).digest('hex').slice(0,32);
 await pool.query('INSERT INTO local_accounts(username,user_id,nickname,password_hash,developer,created_at) VALUES($1,$2,$3,$4,true,$5) ON CONFLICT(username) DO UPDATE SET nickname=EXCLUDED.nickname,developer=true',['admin',userId,'[GM]끄투게임',seed.passwordHash,Date.now()]);
}
const boot=bootstrap();boot.catch(()=>console.error('Administrator initialization failed'));
function routes(app){
 const wrap=fn=>(req,res)=>Promise.resolve(fn(req,res)).catch(e=>{console.error('Account request failed:',e.code||'internal');if(!res.headersSent)res.status(503).json({error:'잠시 후 다시 시도해 주세요.'});});
 app.get('/account/session',wrap(async(req,res)=>{
  await boot;res.set('Cache-Control','no-store');
  if(!req.session.localCsrf)req.session.localCsrf=crypto.randomBytes(24).toString('hex');
  const migrationNotice=req.session.migrationNotice||'';req.session.migrationNotice='';
  res.json({csrf:req.session.localCsrf,user:req.session.profile?{nickname:req.session.profile.title||req.session.profile.name,developer:req.session.profile.developer===true,authType:req.session.profile.authType||''}:null,needsNicknameSetup:req.session.needsNicknameSetup===true,migrationNotice:migrationNotice,secure:req.secure});
 }));
 app.post('/account/register',wrap(async(req,res)=>{
  if(limited(req,res)||!csrf(req,res))return;await boot;
  const b=req.body||{};const username=String(b.username||'').toLowerCase();const nickname=typeof b.nickname==='string'?b.nickname.normalize('NFC'):'';
  if(!validUsername(username)||username==='admin'||!validNickname(nickname)||typeof b.password!=='string'||b.password.length<8||b.password.length>128)return res.status(400).json({error:'아이디는 영문·숫자·_ 3~24자, 닉네임은 한글·영문·숫자·_ 2~20자, 비밀번호는 8~128자로 입력하세요. 운영자 이름은 사용할 수 없습니다.'});
  const hash=await passwordHash(b.password);
  let row;
  try{row=(await pool.query('INSERT INTO local_accounts(username,user_id,nickname,password_hash,created_at) VALUES($1,$2,$3,$4,$5) RETURNING *',[username,'local:'+crypto.randomBytes(16).toString('hex'),nickname,hash,Date.now()])).rows[0];}
  catch(e){if(e.code==='23505')return res.status(409).json({error:'이미 사용 중인 아이디 또는 닉네임입니다.'});throw e;}
  await establish(req,row);res.json({ok:true,next:'/'});
 }));
 app.post('/account/login',wrap(async(req,res)=>{
  if(limited(req,res)||!csrf(req,res))return;await boot;
  const b=req.body||{}; if(!validUsername(b.username)||typeof b.password!=='string'||b.password.length>128)return res.status(400).json({error:'아이디와 비밀번호를 확인하세요.'});
  const row=(await pool.query('SELECT * FROM local_accounts WHERE username=$1',[b.username.toLowerCase()])).rows[0];
  const dummy='00000000000000000000000000000000:'+ '0'.repeat(128);
  const ok=await verify(b.password,row?row.password_hash:dummy);
  if(!row||!ok)return res.status(401).json({error:'아이디 또는 비밀번호가 올바르지 않습니다.'});
  await establish(req,row);res.json({ok:true,next:'/'});
 }));
 app.post('/admin/login',wrap(async(req,res)=>{
  if(limited(req,res)||!csrf(req,res))return;await boot;
  const b=req.body||{};
  if(!validUsername(b.username)||typeof b.password!=='string'||b.password.length>128)return res.status(400).json({error:'아이디와 비밀번호를 확인하세요.'});
  const row=(await pool.query('SELECT * FROM local_accounts WHERE username=$1',[b.username.toLowerCase()])).rows[0];
  const dummy='00000000000000000000000000000000:'+ '0'.repeat(128);
  const ok=await verify(b.password,row?row.password_hash:dummy);
  if(!row||!ok||row.developer!==true)return res.status(401).json({error:'운영자 계정 정보를 확인하세요.'});
  await establish(req,row);res.json({ok:true,next:'/admin'});
 }));
 app.post('/account/logout',wrap(async(req,res)=>{
  if(!csrf(req,res))return; await pool.query('DELETE FROM session WHERE _id=$1',[req.session.id]);
  await new Promise((resolve,reject)=>req.session.destroy(e=>e?reject(e):resolve()));res.json({ok:true});
 }));
 app.post('/account/social-nickname',wrap(async(req,res)=>{
  if(!csrf(req,res))return;
  const p=req.session.profile;
  const nickname=typeof (req.body||{}).nickname==='string'?(req.body||{}).nickname.normalize('NFC'):'';
  if(!p||p.authType==='local')return res.status(403).json({error:'소셜 로그인 후에만 닉네임을 설정할 수 있습니다.'});
  if((req.body||{}).privacyConsent!==true)return res.status(400).json({error:'개인정보처리방침에 동의해 주세요.'});
  if(!validNickname(nickname))return res.status(400).json({error:'닉네임은 한글·영문·숫자·_ 2~20자로 입력하세요.'});
  if(!await changeDiscordNickname(p.id,nickname))return res.status(409).json({error:'이미 사용 중인 닉네임입니다.'});
  p.title=nickname;p.name=nickname;req.session.profile=p;req.session.needsNicknameSetup=false;
  await new Promise((resolve,reject)=>req.session.save(e=>e?reject(e):resolve()));
  res.json({ok:true,nickname:nickname});
 }));
 app.get('/login',(req,res)=>res.sendFile(path.join(__dirname,'public','account-login.html')));
 app.get('/logout',wrap(async(req,res)=>{
  const sid=req.session.id;
  await pool.query('DELETE FROM session WHERE _id=$1',[sid]);
  await new Promise((resolve,reject)=>req.session.destroy(e=>e?reject(e):resolve()));
  res.clearCookie('connect.sid').redirect('/');
 }));
}
async function changeProgress(userId,kind,value){
 await boot;
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const row=(await client.query('SELECT kkutu,server FROM users WHERE _id=$1 FOR UPDATE',[userId])).rows[0];
  if(!row)throw Error('게임에 접속한 기록이 있는 계정을 선택하세요.');
  const data=row.kkutu||{},before=Number(data.score)||0;
  data.score=require('./account-progress').target(kind,value,before);
  await client.query('UPDATE users SET kkutu=$1 WHERE _id=$2',[JSON.stringify(data),userId]);
  await client.query('COMMIT');
  return {ok:true,before:before,score:data.score,level:require('./account-progress').level(data.score),online:row.server!==null&&row.server!==undefined&&String(row.server)!==''};
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
module.exports={changeProgress,SessionStore,secret,routes,passwordHash,verify,resetPassword,changeNickname,changeDiscordNickname,getNicknameOverride,getGameMaintenance,getGameMaintenanceStatus,setGameMaintenance,getActiveTheme,setActiveTheme,listServerAccess,hasServerAccess,addServerAccess,removeServerAccess,claimGameLogin,ownsGameLogin,releaseGameLogin,issueNativeLogin,redeemNativeLogin,getSiteNotices,getNoticePosts,addNoticePost,deleteNoticePost,setNoticePostEnglish,setNoticePostChinese,setNoticePostChoson,saveSiteNotice,migrateLocalToDiscord,deleteAccount,validUsername,validNickname,safeNext};
