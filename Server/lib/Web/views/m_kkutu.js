function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}
function pug_style(r){if(!r)return"";if("object"==typeof r){var t="";for(var e in r)pug_has_own_property.call(r,e)&&(t=t+e+":"+r[e]+";");return t}return r+""}function mobileKkutuTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug":"﻿\u002F\u002F-\r\n\tRule the words! KKuTu Online\r\n\tCopyright (C) 2017 JJoriping(op@jjo.kr)\r\n\t\r\n\tThis program is free software: you can redistribute it and\u002For modify\r\n\tit under the terms of the GNU General Public License as published by\r\n\tthe Free Software Foundation, either version 3 of the License, or\r\n\t(at your option) any later version.\r\n\t\r\n\tThis program is distributed in the hope that it will be useful,\r\n\tbut WITHOUT ANY WARRANTY; without even the implied warranty of\r\n\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n\tGNU General Public License for more details.\r\n\t\r\n\tYou should have received a copy of the GNU General Public License\r\n\talong with this program. If not, see \u003Chttp:\u002F\u002Fwww.gnu.org\u002Flicenses\u002F\u003E.\r\nextends m_layout\r\n\r\nmixin Dialog(id, w, h, t, nocls)\r\n\tdiv.dialog(id=id, style=`width: ${w}px; height: ${h}px;`)\r\n\t\tdiv(class=nocls ? 'no-close dialog-head' : 'dialog-head')\r\n\t\t\tdiv.dialog-title(style=`width: ${w - 20}px;`)!= t || ''\r\n\t\tdiv.dialog-body(style='font-size: 13px;')\r\n\t\t\tblock\r\n\t\r\nmixin GameOption(key, prefix)\r\n\t- var name = locals.OPTIONS[key].name;\r\n\t- var sid = name.toLowerCase();\r\n\tdiv.dialog-opt(id=`${prefix}-${sid}-panel`)\r\n\t\tinput.game-option(id=`${prefix}-${sid}`, type='checkbox', style='margin-top: 5px; width: auto;')\r\n\t\tlabel(for=`${prefix}-${sid}`)= L(`opt${name}`)\r\n\t\t+Expl(true)\r\n\t\t\tdiv!= L(`expl${name}`)\r\n\r\nmixin SettingOption(id, text, st)\r\n\tdiv.dialog-opt(style=st || \"\")\r\n\t\tinput(id=id, type='checkbox', style='margin-top: 5px; width: auto;')\r\n\t\tlabel(for=id)= text\r\n\r\nblock Subject\n\ttitle 끄투게임\n\t\r\nblock JS\n\tscript(type='text\u002Fjavascript', src='\u002Fjs\u002Fin_game_kkutu.min.js?v=20260906-settings-2')\n\tscript(src='https:\u002F\u002Fwww.google.com\u002Frecaptcha\u002Fapi.js')\r\n\t\r\nblock CSS\n\tlink(rel='stylesheet', href='\u002Fcss\u002Fin_game_kkutu_shop.css')\n\tlink(rel='stylesheet', href='\u002Fcss\u002Fplay-shell.css?v=20260906-ui-audit-4')\n\tlink(rel='stylesheet', href='\u002Fcss\u002Fgame-ui-audit.css?v=20260906-ui-audit-7')\n\tlink(rel='stylesheet', href='\u002Fcss\u002Fsettings-ui.css?v=20260906-settings-1')\n\t\r\nblock Jungle\r\n\tspan#PUBLIC= PUBLIC ? \"true\" : undefined\r\n\tspan#URL= `${locals.PROTOCOL}:\u002F\u002F${locals.HOST}:${locals.PORT}\u002F${locals._id}`\r\n\tspan#MOREMI_PART= locals.MOREMI_PART.join(',')\r\n\tspan#AVAIL_EQUIP= locals.AVAIL_EQUIP.join(',')\r\n\tspan#RULE= JSON.stringify(locals.RULE)\r\n\tspan#OPTIONS= JSON.stringify(locals.OPTIONS)\r\n\tdiv#Yell\r\n\tdiv#Loading= L('LOADING')\r\n\t-\r\n\t\tLANG['explInjeong'] = `\u003Ch5\u003E${L('explInjeong')}\u003C\u002Fh5\u003E\\\r\n\t\t\t\u003Ch5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'\u003E${L('explInjeongListTitle')}\u003C\u002Fh5\u003E\\\r\n\t\t\t\u003Ch5\u003E${locals.KO_INJEONG.map(function(item){ return L('theme_' + item); })}\u003C\u002Fh5\u003E\\\r\n\t\t\t\u003Ch5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'\u003E${L('explInjeongListTitle')} (${L('modeEKT')}, ${L('modeESH')})\u003C\u002Fh5\u003E\\\r\n\t\t\t\u003Ch5\u003E${locals.EN_INJEONG.map(function(item){ return L('theme_' + item); })}\u003C\u002Fh5\u003E`;\r\n\t\r\nblock Middle\r\n\t- var VERSION = L('version') + \" (紐⑤컮??\";\r\n\t- var nick = SESSION.profile ? (SESSION.profile.title || SESSION.profile.name) : null;\r\n\tdiv#Intro\n\t\timg#intro(src='\u002Fimg\u002Fcustom\u002Fmobile-intro.png')\n\t\t\u002F\u002F- img#intro-start(src='\u002Fimg\u002Fkkutu\u002Fintro_start.gif')\r\n\t\tdiv#version= VERSION\r\n\t\tdiv#intro-text= L('LOADING')\r\n\tdiv.kkutu-menu\n\t\tbutton#HelpBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #BBBBBB;')!= L('help')\r\n\t\tbutton#SettingBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #CCCCCC;')!= L('settings')\r\n\t\tbutton#CommunityBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #DAA9FF;')!= L('community')\r\n\t\tbutton#SpectateBtn.for-master.for-normal(style='display: none; background-color: #D19DFF;'): +FA('eye')\r\n\t\tbutton#SetRoomBtn.for-master(style='display: none; background-color: #B0D2F3;'): +FA('magic')\r\n\t\tbutton#NewRoomBtn.for-lobby(style='display: none; background-color: #8EC0F3;'): +FA('magic')\r\n\t\tbutton#QuickRoomBtn.for-lobby(style='display: none; background-color: #B0D2F3;'): +FA('bolt')\r\n\t\t\u002F\u002F- button#ShopBtn.for-lobby(style='display: none; background-color: #B3E7B7;'): +FA('shopping-bag')\r\n\t\tbutton#DictionaryBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #73D07A;'): +FA('book')\r\n\t\t\u002F\u002F- button#WordPlusBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #73D07A;')= L('wordPlus')\r\n\t\tbutton#InviteBtn.for-master(style='display: none; background-color: #9FE669;'): +FA('envelope')\r\n\t\tbutton#ReadyBtn.for-normal(style='display: none; background-color: #FFC67F;'): +FA('play')\r\n\t\tbutton#StartBtn.for-master(style='display: none; background-color: #FFB576;'): +FA('play-circle')\r\n\t\tbutton#ExitBtn.for-master.for-normal.for-gaming(style='display: none; background-color: #FFADAD;'): +FA('times')\n\t\tbutton#ReplayBtn.for-lobby(style='display: none; background-color: #D9FF82;'): +FA('video-camera')\n\t\tbutton#LeaderboardBtn.for-lobby(style='display: none; background-color: #FFADD3;'): +FA('trophy')\n\tdiv#LobbyHero.for-lobby(style='display: none;')\n\t\tdiv#LobbyHeroImage.moremi\n\t\th3#LobbyHeroName= L('guest')\n\t\tdiv#LobbyHeroSub 끄투게임\n\t+Dialog('SettingDiag', 560, 610, '환경설정')\n\t\tdiv.settings-panel\n\t\t\tdiv.settings-intro\n\t\t\t\tdiv.settings-intro-icon(aria-hidden='true')\n\t\t\t\t\t+FA('sliders')\n\t\t\t\tdiv\n\t\t\t\t\th3 나만의 플레이 환경\n\t\t\t\t\tp 소리와 게임 편의 기능을 원하는 방식으로 조절하세요.\n\t\t\tsection.settings-section(aria-labelledby='settings-sound-title')\n\t\t\t\tdiv.settings-section-title\n\t\t\t\t\tspan.settings-section-icon(aria-hidden='true')\n\t\t\t\t\t\t+FA('volume-up')\n\t\t\t\t\tdiv\n\t\t\t\t\t\th4#settings-sound-title 사운드\n\t\t\t\t\t\tp 음악과 효과음은 따로 조절할 수 있어요.\n\t\t\t\tdiv.settings-audio-row\n\t\t\t\t\tdiv.settings-audio-label\n\t\t\t\t\t\tstrong 배경 음악\n\t\t\t\t\t\tspan 로비와 게임 음악\n\t\t\t\t\tdiv.settings-audio-controls\n\t\t\t\t\t\tinput.settings-range#settings-bgm-volume(type='range', min='0', max='100', step='1', value='100', aria-label='배경 음악 볼륨')\n\t\t\t\t\t\toutput#settings-bgm-value(for='settings-bgm-volume') 100%\n\t\t\t\t\t\tdiv.settings-mute\n\t\t\t\t\t\t\tinput.settings-switch#mute-bgm(type='checkbox')\n\t\t\t\t\t\t\tlabel(for='mute-bgm') 음소거\n\t\t\t\tdiv.settings-audio-row\n\t\t\t\t\tdiv.settings-audio-label\n\t\t\t\t\t\tstrong 효과음\n\t\t\t\t\t\tspan 시작·정답·알림 효과음\n\t\t\t\t\tdiv.settings-audio-controls\n\t\t\t\t\t\tinput.settings-range#settings-effect-volume(type='range', min='0', max='100', step='1', value='100', aria-label='효과음 볼륨')\n\t\t\t\t\t\toutput#settings-effect-value(for='settings-effect-volume') 100%\n\t\t\t\t\t\tdiv.settings-mute\n\t\t\t\t\t\t\tinput.settings-switch#mute-effect(type='checkbox')\n\t\t\t\t\t\t\tlabel(for='mute-effect') 음소거\n\t\t\tsection.settings-section(aria-labelledby='settings-play-title')\n\t\t\t\tdiv.settings-section-title\n\t\t\t\t\tspan.settings-section-icon(aria-hidden='true')\n\t\t\t\t\t\t+FA('gamepad')\n\t\t\t\t\tdiv\n\t\t\t\t\t\th4#settings-play-title 플레이와 소셜\n\t\t\t\t\t\tp 필요한 알림과 입장 옵션만 켜 둘 수 있어요.\n\t\t\t\tdiv.settings-option-grid\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#deny-invite(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 초대 받지 않기\n\t\t\t\t\t\t\tsmall 게임 초대 알림을 받지 않아요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#deny-whisper(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 귓속말 받지 않기\n\t\t\t\t\t\t\tsmall 귓속말 요청을 조용히 막아요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#deny-friend(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 친구 추가 받지 않기\n\t\t\t\t\t\t\tsmall 친구 요청을 받지 않아요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#auto-ready(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 자동 준비\n\t\t\t\t\t\t\tsmall 방에 들어가면 바로 준비해요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#sort-user(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 접속자 정렬\n\t\t\t\t\t\t\tsmall 접속자 목록을 정리해서 보여줘요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#only-waiting(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 대기 중인 방만 보기\n\t\t\t\t\t\t\tsmall 게임이 시작되지 않은 방만 보여줘요.\n\t\t\t\t\tlabel.settings-check\n\t\t\t\t\t\tinput#only-unlock(type='checkbox')\n\t\t\t\t\t\tspan.settings-check-box(aria-hidden='true')\n\t\t\t\t\t\tspan.settings-check-copy\n\t\t\t\t\t\t\tstrong 비밀번호 없는 방만 보기\n\t\t\t\t\t\t\tsmall 바로 입장할 수 있는 방만 보여줘요.\n\t\t\tdiv.settings-actions\n\t\t\t\tbutton#setting-reset.settings-action-reset(type='button') 기본값 복원\n\t\t\t\tbutton#setting-server.settings-action-secondary(type='button') 서버 선택\n\t\t\t\tbutton#setting-ok.settings-action-primary(type='button') 저장하고 적용\n\t+Dialog('CommunityDiag', 300, 300)\r\n\t\tdiv.dialog-bar(style='height: 225px; overflow-y: scroll;')\r\n\t\t\tdiv#comm-friends\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#comm-friend-add= L('friendAdd')\r\n\t+Dialog('LeaderboardDiag', 300, 450, L('leaderboard'))\r\n\t\tdiv.dialog-bar(style='height: 350px;'): table#ranking(style='text-align: center;')\r\n\t\t\tthead(style='font-weight: bold; background-color: #DDDDDD;'): tr\r\n\t\t\t\ttd(width=30) #\r\n\t\t\t\ttd(width=55)= L('LEVEL')\r\n\t\t\t\ttd(width=115)= L('nickname')\r\n\t\t\t\ttd(width=100)= L('recordScore')\r\n\t\t\ttbody\r\n\t\tdiv.dialog-bar: h4(style='width: 100%;')#lb-page\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#lb-next(style='margin-right: 6px;')= L('nextPage')\r\n\t\t\tbutton#lb-me= L('myRank')\r\n\t\t\tbutton#lb-prev= L('prevPage')\r\n\t+Dialog('QuickDiag', 300, 230, L('quickRoom'))\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('gameMode')\r\n\t\t\tselect#quick-mode\r\n\t\t\t\t- for(var i in locals.MODE)\r\n\t\t\t\t\toption(value=Number(i))= L('mode' + locals.MODE[i])\r\n\t\tdiv.dialog-bar(style='height: 59px;')\r\n\t\t\th4(style='height: 45px;')= L('misc')\r\n\t\t\t- for(var i in locals.OPTIONS)\r\n\t\t\t\t+GameOption(i, 'quick')\r\n\t\tdiv.dialog-bar\r\n\t\t\th4(style='width: 100%; height: 20px;')#quick-status\r\n\t\tdiv.dialog-bar\r\n\t\t\th4(style='width: 100%; height: 20px;')#quick-queue\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#quick-ok= L('OK')\r\n\t+Dialog('RoomDiag', 300, 415)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('roomTitle')\r\n\t\t\tinput#room-title(placeholder=(nick || L('guest'))+L('roomDefault'), maxlength=20)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('password')\r\n\t\t\tinput#room-pw(type='password', placeholder=L('password'), maxlength=20)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('userLimit')\r\n\t\t\tinput#room-limit(type='number', min=2, max=8, step=1, value=8)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('gameMode')\r\n\t\t\tselect#room-mode\r\n\t\t\t\t- for(var i in locals.MODE)\r\n\t\t\t\t\toption(value=Number(i))= L('mode' + locals.MODE[i])\r\n\t\tdiv.dialog-bar(style='margin-top: -5px; height: 50px;')\r\n\t\t\th4\r\n\t\t\th4#game-mode-expl.dialog-bar-value(style='width: 100%; font-size: 11px;')\r\n\t\tdiv.dialog-bar#room-dictionary-panel\r\n\t\t\th4= L('dictionaryPreset')\r\n\t\t\tselect#room-dictionary\r\n\t\t\t\toption(value='basic')= L('dictionaryBasic')\r\n\t\t\t\toption(value='standard', selected)= L('dictionaryStandard')\r\n\t\t\t\toption(value='complex')= L('dictionaryComplex')\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('numRound')\r\n\t\t\tinput#room-round(type='number', min=1, max=10, step=1, value=5)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('roundTime')\r\n\t\t\tselect#room-time\r\n\t\t\t\toption(value=10, style='color: #FF4444')\r\n\t\t\t\toption(value=30)\r\n\t\t\t\toption(value=60, selected)\r\n\t\t\t\toption(value=90)\r\n\t\t\t\toption(value=120)\r\n\t\t\t\toption(value=150)\r\n\t\tdiv.dialog-bar(style='height: 59px;')\r\n\t\t\th4(style='height: 45px;')= L('misc')\r\n\t\t\t- for(var i in locals.OPTIONS)\r\n\t\t\t\t+GameOption(i, 'room')\r\n\t\t\tdiv.dialog-opt#room-injpick-panel\r\n\t\t\t\tbutton#room-injeong-pick(style='font-size: 11px;')= L('pickInjeong')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#room-ok= L('OK')\r\n\t+Dialog('InjPickDiag', 200, 400, L('pickInjeong'))\r\n\t\th4= L('explInjPick')\r\n\t\tdiv.dialog-bar\r\n\t\t\tbutton#injpick-all= L('injpickAll')\r\n\t\t\tbutton#injpick-no= L('injpickNo')\r\n\t\tdiv.dialog-bar#injpick-list(style='height: 280px; overflow-y: scroll;')\r\n\t\t\tdiv.dialog-opt#ko-pick-list(style='width: 100%;')\r\n\t\t\t\t- locals.KO_THEME.concat(locals.KO_INJEONG).forEach(function(item){\r\n\t\t\t\t\t- var name = \"ko-pick-\" + item;\r\n\t\t\t\t\t- if(locals.IJP_EXCEPT.indexOf(item) != -1) return;\r\n\t\t\t\t\tdiv(style='float: left; width: 100%;')\r\n\t\t\t\t\t\tinput(id=name, type='checkbox', style='width: auto;')\r\n\t\t\t\t\t\tlabel(for=name)= LANG['theme_' + item]\r\n\t\t\t\t- });\r\n\t\t\tdiv.dialog-opt#en-pick-list(style='width: 100%;')\r\n\t\t\t\t- locals.EN_THEME.concat(locals.EN_INJEONG).forEach(function(item){\r\n\t\t\t\t\t- var name = \"en-pick-\" + item;\r\n\t\t\t\t\t- if(locals.IJP_EXCEPT.indexOf(item) != -1) return;\r\n\t\t\t\t\tdiv(style='float: left; width: 100%;')\r\n\t\t\t\t\t\tinput(id=name, type='checkbox', style='width: auto;')\r\n\t\t\t\t\t\tlabel(for=name)= LANG['theme_' + item]\r\n\t\t\t\t- });\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#injpick-ok= L('OK')\r\n\t+Dialog('RobotDiag', 300, 135, L('robot'))\n\t\tdiv.dialog-bar\n\t\t\th4= L('selectLevel')\n\t\t\tselect#robot-level\n\t\t\t\toption(value=0)= L('aiLevel0')\r\n\t\t\t\toption(value=1)= L('aiLevel1')\r\n\t\t\t\toption(value=2, selected)= L('aiLevel2')\r\n\t\t\t\toption(value=3)= L('aiLevel3')\r\n\t\t\t\toption(value=4)= L('aiLevel4')\r\n\t\tdiv.dialog-bar\n\t\t\th4= L('team')\n\t\t\tselect#robot-team\n\t\t\t\toption(value=0, selected)= L('teamSolo')\r\n\t\t\t\toption(value=1) A\r\n\t\t\t\toption(value=2) B\r\n\t\t\t\toption(value=3) C\r\n\t\t\t\toption(value=4) D\r\n\t\tdiv.dialog-bar.tail-button\n\t\t\tbutton#robot-ok= L('OK')\n\t+Dialog('ResultDiag', 300, 420, L('gameResult'), true)\r\n\t\tdiv.result-board\r\n\t\tdiv.result-me\r\n\t\t\tdiv.result-me-score\r\n\t\t\tdiv.result-me-money\r\n\t\t\tdiv.result-me-level\r\n\t\t\t\tdiv.result-me-level-head= L('LEVEL')\r\n\t\t\t\tdiv.result-me-level-body\r\n\t\t\t+GraphBar('result-me-gauge')\r\n\t\t\tdiv.result-me-score-text\r\n\t\t\tdiv.expl.result-me-expl\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#result-ok= L('OK')\r\n\t\t\tbutton#result-save= L('saveReplay')\r\n\t+Dialog('DictionaryDiag', 300, 300, L('dict'))\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('wpHere')\r\n\t\t\tinput#dict-input(style='width: 183px;', placeholder=L('wpInput'), maxlength=200)\r\n\t\tdiv.dialog-bar#dict-output(style='height: 195px; overflow-y: scroll; color: #BBBBBB; background-color: #111111;')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tselect#dict-theme(style='width: 86px;')\r\n\t\t\t\toption(value=\"\")= L('pickInjeong')\r\n\t\t\t\t- locals.KO_INJEONG.forEach(function(item){\r\n\t\t\t\t\toption(value=item)= L('theme_' + item)\r\n\t\t\t\t- });\r\n\t\t\tbutton#dict-search= L('SEARCH')\r\n\t\t\tbutton#dict-injeong= L('injeongReq')\r\n\t+Dialog('InviteDiag', 300, 420, L('invite'))\r\n\t\tdiv.invite-board(style='height: 355px; overflow-y: scroll;')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#invite-robot= L('inviteRobot')\r\n\t+Dialog('RoomInfoDiag', 300, 365)\r\n\t\tdiv.dialog-bar.room-info-head\r\n\t\t\th4= L('roomTitle')\r\n\t\t\th4.dialog-bar-value.ellipse#ri-title\r\n\t\t\th4= L('gameMode')\r\n\t\t\th4.dialog-bar-value#ri-mode\r\n\t\t\th4= L('rounds')\r\n\t\t\th4.dialog-bar-value#ri-round\r\n\t\tdiv.dialog-bar(style='padding: 2px 0px; border-top: 1px dashed #CCC; margin: 2px 0px;')\r\n\t\t\th4= L('players')\r\n\t\t\th4.dialog-bar-value#ri-limit\r\n\t\tdiv.dialog-bar(style='height: 190px; overflow-y: scroll;')\r\n\t\t\tdiv#ri-players(style='width: 100%;')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#room-info-join= L('join')\r\n\t+Dialog('ProfileDiag', 300, 360)\r\n\t\tdiv.dialog-bar.profile-head\r\n\t\tdiv.dialog-bar\r\n\t\t\th4(style='width: 83px;')= L('place')\r\n\t\t\th4.dialog-bar-value#profile-place\r\n\t\tdiv.dialog-bar.profile-record(style='padding: 2px 0px; border-top: 1px dashed #CCCCCC; margin: 2px 0px; height: 175px; overflow-y: scroll;')\r\n\t\t\tdiv.profile-record-field(style='font-weight: bold; text-align: center;')\r\n\t\t\t\tdiv.profile-field-name= L('gameMode')\r\n\t\t\t\tdiv.profile-field-record= L('record')\r\n\t\t\t\tdiv.profile-field-score= L('recordScore')\r\n\t\t\tdiv#profile-record\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#profile-whisper= L('whisper')\r\n\t\t\tbutton#profile-shut= L('shut')\r\n\t\t\tbutton#profile-kick= L('kick')\r\n\t\t\tbutton#profile-level= L('aiSetting')\r\n\t\t\tbutton#profile-dress= L('dress')\r\n\t\t\tbutton#profile-handover= L('handover')\r\n\t+Dialog('KickVoteDiag', 300, 160, L('kickVote'))\r\n\t\tdiv.dialog-bar#kick-vote-text(style='text-align: center;')\r\n\t\tdiv.dialog-bar(style='text-align: center;')= L('kickVoteNotice')\r\n\t\tdiv.dialog-bar\r\n\t\t\t+GraphBar('kick-vote-time')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#kick-vote-no= L('disagree')\r\n\t\t\tbutton#kick-vote-yes= L('agree')\r\n\t+Dialog('PurchaseDiag', 300, 205, L('purchase'))\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('pingBefore')\r\n\t\t\th4.dialog-bar-value.purchase-ping#purchase-ping-before\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('pingCost')\r\n\t\t\th4.dialog-bar-value.purchase-ping#purchase-ping-cost\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('pingAfter')\r\n\t\t\th4.dialog-bar-value.purchase-ping#purchase-ping-after\r\n\t\tdiv.dialog-bar\r\n\t\t\th4#purchase-item-name(style='width: 100%; font-weight: bold;')\r\n\t\tdiv.dialog-bar\r\n\t\t\th4#purchase-item-desc(style='width: 100%;')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#purchase-no= L('NO')\r\n\t\t\tbutton#purchase-ok= L('OK')\r\n\t+Dialog('ReplayDiag', 300, 300, L('replay'))\r\n\t\tinput#replay-file(type='file', style='width: 288px;', accept=\".kkt\")\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('replayDate')\r\n\t\t\th4.dialog-bar-value#replay-date -\r\n\t\tdiv.dialog-bar\r\n\t\t\th4= L('replayPlayers')\r\n\t\t\th4.dialog-bar-value#replay-players -\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#replay-view= L('replayView')\r\n\t+Dialog('ChatLogDiag', 300, 500, L('chatLog'))\r\n\t\tdiv#chat-log-board(style='height: 475px; font-size: 11px; overflow-y: scroll;')\r\n\t+Dialog('ObtainDiag', 300, 200, L('notice'), true)\r\n\t\tdiv.dialog-bar\r\n\t\t\th4(style='width: 100%;')= L('obtained') + '!'\r\n\t\tdiv.jt-image#obtain-image(style='margin-left: 110px; width: 80px; height: 80px;')\r\n\t\tdiv.dialog-bar#obtain-name(style='text-align: center;')\r\n\t\tdiv.dialog-bar.tail-button\r\n\t\t\tbutton#obtain-ok= L('OK')\r\n\t+Dialog('HelpDiag', 300, 400, L('helpText'))\r\n\t\tiframe#help-board(width=300, height=375)\r\n\t+Product('UserList')\n\t\tdiv 불러오는 중\n\t+Product('RoomList')\n\t\tdiv 불러오는 중\n\t+Product('Shop')\n\t\tdiv 불러오는 중\n\t+Product('Room')\n\t\tdiv.team-selector\r\n\t\t\tdiv.team-button#team-0.team-0= L('teamSolo')\r\n\t\t\tdiv.team-button#team-1.team-1 A\r\n\t\t\tdiv.team-button#team-2.team-2 B\r\n\t\t\tdiv.team-button#team-3.team-3 C\r\n\t\t\tdiv.team-button#team-4.team-4 D\r\n\t\tdiv.room-users\r\n\t+Product('Game')\r\n\t\tdiv.game-head\r\n\t\t\tdiv.b-left.bb(style='display: none;')\r\n\t\t\tdiv.b-left.cwcmd(style='display: none;')\r\n\t\t\t\tdiv.cw-q-head\r\n\t\t\t\tinput#cw-q-input(placeholder=L('inputHere'), style='width: 313px; height: 20px; font-size: 15px;')\r\n\t\t\t\tdiv.cw-q-body\r\n\t\t\tdiv.jjoriping\n\t\t\t\timg.jjoObj.jjoEyeL(src='\u002Fimg\u002FjjoeyeL.png')\n\t\t\t\timg.jjoObj.jjoNose(src='\u002Fimg\u002Fjjonose.png')\n\t\t\t\timg.jjoObj.jjoEyeR(src='\u002Fimg\u002FjjoeyeR.png')\n\t\t\t\tdiv.jjoDisplayBar\n\t\t\t\t\tdiv.jjo-display\n\t\t\t\t\t+GraphBar('jjo-turn-time')\n\t\t\t\t\t+GraphBar('jjo-round-time')\n\t\t\tdiv#WordMeaning.word-meaning-panel.is-empty(aria-live='polite')\n\t\t\t\tspan.word-meaning-label 낱말 뜻\n\t\t\t\tstrong.word-meaning-word -\n\t\t\t\tspan.word-meaning-definition 낱말을 입력하면 뜻이 표시됩니다.\n\t\t\tdiv.items\r\n\t\t\tdiv.hints(style='display: none;')\r\n\t\t\tdiv.chain\r\n\t\t\tdiv.rounds\r\n\t\t\tdiv.history-holder\r\n\t\t\t\tdiv.history\r\n\t\tdiv.game-body\n\t\tdiv.game-input\n\t\t\tinput#game-input(placeholder=L('yourTurn')+' '+L('inputHere'), autocomplete='off', autocorrect='off', autocapitalize='none', spellcheck='false', inputmode='text', aria-autocomplete='none')\n\t+Product('Chat')\r\n\t\tdiv#Chat\r\n\t\tinput#Talk(maxlength=200)\r\n\t\tbutton#ChatBtn= L('send')\r\n\tdiv#ad\r\n\r\nblock Bottom\r\n\tdiv#facebook-menu\r\n\t\tdiv.fb-like(data-href='http:\u002F\u002Fjjo.kr\u002Fkkutu', data-width='300', data-layout='button_count', data-action='like', data-show-faces='true', data-share='true')\r\n\tdiv.bottom-legal!= L('dictionarySupport')\r\n\tdiv.bottom-legal!= L('etcSupport')\r\n","Server\\lib\\Web\\views\\m_layout.pug":"\u002F\u002F-\n\tRule the words! KKuTu Online\n\tCopyright (C) 2017 JJoriping(op@jjo.kr)\n\n\tThis program is free software: you can redistribute it and\u002For modify\n\tit under the terms of the GNU General Public License as published by\n\tthe Free Software Foundation, either version 3 of the License, or\n\t(at your option) any later version.\n\n\tThis program is distributed in the hope that it will be useful,\n\tbut WITHOUT ANY WARRANTY; without even the implied warranty of\n\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\tGNU General Public License for more details.\n\n\tYou should have received a copy of the GNU General Public License\n\talong with this program. If not, see \u003Chttp:\u002F\u002Fwww.gnu.org\u002Flicenses\u002F\u003E.\ninclude module\n\n- if(LANG == undefined) LANG = locals.locale;\n\ndoctype html\nhtml\n\thead\n\t\tblock Subject\n\t\tmeta(charset='utf-8')\n\t\tmeta(name='viewport', content='width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no')\n\t\tscript(type='text\u002Fjavascript').\n\t\t\tfunction getObject(v, i) {\n\t\t\t\tObject.defineProperty(v, i, {value: v[i], writable: false});\n\t\t\t}\n\t\t\tgetObject(window.WebSocket, \"send\");\n\t\t\tgetObject(window.WebSocket, \"onmessage\");\n\t\t\tgetObject(window, \"WebSocket\");\n\n\t\tblock Search\n\t\t\tmeta(name='description', content=LANG['meta_desc'] || L('META_DESC'))\n\t\t\tmeta(name='keywords', content=LANG['meta_keys'] || L('META_KEYS'))\n\n\t\tblock OpenGraph\n\t\t\tmeta(property='og:image', content='#{locals.ogImage || \"http:\u002F\u002FJJo.kr\u002Fimg\u002FogImage.png\"}')\n\t\t\tmeta(property='og:url', content='#{locals.ogURL || \"http:\u002F\u002FJJo.kr\u002F\"}')\n\t\t\tmeta(property='og:title', content='#{locals.ogTitle || \"쪼롤 - League of Legends 정보 검색 사이트\"}')\n\t\t\tmeta(property='og:description', content='#{locals.ogDescription || \"롤 전적검색은 JJO.KR\"}')\n\n\t\t+PageHead()\n\t\t\tblock Preload\n\t\tblock CSS\n\t\tblock JS\n\t\tlink(rel='stylesheet', href='\u002Fcss\u002Faccount-ui.css?v=20260906-fullscreen-3')\n\t\tscript(src='\u002Fjs\u002Faccount-ui.js?v=20260906-fullscreen-3', defer)\n\n\tbody(style='min-width: 200px;')\n\t\tdiv#Top\n\t\t\t+MMenu()\n\t\t\tdiv#global-notice\n\t\t\t\tdiv#gn-content\n\t\t\t\t\tinclude ..\u002Fpublic\u002Fglobal_notice.html\n\t\t\tblock Top\n\t\tdiv#Jungle\n\t\t\tspan#mobile= locals.mobile\n\t\t\tspan#summonerID= DATA._id\n\t\t\timg#Background(src='\u002Fimg\u002Fbg\u002F' + (locals.m_bg || 'def.png'))\n\t\t\tblock Jungle\n\t\tdiv#Middle\n\t\t\tblock Middle\n\t\tdiv#Bottom\n\t\t\tblock Bottom\n\t\t\tdiv.bottom-legal\n\t\t\t\ta(href='?pc=true')= L('AS_PC')\n\t\t\t\tbr\n\t\t\t\ta.bottom-contact(href='http:\u002F\u002Fblog.jjo.kr\u002F', target='_blank')= L('CREATOR')\n\t\t\t\ta.bottom-contact(href='mailto:op@jjo.kr', target='_blank') Contact op@jjo.kr\n\t\t\tdiv.bottom-legal!= L('GPL')\n\t\t\t+separator(40)\n","Server\\lib\\Web\\views\\module.pug":"\u002F\u002F-\n\tRule the words! KKuTu Online\n\tCopyright (C) 2017 JJoriping(op@jjo.kr)\n\t\n\tThis program is free software: you can redistribute it and\u002For modify\n\tit under the terms of the GNU General Public License as published by\n\tthe Free Software Foundation, either version 3 of the License, or\n\t(at your option) any later version.\n\t\n\tThis program is distributed in the hope that it will be useful,\n\tbut WITHOUT ANY WARRANTY; without even the implied warranty of\n\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\tGNU General Public License for more details.\n\t\n\tYou should have received a copy of the GNU General Public License\n\talong with this program. If not, see \u003Chttp:\u002F\u002Fwww.gnu.org\u002Flicenses\u002F\u003E.\n\u002F\u002F-\n\t볕뉘 수정사항:\n\t* Login 을 Passport 로 수행하기 위한 수정\n-\n\tconst MENU = [\n\t\t{ key: 'HOME', href: \"http:\u002F\u002Fjjo.kr\u002F\" },\n\t\t\u002F*{ key: 'DB', sub: [\n\t\t\t{ key: 'DB_CHAMP', href: \"\u002Fdb\u002Fchampion\" },\n\t\t\t{ key: 'DB_ITEM', href: \"\u002Fdb\u002Fitem\" },\n\t\t\t{ key: 'DB_RUNE', href: \"\u002Fdb\u002Frune\" },\n\t\t\t{ key: 'DB_MASTERY', href: \"\u002Fdb\u002Fmastery\" }\n\t\t]},*\u002F\n\t\t{ key: 'GAMES', sub: [\n\t\t\t{ key: 'GAMES_KKUTU', href: \"\u002F\" },\n\t\t\t{ key: 'GAMES_FATES', href: \"http:\u002F\u002Fjjo.kr\u002Fgame\u002Ffates\" }\n\t\t]},\n\t\t{ key: 'GALLERY', href: \"http:\u002F\u002Fjjo.kr\u002Fgallery\" }\n\t];\n\tconst PUBLIC = locals.published;\n\t\n\tvar DATA = locals.data || {};\n\tvar LANG = locals.locale;\n\tvar SESSION = locals.session;\n\n\tfunction L(id){\n\t\tvar R = LANG[id] || \"(L#\"+id+\")\", i;\n\t\t\n\t\tR = R.toString();\n\t\tfor(i=1; arguments[i]; i++) R = R.replace(new RegExp(\"{V\"+i+\"}\", 'g'), arguments[i]);\n\t\treturn R.replace(\u002FFA\\{[^\\}]+\\}\u002Fg, _L_Replace);\n\t}\n\tfunction _L_Replace(seq){ return \"\u003Ci class='fa fa-\"+seq.slice(3, seq.length-1)+\"'\u003E\u003C\u002Fi\u003E\"; }\n\t\n\tfunction zeroPadding(num, len){ var s = num.toString(); return \"000000000000000\".slice(0, Math.max(0, len - s.length)) + s; }\n\tfunction strcmp(s1, s2){ return (s1 == s2) ? 0 : ((s1 \u003E s2) ? 1 : -1); }\n\tDate.prototype.toYYYYMMDD = function(){\n\t\tvar i, res = [this.getFullYear(), this.getMonth() + 1, this.getDate()];\n\t\t\n\t\tfor(i in res) res[i] = ((res[i] \u003C 10) ? \"0\" : \"\") + res[i];\n\t\treturn res.join(\"\").toString();\n\t};\n\nmixin Menu()\n\tdiv.Menu\n\t\t- for(i in MENU)\n\t\t\t- if(MENU[i].href)\n\t\t\t\tbutton.menu-btn(id='menu-item-'+MENU[i].key, onclick='location.href = \"'+MENU[i].href+'\";')!= L(MENU[i].key)\n\t\t\t- else if(MENU[i].sub)\n\t\t\t\tdiv.menu-btn(id='menu-item-'+MENU[i].key)!= L(MENU[i].key)\n\t\t\t\t\tdiv.menu-sub-separator\n\t\t\t\t\t- for(j in MENU[i].sub)\n\t\t\t\t\t\tdiv.menu-sub-btn(onclick='location.href = \"'+MENU[i].sub[j].href+'\";')!= L(MENU[i].sub[j].key)\n\t\tdiv#quick-search\n\t\t\tinput#quick-search-tf(placeholder=L('QUICK_HOLDER'))\n\t\t\tbutton#quick-search-btn!= L('QUICK_BTN')\n\t\tdiv#account\n\t\t\tspan#profile= SESSION.profile ? JSON.stringify(SESSION.profile) : '{}'\n\t\t\tdiv#account-info\n\nmixin MMenu()\n\tdiv.Menu\n\t\tdiv.menu-btn(id='menu-item-GAMES')\n\t\t\t+FA('bars')\n\t\t\t+separator(10)\n\t\t\tdiv.menu-sub-btn(onclick='location.href = \"http:\u002F\u002Fjjo.kr\u002F\";', style='margin: 7px 0px; height: 25px;')!= L('HOME')\n\t\t\tdiv.menu-sub-btn(onclick='location.href = \"http:\u002F\u002Fkkutu.kr\u002F\";', style='margin: 7px 0px; height: 25px;')!= L('GAMES_KKUTU')\n\t\t\tdiv.menu-sub-btn(onclick='location.href = \"http:\u002F\u002Fjjo.kr\u002Fgallery\";', style='margin: 7px 0px; height: 25px;')!= L('GALLERY')\n\t\tdiv#quick-search\n\t\t\tinput#quick-search-tf(placeholder=L('QUICK_HOLDER'))\n\t\t\tbutton#quick-search-btn!= L('QUICK_BTN')\n\t\tdiv#account\n\t\t\tspan#profile= SESSION.profile ? JSON.stringify(SESSION.profile) : '{}'\n\t\t\tdiv#account-info\n\nmixin Image(c, url)\n\tdiv(class=\"jt-image \"+c, style=\"background-image: url(\"+url+\");\")\n\t\tif block\n\t\t\tblock\n\nmixin FA(id)\n\ti(class=\"fa fa-\"+id)\n\nmixin separator(len)\n\tdiv(style=\"float: left; width: 100%; margin: \"+len+\"px 0px;\")\n\t\nmixin PageHead(min)\n\tif !min\n\t\tlink(rel='stylesheet', href=(locals.mobile && !locals.as_pc && locals.page !== 'kkutu') ? '\u002Fcss\u002Fm_style.css' : '\u002Fcss\u002Fstyle.css')\n\t\tlink(rel='stylesheet', href='\u002Fcss\u002Ffa.css')\n\t\tlink(rel='stylesheet', href='\u002Fcss\u002Fexpl.css')\n\tscript(type='text\u002Fjavascript', src='\u002Fjs\u002Fjquery.js')\n\tscript(type='text\u002Fjavascript', src='\u002Flanguage\u002F'+locals.page.replace(\"\u002F\", \"_\")+'\u002F'+locals.lang)\n\t\n\tif PUBLIC && !SESSION.admin\n\t\t\u002F\u002Fscript(type='text\u002Fjavascript', src='\u002Fjs\u002Fgoogle.js')\n\tscript(type='text\u002Fjavascript', src='\u002Fjs\u002Fglobal.min.js')\n\tif !min\n\t\t\u002F\u002Fscript(type='text\u002Fjavascript', src='\u002Fjs\u002Ffacebook.js')\n\tif block\n\t\tblock\n\t- var pageAsset = locals.page.replace(\"\u002F\", \"_\");\n\t- var assetVersion = (pageAsset === 'portal' || pageAsset === 'm_portal' || pageAsset === 'kkutu' || pageAsset === 'm_kkutu') ? '?v=20260906-fullscreen-2' : '';\n\tlink(rel='stylesheet', href='\u002Fcss\u002Fin_'+pageAsset+'.css'+assetVersion)\n\t\u002F\u002F The KKuTu game pages load their combined client bundle in the page view.\n\t\u002F\u002F There is no standalone in_kkutu\u002Fminified asset, so avoid a permanent 404\n\t\u002F\u002F that can interrupt first-load UI initialization in some browsers.\n\tif pageAsset !== 'kkutu' && pageAsset !== 'm_kkutu'\n\t\tscript(type='text\u002Fjavascript', src='\u002Fjs\u002Fin_'+pageAsset+'.min.js'+assetVersion)\n\t\nmixin SearchBox(arg1, arg2)\n\tmeta(name='description', content=L('meta_desc', arg1, arg2))\n\tmeta(name='keywords', content=L('meta_keys', arg1, arg2))\n\nmixin Expl(text, width)\n\t- if(text == undefined) return;\n\tdiv.expl(style='width: '+(width ? (width + 'px') : 'initial'))\n\t\tif block\n\t\t\tblock\n\t\telse\n\t\t\th5= text\n\nmixin Product(id)\n\tdiv(class=id+'Box Product')\n\t\th5.product-title!= L(id)\n\t\tdiv.product-body\n\t\t\tif block\n\t\t\t\tblock\n\t\t\telse\n\t\t\t\th4= id\n\nmixin GraphBar(c, min, val, max, bgc)\n\tdiv(class='graph '+c)\n\t\tdiv.graph-bar(style='width: '+((val-min) \u002F (max-min) * 100)+'%;'+(bgc ? (' background-color: '+bgc+';') : ''))\n\nmixin ChartBar(c, data)\n\t-\n\t\tvar i, sum = 0, total = 100;\n\t\t\n\t\tfor(i in data) sum += data[i].value;\n\t\tdata[data.length - 1].last = true;\n\t\n\tdiv(class='chart '+c)\n\t\t- for(i in data)\n\t\t\t- var r = data[i].last ? total : (data[i].value \u002F sum * 100);\n\t\t\t- total -= r;\n\t\t\tdiv.chart-bar.ellipse(style='width: '+r+'%; background-color: '+data[i].color+';')= data[i].label || ''\n\t\t\t\t+Expl(data[i].label ? (data[i].label + ' ' + r.toFixed(1) + '%') : undefined)\n","Server\\lib\\Web\\public\\global_notice.html":"끄투게임이 출시되었습니다.\r\n"};
;var locals_for_with = (locals || {});(function (Date, JSON, Math, Number, RegExp) {;pug_debug_line = 19;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"] = pug_interp = function(id, w, h, t, nocls){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 20;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog\""+pug_attr("id", id, true, false)+pug_attr("style", pug_style(`width: ${w}px; height: ${h}px;`), true, false)) + "\u003E";
;pug_debug_line = 21;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes([nocls ? 'no-close dialog-head' : 'dialog-head'], [true]), false, false)) + "\u003E";
;pug_debug_line = 22;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog-title\""+pug_attr("style", pug_style(`width: ${w - 20}px;`), true, false)) + "\u003E";
;pug_debug_line = 22;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = t || '') ? "" : pug_interp) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 23;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-body\" style=\"font-size: 13px;\"\u003E";
;pug_debug_line = 24;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
block && block();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 26;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GameOption"] = pug_interp = function(key, prefix){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 27;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var name = locals.OPTIONS[key].name;
;pug_debug_line = 28;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var sid = name.toLowerCase();
;pug_debug_line = 29;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog-opt\""+pug_attr("id", `${prefix}-${sid}-panel`, true, false)) + "\u003E";
;pug_debug_line = 30;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" class=\"game-option\""+pug_attr("id", `${prefix}-${sid}`, true, false)+" type=\"checkbox\" style=\"margin-top: 5px; width: auto;\"") + "\u002F\u003E";
;pug_debug_line = 31;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", `${prefix}-${sid}`, true, false)) + "\u003E";
;pug_debug_line = 31;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L(`opt${name}`)) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E";
;pug_debug_line = 32;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Expl"].call({
block: function(){
;pug_debug_line = 33;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 33;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L(`expl${name}`)) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
}, true);
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 35;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";











