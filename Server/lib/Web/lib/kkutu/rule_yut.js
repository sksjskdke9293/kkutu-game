var yutPoints={0:[92,92],1:[92,75],2:[92,58],3:[92,42],4:[92,25],5:[92,8],6:[75,8],7:[58,8],8:[42,8],9:[25,8],10:[8,8],11:[8,25],12:[8,42],13:[8,58],14:[8,75],15:[8,92],16:[25,92],17:[42,92],18:[58,92],19:[75,92],21:[75,25],22:[58,42],23:[50,50],24:[42,58],25:[25,75],26:[25,25],27:[42,42],28:[58,58],29:[75,75]};
var yutShownState=null,yutMotion=[];
function yutCopy(state){return state?{positions:{1:(state.positions[1]||[]).slice(),2:(state.positions[2]||[]).slice()},teams:state.teams,goal:state.goal}:null;}
function yutClearMotion(){yutMotion.forEach(clearTimeout);yutMotion=[];}
function ensureYutBoard(){
	var board=$('#YutBoard');if(board.length)return board;
	board=$('<section id="YutBoard"><header><b>'+(ENGLISH_UI?'Yut Nori':'윷놀이')+'</b><span id="YutRoll">'+(ENGLISH_UI?'Complete the Korean word chain to throw the yut.':'끝말잇기에 성공하면 윷을 던집니다.')+'</span></header><div class="yut-track"><svg class="yut-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M8 8H92V92H8Z M8 8L92 92 M92 8L8 92"/></svg><span class="yut-center-mark">●</span></div><div class="yut-score"><span class="team-one">'+(ENGLISH_UI?'Pink Team ':'분홍 팀 ')+'<b>'+(ENGLISH_UI?'0 finished':'0개 도착')+'</b><i class="yut-finished" data-team="1"></i></span><span class="team-two">'+(ENGLISH_UI?'Yellow Team ':'노랑 팀 ')+'<b>'+(ENGLISH_UI?'0 finished':'0개 도착')+'</b><i class="yut-finished" data-team="2"></i></span></div></section>');
	if($data.admin){
		var admin=$('<div class="yut-admin-roll"><button type="button" class="yut-admin-toggle">'+(ENGLISH_UI?'🔒 Secret Yut':'🔒 비밀 윷')+'</button><div class="yut-admin-options"></div><small>'+(ENGLISH_UI?'Next result: Random':'다음 윷 결과: 무작위')+'</small></div>');
		[['빽도','backdo'],['도','do'],['개','gae'],['걸','geol'],['윷','yut'],['모','mo']].forEach(function(item){admin.find('.yut-admin-options').append($('<button type="button">').text(item[0]).attr('data-roll',item[1]).on('click',function(){send('yutForceRoll',{roll:item[1]});}));});
		admin.find('.yut-admin-toggle').on('click',function(){admin.toggleClass('is-open');});board.append(admin);
	}
	Object.keys(yutPoints).forEach(function(step){var point=yutPoints[step],inner=Number(step)>20;board.find('.yut-track').append($('<i>').attr('data-step',step).css({left:point[0]+'%',top:point[1]+'%'}).toggleClass('yut-corner',[0,5,10,15,23].indexOf(Number(step))!==-1).toggleClass('yut-diagonal',inner).append($('<small>').text(Number(step)===0?'출발':(inner?'':step))));});
	$('.game-body').prepend(board);return board;
}
function drawYut(state){
	if(!state||!state.positions)return;
	var board=ensureYutBoard(),positions=state.positions;board.find('.yut-stack').remove();board.find('.yut-finished').empty();
	[1,2].forEach(function(team){var pieces=Array.isArray(positions[team])?positions[team]:[];var groups={};pieces.forEach(function(step){if(step>0&&step!==20)(groups[step]||(groups[step]=[])).push(step);});
		Object.keys(groups).forEach(function(step){var cell=board.find('[data-step="'+step+'"]'),stack=$('<span class="yut-stack team-'+team+'" aria-label="'+(team===1?'분홍':'노랑')+' 말 '+groups[step].length+'개"></span>');groups[step].forEach(function(){stack.append('<em class="yut-token"></em>');});cell.append(stack);});
		var finished=pieces.filter(function(step){return step===20;}).length;board.find('.team-'+(team===1?'one':'two')+' b').text(ENGLISH_UI?finished+' finished':finished+'개 도착');for(var i=0;i<finished;i++)board.find('.yut-finished[data-team="'+team+'"]').append($('<em class="yut-token team-'+team+'"></em>'));
	});yutShownState=yutCopy(state);
}
function animateYut(data){
	var result=data.yut,path=result&&result.path,moved=result&&result.moved,team=result&&Number(result.team);
	if(!path||path.length<2||!moved||!yutShownState){drawYut(result);return;}
	yutClearMotion();var scene=yutCopy(yutShownState);path.slice(1).forEach(function(step,index){yutMotion.push(setTimeout(function(){moved.forEach(function(piece){scene.positions[team][piece]=step;});drawYut(scene);},index*360+120));});
	yutMotion.push(setTimeout(function(){drawYut(result);},(path.length-1)*360+450));
}
$lib.Yut.roundReady=function(data){yutClearMotion();$lib.Classic.roundReady(data);$('body').addClass('yut-mode');drawYut(data.yut);};
$lib.Yut.turnStart=function(data){yutClearMotion();$lib.Classic.turnStart(data);drawYut(data.yut);$('#YutRoll').text(ENGLISH_UI?'Enter a Korean word beginning with 「'+data.char+'」.':'「'+data.char+'」로 시작하는 낱말을 입력하세요.');};
$lib.Yut.turnGoing=$lib.Classic.turnGoing;
$lib.Yut.yutThrow=function(data){
	clearInterval($data._tTime);
	if($data._turnSound)$data._turnSound.stop();
	$stage.game.hereText.prop('readOnly',true);
	$('#YutBoard .yut-admin-roll [data-roll]').removeClass('is-selected');$('#YutBoard .yut-admin-roll small').text(ENGLISH_UI?'Next result: Random':'다음 윷 결과: 무작위');
	var board=ensureYutBoard(),thrower=$('<div class="yut-throw" aria-label="윷 던지는 중"><div class="yut-sticks"><span></span><span></span><span></span><span></span></div><strong>'+data.roll+'!</strong></div>');
	board.find('.yut-throw').remove();board.append(thrower);setTimeout(function(){thrower.addClass('show-result');},850);setTimeout(function(){thrower.remove();},1350);
	$('#YutRoll').text(ENGLISH_UI?(data.team===1?'Pink':'Yellow')+' Team throws the yut!':(data.team===1?'분홍':'노랑')+' 팀이 윷을 던집니다!');
};
$lib.Yut.turnEnd=function(id,data){$lib.Classic.turnEnd(id,data);animateYut(data);if(data.yut)$('#YutRoll').text(ENGLISH_UI?(data.yut.noThrow?'Time out · No yut throw':(data.yut.backDo?'Back-do · Starting piece moves to space 19':(data.yut.roll+' · Move '+data.yut.move+' spaces'))+(data.yut.captured?' · Captured an opponent!':'')+(data.yut.oneShot?' · One-shot word, next turn':(data.yut.extra?' · Throw again!':''))):(data.yut.noThrow?'시간 초과 · 윷을 던지지 못했습니다.':(data.yut.backDo?'빽도 · 출발 말은 19번 칸으로 이동':(data.yut.roll+' · '+data.yut.move+'칸 이동'))+(data.yut.captured?' · 상대 말 잡기!':'')+(data.yut.oneShot?' · 한방 단어, 다음 차례로 이동':(data.yut.extra?' · 한 번 더!':''))));};
$lib.Yut.yutWin=function(data){$('#YutRoll').text(ENGLISH_UI?(data.team===1?'Pink':'Yellow')+' Team wins!':(data.team===1?'분홍':'노랑')+' 팀 승리!');};
$lib.Yut.yutForceRoll=function(data){var box=$('#YutBoard .yut-admin-roll');box.addClass('is-open').find('[data-roll]').removeClass('is-selected').filter('[data-roll="'+data.roll+'"]').addClass('is-selected');box.find('small').text('다음 윷 결과: '+data.name);};
$lib.Yut.yutChoice=function(data){
	$('#YutChoice').remove();var moveText=ENGLISH_UI?(data.move<0?'A starting piece moves to space 19.':'Choose how to move '+data.move+' spaces.'):(data.move<0?'출발 전 말은 19번 칸으로 이동합니다.':data.move+'칸을 어떻게 이동할까요?');var box=$('<div id="YutChoice"><div class="yut-choice-card"><b>'+data.roll+'! '+moveText+'</b><p>'+(ENGLISH_UI?'Choose a piece within 9 seconds.':'9초 안에 이동할 말을 선택하세요.')+'</p><div class="yut-choice-buttons"></div></div></div>');
	var buttons=box.find('.yut-choice-buttons');function option(label,choice){buttons.append($('<button>').text(label).on('click',function(){send('yutMove',{choice:choice});box.remove();}));}
	if(data.canAdd)option(ENGLISH_UI?'＋ Add a new piece':'＋ 새 말 추가','new');var seen={};(data.pieces||[]).forEach(function(piece){if(seen[piece.position])return;seen[piece.position]=true;var group=data.pieces.filter(function(other){return other.position===piece.position;}).length;option(ENGLISH_UI?'Move piece '+(piece.index+1)+(group>1?' (stack of '+group+')':'')+' · space '+piece.position:(piece.index+1)+'번 말'+(group>1?' '+group+'개 묶음':'')+' 이동 · 현재 '+piece.position+'칸',{piece:piece.index,shortcut:false});if(piece.position===5||piece.position===10)option(ENGLISH_UI?'↗ Piece '+(piece.index+1)+' shortcut':'↗ '+(piece.index+1)+'번 말 지름길로 이동',{piece:piece.index,shortcut:true});});
	$('body').append(box);
};
