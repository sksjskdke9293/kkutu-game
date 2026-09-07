/* Temporary manual visual-regression room.  It keeps a real game alive long
 * enough for a browser to join via #<room id>; it does not modify server data. */
const sockets = [];
const TEST_ORIGIN = resolveTestOrigin();
let roomId = null;
let joinedRoom = false;
let started = false;
const closeAll = () => sockets.splice(0).forEach(socket => {
  try { socket.close(); } catch (_) { /* ignored */ }
});
const end = (code, message) => {
  console.log(message);
  closeAll();
  setTimeout(() => process.exit(code), 250);
};
function resolveTestOrigin() {
  const target = new URL(process.env.KKUTU_TEST_ORIGIN || 'https://kkutugame.kro.kr');
  if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('KKUTU_TEST_ORIGIN must use http or https');
  return target.origin;
}

(async () => {
  const html = await (await fetch(`${TEST_ORIGIN}/?server=0`)).text();
  const socketUrl = html.match(/id="URL">([^<]+)/)[1].replace(/&amp;/g, '&');
  const lobby = new WebSocket(socketUrl);
  sockets.push(lobby);
  const timer = setTimeout(() => end(0, `UI_AUDIT_DONE:${roomId || 'no-room'}`), 115000);

  lobby.onerror = () => end(1, 'UI_AUDIT_ERROR:lobby');
  lobby.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.type === 'welcome') {
      lobby.send(JSON.stringify({
        type: 'enter',
        title: 'UI visual audit',
        password: '',
        limit: 2,
        mode: 3,
        round: 5,
        time: 60,
        opts: { dictionary: 'standard' }
      }));
      return;
    }
    if (message.type === 'error') {
      clearTimeout(timer);
      end(1, `UI_AUDIT_ERROR:lobby-${message.code}`);
      return;
    }
    if (message.type !== 'preRoom') return;

    roomId = message.id;
    console.log(`UI_AUDIT_ROOM:${roomId}`);
    const roomUrl = socketUrl.replace(/:(\d+)/, (_, port) => `:${Number(port) + 416 + Number(message.channel) - 1}`) + `&${message.channel}&${message.id}`;
    const room = new WebSocket(roomUrl);
    sockets.push(room);
    room.onerror = () => end(1, 'UI_AUDIT_ERROR:room');
    room.onmessage = ({ data }) => {
      const event = JSON.parse(data);
      if ((event.type === 'room' || event.type === 'connRoom') && !joinedRoom) {
        joinedRoom = true;
        setTimeout(() => room.send(JSON.stringify({ type: 'practice', level: 2 })), 500);
        return;
      }
      if (event.type === 'room' && event.room && event.room.players.some(player => player && player.robot) && !started) {
        started = true;
        setTimeout(() => room.send(JSON.stringify({ type: 'start' })), 400);
        return;
      }
      if (event.type === 'roundReady') console.log('UI_AUDIT_GAME_STARTED');
      if (event.type === 'error') end(1, `UI_AUDIT_ERROR:room-${event.code}`);
    };
  };
})().catch(error => end(1, `UI_AUDIT_ERROR:${error.message}`));
