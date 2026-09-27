(function(){
 'use strict';
 document.addEventListener('DOMContentLoaded',function(){
  var form=document.getElementById('GuestNameEntry'),consent=document.getElementById('GuestPrivacyConsent'),save=document.getElementById('GuestNameSave'),hint=document.getElementById('GuestNameHint');
  if(!form||!consent||!save)return;
  save.disabled=!consent.checked;
  consent.addEventListener('change',function(){save.disabled=!consent.checked;if(consent.checked&&hint&&hint.textContent==='개인정보처리방침에 동의해 주세요.')hint.textContent='';});
  form.addEventListener('submit',function(event){
   if(consent.checked)return;
   event.preventDefault();event.stopImmediatePropagation();
   if(hint)hint.textContent='개인정보처리방침에 동의해 주세요.';
   consent.focus();
  },true);
 });
})();
