var Lizard = require('../../sub/lizard');
var DB, DIC;
var STARTS = ['가','나','다','마','바','사','아','자','차','하'];
var ROLLS = {0:{name:'모',move:5,extra:true},1:{name:'도',move:1},2:{name:'개',move:2},3:{name:'걸',move:3},4:{name:'윷',move:4,extra:true}};
var BACK_DO = {name:'빽도',move:-1,backDo:true};
var FORCED_ROLLS = {backdo:BACK_DO,do:ROLLS[1],gae:ROLLS[2],geol:ROLLS[3],yut:ROLLS[4],mo:ROLLS[0]};
var RIEUL_TO_NIEUN = [4449,4450,4457,4460,4462,4467];
var RIEUL_TO_IEUNG = [4451,4455,4456,4461,4466,4469];
var NIEUN_TO_IEUNG = [4455,4461,4466,4469];
var DICTIONARY_COLUMNS = {basic:'morae_basic',standard:'morae_standard',complex:'morae_complex'};

exports.init = function(_DB,_DIC){ DB=_DB; DIC=_DIC; };
function idOf(v){ return typeof v === 'string' ? v : v.id; }
function state(my){ return {positions:my.game.yut.positions,teams:my.game.yut.teams,goal:20}; }
function dictionaryQuery(my){
	var base=[DICTIONARY_COLUMNS[my.opts&&my.opts.dictionary]||DICTIONARY_COLUMNS.standard,true];
	return my.opts&&my.opts.injeong?['$or',[base,['injeong_extra',true]]]:base;
}
function subChar(char){
	var code=String(char||'').charCodeAt(0),offset=code-0xAC00;
	if(offset<0||offset>11171)return '';
	var initial=Math.floor(offset/28/21),vowel=Math.floor(offset/28)%21,tail=offset%28;
	var choseong=initial+0x1100,jungseong=vowel+0x1161,changed=false;
	if(choseong===4357){
		if(RIEUL_TO_NIEUN.indexOf(jungseong)!==-1){choseong=4354;changed=true;}
		else if(RIEUL_TO_IEUNG.indexOf(jungseong)!==-1){choseong=4363;changed=true;}
	}else if(choseong===4354&&NIEUN_TO_IEUNG.indexOf(jungseong)!==-1){choseong=4363;changed=true;}
	return changed?String.fromCharCode((((choseong-0x1100)*21)+(jungseong-0x1161))*28+tail+0xAC00):'';
}
function startsWithRequired(word,char){var alt=subChar(char);return word.charAt(0)===char||!!alt&&word.charAt(0)===alt;}
function initialPattern(char){var alt=subChar(char);return new RegExp('^(?:'+char+(alt&&alt!==char?'|'+alt:'')+')');}
function nextStep(position,route,shortcut){
	if(position===5&&shortcut)return {position:21,route:'diagonalA'};
	if(position===10&&shortcut)return {position:26,route:'diagonalB'};
	if(position===21)return {position:22,route:route};
	if(position===22||position===26||position===27)return {position:position===26?27:23,route:route};
	if(position===23)return {position:route==='diagonalB'?28:24,route:route};
	if(position===24)return {position:25,route:route};
	if(position===25)return {position:15,route:route};
	if(position===28)return {position:29,route:route};
	if(position===29)return {position:20,route:route};
	return {position:Math.min(20,position+1),route:route};
}
function nextChar(word){ return word.slice(-1); }
function hasFollowingWord(my,char,done){
	var query=[['_id',initialPattern(char)],dictionaryQuery(my)];
	DB.kkutu.ko.findOne.apply(DB.kkutu.ko,query).on(function(word){done(!!word);});
}

