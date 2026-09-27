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
	$('#SettingDiag .dialog-title').html('<span class="panel-brand-title"><img src="/img/custom/chat-brand-white.png" alt="끄투"><i></i><b>환경 설정</b></span>');
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
			$('body').removeClass('room-browser-open');
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
 var activeWordbooks=$('<aside id="ActiveWordbooks" aria-label="현재 적용된 낱말집"><strong>현재 적용된 낱말집</strong><span>대한민국 학교 사전</span></aside>').appendTo('body');
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
 try{var dockWidth=Number(localStorage.getItem(innerWidth<=800?'kkutu-mobile-social-width-v2':'kkutu-social-width'));if(dockWidth>=(innerWidth<=800?190:290))socialDock.get(0).style.setProperty('--social-width',Math.min(dockWidth,innerWidth>800?innerWidth-460:innerWidth-20)+'px');}catch(e){}
 socialDock.find('.social-dock-edge').on('pointerdown',function(ev){var e=ev.originalEvent||ev;e.preventDefault();var x=e.clientX,w=socialDock.get(0).getBoundingClientRect().width,min=innerWidth>800?290:190,max=innerWidth>800?innerWidth-460:innerWidth-20;this.setPointerCapture(e.pointerId);$('body').addClass('mobile-social-resizing');$(window).on('pointermove.socialDock',function(ev){var m=ev.originalEvent||ev;socialDock.get(0).style.setProperty('--social-width',Math.max(min,Math.min(max,w+x-m.clientX))+'px');window.fitVisitorNames();}).one('pointerup.socialDock pointercancel.socialDock',function(){$(window).off('.socialDock');$('body').removeClass('mobile-social-resizing');try{localStorage.setItem(innerWidth<=800?'kkutu-mobile-social-width-v2':'kkutu-social-width',socialDock.get(0).getBoundingClientRect().width);}catch(e){}});});
 $('<span class="social-mobile-height-edge" title="위아래로 드래그해 채팅창 높이 조절" aria-hidden="true"></span>').appendTo(socialDock).on('pointerdown',function(ev){
  var e=ev.originalEvent||ev;if(innerWidth>800)return;e.preventDefault();var y=e.clientY,h=socialDock.get(0).getBoundingClientRect().height;this.setPointerCapture(e.pointerId);
  $(window).on('pointermove.socialHeight',function(ev){var m=ev.originalEvent||ev;socialDock.get(0).style.setProperty('--mobile-chat-height',Math.max(180,Math.min(innerHeight-90,h+y-m.clientY))+'px');}).one('pointerup.socialHeight pointercancel.socialHeight',function(){$(window).off('.socialHeight');try{localStorage.setItem('kkutu-mobile-chat-height',socialDock.get(0).getBoundingClientRect().height);}catch(e){}});
 });
 try{var mobileHeight=Number(localStorage.getItem('kkutu-mobile-chat-height'));if(mobileHeight>=180)socialDock.get(0).style.setProperty('--mobile-chat-height',mobileHeight+'px');}catch(e){}
 var mobileChatEdge=$('<span class="mobile-chat-height-edge" title="위아래로 드래그해 채팅창 높이 조절"></span>').appendTo($stage.box.chat);
 try{var savedHeight=Number(localStorage.getItem('kkutu-mobile-room-chat-height'));if(savedHeight>=150)document.documentElement.style.setProperty('--mobile-room-chat-height',savedHeight+'px');}catch(e){}
 mobileChatEdge.on('pointerdown',function(ev){var e=ev.originalEvent||ev;if(innerWidth>800)return;e.preventDefault();var y=e.clientY,h=$stage.box.chat[0].getBoundingClientRect().height;this.setPointerCapture(e.pointerId);$(window).on('pointermove.mobileChatHeight',function(ev){var m=ev.originalEvent||ev;document.documentElement.style.setProperty('--mobile-room-chat-height',Math.max(150,Math.min(innerHeight-200,h+y-m.clientY))+'px');}).one('pointerup.mobileChatHeight pointercancel.mobileChatHeight',function(){$(window).off('.mobileChatHeight');try{localStorage.setItem('kkutu-mobile-room-chat-height',$stage.box.chat[0].getBoundingClientRect().height);}catch(e){}});});
 var mobileViewportHeight=innerHeight;
 function syncMobileGameKeyboard(){
  var vv=window.visualViewport,focused=document.activeElement&&document.activeElement.id==='game-input';
  if(innerWidth>800||!vv){$('body').removeClass('mobile-game-keyboard');return;}
  if(!focused)mobileViewportHeight=Math.max(mobileViewportHeight,innerHeight,vv.height);
  var opened=focused&&vv.height<mobileViewportHeight-100;
  document.documentElement.style.setProperty('--mobile-visual-height',Math.round(vv.height)+'px');
  document.documentElement.style.setProperty('--mobile-visual-top',Math.round(vv.offsetTop)+'px');
  $('body').toggleClass('mobile-game-keyboard',opened);
 }
 if(window.visualViewport)visualViewport.addEventListener('resize',syncMobileGameKeyboard);
 $('#game-input').on('focus.mobileKeyboard blur.mobileKeyboard',function(){setTimeout(syncMobileGameKeyboard,80);});
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
		$('body').toggleClass('room-browser-open', $data._roomListOpen);
		if($data._roomListOpen){
			$('.dialog').hide();
			$('#FriendsCommunity,#FriendConversation,#LevelRankingPanel').prop('hidden',true);
		}
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
			dictionary: window.getActiveWordbookDictionary ? window.getActiveWordbookDictionary() : "standard"
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
	(function initWordbookManager(){
		var catalog=[{id:'school-kr',name:'대한민국 학교 사전',dictionary:'standard'}],storageKey='kkutu-wordbooks-v1',activeKey='kkutu-active-wordbook-v1',added,activeId;
		if(!$('#wordbook-catalog-results').length)return;
		var detail=$('<section id="WordbookDetail" hidden><header><button class="wordbook-detail-back" type="button">‹</button><h2></h2><button class="wordbook-detail-close" type="button" aria-label="닫기">×</button></header><form><input type="search" placeholder="낱말 검색" maxlength="30"><button type="submit">검색</button></form><p class="wordbook-detail-status" role="status"></p><div class="wordbook-word-list" role="list"></div><footer><button class="wordbook-prev" type="button">이전</button><span></span><button class="wordbook-next" type="button">다음</button></footer></section>').appendTo('body'),detailPage=1,detailQuery='',detailBook=null;
		try{added=JSON.parse(localStorage.getItem(storageKey)||'["school-kr"]');}catch(e){added=['school-kr'];}
		if(!Array.isArray(added))added=['school-kr'];
		try{activeId=localStorage.getItem(activeKey)||'school-kr';}catch(e){activeId='school-kr';}
		if(added.indexOf(activeId)<0)activeId=added[0]||null;
		window.getActiveWordbookDictionary=function(){var book=catalog.find(function(item){return item.id===activeId;});return book ? book.dictionary : 'standard';};
		function save(){try{localStorage.setItem(storageKey,JSON.stringify(added));if(activeId)localStorage.setItem(activeKey,activeId);else localStorage.removeItem(activeKey);}catch(e){}$('#room-dictionary').val(window.getActiveWordbookDictionary());activeWordbooks.find('span').text(activeId==='school-kr'?'대한민국 학교 사전':'적용된 낱말집 없음');}
		function openDetail(book){detailBook=book;detailPage=1;detailQuery='';detail.find('h2').text(book.name);detail.find('input').val('');detail.prop('hidden',false);loadDetail();}
		function loadDetail(){if(!detailBook)return;detail.addClass('loading');detail.find('.wordbook-detail-status').text('낱말을 불러오는 중입니다.');$.getJSON('/api/wordbooks/'+encodeURIComponent(detailBook.id)+'/words',{page:detailPage,q:detailQuery}).done(function(data){var list=detail.find('.wordbook-word-list').empty();(data.words||[]).forEach(function(item){var row=$('<div class="wordbook-word" role="listitem">').appendTo(list);$('<strong>').text(item.word).appendTo(row);if(item.mean)$('<p>').text(item.mean).appendTo(row);});detail.find('.wordbook-detail-status').text(list.children().length?'한 페이지에 '+data.pageSize+'개씩 표시합니다.':'검색된 낱말이 없습니다.');detail.find('footer span').text(data.page+'페이지');detail.find('.wordbook-prev').prop('disabled',data.page<=1);detail.find('.wordbook-next').prop('disabled',!data.hasMore);}).fail(function(xhr){detail.find('.wordbook-word-list').empty();detail.find('.wordbook-detail-status').text(xhr.responseJSON&&xhr.responseJSON.error||'낱말을 불러오지 못했습니다.');}).always(function(){detail.removeClass('loading');});}
		function makeRow(book,buttonText,handler,disabled){var row=$('<div class="wordbook-row" role="listitem">').append($('<strong>').text(book.name)),actions=$('<div class="wordbook-row-actions">').appendTo(row);$('<button class="wordbook-detail-button" type="button">').text('자세히 보기').appendTo(actions).on('click',function(){openDetail(book);});$('<button type="button">').text(buttonText).prop('disabled',!!disabled).appendTo(actions).on('click',handler);return row;}
		function matches(book,query){query=String(query||'').trim().toLowerCase();return !query||book.name.toLowerCase().indexOf(query)>=0;}
		function applyBook(book){if(added.indexOf(book.id)<0)added.push(book.id);activeId=book.id;save();renderCatalog();renderAdded();}
		function renderCatalog(){var query=$('#wordbook-catalog-query').val(),box=$('#wordbook-catalog-results').empty(),found=catalog.filter(function(book){return matches(book,query);});if(!found.length)return box.append($('<p class="wordbook-empty">').text('검색된 낱말집이 없습니다.'));found.forEach(function(book){var exists=added.indexOf(book.id)>=0,isActive=activeId===book.id;box.append(makeRow(book,isActive?'적용됨':(exists?'적용':'추가'),function(){applyBook(book);},isActive));});}
		function renderAdded(){var query=$('#wordbook-added-query').val(),box=$('#wordbook-added-list').empty(),found=catalog.filter(function(book){return added.indexOf(book.id)>=0&&matches(book,query);});if(!found.length)return box.append($('<p class="wordbook-empty">').text('추가된 낱말집이 없습니다.'));found.forEach(function(book){var row=makeRow(book,activeId===book.id?'적용됨':'적용',function(){applyBook(book);},activeId===book.id);$('<button class="wordbook-delete-button" type="button">삭제</button>').appendTo(row.find('.wordbook-row-actions')).on('click',function(){added=added.filter(function(id){return id!==book.id;});if(activeId===book.id)activeId=added[0]||null;save();renderCatalog();renderAdded();});box.append(row);});}
		$('#wordbook-catalog-search').on('click',renderCatalog);
		$('#wordbook-added-search').on('click',renderAdded);
		$('#wordbook-catalog-query').on('keydown',function(e){if(e.key==='Enter'){e.preventDefault();renderCatalog();}});
		$('#wordbook-added-query').on('keydown',function(e){if(e.key==='Enter'){e.preventDefault();renderAdded();}});
		detail.find('.wordbook-detail-close,.wordbook-detail-back').on('click',function(){detail.prop('hidden',true);});
		detail.find('form').on('submit',function(e){e.preventDefault();detailQuery=detail.find('input').val().trim();detailPage=1;loadDetail();});
		detail.find('.wordbook-prev').on('click',function(){if(detailPage>1){detailPage--;loadDetail();}});
		detail.find('.wordbook-next').on('click',function(){detailPage++;loadDetail();});
		renderCatalog();renderAdded();save();
	})();
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
