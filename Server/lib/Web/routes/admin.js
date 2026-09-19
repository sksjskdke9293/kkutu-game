/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var File	 = require("fs");
var MainDB	 = require("../db");
var GLOBAL	 = require("../../sub/global.json");
var JLog	 = require("../../sub/jjlog");
var Lizard	 = require("../../sub/lizard.js");
var LocalAuth = require("../local-auth");
var Path = require("path");
var Crypto = require("crypto");

function badgeStorageKey(userId){
	return Crypto.createHash('sha256').update(String(userId || ''), 'utf8').digest('hex');
}

exports.run = function(Server, page){

Server.get("/admin", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	req.session.admin = true;
	res.sendFile(require("path").resolve(__dirname, "../views/admin.html"));
});
Server.get('/user-badge/:id', function(req,res){
	var id=String(req.params.id||'').trim();
	if(!id)return res.status(404).end();
	var base=Path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','user-badge-'+badgeStorageKey(id));
	File.readFile(base,function(error,data){if(error)return res.status(404).end();File.readFile(base+'.type','utf8',function(e,type){res.type(e?'image/png':type).send(data);});});
});
Server.post('/admin/api/accounts/badge', require('body-parser').raw({type:['image/png','image/jpeg','image/webp'],limit:'1mb'}), function(req,res){
	if(!checkAdmin(req,res,true))return;
	var userId=String(req.query.user_id||'').trim(), safe=badgeStorageKey(userId);
	if(!userId||userId.length>160||!Buffer.isBuffer(req.body)||!req.body.length)return res.status(400).send({error:'계정과 배지 이미지를 확인하세요.'});
	MainDB.users.findOne(['_id',userId]).on(function(user){if(!user)return res.status(404).send({error:'계정을 찾을 수 없습니다.'});
		var storageDir=process.env.KKUTU_PRIVATE_DIR || '/kkutu';
		try{ File.mkdirSync(storageDir,{recursive:true}); }catch(error){ return res.status(500).send({error:'배지 저장 공간을 준비하지 못했습니다.'}); }
		var base=Path.join(storageDir,'user-badge-'+safe), url='/user-badge/'+encodeURIComponent(userId)+'?v='+Date.now();
		File.writeFile(base,req.body,function(error){if(error)return res.status(500).send({error:'배지를 저장하지 못했습니다.'});File.writeFile(base+'.type',req.get('content-type')||'image/png',function(){MainDB.users.update(['_id',userId]).set(['adminBadge',url]).on(function(){noticeAdmin(req,'user-badge',userId);res.send({ok:true,url:url});});});});
	});
});
Server.post('/admin/api/accounts/badge/clear', function(req,res){
	if(!checkAdmin(req,res,true))return;
	var userId=String(req.body && req.body.user_id || '').trim();
	if(!userId)return res.status(400).send({error:'게임 계정 ID를 입력하세요.'});
	MainDB.users.findOne(['_id',userId]).on(function(user){
		if(!user)return res.status(404).send({error:'계정을 찾을 수 없습니다.'});
		var base=Path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','user-badge-'+badgeStorageKey(userId));
		MainDB.users.update(['_id',userId]).set(['adminBadge','']).on(function(){
			File.unlink(base,function(){}); File.unlink(base+'.type',function(){});
			noticeAdmin(req,'user-badge-clear',userId); res.send({ok:true});
		});
	});
});
Server.get('/admin/api/server-status', function(req,res){
 if(!checkAdmin(req,res,true)) return;
 LocalAuth.getGameMaintenanceStatus().then(function(status){ res.send(status); })
  .catch(function(){ res.status(500).send({error:'서버 상태를 불러오지 못했습니다.'}); });
});
Server.get('/admin/api/theme', function(req,res){
 if(!checkAdmin(req,res,true))return;
 LocalAuth.getActiveTheme(req.query.server).then(function(theme){res.send({theme:theme});})
  .catch(function(){res.status(500).send({error:'테마 상태를 불러오지 못했습니다.'});});
});
Server.post('/admin/api/theme', function(req,res){
 if(!checkAdmin(req,res,true))return;
 var theme=String(req.body && req.body.theme || '');
 if(theme!=='autumn'&&theme!=='chuseok')return res.status(400).send({error:'테마를 확인하세요.'});
 LocalAuth.setActiveTheme(theme,req.body && req.body.server).then(function(saved){noticeAdmin(req,'site-theme',saved);res.send({ok:true,theme:saved});})
  .catch(function(){res.status(500).send({error:'테마를 변경하지 못했습니다.'});});
});
Server.get('/admin/api/server-access', function(req,res){
 if(!checkAdmin(req,res,true))return;
 LocalAuth.listServerAccess(req.query.server || 2).then(function(list){res.send({list:list});}).catch(function(){res.status(500).send({error:'허용 계정을 불러오지 못했습니다.'});});
});
Server.post('/admin/api/server-access', function(req,res){
 if(!checkAdmin(req,res,true))return;
 var userId=String(req.body && req.body.user_id || '').trim(), server=Number(req.body && req.body.server || 2), remove=req.body && req.body.remove==='true';
 if(!userId)return res.status(400).send({error:'게임 계정 ID를 입력하세요.'});
 (remove?LocalAuth.removeServerAccess(server,userId):LocalAuth.addServerAccess(server,userId)).then(function(resolved){noticeAdmin(req,remove?'server-access-remove':'server-access-add',server,resolved||userId);res.send({ok:true,user_id:resolved||userId});}).catch(function(error){res.status(error.code==='ACCOUNT_NOT_FOUND'?404:500).send({error:error.code==='ACCOUNT_NOT_FOUND'?error.message:'허용 계정을 변경하지 못했습니다.'});});
});
Server.post('/admin/api/server-status', function(req,res){
 if(!checkAdmin(req,res,true)) return;
 var enabled=req.body && (req.body.maintenance==='true'||req.body.maintenance==='1');
 var server=req.body && req.body.server;
 LocalAuth.setGameMaintenance(enabled,server).then(function(status){ noticeAdmin(req,'game-maintenance',server||'all',enabled?'on':'off'); res.send(Object.assign({ok:true},status)); })
  .catch(function(error){ JLog.warn('[ADMIN] maintenance update failed: '+error.toString()); res.status(500).send({error:'서버 상태를 변경하지 못했습니다.'}); });
});
Server.get("/admin/api/account", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var id = String(req.query.id || "").trim();
	if(!id) return res.status(400).send({ error: "계정 ID를 입력하세요." });
	MainDB.users.findOne([ '_id', id ]).on(function(user){
		if(!user) return res.status(404).send({ error: "계정을 찾을 수 없습니다." });
		res.send({ id: user._id, reason: user.black || "", until: user.blockedUntil || 0 });
	});
});
Server.get("/admin/api/ip", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var ip = normalizeIp(req.query.ip);
	if(!ip) return res.status(400).send({ error: "올바른 IP 주소를 입력하세요." });
	MainDB.ip_block.findOne([ '_id', ip ]).on(function(row){
		res.send({ ip: ip, reason: row && row.reasonBlocked || "", until: row && row.ipBlockedUntil || 0 });
	});
});
Server.get("/admin/api/recent", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	MainDB.access_log.direct('SELECT * FROM access_log ORDER BY "connectedAt" DESC LIMIT 100', function(error, result){
		if(error){
			JLog.warn('[ADMIN] recent access lookup failed: ' + error.toString());
			return res.status(500).send({ error: '최근 접속 기록을 불러오지 못했습니다.' });
		}
		res.send({ list: result && result.rows ? result.rows : [] });
	});
});
Server.get("/admin/api/accounts", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var sql = `WITH known AS (
		SELECT user_id FROM local_accounts
		UNION SELECT _id FROM users WHERE _id NOT LIKE 'guest%'
		UNION SELECT "userId" FROM access_log WHERE guest=false AND "userId" IS NOT NULL
	), latest_access AS (
		SELECT DISTINCT ON ("userId") "userId", "displayName" FROM access_log
		WHERE guest=false AND "userId" IS NOT NULL ORDER BY "userId", "connectedAt" DESC
	), first_access AS (
		SELECT "userId", MIN("connectedAt") AS first_seen FROM access_log
		WHERE guest=false AND "userId" IS NOT NULL GROUP BY "userId"
	), active_session AS (
		SELECT DISTINCT ON (profile->>'id') profile->>'id' AS user_id,
			COALESCE(profile->>'title', profile->>'name') AS nickname
		FROM session WHERE profile->>'id' IS NOT NULL ORDER BY profile->>'id', "createdAt" DESC
	)
	SELECT COALESCE(la.username, known.user_id) AS username, known.user_id,
		COALESCE(la.nickname, nickname_override.nickname, active_session.nickname, latest_access."displayName", known.user_id) AS nickname,
		COALESCE(la.developer, false) AS developer,
		COALESCE(la.created_at, first_access.first_seen, 0) AS created_at,
		(la.username IS NOT NULL) AS local_account,
		CASE WHEN la.username IS NOT NULL THEN '로컬' WHEN known.user_id LIKE 'discord-%' THEN 'Discord' ELSE '외부' END AS account_type
	FROM known LEFT JOIN local_accounts la ON la.user_id=known.user_id
	LEFT JOIN account_nickname_overrides nickname_override ON nickname_override.user_id=known.user_id
	LEFT JOIN latest_access ON latest_access."userId"=known.user_id
	LEFT JOIN first_access ON first_access."userId"=known.user_id
	LEFT JOIN active_session ON active_session.user_id=known.user_id
	ORDER BY created_at DESC`;
	MainDB.users.direct(sql, function(error, result){
		if(error){
			JLog.warn('[ADMIN] account list lookup failed: ' + error.toString());
			return res.status(500).send({ error: '계정 목록을 불러오지 못했습니다.' });
		}
		res.send({ list: result && result.rows ? result.rows : [] });
	});
});
Server.get('/admin/api/notices', function(req,res){
	if(!checkAdmin(req,res,true)) return;
	LocalAuth.getSiteNotices().then(function(notices){ res.send(notices); }).catch(function(error){ JLog.warn('[ADMIN] notice load failed: '+error.toString()); res.status(500).send({error:'공지를 불러오지 못했습니다.'}); });
});
Server.post('/admin/api/notices/game-image', require('body-parser').raw({type:['image/png','image/jpeg','image/webp'],limit:'3mb'}), function(req,res){
	if(!checkAdmin(req,res,true)) return;
	if(!Buffer.isBuffer(req.body)||!req.body.length) return res.status(400).send({error:'이미지 파일을 선택하세요.'});
	var file=Path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','game-notice-image');
	File.writeFile(file,req.body,function(error){ if(error)return res.status(500).send({error:'이미지를 저장하지 못했습니다.'}); File.writeFile(file+'.type',req.get('content-type')||'image/png',function(){ res.send({ok:true,url:'/site-notice-image?v='+Date.now()}); }); });
});
Server.get('/admin/api/notice-posts', function(req,res){ if(!checkAdmin(req,res,true))return; LocalAuth.getNoticePosts().then(function(posts){res.send({posts:posts});}).catch(function(){res.status(500).send({error:'공지 목록을 불러오지 못했습니다.'});}); });
Server.post('/admin/api/notice-posts', require('body-parser').raw({type:['image/png','image/jpeg','image/webp'],limit:'3mb'}), function(req,res){
 if(!checkAdmin(req,res,true))return; if(!Buffer.isBuffer(req.body)||!req.body.length)return res.status(400).send({error:'이미지를 선택하세요.'});
 LocalAuth.addNoticePost({image_url:'',target_url:req.query.target_url||''}).then(function(post){ var file=Path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+post.id); File.writeFile(file,req.body,function(error){if(error)return res.status(500).send({error:'이미지를 저장하지 못했습니다.'});File.writeFile(file+'.type',req.get('content-type')||'image/png',function(){LocalAuth.getNoticePosts().then(function(){res.send({ok:true,post:post});});});});}).catch(function(){res.status(500).send({error:'공지를 저장하지 못했습니다.'});});
});
Server.post('/admin/api/notice-posts/:id/delete', function(req,res){ if(!checkAdmin(req,res,true))return; var id=String(req.params.id||'').replace(/[^0-9]/g,''); LocalAuth.deleteNoticePost(id).then(function(ok){if(!ok)return res.status(404).send({error:'공지를 찾을 수 없습니다.'});var base=Path.join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+id);File.unlink(base,function(){});File.unlink(base+'.type',function(){});res.send({ok:true});}).catch(function(){res.status(500).send({error:'공지를 삭제하지 못했습니다.'});}); });
Server.post('/admin/api/notices/:key', function(req,res){
	if(!checkAdmin(req,res,true)) return;
	var key=String(req.params.key||'');
	LocalAuth.saveSiteNotice(key,{enabled:req.body.enabled==='true'||req.body.enabled==='1',title:req.body.title,message:req.body.message,image_url:req.body.image_url,target_url:req.body.target_url})
		.then(function(saved){ if(!saved)return res.status(400).send({error:'공지 종류를 확인하세요.'}); noticeAdmin(req,'notice-save',key); res.send({ok:true}); })
		.catch(function(error){ JLog.warn('[ADMIN] notice save failed: '+error.toString()); res.status(500).send({error:'공지를 저장하지 못했습니다.'}); });
});
Server.post("/admin/api/accounts/discord-nickname", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var userId = String(req.body.user_id || "").trim();
	var nickname = String(req.body.nickname || "").trim().normalize('NFC');
	if(!/^discord-\d+$/.test(userId) || !LocalAuth.validNickname(nickname)) return res.status(400).send({ error: 'Discord 계정과 닉네임을 확인하세요.' });
	LocalAuth.changeDiscordNickname(userId, nickname).then(function(changed){
		if(!changed) return res.status(404).send({ error: 'Discord 계정을 찾을 수 없습니다.' });
		noticeAdmin(req, 'discord-nickname-change', userId, nickname);
		res.send({ ok: true });
	}).catch(function(error){
		if(error.code === '23505') return res.status(409).send({ error: '이미 사용 중인 닉네임입니다.' });
		JLog.warn('[ADMIN] Discord nickname change failed: ' + error.toString());
		res.status(500).send({ error: '닉네임을 변경하지 못했습니다.' });
	});
});
Server.post("/admin/api/accounts/password", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var username = String(req.body.username || "").trim().toLowerCase();
	var password = String(req.body.password || "");
	if(!LocalAuth.validUsername(username) || password.length < 8 || password.length > 128){
		return res.status(400).send({ error: '새 비밀번호는 8~128자로 입력하세요.' });
	}
	LocalAuth.resetPassword(username, password).then(function(changed){
		if(!changed) return res.status(404).send({ error: '계정을 찾을 수 없습니다.' });
		noticeAdmin(req, 'password-reset', username);
		res.send({ ok: true });
	}).catch(function(error){
		JLog.warn('[ADMIN] password reset failed: ' + error.toString());
		res.status(500).send({ error: '비밀번호를 변경하지 못했습니다.' });
	});
});
Server.post("/admin/api/accounts/nickname", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var username = String(req.body.username || "").trim().toLowerCase();
	var nickname = String(req.body.nickname || "").trim().normalize('NFC');
	if(!LocalAuth.validUsername(username) || !LocalAuth.validNickname(nickname)) return res.status(400).send({ error: '닉네임은 한글·영문·숫자·_ 2~20자로 입력하세요.' });
	LocalAuth.changeNickname(username, nickname).then(function(changed){
		if(!changed) return res.status(404).send({ error: '계정을 찾을 수 없습니다.' });
		noticeAdmin(req, 'nickname-change', username, nickname);
		res.send({ ok: true });
	}).catch(function(error){
		if(error.code === '23505') return res.status(409).send({ error: '이미 사용 중인 닉네임입니다.' });
		JLog.warn('[ADMIN] nickname change failed: ' + error.toString());
		res.status(500).send({ error: '닉네임을 변경하지 못했습니다.' });
	});
});
Server.post("/admin/api/accounts/delete", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var username = String(req.body.username || "").trim().toLowerCase();
	if(!LocalAuth.validUsername(username)) return res.status(400).send({ error: '계정 ID를 확인하세요.' });
	LocalAuth.deleteAccount(username).then(function(deleted){
		if(!deleted) return res.status(400).send({ error: '계정을 찾을 수 없거나 운영자 계정은 삭제할 수 없습니다.' });
		noticeAdmin(req, 'account-delete', username);
		res.send({ ok: true });
	}).catch(function(error){
		JLog.warn('[ADMIN] account delete failed: ' + error.toString());
		res.status(500).send({ error: '계정을 삭제하지 못했습니다.' });
	});
});
Server.post("/admin/api/account/block", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var id = String(req.body.id || "").trim();
	var reason = String(req.body.reason || "운영정책 위반").trim().slice(0, 200);
	var until = blockUntil(req.body.duration);
	if(!id || until === null) return res.status(400).send({ error: "입력값을 확인하세요." });
	MainDB.users.findOne([ '_id', id ]).on(function(user){
		if(!user) return res.status(404).send({ error: "계정을 찾을 수 없습니다." });
		MainDB.users.update([ '_id', id ]).set([ 'black', reason ], [ 'blockedUntil', until ]).on(function(){
			noticeAdmin(req, "account-block", id, reason, until || "permanent");
			res.send({ ok: true });
		});
	});
});
Server.post("/admin/api/account/unblock", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var id = String(req.body.id || "").trim();
	if(!id) return res.status(400).send({ error: "계정 ID를 입력하세요." });
	MainDB.users.update([ '_id', id ]).set([ 'black', '' ], [ 'blockedUntil', 0 ]).on(function(){
		noticeAdmin(req, "account-unblock", id); res.send({ ok: true });
	});
});
Server.post("/admin/api/ip/block", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var ip = normalizeIp(req.body.ip);
	var reason = String(req.body.reason || "운영정책 위반").trim().slice(0, 200);
	var until = blockUntil(req.body.duration);
	if(!ip || until === null) return res.status(400).send({ error: "입력값을 확인하세요." });
	MainDB.ip_block.upsert([ '_id', ip ]).set([ 'reasonBlocked', reason ], [ 'ipBlockedUntil', until ]).on(function(){
		noticeAdmin(req, "ip-block", ip, reason, until || "permanent"); res.send({ ok: true });
	});
});
Server.post("/admin/api/ip/unblock", function(req, res){
	if(!checkAdmin(req, res, true)) return;
	var ip = normalizeIp(req.body.ip);
	if(!ip) return res.status(400).send({ error: "올바른 IP 주소를 입력하세요." });
	MainDB.ip_block.update([ '_id', ip ]).set([ 'reasonBlocked', '' ], [ 'ipBlockedUntil', 0 ]).on(function(){
		noticeAdmin(req, "ip-unblock", ip); res.send({ ok: true });
	});
});

