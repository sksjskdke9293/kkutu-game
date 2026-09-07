const sockets=[];
const TEST_ORIGIN=resolveTestOrigin();
let done=false, practiced=false;
const level=Number(process.env.BOT_LEVEL || 2);
const normal=process.argv.includes('--normal');
let startSent=false, turnAt=0, failures=0;
const timer=setTimeout(()=>finish(new Error('Bot did not submit within 60 seconds')),60000);
function resolveTestOrigin(){
 const target=new URL(process.env.KKUTU_TEST_ORIGIN||'https://kkutugame.kro.kr');
 if(target.protocol!=='https:'&&target.protocol!=='http:')throw new Error('KKUTU_TEST_ORIGIN must use http or https');
 return target.origin;
}
function finish(error){
 if(done)return; done=true; clearTimeout(timer);
 sockets.forEach(s=>s.close());
 console.log(error ? error.message : `PASS: live ${normal?'invited':'practice'} level-${normal?4:level} bot submitted an accepted word (${Date.now()-turnAt} ms since turn start)`);
 setTimeout(()=>process.exit(error?1:0),300);
}
(async()=>{
 const html=await(await fetch(`${TEST_ORIGIN}/?server=0`)).text();
 const url=html.match(/id="URL">([^<]+)/)[1].replace(/&amp;/g,'&');
 const main=new WebSocket(url); sockets.push(main);
 main.onerror=()=>finish(new Error('Lobby connection failed'));
 main.onmessage=({data})=>{
  const m=JSON.parse(data);
  if(m.type==='welcome') main.send(JSON.stringify({type:'enter',title:'Bot regression test',password:'',limit:2,mode:3,round:3,time:60,opts:{dictionary:'standard'}}));
  if(m.type==='error')finish(new Error('Lobby error '+m.code));
  if(m.type==='preRoom')setTimeout(()=>{
   const room=new WebSocket(url.replace(/:(\d+)/,(_,p)=>':'+(Number(p)+416+Number(m.channel)-1))+'&'+m.channel+'&'+m.id);
   sockets.push(room);
   room.onerror=()=>finish(new Error('Room connection failed'));
   room.onmessage=({data})=>{
    const r=JSON.parse(data);
    if(['room','connRoom'].includes(r.type) && !practiced){
     practiced=true; setTimeout(()=>{
      room.send(JSON.stringify(normal?{type:'invite',target:'AI'}:{type:'practice',level}));
      if(normal)setTimeout(()=>{if(!startSent){startSent=true;room.send(JSON.stringify({type:'start'}));}},1000);
     },500);
    }
    if(normal && r.type==='room' && r.room && r.room.players.some(p=>p && p.robot) && !startSent){
     startSent=true;room.send(JSON.stringify({type:'start'}));
    }
    if(r.type==='turnStart')turnAt=Date.now();
    if(r.type==='turnEnd' && !r.ok)failures++;
    if(['roundReady','turnStart','turnEnd','turnError','error'].includes(r.type))console.log(JSON.stringify(r));
    if(r.type==='turnEnd' && r.ok)finish();
    if(r.type==='error')finish(new Error('Room error '+r.code));
   };
  },300);
 };
})().catch(finish);