;pug_debug_line = 20;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
const MENU = [
	{ key: 'HOME', href: "http://jjo.kr/" },
	/*{ key: 'DB', sub: [
		{ key: 'DB_CHAMP', href: "/db/champion" },
		{ key: 'DB_ITEM', href: "/db/item" },
		{ key: 'DB_RUNE', href: "/db/rune" },
		{ key: 'DB_MASTERY', href: "/db/mastery" }
	]},*/
	{ key: 'GAMES', sub: [
		{ key: 'GAMES_KKUTU', href: "/" },
		{ key: 'GAMES_FATES', href: "http://jjo.kr/game/fates" }
	]},
	{ key: 'GALLERY', href: "http://jjo.kr/gallery" }
];
const PUBLIC = locals.published;

var DATA = locals.data || {};
var LANG = locals.locale;
var SESSION = locals.session;

function L(id){
	var R = LANG[id] || "(L#"+id+")", i;
	
	R = R.toString();
	for(i=1; arguments[i]; i++) R = R.replace(new RegExp("{V"+i+"}", 'g'), arguments[i]);
	return R.replace(/FA\{[^\}]+\}/g, _L_Replace);
}
function _L_Replace(seq){ return "<i class='fa fa-"+seq.slice(3, seq.length-1)+"'></i>"; }

