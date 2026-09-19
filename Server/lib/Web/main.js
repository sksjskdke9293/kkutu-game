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

/**
 * 볕뉘 수정사항:
 * Login 을 Passport 로 수행하기 위한 수정
 */

var WS		 = require("ws");
var Express	 = require("express");
var Exession = require("express-session");
var Redission= require("connect-redis")(Exession);
var Redis	 = require("redis");
var Parser	 = require("body-parser");
var DDDoS	 = require("dddos");
var Server	 = Express();
var DB		 = require("./db");
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 구문삭제 (28)
var JLog	 = require("../sub/jjlog");
var WebInit	 = require("../sub/webinit");
var GLOBAL	 = require("../sub/global.json");
var Secure = require('../sub/secure');
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정
var passport = require('passport');
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 끝
var Const	 = require("../const");
var https	 = require('https');
var fs		 = require('fs');

var Language = {
	'ko_KR': require("./lang/ko_KR.json"),
	'en_US': require("./lang/en_US.json")
};
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정
var ROUTES = [
	"major", "consume", "admin", "login"
];
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 끝
var page = WebInit.page;
var gameServers = [];

WebInit.MOBILE_AVAILABLE = [
	"portal", "main", "kkutu"
];

require("../sub/checkpub");

JLog.info("<< KKuTu Web >>");
Server.set('views', __dirname + "/views");
Server.set('view engine', "pug");
Server.use(Express.static(__dirname + "/public"));
Server.get('/event',function(req,res){res.set('Cache-Control','no-store');res.sendFile(__dirname+'/public/event.html');});
Server.use(Parser.urlencoded({ extended: true }));
Server.use(Parser.json({limit:'4kb'}));
Server.set('trust proxy', 1);
Server.use(function(req,res,next){
	res.set('X-Content-Type-Options','nosniff');
	res.set('X-Frame-Options','DENY');
	res.set('Referrer-Policy','strict-origin-when-cross-origin');
	res.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
	next();
});
var LocalAuth = require('./local-auth');
Server.use(Exession({
	/* use only for redis-installed

	store: new Redission({
		client: Redis.createClient(),
		ttl: 3600 * 12
	}),*/
	secret: LocalAuth.secret(),
	store: new LocalAuth.SessionStore(),
	cookie: {httpOnly:true, sameSite:'lax', secure:'auto', maxAge:43200000},
	resave: false,
	saveUninitialized: true
}));
LocalAuth.routes(Server);
Server.get('/api/site-notices', function(req,res){
	LocalAuth.getSiteNotices().then(function(notices){ res.set('Cache-Control','no-store'); res.json(notices); })
		.catch(function(){ res.status(503).json({}); });
});
Server.get('/api/theme', function(req,res){
	LocalAuth.getActiveTheme(req.query.server).then(function(theme){res.set('Cache-Control','no-store');res.json({theme:theme});})
		.catch(function(){res.status(503).json({theme:'autumn'});});
});
Server.get('/api/notices', function(req,res){
	LocalAuth.getNoticePosts().then(function(posts){ res.set('Cache-Control','no-store'); res.json({posts:posts}); }).catch(function(){res.status(503).json({posts:[]});});
});
Server.get('/site-notice-image', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','game-notice-image');
	fs.stat(file,function(error){ if(error) return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){ res.type(type||'image/png').sendFile(file); }); });
});
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정
Server.use(passport.initialize());
Server.use(passport.session());
Server.use((req, res, next) => {
	if(req.session.passport) {
		delete req.session.passport;
	}
	next();
});
Server.use((req, res, next) => {
	if(Const.IS_SECURED) {
		if(req.protocol == 'http') {
			let url = 'https://'+req.get('host')+req.path;
			res.status(302).redirect(url);
		} else {
			next();
		}
	} else {
		next();
	}
});
Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 끝
/* use this if you want

DDDoS = new DDDoS({
	maxWeight: 6,
	checkInterval: 10000,
	rules: [{
		regexp: "^/(cf|dict|gwalli)",
		maxWeight: 20,
		errorData: "429 Too Many Requests"
	}, {
		regexp: ".*",
		errorData: "429 Too Many Requests"
	}]
});
DDDoS.rules[0].logFunction = DDDoS.rules[1].logFunction = function(ip, path){
	JLog.warn(`DoS from IP ${ip} on ${path}`);
};
Server.use(DDDoS.express());*/