exports.getTitle = function(){
	var tail=new Lizard.Tail(), my=this, shuffled=my.game.seq.slice().sort(function(){return Math.random()-.5;}), teams={};
	shuffled.forEach(function(player,i){ var id=idOf(player);teams[id]=(i%2)+1;var participant=typeof player==='string'?DIC[id]:player;if(participant&&participant.game)participant.game.team=teams[id]; });
	my.game.seq=shuffled;
	my.game.yut={positions:{1:[0,0,0,0],2:[0,0,0,0]},routes:{1:['outer','outer','outer','outer'],2:['outer','outer','outer','outer']},teams:teams};
	tail.go('윷놀이'); return tail;
};
exports.roundReady = function(){
	var my=this; clearTimeout(my.game.turnTimer); my.game.round=1; my.game.chain=[]; my.game.char=STARTS[Math.floor(Math.random()*STARTS.length)]; my.game.roundTime=600000;
	my.byMaster('roundReady',{round:1,char:my.game.char,subChar:subChar(my.game.char),mission:null,yut:state(my)},true);
	my.game.turnTimer=setTimeout(my.turnStart,1800);
};
exports.turnStart = function(){
	var my=this; clearTimeout(my.game.turnTimer); my.game.late=false; my.game.loading=false; my.game.turnTime=15000; my.game.turnAt=Date.now();
	my.byMaster('turnStart',{turn:my.game.turn,char:my.game.char,subChar:subChar(my.game.char),speed:5,roundTime:my.game.roundTime,turnTime:my.game.turnTime,mission:null,seq:my.game.seq.map(idOf),yut:state(my)},true);
	my.game.turnTimer=setTimeout(my.turnEnd,my.game.turnTime+100);
	var current=my.game.seq[my.game.turn];if(current&&current.robot)my.readyRobot(current);
};
exports.turnEnd = function(){
	var my=this, target=idOf(my.game.seq[my.game.turn]); if(my.game.late)return; my.game.late=true; clearTimeout(my.game.turnTimer);
	delete my.game.yutPending;
	my.byMaster('turnEnd',{ok:false,target:target,score:0,yut:Object.assign({noThrow:true},state(my))},true);
	setTimeout(my.turnNext,1400);
};
function applyYutMove(my,client,choice){
	var pending=my.game.yutPending;if(!pending||pending.clientId!==client.id)return;
	delete my.game.yutPending;clearTimeout(pending.timer);
	var team=pending.team,pieces=my.game.yut.positions[team],routes=my.game.yut.routes[team],opponent=team===1?2:1;
	var isNew=choice==='new'||(choice&&choice.new),piece=Number(choice&&typeof choice==='object'?choice.piece:choice);
	var shortcut=!!(choice&&typeof choice==='object'&&choice.shortcut);
	if(isNew)piece=pieces.findIndex(function(v){return v===0;});
	if(!Number.isInteger(piece)||piece<0||piece>3||pieces[piece]===20||(!isNew&&pieces[piece]===0))piece=pieces.findIndex(function(v){return v===0;});
	if(piece<0){var best=-1;piece=0;for(var p=0;p<pieces.length;p++)if(pieces[p]!==20&&pieces[p]>best){best=pieces[p];piece=p;}}
	var from=pieces[piece],moved=isNew?[piece]:pieces.map(function(v,i){return v===from&&v>0&&v!==20?i:-1;}).filter(function(i){return i>=0;});
	if(!moved.length)moved=[piece];
	var route=routes[piece]||'outer',path=[from],position=from;
	if(pending.roll.backDo){
		// A piece that has not entered the board goes directly to 19. On its
		// next throw, every normal result crosses the finish at 20.
		position=position===0?19:Math.max(0,position-1);route='outer';path.push(position);
	}else for(var step=0;step<pending.roll.move&&position!==20;step++){var next=nextStep(position,route,shortcut&&step===0);position=next.position;route=next.route;path.push(position);}
	moved.forEach(function(index){pieces[index]=position;routes[index]=route;});
	var captured=false;
	if(position>0&&position!==20)my.game.yut.positions[opponent]=my.game.yut.positions[opponent].map(function(old,index){if(old===position){captured=true;my.game.yut.routes[opponent][index]='outer';return 0;}return old;});
	var moveScore=(pending.roll.backDo?10:pending.roll.move*10)+(captured?20:0);
	client.game.score+=moveScore;var winner=pieces.every(function(position){return position===20;})?team:0;
	hasFollowingWord(my,my.game.char,function(chainable){
		var oneShot=!chainable;if(oneShot)my.game.char=STARTS[Math.floor(Math.random()*STARTS.length)];
		// Only Yut/Mo or capturing an opponent grants another turn. A one-shot
		// word still hands the turn over as required by the word rule.
		var extraTurn=!!(pending.roll.extra||captured)&&!oneShot;
		client.publish('turnEnd',{ok:true,value:pending.text,mean:pending.doc.mean||'',theme:pending.doc.theme||'',wc:pending.doc.type||'',score:moveScore,bonus:0,yut:Object.assign({roll:pending.roll.name,move:pending.roll.move,backDo:!!pending.roll.backDo,team:team,piece:piece,moved:moved,path:path,winner:winner,captured:captured,extra:extraTurn,oneShot:oneShot},state(my))},true);
		var animationTime=path.length*360+700;
		if(winner){my.byMaster('yutWin',{team:winner,yut:state(my)},true);return setTimeout(function(){my.roundEnd({winnerTeam:winner});},animationTime+700);}
		setTimeout(extraTurn?my.turnStart:my.turnNext,animationTime);
	});
}
exports.yutMove=function(client,data){applyYutMove(this,client,data&&data.choice);};
exports.yutForceRoll=function(client,data){
	if(!client.admin)return;
	var key=String(data&&data.roll||'').toLowerCase(),roll=FORCED_ROLLS[key];
	if(!roll)return;
	this.game.yutForcedRoll=roll;
	client.send('yutForceRoll',{roll:key,name:roll.name});
};
exports.submit = function(client,text){
	var my=this,target=idOf(my.game.seq[my.game.turn]),at=my.game.turnAt; text=String(text||'').trim();
	if(client.id!==target||my.game.late||my.game.loading||!text||!startsWithRequired(text,my.game.char)||my.game.chain.indexOf(text)>=0)return client.send('turnError',{code:400,value:text});
	my.game.loading=true;
	var query=[['_id',text],dictionaryQuery(my)];
	DB.kkutu.ko.findOne.apply(DB.kkutu.ko,query).on(function(doc){
		if(!doc||!my.gaming||my.game.late||my.game.turnAt!==at){my.game.loading=false;return client.send('turnError',{code:404,value:text});}
		my.game.loading=false;my.game.late=true;clearTimeout(my.game.turnTimer);my.game.chain.push(text);my.game.char=nextChar(text);
		var backs=0;for(var i=0;i<4;i++)if(Math.random()<0.5)backs++;
		// One of the four sticks is marked. A one-back result becomes Back-do
		// when that marked stick is the back-facing one (one chance in four).
		var roll=my.game.yutForcedRoll||(backs===1&&Math.random()<0.25?BACK_DO:ROLLS[backs]),team=my.game.yut.teams[client.id]||1;
		delete my.game.yutForcedRoll;
		var pieces=my.game.yut.positions[team],movable=[];for(var p=0;p<pieces.length;p++)if(pieces[p]>0&&pieces[p]!==20)movable.push({index:p,position:pieces[p]});
		my.game.yutPending={clientId:client.id,team:team,roll:roll,text:text,doc:doc};
		my.byMaster('yutThrow',{roll:roll.name,move:roll.move,team:team},true);
		if(client.robot){
			my.game.yutPending.timer=setTimeout(function(){var target=movable[0];applyYutMove(my,client,target?{piece:target.index,shortcut:target.position===5||target.position===10}:'new');},1400);
		}else{
			var pending=my.game.yutPending;
			pending.timer=setTimeout(function(){applyYutMove(my,client,movable.length?{piece:movable[0].index,shortcut:false}:'new');},10400);
			setTimeout(function(){if(my.game.yutPending===pending)client.send('yutChoice',{roll:roll.name,move:roll.move,canAdd:pieces.some(function(v){return v===0;}),pieces:movable});},1400);
		}
	});
};
exports.getScore = function(text){ return String(text||'').length*10; };
exports.readyRobot = function(robot){
	var my=this, at=my.game.turnAt;
	var query=[['_id',initialPattern(my.game.char)],dictionaryQuery(my)];
	DB.kkutu.ko.find.apply(DB.kkutu.ko,query).limit(100).on(function(words){
		if(!my.gaming||my.game.late||my.game.turnAt!==at)return;
		var available=(words||[]).filter(function(word){return my.game.chain.indexOf(word._id)<0;});
		if(!available.length)return;
		var pick=available[Math.floor(Math.random()*Math.min(available.length,20))];
		setTimeout(function(){if(my.gaming&&!my.game.late&&my.game.turnAt===at)my.turnRobot(robot,pick._id);},Number(robot.level)===4?0:1200+Math.floor(Math.random()*900));
	});
};
