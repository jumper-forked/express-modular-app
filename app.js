
/**
 * Module dependencies.
 */

var express = require('express');
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

// all environments
app.require = function(name) {
    return require(path.join(__dirname, name));
};

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(require('./tfinder').renderOverride);
app.use(app.router);

app.use(require('less-middleware')({
        src: __dirname + '/less',
        dest: __dirname + '/public/css',
        prefix: '/static/css',
        compress: true}));
app.use('/static', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var modules = [
    'tfinder',
    'users',
    'blog'];

for (var i = 0; i < modules.length; i++) {
    try {
        var module = require('./' + modules[i]);

        if (module.init) {
            module.init(app);
        }

        if (module.templates) {
            app.addTemplatesPath(path.join(modules[i], module.templates))
        }
    } catch(e) {}
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
