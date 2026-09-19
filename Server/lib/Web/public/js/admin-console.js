(function(){
	function message(card, text, bad){ var out=card.querySelector('output'); out.textContent=text; out.className=bad?'bad':'ok'; }
	function toast(text, bad){ var box=document.getElementById('admin-toast'); if(!box)return; box.textContent=text; box.className='show '+(bad?'bad':'ok'); clearTimeout(window._adminToastTimer); window._adminToastTimer=setTimeout(function(){box.className='';},3500); }
	function target(card){ return card.querySelector('.target').value.trim(); }
	async function request(url, options){
		var response = await fetch(url, options);
		var data = await response.json().catch(function(){ return {}; });
		if(!response.ok) throw new Error(data.error || '요청을 처리하지 못했습니다.');
		return data;
	}
	document.querySelectorAll('.card[data-kind]').forEach(function(card){
		var kind = card.dataset.kind;
		card.querySelector('.lookup').onclick = async function(){
			try {
				var key = kind === 'account' ? 'id' : 'ip';
				var data = await request('/admin/api/' + kind + '?' + key + '=' + encodeURIComponent(target(card)));
				message(card, data.reason ? '차단 중 · ' + data.reason + ' · ' + (data.until ? new Date(Number(data.until)).toLocaleString() + '까지' : '영구') : '현재 차단되지 않았습니다.');
			} catch(error) { message(card, error.message, true); }
		};
		card.querySelector('.block').onclick = async function(){
			try {
				var body = new URLSearchParams();
				body.set(kind === 'account' ? 'id' : 'ip', target(card));
				body.set('reason', card.querySelector('.reason').value);
				body.set('duration', card.querySelector('.duration').value);
				await request('/admin/api/' + kind + '/block', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body });
				message(card, '차단을 적용했습니다.');
				toast('밴이 완료되었습니다.');
			}
			catch(error) { message(card, error.message, true); }
		};
		card.querySelector('.unblock').onclick = async function(){
			try {
				var body = new URLSearchParams();
				body.set(kind === 'account' ? 'id' : 'ip', target(card));
				await request('/admin/api/' + kind + '/unblock', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body });
				message(card, '차단을 해제했습니다.');
				toast('밴이 해제되었습니다.');
			} catch(error) { message(card, error.message, true); }
		};
	});
	async function recentAction(kind, action, value, duration){
		var body = new URLSearchParams();
		body.set(kind === 'account' ? 'id' : 'ip', value);
		body.set('reason', '관리자 최근 접속 기록 제재');
		if(duration) body.set('duration', duration);
		await request('/admin/api/' + kind + '/' + action, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body });
	}
	async function loadRecent(){
		var tbody = document.getElementById('recent-list');
		if(!tbody) return;
		tbody.innerHTML = '<tr><td colspan="5">불러오는 중...</td></tr>';
		try {
			var data = await request('/admin/api/recent');
			tbody.innerHTML = '';
			(data.list || []).forEach(function(row){
				var tr = document.createElement('tr');
				var accountButtons = row.guest ? '' : '<button data-kind="account" data-action="block" data-duration="10" data-value="'+escapeAttr(row.userId)+'">계정 10분</button><button data-kind="account" data-action="block" data-duration="permanent" data-value="'+escapeAttr(row.userId)+'">계정 영구</button><button data-kind="account" data-action="unblock" data-value="'+escapeAttr(row.userId)+'">계정 해제</button>';
				tr.innerHTML = '<td>'+new Date(Number(row.connectedAt)).toLocaleString()+'</td><td>'+escapeHtml(row.displayName || row.userId)+'</td><td><code>'+escapeHtml(row.ip)+'</code></td><td>'+(row.guest?'손님':'계정')+'</td><td class="row-actions">'+accountButtons+'<button data-kind="ip" data-action="block" data-duration="10" data-value="'+escapeAttr(row.ip)+'">IP 10분</button><button data-kind="ip" data-action="block" data-duration="permanent" data-value="'+escapeAttr(row.ip)+'">IP 영구</button><button data-kind="ip" data-action="unblock" data-value="'+escapeAttr(row.ip)+'">IP 해제</button></td>';
				tbody.appendChild(tr);
			});
			if(!tbody.children.length) tbody.innerHTML='<tr><td colspan="5">접속 기록이 없습니다.</td></tr>';
		} catch(error) { tbody.innerHTML='<tr><td colspan="5">'+escapeHtml(error.message)+'</td></tr>'; }
	}
	async function loadAccounts(){
		var tbody = document.getElementById('accounts-list');
		if(!tbody) return;
		tbody.innerHTML = '<tr><td colspan="6">불러오는 중...</td></tr>';
		try {
			var data = await request('/admin/api/accounts');
			tbody.innerHTML = '';
			(data.list || []).forEach(function(row){
				var tr = document.createElement('tr');
				var controls='외부 계정';
				if(row.local_account){
					controls='<button class="password-reset" data-username="'+escapeAttr(row.username)+'">비밀번호 변경</button> <button class="nickname-change" data-username="'+escapeAttr(row.username)+'" data-nickname="'+escapeAttr(row.nickname)+'">닉네임 변경</button>';
					if(!row.developer) controls+=' <button class="account-delete" data-username="'+escapeAttr(row.username)+'">계정 삭제</button>';
				} else if(row.account_type === 'Discord') controls='<button class="discord-nickname-change" data-user-id="'+escapeAttr(row.user_id)+'" data-nickname="'+escapeAttr(row.nickname)+'">게임 닉네임 변경</button>';
				var joined=Number(row.created_at)>0?new Date(Number(row.created_at)).toLocaleString():'기록 없음';
				controls+=' <button class="badge-upload" data-user-id="'+escapeAttr(row.user_id)+'">배지 이미지</button>';
				tr.innerHTML = '<td><code>'+escapeHtml(row.username)+'</code></td><td>'+escapeHtml(row.nickname)+'</td><td><code>'+escapeHtml(row.user_id)+'</code></td><td>'+joined+'</td><td class="account-actions">'+controls+'</td><td>'+escapeHtml(row.account_type)+' · '+(row.developer?'운영자':'일반')+'</td>';
				tbody.appendChild(tr);
			});
			if(!tbody.children.length) tbody.innerHTML='<tr><td colspan="6">가입 계정이 없습니다.</td></tr>';
		} catch(error) { tbody.innerHTML='<tr><td colspan="6">'+escapeHtml(error.message)+'</td></tr>'; }
	}
	function escapeHtml(value){ var div=document.createElement('div'); div.textContent=String(value||''); return div.innerHTML; }
	function escapeAttr(value){ return escapeHtml(value).replace(/"/g,'&quot;'); }
	document.addEventListener('click', async function(event){
		var button=event.target.closest('#recent-list button'); if(!button) return;
		button.disabled=true;
		try { await recentAction(button.dataset.kind,button.dataset.action,button.dataset.value,button.dataset.duration); button.textContent='완료'; toast(button.dataset.action==='block'?'밴이 완료되었습니다.':'밴이 해제되었습니다.'); }
		catch(error){ toast(error.message,true); button.disabled=false; }
	});
	document.addEventListener('click', async function(event){
		var badgeButton=event.target.closest('#accounts-list .badge-upload'); if(!badgeButton)return;
		var input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.onchange=async function(){var file=input.files[0];if(!file)return;badgeButton.disabled=true;try{await request('/admin/api/accounts/badge?user_id='+encodeURIComponent(badgeButton.dataset.userId),{method:'POST',headers:{'Content-Type':file.type},body:file});toast('사용자 배지를 적용했습니다. 재접속하면 표시됩니다.');}catch(error){toast(error.message,true);}badgeButton.disabled=false;};input.click();
	});
	var badgeApply=document.getElementById('badge-user-apply'), badgeClear=document.getElementById('badge-user-clear');
	if(badgeApply)badgeApply.onclick=async function(){
		var card=document.getElementById('user-badge-card'), userId=document.getElementById('badge-user-id').value.trim(), file=document.getElementById('badge-user-file').files[0];
		if(!userId||!file){message(card,'게임 계정 ID와 배지 이미지를 모두 선택하세요.',true);return;}
		if(file.size>1024*1024){message(card,'배지 이미지는 최대 1MB까지 업로드할 수 있습니다.',true);return;}
		badgeApply.disabled=true; try{await request('/admin/api/accounts/badge?user_id='+encodeURIComponent(userId),{method:'POST',headers:{'Content-Type':file.type},body:file});message(card,'배지를 적용했습니다. 해당 사용자가 재접속하면 표시됩니다.');toast('사용자 배지를 적용했습니다.');document.getElementById('badge-user-file').value='';}catch(error){message(card,error.message,true);} badgeApply.disabled=false;
	};
	if(badgeClear)badgeClear.onclick=async function(){
		var card=document.getElementById('user-badge-card'), userId=document.getElementById('badge-user-id').value.trim(); if(!userId){message(card,'게임 계정 ID를 입력하세요.',true);return;}
		badgeClear.disabled=true; try{var body=new URLSearchParams();body.set('user_id',userId);await request('/admin/api/accounts/badge/clear',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});message(card,'배지를 해제했습니다. 해당 사용자가 재접속하면 반영됩니다.');toast('사용자 배지를 해제했습니다.');}catch(error){message(card,error.message,true);} badgeClear.disabled=false;
	};
	document.addEventListener('click', async function(event){
		var button=event.target.closest('#accounts-list .discord-nickname-change'); if(!button) return;
		var nickname=window.prompt('Discord 계정의 새 게임 닉네임을 입력하세요.',button.dataset.nickname);
		if(nickname===null) return;
		button.disabled=true;
		try { var body=new URLSearchParams(); body.set('user_id',button.dataset.userId); body.set('nickname',nickname);
			await request('/admin/api/accounts/discord-nickname',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});
			toast('게임 닉네임이 변경되었습니다.'); await loadAccounts();
		} catch(error){ toast(error.message,true); button.disabled=false; }
	});
	document.addEventListener('click', async function(event){
		var button=event.target.closest('#accounts-list .password-reset'); if(!button) return;
		var password=window.prompt(button.dataset.username+' 계정의 새 비밀번호를 입력하세요. (8자 이상)');
		if(password===null) return;
		if(password.length<8 || password.length>128){ toast('새 비밀번호는 8~128자로 입력하세요.',true); return; }
		button.disabled=true;
		try {
			var body=new URLSearchParams(); body.set('username',button.dataset.username); body.set('password',password);
			await request('/admin/api/accounts/password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});
			toast('비밀번호가 변경되었습니다.');
		} catch(error){ toast(error.message,true); }
		button.disabled=false;
	});
	document.addEventListener('click', async function(event){
		var button=event.target.closest('#accounts-list .nickname-change'); if(!button) return;
		var nickname=window.prompt(button.dataset.username+' 계정의 새 게임 닉네임을 입력하세요.',button.dataset.nickname);
		if(nickname===null) return;
		button.disabled=true;
		try { var body=new URLSearchParams(); body.set('username',button.dataset.username); body.set('nickname',nickname);
			await request('/admin/api/accounts/nickname',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});
			toast('게임 닉네임이 변경되었습니다.'); await loadAccounts();
		} catch(error){ toast(error.message,true); button.disabled=false; }
	});
	document.addEventListener('click', async function(event){
		var button=event.target.closest('#accounts-list .account-delete'); if(!button) return;
		if(!window.confirm(button.dataset.username+' 계정을 정말 삭제할까요? 게임 데이터와 로그인 세션도 삭제됩니다.')) return;
		button.disabled=true;
		try { var body=new URLSearchParams(); body.set('username',button.dataset.username);
			await request('/admin/api/accounts/delete',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});
			toast('계정이 삭제되었습니다.'); await loadAccounts();
		} catch(error){ toast(error.message,true); button.disabled=false; }
	});
	async function loadNotices(){
		try { var data=await request('/admin/api/notices');
			document.querySelectorAll('.notice-editor').forEach(function(card){ var notice=data[card.dataset.notice]||{};
				var target=card.querySelector('.notice-target-url'); if(target)target.value=notice.target_url||'';
				card.querySelector('.notice-enabled').checked=notice.enabled===true;
			});
		} catch(error){ toast(error.message,true); }
	}
	async function saveNotice(card,enabled){
		var key=card.dataset.notice, imageUrl='';
		if(key==='game_entry'){
			var fileInput=card.querySelector('.notice-image-file'), file=fileInput.files[0];
			if(file){
				if(file.size>3*1024*1024)throw new Error('이미지는 최대 3MB까지 업로드할 수 있습니다.');
				var uploaded=await request('/admin/api/notices/game-image',{method:'POST',headers:{'Content-Type':file.type},body:file}); imageUrl=uploaded.url; fileInput.value='';
			}else{ var current=await request('/admin/api/notices'); imageUrl=(current.game_entry&&current.game_entry.image_url)||''; }
		}
		var body=new URLSearchParams(); body.set('enabled',enabled?'true':'false'); body.set('title',''); body.set('message',''); body.set('image_url',imageUrl); body.set('target_url',(card.querySelector('.notice-target-url')||{}).value||'');
		await request('/admin/api/notices/'+key,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body}); card.querySelector('.notice-enabled').checked=enabled;
	}
	document.addEventListener('click',async function(event){
		var button=event.target.closest('.notice-editor .notice-save,.notice-editor .notice-hide'); if(!button)return;
		var card=button.closest('.notice-editor'), enabled=button.classList.contains('notice-save'); button.disabled=true;
		try{ await saveNotice(card,enabled); toast(enabled?'공지가 저장되어 표시됩니다.':'공지가 삭제되었습니다.'); }
		catch(error){toast(error.message,true);} button.disabled=false;
	});
	var refresh=document.getElementById('recent-refresh'); if(refresh) refresh.onclick=loadRecent;
	var accountRefresh=document.getElementById('accounts-refresh'); if(accountRefresh) accountRefresh.onclick=loadAccounts;
	loadRecent();
	loadAccounts();
	loadNotices();
	async function loadNoticePosts(){ var box=document.getElementById('notice-post-list'); if(!box)return; try{var data=await request('/admin/api/notice-posts');box.innerHTML='';(data.posts||[]).forEach(function(post){var row=document.createElement('div');row.className='notice-post-row';row.innerHTML='<img src="/site-notice-post/'+post.id+'?v='+post.created_at+'" alt="공지"><span>'+new Date(Number(post.created_at)).toLocaleString()+'</span><button data-id="'+post.id+'">삭제</button>';box.appendChild(row);});}catch(error){toast(error.message,true);} }
	var addPost=document.getElementById('notice-post-add');if(addPost)addPost.onclick=async function(){var file=document.getElementById('notice-post-file').files[0],url=document.getElementById('notice-post-url').value;if(!file){toast('공지 이미지를 선택하세요.',true);return;}addPost.disabled=true;try{await request('/admin/api/notice-posts?target_url='+encodeURIComponent(url),{method:'POST',headers:{'Content-Type':file.type},body:file});document.getElementById('notice-post-file').value='';document.getElementById('notice-post-url').value='';toast('누적 공지가 등록되었습니다.');loadNoticePosts();}catch(error){toast(error.message,true);}addPost.disabled=false;};
	document.addEventListener('click',async function(event){var b=event.target.closest('#notice-post-list button');if(!b)return;try{await request('/admin/api/notice-posts/'+b.dataset.id+'/delete',{method:'POST'});toast('공지가 삭제되었습니다.');loadNoticePosts();}catch(error){toast(error.message,true);}});
	loadNoticePosts();
	async function loadServerMaintenance(){
		var cards=document.querySelectorAll('.maintenance-status'); if(!cards.length)return;
		try{var data=await request('/admin/api/server-status'); cards.forEach(function(card){ var server=card.dataset.server, active=server==='all'?!!data.maintenance:!!(data.servers||[])[Number(server)]; card.querySelector('span').textContent=active?'현재 점검 중 · 일반 이용자 접속 차단':'현재 정상 운영 중'; });}
		catch(error){cards.forEach(function(card){card.querySelector('span').textContent=error.message;});}
	}
	async function setServerMaintenance(server,enabled,button){
		var card=button.closest('.maintenance-status'), buttons=card.querySelectorAll('button'); buttons.forEach(function(item){item.disabled=true;});
		try{var body=new URLSearchParams();body.set('maintenance',enabled?'true':'false');body.set('server',server);await request('/admin/api/server-status',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});toast(enabled?'점검을 시작했습니다.':'점검을 해제했습니다.');await loadServerMaintenance();}
		catch(error){toast(error.message,true);}finally{buttons.forEach(function(item){item.disabled=false;});}
	}
	document.addEventListener('click',function(event){var button=event.target.closest('.server-maintenance-on,.server-maintenance-off');if(!button)return;setServerMaintenance(button.closest('.maintenance-status').dataset.server,button.classList.contains('server-maintenance-on'),button);});
	loadServerMaintenance();
	async function loadSiteTheme(){
		var cards=document.querySelectorAll('#site-theme-card .theme-status');
		await Promise.all(Array.from(cards).map(async function(card){
			try{var data=await request('/admin/api/theme?server='+card.dataset.server);card.querySelector('span').textContent=data.theme==='chuseok'?'추석 테마':'가을 테마';card.querySelectorAll('.site-theme-choice').forEach(function(button){button.classList.toggle('active',button.dataset.theme===data.theme);});}
			catch(error){card.querySelector('span').textContent=error.message;}
		}));
	}
	document.addEventListener('click',async function(event){
		var button=event.target.closest('.site-theme-choice');if(!button)return;
		var card=button.closest('.theme-status'),buttons=card.querySelectorAll('.site-theme-choice');buttons.forEach(function(item){item.disabled=true;});
		try{var body=new URLSearchParams();body.set('theme',button.dataset.theme);body.set('server',card.dataset.server);await request('/admin/api/theme',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});toast('서버 테마를 적용했습니다. 해당 서버 이용자는 자동 재접속됩니다.');await loadSiteTheme();}
		catch(error){toast(error.message,true);}finally{buttons.forEach(function(item){item.disabled=false;});}
	});
	loadSiteTheme();
	async function loadServerAccess(){var box=document.getElementById('server-access-list');if(!box)return;try{var data=await request('/admin/api/server-access?server=2');box.innerHTML='';(data.list||[]).forEach(function(row){var item=document.createElement('div');item.className='access-row';item.innerHTML='<code>'+escapeHtml(row.user_id)+'</code><button data-user="'+escapeAttr(row.user_id)+'">삭제</button>';box.appendChild(item);});if(!box.children.length)box.textContent='허용된 일반 계정이 없습니다.';}catch(error){box.textContent=error.message;}}
	var accessAdd=document.getElementById('server-access-add');if(accessAdd)accessAdd.onclick=async function(){var input=document.getElementById('server-access-user'),body=new URLSearchParams();body.set('server','2');body.set('user_id',input.value.trim());try{await request('/admin/api/server-access',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});input.value='';toast('추석 서버 입장을 허용했습니다.');loadServerAccess();}catch(error){toast(error.message,true);}};
	document.addEventListener('click',async function(event){var button=event.target.closest('#server-access-list button');if(!button)return;var body=new URLSearchParams();body.set('server','2');body.set('user_id',button.dataset.user);body.set('remove','true');try{await request('/admin/api/server-access',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body});toast('입장 허용을 삭제했습니다.');loadServerAccess();}catch(error){toast(error.message,true);}});
	loadServerAccess();

})();
