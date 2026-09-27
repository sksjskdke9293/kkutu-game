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

var Cluster = require("cluster");
var File = require('fs');
var WebSocket = require('ws');
var https = require('https');
var HTTPS_Server;
// var Heapdump = require("heapdump");
var KKuTu = require('./kkutu');
var GLOBAL = require("../sub/global.json");
var Const = require("../const");
var JLog = require('../sub/jjlog');
var Secure = require('../sub/secure');
var Recaptcha = require('../sub/recaptcha');
var LocalAuth = require('../Web/local-auth');

var MainDB;

var Server;
var DIC = {};
var DNAME = {};
var ROOM = {};
var matchPending = new Map();
function openAutoMatchRoom(players, room, ranked) {
	matchPending.set(players[0].id, {players: players, room: room});
	players[0].enter(room);
	setTimeout(function(){
		if(matchPending.has(players[0].id)) {
			matchPending.delete(players[0].id);
			players.forEach(function(c){ c.send('match', {state:'cancelled', ranked: !!ranked, message:'방 연결에 실패했습니다. 다시 시도해 주세요.'}); });
		}
	}, 15000);
}
var matchmaker = require('./matchmaker')(DIC, function(players, dictionary) {
	openAutoMatchRoom(players, {title: '빠른 시작', password: Math.random().toString(36).slice(2, 18), limit: 2,
		mode: Const.GAME_TYPE.indexOf('KSH'), round: 3, time: 60, opts: {dictionary: dictionary}, _autoMatch: true}, false);
});
var rankedMatchmaker = require('./matchmaker')(DIC, function(players, dictionary) {
	// Ranked matches are server-created only.  This keeps their rules fixed
	// and prevents them from being made through the ordinary room dialog.
	openAutoMatchRoom(players, {title: '순위전', password: Math.random().toString(36).slice(2, 18), limit: 2,
		mode: Const.GAME_TYPE.indexOf('KSH'), round: 3, time: 60, opts: {dictionary: dictionary}, _autoMatch: true, ranked: true}, true);
}, {ranked: true, dictionary: 'standard'});

var T_ROOM = {};
var T_USER = {};

var SID;
var WDIC = {};
var discordChat;
var discordStatus;
var discordPasswordTickets;
var latestLogin;
var maintenanceActive = false;
var MODERATED_CHAT = Symbol('moderatedChat');

const DEVELOP = exports.DEVELOP = global.test || false;
const GUEST_PERMISSION = exports.GUEST_PERMISSION = {
	'create': true,
	'enter': true,
	'talk': true,
	'practice': true,
	'ready': true,
	'start': true,
	'invite': true,
	'inviteRes': true,
	'kick': true,
	'kickVote': true,
	'wp': true
};
const ENABLE_ROUND_TIME = exports.ENABLE_ROUND_TIME = [ 5, 10, 30, 60, 90, 120, 150 ];
const ENABLE_FORM = exports.ENABLE_FORM = [ "S", "J" ];
const MODE_LENGTH = exports.MODE_LENGTH = Const.GAME_TYPE.length;
const PORT = process.env['KKUTU_PORT'];

