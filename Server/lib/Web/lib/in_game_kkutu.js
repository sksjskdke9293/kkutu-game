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

// The locale script assigns window.L; keep a local binding for every browser.
var L = window.L || { null: '', LOGIN: '로그인', GAE: '개', MN: '명' };
window.L = L;
var ENGLISH_UI = document.documentElement.lang === 'en';
var MODE;
var BEAT = [ null,
	"10000000",
	"10001000",
	"10010010",
	"10011010",
	"11011010",
	"11011110",
	"11011111",
	"11111111"
];
var NULL_USER = {
	profile: { title: L['null'] },
	data: { score: 0 }
};
var MOREMI_PART;
var AVAIL_EQUIP;
var RULE;
var OPTIONS;
var MAX_LEVEL = 360;
var TICK = 30;
var EXP = [];
var BAD = new RegExp([ "느으*[^가-힣]*금마?", "니[^가-힣]*(엄|앰|엠)", "(ㅄ|ㅅㅂ|ㅂㅅ)", "미친(년|놈)?", "(병|븅|빙)[^가-힣]*신", "보[^가-힣]*지", "(새|섀|쌔|썌)[^가-힣]*(기|끼)", "섹[^가-힣]*스", "(시|씨|쉬|쒸)이*입?[^가-힣]*(발|빨|벌|뻘|팔|펄)", "십[^가-힣]*새", "씹", "(애|에)[^가-힣]*미", "자[^가-힣]*지", "존[^가-힣]*나", "좆|죶", "지랄", "창[^가-힣]*(녀|년|놈)", "fuck", "sex", "tlqkf", "qㅕㅇ신", "qudtls", "wlfkf", "whw", "tㅐㄱ스" ].join('|'), "gi");

var ws, rws;
var $stage;
var $sound = {};
var $_sound = {}; // 현재 재생 중인 것들
var $data = {};
var $lib = { Classic: {}, Jaqwi: {}, Crossword: {}, Typing: {}, Hunmin: {}, Daneo: {}, Sock: {}, Yut: {} };
var $rec;
var mobile;

var audioContext = window.hasOwnProperty("AudioContext") ? (new AudioContext()) : false;
var _WebSocket = window['WebSocket'];
var _setInterval = setInterval;
var _setTimeout = setTimeout;
if(typeof Proxy !== 'undefined' && typeof L === 'object') L = new Proxy(L, {
	get: function(target, key){ var value = target[key]; return value === undefined || value === null ? '' : value; }
});

function unlockAudio(){
	if(audioContext && audioContext.state == "suspended"){
		audioContext.resume && audioContext.resume();
	}
	if($data && !$data.muteBGM && typeof getOnly == "function" && getOnly() == "for-lobby"){
		if(!$data.bgm || ($data.bgm.audio && $data.bgm.audio.paused)){
			playBGM('lobby');
		}
	}
}

$(document).on('pointerdown click keydown touchstart', function(){
	unlockAudio();
});

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

$(document).ready(function(){
	var i;
	$('#Intro').appendTo('body');
	$('<div id="RoomBrowseTools"><div><strong>친선전</strong><p>원하는 방을 골라 함께 낱말을 이어 보세요.</p></div><input id="RoomSearch" placeholder="방 이름 검색"><button id="BrowseCreate" type="button">방 만들기</button></div>').insertBefore('.RoomListBox .product-body');
	$('#BrowseCreate').on('click', function(){ window.openNewRoomDialog(); });
	$('#RoomSearch').on('input', function(){
		var query = $(this).val().toLowerCase();
		$('.rooms-item').each(function(){ $(this).toggle($(this).text().toLowerCase().indexOf(query) >= 0); });
	});
	$('#QuickRoomBtn').appendTo('body').empty().append($('<span>').addClass('mobile-menu-label').text('빠른 시작'));
	$('#HelpBtn, #SettingBtn, #CommunityBtn').appendTo('body').addClass('detached-menu');
	$('.RoomListBox, .ShopBox').each(function(){
		var panel = $(this);
		$('<button class="panel-close" aria-label="닫기">×</button>').appendTo(panel).on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			$data._roomListOpen = false;
			$data._shop = false;
			panel.hide();
		});
	});
	
	$data.PUBLIC = $("#PUBLIC").html() == "true";
	$data.URL = $("#URL").html();
	window.__kkutuConnect = function(){ connect(); };
	$data.version = $("#version").html();
	var serverMatch = location.href.match(/[?&]server=(\d+)/);
	var playMatch = location.pathname.match(/^\/play([1-3])$/);
	$data.server = serverMatch ? serverMatch[1] : (playMatch ? String(Number(playMatch[1]) - 1) : '0');
	$data.shop = {};
	$data._okg = 0;
	$data._playTime = 0;
	$data._kd = "";
	$data._timers = [];
	$data._obtain = [];
	$data._wblock = {};
	$data._shut = {};
	$data.usersR = {};
	EXP.push(getRequiredScore(1));
	for(i=2; i<MAX_LEVEL; i++){
		EXP.push(EXP[i-2] + getRequiredScore(i));
	}
	EXP[MAX_LEVEL - 1] = Infinity;
	EXP.push(Infinity);
	$stage = {
		loading: $("#Loading"),
		lobby: {
			userListTitle: $(".UserListBox .product-title"),
			userList: $(".UserListBox .product-body"),
			roomListTitle: $(".RoomListBox .product-title"),
			roomList: $(".RoomListBox .product-body"),
			hero: $("#LobbyHero"),
			createBanner: $("<div>").addClass("rooms-item rooms-create").append($("<div>").html(L['newRoom']))
		},
		chat: $("#Chat"),
		chatLog: $("#chat-log-board"),
		talk: $("#Talk"),
		chatBtn: $("#ChatBtn"),
		menu: {
			help: $("#HelpBtn"),
			setting: $("#SettingBtn"),
			community: $("#CommunityBtn"),
			newRoom: $("#NewRoomBtn"),
			setRoom: $("#SetRoomBtn"),
			quickRoom: $("#QuickRoomBtn"),
			tutorial: $("#TutorialBtn"),
			dailyQuest: $("#DailyQuestBtn"),
			spectate: $("#SpectateBtn"),
			shop: $("#ShopBtn"),
			dict: $("#DictionaryBtn"),
			wordPlus: $("#WordPlusBtn"),
			invite: $("#InviteBtn"),
			ready: $("#ReadyBtn"),
			start: $("#StartBtn"),
			exit: $("#ExitBtn"),
			notice: $("#NoticeBtn"),
			replay: $("#ReplayBtn"),
			leaderboard: $("#LeaderboardBtn")
		},
		dialog: {
			setting: $("#SettingDiag"),
				settingServer: $("#setting-server"),
				settingReset: $("#setting-reset"),
				settingOK: $("#setting-ok"),
			community: $("#CommunityDiag"),
				commFriends: $("#comm-friends"),
				commFriendAdd: $("#comm-friend-add"),
			room: $("#RoomDiag"),
				roomOK: $("#room-ok"),
			quick: $("#QuickDiag"),
				quickOK: $("#quick-ok"),
			result: $("#ResultDiag"),
				resultOK: $("#result-ok"),
				resultSave: $("#result-save"),
			robot: $("#RobotDiag"),
				robotOK: $("#robot-ok"),
			dict: $("#DictionaryDiag"),
				dictInjeong: $("#dict-injeong"),
				dictSearch: $("#dict-search"),
			wordPlus: $("#WordPlusDiag"),
				wordPlusOK: $("#wp-ok"),
			invite: $("#InviteDiag"),
				inviteList: $(".invite-board"),
				inviteRobot: $("#invite-robot"),
			roomInfo: $("#RoomInfoDiag"),
				roomInfoJoin: $("#room-info-join"),
			profile: $("#ProfileDiag"),
				profileShut: $("#profile-shut"),
				profileHandover: $("#profile-handover"),
				profileKick: $("#profile-kick"),
			profileLevel: $("#profile-level"),
			profileDress: $("#profile-dress"),
			profileWhisper: $("#profile-whisper"),
			profileFriendAdd: $("#profile-friend-add"),
			kickVote: $("#KickVoteDiag"),
				kickVoteY: $("#kick-vote-yes"),
				kickVoteN: $("#kick-vote-no"),
			purchase: $("#PurchaseDiag"),
				purchaseOK: $("#purchase-ok"),
				purchaseNO: $("#purchase-no"),
			replay: $("#ReplayDiag"),
				replayView: $("#replay-view"),
			leaderboard: $("#LeaderboardDiag"),
				lbTable: $("#ranking tbody"),
				lbPage: $("#lb-page"),
				lbNext: $("#lb-next"),
				lbMe: $("#lb-me"),
				lbPrev: $("#lb-prev"),
			dress: $("#DressDiag"),
				dressOK: $("#dress-ok"),
			charFactory: $("#CharFactoryDiag"),
				cfCompose: $("#cf-compose"),
			injPick: $("#InjPickDiag"),
				injPickAll: $("#injpick-all"),
				injPickNo: $("#injpick-no"),
				injPickOK: $("#injpick-ok"),
			chatLog: $("#ChatLogDiag"),
			obtain: $("#ObtainDiag"),
				obtainOK: $("#obtain-ok"),
			help: $("#HelpDiag")
		},
		box: {
			chat: $(".ChatBox"),
			userList: $(".UserListBox"),
			roomList: $(".RoomListBox"),
			shop: $(".ShopBox"),
			room: $(".RoomBox"),
			game: $(".GameBox"),
			me: $(".MeBox")
		},
		game: {
			display: $(".jjo-display"),
			hints: $(".GameBox .hints"),
			cwcmd: $(".GameBox .cwcmd"),
			bb: $(".GameBox .bb"),
			items: $(".GameBox .items"),
			chain: $(".GameBox .chain"),
			round: $(".rounds"),
			here: $(".game-input").hide(),
			hereText: $("#game-input"),
			history: $(".history"),
			roundBar: $(".jjo-round-time .graph-bar"),
			turnBar: $(".jjo-turn-time .graph-bar")
		},
		yell: $("#Yell").hide(),
		balloons: $("#Balloons")
	};
	initChatResize();
	function getRankStorageKey(){
		return $data.guest ? 'kkutu-ranked-guest-v1' : 'kkutu-ranked-account-v1-' + ($data.id || 'pending');
	}
	function getRankProfile(){
		var profile = {rating: 1000, wins: 0, losses: 0};
		var accountProfile = !$data.guest && $data.users && $data.users[$data.id] && $data.users[$data.id].data && $data.users[$data.id].data.ranked;
		if(accountProfile) profile = $.extend(profile, accountProfile);
		try{
			if($data.guest){
				var saved = JSON.parse(localStorage.getItem(getRankStorageKey()) || 'null');
				if(saved && isFinite(saved.rating)) profile = $.extend(profile, saved);
			}
		}catch(ex){}
		profile.rating = Math.max(0, Math.round(Number(profile.rating) || 0));
		profile.wins = Math.max(0, Math.round(Number(profile.wins) || 0));
		profile.losses = Math.max(0, Math.round(Number(profile.losses) || 0));
		return profile;
	}
	function saveRankProfile(profile){
		if(!$data.guest) return;
		try{ localStorage.setItem(getRankStorageKey(), JSON.stringify(profile)); }catch(ex){}
	}
	function getRankTier(rating){
		if(rating >= 1500) return {name:'끄투게임즈코리아 랭크', image:'/img/custom/ranks/rank-kkutugame.png'};
		if(rating >= 1300) return {name:'자연', image:'/img/custom/ranks/rank-nature.png'};
		if(rating >= 1150) return {name:'실버', image:'/img/custom/ranks/rank-silver.png'};
		if(rating >= 850) return {name:'브론즈', image:'/img/custom/ranks/rank-bronze.png'};
		return {name:'없음', image:'/img/custom/ranks/rank-none.png'};
	}
	function renderRankedDialog(){
		var profile = getRankProfile();
		var tier = getRankTier(profile.rating);
		$('#RankTierIcon').attr('src', tier.image).attr('alt', tier.name + ' 순위 아이콘');
		$('#RankTierName').text(tier.name);
		$('#RankRating').text(profile.rating + ' RP · ' + profile.wins + '승 ' + profile.losses + '패');
		$('#RankGuestWarning').toggle(!!$data.guest);
	}
	window.kkutuRankStart = function(){
		$data._rankStartProfile = getRankProfile();
		$data._rankResultRecorded = false;
		delete $data._rankResultSummary;
	};
	window.kkutuRankRecordResult = function(result){
		var mine, before, profile, won;
		if(!Array.isArray(result) || !$data.room || !$data.room.ranked) return;
		mine = result.filter(function(entry){ return entry && entry.id == $data.id; })[0];
		if(!mine) return;
		won = Number(mine.rank) === 0;
		profile = getRankProfile();
		before = $data._rankStartProfile || getRankProfile();
		if(!$data._rankStartProfile && !$data.guest){
			before = $.extend({}, profile, { rating: Math.max(0, profile.rating - (won ? 25 : -15)) });
		}
		if($data.guest){
			profile.rating = Math.max(0, profile.rating + (won ? 25 : -15));
			if(won) profile.wins++; else profile.losses++;
			saveRankProfile(profile);
		}
		$data._rankResultSummary = {
			delta: profile.rating - before.rating,
			rating: profile.rating
		};
		return profile;
	};
	function openRankMatchOverlay(){
		$('#RankMatchOverlay').remove();
		$('<div id="RankMatchOverlay"><section><img src="/img/custom/ranks/rank-bronze.png" alt="순위전"><h2>순위전 매칭</h2><p id="RankMatchStatus">상대방을 기다리는 중 · 1 / 2</p><p>표준 낱말집으로 2인 대결을 시작합니다.</p><button id="RankMatchCancel" type="button">매칭 취소</button></section></div>').appendTo('body');
		$('#RankMatchCancel').on('click', function(){ send('rankCancel', {}, true); $('#RankMatchOverlay').remove(); });
	}


 var socialDock=$('<aside id="LobbySocialDock" aria-label="방문자목록과 메인채팅"><span class="social-dock-edge" title="왼쪽 가장자리를 드래그해 너비 조절"></span></aside>').hide().appendTo('body');
 var mobileSocialToggle=$('<button id="MobileSocialToggle" type="button" aria-label="방문자 목록과 채팅 열기" aria-expanded="false"><span aria-hidden="true">‹</span></button>').hide().appendTo(socialDock);
 var chatHome=$('<span hidden>').insertBefore($stage.box.chat),usersHome=$('<span hidden>').insertBefore($stage.box.userList);
 window.fitVisitorNames=function(){ document.documentElement.style.setProperty('--social-panel-width',Math.round(socialDock.get(0).getBoundingClientRect().width || 330)+'px'); $('#LobbySocialDock .users-name').each(function(){var el=this;el.style.setProperty('font-size','22px','important');var size=22;while(el.scrollWidth>el.clientWidth && el.clientWidth>0 && size>11){size--;el.style.setProperty('font-size',size+'px','important');}});};
 if(window.ResizeObserver)new ResizeObserver(function(){window.fitVisitorNames();}).observe(socialDock.get(0));
 window.syncLobbySocialDock=function(){
  var lobby=getOnly()==='for-lobby';
  if(lobby){$stage.box.userList.appendTo(socialDock);$stage.box.chat.appendTo(socialDock);socialDock.show();window.fitVisitorNames();}
  else{$stage.box.userList.insertAfter(usersHome);$stage.box.chat.insertAfter(chatHome);socialDock.hide();$('body').removeClass('mobile-social-open');}
  mobileSocialToggle.toggle(lobby&&innerWidth<=800);
 };
 mobileSocialToggle.on('click',function(){var open=!$('body').hasClass('mobile-social-open');$('body').toggleClass('mobile-social-open',open);mobileSocialToggle.attr({'aria-expanded':String(open),'aria-label':open?'방문자 목록과 채팅 닫기':'방문자 목록과 채팅 열기'}).find('span').text(open?'›':'‹');if(open)setTimeout(window.fitVisitorNames,220);});
 $(window).on('resize.mobileSocial',function(){var mobile=innerWidth<=800,lobby=getOnly()==='for-lobby';mobileSocialToggle.toggle(mobile&&lobby);if(!mobile)$('body').removeClass('mobile-social-open');});
 try{var dockWidth=Number(localStorage.getItem(innerWidth<=800?'kkutu-mobile-social-width':'kkutu-social-width'));if(dockWidth>=(innerWidth<=800?190:290))socialDock.get(0).style.setProperty('--social-width',Math.min(dockWidth,innerWidth>800?innerWidth-460:innerWidth-20)+'px');}catch(e){}
 socialDock.find('.social-dock-edge').on('pointerdown',function(ev){var e=ev.originalEvent||ev;e.preventDefault();var x=e.clientX,w=socialDock.get(0).getBoundingClientRect().width,min=innerWidth>800?290:190,max=innerWidth>800?innerWidth-460:innerWidth-20;this.setPointerCapture(e.pointerId);$('body').addClass('mobile-social-resizing');$(window).on('pointermove.socialDock',function(ev){var m=ev.originalEvent||ev;socialDock.get(0).style.setProperty('--social-width',Math.max(min,Math.min(max,w+x-m.clientX))+'px');window.fitVisitorNames();}).one('pointerup.socialDock pointercancel.socialDock',function(){$(window).off('.socialDock');$('body').removeClass('mobile-social-resizing');try{localStorage.setItem(innerWidth<=800?'kkutu-mobile-social-width':'kkutu-social-width',socialDock.get(0).getBoundingClientRect().width);}catch(e){}});});
 $('<span class="social-mobile-height-edge" title="위아래로 드래그해 채팅창 높이 조절" aria-hidden="true"></span>').appendTo(socialDock).on('pointerdown',function(ev){
  var e=ev.originalEvent||ev;if(innerWidth>800)return;e.preventDefault();var y=e.clientY,h=socialDock.get(0).getBoundingClientRect().height;this.setPointerCapture(e.pointerId);
  $(window).on('pointermove.socialHeight',function(ev){var m=ev.originalEvent||ev;socialDock.get(0).style.setProperty('--mobile-chat-height',Math.max(180,Math.min(innerHeight-90,h+y-m.clientY))+'px');}).one('pointerup.socialHeight pointercancel.socialHeight',function(){$(window).off('.socialHeight');try{localStorage.setItem('kkutu-mobile-chat-height',socialDock.get(0).getBoundingClientRect().height);}catch(e){}});
 });
 try{var mobileHeight=Number(localStorage.getItem('kkutu-mobile-chat-height'));if(mobileHeight>=180)socialDock.get(0).style.setProperty('--mobile-chat-height',mobileHeight+'px');}catch(e){}
 var mobileChatEdge=$('<span class="mobile-chat-height-edge" title="위아래로 드래그해 채팅창 높이 조절"></span>').appendTo($stage.box.chat);
 try{var savedHeight=Number(localStorage.getItem('kkutu-mobile-room-chat-height'));if(savedHeight>=150)document.documentElement.style.setProperty('--mobile-room-chat-height',savedHeight+'px');}catch(e){}
 mobileChatEdge.on('pointerdown',function(ev){var e=ev.originalEvent||ev;if(innerWidth>800)return;e.preventDefault();var y=e.clientY,h=$stage.box.chat[0].getBoundingClientRect().height;this.setPointerCapture(e.pointerId);$(window).on('pointermove.mobileChatHeight',function(ev){var m=ev.originalEvent||ev;document.documentElement.style.setProperty('--mobile-room-chat-height',Math.max(150,Math.min(innerHeight-200,h+y-m.clientY))+'px');}).one('pointerup.mobileChatHeight pointercancel.mobileChatHeight',function(){$(window).off('.mobileChatHeight');try{localStorage.setItem('kkutu-mobile-room-chat-height',$stage.box.chat[0].getBoundingClientRect().height);}catch(e){}});});
 function initChatResize(){
  var node=$stage.box.chat.get(0),start=null;
  if(!node)return;
  $(node).find('.chat-resize-grip,.chat-resize-edge').remove();
  var stateKey='';
  window.syncChatGeometry=function(){
   var mode=document.body.getAttribute('data-game-view')||'for-lobby';
   if(mode===stateKey)return;stateKey=mode;
   ['left','top','width','height'].forEach(function(k){node.style.removeProperty('--chat-'+k);});
   try{var saved=JSON.parse(localStorage.getItem('kkutu-chat-edges-v2-'+mode)||'null');if(saved){saved.width=Math.min(saved.width,innerWidth-24);saved.height=Math.min(saved.height,innerHeight-100);saved.left=Math.max(8,Math.min(saved.left,innerWidth-saved.width-8));saved.top=Math.max(8,Math.min(saved.top,innerHeight-saved.height-8));Object.keys(saved).forEach(function(k){node.style.setProperty('--chat-'+k,saved[k]+'px');});}}catch(e){}
  };
  ['n','s','e','w','ne','nw','se','sw'].forEach(function(edge){
   var handle=$('<span>').addClass('chat-resize-edge edge-'+edge).attr({'aria-hidden':'true',title:'가장자리를 드래그해 채팅창 크기 조절'}).appendTo(node);
   handle.on('pointerdown',function(ev){var e=ev.originalEvent||ev;if(innerWidth<=800)return;e.preventDefault();var r=node.getBoundingClientRect();start={x:e.clientX,y:e.clientY,left:r.left,top:r.top,width:r.width,height:r.height};handle.get(0).setPointerCapture(e.pointerId);
    $(window).on('pointermove.chatEdges',function(ev){var m=ev.originalEvent||ev;if(!start)return;var dx=m.clientX-start.x,dy=m.clientY-start.y,l=start.left,t=start.top,r=l+start.width,b=t+start.height;
     if(edge.indexOf('e')>=0)r=Math.min(innerWidth-8,Math.max(l+340,r+dx));if(edge.indexOf('w')>=0)l=Math.max(8,Math.min(r-340,l+dx));if(edge.indexOf('s')>=0)b=Math.min(innerHeight-8,Math.max(t+220,b+dy));if(edge.indexOf('n')>=0)t=Math.max(8,Math.min(b-220,t+dy));
     node.style.setProperty('--chat-left',l+'px');node.style.setProperty('--chat-top',t+'px');node.style.setProperty('--chat-width',(r-l)+'px');node.style.setProperty('--chat-height',(b-t)+'px');
    });
    $(window).one('pointerup.chatEdges pointercancel.chatEdges',function(){ $(window).off('.chatEdges');var r=node.getBoundingClientRect();try{localStorage.setItem('kkutu-chat-edges-v2-'+stateKey,JSON.stringify({left:r.left,top:r.top,width:r.width,height:r.height}));}catch(e){}start=null; });
   });
  });window.syncChatGeometry();
 }

	if(_WebSocket == undefined){
		$('#intro-text').text('브라우저 WebSocket을 사용할 수 없습니다.');
		loading(L['websocketUnsupport']);
		alert(L['websocketUnsupport']);
		return;
	}
	$data._soundList = [
		{ key: "k", value: "/media/kkutu/k.mp3" },
		{ key: "lobby", value: "/media/kkutu/LobbyBGM.mp3?v=uploaded-20260906-restored" },
		{ key: "lobbyAutumn", value: "/media/kkutu/LobbyAutumnBGM.mp3?v=autumn-20260910" },
		{ key: "lobbyChuseok", value: "/media/kkutu/LobbyChuseokBGM.mp3?v=chuseok-20260914" },
		{ key: "game", value: "/media/kkutu/GameBGM.mp3?v=small-moments-game-20260910" },
		{ key: "jaqwi", value: "/media/kkutu/JaqwiBGM.mp3" },
		{ key: "jaqwiF", value: "/media/kkutu/JaqwiFastBGM.mp3" },
		{ key: "ranked", value: "/media/kkutu/RankedBGM.mp3?v=ranked-20260907" },
		{ key: "game_start", value: "/media/kkutu/game_start.wav?v=gayageum-piano-20260910b" },
		{ key: "round_start", value: "/media/kkutu/round_start.wav?v=gayageum-piano-20260910b" },
		{ key: "fail", value: "/media/kkutu/fail.mp3" },
		{ key: "timeout", value: "/media/kkutu/timeout.mp3" },
		{ key: "lvup", value: "/media/kkutu/lvup.mp3" },
		{ key: "Al", value: "/media/kkutu/Al.mp3" },
		{ key: "success", value: "/media/kkutu/success.mp3" },
		{ key: "mission", value: "/media/kkutu/mission.mp3" },
		{ key: "kung", value: "/media/kkutu/kung.mp3" },
		{ key: "horr", value: "/media/kkutu/horr.mp3" },
	];
	for(i=0; i<=10; i++) $data._soundList.push(
		{ key: "T"+i, value: "/media/kkutu/T"+i+".mp3?v=original-20260909" },
		{ key: "K"+i, value: "/media/kkutu/K"+i+".wav?v=piano-20260910" },
		{ key: "As"+i, value: "/media/kkutu/As"+i+".wav?v=piano-20260910" }
	);
	loadSounds($data._soundList, function(){ processShop(); });
	_setTimeout(connect, 80);
	delete $data._soundList;
	
	MOREMI_PART = $("#MOREMI_PART").html().split(',');
	AVAIL_EQUIP = $("#AVAIL_EQUIP").html().split(',');
	RULE = JSON.parse($("#RULE").html());
	OPTIONS = JSON.parse($("#OPTIONS").html());
	MODE = Object.keys(RULE);
	if(document.documentElement.getAttribute('data-site-theme') !== 'chuseok') $('#room-mode option, #quick-mode option').filter(function(){return MODE[Number(this.value)]==='YUT';}).remove();
	mobile = $("#mobile").html() == "true";
	if(mobile) TICK = 200;
	$data._timePercent = false ? function(){
		return $data._turnTime / $data.turnTime * 100 + "%";
	} : function(){
		var pos = $data._turnSound.audio ? $data._turnSound.audio.currentTime : (audioContext.currentTime - $data._turnSound.startedAt);
		
		return (100 - pos/$data.turnTime*100000) + "%";
	};
	$data.setRoom = function(id, data){
		var isLobby = getOnly() == "for-lobby";
		
		if(data == null){
			delete $data.rooms[id];
			if(isLobby) $("#room-" + id).remove();
		}else{
			// $data.rooms[id] = data;
			if(isLobby && !$data.rooms[id]) $stage.lobby.roomList.append($("<div>").attr('id', "room-" + id));
			$data.rooms[id] = data;
			if(isLobby) $("#room-" + id).replaceWith(roomListBar(data));
		}
		// updateRoomList();
	};
	$data.setUser = function(id, data){
		var only = getOnly();
		var needed = only == "for-lobby" || only == "for-master";
		var $obj;
		
		if($data._replay){
			$rec.users[id] = data;
			return;
		}
		if(data == null){
			delete $data.users[id];
			if(needed) $("#users-item-" + id + ",#invite-item-" + id).remove();
		}else{
			if(needed && !$data.users[id]){
				$obj = userListBar(data, only == "for-master");
				
				if(only == "for-master") $stage.dialog.inviteList.append($obj);
				else $stage.lobby.userList.append($obj);
			}
			$data.users[id] = data;
			if(needed){
				if($obj) $("#" + $obj.attr('id')).replaceWith($obj);
				else $("#" + ((only == "for-lobby") ? "users-item-" : "invite-item") + id).replaceWith(userListBar(data, only == "for-master"));
			}
		}
	};

// 객체 설정
	/*addTimeout(function(){
		$("#intro-start").hide();
		$("#intro").show();
	}, 1400);*/
	$data.opts = $.cookie('kks');
	if($data.opts){
		try{
			var savedOptions = JSON.parse($data.opts);
			if(!savedOptions.lm2){
				savedOptions.lb = 'autumn';
				savedOptions.lm2 = true;
				$.cookie('kks', JSON.stringify(savedOptions));
			}
			applyOptions(savedOptions);
		}catch(ex){
			applyOptions(defaultSettingsOptions());
		}
	}else{
		applyOptions(defaultSettingsOptions());
	}
	$(".dialog-head .dialog-title").on('mousedown', function(e){
		var $pd = $(e.currentTarget).parents(".dialog");
		
		$(".dialog-front").removeClass("dialog-front");
		$pd.addClass("dialog-front");
		startDrag($pd, e.pageX, e.pageY);
	}).on('mouseup', function(e){
		stopDrag();
	});
	// addInterval(checkInput, 1);
	$stage.box.chat.attr('id','ChatPanel');
	$data.chatUnread = {main:0, room:0};
	var tabs = $('<div id="ChatTabs"><button type="button" data-scope="main">메인채팅 <b class="chat-unread" data-unread="main"></b></button><button type="button" data-scope="room">방 채팅 <b class="chat-unread" data-unread="room"></b></button></div>').prependTo('.ChatBox > .product-body');
 tabs.prepend('<span class="chat-brand-mark" aria-label="끄투"><img src="/img/custom/chat-brand-white.png" alt="끄투" draggable="false"></span>');
 window.markChatUnread = function(scope){
  scope=scope==='room'?'room':'main';
  if($data.chatScope!==scope) $data.chatUnread[scope]=($data.chatUnread[scope]||0)+1;
  var count=$data.chatUnread[scope]||0;
  tabs.find('[data-unread="'+scope+'"]').text(count>99?'99+':count).toggle(count>0);
 };
 window.syncChatTabs = function(){
  var roomId=$data.room ? String($data.room.id) : '';
  if(roomId !== $data._chatRoomId){
   $('#Chat,#chat-log-board').find('[data-chat-scope="room"]').remove();
   $data.chatUnread.room=0;tabs.find('[data-unread="room"]').empty().hide();
   if(roomId)$data.chatScope='room';
  }
  $data._chatRoomId=roomId;
  if(!$data.room) $data.chatScope='main';
  if(!$data.chatScope) $data.chatScope=$data.room ? 'room' : 'main';
  tabs.find('[data-scope="room"]').toggle(!!$data.room);
  tabs.find('button').each(function(){ $(this).attr('aria-selected',$(this).attr('data-scope') === $data.chatScope); });
  $data.chatUnread[$data.chatScope]=0;
  tabs.find('[data-unread="'+$data.chatScope+'"]').empty().hide();
  $('.ChatBox').attr('data-chat-tab',$data.chatScope);
 };
 tabs.on('click','button',function(e){ e.preventDefault(); e.stopPropagation(); $data._chatRoomId=$data.room ? String($data.room.id) : ''; $data.chatScope=$(this).attr('data-scope'); syncChatTabs(); $stage.chat.scrollTop(999999999); });
 $stage.talk.attr('placeholder','채팅창');
 function formatChatRows(){
  $stage.chat.children('.chat-item').each(function(){var row=$(this);if(row.children('.chat-message-content').length)return;var text=row.children('.chat-head,.chat-body');if(text.length)text.wrapAll('<div class="chat-message-content"></div>');});
 }
 if(window.MutationObserver)new MutationObserver(formatChatRows).observe($stage.chat.get(0),{childList:true});
 formatChatRows();
 syncChatTabs();
 $stage.chatBtn.on('click', function(e){
		checkInput();
		
		var value = $stage.talk.val();
		if(!value) return;
		var o = { value: value.trim() };
		if(o.value[0] == "/"){
			o.cmd = o.value.split(" ");
			runCommand(o.cmd);
		}else{
			o.scope = $data.chatScope || ($data.room ? 'room' : 'main');
			send('talk', o, o.scope === 'main');
		}
		if($data._whisper){
			$stage.talk.val("/e " + $data._whisper + " ");
			delete $data._whisper;
		}else{
			$stage.talk.val("");
		}
	}).hotkey($stage.talk, 13);
	function submitGameWord(){
		if(!$stage.game.here.is(':visible') || !$data.room || !$data.room.gaming || $data._replay) return;
		if($('body').hasClass('modern-classic') && $data._wordInputMode !== 'answer'){
			if($data._wordInputMode === 'hint'){
				var hint = $stage.game.hereText.val().trim();
				if(hint) send('playerHint', {value:hint});
				$data._inputValues = $data._inputValues || {};
				$data._inputValues.hint = $stage.game.hereText.val();
				$data._sharedWordInput = $stage.game.hereText.val();
				return;
			}
			var prediction = $stage.game.hereText.val().trim();
			if(prediction) send('checkPrediction', {value:prediction});
			$data._inputValues = $data._inputValues || {};
			$data._inputValues.prediction = $stage.game.hereText.val();
			$data._sharedWordInput = $stage.game.hereText.val();
			return;
		}
		var value = $stage.game.hereText.val().trim();
		if(!value) return;
		send('talk', {value:value, relay:true});
		$data._sharedWordInput = '';
		$data._inputValues = $data._inputValues || {};
		$data._inputValues.answer = '';
		$stage.game.hereText.val('').focus();
	}
	function blocksGameInputAutomation(inputType){
		return inputType === 'insertFromPaste' || inputType === 'insertFromDrop' ||
			inputType === 'insertFromYank' || inputType === 'insertReplacementText';
	}
	var wordComposing = false, lastGameWordValue = '';
		function syncWrappedWordBoard(){
		if(!$('body').is('[data-game-view="for-gaming"]')) return;
		var $board = $('.GameBox .jjoDisplayBar'), $frame = $('.GameBox .jjoriping'), $head = $('.GameBox .game-head');
		if(!$board.length || !$frame.length || !$head.length) return;
		var extra = Math.max(0, Math.ceil($frame.outerHeight(true)) - 112);
		$head.css({ height:(250 + extra) + 'px', 'min-height':(250 + extra) + 'px' });
		$('.GameBox .history-holder').css('top', (153 + extra) + 'px');
		$('.GameBox .hints').css('top', (201 + extra) + 'px');
	}
	if(window.ResizeObserver){
		var wordBoardNode = $('.GameBox .jjoDisplayBar').get(0);
		if(wordBoardNode) new ResizeObserver(function(){ window.requestAnimationFrame(syncWrappedWordBoard); }).observe(wordBoardNode);
	}
