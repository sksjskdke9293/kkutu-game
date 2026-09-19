'use strict';
// Database callbacks may finish out of order; socket arrival decides priority.
exports.create = function(dic, workers) {
  const attempts = new Map(), pending = new Map();
  let sequence = 0, retirement = 0;
  function current(c) { return attempts.get(c.id) === c && c.socket.readyState === 1; }
  return {
    order() { return ++sequence; },
    claim(c, order) {
      const previous = attempts.get(c.id);
      if (previous && previous.loginOrder > order) return false;
      c.loginOrder = order; attempts.set(c.id, c);
      c.socket.once('close', () => { if (attempts.get(c.id) === c) attempts.delete(c.id); });
      return true;
    },
    current,
    release(c) { if (attempts.get(c.id) === c) attempts.delete(c.id); },
    ack(worker, message) {
      const task = pending.get(message.request);
      if (!task) return;
      task.waiting.delete(worker.id);
      if (!task.waiting.size) task.finish();
    },
    replace(c, done) {
      if (!current(c)) return c.disconnect();
      const previous = dic[c.id];
      if (previous && previous !== c) {
        previous._replaced = true; previous.sendError(408); previous.disconnect();
      }
      const targets = Object.keys(workers).map(k => workers[k]).filter(w => w.isConnected());
      const request = ++retirement;
      const task = {waiting: new Set(targets.map(w => w.id))};
      const timeout = setTimeout(() => { pending.delete(request); c.sendError(500); c.disconnect(); }, 10000);
      task.finish = () => {
        clearTimeout(timeout); pending.delete(request);
        if (current(c)) done(); else c.disconnect();
      };
      pending.set(request, task);
      targets.forEach(w => w.send({type: 'retire-login', target: c.id, request}));
      if (!targets.length) task.finish();
    }
  };
};
