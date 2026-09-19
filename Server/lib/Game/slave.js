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

var WebSocket = require('ws');
var File = require('fs');
var Const = require("../const");
var https = require('https');
var Secure = require('../sub/secure');
var Server;
var HTTPS_Server

if(Const.IS_SECURED) {
	const options = Secure();
	HTTPS_Server = https.createServer(options)
		.listen(global.test ? (Const.TEST_PORT + 416) : process.env['KKUTU_PORT']);
	Server = new WebSocket.Server({server: HTTPS_Server});
} else {
	Server = new WebSocket.Server({
		port: global.test ? (Const.TEST_PORT + 416) : process.env['KKUTU_PORT'],
		perMessageDeflate: false
	});
}
var Master = require('./master');
var KKuTu = require('./kkutu');
var Lizard = require('../sub/lizard');
var MainDB = require('../Web/db');
var LocalAuth = require('../Web/local-auth');
var JLog = require('../sub/jjlog');
var GLOBAL = require('../sub/global.json');

var DIC = {};
var DNAME = {};
var ROOM = {};
var RESERVED = {};
var pendingClients = new Set();
var retiredLogins = new Map();
var connectionSequence = 0;

const CHAN = process.env['CHANNEL'];
const DEVELOP = Master.DEVELOP;
const GUEST_PERMISSION = Master.GUEST_PERMISSION;
const ENABLE_ROUND_TIME = Master.ENABLE_ROUND_TIME;
const ENABLE_FORM = Master.ENABLE_FORM;
const MODE_LENGTH = Master.MODE_LENGTH;

JLog.info(`<< KKuTu Server:${Server.options.port} >>`);