$stage.game.hereText.removeAttr('maxlength').prop('readOnly', false).attr({
		enterkeyhint:'send', autocomplete:'off', autocorrect:'off', autocapitalize:'none',
		spellcheck:'false', inputmode:'text', 'aria-autocomplete':'none'
	})
		// Keep Korean IME composition intact, but reject pasted, dropped, and keyboard
		// auto-replacement text before it reaches the answer field.  This binding is
		// deliberately scoped to #game-input so normal chat pasting still works.
		.on('beforeinput.answerIntegrity', function(e){
			var original = e.originalEvent || e;
			if(!blocksGameInputAutomation(original && original.inputType)){
				lastGameWordValue = $(this).val();
				return;
			}
			e.preventDefault();
			return false;
		})
		// A few older mobile WebViews do not honor preventDefault() on beforeinput.
		// Restore the last typed value if one of their replacement events slips through.
		.on('input.answerIntegrity', function(e){
			var original = e.originalEvent || e;
			if(blocksGameInputAutomation(original && original.inputType)){
				$(this).val(lastGameWordValue);
				return;
			}
			lastGameWordValue = $(this).val();
		})
		.on('paste.answerIntegrity drop.answerIntegrity', function(e){
			e.preventDefault();
			return false;
		})
		.on('compositionstart', function(){ wordComposing = true; })
		.on('compositionend', function(){ wordComposing = false; })
		.on('keydown', function(e){
			if(e.key !== 'Enter' && e.keyCode !== 13) return;
			if(wordComposing || (e.originalEvent && e.originalEvent.isComposing)) return;
			e.preventDefault(); submitGameWord();
		});
	$('<button id="GameWordSubmit" type="button">입력</button>').appendTo($stage.game.here).on('click', submitGameWord);
	$('<div id="TurnHint" aria-live="polite"></div>').appendTo('.GameBox .jjoriping');
	window.usePlayerHint = function(index){
		if($data._wordInputMode !== 'answer' || $data._replay) return;
		send('usePlayerHint', {index:index});
	};
	$(document).on('keydown.turnHint', function(e){
		if(!$('body').hasClass('modern-classic') || e.isComposing || (e.originalEvent && e.originalEvent.isComposing)) return;
		if(!/^[1-9]$/.test(e.key) || e.ctrlKey || e.altKey || e.metaKey || $(e.target).is('#Talk,textarea,[contenteditable]')) return;
		if($data._wordInputMode === 'answer' && $data._playerHints && $data._playerHints[Number(e.key)-1]){ e.preventDefault(); usePlayerHint(Number(e.key)-1); }
	});
	$stage.game.hereText.on('input.prediction', function(){
		if($data._wordInputMode){
			$data._inputValues = $data._inputValues || {};
			$data._inputValues[$data._wordInputMode] = $(this).val();
			$data._sharedWordInput = $(this).val();
		}
	});
	$("#cw-q-input").on('keydown', function(e){
		if(e.keyCode == 13){
			var $target = $(e.currentTarget);
			var value = $target.val();
			var o = { relay: true, data: $data._sel, value: value };
			
			if(!value) return;
			send('talk', o);
			$target.val("");
		}
	}).on('focusout', function(e){
		$(".cw-q-body").empty();
		$stage.game.cwcmd.css('opacity', 0);
	});
	$("#room-limit").on('change', function(e){
		var $target = $(e.currentTarget);
		var value = $target.val();
		
		if(value < 2 || value > 8){
			$target.css('color', "#FF4444");
		}else{
			$target.css('color', "");
		}
	});
	$("#room-round").on('change', function(e){
		var $target = $(e.currentTarget);
		var value = $target.val();
		
		if(value < 1 || value > 10){
			$target.css('color', "#FF4444");
		}else{
			$target.css('color', "");
		}
	});
	$stage.game.here.on('click', function(e){
		$stage.game.hereText.focus();
	});
	$(window).on('beforeunload', function(e){
		if($data.room) return L['sureExit'];
	});
	function startDrag($diag, sx, sy){
		var pos = $diag.position();
		$(window).on('mousemove', function(e){
			var dx = e.pageX - sx, dy = e.pageY - sy;
			
			$diag.css('left', pos.left + dx);
			$diag.css('top', pos.top + dy);
		});
	}
	function stopDrag($diag){
		$(window).off('mousemove');
	}
	$(".result-me-gauge .graph-bar").addClass("result-me-before-bar");
	$(".result-me-gauge")
		.append($("<div>").addClass("graph-bar result-me-current-bar"))
		.append($("<div>").addClass("graph-bar result-me-bonus-bar"));
