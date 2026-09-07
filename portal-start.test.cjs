const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const list of [[1],[null]]){
 const elements={},location={},document={};
 const window={location,KkutuAccount:{start(path){location.href=path;}}};
 let alerted=false,ready;
 function $(key){
  if(key===document)return {ready(fn){ready=fn;}};
  if(!elements[key])elements[key]=new Proxy({events:{},on(name,fn){this.events[name]=fn;return this;}},{get(obj,p){return p in obj?obj[p]:()=>elements[key];}});
  return elements[key];
 }
 $.ajax=()=>({
  done(cb){cb({list});return this;},
  fail(){return this;},
  always(cb){cb();return this;}
 });
 vm.runInNewContext(fs.readFileSync('Server/lib/Web/lib/in_portal.js','utf8'),{$,document,window,location,L:{},setInterval(){},setTimeout(){},alert(){alerted=true;}});
 ready();elements['#game-start'].events.click();
 if(list[0]===null){assert.ok(alerted);assert.equal(location.href,undefined);}
 else assert.equal(location.href,'/?server=0');
}
console.log('PASS: main Start navigates to an online server and explains offline status');