WebInit.init(Server, true);
DB.ready = function(){
	setInterval(function(){
		var q = [ 'createdAt', { $lte: Date.now() - 3600000 * 12 } ];

		DB.session.remove(q).on();
	}, 600000);
	setInterval(function(){
		gameServers.forEach(function(v){
			if(v.socket && v.socket.readyState === WS.OPEN) v.send('seek');
			else v.seek = undefined;
		});
	}, 4000);
	JLog.success("DB is ready.");

	DB.kkutu_shop_desc.find().on(function($docs){
		var i, j;

		for(i in Language) flush(i);
		function flush(lang){
			var db;

			Language[lang].SHOP = db = {};
			for(j in $docs){
				db[$docs[j]._id] = [ $docs[j][`name_${lang}`], $docs[j][`desc_${lang}`] ];
			}
		}
	});
	Server.listen(80);
	if(Const.IS_SECURED) {
		const options = Secure();
		https.createServer(options, Server).listen(443);
	}
};
Const.MAIN_PORTS.forEach(function(v, i){
	var KEY = process.env['WS_KEY'];
	var protocol;
	if(Const.IS_SECURED) {
		protocol = 'wss';
	} else {
		protocol = 'ws';
	}
	gameServers[i] = new GameClient(KEY, `${protocol}://${(GLOBAL.GAME_SERVER_HOSTS || [])[i] || GLOBAL.GAME_SERVER_HOST}:${v}/${KEY}`);
});
function GameClient(id, url){
	var my = this;

	my.id = id;
	var reconnectTimer;
	connect();
	function connect(){
	my.socket = new WS(url, { perMessageDeflate: false, rejectUnauthorized: false});
	
	my.send = function(type, data){
		if(!my.socket || my.socket.readyState !== WS.OPEN) return;
		if(!data) data = {};
		data.type = type;

		my.socket.send(JSON.stringify(data));
	};
	my.socket.on('open', function(){
		JLog.info(`Game server #${my.id} connected`);
		my.send('seek');
	});
	my.socket.on('error', function(err){
		JLog.warn(`Game server #${my.id} has an error: ${err.toString()}`);
	});
	my.socket.on('close', function(code){
		JLog.error(`Game server #${my.id} closed: ${code}`);
		my.socket.removeAllListeners();
		delete my.socket;
		my.seek = null;
		clearTimeout(reconnectTimer);
		reconnectTimer = setTimeout(connect, 3000);
	});
	my.socket.on('message', function(data){
		var _data = data;
		var i;

		data = JSON.parse(data);

		switch(data.type){
			case "seek":
				my.seek = data.value;
				break;
			case "narrate-friend":
				for(i in data.list){
					gameServers[i].send('narrate-friend', { id: data.id, s: data.s, stat: data.stat, list: data.list[i] });
				}
				break;
			default:
		}
	});
}
}
ROUTES.forEach(function(v){
	require(`./routes/${v}`).run(Server, WebInit.page);
});
Server.get("/", function(req, res){
	var server = req.query.server;
	
	Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 구문삭제(220~229, 240)
	DB.session.findOne([ '_id', req.session.id ]).on(function($ses){
		// var sid = (($ses || {}).profile || {}).sid || "NULL";
		if(global.isPublic){
			onFinish($ses);
			// DB.jjo_session.findOne([ '_id', sid ]).limit([ 'profile', true ]).on(onFinish);
		}else{
			if($ses) $ses.profile.sid = $ses._id;
			onFinish($ses);
		}
	});
	function onFinish($doc){
		var id = req.session.id;
		var profile = $doc && $doc.profile;
		var isAdmin = !!profile && (GLOBAL.ADMIN.indexOf(profile.id) !== -1 || (profile.authType === 'local' && profile.developer === true));

		if($doc){
			req.session.profile = $doc.profile;
			id = $doc.profile.sid;
		}else{
			delete req.session.profile;
		}
		checkAccessBlock(profile, req.ip, function(accessBlocked){
			function renderPage(status){
			var maintenanceStatus=status || {maintenance:false,servers:[false,false,false]};
			var maintenance=!!maintenanceStatus.maintenance || !!maintenanceStatus.servers[Number(server)];
			if(accessBlocked && Const.MAIN_PORTS[server]) return res.redirect('/');
			if(profile&&profile.authType==='local'&&profile.developer!==true&&Const.MAIN_PORTS[server])return res.redirect('/?link-required=1');
			Promise.all([LocalAuth.hasServerAccess(Number(server), profile && profile.id),LocalAuth.hasServerAccess(2,profile && profile.id)]).then(function(access){
			var serverAllowed=access[0],developerServerVisible=isAdmin||access[1];
			if((maintenance || (Number(server) === 2 && !serverAllowed)) && !isAdmin && Const.MAIN_PORTS[server]) return page(req, res, 'maintenance', {
				'_page':'kkutu', 'MAINTENANCE':true,
				'canonical':'https://kkutugame.kro.kr/'
			});
		page(req, res, Const.MAIN_PORTS[server] ? "kkutu" : "portal", {
			'_page': "kkutu",
			'_id': id,
			'ADMIN': isAdmin,
			'ACCESS_BLOCKED': accessBlocked,
			'MAINTENANCE': !!maintenanceStatus.maintenance,
			'MAINTENANCE_SERVERS': maintenanceStatus.servers,
			// Keep game WebSockets on the main HTTPS origin.  Some browsers and
			// networks reject the previous secure alternate port (8080), leaving
			// the lobby stuck at "불러오는 중".
			'PORT': 443,
			'GAME_PATH': Number(server) === 2 ? '/game3' : (Number(server) === 1 ? '/game2' : '/game'),
			'HOST': process.env.PUBLIC_GAME_HOST || req.hostname,
			'PROTOCOL': process.env.PUBLIC_GAME_PROTOCOL || ((Const.IS_SECURED || req.get('x-forwarded-proto') == 'https') ? 'wss' : 'ws'),
			'TEST': req.query.test,
			'MOREMI_PART': Const.MOREMI_PART,
			'AVAIL_EQUIP': Const.AVAIL_EQUIP,
			'CATEGORIES': Const.CATEGORIES,
			'GROUPS': Const.GROUPS,
			'MODE': Const.GAME_TYPE,
			'RULE': Const.RULE,
			'OPTIONS': Const.OPTIONS,
			'SERVER_LIST': gameServers.map(function(client){ return Number(client.seek) || 0; }).slice(0,developerServerVisible?3:2),
			'SERVER_LIMITS': Const.SERVER_LIMITS || Const.KKUTU_MAX,
			'KO_INJEONG': Const.KO_INJEONG,
			'EN_INJEONG': Const.EN_INJEONG,
			'KO_THEME': Const.KO_THEME,
			'EN_THEME': Const.EN_THEME,
			'IJP_EXCEPT': Const.IJP_EXCEPT,
			'canonical': "https://kkutugame.kro.kr/",
			'ogImage': "https://kkutugame.kro.kr/img/custom/site-logo.png?v=20260912",
			'ogURL': "https://kkutugame.kro.kr/",
			'ogTitle': "끄투게임",
			'ogDescription': "끝말잇기가 이렇게 박진감 넘치는 게임이었다니!"
		});
			});
			}
			LocalAuth.getGameMaintenanceStatus().then(renderPage).catch(function(){ renderPage({maintenance:false,servers:[false,false,false]}); });
		});
	}
});

