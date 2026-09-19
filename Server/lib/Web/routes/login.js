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
		req.session.migrationNotice = migration ? (migration.retained ? '운영자 계정이 소셜 계정과 연결되었습니다. 기존 계정은 유지됩니다.' : '계정 이전이 완료되었습니다. 게임 닉네임과 게임 데이터도 함께 이전되었습니다.') : '';
        MainDB.session.upsert([ '_id', req.session.id ]).set({
            'profile': $p,
            'createdAt': now
        }).on();
        MainDB.users.findOne([ '_id', $p.id ]).on(($body) => {
            req.session.profile = $p;
			// Every new social account must choose its in-game nickname. Existing
			// players and migrated local accounts keep their saved title.
			req.session.needsNicknameSetup = !$body && !migratedNickname && !nickname;
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
			Server.get('/login/' + auth.config.vendor, passport.authenticate(auth.config.vendor))
			Server.get('/login/' + auth.config.vendor + '/callback', passport.authenticate(auth.config.vendor, {
				successRedirect: '/',
				failureRedirect: '/loginfail'
			}))
			passport.use(new auth.config.strategy(auth.strategyConfig, auth.strategy(process, MainDB /*, Ajae */)));
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
