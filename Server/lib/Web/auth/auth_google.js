const config = require('../../sub/auth.json');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// passport-google-oauth2 0.1.x still requests the removed Google+ People API.
// Keep the existing OAuth flow, but read the standard OpenID Connect profile.
GoogleStrategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get('https://openidconnect.googleapis.com/v1/userinfo', accessToken, function(error, body) {
        if(error) return done(error);
        try {
            const json = JSON.parse(body);
            if(!json.sub) return done(new Error('Google userinfo response has no subject identifier.'));
            done(null, {
                provider: 'google',
                id: json.sub,
                displayName: json.name || json.email || 'Google 사용자',
                name: {
                    familyName: json.family_name || '',
                    givenName: json.given_name || json.name || json.email || 'Google 사용자'
                },
                emails: json.email ? [{ value: json.email, type: 'account' }] : [],
                photos: json.picture ? [{ value: json.picture }] : [],
                _raw: body,
                _json: json
            });
        } catch(parseError) {
            done(parseError);
        }
    });
};

module.exports.config = {
    strategy: GoogleStrategy,
    color: '#FFFFFF',
    fontColor: '#000000',
    vendor: 'google',
    displayName: 'withGoogle'
}

module.exports.strategyConfig = {
    clientID: config.google.clientID, // 보안을 위해서입니다.
    clientSecret: config.google.clientSecret, // 이 방법을 사용하는 것을
    callbackURL: config.google.callbackURL, // 적극 권장합니다.
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    passReqToCallback: true,
    scope: ['openid', 'profile', 'email']
}

module.exports.strategy = (process, MainDB, Ajae) => {
    return (req, accessToken, refreshToken, profile, done) => {
        const $p = {};

        $p.authType = "google";
        $p.id = 'google-' + profile.id;
        $p.name = profile.displayName || ((profile.name.familyName ? profile.name.familyName + ' ' : '') + profile.name.givenName).trim() || 'Google 사용자';
        $p.title = $p.name;
        $p.image = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

        process(req, accessToken, MainDB, $p, done);
    }
}
