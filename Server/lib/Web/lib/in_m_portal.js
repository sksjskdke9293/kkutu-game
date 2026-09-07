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
	var LIMIT = 400;
	var LIST;

	$(document).ready(function(){
		$stage = {
			list: $("#server-list"),
			total: $("#server-total"),
			start: $("#game-start"),
			ref: $("#server-refresh"),
			refi: $("#server-refresh>i")
		};

		$("#Background").attr('src', "").addClass("jt-image").css({
			'background-image': "url(/img/kkutu/gamebg.png)",
			'background-size': "cover",
			'background-repeat': "no-repeat",
			'background-position': "center"
		});
		$stage.start.prop('disabled', true).on('click', function(e){
			var i, j;

			for(i=0.9; i<1; i+=0.01){
				for(j in LIST){
					if(typeof LIST[j] === 'number' && LIST[j] < i * LIMIT){
						if(window.KkutuAccount) window.KkutuAccount.start("/?server=" + j);
						else location.href = '/?account=login';
						return;
					}
				}
			}
			alert('현재 입장 가능한 서버가 없습니다. 잠시 후 다시 시도해 주세요.');
			seekServers();
		});
		$stage.ref.on('click', function(e){
			seekServers();
		});
		setInterval(function(){
			seekServers();
		}, 60000);
		seekServers();
	});
	function seekServers(){
		if(loading) return;
		loading = true;
		$stage.refi.addClass('fa-spin');
		$.ajax({url:'/servers', dataType:'json', timeout:10000}).done(function(data){
			var sum = 0;

			$stage.list.empty();
			LIST = data.list;
			data.list.forEach(function(v, i){
				var status = (v === null) ? "x" : "o";
				var people = (status == "x") ? "-" : (v + " / " + LIMIT);
				var limp = v / LIMIT * 100;
				var $e;

				sum += v || 0;
				if(status == "o"){
					if(limp >= 99) status = "q";
					else if(limp >= 90) status = "p";
				}
				$stage.list.append($e = $("<div>").addClass("server").attr('id', "server-" + i)
					.append($("<div>").addClass("server-status ss-" + status))
					.append($("<div>").addClass("server-name").html(L['server_' + i]))
					.append($("<div>").addClass("server-people graph")
						.append($("<div>").addClass("graph-bar").width(limp + "%"))
						.append($("<label>").html(people))
					)
					.append($("<div>").addClass("server-enter").html(L['serverEnter']))
				);
				if (status != "x") $e.on('click', function (e) {
					if(window.KkutuAccount) window.KkutuAccount.start("/?server=" + i);
					else location.href = '/?account=login';
				}); else $e.children(".server-enter").html("-");
			});
			$stage.total.html("&nbsp;" + L['TOTAL'] + " " + sum + L['MN']);
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', false);
		}).fail(function(){
			$stage.refi.removeClass("fa-spin");
			$stage.start.prop('disabled', false);
			LIST = [];
		}).always(function(){
			loading = false;
			$stage.refi.removeClass('fa-spin');
		});
	}
})();