process.on('uncaughtException', function(err){
	var text = `:${PORT} [${new Date().toLocaleString()}] ERROR: ${err.toString()}\n${err.stack}\n`;
	
	File.appendFile("/jjolol/KKUTU_ERROR.log", text, function(res){
		JLog.error(`ERROR OCCURRED ON THE MASTER!`);
		console.log(text);
	});
});
function processAdmin(id, value){
	var cmd, temp, i, j;
	
	value = value.replace(/^(#\w+\s+)?(.+)/, function(v, p1, p2){
		if(p1) cmd = p1.slice(1).trim();
		return p2;
	});
	switch(cmd){
		case "yell":
			KKuTu.publish('yell', { value: value });
			return null;
		case "kill":
			if(temp = DIC[value]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		case "tailroom":
			if(temp = ROOM[value]){
				if(T_ROOM[value] == id){
					i = true;
					delete T_ROOM[value];
				}else T_ROOM[value] = id;
				if(DIC[id]) DIC[id].send('tail', { a: i ? "trX" : "tr", rid: temp.id, id: id, msg: { pw: temp.password, players: temp.players } });
			}
			return null;
		case "tailuser":
			if(temp = DIC[value]){
				if(T_USER[value] == id){
					i = true;
					delete T_USER[value];
				}else T_USER[value] = id;
				temp.send('test');
				if(DIC[id]) DIC[id].send('tail', { a: i ? "tuX" : "tu", rid: temp.id, id: id, msg: temp.getData() });
			}
			return null;
		case "dump":
			if(DIC[id]) DIC[id].send('yell', { value: "This feature is not supported..." });
			/*Heapdump.writeSnapshot("/home/kkutu_memdump_" + Date.now() + ".heapsnapshot", function(err){
				if(err){
					JLog.error("Error when dumping!");
					return JLog.error(err.toString());
				}
				if(DIC[id]) DIC[id].send('yell', { value: "DUMP OK" });
				JLog.success("Dumping success.");
			});*/
			return null;
		/* Enhanced User Block System [S] */
		case 'ban':
			try {
				var args = value.split(",");
				if(args.length == 2){
					MainDB.users.update([ '_id', args[0].trim() ]).set([ 'black', args[1].trim() ]).on();
				}else if(args.length == 3){
					MainDB.users.update([ '_id', args[0].trim() ]).set([ 'black', args[1].trim() ], [ 'blockedUntil', addDate(parseInt(args[2].trim())) ]).on();				
				}else return null;
				
				JLog.info(`[Block] 사용자 #${args[0].trim()}(이)가 이용제한 처리되었습니다.`);
				
				if(temp = DIC[args[0].trim()]){
					temp.socket.send('{"type":"error","code":410}');
					temp.socket.close();
				}
			}catch(e){
				processAdminErrorCallback(e, id);
			}
			return null;
		case 'ipban':
			try {
				var args = value.split(",");
				if(args.length == 2){
					MainDB.ip_block.update([ '_id', args[0].trim() ]).set([ 'reasonBlocked', args[1].trim() ]).on();
				}else if(args.length == 3){
					MainDB.ip_block.update([ '_id', args[0].trim() ]).set([ 'reasonBlocked', args[1].trim() ], [ 'ipBlockedUntil', addDate(parseInt(args[2].trim())) ]).on();				
				}else return null;
				
				JLog.info(`[Block] IP 주소 ${args[0].trim()}(이)가 이용제한 처리되었습니다.`);
			}catch(e){
				processAdminErrorCallback(e, id);
			}
			return null;
		case 'unban':
			try {
				MainDB.users.update([ '_id', value ]).set([ 'black', '' ], [ 'blockedUntil', 0 ]).on();
				JLog.info(`[Block] 사용자 #${value}(이)가 이용제한 해제 처리되었습니다.`);
			}catch(e){
				processAdminErrorCallback(e, id);
			}
			return null;
		case 'ipunban':
			try {
				MainDB.ip_block.update([ '_id', value ]).set([ 'reasonBlocked', '' ], [ 'ipBlockedUntil', 0 ]).on();
				JLog.info(`[Block] IP 주소 ${value}(이)가 이용제한 해제 처리되었습니다.`);
			}catch(e){
				processAdminErrorCallback(e, id);
			}
			return null;
		/* Enhanced User Block System [E] */
	}
	return value;
}
/* Enhanced User Block System [S] */
function addDate(num){
	if(isNaN(num)) return;
	return Date.now() + num * 24 * 60 * 60 * 1000;
}

function processAdminErrorCallback(error, id){
	DIC[id].send('notice', { value: `명령을 처리하는 도중 오류가 발생하였습니다: ${error}` });
	JLog.warn(`[Block] 명령을 처리하는 도중 오류가 발생하였습니다: ${error}`);
}
/* Enhanced User Block System [E] */
function checkTailUser(id, place, msg){
	var temp;
	
	if(temp = T_USER[id]){
		if(!DIC[temp]){
			delete T_USER[id];
			return;
		}
		DIC[temp].send('tail', { a: "user", rid: place, id: id, msg: msg });
	}
}
function narrateFriends(id, friends, stat){
	if(!friends) return;
	var fl = Object.keys(friends);
	
	if(!fl.length) return;
	
	MainDB.users.find([ '_id', { $in: fl } ], [ 'server', /^\w+$/ ]).limit([ 'server', true ]).on(function($fon){
		var i, sf = {}, s;
		
		for(i in $fon){
			if(!sf[s = $fon[i].server]) sf[s] = [];
			sf[s].push($fon[i]._id);
		}
		if(DIC[id]) DIC[id].send('friends', { list: sf });
		
		if(sf[SID]){
			KKuTu.narrate(sf[SID], 'friend', { id: id, s: SID, stat: stat });
			delete sf[SID];
		}
		for(i in WDIC){
			WDIC[i].send('narrate-friend', { id: id, s: SID, stat: stat, list: sf });
			break;
		}
	});
}
Cluster.on('message', function(worker, msg){
	var temp;
	
	switch(msg.type){
		case "login-retired":
			if(latestLogin) latestLogin.ack(worker, msg);
			break;
		case "discord-chat-out":
			if(discordChat) discordChat.send(msg.data);
			break;
		case "chat-report":
			if(discordChat) discordChat.report(msg.report, msg.reporter);
			break;
		case "profanity-event":
			if(discordChat) discordChat.violation(msg.event);
			break;
		case "admin":
			if(DIC[msg.id] && DIC[msg.id].admin) processAdmin(msg.id, msg.value);
			break;
		case "tail-report":
			if(temp = T_ROOM[msg.place]){
				if(!DIC[temp]) delete T_ROOM[msg.place];
				DIC[temp].send('tail', { a: "room", rid: msg.place, id: msg.id, msg: msg.msg });
			}
			checkTailUser(msg.id, msg.place, msg.msg);
			break;
		case "okg":
			if(DIC[msg.id]) DIC[msg.id].onOKG(msg.time);
			break;
		case "kick":
			if(DIC[msg.target]) DIC[msg.target].socket.close();
			break;
		case "invite":
			if(!DIC[msg.target]){
				worker.send({ type: "invite-error", target: msg.id, code: 417 });
				break;
			}

			if(!GUEST_PERMISSION.invite) if(DIC[msg.target].guest){
				worker.send({ type: "invite-error", target: msg.id, code: 422 });
				break;
			}
			if(DIC[msg.target]._invited){
				worker.send({ type: "invite-error", target: msg.id, code: 419 });
				break;
			}
			DIC[msg.target]._invited = msg.place;
			DIC[msg.target].send('invited', { from: msg.place, inviterName: DIC[msg.id] && (DIC[msg.id].profile.title || DIC[msg.id].profile.name) });
			break;
		case "room-new":
			if(ROOM[msg.room.id] || !DIC[msg.target]){ // 이미 그런 ID의 방이 있다... 그 방은 없던 걸로 해라.
				worker.send({ type: "room-invalid", room: msg.room });
			}else{
				ROOM[msg.room.id] = new KKuTu.Room(msg.room, msg.room.channel);
				var pending = matchPending.get(msg.target);
				if(pending) {
					matchPending.delete(msg.target);
					var peer = pending.players[1];
					if(DIC[peer.id] === peer && !peer.place && peer.socket.readyState === 1)
						peer.enter({id: msg.room.id, password: pending.room.password}, false, true);
					else pending.players[0].send('match', {state:'cancelled', message:'상대방 연결이 끊겼습니다. 방에서 나가 다시 매칭해 주세요.'});
				}
			}
			break;
		case "room-come":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].come(DIC[msg.target]);
			}else{
				JLog.warn(`Wrong room-come id=${msg.id}&target=${msg.target}`);
			}
			break;
		case "room-spectate":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].spectate(DIC[msg.target], msg.pw);
			}else{
				JLog.warn(`Wrong room-spectate id=${msg.id}&target=${msg.target}`);
			}
			break;
		case "room-go":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].go(DIC[msg.target]);
			}else{
				// 나가기 말고 연결 자체가 끊겼을 때 생기는 듯 하다.
				JLog.warn(`Wrong room-go id=${msg.id}&target=${msg.target}`);
				if(ROOM[msg.id] && ROOM[msg.id].players){
					// 이 때 수동으로 지워준다.
					var x = ROOM[msg.id].players.indexOf(msg.target);
					
					if(x != -1){
						ROOM[msg.id].players.splice(x, 1);
						JLog.warn(`^ OK`);
					}
				}
				if(msg.removed) delete ROOM[msg.id];
			}
			break;
		case "user-publish":
			if(temp = DIC[msg.data.id]){
				for(var i in msg.data){
					temp[i] = msg.data[i];
				}
				if(temp.guest && msg.data.profile){
					var publishedGuestName = String(msg.data.profile.title || msg.data.profile.name || '').replace(/\(손님\)$/, '');
					MainDB.access_log.update([ 'userId', temp.id.replace('guest__', '') ]).set([ 'displayName', (temp.profile.guestNumber || '손님') + '(' + publishedGuestName + ')' ]).on();
				}
			}
			break;
		case "room-publish":
			if(temp = ROOM[msg.data.room.id]){
				for(var i in msg.data.room){
					temp[i] = msg.data.room[i];
				}
				temp.password = msg.password;
			}
			KKuTu.publish('room', msg.data);
			break;
		case "ranked-room-finished":
			if((temp = ROOM[msg.id]) && temp.ranked){
				// Keep the room object until its result viewers leave so normal
				// room-go bookkeeping can reset their lobby state. It is hidden
				// immediately from both new joins and the public room list.
				temp._rankedClosed = true;
				KKuTu.publish('rankedRoomClosed', { id: msg.id });
			}
			break;
		case "room-expired":
			if(msg.create && ROOM[msg.id]){
				for(var i in ROOM[msg.id].players){
					var $c = DIC[ROOM[msg.id].players[i]];
					
					if($c) $c.send('roomStuck');
				}
				delete ROOM[msg.id];
			}
			break;
		case "room-invalid":
			delete ROOM[msg.room.id];
			break;
		default:
			JLog.warn(`Unhandled IPC message type: ${msg.type}`);
	}
});
exports.init = function(_SID, CHAN){
	SID = _SID;
	latestLogin = require('./latest-login').create(DIC, CHAN);
	discordChat = require('./discord-chat').create({
		log: function(message){ JLog.warn(message); },
		onModerate: function(action, report){
			var reason = '채팅 신고 처리: ' + String(report.value || '').slice(0, 80);
			if(action === 'account'){
				if(report.guest) return Promise.resolve({ok:false, message:'손님은 일반 밴 대신 IP 밴을 사용해 주세요.'});
				return new Promise(function(resolve){ MainDB.users.update(['_id', report.id]).set(['black', reason], ['blockedUntil', 0]).on(function(){
					if(DIC[report.id]){ DIC[report.id].send('error',{code:444,message:reason,blockedUntil:0}); DIC[report.id].disconnect(); }
					resolve({ok:true, message:'일반 밴이 적용되었습니다.'});
				}); });
			}
			if(action === 'ip') return new Promise(function(resolve){ MainDB.ip_block.upsert(['_id', report.ip]).set(['reasonBlocked', reason], ['ipBlockedUntil', 0]).on(function(){
				Object.keys(DIC).forEach(function(id){ var c=DIC[id]; if(c && c.remoteAddress === report.ip && !c.admin){ c.send('error',{code:446,reasonBlocked:reason,ipBlockedUntil:0}); c.disconnect(); } });
				resolve({ok:true, message:'IP 밴이 적용되었습니다.'});
			}); });
			if(action === 'ipunban') return new Promise(function(resolve){ MainDB.ip_block.update(['_id', report.ip]).set(['reasonBlocked', ''], ['ipBlockedUntil', 0]).on(function(){
				MainDB.profanity_warning.update(['_id', report.ip]).set(['count', 0], ['updatedAt', Date.now()]).on(function(){ resolve({ok:true, message:'IP 밴과 욕설 경고 누적이 해제되었습니다.'}); });
			}); });
			return Promise.resolve({ok:false, message:'지원하지 않는 처리입니다.'});
		},
		onMessage: function(message){
			// Every player retains this master socket, including players in rooms.
			// Send once here, never again through a worker or Client.chat().
			for(var id in DIC) DIC[id].send('discordChat', message);
		}
	});
	process.on('discord-chat-out', function(message){ discordChat.send(message); });
	discordChat.start();
	discordStatus = require('./discord-status').create({
		log: function(message){ JLog.warn(message); },
		getCount: function(){ return Object.keys(DIC).length; },
		env: SID === '0' ? process.env : {}
	});
	discordStatus.start();
	discordPasswordTickets = require('./discord-password-tickets').create({
		log: function(message){ JLog.warn(message); },
		env: SID === '0' ? process.env : {}
	});
	discordPasswordTickets.start();
	MainDB = require('../Web/db');
	MainDB.ready = function(){
		JLog.success("Master DB is ready.");
		function refreshMaintenance(){
			LocalAuth.getGameMaintenanceStatus().then(function(status){
				var active=!!status.maintenance || !!(status.servers||[])[Number(SID)];
				if(active && !maintenanceActive){
					Object.keys(DIC).forEach(function(id){
						var client=DIC[id];
						if(!client || client.admin) return;
						client.send('error',{code:503,message:'서버 점검 중입니다.'});
						client.disconnect();
					});
				}
				maintenanceActive=active;
			}).catch(function(error){ JLog.warn('Maintenance status check failed: '+error.toString()); });
		}
		refreshMaintenance();
		setInterval(refreshMaintenance, 2000);
		setInterval(function(){Object.keys(DIC).forEach(function(id){var client=DIC[id];if(!client||client.guest||client._closed||!client._loginToken)return;LocalAuth.ownsGameLogin(client.id,client._loginToken).then(function(owned){if(!owned&&!client._closed){client._replaced=true;client.sendError(408);client.disconnect();}}).catch(function(){});});},1000);
		
		MainDB.users.update([ 'server', SID ]).set([ 'server', "" ]).on();
		setInterval(function(){
			Object.keys(DIC).forEach(function(id){
				var client = DIC[id];
				if(!client || client._closed || client.admin) return;
				if(client.guest && GLOBAL.USER_BLOCK_OPTIONS.USE_MODULE){
					MainDB.ip_block.findOne([ '_id', client.remoteAddress ]).on(function(row){
						if(!row || !row.reasonBlocked) return;
						if(row.ipBlockedUntil && Number(row.ipBlockedUntil) < Date.now()) return MainDB.ip_block.update([ '_id', client.remoteAddress ]).set([ 'reasonBlocked', '' ], [ 'ipBlockedUntil', 0 ]).on();
						client.send('error', { code: 446, reasonBlocked: row.reasonBlocked, ipBlockedUntil: row.ipBlockedUntil || GLOBAL.USER_BLOCK_OPTIONS.BLOCKED_FOREVER });
						client.disconnect();
					});
				}else if(!client.guest){
					MainDB.users.findOne([ '_id', client.id ]).limit([ 'black', true ], [ 'blockedUntil', true ], [ 'server', true ]).on(function(row){
						if(row && row.server && String(row.server) !== String(SID)){
							client._replaced = true;
							client.sendError(408);
							return client.disconnect();
						}
						if(!row || !row.black) return;
						if(row.blockedUntil && Number(row.blockedUntil) < Date.now()) return MainDB.users.update([ '_id', client.id ]).set([ 'black', '' ], [ 'blockedUntil', 0 ]).on();
						client.send('error', { code: 444, message: row.black, blockedUntil: row.blockedUntil || 0 });
						client.disconnect();
					});
				}
			});
		}, 3000);
		if(Const.IS_SECURED) {
			const options = Secure();
			HTTPS_Server = https.createServer(options)
				.listen(global.test ? (Const.TEST_PORT + 416) : process.env['KKUTU_PORT']);
			Server = new WebSocket.Server({server: HTTPS_Server, perMessageDeflate: false});
		} else {
			Server = new WebSocket.Server({
				port: global.test ? (Const.TEST_PORT + 416) : process.env['KKUTU_PORT'],
				perMessageDeflate: false
			});
		}
		Server.on('connection', function(socket, info){
			if(socket._socket && socket._socket.setNoDelay) socket._socket.setNoDelay(true);
			var connectionOrder = latestLogin.order();
			var parsedUrl = require('url').parse(info.url, true);
			var key = parsedUrl.pathname.slice(1);
			var $c;
			
			socket.on('error', function(err){
				JLog.warn("Error on #" + key + " on ws: " + err.toString());
			});
			// 웹 서버
			if((GLOBAL.GAME_SERVER_HOSTS || [ GLOBAL.GAME_SERVER_HOST ]).some(function(host){ return info.headers.host.startsWith(host + ":"); })){
				if(WDIC[key]) WDIC[key].socket.close();
				WDIC[key] = new KKuTu.WebServer(socket);
				JLog.info(`New web server #${key}`);
				WDIC[key].socket.on('close', function(){
					JLog.alert(`Exit web server #${key}`);
					WDIC[key].socket.removeAllListeners();
					delete WDIC[key];
				});
				return;
			}
			if(Object.keys(DIC).length >= Const.KKUTU_MAX){
				socket.send(`{ "type": "error", "code": "full" }`);
				return;
			}
			MainDB.session.findOne([ '_id', key ]).limit([ 'profile', true ]).on(function($body){
				$c = new KKuTu.Client(socket, $body ? $body.profile : null, key, parsedUrl.query.guestName);
				$c._loginToken=String(SID)+'-'+Date.now()+'-'+Math.random().toString(36).slice(2);
				$c.admin = GLOBAL.ADMIN.indexOf($c.id) != -1 || !!($c.profile && $c.profile.authType === 'local' && $c.profile.developer === true);
				if(maintenanceActive && !$c.admin){
					$c.send('error',{code:503,message:'서버 점검 중입니다. 운영자만 접속할 수 있습니다.'});
					$c.socket.close();
					return;
				}
				if(Number(SID)===2 && !$c.admin){
					LocalAuth.hasServerAccess(2,$c.guest?'':$c.id).then(function(allowed){if(!allowed&&!$c._closed){$c.send('error',{code:503,message:'추석 서버는 허용된 계정만 접속할 수 있습니다.'});$c.disconnect();}}).catch(function(){if(!$c._closed)$c.disconnect();});
				}
				/* Enhanced User Block System [S] */
				$c.remoteAddress = GLOBAL.USER_BLOCK_OPTIONS.USE_X_FORWARDED_FOR ? info.connection.remoteAddress : (info.headers['x-forwarded-for'] || info.connection.remoteAddress);
				$c.remoteAddress = String($c.remoteAddress || '').split(',')[0].trim().replace(/^::ffff:/, '');
				MainDB.access_log.insert([ '_id', Date.now() + '-' + Math.random().toString(36).slice(2) ], [ 'userId', $c.guest ? $c.id.replace('guest__', '') : $c.id ], [ 'displayName', $c.guest ? ($c.profile.guestNumber + '(' + (($c.profile.title || '').replace(/\(손님\)$/, '')) + ')') : ($c.profile.title || $c.profile.name || $c.id) ], [ 'ip', $c.remoteAddress ], [ 'guest', !!$c.guest ], [ 'connectedAt', Date.now() ]).on();
				/* Enhanced User Block System [E] */
				
				if(!latestLogin.claim($c, connectionOrder)) return $c.disconnect();
				$c.takeoverServer = String(SID);
				if(DEVELOP && !Const.TESTER.includes($c.id)){
					$c.sendError(500);
					$c.socket.close();
					return;
				}
				if($c.guest){
					if(SID != "0" && SID != "1"){
						$c.sendError(402);
						$c.socket.close();
						return;
					}
					if(KKuTu.NIGHT){
						$c.sendError(440);
						$c.socket.close();
						return;
					}
				}
				/* Enhanced User Block System [S] */
				if(GLOBAL.USER_BLOCK_OPTIONS.USE_MODULE && ((GLOBAL.USER_BLOCK_OPTIONS.BLOCK_IP_ONLY_FOR_GUEST && $c.guest) || !GLOBAL.USER_BLOCK_OPTIONS.BLOCK_IP_ONLY_FOR_GUEST)){
					MainDB.ip_block.findOne([ '_id', $c.remoteAddress ]).on(function($body){
						if ($body && $body.reasonBlocked) {
							if($body.ipBlockedUntil && $body.ipBlockedUntil < Date.now()) {
								MainDB.ip_block.update([ '_id', $c.remoteAddress ]).set([ 'ipBlockedUntil', 0 ], [ 'reasonBlocked', '' ]).on();
								JLog.info(`IP 주소 ${$c.remoteAddress}의 이용제한이 해제되었습니다.`);
							}
							else {
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
						}
					});
				}
				/* Enhanced User Block System [E] */
				if($c.isAjae === null){
					$c.sendError(441);
					$c.socket.close();
					return;
				}
				$c.refresh().then(function(ref){
					if($c.blocked || $c._closed || socket.readyState !== 1) return;
					if(!latestLogin.current($c)) return $c.disconnect();
					/* Enhanced User Block System [S] */
					let isBlockRelease = false;
					
					if(ref.blockedUntil && ref.blockedUntil < Date.now()) {
						MainDB.users.update([ '_id', $c.id ]).set([ 'blockedUntil', 0 ], [ 'black', '' ]).on();
						JLog.info(`사용자 #${$c.id}의 이용제한이 해제되었습니다.`);
						isBlockRelease = true;
					}
					/* Enhanced User Block System [E] */						
					
					/* Enhanced User Block System [S] */
					if(ref.result == 200 || isBlockRelease){
					/* Enhanced User Block System [E] */
						if(Object.keys(DIC).length >= (Const.SERVER_LIMITS[Number(SID)] || Const.KKUTU_MAX)){
							$c.sendError(429);
							$c.socket.close();
							return;
						}
						latestLogin.replace($c, function(){
						LocalAuth.claimGameLogin($c.id,SID,$c._loginToken).then(function(){
						DIC[$c.id] = $c;
						DNAME[($c.profile.title || $c.profile.name).replace(/\s/g, "")] = $c.id;
						MainDB.users.update([ '_id', $c.id ]).set([ 'server', SID ]).on();

						if (($c.guest && GLOBAL.GOOGLE_RECAPTCHA_TO_GUEST) || GLOBAL.GOOGLE_RECAPTCHA_TO_USER) {
							$c.socket.send(JSON.stringify({
								type: 'recaptcha',
								siteKey: GLOBAL.GOOGLE_RECAPTCHA_SITE_KEY
							}));
						} else {
							$c.passRecaptcha = true;

							joinNewUser($c);
						}
						}).catch(function(){ $c.disconnect(); });
						});
					} else {
						/* Enhanced User Block System [S] */
						if(ref.blockedUntil) $c.send('error', {
							code: ref.result, message: ref.black, blockedUntil: ref.blockedUntil
						});
						else $c.send('error', {
							code: ref.result, message: ref.black
						});
						/* Enhanced User Block System [E] */
						
						$c._error = ref.result;
						$c.socket.close();
						// JLog.info("Black user #" + $c.id);
					}
				});
			});
		});
		Server.on('error', function (err) {
			JLog.warn("Error on ws: " + err.toString());
		});
		KKuTu.init(MainDB, DIC, ROOM, GUEST_PERMISSION, CHAN);
	};
};

function joinNewUser($c) {
	$c.send('welcome', {
		id: $c.id,
		guest: $c.guest,
		box: $c.box,
		playTime: $c.data.playTime,
		okg: $c.okgCount,
		users: KKuTu.getUserList(),
		rooms: KKuTu.getRoomList(),
		friends: $c.friends,
		admin: $c.admin,
		test: global.test,
		caj: $c._checkAjae ? true : false
	});
	narrateFriends($c.id, $c.friends, "on");
	KKuTu.publish('conn', {user: $c.getData()});

	JLog.info("New user #" + $c.id);
}

KKuTu.onClientMessage = function ($c, msg) {
	if (!msg) return;
	
	if ($c.passRecaptcha) {
		processClientRequest($c, msg);
	} else {
		if (msg.type === 'recaptcha') {
			Recaptcha.verifyRecaptcha(msg.token, $c.remoteAddress, function (success) {
				if (success) {
					$c.passRecaptcha = true;

					joinNewUser($c);

					processClientRequest($c, msg);
				} else {
					JLog.warn(`Recaptcha failed from IP ${$c.remoteAddress}`);

					$c.sendError(447);
					$c.socket.close();
				}
			});
		}
	}
};

function processClientRequest($c, msg) {
	var stable = true;
	var temp;
	var now = (new Date()).getTime();
	// A guest stays in the name setup screen until a valid temporary name is set.
	// Enforce this server-side so direct client messages cannot start or join a game.
	if($c.guest && !$c.guestNamed && msg.type !== 'guestName' && msg.type !== 'refresh'){
		$c.send('guestNameRequired', {});
		return;
	}
	
	switch (msg.type) {
		case 'chatReport':
			var report = KKuTu.getChatReport(msg.reportId);
			if(!report) return $c.send('chatReportResult', {ok:false, message:'신고할 수 없는 메시지입니다.'});
			$c._chatReports = $c._chatReports || {};
			if($c._chatReports[msg.reportId]) return $c.send('chatReportResult', {ok:false, message:'이미 신고한 메시지입니다.'});
			$c._chatReports[msg.reportId] = Date.now();
			if(discordChat) discordChat.report(report, {id:$c.id, name:$c.profile.title || $c.profile.name || '손님'});
			$c.send('chatReportResult', {ok:true, message:'채팅 신고가 운영자에게 전달되었습니다.'});
			break;
		case 'profanityAcknowledge':
			$c._profanityPending = false;
			break;
		case 'dailyQuestGet':
			$c.send('dailyQuest', $c.getDailyQuestData());
			break;
		case 'guestName':
			if(!$c.guest || typeof msg.value !== 'string') return;
			var guestName = msg.value.trim().replace(/[^0-9A-Za-z가-힣 _-]/g, '').slice(0, 12);
			if(guestName.length < 2) return $c.sendError(400);
			$c.guestNamed = true;
			delete DNAME[($c.profile.title || '').replace(/\s/g, '')];
			$c.profile.title = guestName + '(손님)';
			$c.profile.name = $c.profile.title;
			DNAME[$c.profile.title.replace(/\s/g, '')] = $c.id;
			MainDB.access_log.update([ 'userId', $c.id.replace('guest__', '') ]).set([ 'displayName', ($c.profile.guestNumber || '손님') + '(' + guestName + ')' ]).on();
			$c.publish('user', $c.getData());
			break;
		case 'matchJoin':
			matchmaker.join($c);
			break;
		case 'matchCancel':
			matchmaker.cancel($c);
			break;
		case 'matchVote':
			matchmaker.vote($c, msg.dictionary);
			break;
		case 'rankJoin':
			rankedMatchmaker.join($c);
			break;
		case 'rankCancel':
			rankedMatchmaker.cancel($c);
			break;
		case 'yell':
			if (!msg.value) return;
			if (!$c.admin) return;

			$c.publish('yell', {value: msg.value});
			break;
		case 'refresh':
			$c.refresh().then(function(result){if(result && result.result===200)$c.send('user',$c.getData());});
			break;
		case 'talk':
			if (!msg.value) return;
			if (!msg.value.substr) return;
			if($c._profanityPending) return $c.send('profanityWarning', {count:1});
			if (!GUEST_PERMISSION.talk) if ($c.guest) {
				$c.send('error', {code: 401});
				return;
			}
			if(!msg[MODERATED_CHAT]){
				return KKuTu.moderateChat($c, msg.value, function(result){
					if(!result){ msg[MODERATED_CHAT] = true; return processClientRequest($c, msg); }
					if(result.matched && discordChat) discordChat.violation({id:$c.id, ip:$c.remoteAddress, name:$c.profile.title || $c.profile.name || '손님', value:msg.value, matched:result.matched, count:result.count || 1, blocked:!!result.blocked});
				});
			}
			msg.value = msg.value.substr(0, 200);
			if ($c.admin) {
				if (!processAdmin($c.id, msg.value)) break;
			}
			checkTailUser($c.id, $c.place, msg);
			if (msg.whisper) {
				msg.whisper.split(',').forEach(v => {
					if (temp = DIC[DNAME[v]]) {
						temp.send('chat', {
							from: $c.profile.title || $c.profile.name,
							profile: $c.profile,
							value: msg.value
						});
					} else {
						$c.sendError(424, v);
					}
				});
			} else {
				$c.chat(msg.value, undefined, msg.scope === "main" ? "main" : undefined);
			}
			break;
		case 'friendAdd':
			if (!msg.target) return;
			if ($c.guest) return;
			if ($c.id == msg.target) return;
			if (Object.keys($c.friends).length >= 100) return $c.sendError(452);
			if (temp = DIC[msg.target]) {
				if (temp.guest) return $c.sendError(453);
				if ($c._friend) return $c.sendError(454);
				$c._friend = temp.id;
				temp.send('friendAdd', {from: $c.id});
			} else {
				$c.sendError(450);
			}
			break;
		case 'friendAddRes':
			if (!(temp = DIC[msg.from])) return;
			if (temp._friend != $c.id) return;
			if (msg.res) {
				// $c와 temp가 친구가 되었다.
				$c.addFriend(temp.id);
				temp.addFriend($c.id);
			}
			temp.send('friendAddRes', {target: $c.id, res: msg.res});
			delete temp._friend;
			break;
		case 'friendEdit':
			if (!$c.friends) return;
			if (!$c.friends[msg.id]) return;
			$c.friends[msg.id] = (msg.memo || "").slice(0, 50);
			$c.flush(false, false, true);
			$c.send('friendEdit', {friends: $c.friends});
			break;
		case 'friendRemove':
			if (!$c.friends) return;
			if (!$c.friends[msg.id]) return;
			$c.removeFriend(msg.id);
			break;
		case 'enter':
		case 'setRoom':
			delete msg._autoMatch;
			// A client must never be able to mark an arbitrary room as ranked.
			// Only the server-owned ranked matchmaker creates those rooms.
			delete msg.ranked;
			if (!msg.title) stable = false;
			if (!msg.limit) stable = false;
			if (!msg.round) stable = false;
			if (!msg.time) stable = false;
			if (!msg.opts) stable = false;

			msg.code = false;
			msg.limit = Number(msg.limit);
			msg.mode = Number(msg.mode);
			msg.round = Number(msg.round);
			msg.time = Number(msg.time);

			if (isNaN(msg.limit)) stable = false;
			if (isNaN(msg.mode)) stable = false;
			if (isNaN(msg.round)) stable = false;
			if (isNaN(msg.time)) stable = false;

			if (stable) {
				if (msg.title.length > 20) stable = false;
				if (msg.password.length > 20) stable = false;
				if (msg.limit < 2 || msg.limit > 8) {
					msg.code = 432;
					stable = false;
				}
				if (msg.mode < 0 || msg.mode >= MODE_LENGTH) stable = false;
				// The active theme, rather than a fixed server number, controls Yut.
				if (msg.round < 1 || msg.round > 10) {
					msg.code = 433;
					stable = false;
				}
				if (ENABLE_ROUND_TIME.indexOf(msg.time) == -1) stable = false;
			}
			if (msg.type == 'enter') {
				if (msg.id || stable){
					if(!msg.id && Const.GAME_TYPE[msg.mode] === 'YUT') LocalAuth.getActiveTheme(SID).then(function(theme){if(theme==='chuseok')$c.enter(msg,msg.spectate);else $c.sendError(431,'추석 테마에서만 윷놀이를 만들 수 있습니다.');}).catch(function(){$c.sendError(500);});
					else $c.enter(msg, msg.spectate);
				}
				else $c.sendError(msg.code || 431);
			} else if (msg.type == 'setRoom') {
				if (stable){
					if(Const.GAME_TYPE[msg.mode] === 'YUT')LocalAuth.getActiveTheme(SID).then(function(theme){if(theme==='chuseok')$c.setRoom(msg);else $c.sendError(431);}).catch(function(){$c.sendError(500);});
					else $c.setRoom(msg);
				}
				else $c.sendError(msg.code || 431);
			}
			break;
		case 'inviteRes':
			if (!(temp = ROOM[msg.from])) return;
			if (!GUEST_PERMISSION.inviteRes) if ($c.guest) return;
			if ($c._invited != msg.from) return;
			if (msg.res) {
				$c.enter({id: $c._invited}, false, true);
			} else {
				if (DIC[temp.master]) DIC[temp.master].send('inviteNo', {target: $c.id});
			}
			delete $c._invited;
			break;
		/* 망할 셧다운제
		case 'caj':
			if(!$c._checkAjae) return;
			clearTimeout($c._checkAjae);
			if(msg.answer == "yes") $c.confirmAjae(msg.input);
			else if(KKuTu.NIGHT){
				$c.sendError(440);
				$c.socket.close();
			}
			break;
		*/
		case 'test':
			checkTailUser($c.id, $c.place, msg);
			break;
		default:
			break;
	}
}

KKuTu.onClientClosed = function($c, code){
	if(latestLogin) latestLogin.release($c);
	if(!$c.guest&&$c._loginToken) LocalAuth.releaseGameLogin($c.id,$c._loginToken).catch(function(){});
	if(DIC[$c.id] !== $c) return;
	delete DIC[$c.id];
	if(!$c._replaced && $c._error != 409) MainDB.users.update([ '_id', $c.id ], [ 'server', SID ]).set([ 'server', "" ]).on();
	if($c.profile) delete DNAME[($c.profile.title || $c.profile.name).replace(/\s/g, "")];
	if($c.socket) $c.socket.removeAllListeners();
	if($c.friends) narrateFriends($c.id, $c.friends, "off");
	KKuTu.publish('disconn', { id: $c.id });

	JLog.alert("Exit #" + $c.id);
};
