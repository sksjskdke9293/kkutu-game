'use strict';

// Sends a short deployment notice to the configured Discord announcement channel.
const https = require('https');
const message = process.argv.slice(2).join(' ').trim();
const token = process.env.DISCORD_BOT_TOKEN;
const channel = process.env.DISCORD_UPDATE_CHANNEL_ID;

if (!message || !token || !/^\d{17,20}$/.test(channel || '')) process.exit(0);

const body = JSON.stringify({
	content: message.slice(0, 2000),
	allowed_mentions: { parse: [] }
});
const request = https.request({
	hostname: 'discord.com',
	path: '/api/v10/channels/' + channel + '/messages',
	method: 'POST',
	headers: {
		Authorization: 'Bot ' + token,
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(body),
		'User-Agent': 'KKuTu-Deploy/1.0'
	}
}, response => {
	if (response.statusCode < 200 || response.statusCode >= 300) process.exitCode = 1;
});
request.on('error', () => { process.exitCode = 1; });
request.end(body);
