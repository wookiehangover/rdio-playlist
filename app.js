/**
 * Module dependencies.
 */

var express     = require('express')
  , app         = module.exports = express.createServer()
  , Rdio        = require('./lib/rdio')
  , RedisStore  = require('connect-redis')(express)
  , url         = require('url');

var redis_options = {},
    redis_url;

if( process.env.REDISTOGO_URL ){
  redis_url = url.parse(process.env.REDISTOGO_URL);

  redis_options = {
      host: redis_url.hostname
    , port: redis_url.port
    , db:   redis_url.auth.split(':')[0]
    , pass: redis_url.auth.split(':')[1]
  };
}

var session_store = new RedisStore( redis_options );

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hotdogs are delicious', store: session_store }));
  app.use(app.router);
  app.use(express['static'](__dirname + '/public'));
});

var url_base;

app.configure('development', function(){
  url_base = 'http://batman.local:3000';
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  url_base = 'http://listless.herokuapp.com';
  app.use(express.errorHandler()); 
});

var rdio = new Rdio(
    process.env.API_KEY
  , process.env.API_SECRET
  , url_base +'/oauth/callback'
);

// Routes

app.get('/api/:method', function(req, res){
  if( req.session.oauth_access_token && req.session.oauth_access_token_secret ){
    var parsed_url = url.parse(req.url, true)
      , options = parsed_url.query;

    options.method = req.params.method;

    rdio.api(
        req.session.oauth_access_token
      , req.session.oauth_access_token_secret
      , options
      , function( err, data, response ){
        res.contentType('application/json');
        res.send( JSON.parse( data ).result );
      }
    );

  } else {
    res.render('login', { layout: 'login_layout' });
  }
});

app.get('/login', function(req, res){
  rdio.getRequestToken(function(err, token, token_secret, results){
    req.session.secret = token_secret;
    res.redirect(results.login_url +'?oauth_token='+ token);
  });
});

app.get ('/oauth/callback', function(req, res, params) {
  var parsedUrl = url.parse(req.url, true);

  rdio.getAccessToken( parsedUrl.query.oauth_token, req.session.secret, parsedUrl.query.oauth_verifier,
    function(error, oauth_access_token, oauth_access_token_secret, results) {
      req.session.oauth_access_token = oauth_access_token;
      req.session.oauth_access_token_secret = oauth_access_token_secret;
      res.redirect("/");
    }
  );
});

app.get('/', function(req, res){
  if( req.session.oauth_access_token && req.session.oauth_access_token_secret ){
    res.render('index');
  } else {
    res.render('login', { layout: 'login_layout.jade' });
  }
});

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

