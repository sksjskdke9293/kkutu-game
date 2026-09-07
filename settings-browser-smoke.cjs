/* Browser-level smoke test for the custom settings dialog.
 * Uses an isolated local headless-Chrome profile and never touches a player's
 * cookies or account.  It validates the actual production bundle, not source
 * strings alone. */
const assert = require('assert');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getGameTarget() {
  const testUrl = `https://kkutugame.kro.kr/?server=0&settings-smoke=${Date.now()}`;
  const response = await fetch(`http://127.0.0.1:9224/json/new?${encodeURIComponent(testUrl)}`, { method: 'PUT' });
  if (!response.ok) throw new Error('Could not create an isolated KKuTu test tab');
  return response.json();
}

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('CDP WebSocket connection failed')), { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    waiter.resolve(message);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  return { socket, send };
}

async function main() {
  const target = await getGameTarget();
  const { socket, send } = await connect(target.webSocketDebuggerUrl);
  async function evaluate(expression) {
    const reply = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (reply.result.exceptionDetails) {
      throw new Error(reply.result.exceptionDetails.text || 'Page evaluation failed');
    }
    return reply.result.result.value;
  }
  try {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false
    });
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      ready = await evaluate(`(() => {
        const button = document.querySelector('#SettingBtn');
        const clickHandlers = window.jQuery && button ? window.jQuery._data(button, 'events') : null;
        const rect = button && button.getBoundingClientRect();
        const topNode = rect && document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return Boolean(window.$ && button && rect && rect.width > 0 && rect.height > 0 && topNode && (topNode === button || button.contains(topNode)) && document.querySelector('#settings-bgm-volume') && clickHandlers && clickHandlers.click && clickHandlers.click.length);
      })()`);
      if (ready) break;
      await delay(250);
    }
    if (!ready) {
      console.log('Settings bootstrap diagnostics:', await evaluate(`({
        title: document.title,
        readyState: document.readyState,
        hasJquery: Boolean(window.$),
        hasButton: Boolean(document.querySelector('#SettingBtn')),
        hasBgmControl: Boolean(document.querySelector('#settings-bgm-volume')),
        bodyText: (document.body && document.body.innerText || '').slice(0, 500)
      })`));
    }
    assert(ready, 'settings controls did not initialize in the production browser bundle');

    await evaluate(`(() => {
      const dialog = document.querySelector('#SettingDiag');
      if (getComputedStyle(dialog).display !== 'none') dialog.style.display = 'none';
    })()`);
    const buttonRect = await evaluate(`(() => {
      const rect = document.querySelector('#SettingBtn').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    // Use real pointer input, rather than calling HTMLElement.click(), to make
    // this a faithful first-load test of the control a player presses.
    await send('Page.bringToFront');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: buttonRect.x, y: buttonRect.y, button: 'left', buttons: 1, clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: buttonRect.x, y: buttonRect.y, button: 'left', buttons: 0, clickCount: 1 });
    const desktop = await evaluate(`(() => {
      const dialog = document.querySelector('#SettingDiag');
      const rect = dialog.getBoundingClientRect();
      const button = document.querySelector('#SettingBtn');
      const buttonRect = button.getBoundingClientRect();
      return {
        visible: getComputedStyle(dialog).display !== 'none' && rect.width > 0 && rect.height > 0,
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
        viewport: { width: innerWidth, height: innerHeight },
        controls: ['settings-bgm-volume', 'settings-effect-volume', 'mute-bgm', 'mute-effect', 'setting-reset', 'setting-ok']
          .every((id) => Boolean(document.getElementById(id))),
        buttonRect: { left: buttonRect.left, top: buttonRect.top, right: buttonRect.right, bottom: buttonRect.bottom },
        atButton: document.elementFromPoint(buttonRect.left + buttonRect.width / 2, buttonRect.top + buttonRect.height / 2)?.id || null
      };
    })()`);
    assert(desktop.visible && desktop.controls, 'settings dialog did not open with its controls');
    assert(desktop.rect.left >= 0 && desktop.rect.top >= 0 && desktop.rect.right <= desktop.viewport.width && desktop.rect.bottom <= desktop.viewport.height,
      'desktop settings dialog does not fit in the viewport');

    const audio = await evaluate(`(() => {
      const bgm = document.querySelector('#settings-bgm-volume');
      const effect = document.querySelector('#settings-effect-volume');
      const muteBgm = document.querySelector('#mute-bgm');
      const muteEffect = document.querySelector('#mute-effect');
      bgm.value = '37';
      bgm.dispatchEvent(new Event('input', { bubbles: true }));
      effect.value = '64';
      effect.dispatchEvent(new Event('input', { bubbles: true }));
      muteBgm.checked = true;
      muteBgm.dispatchEvent(new Event('change', { bubbles: true }));
      muteEffect.checked = false;
      muteEffect.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        bgmLabel: document.querySelector('#settings-bgm-value').textContent,
        effectLabel: document.querySelector('#settings-effect-value').textContent,
        mutedBgm: muteBgm.checked,
        mutedEffect: muteEffect.checked
      };
    })()`);
    assert.deepStrictEqual(audio, {
      bgmLabel: '37%',
      effectLabel: '64%',
      mutedBgm: true,
      mutedEffect: false
    }, 'independent settings audio controls did not apply live');

    const saved = await evaluate(`(() => {
      document.querySelector('#setting-ok').click();
      const pair = document.cookie.split('; ').find((item) => item.startsWith('kks='));
      return pair ? JSON.parse(decodeURIComponent(pair.slice(4))) : null;
    })()`);
    assert.deepStrictEqual(saved, {
      mb: true,
      me: false,
      bv: 37,
      ev: 64,
      di: false,
      dw: false,
      df: false,
      ar: false,
      su: false,
      ow: false,
      ou: false
    }, 'save did not persist the edited sound settings');

    const reset = await evaluate(`(() => {
      document.querySelector('#SettingBtn').click();
      document.querySelector('#setting-reset').click();
      document.querySelector('#setting-ok').click();
      const pair = document.cookie.split('; ').find((item) => item.startsWith('kks='));
      const saved = pair ? JSON.parse(decodeURIComponent(pair.slice(4))) : null;
      return {
        saved,
        dialogClosed: getComputedStyle(document.querySelector('#SettingDiag')).display === 'none'
      };
    })()`);
    assert.deepStrictEqual(reset, {
      saved: {
        mb: false,
        me: false,
        bv: 100,
        ev: 100,
        di: false,
        dw: false,
        df: false,
        ar: false,
        su: false,
        ow: false,
        ou: false
      },
      dialogClosed: true
    }, 'reset/save did not persist defaults or close the dialog');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await delay(150);
    const mobile = await evaluate(`(() => {
      document.querySelector('#SettingBtn').click();
      const rect = document.querySelector('#SettingDiag').getBoundingClientRect();
      return {
        visible: getComputedStyle(document.querySelector('#SettingDiag')).display !== 'none',
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: innerWidth,
        height: innerHeight,
        scrollable: getComputedStyle(document.querySelector('#SettingDiag .dialog-body')).overflowY
      };
    })()`);
    assert(mobile.visible && mobile.left >= 0 && mobile.top >= 0 && mobile.right <= mobile.width && mobile.bottom <= mobile.height,
      'mobile settings dialog does not fit in the viewport');
    assert(['auto', 'scroll'].includes(mobile.scrollable), 'mobile settings content is not scrollable');
    console.log('PASS: production settings dialog opens, applies independent live audio settings, resets/saves, and fits desktop/mobile viewports');
  } finally {
    socket.close();
  }
}

main().catch((error) => {
  console.error(`FAIL: ${error.stack || error.message}`);
  process.exitCode = 1;
});
