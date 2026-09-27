'use strict';

const PATTERNS = [
  '느으*[^가-힣]*금마?', '니[^가-힣]*(엄|앰|엠)', '(ㅄ|ㅅㅂ|ㅂㅅ)', '미친(년|놈)?',
  '(병|븅|빙)[^가-힣]*신', '보[^가-힣]*지', '(새|섀|쌔|썌)[^가-힣]*(기|끼)', '섹[^가-힣]*스',
  '(시|씨|쉬|쒸)이*입?[^가-힣]*(발|빨|벌|뻘|팔|펄)', '십[^가-힣]*새', '씹',
  '(애|에)[^가-힣]*미', '자[^가-힣]*지', '존[^가-힣]*나', '좆|죶', '지랄',
  '창[^가-힣]*(녀|년|놈)', 'fuck', 'sex',
  'tlqkf', 'Tlqkf', 'qㅕㅇ신', 'qudtls', 'wlfkf', 'whw', 'tㅐㄱ스'
];
const BAD = new RegExp(PATTERNS.join('|'), 'i');

exports.match = function(value){
  const raw = String(value || '').slice(0, 200);
  const text = raw.normalize('NFKC');
  const found = raw.match(BAD) || text.match(BAD);
  return found ? found[0] : '';
};
