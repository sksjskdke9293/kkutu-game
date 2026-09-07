const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync('Server/lib/Web/main.js','utf8');
let retry;
class WS {
 constructor(){this.readyState=0;this.events={};}
 on(name,fn){this.events[name]=fn;}
 send(data){assert.equal(this.readyState,1);this.sent=JSON.parse(data);}
 removeAllListeners(){this.events={};}
}
WS.OPEN=1;
const context={WS,JLog:{info(){},warn(){},error(){}},setTimeout(fn){retry=fn;},clearTimeout(){}};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function GameClient('),source.indexOf('ROUTES.forEach')),context);
const client=new context.GameClient('test','ws://test');
client.send('seek');
const first=client.socket; first.readyState=1; first.events.open();
assert.equal(first.sent.type,'seek');
first.events.close(1006); assert.equal(client.seek,null); assert.ok(retry);
retry(); assert.notEqual(client.socket,first);
client.socket.readyState=1;client.socket.events.open();
client.socket.events.message(JSON.stringify({type:'seek',value:2}));
assert.equal(client.seek,2);
console.log('PASS: disconnected status connection reconnects and refreshes server population');