function checkAccessBlock(profile, address, done){
	var ip = String(address || '').trim().replace(/^::ffff:/, '').split(',')[0].trim();
	var accountBlocked = false;
	var pending = profile && profile.id ? 2 : 1;
	function finish(){ if(--pending === 0) done(accountBlocked); }
	function active(row, reasonKey, untilKey, table, key){
		if(!row || !row[reasonKey]) return false;
		var until = Number(row[untilKey] || 0);
		if(until && until < Date.now()){
			table.update([ '_id', key ]).set([ reasonKey, '' ], [ untilKey, 0 ]).on();
			return false;
		}
		return true;
	}
	if(profile && profile.id){
		DB.users.findOne([ '_id', profile.id ]).limit([ 'black', true ], [ 'blockedUntil', true ]).on(function(row){
			if(active(row, 'black', 'blockedUntil', DB.users, profile.id)) accountBlocked = true;
			finish();
		});
	}
	DB.ip_block.findOne([ '_id', ip ]).limit([ 'reasonBlocked', true ], [ 'ipBlockedUntil', true ]).on(function(row){
		if(active(row, 'reasonBlocked', 'ipBlockedUntil', DB.ip_block, ip)) accountBlocked = true;
		finish();
	});
}

Server.get("/servers", function(req, res){
	var list = [];
	var profile=req.session && req.session.profile;
	var isAdmin=!!profile && (GLOBAL.ADMIN.indexOf(profile.id)!==-1 || (profile.authType==='local' && profile.developer===true));
	gameServers.forEach(function(v, i){ list[i] = v.seek; });
	LocalAuth.getGameMaintenanceStatus().then(function(status){
		res.set('Cache-Control','no-store');
		LocalAuth.hasServerAccess(2,profile&&profile.id).then(function(allowed){var visible=isAdmin||allowed;var states=status.servers.slice(0,visible?3:2);res.send({ list:list.slice(0,visible?3:2), max:Const.SERVER_LIMITS || Const.KKUTU_MAX, maintenance:!!status.maintenance && !isAdmin, maintenanceServers:isAdmin?[false,false,false]:states });});
	}).catch(function(){ res.send({list:list.slice(0,2),max:Const.SERVER_LIMITS || Const.KKUTU_MAX,maintenance:false,maintenanceServers:[false,false]}); });
});

