/* Browser-level geometry check for an active production Classic room.
 * The room is created by ui-audit-active-game.cjs and this isolated Chrome
 * test joins only as a spectator. */
const assert = require('assert');
const ROOM_ID = process.argv[2];
const FORCE_LAYOUT = process.argv.includes('--forced');
if (!ROOM_ID) throw new Error('Usage: node game-layout-browser-smoke.cjs <room id> [--forced]');
const VIEWPORT_WIDTH = Number(process.env.GAME_UI_WIDTH || 1366);
const VIEWPORT_HEIGHT = Number(process.env.GAME_UI_HEIGHT || 768);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const testUrl = `https://kkutugame.kro.kr/?server=0&audit-game=${Date.now()}`;
  const response = await fetch(`http://127.0.0.1:9224/json/new?${encodeURIComponent(testUrl)}`, { method: 'PUT' });
  if (!response.ok) throw new Error('Could not create an isolated game UI test tab');
  return response.json();
}

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('CDP connection failed')), { once: true });
  });
  let id = 0;
  const pending = new Map();
  const events = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      waiter.resolve(message);
    } else if (message.method) events.push(message);
  });
  return {
    socket,
    events,
    send(method, params = {}) {
      return new Promise((resolve) => {
        const messageId = ++id;
        pending.set(messageId, { resolve });
        socket.send(JSON.stringify({ id: messageId, method, params }));
      });
    }
  };
}

