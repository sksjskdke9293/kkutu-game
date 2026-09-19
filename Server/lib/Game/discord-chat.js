'use strict';

// One bridge per game master. Workers forward accepted public chat over IPC.
const https = require('https');
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
  return {
    enabled,
    start() { if (enabled && !started) { started = true; tick(); } },
    stop() { stopped = true; cancel(timer); queue.length = 0; },
    send(message) {
      if (!enabled || stopped || !message || !clean(message.value, 200).trim()) return;
      if (queue.length >= 200) { log('Discord chat queue full; message skipped.'); return; }
      const time = new Date((message.timestamp || now()) + 9 * 3600000).toISOString().slice(11, 19);
      const content = '[' + time + ' KST] ' + clean(message.name, 80) + ': ' + clean(message.value, 200);
      queue.push({content, allowed_mentions: {parse: []},
        nonce: String(message.timestamp || now()) + '-' + String(options.sequence = (options.sequence || 0) + 1), enforce_nonce: true});
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
