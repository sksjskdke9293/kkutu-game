const config = require('../../sub/auth.json');

module.exports.config = {
    strategy: require('passport-kakao').Strategy,
    color: '#FFDE00',
    fontColor: '#3C1E1E',
    vendor: 'kakao',
    displayName: 'withKakao'
}

module.exports.strategyConfig = {
    clientID: config.kakao.clientID, // 보안을 위해서입니다.
	clientSecret: config.kakao.clientSecret || undefined,
    callbackURL: config.kakao.callbackURL,  // 이 방법을 사용하는 것을
    passReqToCallback: true,  // 적극 권장합니다.
	scope: [ "profile_nickname", "profile_image" ]
}

module.exports.strategy = (process, MainDB, Ajae) => {
    return (req, accessToken, refreshToken, profile, done) => {
        const $p = {};

        $p.authType = "kakao";
        $p.id = 'kakao-' + profile.id.toString();
        $p.name = profile.username;
        $p.title = profile.displayName;
		const properties = profile._json && profile._json.properties || {};
		$p.image = properties.profile_image || properties.thumbnail_image || '/img/kkutu/guest.png';

        process(req, accessToken, MainDB, $p, done);
    }
}
