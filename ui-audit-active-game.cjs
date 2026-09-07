/* Temporary external-host room for visual UI review.  It deliberately starts
 * the normal game with an AI before a browser visits, so the browser can
 * inspect it as a spectator without becoming an unready player. */
const sockets = [];
const TEST_ORIGIN = resolveTestOrigin();
let roomId;
let invited = false;
let started = false;
let active = false;
let closed = false;
let startAttempts = 0;

function resolveTestOrigin() {
  const target = new URL(process.env.KKUTU_TEST_ORIGIN || 'https://kkutugame.kro.kr');
  if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('KKUTU_TEST_ORIGIN must use http or https');
  return target.origin;
}

function log(message) {
  console.log(`${new Date().toISOString()} ${message}`);
}

function finish(reason) {
  if (closed) return;
  closed = true;
  log(`UI_AUDIT_ACTIVE_CLOSED:${reason}`);
  for (const socket of sockets) {
    try { socket.close(); } catch (_) { /* no-op */ }
  }
  setTimeout(() => process.exit(0), 250);
}

function openRoom(baseUrl, channel, id) {
  roomId = id;
  const roomUrl = baseUrl.replace(/:(\d+)/, (_, port) => `:${Number(port) + 416 + Number(channel) - 1}`) + `&${channel}&${id}`;
  const room = new WebSocket(roomUrl);
  sockets.push(room);
  room.onerror = () => finish('room-websocket-error');
  room.onmessage = ({ data }) => {
    let event;
    try { event = JSON.parse(data); } catch (_) { return; }
    if (event.type === 'error') {
      log(`UI_AUDIT_ACTIVE_ERROR:${event.code}`);
      // 412 is only a transient readiness response.  Do not throw away the
      // room; later room state can still show the robot and let us retry.
      if (event.code === 412 && startAttempts < 2) {
        setTimeout(() => {
          if (!closed) {
            startAttempts += 1;
            log(`UI_AUDIT_ACTIVE_START_RETRY:${startAttempts}`);
            room.send(JSON.stringify({ type: 'start' }));
          }
        }, 2_000);
      } else if (event.code !== 412) {
        finish(`room-error-${event.code}`);
      }
      return;
    }
    if ((event.type === 'room' || event.type === 'connRoom') && !invited) {
      invited = true;
      setTimeout(() => {
        if (!closed) {
          log('UI_AUDIT_ACTIVE_INVITING_AI');
          room.send(JSON.stringify({ type: 'invite', target: 'AI' }));
          // This is the same optimistic start fallback used by the proven
          // bot-live-smoke normal-mode path.  Some room revisions only emit
          // connRoom to an external host, so waiting exclusively for a later
          // room snapshot can leave the audit room idle forever.
          setTimeout(() => {
            if (!closed && !started) {
              started = true;
              startAttempts += 1;
              log('UI_AUDIT_ACTIVE_STARTING_FALLBACK');
              room.send(JSON.stringify({ type: 'start' }));
            }
          }, 1_200);
        }
      }, 450);
    }
    if (event.type === 'room' && event.room) {
      const players = Array.isArray(event.room.players) ? event.room.players : [];
      const aiIsPresent = players.some((player) => player && player.robot);
      log(`UI_AUDIT_ACTIVE_STATE:players=${players.length};ai=${aiIsPresent};gaming=${Boolean(event.room.gaming)}`);
      if (aiIsPresent && !started && !event.room.gaming) {
        started = true;
        startAttempts += 1;
        log('UI_AUDIT_ACTIVE_STARTING');
        room.send(JSON.stringify({ type: 'start' }));
      }
    }
    if (event.type === 'roundReady' && !active) {
      active = true;
      log(`UI_AUDIT_ACTIVE_READY:${roomId}`);
      log(`UI_AUDIT_ACTIVE_URL:https://kkutugame.kro.kr/?server=0#${roomId}`);
    }
    if (event.type === 'turnStart') log(`UI_AUDIT_ACTIVE_TURN:${event.target || 'unknown'}`);
  };
}

(async () => {
  // Same discovery path as the passing bot-live-smoke test.  This avoids the
  // malformed room-create payload that produces game error 431.
  const html = await (await fetch(`${TEST_ORIGIN}/?server=0`)).text();
  const found = html.match(/id="URL">([^<]+)/);
  if (!found) throw new Error('production websocket discovery failed');
  const baseUrl = found[1].replace(/&amp;/g, '&');
  const lobby = new WebSocket(baseUrl);
  sockets.push(lobby);
  lobby.onerror = () => finish('lobby-websocket-error');
  lobby.onmessage = ({ data }) => {
    let event;
    try { event = JSON.parse(data); } catch (_) { return; }
    if (event.type === 'welcome') {
      lobby.send(JSON.stringify({
        type: 'enter',
        title: 'Visual UI audit',
        password: '',
        limit: 2,
        mode: 3,
        // Ten is the server's maximum valid round count.  A 150-second
        // round keeps the visual-audit room available while the browser
        // connects as a spectator.
        round: 10,
        time: 150,
        opts: { dictionary: 'standard' }
      }));
      return;
    }
    if (event.type === 'preRoom') {
      log(`UI_AUDIT_ACTIVE_ROOM:${event.id}`);
      openRoom(baseUrl, event.channel, event.id);
      return;
    }
    if (event.type === 'error') finish(`lobby-error-${event.code}`);
  };
  setTimeout(() => finish('time-limit'), 240_000);
})().catch((error) => {
  log(`UI_AUDIT_ACTIVE_FATAL:${error.message}`);
  finish('fatal');
});
