(function(){
  'use strict';
  document.addEventListener('DOMContentLoaded',function(){
	var hashLocale=decodeURIComponent((location.hash||'').replace(/^#/,''));
	if(['ko_KR','en_US','zh_CN','ko_KP'].indexOf(hashLocale)>=0){
		var cookieLocale=(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'';
		if(cookieLocale!==hashLocale){document.cookie='lc='+hashLocale+'; path=/; max-age=31536000; SameSite=Lax';location.reload();return;}
	}
    var trigger=document.getElementById('site-switch');
    var languageTrigger=document.getElementById('language-switch');
    var savedLocale=new URLSearchParams(location.search).get('locale')||(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'';var isEnglish=document.documentElement.lang==='en'||savedLocale==='en_US',isChinese=document.documentElement.lang.indexOf('zh')===0||savedLocale==='zh_CN',isChoson=savedLocale==='ko_KP';
    if(isChinese){document.documentElement.lang='zh-CN';var zhMap={'홈':'首页','공지사항':'公告','추석 이벤트':'中秋活动','채널':'频道','디스코드':'Discord','네이버 카페':'Naver Cafe','유튜브':'YouTube','로그인':'登录','로그아웃':'退出登录','함께 놀 서버':'选择服务器','게임 서버 고르기':'选择游戏服务器','나무':'树木','유리':'玻璃','개발자 서버':'开发者服务器','명 접속 중':' 人在线','점검중':'维护中','보통':'一般','쾌적':'流畅','입장':'进入','님 환영합니다.':'，欢迎您！','게임 시작':'开始游戏','공지사항':'公告','끄투게임즈코리아의 새로운 소식':'KKuTuGame 最新消息','최신 공지를 불러오는 중입니다.':'正在加载最新公告。','서버 목록':'服务器列表','접속':'连接','공식 디스코드':'官方 Discord','함께 이야기해요':'加入社区'};document.querySelectorAll('a,button,span,h1,h2,h3,strong,label,div').forEach(function(node){if(node.children.length)return;var text=node.textContent.trim();if(zhMap[text])node.textContent=zhMap[text];else if(/^[0-9]+명 접속 중$/.test(text))node.textContent=text.replace('명 접속 중',' 人在线');});}
    if(isChoson){var kpMap={'홈':'첫 화면','공지사항':'알림판','추석 이벤트':'추석 행사','채널':'통로','디스코드':'Discord','네이버 카페':'Naver Cafe','유튜브':'YouTube','로그인':'입장','로그아웃':'퇴장','함께 놀 서버':'함께 놀 봉사기','게임 서버 고르기':'경기 봉사기 고르기','나무':'나무','유리':'유리','개발자 서버':'개발자 봉사기','점검중':'점검중','보통':'보통','쾌적':'원활','입장':'들어가기','게임 시작':'경기 시작','님 환영합니다.':'동무, 환영합니다.','공지사항':'알림판','끄투게임즈코리아의 새로운 소식':'끄투경기의 새로운 소식','최신 공지를 불러오는 중입니다.':'최신 알림을 불러오는 중입니다.','서버 목록':'봉사기 목록','접속':'접속','공식 디스코드':'공식 Discord','함께 이야기해요':'함께 이야기합시다'};document.querySelectorAll('a,button,span,h1,h2,h3,strong,label,div').forEach(function(node){if(node.children.length)return;var text=node.textContent.trim();if(kpMap[text])node.textContent=kpMap[text];else if(/^[0-9]+명 접속 중$/.test(text))node.textContent=text.replace('명 접속 중','명 접속중');else if(/^총 [0-9]+명$/.test(text))node.textContent=text.replace('총 ','모두 ');});}
    if(!trigger&&!languageTrigger)return;
    var overlay=document.createElement('div');
    overlay.id='SiteSwitchOverlay';
    overlay.hidden=true;
    overlay.innerHTML='<section class="site-switch-card" role="dialog" aria-modal="true" aria-labelledby="SiteSwitchTitle">'+
      '<button type="button" class="site-switch-close" aria-label="닫기">×</button>'+
      '<span class="site-switch-kicker">SITE SWITCH</span>'+
      '<h2 id="SiteSwitchTitle">이동할 사이트를 선택하세요</h2>'+
      '<p>게임을 계속하거나 끄투게임즈코리아 홈페이지로 이동할 수 있어요.</p>'+
      '<div class="site-switch-options">'+
        '<a class="site-switch-option game" href="/"><strong>끄투게임즈코리아</strong><small>끝말잇기 게임으로 이동</small></a>'+
        '<a class="site-switch-option korea" href="https://kkutugameskorea.kro.kr/"><strong>끄투게임즈코리아</strong><small>공식 홈페이지로 이동</small></a>'+
      '</div>'+
    '</section>';
    var languageOverlay=document.createElement('div');
    languageOverlay.id='LanguageSwitchOverlay';
    languageOverlay.hidden=true;
    languageOverlay.innerHTML='<section class="site-switch-card language-switch-card" role="dialog" aria-modal="true" aria-labelledby="LanguageSwitchTitle">'+
      '<button type="button" class="site-switch-close" aria-label="닫기">×</button>'+
      '<span class="site-switch-kicker">LANGUAGE</span>'+
      '<h2 id="LanguageSwitchTitle">'+(isChinese?'选择语言':(isEnglish?'Choose your language':(isChoson?'언어를 고르십시오':'언어를 선택하세요')))+'</h2>'+
      '<p>'+(isChinese?'您的选择会保存并应用到游戏中。':(isEnglish?'Your choice is saved and applied inside the game.':(isChoson?'고른 언어는 보관되여 경기 화면에도 적용됩니다.':'선택한 언어는 쿠키에 저장되어 게임 화면에도 자동 적용됩니다。')))+'</p>'+
      '<div class="site-switch-options language-switch-options">'+
        '<button type="button" data-locale="ko_KR"><strong>한국어</strong><small>현재 한국어 화면 사용</small></button>'+
        '<button type="button" data-locale="en_US"><strong>English</strong><small>Use English in the game</small></button>'+
        '<button type="button" data-locale="zh_CN"><strong>简体中文</strong><small>在游戏中使用简体中文</small></button>'+
        '<button type="button" data-locale="ko_KP"><strong>조선어</strong><small>경기에서 조선어 사용</small></button>'+
      '</div>'+
    '</section>';
    document.body.appendChild(overlay);
    document.body.appendChild(languageOverlay);
    function closeSite(){overlay.hidden=true;if(trigger)trigger.focus();}
    function closeLanguage(){languageOverlay.hidden=true;if(languageTrigger)languageTrigger.focus();}
    if(trigger)trigger.addEventListener('click',function(){overlay.hidden=false;overlay.querySelector('.site-switch-close').focus();});
    overlay.querySelector('.site-switch-close').addEventListener('click',closeSite);
    overlay.addEventListener('click',function(event){if(event.target===overlay)closeSite();});
    languageOverlay.querySelector('.site-switch-close').addEventListener('click',closeLanguage);
    if(languageTrigger)languageTrigger.addEventListener('click',function(){languageOverlay.hidden=false;languageOverlay.querySelector('.site-switch-close').focus();});
    languageOverlay.addEventListener('click',function(event){
      var choice=event.target.closest('[data-locale]');
      if(choice){
        var requested=choice.getAttribute('data-locale');var locale=requested==='en_US'?'en_US':(requested==='zh_CN'?'zh_CN':(requested==='ko_KP'?'ko_KP':'ko_KR'));
        document.cookie='lc='+locale+'; Max-Age=31536000; Path=/; SameSite=Lax';
        var nextUrl=new URL(location.href);
        nextUrl.searchParams.set('locale',locale);
        location.href=nextUrl.toString();
      }else if(event.target===languageOverlay)closeLanguage();
    });
    document.addEventListener('keydown',function(event){
      if(event.key!=='Escape')return;
      if(!languageOverlay.hidden)closeLanguage();
      else if(!overlay.hidden)closeSite();
    });
  });
})();
