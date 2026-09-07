const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const Lizard = require('./Server/lib/sub/lizard');
let pending, selected, queries=0;
const api = {};
vm.runInNewContext(fs.readFileSync('Server/lib/Game/games/classic.js', 'utf8'), {
 exports: api, console, Math,
 require: name => name.includes('lizard') ? Lizard : { GAME_TYPE: {3:'KSH'},getPenalty:()=>0 },
 setTimeout: (fn, delay) => {pending={fn,delay}; return pending;}, clearTimeout: () => {}
});
const words = [{_id:'가방',hit:0},{_id:'가게',hit:0}];
const manner = {
 findOne: () => ({on: cb => cb(null)}),
 upsert: () => ({set: () => ({on: () => {}})})
};
api.init({kkutu_manner:{ko:manner},kkutu:{ko:{
 find: () => {queries++;return {limit: () => ({on: cb => cb(words.slice())})};}
}}}, {});
for (let level=0; level<5; level++) {
 const bot={level,_done:[]};
 const room={gaming:true,mode:3,opts:{dictionary:'standard'},rule:{lang:'ko'},
  game:{char:'가',chain:['가방'],turnAt:123,turnTime:15000,late:false},
  turnRobot: (_,word) => {selected=word;}};
 selected=null; pending=null;queries=0;
 api.readyRobot.call(room,bot);
 assert.equal(queries,1,'must not fan out lookahead scans');
 assert.ok(pending && Number.isFinite(pending.delay));
 assert.equal(room.game.robotTimer,pending);
 pending.fn();
 assert.equal(selected,'가게',`level ${level}: unused zero-hit word`);
 selected=null; room.game.turnAt++;
 pending.fn();
 assert.equal(selected,null,'stale turn must not submit');
}
console.log('PASS: all 5 bot levels use zero-hit words, skip repeated words, and reject stale timers');
// A missing hint callback must not freeze the end-of-turn UI.
api.init({kkutu_manner:{ko:{findOne:()=>({on(){}})}}},{});
let events=0;
const stalled={gaming:true,mode:3,opts:{},rule:{lang:'ko'},game:{
 seq:[{id:'bot',game:{score:0}}],turn:0,turnAt:0,turnTime:100,roundTime:100,loading:true,chain:[],char:'가'
},byMaster(){events++;},roundReady(){}};
api.turnEnd.call(stalled);
assert.equal(stalled.game.loading,false);
const fallback=pending.fn;fallback();fallback();
assert.equal(events,1);
assert.equal(pending.delay,3000);
console.log('PASS: expired validation and missing hint cannot block round advancement');