async function main() {
  const target = await findTarget();
  const cdp = await connect(target.webSocketDebuggerUrl);
  async function evaluate(expression) {
    const reply = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (reply.result.exceptionDetails) {
      const details = reply.result.exceptionDetails;
      throw new Error(details.exception?.description || details.text || 'Page evaluation failed');
    }
    return reply.result.result.value;
  }
  try {
    await cdp.send('Page.enable');
    await cdp.send('Log.enable');
    // A running room asks whether to enter as spectator.  Accept this only in
    // the isolated QA browser so the real application path is exercised.
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.confirm = function(){ return true; };' });
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
      mobile: false
    });
    await cdp.send('Page.navigate', { url: FORCE_LAYOUT
      ? `https://kkutugame.kro.kr/?server=0&layout-audit=${Date.now()}`
      : `https://kkutugame.kro.kr/?server=0#${ROOM_ID}` });
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const dialog = cdp.events.find((event) => event.method === 'Page.javascriptDialogOpening');
      if (dialog) {
        await cdp.send('Page.handleJavaScriptDialog', { accept: true });
        break;
      }
      await delay(200);
    }
    if (FORCE_LAYOUT) {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const ready = await evaluate(`Boolean(document.querySelector('.GameBox .product-body') && document.querySelector('.jjoriping') && document.querySelector('.game-body'))`);
        if (ready) break;
        await delay(250);
      }
      await evaluate(`(() => {
        const game = document.querySelector('.GameBox');
        const stage = game && game.querySelector('.product-body');
        const players = game && game.querySelector('.game-body');
        const input = game && game.querySelector('.game-input');
        if (!game || !stage || !players || !input) throw new Error('classic game markup is unavailable');
        document.body.classList.add('modern-classic');
        document.body.dataset.gameView = 'for-gaming';
        document.querySelector('#Intro')?.remove();
        document.querySelector('#Middle').style.display = 'block';
        game.style.display = 'block';
        input.style.display = 'block';
        document.querySelector('.ChatBox').style.display = 'block';
        if (!players.children.length) {
          for (let index = 0; index < 2; index += 1) {
            const user = document.createElement('div');
            user.className = index === 0 ? 'game-user game-user-current' : 'game-user';
            user.innerHTML = '<div class="game-user-image"></div><div class="game-user-title"><span class="game-user-name">플레이어</span></div><div class="game-user-score">00000</div>';
            players.appendChild(user);
          }
        }
        let hints = document.querySelector('#TurnHint');
        if (!hints) {
          hints = document.createElement('div');
          hints.id = 'TurnHint';
          document.querySelector('.jjoriping').appendChild(hints);
        }
        hints.innerHTML = '<button type="button">1 · 예시 힌트</button>';
      })()`);
    }
    let rendered = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      rendered = await evaluate(`(() => {
        const board = document.querySelector('.GameBox .product-body');
        return Boolean(document.body.classList.contains('modern-classic') &&
          document.body.dataset.gameView === 'for-gaming' && board &&
          board.getBoundingClientRect().width > 0 && document.querySelector('#game-input') &&
          (${FORCE_LAYOUT ? 'true' : 'false'} || getComputedStyle(document.querySelector('#Intro')).display === 'none'));
      })()`);
      if (rendered) break;
      await delay(250);
    }
    if (!rendered) {
      console.log('Game bootstrap diagnostics:', await evaluate(`({
        href: location.href,
        bodyClass: document.body.className,
        gameView: document.body.dataset.gameView,
        hasGameBox: Boolean(document.querySelector('.GameBox')),
        hasBoard: Boolean(document.querySelector('.GameBox .product-body')),
        hasInput: Boolean(document.querySelector('#game-input')),
        bodyText: (document.body && document.body.innerText || '').slice(0, 700)
      })`));
      console.log('Game dialog events:', cdp.events.filter((event) => event.method === 'Page.javascriptDialogOpening').map((event) => event.params.message));
    }
    assert(rendered, 'active Classic game UI did not render for the spectator');
    const layout = await evaluate(`(() => {
      const rect = (selector) => {
        const node = document.querySelector(selector);
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };
      const overlaps = (a, b) => Boolean(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
      const board = rect('.GameBox .product-body');
      const word = rect('.jjoriping');
      const input = rect('.game-input');
      const players = rect('.game-body');
      const hints = rect('#TurnHint');
      const chat = rect('.ChatBox');
      const definition = rect('#WordMeaning');
      const maintenance = rect('#GameMaintenanceNotice');
      return {
        viewport: { width: innerWidth, height: innerHeight },
        documentWidth: document.documentElement.scrollWidth,
        board, word, input, players, hints, chat, definition, maintenance,
        wordInputOverlap: overlaps(word, input),
        inputPlayersOverlap: overlaps(input, players),
        hintsPlayersOverlap: overlaps(hints, players),
        hintsChatOverlap: overlaps(hints, chat),
        maintenanceWordOverlap: overlaps(maintenance, word)
      };
    })()`);
    const fits = (rect, viewport) => rect && rect.left >= -1 && rect.top >= -1 && rect.right <= viewport.width + 1 && rect.bottom <= viewport.height + 1;
    assert(fits(layout.board, layout.viewport), `board is outside viewport: ${JSON.stringify(layout.board)}`);
    assert(fits(layout.word, layout.viewport), `word board is outside viewport: ${JSON.stringify(layout.word)}`);
    assert(fits(layout.input, layout.viewport), `word input is outside viewport: ${JSON.stringify(layout.input)}`);
    assert(fits(layout.players, layout.viewport), `player area is outside viewport: ${JSON.stringify(layout.players)}`);
    assert(fits(layout.definition, layout.viewport), `meaning panel is outside viewport: ${JSON.stringify(layout.definition)}`);
    assert(fits(layout.maintenance, layout.viewport), `maintenance notice is outside viewport: ${JSON.stringify(layout.maintenance)}`);
    assert(layout.maintenance.height > 0, 'maintenance notice is not visible during an active game');
    assert(Math.abs((layout.board.left + layout.board.right) / 2 - layout.viewport.width / 2) <= 2,
      `game stage is not centered: ${JSON.stringify(layout.board)}`);
    assert(layout.documentWidth <= layout.viewport.width + 1, `horizontal overflow: ${layout.documentWidth}/${layout.viewport.width}`);
    assert(!layout.wordInputOverlap && !layout.inputPlayersOverlap && !layout.hintsPlayersOverlap && !layout.hintsChatOverlap && !layout.maintenanceWordOverlap,
      `overlapping game regions: ${JSON.stringify(layout)}`);
    const errors = cdp.events
      .filter((event) => event.method === 'Log.entryAdded' && event.params.entry.level === 'error')
      .map((event) => event.params.entry.text)
      .filter((text) => !/favicon|recaptcha/i.test(text));
    assert.strictEqual(errors.length, 0, `browser logged errors: ${errors.join(' | ')}`);
    console.log(`PASS: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT} active production game board, word panel, input, players, hints, chat, and meaning panel fit without overlap`);
  } finally {
    cdp.socket.close();
  }
}

main().catch((error) => {
  console.error(`FAIL: ${error.stack || error.message}`);
  process.exitCode = 1;
});
