'use strict';

require('dotenv').load();
var loopback = require('loopback');
var boot = require('loopback-boot');

var cors = require('cors')
var app = module.exports = loopback();

app.options('*', cors());
var bodyParser = require('body-parser');

app.middleware('parse', bodyParser.json());
app.middleware('parse', bodyParser.urlencoded({extended: true}));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