function zeroPadding(num, len){ var s = num.toString(); return "000000000000000".slice(0, Math.max(0, len - s.length)) + s; }
function strcmp(s1, s2){ return (s1 == s2) ? 0 : ((s1 > s2) ? 1 : -1); }
Date.prototype.toYYYYMMDD = function(){
	var i, res = [this.getFullYear(), this.getMonth() + 1, this.getDate()];
	
	for(i in res) res[i] = ((res[i] < 10) ? "0" : "") + res[i];
	return res.join("").toString();
};

;pug_debug_line = 59;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";



















































;pug_debug_line = 76;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["MMenu"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 77;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"Menu\"\u003E";
;pug_debug_line = 78;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"menu-btn\" id=\"menu-item-GAMES\"\u003E";
;pug_debug_line = 79;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["FA"]('bars');
;pug_debug_line = 80;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["separator"](10);
;pug_debug_line = 81;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"menu-sub-btn\" onclick=\"location.href = &quot;http:\u002F\u002Fjjo.kr\u002F&quot;;\" style=\"margin: 7px 0px; height: 25px;\"\u003E";
;pug_debug_line = 81;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L('HOME')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 82;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"menu-sub-btn\" onclick=\"location.href = &quot;http:\u002F\u002Fkkutu.kr\u002F&quot;;\" style=\"margin: 7px 0px; height: 25px;\"\u003E";
;pug_debug_line = 82;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L('GAMES_KKUTU')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 83;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"menu-sub-btn\" onclick=\"location.href = &quot;http:\u002F\u002Fjjo.kr\u002Fgallery&quot;;\" style=\"margin: 7px 0px; height: 25px;\"\u003E";
;pug_debug_line = 83;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L('GALLERY')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 84;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"quick-search\"\u003E";
;pug_debug_line = 85;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"quick-search-tf\""+pug_attr("placeholder", L('QUICK_HOLDER'), true, false)) + "\u002F\u003E";
;pug_debug_line = 86;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cbutton id=\"quick-search-btn\"\u003E";
;pug_debug_line = 86;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L('QUICK_BTN')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 87;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"account\"\u003E";
;pug_debug_line = 88;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cspan id=\"profile\"\u003E";
;pug_debug_line = 88;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = SESSION.profile ? JSON.stringify(SESSION.profile) : '{}') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 89;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"account-info\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 91;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";











