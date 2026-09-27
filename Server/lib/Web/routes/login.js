/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const MainDB	 = require("../db");
const JLog	 = require("../../sub/jjlog");
// const Ajae	 = require("../../sub/ajaejs").checkAjae;
const passport = require('passport');
const glob = require('glob-promise');
const GLOBAL	 = require("../../sub/global.json");
const config = require('../../sub/auth.json');
const path = require('path')
const LocalAuth = require('../local-auth');

function process(req, accessToken, MainDB, $p, done) {
    delete $p.token;
    var linkLocalUserId=req.session.linkLocalUserId;
    var linkProvider=req.session.linkProvider;
    var nativeLogin=req.session.nativeLogin===true;
    var finish = function(){
      if(linkLocalUserId && linkProvider !== $p.authType) throw new Error('선택한 소셜 계정으로 다시 로그인해 주세요.');
      var linked=linkLocalUserId?LocalAuth.migrateLocalToDiscord(linkLocalUserId,$p.id,$p.title):Promise.resolve(null);
      linked.then(function(migration){ if(linkLocalUserId&&!migration)throw new Error('이전할 기존 계정을 찾을 수 없습니다.'); var migratedNickname=migration&&migration.nickname; return LocalAuth.getNicknameOverride($p.id).then(function(nickname){
        nickname=migratedNickname||nickname;
        if(nickname){ $p.title = nickname; $p.name = nickname; }
		if(migration&&migration.retained){ $p.id=migration.userId; $p.authType='local-linked'; $p.developer=true; }
        let now = Date.now();
        $p.sid = req.session.id;
        req.session.admin = GLOBAL.ADMIN.includes($p.id);
        req.session.authType = $p.authType;
		req.session.nativeLogin = nativeLogin;
		req.session.migrationNotice = migration ? (migration.retained ? '운영자 계정이 소셜 계정과 연결되었습니다. 기존 계정은 유지됩니다.' : '계정 이전이 완료되었습니다. 게임 닉네임과 게임 데이터도 함께 이전되었습니다.') : '';
        MainDB.session.upsert([ '_id', req.session.id ]).set({
            'profile': $p,
            'createdAt': now
        }).on();
        MainDB.users.findOne([ '_id', $p.id ]).on(($body) => {
            req.session.profile = $p;
			// Every new social account must choose its in-game nickname. Existing
			// players and migrated local accounts keep their saved title.
			req.session.needsNicknameSetup = !migratedNickname && !nickname;
            MainDB.users.update([ '_id', $p.id ]).set([ 'lastLogin', now ]).on();
			req.session.save(function(saveError){ done(saveError || null, $p); });
        });
      });
    }).catch(function(error){
        JLog.warn('Nickname override lookup failed: ' + (error.code || error.message));
        done(error);
    }); };
    req.session.regenerate(function(error){ if(error)return done(error); finish(); });
}

