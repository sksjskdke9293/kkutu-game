/*
 * Temporary live UI-audit room helper.
 * It creates a normal room using the exact websocket discovery flow used by
 * bot-live-smoke.cjs, then waits for a browser player before adding an AI and
 * starting the game.  The process exits and closes every socket after 150 s.
 */
const sockets = [];
const TEST_ORIGIN = resolveTestOrigin();
const keepAliveMs = 150_000;
let closed = false;
let roomId;
let roomSocket;
let invitedBot = false;
let startSent = false;
let connectionNotices = 0;

function resolveTestOrigin() {
  const target = new URL(process.env.KKUTU_TEST_ORIGIN || 'https://kkutugame.kro.kr');
  if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('KKUTU_TEST_ORIGIN must use http or https');
  return target.origin;
}

function log(message) {
  console.log(`${new Date().toISOString()} ${message}`);
}

function close(reason) {
  if (closed) return;
  closed = true;
  log(`UI_AUDIT_CLOSED:${reason}`);
  for (const socket of sockets) {
    try { socket.close(); } catch (_) { /* already closed */ }
  }
  setTimeout(() => process.exit(0), 250);
}

function connectRoom(baseUrl, channel, id) {
  roomId = id;
  const roomUrl = baseUrl.replace(/:(\d+)/, (_, port) => `:${Number(port) + 416 + Number(channel) - 1}`) + `&${channel}&${id}`;
  roomSocket = new WebSocket(roomUrl);
  sockets.push(roomSocket);
  roomSocket.onerror = () => close('room-websocket-error');
  roomSocket.onmessage = ({ data }) => {
    let event;
    try { event = JSON.parse(data); } catch (_) { return; }
    if (event.type === 'error') {
      log(`UI_AUDIT_ROOM_ERROR:${event.code}`);
      return close(`room-error-${event.code}`);
    }
    if (event.type !== 'room' && event.type !== 'connRoom') return;
    if (event.type === 'connRoom') {
      connectionNotices += 1;
      log(`UI_AUDIT_CONNECTION:${connectionNotices}:${event.user && event.user.profile ? event.user.profile.name : 'unknown'}`);
      // The room protocol emits one connection notice for the host itself and
      // another when the visual-audit browser joins.  Use that reliable signal
      // rather than parsing any UI-only room payload.
      if (connectionNotices >= 2 && !invitedBot) {
        invitedBot = true;
        log('UI_AUDIT_INVITING_BOT');
        roomSocket.send(JSON.stringify({ type: 'invite', target: 'AI' }));
        setTimeout(() => {
          if (!startSent && !closed) {
            startSent = true;
            log('UI_AUDIT_STARTING_GAME');
            roomSocket.send(JSON.stringify({ type: 'start' }));
          }
        }, 1300);
      }
      return;
    }
    const room = event.room;
    if (!room) return;
    const people = Array.isArray(room.players) ? room.players : [];
    const hasBrowserPlayer = people.length >= 2;
    const hasRobot = people.some((player) => player && player.robot);
    log(`UI_AUDIT_ROOM_STATE:players=${people.length};robot=${hasRobot};gaming=${Boolean(room.gaming)}`);
    if (hasBrowserPlayer && !invitedBot && !room.gaming) {
      invitedBot = true;
      log('UI_AUDIT_INVITING_BOT');
      roomSocket.send(JSON.stringify({ type: 'invite', target: 'AI' }));
      return;
    }
    if (hasBrowserPlayer && hasRobot && !startSent && !room.gaming) {
      startSent = true;
      log('UI_AUDIT_STARTING_GAME');
      roomSocket.send(JSON.stringify({ type: 'start' }));
    }
  };
}

(async () => {
  // Use the raw origin only for bootstrap.  Its HTML points at the production
  // websocket endpoint and matches the known-good live smoke-test protocol.
  const html = await (await fetch(`${TEST_ORIGIN}/?server=0`)).text();
  const found = html.match(/id="URL">([^<]+)/);
  if (!found) throw new Error('Could not discover production websocket URL');
  const baseUrl = found[1].replace(/&amp;/g, '&');
  const lobby = new WebSocket(baseUrl);
  sockets.push(lobby);
  lobby.onerror = () => close('lobby-websocket-error');
  lobby.onmessage = ({ data }) => {
    let event;
    try { event = JSON.parse(data); } catch (_) { return; }
    if (event.type === 'error') {
      log(`UI_AUDIT_LOBBY_ERROR:${event.code}`);
      return close(`lobby-error-${event.code}`);
    }
    if (event.type !== 'welcome') return;
    lobby.send(JSON.stringify({
      type: 'enter',
      title: 'UI audit room',
      password: '',
      limit: 4,
      mode: 3,
      round: 3,
      time: 60,
      opts: { dictionary: 'standard' }
    }));
  };
  lobby.addEventListener('message', ({ data }) => {
    try {
      const event = JSON.parse(data);
      if (event.type === 'preRoom') {
        log(`UI_AUDIT_ROOM:${event.id}`);
        log(`UI_AUDIT_URL:https://kkutugame.kro.kr/?server=0#${event.id}`);
        connectRoom(baseUrl, event.channel, event.id);
      }
    } catch (_) { /* handled by primary listener */ }
  });
  setTimeout(() => close('time-limit'), keepAliveMs);
})().catch((error) => {
  log(`UI_AUDIT_FATAL:${error.message}`);
  close('fatal');
});
