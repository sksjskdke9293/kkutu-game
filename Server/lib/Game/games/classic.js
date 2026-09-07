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

var Const = require('../../const');
var Lizard = require('../../sub/lizard');
var DB;
var DIC;

const ROBOT_START_DELAY = [ 1200, 800, 400, 200, 0 ];
const ROBOT_TYPE_COEF = [ 1250, 750, 500, 250, 0 ];
const ROBOT_THINK_COEF = [ 4, 2, 1, 0, 0 ];
const ROBOT_LENGTH_LIMIT = [ 3, 4, 9, 99, 99 ];
const RIEUL_TO_NIEUN = [4449, 4450, 4457, 4460, 4462, 4467];
const RIEUL_TO_IEUNG = [4451, 4455, 4456, 4461, 4466, 4469];
const NIEUN_TO_IEUNG = [4455, 4461, 4466, 4469];
const MORAE_DICTIONARY_COLUMNS = {
	basic: "morae_basic",
	standard: "morae_standard",
	complex: "morae_complex"
};

function getDictionaryColumn(opts){
	return MORAE_DICTIONARY_COLUMNS[opts && opts.dictionary] || MORAE_DICTIONARY_COLUMNS.standard;
}

exports.init = function(_DB, _DIC){
	DB = _DB;
	DIC = _DIC;
};
exports.getTitle = function(){
	var R = new Lizard.Tail();
	var my = this;
	var l = my.rule;
	var EXAMPLE;
	var eng, ja;
	
	if(!l){
		R.go("undefinedd");
		return R;
	}
	if(!l.lang){
		R.go("undefinedd");
		return R;
	}
	EXAMPLE = Const.EXAMPLE_TITLE[l.lang];
	my.game.dic = {};
	
	switch(Const.GAME_TYPE[my.mode]){
		case 'EKT':
		case 'ESH':
			eng = "^" + String.fromCharCode(97 + Math.floor(Math.random() * 26));
			break;
		case 'KKT':
			my.game.wordLength = 3;
		case 'KSH':
			ja = 44032 + 588 * Math.floor(Math.random() * 19);
			eng = "^[\\u" + ja.toString(16) + "-\\u" + (ja + 587).toString(16) + "]";
			break;
		case 'KAP':
			ja = 44032 + 588 * Math.floor(Math.random() * 19);
			eng = "[\\u" + ja.toString(16) + "-\\u" + (ja + 587).toString(16) + "]$";
			break;
	}
	function tryTitle(h){
		if(h > 50){
			R.go(EXAMPLE);
			return;
		}
		var titleQuery = [
			[ '_id', new RegExp(eng + ".{" + Math.max(1, my.round - 1) + "}$") ]
		];
		if(l.lang == "ko") titleQuery.push([ getDictionaryColumn(my.opts), true ]);
		else titleQuery.push([ '_id', Const.ENG_ID ]);
		DB.kkutu[l.lang].find.apply(DB.kkutu[l.lang], titleQuery).limit(20).on(function($md){
			var list;
			
			if($md.length){
				list = shuffle($md);
				checkTitle(list.shift()._id).then(onChecked);
			
				function onChecked(v){
					if(v) R.go(v);
					else if(list.length) checkTitle(list.shift()._id).then(onChecked);
					else R.go(EXAMPLE);
				}
			}else{
				tryTitle(h + 10);
			}
		});
	}
	function checkTitle(title){
		var R = new Lizard.Tail();
		var i, list = [];
		var len;
		
		/* 부하가 너무 걸린다면 주석을 풀자.
		R.go(true);
		return R;
		*/
		if(title == null){
			R.go(EXAMPLE);
		}else{
			len = title.length;
			for(i=0; i<len; i++) list.push(getAuto.call(my, title[i], getSubChar.call(my, title[i]), 1));
			
			Lizard.all(list).then(function(res){
				for(i in res) if(!res[i]) return R.go(EXAMPLE);
				
				return R.go(title);
			});
		}
		return R;
	}
	tryTitle(10);
	
	return R;
};
exports.roundReady = function(){
	var my = this;
	if(!my.game.title) return;
	
	clearTimeout(my.game.turnTimer);
	my.game.round++;
	my.game.roundTime = my.time * 1000;
	if(my.game.round <= my.round){
		my.game.char = my.game.title[my.game.round - 1];
		my.game.subChar = getSubChar.call(my, my.game.char);
		my.game.chain = [];
		if(my.opts.mission) my.game.mission = getMission(my.rule.lang);
		if(my.opts.sami) my.game.wordLength = 2;
		
		my.byMaster('roundReady', {
			round: my.game.round,
			char: my.game.char,
			subChar: my.game.subChar,
			mission: my.game.mission
		}, true);
		my.game.turnTimer = setTimeout(my.turnStart, 2400);
	}else{
		my.roundEnd();
	}
};
exports.turnStart = function(force){
	var my = this;
	var speed;
	var si;
	
	if(!my.game.chain) return;
	my.game.roundTime = Math.min(my.game.roundTime, Math.max(10000, 150000 - my.game.chain.length * 1500));
	speed = my.getTurnSpeed(my.game.roundTime);
	clearTimeout(my.game.turnTimer);
	clearTimeout(my.game.robotTimer);
	my.game.late = false;
	my.game.loading = false;
	my.game.turnTime = 15000 - 1400 * speed;
	my.game.turnAt = (new Date()).getTime();
	my.game.playerHints = [];
	my.game.hintAuthors = {};
	if(my.opts.sami) my.game.wordLength = (my.game.wordLength == 3) ? 2 : 3;
	
	my.byMaster('turnStart', {
		turn: my.game.turn,
		char: my.game.char,
		subChar: my.game.subChar,
		speed: speed,
		roundTime: my.game.roundTime,
		turnTime: my.game.turnTime,
		mission: my.game.mission,
		wordLength: my.game.wordLength,
		seq: force ? my.game.seq : undefined
	}, true);
	my.game.turnTimer = setTimeout(my.turnEnd, Math.min(my.game.roundTime, my.game.turnTime + 100));
	if(si = my.game.seq[my.game.turn]) if(si.robot){
		si._done = [];
		my.readyRobot(si);
	}
};
exports.turnEnd = function(){
	var my = this;
	var target;
	var score;
	
	if(!my.game.seq) return;
	target = DIC[my.game.seq[my.game.turn]] || my.game.seq[my.game.turn];
	
	if(my.game.loading && Date.now() < my.game.turnAt + Math.min(my.game.roundTime, my.game.turnTime + 100) + 3000){
		my.game.turnTimer = setTimeout(my.turnEnd, 100);
		return;
	}
	my.game.late = true;
	my.game.loading = false;
	var endedAt = my.game.turnAt;
	var finished = false;
	var hintTimer = setTimeout(function(){ finishTurn(); }, 1000);
	if(target) if(target.game){
		score = Const.getPenalty(my.game.chain, target.game.score);
		target.game.score += score;
	}
	function finishTurn(w){
		if(finished) return;
		finished = true;
		clearTimeout(hintTimer);
		if(!my.gaming || my.game.turnAt !== endedAt) return;
		my.byMaster('turnEnd', {
			ok: false,
			target: target ? target.id : null,
			score: score,
			hint: w
		}, true);
		my.game._rrt = setTimeout(my.roundReady, 3000);
	}
	getAuto.call(my, my.game.char, my.game.subChar, 0).then(finishTurn);
	clearTimeout(my.game.robotTimer);
};
exports.playerHint = function(client, data){
	var my = this;
	if(my.game.seq[my.game.turn] === client.id) return;
	if(typeof data.value !== 'string') return;
	var word = data.value.trim();
	if(!word || word.length > 50 || /\s/.test(word)) return;
	var at = my.game.turnAt;
	validateDraft.call(my, client, word, 'hint', function(){
	if(my.game.turnAt !== at || my.game.late) return;
	var previous = my.game.hintAuthors[client.id];
	if(previous !== undefined) my.game.playerHints[previous] = word;
	else{
		if(my.game.playerHints.length >= 9) return;
		my.game.hintAuthors[client.id] = my.game.playerHints.length;
		my.game.playerHints.push(word);
	}
	my.byMaster('playerHints', {hints:my.game.playerHints}, true);
	});
};
function validateDraft(client, word, kind, accepted){
	var my = this, at = my.game.turnAt;
	if(typeof word !== 'string' || !word.trim() || word.length > 50) return;
	if(client._draftCheckAt && Date.now() - client._draftCheckAt < 500) return;
	client._draftCheckAt = Date.now();
	word = word.trim();
	var query = [['_id', word]];
	if(my.rule.lang === 'ko') query.push([getDictionaryColumn(my.opts), true]);
	DB.kkutu[my.rule.lang].findOne.apply(DB.kkutu[my.rule.lang], query).on(function(doc){
		if(!my.gaming || my.game.turnAt !== at) return;
		var valid = !!doc;
		if(valid && my.rule.lang !== 'ko') valid = !(!my.opts.injeong && (doc.flag & Const.KOR_FLAG.INJEONG)) && !(my.opts.strict && (!doc.type.match(Const.KOR_STRICT) || doc.flag >= 4)) && !(my.opts.loanword && (doc.flag & Const.KOR_FLAG.LOANWORD));
		client.send('draftChecked', {kind:kind, value:word, valid:valid});
		if(valid && accepted) accepted();
	});
}
exports.checkPrediction = function(client, data){
	validateDraft.call(this, client, data.value, 'prediction');
};
exports.usePlayerHint = function(client, data){
	var my = this;
	if(my.game.seq[my.game.turn] !== client.id || my.game.loading) return;
	if(!Number.isInteger(data.index) || data.index < 0 || data.index >= my.game.playerHints.length) return;
	exports.submit.call(my, client, my.game.playerHints[data.index], true);
};
exports.submit = function(client, text, hintUsed){
	var score, l, t;
	var my = this;
	var tv = (new Date()).getTime();
	var submittedAt = my.game.turnAt;
	var mgt = my.game.seq[my.game.turn];
	
	if(!mgt) return;
	if(!mgt.robot) if(mgt != client.id) return;
	if(!my.game.char) return;
	
	if(!isChainable(text, my.mode, my.game.char, my.game.subChar)) return client.chat(text);
	if(my.game.chain.indexOf(text) != -1) return client.publish('turnError', { code: 409, value: text }, true);
	
	l = my.rule.lang;
	my.game.loading = true;
	function onDB($doc){
		if(!my.gaming || my.game.late || my.game.turnAt !== submittedAt) return;
		if(!my.game.chain) return;
		var preChar = getChar.call(my, text);
		var preSubChar = getSubChar.call(my, preChar);
		var firstMove = my.game.chain.length < 1;
		
		function preApproved(){
			function approved(){
				if(my.game.late) return;
				if(my.game.turnAt !== submittedAt) return;
				if(!my.game.chain) return;
				if(!my.game.dic) return;
				
				my.game.loading = false;
				my.game.late = true;
				clearTimeout(my.game.turnTimer);
				t = tv - my.game.turnAt;
				score = my.getScore(text, t);
				if(hintUsed === true) score = Math.floor(score / 2);
				my.game.dic[text] = (my.game.dic[text] || 0) + 1;
				my.game.chain.push(text);
				my.game.roundTime -= t;
				my.game.char = preChar;
				my.game.subChar = preSubChar;
				client.game.score += score;
				client.publish('turnEnd', {
					ok: true,
					value: text,
					mean: $doc.mean,
					theme: $doc.theme,
					wc: $doc.type,
					score: score,
					bonus: (my.game.mission === true) ? score - Math.floor(my.getScore(text, t, true) * (hintUsed === true ? 0.5 : 1)) : 0,
					hintUsed: hintUsed === true,
					baby: $doc.baby
				}, true);
				if(my.game.mission === true){
					my.game.mission = getMission(my.rule.lang);
				}
				setTimeout(my.turnNext, my.game.turnTime / 6);
				if(!client.robot){
					client.invokeWordPiece(text, 1);
					DB.kkutu[l].update([ '_id', text ]).set([ 'hit', $doc.hit + 1 ]).on();
				}
			}
			if(firstMove || my.opts.manner || my.game.chain.length < (my.opts.shield == null ? 15 : my.opts.shield)) getAuto.call(my, preChar, preSubChar, 1).then(function(w){
				if(w) approved();
				else{
					my.game.loading = false;
					client.publish('turnError', { code: firstMove ? 402 : 403, value: text }, true);
					if(client.robot){
						my.readyRobot(client);
					}
				}
			});
			else approved();
		}
		function denied(code){
			my.game.loading = false;
			client.publish('turnError', { code: code || 404, value: text }, true);
		}
		if($doc){
			if(l == "ko") preApproved();
			else if(!my.opts.injeong && ($doc.flag & Const.KOR_FLAG.INJEONG)) denied();
			else if(my.opts.strict && (!$doc.type.match(Const.KOR_STRICT) || $doc.flag >= 4)) denied(406);
			else if(my.opts.loanword && ($doc.flag & Const.KOR_FLAG.LOANWORD)) denied(405);
			else preApproved();
		}else{
			denied();
		}
	}
	function isChainable(){
		var type = Const.GAME_TYPE[my.mode];
		var char = my.game.char, subChar = my.game.subChar;
		var l = char.length;
		
		if(!text) return false;
		if(text.length <= l) return false;
		if(my.game.wordLength && text.length != my.game.wordLength) return false;
		if(type == "KAP") return (text.slice(-1) == char) || (text.slice(-1) == subChar);
		switch(l){
			case 1: return (text[0] == char) || (text[0] == subChar);
			case 2: return (text.substr(0, 2) == char);
			case 3: return (text.substr(0, 3) == char) || (text.substr(0, 2) == char.slice(1));
			default: return false;
		}
	}
	var wordQuery = [
		[ '_id', text ]
	];
	if(l == "ko") wordQuery.push([ getDictionaryColumn(my.opts), true ]);
	else wordQuery.push([ '_id', Const.ENG_ID ]);
	DB.kkutu[l].findOne.apply(DB.kkutu[l], wordQuery).on(onDB);
};
exports.getScore = function(text, delay, ignoreMission){
	var my = this;
	var tr = 1 - delay / my.game.turnTime;
	var score, arr;
	
	if(!text || !my.game.chain || !my.game.dic) return 0;
	score = Const.getPreScore(text, my.game.chain, tr);
	
	if(my.game.dic[text]) score *= 15 / (my.game.dic[text] + 15);
	if(!ignoreMission) if(arr = text.match(new RegExp(my.game.mission, "g"))){
		score += score * 0.5 * arr.length;
		my.game.mission = true;
	}
	return Math.round(score);
};
exports.readyRobot = function(robot){
	var my = this;
	var level = Math.max(0, Math.min(4, Number(robot.level) || 0));
	var turnAt = my.game.turnAt;
	robot._done = robot._done || [];
	var delay = ROBOT_START_DELAY[level];
	var w, text;
	var isRev = Const.GAME_TYPE[my.mode] == "KAP";
	
	getAuto.call(my, my.game.char, my.game.subChar, 2).then(function(list){
		if(list.length){
			// Rank the fetched candidates locally. Per-ending lookahead queues dozens
			// of full dictionary scans on the shared connection and stalls all turns.
			list.sort(function(a, b){
				return level >= 3 ? b._id.length - a._id.length : (b.hit - a.hit || a._id.length - b._id.length);
			});
			pickList(list);
		}else denied();
	});
	function denied(){
		text = isRev ? `T.T ...${my.game.char}` : `${my.game.char}... T.T`;
		after();
	}
	function pickList(list){
		if(list) do{
			if(!(w = list.shift())) break;
		}while(w._id.length > ROBOT_LENGTH_LIMIT[level] || robot._done.includes(w._id));
		if(w){
			text = w._id;
			// Imported dictionary entries have no play history yet; keep thinking time bounded.
			delay += 500 * ROBOT_THINK_COEF[level] * Math.random() / Math.log(2 + Math.max(0, Number(w.hit) || 0));
			after();
		}else denied();
	}
	function after(){
		if(!my.gaming || my.game.late || my.game.turnAt !== turnAt) return;
		delay += text.length * ROBOT_TYPE_COEF[level];
		robot._done.push(text);
		clearTimeout(my.game.robotTimer);
		my.game.robotTimer = setTimeout(function(){
			if(my.gaming && !my.game.late && my.game.turnAt === turnAt) my.turnRobot(robot, text);
		}, delay);
	}
};
function getMission(l){
	var arr = (l == "ko") ? Const.MISSION_ko : Const.MISSION_en;
	
	if(!arr) return "-";
	return arr[Math.floor(Math.random() * arr.length)];
}
function getAuto(char, subc, type){
	/* type
		0 무작위 단어 하나
		1 존재 여부
		2 단어 목록
	*/
	var my = this;
	var R = new Lizard.Tail();
	var gameType = Const.GAME_TYPE[my.mode];
	var adv, adc;
	var key = gameType + "_" + keyByOptions(my.opts);
	var MAN = DB.kkutu_manner[my.rule.lang];
	var bool = type == 1;
	
	adc = char + (subc ? ("|"+subc) : "");
	switch(gameType){
		case 'EKT':
			adv = `^(${adc})..`;
			break;
		case 'KSH':
			adv = `^(${adc}).`;
			break;
		case 'ESH':
			adv = `^(${adc})...`;
			break;
		case 'KKT':
			adv = `^(${adc}).{${my.game.wordLength-1}}$`;
			break;
		case 'KAP':
			adv = `.(${adc})$`;
			break;
	}
	if(!char){
		console.log(`Undefined char detected! key=${key} type=${type} adc=${adc}`);
	}
	MAN.findOne([ '_id', char || "★" ]).on(function($mn){
		if($mn && bool && Object.prototype.hasOwnProperty.call($mn, key)){
			if($mn[key] === null) produce();
			else R.go($mn[key]);
		}else{
			produce();
		}
	});
	function produce(){
		var aqs = [[ '_id', new RegExp(adv) ]];
		var aft;
		var lst;
		
		if(my.rule.lang == "ko"){
			aqs.push([ getDictionaryColumn(my.opts), true ]);
		}else{
			if(!my.opts.injeong) aqs.push([ 'flag', { '$nand': Const.KOR_FLAG.INJEONG } ]);
			aqs.push([ '_id', Const.ENG_ID ]);
		}
		switch(type){
			case 0:
			default:
				aft = function($md){
					R.go($md[Math.floor(Math.random() * $md.length)]);
				};
				break;
			case 1:
				aft = function($md){
					R.go($md.length ? true : false);
				};
				break;
			case 2:
				aft = function($md){
					R.go($md);
				};
				break;
		}
		DB.kkutu[my.rule.lang].find.apply(this, aqs).limit(bool ? 1 : 123).on(function($md){
			forManner($md);
			if(my.game.chain) aft($md.filter(function(item){ return !my.game.chain.includes(item._id); }));
			else aft($md);
		});
		function forManner(list){
			lst = list;
			MAN.upsert([ '_id', char ]).set([ key, lst.length ? true : false ]).on(null, null, onFail);
		}
		function onFail(){
			MAN.createColumn(key, "boolean").on(function(){
				forManner(lst);
			});
		}
	}
	return R;
}
function keyByOptions(opts){
	var arr = [];
	var dictionaries = { basic: 'B', standard: 'S', complex: 'C' };
	
	arr.push('D' + (dictionaries[opts.dictionary] || dictionaries.standard));
	if(opts.injeong) arr.push('X');
	if(opts.loanword) arr.push('L');
	if(opts.strict) arr.push('S');
	return arr.join('');
}
function shuffle(arr){
	var i, r = [];
	
	for(i in arr) r.push(arr[i]);
	r.sort(function(a, b){ return Math.random() - 0.5; });
	
	return r;
}
function getChar(text){
	var my = this;
	
	switch(Const.GAME_TYPE[my.mode]){
		case 'EKT': return text.slice(text.length - 3);
		case 'ESH':
		case 'KKT':
		case 'KSH': return text.slice(-1);
		case 'KAP': return text.charAt(0);
	}
};
function getSubChar(char){
	var my = this;
	var r;
	var c = char.charCodeAt();
	var k;
	var ca, cb, cc;
	
	switch(Const.GAME_TYPE[my.mode]){
		case "EKT":
			if(char.length > 2) r = char.slice(1);
			break;
		case "KKT": case "KSH": case "KAP":
			k = c - 0xAC00;
			if(k < 0 || k > 11171) break;
			ca = [ Math.floor(k/28/21), Math.floor(k/28)%21, k%28 ];
			cb = [ ca[0] + 0x1100, ca[1] + 0x1161, ca[2] + 0x11A7 ];
			cc = false;
			if(cb[0] == 4357){ // ㄹ에서 ㄴ, ㅇ
				cc = true;
				if(RIEUL_TO_NIEUN.includes(cb[1])) cb[0] = 4354;
				else if(RIEUL_TO_IEUNG.includes(cb[1])) cb[0] = 4363;
				else cc = false;
			}else if(cb[0] == 4354){ // ㄴ에서 ㅇ
				if(NIEUN_TO_IEUNG.indexOf(cb[1]) != -1){
					cb[0] = 4363;
					cc = true;
				}
			}
			if(cc){
				cb[0] -= 0x1100; cb[1] -= 0x1161; cb[2] -= 0x11A7;
				r = String.fromCharCode(((cb[0] * 21) + cb[1]) * 28 + cb[2] + 0xAC00);
			}
			break;
		case "ESH": default:
			break;
	}
	return r;
}