exports.run = (Server, page) => {
    //passport configure
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

	const strategyList = {};
	Server.get('/account/link-social/:provider', function(req,res){
		var provider=req.params.provider;
		if(['discord','google','kakao'].indexOf(provider)===-1)return res.redirect('/?account=login');
		if(!req.session.profile||req.session.profile.authType!=='local')return res.redirect('/?account=login');
		req.session.linkLocalUserId=req.session.profile.id;
		req.session.linkProvider=provider;
		req.session.save(function(error){if(error)return res.redirect('/?link-error=1');res.redirect('/login/'+provider);});
	});
	Server.get('/account/link-discord', function(req,res){res.redirect('/account/link-social/discord');});
    
	for (let i in config) {
		try {
			let auth = require(path.resolve(__dirname, '..', 'auth', 'auth_' + i + '.js'))
			var loginOptions = auth.config.vendor === 'kakao' ? { prompt: 'login' } : {};
			Server.get('/login/' + auth.config.vendor, passport.authenticate(auth.config.vendor, loginOptions))
			Server.get('/login/' + auth.config.vendor + '/callback', passport.authenticate(auth.config.vendor, {
				successRedirect: '/native/complete',
				failureRedirect: '/loginfail'
			}))
			var strategy = new auth.config.strategy(auth.strategyConfig, auth.strategy(process, MainDB /*, Ajae */));
			// passport-kakao does not forward arbitrary authenticate options by
			// default.  Add Kakao's prompt parameter so pressing Kakao login again
			// always starts a fresh authentication instead of silently reusing the
			// provider's previous account state.
			if(auth.config.vendor === 'kakao'){
				strategy.authorizationParams = function(options){
					return { prompt: (options && options.prompt) || 'login' };
				};
			}
			passport.use(strategy);
			strategyList[auth.config.vendor] = {
				vendor: auth.config.vendor,
				displayName: auth.config.displayName,
				color: auth.config.color,
				fontColor: auth.config.fontColor
			};

			JLog.info(`OAuth Strategy ${i} loaded successfully.`)
		} catch (error) {
			JLog.error(`OAuth Strategy ${i} is not loaded`)
			JLog.error(error.message)
		}
	}

	Server.get('/native/login', function(req,res){
		req.session.nativeLogin=true;
		req.session.save(function(error){if(error)return res.status(503).send('로그인 준비에 실패했습니다.');res.redirect(req.session.profile?'/native/complete':'/login?account=login&native=1');});
	});
	Server.get('/native/complete', function(req,res){
		if(!req.session.profile){
			if(req.session.nativeLogin)return res.redirect('/login?account=login&native=1');
			return res.redirect('/');
		}
		if(!req.session.nativeLogin)return res.redirect('/');
		if(req.session.needsNicknameSetup)return res.redirect('/login?account=login&native=1');
		LocalAuth.issueNativeLogin(req.session.profile).then(function(code){
			req.session.nativeLogin=false;req.session.save(function(){});
			var uri='kkutugame://login?code='+encodeURIComponent(code);
			res.set('Cache-Control','no-store').type('html').send('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Windows 앱 연결</title><style>body{font-family:system-ui,sans-serif;background:#f5fbf2;display:grid;place-items:center;min-height:100vh;margin:0;color:#203528}.card{background:#fff;padding:42px;border-radius:24px;box-shadow:0 18px 55px #2343;max-width:460px;text-align:center}.button{display:inline-block;background:#50b45f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:16px;font-weight:700}.sub{display:block;margin-top:16px;color:#4d7658;font-size:14px}</style><div class="card"><h1>Windows 앱을 여는 중입니다</h1><p>앱이 설치되어 있으면 로그인 정보를 연결한 뒤 앱 메인으로 이동합니다.<br>앱이 열리지 않으면 설치 파일을 자동으로 내려받습니다.</p><a class="button" href="'+uri+'">끄투게임즈코리아 앱 열기</a><a class="sub" href="/downloads/kkutugameskorea-setup-1.0.0.exe">설치 파일 직접 다운로드</a></div><script>(function(){var opened=false;function mark(){opened=true}window.addEventListener("blur",mark);window.addEventListener("pagehide",mark);document.addEventListener("visibilitychange",function(){if(document.hidden)mark()});location.href='+JSON.stringify(uri)+';setTimeout(function(){if(opened){location.replace("/");return}var a=document.createElement("a");a.href="/downloads/kkutugameskorea-setup-1.0.0.exe";a.download="kkutugameskorea-setup-1.0.0.exe";document.body.appendChild(a);a.click();setTimeout(function(){location.replace("/")},1200)},5000)})()</script>');
		}).catch(function(error){JLog.error('[NATIVE LOGIN] code issue failed: '+(error&&error.stack||error));res.status(503).send('앱 연결 코드를 만들지 못했습니다.');});
	});
	Server.post('/native/exchange', function(req,res){
		res.set('Cache-Control','no-store');
		LocalAuth.redeemNativeLogin(req.body&&req.body.code).then(function(profile){
			if(!profile)return res.status(401).json({error:'로그인 코드가 만료되었거나 이미 사용되었습니다.'});
			req.session.regenerate(function(error){if(error)return res.status(503).json({error:'세션을 만들지 못했습니다.'});
				profile.sid=req.session.id;req.session.profile=profile;req.session.authType=profile.authType;
				MainDB.session.upsert(['_id',req.session.id]).set({'profile':profile,'createdAt':Date.now()}).on(function(){
					req.session.save(function(saveError){if(saveError)return res.status(503).json({error:'세션을 저장하지 못했습니다.'});res.json({ok:true,user:{id:profile.id,nickname:profile.title||profile.name||profile.id}});});
				});
			});
		}).catch(function(){res.status(503).json({error:'로그인 연결에 실패했습니다.'});});
	});
	
	Server.get("/login", (req, res) => {
		if(global.isPublic){
			page(req, res, "login", { '_id': req.session.id, 'text': req.query.desc, 'loginList': strategyList});
		}else{
			let now = Date.now();
			let id = req.query.id || "ADMIN";
			let lp = {
				id: id,
				title: "LOCAL #" + id,
				birth: [ 4, 16, 0 ],
				_age: { min: 20, max: undefined }
			};
			MainDB.session.upsert([ '_id', req.session.id ]).set([ 'profile', JSON.stringify(lp) ], [ 'createdAt', now ]).on(function($res){
				MainDB.users.update([ '_id', id ]).set([ 'lastLogin', now ]).on();
				req.session.admin = true;
				req.session.profile = lp;
				res.redirect("/");
			});
		}
	});

	Server.get("/logout", (req, res) => {
		if(!req.session.profile){
			return res.redirect("/");
		} else {
			const finish = () => res.clearCookie('connect.sid').redirect('/');
			if (typeof req.logout === 'function' && req._passport) {
				return req.logout(function(){ req.session.destroy(finish); });
			}
			req.session.destroy(finish);
		}
	});

	Server.get("/loginfail", (req, res) => {
		page(req, res, "loginfail");
	});
}