;pug_debug_line = 96;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["FA"] = pug_interp = function(id){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 97;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Ci" + (pug_attr("class", pug_classes(["fa fa-"+id], [true]), false, false)) + "\u003E\u003C\u002Fi\u003E";
};
;pug_debug_line = 99;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["separator"] = pug_interp = function(len){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 100;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("style", pug_style("float: left; width: 100%; margin: "+len+"px 0px;"), true, false)) + "\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 102;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["PageHead"] = pug_interp = function(min){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 103;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (!min) {
;pug_debug_line = 104;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink" + (" rel=\"stylesheet\""+pug_attr("href", (locals.mobile && !locals.as_pc && locals.page !== 'kkutu') ? '/css/m_style.css' : '/css/style.css', true, false)) + "\u002F\u003E";
;pug_debug_line = 105;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Ffa.css\"\u002F\u003E";
;pug_debug_line = 106;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fexpl.css\"\u002F\u003E";
}
;pug_debug_line = 107;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fjquery.js\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 108;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript" + (" type=\"text\u002Fjavascript\""+pug_attr("src", '/language/'+locals.page.replace("/", "_")+'/'+locals.lang, true, false)) + "\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 110;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (PUBLIC && !SESSION.admin) {
;pug_debug_line = 111;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003C!--script(type='text\u002Fjavascript', src='\u002Fjs\u002Fgoogle.js')--\u003E";
}
;pug_debug_line = 112;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fglobal.min.js\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 113;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (!min) {
;pug_debug_line = 114;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003C!--script(type='text\u002Fjavascript', src='\u002Fjs\u002Ffacebook.js')--\u003E";
}
;pug_debug_line = 115;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (block) {
;pug_debug_line = 116;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
block && block();
}
;pug_debug_line = 117;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
var pageAsset = locals.page.replace("/", "_");
;pug_debug_line = 118;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
var assetVersion = (pageAsset === 'portal' || pageAsset === 'm_portal' || pageAsset === 'kkutu' || pageAsset === 'm_kkutu') ? '?v=20260906-fullscreen-2' : '';
;pug_debug_line = 119;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink" + (" rel=\"stylesheet\""+pug_attr("href", '/css/in_'+pageAsset+'.css'+assetVersion, true, false)) + "\u002F\u003E";
;pug_debug_line = 120;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- The KKuTu game pages load their combined client bundle in the page view.--\u003E";
;pug_debug_line = 121;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- There is no standalone in_kkutu\u002Fminified asset, so avoid a permanent 404--\u003E";
;pug_debug_line = 122;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- that can interrupt first-load UI initialization in some browsers.--\u003E";
;pug_debug_line = 123;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (pageAsset !== 'kkutu' && pageAsset !== 'm_kkutu') {
;pug_debug_line = 124;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript" + (" type=\"text\u002Fjavascript\""+pug_attr("src", '/js/in_'+pageAsset+'.min.js'+assetVersion, true, false)) + "\u003E\u003C\u002Fscript\u003E";
}
};
;pug_debug_line = 126;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";