Server.get("/gwalli", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	req.session.admin = true;
	page(req, res, "gwalli");
});
Server.get("/gwalli/injeong", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	MainDB.kkutu_injeong.find([ 'theme', { $not: "~" } ]).limit(100).on(function($list){
		res.send({ list: $list });
	});
});
Server.get("/gwalli/gamsi", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	MainDB.users.findOne([ '_id', req.query.id ]).limit([ 'server', true ]).on(function($u){
		if(!$u) return res.sendStatus(404);
		var data = { _id: $u._id, server: $u.server };
		
		MainDB.session.findOne([ 'profile.id', $u._id ]).limit([ 'profile', true ]).on(function($s){
			if($s) data.title = $s.profile.title || $s.profile.name;
			res.send(data);
		});
	});
});
Server.get("/gwalli/users", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	if(req.query.name){
		MainDB.session.find([ 'profile.title', req.query.name ]).on(function($u){
			if($u) return onSession($u);
			MainDB.session.find([ 'profile.name', req.query.name ]).on(function($u){
				if($u) return onSession($u);
				res.sendStatus(404);
			});
		});
	}else{
		MainDB.users.findOne([ '_id', req.query.id ]).on(function($u){
			if($u) return res.send({ list: [ $u ] });
			res.sendStatus(404);
		});
	}
	function onSession(list){
		var board = {};
		
		Lizard.all(list.map(function(v){
			if(board[v.profile.id]) return null;
			else{
				board[v.profile.id] = true;
				return getProfile(v.profile.id);
			}
		})).then(function(data){
			res.send({ list: data });
		});
	}
	function getProfile(id){
		var R = new Lizard.Tail();
		
		if(id) MainDB.users.findOne([ '_id', id ]).on(function($u){
			R.go($u);
		}); else R.go(null);
		return R;
	}
});
Server.get("/gwalli/kkutudb/:word", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	var TABLE = MainDB.kkutu[req.query.lang];
	
	if(!TABLE) return res.sendStatus(400);
	if(!TABLE.findOne) return res.sendStatus(400);
	TABLE.findOne([ '_id', req.params.word ]).on(function($doc){
		res.send($doc);
	});
});
Server.get("/gwalli/kkututheme", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	var TABLE = MainDB.kkutu[req.query.lang];
	
	if(!TABLE) return res.sendStatus(400);
	if(!TABLE.find) return res.sendStatus(400);
	TABLE.find([ 'theme', new RegExp(req.query.theme) ]).limit([ '_id', true ]).on(function($docs){
		res.send({ list: $docs.map(v => v._id) });
	});
});
Server.get("/gwalli/kkutuhot", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	File.readFile(GLOBAL.KKUTUHOT_PATH, function(err, file){
		var data = JSON.parse(file.toString());
		
		parseKKuTuHot().then(function($kh){
			res.send({ prev: data, data: $kh });
		});
	});
});
Server.get("/gwalli/shop/:key", function(req, res){
	if(!checkAdmin(req, res)) return;
	
	var q = (req.params.key == "~ALL") ? undefined : [ '_id', req.params.key ];
	
	MainDB.kkutu_shop.find(q).on(function($docs){
		MainDB.kkutu_shop_desc.find(q).on(function($desc){
			res.send({ goods: $docs, desc: $desc });
		});
	});
});
Server.post("/gwalli/injeong", function(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	
	var list = JSON.parse(req.body.list).list;
	var themes;
	
	list.forEach(function(v){
		if(v.ok){
			req.body.nof = true;
			req.body.lang = "ko";
			v.theme.split(',').forEach(function(w, i){
				setTimeout(function(lid, x){
					req.body.list = lid;
					req.body.theme = x;
					onKKuTuDB(req, res);
				}, i * 1000, v._id.replace(/[^가-힣0-9]/g, ""), w);
			});
		}else{
			MainDB.kkutu_injeong.update([ '_id', v._origin ]).set([ 'theme', "~" ]).on();
		}
		// MainDB.kkutu_injeong.remove([ '_id', v._origin ]).on();
	});
	res.sendStatus(200);
});
Server.post("/gwalli/kkutudb", onKKuTuDB);
function onKKuTuDB(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	
	var theme = req.body.theme;
	var list = req.body.list;
	var TABLE = MainDB.kkutu[req.body.lang];
	
	if(list) list = list.split(/[,\r\n]+/);
	else return res.sendStatus(400);
	if(!TABLE) return res.sendStatus(400);
	if(!TABLE.insert) return res.sendStatus(400);
	
	noticeAdmin(req, theme, list.length);
	list.forEach(function(item){
		if(!item) return;
		item = item.trim();
		if(!item.length) return;
		TABLE.findOne([ '_id', item ]).on(function($doc){
			if(!$doc) return TABLE.insert([ '_id', item ], [ 'type', "INJEONG" ], [ 'theme', theme ], [ 'mean', "＂1＂" ], [ 'flag', 2 ]).on();
			var means = $doc.mean.split(/＂[0-9]+＂/g).slice(1);
			var len = means.length;
			
			if($doc.theme.indexOf(theme) == -1){
				$doc.type += ",INJEONG";
				$doc.theme += "," + theme;
				$doc.mean += `＂${len+1}＂`;
				TABLE.update([ '_id', item ]).set([ 'type', $doc.type ], [ 'theme', $doc.theme ], [ 'mean', $doc.mean ]).on();
			}else{
				JLog.warn(`Word '${item}' already has the theme '${theme}'!`);
			}
		});
	});
	if(!req.body.nof) res.sendStatus(200);
}
Server.post("/gwalli/kkutudb/:word", function(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	var TABLE = MainDB.kkutu[req.body.lang];
	var data = JSON.parse(req.body.data);
	
	if(!TABLE) return res.sendStatus(400);
	if(!TABLE.upsert) return res.sendStatus(400);
	
	noticeAdmin(req, data._id);
	if(data.mean == ""){
		TABLE.remove([ '_id', data._id ]).on(function($res){
			res.send($res.toString());
		});
	}else{
		TABLE.upsert([ '_id', data._id ]).set([ 'flag', data.flag ], [ 'type', data.type ], [ 'theme', data.theme ], [ 'mean', data.mean ]).on(function($res){
			res.send($res.toString());
		});
	}
});
Server.post("/gwalli/kkutuhot", function(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	
	noticeAdmin(req);
	parseKKuTuHot().then(function($kh){
		var i, j, obj = {};
		
		for(i in $kh){
			for(j in $kh[i]){
				obj[$kh[i][j]._id] = $kh[i][j].hit;
			}
		}
		File.writeFile(GLOBAL.KKUTUHOT_PATH, JSON.stringify(obj), function(err){
			res.send(err);
		});
	});
});
Server.post("/gwalli/users", function(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	
	var list = JSON.parse(req.body.list).list;
	
	list.forEach(function(item){
		MainDB.users.upsert([ '_id', item._id ]).set(item).on();
	});
	res.sendStatus(200);
});
Server.post("/gwalli/shop", function(req, res){
	if(!checkAdmin(req, res)) return;
	if(req.body.pw != GLOBAL.PASS) return res.sendStatus(400);
	
	var list = JSON.parse(req.body.list).list;
	
	list.forEach(function(item){
		item.core.options = JSON.parse(item.core.options);
		MainDB.kkutu_shop.upsert([ '_id', item._id ]).set(item.core).on();
		MainDB.kkutu_shop_desc.upsert([ '_id', item._id ]).set(item.text).on();
	});
	res.sendStatus(200);
});

};
function noticeAdmin(req, ...args){
	JLog.info(`[ADMIN] ${req.originalUrl} ${req.ip} | ${args.join(' | ')}`);
}
function checkAdmin(req, res, hide){
	if(global.isPublic){
		if(req.session.profile){
			var localDeveloper = req.session.profile.authType === 'local' && req.session.profile.developer === true;
			if(GLOBAL.ADMIN.indexOf(req.session.profile.id) == -1 && !localDeveloper){
				req.session.admin = false;
				return hide ? (res.sendStatus(404), false) : (res.send({ error: 400 }), false);
			}
		}else{
			req.session.admin = false;
			return hide ? (res.sendStatus(404), false) : (res.send({ error: 400 }), false);
		}
	}
	return true;
}
function normalizeIp(value){
	var ip = String(value || "").trim().replace(/^::ffff:/, "");
	return (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip) || /^[0-9a-f:]+$/i.test(ip)) ? ip : "";
}
function blockUntil(duration){
	if(duration === "permanent") return 0;
	var minutes = parseInt(duration, 10);
	if(!isFinite(minutes) || minutes < 1 || minutes > 5256000) return null;
	return Date.now() + minutes * 60000;
}
function parseKKuTuHot(){
	var R = new Lizard.Tail();
		
	Lizard.all([
		query(`SELECT * FROM kkutu_ko WHERE hit > 0 ORDER BY hit DESC LIMIT 50`),
		query(`SELECT * FROM kkutu_ko WHERE _id ~ '^...$' AND hit > 0 ORDER BY hit DESC LIMIT 50`),
		query(`SELECT * FROM kkutu_ko WHERE type = 'INJEONG' AND hit > 0 ORDER BY hit DESC LIMIT 50`),
		query(`SELECT * FROM kkutu_en WHERE hit > 0 ORDER BY hit DESC LIMIT 50`)
	]).then(function($docs){
		R.go($docs);
	});
	function query(q){
		var R = new Lizard.Tail();
		
		MainDB.kkutu['ko'].direct(q, function(err, $docs){
			if(err) return JLog.error(err.toString());
			R.go($docs.rows);
		});
		return R;
	}
	return R;
}
