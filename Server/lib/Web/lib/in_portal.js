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

(function(){
	if(window.__kkutuPortalLoaded) return;
	window.__kkutuPortalLoaded = true;
	var $stage;
	var loading = false;
	var LIMITS = [ 100, 50 ];
	var LIST;
	var maintenance = false;
	var unavailable = false;
	var serverMaintenance = [false, false];
	var disabledLabel = "점검중";

	$(document).ready(function(){
		window.L = window.L || {};
		var L = window.L;
		$stage = {
			list: $("#server-list"),
			total: $("#server-total"),
			start: $("#game-start"),
			ref: $("#server-refresh"),
			refi: $("#server-refresh>i")
		};
		maintenance = $stage.start.attr('data-maintenance') === 'true';
		unavailable = $stage.start.attr('data-unavailable') === 'true';
		try{ serverMaintenance=JSON.parse($stage.start.attr('data-server-maintenance') || '[false,false]'); }catch(ex){}
		disabledLabel = $stage.start.attr('data-disabled-label') || "점검중";

		$("#Background").attr('src', "").addClass("jt-image").css({
			'background-image': "url(/img/kkutu/gamebg.png)",
			'background-size': "cover",
			'background-repeat': "no-repeat",
			'background-position': "center"
		});
		$stage.start.prop('disabled', maintenance || unavailable);
		if(!maintenance && !unavailable) $stage.start.on('click', openServerChooser);
		$('#ServerSelectClose').on('click', closeServerChooser);
		$('#ServerSelectOverlay').on('click', function(e){ if(e.target===this) closeServerChooser(); });
		$('#portal-logout').on('click', function(){ if(window.KkutuAccount) window.KkutuAccount.logout(); });
		$(document).on('keydown.serverSelect',function(e){ if(e.key==='Escape')closeServerChooser(); });
		$stage.ref.on('click', function(e){
			seekServers();
		});
		// This is derived from the live game-server websocket; it is never
		// manually toggled in the portal.
		setInterval(function(){
			seekServers();
		}, 4000);
		seekServers();
		var $entryCard=$('.portal-entry-card'),$entryLevel=$('#portal-entry-level');
		if($entryCard.attr('data-guest')==='true'){$entryLevel.text('Lv.∞');$entryCard.css('--entry-progress','100%');}
		else $.getJSON('/entry').done(function(entry){var guest=entry&&entry.guest,progress=guest?100:Math.max(0,Math.min(100,Number(entry&&entry.progress||0)));$entryLevel.text(guest?'Lv.∞':'Lv.'+Number(entry&&entry.level||1));$entryCard.css('--entry-progress',progress+'%');}).fail(function(){$entryLevel.text('Lv.1');$entryCard.css('--entry-progress','0%');});
	});
	function seekServers(){
		if(loading) return;
		loading = true;
		$stage.refi.addClass('fa-spin');
		$.ajax({url:'/servers', dataType:'json', timeout:10000}).done(function(data){
			var sum = 0;
			if(typeof data.maintenance === 'boolean') maintenance = data.maintenance;
			if(Array.isArray(data.maintenanceServers)) serverMaintenance=data.maintenanceServers;
			var isDisabled = maintenance || unavailable;
			$stage.start.prop('disabled', isDisabled).text(unavailable ? '사용불가 계정' : (maintenance ? disabledLabel : '게임 시작'));
			LIMITS = Array.isArray(data.max) ? data.max : [ data.max || LIMITS[0] ];

			$stage.list.empty();
			LIST = data.list;
			if(!$('#ServerSelectOverlay').prop('hidden')) renderServerChoices();
			(data.list || []).forEach(function(v, i){
				var inMaintenance=!!serverMaintenance[i];
				var status = (v === null || inMaintenance) ? "x" : "o";
				var limit = LIMITS[i] || LIMITS[0];
				var people = inMaintenance ? "점검중" : ((status == "x") ? "-" : (v + " / " + limit));
				var limp = inMaintenance ? 100 : Math.max(0, Math.min(100, Number(v || 0) / limit * 100));
				var $e;

				sum += v || 0;
				if(status == "o"){
					if(limp >= 99) status = "q";
					else if(limp >= 90) status = "p";
				}
				var loadClass=inMaintenance?'is-maintenance':(limp>=75?'is-high':(limp>=50?'is-medium':'is-normal'));
				$stage.list.append($e = $("<div>").addClass("server "+loadClass).attr('id', "server-" + i).attr('data-maintenance',inMaintenance?'true':'false')
					.append($("<div>").addClass("server-status ss-" + status))
					.append($("<div>").addClass("server-name").text(L['server_' + i] || (i === 0 ? '나무' : '끄투게임즈코리아' + (i + 1))))
					.append($("<div>").addClass("server-people graph")
						.append($("<div>").addClass("graph-bar").width(limp + "%"))
						.append($("<label>").html(people))
					)
					.append($("<div>").addClass("server-enter").text(L['serverEnter'] || '접속'))
				);
				if(status != "x" && !maintenance && !unavailable) $e.on('click', function (e) {
					var locale=(new URLSearchParams(location.search).get('locale')||(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'ko_KR');
					if(window.KkutuAccount) window.KkutuAccount.start('/play'+(i+1)+'#'+locale);
					else location.href = '/?account=login';
				}); else $e.children(".server-enter").html(inMaintenance ? '점검중' : (maintenance ? disabledLabel : "-"));
			});
			$stage.total.text((L['TOTAL'] || '총') + ' ' + sum + (L['MN'] || '명'));
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', maintenance || unavailable);
		}).fail(function(){
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', maintenance || unavailable);
			LIST = [];
		}).always(function(){
			loading = false;
			$stage.refi.removeClass('fa-spin');
		});
	}
	function startDefaultServer(){
		openServerChooser();
	}
	function closeServerChooser(){ $('#ServerSelectOverlay').prop('hidden',true); }
	function openServerChooser(){
		if(maintenance || unavailable) return;
		renderServerChoices();
		$('#ServerSelectOverlay').prop('hidden',false); $('#ServerSelectClose').focus();
	}
	function renderServerChoices(){
		var $list=$('#ServerSelectList').empty();
		(LIST||[]).forEach(function(count,i){
			var inMaintenance=!!serverMaintenance[i], online=count!==null && !inMaintenance, limit=LIMITS[i]||LIMITS[0];
			var serverName=L['server_'+i]||(i===0?'나무':('끄투서버 '+(i+1)));
			var comfort=online?(count>=limit?'혼잡':(count/limit>=.75?'보통':'쾌적')):'점검';
			var gauge=online?Math.max(0,Math.min(100,count/limit*100)):0;
			var $card=$('<article>').addClass('server-choice'+(online?'':' is-offline')).css('--server-load',gauge+'%')
				.append($('<div>').addClass('server-choice-copy').append($('<div>').addClass('server-choice-name').text(serverName)).append($('<div>').addClass('server-choice-count').text(online?(count+' / '+limit+'명 접속 중'):(inMaintenance?'점검중':'서버 점검 중'))))
				.append($('<span>').addClass('server-choice-state').text(comfort))
				.append($('<button type="button" aria-label="'+serverName+' 접속">').prop('disabled', !online).text(online?'입장':'점검중'));
			if(online && !maintenance && !unavailable)$card.on('click',function(){ var locale=(new URLSearchParams(location.search).get('locale')||(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'ko_KR'); var url='/play'+(i+1)+'#'+locale; if(window.KkutuAccount)window.KkutuAccount.start(url);else location.href=url; });
			$list.append($card);
		});
		if(!$list.children().length)$list.append($('<p>').addClass('server-select-empty').text('서버 정보를 불러오는 중입니다.'));
	}
})();
