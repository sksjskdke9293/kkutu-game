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
	$data._prediction = '';
	$data._hintPending = false;
	$('#TurnHint').empty();
	$data._roundTime = $data.room.time * 1000;
	$stage.game.display.html(getCharText(data.char, data.subChar));
	$stage.game.chain.show().html($data.chain = 0);
	if($data.room.opts.mission){
		$stage.game.items.show().css('opacity', 1).html($data.mission = data.mission);
	}
	if(MODE[$data.room.mode] == "KAP"){
		$(".jjoDisplayBar .graph-bar").css({ 'float': "right", 'text-align': "left" });
	}
	drawRound(data.round);
	if($data.room.ranked) playBGM('ranked');
	playSound('round_start');
	recordEvent('roundReady', { data: data });
};
$lib.Classic.turnStart = function(data){
	$('#DraftStatus').remove();
	var remainingShield = Math.max(0, ($data.room.opts.shield == null ? 15 : $data.room.opts.shield) - ($data.chain || 0));
	if(!$('#ShieldStatus').length) $('.game-head').append($('<div>').attr('id', 'ShieldStatus'));
	$('#ShieldStatus').text($data.room.opts.manner ? '보호막 · 매너 모드 상시' : '보호막 ' + remainingShield + '회 남음');
	$data.room.game.turn = data.turn;
	if(data.seq) $data.room.game.seq = data.seq;
	if(!($data._tid = $data.room.game.seq[data.turn])) return;
	if($data._tid.robot) $data._tid = $data._tid.id;
	data.id = $data._tid;
	
	$stage.game.display.html($data._char = getCharText(data.char, data.subChar, data.wordLength));
	$("#game-user-"+data.id).addClass("game-user-current");
	if(!$data._replay){
		$data._wordInputMode = data.id == $data.id ? 'answer' : 'hint';
		$data._hintPending = false;
		$('#TurnHint').empty();
		$stage.game.here.show().attr('data-mode', $data._wordInputMode);
		$data._playerHints = [];
		$stage.game.hereText.prop('readOnly', false).attr('placeholder', data.id == $data.id ? '낱말 입력 · 번호로 힌트 사용 시 점수 50%' : '상대에게 알려줄 힌트를 입력하고 Enter');
		$('#GameWordSubmit').text(data.id == $data.id ? '입력' : '힌트');
		if(data.id == $data.id){
			$stage.game.hereText.val($data._prediction || '').focus();
			$data._prediction = '';
		}else{
			$stage.game.hereText.val('');
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
$lib.Classic.turnGoing = function(){
	if(!$data.room) clearInterval($data._tTime);
	$data._turnTime -= TICK;
	$data._roundTime -= TICK;
	
	$stage.game.turnBar
		.width($data._timePercent())
		.html(($data._turnTime*0.001).toFixed(1) + L['SECOND']);
	$stage.game.roundBar
		.width($data._roundTime/$data.room.time*0.1 + "%")
		.html(($data._roundTime*0.001).toFixed(1) + L['SECOND']);
	
	if(!$stage.game.roundBar.hasClass("round-extreme")) if($data._roundTime <= 5000) $stage.game.roundBar.addClass("round-extreme");
};
$lib.Classic.turnEnd = function(id, data){
	var $sc = $("<div>")
		.addClass("deltaScore")
		.html((data.score > 0) ? ("+" + (data.score - data.bonus)) : data.score);
	var $uc = $(".game-user-current");
	var hi;
	
	if($data._turnSound) $data._turnSound.stop();
	addScore(id, data.score);
	clearInterval($data._tTime);
	if(data.ok){
		checkFailCombo();
		clearTimeout($data._fail);
		if(!$data._replay){
			$data._wordInputMode = 'prediction';
			$stage.game.here.show().attr('data-mode', 'prediction');
			$stage.game.hereText.prop('readOnly', false).val('').attr('placeholder', '예측 · 다음에 낼 낱말을 미리 적어두세요');
			$('#GameWordSubmit').text('저장');
		}
		$stage.game.chain.html(++$data.chain);
		pushDisplay(data.value, data.mean, data.theme, data.wc);
	}else{
		$data._wordInputMode = 'waiting';
		checkFailCombo(id);
		$sc.addClass("lost");
		$(".game-user-current").addClass("game-user-bomb");
		$stage.game.here.hide();
		playSound('timeout');
	}
	if(data.hint){
		data.hint = data.hint._id;
		hi = data.hint.indexOf($data._chars[0]);
		if(hi == -1) hi = data.hint.indexOf($data._chars[1]);
		
		if(MODE[$data.room.mode] == "KAP") $stage.game.display.empty()
			.append($("<label>").css('color', "#AAAAAA").html(data.hint.slice(0, hi)))
			.append($("<label>").html(data.hint.slice(hi)));
		else $stage.game.display.empty()
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
