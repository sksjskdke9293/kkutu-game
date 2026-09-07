/* Temporary visual audit: keeps a successful bot word on screen for a
 * browser-spectator check of the display, history, definition panel, and
 * centered player strip. */
const sockets = [];
const TEST_ORIGIN = resolveTestOrigin();
let finished = false;
let invited = false;
let started = false;
let roomId = '';
function resolveTestOrigin() {
  const target = new URL(process.env.KKUTU_TEST_ORIGIN || 'https://kkutugame.kro.kr');
  if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('KKUTU_TEST_ORIGIN must use http or https');
  return target.origin;
}
function finish(message) {
  if (finished) return;
  finished = true;
  console.log(message);
  sockets.forEach((socket) => { try { socket.close(); } catch (_) {} });
  setTimeout(() => process.exit(0), 250);
}
(async () => {
  const html = await (await fetch(`${TEST_ORIGIN}/?server=0`)).text();
  const url = html.match(/id="URL">([^<]+)/)[1].replace(/&amp;/g, '&');
  const lobby = new WebSocket(url);
  sockets.push(lobby);
  const timeout = setTimeout(() => finish(`UI_WORD_AUDIT_TIMEOUT:${roomId || 'none'}`), 90000);
  lobby.onerror = () => finish('UI_WORD_AUDIT_ERROR:lobby');
  lobby.onmessage = ({ data }) => {
    const event = JSON.parse(data);
    if (event.type === 'welcome') {
      lobby.send(JSON.stringify({ type: 'enter', title: 'Word UI audit', password: '', limit: 2, mode: 3, round: 3, time: 60, opts: { dictionary: 'standard' } }));
      return;
    }
    if (event.type === 'error') finish(`UI_WORD_AUDIT_ERROR:lobby-${event.code}`);
    if (event.type !== 'preRoom') return;
    roomId = event.id;
    console.log(`UI_WORD_AUDIT_ROOM:${roomId}`);
    const room = new WebSocket(url.replace(/:(\d+)/, (_, port) => `:${Number(port) + 416 + Number(event.channel) - 1}`) + `&${event.channel}&${event.id}`);
    sockets.push(room);
    room.onerror = () => finish('UI_WORD_AUDIT_ERROR:room');
    room.onmessage = ({ data: roomData }) => {
      const message = JSON.parse(roomData);
      if ((message.type === 'room' || message.type === 'connRoom') && !invited) {
        invited = true;
        setTimeout(() => {
          room.send(JSON.stringify({ type: 'invite', target: 'AI' }));
          setTimeout(() => {
            if (!started) {
              started = true;
              room.send(JSON.stringify({ type: 'start' }));
            }
          }, 1200);
        }, 350);
      }
      if (message.type === 'room' && message.room && message.room.players.some((player) => player && player.robot) && !started) {
        started = true;
        room.send(JSON.stringify({ type: 'start' }));
      }
      if (message.type === 'turnEnd' && message.ok) {
        clearTimeout(timeout);
        console.log(`UI_WORD_AUDIT_ACCEPTED:${message.value}`);
        setTimeout(() => finish('UI_WORD_AUDIT_DONE'), 90000);
      }
      if (message.type === 'error' && message.code === 412) {
        setTimeout(() => room.send(JSON.stringify({ type: 'start' })), 2000);
        return;
      }
      if (message.type === 'error') finish(`UI_WORD_AUDIT_ERROR:room-${message.code}`);
    };
  };
})().catch((error) => finish(`UI_WORD_AUDIT_ERROR:${error.message}`));