;pug_debug_line = 130;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["Expl"] = pug_interp = function(text, width){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 131;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if(text == undefined) return;
;pug_debug_line = 132;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"expl\""+pug_attr("style", pug_style('width: '+(width ? (width + 'px') : 'initial')), true, false)) + "\u003E";
;pug_debug_line = 133;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (block) {
;pug_debug_line = 134;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
block && block();
}
else {
;pug_debug_line = 136;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 136;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 138;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["Product"] = pug_interp = function(id){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 139;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes([id+'Box Product'], [true]), false, false)) + "\u003E";
;pug_debug_line = 140;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch5 class=\"product-title\"\u003E";
;pug_debug_line = 140;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L(id)) ? "" : pug_interp) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 141;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"product-body\"\u003E";
;pug_debug_line = 142;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
if (block) {
;pug_debug_line = 143;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
block && block();
}
else {
;pug_debug_line = 145;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 145;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = id) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 147;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_mixins["GraphBar"] = pug_interp = function(c, min, val, max, bgc){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 148;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes(['graph '+c], [true]), false, false)) + "\u003E";
;pug_debug_line = 149;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"graph-bar\""+pug_attr("style", pug_style('width: '+((val-min) / (max-min) * 100)+'%;'+(bgc ? (' background-color: '+bgc+';') : '')), true, false)) + "\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 151;pug_debug_filename = "Server\\lib\\Web\\views\\module.pug";























