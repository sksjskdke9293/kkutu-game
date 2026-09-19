function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}
function pug_style(r){if(!r)return"";if("object"==typeof r){var t="";for(var e in r)pug_has_own_property.call(r,e)&&(t=t+e+":"+r[e]+";");return t}return r+""}function kkutuTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (ADMIN, Date, JSON, Math, Number, RegExp, i, j) {;pug_debug_line = 19;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"] = pug_interp = function(id, w, h, t, nocls){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 20;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog\""+pug_attr("id", id, true, false)+pug_attr("style", pug_style(`width: ${w}px; height: ${h}px;`), true, false)) + "\u003E";
;pug_debug_line = 21;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes([nocls ? 'no-close dialog-head' : 'dialog-head'], [true]), false, false)) + "\u003E";
;pug_debug_line = 22;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog-title\""+pug_attr("style", pug_style(`width: ${w - 20}px;`), true, false)) + "\u003E";
;pug_debug_line = 22;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = t || '') ? "" : pug_interp) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 23;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-body\" style=\"font-size: 13px;\"\u003E";
;pug_debug_line = 24;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
block && block();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 26;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GameOption"] = pug_interp = function(key, prefix){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 27;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var name = locals.OPTIONS[key].name;
;pug_debug_line = 28;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var sid = name.toLowerCase();
;pug_debug_line = 29;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"dialog-opt\""+pug_attr("id", `${prefix}-${sid}-panel`, true, false)) + "\u003E";
;pug_debug_line = 30;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" class=\"game-option\""+pug_attr("id", `${prefix}-${sid}`, true, false)+" type=\"checkbox\" style=\"margin-top: 5px; width: auto;\"") + "\u002F\u003E";
;pug_debug_line = 31;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", `${prefix}-${sid}`, true, false)) + "\u003E";
;pug_debug_line = 31;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = name === 'Injeong' ? '어인정 모드' : L(`opt${name}`)) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E";
;pug_debug_line = 32;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Expl"].call({
block: function(){
;pug_debug_line = 33;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 33;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = name === 'Injeong' ? '어인정 낱말을 사용할 수 있습니다.' : L(`expl${name}`)) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
}, true);
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 35;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";











;pug_debug_line = 20;pug_debug_filename = "Web\\views\\module.pug";
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

;pug_debug_line = 59;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["Menu"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 60;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"Menu\"\u003E";
;pug_debug_line = 61;pug_debug_filename = "Web\\views\\module.pug";
for(i in MENU)
{
;pug_debug_line = 62;pug_debug_filename = "Web\\views\\module.pug";
if(MENU[i].href)
{
;pug_debug_line = 63;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cbutton" + (" class=\"menu-btn\""+pug_attr("id", 'menu-item-'+MENU[i].key, true, false)+pug_attr("onclick", 'location.href = "'+MENU[i].href+'";', true, false)) + "\u003E";
;pug_debug_line = 63;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L(MENU[i].key)) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
}
else if(MENU[i].sub)
{
;pug_debug_line = 65;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"menu-btn\""+pug_attr("id", 'menu-item-'+MENU[i].key, true, false)) + "\u003E";
;pug_debug_line = 65;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L(MENU[i].key)) ? "" : pug_interp);
;pug_debug_line = 66;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"menu-sub-separator\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 67;pug_debug_filename = "Web\\views\\module.pug";
for(j in MENU[i].sub)
{
;pug_debug_line = 68;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"menu-sub-btn\""+pug_attr("onclick", 'location.href = "'+MENU[i].sub[j].href+'";', true, false)) + "\u003E";
;pug_debug_line = 68;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L(MENU[i].sub[j].key)) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
}
}
;pug_debug_line = 69;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"quick-search\"\u003E";
;pug_debug_line = 70;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"quick-search-tf\""+pug_attr("placeholder", L('QUICK_HOLDER'), true, false)) + "\u002F\u003E";
;pug_debug_line = 71;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cbutton id=\"quick-search-btn\"\u003E";
;pug_debug_line = 71;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L('QUICK_BTN')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 72;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"account\"\u003E";
;pug_debug_line = 73;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cspan id=\"profile\"\u003E";
;pug_debug_line = 73;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = SESSION.profile ? JSON.stringify(SESSION.profile) : '{}') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 74;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv id=\"account-info\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 76;pug_debug_filename = "Web\\views\\module.pug";







































;pug_debug_line = 91;pug_debug_filename = "Web\\views\\module.pug";











;pug_debug_line = 96;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["FA"] = pug_interp = function(id){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 97;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Ci" + (pug_attr("class", pug_classes(["fa fa-"+id], [true]), false, false)) + "\u003E\u003C\u002Fi\u003E";
};
;pug_debug_line = 99;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["separator"] = pug_interp = function(len){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 100;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("style", pug_style("float: left; width: 100%; margin: "+len+"px 0px;"), true, false)) + "\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 102;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["PageHead"] = pug_interp = function(min){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 103;pug_debug_filename = "Web\\views\\module.pug";
if (!min) {
;pug_debug_line = 104;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink" + (" rel=\"stylesheet\""+pug_attr("href", (locals.mobile && !locals.as_pc && locals.page !== 'kkutu') ? '/css/m_style.css' : '/css/style.css', true, false)) + "\u002F\u003E";
;pug_debug_line = 105;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Ffa.css\"\u002F\u003E";
;pug_debug_line = 106;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fexpl.css\"\u002F\u003E";
}
;pug_debug_line = 107;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fjquery.js\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 108;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript" + (" type=\"text\u002Fjavascript\""+pug_attr("src", '/language/'+locals.page.replace("/", "_")+'/'+locals.lang+'?v=20260913-mime-1', true, false)) + "\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 110;pug_debug_filename = "Web\\views\\module.pug";
if (PUBLIC && !SESSION.admin) {
;pug_debug_line = 111;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003C!--script(type='text\u002Fjavascript', src='\u002Fjs\u002Fgoogle.js')--\u003E";
}
;pug_debug_line = 112;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fglobal.min.js?v=20260912-language-fix-1\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 113;pug_debug_filename = "Web\\views\\module.pug";
if (!min) {
;pug_debug_line = 114;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003C!--script(type='text\u002Fjavascript', src='\u002Fjs\u002Ffacebook.js')--\u003E";
}
;pug_debug_line = 115;pug_debug_filename = "Web\\views\\module.pug";
if (block) {
;pug_debug_line = 116;pug_debug_filename = "Web\\views\\module.pug";
block && block();
}
;pug_debug_line = 117;pug_debug_filename = "Web\\views\\module.pug";
var pageAsset = locals.page.replace("/", "_");
;pug_debug_line = 118;pug_debug_filename = "Web\\views\\module.pug";
var assetVersion = (pageAsset === 'portal' || pageAsset === 'm_portal') ? '?v=20260913-server-maintenance-1' : '';
;pug_debug_line = 119;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Clink" + (" rel=\"stylesheet\""+pug_attr("href", '/css/in_'+pageAsset+'.css'+assetVersion, true, false)) + "\u002F\u003E";
;pug_debug_line = 120;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- The KKuTu game pages load their combined client bundle in the page view.--\u003E";
;pug_debug_line = 121;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- There is no standalone in_kkutu\u002Fminified asset, so avoid a permanent 404--\u003E";
;pug_debug_line = 122;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003C!-- that can interrupt first-load UI initialization in some browsers.--\u003E";
;pug_debug_line = 123;pug_debug_filename = "Web\\views\\module.pug";
if (pageAsset !== 'kkutu' && pageAsset !== 'm_kkutu') {
;pug_debug_line = 124;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cscript" + (" type=\"text\u002Fjavascript\""+pug_attr("src", '/js/in_'+pageAsset+'.min.js'+assetVersion, true, false)) + "\u003E\u003C\u002Fscript\u003E";
}
};
;pug_debug_line = 126;pug_debug_filename = "Web\\views\\module.pug";







