const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('Server/lib/Web/lib/kkutu/ready.js','utf8');
const events={}, sent=[];
const field=()=>({text:'',attrs:{},val(v){if(v===undefined)return this.text;this.text=v;return this;},focus(){return this;},prop(){return this;},attr(v){if(v&&typeof v==='object')Object.assign(this.attrs,v);return this;},on(n,f){events[n]=f;return this;}});
const word=field(),chat=field();
let visible=true;
const context={
 $stage:{game:{here:{is(){return visible;}},hereText:word},talk:chat},
 $data:{room:{gaming:true},_wordInputMode:'answer'},window:{},document:{}, send:(t,d)=>sent.push({t,...d}), checkInput(){},runCommand(){},
 $:(target)=>target===word?word:({hasClass(){return true;},appendTo(){return this;},on(){return this;},is(){return false;},val(){return '';}})
};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('\tfunction submitGameWord(){'),source.indexOf('\t$("#cw-q-input")')),context);
word.val('나무'); events.keydown({key:'Enter',preventDefault(){}});
assert.equal(sent[0].value,'나무'); assert.equal(sent[0].relay,true); assert.equal(word.val(),'');
word.val('한글');events.compositionstart();events.keydown({key:'Enter',preventDefault(){}});assert.equal(sent.length,1);
events.compositionend();events.keydown({key:'Enter',preventDefault(){}});assert.equal(sent.length,2);
visible=false;word.val('숨김');context.submitGameWord();assert.equal(sent.length,2);
visible=true;context.$data.room.gaming=false;context.submitGameWord();assert.equal(sent.length,2);
context.$data.room.gaming=true;
const start=source.indexOf("\t$stage.chatBtn.on('click', function(e){")+"\t$stage.chatBtn.on('click', function(e){".length;
const end=source.indexOf('}).hotkey($stage.talk, 13);',start);
vm.runInContext('function submitChat(){'+source.slice(start,end)+'}',context);
chat.val('채팅입니다');word.val('게임단어');context.submitChat();
assert.equal(sent[2].value,'채팅입니다');assert.equal(sent[2].relay,undefined);assert.equal(word.val(),'게임단어');
console.log('PASS: game Enter routes relay, IME guard, hidden/out-of-game guard, chat stays chat and preserves word input');
context.$data._wordInputMode='hint';word.val('가방');context.submitGameWord();
assert.equal(sent[3].t,'playerHint');assert.equal(sent[3].relay,undefined);
context.$data._wordInputMode='prediction';word.val('방문');context.submitGameWord();
assert.equal(context.$data._prediction,undefined);assert.equal(sent.length,5);
assert.equal(sent[4].t,'checkPrediction');assert.equal(sent[4].value,'방문');
console.log('PASS: prediction requests dictionary validation before saving');

function eventWith(inputType){
  let prevented=false;
  return {event:{originalEvent:{inputType},preventDefault(){prevented=true;}},wasPrevented:()=>prevented};
}
for(const inputType of ['insertFromPaste','insertFromDrop','insertFromYank','insertReplacementText']){
  const probe=eventWith(inputType);
  assert.equal(events['beforeinput.answerIntegrity'].call(word,probe.event),false);
  assert.equal(probe.wasPrevented(),true,`${inputType} must be rejected in the answer field`);
}
const typed=eventWith('insertText');
word.val('직접입력');
assert.equal(events['beforeinput.answerIntegrity'].call(word,typed.event),undefined);
assert.equal(typed.wasPrevented(),false,'ordinary and Korean IME text must remain typeable');
word.val('자동완성단어');
assert.equal(events['input.answerIntegrity'].call(word,eventWith('insertReplacementText').event),undefined);
assert.equal(word.val(),'직접입력','a WebView replacement that bypasses beforeinput must be rolled back');
const paste=eventWith('insertFromPaste');
assert.equal(events['paste.answerIntegrity drop.answerIntegrity'].call(word,paste.event),false);
assert.equal(paste.wasPrevented(),true,'legacy paste events must be rejected in the answer field');
assert.deepEqual(word.attrs,{enterkeyhint:'send',autocomplete:'off',autocorrect:'off',autocapitalize:'none',spellcheck:'false',inputmode:'text','aria-autocomplete':'none'});
assert.doesNotMatch(source,/\$\(document\)\.on\('paste'/,'chat paste must not be blocked globally during a game');
assert.doesNotMatch(source,/\$stage\.talk\.on\('drop'/,'chat drop must not be blocked during a game');
console.log('PASS: answer input rejects pasted/drop/auto-replacement text while chat remains unrestricted');
