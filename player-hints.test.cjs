const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const api={},Lizard=require('./Server/lib/sub/lizard');
vm.runInNewContext(fs.readFileSync('Server/lib/Game/games/classic.js','utf8'),{
 exports:api,console,setTimeout(){},clearTimeout(){},
 require:n=>n.includes('lizard')?Lizard:{GAME_TYPE:{3:'KSH'}}
});
api.init({kkutu:{ko:{
 findOne:()=>({on:cb=>cb({_id:'가방',mean:'bag',type:'1',hit:0})}),
 update:()=>({set:()=>({on(){}})})
}}},{});
function play(shortcut){
 let result;
 const room={gaming:true,mode:3,opts:{dictionary:'standard',shield:0},rule:{lang:'ko'},
  game:{seq:['current','helper'],turn:0,playerHints:[],hintAuthors:{},char:'가',chain:['가구'],dic:{},turnAt:Date.now(),turnTime:15000,roundTime:60000},
  getScore:()=>100,byMaster(){},turnNext(){}};
 const client={id:'current',game:{score:0},publish:(_,r)=>result=r,invokeWordPiece(){},chat(){}};
 api.playerHint.call(room,{id:'current'},{value:'가방'});
 assert.equal(room.game.playerHints.length,0,'current player cannot provide own hints');
 api.playerHint.call(room,{id:'helper',send(){}},{value:'가방'});
 assert.equal(room.game.playerHints[0],'가방');
 if(shortcut)api.usePlayerHint.call(room,client,{index:0});
 else api.submit.call(room,client,'가방');
 assert.ok(result.ok);assert.equal(client.game.score,shortcut?50:100);
 assert.equal(result.hintUsed,shortcut);
}
play(true);play(false);
api.init({kkutu:{ko:{findOne:()=>({on:cb=>cb(null)})}}},{});
let rejected;
const room={gaming:true,rule:{lang:'ko'},opts:{dictionary:'basic'},game:{turnAt:1,seq:['a'],turn:0,playerHints:[],hintAuthors:{}}};
api.playerHint.call(room,{id:'b',send:(_,r)=>rejected=r},{value:'없는단어'});
assert.equal(rejected.valid,false);assert.equal(room.game.playerHints.length,0);
api.checkPrediction.call(room,{id:'c',send:(_,r)=>rejected=r},{value:'없는단어'});
assert.equal(rejected.valid,false);assert.equal(rejected.kind,'prediction');
console.log('PASS: teammate hints, server-side half score for numbered selection, full score for direct typing');
api.init({kkutu:{ko:{findOne:()=>({on:cb=>cb({_id:'가방',type:'1',hit:0})}),find:()=>({limit:()=>({on:cb=>cb([])})}),update:()=>({set:()=>({on(){}})})}},kkutu_manner:{ko:{findOne:()=>({on:cb=>cb(null)}),upsert:()=>({set:()=>({on(){}})})}}},{});
for(const count of [14,15]){
 let result;
 const gameRoom={gaming:true,mode:3,opts:{dictionary:'standard',shield:15},rule:{lang:'ko'},game:{seq:['p'],turn:0,char:'가',chain:Array(count).fill('가구'),dic:{},turnAt:Date.now(),turnTime:15000,roundTime:60000},getScore:()=>100,turnNext(){}};
 api.submit.call(gameRoom,{id:'p',game:{score:0},publish:(_,r)=>result=r,invokeWordPiece(){},chat(){}},'가방');
 assert.equal(count===14?result.code:result.ok,count===14?403:true);
}
console.log('PASS: shield rejects dead end before 15 and allows it after 15 accepted words');
