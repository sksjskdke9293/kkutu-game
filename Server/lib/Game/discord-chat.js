'use strict';

// One bridge per game master. Workers forward accepted public chat over IPC.
const https = require('https');
const WebSocket = require('ws');
const profanity = require('./profanity');
function clean(value, limit) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, limit);
}
function request(token, method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = https.request({hostname: 'discord.com', path: '/api/v10' + path, method,
      headers: {Authorization: 'Bot ' + token, 'Content-Type': 'application/json',
        'User-Agent': 'KKuTu-Discord-Chat/1.0', 'Content-Length': Buffer.byteLength(data)}}, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('error', reject);
      res.on('end', () => {
        let result;
        try { result = raw ? JSON.parse(raw) : {}; } catch (_) { return reject(new Error('Invalid Discord response')); }
        resolve({status: res.statusCode, data: result, headers: res.headers});
      });
    });
    req.setTimeout(10000, () => req.destroy(new Error('Discord timeout')));
    req.on('error', reject);
    req.end(data);
  });
}
function newer(a, b) { return a.length !== b.length ? a.length > b.length : a > b; }
function create(options) {
  const env = options.env || process.env;
  const token = env.DISCORD_BOT_TOKEN;
  const channel = env.DISCORD_CHAT_CHANNEL_ID;
  const enabled = !!(token && /^\d{17,20}$/.test(channel || ''));
  const api = options.request || request;
  const schedule = options.schedule || setTimeout;
  const cancel = options.cancel || clearTimeout;
  const log = options.log || (() => {});
  const queue = [];
  const reports = new Map();
  let socket, heartbeat, reconnect, sequence = null;
  let stopped = false, started = false, timer, cursor = null, nextRead = 0, pauseUntil = 0;
  let failures = 0;
  const now = options.now || Date.now;
  const base = '/channels/' + channel + '/messages';

  async function call(method, path, payload) {
    const res = await api(token, method, path, payload);
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      stopped = true;
      log('Discord chat stopped: check bot token, channel ID and channel permissions (HTTP ' + res.status + ').');
      return null;
    }
    if (res.status === 429) {
      pauseUntil = now() + Math.max(1000, Number(res.data.retry_after || 1) * 1000);
      return null;
    }
    if (res.status < 200 || res.status >= 300) throw new Error('Discord HTTP ' + res.status);
    const headers = res.headers || {};
    if (headers['x-ratelimit-remaining'] === '0') {
      pauseUntil = now() + Math.max(1000, Number(headers['x-ratelimit-reset-after'] || 1) * 1000);
    }
    return res.data;
  }

  async function tick() {
    if (stopped || !enabled) return;
    try {
      if (now() >= pauseUntil) {
        if (now() >= nextRead) {
          // Establish a baseline at startup: never replay old channel history.
          const messages = await call('GET', base + (cursor === null ? '?limit=1' : '?limit=100&after=' + cursor));
          if (messages) {
            if (!Array.isArray(messages)) throw new Error('Invalid message list');
            messages.sort((a, b) => a.id === b.id ? 0 : newer(a.id, b.id) ? 1 : -1);
            if (cursor === null) cursor = messages.length ? messages[messages.length - 1].id : '0';
            else messages.forEach(message => {
              if (!newer(message.id, cursor)) return;
              cursor = message.id;
              if (message.channel_id !== channel || !message.author || message.author.bot || message.webhook_id) return;
              if (message.type !== 0 && message.type !== 19) return;
              const content = clean(message.content, 1800);
              if (!content.trim()) return;
              if (profanity.match(content)) {
                log('Discord chat message blocked by profanity filter.');
                return;
              }
              options.onMessage({name: clean((message.member && message.member.nick) || message.author.global_name || message.author.username, 80),
                value: content, timestamp: message.timestamp});
            });
            nextRead = now() + (messages.length === 100 ? 500 : 2000);
          }
        }
        if (!stopped && now() >= pauseUntil && queue.length) {
          const entry = queue[0];
          const result = await call('POST', base, entry);
          if (result) queue.shift();
        }
        failures = 0;
      }
    } catch (_) {
      failures++;
      pauseUntil = now() + Math.min(60000, 2000 * Math.pow(2, Math.min(failures, 5)));
      if (failures === 1) log('Discord chat unavailable; retrying. Game chat remains available.');
    }
    if (!stopped) timer = schedule(tick, Math.max(500, pauseUntil - now()));
  }

  async function respond(interaction, content) {
    await api(token, 'POST', '/interactions/' + interaction.id + '/' + interaction.token + '/callback',
      {type: 4, data: {content: content, flags: 64, allowed_mentions: {parse: []}}});
  }

  function connectGateway() {
    if(stopped || !enabled || !options.onModerate) return;
    socket = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    socket.on('message', raw => {
      let packet;
      try { packet = JSON.parse(raw); } catch (_) { return; }
      if(packet.s !== null && packet.s !== undefined) sequence = packet.s;
      if(packet.op === 10){
        clearInterval(heartbeat);
        heartbeat = setInterval(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({op:1,d:sequence})), packet.d.heartbeat_interval);
        socket.send(JSON.stringify({op:2,d:{token:token,intents:1,properties:{$os:'linux',$browser:'kkutu-chat',$device:'kkutu-chat'}}}));
      }else if(packet.op === 0 && packet.t === 'INTERACTION_CREATE'){
        const interaction = packet.d;
        const match = interaction && interaction.data && /^chat_ban_(account|ip|ipunban)_([a-f0-9]{24})$/.exec(interaction.data.custom_id || '');
        if(!match) return;
        let permissions = 0n;
        try { permissions = BigInt(interaction.member && interaction.member.permissions || '0'); } catch (_) {}
        if(!(permissions & 4n) && !(permissions & 8n)) return void respond(interaction, '서버의 멤버 차단 권한이 있는 운영자만 사용할 수 있습니다.').catch(() => {});
        const report = reports.get(match[2]);
        if(!report) return void respond(interaction, '신고 정보가 만료되었습니다. 관리자 페이지에서 처리해 주세요.').catch(() => {});
        Promise.resolve(options.onModerate(match[1], report)).then(result => {
          return respond(interaction, result && result.message || '처리가 완료되었습니다.');
        }).catch(error => { log('Discord chat moderation failed: ' + error.message); return respond(interaction, '처리 중 오류가 발생했습니다.'); });
      }else if(packet.op === 7) socket.close();
    });
    socket.on('error', error => log('Discord chat gateway error: ' + error.message));
    socket.on('close', () => { clearInterval(heartbeat); if(!stopped) reconnect = setTimeout(connectGateway, 5000); });
  }
  return {
    enabled,
    start() { if (enabled && !started) { started = true; tick(); connectGateway(); } },
    stop() { stopped = true; cancel(timer); clearTimeout(reconnect); clearInterval(heartbeat); if(socket) socket.close(); queue.length = 0; },
    send(message) {
      if (!enabled || stopped || !message || !clean(message.value, 200).trim()) return;
      if (queue.length >= 200) { log('Discord chat queue full; message skipped.'); return; }
      const time = new Date((message.timestamp || now()) + 9 * 3600000).toISOString().slice(11, 19);
      const content = '[' + time + ' KST] ' + clean(message.name, 80) + ': ' + clean(message.value, 200);
      queue.push({content, allowed_mentions: {parse: []},
        nonce: String(message.timestamp || now()) + '-' + String(options.sequence = (options.sequence || 0) + 1), enforce_nonce: true});
    },
    report(message, reporter) {
      if(!enabled || stopped || !message) return;
      const key = require('crypto').randomBytes(12).toString('hex');
      reports.set(key, message);
      const room = message.scope === 'room' ? '방 #' + (message.room || '?') : '메인';
      queue.push({
        embeds:[{title:'🚨 채팅 신고', color:0xe5484d,
          fields:[{name:'작성자',value:clean(message.name,80)+' (`'+clean(message.id,80)+'`)',inline:true},
            {name:'위치',value:room,inline:true},{name:'신고자',value:clean(reporter && reporter.name,80)+' (`'+clean(reporter && reporter.id,80)+'`)',inline:false},
            {name:'내용',value:clean(message.value,900)||'(내용 없음)',inline:false}],
          timestamp:new Date(message.timestamp||now()).toISOString()}],
        components:[{type:1,components:[
          {type:2,style:4,custom_id:'chat_ban_account_'+key,label:'일반 밴',emoji:{name:'🔨'}},
          {type:2,style:4,custom_id:'chat_ban_ip_'+key,label:'IP 밴',emoji:{name:'⛔'}},
          {type:2,style:3,custom_id:'chat_ban_ipunban_'+key,label:'IP 밴 해제',emoji:{name:'✅'}}]}],
        allowed_mentions:{parse:[]}
      });
    },
    violation(event) {
      if(!enabled || stopped || !event) return;
      const key = require('crypto').randomBytes(12).toString('hex');
      reports.set(key, event);
      queue.push({embeds:[{title:event.blocked?'⛔ 욕설 누적 자동 IP 밴':'⚠️ 욕설 경고',color:event.blocked?0xc62828:0xf0a000,
        fields:[{name:'이용자',value:clean(event.name,80)+' (`'+clean(event.id,80)+'`)',inline:true},
          {name:'누적',value:String(event.count)+'회',inline:true},
          {name:'작성한 채팅',value:clean(event.value,900)||'(내용 없음)',inline:false},
          {name:'감지 표현',value:clean(event.matched,120),inline:false}],timestamp:new Date().toISOString()}],
        components:[{type:1,components:[{type:2,style:3,custom_id:'chat_ban_ipunban_'+key,label:'IP 밴 해제',emoji:{name:'✅'}}]}],allowed_mentions:{parse:[]}});
    }
  };
}
exports.create = create;
exports.forward = function(message) {
  if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CHAT_CHANNEL_ID) return;
  if (require('cluster').isWorker) {
    if (process.connected) process.send({type: 'discord-chat-out', data: message});
  } else process.emit('discord-chat-out', message);
};
