const assert = require('assert');
const Module = require('module');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === './sub/global.json' && parent && /Server[\\/]lib[\\/]const\.js$/.test(parent.filename)) {
    return { MAIN_PORTS: [8080], ADMIN: [], IS_SECURED: false, SSL_OPTIONS: {} };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const Const = require('./Server/lib/const');
const Classic = require('./Server/lib/Game/games/classic');
Module._load = originalLoad;

const mode = Const.GAME_TYPE.indexOf('KAL');
assert(mode >= 0, 'KAL must be registered');
assert.strictEqual(Const.RULE.KAL.dictionaryOnly, true);
assert.strictEqual(Const.RULE.KAL.allDictionary, true);

let lookup = [];
const words = {
  '사과': { _id: '사과', mean: '과일', theme: '일반', type: '1', baby: false, hit: 0 }
};
const DB = {
  kkutu: {
    ko: {
      findOne(...query) {
        lookup = query;
        return { on(callback) { setImmediate(() => callback(words[query[0][1]] || null)); } };
      },
      update() { return { set() { return { on() {} }; } }; }
    }
  },
  kkutu_manner: { ko: {} }
};
Classic.init(DB, {});

function submit(word) {
  return new Promise(resolve => {
    const events = [];
    const room = {
      mode,
      rule: Const.RULE.KAL,
      opts: {},
      gaming: true,
      game: { seq: ['p1'], turn: 0, turnAt: Date.now(), chain: [], dic: {}, late: false, loading: false, roundTime: 60000, turnTime: 15000 },
      getScore() { return 0; },
      turnNext() {},
      byMaster() {}
    };
    const client = {
      id: 'p1', robot: false, game: { score: 0 }, equip: {},
      publish(type, data) { events.push({ type, data }); resolve({ room, events }); },
      invokeWordPiece() {}
    };
    Classic.submit.call(room, client, word);
    setTimeout(() => resolve({ room, events }), 30);
  });
}

(async () => {
  const valid = await submit('사과');
  assert(valid.events.some(event => event.type === 'turnEnd' && event.data.ok && event.data.value === '사과'));
  assert.deepStrictEqual(lookup, [['_id', '사과']], 'all mode must not add a dictionary preset filter');

  const invalid = await submit('사전에없는말');
  assert(invalid.events.some(event => event.type === 'turnError' && event.data.code === 404));
  assert.strictEqual(invalid.room.game.chain.length, 0);
  console.log('PASS KAL accepts every registered dictionary word and rejects missing words');
})().catch(error => { console.error(error); process.exitCode = 1; });