;pug_debug_line = 130;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["Expl"] = pug_interp = function(text, width){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 131;pug_debug_filename = "Web\\views\\module.pug";
if(text == undefined) return;
;pug_debug_line = 132;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"expl\""+pug_attr("style", pug_style('width: '+(width ? (width + 'px') : 'initial')), true, false)) + "\u003E";
;pug_debug_line = 133;pug_debug_filename = "Web\\views\\module.pug";
if (block) {
;pug_debug_line = 134;pug_debug_filename = "Web\\views\\module.pug";
block && block();
}
else {
;pug_debug_line = 136;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 136;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 138;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["Product"] = pug_interp = function(id){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 139;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes([id+'Box Product'], [true]), false, false)) + "\u003E";
;pug_debug_line = 140;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch5 class=\"product-title\"\u003E";
;pug_debug_line = 140;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (null == (pug_interp = L(id)) ? "" : pug_interp) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 141;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv class=\"product-body\"\u003E";
;pug_debug_line = 142;pug_debug_filename = "Web\\views\\module.pug";
if (block) {
;pug_debug_line = 143;pug_debug_filename = "Web\\views\\module.pug";
block && block();
}
else {
;pug_debug_line = 145;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 145;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = id) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 147;pug_debug_filename = "Web\\views\\module.pug";
pug_mixins["GraphBar"] = pug_interp = function(c, min, val, max, bgc){
var block = (this && this.block), attributes = (this && this.attributes) || {};
;pug_debug_line = 148;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes(['graph '+c], [true]), false, false)) + "\u003E";
;pug_debug_line = 149;pug_debug_filename = "Web\\views\\module.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"graph-bar\""+pug_attr("style", pug_style('width: '+((val-min) / (max-min) * 100)+'%;'+(bgc ? (' background-color: '+bgc+';') : '')), true, false)) + "\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
;pug_debug_line = 151;pug_debug_filename = "Web\\views\\module.pug";























