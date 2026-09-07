'use strict';

const Fs = require('fs');
const Path = require('path');
const Spawn = require('child_process').spawn;

const required = [ 'POSTGRES_PASSWORD', 'KKUTU_PASS' ];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
	console.error(`Missing required private runtime configuration: ${missing.join(', ')}`);
	process.exit(1);
}

const configPath = '/app/Server/lib/sub/global.json';
const authPath = '/app/Server/lib/sub/auth.json';
const config = {
	ADMIN: [],
	MAIN_PORTS: [ 8080 ],
	GAME_SERVER_HOST: process.env.GAME_SERVER_HOST || 'game',
	KKUTUHOT_PATH: '/kkutu/data/kkutuhot.json',
	PASS: process.env.KKUTU_PASS,
	PG_HOST: process.env.PG_HOST || 'db',
	PG_USER: process.env.PG_USER || 'postgres',
	PG_PASSWORD: process.env.POSTGRES_PASSWORD,
	PG_PORT: Number(process.env.PG_PORT || 5432),
	PG_DATABASE: process.env.PG_DATABASE || 'main',
	GOOGLE_RECAPTCHA_TO_GUEST: false,
	GOOGLE_RECAPTCHA_TO_USER: false,
	GOOGLE_RECAPTCHA_SITE_KEY: '',
	GOOGLE_RECAPTCHA_SECRET_KEY: '',
	IS_SECURED: false,
	SSL_OPTIONS: { PRIVKEY: '', CERT: '', CA: '', PFX: '', isPFX: false, isCA: false },
	USER_BLOCK_OPTIONS: {
		USE_MODULE: false,
		USE_X_FORWARDED_FOR: false,
		BLOCK_IP_ONLY_FOR_GUEST: true,
		DEFAULT_BLOCKED_TEXT: 'Service unavailable.',
		BLOCKED_FOREVER: 'Blocked'
	}
};

Fs.mkdirSync(Path.dirname(configPath), { recursive: true });
Fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });

if (!Fs.existsSync(authPath)) {
	Fs.copyFileSync('/app/Server/lib/sub/auth.inc.json', authPath);
	Fs.chmodSync(authPath, 0o600);
}

const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
	console.error('No application command was supplied.');
	process.exit(1);
}

const child = Spawn(command, args, { stdio: 'inherit' });
const forward = (signal) => child.kill(signal);

process.on('SIGINT', () => forward('SIGINT'));
process.on('SIGTERM', () => forward('SIGTERM'));
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code || 0)));
