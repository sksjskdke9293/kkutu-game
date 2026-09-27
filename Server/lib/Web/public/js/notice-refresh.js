(function(){
  'use strict';
  var game='https://kkutugame.kr';
  var locale=new URLSearchParams(location.search).get('locale')||(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'ko_KR';var english=locale==='en_US',chinese=locale==='zh_CN',choson=locale==='ko_KP';
  if(chinese){document.documentElement.lang='zh-CN';document.title='公告 | kkutugameskorea';}else if(english){document.documentElement.lang='en';document.title='Notices | kkutugameskorea';document.querySelectorAll('.site-header nav a,.header-play,.notice-page-title h1,.notice-page-title p,.section-heading h2,.section-heading>a,.notice-loading').forEach(function(node){var map={'홈':'Home','공지사항':'Notices','게임 소개':'About','게임 시작':'Play','끄투게임 새 소식':'News from kkutugameskorea','게임의 소식과 이벤트를 한곳에서 확인하세요.':'Find game news and events here.','← 메인으로':'← Home','공지를 불러오는 중이에요…':'Loading notices...'};if(map[node.textContent.trim()])node.textContent=map[node.textContent.trim()];});var logo=document.querySelector('.site-header .brand img');if(logo)logo.src='/img/custom/site-logo-en.png?v=20260920b';}
  var grid=document.getElementById('notice-grid');
  if(!grid)return;
  function card(post,index){
    var link=document.createElement('a');
    link.className='notice-card';link.href=(choson&&post.target_url_kp?post.target_url_kp:(chinese&&post.target_url_zh?post.target_url_zh:(english&&post.target_url_en?post.target_url_en:post.target_url)))||game+'/notices.html';
    var thumb=document.createElement('div');thumb.className='thumb';
    var image=document.createElement('img');image.src=(choson&&post.image_url_kp?'/site-notice-post-kp/':(chinese&&post.image_url_zh?'/site-notice-post-zh/':(english&&post.image_url_en?'/site-notice-post-en/':'/site-notice-post/')))+post.id+'?v='+encodeURIComponent(post.created_at);image.alt=(chinese?'公告 ':(english?'Notice ':'끄투게임 공지 '))+(index+1);image.loading='lazy';thumb.appendChild(image);
    var meta=document.createElement('div');meta.className='meta';
    var title=document.createElement('strong');title.textContent=english?(index===0?'Latest news':'Notice'):(index===0?'가장 새로운 소식':'끄투게임 공지사항');
    var date=document.createElement('time');date.dateTime=new Date(Number(post.created_at)).toISOString();date.textContent=new Date(Number(post.created_at)).toLocaleDateString(chinese?'zh-CN':(english?'en-US':'ko-KR'),{year:'numeric',month:'long',day:'numeric'});
    meta.append(title,date);link.append(thumb,meta);return link;
  }
  function render(posts){grid.replaceChildren();if(!posts.length){grid.innerHTML='<div class="notice-loading">등록된 공지가 없습니다.</div>';return}posts.forEach(function(post,i){grid.appendChild(card(post,i))});}
  fetch('/api/notices',{cache:'no-store'}).then(function(r){if(!r.ok)throw Error();return r.json()}).then(function(d){render(d.posts||[])}).catch(function(){grid.textContent='공지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';});
})();
