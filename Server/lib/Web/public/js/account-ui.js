(function(){
 'use strict';
 var state=null, next='/', overlay, card, lastFocus, viewVersion=0;
 function el(tag,text,cls){var e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
 async function session(){var r=await fetch('/account/session',{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error('계정 정보를 불러오지 못했습니다.');state=await r.json();return state;}
 function error(message){var e=document.getElementById('AccountError');if(e)e.textContent=message;}
 async function post(action,data){
  if(!state)await session();
  var r=await fetch('/account/'+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(data||{})});
  var result=await r.json();if(!r.ok)throw Error(result.error||'요청 실패');return result;
 }
 function close(){if(overlay.dataset.required==='nickname')return;if(document.body.classList.contains('account-login-page')){location.href='/';return;}viewVersion++;overlay.hidden=true;if(lastFocus)lastFocus.focus();}
 function button(text,callback,primary){var b=el('button',text,primary?'primary':'');b.type='button';b.onclick=callback;card.appendChild(b);return b;}
 function shell(title){
  viewVersion++;
  if(overlay.hidden)lastFocus=document.activeElement;
  delete overlay.dataset.required;overlay.hidden=false;card.replaceChildren();
  var x=button('×',close);x.id='AccountClose';x.setAttribute('aria-label','닫기');
  var h=el('h2',title);h.id='AccountTitle';card.appendChild(h);
  var e=el('p');e.id='AccountError';e.setAttribute('role','alert');card.appendChild(e);
 }
async function start(url){
  next=url||'/?server=0';
  try{await session();if(state.user&&state.user.authType==='local'&&!state.user.developer)return linkRequired();location.href=next;}catch(e){location.href=next;}
 }
 function privacyAgreement(form){var row=el('label',null,'account-consent');var check=document.createElement('input');check.type='checkbox';check.required=true;var copy=el('span',null,'account-consent-copy');copy.append('(필수) 개인정보 수집·이용 및 ');var link=el('a','개인정보처리방침');link.href='/privacy.html';link.target='_blank';link.rel='noopener';copy.appendChild(link);copy.append('에 동의합니다.');row.appendChild(check);row.appendChild(copy);form.appendChild(row);return check;}
 function guestPrivacy(url){shell('비회원 개인정보처리방침 동의');card.appendChild(el('p','비회원으로 게임을 시작하기 전에 개인정보처리방침을 확인하고 동의해 주세요. 동의하지 않으면 게임을 시작할 수 없습니다.'));var f=el('form');card.appendChild(f);var consent=privacyAgreement(f);var submit=el('button','동의하고 게임 시작','primary');submit.type='submit';submit.disabled=true;f.appendChild(submit);consent.onchange=function(){submit.disabled=!consent.checked;};f.onsubmit=function(e){e.preventDefault();if(!consent.checked)return;localStorage.setItem('kkutu-privacy-consent-v1','yes');location.href=url;};}
 function socialButton(form,provider,label,register){var b=el('button',register?label+'로 회원가입':label+'로 로그인','account-'+provider);b.type='button';b.onclick=function(){location.href='/login/'+provider;};form.appendChild(b);}
 function selectSocialLink(){shell('연결할 소셜 로그인 선택');card.appendChild(el('p','연동이 완료되면 기존 일반 계정은 삭제되고 레벨, 점수, 전적과 보관함이 선택한 소셜 계정으로 이전됩니다.'));var f=el('div');card.appendChild(f);['discord','google','kakao'].forEach(function(provider){var label={discord:'Discord',google:'Google',kakao:'Kakao'}[provider],b=el('button',label+' 계정 연결','account-'+provider);b.type='button';b.onclick=function(){location.href='/account/link-social/'+provider;};f.appendChild(b);});}
 function linkRequired(){shell('소셜 계정 연동 필요');card.appendChild(el('p','기존 일반 계정은 운영자에게 문의해 소셜 계정으로 이전해 주세요.'));var contact=button('계정 이전 문의',function(){location.href='https://discord.gg/exfaWJDjU';},true);contact.classList.add('account-contact');}
 function nicknameSetup(){shell('게임 닉네임 설정');overlay.dataset.required='nickname';var closeButton=document.getElementById('AccountClose');if(closeButton)closeButton.remove();card.appendChild(el('p','끄투게임에서 사용할 닉네임을 직접 설정해 주세요. Discord를 포함한 새 소셜 계정은 닉네임을 저장한 뒤 게임을 시작할 수 있습니다.'));var f=el('form');card.appendChild(f);var input=el('input');input.placeholder='게임 닉네임 (2~20자)';input.autocomplete='nickname';f.appendChild(input);var consent=privacyAgreement(f);var submit=el('button','동의하고 닉네임 저장','primary');submit.type='submit';submit.disabled=true;f.appendChild(submit);consent.onchange=function(){submit.disabled=!consent.checked;};f.onsubmit=async function(e){e.preventDefault();if(!consent.checked){error('개인정보처리방침에 동의해 주세요.');return;}try{submit.disabled=true;await post('social-nickname',{nickname:input.value,privacyConsent:true});location.reload();}catch(err){error(err.message);submit.disabled=false;}};input.focus();}
 async function form(register){
  shell(register?'회원가입':'로그인');
  var version=viewVersion;
  try{await session();}catch(e){error(e.message);return;}
  if(version!==viewVersion)return;
  var f=el('form');card.appendChild(f);
  card.appendChild(el('p','사용할 소셜 계정을 선택해 주세요.','account-description'));
  socialButton(f,'discord','Discord',register);socialButton(f,'google','Google',register);socialButton(f,'kakao','Kakao',register);
  if(!register){var findPassword=el('button','계정 문의','account-password-find');findPassword.type='button';findPassword.onclick=function(){location.href='https://discord.gg/exfaWJDjU';};f.appendChild(findPassword);}
  button(register?'이미 계정이 있어요 · 로그인':'계정이 없나요? 회원가입',function(){form(!register);}).classList.add('account-link');
 }
 async function logout(){location.href='/logout';}
	function syncPortalLogin(){
		var control=document.querySelector('.portal-account .portal-login');
		if(!control)return;
		if(state&&state.user){
			control.textContent=document.documentElement.lang==='en'?'Logout':'로그아웃';
			control.setAttribute('href','/logout');
			control.onclick=function(){location.href='/logout';};
		}
	}
 function userBar(){
  if(!new URLSearchParams(location.search).has('server'))return;
  var bar=el('div');bar.id='AccountBar';document.body.appendChild(bar);
  if(!state.user){
   var b=el('button','로그인');
   b.onclick=function(){next='/?server='+new URLSearchParams(location.search).get('server');form(false);};
   bar.appendChild(b);
  }else{
   // Logged-in players use the former login-button position for their Ping balance.
   var ping=document.querySelector('.my-stat-ping');
   if(ping){bar.appendChild(ping);ping.style.display='block';}
  }
 }
 document.addEventListener('DOMContentLoaded',function(){
  overlay=el('div');overlay.id='AccountOverlay';overlay.hidden=true;card=el('section');card.id='AccountCard';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','AccountTitle');overlay.appendChild(card);document.body.appendChild(overlay);
  overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
  overlay.addEventListener('keydown',function(e){if(e.key==='Escape')close();if(e.key==='Tab'){var all=card.querySelectorAll('button:not(:disabled),input');var first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  session().then(function(){syncPortalLogin();userBar();var params=new URLSearchParams(location.search),mode=params.get('account'),nativeLogin=params.get('native')==='1';if(mode==='login')document.body.classList.add('account-login-page');if(state.needsNicknameSetup)nicknameSetup();else if(nativeLogin&&state.user){location.href='/native/complete';}else if(state.migrationNotice){shell('계정 연동 완료');card.appendChild(el('p',state.migrationNotice));button('확인',close,true);}else if(mode==='login')form(false);if(mode==='logout')logout();if(params.get('link-required')==='1'&&!(state.user&&state.user.developer))linkRequired();}).catch(function(){if(new URLSearchParams(location.search).has('server')){state={user:null};userBar();state=null;}});
 });
 window.KkutuAccount={start:start,login:function(){form(false);},logout:logout};
})();
