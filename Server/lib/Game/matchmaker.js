'use strict';

// One queue per game server. Only connected lobby players can join or vote.
// `options.dictionary` makes a queue start immediately with that fixed
// dictionary.  It is used by ranked play so players cannot create or tune a
// ranked room themselves.
module.exports = function (clients, createRoom, options) {
  options = options || {};
  const queue = [], matches = new Set(), members = new Map();
  const dictionaries = ['basic', 'standard', 'complex'];
  const fixedDictionary = dictionaries.includes(options.dictionary) ? options.dictionary : null;
  const ranked = options.ranked === true;
  const live = c => clients[c.id] === c && !c.place && c.socket.readyState === 1;
  function notify(m, state, extra) {
    const payload = Object.assign({state: state}, ranked ? {ranked: true} : {}, extra || {});
    m.players.forEach(c => { if (clients[c.id] === c) c.send('match', payload); });
  }
  function cancel(c, reason) {
    const i = queue.indexOf(c);
    if (i >= 0) queue.splice(i, 1);
    const m = members.get(c.id);
    if (m) {
      matches.delete(m);
      m.players.forEach(p => members.delete(p.id));
      notify(m, 'cancelled', {message: reason || '매칭이 취소되었습니다.'});
    } else if (clients[c.id] === c) c.send('match', Object.assign({state: 'cancelled'}, ranked ? {ranked: true} : {}));
  }
  function join(c) {
    if (!live(c) || members.has(c.id) || queue.includes(c)) return;
    queue.push(c);
    c.send('match', {state: 'waiting'});
    while (queue.length >= 2) {
      const players = queue.splice(0, 2);
      if (!players.every(live)) { players.filter(live).forEach(join); continue; }
      const m = {players: players, votes: new Map(), deadline: fixedDictionary ? 0 : Date.now() + 30000};
      matches.add(m);
      players.forEach(p => members.set(p.id, m));
      if (fixedDictionary) {
        matches.delete(m);
        m.players.forEach(p => members.delete(p.id));
        notify(m, 'starting', {dictionary: fixedDictionary});
        createRoom(m.players, fixedDictionary);
        continue;
      }
      notify(m, 'vote', {deadline: m.deadline, votes: 0});
    }
  }
  function vote(c, dictionary) {
    const m = members.get(c.id);
    if (!m || !dictionaries.includes(dictionary) || m.votes.has(c.id)) return;
    if (!m.players.every(live)) return cancel(c, '상대방이 연결을 종료하거나 로비를 떠났습니다.');
    m.votes.set(c.id, dictionary);
    if (m.votes.size < 2) return notify(m, 'vote', {deadline: m.deadline, votes: m.votes.size});
    const values = Array.from(m.votes.values());
    const selected = values[Math.floor(Math.random() * values.length)];
    matches.delete(m);
    m.players.forEach(p => members.delete(p.id));
    notify(m, 'starting', {dictionary: selected});
    createRoom(m.players, selected);
  }
  const timer = setInterval(() => {
    queue.slice().forEach(c => { if (!live(c)) cancel(c); });
    matches.forEach(m => {
      if ((m.deadline && Date.now() >= m.deadline) || !m.players.every(live)) cancel(m.players[0], ranked ? '상대방이 나갔습니다. 순위전 매칭을 다시 시작해 주세요.' : '투표 시간이 끝났거나 상대방이 나갔습니다. 다시 빠른 시작을 눌러 주세요.');
    });
  }, 1000);
  timer.unref();
  return {join: join, vote: vote, cancel: cancel, close: () => clearInterval(timer)};
};