;pug_debug_line = 19;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
if(LANG == undefined) LANG = locals.locale;
;pug_debug_line = 21;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003C!DOCTYPE html\u003E";
;pug_debug_line = 22;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Chtml\u003E";
;pug_debug_line = 23;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Chead\u003E";
;pug_debug_line = 24;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 41;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctitle\u003E";
;pug_debug_line = 41;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Ftitle\u003E";
;pug_debug_line = 25;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta charset=\"utf-8\"\u003E";
;pug_debug_line = 26;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no\"\u003E";
;pug_debug_line = 27;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\"\u003E";
;pug_debug_line = 28;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "function getObject(v, i) {";
;pug_debug_line = 29;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 29;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\tObject.defineProperty(v, i, {value: v[i], writable: false});";
;pug_debug_line = 30;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 30;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "}";
;pug_debug_line = 31;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 31;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "getObject(window.WebSocket, \"send\");";
;pug_debug_line = 32;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 32;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "getObject(window.WebSocket, \"onmessage\");";
;pug_debug_line = 33;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 33;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "getObject(window, \"WebSocket\");";
;pug_debug_line = 34;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 34;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003C\u002Fscript\u003E";
;pug_debug_line = 35;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 36;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"description\""+pug_attr("content", LANG['meta_desc'] || L('META_DESC'), true, true)) + "\u003E";
;pug_debug_line = 37;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"keywords\""+pug_attr("content", LANG['meta_keys'] || L('META_KEYS'), true, true)) + "\u003E";
;pug_debug_line = 39;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 40;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:image\" content=\"#{locals.ogImage || &quot;http:\u002F\u002FJJo.kr\u002Fimg\u002FogImage.png&quot;}\"\u003E";
;pug_debug_line = 41;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:url\" content=\"#{locals.ogURL || &quot;http:\u002F\u002FJJo.kr\u002F&quot;}\"\u003E";
;pug_debug_line = 42;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:title\" content=\"#{locals.ogTitle || &quot;쪼롤 - League of Legends 정보 검색 사이트&quot;}\"\u003E";
;pug_debug_line = 43;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:description\" content=\"#{locals.ogDescription || &quot;롤 전적검색은 JJO.KR&quot;}\"\u003E";
;pug_debug_line = 45;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_mixins["PageHead"].call({
block: function(){
;pug_debug_line = 46;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
}
});
;pug_debug_line = 47;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 48;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fin_game_kkutu_shop.css\"\u003E";
;pug_debug_line = 49;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fplay-shell.css?v=20260906-ui-audit-4\"\u003E";
;pug_debug_line = 50;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fgame-ui-audit.css?v=20260906-ui-audit-7\"\u003E";
;pug_debug_line = 51;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fsettings-ui.css?v=20260906-settings-1\"\u003E";
;pug_debug_line = 48;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 44;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fin_game_kkutu.min.js?v=20260906-settings-2\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 45;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cscript src=\"https:\u002F\u002Fwww.google.com\u002Frecaptcha\u002Fapi.js\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 49;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Faccount-ui.css?v=20260906-fullscreen-3\"\u003E";
;pug_debug_line = 50;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cscript" + (" src=\"\u002Fjs\u002Faccount-ui.js?v=20260906-fullscreen-3\""+pug_attr("defer", true, true, true)) + "\u003E\u003C\u002Fscript\u003E\u003C\u002Fhead\u003E";
;pug_debug_line = 52;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cbody style=\"min-width: 200px;\"\u003E";
;pug_debug_line = 53;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Top\"\u003E";
;pug_debug_line = 54;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_mixins["MMenu"]();
;pug_debug_line = 55;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"global-notice\"\u003E";
;pug_debug_line = 56;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"gn-content\"\u003E끄투게임이 출시되었습니다.\n\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 58;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 59;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Jungle\"\u003E";
;pug_debug_line = 60;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cspan id=\"mobile\"\u003E";
;pug_debug_line = 60;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.mobile) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 61;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cspan id=\"summonerID\"\u003E";
;pug_debug_line = 61;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = DATA._id) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 62;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cimg" + (" id=\"Background\""+pug_attr("src", '/img/bg/' + (locals.m_bg || 'def.png'), true, true)) + "\u003E";
;pug_debug_line = 63;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 54;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"PUBLIC\"\u003E";
;pug_debug_line = 54;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = PUBLIC ? "true" : undefined) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 55;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"URL\"\u003E";
;pug_debug_line = 55;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${locals.PROTOCOL}://${locals.HOST}:${locals.PORT}/${locals._id}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 56;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"MOREMI_PART\"\u003E";
;pug_debug_line = 56;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.MOREMI_PART.join(',')) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 57;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"AVAIL_EQUIP\"\u003E";
;pug_debug_line = 57;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.AVAIL_EQUIP.join(',')) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 58;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"RULE\"\u003E";
;pug_debug_line = 58;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = JSON.stringify(locals.RULE)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 59;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"OPTIONS\"\u003E";
;pug_debug_line = 59;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = JSON.stringify(locals.OPTIONS)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 60;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Yell\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 61;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Loading\"\u003E";
;pug_debug_line = 61;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LOADING')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 62;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
LANG['explInjeong'] = `<h5>${L('explInjeong')}</h5>\
	<h5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'>${L('explInjeongListTitle')}</h5>\
	<h5>${locals.KO_INJEONG.map(function(item){ return L('theme_' + item); })}</h5>\
	<h5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'>${L('explInjeongListTitle')} (${L('modeEKT')}, ${L('modeESH')})</h5>\
	<h5>${locals.EN_INJEONG.map(function(item){ return L('theme_' + item); })}</h5>`;

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 64;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Middle\"\u003E";
;pug_debug_line = 65;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 70;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var VERSION = L('version') + " (紐⑤컮??";
;pug_debug_line = 71;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var nick = SESSION.profile ? (SESSION.profile.title || SESSION.profile.name) : null;
;pug_debug_line = 72;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Intro\"\u003E";
;pug_debug_line = 73;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cimg id=\"intro\" src=\"\u002Fimg\u002Fcustom\u002Fmobile-intro.png\"\u003E";
;pug_debug_line = 75;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"version\"\u003E";
;pug_debug_line = 75;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = VERSION) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 76;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"intro-text\"\u003E";
;pug_debug_line = 76;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LOADING')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 77;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"kkutu-menu\"\u003E";
;pug_debug_line = 78;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby for-master for-normal for-gaming\" id=\"HelpBtn\" style=\"display: none; background-color: #BBBBBB;\"\u003E";
;pug_debug_line = 78;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('help')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 79;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby for-master for-normal for-gaming\" id=\"SettingBtn\" style=\"display: none; background-color: #CCCCCC;\"\u003E";
;pug_debug_line = 79;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('settings')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 80;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby for-master for-normal for-gaming\" id=\"CommunityBtn\" style=\"display: none; background-color: #DAA9FF;\"\u003E";
;pug_debug_line = 80;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('community')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 81;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master for-normal\" id=\"SpectateBtn\" style=\"display: none; background-color: #D19DFF;\"\u003E";
;pug_debug_line = 81;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('eye');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 82;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"SetRoomBtn\" style=\"display: none; background-color: #B0D2F3;\"\u003E";
;pug_debug_line = 82;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('magic');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 83;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"NewRoomBtn\" style=\"display: none; background-color: #8EC0F3;\"\u003E";
;pug_debug_line = 83;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('magic');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 84;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"QuickRoomBtn\" style=\"display: none; background-color: #B0D2F3;\"\u003E";
;pug_debug_line = 84;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('bolt');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 86;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby for-master for-normal for-gaming\" id=\"DictionaryBtn\" style=\"display: none; background-color: #73D07A;\"\u003E";
;pug_debug_line = 86;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('book');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 88;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"InviteBtn\" style=\"display: none; background-color: #9FE669;\"\u003E";
;pug_debug_line = 88;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('envelope');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 89;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-normal\" id=\"ReadyBtn\" style=\"display: none; background-color: #FFC67F;\"\u003E";
;pug_debug_line = 89;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('play');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 90;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"StartBtn\" style=\"display: none; background-color: #FFB576;\"\u003E";
;pug_debug_line = 90;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('play-circle');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 91;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master for-normal for-gaming\" id=\"ExitBtn\" style=\"display: none; background-color: #FFADAD;\"\u003E";
;pug_debug_line = 91;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('times');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 92;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"ReplayBtn\" style=\"display: none; background-color: #D9FF82;\"\u003E";
;pug_debug_line = 92;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('video-camera');
pug_html = pug_html + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 93;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"LeaderboardBtn\" style=\"display: none; background-color: #FFADD3;\"\u003E";
;pug_debug_line = 93;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('trophy');
pug_html = pug_html + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 94;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"for-lobby\" id=\"LobbyHero\" style=\"display: none;\"\u003E";
;pug_debug_line = 95;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"moremi\" id=\"LobbyHeroImage\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 96;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch3 id=\"LobbyHeroName\"\u003E";
;pug_debug_line = 96;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('guest')) ? "" : pug_interp)) + "\u003C\u002Fh3\u003E";
;pug_debug_line = 97;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"LobbyHeroSub\"\u003E";
;pug_debug_line = 97;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 98;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 99;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-panel\"\u003E";
;pug_debug_line = 100;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-intro\"\u003E";
;pug_debug_line = 101;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-intro-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 102;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('sliders');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 103;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 104;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 104;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "나만의 플레이 환경\u003C\u002Fh3\u003E";
;pug_debug_line = 105;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 105;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "소리와 게임 편의 기능을 원하는 방식으로 조절하세요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 106;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csection class=\"settings-section\" aria-labelledby=\"settings-sound-title\"\u003E";
;pug_debug_line = 107;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-section-title\"\u003E";
;pug_debug_line = 108;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-section-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 109;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('volume-up');
pug_html = pug_html + "\u003C\u002Fspan\u003E";
;pug_debug_line = 110;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 111;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"settings-sound-title\"\u003E";
;pug_debug_line = 111;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "사운드\u003C\u002Fh4\u003E";
;pug_debug_line = 112;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 112;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "음악과 효과음은 따로 조절할 수 있어요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 113;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-row\"\u003E";
;pug_debug_line = 114;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-label\"\u003E";
;pug_debug_line = 115;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 115;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "배경 음악\u003C\u002Fstrong\u003E";
;pug_debug_line = 116;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 116;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "로비와 게임 음악\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 117;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-controls\"\u003E";
;pug_debug_line = 118;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-range\" id=\"settings-bgm-volume\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"100\" aria-label=\"배경 음악 볼륨\"\u003E";
;pug_debug_line = 119;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coutput id=\"settings-bgm-value\" for=\"settings-bgm-volume\"\u003E";
;pug_debug_line = 119;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "100%\u003C\u002Foutput\u003E";
;pug_debug_line = 120;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-mute\"\u003E";
;pug_debug_line = 121;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-switch\" id=\"mute-bgm\" type=\"checkbox\"\u003E";
;pug_debug_line = 122;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel for=\"mute-bgm\"\u003E";
;pug_debug_line = 122;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "음소거\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 123;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-row\"\u003E";
;pug_debug_line = 124;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-label\"\u003E";
;pug_debug_line = 125;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 125;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "효과음\u003C\u002Fstrong\u003E";
;pug_debug_line = 126;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 126;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "시작·정답·알림 효과음\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 127;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-controls\"\u003E";
;pug_debug_line = 128;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-range\" id=\"settings-effect-volume\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"100\" aria-label=\"효과음 볼륨\"\u003E";
;pug_debug_line = 129;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coutput id=\"settings-effect-value\" for=\"settings-effect-volume\"\u003E";
;pug_debug_line = 129;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "100%\u003C\u002Foutput\u003E";
;pug_debug_line = 130;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-mute\"\u003E";
;pug_debug_line = 131;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-switch\" id=\"mute-effect\" type=\"checkbox\"\u003E";
;pug_debug_line = 132;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel for=\"mute-effect\"\u003E";
;pug_debug_line = 132;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "음소거\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";
;pug_debug_line = 133;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csection class=\"settings-section\" aria-labelledby=\"settings-play-title\"\u003E";
;pug_debug_line = 134;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-section-title\"\u003E";
;pug_debug_line = 135;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-section-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 136;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["FA"]('gamepad');
pug_html = pug_html + "\u003C\u002Fspan\u003E";
;pug_debug_line = 137;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 138;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"settings-play-title\"\u003E";
;pug_debug_line = 138;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "플레이와 소셜\u003C\u002Fh4\u003E";
;pug_debug_line = 139;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 139;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "필요한 알림과 입장 옵션만 켜 둘 수 있어요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 140;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-option-grid\"\u003E";
;pug_debug_line = 141;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 142;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-invite\" type=\"checkbox\"\u003E";
;pug_debug_line = 143;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 144;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 145;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 145;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "초대 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 146;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 146;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "게임 초대 알림을 받지 않아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 147;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 148;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-whisper\" type=\"checkbox\"\u003E";
;pug_debug_line = 149;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 150;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 151;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 151;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "귓속말 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 152;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 152;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "귓속말 요청을 조용히 막아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 153;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 154;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-friend\" type=\"checkbox\"\u003E";
;pug_debug_line = 155;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 156;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 157;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 157;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "친구 추가 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 158;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 158;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "친구 요청을 받지 않아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 159;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 160;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"auto-ready\" type=\"checkbox\"\u003E";
;pug_debug_line = 161;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 162;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 163;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 163;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "자동 준비\u003C\u002Fstrong\u003E";
;pug_debug_line = 164;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 164;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "방에 들어가면 바로 준비해요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 165;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 166;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"sort-user\" type=\"checkbox\"\u003E";
;pug_debug_line = 167;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 168;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 169;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 169;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "접속자 정렬\u003C\u002Fstrong\u003E";
;pug_debug_line = 170;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 170;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "접속자 목록을 정리해서 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 171;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 172;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"only-waiting\" type=\"checkbox\"\u003E";
;pug_debug_line = 173;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 174;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 175;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 175;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "대기 중인 방만 보기\u003C\u002Fstrong\u003E";
;pug_debug_line = 176;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 176;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "게임이 시작되지 않은 방만 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 177;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 178;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"only-unlock\" type=\"checkbox\"\u003E";
;pug_debug_line = 179;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 180;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 181;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 181;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "비밀번호 없는 방만 보기\u003C\u002Fstrong\u003E";
;pug_debug_line = 182;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 182;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "바로 입장할 수 있는 방만 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";
;pug_debug_line = 183;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-actions\"\u003E";
;pug_debug_line = 184;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-reset\" id=\"setting-reset\" type=\"button\"\u003E";
;pug_debug_line = 184;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "기본값 복원\u003C\u002Fbutton\u003E";
;pug_debug_line = 185;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-secondary\" id=\"setting-server\" type=\"button\"\u003E";
;pug_debug_line = 185;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "서버 선택\u003C\u002Fbutton\u003E";
;pug_debug_line = 186;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-primary\" id=\"setting-ok\" type=\"button\"\u003E";
;pug_debug_line = 186;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "저장하고 적용\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
}, 'SettingDiag', 560, 610, '환경설정');
;pug_debug_line = 187;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 188;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 225px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 189;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"comm-friends\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 190;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 191;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"comm-friend-add\"\u003E";
;pug_debug_line = 191;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('friendAdd')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'CommunityDiag', 300, 300);
;pug_debug_line = 192;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 193;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 350px;\"\u003E";
;pug_debug_line = 193;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctable id=\"ranking\" style=\"text-align: center;\"\u003E";
;pug_debug_line = 194;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cthead style=\"font-weight: bold; background-color: #DDDDDD;\"\u003E";
;pug_debug_line = 194;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctr\u003E";
;pug_debug_line = 195;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctd width=\"30\"\u003E";
;pug_debug_line = 195;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "#\u003C\u002Ftd\u003E";
;pug_debug_line = 196;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctd width=\"55\"\u003E";
;pug_debug_line = 196;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LEVEL')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 197;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctd width=\"115\"\u003E";
;pug_debug_line = 197;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('nickname')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 198;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctd width=\"100\"\u003E";
;pug_debug_line = 198;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('recordScore')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E";
;pug_debug_line = 199;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ctbody\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 200;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 200;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%;\" id=\"lb-page\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 201;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 202;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"lb-next\" style=\"margin-right: 6px;\"\u003E";
;pug_debug_line = 202;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('nextPage')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 203;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"lb-me\"\u003E";
;pug_debug_line = 203;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('myRank')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 204;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"lb-prev\"\u003E";
;pug_debug_line = 204;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('prevPage')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'LeaderboardDiag', 300, 450, L('leaderboard'));
;pug_debug_line = 205;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 206;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 207;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 207;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 208;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"quick-mode\"\u003E";
;pug_debug_line = 209;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
for(var i in locals.MODE)
{
;pug_debug_line = 210;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (pug_attr("value", Number(i), true, true)) + "\u003E";
;pug_debug_line = 210;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('mode' + locals.MODE[i])) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
}
pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 211;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 59px;\"\u003E";
;pug_debug_line = 212;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"height: 45px;\"\u003E";
;pug_debug_line = 212;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('misc')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 213;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
for(var i in locals.OPTIONS)
{
;pug_debug_line = 214;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GameOption"](i, 'quick');
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 215;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 216;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%; height: 20px;\" id=\"quick-status\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 217;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 218;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%; height: 20px;\" id=\"quick-queue\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 219;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 220;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"quick-ok\"\u003E";
;pug_debug_line = 220;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'QuickDiag', 300, 230, L('quickRoom'));
;pug_debug_line = 221;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 222;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 223;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 223;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roomTitle')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 224;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"room-title\""+pug_attr("placeholder", (nick || L('guest'))+L('roomDefault'), true, true)+" maxlength=\"20\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 225;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 226;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 226;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('password')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 227;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"room-pw\" type=\"password\""+pug_attr("placeholder", L('password'), true, true)+" maxlength=\"20\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 228;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 229;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 229;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('userLimit')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 230;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"room-limit\" type=\"number\" min=\"2\" max=\"8\" step=\"1\" value=\"8\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 231;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 232;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 232;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 233;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-mode\"\u003E";
;pug_debug_line = 234;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
for(var i in locals.MODE)
{
;pug_debug_line = 235;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (pug_attr("value", Number(i), true, true)) + "\u003E";
;pug_debug_line = 235;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('mode' + locals.MODE[i])) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
}
pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 236;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"margin-top: -5px; height: 50px;\"\u003E";
;pug_debug_line = 237;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 238;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"game-mode-expl\" style=\"width: 100%; font-size: 11px;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 239;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"room-dictionary-panel\"\u003E";
;pug_debug_line = 240;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 240;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryPreset')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 241;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-dictionary\"\u003E";
;pug_debug_line = 242;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"basic\"\u003E";
;pug_debug_line = 242;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryBasic')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 243;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"standard\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 243;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryStandard')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 244;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"complex\"\u003E";
;pug_debug_line = 244;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryComplex')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 245;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 246;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 246;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('numRound')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 247;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"room-round\" type=\"number\" min=\"1\" max=\"10\" step=\"1\" value=\"5\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 248;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 249;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 249;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roundTime')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 250;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-time\"\u003E";
;pug_debug_line = 251;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"10\" style=\"color: #FF4444\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 252;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"30\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 253;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"60\""+pug_attr("selected", true, true, true)) + "\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 254;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"90\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 255;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"120\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 256;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"150\"\u003E\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 257;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 59px;\"\u003E";
;pug_debug_line = 258;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"height: 45px;\"\u003E";
;pug_debug_line = 258;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('misc')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 259;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
for(var i in locals.OPTIONS)
{
;pug_debug_line = 260;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GameOption"](i, 'room');
}
;pug_debug_line = 261;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"room-injpick-panel\"\u003E";
;pug_debug_line = 262;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-injeong-pick\" style=\"font-size: 11px;\"\u003E";
;pug_debug_line = 262;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pickInjeong')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 263;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 264;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-ok\"\u003E";
;pug_debug_line = 264;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RoomDiag', 300, 415);
;pug_debug_line = 265;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 266;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 266;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('explInjPick')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 267;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 268;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-all\"\u003E";
;pug_debug_line = 268;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injpickAll')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 269;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-no\"\u003E";
;pug_debug_line = 269;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injpickNo')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 270;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"injpick-list\" style=\"height: 280px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 271;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"ko-pick-list\" style=\"width: 100%;\"\u003E";
;pug_debug_line = 272;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
locals.KO_THEME.concat(locals.KO_INJEONG).forEach(function(item){
{
;pug_debug_line = 273;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var name = "ko-pick-" + item;
;pug_debug_line = 274;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
if(locals.IJP_EXCEPT.indexOf(item) != -1) return;
;pug_debug_line = 275;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv style=\"float: left; width: 100%;\"\u003E";
;pug_debug_line = 276;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("id", name, true, true)+" type=\"checkbox\" style=\"width: auto;\"") + "\u003E";
;pug_debug_line = 277;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", name, true, true)) + "\u003E";
;pug_debug_line = 277;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = LANG['theme_' + item]) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
}
;pug_debug_line = 278;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 279;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"en-pick-list\" style=\"width: 100%;\"\u003E";
;pug_debug_line = 280;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
locals.EN_THEME.concat(locals.EN_INJEONG).forEach(function(item){
{
;pug_debug_line = 281;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
var name = "en-pick-" + item;
;pug_debug_line = 282;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
if(locals.IJP_EXCEPT.indexOf(item) != -1) return;
;pug_debug_line = 283;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv style=\"float: left; width: 100%;\"\u003E";
;pug_debug_line = 284;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("id", name, true, true)+" type=\"checkbox\" style=\"width: auto;\"") + "\u003E";
;pug_debug_line = 285;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", name, true, true)) + "\u003E";
;pug_debug_line = 285;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = LANG['theme_' + item]) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
}
;pug_debug_line = 286;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 287;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 288;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-ok\"\u003E";
;pug_debug_line = 288;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'InjPickDiag', 200, 400, L('pickInjeong'));
;pug_debug_line = 289;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 290;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 291;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 291;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('selectLevel')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 292;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"robot-level\"\u003E";
;pug_debug_line = 293;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"0\"\u003E";
;pug_debug_line = 293;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel0')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 294;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"1\"\u003E";
;pug_debug_line = 294;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel1')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 295;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"2\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 295;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel2')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 296;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"3\"\u003E";
;pug_debug_line = 296;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel3')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 297;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"4\"\u003E";
;pug_debug_line = 297;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel4')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 298;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 299;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 299;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('team')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 300;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"robot-team\"\u003E";
;pug_debug_line = 301;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"0\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 301;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('teamSolo')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 302;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"1\"\u003E";
;pug_debug_line = 302;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "A\u003C\u002Foption\u003E";
;pug_debug_line = 303;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"2\"\u003E";
;pug_debug_line = 303;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "B\u003C\u002Foption\u003E";
;pug_debug_line = 304;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"3\"\u003E";
;pug_debug_line = 304;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "C\u003C\u002Foption\u003E";
;pug_debug_line = 305;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"4\"\u003E";
;pug_debug_line = 305;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "D\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 306;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 307;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"robot-ok\"\u003E";
;pug_debug_line = 307;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RobotDiag', 300, 135, L('robot'));
;pug_debug_line = 308;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 309;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-board\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 310;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me\"\u003E";
;pug_debug_line = 311;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-score\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 312;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-money\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 313;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level\"\u003E";
;pug_debug_line = 314;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level-head\"\u003E";
;pug_debug_line = 314;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LEVEL')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 315;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 316;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GraphBar"]('result-me-gauge');
;pug_debug_line = 317;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-score-text\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 318;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"expl result-me-expl\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 319;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 320;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"result-ok\"\u003E";
;pug_debug_line = 320;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 321;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"result-save\"\u003E";
;pug_debug_line = 321;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('saveReplay')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ResultDiag', 300, 420, L('gameResult'), true);
;pug_debug_line = 322;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 323;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 324;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 324;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('wpHere')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 325;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"dict-input\" style=\"width: 183px;\""+pug_attr("placeholder", L('wpInput'), true, true)+" maxlength=\"200\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 326;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"dict-output\" style=\"height: 195px; overflow-y: scroll; color: #BBBBBB; background-color: #111111;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 327;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 328;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"dict-theme\" style=\"width: 86px;\"\u003E";
;pug_debug_line = 329;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption value=\"\"\u003E";
;pug_debug_line = 329;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pickInjeong')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 330;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
locals.KO_INJEONG.forEach(function(item){
{
;pug_debug_line = 331;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Coption" + (pug_attr("value", item, true, true)) + "\u003E";
;pug_debug_line = 331;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('theme_' + item)) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
}
;pug_debug_line = 332;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fselect\u003E";
;pug_debug_line = 333;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dict-search\"\u003E";
;pug_debug_line = 333;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('SEARCH')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 334;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dict-injeong\"\u003E";
;pug_debug_line = 334;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injeongReq')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'DictionaryDiag', 300, 300, L('dict'));
;pug_debug_line = 335;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 336;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"invite-board\" style=\"height: 355px; overflow-y: scroll;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 337;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 338;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"invite-robot\"\u003E";
;pug_debug_line = 338;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('inviteRobot')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'InviteDiag', 300, 420, L('invite'));
;pug_debug_line = 339;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 340;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar room-info-head\"\u003E";
;pug_debug_line = 341;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 341;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roomTitle')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 342;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value ellipse\" id=\"ri-title\"\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 343;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 343;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 344;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-mode\"\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 345;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 345;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('rounds')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 346;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-round\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 347;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"padding: 2px 0px; border-top: 1px dashed #CCC; margin: 2px 0px;\"\u003E";
;pug_debug_line = 348;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 348;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('players')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 349;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-limit\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 350;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 190px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 351;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"ri-players\" style=\"width: 100%;\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 352;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 353;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-info-join\"\u003E";
;pug_debug_line = 353;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('join')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RoomInfoDiag', 300, 365);
;pug_debug_line = 354;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 355;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar profile-head\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 356;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 357;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 83px;\"\u003E";
;pug_debug_line = 357;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('place')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 358;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"profile-place\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 359;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar profile-record\" style=\"padding: 2px 0px; border-top: 1px dashed #CCCCCC; margin: 2px 0px; height: 175px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 360;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-record-field\" style=\"font-weight: bold; text-align: center;\"\u003E";
;pug_debug_line = 361;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-name\"\u003E";
;pug_debug_line = 361;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 362;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-record\"\u003E";
;pug_debug_line = 362;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('record')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 363;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-score\"\u003E";
;pug_debug_line = 363;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('recordScore')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 364;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"profile-record\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 365;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 366;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-whisper\"\u003E";
;pug_debug_line = 366;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('whisper')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 367;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-shut\"\u003E";
;pug_debug_line = 367;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('shut')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 368;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-kick\"\u003E";
;pug_debug_line = 368;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('kick')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 369;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-level\"\u003E";
;pug_debug_line = 369;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiSetting')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 370;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-dress\"\u003E";
;pug_debug_line = 370;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dress')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 371;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-handover\"\u003E";
;pug_debug_line = 371;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('handover')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ProfileDiag', 300, 360);
;pug_debug_line = 372;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 373;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"kick-vote-text\" style=\"text-align: center;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 374;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"text-align: center;\"\u003E";
;pug_debug_line = 374;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('kickVoteNotice')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 375;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 376;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GraphBar"]('kick-vote-time');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 377;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 378;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"kick-vote-no\"\u003E";
;pug_debug_line = 378;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('disagree')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 379;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"kick-vote-yes\"\u003E";
;pug_debug_line = 379;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('agree')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'KickVoteDiag', 300, 160, L('kickVote'));
;pug_debug_line = 380;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 381;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 382;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 382;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingBefore')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 383;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-before\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 384;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 385;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 385;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingCost')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 386;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-cost\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 387;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 388;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 388;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingAfter')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 389;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-after\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 390;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 391;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"purchase-item-name\" style=\"width: 100%; font-weight: bold;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 392;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 393;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"purchase-item-desc\" style=\"width: 100%;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 394;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 395;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"purchase-no\"\u003E";
;pug_debug_line = 395;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('NO')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 396;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"purchase-ok\"\u003E";
;pug_debug_line = 396;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'PurchaseDiag', 300, 205, L('purchase'));
;pug_debug_line = 397;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 398;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"replay-file\" type=\"file\" style=\"width: 288px;\" accept=\".kkt\"\u003E";
;pug_debug_line = 399;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 400;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 400;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayDate')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 401;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"replay-date\"\u003E";
;pug_debug_line = 401;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "-\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 402;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 403;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 403;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayPlayers')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 404;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"replay-players\"\u003E";
;pug_debug_line = 404;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "-\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 405;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 406;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"replay-view\"\u003E";
;pug_debug_line = 406;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayView')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ReplayDiag', 300, 300, L('replay'));
;pug_debug_line = 407;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 408;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"chat-log-board\" style=\"height: 475px; font-size: 11px; overflow-y: scroll;\"\u003E\u003C\u002Fdiv\u003E";
}
}, 'ChatLogDiag', 300, 500, L('chatLog'));
;pug_debug_line = 409;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 410;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 411;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%;\"\u003E";
;pug_debug_line = 411;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('obtained') + '!') ? "" : pug_interp)) + "\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 412;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jt-image\" id=\"obtain-image\" style=\"margin-left: 110px; width: 80px; height: 80px;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 413;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"obtain-name\" style=\"text-align: center;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 414;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 415;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"obtain-ok\"\u003E";
;pug_debug_line = 415;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ObtainDiag', 300, 200, L('notice'), true);
;pug_debug_line = 416;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 417;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Ciframe id=\"help-board\" width=\"300\" height=\"375\"\u003E\u003C\u002Fiframe\u003E";
}
}, 'HelpDiag', 300, 400, L('helpText'));
;pug_debug_line = 418;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 419;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 419;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "불러오는 중\u003C\u002Fdiv\u003E";
}
}, 'UserList');
;pug_debug_line = 420;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 421;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 421;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "불러오는 중\u003C\u002Fdiv\u003E";
}
}, 'RoomList');
;pug_debug_line = 422;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 423;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 423;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "불러오는 중\u003C\u002Fdiv\u003E";
}
}, 'Shop');
;pug_debug_line = 424;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 425;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-selector\"\u003E";
;pug_debug_line = 426;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-0\" id=\"team-0\"\u003E";
;pug_debug_line = 426;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('teamSolo')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 427;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-1\" id=\"team-1\"\u003E";
;pug_debug_line = 427;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "A\u003C\u002Fdiv\u003E";
;pug_debug_line = 428;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-2\" id=\"team-2\"\u003E";
;pug_debug_line = 428;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "B\u003C\u002Fdiv\u003E";
;pug_debug_line = 429;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-3\" id=\"team-3\"\u003E";
;pug_debug_line = 429;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "C\u003C\u002Fdiv\u003E";
;pug_debug_line = 430;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-4\" id=\"team-4\"\u003E";
;pug_debug_line = 430;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "D\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 431;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"room-users\"\u003E\u003C\u002Fdiv\u003E";
}
}, 'Room');
;pug_debug_line = 432;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 433;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-head\"\u003E";
;pug_debug_line = 434;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"b-left bb\" style=\"display: none;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 435;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"b-left cwcmd\" style=\"display: none;\"\u003E";
;pug_debug_line = 436;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"cw-q-head\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 437;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"cw-q-input\""+pug_attr("placeholder", L('inputHere'), true, true)+" style=\"width: 313px; height: 20px; font-size: 15px;\"") + "\u003E";
;pug_debug_line = 438;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"cw-q-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 439;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjoriping\"\u003E";
;pug_debug_line = 440;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoEyeL\" src=\"\u002Fimg\u002FjjoeyeL.png\"\u003E";
;pug_debug_line = 441;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoNose\" src=\"\u002Fimg\u002Fjjonose.png\"\u003E";
;pug_debug_line = 442;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoEyeR\" src=\"\u002Fimg\u002FjjoeyeR.png\"\u003E";
;pug_debug_line = 443;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjoDisplayBar\"\u003E";
;pug_debug_line = 444;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjo-display\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 445;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GraphBar"]('jjo-turn-time');
;pug_debug_line = 446;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["GraphBar"]('jjo-round-time');
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 447;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"word-meaning-panel is-empty\" id=\"WordMeaning\" aria-live=\"polite\"\u003E";
;pug_debug_line = 448;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"word-meaning-label\"\u003E";
;pug_debug_line = 448;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "낱말 뜻\u003C\u002Fspan\u003E";
;pug_debug_line = 449;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cstrong class=\"word-meaning-word\"\u003E";
;pug_debug_line = 449;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "-\u003C\u002Fstrong\u003E";
;pug_debug_line = 450;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"word-meaning-definition\"\u003E";
;pug_debug_line = 450;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "낱말을 입력하면 뜻이 표시됩니다.\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 451;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"items\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 452;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"hints\" style=\"display: none;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 453;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"chain\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 454;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"rounds\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 455;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"history-holder\"\u003E";
;pug_debug_line = 456;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"history\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 457;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-body\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 458;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-input\"\u003E";
;pug_debug_line = 459;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"game-input\""+pug_attr("placeholder", L('yourTurn')+' '+L('inputHere'), true, true)+" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" inputmode=\"text\" aria-autocomplete=\"none\"") + "\u003E\u003C\u002Fdiv\u003E";
}
}, 'Game');
;pug_debug_line = 460;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 461;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Chat\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 462;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"Talk\" maxlength=\"200\"\u003E";
;pug_debug_line = 463;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"ChatBtn\"\u003E";
;pug_debug_line = 463;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('send')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
}
}, 'Chat');
;pug_debug_line = 464;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"ad\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 66;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Bottom\"\u003E";
;pug_debug_line = 67;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
;pug_debug_line = 467;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"facebook-menu\"\u003E";
;pug_debug_line = 468;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"fb-like\" data-href=\"http:\u002F\u002Fjjo.kr\u002Fkkutu\" data-width=\"300\" data-layout=\"button_count\" data-action=\"like\" data-show-faces=\"true\" data-share=\"true\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 469;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 469;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('dictionarySupport')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 470;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 470;pug_debug_filename = "Server\u002Flib\u002FWeb\u002Fviews\u002Fm_kkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('etcSupport')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 68;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 69;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Ca href=\"?pc=true\"\u003E";
;pug_debug_line = 69;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('AS_PC')) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
;pug_debug_line = 70;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cbr\u003E";
;pug_debug_line = 71;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Ca class=\"bottom-contact\" href=\"http:\u002F\u002Fblog.jjo.kr\u002F\" target=\"_blank\"\u003E";
;pug_debug_line = 71;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('CREATOR')) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
;pug_debug_line = 72;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Ca class=\"bottom-contact\" href=\"mailto:op@jjo.kr\" target=\"_blank\"\u003E";
;pug_debug_line = 72;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "Contact op@jjo.kr\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 73;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 73;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_html = pug_html + (null == (pug_interp = L('GPL')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 74;pug_debug_filename = "Server\\lib\\Web\\views\\m_layout.pug";
pug_mixins["separator"](40);
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";}.call(this,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined,"JSON" in locals_for_with?locals_for_with.JSON:typeof JSON!=="undefined"?JSON:undefined,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"Number" in locals_for_with?locals_for_with.Number:typeof Number!=="undefined"?Number:undefined,"RegExp" in locals_for_with?locals_for_with.RegExp:typeof RegExp!=="undefined"?RegExp:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}