/**
 * Module dependencies
 */


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socket = require('./app/socket');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var route = require('./app/route');
var routeAPI = require('./app/route_api');
var log4js = require('log4js');
var logger = log4js.getLogger();

//var demoRoute = require('./routes/demo/index');

var port = process.env.PORT || 8080;


/**
 * setting
 */
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').renderFile);

/**
 * middleware
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//app.use(log4js.connectLogger(logger.getLogger('access'), {
//    level: log4js.levels.info,
//    format: ':remote-addr ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent" :response-time',
//    nolog: /\/(\d+\/)?(js|css|img|fonts|lib)/
//}));

app.all('*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    next();
});

/**
 * routes
 */
route.route(app);
routeAPI.route(app);

/**
 * error
 */

app.use(function (req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        error: err
    });
});


/**
 * server
 */
server.listen(port, function () {
    logger.info('Server unit ' + process.pid + ' listening on port ' + port);
});

