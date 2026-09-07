const assert=require('node:assert/strict');
const TEST_ORIGIN=resolveTestOrigin();
const sockets=[],players=[];let finished=false,received=0;
function resolveTestOrigin(){
 const target=new URL(process.env.KKUTU_TEST_ORIGIN||'https://kkutugame.kro.kr');
 if(target.protocol!=='https:'&&target.protocol!=='http:')throw new Error('KKUTU_TEST_ORIGIN must use http or https');
 return target.origin;
}
const timer=setTimeout(()=>finish(new Error('Hint broadcast timed out')),45000);
function finish(err){if(finished)return;finished=true;clearTimeout(timer);sockets.forEach(s=>s.close());console.log(err?err.message:'PASS: opponent hint broadcast reached both real players');setTimeout(()=>process.exit(err?1:0),300);}
async function connect(){
 const html=await(await fetch(`${TEST_ORIGIN}/?server=0`)).text();
 const url=html.match(/id="URL">([^<]+)/)[1].replace(/&amp;/g,'&');
 const main=new WebSocket(url),p={url,main};sockets.push(main);players.push(p);
 main.onmessage=({data})=>receive(p,JSON.parse(data),false);
 main.onerror=()=>finish(new Error('Lobby socket error'));
}
function receive(p,m,inRoom){try{
 if(m.type==='welcome'){p.id=m.id;p.main.send(JSON.stringify({type:'matchJoin'}));}
 if(m.type==='match'&&m.state==='vote'&&!p.voted){p.voted=true;p.main.send(JSON.stringify({type:'matchVote',dictionary:'standard'}));}
 if(m.type==='preRoom')setTimeout(()=>{
  p.room=new WebSocket(p.url.replace(/:(\d+)/,(_,n)=>':'+(Number(n)+416+Number(m.channel)-1))+'&'+m.channel+'&'+m.id);
  sockets.push(p.room);p.room.onmessage=({data})=>receive(p,JSON.parse(data),true);
 },300);
 if(m.type==='turnStart'&&inRoom&&!p.sent){p.sent=true;p.room.send(JSON.stringify({type:'playerHint',value:'가방'}));}
 if(m.type==='playerHints'&&!p.received){assert.deepEqual(m.hints,['가방']);p.received=true;if(++received===2)finish();}
 if(m.type==='error')finish(new Error('Protocol error '+m.code));
}catch(e){finish(e);}}
Promise.all([connect(),connect()]).catch(finish);
