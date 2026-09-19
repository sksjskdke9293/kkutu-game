'use strict';

const https = require('https');
const WebSocket = require('ws');

const PANEL_BUTTON = 'password_ticket_open';
const CLOSE_BUTTON = 'password_ticket_close';
const VIEW_CHANNEL = 1024;
const SEND_MESSAGES = 2048;
const READ_HISTORY = 65536;

function request(token, method, path, body, authenticated) {
	return new Promise((resolve, reject) => {
		const data = body === undefined ? '' : JSON.stringify(body);
		const headers = {
			'Content-Type': 'application/json',
			'User-Agent': 'KKuTu-Password-Tickets/1.0',
			'Content-Length': Buffer.byteLength(data)
		};
		if(authenticated !== false) headers.Authorization = 'Bot ' + token;
		const req = https.request({hostname: 'discord.com', path: '/api/v10' + path, method, headers}, res => {
			let raw = '';
			res.on('data', chunk => { raw += chunk; });
			res.on('end', () => {
				let parsed = {};
				try { parsed = raw ? JSON.parse(raw) : {}; } catch (_) {}
				if(res.statusCode < 200 || res.statusCode >= 300) return reject(new Error('Discord HTTP ' + res.statusCode + ': ' + (parsed.message || raw) + (parsed.errors ? ' ' + JSON.stringify(parsed.errors) : '')));
				resolve(parsed);
			});
		});
		req.setTimeout(10000, () => req.destroy(new Error('Discord timeout')));
		req.on('error', reject);
		req.end(data);
	});
}

