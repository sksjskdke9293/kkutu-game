(function(){
 'use strict';
 var state=null, next='/?server=0', overlay, card, lastFocus, viewVersion=0;
 function el(tag,text,cls){var e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
 function badge(){var e=el('img');e.src='/img/kkutu/moremi/body.png?v=20260906-mascot-2';e.alt='모레미 개발자';e.title='개발자';e.className='moremi-developer-badge';return e;}
 async function session(){var r=await fetch('/account/session',{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error('계정 정보를 불러오지 못했습니다.');state=await r.json();return state;}
 function error(message){var e=document.getElementById('AccountError');if(e)e.textContent=message;}
 async function post(action,data){
  if(!state)await session();
  var r=await fetch('/account/'+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(data||{})});
  var result=await r.json();if(!r.ok)throw Error(result.error||'요청 실패');return result;
 }
 function close(){viewVersion++;overlay.hidden=true;if(lastFocus)lastFocus.focus();}
 function button(text,callback,primary){var b=el('button',text,primary?'primary':'');b.type='button';b.onclick=callback;card.appendChild(b);return b;}
 function shell(title){
  viewVersion++;
  if(overlay.hidden)lastFocus=document.activeElement;
  overlay.hidden=false;card.replaceChildren();
  var x=button('×',close);x.id='AccountClose';x.setAttribute('aria-label','닫기');
  var h=el('h2',title);h.id='AccountTitle';card.appendChild(h);
  var e=el('p');e.id='AccountError';e.setAttribute('role','alert');card.appendChild(e);
 }
 async function start(url){
  next=url||'/?server=0';shell('게임 시작');var version=viewVersion;
  try{await session();
   if(version!==viewVersion)return;
   if(state.user){button(state.user.nickname+' 님으로 시작',function(){location.href=next;},true);button('로그아웃',logout);}
   else{button('비회원으로 시작',function(){location.href=next;},true);button('계정 로그인',function(){form(false);});}
   card.querySelectorAll('button')[1].focus();
  }catch(e){error(e.message);button('다시 시도',function(){start(next);});}
 }
 async function form(register){
  shell(register?'회원가입':'계정 로그인');
  var version=viewVersion;
  try{await session();}catch(e){error(e.message);return;}
  if(version!==viewVersion)return;
  if(!state.secure)card.appendChild(el('p','현재 HTTP 연결입니다. 비밀번호가 암호화되어 전송되지 않으므로 다른 사이트의 비밀번호를 사용하지 마세요.','account-warning'));
  var f=el('form');card.appendChild(f);
  function field(label,name,type,auto){var l=el('label',label);l.htmlFor='account-'+name;f.appendChild(l);var i=el('input');i.id=l.htmlFor;i.name=name;i.type=type;i.required=true;i.autocomplete=auto;i.maxLength=name==='password'?128:name==='nickname'?20:24;f.appendChild(i);return i;}
  var username=field('아이디','username','text','username');username.pattern='[A-Za-z0-9_]{3,24}';
  if(register){var nick=field('게임 닉네임','nickname','text','nickname');nick.minLength=2;}
  var password=field('비밀번호','password','password',register?'new-password':'current-password');if(register)password.minLength=8;
  if(register)field('비밀번호 확인','confirm','password','new-password');
  var submit=el('button',register?'가입하고 시작':'로그인','primary');submit.type='submit';f.appendChild(submit);
  if(!register){var discord=el('button','Discord로 로그인','account-discord');discord.type='button';discord.onclick=function(){location.href='/login/discord';};f.appendChild(discord);}
  f.onsubmit=async function(e){e.preventDefault();error('');submit.disabled=true;
   try{if(register&&f.elements.password.value!==f.elements.confirm.value)throw Error('비밀번호 확인이 일치하지 않습니다.');
    var data={username:f.elements.username.value,password:f.elements.password.value,next:next};if(register)data.nickname=f.elements.nickname.value;
    var result=await post(register?'register':'login',data);location.href=result.next;
   }catch(e){error(e.message);submit.disabled=false;}
  };
  button(register?'이미 계정이 있어요 · 로그인':'계정이 없나요? 회원가입',function(){form(!register);}).classList.add('account-link');
  button('비회원으로 시작',function(){location.href=next;}).classList.add('account-link');username.focus();
 }
 async function logout(){try{await post('logout');location.href='/';}catch(e){error(e.message);}}
 function userBar(){
  if(!new URLSearchParams(location.search).has('server'))return;
  var bar=el('div');bar.id='AccountBar';document.body.appendChild(bar);
  if(state.user){var name=el('button',state.user.nickname);if(state.user.developer)name.appendChild(badge());name.onclick=function(){shell('내 계정');card.appendChild(el('p',state.user.nickname));button('로그아웃',logout);};bar.appendChild(name);}
  else{var b=el('button','로그인');b.onclick=function(){next='/?server='+new URLSearchParams(location.search).get('server');form(false);};bar.appendChild(b);}
 }
 document.addEventListener('DOMContentLoaded',function(){
  overlay=el('div');overlay.id='AccountOverlay';overlay.hidden=true;card=el('section');card.id='AccountCard';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','AccountTitle');overlay.appendChild(card);document.body.appendChild(overlay);
  overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
  overlay.addEventListener('keydown',function(e){if(e.key==='Escape')close();if(e.key==='Tab'){var all=card.querySelectorAll('button:not(:disabled),input');var first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  session().then(function(){userBar();var mode=new URLSearchParams(location.search).get('account');if(mode==='login')form(false);if(mode==='logout'){shell('로그아웃');button('로그아웃',logout);}}).catch(function(){if(new URLSearchParams(location.search).has('server')){state={user:null};userBar();state=null;}});
 });
 window.KkutuAccount={start:start,login:function(){form(false);}};
})();