Server.get("/entry", function(req, res){
	var profile = req.session && req.session.profile;
	if(!profile || !profile.id) return res.send({ guest: true, level: 0, progress: 100 });
	DB.users.findOne([ '_id', profile.id ]).on(function(user){
		var score = Number(user && user.kkutu && user.kkutu.score) || 0;
		var level = 1, total = 0, next = 120;
		while(score >= total + next){
			total += next; level++;
			next = Math.round((!(level % 5) * 0.3 + 1) * (!(level % 15) * 0.4 + 1) * (!(level % 45) * 0.5 + 1) * (120 + Math.floor(level / 5) * 60 + Math.floor(level * level / 225) * 120 + Math.floor(level * level / 2025) * 180));
		}
		var current = Math.max(0, score - total);
		var progress = Math.max(0, Math.min(100, current / next * 100));
		res.send({ guest: false, level: level, score: score, current: current, required: next, progress: progress });
	});
});

Server.get('/site-notice-post/:id', function(req,res){
	var file=require('path').join(process.env.KKUTU_PRIVATE_DIR || '/kkutu','notice-post-'+String(req.params.id).replace(/[^0-9]/g,''));
	fs.stat(file,function(error){ if(error)return res.sendStatus(404); fs.readFile(file+'.type','utf8',function(_,type){res.type(type||'image/png').sendFile(file);});});
});
//볕뉘 수정 구문 삭제(274~353)

Server.get("/legal/:page", function(req, res){
	page(req, res, "legal/"+req.params.page);
});

Server.use(function(req, res){
	res.status(404).render("not-found");
});