process.on('uncaughtException', function(err){
	var text = `:${process.env['KKUTU_PORT']} [${new Date().toLocaleString()}] ERROR: ${err.toString()}\n${err.stack}`;
	
	for(var i in DIC){
		DIC[i].send('dying');
	}
	File.appendFile("../KKUTU_ERROR.log", text, function(res){
		JLog.error(`ERROR OCCURRED! This worker will die in 10 seconds.`);
		console.log(text);
	});
	setTimeout(function(){
		process.exit();
	}, 10000);
});
process.on('message', function(msg){
	switch(msg.type){
		case 'guestName':
			if(!$c.guest || typeof msg.value !== 'string') return;
			var guestName = msg.value.trim().replace(/[^0-9A-Za-z가-힣 _-]/g, '').slice(0, 12);
			if(guestName.length < 2) return $c.sendError(400);
			$c.guestNamed = true;
			delete DNAME[($c.profile.title || '').replace(/\s/g, '')];
			$c.profile.title = guestName + '(손님)';
			$c.profile.name = $c.profile.title;
			DNAME[$c.profile.title.replace(/\s/g, '')] = $c.id;
			$c.publish('user', $c.getData());
			break;
		case "retire-login":
			retiredLogins.set(msg.target, ++connectionSequence);
			pendingClients.forEach(function(c){ if(c.id === msg.target) c.disconnect(); });
			for(var session in RESERVED) if(RESERVED[session].target === msg.target) delete RESERVED[session];
			if(DIC[msg.target]){
				var previous = DIC[msg.target];
				delete RESERVED[previous.sessionId];
				previous.sendError(408);
				previous.disconnect();
			}
			process.send({type: 'login-retired', request: msg.request});
			break;
		case "invite-error":
			if(!DIC[msg.target]) break;
			DIC[msg.target].sendError(msg.code);
			break;
		case "room-reserve":
			if(RESERVED[msg.session]){
				// 이미 입장 요청을 했는데 또 하는 경우
				break;
			}else RESERVED[msg.session] = {
				target: msg.target,
				profile: msg.profile,
				room: msg.room,
				spec: msg.spec,
				pass: msg.pass,
				lateJoin: msg.lateJoin,
				_expiration: setTimeout(function(tg, create){
					process.send({ type: "room-expired", id: msg.room.id, create: create });
					delete RESERVED[tg];
				}, 10000, msg.session, msg.create)
			};
			break;
		case "room-invalid":
			delete ROOM[msg.room.id];
			break;
		default:
			JLog.warn(`Unhandled IPC message type: ${msg.type}`);
	}
});
MainDB.ready = function(){
	JLog.success("DB is ready.");
	KKuTu.init(MainDB, DIC, ROOM, GUEST_PERMISSION);
};
Server.on('connection', function(socket, info){
	if(socket._socket && socket._socket.setNoDelay) socket._socket.setNoDelay(true);
	var connectionOrder = ++connectionSequence;
	var chunk = info.url.slice(1).split('&');
	var key = chunk[0];
	var reserve = RESERVED[key] || {}, room;
	var $c;
	
	socket.on('error', function(err){
		JLog.warn("Error on #" + key + " on ws: " + err.toString());
	});
	if(CHAN != Number(chunk[1])){
		JLog.warn(`Wrong channel value ${chunk[1]} on @${CHAN}`);
		socket.close();
		return;
	}
	if(room = reserve.room){
		if(room._create){
			room._id = room.id;
			delete room.id;
		}
		clearTimeout(reserve._expiration);
		delete reserve._expiration;
		delete RESERVED[key];
	}else{
		JLog.warn(`Not reserved from ${key} on @${CHAN}`);
		socket.close();
		return;
	}
	MainDB.session.findOne([ '_id', key ]).limit([ 'profile', true ]).on(function($body){
		$c = new KKuTu.Client(socket, $body ? $body.profile : null, key);
		if((retiredLogins.get($c.id) || 0) > connectionOrder) return $c.disconnect();
		pendingClients.add($c);
		$c.admin = GLOBAL.ADMIN.indexOf($c.id) != -1 || !!($c.profile && $c.profile.authType === 'local' && $c.profile.developer === true);
		
		/* Enhanced User Block System [S] */
		$c.remoteAddress = GLOBAL.USER_BLOCK_OPTIONS.USE_X_FORWARDED_FOR ? info.connection.remoteAddress : (info.headers['x-forwarded-for'] || info.connection.remoteAddress);
		$c.remoteAddress = String($c.remoteAddress || '').split(',')[0].trim().replace(/^::ffff:/, '');
		if(GLOBAL.USER_BLOCK_OPTIONS.USE_MODULE && ((GLOBAL.USER_BLOCK_OPTIONS.BLOCK_IP_ONLY_FOR_GUEST && $c.guest) || !GLOBAL.USER_BLOCK_OPTIONS.BLOCK_IP_ONLY_FOR_GUEST)){
			MainDB.ip_block.findOne([ '_id', $c.remoteAddress ]).on(function($body){
				if ($body && $body.reasonBlocked) {
					if($body.ipBlockedUntil && Number($body.ipBlockedUntil) < Date.now()) return MainDB.ip_block.update([ '_id', $c.remoteAddress ]).set([ 'reasonBlocked', '' ], [ 'ipBlockedUntil', 0 ]).on();
					$c.blocked = true;
					$c.socket.send(JSON.stringify({
						type: 'error',
						code: 446,
						reasonBlocked: !$body.reasonBlocked ? GLOBAL.USER_BLOCK_OPTIONS.DEFAULT_BLOCKED_TEXT : $body.reasonBlocked,
						ipBlockedUntil: !$body.ipBlockedUntil ? GLOBAL.USER_BLOCK_OPTIONS.BLOCKED_FOREVER : $body.ipBlockedUntil
					}));
					$c.socket.close();
					return;
				}
			});
		}
		/* Enhanced User Block System [E] */
		if(DIC[$c.id]){
			DIC[$c.id].send('error', { code: 408 });
			DIC[$c.id].disconnect();
		}
		if(DEVELOP && !Const.TESTER.includes($c.id)){
			$c.send('error', { code: 500 });
			$c.socket.close();
			return;
		}
		$c.refresh().then(function(ref){
			pendingClients.delete($c);
			if($c.blocked || $c._closed || socket.readyState !== 1) return;
			if(ref.result == 200){
				DIC[$c.id] = $c;
				DNAME[($c.profile.title || $c.profile.name).replace(/\s/g, "")] = $c.id;
				
				$c.enter(room, reserve.spec, reserve.pass, reserve.lateJoin);
				if($c.place == room.id){
					$c.publish('connRoom', { user: $c.getData() });
				}else{ // 입장 실패
					$c.socket.close();
				}
				JLog.info(`Chan @${CHAN} New #${$c.id}`);
			}else{
				$c.send('error', {
					code: ref.result, message: ref.black
				});
				$c._error = ref.result;
				$c.socket.close();
			}
		});
	});
});
Server.on('error', function(err){
	JLog.warn("Error on ws: " + err.toString());
});
KKuTu.onClientMessage = function($c, msg){
	var stable = true;
	var temp;
	var now = (new Date()).getTime();
	
	if(!msg) return;
	
	switch(msg.type){
		case 'dailySpinGet':
			if($c.guest)return $c.send('dailySpin',{guest:true});
			LocalAuth.getDailySpin($c.id).then(function(result){$c.send('dailySpin',result);}).catch(function(){$c.sendError(500);});
			break;
		case 'dailySpinPlay':
			if($c.guest)return $c.send('dailySpin',{guest:true});
			LocalAuth.playDailySpin($c.id).then(function(result){if(!result.already)$c.money=result.money;$c.send('dailySpin',result);}).catch(function(){$c.sendError(500);});
			break;
		case 'dailyQuestGet':
			$c.send('dailyQuest', $c.getDailyQuestData());
			break;
		case 'yutMove':
			temp = $c.subPlace ? $c.pracRoom : ROOM[$c.place];
			if(!temp || !temp.gaming || temp.rule.rule !== 'Yut') return;
			temp.route('yutMove', $c, msg);
			break;
		case 'yutForceRoll':
			if(!$c.admin) return;
			temp = $c.subPlace ? $c.pracRoom : ROOM[$c.place];
			if(!temp || !temp.gaming || temp.rule.rule !== 'Yut') return;
			temp.route('yutForceRoll', $c, msg);
			break;
		case 'yell':
			if(!msg.value) return;
			if(!$c.admin) return;
			
			$c.publish('yell', { value: msg.value });
			break;
		case 'refresh':
			$c.refresh().then(function(result){if(result && result.result===200)$c.send('user',$c.getData());});
			break;
		case 'checkPrediction':
		case 'playerHint':
		case 'usePlayerHint':
			temp = $c.subPlace ? $c.pracRoom : ROOM[$c.place];
			if(!temp || !temp.gaming || (temp.game.late && msg.type !== 'checkPrediction') || temp.rule.rule !== 'Classic') return;
			if(!temp.game.seq.some(function(p){ return p === $c.id; })) return;
			temp.route(msg.type, $c, msg);
			break;
		case 'talk':
			if(!msg.value) return;
			if(!msg.value.substr) return;
			if(!GUEST_PERMISSION.talk) if($c.guest){
				$c.send('error', { code: 401 });
				return;
			}
			if(msg.relay){
				if($c.subPlace) temp = $c.pracRoom;
				else if(!(temp = ROOM[$c.place])) return;
				if(!temp.gaming) return;
				if(temp.game.late){
					$c.chat(msg.value);
				}else if(!temp.game.loading){
					temp.submit($c, msg.value, msg.data);
				}
			}else{
				if($c.admin){
					if(msg.value.charAt() == "#"){
						process.send({ type: "admin", id: $c.id, value: msg.value });
						break;
					}
				}
				if(msg.whisper){
					process.send({ type: "tail-report", id: $c.id, chan: CHAN, place: $c.place, msg: msg });
					msg.whisper.split(',').forEach(v => {
						if(temp = DIC[DNAME[v]]){
							temp.send('chat', { from: $c.profile.title || $c.profile.name, profile: $c.profile, value: msg.value });
						}else{
							$c.sendError(424, v);
						}
					});
				}else{
					$c.chat(msg.value);
				}
			}
			break;
		case 'enter':
		case 'setRoom':
			if(!msg.title) stable = false;
			if(!msg.limit) stable = false;
			if(!msg.round) stable = false;
			if(!msg.time) stable = false;
			if(!msg.opts) stable = false;
			
			msg.code = false;
			msg.limit = Number(msg.limit);
			msg.mode = Number(msg.mode);
			msg.round = Number(msg.round);
			msg.time = Number(msg.time);
			
			if(isNaN(msg.limit)) stable = false;
			if(isNaN(msg.mode)) stable = false;
			if(isNaN(msg.round)) stable = false;
			if(isNaN(msg.time)) stable = false;
			
			if(stable){
				if(msg.title.length > 20) stable = false;
				if(msg.password.length > 20) stable = false;
				if(msg.limit < 2 || msg.limit > 8){
					msg.code = 432;
					stable = false;
				}
				if(msg.mode < 0 || msg.mode >= MODE_LENGTH) stable = false;
				if(msg.round < 1 || msg.round > 10){
					msg.code = 433;
					stable = false;
				}
				if(ENABLE_ROUND_TIME.indexOf(msg.time) == -1) stable = false;
			}
			if(msg.type == 'enter'){
				if(msg.id || stable){
					if(!msg.id && Const.GAME_TYPE[msg.mode] === 'YUT'){
						var serverIndex=Const.MAIN_PORTS.findIndex(function(port){return Number(port)+416===Number(process.env.KKUTU_PORT);});
						LocalAuth.getActiveTheme(serverIndex).then(function(theme){if(theme==='chuseok')$c.enter(msg,msg.spectate);else $c.sendError(431);}).catch(function(){$c.sendError(500);});
					}else $c.enter(msg, msg.spectate);
				}
				else $c.sendError(msg.code || 431);
			}else if(msg.type == 'setRoom'){
				if(stable){
					if(Const.GAME_TYPE[msg.mode] === 'YUT'){
						var serverIndex=Const.MAIN_PORTS.findIndex(function(port){return Number(port)+416===Number(process.env.KKUTU_PORT);});
						LocalAuth.getActiveTheme(serverIndex).then(function(theme){if(theme==='chuseok')$c.setRoom(msg);else $c.sendError(431);}).catch(function(){$c.sendError(500);});
					}else $c.setRoom(msg);
				}
				else $c.sendError(msg.code || 431);
			}
			break;
		case 'leave':
			if(!$c.place) return;
			
			$c.leave();
			break;
		case 'ready':
			if(!$c.place) return;
			if(!GUEST_PERMISSION.ready) if($c.guest) return;
			
			$c.toggle();
			break;
		case 'start':
			if(!$c.place) return;
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if(!GUEST_PERMISSION.start) if($c.guest) return;
			
			$c.start();
			break;
		case 'practice':
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if(!GUEST_PERMISSION.practice) if($c.guest) return;
			if(isNaN(msg.level = Number(msg.level))) return;
			if(ROOM[$c.place].rule.ai){
				if(msg.level < 0 || msg.level >= 5) return;
			}else if(msg.level != -1) return;
			
			$c.practice(msg.level);
			break;
		case 'invite':
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if(ROOM[$c.place].master != $c.id) return;
			if(!GUEST_PERMISSION.invite) if($c.guest) return;
			if(msg.target == "AI"){
				ROOM[$c.place].addAI($c);
			}else{
				process.send({ type: "invite", id: $c.id, place: $c.place, target: msg.target });
			}
			break;
		case 'inviteRes':
			if(!(temp = ROOM[msg.from])) return;
			if(!GUEST_PERMISSION.inviteRes) if($c.guest) return;
			if(msg.res){
				$c.enter({ id: msg.from }, false, true);
			}else{
				if(DIC[temp.master]) DIC[temp.master].send('inviteNo', { target: $c.id });
			}
			break;
		case 'form':
			if(!msg.mode) return;
			if(!ROOM[$c.place]) return;
			if(ENABLE_FORM.indexOf(msg.mode) == -1) return;
			
			$c.setForm(msg.mode);
			break;
		case 'team':
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if($c.ready) return;
			if(isNaN(temp = Number(msg.value))) return;
			if(temp < 0 || temp > 4) return;
			
			$c.setTeam(Math.round(temp));
			break;
		case 'kick':
			if(!msg.robot) if(!(temp = DIC[msg.target])) return;
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if(!msg.robot) if($c.place != temp.place) return;
			if(ROOM[$c.place].master != $c.id) return;
			if(ROOM[$c.place].kickVote) return;
			if(!GUEST_PERMISSION.kick) if($c.guest) return;
			
			if(msg.robot) $c.kick(null, msg.target);
			else $c.kick(msg.target);
			break;
		case 'kickVote':
			if(!(temp = ROOM[$c.place])) return;
			if(!temp.kickVote) return;
			if($c.id == temp.kickVote.target) return;
			if($c.id == temp.master) return;
			if(temp.kickVote.list.indexOf($c.id) != -1) return;
			if(!GUEST_PERMISSION.kickVote) if($c.guest) return;
			
			$c.kickVote($c, msg.agree);
			break;
		case 'handover':
			if(!DIC[msg.target]) return;
			if(!(temp = ROOM[$c.place])) return;
			if(temp.gaming) return;
			if($c.place != DIC[msg.target].place) return;
			if(temp.master != $c.id) return;
			
			temp.master = msg.target;
			temp.export();
			break;
		case 'wp':
			if(!msg.value) return;
			if(!GUEST_PERMISSION.wp) if($c.guest){
				$c.send('error', { code: 401 });
				return;
			}
			
			msg.value = msg.value.substr(0, 200);
			msg.value = msg.value.replace(/[^a-z가-힣]/g, "");
			if(msg.value.length < 2) return;
			break;
		case 'setAI':
			if(!msg.target) return;
			if(!ROOM[$c.place]) return;
			if(ROOM[$c.place].gaming) return;
			if(ROOM[$c.place].master != $c.id) return;
			if(isNaN(msg.level = Number(msg.level))) return;
			if(msg.level < 0 || msg.level >= 5) return;
			if(isNaN(msg.team = Number(msg.team))) return;
			if(msg.team < 0 || msg.team > 4) return;
			
			ROOM[$c.place].setAI(msg.target, Math.round(msg.level), Math.round(msg.team));
			break;
		default:
			break;
	}
};
KKuTu.onClientClosed = function($c, code){
	pendingClients.delete($c);
	if(DIC[$c.id] !== $c) return;
	delete DIC[$c.id];
	if($c.profile) delete DNAME[($c.profile.title || $c.profile.name).replace(/\s/g, "")];
	if($c.socket) $c.socket.removeAllListeners();
	KKuTu.publish('disconnRoom', { id: $c.id });

	JLog.alert(`Chan @${CHAN} Exit #${$c.id}`);
};
