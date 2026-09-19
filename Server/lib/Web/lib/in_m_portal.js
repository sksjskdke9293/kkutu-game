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
	var L = window.L || {};
	var maintenance = false;
	var unavailable = false;
	var serverMaintenance = [false, false];
	var disabledLabel = "점검중";

	$(document).ready(function(){
		window.L = window.L || {};
		L = window.L;
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
		// Keep the server list usable even when a slow mobile connection has
		// not returned the first live status request yet.
		$stage.start.prop('disabled', maintenance || unavailable);
		if(!maintenance) $stage.start.on('click', openServerChooser);
		$('#ServerSelectClose').on('click', closeServerChooser);
		$('#ServerSelectOverlay').on('click', function(e){ if(e.target === this) closeServerChooser(); });
		$('#ServerSelectList').on('click', '.server-choice', function(){
			if(!$(this).hasClass('is-offline')) connectToServer(Number($(this).attr('data-server')) || 0);
		});
		$stage.list.on('click', '.server', function(){
			if(maintenance || $(this).find('.server-status').hasClass('ss-x')) return;
			var server = Number($(this).attr('data-server')) || 0;
			connectToServer(server);
		});
		$stage.ref.on('click', function(e){
			seekServers();
		});
		setInterval(function(){
			seekServers();
		}, 4000);
		seekServers();
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
			data.list.forEach(function(v, i){
				var inMaintenance=!!serverMaintenance[i];
				var status = (v === null || inMaintenance) ? "x" : "o";
				var limit = LIMITS[i] || LIMITS[0];
				var people = inMaintenance ? "점검중" : ((status == "x") ? "-" : (v + " / " + limit));
				var limp = v / limit * 100;
				var $e;

				sum += v || 0;
				if(status == "o"){
					if(limp >= 99) status = "q";
					else if(limp >= 90) status = "p";
				}
				$stage.list.append($e = $("<div>").addClass("server").attr('id', "server-" + i).attr('data-server', i)
					.append($("<div>").addClass("server-status ss-" + status))
					.append($("<div>").addClass("server-name").html(L['server_' + i]))
					.append($("<div>").addClass("server-people graph")
						.append($("<div>").addClass("graph-bar").width(limp + "%"))
						.append($("<label>").html(people))
					)
					.append($("<div>").addClass("server-enter").html(L['serverEnter']))
				);
				if(status == "x" || maintenance) $e.children(".server-enter").html(maintenance ? disabledLabel : "-");
			});
			$stage.total.html("&nbsp;" + L['TOTAL'] + " " + sum + L['MN']);
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', maintenance || unavailable);
		}).fail(function(){
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', maintenance || unavailable);
			// Do not erase the server cards rendered by the page. Mobile browsers
			// can briefly cancel a request while switching networks.
			LIST = LIST || $stage.list.children('.server').map(function(){
				return Number($(this).attr('data-server')) === 0 ? 0 : 0;
			}).get();
		}).always(function(){
			loading = false;
			$stage.refi.removeClass('fa-spin');
		});
	}
	function connectToServer(server){
		closeServerChooser();
		if(window.KkutuAccount && typeof window.KkutuAccount.start === 'function') window.KkutuAccount.start('/?server=' + server);
		else location.href='/?server=' + server;
	}
	function closeServerChooser(){
		$('#ServerSelectOverlay').prop('hidden', true);
	}
	function openServerChooser(){
		if(maintenance || unavailable) return;
		renderServerChoices();
		$('#ServerSelectOverlay').prop('hidden', false);
		$('#ServerSelectClose').focus();
	}
	function renderServerChoices(){
		var $list = $('#ServerSelectList').empty();
		var servers = LIST || $stage.list.children('.server').map(function(){ return 0; }).get();
		servers.forEach(function(count, i){
			var online = count !== null;
			var limit = LIMITS[i] || LIMITS[0] || 100;
			var name = i === 0 ? '나무' : (L['server_' + i] || '유리');
			var comfort = online ? (count / limit >= .75 ? '보통' : '쾌적') : '점검';
			var gauge = online ? Math.max(0, Math.min(100, count / limit * 100)) : 0;
			$list.append($('<article>').addClass('server-choice' + (online ? '' : ' is-offline')).attr('data-server', i).css('--server-load', gauge + '%')
				.append($('<div>').addClass('server-choice-copy').append($('<div>').addClass('server-choice-name').text(name)).append($('<div>').addClass('server-choice-count').text(online ? (count + ' / ' + limit + '명 접속 중') : '서버 점검 중')))
				.append($('<span>').addClass('server-choice-state').text(comfort))
				.append($('<button type="button">').attr('aria-label', name + ' 접속').text('입장')));
		});
		if(!$list.children().length) $list.append($('<p>').addClass('server-select-empty').text('서버 정보를 불러오는 중입니다.'));
	}
})();
