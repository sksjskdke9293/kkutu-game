'use strict';

const https = require('https');

function create(options) {
	const env = options.env || process.env;
	const token = env.DISCORD_BOT_TOKEN;
	const channel = env.DISCORD_STATUS_CHANNEL_ID;
	const enabled = !!(token && /^\d{17,20}$/.test(channel || ''));
	const interval = options.interval || 300000;
	const getCount = options.getCount || (() => 0);
	const log = options.log || (() => {});
	let stopped = false;
	let lastName = null;
	let timer = null;
	let retryAfter = 0;

	function rename(name) {
		return new Promise((resolve, reject) => {
			const body = JSON.stringify({ name });
			const request = https.request({
				hostname: 'discord.com', path: '/api/v10/channels/' + channel, method: 'PATCH',
				headers: { Authorization: 'Bot ' + token, 'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(body), 'User-Agent': 'KKuTu-Discord-Status/1.0' }
			}, response => {
				let responseBody = '';
				response.on('data', chunk => { if(responseBody.length < 4096) responseBody += chunk; });
				response.on('end', () => {
					if(response.statusCode >= 200 && response.statusCode < 300) return resolve();
					if(response.statusCode === 429){
						try { retryAfter = Date.now() + Math.max(1000, Number(JSON.parse(responseBody).retry_after || 300) * 1000); }
						catch (_) { retryAfter = Date.now() + 300000; }
					}
					reject(new Error('Discord HTTP ' + response.statusCode));
				});
			});
			request.setTimeout(10000, () => request.destroy(new Error('Discord timeout')));
			request.on('error', reject);
			request.end(body);
		});
	}

	async function tick() {
		if (stopped || !enabled) return;
		if(retryAfter > Date.now()){
			timer = setTimeout(tick, retryAfter - Date.now());
			return;
		}
		const count = Math.max(0, Number(getCount()) || 0);
		const name = '🎮 온라인 ' + count + '명';
		try {
			if (name !== lastName) {
				await rename(name);
				lastName = name;
			}
		} catch (error) {
			log('Discord status update unavailable: ' + error.message);
		}
		if (!stopped) timer = setTimeout(tick, interval);
	}

	return {
		enabled,
		start() { if (enabled && !timer) tick(); },
		stop() { stopped = true; if (timer) clearTimeout(timer); }
	};
}

exports.create = create;
