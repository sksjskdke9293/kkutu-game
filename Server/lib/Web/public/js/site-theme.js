(function(){
 'use strict';
 var current=document.documentElement.getAttribute('data-site-theme')||'', timer=0;
 var server=(new URLSearchParams(location.search)).get('server');
 if(server===null){var playMatch=location.pathname.match(/^\/play([1-3])$/);if(playMatch)server=String(Number(playMatch[1])-1);}
 function themeUrl(){return '/api/theme'+(server!==null?'?server='+encodeURIComponent(server)+'&':'?')+'_='+Date.now();}
 var images={
  autumn:{desktop:'/img/custom/autumn-welcome-v2.png',mobile:'/img/custom/autumn-welcome-v2.png'},
  chuseok:{desktop:'/img/custom/chuseok-intro-desktop.png?v=20260914-1',mobile:'/img/custom/chuseok-intro-mobile.png?v=20260914-1'}
 };
 function mobile(){return window.matchMedia&&window.matchMedia('(max-width:800px)').matches;}
 function apply(theme,fromPoll){
  theme=theme==='chuseok'?'chuseok':'autumn'; current=theme;
  document.documentElement.setAttribute('data-site-theme',theme);
  if(document.body)document.body.setAttribute('data-site-theme',theme);
  var intro=document.getElementById('intro');
  if(intro){var src=images[theme][mobile()?'mobile':'desktop'];if(intro.getAttribute('src')!==src)intro.setAttribute('src',src);}
  if(fromPoll&&document.body&&document.body.hasAttribute('data-game-view')){
   window.setTimeout(function(){window.location.reload();},80);
  }
 }
 function load(){
  var xhr=new XMLHttpRequest();xhr.open('GET',themeUrl(),true);xhr.timeout=5000;
  xhr.onreadystatechange=function(){if(xhr.readyState!==4||xhr.status!==200)return;try{var data=JSON.parse(xhr.responseText);if(data.theme!==current)apply(data.theme,!!current);}catch(_){}};
  xhr.send();
 }
 function poll(){load();timer=window.setTimeout(poll,3000);}
 function start(){if(current)apply(current,false);poll();window.addEventListener('resize',function(){if(current)apply(current,false);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 window.addEventListener('beforeunload',function(){window.clearTimeout(timer);});
})();
