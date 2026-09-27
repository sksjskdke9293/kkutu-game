(function(){
 'use strict';
 var form=document.getElementById('AdminLoginForm'),error=document.getElementById('AdminLoginError'),submit=form.querySelector('button');
 form.addEventListener('submit',async function(event){
  event.preventDefault();error.textContent='';submit.disabled=true;
  try{
   var session=await fetch('/account/session',{credentials:'same-origin',cache:'no-store'}).then(function(response){if(!response.ok)throw Error();return response.json();});
   var response=await fetch('/admin/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf},body:JSON.stringify({username:form.username.value,password:form.password.value})});
   var result=await response.json();
   if(!response.ok)throw Error(result.error||'로그인하지 못했습니다.');
   location.replace('/admin');
  }catch(reason){error.textContent=reason.message||'잠시 후 다시 시도해 주세요.';submit.disabled=false;}
 });
})();
