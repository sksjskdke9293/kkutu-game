(function(){
  'use strict';
  var game='https://kkutugame.kro.kr';
  var grid=document.getElementById('notice-grid');
  if(!grid)return;
  function card(post,index){
    var link=document.createElement('a');
    link.className='notice-card';link.href=post.target_url||game+'/notices.html';
    var thumb=document.createElement('div');thumb.className='thumb';
    var image=document.createElement('img');image.src='/site-notice-post/'+post.id+'?v='+encodeURIComponent(post.created_at);image.alt='끄투게임 공지 '+(index+1);image.loading='lazy';thumb.appendChild(image);
    var meta=document.createElement('div');meta.className='meta';
    var title=document.createElement('strong');title.textContent=index===0?'가장 새로운 소식':'끄투게임 공지사항';
    var date=document.createElement('time');date.dateTime=new Date(Number(post.created_at)).toISOString();date.textContent=new Date(Number(post.created_at)).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
    meta.append(title,date);link.append(thumb,meta);return link;
  }
  function render(posts){grid.replaceChildren();if(!posts.length){grid.innerHTML='<div class="notice-loading">등록된 공지가 없습니다.</div>';return}(posts.slice(0,3)).forEach(function(post,i){grid.appendChild(card(post,i))});}
  fetch('/api/notices',{cache:'no-store'}).then(function(r){if(!r.ok)throw Error();return r.json()}).then(function(d){var posts=d.posts||[];render(grid.dataset.all?posts:posts.slice(0,3))}).catch(function(){grid.textContent='공지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';});
})();
