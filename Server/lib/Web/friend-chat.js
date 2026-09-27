'use strict';
const {Pool}=require('pg'), G=require('../sub/global.json'), https=require('https');
const profanity=require('../Game/profanity');
const pool=new Pool({host:G.PG_HOST,port:G.PG_PORT,user:G.PG_USER,password:G.PG_PASSWORD,database:G.PG_DATABASE,max:3});
const ready=pool.query(`
 CREATE TABLE IF NOT EXISTS friend_messages(id bigserial PRIMARY KEY,sender text NOT NULL,recipient text NOT NULL,sender_name text NOT NULL,body text NOT NULL,created_at bigint NOT NULL);
 ALTER TABLE friend_messages ADD COLUMN IF NOT EXISTS notify boolean NOT NULL DEFAULT true;
 CREATE INDEX IF NOT EXISTS friend_messages_pair ON friend_messages(sender,recipient,id);
 CREATE INDEX IF NOT EXISTS friend_messages_inbox ON friend_messages(recipient,id);
 CREATE TABLE IF NOT EXISTS friend_reads(owner text NOT NULL,peer text NOT NULL,last_id bigint NOT NULL DEFAULT 0,PRIMARY KEY(owner,peer));
 CREATE TABLE IF NOT EXISTS friend_reports(message_id bigint NOT NULL,reporter text NOT NULL,snapshot jsonb NOT NULL,created_at bigint NOT NULL,PRIMARY KEY(message_id,reporter));
 CREATE OR REPLACE FUNCTION purge_removed_friend_chat() RETURNS trigger LANGUAGE plpgsql AS $$
 BEGIN
 DELETE FROM friend_messages m WHERE (m.sender=NEW._id AND COALESCE(OLD.friends::jsonb,'{}'::jsonb) ? m.recipient AND NOT COALESCE(NEW.friends::jsonb,'{}'::jsonb) ? m.recipient) OR (m.recipient=NEW._id AND COALESCE(OLD.friends::jsonb,'{}'::jsonb) ? m.sender AND NOT COALESCE(NEW.friends::jsonb,'{}'::jsonb) ? m.sender);
 DELETE FROM friend_reads r WHERE (r.owner=NEW._id AND COALESCE(OLD.friends::jsonb,'{}'::jsonb) ? r.peer AND NOT COALESCE(NEW.friends::jsonb,'{}'::jsonb) ? r.peer) OR (r.peer=NEW._id AND COALESCE(OLD.friends::jsonb,'{}'::jsonb) ? r.owner AND NOT COALESCE(NEW.friends::jsonb,'{}'::jsonb) ? r.owner);
 RETURN NEW; END $$;
 DROP TRIGGER IF EXISTS friend_chat_cleanup ON users;
 CREATE TRIGGER friend_chat_cleanup AFTER UPDATE OF friends ON users FOR EACH ROW EXECUTE PROCEDURE purge_removed_friend_chat();
`);
ready.catch(e=>console.error('Friend chat schema:',e.message));
function err(status,message){return Object.assign(new Error(message),{status});}
async function pair(db,id,peer,lock){
 if(typeof peer!=='string'||peer.length>128||peer===id)throw err(400,'친구를 선택해 주세요.');
 const rows=(await db.query('SELECT _id,friends,black,"blockedUntil" FROM users WHERE _id=ANY($1::text[]) ORDER BY _id'+(lock?' FOR UPDATE':''),[[id,peer]])).rows;
 const me=rows.find(x=>x._id===id),other=rows.find(x=>x._id===peer);
 if(!me||!other||!Object.prototype.hasOwnProperty.call(me.friends||{},peer)||!Object.prototype.hasOwnProperty.call(other.friends||{},id))throw err(403,'친구 관계가 해제되어 대화를 사용할 수 없습니다.');
 if(me.black&&(!Number(me.blockedUntil)||Number(me.blockedUntil)>Date.now()))throw err(403,'정지된 계정입니다.');
 return me;
}
function discordReport(row,reporter){
 const token=process.env.DISCORD_BOT_TOKEN,channel=process.env.DISCORD_CHAT_CHANNEL_ID;
 if(!token||!/^\d{17,20}$/.test(channel||''))return Promise.resolve(false);
 const body=JSON.stringify({embeds:[{title:'🚨 친구 1:1 채팅 신고',color:0xe5484d,description:row.body,fields:[{name:'작성자',value:row.sender_name+' ('+row.sender+')'},{name:'신고자',value:reporter},{name:'메시지',value:String(row.id)}],timestamp:new Date(Number(row.created_at)).toISOString()}],allowed_mentions:{parse:[]}});
 return new Promise((resolve,reject)=>{const req=https.request({hostname:'discord.com',path:'/api/v10/channels/'+channel+'/messages',method:'POST',headers:{Authorization:'Bot '+token,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{res.resume();res.on('end',()=>res.statusCode<300?resolve(true):reject(new Error('Discord '+res.statusCode)));});req.on('error',reject);req.setTimeout(8000,()=>req.destroy(new Error('Discord timeout')));req.end(body);});
}
exports.routes=function(app){
 function route(method,path,handler){app[method]('/api/friend-chat'+path,async(req,res)=>{res.set('Cache-Control','no-store');try{
  const profile=req.session&&req.session.profile;if(!profile||typeof profile.id!=='string')throw err(401,'로그인 후 이용해 주세요.');
  if(method!=='get'&&(req.get('X-Requested-With')!=='XMLHttpRequest'||(req.get('origin')&&new URL(req.get('origin')).host!==req.get('host'))))throw err(403,'요청을 확인할 수 없습니다.');
  await ready;res.json(await handler(req,profile));
 }catch(e){if(!e.status)console.error('Friend chat:',e.message);res.status(e.status||503).json({error:e.status?e.message:'잠시 후 다시 시도해 주세요.'});}});}
 route('get','/inbox',async(req,p)=>{
  const rows=(await pool.query(`SELECT u._id,u.friends FROM users u WHERE u._id=$1`,[p.id])).rows;const friends=rows[0]&&rows[0].friends||{};
  const mutual=(await pool.query(`SELECT _id FROM users WHERE _id=ANY($1::text[]) AND friends::jsonb ? $2`,[Object.keys(friends),p.id])).rows.map(x=>x._id);
  const inbox=(await pool.query(`SELECT m.sender,max(m.id)::text last_id,count(*)::int unread FROM friend_messages m LEFT JOIN friend_reads r ON r.owner=$1 AND r.peer=m.sender WHERE m.recipient=$1 AND m.sender=ANY($2::text[]) AND m.notify=true AND m.id>COALESCE(r.last_id,0) GROUP BY m.sender`,[p.id,mutual])).rows;
  return {friends:mutual.map(id=>({id,name:friends[id]||'친구'})),inbox};
 });
 route('get','/history',async(req,p)=>{
  const peer=req.query.peer;await pair(pool,p.id,peer);const before=/^\d+$/.test(req.query.before||'')?req.query.before:'9223372036854775807';
  const rows=(await pool.query(`SELECT id::text,sender,sender_name,body,created_at FROM friend_messages WHERE ((sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1)) AND id<$3 ORDER BY id DESC LIMIT 100`,[p.id,peer,before])).rows;return {messages:rows.reverse(),hasMore:rows.length===100};
 });
 route('post','/send',async(req,p)=>{
  const b=req.body||{},value=typeof b.value==='string'?b.value.trim():'';if(!value||value.length>200)throw err(400,'메시지는 1~200자로 입력해 주세요.');if(profanity.match(value))throw err(400,'욕설과 비속어는 보낼 수 없습니다.');
  const c=await pool.connect();try{await c.query('BEGIN');await pair(c,p.id,b.peer,true);
   const last=(await c.query('SELECT created_at FROM friend_messages WHERE sender=$1 ORDER BY id DESC LIMIT 1',[p.id])).rows[0];if(last&&Date.now()-Number(last.created_at)<500)throw err(429,'조금 천천히 보내 주세요.');
   const recipient=(await c.query('SELECT server FROM users WHERE _id=$1',[b.peer])).rows[0];
   const notify=!!(recipient&&recipient.server!==null&&recipient.server!==undefined&&String(recipient.server)!=='');
   const row=(await c.query('INSERT INTO friend_messages(sender,recipient,sender_name,body,created_at,notify) VALUES($1,$2,$3,$4,$5,$6) RETURNING id::text,sender,sender_name,body,created_at',[p.id,b.peer,String(p.title||p.name||p.nickname||'회원').slice(0,80),value,Date.now(),notify])).rows[0];await c.query('COMMIT');return {message:row,notified:notify};
  }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 });
 route('post','/read',async(req,p)=>{const b=req.body||{};await pair(pool,p.id,b.peer);if(!/^\d+$/.test(String(b.id)))throw err(400,'잘못된 메시지입니다.');await pool.query(`INSERT INTO friend_reads(owner,peer,last_id) SELECT $1,$2,COALESCE(max(id),0) FROM friend_messages WHERE recipient=$1 AND sender=$2 AND id<=$3 ON CONFLICT(owner,peer) DO UPDATE SET last_id=GREATEST(friend_reads.last_id,EXCLUDED.last_id)`,[p.id,b.peer,b.id]);return {ok:true};});
 route('post','/report',async(req,p)=>{const b=req.body||{};if(!/^\d+$/.test(String(b.id)))throw err(400,'잘못된 메시지입니다.');const row=(await pool.query('SELECT * FROM friend_messages WHERE id=$1 AND (sender=$2 OR recipient=$2)',[b.id,p.id])).rows[0];if(!row)throw err(404,'메시지를 찾을 수 없습니다.');await pair(pool,p.id,row.sender===p.id?row.recipient:row.sender);const added=await pool.query('INSERT INTO friend_reports VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING message_id',[row.id,p.id,JSON.stringify(row),Date.now()]);if(added.rowCount)discordReport(row,p.id).catch(e=>console.error('Friend report delivery:',e.message));return {ok:true};});
};
exports.pool=pool;exports.ready=ready;exports.pair=pair;
