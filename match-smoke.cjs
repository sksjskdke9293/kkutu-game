const assert = require('node:assert/strict');
const sockets = [], players = [];
const peerMode = process.argv.includes('--peer');
let started = 0;
const timeout = setTimeout(() => finish(new Error('Two-player match did not start in time')),peerMode ? 90000 : 45000);
function finish(error) {
 clearTimeout(timeout);
 sockets.forEach(s=>s.close());
 if(error) { console.error(error.message); process.exitCode=1; }
 else console.log('PASS: two independent guests queued, voted, joined the same room, and automatically started over TLS.');
 setTimeout(()=>process.exit(process.exitCode || 0),500);
}
async function connect(index) {
 const html = await (await fetch('https://kkutugame.kro.kr/?server=0')).text();
 const url = html.match(/id="URL">([^<]+)/)[1].replace(/&amp;/g,'&');
 const main = new WebSocket(url); sockets.push(main);
 const player = {main, url}; players.push(player);
 main.onmessage = ({data}) => receive(player,JSON.parse(data),false);
 main.onerror = () => finish(new Error('Lobby TLS WebSocket error'));
}
function receive(p,m,room) {
 try {
  if(m.type==='error') throw new Error('Game error '+m.code);
  if(m.type==='welcome') {p.id=m.id; p.main.send(JSON.stringify({type:'matchJoin'}));}
  if(m.type==='match' && m.state==='vote' && !p.voted) {p.voted=true;p.main.send(JSON.stringify({type:'matchVote',dictionary:'standard'}));}
  if(m.type==='match' && m.state==='starting') assert.equal(m.dictionary,'standard');
  if(m.type==='preRoom') {
   p.roomId=m.id;
   const url = p.url.replace(/:(\d+)/, (_,port)=>':'+(Number(port)+416+Number(m.channel)-1))+'&'+m.channel+'&'+m.id;
   setTimeout(()=> {
    p.room=new WebSocket(url);sockets.push(p.room);
    p.room.onmessage=({data})=>receive(p,JSON.parse(data),true);
    p.room.onerror=()=>finish(new Error('Room TLS WebSocket error'));
   },200);
  }
  if(m.type==='roundReady' && room && !p.started) {
   p.started=true;
   if(peerMode) { console.log('PEER STARTED'); clearTimeout(timeout); setTimeout(()=>finish(),60000); return; }
   if(++started===2) {assert.equal(players[0].roomId,players[1].roomId);finish();}
  }
 } catch(e) {finish(e);}
}
Promise.all(peerMode ? [connect(0)] : [connect(0),connect(1)]).catch(finish);
