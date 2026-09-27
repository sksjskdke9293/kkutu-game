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

var GLOBAL	 = require("./global.json");
var JLog	 = require("./jjlog");
function loadLanguage(locale){
	var base = require("../Web/lang/" + locale + ".json");
	if(locale !== 'en_US') return base;
	var overrides = require("../Web/lang/en_US.overrides.json");
	base.GLOBAL = Object.assign({}, base.GLOBAL, overrides.GLOBAL || {});
	base.kkutu = Object.assign({}, base.kkutu, overrides.kkutu || {});
	return base;
}
var Language = {
	'ko_KR': loadLanguage('ko_KR'),
	'en_US': loadLanguage('en_US'),
	'zh_CN': loadLanguage('zh_CN'),
	'ko_KP': loadLanguage('ko_KP')
};

function updateLanguage(){
	var i, src;
	
	for(i in Language){
		src = `../Web/lang/${i}.json`;
		
		delete require.cache[require.resolve(src)];
		Language[i] = loadLanguage(i);
	}
}
function getLanguage(locale, page, shop){
	var i;
	var L = Language[locale] || {};
	var R = {};
	
	for(i in L.GLOBAL) R[i] = L.GLOBAL[i];
	if(shop) for(i in L.SHOP) R[i] = L.SHOP[i];
	for(i in L[page]) R[i] = L[page][i];
	if(R['title']) R['title'] = `[${process.env['KKT_SV_NAME']}] ${R['title']}`;
	
	return R;
}
function page(req, res, file, data){
	if(data == undefined)	data = {};
	if(req.session.createdAt){
		if(new Date() - req.session.createdAt > 3600000){
			delete req.session.profile;
		}
	}else{
		req.session.createdAt = new Date();
	}
	var addr = req.ip || "";
	var sid = req.session.id || "";
	
	data.published = global.isPublic;
	var cookieLocale = String((req.headers && req.headers.cookie) || "").split(';').reduce(function(found, item){
		var pair = item.trim().split('=');
		if(found || pair.shift() !== 'lc') return found;
		try{ return decodeURIComponent(pair.join('=')); }catch(error){ return ''; }
	}, '');
	data.lang = req.query.locale || cookieLocale || "ko_KR";
	if(!Language[data.lang]) data.lang = "ko_KR";
	// URL ...?locale=en_US will show the page in English
	
	// if(exports.STATIC) data.static = exports.STATIC[data.lang];
	data.season = GLOBAL.SEASON;
	data.season_pre = GLOBAL.SEASON_PRE;
	
	data.locale = getLanguage(data.lang, data._page || file.split('_')[0], data._shop);
	data.session = req.session;
	if((/mobile/i).test(req.get('user-agent')) || req.query.mob){
		data.mobile = true;
		if(req.query.pc){
			data.as_pc = true;
			data.page = file;
		}else if(exports.MOBILE_AVAILABLE && exports.MOBILE_AVAILABLE.includes(file)){
			data.page = 'm_' + file;
		}else{
			data.mobile = false;
			data.page = file;
		}
	}else{
		data.page = file;
	}
	
	JLog.log(`${addr.slice(7)}@${sid.slice(0, 10)} ${data.page}, ${JSON.stringify(req.params)}`);
	res.render(data.page, data, function(err, html){
		if(err) res.send(err.toString());
		else res.send(html);
	});
}
exports.init = function(Server, shop){
	Server.get("/language/:page/:lang", function(req, res){
		var page = req.params.page.replace(/_/g, "/");
		var lang = req.params.lang;
		
		if(page.substr(0, 2) == "m/") page = page.slice(2);
		if(page == "portal") page = "kkutu";
		res.type("application/javascript").set("Cache-Control", "no-cache").send("window.L = "+JSON.stringify(getLanguage(lang, page, shop))+";");
	});
	Server.get("/language/flush", function(req, res){
		updateLanguage();
		res.sendStatus(200);
	});
};
exports.page = page;
