(function(){
 'use strict';
 document.addEventListener('DOMContentLoaded',function(){
  if(!document.getElementById('GuestNameEntry'))return;
  var elapsedKey='kkutu-playtime-elapsed-v2',seenKey='kkutu-playtime-seen-v2',noticeKey='kkutu-playtime-noticed-v2',now=Date.now(),lastSeen=Number(localStorage.getItem(seenKey))||0,elapsed=Number(localStorage.getItem(elapsedKey))||0,noticed=Number(localStorage.getItem(noticeKey))||0,lastTick=now,timer;
  if(!lastSeen||now-lastSeen>60000||now<lastSeen){elapsed=0;noticed=0;localStorage.setItem(elapsedKey,'0');localStorage.setItem(noticeKey,'0');}
  localStorage.setItem(seenKey,String(now));
  function persist(){var current=Date.now(),delta=Math.max(0,current-lastTick);elapsed+=delta;lastTick=current;localStorage.setItem(elapsedKey,String(elapsed));localStorage.setItem(seenKey,String(current));localStorage.setItem(noticeKey,String(noticed));}
  function show(hours){
   var old=document.getElementById('PlaytimeReminder');if(old)old.remove();
   var box=document.createElement('div');box.id='PlaytimeReminder';box.setAttribute('role','alert');box.setAttribute('aria-live','assertive');box.innerHTML='<strong>게임을 플레이한 지 '+hours+'시간이 지났습니다.</strong><div class="playtime-warning">과도한 게임 이용은 정상적인 일상생활에 지장을 줄 수 있습니다.</div>';document.body.appendChild(box);
   requestAnimationFrame(function(){box.classList.add('is-visible');});
   clearTimeout(timer);timer=setTimeout(function(){box.classList.remove('is-visible');setTimeout(function(){box.remove();},350);},20000);
  }
  function check(){persist();var hours=Math.floor(elapsed/3600000);if(hours>=1&&hours>noticed){noticed=hours;localStorage.setItem(noticeKey,String(hours));show(hours);}}
  window.addEventListener('pagehide',persist);document.addEventListener('visibilitychange',function(){if(document.hidden)persist();else lastTick=Date.now();});
  check();setInterval(check,15000);
 });
})();
