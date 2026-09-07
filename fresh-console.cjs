const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const targets = await (await fetch('http://127.0.0.1:9224/json/list')).json();
  const target = targets.find((item) => item.type === 'page' && /smokefresh=1/.test(item.url));
  if (!target) throw new Error('fresh test target not found');

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let next = 0;
  const pending = new Map();
  const messages = [];
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown' || message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') messages.push(message);
    if (!pending.has(message.id)) return;
    pending.get(message.id)(message);
    pending.delete(message.id);
  });
  const call = (method, params = {}) => new Promise((resolve) => {
    const id = ++next;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

  await call('Runtime.enable');
  await call('Log.enable');
  await delay(8000);
  const probe = await call('Runtime.evaluate', {
    expression: `(() => ({
      ready: document.readyState,
      hasJQ: Boolean(window.jQuery),
      buttonEvents: window.jQuery ? Object.keys(window.jQuery._data(document.querySelector('#SettingBtn'), 'events') || {}) : [],
      settingStyle: document.querySelector('#SettingDiag') && document.querySelector('#SettingDiag').getAttribute('style'),
      loaded: [...document.scripts].map((s) => s.src).filter(Boolean),
      body: document.body.className
    }))()`,
    returnByValue: true
  });
  const clickProbe = await call('Runtime.evaluate', {
    expression: `(() => {
      const button = document.querySelector('#SettingBtn');
      const dialog = document.querySelector('#SettingDiag');
      button.click();
      const rect = dialog.getBoundingClientRect();
      return {
        events: window.jQuery ? Object.keys(window.jQuery._data(button, 'events') || {}) : [],
        display: getComputedStyle(dialog).display,
        rect: { width: rect.width, height: rect.height },
        style: dialog.getAttribute('style')
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify({ probe: probe.result.result.value, clickProbe: clickProbe.result.result.value, messages }, null, 2));
  socket.close();
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
