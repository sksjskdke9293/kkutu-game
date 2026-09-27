'use strict';
function getRequiredScore(lv){
	return Math.round(
		(!(lv%5)*0.3 + 1) * (!(lv%15)*0.4 + 1) * (!(lv%45)*0.5 + 1) * (
			120 + Math.floor(lv/5)*60 + Math.floor(lv*lv/225)*120 + Math.floor(lv*lv/2025)*180
		)
	);
}

function base(level){let score=0;for(let i=1;i<level;i++)score+=getRequiredScore(i);return score;}
function level(score){let lv=1;while(lv<360 && score>=base(lv+1))lv++;return lv;}
function target(kind,value,current){if(!Number.isSafeInteger(value)||value<0)throw Error('유효한 정수를 입력하세요.');let score;if(kind==='level'){if(value<1||value>360)throw Error('레벨은 1~360입니다.');score=base(value);}else if(kind==='add')score=current+value;else if(kind==='score')score=value;else throw Error('변경 방식을 확인하세요.');if(!Number.isSafeInteger(score)||score>1000000000)throw Error('경험치는 0~1,000,000,000 범위입니다.');return score;}
module.exports={base,level,target};