function create(options) {
	options = options || {};
	const env = options.env || process.env;
	const token = env.DISCORD_BOT_TOKEN;
	const panelChannel = env.DISCORD_PASSWORD_CHANNEL_ID || '1548160208415621171';
	const enabled = !!(token && /^\d{17,20}$/.test(panelChannel));
	const log = options.log || (() => {});
	let socket, heartbeat, reconnect, sequence = null, stopped = false, botId = null;

	async function api(method, path, body, authenticated) {
		return request(token, method, path, body, authenticated);
	}

	async function ensurePanel() {
		const me = await api('GET', '/users/@me');
		botId = me.id;
		const messages = await api('GET', '/channels/' + panelChannel + '/messages?limit=50');
		const exists = messages.some(message => message.author && message.author.id === botId &&
			(message.components || []).some(row => (row.components || []).some(component => component.custom_id === PANEL_BUTTON)));
		if(exists) return;
		await api('POST', '/channels/' + panelChannel + '/messages', {
			embeds: [{title: '비밀번호 찾기', description: '아래 버튼을 누르면 본인과 서버 주인만 볼 수 있는 비공개 문의 채널이 열립니다.', color: 0x57a773}],
			components: [{type: 1, components: [{type: 2, style: 1, custom_id: PANEL_BUTTON, label: '비번 찾기', emoji: {name: '🔐'}}]}],
			allowed_mentions: {parse: []}
		});
	}

	async function defer(interaction, content) {
		await api('POST', '/interactions/' + interaction.id + '/' + interaction.token + '/callback',
			{type: 5, data: {flags: 64}}, false);
		if(content) await reply(interaction, content);
	}

	async function reply(interaction, content) {
		await api('PATCH', '/webhooks/' + interaction.application_id + '/' + interaction.token + '/messages/@original',
			{content: content, allowed_mentions: {parse: []}}, false);
	}

	function ticketName(user) {
		const base = String(user.global_name || user.username || user.id).toLowerCase()
			.replace(/[^a-z0-9가-힣_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || user.id;
		return ('비번-' + base).slice(0, 50);
	}

	async function ensureTicketControls(channelId, user, ownerId) {
		const messages = await api('GET', '/channels/' + channelId + '/messages?limit=50');
		const exists = messages.some(message => (message.components || []).some(row =>
			(row.components || []).some(component => component.custom_id === CLOSE_BUTTON)));
		if(exists) return;
		const mentionUsers = ownerId === user.id ? [user.id] : [user.id, ownerId];
		await api('POST', '/channels/' + channelId + '/messages', {
			content: '🔐 <@' + user.id + '> 님의 비밀번호 찾기 티켓입니다. 서버 주인 <@' + ownerId + '> 님이 확인할 때까지 문의 내용을 남겨 주세요.\n아래 버튼은 이 티켓을 볼 수 있는 요청자와 서버 주인 모두 사용할 수 있습니다.',
			components: [{type: 1, components: [{type: 2, style: 4, custom_id: CLOSE_BUTTON, label: '티켓 닫기', emoji: {name: '🔒'}}]}],
			allowed_mentions: {parse: [], users: mentionUsers}
		});
	}

	async function openTicket(interaction) {
		await defer(interaction);
		const guildId = interaction.guild_id;
		const user = interaction.member && interaction.member.user;
		if(!guildId || !user) return reply(interaction, '서버 안에서만 사용할 수 있습니다.');
		const channels = await api('GET', '/guilds/' + guildId + '/channels');
		const topic = 'password-ticket:' + user.id;
		const existing = channels.find(channel => channel.topic === topic);
		const guild = await api('GET', '/guilds/' + guildId);
		if(existing) {
			await ensureTicketControls(existing.id, user, guild.owner_id);
			return reply(interaction, '이미 열린 티켓이 있습니다: <#' + existing.id + '>');
		}
		const source = channels.find(channel => channel.id === interaction.channel_id);
		const allowUser = String(VIEW_CHANNEL | SEND_MESSAGES | READ_HISTORY);
		// Keep the bot visible in the private channel. Its server role already
		// supplies send/manage permissions; requesting extra overwrite bits that
		// are absent from the role makes Discord reject channel creation (50013).
		const allowBot = String(VIEW_CHANNEL);
		const overwrites = [
			{id: guildId, type: 0, allow: '0', deny: String(VIEW_CHANNEL)},
			{id: user.id, type: 1, allow: allowUser, deny: '0'}
		];
		if(guild.owner_id !== user.id) overwrites.push({id: guild.owner_id, type: 1, allow: allowUser, deny: '0'});
		if((botId || interaction.application_id) !== user.id && (botId || interaction.application_id) !== guild.owner_id){
			overwrites.push({id: botId || interaction.application_id, type: 1, allow: allowBot, deny: '0'});
		}
		const channel = await api('POST', '/guilds/' + guildId + '/channels', {
			name: ticketName(user), type: 0, topic: topic, parent_id: source && source.parent_id || null,
			permission_overwrites: overwrites
		});
		const mentionUsers = user.id === guild.owner_id ? [user.id] : [user.id, guild.owner_id];
		await ensureTicketControls(channel.id, user, guild.owner_id);
		await reply(interaction, '비공개 티켓이 생성되었습니다: <#' + channel.id + '>');
	}

	async function closeTicket(interaction) {
		await defer(interaction);
		const channel = await api('GET', '/channels/' + interaction.channel_id);
		const match = /^password-ticket:(\d+)$/.exec(channel.topic || '');
		if(!match) return reply(interaction, '비밀번호 티켓 채널이 아닙니다.');
		const guild = await api('GET', '/guilds/' + interaction.guild_id);
		const userId = interaction.member && interaction.member.user && interaction.member.user.id;
		if(userId !== match[1] && userId !== guild.owner_id) return reply(interaction, '티켓을 만든 사람과 서버 주인만 종료할 수 있습니다.');
		await reply(interaction, '티켓을 종료합니다.');
		setTimeout(() => api('DELETE', '/channels/' + interaction.channel_id).catch(error => log('Discord ticket close failed: ' + error.message)), 1000);
	}

	function handleInteraction(interaction) {
		if(interaction.type !== 3 || !interaction.data) return;
		const action = interaction.data.custom_id === PANEL_BUTTON ? openTicket : interaction.data.custom_id === CLOSE_BUTTON ? closeTicket : null;
		if(!action) return;
		action(interaction).catch(async error => {
			log('Discord password ticket failed: ' + error.message);
			try { await reply(interaction, '티켓을 처리하지 못했습니다. 봇의 채널 관리 권한을 확인해 주세요.'); } catch (_) {}
		});
	}

	function connect() {
		if(stopped || !enabled) return;
		socket = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
		socket.on('message', raw => {
			let packet;
			try { packet = JSON.parse(raw); } catch (_) { return; }
			if(packet.s !== null && packet.s !== undefined) sequence = packet.s;
			if(packet.op === 10) {
				clearInterval(heartbeat);
				heartbeat = setInterval(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({op: 1, d: sequence})), packet.d.heartbeat_interval);
				socket.send(JSON.stringify({op: 2, d: {token: token, intents: 1, properties: {$os: 'linux', $browser: 'kkutu', $device: 'kkutu'}}}));
			} else if(packet.op === 0 && packet.t === 'INTERACTION_CREATE') handleInteraction(packet.d);
			else if(packet.op === 7) socket.close();
		});
		socket.on('error', error => log('Discord ticket gateway error: ' + error.message));
		socket.on('close', () => {
			clearInterval(heartbeat);
			if(!stopped) reconnect = setTimeout(connect, 5000);
		});
	}

	return {
		enabled,
		start() {
			if(!enabled) return;
			ensurePanel().then(connect).catch(error => { log('Discord password ticket setup failed: ' + error.message); reconnect = setTimeout(this.start.bind(this), 10000); });
		},
		stop() { stopped = true; clearTimeout(reconnect); clearInterval(heartbeat); if(socket) socket.close(); }
	};
}

exports.create = create;