;pug_debug_line = 19;pug_debug_filename = "Web\\views\\layout.pug";
if(LANG == undefined) LANG = locals.locale;
;pug_debug_line = 21;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003C!DOCTYPE html\u003E";
;pug_debug_line = 22;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Chtml\u003E";
;pug_debug_line = 23;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Chead\u003E";
;pug_debug_line = 24;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 41;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ctitle\u003E";
;pug_debug_line = 41;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Ftitle\u003E";
;pug_debug_line = 25;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta charset=\"utf-8\"\u003E";
;pug_debug_line = 26;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\"\u003E";
;pug_debug_line = 27;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink rel=\"icon\" type=\"image\u002Fx-icon\" href=\"\u002Ffavicon.ico?v=20260913-1\"\u003E";
;pug_debug_line = 28;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink rel=\"shortcut icon\" href=\"\u002Ffavicon.ico?v=20260913-1\"\u003E";
;pug_debug_line = 29;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink rel=\"apple-touch-icon\" href=\"\u002Fimg\u002Fcustom\u002Fsite-favicon.png?v=20260912\"\u003E";
;pug_debug_line = 30;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta name=\"application-name\" content=\"끄투게임\"\u003E";
;pug_debug_line = 31;pug_debug_filename = "Web\\views\\layout.pug";
if (locals.canonical) {
;pug_debug_line = 32;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink" + (" rel=\"canonical\""+pug_attr("href", locals.canonical, true, true)) + "\u003E";
}
;pug_debug_line = 33;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\"\u003E";
;pug_debug_line = 34;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "function getObject(v, i) {";
;pug_debug_line = 35;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 35;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\tObject.defineProperty(v, i, {value: v[i], writable: false});";
;pug_debug_line = 36;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 36;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "}";
;pug_debug_line = 37;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 37;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "getObject(window.WebSocket, \"send\");";
;pug_debug_line = 38;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 38;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "getObject(window.WebSocket, \"onmessage\");";
;pug_debug_line = 39;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 39;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "getObject(window, \"WebSocket\");";
;pug_debug_line = 40;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 40;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003C\u002Fscript\u003E";
;pug_debug_line = 41;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 42;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"description\""+pug_attr("content", LANG['meta_desc'] || L('META_DESC'), true, true)) + "\u003E";
;pug_debug_line = 43;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"keywords\""+pug_attr("content", LANG['meta_keys'] || L('META_KEYS'), true, true)) + "\u003E";
;pug_debug_line = 45;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 46;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" property=\"og:image\""+pug_attr("content", locals.ogImage || "http://JJo.kr/img/ogImage.png", true, true)) + "\u003E";
;pug_debug_line = 47;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" property=\"og:url\""+pug_attr("content", locals.ogURL || "http://JJo.kr/", true, true)) + "\u003E";
;pug_debug_line = 48;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" property=\"og:title\""+pug_attr("content", locals.ogTitle || "쪼롤 - League of Legends 정보 검색 사이트", true, true)) + "\u003E";
;pug_debug_line = 49;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" property=\"og:description\""+pug_attr("content", locals.ogDescription || "롤 전적검색은 JJO.KR", true, true)) + "\u003E";
;pug_debug_line = 50;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:site_name\" content=\"끄투게임\"\u003E";
;pug_debug_line = 51;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta property=\"og:type\" content=\"website\"\u003E";
;pug_debug_line = 52;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta name=\"twitter:card\" content=\"summary_large_image\"\u003E";
;pug_debug_line = 53;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"twitter:title\""+pug_attr("content", locals.ogTitle || '끄투게임', true, true)) + "\u003E";
;pug_debug_line = 54;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cmeta" + (" name=\"twitter:image\""+pug_attr("content", locals.ogImage || 'https://kkutugame.kro.kr/img/custom/site-logo.png?v=20260912', true, true)) + "\u003E";
;pug_debug_line = 55;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript type=\"application\u002Fld+json\"\u003E";
;pug_debug_line = 56;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "{\"@context\":\"https:\u002F\u002Fschema.org\",\"@type\":\"WebSite\",\"name\":\"끄투게임\",\"alternateName\":\"끄투게임\",\"url\":\"https:\u002F\u002Fkkutugame.kro.kr\u002F\"}\u003C\u002Fscript\u003E";
;pug_debug_line = 57;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\"\u003E";
;pug_debug_line = 58;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "try{var themeRequest=new XMLHttpRequest();var themeServer=(new URLSearchParams(location.search)).get('server');themeRequest.open('GET','\u002Fapi\u002Ftheme'+(themeServer!==null?'?server='+encodeURIComponent(themeServer):''),false);themeRequest.send(null);var initialTheme=JSON.parse(themeRequest.responseText||'{}').theme;document.documentElement.setAttribute('data-site-theme',initialTheme==='chuseok'?'chuseok':'autumn');}catch(themeError){document.documentElement.setAttribute('data-site-theme','autumn');}";
;pug_debug_line = 59;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 59;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003C\u002Fscript\u003E";
;pug_debug_line = 60;pug_debug_filename = "Web\\views\\layout.pug";
pug_mixins["PageHead"].call({
block: function(){
;pug_debug_line = 61;pug_debug_filename = "Web\\views\\layout.pug";
}
});
;pug_debug_line = 62;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 48;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fin_game_kkutu_shop.css?v=20260914-inventory-layout-5\"\u003E";
;pug_debug_line = 49;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fplay-shell.css?v=20260906-ui-audit-4\"\u003E";
;pug_debug_line = 50;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fgame-ui-audit.css?v=20260917-yut-admin-roll-1\"\u003E";
;pug_debug_line = 51;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fsettings-ui.css?v=20260910-lobby-music-1\"\u003E";
;pug_debug_line = 52;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fautumn-theme.css?v=20260913-15\"\u003E";
;pug_debug_line = 63;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 44;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cscript type=\"text\u002Fjavascript\" src=\"\u002Fjs\u002Fin_game_kkutu.min.js?v=20260917-yut-admin-roll-1\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 45;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cscript src=\"https:\u002F\u002Fwww.google.com\u002Frecaptcha\u002Fapi.js\"\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 64;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Faccount-ui.css?v=20260914-user-badge-3\"\u003E";
;pug_debug_line = 65;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Clink rel=\"stylesheet\" href=\"\u002Fcss\u002Fsite-theme.css?v=20260914-2\"\u003E";
;pug_debug_line = 66;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript" + (" src=\"\u002Fjs\u002Faccount-ui.js?v=20260912-social-link-3\""+pug_attr("defer", true, true, true)) + "\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 67;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript" + (" src=\"\u002Fjs\u002Fsite-theme.js?v=20260915-server-theme-1\""+pug_attr("defer", true, true, true)) + "\u003E\u003C\u002Fscript\u003E\u003C\u002Fhead\u003E";
;pug_debug_line = 68;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cscript" + (" src=\"\u002Fjs\u002Fsite-notices.js?v=20260913-direct-notice-1\""+pug_attr("defer", true, true, true)) + "\u003E\u003C\u002Fscript\u003E";
;pug_debug_line = 70;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cbody style=\"min-width: 640px;\"\u003E";
;pug_debug_line = 71;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Top\"\u003E";
;pug_debug_line = 72;pug_debug_filename = "Web\\views\\layout.pug";
pug_mixins["Menu"]();
;pug_debug_line = 73;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"global-notice\"\u003E";
;pug_debug_line = 74;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"gn-content\"\u003E끄투게임이 출시되었습니다.\n\u003C\u002Fdiv\u003E";
;pug_debug_line = 76;pug_debug_filename = "Web\\views\\layout.pug";
pug_mixins["Expl"](L('GLOBAL_NOTICE'));
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 77;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 78;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Jungle\"\u003E";
;pug_debug_line = 79;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cspan id=\"mobile\"\u003E";
;pug_debug_line = 79;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.mobile) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 80;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cspan id=\"summonerID\"\u003E";
;pug_debug_line = 80;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = DATA._id) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 81;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cimg" + (" id=\"Background\""+pug_attr("src", '/img/bg/' + (locals.bg || 'def.png'), true, true)) + "\u003E";
;pug_debug_line = 82;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 55;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"PUBLIC\"\u003E";
;pug_debug_line = 55;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = PUBLIC ? "true" : undefined) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 56;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"IS_GUEST\"\u003E";
;pug_debug_line = 56;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = SESSION.profile ? "false" : "true") ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 57;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003C!-- span#PORT= locals.PORT--\u003E";
;pug_debug_line = 58;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"URL\"\u003E";
;pug_debug_line = 58;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${locals.PROTOCOL}://${locals.HOST}:${locals.PORT}${locals.GAME_PATH || ''}/${locals._id}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 59;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"MOREMI_PART\"\u003E";
;pug_debug_line = 59;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.MOREMI_PART.join(',')) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 60;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"AVAIL_EQUIP\"\u003E";
;pug_debug_line = 60;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = locals.AVAIL_EQUIP.join(',')) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 61;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"RULE\"\u003E";
;pug_debug_line = 61;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = JSON.stringify(locals.RULE)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 62;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"OPTIONS\"\u003E";
;pug_debug_line = 62;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = JSON.stringify(locals.OPTIONS)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 63;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cscript\u003E";
;pug_debug_line = 64;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "window.addEventListener('load', function(){";
;pug_debug_line = 65;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 65;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\tsetTimeout(function(){ if(window.__kkutuConnect) window.__kkutuConnect(); }, 1200);";
;pug_debug_line = 66;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\n";
;pug_debug_line = 66;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "});\u003C\u002Fscript\u003E";
;pug_debug_line = 67;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Yell\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 68;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Loading\"\u003E";
;pug_debug_line = 68;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LOADING')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 69;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Balloons\" style=\"position: absolute;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 70;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
LANG['explInjeong'] = `<h5>${L('explInjeong')}</h5>\
	<h5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'>${L('explInjeongListTitle')}</h5>\
	<h5>${locals.KO_INJEONG.map(function(item){ return L('theme_' + item); })}</h5>\
	<h5 style='margin-top: 2px; border-top: 1px dashed #444444; padding-top: 2px; color: #BBBBBB;'>${L('explInjeongListTitle')} (${L('modeEKT')}, ${L('modeESH')})</h5>\
	<h5>${locals.EN_INJEONG.map(function(item){ return L('theme_' + item); })}</h5>`;

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 83;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Middle\"\u003E";
;pug_debug_line = 84;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 78;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var VERSION = L('version');
;pug_debug_line = 79;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var nick = SESSION.profile ? (SESSION.profile.title || SESSION.profile.name) : null;
;pug_debug_line = 80;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Intro\"\u003E";
;pug_debug_line = 81;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg id=\"intro\" src=\"\u002Fimg\u002Fcustom\u002Fintro-desktop.png?v=20260913-intro-2\"\u003E";
;pug_debug_line = 82;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003C!-- img#intro-start(src='\u002Fimg\u002Fkkutu\u002Fintro_start.gif')--\u003E";
;pug_debug_line = 83;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"version\"\u003E";
;pug_debug_line = 83;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = VERSION) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 84;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"intro-text\"\u003E";
;pug_debug_line = 84;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LOADING')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 85;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"kkutu-menu\"\u003E";
;pug_debug_line = 86;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"tiny-menu for-lobby for-master for-normal for-gaming\" id=\"HelpBtn\" style=\"display: none; background-color: #BBBBBB;\"\u003E";
;pug_debug_line = 86;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('help')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 87;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"tiny-menu for-lobby for-master for-normal for-gaming\" id=\"SettingBtn\" style=\"display: none; background-color: #CCCCCC;\"\u003E";
;pug_debug_line = 87;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('settings')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 88;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"tiny-menu for-lobby for-master for-normal for-gaming\" id=\"CommunityBtn\" style=\"display: none; background-color: #DAA9FF;\"\u003E";
;pug_debug_line = 88;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('community')) ? "" : pug_interp) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 89;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master for-normal\" id=\"SpectateBtn\" style=\"display: none; background-color: #D19DFF;\"\u003E";
;pug_debug_line = 89;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('spectate')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 90;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"SetRoomBtn\" style=\"display: none; background-color: #B0D2F3;\"\u003E";
;pug_debug_line = 90;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('setRoom')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 91;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"NewRoomBtn\" style=\"display: none; background-color: #8EC0F3;\"\u003E";
;pug_debug_line = 91;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('newRoom')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 92;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"QuickRoomBtn\" style=\"display: none; background-color: #B0D2F3;\"\u003E";
;pug_debug_line = 92;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('quickRoom')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 93;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"TutorialBtn\" type=\"button\" style=\"display: none; background-color: #F5D875;\"\u003E";
;pug_debug_line = 93;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "튜토리얼\u003C\u002Fbutton\u003E";
;pug_debug_line = 94;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"ShopBtn\" style=\"display: none; background-color: #B3E7B7;\"\u003E";
;pug_debug_line = 94;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('shop')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 95;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby for-master for-normal for-gaming\" id=\"DictionaryBtn\" style=\"display: none; background-color: #73D07A;\"\u003E";
;pug_debug_line = 95;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dict')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 96;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003C!-- button#WordPlusBtn.for-lobby.for-master.for-normal.for-gaming(style='display: none; background-color: #73D07A;')= L('wordPlus')--\u003E";
;pug_debug_line = 97;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"InviteBtn\" style=\"display: none; background-color: #9FE669;\"\u003E";
;pug_debug_line = 97;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('invite')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 98;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-normal\" id=\"ReadyBtn\" style=\"display: none; background-color: #FFC67F;\"\u003E";
;pug_debug_line = 98;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('ready')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 99;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master\" id=\"StartBtn\" style=\"display: none; background-color: #FFB576;\"\u003E";
;pug_debug_line = 99;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('start')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 100;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-master for-normal for-gaming\" id=\"ExitBtn\" style=\"display: none; background-color: #FFADAD;\"\u003E";
;pug_debug_line = 100;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('exit')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 101;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"ReplayBtn\" style=\"display: none; background-color: #D9FF82;\"\u003E";
;pug_debug_line = 101;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replay')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 102;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"for-lobby\" id=\"LeaderboardBtn\" style=\"display: none; background-color: #FFADD3;\"\u003E";
;pug_debug_line = 102;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "순위전\u003C\u002Fbutton\u003E";
;pug_debug_line = 103;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"fb-like for-lobby for-master for-normal for-gaming\" id=\"facebook-menu\" data-href=\"http:\u002F\u002Fkkutu.kr\" data-width=\"300\" data-layout=\"button_count\" data-action=\"like\" data-show-faces=\"true\" data-share=\"true\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 104;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"GameExitControl\" type=\"button\" style=\"display: none;\"\u003E";
;pug_debug_line = 104;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "게임 나가기\u003C\u002Fbutton\u003E";
;pug_debug_line = 105;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"for-lobby\" id=\"LobbyHero\" style=\"display: none;\"\u003E";
;pug_debug_line = 106;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"moremi\" id=\"LobbyHeroImage\"\u003E";
;pug_debug_line = 107;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"moremies moremi-body\" src=\"\u002Fimg\u002Fcustom\u002Fmoremi-yellow.png?v=20260907-face-4\" data-moremi-base=\"\u002Fimg\u002Fcustom\u002Fmoremi-yellow.png?v=20260907-face-4\" alt=\"모레미\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 108;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch3 id=\"LobbyHeroName\"\u003E";
;pug_debug_line = 108;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('guest')) ? "" : pug_interp)) + "\u003C\u002Fh3\u003E";
;pug_debug_line = 109;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"LobbyHeroSub\"\u003E";
;pug_debug_line = 109;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 111;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cform class=\"for-lobby\" id=\"GuestNameEntry\" style=\"display: none;\" autocomplete=\"off\"\u003E";
;pug_debug_line = 112;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel for=\"GuestNameInput\"\u003E";
;pug_debug_line = 112;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "손님 이름\u003C\u002Flabel\u003E";
;pug_debug_line = 113;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"GuestNameInput\" type=\"text\" maxlength=\"12\" placeholder=\"2~12자\" aria-label=\"손님 이름\"\u003E";
;pug_debug_line = 114;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"GuestNameSave\" type=\"submit\"\u003E";
;pug_debug_line = 114;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "적용\u003C\u002Fbutton\u003E";
;pug_debug_line = 115;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"GuestNameHint\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fform\u003E";
;pug_debug_line = 116;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 117;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-panel\"\u003E";
;pug_debug_line = 118;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-intro\"\u003E";
;pug_debug_line = 119;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-intro-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 120;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["FA"]('sliders');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 121;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 122;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 122;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "나만의 플레이 환경\u003C\u002Fh3\u003E";
;pug_debug_line = 123;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 123;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "소리와 게임 편의 기능을 원하는 방식으로 조절하세요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 124;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csection class=\"settings-section\" aria-labelledby=\"settings-sound-title\"\u003E";
;pug_debug_line = 125;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-section-title\"\u003E";
;pug_debug_line = 126;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-section-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 127;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["FA"]('volume-up');
pug_html = pug_html + "\u003C\u002Fspan\u003E";
;pug_debug_line = 128;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 129;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"settings-sound-title\"\u003E";
;pug_debug_line = 129;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "사운드\u003C\u002Fh4\u003E";
;pug_debug_line = 130;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 130;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "음악과 효과음은 따로 조절할 수 있어요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 131;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-row\"\u003E";
;pug_debug_line = 132;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-label\"\u003E";
;pug_debug_line = 133;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 133;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "배경 음악\u003C\u002Fstrong\u003E";
;pug_debug_line = 134;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 134;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "로비와 게임 음악\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 135;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-controls\"\u003E";
;pug_debug_line = 136;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-range\" id=\"settings-bgm-volume\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"100\" aria-label=\"배경 음악 볼륨\"\u003E";
;pug_debug_line = 137;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coutput id=\"settings-bgm-value\" for=\"settings-bgm-volume\"\u003E";
;pug_debug_line = 137;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "100%\u003C\u002Foutput\u003E";
;pug_debug_line = 138;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-mute\"\u003E";
;pug_debug_line = 139;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-switch\" id=\"mute-bgm\" type=\"checkbox\"\u003E";
;pug_debug_line = 140;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel for=\"mute-bgm\"\u003E";
;pug_debug_line = 140;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "음소거\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 141;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-row\"\u003E";
;pug_debug_line = 142;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-label\"\u003E";
;pug_debug_line = 143;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 143;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "로비 음악\u003C\u002Fstrong\u003E";
;pug_debug_line = 144;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 144;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "로비에서 재생할 곡\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 145;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-controls\"\u003E";
;pug_debug_line = 146;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect class=\"settings-select\" id=\"settings-lobby-bgm\" aria-label=\"로비 음악 선택\"\u003E";
;pug_debug_line = 147;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"default\"\u003E";
;pug_debug_line = 147;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "일반 음악\u003C\u002Foption\u003E";
;pug_debug_line = 148;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"autumn\"\u003E";
;pug_debug_line = 148;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "가을 음악(기본)\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 149;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-row\"\u003E";
;pug_debug_line = 150;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-label\"\u003E";
;pug_debug_line = 151;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 151;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "효과음\u003C\u002Fstrong\u003E";
;pug_debug_line = 152;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 152;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "시작·정답·알림 효과음\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 153;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-audio-controls\"\u003E";
;pug_debug_line = 154;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-range\" id=\"settings-effect-volume\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"100\" aria-label=\"효과음 볼륨\"\u003E";
;pug_debug_line = 155;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coutput id=\"settings-effect-value\" for=\"settings-effect-volume\"\u003E";
;pug_debug_line = 155;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "100%\u003C\u002Foutput\u003E";
;pug_debug_line = 156;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-mute\"\u003E";
;pug_debug_line = 157;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput class=\"settings-switch\" id=\"mute-effect\" type=\"checkbox\"\u003E";
;pug_debug_line = 158;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel for=\"mute-effect\"\u003E";
;pug_debug_line = 158;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "음소거\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";
;pug_debug_line = 159;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csection class=\"settings-section\" aria-labelledby=\"settings-play-title\"\u003E";
;pug_debug_line = 160;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-section-title\"\u003E";
;pug_debug_line = 161;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-section-icon\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 162;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["FA"]('gamepad');
pug_html = pug_html + "\u003C\u002Fspan\u003E";
;pug_debug_line = 163;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 164;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"settings-play-title\"\u003E";
;pug_debug_line = 164;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "플레이와 소셜\u003C\u002Fh4\u003E";
;pug_debug_line = 165;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 165;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "필요한 알림과 입장 옵션만 켜 둘 수 있어요.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 166;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-option-grid\"\u003E";
;pug_debug_line = 167;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 168;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-invite\" type=\"checkbox\"\u003E";
;pug_debug_line = 169;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 170;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 171;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 171;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "초대 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 172;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 172;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "게임 초대 알림을 받지 않아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 173;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 174;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-whisper\" type=\"checkbox\"\u003E";
;pug_debug_line = 175;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 176;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 177;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 177;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "귓속말 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 178;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 178;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "귓속말 요청을 조용히 막아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 179;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 180;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"deny-friend\" type=\"checkbox\"\u003E";
;pug_debug_line = 181;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 182;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 183;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 183;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "친구 추가 받지 않기\u003C\u002Fstrong\u003E";
;pug_debug_line = 184;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 184;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "친구 요청을 받지 않아요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 185;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 186;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"auto-ready\" type=\"checkbox\"\u003E";
;pug_debug_line = 187;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 188;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 189;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 189;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "자동 준비\u003C\u002Fstrong\u003E";
;pug_debug_line = 190;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 190;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "방에 들어가면 바로 준비해요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 191;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 192;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"sort-user\" type=\"checkbox\"\u003E";
;pug_debug_line = 193;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 194;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 195;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 195;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "접속자 정렬\u003C\u002Fstrong\u003E";
;pug_debug_line = 196;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 196;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "접속자 목록을 정리해서 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 197;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 198;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"only-waiting\" type=\"checkbox\"\u003E";
;pug_debug_line = 199;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 200;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 201;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 201;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "대기 중인 방만 보기\u003C\u002Fstrong\u003E";
;pug_debug_line = 202;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 202;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "게임이 시작되지 않은 방만 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 203;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel class=\"settings-check\"\u003E";
;pug_debug_line = 204;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"only-unlock\" type=\"checkbox\"\u003E";
;pug_debug_line = 205;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-box\" aria-hidden=\"true\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 206;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"settings-check-copy\"\u003E";
;pug_debug_line = 207;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 207;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "비밀번호 없는 방만 보기\u003C\u002Fstrong\u003E";
;pug_debug_line = 208;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Csmall\u003E";
;pug_debug_line = 208;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "바로 입장할 수 있는 방만 보여줘요.\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fsection\u003E";
;pug_debug_line = 209;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"settings-actions\"\u003E";
;pug_debug_line = 210;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-reset\" id=\"setting-reset\" type=\"button\"\u003E";
;pug_debug_line = 210;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "기본값 복원\u003C\u002Fbutton\u003E";
;pug_debug_line = 211;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-secondary\" id=\"setting-server\" type=\"button\"\u003E";
;pug_debug_line = 211;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "서버 선택\u003C\u002Fbutton\u003E";
;pug_debug_line = 212;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton class=\"settings-action-primary\" id=\"setting-ok\" type=\"button\"\u003E";
;pug_debug_line = 212;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "저장하고 적용\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
}, 'SettingDiag', 560, 610, '환경설정');
;pug_debug_line = 213;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 214;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 225px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 215;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"comm-friends\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 216;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 217;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"comm-friend-add\"\u003E";
;pug_debug_line = 217;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('friendAdd')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'CommunityDiag', 300, 300);
;pug_debug_line = 218;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 219;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"ranked-panel\"\u003E";
;pug_debug_line = 220;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"ranked-panel-head\"\u003E";
;pug_debug_line = 221;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg id=\"RankTierIcon\" src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-bronze.png\" alt=\"현재 순위 아이콘\"\u003E";
;pug_debug_line = 222;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 223;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch3 id=\"RankTierName\"\u003E";
;pug_debug_line = 223;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "브론즈\u003C\u002Fh3\u003E";
;pug_debug_line = 224;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp id=\"RankRating\"\u003E";
;pug_debug_line = 224;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "1000 RP · 0승 0패\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 225;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp class=\"ranked-guest-warning\" id=\"RankGuestWarning\" role=\"status\"\u003E";
;pug_debug_line = 225;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "비회원 순위는 이 브라우저에 저장됩니다. 캐시 또는 사이트 데이터를 삭제하면 순위가 초기화됩니다.\u003C\u002Fp\u003E";
;pug_debug_line = 226;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"rank-tier-gallery\" aria-label=\"순위 아이콘\"\u003E";
;pug_debug_line = 227;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 228;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-none.png\" alt=\"없음\"\u003E";
;pug_debug_line = 229;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 229;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "없음\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 230;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 231;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-bronze.png\" alt=\"브론즈\"\u003E";
;pug_debug_line = 232;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 232;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "브론즈\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 233;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 234;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-silver.png\" alt=\"실버\"\u003E";
;pug_debug_line = 235;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 235;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "실버\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 236;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 237;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-nature.png\" alt=\"자연\"\u003E";
;pug_debug_line = 238;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 238;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "자연\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 239;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 240;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Fimg\u002Fcustom\u002Franks\u002Frank-kkutugame.png\" alt=\"끄투게임 랭크\"\u003E";
;pug_debug_line = 241;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 241;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 242;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp class=\"ranked-rules\"\u003E";
;pug_debug_line = 242;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "2인 자동 매칭 · 한국어 끝말잇기 · 표준 낱말집 · 3라운드\u003C\u002Fp\u003E";
;pug_debug_line = 243;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RankQueueBtn\" type=\"button\"\u003E";
;pug_debug_line = 243;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "순위전 시작\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'LeaderboardDiag', 500, 475, '순위전');
;pug_debug_line = 244;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 245;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 246;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 246;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 247;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"quick-mode\"\u003E";
;pug_debug_line = 248;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
for(var i in locals.MODE)
{
;pug_debug_line = 249;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (pug_attr("value", Number(i), true, true)) + "\u003E";
;pug_debug_line = 249;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('mode' + locals.MODE[i])) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
}
pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 250;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 59px;\"\u003E";
;pug_debug_line = 251;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"height: 45px;\"\u003E";
;pug_debug_line = 251;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('misc')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 252;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
for(var i in locals.OPTIONS)
{
;pug_debug_line = 253;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GameOption"](i, 'quick');
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 254;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 255;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%; height: 20px;\" id=\"quick-status\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 256;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 257;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%; height: 20px;\" id=\"quick-queue\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 258;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 259;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"quick-ok\"\u003E";
;pug_debug_line = 259;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'QuickDiag', 300, 230, L('quickRoom'));
;pug_debug_line = 260;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 261;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 262;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 262;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roomTitle')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 263;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"room-title\""+pug_attr("placeholder", (nick || L('guest'))+L('roomDefault'), true, true)+" maxlength=\"20\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 264;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 265;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 265;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('password')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 266;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"room-pw\" type=\"password\""+pug_attr("placeholder", L('password'), true, true)+" maxlength=\"20\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 267;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 268;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 268;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('userLimit')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 269;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"room-limit\" type=\"number\" min=\"2\" max=\"8\" step=\"1\" value=\"8\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 270;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 271;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 271;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 272;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-mode\"\u003E";
;pug_debug_line = 273;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coptgroup" + (pug_attr("label", L('mcKorean'), true, true)) + "\u003E";
;pug_debug_line = 274;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"3\"\u003E";
;pug_debug_line = 274;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKSH')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 275;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"14\"\u003E";
;pug_debug_line = 275;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKAW')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 276;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"15\"\u003E";
;pug_debug_line = 276;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeYUT')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 277;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"2\"\u003E";
;pug_debug_line = 277;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKKT')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 278;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"8\"\u003E";
;pug_debug_line = 278;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKAP')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 279;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"6\"\u003E";
;pug_debug_line = 279;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKTY')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 280;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"10\"\u003E";
;pug_debug_line = 280;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKDA')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 281;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"5\"\u003E";
;pug_debug_line = 281;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKCW')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 282;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"12\"\u003E";
;pug_debug_line = 282;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeKSS')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 283;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"4\"\u003E";
;pug_debug_line = 283;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeCSQ')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 284;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"9\"\u003E";
;pug_debug_line = 284;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeHUN')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Foptgroup\u003E";
;pug_debug_line = 285;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coptgroup" + (pug_attr("label", L('mcEnglish'), true, true)) + "\u003E";
;pug_debug_line = 286;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"1\"\u003E";
;pug_debug_line = 286;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeESH')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 287;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"0\"\u003E";
;pug_debug_line = 287;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeEKT')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 288;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"7\"\u003E";
;pug_debug_line = 288;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeETY')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 289;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"11\"\u003E";
;pug_debug_line = 289;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeEDA')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 290;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"13\"\u003E";
;pug_debug_line = 290;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('modeESS')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Foptgroup\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 291;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"margin-top: -5px; height: 50px;\"\u003E";
;pug_debug_line = 292;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 293;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"game-mode-expl\" style=\"width: 100%; font-size: 11px;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 294;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 295;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 295;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "보호막 (정상 제출 횟수)\u003C\u002Fh4\u003E";
;pug_debug_line = 296;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"room-shield\" type=\"number\" min=\"0\" max=\"100\" value=\"15\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 297;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"room-dictionary-panel\"\u003E";
;pug_debug_line = 298;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 298;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryPreset')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 299;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-dictionary\"\u003E";
;pug_debug_line = 300;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"basic\"\u003E";
;pug_debug_line = 300;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryBasic')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 301;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"standard\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 301;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryStandard')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 302;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"complex\"\u003E";
;pug_debug_line = 302;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dictionaryComplex')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 303;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
if (ADMIN) {
;pug_debug_line = 304;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar admin-practice-bot\"\u003E";
;pug_debug_line = 305;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 305;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "운영자 도구\u003C\u002Fh4\u003E";
;pug_debug_line = 306;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"admin-practice-bot\" type=\"button\"\u003E";
;pug_debug_line = 306;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "연습 봇 추가\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
;pug_debug_line = 307;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 308;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 308;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('numRound')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 309;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"room-round\" type=\"number\" min=\"1\" max=\"10\" step=\"1\" value=\"5\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 310;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 311;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 311;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roundTime')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 312;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"room-time\"\u003E";
;pug_debug_line = 313;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"10\" style=\"color: #FF4444\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 314;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"30\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 315;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"60\""+pug_attr("selected", true, true, true)) + "\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 316;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"90\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 317;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"120\"\u003E\u003C\u002Foption\u003E";
;pug_debug_line = 318;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"150\"\u003E\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 319;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 59px;\"\u003E";
;pug_debug_line = 320;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"height: 45px;\"\u003E";
;pug_debug_line = 320;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('misc')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 321;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
for(var i in locals.OPTIONS)
{
;pug_debug_line = 322;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GameOption"](i, 'room');
}
;pug_debug_line = 323;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"room-injpick-panel\"\u003E";
;pug_debug_line = 324;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-injeong-pick\" style=\"font-size: 11px;\"\u003E";
;pug_debug_line = 324;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pickInjeong')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 325;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 326;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-ok\"\u003E";
;pug_debug_line = 326;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RoomDiag', 300, 415);
;pug_debug_line = 327;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 328;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 328;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('explInjPick')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 329;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 330;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-all\"\u003E";
;pug_debug_line = 330;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injpickAll')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 331;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-no\"\u003E";
;pug_debug_line = 331;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injpickNo')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 332;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"injpick-list\" style=\"height: 280px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 333;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"ko-pick-list\" style=\"width: 100%;\"\u003E";
;pug_debug_line = 334;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
locals.KO_THEME.concat(locals.KO_INJEONG).forEach(function(item){
{
;pug_debug_line = 335;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var name = "ko-pick-" + item;
;pug_debug_line = 336;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
if(locals.IJP_EXCEPT.indexOf(item) != -1) return;
;pug_debug_line = 337;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv style=\"float: left; width: 100%;\"\u003E";
;pug_debug_line = 338;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("id", name, true, true)+" type=\"checkbox\" style=\"width: auto;\"") + "\u003E";
;pug_debug_line = 339;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", name, true, true)) + "\u003E";
;pug_debug_line = 339;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = LANG['theme_' + item]) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
}
;pug_debug_line = 340;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 341;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-opt\" id=\"en-pick-list\" style=\"width: 100%;\"\u003E";
;pug_debug_line = 342;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
locals.EN_THEME.concat(locals.EN_INJEONG).forEach(function(item){
{
;pug_debug_line = 343;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
var name = "en-pick-" + item;
;pug_debug_line = 344;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
if(locals.IJP_EXCEPT.indexOf(item) != -1) return;
;pug_debug_line = 345;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv style=\"float: left; width: 100%;\"\u003E";
;pug_debug_line = 346;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("id", name, true, true)+" type=\"checkbox\" style=\"width: auto;\"") + "\u003E";
;pug_debug_line = 347;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Clabel" + (pug_attr("for", name, true, true)) + "\u003E";
;pug_debug_line = 347;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = LANG['theme_' + item]) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
}
;pug_debug_line = 348;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 349;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 350;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"injpick-ok\"\u003E";
;pug_debug_line = 350;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'InjPickDiag', 200, 400, L('pickInjeong'));
;pug_debug_line = 351;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 352;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 353;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 353;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('selectLevel')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 354;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"robot-level\"\u003E";
;pug_debug_line = 355;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"0\"\u003E";
;pug_debug_line = 355;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel0')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 356;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"1\"\u003E";
;pug_debug_line = 356;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel1')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 357;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"2\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 357;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel2')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 358;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"3\"\u003E";
;pug_debug_line = 358;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel3')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 359;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"4\"\u003E";
;pug_debug_line = 359;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiLevel4')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 360;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 361;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 361;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('team')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 362;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"robot-team\"\u003E";
;pug_debug_line = 363;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (" value=\"0\""+pug_attr("selected", true, true, true)) + "\u003E";
;pug_debug_line = 363;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('teamSolo')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 364;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"1\"\u003E";
;pug_debug_line = 364;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "A\u003C\u002Foption\u003E";
;pug_debug_line = 365;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"2\"\u003E";
;pug_debug_line = 365;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "B\u003C\u002Foption\u003E";
;pug_debug_line = 366;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"3\"\u003E";
;pug_debug_line = 366;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "C\u003C\u002Foption\u003E";
;pug_debug_line = 367;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"4\"\u003E";
;pug_debug_line = 367;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "D\u003C\u002Foption\u003E\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 368;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 369;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"robot-ok\"\u003E";
;pug_debug_line = 369;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RobotDiag', 300, 135, L('robot'));
;pug_debug_line = 370;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 371;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-board\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 372;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"rank-result-summary is-hidden\" id=\"RankResultSummary\" aria-live=\"polite\"\u003E";
;pug_debug_line = 373;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong id=\"RankResultDelta\"\u003E\u003C\u002Fstrong\u003E";
;pug_debug_line = 374;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan id=\"RankResultRating\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 375;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me\"\u003E";
;pug_debug_line = 376;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-score\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 377;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-money\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 378;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level\"\u003E";
;pug_debug_line = 379;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level-head\"\u003E";
;pug_debug_line = 379;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('LEVEL')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 380;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-level-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 381;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('result-me-gauge');
;pug_debug_line = 382;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"result-me-score-text\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 383;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"expl result-me-expl\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 384;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 385;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"result-ok\"\u003E";
;pug_debug_line = 385;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ResultDiag', 400, 480, L('gameResult'), true);
;pug_debug_line = 386;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 387;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 388;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 388;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('wpHere')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 389;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"dict-input\" style=\"width: 283px;\""+pug_attr("placeholder", L('wpInput'), true, true)+" maxlength=\"200\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 390;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"dict-output\" style=\"height: 195px; overflow-y: scroll; color: #BBBBBB; background-color: #111111;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 391;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 392;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cselect id=\"dict-theme\"\u003E";
;pug_debug_line = 393;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption value=\"\"\u003E";
;pug_debug_line = 393;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pickInjeong')) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
;pug_debug_line = 394;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
locals.KO_INJEONG.forEach(function(item){
{
;pug_debug_line = 395;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Coption" + (pug_attr("value", item, true, true)) + "\u003E";
;pug_debug_line = 395;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('theme_' + item)) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
}
;pug_debug_line = 396;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
});
pug_html = pug_html + "\u003C\u002Fselect\u003E";
;pug_debug_line = 397;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dict-search\"\u003E";
;pug_debug_line = 397;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('SEARCH')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 398;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dict-injeong\"\u003E";
;pug_debug_line = 398;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('injeongReq')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'DictionaryDiag', 400, 300, L('dict'));
;pug_debug_line = 399;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 400;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"invite-board\" style=\"height: 355px; overflow-y: scroll;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 401;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 402;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"invite-robot\"\u003E";
;pug_debug_line = 402;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('inviteRobot')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'InviteDiag', 300, 420, L('invite'));
;pug_debug_line = 403;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 404;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar room-info-head\"\u003E";
;pug_debug_line = 405;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 405;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('roomTitle')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 406;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value ellipse\" id=\"ri-title\"\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 407;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 407;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 408;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-mode\"\u003E\u003C\u002Fh4\u003E";
;pug_debug_line = 409;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 409;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('rounds')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 410;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-round\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 411;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"padding: 2px 0px; border-top: 1px dashed #CCC; margin: 2px 0px;\"\u003E";
;pug_debug_line = 412;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 412;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('players')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 413;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"ri-limit\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 414;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"height: 190px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 415;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"ri-players\" style=\"width: 100%;\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 416;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 417;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"room-info-join\"\u003E";
;pug_debug_line = 417;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('join')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'RoomInfoDiag', 300, 365);
;pug_debug_line = 418;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 419;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar profile-head\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 420;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 421;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 83px;\"\u003E";
;pug_debug_line = 421;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('place')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 422;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"profile-place\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 423;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar profile-record\" style=\"padding: 2px 0px; border-top: 1px dashed #CCC; margin: 2px 0px; height: 175px; overflow-y: scroll;\"\u003E";
;pug_debug_line = 424;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-record-field\" style=\"font-weight: bold; text-align: center;\"\u003E";
;pug_debug_line = 425;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-name\"\u003E";
;pug_debug_line = 425;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('gameMode')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 426;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-record\"\u003E";
;pug_debug_line = 426;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('record')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 427;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profile-field-score\"\u003E";
;pug_debug_line = 427;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('recordScore')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 428;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"profile-record\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 429;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 430;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-friend-add\"\u003E";
;pug_debug_line = 430;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('friendAdd')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 431;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-whisper\"\u003E";
;pug_debug_line = 431;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('whisper')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 432;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-shut\"\u003E";
;pug_debug_line = 432;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('shut')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 433;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-kick\"\u003E";
;pug_debug_line = 433;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('kick')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 434;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-level\"\u003E";
;pug_debug_line = 434;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('aiSetting')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 435;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-dress\"\u003E";
;pug_debug_line = 435;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('dress')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 436;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"profile-handover\"\u003E";
;pug_debug_line = 436;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('handover')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ProfileDiag', 300, 365);
;pug_debug_line = 437;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 438;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"kick-vote-text\" style=\"text-align: center;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 439;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"text-align: center;\"\u003E";
;pug_debug_line = 439;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('kickVoteNotice')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 440;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 441;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('kick-vote-time');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 442;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 443;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"kick-vote-no\"\u003E";
;pug_debug_line = 443;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('disagree')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 444;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"kick-vote-yes\"\u003E";
;pug_debug_line = 444;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('agree')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'KickVoteDiag', 300, 160, L('kickVote'));
;pug_debug_line = 445;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 446;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 447;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 447;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingBefore')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 448;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-before\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 449;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 450;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 450;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingCost')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 451;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-cost\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 452;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 453;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 453;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('pingAfter')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 454;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value purchase-ping\" id=\"purchase-ping-after\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 455;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 456;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 456;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('moremiAfter')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 457;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"moremi\" id=\"moremi-after\" style=\"float: left; width: 100px; height: 100px;\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 458;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 459;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"purchase-item-name\" style=\"width: 100%; font-weight: bold;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 460;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 461;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 id=\"purchase-item-desc\" style=\"width: 100%;\"\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 462;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 463;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"purchase-no\"\u003E";
;pug_debug_line = 463;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('NO')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 464;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"purchase-ok\"\u003E";
;pug_debug_line = 464;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'PurchaseDiag', 300, 310, L('purchase'));
;pug_debug_line = 465;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 466;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"replay-file\" type=\"file\" style=\"width: 288px;\" accept=\".kkt\"\u003E";
;pug_debug_line = 467;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 468;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 468;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayDate')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 469;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"replay-date\"\u003E";
;pug_debug_line = 469;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "-\u003C\u002Fh4\u003E";
;pug_debug_line = 470;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 470;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('VERSION')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 471;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"replay-version\"\u003E";
;pug_debug_line = 471;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "-\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 472;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 473;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 473;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayPlayers')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 474;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 class=\"dialog-bar-value\" id=\"replay-players\"\u003E";
;pug_debug_line = 474;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "-\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 475;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 476;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"replay-view\"\u003E";
;pug_debug_line = 476;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('replayView')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ReplayDiag', 300, 300, L('replay'));
;pug_debug_line = 477;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 478;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 479;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 150px;\"\u003E";
;pug_debug_line = 479;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('myExordial')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 480;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"dress-exordial\" type=\"textfield\""+pug_attr("placeholder", L('myExordialX'), true, true)+" style=\"width: 435px;\" maxlength=\"100\"") + "\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 481;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"width: 150px;\"\u003E";
;pug_debug_line = 482;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"moremi\" id=\"dress-view\" style=\"float: left; width: 150px; height: 150px;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 483;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%; font-weight: bold;\"\u003E";
;pug_debug_line = 483;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('myMoremi')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 484;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"padding: 5px; width: 440px;\"\u003E";
;pug_debug_line = 485;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"inventory-all-label\"\u003E";
;pug_debug_line = 485;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "전체\u003C\u002Fdiv\u003E";
;pug_debug_line = 486;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"goods-box\" id=\"dress-goods\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 487;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 488;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dress-ok\"\u003E";
;pug_debug_line = 488;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 489;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"dress-cf\"\u003E";
;pug_debug_line = 489;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('charFactory')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
;pug_debug_line = 490;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton" + (pug_attr("onclick", `alert("${L("paybackHelp")}");`, true, true)) + "\u003E";
;pug_debug_line = 490;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('payback')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'DressDiag', 600, 420, L('dress'));
;pug_debug_line = 491;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 492;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"width: 300px;\"\u003E";
;pug_debug_line = 493;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"cf-tray\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 494;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"cf-dict\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 495;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"width: 200px;\"\u003E";
;pug_debug_line = 496;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"border-bottom: 1px solid #CCCCCC; width: 100%; height: 24px;\"\u003E";
;pug_debug_line = 496;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('cfReward')) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
;pug_debug_line = 497;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"cf-reward\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 498;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" style=\"width: 200px;\"\u003E";
;pug_debug_line = 499;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"cf-cost\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 500;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 501;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"goods-box\" id=\"cf-goods\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 502;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 503;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"cf-compose\"\u003E";
;pug_debug_line = 503;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('cfCompose')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'CharFactoryDiag', 500, 410, L('charFactory'));
;pug_debug_line = 504;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 505;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"chat-log-board\" style=\"height: 475px; font-size: 11px; overflow-y: scroll;\"\u003E\u003C\u002Fdiv\u003E";
}
}, 'ChatLogDiag', 350, 500, L('chatLog'));
;pug_debug_line = 506;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 507;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\"\u003E";
;pug_debug_line = 508;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch4 style=\"width: 100%;\"\u003E";
;pug_debug_line = 508;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('obtained') + '!') ? "" : pug_interp)) + "\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 509;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jt-image\" id=\"obtain-image\" style=\"margin-left: 110px; width: 80px; height: 80px;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 510;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar\" id=\"obtain-name\" style=\"text-align: center;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 511;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"dialog-bar tail-button\"\u003E";
;pug_debug_line = 512;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"obtain-ok\"\u003E";
;pug_debug_line = 512;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('OK')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
}
}, 'ObtainDiag', 300, 200, L('notice'), true);
;pug_debug_line = 513;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Dialog"].call({
block: function(){
;pug_debug_line = 514;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ciframe id=\"help-board\" width=\"550\" height=\"375\"\u003E\u003C\u002Fiframe\u003E";
}
}, 'HelpDiag', 550, 400, L('helpText'));
;pug_debug_line = 515;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 516;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 516;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "불러오는 중\u003C\u002Fdiv\u003E";
}
}, 'UserList');
;pug_debug_line = 517;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 518;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 518;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "불러오는 중\u003C\u002Fdiv\u003E";
}
}, 'RoomList');
;pug_debug_line = 519;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 520;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"shop-shelf\"\u003E";
;pug_debug_line = 521;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"shop-welcome\"\u003E";
;pug_debug_line = 521;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "상점에 오신걸 환영합니다\u003C\u002Fdiv\u003E";
;pug_debug_line = 522;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"shop-font-card\"\u003E";
;pug_debug_line = 523;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"shop-font-preview\"\u003E";
;pug_debug_line = 523;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "끄투게임\u003C\u002Fdiv\u003E";
;pug_debug_line = 524;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"shop-font-info\"\u003E";
;pug_debug_line = 525;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 525;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "둥근모 글꼴\u003C\u002Fh3\u003E";
;pug_debug_line = 526;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 526;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "게임내에서 써지는 글씨의 폰트를 바꿔줍니다.\u003C\u002Fp\u003E";
;pug_debug_line = 527;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong\u003E";
;pug_debug_line = 527;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "200핑\u003C\u002Fstrong\u003E";
;pug_debug_line = 528;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"DungGeunMoBuy\" type=\"button\"\u003E";
;pug_debug_line = 528;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "구매\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
}, 'Shop');
;pug_debug_line = 529;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 530;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"room-stage-actions\"\u003E";
;pug_debug_line = 531;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomSpectateAction\" type=\"button\"\u003E";
;pug_debug_line = 531;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "관전\u003C\u002Fbutton\u003E";
;pug_debug_line = 532;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomSettingsAction\" type=\"button\"\u003E";
;pug_debug_line = 532;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "방 설정\u003C\u002Fbutton\u003E";
;pug_debug_line = 533;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomInviteAction\" type=\"button\"\u003E";
;pug_debug_line = 533;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "초대\u003C\u002Fbutton\u003E";
;pug_debug_line = 534;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomBotAction\" type=\"button\"\u003E";
;pug_debug_line = 534;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "봇 추가\u003C\u002Fbutton\u003E";
;pug_debug_line = 535;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomDictionaryAction\" type=\"button\"\u003E";
;pug_debug_line = 535;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "사전\u003C\u002Fbutton\u003E";
;pug_debug_line = 536;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomExitAction\" type=\"button\"\u003E";
;pug_debug_line = 536;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "나가기\u003C\u002Fbutton\u003E";
;pug_debug_line = 537;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomStartAction\" type=\"button\"\u003E";
;pug_debug_line = 537;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "시작!\u003C\u002Fbutton\u003E";
;pug_debug_line = 538;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"RoomReadyAction\" type=\"button\"\u003E";
;pug_debug_line = 538;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "준비\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 539;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"room-stage-content\"\u003E";
;pug_debug_line = 540;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-selector\"\u003E";
;pug_debug_line = 541;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-0\" id=\"team-0\"\u003E";
;pug_debug_line = 541;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('teamSolo')) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 542;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-1\" id=\"team-1\"\u003E";
;pug_debug_line = 542;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "A\u003C\u002Fdiv\u003E";
;pug_debug_line = 543;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-2\" id=\"team-2\"\u003E";
;pug_debug_line = 543;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "B\u003C\u002Fdiv\u003E";
;pug_debug_line = 544;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-3\" id=\"team-3\"\u003E";
;pug_debug_line = 544;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "C\u003C\u002Fdiv\u003E";
;pug_debug_line = 545;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"team-button team-4\" id=\"team-4\"\u003E";
;pug_debug_line = 545;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "D\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 546;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"room-users\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
}, 'Room');
;pug_debug_line = 547;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 548;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-head\"\u003E";
;pug_debug_line = 549;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"items\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 550;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"hints\" style=\"display: none;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 551;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"b-left cwcmd\" style=\"display: none;\"\u003E";
;pug_debug_line = 552;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"cw-q-head\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 553;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"cw-q-input\""+pug_attr("placeholder", L('inputHere'), true, true)+" style=\"width: 313px; height: 20px; font-size: 15px;\"") + "\u003E";
;pug_debug_line = 554;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"cw-q-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 555;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"b-left bb\" style=\"display: none;\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 556;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjoriping\"\u003E";
;pug_debug_line = 557;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoEyeL\" src=\"\u002Fimg\u002FjjoeyeL.png\"\u003E";
;pug_debug_line = 558;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoEyeClosed jjoEyeClosedL\" src=\"\u002Fimg\u002Fjjoeye-closed.png\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 559;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoNose\" src=\"\u002Fimg\u002Fjjonose.png\"\u003E";
;pug_debug_line = 560;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoObj jjoEyeR\" src=\"\u002Fimg\u002FjjoeyeR.png\"\u003E";
;pug_debug_line = 561;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"jjoEyeClosed jjoEyeClosedR\" src=\"\u002Fimg\u002Fjjoeye-closed.png\" aria-hidden=\"true\"\u003E";
;pug_debug_line = 562;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjoDisplayBar\"\u003E";
;pug_debug_line = 563;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jjo-display ellipse\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 564;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('jjo-turn-time');
;pug_debug_line = 565;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('jjo-round-time');
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 566;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"word-meaning-panel is-empty\" id=\"WordMeaning\" aria-live=\"polite\"\u003E";
;pug_debug_line = 567;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"word-meaning-label\"\u003E";
;pug_debug_line = 567;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "낱말 뜻\u003C\u002Fspan\u003E";
;pug_debug_line = 568;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cstrong class=\"word-meaning-word\"\u003E";
;pug_debug_line = 568;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "-\u003C\u002Fstrong\u003E";
;pug_debug_line = 569;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cspan class=\"word-meaning-definition\"\u003E";
;pug_debug_line = 569;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "낱말을 입력하면 뜻이 표시됩니다.\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 570;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"chain\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 571;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"rounds\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 572;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"history-holder\"\u003E";
;pug_debug_line = 573;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"history\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 574;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-body\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 575;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"game-input\"\u003E";
;pug_debug_line = 576;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput" + (" id=\"game-input\""+pug_attr("placeholder", L('yourTurn')+' '+L('inputChat'), true, true)+pug_attr("readonly", true, true, true)+" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"none\" spellcheck=\"false\" inputmode=\"text\" aria-autocomplete=\"none\"") + "\u003E\u003C\u002Fdiv\u003E";
}
}, 'Game');
;pug_debug_line = 577;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 578;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"moremi my-image\"\u003E";
;pug_debug_line = 579;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cimg class=\"moremies moremi-body\" src=\"\u002Fimg\u002Fcustom\u002Fmoremi-yellow.png?v=20260907-face-4\" data-moremi-base=\"\u002Fimg\u002Fcustom\u002Fmoremi-yellow.png?v=20260907-face-4\" alt=\"모레미\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 580;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"my-stat\"\u003E";
;pug_debug_line = 581;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"jt-image my-stat-level\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 582;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"my-stat-name ellipse\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 583;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"my-stat-record\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 584;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"my-stat-ping\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 585;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv\u003E";
;pug_debug_line = 586;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('my-okg');
;pug_debug_line = 587;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bar-text my-okg-text\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 588;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Expl"].call({
block: function(){
;pug_debug_line = 589;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv style=\"color: #CCCCCC;\"\u003E";
;pug_debug_line = 589;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('okgExpl')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
}
}, true);
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 590;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"my-level\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 591;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["GraphBar"]('my-gauge');
;pug_debug_line = 592;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bar-text my-gauge-text\"\u003E\u003C\u002Fdiv\u003E";
}
}, 'Me');
;pug_debug_line = 593;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"].call({
block: function(){
;pug_debug_line = 594;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv id=\"Chat\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 595;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cinput id=\"Talk\"\u003E";
;pug_debug_line = 596;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cbutton id=\"ChatBtn\"\u003E";
;pug_debug_line = 596;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('send')) ? "" : pug_interp)) + "\u003C\u002Fbutton\u003E";
}
}, 'Chat');
;pug_debug_line = 597;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_mixins["Product"]('AD');
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 85;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv id=\"Bottom\"\u003E";
;pug_debug_line = 86;pug_debug_filename = "Web\\views\\layout.pug";
;pug_debug_line = 600;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 600;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('dictionarySupport')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 601;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 601;pug_debug_filename = "Web\u002Fviews\u002Fkkutu.pug";
pug_html = pug_html + (null == (pug_interp = L('etcSupport')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 87;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 88;pug_debug_filename = "Web\\views\\layout.pug";
if (locals.as_pc) {
;pug_debug_line = 89;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Ca href=\"?\"\u003E";
;pug_debug_line = 89;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = L('AS_MOBILE')) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
}
;pug_debug_line = 90;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cbr\u003E";
;pug_debug_line = 91;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Ca class=\"bottom-contact\" href=\"https:\u002F\u002Fdiscord.gg\u002FexfaWJDjU\" target=\"_blank\" rel=\"noopener noreferrer\"\u003E";
;pug_debug_line = 91;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "문의: 디스코드 서버\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 92;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + "\u003Cdiv class=\"bottom-legal\"\u003E";
;pug_debug_line = 92;pug_debug_filename = "Web\\views\\layout.pug";
pug_html = pug_html + (null == (pug_interp = L('GPL')) ? "" : pug_interp) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 93;pug_debug_filename = "Web\\views\\layout.pug";
pug_mixins["separator"](10);
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";}.call(this,"ADMIN" in locals_for_with?locals_for_with.ADMIN:typeof ADMIN!=="undefined"?ADMIN:undefined,"Date" in locals_for_with?locals_for_with.Date:typeof Date!=="undefined"?Date:undefined,"JSON" in locals_for_with?locals_for_with.JSON:typeof JSON!=="undefined"?JSON:undefined,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"Number" in locals_for_with?locals_for_with.Number:typeof Number!=="undefined"?Number:undefined,"RegExp" in locals_for_with?locals_for_with.RegExp:typeof RegExp!=="undefined"?RegExp:undefined,"i" in locals_for_with?locals_for_with.i:typeof i!=="undefined"?i:undefined,"j" in locals_for_with?locals_for_with.j:typeof j!=="undefined"?j:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}