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
	$('<button id="RoomAddBot" type="button">봇 추가</button>').appendTo('.team-selector').on('click', function(){ send('invite', {target:'AI'}); });
	$('#QuickRoomBtn').appendTo('body').text('빠른 시작');
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
	$data.version = $("#version").html();
	$data.server = location.href.match(/\?.*server=(\d+)/)[1];
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
		if(rating >= 1500) return {name:'끄투게임 랭크', image:'/img/custom/ranks/rank-kkutugame.png'};
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
	window.kkutuRankRecordResult = function(result){
		var mine, profile, won;
		if(!Array.isArray(result) || !$data.room || !$data.room.ranked) return;
		mine = result.filter(function(entry){ return entry && entry.id == $data.id; })[0];
		if(!mine) return;
		profile = getRankProfile();
		// Account records were already updated by the game server.  Only a
		// guest needs the browser-local fallback described in the rank dialog.
		if(!$data.guest) return profile;
		won = Number(mine.rank) === 0;
		profile.rating = Math.max(0, profile.rating + (won ? 25 : -15));
		if(won) profile.wins++; else profile.losses++;
		saveRankProfile(profile);
		return profile;
	};
	function openRankMatchOverlay(){
		$('#RankMatchOverlay').remove();
		$('<div id="RankMatchOverlay"><section><img src="/img/custom/ranks/rank-bronze.png" alt="순위전"><h2>순위전 매칭</h2><p id="RankMatchStatus">상대방을 기다리는 중 · 1 / 2</p><p>표준 낱말집으로 2인 대결을 시작합니다.</p><button id="RankMatchCancel" type="button">매칭 취소</button></section></div>').appendTo('body');
		$('#RankMatchCancel').on('click', function(){ send('rankCancel', {}, true); $('#RankMatchOverlay').remove(); });
	}
	function initChatResize(){
		var node = $stage.box.chat.get(0);
		var $grip;
		var start;
		var storageKey = 'kkutu-chat-size-v1';
		if(!node || node.querySelector('.chat-resize-grip')) return;
		try{
			var saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
			if(saved && saved.width >= 360 && saved.height >= 180){
				node.style.setProperty('--kkutu-chat-width', saved.width + 'px');
				node.style.setProperty('--kkutu-chat-height', saved.height + 'px');
			}
		}catch(ex){}
		$grip = $('<button type="button" class="chat-resize-grip" aria-label="채팅창 크기 조절" title="드래그해서 채팅창 크기 조절">↖</button>');
		$stage.box.chat.append($grip);
		$grip.on('pointerdown', function(e){
			if(e.pointerType == 'touch') return;
			start = { x: e.clientX, y: e.clientY, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height };
			e.preventDefault();
			$grip.get(0).setPointerCapture && $grip.get(0).setPointerCapture(e.pointerId);
			$(window).on('pointermove.chatResize', function(move){
				if(!start) return;
				var width = Math.max(360, Math.min(window.innerWidth - 24, Math.round(start.width + start.x - move.clientX)));
				var height = Math.max(180, Math.min(window.innerHeight - 92, Math.round(start.height + start.y - move.clientY)));
				node.style.setProperty('--kkutu-chat-width', width + 'px');
				node.style.setProperty('--kkutu-chat-height', height + 'px');
			});
			$(window).one('pointerup.chatResize pointercancel.chatResize', function(){
				$(window).off('.chatResize');
				if(start) try{ localStorage.setItem(storageKey, JSON.stringify({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) })); }catch(ex){}
				start = null;
			});
		});
	}
	if(_WebSocket == undefined){
		loading(L['websocketUnsupport']);
		alert(L['websocketUnsupport']);
		return;
	}
	$data._soundList = [
		{ key: "k", value: "/media/kkutu/k.mp3" },
		{ key: "lobby", value: "/media/kkutu/LobbyBGM.mp3?v=uploaded-20260906" },
		{ key: "jaqwi", value: "/media/kkutu/JaqwiBGM.mp3" },
		{ key: "jaqwiF", value: "/media/kkutu/JaqwiFastBGM.mp3" },
		{ key: "ranked", value: "/media/kkutu/RankedBGM.mp3?v=ranked-20260907" },
		{ key: "game_start", value: "/media/kkutu/game_start.mp3?v=gayageum-effects-20260906" },
		{ key: "round_start", value: "/media/kkutu/round_start.mp3?v=gayageum-effects-20260906" },
		{ key: "fail", value: "/media/kkutu/fail.mp3" },
		{ key: "timeout", value: "/media/kkutu/timeout.mp3" },
		{ key: "lvup", value: "/media/kkutu/lvup.mp3" },
		{ key: "Al", value: "/media/kkutu/Al.mp3" },
		{ key: "success", value: "/media/kkutu/success.mp3" },
		{ key: "missing", value: "/media/kkutu/missing.mp3" },
		{ key: "mission", value: "/media/kkutu/mission.mp3" },
		{ key: "kung", value: "/media/kkutu/kung.mp3" },
		{ key: "horr", value: "/media/kkutu/horr.mp3" },
	];
	for(i=0; i<=10; i++) $data._soundList.push(
		{ key: "T"+i, value: "/media/kkutu/T"+i+".mp3?v=uploaded-20260906" },
		{ key: "K"+i, value: "/media/kkutu/K"+i+".mp3?v=gayageum-effects-20260906" },
		{ key: "As"+i, value: "/media/kkutu/As"+i+".mp3?v=gayageum-as-20260906" }
	);
	loadSounds($data._soundList, function(){
		processShop(connect);
	});
	delete $data._soundList;
	
	MOREMI_PART = $("#MOREMI_PART").html().split(',');
	AVAIL_EQUIP = $("#AVAIL_EQUIP").html().split(',');
	RULE = JSON.parse($("#RULE").html());
	OPTIONS = JSON.parse($("#OPTIONS").html());
	MODE = Object.keys(RULE);
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
			applyOptions(JSON.parse($data.opts));
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
	$stage.chatBtn.on('click', function(e){
		checkInput();
		
		var value = $stage.talk.val();
		if(!value) return;
		var o = { value: value.trim() };
		if(o.value[0] == "/"){
			o.cmd = o.value.split(" ");
			runCommand(o.cmd);
		}else{
			send('talk', o);
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
				$stage.game.hereText.val('');
				return;
			}
			var prediction = $stage.game.hereText.val().trim();
			if(prediction) send('checkPrediction', {value:prediction});
			return;
		}
		var value = $stage.game.hereText.val().trim();
		if(!value) return;
		send('talk', {value:value, relay:true});
		$stage.game.hereText.val('').focus();
	}
	function blocksGameInputAutomation(inputType){
		return inputType === 'insertFromPaste' || inputType === 'insertFromDrop' ||
			inputType === 'insertFromYank' || inputType === 'insertReplacementText';
	}
	var wordComposing = false, lastGameWordValue = '';
	$stage.game.hereText.prop('readOnly', false).attr({
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
		if($data._wordInputMode === 'prediction') $data._prediction = '';
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
	$stage.menu.quickRoom.on('click', function(e){
		if(getOnly() != 'for-lobby') return;
		$('#MatchOverlay').remove();
		$('<div id="MatchOverlay"><section><h2>빠른 시작</h2><p id="MatchStatus">상대방을 기다리는 중 · 1 / 2</p><div id="MatchVotes"></div><p id="MatchHint"></p><button id="MatchCancel">매칭 취소</button></section></div>').appendTo('body');
		$('#MatchCancel').on('click', function(){ send('matchCancel', {}, true); $('#MatchOverlay').remove(); });
		send('matchJoin', {}, true);
	});
	$("#room-mode").on('change', function(e){
		var v = $("#room-mode").val();
		var rule = RULE[MODE[v]];
		$("#game-mode-expl").html(L['modex' + v]);

		updateGameOptions(rule.opts, 'room');
		var isMoraeClassic = ["2", "3", "8"].indexOf(String(v)) != -1;
		$("#room-dictionary-panel").toggle(isMoraeClassic);
		var legacyWordOptions = { injeong: "ext", loanword: "loa", strict: "str" };
		Object.keys(legacyWordOptions).forEach(function(option){
			$("#room-" + option + "-panel").toggle(!isMoraeClassic && rule.opts.indexOf(legacyWordOptions[option]) != -1);
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
		$data._shop = false;
		$stage.menu.shop.removeClass("toggled");
		updateUI();
		return false;
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
	$stage.menu.ready.on('click', function(e){
		send('ready');
	});
	$stage.menu.start.on('click', function(e){
		send('start');
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
	$stage.dialog.resultOK.on('click', function(e){
		if($data._resultPage == 1 && $data._resultRank){
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
		var $target = $(e.currentTarget);
		
		if($target.is(':disabled')) return;
		if(!$("#dict-theme").val()) return;
		$target.prop('disabled', true);
		$("#dict-output").html(L['searching']);
		$.get("/injeong/" + $("#dict-input").val() + "?theme=" + $("#dict-theme").val(), function(res){
			addTimeout(function(){
				$target.prop('disabled', false);
			}, 2000);
			if(res.error) return $("#dict-output").html(res.error + ": " + L['wpFail_' + res.error]);
			
			$("#dict-output").html(L['wpSuccess'] + "(" + res.message + ")");
		});
	});
	$stage.dialog.dictSearch.on('click', function(e){
		var $target = $(e.currentTarget);
		
		if($target.is(':disabled')) return;
		$target.prop('disabled', true);
		$("#dict-output").html(L['searching']);
		tryDict($("#dict-input").val(), function(res){
			addTimeout(function(){
				$target.prop('disabled', false);
			}, 500);
			if(res.error) return $("#dict-output").html(res.error + ": " + L['wpFail_' + res.error]);
			
			$("#dict-output").html(processWord(res.word, res.mean, res.theme, res.type.split(',')));
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
		if(showDialog($stage.dialog.dress)) $.get("/box", function(res){
			if(res.error) return fail(res.error);
			
			$data.box = res;
			drawMyDress();
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
	$("#DressDiag .dress-type").on('click', function(e){
		var $target = $(e.currentTarget);
		var type = $target.attr('id').slice(11);
		
		$(".dress-type.selected").removeClass("selected");
		$target.addClass("selected");
		
		drawMyGoods(type == 'all' || $target.attr('value'));
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
	$stage.dialog.purchaseOK.on('click', function(e){
		$.post("/buy/" + $data._sgood, function(res){
			var my = $data.users[$data.id];
			
			if(res.error) return fail(res.error);
			alert(L['purchased']);
			my.money = res.money;
			my.box = res.box;
			updateMe();
		});
		$stage.dialog.purchase.hide();
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
	function connect(){
		ws = new _WebSocket($data.URL);
		ws.onopen = function(e){
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
			if(rws) rws.close();
			stopAllSounds();
			showReconnect(e);
		};
		ws.onerror = function(e){
			console.warn(L['error'], e);
		};
	}
});