// 메뉴 버튼
	for(i in $stage.dialog){
		if($stage.dialog[i].children(".dialog-head").hasClass("no-close")) continue;
		
		$stage.dialog[i].children(".dialog-head").append($("<div>").addClass("closeBtn").on('click', function(e){
			$(e.currentTarget).parent().parent().hide();
		}).hotkey(false, 27));
	}
	$stage.menu.help.on('click', function(e){
		$("#help-board").attr('src', "/help");
		showDialog($stage.dialog.help);
	});
	$stage.menu.setting.on('click', function(e){
		syncSettingsControls();
		showDialog($stage.dialog.setting);
	});
	$("#settings-bgm-volume, #settings-effect-volume").on('input change', function(e){
		applyOptions(readSettingsOptions());
	});
	$("#mute-bgm, #mute-effect").on('change', function(e){
		applyOptions(readSettingsOptions());
	});
	$("#settings-lobby-bgm").on('change', function(e){
		applyOptions(readSettingsOptions());
	});
	$stage.menu.community.on('click', function(e){
		if($data.guest) return fail(451);
		showDialog($stage.dialog.community);
	});
	$stage.dialog.commFriendAdd.on('click', function(e){
		var id = prompt(L['friendAddNotice']);
		
		if(!id) return;
		if(!$data.users[id]) return fail(450);
		
		send('friendAdd', { target: id }, true);
	});
	window.openNewRoomDialog = function(){
		var $d;
		
		$stage.dialog.quick.hide();
		
		$data.typeRoom = 'enter';
		$("#room-dictionary").val("standard");
		$("#room-shield").val(15);
		showDialog($d = $stage.dialog.room);
		$d.find(".dialog-title").html(L['newRoom']);
	};
	$stage.menu.newRoom.html("방 목록").on('click', function(e){
		$data._shop = false;
		$data._roomListOpen = !$data._roomListOpen;
		$stage.dialog.quick.hide();
		$stage.dialog.room.hide();
		$stage.box.shop.hide();
		$stage.box.roomList.toggle($data._roomListOpen);
		updateRoomList(true);
	});
	$stage.menu.setRoom.on('click', function(e){
		var $d;
		var rule = RULE[MODE[$data.room.mode]];
		var i, k;
		
		$data.typeRoom = 'setRoom';
		$("#room-title").val($data.room.title);
		$("#room-limit").val($data.room.limit);
		$("#room-mode").val($data.room.mode).trigger('change');
		$("#room-round").val($data.room.round);
		$("#room-time").val($data.room.time / rule.time);
		$("#room-dictionary").val($data.room.opts.dictionary || "standard");
		$("#room-shield").val($data.room.opts.shield == null ? 15 : $data.room.opts.shield);
		for(i in OPTIONS){
			k = OPTIONS[i].name.toLowerCase();
			$("#room-" + k).attr('checked', $data.room.opts[k]);
		}
		$data._injpick = $data.room.opts.injpick;
		showDialog($d = $stage.dialog.room);
		$d.find(".dialog-title").html(L['setRoom']);
	});
	function updateGameOptions(opts, prefix){
		var i, k;
		
		for(i in OPTIONS){
			k = OPTIONS[i].name.toLowerCase();
			if(opts.indexOf(i) == -1) $("#" + prefix + "-" + k + "-panel").hide();
			else $("#" + prefix + "-" + k + "-panel").show();
		}
	}
	function getGameOptions(prefix){
		var i, name, opts = {};
		
		for(i in OPTIONS){
			name = OPTIONS[i].name.toLowerCase();
			
			if($("#" + prefix + "-" + name).is(':checked')) opts[name] = true;
		}
		return opts;
	}
	function isRoomMatched(room, mode, opts, all){
		var i;
		
		if(!all){
			if(room.gaming) return false;
			if(room.password) return false;
			if(room.players.length >= room.limit) return false;
		}
		if(room.mode != mode) return false;
		for(i in opts) if(!room.opts[i]) return false;
		return true;
	}
	$("#quick-mode, #QuickDiag .game-option").on('change', function(e){
		var val = $("#quick-mode").val();
		var ct = 0;
		var i, opts;
		
		if(e.currentTarget.id == "quick-mode"){
			$("#QuickDiag .game-option").prop('checked', false);
		}
		opts = getGameOptions('quick');
		updateGameOptions(RULE[MODE[val]].opts, 'quick');
		for(i in $data.rooms){
			if(isRoomMatched($data.rooms[i], val, opts, true)) ct++;
		}
		$("#quick-status").html(L['quickStatus'] + " " + ct);
	});
	function beginQuickMatch(){
		$stage.dialog.quick.hide();
		$('#MatchOverlay').remove();
		$('<div id="MatchOverlay"><section><h2>'+(ENGLISH_UI?'Quick Join':'빠른 시작')+'</h2><p id="MatchStatus">'+(ENGLISH_UI?'Waiting for another player · 1 / 2':'상대방을 기다리는 중 · 1 / 2')+'</p><div id="MatchVotes"></div><p id="MatchHint"></p><button id="MatchCancel" type="button">'+(ENGLISH_UI?'Cancel match':'매칭 취소')+'</button></section></div>').appendTo('body');
		$('#MatchCancel').on('click', function(){ send('matchCancel', {}, true); $('#MatchOverlay').remove(); });
		send('matchJoin', {}, true);
	}
	function tutorialKey(){ return 'kkutu-tutorial-complete:' + ($data.id || ''); }
	window.refreshTutorialEntry = function(){
		var me = $data.users && $data.users[$data.id];
		var isNew = me && me.data && Number(me.data.score || 0) === 0 && !$data.guest;
		var done = false; try { done = !!localStorage.getItem(tutorialKey()); } catch(_) {}
		$stage.menu.tutorial.toggle(!!isNew && !done && getOnly() == 'for-lobby');
	};
	function openTutorial(){
		var steps=[['환영합니다!','방 만들기나 빠른 시작으로 한국어 끝말잇기 2인 매칭에 참여할 수 있어요.'],['낱말 입력','내 차례에는 화면 아래 입력칸에 앞말의 마지막 글자로 시작하는 낱말을 입력하세요.'],['게임 시작','정답을 빠르게 제출해 점수를 얻고, 라운드가 끝날 때 가장 높은 점수를 노려 보세요.']];
		var index=0, shade=$('<div id="TutorialOverlay"><section><h2></h2><p></p><button type="button" class="tutorial-next"></button></section></div>').appendTo('body');
		function draw(){shade.find('h2').text(steps[index][0]);shade.find('p').text(steps[index][1]);shade.find('.tutorial-next').text(index===steps.length-1?'시작하기':'다음');}
		shade.find('.tutorial-next').on('click',function(){if(++index>=steps.length){try{localStorage.setItem(tutorialKey(),'1');}catch(_){}shade.remove();window.refreshTutorialEntry();}else draw();});draw();
	}
	$stage.menu.tutorial.on('click.tutorialMenu',function(e){e.preventDefault();openTutorial();});
	$stage.menu.quickRoom.on('click.quickMenu', function(e){
		e.preventDefault();
		if(getOnly() != 'for-lobby') return;
		// Fast start is a fixed two-player Korean word-chain match. The
		// server matchmaker presents the dictionary vote after both players join.
		beginQuickMatch();
	});
	$stage.dialog.quickOK.on('click.quickMenu', function(e){
		e.preventDefault();
		if(getOnly() != 'for-lobby') return;
		beginQuickMatch();
	});
	$("#room-mode").on('change', function(e){
		var v = $("#room-mode").val();
		var rule = RULE[MODE[v]];
		$("#game-mode-expl").html(L['modex' + v]);

		updateGameOptions(rule.opts, 'room');
		var usesMoraeDictionary = ["2", "3", "8"].indexOf(String(v)) != -1 || rule.rule == "Yut";
		$("#room-dictionary-panel").toggle(usesMoraeDictionary);
		var legacyWordOptions = { loanword: "loa", strict: "str" };
		Object.keys(legacyWordOptions).forEach(function(option){
			$("#room-" + option + "-panel").toggle(!usesMoraeDictionary && rule.opts.indexOf(legacyWordOptions[option]) != -1);
		});
		
		$data._injpick = [];
		if(rule.opts.indexOf("ijp") != -1) $("#room-injpick-panel").show();
		else $("#room-injpick-panel").hide();
		if(rule.rule == "Typing") $("#room-round").val(3);
		$("#room-time").children("option").each(function(i, o){
			$(o).html(Number($(o).val()) * rule.time + L['SECOND']);
		});
	}).trigger('change');
	$stage.menu.spectate.on('click', function(e){
		var mode = $stage.menu.spectate.hasClass("toggled");
		
		if(mode){
			send('form', { mode: "J" });
			$stage.menu.spectate.removeClass("toggled");
		}else{
			send('form', { mode: "S" });
			$stage.menu.spectate.addClass("toggled");
		}
	});
	$stage.menu.shop.on('click', function(e){
		e.preventDefault();
		$data._shop = !$data._shop;
		if($data._shop){
			loadShop();
			$stage.menu.shop.addClass("toggled");
		}else{
			$stage.menu.shop.removeClass("toggled");
		}
		updateUI();
		return false;
	});
	$(document).on('click', '#DungGeunMoBuy', function(){
		var my = $data.users[$data.id];
		if($data.guest) return fail(423);
		$data._fontPurchase = true;
		showDialog($stage.dialog.purchase, true);
		$('#purchase-ping-before').html(commify(my.money) + L['ping']);
		$('#purchase-ping-cost').html('200' + L['ping']);
		$('#purchase-ping-after').html(commify(my.money - 200) + L['ping']);
		$('#purchase-item-name').text('끄투 글꼴');
		$('#purchase-item-desc').text('해당 상품은 환불이 불가한 상품입니다. 이에 이해 하셨습니까?');
		$stage.dialog.purchaseOK.attr('disabled', my.money < 200).text('수락');
		$stage.dialog.purchaseNO.text('거절');
	});
	$(".shop-type").on('click', function(e){
		var $target = $(e.currentTarget);
		var type = $target.attr('id').slice(10);
		
		$(".shop-type.selected").removeClass("selected");
		$target.addClass("selected");
		
		filterShop(type == 'all' || $target.attr('value'));
	});
	$stage.menu.dict.on('click', function(e){
		showDialog($stage.dialog.dict);
	});
	$stage.menu.wordPlus.on('click', function(e){
		showDialog($stage.dialog.wordPlus);
	});
	$stage.menu.invite.on('click', function(e){
		showDialog($stage.dialog.invite);
		updateUserList(true);
	});
	$('#RoomSpectateAction').on('click', function(){ $stage.menu.spectate.trigger('click'); });
	$('#RoomSettingsAction').on('click', function(){ $stage.menu.setRoom.trigger('click'); });
	$('#RoomInviteAction').on('click', function(){ $stage.menu.invite.trigger('click'); });
	$('#RoomBotAction').on('click', function(){ $stage.dialog.inviteRobot.trigger('click'); });
	$('#RoomDictionaryAction').on('click', function(){ $stage.menu.dict.trigger('click'); });
	$('#RoomExitAction').on('click', function(){ $stage.menu.exit.trigger('click'); });
	$('#RoomStartAction').on('click', function(){ $stage.menu.start.trigger('click'); });
	$('#RoomReadyAction').on('click', function(){ $stage.menu.ready.trigger('click'); });
	$stage.menu.ready.on('click', function(e){
		send('ready');
	});
	$stage.menu.start.on('click', function(e){
		loading(L['gameLoading'] || '게임을 불러오는 중…');
		requestAnimationFrame(function(){ setTimeout(function(){ send('start'); }, 0); });
	});
	$stage.menu.exit.on('click', function(e){
		if($data.room.gaming){
			if(!confirm(L['sureExit'])) return;
			clearGame();
		}
		send('leave');
	});
	$("#GameExitControl").on('click', function(e){
		$stage.menu.exit.trigger('click');
	});
	$stage.menu.replay.on('click', function(e){
		if($data._replay){
			replayStop();
		}
		showDialog($stage.dialog.replay);
		initReplayDialog();
		if($stage.dialog.replay.is(':visible')){
			$("#replay-file").trigger('change');
		}
	});
	$stage.menu.leaderboard.on('click', function(e){
		renderRankedDialog();
		showDialog($stage.dialog.leaderboard);
	});
	$('#RankQueueBtn').on('click', function(){
		if(getOnly() != 'for-lobby') return;
		$stage.dialog.leaderboard.hide();
		openRankMatchOverlay();
		send('rankJoin', {}, true);
	});
	$stage.dialog.settingServer.on('click', function(e){
		location.href = "/";
	});
	$stage.dialog.settingReset.on('click', function(e){
		applyOptions(defaultSettingsOptions());
		$.cookie('kks', JSON.stringify($data.opts));
	});
	$stage.dialog.settingOK.on('click', function(e){
		applyOptions(readSettingsOptions());
		$.cookie('kks', JSON.stringify($data.opts));
		$stage.dialog.setting.hide();
	});
	$stage.dialog.profileLevel.on('click', function(e){
		showDialog($stage.dialog.robot);
	});
	$stage.dialog.robotOK.on('click', function(e){
		var level = $("#robot-level").val();
		var team = $("#robot-team").val();
		
		$stage.dialog.robot.hide();
		send('setAI', { target: $data._profiled, level: level, team: team });
	});
	$stage.dialog.roomOK.on('click', function(e){
		var i, k, opts = {
			injpick: $data._injpick,
			shield: Math.max(0, Math.min(100, Number($("#room-shield").val()) || 0)),
			dictionary: $("#room-dictionary").val() || "standard"
		};
		for(i in OPTIONS){
			k = OPTIONS[i].name.toLowerCase();
			opts[k] = $("#room-" + k).is(':checked');
		}
		send($data.typeRoom, {
			title: $("#room-title").val().trim() || $("#room-title").attr('placeholder').trim(),
			password: $("#room-pw").val(),
			limit: $("#room-limit").val(),
			mode: $("#room-mode").val(),
			round: $("#room-round").val(),
			time: $("#room-time").val(),
			opts: opts,
		});
		$stage.dialog.room.hide();
	});
	$('#admin-practice-bot').on('click', function(){
		requestInvite('AI');
		$stage.dialog.room.hide();
	});
	$stage.dialog.resultOK.on('click', function(e){
        restoreResultAd();
		if(!$('#ResultDiag').hasClass('match-result-screen') && $data._resultPage == 1 && $data._resultRank){
			drawRanking($data._resultRank[$data.id]);
			return;
		}
		if($data.room && $data.room.ranked && !$data._replay){
			// Ranked matches are single-use rooms. Returning from the result
			// screen always leaves the closed match instead of reopening it.
			$data.resulting = false;
			$stage.dialog.result.hide();
			send('leave');
			return;
		}
		if($data.practicing){
			$data.room.gaming = true;
			send('leave');
		}
		$data.resulting = false;
		$stage.dialog.result.hide();
		delete $data._replay;
		delete $data._resultRank;
		$stage.box.room.height(360);
		playBGM('lobby');
		forkChat();
		updateUI();
	});
	$stage.dialog.resultSave.on('click', function(e){
		var date = new Date($rec.time);
		var blob = new Blob([ JSON.stringify($rec) ], { type: "text/plain" });
		var url = URL.createObjectURL(blob);
		var fileName = "KKuTu" + (
			date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
			+ date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds()
		) + ".kkt";
		var $a = $("<a>").attr({
			'download': fileName,
			'href': url
		}).on('click', function(e){
			$a.remove();
		});
		$("#Jungle").append($a);
		$a[0].click();
	});
	$stage.dialog.dictInjeong.on('click', function(e){
        var $target = $(e.currentTarget), word = String($('#dict-input').val() || '').trim();
        var theme = $('#dict-theme').val();
        if($target.is(':disabled')) return;
        if(!word){ $('#dict-output').text('신청할 단어를 입력해 주세요.'); return; }
        if(!theme){ $('#dict-output').text('주제를 선택해 주세요.'); return; }
        $target.prop('disabled', true);
        $('#dict-output').text(L['searching'] || '신청 중…');
        $.ajax({url:'/injeong/' + encodeURIComponent(word),data:{theme:theme},dataType:'json',timeout:12000})
        .done(function(res){
            if(res.error) return $('#dict-output').text(res.message || (res.error + ': ' + (L['wpFail_' + res.error] || '신청하지 못했습니다.')));
            $('#dict-output').text((L['wpSuccess'] || '신청했습니다.') + '(' + res.message + ')');
        }).fail(function(){
            $('#dict-output').text('서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }).always(function(){ addTimeout(function(){ $target.prop('disabled', false); }, 2000); });
    });
	$stage.dialog.dictSearch.on('click', function(e){
		var $target = $(e.currentTarget);
		
		if($target.is(':disabled')) return;
		$target.prop('disabled', true);
		$("#dict-output").text(L['searching'] || '검색 중…');
		tryDict($("#dict-input").val(), function(res){
			addTimeout(function(){
				$target.prop('disabled', false);
			}, 500);
			if(res.error) return $("#dict-output").text(res.message || (res.error == 404 ? '사전에 등록되지 않은 단어입니다.' : (L['wpFail_' + res.error] || '검색에 실패했습니다. 다시 시도해 주세요.')));
			
			$("#dict-output").html(processWord(res.word, res.mean, res.theme, String(res.type || '').split(',')));
		});
	}).hotkey($("#dict-input"), 13);
	$stage.dialog.wordPlusOK.on('click', function(e){
		var t;
		if($stage.dialog.wordPlusOK.hasClass("searching")) return;
		if(!(t = $("#wp-input").val())) return;
		t = t.replace(/[^a-z가-힣]/g, "");
		if(t.length < 2) return;
		
		$("#wp-input").val("");
		$(e.currentTarget).addClass("searching").html("<i class='fa fa-spin fa-spinner'></i>");
		send('wp', { value: t });
	}).hotkey($("#wp-input"), 13);
	$stage.dialog.inviteRobot.on('click', function(e){
		requestInvite("AI");
	});
	$stage.box.me.on('click', function(e){
		requestProfile($data.id);
	});
	$stage.dialog.roomInfoJoin.on('click', function(e){
		$stage.dialog.roomInfo.hide();
		tryJoin($data._roominfo);
	});
	$stage.dialog.profileHandover.on('click', function(e){
		if(!confirm(L['sureHandover'])) return;
		send('handover', { target: $data._profiled });
	});
	$stage.dialog.profileKick.on('click', function(e){
		send('kick', { robot: $data.robots.hasOwnProperty($data._profiled), target: $data._profiled });
	});
	$stage.dialog.profileShut.on('click', function(e){
		var o = $data.users[$data._profiled];
		
		if(!o) return;
		toggleShutBlock(o.profile.title || o.profile.name);
	});
	$stage.dialog.profileWhisper.on('click', function(e){
		var o = $data.users[$data._profiled];
		
		$stage.talk.val("/e " + (o.profile.title || o.profile.name).replace(/\s/g, "") + " ").focus();
	});
	$stage.dialog.profileFriendAdd.on('click', function(e){
		var target = $data.users[$data._profiled];
		if(!target || target.robot || target.id == $data.id) return;
		if($data.guest) return fail(421);
		send('friendAdd', { target: target.id }, true);
		$stage.dialog.profile.hide();
	});
	$stage.dialog.profileDress.on('click', function(e){
		// alert(L['error_555']);
		if($data.guest) return fail(421);
		if($data._gaming) return fail(438);
		$stage.dialog.dress.find('.dialog-title').text('보관함');
		if(showDialog($stage.dialog.dress)) processShop(function(shop){
			if(shop && shop.error) return fail(shop.error);
			$.get("/box", function(res){
				if(res.error) return fail(res.error);
				$data.box = res || {};
				drawMyDress(true);
			}).fail(function(){ fail(500); });
		});
	});
	$stage.dialog.dressOK.on('click', function(e){
		$(e.currentTarget).attr('disabled', true);
		$.post("/exordial", { data: $("#dress-exordial").val() }, function(res){
			$stage.dialog.dressOK.attr('disabled', false);
			if(res.error) return fail(res.error);
			
			$stage.dialog.dress.hide();
		});
	});
	$("#dress-cf").on('click', function(e){
		if($data._gaming) return fail(438);
		if(showDialog($stage.dialog.charFactory)) drawCharFactory();
	});
	$stage.dialog.cfCompose.on('click', function(e){
		if(!$stage.dialog.cfCompose.hasClass("cf-composable")) return fail(436);
		if(!confirm(L['cfSureCompose'])) return;
		
		$.post("/cf", { tray: $data._tray.join('|') }, function(res){
			var i;
			
			if(res.error) return fail(res.error);
			send('refresh');
			alert(L['cfComposed']);
			$data.users[$data.id].money = res.money;
			$data.box = res.box;
			for(i in res.gain) queueObtain(res.gain[i]);
			
			drawMyDress($data._avGroup);
			updateMe();
			drawCharFactory();
		});
	});
	$("#room-injeong-pick").on('click', function(e){
		var rule = RULE[MODE[$("#room-mode").val()]];
		var i;
		
		$("#injpick-list>div").hide();
		if(rule.lang == "ko"){
			$data._ijkey = "#ko-pick-";
			$("#ko-pick-list").show();
		}else if(rule.lang == "en"){
			$data._ijkey = "#en-pick-";
			$("#en-pick-list").show();
		}
		$stage.dialog.injPickNo.trigger('click');
		for(i in $data._injpick){
			$($data._ijkey + $data._injpick[i]).prop('checked', true);
		}
		showDialog($stage.dialog.injPick);
	});
	$stage.dialog.injPickAll.on('click', function(e){
		$("#injpick-list input").prop('checked', true);
	});
	$stage.dialog.injPickNo.on('click', function(e){
		$("#injpick-list input").prop('checked', false);
	});
	$stage.dialog.injPickOK.on('click', function(e){
		var $target = $($data._ijkey + "list");
		var list = [];
		
		$data._injpick = $target.find("input").each(function(i, o){
			var $o = $(o);
			var id = $o.attr('id').slice(8);
			
			if($o.is(':checked')) list.push(id);
		});
		$data._injpick = list;
		$stage.dialog.injPick.hide();
	});
	$stage.dialog.kickVoteY.on('click', function(e){
		send('kickVote', { agree: true });
		clearTimeout($data._kickTimer);
		$stage.dialog.kickVote.hide();
	});
	$stage.dialog.kickVoteN.on('click', function(e){
		send('kickVote', { agree: false });
		clearTimeout($data._kickTimer);
		$stage.dialog.kickVote.hide();
	});
	$stage.dialog.purchaseOK.on('click', function(){
		if($data._purchasePending) return;
		var font = !!$data._fontPurchase;
		$data._purchasePending = true;
		$stage.dialog.purchaseOK.prop('disabled', true).text('구매 중…');
		$.ajax({url:font ? '/buy-font/dunggeunmo' : '/buy/' + encodeURIComponent($data._sgood), type:'POST', dataType:'json', timeout:15000})
		.done(function(res){
			if(!res || res.error || res.result !== 200 || !res.box || !isFinite(Number(res.money))){
				$('#purchase-item-desc').text(res && res.error === 423 ? '로그인 후 구매할 수 있습니다.' : '구매하지 못했습니다. 잔액을 확인하고 다시 시도해 주세요.');
				return;
			}
			var my = $data.users[$data.id];
			my.money = Number(res.money); my.box = res.box; $data.box = res.box;
			if(res.equip) my.equip = res.equip;
			send('refresh', {}, true);
			if(rws && rws.readyState === 1) send('refresh');
			updateMe();
			if($stage.dialog.dress.is(':visible')) drawMyDress($data._avGroup);
			delete $data._fontPurchase;
			$stage.dialog.purchase.hide();
			notice(res.owned ? '이미 보유한 아이템입니다. 핑은 추가 차감되지 않습니다. 보관함에서 장착하세요.' : '구매 완료! 보관함에 아이템이 지급되었습니다.');
		}).fail(function(){
			$('#purchase-item-desc').text('구매 결과를 확인하지 못했습니다. 보관함과 잔액을 확인해 주세요.');
		}).always(function(){
			$data._purchasePending = false;
			$stage.dialog.purchaseOK.prop('disabled', false).text('구매');
		});
	});
	$stage.dialog.purchaseNO.on('click', function(e){
		$stage.dialog.purchase.hide();
	});
	$stage.dialog.obtainOK.on('click', function(e){
		var obj = $data._obtain.shift();
		
		if(obj) drawObtain(obj);
		else $stage.dialog.obtain.hide();
	});
	for(i=0; i<5; i++) $("#team-" + i).on('click', onTeam);
	function onTeam(e){
		if($(".team-selector").hasClass("team-unable")) return;
		
		send('team', { value: $(e.currentTarget).attr('id').slice(5) });
	}
// 리플레이
	function initReplayDialog(){
		$stage.dialog.replayView.attr('disabled', true);
	}
	$("#replay-file").on('change', function(e){
		var file = e.target.files[0];
		var reader = new FileReader();
		var $date = $("#replay-date").html("-");
		var $version = $("#replay-version").html("-");
		var $players = $("#replay-players").html("-");
	
		$rec = false;
		$stage.dialog.replayView.attr('disabled', true);
		if(!file) return;
		reader.readAsText(file);
		reader.onload = function(e){
			var i, data;
			
			try{
				data = JSON.parse(e.target.result);
				$date.html((new Date(data.time)).toLocaleString());
				$version.html(data.version);
				$players.empty();
				for(i in data.players){
					var u = data.players[i];
					var $p;
					
					$players.append($p = $("<div>").addClass("replay-player-bar ellipse")
						.html(u.title)
						.prepend(getLevelImage(u.data.score).addClass("users-level"))
					);
					if(u.id == data.me) $p.css('font-weight', "bold");
				}
				$rec = data;
				$stage.dialog.replayView.attr('disabled', false);
			}catch(ex){
				console.warn(ex);
				return alert(L['replayError']);
			}
		};
	});
	$stage.dialog.replayView.on('click', function(e){
		replayReady();
	});
	
// 스팸
	addInterval(function(){
		if(spamCount > 0) spamCount = 0;
		else if(spamWarning > 0) spamWarning -= 0.03;
	}, 1000);

// 웹소켓 연결
	function clearReconnectTimer(){
		if($data._reconnectTimer){
			clearInterval($data._reconnectTimer);
			delete $data._reconnectTimer;
		}
		delete $data._reconnectLeft;
		delete $data._reconnecting;
	}
	function reconnectNow(){
		if($data._reconnecting) return;
		$data._reconnecting = true;
		clearReconnectTimer();
		loading("서버에 다시 연결하는 중입니다...");
		try{
			if(ws) ws.onclose = function(){};
			if(ws) ws.close();
		}catch(ex){}
		connect();
	}
	function showReconnect(e){
		var code = e && e.code ? " (#" + e.code + ")" : "";
		var roomId = $data.room && $data.room.id;
		
		if(roomId && $data.place && $data.room.gaming) $data._reconnectRoomId = roomId;
		clearReconnectTimer();
		$data._reconnectLeft = 15;
		function draw(){
			loading(
				"<div class='reconnect-box'>"
				+ "<h2>서버 연결이 끊어졌어요" + code + "</h2>"
				+ "<p><b>" + $data._reconnectLeft + "초 뒤에 재연결을 시도할게요.</b></p>"
				+ (($data._reconnectRoomId !== undefined) ? "<p>게임 중이던 방으로 다시 들어가도록 시도합니다.</p>" : "")
				+ "<button id='ReconnectNow' type='button'>지금 재연결</button>"
				+ "</div>"
			);
			$("#ReconnectNow").off('click').on('click', reconnectNow);
		}
		draw();
		$data._reconnectTimer = addInterval(function(){
			$data._reconnectLeft--;
			if($data._reconnectLeft <= 0) reconnectNow();
			else draw();
		}, 1000);
	}

	function normalizeGuestName(value){ return String(value || '').trim().replace(/[^0-9A-Za-z가-힣 _-]/g, '').slice(0, 12); }
	function setGuestNameLocked(locked){
		$('body').toggleClass('guest-name-locked', !!locked);
		$('#GuestNameEntry').attr('aria-hidden', locked ? 'false' : 'true');
	}
	window.refreshGuestNameEntry = function(){
		var $entry=$('#GuestNameEntry'), $input=$('#GuestNameInput');
		if(!$entry.length) return;
		if(!$data.guest){ $entry.hide(); setGuestNameLocked(false); return; }
		var saved=normalizeGuestName(sessionStorage.getItem('kkutu-guest-name') || '');
		if(saved) $input.val(saved);
		$entry.show();
		setGuestNameLocked(saved.length < 2);
		if(saved.length < 2) setTimeout(function(){ $input.focus(); }, 100);
	};
	$(document).on('submit', '#GuestNameEntry', function(e){
		e.preventDefault();
		var name=normalizeGuestName($('#GuestNameInput').val());
		if(name.length < 2){ $('#GuestNameHint').text('이름은 2~12자로 입력해 주세요.'); $('#GuestNameInput').focus(); return; }
		try{ sessionStorage.setItem('kkutu-guest-name', name); }catch(ex){}
		$data.guestNamed=true;
		var mine=$data.users && $data.users[$data.id];
		if(mine && mine.profile){ mine.profile.title=name+'(손님)'; mine.profile.name=mine.profile.title; $data.setUser($data.id,mine); if(typeof updateMe==='function')updateMe(); }
		send('guestName',{value:name});
		$('#GuestNameHint').text('이름이 적용되었습니다.');
		setGuestNameLocked(false);
	});

	window.renderDailyQuests = function(data){
		var $overlay = $('#DailyQuestOverlay');
		if(!$overlay.length) return;
		var $body = $overlay.find('.daily-quest-list').empty();
		if(!data || data.guest){
			$body.append($('<div class="daily-quest-login">').text('로그인하면 매일 일일 퀘스트 3개에 도전할 수 있어요.'));
			$overlay.find('.daily-quest-money').text('계정 전용');
			return;
		}
		$overlay.find('.daily-quest-money').text('보유 핑 ' + Number(data.money || 0).toLocaleString() + '개');
		(data.quests || []).forEach(function(quest){
			var progress = Math.min(Number(quest.progress || 0), Number(quest.target || 1));
			var percent = Math.round(progress / Number(quest.target || 1) * 100);
			var $card = $('<article class="daily-quest-card">').toggleClass('is-complete', !!quest.completed);
			$card.append($('<div class="daily-quest-card-head">')
				.append($('<div>').append($('<strong>').text(quest.title)).append($('<p>').text(quest.description)))
				.append($('<span class="daily-quest-reward">').text(quest.completed ? '완료 · +' + quest.reward + '핑' : '보상 ' + quest.reward + '핑')));
			$card.append($('<div class="daily-quest-progress">').append($('<i>').css('width', percent + '%')));
			$card.append($('<small>').text(progress + ' / ' + quest.target));
			$body.append($card);
		});
		if(data.completed && data.completed.length && typeof notice === 'function'){
			var totalReward = data.completed.reduce(function(sum, item){ return sum + Number(item.reward || 0); }, 0);
			notice('일일 퀘스트 완료! ' + totalReward + '핑을 받았습니다.');
		}
	};
	$(document).on('click', '#DailyQuestBtn', function(){
		$('#DailyQuestOverlay').remove();
		var $overlay = $('<section id="DailyQuestOverlay" role="dialog" aria-modal="true" aria-label="일일 퀘스트">');
		var $panel = $('<div class="daily-quest-panel">').appendTo($overlay);
		$('<button type="button" class="daily-quest-close" aria-label="닫기">×</button>').appendTo($panel).on('click', function(){ $overlay.remove(); });
		$panel.append($('<header>').append('<div><h2>일일 퀘스트</h2><p>하루에 3개 · 완료 즉시 퀘스트마다 50~55핑 지급</p></div>').append('<b class="daily-quest-money">불러오는 중…</b>'));
		$panel.append('<div class="daily-quest-list"><div class="daily-quest-login">퀘스트를 불러오는 중입니다.</div></div>');
		$panel.append('<footer>매일 자정에 미완료 진행도를 포함해 새로운 퀘스트로 초기화됩니다.</footer>');
		$overlay.appendTo('body').on('click', function(e){ if(e.target === this) $overlay.remove(); });
		if($data._dailyQuest) window.renderDailyQuests($data._dailyQuest);
		send('dailyQuestGet');
	});
	_setInterval(function(){
		if($('#DailyQuestOverlay').length) send('dailyQuestGet');
	}, 60000);

	function connect(){
		if(ws && (ws.readyState === 0 || ws.readyState === 1)) return;
		$('#intro-text').text('게임 서버에 연결하는 중…');
		var connectUrl = $data.URL;
		if($('#IS_GUEST').text() === 'true'){
			var guestName = (sessionStorage.getItem('kkutu-guest-name') || '').trim().replace(/[^0-9A-Za-z가-힣 _-]/g, '').slice(0, 12);
			// Guests enter a custom name from the lobby UI after connection. A
			// neutral fallback keeps the initial socket handshake prompt-free.
			connectUrl += '?guestName=' + encodeURIComponent(guestName.length >= 2 ? guestName : '손님');
		}
		ws = new _WebSocket(connectUrl);
		ws.onopen = function(e){
			$('#intro-text').text('게임 정보를 불러오는 중…');
			clearReconnectTimer();
			loading();
			/*if($data.PUBLIC && mobile) $("#ad").append($("<ins>").addClass("daum_ddn_area")
				.css({ 'display': "none", 'margin-top': "10px", 'width': "100%" })
				.attr({
					'data-ad-unit': "DAN-1ib8r0w35a0qb",
					'data-ad-media': "4I8",
					'data-ad-pubuser': "3iI",
					'data-ad-type': "A",
					'data-ad-width': "320",
					'data-ad-height': "100"
				})
			).append($("<script>")
				.attr({
					'type': "text/javascript",
					'src': "//t1.daumcdn.net/adfit/static/ad.min.js"
				})
			);*/
		};
		ws.onmessage = _onMessage = function(e){
			onMessage(JSON.parse(e.data));
		};
		ws.onclose = function(e){
			$('#intro-text').text('연결이 끊겼습니다. 다시 연결하는 중…');
			if(rws) rws.close();
			stopAllSounds();
			showReconnect(e);
		};
		ws.onerror = function(e){
			console.warn(L['error'], e);
		};
	}
});

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

$lib.Classic.roundReady = function(data){
	var i, len = $data.room.game.title.length;
	var $l;
	
	// `roundReady` is the authoritative point at which the classic renderer is
	// active.  Reassert the layout marker here so a late room-state update can
	// never leave an actual Classic game on the legacy, upper-left layout.
	$('body').attr('data-game-view', 'for-gaming').addClass('modern-classic');

	clearBoard();
	$data._inputValues = $data._inputValues || {};
	$data._hintPending = false;
	$('#TurnHint').empty();
	$data._roundTime = $data.room.time * 1000;
	$stage.game.display.removeClass('dunggeunmo-font');
	if(MODE[$data.room.mode] === 'KAL') $stage.game.display.text('<전체>');
	else $stage.game.display.html(getCharText(data.char, data.subChar));
	$stage.game.chain.show().html($data.chain = 0);
	if($data.room.opts.mission){
		$stage.game.items.show().css('opacity', 1).html($data.mission = data.mission);
	}
	if(MODE[$data.room.mode] == "KAP"){
		$(".jjoDisplayBar .graph-bar").css({ 'float': "right", 'text-align': "left" });
	}
	drawRound(data.round);
	stopBGM();
	playSound('round_start');
	recordEvent('roundReady', { data: data });
};
$lib.Classic.turnStart = function(data){
	stopBGM();
	playBGM($data.room.ranked ? 'ranked' : 'game');
	$('#DraftStatus').remove();
	var remainingShield = Math.max(0, ($data.room.opts.shield == null ? 15 : $data.room.opts.shield) - ($data.chain || 0));
	if(!$('#ShieldStatus').length) $('.game-head').append($('<div>').attr('id', 'ShieldStatus'));
	$('#ShieldStatus').text($data.room.opts.manner ? '보호막 · 매너 모드 상시' : '보호막 ' + remainingShield + '회 남음');
	$data.room.game.turn = data.turn;
	if(data.seq) $data.room.game.seq = data.seq;
	if(!($data._tid = $data.room.game.seq[data.turn])) return;
	if($data._tid.robot) $data._tid = $data._tid.id;
	data.id = $data._tid;
	if(data.id == $data.id && /(?:\?|&)qaAutoWord=1(?:&|$)/.test(location.search)){
		addTimeout(function(){ send('adminAutoWord'); }, 100);
	}
	
	$stage.game.display.removeClass('dunggeunmo-font');
	if(MODE[$data.room.mode] === 'KAL'){
		$data._char = '<전체>';
		$stage.game.display.text($data._char);
	}else $stage.game.display.html($data._char = getCharText(data.char, data.subChar, data.wordLength));
	$("#game-user-"+data.id).addClass("game-user-current");
	if(!$data._replay){
		if($data._wordInputMode){
			$data._inputValues[$data._wordInputMode] = $stage.game.hereText.val();
			$data._sharedWordInput = $stage.game.hereText.val();
		}
		$data._wordInputMode = data.id == $data.id ? 'answer' : 'hint';
		$data._hintPending = false;
		$('#TurnHint').empty();
		$stage.game.here.show().attr('data-mode', $data._wordInputMode);
		$data._playerHints = [];
		var answerPlaceholder = MODE[$data.room.mode] === 'KAL' ? (ENGLISH_UI ? 'Enter any registered dictionary word' : '전체 사전에 등록된 낱말 입력') : (ENGLISH_UI ? 'Enter a Korean word · Number hint halves the score' : '낱말 입력 · 번호로 힌트 사용 시 점수 50%');
		$stage.game.hereText.prop('readOnly', false).attr('placeholder', data.id == $data.id ? answerPlaceholder : (ENGLISH_UI ? 'Enter a hint for your opponent and press Enter' : '상대에게 알려줄 힌트를 입력하고 Enter'));
		$('#GameWordSubmit').text(data.id == $data.id ? '입력' : '힌트');
		$stage.game.hereText.val($data._sharedWordInput || '').focus();
	}
	$stage.game.items.html($data.mission = data.mission);
	
	ws.onmessage = _onMessage;
	clearInterval($data._tTime);
	clearTrespasses();
	$data._chars = [ data.char, data.subChar ];
	$data._speed = data.speed;
	$data._tTime = addInterval(turnGoing, TICK);
	$data.turnTime = data.turnTime;
	$data._turnTime = data.turnTime;
	$data._roundTime = data.roundTime;
	$data._turnSound = playSound("T"+data.speed);
	recordEvent('turnStart', {
		data: data
	});
};
$lib.Classic.turnGoing = function(){
	if(!$data.room) return clearInterval($data._tTime);
	$data._turnTime = Math.max(0, $data._turnTime - TICK);
	$data._roundTime = Math.max(0, $data._roundTime - TICK);
	
	$stage.game.turnBar
		.width($data._timePercent())
		.html(($data._turnTime*0.001).toFixed(1) + L['SECOND']);
	$stage.game.roundBar
		.width($data._roundTime/$data.room.time*0.1 + "%")
		.html(($data._roundTime*0.001).toFixed(1) + L['SECOND']);
	
	if(!$stage.game.roundBar.hasClass("round-extreme")) if($data._roundTime <= 5000) $stage.game.roundBar.addClass("round-extreme");
};
$lib.Classic.turnEnd = function(id, data){
 var room = $data.room;
 if(!room) return;
	stopBGM();
	var $sc = $("<div>")
		.addClass("deltaScore")
		.html((data.score > 0) ? ("+" + (data.score - data.bonus)) : data.score);
	var $uc = $(".game-user-current");
	var hi;
	
	if($data._turnSound) $data._turnSound.stop();
	addScore(id, data.score);
	clearInterval($data._tTime);
	if(data.ok){
        if(data.hintUsed && data.hintIndex >= 0) $("#TurnHint button").eq(data.hintIndex).addClass("hint-used");
		checkFailCombo();
		clearTimeout($data._fail);
		if(!$data._replay){
			$data._inputValues = $data._inputValues || {};
			if($data._wordInputMode) $data._inputValues[$data._wordInputMode] = $stage.game.hereText.val();
			$data._sharedWordInput = $stage.game.hereText.val();
			$data._wordInputMode = 'prediction';
			$stage.game.here.show().attr('data-mode', 'prediction');
			$stage.game.hereText.prop('readOnly', false).val($data._sharedWordInput || '').attr('placeholder', ENGLISH_UI ? 'Prediction · Write your next Korean word' : '예측 · 다음에 낼 낱말을 미리 적어두세요');
			$('#GameWordSubmit').text('저장');
		}
		$stage.game.chain.html(++$data.chain);
		pushDisplay(data.value, data.mean, data.theme, data.wc, data.font);
	}else{
		$data._wordInputMode = 'waiting';
		if(checkFailCombo(id) || $data.room !== room) return;
		$sc.addClass("lost");
		$(".game-user-current").addClass("game-user-bomb");
		$stage.game.here.hide();
		playSound('timeout');
	}
	if(data.hint){
		data.hint = maskDefinitionProfanity(data.hint._id);
		hi = data.hint.indexOf($data._chars[0]);
		if(hi == -1) hi = data.hint.indexOf($data._chars[1]);
		
		if(MODE[room.mode] == "KAP") $stage.game.display.empty()
			.append($("<label>").css('color', "#AAAAAA").html(data.hint.slice(0, hi)))
			.append($("<label>").html(data.hint.slice(hi)));
		else $stage.game.display.empty()
			.append($("<label>").html(data.hint.slice(0, hi + 1)))
			.append($("<label>").css('color', "#AAAAAA").html(data.hint.slice(hi + 1)));
	}
	if(data.bonus){
		mobile ? $sc.html("+" + (data.score - data.bonus) + "+" + data.bonus) : addTimeout(function(){
			var $bc = $("<div>")
				.addClass("deltaScore bonus")
				.html("+" + data.bonus);
			
			drawObtainedScore($uc, $bc);
		}, 500);
	}
	drawObtainedScore($uc, $sc).removeClass("game-user-current");
	updateScore(id, getScore(id));
};

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

$lib.Jaqwi.roundReady = function(data){
	var tv = L['jqTheme'] + ": " + L['theme_' + data.theme];
	
	clearBoard();
	$data._roundTime = $data.room.time * 1000;
	$data._fastTime = 10000;
	$stage.game.display.html(tv);
	$stage.game.items.hide();
	$stage.game.hints.show();
	$(".jjo-turn-time .graph-bar")
		.width("100%")
		.html(tv)
		.css('text-align', "center");
	drawRound(data.round);
	playSound('round_start');
	clearInterval($data._tTime);
};
$lib.Jaqwi.turnStart = function(data){
	$(".game-user-current").removeClass("game-user-current");
	$(".game-user-bomb").removeClass("game-user-bomb");
	if($data.room.game.seq.indexOf($data.id) >= 0){
		$stage.game.here.show();
		$stage.game.hereText.val('').focus();
	}
	$stage.game.display.html($data._char = data.char);
	clearInterval($data._tTime);
	$data._tTime = addInterval(turnGoing, TICK);
	playBGM('jaqwi');
};
$lib.Jaqwi.turnGoing = function(){
	var $rtb = $stage.game.roundBar;
	var bRate;
	var tt;
	
	if(!$data.room) return clearInterval($data._tTime);
	$data._roundTime = Math.max(0, $data._roundTime - TICK);
	
	tt = $data._spectate ? L['stat_spectate'] : ($data._roundTime*0.001).toFixed(1) + L['SECOND'];
	$rtb
		.width($data._roundTime/$data.room.time*0.1 + "%")
		.html(tt);
		
	if(!$rtb.hasClass("round-extreme")) if($data._roundTime <= $data._fastTime){
		if(!$data.muteBGM) playBGM('jaqwiF');
		$rtb.addClass("round-extreme");
	}
};
$lib.Jaqwi.turnHint = function(data){
	playSound('mission');
	pushHint(data.hint);
};
$lib.Jaqwi.turnEnd = function(id, data){
	var $sc = $("<div>").addClass("deltaScore").html("+" + data.score);
	var $uc = $("#game-user-" + id);

	if(data.giveup){
		$uc.addClass("game-user-bomb");
	}else if(data.answer){
		$stage.game.here.hide();
		$stage.game.display.html($("<label>").css('color', "#FFFF44").html(data.answer));
		stopBGM();
		playSound('horr');
	}else{
		// if(data.mean) turnHint(data);
		if(id == $data.id) $stage.game.here.hide();
		addScore(id, data.score);
		if($data._roundTime > 10000) $data._roundTime = 10000;
		drawObtainedScore($uc, $sc);
		updateScore(id, getScore(id)).addClass("game-user-current");
		playSound('success');
	}
};

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

$lib.Crossword.roundReady = function(data, spec){
	var turn = data.seq ? data.seq.indexOf($data.id) : -1;
	
	clearBoard();
	$(".jjoriping,.rounds,.game-body").addClass("cw");
	$data._roundTime = $data.room.time * 1000;
	$data._fastTime = 30000;
	$data.selectedRound = (turn == -1) ? 1 : (turn % $data.room.round + 1);
	$stage.game.items.hide();
	$stage.game.cwcmd.show().css('opacity', 0);
	drawRound($data.selectedRound);
	if(!spec) playSound('round_start');
	clearInterval($data._tTime);
};
$lib.Crossword.turnEnd = function(id, data){
	var $sc = $("<div>").addClass("deltaScore").html("+" + data.score);
	var $uc = $("#game-user-" + id);
	var $cr;
	var key;
	
	if(data.score){
		key = data.pos.join(',');
		if(id == $data.id){
			$stage.game.cwcmd.css('opacity', 0);
			playSound('success');
		}else{
			if($data._sel) if(data.pos.join(',') == $data._sel.join(',')) $stage.game.cwcmd.css('opacity', 0);
			playSound('mission');
		}
		$data._bdb[key][4] = data.value;
		$data._bdb[key][5] = id;
		if(data.pos[0] == $data.selectedRound - 1) $lib.Crossword.drawDisplay();
		else{
			$cr = $($stage.game.round.children("label").get(data.pos[0])).addClass("round-effect");
			addTimeout(function(){ $cr.removeClass("round-effect"); }, 800);
		}
		addScore(id, data.score);
		updateScore(id, getScore(id));
		drawObtainedScore($uc, $sc);
	}else{
		stopBGM();
		$stage.game.round.empty();
		playSound('horr');
	}
};
$lib.Crossword.drawDisplay = function(){
	var CELL = 100 / 8;
	var board = $data._boards[$data.selectedRound - 1];
	var $pane = $stage.game.display.empty();
	var $bar;
	var i, j, x, y, vert, len, word, key;
	var $w = {};
	
	for(i in board){
		x = Number(board[i][0]);
		y = Number(board[i][1]);
		vert = board[i][2] == "1";
		len = Number(board[i][3]);
		word = board[i][4];
		$pane.append($bar = $("<div>").addClass("cw-bar")
			.attr('id', "cw-" + x + "-" + y + "-" + board[i][2])
			.css({
				top: y * CELL + "%", left: x * CELL + "%",
				width: (vert ? 1 : len) * CELL + "%",
				height: (vert ? len : 1) * CELL + "%"
			})
		);
		if(word) $bar.addClass("cw-open");
		if(board[i][5] == $data.id) $bar.addClass("cw-my-open");
		else $bar.on('click', $lib.Crossword.onBar).on('mouseleave', $lib.Crossword.onSwap);
		for(j=0; j<len; j++){
			key = x + "-" + y;
			
			if(word) $w[key] = word.charAt(j);
			$bar.append($("<div>").addClass("cw-cell")
				.attr('id', "cwc-" + key)
				.html($w[key] || "")
			);
			if(vert) y++; else x++;
		}
	}
};
$lib.Crossword.onSwap = function(e){
	$stage.game.display.prepend($(e.currentTarget));
};
$lib.Crossword.onRound = function(e){
	var round = $(e.currentTarget).html().charCodeAt(0) - 9311;
	
	drawRound($data.selectedRound = round);
	$(".rounds label").on('click', $lib.Crossword.onRound);
	$lib.Crossword.drawDisplay();
};
$lib.Crossword.onBar = function(e){
	var $bar = $(e.currentTarget);
	var pos = $bar.attr('id').slice(3).split('-');
	var data = $data._means[$data.selectedRound - 1][pos.join(',')];
	var vert = data.dir == "1";
	
	$stage.game.cwcmd.css('opacity', 1);
	$data._sel = [ $data.selectedRound - 1, pos[0], pos[1], pos[2] ];
	$(".cw-q-head").html(L[vert ? 'cwVert' : 'cwHorz'] + data.len + L['cwL']);
	$("#cw-q-input").val("").focus();
	$(".cw-q-body").html(processWord("★", data.mean, data.theme, data.type.split(',')));
};
$lib.Crossword.turnStart = function(data, spec){
	var i, j;
	
	$data._bdb = {};
	$data._boards = data.boards;
	$data._means = data.means;
	for(i in data.boards){
		for(j in data.boards[i]){
			$data._bdb[[ i, data.boards[i][j][0], data.boards[i][j][1], data.boards[i][j][2] ].join(',')] = data.boards[i][j];
		}
	}
	$(".rounds label").on('click', $lib.Crossword.onRound);
	$lib.Crossword.drawDisplay();
	clearInterval($data._tTime);
	$data._tTime = addInterval(turnGoing, TICK);
	playBGM('jaqwi');
};
$lib.Crossword.turnGoing = $lib.Jaqwi.turnGoing;
$lib.Crossword.turnHint = function(data){
	playSound('fail');
};

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

﻿$lib.Typing.roundReady = function(data){
	var i, len = $data.room.game.title.length;
	var $l;
	
	$data._chatter = $stage.game.hereText;
	clearBoard();
	$data._round = data.round;
	$data._roundTime = $data.room.time * 1000;
	$data._fastTime = 10000;
	$data._list = data.list.concat(data.list);
	$data.chain = 0;
	drawList();
	drawRound(data.round);
	playSound('round_start');
	recordEvent('roundReady', { data: data });
};
function onSpace(e){
	if(e.keyCode == 32){
		$('#GameWordSubmit').trigger('click');
		e.preventDefault();
	}
}
function drawList(){
	var list = $data._list || [];
	if(!list.length){ $stage.game.display.text('낱말을 불러오는 중…'); return; }
	var index = $data.chain % list.length;
	var wl = list.slice(index).concat(list.slice(0, index));
	var lv = $data.room.opts.proverb ? 1 : 5;
	var pts = "";
	var w0l = wl[0].length;
	
	if(w0l >= 20) pts = "18px";
	if(w0l >= 50) pts = "15px";
	$stage.game.display.css('font-size', pts);
	wl[0] = "<label style='color: #FFFF44;'>" + wl[0] + "</label>";
	$stage.game.display.html(wl.slice(0, lv).join(' '));
	$stage.game.chain.show().html($data.chain);
	$(".jjo-turn-time .graph-bar")
		.width("100%")
		.html(wl.slice(lv, 2 * lv).join(' '))
		.css({ 'text-align': "center", 'background-color': "#70712D" });
}
$lib.Typing.spaceOn = function(){
	if($data.room.opts.proverb) return;
	$data._spaced = true;
	$("body").on('keydown', "#" + $data._chatter.attr('id'), onSpace);
};
$lib.Typing.spaceOff = function(){
	delete $data._spaced;
	$("body").off('keydown', "#" + $data._chatter.attr('id'), onSpace);
};
$lib.Typing.turnStart = function(data){
	if(!$data._spectate){
		$stage.game.here.show();
		$stage.game.hereText.val("").focus();
		$lib.Typing.spaceOn();
	}
	ws.onmessage = _onMessage;
	clearInterval($data._tTime);
	clearTrespasses();
	$data._tTime = addInterval(turnGoing, TICK);
	$data._roundTime = data.roundTime;
	playBGM('jaqwi');
	recordEvent('turnStart', {
		data: data
	});
};
$lib.Typing.turnGoing = $lib.Jaqwi.turnGoing;
$lib.Typing.turnEnd = function(id, data){
	var $sc = $("<div>")
		.addClass("deltaScore")
		.html("+" + data.score);
	var $uc = $("#game-user-" + id);
	
	if(data.error){
		$data.chain++;
		drawList();
		playSound('fail');
	}else if(data.ok){
		if($data.id == id){
			$data.chain++;
			drawList();
			playSound('mission');
			pushHistory(data.value, "");
		}else if($data._spectate){
			playSound('mission');
		}
		addScore(id, data.score);
		drawObtainedScore($uc, $sc);
		updateScore(id, getScore(id));
	}else{
		clearInterval($data._tTime);
		$lib.Typing.spaceOff();
		$stage.game.here.hide();
		stopBGM();
		playSound('horr');
		addTimeout(drawSpeed, 1000, data.speed);
		if($data._round < $data.room.round) restGoing(10);
	}
};
function restGoing(rest){
	$(".jjo-turn-time .graph-bar")
		.html(rest + L['afterRun']);
	if(rest > 0) addTimeout(restGoing, 1000, rest - 1);
}
function drawSpeed(table){
	var i;
	
	for(i in table){
		$("#game-user-" + i + " .game-user-score").empty()
			.append($("<div>").css({ 'float': "none", 'color': "#4444FF", 'text-align': "center" }).html(table[i] + "<label style='font-size: 11px;'>" + L['kpm'] + "</label>"));
	}
}

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

$lib.Hunmin.roundReady = function(data){
	var i, len = $data.room.game.title.length;
	var $l;
	
	clearBoard();
	$data._roundTime = $data.room.time * 1000;
	$stage.game.display.html($data._char = "&lt;" + data.theme + "&gt;");
	$stage.game.chain.show().html($data.chain = 0);
	if($data.room.opts.mission){
		$stage.game.items.show().css('opacity', 1).html($data.mission = data.mission);
	}
	drawRound(data.round);
	playSound('round_start');
	recordEvent('roundReady', { data: data });
};
$lib.Hunmin.turnStart = function(data){
	$data.room.game.turn = data.turn;
	if(data.seq) $data.room.game.seq = data.seq;
	$data._tid = $data.room.game.seq[data.turn];
	if($data._tid.robot) $data._tid = $data._tid.id;
	data.id = $data._tid;
	
	$stage.game.display.html($data._char);
	$("#game-user-"+data.id).addClass("game-user-current");
	if(!$data._replay){
		$stage.game.here.css('display', (data.id == $data.id) ? "block" : "none");
		if(data.id == $data.id){
			$stage.game.hereText.val("").focus();
		}
	}
	$stage.game.items.html($data.mission = data.mission);
	
	ws.onmessage = _onMessage;
	clearInterval($data._tTime);
	clearTrespasses();
	$data._chars = [ data.char, data.subChar ];
	$data._speed = data.speed;
	$data._tTime = addInterval(turnGoing, TICK);
	$data.turnTime = data.turnTime;
	$data._turnTime = data.turnTime;
	$data._roundTime = data.roundTime;
	$data._turnSound = playSound("T"+data.speed);
	recordEvent('turnStart', {
		data: data
	});
};
$lib.Hunmin.turnGoing = $lib.Classic.turnGoing;
$lib.Hunmin.turnEnd = function(id, data){
	var $sc = $("<div>")
		.addClass("deltaScore")
		.html((data.score > 0) ? ("+" + (data.score - data.bonus)) : data.score);
	var $uc = $(".game-user-current");
	var hi;
	
	$data._turnSound.stop();
	addScore(id, data.score);
	clearInterval($data._tTime);
	if(data.ok){
		clearTimeout($data._fail);
		$stage.game.here.hide();
		$stage.game.chain.html(++$data.chain);
		pushDisplay(data.value, data.mean, data.theme, data.wc);
	}else{
		$sc.addClass("lost");
		$(".game-user-current").addClass("game-user-bomb");
		$stage.game.here.hide();
		playSound('timeout');
	}
	if(data.hint){
		data.hint = maskDefinitionProfanity(data.hint._id);
		hi = data.hint.indexOf($data._chars[0]);
		if(hi == -1) hi = data.hint.indexOf($data._chars[1]);
		
		$stage.game.display.empty()
			.append($("<label>").html(data.hint.slice(0, hi + 1)))
			.append($("<label>").css('color', "#AAAAAA").html(data.hint.slice(hi + 1)));
	}
	if(data.bonus){
		mobile ? $sc.html("+" + (b.score - b.bonus) + "+" + b.bonus) : addTimeout(function(){
			var $bc = $("<div>")
				.addClass("deltaScore bonus")
				.html("+" + data.bonus);
			
			drawObtainedScore($uc, $bc);
		}, 500);
	}
	drawObtainedScore($uc, $sc).removeClass("game-user-current");
	updateScore(id, getScore(id));
};

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

$lib.Daneo.roundReady = function(data){
	var i, len = $data.room.game.title.length;
	var $l;
	
	clearBoard();
	$data._roundTime = $data.room.time * 1000;
	$stage.game.display.html($data._char = "&lt;" + (L['theme_' + data.theme]) + "&gt;");
	$stage.game.chain.show().html($data.chain = 0);
	if($data.room.opts.mission){
		$stage.game.items.show().css('opacity', 1).html($data.mission = data.mission);
	}
	drawRound(data.round);
	playSound('round_start');
	recordEvent('roundReady', { data: data });
};
$lib.Daneo.turnStart = function(data){
	$data.room.game.turn = data.turn;
	if(data.seq) $data.room.game.seq = data.seq;
	$data._tid = $data.room.game.seq[data.turn];
	if($data._tid.robot) $data._tid = $data._tid.id;
	data.id = $data._tid;
	
	$stage.game.display.html($data._char);
	$("#game-user-"+data.id).addClass("game-user-current");
	if(!$data._replay){
		$stage.game.here.css('display', (data.id == $data.id) ? "block" : "none");
		if(data.id == $data.id){
			$stage.game.hereText.val("").focus();
		}
	}
	$stage.game.items.html($data.mission = data.mission);
	
	ws.onmessage = _onMessage;
	clearInterval($data._tTime);
	clearTrespasses();
	$data._chars = [ data.char, data.subChar ];
	$data._speed = data.speed;
	$data._tTime = addInterval(turnGoing, TICK);
	$data.turnTime = data.turnTime;
	$data._turnTime = data.turnTime;
	$data._roundTime = data.roundTime;
	$data._turnSound = playSound("T"+data.speed);
	recordEvent('turnStart', {
		data: data
	});
};
$lib.Daneo.turnGoing = $lib.Classic.turnGoing;
$lib.Daneo.turnEnd = function(id, data){
	var $sc = $("<div>")
		.addClass("deltaScore")
		.html((data.score > 0) ? ("+" + (data.score - data.bonus)) : data.score);
	var $uc = $(".game-user-current");
	var hi;
	
	$data._turnSound.stop();
	addScore(id, data.score);
	clearInterval($data._tTime);
	if(data.ok){
		clearTimeout($data._fail);
		$stage.game.here.hide();
		$stage.game.chain.html(++$data.chain);
		pushDisplay(data.value, data.mean, data.theme, data.wc);
	}else{
		$sc.addClass("lost");
		$(".game-user-current").addClass("game-user-bomb");
		$stage.game.here.hide();
		playSound('timeout');
	}
	if(data.hint){
		data.hint = maskDefinitionProfanity(data.hint._id);
		hi = data.hint.indexOf($data._chars[0]);
		if(hi == -1) hi = data.hint.indexOf($data._chars[1]);
		
		$stage.game.display.empty()
			.append($("<label>").html(data.hint.slice(0, hi + 1)))
			.append($("<label>").css('color', "#AAAAAA").html(data.hint.slice(hi + 1)));
	}
	if(data.bonus){
		mobile ? $sc.html("+" + (b.score - b.bonus) + "+" + b.bonus) : addTimeout(function(){
			var $bc = $("<div>")
				.addClass("deltaScore bonus")
				.html("+" + data.bonus);
			
			drawObtainedScore($uc, $bc);
		}, 500);
	}
	drawObtainedScore($uc, $sc).removeClass("game-user-current");
	updateScore(id, getScore(id));
};

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

$lib.Sock.roundReady = function(data, spec){
	var turn = data.seq ? data.seq.indexOf($data.id) : -1;
	
	clearBoard();
	$data._relay = true;
	$(".jjoriping,.rounds,.game-body").addClass("cw");
	$data._va = [];
	$data._lang = RULE[MODE[$data.room.mode]].lang;
	$data._board = data.board;
	$data._maps = [];
	$data._roundTime = $data.room.time * 1000;
	$data._fastTime = 10000;
	$stage.game.items.hide();
	$stage.game.bb.show();
	$lib.Sock.drawDisplay();
	drawRound(data.round);
	if(!spec) playSound('round_start');
	clearInterval($data._tTime);
};
$lib.Sock.turnEnd = function(id, data){
	var $sc = $("<div>").addClass("deltaScore").html("+" + data.score);
	var $uc = $("#game-user-" + id);
	var key;
	var i, j, l;
	
	if(data.score){
		key = data.value;
		l = key.length;
		$data._maps.push(key);
		for(i=0; i<l; i++){
			$data._board = $data._board.replace(key.charAt(i), "　");
		}
		if(id == $data.id){
			playSound('success');
		}else{
			playSound('mission');
		}
		$lib.Sock.drawDisplay();
		addScore(id, data.score);
		updateScore(id, getScore(id));
		drawObtainedScore($uc, $sc);
	}else{
		stopBGM();
		$data._relay = false;
		playSound('horr');
	}
};
$lib.Sock.drawMaps = function(){
	var i;
	
	$stage.game.bb.empty();
	$data._maps.sort(function(a, b){ return b.length - a.length; }).forEach(function(item){
		$stage.game.bb.append($word(item));
	});
	function $word(text){
		var $R = $("<div>").addClass("bb-word");
		var i, len = text.length;
		var $c;
		
		for(i=0; i<len; i++){
			$R.append($c = $("<div>").addClass("bb-char").html(text.charAt(i)));
			// if(text.charAt(i) != "？") $c.css('color', "#EEEEEE");
		}
		return $R;
	}
};
$lib.Sock.drawDisplay = function(){
	var $a = $("<div>").css('height', "100%"), $c;
	var va = $data._board.split("");
	var size = ($data._lang == "ko") ? "12.5%" : "10%";
	
	va.forEach(function(item, index){
		$a.append($c = $("<div>").addClass("sock-char sock-" + item).css({ width: size, height: size }).html(item));
		if($data._va[index] && $data._va[index] != item){
			$c.html($data._va[index]).addClass("sock-picked").animate({ 'opacity': 0 }, 500);
		}
	});
	$data._va = va;
	$stage.game.display.empty().append($a);
	$lib.Sock.drawMaps();
};
$lib.Sock.turnStart = function(data, spec){
	var i, j;
	
	clearInterval($data._tTime);
	$data._tTime = addInterval(turnGoing, TICK);
	playBGM('jaqwi');
};
$lib.Sock.turnGoing = $lib.Jaqwi.turnGoing;
$lib.Sock.turnHint = function(data){
	playSound('fail');
};

var yutPoints={0:[92,92],1:[92,75],2:[92,58],3:[92,42],4:[92,25],5:[92,8],6:[75,8],7:[58,8],8:[42,8],9:[25,8],10:[8,8],11:[8,25],12:[8,42],13:[8,58],14:[8,75],15:[8,92],16:[25,92],17:[42,92],18:[58,92],19:[75,92],21:[75,25],22:[58,42],23:[50,50],24:[42,58],25:[25,75],26:[25,25],27:[42,42],28:[58,58],29:[75,75]};
var yutShownState=null,yutMotion=[];
function yutCopy(state){return state?{positions:{1:(state.positions[1]||[]).slice(),2:(state.positions[2]||[]).slice()},teams:state.teams,goal:state.goal}:null;}
function yutClearMotion(){yutMotion.forEach(clearTimeout);yutMotion=[];}
function ensureYutBoard(){
	var board=$('#YutBoard');if(board.length)return board;
	board=$('<section id="YutBoard"><header><b>'+(ENGLISH_UI?'Yut Nori':'윷놀이')+'</b><span id="YutRoll">'+(ENGLISH_UI?'Complete the Korean word chain to throw the yut.':'끝말잇기에 성공하면 윷을 던집니다.')+'</span></header><div class="yut-track"><svg class="yut-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M8 8H92V92H8Z M8 8L92 92 M92 8L8 92"/></svg><span class="yut-center-mark">●</span></div><div class="yut-score"><span class="team-one">'+(ENGLISH_UI?'Pink Team ':'분홍 팀 ')+'<b>'+(ENGLISH_UI?'0 finished':'0개 도착')+'</b><i class="yut-finished" data-team="1"></i></span><span class="team-two">'+(ENGLISH_UI?'Yellow Team ':'노랑 팀 ')+'<b>'+(ENGLISH_UI?'0 finished':'0개 도착')+'</b><i class="yut-finished" data-team="2"></i></span></div></section>');
	if($data.admin){
		var admin=$('<div class="yut-admin-roll"><button type="button" class="yut-admin-toggle">'+(ENGLISH_UI?'🔒 Secret Yut':'🔒 비밀 윷')+'</button><div class="yut-admin-options"></div><small>'+(ENGLISH_UI?'Next result: Random':'다음 윷 결과: 무작위')+'</small></div>');
		[['빽도','backdo'],['도','do'],['개','gae'],['걸','geol'],['윷','yut'],['모','mo']].forEach(function(item){admin.find('.yut-admin-options').append($('<button type="button">').text(item[0]).attr('data-roll',item[1]).on('click',function(){send('yutForceRoll',{roll:item[1]});}));});
		admin.find('.yut-admin-toggle').on('click',function(){admin.toggleClass('is-open');});board.append(admin);
	}
	Object.keys(yutPoints).forEach(function(step){var point=yutPoints[step],inner=Number(step)>20;board.find('.yut-track').append($('<i>').attr('data-step',step).css({left:point[0]+'%',top:point[1]+'%'}).toggleClass('yut-corner',[0,5,10,15,23].indexOf(Number(step))!==-1).toggleClass('yut-diagonal',inner).append($('<small>').text(Number(step)===0?'출발':(inner?'':step))));});
	$('.game-body').prepend(board);return board;
}
function drawYut(state){
	if(!state||!state.positions)return;
	var board=ensureYutBoard(),positions=state.positions;board.find('.yut-stack').remove();board.find('.yut-finished').empty();
	[1,2].forEach(function(team){var pieces=Array.isArray(positions[team])?positions[team]:[];var groups={};pieces.forEach(function(step){if(step>0&&step!==20)(groups[step]||(groups[step]=[])).push(step);});
		Object.keys(groups).forEach(function(step){var cell=board.find('[data-step="'+step+'"]'),stack=$('<span class="yut-stack team-'+team+'" aria-label="'+(team===1?'분홍':'노랑')+' 말 '+groups[step].length+'개"></span>');groups[step].forEach(function(){stack.append('<em class="yut-token"></em>');});cell.append(stack);});
		var finished=pieces.filter(function(step){return step===20;}).length;board.find('.team-'+(team===1?'one':'two')+' b').text(ENGLISH_UI?finished+' finished':finished+'개 도착');for(var i=0;i<finished;i++)board.find('.yut-finished[data-team="'+team+'"]').append($('<em class="yut-token team-'+team+'"></em>'));
	});yutShownState=yutCopy(state);
}
function animateYut(data){
	var result=data.yut,path=result&&result.path,moved=result&&result.moved,team=result&&Number(result.team);
	if(!path||path.length<2||!moved||!yutShownState){drawYut(result);return;}
	yutClearMotion();var scene=yutCopy(yutShownState);path.slice(1).forEach(function(step,index){yutMotion.push(setTimeout(function(){moved.forEach(function(piece){scene.positions[team][piece]=step;});drawYut(scene);},index*360+120));});
	yutMotion.push(setTimeout(function(){drawYut(result);},(path.length-1)*360+450));
}
$lib.Yut.roundReady=function(data){yutClearMotion();$lib.Classic.roundReady(data);$('body').addClass('yut-mode');drawYut(data.yut);};
$lib.Yut.turnStart=function(data){yutClearMotion();$lib.Classic.turnStart(data);drawYut(data.yut);$('#YutRoll').text(ENGLISH_UI?'Enter a Korean word beginning with 「'+data.char+'」.':'「'+data.char+'」로 시작하는 낱말을 입력하세요.');};
$lib.Yut.turnGoing=$lib.Classic.turnGoing;
$lib.Yut.yutThrow=function(data){
	clearInterval($data._tTime);
	if($data._turnSound)$data._turnSound.stop();
	$stage.game.hereText.prop('readOnly',true);
	$('#YutBoard .yut-admin-roll [data-roll]').removeClass('is-selected');$('#YutBoard .yut-admin-roll small').text(ENGLISH_UI?'Next result: Random':'다음 윷 결과: 무작위');
	var board=ensureYutBoard(),thrower=$('<div class="yut-throw" aria-label="윷 던지는 중"><div class="yut-sticks"><span></span><span></span><span></span><span></span></div><strong>'+data.roll+'!</strong></div>');
	board.find('.yut-throw').remove();board.append(thrower);setTimeout(function(){thrower.addClass('show-result');},850);setTimeout(function(){thrower.remove();},1350);
	$('#YutRoll').text(ENGLISH_UI?(data.team===1?'Pink':'Yellow')+' Team throws the yut!':(data.team===1?'분홍':'노랑')+' 팀이 윷을 던집니다!');
};
$lib.Yut.turnEnd=function(id,data){$lib.Classic.turnEnd(id,data);animateYut(data);if(data.yut)$('#YutRoll').text(ENGLISH_UI?(data.yut.noThrow?'Time out · No yut throw':(data.yut.backDo?'Back-do · Starting piece moves to space 19':(data.yut.roll+' · Move '+data.yut.move+' spaces'))+(data.yut.captured?' · Captured an opponent!':'')+(data.yut.oneShot?' · One-shot word, next turn':(data.yut.extra?' · Throw again!':''))):(data.yut.noThrow?'시간 초과 · 윷을 던지지 못했습니다.':(data.yut.backDo?'빽도 · 출발 말은 19번 칸으로 이동':(data.yut.roll+' · '+data.yut.move+'칸 이동'))+(data.yut.captured?' · 상대 말 잡기!':'')+(data.yut.oneShot?' · 한방 단어, 다음 차례로 이동':(data.yut.extra?' · 한 번 더!':''))));};
$lib.Yut.yutWin=function(data){$('#YutRoll').text(ENGLISH_UI?(data.team===1?'Pink':'Yellow')+' Team wins!':(data.team===1?'분홍':'노랑')+' 팀 승리!');};
$lib.Yut.yutForceRoll=function(data){var box=$('#YutBoard .yut-admin-roll');box.addClass('is-open').find('[data-roll]').removeClass('is-selected').filter('[data-roll="'+data.roll+'"]').addClass('is-selected');box.find('small').text('다음 윷 결과: '+data.name);};
$lib.Yut.yutChoice=function(data){
	$('#YutChoice').remove();var moveText=ENGLISH_UI?(data.move<0?'A starting piece moves to space 19.':'Choose how to move '+data.move+' spaces.'):(data.move<0?'출발 전 말은 19번 칸으로 이동합니다.':data.move+'칸을 어떻게 이동할까요?');var box=$('<div id="YutChoice"><div class="yut-choice-card"><b>'+data.roll+'! '+moveText+'</b><p>'+(ENGLISH_UI?'Choose a piece within 9 seconds.':'9초 안에 이동할 말을 선택하세요.')+'</p><div class="yut-choice-buttons"></div></div></div>');
	var buttons=box.find('.yut-choice-buttons');function option(label,choice){buttons.append($('<button>').text(label).on('click',function(){send('yutMove',{choice:choice});box.remove();}));}
	if(data.canAdd)option(ENGLISH_UI?'＋ Add a new piece':'＋ 새 말 추가','new');var seen={};(data.pieces||[]).forEach(function(piece){if(seen[piece.position])return;seen[piece.position]=true;var group=data.pieces.filter(function(other){return other.position===piece.position;}).length;option(ENGLISH_UI?'Move piece '+(piece.index+1)+(group>1?' (stack of '+group+')':'')+' · space '+piece.position:(piece.index+1)+'번 말'+(group>1?' '+group+'개 묶음':'')+' 이동 · 현재 '+piece.position+'칸',{piece:piece.index,shortcut:false});if(piece.position===5||piece.position===10)option(ENGLISH_UI?'↗ Piece '+(piece.index+1)+' shortcut':'↗ '+(piece.index+1)+'번 말 지름길로 이동',{piece:piece.index,shortcut:true});});
	$('body').append(box);
};

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

var spamWarning = 0;
var spamCount = 0;
// var smile = 94, tag = 35;

function zeroPadding(num, len){ var s = num.toString(); return "000000000000000".slice(0, Math.max(0, len - s.length)) + s; }
function send(type, data, toMaster){
	var i, r = { type: type };
	var subj = toMaster ? ws : (rws || ws);
	
	for(i in data) r[i] = data[i];
	
	/*if($data._talkValue == r.value){
		if(++$data._sameTalk >= 3) return fail();
	}else $data._sameTalk = 0;
	$data._talkValue = r.value;*/
	
	if(type != "test") if(spamCount++ > 10){
		if(++spamWarning >= 3) return subj.close();
		spamCount = 5;
	}
	subj.send(JSON.stringify(r));
}
function loading(text){
	var isGameDataLoading = text === L['gameLoading'];
	var $loading = $stage.loading;

	if(text){
		if($("#Intro").is(':visible')){
			$loading.hide();
			$("#intro-text").html(text);
		}else{
			$loading.toggleClass('game-data-loading', isGameDataLoading).show().html(text);
			if(isGameDataLoading && $stage.game.length){
				var rect = $stage.game[0].getBoundingClientRect();
				$loading.css({
					'position': 'fixed',
					'left': rect.left,
					'top': rect.top,
					'width': rect.width,
					'height': rect.height
				});
			}else $loading.css({ 'position': '', 'left': '', 'top': '', 'width': '', 'height': '' });
		}
	}else $loading.removeClass('game-data-loading').css({ 'position': '', 'left': '', 'top': '', 'width': '', 'height': '' }).hide();
}
function showDialog($d, noToggle){
	var size = [ $(window).width(), $(window).height() ];
	
	if(!noToggle && $d.is(":visible")){
		$d.hide();
		return false;
	}else{
		$(".dialog-front").removeClass("dialog-front");
		$d.appendTo('body').show().addClass("dialog-front").css({
			'left': Math.max(12, (size[0] - $d.outerWidth()) * 0.5),
			'top': Math.max(12, (size[1] - $d.outerHeight()) * 0.5)
		});
		return true;
	}
}
function showProfanityWarning(){
	$('#ProfanityWarning').remove();
	var $box=$('<div id="ProfanityWarning"><section><h2>⚠️ 채팅 이용 경고</h2><p>저희 끄투게임즈코리아는 욕설을 금지하고 있습니다.</p><p class="profanity-rule">현재 경고 1회가 누적되었습니다. 욕설이 한 번 더 감지되면 IP가 차단됩니다.</p><label><input type="checkbox"> <b>이해하였습니다.</b></label><button type="button" disabled>확인</button></section></div>').appendTo('body');
	var $check=$box.find('input'),$button=$box.find('button');
	$check.on('change',function(){ $button.prop('disabled',!this.checked); });
	$button.on('click',function(){
		if(!$check.is(':checked')) return;
		send('profanityAcknowledge',{},true);
		if(rws) send('profanityAcknowledge',{},false);
		$box.remove();
	});
}
function defaultSettingsOptions(){
	return {
		mb: false,
		me: false,
		bv: 100,
		ev: 100,
		lb: 'autumn',
		lm2: true,
		di: false,
		dw: false,
		df: false,
		ar: false,
		su: false,
		ow: false,
		ou: false
	};
}
function normalizeSettingsVolume(value, fallback){
	value = Number(value);
	if(isNaN(value)) value = fallback;
	return Math.max(0, Math.min(100, Math.round(value)));
}
function normalizeSettingsOptions(opt){
	var key, defaults = defaultSettingsOptions(), result = {};
	opt = opt || {};
	for(key in defaults){
		if(key == 'bv' || key == 'ev') result[key] = normalizeSettingsVolume(opt[key], defaults[key]);
		else if(key == 'lb') result[key] = opt[key] == 'autumn' ? 'autumn' : 'default';
		else result[key] = !!opt[key];
	}
	return result;
}
function readSettingsOptions(){
	return {
		mb: $("#mute-bgm").is(":checked"),
		me: $("#mute-effect").is(":checked"),
		bv: normalizeSettingsVolume($("#settings-bgm-volume").val(), 100),
		ev: normalizeSettingsVolume($("#settings-effect-volume").val(), 100),
		lb: $("#settings-lobby-bgm").val() == 'autumn' ? 'autumn' : 'default',
		lm2: true,
		di: $("#deny-invite").is(":checked"),
		dw: $("#deny-whisper").is(":checked"),
		df: $("#deny-friend").is(":checked"),
		ar: $("#auto-ready").is(":checked"),
		su: $("#sort-user").is(":checked"),
		ow: $("#only-waiting").is(":checked"),
		ou: $("#only-unlock").is(":checked")
	};
}
function syncSettingsControls(){
	var opt = normalizeSettingsOptions($data.opts);
	$("#mute-bgm").prop('checked', opt.mb);
	$("#mute-effect").prop('checked', opt.me);
	$("#settings-bgm-volume").val(opt.bv).attr('aria-valuenow', opt.bv);
	$("#settings-effect-volume").val(opt.ev).attr('aria-valuenow', opt.ev);
	$("#settings-lobby-bgm").val(opt.lb);
	$("#settings-bgm-value").text(opt.bv + "%");
	$("#settings-effect-value").text(opt.ev + "%");
	$("#deny-invite").prop('checked', opt.di);
	$("#deny-whisper").prop('checked', opt.dw);
	$("#deny-friend").prop('checked', opt.df);
	$("#auto-ready").prop('checked', opt.ar);
	$("#sort-user").prop('checked', opt.su);
	$("#only-waiting").prop('checked', opt.ow);
	$("#only-unlock").prop('checked', opt.ou);
}
function getSoundVolume(loop){
	var opt = normalizeSettingsOptions($data.opts);
	if((loop && opt.mb) || (!loop && opt.me)) return 0;
	return (loop ? opt.bv : opt.ev) / 100;
}
function setSoundVolume(source, loop){
	var volume;
	if(!source) return;
	volume = getSoundVolume(loop);
	if(source._gainNode && source._gainNode.gain){
		if(audioContext && source._gainNode.gain.setValueAtTime){
			source._gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
		}else source._gainNode.gain.value = volume;
	}
	if(source.audio) source.audio.volume = volume;
	try{ source.volume = volume; }catch(ex){}
}
function refreshSoundVolumes(){
	var key, source;
	for(key in $_sound){
		source = $_sound[key];
		setSoundVolume(source, !!(source && source._loop));
	}
}
function applyOptions(opt){
	var previousLobby = ($data.opts && $data.opts.lb) || 'default';
	$data.opts = normalizeSettingsOptions(opt);
	$data.muteBGM = $data.opts.mb;
	$data.muteEff = $data.opts.me;
	syncSettingsControls();
	refreshSoundVolumes();
	if(previousLobby != $data.opts.lb && $data.bgm && ($data.bgm.key == 'lobby' || $data.bgm.key == 'lobbyAutumn')){
		stopBGM();
		if(!$data.muteBGM) playBGM('lobby');
	}
	
	if(!$data.muteBGM && $data.bgm && $data.bgm.audio && $data.bgm.audio.paused){
		$data.bgm = playBGM($data.bgm.key, true);
	}
}
function checkInput(){
	/*var v = $stage.talk.val();
	var len = v.length;
	
	if($data.room) if($data.room.gaming){
		if(len - $data._kd.length > 3) $stage.talk.val($data._kd);
		if($stage.talk.is(':focus')){
			$data._kd = v;
		}else{
			$stage.talk.val($data._kd);
		}
	}
	$data._kd = v;*/
}
function addInterval(cb, v, a1, a2, a3, a4, a5){
	var R = _setInterval(cb, v, a1, a2, a3, a4, a5);
	
	$data._timers.push(R);
	return R;
}
function addTimeout(cb, v, a1, a2, a3, a4, a5){
	var R = _setTimeout(cb, v, a1, a2, a3, a4, a5);
	
	$data._timers.push(R);
	return R;
}
function clearTrespasses(){ return; // 일단 비활성화
	var jt = [];
	var xStart = $data._xintv || 0;
	var xEnd = _setTimeout(checkInput, 1);
	var rem = 0;
	var i;
	
	for(i in $.timers){
		jt.push($.timers[i].id);
	}
	function censor(id){
		if(jt.indexOf(id) == -1 && $data._timers.indexOf(id) == -1){
			rem++;
			clearInterval(id);
		}
	}
	for(i=0; i<53; i++){
		censor(i);
	}
	for(i=xStart; i<xEnd; i++){
		censor(i);
	}
	$data._xintv = xEnd;
}
function route(func, a0, a1, a2, a3, a4){
	if(!$data.room) return;
	var r = RULE[MODE[$data.room.mode]];
	
	if(!r || !$lib[r.rule] || typeof $lib[r.rule][func] !== 'function') return null;
	return $lib[r.rule][func].call(this, a0, a1, a2, a3, a4);
}
function connectToRoom(chan, rid){
	/* Keep room workers on the public HTTPS origin.  This avoids blocked
	 * alternate ports and lets Caddy route each server to its own worker. */
	var roomPath = Number($data.server) === 2 ? '/room3/' : (Number($data.server) === 1 ? '/room2/' : '/room/');
	var url = $data.URL.replace(/\/game(?:2|3)?\//, roomPath);
	if(url === $data.URL){
		url = $data.URL.replace(/:(\d+)/, function(v, p1){
			return ':' + (Number(p1) + 416 + Number(chan) - 1);
		});
	}
	url += "&" + chan + "&" + rid;
	
	if(rws) return;
	rws = new _WebSocket(url);
 var roomSocket = rws;
	
	loading(L['connectToRoom'] + "\n<center><button id='ctr-close'>" + L['ctrCancel'] + "</button></center>");
	$("#ctr-close").on('click', function(){
		loading();
		if(rws) rws.close();
	});
	rws.onopen = function(e){
		console.log("room-conn", chan, rid);
	};
	rws.onmessage = function(e){
  if(rws !== roomSocket) return;
  var message = JSON.parse(e.data);
  if(/^(roundReady|turnStart|turnEnd|turnHint|turnError|roundEnd|playerHints|draftChecked|yut)/.test(message.type) && (!$data.room || String($data.room.id) !== String(rid))) return;
  onMessage(message);
 };
	rws.onclose = function(e){
		console.log("room-disc", chan, rid);
		if(rws === roomSocket) rws = undefined;
	};
	rws.onerror = function(e){
		console.warn(L['error'], e);
	};
}
function checkAge(){
	if(!confirm(L['checkAgeAsk'])) return send('caj', { answer: "no" }, true);
	
	while(true){
		var input = [], lv = 1;
		
		while(lv <= 3){
			var str = prompt(L['checkAgeInput' + lv]);
			
			if(!str || isNaN(str = Number(str))){
				if(--lv < 1) break; else continue;
			}
			if(lv == 1 && (str < 1000 || str > 2999)){
				alert(str + "\n" + L['checkAgeNo']);
				continue;
			}
			if(lv == 2 && (str < 1 || str > 12)){
				alert(str + "\n" + L['checkAgeNo']);
				continue;
			}
			if(lv == 3 && (str < 1 || str > 31)){
				alert(str + "\n" + L['checkAgeNo']);
				continue;
			}
			input[lv++ - 1] = str;
		}
		if(lv == 4){
			if(confirm(L['checkAgeSure'] + "\n"
			+ input[0] + L['YEAR'] + " "
			+ input[1] + L['MONTH'] + " "
			+ input[2] + L['DATE'])) return send('caj', { answer: "yes", input: [ input[1], input[2], input[0] ] }, true);
		}else{
			if(confirm(L['checkAgeCancel'])) return send('caj', { answer: "no" }, true);
		}
	}
}
function onMessage(data){
	var i;
	var $target;

	switch (data.type) {
		case 'match':
			var rankedMatch = data.ranked === true;
			var $matchOverlay = rankedMatch ? $('#RankMatchOverlay') : $('#MatchOverlay');
			var statusSelector = rankedMatch ? '#RankMatchStatus' : '#MatchStatus';
			if(data.state === 'waiting') $(statusSelector).text('상대방을 기다리는 중 · 1 / 2');
			if(rankedMatch && data.state === 'starting') {
				$(statusSelector).text('상대방을 찾았습니다 · 순위전에 입장합니다');
				$('#RankMatchCancel').hide();
			}
			if(data.state === 'vote') {
				$('#MatchStatus').text('매칭 완료! 낱말집 투표 · ' + data.votes + ' / 2');
				$('#MatchHint').text('30초 안에 선택해 주세요. 동률이면 투표한 후보 중 무작위로 결정합니다.');
				if(!$('#MatchVotes button').length) {
					[['basic','기초'],['standard','표준'],['complex','복합']].forEach(function(item){
						$('<button>').text(item[1]).appendTo('#MatchVotes').on('click', function(){
							$('#MatchVotes button').prop('disabled', true);
							$(this).addClass('selected');
							send('matchVote', {dictionary:item[0]}, true);
						});
					});
				}
			}
			if(!rankedMatch && data.state === 'starting') {
				$('#MatchStatus').text('선택된 낱말집: ' + ({basic:'기초',standard:'표준',complex:'복합'}[data.dictionary]) + ' · 게임에 입장합니다');
				$('#MatchCancel, #MatchVotes').hide();
			}
			if(data.state === 'cancelled') { $matchOverlay.remove(); if(data.message) alert(data.message); }
			break;
        case 'recaptcha':
            var $introText = $("#intro-text");
            $introText.empty();
            $introText.html('게스트는 캡챠 인증이 필요합니다.' +
                '<br/>로그인을 하시면 캡챠 인증을 건너뛰실 수 있습니다.' +
                '<br/><br/>');
            $introText.append($('<div class="g-recaptcha" id="recaptcha" style="display: table; margin: 0 auto;"></div>'));

            grecaptcha.render('recaptcha', {
                'sitekey': data.siteKey,
                'callback': recaptchaCallback
            });
            break;
		case 'welcome':
			$data.id = data.id;
			$data.guest = data.guest;
			if(data.guest){
				var savedGuestName = (sessionStorage.getItem('kkutu-guest-name') || '').trim().replace(/[^0-9A-Za-z가-힣 _-]/g, '').slice(0, 12);
				if(savedGuestName.length >= 2) send('guestName', { value: savedGuestName });
				if(window.refreshGuestNameEntry) window.refreshGuestNameEntry();
			}
			$data.admin = data.admin;
			$data.users = data.users;
			$data.robots = {};
			$data.rooms = data.rooms;
			$data.place = 0;
			$data.friends = data.friends;
			$data._friends = {};
			$data._playTime = data.playTime;
			$data._okg = data.okg;
			$data._gaming = false;
			$data.box = data.box;
			$('body').toggleClass('dunggeunmo-font', !!(data.users && data.users[data.id] && data.users[data.id].equip && data.users[data.id].equip.font_dunggeunmo));
			if(data.test) alert(L['welcomeTestServer']);
			if($data._reconnectRoomId !== undefined){
				addTimeout(function(){
					tryJoin($data._reconnectRoomId);
					delete $data._reconnectRoomId;
				}, 350);
			}else{
				var savedRoomId = getRefreshRoom();
				if(savedRoomId !== undefined && $data.rooms[savedRoomId]){
					addTimeout(function(){ tryJoin(savedRoomId); }, 350);
				}else if(location.hash[1] && !/^(?:ko_KR|en_US|zh_CN|ko_KP)$/.test(location.hash.slice(1))) tryJoin(location.hash.slice(1));
			}
			/* The welcome transition must not be held hostage by a secondary
			 * lobby widget.  Show the playable shell first, then refresh lists. */
			welcome();
			try{
				updateUI(undefined, true);
			}catch(uiError){
				console.error('Lobby UI refresh failed', uiError);
				$('body').attr('data-game-view', 'for-lobby');
				$('.kkutu-menu .for-lobby, #QuickRoomBtn.for-lobby').show();
				try{ updateMe(); }catch(characterError){ console.error('Lobby character refresh failed', characterError); }
			}
			if(data.caj) checkAge();
			updateCommunity();
			break;
		case 'conn':
			$data.setUser(data.user.id, data.user);
			updateUserList();
			break;
		case 'disconn':
			$data.setUser(data.id, null);
			updateUserList();
			break;
		case 'connRoom':
			$('#MatchOverlay, #RankMatchOverlay').remove();
			if($data._preQuick){
				playSound('success');
				$stage.dialog.quick.hide();
				delete $data._preQuick;
			}
			$stage.dialog.quick.hide();
			$data.setUser(data.user.id, data.user);
			$target = $data.usersR[data.user.id] = data.user;
			
			if($target.id == $data.id) loading();
			else notice(($target.profile.title || $target.profile.name) + L['hasJoined']);
			updateUserList();
			break;
		case 'disconnRoom':
			$target = $data.usersR[data.id];
			
			if($target){
				delete $data.usersR[data.id];
				notice(($target.profile.title || $target.profile.name) + L['hasLeft']);
				updateUserList();
			}
			break;
		case 'yell':
			yell(data.value);
			notice(data.value, L['yell']);
			break;
		case 'dying':
			yell(L['dying']);
			notice(L['dying'], L['yell']);
			break;
		case 'tail':
			notice(data.a + "|" + data.rid + "@" + data.id + ": " + ((data.msg instanceof String) ? data.msg : JSON.stringify(data.msg)).replace(/</g, "&lt;").replace(/>/g, "&gt;"), "tail");
			break;
		case 'discordChat':
			// Treat Discord text as plain text, with no profile actions or HTML links.
			stackChat();
			if(window.markChatUnread) markChatUnread('main');
			$("#Chat,#chat-log-board").append($("<div>").addClass("chat-item").attr("data-chat-scope", "main")
				.append($("<div>").addClass("chat-body").text('디스코드:' + data.name + ':' + data.value))
				.append($("<div>").addClass("chat-stamp").text(new Date(data.timestamp || Date.now()).toLocaleTimeString())));
			$stage.chat.scrollTop(999999999);
			break;
		case 'chat':
			if(data.notice){
				notice(L['error_' + data.code]);
			}else{
				chat(data.profile || { title: '끄투 봇' }, data.value, data.from, data.timestamp, data.scope, data.reportId, data.authorId);
			}
			break;
		case 'chatReportResult':
			notice(data.message || (data.ok ? '신고가 접수되었습니다.' : '신고하지 못했습니다.'));
			break;
		case 'profanityWarning':
			showProfanityWarning();
			break;
		case 'profanityBanned':
			alert('욕설 경고가 2회 누적되어 IP 차단되었습니다. 운영자에게 문의해 주세요.');
			location.replace('/');
			break;
		case 'roomStuck':
			rws.close();
			break;
		case 'preRoom':
			connectToRoom(data.channel, data.id);
			break;
		case 'room':
			processRoom(data);
			checkRoom(data.modify && data.myRoom);
			updateUI(data.myRoom);
			if(data.modify && $data.room && data.myRoom){
				if($data._rTitle != $data.room.title) animModified('.room-head-title');
				if($data._rMode != getOptions($data.room.mode, $data.room.opts, true)) animModified('.room-head-mode');
				if($data._rLimit != $data.room.limit) animModified('.room-head-limit');
				if($data._rRound != $data.room.round) animModified('.room-head-round');
				if($data._rTime != $data.room.time) animModified('.room-head-time');
			}
			break;
		case 'user':
			$data.setUser(data.id, data);
			if(data.id === $data.id) updateMe();
			if($data.room) updateUI($data.room.id == data.place);
			break;
		case 'friends':
			$data._friends = {};
			for(i in data.list){
				data.list[i].forEach(function(v){
					$data._friends[v] = { server: i };
				});
			}
			updateCommunity();
			break;
		case 'friend':
			$data._friends[data.id] = { server: (data.stat == "on") ? data.s : false };
			if($data._friends[data.id] && $data.friends[data.id])
				notice(((data.stat == "on") ? ("&lt;<b>" + L['server_' + $data._friends[data.id].server] + "</b>&gt; ") : "")
				+ L['friend'] + " " + $data.friends[data.id] + L['fstat_' + data.stat]);
			updateCommunity();
			break;
		case 'friendAdd':
            showSocialRequest('friend', data);
            break;
		case 'friendAddRes':
			$target = $data.users[data.target].profile;
			i = ($target.title || $target.name) + "(#" + data.target.substr(0, 5) + ")";
			notice(i + L['friendAddRes_' + (data.res ? 'ok' : 'no')]);
			if(data.res){
				$data.friends[data.target] = $target.title || $target.name;
				$data._friends[data.target] = { server: $data.server };
				updateCommunity();
			}
			break;
		case 'friendEdit':
			$data.friends = data.friends;
			updateCommunity();
			break;
		case 'starting':
			stopBGM();
			$('#MatchOverlay, #RankMatchOverlay').remove();
			if($data.room && $data.room.ranked && window.kkutuRankStart) window.kkutuRankStart();
			loading(L['gameLoading']);
			break;
		case 'roundReady':
			route("roundReady", data);
			break;
		case 'turnStart':
			route("turnStart", data);
			break;
		case 'draftChecked':
			if(data.kind === 'prediction' && $data._wordInputMode === 'prediction' && $stage.game.hereText.val().trim() === data.value) $data._prediction = data.valid ? data.value : '';
			$('#DraftStatus').remove();
			$stage.game.here.append($('<div>').attr('id', 'DraftStatus').text(data.valid ? '낱말집 확인 완료' : '선택한 낱말집에 없는 단어입니다.'));
			break;
		case 'playerHints':
			$data._playerHints = data.hints || [];
			$('#TurnHint').empty();
			$data._playerHints.forEach(function(hint, index){
				$('<button type="button">').text((index + 1) + '. ' + hint).appendTo('#TurnHint').on('click', function(){ usePlayerHint(index); });
			});
			break;
		case 'turnError':
			turnError(data.code, data.value);
			break;
		case 'turnHint':
			route("turnHint", data);
			break;
		case 'turnEnd':
			data.score = Number(data.score);
			data.bonus = Number(data.bonus);
			if($data.room){
				$data._tid = data.target || $data.room.game.seq[$data.room.game.turn];
				if($data._tid){
					if($data._tid.robot) $data._tid = $data._tid.id;
					turnEnd($data._tid, data);
				}
				if(data.baby){
					playSound('success');
				}
			}
			break;
		case 'dailyQuest':
			$data._dailyQuest = data;
			if(window.renderDailyQuests) window.renderDailyQuests(data);
			break;
		case 'adminAutoWord':
			if(data.ok && data.word) notice('테스트 자동 입력: ' + data.word);
			else if(data.message) notice(data.message);
			break;
		case 'yutWin':
			route("yutWin", data);
			break;
		case 'yutChoice':
			route("yutChoice", data);
			break;
		case 'yutThrow':
			route("yutThrow", data);
			break;
		case 'yutForceRoll':
			route("yutForceRoll", data);
			break;
		case 'roundEnd':
			for(i in data.users){
				$data.setUser(i, data.users[i]);
			}
			/*if($data.guest){
				$stage.menu.exit.trigger('click');
				alert(L['guestExit']);
			}*/
			$data._resultRank = data.ranks;
			if($data.room && $data.room.ranked && !$data._rankResultRecorded && window.kkutuRankRecordResult){
				$data._rankResultRecorded = true;
				window.kkutuRankRecordResult(data.result);
			}
			roundEnd(data.result, data.data);
			break;
		case 'rankedRoomClosed':
			// Ranked rooms are removed from the public list as soon as a match
			// finishes. Players who are still viewing the result keep their room
			// state until they leave, so the result screen is not interrupted.
			if($data.rooms) $data.setRoom(data.id, null);
			break;
		case 'kickVote':
			$data._kickTarget = $data.users[data.target];
			if($data.id != data.target && $data.id != $data.room.master){
				kickVoting(data.target);
			}
			notice(($data._kickTarget.profile.title || $data._kickTarget.profile.name) + L['kickVoting']);
			break;
		case 'kickDeny':
			notice(getKickText($data._kickTarget.profile, data));
			break;
		case 'invited':
            showSocialRequest('room', data);
            break;
		case 'inviteNo':
			$target = $data.users[data.target];
			notice(($target.profile.title || $target.profile.name) + L['inviteDenied']);
			break;
		case 'okg':
			if($data._playTime > data.time){
				notice(L['okgExpired']);
			}else if($data._okg != data.count) notice(L['okgNotice'] + " (" + L['okgCurrent'] + data.count +")");
			$data._playTime = data.time;
			$data._okg = data.count;
			break;
		case 'obtain':
			queueObtain(data);
			// notice(L['obtained'] + ": " + iName(data.key) + " x" + data.q);
			break;
		case 'expired':
			for(i in data.list){
				notice(iName(data.list[i]) + L['hasExpired']);
			}
			break;
		case 'blocked':
			notice(L['blocked']);
			break;
		case 'test':
			if($data._test = !$data._test){
				$data._testt = addInterval(function(){
					if($stage.talk.val() != $data._ttv){
						send('test', { ev: "c", v: $stage.talk.val() }, true);
						$data._ttv = $stage.talk.val();
					}
				}, 100);
				document.onkeydown = function(e){
					send('test', { ev: "d", c: e.keyCode }, true);
				};
				document.onkeyup = function(e){
					send('test', { ev: "u", c: e.keyCode }, true);
				};
			}else{
				clearInterval($data._testt);
				document.onkeydown = undefined;
				document.onkeyup = undefined;
			}
			break;
		case 'guestNameRequired':
			if(window.refreshGuestNameEntry) window.refreshGuestNameEntry();
			$('body').addClass('guest-name-locked');
			$('#GuestNameHint').text('게임을 시작하려면 손님 이름을 먼저 입력해 주세요.');
			break;
		case 'error':
			loading();
			i = data.message || "";
			if(data.code == 448){
				try{ sessionStorage.setItem('kkutu-sprout-redirect', '해당 서버는 5레벨 이상과 손님은 들어갈 수 없어요.'); }catch(_){ }
				location.replace('/?server=0');
				return;
			}
			if(data.code == 401){
				/* 로그인
				$.cookie('preprev', location.href);
				location.href = "/login?desc=login_kkutu"; */
			}else if(data.code == 403){
				loading();
			}else if(data.code == 406){
				if($stage.dialog.quick.is(':visible')){
					$data._preQuick = false;
					break;
				}
			}else if(data.code == 409){
				i = L['server_' + i];
			}else if(data.code == 416){
				// 게임 중
				if(confirm(L['error_'+data.code])){
					stopBGM();
					$data._spectate = true;
					$data._gaming = true;
					send('enter', { id: data.target, password: $data._pw, spectate: true }, true);
				}
				return;
			}else if(data.code == 413){
				$stage.dialog.room.hide();
				$stage.menu.setRoom.trigger('click');
			}else if(data.code == 429){
				playBGM('lobby');
			}else if(data.code == 430){
				$data.setRoom(data.message, null);
				if($stage.dialog.quick.is(':visible')){
					$data._preQuick = false;
					break;
				}
			}else if(data.code == 431 || data.code == 432 || data.code == 433){
				$stage.dialog.room.show();
			}else if(data.code == 444){
				i = data.message;
				if(i.indexOf("생년월일") != -1){
					alert("생년월일이 올바르게 입력되지 않아 게임 이용이 제한되었습니다. 잠시 후 다시 시도해 주세요.");
					return location.replace('/');
				}
			/* Enhanced User Block System [S] */
				if(!data.blockedUntil){ alert("[#444] " + L['error_444'] + i); return location.replace('/'); }
				
				var blockedUntil = new Date(parseInt(data.blockedUntil));
				var block = "\n제한 시점: " + blockedUntil.getFullYear() + "년 " + blockedUntil.getMonth() + 1 + "월 " +
				blockedUntil.getDate() + "일 " + blockedUntil.getHours() + "시 " + blockedUntil.getMinutes() + "분까지";
				
				alert("[#444] " + L['error_444'] + i + block);
				return location.replace('/');
			}else if(data.code == 446){
				i = data.reasonBlocked;
				if(!data.ipBlockedUntil){ alert("[#446] " + L['error_446'] + i); return location.replace('/'); }
				
				var blockedUntil = new Date(parseInt(data.ipBlockedUntil));
				var block = "\n제한 시점: " + blockedUntil.getFullYear() + "년 " + blockedUntil.getMonth() + 1 + "월 " +
				blockedUntil.getDate() + "일 " + blockedUntil.getHours() + "시 " + blockedUntil.getMinutes() + "분까지";
				
				alert("[#446] " + L['error_446'] + i + block);
				return location.replace('/');
			/* Enhanced User Block System [E] */
			} else if (data.code === 447) {
				alert("자동화 봇 방지를 위한 캡챠 인증에 실패했습니다. 메인 화면에서 다시 시도해 주세요.");
				break;
			}
			alert("[#" + data.code + "] " + L['error_'+data.code] + i);
			break;
		default:
			break;
	}
	if($data._record) recordEvent(data);

    function recaptchaCallback(response) {
        ws.send(JSON.stringify({type: 'recaptcha', token: response}));
    }
}
function welcome(){
	playBGM('lobby');
	try{
		var sproutNotice = sessionStorage.getItem('kkutu-sprout-redirect');
		if(sproutNotice){
			sessionStorage.removeItem('kkutu-sprout-redirect');
			$stage.yell.stop(true, true).text(sproutNotice).show();
			setTimeout(function(){ $stage.yell.fadeOut(250); }, 5000);
		}
	}catch(_){ }
	/* Keep the full-screen intro during its intended animation, then remove it
	 * using timers rather than a jQuery queue.  Some embedded/mobile browsers
	 * can leave that queue paused, which would otherwise block the entire lobby. */
	var $intro = $("#Intro").stop(true, true).css({ 'opacity': 1, 'pointer-events': 'auto' });
	window.setTimeout(function(){
		$intro.css({ 'opacity': 0, 'transition': 'opacity 500ms ease' });
		_setTimeout(function(){
			$intro.hide().css({ 'pointer-events': 'none', 'transition': '' });
		}, 500);
	}, 4500);
	$("#intro-text").text(L['welcome']);
	
	if($data.admin) console.log("관리자 모드");
}
function getKickText(profile, vote){
	var vv = L['agree'] + " " + vote.Y + ", " + L['disagree'] + " " + vote.N + L['kickCon'];
	if(vote.Y >= vote.N){
		vv += (profile.title || profile.name) + L['kicked'];
	}else{
		vv += (profile.title || profile.name) + L['kickDenied'];
	}
	return vv;
}
function runCommand(cmd){
	var i, c, CMD = {
		'/ㄱ': L['cmd_r'],
		'/청소': L['cmd_cls'],
		'/ㄹ': L['cmd_f'],
		'/ㄷ': L['cmd_e'],
		'/ㄷㄷ': L['cmd_ee'],
		'/무시': L['cmd_wb'],
		'/차단': L['cmd_shut'],
		'/id': L['cmd_id']
	};
	
	switch(cmd[0].toLowerCase()){
		case "/ㄱ":
		case "/r":
			if($data.room){
				if($data.room.master == $data.id) $stage.menu.start.trigger('click');
				else $stage.menu.ready.trigger('click');
			}
			break;
		case "/청소":
		case "/cls":
			clearChat();
			break;
		case "/ㄹ":
		case "/f":
			showDialog($stage.dialog.chatLog);
			$stage.chatLog.scrollTop(999999999);
			break;
		case "/귓":
		case "/ㄷ":
		case "/e":
			sendWhisper(cmd[1], cmd.slice(2).join(' '));
			break;
		case "/답":
		case "/ㄷㄷ":
		case "/ee":
			if($data._recentFrom){
				sendWhisper($data._recentFrom, cmd.slice(1).join(' '));
			}else{
				notice(L['error_425']);
			}
			break;
		case "/무시":
		case "/wb":
			toggleWhisperBlock(cmd[1]);
			break;
		case "/차단":
		case "/shut":
			toggleShutBlock(cmd.slice(1).join(' '));
			break;
		case "/id":
			if(cmd[1]){
				c = 0;
				cmd[1] = cmd.slice(1).join(' ');
				for(i in $data.users){
					if(($data.users[i].profile.title || $data.users[i].profile.name) == cmd[1]){
						notice("[" + (++c) + "] " + i);
					}
				}
				if(!c) notice(L['error_405']);
			}else{
				notice(L['myId'] + $data.id);
			}
			break;
		default:
			for(i in CMD) notice(CMD[i], i);
			break;
	}
}
function sendWhisper(target, text){
	if(text.length){
		$data._whisper = target;
		send('talk', { whisper: target, value: text }, true);
		chat({ title: "→" + target }, text, true);
	}
}
function toggleWhisperBlock(target){
	if($data._wblock.hasOwnProperty(target)){
		delete $data._wblock[target];
		notice(target + L['wnblocked']);
	}else{
		$data._wblock[target] = true;
		notice(target + L['wblocked']);
	}
}
function toggleShutBlock(target){
	if($data._shut.hasOwnProperty(target)){
		delete $data._shut[target];
		notice(target + L['userNShut']);
	}else{
		$data._shut[target] = true;
		notice(target + L['userShut']);
	}
}
function tryDict(text, callback){
 var word = String(text || '').trim();
 if(word.normalize) word = word.normalize('NFC');
 var lang = /[ㄱ-ㅎ가-힣]/.test(word) ? 'ko' : 'en';
 if(lang == 'en') word = word.toLowerCase();
 if(!word) return callback({ error: 400, message: '검색할 단어를 입력해 주세요.' });
 $.ajax({ url: '/dict/' + encodeURIComponent(word), data: { lang: lang }, dataType: 'json', timeout: 10000 })
 .done(function(res){ callback(res || { error: 500 }); })
 .fail(function(xhr, status){ callback({ error: xhr.status || 503, message: status == 'timeout' ? '검색 시간이 초과되었습니다. 다시 시도해 주세요.' : '사전 서버에 연결하지 못했습니다. 다시 검색해 주세요.' }); });
}
function processRoom(data){
	var i, j, key, o;
	
	data.myRoom = ($data.place == data.room.id) || (data.target == $data.id);
	if(data.myRoom){
		$target = $data.users[data.target];
		if(data.kickVote){
			notice(getKickText($target.profile, data.kickVote));
			if($target.id == data.id) alert(L['hasKicked']);
		}
		if(data.room.players.indexOf($data.id) == -1){
			clearRefreshRoom();
			if($data.room) if($data.room.gaming){
				stopAllSounds();
				$data.practicing = false;
				$data._gaming = false;
				$stage.box.room.height(360);
				// updateUI starts lobby music after the old room state is cleared.
			}
			$data.users[$data.id].game.ready = false;
			$data.users[$data.id].game.team = 0;
			$data.users[$data.id].game.form = "J";
			$stage.menu.spectate.removeClass("toggled");
			$stage.menu.ready.removeClass("toggled");
			$data.room = null;
			$data.resulting = false;
			$data._players = null;
			$data._master = null;
			$data.place = 0;
			if(data.room.practice){
				delete $data.users[0];
				$data.room = $data._room;
				$data.place = $data._place;
				$data.master = $data.__master;
				$data._players = $data.__players;
				delete $data._room;
			}
		}else{
			if(data.room.practice && !$data.practicing){
				$data.practicing = true;
				$data._room = $data.room;
				$data._place = $data.place;
				$data.__master = $data.master;
				$data.__players = $data._players;
			}
			if($data.room){
				$data._players = $data.room.players.toString();
				$data._master = $data.room.master;
				$data._rTitle = $data.room.title;
				$data._rMode = getOptions($data.room.mode, $data.room.opts, true);
				$data._rLimit = $data.room.limit;
				$data._rRound = $data.room.round;
				$data._rTime = $data.room.time;
			}
			$data.room = data.room;
			$data.place = $data.room.id;
			if($data.room.gaming && $data.room.game && $data.room.game.seq){
				$data._spectate = $data.room.game.seq.indexOf($data.id) == -1;
				$('body').toggleClass('spectating', $data._spectate);
				$('.game-input').toggle(!$data._spectate);
			}
			$data.master = $data.room.master == $data.id;
			if(data.spec && data.target == $data.id){
				if(!$data._spectate){
					$data._spectate = true;
					clearBoard();
					drawRound();
				}
				if(data.boards){
					// 십자말풀이 처리
					$data.selectedRound = 1;
					for(i in data.prisoners){
						key = i.split(',');
						for(j in data.boards[key[0]]){
							o = data.boards[key[0]][j];
							if(o[0] == key[1] && o[1] == key[2] && o[2] == key[3]){
								o[4] = data.prisoners[i];
								break;
							}
						}
					}
					$lib.Crossword.roundReady(data, true);
					$lib.Crossword.turnStart(data, true);
				}
				for(i in data.spec){
					$data.users[i].game.score = data.spec[i];
				}
			}
		}
		if(!data.modify && data.target == $data.id) forkChat();
	}
	if(data.target){
		if($data.users[data.target]){
			if(data.room.players.indexOf(data.target) == -1){
				$data.users[data.target].place = 0;
			}else{
				$data.users[data.target].place = data.room.id;
			}
		}
	}
	if(!data.room.practice){
		if(data.room.players.length){
			$data.setRoom(data.room.id, data.room);
			for(i in data.room.readies){
				if(!$data.users[i]) continue;
				$data.users[i].game.form = data.room.readies[i].f;
				$data.users[i].game.ready = data.room.readies[i].r;
				$data.users[i].game.team = data.room.readies[i].t;
			}
		}else{
			$data.setRoom(data.room.id, null);
		}
	}
}
function getOnly(){
	return $data.place ? (($data.room.gaming || $data.resulting) ? "for-gaming" : ($data.master ? "for-master" : "for-normal")) : "for-lobby";
}
function updateUI(myRoom, refresh){
/*
	myRoom이 undefined인 경우: 상점/결과 확인
	myRoom이 true/false인 경우: 그 외
*/
	var only = getOnly();
	var i;
	
	if($data._replay){
		if(myRoom === undefined || myRoom){
			replayStop();
		}else return;
	}
	if($data._replay) return;
	if(only == "for-gaming" && !myRoom && !$data._spectate) return;
	if($data.practicing) only = "for-gaming";
	
	$(".kkutu-menu button, #QuickRoomBtn, .detached-menu").hide();
	for(i in $stage.box) $stage.box[i].hide();
	if($stage.lobby.hero) $stage.lobby.hero.hide();
	$stage.box.me.show();
	$stage.box.chat.show().width(790).height(190);
	$stage.chat.height(120);
	
	if(only == "for-lobby"){
		$data._ar_first = true;
		if($stage.lobby.hero) $stage.lobby.hero.show();
		$stage.box.userList.show();
		if($data._shop){
			$stage.box.roomList.hide();
			$stage.box.shop.show();
		}else{
			$stage.box.roomList.toggle(!!$data._roomListOpen);
			$stage.box.shop.hide();
		}
		updateUserList(refresh || only != $data._only);
		updateRoomList(refresh || only != $data._only);
		updateMe();
		if($data._jamsu){
			clearTimeout($data._jamsu);
			delete $data._jamsu;
		}
		if(!$data.muteBGM && (!$data.bgm || ($data.bgm.audio && $data.bgm.audio.paused))) playBGM('lobby');
	}else if(only == "for-master" || only == "for-normal"){
		$(".team-chosen").removeClass("team-chosen");
		if($data.users[$data.id].game.ready || $data.users[$data.id].game.form == "S"){
			$stage.menu.ready.addClass("toggled");
			$(".team-selector").addClass("team-unable");
		}else{
			$stage.menu.ready.removeClass("toggled");
			$(".team-selector").removeClass("team-unable");
			$("#team-" + $data.users[$data.id].game.team).addClass("team-chosen");
			if($data.opts.ar && $data._ar_first){
				$stage.menu.ready.addClass("toggled");
				$stage.menu.ready.trigger('click');
				$data._ar_first = false;
			}
		}
		$data._shop = false;
		$stage.box.room.show().height(360);
		if(only == "for-master") if($stage.dialog.inviteList.is(':visible')) updateUserList();
		updateRoom(false);
		updateMe();
	}else if(only == "for-gaming"){
		if($data._gAnim){
			$stage.box.room.show();
			$data._gAnim = false;
		}
		$data._shop = false;
		$data._ar_first = true;
		$stage.box.me.hide();
		$stage.box.game.show();
		$(".ChatBox").width(1000).height(140);
		$stage.chat.height(70);
		updateRoom(true);
	}
	$data._only = only;
	$('body').attr('data-game-view', only);
 if(window.syncChatGeometry) window.syncChatGeometry();
	if(only !== 'for-gaming' && !$data.muteBGM) playBGM('lobby');
	$('body').toggleClass('modern-classic', only === 'for-gaming' && $data.room && String(RULE[MODE[$data.room.mode]].rule).toLowerCase() === 'classic');
	$('body').toggleClass('ranked-match', only === 'for-gaming' && $data.room && $data.room.ranked === true);
	$('body').toggleClass('waiting-room', only === 'for-master' || only === 'for-normal');
	syncGameStageScale();
	if(only !== 'for-gaming') $data._wordInputMode = null;

	$('#RoomSpectateAction').toggle(only === 'for-master' || only === 'for-normal');
	$('#RoomSettingsAction').toggle(only === 'for-master');
	$('#RoomInviteAction, #RoomBotAction').toggle(only === 'for-master');
	$('#RoomStartAction').toggle(only === 'for-master');
	$('#RoomReadyAction').toggle(only === 'for-normal');
	setLocation($data.place);
 if(window.syncChatTabs) syncChatTabs();
 if(window.syncLobbySocialDock) syncLobbySocialDock();
 if(only === 'for-lobby' && $data.pendingInvite){var invite=$data.pendingInvite;delete $data.pendingInvite;send('inviteRes',{from:invite,res:true},true);}
	$(".kkutu-menu ."+only).show();
	$('#QuickRoomBtn.'+only+', .detached-menu.'+only).show();
	$('#GameExitControl').toggle(only === 'for-gaming');
}
function syncGameStageScale(){
	var width, height, scale;
	if(!$('body').hasClass('modern-classic') || $('body').attr('data-game-view') != 'for-gaming' || window.innerWidth <= 800){
		document.documentElement.style.removeProperty('--kkutu-stage-scale');
		return;
	}
	width = Math.max(1, window.innerWidth - 64);
	height = Math.max(1, window.innerHeight - 92);
	scale = Math.min(1.45, Math.max(.64, Math.min(width / 1180, height / 650)));
	document.documentElement.style.setProperty('--kkutu-stage-scale', scale.toFixed(3));
}
$(window).on('resize.gameStageScale orientationchange.gameStageScale', function(){
	clearTimeout($data._gameStageScaleTimer);
	$data._gameStageScaleTimer = setTimeout(syncGameStageScale, 50);
});
function animModified(cls){
	$(cls).addClass("room-head-modified");
	addTimeout(function(){ $(cls).removeClass("room-head-modified"); }, 3000);
}
function checkRoom(modify){
	if(!$data._players) return;
	if(!$data.room) return;
	
	var OBJ = {} + '';
	var i, arr = $data._players.split(',');
	var lb = arr.length, la = $data.room.players.length;
	var u;
	
	for(i in arr){
		if(arr[i] == OBJ) lb--;
	}
	for(i in $data.room.players){
		if($data.room.players[i].robot) la--;
	}
	if(modify){
		for(i in arr){
			if(arr[i] != OBJ) $data.users[arr[i]].game.ready = false;
		}
		notice(L['hasModified']);
	}
	if($data._gaming != $data.room.gaming){
		if($data.room.gaming){
			gameReady();
			$data._replay = false;
			startRecord($data.room.game.title);
		}else{
			if($data._spectate){
				$stage.dialog.resultSave.hide();
				$data._spectate = false;
				playBGM('lobby');
			}else{
				$stage.dialog.resultSave.show();
				$data.resulting = true;
			}
			clearInterval($data._tTime);
		}
	}
	if($data._master != $data.room.master){
		u = $data.users[$data.room.master];
		notice((u.profile.title || u.profile.name) + L['hasMaster']);
	}
	$data._players = $data.room.players.toString();
	$data._master = $data.room.master;
	$data._gaming = $data.room.gaming;
	if($data.room.gaming) saveRefreshRoom($data.room.id);
	else clearRefreshRoom();
}
function updateMe(){
	var my = $data.users && $data.users[$data.id];
	if(!my) return;
	var i, gw = 0;
	var score = Number(my.data && my.data.score) || 0;
	var record = (my.data && my.data.record) || {};
	var equip = my.equip || {};
	var profile = my.profile || {};
	var lv = getLevel(score);
	var prev = EXP[lv-2] || 0;
	var goal = EXP[lv-1];
	
	for(i in record) gw += (record[i] && record[i][1]) || 0;
	renderMoremi(".my-image", equip);
	renderMoremi("#LobbyHeroImage", equip);
	// $(".my-image").css('background-image', "url('"+my.profile.image+"')");
	$(".my-stat-level").replaceWith(getLevelImage(score).addClass("my-stat-level"));
	$(".my-stat-name").text(profile.title || profile.name || '손님');
	$("#LobbyHeroName").text(profile.title || profile.name || '손님');
	addDeveloperBadge($(".my-stat-name, #LobbyHeroName"), profile);
	$(".my-stat-record").html(L['globalWin'] + " " + gw + L['W']);
	$(".my-stat-ping").html(commify(my.money) + L['ping']);
	$(".my-okg .graph-bar").width(($data._playTime % 600000) / 6000 + "%");
	$(".my-okg-text").html(prettyTime($data._playTime));
	$(".my-level").html(lv + '레벨');
	$(".my-gauge .graph-bar").width((score-prev)/(goal-prev)*190);
	$(".my-gauge-text").html(commify(score) + " / " + commify(goal));
	if(window.refreshTutorialEntry) window.refreshTutorialEntry();
}
function prettyTime(time){
	var min = Math.floor(time / 60000) % 60, sec = Math.floor(time * 0.001) % 60;
	var hour = Math.floor(time / 3600000);
	var txt = [];
	
	if(hour) txt.push(hour + L['HOURS']);
	if(min) txt.push(min + L['MINUTE']);
	if(!hour) txt.push(sec + L['SECOND']);
	return txt.join(' ');
}
function updateUserList(refresh){
	var $bar;
	var i, o, len = 0;
	var arr;
	
	// refresh = true;
	// if(!$stage.box.userList.is(':visible')) return;
	if($data.opts.su){
		arr = [];
		for(i in $data.users){
			len++;
			arr.push($data.users[i]);
		}
		arr.sort(function(a, b){ return b.data.score - a.data.score; });
		refresh = true;
	}else{
		arr = $data.users;
		
		for(i in $data.users) len++;
	}
	var serverName = L['server_' + $data.server] || ($data.server == 1 ? '유리' : '나무');
	var userListLabel = L['UserList'] || '접속자 목록';
	$stage.lobby.userListTitle.empty().append($('<span class="visitor-brand">').append($('<img>').attr({src:'/img/custom/chat-brand-white.png',alt:'끄투',draggable:'false'}))).append($('<span class="visitor-heading">').text('방문자목록'));
 var $visitorCount=$stage.box.userList.children('.visitor-count');
 if(!$visitorCount.length)$visitorCount=$('<div class="visitor-count">').insertAfter($stage.lobby.userListTitle);
 $visitorCount.text('방문자수: '+len+'명');
	
	if(refresh){
		$stage.lobby.userList.empty();
		$stage.dialog.inviteList.empty();
		for(i in arr){
			o = arr[i];
			if(o.robot) continue;
			
			$stage.lobby.userList.append(userListBar(o));
			if(o.place == 0) $stage.dialog.inviteList.append(userListBar(o, true));
		}
	}
 if(window.fitVisitorNames) window.fitVisitorNames();
}
function userListBar(o, forInvite){
	var $R;
	
	if(forInvite){
		$R = $("<div>").attr('id', "invite-item-"+o.id).addClass("invite-item users-item")
		.append($("<div>").addClass("jt-image users-image").css('background-image', safeImageBackground(o.profile.image)))
		.append(getLevelImage(o.data.score).addClass("users-level"))
		// .append($("<div>").addClass("jt-image users-from").css('background-image', "url('/img/kkutu/"+o.profile.type+".png')"))
		.append($("<div>").addClass("users-name").html(o.profile.title || o.profile.name))
		.on('click', function(e){
			requestInvite($(e.currentTarget).attr('id').slice(12));
		});
	}else{
		$R = $("<div>").attr('id', "users-item-"+o.id).addClass("users-item")
		.append($("<div>").addClass("jt-image users-image").css('background-image', safeImageBackground(o.profile.image)))
		.append(getLevelImage(o.data.score).addClass("users-level"))
		// .append($("<div>").addClass("jt-image users-from").css('background-image', "url('/img/kkutu/"+o.profile.type+".png')"))
		.append($("<div>").addClass("users-name ellipse").html(o.profile.title || o.profile.name))
		.on('click', function(e){
			requestProfile($(e.currentTarget).attr('id').slice(11));
		});
	}
	if(!forInvite){
  $R.find('.users-image').text(o.profile.image ? '' : '?');
  $R.append($('<span class="visitor-level">').text('Lv.'+getLevel(o.data.score)));
  var name=String(o.profile.title || o.profile.name || '손님');
  $R.find('.users-name').text(name).attr('title',name).get(0).style.setProperty('font-size',Math.max(12,22-Math.max(0,name.length-7)*.75)+'px','important');
 }
	addonNickname($R, o);
	return $R;
}
function addonNickname($R, o){
	if(o.equip['NIK']) $R.addClass("x-" + o.equip['NIK']);
	if(o.equip['BDG'] == "b1_gm") $R.addClass("x-gm");
	var $name = $R.find('.users-name');
	addDeveloperBadge($name.length ? $name : $R, o.profile);
}
function addDeveloperBadge($name, profile){
	if(!profile) return;
	$name.each(function(){
		var $label=$(this);
		var developerName = String(profile.title || profile.name || '');
		var isDeveloperName = profile.developer === true || /^\[GM\]/.test(developerName);
        if(isDeveloperName){
            if(!$label.children('.developer-name-text').length){
                var $text=$('<span class="developer-name-text">').text(developerName);
                $label.contents().filter(function(){return this.nodeType===3;}).remove();
                $label.prepend($text);
            }else $label.children('.developer-name-text').text(developerName);
        }else $label.children('.developer-name-text').each(function(){$(this).replaceWith(document.createTextNode($(this).text()));});
        var src = profile.adminBadge || '';
		if(src && !$(this).children('.moremi-developer-badge').length) $(this).append($('<img>').attr({src:src,alt:'사용자 배지',title:'배지'}).addClass('moremi-developer-badge'));
	});
}
function updateRoomList(refresh){
	var i;
	var len = 0;
	
	if(!refresh){
		$(".rooms-create").remove();
		for(i in $data.rooms) len++;
	}else{
		$stage.lobby.roomList.empty();
		for(i in $data.rooms){
			$stage.lobby.roomList.append(roomListBar($data.rooms[i]));
			len++;
		}
	}
	$stage.lobby.roomListTitle.html("<i class='fa fa-bars'></i> 방 목록 [" + len + (L['GAE'] || '개') + "]");
	
	if(len){
		$(".rooms-gaming").css('display', $data.opts.ow ? "none" : "");
		$(".rooms-locked").css('display', $data.opts.ou ? "none" : "");
	}else{
		$stage.lobby.roomList.append($stage.lobby.createBanner.clone().on('click', onBanner));
	}
	function onBanner(e){
		if(window.openNewRoomDialog) window.openNewRoomDialog();
	}
}
function roomListBar(o){
	var $R, $ch;
	var opts = getOptions(o.mode, o.opts);
	
	$R = $("<div>").attr('id', "room-"+o.id).addClass("rooms-item")
	.append($ch = $("<div>").addClass("rooms-channel channel-" + o.channel).on('click', function(e){ requestRoomInfo(o.id); }))
	.append($("<div>").addClass("rooms-number").html(o.id))
	.append($("<div>").addClass("rooms-title ellipse").text(badWords(o.title)))
	.append($("<div>").addClass("rooms-limit").html(o.players.length + " / " + o.limit))
	.append($("<div>").addClass("rooms-details")
		.append($("<div>").addClass("rooms-mode").html(opts.join(" / ").toString()))
		.append($("<div>").addClass("rooms-round").html(L['rounds'] + " " + o.round))
		.append($("<div>").addClass("rooms-time").html(o.time + L['SECOND']))
	)
	.append($("<div>").addClass("rooms-lock").html(o.password ? "<i class='fa fa-lock'></i>" : "<i class='fa fa-unlock'></i>"))
	.on('click', function(e){
		if(e.target == $ch.get(0)) return;
		tryJoin($(e.currentTarget).attr('id').slice(5));
	});
	if(o.gaming) $R.addClass("rooms-gaming");
	if(o.password) $R.addClass("rooms-locked");
	
	return $R;
}
function normalGameUserBar(o){
	o = normalizeGameUser(o);
	var $m, $n, $bar;
	var $R = $("<div>").attr('id', "game-user-"+o.id).addClass("game-user")
		.append($m = $("<div>").addClass("moremi game-user-image"))
		.append($("<div>").addClass("game-user-title")
			.append(getLevelImage(o.data.score).addClass("game-user-level"))
			.append($bar = $("<div>").addClass("game-user-name ellipse").html(o.profile.title || o.profile.name))
			.append($("<div>").addClass("expl").html(L['LEVEL'] + " " + getLevel(o.data.score)))
		)
		.append($n = $("<div>").addClass("game-user-score"));
	renderMoremi($m, o.equip);
	global.expl($R);
	addonNickname($bar, o);
	bindGameProfileCard($R, o);
	if(o.game.team) $n.addClass("team-" + o.game.team);
	
	return $R;
}
function miniGameUserBar(o){
	o = normalizeGameUser(o);
	var $m, $n, $bar;
	var $R = $("<div>").attr('id', "game-user-"+o.id).addClass("game-user")
		.append($m = $("<div>").addClass("moremi game-user-image"))
		.append($("<div>").addClass("game-user-title")
			.append(getLevelImage(o.data.score).addClass("game-user-level"))
			.append($bar = $("<div>").addClass("game-user-name ellipse").html(o.profile.title || o.profile.name))
		)
		.append($n = $("<div>").addClass("game-user-score"));
	renderMoremi($m, o.equip);
	if(o.id == $data.id) $bar.addClass("game-user-my-name");
	addonNickname($bar, o);
	bindGameProfileCard($R, o);
	if(o.game.team) $n.addClass("team-" + o.game.team);
	
	return $R;
}
function getAIProfile(level){
	var names = ['초보끄투봇', '일반끄투봇', '고수끄투봇', '고인물끄투봇', '핵끄투봇'];
	return {
		title: names[Math.max(0, Math.min(4, Number(level) || 0))],
		image: "/img/kkutu/robot.png?v=20260906-mascot-2"
	};
}
function bindGameProfileCard($card, o){
	if(!o || !o.id) return $card;
	$card.attr({ role: "button", tabindex: 0, title: (o.profile.title || o.profile.name || L['robot']) + " 프로필 보기" })
		.on('click', function(){ requestProfile(o.id); })
		.on('keydown', function(e){
			if(e.which == 13 || e.which == 32){
				e.preventDefault();
				requestProfile(o.id);
			}
		});
	return $card;
}
function normalizeGameUser(o){
	if(!o) return o;
	if(typeof o == "string") o = { id: o };
	o.id = o.id || (o.profile && o.profile.id) || "unknown";
	if(o.robot){
		o.profile = o.profile || getAIProfile(o.level || 0);
		o.id = o.id || ("robot-" + (o.level || 0));
		o.data = o.data || { score: 0 };
		o.equip = o.equip || { robot: true };
		o.game = o.game || { score: 0, team: 0, ready: true, form: "J" };
		if(o.game.score === undefined) o.game.score = 0;
		$data.robots[o.id] = o;
	}else{
		o.profile = o.profile || { title: L['guest'] || "플레이어" };
		o.data = o.data || { score: 0 };
		o.equip = o.equip || {};
		o.game = o.game || { score: 0, team: 0, ready: false, form: "J" };
	}
	return o;
}
function resolveGameParticipant(entry){
	var id = (typeof entry == "string") ? entry : (entry && (entry.id || (entry.profile && entry.profile.id)));
	var cached = id && ($data.users[id] || $data.robots[id]);
	var o = cached || entry;
	if(!o) return null;
	/* Game sequence records can arrive before the lobby user record.  Preserve
	 * the game-specific data from that record instead of dropping the card. */
	if(cached && entry && typeof entry == "object"){
		if(entry.game) cached.game = entry.game;
		if(!cached.profile && entry.profile) cached.profile = entry.profile;
		if(entry.robot) cached.robot = true;
		if(entry.level !== undefined) cached.level = entry.level;
	}
	return normalizeGameUser(o);
}
function participantKey(entry){
	if(typeof entry == "string") return entry;
	return entry && (entry.id || (entry.profile && entry.profile.id));
}
function appendGameParticipant($target, entry, renderer, rendered){
	var id = participantKey(entry);
	var o = resolveGameParticipant(entry);
	if(!o || !o.id || rendered[o.id]) return;

	rendered[o.id] = true;
	$target.append(renderer(o));
	/* The game panel is rebuilt whenever room data is refreshed.  Rebind an
	 * existing score animation to the newly created score element before it
	 * draws its next frame. */
	if($data["_s" + o.id]) $data["_s" + o.id].$obj = $(document.getElementById("game-user-" + o.id)).find(".game-user-score");
	updateScore(o.id, Number(o.game && o.game.score) || 0);
}
function updateRoom(gaming){
	var i, o, $r, entries, rendered;
	var $y, $z;
	var $m;
	var $bar;
	var rule = RULE[MODE[$data.room.mode]];
	var renderer = (mobile || rule.big) ? miniGameUserBar : normalGameUserBar;
	var spec;
	var arAcc = false, allReady = true;
	
	setRoomHead($(".RoomBox .product-title"), $data.room);
	setRoomHead($(".GameBox .product-title"), $data.room);
	if(gaming){
		$r = $(".GameBox .game-body").empty();
		rendered = {};
		entries = [];
		if($data.room.game && $data.room.game.seq) entries = entries.concat($data.room.game.seq);
		if(!entries.length && $data.room.players) entries = entries.concat($data.room.players);
		for(i in entries){
			if($data._replay){
				o = $rec.users[participantKey(entries[i])] || entries[i];
			}else{
				o = entries[i];
			}
			appendGameParticipant($r, o, renderer, rendered);
		}
		/* Keep the local card only when the local user is a participant. */
		if(entries.some(function(entry){ return participantKey(entry) === $data.id; }) && $data.users[$data.id]) appendGameParticipant($r, $data.users[$data.id], renderer, rendered);
		clearTimeout($data._jamsu);
		delete $data._jamsu;
	}else{
		$r = $(".room-users").empty();
		spec = $data.users[$data.id].game.form == "S";
		// 참가자
		for(i in $data.room.players){
			o = $data.users[$data.room.players[i]] || $data.room.players[i];
			o = normalizeGameUser(o);
			if(!o.game) continue;
			
			var prac = o.game.practice ? ('/' + L['stat_practice']) : '';
			var spec = (o.game.form == "S") ? ('/' + L['stat_spectate']) : false;
			
			if(o.robot) o = normalizeGameUser(o);
			$r.append($("<div>").attr('id', "room-user-"+o.id).addClass("room-user")
				.append($m = $("<div>").addClass("moremi room-user-image"))
				.append($("<div>").addClass("room-user-stat")
					.append($y = $("<div>").addClass("room-user-ready"))
					.append($z = $("<div>").addClass("room-user-team team-" + o.game.team).html($("#team-" + o.game.team).html()))
				)
				.append($("<div>").addClass("room-user-title")
					.append(getLevelImage(o.data.score).addClass("room-user-level"))
					.append($bar = $("<div>").addClass("room-user-name").html(o.profile.title || o.profile.name))
				).on('click', function(e){
					requestProfile($(e.currentTarget).attr('id').slice(10));
				})
			);
			renderMoremi($m, o.equip);
			if(spec) $z.hide();
			if(o.id == $data.room.master){
				$y.addClass("room-user-master").html(L['master'] + prac + (spec || ''));
			}else if(spec){
				$y.addClass("room-user-spectate").html(L['stat_spectate'] + prac);
			}else if(o.game.ready || o.robot){
				$y.addClass("room-user-readied").html(L['stat_ready']);
				if(!o.robot) arAcc = true;
			}else if(o.game.practice){
				$y.addClass("room-user-practice").html(L['stat_practice']);
				allReady = false;
			}else{
				$y.html(L['stat_noready']);
				allReady = false;
			}
			addonNickname($bar, o);
		}
		for(i = $data.room.players.length; i < Number($data.room.limit || 0); i++){
			$r.append($("<div>").addClass("room-user-empty").append($("<span>").text("+")));
		}
		clearTimeout($data._jamsu);
		delete $data._jamsu;
	}
	if($stage.dialog.profile.is(':visible')){
		requestProfile($data._profiled);
	}
}
function updateScore(id, score){
	var i, o, t;
	

	if(o = $data["_s"+id]){
		clearTimeout(o.timer);
		o.$obj = $(document.getElementById("game-user-" + id)).find(".game-user-score");
		o.goal = score;
	}else{
		o = $data["_s"+id] = {
			$obj: $(document.getElementById("game-user-" + id)).find(".game-user-score"),
			goal: score,
			now: 0
		};
	}
	animateScore(o);
	/*if(id === true){
		// 팀 정보 초기화
		$data.teams = [];
		for(i=0; i<5; i++) $data.teams.push({ list: [], score: 0 });
		for(i in $data.room.game.seq){
			t = $data.room.game.seq[i];
			o = $data.users[t] || $data.robots[t] || t;
			if(o){
				$data.teams[o.game.team].list.push(t.id ? t.id : t);
				$data.teams[o.game.team].score += o.game.score;
			}
		}
		for(i in $data.room.game.seq){
			t = $data.room.game.seq[i];
			o = $data.users[t] || $data.robots[t] || t;
			updateScore(t.id || t, o.game.score);
		}
	}else{
		o = $data.users[id] || $data.robots[id];
		if(o.game.team){
			t = $data.teams[o.game.team];
			i = $data["_s"+id];
			t.score += score - (i ? i.goal : 0);
		}else{
			t = { list: [ id ], score: score };
		}
		for(i in t.list){
			if(o = $data["_s"+t.list[i]]){
				clearTimeout(o.timer);
				o.$obj = $("#game-user-"+t.list[i]+" .game-user-score");
				o.goal = t.score;
			}else{
				o = $data["_s"+t.list[i]] = {
					$obj: $("#game-user-"+t.list[i]+" .game-user-score"),
					goal: t.score,
					now: 0
				};
			}
			animateScore(o);
		}
		return $("#game-user-" + id);
	}*/
	return $("#game-user-" + id);
}
function animateScore(o){
	var v = (o.goal - o.now) * Math.min(1, TICK * 0.01);
	
	if(v < 0.1) v = o.goal - o.now;
	else o.timer = addTimeout(animateScore, TICK, o);
	
	o.now += v;
	drawScore(o.$obj, Math.round(o.now));
}
function drawScore($obj, score){
	var i, sc = score < 0 ? ('-' + Math.abs(Math.round(score))) : ((score > 99999) ? (zeroPadding(Math.round(score * 0.001), 4) + 'k') : zeroPadding(score, 5));
	
	$obj.empty();
	for(i=0; i<sc.length; i++){
		$obj.append($("<div>").addClass("game-user-score-char").html(sc[i]));
	}
}
function drawMyDress(avGroup){
	var $view = $("#dress-view");
	var my = $data.users[$data.id];
	
	renderMoremi($view, my.equip);
	$(".dress-type.selected").removeClass("selected");
	$("#dress-type-all").addClass("selected");
	$("#dress-exordial").val(my.exordial);
	drawMyGoods(avGroup || true);
}
function renderGoods($target, preId, filter, equip, onClick){
	var $item;
	var list = [];
	var obj, q, g, equipped;
	var isAll = filter === true;
	var i;
	
	$target.empty();
	if(!equip) equip = {};
	for(i in equip){
		if(!$data.box.hasOwnProperty(equip[i])) $data.box[equip[i]] = { value: 0 };
	}
	for(i in $data.box){
		try{ obj = iGoods(i); }catch(error){ obj = null; }
		if(obj) list.push({ key: i, obj: obj, value: $data.box[i] });
	}
	list.sort(function(a, b){
		return (a.obj.name < b.obj.name) ? -1 : 1;
	});
	for(i in list){
		obj = list[i].obj;
		q = list[i].value;
		g = obj.group;
		if(g.substr(0, 3) == "BDG") g = "BDG";
		equipped = (g == "Mhand") ? (equip['Mlhand'] == list[i].key || equip['Mrhand'] == list[i].key) : (equip[g] == list[i].key);
		
		if(typeof q == "number") q = {
			value: q
		};
		if(!q.hasOwnProperty("value") && !equipped) continue;
		if(!isAll) if(filter.indexOf(obj.group) == -1) continue;
		$target.append($item = $("<div>").addClass("dress-item")
			.append(getImage(obj.image).addClass("dress-item-image").html("x" + q.value))
			.append(explainGoods(obj, equipped, q.expire))
		);
		$item.attr('id', preId + "-" + obj._id).on('click', onClick);
		if(equipped) $item.addClass("dress-equipped");
	}
	global.expl($target);
}
function drawMyGoods(avGroup){
	var equip = $data.users[$data.id].equip || {};
	var filter;
	var isAll = avGroup === true;
	
	$data._avGroup = avGroup;
	if(isAll) filter = true;
	else filter = (avGroup || "").split(',');
	
	renderGoods($("#dress-goods"), 'dress', filter, equip, function(e){
		var $target = $(e.currentTarget);
		var id = $target.attr('id').slice(6);
		var item = iGoods(id);
		var isLeft;
		
		if(e.ctrlKey){
			if($target.hasClass("dress-equipped")) return fail(426);
			if(!confirm(L['surePayback'] + commify(Math.round((item.cost || 0) * 0.2)) + L['ping'])) return;
			$.post("/payback/" + id, function(res){
				if(res.error) return fail(res.error);
				alert(L['painback']);
				$data.box = res.box;
				$data.users[$data.id].money = res.money;
				
				drawMyDress($data._avGroup);
				updateUI(false);
			});
		}else if(AVAIL_EQUIP.indexOf(item.group) != -1){
			if(item.group == "Mhand"){
				isLeft = confirm(L['dressWhichHand']);
			}
			requestEquip(id, isLeft);
		}else if(item.group == "CNS"){
			if(!confirm(L['sureConsume'])) return;
			$.post("/consume/" + id, function(res){
				if(res.exp) notice(L['obtainExp'] + ": " + commify(res.exp));
				if(res.money) notice(L['obtainMoney'] + ": " + commify(res.money));
				res.gain.forEach(function(item){ queueObtain(item); });
				$data.box = res.box;
				$data.users[$data.id].data = res.data;
				send('refresh');
				
				drawMyDress($data._avGroup);
				updateMe();
			});
		}
	});
	if($data.box && $data.box.font_dunggeunmo){
		var equippedFont = !!equip.font_dunggeunmo;
		var $fontItem = $("<div>").addClass("dress-item font-dunggeunmo-item" + (equippedFont ? " dress-equipped" : ""));
		var $fontExpl = $("<div>").addClass("dress-expl");
		$fontItem.append($("<div>").addClass("dress-item-image font-dunggeunmo-preview").text("끄투게임즈코리아").append($("<span>").addClass("inventory-qty").text("x" + Number($data.box.font_dunggeunmo || 0))));
		$fontExpl.append($("<div>").addClass("dress-item-title").text("끄투 글꼴" + (equippedFont ? " (장착됨)" : "")));
		$fontExpl.append($("<div>").addClass("dress-item-group").text("글꼴"));
		$fontExpl.append($("<div>").addClass("dress-item-expl").text("게임에서 써지는 글씨의 폰트를 바꿔줍니다."));
		$fontItem.append($fontExpl).on('click', function(){
			$.post('/font/dunggeunmo/equip', function(res){
					if(res.error) return fail(res.error);
					$data.box = res.box;
					if(res.equipped) equip.font_dunggeunmo = true;
					else delete equip.font_dunggeunmo;
					$('body').toggleClass('dunggeunmo-font', !!res.equipped);
					notice(res.equipped ? '끄투 글꼴을 장착했습니다.' : '끄투 글꼴을 해제했습니다.');
					drawMyDress($data._avGroup);
					send('refresh');
			});
		});
		$("#dress-goods").prepend($fontItem);
	}
}
function requestEquip(id, isLeft){
	var my = $data.users[$data.id];
	var part = $data.shop[id].group;
	if(part == "Mhand") part = isLeft ? "Mlhand" : "Mrhand";
	if(part.substr(0, 3) == "BDG") part = "BDG";
	var already = my.equip[part] == id;
	
	if(confirm(L[already ? 'sureUnequip' : 'sureEquip'] + ": " + L[id][0])){
		$.post("/equip/" + id, { isLeft: isLeft }, function(res){
			if(res.error) return fail(res.error);
			$data.box = res.box;
			my.equip = res.equip;
			
			drawMyDress($data._avGroup);
			send('refresh');
			updateUI(false);
		});
	}
}
function drawCharFactory(){
	var $tray = $("#cf-tray");
	var $dict = $("#cf-dict");
	var $rew = $("#cf-reward");
	var $goods = $("#cf-goods");
	var $cost = $("#cf-cost");
	
	$data._tray = [];
	$dict.empty();
	$rew.empty();
	$cost.html("");
	$stage.dialog.cfCompose.removeClass("cf-composable");
	
	renderGoods($goods, 'cf', [ 'PIX', 'PIY', 'PIZ' ], null, function(e){
		var $target = $(e.currentTarget);
		var id = $target.attr('id').slice(3);
		var bd = $data.box[id];
		var i, c = 0;
		
		if($data._tray.length >= 6) return fail(435);
		for(i in $data._tray) if($data._tray[i] == id) c++;
		if(bd - c > 0){
			$data._tray.push(id);
			drawCFTray();
		}else{
			fail(434);
		}
	});
	function trayEmpty(){
		$tray.html($("<h4>").css('padding-top', "8px").width("100%").html(L['cfTray']));
	}
	function drawCFTray(){
		var LEVEL = { 'WPC': 1, 'WPB': 2, 'WPA': 3 };
		var gd, word = "";
		var level = 0;
		
		$tray.empty();
		$(".cf-tray-selected").removeClass("cf-tray-selected");
		$data._tray.forEach(function(item){
			gd = iGoods(item);
			word += item.slice(4);
			level += LEVEL[item.slice(1, 4)];
			$tray.append($("<div>").addClass("jt-image")
				.css('background-image', safeImageBackground(gd.image))
				.attr('id', "cf-tray-" + item)
				.on('click', onTrayClick)
			);
			$("#cf-\\" + item).addClass("cf-tray-selected");
		});
		$dict.html(L['searching']);
		$rew.empty();
		$stage.dialog.cfCompose.removeClass("cf-composable");
		$cost.html("");
		tryDict(word, function(res){
			var blend = false;
			
			if(res.error){
				if(word.length == 3){
					blend = true;
					$dict.html(L['cfBlend']);
				}else return $dict.html(L['wpFail_' + res.error]);
			}
			viewReward(word, level, blend);
			$stage.dialog.cfCompose.addClass("cf-composable");
			if(!res.error) $dict.html(processWord(res.word, res.mean, res.theme, res.type.split(',')));
		});
		if(word == "") trayEmpty();
	}
	function viewReward(text, level, blend){
		$.get("/cf/" + text + "?l=" + level + "&b=" + (blend ? "1" : ""), function(res){
			if(res.error) return fail(res.error);
			
			$rew.empty();
			res.data.forEach(function(item){
				var bd = iGoods(item.key);
				var rt = (item.rate >= 1) ? L['cfRewAlways'] : ((item.rate * 100).toFixed(1) + '%');
				
				$rew.append($("<div>").addClass("cf-rew-item")
					.append($("<div>").addClass("jt-image cf-rew-image")
						.css('background-image', safeImageBackground(bd.image))
					)
					.append($("<div>").width(100)
						.append($("<div>").width(100).html(bd.name))
						.append($("<div>").addClass("cf-rew-value").html("x" + item.value))
					)
					.append($("<div>").addClass("cf-rew-rate").html(rt))
				);
			});
			$cost.html(L['cfCost'] + ": " + res.cost + L['ping']);
		});
	}
	function onTrayClick(e){
		var id = $(e.currentTarget).attr('id').slice(8);
		var bi = $data._tray.indexOf(id);
		
		if(bi == -1) return;
		$data._tray.splice(bi, 1);
		drawCFTray();
	}
	trayEmpty();
}
function drawLeaderboard(data){
	var $board = $stage.dialog.lbTable.empty();
	var fr = data.data[0] ? data.data[0].rank : 0;
	var page = (data.page || Math.floor(fr / 20)) + 1;
	
	data.data.forEach(function(item, index){
		var profile = $data.users[item.id];
		
		if(profile) profile = profile.profile.title || profile.profile.name;
		else profile = L['hidden'];
		
		item.score = Number(item.score);
		$board.append($("<tr>").attr('id', "ranking-" + item.id)
			.addClass("ranking-" + (item.rank + 1))
			.append($("<td>").html(item.rank + 1))
			.append($("<td>")
				.append(getLevelImage(item.score).addClass("ranking-image"))
				.append($("<label>").css('padding-top', 2).html(getLevel(item.score)))
			)
			.append($("<td>").html(profile))
			.append($("<td>").html(commify(item.score)))
		);
	});
	$("#ranking-" + $data.id).addClass("ranking-me");
	$stage.dialog.lbPage.html(L['page'] + " " + page);
	$stage.dialog.lbPrev.attr('disabled', page <= 1);
	$stage.dialog.lbNext.attr('disabled', data.data.length < 15);
	$stage.dialog.lbMe.attr('disabled', !!$data.guest);
	$data._lbpage = page - 1;
}
function updateCommunity(){
	var i, o, p, memo;
	var len = 0;
	
	$stage.dialog.commFriends.empty();
	for(i in $data.friends){
		len++;
		memo = $data.friends[i];
		o = $data._friends[i] || {};
		p = ($data.users[i] || {}).profile;
		
		$stage.dialog.commFriends.append($("<div>").addClass("cf-item").attr('id', "cfi-" + i)
			.append($("<div>").addClass("cfi-status cfi-stat-" + (o.server ? 'on' : 'off')))
			.append($("<div>").addClass("cfi-server").html(o.server ? L['server_' + o.server] : "-"))
			.append($("<div>").addClass("cfi-name ellipse").html(p ? (p.title || p.name) : L['hidden']))
			.append($("<div>").addClass("cfi-memo ellipse").text(memo))
			.append($("<div>").addClass("cfi-menu")
				.append($("<i>").addClass("fa fa-pencil").on('click', requestEditMemo))
				.append($("<i>").addClass("fa fa-remove").on('click', requestRemoveFriend))
			)
		);
	}
	function requestEditMemo(e){
		var id = $(e.currentTarget).parent().parent().attr('id').slice(4);
		var _memo = $data.friends[id];
		var memo = prompt(L['friendEditMemo'], _memo);
		
		if(!memo) return;
		send('friendEdit', { id: id, memo: memo }, true);
	}
	function requestRemoveFriend(e){
		var id = $(e.currentTarget).parent().parent().attr('id').slice(4);
		var memo = $data.friends[id];
		
		if($data._friends[id].server) return fail(455);
		if(!confirm(memo + "(#" + id.substr(0, 5) + ")\n" + L['friendSureRemove'])) return;
		send('friendRemove', { id: id }, true);
	}
	$("#CommunityDiag .dialog-title").html(L['communityText'] + " (" + len + " / 100)");
}
function requestRoomInfo(id){
	var o = $data.rooms[id];
	var $pls = $("#ri-players").empty();
	
	$data._roominfo = id;
	$("#RoomInfoDiag .dialog-title").html(id + L['sRoomInfo']);
	$("#ri-title").html((o.password ? "<i class='fa fa-lock'></i>&nbsp;" : "") + o.title);
	$("#ri-mode").html(L['mode' + MODE[o.mode]]);
	$("#ri-round").html(o.round + ", " + o.time + L['SECOND']);
	$("#ri-limit").html(o.players.length + " / " + o.limit);
	o.players.forEach(function(p, i){
		var $p, $moremi;
		var rd = o.readies[p] || {};
		
		p = $data.users[p] || NULL_USER;
		if(o.players[i].robot){
			p.profile = { title: '끄투 봇' };
			p.equip = { robot: true };
		}else rd.t = rd.t || 0;
		
		$pls.append($("<div>").addClass("ri-player")
			.append($moremi = $("<div>").addClass("moremi rip-moremi"))
			.append($p = $("<div>").addClass("ellipse rip-title").html(p.profile.title || p.profile.name))
			.append($("<div>").addClass("rip-team team-" + rd.t).html($("#team-" + rd.t).html()))
			.append($("<div>").addClass("rip-form").html(L['pform_' + rd.f]))
		);
		if(p.id == o.master) $p.prepend($("<label>").addClass("rip-master").html("[" + L['master'] + "]&nbsp;"));
		$p.prepend(getLevelImage(p.data.score).addClass("profile-level rip-level"));
		
		renderMoremi($moremi, p.equip);
	});
	showDialog($stage.dialog.roomInfo);
	$stage.dialog.roomInfo.show();
}
function requestProfile(id){
	var o = $data.users[id] || $data.robots[id];
	var $rec = $("#profile-record").empty();
	var $pi, $ex;
	var i;
	
	if(!o){
		notice(L['error_405']);
		return;
	}
	$("#ProfileDiag .dialog-title").html((o.profile.title || o.profile.name) + L['sProfile']);
	$(".profile-head").empty().append($pi = $("<div>").addClass("moremi profile-moremi"))
		.append($("<div>").addClass("profile-head-item")
			.append(getImage(o.profile.image).addClass("profile-image"))
			.append($("<div>").addClass("profile-title ellipse").html(o.profile.title || o.profile.name)
				.append($("<label>").addClass("profile-tag").html(" #" + o.id.toString().substr(0, 5)))
			)
		)
		.append($("<div>").addClass("profile-head-item")
			.append(getLevelImage(o.data.score).addClass("profile-level"))
			.append($("<div>").addClass("profile-level-text").html(L['LEVEL'] + " " + (i = getLevel(o.data.score))))
			.append($("<div>").addClass("profile-score-text").html(commify(o.data.score) + " / " + commify(EXP[i - 1]) + L['PTS']))
		)
		.append($ex = $("<div>").addClass("profile-head-item profile-exordial ellipse").text(badWords(o.exordial || ""))
			.append($("<div>").addClass("expl").css({ 'white-space': "normal", 'width': 300, 'font-size': "11px" }).text(o.exordial))
		);
	if(o.robot){
		o.profile = getAIProfile(o.level || 0);
		$stage.dialog.profileLevel.text('난이도 설정');
		$stage.dialog.profileLevel.toggle(!!$data.room && $data.id == $data.room.master);
		$stage.dialog.profileLevel.prop('disabled', false);
		$('#robot-level').val(String(Math.max(0, Math.min(4, Number(o.level) || 0))));
		$('#robot-team').val(String(o.game && Number(o.game.team) || 0));
		$("#profile-place").html($data.room.id + L['roomNumber']);
	}else{
		$stage.dialog.profileLevel.hide();
		$("#profile-place").html(o.place ? (o.place + L['roomNumber']) : L['lobby']);
		for(i in (o.data.record || {})){
			var r = o.data.record[i] || [], modeKey = MODE[i] || i;
			var modeNames = {EKT:'영어 끄투',ESH:'영어 끝말잇기',KKT:'한국어 쿵쿵따',KSH:'한국어 끝말잇기',KAW:'아무말잇기',KAL:'전체',CSQ:'자음퀴즈',KCW:'한국어 십자말풀이',KTY:'한국어 타자 대결',ETY:'영어 타자 대결',KAP:'한국어 앞말잇기',HUN:'훈민정음',KDA:'한국어 단어 대결',EDA:'영어 단어 대결',KSS:'한국어 솎솎',ESS:'영어 솎솎'};
			var modeLabel = modeNames[modeKey] || (L && L['mode' + modeKey]) || modeKey || '게임';
			$rec.append($("<div>").addClass("profile-record-field")
				.append($("<div>").addClass("profile-field-name").text(modeLabel))
				.append($("<div>").addClass("profile-field-record").text((Number(r[0]) || 0) + '판 · ' + (Number(r[1]) || 0) + '승'))
				.append($("<div>").addClass("profile-field-score").text(commify(Number(r[2]) || 0) + '점'))
			);
		}
		renderMoremi($pi, o.equip);
	}
	$data._profiled = id;
	$stage.dialog.profileKick.hide();
	$stage.dialog.profileShut.hide();
	$stage.dialog.profileDress.hide();
	$stage.dialog.profileWhisper.hide();
	$stage.dialog.profileFriendAdd.hide();
	$stage.dialog.profileHandover.hide();
	
	if($data.id == id) $stage.dialog.profileDress.text('보관함').show();
	else if(!o.robot){
		$stage.dialog.profileShut.show();
		$stage.dialog.profileWhisper.show();
		if(!$data.guest) $stage.dialog.profileFriendAdd.show();
	}
	if($data.room){
		if($data.id != id && $data.id == $data.room.master){
			$stage.dialog.profileKick.show();
			if(!o.robot) $stage.dialog.profileHandover.show();
		}
	}
	showDialog($stage.dialog.profile);
	$stage.dialog.profile.show();
	global.expl($ex);
}
function requestInvite(id){
	var nick;
	
	if(id != "AI"){
		nick = $data.users[id].profile.title || $data.users[id].profile.name;
		if(!confirm(nick + L['sureInvite'])) return;
	}
	send('invite', { target: id });
}
function checkFailCombo(id){
	if(!$data._replay && $data.lastFail == $data.id && $data.id == id){
		$data.failCombo++;
		if($data.failCombo == 1) notice(L['trollWarning']);
		if($data.failCombo > 1){
			send('leave');
			fail(437);
            return true;
		}
	}else{
		$data.failCombo = 0;
	}
	$data.lastFail = id;
 return false;
}
function clearGame(){
	if($data._spaced) $lib.Typing.spaceOff();
	clearInterval($data._tTime);
	$data._relay = false;
}
function gameReady(){
	var i, u;
	$data._inputValues = {};
	$data._sharedWordInput = '';
	$data._wordInputMode = 'waiting';
	
	for(i in $data.room.players){
		if($data._replay){
			u = $rec.users[$data.room.players[i]] || $data.room.players[i];
		}else{
			u = $data.users[$data.room.players[i]] || $data.robots[$data.room.players[i].id] || $data.room.players[i];
		}
		u = normalizeGameUser(u);
		if(!u || !u.game) continue;
		u.game.score = 0;
		delete $data["_s"+u.id];
	}
	delete $data.lastFail;
	$data._rankResultRecorded = false;
	$data.failCombo = 0;
	$data._spectate = $data.room.game.seq.indexOf($data.id) == -1;
	$('body').toggleClass('spectating', $data._spectate);
	$('.game-input').toggle(!$data._spectate);
	$data._gAnim = true;
	$stage.box.room.show().height(360).animate({ 'height': 1 }, 500);
	$stage.box.game.height(1).animate({ 'height': 410 }, 500);
	stopBGM();
	$stage.dialog.resultSave.attr('disabled', false);
	clearBoard();
	$stage.game.display.html(L['soon']);
	playSound('game_start');
	if(!$data.room.ranked && !(RULE[MODE[$data.room.mode]] && RULE[MODE[$data.room.mode]].rule === 'Classic')) playBGM('game');
	forkChat();
	addTimeout(function(){
		$stage.box.room.height(360).hide();
		$stage.chat.scrollTop(999999999);
	}, 500);
}
function replayPrevInit(){
	var i;
	
	for(i in $data.room.game.seq){
		if($data.room.game.seq[i].robot){
			$data.room.game.seq[i].game.score = 0;
		}
	}
	$rec.users = {};
	for(i in $rec.players){
		var id = $rec.players[i].id;
		var rd = $rec.readies[id] || {};
		var u = $data.users[id] || $data.robots[id];
		var po = id;
		
		if($rec.players[i].robot){
			u = $rec.users[id] = { robot: true };
			po = $rec.players[i];
			po.game = {};
		}else{
			u = $rec.users[id] = {};
		}
		$data.room.players.push(po);
		u.id = po;
		u.profile = $rec.players[i];
		u.data = u.profile.data;
		u.equip = u.profile.equip;
		u.game = { score: 0, team: rd.t };
	}
	$data._rf = 0;
}
function replayReady(){
	var i;
	
	replayStop();
	$data._replay = true;
	$data.room = {
		title: $rec.title,
		players: [],
		events: [],
		time: $rec.roundTime,
		round: $rec.round,
		mode: $rec.mode,
		limit: $rec.limit,
		game: $rec.game,
		opts: $rec.opts,
		readies: $rec.readies
	};
	replayPrevInit();
	for(i in $rec.events){
		$data.room.events.push($rec.events[i]);
	}
	$stage.box.userList.hide();
	$stage.box.roomList.hide();
	$stage.box.game.show();
	$stage.dialog.replay.hide();
	gameReady();
	updateRoom(true);
	$data.$gp = $(".GameBox .product-title").empty()
		.append($data.$gpt = $("<div>").addClass("game-replay-title"))
		.append($data.$gpc = $("<div>").addClass("game-replay-controller")
			.append($("<button>").html(L['replayNext']).on('click', replayNext))
			.append($("<button>").html(L['replayPause']).on('click', replayPause))
			.append($("<button>").html(L['replayPrev']).on('click', replayPrev))
		);
	$('<button>').addClass('replay-stop').text('리플레이 종료').appendTo($data.$gpc).on('click', replayStop);
	$data._gpp = L['replay'] + " - " + (new Date($rec.time)).toLocaleString();
	if(!$data.room.events.length){ replayStop(); return; }
	$data._gtt = $data.room.events[$data.room.events.length - 1].time;
	$data._eventTime = 0;
	$data._rt = addTimeout(replayTick, 2000);
	$data._rprev = 0;
	$data._rpause = false;
	replayStatus();
}
function replayPrev(e){
	var ev = $data.room.events[--$data._rf];
	var c;
	var to;
	
	if(!ev) return;
	c = ev.time;
	do{
		if(!(ev = $data.room.events[--$data._rf])) break;
	}while(c - ev.time < 1000);
	
	to = $data._rf - 1;
	replayPrevInit();
	c = $data.muteEff;
	$data.muteEff = true;
	for(i=0; i<to; i++){
		replayTick();
	}
	$(".deltaScore").remove();
	$data.muteEff = c;
	replayTick();
	/*var pev, ev = $data.room.events[--$data._rf];
	var c;
	
	if(!ev) return;
	
	c = ev.time;
	clearTimeout($data._rt);
	do{
		if(ev.data.type == 'turnStart'){
			$(".game-user-current").removeClass("game-user-current");
			if((pev = $data.room.events[$data._rf - 1]).data.profile) $("#game-user-" + pev.data.profile.id).addClass("game-user-current");
		}
		if(ev.data.type == 'turnEnd'){
			$stage.game.chain.html(--$data.chain);
			if(ev.data.profile){
				addScore(ev.data.profile.id, -(ev.data.score + ev.data.bonus));
				updateScore(ev.data.profile.id, getScore(ev.data.profile.id));
			}
		}
		if(!(ev = $data.room.events[--$data._rf])) break;
	}while(c - ev.time < 1000);
	if($data._rf < 0) $data._rf = 0;
	if(ev) if(ev.data.type == 'roundReady'){
		$(".game-user-current").removeClass("game-user-current");
	}
	replayTick(true);*/
}
function replayPause(e){
	var p = $data._rpause = !$data._rpause;
	
	$(e.target).html(p ? L['replayResume'] : L['replayPause']);
}
function replayNext(e){
	clearTimeout($data._rt);
	replayTick();
}
function replayStatus(){
	$data.$gpt.html($data._gpp
		+ " (" + ($data._eventTime * 0.001).toFixed(1) + L['SECOND']
		+ " / " + ($data._gtt * 0.001).toFixed(1) + L['SECOND']
		+ ")"
	);
}
function replayTick(stay){
	var event = $data.room.events[$data._rf];
	var args, i;
	
	clearTimeout($data._rt);
	if(!stay) $data._rf++;
	if(!event){
		replayStop();
		return;
	}
	if($data._rpause){
		$data._rf--;
		return $data._rt = addTimeout(replayTick, 100);
	}
	args = event.data;
	if(args.hint) args.hint = { _id: args.hint };
	if(args.type == 'chat') args.timestamp = $rec.time + event.time;
	
	onMessage(args);
	
	$data._eventTime = event.time;
	replayStatus();
	if($data.room.events.length > $data._rf) $data._rt = addTimeout(replayTick,
		$data.room.events[$data._rf].time - event.time
	);
	else replayStop();
}
function replayStop(){
	delete $data.room;
	$data._replay = false;
	$stage.box.room.height(360);
	clearTimeout($data._rt);
	updateUI();
	playBGM('lobby');
}
function startRecord(title){ return; /* replay recording disabled */
	var i, u;
	
	$rec = {
		version: $data.version,
		me: $data.id,
		players: [],
		events: [],
		title: $data.room.title,
		roundTime: $data.room.time,
		round: $data.room.round,
		mode: $data.room.mode,
		limit: $data.room.limit,
		game: $data.room.game,
		opts: $data.room.opts,
		readies: $data.room.readies,
		time: (new Date()).getTime()
	};
	for(i in $data.room.players){
		var o;
		
		u = $data.users[$data.room.players[i]] || $data.room.players[i];
		o = { id: u.id, score: 0 };
		if(u.robot){
			o.id = u.id;
			o.robot = true;
			o.data = { score: 0 };
			u = { profile: getAIProfile(u.level) };
		}else{
			o.data = u.data;
			o.equip = u.equip;
		}
		o.title = "#" + u.id; // u.profile.title;
		// o.image = u.profile.image;
		$rec.players.push(o);
	}
	$data._record = true;
}
function stopRecord(){
	$data._record = false;
}
function recordEvent(data){
	if($data._replay) return;
	if(!$rec) return;
	var i, _data = data;

	if(!data.hasOwnProperty('type')) return;
	if(data.type == "room") return;
	if(data.type == "obtain") return;
	data = {};
	for(i in _data) data[i] = _data[i];
	if(data.profile) data.profile = { id: data.profile.id, title: "#" + data.profile.id };
	if(data.user) data.user = { id: data.user.profile.id, profile: { id: data.user.profile.id, title: "#" + data.user.profile.id }, data: { score: 0 }, equip: {} };
	
	$rec.events.push({
		data: data,
		time: (new Date()).getTime() - $rec.time
	});
}
function clearBoard(){
	$data._relay = false;
	loading();
	$stage.game.here.hide();
	$stage.dialog.result.hide();
	$stage.dialog.dress.hide();
	$stage.dialog.charFactory.hide();
	$(".jjoriping,.rounds,.game-body").removeClass("cw");
	$stage.game.display.empty();
	$stage.game.chain.hide();
	$stage.game.hints.empty().hide();
	$stage.game.cwcmd.hide();
	$stage.game.bb.hide();
	$stage.game.round.empty();
	$stage.game.history.empty();
	$("#WordMeaning").addClass("is-empty")
		.find(".word-meaning-word").text("-").end()
		.find(".word-meaning-definition").text("낱말을 입력하면 뜻이 표시됩니다.");
	$stage.game.items.show().css('opacity', 0);
	$(".jjo-turn-time .graph-bar").width(0).css({ 'float': "", 'text-align': "", 'background-color': "" });
	$(".jjo-round-time .graph-bar").width(0).css({ 'float': "", 'text-align': "" }).removeClass("round-extreme");
	$(".game-user-bomb").removeClass("game-user-bomb");
}
function drawRound(round){
	var i;
	
	$stage.game.round.empty();
	for(i=0; i<$data.room.round; i++){
		$stage.game.round.append($l = $("<label>").html($data.room.game.title[i]));
		if((i+1) == round) $l.addClass("rounds-current");
	}
}
function turnGoing(){
	route("turnGoing");
}
function turnHint(data){
	route("turnHint", data);
}
function turnError(code, text){
	$stage.game.display.empty().append($("<label>").addClass("game-fail-text")
		.text((L['turnError_'+code] ? (L['turnError_'+code] + ": ") : "") + text)
	);
	playSound('fail');
	clearTimeout($data._fail);
	$data._fail = addTimeout(function(){
		$stage.game.display.html($data._char);
	}, 1800);
}
function getScore(id){
	if($data._replay) return $rec.users[id].game.score;
	else return ($data.users[id] || $data.robots[id]).game.score;
}
function addScore(id, score){
	if($data._replay) $rec.users[id].game.score += score;
	else ($data.users[id] || $data.robots[id]).game.score += score;
}
function drawObtainedScore($uc, $sc){
	$uc.append($sc);
	addTimeout(function(){ $sc.remove(); }, 2000);
	
	return $uc;
}
function turnEnd(id, data){
	route("turnEnd", id, data);
}
function restoreResultAd(){
 var $home = $('#ResultAdHome');
 if($home.length){
  $('#ResultAdHolder .site-ad-slot').insertBefore($home);
  $home.remove();
 }
}
function setupResultFooter(){
 restoreResultAd();
 var $dialog=$('#ResultDiag'), $footer=$('#ResultFooter');
 if(!$footer.length){
  $footer=$('<div>').attr('id','ResultFooter').appendTo($dialog.children('.dialog-body'));
  $dialog.find('.result-me').appendTo($footer);
  $dialog.find('.dialog-bar.tail-button').appendTo($footer);
  $('<div>').attr('id','ResultAdHolder').attr('aria-label','광고').appendTo($footer);
  $('<img>').addClass('result-brand').attr({src:'/img/custom/site-logo-ko.png',alt:'끄투게임즈코리아'}).prependTo($footer.find('.result-me'));
 }
 $dialog.toggleClass('result-guest',!!$data.guest);
 $dialog.find('#result-ok').text('계속');
 $dialog.find('.result-me-level-head').text('Lv.');
 if($data.guest){
  var $ad=$('.site-ad-slot[data-ad-placement="game"]').first();
  if($ad.length){
   $('<span>').attr('id','ResultAdHome').hide().insertBefore($ad);
   $ad.appendTo('#ResultAdHolder');
  }
 }
}
function renderMatchResultScene(result, data){
 var $dialog = $('#ResultDiag').addClass('match-result-screen');
 $dialog.children('.dialog-head').find('.dialog-title').text('결과');
 $dialog.find('.match-result-scene').remove();
 var rows = result.map(function(r){
  var u = ($data._replay ? $rec.users[r.id] : $data.users[r.id]) || $data.robots[r.id] || NULL_USER;
  return {id:r.id, score:Number(r.score)||0, user:u};
 });
 // Robots are not included in the server's reward list, but belong on the podium.
 var seq = ($data.room && $data.room.game && $data.room.game.seq) || [];
 seq.forEach(function(entry){
  var id = typeof entry === 'object' ? entry.id : entry;
  var u = $data.robots[id];
  if(u && !rows.some(function(r){return r.id === id;})) rows.push({id:id,score:Number(u.game && u.game.score)||0,user:u});
 });
 rows.sort(function(a,b){return b.score-a.score;});
 var $scene = $('<div>').addClass('match-result-scene').prependTo($dialog.children('.dialog-body'));
 $('<div>').addClass('match-result-meta').text($data.room && $data.room.ranked ? '순위전' : '친선전').appendTo($scene);
 var $table = $('<div>').addClass('match-result-table').attr('role','table').appendTo($scene);
 $('<div>').addClass('match-result-row match-result-labels').append($('<span>').text('#'),$('<span>').text('플레이어'),$('<span>').text('점수')).appendTo($table);
 var rank = 0;
 rows.forEach(function(r,i){
  if(i === 0 || rows[i-1].score !== r.score) rank = i;
  var profile = r.user.profile || {};
  var name = profile.title || profile.name || r.user.name || '끄투 봇';
  var equip = $.extend({},r.user.equip || {},{robot:!!r.user.robot});
  var $row = $('<div>').addClass('match-result-row').toggleClass('is-me',r.id===$data.id).appendTo($table);
  $('<strong>').addClass('match-result-rank').toggleClass('is-winner',rank===0).text(rank===0?'승':(rows.length===2?'패':String(rank+1))).appendTo($row);
  var $player = $('<div>').addClass('match-result-player').appendTo($row);
  var $face = $('<div>').addClass('moremi result-avatar').appendTo($player); renderMoremi($face,equip);
  $('<strong>').text(name).appendTo($player);
  $('<b>').text(String(r.score)).appendTo($row);

 });
 setupResultFooter();
}

function roundEnd(result, data){
	if(!data) data = {};
	var i, o, r;
	var $b = $(".result-board").empty();
	var $o, $p;
	var lvUp, sc;
	var addit, addp;
	
	$(".result-me-expl").empty();
	$stage.game.display.html(L['roundEnd']);
	$data._resultPage = 1;
	$data._result = null;
	for(i in result){
		r = result[i];
		if($data._replay){
			o = $rec.users[r.id];
		}else{
			o = $data.users[r.id];
		}
		if(!o){
			o = NULL_USER;
		}
		if(!o.data) continue;
		if(!r.reward) continue;
		
		r.reward.score = $data._replay ? 0 : Math.round(r.reward.score);
		lvUp = getLevel(sc = o.data.score) > getLevel(o.data.score - r.reward.score);
		
		$b.append($o = $("<div>").addClass("result-board-item")
			.append($p = $("<div>").addClass("result-board-rank").html(r.rank + 1))
			.append(getLevelImage(sc).addClass("result-board-level"))
			.append($("<div>").addClass("result-board-name").html(o.profile.title || o.profile.name))
			.append($("<div>").addClass("result-board-score")
				.html(data.scores ? (L['avg'] + " " + commify(data.scores[r.id]) + L['kpm']) : (commify(r.score || 0) + L['PTS']))
			)
			.append($("<div>").addClass("result-board-reward").html(r.reward.score ? ("+" + commify(r.reward.score)) : "-"))
			.append($("<div>").addClass("result-board-lvup").css('display', lvUp ? "block" : "none")
				.append($("<i>").addClass("fa fa-arrow-up"))
				.append($("<div>").html(L['lvUp']))
			)
		);
		if(o.game.team) $p.addClass("team-" + o.game.team);
		if(r.id == $data.id){
			r.exp = o.data.score - r.reward.score;
			r.level = getLevel(r.exp);
			$data._result = r;
			$o.addClass("result-board-me");
			$(".result-me-expl").append(explainReward(r.reward._score, r.reward._money, r.reward._blog));
		}
	}
	if($data.room && RULE[MODE[$data.room.mode]].rule === 'Yut' && data.winnerTeam){
		$b.empty().addClass('yut-team-results');
		[Number(data.winnerTeam),Number(data.winnerTeam)===1?2:1].forEach(function(team){
			var won=team===Number(data.winnerTeam);
			$b.append($('<div>').addClass('yut-team-result team-'+team+(won?' is-winner':' is-loser'))
				.append($('<span>').addClass('yut-team-result-piece'))
				.append($('<strong>').text((team===1?'분홍':'노랑')+' 팀'))
				.append($('<b>').text(won?'승리':'패배')));
		});
	}else $b.removeClass('yut-team-results');
	$(".result-me").css('opacity', 0);
	$data._coef = 0;
	if($data._result){
		addit = $data._result.reward.score - $data._result.reward._score;
		addp = $data._result.reward.money - $data._result.reward._money;
		
		$data._result._exp = $data._result.exp;
		$data._result._score = $data._result.reward.score;
		$data._result._bonus = addit;
		$data._result._boing = $data._result.reward._score;
		$data._result._addit = addit;
		$data._result._addp = addp;
		
		if(addit > 0){
			addit = "<label class='result-me-bonus'>(+" + commify(addit) + ")</label>";
		}else addit = "";
		if(addp > 0){
			addp = "<label class='result-me-bonus'>(+" + commify(addp) + ")</label>";
		}else addp = "";
		
		notice(L['scoreGain'] + ": " + commify($data._result.reward.score) + ", " + L['moneyGain'] + ": " + commify($data._result.reward.money));
		$(".result-me").css('opacity', 1);
		$(".result-me-score").html(L['scoreGain']+" +"+commify($data._result.reward.score)+addit);
		$(".result-me-money").text("핑: " + commify(($data.users[$data.id] || {}).money || 0));
	}
	renderMatchResultScene(result, data);
	renderRankResultSummary();
	function renderRankResultSummary(){
		var summary = $data._rankResultSummary;
		var $summary = $('#RankResultSummary');
		if(!summary){
			$summary.addClass('is-hidden');
			return;
		}
		$('#RankResultDelta').text('승급 점수 ' + (summary.delta >= 0 ? '+' : '') + commify(summary.delta) + ' RP');
		$('#RankResultRating').text('현재 점수 ' + commify(summary.rating) + ' RP');
		$summary.removeClass('is-hidden');
	}
	function roundEndAnimation(first){
		var v, nl;
		var going;
		
		$data._result.goal = EXP[$data._result.level - 1];
		$data._result.before = EXP[$data._result.level - 2] || 0;
		/*if(first){
			$data._result._before = $data._result.before;
		}*/
		if($data._result.reward.score > 0){
			v = $data._result.reward.score * $data._coef;
			if(v < 0.05 && $data._coef) v = $data._result.reward.score;
			
			$data._result.reward.score -= v;
			$data._result.exp += v;
			nl = getLevel($data._result.exp);
			if($data._result.level != nl){
				$data._result._boing -= $data._result.goal - $data._result._exp;
				$data._result._exp = $data._result.goal;
				playSound('lvup');
			}
			$data._result.level = nl;
			
			addTimeout(roundEndAnimation, 50);
		}
		going = $data._result.exp - $data._result._exp;
		draw('before', $data._result._exp, $data._result.before, $data._result.goal);
		draw('current', Math.min(going, $data._result._boing), 0, $data._result.goal - $data._result.before);
		draw('bonus', Math.max(0, going - $data._result._boing), 0, $data._result.goal - $data._result.before);
		
		$(".result-me-level-body").html($data._result.level);
		var progress = Math.max(0, Math.round($data._result.exp - $data._result.before));
        var needed = Math.max(1, $data._result.goal - $data._result.before);
        $(".result-me-score-text").text(commify(progress) + " / " + commify(needed));
        $(".result-me-gauge").attr({role:'progressbar', 'aria-label':'다음 레벨까지 경험치', 'aria-valuemin':0, 'aria-valuemax':needed, 'aria-valuenow':Math.min(progress,needed)});
	}
	function draw(phase, val, before, goal){
		$(".result-me-" + phase + "-bar").width((val - before) / (goal - before) * 100 + "%");
	}
	function explainReward(orgX, orgM, list){
		var $sb, $mb;
		var $R = $("<div>")
			.append($("<h4>").html(L['scoreGain']))
			.append($sb = $("<div>"))
			.append($("<h4>").html(L['moneyGain']))
			.append($mb = $("<div>"));
		
		row($sb, L['scoreOrigin'], orgX);
		row($mb, L['moneyOrigin'], orgM);
		list.forEach(function(item){
			var from = item.charAt(0);
			var type = item.charAt(1);
			var target = item.slice(2, 5);
			var value = Number(item.slice(5));
			var $t, vtx, org;
			
			if(target == 'EXP') $t = $sb, org = orgX;
			else if(target == 'MNY') $t = $mb, org = orgM;
			
			if(type == 'g') vtx = "+" + (org * value).toFixed(1);
			else if(type == 'h') vtx = "+" + Math.floor(value);
			
			row($t, L['bonusFrom_' + from], vtx);
		});
		function row($t, h, b){
			$t.append($("<h5>").addClass("result-me-blog-head").html(h))
				.append($("<h5>").addClass("result-me-blog-body").html(b));
		}
		return $R;
	}
	addTimeout(function(){
		showDialog($stage.dialog.result);
		if($data._result) roundEndAnimation(true);
		$stage.dialog.result.css('opacity', 0).animate({ opacity: 1 }, 500);
		addTimeout(function(){
			$data._coef = 0.05;
		}, 500);
	}, 2000);
	stopRecord();
}
function drawRanking(ranks){
 $('#ResultDiag').removeClass('match-result-screen').find('.match-result-scene').remove();
	var $b = $(".result-board").empty();
	var $o, $v;
	var me;
	
	$data._resultPage = 2;
	if(!ranks) return $stage.dialog.resultOK.trigger('click');
	for(i in ranks.list){
		r = ranks.list[i];
		o = $data.users[r.id] || {
			profile: { title: L['hidden'] }
		};
		me = r.id == $data.id;
		
		$b.append($o = $("<div>").addClass("result-board-item")
			.append($("<div>").addClass("result-board-rank").html(r.rank + 1))
			.append(getLevelImage(r.score).addClass("result-board-level"))
			.append($("<div>").addClass("result-board-name").html(o.profile.title || o.profile.name))
			.append($("<div>").addClass("result-board-score").html(commify(r.score) + L['PTS']))
			.append($("<div>").addClass("result-board-reward").html(""))
			.append($v = $("<div>").addClass("result-board-lvup").css('display', me ? "block" : "none")
				.append($("<i>").addClass("fa fa-arrow-up"))
				.append($("<div>").html(ranks.prev - r.rank))
			)
		);
		
		if(me){
			if(ranks.prev - r.rank <= 0) $v.hide();
			$o.addClass("result-board-me");
		}
	}
}
function kickVoting(target){
	var op = $data.users[target].profile;
	
	$("#kick-vote-text").html((op.title || op.name) + L['kickVoteText']);
	$data.kickTime = 10;
	$data._kickTime = 10;
	$data._kickTimer = addTimeout(kickVoteTick, 1000);
	showDialog($stage.dialog.kickVote);
}
function kickVoteTick(){
	$(".kick-vote-time .graph-bar").width($data.kickTime / $data._kickTime * 300);
	if(--$data.kickTime > 0) $data._kickTimer = addTimeout(kickVoteTick, 1000);
	else $stage.dialog.kickVoteY.trigger('click');
}
function loadShop(){
	$('#ShopMaintenance').remove();
	$('#shop-shelf').show();
	var $body = $("#shop-shelf");
	var $welcome=$body.find('.shop-welcome').detach();
	var $fontCard=$body.find('.shop-font-card:not(.shop-item-card)').detach();
	$body.empty().append($welcome);
	var $list=$('<div class="shop-card-grid">').appendTo($body).append($fontCard);
	$body.append($('<div class="shop-status">').text(L['LOADING']));
	processShop(function(res){
		$body.find('.shop-status').remove();
		$list.find('.shop-item-card').remove();
		if(res.error){
			$('<div class="shop-status">상품을 불러오지 못했어요. <button type="button">다시 시도</button></div>')
				.appendTo($body).find('button').on('click',loadShop);
			return;
		}
		['chuseok_hanbok','chuseok_kite'].forEach(function(id){
			var item=$data.shop[id];
			if(!item || Number(item.cost)<0) return;
			var $card=$('<div class="shop-font-card shop-item-card">').appendTo($list);
			$('<div class="shop-item-preview">').append($('<img>').attr({src:iImage(false,item),alt:iName(id)})).appendTo($card);
			var $info=$('<div class="shop-font-info">').appendTo($card);
			$('<h3>').text(iName(id)).appendTo($info);
			$('<p>').text(iDesc(id)).appendTo($info);
			$('<strong>').text(commify(item.cost)+L['ping']).appendTo($info);
			$('<button type="button">').attr('id','goods_'+id).text('구매').appendTo($info).on('click',onGoods);
		});
	});
	$(".shop-type.selected").removeClass("selected");
	$("#shop-type-all").addClass("selected");
}
function filterShop(by){
	var isAll = by === true;
	var $o, obj;
	var i;
	
	if(!isAll) by = by.split(',');
	for(i in $data.shop){
		obj = $data.shop[i];
		if(obj.cost < 0) continue;
		$o = $("#goods_" + i).show();
		if(isAll) continue;
		if(by.indexOf(obj.group) == -1) $o.hide();
	}
}
function explainGoods(item, equipped, expire){
	var i;
	var $R = $("<div>").addClass("expl dress-expl")
		.append($("<div>").addClass("dress-item-title").html(iName(item._id) + (equipped ? L['equipped'] : "")))
		.append($("<div>").addClass("dress-item-group").html(L['GROUP_' + item.group]))
		.append($("<div>").addClass("dress-item-expl").html(iDesc(item._id)));
	var $opts = $("<div>").addClass("dress-item-opts");
	var txt;
	
	if(item.term) $R.append($("<div>").addClass("dress-item-term").html(Math.floor(item.term / 86400) + L['DATE'] + " " + L['ITEM_TERM']));
	if(expire) $R.append($("<div>").addClass("dress-item-term").html((new Date(expire * 1000)).toLocaleString() + L['ITEM_TERMED']));
	for(i in item.options){
		if(i == "gif") continue;
		var k = i.charAt(0);
		
		txt = item.options[i];
		if(k == 'g') txt = "+" + (txt * 100).toFixed(1) + "%p";
		else if(k == 'h') txt = "+" + txt;
		
		$opts.append($("<label>").addClass("item-opts-head").html(L['OPTS_' + i]))
			.append($("<label>").addClass("item-opts-body").html(txt))
			.append($("<br>"));
	}
	if(txt) $R.append($opts);
	return $R;
}
function processShop(callback){
	var i;
	function done(res){
		if(!res || !Array.isArray(res.goods)) return callback({error:500});
		$data.shop = {};
		for(i in res.goods){
			$data.shop[res.goods[i]._id] = res.goods[i];
		}
		if($data.users && $data.users[$data.id]) updateMe();
		if(callback) callback(res);
	}
	$.ajax({url:"/shop",dataType:"json",timeout:30000,cache:false}).done(done).fail(function(){callback({error:500});});
}
function onGoods(e){
	if($data.guest) return fail(423);
	var id = $(e.currentTarget).attr('id').slice(6);
	var $obj = $data.shop[id];
	var my = $data.users[$data.id];
	var ping = my.money;
	var after = ping - $obj.cost;
	var $oj;
	var spt = L['surePurchase'];
	var i, ceq = {};
	
	if($data.box) if($data.box[id]) spt = L['alreadyGot'] + " " + spt;
	showDialog($stage.dialog.purchase, true);
	$("#purchase-ping-before").html(commify(ping) + L['ping']);
	$("#purchase-ping-cost").html(commify($obj.cost) + L['ping']);
	$("#purchase-item-name").html(L[id][0]);
	$oj = $("#purchase-ping-after").html(commify(after) + L['ping']);
	$("#purchase-item-desc").html((after < 0) ? L['notEnoughMoney'] : spt);
	for(i in my.equip) ceq[i] = my.equip[i];
	ceq[($obj.group == "Mhand") ? [ "Mlhand", "Mrhand" ][Math.floor(Math.random() * 2)] : $obj.group] = id;
	
	renderMoremi("#moremi-after", ceq);
	
	$data._sgood = id;
	$stage.dialog.purchaseOK.attr('disabled', after < 0);
	if(after < 0){
		$oj.addClass("purchase-not-enough");
	}else{
		$oj.removeClass("purchase-not-enough");
	}
}
function vibrate(level){
	if(level < 1) return;
	
	$("#Middle").css('padding-top', level);
	addTimeout(function(){
		$("#Middle").css('padding-top', 0);
		addTimeout(vibrate, 50, level * 0.7);
	}, 50);
}
function getWordMeaningText(mean){
	if(typeof mean === "string" && /^Morae 낱말집/.test(mean)) return "";
	if(typeof mean == "string"){
		return mean
			.replace(/＂[0-9]+＂/g, "")
			.replace(/［[0-9]+］/g, "")
			.replace(/（[0-9]+）/g, "")
			.replace(/\$\$([^$]+)\$\$/g, "$1")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.trim();
	}
	if(Array.isArray(mean)) return mean.filter(function(item){ return typeof item == 'string'; }).join(' ').trim();
	if(mean && typeof mean == 'object') return String(mean.definition || mean.mean || mean.text || mean.explain || "").trim();
	if(typeof mean == 'number') return String(mean);
	return "";
}
function updateWordMeaning(text, mean, theme){
	var $panel = $("#WordMeaning");
	var definition = maskDefinitionProfanity(getWordMeaningText(mean));
	var requestId;

	if(!$panel.length) return;
	requestId = ($data._wordMeaningRequest || 0) + 1;
	$data._wordMeaningRequest = requestId;
	$panel.find(".word-meaning-source").remove();
	$panel.append($('<a>').addClass('word-meaning-source').attr({href:'/word-sources.html',target:'_blank',rel:'noopener noreferrer'}).text('뜻풀이 출처 · 국립국어원 표준국어대사전 / 우리말샘'));
	$panel.find(".word-meaning-word").text(text || "-");
	$panel.find(".word-meaning-definition").text(definition || (text ? "낱말 뜻을 불러오는 중입니다." : "낱말을 입력하면 뜻이 표시됩니다."));
	$panel.toggleClass("is-empty", !definition);

	// A room worker can be restarted between validation and the turn event.
	// In that case the event can arrive without `mean`; look it up once from
	// the dictionary route instead of leaving the meaning area blank.
	if(definition || !text) return;
	tryDict(String(text), function(res){
		var fetched;
		if($data._wordMeaningRequest !== requestId) return;
		fetched = res && !res.error ? maskDefinitionProfanity(getWordMeaningText(res.mean)) : "";
		$panel.find(".word-meaning-definition").text(fetched || "등록된 낱말 뜻이 없습니다.");
		$panel.toggleClass("is-empty", !fetched);
	});
}
function fitWordBoardHeight(){
	if(!$stage || !$stage.game || !$stage.game.display) return;
	var $display = $stage.game.display, $board = $('.GameBox .jjoDisplayBar'), $head = $('.GameBox .game-head');
	if(!$board.length || !$head.length) return;
	var displayEl = $display.get(0), boardEl = $board.get(0);
	var displayStyle = { 'white-space':'normal', 'overflow':'visible', 'text-overflow':'clip', 'word-break':'break-all', 'overflow-wrap':'anywhere', 'height':'auto', 'min-height':'23px' };
	Object.keys(displayStyle).forEach(function(key){ displayEl.style.setProperty(key, displayStyle[key], 'important'); });
	var boardHeight = Math.max(80, Math.ceil($display.outerHeight()) + 40);
	boardEl.style.setProperty('height', boardHeight + 'px', 'important');
	boardEl.style.setProperty('overflow', 'visible', 'important');
	var extra = Math.max(0, boardHeight - 80);
	$head.css({ height:(250 + extra) + 'px', 'min-height':(250 + extra) + 'px' });
	$('.GameBox .history-holder').css('top', (153 + extra) + 'px');
	$('.GameBox .hints').css('top', (201 + extra) + 'px');
}
function alignClosedEyes(){
	var frame = $('.GameBox .jjoriping').get(0);
	if(!frame) return;
	var frameRect = frame.getBoundingClientRect();
	var scaleX = frame.offsetWidth ? frameRect.width / frame.offsetWidth : 1;
	var scaleY = frame.offsetHeight ? frameRect.height / frame.offsetHeight : scaleX;
	function place(openSelector, closedSelector){
		var open = frame.querySelector(openSelector), closed = frame.querySelector(closedSelector);
		if(!open || !closed) return;
		var rect = open.getBoundingClientRect();
		closed.style.setProperty('left', ((rect.left - frameRect.left) / scaleX) + 'px', 'important');
		closed.style.setProperty('top', ((rect.top - frameRect.top) / scaleY) + 'px', 'important');
		closed.style.setProperty('width', (rect.width / scaleX) + 'px', 'important');
		closed.style.setProperty('height', (rect.height / scaleY) + 'px', 'important');
	}
	place('.jjoEyeL', '.jjoEyeClosedL');
	place('.jjoEyeR', '.jjoEyeClosedR');
}
function pushDisplay(text, mean, theme, wc, font){
 if(!$data.room) return;
 text = maskDefinitionProfanity(text);
	var len;
	var mode = MODE[$data.room.mode];
	var isKKT = mode == "KKT";
	var isRev = mode == "KAP";
	var beat = BEAT[len = text.length];
	var ta, kkt;
	var i, j = 0;
	var $l;
	var tick = $data.turnTime / 96;
	var sg = $data.turnTime / 12;
	
	alignClosedEyes();
	var $wordFrame = $('.GameBox .jjoriping');
	$wordFrame.removeClass('word-transition');
	if($wordFrame.length){ void $wordFrame.get(0).offsetWidth; $wordFrame.addClass('word-transition'); window.setTimeout(function(){ $wordFrame.removeClass('word-transition'); }, 1500); }
	$stage.game.display.empty().toggleClass('dunggeunmo-font', font === 'dunggeunmo');
	fitWordBoardHeight();
	updateWordMeaning(text, mean, theme);
	if(beat){
		ta = 'As' + $data._speed;
		beat = beat.split("");
	}else if(RULE[mode].lang == "en" && len < 10){
		ta = 'As' + $data._speed;
	}else{
		ta = 'Al';
		vibrate(len);
	}
	kkt = 'K'+$data._speed;
	
	if(beat){
		for(i in beat){
			if(beat[i] == "0") continue;
			
			$stage.game.display.append($l = $("<div>")
				.addClass("display-text")
				.css({ 'float': isRev ? "right" : "left", 'margin-top': -6, 'font-size': 36 })
				.hide()
				.html(isRev ? text.charAt(len - j - 1) : text.charAt(j))
			);
			j++;
			addTimeout(function($l, snd){
				var anim = { 'margin-top': 0 };
				
				playSound(snd);
				if($l.html() == $data.mission){
					playSound('mission');
					$l.css({ 'color': "#66FF66" });
					anim['font-size'] = 24;
				}else{
					anim['font-size'] = 20;
				}
				$l.show().animate(anim, 100);
			}, Number(i) * tick, $l, ta);
		}
		i = $stage.game.display.children("div").get(0);
		$(i).css(isRev ? 'margin-right' : 'margin-left', ($stage.game.display.width() - 20 * len) * 0.5);
	}else{
		j = "";
		if(isRev) for(i=0; i<len; i++){
			addTimeout(function(t){
				playSound(ta);
				if(t == $data.mission){
					playSound('mission');
					j = "<label style='color: #66FF66;'>" + t + "</label>" + j;
				}else{
					j = t + j;
				}
				$stage.game.display.html(j);
				fitWordBoardHeight();
			}, Number(i) * sg / len, text[len - i - 1]);
		}
		else for(i=0; i<len; i++){
			addTimeout(function(t){
				playSound(ta);
				if(t == $data.mission){
					playSound('mission');
					j += "<label style='color: #66FF66;'>" + t + "</label>";
				}else{
					j += t;
				}
				$stage.game.display.html(j);
				fitWordBoardHeight();
			}, Number(i) * sg / len, text[i]);
		}
	}
	addTimeout(function(){
		for(i=0; i<3; i++){
			addTimeout(function(v){
				if(isKKT){
					if(v == 1) return;
					else playSound('kung');
				}
				(beat ? $stage.game.display.children(".display-text") : $stage.game.display)
					.css('font-size', 21)
					.animate({ 'font-size': 20 }, tick);
			}, i * tick * 2, i);
		}
		addTimeout(pushHistory, tick * 4, text, mean, theme, wc);
		if(!isKKT) playSound(kkt);
	}, sg);
}
function pushHint(hint){
	var v = processWord("", hint);
	var $obj;
	
	$stage.game.hints.append(
		$obj = $("<div>").addClass("hint-item")
			.append($("<label>").html(v))
			.append($("<div>").addClass("expl").css({ 'white-space': "normal", 'width': 200 }).html(v.html()))
	);
	if(!mobile) $obj.width(0).animate({ width: 215 });
	global.expl($obj);
}
function pushHistory(text, mean, theme, wc){
	var $v, $w, $x;
	var wcs = wc ? wc.split(',') : [], wd = {};
	var val;
	
	$stage.game.history.prepend($v = $("<div>")
		.addClass("ellipse history-item")
		.width(0)
		.animate({ width: 200 })
		.html(text)
	);
	$w = $stage.game.history.children();
	// Keep all accepted words until the next round clears the board.
	val = processWord(text, mean, theme, wcs);
	/*val = mean;
	if(theme) val = "<label class='history-theme-c'>&lt;" + theme + "&gt;</label> " + val;*/
	
	wcs.forEach(function(item){
		if(wd[item]) return;
		if(!L['class_'+item]) return;
		wd[item] = true;
		$v.append($("<label>").addClass("history-class").html(L['class_'+item]));
	});
	$v.append($w = $("<div>").addClass("history-mean ellipse").append(val))
		.append($x = $("<div>").addClass("expl").css({ 'width': 200, 'white-space': "normal" })
			.html("<h5 style='color: #BBBBBB;'>" + val.html() + "</h5>")
		);
	global.expl($v);
}
function maskDefinitionProfanity(text){
	return String(text || "").replace(BAD, function(match){ return new Array(match.length + 1).join("#"); });
}
function processNormal(word, mean){
	return $("<label>").addClass("word").text(maskDefinitionProfanity(mean));
}
function processWord(word, _mean, _theme, _wcs){
	_mean = maskDefinitionProfanity(_mean);
	if(!_mean || _mean.indexOf("＂") == -1) return processNormal(word, _mean);
	var $R = $("<label>").addClass("word");
	var means = _mean.split(/＂[0-9]+＂/).slice(1).map(function(m1){
		return (m1.indexOf("［") == -1) ? [[ m1 ]] : m1.split(/［[0-9]+］/).slice(1).map(function(m2){
			return m2.split(/（[0-9]+）/).slice(1);
		});
	});
	var types = _wcs ? _wcs.map(function(_wc){
		return L['class_' + _wc];
	}) : [];
	var themes = _theme ? _theme.split(',').map(function(_t){
		return L['theme_' + _t];
	}) : [];
	var ms = means.length > 1;
	
	means.forEach(function(m1, x1){
		var $m1 = $("<label>").addClass("word-m1");
		var m1s = m1.length > 1;
		
		if(ms) $m1.append($("<label>").addClass("word-head word-m1-head").html(x1 + 1));
		m1.forEach(function(m2, x2){
			var $m2 = $("<label>").addClass("word-m2");
			var m2l = m2.length;
			var m2s = m2l > 1;
			var tl = themes.splice(0, m2l);
			
			if(m1s) $m2.append($("<label>").addClass("word-head word-m2-head").html(x2 + 1));
			m2.forEach(function(m3, x3){
				var $m3 = $("<label>").addClass("word-m3");
				var _t = tl.shift();
				
				if(m2s) $m3.append($("<label>").addClass("word-head word-m3-head").html(x3 + 1));
				if(_t) $m3.append($("<label>").addClass("word-theme").html(_t));
				$m3.append($("<label>").addClass("word-m3-body").html(formMean(m3)));
				
				$m2.append($m3);
			});
			$m1.append($m2);
		});
		$R.append($m1);
	});
	function formMean(v){
		return v.replace(/\$\$[^\$]+\$\$/g, function(item){
			var txt = item.slice(2, item.length - 2)
				.replace(/\^\{([^\}]+)\}/g, "<sup>$1</sup>")
				.replace(/_\{([^\}]+)\}/g, "<sub>$1</sub>")
				.replace(/\\geq/g, "≥")
			;
			
			return "<equ>" + txt + "</equ>";
		})
		.replace(/\*\*([^\*]+)\*\*/g, "<sup>$1</sup>")
		.replace(/\*([^\*]+)\*/g, "<sub>$1</sub>");
	}
	return $R;
}
function getCharText(char, subChar, wordLength){
	var res = char + (subChar ? ("("+subChar+")") : "");
	
	if(wordLength) res += "<label class='jjo-display-word-length'>(" + wordLength + ")</label>";
	
	return res;
}
function getRequiredScore(lv){
	return Math.round(
		(!(lv%5)*0.3 + 1) * (!(lv%15)*0.4 + 1) * (!(lv%45)*0.5 + 1) * (
			120 + Math.floor(lv/5)*60 + Math.floor(lv*lv/225)*120 + Math.floor(lv*lv/2025)*180
		)
	);
}
function getLevel(score){
	var i, l = EXP.length;
	
	for(i=0; i<l; i++) if(score < EXP[i]) break;
	return i+1;
}
function getLevelImage(score){
	var lv = getLevel(score) - 1;
	var lX = (lv % 25) * -100;
	var lY = Math.floor(lv * 0.04) * -100;
	
	// return getImage("/img/kkutu/lv/lv" + zeroPadding(lv+1, 4) + ".png");
	return $("<div>").css({
		'float': "left",
		'width': '20px',
		'height': '20px',
		'display': 'block',
		'flex': '0 0 20px',
		'background-image': "url('/img/kkutu/lv/newlv.png')",
		'background-position': lX + "% " + lY + "%",
		'background-size': "2560%"
	});
}
function getImage(url){
	return $("<div>").addClass("jt-image").css('background-image', safeImageBackground(url));
}
function getOptions(mode, opts, hash){
	var modeKey = MODE[mode] || mode || '';
	var modeNames = {EKT:'영어 끄투',ESH:'영어 끝말잇기',KKT:'한국어 쿵쿵따',KSH:'한국어 끝말잇기',KAW:'아무말잇기',KAL:'전체',CSQ:'자음퀴즈',KCW:'한국어 십자말풀이',KTY:'한국어 타자 대결',ETY:'영어 타자 대결',KAP:'한국어 앞말잇기',HUN:'훈민정음',KDA:'한국어 단어 대결',EDA:'영어 단어 대결',KSS:'한국어 솎솎',ESS:'영어 솎솎'};
	var R = [modeNames[modeKey] || (L && L['mode' + modeKey]) || '게임'];
	var i, k; opts = opts || {};
	var dictionaryLabels = {basic:'기본 낱말집',standard:'표준 낱말집',complex:'확장 낱말집'};
	for(i in OPTIONS){ k = OPTIONS[i].name.toLowerCase(); if(opts[k]) R.push((L && L['opt' + OPTIONS[i].name]) || OPTIONS[i].name); }
	if(["KSH","KKT","KAP","YUT"].indexOf(modeKey) != -1) R.push(dictionaryLabels[opts.dictionary] || dictionaryLabels.standard);
	if(hash && Array.isArray(opts.injpick) && opts.injpick.length) R.push(opts.injpick.join('|'));
	return hash ? R.toString() : R;
}
function setRoomHead($obj, room){
	var opts = getOptions(room.mode, room.opts).filter(function(v){return !!v;});
	var rule = RULE[MODE[room.mode] || room.mode] || {opts:[]};
	var $rm;
	
	$obj.empty()
		.append($("<h5>").addClass("room-head-number").html("["+(room.practice ? L['practice'] : room.id)+"]"))
		.append($("<h5>").addClass("room-head-title").text(badWords(room.title)))
		.append($rm = $("<h5>").addClass("room-head-mode").html(opts.join(" / ")))
		.append($("<h5>").addClass("room-head-limit").html((mobile ? "" : '플레이어 ') + (Array.isArray(room.players) ? room.players.length : 0) + ' / ' +(room.limit || 8) + '명'))
		.append($("<h5>").addClass("room-head-round").html((room.round || 1) + '라운드'))
		.append($("<h5>").addClass("room-head-time").html((room.time || 60) + '초'));
	$obj.addClass('branded-room-head');
	$obj.children('.room-head-number, .room-head-title').wrapAll('<div class="room-head-identity"></div>');
	$obj.children('h5').wrapAll('<div class="room-head-details"></div>');
	$obj.append($('<span>').addClass('room-head-brand').text('끄투게임즈코리아'));
 if($obj.closest('.RoomBox').length)$obj.prepend($('<div class="room-lobby-heading">').append($('<img>').attr({src:'/img/custom/chat-brand-white.png',alt:'끄투'})).append($('<strong>').text(badWords(room.title))));
		
	if(rule.opts.indexOf("ijp") != -1){
		$rm.append($("<div>").addClass("expl").html("<h5>" + room.opts.injpick.map(function(item){
			return L["theme_" + item];
		}) + "</h5>"));
		global.expl($obj);
	}
}
function loadSounds(list, callback){
	$data._lsRemain = list.length;
	setTimeout(function(){
		if($data._lsRemain > 0){
			$data._lsRemain = 0;
			if(callback) callback();
		}
	}, 5000);
	
	list.forEach(function(v){
		getAudio(v.key, v.value, callback);
	});
}
function getAudio(k, url, cb){
	var req = new XMLHttpRequest();
	var settled = false;
	var decodeTimer;
	
	req.open("GET", /*($data.PUBLIC ? "http://jjo.kr" : "") +*/ url);
	req.responseType = "arraybuffer";
	req.timeout = 12000;
	req.onload = function(e){
		if(e.target.status < 200 || e.target.status >= 300 || !e.target.response){
			onErr();
			return;
		}
		if(audioContext){
			decodeTimer = setTimeout(onErr, 6000);
			audioContext.decodeAudioData(e.target.response, function(buf){
			if(settled) return;
			clearTimeout(decodeTimer);
			settled = true;
			setSound(buf);
			done();
			}, onErr);
		}else onErr();
	};
	req.onerror = onErr;
	req.ontimeout = onErr;
	function onErr(err){
		if(settled) return;
		clearTimeout(decodeTimer);
		settled = true;
		setSound(new AudioSound(url));
		done();
	}
	function setSound(sound){
		$sound[k] = sound;
		if($data._pendingBGM == k && !$data.muteBGM){
			_setTimeout(function(){
				if($data._pendingBGM == k && !$data.muteBGM) playBGM(k, true);
			}, 0);
		}
	}
	function done(){
		if($data._lsRemain <= 0) return;
		if(--$data._lsRemain == 0){
			if(cb) cb();
		}else loading(L['loadRemain'] + $data._lsRemain);
	}
	function AudioSound(url){
		var my = this;
		
		this.audio = new Audio(url);
		this.audio.load();
		this.start = function(){
			return my.audio.play();
		};
		this.stop = function(){
			my.audio.currentTime = 0;
			my.audio.pause();
		};
	}
	req.send();
}
function playBGM(key, force){
	var chuseokTheme = document.documentElement.getAttribute('data-site-theme') === 'chuseok';
	if(chuseokTheme) key = 'lobbyChuseok';
	else if((key === 'lobby' || key === 'lobbyAutumn') && ($data.room && $data.room.gaming || $('body').attr('data-game-view') === 'for-gaming')) return;
	delete $data._pendingBGM;
	if(key == 'lobby' && $data.opts && $data.opts.lb == 'autumn') key = 'lobbyAutumn';
	if($data.bgm && $data.bgm.key == key && !$data.bgm.audio) return $data.bgm;
	if($data.bgm && $data.bgm.key == key && $data.bgm.audio && !$data.bgm.audio.paused) return $data.bgm;
	if($data.bgm) $data.bgm.stop();
	
	$data.bgm = playSound(key, true);
	if(!$data.bgm) $data._pendingBGM = key;
	return $data.bgm;
}
function stopBGM(){ delete $data._pendingBGM;
	if(document.documentElement.getAttribute('data-site-theme') === 'chuseok' && !$data.muteBGM && $data.bgm && $data.bgm.key === 'lobbyChuseok') return;
	if($data.bgm){
		$data.bgm.stop();
		delete $data.bgm;
	}
}
function playSound(key, loop){
	var src, sound, gain, volume = getSoundVolume(loop);
	
	sound = $sound[key];
	if(!sound){
		if(loop) $data._pendingBGM = key;
		return null;
	}
	if(audioContext && window.hasOwnProperty("AudioBuffer") && sound instanceof AudioBuffer){
		src = audioContext.createBufferSource();
		src.startedAt = audioContext.currentTime;
		src.loop = loop || false;
		src.buffer = sound;
		if(audioContext.createGain){
			gain = audioContext.createGain();
			gain.gain.value = volume;
			src.connect(gain);
			gain.connect(audioContext.destination);
			src._gainNode = gain;
		}else src.connect(audioContext.destination);
	}else{
		if(sound.readyState) sound.audio.currentTime = 0;
		sound.audio.loop = loop || false;
		sound.audio.volume = volume;
		src = sound;
	}
	if($_sound[key] && $_sound[key].stop) $_sound[key].stop();
	$_sound[key] = src;
	if(!src || !src.start) return null;
	src.key = key;
	src._loop = loop || false;
	setSoundVolume(src, src._loop);
	try{
		if(audioContext && audioContext.state == "suspended") audioContext.resume && audioContext.resume();
		var playResult = src.start();
		if(loop) delete $data._pendingBGM;
		if(playResult && playResult.catch) playResult.catch(function(){
			if(loop) $data._pendingBGM = key;
		});
	}catch(e){
		if(loop) $data._pendingBGM = key;
	}
	/*if(sound.readyState) sound.currentTime = 0;
	sound.loop = loop || false;
	sound.volume = ((loop && $data.muteBGM) || (!loop && $data.muteEff)) ? 0 : 1;
	sound.play();*/
	
	return src;
}
function stopAllSounds(){
    // Full teardown must also clear a theme BGM retained by stopBGM().
    // Otherwise playBGM mistakes the stopped Web Audio source for a live loop.
    var sounds = [], key;
    if($data.bgm) sounds.push($data.bgm);
    delete $data.bgm;
    delete $data._pendingBGM;
    for(key in $_sound){
        if($_sound[key] && sounds.indexOf($_sound[key]) === -1) sounds.push($_sound[key]);
        delete $_sound[key];
    }
    sounds.forEach(function(sound){
        try{ if(sound.stop) sound.stop(); }catch(_){ /* An ended source is already silent. */ }
    });
}
function tryJoin(id){
	var pw;
	
	if(!$data.rooms[id]) return;
	if($data.rooms[id].password){
		pw = prompt(L['putPassword']);
		if(!pw) return;
	}
	$data._pw = pw;
	send('enter', { id: id, password: pw });
}
function saveRefreshRoom(id){
	try{
		sessionStorage.setItem("kkutu-refresh-room", id);
	}catch(ex){}
}
function getRefreshRoom(){
	try{
		var id = sessionStorage.getItem("kkutu-refresh-room");
		return id === null ? undefined : id;
	}catch(ex){
		return undefined;
	}
}
function clearRefreshRoom(){
	try{
		sessionStorage.removeItem("kkutu-refresh-room");
	}catch(ex){}
}
function clearChat(){
	$("#Chat").empty();
}
function forkChat(){
	var $cs = $("#Chat,#chat-log-board");
	var lh = $cs.children(".chat-item").last().get(0);
	
	if(lh) if(lh.tagName == "HR") return;
	$cs.append($("<hr>").addClass("chat-item"));
	$stage.chat.scrollTop(999999999);
}
function badWords(text){
	return text.replace(BAD, "♥♥");
}
function chatBalloon(text, id, flag){
	$("#cb-" + id).remove();
	var offset = ((flag & 2) ? $("#game-user-" + id) : $("#room-user-" + id)).offset();
	var img = (flag == 2) ? "chat-balloon-bot" : "chat-balloon-tip";
	var $obj = $("<div>").addClass("chat-balloon")
		.attr('id', "cb-" + id)
		.append($("<div>").addClass("jt-image " + img))
		[(flag == 2) ? 'prepend' : 'append']($("<h4>").text(text));
	var ot, ol;
	
	if(!offset) return;
	$stage.balloons.append($obj);
	if(flag == 1) ot = 0, ol = 220;
	else if(flag == 2) ot = 35 - $obj.height(), ol = -2;
	else if(flag == 3) ot = 5, ol = 210;
	else ot = 40, ol = 110;
	$obj.css({ top: offset.top + ot, left: offset.left + ol });
	addTimeout(function(){
		$obj.animate({ 'opacity': 0 }, 500, function(){ $obj.remove(); });
	}, 2500);
}
function chat(profile, msg, from, timestamp, scope, reportId, authorId){
	var time = timestamp ? new Date(timestamp) : new Date();
	var equip = $data.users[profile.id] ? $data.users[profile.id].equip : {};
	var $bar, $msg, $item;
	var link;
	
	if($data._shut[profile.title || profile.name]) return;
	if(from){
		if($data.opts.dw) return;
		if($data._wblock[from]) return;
	}
	msg = badWords(msg);
	playSound('k');
	stackChat();
	if(!mobile && $data.room){
		$bar = ($data.room.gaming ? 2 : 0) + ($(".jjoriping").hasClass("cw") ? 1 : 0);
		chatBalloon(msg, profile.id, $bar);
	}
	scope = scope || ($data.room ? "room" : "main");
	if(window.markChatUnread) markChatUnread(scope);
	if(!from && window.showMentionNotice) showMentionNotice(profile,msg,scope,authorId);
	$stage.chat.append($item = $("<div>").addClass("chat-item").attr("data-chat-scope", scope)
		.append($bar = $("<div>").addClass("chat-head ellipse").text(profile.title || profile.name))
		.append($msg = $("<div>").addClass("chat-body").text(msg))
		.append($("<div>").addClass("chat-stamp").text(time.toLocaleTimeString()))
	);
	authorId = authorId || profile.id;
	if(reportId && authorId){
		$item.append($("<button type='button'>").addClass('chat-report-button').text('신고').on('click',function(e){
			e.stopPropagation();
			if(!confirm('이 채팅을 운영자에게 신고하시겠습니까?')) return;
			send('chatReport',{reportId:reportId},scope==='main');
			$(this).prop('disabled',true).text('신고됨');
		}));
	}
	addDeveloperBadge($bar, profile);
	if(timestamp) $bar.prepend($("<i>").addClass("fa fa-video-camera"));
	$bar.on('click', function(e){
		requestProfile(profile.id);
	});
	$stage.chatLog.append($item = $item.clone(true));
	$item.append($("<div>").addClass("expl").css('font-weight', "normal").html("#" + (profile.id || "").substr(0, 5)));
	
	if(link = msg.match(/https?:\/\/[\w\.\?\/&#%=-_\+]+/g)){
		msg = $msg.html();
		link.forEach(function(item){
			msg = msg.replace(item, "<a href='#' style='color: #2222FF;' onclick='if(confirm(\"" + L['linkWarning'] + "\")) window.open(\"" + item + "\");'>" + item + "</a>");
		});
		$msg.html(msg);
	}
	if(from){
		if(from !== true) $data._recentFrom = from;
		$msg.html("<label style='color: #7777FF; font-weight: bold;'>&lt;" + L['whisper'] + "&gt;</label>" + $msg.html());
	}
	addonNickname($bar, { equip: equip });
	$stage.chat.scrollTop(999999999);
}
function notice(msg, head){
 var scope = $data.room ? "room" : "main";
	var time = new Date();
	
	playSound('k');
	stackChat();
	$("#Chat,#chat-log-board").append($("<div>").addClass("chat-item chat-notice").attr("data-chat-scope", scope)
		.append($("<div>").addClass("chat-head").text(head || L['notice']))
		.append($("<div>").addClass("chat-body").html(msg))
		.append($("<div>").addClass("chat-stamp").text(time.toLocaleTimeString()))
	);
	$stage.chat.scrollTop(999999999);
	if(head == "tail") console.warn(time.toLocaleString(), msg);
}
function stackChat(){
	var $v = $("#Chat .chat-item");
	var $w = $("#chat-log-board .chat-item");
	
	if($v.length > 99){
		$v.first().remove();
	}
	if($w.length > 199){
		$w.first().remove();
	}
}
function iGoods(key){
	var obj;
	
	if(key.charAt() == "$"){
		obj = $data.shop[key.slice(0, 4)];
	}else{
		obj = $data.shop[key];
	}
	if(!obj || !obj.group || !obj.options || !L[key.charAt() == "$" ? key.slice(0, 4) : key]) return null;
	return {
		_id: key,
		group: obj.group,
		term: obj.term,
		name: iName(key),
		cost: obj.cost,
		image: iImage(key, obj),
		desc: iDesc(key),
		options: obj.options
	};
}
function iName(key){
	if(key.charAt() == "$") return L[key.slice(0, 4)][0] + ' - ' + key.slice(4);
	else return L[key][0];
}
function iDesc(key){
	if(key.charAt() == "$") return L[key.slice(0, 4)][1];
	else return L[key][1];
}
function safeImageBackground(url){
 if(typeof url !== 'string' || !url.trim() || /^(undefined|null)$/i.test(url)) return 'none';
 return 'url(' + JSON.stringify(url) + ')';
}
function iImage(key, sObj){
	if(key !== undefined && key !== null && key !== false) key = String(key);
	if(key && key.charAt(0) === '$') return iDynImage(key.slice(1, 4), key.slice(4));
	if(typeof sObj === 'string') sObj = { _id:key || 'def', group:sObj, options:{} };
	var obj = ($data.shop && key && $data.shop[key]) || sObj;
	var id = obj && obj._id || key || 'def';
	var group = obj && obj.group;
	var options = obj && obj.options || {};
	var gif = Object.prototype.hasOwnProperty.call(options,'gif') ? '.gif' : '.png';
	if(!group && /^b[1-4]_/.test(String(key || ''))) group = 'BDG';
	if(!group) return '/img/kkutu/shop/' + id + '.png';
	if(group.slice(0,3) === 'BDG') return '/img/kkutu/moremi/badge/' + id + gif;
	return group.charAt(0) === 'M'
		? '/img/kkutu/moremi/' + group.slice(1) + '/' + id + gif
		: '/img/kkutu/shop/' + id + '.png';
}
function iDynImage(group, data){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	var i;
	
	canvas.width = canvas.height = 50;
	ctx.font = "24px NBGothic";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	switch(group){
		case 'WPC':
		case 'WPB':
		case 'WPA':
			i = [ 'WPC', 'WPB', 'WPA' ].indexOf(group);
			ctx.beginPath();
			ctx.arc(25, 25, 25, 0, 2 * Math.PI);
			ctx.fillStyle = [ "#DDDDDD", "#A6C5FF", "#FFEF31" ][i];
			ctx.fill();
			ctx.fillStyle = [ "#000000", "#4465C3", "#E69D12" ][i];
			ctx.fillText(data, 25, 25);
			break;
		default:
	}
	return canvas.toDataURL();
}
function queueObtain(data){
	if($stage.dialog.obtain.is(':visible')){
		$data._obtain.push(data);
	}else{
		drawObtain(data);
		showDialog($stage.dialog.obtain, true);
	}
}
function drawObtain(data){
	playSound('success');
	$("#obtain-image").css('background-image', "url(" + iImage(data.key) + ")");
	$("#obtain-name").html(iName(data.key));
}
var MOREMI_BASE_IMAGE = "/img/custom/moremi-yellow.png?v=20260907-face-4";
var MOREMI_BLINK_IMAGE = "/img/custom/moremi-yellow-blink.png?v=20260907-face-4";
function addMoremiBlink($body){
 if(!$body.attr('data-moremi-base') || $body.next('.moremi-blink').length) return;
 $body.after($("<img>").addClass('moremies moremi-body moremi-blink')
  .attr({src: MOREMI_BLINK_IMAGE, alt: '', 'aria-hidden': 'true', draggable: 'false'}));
}
function renderMoremi(target, equip){
	var $obj = $(target).empty();
	var LR = { 'Mlhand': "Mhand", 'Mrhand': "Mhand" };
	var i, key;
	
	if(!equip) equip = {};
	for(i in MOREMI_PART){
		key = 'M' + MOREMI_PART[i];
		// The custom body already has a face; empty legacy layers are placeholders.
		if(!equip[key]) continue;
		
		$obj.append($("<img>")
			.addClass("moremies moremi-" + key.slice(1))
			.toggleClass('moremi-chuseok-hanbok',equip[key]==='chuseok_hanbok')
			.toggleClass('moremi-chuseok-kite',equip[key]==='chuseok_kite')
			.attr('src', iImage(equip[key], LR[key] || key))
			.css({ 'width': "100%", 'height': "100%" })
		);
	}
	if(key = equip['BDG']){
		$obj.append($("<img>")
			.addClass("moremies moremi-badge")
			.attr('src', iImage(key))
			.css({ 'width': "100%", 'height': "100%" })
		);
	}
	var bodyImage = equip.robot ? "/img/kkutu/moremi/robot.png?v=20260906-mascot-2" : MOREMI_BASE_IMAGE;
	var $body = $("<img>").addClass("moremies moremi-body")
		.attr({src: bodyImage, alt: equip.robot ? '끄투 봇' : '모레미'})
		.attr('data-moremi-base', equip.robot ? null : bodyImage)
		.css({ 'width': "100%", 'height': "100%" })
	;
	var $back = $obj.children(".moremi-back");
	if($back.length) $back.after($body);
	else $obj.prepend($body);
	$obj.children(".moremi-rhand").css('transform', "scaleX(-1)");
	addMoremiBlink($body);
}
$(function(){ $('.moremi-body[data-moremi-base]').each(function(){ addMoremiBlink($(this)); }); });
function commify(val){
	var tester = /(^[+-]?\d+)(\d{3})/;
	
	if(val === null) return "?";
	
	val = val.toString();
	while(tester.test(val)) val = val.replace(tester, "$1,$2");
	
	return val;
}
function setLocation(place){
	var locale = (document.cookie.match(/(?:^|;\s*)lc=([^;]+)/) || [])[1] || 'ko_KR';
	if(/^(?:ko_KR|en_US|zh_CN|ko_KP)$/.test(locale)) location.hash = "#" + locale;
	else if(place) location.hash = "#"+place;
	else location.hash = "";
}
function fail(code){
	return alert(L['error_' + code]);
}
function yell(msg){
	$stage.yell.show().css('opacity', 1).html(msg);
	addTimeout(function(){
		$stage.yell.animate({ 'opacity': 0 }, 3000);
		addTimeout(function(){
			$stage.yell.hide();
		}, 3000);
	}, 1000);
}

function showSocialRequest(kind, data){
 var friend=kind==='friend', profile=($data.users[data.from] || {}).profile || {};
 var name=friend ? (profile.title || profile.name || data.from) : (data.inviterName || '플레이어');
 function respond(ok){if(!friend && ok && $data.room){$data.pendingInvite=data.from;send('leave');return;}send(friend ? 'friendAddRes' : 'inviteRes',{from:data.from,res:ok},true);}
 if($data.opts[friend?'df':'di']){respond(false);return;}
 var gaming=$('body').attr('data-game-view')==='for-gaming';
 var card=$('<div class="social-request" role="status">');
 $('<strong>').text(name+'님에게서 '+(friend?'친구 추가 요청':'방 초대')+'이 왔습니다.').appendTo(card);
 var buttons=$('<div>').appendTo(card),answered=false;
 ['수락','거절'].forEach(function(label,index){$('<button type="button">').text(label).appendTo(buttons).on('click',function(){if(answered)return;answered=true;respond(index===0);card.remove();});});
 if(gaming){card.addClass('social-request-chat').appendTo($stage.chat);$stage.chat.scrollTop(999999999);}
 else {var host=$('#SocialRequests');if(!host.length)host=$('<div id="SocialRequests">').appendTo(document.body);card.appendTo(host);}
}

/* Private friend windows live outside game panels so room transitions do not close them. */
$(function(){
 var active=null,records={},oldest=null,hasMore=false,busy=false,historyBusy=false,seen={},friends=[],lastPoll=0,unreadByPeer={};
 var community=$('<section id="FriendsCommunity" class="friend-window" hidden><header class="friend-window-head"><img src="/img/custom/chat-brand-white.png" alt="끄투"><h2>친구/커뮤니티</h2><button class="friend-close" aria-label="친구 목록 닫기">×</button></header><div class="friend-list"></div><footer><button class="friend-add">친구 추가</button></footer></section>').appendTo('body');
 var dm=$('<section id="FriendConversation" class="friend-window" hidden><header class="friend-window-head"><img src="/img/custom/chat-brand-white.png" alt="끄투"><div><h2></h2><p>대화는 친구를 삭제하기 전까지 저장됩니다.</p></div><button class="friend-close" aria-label="친구 채팅 닫기">×</button></header><button class="friend-older" hidden>이전 대화 보기</button><div class="friend-messages" role="log" aria-live="polite"></div><p class="friend-error" role="status"></p><form><input maxlength="200" placeholder="채팅 입력" aria-label="친구에게 보낼 메시지"><button type="submit">전송</button></form></section>').appendTo('body');
 var alerts=$('<div id="FriendAlerts" aria-live="polite"></div>').appendTo('body');
 var launcher=$('<button id="FriendLauncher" type="button" title="친구 목록"><img src="/img/custom/friends-icon.svg" alt=""><span>친구</span><b class="friend-launcher-unread" hidden></b></button>').appendTo('body');
 var loginLauncher=$('<button id="GuestLoginLauncher" type="button">로그인</button>').hide().appendTo('body').on('click',function(){if(window.KkutuAccount)window.KkutuAccount.login();else location.href='/?account=login';});
 var levelRanking=$('<section id="LevelRankingPanel" hidden><header><h2>레벨 랭킹</h2><button type="button" aria-label="랭킹 닫기">×</button></header><p class="level-ranking-status">현재 레벨이 높은 순서로 불러오는 중입니다.</p><div class="level-ranking-list"></div></section>').appendTo('body');
 var levelRankingButton=$('<button id="LevelRankingBtn" class="for-lobby" type="button" aria-label="레벨 랭킹"><img src="/img/custom/ranking-icon.svg" alt=""><strong class="level-ranking-button-label">랭킹</strong></button>').hide().appendTo('.kkutu-menu');
 function api(path,data){return $.ajax({url:'/api/friend-chat/'+path,method:data?'POST':'GET',contentType:data?'application/json':undefined,data:data?JSON.stringify(data):undefined,headers:{'X-Requested-With':'XMLHttpRequest'}});}
 function error(e){return e.responseJSON&&e.responseJSON.error||'연결을 확인하고 다시 시도해 주세요.';}
 function display(panel){panel.appendTo('body').prop('hidden',false);keepOnScreen(panel);}
 function keepOnScreen(panel){if(panel.prop('hidden'))return;var r=panel[0].getBoundingClientRect();panel.css({left:Math.max(8,Math.min(r.left,innerWidth-r.width-8)),top:Math.max(8,Math.min(r.top,innerHeight-r.height-8))});}
 function movable(panel,key){var saved;try{saved=JSON.parse(localStorage.getItem(key));}catch(e){}panel.css(saved||{left:Math.max(8,(innerWidth-440)/2),top:Math.max(12,(innerHeight-500)/2)});
  panel.find('header').on('pointerdown',function(ev){if($(ev.target).closest('button').length)return;var e=ev.originalEvent||ev,r=panel[0].getBoundingClientRect(),x=e.clientX,y=e.clientY;e.preventDefault();this.setPointerCapture(e.pointerId);$(window).on('pointermove.friendDrag',function(ev){var m=ev.originalEvent||ev;panel.css({left:Math.max(8,Math.min(innerWidth-r.width-8,r.left+m.clientX-x)),top:Math.max(8,Math.min(innerHeight-r.height-8,r.top+m.clientY-y))});}).one('pointerup.friendDrag pointercancel.friendDrag',function(){$(window).off('.friendDrag');try{localStorage.setItem(key,JSON.stringify({left:parseFloat(panel.css('left')),top:parseFloat(panel.css('top'))}));}catch(e){}});});
  panel.find('.friend-close').on('click',function(){panel.prop('hidden',true);});
 }
 movable(community,'kkutu-friends-position');movable(dm,'kkutu-dm-position');$(window).on('resize',function(){keepOnScreen(community);keepOnScreen(dm);});
 function name(id){var f=friends.filter(function(f){return f.id===id;})[0];return f?f.name:($data.friends||{})[id]||'친구';}
 function renderFriends(){var list=community.find('.friend-list').empty();if(!friends.length)list.append($('<p>').text('등록된 친구가 없습니다. 프로필에서 친구를 추가해 주세요.'));friends.forEach(function(f){var row=$('<div class="friend-row">').appendTo(list);var identity=$('<div class="friend-identity">').appendTo(row);$('<strong>').text(f.name).appendTo(identity);var status=($data._friends||{})[f.id],online=!!($data.users||{})[f.id]||!!(status&&status.server!==false&&status.server!=null);$('<span class="friend-online">').toggleClass('is-online',online).text(online?'온라인':'오프라인').appendTo(identity);$('<button class="friend-open">').text('채팅').appendTo(row).on('click',function(){open(f.id);});$('<button class="friend-delete">').text('삭제').appendTo(row).on('click',function(){if(!confirm(f.name+'님을 친구에서 삭제할까요? 두 사람의 대화 기록도 삭제됩니다.'))return;send('friendRemove',{id:f.id},true);if(active===f.id){active=null;records={};dm.find('.friend-messages').empty();dm.prop('hidden',true);}alerts.children().filter(function(){return $(this).attr('data-peer')===f.id;}).remove();row.remove();setTimeout(poll,500);});});}
 window.openFriendCommunity=function(){if($data.guest)return fail(451);display(community);poll();};
 if($stage.menu.community)$stage.menu.community.empty().append($('<img>').attr({src:'/img/custom/friends-icon.svg',alt:''})).append($('<span>').text('친구')).attr('title','친구/커뮤니티').off('click').on('click',window.openFriendCommunity);launcher.on('click',window.openFriendCommunity);
 community.find('.friend-add').on('click',function(){$stage.dialog.commFriendAdd.trigger('click');});
 function markerKey(kind,id){return 'kkutu-friend-'+kind+':'+$data.id+':'+id;}
 function marker(kind,id){try{return localStorage.getItem(markerKey(kind,id))||'0';}catch(e){return '0';}}
 function newer(a,b){a=String(a);b=String(b);return a.length!==b.length?a.length>b.length:a>b;}
 function remember(kind,id,last){if(newer(last,marker(kind,id)))try{localStorage.setItem(markerKey(kind,id),String(last));}catch(e){}}
 function removeAlert(peer){alerts.children('[data-peer]').filter(function(){return $(this).attr('data-peer')===peer;}).remove();}
 function renderUnread(){var count=Object.keys(unreadByPeer).reduce(function(sum,id){return sum+(Number(unreadByPeer[id])||0);},0),badge=launcher.find('.friend-launcher-unread');badge.text(count>99?'99+':count).prop('hidden',count<1);}
 function markRead(peer,id){remember('read',peer,id);seen[peer]=id;unreadByPeer[peer]=0;renderUnread();removeAlert(peer);return api('read',{peer:peer,id:id}).fail(function(){dm.find('.friend-error').text('읽음 상태 저장을 다시 시도하고 있습니다.');});}
 function alertFriend(id,last){if(!newer(last,marker('read',id))||seen[id]===last)return;seen[id]=last;removeAlert(id);var card=$('<section class="friend-toast">').attr('data-peer',id).appendTo(alerts);$('<strong>').text(name(id)+'님에게 채팅이 왔어요').appendTo(card);$('<button class="friend-go">').text('채팅 하러 가기').appendTo(card).on('click',function(){markRead(id,last);open(id);});$('<button class="friend-dismiss">').text('닫기').appendTo(card).on('click',function(){markRead(id,last);});}
 function open(id){community.prop('hidden',true);if(active!==id){active=id;records={};oldest=null;hasMore=false;dm.find('.friend-messages').empty();}dm.find('h2').text(name(id)+' 채팅');dm.find('.friend-error').empty();display(dm);alerts.children().filter(function(){return $(this).attr('data-peer')===id;}).remove();load(false);dm.find('input').focus();}
 window.openFriendConversation=open;
 function paint(){var box=dm.find('.friend-messages'),node=box[0],atBottom=node.scrollHeight-node.scrollTop-node.clientHeight<50;var rows=Object.keys(records).sort(function(a,b){return Number(a)-Number(b);});box.empty();rows.forEach(function(id){var m=records[id],row=$('<div class="friend-message">').appendTo(box);var content=$('<div>').appendTo(row);$('<b>').text(m.sender===$data.id?'나':m.sender_name).appendTo(content);content.append(document.createTextNode(': '+m.body));$('<time>').text(new Date(Number(m.created_at)).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})).appendTo(row);$('<button>').text('신고').appendTo(row).on('click',function(){var button=$(this);if(!confirm('이 메시지를 운영자에게 신고할까요?'))return;api('report',{id:m.id}).done(function(){button.prop('disabled',true).text('신고됨');}).fail(function(e){dm.find('.friend-error').text(error(e));});});});if(atBottom)node.scrollTop=node.scrollHeight;}
 function load(older){if(!active||dm.prop('hidden')||historyBusy)return;var peer=active;historyBusy=true;var box=dm.find('.friend-messages')[0],height=box.scrollHeight,scroll=box.scrollTop;api('history?peer='+encodeURIComponent(peer)+(older&&oldest?'&before='+oldest:'')).done(function(data){if(active!==peer)return;data.messages.forEach(function(m){records[m.id]=m;});if(older||oldest===null){hasMore=data.hasMore;oldest=data.messages.length?data.messages[0].id:oldest;}paint();if(older)box.scrollTop=scroll+box.scrollHeight-height;dm.find('.friend-older').prop('hidden',!hasMore);if(!dm.prop('hidden')&&!document.hidden){var ids=data.messages.filter(function(m){return m.sender===peer;}).map(function(m){return m.id;});if(ids.length)markRead(peer,ids[ids.length-1]);}}).fail(function(e){if(active!==peer)return;dm.find('.friend-error').text(error(e));if(e.status===403){records={};dm.find('.friend-messages').empty();}}).always(function(){historyBusy=false;});}
 dm.find('.friend-older').on('click',function(){load(true);});
 dm.find('input').on('keydown keyup keypress',function(e){e.stopPropagation();if(e.type==='keydown'&&e.key==='Enter'&&(e.isComposing||(e.originalEvent&&e.originalEvent.isComposing)))e.preventDefault();});
 dm.find('form').on('submit',function(e){e.preventDefault();if(busy||!active)return;var input=dm.find('input'),value=input.val().trim(),peer=active;if(!value)return;busy=true;dm.find('[type=submit]').prop('disabled',true);api('send',{peer:peer,value:value}).done(function(data){if(active!==peer)return;records[data.message.id]=data.message;input.val('');paint();dm.find('.friend-messages').scrollTop(9999999);dm.find('.friend-error').empty();}).fail(function(e){dm.find('.friend-error').text(error(e));}).always(function(){busy=false;dm.find('[type=submit]').prop('disabled',false);});});
 function isGuest(){var marker=$('#IS_GUEST').text().trim();if(marker==='false')return false;if(marker==='true')return true;return !$data.id||$data.guest===true;}
 function placeGuestLogin(){if(innerWidth>800){loginLauncher.css({top:'',right:''});return;}var ad=$('.game-ad-slot:visible').first(),top=70;if(ad.length){var rect=ad[0].getBoundingClientRect();top=Math.max(top,Math.round(rect.bottom+8));}loginLauncher.css({top:top+'px',right:'10px'});}
 function poll(){var guest=isGuest();launcher.toggle(!guest);loginLauncher.toggle(guest);if(guest){unreadByPeer={};renderUnread();return;}if(Date.now()-lastPoll<1000)return;lastPoll=Date.now();api('inbox').done(function(data){friends=data.friends;unreadByPeer={};renderFriends();if(active&&!friends.some(function(f){return f.id===active;})){active=null;records={};dm.find('.friend-messages').empty();dm.prop('hidden',true);}alerts.children('[data-peer]').each(function(){var id=$(this).attr('data-peer');if(!friends.some(function(f){return f.id===id;}))$(this).remove();});data.inbox.forEach(function(item){var read=marker('read',item.sender);if(!newer(item.last_id,read)){api('read',{peer:item.sender,id:read});removeAlert(item.sender);return;}unreadByPeer[item.sender]=Number(item.unread)||1;if(active===item.sender&&!dm.prop('hidden')&&!document.hidden)load(false);else alertFriend(item.sender,item.last_id);});renderUnread();if(active&&!dm.prop('hidden'))load(false);});}
 levelRanking.find('header button').on('click',function(){levelRanking.prop('hidden',true);});
 levelRankingButton.on('click',function(){levelRanking.prop('hidden',false);levelRanking.find('.level-ranking-status').text('현재 레벨이 높은 순서로 불러오는 중입니다.').show();levelRanking.find('.level-ranking-list').empty();$.getJSON('/api/level-ranking').done(function(data){var list=levelRanking.find('.level-ranking-list').empty();(data.list||[]).forEach(function(row){var nickname=String(row.nickname||'이름 없음');$('<div class="level-ranking-row">').append($('<strong class="level-ranking-position">').text(row.rank),$('<span class="level-ranking-name">').text(nickname),$('<b class="level-ranking-level">').text('Lv.'+row.level),$('<small class="level-ranking-score">').text(Number(row.score).toLocaleString()+' 경험치')).appendTo(list);});levelRanking.find('.level-ranking-status').text(list.children().length?'총 '+list.children().length+'명':'랭킹 기록이 없습니다.');}).fail(function(e){levelRanking.find('.level-ranking-status').text(error(e));});});
 setInterval(function(){var lobby=typeof getOnly==='function'&&getOnly()==='for-lobby';levelRankingButton.css('display',lobby?'inline-flex':'none');if(!lobby)levelRanking.prop('hidden',true);var guest=isGuest();launcher.toggle(!guest);loginLauncher.toggle(guest);if(guest)placeGuestLogin();},500);
 $(document).on('visibilitychange',function(){if(!document.hidden){load(false);poll();}});
 setInterval(poll,2500);poll();
 window.showMentionNotice=function(profile,text,scope,authorId){
  if(authorId===$data.id||profile.id===$data.id)return;var me=$data.users&&$data.users[$data.id];if(!me)return;
  if(scope==='room'&&(!$data.room||!($data.room.players||[]).some(function(p){return (typeof p==='string'?p:p.id)===$data.id;})))return;
  var n=me.profile&&(me.profile.title||me.profile.name);if(!n)return;var needle='@'+n,index=String(text).indexOf(needle),found=false;while(index>=0){var before=index?text.charAt(index-1):'',after=text.charAt(index+needle.length);if((!before||/\s/.test(before))&&(!after||/[\s.,!?~:;，。！？]/.test(after))){found=true;break;}index=text.indexOf(needle,index+1);}if(!found)return;
  var card=$('<section class="friend-toast mention-toast">').appendTo(alerts);$('<strong>').text((profile.title||profile.name||'플레이어')+'님이 멘션을 했어요').appendTo(card);$('<span class="mention-scope">').text(scope==='room'?'방채팅':'메인채팅').appendTo(card);$('<button class="friend-dismiss">').text('닫기').appendTo(card).on('click',function(){card.remove();});setTimeout(function(){card.remove();},10000);
 };
 var suggestions=$('<div id="MentionSuggestions" role="listbox" aria-label="멘션할 플레이어" hidden>').appendTo('body');
 $('#Talk')[0].addEventListener('keydown',function(e){if(suggestions.prop('hidden')||e.isComposing)return;var buttons=suggestions.children('button'),selected=buttons.index(buttons.filter('.selected'));if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();e.stopImmediatePropagation();selected=selected<0?(e.key==='ArrowDown'?0:buttons.length-1):(selected+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons.removeClass('selected').eq(selected).addClass('selected')[0].scrollIntoView({block:'nearest'});}else if(e.key==='Enter'&&buttons.length){e.preventDefault();e.stopImmediatePropagation();buttons.eq(selected<0?0:selected).trigger('pointerdown');}else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();suggestions.prop('hidden',true);}},true);
 $('#Talk').on('input.mention',function(){var input=this,pos=input.selectionStart||0,before=input.value.slice(0,pos),match=before.match(/(?:^|\s)@([^@\n]*)$/);suggestions.empty().prop('hidden',true);if(!match)return;var scope=$data.chatScope||'main',query=match[1].toLowerCase(),players=($data.room&&$data.room.players||[]).map(function(p){return typeof p==='string'?p:p.id;});Object.keys($data.users||{}).filter(function(id){return id!==$data.id&&!$data.users[id].robot&&(scope==='main'||players.indexOf(id)>=0);}).map(function(id){var u=$data.users[id];return{id:id,name:u.profile&&(u.profile.title||u.profile.name)};}).filter(function(u){return u.name&&u.name.toLowerCase().indexOf(query)>=0;}).slice(0,8).forEach(function(u){$('<button type="button" role="option">').text('@'+u.name).appendTo(suggestions).on('pointerdown',function(e){e.preventDefault();var start=pos-match[1].length-1;input.value=input.value.slice(0,start)+'@'+u.name+' '+input.value.slice(pos);input.focus();input.setSelectionRange(start+u.name.length+2,start+u.name.length+2);suggestions.prop('hidden',true);});});if(suggestions.children().length){var r=input.getBoundingClientRect();suggestions.css({left:r.left,bottom:innerHeight-r.top+4,width:Math.min(r.width,320)}).prop('hidden',false);}}).on('blur',function(){setTimeout(function(){suggestions.prop('hidden',true);},150);});
});

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
