(function(){
  'use strict';
  var locale=new URLSearchParams(location.search).get('locale')||(document.cookie.match(/(?:^|;\s*)lc=([^;]+)/)||[])[1]||'';
  var english=document.documentElement.lang==='en'||locale==='en_US',chinese=locale==='zh_CN',choson=locale==='ko_KP';
  if(!english&&!chinese&&!choson)return;
  var enLabels={
    '나만의 플레이 환경':'Personalize your game',
    '소리와 게임 편의 기능을 원하는 방식으로 조절하세요.':'Adjust sound and gameplay options.',
    '사운드':'Sound',
    '음악과 효과음은 따로 조절할 수 있어요.':'Adjust music and effects separately.',
    '배경 음악':'Background music',
    '로비와 게임 음악':'Lobby and game music',
    '로비 음악':'Lobby music',
    '로비에서 재생할 곡':'Music played in the lobby',
    '일반 음악':'Regular music',
    '가을 음악(기본)':'Autumn music (default)',
    '효과음':'Sound effects',
    '시작·정답·알림 효과음':'Start, answer, and notification sounds',
    '음소거':'Mute',
    '플레이와 소셜':'Gameplay and social',
    '필요한 알림과 입장 옵션만 켜 둘 수 있어요.':'Choose your notifications and joining options.',
    '초대 받지 않기':'Block invitations',
    '귓속말 받지 않기':'Block whispers',
    '친구 추가 받지 않기':'Block friend requests',
    '자동 준비':'Auto ready',
    '접속자 정렬':'Sort players',
    '대기 중인 방만 보기':'Show waiting rooms only',
    '비밀번호 없는 방만 보기':'Show public rooms only',
    '기본값 복원':'Restore defaults',
    '서버 선택':'Choose server',
    '저장하고 적용':'Save and apply',
    '관전':'Spectate',
    '방 설정':'Room settings',
    '빠른 시작':'Quick Join',
    '빠른 시작!':'Quick Join!',
    '방 만들기':'Create Room',
    '채팅':'Chat',
    '공지':'Notice',
    '알림':'Notice',
    '상대방을 기다리는 중 · 1 / 2':'Waiting for another player · 1 / 2',
    '매칭 취소':'Cancel match',
    '게임 나가기':'Leave game',
    '불러오는 중':'Loading...',
    '낱말을 입력하세요':'Enter a Korean word',
    '여기에 입력하세요':'Type here',
    '채팅을 입력하세요':'Type a message',
    '메시지 입력':'Type a message',
    '끄투 글꼴':'KKuTu font',
    '상점에 오신걸 환영합니다':'Welcome to the shop',
    '게임내에서 써지는 글씨의 폰트를 바꿔줍니다.':'Change the font used in the game.',
    '구매':'Buy',
    '방 제목':'Room title',
    '비밀번호':'Password',
    '낱말 입력 · 번호로 힌트 사용 시 점수 50%':'Enter a Korean word · Number hint halves the score',
    '상대에게 알려줄 힌트를 입력하고 Enter':'Enter a hint for your opponent and press Enter',
    '예측 · 다음에 낼 낱말을 미리 적어두세요':'Prediction · Write your next Korean word',
    '초대':'Invite',
    '봇 추가':'Add bot',
    '사전':'Dictionary',
    '나가기':'Leave',
    '시작!':'Start!',
    '준비':'Ready',
    '낱말 뜻':'Word meaning',
    '낱말을 입력하면 뜻이 표시됩니다.':'A definition appears when a word is entered.'
  };
  var kpLabels={
    '나만의 플레이 환경':'나만의 경기 환경','소리와 게임 편의 기능을 원하는 방식으로 조절하세요.':'소리와 경기 편의기능을 알맞게 조절하십시오.','사운드':'소리','음악과 효과음은 따로 조절할 수 있어요.':'음악과 효과음을 따로 조절할수 있습니다.','배경 음악':'배경음악','로비와 게임 음악':'대기실과 경기 음악','로비 음악':'대기실 음악','로비에서 재생할 곡':'대기실에서 울릴 음악','일반 음악':'보통 음악','가을 음악(기본)':'가을 음악(기본)','효과음':'효과소리','시작·정답·알림 효과음':'시작·정답·알림 효과소리','음소거':'소리 끄기','플레이와 소셜':'경기와 교류','필요한 알림과 입장 옵션만 켜 둘 수 있어요.':'필요한 알림과 입장 항목만 켤수 있습니다.','초대 받지 않기':'불러들이기 받지 않기','귓속말 받지 않기':'귀속말 받지 않기','친구 추가 받지 않기':'동무 추가 받지 않기','자동 준비':'자동 준비','접속자 정렬':'접속자 정렬','대기 중인 방만 보기':'기다리는 방만 보기','비밀번호 없는 방만 보기':'암호 없는 방만 보기','기본값 복원':'기본값 되돌리기','서버 선택':'봉사기 선택','저장하고 적용':'보관하고 적용','관전':'구경','방 설정':'방 설정','빠른 시작':'빠른 경기','빠른 시작!':'빠른 경기!','방 만들기':'방 꾸리기','채팅':'대화','공지':'알림','알림':'알림','상대방을 기다리는 중 · 1 / 2':'상대 경기자를 기다리는 중 · 1 / 2','매칭 취소':'맞추기 취소','게임 나가기':'경기 나가기','불러오는 중':'불러오는 중','낱말을 입력하세요':'낱말을 써넣으십시오','여기에 입력하세요':'여기에 써넣으십시오','채팅을 입력하세요':'대화를 써넣으십시오','메시지 입력':'통보문 써넣기','끄투 글꼴':'끄투 글자체','상점에 오신걸 환영합니다':'상점에 오신것을 환영합니다','게임내에서 써지는 글씨의 폰트를 바꿔줍니다.':'경기 안에서 쓰는 글자체를 바꿉니다.','구매':'구입','방 제목':'방 이름','비밀번호':'암호','낱말 입력 · 번호로 힌트 사용 시 점수 50%':'낱말 써넣기 · 번호로 암시 사용시 점수 50%','상대에게 알려줄 힌트를 입력하고 Enter':'상대에게 줄 암시를 써넣고 Enter','예측 · 다음에 낼 낱말을 미리 적어두세요':'예측 · 다음에 낼 낱말을 미리 써두십시오','초대':'불러들이기','봇 추가':'로보트 추가','사전':'낱말집','나가기':'나가기','시작!':'시작!','준비':'준비','낱말 뜻':'낱말 뜻','낱말을 입력하면 뜻이 표시됩니다.':'낱말을 써넣으면 뜻이 표시됩니다.','게임 서버에 연결하는 중…':'경기 봉사기에 접속하는 중…','메인':'대기실','전송':'보내기','닫기':'닫기','불러오는 중... 앞으로 1':'불러오는 중…'
  };
  var zhLabels={
    '나만의 플레이 환경':'个性化游戏环境','소리와 게임 편의 기능을 원하는 방식으로 조절하세요.':'按需要调整声音和游戏功能。','사운드':'声音','음악과 효과음은 따로 조절할 수 있어요.':'可分别调整音乐和音效。','배경 음악':'背景音乐','로비와 게임 음악':'大厅和游戏音乐','로비 음악':'大厅音乐','로비에서 재생할 곡':'大厅播放音乐','일반 음악':'普通音乐','가을 음악(기본)':'秋季音乐（默认）','효과음':'音效','시작·정답·알림 효과음':'开始、答对和通知音效','음소거':'静音','플레이와 소셜':'游戏和社交','필요한 알림과 입장 옵션만 켜 둘 수 있어요.':'只启用需要的通知和进入选项。','초대 받지 않기':'拒绝邀请','귓속말 받지 않기':'拒绝私聊','친구 추가 받지 않기':'拒绝好友申请','자동 준비':'自动准备','접속자 정렬':'玩家排序','대기 중인 방만 보기':'只显示等待中的房间','비밀번호 없는 방만 보기':'只显示无密码房间','기본값 복원':'恢复默认值','서버 선택':'选择服务器','저장하고 적용':'保存并应用','관전':'观战','방 설정':'房间设置','빠른 시작':'快速加入','빠른 시작!':'快速加入！','방 만들기':'创建房间','채팅':'聊天','공지':'公告','알림':'通知','상대방을 기다리는 중 · 1 / 2':'等待对手 · 1 / 2','매칭 취소':'取消匹配','게임 나가기':'离开游戏','불러오는 중':'加载中','게임 서버에 연결하는 중…':'正在连接游戏服务器…','낱말을 입력하세요':'请输入词语','여기에 입력하세요':'在此输入','채팅을 입력하세요':'输入聊天内容','메시지 입력':'输入消息','끄투 글꼴':'KKuTu 字体','상점에 오신걸 환영합니다':'欢迎来到商店','게임내에서 써지는 글씨의 폰트를 바꿔줍니다.':'更改游戏中使用的字体。','구매':'购买','방 제목':'房间名称','비밀번호':'密码','낱말 입력 · 번호로 힌트 사용 시 점수 50%':'输入词语 · 使用数字提示时分数减半','상대에게 알려줄 힌트를 입력하고 Enter':'输入给对手的提示并按 Enter','예측 · 다음에 낼 낱말을 미리 적어두세요':'预测 · 提前写下下一个词语','초대':'邀请','봇 추가':'添加机器人','사전':'词典','나가기':'离开','시작!':'开始！','준비':'准备','낱말 뜻':'词义','낱말을 입력하면 뜻이 표시됩니다.':'输入词语后显示释义。','경기자':'玩家','방':'房间','경기':'游戏','메인':'大厅','전송':'发送','닫기':'关闭','불러오는 중... 앞으로 1':'加载中…'
  };
  var labels=choson?kpLabels:(chinese?zhLabels:enLabels);
  function translate(){
    (choson||chinese?['body']:['#SettingDiag','.room-stage-actions','#RoomPrimaryAction','#WordMeaning','.kkutu-menu','#MatchOverlay','#RoomList','.game-input','#ChatLogDiag','#shop-shelf']).forEach(function(selector){
      document.querySelectorAll(selector).forEach(function(root){
        var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
        while(walker.nextNode()){
          var node=walker.currentNode,original=node.nodeValue.trim();
          if(labels[original])node.nodeValue=node.nodeValue.replace(original,labels[original]);
        }
        root.querySelectorAll('input[placeholder],textarea[placeholder],button[aria-label]').forEach(function(node){
          ['placeholder','aria-label'].forEach(function(attr){var value=node.getAttribute(attr);if(value&&labels[value])node.setAttribute(attr,labels[value]);});
        });
      });
    });
    document.querySelectorAll('#Chat .chat-notice .chat-head,#chat-log-board .chat-notice .chat-head').forEach(function(node){if(labels[node.textContent.trim()])node.textContent=labels[node.textContent.trim()];});
  }
  document.addEventListener('DOMContentLoaded',function(){
    translate();
    var timer;
    new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(translate,30);}).observe(document.body,{childList:true,subtree:true});
  });
})();
