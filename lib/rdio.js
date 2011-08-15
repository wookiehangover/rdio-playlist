var OAuth = require('oauth').OAuth;

var Rdio = function(){
  this.url_base = 'http://api.rdio.com';
  this.VERSION  = '1';
  this.initialize.apply(this, arguments);
};

Rdio.prototype.initialize = function( api_key, api_secret, callback_url ){
  if( /undefined/.test( typeof api_key + typeof api_secret ) ){
    throw new Error('You must have an API key and secret');
  }

  this._key    = api_key;
  this._secret = api_secret;

  this.oauth = new OAuth(
      this.url_base +'/oauth/request_token'
    , this.url_base +'/oauth/access_token'
    , api_key
    , api_secret
    , this.VERSION
    , callback_url
    , 'HMAC-SHA1' // signature method
  );

  return this;
};

Rdio.prototype.getRequestToken = function( callback ){
  this.oauth.getOAuthRequestToken({}, callback);
};

Rdio.prototype.getAccessToken = function( token, secret, pin, callback ){
  this.oauth.getOAuthAccessToken( token, secret, pin, callback);
};

Rdio.prototype.api = function( token, secret, data, callback ){
  this.oauth.post(
      this.url_base +'/1/'
    , token
    , secret
    , data
    , null
    , callback
  );
};

module.exports = Rdio;

